# CLAUDE.md – Verbindliche Arbeitsregeln

Projekt: **The Value Driven Organization** (Arbeitstitel). Fachlicher Kontext steht in `docs/project-context.md`, nicht hier.

## 1. Vor jeder Arbeit lesen
1. `docs/project-state.md` – aktueller Stand, Gates, nächster Schritt
2. `docs/project-context.md` – Zweck, Scope, Stack
3. Relevante `docs/requirements/REQ-*.md` und `docs/register.md`

Dokumentierten Stand mit tatsächlichen Dateien abgleichen. Historie nicht aus Vermutungen rekonstruieren.

## 2. Gemeinsame Regeln
Der Skill `markdown-web-applikationen` (Skill 0) ist der **grundsätzliche Rahmen für alle sieben Rollen-Skills** [BEST, 07.10.2026]. Er wird hier **nicht** dupliziert.

Rangfolge:
1. **Skill 0** gilt immer und für jede Rolle (Fakten/Annahmen, Änderungen, Nachvollziehbarkeit, Prüfung, Sicherheit, Zusammenarbeit).
2. **Rollen-Skills 1–7** konkretisieren die Arbeit innerhalb dieses Rahmens.
3. **Diese Datei** ergänzt projektspezifische Regeln. Sie widerspricht Skill 0 nicht.

Bei einem scheinbaren Widerspruch zwischen den Ebenen: Arbeit anhalten und mit dem Auftraggeber klären, nicht stillschweigend auflösen.

Projektspezifische Ergänzungen:

- **Phasengate:** Code, Abhängigkeiten, Commits, Remote-Repos und Deployments nur nach ausdrücklicher Freigabe durch den Auftraggeber. Commits erst nach erfolgreichen lokalen Tests (`docs/register.md` E18). Aktuelle Phase siehe `docs/project-state.md`.
- **Scope:** Nur vereinbarten Scope umsetzen. Login, Datenbank, Mandanten, gespeicherte Szenarien, Integrationen und LLM-Empfehlungen **nicht ungefragt** ergänzen (`docs/register.md` E8).
- **Vorarbeiten** in `/Users/Marvin/Desktop/Claude/Portfolio Management/` sind Eingangsmaterial. Nicht verändern.
- **Ergebnisstatus:** PASS / FAIL / NOT RUN / BLOCKED. Keine erfundenen Tests, Quellen oder Erfolgsmeldungen.
- **Fehler:** reproduzieren → Hypothese → minimaler Fix → gezielte Prüfung. Nach **zwei** erfolglosen Fixversuchen derselben Ursache: Code anhalten, Versuche in `docs/project-state.md` dokumentieren, `7-help` einsetzen.
- **Keine** Anpassung von Akzeptanzkriterien für grüne Tests. Keine Secrets in Code, Doku, Logs oder Git.

## 3. Aussagetypen (Pflicht in Doku und Inhalten)
| Kürzel | Bedeutung |
|---|---|
| `[BEST]` | bestätigte Anforderung oder Entscheidung des Auftraggebers |
| `[BELEG]` | belegte Fachaussage mit Quellen-ID aus `docs/sources.md` (nur nach tatsächlichem Abruf) |
| `[SYN]` | eigene konzeptionelle Synthese |
| `[BSP]` | illustratives, fiktives Beispiel |
| `[ANN]` | vorläufige Annahme |
| `[OFFEN]` | offene Entscheidung (ID in `docs/register.md`) |

„Best Practice“ nur mit Begründung und Einsatzbedingungen. Eine Empfehlung ist kein Benchmark. Keine Zahlen ohne Quelle, ausgenommen ausdrücklich synthetische Beispieldaten.

## 4. Quellen und Lizenzen
- Framework-Inhalte (SAFe, TBM, IT4IT, TOGAF) **eigenständig formulieren**, kurz referenzieren und verlinken. Keine längeren Zitate, keine Übernahme geschützter Grafiken.
- Gartner/PMI: keinen Zugriff auf nicht gelesene Studien behaupten. Nicht abgerufene Inhalte gelten als „NICHT VERIFIZIERT“.
- Framework-Versionen nicht ungekennzeichnet vermischen.

## 5. Skills als Arbeitsrollen
Die Skills sind kontoweit installiert. Ihre Texte verweisen auf `web-*`-Namen. Zuordnung:

