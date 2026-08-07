/**
 * OSINT Investigator v3.2.1 — v32.js
 * Intelligence Resource Center | Investigator Toolkit | Global Search | Dashboard
 */

'use strict';

/* ════════════════════════════════════════════════════════════
   IRC DATA  —  v3.2.1 Community Expansion
   ════════════════════════════════════════════════════════════ */

const LS_IRC_FAVS_KEY  = 'osint_irc_favorites';
const LS_RECENTLY_USED = 'osint_recently_used';

// Fields: id, label, icon, cat, url, desc, difficulty, bestFor, github (optional)
const IRC_DATA = [

  // ── Canadian Intelligence ─────────────────────────────────────────────────
  { id:'canlii',         label:'CanLII',                      icon:'⚖️',  cat:'canadian',  difficulty:'beginner',     bestFor:'Case law, legislation, regulations across all Canadian jurisdictions',
    url:'https://www.canlii.org',
    desc:'Canadian Legal Information Institute — the most comprehensive free database of Canadian case law and legislation.' },

  { id:'parl',           label:'Parliament of Canada',        icon:'🏛️',  cat:'canadian',  difficulty:'beginner',     bestFor:'Hansard debates, MP voting records, bills, Senate proceedings',
    url:'https://www.parl.ca',
    desc:'Official portal for the Parliament of Canada — debates, bills, MP and Senator profiles, and committee records.' },

  { id:'justice-ca',     label:'Justice Canada — Laws',       icon:'📜',  cat:'canadian',  difficulty:'beginner',     bestFor:'Federal legislation and consolidated regulations',
    url:'https://laws-lois.justice.gc.ca',
    desc:'Complete consolidated database of all federal Acts and Regulations from the Department of Justice.' },

  { id:'fed-court',      label:'Federal Court of Canada',     icon:'⚖️',  cat:'canadian',  difficulty:'intermediate', bestFor:'Federal civil litigation, immigration appeals, judicial review',
    url:'https://www.fct-cf.gc.ca',
    desc:'Federal Court decisions, filings, judge profiles and procedural information.' },

  { id:'scc',            label:'Supreme Court of Canada',     icon:'🏛️',  cat:'canadian',  difficulty:'intermediate', bestFor:'Landmark decisions, constitutional law, leave to appeal applications',
    url:'https://www.scc-csc.ca',
    desc:'All SCC decisions, leave applications, and real-time hearing schedules.' },

  { id:'ont-courts',     label:'Ontario Court Lists',         icon:'📋',  cat:'canadian',  difficulty:'beginner',     bestFor:'Daily Ontario court scheduling, hearing dates',
    url:'https://www.ontariocourts.ca/ocj/scheduling-and-court-lists/',
    desc:'Daily Ontario Court of Justice scheduling and court lists for all courtrooms.' },

  { id:'chrc',           label:'Canadian Human Rights Commission', icon:'🛡️', cat:'canadian', difficulty:'beginner',  bestFor:'Human rights complaints, decisions, annual reports',
    url:'https://www.chrc-ccdp.gc.ca',
    desc:'CHRC decisions, complaints process, and anti-discrimination resources.' },

  { id:'statcan',        label:'Statistics Canada',           icon:'📊',  cat:'canadian',  difficulty:'beginner',     bestFor:'Census data, demographic profiles, economic statistics',
    url:'https://www.statcan.gc.ca',
    desc:'Official Canadian statistics, census data, population profiles and economic research.' },

  { id:'open-gov',       label:'Open Government Canada',      icon:'🇨🇦', cat:'canadian',  difficulty:'beginner',     bestFor:'Federal datasets, ATIP disclosures, proactive disclosure',
    url:'https://open.canada.ca',
    desc:'Federal open datasets, proactive disclosure records, and government APIs.' },

  { id:'public-safety',  label:'Public Safety Canada',        icon:'🛡️',  cat:'canadian',  difficulty:'beginner',     bestFor:'National security, public safety policy, organized crime reports',
    url:'https://www.publicsafety.gc.ca',
    desc:'National security, emergency management and law enforcement resources.' },

  { id:'elections-ca',   label:'Elections Canada',            icon:'🗳️',  cat:'canadian',  difficulty:'beginner',     bestFor:'Political financing, riding results, candidate registrations',
    url:'https://www.elections.ca',
    desc:'Electoral information, riding profiles, political financing and donation records.' },

  { id:'lobbyist-ca',    label:'Lobbyists Registration',      icon:'📋',  cat:'canadian',  difficulty:'intermediate', bestFor:'Lobbyist-government interactions, lobbying disclosures',
    url:'https://lobbycanada.gc.ca',
    desc:'Search the Federal Registry of Lobbyists — who is lobbying whom in Ottawa.' },

  { id:'access-info',    label:'Access to Information',       icon:'📂',  cat:'canadian',  difficulty:'intermediate', bestFor:'Government ATIP requests, proactive disclosure summaries',
    url:'https://www.canada.ca/en/treasury-board-secretariat/services/access-information-privacy.html',
    desc:'Guide to submitting Access to Information and Privacy (ATIP) requests to federal departments.' },

  { id:'rcmp',           label:'RCMP',                        icon:'🚔',  cat:'canadian',  difficulty:'beginner',     bestFor:'Press releases, wanted persons, missing persons, crime stats',
    url:'https://www.rcmp-grc.gc.ca',
    desc:'Royal Canadian Mounted Police — news releases, wanted persons, crime statistics, and public safety alerts.' },

  { id:'irb',            label:'Immigration & Refugee Board', icon:'⚖️',  cat:'canadian',  difficulty:'intermediate', bestFor:'Immigration tribunal decisions, refugee claim outcomes',
    url:'https://irb.gc.ca',
    desc:'IRB decisions, guidelines and processes for immigration and refugee hearings.' },

  { id:'oipc-bc',        label:'OIPC British Columbia',       icon:'🔐',  cat:'canadian',  difficulty:'intermediate', bestFor:'BC privacy and information access decisions, breach reports',
    url:'https://www.oipc.bc.ca',
    desc:'BC Office of the Information and Privacy Commissioner — decisions and investigation reports.' },

  { id:'ipc-ontario',    label:'IPC Ontario',                 icon:'🔐',  cat:'canadian',  difficulty:'intermediate', bestFor:'Ontario privacy rulings, breach notifications, access decisions',
    url:'https://www.ipc.on.ca',
    desc:'Ontario Information and Privacy Commissioner — rulings on privacy breaches and access requests.' },

  // ── Username Intelligence ─────────────────────────────────────────────────
  { id:'whatsmyname',    label:'WhatsMyName',                 icon:'👤',  cat:'username',  difficulty:'beginner',     bestFor:'Username enumeration across social networks, dating sites, forums',
    url:'https://whatsmyname.app',
    github:'https://github.com/WebBreacher/WhatsMyName',
    desc:'Web-based username search across 500+ sites — maintained by OSINT community volunteers.' },

  { id:'namechk',        label:'Namechk',                     icon:'🔎',  cat:'username',  difficulty:'beginner',     bestFor:'Checking username availability and registration across platforms',
    url:'https://namechk.com',
    desc:'Check username and domain availability across dozens of social and web platforms simultaneously.' },

  { id:'namecheckr',     label:'Namecheckr',                  icon:'🔎',  cat:'username',  difficulty:'beginner',     bestFor:'Username availability research across social platforms',
    url:'https://www.namecheckr.com',
    desc:'Search username availability across major social networks and platforms in one query.' },

  { id:'sherlock-web',   label:'Sherlock (Web)',               icon:'🔍',  cat:'username',  difficulty:'intermediate', bestFor:'Username OSINT across 400+ platforms',
    url:'https://sherlock-project.github.io',
    github:'https://github.com/sherlock-project/sherlock',
    desc:'Sherlock online interface — hunt social media accounts by username across 400+ websites.' },

  { id:'maigret-web',    label:'Maigret (Web)',                icon:'🕵️',  cat:'username',  difficulty:'intermediate', bestFor:'Deep username profiling across 3000+ sites',
    url:'https://github.com/soxoj/maigret',
    github:'https://github.com/soxoj/maigret',
    desc:'Collect a detailed dossier on a person by username — checks 3000+ sites and aggregates profile data.' },

  { id:'ghunt-web',      label:'GHunt',                       icon:'👻',  cat:'username',  difficulty:'advanced',     bestFor:'Google account profiling from Gmail addresses',
    url:'https://github.com/mxrch/GHunt',
    github:'https://github.com/mxrch/GHunt',
    desc:'Extract public Google account information — calendar data, Maps contributions, YouTube activity — from a Gmail address.' },

  { id:'holehe-web',     label:'Holehe',                      icon:'🦩',  cat:'username',  difficulty:'intermediate', bestFor:'Checking if an email is linked to accounts on 120+ sites',
    url:'https://github.com/megadose/holehe',
    github:'https://github.com/megadose/holehe',
    desc:'Check if an email address is attached to registered accounts across 120+ websites without sending password resets.' },

  { id:'social-analyzer', label:'Social Analyzer',            icon:'👥',  cat:'username',  difficulty:'advanced',     bestFor:'Cross-platform username and profile analysis at scale',
    url:'https://github.com/qeeqbox/social-analyzer',
    github:'https://github.com/qeeqbox/social-analyzer',
    desc:'API and web app for analyzing and finding a person\'s profile across 1000+ social networks.' },

  { id:'usersearch',     label:'UserSearch.org',              icon:'🔎',  cat:'username',  difficulty:'beginner',     bestFor:'Quick username lookups across popular platforms',
    url:'https://usersearch.org',
    desc:'Search for usernames across major social platforms — simple, fast, no signup required.' },

  { id:'instantusername', label:'Instant Username Search',    icon:'⚡',  cat:'username',  difficulty:'beginner',     bestFor:'Real-time username availability across social media',
    url:'https://instantusername.com',
    desc:'Real-time username search that checks 100+ social networks as you type.' },

  // ── Email Intelligence ────────────────────────────────────────────────────
  { id:'haveibeenpwned', label:'Have I Been Pwned',           icon:'🔐',  cat:'email',     difficulty:'beginner',     bestFor:'Checking if an email appeared in known data breaches',
    url:'https://haveibeenpwned.com',
    desc:'The definitive breach notification service — check if an email address has appeared in known data breaches.' },

  { id:'mozilla-monitor', label:'Mozilla Monitor',            icon:'🦊',  cat:'email',     difficulty:'beginner',     bestFor:'Email breach monitoring with guided remediation steps',
    url:'https://monitor.firefox.com',
    desc:'Mozilla\'s free breach monitoring service — scans for your email in breach databases and guides you through next steps.' },

  { id:'hunter-io',      label:'Hunter.io',                   icon:'🎯',  cat:'email',     difficulty:'intermediate', bestFor:'Finding professional email addresses for a domain',
    url:'https://hunter.io',
    desc:'Search for professional email addresses associated with any company domain — includes confidence scoring.' },

  { id:'emailhippo',     label:'EmailHippo',                  icon:'🦛',  cat:'email',     difficulty:'beginner',     bestFor:'Email address validation and deliverability verification',
    url:'https://tools.emailhippo.com',
    desc:'Verify whether an email address is real and deliverable — no email is sent to the address.' },

  { id:'mailtester',     label:'Mail Tester',                 icon:'📧',  cat:'email',     difficulty:'beginner',     bestFor:'Email server configuration, spam scoring',
    url:'https://www.mail-tester.com',
    desc:'Test email deliverability and spam score — useful for verifying mail server configuration.' },

  { id:'mxtoolbox',      label:'MXToolbox',                   icon:'🔧',  cat:'email',     difficulty:'intermediate', bestFor:'Email infrastructure, MX records, blacklist checking',
    url:'https://mxtoolbox.com',
    desc:'Comprehensive email and DNS diagnostics — MX lookup, blacklist check, SMTP test, and header analysis.' },

  { id:'epieos',         label:'Epieos',                      icon:'🔍',  cat:'email',     difficulty:'intermediate', bestFor:'Reverse email lookup, linked accounts, Google account info',
    url:'https://epieos.com',
    desc:'Reverse email lookup tool — find linked social media accounts, Google profile data, and related identifiers.' },

  { id:'phonebook-cz',   label:'Phonebook.cz',                icon:'📖',  cat:'email',     difficulty:'intermediate', bestFor:'Email and domain OSINT from breach data',
    url:'https://phonebook.cz',
    desc:'Intelligence X phonebook — search breached emails, domains and URLs across indexed breach data.' },

  // ── Domain & Infrastructure Intelligence ─────────────────────────────────
  { id:'shodan',         label:'Shodan',                      icon:'🌐',  cat:'domain',    difficulty:'advanced',     bestFor:'Internet-connected device discovery, exposed services, ICS/SCADA',
    url:'https://www.shodan.io',
    desc:'The search engine for internet-connected devices — find servers, cameras, routers, and exposed industrial control systems.' },

  { id:'censys',         label:'Censys',                      icon:'🔭',  cat:'domain',    difficulty:'advanced',     bestFor:'Certificate transparency, ASN research, host enumeration',
    url:'https://search.censys.io',
    desc:'Internet-wide scanning platform — search hosts, certificates, and domains across the full IPv4 address space.' },

  { id:'securitytrails', label:'SecurityTrails',              icon:'🛤️',  cat:'domain',    difficulty:'intermediate', bestFor:'Historical DNS, subdomain discovery, IP history',
    url:'https://securitytrails.com',
    desc:'Historical DNS data, subdomain enumeration, IP address history and WHOIS analysis.' },

  { id:'crtsh',          label:'crt.sh',                      icon:'📜',  cat:'domain',    difficulty:'intermediate', bestFor:'Certificate transparency log search, subdomain discovery',
    url:'https://crt.sh',
    desc:'Certificate Transparency log search — find all SSL/TLS certificates issued for a domain, often revealing hidden subdomains.' },

  { id:'dnsdumpster',    label:'DNSDumpster',                 icon:'🗺️',  cat:'domain',    difficulty:'intermediate', bestFor:'DNS reconnaissance, subdomain mapping, MX/NS record discovery',
    url:'https://dnsdumpster.com',
    desc:'Free domain research tool — DNS records, subdomains, and network mapping with a visual graph output.' },

  { id:'viewdns',        label:'ViewDNS.info',                icon:'🔍',  cat:'domain',    difficulty:'beginner',     bestFor:'IP history, reverse IP lookup, WHOIS, DNS propagation',
    url:'https://viewdns.info',
    desc:'Collection of DNS and domain intelligence tools — reverse IP, IP history, WHOIS, traceroute, and more.' },

  { id:'builtwith',      label:'BuiltWith',                   icon:'🔨',  cat:'domain',    difficulty:'beginner',     bestFor:'Identifying website technology stack, CMS, hosting, analytics',
    url:'https://builtwith.com',
    desc:'Discover what technology a website is built with — CMS, frameworks, hosting, marketing tools, and analytics.' },

  { id:'netcraft',       label:'Netcraft',                    icon:'🐟',  cat:'domain',    difficulty:'intermediate', bestFor:'Website hosting history, operating system fingerprinting, phishing reports',
    url:'https://www.netcraft.com/tools/',
    desc:'Web server survey and anti-phishing tools — uptime history, OS detection, and site risk rating.' },

  { id:'urlscan',        label:'urlscan.io',                  icon:'🔬',  cat:'domain',    difficulty:'intermediate', bestFor:'Safe URL analysis, screenshot capture, resource enumeration',
    url:'https://urlscan.io',
    desc:'Scan URLs in a sandboxed environment — get screenshots, resource lists, outbound links, and DOM content without visiting the site.' },

  { id:'virustotal',     label:'VirusTotal',                  icon:'🦠',  cat:'domain',    difficulty:'beginner',     bestFor:'URL/domain/IP/file reputation checking, malware analysis',
    url:'https://www.virustotal.com',
    desc:'Analyze URLs, domains, IPs, and files against 70+ antivirus engines and threat intelligence databases.' },

  { id:'hybridanalysis', label:'Hybrid Analysis',             icon:'🔬',  cat:'domain',    difficulty:'advanced',     bestFor:'Deep malware analysis, behavioral sandbox reports',
    url:'https://www.hybrid-analysis.com',
    desc:'Free malware analysis service — behavioral sandbox execution with detailed reports on file system, registry, and network activity.' },

  { id:'alienvault-otx', label:'AlienVault OTX',              icon:'👽',  cat:'domain',    difficulty:'intermediate', bestFor:'Threat intelligence pulses, IOC sharing, IP/domain reputation',
    url:'https://otx.alienvault.com',
    desc:'Open Threat Exchange — community-powered threat intelligence with IOC lookup for IPs, domains, and file hashes.' },

  { id:'greynoise',      label:'GreyNoise Community',         icon:'📡',  cat:'domain',    difficulty:'intermediate', bestFor:'Separating targeted attacks from internet background noise',
    url:'https://viz.greynoise.io',
    desc:'GreyNoise analyzes internet-wide scanning and noise — determine if an IP is a scanner, mass exploit tool, or targeted threat.' },

  { id:'securityheaders', label:'Security Headers',           icon:'🔒',  cat:'domain',    difficulty:'beginner',     bestFor:'Web security header analysis, CSP/HSTS auditing',
    url:'https://securityheaders.com',
    desc:'Analyze HTTP response headers for a website — grade its security posture based on HSTS, CSP, X-Frame-Options, and more.' },

  { id:'ipinfo',         label:'IPinfo',                      icon:'📍',  cat:'domain',    difficulty:'beginner',     bestFor:'IP geolocation, ASN lookup, carrier and VPN detection',
    url:'https://ipinfo.io',
    desc:'IP address intelligence — geolocation, ASN, hosting provider, and VPN/proxy/Tor detection.' },

  { id:'bgpview',        label:'BGPView',                     icon:'🌐',  cat:'domain',    difficulty:'advanced',     bestFor:'BGP routing, ASN relationships, IP prefix ownership',
    url:'https://bgpview.io',
    desc:'BGP routing intelligence — ASN details, IP prefix announcements, and network peer relationships.' },

  { id:'whoisfreaks',    label:'WhoisFreaks',                 icon:'📋',  cat:'domain',    difficulty:'beginner',     bestFor:'WHOIS lookup, registrant history, domain monitoring',
    url:'https://whoisfreaks.com',
    desc:'Detailed WHOIS data, historical registrant records, and domain intelligence lookups.' },

  // ── Image Intelligence ────────────────────────────────────────────────────
  { id:'google-lens',    label:'Google Lens',                 icon:'📷',  cat:'image',     difficulty:'beginner',     bestFor:'Reverse image search, landmark identification, product recognition',
    url:'https://lens.google.com',
    desc:'Google\'s visual search engine — reverse image search, identify objects, landmarks, text in photos, and find similar images.' },

  { id:'tineye',         label:'TinEye',                      icon:'👁️',  cat:'image',     difficulty:'beginner',     bestFor:'Tracking image origin, finding older/higher-res versions',
    url:'https://tineye.com',
    desc:'The original reverse image search engine — find where an image came from and all versions of it across the web.' },

  { id:'bing-visual',    label:'Bing Visual Search',          icon:'🔍',  cat:'image',     difficulty:'beginner',     bestFor:'Reverse image search, shopping identification, related content',
    url:'https://www.bing.com/visualsearch',
    desc:'Microsoft\'s reverse image search — often surfaces different results than Google Lens.' },

  { id:'yandex-images',  label:'Yandex Images',               icon:'🔴',  cat:'image',     difficulty:'beginner',     bestFor:'Face recognition in images, superior results for Eastern European/Russian content',
    url:'https://yandex.com/images/',
    desc:'Yandex reverse image search — widely considered the most effective for facial recognition in open-source investigations.' },

  { id:'exifdata',       label:'Jeffrey\'s Exif Viewer',      icon:'🗂️',  cat:'image',     difficulty:'intermediate', bestFor:'Extracting GPS coordinates, camera model, and timestamps from photos',
    url:'http://exif.regex.info/exif.cgi',
    desc:'Upload a photo or enter a URL to extract all embedded EXIF metadata — GPS coordinates, device model, software version.' },

  { id:'metadata2go',    label:'Metadata2Go',                 icon:'📄',  cat:'image',     difficulty:'beginner',     bestFor:'Metadata extraction from images, PDFs, audio, video files',
    url:'https://www.metadata2go.com',
    desc:'Extract metadata from images, audio, video, and document files — supports dozens of file formats.' },

  { id:'jimpl',          label:'Jimpl EXIF Viewer',           icon:'🔎',  cat:'image',     difficulty:'beginner',     bestFor:'Quick EXIF metadata extraction, GPS mapping',
    url:'https://jimpl.com',
    desc:'Online EXIF metadata viewer — upload an image to see hidden data including GPS location shown on a map.' },

  { id:'berify',         label:'Berify',                      icon:'🔐',  cat:'image',     difficulty:'beginner',     bestFor:'Image originality verification, reverse search across multiple engines',
    url:'https://berify.com',
    desc:'Searches multiple reverse image engines simultaneously — Google, Bing, and specialized databases.' },

  // ── Social Media Intelligence ─────────────────────────────────────────────
  { id:'sm-linkedin',    label:'LinkedIn',                    icon:'💼',  cat:'social',    difficulty:'beginner',     bestFor:'Professional profiles, employment history, corporate connections',
    url:'https://www.linkedin.com',
    desc:'Professional network — search by name, company, job title, and location. Invaluable for corporate and professional intelligence.' },

  { id:'sm-facebook',    label:'Facebook',                    icon:'📘',  cat:'social',    difficulty:'beginner',     bestFor:'Personal profiles, groups, events, timeline research',
    url:'https://www.facebook.com',
    desc:'World\'s largest social network — public profiles, group memberships, events, and check-ins.' },

  { id:'sm-instagram',   label:'Instagram',                   icon:'📸',  cat:'social',    difficulty:'beginner',     bestFor:'Photo intelligence, location tags, follower networks',
    url:'https://www.instagram.com',
    desc:'Photo and video sharing platform — geotagged posts, follower relationships, and story highlights.' },

  { id:'sm-reddit',      label:'Reddit',                      icon:'🔴',  cat:'social',    difficulty:'beginner',     bestFor:'Community discussions, account history, interest profiling',
    url:'https://www.reddit.com',
    desc:'Discussion platform — search by username, subreddit, or keyword. Comment history often reveals detailed personal information.' },

  { id:'sm-x',           label:'X (Twitter)',                 icon:'𝕏',   cat:'social',    difficulty:'beginner',     bestFor:'Real-time posts, follower analysis, network mapping, keyword monitoring',
    url:'https://x.com',
    desc:'Microblogging platform — search posts, follower networks, account creation dates, and repost patterns.' },

  { id:'sm-threads',     label:'Threads',                     icon:'🧵',  cat:'social',    difficulty:'beginner',     bestFor:'Meta\'s text-based social network, Instagram-linked profiles',
    url:'https://www.threads.net',
    desc:'Meta\'s text-based platform linked to Instagram — cross-reference with Instagram profiles for extended digital footprint.' },

  { id:'sm-bluesky',     label:'Bluesky',                     icon:'🦋',  cat:'social',    difficulty:'beginner',     bestFor:'Decentralized social media, journalist/researcher networks',
    url:'https://bsky.app',
    desc:'Decentralized social network — growing adoption among journalists, researchers, and privacy-conscious users.' },

  { id:'sm-tiktok',      label:'TikTok',                      icon:'🎵',  cat:'social',    difficulty:'beginner',     bestFor:'Video content, comment intelligence, younger demographic profiling',
    url:'https://www.tiktok.com',
    desc:'Short video platform — profile research, video content analysis, comment networks, and hashtag intelligence.' },

  { id:'sm-telegram',    label:'Telegram',                    icon:'✈️',  cat:'social',    difficulty:'intermediate', bestFor:'Channel monitoring, group intelligence, message search',
    url:'https://web.telegram.org',
    desc:'Encrypted messaging platform with public channels — widely used by news organizations, activists, and criminal enterprises.' },

  { id:'sm-pinterest',   label:'Pinterest',                   icon:'📌',  cat:'social',    difficulty:'beginner',     bestFor:'Interest profiling, image intelligence, linked accounts',
    url:'https://www.pinterest.ca',
    desc:'Visual bookmarking platform — boards and pins reveal interests, locations, and cross-platform account links.' },

  { id:'sm-mastodon',    label:'Mastodon',                    icon:'🐘',  cat:'social',    difficulty:'intermediate', bestFor:'Decentralized network research, journalist/researcher profiling',
    url:'https://mastodon.social',
    desc:'Federated social network — search across instances for researchers, journalists, and privacy-focused communities.' },

  { id:'sm-youtube',     label:'YouTube',                     icon:'▶️',  cat:'social',    difficulty:'beginner',     bestFor:'Video content analysis, channel intelligence, comment research',
    url:'https://www.youtube.com',
    desc:'Search YouTube channels, video content, comments, and channel metadata for investigative leads.' },

  { id:'snapchat-map',   label:'Snap Map',                    icon:'👻',  cat:'social',    difficulty:'beginner',     bestFor:'Geolocated public Snapchat stories, event monitoring',
    url:'https://map.snapchat.com',
    desc:'Snap Map — browse geotagged public Snapchat stories. Useful for event monitoring and location-based intelligence.' },

  // ── Corporate Intelligence ─────────────────────────────────────────────────
  { id:'fed-corp-srch',  label:'Corporations Canada',         icon:'🏢',  cat:'corporate', difficulty:'beginner',     bestFor:'Federal corporate searches, officer/director lookups',
    url:'https://ised-isde.canada.ca/cc/lgcy/fdrl/srch/index?lang=eng',
    desc:'Search federal corporations and societies registered with Industry Canada — officers, directors, status.' },

  { id:'ont-biz',        label:'Ontario Business Registry',   icon:'📋',  cat:'corporate', difficulty:'beginner',     bestFor:'Ontario corporate registrations, registered agents',
    url:'https://www.ontario.ca/page/ontario-business-registry',
    desc:'Search Ontario business and not-for-profit corporations, partnerships, and sole proprietorships.' },

  { id:'bc-registry',    label:'BC Corporate Registry',       icon:'📋',  cat:'corporate', difficulty:'beginner',     bestFor:'BC company registrations, director filings, name searches',
    url:'https://www.bcregistry.gov.bc.ca',
    desc:'BC Registries — company, business name, and society searches across British Columbia.' },

  { id:'ab-registry',    label:'Alberta Corporate Registry',  icon:'📋',  cat:'corporate', difficulty:'beginner',     bestFor:'Alberta business registrations, corporate searches',
    url:'https://www.alberta.ca/search-corporate-registry.aspx',
    desc:'Search the Alberta corporate registry for registered businesses, corporations, and trade names.' },

  { id:'sk-registry',    label:'Saskatchewan Corporate Registry', icon:'📋', cat:'corporate', difficulty:'beginner',  bestFor:'Saskatchewan business and corporate registrations',
    url:'https://corporateregistry.saskatchewan.ca',
    desc:'Saskatchewan Corporate Registry — search business registrations, annual returns, and corporate status.' },

  { id:'mb-registry',    label:'Manitoba Companies Office',   icon:'📋',  cat:'corporate', difficulty:'beginner',     bestFor:'Manitoba business searches and corporate filings',
    url:'https://companiesoffice.gov.mb.ca',
    desc:'Manitoba Companies Office — search corporate registrations, trade names, and annual returns.' },

  { id:'ns-registry',    label:'Nova Scotia Registry',        icon:'📋',  cat:'corporate', difficulty:'beginner',     bestFor:'Nova Scotia business registrations and corporate searches',
    url:'https://rjsc.novascotia.ca',
    desc:'Nova Scotia Registry of Joint Stock Companies — search corporate filings and business registrations.' },

  { id:'opencorp',       label:'OpenCorporates',              icon:'🌐',  cat:'corporate', difficulty:'beginner',     bestFor:'Global company searches, cross-jurisdiction corporate mapping',
    url:'https://opencorporates.com',
    desc:'Largest open database of companies in the world — 200M+ entities across 140+ jurisdictions.' },

  { id:'sedar',          label:'SEDAR+',                      icon:'📈',  cat:'corporate', difficulty:'intermediate', bestFor:'Canadian public company filings, annual reports, prospectuses',
    url:'https://www.sedarplus.ca',
    desc:'Canadian securities regulatory filing system — annual reports, financial statements, material change reports for public companies.' },

  { id:'lobbyist-ca2',   label:'Federal Lobbyist Registry',   icon:'📋',  cat:'corporate', difficulty:'intermediate', bestFor:'Identifying lobbying activities, government-corporate relationships',
    url:'https://lobbycanada.gc.ca',
    desc:'Search who is registered to lobby the federal government — clients, lobbyists, and communications logs.' },

  { id:'buyandsell',     label:'Government Procurement',      icon:'📑',  cat:'corporate', difficulty:'intermediate', bestFor:'Federal contracts, tender notices, supplier awards',
    url:'https://buyandsell.gc.ca',
    desc:'Canadian federal government procurement portal — tender notices, awarded contracts, and supplier information.' },

  // ── OSINT Frameworks & Communities ───────────────────────────────────────
  { id:'osint-framework', label:'OSINT Framework',            icon:'🕸️',  cat:'osint',     difficulty:'beginner',     bestFor:'Finding the right OSINT tool for any investigation type',
    url:'https://osintframework.com',
    desc:'Interactive visual map of OSINT resources organized by category — the starting point for any investigation.' },

  { id:'inteltechniques', label:'IntelTechniques',            icon:'🔍',  cat:'osint',     difficulty:'intermediate', bestFor:'Custom search tools, OSINT training, privacy guides',
    url:'https://inteltechniques.com',
    desc:'Michael Bazzell\'s premier OSINT resource — custom search tools, books, podcast, and training for investigators.' },

  { id:'bellingcat-tk',   label:'Bellingcat Online Investigation Toolkit', icon:'🔔', cat:'osint', difficulty:'beginner', bestFor:'Finding the right tool for geolocation, verification, social media OSINT',
    url:'https://bellingcat.gitbook.io/toolkit',
    desc:'Bellingcat\'s curated toolkit for open-source investigations — organized by task type.' },

  { id:'osint-combine',  label:'OSINT Combine',               icon:'🔗',  cat:'osint',     difficulty:'beginner',     bestFor:'Free pivot tools, link analysis, multi-platform search',
    url:'https://www.osintcombine.com',
    desc:'Free OSINT tools from cybersecurity professionals — multi-platform search, pivot tools, and analysis utilities.' },

  { id:'osint-curious',  label:'OSINT Curious',               icon:'🧐',  cat:'osint',     difficulty:'beginner',     bestFor:'OSINT education, weekly webcasts, technique tutorials',
    url:'https://osintcurio.us',
    desc:'Community-driven OSINT education — weekly webcasts, technique write-ups, and the OSINT Curious podcast.' },

  { id:'osint-dojo',     label:'OSINT Dojo',                  icon:'🥋',  cat:'osint',     difficulty:'beginner',     bestFor:'Structured OSINT training, challenges, skill progression',
    url:'https://www.osintdojo.com',
    desc:'Structured OSINT training platform — progressive challenges, techniques, and resources for building investigation skills.' },

  { id:'osint-industries', label:'OSINT Industries',          icon:'🏭',  cat:'osint',     difficulty:'advanced',     bestFor:'Professional OSINT investigations, aggregated data sources',
    url:'https://www.osint.industries',
    desc:'Professional-grade OSINT investigation platform used by law enforcement and corporate investigators.' },

  { id:'sector035',      label:'Sector035',                   icon:'📡',  cat:'osint',     difficulty:'intermediate', bestFor:'Cutting-edge OSINT techniques, tool reviews, weekly updates',
    url:'https://sector035.nl',
    desc:'Weekly OSINT round-ups and deep-dive technique articles from a respected European OSINT practitioner.' },

  { id:'awesome-osint',  label:'Awesome OSINT',               icon:'⭐',  cat:'osint',     difficulty:'beginner',     bestFor:'Comprehensive OSINT resource directory, tool discovery',
    url:'https://github.com/jivoi/awesome-osint',
    github:'https://github.com/jivoi/awesome-osint',
    desc:'Community-maintained curated list of OSINT tools, resources, and references — one of GitHub\'s most starred OSINT repos.' },

  { id:'osint-me',       label:'OSINT.me',                    icon:'🕵️',  cat:'osint',     difficulty:'beginner',     bestFor:'Quick reference tools, user lookup, domain tools',
    url:'https://osint.me',
    desc:'Collection of free OSINT tools categorized by investigation type — quick access to lookup utilities.' },

  { id:'technisette',    label:'Technisette Resources',       icon:'🗂️',  cat:'osint',     difficulty:'intermediate', bestFor:'Curated OSINT resource lists, investigative tools',
    url:'https://start.me/p/rx6Qj8/nixintel-s-osint-resource-list',
    desc:'Nixintel\'s curated OSINT resource list — one of the most comprehensive investigator-maintained collections.' },

  // ── GitHub Projects ───────────────────────────────────────────────────────
  { id:'spiderfoot',     label:'SpiderFoot',                  icon:'🕷️',  cat:'github',    difficulty:'intermediate', bestFor:'Automated OSINT collection, threat intelligence, attack surface mapping',
    url:'https://www.spiderfoot.net',
    github:'https://github.com/smicallef/spiderfoot',
    desc:'Automated OSINT collection and threat intelligence — 200+ modules for IP, domain, email, username and more.' },

  { id:'sherlock',       label:'Sherlock',                    icon:'🔎',  cat:'github',    difficulty:'beginner',     bestFor:'Username enumeration across 400+ social platforms',
    url:'https://github.com/sherlock-project/sherlock',
    github:'https://github.com/sherlock-project/sherlock',
    desc:'Hunt down social media accounts by username across 400+ platforms with a single command.' },

  { id:'maigret',        label:'Maigret',                     icon:'🕵️',  cat:'github',    difficulty:'intermediate', bestFor:'Deep username OSINT — 3000+ site checks with profile aggregation',
    url:'https://github.com/soxoj/maigret',
    github:'https://github.com/soxoj/maigret',
    desc:'Collect a dossier on a person by username — checks 3000+ sites and compiles linked profiles, bios, and social graphs.' },

  { id:'ghunt',          label:'GHunt',                       icon:'👻',  cat:'github',    difficulty:'advanced',     bestFor:'Google account OSINT, Gmail-based profiling',
    url:'https://github.com/mxrch/GHunt',
    github:'https://github.com/mxrch/GHunt',
    desc:'Offensive Google framework — extract calendar, Maps, YouTube and other Google data from a Gmail address.' },

  { id:'holehe',         label:'Holehe',                      icon:'🦩',  cat:'github',    difficulty:'beginner',     bestFor:'Email-to-account correlation across 120+ websites',
    url:'https://github.com/megadose/holehe',
    github:'https://github.com/megadose/holehe',
    desc:'Check if an email address is registered on 120+ websites — without triggering password resets.' },

  { id:'theharvester',   label:'theHarvester',                icon:'🌾',  cat:'github',    difficulty:'intermediate', bestFor:'Domain email enumeration, subdomain harvesting, passive recon',
    url:'https://github.com/laramies/theHarvester',
    github:'https://github.com/laramies/theHarvester',
    desc:'Gather emails, subdomains, IPs, and URLs from public sources — the standard passive recon tool for initial assessments.' },

  { id:'photon',         label:'Photon',                      icon:'📷',  cat:'github',    difficulty:'intermediate', bestFor:'Web crawling for OSINT — extracting emails, phone numbers, files',
    url:'https://github.com/s0md3v/Photon',
    github:'https://github.com/s0md3v/Photon',
    desc:'Fast crawler designed for OSINT — extracts URLs, emails, phone numbers, API keys, and linked files.' },

  { id:'recon-ng',       label:'Recon-ng',                    icon:'🔭',  cat:'github',    difficulty:'advanced',     bestFor:'Structured web reconnaissance with modular framework',
    url:'https://github.com/lanmaster53/recon-ng',
    github:'https://github.com/lanmaster53/recon-ng',
    desc:'Full-featured web reconnaissance framework modeled after Metasploit — dozens of modules for automated data gathering.' },

  { id:'bbot',           label:'BBOT',                        icon:'🤖',  cat:'github',    difficulty:'advanced',     bestFor:'Recursive attack surface mapping, subdomain enumeration, OSINT automation',
    url:'https://github.com/blacklanternsecurity/bbot',
    github:'https://github.com/blacklanternsecurity/bbot',
    desc:'Recursive internet scanner — OSINT and attack surface mapping with 100+ modules, designed for enterprise-scale recon.' },

  { id:'finalrecon',     label:'FinalRecon',                  icon:'🏁',  cat:'github',    difficulty:'intermediate', bestFor:'All-in-one web recon — headers, SSL, WHOIS, DNS, crawling',
    url:'https://github.com/thewhiteh4t/FinalRecon',
    github:'https://github.com/thewhiteh4t/FinalRecon',
    desc:'Automated web reconnaissance tool — header analysis, SSL certificates, WHOIS, DNS enumeration, and web crawling.' },

  { id:'amass',          label:'Amass',                       icon:'🌐',  cat:'github',    difficulty:'advanced',     bestFor:'In-depth subdomain enumeration, DNS intelligence, network mapping',
    url:'https://github.com/owasp-amass/amass',
    github:'https://github.com/owasp-amass/amass',
    desc:'OWASP\'s attack surface mapping tool — aggressive subdomain enumeration, DNS brute-forcing, and network graph generation.' },

  { id:'subfinder',      label:'Subfinder',                   icon:'🔍',  cat:'github',    difficulty:'intermediate', bestFor:'Passive subdomain discovery using 40+ sources',
    url:'https://github.com/projectdiscovery/subfinder',
    github:'https://github.com/projectdiscovery/subfinder',
    desc:'Fast passive subdomain discovery using 40+ passive sources — certificate logs, DNS databases, and search engines.' },

  { id:'httpx',          label:'httpx',                       icon:'🌐',  cat:'github',    difficulty:'intermediate', bestFor:'Fast HTTP probing, web server fingerprinting, bulk URL analysis',
    url:'https://github.com/projectdiscovery/httpx',
    github:'https://github.com/projectdiscovery/httpx',
    desc:'Fast HTTP toolkit for probing servers — status codes, titles, tech stack, and bulk URL analysis at scale.' },

  { id:'katana',         label:'Katana',                      icon:'⚔️',  cat:'github',    difficulty:'advanced',     bestFor:'Advanced web crawling, JavaScript rendering, link extraction',
    url:'https://github.com/projectdiscovery/katana',
    github:'https://github.com/projectdiscovery/katana',
    desc:'Next-generation web crawling framework — handles JavaScript-rendered content, form discovery, and structured data extraction.' },

  { id:'eyewitness',     label:'EyeWitness',                  icon:'👁️',  cat:'github',    difficulty:'intermediate', bestFor:'Screenshot capture of bulk URLs, web application triage',
    url:'https://github.com/RedSiege/EyeWitness',
    github:'https://github.com/RedSiege/EyeWitness',
    desc:'Screenshot web applications, RDP services, and VNC servers — rapidly triage large numbers of URLs with visual output.' },

  { id:'metagoofil',     label:'Metagoofil',                  icon:'📄',  cat:'github',    difficulty:'intermediate', bestFor:'Metadata extraction from public documents, user and path enumeration',
    url:'https://github.com/laramies/metagoofil',
    github:'https://github.com/laramies/metagoofil',
    desc:'Extract metadata from public documents (PDFs, DOCs, XLS) — reveals usernames, software versions, and file paths.' },

  { id:'nuclei',         label:'Nuclei',                      icon:'⚡',  cat:'github',    difficulty:'advanced',     bestFor:'Vulnerability scanning with community templates, fast assessments',
    url:'https://github.com/projectdiscovery/nuclei',
    github:'https://github.com/projectdiscovery/nuclei',
    desc:'Fast, template-based vulnerability scanner with 9000+ community templates — exposed panels, misconfigured services, CVEs.' },

  { id:'social-analyzer', label:'Social Analyzer',            icon:'👥',  cat:'github',    difficulty:'advanced',     bestFor:'Cross-platform username and profile analysis at scale',
    url:'https://github.com/qeeqbox/social-analyzer',
    github:'https://github.com/qeeqbox/social-analyzer',
    desc:'API and web app for finding a person\'s profile across 1000+ social networks — includes confidence scoring.' },

  { id:'foca',           label:'FOCA',                        icon:'🦅',  cat:'github',    difficulty:'intermediate', bestFor:'Document metadata analysis, user and domain enumeration from files',
    url:'https://github.com/ElevenPaths/FOCA',
    github:'https://github.com/ElevenPaths/FOCA',
    desc:'Fingerprinting Organizations with Collected Archives — extract metadata from public documents to map organizational structure.' },

  // ── GEOINT ────────────────────────────────────────────────────────────────
  { id:'google-maps',    label:'Google Maps',                 icon:'🗺️',  cat:'geoint',    difficulty:'beginner',     bestFor:'Street View imagery, location verification, business intelligence',
    url:'https://www.google.com/maps',
    desc:'Google\'s mapping platform — satellite imagery, Street View, business profiles, and historical imagery comparison.' },

  { id:'google-earth',   label:'Google Earth Web',            icon:'🌍',  cat:'geoint',    difficulty:'beginner',     bestFor:'High-resolution satellite imagery, historical imagery timelines',
    url:'https://earth.google.com/web',
    desc:'Google Earth in the browser — explore satellite imagery, 3D terrain, and historical imagery to verify locations over time.' },

  { id:'openstreetmap',  label:'OpenStreetMap',               icon:'🗺️',  cat:'geoint',    difficulty:'beginner',     bestFor:'Open source mapping, feature queries, humanitarian mapping',
    url:'https://www.openstreetmap.org',
    desc:'Free, editable world map — detailed community mapping that often exceeds Google in rural and non-English regions.' },

  { id:'wikimapia',      label:'Wikimapia',                   icon:'🌐',  cat:'geoint',    difficulty:'beginner',     bestFor:'Crowdsourced location annotations, facility identification',
    url:'https://wikimapia.org',
    desc:'Crowdsourced location descriptions overlaid on satellite imagery — identify facilities, buildings, and points of interest.' },

  { id:'sentinel-hub',   label:'Sentinel Hub EO Browser',     icon:'🛸',  cat:'geoint',    difficulty:'intermediate', bestFor:'Free satellite imagery, multi-spectral analysis, change detection',
    url:'https://apps.sentinel-hub.com/eo-browser/',
    desc:'Access free ESA Sentinel satellite imagery — vegetation analysis, flood mapping, wildfire detection, and change detection.' },

  { id:'nasa-worldview', label:'NASA Worldview',              icon:'🛰️',  cat:'geoint',    difficulty:'beginner',     bestFor:'Real-time satellite imagery, wildfire and storm tracking',
    url:'https://worldview.earthdata.nasa.gov',
    desc:'NASA\'s near-real-time satellite imagery tool — wildfire tracking, storm monitoring, and environmental change visualization.' },

  { id:'geohack',        label:'GeoHack',                     icon:'📍',  cat:'geoint',    difficulty:'intermediate', bestFor:'Coordinate-based map pivoting across multiple mapping services',
    url:'https://geohack.toolforge.org',
    desc:'Wikimedia\'s geo-tool hub — enter coordinates to pivot across Google Maps, Bing, OSM, Sentinel, and 30+ other services.' },

  { id:'mapillary',      label:'Mapillary',                   icon:'📸',  cat:'geoint',    difficulty:'beginner',     bestFor:'Crowdsourced street-level imagery, location corroboration',
    url:'https://www.mapillary.com',
    desc:'Street-level imagery platform with crowdsourced photos — especially strong in areas without Google Street View coverage.' },

  { id:'overpassturbo',  label:'Overpass Turbo',              icon:'🔍',  cat:'geoint',    difficulty:'advanced',     bestFor:'OSM data querying, feature extraction, infrastructure mapping',
    url:'https://overpass-turbo.eu',
    desc:'OpenStreetMap data extraction tool — query specific features (mosques, hospitals, borders, roads) across any region.' },

  // ── Digital Forensics ─────────────────────────────────────────────────────
  { id:'autopsy',        label:'Autopsy',                     icon:'🔬',  cat:'forensics', difficulty:'advanced',     bestFor:'Disk image analysis, file carving, deleted file recovery',
    url:'https://www.autopsy.com',
    github:'https://github.com/sleuthkit/autopsy',
    desc:'Free, open-source digital forensics platform built on The Sleuth Kit — industry-standard for disk image analysis.' },

  { id:'volatility',     label:'Volatility Framework',        icon:'💾',  cat:'forensics', difficulty:'advanced',     bestFor:'Memory forensics, malware detection in RAM images',
    url:'https://volatilityfoundation.org',
    github:'https://github.com/volatilityfoundation/volatility3',
    desc:'The leading open-source memory forensics framework — analyze RAM dumps to uncover running processes, network connections, and malware.' },

  { id:'kape',           label:'KAPE',                        icon:'⚡',  cat:'forensics', difficulty:'intermediate', bestFor:'Rapid artifact collection, triage forensics, timeline creation',
    url:'https://www.kroll.com/en/services/cyber-risk/incident-response-litigation-support/kroll-artifact-parser-extractor-kape',
    desc:'Kroll Artifact Parser and Extractor — rapidly collect and process forensic artifacts from live systems or disk images.' },

  { id:'sift',           label:'SIFT Workstation',            icon:'🖥️',  cat:'forensics', difficulty:'advanced',     bestFor:'Full forensic investigation toolkit, Linux-based analysis environment',
    url:'https://www.sans.org/tools/sift-workstation/',
    desc:'SANS Investigative Forensic Toolkit — comprehensive Linux forensics environment with 150+ pre-installed tools.' },

  { id:'zimmerman-tools', label:'Eric Zimmerman\'s Tools',    icon:'🔧',  cat:'forensics', difficulty:'advanced',     bestFor:'Windows artifact analysis, registry forensics, timeline creation',
    url:'https://ericzimmerman.github.io',
    desc:'Free suite of 40+ Windows forensics tools — registry analysis, event log parsing, LNK files, prefetch, and MFT parsing.' },

  { id:'magnet-forensics', label:'Magnet Forensics',          icon:'🧲',  cat:'forensics', difficulty:'advanced',     bestFor:'Mobile and cloud forensics, Axiom platform',
    url:'https://www.magnetforensics.com',
    desc:'Commercial digital forensics platform trusted by law enforcement — mobile, cloud, and endpoint artifact analysis.' },

  { id:'dfir-review',    label:'DFIR.Training',               icon:'📚',  cat:'forensics', difficulty:'intermediate', bestFor:'Free forensics tools, challenge downloads, training resources',
    url:'https://www.dfir.training',
    desc:'Comprehensive directory of free and commercial DFIR tools, training resources, and CTF challenge archives.' },

  { id:'velociraptor',   label:'Velociraptor',                icon:'🦖',  cat:'forensics', difficulty:'advanced',     bestFor:'Enterprise endpoint forensics, live response, artifact hunting at scale',
    url:'https://docs.velociraptor.app',
    github:'https://github.com/Velocidex/velociraptor',
    desc:'Endpoint visibility and digital forensics platform — collect artifacts from thousands of machines simultaneously.' },

  // ── Threat Intelligence ───────────────────────────────────────────────────
  { id:'mitre-attack',   label:'MITRE ATT&CK',                icon:'⚔️',  cat:'threat',    difficulty:'intermediate', bestFor:'Threat actor TTPs, defensive coverage mapping, red team planning',
    url:'https://attack.mitre.org',
    desc:'MITRE\'s globally accessible knowledge base of adversary tactics, techniques, and procedures — the standard reference for threat modeling.' },

  { id:'mitre-d3fend',   label:'MITRE D3FEND',                icon:'🛡️',  cat:'threat',    difficulty:'advanced',     bestFor:'Defensive countermeasure mapping, security control selection',
    url:'https://d3fend.mitre.org',
    desc:'MITRE\'s cybersecurity countermeasure framework — maps defensive techniques to ATT&CK TTPs for structured security planning.' },

  { id:'cisa',           label:'CISA',                        icon:'🏛️',  cat:'threat',    difficulty:'beginner',     bestFor:'US cyber alerts, advisories, vulnerability bulletins',
    url:'https://www.cisa.gov',
    desc:'US Cybersecurity and Infrastructure Security Agency — advisories, known exploited vulnerabilities, and critical infrastructure guidance.' },

  { id:'cccs',           label:'Canadian Centre for Cyber Security', icon:'🍁', cat:'threat', difficulty:'beginner',  bestFor:'Canadian cyber threat reports, alerts, best practice guidance',
    url:'https://www.cyber.gc.ca',
    desc:'Canada\'s authority on cybersecurity — threat bulletins, guidance publications, and the National Cyber Threat Assessment.' },

  { id:'nist-nvd',       label:'NIST NVD',                    icon:'🔐',  cat:'threat',    difficulty:'intermediate', bestFor:'CVE lookup, vulnerability scoring, patch prioritization',
    url:'https://nvd.nist.gov',
    desc:'National Vulnerability Database — CVSS scores, CPE data, and full details for every published CVE.' },

  { id:'owasp',          label:'OWASP',                       icon:'🌐',  cat:'threat',    difficulty:'intermediate', bestFor:'Web application security, Top 10 risks, security testing',
    url:'https://owasp.org',
    desc:'Open Web Application Security Project — Top 10, cheat sheets, testing guides, and free security tools.' },

  { id:'bleepingcomputer', label:'BleepingComputer',          icon:'💻',  cat:'threat',    difficulty:'beginner',     bestFor:'Breaking cybersecurity news, ransomware tracking, malware analysis',
    url:'https://www.bleepingcomputer.com',
    desc:'Leading cybersecurity news site — ransomware updates, breach disclosures, vulnerability reports, and malware analysis.' },

  { id:'dark-reading',   label:'Dark Reading',                icon:'📰',  cat:'threat',    difficulty:'beginner',     bestFor:'Cybersecurity industry news, threat trends, expert commentary',
    url:'https://www.darkreading.com',
    desc:'Cybersecurity industry news and analysis — covering threats, vulnerabilities, and enterprise security strategy.' },

  { id:'the-record',     label:'The Record',                  icon:'📋',  cat:'threat',    difficulty:'beginner',     bestFor:'Cybercrime, state-sponsored threats, incident reporting',
    url:'https://therecord.media',
    desc:'Cybercrime and threat intelligence news from Recorded Future — ransomware, nation-state attacks, and breach reporting.' },

  { id:'feedly-ti',      label:'Feedly Threat Intelligence',  icon:'📡',  cat:'threat',    difficulty:'intermediate', bestFor:'Aggregated threat intelligence feeds, IOC monitoring',
    url:'https://feedly.com/i/threat-intelligence',
    desc:'AI-powered threat intelligence aggregation — monitor threat actors, CVEs, and IOCs across hundreds of intelligence feeds.' },

  // ── Research & Archives ───────────────────────────────────────────────────
  { id:'internet-archive', label:'Internet Archive',          icon:'📦',  cat:'archives',  difficulty:'beginner',     bestFor:'Archived websites, digital books, audio, and video preservation',
    url:'https://archive.org',
    desc:'The non-profit digital library of the internet — 800+ billion archived web pages, books, audio recordings, and video.' },

  { id:'wayback-machine', label:'Wayback Machine',            icon:'⏮️',  cat:'archives',  difficulty:'beginner',     bestFor:'Viewing deleted or changed web pages, timeline of site changes',
    url:'https://web.archive.org',
    desc:'Explore archived snapshots of any website going back to 1996 — invaluable for deleted content and historical comparisons.' },

  { id:'archive-today',  label:'Archive.today',               icon:'📸',  cat:'archives',  difficulty:'beginner',     bestFor:'Preserving page snapshots, archiving evidence immediately',
    url:'https://archive.today',
    desc:'Archive.today saves page screenshots and full HTML — useful for archiving evidence that may be deleted.' },

  { id:'google-scholar', label:'Google Scholar',              icon:'🎓',  cat:'archives',  difficulty:'beginner',     bestFor:'Academic paper search, citation tracking, author profiling',
    url:'https://scholar.google.com',
    desc:'Search academic literature — papers, theses, patents, and legal opinions across disciplines.' },

  { id:'semantic-scholar', label:'Semantic Scholar',          icon:'🧠',  cat:'archives',  difficulty:'intermediate', bestFor:'AI-powered academic search, citation analysis, research trends',
    url:'https://www.semanticscholar.org',
    desc:'AI-powered academic search engine — summarizes papers, identifies influential citations, and surfaces emerging research.' },

  { id:'crossref',       label:'Crossref',                    icon:'🔗',  cat:'archives',  difficulty:'intermediate', bestFor:'DOI lookup, publication metadata, citation networks',
    url:'https://www.crossref.org',
    desc:'Scholarly DOI registry — look up publication metadata, verify journal authenticity, and track citation networks.' },

  { id:'openalex',       label:'OpenAlex',                    icon:'📖',  cat:'archives',  difficulty:'intermediate', bestFor:'Open academic data, author profiling, institution research',
    url:'https://openalex.org',
    desc:'Free, open catalog of scholarly works — 200M+ papers, authors, and institutions with full metadata.' },

  { id:'courtlistener', label:'CourtListener (US)',            icon:'⚖️',  cat:'archives',  difficulty:'intermediate', bestFor:'US federal court decisions, PACER alternatives, legal research',
    url:'https://www.courtlistener.com',
    desc:'Free database of US court opinions, oral arguments, and RECAP archive of PACER documents.' },

  // ── Reddit Communities ────────────────────────────────────────────────────
  { id:'r-osint',        label:'r/OSINT',                     icon:'🔴',  cat:'reddit',    difficulty:'beginner',     bestFor:'Tool discussions, technique sharing, case studies, community Q&A',
    url:'https://www.reddit.com/r/OSINT/',
    desc:'Open-source intelligence community — tools, techniques, case studies, and real-world investigation discussions.' },

  { id:'r-cybersec',     label:'r/cybersecurity',             icon:'🔴',  cat:'reddit',    difficulty:'beginner',     bestFor:'Cybersecurity news, career advice, industry discussion',
    url:'https://www.reddit.com/r/cybersecurity/',
    desc:'General cybersecurity community — news, tools, career guidance, and threat discussions.' },

  { id:'r-privacy',      label:'r/privacy',                   icon:'🔴',  cat:'reddit',    difficulty:'beginner',     bestFor:'Privacy tools, strategies, de-googling guides',
    url:'https://www.reddit.com/r/privacy/',
    desc:'Digital privacy community — tool recommendations, news, threat analysis, and privacy-preserving strategies.' },

  { id:'r-opsec',        label:'r/opsec',                     icon:'🔴',  cat:'reddit',    difficulty:'intermediate', bestFor:'Operational security practices, threat modeling',
    url:'https://www.reddit.com/r/opsec/',
    desc:'Operational security discussions, practices, and resources for investigators and security professionals.' },

  { id:'r-netsec',       label:'r/netsec',                    icon:'🔴',  cat:'reddit',    difficulty:'advanced',     bestFor:'Security research, vulnerability disclosures, technical analysis',
    url:'https://www.reddit.com/r/netsec/',
    desc:'Network security technical community — research papers, vulnerability analysis, and security engineering discussions.' },

  { id:'r-dfir',         label:'r/digitalforensics',          icon:'🔴',  cat:'reddit',    difficulty:'intermediate', bestFor:'DFIR techniques, tool discussions, case study sharing',
    url:'https://www.reddit.com/r/digitalforensics/',
    desc:'Digital forensics and incident response community — techniques, tools, and career resources.' },

  { id:'r-blueteam',     label:'r/blueteamsec',               icon:'🔴',  cat:'reddit',    difficulty:'intermediate', bestFor:'Defense, detection engineering, threat intelligence',
    url:'https://www.reddit.com/r/blueteamsec/',
    desc:'Defensive security, threat intelligence, and detection resources — curated links to relevant research.' },

  { id:'r-hacking',      label:'r/hacking',                   icon:'🔴',  cat:'reddit',    difficulty:'beginner',     bestFor:'Ethical hacking education, CTF discussions, tool discovery',
    url:'https://www.reddit.com/r/hacking/',
    desc:'Ethical hacking and security education — tools, techniques, CTF challenges, and career discussions.' },

  { id:'r-investigative', label:'r/InvestigativeJournalism',  icon:'🔴',  cat:'reddit',    difficulty:'beginner',     bestFor:'Investigative journalism techniques, FOIA, source protection',
    url:'https://www.reddit.com/r/InvestigativeJournalism/',
    desc:'Investigative journalism community — FOIA tips, source protection, data journalism, and story development.' },

  // ── YouTube Channels ──────────────────────────────────────────────────────
  { id:'yt-bellingcat',  label:'Bellingcat',                  icon:'▶️',  cat:'youtube',   difficulty:'beginner',     bestFor:'Open-source investigation techniques, geolocation, verification',
    url:'https://www.youtube.com/@Bellingcat',
    desc:'Video investigations and OSINT technique tutorials from the world\'s leading open-source investigative team.' },

  { id:'yt-hammond',     label:'John Hammond',                icon:'▶️',  cat:'youtube',   difficulty:'intermediate', bestFor:'CTFs, malware reverse engineering, cybersecurity education',
    url:'https://www.youtube.com/@_JohnHammond',
    desc:'Cybersecurity challenges, CTF walkthroughs, and malware analysis — high-quality technical education.' },

  { id:'yt-bombal',      label:'David Bombal',                icon:'▶️',  cat:'youtube',   difficulty:'beginner',     bestFor:'Networking, ethical hacking, career guidance, tool tutorials',
    url:'https://www.youtube.com/@davidbombal',
    desc:'Networking, ethical hacking, and cybersecurity career advice — accessible for beginners and professionals.' },

  { id:'yt-netchuck',    label:'NetworkChuck',                icon:'▶️',  cat:'youtube',   difficulty:'beginner',     bestFor:'Networking fundamentals, Linux, Python, hacking basics',
    url:'https://www.youtube.com/@NetworkChuck',
    desc:'Energetic cybersecurity education — networking, Linux, Python, and ethical hacking for beginners.' },

  { id:'yt-cybermentor', label:'The Cyber Mentor',            icon:'▶️',  cat:'youtube',   difficulty:'intermediate', bestFor:'Penetration testing, ethical hacking courses, bug bounty',
    url:'https://www.youtube.com/@TCMSecurityAcademy',
    desc:'Ethical hacking tutorials and penetration testing courses — TCM Security\'s structured learning path.' },

  { id:'yt-liveoverflow', label:'LiveOverflow',               icon:'▶️',  cat:'youtube',   difficulty:'advanced',     bestFor:'Binary exploitation, CTF deep dives, security research',
    url:'https://www.youtube.com/@LiveOverflow',
    desc:'Deep technical security content — binary exploitation, reverse engineering, and CTF challenge breakdowns.' },

  { id:'yt-13cubed',     label:'13Cubed',                     icon:'▶️',  cat:'youtube',   difficulty:'intermediate', bestFor:'DFIR training, Windows forensics, memory analysis',
    url:'https://www.youtube.com/@13Cubed',
    desc:'Digital forensics and incident response training — Windows forensics, Volatility, and DFIR methodology.' },

  { id:'yt-blackhills',  label:'Black Hills InfoSec',         icon:'▶️',  cat:'youtube',   difficulty:'intermediate', bestFor:'Penetration testing, threat hunting, enterprise defense',
    url:'https://www.youtube.com/@BlackHillsInformationSecurity',
    desc:'Free security training from Black Hills InfoSec — webinars on penetration testing, threat hunting, and defense.' },

  { id:'yt-stok',        label:'STOKfredrik',                 icon:'▶️',  cat:'youtube',   difficulty:'advanced',     bestFor:'Bug bounty hunting, web application security, recon techniques',
    url:'https://www.youtube.com/@STOKfredrik',
    desc:'Bug bounty hunting and web application security testing — real-world recon and exploitation techniques.' },

  // ── AI Workspace ──────────────────────────────────────────────────────────
  { id:'chatgpt',        label:'ChatGPT',                     icon:'🤖',  cat:'ai',        difficulty:'beginner',     bestFor:'Research drafting, query generation, report writing, summarization',
    url:'https://chat.openai.com',
    desc:'OpenAI\'s conversational AI — research assistance, report drafting, query generation, and document analysis.' },

  { id:'claude',         label:'Claude',                      icon:'🤖',  cat:'ai',        difficulty:'beginner',     bestFor:'Long document analysis, nuanced reasoning, structured writing',
    url:'https://claude.ai',
    desc:'Anthropic\'s AI assistant — superior for long-document analysis, nuanced reasoning, and analytical writing.' },

  { id:'gemini',         label:'Gemini',                      icon:'🤖',  cat:'ai',        difficulty:'beginner',     bestFor:'Multimodal analysis, Google Workspace integration, research',
    url:'https://gemini.google.com',
    desc:'Google\'s multimodal AI — image analysis, research, coding, and deep integration with Google services.' },

  { id:'perplexity',     label:'Perplexity AI',               icon:'🔍',  cat:'ai',        difficulty:'beginner',     bestFor:'Cited web research, current events, source verification',
    url:'https://www.perplexity.ai',
    desc:'AI-powered search with cited real-time sources — ideal for research requiring current information with verification.' },

  { id:'notebooklm',     label:'NotebookLM',                  icon:'📓',  cat:'ai',        difficulty:'beginner',     bestFor:'Document interrogation, research synthesis, briefing generation',
    url:'https://notebooklm.google.com',
    desc:'Google\'s AI research assistant — upload documents and interrogate them with AI-powered questions and summaries.' },

  { id:'grok',           label:'Grok (xAI)',                  icon:'🤖',  cat:'ai',        difficulty:'beginner',     bestFor:'Real-time information, X/Twitter data analysis',
    url:'https://x.ai/grok',
    desc:'xAI\'s Grok — real-time access to X (Twitter) data and current events analysis.' },

  { id:'lmstudio',       label:'LM Studio',                   icon:'💻',  cat:'ai',        difficulty:'intermediate', bestFor:'Running open-source LLMs locally, private investigation AI',
    url:'https://lmstudio.ai',
    desc:'Run large language models locally — private, no data leaves your device. Essential for sensitive investigation work.' },

  { id:'ollama',         label:'Ollama',                      icon:'🦙',  cat:'ai',        difficulty:'intermediate', bestFor:'Local LLM CLI and API, private AI infrastructure',
    url:'https://ollama.ai',
    desc:'Run open-source LLMs locally with a simple CLI — Llama, Mistral, Phi, and more with zero cloud dependency.' },

  { id:'openwebui',      label:'Open WebUI',                  icon:'🌐',  cat:'ai',        difficulty:'intermediate', bestFor:'Self-hosted ChatGPT-like interface for local LLMs',
    url:'https://openwebui.com',
    desc:'Self-hosted web interface for local LLMs — ChatGPT-like experience with full privacy using Ollama as backend.' },

  // ── Download Center ───────────────────────────────────────────────────────
  { id:'wireshark',      label:'Wireshark',                   icon:'📥',  cat:'downloads', difficulty:'intermediate', bestFor:'Network traffic capture, packet analysis, protocol dissection',
    url:'https://www.wireshark.org/download.html',
    desc:'The world\'s most popular network protocol analyzer — capture and inspect packets at the byte level.' },

  { id:'nmap',           label:'Nmap',                        icon:'📥',  cat:'downloads', difficulty:'intermediate', bestFor:'Network discovery, port scanning, OS and service fingerprinting',
    url:'https://nmap.org/download.html',
    desc:'The essential network discovery and security auditing tool — port scanning, OS detection, and scripted testing.' },

  { id:'veracrypt',      label:'VeraCrypt',                   icon:'📥',  cat:'downloads', difficulty:'intermediate', bestFor:'Full-disk encryption, hidden volumes, evidence container protection',
    url:'https://www.veracrypt.fr/en/Downloads.html',
    desc:'Free, open-source disk encryption — create encrypted containers and volumes to protect investigation data.' },

  { id:'keepassxc',      label:'KeePassXC',                   icon:'📥',  cat:'downloads', difficulty:'beginner',     bestFor:'Credential management, secure password storage, team vaults',
    url:'https://keepassxc.org/download/',
    desc:'Free, open-source cross-platform password manager — local encrypted vault with no cloud dependency.' },

  { id:'vscode',         label:'Visual Studio Code',          icon:'📥',  cat:'downloads', difficulty:'beginner',     bestFor:'Code editing, data analysis scripts, Jupyter notebooks',
    url:'https://code.visualstudio.com/download',
    desc:'Free, open-source code editor from Microsoft — essential for writing OSINT scripts, analyzing data, and automation.' },

  { id:'github-desktop', label:'GitHub Desktop',              icon:'📥',  cat:'downloads', difficulty:'beginner',     bestFor:'Managing GitHub-hosted OSINT tools, cloning repos',
    url:'https://desktop.github.com',
    desc:'Simplified Git and GitHub workflow with a GUI — clone and manage OSINT tool repositories without the command line.' },

  { id:'everything',     label:'Everything Search',           icon:'📥',  cat:'downloads', difficulty:'beginner',     bestFor:'Instant Windows file search, evidence file location',
    url:'https://www.voidtools.com/downloads/',
    desc:'Ultra-fast Windows file search tool — locate any file instantly by name across entire drives.' },

  { id:'maltego',        label:'Maltego CE',                  icon:'📥',  cat:'downloads', difficulty:'advanced',     bestFor:'Visual link analysis, entity relationship mapping',
    url:'https://www.maltego.com/downloads/',
    desc:'Visual link analysis platform — map relationships between people, companies, domains, and social networks with free Community Edition.' },

  { id:'spiderfoot-dl',  label:'SpiderFoot',                  icon:'📥',  cat:'downloads', difficulty:'intermediate', bestFor:'Automated OSINT data collection, threat intelligence platform',
    url:'https://github.com/smicallef/spiderfoot/releases',
    desc:'Download the latest SpiderFoot release — automated OSINT collection with 200+ modules for comprehensive target profiling.' },

  { id:'notepadpp',      label:'Notepad++',                   icon:'📥',  cat:'downloads', difficulty:'beginner',     bestFor:'Note taking, log analysis, large text file handling',
    url:'https://notepad-plus-plus.org/downloads/',
    desc:'Free source code editor for Windows — handles large files, regex search, and syntax highlighting for analysis notes.' },

  // ── Browser Extensions ────────────────────────────────────────────────────
  { id:'ublock',         label:'uBlock Origin',               icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Blocking ads and trackers during OSINT research',
    url:'https://ublockorigin.com',
    github:'https://github.com/gorhill/uBlock',
    desc:'The most effective wide-spectrum content blocker — essential for OSINT work to prevent tracking while browsing targets.' },

  { id:'bitwarden',      label:'Bitwarden',                   icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Secure credential storage, investigation account management',
    url:'https://bitwarden.com/download/',
    github:'https://github.com/bitwarden/clients',
    desc:'Open-source password manager extension — manage investigation accounts securely with end-to-end encryption.' },

  { id:'wappalyzer-ext', label:'Wappalyzer',                  icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Identifying website technology stack while browsing',
    url:'https://www.wappalyzer.com/apps/',
    desc:'Identify technology stacks on websites in real time — CMS, frameworks, analytics, advertising, and hosting.' },

  { id:'singlefile',     label:'SingleFile',                  icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Evidence preservation, saving web pages as single HTML files',
    url:'https://github.com/gildas-lormeau/SingleFile',
    github:'https://github.com/gildas-lormeau/SingleFile',
    desc:'Save a complete webpage as a single self-contained HTML file — critical for evidence preservation before content disappears.' },

  { id:'dark-reader',    label:'Dark Reader',                 icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Reducing eye strain during long investigation sessions',
    url:'https://darkreader.org',
    github:'https://github.com/darkreader/darkreader',
    desc:'Dark mode browser extension that works on every website — reduces eye strain during extended research sessions.' },

  { id:'wayback-ext',    label:'Wayback Machine Extension',   icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Instantly check/save pages to Wayback Machine while browsing',
    url:'https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/',
    desc:'Access archived versions of any page and save the current page to the Wayback Machine with one click.' },

  { id:'ua-switcher',    label:'User-Agent Switcher',         icon:'🧩',  cat:'extensions',difficulty:'intermediate', bestFor:'Changing browser identity, mobile site access, fingerprint variation',
    url:'https://addons.mozilla.org/en-US/firefox/addon/user-agent-string-switcher/',
    desc:'Switch your browser user-agent to impersonate different browsers, operating systems, and mobile devices.' },

  { id:'cookie-editor',  label:'Cookie Editor',               icon:'🧩',  cat:'extensions',difficulty:'intermediate', bestFor:'Inspecting and modifying cookies, session analysis',
    url:'https://cookie-editor.com',
    desc:'View, edit, and manage cookies — useful for session analysis, testing authentication flows, and web investigation.' },

  { id:'exifviewer-ext', label:'Exif Viewer Pro',             icon:'🧩',  cat:'extensions',difficulty:'beginner',     bestFor:'Instant EXIF metadata from images while browsing',
    url:'https://addons.mozilla.org/en-US/firefox/addon/exif-viewer-mozilla-edition/',
    desc:'View EXIF metadata from images on any web page — instantly reveals device, timestamp, and GPS data.' },

  // ── Books ─────────────────────────────────────────────────────────────────
  { id:'book-open-source-intel', label:'Open Source Intelligence Techniques', icon:'📗', cat:'books', difficulty:'intermediate', bestFor:'Comprehensive OSINT methodology, tool usage, investigation frameworks',
    url:'https://inteltechniques.com/book1.html',
    desc:'Michael Bazzell\'s definitive OSINT textbook — updated annually with current tools and techniques used by investigators worldwide.' },

  { id:'book-hacking-art',  label:'The Art of Invisibility',  icon:'📗',  cat:'books',    difficulty:'beginner',     bestFor:'Digital privacy, operational security, counter-surveillance',
    url:'https://www.amazon.ca/Art-Invisibility-Worlds-Teaches-Brother/dp/0316380504',
    desc:'Kevin Mitnick\'s guide to privacy and security — practical advice on protecting personal information online.' },

  { id:'book-digital-forensics', label:'The Art of Memory Forensics', icon:'📗', cat:'books', difficulty:'advanced', bestFor:'Windows/Linux/Mac memory analysis, malware forensics',
    url:'https://www.amazon.ca/Art-Memory-Forensics-Detecting-Malware/dp/1118825098',
    desc:'The definitive guide to memory forensics — detecting malware and threats in RAM by Ligh, Case, Levy, and Walters.' },

  { id:'book-network-forensics', label:'Network Forensics',   icon:'📗',  cat:'books',    difficulty:'advanced',     bestFor:'Network traffic analysis, intrusion investigation, protocol forensics',
    url:'https://www.amazon.ca/Network-Forensics-Tracking-Hackers-Internet/dp/013256471X',
    desc:'Comprehensive network forensics guide — analyzing traffic to reconstruct incidents and attribute attacks.' },

  { id:'book-social-engineer', label:'The Art of Human Hacking', icon:'📗', cat:'books',  difficulty:'intermediate', bestFor:'Social engineering techniques, human factor in security',
    url:'https://www.amazon.ca/Social-Engineering-Science-Human-Hacking/dp/111943338X',
    desc:'Christopher Hadnagy\'s guide to social engineering — the human factor in security and how it is exploited.' },

  { id:'book-privacyguides',label:'Permanent Record',         icon:'📗',  cat:'books',    difficulty:'beginner',     bestFor:'Mass surveillance, whistleblowing, NSA intelligence programs',
    url:'https://www.amazon.ca/Permanent-Record-Edward-Snowden/dp/1250237238',
    desc:'Edward Snowden\'s memoir — essential context on mass surveillance programs and the intelligence collection apparatus.' },

  { id:'book-darkmarket',label:'Sandworm',                    icon:'📗',  cat:'books',    difficulty:'beginner',     bestFor:'Nation-state cyber operations, Russian GRU attacks, critical infrastructure',
    url:'https://www.amazon.ca/Sandworm-Cyberwar-Kremlins-Dangerous-Hackers/dp/0385544405',
    desc:'Andy Greenberg\'s account of the world\'s most destructive cyberattacks — Sandworm and nation-state cyber warfare.' },

  { id:'book-dfir-intro', label:'Incident Response & Computer Forensics', icon:'📗', cat:'books', difficulty:'intermediate', bestFor:'IR methodology, forensic investigation process, evidence handling',
    url:'https://www.amazon.ca/Incident-Response-Computer-Forensics-Third/dp/0071798684',
    desc:'Jason Luttgens et al — the standard textbook for incident response and computer forensics methodology.' },

  // ── Podcasts ──────────────────────────────────────────────────────────────
  { id:'pod-darknet',    label:'Darknet Diaries',             icon:'🎙️',  cat:'podcasts',  difficulty:'beginner',     bestFor:'True stories of hacks, breaches, cybercrime, and intelligence operations',
    url:'https://darknetdiaries.com',
    desc:'Jack Rhysider\'s narrative podcast — true stories from the dark side of the internet. The most-listened cybersecurity podcast.' },

  { id:'pod-bazzell',    label:'The Privacy, Security, & OSINT Show', icon:'🎙️', cat:'podcasts', difficulty:'intermediate', bestFor:'OSINT techniques, digital privacy, tool updates',
    url:'https://inteltechniques.com/podcast.html',
    desc:'Michael Bazzell\'s weekly podcast — OSINT techniques, privacy strategies, and security tools for investigators.' },

  { id:'pod-risky-biz',  label:'Risky Business',              icon:'🎙️',  cat:'podcasts',  difficulty:'intermediate', bestFor:'Infosec industry news, threat intelligence, security analysis',
    url:'https://risky.biz',
    desc:'Leading information security podcast — weekly news, interviews with researchers, and vendor roundtables.' },

  { id:'pod-cyberwire',  label:'The CyberWire',               icon:'🎙️',  cat:'podcasts',  difficulty:'beginner',     bestFor:'Daily cybersecurity briefings, threat news, intelligence summaries',
    url:'https://thecyberwire.com/podcasts/daily-briefing',
    desc:'Daily cybersecurity news briefing — concise 20-minute summary of the day\'s most important security stories.' },

  { id:'pod-malicious',  label:'Malicious Life',              icon:'🎙️',  cat:'podcasts',  difficulty:'beginner',     bestFor:'Cybersecurity history, hacker stories, threat actor profiles',
    url:'https://malicious.life',
    desc:'Cybersecurity history podcast from Cybereason — hacker stories, threat actor profiles, and industry evolution.' },

  { id:'pod-security-now', label:'Security Now',              icon:'🎙️',  cat:'podcasts',  difficulty:'intermediate', bestFor:'Deep technical security dives, vulnerability analysis, privacy tools',
    url:'https://www.grc.com/securitynow.htm',
    desc:'Steve Gibson and Leo Laporte — deep technical analysis of security vulnerabilities, patches, and privacy tools.' },

  { id:'pod-osint-curious', label:'OSINT Curious',            icon:'🎙️',  cat:'podcasts',  difficulty:'beginner',     bestFor:'OSINT techniques, case studies, community discussions',
    url:'https://osintcurio.us/podcast/',
    desc:'OSINT Curious project podcast — techniques, tool reviews, and discussions from the open-source intelligence community.' },

  { id:'pod-smashing-security', label:'Smashing Security',   icon:'🎙️',  cat:'podcasts',  difficulty:'beginner',     bestFor:'Light-hearted cybersecurity news, social engineering, scam awareness',
    url:'https://www.smashingsecurity.com',
    desc:'Weekly cybersecurity podcast with Graham Cluley and Carole Theriault — news, analysis, and security awareness.' },

  // ── Reference Library ─────────────────────────────────────────────────────
  { id:'ref-google-ops', label:'Google Search Operators',     icon:'📖',  cat:'reference', difficulty:'beginner',     bestFor:'Advanced Google searches, evidence discovery, site-specific queries',
    url:'https://ahrefs.com/blog/google-advanced-search-operators/',
    desc:'Complete guide to Google advanced search operators — site:, filetype:, intitle:, inurl:, and combinations.' },

  { id:'ref-bool',       label:'Boolean Search Guide',        icon:'📖',  cat:'reference', difficulty:'beginner',     bestFor:'Constructing precise search strings, investigative queries',
    url:'https://www.boolean-strings.com',
    desc:'Boolean search strings for investigative, recruitment, and HR research — AND, OR, NOT, parentheses, quotes.' },

  { id:'ref-regex',      label:'Regex Reference — Regex101', icon:'📖',  cat:'reference', difficulty:'intermediate', bestFor:'Testing regular expressions, pattern matching in data analysis',
    url:'https://regex101.com',
    desc:'Online regex tester and reference — test patterns, get explanations, and reference syntax for data extraction.' },

  { id:'ref-dns-guide',  label:'DNS Record Guide',            icon:'📖',  cat:'reference', difficulty:'intermediate', bestFor:'Understanding A, MX, TXT, CNAME, NS record types and purposes',
    url:'https://www.cloudflare.com/learning/dns/dns-records/',
    desc:'Cloudflare\'s comprehensive DNS record reference — A, AAAA, CNAME, MX, TXT, NS, SOA, and PTR records explained.' },

  { id:'ref-whois',      label:'WHOIS Protocol Guide',        icon:'📖',  cat:'reference', difficulty:'beginner',     bestFor:'Understanding domain registration data, GDPR redaction impacts',
    url:'https://www.icann.org/resources/pages/whois-2012-02-25-en',
    desc:'ICANN\'s WHOIS reference — understanding domain registration data, privacy redaction, and lookup procedures.' },

  { id:'ref-http-codes', label:'HTTP Status Code Reference',  icon:'📖',  cat:'reference', difficulty:'beginner',     bestFor:'Web investigation, server response interpretation, crawl analysis',
    url:'https://developer.mozilla.org/en-US/docs/Web/HTTP/Status',
    desc:'MDN\'s HTTP status code reference — 1xx, 2xx, 3xx, 4xx, 5xx codes with detailed explanations for each.' },

  { id:'ref-mitre-overview', label:'MITRE ATT&CK Navigator', icon:'📖',  cat:'reference', difficulty:'intermediate', bestFor:'Visualizing TTPs, building detection coverage maps',
    url:'https://mitre-attack.github.io/attack-navigator/',
    github:'https://github.com/mitre-attack/attack-navigator',
    desc:'Interactive ATT&CK matrix — visualize threat actor techniques, map detection coverage, and compare actor TTPs.' },

  { id:'ref-kill-chain', label:'Cyber Kill Chain Reference',  icon:'📖',  cat:'reference', difficulty:'intermediate', bestFor:'Threat modeling, incident analysis, attack lifecycle mapping',
    url:'https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html',
    desc:'Lockheed Martin\'s Cyber Kill Chain — 7-stage attack lifecycle model for structured incident analysis.' },

  { id:'ref-methodology', label:'OSINT Investigation Methodology', icon:'📖', cat:'reference', difficulty:'beginner', bestFor:'Structured investigation process, search strategy, source management',
    url:'https://osintframework.com',
    desc:'Structured OSINT investigation methodology — from subject identification through collection, analysis, and reporting.' },

  { id:'ref-evidence',   label:'Digital Evidence Handling',   icon:'📖',  cat:'reference', difficulty:'intermediate', bestFor:'Evidence documentation, chain of custody, court-admissible collection',
    url:'https://www.cisa.gov/sites/default/files/2022-09/CISA_MS-ISAC_Ransomware%20Guide_S508C.pdf',
    desc:'Digital evidence handling best practices — documentation, chain of custody, and preparation for legal proceedings.' },

  { id:'ref-court-ca',   label:'Canadian Court Structure',    icon:'📖',  cat:'reference', difficulty:'beginner',     bestFor:'Understanding Canadian court hierarchy and jurisdiction',
    url:'https://www.justice.gc.ca/eng/csj-sjc/just/07.html',
    desc:'Official overview of the Canadian court system — hierarchy, jurisdiction, and which court handles which matters.' },

  { id:'ref-privacy-law', label:'PIPEDA Overview',            icon:'📖',  cat:'reference', difficulty:'intermediate', bestFor:'Canadian privacy law compliance, ATIP requests, data handling rules',
    url:'https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/',
    desc:'OPC guide to PIPEDA — Canada\'s federal private-sector privacy law and its application to investigators.' },

];


