# REQ-005 – End-to-end example

- **Status:** Draft · **Revision:** 3 · **Prio:** Must · **Inkrement:** I4
- **Quelle:** Auftrag Abschn. 8E, 10 [BEST]; Rahmen `model.md` Abschn. 7 [BSP]

## Problem und Nutzen
Eine durchgängige, fiktive Geschichte macht abstrakte Zusammenhänge greifbar und zeigt Unterschiede zwischen Budget, Ist-Kosten, Output und Outcome.

## Scope
- Seite `/example` mit Stepper über Stationen S1–S8
- Umschalter enterprise / compact (REQ-007)
- Synthetischer, in sich konsistenter Datensatz
- **Nicht-Scope:** Bearbeitung der Daten, Import von Kundendaten, mehrere Beispiele

## Geschäftsregeln
- Beispielorganisation: Halvard Industrial Group (fiktiv, E6)
- Alle Zahlen synthetisch und als *Illustrative example* gekennzeichnet
- Datensatz erfüllt K1–K11, W1–W3 (`model.md` Abschn. 5)
- Mindestens ein Investment ist portfolioübergreifend (lead + contributing) mit Finanzierungsanteilen je Portfolio
- Kosten und Finanzierung mit Wertarten Target, Budget, Forecast, Actual je Periode (Granularität A9); mindestens eine Periode mit Forecast > Budget (Doppelbetrieb)
- Mindestens ein Kostenposten ist bewusst keinem Investment zugeordnet (shared/unallocated)
- Die Initiative enthält sowohl einen Wachstums- als auch einen notwendigen Investitionsanteil (EOL-Ablösung)

## Akzeptanzkriterien
- **AC-005-1** Given die Beispielseite, when der Nutzer mit Pfeiltasten oder Buttons navigiert, then wechseln die Stationen in Reihenfolge, und Position „n of 8“ ist sichtbar.
- **AC-005-2** Given eine Station, then nennt sie die zugehörige(n) Steuerungsfähigkeit(en) mit Link zur Vertiefung.
- **AC-005-3** Given die Finanzierungs- und Betriebsstationen, then werden Budget, Funding allocation und Actual cost als getrennte, beschriftete Größen gezeigt, nie summiert.
- **AC-005-4** Given die Wertrealisierungsstation, then werden Output, Outcome und Financial benefit getrennt dargestellt; ein geliefertes Investment zeigt keinen automatisch erreichten Outcome.
- **AC-005-5** Given die Kostenallokation, then ist der nicht zugeordnete Anteil sichtbar und die Summen sind konsistent (Σ consumers + unallocated = Σ pool).
- **AC-005-6** Given der Datensatz, when die Domänenregeln K1–K11, W1–W3 als Tests laufen, then sind alle PASS; Negativ-Fixtures (absichtlich inkonsistente Daten) führen zu FAIL der jeweiligen Regel.
- **AC-005-7** Given eine Station über ein URL-Fragment oder einen Query-Parameter, when die Seite geladen wird, then öffnet sie direkt diese Station.
- **AC-005-8** Given das portfolioübergreifende Investment, then zeigt die App die beteiligten Portfolios, die Rolle (lead/contributing), den Finanzierungsanteil je Portfolio und die liefernden Wertströme; die Summe der Anteile entspricht der Gesamtfinanzierung, und Portfolio-Summen enthalten nur den eigenen Anteil.
- **AC-005-9** Given die Stationen S4, S6 und S8, then werden Target, Budget, Forecast und Actual als getrennte, beschriftete Reihen gezeigt; Abweichungen (Forecast vs. Budget, Actual vs. Budget) erscheinen als abgeleitete Größen mit Vorzeichen und Text, nie als Summe verschiedener Wertarten.
- **AC-005-10** Given eine Forecast-Abweichung über Budget, then zeigt die Station, welche Steuerungsfähigkeit reagiert (C8 Reallokation, C2 Finanzierung) und welche Information dafür fließt.

## Offene Fragen
Umfang der Zahlenbasis (Perioden: Vorschlag 3 Jahre). A9 (Wertarten-Granularität).
