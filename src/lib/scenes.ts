import { noise, rgba, type Pt } from "./canvas";
import { C } from "./palette";

export type Scene = {
  init: (w: number, h: number) => void;
  draw: (c: CanvasRenderingContext2D, w: number, h: number, t: number, pt?: Pt) => void;
  /** nur jeden n-ten Frame zeichnen */
  every?: number;
};

export type SceneName = "think" | "build" | "create" | "topo" | "seed" | "ping";

type P2 = [number, number];

// Verstehen: Gedanken finden zueinander
function think(): Scene {
  type Particle = { k: number; ox: number; oy: number; x: number; y: number; sx: number; sy: number };
  let P: Particle[] = [],
    A: { x: number; y: number }[] = [],
    mode = 0,
    last = 0;
  return {
    init() {
      P = [];
      A = [
        { x: 0.3, y: 0.28 },
        { x: 0.72, y: 0.22 },
        { x: 0.6, y: 0.5 },
        { x: 0.25, y: 0.55 },
      ];
      for (let i = 0; i < 74; i++) {
        const k = i % 4,
          ang = Math.random() * 6.28,
          rad = Math.random() * 0.11;
        P.push({ k, ox: Math.cos(ang) * rad, oy: Math.sin(ang) * rad * 0.9, x: Math.random(), y: Math.random() * 0.7, sx: Math.random(), sy: Math.random() * 0.7 });
      }
    },
    draw(c, w, h, t, pt) {
      const col = C();
      if (t - last > 3600) {
        last = t;
        mode = 1 - mode;
        if (!mode)
          P.forEach((p) => {
            p.sx = Math.random();
            p.sy = 0.05 + Math.random() * 0.62;
          });
      }
      c.clearRect(0, 0, w, h);
      P.forEach((p) => {
        const a = A[p.k],
          tx = mode ? a.x + p.ox : p.sx,
          ty = mode ? a.y + p.oy : p.sy;
        p.x += (tx - p.x) * 0.035;
        p.y += (ty - p.y) * 0.035;
        if (pt) {
          const dx = pt.x - p.x * w,
            dy = pt.y - p.y * h,
            d = Math.hypot(dx, dy) || 1;
          if (d < 150) {
            const f = (1 - d / 150) * 0.9;
            p.x += ((dx / d) * f) / w;
            p.y += ((dy / d) * f) / h;
          }
        }
      });
      if (pt) {
        P.forEach((p) => {
          const d = Math.hypot(pt.x - p.x * w, pt.y - p.y * h);
          if (d < 150) {
            c.strokeStyle = rgba(col.copper, (1 - d / 150) * 0.7);
            c.lineWidth = 1;
            c.beginPath();
            c.moveTo(pt.x, pt.y);
            c.lineTo(p.x * w, p.y * h);
            c.stroke();
          }
        });
        c.fillStyle = col.copper;
        c.beginPath();
        c.arc(pt.x, pt.y, 3.5, 0, 6.28);
        c.fill();
      }
      c.lineWidth = 1;
      for (let i = 0; i < P.length; i++)
        for (let j = i + 1; j < P.length; j++) {
          const p = P[i],
            q = P[j],
            dx = (p.x - q.x) * w,
            dy = (p.y - q.y) * h,
            d = Math.hypot(dx, dy);
          if (d < 62) {
            c.strokeStyle = rgba(p.k === q.k ? col.aqua : col.petrol, (1 - d / 62) * 0.55);
            c.beginPath();
            c.moveTo(p.x * w, p.y * h);
            c.lineTo(q.x * w, q.y * h);
            c.stroke();
          }
        }
      P.forEach((p) => {
        c.fillStyle = rgba(col.bone, 0.85);
        c.beginPath();
        c.arc(p.x * w, p.y * h, 1.8, 0, 6.28);
        c.fill();
      });
      A.forEach((a, i) => {
        const r = 10 + 6 * Math.sin(t * 0.002 + i);
        c.strokeStyle = rgba(col.copper, mode ? 0.8 : 0.2);
        c.beginPath();
        c.arc(a.x * w, a.y * h, r, 0, 6.28);
        c.stroke();
        c.fillStyle = rgba(col.copper, mode ? 1 : 0.3);
        c.beginPath();
        c.arc(a.x * w, a.y * h, 2.6, 0, 6.28);
        c.fill();
      });
    },
  };
}

