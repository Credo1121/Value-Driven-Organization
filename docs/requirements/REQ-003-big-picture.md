# REQ-003 – Big picture

- **Status:** Draft · **Revision:** 1 · **Prio:** Must · **Inkrement:** I2
- **Quelle:** Auftrag Abschn. 8A, 10, 13 [BEST]; Fähigkeiten-Synthese `model.md` Abschn. 1 [SYN]

## Problem und Nutzen
Der Einstiegspunkt im Workshop. Er soll in wenigen Minuten zeigen, dass EPM, TBM, LPM und EA **gemeinsame Steuerungsfähigkeiten** bedienen, und wie Entscheidungen, Mittel, Kosten, Umsetzung, Architektur und Ergebnisse fließen.

## Scope
- Seite `/big-picture`: 8 Steuerungsfähigkeiten (C1–C8), Beiträge der vier Disziplinen, Finance als angrenzende Umwelt, typisierte Verbindungen, Rückkopplung
- Filter je Beziehungsart; schrittweises Einblenden für die Moderation
- Textalternative (strukturierte Liste/Tabelle der Fähigkeiten und Verbindungen)
- **Nicht-Scope:** frei editierbares Diagramm, Zoom/Pan, Animationen über einfache Übergänge hinaus

## Geschäftsregeln
- Jede sichtbare Verbindung hat genau einen der sechs Beziehungstypen und eine Kurzbeschreibung (`model.md` Abschn. 4).
- Keine vier isolierten Framework-Kacheln. Disziplinen erscheinen als Beitrag zu Fähigkeiten.
- Primär-/Unterstützungszuordnung ist als *Our synthesis* gekennzeichnet.

## Akzeptanzkriterien
- **AC-003-1** Given die Seite, then sind C1–C8 sichtbar, je mit Namen und primären Disziplinen; Finance-Prozesse sind als angrenzend dargestellt.
- **AC-003-2** Given eine Verbindung, then ist ihr Typ über Linienstil/Pfeilform und Beschriftung oder Legende erkennbar, auch in Graustufen.
- **AC-003-3** Given der Filter „Funding“, when aktiviert, then werden nur Funding-Verbindungen hervorgehoben und die übrigen zurückgenommen; der aktive Filter ist textlich erkennbar.
- **AC-003-4** Given der Moderationsmodus, when der Nutzer „next“ (Taste/Button) wählt, then wird die nächste Ebene eingeblendet (Reihenfolge: Fähigkeiten → Disziplinbeiträge → Beziehungstypen einzeln → Rückkopplung).
- **AC-003-5** Given eine Fähigkeit, when per Klick oder Enter aktiviert, then öffnet sich deren Vertiefung (REQ-004).
- **AC-003-6** Given ein Screenreader- oder Tastaturnutzer, then sind alle Fähigkeiten und Verbindungen über die Textalternative mit gleicher Information erreichbar.
- **AC-003-7** Given das Inhaltsmodell, when eine Verbindung keinen Typ oder keine Beschreibung hat, then schlägt der Build fehl.

## Qualitätsanforderungen
Lesbar auf Präsentationsbildschirm bei 1280 px Breite (Mindestschriftgröße wird in I2 festgelegt). Fester Koordinatensatz, kein Layout-Springen.

## Offene Fragen
Ob die Kantenmenge auf Fähigkeitsebene fachlich vollständig ist, klärt ein Review mit dem Auftraggeber in I2.
