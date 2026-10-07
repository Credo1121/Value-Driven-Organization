# CHG-002 – Big picture (I2)

- **Datum:** 07.10.2026 · **Freigabe:** Auftraggeber, 07.10.2026 („Bitte starte mit dem I2“)
- **REQ:** REQ-003 (vollständig), REQ-009 (Viewports, axe), REQ-004 (nur Platzhalterseiten je Fähigkeit)
- **ADR:** ADR-002 ergänzt (Playwright, axe)

## Ziel
Gesamtbild als Einstieg im Workshop: acht gemeinsame Steuerungsfähigkeiten, Beiträge der Disziplinen, sechs typisierte Beziehungsarten, Finance als angrenzende Umwelt, geführte Moderationsschritte und Textalternative.

## Änderungen
| Bereich | Dateien |
|---|---|
| Inhalt | `content/big-picture.json`: 8 Fähigkeiten, 6 Disziplinen (EPM, LPM, TBM, EA, IT Ops, Finance), 15 Verbindungen mit Typ und Kurzbeschreibung |
| Vertrag | `src/content/schema.ts`: Link-Typen, Capability-, Link- und BigPicture-Schema |
| Validierung | `src/domain/validation.ts`: `validateBigPicture` (Referenzen, Selbstbezug, isolierte Fähigkeit); `src/content/load.ts` |
| UI | `src/ui/big-picture/`: `layout.ts` (feste Koordinaten, orthogonale Routen), `linkStyles.ts`, `steps.ts` (pure Zustandslogik), `BigPictureExplorer.tsx` (Client-Komponente), `BigPictureText.tsx` (Server), CSS-Module |
| Seiten | `/big-picture/`, `/capabilities/` (Übersicht), `/capabilities/c1…c8/` (Platzhalter bis I3) |
| Tests | `tests/big-picture.test.ts`, `e2e/big-picture.spec.ts`, `playwright.config.ts` |
| Werkzeuge | `@playwright/test` 1.63.0, `@axe-core/playwright` 4.13.0; `npm run test:e2e`; `npm run check` enthält E2E |

## Verändertes Verhalten
- Neu: interaktives Gesamtbild mit → / ← / PageUp / PageDown (Presenter-Fernbedienung), Fokus je Linientyp über die Legende (Esc hebt ihn auf), Panel „what flows“ für den fokussierten Typ.
- Startseite und Navigation verlinken Bereiche A und B.

## Entwurfsentscheidungen [SYN]
- Kreislauf oben C1 → C2 → C3, rechts hinunter zu C6, unten zurück C6 → C7 → C8, links hinauf zu C1; C4 und C5 als querliegende Fähigkeiten in der Mitte; Finance links außen gestrichelt.
- Graustufen als Standard, Orange (`--c-accent-strong`) nur für den fokussierten Linientyp, gemäß CI-Prinzip „Greyscale default = highlighted“.
- SVG für Linien (`aria-hidden`), Fähigkeiten als echte HTML-Links darüber. So sind sie per Tastatur und Screenreader erreichbar.

## Prüfungen
`docs/qa/CHG-002-big-picture.md`: alle Gates PASS; Screenreader, Firefox/Safari und fachliches Kanten-Review **NOT RUN**.
