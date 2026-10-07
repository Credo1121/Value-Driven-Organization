# Projektstand

**Stand:** 07.10.2026 · **Phase:** I3 Capability deep dive – **C2 als Musterseite fertig, Review durch Auftraggeber ausstehend**

## Gates
| Gate | Status |
|---|---|
| P0 Dokumentation, fachlich abgenommen | ✅ 07.10.2026 |
| I1 Walking Skeleton | ✅ PASS, Sichtprüfung Auftraggeber „passend“, Commit `66f39f2` |
| GitHub-Remote `origin` | ✅ gepusht 07.10.2026 (`main` → `origin/main`, Stand `add5f96`), Zugang per Fine-grained Token im macOS-Schlüsselbund |
| I2 Big picture | ✅ als PoC abgenommen (E25) |
| I3 Capability deep dive | C2 Entwurf + 7 Vorlagen umgesetzt, QA PASS (CHG-004); fachliches Review C2 ausstehend |

## Tatsächlicher Dateistand
- Git: Branch `main` verfolgt `origin/main` (github.com/Credo1121/Value-Driven-Organization, privat).
- Code: I1 (Glossar, Navigation, Tokens, Inhaltsvalidierung) + I2 (Gesamtbild, Fähigkeits-Platzhalter, Playwright/axe).
- Vorhanden: `CLAUDE.md`, `docs/` (inkl. `docs/design/tokens.md` aus CI-Screenshots) (Kontext, Stand, Register, Glossar, Modell, Quellen, REQ-001…010, Architektur, ADR-001/002, QA-Review P0).
- Vorarbeiten in `/Users/Marvin/Desktop/Claude/Portfolio Management/` unverändert.

## Aktive Elemente
- REQ-001…010: Draft
- CHG-001 Walking Skeleton: abgeschlossen
- CHG-002 Big picture (Netzdiagramm): durch CHG-003 ersetzt
- CHG-003 Swimlane-Matrix: abgenommen (PoC)
- CHG-004 Capability deep dive: C2 Entwurf, QA PASS mit Einschränkungen
- CHG-005 Clean Light-Redesign (E27): Kreis-Übersicht, Detailansicht mit Strahl und Einflusslinien, ganze Website; QA PASS
- ADR-001/002 Accepted, ADR-003 Accepted
- Kein BUG

