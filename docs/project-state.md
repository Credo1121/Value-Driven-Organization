# Projektstand

**Stand:** 07.10.2026 · **Phase:** I2 Big picture – **umgesetzt, lokal getestet und committet; Review durch Auftraggeber ausstehend**

## Gates
| Gate | Status |
|---|---|
| P0 Dokumentation, fachlich abgenommen | ✅ 07.10.2026 |
| I1 Walking Skeleton | ✅ PASS, Sichtprüfung Auftraggeber „passend“, Commit `66f39f2` |
| GitHub-Remote `origin` | eingerichtet; **Push durch Auftraggeber ausstehend** |
| I2 Big picture | ✅ umgesetzt, QA PASS mit Einschränkungen (`docs/qa/CHG-002-big-picture.md`); fachliches Review der Verbindungen ausstehend |
| Freigabe I3 (Capability deep dive) | ⏳ nicht erteilt |

## Tatsächlicher Dateistand
- Git: Branch `main`, Remote `origin` = github.com/Credo1121/Value-Driven-Organization (noch nicht gepusht).
- Code: I1 (Glossar, Navigation, Tokens, Inhaltsvalidierung) + I2 (Gesamtbild, Fähigkeits-Platzhalter, Playwright/axe).
- Vorhanden: `CLAUDE.md`, `docs/` (inkl. `docs/design/tokens.md` aus CI-Screenshots) (Kontext, Stand, Register, Glossar, Modell, Quellen, REQ-001…010, Architektur, ADR-001/002, QA-Review P0).
- Vorarbeiten in `/Users/Marvin/Desktop/Claude/Portfolio Management/` unverändert.

## Aktive Elemente
- REQ-001…010: Draft
- CHG-001 Walking Skeleton: abgeschlossen
- CHG-002 Big picture: umgesetzt, QA PASS mit Einschränkungen
- ADR-001/002 Accepted, ADR-003 Accepted
- Kein BUG

## Offene Fragen an den Auftraggeber (priorisiert)
1. **Push zu GitHub** durch den Auftraggeber (`git push -u origin main`)
2. **Fachliches Review** des Gesamtbilds: Sind die 15 Verbindungen und die Leitdisziplinen so tragfähig?
3. **Gate:** Freigabe I3 (Capability deep dive, Start mit C2)

Zurückgestellt bis I7 (bestätigt): E5a–c (Hex-Werte, Webfont-Lizenz, Logo-SVG), E15 (Skill `eraneos-ci`), E4 (Hosting), E9 (Lizenzprüfung vor externer Nutzung).

## Letzte Evidenz
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
- CHG-002: 1 E2E-Fehler (Linie „hidden“), Ursache im Test (SVG-Linie mit Höhe 0), 1 Fix, danach PASS
- CHG-001: 2 Testfehler im ersten Lauf, Ursache jeweils im Test (Fixture-Kontext, fehlender `public/`-Ordner), je 1 Fix, danach PASS

## Nächster Schritt
Auftraggeber pusht nach GitHub und prüft das Gesamtbild (`npm run build && npm run serve:out` → http://localhost:4180/big-picture/) → fachliches Feedback zu den Verbindungen → Freigabe I3 (`1-requirements-engineering` für Inhalte C2, dann `3-frontend`, `5-qa`).
