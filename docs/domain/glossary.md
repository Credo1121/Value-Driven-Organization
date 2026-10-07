# Glossar (EN = App-Begriff · DE = Arbeitsbegriff)

Status: Draft v0.3, 07.10.2026 · Review durch Auftraggeber ausstehend.
Der EN-Begriff ist in der App verbindlich. Abweichende Framework-Begriffe stehen unter „Varianten“.

## Disziplinen

| EN | DE | Definition | Abgrenzung / Varianten | Typ |
|---|---|---|---|---|
| Enterprise Portfolio Management (EPM) | Enterprise Portfolio Management | Übergreifender Steuerungsrahmen für große Enterprises: Enterprise-Strategie, übergreifende Initiativen, langfristige Investitionsplanung, Priorisierung über Portfolios, Leitplanken, Entscheidungsrechte, Ergebnistransparenz, Reallokation | Unser Referenzmodell, kein universeller Standard. Marktbegriff „Strategic Portfolio Management (SPM)“ im Umlauf (S-GART-1 NICHT VERIFIZIERT; E10) | [SYN] |
| Lean Portfolio Management (LPM) | Lean Portfolio Management | Steuert ein Portfolio über Strategy & Investment Funding, Agile Portfolio Operations und Lean Governance | Keine reine Delivery-Schicht. SAFe-Begriff; mehrere Portfolios in größeren Enterprises möglich (S-SAFE-1, S-SAFE-2) | [BELEG] |
| Technology Business Management (TBM) | Technology Business Management | Disziplin für eine gemeinsame wirtschaftliche Sicht auf Technologie: Kosten, Ressourcen, Lösungen, Konsumenten, Allokation, Wertbeitrag | ≠ Budgetierung, Forecasting, Rechnungswesen (angrenzende Finance-Prozesse). Framework-Ebenen siehe S-TBM-1 | [BELEG]/[SYN] |
| Enterprise Architecture (EA) | Enterprise Architecture | Verbindet Steuerung mit Capabilities, Landschaften, Plattformen, Abhängigkeiten, Ist-/Zielzuständen, Roadmaps, Lebenszyklen und technischen Risiken | TOGAF 10th Ed. als Referenz (S-OG-3) | [SYN] |
| Corporate finance processes | Finance-Prozesse | Budgetierung, Forecasting, Rechnungswesen, Kapitalisierung | Angrenzend, Schnittstelle zu TBM und Investitionsplanung | [SYN] |

## Kernobjekte

