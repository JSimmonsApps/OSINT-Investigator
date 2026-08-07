/**
 * OSINT Investigator v3.2 — v32.js
 * Intelligence Resource Center | Investigator Toolkit | Global Search | Dashboard
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   IRC DATA
   ════════════════════════════════════════════════════════════ */

const LS_IRC_FAVS_KEY    = 'osint_irc_favorites';
const LS_RECENTLY_USED   = 'osint_recently_used';

const IRC_DATA = [
  // ── Canadian Intelligence ────────────────────────────────
  { id:'canlii',        label:'CanLII',                 icon:'⚖️',  cat:'canadian',  url:'https://www.canlii.org',                                          desc:'Canadian Legal Information Institute — comprehensive case law and legislation database.' },
  { id:'ont-courts',    label:'Ontario Court Lists',    icon:'🏛️',  cat:'canadian',  url:'https://www.ontariocourts.ca/ocj/scheduling-and-court-lists/',    desc:'Daily Ontario Court scheduling and court lists.' },
  { id:'fed-court',     label:'Federal Court of Canada',icon:'⚖️',  cat:'canadian',  url:'https://www.fct-cf.gc.ca',                                        desc:'Federal Court decisions, filings and procedural information.' },
  { id:'scc',           label:'Supreme Court of Canada',icon:'🏛️',  cat:'canadian',  url:'https://www.scc-csc.ca',                                          desc:'Decisions and proceedings of the Supreme Court of Canada.' },
  { id:'statcan',       label:'Statistics Canada',      icon:'📊',  cat:'canadian',  url:'https://www.statcan.gc.ca',                                       desc:'Official Canadian statistics, census data and research.' },
  { id:'open-gov',      label:'Open Government Canada', icon:'🇨🇦', cat:'canadian',  url:'https://open.canada.ca',                                          desc:'Federal datasets, APIs and open data from the Government of Canada.' },
  { id:'justice-ca',    label:'Justice Canada',         icon:'📜',  cat:'canadian',  url:'https://www.justice.gc.ca',                                       desc:'Federal legislation, regulations and justice system information.' },
  { id:'gov-ca',        label:'Government of Canada',   icon:'🍁',  cat:'canadian',  url:'https://www.canada.ca',                                           desc:'Official portal of the Government of Canada.' },
  { id:'public-safety', label:'Public Safety Canada',   icon:'🛡️',  cat:'canadian',  url:'https://www.publicsafety.gc.ca',                                  desc:'National security, emergency management and law enforcement resources.' },
  { id:'parl',          label:'Parliament of Canada',   icon:'🏛️',  cat:'canadian',  url:'https://www.parl.ca',                                             desc:'Hansard debates, bills, MPs and Senate information.' },
  { id:'elections-ca',  label:'Elections Canada',       icon:'🗳️',  cat:'canadian',  url:'https://www.elections.ca',                                        desc:'Electoral information, riding results and political financing.' },
  // ── Corporate Intelligence ───────────────────────────────
  { id:'fed-corp-srch', label:'Corporations Canada',    icon:'🏢',  cat:'corporate', url:'https://ised-isde.canada.ca/cc/lgcy/fdrl/srch/index?lang=eng',     desc:'Search federal corporations and societies registered with Industry Canada.' },
  { id:'ont-biz',       label:'Ontario Business Registry',icon:'📋',cat:'corporate', url:'https://www.ontario.ca/page/ontario-business-registry',            desc:'Search Ontario business and not-for-profit registrations.' },
  { id:'bc-registry',   label:'BC Corporate Registry',  icon:'📋',  cat:'corporate', url:'https://www.bcregistry.gov.bc.ca',                                 desc:'BC Registries — company and business name searches.' },
  { id:'ab-registry',   label:'Alberta Corporate Registry',icon:'📋',cat:'corporate',url:'https://www.alberta.ca/search-corporate-registry.aspx',            desc:'Search Alberta corporate registry for registered entities.' },
  { id:'opencorp',      label:'OpenCorporates',          icon:'🌐',  cat:'corporate', url:'https://opencorporates.com',                                       desc:'Largest open database of companies in the world — 200M+ entities.' },
  { id:'sedar',         label:'SEDAR+',                  icon:'📈',  cat:'corporate', url:'https://www.sedarplus.ca',                                         desc:'Canadian securities regulatory filings, annual reports and prospectuses.' },
  { id:'buyandsell',    label:'Gov Procurement',         icon:'📑',  cat:'corporate', url:'https://buyandsell.gc.ca',                                         desc:'Canadian federal government procurement, contracts and tender notices.' },
  { id:'yellowpages',   label:'Canada 411',              icon:'📞',  cat:'corporate', url:'https://www.canada411.ca',                                         desc:'Canadian business and residential directory.' },
  // ── OSINT Resources ─────────────────────────────────────
  { id:'osint-framework',label:'OSINT Framework',       icon:'🕸️',  cat:'osint',     url:'https://osintframework.com',                                       desc:'Visual tool mapping OSINT resources and techniques by category.' },
  { id:'inteltechniques', label:'IntelTechniques',       icon:'🔍',  cat:'osint',     url:'https://inteltechniques.com',                                      desc:'Michael Bazzell\'s OSINT tools, training and custom search tools.' },
  { id:'bellingcat',     label:'Bellingcat',             icon:'🔔',  cat:'osint',     url:'https://www.bellingcat.com',                                       desc:'Investigative journalism collective specializing in open-source intelligence.' },
  { id:'osint-combine',  label:'OSINT Combine',          icon:'🔗',  cat:'osint',     url:'https://www.osintcombine.com',                                     desc:'Free OSINT tools and resources from cybersecurity professionals.' },
  { id:'osint-curious',  label:'OSINT Curious',          icon:'🧐',  cat:'osint',     url:'https://osintcurio.us',                                            desc:'OSINT education, webcasts and community resources.' },
  { id:'osint-dojo',     label:'OSINT Dojo',             icon:'🥋',  cat:'osint',     url:'https://www.osintdojo.com',                                        desc:'OSINT training resources and challenges for investigators.' },
  { id:'osint-industries',label:'OSINT Industries',      icon:'🏭',  cat:'osint',     url:'https://www.osint.industries',                                     desc:'Professional OSINT investigation platform.' },
  { id:'awesome-osint',  label:'Awesome OSINT',          icon:'⭐',  cat:'osint',     url:'https://github.com/jivoi/awesome-osint',                           desc:'Curated list of OSINT tools, resources and references on GitHub.' },
  // ── GitHub Projects ──────────────────────────────────────
  { id:'spiderfoot',    label:'SpiderFoot',              icon:'🕷️',  cat:'github',    url:'https://github.com/smicallef/spiderfoot',                          desc:'Automated OSINT collection and threat intelligence tool — 200+ modules.' },
  { id:'sherlock',      label:'Sherlock',                icon:'🔎',  cat:'github',    url:'https://github.com/sherlock-project/sherlock',                     desc:'Hunt down social media accounts by username across 400+ platforms.' },
  { id:'maigret',       label:'Maigret',                 icon:'🕵️',  cat:'github',    url:'https://github.com/soxoj/maigret',                                 desc:'Collect a dossier on a person by username — check 3000+ sites.' },
  { id:'theharvester',  label:'theHarvester',            icon:'🌾',  cat:'github',    url:'https://github.com/laramies/theHarvester',                         desc:'Passive recon tool for gathering emails, IPs, URLs from public sources.' },
  { id:'phoneinfoga',   label:'PhoneInfoga',             icon:'📱',  cat:'github',    url:'https://github.com/sundowndev/phoneinfoga',                        desc:'Advanced phone number OSINT framework — scan, gather and format.' },
  { id:'holehe',        label:'Holehe',                  icon:'🦩',  cat:'github',    url:'https://github.com/megadose/holehe',                               desc:'Check if an email is attached to an account on 120+ websites.' },
  { id:'photon',        label:'Photon',                  icon:'📷',  cat:'github',    url:'https://github.com/s0md3v/Photon',                                 desc:'Fast crawler designed for OSINT — extracts URLs, emails, files.' },
  { id:'recon-ng',      label:'Recon-ng',                icon:'🔭',  cat:'github',    url:'https://github.com/lanmaster53/recon-ng',                          desc:'Full-featured web reconnaissance framework written in Python.' },
  { id:'social-analyzer',label:'Social Analyzer',        icon:'👥',  cat:'github',    url:'https://github.com/qeeqbox/social-analyzer',                       desc:'API and web app for analyzing and finding a person\'s profile across 1000+ sites.' },
  { id:'ghunt',         label:'GHunt',                   icon:'👻',  cat:'github',    url:'https://github.com/mxrch/GHunt',                                   desc:'Offensive Google account OSINT tool — extract data from a Gmail address.' },
  { id:'bbot',          label:'BBOT',                    icon:'🤖',  cat:'github',    url:'https://github.com/blacklanternsecurity/bbot',                     desc:'Recursive internet scanner — OSINT and attack surface mapping.' },
  { id:'finalrecon',    label:'FinalRecon',              icon:'🏁',  cat:'github',    url:'https://github.com/thewhiteh4t/FinalRecon',                        desc:'Automated web reconnaissance tool with header, SSL, WHOIS and crawl analysis.' },
  // ── Reddit Communities ───────────────────────────────────
  { id:'r-osint',       label:'r/OSINT',                 icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/OSINT/',                                  desc:'Open-source intelligence community — tools, techniques and discussions.' },
  { id:'r-cybersec',    label:'r/cybersecurity',         icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/cybersecurity/',                          desc:'News and discussions on cybersecurity topics and current threats.' },
  { id:'r-privacy',     label:'r/privacy',               icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/privacy/',                                desc:'Privacy news, tools, strategies and advice.' },
  { id:'r-opsec',       label:'r/opsec',                 icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/opsec/',                                  desc:'Operational security discussions, practices and resources.' },
  { id:'r-netsec',      label:'r/netsec',                icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/netsec/',                                 desc:'Network security — research, vulnerabilities and analysis.' },
  { id:'r-dfir',        label:'r/digitalforensics',      icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/digitalforensics/',                       desc:'Digital forensics and incident response community.' },
  { id:'r-blueteam',    label:'r/blueteamsec',           icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/blueteamsec/',                            desc:'Defensive security, threat intelligence and detection resources.' },
  { id:'r-hacking',     label:'r/hacking',               icon:'🔴',  cat:'reddit',    url:'https://www.reddit.com/r/hacking/',                                desc:'Ethical hacking techniques, tools and educational discussions.' },
  // ── YouTube Learning ─────────────────────────────────────
  { id:'yt-bellingcat', label:'Bellingcat (YouTube)',     icon:'▶️',  cat:'youtube',   url:'https://www.youtube.com/@Bellingcat',                              desc:'Video investigations and open-source intelligence tutorials.' },
  { id:'yt-hammond',    label:'John Hammond',             icon:'▶️',  cat:'youtube',   url:'https://www.youtube.com/@_JohnHammond',                            desc:'Cybersecurity challenges, CTFs and malware analysis.' },
  { id:'yt-bombal',     label:'David Bombal',             icon:'▶️',  cat:'youtube',   url:'https://www.youtube.com/@davidbombal',                             desc:'Networking, ethical hacking and cybersecurity career advice.' },
  { id:'yt-13cubed',    label:'13Cubed',                  icon:'▶️',  cat:'youtube',   url:'https://www.youtube.com/@13Cubed',                                 desc:'Digital forensics and incident response training videos.' },
  { id:'yt-netchuck',   label:'NetworkChuck',             icon:'▶️',  cat:'youtube',   url:'https://www.youtube.com/@NetworkChuck',                            desc:'Networking, Linux, Python and cybersecurity education.' },
  { id:'yt-cybermentor',label:'The Cyber Mentor',         icon:'▶️',  cat:'youtube',   url:'https://www.youtube.com/@TCMSecurityAcademy',                      desc:'Ethical hacking tutorials and penetration testing courses.' },
  // ── AI Workspace ─────────────────────────────────────────
  { id:'chatgpt',       label:'ChatGPT',                  icon:'🤖',  cat:'ai',        url:'https://chat.openai.com',                                          desc:'OpenAI\'s conversational AI — research, drafting and analysis.' },
  { id:'claude',        label:'Claude',                   icon:'🤖',  cat:'ai',        url:'https://claude.ai',                                                desc:'Anthropic\'s AI assistant — strong at reasoning and long documents.' },
  { id:'gemini',        label:'Gemini',                   icon:'🤖',  cat:'ai',        url:'https://gemini.google.com',                                        desc:'Google\'s multimodal AI — research, coding and analysis.' },
  { id:'perplexity',    label:'Perplexity AI',            icon:'🔍',  cat:'ai',        url:'https://www.perplexity.ai',                                        desc:'AI-powered search with cited sources — ideal for research.' },
  { id:'notebooklm',    label:'NotebookLM',               icon:'📓',  cat:'ai',        url:'https://notebooklm.google.com',                                    desc:'Google\'s AI research assistant — upload documents and interrogate them.' },
  { id:'grok',          label:'Grok (xAI)',               icon:'🤖',  cat:'ai',        url:'https://x.ai/grok',                                                desc:'xAI\'s Grok — real-time information access and analysis.' },
  { id:'lmstudio',      label:'LM Studio',                icon:'💻',  cat:'ai',        url:'https://lmstudio.ai',                                              desc:'Run large language models locally on your machine.' },
  { id:'ollama',        label:'Ollama',                   icon:'🦙',  cat:'ai',        url:'https://ollama.ai',                                                desc:'Run open-source LLMs locally with a simple CLI and API.' },
  { id:'openwebui',     label:'Open WebUI',               icon:'🌐',  cat:'ai',        url:'https://openwebui.com',                                            desc:'Self-hosted web interface for local LLMs compatible with Ollama.' },
  // ── Downloads ────────────────────────────────────────────
  { id:'spiderfoot-dl', label:'SpiderFoot',               icon:'📥',  cat:'downloads', url:'https://github.com/smicallef/spiderfoot/releases',                 desc:'Automated OSINT and threat intelligence platform.' },
  { id:'maltego',       label:'Maltego CE',               icon:'📥',  cat:'downloads', url:'https://www.maltego.com/downloads/',                               desc:'Visual link analysis and OSINT tool with free community edition.' },
  { id:'wireshark',     label:'Wireshark',                icon:'📥',  cat:'downloads', url:'https://www.wireshark.org/download.html',                          desc:'Network protocol analyzer — capture and inspect packets.' },
  { id:'nmap',          label:'Nmap',                     icon:'📥',  cat:'downloads', url:'https://nmap.org/download.html',                                   desc:'Network discovery and security auditing tool.' },
  { id:'keepassxc',     label:'KeePassXC',                icon:'📥',  cat:'downloads', url:'https://keepassxc.org/download/',                                  desc:'Free, open-source, cross-platform password manager.' },
  { id:'veracrypt',     label:'VeraCrypt',                icon:'📥',  cat:'downloads', url:'https://www.veracrypt.fr/en/Downloads.html',                       desc:'Free disk encryption software — successor to TrueCrypt.' },
  { id:'notepadpp',     label:'Notepad++',                icon:'📥',  cat:'downloads', url:'https://notepad-plus-plus.org/downloads/',                         desc:'Free source code editor and Notepad replacement for Windows.' },
  { id:'vscode',        label:'Visual Studio Code',       icon:'📥',  cat:'downloads', url:'https://code.visualstudio.com/download',                           desc:'Free, open-source code editor from Microsoft — cross-platform.' },
  { id:'github-desktop',label:'GitHub Desktop',           icon:'📥',  cat:'downloads', url:'https://desktop.github.com',                                       desc:'Simplified Git and GitHub workflow with a desktop GUI.' },
  { id:'everything',    label:'Everything Search',        icon:'📥',  cat:'downloads', url:'https://www.voidtools.com/downloads/',                             desc:'Ultra-fast file search for Windows — finds files instantly.' },
  // ── Browser Extensions ───────────────────────────────────
  { id:'ublock',        label:'uBlock Origin',            icon:'🧩',  cat:'extensions',url:'https://ublockorigin.com',                                         desc:'Efficient, wide-spectrum content blocker — essential for privacy.' },
  { id:'bitwarden',     label:'Bitwarden',                icon:'🧩',  cat:'extensions',url:'https://bitwarden.com/download/',                                  desc:'Open-source password manager browser extension.' },
  { id:'singlefile',    label:'SingleFile',               icon:'🧩',  cat:'extensions',url:'https://github.com/gildas-lormeau/SingleFile',                     desc:'Save a complete webpage as a single HTML file — evidence preservation.' },
  { id:'wayback-ext',   label:'Wayback Machine',          icon:'🧩',  cat:'extensions',url:'https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/',desc:'Access archived pages and save URLs to the Wayback Machine.' },
  { id:'wappalyzer-ext',label:'Wappalyzer',               icon:'🧩',  cat:'extensions',url:'https://www.wappalyzer.com/apps/',                                 desc:'Identify technology stacks on websites — CMS, frameworks, analytics.' },
  { id:'ua-switcher',   label:'User-Agent Switcher',      icon:'🧩',  cat:'extensions',url:'https://chrome.google.com/webstore/detail/user-agent-switcher/djflhoibgkdhkhhcedjiklpkjnoahfmg',desc:'Switch your browser user-agent string for testing and privacy.' },
  { id:'dark-reader',   label:'Dark Reader',              icon:'🧩',  cat:'extensions',url:'https://darkreader.org',                                            desc:'Dark mode browser extension — works on any website.' },
  // ── Learning Center ──────────────────────────────────────
  { id:'learn-bazzell', label:'Complete Privacy & Security Podcast', icon:'📚', cat:'learning', url:'https://inteltechniques.com/podcast.html', desc:'Michael Bazzell\'s weekly podcast on digital privacy and OSINT.' },
  { id:'learn-sans',    label:'SANS Reading Room',        icon:'📚',  cat:'learning',  url:'https://www.sans.org/reading-room/',                               desc:'Free security research papers and whitepapers from SANS Institute.' },
  { id:'learn-cse',     label:'CSE Canada Cyber Resources', icon:'📚',cat:'learning',  url:'https://www.cyber.gc.ca/en/',                                      desc:'Canadian Centre for Cyber Security — guidance, alerts and publications.' },
  { id:'learn-threatpost',label:'Threatpost',             icon:'📚',  cat:'learning',  url:'https://threatpost.com',                                           desc:'Independent news site covering cybersecurity, threats and vulnerabilities.' },
  { id:'learn-krebs',   label:'Krebs on Security',        icon:'📚',  cat:'learning',  url:'https://krebsonsecurity.com',                                      desc:'In-depth security journalism from Brian Krebs.' },
  { id:'learn-darknet', label:'Darknet Diaries (Podcast)',icon:'🎙️',  cat:'learning',  url:'https://darknetdiaries.com',                                       desc:'True stories from the dark side of the internet — hacks, breaches, cybercrime.' },
  // ── Reference Library ────────────────────────────────────
  { id:'ref-court',     label:'Canadian Court Structure', icon:'📖',  cat:'reference', url:'https://www.justice.gc.ca/eng/csj-sjc/just/07.html',               desc:'Overview of the Canadian court system from Justice Canada.' },
  { id:'ref-checklist', label:'OSINT Investigation Checklist',icon:'✅',cat:'reference',url:'https://github.com/sinwindie/OSINT/blob/master/Investigation%20Checklists/OSINT_Checklist_People_EN.pdf',desc:'OSINT people investigation checklist — steps and sources.' },
  { id:'ref-methodology',label:'OSINT Methodology',       icon:'📖',  cat:'reference', url:'https://osintframework.com',                                       desc:'Structured OSINT methodology and resource framework.' },
  { id:'ref-google-ops',label:'Google Search Operators',  icon:'📖',  cat:'reference', url:'https://ahrefs.com/blog/google-advanced-search-operators/',        desc:'Complete guide to Google advanced search operators.' },
  { id:'ref-bool',      label:'Boolean Search Guide',     icon:'📖',  cat:'reference', url:'https://www.boolean-strings.com',                                  desc:'Boolean search strings for investigative and HR research.' },
  { id:'ref-metadata',  label:'Metadata Reference',       icon:'📖',  cat:'reference', url:'https://www.exiftool.org',                                         desc:'ExifTool documentation — read and write metadata in files.' },
  { id:'ref-privacy',   label:'Digital Privacy Guide',    icon:'📖',  cat:'reference', url:'https://www.privacyguides.org',                                    desc:'PrivacyGuides — recommendations for protecting your digital privacy.' },
  { id:'ref-evidence',  label:'Evidence Handling Guide',  icon:'📖',  cat:'reference', url:'https://www.cisa.gov/sites/default/files/2022-09/CISA_MS-ISAC_Ransomware%20Guide_S508C.pdf',desc:'Digital evidence handling and documentation best practices.' },
];

const IRC_CATEGORIES = [
  { key: 'all',       label: 'All' },
  { key: 'canadian',  label: '🍁 Canadian' },
  { key: 'corporate', label: '🏢 Corporate' },
  { key: 'osint',     label: '🔍 OSINT' },
  { key: 'github',    label: '💻 GitHub' },
  { key: 'reddit',    label: '🔴 Reddit' },
  { key: 'youtube',   label: '▶️ YouTube' },
  { key: 'ai',        label: '🤖 AI' },
  { key: 'downloads', label: '📥 Downloads' },
  { key: 'extensions',label: '🧩 Extensions' },
  { key: 'learning',  label: '📚 Learning' },
  { key: 'reference', label: '📖 Reference' },
];

let _ircCurrentCat  = 'all';
let _ircSearchTerm  = '';

function loadIrcFavs() {
  try { return JSON.parse(localStorage.getItem(LS_IRC_FAVS_KEY) || '[]'); } catch { return []; }
}
function saveIrcFavs(favs) { localStorage.setItem(LS_IRC_FAVS_KEY, JSON.stringify(favs)); }
function isIrcFav(id) { return loadIrcFavs().includes(id); }
function toggleIrcFav(id) {
  let favs = loadIrcFavs();
  if (favs.includes(id)) { favs = favs.filter(f => f !== id); }
  else { favs.unshift(id); if (favs.length > 50) favs = favs.slice(0, 50); }
  saveIrcFavs(favs);
}

function trackRecentlyUsed(item) {
  let ru = [];
  try { ru = JSON.parse(localStorage.getItem(LS_RECENTLY_USED) || '[]'); } catch {}
  ru = ru.filter(r => r.id !== item.id);
  ru.unshift({ id: item.id, label: item.label, icon: item.icon, url: item.url, ts: Date.now() });
  if (ru.length > 10) ru = ru.slice(0, 10);
  localStorage.setItem(LS_RECENTLY_USED, JSON.stringify(ru));
  renderRecentlyUsed();
}

function renderIrcGrid() {
  const container = document.getElementById('irc-grid');
  if (!container) return;

  const favs    = loadIrcFavs();
  const term    = _ircSearchTerm.toLowerCase();
  let   visible = IRC_DATA.filter(r => {
    const catOk  = _ircCurrentCat === 'all' || r.cat === _ircCurrentCat;
    const termOk = !term || r.label.toLowerCase().includes(term) || r.desc.toLowerCase().includes(term) || r.cat.includes(term);
    return catOk && termOk;
  });

  // Favorites first
  visible.sort((a, b) => {
    const aFav = favs.includes(a.id) ? 0 : 1;
    const bFav = favs.includes(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  if (visible.length === 0) {
    container.innerHTML = '<div class="irc-no-results">No resources match your search.</div>';
    return;
  }

  container.innerHTML = visible.map(r => {
    const fav = favs.includes(r.id);
    return `
      <div class="irc-card">
        <div class="irc-card-header">
          <span class="irc-card-icon">${r.icon}</span>
          <span class="irc-card-label">${escapeHtmlV32(r.label)}</span>
          <button class="irc-card-fav${fav ? ' starred' : ''}" data-irc-id="${r.id}" title="${fav ? 'Remove favorite' : 'Add to favorites'}">
            ${fav ? '⭐' : '☆'}
          </button>
        </div>
        <div class="irc-card-cat">${r.cat}</div>
        <div class="irc-card-desc">${escapeHtmlV32(r.desc)}</div>
        <button class="irc-card-launch" data-irc-id="${r.id}" data-url="${escapeHtmlV32(r.url)}">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          Launch
        </button>
      </div>`;
  }).join('');

  container.querySelectorAll('.irc-card-launch').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = IRC_DATA.find(r => r.id === btn.dataset.ircId);
      if (item) { window.open(item.url, '_blank', 'noopener,noreferrer'); trackRecentlyUsed(item); }
    });
  });

  container.querySelectorAll('.irc-card-fav').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleIrcFav(btn.dataset.ircId);
      renderIrcGrid();
      renderDashboardIrcFavs();
    });
  });
}

function initIrc() {
  // Category tabs
  const catTabsEl = document.getElementById('irc-cat-tabs');
  if (catTabsEl) {
    catTabsEl.innerHTML = IRC_CATEGORIES.map(c =>
      `<button class="irc-cat-btn${c.key === 'all' ? ' active' : ''}" data-cat="${c.key}">${c.label}</button>`
    ).join('');
    catTabsEl.querySelectorAll('.irc-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catTabsEl.querySelectorAll('.irc-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        _ircCurrentCat = btn.dataset.cat;
        renderIrcGrid();
      });
    });
  }

  // Search
  const searchEl = document.getElementById('irc-search');
  if (searchEl) {
    searchEl.addEventListener('input', () => {
      _ircSearchTerm = searchEl.value;
      renderIrcGrid();
    });
  }

  renderIrcGrid();
}