const IRC_CATEGORIES = [
  { key: 'all',        label: 'All' },
  { key: 'canadian',   label: '🍁 Canadian' },
  { key: 'username',   label: '👤 Username' },
  { key: 'email',      label: '📧 Email' },
  { key: 'domain',     label: '🌐 Domain' },
  { key: 'image',      label: '🖼️ Image' },
  { key: 'social',     label: '📱 Social Media' },
  { key: 'corporate',  label: '🏢 Corporate' },
  { key: 'osint',      label: '🔍 OSINT' },
  { key: 'github',     label: '💻 GitHub' },
  { key: 'geoint',     label: '🗺️ GEOINT' },
  { key: 'forensics',  label: '🔬 Forensics' },
  { key: 'threat',     label: '⚠️ Threat Intel' },
  { key: 'archives',   label: '📦 Archives' },
  { key: 'reddit',     label: '🔴 Reddit' },
  { key: 'youtube',    label: '▶️ YouTube' },
  { key: 'ai',         label: '🤖 AI' },
  { key: 'downloads',  label: '📥 Downloads' },
  { key: 'extensions', label: '🧩 Extensions' },
  { key: 'books',      label: '📗 Books' },
  { key: 'podcasts',   label: '🎙️ Podcasts' },
  { key: 'reference',  label: '📖 Reference' },
];

