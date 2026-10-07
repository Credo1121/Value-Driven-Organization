# QA – CHG-004 Capability deep dive (REQ-004)

- **Datum:** 07.10.2026 · **Rolle:** `5-qa` · Node 24.20.0; Chromium 153, Firefox 155, WebKit 26.6
- **Einschränkung:** Rollenwechsel im selben Modell; fachliche Inhalte C2 sind Entwurf und vom Auftraggeber abzunehmen.

## Ergebnis: **PASS mit Einschränkungen** (`npm run check` Exit 0)
| Prüfung | Ergebnis |
|---|---|
| typecheck, lint | PASS |
| Unit (Vitest) | PASS: 65/65 (19 neu) |
| Build | PASS: 18 Seiten |
| E2E + axe, 3 Browser | PASS: 96/96 (14 neue Tests × 3) |
| Sichtprüfung C2 in Firefox und WebKit (ganze Seite, 1440 px) | PASS nach 2 kleinen Korrekturen (s. Befunde) |

## Abdeckung REQ-004
| AC | Prüfung | Status |
|---|---|---|
| AC-004-1 acht Abschnitte, offene explizit | Unit (C2 befüllt, 7 Vorlagen offen) + E2E (C2 vollständig, C5 8× „Open – to be defined.“) | PASS |
| AC-004-2 Entscheidungsrechte je Ausprägung | Unit (alle Zeilen unterschiedlich befüllt, EPM → LPM) + E2E | PASS |
| AC-004-3 Datenobjekte → Glossar | Unit + E2E (Klick führt zu `/glossary/#forecast`) | PASS |
| AC-004-4 Schnittstellen mit Ziel und Beziehungsart | Unit + E2E | PASS |
| AC-004-5 Link zur Beispielstation | Unit (S4 hinterlegt); Ziel folgt mit I4 | PASS (Hinweistext), Link NOT RUN bis I4 |
| AC-004-6 Bruch-Zuordnung | Unit + E2E | PASS |
| AC-004-7 fehlender Abschnitt → Build-Abbruch | Unit-Negativ-Fixture (Schema) | PASS |
| AC-004-8 Wertarten in C2 mit Finance-Schnittstelle | Unit + E2E; Negativ-Fixture ohne Forecast | PASS (C4 folgt) |

## Befunde
| ID | Befund | Status |
|---|---|---|
| QA-I3-1 | Seitennavigation listete „Financial value types“ am Ende, auf der Seite steht der Abschnitt nach „Decision rights“ | behoben, E2E-Test ergänzt |
| QA-I3-2 | Typische Brüche standen nicht in der Reihenfolge der sieben Brüche (1, 3, 2, …) | behoben, E2E-Test ergänzt |

## NOT RUN
Screenreader; fachliches Review C2 durch den Auftraggeber; Link zur Beispielstation (I4).
