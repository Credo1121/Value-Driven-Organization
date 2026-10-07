# REQ-004 – Capability deep dive

- **Status:** Draft · **Revision:** 2 · **Prio:** Must · **Inkrement:** I3
- **Quelle:** Auftrag Abschn. 8B [BEST]

## Problem und Nutzen
Moderierte Vertiefung einer Fähigkeit, wenn ein Kunde einen konkreten Bruch diskutiert.

## Scope
- Seiten `/capabilities/[id]` für C1–C8, einheitliches Template
- **Nicht-Scope (MVP):** eigene Seiten für Schnittstellen zwischen Disziplinen (Ausbaustufe 2)

## Geschäftsregeln
Template-Abschnitte (EN): Purpose & key decision question · Roles involved · Inputs & outputs · Data objects · Decision rights (je Ausprägung) · Interfaces (zu anderen Fähigkeiten, Finance) · Typical breaks · Sources & conditions of use.

## Akzeptanzkriterien
- **AC-004-1** Given eine Fähigkeitsseite, then sind alle acht Template-Abschnitte vorhanden; ein Abschnitt ohne Inhalt zeigt explizit „open – to be defined“ statt zu fehlen.
- **AC-004-2** Given der Abschnitt „Decision rights“, then werden die Rechte für die Ausprägungen enterprise und compact unterschieden.
- **AC-004-3** Given „Data objects“, then verlinkt jedes Objekt auf den Glossareintrag.
- **AC-004-4** Given „Interfaces“, then verlinkt jede Schnittstelle auf die Zielfähigkeit und nennt die Beziehungsart.
- **AC-004-5** Given eine Fähigkeit mit Beispielbezug, then verlinkt die Seite auf die passende Station des Beispiels (REQ-005).
- **AC-004-6** Given „Typical breaks“, then ist jeder Bruch einem der sieben Brüche aus `project-context.md` zugeordnet.
- **AC-004-7** Given eine Fähigkeitsseite, when die Inhaltsdatei einen Template-Abschnitt nicht enthält, then schlägt der Build fehl.
- **AC-004-8** Given die Vertiefungen C2 (Investment & funding) und C4 (Cost transparency & allocation), then erklären sie die Wertarten Target, Budget, Forecast und Actual: wo sie entstehen, wer sie verantwortet, welche Abweichungen gesteuert werden, und die Schnittstelle zu Budgetierung, Forecasting und Rechnungswesen (Finance). TBM wird dabei als Input, nicht als Ersatz dieser Prozesse beschrieben.

## Offene Fragen
Inhalte werden je Fähigkeit vom Auftraggeber fachlich reviewt (Gate I3). Mit C2 oder C8 beginnen? Vorschlag: C2, weil dort EPM, LPM, TBM und Finance zusammenkommen.