## Offene Fragen an den Auftraggeber (priorisiert)
0. **Sichtprüfung Redesign** (http://localhost:4180/big-picture/)
1. **Review C2** (http://localhost:4180/capabilities/c2/): Rollen, Entscheidungsrechte je Ausprägung, Wertarten, typische Brüche – passt Tiefe und Ton für Workshops?
2. Danach: Inhalte C1, C3–C8 nach demselben Muster schreiben (Reihenfolge-Vorschlag: C4, C8, C3, C1, C5, C6, C7)

Zurückgestellt bis I7 (bestätigt): E5a–c (Hex-Werte, Webfont-Lizenz, Logo-SVG), E15 (Skill `eraneos-ci`), E4 (Hosting), E9 (Lizenzprüfung vor externer Nutzung).

## Letzte Evidenz
- 07.10.2026: Fester Ablauf je Inkrement in `CLAUDE.md` Abschn. 5a (E28)
- 07.10.2026: Kreis interaktiv (Klick + Mouse-over-Vorschau); `npm run check` Exit 0 – 65/65 Unit, 129/129 E2E
- 07.10.2026: CHG-005 – `npm run check` Exit 0: 65/65 Unit, 114/114 E2E (3 Browser) inkl. axe und Hydration-Prüfung
- 07.10.2026: CHG-004 – `npm run check` Exit 0: 65/65 Unit, 96/96 E2E (3 Browser), axe 0 serious/critical
- 07.10.2026: Gesamtbild als PoC abgenommen (E25), I3 freigegeben (E26)
- 07.10.2026: BUG-001 behoben, E24 umgesetzt (`d5b0f4d`); `npm run check` Exit 0 – 46/46 Unit, 54/54 E2E (Chromium, Firefox, WebKit)
- 07.10.2026: CHG-003 Swimlane-Matrix – `npm run check` Exit 0: 44/44 Unit, 17/17 E2E inkl. axe, Viewports 768–1920 px
- 07.10.2026: Push nach GitHub verifiziert (`git ls-remote origin` → `refs/heads/main` = `add5f96`)
- 07.10.2026: E22 umgesetzt (C2 EPM → LPM, C7 IT Ops); `npm run check` Exit 0, 50/50 Unit, 16/16 E2E
- 07.10.2026 14:15: CHG-002 – `npm run check` Exit 0: typecheck, lint, 47/47 Unit, build (18 Seiten), 15/15 E2E inkl. axe (0 serious/critical) und Viewports 768–1920 px; Screenreader/Firefox/Safari NOT RUN
- 07.10.2026: Commit `66f39f2` (P0 + I1), Remote origin eingerichtet; QA-I1-1 erledigt (AC-001-1 Rev. 3)
- 07.10.2026 13:43: CHG-001 – typecheck, lint, 22/22 Tests, build PASS; Build-Bruchtest PASS (Exit 1 bei R1-Verstoß); Offline-Auslieferung PASS; Browser-Sichtprüfung und manuelle a11y NOT RUN
- 07.10.2026: P0 vom Auftraggeber positiv bewertet; E19 Wertarten Target/Budget/Forecast/Actual ergänzt (Modell v0.4, K9–K11, AC-004-8, AC-005-9/10); A9 offen
- 07.10.2026: E6 entschieden (Halvard Industrial Group); lokales Git angelegt (`git init -b main`), kein Commit: Auftraggeber entscheidet, erst nach den ersten lokalen Tests zu committen (E18). Git-Identität fehlt noch und wird vom Auftraggeber selbst gesetzt
- 07.10.2026: E14 (alle Kombinationen zulässig), E18 (erst lokales Git, später GitHub), A2, A4 (offline) bestätigt; E5a–c bis I7 zurückgestellt
- 07.10.2026: A7 bestätigt (genau ein federführendes Portfolio); A8 verworfen (nicht jedes Portfolio gekoppelt, z. B. HR) → TN7 bedingt formuliert, Modell v0.3
- 07.10.2026: E13, E16, E17 entschieden; Modell v0.2 (PortfolioParticipation, K6–K8, TN1 neu, TN1b, TN7)
- 07.10.2026: A1 bestätigt (Skill 0 = Rahmen für Skills 1–7); CI-Screenshots S. 16/17 erhalten, Farbwerte per Pixelauslesung, Kontraste berechnet
- Quellenabruf 07.10.2026 (`docs/sources.md`); Gartner/PMI NICHT VERIFIZIERT (HTTP 403)

## Fixversuche
- BUG-001 Darstellung: 1 Fix, PASS. Testumgebung Firefox „navigation interrupted“: 2 erfolglose Fixversuche → Stopp → `7-help`-Diagnose (Portvergleich) → Ursache Port 4190 → Port 4210, PASS
- CHG-003: Lint (Memoisierung) 1 Fix; E2E Lane-Kopf nicht klickbar (Ursache: ganze Zeile ausgeblendet) 1 Fix; jeweils danach PASS
- CHG-002: 1 E2E-Fehler (Linie „hidden“), Ursache im Test (SVG-Linie mit Höhe 0), 1 Fix, danach PASS
- CHG-001: 2 Testfehler im ersten Lauf, Ursache jeweils im Test (Fixture-Kontext, fehlender `public/`-Ordner), je 1 Fix, danach PASS

## Nächster Schritt
Ablauf nach `CLAUDE.md` Abschn. 5a. Offen: Review C2 durch den PO (Schritt 7 von CHG-004); danach C4 Kostentransparenz ab Schritt 1 (`1-requirements-engineering`).