/* ════════════════════════════════════════════════════════════
   INVESTIGATOR TOOLKIT
   ════════════════════════════════════════════════════════════ */

const TOOLKIT_TOOLS = [
  { id:'passgen',    label:'Password Generator',    icon:'🔐' },
  { id:'passcheck',  label:'Password Strength',     icon:'💪' },
  { id:'hash',       label:'Hash Generator',        icon:'#️⃣' },
  { id:'uuid',       label:'UUID Generator',        icon:'🆔' },
  { id:'timestamp',  label:'Timestamp Converter',   icon:'🕐' },
  { id:'url-enc',    label:'URL Encoder / Decoder', icon:'🔗' },
  { id:'base64',     label:'Base64 Encode / Decode',icon:'📦' },
  { id:'json',       label:'JSON Formatter',        icon:'{ }' },
  { id:'regex',      label:'Regex Tester',          icon:'.*' },
  { id:'color',      label:'Colour Picker',         icon:'🎨' },
  { id:'lorem',      label:'Lorem Ipsum Generator', icon:'📝' },
  { id:'qrgen',      label:'QR Code Generator',     icon:'▦' },
  { id:'htmlenc',    label:'HTML Entity Encoder',   icon:'&lt;&gt;' },
];

let _activeTool = 'passgen';

