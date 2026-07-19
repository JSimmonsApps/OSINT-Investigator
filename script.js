/**
 * OSINT Investigator — script.js
 * Canadian OSINT Search Platform
 * Organized into: Constants | UI | Search | History | Notes | Init
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════ */

const LS_HISTORY_KEY = 'osint_search_history';
const LS_NOTES_KEY   = 'osint_notes_';           // suffix: normalised subject key
const MAX_HISTORY    = 15;

/**
 * Search source definitions.
 * Each entry returns a URL given a subject object:
 *   { first, middle, last, province, fullName, shortName }
 */
const SOURCES = {
  'canlii': ({ fullName }) =>
    `https://www.canlii.org/en/#search/text=${encodeURIComponent(fullName)}`,

  'ontario-courts': () =>
    'https://www.ontariocourts.ca/scj/en/sittings/',

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

  // ── Additional OSINT ──────────────────────────────────────
  'google': ({ shortName }) =>
    `https://www.google.com/search?q=${encodeURIComponent(`"${shortName}"`)}`,

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

/** Return the current form values. */
function getFormValues() {
  const first    = document.getElementById('first-name').value.trim();
  const middle   = document.getElementById('middle-name').value.trim();
  const last     = document.getElementById('last-name').value.trim();
  const province = document.getElementById('province').value;
  return { first, middle, last, province };
}

/** Build subject object from individual name parts. */
function buildSubject({ first, middle, last, province }) {
  const parts    = [first, middle, last].filter(Boolean);
  const fullName = parts.join(' ');
  const shortName = [first, last].filter(Boolean).join(' ');
  return { first, middle, last, province, fullName, shortName };
}

/** Populate form fields from a history entry. */
function populateForm({ first, middle, last, province }) {
  document.getElementById('first-name').value  = first  || '';
  document.getElementById('middle-name').value = middle || '';
  document.getElementById('last-name').value   = last   || '';
  if (province) {
    document.getElementById('province').value = province;
  }
  updateSubjectDisplay();
  loadNotesForCurrentSubject();
}

/** Update the live subject display bar. */
function updateSubjectDisplay() {
  const { first, middle, last, province } = getFormValues();
  const display = document.getElementById('subject-display');
  const parts = [first, middle, last].filter(Boolean);
  if (parts.length === 0) {
    display.textContent = '— no subject entered —';
    display.style.color = 'var(--text-dim)';
  } else {
    display.textContent = `${parts.join(' ')}   [${province}]`;
    display.style.color = 'var(--accent-light)';
  }
}

/** Clear all form inputs. */
function clearForm() {
  document.getElementById('first-name').value  = '';
  document.getElementById('middle-name').value = '';
  document.getElementById('last-name').value   = '';
  document.getElementById('province').value    = 'ON';
  updateSubjectDisplay();
  loadNotesForCurrentSubject();
  showToast('Form cleared.', 'info');
}

/** Copy full name to clipboard. */
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
    // Fallback for clipboard denial
    const ta = document.createElement('textarea');
    ta.value = name;
    ta.style.position = 'fixed';
    ta.style.opacity  = '0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`Copied: ${name}`, 'success');
  });
}

/** Show a transient toast message. */
let _toastTimer = null;
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className   = `toast toast-${type} show`;
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}


/* ════════════════════════════════════════════════════════════
   SEARCH GENERATION
   ════════════════════════════════════════════════════════════ */

/** Open a single search source by key. */
function openSearch(sourceKey) {
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

  const url = urlFn(subject);
  window.open(url, '_blank', 'noopener,noreferrer');

  // Save to history whenever a search is launched
  saveToHistory({ first, middle, last, province });
}

/** Open all primary sources simultaneously. */
function openAllSearches() {
  const { first, middle, last, province } = getFormValues();

  if (!first && !last) {
    showToast('Enter at least a first or last name.', 'error');
    return;
  }

  const subject = buildSubject({ first, middle, last, province });

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
   HISTORY MODULE
   ════════════════════════════════════════════════════════════ */

/** Load raw history array from LocalStorage. */
function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem(LS_HISTORY_KEY) || '[]');
  } catch {
    return [];
  }
}

/** Persist history array to LocalStorage. */
function persistHistory(history) {
  localStorage.setItem(LS_HISTORY_KEY, JSON.stringify(history));
}

