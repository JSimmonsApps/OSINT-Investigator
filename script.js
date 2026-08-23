/**
 * OSINT Investigator v3.1.1 — script.js
 * Canadian Intelligence Platform
 * Modules: Constants | UI | Tabs | Search | Corporate | Technical | Username | Email | Phone | Geo | History | Coverage | Workspace | Init
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════ */

const LS_HISTORY_KEY      = 'osint_search_history';
const LS_WORKSPACE_KEY    = 'osint_workspace_';
const LS_COVERAGE_KEY     = 'osint_module_coverage';
const LS_FAVORITES_KEY    = 'osint_favorites';
const LS_SAVED_QUERIES_KEY= 'osint_saved_queries';
const MAX_HISTORY         = 25;

/**
 * People search sources — take a subject object:
 *   { first, middle, last, province, fullName, shortName }
 */
const SOURCES = {
  // ── Primary Legal & News ──────────────────────────────────
  'canlii': ({ fullName }) =>
    `https://www.canlii.org/en/#search/text=${encodeURIComponent(fullName)}`,

  'ontario-courts': () =>
    'https://www.ontariocourts.ca/ocj/scheduling-and-court-lists/',

  'google-exact': ({ fullName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${fullName}"`)}`,

  'google-court': ({ fullName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${fullName}" court`)}`,

  'google-news': ({ fullName }) =>
    `https://news.google.com/search?q=${encodeURIComponent(`"${fullName}"`)}`,

  'cbc': ({ shortName }) =>
    `https://www.cbc.ca/search?q=${encodeURIComponent(shortName)}`,

  'ctv': ({ shortName }) =>
    `https://www.ctvnews.ca/search-results/?q=${encodeURIComponent(shortName)}`,

  'global-news': ({ shortName }) =>
    `https://globalnews.ca/?s=${encodeURIComponent(shortName)}`,

  // ── Social Intelligence ───────────────────────────────────
  'linkedin': ({ shortName }) =>
    `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(shortName)}`,

  'facebook': ({ shortName }) =>
    `https://www.facebook.com/search/top/?q=${encodeURIComponent(shortName)}`,

  'instagram': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`site:instagram.com "${shortName}"`)}`,

  'twitter': ({ shortName }) =>
    `https://twitter.com/search?q=${encodeURIComponent(`"${shortName}"`)}&f=top`,

  'reddit': ({ shortName }) =>
    `https://www.reddit.com/search/?q=${encodeURIComponent(`"${shortName}"`)}&type=link`,

  'tiktok': ({ shortName }) =>
    `https://www.tiktok.com/search?q=${encodeURIComponent(shortName)}`,

  'telegram': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`site:t.me "${shortName}"`)}`,

  'github': ({ shortName }) =>
    `https://github.com/search?q=${encodeURIComponent(shortName)}&type=users`,

  'youtube': ({ shortName }) =>
    `https://www.youtube.com/results?search_query=${encodeURIComponent(shortName)}`,

  // ── Legal Search ──────────────────────────────────────────
  'federal-court': ({ fullName }) =>
    `https://decisions.fct-cf.gc.ca/fc-cf/en/d/s/index.do?cont=${encodeURIComponent(fullName)}&ref=0`,

  'scc': ({ fullName }) =>
    `https://www.scc-csc.ca/case-dossier/info/search-recherche-eng.aspx?word=${encodeURIComponent(fullName)}`,

  'bcsc': ({ fullName }) =>
    `https://www.bccourts.ca/jdb-txt/sc/sr/index.htm`,

  'canlii-adv': ({ fullName }) =>
    `https://www.canlii.org/en/#search/text=${encodeURIComponent(fullName)}&type=decision`,

  'chrc': ({ fullName }) =>
    `https://www.chrc-ccdp.gc.ca/en/search?q=${encodeURIComponent(fullName)}`,

  'hrto': ({ fullName }) =>
    `https://www.canlii.org/en/on/onhrt/#search/text=${encodeURIComponent(fullName)}`,

  // ── Open Web Intelligence ─────────────────────────────────
  'google': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${shortName}"`)}`,

  'google-advanced': ({ fullName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${fullName}" Canada`)}`,

  'bing': ({ shortName }) =>
    `https://www.bing.com/search?q=${encodeURIComponent(`"${shortName}"`)}`,

  'duckduckgo': ({ shortName }) =>
    `https://duckduckgo.com/?q=${encodeURIComponent(`"${shortName}"`)}`,

  'google-pdf': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${shortName}" filetype:pdf`)}`,

  'google-doc': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${shortName}" filetype:doc`)}`,

  'google-xls': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${shortName}" filetype:xls`)}`,

  // ── Media Intelligence ────────────────────────────────────
  'reuters': ({ shortName }) =>
    `https://www.reuters.com/site-search/?query=${encodeURIComponent(shortName)}`,

  'bing-news': ({ shortName }) =>
    `https://www.bing.com/news/search?q=${encodeURIComponent(`"${shortName}"`)}`,
};

/**
 * Corporate registry sources — take a company name string.
 */
const CORP_SOURCES = {
  'fed-corp': (name) =>
    `https://ised-isde.canada.ca/cc/lgcy/fdrl/srch/index?search=${encodeURIComponent(name)}&lang=eng`,

  'ontario-biz': (name) =>
    name
      ? `https://www.ontario.ca/page/ontario-business-registry`
      : 'https://www.ontario.ca/page/ontario-business-registry',

  'quebec-reg': () =>
    'https://www.registreentreprises.gouv.qc.ca/en/',

  'bc-corp': () =>
    'https://www.bcregistry.gov.bc.ca/',

  'alberta-corp': () =>
    'https://www.alberta.ca/search-corporate-registry.aspx',

  'opencorporates': (name) =>
    `https://opencorporates.com/companies?q=${encodeURIComponent(name)}&jurisdiction_code=ca`,
};

/* ── Technical Intelligence Sources (domain/IP) ─────────────── */
const TECH_SOURCES = {
  // Domain Intelligence
  'whois':               (d) => `https://whois.domaintools.com/${encodeURIComponent(d)}`,
  'dns-lookup':          (d) => `https://mxtoolbox.com/DNSLookup.aspx?domain=${encodeURIComponent(d)}`,
  'reverse-dns':         (d) => `https://mxtoolbox.com/ReverseLookup.aspx?domain=${encodeURIComponent(d)}`,
  'ip-lookup':           (d) => `https://www.ipaddress.com/search/?q=${encodeURIComponent(d)}`,
  'reverse-ip':          (d) => `https://viewdns.info/reverseip/?host=${encodeURIComponent(d)}&output=html`,
  'asn-lookup':          (d) => `https://mxtoolbox.com/asn.aspx?domain=${encodeURIComponent(d)}`,
  'mx-records':          (d) => `https://mxtoolbox.com/MXLookup.aspx?domain=${encodeURIComponent(d)}`,
  'ns-records':          (d) => `https://mxtoolbox.com/NSLookup.aspx?domain=${encodeURIComponent(d)}`,
  'txt-records':         (d) => `https://mxtoolbox.com/TXTLookup.aspx?domain=${encodeURIComponent(d)}`,
  'aaaa-records':        (d) => `https://mxtoolbox.com/AAAALookup.aspx?domain=${encodeURIComponent(d)}`,
  'a-records':           (d) => `https://mxtoolbox.com/DNSLookup.aspx?domain=${encodeURIComponent(d)}`,
  'cert-transparency':   (d) => `https://crt.sh/?q=%.${encodeURIComponent(d)}`,
  'subdomain-discovery': (d) => `https://dnsdumpster.com/`,
  'tech-stack':          (d) => `https://www.wappalyzer.com/lookup/${encodeURIComponent(d)}/`,
  'website-headers':     (d) => `https://securityheaders.com/?q=${encodeURIComponent(d)}&followRedirects=on`,
  'robots-txt':          (d) => `https://${d}/robots.txt`,
  'sitemap-xml':         (d) => `https://${d}/sitemap.xml`,
  'ssl-cert':            (d) => `https://www.ssllabs.com/ssltest/analyze.html?d=${encodeURIComponent(d)}`,
  // Website Intelligence
  'internet-archive':    (d) => `https://web.archive.org/web/*/${encodeURIComponent(d)}`,
  'cached-google':       (d) => `https://cachedview.nl/`,
  'cached-bing':         (d) => `https://archive.org/wayback/available?url=${encodeURIComponent(d)}`,
  'page-source':         (d) => `view-source:https://${d}`,
  'page-speed':          (d) => `https://pagespeed.web.dev/report?url=https%3A%2F%2F${encodeURIComponent(d)}`,
  'website-screenshot':  (d) => `https://www.screenshotmachine.com/?url=https://${encodeURIComponent(d)}`,
  'tech-detection':      (d) => `https://builtwith.com/${encodeURIComponent(d)}`,
  'hosting-provider':    (d) => `https://www.whoishostingthis.com/results/${encodeURIComponent(d)}/`,
  'cdn-detection':       (d) => `https://www.cdnplanet.com/tools/cdnfinder/#${encodeURIComponent(d)}`,
  'http-headers':        (d) => `https://httpstatus.io/${encodeURIComponent(d)}`,
  'response-headers':    (d) => `https://headers.cloxy.net/?url=https://${encodeURIComponent(d)}`,
  // Digital Documents
  'domain-pdf':          (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:pdf`,
  'domain-doc':          (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:doc`,
  'domain-docx':         (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:docx`,
  'domain-ppt':          (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:ppt`,
  'domain-pptx':         (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:pptx`,
  'domain-xls':          (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:xls`,
  'domain-xlsx':         (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:xlsx`,
  'domain-csv':          (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:csv`,
  'gov-pdfs':            (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+filetype:pdf+government`,
  'public-reports':      (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+report+filetype:pdf`,
  'court-docs':          (d) => `https://www.google.com/search?q=site:${encodeURIComponent(d)}+court+filetype:pdf`,
};

/* ── Username Sources ─────────────────────────────────────── */
const USERNAME_SOURCES = {
  'u-github':    (u) => `https://github.com/${encodeURIComponent(u)}`,
  'u-reddit':    (u) => `https://www.reddit.com/user/${encodeURIComponent(u)}`,
  'u-tiktok':    (u) => `https://www.tiktok.com/@${encodeURIComponent(u)}`,
  'u-instagram': (u) => `https://www.instagram.com/${encodeURIComponent(u)}/`,
  'u-x':         (u) => `https://twitter.com/${encodeURIComponent(u)}`,
  'u-youtube':   (u) => `https://www.youtube.com/@${encodeURIComponent(u)}`,
  'u-pinterest': (u) => `https://www.pinterest.com/${encodeURIComponent(u)}/`,
  'u-telegram':  (u) => `https://t.me/${encodeURIComponent(u)}`,
  'u-threads':   (u) => `https://www.threads.net/@${encodeURIComponent(u)}`,
  'u-mastodon':  (u) => `https://mastodon.social/@${encodeURIComponent(u)}`,
};

/* ── Email Sources ────────────────────────────────────────── */
const EMAIL_SOURCES = {
  'email-search':   (e) => `https://www.google.com/search?q=${encodeURIComponent(`"${e}"`)}`,
  'email-gravatar': (e) => `https://www.google.com/search?q=${encodeURIComponent(`gravatar "${e}"`)}`,
  'email-hibp':     (e) => `https://haveibeenpwned.com/account/${encodeURIComponent(e)}`,
  'email-headers':  ()  => `https://toolbox.googleapps.com/apps/messageheader/`,
  'email-domain':   (e) => { const d = e.includes('@') ? e.split('@')[1] : e; return `https://mxtoolbox.com/EmailHeaders.aspx?domain=${encodeURIComponent(d)}`; },
  'email-mx':       (e) => { const d = e.includes('@') ? e.split('@')[1] : e; return `https://mxtoolbox.com/MXLookup.aspx?domain=${encodeURIComponent(d)}`; },
  'email-spf':      (e) => { const d = e.includes('@') ? e.split('@')[1] : e; return `https://mxtoolbox.com/spf.aspx?domain=${encodeURIComponent(d)}`; },
  'email-dmarc':    (e) => { const d = e.includes('@') ? e.split('@')[1] : e; return `https://mxtoolbox.com/dmarc.aspx?domain=${encodeURIComponent(d)}`; },
  'email-dkim':     (e) => { const d = e.includes('@') ? e.split('@')[1] : e; return `https://mxtoolbox.com/dkim.aspx?domain=${encodeURIComponent(d)}`; },
};

/* ── Phone Sources ────────────────────────────────────────── */
const PHONE_SOURCES = {
  'phone-reverse':  (p) => `https://www.google.com/search?q=${encodeURIComponent(`"${p}"`)}`,
  'phone-area':     (p) => `https://www.google.com/search?q=${encodeURIComponent(`area+code+${p}`)}`,
  'phone-carrier':  ()  => `https://www.carrierlookup.com/`,
  'phone-country':  (p) => `https://www.google.com/search?q=${encodeURIComponent(`country+code+${p}+phone`)}`,
};

/* ── Geospatial Sources ───────────────────────────────────── */
const GEO_SOURCES = {
  'geo-google-maps': (q) => `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
  'geo-street-view': (q) => `https://www.google.com/maps?layer=c&q=${encodeURIComponent(q)}`,
  'geo-osm':         (q) => `https://www.openstreetmap.org/search?query=${encodeURIComponent(q)}`,
  'geo-satellite':   (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}&maptype=satellite`,
  'geo-postal':      (q) => `https://www.google.com/search?q=${encodeURIComponent(`postal+code+${q}`)}`,
  'geo-coordinates': (q) => `https://www.google.com/maps/search/${encodeURIComponent(q)}`,
};

/** Sources included in "Open All Searches" */
const OPEN_ALL_SOURCES = [
  'canlii',
  'ontario-courts',
  'google-exact',
  'google-news',
  'cbc',
  'ctv',
  'global-news',
];


/* ════════════════════════════════════════════════════════════
   UI HELPERS
   ════════════════════════════════════════════════════════════ */

function getFormValues() {
  const first    = document.getElementById('first-name').value.trim();
  const middle   = document.getElementById('middle-name').value.trim();
  const last     = document.getElementById('last-name').value.trim();
  const province = document.getElementById('province').value;
  return { first, middle, last, province };
}

function buildSubject({ first, middle, last, province }) {
  const parts     = [first, middle, last].filter(Boolean);
  const fullName  = parts.join(' ');
  const shortName = [first, last].filter(Boolean).join(' ');
  return { first, middle, last, province, fullName, shortName };
}

function populateForm({ first, middle, last, province }) {
  document.getElementById('first-name').value  = first  || '';
  document.getElementById('middle-name').value = middle || '';
  document.getElementById('last-name').value   = last   || '';
  if (province) {
    document.getElementById('province').value = province;
  }
  updateSubjectDisplay();
  updateSubjectBanners();
  loadWorkspace();
}

function updateSubjectDisplay() {
  const { first, middle, last, province } = getFormValues();
  const display = document.getElementById('subject-display');
  const parts   = [first, middle, last].filter(Boolean);
  if (parts.length === 0) {
    display.textContent = '— no subject entered —';
    display.style.color = 'var(--text-dim)';
  } else {
    display.textContent = `${parts.join(' ')}   [${province}]`;
    display.style.color = 'var(--accent-light)';
  }
}

function updateCompanyDisplay() {
  const name    = (document.getElementById('company-name') || {}).value || '';
  const display = document.getElementById('company-display');
  if (!display) return;
  if (!name.trim()) {
    display.textContent = '— no company entered —';
    display.style.color = 'var(--text-dim)';
  } else {
    display.textContent = name.trim();
    display.style.color = 'var(--accent-light)';
  }
}

/** Update the "Subject: …" banners on Legal, Media, Open Web tabs */
function updateSubjectBanners() {
  const { first, middle, last } = getFormValues();
  const parts     = [first, middle, last].filter(Boolean);
  const displayName = parts.length ? parts.join(' ') : '— none set —';

  const ids = ['legal-subject-name', 'media-subject-name', 'web-subject-name'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = displayName;
  });

  // Dashboard active subject
  const dashSubject = document.getElementById('dash-active-subject');
  if (dashSubject) {
    dashSubject.textContent = parts.length ? parts.join(' ') : 'None';
  }
}

function clearForm() {
  document.getElementById('first-name').value  = '';
  document.getElementById('middle-name').value = '';
  document.getElementById('last-name').value   = '';
  document.getElementById('province').value    = 'ON';
  updateSubjectDisplay();
  updateSubjectBanners();
  loadWorkspace();
  showToast('Form cleared.', 'info');
}

function copyFullName() {
  const { first, middle, last } = getFormValues();
  const parts = [first, middle, last].filter(Boolean);
  if (parts.length === 0) {
    showToast('No name to copy.', 'error');
    return;
  }
  const name = parts.join(' ');
  navigator.clipboard.writeText(name).then(() => {
    showToast(`Copied: ${name}`, 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = name;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`Copied: ${name}`, 'success');
  });
}

let _toastTimer = null;
function showToast(message, type = 'info') {
  const toast      = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast toast-${type} show`;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/** Show the search spinner briefly */
function showSpinner() {
  const s = document.getElementById('search-spinner');
  s.classList.add('active');
  setTimeout(() => s.classList.remove('active'), 600);
}

/** Flash a button green after launch */
function flashBtn(btn) {
  btn.classList.add('launched');
  setTimeout(() => btn.classList.remove('launched'), 700);
}


/* ════════════════════════════════════════════════════════════
   TAB SYSTEM
   ════════════════════════════════════════════════════════════ */

function initTabs() {
  const tabBtns  = document.querySelectorAll('.tab-btn[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane[id^="tab-"]');

  function switchTab(targetId) {
    tabBtns.forEach(b => {
      const active = b.dataset.tab === targetId;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    tabPanes.forEach(p => {
      p.classList.toggle('active', p.id === `tab-${targetId}`);
    });
    // Refresh dashboard stats whenever dashboard is shown
    if (targetId === 'dashboard') renderDashboard();
  }

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  // "Set Subject" / "Change" buttons on banners → jump to People tab
  document.querySelectorAll('[data-goto]').forEach(el => {
    el.addEventListener('click', () => switchTab(el.dataset.goto));
  });

  // Dashboard module card click → switch tab
  document.querySelectorAll('.dash-card[data-goto]').forEach(card => {
    card.addEventListener('click', () => switchTab(card.dataset.goto));
  });
}


/* ════════════════════════════════════════════════════════════
   SEARCH — PEOPLE (person name based)
   ════════════════════════════════════════════════════════════ */

function openSearch(sourceKey, triggerBtn) {
  const { first, middle, last, province } = getFormValues();

  if (!first && !last) {
    showToast('Enter at least a first or last name.', 'error');
    return;
  }

  const subject = buildSubject({ first, middle, last, province });
  const urlFn   = SOURCES[sourceKey];

  if (!urlFn) {
    showToast(`Unknown source: ${sourceKey}`, 'error');
    return;
  }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);

  const module = getModuleFromBtn(triggerBtn);
  if (module) markModuleUsed(module);

  const url = urlFn(subject);
  window.open(url, '_blank', 'noopener,noreferrer');
  saveToHistory({ first, middle, last, province });
}

function openAllSearches() {
  const { first, middle, last, province } = getFormValues();

  if (!first && !last) {
    showToast('Enter at least a first or last name.', 'error');
    return;
  }

  const subject = buildSubject({ first, middle, last, province });

  showSpinner();
  let opened = 0;
  OPEN_ALL_SOURCES.forEach(key => {
    const urlFn = SOURCES[key];
    if (urlFn) {
      window.open(urlFn(subject), '_blank', 'noopener,noreferrer');
      opened++;
    }
  });

  showToast(`Opened ${opened} tabs.`, 'success');
  saveToHistory({ first, middle, last, province });
}


/* ════════════════════════════════════════════════════════════
   MODULE COVERAGE TRACKING
   ════════════════════════════════════════════════════════════ */

function getModuleFromBtn(btn) {
  if (!btn) return null;
  const pane = btn.closest('.tab-pane');
  if (!pane) return null;
  return pane.id.replace('tab-', '');
}

function markModuleUsed(module) {
  if (!module) return;
  let coverage = {};
  try { coverage = JSON.parse(localStorage.getItem(LS_COVERAGE_KEY) || '{}'); } catch {}
  coverage[module] = true;
  localStorage.setItem(LS_COVERAGE_KEY, JSON.stringify(coverage));
}

function renderCoverageWidget() {
  const container = document.getElementById('coverage-widget');
  if (!container) return;

  let coverage = {};
  try { coverage = JSON.parse(localStorage.getItem(LS_COVERAGE_KEY) || '{}'); } catch {}

  const modules = [
    { key: 'people',    label: 'People Intel' },
    { key: 'corporate', label: 'Corporate Intel' },
    { key: 'legal',     label: 'Legal Intel' },
    { key: 'media',     label: 'Media Intel' },
    { key: 'technical', label: 'Technical Intel' },
    { key: 'open-web',  label: 'Open Web Intel' },
  ];

  const checked = modules.filter(m => coverage[m.key]).length;
  const pct     = modules.length ? Math.round((checked / modules.length) * 100) : 0;

  container.innerHTML = `
    <div class="coverage-items">
      ${modules.map(m => `
        <div class="coverage-item${coverage[m.key] ? ' coverage-checked' : ''}">
          <span class="coverage-check">${coverage[m.key] ? '✔' : '○'}</span>
          <span class="coverage-label">${m.label}</span>
        </div>`).join('')}
    </div>
    <div class="coverage-bar-row">
      <span class="coverage-bar-label">Overall Coverage</span>
      <span class="coverage-pct">${pct}%</span>
    </div>
    <div class="coverage-bar-track">
      <div class="coverage-bar-fill" style="width:${pct}%"></div>
    </div>`;
}


/* ════════════════════════════════════════════════════════════
   SEARCH — CORPORATE (company name based)
   ════════════════════════════════════════════════════════════ */

function openCorporateSearch(sourceKey, triggerBtn) {
  const companyInput = document.getElementById('company-name');
  const name = companyInput ? companyInput.value.trim() : '';

  const urlFn = CORP_SOURCES[sourceKey];
  if (!urlFn) {
    showToast(`Unknown corporate source: ${sourceKey}`, 'error');
    return;
  }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);
  markModuleUsed('corporate');

  const url = urlFn(name);
  window.open(url, '_blank', 'noopener,noreferrer');

  if (name) {
    showToast(`Searching: ${name}`, 'info');
  }
}


/* ════════════════════════════════════════════════════════════
   SEARCH — TECHNICAL (domain/IP based)
   ════════════════════════════════════════════════════════════ */

function openTechSearch(sourceKey, triggerBtn) {
  const domain = (document.getElementById('domain-input') || {}).value.trim()
    .replace(/^https?:\/\//i, '').replace(/\/.*$/, '');

  const urlFn = TECH_SOURCES[sourceKey];
  if (!urlFn) { showToast(`Unknown source: ${sourceKey}`, 'error'); return; }

  if (!domain && !['subdomain-discovery', 'phone-carrier'].includes(sourceKey)) {
    showToast('Enter a domain or IP address first.', 'error'); return;
  }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);
  markModuleUsed('technical');

  window.open(urlFn(domain), '_blank', 'noopener,noreferrer');
}

/* ════════════════════════════════════════════════════════════
   SEARCH — USERNAME
   ════════════════════════════════════════════════════════════ */

function openUsernameSearch(sourceKey, triggerBtn) {
  const username = (document.getElementById('username-input') || {}).value.trim();
  const urlFn    = USERNAME_SOURCES[sourceKey];
  if (!urlFn) { showToast(`Unknown source: ${sourceKey}`, 'error'); return; }
  if (!username) { showToast('Enter a username first.', 'error'); return; }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);
  markModuleUsed('technical');

  window.open(urlFn(username), '_blank', 'noopener,noreferrer');
}

/* ════════════════════════════════════════════════════════════
   SEARCH — EMAIL
   ════════════════════════════════════════════════════════════ */

function openEmailSearch(sourceKey, triggerBtn) {
  const email = (document.getElementById('email-input') || {}).value.trim();
  const urlFn = EMAIL_SOURCES[sourceKey];
  if (!urlFn) { showToast(`Unknown source: ${sourceKey}`, 'error'); return; }

  // email-headers doesn't need an email
  if (!email && sourceKey !== 'email-headers') {
    showToast('Enter an email address first.', 'error'); return;
  }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);
  markModuleUsed('technical');

  window.open(urlFn(email), '_blank', 'noopener,noreferrer');
}

/* ════════════════════════════════════════════════════════════
   SEARCH — PHONE
   ════════════════════════════════════════════════════════════ */

function openPhoneSearch(sourceKey, triggerBtn) {
  const phone = (document.getElementById('phone-input') || {}).value.trim();
  const urlFn = PHONE_SOURCES[sourceKey];
  if (!urlFn) { showToast(`Unknown source: ${sourceKey}`, 'error'); return; }

  if (!phone && sourceKey !== 'phone-carrier') {
    showToast('Enter a phone number first.', 'error'); return;
  }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);
  markModuleUsed('technical');

  window.open(urlFn(phone), '_blank', 'noopener,noreferrer');
}

/* ════════════════════════════════════════════════════════════
   SEARCH — GEOSPATIAL
   ════════════════════════════════════════════════════════════ */

function openGeoSearch(sourceKey, triggerBtn) {
  const query = (document.getElementById('geo-input') || {}).value.trim();
  const urlFn = GEO_SOURCES[sourceKey];
  if (!urlFn) { showToast(`Unknown source: ${sourceKey}`, 'error'); return; }
  if (!query) { showToast('Enter a location first.', 'error'); return; }

  showSpinner();
  if (triggerBtn) flashBtn(triggerBtn);
  markModuleUsed('technical');

  window.open(urlFn(query), '_blank', 'noopener,noreferrer');
}

/* ════════════════════════════════════════════════════════════
   HISTORY MODULE
   ════════════════════════════════════════════════════════════ */

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

function persistHistory(history) {
  localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history));
}

function saveToHistory({ first, middle, last, province }) {
  const parts    = [first, middle, last].filter(Boolean);
  const fullName = parts.join(' ');
  if (!fullName) return;

  const key     = `${fullName.toLowerCase()}|${province}`;
  let   history = loadHistory();

  history = history.filter(e => {
    const eKey = `${[e.first, e.middle, e.last].filter(Boolean).join(' ').toLowerCase()}|${e.province}`;
    return eKey !== key;
  });

  history.unshift({ first, middle, last, province, ts: Date.now() });
  if (history.length > MAX_HISTORY) history = history.slice(0, MAX_HISTORY);

  persistHistory(history);
  renderHistory();
  renderDashboardHistory();
  updateDashboardStats();
}

function clearHistory() {
  localStorage.removeItem(LS_HISTORY_KEY);
  renderHistory();
  renderDashboardHistory();
  updateDashboardStats();
  showToast('History cleared.', 'info');
}

/** Render history into a given container element */
function renderHistoryInto(container) {
  const history = loadHistory();

  if (history.length === 0) {
    container.innerHTML = '<div class="history-empty">No recent searches.</div>';
    return;
  }

  container.innerHTML = history.map((entry, i) => {
    const parts    = [entry.first, entry.middle, entry.last].filter(Boolean);
    const fullName = parts.join(' ');
    return `
      <div class="history-item" data-index="${i}" title="Click to reload subject">
        <span class="history-num">${i + 1}</span>
        <span class="history-name">${escapeHtml(fullName)}</span>
        <span class="history-province">${escapeHtml(entry.province || 'ON')}</span>
      </div>
    `;
  }).join('');

  container.querySelectorAll('.history-item').forEach(el => {
    el.addEventListener('click', () => {
      const idx   = parseInt(el.dataset.index, 10);
      const entry = loadHistory()[idx];
      if (entry) {
        populateForm(entry);
        showToast(`Loaded: ${[entry.first, entry.middle, entry.last].filter(Boolean).join(' ')}`, 'info');
      }
    });
  });
}

function renderHistory() {
  const container = document.getElementById('history-list');
  if (container) renderHistoryInto(container);
}

function renderDashboardHistory() {
  const container = document.getElementById('history-list-dash');
  if (container) renderHistoryInto(container);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ════════════════════════════════════════════════════════════
   DASHBOARD
   ════════════════════════════════════════════════════════════ */

function updateDashboardStats() {
  const count = loadHistory().length;
  const el    = document.getElementById('dash-history-count');
  if (el) el.textContent = count;
}

function renderDashboard() {
  renderDashboardHistory();
  updateDashboardStats();
  updateSubjectBanners();
  renderCoverageWidget();
}


/* ════════════════════════════════════════════════════════════
   INVESTIGATION WORKSPACE
   ════════════════════════════════════════════════════════════ */

function workspaceKey() {
  const { first, middle, last } = getFormValues();
  const name = [first, middle, last].filter(Boolean).join(' ').toLowerCase().replace(/\s+/g, '_');
  return name ? `${LS_WORKSPACE_KEY}${name}` : null;
}

function loadWorkspace() {
  const key   = workspaceKey();
  const keyEl = document.getElementById('notes-key');

  const fields = ['notes-area', 'summary-area', 'next-steps-area'];
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  const statusEl = document.getElementById('case-status');
  if (statusEl) statusEl.value = '';
  const createdEl = document.getElementById('meta-created');
  const updatedEl = document.getElementById('meta-updated');
  if (createdEl) createdEl.textContent = '—';
  if (updatedEl) updatedEl.textContent = '—';
  if (keyEl)     keyEl.textContent = '';

  if (!key) return;

  try {
    const data = JSON.parse(localStorage.getItem(key) || '{}');
    const notesEl      = document.getElementById('notes-area');
    const summaryEl    = document.getElementById('summary-area');
    const nextStepsEl  = document.getElementById('next-steps-area');

    if (notesEl)     notesEl.value     = data.notes     || '';
    if (summaryEl)   summaryEl.value   = data.summary   || '';
    if (nextStepsEl) nextStepsEl.value = data.nextSteps || '';
    if (statusEl)    statusEl.value    = data.status    || '';

    if (createdEl) createdEl.textContent = data.created ? formatDate(data.created) : '—';
    if (updatedEl) updatedEl.textContent = data.updated ? formatDate(data.updated) : '—';
    if (keyEl)     keyEl.textContent     = `key: ${key.replace(LS_WORKSPACE_KEY, '')}`;
  } catch {
    // ignore corrupt data
  }
}

function saveWorkspace() {
  const key = workspaceKey();
  if (!key) {
    showToast('Enter a subject name before saving.', 'error');
    return;
  }

  let existing = {};
  try { existing = JSON.parse(localStorage.getItem(key) || '{}'); } catch {}

  const now  = new Date().toISOString();
  const data = {
    notes:     (document.getElementById('notes-area')     || {}).value || '',
    summary:   (document.getElementById('summary-area')   || {}).value || '',
    nextSteps: (document.getElementById('next-steps-area')|| {}).value || '',
    status:    (document.getElementById('case-status')    || {}).value || '',
    created:   existing.created || now,
    updated:   now,
  };

  localStorage.setItem(key, JSON.stringify(data));

  const createdEl = document.getElementById('meta-created');
  const updatedEl = document.getElementById('meta-updated');
  if (createdEl) createdEl.textContent = formatDate(data.created);
  if (updatedEl) updatedEl.textContent = formatDate(data.updated);

  const feedback = document.getElementById('save-feedback');
  if (feedback) {
    feedback.textContent = '✓ Workspace saved.';
    setTimeout(() => { feedback.textContent = ''; }, 2500);
  }
  showToast('Workspace saved.', 'success');
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString('en-CA', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return iso; }
}


/* ════════════════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════
   QUERY BUILDER — TEMPLATE DATA
   ════════════════════════════════════════════════════════════ */

const QB_TEMPLATES = {
  people: [
    { label: 'Exact Name',        hint: '"Full Name"',              fn: (f) => `"${f.name}"` },
    { label: 'Alias Search',      hint: '"Alias"',                  fn: (f) => `"${f.alias || f.name}"` },
    { label: 'Username Search',   hint: '"username"',               fn: (f) => `"${f.username || f.name}"` },
    { label: 'Email Search',      hint: '"email@domain.com"',       fn: (f) => `"${f.email || f.name}"` },
    { label: 'Phone Search',      hint: '"phone number"',           fn: (f) => `"${f.phone || f.name}"` },
    { label: 'Name + Canada',     hint: '"Name" Canada',            fn: (f) => `"${f.name}" Canada` },
    { label: 'Name + Alias',      hint: '"Name" OR "Alias"',        fn: (f) => `"${f.name}" OR "${f.alias || f.name}"` },
    { label: 'LinkedIn Profile',  hint: 'site:linkedin.com "Name"', fn: (f) => `site:linkedin.com "${f.name}"` },
    { label: 'Facebook Profile',  hint: 'site:facebook.com "Name"', fn: (f) => `site:facebook.com "${f.name}"` },
    { label: 'Instagram Profile', hint: 'site:instagram.com "Name"',fn: (f) => `site:instagram.com "${f.name}"` },
    { label: 'X / Twitter',       hint: 'site:twitter.com "Name"',  fn: (f) => `site:twitter.com "${f.name}"` },
    { label: 'TikTok Profile',    hint: 'site:tiktok.com "Name"',   fn: (f) => `site:tiktok.com "${f.name}"` },
    { label: 'Telegram Channel',  hint: 'site:t.me "Name"',         fn: (f) => `site:t.me "${f.name}"` },
    { label: 'GitHub Profile',    hint: 'site:github.com "Name"',   fn: (f) => `site:github.com "${f.name}"` },
    { label: 'Reddit Posts',      hint: 'site:reddit.com "Name"',   fn: (f) => `site:reddit.com "${f.name}"` },
    { label: 'YouTube Channel',   hint: 'site:youtube.com "Name"',  fn: (f) => `site:youtube.com "${f.name}"` },
    { label: 'Pinterest Profile', hint: 'site:pinterest.com "Name"',fn: (f) => `site:pinterest.com "${f.name}"` },
    { label: 'Threads Profile',   hint: 'site:threads.net "Name"',  fn: (f) => `site:threads.net "${f.name}"` },
  ],
  corporate: [
    { label: 'Company Name',       hint: '"Company Name"',                fn: (f) => `"${f.company}"` },
    { label: 'Directors Search',   hint: '"Company" directors',           fn: (f) => `"${f.company}" directors OR executives OR officers` },
    { label: 'Gov Procurement',    hint: '"Company" site:buyandsell.gc.ca',fn:(f) => `"${f.company}" site:buyandsell.gc.ca OR site:tpsgc-pwgsc.gc.ca` },
    { label: 'Contracts',          hint: '"Company" contract filetype:pdf',fn:(f) => `"${f.company}" contract filetype:pdf` },
    { label: 'Annual Reports',     hint: '"Company" "annual report" pdf', fn: (f) => `"${f.company}" "annual report" filetype:pdf` },
    { label: 'Press Releases',     hint: '"Company" "press release"',     fn: (f) => `"${f.company}" "press release"` },
    { label: 'Technical Docs',     hint: '"Company" specifications pdf',  fn: (f) => `"${f.company}" specifications OR "technical document" filetype:pdf` },
    { label: 'Supplier Search',    hint: '"Company" supplier OR vendor',  fn: (f) => `"${f.company}" supplier OR vendor` },
    { label: 'Domain PDFs',        hint: 'site:domain.com filetype:pdf',  fn: (f) => `site:${f.domain || 'domain.com'} filetype:pdf` },
    { label: 'News Coverage',      hint: '"Company" site:cbc.ca',         fn: (f) => `"${f.company}" site:cbc.ca OR site:ctvnews.ca OR site:globalnews.ca` },
  ],
  legal: [
    { label: 'Court Cases',        hint: '"Name" site:canlii.org',        fn: (f) => `"${f.name}" site:canlii.org` },
    { label: 'Judgments',          hint: '"Name" judgment OR decision',   fn: (f) => `"${f.name}" judgment OR decision` },
    { label: 'Appeals',            hint: '"Name" appeal court',           fn: (f) => `"${f.name}" appeal court` },
    { label: 'Tribunals',          hint: '"Name" tribunal',               fn: (f) => `"${f.name}" tribunal` },
    { label: 'CanLII Search',      hint: '"Name" site:canlii.org',        fn: (f) => `"${f.name}" site:canlii.org` },
    { label: 'Gov Publications',   hint: '"Name" site:canada.ca',         fn: (f) => `"${f.name}" site:canada.ca OR site:gc.ca` },
    { label: 'Legal PDFs',         hint: '"Name" court filetype:pdf',     fn: (f) => `"${f.name}" filetype:pdf court OR tribunal` },
    { label: 'Sentencing Docs',    hint: '"Name" sentence OR sentencing', fn: (f) => `"${f.name}" sentence OR sentencing court` },
  ],
  documents: [
    { label: 'PDF',                hint: '"Keywords" filetype:pdf',       fn: (f) => `"${f.keywords || f.name}" filetype:pdf` },
    { label: 'DOC',                hint: '"Keywords" filetype:doc',       fn: (f) => `"${f.keywords || f.name}" filetype:doc` },
    { label: 'DOCX',               hint: '"Keywords" filetype:docx',      fn: (f) => `"${f.keywords || f.name}" filetype:docx` },
    { label: 'PPT',                hint: '"Keywords" filetype:ppt',       fn: (f) => `"${f.keywords || f.name}" filetype:ppt` },
    { label: 'PPTX',               hint: '"Keywords" filetype:pptx',      fn: (f) => `"${f.keywords || f.name}" filetype:pptx` },
    { label: 'XLS',                hint: '"Keywords" filetype:xls',       fn: (f) => `"${f.keywords || f.name}" filetype:xls` },
    { label: 'XLSX',               hint: '"Keywords" filetype:xlsx',      fn: (f) => `"${f.keywords || f.name}" filetype:xlsx` },
    { label: 'TXT / CSV',          hint: '"Keywords" filetype:txt',       fn: (f) => `"${f.keywords || f.name}" filetype:txt OR filetype:csv` },
    { label: 'Gov Documents',      hint: 'site:gc.ca filetype:pdf "KW"', fn: (f) => `site:gc.ca filetype:pdf "${f.keywords || f.name}"` },
    { label: 'Engineering Manual', hint: '"Keywords" manual filetype:pdf',fn: (f) => `"${f.keywords || f.name}" manual filetype:pdf` },
    { label: 'Tech Specs',         hint: '"Keywords" specifications pdf', fn: (f) => `"${f.keywords || f.name}" specifications filetype:pdf` },
    { label: 'Court Filings',      hint: '"Name" court filing pdf',       fn: (f) => `"${f.name}" court filing filetype:pdf` },
  ],
  website: [
    { label: 'site: All Pages',    hint: 'site:domain.com',               fn: (f) => `site:${f.domain || 'domain.com'}` },
    { label: 'site: + Keywords',   hint: 'site:domain.com "keywords"',    fn: (f) => `site:${f.domain || 'domain.com'} "${f.keywords}"` },
    { label: 'filetype:pdf',       hint: 'site:domain filetype:pdf',      fn: (f) => `site:${f.domain || 'domain.com'} filetype:pdf` },
    { label: 'intitle: search',    hint: 'intitle:"keywords"',            fn: (f) => `intitle:"${f.keywords || f.name}"` },
    { label: 'inurl: search',      hint: 'inurl:keywords',                fn: (f) => `inurl:${f.keywords || f.name}` },
    { label: 'related: search',    hint: 'related:domain.com',            fn: (f) => `related:${f.domain || 'domain.com'}` },
    { label: 'cache: lookup',      hint: 'cache:domain.com',              fn: (f) => `https://cachedview.nl/` },
    { label: 'Sub-pages only',     hint: 'site:domain.com/path',          fn: (f) => `site:${f.domain || 'domain.com'} "${f.keywords}"` },
  ],
  advanced: [
    { label: 'Government Search',    hint: 'site:gc.ca "keywords"',          fn: (f) => `site:gc.ca "${f.keywords || f.name}"` },
    { label: 'Education Search',     hint: 'site:edu "keywords"',            fn: (f) => `site:edu "${f.keywords || f.name}" OR site:ca university "${f.keywords || f.name}"` },
    { label: 'Media Search',         hint: '"KW" site:cbc.ca OR ctvnews.ca', fn: (f) => `"${f.keywords || f.name}" site:cbc.ca OR site:ctvnews.ca OR site:globalnews.ca` },
    { label: 'Technical Search',     hint: '"KW" filetype:pdf specs',        fn: (f) => `"${f.keywords || f.name}" filetype:pdf specifications OR manual` },
    { label: 'Research Documents',   hint: '"KW" research filetype:pdf',     fn: (f) => `"${f.keywords || f.name}" research filetype:pdf` },
    { label: 'Historical Search',    hint: '"KW" site:archive.org',          fn: (f) => `"${f.keywords || f.name}" site:archive.org OR before:2010` },
    { label: 'Open Directories',     hint: '"KW" intitle:"index of"',        fn: (f) => `"${f.keywords || f.name}" intitle:"index of"` },
    { label: 'Public Reports',       hint: '"KW" report filetype:pdf',       fn: (f) => `"${f.keywords || f.name}" report filetype:pdf` },
    { label: 'Presentations',        hint: '"KW" filetype:pptx',             fn: (f) => `"${f.keywords || f.name}" filetype:pptx OR filetype:ppt` },
    { label: 'Conference Docs',      hint: '"KW" conference proceedings pdf',fn: (f) => `"${f.keywords || f.name}" conference proceedings filetype:pdf` },
  ],
  government: [
    { label: 'Federal Gov (gc.ca)', hint: 'site:gc.ca "keywords"',           fn: (f) => `site:gc.ca "${f.keywords || f.name}"` },
    { label: 'Federal PDFs',        hint: 'site:gc.ca filetype:pdf "KW"',    fn: (f) => `site:gc.ca filetype:pdf "${f.keywords || f.name}"` },
    { label: 'Ontario Gov',         hint: 'site:ontario.ca "keywords"',      fn: (f) => `site:ontario.ca "${f.keywords || f.name}"` },
    { label: 'BC Gov',              hint: 'site:gov.bc.ca "keywords"',       fn: (f) => `site:gov.bc.ca "${f.keywords || f.name}"` },
    { label: 'Alberta Gov',         hint: 'site:alberta.ca "keywords"',      fn: (f) => `site:alberta.ca "${f.keywords || f.name}"` },
    { label: 'Parliament',          hint: 'site:parl.ca "keywords"',         fn: (f) => `site:parl.ca "${f.keywords || f.name}"` },
    { label: 'Gov Contracts',       hint: 'site:buyandsell.gc.ca "company"', fn: (f) => `site:buyandsell.gc.ca "${f.company || f.keywords}"` },
    { label: 'Hansard Debates',     hint: '"Name" site:parl.ca Hansard',     fn: (f) => `"${f.name || f.keywords}" site:parl.ca Hansard` },
  ],
  research: [
    { label: 'Academic Papers',     hint: '"KW" site:scholar.google.com',    fn: (f) => `"${f.keywords || f.name}" site:scholar.google.com` },
    { label: 'Research PDFs',       hint: '"KW" research filetype:pdf',      fn: (f) => `"${f.keywords || f.name}" research filetype:pdf` },
    { label: 'Journal Articles',    hint: '"KW" journal OR paper',           fn: (f) => `"${f.keywords || f.name}" journal article OR paper` },
    { label: 'University Sources',  hint: '"KW" site:.edu',                  fn: (f) => `"${f.keywords || f.name}" site:.edu` },
    { label: 'Think Tank Reports',  hint: '"KW" report policy',              fn: (f) => `"${f.keywords || f.name}" think tank report policy filetype:pdf` },
    { label: 'Statistical Data',    hint: '"KW" site:statcan.gc.ca',         fn: (f) => `"${f.keywords || f.name}" site:statcan.gc.ca` },
    { label: 'UN / NATO Docs',      hint: '"KW" site:un.org',               fn: (f) => `"${f.keywords || f.name}" site:un.org OR site:nato.int filetype:pdf` },
  ],
};

const QB_TIPS = [
  {
    q: 'Why use quotation marks?',
    a: 'Wrap a phrase in quotes to find exact matches. Without quotes, search engines may split the words and return unrelated results. Example: <span class="qb-tip-code">"John Smith Toronto"</span>',
  },
  {
    q: 'How does site: work?',
    a: 'Restricts results to a specific website or domain. Example: <span class="qb-tip-code">site:gc.ca "annual report"</span> — only returns pages from gc.ca.',
  },
  {
    q: 'What does filetype:pdf search?',
    a: 'Returns only documents of that file type. Works with pdf, doc, docx, ppt, xls, csv, txt and more. Example: <span class="qb-tip-code">"Josh Simmons" filetype:pdf</span>',
  },
  {
    q: 'How does intitle: work?',
    a: 'Only returns pages where the search term appears in the page title. Useful for finding topic pages. Example: <span class="qb-tip-code">intitle:"annual report" site:gc.ca</span>',
  },
  {
    q: 'How do Boolean operators improve searches?',
    a: '<span class="qb-tip-code">OR</span> broadens results, <span class="qb-tip-code">AND</span> narrows them, and a leading minus sign <span class="qb-tip-code">-word</span> excludes results containing that word. Example: <span class="qb-tip-code">"John Smith" OR "John A Smith" -linkedin</span>',
  },
  {
    q: 'What is a Google Dork?',
    a: 'A search query that uses advanced operators to find information not easily visible through regular searches. The Query Builder generates professional dorks for you. Example: <span class="qb-tip-code">site:gc.ca filetype:pdf intitle:"confidential" 2023</span>',
  },
  {
    q: 'How does inurl: help?',
    a: 'Finds pages where your term appears in the URL. Useful for locating directories or sections. Example: <span class="qb-tip-code">inurl:staff site:company.ca</span>',
  },
  {
    q: 'What does related: do?',
    a: 'Finds websites similar to the one you specify. Useful for finding competitors or related organizations. Example: <span class="qb-tip-code">related:cbc.ca</span>',
  },
];

let _qbCurrentQuery = '';
let _qbCurrentLabel = '';

/* ════════════════════════════════════════════════════════════
   QUERY BUILDER — FUNCTIONS
   ════════════════════════════════════════════════════════════ */

function getQbFields() {
  return {
    name:     (document.getElementById('qb-name')     || {}).value || '',
    alias:    (document.getElementById('qb-alias')    || {}).value || '',
    username: (document.getElementById('qb-username') || {}).value || '',
    email:    (document.getElementById('qb-email')    || {}).value || '',
    phone:    (document.getElementById('qb-phone')    || {}).value || '',
    company:  (document.getElementById('qb-company')  || {}).value || '',
    domain:   (document.getElementById('qb-domain')   || {}).value.replace(/^https?:\/\//i,'').replace(/\/.*$/,'') || '',
    keywords: (document.getElementById('qb-keywords') || {}).value || '',
  };
}

function renderQbTemplates(cat) {
  const list = document.getElementById('qb-template-list');
  if (!list) return;
  const templates = QB_TEMPLATES[cat] || [];
  list.innerHTML = templates.map((t, i) =>
    `<button class="qb-tpl-btn" data-cat="${cat}" data-idx="${i}" title="${escapeHtml(t.hint)}">
      <span class="qb-tpl-label">${escapeHtml(t.label)}</span>
      <span class="qb-tpl-preview">${escapeHtml(t.hint)}</span>
    </button>`
  ).join('');

  list.querySelectorAll('.qb-tpl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx  = parseInt(btn.dataset.idx, 10);
      const cat  = btn.dataset.cat;
      const tpl  = (QB_TEMPLATES[cat] || [])[idx];
      if (!tpl) return;
      const fields = getQbFields();
      const query  = tpl.fn(fields);
      _qbCurrentQuery = query;
      _qbCurrentLabel = tpl.label;
      setQbPreview(query);
    });
  });
}

function setQbPreview(query) {
  const box = document.getElementById('qb-preview-box');
  if (!box) return;
  if (query && query !== 'https://cachedview.nl/') {
    box.innerHTML = escapeHtml(query);
    box.classList.add('has-query');
  } else if (query === 'https://cachedview.nl/') {
    box.innerHTML = escapeHtml(query) + ' <span style="color:var(--text-muted);font-size:10px">(opens CachedView.nl)</span>';
    box.classList.add('has-query');
  } else {
    box.innerHTML = '<span class="qb-preview-placeholder">Select a template above to preview the query…</span>';
    box.classList.remove('has-query');
  }
}

function launchQbQuery(query) {
  if (!query) { showToast('No query to launch.', 'error'); return; }
  showSpinner();
  if (query.startsWith('http')) {
    window.open(query, '_blank', 'noopener,noreferrer');
  } else {
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank', 'noopener,noreferrer');
  }
  showToast('Query launched.', 'success');
}

function copyQbQuery(query) {
  if (!query) { showToast('No query to copy.', 'error'); return; }
  navigator.clipboard.writeText(query).then(() => {
    showToast('Query copied!', 'success');
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = query;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Query copied!', 'success');
  });
}

function saveQbQuery(query, label) {
  if (!query) { showToast('No query to save.', 'error'); return; }
  let saved = loadSavedQueries();
  // Avoid duplicates
  if (saved.some(s => s.query === query)) {
    showToast('Query already saved.', 'info');
    return;
  }
  saved.unshift({ label: label || query, query, ts: Date.now() });
  if (saved.length > 50) saved = saved.slice(0, 50);
  localStorage.setItem(LS_SAVED_QUERIES_KEY, JSON.stringify(saved));
  renderSavedQueries();
  showToast('Query saved!', 'success');
}

function loadSavedQueries() {
  try { return JSON.parse(localStorage.getItem(LS_SAVED_QUERIES_KEY) || '[]'); } catch { return []; }
}

function renderSavedQueries() {
  const container = document.getElementById('qb-saved-list');
  if (!container) return;
  const saved = loadSavedQueries();
  if (saved.length === 0) {
    container.innerHTML = '<div class="history-empty">No saved queries yet.</div>';
    return;
  }
  container.innerHTML = saved.map((s, i) =>
    `<div class="saved-query-item">
      <span class="sq-label" title="${escapeHtml(s.query)}">${escapeHtml(s.label)}</span>
      <button class="sq-launch" data-idx="${i}">Launch ↗</button>
      <button class="sq-del" data-idx="${i}" title="Delete">✕</button>
    </div>`
  ).join('');

  container.querySelectorAll('.sq-launch').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = loadSavedQueries()[parseInt(btn.dataset.idx, 10)];
      if (s) launchQbQuery(s.query);
    });
  });

  container.querySelectorAll('.sq-del').forEach(btn => {
    btn.addEventListener('click', () => {
      let saved = loadSavedQueries();
      saved.splice(parseInt(btn.dataset.idx, 10), 1);
      localStorage.setItem(LS_SAVED_QUERIES_KEY, JSON.stringify(saved));
      renderSavedQueries();
    });
  });
}

