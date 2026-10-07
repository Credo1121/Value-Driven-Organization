# QA – CHG-002 Big picture (I2, REQ-003)

- **Datum:** 07.10.2026, 13:55–14:15 CEST · **Rolle:** `5-qa`
- **Basis:** Commit `66f39f2` + Arbeitsverzeichnis (I2), macOS, Node v24.20.0, Chromium Headless Shell 153 (Playwright 1.63.0)
- **Einschränkung:** Rollenwechsel im selben Modell, keine unabhängige Prüfung.

## Ergebnis: **PASS mit Einschränkungen**
Alle Akzeptanzkriterien von REQ-003 sind automatisiert im Browser geprüft. Die fachliche Vollständigkeit der Kanten (offene Frage in REQ-003) und eine manuelle Screenreader-Prüfung stehen aus.

## Ausgeführte Prüfungen (`npm run check`, Exit 0)

| Prüfung | Ergebnis |
|---|---|
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm test` (Vitest) | **PASS**: 47/47 (25 neu für das Gesamtbild) |
| `npm run build` | **PASS**: 18 statische Seiten, inkl. `/capabilities/c1…c8/` |
| `npm run test:e2e` (Playwright gegen den statischen Export, Offline-Server) | **PASS**: 15/15 |
| `npm audit --omit=dev` | **PASS**: 0 Befunde |
| Visuelle Sichtprüfung (Screenshots 1280/1440 px, vollständiges Bild, Fokus „Funding“, Schritt 2) | **PASS**: Linientypen in Graustufen unterscheidbar, keine Linie durch fremde Knoten, Text nicht abgeschnitten |

## Abdeckung REQ-003

| AC | Testebene | Status |
|---|---|---|
| AC-003-1 C1–C8 mit Namen und Leitdisziplinen, Finance angrenzend | Unit (Inhalt) + E2E (sichtbar) | PASS |
| AC-003-2 Linientyp ohne Farbe erkennbar | Unit: eindeutige Signatur aus Muster/Doppellinie/Endmarke je Typ; Legende nennt Stil im Text; Sichtprüfung | PASS |
| AC-003-3 Filter „Funding“ hebt nur Funding hervor, Fokus textlich benannt | Unit (Zustandslogik) + E2E (Klassen, `aria-pressed`, Text „Focus: Funding“, Esc) | PASS |
| AC-003-4 Moderationsschritte in vorgegebener Reihenfolge, Taste und Button | Unit (Reihenfolge) + E2E (→, PageDown, ←, Buttons) | PASS |
| AC-003-5 Fähigkeit per Enter öffnen | E2E | PASS (Zielseite ist ein Platzhalter bis I3) |
| AC-003-6 Textalternative mit gleicher Information | E2E: 8 Zeilen, 15 Verbindungen; SVG `aria-hidden`, Fähigkeiten als Links | PASS (automatisiert); Screenreader manuell **NOT RUN** |
| AC-003-7 Verbindung ohne Typ oder Beschreibung → Build-Abbruch | Unit: Negativ-Fixtures (fehlender Typ, leere Beschreibung, unbekannter Typ, unbekannter Knoten, isolierte Fähigkeit) | PASS |
| Qualität: fester Koordinatensatz | Unit: keine Überlappung, Routen beginnen/enden an Knotenkanten, orthogonal, keine Kreuzung fremder Knoten | PASS |
| AC-009-4 Viewports | E2E 1280/1440/1920 ohne horizontales Scrollen; 768 px nutzbar; < 768 px Hinweis + Textansicht | PASS |
| AC-009-7 axe | E2E: 0 serious/critical auf `/big-picture/` (vollständig + Fokus + Textansicht), `/`, `/glossary/`, `/capabilities/`, `/capabilities/c5/` | PASS (automatisiert) |

## NOT RUN
- Manuelle Screenreader-Prüfung (VoiceOver) und vollständige Tastatur-Fokusreihenfolge
- Firefox und Safari (nur Chromium automatisiert, QZ2)
- Fachliches Review der 15 Verbindungen durch den Auftraggeber (offene Frage REQ-003)

## Befunde

| ID | Schwere | Befund | Status |
|---|---|---|---|
| QA-I2-1 | niedrig | E2E-Test meldete die erste Linie als „hidden“. Reproduktion: Die Linie war gezeichnet (57 × 0 px), Playwright wertet Elemente mit Höhe 0 als unsichtbar. **Ursache im Test**, nicht in der App. Ein Fix: eigene Prüfung „gezeichnet“ (Länge > 10 px, Deckkraft 1) | erledigt |
| QA-I2-2 | info | Das Vorschau-Tool der Desktop-App liest weiterhin die Startkonfiguration des alten Ordners; Ersatz: Playwright-Screenshots unter `.qa-shots/` (nicht versioniert) | offen (Werkzeug) |
| QA-I2-3 | info | Mindestschriftgröße (QA-P0-4) festgelegt: Diagrammtext skaliert mit der Breite, Untergrenze 14 px (Code/Disziplinen) bzw. 16 px (Fähigkeitsname) | erledigt |

## Restrisiken
- Kantenmenge ist unsere Synthese ([SYN]) und noch nicht fachlich abgenommen.
- R11 (Dev-Audit braces) unverändert.
