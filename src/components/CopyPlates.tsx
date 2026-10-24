"use client";

import { useRef, useState } from "react";

type Item = { label: string; display: React.ReactNode; copy: string; aria: string };

const items: Item[] = [
  {
    label: "E-Mail",
    display: (
      <>
        kontakt@<wbr />
        byfroehlich.de
      </>
    ),
    copy: "kontakt@byfroehlich.de",
    aria: "E-Mail-Adresse kopieren",
  },
  { label: "Telefon", display: "+49 179 9042777", copy: "+491799042777", aria: "Telefonnummer kopieren" },
];

export default function CopyPlates() {
  const [msg, setMsg] = useState("");
  return (
    <div className="plates">
      {items.map((it) => (
        <Plate key={it.label} item={it} onMsg={setMsg} />
      ))}
      <p className="mono" id="copyMsg" aria-live="polite">
        {msg}
      </p>
    </div>
  );
}

function Plate({ item, onMsg }: { item: Item; onMsg: (m: string) => void }) {
  const val = useRef<HTMLSpanElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [done, setDone] = useState(false);

  const ok = () => {
    setDone(true);
    onMsg("");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1800);
  };
  // Fallback ohne Zwischenablage-API: Text markieren
  const sel = () => {
    const r = document.createRange();
    r.selectNodeContents(val.current!);
    const sl = getSelection()!;
    sl.removeAllRanges();
    sl.addRange(r);
    onMsg("Markiert. Mit Strg+C kopieren.");
  };

  return (
    <div className="plate">
      <span className="mono">{item.label}</span>
      <span className="val" ref={val}>
        {item.display}
      </span>
      <button
        type="button"
        className={done ? "cbtn done" : "cbtn"}
        aria-label={item.aria}
        onClick={() => {
          if (navigator.clipboard?.writeText) navigator.clipboard.writeText(item.copy).then(ok, sel);
          else sel();
        }}
      >
        {done ? "Kopiert" : "Kopieren"}
      </button>
    </div>
  );
}