function renderQbTips() {
  const container = document.getElementById('qb-tips');
  if (!container) return;
  container.innerHTML = QB_TIPS.map(t =>
    `<div class="qb-tip">
      <div class="qb-tip-q">${escapeHtml(t.q)}</div>
      <div class="qb-tip-a">${t.a}</div>
    </div>`
  ).join('');
}

function initQb() {
  // Category tab switching
  const catTabs = document.getElementById('qb-cat-tabs');
  if (catTabs) {
    catTabs.querySelectorAll('.qb-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catTabs.querySelectorAll('.qb-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderQbTemplates(btn.dataset.cat);
      });
    });
  }
  renderQbTemplates('people'); // default

  // Operator buttons insert into custom input
  document.querySelectorAll('.qb-op-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const input = document.getElementById('qb-custom-input');
      if (!input) return;
      const op  = btn.dataset.op;
      const pos = input.selectionStart;
      const cur = input.value;
      let ins = op;
      if (op === '"term"')   ins = '""';
      if (op === '()')       ins = '()';
      if (op === '-exclude') ins = '-';
      input.value = cur.slice(0, pos) + ins + cur.slice(pos);
      const newPos = pos + ins.length;
      input.setSelectionRange(newPos, newPos);
      input.focus();
    });
  });

  // Custom query actions
  const customInput = document.getElementById('qb-custom-input');
  const previewBtn  = document.getElementById('qb-custom-preview');
  const launchBtn   = document.getElementById('qb-custom-launch');
  const clearBtn    = document.getElementById('qb-custom-clear');

  if (previewBtn && customInput) {
    previewBtn.addEventListener('click', () => {
      const q = customInput.value.trim();
      if (!q) { showToast('Enter a query first.', 'error'); return; }
      _qbCurrentQuery = q;
      _qbCurrentLabel = 'Custom Query';
      setQbPreview(q);
    });
  }

  if (launchBtn && customInput) {
    launchBtn.addEventListener('click', () => {
      const q = customInput.value.trim();
      if (!q) { showToast('Enter a query first.', 'error'); return; }
      launchQbQuery(q);
    });
  }

  if (clearBtn && customInput) {
    clearBtn.addEventListener('click', () => {
      customInput.value = '';
      customInput.focus();
    });
  }

  if (customInput) {
    customInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = customInput.value.trim();
        if (q) launchQbQuery(q);
      }
    });
  }

  // Preview action buttons
  const copyBtn   = document.getElementById('qb-btn-copy');
  const launchBtn2= document.getElementById('qb-btn-launch');
  const saveBtn   = document.getElementById('qb-btn-save');

  if (copyBtn)    copyBtn.addEventListener('click',  () => copyQbQuery(_qbCurrentQuery));
  if (launchBtn2) launchBtn2.addEventListener('click',() => launchQbQuery(_qbCurrentQuery));
  if (saveBtn)    saveBtn.addEventListener('click',  () => saveQbQuery(_qbCurrentQuery, _qbCurrentLabel));

  // Clear saved queries
  const clearSaved = document.getElementById('qb-clear-saved');
  if (clearSaved) {
    clearSaved.addEventListener('click', () => {
      localStorage.removeItem(LS_SAVED_QUERIES_KEY);
      renderSavedQueries();
      showToast('Saved queries cleared.', 'info');
    });
  }

  renderSavedQueries();
  renderQbTips();
}


