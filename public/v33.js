/**
 * OSINT Investigator v3.3 — v33.js
 * Intelligence & Investigation Workflow Engine
 * All data stored in LocalStorage. No data leaves the device.
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   CONSTANTS
   ════════════════════════════════════════════════════════════ */

const LS_INV_KEY = 'osint_investigations_v33';

const INV_STATUSES = ['Planning', 'Active', 'Review', 'Completed', 'Archived'];
const INV_TYPES = [
  { id: 'person',    label: 'Person',    icon: '👤' },
  { id: 'company',   label: 'Company',   icon: '🏢' },
  { id: 'username',  label: 'Username',  icon: '🔖' },
  { id: 'email',     label: 'Email',     icon: '📧' },
  { id: 'domain',    label: 'Domain',    icon: '🌐' },
  { id: 'corporate', label: 'Corporate', icon: '📊' },
  { id: 'legal',     label: 'Legal',     icon: '⚖️' },
  { id: 'media',     label: 'Media',     icon: '📰' },
  { id: 'general',   label: 'General OSINT', icon: '🔍' },
];

const SUBJECT_TYPES = ['Person','Company','Organization','Username','Email','Domain','Phone','Other'];

const CONFIDENCE_LEVELS = ['Unknown','Low','Medium','High','Verified'];
const NOTE_TYPES = ['General','Research','Question','Hypothesis','Follow-up'];
const SOURCE_TYPES = ['Website','Government','Court','Social Media','News','Document','Database','Other'];
const FOLLOWUP_STATUSES = ['Open','In Progress','Completed','Cancelled'];
const FOLLOWUP_PRIORITIES = ['Low','Medium','High','Critical'];

const PREDEFINED_TAGS = [
  'Person','Company','Financial','Legal','Social Media','Phone','Address',
  'Email','Username','Domain','Government','Employment','Associates',
  'Property','Vehicle','Criminal','Photo','Document','Verified','Unverified'
];

const INV_TYPE_WORKFLOWS = {
  person:    ['Set subject name and date of birth', 'Search People Intelligence tab', 'Check Social Intelligence sources', 'Run Legal Intelligence searches', 'Record findings with confidence', 'Document source provenance', 'Build timeline of events', 'Add follow-up items'],
  company:   ['Enter company name', 'Search Corporate Registries', 'Check Open Government data', 'Look up lobbyist registrations', 'Search Legal databases for filings', 'Document directors and officers', 'Build corporate timeline', 'Export investigation'],
  username:  ['Capture target username', 'Use IRC Username Intelligence tools', 'Check People tab Social Intelligence', 'Search Query Builder username templates', 'Document active/inactive platforms', 'Note profile content and dates', 'Flag associated accounts', 'Record findings'],
  email:     ['Enter email address', 'Use Technical → Email Intelligence', 'Check breach databases (HIBP)', 'Look up Gravatar avatar', 'Investigate email domain WHOIS', 'Search social networks via Google', 'Document all associated accounts', 'Note breach details as findings'],
  domain:    ['Enter domain in Technical tab', 'Run WHOIS lookup', 'Check DNS and certificate records', 'Enumerate subdomains', 'Capture tech stack and hosting', 'Archive current site state', 'Search for associated persons/entities', 'Document all findings'],
  corporate: ['Identify legal entity name', 'Search federal and provincial registries', 'Identify directors/shareholders', 'Search for litigation records', 'Check government contracts (Open Gov)', 'Look up lobbyist registrations', 'Review news media coverage', 'Document corporate structure'],
  legal:     ['Identify parties and jurisdiction', 'Search CanLII for case references', 'Check Federal and Superior Court decisions', 'Review administrative tribunal rulings', 'Document legal issues and citations', 'Record key dates and rulings', 'Note related proceedings', 'Build legal timeline'],
  media:     ['Define media subject or topic', 'Search CBC, CTV, Global News', 'Search Google News for coverage', 'Search Reuters and international outlets', 'Build timeline of coverage', 'Note editorial angle and tone', 'Document reporter and publication', 'Save article URLs as sources'],
  general:   ['Define investigation objective clearly', 'Run People Intelligence searches', 'Check Open Web Intelligence', 'Search Query Builder templates', 'Use IRC resources relevant to subject', 'Document all findings with sources', 'Build a chronological timeline', 'Review and export when complete'],
};

/* ════════════════════════════════════════════════════════════
   STATE
   ════════════════════════════════════════════════════════════ */

let _invView = 'dashboard';   // dashboard | new | edit | workspace
let _currentInvId = null;
let _wsTab = 'overview';
let _invFilter = 'all';
let _invSearch = '';
let _addingItem = '';          // which sub-form is open
let _editItemId = null;        // item being edited

// Temporary form state
let _newInvType = '';
let _newFindingTags = [];
let _editFindingTags = [];

// Modal state
let _modalData = null;

/* ════════════════════════════════════════════════════════════
   STORAGE
   ════════════════════════════════════════════════════════════ */

function loadInvestigations() {
  try {
    const raw = localStorage.getItem(LS_INV_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) { return []; }
}

function saveInvestigations(arr) {
  try { localStorage.setItem(LS_INV_KEY, JSON.stringify(arr)); } catch(e) {}
}

function getInv(id) {
  return loadInvestigations().find(i => i.id === id) || null;
}

function updateInv(id, patch) {
  const all = loadInvestigations();
  const idx = all.findIndex(i => i.id === id);
  if (idx === -1) return;
  all[idx] = { ...all[idx], ...patch, updated: new Date().toISOString() };
  saveInvestigations(all);
}

function uuidV33() {
  return 'inv_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8);
}

function nextFindingId(inv) {
  if (!inv.findings || inv.findings.length === 0) return 'F-001';
  const nums = inv.findings.map(f => {
    const m = (f.id || '').match(/F-(\d+)/);
    return m ? parseInt(m[1]) : 0;
  });
  const next = Math.max(...nums) + 1;
  return 'F-' + String(next).padStart(3, '0');
}

function shortId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,5);
}

/* ════════════════════════════════════════════════════════════
   ESCAPE UTIL
   ════════════════════════════════════════════════════════════ */

function esc(s) {
  return String(s || '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' });
  } catch(e) { return iso; }
}

function fmtDateTime(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('en-CA', { year:'numeric', month:'short', day:'numeric' }) + ' ' +
           d.toLocaleTimeString('en-CA', { hour:'2-digit', minute:'2-digit' });
  } catch(e) { return iso; }
}

function statusClass(s) {
  const map = { Planning:'planning', Active:'active', Review:'review', Completed:'completed', Archived:'archived' };
  return 'inv-status-' + (map[(s||'').trim()] || 'planning');
}

/* ════════════════════════════════════════════════════════════
   MAIN RENDER DISPATCHER
   ════════════════════════════════════════════════════════════ */

function renderInv() {
  const root = document.getElementById('inv-root');
  if (!root) return;
  root.innerHTML = '';

  if (_invView === 'dashboard') renderInvDashboard(root);
  else if (_invView === 'new')  renderInvForm(root, null);
  else if (_invView === 'edit') renderInvForm(root, getInv(_currentInvId));
  else if (_invView === 'workspace') renderInvWorkspace(root);

  // Extend global search after render
  extendGlobalSearch();
}

/* ════════════════════════════════════════════════════════════
   DASHBOARD VIEW
   ════════════════════════════════════════════════════════════ */

function renderInvDashboard(root) {
  const all = loadInvestigations();
  const active    = all.filter(i => i.status === 'Active');
  const planning  = all.filter(i => i.status === 'Planning');
  const review    = all.filter(i => i.status === 'Review');
  const completed = all.filter(i => i.status === 'Completed');
  const archived  = all.filter(i => i.status === 'Archived');

  // Privacy note
  const privacyNote = `
    <div class="inv-privacy-note" style="margin:12px 16px 0">
      🔒 All investigation data is stored locally on this device. Nothing is transmitted externally.
    </div>`;

  // Top bar
  const topbar = `
    <div class="inv-topbar">
      <div class="inv-topbar-title">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        INVESTIGATIONS
        <span class="inv-section-count">${all.filter(i=>i.status!=='Archived').length}</span>
      </div>
      <div class="inv-topbar-actions">
        <input type="text" id="inv-search-input" class="inv-filter-select" placeholder="Search…" style="width:120px" value="${esc(_invSearch)}" />
        <select id="inv-filter-select" class="inv-filter-select">
          <option value="all" ${_invFilter==='all'?'selected':''}>All</option>
          <option value="active" ${_invFilter==='active'?'selected':''}>Active</option>
          <option value="planning" ${_invFilter==='planning'?'selected':''}>Planning</option>
          <option value="review" ${_invFilter==='review'?'selected':''}>Review</option>
          <option value="completed" ${_invFilter==='completed'?'selected':''}>Completed</option>
          <option value="archived" ${_invFilter==='archived'?'selected':''}>Archived</option>
        </select>
        <button class="inv-new-btn" id="inv-btn-new">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          New Investigation
        </button>
      </div>
    </div>`;

  // Stats bar
  const stats = `
    <div class="inv-stats-bar">
      <div class="inv-stat-cell">
        <span class="inv-stat-num accent">${active.length}</span>
        <span class="inv-stat-label">Active</span>
      </div>
      <div class="inv-stat-cell">
        <span class="inv-stat-num yellow">${planning.length + review.length}</span>
        <span class="inv-stat-label">In Progress</span>
      </div>
      <div class="inv-stat-cell">
        <span class="inv-stat-num green">${completed.length}</span>
        <span class="inv-stat-label">Completed</span>
      </div>
      <div class="inv-stat-cell">
        <span class="inv-stat-num">${all.length}</span>
        <span class="inv-stat-label">Total</span>
      </div>
    </div>`;

  // Filter
  let filtered = all;
  if (_invFilter !== 'all') {
    filtered = all.filter(i => i.status.toLowerCase() === _invFilter.toLowerCase());
  }
  if (_invSearch.trim()) {
    const t = _invSearch.toLowerCase();
    filtered = filtered.filter(i =>
      (i.name || '').toLowerCase().includes(t) ||
      (i.subject || '').toLowerCase().includes(t) ||
      (i.reference || '').toLowerCase().includes(t) ||
      (i.investigator || '').toLowerCase().includes(t) ||
      (i.objective || '').toLowerCase().includes(t)
    );
  }

  // Separate pinned/favorites
  const favorites = filtered.filter(i => i.favorite);
  const rest      = filtered.filter(i => !i.favorite);

  let listHTML = '';

  if (favorites.length > 0) {
    listHTML += `
      <div class="inv-section-separator">⭐ FAVOURITES</div>
      <div class="inv-card-list" id="inv-card-list-fav">${favorites.map(invCardHTML).join('')}</div>`;
  }

  if (rest.length > 0) {
    listHTML += `
      <div class="inv-section-separator">ALL INVESTIGATIONS</div>
      <div class="inv-card-list" id="inv-card-list-main">${rest.map(invCardHTML).join('')}</div>`;
  }

  if (filtered.length === 0) {
    listHTML = `
      <div class="inv-empty-state">
        <div class="inv-empty-icon">🔍</div>
        <div class="inv-empty-title">${all.length === 0 ? 'No Investigations Yet' : 'No Results'}</div>
        <div class="inv-empty-desc">${all.length === 0
          ? 'Create an investigation to begin organizing your research.'
          : 'Try adjusting your search or filter.'}</div>
        ${all.length === 0 ? '<button class="inv-new-btn" id="inv-btn-new-empty" style="margin-top:4px"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg> New Investigation</button>' : ''}
      </div>`;
  }

  root.innerHTML = privacyNote + topbar + stats + listHTML;

  // Events
  root.querySelector('#inv-btn-new')?.addEventListener('click', () => { _invView = 'new'; _newInvType = ''; renderInv(); });
  root.querySelector('#inv-btn-new-empty')?.addEventListener('click', () => { _invView = 'new'; _newInvType = ''; renderInv(); });

  root.querySelector('#inv-filter-select')?.addEventListener('change', e => { _invFilter = e.target.value; renderInv(); });
  root.querySelector('#inv-search-input')?.addEventListener('input', e => { _invSearch = e.target.value; renderInv(); });

  // Card events (open / fav / actions)
  root.querySelectorAll('.inv-card-open-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.closest('[data-inv-id]')?.dataset.invId;
      if (id) openWorkspace(id);
    });
  });
  root.querySelectorAll('.inv-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      const id = card.dataset.invId;
      if (id) openWorkspace(id);
    });
  });
  root.querySelectorAll('.inv-card-fav-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.closest('[data-inv-id]')?.dataset.invId;
      if (!id) return;
      const inv = getInv(id);
      if (!inv) return;
      updateInv(id, { favorite: !inv.favorite });
      renderInv();
    });
  });
  root.querySelectorAll('.inv-card-menu-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const id = btn.closest('[data-inv-id]')?.dataset.invId;
      const action = btn.dataset.action;
      if (!id || !action) return;
      handleInvAction(id, action);
    });
  });
}