function initToolkit() {
  const listEl  = document.getElementById('tk-tool-list');
  const panelEl = document.getElementById('tk-panel');
  if (!listEl || !panelEl) return;

  listEl.innerHTML = TOOLKIT_TOOLS.map(t =>
    `<button class="tk-tool-btn${t.id === _activeTool ? ' active' : ''}" data-tool="${t.id}">
      <span class="tk-tool-icon">${t.icon}</span>${t.label}
    </button>`
  ).join('');

  listEl.querySelectorAll('.tk-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      listEl.querySelectorAll('.tk-tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _activeTool = btn.dataset.tool;
      renderToolPanel(panelEl, _activeTool);
    });
  });

  renderToolPanel(panelEl, _activeTool);
}

function renderToolPanel(el, toolId) {
  el.innerHTML = '';
  const fns = {
    passgen:   renderPassGen,
    passcheck: renderPassCheck,
    hash:      renderHash,
    uuid:      renderUUID,
    timestamp: renderTimestamp,
    'url-enc': renderUrlEnc,
    base64:    renderBase64,
    json:      renderJson,
    regex:     renderRegex,
    color:     renderColor,
    lorem:     renderLorem,
    qrgen:     renderQrGen,
    htmlenc:   renderHtmlEnc,
  };
  if (fns[toolId]) fns[toolId](el);
}