| In Skill-Texten | Installierter Skill | Zuständigkeit im Projekt |
|---|---|---|
| (Rahmen) | `markdown-web-applikationen` | grundsätzlicher Rahmen für alle sieben Rollen |
| `web-requirements` | `1-requirements-engineering` | Ziele, Scope, Geschäftsregeln, prüfbare ACs |
| `web-architecture` | `2-architecture` | Domänenmodell, Systemstruktur, ADRs, Sicherheitsgrenzen |
| `web-frontend` | `3-frontend` | zugängliche, konsistente UI und Visualisierung |
| `web-backend` | `4-backend` | Domänen- und Szenarioregeln, Inhaltsvalidierung (Build-Zeit) |
| `web-qa` | `5-qa` | frühe Anforderungsprüfung, risikobasierte Verifikation |
| `web-deploy` | `6-deploy` | Release-/Betriebsplanung, nur auf ausdrücklichen Aufruf |
| `web-help` | `7-help` | Prozessführung, strukturierte Fehlerdiagnose |

Die Skills sind Arbeitsmodi mit expliziten Übergaben, kein unabhängiges Team. Ein Rollenwechsel im selben Modell ist keine unabhängige Prüfung. Keine parallelen Schreibzugriffe auf dieselben Dateien.

## 5a. Fester Ablauf je Inkrement (agiles, cross-funktionales Team)

Jede Weiterentwicklung (neues Inkrement, neue Anforderung, Änderungswunsch) läuft in dieser Reihenfolge. Die Rollen entsprechen einem cross-funktionalen Team; der Auftraggeber ist **Product Owner** und hält die fachlichen Freigaben. Ein Skill löst den nächsten nicht selbst aus: Claude lädt die nächste Rolle, sobald die Übergabe der vorherigen vollständig ist.

| # | Schritt (Team-Analogie) | Rolle / Skill | Ergebnis = Übergabe an den nächsten Schritt | Gate |
|---|---|---|---|---|
| 0 | **Einstieg** (Daily/Kontext) | `7-help` | `docs/project-state.md` gelesen und mit Code/Git abgeglichen; Auftrag einem REQ/BUG zugeordnet oder neu angelegt | – |
| 1 | **Refinement** | `1-requirements-engineering` | REQ mit Ziel, Scope/Nicht-Scope, Geschäftsregeln, ACs (Given/When/Then); max. drei Rückfragen an den PO | **Definition of Ready** (s. u.) |
| 2 | **Testbarkeits-Check** (Three Amigos) | `5-qa` | ACs geprüft auf Eindeutigkeit und Testbarkeit; Testideen inkl. Negativfälle; Befunde zurück an Schritt 1 | keine blockierenden Befunde |
| 3 | **Sprint-Freigabe** | Auftraggeber (PO) | Freigabe zur Umsetzung; Status REQ → `Ready` | **PO-Freigabe erforderlich** |
| 4 | **Design** | `2-architecture` | nur wenn Datenmodell, Inhaltsvertrag, Struktur, Abhängigkeiten oder Sicherheit betroffen: Vertrag/Schema, ggf. ADR; sonst ausdrücklich „keine Architekturänderung“ vermerkt | Vertrag steht vor der Umsetzung |
| 5 | **Umsetzung** | `4-backend` (Domäne, Regeln, Inhaltsvalidierung) → `3-frontend` (UI) | Code + Tests gegen die ACs, Inhalte in `content/`; kleinster vertikaler Schnitt | `typecheck`, `lint`, Unit-Tests lokal grün |
| 6 | **Verifikation** | `5-qa` | `npm run check` (inkl. E2E in 3 Browsern), Sichtprüfung per Screenshot, `docs/qa/CHG-*.md` mit PASS/FAIL/NOT RUN je AC | **Definition of Done** (s. u.) |
| 7 | **Review** (Sprint Review) | Auftraggeber (PO) | kurze Zusammenfassung: Ergebnis, Nachweis, offene Punkte, lokale URL zum Ansehen | Feedback → neuer Durchlauf ab Schritt 1 oder Abnahme (`Accepted`) |
| 8 | **Abschluss** | `7-help` | `docs/changes/CHG-*.md`, Traceability in `docs/requirements/README.md`, `docs/register.md`, `docs/project-state.md` (nächster Schritt) aktualisiert; Commit + Push | Commit nur nach grünem Schritt 6 (E18) |
| – | **Release** | `6-deploy` | nur auf ausdrücklichen Aufruf | Freigabe je Umgebung |
| – | **Störung** | `7-help` | nach zwei erfolglosen Fixversuchen derselben Ursache: anhalten, Diagnose, dann zurück in Schritt 5 | neue Evidenz erforderlich |