const DIFF_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

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
    const termOk = !term || r.label.toLowerCase().includes(term)
                         || r.desc.toLowerCase().includes(term)
                         || (r.bestFor && r.bestFor.toLowerCase().includes(term))
                         || r.cat.includes(term);
    return catOk && termOk;
  });

  // Favorites first
  visible.sort((a, b) => (favs.includes(a.id) ? 0 : 1) - (favs.includes(b.id) ? 0 : 1));

  if (visible.length === 0) {
    container.innerHTML = '<div class="irc-no-results">No resources match your search.</div>';
    return;
  }

  container.innerHTML = visible.map(r => {
    const fav   = favs.includes(r.id);
    const diff  = r.difficulty || 'beginner';
    const catLabel = IRC_CATEGORIES.find(c => c.key === r.cat)?.label || r.cat;
    return `
      <div class="irc-card">
        <div class="irc-card-header">
          <span class="irc-card-icon">${r.icon}</span>
          <span class="irc-card-label">${escapeHtmlV32(r.label)}</span>
          <button class="irc-card-fav${fav ? ' starred' : ''}" data-irc-id="${r.id}" title="${fav ? 'Remove favourite' : 'Add to favourites'}">
            ${fav ? '⭐' : '☆'}
          </button>
        </div>
        <div class="irc-card-meta">
          <span class="irc-diff-badge irc-diff-${diff}">${DIFF_LABELS[diff]}</span>
          <span class="irc-card-cat-label">${escapeHtmlV32(catLabel)}</span>
        </div>
        <div class="irc-card-desc">${escapeHtmlV32(r.desc)}</div>
        ${r.bestFor ? `<div class="irc-card-bestfor"><strong>Best for:</strong> ${escapeHtmlV32(r.bestFor)}</div>` : ''}
        <div class="irc-card-actions">
          <button class="irc-card-launch" data-irc-id="${r.id}" data-url="${escapeHtmlV32(r.url)}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            Launch
          </button>
          ${r.github ? `<button class="irc-card-github" data-url="${escapeHtmlV32(r.github)}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            GitHub
          </button>` : ''}
        </div>
      </div>`;
  }).join('');

  container.querySelectorAll('.irc-card-launch').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = IRC_DATA.find(r => r.id === btn.dataset.ircId);
      if (item) { window.open(item.url, '_blank', 'noopener,noreferrer'); trackRecentlyUsed(item); }
    });
  });

  container.querySelectorAll('.irc-card-github').forEach(btn => {
    btn.addEventListener('click', () => window.open(btn.dataset.url, '_blank', 'noopener,noreferrer'));
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
  { id:'htmlenc',    label:'HTML Entity Encoder',   icon:'<>' },
];

let _activeTool = 'passgen';

function initToolkit() {
  const listEl  = document.getElementById('tk-tool-list');
  const panelEl = document.getElementById('tk-panel');
  if (!listEl || !panelEl) return;

  listEl.innerHTML = TOOLKIT_TOOLS.map(t =>
    `<button class="tk-tool-btn${t.id === _activeTool ? ' active' : ''}" data-tool="${t.id}">
       <span class="tk-tool-icon">${t.icon}</span>
       <span class="tk-tool-label">${t.label}</span>
     </button>`
  ).join('');

  listEl.querySelectorAll('.tk-tool-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      listEl.querySelectorAll('.tk-tool-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      _activeTool = btn.dataset.tool;
      renderToolPanel(_activeTool, panelEl);
    });
  });

  renderToolPanel(_activeTool, panelEl);
}