// Bauen: Struktur wächst Block für Block
function build(): Scene {
  return {
    init() {},
    draw(c, w, h, t, pt) {
      const col = C();
      c.clearRect(0, 0, w, h);
      const n = 6,
        s = Math.min(w, h) / (n * 1.9),
        cx = w / 2,
        cy = h * 0.2;
      for (let sum = 0; sum <= 2 * (n - 1); sum++)
        for (let i = 0; i < n; i++) {
          const j = sum - i;
          if (j < 0 || j >= n) continue;
          const px = cx + (i - j) * s * 0.9,
            py = cy + (i + j) * s * 0.52;
          const wave = Math.max(0, Math.sin(t * 0.0011 - (i + j) * 0.42));
          let boost = 0;
          if (pt) {
            const bd = Math.hypot(px - pt.x, py - pt.y);
            boost = Math.max(0, 1 - bd / (s * 3.2));
          }
          const ht = s * (0.25 + wave * 1.9 + boost * 2.6);
          const hx = s * 0.9,
            hy = s * 0.52;
          // linke Seite
          c.fillStyle = rgba(col.blockL, 0.95);
          c.beginPath();
          c.moveTo(px - hx, py);
          c.lineTo(px, py + hy);
          c.lineTo(px, py + hy - ht);
          c.lineTo(px - hx, py - ht);
          c.closePath();
          c.fill();
          // rechte Seite
          c.fillStyle = rgba(col.blockR, 0.95);
          c.beginPath();
          c.moveTo(px + hx, py);
          c.lineTo(px, py + hy);
          c.lineTo(px, py + hy - ht);
          c.lineTo(px + hx, py - ht);
          c.closePath();
          c.fill();
          // oben
          const hot = wave > 0.92 || boost > 0.55;
          c.fillStyle = hot ? rgba(col.copper, 0.95) : rgba(col.aqua, 0.18 + wave * 0.45);
          c.beginPath();
          c.moveTo(px, py - ht - hy);
          c.lineTo(px + hx, py - ht);
          c.lineTo(px, py - ht + hy);
          c.lineTo(px - hx, py - ht);
          c.closePath();
          c.fill();
          c.strokeStyle = rgba(col.aqua, 0.35);
          c.lineWidth = 0.8;
          c.stroke();
        }
    },
  };
}

// Gestalten: eine organische Form entsteht
function create(): Scene {
  return {
    init() {},
    draw(c, w, h, t, pt) {
      const col = C();
      c.clearRect(0, 0, w, h);
      const cx = w / 2,
        cy = h * 0.36,
        R = Math.min(w, h) * 0.34,
        ts = t * 0.001;
      let pa = 0,
        bul = 0;
      if (pt) {
        pa = Math.atan2(pt.y - cy, pt.x - cx);
        bul = 0.35 * Math.max(0, 1 - Math.hypot(pt.x - cx, pt.y - cy) / (R * 3));
      }
      for (let k = 0; k < 11; k++) {
        const rr = R * (1 - k * 0.083);
        c.beginPath();
        for (let s = 0; s <= 140; s++) {
          const th = (s / 140) * 6.2832;
          const r =
            rr *
            (1 +
              0.13 * Math.sin(3 * th + ts * 0.9 + k * 0.35) +
              0.07 * Math.sin(5 * th - ts * 1.2 + k * 0.2) +
              0.04 * Math.sin(8 * th + ts * 0.6) +
              bul * Math.pow(Math.max(0, Math.cos(th - pa)), 6));
          const x = cx + Math.cos(th) * r,
            y = cy + Math.sin(th) * r * 0.92;
          if (s) c.lineTo(x, y);
          else c.moveTo(x, y);
        }
        c.closePath();
        const mix = k / 10;
        c.strokeStyle = k > 7 ? rgba(col.copper, 0.9) : rgba(col.aqua, 0.25 + mix * 0.5);
        c.lineWidth = k > 7 ? 1.6 : 1;
        c.stroke();
        if (k === 10) {
          c.fillStyle = rgba(col.copper, 0.18);
          c.fill();
        }
      }
      // umlaufende Punkte
      for (let p = 0; p < 3; p++) {
        const a = ts * (0.5 + p * 0.18) + p * 2.1,
          r2 = R * (1.18 + p * 0.08);
        c.fillStyle = p ? rgba(col.aqua, 0.9) : col.copper;
        c.beginPath();
        c.arc(cx + Math.cos(a) * r2, cy + Math.sin(a) * r2 * 0.92, p ? 2 : 3, 0, 6.28);
        c.fill();
      }
    },
  };
}

