# Anforderungen – Übersicht und Traceability

Statuswerte: Draft → Ready (klare ACs, keine blockierenden Fragen) → Accepted (fachlich bestätigt durch Auftraggeber) → Implemented → Verified.
Alle REQs stehen derzeit auf **Draft**.

| REQ | Titel | Prio | Inkrement | Abhängig von | Status | Implementierung | Nachweis |
|---|---|---|---|---|---|---|---|
| [REQ-001](REQ-001-glossary-model.md) | Glossary & domain model | Must | I1 | – | Draft (Teil umgesetzt) | `app/glossary/page.tsx`, `content/glossary.json`, `src/domain/validation.ts` | `tests/content.test.ts`, `docs/qa/CHG-001-walking-skeleton.md` |
| [REQ-002](REQ-002-sources-statement-types.md) | Sources & statement types | Must | I1 | REQ-001 | Draft (Teil umgesetzt) | `content/sources.json`, `src/content/schema.ts`, `src/ui/StatementBadge.tsx` | `tests/content.test.ts` |
| [REQ-003](REQ-003-big-picture.md) | Big picture | Must | I2 | REQ-001, 002 | Accepted als PoC (E25); Rev. 3: `SwimlaneMatrix` implementiert, aber von der Seite entkoppelt (E29) | `app/big-picture/page.tsx`, `src/ui/big-picture/CycleOverview.tsx`, `src/ui/big-picture/SwimlaneMatrix.tsx` (nicht eingebunden), `content/big-picture.json` | `tests/big-picture.test.ts`, `e2e/big-picture.spec.ts` (Swimlane-Tests `test.describe.skip`), `docs/qa/CHG-003-big-picture-swimlanes.md` |
| [REQ-004](REQ-004-capability-deep-dive.md) | Capability deep dive | Must | I3 | REQ-003 | Implemented (C2 Entwurf, 7 Vorlagen) | `app/capabilities/[id]/page.tsx`, `src/ui/capability/`, `content/capabilities.json` | `tests/deep-dives.test.ts`, `e2e/deep-dive.spec.ts`, `docs/qa/CHG-004-capability-deep-dive.md` |
| [REQ-005](REQ-005-end-to-end-example.md) | End-to-end example | Must | I4 | REQ-001, 007 | Draft | – | – |
| [REQ-006](REQ-006-scenario-configurator.md) | Scenario configurator | Must | I5 | REQ-001, 007 | Draft | – | – |
| [REQ-007](REQ-007-operating-variant.md) | Operating variant enterprise/compact | Must | I4/I5 | REQ-001 | Draft | – | – |
| [REQ-008](REQ-008-reference-approaches.md) | Reference approaches | Should | I6 | REQ-002 | Draft | – | – |
| [REQ-009](REQ-009-presentation-accessibility.md) | Presentation use & accessibility | Must | alle, Härtung I7 | – | Draft (Basis) | `app/layout.tsx`, `app/page.tsx`, `app/not-found.tsx` | CHG-001; CHG-002: Viewports + axe automatisiert, Screenreader NOT RUN |
| [REQ-010](REQ-010-design-tokens.md) | Provisional design tokens | Should | I1, I7 | – | Draft (Basis) | `src/ui/tokens.css` | `tests/design-tokens.test.ts` |

Spalten „Implementierung“ und „Nachweis“ werden ab I1 mit Pfaden zu Code, Tests und `docs/qa/`-Berichten gefüllt.

## Querschnittliche Qualitätsziele
| ID | Ziel | Messung | Status |
|---|---|---|---|
| QZ1 | Zielauflösung 1280–1920 px Breite (Präsentation), nutzbar ab 768 px | Viewport-Prüfung im Browser | [BEST] Richtung, Werte [ANN] |
| QZ2 | Browser: aktuelle Chrome/Edge, Safari, Firefox | automatisiert: Playwright Chromium, Firefox, WebKit (Safari-Engine) seit 07.10.2026 | [ANN] Zielbrowser; Prüfung umgesetzt |
| QZ3 | Zugänglichkeit: WCAG 2.2 AA als Orientierung | axe + manuelle Prüfung | [BEST] Anforderungen, Konformitätsziel [ANN] |
| QZ4 | Offline-Nutzung vom Laptop | statischer Build lokal ohne Netz starten und alle Routen prüfen | [BEST] A4 |
| QZ5 | Performance | keine Zielwerte festgelegt. Bei statischer Auslieferung nachrangig, [OFFEN] | – |
