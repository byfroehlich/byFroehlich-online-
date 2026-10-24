"use client";

import { useEffect } from "react";

/** Footer-Link, der den zugehörigen aufklappbaren Bereich öffnet. */
export default function LegalLink({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <a
      href={"#" + id}
      onClick={() => {
        const d = document.getElementById(id);
        if (d instanceof HTMLDetailsElement) d.open = true;
      }}
    >
      {children}
    </a>
  );
}

/** Öffnet Impressum oder Datenschutz, wenn die Seite direkt mit #impressum / #datenschutz aufgerufen wird. */
export function OpenFromHash() {
  useEffect(() => {
    const open = () => {
      const d = document.getElementById(location.hash.slice(1));
      if (d instanceof HTMLDetailsElement) {
        d.open = true;
        d.scrollIntoView();
      }
    };
    open();
    window.addEventListener("hashchange", open);
    return () => window.removeEventListener("hashchange", open);
  }, []);
  return null;
}