function invCardHTML(inv) {
  const findings  = (inv.findings  || []).length;
  const sources   = (inv.sources   || []).length;
  const notes     = (inv.caseNotes || []).length;
  const followUps = (inv.followUps || []).filter(f => f.status === 'Open').length;
  const typeObj   = INV_TYPES.find(t => t.id === inv.type) || { icon: '🔍', label: 'General' };

  return `
    <div class="inv-card" data-inv-id="${esc(inv.id)}">
      <div class="inv-card-main">
        <div class="inv-card-name">
          ${typeObj.icon} ${esc(inv.name)}
          ${inv.favorite ? '<span title="Favourite" style="color:#f0b429">⭐</span>' : ''}
        </div>
        <div class="inv-card-meta">
          <span class="inv-status-badge ${statusClass(inv.status)}">${esc(inv.status)}</span>
          ${inv.subject ? '<span>' + esc(inv.subject) + (inv.subjectType ? ' (' + esc(inv.subjectType) + ')' : '') + '</span>' : ''}
          ${inv.reference ? '<span>Ref: ' + esc(inv.reference) + '</span>' : ''}
        </div>
        <div class="inv-card-counts">
          <span class="inv-card-count-pill"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>${findings} findings</span>
          <span class="inv-card-count-pill"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h8M4 18h4"/></svg>${sources} sources</span>
          <span class="inv-card-count-pill"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg>${notes} notes</span>
          ${followUps > 0 ? `<span class="inv-card-count-pill" style="color:var(--accent)">${followUps} open tasks</span>` : ''}
        </div>
        <div class="inv-date-meta" style="margin-top:3px">Updated: ${fmtDate(inv.updated || inv.created)}</div>
      </div>
      <div class="inv-card-actions">
        <button class="inv-card-open-btn" data-inv-id="${esc(inv.id)}">Open →</button>
        <button class="inv-card-fav-btn ${inv.favorite ? 'active' : ''}" title="${inv.favorite ? 'Remove favourite' : 'Add favourite'}">⭐</button>
        <button class="inv-card-menu-btn inv-btn inv-btn-sm inv-btn-ghost" data-action="duplicate" title="Duplicate">⧉</button>
        ${inv.status !== 'Archived'
          ? `<button class="inv-card-menu-btn inv-btn inv-btn-sm inv-btn-ghost" data-action="archive" title="Archive">📁</button>`
          : `<button class="inv-card-menu-btn inv-btn inv-btn-sm inv-btn-ghost" data-action="restore" title="Restore">♻</button>`}
        <button class="inv-card-menu-btn inv-btn inv-btn-sm inv-btn-danger" data-action="delete" title="Delete">✕</button>
      </div>
    </div>`;
}

function handleInvAction(id, action) {
  if (action === 'duplicate') {
    const inv = getInv(id);
    if (!inv) return;
    const all = loadInvestigations();
    const copy = JSON.parse(JSON.stringify(inv));
    copy.id = uuidV33();
    copy.name = inv.name + ' (Copy)';
    copy.created = new Date().toISOString();
    copy.updated = new Date().toISOString();
    copy.favorite = false;
    all.push(copy);
    saveInvestigations(all);
    showInvToast('Investigation duplicated.', 'success');
    renderInv();
  } else if (action === 'archive') {
    updateInv(id, { status: 'Archived' });
    showInvToast('Investigation archived.', 'success');
    renderInv();
  } else if (action === 'restore') {
    updateInv(id, { status: 'Active' });
    showInvToast('Investigation restored.', 'success');
    renderInv();
  } else if (action === 'delete') {
    openDeleteModal(id);
  }
}

/* ════════════════════════════════════════════════════════════
   NEW / EDIT FORM
   ════════════════════════════════════════════════════════════ */

function renderInvForm(root, inv) {
  const isEdit = !!inv;
  const v = (field, def) => inv ? (inv[field] || def || '') : (def || '');

  const typeGrid = INV_TYPES.map(t => `
    <button class="inv-type-btn${_newInvType === t.id || (isEdit && !_newInvType && inv.type === t.id) ? ' selected' : ''}" data-type="${t.id}">
      <span class="inv-type-icon">${t.icon}</span>
      ${esc(t.label)}
    </button>`).join('');

  const statusOpts = INV_STATUSES.filter(s => s !== 'Archived').map(s =>
    `<option value="${s}" ${v('status','Planning') === s ? 'selected' : ''}>${s}</option>`
  ).join('');

  const subjectOpts = SUBJECT_TYPES.map(s =>
    `<option value="${s}" ${v('subjectType') === s ? 'selected' : ''}>${s}</option>`
  ).join('');

  root.innerHTML = `
    <div class="inv-topbar">
      <div class="inv-topbar-title">
        ${isEdit ? '✏️ EDIT INVESTIGATION' : '+ NEW INVESTIGATION'}
      </div>
      <button class="inv-btn inv-btn-ghost" id="inv-form-cancel">← Back</button>
    </div>
    <div class="inv-form-wrap">
      <div class="inv-privacy-note">
        🔒 All data stored locally on this device — nothing transmitted externally.
      </div>

      <div style="margin-top:14px">
        <div class="inv-form-label">Investigation Type <span style="color:var(--accent)">*</span></div>
        <div class="inv-type-grid" id="inv-type-grid">${typeGrid}</div>
      </div>

      <div class="inv-form-grid" style="margin-top:14px">

        <div class="inv-form-full">
          <label class="inv-form-label">Investigation Name <span style="color:var(--accent)">*</span></label>
          <input type="text" id="inv-f-name" class="inv-form-input" placeholder="e.g. John Doe Background Check" value="${esc(v('name'))}" />
        </div>

        <div>
          <label class="inv-form-label">Subject Name</label>
          <input type="text" id="inv-f-subject" class="inv-form-input" placeholder="Full name, company, etc." value="${esc(v('subject'))}" />
        </div>

        <div>
          <label class="inv-form-label">Subject Type</label>
          <select id="inv-f-subjectType" class="inv-form-input">
            <option value="">— select —</option>
            ${subjectOpts}
          </select>
        </div>

        <div>
          <label class="inv-form-label">Reference / Case Number</label>
          <input type="text" id="inv-f-reference" class="inv-form-input" placeholder="Optional case reference" value="${esc(v('reference'))}" />
        </div>

        <div>
          <label class="inv-form-label">Investigator</label>
          <input type="text" id="inv-f-investigator" class="inv-form-input" placeholder="Name or initials" value="${esc(v('investigator'))}" />
        </div>

        <div>
          <label class="inv-form-label">Status</label>
          <select id="inv-f-status" class="inv-form-input">
            ${statusOpts}
          </select>
        </div>

        <div>
          <label class="inv-form-label">Date Created</label>
          <input type="date" id="inv-f-date" class="inv-form-input" value="${(v('created','') || '').slice(0,10) || new Date().toISOString().slice(0,10)}" />
        </div>

        <div class="inv-form-full">
          <label class="inv-form-label">Objective</label>
          <textarea id="inv-f-objective" class="inv-form-input inv-form-textarea" placeholder="What is the goal of this investigation?">${esc(v('objective'))}</textarea>
        </div>

        <div class="inv-form-full">
          <label class="inv-form-label">Initial Notes</label>
          <textarea id="inv-f-notes" class="inv-form-input inv-form-textarea" placeholder="Any initial context or notes…">${esc(v('notes'))}</textarea>
        </div>

      </div>

      <div class="inv-form-actions">
        <button class="inv-btn inv-btn-ghost" id="inv-form-cancel2">Cancel</button>
        <button class="inv-btn inv-btn-primary" id="inv-form-save">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          ${isEdit ? 'Save Changes' : 'Create Investigation'}
        </button>
      </div>
    </div>`;

  // Type selection
  _newInvType = isEdit ? (inv.type || '') : _newInvType;
  root.querySelectorAll('.inv-type-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      _newInvType = btn.dataset.type;
      root.querySelectorAll('.inv-type-btn').forEach(b => b.classList.toggle('selected', b.dataset.type === _newInvType));
    });
  });

  const cancelFn = () => {
    _invView = 'dashboard';
    _newInvType = '';
    renderInv();
  };
  root.querySelector('#inv-form-cancel')?.addEventListener('click', cancelFn);
  root.querySelector('#inv-form-cancel2')?.addEventListener('click', cancelFn);

  root.querySelector('#inv-form-save')?.addEventListener('click', () => {
    const name = root.querySelector('#inv-f-name').value.trim();
    if (!name) {
      root.querySelector('#inv-f-name').classList.add('error');
      root.querySelector('#inv-f-name').focus();
      showInvToast('Investigation name is required.', 'error');
      return;
    }
    if (!_newInvType && !isEdit) {
      showInvToast('Please select an investigation type.', 'error');
      return;
    }

    const dateVal = root.querySelector('#inv-f-date').value;
    const created = dateVal ? new Date(dateVal).toISOString() : new Date().toISOString();

    if (isEdit) {
      updateInv(inv.id, {
        name,
        type: _newInvType || inv.type,
        subject:     root.querySelector('#inv-f-subject').value.trim(),
        subjectType: root.querySelector('#inv-f-subjectType').value,
        reference:   root.querySelector('#inv-f-reference').value.trim(),
        investigator:root.querySelector('#inv-f-investigator').value.trim(),
        status:      root.querySelector('#inv-f-status').value,
        objective:   root.querySelector('#inv-f-objective').value.trim(),
        notes:       root.querySelector('#inv-f-notes').value.trim(),
        created,
      });
      showInvToast('Investigation updated.', 'success');
      _invView = 'workspace';
      renderInv();
    } else {
      const all = loadInvestigations();
      const newInv = {
        id: uuidV33(),
        name,
        type:        _newInvType || 'general',
        subject:     root.querySelector('#inv-f-subject').value.trim(),
        subjectType: root.querySelector('#inv-f-subjectType').value,
        reference:   root.querySelector('#inv-f-reference').value.trim(),
        investigator:root.querySelector('#inv-f-investigator').value.trim(),
        status:      root.querySelector('#inv-f-status').value || 'Planning',
        objective:   root.querySelector('#inv-f-objective').value.trim(),
        notes:       root.querySelector('#inv-f-notes').value.trim(),
        created,
        updated:     created,
        favorite:    false,
        findings:    [],
        sources:     [],
        timeline:    [],
        caseNotes:   [],
        searches:    [],
        resources:   [],
        followUps:   [],
      };
      all.push(newInv);
      saveInvestigations(all);
      _currentInvId = newInv.id;
      _wsTab = 'overview';
      _invView = 'workspace';
      _newInvType = '';
      showInvToast('Investigation created.', 'success');
      renderInv();
    }
  });
}

/* ════════════════════════════════════════════════════════════
   WORKSPACE
   ════════════════════════════════════════════════════════════ */

function openWorkspace(id) {
  _currentInvId = id;
  _wsTab = 'overview';
  _invView = 'workspace';
  _addingItem = '';
  renderInv();
}

