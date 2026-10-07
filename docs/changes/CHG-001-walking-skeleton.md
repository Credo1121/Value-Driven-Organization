# CHG-001 – Walking Skeleton (I1)

- **Datum:** 07.10.2026 · **Freigabe:** Auftraggeber, 07.10.2026 („I1, lokales Grundgerüst gerne erstellen“)
- **REQ:** REQ-001 (Teil), REQ-002 (Teil), REQ-009 (Teil), REQ-010 (Basis)
- **ADR:** ADR-001, ADR-002 (Accepted), ADR-003 (neu)
- **Git:** kein Commit (E18). Erster Commit nach Durchsicht der lokalen Tests durch den Auftraggeber.

## Ziel
Lauffähiges, statisch exportiertes Grundgerüst mit Design-Tokens, Navigation, Inhaltsvalidierung zur Build-Zeit und Glossarseite. Es belegt die Architektur (ADR-001), bevor fachliche Bereiche gebaut werden.

## Änderungen
| Bereich | Dateien |
|---|---|
| Projekt/Werkzeuge | `package.json` (exakt gepinnt), `package-lock.json`, `.nvmrc`, `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `vitest.config.ts`, `.gitignore`, `.claude/launch.json` |
| Inhalte | `content/glossary.json` (49 Begriffe, EN), `content/sources.json` (12 Quellen, Status verified/not-verified) |
| Inhaltsvertrag | `src/content/schema.ts` (Zod), `src/content/load.ts` (Build-Abbruch bei Befunden) |
| Domäne | `src/domain/validation.ts` (R1–R3, Eindeutigkeit; pure Funktionen) |
| UI | `src/ui/tokens.css`, `app/globals.css`, `app/layout.tsx`, `src/ui/SiteHeader.tsx`, `src/ui/navigation.ts`, `src/ui/StatementBadge.tsx`, `src/ui/TermText.tsx`, `src/ui/ComingSoon.tsx`, CSS-Module |
| Seiten | `/` (Start mit 7 Brüchen), `/glossary/`, Platzhalter für A–E und `/sources/`, 404 |
| Werkzeug | `scripts/serve-out.mjs` (Offline-Auslieferung ohne Zusatzpaket) |
| Tests | `tests/content.test.ts`, `tests/design-tokens.test.ts` |

## Verändertes Verhalten
Neu: Die App ist lokal baubar und offline auslieferbar. Ungültige Inhalte verhindern den Build.

## Prüfungen
Siehe `docs/qa/CHG-001-walking-skeleton.md`: Typecheck, Lint, 22 Tests und Build **PASS**; Build-Bruchtest **PASS**; Offline-Auslieferung **PASS**; Browser-Sichtprüfung und manuelle a11y-Prüfung **NOT RUN**.

## Abweichungen vom Plan
- TypeScript 6.0.3 statt der neuesten 7.0.2 und ESLint 9 statt 10, wegen Kompatibilität der Lint-Toolchain (ADR-002).
- Playwright/axe noch nicht installiert (I2).

## Restrisiken
R11 (Dev-Audit braces), QA-I1-1 (Glossar-Gruppierung vs. AC-001-1).