| EN | DE | Definition | Abgrenzung / Varianten | Typ |
|---|---|---|---|---|
| Strategic objective | Strategisches Ziel | Angestrebte Wirkung auf Enterprise- oder Portfolioebene | ≠ Metric. SAFe: Strategic Themes auf Portfolioebene (S-SAFE-2) | [SYN] |
| Business capability | Business Capability | *Was* die Organisation können muss, unabhängig davon, wie, durch wen und womit es umgesetzt wird; hierarchisch | ≠ Application, ≠ Product, ≠ Process. TOGAF-Guide „Business Capabilities“ (S-OG-3) | [SYN] |
| Enterprise initiative | Enterprise-Initiative | Portfolioübergreifendes Bündel von Investments für ein Enterprise-Ziel; die Investments können selbst portfolioübergreifend sein | Eigene Steuerungsebene nur in der Enterprise-Ausprägung; kompakt: gebündelte Investments eines Portfolios | [SYN] |
| Portfolio | Portfolio | Steuerungseinheit mit eigenem Budget, Wertströmen, Strategie und Governance | | [SYN] |
| Investment | Investitionsvorhaben | Generisches Investitions-/Arbeitsobjekt mit Business Case bzw. Hypothese | Varianten: Epic (SAFe, S-SAFE-5), Projekt, Programm. Kann **portfolioübergreifend** sein: in mehreren Portfolios finanziert und umgesetzt, mit genau einem federführenden Portfolio (Business Case, Outcome-Verantwortung) [BEST 07.10.2026] | [SYN] |
| Portfolio participation | Portfoliobeteiligung | Beteiligung eines Portfolios an einem Investment: Rolle (lead/contributing), Finanzierungsanteil, liefernde Wertströme | Verhindert Doppelzählung bei portfolioübergreifenden Investments (K6) | [SYN] |
| Value stream | Wertstrom | Dauerhafte Lieferorganisation mit eigener Kapazität, die Wert für Kunden/Konsumenten erzeugt; gehört genau einem Portfolio [BEST] | Ein Wertstrom ist keine Projektphase. Finanzierung von Wertströmen statt Projekten (S-SAFE-3) | [SYN]/[BELEG] |
| Product | Produkt | Wertangebot für Kunden oder interne Nutzer mit Verantwortung für Outcomes | ≠ Application (ein Produkt kann mehrere Anwendungen nutzen) | [SYN] |
| Platform | Plattform | Geteilte technische oder fachliche Grundlage, die mehrere Produkte nutzen | Interne Konsumenten; Finanzierung ist eigene Szenariofrage | [SYN] |
| Service | Service | Konsumierbare Leistung mit definiertem Leistungsversprechen (Business- oder IT-Service) | TBM „Technology Solutions“ umfassen u. a. Services und Produkte (Mapping s. u.) | [SYN] |
| Application | Anwendung | Softwaresystem, das Capabilities realisiert und Technologien nutzt | ≠ Product, ≠ Capability | [SYN] |
| Technology | Technologie | Technische Komponente (z. B. Datenbank, Laufzeit, Infrastruktur) mit Lebenszyklusstatus | | [SYN] |
| Lifecycle status | Lebenszyklusstatus | z. B. emerging / mainstream / contained / end-of-life | Werte vorläufig [ANN] | [SYN] |
| Value type | Wertart | Art eines Finanzwerts: Target, Budget, Forecast oder Actual (`model.md` 2.1) | ≠ RUN/CHANGE, ≠ CapEx/OpEx | [SYN] |
| Target | Zielwert | Top-down-Vorgabe als Orientierung, z. B. Kostenziel oder Kostenquote | ≠ Budget (nicht genehmigt); ≠ Outcome-Ziel (dort *expected*) | [SYN] |
| Budget | Budget / Plan | Genehmigte Mittel je Periode und Ebene | ≠ Actual cost, ≠ Target | [SYN] |
| Forecast | Prognose | Aktuelle Erwartung des Werts für die Periode, rollierend aktualisiert | ≠ Budget; Forecasting ist ein Finance-Prozess | [SYN] |
| Variance | Abweichung | Abgeleitete Differenz zweier Wertarten (z. B. Forecast vs. Budget) | wird berechnet, nie als Grundwert geführt (K9) | [SYN] |
| Funding allocation | Finanzierungszuordnung | Zuteilung von Budget an einen Empfänger (Portfolio, Wertstrom, Initiative, Plattform), mit Leitplanken | ≠ Cost allocation | [SYN] |
| Guardrail | Leitplanke | Vereinbarte Grenze, innerhalb derer delegiert entschieden werden darf | SAFe-Guardrails NICHT VERIFIZIERT (S-SAFE-3) | [SYN] |
| Actual cost | Ist-Kosten | Tatsächlich gebuchte Kosten (Wertart *Actual*) | ≠ Budget, ≠ Forecast | [SYN] |
| Cost pool | Kostenpool | Ist-Kosten nach Kostenart | TBM-Layer „Technology Cost Pool“ (S-TBM-2) | [BELEG] |
| Resource tower | Ressourcen-Tower | Technologische Ressourcenkategorie | TBM-Layer „Technology Resource Towers“ (S-TBM-2) | [BELEG] |
| Technology solution | Technologielösung | Konsumierbare Lösung (Produkte/Services), der Kosten zugeordnet werden | TBM-Layer „Technology Solutions“ (S-TBM-2). Mapping auf Product/Platform/Service siehe unten | [BELEG]/[SYN] |
| Technology consumer | Technologiekonsument | Organisationseinheit oder Nutzergruppe, die Lösungen konsumiert | TBM-Layer „Technology Consumer“, vor v5.0 „Business Layer“ (S-TBM-2) | [BELEG] |
| Cost allocation | Kostenallokation | Verteilung von Ist-Kosten entlang Pool → Tower → Solution → Consumer über Treiber, inkl. nicht zugeordneter Anteile | ≠ Funding allocation; ≠ Chargeback | [SYN] |
| Unallocated / shared cost | Gemeinsame / nicht zugeordnete Kosten | Kosten, die bewusst keinem Konsumenten oder Investment zugeordnet werden | Legitimer Bestandteil des Modells, kein Fehler | [SYN] |
| Showback | Showback | Kosten werden Konsumenten transparent gemacht, aber nicht belastet | | [SYN] |
| Chargeback | Chargeback | Kosten werden Konsumenten intern belastet | | [SYN] |
| Delivery capacity | Lieferkapazität | Verfügbare Kapazität je Wertstrom/Team und Periode, aufgeteilt auf RUN, CHANGE und Investments | | [SYN] |
| RUN / CHANGE | RUN / CHANGE | Steuerungsperspektiven: Betrieb und Erhalt vs. Veränderung und Neuentwicklung | ≠ OpEx / CapEx (S-SAFE-4) | [SYN] |
| CapEx / OpEx | CapEx / OpEx | Bilanzielle Behandlung von Ausgaben (Rechnungslegung) | Schnittstelle zu Finance, keine Steuerungsperspektive | [BELEG] S-SAFE-4 |
| Output | Output | Geliefertes Ergebnis (z. B. Funktion live) | ≠ Outcome | [SYN] |
| Outcome | Outcome | Beobachtbare Veränderung im Verhalten oder Ergebnis (z. B. Adoption, Bearbeitungszeit) | ≠ Output, ≠ Financial benefit | [SYN] |
| Financial benefit | Finanzieller Nutzen | Monetär bewertete Wirkung (Erlös, Kostenvermeidung) | ≠ Outcome | [SYN] |
| Metric | Messgröße | Messbare Größe für Output, Outcome oder Nutzen mit Erwartungs- und Ist-Wert | Beitrag mehrerer Investments möglich | [SYN] |
| Benefit hypothesis | Nutzenhypothese | Erwarteter Outcome/Nutzen eines Investments, überprüfbar formuliert | SAFe-Varianten (Epic Hypothesis) NICHT VERIFIZIERT | [SYN] |
| Decision right | Entscheidungsrecht | Wer (Rolle/Gremium) auf welcher Ebene über welchen Entscheidungstyp entscheidet | szenarioabhängig | [SYN] |
| Steering capability | Steuerungsfähigkeit | Disziplinübergreifende Steuerungsaufgabe (8 Stück, s. `model.md`) | Keine Organisationseinheit, kein Gremium | [SYN] |

## Mapping TBM „Technology Solutions“ → Projektbegriffe [SYN, zur Bestätigung]
- Technology Solutions umfassen konsumierbare Lösungen. Im Projekt werden sie modelliert als **Product**, **Platform** oder **Service**.
- Eine **Application** ist **keine** Solution an sich. Ihre Kosten fließen über Resource Towers in die Solutions, die sie nutzen.
- Exakte TBM-Unterkategorien sind NICHT VERIFIZIERT (Whitepaper vermutlich nur für Mitglieder, S-TBM-2).

## Beziehungsarten (Linientypen)
| EN | DE | Bedeutung |
|---|---|---|
| Strategic contribution | Strategischer Beitrag | X trägt zu Ziel/Capability Y bei |
| Funding | Finanzierung | Budget wird von X an Y zugeteilt |
| Cost allocation | Kostenallokation | Ist-Kosten fließen von X nach Y |
| Delivery | Umsetzung | X setzt Y um bzw. liefert für Y |
| Architecture dependency | Architekturabhängigkeit | X hängt technisch von Y ab |
| Outcome feedback | Ergebnisrückmeldung | Ergebnisse aus X informieren Entscheidungen in Y |
