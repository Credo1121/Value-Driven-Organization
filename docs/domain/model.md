# Fachliches Modell

Status: Draft v0.4, 07.10.2026 · Wertarten (Abschn. 2.1) ergänzt · E13, QA-P0-1/2, A7 entschieden; A8 verworfen; E14 entschieden.
Begriffe gemäß `glossary.md`. Dieses Dokument ist die Quelle für Domänentypen, Konsistenzregeln und Szenarioregeln (später `src/domain`, `src/scenarios`).

---

## 1. Steuerungsfähigkeiten (Steering capabilities) [SYN]

Das Gesamtbild zeigt **gemeinsame Steuerungsfähigkeiten**, keine vier Framework-Kacheln. Jede Fähigkeit hat primär und unterstützend beitragende Disziplinen. Die Zuordnung ist unsere Synthese.

| ID | Steering capability (EN) | DE | Zentrale Entscheidungsfrage | Primär | Unterstützend |
|---|---|---|---|---|---|
| C1 | Strategic direction | Strategische Ausrichtung & Ziele | Welche Ziele verfolgen wir, und was bedeutet das für Technologie? | EPM | LPM, EA |
| C2 | Investment & funding | Investitions- & Finanzierungsplanung | Wie viel Mittel fließen wohin, mit welchen Leitplanken? | **EPM → LPM** (Abfolge): EPM führt übergreifend (Portfoliobudgets, Leitplanken, portfolioübergreifende Investments), danach übernimmt LPM die Führung im Portfolio (Wertstromfinanzierung) [BEST 07.10.2026]. Kompakt: LPM bzw. integrierte Portfolio-Governance durchgehend | TBM, Finance |
| C3 | Prioritisation & dependencies | Priorisierung & Abhängigkeitssteuerung | Was machen wir zuerst, was nicht, und was hängt wovon ab? | LPM / EPM | EA |
| C4 | Cost transparency & allocation | Kostentransparenz & -allokation | Was kostet Technologie, wofür, und wer konsumiert sie? | TBM | Finance |
| C5 | Architecture & lifecycle | Architektur- & Lebenszyklussteuerung | Welche Zielarchitektur, welche Technologie läuft aus, welche Risiken bestehen? | EA | TBM, LPM |
| C6 | Delivery & capacity | Umsetzungs- & Kapazitätssteuerung | Wie fließt Arbeit durch begrenzte Kapazität? | LPM | EA |
| C7 | Operations & service quality | Betrieb & Servicequalität | Laufen die Services verlässlich, sicher und wirtschaftlich? | IT-Betrieb (Referenz IT4IT Consume/Operate, S-OG-2) [BEST 07.10.2026] | TBM, EA |
| C8 | Value realisation & reallocation | Wertrealisierung & Reallokation | Wirkt es? Was finanzieren wir weiter, um, oder nicht mehr? | EPM / LPM | TBM |

**Kreislauf:** C1 → C2 → C3 → C6 → C7 → C8 → C1. C4 und C5 sind querliegende Informationsfähigkeiten, die C2, C3, C6, C7 und C8 speisen.
**Darstellung (E23):** Der Kreislauf wird als Sequenz von sechs Phasen gezeigt (Direct, Fund, Prioritise, Deliver, Operate, Realise value). Die Ebenen Enterprise (EPM), Portfolio (LPM) und Delivery & operations bilden die Hierarchie-Lanes, C4 (TBM) und C5 (EA) laufen als parallele Lanes, Finance als angrenzende Lane. Die Beziehungsarten aus Abschn. 4 erscheinen nur noch als Übergaben zwischen Ebenen und als Rückkopplung.
**Umwelt:** Finance-Prozesse (Budgetierung, Forecast, Rechnungswesen, Kapitalisierung) mit Schnittstellen zu C2 und C4.

