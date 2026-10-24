"use client";

import { useEffect, useRef } from "react";
import { SHOW_THEME_SWITCH } from "@/config";
import ThemeSwitch from "./ThemeSwitch";

export default function Header() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const hdr = ref.current!;
    const onScroll = () => hdr.classList.toggle("solid", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header id="hdr" ref={ref}>
      <div className="wrap gut bar">
        <a className="logo" href="#top" aria-label="byFröhlich Start">
          <svg viewBox="0 0 26 26" aria-hidden="true">
            <path
              d="M13 24 V14 M13 14 C13 9 8 8 5 4 M13 14 C13 10 18 9 21 5 M13 18 C15 16 18 16 20 14"
              fill="none"
              stroke="var(--aqua)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <circle cx="5" cy="4" r="2" fill="var(--copper)" />
            <circle cx="21" cy="5" r="2" fill="var(--aqua)" />
            <circle cx="20" cy="14" r="1.6" fill="var(--aqua)" />
          </svg>
          <span>
            <span className="by">by</span>Fröhlich
          </span>
        </a>
        <nav>
          <a href="#prinzip">Prinzip</a>
          <a href="#idee">Deine Idee</a>
          <a href="#person">Person</a>
          {SHOW_THEME_SWITCH && <ThemeSwitch />}
          <a className="pill" href="#kontakt">
            Kontakt
          </a>
        </nav>
      </div>
    </header>
  );
}