// Person: Höhenlinien
function topo(): Scene {
  const cell = 12,
    levels: number[] = [];
  for (let l = 0.18; l < 0.86; l += 0.045) levels.push(l);
  function f(x: number, y: number, o: number) {
    return noise(x * 0.0065 + o, y * 0.0065) * 0.62 + noise(x * 0.017 - o, y * 0.017) * 0.38;
  }
  return {
    init() {},
    every: 3,
    draw(c, w, h, t, pt) {
      const col = C();
      c.clearRect(0, 0, w, h);
      const o = t * 0.00004,
        cols = Math.ceil(w / cell) + 1,
        rows = Math.ceil(h / cell) + 1,
        g = new Float32Array(cols * rows);
      for (let y = 0; y < rows; y++)
        for (let x = 0; x < cols; x++) {
          let v = f(x * cell, y * cell, o);
          if (pt) {
            const ddx = x * cell - pt.x,
              ddy = y * cell - pt.y;
            v += 0.24 * Math.exp(-(ddx * ddx + ddy * ddy) / 18000);
          }
          g[y * cols + x] = v;
        }
      levels.forEach((L, li) => {
        c.strokeStyle = rgba(li % 4 === 0 ? col.aqua : col.topo, li % 4 === 0 ? 0.32 : 0.16);
        c.lineWidth = li % 4 === 0 ? 1.1 : 0.8;
        c.beginPath();
        const lerp = (v1: number, v2: number) => (L - v1) / (v2 - v1);
        for (let y = 0; y < rows - 1; y++)
          for (let x = 0; x < cols - 1; x++) {
            const a = g[y * cols + x],
              b = g[y * cols + x + 1],
              cc = g[(y + 1) * cols + x + 1],
              d = g[(y + 1) * cols + x];
            const idx = (a > L ? 8 : 0) | (b > L ? 4 : 0) | (cc > L ? 2 : 0) | (d > L ? 1 : 0);
            if (idx === 0 || idx === 15) continue;
            const X = x * cell,
              Y = y * cell;
            const top: P2 = [X + cell * lerp(a, b), Y],
              right: P2 = [X + cell, Y + cell * lerp(b, cc)],
              bot: P2 = [X + cell * lerp(d, cc), Y + cell],
              left: P2 = [X, Y + cell * lerp(a, d)];
            const segs = (
              {
                1: [left, bot],
                2: [bot, right],
                3: [left, right],
                4: [top, right],
                5: [left, top, bot, right],
                6: [top, bot],
                7: [left, top],
                8: [left, top],
                9: [top, bot],
                10: [left, bot, top, right],
                11: [top, right],
                12: [left, right],
                13: [bot, right],
                14: [left, bot],
              } as Record<number, P2[]>
            )[idx];
            for (let s = 0; s < segs.length; s += 2) {
              c.moveTo(segs[s][0], segs[s][1]);
              c.lineTo(segs[s + 1][0], segs[s + 1][1]);
            }
          }
        c.stroke();
      });
      // Gipfelmarke
      const px = pt ? pt.x : w * 0.82,
        py = pt ? pt.y : h * 0.3;
      c.fillStyle = col.copper;
      c.beginPath();
      c.arc(px, py, 3, 0, 6.28);
      c.fill();
      c.strokeStyle = rgba(col.copper, 0.5);
      c.beginPath();
      c.arc(px, py, 10 + 4 * Math.sin(t * 0.002), 0, 6.28);
      c.stroke();
    },
  };
}

