# ADR-002 – Versionen von Laufzeit, Framework und Werkzeugen

- **Status:** Accepted · **Datum:** 07.10.2026 (I1)
- **Quellen:** S-TECH-1, S-TECH-2 (`docs/sources.md`), npm-Registry (`npm view`, Abfrage 07.10.2026), Next.js-Doku „ESLint Plugin“ v16.4.0 (Stand 05.10.2026)

## Kontext
Der Stack ist bestätigt (Next.js, Node.js, TypeScript). Die Versionen müssen unterstützt, kompatibel und nachvollziehbar fixiert sein.

## Geprüfter Stand (07.10.2026)
| Paket | neueste Version (npm `latest`) | Kompatibilität |
|---|---|---|
| Node.js (lokal) | v24.20.0 installiert | Active LTS, EOL 30.04.2028 (S-TECH-2). Next.js verlangt ≥ 20.9 |
| next | 16.4.0 | `engines.node >=20.9.0`, React `^18.2 \|\| ^19` |
| react / react-dom | 19.3.0 | ✓ |
| typescript | **7.0.2** | ✗ typescript-eslint 8.71.1 (über eslint-config-next) verlangt `typescript >=4.8.4 <6.1.0` |
| typescript 6.x | 6.0.3 | ✓ |
| eslint | **10.12.0** | ⚠ Laut Next.js-Doku listen einige Plugins in eslint-config-next ESLint 10 noch nicht in den Peer-Dependencies (bestätigt: eslint-plugin-react, -import, -jsx-a11y bis `^9`) |
| eslint 9.x | 9.39.5 | ✓ |
| eslint-config-next | 16.4.0 | `eslint >=9`, `typescript >=3.3.1` |
| zod | 4.6.5 | ✓ |
| vitest | 5.0.3 | Node `^22.12 \|\| ^24 \|\| >=26`; Peer `vite ^6.4 \|\| ^7 \|\| ^8` |
| vite | 8.3.3 | ✓ (Peer von vitest) |
| @types/node | 24.19.1 (Linie 24 passend zur Laufzeit) | ✓ |
| @types/react, @types/react-dom | 19.3.0 | ✓ |

## Entscheidung
| Paket | fixierte Version | Begründung |
|---|---|---|
| Node.js | 24 LTS (`.nvmrc` = 24, `engines.node` = `>=24 <25`) | lokal vorhanden, Active LTS |
| next | 16.4.0 | neueste stabile Version |
| react, react-dom | 19.3.0 | neueste stabile Version |
| typescript | 6.0.3 | höchste mit dem Lint-Werkzeug kompatible Version |
| eslint | 9.39.5 | vollständig kompatibel mit allen Plugins von eslint-config-next |
| eslint-config-next | 16.4.0 | passend zu next |
| zod | 4.6.5 | Schema-Validierung der Inhalte (ADR-003) |
| vitest | 5.0.3 | Unit-Tests der Domänen- und Inhaltsregeln |
| vite | 8.3.3 | Peer-Dependency von vitest |
| @types/node | 24.19.1 | passend zur Node-Linie |
| @types/react, @types/react-dom | 19.3.0 | passend zu React |

- Alle Versionen **exakt** gepinnt (kein `^`/`~`), `package-lock.json` wird mitversioniert.
- Paketmanager: **npm 11** (mit Node ausgeliefert, keine Zusatzinstallation).
- **Nicht in I1:** Playwright und axe für E2E- und a11y-Tests. Sie werden in I2 mit dem Gesamtbild eingeführt (eigene Versionsprüfung).

## Folgen
- Upgrades nur über eigenen CHG mit Begründung (Sicherheitsfix oder Bedarf), keine beiläufigen Upgrades.
- TypeScript 7 und ESLint 10 werden neu bewertet, sobald typescript-eslint bzw. die Plugins sie offiziell unterstützen.

## Neubewertung, wenn
eine Sicherheitsmeldung eine gepinnte Version betrifft, Node 24 in die Maintenance-Phase geht (20.10.2026; danach weiter unterstützt bis 30.04.2028) bzw. Node 26 LTS für das Projekt relevant wird, oder ein neues Next.js-Major erscheint.