function renderInvWorkspace(root) {
  const inv = getInv(_currentInvId);
  if (!inv) {
    _invView = 'dashboard';
    renderInv();
    return;
  }

  const typeObj = INV_TYPES.find(t => t.id === inv.type) || { icon: '🔍', label: 'General' };

  const wsTabs = [
    { id:'overview',  label:'Overview' },
    { id:'findings',  label:`Findings (${(inv.findings||[]).length})` },
    { id:'sources',   label:`Sources (${(inv.sources||[]).length})` },
    { id:'timeline',  label:`Timeline (${(inv.timeline||[]).length})` },
    { id:'notes',     label:`Notes (${(inv.caseNotes||[]).length})` },
    { id:'searches',  label:`Search Log (${(inv.searches||[]).length})` },
    { id:'resources', label:`Resources (${(inv.resources||[]).length})` },
    { id:'reports',   label:'Export' },
  ];

  const tabNav = wsTabs.map(t =>
    `<button class="inv-ws-tab${_wsTab===t.id?' active':''}" data-ws-tab="${t.id}">${t.label}</button>`
  ).join('');

  root.innerHTML = `
    <div class="inv-ws-header">
      <div class="inv-ws-breadcrumb">
        <button id="inv-ws-back">← Investigations</button>
        <span>/</span>
        <span>${esc(inv.name)}</span>
      </div>
      <div class="inv-ws-title-row">
        <div>
          <div class="inv-ws-name">${typeObj.icon} ${esc(inv.name)}</div>
          ${inv.subject ? `<div class="inv-ws-subject">${esc(inv.subject)}${inv.subjectType ? ' · ' + esc(inv.subjectType) : ''}${inv.reference ? ' · Ref: ' + esc(inv.reference) : ''}</div>` : ''}
        </div>
        <div class="inv-ws-actions">
          <span class="inv-status-badge ${statusClass(inv.status)}">${esc(inv.status)}</span>
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="inv-ws-edit">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit
          </button>
        </div>
      </div>
    </div>
    <div class="inv-ws-tabs" id="inv-ws-tabs">${tabNav}</div>
    <div id="inv-ws-pane-content"></div>`;

  root.querySelector('#inv-ws-back')?.addEventListener('click', () => {
    _invView = 'dashboard';
    _addingItem = '';
    renderInv();
  });
  root.querySelector('#inv-ws-edit')?.addEventListener('click', () => {
    _invView = 'edit';
    renderInv();
  });
  root.querySelectorAll('.inv-ws-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      _wsTab = btn.dataset.wsTab;
      _addingItem = '';
      renderInv();
    });
  });

  renderWsPane(inv);
}

function renderWsPane(inv) {
  const pane = document.getElementById('inv-ws-pane-content');
  if (!pane) return;

  const tabs = {
    overview:  renderWsOverview,
    findings:  renderWsFindings,
    sources:   renderWsSources,
    timeline:  renderWsTimeline,
    notes:     renderWsNotes,
    searches:  renderWsSearches,
    resources: renderWsResources,
    reports:   renderWsReports,
  };

  const fn = tabs[_wsTab];
  if (fn) fn(pane, inv);
}

/* ── OVERVIEW ─────────────────────────────────────────────── */

