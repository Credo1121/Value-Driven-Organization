# REQ-008 – Reference approaches

- **Status:** Draft · **Revision:** 1 · **Prio:** Should · **Inkrement:** I6
- **Quelle:** Auftrag Abschn. 8C, 11 [BEST]

## Problem und Nutzen
Kunden fragen: „Was sagt SAFe / TBM / TOGAF dazu?“ Die App zeigt die Referenzansätze, ihre Voraussetzungen und wo unsere Integration beginnt.

## Scope
- Seite `/references` mit je einem Abschnitt: TBM (Framework, Taxonomy 5.0.1), SAFe LPM, IT4IT 3.0.1, TOGAF 10th Ed. (Capabilities), EPM/SPM (als Begriffsfeld), unser integriertes Referenzmodell
- **Nicht-Scope:** Framework-Grafiken, längere Zitate, Benchmarks, Herstellervergleiche

## Geschäftsregeln
- Je Ansatz getrennt: *Framework-based statements* · *Our integration* · *Illustrative examples* · *Benchmarks*. Benchmarks im MVP: „none provided“.
- „Best practice“ nur mit Begründung und Einsatzbedingungen (when it fits / when it does not)
- Version und Abrufdatum je Ansatz sichtbar

## Akzeptanzkriterien
- **AC-008-1** Given ein Referenzansatz, then sind die vier Aussagekategorien getrennt dargestellt; leere Kategorien sind explizit leer.
- **AC-008-2** Given eine Aussage, die „best practice“ verwendet, when der Build läuft, then schlägt er fehl, wenn die Felder `rationale` und `conditions` fehlen.
- **AC-008-3** Given ein Ansatz, then werden Version, Datum und Quellen-ID angezeigt; nicht verifizierte Inhalte sind markiert.
- **AC-008-4** Given unser integriertes Referenzmodell, then ist es durchgängig als *Our synthesis* gekennzeichnet und nennt Voraussetzungen (z. B. mehrere gekoppelte Portfolios für die Enterprise-Ausprägung).

## Offene Fragen
E9, E10. Zugang zu SAFe-Detailseiten und TBM-Whitepaper (R8).
