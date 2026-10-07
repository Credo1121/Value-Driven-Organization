# REQ-002 – Sources & statement types

- **Status:** Draft · **Revision:** 1 · **Prio:** Must · **Inkrement:** I1
- **Quelle:** Auftrag Abschn. 1, 8C, 11 [BEST]

## Problem und Nutzen
Glaubwürdigkeit gegenüber CIOs hängt an der Trennung von belegten Framework-Aussagen, eigener Synthese, Beispielen und (nicht vorhandenen) Benchmarks. Risiko R1.

## Scope
- Seite `/sources` mit allen Quellen aus `docs/sources.md`
- Sichtbare Kennzeichnung des Aussagetyps an jeder fachlichen Aussage
- **Nicht-Scope:** Volltexte, Zitate längerer Passagen, Framework-Grafiken (R5)

## Geschäftsregeln
- Aussagetypen in der App (EN): *Framework-based* (BELEG), *Our synthesis* (SYN), *Illustrative example* (BSP), *Assumption* (ANN). „Benchmark“ wird im MVP **nicht** verwendet (keine belegten Benchmarks vorhanden).
- Quelle: ID, Titel, URL, Abrufdatum, Version, belegte Aussagen, Grenzen, Lizenzhinweis, Status (verified / not verified)
- Nicht verifizierte Quellen werden als solche angezeigt und dürfen nicht als Beleg dienen.

## Akzeptanzkriterien
- **AC-002-1** Given eine fachliche Aussage im Inhalt ohne Aussagetyp, when der Build läuft, then schlägt er fehl (R2).
- **AC-002-2** Given eine Aussage vom Typ *Framework-based*, when sie keine gültige `sourceId` einer Quelle mit Status *verified* hat, then schlägt der Build fehl.
- **AC-002-3** Given eine Aussage in der UI, then ist ihr Typ durch Text oder Symbol mit Textalternative erkennbar, nicht nur durch Farbe.
- **AC-002-4** Given die Quellenseite, then zeigt jede Quelle Version/Datum, Abrufdatum, Grenzen und Lizenzhinweis. Nicht verifizierte Quellen sind sichtbar markiert.
- **AC-002-5** Given eine Aussage mit Quellen-ID, when der Nutzer den Quellenverweis aktiviert, then gelangt er zum Quelleneintrag.

## Offene Fragen
E9 (Lizenz-/Markenprüfung vor externer Nutzung).