function renderWsOverview(pane, inv) {
  const findings  = (inv.findings  || []).length;
  const verified  = (inv.findings  || []).filter(f => f.confidence === 'Verified').length;
  const sources   = (inv.sources   || []).length;
  const timeline  = (inv.timeline  || []).length;
  const notes     = (inv.caseNotes || []).length;
  const openTasks = (inv.followUps || []).filter(f => f.status === 'Open').length;
  const searches  = (inv.searches  || []).length;
  const typeObj   = INV_TYPES.find(t => t.id === inv.type) || { label: 'General OSINT' };
  const workflow  = INV_TYPE_WORKFLOWS[inv.type] || INV_TYPE_WORKFLOWS.general;

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-overview-stats">
        <div class="inv-stat-mini">
          <div class="inv-stat-mini-num">${findings}</div>
          <div class="inv-stat-mini-label">Findings</div>
        </div>
        <div class="inv-stat-mini">
          <div class="inv-stat-mini-num" style="color:#4caf83">${verified}</div>
          <div class="inv-stat-mini-label">Verified</div>
        </div>
        <div class="inv-stat-mini">
          <div class="inv-stat-mini-num" style="color:#7090ff">${sources}</div>
          <div class="inv-stat-mini-label">Sources</div>
        </div>
        <div class="inv-stat-mini">
          <div class="inv-stat-mini-num" style="color:#f0b429">${openTasks}</div>
          <div class="inv-stat-mini-label">Open Tasks</div>
        </div>
      </div>

      <div class="inv-overview-grid">
        <div class="inv-overview-card">
          <div class="inv-overview-card-label">Subject</div>
          <div class="inv-overview-card-value">${esc(inv.subject || '—')}</div>
        </div>
        <div class="inv-overview-card">
          <div class="inv-overview-card-label">Subject Type</div>
          <div class="inv-overview-card-value">${esc(inv.subjectType || '—')}</div>
        </div>
        <div class="inv-overview-card">
          <div class="inv-overview-card-label">Investigation Type</div>
          <div class="inv-overview-card-value">${esc(typeObj.label)}</div>
        </div>
        <div class="inv-overview-card">
          <div class="inv-overview-card-label">Status</div>
          <div class="inv-overview-card-value">
            <select id="inv-ov-status" class="inv-form-input" style="padding:4px 8px;font-size:0.78rem">
              ${INV_STATUSES.map(s => `<option value="${s}" ${inv.status === s ? 'selected' : ''}>${s}</option>`).join('')}
            </select>
          </div>
        </div>
        ${inv.reference ? `<div class="inv-overview-card"><div class="inv-overview-card-label">Reference</div><div class="inv-overview-card-value">${esc(inv.reference)}</div></div>` : ''}
        ${inv.investigator ? `<div class="inv-overview-card"><div class="inv-overview-card-label">Investigator</div><div class="inv-overview-card-value">${esc(inv.investigator)}</div></div>` : ''}
        <div class="inv-overview-card">
          <div class="inv-overview-card-label">Created</div>
          <div class="inv-overview-card-value inv-date-meta">${fmtDate(inv.created)}</div>
        </div>
        <div class="inv-overview-card">
          <div class="inv-overview-card-label">Last Updated</div>
          <div class="inv-overview-card-value inv-date-meta">${fmtDate(inv.updated)}</div>
        </div>
      </div>

      ${inv.objective ? `
        <div class="inv-overview-card" style="margin-bottom:12px">
          <div class="inv-overview-card-label">Objective</div>
          <div class="inv-overview-card-value" style="white-space:pre-wrap;line-height:1.5;font-size:0.8rem">${esc(inv.objective)}</div>
        </div>` : ''}

      ${inv.notes ? `
        <div class="inv-overview-card" style="margin-bottom:12px">
          <div class="inv-overview-card-label">Initial Notes</div>
          <div class="inv-overview-card-value" style="white-space:pre-wrap;line-height:1.5;font-size:0.8rem">${esc(inv.notes)}</div>
        </div>` : ''}

      <div class="inv-pane-title" style="margin-bottom:10px">📋 ${esc(typeObj.label)} WORKFLOW GUIDE</div>
      <div class="inv-workflow-steps">
        ${workflow.map((step, i) => `
          <div class="inv-workflow-step">
            <div class="inv-workflow-step-num">${i+1}</div>
            <div>
              <div class="inv-workflow-step-title">${esc(step)}</div>
            </div>
          </div>`).join('')}
      </div>

      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap">
        <button class="inv-btn inv-btn-primary inv-btn-sm" data-goto-ws="findings">+ Add Finding</button>
        <button class="inv-btn inv-btn-ghost inv-btn-sm" data-goto-ws="sources">+ Add Source</button>
        <button class="inv-btn inv-btn-ghost inv-btn-sm" data-goto-ws="timeline">+ Add Timeline Event</button>
        <button class="inv-btn inv-btn-ghost inv-btn-sm" data-goto-ws="notes">+ Add Note</button>
      </div>
    </div>`;

  pane.querySelector('#inv-ov-status')?.addEventListener('change', e => {
    updateInv(inv.id, { status: e.target.value });
    renderInv();
  });

  pane.querySelectorAll('[data-goto-ws]').forEach(btn => {
    btn.addEventListener('click', () => {
      _wsTab = btn.dataset.gotoWs;
      _addingItem = btn.dataset.gotoWs;
      renderInv();
    });
  });
}

/* ── FINDINGS ─────────────────────────────────────────────── */

function renderWsFindings(pane, inv) {
  const findings = inv.findings || [];

  let formHTML = '';
  if (_addingItem === 'findings' || _addingItem === 'findings-edit') {
    const ef = _addingItem === 'findings-edit' ? findings.find(f => f.id === _editItemId) : null;
    const tags = ef ? [...(ef.tags || [])] : [..._newFindingTags];

    formHTML = `
      <div class="inv-inline-form" id="finding-form">
        <div class="inv-pane-header"><div class="inv-pane-title">${ef ? '✏️ Edit Finding' : '+ New Finding'}</div></div>
        <div class="inv-inline-form-grid">
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Title <span style="color:var(--accent)">*</span></label>
            <input type="text" id="ff-title" class="inv-form-input" placeholder="Finding title" value="${esc(ef?.title||'')}" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Description</label>
            <textarea id="ff-desc" class="inv-form-input inv-form-textarea" style="min-height:56px" placeholder="What was found?">${esc(ef?.description||'')}</textarea>
          </div>
          <div>
            <label class="inv-inline-label">Source</label>
            <input type="text" id="ff-source" class="inv-form-input" placeholder="Where found" value="${esc(ef?.source||'')}" />
          </div>
          <div>
            <label class="inv-inline-label">URL</label>
            <input type="url" id="ff-url" class="inv-form-input" placeholder="https://…" value="${esc(ef?.url||'')}" />
          </div>
          <div>
            <label class="inv-inline-label">Date</label>
            <input type="date" id="ff-date" class="inv-form-input" value="${esc(ef?.date||'')}" />
          </div>
          <div>
            <label class="inv-inline-label">Confidence</label>
            <select id="ff-confidence" class="inv-form-input">
              ${CONFIDENCE_LEVELS.map(c => `<option value="${c}" ${(ef?.confidence||'Unknown')===c?'selected':''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Tags</label>
            <div class="tag-input-wrap" id="ff-tag-wrap">
              ${tags.map(t => `<span class="inv-tag">${esc(t)}<button class="inv-tag-rm" data-tag="${esc(t)}">✕</button></span>`).join('')}
              <input type="text" id="ff-tag-input" class="tag-input-field" placeholder="Add tag…" />
            </div>
            <div class="tag-suggestions" id="ff-tag-suggestions">
              ${PREDEFINED_TAGS.filter(t => !tags.includes(t)).slice(0,10).map(t => `<span class="tag-suggestion">${esc(t)}</span>`).join('')}
            </div>
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Notes</label>
            <textarea id="ff-notes" class="inv-form-input inv-form-textarea" style="min-height:44px" placeholder="Additional notes…">${esc(ef?.notes||'')}</textarea>
          </div>
        </div>
        <div class="inv-form-actions" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="ff-cancel">Cancel</button>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="ff-save">${ef ? 'Save Changes' : 'Add Finding'}</button>
        </div>
      </div>`;
  }

  const filterConf = (_addingItem === 'findings-filter') ? _editItemId : '';

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">🔎 FINDINGS</div>
        <button class="inv-btn inv-btn-primary inv-btn-sm" id="btn-add-finding">+ Add Finding</button>
      </div>
      ${formHTML}
      <div id="findings-list">
        ${findings.length === 0
          ? `<div class="inv-empty-state"><div class="inv-empty-icon">🔎</div><div class="inv-empty-title">No Findings Yet</div><div class="inv-empty-desc">Record what you discover during your investigation.</div></div>`
          : findings.map(f => findingCardHTML(f)).join('')}
      </div>
    </div>`;

  pane.querySelector('#btn-add-finding')?.addEventListener('click', () => {
    _addingItem = 'findings';
    _newFindingTags = [];
    renderInv();
  });
  pane.querySelector('#ff-cancel')?.addEventListener('click', () => { _addingItem = ''; _editItemId = null; renderInv(); });

  // Tag input handling
  setupTagInput(pane, '#ff-tag-input', '#ff-tag-wrap', '#ff-tag-suggestions',
    _addingItem === 'findings-edit' ? (findings.find(f=>f.id===_editItemId)?.tags||[]) : _newFindingTags);

  pane.querySelector('#ff-save')?.addEventListener('click', () => {
    const title = pane.querySelector('#ff-title')?.value.trim();
    if (!title) { showInvToast('Title is required.', 'error'); return; }

    const tags = [...pane.querySelectorAll('#ff-tag-wrap .inv-tag')].map(el => el.textContent.replace('✕','').trim()).filter(Boolean);

    if (_addingItem === 'findings-edit') {
      const all = loadInvestigations();
      const idx = all.findIndex(i => i.id === inv.id);
      if (idx !== -1) {
        const fi = all[idx].findings.findIndex(f => f.id === _editItemId);
        if (fi !== -1) {
          all[idx].findings[fi] = {
            ...all[idx].findings[fi],
            title,
            description: pane.querySelector('#ff-desc')?.value.trim() || '',
            source:      pane.querySelector('#ff-source')?.value.trim() || '',
            url:         pane.querySelector('#ff-url')?.value.trim() || '',
            date:        pane.querySelector('#ff-date')?.value || '',
            confidence:  pane.querySelector('#ff-confidence')?.value || 'Unknown',
            tags,
            notes:       pane.querySelector('#ff-notes')?.value.trim() || '',
          };
          all[idx].updated = new Date().toISOString();
          saveInvestigations(all);
        }
      }
      showInvToast('Finding updated.', 'success');
    } else {
      const all = loadInvestigations();
      const idx = all.findIndex(i => i.id === inv.id);
      if (idx !== -1) {
        const newFinding = {
          id:          nextFindingId(all[idx]),
          title,
          description: pane.querySelector('#ff-desc')?.value.trim() || '',
          source:      pane.querySelector('#ff-source')?.value.trim() || '',
          url:         pane.querySelector('#ff-url')?.value.trim() || '',
          date:        pane.querySelector('#ff-date')?.value || '',
          confidence:  pane.querySelector('#ff-confidence')?.value || 'Unknown',
          tags,
          notes:       pane.querySelector('#ff-notes')?.value.trim() || '',
          created:     new Date().toISOString(),
        };
        all[idx].findings.push(newFinding);
        all[idx].updated = new Date().toISOString();
        saveInvestigations(all);
      }
      showInvToast('Finding added.', 'success');
    }
    _addingItem = '';
    _editItemId = null;
    _newFindingTags = [];
    renderInv();
  });

  // Edit / delete buttons on finding cards
  pane.querySelectorAll('.finding-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      _addingItem = 'findings-edit';
      _editItemId = btn.dataset.fid;
      renderInv();
    });
  });
  pane.querySelectorAll('.finding-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openDeleteItemModal('finding', btn.dataset.fid, inv.id);
    });
  });
}

function findingCardHTML(f) {
  const confClass = { Unknown:'conf-unknown', Low:'conf-low', Medium:'conf-medium', High:'conf-high', Verified:'conf-verified' };
  return `
    <div class="finding-card">
      <div class="finding-card-header">
        <span class="finding-card-id">${esc(f.id)}</span>
        <span class="finding-card-title">${esc(f.title)}</span>
        <div class="finding-card-actions">
          <span class="conf-badge ${confClass[f.confidence]||'conf-unknown'}">${esc(f.confidence||'Unknown')}</span>
          <button class="finding-mini-btn finding-edit-btn" data-fid="${esc(f.id)}" title="Edit">✏️</button>
          <button class="finding-mini-btn finding-delete-btn delete" data-fid="${esc(f.id)}" title="Delete">✕</button>
        </div>
      </div>
      ${f.description ? `<div class="finding-card-desc">${esc(f.description)}</div>` : ''}
      <div class="finding-card-footer">
        ${f.url ? `<a href="${esc(f.url)}" target="_blank" rel="noopener" class="finding-url-link" title="${esc(f.url)}">${esc(f.url.replace(/^https?:\/\//,''))}</a>` : ''}
        ${f.source ? `<span style="font-size:0.7rem;color:var(--text-dim)">via ${esc(f.source)}</span>` : ''}
        ${f.date ? `<span class="inv-date-meta">${esc(f.date)}</span>` : ''}
      </div>
      ${(f.tags||[]).length > 0 ? `<div class="tag-wrap">${f.tags.map(t=>`<span class="inv-tag">${esc(t)}</span>`).join('')}</div>` : ''}
      ${f.notes ? `<div style="font-size:0.72rem;color:var(--text-dim);margin-top:5px;font-style:italic">${esc(f.notes)}</div>` : ''}
    </div>`;
}

function setupTagInput(pane, inputSel, wrapSel, sugSel, tagArray) {
  const input = pane.querySelector(inputSel);
  const wrap  = pane.querySelector(wrapSel);
  const sugEl = pane.querySelector(sugSel);
  if (!input || !wrap) return;

  const addTag = (tag) => {
    tag = tag.trim();
    if (!tag || tagArray.includes(tag)) return;
    tagArray.push(tag);
    reRenderTagsInWrap();
    if (sugEl) refreshSuggestions();
  };

  const reRenderTagsInWrap = () => {
    wrap.querySelectorAll('.inv-tag').forEach(el => el.remove());
    tagArray.forEach(t => {
      const span = document.createElement('span');
      span.className = 'inv-tag';
      span.innerHTML = `${esc(t)}<button class="inv-tag-rm" data-tag="${esc(t)}">✕</button>`;
      span.querySelector('.inv-tag-rm').addEventListener('click', () => {
        const i = tagArray.indexOf(t);
        if (i !== -1) tagArray.splice(i, 1);
        reRenderTagsInWrap();
        if (sugEl) refreshSuggestions();
      });
      wrap.insertBefore(span, input);
    });
  };

  const refreshSuggestions = () => {
    if (!sugEl) return;
    sugEl.innerHTML = PREDEFINED_TAGS.filter(t => !tagArray.includes(t)).slice(0,10)
      .map(t => `<span class="tag-suggestion">${esc(t)}</span>`).join('');
    sugEl.querySelectorAll('.tag-suggestion').forEach(s => {
      s.addEventListener('click', () => addTag(s.textContent));
    });
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(input.value);
      input.value = '';
    } else if (e.key === 'Backspace' && !input.value && tagArray.length > 0) {
      tagArray.pop();
      reRenderTagsInWrap();
      if (sugEl) refreshSuggestions();
    }
  });

  wrap.querySelectorAll('.inv-tag-rm').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.dataset.tag;
      const i = tagArray.indexOf(t);
      if (i !== -1) tagArray.splice(i, 1);
      reRenderTagsInWrap();
      if (sugEl) refreshSuggestions();
    });
  });

  if (sugEl) {
    sugEl.querySelectorAll('.tag-suggestion').forEach(s => {
      s.addEventListener('click', () => addTag(s.textContent));
    });
  }

  wrap.addEventListener('click', () => input.focus());
}

/* ── SOURCES ─────────────────────────────────────────────── */

function renderWsSources(pane, inv) {
  const sources = inv.sources || [];

  let formHTML = '';
  if (_addingItem === 'sources' || _addingItem === 'sources-edit') {
    const es = _addingItem === 'sources-edit' ? sources.find(s => s.id === _editItemId) : null;
    formHTML = `
      <div class="inv-inline-form">
        <div class="inv-pane-header"><div class="inv-pane-title">${es ? '✏️ Edit Source' : '+ New Source'}</div></div>
        <div class="inv-inline-form-grid">
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Source Name <span style="color:var(--accent)">*</span></label>
            <input type="text" id="sf-name" class="inv-form-input" placeholder="e.g. CanLII, CBC News, WHOIS record" value="${esc(es?.name||'')}" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">URL</label>
            <input type="url" id="sf-url" class="inv-form-input" placeholder="https://…" value="${esc(es?.url||'')}" />
          </div>
          <div>
            <label class="inv-inline-label">Source Type</label>
            <select id="sf-type" class="inv-form-input">
              ${SOURCE_TYPES.map(t => `<option value="${t}" ${(es?.type||'Website')===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="inv-inline-label">Date Accessed</label>
            <input type="date" id="sf-date" class="inv-form-input" value="${esc(es?.dateAccessed || new Date().toISOString().slice(0,10))}" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Notes</label>
            <textarea id="sf-notes" class="inv-form-input inv-form-textarea" style="min-height:44px" placeholder="Notes about this source…">${esc(es?.notes||'')}</textarea>
          </div>
        </div>
        <div class="inv-form-actions" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="sf-cancel">Cancel</button>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="sf-save">${es ? 'Save Changes' : 'Add Source'}</button>
        </div>
      </div>`;
  }

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">📋 SOURCES</div>
        <button class="inv-btn inv-btn-primary inv-btn-sm" id="btn-add-source">+ Add Source</button>
      </div>
      ${formHTML}
      <div id="sources-list">
        ${sources.length === 0
          ? `<div class="inv-empty-state"><div class="inv-empty-icon">📋</div><div class="inv-empty-title">No Sources Yet</div><div class="inv-empty-desc">Document where your information comes from.</div></div>`
          : sources.map(sourceCardHTML).join('')}
      </div>
    </div>`;

  pane.querySelector('#btn-add-source')?.addEventListener('click', () => { _addingItem = 'sources'; renderInv(); });
  pane.querySelector('#sf-cancel')?.addEventListener('click', () => { _addingItem = ''; _editItemId = null; renderInv(); });
  pane.querySelector('#sf-save')?.addEventListener('click', () => {
    const name = pane.querySelector('#sf-name')?.value.trim();
    if (!name) { showInvToast('Source name is required.', 'error'); return; }
    const entry = {
      name,
      url:          pane.querySelector('#sf-url')?.value.trim() || '',
      type:         pane.querySelector('#sf-type')?.value || 'Website',
      dateAccessed: pane.querySelector('#sf-date')?.value || '',
      notes:        pane.querySelector('#sf-notes')?.value.trim() || '',
    };
    const all = loadInvestigations();
    const idx = all.findIndex(i => i.id === inv.id);
    if (idx === -1) return;
    if (_addingItem === 'sources-edit') {
      const si = all[idx].sources.findIndex(s => s.id === _editItemId);
      if (si !== -1) all[idx].sources[si] = { ...all[idx].sources[si], ...entry };
      showInvToast('Source updated.', 'success');
    } else {
      all[idx].sources.push({ id: shortId(), created: new Date().toISOString(), ...entry });
      showInvToast('Source added.', 'success');
    }
    all[idx].updated = new Date().toISOString();
    saveInvestigations(all);
    _addingItem = ''; _editItemId = null; renderInv();
  });
  pane.querySelectorAll('.source-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); _addingItem='sources-edit'; _editItemId=btn.dataset.sid; renderInv(); });
  });
  pane.querySelectorAll('.source-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDeleteItemModal('source', btn.dataset.sid, inv.id); });
  });
}

function sourceCardHTML(s) {
  return `
    <div class="source-card">
      <div class="source-card-header">
        <span class="source-card-name">${esc(s.name)}</span>
        <span class="source-type-badge">${esc(s.type||'Website')}</span>
        <button class="finding-mini-btn source-edit-btn" data-sid="${esc(s.id)}" title="Edit">✏️</button>
        <button class="finding-mini-btn source-delete-btn delete" data-sid="${esc(s.id)}" title="Delete">✕</button>
      </div>
      ${s.url ? `<a href="${esc(s.url)}" target="_blank" rel="noopener" class="source-card-url" title="${esc(s.url)}">${esc(s.url)}</a>` : ''}
      <div class="source-card-meta">
        ${s.dateAccessed ? `<span>Accessed: ${esc(s.dateAccessed)}</span>` : ''}
        ${s.notes ? `<span style="font-style:italic">${esc(s.notes)}</span>` : ''}
      </div>
    </div>`;
}

/* ── TIMELINE ─────────────────────────────────────────────── */

function renderWsTimeline(pane, inv) {
  const events = [...(inv.timeline || [])].sort((a,b) => {
    const da = new Date(a.date + (a.time ? 'T'+a.time : ''));
    const db = new Date(b.date + (b.time ? 'T'+b.time : ''));
    return da - db;
  });

  let formHTML = '';
  if (_addingItem === 'timeline' || _addingItem === 'timeline-edit') {
    const et = _addingItem === 'timeline-edit' ? (inv.timeline||[]).find(t => t.id === _editItemId) : null;
    const findingOpts = (inv.findings||[]).map(f => `<option value="${esc(f.id)}" ${(et?.relatedFinding||'')===f.id?'selected':''}>${esc(f.id)}: ${esc(f.title.slice(0,30))}</option>`).join('');
    formHTML = `
      <div class="inv-inline-form">
        <div class="inv-pane-header"><div class="inv-pane-title">${et ? '✏️ Edit Event' : '+ New Timeline Event'}</div></div>
        <div class="inv-inline-form-grid">
          <div>
            <label class="inv-inline-label">Date <span style="color:var(--accent)">*</span></label>
            <input type="date" id="tf-date" class="inv-form-input" value="${esc(et?.date||new Date().toISOString().slice(0,10))}" />
          </div>
          <div>
            <label class="inv-inline-label">Time</label>
            <input type="time" id="tf-time" class="inv-form-input" value="${esc(et?.time||'')}" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Title <span style="color:var(--accent)">*</span></label>
            <input type="text" id="tf-title" class="inv-form-input" placeholder="Event title" value="${esc(et?.title||'')}" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Description</label>
            <textarea id="tf-desc" class="inv-form-input inv-form-textarea" style="min-height:50px" placeholder="Event description…">${esc(et?.description||'')}</textarea>
          </div>
          <div>
            <label class="inv-inline-label">Source</label>
            <input type="text" id="tf-source" class="inv-form-input" placeholder="Information source" value="${esc(et?.source||'')}" />
          </div>
          ${findingOpts ? `<div><label class="inv-inline-label">Related Finding</label><select id="tf-finding" class="inv-form-input"><option value="">None</option>${findingOpts}</select></div>` : ''}
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Notes</label>
            <textarea id="tf-notes" class="inv-form-input inv-form-textarea" style="min-height:40px">${esc(et?.notes||'')}</textarea>
          </div>
        </div>
        <div class="inv-form-actions" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="tf-cancel">Cancel</button>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="tf-save">${et ? 'Save Changes' : 'Add Event'}</button>
        </div>
      </div>`;
  }

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">📅 TIMELINE</div>
        <button class="inv-btn inv-btn-primary inv-btn-sm" id="btn-add-event">+ Add Event</button>
      </div>
      ${formHTML}
      <div id="timeline-list" class="${events.length>0?'timeline-list':''}">
        ${events.length === 0
          ? `<div class="inv-empty-state"><div class="inv-empty-icon">📅</div><div class="inv-empty-title">No Timeline Events</div><div class="inv-empty-desc">Build a chronological record of your investigation.</div></div>`
          : events.map(timelineItemHTML).join('')}
      </div>
    </div>`;

  pane.querySelector('#btn-add-event')?.addEventListener('click', () => { _addingItem='timeline'; renderInv(); });
  pane.querySelector('#tf-cancel')?.addEventListener('click', () => { _addingItem=''; _editItemId=null; renderInv(); });
  pane.querySelector('#tf-save')?.addEventListener('click', () => {
    const title = pane.querySelector('#tf-title')?.value.trim();
    const date  = pane.querySelector('#tf-date')?.value;
    if (!title || !date) { showInvToast('Date and title are required.', 'error'); return; }
    const entry = {
      title, date,
      time:           pane.querySelector('#tf-time')?.value || '',
      description:    pane.querySelector('#tf-desc')?.value.trim() || '',
      source:         pane.querySelector('#tf-source')?.value.trim() || '',
      relatedFinding: pane.querySelector('#tf-finding')?.value || '',
      notes:          pane.querySelector('#tf-notes')?.value.trim() || '',
    };
    const all = loadInvestigations();
    const idx = all.findIndex(i => i.id === inv.id);
    if (idx === -1) return;
    if (_addingItem === 'timeline-edit') {
      const ti = all[idx].timeline.findIndex(t => t.id === _editItemId);
      if (ti !== -1) all[idx].timeline[ti] = { ...all[idx].timeline[ti], ...entry };
      showInvToast('Event updated.', 'success');
    } else {
      all[idx].timeline.push({ id: shortId(), created: new Date().toISOString(), ...entry });
      showInvToast('Event added.', 'success');
    }
    all[idx].updated = new Date().toISOString();
    saveInvestigations(all);
    _addingItem = ''; _editItemId = null; renderInv();
  });
  pane.querySelectorAll('.timeline-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); _addingItem='timeline-edit'; _editItemId=btn.dataset.tid; renderInv(); });
  });
  pane.querySelectorAll('.timeline-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDeleteItemModal('timeline', btn.dataset.tid, inv.id); });
  });
}

