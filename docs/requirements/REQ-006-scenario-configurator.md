# REQ-006 – Scenario configurator

- **Status:** Draft · **Revision:** 2 · **Prio:** Must · **Inkrement:** I5
- **Quelle:** Auftrag Abschn. 8D, 9 [BEST]; E1, E2 [BEST]; Regelmechanik `model.md` Abschn. 6 [SYN]

## Problem und Nutzen
Im Workshop werden organisatorische Bedingungen des Kunden eingestellt. Die App zeigt typische Steuerungsmuster und Spannungsfelder als Diskussionsgrundlage.

## Scope
- Seite `/scenarios`: Auswahl D1–D7 + Ausprägung X, Ergebnis zu Q1–Q7, Entscheidungsrechte-Matrix, Spannungsfelder
- Optional: zwei Konfigurationen nebeneinander vergleichen → [OFFEN], Vorschlag Should in I5
- Zustand im URL (teilbar, keine Speicherung)
- **Nicht-Scope:** Scores, Reifegrade, Rangfolgen, Empfehlungen „das beste Modell“, Einsparprognosen, Speicherung

## Geschäftsregeln
- Regeln deterministisch, UI-unabhängig (`model.md` 6.3)
- Jede Ergebnisaussage zeigt Aussagetyp und auslösende Dimensionen („because: Delivery model = flow“)
- Untypische Kombinationen werden markiert, nicht gesperrt (E14)
- Jedes Szenario enthält mindestens eine geteilte Plattform (E16)
- Der Finanzierungsmodus wird aus D4 abgeleitet und in der Ergebnisansicht benannt (E17)
- Hinweis immer sichtbar: „Typical design pattern for discussion – not a diagnosis.“

## Akzeptanzkriterien
- **AC-006-1** Given eine beliebige Konfiguration (972 × 2 Kombinationen), when ausgewertet, then liefert jede Frage Q1–Q7 mindestens eine Aussage (Eigenschaftstest über alle Kombinationen).
- **AC-006-2** Given dieselbe Konfiguration, when zweimal ausgewertet, then ist das Ergebnis inklusive Reihenfolge identisch.
- **AC-006-3** Given eine Ergebnisaussage, then sind die auslösenden Dimensionswerte sichtbar.
- **AC-006-4** Given die Ergebnisansicht, then gibt es keine numerischen Scores, Ampeln oder Ranglisten für Szenarien.
- **AC-006-5** Given eine Konfiguration, when der Nutzer die URL kopiert und in neuem Tab öffnet, then ist dieselbe Konfiguration eingestellt. Ungültige Parameter werden ignoriert und durch Standardwerte ersetzt, mit sichtbarem Hinweis.
- **AC-006-6** Given eine Bedingung eines Spannungsfelds (z. B. TN2: chargeback + shared platform), then erscheint das Spannungsfeld mit Erklärung; ohne die Bedingung erscheint es nicht.
- **AC-006-7** Given D1, D2 und D7, then erklärt die UI über Hilfetexte den Unterschied „who decides / where funds are pooled / who bears actual cost“.
- **AC-006-8** Given die Spezifikations-Entscheidungstabelle (von RE/QA vor Implementierung erstellt), when die Regeltests laufen, then stimmen die Ergebnisse für alle Tabellenzeilen überein.
- **AC-006-9** Given die Seite wird ohne Konfiguration geöffnet, then ist eine dokumentierte Standardkonfiguration gesetzt (Vorschlag: Werte des Beispiels) und als solche erkennbar.
- **AC-006-10** Given D4 = project / flow / hybrid, then benennt die Ergebnisansicht den abgeleiteten Finanzierungsmodus (projektbasiert / Wertstromfinanzierung / beide nebeneinander) mit Hinweis „derived from delivery model“.
- **AC-006-11** Given D5 = multiple coupled, then wird TN7 bedingt formuliert („where investments span portfolios …“) und unterstellt nicht, dass alle Portfolios gekoppelt sind.

## Offene Fragen
Vergleichsansicht im MVP? Vollständige Regeltabelle (I5, RE). Fachliche Prüfung TN1–TN7. (QA-P0-1/2 entschieden 07.10.2026.)
