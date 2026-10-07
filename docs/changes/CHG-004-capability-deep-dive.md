# CHG-004 – Capability deep dive, C2 zuerst (I3)

- **Datum:** 07.10.2026 · **Freigabe:** Auftraggeber („I3 kann starten“), Vorgehen E26
- **REQ:** REQ-004 (AC-004-1 … AC-004-8)

## Ziel
Einheitliche Vertiefungsseite je Steuerungsfähigkeit. C2 Investment & funding vollständig als Musterseite zur fachlichen Abnahme; C1, C3–C8 mit derselben Vorlage, alle Abschnitte „open – to be defined“.

## Änderungen
| Bereich | Änderung |
|---|---|
| Inhalt | `content/capabilities.json` (8 Vertiefungen; C2 Entwurf), `content/breaks.json` (die sieben Brüche, bisher fest in der Startseite) |
| Vertrag | `src/content/schema.ts`: Deep-Dive-Schema; jeder der acht Abschnitte ist befüllt oder ausdrücklich `"open"`; fehlender Abschnitt → Build-Abbruch |
| Validierung | `validateDeepDives`: Glossar-Referenzen der Datenobjekte, Schnittstellen und Ein-/Ausgänge, Zuordnung zu den sieben Brüchen, R2 für Quellen, Status ↔ Befüllung, Wertarten-Pflicht für C2/C4 (AC-004-8) |
| UI | `src/ui/capability/DeepDiveView.tsx` + CSS; `app/capabilities/[id]/page.tsx`; Übersicht zeigt Status; Startseite liest Brüche aus dem Inhalt |
| Tests | `tests/deep-dives.test.ts`, `e2e/deep-dive.spec.ts` |

## Inhalt C2 (Entwurf, [SYN] außer gekennzeichneten Framework-Aussagen)
Zweck · 6 Rollen über Enterprise/Portfolio/Delivery · 5 Inputs, 4 Outputs mit Wertarten · 12 Datenobjekte · 6 Entscheidungen je Ausprägung (EPM → LPM) · Wertarten Target/Budget/Forecast/Actual/Variance mit Finance-Schnittstelle · 7 Schnittstellen · 6 typische Brüche · 4 Framework-Aussagen (S-SAFE-2/-3/-4, S-TBM-1), 1 Synthese, 1 Annahme · Einsatzbedingungen.

## Prüfungen
`docs/qa/CHG-004-capability-deep-dive.md`