function timelineItemHTML(t) {
  return `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-item-date">${esc(t.date)}${t.time?' '+esc(t.time):''}</div>
      <div class="timeline-item-title">${esc(t.title)}</div>
      ${t.description ? `<div class="timeline-item-desc">${esc(t.description)}</div>` : ''}
      ${t.source ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:2px">Source: ${esc(t.source)}</div>` : ''}
      ${t.relatedFinding ? `<div style="font-size:0.7rem;color:var(--accent);margin-top:2px">→ ${esc(t.relatedFinding)}</div>` : ''}
      <div class="timeline-item-actions">
        <button class="finding-mini-btn timeline-edit-btn" data-tid="${esc(t.id)}" title="Edit">✏️</button>
        <button class="finding-mini-btn timeline-delete-btn delete" data-tid="${esc(t.id)}" title="Delete">✕</button>
      </div>
    </div>`;
}

/* ── NOTES ─────────────────────────────────────────────── */

function renderWsNotes(pane, inv) {
  const notes = inv.caseNotes || [];

  let formHTML = '';
  if (_addingItem === 'notes' || _addingItem === 'notes-edit') {
    const en = _addingItem === 'notes-edit' ? notes.find(n => n.id === _editItemId) : null;
    formHTML = `
      <div class="inv-inline-form">
        <div class="inv-pane-header"><div class="inv-pane-title">${en ? '✏️ Edit Note' : '+ New Note'}</div></div>
        <div class="inv-inline-form-grid">
          <div>
            <label class="inv-inline-label">Note Type</label>
            <select id="nf-type" class="inv-form-input">
              ${NOTE_TYPES.map(t => `<option value="${t}" ${(en?.type||'General')===t?'selected':''}>${t}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="inv-inline-label">Associated With</label>
            <input type="text" id="nf-assoc" class="inv-form-input" placeholder="Finding ID, source name, etc." value="${esc(en?.associatedWith||'')}" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Note Content <span style="color:var(--accent)">*</span></label>
            <textarea id="nf-content" class="inv-form-input inv-form-textarea" style="min-height:80px" placeholder="Enter your note…">${esc(en?.content||'')}</textarea>
          </div>
        </div>
        <div class="inv-form-actions" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="nf-cancel">Cancel</button>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="nf-save">${en ? 'Save Changes' : 'Add Note'}</button>
        </div>
      </div>`;
  }

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">📝 NOTES</div>
        <button class="inv-btn inv-btn-primary inv-btn-sm" id="btn-add-note">+ Add Note</button>
      </div>
      ${formHTML}
      <div id="notes-list">
        ${notes.length === 0
          ? `<div class="inv-empty-state"><div class="inv-empty-icon">📝</div><div class="inv-empty-title">No Notes Yet</div><div class="inv-empty-desc">Document observations, hypotheses and follow-up questions.</div></div>`
          : notes.map(noteCardHTML).join('')}
      </div>
    </div>`;

  pane.querySelector('#btn-add-note')?.addEventListener('click', () => { _addingItem='notes'; renderInv(); });
  pane.querySelector('#nf-cancel')?.addEventListener('click', () => { _addingItem=''; _editItemId=null; renderInv(); });
  pane.querySelector('#nf-save')?.addEventListener('click', () => {
    const content = pane.querySelector('#nf-content')?.value.trim();
    if (!content) { showInvToast('Note content is required.', 'error'); return; }
    const entry = {
      type:           pane.querySelector('#nf-type')?.value || 'General',
      content,
      associatedWith: pane.querySelector('#nf-assoc')?.value.trim() || '',
      updated:        new Date().toISOString(),
    };
    const all = loadInvestigations();
    const idx = all.findIndex(i => i.id === inv.id);
    if (idx === -1) return;
    if (_addingItem === 'notes-edit') {
      const ni = all[idx].caseNotes.findIndex(n => n.id === _editItemId);
      if (ni !== -1) all[idx].caseNotes[ni] = { ...all[idx].caseNotes[ni], ...entry };
      showInvToast('Note updated.', 'success');
    } else {
      all[idx].caseNotes.push({ id: shortId(), created: new Date().toISOString(), ...entry });
      showInvToast('Note added.', 'success');
    }
    all[idx].updated = new Date().toISOString();
    saveInvestigations(all);
    _addingItem=''; _editItemId=null; renderInv();
  });
  pane.querySelectorAll('.note-edit-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); _addingItem='notes-edit'; _editItemId=btn.dataset.nid; renderInv(); });
  });
  pane.querySelectorAll('.note-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDeleteItemModal('note', btn.dataset.nid, inv.id); });
  });
}

function noteCardHTML(n) {
  const noteTypeClass = {
    General:'note-type-general', Research:'note-type-research', Question:'note-type-question',
    Hypothesis:'note-type-hypothesis', 'Follow-up':'note-type-follow-up'
  };
  return `
    <div class="note-card">
      <div class="note-card-header">
        <span class="note-type-badge ${noteTypeClass[n.type]||'note-type-general'}">${esc(n.type||'General')}</span>
        ${n.associatedWith ? `<span style="font-size:0.7rem;color:var(--text-dim)">→ ${esc(n.associatedWith)}</span>` : ''}
        <div style="margin-left:auto;display:flex;gap:4px">
          <button class="finding-mini-btn note-edit-btn" data-nid="${esc(n.id)}" title="Edit">✏️</button>
          <button class="finding-mini-btn note-delete-btn delete" data-nid="${esc(n.id)}" title="Delete">✕</button>
        </div>
      </div>
      <div class="note-card-content">${esc(n.content)}</div>
      <div class="note-card-meta">${fmtDateTime(n.updated || n.created)}</div>
    </div>`;
}

/* ── SEARCH LOG ─────────────────────────────────────────────── */

function renderWsSearches(pane, inv) {
  const searches = inv.searches || [];

  let formHTML = '';
  if (_addingItem === 'searches') {
    formHTML = `
      <div class="inv-inline-form">
        <div class="inv-pane-header"><div class="inv-pane-title">+ Log Search</div></div>
        <div class="inv-inline-form-grid">
          <div>
            <label class="inv-inline-label">Search Type</label>
            <input type="text" id="slg-type" class="inv-form-input" placeholder="e.g. Google, CanLII, WHOIS" />
          </div>
          <div>
            <label class="inv-inline-label">Source / Tool</label>
            <input type="text" id="slg-source" class="inv-form-input" placeholder="Tool or website used" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Query <span style="color:var(--accent)">*</span></label>
            <input type="text" id="slg-query" class="inv-form-input" placeholder="Exact search query used" />
          </div>
          <div>
            <label class="inv-inline-label">Date / Time</label>
            <input type="datetime-local" id="slg-datetime" class="inv-form-input" value="${new Date().toISOString().slice(0,16)}" />
          </div>
          <div>
            <label class="inv-inline-label">Result Summary</label>
            <input type="text" id="slg-result" class="inv-form-input" placeholder="Found, Not Found, Partial…" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Notes</label>
            <textarea id="slg-notes" class="inv-form-input inv-form-textarea" style="min-height:40px" placeholder="Additional notes…"></textarea>
          </div>
        </div>
        <div class="inv-form-actions" style="margin-top:10px;padding-top:8px;border-top:1px solid var(--border)">
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="slg-cancel">Cancel</button>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="slg-save">Log Search</button>
        </div>
      </div>`;
  }

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">🔍 SEARCH LOG</div>
        <button class="inv-btn inv-btn-primary inv-btn-sm" id="btn-add-search">+ Log Search</button>
      </div>
      ${formHTML}

      <div style="margin-bottom:10px">
        <div class="inv-pane-title" style="margin-bottom:8px">✅ FOLLOW-UP TASKS</div>
        ${renderFollowUpSection(inv)}
      </div>

      <hr class="inv-divider" />

      <div>
        ${searches.length === 0
          ? `<div class="inv-empty-state"><div class="inv-empty-icon">🔍</div><div class="inv-empty-title">No Searches Logged</div><div class="inv-empty-desc">Record every search query for your investigation record.</div></div>`
          : searches.map(searchLogCardHTML).join('')}
      </div>
    </div>`;

  pane.querySelector('#btn-add-search')?.addEventListener('click', () => { _addingItem='searches'; renderInv(); });
  pane.querySelector('#slg-cancel')?.addEventListener('click', () => { _addingItem=''; renderInv(); });
  pane.querySelector('#slg-save')?.addEventListener('click', () => {
    const query = pane.querySelector('#slg-query')?.value.trim();
    if (!query) { showInvToast('Query is required.', 'error'); return; }
    const entry = {
      id:       shortId(),
      type:     pane.querySelector('#slg-type')?.value.trim() || '',
      query,
      source:   pane.querySelector('#slg-source')?.value.trim() || '',
      datetime: pane.querySelector('#slg-datetime')?.value || new Date().toISOString().slice(0,16),
      result:   pane.querySelector('#slg-result')?.value.trim() || '',
      notes:    pane.querySelector('#slg-notes')?.value.trim() || '',
    };
    const all = loadInvestigations();
    const idx = all.findIndex(i => i.id === inv.id);
    if (idx === -1) return;
    all[idx].searches.push(entry);
    all[idx].updated = new Date().toISOString();
    saveInvestigations(all);
    showInvToast('Search logged.', 'success');
    _addingItem=''; renderInv();
  });

  // Follow-up handlers
  pane.querySelector('#btn-add-followup')?.addEventListener('click', () => { _addingItem='followup'; renderInv(); });
  pane.querySelector('#fu-cancel')?.addEventListener('click', () => { _addingItem=''; renderInv(); });
  pane.querySelector('#fu-save')?.addEventListener('click', () => {
    const task = pane.querySelector('#fu-task')?.value.trim();
    if (!task) { showInvToast('Task is required.', 'error'); return; }
    const entry = {
      id:       shortId(),
      task,
      status:   pane.querySelector('#fu-status')?.value || 'Open',
      priority: pane.querySelector('#fu-priority')?.value || 'Medium',
      dueDate:  pane.querySelector('#fu-due')?.value || '',
      notes:    pane.querySelector('#fu-notes')?.value.trim() || '',
      created:  new Date().toISOString(),
    };
    const all = loadInvestigations();
    const idx = all.findIndex(i => i.id === inv.id);
    if (idx === -1) return;
    if (!all[idx].followUps) all[idx].followUps = [];
    all[idx].followUps.push(entry);
    all[idx].updated = new Date().toISOString();
    saveInvestigations(all);
    showInvToast('Follow-up added.', 'success');
    _addingItem=''; renderInv();
  });

  pane.querySelectorAll('.fu-status-select').forEach(sel => {
    sel.addEventListener('change', e => {
      const fuid = sel.dataset.fuid;
      const all = loadInvestigations();
      const idx = all.findIndex(i => i.id === inv.id);
      if (idx === -1) return;
      const fi = all[idx].followUps.findIndex(f => f.id === fuid);
      if (fi !== -1) all[idx].followUps[fi].status = e.target.value;
      all[idx].updated = new Date().toISOString();
      saveInvestigations(all);
    });
  });

  pane.querySelectorAll('.fu-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDeleteItemModal('followup', btn.dataset.fuid, inv.id); });
  });

  pane.querySelectorAll('.search-delete-btn').forEach(btn => {
    btn.addEventListener('click', e => { e.stopPropagation(); openDeleteItemModal('search', btn.dataset.sid, inv.id); });
  });
}