### 1.1 Aufgabenteilung EPM ↔ LPM [SYN]
| Entscheidungstyp | Enterprise-Ausprägung | Kompakte Ausprägung |
|---|---|---|
| Enterprise-Ziele und Investitionsschwerpunkte | EPM-Gremium | integrierte Portfolio-Governance (LPM + Geschäftsleitung) |
| Budget je Portfolio und Leitplanken | EPM | entfällt als Ebene; Gesamtbudget = Portfoliobudget |
| Portfolioübergreifende Initiativen und Sequenzierung | EPM | entfällt; Abhängigkeiten im einen Portfolio |
| Freigabe portfolioübergreifender Investments, Aufteilung der Finanzierungsanteile | EPM setzt Rahmen und Anteile; jedes beteiligte LPM priorisiert seinen Anteil im eigenen Portfolio-Kanban | entfällt bei einem Portfolio; bei mehreren Portfolios ohne EPM-Ebene → Spannungsfeld TN6 |
| Portfolio-Strategie, Wertstromfinanzierung, Portfolio-Kanban | LPM je Portfolio | LPM |
| Reallokation zwischen Portfolios | EPM | entfällt; Reallokation zwischen Wertströmen im LPM |
| Reallokation innerhalb des Portfolios | LPM in Leitplanken | LPM |

Regel **T1 (Aufgabenerhalt):** Jede Steuerungsaufgabe ist in jeder Ausprägung genau einer Rolle oder einem Gremium zugeordnet. Keine Aufgabe „verschwindet“. Prüfbar in REQ-007.

---

## 2. Kernobjekte
Definitionen: `glossary.md`. Für das spätere Datenmodell gilt: jedes Objekt hat `id`, `name` (EN), `statementType`, optional `sourceIds[]`.

Zusatzattribute (Auswahl):
- **Investment:** `participations[]` (siehe PortfolioParticipation), `totalFunding`, `type` (growth / mandatory: security, compliance, resilience, technical sustainability) [BEST], `perspective` (CHANGE), `benefitHypothesis`, `status` (funnel … delivered)
- **PortfolioParticipation** (Zuordnungsobjekt Investment ↔ Portfolio) [BEST 07.10.2026 / SYN]: `investmentId`, `portfolioId`, `role` (lead / contributing), `fundingShare` (Betrag je Periode), `deliveringValueStreamIds[]` (nur Wertströme dieses Portfolios). Dieses Objekt macht sichtbar, dass ein Investment in mehreren Portfolios finanziert und umgesetzt werden kann.
- **Technology:** `lifecycleStatus`
- **Budget:** `period`, `level` (enterprise / portfolio / value stream), `amount` → wird als Wertart *Budget* geführt (2.1)
- **CostItem:** `costPool`, `period`, `valueType` (2.1), `amount`, `perspective` (RUN / CHANGE), `accountingTreatment` (CapEx / OpEx, nur informativ)
- **CapacityAllocation:** `valueStreamId`, `period`, Anteile RUN / CHANGE / je Investment
- **Metric:** `kind` (output / leading outcome / lagging outcome / financial), `expected`, `actual`, `contributingInvestmentIds[]`

---

### 2.1 Wertarten der Finanzsteuerung (Value types) [BEST 07.10.2026 / SYN]

Kosten- und Finanzierungsgrößen werden mit einer **Wertart** geführt. Die Wertart ist eine eigene Achse (Dimension eines Werts), **kein zusätzliches Objekt**.

| Wertart (EN) | DE | Bedeutung | Entsteht in | Typische Ebene |
|---|---|---|---|---|
| Target | Zielwert | Top-down-Vorgabe als Orientierung (z. B. Kostenziel, Kostenquote) | Strategie / EPM bzw. integrierte Governance (C1, C2) | Enterprise, Portfolio |
| Budget (Plan) | Budget / Plan | Genehmigte Mittel je Periode | Budgetierung (Finance) mit EPM/LPM (C2) | Enterprise, Portfolio, Wertstrom |
| Forecast | Prognose | Aktuelle Erwartung für die Periode bzw. bis Periodenende, rollierend | Forecasting (Finance) mit LPM/TBM-Input (C2, C4) | Portfolio, Wertstrom, Kostenpool |
| Actual | Ist | Gebuchte Werte aus dem Rechnungswesen | Rechnungswesen (Finance), TBM-Allokation (C4) | Kostenpool → Konsument |

**Abgeleitete Abweichungen** (nie gespeicherte Grundwerte, immer berechnet):
- Budget vs. Target: Zielabweichung bei der Planung
- Forecast vs. Budget: erwartete Abweichung zum Periodenende → Frühindikator für Reallokation (C8)
- Actual vs. Forecast: Prognosegüte
- Actual vs. Budget: Ist-Abweichung

