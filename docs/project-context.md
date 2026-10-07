# Projektkontext – The Value Driven Organization

Stand: 07.10.2026 · Arbeitstitel [BEST]

## Zweck
Moderiertes Erklär- und Diskussionsinstrument. Es zeigt, wie Strategie, Investitionen, Finanzierung, Technologiekosten, Architektur, Lieferung, Betrieb und Wertrealisierung als **ein Steuerungssystem** zusammenwirken. Dabei werden Enterprise Portfolio Management (EPM), Technology Business Management (TBM), Lean Portfolio Management (LPM) und Enterprise Architecture (EA) verbunden, abhängig von der Organisationsform. [BEST]

Wir beanspruchen **keine neue Managementdisziplin**. Unser Beitrag ist die verständliche, praxisnahe und organisationsabhängige Verbindung etablierter Ansätze. [BEST]

## Problem [BEST]
Strategie, Portfolioentscheidungen, Technologiekosten, Lieferkapazität und erzielte Ergebnisse werden oft getrennt betrachtet. Typische Brüche:
1. Strategische Ziele sind unzureichend mit Investitionsentscheidungen verbunden.
2. IT-Kostenwelt und Portfolio-Welt nutzen unterschiedliche Begriffe und Datenstrukturen.
3. Finanzierung, Kostenverrechnung und Priorisierung sind nicht nachvollziehbar verknüpft.
4. Enterprise-weite Initiativen sind über Portfolios und Lieferorganisationen schwer steuerbar.
5. Architekturabhängigkeiten und Technologie-Lebenszyklen werden zu spät berücksichtigt.
6. Lieferung wird gemessen, Wertrealisierung bleibt unklar.
7. Erkenntnisse aus Kosten, Betrieb und Ergebnissen fließen nicht in neue Entscheidungen zurück.

## Nutzer [BEST]
- **Primär:** CIO, CDO, CTO
- **Weitere Perspektiven:** Business-Verantwortliche, Finance/IT-Controlling, Enterprise- und Lean-Portfolio-Verantwortliche, Enterprise Architecture, Produkt-/Plattform-/Delivery-Verantwortliche
- **Bediener v1:** der Auftraggeber als Moderator in Kundengesprächen und Workshops

## Nutzung v1 [BEST]
Zusammenhänge schnell verständlich machen · Diskussion bestehender Steuerungsprobleme · Organisationsszenarien vergleichen · Entscheidungsrechte und Schnittstellen sichtbar machen · Handlungsfelder aufzeigen.
Hauptgerät: Desktop / geteilter Präsentationsbildschirm. Responsives Layout sinnvoll, aber nachrangig.

## Scope MVP
Bereiche A–E: Gesamtbild · fachliche Vertiefung · Referenzansätze · Organisationsszenarien · durchgängiges Beispiel. Details und Backlog: `docs/requirements/README.md`.

## Nicht-Scope v1 [BEST]
Kein operatives Portfolio-, Kostenrechnungs- oder EA-System. Keine Kundendaten, keine Live-Integrationen, kein Login, keine Datenbank, keine Mandanten, keine gespeicherten Szenarien, keine LLM-Empfehlungen, keine Reifegradscores, keine Benchmarks, keine Einsparversprechen.

## Fachliches Grundmodell (Kurzfassung)
Vollständig in `docs/domain/model.md`.
- **EPM**: übergreifender Rahmen für große Enterprises. Das ist unser **Referenzmodell [SYN]**, kein universeller Standard.
- **LPM**: gestaltet innerhalb des Rahmens Portfolio-Strategie, Finanzierung, Priorisierung, Wertstromfinanzierung, Lean Governance. Es ist keine reine Delivery-Schicht. SAFe ist Referenz, hybride/andere flowbasierte Modelle müssen erklärbar sein. [BEST]
- **TBM**: gemeinsame Sicht auf Technologiekosten, Ressourcen, Lösungen, Konsumenten, Allokation, Business Value. Abgegrenzt von Budgetierung, Forecasting und Rechnungswesen. [BEST]
- **EA**: Capabilities, Landschaften, Plattformen, Abhängigkeiten, Ist/Ziel, Roadmaps, Lebenszyklen, technische Risiken. [BEST]
- **Wertrealisierung**: Output ≠ Outcome ≠ finanzieller Nutzen. [BEST]
- **Ausprägungen**: Enterprise (EPM + mehrere LPM-Portfolios) und kompakt (keine separate EPM-Ebene). Steuerungsaufgaben bleiben in beiden Ausprägungen erhalten. [BEST]
- **Umfang**: RUN und CHANGE als Steuerungsperspektiven, nicht gleichzusetzen mit CapEx/OpEx. Wachstums- und notwendige Investitionen (Sicherheit, Compliance, Resilienz, technische Nachhaltigkeit). [BEST]

## Bestätigter Stack [BEST]
Next.js · Node.js · TypeScript. Architekturempfehlung (statischer Build) und Versionen: `docs/adr/ADR-001`, `ADR-002` (Status Proposed).

## Hosting und Versionsverwaltung
- Die App muss lokal vom Laptop **ohne Internet** laufen [BEST, A4]. Öffentliches Hosting: [OFFEN] E4, nicht blockierend bis I7.
- Zuerst lokales Git-Repository, GitHub später nur auf ausdrückliche Anweisung [BEST, E18].

## Datenkritikalität
Niedrig: ausschließlich synthetische Beispieldaten und öffentlich formulierte Fachinhalte. Keine personenbezogenen oder vertraulichen Kundendaten. [BEST]
Kritisch ist die **fachliche Korrektheit und Quellentreue**, nicht die Vertraulichkeit.

## Sprache [BEST]
App: Englisch. Doku und Kommunikation: Deutsch.

## Design
Eraneos CI gemäß PowerPoint Guide (Screenshots 07.10.2026), übertragen in `docs/design/tokens.md`: Greyscale als Standard, Orange als Hervorhebung, Aptos/Eraneos Display. Vorläufig, bis offizielle Hex-Werte, Webfont-Lizenz und Logo-Datei geklärt sind (E5a–c).

## Projektbefehle
Noch keine (kein Code).
