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