function renderToolPanel(toolId, panelEl) {
  const panels = {
    passgen: `
      <div class="tk-panel-title">🔐 Password Generator</div>
      <div class="tk-field-row">
        <label class="tk-label">Length</label>
        <input type="number" id="pg-len" class="tk-input" value="20" min="8" max="128" />
      </div>
      <div class="tk-check-row">
        <label><input type="checkbox" id="pg-upper" checked /> Uppercase</label>
        <label><input type="checkbox" id="pg-lower" checked /> Lowercase</label>
        <label><input type="checkbox" id="pg-num"   checked /> Numbers</label>
        <label><input type="checkbox" id="pg-sym"   checked /> Symbols</label>
      </div>
      <button class="tk-btn" id="pg-gen">⚡ Generate Password</button>
      <div class="tk-output-wrap">
        <code class="tk-output tk-output-placeholder" id="pg-out">Click Generate to create a password</code>
        <button class="tk-copy-btn" data-copy-from="pg-out" title="Copy to clipboard">⎘</button>
      </div>`,

    passcheck: `
      <div class="tk-panel-title">💪 Password Strength Checker</div>
      <div class="tk-field-row">
        <label class="tk-label">Password</label>
        <input type="text" id="pc-input" class="tk-input" placeholder="Enter password…" autocomplete="off" />
      </div>
      <div id="pc-meter" class="pc-meter-bar"><div id="pc-fill" class="pc-fill"></div></div>
      <div id="pc-result" class="tk-output" style="margin-top:6px">—</div>`,

    hash: `
      <div class="tk-panel-title">#️⃣ Hash Generator</div>
      <div class="tk-field-row">
        <label class="tk-label">Input</label>
        <textarea id="hash-input" class="tk-input" rows="3" placeholder="Text to hash…"></textarea>
      </div>
      <div class="tk-field-row">
        <label class="tk-label">Algorithm</label>
        <select id="hash-algo" class="tk-input">
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256" selected>SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      </div>
      <button class="tk-btn" id="hash-gen">Generate Hash</button>
      <div class="tk-output-wrap">
        <code class="tk-output" id="hash-out" style="word-break:break-all">—</code>
        <button class="tk-copy-btn" data-copy-from="hash-out" title="Copy">⎘</button>
      </div>`,

    uuid: `
      <div class="tk-panel-title">🆔 UUID Generator</div>
      <button class="tk-btn" id="uuid-gen">Generate UUID v4</button>
      <div class="tk-output-wrap">
        <code class="tk-output" id="uuid-out">—</code>
        <button class="tk-copy-btn" data-copy-from="uuid-out" title="Copy">⎘</button>
      </div>
      <button class="tk-btn tk-btn-sm" id="uuid-bulk">Generate 5</button>
      <div class="tk-output" id="uuid-bulk-out" style="font-size:0.78rem;line-height:1.8"></div>`,

    timestamp: `
      <div class="tk-panel-title">🕐 Timestamp Converter</div>
      <div class="tk-field-row">
        <label class="tk-label">Unix Timestamp</label>
        <input type="number" id="ts-unix" class="tk-input" placeholder="e.g. 1700000000" />
      </div>
      <button class="tk-btn" id="ts-from-unix">Convert → Date</button>
      <div class="tk-output-wrap">
        <code class="tk-output" id="ts-date-out">—</code>
        <button class="tk-copy-btn" data-copy-from="ts-date-out" title="Copy">⎘</button>
      </div>
      <hr class="tk-divider" />
      <div class="tk-field-row">
        <label class="tk-label">Date / Time</label>
        <input type="datetime-local" id="ts-date-in" class="tk-input" />
      </div>
      <button class="tk-btn" id="ts-to-unix">Convert → Timestamp</button>
      <div class="tk-output-wrap">
        <code class="tk-output" id="ts-unix-out">—</code>
        <button class="tk-copy-btn" data-copy-from="ts-unix-out" title="Copy">⎘</button>
      </div>
      <button class="tk-btn tk-btn-sm" id="ts-now">Current Time</button>`,

    'url-enc': `
      <div class="tk-panel-title">🔗 URL Encoder / Decoder</div>
      <div class="tk-field-row">
        <label class="tk-label">Input</label>
        <textarea id="url-input" class="tk-input" rows="3" placeholder="Text or URL…"></textarea>
      </div>
      <div class="tk-btn-row">
        <button class="tk-btn" id="url-encode">Encode</button>
        <button class="tk-btn" id="url-decode">Decode</button>
      </div>
      <div class="tk-output-wrap">
        <code class="tk-output" id="url-out" style="word-break:break-all">—</code>
        <button class="tk-copy-btn" data-copy-from="url-out" title="Copy">⎘</button>
      </div>`,

    base64: `
      <div class="tk-panel-title">📦 Base64 Encoder / Decoder</div>
      <div class="tk-field-row">
        <label class="tk-label">Input</label>
        <textarea id="b64-input" class="tk-input" rows="3" placeholder="Text or Base64 string…"></textarea>
      </div>
      <div class="tk-btn-row">
        <button class="tk-btn" id="b64-encode">Encode</button>
        <button class="tk-btn" id="b64-decode">Decode</button>
      </div>
      <div class="tk-output-wrap">
        <code class="tk-output" id="b64-out" style="word-break:break-all">—</code>
        <button class="tk-copy-btn" data-copy-from="b64-out" title="Copy">⎘</button>
      </div>`,

    json: `
      <div class="tk-panel-title">{ } JSON Formatter</div>
      <div class="tk-field-row">
        <label class="tk-label">Input JSON</label>
        <textarea id="json-input" class="tk-input" rows="5" placeholder="Paste JSON here…"></textarea>
      </div>
      <div class="tk-btn-row">
        <button class="tk-btn" id="json-format">Format</button>
        <button class="tk-btn" id="json-minify">Minify</button>
      </div>
      <div class="tk-output-wrap">
        <pre class="tk-output" id="json-out" style="white-space:pre-wrap;word-break:break-all">—</pre>
        <button class="tk-copy-btn" data-copy-from="json-out" title="Copy">⎘</button>
      </div>`,

    regex: `
      <div class="tk-panel-title">.* Regex Tester</div>
      <div class="tk-field-row">
        <label class="tk-label">Pattern</label>
        <input type="text" id="rx-pattern" class="tk-input" placeholder="e.g. \\d{3}-\\d{4}" />
      </div>
      <div class="tk-field-row">
        <label class="tk-label">Flags</label>
        <input type="text" id="rx-flags" class="tk-input" value="gi" style="width:60px" />
      </div>
      <div class="tk-field-row">
        <label class="tk-label">Test String</label>
        <textarea id="rx-input" class="tk-input" rows="3" placeholder="Text to test…"></textarea>
      </div>
      <button class="tk-btn" id="rx-test">Test</button>
      <div class="tk-output" id="rx-out" style="margin-top:8px">—</div>`,

    color: `
      <div class="tk-panel-title">🎨 Colour Picker</div>
      <div class="tk-field-row" style="align-items:center">
        <label class="tk-label">Pick</label>
        <input type="color" id="cp-picker" value="#c0152a" style="width:48px;height:36px;border:none;background:none;cursor:pointer" />
      </div>
      <div class="tk-output-wrap">
        <code class="tk-output" id="cp-hex">—</code>
        <button class="tk-copy-btn" data-copy-from="cp-hex" title="Copy">⎘</button>
      </div>
      <div class="tk-output" id="cp-rgb" style="margin-top:4px;font-size:0.82rem">—</div>
      <div class="tk-output" id="cp-hsl" style="margin-top:4px;font-size:0.82rem">—</div>
      <div id="cp-swatch" style="width:100%;height:32px;border-radius:4px;margin-top:10px;background:#c0152a"></div>`,

    lorem: `
      <div class="tk-panel-title">📝 Lorem Ipsum Generator</div>
      <div class="tk-field-row">
        <label class="tk-label">Paragraphs</label>
        <input type="number" id="li-count" class="tk-input" value="2" min="1" max="10" />
      </div>
      <button class="tk-btn" id="li-gen">Generate</button>
      <div class="tk-output-wrap">
        <div class="tk-output" id="li-out" style="font-size:0.8rem;line-height:1.6;white-space:pre-wrap">—</div>
        <button class="tk-copy-btn" data-copy-from="li-out" title="Copy">⎘</button>
      </div>`,

    qrgen: `
      <div class="tk-panel-title">▦ QR Code Generator</div>
      <div class="tk-field-row">
        <label class="tk-label">Content</label>
        <input type="text" id="qr-input" class="tk-input" placeholder="URL, text, email…" />
      </div>
      <button class="tk-btn" id="qr-gen">Generate QR</button>
      <div id="qr-output" style="margin-top:12px;text-align:center"></div>`,

    htmlenc: `
      <div class="tk-panel-title"><> HTML Entity Encoder</div>
      <div class="tk-field-row">
        <label class="tk-label">Input</label>
        <textarea id="he-input" class="tk-input" rows="3" placeholder="HTML or plain text…"></textarea>
      </div>
      <div class="tk-btn-row">
        <button class="tk-btn" id="he-encode">Encode</button>
        <button class="tk-btn" id="he-decode">Decode</button>
      </div>
      <div class="tk-output-wrap">
        <code class="tk-output" id="he-out" style="word-break:break-all">—</code>
        <button class="tk-copy-btn" data-copy-from="he-out" title="Copy">⎘</button>
      </div>`,
  };

  panelEl.innerHTML = panels[toolId] || '<div class="tk-placeholder">Tool not found.</div>';
  bindToolListeners(toolId, panelEl);
  panelEl.querySelectorAll('.tk-copy-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = document.getElementById(btn.dataset.copyFrom);
      const v   = src ? src.textContent.trim() : '';
      if (v && v !== '—') navigator.clipboard.writeText(v).then(() => showToast('Copied!', 'success'));
    });
  });
}