// ── Password Generator ──────────────────────────────────────
function renderPassGen(el) {
  el.innerHTML = `
    <div class="tk-panel-title">🔐 Password Generator</div>
    <label class="tk-label">Length: <span id="pg-len-val">20</span></label>
    <input type="range" class="tk-range" id="pg-len" min="8" max="64" value="20" style="margin-bottom:10px" />
    <div class="tk-checkbox-row">
      <label class="tk-cb-label"><input type="checkbox" id="pg-upper" checked /> Uppercase (A–Z)</label>
      <label class="tk-cb-label"><input type="checkbox" id="pg-lower" checked /> Lowercase (a–z)</label>
      <label class="tk-cb-label"><input type="checkbox" id="pg-nums"  checked /> Numbers (0–9)</label>
      <label class="tk-cb-label"><input type="checkbox" id="pg-syms"  checked /> Symbols (!@#…)</label>
    </div>
    <div class="tk-output large" id="pg-output">—</div>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="pg-gen">Generate</button>
      <button class="qa-btn" id="pg-copy">Copy</button>
    </div>`;
  const lenEl = el.querySelector('#pg-len');
  const lenValEl = el.querySelector('#pg-len-val');
  lenEl.addEventListener('input', () => { lenValEl.textContent = lenEl.value; });
  const gen = () => {
    let charset = '';
    if (el.querySelector('#pg-upper').checked) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (el.querySelector('#pg-lower').checked) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (el.querySelector('#pg-nums').checked)  charset += '0123456789';
    if (el.querySelector('#pg-syms').checked)  charset += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    if (!charset) { showToast('Select at least one character type.', 'error'); return; }
    const len = parseInt(lenEl.value);
    const arr = new Uint32Array(len);
    crypto.getRandomValues(arr);
    const pwd = Array.from(arr).map(v => charset[v % charset.length]).join('');
    el.querySelector('#pg-output').textContent = pwd;
  };
  el.querySelector('#pg-gen').addEventListener('click', gen);
  el.querySelector('#pg-copy').addEventListener('click', () => {
    const pwd = el.querySelector('#pg-output').textContent;
    if (pwd && pwd !== '—') { navigator.clipboard.writeText(pwd).then(() => showToast('Copied!', 'success')); }
  });
  gen();
}

