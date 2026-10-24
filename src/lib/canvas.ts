export type Pt = { x: number; y: number } | null;

export type Surface = { ctx: CanvasRenderingContext2D; w: number; h: number };

export function rgba(hex: string, a: number) {
  const n = parseInt(hex.slice(1), 16);
  return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

export function noise(x: number, y: number) {
  const ix = Math.floor(x),
    iy = Math.floor(y);
  let fx = x - ix,
    fy = y - iy;
  fx = fx * fx * (3 - 2 * fx);
  fy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy),
    b = hash(ix + 1, iy),
    c = hash(ix, iy + 1),
    d = hash(ix + 1, iy + 1);
  return a + (b - a) * fx + (c - a) * fy + (a - b - c + d) * fx * fy;
}

/** Canvas auf Elementgröße bringen, DevicePixelRatio auf 2 begrenzt. */
export function fit(cv: HTMLCanvasElement): Surface {
  const r = cv.getBoundingClientRect(),
    d = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = Math.max(1, r.width * d);
  cv.height = Math.max(1, r.height * d);
  const ctx = cv.getContext("2d")!;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  return { ctx, w: r.width, h: r.height };
}

export function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Startet fn, sobald der Browser nach dem Laden Luft hat. Gibt eine Abbruchfunktion zurück. */
export function whenIdle(fn: () => void): () => void {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(fn, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  const id = setTimeout(fn, 200);
  return () => clearTimeout(id);
}
