import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Reine statische Seite: Build erzeugt fertige HTML-Dateien in /out
  output: "export",
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