function renderFollowUpSection(inv) {
  const followUps = inv.followUps || [];
  const priorityClass = { Low:'followup-priority-low', Medium:'followup-priority-medium', High:'followup-priority-high', Critical:'followup-priority-critical' };
  const statusBadgeClass = { 'Open':'followup-open', 'In Progress':'followup-in-progress', 'Completed':'followup-completed', 'Cancelled':'followup-cancelled' };

  let formHTML = '';
  if (_addingItem === 'followup') {
    formHTML = `
      <div class="inv-inline-form" style="margin-bottom:8px">
        <div class="inv-inline-form-grid">
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Task <span style="color:var(--accent)">*</span></label>
            <input type="text" id="fu-task" class="inv-form-input" placeholder="What needs to be done?" />
          </div>
          <div>
            <label class="inv-inline-label">Status</label>
            <select id="fu-status" class="inv-form-input">
              ${FOLLOWUP_STATUSES.map(s => `<option value="${s}">${s}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="inv-inline-label">Priority</label>
            <select id="fu-priority" class="inv-form-input">
              ${FOLLOWUP_PRIORITIES.map(p => `<option value="${p}" ${p==='Medium'?'selected':''}>${p}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="inv-inline-label">Due Date</label>
            <input type="date" id="fu-due" class="inv-form-input" />
          </div>
          <div class="inv-inline-form-full">
            <label class="inv-inline-label">Notes</label>
            <textarea id="fu-notes" class="inv-form-input inv-form-textarea" style="min-height:40px"></textarea>
          </div>
        </div>
        <div class="inv-form-actions" style="margin-top:8px;padding-top:8px;border-top:1px solid var(--border)">
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="fu-cancel">Cancel</button>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="fu-save">Add Task</button>
        </div>
      </div>`;
  }

  const listHTML = followUps.length === 0
    ? `<div style="color:var(--text-dim);font-size:0.76rem;padding:8px 0">No follow-up tasks. <button class="inv-btn inv-btn-ghost inv-btn-sm" id="btn-add-followup" style="display:inline-flex">+ Add</button></div>`
    : followUps.map(f => `
        <div class="followup-card">
          <div class="followup-priority ${priorityClass[f.priority]||'followup-priority-medium'}"></div>
          <div style="flex:1">
            <div class="followup-task">${esc(f.task)}</div>
            <div style="font-size:0.7rem;color:var(--text-dim);margin-top:2px">${esc(f.priority)} priority${f.dueDate?' · Due: '+esc(f.dueDate):''}</div>
            ${f.notes ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:2px;font-style:italic">${esc(f.notes)}</div>` : ''}
          </div>
          <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
            <select class="inv-form-input fu-status-select" data-fuid="${esc(f.id)}" style="padding:3px 6px;font-size:0.7rem;width:auto">
              ${FOLLOWUP_STATUSES.map(s => `<option value="${s}" ${f.status===s?'selected':''}>${s}</option>`).join('')}
            </select>
            <button class="finding-mini-btn fu-delete-btn delete" data-fuid="${esc(f.id)}" title="Delete">✕</button>
          </div>
        </div>`).join('');

  return `
    ${formHTML}
    ${!_addingItem.includes('followup') && followUps.length > 0 ? `<button class="inv-btn inv-btn-ghost inv-btn-sm" id="btn-add-followup" style="margin-bottom:8px">+ Add Task</button>` : ''}
    ${listHTML}`;
}

function searchLogCardHTML(s) {
  return `
    <div class="search-log-card">
      <div>
        <div class="search-log-query">${esc(s.query)}</div>
        <div class="search-log-meta">
          ${s.type ? `<span>${esc(s.type)}</span>` : ''}
          ${s.source ? `<span>via ${esc(s.source)}</span>` : ''}
          ${s.datetime ? `<span>${esc(s.datetime.replace('T',' '))}</span>` : ''}
          ${s.result ? `<span style="color:var(--text)">→ ${esc(s.result)}</span>` : ''}
        </div>
        ${s.notes ? `<div style="font-size:0.7rem;color:var(--text-dim);margin-top:3px;font-style:italic">${esc(s.notes)}</div>` : ''}
      </div>
      <button class="finding-mini-btn search-delete-btn delete" data-sid="${esc(s.id)}" title="Delete">✕</button>
    </div>`;
}

/* ── RESOURCES ─────────────────────────────────────────────── */

function renderWsResources(pane, inv) {
  const resources = inv.resources || [];

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">📚 ASSOCIATED RESOURCES</div>
        <span style="font-size:0.72rem;color:var(--text-dim)">Use ⊕ buttons in the Resources tab to add</span>
      </div>
      ${resources.length === 0
        ? `<div class="inv-empty-state">
            <div class="inv-empty-icon">📚</div>
            <div class="inv-empty-title">No Resources Associated</div>
            <div class="inv-empty-desc">Visit the Resources tab and use the "Add to Investigation" button on any resource card to associate it here.</div>
            <button class="inv-btn inv-btn-primary inv-btn-sm" data-goto-tab="resources" style="margin-top:4px">Go to Resources →</button>
          </div>`
        : resources.map(r => `
            <div class="inv-resource-item">
              <div class="inv-resource-icon">${r.icon || '🔗'}</div>
              <div style="flex:1">
                <div class="inv-resource-label">${esc(r.label)}</div>
                ${r.notes ? `<div style="font-size:0.7rem;color:var(--text-dim)">${esc(r.notes)}</div>` : ''}
              </div>
              <a href="${esc(r.url)}" target="_blank" rel="noopener" class="inv-resource-open">Open ↗</a>
              <button class="finding-mini-btn resource-remove-btn delete" data-rid="${esc(r.id)}" title="Remove">✕</button>
            </div>`).join('')}
    </div>`;

  pane.querySelector('[data-goto-tab="resources"]')?.addEventListener('click', () => {
    document.querySelector('.tab-btn[data-tab="resources"]')?.click();
  });

  pane.querySelectorAll('.resource-remove-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const rid = btn.dataset.rid;
      const all = loadInvestigations();
      const idx = all.findIndex(i => i.id === inv.id);
      if (idx === -1) return;
      all[idx].resources = (all[idx].resources || []).filter(r => r.id !== rid);
      all[idx].updated = new Date().toISOString();
      saveInvestigations(all);
      renderInv();
    });
  });
}

/* ── REPORTS / EXPORT ─────────────────────────────────────── */

