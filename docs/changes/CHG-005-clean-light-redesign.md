# CHG-005 – Clean Light-Redesign, Kreis-Übersicht und Einflusslinien (E27)

- **Datum:** 07.10.2026 · **Auslöser:** Auftraggeber nach Sichtung der Konzepte A–D (`docs/design/concepts/`)
- **Entscheidung:** E27 [BEST] · **REQ:** REQ-003 (Darstellung), REQ-009, REQ-010

## Ziel
Hochwertigere, intuitivere Website im cleanen, Apple-nahen Light-Look: Konzept C als Einstiegs- und Übersichtsbild, Konzept A als Detailansicht, gepunktete Einflusspfeile aus B.

## Änderungen
| Bereich | Änderung |
|---|---|
| Tokens | `src/ui/tokens.css`: Apple-Neutraltöne (#1d1d1f, #f5f5f7, #6e6e73 …), Systemschrift (SF Pro auf Apple-Geräten), Glas-Flächen, weiche Schatten, größere Radien; Eraneos-Orange bleibt einziger Akzent. Token-Namen unverändert |
| Global | sticky Glas-Navigation mit Pillen, große enge Headlines, keine Versal-Labels mehr |
| Übersicht (neu) | `CycleOverview.tsx`, `geometry.ts`, `cycle.module.css`: Kreis mit 6 Phasen × 3 Ebenen-Ringen, dünne Außenlinie für TBM/EA (ohne Punkt-Halo), Zentrum „Outcomes feed the next cycle“, Phasenwahl per Pillen, Karte rechts mit Enterprise-/Portfolio-/Delivery-Ebene, Übergaben ↓/↑, „Next“-Hinweis, Links zur Fähigkeit und zur Detailansicht |
| Detailansicht | `SwimlaneMatrix.tsx` + `swimlanes.module.css`: große Ziffern 1–6, Strahl unter den Phasen wächst mit dem Fortschritt, Glas-Kacheln, gepunktete Einflusspfeile nach unten (orange) und in die nächste Phase (grau), gemessen aus den gerenderten Kacheln |
| Weitere Seiten | Start, Glossar, Fähigkeitsübersicht und C2 im neuen Stil (Karten, Pillen, ruhige Labels) |
| Tests | E2E: Übersicht, Phasenwechsel, Ebenen in der Karte, Einflusslinien, Strahl, keine Hydration-/Konsolenfehler |

## Prüfungen
`npm run check` Exit 0: 65/65 Unit, 114/114 E2E (Chromium, Firefox, WebKit) inkl. axe. Sichtprüfung Übersicht, Detailansicht (Fund, Prioritise, vollständig), Start, Glossar, C2.

## Befunde während der Umsetzung
| Befund | Ursache | Fix |
|---|---|---|
| React-Hydration-Fehler #418 in allen Browsern | dynamischer Mischtext im SVG-`<title>` (per Dev-Server lokalisiert) | Titel als ein String |
| Pfeile überlagerten Kacheln bzw. fehlten beim Durchgehen | zu geringer Zeilen-/Spaltenabstand; „Next“-Pfeil nur bei bereits sichtbarer Folgephase | Abstände vergrößert, Mindestlänge für Pfeile, „Next“-Pfeil immer zur Folgephase |
| 3 Farbwerte außerhalb der Token-Datei (Test AC-010-1 FAIL) | neue Schatten/Glas | als Tokens ergänzt |
| Kontrastfehler auf `/capabilities/` (axe) | große Bereichsbuchstaben in Hellgrau | auf `--c-grey-700` (4,6:1) |

## Abweichung von der CI-Dokumentation
Die warmen Eraneos-Grautöne und Aptos werden durch Apple-Neutraltöne und die Systemschrift ersetzt (E27). `docs/design/tokens.md` beschreibt weiterhin die CI-Herkunft; für das Projekt gilt `src/ui/tokens.css`.

## Nachtrag 07.10.2026 – Interaktiver Kreis (Schritte 1 und 2) [BEST]
- **Klick im Kreis:** Jedes Phasen-Segment ist ein Button (Klick, Enter, Leertaste); Auswahl aktualisiert Hervorhebung, Pfeile, Karte und Pillen.
- **Mouse-over als Vorschau:** Überfahren zeigt die Phase in der Karte mit Hinweis „Preview – click to select“; beim Verlassen springt die Ansicht zur gewählten Phase zurück. Auf Touch-Geräten wirkt nur der Klick (kein Mouse-over nötig).
- **Korrekturen nach Sichtprüfung:** Pillen zeigen während der Vorschau weiter die gewählte Phase; der Abwärtspfeil beginnt an der obersten Ebene, die in der Phase tätig ist (z. B. Operate ab Portfolio).
- **Prüfung:** `npm run check` Exit 0 – 65/65 Unit, 129/129 E2E (5 neue Interaktionstests × 3 Browser, inkl. Tastatur und axe).
