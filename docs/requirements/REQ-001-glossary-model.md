# REQ-001 – Glossary & domain model

- **Status:** Draft · **Revision:** 3 · **Prio:** Must · **Inkrement:** I1
- **Quelle:** Auftrag 07.10.2026, Abschn. 5, 10, 13 [BEST]

## Problem und Nutzen
Uneinheitliche Begriffe (Budget vs. Kosten, Produkt vs. Anwendung) sind einer der Brüche, die die App sichtbar machen soll. Die App muss deshalb selbst begrifflich konsistent sein.

## Scope
- Glossarseite `/glossary` mit allen Begriffen aus `docs/domain/glossary.md` (EN)
- Domänenobjekte und Beziehungen als typisierte, UI-unabhängige Definitionen
- **Nicht-Scope:** Bearbeitung des Glossars in der App, deutsche Fassung

## Geschäftsregeln
- Jeder Begriff: Name (EN), Definition, Abgrenzung, Aussagetyp, optional Varianten und Quellen-IDs
- Kardinalitäten und Konsistenzregeln gemäß `docs/domain/model.md` Abschn. 3 und 5

## Akzeptanzkriterien
- **AC-001-1** Given die Glossarseite, when sie geöffnet wird, then werden alle Glossarbegriffe nach Kategorie gruppiert (Disciplines, Steering objects, Financial value types, Link types) und innerhalb jeder Kategorie alphabetisch mit Definition, Abgrenzung und Aussagetyp angezeigt. *(Rev. 3, 07.10.2026: Gruppierung vom Auftraggeber nach Sichtprüfung bestätigt, QA-I1-1)*
- **AC-001-2** Given ein Fachbegriff in einem UI-Inhalt ist als Glossarbegriff markiert, when der Build läuft, then schlägt der Build fehl, wenn der Begriff nicht im Glossar existiert (R3).
- **AC-001-3** Given ein Glossarbegriff, when der Nutzer ihn in einem Inhalt aktiviert (Klick oder Tastatur), then wird die Definition angezeigt, ohne die aktuelle Seite zu verlassen.
- **AC-001-4** Given die Begriffspaare Budget/Actual cost, Funding allocation/Cost allocation, Output/Outcome/Financial benefit, Product/Application/Capability/Platform, RUN-CHANGE/CapEx-OpEx, then enthält jeder Eintrag eine explizite Abgrenzung zum jeweils anderen.
- **AC-001-5** Given das Domänenmodell, when Testdaten eine Beziehung mit unzulässiger Kardinalität enthalten (z. B. Investment ohne Portfoliobeteiligung, Wertstrom in zwei Portfolios), then meldet die Validierung einen Fehler mit Objekt-ID.

## Qualitätsanforderungen
Tastaturbedienbar (REQ-009). Begriffe in der App ausschließlich EN.

## Offene Fragen
A6. (E13, A7 entschieden 07.10.2026.)
