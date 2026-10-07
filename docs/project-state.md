# Projektstand

**Stand:** 07.10.2026 · **Phase:** I1 Walking Skeleton – **umgesetzt, lokale Tests PASS; Sichtprüfung durch Auftraggeber ausstehend**

## Gates
| Gate | Status |
|---|---|
| Plan freigegeben | ✅ 07.10.2026 |
| P0-Dokumentation erstellt | ✅ 07.10.2026 |
| P0 fachlich abgenommen (Auftraggeber) | ✅ 07.10.2026 abgeschlossen (inkl. E19 Wertarten, A9) |
| QA-Testbarkeit P0 | keine Blocker mehr (QA-P0-1/2 entschieden 07.10.2026); offene Hinweise QA-P0-3…8, siehe `docs/qa/P0-requirements-review.md` |
| Lokales Git-Repository | initialisiert 07.10.2026, **bewusst ohne Commit** (E18): Commit erst nach den ersten lokalen Tests |
| Freigabe I1 (Code, Installation) | ✅ 07.10.2026 erteilt (lokal, ohne Commit/Remote) |

## Tatsächlicher Dateistand
- Lokales Git-Repository initialisiert (Branch `main`, kein Commit, kein Remote).
- I1-Code vorhanden (Next.js 16.4.0 statisch, Glossar, Navigation, Tokens, Inhaltsvalidierung); Abhängigkeiten installiert (`node_modules`, nicht versioniert).
- Vorhanden: `CLAUDE.md`, `docs/` (inkl. `docs/design/tokens.md` aus CI-Screenshots) (Kontext, Stand, Register, Glossar, Modell, Quellen, REQ-001…010, Architektur, ADR-001/002, QA-Review P0).
- Vorarbeiten in `/Users/Marvin/Desktop/Claude/Portfolio Management/` unverändert.

## Aktive Elemente
- REQ-001…010: Draft
- CHG-001 Walking Skeleton: umgesetzt, QA PASS mit Einschränkungen (`docs/qa/CHG-001-walking-skeleton.md`)
- ADR-001/002 Accepted, ADR-003 Accepted
- Kein BUG

## Offene Fragen an den Auftraggeber (priorisiert)
1. **Sichtprüfung I1** im Browser durch den Auftraggeber (`npm run serve:out`)
2. **QA-I1-1:** Glossar gruppiert nach Kategorien (alphabetisch je Gruppe) beibehalten und AC-001-1 anpassen?
3. **Gate:** erster lokaler Commit nach Sichtprüfung (E18); dafür Git-Identität setzen
4. **Gate:** Freigabe I2 (Big picture)

Zurückgestellt bis I7 (bestätigt): E5a–c (Hex-Werte, Webfont-Lizenz, Logo-SVG), E15 (Skill `eraneos-ci`), E4 (Hosting), E9 (Lizenzprüfung vor externer Nutzung).

## Letzte Evidenz
- 07.10.2026 13:43: CHG-001 – typecheck, lint, 22/22 Tests, build PASS; Build-Bruchtest PASS (Exit 1 bei R1-Verstoß); Offline-Auslieferung PASS; Browser-Sichtprüfung und manuelle a11y NOT RUN
- 07.10.2026: P0 vom Auftraggeber positiv bewertet; E19 Wertarten Target/Budget/Forecast/Actual ergänzt (Modell v0.4, K9–K11, AC-004-8, AC-005-9/10); A9 offen
- 07.10.2026: E6 entschieden (Halvard Industrial Group); lokales Git angelegt (`git init -b main`), kein Commit: Auftraggeber entscheidet, erst nach den ersten lokalen Tests zu committen (E18). Git-Identität fehlt noch und wird vom Auftraggeber selbst gesetzt
- 07.10.2026: E14 (alle Kombinationen zulässig), E18 (erst lokales Git, später GitHub), A2, A4 (offline) bestätigt; E5a–c bis I7 zurückgestellt
- 07.10.2026: A7 bestätigt (genau ein federführendes Portfolio); A8 verworfen (nicht jedes Portfolio gekoppelt, z. B. HR) → TN7 bedingt formuliert, Modell v0.3
- 07.10.2026: E13, E16, E17 entschieden; Modell v0.2 (PortfolioParticipation, K6–K8, TN1 neu, TN1b, TN7)
- 07.10.2026: A1 bestätigt (Skill 0 = Rahmen für Skills 1–7); CI-Screenshots S. 16/17 erhalten, Farbwerte per Pixelauslesung, Kontraste berechnet
- Quellenabruf 07.10.2026 (`docs/sources.md`); Gartner/PMI NICHT VERIFIZIERT (HTTP 403)

## Fixversuche
- CHG-001: 2 Testfehler im ersten Lauf, Ursache jeweils im Test (Fixture-Kontext, fehlender `public/`-Ordner), je 1 Fix, danach PASS

## Nächster Schritt
Auftraggeber sieht die App lokal an (`npm run serve:out` → http://localhost:4180) → Entscheidung QA-I1-1 → Git-Identität setzen → erster lokaler Commit → Freigabe I2 (Big picture: `3-frontend` mit `5-qa`, Einführung Playwright/axe).