/* ════════════════════════════════════════════════════════════
   FAVORITES SYSTEM
   ════════════════════════════════════════════════════════════ */

function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(LS_FAVORITES_KEY) || '[]'); } catch { return []; }
}

function saveFavorite(entry) {
  let favs = loadFavorites();
  const key = `${[entry.first, entry.middle, entry.last].filter(Boolean).join(' ').toLowerCase()}|${entry.province}`;
  if (favs.some(f => `${[f.first, f.middle, f.last].filter(Boolean).join(' ').toLowerCase()}|${f.province}` === key)) {
    showToast('Already in favorites.', 'info');
    return false;
  }
  favs.unshift({ ...entry, favTs: Date.now() });
  if (favs.length > 30) favs = favs.slice(0, 30);
  localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(favs));
  renderFavorites();
  showToast('⭐ Added to Favorites!', 'success');
  return true;
}

function removeFavorite(idx) {
  let favs = loadFavorites();
  favs.splice(idx, 1);
  localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(favs));
  renderFavorites();
}

function isInFavorites(entry) {
  const key = `${[entry.first, entry.middle, entry.last].filter(Boolean).join(' ').toLowerCase()}|${entry.province}`;
  return loadFavorites().some(f =>
    `${[f.first, f.middle, f.last].filter(Boolean).join(' ').toLowerCase()}|${f.province}` === key
  );
}

