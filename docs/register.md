# Register: Entscheidungen, Annahmen, Risiken

Stand: 07.10.2026. Jede ID ist stabil und wird nicht wiederverwendet.

## Entscheidungen

| ID | Thema | Status | Entscheidung / Empfehlung | Datum |
|---|---|---|---|---|
| E1 | Kostenverrechnung als eigene Szenario-Dimension | ✅ entschieden [BEST] | D7 „Cost recovery“: none / showback / chargeback | 07.10.2026 |
| E2 | Ausprägung Enterprise/kompakt | ✅ entschieden [BEST] | Moderator wählt; App zeigt Indikatoren dafür/dagegen, verrechnet sie nicht | 07.10.2026 |
| E3 | App-Sprache | ✅ entschieden [BEST] | Englisch; Doku/Kommunikation Deutsch; Glossar zweisprachig | 07.10.2026 |
| E4 | Hosting/Auslieferung | offen | Empfehlung: statischer Build, Anbieter offen. Nicht blockierend bis I7 | – |
| E5 | Corporate Identity | ✅ Grundlage erhalten [BEST] | Eraneos PowerPoint Guide S. 16/17 (Screenshots). Übertragung in `docs/design/tokens.md`. Greyscale-Standard, Orange als Hervorhebung | 07.10.2026 |
| E5a | Offizielle Hex-Werte | offen, bis I7 zurückgestellt [BEST] | Werte sind aus Screenshot-Pixeln gelesen → offizielle Werte bestätigen | – |
| E5b | Web-Schriften | offen, bis I7 zurückgestellt [BEST] | Eraneos Display: Webfont + Web-Lizenz nötig, sonst Fallback. Aptos: nur per Name referenzieren, keine Dateien weitergeben | – |
| E5c | Logo-Datei | offen, bis I7 zurückgestellt [BEST] | offizielle SVG anfordern, nicht nachzeichnen | – |
| E15 | Kontoweiten Skill `eraneos-ci` an Screenshots angleichen? | offen | Skill weicht ab (u. a. Orange `#E8622C` statt `#FF6529`). Betrifft andere Projekte → eigene Entscheidung. Für dieses Projekt gilt `docs/design/tokens.md` | – |
| E6 | Name der fiktiven Beispielorganisation | ✅ entschieden [BEST] | **Halvard Industrial Group** (fiktiv). Websuche 07.10.2026 ohne Treffer; keine Markenprüfung, diese bleibt vor externer Nutzung offen (E9). „Northwind“ verworfen | 07.10.2026 |
| E7 | Skills ins Repo kopieren? | offen | Empfehlung: kontoweit lassen, Mapping in `CLAUDE.md`. Kopie erst bei Teamarbeit | – |
| E8 | Login, DB, gespeicherte Szenarien, Mandanten, Integrationen | bewusst später | Nicht ungefragt hinzufügen; je Thema eigenes ADR | – |
| E9 | Lizenz-/Markenprüfung Framework-Referenzen | offen | Klärung mit Rechts-/Compliance-Stelle **vor externer Nutzung**, nicht vor dem Bau | – |
| E10 | Bezeichnung der übergreifenden Ebene | offen | „Enterprise Portfolio Management“ als Arbeitstitel; Hinweis auf „Strategic Portfolio Management“ als Marktbegriff (Gartner NICHT VERIFIZIERT) | – |
| E11 | Architektur v1 | ✅ Accepted | ADR-001: Next.js, vollständig statischer Export, kein separates Backend (in I1 belegt) | 07.10.2026 |
| E12 | Versionen | ✅ Accepted | ADR-002: Next.js 16.4.0, React 19.3.0, Node 24, TypeScript 6.0.3, ESLint 9.39.5, Zod 4.6.5, Vitest 5.0.3 | 07.10.2026 |
| E13 | Kardinalitäten im Beziehungsmodell | ✅ entschieden [BEST] | Wertstrom ∈ genau ein Portfolio. Investments können portfolioübergreifend sein (in mehreren Portfolios finanziert und umgesetzt) → Zuordnungsobjekt PortfolioParticipation, Regeln K6–K8 | 07.10.2026 |
| E16 | Geteilte Plattform in Szenarien | ✅ entschieden [BEST] | Jedes Szenario enthält mindestens eine geteilte Plattform (QA-P0-1) | 07.10.2026 |
| E17 | Finanzierungsmodus | ✅ entschieden [BEST] | Aus D4 Liefermodell abgeleitet, keine achte Dimension (QA-P0-2) | 07.10.2026 |
| E14 | Gültige Werte-Kombinationen der Dimensionen | ✅ entschieden [BEST] | Alle Kombinationen zulässig; untypische werden markiert, nicht gesperrt | 07.10.2026 |
| E18 | Versionsverwaltung | ✅ entschieden [BEST] | Dateien zunächst nur lokal speichern. Lokales Repo ist initialisiert, aber **ohne Commit**. Erster Commit erst nach den ersten initialen lokalen Tests (I1); GitHub-Übertragung danach und nur auf ausdrückliche Anweisung | 07.10.2026 |
| E19 | Wertarten Target / Budget / Forecast / Actual | ✅ entschieden [BEST] | Als Wertart-Achse für Kosten und Finanzierung (`model.md` 2.1). MVP-Tiefe: in Vertiefungen C2/C4 und im Halvard-Beispiel, keine eigene Seite | 07.10.2026 |
| E20 | Glossar-Gliederung | ✅ entschieden [BEST] | Gruppiert nach Kategorien, alphabetisch je Gruppe; AC-001-1 Rev. 3 (QA-I1-1) | 07.10.2026 |
| E21 | GitHub-Repository | ✅ umgesetzt [BEST] | `https://github.com/Credo1121/Value-Driven-Organization.git` als `origin`; erster Push 07.10.2026 durch den Auftraggeber; Token nur im macOS-Schlüsselbund, nie im Repo/Chat | 07.10.2026 |
| E22 | Leitdisziplinen C2 und C7 | ✅ entschieden [BEST] | C2: EPM führt übergreifend, danach übernimmt LPM (Abfolge EPM → LPM). C7: IT Ops führt. C3 und C8 (EPM/LPM) noch nicht bestätigt | 07.10.2026 |
| E23 | Darstellung Gesamtbild | ✅ entschieden [BEST] | Swimlane-Matrix: Spalten = 6 Phasen (Sequenz), Lanes = Enterprise/Portfolio/Delivery & operations (Hierarchie), parallel TBM und EA, angrenzend Finance; Netzdiagramm ersetzt. REQ-003 Rev. 2 | 07.10.2026 |
| E24 | Führungsabfolge C3–C8 | ✅ entschieden [BEST] | Wo Enterprise- und Portfolio-Ebene beide steuern, gilt durchgängig EPM → LPM (übergreifend zuerst, dann im Portfolio): C2, C3, C8. C4 (TBM), C5 (EA), C6 (LPM), C7 (IT Ops) haben eine einzelne Leitdisziplin | 07.10.2026 |
| E25 | Abnahme Gesamtbild | ✅ entschieden [BEST] | Swimlane-Matrix inkl. Zellinhalte und ACs REQ-003 Rev. 2 als PoC abgenommen; Feinschliff später möglich | 07.10.2026 |
| E26 | Vorgehen I3 | ✅ entschieden [BEST] | I3 freigegeben. C2 zuerst vollständig, die übrigen sieben mit Vorlage und offenen Abschnitten; Inhalte C1, C3–C8 erst nach Review von C2 | 07.10.2026 |
| E27 | Visuelle Richtung | ✅ entschieden [BEST] | Clean, Apple-naher Light-Look für die ganze Website: Konzept A (Matrix mit Zeitleisten-Strahl) als Detailansicht mit gepunkteten Einflusspfeilen aus B; Konzept C (Kreis) als Einstiegs- und Übersichtsbild ohne Punkt-Halo, Beschreibungskarte rechts mit Pfeilen nach unten/weiter und benannten Ebenen. Apple-Neutraltöne und Systemschrift statt warmer CI-Grautöne/Aptos; Eraneos-Orange bleibt Akzent | 07.10.2026 |

