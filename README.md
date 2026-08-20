# Steuerberatung Oettinger — Website (Astro)

## Lokal starten

Voraussetzung: Node.js 18+ und Internetzugang (fuer `npm install`).

```bash
npm install
npm run dev
```

Danach unter `http://localhost:4321` ansehen. `npm run build` erzeugt den
statischen Export nach `dist/`, `npm run preview` zeigt genau dieses
Build-Ergebnis lokal an (das ist auch die Version, die auf einem echten
Server landen wuerde - naeher an der Realitaet als `dev`).

## Was hier drin ist

- **17 echte Seiten** unter `src/pages/`, jede mit eigener URL (kein
  Hash-Routing mehr). Struktur und Begruendung: siehe `SLUG-MAPPING.md`.
- **`src/layouts/Base.astro`**: gemeinsamer Rahmen (Head/SEO, Header,
  Navigation, Footer, Cookie-Consent). Aktive Navigationspunkte werden
  serverseitig aus der URL berechnet, kein Routing-JS mehr noetig.
- **`src/styles/global.css`**: 1:1 aus dem bisherigen Stand uebernommen
  (Design-Tokens, Spacing-Skala, Komponenten - alles, was in den letzten
  Runden gefixt wurde, ist erhalten).
- **`src/scripts/site.js`**: was an Client-JS noch gebraucht wird
  (Cookie-Consent, Dropdown-Navigation, Legal-Anker). Die alte
  Routing-Engine (showPage, setActiveNavigation, dynamische
  Meta-Tag-Injection) ist komplett raus - macht Astro jetzt serverseitig.
- **`src/scripts/jobs.js`**: Sanity-Anbindung fuer die Stellenboerse auf
  `/karriere/`, noch nicht konfiguriert (siehe Kommentar in der Datei).

## Was noch fehlt

1. **`npm install` einmal lokal ausfuehren und pruefen, ob alles wie
   erwartet aussieht.** Ich konnte das selbst nicht testen - meine
   Umgebung hat keinen Netzwerkzugriff, ich konnte also kein Astro
   installieren oder einen Dev-Server starten. Alles hier ist von Hand
   nach Astros Konventionen geschrieben und mehrfach auf Tag-Balance,
   Heading-Hierarchie etc. geprueft, aber der erste echte `npm run dev`
   sollte trotzdem mit Aufmerksamkeit begleitet werden.
2. **Schriften fehlen als Dateien.** `src/layouts/Base.astro` erwartet
   `/public/assets/fonts/fonts.css` mit den WOFF2-Dateien fuer Inter und
   Cormorant Garamond. Bisher nur Preload-Hinweise vorhanden, keine
   echten Dateien.
3. **Bilder fehlen** (`/public/assets/...` - Logo, Siegel, Portraits).
   Bewusst nicht mit Platzhaltern befuellt.
4. **Drei Seiten fehlen inhaltlich noch komplett** (siehe
   `SLUG-MAPPING.md`): Digitale Buchhaltung, Glossar, Solingen-Landingpage.
5. **PostTo-Endpoint fuer das Kontaktformular** ist bereits eingetragen
   und aktiv (`/src/pages/kontakt.astro`).
6. **Redirects** von der alten Domain (siehe `SLUG-MAPPING.md`) muessen
   beim Hosting-Anbieter oder in `astro.config.mjs` per Redirects-Plugin
   eingerichtet werden - je nachdem, wo das am Ende gehostet wird.

## Empfehlung fuers Weiterarbeiten

Fuer den `npm install` → `npm run dev` → visuell iterieren-Kreislauf ist
Claude Code auf einem echten Rechner mit Internetzugang besser geeignet
als dieser Chat. Ich kann Dateien schreiben und Code-Logik pruefen, aber
keinen echten Astro-Dev-Server starten oder das Ergebnis selbst im
Browser ansehen.
