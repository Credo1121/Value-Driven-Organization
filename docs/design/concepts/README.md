# Design-Konzepte Gesamtbild (07.10.2026)

Entwürfe zur Auswahl, **nicht** Teil der App. Alle nutzen die echten Inhalte aus `content/big-picture.json`
(via `build-data.mjs` → `data.js`) und zeigen denselben Zustand: Phase **Fund** ausgewählt, Einfluss nach unten
in die Ebenen und weiter in die nächste Phase.

| Konzept | Datei | Idee |
|---|---|---|
| A Keynote (Apple-Stil) | `a-keynote.html` / `.png` | Hell, viel Weißraum, große Zahlen als Zeitleiste, Glas-Bänder je Ebene, Fokuskarte |
| B Kaskade | `b-cascade.html` / `.png` | Dunkel, Entscheidungen fließen als leuchtende Ströme nach unten, TBM/EA als Unterströmung, Rückkopplung als Bogen |
| C Orbit | `c-orbit.html` / `.png` | Kreislauf wörtlich: Phasen auf dem Ring, Ebenen als konzentrische Ringe, TBM/EA als Halo |
| D Atlas | `d-atlas.html` / `.png` | Isometrische Geschosse, Einfluss als Lichtsäule nach unten, TBM/EA als Fundament |

Neu erzeugen: `node docs/design/concepts/build-data.mjs`, danach die HTML-Dateien im Browser öffnen.
Schrift in den Entwürfen: Systemschrift bzw. Avenir Next als Platzhalter (Eraneos Display im Web noch nicht lizenziert, E5b).
