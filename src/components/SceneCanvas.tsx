"use client";

import { useEffect, useRef } from "react";
import { fit, prefersReducedMotion, whenIdle, type Pt, type Surface } from "@/lib/canvas";
import { onThemeChange } from "@/lib/palette";
import { scenes, type SceneName } from "@/lib/scenes";

/** Canvas-Szene, die auf die Maus über dem umgebenden Container reagiert. */
export default function SceneCanvas({ scene }: { scene: SceneName }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const host = cv?.parentElement;
    if (!cv || !host) return;
    const RM = prefersReducedMotion();
    const sc = scenes[scene]();
    let st: Surface | null = null,
      vis = false,
      fr = 0,
      ptr: Pt = null,
      raf = 0;

    const still = () => {
      if (st) sc.draw(st.ctx, st.w, st.h, 4000, ptr);
    };
    const onMove = (e: PointerEvent) => {
      const r = cv.getBoundingClientRect();
      ptr = { x: e.clientX - r.left, y: e.clientY - r.top };
      if (RM) still();
    };
    const onLeave = () => {
      ptr = null;
      if (RM) still();
    };
    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);

    const size = () => {
      st = fit(cv);
      sc.init(st.w, st.h);
    };
    size();
    const ro = new ResizeObserver(() => {
      const r = cv.getBoundingClientRect();
      if (st && Math.abs(r.width - st.w) < 1 && Math.abs(r.height - st.h) < 1) return;
      size();
      if (RM) still();
    });
    ro.observe(cv);
    const offTheme = onThemeChange(() => {
      if (RM) still();
    });

    let io: IntersectionObserver | null = null;
    let cancelIdle = () => {};
    if (RM) still();
    else {
      // Erst zeichnen, wenn sichtbar, und erst starten, wenn das Laden durch ist
      io = new IntersectionObserver(
        (es) => {
          vis = es[0].isIntersecting;
        },
        { rootMargin: "80px" },
      );
      io.observe(cv);
      const loop = (now: number) => {
        if (vis && st) {
          fr++;
          if (!sc.every || fr % sc.every === 0) sc.draw(st.ctx, st.w, st.h, now, ptr);
        }
        raf = requestAnimationFrame(loop);
      };
      cancelIdle = whenIdle(() => {
        raf = requestAnimationFrame(loop);
      });
    }

    return () => {
      cancelIdle();
      cancelAnimationFrame(raf);
      io?.disconnect();
      ro.disconnect();
      offTheme();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, [scene]);

  return <canvas ref={ref} data-scene={scene} aria-hidden="true" />;
}
