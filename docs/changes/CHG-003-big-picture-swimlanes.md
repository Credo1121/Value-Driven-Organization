# CHG-003 – Gesamtbild als Swimlane-Matrix (REQ-003 Rev. 2)

- **Datum:** 07.10.2026 · **Auslöser:** Sichtprüfung durch den Auftraggeber („sehr diffus … schwer zu verstehen und zu vermitteln“)
- **Entscheidung:** E23 [BEST] – Swimlanes Phasen × Ebenen, Netzdiagramm wird ersetzt
- **REQ:** REQ-003 Rev. 2 (ACs neu gefasst, Bestätigung durch den Auftraggeber offen)

## Ziel
Ein Bild mit klarer Leserichtung: Sequenz von links nach rechts, Hierarchie von oben nach unten, Paralleles darunter.

## Änderungen
| Bereich | Änderung |
|---|---|
| Inhalt | `content/big-picture.json`: neu `phases` (6, je eine Kreislauf-Fähigkeit), `lanes` (3 Hierarchie, 2 parallel, 1 angrenzend), `cells` (32 Tätigkeiten mit Wertarten und Übergaben), `feedback`; Verbindungsliste `links` und `environment` entfernt |
| Vertrag | `src/content/schema.ts`: Phase-, Lane-, Cell-, Handoff-Schema, Wertarten |
| Validierung | `src/domain/validation.ts`: Referenzen, Eindeutigkeit Lane/Phase, Übergaben nur zwischen Hierarchie-Lanes derselben Phase, jede Fähigkeit genau einmal platziert, Glossar-Marker |
| UI | neu `SwimlaneMatrix.tsx` (semantische Tabelle mit Buttons je Zelle, Detailbereich), `steps.ts` (Struktur → 6 Phasen → parallel → Rückkopplung), `swimlanes.module.css`; `BigPictureText.tsx` neu; entfernt: `BigPictureExplorer.tsx`, `layout.ts`, `linkStyles.ts`, alte CSS |
| Tests | `tests/big-picture.test.ts`, `e2e/big-picture.spec.ts` neu geschrieben |

## Verhalten
- Moderation: 9 Schritte; nicht erreichte Phasen sind ausgeblendet, ohne dass sich das Layout verschiebt; die aktive Phase ist orange markiert.
- Zellauswahl per Klick/Enter → Detailbereich (Beschreibung, Übergabe, Link zur Fähigkeit), Esc schließt.
- Übergaben: ▼ nach unten / ▲ nach oben mit Text, Screenreader-Zusatz „handed down to … / reported up to …“.
- Matrix nutzt bis zu 92 rem Breite (breiter als Textseiten).

## Prüfungen
`docs/qa/CHG-003-big-picture-swimlanes.md`
