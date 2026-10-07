# QA – CHG-003 Swimlane-Matrix (REQ-003 Rev. 2)

- **Datum:** 07.10.2026 · **Rolle:** `5-qa` · **Basis:** Commit `d392653` + Arbeitsverzeichnis · Node 24.20.0, Chromium 153
- **Einschränkung:** Rollenwechsel im selben Modell, keine unabhängige Prüfung. ACs Rev. 2 noch nicht vom Auftraggeber bestätigt.

## Ergebnis: **PASS mit Einschränkungen** (`npm run check` Exit 0)

| Prüfung | Ergebnis |
|---|---|
| typecheck, lint | PASS (1 Lint-Befund während der Umsetzung behoben: instabile Memoisierung) |
| Unit (Vitest) | PASS: 44/44 |
| Build | PASS: 18 Seiten |
| E2E + axe (Playwright) | PASS: 17/17 |
| Sichtprüfung Screenshots 1280/1440 px (Struktur, Phase 2, vollständig mit Auswahl) | PASS: kein horizontales Scrollen, Text nicht abgeschnitten, Matrix 1280 px ≈ 860 px hoch |

## Abdeckung REQ-003 Rev. 2
| AC | Prüfung | Status |
|---|---|---|
| AC-003-1 Phasen, Lanes, Gruppen | Unit (Reihenfolge, Zuordnung C1–C8) + E2E (Spaltenköpfe, Zeilenreihenfolge) | PASS |
| AC-003-2 Übergaben mit Richtung/Inhalt als Text, Rückkopplung beschriftet | E2E | PASS |
| AC-003-3 Detailansicht per Enter, Esc | E2E | PASS |
| AC-003-4 Moderationsreihenfolge, keine Layoutverschiebung | Unit + E2E (Höhe vor/nach gleich) | PASS |
| AC-003-5 Köpfe öffnen Fähigkeitsseite | E2E (Operate → c7, Cost transparency → c4) | PASS |
| AC-003-6 semantische Tabelle + Textansicht | E2E (6 Phasen, Übergaben, parallele Lanes, Rückkopplung) | PASS automatisiert; Screenreader **NOT RUN** |
| AC-003-7 Build-Abbruch bei Inhaltsfehlern | Unit-Negativ-Fixtures (unbekannte Lane/Phase, Dublette, Übergabe ohne Text/mit Phasenwechsel/aus paralleler Lane, Fähigkeit nicht/doppelt platziert, Glossar-Marker) + realer Build-Abbruch bei fehlender Zielzelle | PASS |
| AC-009-4 Viewports 768–1920 px | E2E | PASS |
| AC-009-7 axe (Struktur-Schritt, vollständig, Auswahl, Textansicht, weitere Routen) | E2E | PASS |

## Befunde
| ID | Befund | Status |
|---|---|---|
| QA-I2-4 | Inhaltsvalidierung fand beim ersten Build eine Übergabe Portfolio → Delivery (Fund) ohne Zielzelle; Inhalt ergänzt („Receive budget & capacity“) | erledigt – Validierung wirkt wie vorgesehen |
| QA-I2-5 | E2E: Kopf „Cost transparency“ im Struktur-Schritt nicht klickbar, weil die ganze Zeile ausgeblendet war. Reproduziert (visibility hidden), 1 Fix: nur Zellen ausblenden, Lane-Köpfe zeigen; Regressionsprüfung ergänzt | erledigt |
| QA-I2-6 | Abgedämpfte Lane-Köpfe zunächst per Deckkraft; ersetzt durch hellen Rand, damit der Textkontrast unverändert bleibt; axe-Test für Schritt 1 ergänzt | erledigt |

## NOT RUN
Screenreader, Firefox/Safari, fachliches Review der 32 Zellinhalte durch den Auftraggeber.
