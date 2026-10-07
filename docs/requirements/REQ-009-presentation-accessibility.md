# REQ-009 – Presentation use & accessibility

- **Status:** Draft · **Revision:** 1 · **Prio:** Must · **Inkrement:** alle, Härtung I7
- **Quelle:** Auftrag Abschn. 13 [BEST]

## Problem und Nutzen
Die App wird im moderierten Gespräch auf einem geteilten Bildschirm bedient. Sie muss schnell, ruhig und für alle lesbar sein.

## Scope
Navigation, Tastaturbedienung, Fokus, Kontrast, Nicht-Farb-Kodierung, responsive Grenzen, Lade-/Leer-/Fehlerzustände (soweit relevant), Startseite `/` mit Wegweiser.

## Akzeptanzkriterien
- **AC-009-1** Given eine beliebige Seite, then sind alle interaktiven Elemente per Tastatur erreichbar und bedienbar, mit sichtbarem Fokus.
- **AC-009-2** Given Text und bedeutungstragende Grafikelemente, then erfüllen Kontraste WCAG 2.2 AA (Text 4,5:1 bzw. 3:1 für großen Text; Nicht-Text-Kontrast 3:1).
- **AC-009-3** Given eine Unterscheidung über Farbe (Beziehungstyp, Aussagetyp, Disziplin), then existiert ein zweites Merkmal (Form, Muster, Text).
- **AC-009-4** Given Breiten 1280, 1440 und 1920 px, then ist der Inhalt ohne horizontales Scrollen vollständig lesbar. Bei 768 px ist er nutzbar (Diagramm darf auf Textalternative umschalten).
- **AC-009-5** Given eine unbekannte URL, then erscheint eine verständliche 404-Seite mit Link zum Start.
- **AC-009-6** Given die Startseite, then werden die sieben Brüche und die Wege in die Bereiche A–E angeboten.
- **AC-009-7** Given automatische a11y-Prüfung (axe) auf allen Routen, then keine Verstöße der Stufen „serious“ oder „critical“. Manuelle Tastatur- und Screenreader-Stichprobe ist dokumentiert. Fehlt sie, wird sie als NOT RUN geführt.
- **AC-009-8** Given `prefers-reduced-motion`, then werden Übergänge reduziert.

## Hinweis
Automatische Prüfungen belegen keine vollständige WCAG-Konformität. Eine Konformitätsaussage wird nicht getroffen.