function bindToolListeners(toolId, panelEl) {
  const $ = id => panelEl.querySelector('#' + id);

  if (toolId === 'passgen') {
    $('pg-gen').addEventListener('click', () => {
      const out = $('pg-out');
      const len = Math.max(4, Math.min(128, parseInt($('pg-len').value) || 20));
      const pools = [];
      if ($('pg-upper').checked) pools.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      if ($('pg-lower').checked) pools.push('abcdefghijklmnopqrstuvwxyz');
      if ($('pg-num').checked)   pools.push('0123456789');
      if ($('pg-sym').checked)   pools.push('!@#$%^&*()_+-=[]{}|;:,.<>?');
      if (!pools.length) { out.textContent = 'Select at least one character type.'; return; }
      const all = pools.join('');
      const arr = new Uint32Array(len);
      crypto.getRandomValues(arr);
      const pw = Array.from(arr).map(n => all[n % all.length]).join('');
      out.textContent = pw;
      out.classList.remove('tk-output-placeholder');
      out.classList.add('has-value');
    });
  }

  if (toolId === 'passcheck') {
    $('pc-input').addEventListener('input', () => {
      const p = $('pc-input').value;
      let score = 0;
      if (p.length >= 8)  score++;
      if (p.length >= 12) score++;
      if (p.length >= 20) score++;
      if (/[A-Z]/.test(p)) score++;
      if (/[a-z]/.test(p)) score++;
      if (/[0-9]/.test(p)) score++;
      if (/[^A-Za-z0-9]/.test(p)) score++;
      const labels = ['Very Weak','Weak','Fair','Good','Strong','Very Strong','Excellent'];
      const colors = ['#c0152a','#c0152a','#e09000','#e0b000','#4a9','#2a8','#2a8'];
      const pct    = Math.min(100, Math.round((score / 7) * 100));
      const fill   = $('pc-fill'); if (fill) { fill.style.width = pct + '%'; fill.style.background = colors[Math.min(score, colors.length-1)]; }
      $('pc-result').textContent = p ? `${labels[Math.min(score, labels.length-1)]} (${pct}%)` : '—';
    });
  }

  if (toolId === 'hash') {
    $('hash-gen').addEventListener('click', async () => {
      const text  = $('hash-input').value;
      const algo  = $('hash-algo').value;
      const enc   = new TextEncoder();
      const buf   = await crypto.subtle.digest(algo, enc.encode(text));
      $('hash-out').textContent = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    });
  }

  if (toolId === 'uuid') {
    const genUuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16);
    });
    $('uuid-gen').addEventListener('click', () => $('uuid-out').textContent = genUuid());
    $('uuid-bulk').addEventListener('click', () => $('uuid-bulk-out').innerHTML = [1,2,3,4,5].map(() => genUuid()).join('<br>'));
  }

  if (toolId === 'timestamp') {
    $('ts-from-unix').addEventListener('click', () => {
      const v = parseInt($('ts-unix').value);
      if (!v) { $('ts-date-out').textContent = 'Invalid timestamp'; return; }
      $('ts-date-out').textContent = new Date(v * 1000).toUTCString();
    });
    $('ts-to-unix').addEventListener('click', () => {
      const v = $('ts-date-in').value;
      if (!v) { $('ts-unix-out').textContent = 'Pick a date'; return; }
      $('ts-unix-out').textContent = Math.floor(new Date(v).getTime() / 1000);
    });
    $('ts-now').addEventListener('click', () => {
      const now = new Date();
      $('ts-unix').value = Math.floor(now.getTime()/1000);
      $('ts-date-out').textContent = now.toUTCString();
    });
  }

  if (toolId === 'url-enc') {
    $('url-encode').addEventListener('click', () => $('url-out').textContent = encodeURIComponent($('url-input').value));
    $('url-decode').addEventListener('click', () => { try { $('url-out').textContent = decodeURIComponent($('url-input').value); } catch { $('url-out').textContent = 'Invalid encoded string'; } });
  }

  if (toolId === 'base64') {
    $('b64-encode').addEventListener('click', () => $('b64-out').textContent = btoa(unescape(encodeURIComponent($('b64-input').value))));
    $('b64-decode').addEventListener('click', () => { try { $('b64-out').textContent = decodeURIComponent(escape(atob($('b64-input').value))); } catch { $('b64-out').textContent = 'Invalid Base64 string'; } });
  }

  if (toolId === 'json') {
    $('json-format').addEventListener('click', () => {
      try { $('json-out').textContent = JSON.stringify(JSON.parse($('json-input').value), null, 2); }
      catch (e) { $('json-out').textContent = 'Invalid JSON: ' + e.message; }
    });
    $('json-minify').addEventListener('click', () => {
      try { $('json-out').textContent = JSON.stringify(JSON.parse($('json-input').value)); }
      catch (e) { $('json-out').textContent = 'Invalid JSON: ' + e.message; }
    });
  }

  if (toolId === 'regex') {
    $('rx-test').addEventListener('click', () => {
      try {
        const rx = new RegExp($('rx-pattern').value, $('rx-flags').value.replace('g',''));
        const str = $('rx-input').value;
        const matches = [...str.matchAll(new RegExp($('rx-pattern').value, 'gi'))];
        $('rx-out').textContent = matches.length ? `✅ ${matches.length} match(es): ${matches.map(m => JSON.stringify(m[0])).slice(0,8).join(', ')}` : '❌ No matches';
      } catch(e) { $('rx-out').textContent = 'Error: ' + e.message; }
    });
  }

  if (toolId === 'color') {
    const updateColor = () => {
      const hex = $('cp-picker').value;
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      const max = Math.max(r,g,b)/255, min = Math.min(r,g,b)/255;
      const l = (max+min)/2;
      const s = max===min ? 0 : l<0.5 ? (max-min)/(max+min) : (max-min)/(2-max-min);
      const h = max===min ? 0 : max===r/255 ? ((g-b)/255/(max-min)+6)%6 : max===g/255 ? (b-r)/255/(max-min)+2 : (r-g)/255/(max-min)+4;
      $('cp-hex').textContent = hex.toUpperCase();
      $('cp-rgb').textContent = `RGB(${r}, ${g}, ${b})`;
      $('cp-hsl').textContent = `HSL(${Math.round(h*60)}°, ${Math.round(s*100)}%, ${Math.round(l*100)}%)`;
      $('cp-swatch').style.background = hex;
    };
    $('cp-picker').addEventListener('input', updateColor);
    updateColor();
  }

  if (toolId === 'lorem') {
    const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    $('li-gen').addEventListener('click', () => {
      const n = Math.max(1, Math.min(10, parseInt($('li-count').value)||2));
      $('li-out').textContent = Array(n).fill(LOREM).join('\n\n');
    });
  }

  if (toolId === 'qrgen') {
    $('qr-gen').addEventListener('click', () => {
      const val = $('qr-input').value.trim();
      if (!val) { $('qr-output').textContent = 'Enter text or URL first.'; return; }
      $('qr-output').innerHTML = '';
      if (typeof QRCode !== 'undefined') {
        new QRCode($('qr-output'), { text: val, width: 160, height: 160, colorDark:'#000000', colorLight:'#ffffff', correctLevel: QRCode.CorrectLevel.M });
      } else {
        $('qr-output').innerHTML = `<a href="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(val)}" target="_blank" rel="noopener">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(val)}" alt="QR Code" style="width:160px;height:160px" /></a>`;
      }
    });
  }

  if (toolId === 'htmlenc') {
    $('he-encode').addEventListener('click', () => {
      $('he-out').textContent = $('he-input').value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
    });
    $('he-decode').addEventListener('click', () => {
      const d = document.createElement('div');
      d.innerHTML = $('he-input').value;
      $('he-out').textContent = d.textContent;
    });
  }
}