function renderFavorites() {
  const container  = document.getElementById('fav-list-dash');
  const countBadge = document.getElementById('fav-count-badge');
  const favs       = loadFavorites();

  if (countBadge) countBadge.textContent = favs.length;

  if (!container) return;
  if (favs.length === 0) {
    container.innerHTML = '<div class="history-empty">No favorites yet. Star a search to pin it here.</div>';
    return;
  }

  container.innerHTML = favs.map((f, i) => {
    const parts    = [f.first, f.middle, f.last].filter(Boolean);
    const fullName = parts.join(' ');
    return `
      <div class="fav-item" data-index="${i}">
        <span class="fav-star">⭐</span>
        <span class="fav-label">${escapeHtml(fullName)}</span>
        <span class="fav-query">[${escapeHtml(f.province || 'ON')}]</span>
        <button class="fav-del" data-fav-idx="${i}" title="Remove from favorites">✕</button>
      </div>`;
  }).join('');

  // Click row → load subject
  container.querySelectorAll('.fav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target.classList.contains('fav-del')) return;
      const idx   = parseInt(el.dataset.index, 10);
      const entry = loadFavorites()[idx];
      if (entry) {
        populateForm(entry);
        // Switch to People tab
        document.querySelectorAll('.tab-btn[data-tab]').forEach(b => {
          const active = b.dataset.tab === 'people';
          b.classList.toggle('active', active);
          b.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        document.querySelectorAll('.tab-pane[id^="tab-"]').forEach(p =>
          p.classList.toggle('active', p.id === 'tab-people')
        );
        showToast(`Loaded: ${[entry.first, entry.middle, entry.last].filter(Boolean).join(' ')}`, 'info');
      }
    });
  });

  container.querySelectorAll('.fav-del').forEach(btn => {
    btn.addEventListener('click', () => {
      removeFavorite(parseInt(btn.dataset.favIdx, 10));
    });
  });
}