function renderWsReports(pane, inv) {
  const findings  = (inv.findings  || []).length;
  const sources   = (inv.sources   || []).length;
  const timeline  = (inv.timeline  || []).length;
  const notes     = (inv.caseNotes || []).length;
  const searches  = (inv.searches  || []).length;
  const followUps = (inv.followUps || []).length;

  pane.innerHTML = `
    <div class="inv-ws-pane">
      <div class="inv-pane-header">
        <div class="inv-pane-title">📄 EXPORT & REPORTS</div>
      </div>

      <div class="inv-privacy-note" style="margin-bottom:14px">
        🔒 Exports are generated locally. No data is transmitted.
      </div>

      <div style="background:var(--surface-2);border:1px solid var(--border);border-radius:6px;padding:12px;margin-bottom:14px;font-size:0.78rem;color:var(--text-dim)">
        <strong style="color:var(--text)">${esc(inv.name)}</strong><br/>
        ${findings} findings · ${sources} sources · ${timeline} timeline events · ${notes} notes · ${searches} searches · ${followUps} follow-up items
      </div>

      <div class="inv-export-grid">
        <div class="inv-export-card">
          <div class="inv-export-card-icon">📦</div>
          <div class="inv-export-card-title">JSON Export</div>
          <div class="inv-export-card-desc">Complete investigation data in JSON format. Suitable for backup, archiving, or importing into other tools.</div>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="exp-json" style="margin-top:8px">Download JSON</button>
        </div>
        <div class="inv-export-card">
          <div class="inv-export-card-icon">📊</div>
          <div class="inv-export-card-title">CSV Export</div>
          <div class="inv-export-card-desc">Findings exported as a CSV spreadsheet. Open in Excel, Google Sheets, or any CSV viewer.</div>
          <button class="inv-btn inv-btn-primary inv-btn-sm" id="exp-csv" style="margin-top:8px">Download CSV</button>
        </div>
        <div class="inv-export-card" style="grid-column:1/-1">
          <div class="inv-export-card-icon">🖨️</div>
          <div class="inv-export-card-title">Printable Report</div>
          <div class="inv-export-card-desc">Opens a formatted HTML report in a new tab. Use your browser's Print function to save as PDF or print a hard copy.</div>
          <button class="inv-btn inv-btn-ghost inv-btn-sm" id="exp-html" style="margin-top:8px">Generate Report →</button>
        </div>
      </div>
    </div>`;

  pane.querySelector('#exp-json')?.addEventListener('click', () => exportJSON(inv));
  pane.querySelector('#exp-csv')?.addEventListener('click',  () => exportCSV(inv));
  pane.querySelector('#exp-html')?.addEventListener('click', () => exportHTML(inv));
}

