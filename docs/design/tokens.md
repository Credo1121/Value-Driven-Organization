# Design-Tokens – Eraneos CI (Web-Übertragung)

> **Aktualisierung 07.10.2026 (E27):** Für die Website gilt jetzt ein cleaner, Apple-naher Light-Look: Apple-Neutraltöne (`#1d1d1f`, `#f5f5f7`, `#6e6e73`) und die Systemschrift statt der warmen CI-Grautöne und Aptos. Das Eraneos-Orange bleibt der einzige Akzent (Flächen `#FF6529`, Linien `#DD3D01`, Text `#B33000`). Maßgeblich sind die Werte in `src/ui/tokens.css`. Die folgenden Abschnitte dokumentieren die CI-Herkunft.

- **Status:** Draft v0.1 · 07.10.2026 · Grundlage für REQ-010
- **Quelle:** Screenshots des Eraneos „PowerPoint Guide“, Seiten 16 (Type scales) und 17 (Colours), vom Auftraggeber am 07.10.2026 bereitgestellt. [BEST]
- **Methode:** Farbwerte als Pixelwerte aus Seite 17 (Custom Colors/Theme Colors) ausgelesen. Sie können durch Bildkompression um wenige Einheiten abweichen → **offizielle Hex-Werte bestätigen lassen** (E5a).
- **Kontraste:** nach WCAG-2-Formel berechnet, nicht im Browser gemessen.

## 1. Farben

### 1.1 Greyscale (Standard) – UI-Grundpalette
| Token | Wert | Rolle | Kontrast auf #FFFFFF | Auf #FCF8F7 |
|---|---|---|---|---|
| `--c-ink` | `#202020` | Haupttext, Headlines | 16.3 | 15.5 |
| `--c-grey-900` | `#584F4A` | Sekundärtext, starke Linien | 8.0 | 7.6 |
| `--c-grey-700` | `#93867D` | **nur** große Schrift ≥ 24 px / Nicht-Text | 3.5 | 3.4 |
| `--c-grey-500` | `#B1A39A` | dekorativ, Rahmen | 2.5 ✗ | 2.3 ✗ |
| `--c-grey-300` | `#CFC2B9` | Trenner, inaktive Elemente | 1.7 ✗ | – |
| `--c-grey-200` | `#E7DED7` | Flächen | – | – |
| `--c-grey-100` | `#F3ECE6` | Flächen, Hover | – | – |
| `--c-surface-warm` | `#FCF8F7` | Panel-Hintergrund | – | – |
| `--c-surface` | `#FFFFFF` | Seitenhintergrund | – | – |

### 1.2 Akzent Orange (Hervorhebung)
| Token | Wert | Rolle | Kontrast auf #FFFFFF |
|---|---|---|---|
| `--c-accent` | `#FF6529` | Primärorange: Flächen, Markierungen, aktive Zustände | 2.9 ✗ Text · ✗ Nicht-Text (knapp < 3) |
| `--c-accent-strong` | `#DD3D01` | Orange für Linien/Icons und große Schrift | 4.4 (✓ Nicht-Text, ✓ groß, ✗ kleiner Text) |
| `--c-accent-text` | `#932901` | Orange-Ton für kleinen Text und Links | 8.2 ✓ |
| `--c-accent-tint` | `#FEE0D5` | dezente Flächen, Pills | – |
| Text auf `--c-accent` | `#202020` | Beschriftung auf Orangefläche | 5.5 ✓ (Weiß nur 2.9 ✗) |

**Wichtige Folge [SYN]:** Das Primärorange `#FF6529` ist **nicht** als Textfarbe oder als alleiniger Bedeutungsträger für Linien zulässig. Für Text dient `--c-accent-text`, für Linien `--c-accent-strong`. Auf Orangeflächen steht dunkler Text, kein weißer.

### 1.3 Alternativpaletten (laut Guide)
- **Monochrome** (stärkerer Kontrast): `#FF6529` `#A30236` `#DE3015` `#FF7954` `#FFAD95` `#FFCBB6`. Im MVP nicht vorgesehen.
- **Multicolour** („for complex data“): Greyscale + Orange/Rot + `#471D65` `#7159AD` `#BFA6E7`. Nur für komplexe Datenvisualisierung.

### 1.4 Farbeinsatz in der App [SYN, Empfehlung]
| Element | Lösung |
|---|---|
| UI, Text, Navigation | Greyscale; Orange nur für aktiven Zustand, Fokus, Hervorhebung |
| **Gesamtbild – 6 Beziehungsarten** | Unterscheidung **über Linienstil, Pfeilform und Beschriftung** in Greyscale. Der aktive Filter wird in `--c-accent-strong` hervorgehoben. Das passt zum CI-Prinzip „Greyscale default = highlighted“ und zur schrittweisen Moderation. |
| 4 Disziplinen (EPM/TBM/LPM/EA) | Kürzel-Badges + Form/Muster; keine Farbcodierung als einziges Merkmal |
| Aussagetypen | Text-Label + Icon, neutral grau; *Framework-based* ohne Farbbetonung |
| Beispiel-Zahlen (Target / Budget / Forecast / Actual, Outcome) | falls Diagramme nötig: Multicolour-Palette zulässig („complex data“), stets mit direkter Beschriftung |
| Fokusring | 3 px `--c-accent-strong` + 2 px Offset (Nicht-Text 4.4:1 ✓) |

