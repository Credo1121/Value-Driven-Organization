# REQ-007 – Operating variant enterprise / compact

- **Status:** Draft · **Revision:** 1 · **Prio:** Must · **Inkrement:** I4/I5
- **Quelle:** Auftrag Abschn. 6 [BEST]; E2 [BEST]

## Problem und Nutzen
Nicht jede Organisation braucht eine separate EPM-Ebene. Die App muss zeigen, wo Steuerungsaufgaben liegen, wenn Ebenen oder Gremien entfallen.

## Scope
- Umschalter in `/example` und `/scenarios`, im Gesamtbild als Hinweis
- Indikatorliste (Portfolioanzahl, Investitionsabhängigkeiten, Budgetverteilung, Entscheidungsautonomie) als Gesprächsfragen
- **Nicht-Scope:** automatische Ableitung der Ausprägung

## Geschäftsregeln
- Ausprägung wird ausschließlich vom Nutzer gewählt (E2)
- Aufgabenerhalt T1 (`model.md` 1.1)
- Die Größe allein wird nicht als Kriterium dargestellt

## Akzeptanzkriterien
- **AC-007-1** Given ein Wechsel von enterprise zu compact, then zeigt die App für jede Aufgabe aus `model.md` 1.1 die zuständige Rolle bzw. das Gremium in beiden Ausprägungen.
- **AC-007-2** Given die Aufgabenliste, when T1 als Test läuft, then hat in beiden Ausprägungen jede Aufgabe genau eine Zuständigkeit (keine verwaiste, keine doppelte).
- **AC-007-3** Given die Ausprägungswahl, then werden die vier Indikatoren als Fragen angezeigt, ohne Berechnung oder Empfehlung.
- **AC-007-4** Given compact mit D5 = multiple coupled, then erscheint der Hinweis „atypical – discuss how cross-portfolio conflicts are resolved“ (TN6).
- **AC-007-5** Given die App, then wird nirgends die Unternehmensgröße allein als Kriterium für die Ausprägung genannt.