/* ════════════════════════════════════════════════════════════
   GLOBAL SEARCH
   ════════════════════════════════════════════════════════════ */

function buildSearchIndex() {
  const idx = [];
  IRC_DATA.forEach(r => idx.push({
    label: r.label,
    desc: (r.bestFor || r.desc).slice(0, 70),
    cat: r.cat, icon: r.icon, type: 'resource',
    action: () => { window.open(r.url, '_blank', 'noopener,noreferrer'); trackRecentlyUsed(r); }
  }));
  TOOLKIT_TOOLS.forEach(t => idx.push({
    label: t.label, desc: 'Investigator Toolkit', cat: 'toolkit', icon: t.icon, type: 'tool',
    action: () => switchToTool(t.id)
  }));
  return idx;
}

function switchToTool(toolId) {
  document.querySelectorAll('.tab-btn[data-tab]').forEach(b => {
    const active = b.dataset.tab === 'toolkit';
    b.classList.toggle('active', active);
    b.setAttribute('aria-selected', active ? 'true' : 'false');
  });
  document.querySelectorAll('.tab-pane[id^="tab-"]').forEach(p =>
    p.classList.toggle('active', p.id === 'tab-toolkit')
  );
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
    if (clearBtn) clearBtn.style.display = term.length > 0 ? '' : 'none';
    if (!term || term.length < 2) { dropdown.classList.remove('open'); return; }

    const results = _searchIdx.filter(r =>
      r.label.toLowerCase().includes(term) || (r.desc && r.desc.toLowerCase().includes(term)) || r.cat.includes(term)
    ).slice(0, 12);

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="gsr-empty">No results found.</div>';
      dropdown.classList.add('open');
      return;
    }

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
      if (item) el.addEventListener('click', () => { item.action(); input.value = ''; dropdown.classList.remove('open'); if (clearBtn) clearBtn.style.display = 'none'; });
    });

    dropdown.classList.add('open');
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = ''; dropdown.classList.remove('open'); clearBtn.style.display = 'none'; input.focus();
    });
  }

  document.addEventListener('click', e => {
    if (!input.contains(e.target) && !dropdown.contains(e.target)) dropdown.classList.remove('open');
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Escape') { dropdown.classList.remove('open'); input.blur(); }
  });
}


