import { useEffect, useRef } from "react";
import { clamp, lerp } from "@/utils/particleMath";

const MAX_PLUMES = 10;
const MAX_STIRRERS = 8;
const STRIDE = 4;

const BASE_CONFIG = {
  desktop: {
    particleCount: 50000,
    radius: 250,
    pullStrength: 0.22,
    drift: 0.16,
  },
  tablet: {
    particleCount: 28000,
    radius: 190,
    pullStrength: 0.15,
    drift: 0.12,
  },
  mobile: {
    particleCount: 16000,
    radius: 0,
    pullStrength: 0,
    drift: 0.08,
  },
};

function getTier(width) {
  if (width >= 1024) {
    return "desktop";
  }

  if (width >= 768) {
    return "tablet";
  }

  return "mobile";
}

function normalize(vec) {
  const length = Math.hypot(vec.x, vec.y) || 1;
  return {
    x: vec.x / length,
    y: vec.y / length,
  };
}

function cubicPoint(p0, p1, p2, p3, t) {
  const mt = 1 - t;
  const mt2 = mt * mt;
  const t2 = t * t;

  return {
    x: mt2 * mt * p0.x + 3 * mt2 * t * p1.x + 3 * mt * t2 * p2.x + t2 * t * p3.x,
    y: mt2 * mt * p0.y + 3 * mt2 * t * p1.y + 3 * mt * t2 * p2.y + t2 * t * p3.y,
  };
}

function cubicTangent(p0, p1, p2, p3, t) {
  const mt = 1 - t;

  return {
    x:
      3 * mt * mt * (p1.x - p0.x) +
      6 * mt * t * (p2.x - p1.x) +
      3 * t * t * (p3.x - p2.x),
    y:
      3 * mt * mt * (p1.y - p0.y) +
      6 * mt * t * (p2.y - p1.y) +
      3 * t * t * (p3.y - p2.y),
  };
}

function createPlume(width, height) {
  const edge = Math.floor(Math.random() * 4);
  const p0 =
    edge === 0
      ? { x: -width * 0.08, y: height * (0.08 + Math.random() * 0.84) }
      : edge === 1
        ? { x: width * (1.02 + Math.random() * 0.08), y: height * (0.08 + Math.random() * 0.84) }
        : edge === 2
          ? { x: width * (0.06 + Math.random() * 0.88), y: -height * 0.08 }
          : { x: width * (0.06 + Math.random() * 0.88), y: height * 1.08 };

  const p3 = {
    x: width * (0.04 + Math.random() * 0.92),
    y: height * (0.04 + Math.random() * 0.92),
  };

  const dir = normalize({ x: p3.x - p0.x, y: p3.y - p0.y });
  const normal = { x: -dir.y, y: dir.x };
  const bendA = (Math.random() - 0.5) * width * 0.66;
  const bendB = (Math.random() - 0.5) * width * 0.6;

  const p1 = {
    x: lerp(p0.x, p3.x, 0.24) + normal.x * bendA,
    y: lerp(p0.y, p3.y, 0.24) + normal.y * bendA,
  };
  const p2 = {
    x: lerp(p0.x, p3.x, 0.76) + normal.x * bendB,
    y: lerp(p0.y, p3.y, 0.76) + normal.y * bendB,
  };

  return {
    p0,
    p1,
    p2,
    p3,
    bodyWidth: width * (0.07 + Math.random() * 0.08),
    phase: Math.random() * Math.PI * 2,
    gain: 0.82 + Math.random() * 0.26,
  };
}

function createShapeProfile(width, height) {
  const plumeCount = 15 + Math.floor(Math.random() * 1);

  return {
    plumes: Array.from({ length: plumeCount }, () => createPlume(width, height)),
    stirrers: Array.from({ length: 5 + Math.floor(Math.random() * 3) }, () => ({
      plumeIndex: Math.floor(Math.random() * plumeCount),
      t: Math.random(),
      speed: 0.2 + Math.random() * 0.18,
      radius: width * (0.12 + Math.random() * 0.06),
      strength: 0.18 + Math.random() * 0.08,
      direction: Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
    })),
  };
}

