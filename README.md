# byFröhlich

Persönliche Website von Mathias Fröhlich. Next.js, statischer Export, Hosting auf Vercel.

## Lokal starten

```bash
npm install
npm run dev        # Entwicklung auf http://localhost:3000
npm run build      # erzeugt die fertige Seite in out/
npm run start      # zeigt out/ lokal an
npm run lint && npm run typecheck
```

## Auf Vercel veröffentlichen (einmalig)

1. Auf vercel.com mit dem GitHub-Konto anmelden.
2. **Add New → Project**, das Repo `byFroehlich-online-` importieren.
3. Framework erkennt Vercel selbst (Next.js). Nichts ändern, **Deploy**.
4. In den Projekt-Einstellungen unter **Analytics** und **Speed Insights** nichts aktivieren.
5. **Settings → Domains**: `byfroehlich.de` und `www.byfroehlich.de` hinzufügen und die angezeigten DNS-Einträge beim Domain-Anbieter eintragen.

Danach veröffentlicht jeder Push auf `main` automatisch. Pull Requests bekommen eine Vorschau-URL.

## Struktur

- `src/app/page.tsx`: alle Abschnitte, Impressum und Datenschutz
- `src/app/globals.css`: Design-Tokens und Styles (dunkel + helle Alternative)
- `src/components/`: Hero, Canvas-Szenen, Header, Kopier-Karten
- `src/lib/scenes.ts`: die Animationen der Karten, Person und Kontakt
- `src/config.ts`: Umschalter für die helle Variante
