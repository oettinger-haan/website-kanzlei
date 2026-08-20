import { defineConfig } from 'astro/config';

export default defineConfig({
  // TODO vor Livegang: endgueltige Domain eintragen (steuerberaterin-haan.de
  // oder stbin-oettinger.net - siehe offene Entscheidung).
  site: 'https://stbin-oettinger.de',

  // Trailing Slash durchgaengig, passend zur SLUG-MAPPING.md und zu den
  // alten URLs (steuerberaterin-haan.de nutzt ebenfalls trailing slashes).
  trailingSlash: 'always',

  build: {
    format: 'directory',
  },
});
