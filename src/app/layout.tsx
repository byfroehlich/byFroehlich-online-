import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

// next/font lädt die Schriften beim Build herunter und liefert sie selbst aus.
// Zur Laufzeit gibt es keine Verbindung zu Google.
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], axes: ["opsz"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Sans({ subsets: ["latin"], variable: "--font-instrument", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });

const description = "Mathias Fröhlich. Ich schaue hin, hinterfrage und gestalte.";

export const metadata: Metadata = {
  metadataBase: new URL("https://byfroehlich.de"),
  title: "byFröhlich",
  description,
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "byFröhlich",
    title: "byFröhlich",
    description,
  },
  twitter: { card: "summary_large_image", title: "byFröhlich", description },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#061a1d",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" data-scroll-behavior="smooth" className={`${bricolage.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>{children}</body>
    </html>
  );
}