**Abgrenzungen:**
- Die Wertart sagt *welche Art Wert*. Die Steuerungsperspektive (RUN/CHANGE) und die bilanzielle Behandlung (CapEx/OpEx) sind davon unabhängig (K5).
- Finanzierung (Funding allocation) kennt die Wertarten Target und Budget, gelegentlich Forecast (erwartete Inanspruchnahme). Kosten (Cost items) kennen alle vier. Ein Funding-Budget und ein Kosten-Actual werden nie direkt verrechnet, nur ausdrücklich als Abweichung gegenübergestellt.
- Outcome-Messgrößen verwenden eigene Begriffe (*expected* / *actual*) und **nicht** die finanziellen Wertarten, damit ein finanzielles Target nicht mit einem Outcome-Ziel verwechselt wird.
- Budgetierung, Forecasting und Rechnungswesen bleiben **Finance-Prozesse** (Umwelt im Gesamtbild). TBM liefert Kostentransparenz und Treiber als Input, ersetzt sie aber nicht.

**Granularität im MVP [BEST A9, 07.10.2026]:** Wertarten auf Ebene Enterprise, Portfolio und Kostenpool, je Periode (Jahr; Forecast als Stand „Q2 forecast“). Keine Monatswerte, keine Versionierung mehrerer Forecast-Stände.

## 3. Kardinalitäten (E13 entschieden 07.10.2026)

| Beziehung | Kardinalität | Begründung / Hinweis |
|---|---|---|
| Enterprise initiative – Portfolio | N:M | Initiative betrifft mehrere Portfolios [BEST] |
| Enterprise initiative – Investment | 1:N | Initiative bündelt mehrere Investments. Ein Investment gehört höchstens einer Initiative [ANN] |
| Portfolio – Investment | **N:M über PortfolioParticipation** | [BEST 07.10.2026] Investments können portfolioübergreifend sein: in mehreren Portfolios finanziert und umgesetzt. Mindestens eine Participation je Investment |
| Investment – Lead portfolio | N:1 | genau ein federführendes Portfolio je Investment für Business Case und Outcome-Verantwortung [BEST 07.10.2026] |
| Portfolio – Value stream | 1:N | Wertstrom gehört genau einem Portfolio [BEST 07.10.2026] |
| PortfolioParticipation – Value stream | 1:N | liefernde Wertströme stammen aus dem Portfolio der Participation (K7) |
| Strategic objective – Investment | N:M | Beitrag, keine Exklusivität |
| Strategic objective – Product | N:M | Produkt unterstützt mehrere Ziele [BEST] |
| Investment – Product / Platform | N:M | [BEST] Initiative betrifft mehrere Produkte |
| Investment – Business capability | N:M | |
| Value stream – Product | N:M | Ein Produkt kann von mehreren Wertströmen weiterentwickelt werden (selten, aber real) |
| Product – Application | N:M | |
| Product – Platform | N:M | Architekturabhängigkeit |
| Application – Business capability | N:M | Redundanzen sichtbar machen |
| Application – Technology | N:M | |
| Budget – Funding allocation | 1:N | |
| Cost item – Allocation share | 1:N | Summe = 100 % inkl. „unallocated/shared“ (K1) |
| Metric – Investment | N:M | Beitrag, keine Exklusivzurechnung (W2) |
| Technology solution (TBM) – Product/Platform/Service | 1:1 im MVP [ANN] | Vereinfachung, Mapping siehe Glossar |

---

## 4. Beziehungsarten (sichtbare Linien)

Jede sichtbare Linie hat **genau einen** Typ. Unterscheidung über Linienstil + Pfeilform + Beschriftung, Farbe nur zusätzlich.

| Typ | Erlaubte Richtungen (Beispiele) | Stil (vorläufig) |
|---|---|---|
| Strategic contribution | Investment/Product → Objective; Investment → Capability | durchgezogen, offener Pfeil |
| Funding | Budget/Portfolio → Value stream/Investment/Platform | doppelt, gefüllter Pfeil |
| Cost allocation | Cost pool → Tower → Solution → Consumer | gestrichelt, gefüllter Pfeil |
| Delivery | Value stream → Investment/Product | durchgezogen dick, Pfeil |
| Architecture dependency | Product → Platform; Application → Technology | gepunktet, Rautenende |
| Outcome feedback | Metric/C7/C8 → C1/C2/C3 | strichpunktiert, Pfeil |

