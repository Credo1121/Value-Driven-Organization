# Design-Konzepte Capability-Bridge-Übersicht (08.10.2026)

Entwürfe zur Auswahl, **nicht** Teil der App. Nutzen die echten Inhalte aus
`content/capability-bridges.json` (via `data.js`). Auslöser: Auftraggeber fand den bisherigen Umsetzungsstand
zu textlastig und wünschte modernere, organischere Varianten im Eraneos-Look, inspiriert durch Eraneos'
eigene Pattern-Cards (Icon + kurze Erklärung) und futuristischere Referenz-Layouts.

| Konzept | Datei | Idee |
|---|---|---|
| E Icon grid | `e-icon-grid.html` / `.png` | Hell, 4 Spalten EPM/TBM/EA/LPM, warme Beige-Karten mit kleinen Icon-Diagrammen je Capability (Eraneos-Pattern-Card-Stil), Beschreibungsbox rechts unten |
| F Flow spine | `f-flow-spine.html` / `.png` | Dunkel, futuristisch, zentrale vertikale Linie mit nummerierten Knoten, Enterprise-nahe Capabilities (EPM/EA) links, operative (TBM/LPM) rechts |
| G Orbit blobs | `g-orbit-blobs.html` / `.png` | Hell, organische Blob-Flächen im Hintergrund, Karten frei im Raum, kurvige Verbindungslinien statt Spalten/Linien |

Alle 3 sind interaktiv (Klick wechselt die aktive Capability, zeigt Verbindungen und Beschreibungsbox).

Server zum Ansehen: `npm run` über `.claude/launch.json`-Eintrag `vdo-concepts` (Port 4182), dann
`http://localhost:4182/capability-bridge/<datei>.html`.

Screenshots neu erzeugen: Playwright-Skript analog zu den übrigen Konzepten (nicht dauerhaft im Repo, siehe
Session-Historie) – lädt die Seite auf 1440×1000 und speichert einen Full-Page-Screenshot.
