# ADR-001 – Next.js mit vollständig statischem Export, kein separates Backend

- **Status:** Proposed · **Datum:** 07.10.2026
- **Bezug:** Stack [BEST]: Next.js, Node.js, TypeScript; Nicht-Scope v1 (keine Speicherung, kein Login, keine Integrationen)

## Kontext
Der MVP zeigt kuratierte Inhalte und wertet deterministische Regeln über synthetische Daten aus. Es gibt keine Nutzereingaben außer Auswahlfeldern und keine Persistenz. Die Hauptnutzung ist ein moderierter Workshop, möglicherweise ohne verlässliches Netz (A4).

## Optionen
1. **Next.js mit `output: 'export'` (statisch)**: Node.js nur zur Build-Zeit und für Tests
2. Next.js mit Node-Server (SSR / Route Handlers)
3. Next.js + separater Node.js-Backend-Service

## Entscheidung (vorgeschlagen)
Option 1.

## Begründung
- Erfüllt den bestätigten Umfang vollständig. Regeln laufen als pure Funktionen im Browser oder zur Build-Zeit.
- Workshopfest: läuft lokal vom Laptop, unabhängig von Hosting.
- Minimale Angriffsfläche und kein Serverbetrieb.
- Next.js 16.4 unterstützt statischen Export (S-TECH-1).
- Option 3 hätte keinen begründeten Bedarf (keine Daten, keine Integrationen).

## Folgen
- Nicht verfügbar: Server Actions, Cookies, Rewrites/Redirects/Headers in Next-Config, ISR, Standard-Bildoptimierung. Dynamische Routen brauchen `generateStaticParams` (S-TECH-1). Das ist für den MVP unkritisch.
- Security-Header müssen später beim Host gesetzt werden (E4).
- Szenario-Zustand liegt im URL, nicht serverseitig.

## Neubewertung, wenn
gespeicherte Szenarien, Login, Mandanten, Kundendaten oder Integrationen beauftragt werden (E8). Dann ist ein Wechsel zu Option 2 innerhalb von Next.js der erste Schritt. Ein separater Dienst wird nur bei begründetem Bedarf erwogen.