function createParticleData(width, height, config, reducedMotion, shapeProfile) {
  const densityScale = clamp((width * height) / 1080000, 0.82, 1.32);
  const total = Math.round(config.particleCount * densityScale * (reducedMotion ? 0.65 : 1));

  const state = new Float32Array(total * STRIDE);
  const render = new Float32Array(total * STRIDE);
  const meta = new Float32Array(total * 8);
  let created = 0;
  let attempts = 0;

  while (created < total && attempts < total * 8) {
    attempts += 1;
    const plumeIndex = Math.floor(Math.random() * shapeProfile.plumes.length);
    const plume = shapeProfile.plumes[plumeIndex];
    const t = Math.pow(Math.random(), 0.72);
    const tangent = normalize(cubicTangent(plume.p0, plume.p1, plume.p2, plume.p3, t));
    const normal = { x: -tangent.y, y: tangent.x };
    const point = cubicPoint(plume.p0, plume.p1, plume.p2, plume.p3, t);
    const widthAtT = plume.bodyWidth * (0.6 + Math.sin(t * Math.PI) * 1.26);
    const scatter = (Math.random() - 0.5) * widthAtT * (1.0 + Math.random() * 1.18);
    const along = (Math.random() - 0.5) * widthAtT * 0.46;
    const x = point.x + normal.x * scatter + tangent.x * along;
    const y = point.y + normal.y * scatter + tangent.y * along;

    if (x < -width * 0.12 || x > width * 1.12 || y < -height * 0.12 || y > height * 1.12) {
      continue;
    }

    const density = (1 - Math.min(Math.abs(scatter) / Math.max(widthAtT, 1), 1)) * plume.gain;
    const size = 1.16 + density * 1.78 + Math.random() * 0.58;
    const alpha = 0.042 + density * 0.062 + Math.random() * 0.014;

    const stateOffset = created * STRIDE;
    state[stateOffset] = x;
    state[stateOffset + 1] = y;
    state[stateOffset + 2] = 0;
    state[stateOffset + 3] = 0;

    const renderOffset = created * STRIDE;
    render[renderOffset] = x;
    render[renderOffset + 1] = y;
    render[renderOffset + 2] = size;
    render[renderOffset + 3] = alpha;

    const metaOffset = created * 8;
    meta[metaOffset] = plumeIndex;
    meta[metaOffset + 1] = t;
    meta[metaOffset + 2] = scatter / Math.max(widthAtT, 1);
    meta[metaOffset + 3] = along / Math.max(widthAtT, 1);
    meta[metaOffset + 4] = density;
    meta[metaOffset + 5] = Math.random() * Math.PI * 2;
    meta[metaOffset + 6] = Math.random() * 1000;
    meta[metaOffset + 7] = 0.88 + Math.random() * 0.24;

    created += 1;
  }

  return {
    state,
    render,
    meta,
    count: created,
  };
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Shader compile error";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const program = gl.createProgram();
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Program link error";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

const vertexShaderSource = `
attribute vec2 a_position;
attribute float a_size;
attribute float a_alpha;

uniform vec2 u_resolution;
uniform float u_dpr;

varying float v_alpha;

void main() {
  vec2 clip = (a_position / u_resolution) * 2.0 - 1.0;
  gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
  gl_PointSize = max(1.0, a_size * u_dpr);
  v_alpha = a_alpha;
}
`;

const fragmentShaderSource = `
precision highp float;

varying float v_alpha;

void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float distance = length(uv) * 2.0;
  float glow = exp(-distance * distance * 0.56);
  float mask = smoothstep(1.18, 0.0, distance);
  gl_FragColor = vec4(vec3(0.97), v_alpha * glow * mask);
}
`;

export function StarDustBackgroundGL({
  className = "",
  particleMultiplier = 1,
  magnetRadius,
  magnetStrength,
  driftStrength = 1,
  reducedMotion = false,
}) {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(0);
  const rectRef = useRef({ left: 0, top: 0, width: 0, height: 0 });
  const pointerRef = useRef({
    active: false,
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
    trailX: 0,
    trailY: 0,
    velocityX: 0,
    velocityY: 0,
    lastMovedAt: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
    });

    if (!gl) {
      return undefined;
    }

    let width = 1;
    let height = 1;
    let ratio = 1;
    let config = BASE_CONFIG.desktop;
    let shapeProfile = createShapeProfile(1, 1);
    let count = 0;
    let renderData = null;
    let stateData = null;
    let metaData = null;
    let previousTime = 0;
    let buffer = null;

    const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const attribs = {
      position: gl.getAttribLocation(program, "a_position"),
      size: gl.getAttribLocation(program, "a_size"),
      alpha: gl.getAttribLocation(program, "a_alpha"),
    };

    const uniforms = {
      resolution: gl.getUniformLocation(program, "u_resolution"),
      dpr: gl.getUniformLocation(program, "u_dpr"),
    };

    const setAttributes = () => {
      const stride = STRIDE * 4;
      gl.enableVertexAttribArray(attribs.position);
      gl.vertexAttribPointer(attribs.position, 2, gl.FLOAT, false, stride, 0);
      gl.enableVertexAttribArray(attribs.size);
      gl.vertexAttribPointer(attribs.size, 1, gl.FLOAT, false, stride, 8);
      gl.enableVertexAttribArray(attribs.alpha);
      gl.vertexAttribPointer(attribs.alpha, 1, gl.FLOAT, false, stride, 12);
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      rectRef.current = rect;
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      config = BASE_CONFIG[getTier(width)];
      ratio = Math.min(window.devicePixelRatio || 1, 1.35);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);

      shapeProfile = createShapeProfile(width, height);
      const particles = createParticleData(
        width,
        height,
        {
          ...config,
          particleCount: Math.round(config.particleCount * particleMultiplier),
        },
        reducedMotion,
        shapeProfile,
      );

      count = particles.count;
      stateData = particles.state;
      renderData = particles.render;
      metaData = particles.meta;

      if (!buffer) {
        buffer = gl.createBuffer();
      }

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, renderData, gl.DYNAMIC_DRAW);
      setAttributes();
      gl.uniform2f(uniforms.resolution, width, height);
      gl.uniform1f(uniforms.dpr, ratio);
    };

    const updateSimulation = (time, deltaMs) => {
      const pointer = pointerRef.current;
      const activeRadius = magnetRadius ?? config.radius;
      const activeStrength = reducedMotion
        ? (magnetStrength ?? config.pullStrength) * 0.55
        : magnetStrength ?? config.pullStrength;
      const opacityRadius = activeRadius > 0 ? activeRadius * 2.6 : 0;
      const dt = Math.min(deltaMs / 16.666, 1.6);
      const timeSeconds = time * 0.001;

      const pointerDx = pointer.x - pointer.trailX;
      const pointerDy = pointer.y - pointer.trailY;
      const pointerLength = Math.hypot(pointerDx, pointerDy) || 1;
      const pointerDirX = pointerDx / pointerLength;
      const pointerDirY = pointerDy / pointerLength;

      for (let i = 0; i < count; i += 1) {
        const stateOffset = i * STRIDE;
        const metaOffset = i * 8;
        const plume = shapeProfile.plumes[metaData[metaOffset]];
        const baseT = metaData[metaOffset + 1];
        const lateral = metaData[metaOffset + 2];
        const along = metaData[metaOffset + 3];
        const density = metaData[metaOffset + 4];
        const phase = metaData[metaOffset + 5];
        const seed = metaData[metaOffset + 6];
        const sizeBase = metaData[metaOffset + 7];

        const flowT = clamp(baseT + Math.sin(timeSeconds * 0.42 + plume.phase + seed * 0.002) * 0.05, 0.02, 0.98);
        const point = cubicPoint(plume.p0, plume.p1, plume.p2, plume.p3, flowT);
        const tangent = normalize(cubicTangent(plume.p0, plume.p1, plume.p2, plume.p3, flowT));
        const normal = { x: -tangent.y, y: tangent.x };
        const widthAtT = plume.bodyWidth * (0.62 + Math.sin(flowT * Math.PI) * 1.24);

        let targetX =
          point.x +
          normal.x * lateral * widthAtT +
          tangent.x * along * widthAtT * 0.5 +
          tangent.x * Math.sin(timeSeconds * 0.74 + plume.phase + flowT * 5.1) * (20 + density * 18) +
          normal.x * Math.cos(timeSeconds * 0.62 + plume.phase * 1.1 + flowT * 3.8) * (16 + density * 12) +
          config.drift * driftStrength * timeSeconds * 28;

        let targetY =
          point.y +
          normal.y * lateral * widthAtT +
          tangent.y * along * widthAtT * 0.5 +
          tangent.y * Math.sin(timeSeconds * 0.74 + plume.phase + flowT * 5.1) * (20 + density * 18) +
          normal.y * Math.cos(timeSeconds * 0.62 + plume.phase * 1.1 + flowT * 3.8) * (16 + density * 12) +
          Math.sin(timeSeconds * 0.22 + plume.phase) * 8;

        for (const stirrer of shapeProfile.stirrers) {
          const stirPlume = shapeProfile.plumes[stirrer.plumeIndex];
          const stirT = (stirrer.t + timeSeconds * stirrer.speed * 0.18) % 1;
          const stirPoint = cubicPoint(stirPlume.p0, stirPlume.p1, stirPlume.p2, stirPlume.p3, stirT);
          const stirTangent = normalize(cubicTangent(stirPlume.p0, stirPlume.p1, stirPlume.p2, stirPlume.p3, stirT));
          const stirX = stirPoint.x + Math.sin(timeSeconds * 1.2 + stirrer.phase) * width * 0.018;
          const stirY = stirPoint.y + Math.cos(timeSeconds * 1.05 + stirrer.phase) * height * 0.014;
          const diffX = stirX - stateData[stateOffset];
          const diffY = stirY - stateData[stateOffset + 1];
          const distance = Math.hypot(diffX, diffY);

          if (distance < stirrer.radius) {
            const falloff = 1 - clamp(distance / stirrer.radius, 0, 1);
            const drag = falloff * falloff * stirrer.strength;
            targetX += stirTangent.x * drag * 64;
            targetY += stirTangent.y * drag * 64;
          }
        }

        if (pointer.active && activeRadius > 0 && activeStrength > 0) {
          const toX = stateData[stateOffset] - pointer.x;
          const toY = stateData[stateOffset + 1] - pointer.y;
          const behind = Math.max(-(toX * pointerDirX + toY * pointerDirY), 0);
          const lateral = Math.abs(toX * -pointerDirY + toY * pointerDirX);
          const wakeRadius = activeRadius * (0.24 + density * 0.08);
          const wakeFalloff = Math.exp(-Math.pow(lateral / Math.max(wakeRadius, 1), 2) * 1.8);
          const trailFalloff = Math.exp(-Math.pow(behind / Math.max(activeRadius * 1.8, 1), 2) * 0.48);
          const frontCut = 1 - clamp((toX * pointerDirX + toY * pointerDirY + activeRadius * 0.08) / (activeRadius * 0.2), 0, 1);
          const wake = wakeFalloff * trailFalloff * frontCut;

          if (wake > 0.001) {
            targetX += pointerDirX * wake * activeStrength * 420;
            targetY += pointerDirY * wake * activeStrength * 420;
          }
        }

        const currentX = stateData[stateOffset];
        const currentY = stateData[stateOffset + 1];
        let velocityX = stateData[stateOffset + 2];
        let velocityY = stateData[stateOffset + 3];

        velocityX = lerp(velocityX, targetX - currentX, 0.055 * dt);
        velocityY = lerp(velocityY, targetY - currentY, 0.055 * dt);
        velocityX *= 0.968;
        velocityY *= 0.968;

        const nextX = currentX + velocityX * 0.12 * dt;
        const nextY = currentY + velocityY * 0.12 * dt;

        stateData[stateOffset] = nextX;
        stateData[stateOffset + 1] = nextY;
        stateData[stateOffset + 2] = velocityX;
        stateData[stateOffset + 3] = velocityY;

        const renderOffset = i * STRIDE;
        renderData[renderOffset] = nextX;
        renderData[renderOffset + 1] = nextY;
        renderData[renderOffset + 2] = sizeBase * (2.24 + density * 1.08);
        let opacityBoost = 0.6;
        if (pointer.active && opacityRadius > 0) {
          const pointerDistance = Math.hypot(nextX - pointer.x, nextY - pointer.y);
          if (pointerDistance < opacityRadius) {
            const normalized = 1 - clamp(pointerDistance / opacityRadius, 0, 1);
            const boost = normalized * normalized * (3 - 2 * normalized);
            opacityBoost = lerp(0.6, 1, boost);
          }
        }
        renderData[renderOffset + 3] =
          (0.068 + density * 0.074) *
          (0.94 + 0.06 * Math.sin(timeSeconds * 0.14 + nextX * 0.0012 + nextY * 0.0009 + phase)) *
          opacityBoost;
      }
    };

    const render = (now) => {
      const pointer = pointerRef.current;
      const smoothing = now - pointer.lastMovedAt > 120 ? 0.08 : 0.24;
      pointer.x = lerp(pointer.x, pointer.targetX, smoothing);
      pointer.y = lerp(pointer.y, pointer.targetY, smoothing);
      pointer.trailX = lerp(pointer.trailX, pointer.x, 0.022);
      pointer.trailY = lerp(pointer.trailY, pointer.y, 0.022);
      pointer.velocityX = lerp(pointer.velocityX, pointer.x - pointer.trailX, 0.22);
      pointer.velocityY = lerp(pointer.velocityY, pointer.y - pointer.trailY, 0.22);

      const deltaMs = previousTime ? now - previousTime : 16.666;
      previousTime = now;

      updateSimulation(now, deltaMs);

      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferSubData(gl.ARRAY_BUFFER, 0, renderData);

      gl.clearColor(0.03, 0.035, 0.045, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.POINTS, 0, count);

      animationFrameRef.current = window.requestAnimationFrame(render);
    };

    const handlePointerMove = (event) => {
      const rect = rectRef.current;
      const localX = event.clientX - rect.left;
      const localY = event.clientY - rect.top;
      const inside = localX >= 0 && localY >= 0 && localX <= rect.width && localY <= rect.height;

      pointerRef.current.active = inside;
      pointerRef.current.targetX = localX;
      pointerRef.current.targetY = localY;
      pointerRef.current.lastMovedAt = performance.now();
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.velocityX = 0;
      pointerRef.current.velocityY = 0;
    };

    resize();
    animationFrameRef.current = window.requestAnimationFrame(render);

    window.addEventListener("resize", resize);
    window.addEventListener("scroll", resize, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", resize);
      window.removeEventListener("pointermove", handlePointerMove, { capture: true });
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      if (buffer) {
        gl.deleteBuffer(buffer);
      }
      gl.deleteProgram(program);
    };
  }, [driftStrength, magnetRadius, magnetStrength, particleMultiplier, reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
