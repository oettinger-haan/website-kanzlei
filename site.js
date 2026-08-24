// src/scripts/site.js
//
// Uebrig gebliebene, weiterhin gebrauchte Logik aus dem urspruenglichen
// Single-File-Prototyp. NICHT mehr enthalten (weil durch echte Astro-Routen
// ueberfluessig): showPage(), setActiveNavigation(), updateSEOForPage(),
// updateFaqSchema(), das ganze Hash-Routing. Jede Seite ist jetzt ein
// eigenes, serverseitig gerendertes Dokument - dafuer braucht es keine
// Client-JS-Simulation mehr.

function closeDropdowns() {
  document.querySelectorAll('.nav-desktop .nav-item').forEach((item) => item.classList.remove('is-open'));
}

// =========================
// Cookie consent (minimal, external embeds only)
// =========================
const CONSENT_KEY = 'oettingerConsentV1';

function getConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setConsent(consent) {
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
  } catch (e) {}
}

function ensureConsentBanner() {
  if (document.getElementById('cookie-consent')) return;

  const banner = document.createElement('div');
  banner.id = 'cookie-consent';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie-Einwilligung');
  banner.innerHTML = `
    <div class="cookie-consent-inner">
      <div>
        <div class="cookie-consent-title">Datenschutz-Einstellungen</div>
        <div class="cookie-consent-copy">Wir verwenden technisch notwendige Funktionen. Externe Inhalte (z. B. Google Maps) laden wir erst nach Ihrer Einwilligung.</div>
      </div>
      <div class="cookie-consent-actions">
        <button type="button" class="button-secondary" data-consent-decline="external">Ablehnen</button>
        <button type="button" class="button" data-consent-accept="external">Zustimmen</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);
}

function hideConsentBanner() {
  const el = document.getElementById('cookie-consent');
  if (el) el.remove();
}

// Macht <script>-Tags wirksam, die per innerHTML/cloneNode eingefuegt wurden.
// Der Browser fuehrt solche Scripts sonst NICHT aus (Standard-DOM-Verhalten) -
// deshalb jeden Script-Knoten durch einen frisch erzeugten ersetzen.
function activateScripts(container) {
  Array.from(container.querySelectorAll('script')).forEach((oldScript) => {
    const newScript = document.createElement('script');
    Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = oldScript.textContent;
    oldScript.replaceWith(newScript);
  });
}

function loadExternalEmbeds() {
  const gates = Array.from(document.querySelectorAll('.embed-consent'));
  gates.forEach((gate) => {
    if (gate.getAttribute('data-loaded') === '1') return;

    // Fall 1: Roh-HTML/Script-Embeds (z. B. WIADOK-Widget). Der Code liegt
    // inert in einem <template>, damit vor der Zustimmung garantiert kein
    // Script laeuft und kein Custom Element hochfaehrt.
    const template = gate.querySelector('template');
    if (template) {
      const clone = template.content.cloneNode(true);
      gate.innerHTML = '';
      gate.appendChild(clone);
      activateScripts(gate);
      gate.setAttribute('data-loaded', '1');
      return;
    }

    // Fall 2: iframe-basierte Embeds (Google Maps, Spotify) ueber data-src.
    const src = gate.getAttribute('data-src');
    if (!src) return;

    const iframe = document.createElement('iframe');
    iframe.title = gate.getAttribute('aria-label') || 'Externer Inhalt';
    iframe.src = src;
    iframe.loading = 'lazy';
    iframe.decoding = 'async';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.allowFullscreen = true;
    const allow = gate.getAttribute('data-allow');
    if (allow) iframe.allow = allow;

    gate.innerHTML = '';
    gate.appendChild(iframe);
    gate.setAttribute('data-loaded', '1');
  });
}

function applyConsentUI() {
  const c = getConsent();
  const external = c && c.external === true;

  if (external) loadExternalEmbeds();

  if (!c) ensureConsentBanner();
  else hideConsentBanner();
}

document.addEventListener('click', function (event) {
  const manage = event.target.closest('[data-consent-manage]');
  if (manage) {
    event.preventDefault();
    ensureConsentBanner();
    document.getElementById('cookie-consent')?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    return;
  }

  const accept = event.target.closest('[data-consent-accept]');
  const decline = event.target.closest('[data-consent-decline]');
  if (!accept && !decline) return;

  const action = accept ? 'accept' : 'decline';
  const scope = (accept || decline).getAttribute(accept ? 'data-consent-accept' : 'data-consent-decline') || 'external';
  if (scope !== 'external') return;

  setConsent({ external: action === 'accept', ts: Date.now() });
  applyConsentUI();
});

// =========================
// Desktop dropdown nav (hover + keyboard) und Mobile-Menu
// =========================
function initNav() {
  const navToggle = document.getElementById('nav-toggle');
  const desktopNavItems = Array.from(document.querySelectorAll('.nav-desktop .nav-item'));

  desktopNavItems.forEach((item) => {
    const trigger = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');
    if (!trigger || !dropdown) return;

    function openOnHover() {
      if (window.innerWidth <= 1100) return;
      closeDropdowns();
      item.classList.add('is-open');
    }

    function closeOnLeave(event) {
      if (window.innerWidth <= 1100) return;
      if (event.relatedTarget && item.contains(event.relatedTarget)) return;
      item.classList.remove('is-open');
    }

    item.addEventListener('mouseenter', openOnHover);
    item.addEventListener('mouseleave', closeOnLeave);
    trigger.addEventListener('focus', openOnHover);

    trigger.addEventListener('click', function (event) {
      if (window.innerWidth <= 1100) return;
      event.preventDefault();
      const alreadyOpen = item.classList.contains('is-open');
      closeDropdowns();
      if (!alreadyOpen) item.classList.add('is-open');
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-desktop')) closeDropdowns();
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeDropdowns();
      if (navToggle) navToggle.checked = false;
    }
  });

  // Mobile-Menu nach Linkklick schliessen (sonst bleibt das Panel offen,
  // wenn der Browser die neue Seite laedt, bevor man es merkt).
  document.querySelectorAll('.mobile-panel a').forEach((link) => {
    link.addEventListener('click', () => {
      if (navToggle) navToggle.checked = false;
    });
  });
}

// =========================
// Legal-Anker (Impressum/Datenschutz-Akkordeon): oeffnet das <details>,
// wenn per Link direkt auf einen Abschnitt gesprungen wird.
// =========================
function initLegalJump() {
  function openIfHash() {
    const id = location.hash.slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    const containerDetails = target.closest('details');
    if (containerDetails) containerDetails.open = true;
  }
  openIfHash();
  window.addEventListener('hashchange', openIfHash);
}

window.addEventListener('DOMContentLoaded', function () {
  try {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) document.documentElement.style.scrollBehavior = 'auto';
  } catch (e) {}

  initNav();
  initLegalJump();
  applyConsentUI();
});