### Definition of Ready (vor Schritt 3)
- Ziel und Nutzen in einem Satz, Bezug zu einem der sieben Brüche oder einem Bereich A–E
- Scope und Nicht-Scope benannt; keine ungefragten Erweiterungen (Abschn. 2, E8)
- ACs beobachtbar formuliert, inkl. Fehler-, Leer- und Grenzfällen, wo relevant
- Fachliche Aussagen mit Aussagetyp; Framework-Aussagen nur mit verifizierter Quelle (Abschn. 3, 4)
- Offene Fragen sind beantwortet oder ausdrücklich als nicht blockierend markiert

### Definition of Done (nach Schritt 6)
- Alle ACs des Inkrements PASS oder begründet NOT RUN; keine stillschweigend geänderten ACs
- `npm run check` Exit 0 (Typecheck, Lint, Unit, Build, E2E in Chromium, Firefox, WebKit inkl. axe)
- Sichtprüfung der betroffenen Seiten per Screenshot; keine Konsolen- oder Hydration-Fehler
- Inhalte valide (Build bricht sonst ab), Farben nur über Tokens, Texte der App auf Englisch
- Dokumentation nachgeführt (Schritt 8)

### Arbeitsweise
- **Kleine vertikale Schnitte:** lieber ein vollständiges Stück (Inhalt + Regeln + UI + Tests) als viele halbe.
- **Abkürzung für kleine Änderungen:** Bei Korrekturen ohne fachliche Auswirkung (Darstellung, Tippfehler, Bugfix mit klarer Ursache) dürfen die Schritte 1–4 auf eine Zeile im CHG verkürzt werden; Schritte 5–8 bleiben vollständig.
- **Auftrag an Claude:** Ein Auftrag nennt *was* und *wie weit*, z. B. „bis Schritt 1“ (nur Anforderungen), „bis Schritt 7“ (umsetzen und vorstellen) oder „inkl. Schritt 8“ (abschließen und committen). Ohne Angabe hält Claude nach Schritt 2 an und holt die Freigabe ein.
- **Transparenz:** Bei jedem Rollenwechsel kurz benennen, welche Rolle jetzt arbeitet und was übergeben wurde.

## 6. Dokumentationsorte (eine Wahrheit je Thema)
| Thema | Datei |
|---|---|
| Kontext, Scope, Stack | `docs/project-context.md` |
| Stand, nächster Schritt, Evidenz, Fixversuche | `docs/project-state.md` |
| Entscheidungen, Annahmen, Risiken | `docs/register.md` |
| Begriffe | `docs/domain/glossary.md` |
| Beziehungsmodell, Kardinalitäten, Konsistenzregeln | `docs/domain/model.md` |
| Quellen | `docs/sources.md` |
| Anforderungen + Traceability | `docs/requirements/` |
| Architektur / Entscheidungen | `docs/architecture.md`, `docs/adr/` |
| Design-Tokens / CI | `docs/design/tokens.md` (maßgeblich vor dem kontoweiten Skill `eraneos-ci`) |
| Änderungen, QA, Bugs, Releases | `docs/changes/`, `docs/qa/`, `docs/bugs/`, `docs/releases/` |

## 7. Sprache
Kommunikation und Dokumentation auf Deutsch. **App-Oberfläche und -Inhalte auf Englisch** (`docs/register.md` E3). Begriffe immer gemäß `docs/domain/glossary.md`.

## 8. Projektbefehle (Node 24, npm; geprüft 07.10.2026)
| Zweck | Befehl |
|---|---|
| Abhängigkeiten installieren (exakt nach Lockfile) | `npm ci` |
| Entwicklungsserver | `npm run dev` |
| Typprüfung | `npm run typecheck` |
| Lint | `npm run lint` |
| Tests (inkl. Inhaltsvalidierung, Token-Kontraste) | `npm test` |
| Statischer Build nach `out/` (bricht bei ungültigen Inhalten ab) | `npm run build` |
| Browser-Tests + a11y (axe) in Chromium, Firefox, WebKit gegen den statischen Build (Port 4210); einmalig vorher `npx playwright install chromium firefox webkit` | `npm run test:e2e` |
| Alle Gates nacheinander (inkl. E2E) | `npm run check` |
| Build offline ausliefern (http://localhost:4180) | `npm run serve:out` |
