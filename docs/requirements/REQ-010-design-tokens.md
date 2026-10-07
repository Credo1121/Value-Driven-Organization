# REQ-010 – Provisional design tokens

- **Status:** Draft · **Revision:** 1 · **Prio:** Should · **Inkrement:** I1 (Basis), I7 (CI)
- **Quelle:** Auftrag Abschn. 13 [BEST]; CI-Screenshots 07.10.2026 (E5) [BEST]; Werte in `docs/design/tokens.md`

## Problem und Nutzen
Die CI-Vorgaben kommen später als Screenshots. Das Design muss austauschbar sein, ohne Komponenten umzubauen.

## Scope
Zentrale Tokens für Farben (inkl. Beziehungstypen, Aussagetypen, Disziplinen), Typografie, Abstände, Linienstile. Kennzeichnung „Provisional design“ bis E5 entschieden ist.

## Akzeptanzkriterien
- **AC-010-1** Given der Quellcode der UI, when eine Prüfung auf hartkodierte Farbwerte außerhalb der Token-Datei läuft, then findet sie keine Treffer.
- **AC-010-2** Given ein Austausch der Token-Werte, then ändert sich das Erscheinungsbild ohne Änderung an Komponenten.
- **AC-010-3** Given E5a–E5c sind offen (Hex-Werte, Webfonts, Logo), then zeigt die App einen dezenten Hinweis „Provisional design“ (z. B. im Footer).
- **AC-010-4** Given jedes Farb-Token-Paar Vordergrund/Hintergrund, then ist der Kontrast dokumentiert und erfüllt AC-009-2.
- **AC-010-5** Given das Primärorange `--c-accent` (#FF6529, 2,9:1 auf Weiß), then wird es nicht für Text oder als alleiniges Linienmerkmal verwendet. Text in Orange nutzt `--c-accent-text`, Linien `--c-accent-strong`.
- **AC-010-6** Given der Build-Output und das Repository, then enthalten sie keine Aptos- oder Eraneos-Display-Schriftdateien ohne dokumentierte Web-Lizenz (E5b).