/* ════════════════════════════════════════════════════════════
   ENHANCED HISTORY
   ════════════════════════════════════════════════════════════ */

function renderHistoryInto(container, filter) {
  const history = loadHistory();
  const term    = (filter || '').toLowerCase().trim();
  const visible = term
    ? history.filter(e => {
        const n = [e.first, e.middle, e.last].filter(Boolean).join(' ').toLowerCase();
        return n.includes(term) || (e.province || '').toLowerCase().includes(term);
      })
    : history;

  if (visible.length === 0) {
    container.innerHTML = term
      ? '<div class="history-empty">No results match that filter.</div>'
      : '<div class="history-empty">No recent searches.</div>';
    return;
  }

  const favKeys = new Set(loadFavorites().map(f =>
    `${[f.first, f.middle, f.last].filter(Boolean).join(' ').toLowerCase()}|${f.province}`
  ));

  container.innerHTML = visible.map((entry, i) => {
    const parts    = [entry.first, entry.middle, entry.last].filter(Boolean);
    const fullName = parts.join(' ');
    const key      = `${fullName.toLowerCase()}|${entry.province}`;
    const starred  = favKeys.has(key);
    return `
      <div class="history-item" data-index="${i}">
        <span class="history-num">${i + 1}</span>
        <span class="history-rerun" data-index="${i}" title="Click to reload subject">
          <span class="history-name">${escapeHtml(fullName)}</span>
          <span class="history-province">${escapeHtml(entry.province || 'ON')}</span>
        </span>
        <button class="hist-star-btn${starred ? ' starred' : ''}" data-index="${i}" title="${starred ? 'Remove from favorites' : 'Add to favorites'}">⭐</button>
        <button class="hist-del-btn" data-index="${i}" title="Delete this entry">✕</button>
      </div>`;
  }).join('');

  container.querySelectorAll('.history-rerun').forEach(el => {
    el.addEventListener('click', () => {
      const idx   = parseInt(el.dataset.index, 10);
      const entry = loadHistory()[idx];
      if (entry) {
        populateForm(entry);
        showToast(`Loaded: ${[entry.first, entry.middle, entry.last].filter(Boolean).join(' ')}`, 'info');
      }
    });
  });

  container.querySelectorAll('.hist-star-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx   = parseInt(btn.dataset.index, 10);
      const entry = loadHistory()[idx];
      if (!entry) return;
      if (btn.classList.contains('starred')) {
        // Remove from favorites
        const favs = loadFavorites();
        const fKey = `${[entry.first, entry.middle, entry.last].filter(Boolean).join(' ').toLowerCase()}|${entry.province}`;
        const fi   = favs.findIndex(f =>
          `${[f.first, f.middle, f.last].filter(Boolean).join(' ').toLowerCase()}|${f.province}` === fKey
        );
        if (fi !== -1) { favs.splice(fi, 1); localStorage.setItem(LS_FAVORITES_KEY, JSON.stringify(favs)); }
        renderFavorites();
        showToast('Removed from favorites.', 'info');
      } else {
        saveFavorite(entry);
      }
      // Re-render the whole list to update star states
      const filterEl = container.id === 'history-list'
        ? document.getElementById('history-filter')
        : document.getElementById('history-filter-dash');
      renderHistoryInto(container, filterEl ? filterEl.value : '');
    });
  });

  container.querySelectorAll('.hist-del-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index, 10);
      let history = loadHistory();
      history.splice(idx, 1);
      persistHistory(history);
      const filterEl = container.id === 'history-list'
        ? document.getElementById('history-filter')
        : document.getElementById('history-filter-dash');
      renderHistoryInto(container, filterEl ? filterEl.value : '');
      renderDashboardHistory();
      updateDashboardStats();
    });
  });
}