## 2. Typografie
Werte aus Seite 16. Die PowerPoint-Punktangaben werden für Bildschirm/Präsentation in px übertragen (Vorschlag, im Browser in I1/I2 prüfen).

| Token | Guide | Web-Vorschlag | Schrift |
|---|---|---|---|
| H1 | Eraneos Display, 60 pt / 60 pt, Tracking 0.3 pt (condensed) | `clamp(40px, 4vw, 64px)`, line-height 1.0, letter-spacing -0.01em | Eraneos Display → Fallback |
| H2 | **Aptos Semibold**, 44 / 42 pt, Tracking 0.5 pt (condensed) | `clamp(28px, 2.6vw, 44px)`, line-height 0.95 | Aptos Semibold |
| H3 | Aptos Semibold, 20 / 20 pt, Tracking 0.3 pt | 20–22 px, line-height 1.0 | Aptos Semibold |
| Preamble | Aptos Regular 18 pt / 16 pt | 20 px, line-height 1.3 | Aptos |
| Body 1 | Aptos Regular 16 / 16 pt | 18 px (Präsentationsabstand), line-height 1.4 | Aptos |
| Body 2 | Aptos Regular 12 / 14 pt | 16 px | Aptos |
| Body 3 | Aptos Regular 8 / 10 pt | 14 px (Untergrenze für Lesbarkeit am geteilten Bildschirm) | Aptos |

Hinweis: Body 3 mit 8 pt ist für Folien gedacht. In der App ist 14 px die Untergrenze (REQ-009, QA-P0-4).

**Schriftverfügbarkeit (E5b, offen):**
- *Eraneos Display* ist eine Hausschrift. Für das Web wird eine **Webfont-Datei mit Web-Lizenz** benötigt. Bis dahin Fallback `"Helvetica Neue", Arial, sans-serif`.
- *Aptos* ist Teil der Microsoft-Office-Lizenz. Die Schriftdateien werden **nicht** ins Repo oder in Builds übernommen. Referenz nur per Namen (lokal installiert), Fallback `"Segoe UI", Arial, sans-serif`. Auf Kunden- oder Präsentationsrechnern ohne Office greift der Fallback.

## 3. Aufzählungshierarchie (Seite 16)
| Ebene | Guide | Web |
|---|---|---|
| 1 | „— Elevated content“ (Geviertstrich, größer) | Lead-in mit `—`, Preamble-Größe |
| 2 | Standardtext, **ohne** Bullet | Absatz |
| 3 | `•` Bulletpoints | `ul` mit • |
| 4 | `–` | verschachtelt, – |
| 5–6 | `•` | verschachtelt (im Web möglichst vermeiden) |

## 4. Marke und Rahmen
- Seitenmarke: Eraneos-Zeichen oben rechts. Im Screenshot ist es ein **dunkles Glyphenzeichen ohne Kreis**. **Offizielle SVG-Datei anfordern** (E5c), nicht nachzeichnen.
- Eyebrow oben links (z. B. „Guidelines“) in kleiner Schrift. Klassifizierungslabel unten links („Internal“). Für die App: Footer-Label konfigurierbar (z. B. „Internal · Provisional design“).
- Seitenzahl unten rechts (Folien) → im Web nicht nötig, außer im Beispiel-Stepper („n of 8“).

## 5. Abweichungen zum kontoweiten Skill `eraneos-ci`
Der Skill weicht von den Screenshots ab. **Für dieses Projekt gilt diese Datei.**

| Thema | Skill `eraneos-ci` | Screenshot (maßgeblich) |
|---|---|---|
| Orange | `#E8622C` | `#FF6529` |
| Dunkel | `#1A1A1A` | `#202020` |
| Greys | `#2D2A28` … `#E8E3DF` (kühler) | `#584F4A` `#93867D` `#B1A39A` `#CFC2B9` `#E7DED7` `#F3ECE6` (wärmer) |
| H2/H3 | Helvetica-Fallback | Aptos Semibold |
| Bullet Ebene 1 | ohne Marker | Geviertstrich „—“ |
| Ebene 2 | Standard-Bullet | ohne Bullet |
| Logo | Kreis mit „e“ | Glyphe ohne Kreis |

Eine Aktualisierung des Skills ist eine separate Entscheidung des Auftraggebers (E15), weil der Skill auch andere Projekte betrifft.
