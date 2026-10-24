// Farben für die Canvas-Szenen. Dunkel entspricht 1:1 der abgenommenen Demo.
export type Theme = "dark" | "light";

export type Palette = {
  deep: string;
  bg: string;
  petrol: string;
  aqua: string;
  bone: string;
  copper: string;
  /** mittlere Zweige im Wachstum */
  mid: string;
  /** Höhenlinien, Nebenlinien */
  topo: string;
  /** Bauen: linke und rechte Blockseite */
  blockL: string;
  blockR: string;
};

const DARK: Palette = {
  deep: "#061a1d",
  bg: "#08221f",
  petrol: "#11686b",
  aqua: "#86d3c6",
  bone: "#e8eee9",
  copper: "#d8945f",
  mid: "#4fb3aa",
  topo: "#2f8a86",
  blockL: "#0f4f52",
  blockR: "#0a3a3c",
};

// Auf hellem Grund kehrt sich die Gewichtung um: kräftige Linien dunkel, schwache hell.
const LIGHT: Palette = {
  deep: "#e8eee9",
  bg: "#f1f5f2",
  petrol: "#8cc2bb",
  aqua: "#0c6964",
  bone: "#0a2526",
  copper: "#b8652a",
  mid: "#3f958d",
  topo: "#6fa9a2",
  blockL: "#bcd6d0",
  blockR: "#a5c7c0",
};

let current: Palette = DARK;
let currentTheme: Theme = "dark";
const listeners = new Set<() => void>();

export function C(): Palette {
  return current;
}

export function getTheme(): Theme {
  return currentTheme;
}

export function setTheme(theme: Theme) {
  if (theme === currentTheme) return;
  currentTheme = theme;
  current = theme === "light" ? LIGHT : DARK;
  if (theme === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;
  listeners.forEach((fn) => fn());
}

export function onThemeChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