// ── Password Strength ───────────────────────────────────────
function renderPassCheck(el) {
  el.innerHTML = `
    <div class="tk-panel-title">💪 Password Strength Checker</div>
    <input class="field" id="pc-input" type="text" placeholder="Enter a password to check…" autocomplete="new-password" />
    <div class="strength-bar-track" style="margin-top:8px"><div class="strength-bar-fill" id="pc-bar"></div></div>
    <div class="strength-label" id="pc-label" style="color:var(--text-dim);margin-top:4px">—</div>
    <div class="tk-check-list" id="pc-checks" style="margin-top:8px">
      <div class="tk-check-item" id="pcc-len">✗ At least 12 characters</div>
      <div class="tk-check-item" id="pcc-upper">✗ Uppercase letter</div>
      <div class="tk-check-item" id="pcc-lower">✗ Lowercase letter</div>
      <div class="tk-check-item" id="pcc-num">✗ Number</div>
      <div class="tk-check-item" id="pcc-sym">✗ Symbol</div>
    </div>`;
  const colors = ['var(--red)', 'var(--red)', 'var(--yellow)', 'var(--amber)', 'var(--green)'];
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  el.querySelector('#pc-input').addEventListener('input', function() {
    const v = this.value;
    const checks = {
      len:   v.length >= 12,
      upper: /[A-Z]/.test(v),
      lower: /[a-z]/.test(v),
      num:   /[0-9]/.test(v),
      sym:   /[^A-Za-z0-9]/.test(v),
    };
    const score = Object.values(checks).filter(Boolean).length;
    const bar   = el.querySelector('#pc-bar');
    bar.style.width      = `${score * 20}%`;
    bar.style.background = colors[score];
    el.querySelector('#pc-label').textContent  = v ? labels[score] : '—';
    el.querySelector('#pc-label').style.color  = v ? colors[score] : 'var(--text-dim)';
    [['pcc-len',checks.len],['pcc-upper',checks.upper],['pcc-lower',checks.lower],['pcc-num',checks.num],['pcc-sym',checks.sym]]
      .forEach(([id, ok]) => {
        const item = el.querySelector(`#${id}`);
        item.classList.toggle('pass', ok);
        item.textContent = (ok ? '✓ ' : '✗ ') + item.textContent.slice(2);
      });
  });
}

// ── Hash Generator ──────────────────────────────────────────
function renderHash(el) {
  el.innerHTML = `
    <div class="tk-panel-title">#️⃣ Hash Generator</div>
    <label class="tk-label">Algorithm</label>
    <select class="tk-select" id="hash-algo" style="margin-bottom:8px">
      <option value="SHA-1">SHA-1</option>
      <option value="SHA-256" selected>SHA-256</option>
      <option value="SHA-512">SHA-512</option>
      <option value="SHA-384">SHA-384</option>
    </select>
    <textarea class="tk-textarea" id="hash-input" placeholder="Enter text to hash…"></textarea>
    <div class="tk-output" id="hash-output" style="font-size:10.5px;word-break:break-all">—</div>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="hash-gen">Generate Hash</button>
      <button class="qa-btn" id="hash-copy">Copy</button>
    </div>`;
  const gen = async () => {
    const text  = el.querySelector('#hash-input').value;
    const algo  = el.querySelector('#hash-algo').value;
    if (!text) { el.querySelector('#hash-output').textContent = '—'; return; }
    const enc    = new TextEncoder();
    const data   = enc.encode(text);
    const buf    = await crypto.subtle.digest(algo, data);
    const hex    = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    el.querySelector('#hash-output').textContent = hex;
  };
  el.querySelector('#hash-gen').addEventListener('click', gen);
  el.querySelector('#hash-copy').addEventListener('click', () => {
    const h = el.querySelector('#hash-output').textContent;
    if (h && h !== '—') navigator.clipboard.writeText(h).then(() => showToast('Copied!', 'success'));
  });
  el.querySelector('#hash-input').addEventListener('keydown', e => { if (e.ctrlKey && e.key === 'Enter') gen(); });
}

// ── UUID Generator ──────────────────────────────────────────
function renderUUID(el) {
  const history = [];
  el.innerHTML = `
    <div class="tk-panel-title">🆔 UUID Generator</div>
    <div class="tk-output large" id="uuid-out" style="font-size:13px;letter-spacing:.5px">—</div>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="uuid-gen">Generate UUID</button>
      <button class="qa-btn" id="uuid-copy">Copy</button>
    </div>
    <div style="margin-top:10px">
      <span class="tk-label">Recent UUIDs</span>
      <div id="uuid-history" class="tk-output multiline" style="font-size:10.5px;min-height:50px;color:var(--text-dim)">—</div>
    </div>`;
  const gen = () => {
    const id = crypto.randomUUID();
    el.querySelector('#uuid-out').textContent = id;
    history.unshift(id);
    if (history.length > 5) history.pop();
    el.querySelector('#uuid-history').textContent = history.join('\n') || '—';
  };
  el.querySelector('#uuid-gen').addEventListener('click', gen);
  el.querySelector('#uuid-copy').addEventListener('click', () => {
    const v = el.querySelector('#uuid-out').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
  });
  gen();
}

// ── Timestamp Converter ─────────────────────────────────────
function renderTimestamp(el) {
  el.innerHTML = `
    <div class="tk-panel-title">🕐 Timestamp Converter</div>
    <label class="tk-label">Unix Timestamp → Human Date</label>
    <div class="tk-row">
      <input class="field" id="ts-unix" type="number" placeholder="Unix timestamp (e.g. 1700000000)" style="flex:1" />
      <button class="qa-btn qa-btn-accent" id="ts-to-human">Convert</button>
    </div>
    <div class="tk-output" id="ts-human-out">—</div>
    <label class="tk-label" style="margin-top:10px">Human Date → Unix Timestamp</label>
    <div class="tk-row">
      <input class="field" id="ts-date" type="datetime-local" style="flex:1" />
      <button class="qa-btn qa-btn-accent" id="ts-to-unix">Convert</button>
    </div>
    <div class="tk-output" id="ts-unix-out">—</div>
    <div class="tk-row" style="margin-top:4px">
      <button class="qa-btn" id="ts-now">Current Timestamp</button>
    </div>`;
  el.querySelector('#ts-to-human').addEventListener('click', () => {
    const v = el.querySelector('#ts-unix').value.trim();
    if (!v) return;
    const d = new Date(parseInt(v) * (v.length <= 10 ? 1000 : 1));
    el.querySelector('#ts-human-out').textContent = d.toISOString() + '  (' + d.toLocaleString('en-CA') + ')';
  });
  el.querySelector('#ts-to-unix').addEventListener('click', () => {
    const v = el.querySelector('#ts-date').value;
    if (!v) return;
    el.querySelector('#ts-unix-out').textContent = Math.floor(new Date(v).getTime() / 1000).toString();
  });
  el.querySelector('#ts-now').addEventListener('click', () => {
    const now = Math.floor(Date.now() / 1000);
    el.querySelector('#ts-unix').value = now;
    el.querySelector('#ts-human-out').textContent = new Date().toISOString();
  });
}