// Deine Idee: ein Samen, der zur Maus hin wächst
function seed(): Scene {
  let g = 0.25;
  return {
    init() {},
    draw(c, w, h, t, pt) {
      const col = C();
      c.clearRect(0, 0, w, h);
      g += ((pt ? 1 : 0.32) - g) * 0.035;
      const narrow = w < 820,
        rx = narrow ? w * 0.5 : w * 0.74,
        ry = h + 4,
        base = Math.min(h * 0.2, w * 0.16),
        ts = t * 0.001;
      const aim = pt ? Math.atan2(pt.y - ry, pt.x - rx) : -Math.PI / 2;
      function br(x: number, y: number, a: number, len: number, d: number) {
        if (d > 9) return;
        const steer = Math.atan2(Math.sin(aim - a), Math.cos(aim - a));
        a += steer * (pt ? 0.12 : 0.03);
        const L = len * g,
          nx = x + Math.cos(a) * L,
          ny = y + Math.sin(a) * L;
        c.strokeStyle = rgba(d < 3 ? col.aqua : d < 6 ? col.mid : col.petrol, 0.85);
        c.lineWidth = Math.max(0.6, 4.2 - d * 0.45);
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(nx, ny);
        c.stroke();
        if (d >= 7 && g > 0.55) {
          c.fillStyle = rgba(col.copper, 0.85);
          c.beginPath();
          c.arc(nx, ny, 1.8, 0, 6.28);
          c.fill();
        }
        const sw = 0.36 + 0.07 * Math.sin(ts * 1.3 + d);
        br(nx, ny, a - sw, len * 0.76, d + 1);
        br(nx, ny, a + sw, len * 0.76, d + 1);
      }
      br(rx, ry, -Math.PI / 2, base, 0);
      const pr = 8 + 5 * Math.sin(t * 0.003);
      c.strokeStyle = rgba(col.copper, 0.6);
      c.beginPath();
      c.arc(rx, h - 10, pr, Math.PI, 0);
      c.stroke();
    },
  };
}

// Kontakt: Signal breitet sich aus
function ping(): Scene {
  let rings: { x: number; y: number; t: number }[] = [],
    last = -9999;
  const sp = 30;
  return {
    init() {},
    draw(c, w, h, t, pt) {
      const col = C();
      c.clearRect(0, 0, w, h);
      const narrow = w < 900,
        ox = pt ? pt.x : narrow ? w * 0.5 : w * 0.74,
        oy = pt ? pt.y : narrow ? h * 0.78 : h * 0.5;
      if (t - last > (pt ? 650 : 1500)) {
        last = t;
        rings.push({ x: ox, y: oy, t });
      }
      rings = rings.filter((r) => t - r.t < 5200);
      const maxR = Math.hypot(w, h);
      for (let y = sp / 2; y < h; y += sp)
        for (let x = sp / 2; x < w; x += sp) {
          let b = 0;
          for (let i = 0; i < rings.length; i++) {
            const r = rings[i],
              rad = (t - r.t) * 0.22,
              d = Math.hypot(x - r.x, y - r.y),
              k = d - rad,
              fade = 1 - rad / maxR;
            if (fade > 0) b += Math.exp((-k * k) / 420) * fade;
          }
          b = Math.min(1, b);
          c.fillStyle = b > 0.55 ? rgba(col.copper, 0.35 + b * 0.6) : rgba(col.aqua, 0.1 + b * 0.55);
          c.beginPath();
          c.arc(x, y, 0.9 + b * 2.2, 0, 6.28);
          c.fill();
        }
      c.fillStyle = col.copper;
      c.beginPath();
      c.arc(ox, oy, 3.5, 0, 6.28);
      c.fill();
    },
  };
}

export const scenes: Record<SceneName, () => Scene> = { think, build, create, topo, seed, ping };
