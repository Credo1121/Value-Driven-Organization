# QA – CHG-001 Walking Skeleton (I1)

- **Datum:** 07.10.2026, 13:38–13:43 CEST · **Rolle:** `5-qa`
- **Basis:** Arbeitsverzeichnis ohne Commit (E18), macOS (Darwin 24.6), Node v24.20.0, npm 11.19.0
- **Einschränkung:** Rollenwechsel im selben Modell, keine unabhängige Prüfung.

## Ergebnis: **PASS mit Einschränkungen**
Alle automatisierten Pflichtprüfungen bestanden. Browser-Sichtprüfung und manuelle Tastatur-/Screenreader-Prüfung sind **NOT RUN** (s. u.).

## Ausgeführte Prüfungen

| Prüfung | Befehl | Ergebnis |
|---|---|---|
| Typprüfung | `npm run typecheck` (tsc 6.0.3, strict) | **PASS** |
| Lint | `npm run lint` (ESLint 9.39.5, next core-web-vitals + typescript, Schichtregel domain/content ohne React/Next) | **PASS** (0 Befunde) |
| Unit-Tests | `npm test` (Vitest 5.0.3) | **PASS**: 22/22 |
| Build | `npm run build` (Next.js 16.4.0, `output: 'export'`) | **PASS**: 9 Routen statisch, Exit 0 |
| Build bricht bei fehlerhaftem Inhalt ab | Glossar temporär mit unbekannter Referenz `ghost-term` gebaut, danach Original wiederhergestellt (`cmp` identisch) | **PASS**: Exit 1, Meldung `[R1] epm: unknown related term ghost-term` |
| Offline-Auslieferung (QZ4) | `node scripts/serve-out.mjs` (nur Node-Bordmittel), `curl` auf 127.0.0.1 | **PASS**: alle 8 Routen 200, unbekannte Route 404 mit „Page not found“, Pfad-Traversal `/../../etc/passwd` → 404 |
| Glossarseite gerendert | HTML-Analyse `/glossary/` | **PASS**: 49/49 Begriffe als Anker, 0 rohe `[[…]]`-Marker im sichtbaren Markup, 30 Glossarlinks, Aussagetyp-Labels vorhanden, kein „Benchmark“ |
| Sprache und Grundzugänglichkeit (statisch) | HTML-Analyse | **PASS**: `lang="en"`, Skip-Link, `aria-current="page"` in der Navigation |
| Dependency-Audit | `npm audit --omit=dev` | **PASS**: 0 Befunde in Laufzeitabhängigkeiten |
| Dependency-Audit (Dev) | `npm audit` | **Hinweis**: 5 × high in `braces` über `eslint-config-next → @next/eslint-plugin-next → fast-glob → micromatch` (nur Lint-Werkzeug, nicht im Build-Output). `npm audit fix --force` würde auf eslint-config-next 14 zurückstufen → **nicht ausgeführt** (Risiko R11) |

## Abdeckung Akzeptanzkriterien (I1-Umfang)

| AC | Prüfung | Status |
|---|---|---|
| AC-001-1 Glossar mit Definition, Abgrenzung, Aussagetyp | Rendering-Analyse; alphabetisch **innerhalb** von 4 Kategorien (Abweichung: Gruppierung zusätzlich zur Alphabetik, s. Befund QA-I1-1) | PASS mit Hinweis |
| AC-001-2 unbekannter Begriff → Build-Abbruch | Negativ-Fixture R3 (Test) + Build-Bruchtest R1 | PASS |
| AC-001-3 Definition aufrufbar ohne Seitenwechsel | Begriffslinks springen zum Anker auf der Glossarseite. Ein Popover auf anderen Seiten fehlt noch (Inhalte mit Begriffen folgen ab I2) | **teilweise**, offen für I2/I3 |
| AC-001-4 Abgrenzung der Begriffspaare | Test inkl. E19-Wertarten | PASS |
| AC-001-5 Kardinalitätsfehler | Domänenobjekte (Investment, Participation) folgen erst in I4 | NOT RUN (nicht im I1-Umfang) |
| AC-002-1/2 Aussagetyp und verifizierte Quelle Pflicht | Schema-Test + Negativ-Fixtures R2 (fehlende/unverifizierte Quelle) | PASS |
| AC-002-3 Typ nicht nur über Farbe | Badge = Text + Symbol | PASS (statisch) |
| AC-002-4/5 Quellenseite | Seite folgt in I6 (Platzhalter) | NOT RUN |
| AC-009-5 404-Seite | curl | PASS |
| AC-009-6 Startseite mit 7 Brüchen und Bereichen A–E | Rendering | PASS |
| AC-010-1 keine hartkodierten Farben | Test | PASS |
| AC-010-4 Kontraste Token-Paare | Test (berechnet) | PASS |
| AC-010-5 Orange nicht als Textfarbe, dunkler Text auf Orange | Test | PASS |
| AC-010-6 keine Schriftdateien | Test + `.gitignore` | PASS |

## NOT RUN
- **Browser-Sichtprüfung (Screenshot, Fokusreihenfolge, Viewports 768/1280/1920):** Das Vorschau-Tool war im Sitzungsordner noch an den alten Projektordner gebunden; die Konfiguration für den neuen Ordner (`.claude/launch.json`, `vdo-static`) ist angelegt und wirkt ab der nächsten Sitzungsrunde.
- **Manuelle Tastatur- und Screenreader-Prüfung** (AC-009-1, AC-009-7)
- **axe-Prüfung**: Werkzeug wird erst in I2 eingeführt (ADR-002)

## Befunde

| ID | Schwere | Befund | Vorschlag |
|---|---|---|---|
| QA-I1-1 | niedrig · **erledigt 07.10.2026** (Auftraggeber bestätigt Gruppierung, AC-001-1 Rev. 3) | AC-001-1 verlangt alphabetische Liste. Umgesetzt ist alphabetisch innerhalb der Kategorien Disziplinen / Steuerungsobjekte / Wertarten / Linientypen | Fachliche Entscheidung: Gruppierung beibehalten (übersichtlicher im Workshop) und AC präzisieren, oder rein alphabetisch. **AC nicht eigenmächtig geändert** |
| QA-I1-2 | niedrig | Zwei eigene Testfehler im ersten Lauf (Fixture ohne Gesamtkontext; fehlender `public/`-Ordner). Ursache lag im Test, nicht in der Anwendung; ein Fix je Ursache | erledigt |
| QA-I1-3 | info | `next build` meldet Validierungsfehler als „prerender error“ der Glossarseite. Die Meldung enthält Regel und Objekt, ist aber in Next-Ausgabe eingebettet | ggf. eigenes `validate:content`-Skript vor dem Build (ab I2) |

## Restrisiken
- R11 (neu): Dev-Audit-Befund in der Lint-Toolchain bis zu einem Fix in eslint-config-next.
- Darstellung ohne Aptos-Installation (Fallback Segoe UI/Arial) nicht visuell geprüft.