// ── URL Encoder / Decoder ───────────────────────────────────
function renderUrlEnc(el) {
  el.innerHTML = `
    <div class="tk-panel-title">🔗 URL Encoder / Decoder</div>
    <textarea class="tk-textarea" id="url-input" placeholder="Enter text or URL…"></textarea>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="url-enc-btn">Encode</button>
      <button class="qa-btn" id="url-dec-btn">Decode</button>
      <button class="qa-btn" id="url-copy">Copy</button>
    </div>
    <div class="tk-output multiline" id="url-output">—</div>`;
  el.querySelector('#url-enc-btn').addEventListener('click', () => {
    const v = el.querySelector('#url-input').value;
    el.querySelector('#url-output').textContent = encodeURIComponent(v) || '—';
  });
  el.querySelector('#url-dec-btn').addEventListener('click', () => {
    try { el.querySelector('#url-output').textContent = decodeURIComponent(el.querySelector('#url-input').value) || '—'; }
    catch { showToast('Invalid URL-encoded string.', 'error'); }
  });
  el.querySelector('#url-copy').addEventListener('click', () => {
    const v = el.querySelector('#url-output').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
  });
}

// ── Base64 ──────────────────────────────────────────────────
function renderBase64(el) {
  el.innerHTML = `
    <div class="tk-panel-title">📦 Base64 Encoder / Decoder</div>
    <textarea class="tk-textarea" id="b64-input" placeholder="Enter text to encode or Base64 to decode…"></textarea>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="b64-enc">Encode</button>
      <button class="qa-btn" id="b64-dec">Decode</button>
      <button class="qa-btn" id="b64-copy">Copy</button>
    </div>
    <div class="tk-output multiline" id="b64-output">—</div>`;
  el.querySelector('#b64-enc').addEventListener('click', () => {
    try { el.querySelector('#b64-output').textContent = btoa(unescape(encodeURIComponent(el.querySelector('#b64-input').value))); }
    catch { showToast('Encoding error.', 'error'); }
  });
  el.querySelector('#b64-dec').addEventListener('click', () => {
    try { el.querySelector('#b64-output').textContent = decodeURIComponent(escape(atob(el.querySelector('#b64-input').value.trim()))); }
    catch { showToast('Invalid Base64 string.', 'error'); }
  });
  el.querySelector('#b64-copy').addEventListener('click', () => {
    const v = el.querySelector('#b64-output').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
  });
}

// ── JSON Formatter ──────────────────────────────────────────
function renderJson(el) {
  el.innerHTML = `
    <div class="tk-panel-title">{ } JSON Formatter</div>
    <textarea class="tk-textarea" id="json-input" placeholder="Paste JSON here…" style="min-height:90px"></textarea>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="json-fmt">Format / Prettify</button>
      <button class="qa-btn" id="json-min">Minify</button>
      <button class="qa-btn" id="json-copy">Copy</button>
    </div>
    <div class="tk-output multiline" id="json-output" style="min-height:100px;font-size:10.5px">—</div>`;
  const fmt = (indent) => {
    try {
      const parsed = JSON.parse(el.querySelector('#json-input').value);
      el.querySelector('#json-output').textContent = JSON.stringify(parsed, null, indent);
    } catch(e) { showToast('Invalid JSON: ' + e.message, 'error'); }
  };
  el.querySelector('#json-fmt').addEventListener('click', () => fmt(2));
  el.querySelector('#json-min').addEventListener('click', () => fmt(0));
  el.querySelector('#json-copy').addEventListener('click', () => {
    const v = el.querySelector('#json-output').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
  });
}

// ── Regex Tester ────────────────────────────────────────────
function renderRegex(el) {
  el.innerHTML = `
    <div class="tk-panel-title">.* Regex Tester</div>
    <div class="tk-row">
      <input class="field" id="rx-pattern" type="text" placeholder="Regular expression…" style="flex:1;font-family:JetBrains Mono,monospace" />
      <select class="tk-select" id="rx-flags">
        <option value="g">g</option>
        <option value="gi">gi</option>
        <option value="gm">gm</option>
        <option value="gim">gim</option>
        <option value="i">i</option>
      </select>
    </div>
    <textarea class="tk-textarea" id="rx-test" placeholder="Test string…" style="min-height:70px"></textarea>
    <button class="qa-btn qa-btn-accent" id="rx-run" style="margin-bottom:8px">Test</button>
    <div class="tk-regex-result" id="rx-result"><span style="color:var(--text-dim);font-size:11px;font-style:italic">Enter a pattern and test string.</span></div>`;
  el.querySelector('#rx-run').addEventListener('click', () => {
    const pattern = el.querySelector('#rx-pattern').value;
    const flags   = el.querySelector('#rx-flags').value;
    const testStr = el.querySelector('#rx-test').value;
    const resEl   = el.querySelector('#rx-result');
    if (!pattern) { resEl.innerHTML = '<span style="color:var(--text-dim)">No pattern entered.</span>'; return; }
    try {
      const rx      = new RegExp(pattern, flags);
      const matches = [...testStr.matchAll(new RegExp(pattern, flags.includes('g') ? flags : flags + 'g'))];
      if (matches.length === 0) {
        resEl.innerHTML = '<span style="color:var(--red)">No matches found.</span>';
        return;
      }
      let highlighted = testStr.replace(rx, m => `<span class="tk-regex-match">${escapeHtmlV32(m)}</span>`);
      resEl.innerHTML = `<div style="margin-bottom:6px;font-size:10.5px;color:var(--green)">${matches.length} match${matches.length === 1 ? '' : 'es'}</div><div style="font-family:JetBrains Mono,monospace;font-size:11px;line-height:1.7;word-break:break-all">${highlighted}</div>`;
    } catch(e) { resEl.innerHTML = `<span style="color:var(--red)">Error: ${escapeHtmlV32(e.message)}</span>`; }
  });
}

// ── Colour Picker ───────────────────────────────────────────
function renderColor(el) {
  el.innerHTML = `
    <div class="tk-panel-title">🎨 Colour Picker</div>
    <div class="tk-row" style="align-items:flex-start;gap:12px">
      <input type="color" class="tk-color-swatch" id="color-pick" value="#c0152a" />
      <div style="flex:1">
        <div class="tk-color-values">
          <div class="tk-color-val"><div class="tk-color-val-label">HEX</div><div class="tk-color-val-text" id="color-hex">#c0152a</div></div>
          <div class="tk-color-val"><div class="tk-color-val-label">RGB</div><div class="tk-color-val-text" id="color-rgb">192, 21, 42</div></div>
          <div class="tk-color-val"><div class="tk-color-val-label">HSL</div><div class="tk-color-val-text" id="color-hsl">352°, 80%, 42%</div></div>
        </div>
        <div class="tk-row" style="margin-top:8px">
          <button class="qa-btn" id="color-copy-hex">Copy HEX</button>
          <button class="qa-btn" id="color-copy-rgb">Copy RGB</button>
        </div>
      </div>
    </div>`;
  const hexToRgb = hex => {
    const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
    return { r, g, b };
  };
  const rgbToHsl = (r,g,b) => {
    r/=255; g/=255; b/=255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    let h,s,l=(max+min)/2;
    if (max===min) { h=s=0; }
    else {
      const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){ case r:h=(g-b)/d+(g<b?6:0);break; case g:h=(b-r)/d+2;break; case b:h=(r-g)/d+4;break; }
      h=Math.round(h*60); s=Math.round(s*100); l=Math.round(l*100);
    }
    return { h, s, l };
  };
  const update = (hex) => {
    const {r,g,b} = hexToRgb(hex);
    const {h,s,l} = rgbToHsl(r,g,b);
    el.querySelector('#color-hex').textContent = hex;
    el.querySelector('#color-rgb').textContent = `${r}, ${g}, ${b}`;
    el.querySelector('#color-hsl').textContent = `${h}°, ${s}%, ${l}%`;
  };
  el.querySelector('#color-pick').addEventListener('input', function(){ update(this.value); });
  el.querySelector('#color-copy-hex').addEventListener('click', () => {
    navigator.clipboard.writeText(el.querySelector('#color-hex').textContent).then(() => showToast('HEX copied!', 'success'));
  });
  el.querySelector('#color-copy-rgb').addEventListener('click', () => {
    navigator.clipboard.writeText(`rgb(${el.querySelector('#color-rgb').textContent})`).then(() => showToast('RGB copied!', 'success'));
  });
}