## Annahmen

| ID | Annahme | Prüfung |
|---|---|---|
| A1 | ✅ bestätigt 07.10.2026: `markdown-web-applikationen` ist das Markdown-Dokument und bildet den grundsätzlichen Rahmen für die sieben Skills | erledigt |
| A2 | ✅ bestätigt 07.10.2026: `Value-Driven-Organization/` ist das Projekt-Repository; `Portfolio Management/` enthält Vorarbeiten (Input) | erledigt |
| A3 | ~~Ein Investitionsvorhaben gehört genau einem Portfolio~~ **verworfen** 07.10.2026: Investments können portfolioübergreifend sein (E13) | erledigt |
| A4 | ✅ bestätigt 07.10.2026: App muss lokal vom Laptop ohne Internet laufen (Präsentationsbildschirm) | erledigt |
| A5 | ✅ bestätigt 07.10.2026: Ein Wertstrom gehört genau einem Portfolio | erledigt |
| A7 | ✅ bestätigt 07.10.2026: Jedes portfolioübergreifende Investment hat genau ein federführendes Portfolio (Business Case, Outcome-Verantwortung); weitere Portfolios sind beitragend (K8) | erledigt |
| A8 | ~~Bei D5 = multiple existiert immer ein portfolioübergreifendes Investment~~ **verworfen** 07.10.2026: nicht jedes Portfolio ist gekoppelt (Beispiel HR). TN7 wird bedingt formuliert statt vorausgesetzt | erledigt |
| A9 | ✅ bestätigt 07.10.2026: Wertarten im MVP als Jahreswerte (Ebenen Enterprise/Portfolio/Kostenpool), ein Forecast-Stand je Periode, keine Monatswerte | erledigt |
| A6 | „Investment“ ist der generische EN-Begriff für Epic / Projekt / Programm | Glossar-Review |