/* ════════════════════════════════════════════════════════════
   DASHBOARD v3.2 ADDITIONS
   ════════════════════════════════════════════════════════════ */

const DASH_TIPS = [
  { label: 'Google Operator',  text: 'Use <code>site:gc.ca filetype:pdf</code> to search only Canadian government PDF documents.' },
  { label: 'Boolean Logic',    text: 'Combine terms with <code>OR</code> to broaden: <code>"John Smith" OR "J. Smith"</code> catches both forms.' },
  { label: 'Exact Match',      text: 'Wrap names in quotes for exact matches: <code>"John Smith"</code> prevents mixed results.' },
  { label: 'Social OSINT',     text: 'Use <code>site:linkedin.com "Name"</code> to find LinkedIn profiles via Google.' },
  { label: 'Metadata',         text: 'PDFs and images often contain hidden metadata — author names, GPS coordinates, device info.' },
  { label: 'Archive Research', text: 'Wayback Machine (<code>web.archive.org</code>) lets you view deleted or changed web pages.' },
  { label: 'Privacy Tip',      text: 'Use a dedicated browser profile for OSINT work — isolates cookies and prevents cross-contamination.' },
  { label: 'Evidence',         text: 'Screenshot and timestamp evidence immediately. Web content can disappear within hours.' },
  { label: 'Username OSINT',   text: 'A consistent username across platforms is one of the strongest personal identifiers.' },
  { label: 'WHOIS Research',   text: 'Historical WHOIS data often reveals past owners and registrant contact info for domains.' },
  { label: 'Certificate OSINT',text: '<code>crt.sh</code> — Certificate Transparency logs reveal subdomains registered on any domain.' },
  { label: 'Image Intel',      text: 'Yandex Images often performs better than Google Lens for facial reverse image searches.' },
  { label: 'Telegram Intel',   text: 'Telegram public channels are indexed by search engines — include <code>site:t.me</code> in Google queries.' },
  { label: 'Canadian Tip',     text: 'SEDAR+ contains every public company\'s financial filings in Canada — free and searchable.' },
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
    el.innerHTML = '<div class="history-empty">No favourited resources. Star items in the Resource Center.</div>';
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

  // Clear recently used IRC button
  const clearRuBtn = document.getElementById('btn-clear-irc-recent');
  if (clearRuBtn) {
    clearRuBtn.addEventListener('click', () => {
      localStorage.removeItem(LS_RECENTLY_USED);
      renderRecentlyUsed();
      showToast('Recently used cleared.', 'success');
    });
  }

  // Rotating tip — cycle every 15s, click to advance
  const tipEl = document.getElementById('dash-rotating-tip');
  if (tipEl) {
    tipEl.addEventListener('click', () => { _tipIndex++; renderDashTip(); });
    setInterval(() => { _tipIndex++; renderDashTip(); }, 15000);
  }
});