// ── Lorem Ipsum Generator ───────────────────────────────────
const LOREM_WORDS = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit voluptate velit esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum'.split(' ');
function loremSentence() {
  const len = 8 + Math.floor(Math.random() * 10);
  return LOREM_WORDS.slice(0).sort(() => .5 - Math.random()).slice(0, len).join(' ') + '.';
}
function renderLorem(el) {
  el.innerHTML = `
    <div class="tk-panel-title">📝 Lorem Ipsum Generator</div>
    <div class="tk-row">
      <select class="tk-select" id="lorem-type">
        <option value="paragraphs">Paragraphs</option>
        <option value="sentences">Sentences</option>
        <option value="words">Words</option>
      </select>
      <input class="field" id="lorem-count" type="number" min="1" max="20" value="3" style="width:70px" />
      <button class="qa-btn qa-btn-accent" id="lorem-gen">Generate</button>
      <button class="qa-btn" id="lorem-copy">Copy</button>
    </div>
    <div class="tk-output multiline" id="lorem-output" style="min-height:90px;font-size:11px">—</div>`;
  const gen = () => {
    const type  = el.querySelector('#lorem-type').value;
    const count = Math.max(1, Math.min(20, parseInt(el.querySelector('#lorem-count').value) || 3));
    let result  = '';
    if (type === 'paragraphs') {
      result = Array.from({length: count}, () =>
        Array.from({length: 4 + Math.floor(Math.random()*4)}, loremSentence).join(' ')
      ).join('\n\n');
    } else if (type === 'sentences') {
      result = Array.from({length: count}, loremSentence).join(' ');
    } else {
      result = LOREM_WORDS.slice(0).sort(() => .5 - Math.random()).slice(0, count).join(' ') + '.';
    }
    el.querySelector('#lorem-output').textContent = result;
  };
  el.querySelector('#lorem-gen').addEventListener('click', gen);
  el.querySelector('#lorem-copy').addEventListener('click', () => {
    const v = el.querySelector('#lorem-output').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
  });
  gen();
}

// ── QR Code Generator ───────────────────────────────────────
function renderQrGen(el) {
  el.innerHTML = `
    <div class="tk-panel-title">▦ QR Code Generator</div>
    <input class="field" id="qr-input" type="text" placeholder="Text or URL to encode…" style="margin-bottom:8px" />
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="qr-gen-btn">Generate QR</button>
    </div>
    <div id="qr-output"></div>
    <div id="qr-hint" style="font-size:10.5px;color:var(--text-dim);text-align:center;margin-top:4px"></div>`;
  el.querySelector('#qr-gen-btn').addEventListener('click', () => {
    const text = el.querySelector('#qr-input').value.trim();
    if (!text) { showToast('Enter text or a URL.', 'error'); return; }
    const out  = el.querySelector('#qr-output');
    out.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(out, { text, width: 180, height: 180, colorDark: '#000', colorLight: '#fff' });
      el.querySelector('#qr-hint').textContent = 'Right-click the QR code to save.';
    } else {
      // Fallback: Google Charts API
      const img = document.createElement('img');
      img.src    = `https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=${encodeURIComponent(text)}&chld=M|2`;
      img.alt    = 'QR Code';
      img.style.cssText = 'border:3px solid #fff;border-radius:4px';
      out.appendChild(img);
      el.querySelector('#qr-hint').textContent = 'Right-click the QR code to save.';
    }
  });
  el.querySelector('#qr-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') el.querySelector('#qr-gen-btn').click();
  });
}

// ── HTML Entity Encoder ─────────────────────────────────────
function renderHtmlEnc(el) {
  el.innerHTML = `
    <div class="tk-panel-title">&lt;&gt; HTML Entity Encoder</div>
    <textarea class="tk-textarea" id="html-input" placeholder="Enter text to encode or encoded HTML to decode…"></textarea>
    <div class="tk-row">
      <button class="qa-btn qa-btn-accent" id="html-enc-btn">Encode</button>
      <button class="qa-btn" id="html-dec-btn">Decode</button>
      <button class="qa-btn" id="html-copy">Copy</button>
    </div>
    <div class="tk-output multiline" id="html-output">—</div>`;
  el.querySelector('#html-enc-btn').addEventListener('click', () => {
    const v = el.querySelector('#html-input').value;
    el.querySelector('#html-output').textContent = v
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;').replace(/'/g,'&#039;') || '—';
  });
  el.querySelector('#html-dec-btn').addEventListener('click', () => {
    const txt = document.createElement('textarea');
    txt.innerHTML = el.querySelector('#html-input').value;
    el.querySelector('#html-output').textContent = txt.value || '—';
  });
  el.querySelector('#html-copy').addEventListener('click', () => {
    const v = el.querySelector('#html-output').textContent;
    if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
  });
}


/* ════════════════════════════════════════════════════════════
   GLOBAL SEARCH
   ════════════════════════════════════════════════════════════ */

// Build a flat search index combining IRC resources, toolkit tools, QB templates
function buildSearchIndex() {
  const idx = [];
  IRC_DATA.forEach(r => idx.push({ label: r.label, desc: r.desc.slice(0,60), cat: r.cat, icon: r.icon, type: 'resource', action: () => { window.open(r.url,'_blank','noopener,noreferrer'); trackRecentlyUsed(r); } }));
  TOOLKIT_TOOLS.forEach(t => idx.push({ label: t.label, desc: 'Investigator Toolkit', cat: 'toolkit', icon: t.icon, type: 'tool', action: () => switchToTool(t.id) }));
  return idx;
}

function switchToTool(toolId) {
  // Switch to toolkit tab
  document.querySelectorAll('.tab-btn[data-tab]').forEach(b => {
    const active = b.dataset.tab === 'toolkit';
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-pane[id^="tab-"]').forEach(p =>
    p.classList.toggle('active', p.id === 'tab-toolkit')
  );
  // Activate the tool
  const toolBtn = document.querySelector(`.tk-tool-btn[data-tool="${toolId}"]`);
  if (toolBtn) toolBtn.click();
}

let _searchIdx = null;
function initGlobalSearch() {
  _searchIdx = buildSearchIndex();
  const input    = document.getElementById('global-search');
  const dropdown = document.getElementById('global-search-results');
  const clearBtn = document.getElementById('global-search-clear');
  if (!input || !dropdown) return;

  input.addEventListener('input', () => {
    const term = input.value.trim().toLowerCase();
    if (clearBtn) clearBtn.classList.toggle('visible', term.length > 0);
    if (!term || term.length < 2) { dropdown.classList.remove('open'); return; }

    const results = _searchIdx.filter(r =>
      r.label.toLowerCase().includes(term) || (r.desc && r.desc.toLowerCase().includes(term)) || r.cat.includes(term)
    ).slice(0, 12);

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="gsr-empty">No results found.</div>';
      dropdown.classList.add('open');
      return;
    }

    // Group by type
    const groups = {};
    results.forEach(r => { (groups[r.type] = groups[r.type] || []).push(r); });
    const typeLabels = { resource: 'Resources', tool: 'Toolkit', template: 'Templates' };

    dropdown.innerHTML = Object.entries(groups).map(([type, items]) =>
      `<div class="gsr-section-head">${typeLabels[type] || type}</div>` +
      items.map((r, i) =>
        `<div class="gsr-item" data-gi="${type}-${i}">
          <span class="gsr-item-icon">${r.icon}</span>
          <span class="gsr-item-label">${escapeHtmlV32(r.label)}</span>
          <span class="gsr-item-cat">${r.cat}</span>
        </div>`
      ).join('')
    ).join('');

    let allItems = [];
    Object.entries(groups).forEach(([type, items]) => items.forEach((r,i) => allItems.push({ key:`${type}-${i}`, action: r.action })));
    dropdown.querySelectorAll('.gsr-item').forEach(el => {
      const item = allItems.find(x => x.key === el.dataset.gi);
      if (item) el.addEventListener('click', () => { item.action(); input.value = ''; dropdown.classList.remove('open'); if (clearBtn) clearBtn.classList.remove('visible'); });
    });

    dropdown.classList.add('open');
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = ''; dropdown.classList.remove('open'); clearBtn.classList.remove('visible'); input.focus();
    });
  }

  // Close on outside click
  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.remove('open');
  });

  // Keyboard nav
  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { dropdown.classList.remove('open'); input.blur(); }
  });
}