## Risiken

| ID | Risiko | Auswirkung | Maßnahme |
|---|---|---|---|
| R1 | Synthese wird als Standard missverstanden | fachliche Angreifbarkeit beim Kunden | Aussagetyp-Kennzeichnung in UI und Inhalten (REQ-002, REQ-008) |
| R2 | Content-Aufwand unterschätzt (8 Vertiefungen, Regeltexte, Beispiel) | Verzögerung | Template; erst eine Fähigkeit vollständig (I3) |
| R3 | Visuelle Überladung des Gesamtbilds | Verständnis leidet | schrittweises Einblenden, Filter je Beziehungsart (REQ-003) |
| R4 | Vermischung von Framework-Versionen | Inkonsistenz | Version je Quelle in `docs/sources.md` |
| R5 | Lizenz-/Markenverletzung (SAFe-Kopierverbot, IT4IT-Lizenz und KI-Trainingsverbot, TBM „all rights reserved“) | rechtlich, reputativ | eigene Formulierung und Grafiken, kurze Referenz + Link, E9 |
| R6 | Szenarioregeln wirken wie objektive Diagnose | Glaubwürdigkeit | kein Score, Hinweisbanner, Regeln als Muster formuliert (REQ-006) |
| R7 | Kombinatorik (3·3·3·3·2·2·3 = 972) erzeugt willkürliche Texte | inkonsistente Aussagen | Regeln je Dimension + wenige Wechselwirkungsregeln, Vollständigkeitstest |
| R8 | Primärquellen hinter Login/403 (SAFe-Details, Gartner, PMI) | Belege fehlen | als NICHT VERIFIZIERT führen, ggf. Auftraggeber-Zugang nutzen |
| R9 | Next.js-Minor-Releases in kurzer Folge | Versionsdrift | exaktes Pinning, Upgrades nur per eigenem CHG |
| R10 | Wertarten wirken wie Controlling-Tool | App wird als operatives Finanzsystem missverstanden (Nicht-Scope) | wenige synthetische Jahreswerte, Fokus auf Steuerungslogik und Rückkopplung statt auf Reporting |
| R11 | `npm audit`: 5 × high (braces, DoS) in der Lint-Toolchain (eslint-config-next 16.4.0 → fast-glob → micromatch) | nur Entwicklungswerkzeug, nicht im ausgelieferten Build; `--omit=dev` = 0 Befunde | kein `audit fix --force` (würde auf v14 zurückstufen); bei neuer eslint-config-next-Version erneut prüfen |
| R12 | Darstellungsunterschiede zwischen Browsern (BUG-001 blieb in Chromium-only-QA unentdeckt) | Workshop-Darstellung auf Kundengeräten fehlerhaft | E2E seit 07.10.2026 in Chromium, Firefox, WebKit inkl. Layout-Integritätstest |