Im Gesamtbild (C1–C8) werden dieselben sechs Typen auf Fähigkeitsebene verwendet. Jede Kante hat dort eine Kurzbeschreibung („was fließt“).

---

## 5. Konsistenzregeln (automatisch prüfbar)

| ID | Regel | Prüfung |
|---|---|---|
| K1 | Allokationsanteile je Quellposten summieren sich auf 100 %. Nicht zugeordnete Anteile werden explizit als „unallocated/shared“ geführt | Unit-Test + Negativ-Fixture |
| K2 | Σ Kosten bei Consumers + Σ unallocated = Σ Cost pool je Periode (keine Doppelzählung, kein Verlust) | Unit-Test |
| K3 | Budget und Actual werden nie addiert. Eine Abweichung ist eine eigene abgeleitete Größe (verallgemeinert in K9) | Typsystem (getrennte Typen) + Test |
| K4 | Funding allocation und Cost allocation sind getrennte Datensätze. Keine Ableitung des einen aus dem anderen | Typsystem + Review |
| K5 | RUN/CHANGE und CapEx/OpEx sind getrennte Attribute ohne feste Zuordnung | Typsystem + Test (Daten enthalten mindestens einen RUN-CapEx- oder CHANGE-OpEx-Fall) |
| K9 | Werte gleicher Wertart und Periode sind innerhalb einer Hierarchie additiv; Werte **verschiedener** Wertarten werden nie summiert. Abweichungen sind abgeleitete Größen und werden nie als Grundwert gespeichert | Typsystem + Unit-Test + Negativ-Fixture |
| K10 | Kostenallokation (Pool → Tower → Solution → Consumer) wird nur auf *Actual* angewendet. Wird ein Forecast alloziert, ist das ausdrücklich gekennzeichnet (MVP: nicht vorgesehen) | Unit-Test |
| K11 | Jeder Kosten- und Finanzierungswert trägt eine Wertart und eine Periode | Build-Validierung |
| K6 | Bei portfolioübergreifenden Investments: Σ `fundingShare` aller Participations = `totalFunding` des Investments je Periode. Portfolio-Summen zählen nur den eigenen Anteil (keine Doppelzählung bei Enterprise-Aggregation) | Unit-Test + Negativ-Fixture |
| K7 | Liefernde Wertströme einer Participation gehören zum Portfolio dieser Participation | Unit-Test + Negativ-Fixture |
| K8 | Jedes Investment hat genau eine Participation mit `role = lead` [BEST] | Unit-Test |
| W1 | Status „delivered“ eines Investments setzt keinen Outcome- oder Nutzenstatus | Test |
| W2 | Messgrößen haben `contributingInvestmentIds[]`. Keine Zurechnung einer Veränderung zu genau einem Investment | Test |
| W3 | Output-, Outcome- und Financial-Metriken werden getrennt angezeigt | UI-Test |
| R1 | Referenzielle Integrität: alle IDs existieren | Build-Validierung |
| R2 | Jede Aussage hat `statementType`. `[BELEG]` erfordert eine gültige `sourceId` | Build-Validierung |
| R3 | Jeder im UI verwendete Fachbegriff existiert im Glossar | Build-Validierung (Begriffsliste) |
| T1 | Aufgabenerhalt je Ausprägung (Abschn. 1.1) | Unit-Test |

---

## 6. Organisationsszenarien

