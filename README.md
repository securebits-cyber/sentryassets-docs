# SentryAssets Docs

Quellen der Dokumentation unter [docs.sentry-assets.de](https://docs.sentry-assets.de), auf Deutsch und Englisch. Gebaut mit Astro und Starlight als statische Seite.

## Lokal starten

```bash
npm ci
npm run dev       # Entwicklungsserver mit Neuladen
npm run check     # Build und Prüfung: interne Links, Anker, beide Sprachen, verbotene Begriffe
npm run preview   # gebaute Seite ansehen
```

Die Node-Version steht in `.nvmrc`.

## Aufbau

| Pfad | Inhalt |
|---|---|
| `src/content/docs/` | Seiten auf Deutsch (Standard) |
| `src/content/docs/en/` | dieselben Seiten auf Englisch, mit gleichem Pfad |
| `astro.config.mjs` | Seitenleiste, Sprachen, Integrationen |
| `src/styles/custom.css` | Farben und Formen nach dem Design-System von SentryAssets |
| `src/components/` | Wortmarke und Fußzeile |
| `src/starlightRouteData.ts`, `src/seo/` | Social Cards, Robots-Direktiven und strukturierte Daten |
| `public/_headers` | Sicherheits- und Cache-Header für Cloudflare Pages |
| `scripts/check-content.mjs` | Prüfung nach dem Build |
| `scripts/make-images.mjs` | erzeugt Social Cards und PNG-Icons in `public/` |

## Schreiben

- Jede Seite gibt es in beiden Sprachen; `npm run check` meldet fehlende.
- Frontmatter mit `title`, `description` und `sidebar.label`/`sidebar.order`; neue Seiten zusätzlich in die Seitenleiste in `astro.config.mjs`.
- Deutsch in der Sie-Form, Bezeichnungen der Oberfläche wörtlich wie in der App.
- Diagramme in Mermaid, Platzhalter wie `example.test`, nie echte Hosts, Schlüssel oder Tokens.
- Funktionen ab Pro beginnen mit `<Badge text="Pro" variant="note" />`.
