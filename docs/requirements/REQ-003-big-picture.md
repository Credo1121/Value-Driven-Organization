# REQ-003 – Big picture

- **Status:** Accepted (PoC, 07.10.2026, E25) · **Revision:** 3 (07.10.2026) · **Prio:** Must · **Inkrement:** I2
- **Quelle:** Auftrag Abschn. 8A, 10, 13 [BEST]; Fähigkeiten-Synthese `model.md` Abschn. 1 [SYN]
- **Änderung Rev. 2 [BEST, 07.10.2026]:** Der Auftraggeber bewertete das Netzdiagramm (Rev. 1) nach Sichtprüfung als „sehr diffus, schwer zu verstehen und zu vermitteln“. Er entschied sich für eine **Swimlane-Matrix** aus Phasen (Sequenz) × Ebenen (Hierarchie) mit parallelen Lanes; das Netzdiagramm wird **ersetzt** (E23). Die ACs wurden entsprechend neu gefasst und sind zur Bestätigung durch den Auftraggeber offen.
- **Änderung Rev. 3 [BEST, 07.10.2026]:** Der Auftraggeber empfand die Swimlane-Matrix unterhalb der Kreis-Übersicht auf `/big-picture/` als „noch nicht richtig platziert“. `SwimlaneMatrix` bleibt vollständig implementiert und getestet (Komponente, Unit- und E2E-Tests), wird aber vorerst **nicht auf der Einstiegsseite eingebunden**; eine eigene Unterseite ist eine offene Entscheidung (kein Scope-Verlust, siehe `docs/register.md` E29). An ihrer Stelle zeigt die Einstiegsseite jetzt eine Capability-Bridge-Übersicht (EPM/TBM/EA/LPM, illustrativ, nicht Teil dieser Anforderung – siehe `docs/project-state.md`).

## Problem und Nutzen
Der Einstiegspunkt im Workshop. Er soll in wenigen Minuten zeigen, dass EPM, TBM, LPM und EA **gemeinsame Steuerungsfähigkeiten** bedienen: in welcher Reihenfolge gesteuert wird, auf welcher Ebene, was parallel läuft und wie Ergebnisse zurückfließen.

## Scope
- Seite `/big-picture/` als Matrix:
  - **Spalten = Sequenz** der sechs Steuerungsphasen: Direct (C1) → Fund (C2) → Prioritise (C3) → Deliver (C6) → Operate (C7) → Realise value (C8)
  - **Lanes = Hierarchie:** Enterprise (EPM) → Portfolio (LPM) → Delivery & operations (Wertströme, IT Ops)
  - **Parallele Lanes:** Cost transparency (TBM, C4), Architecture & lifecycle (EA, C5)
  - **Angrenzende Lane:** Corporate finance (Target, Budget, Forecast, Actual) als Umwelt, nicht Teil von TBM
  - **Übergaben** zwischen Ebenen innerhalb einer Phase (z. B. Budgets und Leitplanken von Enterprise an Portfolio)
  - **Rückkopplung** von Realise value zurück zu Direct und Fund (nächster Zyklus)
- Geführte Moderation Phase für Phase; Detailansicht je Zelle; Textansicht
- **Nicht-Scope:** Netzdiagramm (entfällt), Umschalten auf die kompakte Ausprägung (REQ-007), frei editierbare Matrix

## Geschäftsregeln
- Jede Zelle gehört genau einer Lane und einer Phase; leere Zellen sind zulässig (diese Ebene steuert in dieser Phase nicht).
- Übergaben verbinden zwei Lanes **derselben Phase**, haben eine Richtung, einen Beziehungstyp (`model.md` Abschn. 4) und eine Beschreibung.
- Jede Steuerungsfähigkeit C1–C8 ist genau einer Phase oder einer parallelen Lane zugeordnet.
- Die Zuordnung von Tätigkeiten zu Ebenen ist als *Our synthesis* gekennzeichnet.

## Akzeptanzkriterien
- **AC-003-1** Given die Seite, then sind die sechs Phasen in der Reihenfolge Direct → Fund → Prioritise → Deliver → Operate → Realise value als Spalten sichtbar, die drei Hierarchie-Lanes in der Reihenfolge Enterprise → Portfolio → Delivery & operations, darunter die parallelen Lanes TBM und EA sowie Corporate finance, als angrenzend gekennzeichnet.
- **AC-003-2** Given eine Übergabe, then sind Richtung (nach unten / nach oben) und Inhalt textlich erkennbar; die Rückkopplung von Realise value zu Direct und Fund ist eigens beschriftet. Keine Information wird nur über Farbe vermittelt.
- **AC-003-3** Given eine Zelle, when sie per Klick oder Enter ausgewählt wird, then erscheint ohne Seitenwechsel eine Detailansicht (Beschreibung, beteiligte Wertarten, Übergabe, Link zur Fähigkeit); die Auswahl ist textlich erkennbar und mit Esc aufhebbar.
- **AC-003-4** Given der Moderationsmodus, when der Nutzer „next“ (Taste/Button) wählt, then folgt die Reihenfolge: Struktur (Lanes und Phasen) → jede Phase einzeln in Sequenz → parallele Lanes → Rückkopplung. Noch nicht erreichte Phasen sind ausgeblendet, ohne dass sich das Layout verschiebt.
- **AC-003-5** Given ein Phasenkopf oder der Kopf einer parallelen Lane, when per Klick oder Enter aktiviert, then öffnet sich die Seite der zugehörigen Fähigkeit (REQ-004).
- **AC-003-6** Given ein Screenreader- oder Tastaturnutzer, then sind alle Zellen, Übergaben und die Rückkopplung über eine semantische Tabelle bzw. die Textansicht mit gleicher Information erreichbar.
- **AC-003-7** Given das Inhaltsmodell, when eine Zelle auf eine unbekannte Lane oder Phase verweist, eine Lane-Phase-Kombination doppelt vorkommt, eine Übergabe die Phase wechselt oder keine Beschreibung hat, oder eine Fähigkeit keiner Phase oder Lane zugeordnet ist, then schlägt der Build fehl.

## Qualitätsanforderungen
Lesbar auf Präsentationsbildschirm ab 1280 px Breite, Mindestschriftgröße 14 px. Fester Raster, kein Layout-Springen zwischen den Moderationsschritten. Unter 768 px Breite tritt die Textansicht an die Stelle der Matrix.

## Offene Fragen
- Bestätigung der neu gefassten ACs durch den Auftraggeber.
- Fachliches Review der Zellinhalte (Tätigkeit je Ebene und Phase).
- C3/C8: Führungsabfolge EPM → LPM wie bei C2 oder gemeinsame Führung?