/* ════════════════════════════════════════════════════════════
   DASHBOARD v3.2 ADDITIONS
   ════════════════════════════════════════════════════════════ */

const DASH_TIPS = [
  { label: 'Google Operator', text: 'Use <code>site:gc.ca filetype:pdf</code> to search only Canadian government PDF documents.' },
  { label: 'Boolean Logic',   text: 'Combine terms with <code>OR</code> to broaden: <code>"John Smith" OR "J. Smith"</code> catches both forms.' },
  { label: 'Exact Match',     text: 'Wrap names in quotes for exact matches: <code>"John Smith"</code> prevents mixed results.' },
  { label: 'Social OSINT',    text: 'Use <code>site:linkedin.com "Name"</code> to find LinkedIn profiles via Google.' },
  { label: 'Metadata',        text: 'PDFs and images often contain hidden metadata — author names, GPS coordinates, device info.' },
  { label: 'Archive Research',text: 'Wayback Machine (<code>web.archive.org</code>) lets you view deleted or changed web pages.' },
  { label: 'Privacy Tip',     text: 'Use a dedicated browser profile for OSINT work — isolates cookies and prevents cross-contamination.' },
  { label: 'Evidence',        text: 'Screenshot and timestamp evidence immediately. Web content can disappear within hours.' },
  { label: 'Username OSINT',  text: 'A consistent username across platforms is one of the strongest personal identifiers.' },
  { label: 'WHOIS Research',  text: 'Historical WHOIS data often reveals past owners and registrant contact info for domains.' },
];

let _tipIndex = 0;
function renderDashTip() {
  const el = document.getElementById('dash-rotating-tip');
  if (!el) return;
  const tip = DASH_TIPS[_tipIndex % DASH_TIPS.length];
  el.innerHTML = `<div class="dash-tip-label">💡 ${tip.label}</div><div class="dash-tip-text">${tip.text.replace(/<code>/g,'<span class="qb-tip-code">').replace(/<\/code>/g,'</span>')}</div>`;
}

function renderDashboardIrcFavs() {
  const el = document.getElementById('dash-irc-favs');
  if (!el) return;
  const favIds = loadIrcFavs();
  const items  = favIds.map(id => IRC_DATA.find(r => r.id === id)).filter(Boolean).slice(0, 6);
  if (items.length === 0) {
    el.innerHTML = '<div class="history-empty">No favorited resources. Star items in the Resource Center.</div>';
    return;
  }
  el.innerHTML = items.map(r =>
    `<div class="ru-item" data-url="${escapeHtmlV32(r.url)}" data-id="${r.id}">
      <span class="ru-icon">${r.icon}</span>
      <span class="ru-label">${escapeHtmlV32(r.label)}</span>
      <span class="ru-open">↗</span>
    </div>`
  ).join('');
  el.querySelectorAll('.ru-item').forEach(item => {
    item.addEventListener('click', () => {
      const resource = IRC_DATA.find(r => r.id === item.dataset.id);
      if (resource) { window.open(resource.url, '_blank', 'noopener,noreferrer'); trackRecentlyUsed(resource); }
    });
  });
}

function renderRecentlyUsed() {
  const el = document.getElementById('dash-recently-used');
  if (!el) return;
  let ru = [];
  try { ru = JSON.parse(localStorage.getItem(LS_RECENTLY_USED) || '[]'); } catch {}
  if (ru.length === 0) {
    el.innerHTML = '<div class="history-empty">No recently used resources yet.</div>';
    return;
  }
  el.innerHTML = ru.slice(0,6).map(r =>
    `<div class="ru-item" data-url="${escapeHtmlV32(r.url)}">
      <span class="ru-icon">${r.icon || '🔗'}</span>
      <span class="ru-label">${escapeHtmlV32(r.label)}</span>
      <span class="ru-open">↗</span>
    </div>`
  ).join('');
  el.querySelectorAll('.ru-item').forEach(item => {
    item.addEventListener('click', () => window.open(item.dataset.url, '_blank', 'noopener,noreferrer'));
  });
}

const FEATURED = [
  { badge: 'dfc-badge-tool',   label: 'Investigator Toolkit',    desc: 'Hash generator, UUID, QR codes, regex tester and more — all in one tab.',  action: () => { document.querySelector('.tab-btn[data-tab="toolkit"]')?.click(); } },
  { badge: 'dfc-badge-github', label: 'SpiderFoot OSINT',        desc: 'Automated OSINT collection across 200+ modules — GitHub project.',          action: () => window.open('https://github.com/smicallef/spiderfoot','_blank','noopener') },
  { badge: 'dfc-badge-learn',  label: 'OSINT Framework',         desc: 'Visual map of every OSINT tool and technique — bookmark this.',              action: () => window.open('https://osintframework.com','_blank','noopener') },
  { badge: 'dfc-badge-tip',    label: 'Query Builder',            desc: '80+ professional search templates across People, Legal, Gov and more.',     action: () => { document.querySelector('.tab-btn[data-tab="qb"]')?.click(); } },
];

function renderFeatured() {
  const el = document.getElementById('dash-featured-grid');
  if (!el) return;
  el.innerHTML = FEATURED.map((f, i) =>
    `<div class="dash-featured-card" data-fi="${i}">
      <span class="dfc-badge ${f.badge}">${f.badge.includes('tool') ? 'TOOL' : f.badge.includes('github') ? 'GITHUB' : f.badge.includes('learn') ? 'RESOURCE' : 'QUICK'}</span>
      <div class="dfc-label">${escapeHtmlV32(f.label)}</div>
      <div class="dfc-desc">${escapeHtmlV32(f.desc)}</div>
    </div>`
  ).join('');
  el.querySelectorAll('.dash-featured-card').forEach(card => {
    const fi = parseInt(card.dataset.fi);
    card.addEventListener('click', FEATURED[fi].action);
  });
}


/* ════════════════════════════════════════════════════════════
   UTILITY
   ════════════════════════════════════════════════════════════ */
function escapeHtmlV32(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type) {
  // falls back to the existing showToast defined in script.js
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent  = msg;
  toast.className    = `toast toast-${type} show`;
  setTimeout(() => toast.classList.remove('show'), 2400);
}


/* ════════════════════════════════════════════════════════════
   INITIALISATION
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initIrc();
  initToolkit();
  initGlobalSearch();
  renderDashTip();
  renderFeatured();
  renderDashboardIrcFavs();
  renderRecentlyUsed();

  // Rotating tip — cycle every 12s on click or auto
  const tipEl = document.getElementById('dash-rotating-tip');
  if (tipEl) {
    tipEl.addEventListener('click', () => { _tipIndex++; renderDashTip(); });
    setInterval(() => { _tipIndex++; renderDashTip(); }, 15000);
  }
});