### 6.1 Dimensionen
| ID | Dimension (EN) | DE | Werte (EN) | Definition |
|---|---|---|---|---|
| D1 | Budget authority | Budgethoheit | business / IT / shared | **Wer** hat das Entscheidungsrecht über die Verwendung von Technologie-Investitionsmitteln |
| D2 | Funding structure | Finanzierungsstruktur | central / decentral / federated | **Auf welcher Ebene** Mittel gebündelt und zugeteilt werden: Enterprise / Geschäftsbereich / zentraler Kern + delegierte Töpfe |
| D3 | Organisation structure | Organisationsstruktur | functional / product & value stream / hybrid | Grundlogik der Aufbauorganisation in Technologie und Delivery |
| D4 | Delivery model | Liefermodell | project / flow / hybrid | Wie Arbeit organisiert und finanziert umgesetzt wird |
| D5 | Portfolio structure | Portfoliostruktur | single / multiple coupled | Ein Portfolio oder mehrere Portfolios, von denen **mindestens einige** über gemeinsame Ziele, Initiativen oder Investments gekoppelt sind. Nicht jedes Portfolio muss gekoppelt sein [BEST] |
| D6 | Governance | Governance | centralised / delegated within guardrails | Lage der Entscheidungsrechte |
| D7 | Cost recovery | Kostenverrechnung | none / showback / chargeback | **Wer trägt** Ist-Kosten wirtschaftlich [BEST E1] |
| X | Operating variant | Ausprägung | enterprise / compact | vom Moderator gewählt [BEST E2] |

**Festlegungen 07.10.2026 [BEST]:**
- **Geteilte Plattform:** Jedes Szenario enthält mindestens eine geteilte Plattform (QA-P0-1). Q5 und Regeln mit Plattformbezug setzen das voraus. Es gibt keine zusätzliche Dimension.
- **Finanzierungsmodus wird aus D4 abgeleitet**, keine achte Dimension (QA-P0-2): project → projektbasierte Finanzierung · flow → Wertstromfinanzierung (Lean Budgets, S-SAFE-3) · hybrid → beide Logiken nebeneinander.

**Abgrenzung D1/D2/D7:** D1 = wer entscheidet · D2 = wo Mittel gebündelt werden · D7 = wer Ist-Kosten trägt. Beispiele: „IT + decentral“ = Bereichs-IT verfügt über eigene Töpfe. „Business + central“ = zentrale Mittel, über deren Verwendung Business-Vertreter entscheiden.

**Indikatoren für die Ausprägung** (werden angezeigt, nicht verrechnet): Anzahl Portfolios (D5) · Stärke portfolioübergreifender Investitionsabhängigkeiten · Budgetverteilung über Bereiche · Entscheidungsautonomie der Bereiche. Nur D5 ist konfigurierbar. Die anderen drei sind **Gesprächsfragen** des Moderators.
Konsistenzhinweis: Ausprägung „enterprise“ mit D5 „single“ ist untypisch → Hinweis, kein Verbot.

### 6.2 Ergebnisfragen [BEST]
| ID | Frage (EN in der App) |
|---|---|
| Q1 | Who decides on which investment? |
| Q2 | Who funds and who bears the cost? |
| Q3 | Who prioritises delivery? |
| Q4 | Who owns products and outcomes? |
| Q5 | How are shared platforms funded? |
| Q6 | Where are conflicts and dependencies resolved? |
| Q7 | Which information must flow between disciplines? |

### 6.3 Regelmechanik [SYN]
```
Rule {
  id, question: Q1..Q7,
  when: Partial<Record<D1..D7|X, value[]>>,   // leere Bedingung = Basisregel
  text (EN), rationale, statementType, sourceIds?
  kind: "pattern" | "tension" | "atypical"
}
```
- **Basisregeln je Dimension** liefern die Antwortbausteine. **Wechselwirkungsregeln** (kind `tension`) markieren Spannungsfelder. `atypical` markiert seltene Kombinationen.
- **Determinismus:** Auswertung = Filter + feste Sortierung (Frage, Spezifität, ID). Kein Zufall, keine Gewichtung, kein Score.
- **Vollständigkeit:** Für jede der 972 Kombinationen × 2 Ausprägungen liefert jede Q1–Q7 mindestens eine Aussage (Eigenschaftstest).
- Hinweis immer sichtbar: „Typical design pattern for discussion – not a diagnosis.“

