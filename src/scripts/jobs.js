// src/scripts/jobs.js
//
// Stellenanzeigen aus Sanity CMS - nur auf /karriere/ eingebunden.
// SANITY.projectId ist noch leer -> loadJobs() zeigt dann automatisch den
// statischen "Aktuell keine Stellen online"-Zustand. Sobald ein echtes
// Sanity-Projekt existiert: projectId eintragen und den auskommentierten
// loadJobs()-Aufruf ganz unten aktivieren.

const SANITY = {
    projectId: '',
    dataset: 'production',
    apiVersion: '2025-01-01',
};

function sanityConfigured() {
    return Boolean(SANITY.projectId && SANITY.dataset);
}

function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
}

function renderPortableText(blocks) {
    if (!Array.isArray(blocks)) return '';
    const out = [];
    for (const b of blocks) {
          if (!b) continue;
          if (b._type === 'block') {
                  const style = b.style || 'normal';
                  const text = (b.children || []).map((c) => c.text || '').join('');
                  if (!text.trim()) continue;
                  if (style === 'h3' || style === 'h4') {
                            out.push(`<h4>${escapeHtml(text)}</h4>`);
                  } else {
                            out.push(`<p>${escapeHtml(text)}</p>`);
                  }
          }
          if (b._type === 'list' && Array.isArray(b.items)) {
                  const lis = b.items.map((t) => `<li>${escapeHtml(t)}</li>`).join('');
                  out.push(`<ul>${lis}</ul>`);
          }
    }
    return out.join('');
}

function jobItemHtml(job) {
    const title = escapeHtml(job.title);
    const intro = escapeHtml(job.intro || '');
    const location = escapeHtml(job.location || '');
    const type = escapeHtml(job.employmentType || '');
    const applyEmail = (job.applyEmail || 'info@stbin-oettinger.de').trim();
    const applySubject = encodeURIComponent(`Bewerbung – ${job.title}`);
    const detailsId = `job-${escapeHtml(job._id)}`;

  const meta = [
        location ? `<span>${location}</span>` : '',
        type ? `<span>${type}</span>` : '',
      ].filter(Boolean).join('');

  const details = renderPortableText(job.description);

  return `
      <article class="job-item">
            <div>
                    <div class="card-kicker">Stellenanzeige</div>
                            <h3 class="card-title-lg">${title}</h3>
                                    ${intro ? `<p class="copy-tight">${intro}</p>` : ''}
                                            ${meta ? `<div class="job-meta">${meta}</div>` : ''}
                                                  </div>
                                                        <div class="job-actions">
                                                                <button class="button-secondary" type="button" data-job-toggle="${detailsId}">Details</button>
                                                                        <a class="button" href="mailto:${encodeURIComponent(applyEmail)}?subject=${applySubject}">Bewerben</a>
                                                                              </div>
                                                                                    <div class="job-details" id="${detailsId}" hidden>
                                                                                            ${details || '<p>Details folgen. Sprechen Sie uns gerne an.</p>'}
                                                                                                    <div class="mt-2">
                                                                                                              <a class="button-secondary" href="/kontakt/">Fragen? Kontakt aufnehmen</a>
                                                                                                                      </div>
                                                                                                                            </div>
                                                                                                                                </article>
                                                                                                                                  `;
}

function wireJobToggles(root) {
    if (!root) return;
    root.addEventListener('click', function (event) {
          const btn = event.target.closest('[data-job-toggle]');
          if (!btn) return;
          const id = btn.getAttribute('data-job-toggle');
          const panel = document.getElementById(id);
          if (!panel) return;
          const next = panel.hasAttribute('hidden');
          if (next) panel.removeAttribute('hidden');
          else panel.setAttribute('hidden', '');
          btn.textContent = next ? 'Weniger' : 'Details';
    });
}

async function loadJobs() {
    const host = document.getElementById('jobs');
    if (!host) return;

  if (!sanityConfigured()) {
        host.innerHTML = `
              <div class="card soft">
                      <div class="card-kicker">Karriere</div>
                              <h3>Aktuell keine Stellen online</h3>
                                      <p>Schreiben Sie uns gern eine Initiativbewerbung an <a href="mailto:info@stbin-oettinger.de">info@stbin-oettinger.de</a>.</p>
                                            </div>
                                                `;
        return;
  }

  try {
        const query = encodeURIComponent('*[_type == "job" && isActive == true] | order(publishedAt desc, _createdAt desc) { _id, title, location, employmentType, intro, description, applyEmail }');
        const url = `https://${SANITY.projectId}.api.sanity.io/v${SANITY.apiVersion}/data/query/${SANITY.dataset}?query=${query}`;
        const res = await fetch(url, { headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Sanity fetch failed');
        const json = await res.json();
        const jobs = (json && json.result) || [];

      if (!jobs.length) {
              host.innerHTML = `
                      <div class="card soft">
                                <div class="card-kicker">Karriere</div>
                                          <h3>Aktuell keine offenen Stellen</h3>
                                                    <p>Initiativbewerbungen sind jederzeit willkommen: <a href="mailto:info@stbin-oettinger.de">info@stbin-oettinger.de</a>.</p>
                                                            </div>
                                                                  `;
              return;
      }

      host.innerHTML = jobs.map(jobItemHtml).join('');
        wireJobToggles(host);
  } catch (e) {
        host.innerHTML = `
              <div class="card soft">
                      <div class="card-kicker">Hinweis</div>
                              <h3>Stellen konnten nicht geladen werden</h3>
                                      <p>Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt unter <a href="mailto:info@stbin-oettinger.de">info@stbin-oettinger.de</a>.</p>
                                            </div>
                                                `;
  }
}

loadJobs();
