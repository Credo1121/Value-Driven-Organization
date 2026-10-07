# ADR-003 – Inhalte als JSON, Validierung mit Zod zur Build-Zeit

- **Status:** Accepted · **Datum:** 07.10.2026 (I1)
- **Bezug:** REQ-001, REQ-002; Regeln R1–R3 (`docs/domain/model.md`)

## Kontext
Fachliche Inhalte (Glossar, Quellen, später Fähigkeiten, Regeln, Beispiel) müssen ohne Codeänderung pflegbar sein. Fehler in Referenzen, Aussagetypen oder Quellen sollen **den Build verhindern**, nicht erst im Workshop auffallen.

## Optionen
1. Inhalte als TypeScript-Objekte (nur Typprüfung)
2. **Inhalte als JSON + Zod-Schemas + fachliche Validierungsfunktionen**
3. Markdown mit Frontmatter + Parser (zusätzliche Abhängigkeiten)

## Entscheidung
Option 2.
- Inhalte liegen in `content/*.json`.
- `src/content/schema.ts` definiert die Struktur (Zod), TypeScript-Typen werden daraus abgeleitet.
- `src/domain/validation.ts` prüft fachliche Regeln (R1 Referenzen, R2 Aussagetyp/Quellenstatus, R3 Glossarbegriffe, Kardinalitäten) als **pure Funktionen** und liefert Fehlerlisten.
- `src/content/load.ts` lädt, validiert und wirft bei Fehlern → `next build` bricht ab. Dieselben Funktionen laufen in Vitest, inklusive Negativ-Fixtures.

## Begründung
- Eine Validierungsquelle für Build und Tests, unabhängig von React und Next.js.
- JSON ist ohne Programmierkenntnis lesbar. Zod liefert verständliche Fehlermeldungen.
- Keine zusätzliche Markdown-Toolchain im MVP.

## Folgen
- Längere Fließtexte in JSON sind weniger komfortabel. Bei Bedarf (I3, Vertiefungen) wird Markdown neu bewertet.
- Glossarbegriffe im Fließtext werden als `[[term-id]]` oder `[[term-id|Anzeigetext]]` markiert (R3).