/**
 * Save an entry to history.
 * Deduplicates by full name + province (case-insensitive).
 * Keeps the most recent duplicate at the top.
 */
function saveToHistory({ first, middle, last, province }) {
  const parts    = [first, middle, last].filter(Boolean);
  const fullName = parts.join(' ');
  if (!fullName) return;

  const key     = `${fullName.toLowerCase()}|${province}`;
  let   history = loadHistory();

  // Remove existing entry with same key
  history = history.filter(e => {
    const eKey = `${[e.first, e.middle, e.last].filter(Boolean).join(' ').toLowerCase()}|${e.province}`;
    return eKey !== key;
  });

  // Prepend new entry
  history.unshift({ first, middle, last, province, ts: Date.now() });

  // Enforce max length
  if (history.length > MAX_HISTORY) {
    history = history.slice(0, MAX_HISTORY);
  }

  persistHistory(history);
  renderHistory();
}

/** Clear all history. */
function clearHistory() {
  localStorage.removeItem(LS_HISTORY_KEY);
  renderHistory();
  showToast('History cleared.', 'info');
}

/** Render the history list in the DOM. */
function renderHistory() {
  const container = document.getElementById('history-list');
  const history   = loadHistory();

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

  // Attach click handlers
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

/** Minimal HTML escape to prevent XSS in history names. */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}


/* ════════════════════════════════════════════════════════════
   NOTES MODULE
   ════════════════════════════════════════════════════════════ */

/** Build a stable LocalStorage key for the current subject. */
function notesKeyForSubject() {
  const { first, middle, last } = getFormValues();
  const name = [first, middle, last].filter(Boolean).join(' ').toLowerCase().replace(/\s+/g, '_');
  return name ? `${LS_NOTES_KEY}${name}` : null;
}

/** Load and display notes for the current subject. */
function loadNotesForCurrentSubject() {
  const textarea = document.getElementById('notes-area');
  const keyEl    = document.getElementById('notes-key');
  const key      = notesKeyForSubject();

  if (!key) {
    textarea.value = '';
    keyEl.textContent = '';
    return;
  }

  textarea.value    = localStorage.getItem(key) || '';
  keyEl.textContent = `key: ${key.replace(LS_NOTES_KEY, '')}`;
}

/** Save notes for the current subject. */
function saveNotes() {
  const textarea = document.getElementById('notes-area');
  const feedback = document.getElementById('save-feedback');
  const key      = notesKeyForSubject();

  if (!key) {
    showToast('Enter a subject name before saving notes.', 'error');
    return;
  }

  localStorage.setItem(key, textarea.value);

  // Brief feedback message
  feedback.textContent = 'Notes saved.';
  setTimeout(() => { feedback.textContent = ''; }, 2000);
}


/* ════════════════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── Wire search buttons ────────────────────────────────────
  document.querySelectorAll('.search-btn[data-source]').forEach(btn => {
    btn.addEventListener('click', () => openSearch(btn.dataset.source));
  });

  // ── Wire quick action buttons ──────────────────────────────
  document.getElementById('btn-clear-form')
    .addEventListener('click', clearForm);

  document.getElementById('btn-copy-name')
    .addEventListener('click', copyFullName);

  document.getElementById('btn-open-all')
    .addEventListener('click', openAllSearches);

  document.getElementById('btn-clear-history')
    .addEventListener('click', clearHistory);

  document.getElementById('btn-save-notes')
    .addEventListener('click', saveNotes);

  // ── Live subject display update ────────────────────────────
  ['first-name', 'middle-name', 'last-name', 'province'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('input',  handleNameChange);
    el.addEventListener('change', handleNameChange);
  });

  function handleNameChange() {
    updateSubjectDisplay();
    loadNotesForCurrentSubject();
  }

  // ── Enter key triggers Google Exact search ─────────────────
  ['first-name', 'middle-name', 'last-name'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') openSearch('google-exact');
    });
  });

  // ── Auto-save notes on textarea blur ──────────────────────
  document.getElementById('notes-area').addEventListener('blur', () => {
    if (notesKeyForSubject()) saveNotes();
  });

  // ── Initial render ─────────────────────────────────────────
  renderHistory();
  updateSubjectDisplay();
  loadNotesForCurrentSubject();
});
