export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start, end, alpha) {
  return start + (end - start) * alpha;
}

export function smoothStep(edge0, edge1, value) {
  const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return x * x * (3 - 2 * x);
}

export function createNoise2D(seed = 1) {
  return (x, y) => {
    const value = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453123;
    return value - Math.floor(value);
  };
}

export function flowField(x, y, time, noise2D) {
  const angle =
    noise2D(x * 0.0019 + time * 0.000035, y * 0.0034 - time * 0.00002) * Math.PI * 2.8;

  return {
    x: Math.cos(angle),
    y: Math.sin(angle) * 0.55,
  };
}

export function bandProfile(normalizedX, normalizedY, anchors) {
  let density = 0;

  for (const anchor of anchors) {
    const waveY =
      anchor.centerY +
      Math.sin(normalizedX * anchor.frequency + anchor.phase) * anchor.amplitude +
      Math.sin(normalizedX * (anchor.frequency * 0.45) + anchor.phase * 0.35) *
        (anchor.amplitude * 0.35);

    const distance = Math.abs(normalizedY - waveY);
    density = Math.max(density, Math.exp(-(distance * distance) / anchor.softness));
  }

  return density;
}