function renderHistory() {
  const container = document.getElementById('history-list');
  if (!container) return;
  const filter = (document.getElementById('history-filter') || {}).value || '';
  renderHistoryInto(container, filter);
}

function renderDashboardHistory() {
  const container = document.getElementById('history-list-dash');
  if (!container) return;
  const filter = (document.getElementById('history-filter-dash') || {}).value || '';
  renderHistoryInto(container, filter);
}


/* ════════════════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Tab system ──────────────────────────────────────────────
  initTabs();

  // ── Wire ALL people/web/legal/media search buttons ──────────
  document.querySelectorAll('.search-btn[data-source]').forEach(btn => {
    // Skip corporate buttons — handled separately
    const isCorp = !!CORP_SOURCES[btn.dataset.source];
    if (!isCorp) {
      btn.addEventListener('click', () => openSearch(btn.dataset.source, btn));
    }
  });

  // ── Wire corporate search buttons ───────────────────────────
  document.querySelectorAll('.search-btn[data-source]').forEach(btn => {
    if (CORP_SOURCES[btn.dataset.source]) {
      btn.addEventListener('click', () => openCorporateSearch(btn.dataset.source, btn));
    }
  });

  // ── Quick action buttons ────────────────────────────────────
  document.getElementById('btn-clear-form')
    .addEventListener('click', clearForm);

  document.getElementById('btn-copy-name')
    .addEventListener('click', copyFullName);

  document.getElementById('btn-open-all')
    .addEventListener('click', openAllSearches);

  document.getElementById('btn-clear-history')
    .addEventListener('click', clearHistory);

  const dashClear = document.getElementById('btn-clear-history-dash');
  if (dashClear) dashClear.addEventListener('click', clearHistory);

  document.getElementById('btn-save-notes')
    .addEventListener('click', saveWorkspace);

  // ── Live subject display ────────────────────────────────────
  ['first-name', 'middle-name', 'last-name', 'province'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  handleNameChange);
    el.addEventListener('change', handleNameChange);
  });

  function handleNameChange() {
    updateSubjectDisplay();
    updateSubjectBanners();
    loadWorkspace();
  }

  // ── Company name live display ───────────────────────────────
  const companyInput = document.getElementById('company-name');
  if (companyInput) {
    companyInput.addEventListener('input', updateCompanyDisplay);
    companyInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') openCorporateSearch('opencorporates', null);
    });
  }

  // ── Enter key on name fields → Google Exact ─────────────────
  ['first-name', 'middle-name', 'last-name'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') openSearch('google-exact', null);
    });
  });

  // ── Auto-save workspace on textarea blur ────────────────────
  ['notes-area', 'summary-area', 'next-steps-area'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => {
      if (workspaceKey()) saveWorkspace();
    });
  });

  // ── Wire Technical Intelligence buttons ─────────────────────
  document.querySelectorAll('.search-btn[data-tech-source]').forEach(btn => {
    btn.addEventListener('click', () => openTechSearch(btn.dataset.techSource, btn));
  });

  // ── Wire Username buttons ────────────────────────────────────
  document.querySelectorAll('.search-btn[data-username-source]').forEach(btn => {
    btn.addEventListener('click', () => openUsernameSearch(btn.dataset.usernameSource, btn));
  });

  // ── Wire Email buttons ───────────────────────────────────────
  document.querySelectorAll('.search-btn[data-email-source]').forEach(btn => {
    if (!btn.disabled) {
      btn.addEventListener('click', () => openEmailSearch(btn.dataset.emailSource, btn));
    }
  });

  // ── Wire Phone buttons ───────────────────────────────────────
  document.querySelectorAll('.search-btn[data-phone-source]').forEach(btn => {
    btn.addEventListener('click', () => openPhoneSearch(btn.dataset.phoneSource, btn));
  });

  // ── Wire Geo buttons ─────────────────────────────────────────
  document.querySelectorAll('.search-btn[data-geo-source]').forEach(btn => {
    btn.addEventListener('click', () => openGeoSearch(btn.dataset.geoSource, btn));
  });

  // ── Tech tab live displays ───────────────────────────────────
  function makeLiveDisplay(inputId, displayId, placeholder) {
    const input   = document.getElementById(inputId);
    const display = document.getElementById(displayId);
    if (!input || !display) return;
    const update = () => {
      const v = input.value.trim();
      display.textContent  = v || placeholder;
      display.style.color  = v ? 'var(--accent-light)' : 'var(--text-dim)';
    };
    input.addEventListener('input', update);
    update();
  }
  makeLiveDisplay('domain-input',   'domain-display',   '— no domain entered —');
  makeLiveDisplay('username-input', 'username-display',  '— no username entered —');
  makeLiveDisplay('email-input',    'email-display',     '— no email entered —');
  makeLiveDisplay('phone-input',    'phone-display',     '— no phone entered —');
  makeLiveDisplay('geo-input',      'geo-display',       '— no location entered —');

  // ── Quick Actions panel ──────────────────────────────────────
  document.querySelectorAll('.qa-panel-btn[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabBtns = document.querySelectorAll('.tab-btn[data-tab]');
      const panes   = document.querySelectorAll('.tab-pane[id^="tab-"]');
      const target  = btn.dataset.goto;
      tabBtns.forEach(b => {
        const active = b.dataset.tab === target;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      panes.forEach(p => p.classList.toggle('active', p.id === `tab-${target}`));
    });
  });

  const runFullBtn = document.getElementById('btn-run-full');
  if (runFullBtn) {
    runFullBtn.addEventListener('click', () => {
      const { first, middle, last, province } = getFormValues();
      if (!first && !last) {
        showToast('Set a subject in People Intelligence first.', 'error');
        return;
      }
      const subject = buildSubject({ first, middle, last, province });
      showSpinner();
      OPEN_ALL_SOURCES.forEach(key => {
        const urlFn = SOURCES[key];
        if (urlFn) window.open(urlFn(subject), '_blank', 'noopener,noreferrer');
      });
      ['people','corporate','legal','media','open-web'].forEach(m => markModuleUsed(m));
      showToast(`Full investigation launched.`, 'success');
      saveToHistory({ first, middle, last, province });
    });
  }

  // ── History filter inputs ────────────────────────────────────
  const histFilter = document.getElementById('history-filter');
  if (histFilter) {
    histFilter.addEventListener('input', () => renderHistory());
  }
  const histFilterDash = document.getElementById('history-filter-dash');
  if (histFilterDash) {
    histFilterDash.addEventListener('input', () => renderDashboardHistory());
  }

  // ── Query Builder ─────────────────────────────────────────────
  initQb();

  // ── Initial render ───────────────────────────────────────────
  renderHistory();
  renderDashboard();
  renderFavorites();
  updateSubjectDisplay();
  updateSubjectBanners();
  loadWorkspace();
});
