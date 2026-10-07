# QA – Testbarkeitsprüfung der Anforderungen (P0)

- **Datum:** 07.10.2026 · **Rolle:** `5-qa` (Anforderungsprüfung vor Implementierung)
- **Geprüft:** REQ-001 … REQ-010 (Revision 1), `docs/domain/model.md` v0.1
- **Einschränkung:** Rollenwechsel im selben Modell, keine unabhängige externe Prüfung. Es gibt keinen Code; Ausführung von Tests: **NOT RUN** (nicht anwendbar).

## Nachtrag 07.10.2026
QA-P0-1 und QA-P0-2 durch Auftraggeber entschieden (E16, E17), E13 entschieden (portfolioübergreifende Investments → K6–K8, AC-005-8). REQ-006 ist damit **nicht mehr blockiert**. Neue Regeln K6–K8 sind testbar formuliert (Unit-Tests + Negativ-Fixtures). Verbleibend: A7 (federführendes Portfolio), Entscheidungstabelle (QA-P0-5).

## Ergebnis (ursprünglich)
**BLOCKED für „Ready“** bei REQ-006 (zwei Befunde). Die übrigen REQs sind testbar formuliert. Status „Ready“ setzt zusätzlich die fachliche Bestätigung offener Punkte voraus.

## Befunde

| ID | REQ/AC | Schwere | Befund | Vorschlag |
|---|---|---|---|---|
| QA-P0-1 | REQ-006 / AC-006-6, model 6.4 TN2 | hoch | Die Bedingung „shared platform“ ist **keine Dimension**. Damit ist TN2 nicht deterministisch aus D1–D7/X auswertbar | Entweder Annahme „jedes Szenario hat mindestens eine geteilte Plattform“ (TN2 = D7 chargeback) oder neue Ja/Nein-Option. Empfehlung: Annahme, weil Q5 Plattformen ohnehin voraussetzt |
| QA-P0-2 | REQ-006, model 6.4 TN1 | hoch | „Finanzierung je Projekt“ wird über D2 = decentral ∧ D6 = centralised angenähert. Das ist fachlich nicht dasselbe. Der **Finanzierungsmodus** (projekt- vs. wertstrombasiert) ist in keiner Dimension enthalten | Fachliche Klärung: Finanzierungsmodus aus D4 ableiten (project → projektbasiert) oder als Ausprägung von D2 präzisieren. Wechselwirkung mit E1/D7 beachten |
| QA-P0-3 | REQ-001 / AC-001-2 | mittel | Die Prüfung erkennt nur **markierte** Begriffe. Unmarkierte Verwendung („budget“ als Fließtext) bleibt unentdeckt | Ergänzende Prüfung: Liste verbotener Synonyme/Mischbegriffe (z. B. „IT budget cost“) als Lint-Regel; Rest manuelles Review |
| QA-P0-4 | REQ-003 | mittel | Mindestschriftgröße für Präsentation nicht festgelegt → AC zur Lesbarkeit nicht prüfbar | in I2 Zielwert festlegen (Vorschlag: Diagrammbeschriftung ≥ 16 px bei 1280 px) |
| QA-P0-5 | REQ-006 / AC-006-8 | mittel | Die Entscheidungstabelle existiert noch nicht. Ohne sie sind Regeltests nur Selbstspiegelung des Codes | Tabelle in I5 **vor** Implementierung durch RE erstellen, vom Auftraggeber bestätigen lassen |
| QA-P0-6 | REQ-005 / AC-005-6 | niedrig | Negativ-Fixtures sind nicht benannt | je Regel K1–K11, W1–W3 mindestens ein benanntes Negativ-Fixture in I4 |
| QA-P0-7 | REQ-009 / AC-009-2 | niedrig | Kontrastprüfung für SVG-Linien (Nicht-Text) muss manuell erfolgen | Token-Kontrasttabelle (AC-010-4) dient als Nachweis |
| QA-P0-8 | QZ5 | info | keine Performance-Ziele | bei statischem Export akzeptabel; bewusst offen |

## Risikobasierte Testschwerpunkte (Plan)
1. Szenarioregeln: Vollständigkeit + Determinismus (Eigenschaftstest), Spezifikationstabelle
2. Kosten-/Finanzierungskonsistenz: K1–K11, W1–W3 mit Negativ-Fixtures (inkl. portfolioübergreifender Anteile)
3. Aufgabenerhalt T1 in beiden Ausprägungen
4. Build-Validierung R1–R3 (Quellen, Aussagetypen, Glossar)
5. Nutzerreise Moderation: Start → Big picture → Capability → Example → Scenarios (E2E)
6. Zugänglichkeit: Tastatur, Fokus, Nicht-Farb-Kodierung, axe
7. Typecheck, Lint, Build je Inkrement
