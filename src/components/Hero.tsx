"use client";

import { useEffect, useRef } from "react";
import { fit, noise, prefersReducedMotion, rgba, whenIdle, type Pt, type Surface } from "@/lib/canvas";
import { C, onThemeChange } from "@/lib/palette";

type Branch = { x: number; y: number; a: number; base: number; w: number; gen: number; life: number };
type Node = { x: number; y: number; t: number; big: boolean };

const fmt = (n: number) => n.toLocaleString("de-AT");

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const trailRef = useRef<HTMLCanvasElement>(null);
  const fxRef = useRef<HTMLCanvasElement>(null);
  const ideasRef = useRef<HTMLElement>(null);
  const nodesRef = useRef<HTMLElement>(null);
  const growRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current!,
      tc = trailRef.current!,
      fc = fxRef.current!;
    const RM = prefersReducedMotion();
    let T: Surface, F: Surface, W = 0, H = 0;
    let branches: Branch[] = [],
      nodes: Node[] = [],
      ideas = 0,
      nodeCount = 0,
      grow = 0,
      ptr: Pt = null,
      frame = 0,
      heroVisible = true,
      lastAuto = 0,
      raf = 0;

    function heroSize() {
      T = fit(tc);
      F = fit(fc);
      W = T.w;
      H = T.h;
      T.ctx.lineCap = "round";
    }
    function plant(x: number, y: number, n: number, base: number) {
      ideas++;
      for (let k = 0; k < n; k++) {
        const a = base + (k - (n - 1) / 2) * ((Math.PI * 2) / Math.max(n, 3)) * 0.55 + (Math.random() - 0.5) * 0.4;
        branches.push({ x, y, a, base: a, w: 2.6 + Math.random() * 1.4, gen: 0, life: 320 + Math.random() * 320 });
      }
      nodes.push({ x, y, t: performance.now(), big: true });
    }
    function seedStart() {
      branches = [];
      nodes = [];
      const narrow = W < 820;
      plant(W * (narrow ? 0.5 : 0.72), H * (narrow ? 0.92 : 1.02), 5, -Math.PI / 2);
      plant(W * (narrow ? 0.1 : 0.5), H * (narrow ? 0.55 : 0.98), 3, -Math.PI / 2 - 0.4);
      plant(W * 1.02, H * 0.35, 3, Math.PI);
    }
    function stepGrow(now: number) {
      const col = C();
      const c = T.ctx,
        t = now * 0.0001,
        sp = Math.max(1.6, Math.min(W, H) / 360);
      for (let i = branches.length - 1; i >= 0; i--) {
        const b = branches[i];
        const n = noise(b.x * 0.0028 + t, b.y * 0.0028 - t) - 0.5;
        const tgt = b.base + n * 2.4,
          dfn = Math.atan2(Math.sin(tgt - b.a), Math.cos(tgt - b.a));
        b.a += dfn * 0.06;
        if (ptr) {
          const dx = ptr.x - b.x,
            dy = ptr.y - b.y,
            d = Math.hypot(dx, dy);
          if (d < 300 && d > 8) {
            const ta = Math.atan2(dy, dx),
              df = Math.atan2(Math.sin(ta - b.a), Math.cos(ta - b.a));
            b.a += df * 0.05 * (1 - d / 300);
          }
        }
        const nx = b.x + Math.cos(b.a) * sp,
          ny = b.y + Math.sin(b.a) * sp;
        const stroke = b.gen < 1 ? col.aqua : b.gen < 3 ? col.mid : col.petrol;
        c.strokeStyle = rgba(stroke, b.gen < 1 ? 0.9 : 0.75);
        c.lineWidth = b.w;
        c.beginPath();
        c.moveTo(b.x, b.y);
        c.lineTo(nx, ny);
        c.stroke();
        b.x = nx;
        b.y = ny;
        b.w *= 0.9965;
        b.life--;
        grow++;
        if (Math.random() < 0.016 && branches.length < 220 && b.w > 0.55) {
          const side = Math.random() < 0.5 ? -1 : 1;
          const na = b.a + side * (0.35 + Math.random() * 0.55);
          branches.push({ x: b.x, y: b.y, a: na, base: na, w: b.w * 0.74, gen: b.gen + 1, life: b.life * 0.8 });
          b.w *= 0.9;
          nodeCount++;
          nodes.push({ x: b.x, y: b.y, t: now, big: false });
          if (nodes.length > 160) nodes.shift();
        }
        if (b.w < 0.3 || b.life < 0 || b.x < -60 || b.x > W + 60 || b.y < -60 || b.y > H + 60) branches.splice(i, 1);
      }
      // langsames Vergehen
      if (frame % 9 === 0) {
        c.globalCompositeOperation = "destination-out";
        c.fillStyle = "rgba(0,0,0,.035)";
        c.fillRect(0, 0, W, H);
        c.globalCompositeOperation = "source-over";
      }
      // automatisch neue Ideen
      if (branches.length < 36 && now - lastAuto > 2600) {
        lastAuto = now;
        const edge = Math.floor(Math.random() * 3);
        let x, y, a;
        if (edge === 0) {
          x = W * (0.45 + Math.random() * 0.55);
          y = H + 10;
          a = -Math.PI / 2;
        } else if (edge === 1) {
          x = W + 10;
          y = H * (0.15 + Math.random() * 0.7);
          a = Math.PI;
        } else {
          x = W * (0.55 + Math.random() * 0.4);
          y = H * (0.2 + Math.random() * 0.6);
          a = Math.random() * Math.PI * 2;
        }
        plant(x, y, edge === 2 ? 5 : 3, a);
      }
    }
    function drawFx(now: number) {
      const col = C();
      const c = F.ctx;
      c.clearRect(0, 0, W, H);
      // Knoten
      for (let i = 0; i < nodes.length; i++) {
        const nd = nodes[i],
          age = (now - nd.t) / 1000;
        if (age < 2.4) {
          const p = age / 2.4;
          c.strokeStyle = rgba(nd.big ? col.copper : col.aqua, (1 - p) * 0.7);
          c.lineWidth = 1;
          c.beginPath();
          c.arc(nd.x, nd.y, (nd.big ? 6 : 3) + p * (nd.big ? 46 : 18), 0, Math.PI * 2);
          c.stroke();
        }
        const pulse = 0.35 + 0.35 * Math.sin(now * 0.003 + i);
        c.fillStyle = rgba(nd.big ? col.copper : col.aqua, age < 8 ? pulse : pulse * 0.4);
        c.beginPath();
        c.arc(nd.x, nd.y, nd.big ? 3.2 : 1.6, 0, Math.PI * 2);
        c.fill();
      }
      // leuchtende Spitzen
      c.save();
      c.shadowColor = col.copper;
      c.shadowBlur = 14;
      c.fillStyle = col.copper;
      for (let j = 0; j < branches.length; j++) {
        const b = branches[j];
        if (b.gen < 2) {
          c.beginPath();
          c.arc(b.x, b.y, Math.max(1.2, b.w * 0.7), 0, Math.PI * 2);
          c.fill();
        }
      }
      c.restore();
      // Cursor-Feld
      if (ptr) {
        const g = c.createRadialGradient(ptr.x, ptr.y, 0, ptr.x, ptr.y, 160);
        g.addColorStop(0, rgba(col.aqua, 0.12));
        g.addColorStop(1, rgba(col.aqua, 0));
        c.fillStyle = g;
        c.fillRect(ptr.x - 160, ptr.y - 160, 320, 320);
      }
    }
    function hud() {
      ideasRef.current!.textContent = fmt(ideas);
      nodesRef.current!.textContent = fmt(nodeCount);
      growRef.current!.textContent = fmt(Math.round(grow / 10));
    }
    function heroLoop(now: number) {
      if (heroVisible) {
        frame++;
        stepGrow(now);
        drawFx(now);
        if (frame % 12 === 0) hud();
      }
      raf = requestAnimationFrame(heroLoop);
    }
    function staticFrame() {
      for (let s = 0; s < 520; s++) {
        frame++;
        stepGrow(s * 16);
      }
      drawFx(9000);
      hud();
    }

    heroSize();
    seedStart();
    let cancelIdle = () => {};
    if (RM) staticFrame();
    else
      cancelIdle = whenIdle(() => {
        raf = requestAnimationFrame(heroLoop);
      });

    const onMove = (e: PointerEvent) => {
      const r = hero.getBoundingClientRect();
      ptr = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      ptr = null;
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element).closest("a,button")) return;
      const r = hero.getBoundingClientRect();
      plant(e.clientX - r.left, e.clientY - r.top, 6, Math.random() * Math.PI * 2);
      if (RM) {
        for (let s = 0; s < 160; s++) {
          frame++;
          stepGrow(performance.now() + s * 16);
        }
        drawFx(performance.now());
      }
    };
    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("click", onClick);

    // Neu aufbauen, wenn sich die Größe wirklich ändert (nicht beim ersten Melden)
    let rT: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      const r = hero.getBoundingClientRect();
      if (Math.abs(r.width - W) < 1 && Math.abs(r.height - H) < 1) return;
      clearTimeout(rT);
      rT = setTimeout(() => {
        heroSize();
        seedStart();
        if (RM) staticFrame();
      }, 180);
    });
    ro.observe(hero);

    const io = new IntersectionObserver((es) => {
      heroVisible = es[0].isIntersecting;
    });
    io.observe(hero);

    // Beim Designwechsel die Spur in den neuen Farben neu beginnen
    const offTheme = onThemeChange(() => {
      T.ctx.clearRect(0, 0, W, H);
      seedStart();
      if (RM) staticFrame();
    });

    return () => {
      cancelIdle();
      cancelAnimationFrame(raf);
      clearTimeout(rT);
      ro.disconnect();
      io.disconnect();
      offTheme();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("click", onClick);
    };
  }, []);

  return (
    <section className="hero" id="hero" aria-label="Einstieg" ref={heroRef}>
      <canvas ref={trailRef} aria-hidden="true" />
      <canvas
        ref={fxRef}
        role="img"
        aria-label="Ein wachsendes, sich verzweigendes Netz aus Linien. Ein Klick pflanzt eine neue Idee."
      />
      <div className="veil" />
      <div className="hero-in wrap gut">
        <h1>
          Geht das nicht <span>einfacher?</span>
        </h1>
        <div className="hero-row">
          <p>Diese Frage stelle ich mir ständig. Die Antwort programmiere ich dann selbst.</p>
          <div style={{ display: "grid", gap: 14 }}>
            <div className="hint">
              <i />
              Klick ins Bild pflanzt eine Idee
            </div>
            <div className="hud" aria-live="off">
              <div>
                Ideen<b ref={ideasRef}>0</b>
              </div>
              <div>
                Verzweigungen<b ref={nodesRef}>0</b>
              </div>
              <div>
                Wachstum<b ref={growRef}>0</b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
