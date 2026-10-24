# byFröhlich – Website

Persönliche Dachmarke von Mathias Fröhlich. Die Seite verkauft nicht, sie präsentiert die Person hinter Projekten wie TRULOC. Kurz, menschlich, neugierig machend. Keine Erklärtexte.

## Referenz

Der abgenommene Entwurf (`byfroehlich-demo.html`, nicht im Repo) ist 1:1 umgesetzt: gleiche Texte, Farben, Schriften, Abstände, Animationen und Maus-Interaktionen. Nichts dazuerfinden, keine Texte umformulieren. Alles, was auf einen Entwurf hinweist, bleibt draußen. TRULOC wird auf der Seite nicht erwähnt.

## Stack

- Next.js (App Router, TypeScript), statischer Export (`output: "export"`, Ergebnis in `out/`), Hosting auf Vercel, Region `fra1` in `vercel.json`
- Paketmanager npm (`package-lock.json` committen)
- Repo auf GitHub
- Kein CSS-Framework nötig; CSS Modules oder eine globale CSS-Datei mit den Tokens aus der Demo
- Schriften über `next/font/google` (Bricolage Grotesque, Instrument Sans, JetBrains Mono). Damit werden sie beim Build heruntergeladen und selbst gehostet. Es darf zur Laufzeit KEINE Verbindung zu Google-Servern geben.
- Kein Vercel Analytics, keine Speed Insights, keine Cookies, kein Tracking. Die Datenschutzerklärung sagt das so.

## Aufbau

Eine Startseite (`/`) mit diesen Abschnitten in dieser Reihenfolge:
1. Hero mit generativem Wachstum (zwei Canvas-Ebenen: Spur + Effekte), Maus lenkt, Klick pflanzt eine Idee, Live-Zähler
2. „Wie aus einer Idee etwas wird.“ – drei Karten Verstehen / Bauen / Gestalten, jede mit eigener Canvas-Szene und Maus-Reaktion; Texte gleich viele Zeilen
3. Dezentes Laufband in Monospace „Kleine Tools · Web-Apps · Mobile Apps · Automatisierungen · Digitale Mitarbeiter · KI-Lösungen · Ganze Systeme“ (langsam, pausiert bei Hover)
4. Ansage „Ich mag gute Lösungen. Und ich frage gern, ob es noch eine bessere gibt.“ Darunter klein: „KI gehört heute dazu, wo sie wirklich hilft. Für Unternehmen setze ich das mit 8gent um.“ (Link auf https://8gent.tech)
5. Karte „Die nächste Idee wartet schon.“ mit wachsendem Baum zur Maus, verlinkt auf Kontakt
6. Person mit Porträt (`public/portrait.jpg`, Originalfoto von der Alpe) und Höhenlinien-Canvas; Bildunterschrift „Auf einer Alpe im Allgäu“
7. Kontakt mit Signal-Animation (Wellen vom Mauszeiger): zwei Karten für kontakt@byfroehlich.de und +49 179 9042777, je mit Kopier-Button

Impressum und Datenschutz bleiben aufklappbare Bereiche (`<details id="impressum">`, `<details id="datenschutz">`) unten auf der Startseite, keine eigenen Seiten. Die Footer-Links und direkte Aufrufe mit `#impressum` / `#datenschutz` klappen sie auf.

## Design

- Dunkel ist das abgenommene Standarddesign.
- Eine helle Alternative ist eingebaut und über den Umschalter im Header erreichbar. Ob sie bleibt, ist offen. Ausschalten: `SHOW_THEME_SWITCH = false` in `src/config.ts`. Die Wahl wird bewusst nicht gespeichert.
- Das Zweig-SVG im Header ist das festgelegte Logo (auch `src/app/icon.svg`).

## Technik der Animationen

- Jede Szene als eigene Client-Komponente (`"use client"`) mit `useRef` auf das Canvas
- DevicePixelRatio auf 2 begrenzen, Größe per `ResizeObserver`
- Animation nur laufen lassen, wenn sichtbar (`IntersectionObserver`)
- `prefers-reduced-motion`: statisches Bild statt Animation
- Maus-Events am umgebenden Container, nicht am Canvas
- Funktioniert am Handy (Touch) und am Desktop

## Qualität

- Responsiv ab 360 px Breite, kein horizontales Scrollen
- Lighthouse Performance und Accessibility jeweils über 90
- Meta-Tags: Titel „byFröhlich“, Beschreibung „Mathias Fröhlich. Ich schaue hin, hinterfrage und gestalte.“, Open-Graph-Bild aus dem Porträt
- `lang="de"`

## Offen

- Kleinunternehmerregelung gilt nur noch 2026: Absatz „Umsatzsteuer“ im Impressum zum Jahreswechsel anpassen (USt-IdNr. oder Steuernummer-Hinweis).
- Helle Variante behalten oder entfernen.
- Domain byfroehlich.de in Vercel verbinden.

Erledigt: Es gibt keine W-IdNr. Das Logo ist festgelegt.
