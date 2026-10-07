# BUG-001 – Swimlane-Matrix: Text läuft in Firefox aus den Kacheln

- **Gemeldet:** 07.10.2026 vom Auftraggeber per Screenshot · **Schwere:** hoch (Präsentationsfähigkeit) · **REQ:** REQ-003 Rev. 2, AC-009-4, QZ2
- **Status:** behoben, verifiziert (Commit `d5b0f4d`)

## Soll / Ist
- **Soll:** Jede Kachel wächst mit ihrem Inhalt; kein Text überlagert die nächste Zeile.
- **Ist:** In Firefox ragten Titel, Wertarten-Chips und Übergabetexte aus den Kacheln und überdeckten die Zeile darunter.

## Reproduktion (Playwright, statischer Build, 1480 px)
| Browser | Höhe Kachel Enterprise/Fund | überlaufende Kacheln |
|---|---|---|
| Chromium 153 | 104 px | 0 |
| WebKit 26.6 | 103 px | 0 |
| **Firefox 155** | **58 px** | **19 von 32** |

## Ursache
Die Kachel (`<button>`) nutzte `height: 100%` in einer Tabellenzelle mit `height: 1px`. Firefox löst diese Prozenthöhe anders auf und begrenzte die Kachel auf die Zellhöhe ohne Inhalt. Die QA lief bis dahin nur in Chromium (QZ2 als NOT RUN dokumentiert).

## Fix (1 Versuch)
Die Tabellenzelle selbst ist jetzt der sichtbare Kasten (Rahmen, Hintergrund, Auswahl und Fokus über `:has()`). Der Button füllt sie ohne Prozenthöhe; ein `::after` macht den ganzen Kasten klickbar.

## Verifikation
- Messung in 3 Browsern × 3 Breiten (1280/1480/1920): 0 überlaufende Kacheln, 0 Überlappungen, kein horizontales Scrollen.
- Neuer E2E-Test „layout integrity“, läuft in **Chromium, Firefox und WebKit**.
- `npm run check` Exit 0: 46/46 Unit, 54/54 E2E (18 Tests × 3 Browser).

## Nebenbefund Testumgebung
- **Symptom:** In Firefox schlugen alle E2E-Tests mit „Navigation … is interrupted by another navigation to the same URL“ fehl, auch für einfache Seiten.
- **Zwei erfolglose Fixversuche** (Annahme: History-API von Next.js): Navigation im Test entzerrt; `waitUntil: 'commit'` mit anschließendem Warten auf `load`. Danach Codeänderungen angehalten, Diagnose nach `7-help`.
- **Diagnose:** Kontextoptionen, Gerätemodus, Tracing, Viewport, `localhost` vs. `127.0.0.1` ohne Einfluss. **Entscheidendes Experiment:** derselbe Server auf den Ports 4190, 4191, 4199, 4210, 5173, 8080 → nur **Port 4190** schlägt fehl. Die Ursache liegt in Playwright-Firefox mit diesem Port, nicht in der App. Der genaue Mechanismus ist ungeklärt.
- **Fix:** E2E-Server auf Port 4210. Die Hilfsfunktion `open()` (commit → load → networkidle) bleibt, weil sie robust und unschädlich ist.