function exportJSON(inv) {
  const blob = new Blob([JSON.stringify(inv, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `investigation-${(inv.name||'export').replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showInvToast('JSON exported.', 'success');
}

function exportCSV(inv) {
  const rows = [['ID','Title','Description','Source','URL','Date','Confidence','Tags','Notes']];
  (inv.findings || []).forEach(f => {
    rows.push([
      f.id||'', f.title||'', f.description||'', f.source||'', f.url||'',
      f.date||'', f.confidence||'', (f.tags||[]).join('; '), f.notes||''
    ]);
  });
  const csv = rows.map(r => r.map(c => '"' + String(c).replace(/"/g,'""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `findings-${(inv.name||'export').replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showInvToast('CSV exported.', 'success');
}

function exportHTML(inv) {
  const typeObj = INV_TYPES.find(t => t.id === inv.type) || { label: 'General OSINT' };
  const now = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });

  const findingsHTML = (inv.findings||[]).map(f => `
    <tr>
      <td>${esc(f.id)}</td>
      <td><strong>${esc(f.title)}</strong>${f.description?'<br/><small>'+esc(f.description)+'</small>':''}</td>
      <td>${esc(f.source||'')}${f.url?'<br/><a href="'+esc(f.url)+'" target="_blank">'+esc(f.url)+'</a>':''}</td>
      <td>${esc(f.date||'')}</td>
      <td><strong>${esc(f.confidence||'Unknown')}</strong></td>
      <td>${(f.tags||[]).join(', ')}</td>
    </tr>`).join('');

  const sourcesHTML = (inv.sources||[]).map(s => `
    <tr>
      <td>${esc(s.name)}</td>
      <td>${s.url?'<a href="'+esc(s.url)+'" target="_blank">'+esc(s.url)+'</a>':''}</td>
      <td>${esc(s.type||'')}</td>
      <td>${esc(s.dateAccessed||'')}</td>
      <td>${esc(s.notes||'')}</td>
    </tr>`).join('');

  const timelineHTML = [...(inv.timeline||[])].sort((a,b)=>new Date(a.date)-new Date(b.date)).map(t => `
    <tr>
      <td>${esc(t.date)}${t.time?' '+esc(t.time):''}</td>
      <td><strong>${esc(t.title)}</strong>${t.description?'<br/>'+esc(t.description):''}</td>
      <td>${esc(t.source||'')}</td>
    </tr>`).join('');

  const notesHTML = (inv.caseNotes||[]).map(n => `
    <div style="margin-bottom:12px;padding:10px;background:#f9f9f9;border-left:3px solid #c00;border-radius:4px">
      <strong>${esc(n.type||'General')}</strong>
      ${n.associatedWith?'<em> — '+esc(n.associatedWith)+'</em>':''}
      <p style="margin:6px 0 0;white-space:pre-wrap">${esc(n.content)}</p>
    </div>`).join('');

  const followUpsHTML = (inv.followUps||[]).map(f => `
    <tr>
      <td>${esc(f.task)}</td>
      <td>${esc(f.priority||'')}</td>
      <td>${esc(f.status||'')}</td>
      <td>${esc(f.dueDate||'')}</td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<title>Investigation Report — ${esc(inv.name)}</title>
<style>
  body { font-family: Arial, sans-serif; font-size: 12px; color: #222; max-width: 900px; margin: 0 auto; padding: 24px; }
  h1 { font-size: 20px; border-bottom: 2px solid #c00; padding-bottom: 8px; color: #c00; }
  h2 { font-size: 14px; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin-top: 24px; color: #333; }
  table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  th { background: #f0f0f0; text-align: left; padding: 6px 8px; font-size: 11px; border: 1px solid #ddd; }
  td { padding: 6px 8px; border: 1px solid #ddd; vertical-align: top; }
  .meta-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 20px; }
  .meta-cell { background: #f9f9f9; padding: 8px; border-radius: 4px; }
  .meta-label { font-size: 10px; color: #666; text-transform: uppercase; font-weight: bold; }
  .meta-value { font-size: 13px; margin-top: 2px; }
  .stats { display: flex; gap: 16px; margin: 16px 0; }
  .stat { text-align: center; padding: 10px 16px; background: #f5f5f5; border-radius: 6px; }
  .stat-num { font-size: 20px; font-weight: bold; color: #c00; }
  .stat-label { font-size: 10px; color: #666; text-transform: uppercase; }
  a { color: #c00; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<h1>🔍 Investigation Report</h1>
<p style="color:#666;font-size:11px">Generated: ${now} · OSINT Investigator v3.3 · Data stored and processed locally</p>

<div class="meta-grid">
  <div class="meta-cell"><div class="meta-label">Investigation</div><div class="meta-value">${esc(inv.name)}</div></div>
  <div class="meta-cell"><div class="meta-label">Subject</div><div class="meta-value">${esc(inv.subject||'—')}</div></div>
  <div class="meta-cell"><div class="meta-label">Status</div><div class="meta-value">${esc(inv.status||'—')}</div></div>
  <div class="meta-cell"><div class="meta-label">Type</div><div class="meta-value">${esc(typeObj.label)}</div></div>
  <div class="meta-cell"><div class="meta-label">Reference</div><div class="meta-value">${esc(inv.reference||'—')}</div></div>
  <div class="meta-cell"><div class="meta-label">Investigator</div><div class="meta-value">${esc(inv.investigator||'—')}</div></div>
</div>

${inv.objective ? `<h2>Objective</h2><p style="white-space:pre-wrap">${esc(inv.objective)}</p>` : ''}

<div class="stats">
  <div class="stat"><div class="stat-num">${(inv.findings||[]).length}</div><div class="stat-label">Findings</div></div>
  <div class="stat"><div class="stat-num">${(inv.sources||[]).length}</div><div class="stat-label">Sources</div></div>
  <div class="stat"><div class="stat-num">${(inv.timeline||[]).length}</div><div class="stat-label">Timeline Events</div></div>
  <div class="stat"><div class="stat-num">${(inv.caseNotes||[]).length}</div><div class="stat-label">Notes</div></div>
</div>

${findingsHTML ? `<h2>Findings (${(inv.findings||[]).length})</h2>
<table><thead><tr><th>ID</th><th>Title / Description</th><th>Source / URL</th><th>Date</th><th>Confidence</th><th>Tags</th></tr></thead>
<tbody>${findingsHTML}</tbody></table>` : ''}

${sourcesHTML ? `<h2>Sources (${(inv.sources||[]).length})</h2>
<table><thead><tr><th>Name</th><th>URL</th><th>Type</th><th>Date Accessed</th><th>Notes</th></tr></thead>
<tbody>${sourcesHTML}</tbody></table>` : ''}

${timelineHTML ? `<h2>Timeline (${(inv.timeline||[]).length} events)</h2>
<table><thead><tr><th>Date / Time</th><th>Event</th><th>Source</th></tr></thead>
<tbody>${timelineHTML}</tbody></table>` : ''}

${notesHTML ? `<h2>Notes (${(inv.caseNotes||[]).length})</h2>${notesHTML}` : ''}

${followUpsHTML ? `<h2>Follow-Up Tasks (${(inv.followUps||[]).length})</h2>
<table><thead><tr><th>Task</th><th>Priority</th><th>Status</th><th>Due Date</th></tr></thead>
<tbody>${followUpsHTML}</tbody></table>` : ''}

<p style="margin-top:32px;font-size:10px;color:#999;border-top:1px solid #eee;padding-top:10px">
  OSINT Investigator v3.3 · Investigation Report · Confidential
</p>
</body></html>`;

  const win = window.open('', '_blank', 'noopener');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
  showInvToast('Report generated.', 'success');
}

/* ════════════════════════════════════════════════════════════
   MODALS
   ════════════════════════════════════════════════════════════ */

function openDeleteModal(invId) {
  const modal = document.getElementById('inv-modal-overlay');
  if (!modal) return;
  const inv = getInv(invId);
  if (!inv) return;

  modal.innerHTML = `
    <div class="inv-modal">
      <div class="inv-modal-title">Delete Investigation</div>
      <div class="inv-modal-desc">Are you sure you want to permanently delete <strong>${esc(inv.name)}</strong>? This action cannot be undone. All findings, sources, notes and timeline events will be lost.</div>
      <div class="inv-modal-actions">
        <button class="inv-btn inv-btn-ghost" id="modal-cancel">Cancel</button>
        <button class="inv-btn inv-btn-danger" id="modal-confirm">Delete Permanently</button>
      </div>
    </div>`;

  modal.classList.add('open');

  modal.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
  modal.querySelector('#modal-confirm')?.addEventListener('click', () => {
    const all = loadInvestigations().filter(i => i.id !== invId);
    saveInvestigations(all);
    closeModal();
    showInvToast('Investigation deleted.', 'success');
    _invView = 'dashboard';
    renderInv();
  });

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}

function openDeleteItemModal(type, itemId, invId) {
  const modal = document.getElementById('inv-modal-overlay');
  if (!modal) return;
  const labels = { finding:'Finding', source:'Source', timeline:'Timeline Event', note:'Note', search:'Search Entry', followup:'Follow-up Task' };

  modal.innerHTML = `
    <div class="inv-modal">
      <div class="inv-modal-title">Delete ${labels[type]||'Item'}</div>
      <div class="inv-modal-desc">Are you sure you want to delete this ${(labels[type]||'item').toLowerCase()}? This cannot be undone.</div>
      <div class="inv-modal-actions">
        <button class="inv-btn inv-btn-ghost" id="modal-cancel">Cancel</button>
        <button class="inv-btn inv-btn-danger" id="modal-confirm">Delete</button>
      </div>
    </div>`;

  modal.classList.add('open');

  modal.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
  modal.querySelector('#modal-confirm')?.addEventListener('click', () => {
    const all = loadInvestigations();
    const idx = all.findIndex(i => i.id === invId);
    if (idx !== -1) {
      const mapKey = { finding:'findings', source:'sources', timeline:'timeline', note:'caseNotes', search:'searches', followup:'followUps' };
      const key = mapKey[type];
      if (key && all[idx][key]) {
        all[idx][key] = all[idx][key].filter(item => item.id !== itemId);
        all[idx].updated = new Date().toISOString();
        saveInvestigations(all);
      }
    }
    closeModal();
    showInvToast('Item deleted.', 'success');
    renderInv();
  });

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}

function openAddToInvModal(ircId, label, url, icon) {
  const modal = document.getElementById('inv-modal-overlay');
  if (!modal) return;
  const all = loadInvestigations().filter(i => i.status !== 'Archived');

  modal.innerHTML = `
    <div class="inv-modal">
      <div class="inv-modal-title">Add to Investigation</div>
      <div class="inv-modal-desc">Add <strong>${esc(label)}</strong> to an investigation's resources.</div>
      <div class="inv-picker-list">
        ${all.length === 0
          ? `<div class="inv-picker-none">No active investigations. Create one first.</div>`
          : all.map(i => `<div class="inv-picker-item" data-pick-id="${esc(i.id)}">${esc(i.name)} <span style="color:var(--text-dim);font-size:0.72rem">${esc(i.status)}</span></div>`).join('')}
      </div>
      <div style="margin-bottom:10px">
        <label class="inv-inline-label">Notes (optional)</label>
        <input type="text" id="modal-resource-note" class="inv-form-input" placeholder="Why this resource is relevant…" />
      </div>
      <div class="inv-modal-actions">
        <button class="inv-btn inv-btn-ghost" id="modal-cancel">Cancel</button>
        <button class="inv-btn inv-btn-primary" id="modal-confirm" disabled>Add to Investigation</button>
      </div>
    </div>`;

  modal.classList.add('open');

  let selectedId = null;
  modal.querySelectorAll('.inv-picker-item').forEach(item => {
    item.addEventListener('click', () => {
      modal.querySelectorAll('.inv-picker-item').forEach(i => i.classList.remove('selected'));
      item.classList.add('selected');
      selectedId = item.dataset.pickId;
      modal.querySelector('#modal-confirm').disabled = false;
    });
  });

  modal.querySelector('#modal-cancel')?.addEventListener('click', closeModal);
  modal.querySelector('#modal-confirm')?.addEventListener('click', () => {
    if (!selectedId) return;
    const notes = modal.querySelector('#modal-resource-note')?.value.trim() || '';
    const invAll = loadInvestigations();
    const idx = invAll.findIndex(i => i.id === selectedId);
    if (idx !== -1) {
      if (!invAll[idx].resources) invAll[idx].resources = [];
      // Check for duplicate
      if (!invAll[idx].resources.find(r => r.ircId === ircId)) {
        invAll[idx].resources.push({ id: shortId(), ircId, label, url, icon, notes, added: new Date().toISOString() });
        invAll[idx].updated = new Date().toISOString();
        saveInvestigations(invAll);
        showInvToast(`Added to "${invAll[idx].name}".`, 'success');
      } else {
        showInvToast('Already associated with this investigation.', 'error');
      }
    }
    closeModal();
  });

  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
}

function closeModal() {
  const modal = document.getElementById('inv-modal-overlay');
  if (modal) {
    modal.classList.remove('open');
    modal.innerHTML = '';
  }
}

/* ════════════════════════════════════════════════════════════
   IRC INTEGRATION — MutationObserver
   ════════════════════════════════════════════════════════════ */

function injectAddToInvButtons() {
  const grid = document.getElementById('irc-grid');
  if (!grid) return;

  grid.querySelectorAll('.irc-card').forEach(card => {
    if (card.querySelector('.irc-add-to-inv-btn')) return; // already injected

    const ircId = card.dataset.ircId || card.querySelector('[data-irc-id]')?.dataset.ircId || '';
    const label = card.querySelector('.irc-card-label, .irc-label, [class*="label"]')?.textContent.trim() || 'Resource';
    const icon  = card.querySelector('.irc-card-icon, .irc-icon, [class*="icon"]')?.textContent.trim() || '🔗';
    const link  = card.querySelector('a, [data-url]');
    const url   = link?.href || link?.dataset.url || card.dataset.url || '';

    // Try to find the footer actions area to inject into
    let target = card.querySelector('.irc-card-footer, .irc-card-actions, .irc-actions');
    if (!target) {
      target = document.createElement('div');
      target.style.marginTop = '6px';
      card.appendChild(target);
    }

    const btn = document.createElement('button');
    btn.className = 'irc-add-to-inv-btn';
    btn.innerHTML = '⊕ Add to Inv';
    btn.title = 'Add this resource to an investigation';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openAddToInvModal(ircId || label, label, url, icon);
    });
    target.appendChild(btn);
  });
}

/* ════════════════════════════════════════════════════════════
   QB INTEGRATION — Save query to investigation
   ════════════════════════════════════════════════════════════ */

function injectQbSaveToInvButton() {
  const actions = document.querySelector('.qb-preview-actions');
  if (!actions || actions.querySelector('.qb-save-to-inv-btn')) return;

  const btn = document.createElement('button');
  btn.className = 'qb-save-to-inv-btn';
  btn.innerHTML = `
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
    Save to Investigation`;
  btn.title = 'Log this query to the current investigation';
  btn.addEventListener('click', () => {
    const preview = document.getElementById('qb-preview-box');
    const query   = preview ? preview.textContent.trim().replace('Select a template above to preview the query…','').trim() : '';
    if (!query) { showInvToast('Build a query first.', 'error'); return; }

    const all = loadInvestigations().filter(i => i.status !== 'Archived');
    if (all.length === 0) { showInvToast('Create an investigation first.', 'error'); return; }

    // Use current investigation if workspace is open, otherwise pick first active
    let targetInv = _currentInvId ? all.find(i => i.id === _currentInvId) : null;
    if (!targetInv) targetInv = all.find(i => i.status === 'Active') || all[0];
    if (!targetInv) return;

    const invAll = loadInvestigations();
    const idx = invAll.findIndex(i => i.id === targetInv.id);
    if (idx === -1) return;
    if (!invAll[idx].searches) invAll[idx].searches = [];
    invAll[idx].searches.push({
      id: shortId(),
      type: 'Query Builder',
      query,
      source: 'OSINT Investigator QB',
      datetime: new Date().toISOString().slice(0,16),
      result: '',
      notes: '',
    });
    invAll[idx].updated = new Date().toISOString();
    saveInvestigations(invAll);
    showInvToast(`Query saved to "${targetInv.name}".`, 'success');
  });
  actions.appendChild(btn);
}

/* ════════════════════════════════════════════════════════════
   GLOBAL SEARCH EXTENSION
   ════════════════════════════════════════════════════════════ */

function extendGlobalSearch() {
  // Extend _searchIdx (defined in v32.js) with investigation data
  if (typeof _searchIdx === 'undefined' || _searchIdx === null) return;

  // Remove any previously added inv items
  const filtered = _searchIdx.filter(r => r.type !== 'investigation');

  const all = loadInvestigations().filter(i => i.status !== 'Archived');
  const newEntries = [];

  all.forEach(inv => {
    newEntries.push({
      label: inv.name,
      desc:  (inv.subject ? inv.subject + ' — ' : '') + (inv.objective || '').slice(0,60),
      cat: 'investigation', icon: '🔍', type: 'investigation',
      action: () => { openWorkspace(inv.id); document.querySelector('.tab-btn[data-tab="investigations"]')?.click(); }
    });
    // findings
    (inv.findings || []).forEach(f => newEntries.push({
      label: f.title,
      desc: `Finding in ${inv.name}`,
      cat: 'finding', icon: '🔎', type: 'investigation',
      action: () => { openWorkspace(inv.id); _wsTab = 'findings'; document.querySelector('.tab-btn[data-tab="investigations"]')?.click(); setTimeout(renderInv, 50); }
    }));
    // notes
    (inv.caseNotes || []).forEach(n => newEntries.push({
      label: n.content.slice(0,50),
      desc: `Note in ${inv.name}`,
      cat: 'note', icon: '📝', type: 'investigation',
      action: () => { openWorkspace(inv.id); _wsTab = 'notes'; document.querySelector('.tab-btn[data-tab="investigations"]')?.click(); setTimeout(renderInv, 50); }
    }));
  });

  // Update the global _searchIdx variable in v32.js scope
  // Since v33.js runs after v32.js, _searchIdx is in the same scope
  _searchIdx.length = 0;
  filtered.forEach(r => _searchIdx.push(r));
  newEntries.forEach(r => _searchIdx.push(r));
}

/* ════════════════════════════════════════════════════════════
   TOAST
   ════════════════════════════════════════════════════════════ */

function showInvToast(msg, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ════════════════════════════════════════════════════════════
   DASHBOARD WIDGET (shows active investigations on main dashboard)
   ════════════════════════════════════════════════════════════ */

function renderInvDashboardWidget() {
  // Add an "Active Investigations" section to the main dashboard if not present
  const coverageWidget = document.getElementById('coverage-widget');
  if (!coverageWidget) return;

  const all = loadInvestigations();
  const active = all.filter(i => i.status === 'Active' || i.status === 'Planning').slice(0, 5);

  if (active.length === 0) {
    coverageWidget.innerHTML = `
      <div style="color:var(--text-dim);font-size:0.8rem;padding:6px 0">No active investigations.
        <button class="link-btn" style="font-size:0.78rem" id="dash-new-inv-btn">Create one →</button>
      </div>`;
    coverageWidget.querySelector('#dash-new-inv-btn')?.addEventListener('click', () => {
      document.querySelector('.tab-btn[data-tab="investigations"]')?.click();
      setTimeout(() => { _invView = 'new'; renderInv(); }, 100);
    });
    return;
  }

  coverageWidget.innerHTML = `
    <div class="dash-inv-widget">
      ${active.map(inv => `
        <div class="dash-inv-item" data-inv-open="${esc(inv.id)}">
          <span class="inv-status-badge ${statusClass(inv.status)}">${esc(inv.status)}</span>
          <span class="dash-inv-item-name">${esc(inv.name)}</span>
          <span class="dash-inv-item-meta">${(inv.findings||[]).length}F · ${(inv.sources||[]).length}S</span>
        </div>`).join('')}
      <button class="link-btn" data-goto="investigations" style="font-size:0.76rem;margin-top:4px">View all investigations →</button>
    </div>`;

  coverageWidget.querySelectorAll('[data-inv-open]').forEach(el => {
    el.addEventListener('click', () => {
      const id = el.dataset.invOpen;
      document.querySelector('.tab-btn[data-tab="investigations"]')?.click();
      setTimeout(() => openWorkspace(id), 100);
    });
  });

  coverageWidget.querySelector('[data-goto="investigations"]')?.addEventListener('click', () => {
    document.querySelector('.tab-btn[data-tab="investigations"]')?.click();
  });
}

/* ════════════════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderInv();
  renderInvDashboardWidget();

  // MutationObserver — watch for IRC cards being rendered
  const ircObserver = new MutationObserver(() => {
    injectAddToInvButtons();
  });
  const ircGrid = document.getElementById('irc-grid');
  if (ircGrid) {
    ircObserver.observe(ircGrid, { childList: true, subtree: true });
    // Inject on load in case cards are already there
    injectAddToInvButtons();
  }

  // MutationObserver — watch for QB preview actions being rendered
  const qbObserver = new MutationObserver(() => {
    injectQbSaveToInvButton();
  });
  const qbSection = document.querySelector('.tab-pane#tab-qb');
  if (qbSection) {
    qbObserver.observe(qbSection, { childList: true, subtree: true });
    injectQbSaveToInvButton();
  }

  // Re-inject when switching to resources tab (IRC cards may be lazily rendered)
  document.getElementById('tab-nav')?.addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (tab === 'resources') {
      setTimeout(injectAddToInvButtons, 300);
    }
    if (tab === 'investigations') {
      renderInv();
    }
    if (tab === 'dashboard') {
      renderInvDashboardWidget();
    }
  });

  // Global search extension — runs once on init and after each investigation render
  setTimeout(extendGlobalSearch, 500);
});