### 6.4 Erste Spannungsfelder (Beispiele, zur fachlichen Prüfung) [SYN]
| ID | Bedingung | Spannungsfeld |
|---|---|---|
| TN1 | D4 = flow ∧ D6 = centralised | Wertströme sind dauerhaft finanziert, doch jedes Vorhaben braucht eine zentrale Einzelfreigabe. Die Flow-Logik wird durch Projekt-Gates unterlaufen |
| TN1b | D4 = hybrid | Projekt- und Wertstromfinanzierung laufen nebeneinander, Kapazität und Mittel werden doppelt verplant oder umkämpft |
| TN2 | D7 = chargeback (Plattform immer vorhanden) | Konsumenten optimieren eigene Kosten, die Plattform wird unterfinanziert oder gemieden |
| TN7 | D5 = multiple coupled | **Bedingt formuliert:** *Wo* Investments portfolioübergreifend laufen, priorisiert jedes Portfolio seinen Anteil separat. Ohne abgestimmte Sequenzierung entstehen Wartezeiten und Teil-Lieferungen ohne Outcome. Nicht jedes Portfolio ist gekoppelt (z. B. ein HR-Portfolio ohne übergreifende Vorhaben); der Moderator klärt im Gespräch, welche Portfolios betroffen sind [BEST 07.10.2026, A8 verworfen] |
| TN3 | D1 = business ∧ D2 = decentral ∧ D5 = multiple | Enterprise-Plattformen und Modernisierung ohne natürlichen Finanzierer |
| TN4 | D3 = functional ∧ D4 = flow | Wertströme quer zu Linienverantwortung, unklare Outcome-Ownership |
| TN5 | D6 = delegated ∧ keine Kostentransparenz (D7 = none) | Delegation ohne wirtschaftliche Rückkopplung |
| TN6 | X = compact ∧ D5 = multiple | Enterprise-Aufgaben ohne Gremium. Wer löst Portfolio-Konflikte? |

Die Regeltabelle wird in I5 von Requirements Engineering vollständig ausformuliert und von QA vor der Implementierung als Entscheidungstabelle geprüft.

---

## 7. Durchgängiges Beispiel (Rahmen) [BSP]

Fiktive **Halvard Industrial Group** (E6) mit zwei Geschäftsbereichen-Portfolios (*Industrial Solutions*, *Aftermarket Services*) und einem *Digital Platforms*-Portfolio. Alle Zahlen sind synthetisch.

**Enterprise-Initiative:** *Customer Service Platform*. Sie verbindet Wachstum (Self-Service, schnellere Fallbearbeitung) und notwendige Investition (Ablösung von drei redundanten CRM-Anwendungen, eine davon auf End-of-Life-Technologie).

| Station | Fähigkeit | Inhalt |
|---|---|---|
| S1 | C1 | Ziele: Serviceerlebnis verbessern; Technologierisiko senken |
| S2 | C5 | Capability „Customer service management“, 3 redundante Anwendungen, EOL-Technologie |
| S3 | C2/C3 | Initiative über 3 Portfolios: **ein portfolioübergreifendes Plattform-Investment** (lead: Digital Platforms; contributing: beide Geschäftsbereiche) + je ein fachliches Investment pro Geschäftsbereich |
| S4 | C2 | Finanzierung: Target der Gruppe für IT-Kosten → Portfoliobudgets; Plattform-Investment mit Anteilen aus drei Portfolios (K6 sichtbar), fachliche Investments aus Portfoliobudgets; Nutzenhypothesen |
| S5 | C3/C6 | Portfolio-Kanban, Kapazität, Abhängigkeit fachlicher Investments von der Plattform |
| S6 | C4/C7 | Betrieb: neue RUN-Kosten, Doppelbetrieb während der Migration → **Forecast liegt über Budget** (Frühindikator); TBM-Allokation der Actuals an Konsumenten inkl. unallocated |
| S7 | C8 | Output live ≠ Adoption ≠ Servicekosten-Effekt; EOL-Risiko beseitigt |
| S8 | C8 → C1/C2 | Reallokation: Forecast- und Ist-Abweichung + Outcome-Rückmeldung → Weiterfinanzierung, Altanwendungen abschalten, Budget umschichten, Target der Folgeperiode anpassen |

Kompakte Variante: dieselbe Geschichte mit einem Portfolio, ohne EPM-Ebene. Gezeigt wird, wo die Aufgaben aus 1.1 dann liegen.
Der Datensatz muss K1–K11, W1–W3 und T1 erfüllen (REQ-005).
