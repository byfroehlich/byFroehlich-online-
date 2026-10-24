"use client";

import { useState } from "react";
import { setTheme, type Theme } from "@/lib/palette";

// Bewusst ohne Speicherung im Browser: Die Seite startet immer dunkel.
export default function ThemeSwitch() {
  const [theme, setLocal] = useState<Theme>("dark");
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-btn"
      aria-label={next === "light" ? "Helles Design anzeigen" : "Dunkles Design anzeigen"}
      onClick={() => {
        setTheme(next);
        setLocal(next);
      }}
    >
      {next === "light" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        </svg>
      )}
    </button>
  );
}
