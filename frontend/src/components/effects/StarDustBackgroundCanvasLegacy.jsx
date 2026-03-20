import { useEffect, useRef } from "react";
import { clamp, createNoise2D, lerp, smoothStep } from "@/utils/particleMath";

const BASE_CONFIG = {
  desktop: {
    particleCount: 90000,
    speckCount: 3200,
    radius: 260,
    pullStrength: 0.42,
    drift: 0.14,
    fogScale: 0.5,
    blur: 1.7,
  },
  tablet: {
    particleCount: 62000,
    speckCount: 2500,
    radius: 190,
    pullStrength: 0.28,
    drift: 0.1,
    fogScale: 0.46,
    blur: 1.45,
  },
  mobile: {
    particleCount: 18000,
    speckCount: 800,
    radius: 0,
    pullStrength: 0,
    drift: 0.06,
    fogScale: 0.42,
    blur: 1.15,
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

function normalize(vec) {
  const length = Math.hypot(vec.x, vec.y) || 1;
  return {
    x: vec.x / length,
    y: vec.y / length,
  };
}

function createPlume(width, height) {
  const edge = Math.floor(Math.random() * 4);
  const p0 =
    edge === 0
      ? { x: -width * 0.08, y: height * (0.12 + Math.random() * 0.76) }
      : edge === 1
        ? { x: width * (1.02 + Math.random() * 0.08), y: height * (0.12 + Math.random() * 0.76) }
        : edge === 2
          ? { x: width * (0.08 + Math.random() * 0.84), y: -height * 0.08 }
          : { x: width * (0.08 + Math.random() * 0.84), y: height * 1.08 };

  const p3 = {
    x: width * (0.03 + Math.random() * 0.94),
    y: height * (0.03 + Math.random() * 0.94),
  };

  const dir = normalize({ x: p3.x - p0.x, y: p3.y - p0.y });
  const normal = { x: -dir.y, y: dir.x };
  const bendA = (Math.random() - 0.5) * width * 0.72;
  const bendB = (Math.random() - 0.5) * width * 0.64;

  const p1 = {
    x: lerp(p0.x, p3.x, 0.28) + normal.x * bendA,
    y: lerp(p0.y, p3.y, 0.28) + normal.y * bendA,
  };
  const p2 = {
    x: lerp(p0.x, p3.x, 0.72) + normal.x * bendB,
    y: lerp(p0.y, p3.y, 0.72) + normal.y * bendB,
  };

  const tipT = 0.86 + Math.random() * 0.08;
  const tipPoint = cubicPoint(p0, p1, p2, p3, tipT);
  const tipTangent = normalize(cubicTangent(p0, p1, p2, p3, tipT));
  const tipNormal = { x: -tipTangent.y, y: tipTangent.x };
  const curlCenter = {
    x: tipPoint.x + tipNormal.x * width * (0.03 + Math.random() * 0.05),
    y: tipPoint.y + tipNormal.y * width * (0.03 + Math.random() * 0.05),
  };

  return {
    p0,
    p1,
    p2,
    p3,
    tipT,
    curlCenter,
    curlRadius: width * (0.03 + Math.random() * 0.03),
    curlStrength: 0.22 + Math.random() * 0.24,
    bodyWidth: width * (0.065 + Math.random() * 0.06),
    gain: 0.82 + Math.random() * 0.42,
  };
}

function createShapeProfile(width, height) {
  const plumeCount = 7 + Math.floor(Math.random() * 4);
  return {
    plumes: Array.from({ length: plumeCount }, () => createPlume(width, height)),
    ghostStirrers: Array.from({ length: 5 + Math.floor(Math.random() * 4) }, () => ({
      plumeIndex: Math.floor(Math.random() * plumeCount),
      t: Math.random(),
      speed: 0.18 + Math.random() * 0.16,
      radius: width * (0.09 + Math.random() * 0.06),
      strength: 0.26 + Math.random() * 0.12,
      direction: Math.random() > 0.5 ? 1 : -1,
      phase: Math.random() * Math.PI * 2,
    })),
  };
}

function ghostInfluence(pointX, pointY, item, shapeProfile, width, height, time) {
  let offsetX = 0;
  let offsetY = 0;
  let influence = 0;

  for (const stirrer of shapeProfile.ghostStirrers) {
    const plume = shapeProfile.plumes[stirrer.plumeIndex];
    const ghostT = (stirrer.t + time * 0.00006 * stirrer.speed) % 1;
    const ghostPoint = cubicPoint(plume.p0, plume.p1, plume.p2, plume.p3, ghostT);
    const wobble = Math.sin(time * 0.0022 + stirrer.phase) * width * 0.012;
    const gx = ghostPoint.x + wobble;
    const gy = ghostPoint.y + Math.cos(time * 0.0019 + stirrer.phase * 0.7) * height * 0.01;
    const dx = gx - pointX;
    const dy = gy - pointY;
    const distance = Math.hypot(dx, dy);

    if (distance >= stirrer.radius) {
      continue;
    }

    const falloff = 1 - smoothStep(0, stirrer.radius, distance);
    const tangentX = (-dy / Math.max(distance, 1)) * stirrer.direction;
    const tangentY = (dx / Math.max(distance, 1)) * stirrer.direction;
    const stir = falloff * falloff * stirrer.strength * item.magnetism;

    const ghostPlume = shapeProfile.plumes[stirrer.plumeIndex];
    const tangent = normalize(cubicTangent(ghostPlume.p0, ghostPlume.p1, ghostPlume.p2, ghostPlume.p3, ghostT));

    offsetX += dx * stir * 0.2 + tangent.x * stir * 118 + tangentX * stir * 18;
    offsetY += dy * stir * 0.08 + tangent.y * stir * 118 + tangentY * stir * 12;
    influence = Math.max(influence, falloff);
  }

  return { x: offsetX, y: offsetY, influence };
}

function dissolveField(nx, ny, time, noise2D) {
  const field = noise2D(nx * 1.7 + time * 0.08, ny * 1.5 - time * 0.06);
  return 0.24 + 0.76 * (0.5 + 0.5 * Math.sin(time * 0.92 + nx * 2.6 + ny * 2.1 + field * Math.PI * 2));
}

function buildParticles(width, height, config, reducedMotion, shapeProfile) {
  const particles = [];
  const specks = [];
  const densityScale = clamp((width * height) / 1080000, 0.82, 1.38);
  const targetCount = Math.round(config.particleCount * densityScale * (reducedMotion ? 0.62 : 1));
  const targetSpecks = Math.round(config.speckCount * densityScale * (reducedMotion ? 0.64 : 1));

  while (particles.length < targetCount || specks.length < targetSpecks) {
    const plumeIndex = Math.floor(Math.random() * shapeProfile.plumes.length);
    const plume = shapeProfile.plumes[plumeIndex];
    const t = Math.pow(Math.random(), 0.72);
    const point = cubicPoint(plume.p0, plume.p1, plume.p2, plume.p3, t);
    const tangent = normalize(cubicTangent(plume.p0, plume.p1, plume.p2, plume.p3, t));
    const normal = { x: -tangent.y, y: tangent.x };
    const widthAtT = plume.bodyWidth * (0.55 + Math.sin(t * Math.PI) * 1.35);
    const scatter = (Math.random() - 0.5) * widthAtT * (0.8 + Math.random() * 1.2);
    const along = (Math.random() - 0.5) * widthAtT * 0.45;
    const x = point.x + normal.x * scatter + tangent.x * along;
    const y = point.y + normal.y * scatter + tangent.y * along;

    if (x < -width * 0.15 || x > width * 1.15 || y < -height * 0.15 || y > height * 1.15) {
      continue;
    }

    const core = (1 - Math.min(Math.abs(scatter) / Math.max(widthAtT, 1), 1)) * plume.gain;

    const common = {
      plumeIndex,
      pathT: t,
      lateralOffset: scatter / Math.max(widthAtT, 1),
      alongOffset: along / Math.max(widthAtT, 1),
      x,
      y,
      vx: 0,
      vy: 0,
      density: core,
      alpha: 0.016 + core * 0.15 + Math.random() * 0.02,
      brightness: 1.02 + core * 0.2 + Math.random() * 0.05,
      magnetism: 0.9 + core * 0.92,
      phase: Math.random() * Math.PI * 2,
      seed: Math.random() * 1000,
      driftBiasX: (Math.random() - 0.42) * (0.2 + core * 0.18),
      driftBiasY: (Math.random() - 0.5) * (0.08 + core * 0.05),
      curlBias: Math.random(),
    };

    if (particles.length < targetCount) {
      particles.push(common);
    }

    if (specks.length < targetSpecks && Math.random() < 0.04 + core * 0.05) {
      specks.push({
        ...common,
        size: 0.08 + Math.random() * 0.05,
        length: 0.12 + Math.random() * 0.08 + core * 0.04,
        alpha: 0.014 + core * 0.028 + Math.random() * 0.006,
      });
    }
  }

  return { particles, specks };
}

function plumeField(item, plume, width, height, time, noise2D, driftStrength, config) {
  const t = time * 0.001;
  const localT = clamp(item.pathT, 0.02, 0.98);
  const point = cubicPoint(plume.p0, plume.p1, plume.p2, plume.p3, localT);
  const tangent = normalize(cubicTangent(plume.p0, plume.p1, plume.p2, plume.p3, localT));
  const normal = { x: -tangent.y, y: tangent.x };
  const nx = item.x / width;
  const ny = item.y / height;
  const widthAtT = plume.bodyWidth * (0.9 + Math.sin(localT * Math.PI) * 2.2);
  const plumeSpread = widthAtT * (0.7 + item.density * 0.75);
  const crossX = normal.x * item.lateralOffset * plumeSpread;
  const crossY = normal.y * item.lateralOffset * plumeSpread;
  const alongX = tangent.x * item.alongOffset * plumeSpread * 0.6;
  const alongY = tangent.y * item.alongOffset * plumeSpread * 0.6;
  const smokeNoiseX = (noise2D(nx * 3.2 + item.seed, ny * 2.6) - 0.5) * (14 + item.density * 12);
  const smokeNoiseY = (noise2D(nx * 2.6, ny * 2.2 + item.seed) - 0.5) * (10 + item.density * 9);
  const bodyFlowX =
    tangent.x * (18 + item.density * 22) +
    normal.x * smokeNoiseX * 0.4 +
    config.drift * driftStrength * t * 4;
  const bodyFlowY =
    tangent.y * (18 + item.density * 22) +
    normal.y * smokeNoiseX * 0.28 +
    smokeNoiseY * 0.4 +
    Math.sin(item.phase) * (1.2 + item.density * 1.4);

  let targetX = point.x + crossX + alongX + normal.x * smokeNoiseX * 0.35;
  let targetY = point.y + crossY + alongY + normal.y * smokeNoiseX * 0.35;

  const tipDistance = Math.abs(localT - plume.tipT);
  if (tipDistance < 0.22) {
    const dx = targetX - plume.curlCenter.x;
    const dy = targetY - plume.curlCenter.y;
    const radius = Math.hypot(dx, dy);
    const tangentCurlX = radius > 0 ? -dy / radius : 0;
    const tangentCurlY = radius > 0 ? dx / radius : 0;
    const curlEnvelope = 1 - smoothStep(0, plume.curlRadius, radius);
    const curlPull = 1 - smoothStep(0, 0.22, tipDistance);
    const curl = curlEnvelope * curlPull * plume.curlStrength * (0.8 + item.curlBias * 0.5);

    targetX += tangentCurlX * curl * width * 0.02 - dx * curl * 0.08 + tangent.x * curl * width * 0.018;
    targetY += tangentCurlY * curl * width * 0.016 - dy * curl * 0.08 + tangent.y * curl * width * 0.018;
  }

  targetX += bodyFlowX * 0.22;
  targetY += bodyFlowY * 0.22;

  return { x: targetX, y: targetY };
}

export function StarDustBackgroundCanvasLegacy({
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
    lastMovedAt: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return undefined;
    }

    let width = 0;
    let height = 0;
    let ratio = 1;
    let config = BASE_CONFIG.desktop;
    let particles = [];
    let specks = [];
    let fogCanvas = null;
    let fogContext = null;
    let fogWidth = 0;
    let fogHeight = 0;
    let shapeProfile = createShapeProfile(1, 1);
    const noise2D = createNoise2D(41);

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      rectRef.current = rect;
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      config = BASE_CONFIG[getTier(width)];
      ratio = Math.min(window.devicePixelRatio || 1, 1.1);

      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.scale(ratio, ratio);

      fogCanvas = document.createElement("canvas");
      fogWidth = Math.max(260, Math.round(width * config.fogScale));
      fogHeight = Math.max(180, Math.round(height * config.fogScale));
      fogCanvas.width = fogWidth;
      fogCanvas.height = fogHeight;
      fogContext = fogCanvas.getContext("2d", { alpha: true });

      shapeProfile = createShapeProfile(width, height);

      const result = buildParticles(
        width,
        height,
        {
          ...config,
          particleCount: Math.round(config.particleCount * particleMultiplier),
          speckCount: Math.round(config.speckCount * particleMultiplier),
        },
        reducedMotion,
        shapeProfile,
      );

      particles = result.particles;
      specks = result.specks;
    };

    const drawBackdrop = () => {
      context.clearRect(0, 0, width, height);
      const backdrop = context.createLinearGradient(0, 0, 0, height);
      backdrop.addColorStop(0, "rgba(11, 12, 14, 0.998)");
      backdrop.addColorStop(0.5, "rgba(7, 8, 10, 0.998)");
      backdrop.addColorStop(1, "rgba(4, 5, 6, 1)");
      context.fillStyle = backdrop;
      context.fillRect(0, 0, width, height);
    };

    const applyStir = (item, targetX, targetY, activeRadius, activeStrength) => {
      const pointer = pointerRef.current;

      if (!pointer.active || activeRadius <= 0 || activeStrength <= 0) {
        return { x: targetX, y: targetY, influence: 0, cling: 0 };
      }

      const dx = pointer.x - targetX;
      const dy = pointer.y - targetY;
      const distance = Math.hypot(dx, dy);

      if (distance >= activeRadius) {
        return { x: targetX, y: targetY, influence: 0, cling: 0 };
      }

      const falloff = 1 - smoothStep(0, activeRadius, distance);
      const tangentX = -dy / Math.max(distance, 1);
      const tangentY = dx / Math.max(distance, 1);
      const stir = falloff * falloff * activeStrength * item.magnetism;
      const cling = Math.pow(falloff, 1.7);

      return {
        x: targetX + dx * stir * 1.1 + tangentX * stir * 58,
        y: targetY + dy * stir * 0.32 + tangentY * stir * 34,
        influence: falloff,
        cling,
      };
    };

    const drawFog = (time) => {
      if (!fogContext) {
        return;
      }

      fogContext.clearRect(0, 0, fogWidth, fogHeight);
      fogContext.globalCompositeOperation = "screen";
      fogContext.fillStyle = "rgba(0,0,0,0.06)";
      fogContext.fillRect(0, 0, fogWidth, fogHeight);
      const t = time * 0.001;
      const activeRadius = magnetRadius ?? config.radius;
      const activeStrength = reducedMotion
        ? (magnetStrength ?? config.pullStrength) * 0.48
        : magnetStrength ?? config.pullStrength;

      for (const particle of particles) {
        const plume = shapeProfile.plumes[particle.plumeIndex];
        const field = plumeField(particle, plume, width, height, time, noise2D, driftStrength, config);
        const ghost = ghostInfluence(field.x, field.y, particle, shapeProfile, width, height, time);
        const stirred = applyStir(
          particle,
          field.x + ghost.x,
          field.y + ghost.y,
          activeRadius,
          activeStrength,
        );

        particle.vx = lerp(
          particle.vx,
          stirred.x - particle.x,
          0.12 + stirred.cling * 0.22 + ghost.influence * 0.18,
        );
        particle.vy = lerp(
          particle.vy,
          stirred.y - particle.y,
          0.12 + stirred.cling * 0.22 + ghost.influence * 0.18,
        );
        particle.x += particle.vx * (0.12 + stirred.cling * 0.4 + ghost.influence * 0.28);
        particle.y += particle.vy * (0.12 + stirred.cling * 0.4 + ghost.influence * 0.28);

        const nx = particle.x / width;
        const ny = particle.y / height;
        const fogX = nx * fogWidth;
        const fogY = ny * fogHeight;
        const dissolve = dissolveField(nx, ny, t, noise2D);
        const bloom = 0.74 + 0.26 * Math.sin(t * 0.34 + nx * 2.3 + ny * 1.7);
        const alpha =
          particle.alpha * particle.brightness * dissolve * bloom +
          stirred.influence * 0.06 +
          ghost.influence * 0.045;
        const size = 0.28 + particle.density * 0.44;

        fogContext.fillStyle = `rgba(248, 248, 248, ${alpha})`;
        fogContext.fillRect(fogX, fogY, size, size);
      }

      fogContext.globalCompositeOperation = "source-over";

      context.save();
      context.globalCompositeOperation = "screen";
      context.imageSmoothingEnabled = true;
      context.filter = `blur(${config.blur}px) contrast(185%) brightness(128%)`;
      context.globalAlpha = reducedMotion ? 0.88 : 1;
      context.drawImage(fogCanvas, 0, 0, width, height);
      context.filter = "none";
      context.restore();
    };

    const drawSpecks = (time) => {
      const activeRadius = magnetRadius ?? config.radius;
      const activeStrength = reducedMotion
        ? (magnetStrength ?? config.pullStrength) * 0.48
        : magnetStrength ?? config.pullStrength;

      context.save();
      context.globalCompositeOperation = "screen";

      for (const speck of specks) {
        const plume = shapeProfile.plumes[speck.plumeIndex];
        const field = plumeField(speck, plume, width, height, time, noise2D, driftStrength, config);
        const ghost = ghostInfluence(field.x, field.y, speck, shapeProfile, width, height, time);
        const stirred = applyStir(
          speck,
          field.x + ghost.x,
          field.y + ghost.y,
          activeRadius,
          activeStrength,
        );

        speck.vx = lerp(
          speck.vx,
          stirred.x - speck.x,
          0.14 + stirred.cling * 0.24 + ghost.influence * 0.18,
        );
        speck.vy = lerp(
          speck.vy,
          stirred.y - speck.y,
          0.14 + stirred.cling * 0.24 + ghost.influence * 0.18,
        );
        speck.x += speck.vx * (0.14 + stirred.cling * 0.42 + ghost.influence * 0.28);
        speck.y += speck.vy * (0.14 + stirred.cling * 0.42 + ghost.influence * 0.28);

        const nx = speck.x / width;
        const ny = speck.y / height;
        const dissolve = dissolveField(nx, ny, time * 0.001 * 1.08, noise2D);
        context.fillStyle = `rgba(255,255,255,${speck.alpha * dissolve + stirred.influence * 0.028 + ghost.influence * 0.02})`;
        context.fillRect(speck.x, speck.y, speck.length, speck.size);
      }

      context.restore();
    };

    const animate = (time) => {
      const pointer = pointerRef.current;
      const idle = time - pointer.lastMovedAt > 120;
      const smoothing = idle ? 0.08 : 0.24;

      pointer.x = lerp(pointer.x, pointer.targetX, smoothing);
      pointer.y = lerp(pointer.y, pointer.targetY, smoothing);

      drawBackdrop();
      drawFog(time);
      drawSpecks(time);
      animationFrameRef.current = window.requestAnimationFrame(animate);
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
    };

    resizeCanvas();
    animationFrameRef.current = window.requestAnimationFrame(animate);

    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("scroll", resizeCanvas, { passive: true });
    window.addEventListener("pointermove", handlePointerMove, { passive: true, capture: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);

    return () => {
      window.cancelAnimationFrame(animationFrameRef.current);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("scroll", resizeCanvas);
      window.removeEventListener("pointermove", handlePointerMove, { capture: true });
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
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
