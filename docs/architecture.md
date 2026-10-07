# Architektur (Skizze, Status: Proposed)

Stand 07.10.2026. Umfang bewusst schlank (arc42-/C4-Prinzipien angemessen zum Projekt). Entscheidungen: ADR-001, ADR-002.

## 1. Systemkontext
```
Moderator (Laptop) ──► Browser ──► statische Web-App (HTML/JS/CSS)
                                     ▲
              Build (Node.js): Inhalte + Regeln validieren, Seiten generieren
```
- Keine externen Systeme, keine Laufzeit-API, keine Datenbank, keine Authentifizierung (Nicht-Scope v1).
- Auslieferung: statische Dateien, lokal oder über einen beliebigen statischen Host (E4 offen).

## 2. Bausteine und Zuständigkeiten
| Baustein | Pfad (geplant) | Verantwortung | Rolle |
|---|---|---|---|
| Inhalte & Quellen | `content/` | Fähigkeiten, Glossar, Quellen, Referenzansätze, Regeltexte, Beispieldatensatz (strukturiert, EN) | Requirements / Inhalt |
| Domänenmodell | `src/domain/` | Typen, Beziehungen, Konsistenzregeln K/W/R/T (pure TypeScript) | Backend |
| Szenarioregeln | `src/scenarios/` | Regelauswertung D1–D7/X → Q1–Q7, deterministisch (pure TypeScript) | Backend |
| Inhaltsvalidierung | `src/content/` | Laden + Schema-Validierung zur Build-Zeit; Build bricht bei Verstößen ab | Backend |
| UI | `src/ui/` | Komponenten, Design-Tokens, SVG-Visualisierung | Frontend |
| Routen | `app/` | Seiten gemäß Seitenstruktur | Frontend |
| Tests | neben dem Code bzw. `tests/` | Unit (Regeln), Eigenschaftstests (Szenarien), E2E/a11y (Nutzerreisen) | QA |

**Abhängigkeitsrichtung:** `app` → `ui` → `scenarios`/`domain`. `content` wird über `src/content` validiert und an `domain` gebunden. `domain` und `scenarios` importieren **nichts** aus UI oder Next.js → unabhängig testbar.

## 3. Datenflüsse
1. Build: `content/*` → Schema-Validierung → Konsistenzprüfung (K/W/R/T) → statische Seiten.
2. Laufzeit: Szenario-Auswahl → URL-Query → `evaluateScenario(config)` im Browser (pure Funktion) → Darstellung.
3. Keine Datenflüsse nach außen.

## 4. Vertrag (intern)
Statt API-Endpunkten gilt ein **Schema-Vertrag** für Inhalte und Regeln. Er ist die verbindliche Quelle und wird in I1 festgelegt (Kandidat: Zod-Schemas in `src/content/schema.ts`, Typen daraus abgeleitet).
- `Statement { text, statementType, sourceIds?, rationale?, conditions? }`
- `Source { id, title, url, retrieved, version, supports[], limits, license, status }`
- `Rule` gemäß `docs/domain/model.md` 6.3
- `ScenarioConfig` = D1–D7 + X, `evaluateScenario(config): ScenarioResult` (Q1–Q7, tensions, atypical flags)
- URL-Kodierung der `ScenarioConfig`: kurze, stabile Schlüssel. Unbekannte Werte → Standardwert + Hinweis (AC-006-5).

## 5. Vertrauensgrenzen und Sicherheit
- Einzige Eingabe: URL-Parameter der Szenariokonfiguration → Whitelist-Parsing, keine Interpretation als HTML.
- Keine Secrets, keine Cookies, keine personenbezogenen Daten.
- Hosting später: Content-Security-Policy und Security-Header beim Host (E4).
- Bedrohungsanalyse (kurz): Assets = Integrität der Inhalte, Reputation. Eintrittspunkte = URL-Parameter, Abhängigkeiten (Supply Chain). Maßnahmen = Whitelist-Parsing, Lockfile, minimale Abhängigkeiten, Dependency-Audit in CI. OWASP-ASVS-Bezug wird erst relevant, wenn Login/Speicherung hinzukommen (E8).

## 6. Qualitätsziele → Maßnahmen
| Ziel | Maßnahme |
|---|---|
| Fachliche Korrektheit / Quellentreue | Build-Validierung R1–R3, Aussagetypen, Quellenstatus |
| Konsistenz Kosten/Finanzierung | getrennte Typen (K3, K4), Regeltests K1–K11 |
| Determinismus Szenarien | pure Funktionen, Eigenschaftstest über alle Kombinationen |
| Workshopfestigkeit / Offline | statischer Export, keine Laufzeitabhängigkeit |
| Zugänglichkeit | semantisches HTML, SVG mit Textalternative, axe + manuelle Prüfung |
| Austauschbares Design | Design-Tokens (REQ-010) |

## 7. Teststrategie (Grenzen)
- **Unit:** `src/domain`, `src/scenarios`. Spezifikationstests aus Entscheidungstabellen, die **vor** der Implementierung entstehen.
- **Eigenschaftstests:** alle Szenario-Kombinationen (Vollständigkeit, Determinismus).
- **Negativ-Fixtures:** absichtlich inkonsistente Daten müssen von der Validierung abgelehnt werden.
- **E2E + a11y:** zentrale Nutzerreisen im Browser (Kandidat Playwright + axe), in I2 entschieden.
- **Build-Gates:** Typecheck, Lint, Inhaltsvalidierung, `next build`.
- Konkrete Werkzeuge und Versionen werden in I1 per ADR fixiert. Dieses Dokument nennt nur Kandidaten.

## 8. Betrieb
Kein Laufzeitbetrieb im engeren Sinn. Logging, Monitoring und Backups entfallen für v1. Versionierung über Git, sobald freigegeben. Release-Planung in I7 durch `6-deploy` (prepare).
