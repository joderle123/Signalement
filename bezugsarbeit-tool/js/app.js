// ============================================================
// CDSE Bezugsarbeit Tool - App Logic
// ============================================================

// ---- State ----
const APP = {
  currentView: 'home',
  currentSchuelerId: null,
  currentProfilTab: 'dashboard',
  kalenderDatum: new Date(),
  dashKalenderDatum: new Date(),
  dashKalenderSelectedTag: null,
  notizbuchAktivSektion: 0,
  currentScreeningId: null,
  screeningStep: 0,
  screeningAntworten: {},
  scrProfilChart: null,
  scrVerlaufChart: null,
  staerkenChart: null,
  wohlbefindenChart: null,
  wohlbefindenScore: null,
  protStimmung: null,
  protPVT: null,
};

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  migrateRoadmapsTo7Phasen();
  renderSidebar();
  showView('home');
});

// ---- Migration: 4 Phasen → 7 Phasen ----
function migrateRoadmapsTo7Phasen() {
  const alle = DB.getRoadmaps();
  let changed = false;
  alle.forEach(roadmap => {
    if (roadmap.phasen.length === 4) {
      // Alt: Phase 1-4 → Neu: Phase 0-6
      const alt = roadmap.phasen;
      roadmap.phasen = ROADMAP_PHASEN.map(p => {
        if (p.nr === 0) {
          // Phase 0 (Vorbereitung) — neu, übernehme Status von alter Phase 1
          return { nr: 0, status: alt[0].status === 'erledigt' ? 'erledigt' : 'offen', startDatum: null, endDatum: null, themen: [], notizen: '' };
        }
        if (p.nr === 1) {
          // Phase 1 (Sicherheit) ← alte Phase 1 (Stabilisierung)
          return { ...alt[0], nr: 1 };
        }
        if (p.nr === 2) {
          // Phase 2 (Exploration) ← alte Phase 2 (Verstehen)
          return { ...alt[1], nr: 2 };
        }
        if (p.nr === 3) {
          // Phase 3 (Ziele & Plan) — neu
          return { nr: 3, status: 'offen', startDatum: null, endDatum: null, themen: [], notizen: '' };
        }
        if (p.nr === 4) {
          // Phase 4 (Intervention) ← alte Phase 3 (Aktive Bearbeitung)
          return { ...alt[2], nr: 4 };
        }
        if (p.nr === 5) {
          // Phase 5 (Konsolidierung) — neu, übernehme Themen von alter Phase 4
          return { ...alt[3], nr: 5 };
        }
        if (p.nr === 6) {
          // Phase 6 (Abschluss) — neu
          return { nr: 6, status: 'offen', startDatum: null, endDatum: null, themen: [], notizen: '' };
        }
        return { nr: p.nr, status: 'offen', startDatum: null, endDatum: null, themen: [], notizen: '' };
      });
      changed = true;
    }
  });
  if (changed) {
    localStorage.setItem(DB.KEYS.ROADMAPS, JSON.stringify(alle));
  }
}

// ============================================================
// VIEWS
// ============================================================
function showView(view, schuelerId = null) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  APP.currentView = view;

  if (view === 'home') {
    document.getElementById('view-home').classList.add('active');
    document.getElementById('nav-home').classList.add('active');
    renderHome();
  } else if (view === 'profil' && schuelerId) {
    APP.currentSchuelerId = schuelerId;
    document.getElementById('view-profil').classList.add('active');
    renderProfil(schuelerId);
    updateSidebarActive(schuelerId);
  } else if (view === 'kalender') {
    document.getElementById('view-kalender').classList.add('active');
    document.getElementById('nav-kalender').classList.add('active');
    renderKalender();
  } else if (view === 'screening' && schuelerId) {
    APP.currentSchuelerId = schuelerId;
    document.getElementById('view-screening').classList.add('active');
    updateSidebarActive(schuelerId);
    renderScreening(schuelerId);
  }
}

function updateSidebarActive(schuelerId) {
  document.querySelectorAll('.schueler-item').forEach(el => {
    el.classList.toggle('active', el.dataset.id === schuelerId);
  });
}

// ============================================================
// SIDEBAR
// ============================================================
function renderSidebar() {
  const liste = document.getElementById('schueler-sidebar-liste');
  const schueler = DB.getSchueler();

  if (schueler.length === 0) {
    liste.innerHTML = '<div style="padding:12px 16px;font-size:12px;color:rgba(255,255,255,0.35);">Noch keine Schüler</div>';
    return;
  }

  liste.innerHTML = schueler.map(s => {
    const screenings = DB.getScreenings(s.id);
    const urgent = screenings.some(scr => scr.severity === 'urgent');
    const latestScr = screenings.filter(scr => scr.abgeschlossen).sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
    const scrDot = urgent ? '<span class="scr-urgent-dot" title="Dringendes Screening">!</span>' : '';
    return `<div class="schueler-item" data-id="${s.id}" onclick="showView('profil','${s.id}')">
      <div class="schueler-avatar">${s.foto
        ? `<img src="${s.foto}" alt="">`
        : getInitials(s.vorname, s.nachname)}
      </div>
      <div class="schueler-item-info">
        <div class="schueler-item-name">${s.vorname} ${s.nachname}${scrDot}</div>
        <div class="schueler-item-meta">${s.klasse || '—'} · ${alter(s.geburtsdatum)}</div>
      </div>
      <div style="display:flex;align-items:center;gap:4px;">
        ${latestScr ? `<button class="btn-scr-mini" title="Screening öffnen" onclick="event.stopPropagation();showView('screening','${s.id}')">🔍</button>` : ''}
        <div class="risiko-badge risiko-${s.risiko || 'niedrig'}"></div>
      </div>
    </div>`;
  }).join('');
}

// ============================================================
// HOME VIEW
// ============================================================
function renderHome() {
  const schueler = DB.getSchueler();
  const grid = document.getElementById('home-grid');
  const statsEl = document.getElementById('home-stats');
  const suchfeld = document.getElementById('home-suche');
  const filter = suchfeld ? suchfeld.value.toLowerCase() : '';
  const gefiltert = schueler.filter(s =>
    `${s.vorname} ${s.nachname} ${s.klasse}`.toLowerCase().includes(filter)
  );

  // Stats-Leiste
  if (schueler.length > 0 && statsEl) {
    const alleNotizen = schueler.reduce((n, s) => n + DB.getNotizen(s.id).length, 0);
    const aktiveThemen = schueler.reduce((n, s) => n + countStatus(s, 'in-bearbeitung'), 0);
    const hochrisiko = schueler.filter(s => s.risiko === 'hoch').length;
    statsEl.innerHTML = `
      <div class="stat-box">
        <div class="stat-box-zahl">${schueler.length}</div>
        <div class="stat-box-label">Schüler gesamt</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-zahl blue">${aktiveThemen}</div>
        <div class="stat-box-label">Aktive Themen</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-zahl">${alleNotizen}</div>
        <div class="stat-box-label">Notizen & Sitzungen</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-zahl ${hochrisiko > 0 ? 'red' : ''}">${hochrisiko}</div>
        <div class="stat-box-label">Hochrisiko</div>
      </div>`;
  } else if (statsEl) {
    statsEl.innerHTML = '';
  }

  // Ampelsystem — Aufmerksamkeit erforderlich
  renderAmpelsystem(schueler, statsEl);

  if (gefiltert.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column:1/-1">
        <div class="empty-state-icon">👥</div>
        <div class="empty-state-title">${filter ? 'Kein Treffer' : 'Noch keine Schüler'}</div>
        <div class="empty-state-text">${filter ? `Keine Schüler gefunden für „${filter}".` : 'Erstelle das erste Schülerprofil um zu beginnen.'}</div>
        ${!filter ? '<button class="btn btn-primary" onclick="openSchuelerModal()">+ Neuen Schüler anlegen</button>' : ''}
      </div>`;
    return;
  }

  grid.innerHTML = gefiltert.map(s => {
    const notizen = DB.getNotizen(s.id);
    const abgeschlossen = countStatus(s, 'abgeschlossen');
    const inBearbeitung = countStatus(s, 'in-bearbeitung');
    const letzteNotiz = notizen.length > 0
      ? notizen.slice().sort((a, b) => b.datum.localeCompare(a.datum))[0]
      : null;
    const letzteAnzeige = letzteNotiz
      ? `<span class="stat-pill">🕐 ${formatDatum(letzteNotiz.datum)}</span>`
      : '';
    return `
    <div class="schueler-card" onclick="showView('profil','${s.id}')">
      <div class="risiko-indicator ${s.risiko || 'niedrig'}">
        <div class="risiko-badge risiko-${s.risiko || 'niedrig'}"></div>
        ${capitalize(s.risiko || 'niedrig')}
      </div>
      <div class="schueler-card-header">
        <div class="schueler-card-avatar">${s.foto
          ? `<img src="${s.foto}" alt="">`
          : getInitials(s.vorname, s.nachname)}
        </div>
        <div>
          <div class="schueler-card-name">${s.vorname} ${s.nachname}</div>
          <div class="schueler-card-meta">${s.klasse || '—'} &middot; ${alter(s.geburtsdatum)}</div>
        </div>
      </div>
      <div class="schueler-card-stats">
        <span class="stat-pill green">✅ ${abgeschlossen}</span>
        <span class="stat-pill blue">◐ ${inBearbeitung}</span>
        <span class="stat-pill orange">💬 ${notizen.length}</span>
        ${letzteAnzeige}
      </div>
    </div>`;
  }).join('');
}

function countStatus(schueler, status) {
  return Object.values(schueler.topicStatus || {}).filter(v => v === status).length;
}

function renderAmpelsystem(schueler, afterEl) {
  const container = document.getElementById('ampelsystem');
  if (!container || schueler.length === 0) { if (container) container.innerHTML = ''; return; }

  const heute = new Date();
  const alerts = [];

  schueler.forEach(s => {
    const notizen = DB.getNotizen(s.id);
    const screenings = DB.getScreenings(s.id).filter(sc => sc.abgeschlossen);
    const wb = DB.getWohlbefinden(s.id).sort((a, b) => b.datum.localeCompare(a.datum));

    // 1. Hochrisiko
    if (s.risiko === 'hoch') {
      alerts.push({ typ: 'rot', icon: '🔴', schueler: s,
        text: 'Hochrisiko-Einstufung', detail: 'Erfordert engmaschige Begleitung' });
    }

    // 2. Lange nicht gesehen (>14 Tage keine Notiz)
    const letzteNotiz = notizen.length > 0
      ? notizen.sort((a, b) => b.datum.localeCompare(a.datum))[0] : null;
    if (letzteNotiz) {
      const tageSeit = Math.floor((heute - new Date(letzteNotiz.datum)) / 86400000);
      if (tageSeit > 21) {
        alerts.push({ typ: 'gelb', icon: '🟡', schueler: s,
          text: `Seit ${tageSeit} Tagen kein Eintrag`, detail: 'Kontakt aufnehmen empfohlen' });
      }
    } else if (notizen.length === 0) {
      const erstelltVor = Math.floor((heute - new Date(s.erstellt)) / 86400000);
      if (erstelltVor > 7) {
        alerts.push({ typ: 'gelb', icon: '🟡', schueler: s,
          text: 'Noch keine Notizen', detail: `Profil seit ${erstelltVor} Tagen ohne Einträge` });
      }
    }

    // 3. Screening mit dringendem Ergebnis
    const latestScr = screenings.length > 0
      ? screenings.sort((a, b) => b.datum.localeCompare(a.datum))[0] : null;
    if (latestScr && (latestScr.severity === 'urgent' || latestScr.severity === 'high')) {
      const label = latestScr.severity === 'urgent' ? 'Dringendes Screening-Ergebnis' : 'Erhöhtes Screening-Ergebnis';
      const flagCount = (latestScr.flaggedAreas || []).length;
      alerts.push({ typ: latestScr.severity === 'urgent' ? 'rot' : 'orange', icon: latestScr.severity === 'urgent' ? '🚨' : '🟠', schueler: s,
        text: label, detail: `${flagCount} auffällige Bereiche` });
    }

    // 4. Wohlbefinden-Trend abfallend (letzte 3 Werte sinken)
    if (wb.length >= 3) {
      const letzte3 = wb.slice(0, 3).map(w => w.score);
      if (letzte3[0] < letzte3[1] && letzte3[1] < letzte3[2] && letzte3[0] <= 4) {
        alerts.push({ typ: 'orange', icon: '📉', schueler: s,
          text: `Wohlbefinden sinkt (${letzte3[0]}/10)`, detail: 'Abfallender Trend in den letzten Einträgen' });
      }
    }
  });

  if (alerts.length === 0) {
    container.innerHTML = '';
    return;
  }

  // Sort: rot first, then orange, then gelb
  const sortOrder = { rot: 0, orange: 1, gelb: 2 };
  alerts.sort((a, b) => (sortOrder[a.typ] ?? 9) - (sortOrder[b.typ] ?? 9));

  container.innerHTML = `
    <div class="ampel-container">
      <div class="ampel-header">
        <span>⚡</span> Aufmerksamkeit erforderlich
        <span class="ampel-count">${alerts.length}</span>
      </div>
      <div class="ampel-liste">
        ${alerts.slice(0, 8).map(a => `
          <div class="ampel-item ampel-${a.typ}" onclick="showView('profil','${a.schueler.id}')">
            <span class="ampel-icon">${a.icon}</span>
            <div class="ampel-info">
              <span class="ampel-name">${a.schueler.vorname} ${a.schueler.nachname}</span>
              <span class="ampel-text">${a.text}</span>
            </div>
            <span class="ampel-detail">${a.detail}</span>
          </div>`).join('')}
      </div>
    </div>`;
}

// ============================================================
// PROFIL VIEW
// ============================================================
function renderProfil(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!s) { showView('home'); return; }

  // Header
  document.getElementById('profil-name').textContent = `${s.vorname} ${s.nachname}`;
  document.getElementById('profil-klasse').textContent = s.klasse || '—';
  document.getElementById('profil-alter').textContent = alter(s.geburtsdatum);
  document.getElementById('profil-seit').textContent = s.eintrittsdatum
    ? `Seit ${formatDatum(s.eintrittsdatum)}` : '';

  const avatarEl = document.getElementById('profil-avatar');
  avatarEl.innerHTML = s.foto
    ? `<img src="${s.foto}" alt=""><div class="profil-avatar-overlay">📷</div>`
    : `${getInitials(s.vorname, s.nachname)}<div class="profil-avatar-overlay">📷</div>`;

  // Risikoampel im Header
  const risikoEl = document.getElementById('profil-risiko');
  risikoEl.className = `risiko-indicator ${s.risiko || 'niedrig'}`;
  risikoEl.innerHTML = `<div class="risiko-badge risiko-${s.risiko || 'niedrig'}"></div> ${capitalize(s.risiko || 'niedrig')} Risiko`;

  // Aktiven Tab rendern (über Phasen-Navigation)
  const phase = getPhaseForTab(APP.currentProfilTab);
  showPhase(phase, APP.currentProfilTab);
}

// ============================================================
// PHASEN-NAVIGATION (5 Haupttabs mit Sub-Tabs)
// ============================================================
const PHASE_TABS = {
  wissen: [
    { id: 'bibliothek', label: 'Bibliothek' }
  ],
  sammeln: [
    { id: 'info', label: 'Aufnahme' },
    { id: 'screening', label: 'Screening' },
    { id: 'staerken', label: 'Stärken' },
    { id: 'genogramm', label: 'Genogramm' },
    { id: 'verhalten', label: 'Verhalten' },
    { id: 'notizen', label: 'Notizen' }
  ],
  leitfaden: [
    { id: 'dashboard', label: 'Heute' },
    { id: 'fallformulierung', label: '5P-Analyse' },
    { id: 'roadmap', label: 'Förderplan & Ziele' },
    { id: 'themen', label: 'Themen & Sitzungen' }
  ],
  analyse: [
    { id: 'hypothesen-tab', label: 'Hypothesen' },
    { id: 'treatment-tab', label: 'Verlauf' },
    { id: 'berichte', label: 'Berichte' }
  ]
};

// Track current phase
APP.currentPhase = 'leitfaden';

function getPhaseForTab(tabId) {
  for (const [phase, tabs] of Object.entries(PHASE_TABS)) {
    if (tabs.some(t => t.id === tabId)) return phase;
  }
  return 'leitfaden';
}

function showPhase(phase, subTabId) {
  APP.currentPhase = phase;

  // Highlight main tab
  document.querySelectorAll('.profil-main-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.phase === phase)
  );

  // Render sub-tabs
  const subBar = document.getElementById('profil-tabs-sub');
  const tabs = PHASE_TABS[phase];

  if (tabs.length <= 1) {
    subBar.style.display = 'none';
    showProfilTab(subTabId || tabs[0].id);
  } else {
    subBar.style.display = 'flex';
    const activeSubId = subTabId || tabs[0].id;
    subBar.innerHTML = tabs.map(t =>
      `<div class="profil-sub-tab ${t.id === activeSubId ? 'active' : ''}" data-tab="${t.id}" onclick="showSubTab('${t.id}')">${t.label}</div>`
    ).join('');
    showProfilTab(activeSubId);
  }
}

function showSubTab(tabId) {
  document.querySelectorAll('.profil-sub-tab').forEach(t =>
    t.classList.toggle('active', t.dataset.tab === tabId)
  );
  showProfilTab(tabId);
}

function showProfilTab(tab) {
  APP.currentProfilTab = tab;

  // Show/hide tab content
  document.querySelectorAll('.profil-tab-content').forEach(c => {
    c.classList.toggle('active', c.dataset.tab === tab);
  });

  // Ensure phase nav is synced (for direct calls to showProfilTab)
  const phase = getPhaseForTab(tab);
  if (phase !== APP.currentPhase) {
    showPhase(phase, tab);
    return; // showPhase will call showProfilTab again
  }

  if (tab === 'dashboard') renderDashboard();
  if (tab === 'roadmap') { renderRoadmap(); renderZiele(); renderScreeningZielVorschlaege(); }
  if (tab === 'themen') { renderThemen(); renderSitzungenImThemenTab(); }
  if (tab === 'notizen') renderNotizen();
  if (tab === 'staerken') renderStaerken();
  if (tab === 'fallformulierung') renderFallformulierung();
  if (tab === 'screening') renderScreeningEmbedded();
  if (tab === 'verhalten') renderVerhalten();
  if (tab === 'berichte') renderBerichte();
  if (tab === 'info') renderInfo();
  if (tab === 'genogramm') renderGenogramm();
  // Wissen
  if (tab === 'bibliothek') renderBibliothek();
  if (tab === 'hypothesen-tab') renderHypothesenTab();
  if (tab === 'treatment-tab') renderTreatmentTab();
}

// ============================================================
// WISSEN: Unified Bibliothek — alle Inhalte an einem Ort
// ============================================================
var bibliothekFilter = 'alle';
var bibliothekSuche = '';

function renderBibliothek() {
  const container = document.getElementById('bibliothek-container');
  if (!container) return;

  // ── Alle Inhalte sammeln ──
  const allItems = [];

  // 1. Fachkraft-Module (📚 blau)
  const fachFiles = new Map();
  Object.entries(FACHKRAFT_MODULE_DATEIEN).forEach(([themaId, datei]) => {
    if (!fachFiles.has(datei)) {
      let label = themaId;
      for (const kat of THEMEN_KATEGORIEN) {
        const t = kat.themen.find(th => th.id === themaId);
        if (t) { label = t.titel; break; }
      }
      fachFiles.set(datei, { id: 'fk-' + datei, label, datei, typ: 'fachkraft', themen: [themaId] });
    } else {
      fachFiles.get(datei).themen.push(themaId);
    }
  });
  fachFiles.forEach(item => allItems.push(item));

  // 2. Therapie-Module (🎓 grün)
  const therapieFiles = new Map();
  Object.entries(THERAPIE_MODULE_DATEIEN).forEach(([themaId, datei]) => {
    if (!therapieFiles.has(datei)) {
      let label = themaId;
      for (const kat of THEMEN_KATEGORIEN) {
        const t = kat.themen.find(th => th.id === themaId);
        if (t) { label = t.titel; break; }
      }
      therapieFiles.set(datei, { id: 'tm-' + datei, label, datei, typ: 'therapie', themen: [themaId] });
    } else {
      therapieFiles.get(datei).themen.push(themaId);
    }
  });
  therapieFiles.forEach(item => allItems.push(item));

  // 3. Interventionen (🎯 orange)
  for (const kat of THEMEN_KATEGORIEN) {
    for (const t of kat.themen) {
      const inters = THEMA_INTERVENTIONEN[t.id];
      if (inters && inters.length > 0) {
        allItems.push({
          id: 'int-' + t.id,
          label: t.titel,
          typ: 'intervention',
          themaId: t.id,
          anzahl: inters.length,
          farbe: kat.farbe,
        });
      }
    }
  }

  // 4. Arbeitsblätter (📝 lila)
  const abFiles = new Map();
  for (const [themaId, blaetter] of Object.entries(ARBEITSBLÄTTER)) {
    for (const ab of blaetter) {
      if (!abFiles.has(ab.datei)) {
        abFiles.set(ab.datei, { id: 'ab-' + ab.datei, label: ab.titel, datei: ab.datei, typ: 'arbeitsblatt' });
      }
    }
  }
  abFiles.forEach(item => allItems.push(item));

  // 5. Wiki-Artikel (📖 teal)
  if (typeof WIKI_ARTIKEL !== 'undefined') {
    WIKI_ARTIKEL.forEach(w => {
      allItems.push({
        id: 'wiki-' + w.id,
        label: w.titel,
        typ: 'wiki',
        wikiId: w.id,
        icon: w.icon,
        kategorie: w.kategorie,
      });
    });
  }

  // ── Filtern ──
  const q = bibliothekSuche.toLowerCase().trim();
  const filtered = allItems.filter(item => {
    if (bibliothekFilter !== 'alle' && item.typ !== bibliothekFilter) return false;
    if (q) {
      const searchText = (item.label + ' ' + (item.datei || '') + ' ' + (item.themen || []).join(' ') + ' ' + (item.wikiId || '') + ' ' + (item.kategorie || '')).toLowerCase();
      if (!searchText.includes(q)) return false;
    }
    return true;
  });

  // ── Typ-Konfiguration ──
  const typConfig = {
    fachkraft:     { icon: '📚', label: 'Fachwissen',      farbe: '#3B82F6', bg: '#EFF6FF' },
    therapie:      { icon: '🎓', label: 'Therapie-Module', farbe: '#22C55E', bg: '#F0FDF4' },
    intervention:  { icon: '🎯', label: 'Interventionen',  farbe: '#F59E0B', bg: '#FFFBEB' },
    arbeitsblatt:  { icon: '📝', label: 'Arbeitsblätter',  farbe: '#8B5CF6', bg: '#F5F3FF' },
    wiki:          { icon: '📖', label: 'Wiki',            farbe: '#0D9488', bg: '#F0FDFA' },
  };

  // ── Zähler pro Typ ──
  const counts = {};
  allItems.forEach(i => { counts[i.typ] = (counts[i.typ] || 0) + 1; });
  const totalCount = allItems.length;

  // ── Render ──
  container.innerHTML = `
    <div style="margin-bottom:24px;">
      <h2 style="margin:0 0 4px;font-size:22px;font-weight:700;">📚 Bibliothek</h2>
      <p style="margin:0;font-size:13px;color:#6B7280;">${totalCount} Ressourcen — Fachwissen, Therapie-Module, Interventionen, Arbeitsblätter & Wiki</p>
    </div>

    <!-- Suchleiste -->
    <div style="margin-bottom:16px;">
      <input type="text" id="bib-suche" placeholder="Suche nach Thema, Modul, Stichwort..."
        value="${escapeHtml(bibliothekSuche)}"
        oninput="bibliothekSuche=this.value;renderBibliothek()"
        style="width:100%;padding:12px 16px;border:2px solid #E5E7EB;border-radius:12px;font-size:15px;box-sizing:border-box;transition:border-color 0.2s;outline:none;"
        onfocus="this.style.borderColor='#3B82F6'" onblur="this.style.borderColor='#E5E7EB'">
    </div>

    <!-- Filter-Pills -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
      <button onclick="bibliothekFilter='alle';renderBibliothek()"
        style="padding:6px 16px;border-radius:20px;border:2px solid ${bibliothekFilter === 'alle' ? '#3B82F6' : '#E5E7EB'};background:${bibliothekFilter === 'alle' ? '#3B82F6' : '#fff'};color:${bibliothekFilter === 'alle' ? '#fff' : '#374151'};font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
        Alle <span style="opacity:0.7;">${totalCount}</span>
      </button>
      ${Object.entries(typConfig).map(([typ, cfg]) => {
        const count = counts[typ] || 0;
        if (count === 0) return '';
        const active = bibliothekFilter === typ;
        return `<button onclick="bibliothekFilter='${typ}';renderBibliothek()"
          style="padding:6px 16px;border-radius:20px;border:2px solid ${active ? cfg.farbe : '#E5E7EB'};background:${active ? cfg.farbe : '#fff'};color:${active ? '#fff' : '#374151'};font-size:13px;font-weight:500;cursor:pointer;transition:all 0.2s;">
          ${cfg.icon} ${cfg.label} <span style="opacity:0.7;">${count}</span>
        </button>`;
      }).join('')}
    </div>

    <!-- Ergebnis-Info -->
    ${q || bibliothekFilter !== 'alle' ? `<div style="font-size:12px;color:#6B7280;margin-bottom:12px;">${filtered.length} Ergebnis${filtered.length !== 1 ? 'se' : ''}${q ? ' für "' + escapeHtml(q) + '"' : ''}${bibliothekFilter !== 'alle' ? ' in ' + typConfig[bibliothekFilter].label : ''}</div>` : ''}

    <!-- Karten-Grid -->
    <div class="bibliothek-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px;">
      ${filtered.length === 0 ? '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9CA3AF;">Keine Ergebnisse gefunden.</div>' : ''}
      ${filtered.map(item => {
        const cfg = typConfig[item.typ];
        return renderBibliothekKarte(item, cfg);
      }).join('')}
    </div>
  `;

  // Focus erhalten
  if (q) {
    const inp = document.getElementById('bib-suche');
    if (inp) { inp.focus(); inp.setSelectionRange(q.length, q.length); }
  }
}

function renderBibliothekKarte(item, cfg) {
  let actionHtml = '';
  let metaHtml = '';

  switch (item.typ) {
    case 'fachkraft':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('fachkraft-module/${item.datei}', '_blank')">Öffnen</button>`;
      metaHtml = item.themen.length > 1 ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${item.themen.length} Themen</div>` : '';
      break;
    case 'therapie':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('therapie-module/${item.datei}', '_blank')">Öffnen</button>`;
      metaHtml = item.themen.length > 1 ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${item.themen.length} Themen</div>` : '';
      break;
    case 'intervention':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="renderAktivitaetenBrowser('${item.themaId}')">Anzeigen</button>`;
      metaHtml = `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${item.anzahl} Aktivitäten</div>`;
      break;
    case 'arbeitsblatt':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('arbeitsblatter/${item.datei}', '_blank')">Öffnen</button>`;
      break;
    case 'wiki':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="openWikiArtikel('${item.wikiId}')">Lesen</button>`;
      metaHtml = item.kategorie ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${item.kategorie}</div>` : '';
      break;
  }

  return `
    <div class="bibliothek-karte" style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px;transition:box-shadow 0.2s,transform 0.2s;cursor:default;border-top:3px solid ${cfg.farbe};"
      onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
      onmouseout="this.style.boxShadow='none';this.style.transform='none'">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:18px;">${item.icon || cfg.icon}</span>
        <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:${cfg.bg};color:${cfg.farbe};font-weight:600;">${cfg.label}</span>
      </div>
      <div style="font-weight:600;font-size:14px;color:#1F2937;line-height:1.3;">${item.label}</div>
      ${metaHtml}
      <div style="margin-top:auto;padding-top:8px;">
        ${actionHtml}
      </div>
    </div>
  `;
}

function filterBibliothek(query) {
  bibliothekSuche = query;
  renderBibliothek();
}

// ============================================================
// ANALYSE: Hypothesen-Tab
// ============================================================
function renderHypothesenTab() {
  const container = document.getElementById('hypothesen-container');
  if (!container) return;
  renderHypothesen(APP.currentSchuelerId);
  const zeitContainer = document.getElementById('hypothesen-zeitstrahl-container');
  if (zeitContainer) {
    try { renderHypothesenZeitstrahl(APP.currentSchuelerId); } catch(e) {}
  }
}

// ============================================================
// ANALYSE: Treatment-Response / Verlauf
// ============================================================
function renderTreatmentTab() {
  const container = document.getElementById('treatment-response-container');
  if (!container) return;
  renderTreatmentResponse(APP.currentSchuelerId);
  try { renderScreeningVerlauf(APP.currentSchuelerId); } catch(e) {}
}

// ============================================================
// WIKI FLOATING PANEL
// ============================================================
function toggleWikiPanel() {
  const panel = document.getElementById('wiki-panel');
  const overlay = document.getElementById('wiki-overlay');
  const fab = document.getElementById('wiki-fab');
  const isOpen = panel.classList.contains('open');

  if (isOpen) {
    panel.classList.remove('open');
    overlay.classList.remove('open');
    fab.style.display = '';
  } else {
    renderWiki();
    panel.classList.add('open');
    overlay.classList.add('open');
    fab.style.display = 'none';
  }
}

// ============================================================
// THEMEN TAB
// ============================================================
function renderThemen() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;
  const container = document.getElementById('themen-container');
  const topicStatus = s.topicStatus || {};

  container.innerHTML = THEMEN_KATEGORIEN.map(kat => {
    const total = kat.themen.length;
    const done = kat.themen.filter(t => topicStatus[t.id] === 'abgeschlossen').length;
    const active = kat.themen.filter(t => topicStatus[t.id] === 'in-bearbeitung').length;

    return `
    <div class="kategorie-section">
      <div class="kategorie-header">
        <div class="kategorie-icon" style="background:${kat.farbe}22;">${renderIcon(kat.icon)}</div>
        <div class="kategorie-titel">${kat.titel}</div>
        <div class="kategorie-progress">${done}/${total} abgeschlossen</div>
      </div>
      <div style="margin-bottom:10px;">
        <div class="progress-bar">
          <div class="progress-bar-fill" style="width:${(done/total)*100}%;background:${kat.farbe};"></div>
        </div>
      </div>
      <div class="themen-grid">
        ${kat.themen.map(thema => {
          const status = topicStatus[thema.id] || 'nicht-begonnen';
          const statusInfo = THEMA_STATUS[status];
          return `
          <div class="thema-card status-${status}"
               onclick="openThemaPanel('${kat.id}','${thema.id}')"
               style="border-left: 3px solid ${kat.farbe};">
            <div class="thema-card-titel">${thema.titel}</div>
            <div class="thema-card-beschreibung">${thema.beschreibung}</div>
            <div class="thema-status-icon" title="${statusInfo.label}">${statusInfo.icon}</div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
}

// ============================================================
// THEMA PANEL (Seitenpanel für ein einzelnes Thema)
// ============================================================
function openThemaPanel(katId, themaId) {
  const kat = THEMEN_KATEGORIEN.find(k => k.id === katId);
  const thema = kat.themen.find(t => t.id === themaId);
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const status = (s.topicStatus || {})[themaId] || 'nicht-begonnen';
  const themaNotizen = DB.getNotizen(APP.currentSchuelerId).filter(n => n.themaId === themaId);

  // Remove existing panel
  document.getElementById('thema-panel')?.remove();

  const panel = document.createElement('div');
  panel.id = 'thema-panel';
  panel.className = 'thema-panel';
  panel.innerHTML = `
    <div class="thema-panel-header" style="background:${kat.farbe}18;border-bottom:2px solid ${kat.farbe}30;">
      <span style="font-size:22px;">${renderIcon(kat.icon)}</span>
      <div class="thema-panel-title">${thema.titel}</div>
      <button class="btn-icon" onclick="document.getElementById('thema-panel').remove()">✕</button>
    </div>
    <div class="thema-panel-body">
      <p style="color:var(--text-light);font-size:13px;margin-bottom:16px;">${thema.beschreibung}</p>
      ${typeof findWikiForThema === 'function' && findWikiForThema(themaId) ? '<div style="margin-bottom:14px;">' + renderWikiLink(findWikiForThema(themaId).id) + '</div>' : ''}

      ${renderArbeitsblaetter(thema.id)}

      <div style="margin-bottom:20px;">
        <label style="display:block;margin-bottom:8px;">Status</label>
        <div class="status-selector">
          ${Object.entries(THEMA_STATUS).map(([key, val]) => `
            <button class="status-btn ${status === key ? 'active' : ''}"
              style="${status === key ? `background:${getStatusFarbe(key)};border-color:${getStatusFarbe(key)};` : ''}"
              onclick="setThemaStatus('${themaId}','${key}',this)">
              ${val.icon} ${val.label}
            </button>`).join('')}
        </div>
      </div>

      <div style="margin-bottom:20px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">
          <label>Notizen zu diesem Thema</label>
        </div>
        <div id="thema-notizen-liste">
          ${themaNotizen.length === 0
            ? '<div style="text-align:center;padding:16px;"><div style="font-size:20px;margin-bottom:6px;">📝</div><div style="color:var(--text-muted);font-size:12px;line-height:1.5;">Noch keine Notizen zu diesem Thema.<br>Starte eine SOAP-Sitzung und verknüpfe sie mit diesem Thema um Fortschritte zu dokumentieren.</div></div>'
            : themaNotizen.map(n => renderNotizKarte(n)).join('')}
        </div>
        <div style="margin-top:12px;">
          <textarea id="thema-notiz-input" class="notiz-textarea" placeholder="Notiz zu diesem Thema hinzufügen..." rows="3"></textarea>
          <div style="display:flex;justify-content:flex-end;margin-top:8px;">
            <button class="btn btn-primary btn-sm" onclick="addThemaNotiz('${themaId}')">Notiz speichern</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(panel);
}

function renderArbeitsblaetter(themaId) {
  const blaetter = ARBEITSBLÄTTER[themaId] || [];
  const aktivitaeten = THEMA_AKTIVITÄTEN[themaId] || [];
  const interventionen = THEMA_INTERVENTIONEN[themaId] || [];
  const modul = typeof THEMA_MODULE !== 'undefined' ? (THEMA_MODULE[themaId] || null) : null;
  const tmDatei = typeof THERAPIE_MODULE_DATEIEN !== 'undefined' ? (THERAPIE_MODULE_DATEIEN[themaId] || null) : null;
  const fkDatei = typeof FACHKRAFT_MODULE_DATEIEN !== 'undefined' ? (FACHKRAFT_MODULE_DATEIEN[themaId] || null) : null;

  if (blaetter.length === 0 && aktivitaeten.length === 0 && interventionen.length === 0 && !modul && !tmDatei && !fkDatei) return '';

  const hasModul = modul || aktivitaeten.length > 0 || interventionen.length > 0 || tmDatei;
  const hasFachkraft = !!fkDatei;

  return `
    <div style="margin-bottom:20px;">
      <div class="panel-tabs" id="panel-tabs-${themaId}">
        <button class="panel-tab active" onclick="switchPanelTab('${themaId}','ab')">
          📋 Arbeitsblatt
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Ebene 1 · Einstieg</span>
        </button>
        ${hasModul ? `<button class="panel-tab" onclick="switchPanelTab('${themaId}','tm')">
          🏥 Therapiemodul
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Ebene 2 · Vertiefung</span>
        </button>` : ''}
        ${hasFachkraft ? `<button class="panel-tab" onclick="switchPanelTab('${themaId}','fk')">
          🎓 Fachkraft
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Ebene 3 · Fachwissen</span>
        </button>` : ''}
      </div>

      <div id="pt-ab-${themaId}" class="panel-tab-content">
        <div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;padding:8px 10px;margin-bottom:10px;font-size:11px;color:#1D4ED8;">
          Einstieg in das Thema · 1 Sitzung · Direkt ausfüllbar
        </div>
        ${blaetter.length === 0
          ? '<p style="color:var(--text-muted);font-size:12px;text-align:center;padding:14px 0;">Kein Arbeitsblatt verfügbar</p>'
          : blaetter.map(b => `
          <a href="arbeitsblatter/${b.datei}" target="_blank"
             style="display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:6px;
                    background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:6px;
                    text-decoration:none;color:#0369A1;font-size:12px;font-weight:600;">
            <span style="font-size:16px;">📋</span>
            <span style="flex:1;">${b.titel}</span>
            <span style="font-size:11px;opacity:0.7;">Öffnen →</span>
          </a>`).join('')}
      </div>

      ${hasModul ? `
      <div id="pt-tm-${themaId}" class="panel-tab-content" style="display:none;">
        ${tmDatei ? `
        <div style="background:#F5F3FF;border:1.5px solid #DDD6FE;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#5B21B6;line-height:1.5;">
          <strong>Therapiemodul (Ebene 2)</strong> · Druckbare Sitzungsanleitung<br>
          <span style="opacity:0.75;">Detaillierter Leitfaden mit Timing, Skript &amp; Übungen für jede Sitzung.</span>
        </div>
        <a href="therapie-module/${tmDatei}" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:10px;
                  background:#F5F3FF;border:1.5px solid #C4B5FD;border-radius:8px;
                  text-decoration:none;color:#5B21B6;font-size:13px;font-weight:600;">
          <span style="font-size:20px;">🏥</span>
          <span style="flex:1;">Therapiemodul öffnen (druckbar)</span>
          <span style="font-size:12px;opacity:0.7;">Öffnen →</span>
        </a>` : ''}
        ${modul ? renderTherapiemodul(modul, themaId) : (aktivitaeten.length > 0 || interventionen.length > 0 ? renderTherapiemodul_legacy(aktivitaeten, interventionen) : '')}
      </div>` : ''}

      ${hasFachkraft ? `
      <div id="pt-fk-${themaId}" class="panel-tab-content" style="display:none;">
        <div style="background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#9A3412;line-height:1.5;">
          <strong>Fachkraft-Modul (Ebene 3)</strong> · Fachliches Hintergrundwissen<br>
          <span style="opacity:0.75;">ICD-Codes, Prävalenzen, Diagnostik, Interventionsansätze &amp; Luxemburger Hilfsangebote.</span>
        </div>
        <a href="fachkraft-module/${fkDatei}" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:10px;
                  background:#FFF7ED;border:1.5px solid #FDBA74;border-radius:8px;
                  text-decoration:none;color:#9A3412;font-size:13px;font-weight:600;">
          <span style="font-size:20px;">🎓</span>
          <span style="flex:1;">Fachkraft-Modul öffnen (druckbar)</span>
          <span style="font-size:12px;opacity:0.7;">Öffnen →</span>
        </a>
        <div style="font-size:11px;color:var(--text-muted);padding:8px 0;">
          <strong>Inhalte:</strong> Störungsbild &amp; Entstehung · Diagnostische Kriterien (ICD-10/11) · Evidenzbasierte Interventionen · Gesprächsführung · Luxemburger Fachstellen &amp; Anlaufstellen
        </div>
      </div>` : ''}
    </div>`;
}

function renderTherapiemodul(modul, themaId) {
  const sitzungFarben = ['#7C3AED','#0369A1','#166534','#92400E','#B91C1C','#0F766E'];

  let html = `<div style="background:#F5F3FF;border:1.5px solid #DDD6FE;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#5B21B6;line-height:1.5;">
    <strong>Therapiemodul (Ebene 2)</strong> · ${modul.dauer}<br>
    <span style="opacity:0.75;">${modul.zielgruppe || 'Für Schüler, bei denen dieses Thema ein zentraler Arbeitsbereich ist.'}</span>
  </div>`;

  modul.sitzungen.forEach((s, idx) => {
    const farbe = sitzungFarben[idx % sitzungFarben.length];
    const sid = `sitz-${themaId}-${s.nr}`;
    html += `
    <div style="border:1.5px solid ${farbe}22;border-radius:8px;margin-bottom:10px;overflow:hidden;">
      <div onclick="toggleSitzung('${sid}')" style="cursor:pointer;background:${farbe}11;padding:10px 12px;display:flex;align-items:center;gap:8px;user-select:none;">
        <span style="min-width:24px;height:24px;border-radius:50%;background:${farbe};color:#fff;font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">${s.nr}</span>
        <div style="flex:1;">
          <div style="font-weight:700;font-size:12px;color:${farbe};">${s.titel}</div>
          <div style="font-size:10px;color:#6B7280;margin-top:1px;">⏱ ${s.dauer} · ${s.ziel}</div>
        </div>
        <button onclick="event.stopPropagation();printSitzung('${themaId}',${s.nr})"
          style="border:1px solid ${farbe}44;background:#fff;color:${farbe};border-radius:5px;padding:3px 8px;font-size:10px;cursor:pointer;white-space:nowrap;">🖨️ Drucken</button>
        <span id="${sid}-arrow" style="color:${farbe};font-size:14px;transition:transform 0.2s;">▼</span>
      </div>
      <div id="${sid}" style="display:none;padding:12px;">`;

    // Pädagogische Felder (nur wenn vorhanden)
    if (s.materialien || s.gruppenformat) {
      html += `<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">`;
      if (s.gruppenformat) {
        html += `<span style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:5px;padding:3px 8px;font-size:10px;color:#0369A1;">👥 ${s.gruppenformat}</span>`;
      }
      if (s.materialien) {
        html += `<span style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:5px;padding:3px 8px;font-size:10px;color:#166534;">📋 ${s.materialien.join(', ')}</span>`;
      }
      html += `</div>`;
    }

    if (s.hinweis_paedagoge) {
      html += `<div style="margin-bottom:12px;background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:6px;padding:10px 12px;">
        <div style="font-size:10px;font-weight:700;color:#C2410C;margin-bottom:4px;">💡 Hinweis für Pädagogen</div>
        <div style="font-size:12px;color:#374151;line-height:1.6;">${s.hinweis_paedagoge}</div>
      </div>`;
    }

    if (s.psychoedukation) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">📚 Psychoedukation</div>
        <div style="background:#FDF4FF;border:1.5px solid #E9D5FF;border-radius:6px;padding:10px 12px;">
          <div style="font-weight:600;font-size:12px;color:#6B21A8;margin-bottom:4px;">${s.psychoedukation.titel}</div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${s.psychoedukation.inhalt}</div>
        </div>
      </div>`;
    }

    if (s.interventionen && s.interventionen.length > 0) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#0369A1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">🧠 Interventionen</div>
        ${s.interventionen.map(i => `
        <div style="background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:6px;padding:10px 12px;margin-bottom:6px;">
          <div style="font-weight:600;font-size:12px;color:#0369A1;margin-bottom:2px;">${i.titel}</div>
          <div style="font-size:10px;color:#0369A1;margin-bottom:4px;">📌 ${i.ansatz} · ⏱ ${i.dauer}</div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${i.beschreibung}</div>
        </div>`).join('')}
      </div>`;
    }

    if (s.uebungen && s.uebungen.length > 0) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">🎯 Übungen</div>
        ${s.uebungen.map(u => `
        <div style="background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:6px;padding:10px 12px;margin-bottom:6px;">
          <div style="font-weight:600;font-size:12px;color:#166534;margin-bottom:2px;">${u.titel} <span style="font-weight:400;opacity:0.7;">(${u.dauer})</span></div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${u.beschreibung}</div>
        </div>`).join('')}
      </div>`;
    }

    if (s.gruppenvariation) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#0F766E;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">👥 Gruppenvariation</div>
        <div style="background:#F0FDFA;border:1.5px solid #99F6E4;border-radius:6px;padding:10px 12px;">
          <div style="font-weight:600;font-size:12px;color:#0F766E;margin-bottom:4px;">${s.gruppenvariation.titel}</div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${s.gruppenvariation.beschreibung}</div>
        </div>
      </div>`;
    }

    if (s.hausaufgabe) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">📝 Hausaufgabe</div>
        <div style="background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:6px;padding:10px 12px;">
          <div style="font-weight:600;font-size:12px;color:#92400E;margin-bottom:2px;">${s.hausaufgabe.titel} <span style="font-weight:400;opacity:0.7;">(${s.hausaufgabe.dauer})</span></div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${s.hausaufgabe.beschreibung}</div>
        </div>
      </div>`;
    }

    if (s.reflexion && s.reflexion.length > 0) {
      html += `<div>
        <div style="font-size:10px;font-weight:700;color:#0369A1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">💭 Reflexion</div>
        <div style="background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:6px;padding:10px 12px;font-size:12px;color:#374151;">
          <ul style="margin:0;padding-left:16px;line-height:1.9;">
            ${s.reflexion.map(f => `<li>${f}</li>`).join('')}
          </ul>
        </div>
      </div>`;
    }

    html += `</div></div>`;
  });

  return html;
}

function toggleSitzung(sid) {
  const el = document.getElementById(sid);
  const arrow = document.getElementById(sid + '-arrow');
  if (!el) return;
  const open = el.style.display !== 'none';
  el.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
}

function printSitzung(themaId, nr) {
  const modul = typeof THEMA_MODULE !== 'undefined' ? THEMA_MODULE[themaId] : null;
  if (!modul) return;
  const sitzung = modul.sitzungen.find(s => s.nr === nr);
  if (!sitzung) return;

  // Thema-Titel aus THEMEN_KATEGORIEN suchen
  let themaLabel = themaId;
  if (typeof THEMEN_KATEGORIEN !== 'undefined') {
    for (const kat of THEMEN_KATEGORIEN) {
      const t = kat.themen.find(th => th.id === themaId);
      if (t) { themaLabel = t.titel; break; }
    }
  }

  const html = generatePrintSheetHTML(themaLabel, modul, sitzung);
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

function generatePrintSheetHTML(themaLabel, modul, s) {
  const escHtml = str => String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const field = (label, content) => content ? `
    <div class="section">
      <div class="section-label">${escHtml(label)}</div>
      <div class="section-body">${escHtml(content)}</div>
    </div>` : '';
  const writeLine = (n=2) => '<div class="write-lines">' + Array(n).fill('<div class="line"></div>').join('') + '</div>';

  return `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="UTF-8">
<title>${escHtml(themaLabel)} – Sitzung ${s.nr}</title>
<style>
  * { box-sizing: border-box; }
  body { font-family: Arial, Helvetica, sans-serif; font-size: 11pt; color: #222; margin: 0; padding: 0; }
  .page { max-width: 210mm; margin: 0 auto; padding: 16mm 18mm 16mm 18mm; }
  h1 { font-size: 15pt; color: #1e3a5f; border-bottom: 2pt solid #1e3a5f; padding-bottom: 5pt; margin: 0 0 4pt 0; }
  .meta { font-size: 9pt; color: #555; margin-bottom: 14pt; }
  .badge { display: inline-block; border: 1pt solid #aaa; border-radius: 4pt; padding: 2pt 7pt; font-size: 8.5pt; margin-right: 5pt; margin-bottom: 4pt; }
  .badge.group { border-color: #0369a1; color: #0369a1; }
  .badge.mat { border-color: #166534; color: #166534; }
  .section { margin-bottom: 12pt; }
  .section-label { font-size: 9pt; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5pt; color: #444; margin-bottom: 4pt; border-left: 3pt solid #1e3a5f; padding-left: 5pt; }
  .section-body { font-size: 10.5pt; line-height: 1.6; color: #333; background: #f7f7f7; border: 1pt solid #ddd; border-radius: 4pt; padding: 8pt 10pt; }
  .hint-box { background: #fff8f0; border: 1.5pt solid #f59e0b; border-radius: 4pt; padding: 8pt 10pt; margin-bottom: 12pt; font-size: 10pt; }
  .hint-label { font-weight: bold; color: #b45309; font-size: 9pt; margin-bottom: 3pt; }
  .item { border: 1pt solid #ccc; border-radius: 4pt; padding: 7pt 10pt; margin-bottom: 6pt; background: #fff; }
  .item-title { font-weight: bold; font-size: 10.5pt; margin-bottom: 3pt; }
  .item-sub { font-size: 8.5pt; color: #666; margin-bottom: 4pt; }
  .item-body { font-size: 10.5pt; line-height: 1.6; }
  .write-lines { margin-top: 4pt; }
  .line { border-bottom: 1pt solid #bbb; height: 18pt; margin-bottom: 2pt; }
  .reflexion-q { margin-bottom: 8pt; }
  .reflexion-q strong { font-size: 10.5pt; }
  .group-box { background: #f0fdfa; border: 1.5pt solid #6ee7b7; border-radius: 4pt; padding: 8pt 10pt; margin-bottom: 12pt; }
  .group-label { font-weight: bold; color: #0f766e; font-size: 9pt; margin-bottom: 3pt; }
  .footer { margin-top: 18pt; border-top: 1pt solid #ccc; padding-top: 6pt; font-size: 8pt; color: #999; display: flex; justify-content: space-between; }
  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    .page { padding: 12mm 16mm; }
  }
</style>
</head>
<body>
<div class="page">
  <h1>${escHtml(themaLabel)} – Sitzung ${s.nr}: ${escHtml(s.titel)}</h1>
  <div class="meta">
    ⏱ ${escHtml(s.dauer)} &nbsp;·&nbsp; 🎯 ${escHtml(s.ziel)}
    ${modul.zielgruppe ? `&nbsp;·&nbsp; 👤 ${escHtml(modul.zielgruppe)}` : ''}
  </div>

  ${s.gruppenformat ? `<span class="badge group">👥 ${escHtml(s.gruppenformat)}</span>` : ''}
  ${s.materialien ? s.materialien.map(m => `<span class="badge mat">📋 ${escHtml(m)}</span>`).join('') : ''}

  ${s.hinweis_paedagoge ? `<div class="hint-box"><div class="hint-label">💡 Hinweis für Pädagogen</div>${escHtml(s.hinweis_paedagoge)}</div>` : ''}

  ${s.psychoedukation ? `
  <div class="section">
    <div class="section-label">📚 Psychoedukation: ${escHtml(s.psychoedukation.titel)}</div>
    <div class="section-body">${escHtml(s.psychoedukation.inhalt)}</div>
  </div>` : ''}

  ${s.interventionen && s.interventionen.length > 0 ? `
  <div class="section">
    <div class="section-label">🧠 Interventionen</div>
    ${s.interventionen.map(i => `
    <div class="item">
      <div class="item-title">${escHtml(i.titel)}</div>
      <div class="item-sub">📌 ${escHtml(i.ansatz)} · ⏱ ${escHtml(i.dauer)}</div>
      <div class="item-body">${escHtml(i.beschreibung)}</div>
      ${writeLine(2)}
    </div>`).join('')}
  </div>` : ''}

  ${s.uebungen && s.uebungen.length > 0 ? `
  <div class="section">
    <div class="section-label">🎯 Übungen</div>
    ${s.uebungen.map(u => `
    <div class="item">
      <div class="item-title">${escHtml(u.titel)} <span style="font-weight:normal;font-size:9pt;">(${escHtml(u.dauer)})</span></div>
      <div class="item-body">${escHtml(u.beschreibung)}</div>
      ${writeLine(3)}
    </div>`).join('')}
  </div>` : ''}

  ${s.gruppenvariation ? `
  <div class="group-box">
    <div class="group-label">👥 Gruppenvariation: ${escHtml(s.gruppenvariation.titel)}</div>
    ${escHtml(s.gruppenvariation.beschreibung)}
  </div>` : ''}

  ${s.hausaufgabe ? `
  <div class="section">
    <div class="section-label">📝 Hausaufgabe: ${escHtml(s.hausaufgabe.titel)} (${escHtml(s.hausaufgabe.dauer)})</div>
    <div class="section-body">${escHtml(s.hausaufgabe.beschreibung)}</div>
    ${writeLine(3)}
  </div>` : ''}

  ${s.reflexion && s.reflexion.length > 0 ? `
  <div class="section">
    <div class="section-label">💭 Reflexionsfragen</div>
    ${s.reflexion.map(q => `
    <div class="reflexion-q">
      <strong>${escHtml(q)}</strong>
      ${writeLine(2)}
    </div>`).join('')}
  </div>` : ''}

  <div class="footer">
    <span>CDSE Bezugsarbeit-Tool · Sitzungsarbeitsblatt</span>
    <span>Sitzung ${s.nr} von ${modul.sitzungen.length} · ${escHtml(modul.dauer)}</span>
  </div>
</div>
</body>
</html>`;
}

function renderTherapiemodul_legacy(aktivitaeten, interventionen) {
  const psychoedukativ = interventionen.filter(i =>
    i.ansatz && i.ansatz.toLowerCase().includes('psychoeduk')
  );
  const therapeutisch = interventionen.filter(i =>
    !i.ansatz || !i.ansatz.toLowerCase().includes('psychoeduk')
  );
  const hausaufgaben = aktivitaeten.filter(a => a.dauer && a.dauer.toLowerCase().includes('täglich'));
  const uebungen = aktivitaeten.filter(a => !a.dauer || !a.dauer.toLowerCase().includes('täglich'));

  let html = `<div style="background:#F5F3FF;border:1.5px solid #DDD6FE;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#5B21B6;line-height:1.5;">
    <strong>Therapiemodul (Ebene 2)</strong> · Vollständige Behandlungseinheit · 2–8 Stunden<br>
    <span style="opacity:0.75;">Für Schüler, bei denen dieses Thema ein zentraler Arbeitsbereich ist.</span>
  </div>`;

  if (psychoedukativ.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">📚 Psychoedukation</div>
      ${psychoedukativ.map(i => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#FDF4FF;border:1.5px solid #E9D5FF;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#6B21A8;margin-bottom:2px;">${i.titel}</div>
          <div style="font-size:11px;color:#7C3AED;margin-bottom:4px;">📌 ${i.ansatz} · ⏱ ${i.dauer}</div>
          <div style="font-size:12px;color:#374151;margin-bottom:3px;">${i.beschreibung}</div>
          <div style="font-size:11px;color:#6B7280;font-style:italic;">Indikation: ${i.indikation}</div>
        </div>`).join('')}
    </div>`;
  }

  if (therapeutisch.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#7C3AED;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">🧠 Interventionen</div>
      ${therapeutisch.map(i => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#FDF4FF;border:1.5px solid #E9D5FF;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#6B21A8;margin-bottom:2px;">${i.titel}</div>
          <div style="font-size:11px;color:#7C3AED;margin-bottom:4px;">📌 ${i.ansatz} · ⏱ ${i.dauer}</div>
          <div style="font-size:12px;color:#374151;margin-bottom:3px;">${i.beschreibung}</div>
          <div style="font-size:11px;color:#6B7280;font-style:italic;">Indikation: ${i.indikation}</div>
        </div>`).join('')}
    </div>`;
  }

  if (uebungen.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#166534;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">🎯 Übungen</div>
      ${uebungen.map(a => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#F0FDF4;border:1.5px solid #BBF7D0;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#166534;margin-bottom:4px;">${a.titel} <span style="font-weight:400;opacity:0.7;">(${a.dauer})</span></div>
          <div style="font-size:12px;color:#374151;">${a.beschreibung}</div>
        </div>`).join('')}
    </div>`;
  }

  if (hausaufgaben.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#92400E;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">📝 Hausaufgaben</div>
      ${hausaufgaben.map(a => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#92400E;margin-bottom:4px;">${a.titel} <span style="font-weight:400;opacity:0.7;">(${a.dauer})</span></div>
          <div style="font-size:12px;color:#374151;">${a.beschreibung}</div>
        </div>`).join('')}
    </div>`;
  }

  html += `<div style="margin-bottom:8px;">
    <div style="font-size:11px;font-weight:700;color:#0369A1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">💭 Reflexion</div>
    <div style="padding:10px 12px;background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:6px;font-size:12px;color:#374151;">
      <ul style="margin:0;padding-left:16px;line-height:1.9;">
        <li>Was war für dich in diesem Modul besonders wichtig?</li>
        <li>Was hat sich seit Beginn der Arbeit an diesem Thema verändert?</li>
        <li>Welche Strategien möchtest du im Alltag weiter einsetzen?</li>
        <li>Was würdest du dir noch wünschen oder brauchen?</li>
      </ul>
    </div>
  </div>`;

  return html;
}

function switchPanelTab(themaId, tab) {
  ['ab','tm','fk'].forEach(t => {
    const el = document.getElementById(`pt-${t}-${themaId}`);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  const tabs = document.getElementById(`panel-tabs-${themaId}`);
  if (tabs) tabs.querySelectorAll('.panel-tab').forEach(btn => {
    const isActive = btn.getAttribute('onclick')?.includes(`'${tab}'`);
    btn.classList.toggle('active', !!isActive);
  });
}

function getStatusFarbe(key) {
  const farben = {
    'nicht-begonnen': '#BDC3C7',
    'in-bearbeitung': '#3498DB',
    'abgeschlossen': '#27AE60',
    'nicht-relevant': '#95A5A6',
  };
  return farben[key] || '#ccc';
}

function setThemaStatus(themaId, status, btn) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const topicStatus = s.topicStatus || {};
  topicStatus[themaId] = status;
  DB.updateSchueler(APP.currentSchuelerId, { topicStatus });

  // Update button UI
  const panel = document.getElementById('thema-panel');
  panel.querySelectorAll('.status-btn').forEach(b => {
    b.classList.remove('active');
    b.style.background = '';
    b.style.borderColor = '';
  });
  btn.classList.add('active');
  btn.style.background = getStatusFarbe(status);
  btn.style.borderColor = getStatusFarbe(status);

  // Refresh themen grid in background
  renderThemen();
  showToast('Status aktualisiert', 'success');
}

function addThemaNotiz(themaId) {
  const input = document.getElementById('thema-notiz-input');
  const text = input.value.trim();
  if (!text) return;

  DB.createNotiz({
    schuelerId: APP.currentSchuelerId,
    datum: new Date().toISOString().split('T')[0],
    inhalt: text,
    kategorie: 'beobachtung',
    themaId,
  });

  input.value = '';
  // Refresh thema notizen
  const notizen = DB.getNotizen(APP.currentSchuelerId).filter(n => n.themaId === themaId);
  document.getElementById('thema-notizen-liste').innerHTML = notizen.map(n => renderNotizKarte(n)).join('');
  showToast('Notiz gespeichert', 'success');
}

// ============================================================
// NOTIZEN TAB
// ============================================================
function renderNotizen() {
  populateProtThemen();

  const notizen = DB.getNotizen(APP.currentSchuelerId)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

  const liste = document.getElementById('notizen-liste');
  if (notizen.length === 0) {
    liste.innerHTML = '<div style="text-align:center;padding:24px 16px;">'
      + '<div style="font-size:28px;margin-bottom:8px;">📝</div>'
      + '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Noch keine Sitzungsprotokolle</div>'
      + '<div style="font-size:12px;color:var(--text-muted,#6B7280);line-height:1.5;">Sitzungsprotokolle dokumentieren den Verlauf und sichern die Qualität deiner Arbeit.<br>Nutze das SOAP-Format oben um die erste Sitzung zu dokumentieren.</div>'
      + '</div>';
  } else {
    liste.innerHTML = notizen.map(n => renderNotizKarte(n)).join('');
  }
}

function renderNotizKarte(notiz) {
  const kat = NOTIZ_KATEGORIEN[notiz.kategorie] || NOTIZ_KATEGORIEN.session;
  return `
    <div class="notiz-karte" style="border-left-color:${kat.farbe};">
      <div class="notiz-karte-header">
        <span class="notiz-badge" style="background:${kat.farbe}22;color:${kat.farbe};">${renderIcon(kat.icon)} ${kat.label}</span>
        ${notiz.themaId ? `<span class="notiz-badge" style="background:#EBF5FB;color:#2980B9;">📌 Thema</span>` : ''}
        <span class="notiz-datum">${formatDatum(notiz.datum)}</span>
        <button class="notiz-delete" onclick="deleteNotiz('${notiz.id}')">🗑</button>
      </div>
      <div class="notiz-inhalt">${escapeHtml(notiz.inhalt)}</div>
    </div>`;
}

function toggleNotizModus(modus) {
  const frei = document.getElementById('notiz-modus-frei');
  const prot = document.getElementById('notiz-modus-protokoll');
  const btnFrei = document.getElementById('btn-freie-notiz');
  const btnProt = document.getElementById('btn-protokoll');
  if (modus === 'frei') {
    frei.style.display = '';
    prot.style.display = 'none';
    btnFrei.classList.add('active');
    btnProt.classList.remove('active');
  } else {
    frei.style.display = 'none';
    prot.style.display = '';
    btnProt.classList.add('active');
    btnFrei.classList.remove('active');
    const d = document.getElementById('prot-datum');
    if (!d.value) d.value = new Date().toISOString().split('T')[0];
  }
}

function addProtokoll() {
  const datum       = document.getElementById('prot-datum').value;
  const dauer       = document.getElementById('prot-dauer').value;
  const setting     = document.getElementById('prot-setting').value;
  const nr          = document.getElementById('prot-nr').value;
  const stimmung    = APP.protStimmung || '';
  const themaId     = document.getElementById('prot-thema-id').value;
  const subjektiv   = document.getElementById('prot-subjektiv').value.trim();
  const objektiv    = document.getElementById('prot-objektiv').value.trim();
  const assessment  = document.getElementById('prot-assessment').value.trim();
  const plan        = document.getElementById('prot-plan').value.trim();
  const materialien = document.getElementById('prot-materialien').value.trim();
  const pvtState    = APP.protPVT || '';
  const srsR = parseInt(document.getElementById('srs-relationship')?.value || 0);
  const srsG = parseInt(document.getElementById('srs-goals')?.value || 0);
  const srsA = parseInt(document.getElementById('srs-approach')?.value || 0);
  const srsO = parseInt(document.getElementById('srs-overall')?.value || 0);
  const srsTotal = srsR + srsG + srsA + srsO;

  if (!datum) { showToast('Datum ist ein Pflichtfeld', 'error'); return; }
  if (!subjektiv && !objektiv && !assessment && !plan) {
    showToast('Bitte mindestens ein SOAP-Feld ausfüllen', 'error'); return;
  }

  // Find theme title
  let themaLabel = '';
  if (themaId) {
    for (const kat of THEMEN_KATEGORIEN) {
      const t = kat.themen.find(th => th.id === themaId);
      if (t) { themaLabel = t.titel; break; }
    }
  }

  const stimmungMap = { 'sehr-schlecht': '😫', 'schlecht': '😞', 'neutral': '😐', 'gut': '🙂', 'sehr-gut': '😄' };
  const pvtLabels = { safe: '🟢 Sicher & offen', activated: '🟡 Angespannt', frozen: '🟣 Eingefroren' };

  const text = [
    `🗓 ${datum}  |  ⏱ ${dauer} Min.  |  📍 ${setting}${nr ? `  |  #${nr}` : ''}`,
    stimmung ? `\nStimmung: ${stimmungMap[stimmung] || ''} ${stimmung}` : '',
    pvtState ? `\n🧠 Polyvagal: ${pvtLabels[pvtState] || pvtState}` : '',
    themaLabel ? `\n📌 Thema: ${themaLabel}` : '',
    subjektiv  ? `\n━━━ S (Subjektiv) ━━━\n${subjektiv}` : '',
    objektiv   ? `\n━━━ O (Objektiv) ━━━\n${objektiv}` : '',
    assessment ? `\n━━━ A (Assessment) ━━━\n${assessment}` : '',
    plan       ? `\n━━━ P (Plan) ━━━\n${plan}` : '',
    materialien ? `\n📎 Materialien: ${materialien}` : '',
    `\n📊 SRS: ${srsTotal}/40 (Beziehung: ${srsR}, Ziele: ${srsG}, Ansatz: ${srsA}, Gesamt: ${srsO})`,
  ].filter(Boolean).join('');

  DB.createNotiz({
    schuelerId: APP.currentSchuelerId,
    datum,
    inhalt: text,
    kategorie: 'session',
    themaId: themaId || null,
    soap: { subjektiv, objektiv, assessment, plan, stimmung, setting, dauer, nr, materialien, themaId, themaLabel, pvt: pvtState, srs: { relationship: srsR, goals: srsG, approach: srsA, overall: srsO, total: srsTotal } },
  });

  // Also log wellbeing if mood was set
  if (stimmung) {
    const moodScore = { 'sehr-schlecht': 2, 'schlecht': 4, 'neutral': 5, 'gut': 7, 'sehr-gut': 9 };
    DB.addWohlbefinden(APP.currentSchuelerId, moodScore[stimmung] || 5, `Sitzung: ${themaLabel || setting}`);
  }

  // Reset form
  ['prot-subjektiv','prot-objektiv','prot-assessment','prot-plan','prot-materialien'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('prot-thema-id').value = '';
  document.getElementById('prot-nr').value = '';
  APP.protStimmung = null;
  document.querySelectorAll('.prot-stimmung-btn').forEach(b => b.classList.remove('selected'));

  // Reset PVT
  APP.protPVT = null;
  document.querySelectorAll('.pvt-card').forEach(b => b.classList.remove('selected'));
  const pvtEmpf = document.getElementById('pvt-empfehlung');
  if (pvtEmpf) pvtEmpf.style.display = 'none';

  // Reset SRS
  ['relationship', 'goals', 'approach', 'overall'].forEach(id => {
    const slider = document.getElementById(`srs-${id}`);
    if (slider) { slider.value = 5; }
    const valEl = document.getElementById(`srs-val-${id}`);
    if (valEl) valEl.textContent = '5';
  });
  const srsTotal2 = document.getElementById('srs-total-zahl');
  if (srsTotal2) srsTotal2.textContent = '20';
  const srsAlert2 = document.getElementById('srs-alert');
  if (srsAlert2) srsAlert2.style.display = 'none';

  renderNotizen();
  showToast('Protokoll gespeichert (SOAP)', 'success');
}

// ---- SOAP Beispiel-Toggle ----
function toggleSoapBeispiel(feld) {
  const box = document.getElementById('soap-beispiel-' + feld);
  if (!box) return;
  if (box.style.display !== 'none') {
    box.style.display = 'none';
    return;
  }
  const data = SOAP_BEISPIELE[feld];
  if (!data) return;
  box.innerHTML = '<div style="font-size:11px;padding:10px 12px;background:#F0F7FF;border-radius:8px;border-left:3px solid #3B82F6;margin-bottom:6px;line-height:1.6;">'
    + '<div style="font-weight:600;color:#3B82F6;margin-bottom:4px;">' + data.label + '</div>'
    + '<div style="color:#6B7280;margin-bottom:6px;font-style:italic;">' + data.erklaerung + '</div>'
    + '<div style="color:#374151;background:#fff;padding:8px;border-radius:6px;border:1px dashed #D1D5DB;white-space:pre-line;">' + data.beispiel + '</div>'
    + '</div>';
  box.style.display = 'block';
}

// ---- Tool-Legitimation (Fachliche Grundlage anzeigen) ----
function showToolLegitimation(toolKey) {
  const data = TOOL_LEGITIMATION[toolKey];
  if (!data) return;
  // Check if already open
  const existing = document.getElementById('tool-legit-overlay');
  if (existing) { existing.remove(); return; }
  const overlay = document.createElement('div');
  overlay.id = 'tool-legit-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
  overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:14px;max-width:520px;width:100%;padding:24px;box-shadow:0 8px 32px rgba(0,0,0,0.2);max-height:85vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div style="font-size:18px;font-weight:700;color:#1F2937;">📚 ${data.name}</div>
        <button onclick="document.getElementById('tool-legit-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#9CA3AF;">✕</button>
      </div>
      <div style="background:#F0F9FF;border-radius:10px;padding:14px;margin-bottom:12px;border-left:4px solid #3B82F6;">
        <div style="font-weight:600;color:#1E40AF;font-size:13px;margin-bottom:6px;">Was ist das?</div>
        <div style="font-size:13px;color:#374151;line-height:1.6;">${data.was}</div>
      </div>
      <div style="background:#F0FDF4;border-radius:10px;padding:14px;margin-bottom:12px;border-left:4px solid #22C55E;">
        <div style="font-weight:600;color:#166534;font-size:13px;margin-bottom:6px;">Warum dieses Tool?</div>
        <div style="font-size:13px;color:#374151;line-height:1.6;">${data.warum}</div>
      </div>
      <div style="background:#FFF7ED;border-radius:10px;padding:14px;margin-bottom:12px;border-left:4px solid #F97316;">
        <div style="font-weight:600;color:#9A3412;font-size:13px;margin-bottom:6px;">Evidenz</div>
        <div style="font-size:13px;color:#374151;line-height:1.6;">${data.evidenz}</div>
      </div>
      <div style="background:#F5F3FF;border-radius:10px;padding:14px;border-left:4px solid #8B5CF6;">
        <div style="font-weight:600;color:#6D28D9;font-size:13px;margin-bottom:6px;">Quelle</div>
        <div style="font-size:12px;color:#6B7280;line-height:1.5;font-style:italic;">${data.quelle}</div>
        <div style="font-size:12px;color:#9CA3AF;margin-top:4px;">Entwickelt von: ${data.entwickler}</div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

// ---- 5P Hilfe-Toggle ----
function toggle5PHilfe(key) {
  const box = document.getElementById('fivep-hilfe-' + key);
  if (!box) return;
  if (box.style.display !== 'none') {
    box.style.display = 'none';
    return;
  }
  const h = FIVEP_HILFE[key];
  if (!h) return;
  box.innerHTML = '<div style="font-size:12px;padding:12px 14px;background:#F9FAFB;border-radius:10px;margin:0 8px 8px;line-height:1.7;">'
    + '<div style="color:#374151;margin-bottom:8px;font-size:13px;">' + h.erklaerung + '</div>'
    + (h.zweck ? '<div style="background:#EFF6FF;border-radius:6px;padding:8px 10px;margin-bottom:8px;color:#1E40AF;font-size:12px;"><strong>Zweck:</strong> ' + h.zweck + '</div>' : '')
    + (h.abgrenzung ? '<div style="color:#D97706;font-weight:600;margin-bottom:8px;font-size:12px;">' + h.abgrenzung + '</div>' : '')
    + (h.vorgehen ? '<div style="background:#F0FDF4;border-radius:6px;padding:8px 10px;margin-bottom:8px;color:#166534;font-size:12px;white-space:pre-line;">' + h.vorgehen + '</div>' : '')
    + '<div style="margin-bottom:4px;font-weight:600;color:#6B7280;">Beispiele:</div>'
    + '<ul style="margin:0;padding-left:16px;color:#374151;">' + h.beispiele.map(b => '<li>' + b + '</li>').join('') + '</ul>'
    + (h.tipp ? '<div style="margin-top:8px;color:#3B82F6;">' + h.tipp + '</div>' : '')
    + '</div>';
  box.style.display = 'block';
}

function selectProtStimmung(btn) {
  document.querySelectorAll('.prot-stimmung-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  APP.protStimmung = btn.dataset.val;
}

// ---- Polyvagal Check-in ----
function selectPVT(btn) {
  document.querySelectorAll('.pvt-card').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  APP.protPVT = btn.dataset.val;

  const empf = document.getElementById('pvt-empfehlung');
  const map = {
    safe: { farbe: '#059669', bg: '#F0FDF4', border: '#BBF7D0',
      text: '✅ <strong>Tiefenarbeit möglich.</strong> Starte mit dem geplanten Thema. Der Jugendliche ist reguliert und kontaktfähig.' },
    activated: { farbe: '#D97706', bg: '#FFFBEB', border: '#FDE68A',
      text: '⚠️ <strong>Erst regulieren.</strong> Starte mit Atemübungen oder Körperübungen. Kein neues Material heute — Stabilisierung hat Vorrang.' },
    frozen: { farbe: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
      text: '🟣 <strong>Nur Grounding heute.</strong> 5-4-3-2-1 Übung, sanfte Bewegung, warmes Getränk. Die Allianz halten ist das Ziel dieser Sitzung.' },
  };
  const m = map[APP.protPVT];
  empf.style.display = 'block';
  empf.style.background = m.bg;
  empf.style.borderColor = m.border;
  empf.style.color = m.farbe;
  empf.innerHTML = m.text;
}

// ---- SRS Session Rating Scale ----
function updateSRS() {
  const ids = ['relationship', 'goals', 'approach', 'overall'];
  let total = 0;
  ids.forEach(id => {
    const val = parseInt(document.getElementById(`srs-${id}`).value);
    document.getElementById(`srs-val-${id}`).textContent = val;
    total += val;
  });
  document.getElementById('srs-total-zahl').textContent = total;
  const alert = document.getElementById('srs-alert');
  if (alert) alert.style.display = total < 25 ? 'block' : 'none';
}

function populateProtThemen() {
  const sel = document.getElementById('prot-thema-id');
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '<option value="">— Kein Thema verknüpft —</option>' +
    THEMEN_KATEGORIEN.map(kat =>
      `<optgroup label="${renderIcon(kat.icon)} ${kat.titel}">
        ${kat.themen.map(t => `<option value="${t.id}">${t.titel}</option>`).join('')}
      </optgroup>`
    ).join('');
  sel.value = current;
}

function addNotiz() {
  const textarea = document.getElementById('neue-notiz-text');
  const kategorie = document.getElementById('neue-notiz-kategorie').value;
  const datum = document.getElementById('neue-notiz-datum').value;
  const text = textarea.value.trim();
  if (!text) return;

  DB.createNotiz({
    schuelerId: APP.currentSchuelerId,
    datum: datum || new Date().toISOString().split('T')[0],
    inhalt: text,
    kategorie,
  });

  textarea.value = '';
  renderNotizen();
  showToast('Notiz gespeichert', 'success');
}

function deleteNotiz(id) {
  if (!confirm('Notiz wirklich löschen?')) return;
  DB.deleteNotiz(id);
  renderNotizen();
  showToast('Notiz gelöscht');
}

// ============================================================
// ZIELE TAB
// ============================================================
function renderZiele() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  const liste = document.getElementById('ziele-liste');

  if (ziele.length === 0) {
    liste.innerHTML = '<div style="text-align:center;padding:24px 16px;">'
      + '<div style="font-size:28px;margin-bottom:8px;">🎯</div>'
      + '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Noch keine Ziele definiert</div>'
      + '<div style="font-size:12px;color:var(--text-muted,#6B7280);margin-bottom:14px;line-height:1.5;">Ziele machen Fortschritte sichtbar und geben dem Jugendlichen Orientierung.<br>Formuliere Ziele nach der SMART-Methode: Spezifisch, Messbar, Erreichbar, Relevant, Zeitgebunden.</div>'
      + '<div style="display:flex;flex-wrap:wrap;gap:6px;justify-content:center;">'
      + SMART_BEISPIELE.map(b => '<button class="btn btn-outline btn-sm" style="font-size:11px;" onclick="quickAddZiel(\'' + b.replace(/'/g, "\\'") + '\')">' + b + '</button>').join('')
      + '</div>'
      + '</div>';
    return;
  }

  // Gesamt-Fortschritt
  const avgFortschritt = Math.round(ziele.reduce((sum, z) => sum + (z.fortschritt || (z.erledigt ? 100 : 0)), 0) / ziele.length);
  const avgColor = avgFortschritt >= 70 ? '#22C55E' : (avgFortschritt >= 30 ? '#F59E0B' : '#EF4444');

  liste.innerHTML = `
    <div class="ziel-gesamt-fortschritt" style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
        <span style="font-size:12px;font-weight:600;color:var(--text-secondary);">Gesamt-Fortschritt</span>
        <span style="font-size:14px;font-weight:700;color:${avgColor};">${avgFortschritt}%</span>
      </div>
      <div style="height:6px;background:#E5E7EB;border-radius:3px;overflow:hidden;">
        <div style="height:100%;width:${avgFortschritt}%;background:${avgColor};border-radius:3px;transition:width 0.3s ease;"></div>
      </div>
    </div>
    ${ziele.map((z, i) => {
      const pct = z.fortschritt || (z.erledigt ? 100 : 0);
      const farbe = pct >= 70 ? '#22C55E' : (pct >= 30 ? '#F59E0B' : '#EF4444');
      return `
        <div class="ziel-item-enhanced">
          <div class="ziel-item-header">
            <input type="checkbox" class="ziel-checkbox" ${pct >= 100 ? 'checked' : ''}
              onchange="toggleZiel(${i})">
            <span class="ziel-text ${pct >= 100 ? 'erledigt' : ''}">${escapeHtml(z.text)}</span>
            <span class="ziel-pct" style="color:${farbe};">${pct}%</span>
            <button class="btn-icon btn-sm" style="font-size:12px;" onclick="deleteZiel(${i})">🗑</button>
          </div>
          <div class="ziel-slider-row">
            <input type="range" min="0" max="100" step="5" value="${pct}"
              class="ziel-slider" style="--ziel-farbe:${farbe};"
              oninput="updateZielFortschritt(${i}, this.value)">
          </div>
        </div>`;
    }).join('')}
  `;
}

function renderScreeningZielVorschlaege() {
  const container = document.getElementById('screening-ziel-vorschlaege');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const screenings = DB.getScreenings(sid).filter(s => s.abgeschlossen);
  if (screenings.length === 0) { container.innerHTML = ''; return; }
  const latest = screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
  const s = DB.getSchuelerById(sid);
  const name = s ? s.name : '[Name]';

  const vorschlaege = [];
  for (const domId in latest.scores) {
    const dom = SCREENING_DOMAINS.find(d => d.id === domId);
    if (dom && !dom.invertiert && latest.scores[domId] >= dom.cutoff && SMART_SCREENING_VORSCHLAEGE[domId]) {
      SMART_SCREENING_VORSCHLAEGE[domId].forEach(v => {
        vorschlaege.push({ domain: dom, text: v.replace('[Name]', name) });
      });
    }
  }
  if (vorschlaege.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = '<div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:10px;padding:12px;margin-bottom:12px;">'
    + '<div style="font-size:12px;font-weight:600;color:#0369A1;margin-bottom:8px;">💡 Zielvorschläge aus Screening-Ergebnissen</div>'
    + '<div style="display:flex;flex-direction:column;gap:4px;">'
    + vorschlaege.map(v =>
      '<button class="btn btn-outline btn-sm" style="font-size:11px;text-align:left;white-space:normal;line-height:1.4;padding:6px 10px;border-color:' + v.domain.farbe + '40;" onclick="quickAddZiel(\'' + v.text.replace(/'/g, "\\'") + '\')">'
      + '<span style="color:' + v.domain.farbe + ';font-weight:600;">' + v.domain.icon + ' ' + v.domain.label + ':</span> '
      + v.text + '</button>'
    ).join('')
    + '</div></div>';
}

function quickAddZiel(text) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele.push({ text, erledigt: false, fortschritt: 0, erstellt: new Date().toISOString() });
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
  showToast('Ziel hinzugefügt', 'success');
}

function addZiel() {
  const input = document.getElementById('neues-ziel-input');
  const text = input.value.trim();
  if (!text) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele.push({ text, erledigt: false, fortschritt: 0, erstellt: new Date().toISOString() });
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  input.value = '';
  renderZiele();
}

function updateZielFortschritt(index, value) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  const pct = parseInt(value, 10);
  ziele[index].fortschritt = pct;
  ziele[index].erledigt = pct >= 100;
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
}

function toggleZiel(index) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  const wasErledigt = ziele[index].erledigt;
  ziele[index].erledigt = !wasErledigt;
  ziele[index].fortschritt = wasErledigt ? 0 : 100;
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
}

function deleteZiel(index) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele.splice(index, 1);
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
}

// ============================================================
// INFO TAB — Strukturierte Anamnese
// ============================================================
function renderInfo() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const anamnese = s.anamnese || [];

  const container = document.getElementById('anamnese-container');
  container.innerHTML = ANAMNESE_KATEGORIEN.map(kat => {
    if (kat.felder) {
      // Neue felder-basierte Kategorie
      return renderAnamneseFelder(kat, anamnese);
    } else if (kat.items) {
      // Alte multi-select Chips
      return renderAnamneseChips(kat, anamnese);
    }
    return '';
  }).join('');

  renderAnamneseZusammenfassung(s);

  const hypothesen = generateHypothesen(APP.currentSchuelerId);
  renderHypothesen(hypothesen);
  renderTreatmentResponse(APP.currentSchuelerId);
  renderHypothesenZeitstrahl(APP.currentSchuelerId);
  renderScreeningVerlauf(APP.currentSchuelerId);

  const notizEl = document.getElementById('info-allgemein');
  if (notizEl) notizEl.value = s.allgemeineNotizen || '';
}

function renderAnamneseChips(kat, anamnese) {
  const activeCount = kat.items.filter(it => anamnese.includes(it.id)).length;
  return `
    <div class="anamnese-kategorie">
      <div class="anamnese-kategorie-header" style="border-left:4px solid ${kat.farbe}">
        <span>${kat.icon} ${kat.label}</span>
        <span class="anamnese-count">${activeCount > 0 ? activeCount + ' ausgewählt' : ''}</span>
      </div>
      <div class="anamnese-chips">
        ${kat.items.map(item => `
          <div class="anamnese-chip ${anamnese.includes(item.id) ? 'active' : ''}"
               style="--chip-color:${kat.farbe}"
               onclick="toggleAnamneseItem('${item.id}')"
               title="${item.evidenz}">
            ${item.label}
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderAnamneseFelder(kat, anamnese) {
  const felderHtml = kat.felder.map(feld => {
    const isMulti = feld.typ === 'multi';
    return `
      <div class="anamnese-feld">
        <div class="anamnese-feld-label">${feld.label}${!isMulti ? ' <span class="anamnese-feld-hint">(eines wählen)</span>' : ''}</div>
        <div class="anamnese-chips">
          ${feld.optionen.map(opt => `
            <div class="anamnese-chip ${anamnese.includes(opt.id) ? 'active' : ''}"
                 style="--chip-color:${kat.farbe}"
                 onclick="toggleAnamneseItem('${opt.id}', '${feld.id}', '${feld.typ}')"
                 title="${opt.evidenz || ''}">
              ${opt.label}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="anamnese-kategorie">
      <div class="anamnese-kategorie-header" style="border-left:4px solid ${kat.farbe}">
        <span>${kat.icon} ${kat.label}</span>
      </div>
      ${felderHtml}
    </div>
  `;
}

function toggleAnamneseItem(itemId, feldId, feldTyp) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const anamnese = s.anamnese || [];

  if (feldTyp === 'single' && feldId) {
    // Single-select: entferne alle anderen Optionen desselben Felds
    const feld = findFeld(feldId);
    if (feld) {
      const feldOptionIds = feld.optionen.map(o => o.id);
      // Entferne alle Optionen dieses Felds
      for (let i = anamnese.length - 1; i >= 0; i--) {
        if (feldOptionIds.includes(anamnese[i])) {
          anamnese.splice(i, 1);
        }
      }
    }
    // Wenn das Item nicht schon ausgewählt war, hinzufügen (sonst: deselect)
    if (!s.anamnese || !s.anamnese.includes(itemId)) {
      anamnese.push(itemId);
    }
  } else {
    // Multi-select: toggle
    const idx = anamnese.indexOf(itemId);
    if (idx === -1) {
      anamnese.push(itemId);
    } else {
      anamnese.splice(idx, 1);
    }
  }

  DB.updateSchueler(APP.currentSchuelerId, { anamnese });
  renderInfo();
}

function findFeld(feldId) {
  for (const kat of ANAMNESE_KATEGORIEN) {
    if (kat.felder) {
      const feld = kat.felder.find(f => f.id === feldId);
      if (feld) return feld;
    }
  }
  return null;
}

function renderAnamneseZusammenfassung(s) {
  const anamnese = s.anamnese || [];
  const el = document.getElementById('anamnese-zusammenfassung');
  if (!el) return;

  if (anamnese.length === 0) {
    el.innerHTML = `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-body" style="text-align:center;color:var(--text-muted);padding:24px;">
          <div style="font-size:32px;margin-bottom:8px;">📋</div>
          <div>Wähle unten relevante Anamnese-Punkte aus, um eine Risiko-Zusammenfassung zu erhalten.</div>
        </div>
      </div>`;
    return;
  }

  // Alle Items/Optionen flach sammeln (beide Formate)
  const alleItems = ANAMNESE_KATEGORIEN.flatMap(k => {
    if (k.items) return k.items;
    if (k.felder) return k.felder.flatMap(f => f.optionen);
    return [];
  });
  const aktiveItems = alleItems.filter(it => anamnese.includes(it.id));

  // ACE-Score (nur ACE-Kategorie)
  const aceKat = ANAMNESE_KATEGORIEN.find(k => k.id === 'ace');
  const aceItems = aceKat ? (aceKat.items || []).filter(it => anamnese.includes(it.id)) : [];
  const aceScore = aceItems.length;

  // Risikofaktoren (gewicht > 0) und Schutzfaktoren (gewicht < 0)
  const risiken = aktiveItems.filter(it => it.gewicht > 0).sort((a, b) => b.gewicht - a.gewicht);
  const schutz = aktiveItems.filter(it => it.gewicht < 0);
  const risikoScore = aktiveItems.reduce((sum, it) => sum + it.gewicht, 0);

  // Ampel-Farbe
  let ampel, ampelLabel;
  if (risikoScore >= 8) { ampel = '#DC2626'; ampelLabel = 'Hoch'; }
  else if (risikoScore >= 4) { ampel = '#F59E0B'; ampelLabel = 'Mittel'; }
  else if (risikoScore > 0) { ampel = '#6B7280'; ampelLabel = 'Niedrig'; }
  else { ampel = '#22C55E'; ampelLabel = 'Geschützt'; }

  // ACE-Warnung
  let aceWarnung = '';
  if (aceScore >= 4) {
    aceWarnung = `<div class="anamnese-ace-warnung">
      ⚠️ <strong>ACE-Score ${aceScore}/10</strong> — Felitti et al. (1998): Ab 4 ACEs steigt das Risiko für Herzerkrankungen um 200%, Suizidversuche um 1200%, Substanzabhängigkeit um 500%.
    </div>`;
  } else if (aceScore >= 1) {
    aceWarnung = `<div class="anamnese-ace-info">
      ℹ️ <strong>ACE-Score ${aceScore}/10</strong> — Jede zusätzliche belastende Kindheitserfahrung erhöht kumulativ das Risiko für psychische und physische Erkrankungen (Felitti et al. 1998).
    </div>`;
  }

  el.innerHTML = `
    <div class="card anamnese-summary-card" style="margin-bottom:16px;">
      <div class="card-header">
        <span>🧠</span>
        <div class="card-title">Anamnese-Zusammenfassung</div>
        <div class="anamnese-ampel" style="background:${ampel}">${ampelLabel}</div>
      </div>
      <div class="card-body">
        ${aceWarnung}
        <div class="anamnese-summary-grid">
          <div class="anamnese-summary-stat">
            <div class="anamnese-summary-number" style="color:${ampel}">${risiken.length}</div>
            <div class="anamnese-summary-label">Risikofaktoren</div>
          </div>
          <div class="anamnese-summary-stat">
            <div class="anamnese-summary-number" style="color:#22C55E">${schutz.length}</div>
            <div class="anamnese-summary-label">Schutzfaktoren</div>
          </div>
          <div class="anamnese-summary-stat">
            <div class="anamnese-summary-number" style="color:#DC2626">${aceScore}</div>
            <div class="anamnese-summary-label">ACE-Score</div>
          </div>
        </div>
        ${risiken.length > 0 ? `
          <div class="anamnese-top-risiken">
            <strong>Top-Risikofaktoren:</strong>
            ${risiken.slice(0, 5).map(r => `
              <div class="anamnese-risiko-item">
                <span class="anamnese-risiko-dot" style="background:${r.gewicht >= 3 ? '#DC2626' : r.gewicht >= 2 ? '#F59E0B' : '#6B7280'}"></span>
                <span>${r.label}</span>
                <span class="anamnese-risiko-evidenz" title="${r.evidenz}">📖</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
        ${schutz.length > 0 ? `
          <div class="anamnese-schutz-liste">
            <strong>Schutzfaktoren:</strong>
            ${schutz.map(s => `<span class="anamnese-schutz-tag">🛡️ ${s.label}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>`;
}

function saveInfo() {
  DB.updateSchueler(APP.currentSchuelerId, {
    allgemeineNotizen: document.getElementById('info-allgemein').value,
  });
  showToast('Notizen gespeichert', 'success');
}

// ============================================================
// HYPOTHESEN-ENGINE
// ============================================================
function generateHypothesen(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!s) return [];

  // Neuestes Screening holen
  const screenings = DB.getScreenings(schuelerId);
  const latestScreening = screenings.length
    ? screenings.sort((a, b) => b.erstellt.localeCompare(a.erstellt))[0]
    : { scores: {}, flaggedAreas: [] };

  // 5P-Formulierung holen
  const ff = DB.getFallformulierung(schuelerId);
  const fiveP = ff || { presenting: [], predisposing: [], precipitating: [], perpetuating: [], protective: [] };

  // Kontext-Objekt für alle Regeln
  const ctx = {
    anamnese: s.anamnese || [],
    screening: {
      scores: latestScreening.scores || {},
      flaggedAreas: latestScreening.flaggedAreas || [],
    },
    staerken: s.staerkenProfil || {},
    fiveP: fiveP,
    verhalten: s.topicStatus || {},
    // NEU: Wohlbefinden-Verlauf
    wohlbefinden: (() => {
      const wb = DB.getWohlbefinden ? DB.getWohlbefinden(schuelerId) : [];
      if (!wb || wb.length === 0) return { aktuell: null, trend: null, werte: [] };
      const sortiert = [...wb].sort((a, b) => a.datum.localeCompare(b.datum));
      const letzter = sortiert[sortiert.length - 1];
      let trend = null;
      if (sortiert.length >= 3) {
        const mitte = Math.floor(sortiert.length / 2);
        const erste = sortiert.slice(0, mitte).reduce((a, w) => a + (w.wert || 0), 0) / mitte;
        const zweite = sortiert.slice(mitte).reduce((a, w) => a + (w.wert || 0), 0) / (sortiert.length - mitte);
        trend = zweite - erste > 0.5 ? 'steigend' : zweite - erste < -0.5 ? 'fallend' : 'stabil';
      }
      return { aktuell: letzter?.wert || null, trend, werte: sortiert.map(w => w.wert) };
    })(),
    // NEU: SRS-Trend
    srsTrend: (() => {
      const notizen = DB.getNotizen(schuelerId).filter(n => n.soap?.srs?.total != null);
      if (notizen.length < 2) return null;
      notizen.sort((a, b) => a.datum.localeCompare(b.datum));
      const werte = notizen.map(n => n.soap.srs.total);
      const mitte = Math.floor(werte.length / 2);
      const erste = werte.slice(0, mitte).reduce((a, b) => a + b, 0) / mitte;
      const zweite = werte.slice(mitte).reduce((a, b) => a + b, 0) / (werte.length - mitte);
      const letzter = werte[werte.length - 1];
      return { letzterWert: letzter, trend: zweite - erste > 2 ? 'steigend' : zweite - erste < -2 ? 'fallend' : 'stabil', anzahl: werte.length };
    })(),
  };

  // Alle Regeln evaluieren
  const aktive = [];
  for (const regel of HYPOTHESEN_REGELN) {
    try {
      if (regel.bedingung(ctx)) {
        aktive.push({
          ...regel,
          _ausloesendeDaten: typeof regel.ausloesendeDaten === 'function' ? regel.ausloesendeDaten(ctx) : [],
        });
      }
    } catch (e) {
      // Regel-Fehler still ignorieren
    }
  }

  // ── Dynamische Stärke: Verlauf über Zeit ──────────────────
  const verlauf = s.hypothesenVerlauf || [];
  const jetzt = new Date().toISOString();
  const heuteKey = jetzt.split('T')[0]; // YYYY-MM-DD

  // Aktuellen Snapshot speichern (max 1x pro Tag)
  const heuteSchonGespeichert = verlauf.some(v => v.datum.startsWith(heuteKey));
  if (!heuteSchonGespeichert && aktive.length > 0) {
    verlauf.push({
      datum: jetzt,
      hypothesenIds: aktive.map(h => h.id),
      datenPunkte: aktive.reduce((acc, h) => {
        acc[h.id] = (h._ausloesendeDaten || []).length;
        return acc;
      }, {}),
    });
    // Max 50 Einträge behalten
    while (verlauf.length > 50) verlauf.shift();
    DB.updateSchueler(s.id, { hypothesenVerlauf: verlauf });
  }

  // Dynamische Hochstufung: Hypothese über mehrere Zeitpunkte bestätigt
  for (const h of aktive) {
    const auftritte = verlauf.filter(v => v.hypothesenIds.includes(h.id));
    const anzahlAuftritte = auftritte.length;
    const aktDatenPunkte = (h._ausloesendeDaten || []).length;

    // Prüfe ob Datenpunkte gewachsen sind seit erstem Auftreten
    let datenGewachsen = false;
    if (auftritte.length > 0) {
      const ersteDaten = auftritte[0].datenPunkte?.[h.id] || 0;
      datenGewachsen = aktDatenPunkte > ersteDaten;
    }

    // Hochstufung: mind. 3 Zeitpunkte ODER Datenpunkte gewachsen + mind. 2 Zeitpunkte
    if ((anzahlAuftritte >= 3 || (datenGewachsen && anzahlAuftritte >= 2)) && h.staerkeWert < 4) {
      h._dynamischHochgestuft = true;
      h._originalStaerke = h.staerke;
      h._originalStaerkeWert = h.staerkeWert;
      h._auftritte = anzahlAuftritte;
      h.staerkeWert = Math.min(h.staerkeWert + 1, 4);
      h.staerke = h.staerkeWert >= 4 ? 'sehr-wahrscheinlich'
        : h.staerkeWert >= 2 ? 'wahrscheinlich' : 'hinweis';
    }

    // Verlaufsdaten für UI anhängen
    h._verlaufAnzahl = anzahlAuftritte;
    h._erstesAuftreten = auftritte.length > 0 ? auftritte[0].datum : null;
  }

  // ── Konfidenz-Score berechnen (0-100%) ──────────────────────
  for (const h of aktive) {
    let konfidenz = 0;

    // Basis: Stärke (20-40 Punkte)
    konfidenz += Math.min(h.staerkeWert * 10, 40);

    // Datenpunkte: je mehr auslösende Daten, desto höher (max 20)
    const dp = (h._ausloesendeDaten || []).length;
    konfidenz += Math.min(dp * 5, 20);

    // Verlauf: Bestätigungen über Zeit (max 20)
    konfidenz += Math.min((h._verlaufAnzahl || 0) * 5, 20);

    // Screening-Übereinstimmung: wenn Screening-Daten involviert (10)
    const hatScreeningDaten = (h._ausloesendeDaten || []).some(d => d.includes('Screening:'));
    if (hatScreeningDaten) konfidenz += 10;

    // Dynamisch hochgestuft: +10
    if (h._dynamischHochgestuft) konfidenz += 10;

    h._konfidenz = Math.min(konfidenz, 100);
  }

  // ── Treatment-Response-Konfidenz-Boost ──────────────────────
  try {
    const trAnalyse = analyzeTreatmentResponse(schuelerId);
    if (trAnalyse && trAnalyse.themen && typeof HYPOTHESEN_THEMA_MAP !== 'undefined') {
      aktive.forEach(hypo => {
        if (!hypo.wiki_ids) return;
        const hypoThemen = [];
        hypo.wiki_ids.forEach(wid => {
          (HYPOTHESEN_THEMA_MAP[wid] || []).forEach(tid => { if (!hypoThemen.includes(tid)) hypoThemen.push(tid); });
        });
        const relevantTR = trAnalyse.themen.filter(t => hypoThemen.includes(t.themaId) && t.anzahl >= 2);
        if (relevantTR.length === 0) return;
        const avgResponse = relevantTR.reduce((sum, t) => sum + t.responseRate, 0) / relevantTR.length;
        if (avgResponse >= 60) {
          hypo._konfidenz = Math.min(100, hypo._konfidenz + 10);
          hypo._trBestaetigt = true;
          hypo._trHinweis = 'Gute Response (' + Math.round(avgResponse) + '%) bei zugehörigen Themen';
        } else if (avgResponse < 40 && relevantTR.some(t => t.anzahl >= 3)) {
          hypo._trHinterfragen = true;
          hypo._trHinweis = 'Niedrige Response (' + Math.round(avgResponse) + '%) — Hypothese überprüfen';
        }
      });
    }
  } catch(e) { /* silent */ }

  // Sortieren: staerkeWert desc, dann risiko vor schutz vor differenzial
  const typRang = { risiko: 0, differenzial: 1, schutz: 2 };
  aktive.sort((a, b) => b.staerkeWert - a.staerkeWert || (typRang[a.typ] || 0) - (typRang[b.typ] || 0));

  return aktive;
}

function renderHypothesen(hypothesen) {
  const el = document.getElementById('hypothesen-container');
  if (!el) return;

  if (hypothesen.length === 0) {
    el.innerHTML = '';
    return;
  }

  // ── Hypothesen-Diff: Was hat sich verändert? ──
  let diffHtml = '';
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (s) {
    const verlauf = s.hypothesenVerlauf || [];
    if (verlauf.length >= 2) {
      const vorletzter = verlauf[verlauf.length - 2];
      const aktuelleIds = hypothesen.map(h => h.id);
      const vorherigeIds = vorletzter.hypothesenIds || [];

      const neueIds = aktuelleIds.filter(id => !vorherigeIds.includes(id));
      const verschwundenIds = vorherigeIds.filter(id => !aktuelleIds.includes(id));
      const hochgestuft = hypothesen.filter(h => h._dynamischHochgestuft);

      if (neueIds.length > 0 || verschwundenIds.length > 0 || hochgestuft.length > 0) {
        const regelMap = {};
        for (const r of HYPOTHESEN_REGELN) regelMap[r.id] = r.titel;

        diffHtml = `
          <div class="hypothesen-diff">
            <div class="hypothesen-diff-header">🔄 Veränderungen seit letzter Auswertung</div>
            ${neueIds.length > 0 ? `<div class="hypothesen-diff-section diff-neu">
              ${neueIds.map(id => `<span class="diff-chip diff-chip-neu">+ ${regelMap[id] || id}</span>`).join('')}
            </div>` : ''}
            ${verschwundenIds.length > 0 ? `<div class="hypothesen-diff-section diff-weg">
              ${verschwundenIds.map(id => `<span class="diff-chip diff-chip-weg">- ${regelMap[id] || id}</span>`).join('')}
            </div>` : ''}
            ${hochgestuft.length > 0 ? `<div class="hypothesen-diff-section diff-hoch">
              ${hochgestuft.map(h => `<span class="diff-chip diff-chip-hoch">📈 ${h.titel} (${h._originalStaerke} → ${h.staerke})</span>`).join('')}
            </div>` : ''}
          </div>
        `;
      }
    }
  }

  // Ebenen-Konfiguration
  const EBENEN = [
    { id: 'einzelfaktor', label: 'Einzelfaktor', icon: '🔹', beschreibung: 'Einzelne Anamnese-Daten lösen aus' },
    { id: 'kombination', label: 'Kombinationen', icon: '🔗', beschreibung: 'Mehrere Anamnese-Faktoren kombiniert' },
    { id: 'dynamisch', label: 'Dynamisch', icon: '⚡', beschreibung: 'Anamnese + Screening kreuzreferenziert' },
    { id: 'schutz', label: 'Schutzfaktoren', icon: '🛡️', beschreibung: 'Protektive Gegenhypothesen' },
    { id: 'differenzial', label: 'Differenzial', icon: '🔀', beschreibung: 'Differenzialdiagnostische Abgrenzung' },
  ];

  function hypotheseCard(h) {
    let borderColor, badgeBg, badgeText;
    const isEskalation = h.staerkeWert >= 5;
    if (h.typ === 'schutz') {
      borderColor = '#22C55E'; badgeBg = '#F0FDF4'; badgeText = '#166534';
    } else if (h.typ === 'differenzial') {
      borderColor = '#8B5CF6'; badgeBg = '#F5F3FF'; badgeText = '#5B21B6';
    } else if (isEskalation) {
      borderColor = '#991B1B'; badgeBg = '#991B1B'; badgeText = '#FFFFFF';
    } else if (h.staerkeWert >= 3) {
      borderColor = '#EF4444'; badgeBg = '#FEF2F2'; badgeText = '#991B1B';
    } else if (h.staerkeWert >= 2) {
      borderColor = '#F59E0B'; badgeBg = '#FFFBEB'; badgeText = '#92400E';
    } else {
      borderColor = '#9CA3AF'; badgeBg = '#F3F4F6'; badgeText = '#374151';
    }

    const staerkeLabel = isEskalation ? '🚨 ESKALATION'
      : h.staerke === 'sehr-wahrscheinlich' ? 'Sehr wahrscheinlich'
      : h.staerke === 'wahrscheinlich' ? 'Wahrscheinlich' : 'Hinweis';

    const typIcon = isEskalation ? '🚨' : h.typ === 'schutz' ? '🛡️' : h.typ === 'differenzial' ? '🔀' : '⚠️';

    const daten = h._ausloesendeDaten || [];

    // Dynamische Verlaufs-Info
    let verlaufHtml = '';
    if (h._dynamischHochgestuft) {
      const originalLabel = h._originalStaerke === 'sehr-wahrscheinlich' ? 'Sehr wahrsch.'
        : h._originalStaerke === 'wahrscheinlich' ? 'Wahrsch.' : 'Hinweis';
      verlaufHtml = `<span class="hypothese-hochgestuft" title="Dynamisch hochgestuft: ${h._auftritte} Bestätigungen über Zeit">📈 ${originalLabel} → ${staerkeLabel}</span>`;
    } else if (h._verlaufAnzahl > 1) {
      const seit = h._erstesAuftreten ? new Date(h._erstesAuftreten).toLocaleDateString('de-CH') : '';
      verlaufHtml = `<span class="hypothese-verlauf-info" title="Seit ${seit} in ${h._verlaufAnzahl} Auswertungen bestätigt">🔄 ${h._verlaufAnzahl}x bestätigt</span>`;
    }

    // Treatment-Response Badge
    let trBadgeHtml = '';
    if (h._trBestaetigt) {
      trBadgeHtml = `<span style="background:#F0FDF4;color:#166534;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;margin-left:4px;" title="${h._trHinweis || ''}">✅ Durch Verlauf bestätigt</span>`;
    } else if (h._trHinterfragen) {
      trBadgeHtml = `<span style="background:#FFFBEB;color:#92400E;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;margin-left:4px;" title="${h._trHinweis || ''}">🔄 Response niedrig — überprüfen</span>`;
    }

    return `
      <div class="hypothese-card ${isEskalation ? 'hypothese-eskalation' : ''}" data-ebene="${h.ebene || ''}" data-staerke="${h.staerkeWert}" data-typ="${h.typ}" style="border-left:4px solid ${borderColor}">
        <div class="hypothese-header">
          <span class="hypothese-titel">${typIcon} ${h.titel}</span>
          ${verlaufHtml}
          ${trBadgeHtml}
          ${h._konfidenz != null ? `<span class="hypothese-konfidenz" title="Konfidenz: ${h._konfidenz}% — basierend auf Datenpunkten, Verlauf und Screening">${h._konfidenz}%</span>` : ''}
          <span class="hypothese-badge" style="background:${badgeBg};color:${badgeText}">${staerkeLabel}</span>
        </div>
        ${daten.length > 0 ? `<div class="hypothese-daten">Basierend auf: ${daten.join(' · ')}</div>` : ''}
        <details class="hypothese-details">
          <summary>Erklärung & Evidenz</summary>
          <div class="hypothese-details-body">
            <p>${h.erklaerung}</p>
            <p class="hypothese-evidenz">${h.evidenz}</p>
            <p class="hypothese-quelle">📚 ${h.quelle}</p>
            ${h.gegenHypothese ? `<p class="hypothese-gegen"><strong>Gegenhypothese:</strong> ${h.gegenHypothese}</p>` : ''}
            ${h.empfehlung ? `<p class="hypothese-empfehlung"><strong>→ Empfehlung:</strong> ${h.empfehlung}</p>` : ''}
          </div>
        </details>
        ${h.wiki_ids && h.wiki_ids.length > 0 ? `
          <div class="hypothese-wissen" style="margin-top:8px;padding:8px 10px;background:#F8FAFC;border-radius:8px;border:1px solid #E2E8F0;">
            <div style="font-size:10px;font-weight:600;color:#64748B;margin-bottom:6px;">📚 Nachschlagen & Vertiefen</div>
            <div style="display:flex;flex-wrap:wrap;gap:4px;">
              ${h.wiki_ids.map(wId => {
                const wiki = typeof WIKI_ARTIKEL !== 'undefined' ? WIKI_ARTIKEL.find(a => a.id === wId) : null;
                if (!wiki) return '';
                const themenIds = wiki.themen_ids || [];
                const fkTid = themenIds.find(tid => typeof FACHKRAFT_MODULE_DATEIEN !== 'undefined' && FACHKRAFT_MODULE_DATEIEN[tid]);
                const fkDatei = fkTid ? FACHKRAFT_MODULE_DATEIEN[fkTid] : null;
                return '<span class="hypothese-wiki-chip" onclick="openWikiArtikel(\'' + wId + '\')" style="cursor:pointer;background:#EFF6FF;border:1px solid #BFDBFE;color:#1E40AF;padding:3px 8px;border-radius:8px;font-size:11px;display:inline-flex;align-items:center;gap:3px;">' + wiki.icon + ' ' + wiki.titel + '</span>'
                  + (fkDatei ? '<span onclick="window.open(\'fachkraft-module/' + fkDatei + '\',\'_blank\')" style="cursor:pointer;background:#F0FDF4;border:1px solid #BBF7D0;color:#166534;padding:3px 8px;border-radius:8px;font-size:10px;display:inline-flex;align-items:center;gap:2px;">🎓 Praxis</span>' : '');
              }).join('')}
              ${h.icd10 && h.icd10.length > 0 ? h.icd10.map(c => '<span style="background:#F3F4F6;color:#6B7280;padding:2px 6px;border-radius:6px;font-size:10px;font-family:monospace;">' + c + '</span>').join('') : ''}
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }

  // Gruppiert nach Ebene
  const gruppiertHtml = EBENEN.map(eb => {
    const items = hypothesen.filter(h => h.ebene === eb.id);
    if (items.length === 0) return '';
    return `
      <div class="hypothesen-ebene-gruppe">
        <div class="hypothesen-ebene-header">
          <span class="hypothesen-ebene-icon">${eb.icon}</span>
          <span class="hypothesen-ebene-titel">${eb.label}</span>
          <span class="hypothesen-ebene-count">${items.length}</span>
          <span class="hypothesen-ebene-desc">${eb.beschreibung}</span>
        </div>
        <div class="hypothesen-ebene-cards">
          ${items.map(hypotheseCard).join('')}
        </div>
      </div>
    `;
  }).join('');

  // Flat view (sortiert nach Stärke)
  const flatHtml = hypothesen.map(hypotheseCard).join('');

  // Zähler pro Ebene für Filterleiste
  const ebeneCounts = EBENEN.map(eb => {
    const count = hypothesen.filter(h => h.ebene === eb.id).length;
    return { ...eb, count };
  }).filter(eb => eb.count > 0);

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <span>🧠</span>
        <div class="card-title">Klinische Hypothesen</div>
        <span style="font-size:12px;color:var(--text-muted);margin-left:auto;">${hypothesen.length} aktiv</span>
      </div>
      <div class="card-body">
        <div class="hypothesen-controls">
          <div class="hypothesen-ansicht-toggle">
            <button class="hypothesen-ansicht-btn active" data-ansicht="ebenen" onclick="toggleHypothesenAnsicht('ebenen')">📊 Nach Ebenen</button>
            <button class="hypothesen-ansicht-btn" data-ansicht="flat" onclick="toggleHypothesenAnsicht('flat')">📋 Alle (nach Stärke)</button>
          </div>
          <div class="hypothesen-filter-bar">
            ${ebeneCounts.map(eb => `
              <button class="hypothesen-filter-chip active" data-filter-ebene="${eb.id}" onclick="toggleHypothesenFilter('${eb.id}')">
                ${eb.icon} ${eb.label} <span class="hypothesen-filter-count">${eb.count}</span>
              </button>
            `).join('')}
            <span class="hypothesen-filter-separator"></span>
            <button class="hypothesen-sort-btn" onclick="toggleHypothesenSort()" title="Sortierung umschalten">
              🔽 <span id="hypothesen-sort-label">Stärke</span>
            </button>
          </div>
        </div>
        ${diffHtml}
        <div id="hypothesen-ansicht-ebenen" class="hypothesen-ansicht">
          ${gruppiertHtml}
        </div>
        <div id="hypothesen-ansicht-flat" class="hypothesen-ansicht" style="display:none;">
          ${flatHtml}
        </div>
        <div style="text-align:center;margin-top:12px;display:flex;gap:8px;justify-content:center;">
          <button class="btn btn-sm btn-primary" onclick="openHypothesen5PModal()">
            🔀 Hypothesen → 5P-Analyse
          </button>
          <button class="btn btn-sm btn-secondary" onclick="generateHypothesenBericht()">
            🖨️ Bericht drucken
          </button>
        </div>
        <div class="hypothesen-disclaimer">
          Diese Hypothesen sind Arbeitshilfen für Fachkräfte — kein Ersatz für klinische Diagnostik. Alle Angaben basieren auf den eingegebenen Daten.
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// TREATMENT-RESPONSE-TRACKING
// ============================================================
// Reliable Change Index (H2) — vereinfacht, ohne Normstichprobe
// RCI = (Post - Pre) / SE_diff; SE_diff = SD * sqrt(2 * (1 - r_tt))
// Konservative Schätzung r_tt = 0.80 (da keine Test-Retest-Daten vorhanden)
function berechneRCI(werte) {
  if (werte.length < 4) return null;
  const pre = (werte[0] + werte[1]) / 2;
  const post = (werte[werte.length - 2] + werte[werte.length - 1]) / 2;
  const mean = werte.reduce((a, b) => a + b, 0) / werte.length;
  const sd = Math.sqrt(werte.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / werte.length);
  const seDiff = sd * Math.sqrt(2 * (1 - 0.80));
  if (seDiff === 0) return null;
  const rci = (post - pre) / seDiff;
  return {
    rci: Math.round(rci * 100) / 100,
    reliable: Math.abs(rci) > 1.96,
    richtung: rci > 0 ? 'verbessert' : rci < 0 ? 'verschlechtert' : 'stabil',
  };
}

function analyzeTreatmentResponse(schuelerId) {
  const notizen = DB.getNotizen(schuelerId).filter(n => n.kategorie === 'session' && n.themaId && n.soap?.srs?.total != null);
  if (notizen.length === 0) return { themen: [], gesamtTrend: null, bestesThema: null };

  // Nach Thema gruppieren
  const themaMap = {};
  for (const n of notizen) {
    if (!themaMap[n.themaId]) themaMap[n.themaId] = [];
    themaMap[n.themaId].push({
      datum: n.datum,
      srsTotal: n.soap.srs.total,
      srsDetails: n.soap.srs,
    });
  }

  // Thema-Labels aus THEMEN_KATEGORIEN holen
  const allThemen = typeof THEMEN_KATEGORIEN !== 'undefined'
    ? THEMEN_KATEGORIEN.flatMap(k => k.themen || []) : [];

  const themenAnalyse = Object.entries(themaMap).map(([themaId, sitzungen]) => {
    sitzungen.sort((a, b) => a.datum.localeCompare(b.datum));
    const srsWerte = sitzungen.map(s => s.srsTotal);
    const durchschnitt = srsWerte.reduce((a, b) => a + b, 0) / srsWerte.length;
    const guteSitzungen = srsWerte.filter(v => v >= 30).length;
    const responseRate = guteSitzungen / srsWerte.length;

    // Trend berechnen (letzte vs. erste Hälfte)
    let trend = 'stabil';
    if (srsWerte.length >= 2) {
      const mitte = Math.floor(srsWerte.length / 2);
      const ersteHaelfte = srsWerte.slice(0, mitte).reduce((a, b) => a + b, 0) / mitte;
      const zweiteHaelfte = srsWerte.slice(mitte).reduce((a, b) => a + b, 0) / (srsWerte.length - mitte);
      if (zweiteHaelfte - ersteHaelfte > 3) trend = 'steigend';
      else if (ersteHaelfte - zweiteHaelfte > 3) trend = 'fallend';
    }

    const themaInfo = allThemen.find(t => t.id === themaId);

    const rci = berechneRCI(srsWerte);

    return {
      themaId,
      label: themaInfo?.titel || themaId,
      anzahl: srsWerte.length,
      durchschnittSrs: Math.round(durchschnitt * 10) / 10,
      responseRate: Math.round(responseRate * 100),
      trend,
      guteSitzungen,
      srsWerte,
      rci,
    };
  });

  // Sortieren nach Response-Rate
  themenAnalyse.sort((a, b) => b.responseRate - a.responseRate || b.durchschnittSrs - a.durchschnittSrs);

  const bestesThema = themenAnalyse.length > 0 && themenAnalyse[0].responseRate >= 60 ? themenAnalyse[0] : null;

  // Gesamttrend über alle SRS-Werte
  const alleSrs = notizen.sort((a, b) => a.datum.localeCompare(b.datum)).map(n => n.soap.srs.total);
  let gesamtTrend = null;
  if (alleSrs.length >= 3) {
    const mitte = Math.floor(alleSrs.length / 2);
    const erste = alleSrs.slice(0, mitte).reduce((a, b) => a + b, 0) / mitte;
    const zweite = alleSrs.slice(mitte).reduce((a, b) => a + b, 0) / (alleSrs.length - mitte);
    const diff = zweite - erste;
    if (diff > 2) gesamtTrend = { richtung: 'positiv', diff: Math.round(diff * 10) / 10 };
    else if (diff < -2) gesamtTrend = { richtung: 'negativ', diff: Math.round(diff * 10) / 10 };
    else gesamtTrend = { richtung: 'stabil', diff: Math.round(diff * 10) / 10 };
  }

  // ── Ansatz-Analyse: welcher therapeutische Ansatz wirkt? ──
  const ansatzMap = {};
  if (typeof THEMA_INTERVENTIONEN !== 'undefined') {
    for (const [themaId, sitzungen] of Object.entries(themaMap)) {
      const interventionen = THEMA_INTERVENTIONEN[themaId] || [];
      const ansaetze = [...new Set(interventionen.map(i => i.ansatz).filter(Boolean))];
      for (const ansatz of ansaetze) {
        if (!ansatzMap[ansatz]) ansatzMap[ansatz] = { srsWerte: [], themen: new Set() };
        ansatzMap[ansatz].srsWerte.push(...sitzungen.map(s => s.srsTotal));
        ansatzMap[ansatz].themen.add(themaId);
      }
    }
  }

  const ansatzAnalyse = Object.entries(ansatzMap)
    .filter(([, data]) => data.srsWerte.length >= 2)
    .map(([ansatz, data]) => {
      const durchschnitt = data.srsWerte.reduce((a, b) => a + b, 0) / data.srsWerte.length;
      const guteRate = data.srsWerte.filter(v => v >= 30).length / data.srsWerte.length;
      return {
        ansatz,
        durchschnittSrs: Math.round(durchschnitt * 10) / 10,
        responseRate: Math.round(guteRate * 100),
        anzahl: data.srsWerte.length,
        themenCount: data.themen.size,
      };
    })
    .sort((a, b) => b.responseRate - a.responseRate);

  const besterAnsatz = ansatzAnalyse.length > 0 && ansatzAnalyse[0].responseRate >= 60 ? ansatzAnalyse[0] : null;

  return { themen: themenAnalyse, gesamtTrend, bestesThema, ansatzAnalyse, besterAnsatz };
}

function renderTreatmentResponse(schuelerId) {
  const el = document.getElementById('treatment-response-container');
  if (!el) return;

  const analyse = analyzeTreatmentResponse(schuelerId);
  if (analyse.themen.length === 0) {
    el.innerHTML = '';
    return;
  }

  const trendIcon = (t) => t === 'steigend' ? '📈' : t === 'fallend' ? '📉' : '➡️';
  const trendColor = (t) => t === 'steigend' ? '#22C55E' : t === 'fallend' ? '#EF4444' : '#9CA3AF';
  const responseColor = (r) => r >= 75 ? '#22C55E' : r >= 50 ? '#F59E0B' : '#EF4444';

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <span>💊</span>
        <div class="card-title">Treatment-Response-Analyse</div>
        <span style="font-size:12px;color:var(--text-muted);margin-left:auto;">${analyse.themen.reduce((a, t) => a + t.anzahl, 0)} Sitzungen</span>
      </div>
      <div class="card-body">
        ${analyse.gesamtTrend ? `
          <div class="treatment-gesamt-trend" style="border-left:3px solid ${trendColor(analyse.gesamtTrend.richtung)}">
            ${trendIcon(analyse.gesamtTrend.richtung)} Gesamttrend SRS: <strong>${analyse.gesamtTrend.richtung}</strong>
            (${analyse.gesamtTrend.diff > 0 ? '+' : ''}${analyse.gesamtTrend.diff} Punkte)
          </div>
        ` : ''}
        ${analyse.bestesThema ? `
          <div class="treatment-empfehlung">
            ✨ <strong>Dieser Schüler respondiert gut auf: ${analyse.bestesThema.label}</strong>
            (${analyse.bestesThema.responseRate}% gute Sitzungen, Ø SRS ${analyse.bestesThema.durchschnittSrs})
          </div>
        ` : ''}
        <div class="treatment-themen-grid">
          ${analyse.themen.map(t => `
            <div class="treatment-thema-card">
              <div class="treatment-thema-header">
                <span class="treatment-thema-label">${t.label}</span>
                <span class="treatment-thema-count">${t.anzahl}x</span>
              </div>
              <div class="treatment-thema-stats">
                <span style="color:${responseColor(t.responseRate)}">
                  ${t.responseRate}% Response
                </span>
                <span>Ø ${t.durchschnittSrs}/40 SRS</span>
                <span style="color:${trendColor(t.trend)}">
                  ${trendIcon(t.trend)} ${t.trend}
                </span>
              </div>
              <div class="treatment-srs-mini">
                ${t.srsWerte.map(v => `<span class="treatment-srs-dot" style="background:${v >= 30 ? '#22C55E' : v >= 20 ? '#F59E0B' : '#EF4444'}" title="SRS: ${v}/40"></span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        ${analyse.ansatzAnalyse.length > 0 ? `
          <div style="margin-top:12px;padding-top:10px;border-top:1px solid #F3F4F6;">
            <div style="font-weight:600;font-size:12px;margin-bottom:8px;">🧪 Therapeutischer Ansatz-Vergleich</div>
            ${analyse.besterAnsatz ? `
              <div class="treatment-empfehlung" style="margin-bottom:8px;">
                ✨ <strong>Bester Ansatz: ${analyse.besterAnsatz.ansatz}</strong>
                (${analyse.besterAnsatz.responseRate}% Response, Ø SRS ${analyse.besterAnsatz.durchschnittSrs}/40)
              </div>
            ` : ''}
            <div class="treatment-ansatz-grid">
              ${analyse.ansatzAnalyse.map(a => {
                const barWidth = Math.min(100, a.responseRate);
                const barColor = a.responseRate >= 75 ? '#22C55E' : a.responseRate >= 50 ? '#F59E0B' : '#EF4444';
                return `
                  <div class="treatment-ansatz-row">
                    <span class="treatment-ansatz-label">${a.ansatz}</span>
                    <div class="treatment-ansatz-bar-bg">
                      <div class="treatment-ansatz-bar-fill" style="width:${barWidth}%;background:${barColor}"></div>
                    </div>
                    <span class="treatment-ansatz-value">${a.responseRate}%</span>
                    <span class="treatment-ansatz-count">${a.anzahl} Sitz.</span>
                  </div>
                `;
              }).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ============================================================
// HYPOTHESEN-BERICHT (druckbar)
// ============================================================
function generateHypothesenBericht() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;

  const hypothesen = generateHypothesen(APP.currentSchuelerId);
  const trAnalyse = analyzeTreatmentResponse(APP.currentSchuelerId);
  const screenings = DB.getScreenings(APP.currentSchuelerId).filter(sc => sc.abgeschlossen);
  screenings.sort((a, b) => a.erstellt.localeCompare(b.erstellt));

  const datum = new Date().toLocaleDateString('de-CH');
  const risiken = hypothesen.filter(h => h.typ === 'risiko');
  const schutz = hypothesen.filter(h => h.typ === 'schutz');
  const diff = hypothesen.filter(h => h.typ === 'differenzial');

  // Screening-Delta
  let screeningDelta = '';
  if (screenings.length >= 2) {
    const domains = typeof SCREENING_DOMAINS !== 'undefined' ? SCREENING_DOMAINS : [];
    const erst = screenings[0];
    const letzt = screenings[screenings.length - 1];
    const allDomIds = [...new Set([...Object.keys(erst.scores || {}), ...Object.keys(letzt.scores || {})])];
    screeningDelta = allDomIds.map(did => {
      const dom = domains.find(d => d.id === did);
      const s1 = (erst.scores || {})[did] || 0;
      const s2 = (letzt.scores || {})[did] || 0;
      const diff = s2 - s1;
      if (s1 === 0 && s2 === 0) return '';
      const arrow = diff < 0 ? '\u2193' : diff > 0 ? '\u2191' : '\u2194';
      return `${dom?.label || did}: ${s1} \u2192 ${s2} (${diff > 0 ? '+' : ''}${diff}) ${arrow}`;
    }).filter(Boolean).join('\n');
  }

  const berichtHtml = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Hypothesen-Bericht: ${s.vorname} ${s.nachname}</title>
      <style>
        * { margin:0; padding:0; box-sizing:border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; font-size:12px; color:#1F2937; padding:30px; max-width:800px; margin:0 auto; }
        h1 { font-size:18px; margin-bottom:4px; }
        h2 { font-size:14px; margin:16px 0 8px; border-bottom:2px solid #E5E7EB; padding-bottom:4px; }
        h3 { font-size:12px; margin:8px 0 4px; }
        .meta { color:#6B7280; font-size:11px; margin-bottom:16px; }
        .section { margin-bottom:16px; }
        .hypo { padding:8px 12px; margin-bottom:6px; border-left:3px solid #ccc; background:#F9FAFB; border-radius:0 6px 6px 0; }
        .hypo.risiko-hoch { border-color:#EF4444; }
        .hypo.risiko-mittel { border-color:#F59E0B; }
        .hypo.risiko-niedrig { border-color:#9CA3AF; }
        .hypo.schutz { border-color:#22C55E; }
        .hypo.diff { border-color:#8B5CF6; }
        .hypo-titel { font-weight:600; }
        .hypo-detail { font-size:11px; color:#6B7280; margin-top:3px; }
        .hypo-evidenz { font-size:10px; color:#9CA3AF; margin-top:2px; font-style:italic; }
        .treatment { padding:6px 10px; background:#F0FDF4; border-radius:6px; margin-bottom:4px; }
        .screening-row { padding:3px 0; font-size:11px; }
        .disclaimer { font-size:10px; color:#9CA3AF; margin-top:20px; padding-top:10px; border-top:1px solid #E5E7EB; text-align:center; }
        .hochgestuft { color:#DC2626; font-weight:600; font-size:10px; }
        @media print { body { padding:15px; } }
      </style>
    </head>
    <body>
      <h1>Klinische Hypothesen-Analyse</h1>
      <div class="meta">
        ${s.vorname} ${s.nachname} | Klasse: ${s.klasse || '—'} | Erstellt: ${datum}<br>
        ${hypothesen.length} aktive Hypothesen | ${risiken.length} Risiken | ${schutz.length} Schutzfaktoren | ${diff.length} Differenzialdiagnosen
      </div>

      ${risiken.length > 0 ? `
        <div class="section">
          <h2>\u26A0\uFE0F Risikohypothesen (${risiken.length})</h2>
          ${risiken.map(h => `
            <div class="hypo ${h.staerkeWert >= 3 ? 'risiko-hoch' : h.staerkeWert >= 2 ? 'risiko-mittel' : 'risiko-niedrig'}">
              <div class="hypo-titel">${h.titel} — ${h.staerke === 'sehr-wahrscheinlich' ? 'Sehr wahrscheinlich' : h.staerke === 'wahrscheinlich' ? 'Wahrscheinlich' : 'Hinweis'}
                ${h._dynamischHochgestuft ? '<span class="hochgestuft">\u2191 dynamisch hochgestuft</span>' : ''}
              </div>
              <div class="hypo-detail">Basierend auf: ${(h._ausloesendeDaten || []).join(', ')}</div>
              <div class="hypo-detail">${h.erklaerung}</div>
              <div class="hypo-detail"><strong>Empfehlung:</strong> ${h.empfehlung}</div>
              <div class="hypo-evidenz">${h.quelle}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${schutz.length > 0 ? `
        <div class="section">
          <h2>\uD83D\uDEE1\uFE0F Schutzfaktoren (${schutz.length})</h2>
          ${schutz.map(h => `
            <div class="hypo schutz">
              <div class="hypo-titel">${h.titel}</div>
              <div class="hypo-detail">${h.erklaerung}</div>
              <div class="hypo-evidenz">${h.quelle}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${diff.length > 0 ? `
        <div class="section">
          <h2>\uD83D\uDD00 Differenzialdiagnostische Hinweise (${diff.length})</h2>
          ${diff.map(h => `
            <div class="hypo diff">
              <div class="hypo-titel">${h.titel}</div>
              <div class="hypo-detail">${h.erklaerung}</div>
              <div class="hypo-evidenz">${h.quelle}</div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${trAnalyse.themen.length > 0 ? `
        <div class="section">
          <h2>\uD83D\uDC8A Treatment-Response</h2>
          ${trAnalyse.bestesThema ? `<div class="treatment"><strong>Respondiert gut auf:</strong> ${trAnalyse.bestesThema.label} (${trAnalyse.bestesThema.responseRate}% Response, \u00D8 SRS ${trAnalyse.bestesThema.durchschnittSrs}/40)</div>` : ''}
          ${trAnalyse.themen.map(t => `
            <div class="screening-row">${t.label}: ${t.anzahl} Sitzungen, ${t.responseRate}% Response, Trend: ${t.trend}</div>
          `).join('')}
          ${trAnalyse.ansatzAnalyse && trAnalyse.ansatzAnalyse.length > 0 ? `
            <h3>\uD83E\uDDEA Therapeutischer Ansatz-Vergleich</h3>
            ${trAnalyse.besterAnsatz ? `<div class="treatment"><strong>Bester Ansatz:</strong> ${trAnalyse.besterAnsatz.ansatz} (${trAnalyse.besterAnsatz.responseRate}% Response)</div>` : ''}
            ${trAnalyse.ansatzAnalyse.map(a => `
              <div class="screening-row">${a.ansatz}: ${a.responseRate}% Response, ${a.anzahl} Sitzungen, ${a.themenCount} Themen</div>
            `).join('')}
          ` : ''}
        </div>
      ` : ''}

      ${screeningDelta ? `
        <div class="section">
          <h2>\uD83D\uDCCA Screening-Verlauf (T1 \u2192 T${screenings.length})</h2>
          ${screeningDelta.split('\n').map(line => `<div class="screening-row">${line}</div>`).join('')}
        </div>
      ` : ''}

      <div class="disclaimer">
        Dieser Bericht wurde automatisch generiert und dient als Arbeitshilfe f\u00FCr Fachkr\u00E4fte \u2014 kein Ersatz f\u00FCr klinische Diagnostik.
      </div>
    </body>
    </html>
  `;

  const fenster = window.open('', '_blank');
  if (fenster) {
    fenster.document.write(berichtHtml);
    fenster.document.close();
    fenster.print();
  } else {
    showToast('Pop-up blockiert — bitte Pop-ups erlauben', 'warning');
  }
}

// ============================================================
// HYPOTHESEN-ZEITSTRAHL
// ============================================================
function renderHypothesenZeitstrahl(schuelerId) {
  const el = document.getElementById('hypothesen-zeitstrahl');
  if (!el) return;

  const s = DB.getSchuelerById(schuelerId);
  if (!s) return;

  const verlauf = s.hypothesenVerlauf || [];
  if (verlauf.length < 2) {
    el.innerHTML = '';
    return;
  }

  // Alle Hypothesen-IDs die je aufgetaucht sind
  const alleIds = [...new Set(verlauf.flatMap(v => v.hypothesenIds))];

  // Regel-Titel nachschlagen
  const regelMap = {};
  for (const r of HYPOTHESEN_REGELN) {
    regelMap[r.id] = { titel: r.titel, typ: r.typ, staerkeWert: r.staerkeWert };
  }

  // Matrix: Zeitpunkt × Hypothese
  const zeitpunkte = verlauf.map(v => ({
    datum: new Date(v.datum).toLocaleDateString('de-CH'),
    datumRaw: v.datum,
    ids: v.hypothesenIds,
    datenPunkte: v.datenPunkte || {},
  }));

  // Hypothesen-Zeilen: nur die mit mind. 2 Auftritte oder aktuelle
  const aktuelleIds = zeitpunkte[zeitpunkte.length - 1].ids;
  const relevanteIds = alleIds.filter(id => {
    const auftritte = zeitpunkte.filter(z => z.ids.includes(id)).length;
    return auftritte >= 2 || aktuelleIds.includes(id);
  });

  // Typ-Farben
  const typFarbe = (id) => {
    const r = regelMap[id];
    if (!r) return '#9CA3AF';
    if (r.typ === 'schutz') return '#22C55E';
    if (r.typ === 'differenzial') return '#8B5CF6';
    if (r.staerkeWert >= 3) return '#EF4444';
    if (r.staerkeWert >= 2) return '#F59E0B';
    return '#9CA3AF';
  };

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <span>📈</span>
        <div class="card-title">Hypothesen-Zeitstrahl</div>
        <span style="font-size:12px;color:var(--text-muted);margin-left:auto;">${zeitpunkte.length} Zeitpunkte</span>
      </div>
      <div class="card-body">
        <div class="hypo-zeitstrahl-container">
          <div class="hypo-zeitstrahl-header">
            <div class="hypo-zeitstrahl-label-col"></div>
            ${zeitpunkte.map((z, i) => `<div class="hypo-zeitstrahl-datum">${i === 0 ? 'Start' : i === zeitpunkte.length - 1 ? 'Aktuell' : z.datum}</div>`).join('')}
          </div>
          ${relevanteIds.map(id => {
            const info = regelMap[id] || { titel: id, typ: 'risiko' };
            const farbe = typFarbe(id);
            return `
              <div class="hypo-zeitstrahl-row">
                <div class="hypo-zeitstrahl-label" title="${info.titel}">
                  <span class="hypo-zeitstrahl-dot" style="background:${farbe}"></span>
                  ${info.titel.length > 30 ? info.titel.substring(0, 28) + '...' : info.titel}
                </div>
                ${zeitpunkte.map(z => {
                  const aktiv = z.ids.includes(id);
                  const dp = z.datenPunkte[id] || 0;
                  return `<div class="hypo-zeitstrahl-cell">
                    ${aktiv ? `<span class="hypo-zeitstrahl-mark" style="background:${farbe};opacity:${0.4 + (dp * 0.15)}" title="${dp} Datenpunkte"></span>` : '<span class="hypo-zeitstrahl-empty"></span>'}
                  </div>`;
                }).join('')}
              </div>
            `;
          }).join('')}
        </div>
        <div class="hypo-zeitstrahl-legende">
          <span><span class="hypo-zeitstrahl-dot" style="background:#EF4444"></span> Hohes Risiko</span>
          <span><span class="hypo-zeitstrahl-dot" style="background:#F59E0B"></span> Mittleres Risiko</span>
          <span><span class="hypo-zeitstrahl-dot" style="background:#22C55E"></span> Schutzfaktor</span>
          <span><span class="hypo-zeitstrahl-dot" style="background:#8B5CF6"></span> Differenzial</span>
          <span style="color:var(--text-muted);font-size:10px;">Intensität = Anzahl Datenpunkte</span>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// T1/T2/T3 SCREENING-VERLAUF
// ============================================================
function renderScreeningVerlauf(schuelerId) {
  const el = document.getElementById('screening-verlauf-container');
  if (!el) return;

  const screenings = DB.getScreenings(schuelerId).filter(s => s.abgeschlossen);
  if (screenings.length < 2) {
    el.innerHTML = '';
    return;
  }

  // Chronologisch sortieren
  screenings.sort((a, b) => a.erstellt.localeCompare(b.erstellt));

  // Screening-Domains aus Konfiguration
  const domains = typeof SCREENING_DOMAINS !== 'undefined' ? SCREENING_DOMAINS : [];

  // Zeitpunkte benennen (T1, T2, T3, ...)
  const zeitpunkte = screenings.map((s, i) => ({
    label: `T${i + 1}`,
    datum: new Date(s.erstellt).toLocaleDateString('de-CH'),
    scores: s.scores || {},
    flagged: s.flaggedAreas || [],
  }));

  // Alle Domains sammeln die in mindestens einem Screening vorkommen
  const alleDomainIds = [...new Set(screenings.flatMap(s => Object.keys(s.scores || {})))];

  // Delta berechnen zwischen jedem aufeinanderfolgenden Zeitpunkt
  const deltas = [];
  for (let i = 1; i < zeitpunkte.length; i++) {
    const vorher = zeitpunkte[i - 1];
    const aktuell = zeitpunkte[i];
    const domainDeltas = alleDomainIds.map(domId => {
      const domain = domains.find(d => d.id === domId);
      const scoreVorher = vorher.scores[domId] || 0;
      const scoreAktuell = aktuell.scores[domId] || 0;
      const diff = scoreAktuell - scoreVorher;
      const prozent = scoreVorher > 0 ? Math.round((diff / scoreVorher) * 100) : 0;
      const cutoff = domain?.cutoff || 0;
      const maxScore = (domain?.items?.length || 5) * 3;
      return {
        domainId: domId,
        label: domain?.label || domId,
        farbe: domain?.farbe || '#9CA3AF',
        scoreVorher,
        scoreAktuell,
        diff,
        prozent,
        cutoff,
        maxScore,
        ueberCutoff: scoreAktuell >= cutoff,
      };
    }).filter(d => d.scoreVorher > 0 || d.scoreAktuell > 0);

    deltas.push({
      von: vorher.label,
      bis: aktuell.label,
      vonDatum: vorher.datum,
      bisDatum: aktuell.datum,
      domains: domainDeltas,
    });
  }

  // Automatische Kommentare generieren
  function generiereKommentar(delta) {
    const verbessert = delta.domains.filter(d => d.diff < 0 && Math.abs(d.prozent) >= 15);
    const verschlechtert = delta.domains.filter(d => d.diff > 0 && d.prozent >= 15);
    const kommentare = [];

    for (const d of verbessert) {
      kommentare.push(`<span style="color:#22C55E">↓ ${d.label}-Score gesunken um ${Math.abs(d.prozent)}% seit ${delta.von}</span>`);
    }
    for (const d of verschlechtert) {
      kommentare.push(`<span style="color:#EF4444">↑ ${d.label}-Score gestiegen um ${d.prozent}% seit ${delta.von}</span>`);
    }

    // Cutoff-Wechsel
    for (const d of delta.domains) {
      const vorherDomain = deltas.length > 0 ? null : null; // simplified
      if (d.scoreVorher >= d.cutoff && d.scoreAktuell < d.cutoff) {
        kommentare.push(`<span style="color:#22C55E">✓ ${d.label} unter klinischem Cutoff gefallen</span>`);
      } else if (d.scoreVorher < d.cutoff && d.scoreAktuell >= d.cutoff) {
        kommentare.push(`<span style="color:#EF4444">⚠ ${d.label} über klinischen Cutoff gestiegen</span>`);
      }
    }

    return kommentare;
  }

  el.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <span>📊</span>
        <div class="card-title">Screening-Verlauf (${zeitpunkte.map(z => z.label).join(' → ')})</div>
        <span style="font-size:12px;color:var(--text-muted);margin-left:auto;">${screenings.length} Zeitpunkte</span>
      </div>
      <div class="card-body">
        ${deltas.map(delta => {
          const kommentare = generiereKommentar(delta);
          return `
            <div style="margin-bottom:16px;">
              <div style="font-weight:600;font-size:13px;margin-bottom:8px;">
                ${delta.von} (${delta.vonDatum}) → ${delta.bis} (${delta.bisDatum})
              </div>
              ${kommentare.length > 0 ? `
                <div style="margin-bottom:8px;display:flex;flex-direction:column;gap:4px;font-size:12px;">
                  ${kommentare.join('')}
                </div>
              ` : '<div style="font-size:12px;color:var(--text-muted);margin-bottom:8px;">Keine signifikanten Veränderungen.</div>'}
              ${delta.domains.map(d => {
                const fillVorher = Math.min(100, (d.scoreVorher / d.maxScore) * 100);
                const fillAktuell = Math.min(100, (d.scoreAktuell / d.maxScore) * 100);
                const diffLabel = d.diff > 0 ? `+${d.diff}` : d.diff < 0 ? `${d.diff}` : '±0';
                const diffColor = d.diff < 0 ? '#22C55E' : d.diff > 0 ? '#EF4444' : '#9CA3AF';
                return `
                  <div class="screening-verlauf-delta">
                    <span style="min-width:120px;font-size:11px;">${d.label}</span>
                    <div class="screening-verlauf-bar">
                      <div class="screening-verlauf-fill" style="width:${fillAktuell}%;background:${d.farbe}"></div>
                    </div>
                    <span style="min-width:40px;text-align:right;font-size:11px;">${d.scoreAktuell}</span>
                    <span style="min-width:45px;text-align:right;font-size:11px;font-weight:600;color:${diffColor}">${diffLabel}</span>
                  </div>
                `;
              }).join('')}
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// Hypothesen-Ansicht umschalten (Ebenen vs. Flat)
function toggleHypothesenAnsicht(ansicht) {
  document.querySelectorAll('.hypothesen-ansicht-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.ansicht === ansicht);
  });
  document.getElementById('hypothesen-ansicht-ebenen').style.display = ansicht === 'ebenen' ? '' : 'none';
  document.getElementById('hypothesen-ansicht-flat').style.display = ansicht === 'flat' ? '' : 'none';
}

// Hypothesen-Filter nach Ebene ein-/ausschalten
function toggleHypothesenFilter(ebene) {
  const btn = document.querySelector(`[data-filter-ebene="${ebene}"]`);
  if (!btn) return;
  btn.classList.toggle('active');
  const isActive = btn.classList.contains('active');
  // Karten in beiden Ansichten ein-/ausblenden
  document.querySelectorAll(`.hypothese-card[data-ebene="${ebene}"]`).forEach(card => {
    card.style.display = isActive ? '' : 'none';
  });
  // Ebene-Gruppen-Header auch ausblenden wenn leer
  document.querySelectorAll('.hypothesen-ebene-gruppe').forEach(grp => {
    const visibleCards = grp.querySelectorAll('.hypothese-card:not([style*="display: none"])');
    grp.style.display = visibleCards.length > 0 ? '' : 'none';
  });
}

// Screening-Domain → Hypothesen verlinken: scrollt und highlighted
function scrollToHypothesenForDomain(domainId) {
  // Zeige Info-Tab
  const infoTab = document.querySelector('[data-profil-tab="info"]');
  if (infoTab) infoTab.click();

  setTimeout(() => {
    // Alle Hypothesen-Karten durchgehen und die relevanten highlighten
    const cards = document.querySelectorAll('.hypothese-card');
    let firstMatch = null;
    cards.forEach(card => {
      card.classList.remove('hypothese-highlight');
      const datenEl = card.querySelector('.hypothese-daten');
      if (datenEl && datenEl.textContent.toLowerCase().includes(domainId.toLowerCase())) {
        card.classList.add('hypothese-highlight');
        if (!firstMatch) firstMatch = card;
      }
    });
    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight nach 3s entfernen
      setTimeout(() => {
        document.querySelectorAll('.hypothese-highlight').forEach(c => c.classList.remove('hypothese-highlight'));
      }, 3000);
    }
  }, 200);
}

// Hypothesen-Sortierung umschalten
let hypothesenSortModus = 'staerke'; // 'staerke' oder 'alpha'
function toggleHypothesenSort() {
  hypothesenSortModus = hypothesenSortModus === 'staerke' ? 'alpha' : 'staerke';
  const label = document.getElementById('hypothesen-sort-label');
  if (label) label.textContent = hypothesenSortModus === 'staerke' ? 'Stärke' : 'A-Z';

  // Karten in allen Containern neu sortieren
  document.querySelectorAll('.hypothesen-ebene-cards, #hypothesen-ansicht-flat').forEach(container => {
    const cards = Array.from(container.querySelectorAll('.hypothese-card'));
    if (hypothesenSortModus === 'alpha') {
      cards.sort((a, b) => {
        const tA = a.querySelector('.hypothese-titel')?.textContent || '';
        const tB = b.querySelector('.hypothese-titel')?.textContent || '';
        return tA.localeCompare(tB, 'de');
      });
    } else {
      cards.sort((a, b) => (parseInt(b.dataset.staerke) || 0) - (parseInt(a.dataset.staerke) || 0));
    }
    cards.forEach(card => container.appendChild(card));
  });
}

// ============================================================
// SCHÜLER MODAL (Anlegen / Bearbeiten)
// ============================================================
function openSchuelerModal(schuelerId = null) {
  const s = schuelerId ? DB.getSchuelerById(schuelerId) : null;
  const titel = s ? 'Schüler bearbeiten' : 'Neuen Schüler anlegen';

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'schueler-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span>👤</span>
        <div class="modal-title">${titel}</div>
        <button class="modal-close" onclick="closeModal('schueler-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label>Vorname *</label>
            <input type="text" id="m-vorname" value="${s?.vorname || ''}" placeholder="Vorname">
          </div>
          <div class="form-group">
            <label>Nachname *</label>
            <input type="text" id="m-nachname" value="${s?.nachname || ''}" placeholder="Nachname">
          </div>
          <div class="form-group">
            <label>Geburtsdatum</label>
            <input type="date" id="m-geburtsdatum" value="${s?.geburtsdatum || ''}">
          </div>
          <div class="form-group">
            <label>Klasse / Gruppe</label>
            <input type="text" id="m-klasse" value="${s?.klasse || ''}" placeholder="z.B. Gruppe A">
          </div>
          <div class="form-group">
            <label>Eintrittsdatum</label>
            <input type="date" id="m-eintrittsdatum" value="${s?.eintrittsdatum || ''}">
          </div>
          <div class="form-group">
            <label>Risikoeinschätzung</label>
            <select id="m-risiko">
              <option value="niedrig" ${s?.risiko === 'niedrig' ? 'selected' : ''}>🟢 Niedrig</option>
              <option value="mittel" ${s?.risiko === 'mittel' ? 'selected' : ''}>🟡 Mittel</option>
              <option value="hoch" ${s?.risiko === 'hoch' ? 'selected' : ''}>🔴 Hoch</option>
            </select>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('schueler-modal')">Abbrechen</button>
        <button class="btn btn-primary" onclick="saveSchueler('${schuelerId || ''}')">Speichern</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal('schueler-modal'); });
  document.getElementById('m-vorname').focus();
}

function saveSchueler(schuelerId) {
  const vorname = document.getElementById('m-vorname').value.trim();
  const nachname = document.getElementById('m-nachname').value.trim();
  if (!vorname || !nachname) {
    showToast('Vor- und Nachname sind Pflichtfelder', 'error');
    return;
  }

  const daten = {
    vorname,
    nachname,
    geburtsdatum: document.getElementById('m-geburtsdatum').value,
    klasse: document.getElementById('m-klasse').value,
    eintrittsdatum: document.getElementById('m-eintrittsdatum').value,
    risiko: document.getElementById('m-risiko').value,
  };

  if (schuelerId) {
    DB.updateSchueler(schuelerId, daten);
    showToast('Schüler aktualisiert', 'success');
    renderProfil(schuelerId);
  } else {
    const neu = DB.createSchueler(daten);
    showToast('Schüler angelegt', 'success');
    showView('profil', neu.id);
    // Onboarding-Wizard für neue Schüler
    setTimeout(() => showOnboardingWizard(neu.id), 300);
  }

  closeModal('schueler-modal');
  renderSidebar();
  if (APP.currentView === 'home') renderHome();
}

function deleteSchueler(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!confirm(`Schüler "${s.vorname} ${s.nachname}" wirklich löschen? Alle Daten gehen verloren!`)) return;
  DB.deleteSchueler(schuelerId);
  renderSidebar();
  showView('home');
  showToast('Schüler gelöscht');
}

// ============================================================
// KALENDER
// ============================================================
function renderKalender() {
  const jahr = APP.kalenderDatum.getFullYear();
  const monat = APP.kalenderDatum.getMonth();
  const monate = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

  document.getElementById('kalender-monat-label').textContent = `${monate[monat]} ${jahr}`;

  // Tage im Monat
  const ersterTag = new Date(jahr, monat, 1).getDay();
  const startOffset = ersterTag === 0 ? 6 : ersterTag - 1; // Montag = 0
  const tageImMonat = new Date(jahr, monat + 1, 0).getDate();

  const heute = new Date();
  const alleTermine = DB.getTermine();

  let html = '';
  // Leere Felder am Anfang
  for (let i = 0; i < startOffset; i++) {
    html += '<div class="kalender-tag leer"></div>';
  }

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datumStr = `${jahr}-${String(monat+1).padStart(2,'0')}-${String(tag).padStart(2,'0')}`;
    const isHeute = heute.getFullYear() === jahr && heute.getMonth() === monat && heute.getDate() === tag;
    const termine = alleTermine.filter(t => t.datum === datumStr);

    html += `
      <div class="kalender-tag ${isHeute ? 'heute' : ''}" onclick="openTerminModal('${datumStr}')">
        <div class="tag-nummer">${tag}</div>
        <div class="tag-events">
          ${termine.slice(0,3).map(t => {
            const typ = TERMIN_TYPEN[t.typ] || TERMIN_TYPEN.termin;
            return `<div class="tag-event" style="background:${typ.farbe};" title="${t.titel}">${t.uhrzeit ? t.uhrzeit + ' ' : ''}${t.titel}</div>`;
          }).join('')}
          ${termine.length > 3 ? `<div style="font-size:10px;color:var(--text-muted);">+${termine.length - 3} mehr</div>` : ''}
        </div>
      </div>`;
  }

  document.getElementById('kalender-tage').innerHTML = html;
  renderTerminSidebar();
}

function renderTerminSidebar() {
  const alleTermine = DB.getTermine()
    .filter(t => t.datum >= new Date().toISOString().split('T')[0])
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 10);

  const container = document.getElementById('naechste-termine');
  if (alleTermine.length === 0) {
    container.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;">Keine bevorstehenden Termine</div>';
    return;
  }

  container.innerHTML = alleTermine.map(t => {
    const typ = TERMIN_TYPEN[t.typ] || TERMIN_TYPEN.termin;
    const schueler = t.schuelerId ? DB.getSchuelerById(t.schuelerId) : null;
    return `
    <div class="termin-item">
      <div class="termin-color-bar" style="background:${typ.farbe};"></div>
      <div class="termin-info">
        <div class="termin-titel">${typ.icon} ${t.titel}</div>
        <div class="termin-meta">
          ${formatDatum(t.datum)}${t.uhrzeit ? ' · ' + t.uhrzeit : ''}
          ${schueler ? ` · ${schueler.vorname} ${schueler.nachname}` : ''}
        </div>
      </div>
      <button class="btn-icon btn-sm" style="font-size:11px;" onclick="deleteTermin('${t.id}')">🗑</button>
    </div>`;
  }).join('');
}

function kalenderVor() {
  APP.kalenderDatum = new Date(APP.kalenderDatum.getFullYear(), APP.kalenderDatum.getMonth() + 1, 1);
  renderKalender();
}

function kalenderZurueck() {
  APP.kalenderDatum = new Date(APP.kalenderDatum.getFullYear(), APP.kalenderDatum.getMonth() - 1, 1);
  renderKalender();
}

// ============================================================
// TERMIN MODAL
// ============================================================
function openTerminModal(datum = '') {
  const schueler = DB.getSchueler();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'termin-modal';
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <span>📅</span>
        <div class="modal-title">Termin hinzufügen</div>
        <button class="modal-close" onclick="closeModal('termin-modal')">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group full">
            <label>Titel *</label>
            <input type="text" id="t-titel" placeholder="Terminbezeichnung">
          </div>
          <div class="form-group">
            <label>Datum *</label>
            <input type="date" id="t-datum" value="${datum}">
          </div>
          <div class="form-group">
            <label>Uhrzeit</label>
            <input type="time" id="t-uhrzeit">
          </div>
          <div class="form-group">
            <label>Typ</label>
            <select id="t-typ">
              ${Object.entries(TERMIN_TYPEN).map(([k, v]) =>
                `<option value="${k}">${v.icon} ${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Schüler</label>
            <select id="t-schueler">
              <option value="">— Kein Schüler —</option>
              ${schueler.map(s => `<option value="${s.id}">${s.vorname} ${s.nachname}</option>`).join('')}
            </select>
          </div>
          <div class="form-group full">
            <label>Beschreibung</label>
            <textarea id="t-beschreibung" rows="2" placeholder="Optional..."></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" onclick="closeModal('termin-modal')">Abbrechen</button>
        <button class="btn btn-primary" onclick="saveTermin()">Speichern</button>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal('termin-modal'); });
  document.getElementById('t-titel').focus();
}

function saveTermin() {
  const titel = document.getElementById('t-titel').value.trim();
  const datum = document.getElementById('t-datum').value;
  if (!titel || !datum) {
    showToast('Titel und Datum sind Pflichtfelder', 'error');
    return;
  }
  DB.createTermin({
    titel,
    datum,
    uhrzeit: document.getElementById('t-uhrzeit').value,
    typ: document.getElementById('t-typ').value,
    schuelerId: document.getElementById('t-schueler').value || null,
    beschreibung: document.getElementById('t-beschreibung').value,
  });
  closeModal('termin-modal');
  renderKalender();
  showToast('Termin gespeichert', 'success');
}

function deleteTermin(id) {
  DB.deleteTermin(id);
  renderKalender();
  showToast('Termin gelöscht');
}

// ============================================================
// MODAL HELPERS
// ============================================================
function closeModal(id) {
  document.getElementById(id)?.remove();
}

// ============================================================
// HILFSFUNKTIONEN
// ============================================================
function getInitials(vorname, nachname) {
  return `${(vorname || '?')[0]}${(nachname || '?')[0]}`.toUpperCase();
}

function alter(geburtsdatum) {
  if (!geburtsdatum) return '—';
  const heute = new Date();
  const geb = new Date(geburtsdatum);
  let a = heute.getFullYear() - geb.getFullYear();
  if (heute.getMonth() < geb.getMonth() ||
    (heute.getMonth() === geb.getMonth() && heute.getDate() < geb.getDate())) a--;
  return `${a} Jahre`;
}

function formatDatum(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function capitalize(str) {
  return str ? str[0].toUpperCase() + str.slice(1) : '';
}

function escapeHtml(text) {
  return (text || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// TOAST
// ============================================================
function showToast(msg, typ = '') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${typ}`;
  toast.innerHTML = `${typ === 'success' ? '✓' : typ === 'error' ? '✕' : 'ℹ'} ${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ============================================================
// DRUCK / EXPORT
// ============================================================
function druckeProfilbericht(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!s) return;

  const notizen = DB.getNotizen(schuelerId).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const screenings = DB.getScreenings(schuelerId).filter(sc => sc.abgeschlossen).sort((a, b) => b.datum.localeCompare(a.datum));
  const roadmap = DB.getRoadmap(schuelerId);
  const wb = DB.getWohlbefinden(schuelerId).sort((a, b) => a.datum.localeCompare(b.datum));
  const profil = s.staerkenProfil || {};

  const topicStatus = s.topicStatus || {};
  const abgeschlossen = Object.values(topicStatus).filter(v => v === 'abgeschlossen').length;
  const inBearbeitung = Object.values(topicStatus).filter(v => v === 'in-bearbeitung').length;

  const getThemaTitel = (themaId) => {
    for (const kat of THEMEN_KATEGORIEN) { const t = kat.themen.find(th => th.id === themaId); if (t) return t.titel; }
    return themaId;
  };

  // -- Themen Section --
  const themenHTML = THEMEN_KATEGORIEN.map(kat => {
    const themenMitStatus = kat.themen.filter(t => topicStatus[t.id] && topicStatus[t.id] !== 'nicht-begonnen');
    if (themenMitStatus.length === 0) return '';
    return `<div style="margin-bottom:12px;">
      <div style="font-size:12px;font-weight:700;color:#2C5F8A;margin-bottom:4px;">${renderIcon(kat.icon)} ${kat.titel}</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">
        ${themenMitStatus.map(t => {
          const farbe = getStatusFarbe(topicStatus[t.id]);
          return `<span style="padding:2px 8px;border-radius:10px;font-size:10px;background:${farbe}18;color:${farbe};border:1px solid ${farbe}44;">${THEMA_STATUS[topicStatus[t.id]].icon} ${t.titel}</span>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');

  // -- Screening Section --
  let screeningHTML = '';
  if (screenings.length > 0) {
    const scr = screenings[0];
    const flagged = (scr.flaggedAreas || []);
    const severityMap = { low: 'Unauffällig', medium: 'Erhöhter Bedarf', high: 'Hoher Bedarf', urgent: 'Dringend' };
    const severityColor = { low: '#166534', medium: '#854D0E', high: '#991B1B', urgent: '#7F1D1D' };
    screeningHTML = `
      <div class="section">
        <div class="section-title">🔍 Screening (${new Date(scr.datum).toLocaleDateString('de-DE')})</div>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <span style="padding:3px 12px;border-radius:12px;font-size:12px;font-weight:600;background:${severityColor[scr.severity]}18;color:${severityColor[scr.severity]};">${severityMap[scr.severity]}</span>
          <span style="font-size:11px;color:#6B7280;">${flagged.length} auffällige Bereiche</span>
        </div>
        ${flagged.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${flagged.map(fId => {
            const d = SCREENING_DOMAINS.find(dd => dd.id === fId);
            return d ? `<span style="padding:3px 8px;border-radius:8px;font-size:10px;background:${d.farbe}15;color:${d.farbe};border:1px solid ${d.farbe}33;">${d.icon} ${d.label} (${scr.scores[d.id] || 0}/${d.items.length*3})</span>` : '';
          }).join('')}
        </div>` : ''}
        ${scr.clinicalNotes ? `<div style="margin-top:8px;padding:8px;background:#F9FAFB;border-radius:6px;font-size:11px;font-style:italic;">${escapeHtml(scr.clinicalNotes)}</div>` : ''}
      </div>`;
  }

  // -- Stärken Section --
  let staerkenHTML = '';
  const ratings = profil.ratings || {};
  const ratedDims = STAERKEN_DIMENSIONEN.filter(d => ratings[d.id] > 0);
  if (ratedDims.length > 0 || (profil.schutzfaktoren || []).length > 0) {
    staerkenHTML = `
      <div class="section">
        <div class="section-title">💪 Stärken & Ressourcen</div>
        ${ratedDims.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px;">
          ${ratedDims.sort((a, b) => ratings[b.id] - ratings[a.id]).map(d =>
            `<span style="padding:3px 10px;border-radius:8px;font-size:11px;background:${d.farbe}15;color:${d.farbe};border:1px solid ${d.farbe}33;">${d.icon} ${d.label}: <strong>${ratings[d.id]}/10</strong></span>`
          ).join('')}
        </div>` : ''}
        ${(profil.interessen || []).length > 0 ? `<div style="font-size:11px;margin-bottom:4px;"><strong>Interessen:</strong> ${profil.interessen.join(', ')}</div>` : ''}
        ${(profil.vorbilder || []).length > 0 ? `<div style="font-size:11px;margin-bottom:4px;"><strong>Vorbilder:</strong> ${profil.vorbilder.join(', ')}</div>` : ''}
        ${(profil.schutzfaktoren || []).length > 0 ? `<div style="font-size:11px;margin-bottom:4px;"><strong>Schutzfaktoren:</strong> ${profil.schutzfaktoren.join(', ')}</div>` : ''}
        ${profil.freitext ? `<div style="font-size:11px;margin-top:6px;padding:6px;background:#F9FAFB;border-radius:4px;">${escapeHtml(profil.freitext)}</div>` : ''}
      </div>`;
  }

  // -- Roadmap Section --
  let roadmapHTML = '';
  if (roadmap) {
    const totalThemen = roadmap.phasen.reduce((s, p) => s + p.themen.length, 0);
    const doneThemen = roadmap.phasen.reduce((s, p) => s + p.themen.filter(t => t.status === 'abgeschlossen').length, 0);
    roadmapHTML = `
      <div class="section">
        <div class="section-title">🗺️ Förderplan (${doneThemen}/${totalThemen} Themen erledigt)</div>
        ${roadmap.phasen.map((phase, idx) => {
          const def = ROADMAP_PHASEN[idx];
          const statusLabel = phase.status === 'aktiv' ? '▶ Aktiv' : phase.status === 'erledigt' ? '✓ Erledigt' : '○ Offen';
          return `<div style="margin-bottom:10px;padding:8px 10px;border-left:4px solid ${def.farbe};background:#F9FAFB;border-radius:0 6px 6px 0;">
            <div style="font-size:12px;font-weight:700;color:${def.farbe};">${renderIcon(def.icon)} Phase ${def.nr}: ${def.label} <span style="font-weight:400;color:#6B7280;font-size:10px;">(${statusLabel})</span></div>
            ${phase.themen.length > 0 ? `<div style="margin-top:4px;display:flex;flex-wrap:wrap;gap:4px;">
              ${phase.themen.map(t => `<span style="font-size:10px;padding:1px 6px;border-radius:8px;background:${t.status==='abgeschlossen'?'#DCFCE7':'#F3F4F6'};color:${t.status==='abgeschlossen'?'#166534':'#374151'};">${t.status==='abgeschlossen'?'✓':' '} ${getThemaTitel(t.id)}</span>`).join('')}
            </div>` : ''}
            ${phase.notizen ? `<div style="font-size:10px;font-style:italic;color:#6B7280;margin-top:4px;">${escapeHtml(phase.notizen)}</div>` : ''}
          </div>`;
        }).join('')}
      </div>`;
  }

  // -- Wohlbefinden Section --
  let wbHTML = '';
  if (wb.length > 0) {
    const last10 = wb.slice(-10);
    const avg = (last10.reduce((s, w) => s + w.score, 0) / last10.length).toFixed(1);
    wbHTML = `
      <div class="section">
        <div class="section-title">📈 Wohlbefindens-Verlauf (Ø ${avg}/10, ${wb.length} Einträge)</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          ${last10.map(w => {
            const farbe = w.score <= 3 ? '#EF4444' : w.score <= 5 ? '#F59E0B' : '#22C55E';
            return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:10px;font-size:10px;background:${farbe}15;color:${farbe};border:1px solid ${farbe}33;">
              ${new Date(w.datum).toLocaleDateString('de-DE', {day:'2-digit',month:'2-digit'})} <strong>${w.score}</strong>
            </span>`;
          }).join('')}
        </div>
      </div>`;
  }

  // -- Notizen Section --
  const notizenHTML = notizen.slice(0, 15).map(n => {
    const kat = NOTIZ_KATEGORIEN[n.kategorie] || NOTIZ_KATEGORIEN.session;
    return `<div style="border-left:3px solid ${kat.farbe};padding:6px 10px;margin-bottom:6px;background:#F9FAFB;border-radius:0 4px 4px 0;">
      <div style="display:flex;align-items:center;gap:6px;margin-bottom:3px;">
        <span style="font-size:10px;font-weight:700;color:${kat.farbe};">${renderIcon(kat.icon)} ${kat.label}</span>
        <span style="font-size:10px;color:#95A5A6;margin-left:auto;">${formatDatum(n.datum)}</span>
      </div>
      <div style="font-size:11px;white-space:pre-wrap;line-height:1.5;">${escapeHtml(n.inhalt)}</div>
    </div>`;
  }).join('');

  // -- Ziele Section --
  const zieleHTML = (s.ziele || []).map(z =>
    `<div style="display:flex;align-items:center;gap:6px;padding:3px 0;font-size:11px;">
      <span>${z.erledigt ? '✅' : '☐'}</span>
      <span style="${z.erledigt ? 'text-decoration:line-through;color:#95A5A6;' : ''}">${escapeHtml(z.text)}</span>
    </div>`).join('') || '<p style="color:#95A5A6;font-size:11px;">Keine Ziele definiert</p>';

  // -- Build full report --
  const fenster = window.open('', '_blank');
  fenster.document.write(`<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
    <title>Fallbericht – ${s.vorname} ${s.nachname}</title>
    <style>
      *{box-sizing:border-box;margin:0;padding:0;}
      body{font-family:'Segoe UI',system-ui,sans-serif;color:#1F2937;padding:20px;background:#F0F4F8;line-height:1.5;}
      .seite{width:210mm;background:white;margin:0 auto 20px;padding:14mm 16mm 12mm;box-shadow:0 4px 20px rgba(0,0,0,0.1);}
      .header{border-bottom:3px solid #2C5F8A;padding-bottom:12px;margin-bottom:16px;display:flex;align-items:center;gap:16px;}
      .header-avatar{width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#2C5F8A,#3A7AB8);display:flex;align-items:center;justify-content:center;color:white;font-size:20px;font-weight:700;flex-shrink:0;overflow:hidden;}
      .header-avatar img{width:100%;height:100%;object-fit:cover;}
      h1{font-size:20px;color:#2C5F8A;}
      .meta{font-size:11px;color:#6B7280;margin-top:3px;}
      .stat-row{display:flex;gap:8px;margin:10px 0 14px;flex-wrap:wrap;}
      .stat-chip{padding:3px 10px;border-radius:16px;font-size:10px;font-weight:600;}
      .section{margin-bottom:18px;}
      .section-title{font-size:13px;font-weight:700;color:#2C5F8A;margin-bottom:8px;padding-bottom:3px;border-bottom:1.5px solid #E5E7EB;}
      .print-bar{display:flex;gap:10px;justify-content:flex-end;width:210mm;margin:0 auto 12px;}
      .btn{padding:8px 16px;border-radius:6px;border:none;cursor:pointer;font-size:12px;font-weight:600;}
      .btn-blue{background:#2C5F8A;color:white;}
      .footer{text-align:center;font-size:9px;color:#9CA3AF;padding-top:12px;border-top:1px solid #E5E7EB;margin-top:16px;}
      @media print{body{background:white;padding:0;}.seite{box-shadow:none;margin:0;}.print-bar{display:none;}.seite{page-break-after:always;}.seite:last-child{page-break-after:auto;}}
    </style></head><body>
    <div class="print-bar">
      <button class="btn btn-blue" onclick="window.print()">🖨️ Drucken / PDF speichern</button>
    </div>

    <!-- SEITE 1: Übersicht -->
    <div class="seite">
      <div class="header">
        <div class="header-avatar">${s.foto ? `<img src="${s.foto}" alt="">` : getInitials(s.vorname, s.nachname)}</div>
        <div>
          <h1>Fallbericht — ${s.vorname} ${s.nachname}</h1>
          <div class="meta">Klasse: ${s.klasse || '—'} · ${alter(s.geburtsdatum)} · Seit ${formatDatum(s.eintrittsdatum)} · Erstellt: ${formatDatum(s.erstellt?.split('T')[0])}</div>
        </div>
        <div style="margin-left:auto;text-align:right;">
          <div style="font-size:11px;font-weight:700;color:${s.risiko==='hoch'?'#DC2626':s.risiko==='mittel'?'#D97706':'#059669'};">
            ${s.risiko==='hoch'?'🔴':s.risiko==='mittel'?'🟡':'🟢'} Risiko: ${capitalize(s.risiko||'niedrig')}
          </div>
          <div style="font-size:9px;color:#9CA3AF;margin-top:3px;">CDSE Luxembourg · ${new Date().toLocaleDateString('de-DE')}</div>
        </div>
      </div>

      <div class="stat-row">
        <span class="stat-chip" style="background:#DCFCE7;color:#166534;">✅ ${abgeschlossen} abgeschlossen</span>
        <span class="stat-chip" style="background:#DBEAFE;color:#1D4ED8;">◐ ${inBearbeitung} in Bearbeitung</span>
        <span class="stat-chip" style="background:#FEF3C7;color:#92400E;">💬 ${notizen.length} Notizen</span>
        <span class="stat-chip" style="background:#F3F4F6;color:#374151;">🎯 ${(s.ziele||[]).length} Ziele</span>
        ${screenings.length ? `<span class="stat-chip" style="background:#EDE9FE;color:#5B21B6;">🔍 ${screenings.length} Screening(s)</span>` : ''}
      </div>

      ${s.allgemeineNotizen ? `<div class="section"><div class="section-title">ℹ️ Allgemeine Informationen</div><div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:8px;font-size:11px;">${escapeHtml(s.allgemeineNotizen)}</div></div>` : ''}

      ${screeningHTML}
      ${staerkenHTML}
      ${wbHTML}

      <div class="section">
        <div class="section-title">📋 Bearbeitete Themen</div>
        ${themenHTML || '<p style="color:#9CA3AF;font-size:11px;">Noch keine Themen bearbeitet</p>'}
      </div>

      <div class="section">
        <div class="section-title">🎯 Ziele</div>
        ${zieleHTML}
      </div>

      ${roadmapHTML}

      <div class="footer">Vertraulich · CDSE Bezugsarbeit Tool · Erstellt am ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}</div>
    </div>

    <!-- SEITE 2: Protokolle -->
    ${notizen.length > 0 ? `<div class="seite">
      <div class="section">
        <div class="section-title">💬 Sitzungsprotokolle & Notizen (${Math.min(notizen.length, 15)} von ${notizen.length})</div>
        ${notizenHTML}
      </div>
      <div class="footer">Vertraulich · ${s.vorname} ${s.nachname} · Seite 2</div>
    </div>` : ''}
  </body></html>`);
  fenster.document.close();
}

// ============================================================
// BACKUP / RESTORE
// ============================================================
function exportDaten() {
  const daten = {
    version: 3,
    exportiert: new Date().toISOString(),
    schueler: DB.getSchueler(),
    notizen: DB.getNotizen(),
    termine: DB.getTermine(),
    screenings: DB.getScreenings(),
    roadmaps: DB.getRoadmaps(),
    wohlbefinden: DB.getWohlbefinden(),
    fallformulierungen: DB.getFallformulierungen(),
  };
  const json = JSON.stringify(daten, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cdse-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Daten exportiert', 'success');
}

function importDaten(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const daten = JSON.parse(e.target.result);
      if (!daten.schueler) throw new Error('Ungültiges Format');
      const exportiertAm = daten.exportiert ? new Date(daten.exportiert).toLocaleString('de-LU') : 'unbekannt';
      const antwort = confirm(
        `Datei: ${file.name}\n` +
        `Exportiert am: ${exportiertAm}\n` +
        `Inhalt: ${daten.schueler.length} Schüler, ${daten.notizen?.length || 0} Notizen\n\n` +
        `Zusammenführen mit bestehenden Daten?\n` +
        `(OK = Zusammenführen, Abbrechen = Abbruch)`
      );
      if (!antwort) return;

      // Schüler zusammenführen: neuere Version (geaendert) gewinnt
      const lokalSchueler = DB.getSchueler();
      const lokalMap = new Map(lokalSchueler.map(s => [s.id, s]));
      for (const s of daten.schueler || []) {
        const lokal = lokalMap.get(s.id);
        if (!lokal) {
          lokalMap.set(s.id, s);
        } else {
          const neuererZeitstempel = (s.geaendert || '') > (lokal.geaendert || '');
          if (neuererZeitstempel) lokalMap.set(s.id, s);
        }
      }
      DB.saveSchueler([...lokalMap.values()]);

      // Notizen zusammenführen (nach ID, keine Duplikate)
      const lokalNIds = new Set(DB.getNotizen().map(n => n.id));
      const alleNotizen = [...DB.getNotizen(), ...(daten.notizen || []).filter(n => !lokalNIds.has(n.id))];
      localStorage.setItem(DB.KEYS.NOTIZEN, JSON.stringify(alleNotizen));

      // Termine zusammenführen
      const lokalTIds = new Set(DB.getTermine().map(t => t.id));
      const alleTermine = [...DB.getTermine(), ...(daten.termine || []).filter(t => !lokalTIds.has(t.id))];
      localStorage.setItem(DB.KEYS.TERMINE, JSON.stringify(alleTermine));

      // Screenings zusammenführen
      const lokalSIds = new Set(DB.getScreenings().map(s => s.id));
      const alleScreenings = [...DB.getScreenings(), ...(daten.screenings || []).filter(s => !lokalSIds.has(s.id))];
      localStorage.setItem(DB.KEYS.SCREENINGS, JSON.stringify(alleScreenings));

      // Roadmaps zusammenführen
      const lokalRIds = new Set(DB.getRoadmaps().map(r => r.id));
      const alleRoadmaps = [...DB.getRoadmaps(), ...(daten.roadmaps || []).filter(r => !lokalRIds.has(r.id))];
      localStorage.setItem(DB.KEYS.ROADMAPS, JSON.stringify(alleRoadmaps));

      // Wohlbefinden zusammenführen
      const lokalWIds = new Set(DB.getWohlbefinden().map(w => w.id));
      const alleWb = [...DB.getWohlbefinden(), ...(daten.wohlbefinden || []).filter(w => !lokalWIds.has(w.id))];
      localStorage.setItem(DB.KEYS.WOHLBEFINDEN, JSON.stringify(alleWb));

      // Fallformulierungen (5P) zusammenführen
      if (daten.fallformulierungen) {
        const lokalFFIds = new Set(DB.getFallformulierungen().map(f => f.id));
        const alleFF = [...DB.getFallformulierungen(), ...daten.fallformulierungen.filter(f => !lokalFFIds.has(f.id))];
        localStorage.setItem(DB.KEYS.FALLFORMULIERUNGEN, JSON.stringify(alleFF));
      }

      renderSidebar();
      renderHome();
      showToast(`Import erfolgreich: ${lokalMap.size} Schüler gesamt`, 'success');
    } catch (err) {
      showToast('Fehler beim Import: ' + err.message, 'error');
    }
    event.target.value = '';
  };
  reader.readAsText(file);
}

// ============================================================
// FOTO UPLOAD
// ============================================================
function uploadFoto(schuelerId) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      DB.updateSchueler(schuelerId, { foto: ev.target.result });
      renderProfil(schuelerId);
      renderSidebar();
      showToast('Foto gespeichert', 'success');
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ============================================================
// ONBOARDING-WIZARD — Geführte erste Schritte nach Schüler-Erstellung
// ============================================================

function showOnboardingWizard(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!s) return;

  let currentStep = 0;
  const steps = [
    {
      nr: 1,
      titel: 'Screening durchführen',
      icon: '🔍',
      beschreibung: 'Ein kurzes Screening (5 Min.) erfasst systematisch alle Entwicklungsbereiche und identifiziert Handlungsbedarf.',
      aktion: 'Screening starten',
      aktionFn: () => {
        closeOnboardingWizard();
        showProfilTab('screening');
      }
    },
    {
      nr: 2,
      titel: '5P-Fallformulierung',
      icon: '🧩',
      beschreibung: 'Ordne die Befunde in das 5P-Modell ein: Presenting, Predisposing, Precipitating, Perpetuating, Protective.',
      aktion: '5P-Analyse öffnen',
      aktionFn: () => {
        closeOnboardingWizard();
        showProfilTab('fallformulierung');
      }
    },
    {
      nr: 3,
      titel: 'Stärken erfassen',
      icon: '💪',
      beschreibung: 'Welche Stärken und Ressourcen bringt der Jugendliche mit? Diese bilden die Basis für die Förderung.',
      aktion: 'Stärken bewerten',
      aktionFn: () => {
        closeOnboardingWizard();
        showProfilTab('staerken');
      }
    },
    {
      nr: 4,
      titel: 'Förderplan generieren',
      icon: '🗺️',
      beschreibung: 'Basierend auf dem Screening wird ein individueller Förderplan mit 7 Phasen erstellt — der rote Faden für die gesamte Begleitung.',
      aktion: 'Förderplan erstellen',
      aktionFn: () => {
        closeOnboardingWizard();
        showProfilTab('roadmap');
      }
    }
  ];

  function renderStep() {
    const step = steps[currentStep];
    const progressDots = steps.map((st, i) =>
      `<span class="onboarding-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}">${i < currentStep ? '✓' : st.nr}</span>`
    ).join('');

    const overlay = document.getElementById('onboarding-overlay') || createOnboardingOverlay();
    overlay.querySelector('.onboarding-content').innerHTML = `
      <div class="onboarding-header">
        <h3>Willkommen! Erste Schritte für ${s.vorname}</h3>
        <button class="btn-icon" onclick="closeOnboardingWizard()" title="Schließen">&times;</button>
      </div>
      <div class="onboarding-progress">${progressDots}</div>
      <div class="onboarding-step">
        <div class="onboarding-step-icon">${step.icon}</div>
        <h4>Schritt ${step.nr}/4: ${step.titel}</h4>
        <p>${step.beschreibung}</p>
      </div>
      <div class="onboarding-actions">
        <button class="btn btn-primary" onclick="onboardingAction()">${step.aktion}</button>
        <button class="btn btn-secondary" onclick="onboardingSkip()">${currentStep < steps.length - 1 ? 'Überspringen' : 'Später erledigen'}</button>
      </div>
      <div class="onboarding-hint">
        <small>Du kannst jeden Schritt jederzeit im Profil nachholen.</small>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  function createOnboardingOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'onboarding-overlay';
    overlay.className = 'onboarding-overlay';
    overlay.innerHTML = '<div class="onboarding-content"></div>';
    document.body.appendChild(overlay);
    return overlay;
  }

  window.onboardingAction = () => {
    steps[currentStep].aktionFn();
  };

  window.onboardingSkip = () => {
    currentStep++;
    if (currentStep >= steps.length) {
      closeOnboardingWizard();
      showToast('Onboarding abgeschlossen — alle Schritte sind jederzeit im Profil verfügbar', 'info');
    } else {
      renderStep();
    }
  };

  window.closeOnboardingWizard = () => {
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.remove();
  };

  renderStep();
}

// ============================================================
// AKUTES THEMA — Quick-Entry System
// ============================================================

// Fuzzy-Suche über alle Themen
function searchThemen(query) {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results = [];
  for (const kat of THEMEN_KATEGORIEN) {
    for (const t of kat.themen) {
      const haystack = (t.id + ' ' + t.titel + ' ' + t.beschreibung).toLowerCase();
      if (haystack.includes(q)) {
        results.push({ ...t, katId: kat.id, katTitel: kat.titel, farbe: kat.farbe });
      }
    }
  }
  return results.slice(0, 8);
}

// Reverse-Map: Thema → Screening-Domains
function getDomainsForThema(themaId) {
  return Object.entries(SCREENING_THEMA_MAP)
    .filter(([domId, themen]) => themen.includes(themaId))
    .map(([domId]) => SCREENING_DOMAINS.find(d => d.id === domId))
    .filter(Boolean);
}

// Verknüpfte Themen aus SCREENING_THEMA_MAP
function getRelatedThemen(themaId) {
  const domains = getDomainsForThema(themaId);
  const related = new Set();
  for (const dom of domains) {
    for (const tid of (SCREENING_THEMA_MAP[dom.id] || [])) {
      if (tid !== themaId) related.add(tid);
    }
  }
  return [...related].slice(0, 6);
}

// Thema-Titel aus ID finden
function getThemaTitel(themaId) {
  for (const kat of THEMEN_KATEGORIEN) {
    const t = kat.themen.find(th => th.id === themaId);
    if (t) return t.titel;
  }
  return themaId;
}

// Quick-Entry: Suche rendern
function renderQuickEntry(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
    <div class="quick-entry">
      <div class="quick-entry-header">
        ${icon('bolt', 18)} <strong>Akutes Thema</strong>
        <span style="font-size:11px;color:var(--text-muted);margin-left:6px;">Was beschäftigt den Jugendlichen?</span>
      </div>
      <div class="quick-entry-search-wrap">
        <input type="text" id="quick-entry-input" class="quick-entry-input"
          placeholder="Thema eingeben z.B. Mobbing, Angst, Streit mit Eltern..."
          oninput="onQuickEntryInput(this.value)"
          autocomplete="off" />
        <div id="quick-entry-results" class="quick-entry-results"></div>
      </div>
    </div>
  `;
}

// Suche bei Eingabe
function onQuickEntryInput(query) {
  const resultsEl = document.getElementById('quick-entry-results');
  if (!resultsEl) return;

  const results = searchThemen(query);
  if (results.length === 0) {
    resultsEl.innerHTML = query.length >= 2
      ? '<div class="quick-entry-empty">Kein Thema gefunden. Versuche andere Stichwörter.</div>'
      : '';
    resultsEl.style.display = query.length >= 2 ? 'block' : 'none';
    return;
  }

  resultsEl.style.display = 'block';
  resultsEl.innerHTML = results.map(r => `
    <div class="quick-entry-item" onclick="showQuickEntryPanel('${r.id}', '${r.katId}')">
      <span class="quick-entry-dot" style="background:${r.farbe};"></span>
      <div>
        <div class="quick-entry-titel">${r.titel}</div>
        <div class="quick-entry-desc">${r.beschreibung}</div>
      </div>
      <span class="quick-entry-kat">${r.katTitel}</span>
    </div>
  `).join('');
}

// Aktionspanel für gewähltes Thema
function showQuickEntryPanel(themaId, katId) {
  // Suche schließen
  const resultsEl = document.getElementById('quick-entry-results');
  if (resultsEl) resultsEl.style.display = 'none';
  const inputEl = document.getElementById('quick-entry-input');
  if (inputEl) inputEl.value = '';

  const kat = THEMEN_KATEGORIEN.find(k => k.id === katId);
  const thema = kat ? kat.themen.find(t => t.id === themaId) : null;
  if (!thema) return;

  // Arbeitsblätter & Module
  const arbeitsblaetter = ARBEITSBLÄTTER[themaId] || [];
  const therapieModul = THERAPIE_MODULE_DATEIEN[themaId];
  const fachkraftModul = FACHKRAFT_MODULE_DATEIEN[themaId];

  // Verknüpfte Themen
  const related = getRelatedThemen(themaId);
  const domains = getDomainsForThema(themaId);

  // Screening-Status prüfen
  const sid = APP.currentSchuelerId;
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  let screeningInfo = '';
  if (screenings.length > 0 && domains.length > 0) {
    const latest = screenings[screenings.length - 1];
    screeningInfo = domains.map(d => {
      const score = latest.scores[d.id] || 0;
      const max = d.items.length * 3;
      const flagged = score >= d.cutoff && d.cutoff > 0;
      return `<span style="display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:12px;font-size:11px;
        background:${flagged ? d.farbe + '18' : '#F3F4F6'};
        color:${flagged ? d.farbe : '#6B7280'};
        border:1px solid ${flagged ? d.farbe + '40' : '#E5E7EB'};">
        ${flagged ? '⚠' : '✓'} ${d.label}: ${score}/${max}
      </span>`;
    }).join(' ');
  }

  // Prüfe ob schon im Förderplan
  const roadmap = DB.getRoadmap(sid);
  let inRoadmap = false;
  if (roadmap) {
    inRoadmap = roadmap.phasen.some(p => p.themen && p.themen.some(t => (typeof t === 'string' ? t : t.id) === themaId));
  }

  // Status des Themas
  const s = DB.getSchuelerById(sid);
  const currentStatus = (s.topicStatus || {})[themaId] || 'nicht-begonnen';

  // Panel erstellen
  const panel = document.createElement('div');
  panel.className = 'modal-overlay';
  panel.id = 'quick-entry-panel';
  panel.onclick = e => { if (e.target === panel) panel.remove(); };
  panel.innerHTML = `
    <div class="modal" style="max-width:600px;">
      <div class="modal-header" style="border-left:4px solid ${kat.farbe};">
        <div>
          <div style="font-size:11px;color:${kat.farbe};font-weight:600;">${kat.titel}</div>
          <div class="modal-title" style="font-size:16px;">${icon('bolt', 20)} ${thema.titel}</div>
        </div>
        <button class="modal-close" onclick="document.getElementById('quick-entry-panel').remove()">✕</button>
      </div>
      <div class="modal-body" style="max-height:70vh;overflow-y:auto;">
        <p style="font-size:13px;color:var(--text-light);margin-bottom:16px;">${thema.beschreibung}</p>

        <!-- Handlungsweg -->
        <div style="background:#F0F9FF;border:1px solid #BAE6FD;border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
          <div style="font-weight:700;font-size:13px;color:#0369A1;margin-bottom:10px;">${icon('clipboard', 16)} Sofort-Handlungsweg</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${arbeitsblaetter.length > 0 ? arbeitsblaetter.map(ab => `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="width:20px;height:20px;border-radius:50%;background:#0369A1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">1</span>
                <span><strong>Arbeitsblatt:</strong> ${ab.titel}</span>
                <a href="arbeitsblaetter/${ab.datei}" target="_blank" style="margin-left:auto;color:#0369A1;font-size:11px;">Öffnen →</a>
              </div>
            `).join('') : '<div style="font-size:12px;color:#6B7280;">Kein Arbeitsblatt verfügbar</div>'}
            ${therapieModul ? `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="width:20px;height:20px;border-radius:50%;background:#0369A1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">2</span>
                <span><strong>Therapiemodul:</strong> Detaillierter Sitzungsleitfaden</span>
                <a href="therapie-module/${therapieModul}" target="_blank" style="margin-left:auto;color:#0369A1;font-size:11px;">Öffnen →</a>
              </div>
            ` : ''}
            ${fachkraftModul ? `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="width:20px;height:20px;border-radius:50%;background:#0369A1;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">3</span>
                <span><strong>Fachkraft-Hintergrund:</strong> Klinisches Wissen</span>
                <a href="fachkraft-module/${fachkraftModul}" target="_blank" style="margin-left:auto;color:#0369A1;font-size:11px;">Öffnen →</a>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Verknüpfte Bereiche -->
        ${related.length > 0 ? `
        <div style="margin-bottom:14px;">
          <div style="font-weight:600;font-size:12px;color:var(--text-secondary);margin-bottom:6px;">${icon('users', 14)} Verknüpfte Bereiche (häufig zusammen betroffen)</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${related.map(rid => {
              const rTitel = getThemaTitel(rid);
              return `<span style="padding:3px 10px;border-radius:12px;font-size:11px;background:#F3F4F6;color:#374151;border:1px solid #E5E7EB;">${rTitel}</span>`;
            }).join('')}
          </div>
        </div>
        ` : ''}

        <!-- Screening-Relevanz -->
        ${screeningInfo ? `
        <div style="margin-bottom:14px;">
          <div style="font-weight:600;font-size:12px;color:var(--text-secondary);margin-bottom:6px;">${icon('chart', 14)} Screening-Relevanz</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">${screeningInfo}</div>
        </div>
        ` : domains.length > 0 ? `
        <div style="margin-bottom:14px;padding:8px 12px;background:#FFFBEB;border:1px solid #FDE68A;border-radius:6px;font-size:12px;color:#92400E;">
          ${icon('info', 14)} Betrifft Screening-Domäne(n): <strong>${domains.map(d => d.label).join(', ')}</strong> — Kein Screening vorhanden, bitte durchführen.
        </div>
        ` : ''}

        <!-- Status -->
        <div style="padding:8px 12px;background:#F9FAFB;border-radius:6px;font-size:12px;color:var(--text-light);margin-bottom:6px;">
          Status: <strong>${THEMA_STATUS[currentStatus].label}</strong>
          ${inRoadmap ? ' · Bereits im Förderplan' : ' · Noch nicht im Förderplan'}
        </div>
      </div>

      <div class="modal-footer" style="display:flex;gap:8px;flex-wrap:wrap;">
        ${!inRoadmap ? `<button class="btn btn-primary btn-sm" onclick="quickAddThema('${themaId}');document.getElementById('quick-entry-panel').remove();">
          ${icon('plus', 14)} In Förderplan aufnehmen
        </button>` : `<button class="btn btn-secondary btn-sm" disabled style="opacity:0.5;">Bereits im Förderplan</button>`}
        <button class="btn btn-secondary btn-sm" onclick="quickStartSession('${themaId}');document.getElementById('quick-entry-panel').remove();">
          ${icon('pencil', 14)} Sitzung dazu starten
        </button>
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('quick-entry-panel').remove();openThemaPanel('${katId}','${themaId}');">
          ${icon('external-link', 14)} Thema öffnen
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(panel);
}

// Quick-Entry: Thema in Förderplan aufnehmen + 5P aktualisieren
function quickAddThema(themaId) {
  const sid = APP.currentSchuelerId;

  // 1. Status auf in-bearbeitung
  setThemaStatus(themaId, 'in-bearbeitung');

  // 2. In aktive Phase des Förderplans aufnehmen
  let roadmap = DB.getRoadmap(sid);
  if (roadmap) {
    const aktivePhase = roadmap.phasen.find(p => p.status === 'aktiv')
                     || roadmap.phasen.find(p => p.nr === 4);
    if (aktivePhase) {
      const already = aktivePhase.themen && aktivePhase.themen.some(t => (typeof t === 'string' ? t : t.id) === themaId);
      if (!already) {
        if (!aktivePhase.themen) aktivePhase.themen = [];
        aktivePhase.themen.push(themaId);
        DB.saveRoadmap(roadmap);
      }
    }
  }

  // 3. In 5P Presenting aufnehmen
  let ff = DB.getFallformulierung(sid);
  if (ff) {
    const domains = getDomainsForThema(themaId);
    for (const dom of domains) {
      if (!ff.presenting) ff.presenting = [];
      if (!ff.presenting.includes(dom.label)) {
        ff.presenting.push(dom.label);
        DB.saveFallformulierung(ff);
      }
    }
  }

  const titel = getThemaTitel(themaId);
  showToast(`"${titel}" in Förderplan aufgenommen & 5P aktualisiert`, 'success');

  // Refresh
  if (typeof renderRoadmap === 'function') renderRoadmap();
  if (typeof renderDashboard === 'function') renderDashboard();
}

// Quick-Entry: Sitzung mit Thema starten
function quickStartSession(themaId) {
  // Zum Notiz-Tab wechseln und Thema vorausfüllen
  showProfilTab('notizbuch');
  setTimeout(() => {
    // Protokoll-Modus aktivieren
    const protTab = document.querySelector('[onclick*="toggleNotizModus(\'protokoll\')"]');
    if (protTab) protTab.click();
    setTimeout(() => {
      const themaSelect = document.getElementById('prot-thema-id');
      if (themaSelect) themaSelect.value = themaId;
    }, 100);
  }, 200);
}

// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;
  // "Heute"-Ansicht: Nur das Wesentliche für den Arbeitstag
  renderSitzungsvorschlag();
  renderNaechsteSchritte();
  renderPhaseTransitionPrompt();
  renderRueckschrittAlert();
  renderWohlbefinden();
  renderDashKalender();
  renderDashTodo();
  renderNotizbuch();
  // Kompakte Zusammenfassung statt Informationsflut
  renderDashboardSummary();
  renderQuickEntry('quick-entry-dashboard');
  // Hypothesen + Treatment-Response jetzt unter "Analyse"-Tab
}

// ---- HYPOTHESEN → 5P ÜBERTRAGUNG ----
function openHypothesen5PModal() {
  const hypothesen = generateHypothesen(APP.currentSchuelerId);
  if (hypothesen.length === 0) {
    showToast('Keine aktiven Hypothesen vorhanden', 'warning');
    return;
  }

  // 5P-Mapping: welcher Hypothesen-Typ → welches 5P-Feld
  const typMapping = {
    risiko: { primary: 'predisposing', label: 'Predisposing (Vulnerabilität)' },
    schutz: { primary: 'protective', label: 'Protective (Schutzfaktoren)' },
    differenzial: { primary: 'presenting', label: 'Presenting (Aktuelles Bild)' },
  };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'hypothesen-5p-modal';
  overlay.innerHTML = `
    <div class="modal" style="max-width:600px;max-height:80vh;">
      <div class="modal-header">
        <span>🔀</span>
        <span>Hypothesen → 5P-Analyse übernehmen</span>
        <button class="modal-close" onclick="document.getElementById('hypothesen-5p-modal').remove()">✕</button>
      </div>
      <div class="modal-body" style="overflow-y:auto;max-height:55vh;">
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
          Wähle die Hypothesen aus, die in die 5P-Fallformulierung übernommen werden sollen.
          Risiko-Hypothesen → Predisposing, Schutzfaktoren → Protective, Differenzial → Presenting.
        </p>
        ${hypothesen.map((h, i) => {
          const mapping = typMapping[h.typ] || typMapping.risiko;
          const icon = h.typ === 'schutz' ? '🛡️' : h.typ === 'differenzial' ? '🔀' : '⚠️';
          return `
            <label class="hypo-5p-item" style="display:flex;gap:10px;padding:8px;border-radius:6px;cursor:pointer;margin-bottom:4px;border:1px solid var(--border);">
              <input type="checkbox" value="${i}" class="hypo-5p-check" data-typ="${h.typ}" checked>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:500;">${icon} ${h.titel}</div>
                <div style="font-size:11px;color:var(--text-muted);">→ ${mapping.label}</div>
              </div>
              <select class="hypo-5p-ziel" data-idx="${i}" style="font-size:11px;padding:2px 6px;border-radius:4px;border:1px solid var(--border);">
                <option value="presenting" ${h.typ === 'differenzial' ? 'selected' : ''}>Presenting</option>
                <option value="predisposing" ${h.typ === 'risiko' ? 'selected' : ''}>Predisposing</option>
                <option value="precipitating">Precipitating</option>
                <option value="perpetuating">Perpetuating</option>
                <option value="protective" ${h.typ === 'schutz' ? 'selected' : ''}>Protective</option>
              </select>
            </label>
          `;
        }).join('')}
      </div>
      <div class="modal-footer" style="display:flex;justify-content:flex-end;gap:8px;padding:16px;">
        <button class="btn btn-secondary" onclick="document.getElementById('hypothesen-5p-modal').remove()">Abbrechen</button>
        <button class="btn btn-primary" onclick="transferHypothesen5P()">✓ Übernehmen</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function transferHypothesen5P() {
  const hypothesen = generateHypothesen(APP.currentSchuelerId);
  const checks = document.querySelectorAll('.hypo-5p-check:checked');
  if (checks.length === 0) {
    showToast('Keine Hypothesen ausgewählt', 'warning');
    return;
  }

  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) {
    ff = DB.createFallformulierung(sid);
  }

  let count = 0;
  checks.forEach(cb => {
    const idx = parseInt(cb.value);
    const h = hypothesen[idx];
    if (!h) return;

    const zielSelect = document.querySelector(`.hypo-5p-ziel[data-idx="${idx}"]`);
    const ziel = zielSelect ? zielSelect.value : 'predisposing';

    if (!ff[ziel]) ff[ziel] = [];

    // Nicht doppelt einfügen
    const text = h.titel;
    if (!ff[ziel].includes(text)) {
      ff[ziel].push(text);
      count++;
    }
  });

  DB.saveFallformulierung(ff);
  document.getElementById('hypothesen-5p-modal').remove();
  showToast(`${count} Hypothese${count !== 1 ? 'n' : ''} in 5P-Analyse übernommen`, 'success');
}

// ---- DASHBOARD HYPOTHESEN — Kompakte Übersicht ----
function renderDashboardHypothesen() {
  const container = document.getElementById('dashboard-hypothesen-widget');
  if (!container) return;

  const hypothesen = generateHypothesen(APP.currentSchuelerId);
  if (hypothesen.length === 0) {
    container.innerHTML = '';
    return;
  }

  const risiken = hypothesen.filter(h => h.typ === 'risiko');
  const schutz = hypothesen.filter(h => h.typ === 'schutz');
  const differenzial = hypothesen.filter(h => h.typ === 'differenzial');
  const kritisch = risiken.filter(h => h.staerkeWert >= 3);

  function miniCard(h) {
    let borderColor;
    if (h.typ === 'schutz') borderColor = '#22C55E';
    else if (h.typ === 'differenzial') borderColor = '#8B5CF6';
    else if (h.staerkeWert >= 3) borderColor = '#EF4444';
    else if (h.staerkeWert >= 2) borderColor = '#F59E0B';
    else borderColor = '#9CA3AF';

    const icon = h.typ === 'schutz' ? '🛡️' : h.typ === 'differenzial' ? '🔀' : h.staerkeWert >= 3 ? '🔴' : h.staerkeWert >= 2 ? '🟡' : '⚪';

    return `<div class="dash-hypo-mini" style="border-left:3px solid ${borderColor}" title="${h.erklaerung}">${icon} ${h.titel}</div>`;
  }

  container.innerHTML = `
    <div class="card" style="margin-bottom:16px;">
      <div class="card-header">
        <span>🧠</span>
        <div class="card-title">Klinische Hypothesen</div>
        <span class="dash-hypo-count">${hypothesen.length} aktiv</span>
      </div>
      <div class="card-body">
        ${kritisch.length > 0 ? `
          <div class="dash-hypo-alert">
            ⚠️ <strong>${kritisch.length} kritische Hypothese${kritisch.length > 1 ? 'n' : ''}:</strong>
            ${kritisch.map(h => h.titel).join(', ')}
          </div>
        ` : ''}
        <div class="dash-hypo-grid">
          ${hypothesen.slice(0, 6).map(miniCard).join('')}
          ${hypothesen.length > 6 ? `<div class="dash-hypo-more">+ ${hypothesen.length - 6} weitere</div>` : ''}
        </div>
        ${renderDashboardHypoThemen(hypothesen)}
        <div style="text-align:center;margin-top:10px;">
          <button class="btn btn-sm btn-secondary" onclick="showPhase('sammeln');setTimeout(()=>showSubTab('info'),100)">
            Alle Hypothesen ansehen →
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderDashboardHypoThemen(hypothesen) {
  if (typeof HYPOTHESEN_THEMA_MAP === 'undefined') return '';
  const topRisiken = hypothesen.filter(h => h.typ === 'risiko' && h.wiki_ids).slice(0, 3);
  if (topRisiken.length === 0) return '';

  const themenSet = new Set();
  const themen = [];
  for (const h of topRisiken) {
    for (const wid of h.wiki_ids) {
      const mapped = HYPOTHESEN_THEMA_MAP[wid] || [];
      for (const tid of mapped) {
        if (!themenSet.has(tid)) {
          themenSet.add(tid);
          const found = findThemaInKategorien(tid);
          if (found) themen.push(found);
        }
      }
    }
  }
  if (themen.length === 0) return '';

  return `
    <div style="margin-top:10px;padding:8px 10px;background:var(--bg-elevated);border-radius:8px;border:1px dashed var(--primary);">
      <div style="font-size:11px;font-weight:600;color:var(--primary);margin-bottom:6px;">🎯 Empfohlene Themen aus Hypothesen</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;">
        ${themen.slice(0, 5).map(t =>
          `<button class="btn btn-xs btn-outline-primary" onclick="quickStartSession('${t.id}')" style="font-size:11px;">${t.titel}</button>`
        ).join('')}
      </div>
    </div>
  `;
}

// ---- DASHBOARD: TREATMENT-RESPONSE KOMPAKT ----
function renderDashboardTreatmentResponse() {
  const el = document.getElementById('dashboard-treatment-widget');
  if (!el) return;

  const analyse = analyzeTreatmentResponse(APP.currentSchuelerId);
  if (analyse.themen.length === 0) {
    el.innerHTML = '';
    return;
  }

  const trendIcon = (t) => t === 'steigend' ? '📈' : t === 'fallend' ? '📉' : '➡️';
  const responseColor = (r) => r >= 75 ? '#22C55E' : r >= 50 ? '#F59E0B' : '#EF4444';

  el.innerHTML = `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header">
        <span>💊</span>
        <div class="card-title">Treatment-Response</div>
      </div>
      <div class="card-body" style="padding:10px 14px;">
        ${analyse.bestesThema ? `
          <div style="font-size:12px;margin-bottom:8px;padding:6px 10px;background:#F0FDF4;border-radius:6px;color:#166534;">
            ✨ <strong>Respondiert gut auf: ${analyse.bestesThema.label}</strong> (${analyse.bestesThema.responseRate}%)
          </div>
        ` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${analyse.themen.slice(0, 5).map(t => `
            <span class="dash-treatment-chip" style="border-left:3px solid ${responseColor(t.responseRate)}">
              ${t.label} <small>${t.responseRate}% ${trendIcon(t.trend)}</small>
            </span>
          `).join('')}
        </div>
        ${analyse.gesamtTrend ? `
          <div style="font-size:11px;color:var(--text-muted);margin-top:6px;">
            Gesamt-SRS: ${analyse.gesamtTrend.richtung} (${analyse.gesamtTrend.diff > 0 ? '+' : ''}${analyse.gesamtTrend.diff})
          </div>
        ` : ''}
        ${analyse.besterAnsatz ? `
          <div style="font-size:11px;margin-top:6px;padding:4px 8px;background:#F0F9FF;border-radius:4px;color:#0C4A6E;">
            🧪 Bester Ansatz: <strong>${analyse.besterAnsatz.ansatz}</strong> (${analyse.besterAnsatz.responseRate}%)
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

// ---- DASHBOARD: SCREENING-DELTA KOMPAKT ----
function renderDashboardScreeningDelta() {
  const el = document.getElementById('dashboard-screening-delta-widget');
  if (!el) return;

  const screenings = DB.getScreenings(APP.currentSchuelerId).filter(s => s.abgeschlossen);
  if (screenings.length < 2) {
    el.innerHTML = '';
    return;
  }

  screenings.sort((a, b) => a.erstellt.localeCompare(b.erstellt));
  const erstes = screenings[0];
  const letztes = screenings[screenings.length - 1];
  const domains = typeof SCREENING_DOMAINS !== 'undefined' ? SCREENING_DOMAINS : [];

  const alleDomainIds = [...new Set([...Object.keys(erstes.scores || {}), ...Object.keys(letztes.scores || {})])];

  const deltas = alleDomainIds.map(domId => {
    const domain = domains.find(d => d.id === domId);
    const s1 = (erstes.scores || {})[domId] || 0;
    const s2 = (letztes.scores || {})[domId] || 0;
    const diff = s2 - s1;
    const prozent = s1 > 0 ? Math.round((diff / s1) * 100) : 0;
    return { domId, label: domain?.label || domId, s1, s2, diff, prozent, farbe: domain?.farbe || '#9CA3AF' };
  }).filter(d => d.s1 > 0 || d.s2 > 0);

  const signifikant = deltas.filter(d => Math.abs(d.prozent) >= 15);
  if (signifikant.length === 0 && deltas.length === 0) {
    el.innerHTML = '';
    return;
  }

  const t1Label = `T1 (${new Date(erstes.erstellt).toLocaleDateString('de-CH')})`;
  const tNLabel = `T${screenings.length} (${new Date(letztes.erstellt).toLocaleDateString('de-CH')})`;

  el.innerHTML = `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header">
        <span>📊</span>
        <div class="card-title">Screening-Delta</div>
        <span style="font-size:11px;color:var(--text-muted);margin-left:auto;">${t1Label} → ${tNLabel}</span>
      </div>
      <div class="card-body" style="padding:10px 14px;">
        ${signifikant.length > 0 ? `
          <div style="display:flex;flex-direction:column;gap:3px;margin-bottom:6px;">
            ${signifikant.map(d => {
              const icon = d.diff < 0 ? '↓' : '↑';
              const color = d.diff < 0 ? '#22C55E' : '#EF4444';
              return `<span style="font-size:12px;color:${color}">${icon} ${d.label}: ${d.diff < 0 ? '' : '+'}${d.prozent}%</span>`;
            }).join('')}
          </div>
        ` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          ${deltas.map(d => {
            const diffLabel = d.diff > 0 ? `+${d.diff}` : `${d.diff}`;
            const bg = d.diff < 0 ? '#F0FDF4' : d.diff > 0 ? '#FEF2F2' : '#F9FAFB';
            return `<span class="dash-screening-chip" style="background:${bg};border-left:2px solid ${d.farbe}">${d.label}: ${d.s2} (${diffLabel})</span>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ---- DASHBOARD SUMMARY — "Alles auf einen Blick" ----
function renderDashboardSummary() {
  const container = document.getElementById('dashboard-summary-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) { container.innerHTML = ''; return; }

  const roadmap = DB.getRoadmap(sid);
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  const ziele = s.ziele || [];
  const notizen = DB.getNotizen(sid);

  // Roadmap-Status
  let phaseText = '—';
  let phaseNr = '—';
  let phasePct = 0;
  let phaseFarbe = '#6B7280';
  if (roadmap) {
    const aktiv = roadmap.phasen.find(p => p.status === 'aktiv');
    if (aktiv) {
      const def = ROADMAP_PHASEN[aktiv.nr] || {};
      phaseNr = aktiv.nr;
      phaseText = def.titel || 'Phase ' + aktiv.nr;
      phaseFarbe = def.farbe || '#6B7280';
      const total = aktiv.themen ? aktiv.themen.length : 0;
      const done = aktiv.themen ? aktiv.themen.filter(t => aktiv.themenStatus && aktiv.themenStatus[t] === 'erledigt').length : 0;
      phasePct = total > 0 ? Math.round(done / total * 100) : 0;
    }
  }

  // Screening-Status
  let scrFlagged = 0;
  let scrTotal = 0;
  if (screenings.length > 0) {
    const latest = screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
    for (const domId in latest.scores) {
      const dom = SCREENING_DOMAINS.find(d => d.id === domId);
      if (dom && !dom.invertiert) {
        scrTotal++;
        if (latest.scores[domId] >= dom.cutoff) scrFlagged++;
      }
    }
  }

  // Ziele-Fortschritt
  const avgZiel = ziele.length > 0 ? Math.round(ziele.reduce((sum, z) => sum + (z.fortschritt || (z.erledigt ? 100 : 0)), 0) / ziele.length) : 0;
  const zielFarbe = avgZiel >= 70 ? '#22C55E' : (avgZiel >= 30 ? '#F59E0B' : '#EF4444');

  // Sitzungen
  const sitzungsCount = notizen.length;
  const lastSitzung = notizen.length > 0 ? notizen.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0] : null;
  const tageText = lastSitzung ? Math.round((Date.now() - new Date(lastSitzung.datum)) / 86400000) + ' Tage her' : '—';

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin-bottom:14px;">
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px;border-top:3px solid ${phaseFarbe};text-align:center;cursor:pointer;" onclick="showProfilTab('roadmap')">
        <div style="font-size:22px;margin-bottom:4px;">🗺️</div>
        <div style="font-size:11px;color:#6B7280;">Aktive Phase</div>
        <div style="font-size:16px;font-weight:700;color:${phaseFarbe};">${phaseNr}: ${phaseText}</div>
        <div style="height:4px;background:#E5E7EB;border-radius:2px;margin-top:6px;"><div style="height:100%;width:${phasePct}%;background:${phaseFarbe};border-radius:2px;"></div></div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${phasePct}% erledigt</div>
      </div>
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px;border-top:3px solid ${scrFlagged > 0 ? '#EF4444' : '#22C55E'};text-align:center;cursor:pointer;" onclick="showProfilTab('screening')">
        <div style="font-size:22px;margin-bottom:4px;">📊</div>
        <div style="font-size:11px;color:#6B7280;">Screening</div>
        <div style="font-size:16px;font-weight:700;color:${scrFlagged > 0 ? '#EF4444' : '#22C55E'};">${screenings.length === 0 ? 'Ausstehend' : scrFlagged + ' auffällig'}</div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${screenings.length > 0 ? 'von ' + scrTotal + ' Bereichen' : 'Noch kein Screening'}</div>
      </div>
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px;border-top:3px solid ${zielFarbe};text-align:center;cursor:pointer;" onclick="showPhase('leitfaden','roadmap')">
        <div style="font-size:22px;margin-bottom:4px;">🎯</div>
        <div style="font-size:11px;color:#6B7280;">Ziele</div>
        <div style="font-size:16px;font-weight:700;color:${zielFarbe};">${ziele.length === 0 ? 'Keine' : avgZiel + '%'}</div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${ziele.length} Ziel${ziele.length !== 1 ? 'e' : ''} definiert</div>
      </div>
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px;border-top:3px solid #6366F1;text-align:center;cursor:pointer;" onclick="showProfilTab('notizen')">
        <div style="font-size:22px;margin-bottom:4px;">📝</div>
        <div style="font-size:11px;color:#6B7280;">Sitzungen</div>
        <div style="font-size:16px;font-weight:700;color:#6366F1;">${sitzungsCount}</div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">Letzte: ${tageText}</div>
      </div>
    </div>
  `;
}

// ---- SITZUNGSVORSCHLAG — "Heute empfohlen" ----
function renderSitzungsvorschlag() {
  const container = document.getElementById('sitzungsvorschlag-widget');
  if (!container) return;

  const sid = APP.currentSchuelerId;
  const roadmap = DB.getRoadmap(sid);
  if (!roadmap) { container.innerHTML = ''; return; }

  // Letzten PVT-Zustand ermitteln
  const notizen = DB.getNotizen(sid)
    .filter(n => n.soap && n.soap.pvt)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const lastPVT = notizen.length > 0 ? notizen[0].soap.pvt : null;

  // Aktive Phase finden
  const aktivePhase = roadmap.phasen.find(p => p.status === 'aktiv');
  if (!aktivePhase) { container.innerHTML = ''; return; }

  // PVT-Override: Bei "frozen" immer Grounding empfehlen
  const pvtLabels = { safe: '🟢 Sicher & offen', activated: '🟡 Angespannt', frozen: '🟣 Eingefroren' };
  const groundingThemen = ['krisenintervention', 'trauma', 'emotionserkennung', 'stress-angst'];
  const coregThemen = ['emotionsregulation', 'stress-angst', 'impulskontrolle', 'wut'];

  let empfohlenesThema = null;
  let empfGrund = '';
  let pvtOverride = false;

  if (lastPVT === 'frozen') {
    // Grounding-Thema empfehlen
    pvtOverride = true;
    for (const tid of groundingThemen) {
      const found = findThemaInKategorien(tid);
      if (found) { empfohlenesThema = found; break; }
    }
    empfGrund = 'PVT-Zustand: Eingefroren — Grounding/Stabilisierung empfohlen';
  } else if (lastPVT === 'activated') {
    // Co-Regulation prüfen, aber Phase-Thema bevorzugen wenn vorhanden
    const phaseThema = findNextPhaseThema(aktivePhase, sid);
    if (phaseThema) {
      empfohlenesThema = phaseThema;
      empfGrund = `Nächstes Thema aus Phase ${aktivePhase.nr} (${aktivePhase.titel || ROADMAP_PHASEN[aktivePhase.nr]?.titel || ''})`;
    } else {
      for (const tid of coregThemen) {
        const found = findThemaInKategorien(tid);
        if (found) { empfohlenesThema = found; break; }
      }
      empfGrund = 'PVT-Zustand: Angespannt — Co-Regulation empfohlen';
      pvtOverride = true;
    }
  } else {
    // Normal: nächstes Phase-Thema
    const phaseThema = findNextPhaseThema(aktivePhase, sid);
    if (phaseThema) {
      empfohlenesThema = phaseThema;
      empfGrund = `Nächstes Thema aus Phase ${aktivePhase.nr} (${aktivePhase.titel || ROADMAP_PHASEN[aktivePhase.nr]?.titel || ''})`;
    }
  }

  if (!empfohlenesThema) { container.innerHTML = ''; return; }

  // ── Sequenzierungs-Guard (K7): Bestimmte Themen NUR nach Voraussetzungen ──
  const SEQUENZ_REGELN = [
    { thema: 'trauma', voraussetzung: ['krisenintervention', 'emotionsregulation'],
      warnung: 'Traumaverarbeitung erst nach Stabilisierung (ISTSS 2019)' },
    { thema: 'angstanfaelle', voraussetzung: ['stress-angst', 'emotionsregulation'],
      warnung: 'Exposition erst nach Psychoedukation + Regulationsfertigkeiten' },
    { thema: 'dissoziative-erfahrungen', voraussetzung: ['emotionserkennung', 'krisenintervention'],
      warnung: 'Dissoziationsarbeit erst nach Grounding-Fertigkeiten' },
    { thema: 'suizidpraevention', voraussetzung: ['krisenintervention'],
      warnung: 'Suizidpräventive Arbeit erst nach Krisenplan-Erstellung' },
  ];
  let sequenzWarnung = '';
  if (!pvtOverride) {
    const sequenzRegel = SEQUENZ_REGELN.find(r => r.thema === empfohlenesThema.id);
    if (sequenzRegel) {
      const alleNotizen = DB.getNotizen(sid).filter(n => n.kategorie === 'session');
      const bearbeiteteThemen = [...new Set(alleNotizen.map(n => n.themaId).filter(Boolean))];
      const fehlend = sequenzRegel.voraussetzung.filter(v => !bearbeiteteThemen.includes(v));
      if (fehlend.length > 0) {
        const fehlendLabels = fehlend.map(f => {
          const found = findThemaInKategorien(f);
          return found ? found.titel : f;
        }).join(', ');
        sequenzWarnung = `<div class="sitzungsvorschlag-response-hint warnung" style="margin-top:6px;border-left:3px solid #DC2626;">` +
          `⛔ <strong>Sequenzierungs-Warnung:</strong> ${sequenzRegel.warnung}<br>` +
          `<span style="font-size:11px;">Fehlende Voraussetzungen: <strong>${fehlendLabels}</strong></span><br>` +
          `<span style="font-size:10px;color:var(--text-secondary);">Empfehlung: Zuerst die Voraussetzungen bearbeiten, dann dieses Thema aufnehmen.</span></div>`;
        // Alternatives Thema aus Phase 1/2 vorschlagen
        const stabilThemen = ['krisenintervention', 'emotionsregulation', 'emotionserkennung', 'stress-angst'];
        for (const altId of stabilThemen) {
          if (!bearbeiteteThemen.includes(altId)) {
            const altThema = findThemaInKategorien(altId);
            if (altThema) {
              sequenzWarnung += `<div style="margin-top:4px;"><button class="btn btn-xs btn-outline-success" onclick="quickStartSession('${altId}')" style="margin:2px;">✅ Stattdessen: ${altThema.titel}</button></div>`;
              break;
            }
          }
        }
      }
    }
  }

  // ── Hypothesen-basierte Themen-Empfehlung ──
  let hypothesenHint = '';
  if (!pvtOverride) {
    try {
      const hypothesen = generateHypothesen(sid);
      const topHypo = hypothesen.find(h => h.typ === 'risiko' && h.wiki_ids && h.wiki_ids.length > 0);
      if (topHypo && typeof HYPOTHESEN_THEMA_MAP !== 'undefined') {
        const empfThemen = [];
        for (const wid of topHypo.wiki_ids) {
          const mapped = HYPOTHESEN_THEMA_MAP[wid] || [];
          for (const tid of mapped) {
            if (!empfThemen.find(t => t.id === tid)) {
              const found = findThemaInKategorien(tid);
              if (found) empfThemen.push(found);
            }
          }
        }
        if (empfThemen.length > 0) {
          const chips = empfThemen.slice(0, 3).map(t =>
            `<button class="btn btn-xs btn-outline-primary" onclick="quickStartSession('${t.id}')" style="margin:2px;">${t.titel}</button>`
          ).join('');
          hypothesenHint = `<div class="sitzungsvorschlag-response-hint info" style="margin-top:6px;">🧠 Hypothese <em>"${topHypo.titel}"</em> empfiehlt: ${chips}</div>`;
        }
      }
    } catch(e) { /* silent */ }
  }

  // ── Treatment-Response-Empfehlung einblenden ──
  const trAnalyse = analyzeTreatmentResponse(sid);
  let treatmentHint = '';
  if (trAnalyse.bestesThema && !pvtOverride) {
    const empfId = empfohlenesThema.id;
    const besteId = trAnalyse.bestesThema.themaId;
    if (empfId === besteId) {
      treatmentHint = `<div class="sitzungsvorschlag-response-hint positiv">✨ Bestätigt: ${trAnalyse.bestesThema.responseRate}% Response-Rate bei diesem Thema</div>`;
    } else {
      // Prüfe ob das empfohlene Thema schlechte Response hat
      const empfResponse = trAnalyse.themen.find(t => t.themaId === empfId);
      if (empfResponse && empfResponse.responseRate < 40 && empfResponse.anzahl >= 2) {
        treatmentHint = `<div class="sitzungsvorschlag-response-hint warnung">⚠️ Niedrige Response (${empfResponse.responseRate}%) bei diesem Thema. Alternative: <strong>${trAnalyse.bestesThema.label}</strong> (${trAnalyse.bestesThema.responseRate}% Response) <button class="btn btn-xs btn-secondary" onclick="quickStartSession('${besteId}')" style="margin-left:6px;">Stattdessen starten</button></div>`;
      } else if (trAnalyse.bestesThema.responseRate >= 70) {
        treatmentHint = `<div class="sitzungsvorschlag-response-hint info">💊 Höchste Response: ${trAnalyse.bestesThema.label} (${trAnalyse.bestesThema.responseRate}%)</div>`;
      }
    }
  }

  // ── Stepped-Care-Logik (M4): Bei Non-Response → Eskalation empfehlen ──
  let steppedCareHint = '';
  if (trAnalyse && !pvtOverride) {
    const empfId = empfohlenesThema.id;
    const empfResponse = trAnalyse.themen.find(t => t.themaId === empfId);
    if (empfResponse && empfResponse.responseRate < 20 && empfResponse.anzahl >= 6) {
      steppedCareHint = `<div class="sitzungsvorschlag-response-hint warnung" style="border-left:3px solid #DC2626;margin-top:6px;">🚨 <strong>Anhaltende Non-Response</strong> nach ${empfResponse.anzahl} Sitzungen (${empfResponse.responseRate}% Response). Dringend: Fallbesprechung mit Team und/oder Überweisung an Kinder-/Jugendpsychiater empfohlen.</div>`;
    } else if (empfResponse && empfResponse.responseRate < 30 && empfResponse.anzahl >= 4) {
      steppedCareHint = `<div class="sitzungsvorschlag-response-hint warnung" style="margin-top:6px;">⚠️ <strong>Non-Response</strong> nach ${empfResponse.anzahl} Sitzungen (${empfResponse.responseRate}% Response). Empfehlung: Therapeutischen Ansatz wechseln oder Überweisung an Fachstelle prüfen.</div>`;
    }
  }

  // ── Schutzfaktoren / Ressourcen-Hint ──
  let ressourcenHint = '';
  try {
    const schutzHypos = generateHypothesen(sid).filter(h => h.typ === 'schutz').slice(0, 3);
    const sSchutz = DB.getSchuelerById(sid);
    const ffSchutz = (sSchutz && sSchutz.fallFormulierung) || {};
    const protectiveItems = (ffSchutz.protective || []).slice(0, 3);
    const items = [];
    schutzHypos.forEach(h => { if (!items.includes(h.titel)) items.push(h.titel); });
    protectiveItems.forEach(p => { if (!items.includes(p) && items.length < 4) items.push(p); });
    if (items.length > 0) {
      const chips = items.map(i => '<span style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:2px 8px;font-size:10px;color:#166534;">' + i + '</span>').join(' ');
      ressourcenHint = '<div style="margin-top:6px;font-size:11px;color:#166534;">💪 Ressourcen nutzen: ' + chips + '</div>';
    }
  } catch(e) { /* silent */ }

  // ── Begründungssatz zusammenbauen ──
  const gruende = [];
  if (pvtOverride && lastPVT === 'frozen') gruende.push('Nervensystem eingefroren → Stabilisierung Vorrang');
  else if (pvtOverride && lastPVT === 'activated') gruende.push('Nervensystem angespannt → Co-Regulation');
  else if (aktivePhase) gruende.push('Phase ' + aktivePhase.nr + ' aktiv');
  try {
    const topHypoB = generateHypothesen(sid).find(h => h.typ === 'risiko' && h._konfidenz >= 50);
    if (topHypoB) gruende.push('Hypothese "' + topHypoB.titel + '"');
  } catch(e) {}
  if (trAnalyse && trAnalyse.bestesThema && empfohlenesThema.id === trAnalyse.bestesThema.themaId) {
    gruende.push(trAnalyse.bestesThema.responseRate + '% Response-Bestätigung');
  } else if (trAnalyse && trAnalyse.gesamtTrend && trAnalyse.gesamtTrend.richtung === 'positiv') {
    gruende.push('Positiver Gesamttrend');
  }
  const begruendung = gruende.length > 0
    ? '<div style="margin-top:4px;font-size:11px;color:var(--text-secondary);cursor:pointer;" onclick="this.querySelector(\'.detail\').style.display=this.querySelector(\'.detail\').style.display===\'none\'?\'block\':\'none\'">' +
      '📋 Begründung <span style="font-size:10px;color:var(--grau);">▾</span>' +
      '<div class="detail" style="display:none;margin-top:4px;padding:6px 10px;background:#F8FAFC;border-radius:6px;font-size:11px;line-height:1.5;">' +
      'Empfohlen weil: ' + gruende.join(' + ') +
      '</div></div>'
    : '';

  const pvtBadge = lastPVT ? `<span class="sitzungsvorschlag-pvt">${pvtLabels[lastPVT] || lastPVT}</span>` : '';
  const overrideHint = pvtOverride
    ? `<div class="sitzungsvorschlag-pvt-hint">Basierend auf dem letzten Nervensystem-Zustand wird ein angepasstes Thema vorgeschlagen.</div>`
    : '';

  // ── Aktivitäten-Vorschläge basierend auf Alter + Setting ──
  let aktivitaetenHTML = '';
  try {
    const schueler = DB.getSchuelerById(sid);
    const gebStr = schueler && schueler.geburtsdatum;
    let schuelerAlter = null;
    if (gebStr) {
      const heute = new Date();
      const geb = new Date(gebStr);
      schuelerAlter = heute.getFullYear() - geb.getFullYear();
      if (heute.getMonth() < geb.getMonth() ||
        (heute.getMonth() === geb.getMonth() && heute.getDate() < geb.getDate())) schuelerAlter--;
    }
    const interventionen = THEMA_INTERVENTIONEN[empfohlenesThema.id] || [];
    if (interventionen.length > 0) {
      // Filter nach Alter (wenn bekannt)
      let passend = interventionen;
      if (schuelerAlter !== null) {
        passend = interventionen.filter(iv => {
          if (!iv.alter) return true;
          return schuelerAlter >= iv.alter[0] && schuelerAlter <= iv.alter[1];
        });
        if (passend.length === 0) passend = interventionen; // Fallback
      }
      // Max 3 anzeigen, Einzel bevorzugen
      const einzel = passend.filter(iv => iv.setting === 'einzel');
      const gruppe = passend.filter(iv => iv.setting === 'gruppe');
      const auswahl = [...einzel.slice(0, 2), ...gruppe.slice(0, 1)].slice(0, 3);
      if (auswahl.length === 0 && passend.length > 0) auswahl.push(...passend.slice(0, 3));

      const karten = auswahl.map(iv => {
        const settingIcon = iv.setting === 'gruppe' ? '👥 Gruppe' : '👤 Einzel';
        const alterBadge = iv.alter ? `${iv.alter[0]}–${iv.alter[1]}J` : '';
        const matLine = iv.material && iv.material !== '—' ? `<div class="aktivitaet-material">📦 ${iv.material}</div>` : '';
        return `<div class="aktivitaet-karte">
          <div class="aktivitaet-header">
            <strong>${iv.titel}</strong>
            <span class="aktivitaet-dauer">${iv.dauer}</span>
          </div>
          <div class="aktivitaet-badges">
            <span class="aktivitaet-badge setting">${settingIcon}</span>
            <span class="aktivitaet-badge alter">${alterBadge}</span>
            <span class="aktivitaet-badge ansatz">${iv.ansatz}</span>
          </div>
          ${matLine}
          <div class="aktivitaet-beschreibung">${iv.beschreibung}</div>
        </div>`;
      }).join('');

      const allCount = interventionen.length;
      const browserBtn = allCount > 3
        ? `<button class="btn btn-xs btn-outline-secondary" onclick="renderAktivitaetenBrowser('${empfohlenesThema.id}')" style="margin-top:6px;">Alle ${allCount} Aktivitäten anzeigen</button>`
        : '';

      aktivitaetenHTML = `<div class="aktivitaeten-vorschlag">
        <div class="aktivitaeten-titel">Passende Aktivitäten${schuelerAlter !== null ? ' (Alter ' + schuelerAlter + ')' : ''}</div>
        <div class="aktivitaeten-grid">${karten}</div>
        ${browserBtn}
      </div>`;
    }
  } catch(e) { /* silent */ }

  container.innerHTML = `
    <div class="card sitzungsvorschlag-card ${pvtOverride ? 'pvt-override' : ''}">
      <div class="card-body" style="display:flex;align-items:center;gap:14px;padding:14px 18px;">
        <div class="sitzungsvorschlag-icon">💡</div>
        <div style="flex:1;">
          <div class="sitzungsvorschlag-label">Heute empfohlen ${pvtBadge}</div>
          <div class="sitzungsvorschlag-thema">${empfohlenesThema.titel}</div>
          <div class="sitzungsvorschlag-grund">${empfGrund}</div>
          ${begruendung}
          ${overrideHint}
          ${sequenzWarnung}
          ${treatmentHint}
          ${steppedCareHint}
          ${hypothesenHint}
          ${ressourcenHint}
          ${aktivitaetenHTML}
        </div>
        <div class="sitzungsvorschlag-actions">
          <button class="btn btn-primary btn-sm" onclick="quickStartSession('${empfohlenesThema.id}')">
            Sitzung starten
          </button>
          <button class="btn btn-secondary btn-sm" onclick="showQuickEntryPanel('${empfohlenesThema.id}', '${empfohlenesThema.katId || ''}')">
            Details
          </button>
        </div>
      </div>
    </div>
  `;
}

// ── Aktivitäten-Browser: Alle Aktivitäten eines Themas mit Filtern ──
function renderAktivitaetenBrowser(themaId) {
  const interventionen = THEMA_INTERVENTIONEN[themaId] || [];
  if (interventionen.length === 0) return;

  const sid = APP.currentSchuelerId;
  const schueler = DB.getSchuelerById(sid);
  let schuelerAlter = null;
  if (schueler && schueler.geburtsdatum) {
    const heute = new Date();
    const geb = new Date(schueler.geburtsdatum);
    schuelerAlter = heute.getFullYear() - geb.getFullYear();
    if (heute.getMonth() < geb.getMonth() ||
      (heute.getMonth() === geb.getMonth() && heute.getDate() < geb.getDate())) schuelerAlter--;
  }

  // Thema-Titel finden
  let themaLabel = themaId;
  for (const kat of THEMEN_KATEGORIEN) {
    const t = kat.themen.find(th => th.id === themaId);
    if (t) { themaLabel = t.titel; break; }
  }

  // Modal erstellen
  let overlay = document.getElementById('aktivitaeten-browser-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'aktivitaeten-browser-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.4);z-index:9999;display:flex;align-items:center;justify-content:center;';
    overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
    document.body.appendChild(overlay);
  }

  const modal = document.createElement('div');
  modal.style.cssText = 'background:#fff;border-radius:12px;max-width:700px;width:90%;max-height:80vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.2);';
  overlay.innerHTML = '';
  overlay.appendChild(modal);

  function render(filterSetting, filterAlter) {
    let filtered = interventionen;
    if (filterSetting === 'einzel') filtered = filtered.filter(iv => iv.setting === 'einzel');
    else if (filterSetting === 'gruppe') filtered = filtered.filter(iv => iv.setting === 'gruppe');

    if (filterAlter === 'passend' && schuelerAlter !== null) {
      const passend = filtered.filter(iv => !iv.alter || (schuelerAlter >= iv.alter[0] && schuelerAlter <= iv.alter[1]));
      if (passend.length > 0) filtered = passend;
    } else if (filterAlter === 'kind') {
      filtered = filtered.filter(iv => iv.alter && iv.alter[1] <= 13);
    } else if (filterAlter === 'jugend') {
      filtered = filtered.filter(iv => iv.alter && iv.alter[0] >= 12);
    }

    const karten = filtered.map(iv => {
      const settingIcon = iv.setting === 'gruppe' ? '👥 Gruppe' : '👤 Einzel';
      const alterBadge = iv.alter ? `${iv.alter[0]}–${iv.alter[1]}J` : '';
      const matLine = iv.material && iv.material !== '—' ? `<div class="aktivitaet-material">📦 ${iv.material}</div>` : '';
      const fachkraftWarnung = iv.fachkraftTauglich === false
        ? `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;padding:4px 8px;margin-top:6px;font-size:10px;color:#991B1B;">⚠️ <strong>Nur mit Fachausbildung/Supervision</strong>${iv.warnhinweis ? ': ' + iv.warnhinweis : ''}</div>`
        : '';
      return `<div class="aktivitaet-karte${iv.fachkraftTauglich === false ? ' fachkraft-warnung' : ''}">
        <div class="aktivitaet-header">
          <strong>${iv.titel}</strong>${iv.fachkraftTauglich === false ? ' <span title="Nur durch Fachpersonal" style="color:#DC2626;">⚠️</span>' : ''}
          <span class="aktivitaet-dauer">${iv.dauer}</span>
        </div>
        <div class="aktivitaet-badges">
          <span class="aktivitaet-badge setting">${settingIcon}</span>
          <span class="aktivitaet-badge alter">${alterBadge}</span>
          <span class="aktivitaet-badge ansatz">${iv.ansatz}</span>
        </div>
        ${matLine}
        <div class="aktivitaet-beschreibung">${iv.beschreibung}</div>
        ${iv.indikation ? '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Indikation: ' + iv.indikation + '</div>' : ''}
        ${fachkraftWarnung}
      </div>`;
    }).join('');

    const btnClass = (val, current) => val === current ? 'filter-btn active' : 'filter-btn';

    modal.innerHTML = `
      <div class="aktivitaeten-browser">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;font-size:16px;">${themaLabel} — Aktivitäten (${filtered.length}/${interventionen.length})</h3>
          <button onclick="document.getElementById('aktivitaeten-browser-overlay').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:var(--text-muted);">&times;</button>
        </div>
        <div class="aktivitaeten-browser-filter">
          <span style="font-size:11px;font-weight:600;color:var(--text-secondary);">Setting:</span>
          <button class="${btnClass('alle', filterSetting)}" data-f="s:alle">Alle</button>
          <button class="${btnClass('einzel', filterSetting)}" data-f="s:einzel">👤 Einzel</button>
          <button class="${btnClass('gruppe', filterSetting)}" data-f="s:gruppe">👥 Gruppe</button>
          <span style="margin-left:8px;font-size:11px;font-weight:600;color:var(--text-secondary);">Alter:</span>
          <button class="${btnClass('alle', filterAlter)}" data-f="a:alle">Alle</button>
          ${schuelerAlter !== null ? '<button class="' + btnClass('passend', filterAlter) + '" data-f="a:passend">Passend (' + schuelerAlter + 'J)</button>' : ''}
          <button class="${btnClass('kind', filterAlter)}" data-f="a:kind">6–12</button>
          <button class="${btnClass('jugend', filterAlter)}" data-f="a:jugend">12–18</button>
        </div>
        <div class="aktivitaeten-browser-liste">${karten}</div>
      </div>
    `;

    modal.querySelectorAll('[data-f]').forEach(btn => {
      btn.addEventListener('click', () => {
        const [type, val] = btn.dataset.f.split(':');
        if (type === 's') render(val, filterAlter);
        else render(filterSetting, val);
      });
    });
  }

  render('alle', schuelerAlter !== null ? 'passend' : 'alle');
}

// Hilfsfunktion: Nächstes nicht-abgeschlossenes Thema aus einer Phase
function findNextPhaseThema(phase, schuelerId) {
  if (!phase.themen || !phase.themen.length) return null;
  const s = DB.getSchuelerById(schuelerId);
  const topicStatus = (s && s.topicStatus) || {};

  for (const t of phase.themen) {
    const tid = typeof t === 'string' ? t : t.id;
    const status = topicStatus[tid] || 'nicht-begonnen';
    if (status !== 'abgeschlossen') {
      const found = findThemaInKategorien(tid);
      if (found) return found;
    }
  }
  return null;
}

// Hilfsfunktion: Thema-Objekt aus THEMEN_KATEGORIEN finden
function findThemaInKategorien(themaId) {
  for (const kat of THEMEN_KATEGORIEN) {
    const t = kat.themen.find(th => th.id === themaId);
    if (t) return { ...t, katId: kat.id, katTitel: kat.titel, farbe: kat.farbe };
  }
  return null;
}

// ---- PHASE-TRANSITION-PROMPT ----
function renderPhaseTransitionPrompt() {
  let el = document.getElementById('phase-transition-prompt');
  if (!el) {
    const ref = document.getElementById('sitzungsvorschlag-widget');
    if (!ref) return;
    el = document.createElement('div');
    el.id = 'phase-transition-prompt';
    ref.after(el);
  }

  const sid = APP.currentSchuelerId;
  const roadmap = DB.getRoadmap(sid);
  if (!roadmap) { el.innerHTML = ''; return; }

  const aktivePhase = roadmap.phasen.find(p => p.status === 'aktiv');
  if (!aktivePhase || !aktivePhase.themen || !aktivePhase.themen.length) { el.innerHTML = ''; return; }

  const s = DB.getSchuelerById(sid);
  const topicStatus = (s && s.topicStatus) || {};
  const total = aktivePhase.themen.length;
  const done = aktivePhase.themen.filter(t => {
    const tid = typeof t === 'string' ? t : t.id;
    return topicStatus[tid] === 'abgeschlossen';
  }).length;
  const pct = Math.round((done / total) * 100);

  // Nur anzeigen wenn ≥ 80%
  if (pct < 80) { el.innerHTML = ''; return; }

  // ── Phase-Gate: Treatment-Response prüfen ──
  let phaseGateWarnung = '';
  try {
    const trAnalyse = analyzeTreatmentResponse(sid);
    if (trAnalyse && trAnalyse.gesamtTrend && trAnalyse.gesamtTrend.richtung === 'negativ') {
      phaseGateWarnung += '<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px;margin-bottom:10px;font-size:12px;color:#991B1B;">⚠️ <strong>Achtung:</strong> Der Gesamt-Trend zeigt eine negative Entwicklung. Bevor du zur nächsten Phase wechselst, prüfe ob die aktuellen Themen ausreichend bearbeitet wurden.</div>';
    }
    const srsNotizen = DB.getNotizen(sid)
      .filter(n => n.soap && n.soap.srs && n.soap.srs.total > 0)
      .sort((a, b) => new Date(b.datum) - new Date(a.datum))
      .slice(0, 3);
    if (srsNotizen.length >= 3) {
      const avgSRS = Math.round(srsNotizen.reduce((sum, n) => sum + n.soap.srs.total, 0) / srsNotizen.length);
      if (avgSRS < 25) {
        phaseGateWarnung += '<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:8px;padding:10px;margin-bottom:10px;font-size:12px;color:#92400E;">⚠️ Durchschnittlicher SRS der letzten 3 Sitzungen: <strong>' + avgSRS + '/40</strong>. Phase-Wechsel wird nicht empfohlen — therapeutische Beziehung oder Ansatz zuerst reflektieren.</div>';
      }
    }
  } catch(e) { /* silent */ }

  const nextPhaseNr = aktivePhase.nr + 1;
  const nextPhaseDef = ROADMAP_PHASEN[nextPhaseNr];
  if (!nextPhaseDef) { el.innerHTML = ''; return; }

  // Dauer berechnen
  const startDatum = aktivePhase.startDatum ? new Date(aktivePhase.startDatum) : null;
  const wochen = startDatum ? Math.round((Date.now() - startDatum.getTime()) / (7 * 24 * 60 * 60 * 1000)) : null;
  const dauerText = wochen !== null ? ` und seit ${wochen} Woche${wochen !== 1 ? 'n' : ''} aktiv` : '';

  el.innerHTML = `
    <div class="card phase-transition-card">
      <div class="card-body" style="display:flex;align-items:flex-start;gap:12px;padding:14px 18px;">
        <span style="font-size:24px;">🎯</span>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:14px;color:var(--text);margin-bottom:4px;">
            Phase ${aktivePhase.nr} ist zu ${pct}% abgeschlossen
          </div>
          <div style="font-size:12px;color:var(--text-secondary);margin-bottom:10px;">
            ${done} von ${total} Themen erledigt${dauerText}. Bereit für Phase ${nextPhaseNr} (${nextPhaseDef.titel})?
          </div>
          ${phaseGateWarnung}
          <div style="display:flex;gap:8px;">
            <button class="btn btn-primary" style="padding:10px 22px;font-size:15px;font-weight:600;" onclick="advancePhase(${aktivePhase.nr})">
              ✓ Phase abschließen & weiter
            </button>
            <button class="btn btn-secondary" style="padding:8px 16px;font-size:14px;" onclick="document.getElementById('phase-transition-prompt').innerHTML=''">
              Noch nicht
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function advancePhase(currentPhaseNr) {
  const sid = APP.currentSchuelerId;
  const roadmap = DB.getRoadmap(sid);
  if (!roadmap) return;

  const current = roadmap.phasen.find(p => p.nr === currentPhaseNr);
  if (current) {
    current.status = 'abgeschlossen';
    current.endDatum = new Date().toISOString().split('T')[0];
  }

  const next = roadmap.phasen.find(p => p.nr === currentPhaseNr + 1);
  if (next) {
    next.status = 'aktiv';
    next.startDatum = new Date().toISOString().split('T')[0];
  }

  DB.saveRoadmap(roadmap);
  showToast(`Phase ${currentPhaseNr} abgeschlossen — Phase ${currentPhaseNr + 1} gestartet`, 'success');
  renderDashboard();
  renderRoadmap();
}

// ---- RÜCKSCHRITT-PROTOKOLL (SRS < 25 in letzten 3 Sitzungen) ----
function renderRueckschrittAlert() {
  // Prüfe ob schon ein Container existiert, sonst erstellen
  let alertEl = document.getElementById('rueckschritt-alert');
  if (!alertEl) {
    const widget = document.getElementById('naechste-schritte-widget');
    if (!widget) return;
    alertEl = document.createElement('div');
    alertEl.id = 'rueckschritt-alert';
    widget.after(alertEl);
  }

  const sid = APP.currentSchuelerId;
  const notizen = DB.getNotizen(sid)
    .filter(n => n.soap && n.soap.srs && n.soap.srs.total > 0)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

  // Brauchen min. 3 Sitzungen mit SRS
  if (notizen.length < 3) {
    alertEl.innerHTML = '';
    return;
  }

  const letzte3 = notizen.slice(0, 3);
  const alleUnter25 = letzte3.every(n => n.soap.srs.total < 25);

  if (!alleUnter25) {
    alertEl.innerHTML = '';
    return;
  }

  const scores = letzte3.map(n => n.soap.srs.total);
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  alertEl.innerHTML = `
    <div class="card" style="margin-bottom:16px;border-left:4px solid #F59E0B;background:#FFFBEB;">
      <div class="card-body" style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;">
        <span style="font-size:24px;">⚠️</span>
        <div style="flex:1;">
          <div style="font-weight:600;font-size:14px;color:#92400E;margin-bottom:4px;">
            Verlauf auffällig — Reflexion empfohlen
          </div>
          <div style="font-size:12px;color:#78350F;margin-bottom:10px;">
            Die letzten 3 Sitzungen haben alle einen SRS-Score unter 25/40 (Ø ${avg}).
            Das kann auf Schwierigkeiten in der therapeutischen Beziehung, unpassende Methoden oder unerkannte Faktoren hinweisen.
          </div>
          <div style="display:flex;gap:6px;margin-bottom:10px;">
            ${letzte3.map(n => `
              <span style="padding:3px 10px;border-radius:12px;font-size:11px;font-weight:600;
                background:#FEF3C7;color:#92400E;border:1px solid #FDE68A;">
                ${formatDatum(n.datum)}: ${n.soap.srs.total}/40
              </span>
            `).join('')}
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-sm" style="background:#F59E0B;color:#fff;border:none;" onclick="showProfilTab('fallformulierung')">
              🧩 5P-Formulierung überarbeiten
            </button>
            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('rueckschritt-alert').innerHTML=''">
              Ausblenden
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ---- NÄCHSTE SCHRITTE & FORTSCHRITTSBALKEN ----
function renderNaechsteSchritte() {
  const widget = document.getElementById('naechste-schritte-widget');
  if (!widget) return;

  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  const ff = DB.getFallformulierung(sid);
  const profil = s.staerkenProfil || {};
  const staerkenBewertet = Object.values(profil.ratings || {}).filter(v => v > 0).length;
  const roadmap = DB.getRoadmap(sid);
  const notizen = DB.getNotizen(sid);
  const ziele = s.ziele || [];
  const topicStatus = s.topicStatus || {};
  const aktiveThemen = Object.values(topicStatus).filter(v => v === 'in-bearbeitung').length;
  const abgeschlosseneThemen = Object.values(topicStatus).filter(v => v === 'abgeschlossen').length;

  // Phasen definieren
  const phasen = [
    { id: 'info', label: 'Aufnahme', icon: 'ℹ️', done: !!(s.allgemeineNotizen || s.geburtsdatum), tab: 'info' },
    { id: 'screening', label: 'Screening', icon: '🔍', done: screenings.length > 0, tab: 'screening' },
    { id: '5p', label: '5P-Analyse', icon: '🧩', done: !!(ff && ((ff.presenting||[]).length + (ff.predisposing||[]).length + (ff.precipitating||[]).length + (ff.perpetuating||[]).length + (ff.protective||[]).length) >= 3), tab: 'fallformulierung' },
    { id: 'staerken', label: 'Stärken', icon: '💪', done: staerkenBewertet >= 3, tab: 'staerken' },
    { id: 'roadmap', label: 'Förderplan', icon: '🗺️', done: !!roadmap, tab: 'roadmap' },
    { id: 'ziele', label: 'Ziele', icon: '🎯', done: ziele.length > 0, tab: 'ziele' },
    { id: 'themen', label: 'Themen', icon: '📋', done: aktiveThemen > 0 || abgeschlosseneThemen > 0, tab: 'themen' },
    { id: 'berichte', label: 'Berichte', icon: '📄', done: false, tab: 'berichte' },
  ];

  const erledigte = phasen.filter(p => p.done).length;
  const fortschritt = Math.round((erledigte / phasen.length) * 100);

  // Nächster Schritt ermitteln
  const naechster = phasen.find(p => !p.done);

  // Empfehlungen basierend auf nächstem Schritt
  const empfehlungen = [];
  if (!phasen[0].done) empfehlungen.push({ icon: 'ℹ️', text: 'Allgemeine Infos und Hintergrund erfassen', tab: 'info' });
  if (!phasen[1].done) empfehlungen.push({ icon: '🔍', text: 'Erstes Screening durchführen', tab: 'screening' });
  if (phasen[1].done && !phasen[2].done) empfehlungen.push({ icon: '🧩', text: '5P-Analyse aus Screening-Daten befüllen', tab: 'fallformulierung' });
  if (!phasen[3].done) empfehlungen.push({ icon: '💪', text: 'Stärken-Profil bewerten (min. 3 Dimensionen)', tab: 'staerken' });
  if (phasen[1].done && !phasen[4].done) empfehlungen.push({ icon: '🗺️', text: 'Förderplan aus Screening generieren', tab: 'roadmap' });

  widget.innerHTML = `
    <div class="card" style="margin-bottom:20px;border-left:4px solid #6366F1;">
      <div class="card-header">
        <span>🧭</span>
        <div class="card-title">Therapeutischer Fortschritt</div>
        <div style="margin-left:auto;font-size:13px;font-weight:600;color:#6366F1;">${fortschritt}%</div>
      </div>
      <div class="card-body">
        <!-- Fortschrittsbalken -->
        <div style="margin-bottom:16px;">
          <div class="progress-bar" style="height:10px;border-radius:5px;">
            <div class="progress-bar-fill" style="width:${fortschritt}%;background:linear-gradient(90deg,#6366F1,#8B5CF6);border-radius:5px;transition:width 0.5s;"></div>
          </div>
        </div>

        <!-- Phasen-Schritte -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;">
          ${phasen.map(p => `
            <div onclick="showProfilTab('${p.tab}')" style="
              display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;
              background:${p.done ? '#F0FDF4' : '#F9FAFB'};
              border:1px solid ${p.done ? '#BBF7D0' : '#E5E7EB'};
              color:${p.done ? '#15803D' : '#6B7280'};
            ">
              <span style="font-size:13px;">${p.done ? icon('check-circle', 16) : renderIcon(p.icon, 16)}</span>
              ${p.label}
            </div>
          `).join('')}
        </div>

        ${empfehlungen.length > 0 ? `
        <!-- Empfehlungen -->
        <div style="background:#F8FAFC;border-radius:8px;padding:12px;">
          <div style="font-size:11px;font-weight:600;color:#6366F1;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">
            Nächste Schritte
          </div>
          ${empfehlungen.slice(0, 3).map(e => `
            <div onclick="showProfilTab('${e.tab}')" style="
              display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer;font-size:13px;color:#374151;
              border-bottom:1px solid #F3F4F6;
            ">
              <span>${e.icon}</span>
              <span>${e.text}</span>
              <span style="margin-left:auto;color:#9CA3AF;font-size:11px;">→</span>
            </div>
          `).join('')}
        </div>
        ` : `
        <div style="text-align:center;padding:8px;color:#15803D;font-size:13px;font-weight:500;">
          ✅ Alle Phasen abgeschlossen — Berichte können generiert werden!
        </div>
        `}
      </div>
    </div>
  `;
}

// ---- MINI KALENDER ----
const MONATE_DE = ['Januar','Februar','März','April','Mai','Juni',
  'Juli','August','September','Oktober','November','Dezember'];

function renderDashKalender() {
  const d = APP.dashKalenderDatum;
  const jahr = d.getFullYear();
  const monat = d.getMonth();

  const monatEl = document.getElementById('dash-kalender-monat');
  if (monatEl) monatEl.textContent = `${MONATE_DE[monat]} ${jahr}`;

  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const notizen = DB.getNotizen(APP.currentSchuelerId);
  const kalNotizen = s.kalenderNotizen || [];
  const tageWithNotizen = new Set([
    ...notizen.map(n => n.datum),
    ...kalNotizen.map(n => n.datum),
  ]);

  const ersterTag = new Date(jahr, monat, 1);
  const letzterTag = new Date(jahr, monat + 1, 0);
  const startWochentag = (ersterTag.getDay() + 6) % 7;
  const heute = new Date().toISOString().split('T')[0];

  let html = `<div class="mini-kal-header">
    <span>Mo</span><span>Di</span><span>Mi</span><span>Do</span><span>Fr</span><span>Sa</span><span>So</span>
  </div><div class="mini-kal-grid">`;

  for (let i = 0; i < startWochentag; i++) {
    html += '<div class="mini-kal-cell empty"></div>';
  }
  for (let tag = 1; tag <= letzterTag.getDate(); tag++) {
    const datum = `${jahr}-${String(monat+1).padStart(2,'0')}-${String(tag).padStart(2,'0')}`;
    const hatNotiz = tageWithNotizen.has(datum);
    const istHeute = datum === heute;
    const istSelected = datum === APP.dashKalenderSelectedTag;
    const cls = ['mini-kal-cell',
      istHeute ? 'heute' : '',
      istSelected ? 'selected' : '',
      hatNotiz ? 'has-notiz' : ''].filter(Boolean).join(' ');
    html += `<div class="${cls}" onclick="selectDashKalenderTag('${datum}')">${tag}${hatNotiz ? '<span class="notiz-dot"></span>' : ''}</div>`;
  }
  html += '</div>';

  const gridEl = document.getElementById('dash-kalender-grid');
  if (gridEl) gridEl.innerHTML = html;

  renderDashKalenderNotizenListe();
}

function navigateDashKalender(delta) {
  const d = APP.dashKalenderDatum;
  APP.dashKalenderDatum = new Date(d.getFullYear(), d.getMonth() + delta, 1);
  renderDashKalender();
}

function selectDashKalenderTag(datum) {
  APP.dashKalenderSelectedTag = datum;
  renderDashKalender();
  const form = document.getElementById('dash-kalender-notiz-form');
  const formDatum = document.getElementById('dash-kal-form-datum');
  if (formDatum) formDatum.textContent = formatDatum(datum);
  if (form) form.style.display = 'block';
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const existing = (s.kalenderNotizen || []).find(n => n.datum === datum);
  const textarea = document.getElementById('dash-kalender-notiz-text');
  if (textarea) textarea.value = existing ? existing.text : '';
}

function saveDashKalenderNotiz() {
  const datum = APP.dashKalenderSelectedTag;
  if (!datum) return;
  const textarea = document.getElementById('dash-kalender-notiz-text');
  const text = textarea ? textarea.value.trim() : '';
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  let kalNotizen = (s.kalenderNotizen || []).filter(n => n.datum !== datum);
  if (text) kalNotizen.push({ id: DB.generateId(), datum, text, erstellt: new Date().toISOString() });
  DB.updateSchueler(APP.currentSchuelerId, { kalenderNotizen: kalNotizen });
  closeDashKalenderNotiz();
  renderDashKalender();
  showToast('Notiz gespeichert', 'success');
}

function closeDashKalenderNotiz() {
  const form = document.getElementById('dash-kalender-notiz-form');
  const textarea = document.getElementById('dash-kalender-notiz-text');
  if (form) form.style.display = 'none';
  if (textarea) textarea.value = '';
  APP.dashKalenderSelectedTag = null;
  renderDashKalender();
}

function renderDashKalenderNotizenListe() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const d = APP.dashKalenderDatum;
  const kalNotizen = (s.kalenderNotizen || [])
    .filter(n => {
      const nd = new Date(n.datum + 'T00:00:00');
      return nd.getFullYear() === d.getFullYear() && nd.getMonth() === d.getMonth();
    })
    .sort((a, b) => a.datum.localeCompare(b.datum));

  const el = document.getElementById('dash-kalender-notizen-liste');
  if (!el) return;
  if (kalNotizen.length === 0) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="kal-notizen-liste">${
    kalNotizen.map(n => `
      <div class="kal-notiz-item" onclick="selectDashKalenderTag('${n.datum}')">
        <span class="kal-notiz-datum">${formatDatum(n.datum)}</span>
        <span class="kal-notiz-text">${escapeHtml(n.text)}</span>
        <button class="btn-icon" onclick="event.stopPropagation();deleteDashKalenderNotiz('${n.id}')">×</button>
      </div>`).join('')
  }</div>`;
}

function deleteDashKalenderNotiz(id) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const kalNotizen = (s.kalenderNotizen || []).filter(n => n.id !== id);
  DB.updateSchueler(APP.currentSchuelerId, { kalenderNotizen: kalNotizen });
  renderDashKalender();
}

// ---- TO-DO ----
function renderDashTodo() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const todos = s.todos || [];
  const liste = document.getElementById('dash-todo-liste');
  if (!liste) return;

  if (todos.length === 0) {
    liste.innerHTML = '<div class="empty-mini">Noch keine Aufgaben</div>';
    return;
  }

  const sorted = [...todos].sort((a, b) => Number(a.erledigt) - Number(b.erledigt));
  liste.innerHTML = sorted.map(t => `
    <div class="todo-item ${t.erledigt ? 'erledigt' : ''}">
      <input type="checkbox" class="todo-check" ${t.erledigt ? 'checked' : ''}
        onchange="toggleDashTodo('${t.id}')">
      <span class="todo-text">${escapeHtml(t.text)}</span>
      <button class="btn-icon todo-del" onclick="deleteDashTodo('${t.id}')">×</button>
    </div>`).join('');
}

function addDashTodo() {
  const input = document.getElementById('dash-todo-input');
  const text = input ? input.value.trim() : '';
  if (!text) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const todos = s.todos || [];
  todos.push({ id: DB.generateId(), text, erledigt: false, erstellt: new Date().toISOString() });
  DB.updateSchueler(APP.currentSchuelerId, { todos });
  if (input) input.value = '';
  renderDashTodo();
}

function toggleDashTodo(id) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const todos = s.todos || [];
  const t = todos.find(t => t.id === id);
  if (t) t.erledigt = !t.erledigt;
  DB.updateSchueler(APP.currentSchuelerId, { todos });
  renderDashTodo();
}

function deleteDashTodo(id) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const todos = (s.todos || []).filter(t => t.id !== id);
  DB.updateSchueler(APP.currentSchuelerId, { todos });
  renderDashTodo();
}

// ---- NOTIZBUCH ----
const STANDARD_SEKTIONEN = ['Schule', 'Familie', 'Gesundheit', 'Freizeit'];

function getNotizbuch(s) {
  if (!s.notizbuch || !s.notizbuch.sektionen || s.notizbuch.sektionen.length === 0) {
    return {
      sektionen: STANDARD_SEKTIONEN.map(titel => ({
        id: DB.generateId(), titel, notizen: []
      }))
    };
  }
  return JSON.parse(JSON.stringify(s.notizbuch));
}

function renderNotizbuch() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const nb = getNotizbuch(s);
  const aktiv = Math.min(APP.notizbuchAktivSektion, nb.sektionen.length - 1);
  APP.notizbuchAktivSektion = aktiv;

  const tabsEl = document.getElementById('notizbuch-tabs');
  if (!tabsEl) return;
  tabsEl.innerHTML = nb.sektionen.map((sek, i) => `
    <div class="nb-tab ${i === aktiv ? 'active' : ''}" onclick="showNotizbuchSektion(${i})">
      ${escapeHtml(sek.titel)}
    </div>`).join('') +
    `<div class="nb-tab nb-tab-add" onclick="addNotizbuchSektion()">+ Sektion</div>`;

  const inhaltEl = document.getElementById('notizbuch-inhalt');
  if (!inhaltEl) return;
  if (nb.sektionen.length === 0) {
    inhaltEl.innerHTML = '<div class="empty-mini" style="padding:20px;">Keine Sektionen</div>';
    return;
  }
  const sek = nb.sektionen[aktiv];
  const notizen = sek.notizen || [];

  inhaltEl.innerHTML = `
    <div class="nb-inhalt-header">
      <span class="nb-sektion-titel">${escapeHtml(sek.titel)}</span>
      <button class="btn btn-secondary btn-sm" onclick="deleteNotizbuchSektion(${aktiv})">🗑 Sektion löschen</button>
    </div>
    <div class="nb-notiz-form">
      <textarea id="nb-neue-notiz" rows="2" placeholder="Neue Notiz in '${escapeHtml(sek.titel)}'..."></textarea>
      <button class="btn btn-primary btn-sm" onclick="addNotizbuchNotiz(${aktiv})">+ Hinzufügen</button>
    </div>
    <div class="nb-notizen-liste">
      ${notizen.length === 0
        ? '<div class="empty-mini">Noch keine Notizen in dieser Sektion</div>'
        : notizen.slice().reverse().map(n => `
          <div class="nb-notiz-item">
            <div class="nb-notiz-meta">${formatDatum(n.datum)}</div>
            <div class="nb-notiz-text">${escapeHtml(n.text)}</div>
            <button class="btn-icon nb-notiz-del" onclick="deleteNotizbuchNotiz('${n.id}',${aktiv})">×</button>
          </div>`).join('')
      }
    </div>`;
}

function showNotizbuchSektion(index) {
  APP.notizbuchAktivSektion = index;
  renderNotizbuch();
}

function addNotizbuchSektion() {
  const titel = prompt('Name der neuen Sektion:');
  if (!titel || !titel.trim()) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const nb = getNotizbuch(s);
  nb.sektionen.push({ id: DB.generateId(), titel: titel.trim(), notizen: [] });
  DB.updateSchueler(APP.currentSchuelerId, { notizbuch: nb });
  APP.notizbuchAktivSektion = nb.sektionen.length - 1;
  renderNotizbuch();
}

function deleteNotizbuchSektion(index) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const nb = getNotizbuch(s);
  if (nb.sektionen.length <= 1) { showToast('Mindestens eine Sektion behalten', 'error'); return; }
  if (!confirm(`Sektion "${nb.sektionen[index].titel}" und alle Notizen darin löschen?`)) return;
  nb.sektionen.splice(index, 1);
  APP.notizbuchAktivSektion = Math.max(0, index - 1);
  DB.updateSchueler(APP.currentSchuelerId, { notizbuch: nb });
  renderNotizbuch();
}

function addNotizbuchNotiz(sektionIndex) {
  const textarea = document.getElementById('nb-neue-notiz');
  const text = textarea ? textarea.value.trim() : '';
  if (!text) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const nb = getNotizbuch(s);
  const sek = nb.sektionen[sektionIndex];
  if (!sek) return;
  sek.notizen.push({
    id: DB.generateId(), text,
    datum: new Date().toISOString().split('T')[0],
    erstellt: new Date().toISOString(),
  });
  DB.updateSchueler(APP.currentSchuelerId, { notizbuch: nb });
  if (textarea) textarea.value = '';
  renderNotizbuch();
  showToast('Notiz gespeichert', 'success');
}

function deleteNotizbuchNotiz(notizId, sektionIndex) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const nb = getNotizbuch(s);
  const sek = nb.sektionen[sektionIndex];
  if (!sek) return;
  sek.notizen = sek.notizen.filter(n => n.id !== notizId);
  DB.updateSchueler(APP.currentSchuelerId, { notizbuch: nb });
  renderNotizbuch();
}

// ============================================================
// WOHLBEFINDEN-TRACKER
// ============================================================

function renderWohlbefinden() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;

  // Render scale buttons (1-10)
  const skala = document.getElementById('wohlbefinden-skala');
  if (skala) {
    const emojis = ['😫','😢','😞','😕','😐','🙂','😊','😄','😁','🤩'];
    const farben = ['#DC2626','#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#22C55E','#10B981','#059669','#047857'];
    skala.innerHTML = emojis.map((e, i) => {
      const nr = i + 1;
      return `<button class="wohlbefinden-btn" style="--wb-farbe:${farben[i]};"
        onclick="selectWohlbefinden(${nr}, this)" title="${nr}/10">
        <span class="wb-emoji">${e}</span>
        <span class="wb-nr">${nr}</span>
      </button>`;
    }).join('');
  }

  // WHO-5 Items (H3) — validierter Wohlbefinden-Index
  const who5Container = document.getElementById('who5-items-container');
  if (who5Container && typeof WHO5_ITEMS !== 'undefined') {
    const skalaLabels = ['', 'Zu keinem Zeitpunkt (0)', 'Ab und zu (1)', 'Weniger als die Hälfte der Zeit (2)', 'Etwas mehr als die Hälfte der Zeit (3)', 'Meistens (4)', 'Die ganze Zeit (5)'];
    who5Container.innerHTML = `
      <div style="font-size:11px;color:var(--text-secondary);margin-bottom:6px;">
        <strong>WHO-5 Wohlbefinden</strong> <span style="color:var(--grau);">(letzte 2 Wochen)</span>
      </div>
      ${WHO5_ITEMS.map((item, i) => `
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="flex:1;font-size:11px;">${item}</span>
          <select data-who5="${i}" style="font-size:11px;padding:2px 4px;border:1px solid #D1D5DB;border-radius:4px;">
            <option value="">—</option>
            ${[0,1,2,3,4,5].map(v => `<option value="${v}">${v}</option>`).join('')}
          </select>
        </div>
      `).join('')}
      <div style="font-size:10px;color:var(--grau);margin-top:4px;">Skala: 0 = Zu keinem Zeitpunkt, 5 = Die ganze Zeit. Score ≤28/100 = Depression-Screening positiv.</div>
    `;
  }

  // Render chart
  renderWohlbefindenChart(sid);

  // Trend-Pfeil und Mini-Chart der letzten 8
  const alleSortiert = DB.getWohlbefinden(sid).sort((a, b) => a.datum.localeCompare(b.datum));
  const letzte8 = alleSortiert.slice(-8);
  renderWohlbefindenMiniTrend(letzte8);

  // Render history (last 5)
  const eintraege = DB.getWohlbefinden(sid).sort((a, b) => b.datum.localeCompare(a.datum));
  const historie = document.getElementById('wohlbefinden-historie');
  if (historie) {
    if (eintraege.length === 0) {
      historie.innerHTML = '<div style="color:#9CA3AF;font-size:12px;text-align:center;padding:8px;">Noch keine Einträge</div>';
    } else {
      historie.innerHTML = eintraege.slice(0, 5).map(w => {
        const farben = ['','#DC2626','#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#22C55E','#10B981','#059669','#047857'];
        return `<div class="wb-eintrag">
          <span class="wb-eintrag-score" style="background:${farben[w.score]};">${w.score}</span>
          <span class="wb-eintrag-datum">${new Date(w.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })}</span>
          ${w.notiz ? `<span class="wb-eintrag-notiz">${w.notiz}</span>` : ''}
          <button class="btn-icon btn-xs" onclick="deleteWohlbefindenEintrag('${w.id}')" title="Löschen">✕</button>
        </div>`;
      }).join('');
    }
  }
}

// ---- Wohlbefinden Mini-Trend (letzte 8 Einträge + Trend-Pfeil) ----
function renderWohlbefindenMiniTrend(letzte8) {
  // Finde oder erstelle den Container (zwischen Chart und Historie)
  let container = document.getElementById('wb-mini-trend');
  const chartContainer = document.querySelector('.wohlbefinden-chart-container');
  if (!container && chartContainer) {
    container = document.createElement('div');
    container.id = 'wb-mini-trend';
    chartContainer.after(container);
  }
  if (!container) return;

  if (letzte8.length < 2) {
    container.innerHTML = '';
    return;
  }

  const ersterWert = letzte8[0].score;
  const letzterWert = letzte8[letzte8.length - 1].score;
  const diff = letzterWert - ersterWert;

  let trendPfeil, trendFarbe, trendLabel;
  if (diff > 1) {
    trendPfeil = '↑'; trendFarbe = '#059669'; trendLabel = 'Aufwärtstrend';
  } else if (diff < -1) {
    trendPfeil = '↓'; trendFarbe = '#DC2626'; trendLabel = 'Abwärtstrend';
  } else {
    trendPfeil = '→'; trendFarbe = '#6B7280'; trendLabel = 'Stabil';
  }

  const avg = (letzte8.reduce((s, w) => s + w.score, 0) / letzte8.length).toFixed(1);
  const wbFarben = ['','#DC2626','#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#22C55E','#10B981','#059669','#047857'];

  // Mini-Balken (Sparkline-artig)
  const maxH = 28;
  const barWidth = Math.min(24, Math.floor(150 / letzte8.length));

  container.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #F3F4F6;">
      <!-- Trend-Pfeil -->
      <div style="display:flex;align-items:center;gap:6px;">
        <span style="font-size:22px;font-weight:700;color:${trendFarbe};">${trendPfeil}</span>
        <div>
          <div style="font-size:12px;font-weight:600;color:${trendFarbe};">${trendLabel}</div>
          <div style="font-size:10px;color:#9CA3AF;">Ø ${avg}/10</div>
        </div>
      </div>

      <!-- Mini-Sparkline Balken -->
      <div style="display:flex;align-items:flex-end;gap:2px;height:${maxH}px;flex:1;justify-content:flex-end;">
        ${letzte8.map(w => {
          const h = Math.max(3, (w.score / 10) * maxH);
          return `<div title="${new Date(w.datum).toLocaleDateString('de-DE')}: ${w.score}/10"
            style="width:${barWidth}px;height:${h}px;background:${wbFarben[w.score]};border-radius:2px 2px 0 0;opacity:0.85;"></div>`;
        }).join('')}
      </div>

      <!-- Letzter Wert -->
      <div style="text-align:center;">
        <div style="font-size:20px;font-weight:700;color:${wbFarben[letzterWert]};">${letzterWert}</div>
        <div style="font-size:9px;color:#9CA3AF;">Aktuell</div>
      </div>
    </div>
  `;
}

function selectWohlbefinden(score, btn) {
  // Highlight selected
  document.querySelectorAll('.wohlbefinden-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  APP.wohlbefindenScore = score;
}

function saveWohlbefinden() {
  const score = APP.wohlbefindenScore;
  if (!score) return;
  const notiz = document.getElementById('wohlbefinden-notiz')?.value || '';
  // WHO-5 Items sammeln (falls ausgefüllt)
  let who5Items = null;
  const who5Container = document.getElementById('who5-items-container');
  if (who5Container) {
    const inputs = who5Container.querySelectorAll('select[data-who5]');
    if (inputs.length > 0) {
      who5Items = {};
      let anyFilled = false;
      inputs.forEach(inp => {
        const val = parseInt(inp.value);
        if (!isNaN(val)) { who5Items[inp.dataset.who5] = val; anyFilled = true; }
      });
      if (!anyFilled) who5Items = null;
    }
  }
  DB.addWohlbefinden(APP.currentSchuelerId, score, notiz, who5Items);
  APP.wohlbefindenScore = null;
  const input = document.getElementById('wohlbefinden-notiz');
  if (input) input.value = '';
  // WHO-5 Selects zurücksetzen
  if (who5Container) who5Container.querySelectorAll('select[data-who5]').forEach(s => s.value = '');
  renderWohlbefinden();
  const who5Score = who5Items ? Object.values(who5Items).reduce((s, v) => s + v, 0) * 4 : null;
  if (who5Score !== null && who5Score <= 28) {
    showToast('WHO-5 Score: ' + who5Score + '/100 — Depression-Screening POSITIV. Weitere Abklärung empfohlen.', 'warning');
  } else {
    showToast('Wohlbefinden gespeichert', 'success');
  }
}

function deleteWohlbefindenEintrag(id) {
  DB.deleteWohlbefinden(id);
  renderWohlbefinden();
}

function renderWohlbefindenChart(schuelerId) {
  const ctx = document.getElementById('wohlbefinden-chart');
  if (!ctx) return;

  if (APP.wohlbefindenChart) {
    APP.wohlbefindenChart.destroy();
    APP.wohlbefindenChart = null;
  }

  const eintraege = DB.getWohlbefinden(schuelerId)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(-20); // Last 20 entries

  if (eintraege.length < 2) {
    APP.wohlbefindenChart = null;
    return;
  }

  const labels = eintraege.map(w =>
    new Date(w.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  );
  const data = eintraege.map(w => w.score);

  APP.wohlbefindenChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Wohlbefinden',
        data,
        borderColor: '#6366F1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        borderWidth: 2.5,
        pointBackgroundColor: data.map(v => {
          if (v <= 3) return '#EF4444';
          if (v <= 5) return '#F59E0B';
          return '#22C55E';
        }),
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.3,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            afterLabel: (ctx) => {
              const entry = eintraege[ctx.dataIndex];
              return entry.notiz ? `"${entry.notiz}"` : '';
            },
          },
        },
      },
      scales: {
        y: { min: 0, max: 10, ticks: { stepSize: 2, font: { size: 10 } } },
        x: { ticks: { font: { size: 10 }, maxRotation: 45 } },
      },
    },
  });
}

// ============================================================
// STÄRKEN-PROFIL MODULE
// ============================================================

function renderStaerken() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const container = document.getElementById('staerken-container');
  if (!container) return;

  const s = DB.getSchuelerById(sid);
  const profil = s.staerkenProfil || {};
  const ratings = profil.ratings || {};
  const interessen = profil.interessen || [];
  const vorbilder = profil.vorbilder || [];
  const schutzfaktoren = profil.schutzfaktoren || [];
  const freitext = profil.freitext || '';

  // Calculate average
  const vals = STAERKEN_DIMENSIONEN.map(d => ratings[d.id] || 0).filter(v => v > 0);
  const avg = vals.length > 0 ? (vals.reduce((a,b) => a+b, 0) / vals.length).toFixed(1) : '–';
  const filled = vals.length;

  container.innerHTML = `
    <div class="staerken-layout">
      <!-- Radar Chart -->
      <div class="card staerken-card-chart">
        <div class="card-header">
          <span>💪</span>
          <div class="card-title">Stärken-Radar</div>
          <div style="margin-left:auto;font-size:12px;color:#6B7280;">
            Durchschnitt: <strong>${avg}</strong>/10 · ${filled}/${STAERKEN_DIMENSIONEN.length} bewertet
          </div>
        </div>
        <div class="card-body" style="display:flex;justify-content:center;padding:10px;">
          <div style="width:100%;max-width:420px;aspect-ratio:1;">
            <canvas id="staerken-radar-chart"></canvas>
          </div>
        </div>
      </div>

      <!-- Sliders -->
      <div class="card staerken-card-sliders">
        <div class="card-header">
          <span>📊</span>
          <div class="card-title">Bewertung (1–10)</div>
        </div>
        <div class="card-body">
          ${STAERKEN_DIMENSIONEN.map(d => {
            const val = ratings[d.id] || 0;
            return `
            <div class="staerken-slider-row">
              <div class="staerken-slider-label">
                <span>${d.icon}</span>
                <div>
                  <div class="staerken-slider-titel">${d.label}</div>
                  <div class="staerken-slider-desc">${d.beschreibung}</div>
                </div>
              </div>
              <div class="staerken-slider-control">
                <input type="range" min="0" max="10" value="${val}"
                  class="staerken-range" style="--range-farbe:${d.farbe};"
                  oninput="updateStaerkenWert('${d.id}', this.value, this)">
                <span class="staerken-wert" id="staerken-wert-${d.id}" style="color:${d.farbe};">${val || '–'}</span>
              </div>
              ${(function(){
                const anker = STAERKEN_ANKER[d.id];
                if (!anker || !val) return '';
                const stufe = val <= 3 ? 'niedrig' : (val <= 6 ? 'mittel' : 'hoch');
                const label = val <= 3 ? '1–3 Wenig ausgeprägt' : (val <= 6 ? '4–6 Durchschnittlich' : '7–10 Stark ausgeprägt');
                const fc = val <= 3 ? '#EF4444' : (val <= 6 ? '#F59E0B' : '#22C55E');
                return '<div class="staerken-anker" id="staerken-anker-' + d.id + '" style="font-size:11px;margin-top:4px;padding:6px 8px;background:' + fc + '10;border-radius:6px;border-left:3px solid ' + fc + ';"><span style="font-weight:600;color:' + fc + ';">' + label + ':</span> <span style="color:#6B7280;">' + anker[stufe] + '</span></div>';
              })()}
            </div>`;
          }).join('')}
        </div>
      </div>

      <!-- Zusatzinfos -->
      <div class="card staerken-card-extra">
        <div class="card-header">
          <span>🌟</span>
          <div class="card-title">Ressourcen & Schutzfaktoren</div>
        </div>
        <div class="card-body">
          <!-- Interessen -->
          <div class="staerken-extra-group">
            <label>🎯 Interessen & Hobbys</label>
            <div class="staerken-tags" id="staerken-interessen">
              ${interessen.map((t, i) =>
                `<span class="staerken-tag">${t} <button onclick="removeStaerkenTag('interessen',${i})">✕</button></span>`
              ).join('')}
            </div>
            <div class="staerken-tag-add">
              <input type="text" id="staerken-interessen-input" placeholder="Interesse hinzufügen..."
                onkeydown="if(event.key==='Enter') addStaerkenTag('interessen')">
              <button class="btn btn-secondary btn-sm" onclick="addStaerkenTag('interessen')">+</button>
            </div>
          </div>

          <!-- Vorbilder -->
          <div class="staerken-extra-group">
            <label>⭐ Vorbilder & wichtige Personen</label>
            <div class="staerken-tags" id="staerken-vorbilder">
              ${vorbilder.map((t, i) =>
                `<span class="staerken-tag tag-vorbilder">${t} <button onclick="removeStaerkenTag('vorbilder',${i})">✕</button></span>`
              ).join('')}
            </div>
            <div class="staerken-tag-add">
              <input type="text" id="staerken-vorbilder-input" placeholder="Person hinzufügen..."
                onkeydown="if(event.key==='Enter') addStaerkenTag('vorbilder')">
              <button class="btn btn-secondary btn-sm" onclick="addStaerkenTag('vorbilder')">+</button>
            </div>
          </div>

          <!-- Schutzfaktoren -->
          <div class="staerken-extra-group">
            <label>🛡️ Schutzfaktoren</label>
            <div class="staerken-tags" id="staerken-schutzfaktoren">
              ${schutzfaktoren.map((t, i) =>
                `<span class="staerken-tag tag-schutz">${t} <button onclick="removeStaerkenTag('schutzfaktoren',${i})">✕</button></span>`
              ).join('')}
            </div>
            <div class="staerken-tag-add">
              <input type="text" id="staerken-schutzfaktoren-input" placeholder="Schutzfaktor hinzufügen..."
                onkeydown="if(event.key==='Enter') addStaerkenTag('schutzfaktoren')">
              <button class="btn btn-secondary btn-sm" onclick="addStaerkenTag('schutzfaktoren')">+</button>
            </div>
            <div class="staerken-schutz-vorschlaege">
              ${['Stabile Bezugsperson','Freundeskreis','Sportverein','Gute Schulleistung','Religiöse Gemeinschaft','Therapeutische Anbindung','Humor','Musisches Talent']
                .filter(v => !schutzfaktoren.includes(v))
                .slice(0, 5)
                .map(v => `<button class="staerken-vorschlag" onclick="addStaerkenTagDirect('schutzfaktoren','${v}')">${v}</button>`)
                .join('')}
            </div>
          </div>

          <!-- Freitext -->
          <div class="staerken-extra-group">
            <label>📝 Weitere Beobachtungen zu Stärken</label>
            <textarea class="staerken-freitext" id="staerken-freitext"
              placeholder="Was kann der Schüler besonders gut? Was fällt positiv auf?"
              onchange="saveStaerkenFreitext(this.value)">${freitext}</textarea>
          </div>
        </div>
      </div>
    </div>
  `;

  // Render radar chart
  renderStaerkenRadar(ratings);
}

function renderStaerkenRadar(ratings) {
  const ctx = document.getElementById('staerken-radar-chart');
  if (!ctx) return;

  if (APP.staerkenChart) {
    APP.staerkenChart.destroy();
    APP.staerkenChart = null;
  }

  const labels = STAERKEN_DIMENSIONEN.map(d => d.label);
  const data = STAERKEN_DIMENSIONEN.map(d => ratings[d.id] || 0);
  const colors = STAERKEN_DIMENSIONEN.map(d => d.farbe);

  APP.staerkenChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: 'Stärken',
        data,
        backgroundColor: 'rgba(99, 102, 241, 0.15)',
        borderColor: '#6366F1',
        borderWidth: 2,
        pointBackgroundColor: colors,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
      },
      scales: {
        r: {
          min: 0,
          max: 10,
          ticks: {
            stepSize: 2,
            font: { size: 10 },
            backdropColor: 'transparent',
          },
          pointLabels: {
            font: { size: 11, weight: '600' },
            color: '#374151',
          },
          grid: {
            color: '#E5E7EB',
          },
          angleLines: {
            color: '#E5E7EB',
          },
        },
      },
    },
  });
}

function updateStaerkenWert(dimId, value, el) {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  if (!s.staerkenProfil) s.staerkenProfil = { ratings: {}, interessen: [], vorbilder: [], schutzfaktoren: [], freitext: '' };
  s.staerkenProfil.ratings[dimId] = parseInt(value);
  DB.updateSchueler(sid, { staerkenProfil: s.staerkenProfil });

  // Update display
  const wertEl = document.getElementById(`staerken-wert-${dimId}`);
  if (wertEl) wertEl.textContent = value == 0 ? '–' : value;

  // Update rating anchor text
  const ankerEl = document.getElementById(`staerken-anker-${dimId}`);
  const anker = STAERKEN_ANKER[dimId];
  if (anker && parseInt(value) > 0) {
    const v = parseInt(value);
    const stufe = v <= 3 ? 'niedrig' : (v <= 6 ? 'mittel' : 'hoch');
    const label = v <= 3 ? '1–3 Wenig ausgeprägt' : (v <= 6 ? '4–6 Durchschnittlich' : '7–10 Stark ausgeprägt');
    const fc = v <= 3 ? '#EF4444' : (v <= 6 ? '#F59E0B' : '#22C55E');
    if (ankerEl) {
      ankerEl.style.background = fc + '10';
      ankerEl.style.borderLeftColor = fc;
      ankerEl.innerHTML = '<span style="font-weight:600;color:' + fc + ';">' + label + ':</span> <span style="color:#6B7280;">' + anker[stufe] + '</span>';
    } else {
      // Create anchor element if it doesn't exist yet (first interaction)
      const row = document.querySelector(`#staerken-wert-${dimId}`)?.closest('.staerken-slider-row');
      if (row) {
        const div = document.createElement('div');
        div.className = 'staerken-anker';
        div.id = `staerken-anker-${dimId}`;
        div.style.cssText = 'font-size:11px;margin-top:4px;padding:6px 8px;border-radius:6px;border-left:3px solid ' + fc + ';background:' + fc + '10;';
        div.innerHTML = '<span style="font-weight:600;color:' + fc + ';">' + label + ':</span> <span style="color:#6B7280;">' + anker[stufe] + '</span>';
        row.appendChild(div);
      }
    }
  }

  // Update chart
  renderStaerkenRadar(s.staerkenProfil.ratings);
}

function addStaerkenTag(field) {
  const input = document.getElementById(`staerken-${field}-input`);
  if (!input || !input.value.trim()) return;
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s.staerkenProfil) s.staerkenProfil = { ratings: {}, interessen: [], vorbilder: [], schutzfaktoren: [], freitext: '' };
  if (!s.staerkenProfil[field]) s.staerkenProfil[field] = [];
  s.staerkenProfil[field].push(input.value.trim());
  DB.updateSchueler(sid, { staerkenProfil: s.staerkenProfil });
  renderStaerken();
}

function addStaerkenTagDirect(field, value) {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s.staerkenProfil) s.staerkenProfil = { ratings: {}, interessen: [], vorbilder: [], schutzfaktoren: [], freitext: '' };
  if (!s.staerkenProfil[field]) s.staerkenProfil[field] = [];
  if (!s.staerkenProfil[field].includes(value)) {
    s.staerkenProfil[field].push(value);
    DB.updateSchueler(sid, { staerkenProfil: s.staerkenProfil });
    renderStaerken();
  }
}

function removeStaerkenTag(field, idx) {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s.staerkenProfil || !s.staerkenProfil[field]) return;
  s.staerkenProfil[field].splice(idx, 1);
  DB.updateSchueler(sid, { staerkenProfil: s.staerkenProfil });
  renderStaerken();
}

function saveStaerkenFreitext(text) {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s.staerkenProfil) s.staerkenProfil = { ratings: {}, interessen: [], vorbilder: [], schutzfaktoren: [], freitext: '' };
  s.staerkenProfil.freitext = text;
  DB.updateSchueler(sid, { staerkenProfil: s.staerkenProfil });
}

// ============================================================
// 5P-FALLFORMULIERUNG (mit Auto-Populate + Inline-Hypothesen)
// ============================================================

// Auto-gather suggestions from ALL collected data sources
function gatherAutoSuggestions(sid) {
  const suggestions = { presenting: [], predisposing: [], precipitating: [], perpetuating: [], protective: [] };
  const s = DB.getSchuelerById(sid);
  if (!s) return suggestions;

  // 1. Screening → Presenting
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  if (screenings.length > 0) {
    const latestScr = screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
    const flagged = latestScr.flaggedAreas || [];
    flagged.forEach(areaId => {
      const domain = SCREENING_DOMAINS.find(d => d.id === areaId);
      if (!domain) return;
      const score = latestScr.scores[areaId] || 0;
      let entry;
      if (domain.handlung && typeof resolveHandlung === 'function') {
        const handlung = resolveHandlung(domain, score);
        const cfg = HANDLUNG_CONFIG[handlung];
        entry = `${cfg.icon} ${domain.label} (Score: ${score})`;
      } else {
        entry = `${domain.icon} ${domain.label} (Score: ${score})`;
      }
      suggestions.presenting.push({ text: entry, source: 'Screening', key: domain.label });
    });
  }

  // 2. Anamnese → Predisposing + Precipitating
  const anamnese = s.anamnese || [];
  if (typeof ANAMNESE_KATEGORIEN !== 'undefined') {
    ANAMNESE_KATEGORIEN.forEach(kat => {
      if (kat.items) {
        // ACE-style checkbox items
        kat.items.forEach(item => {
          if (anamnese.includes(item.id) && item.gewicht >= 2) {
            suggestions.predisposing.push({ text: `⚠️ ${item.label}`, source: 'Anamnese', key: item.id });
          }
        });
      }
      if (kat.felder) {
        kat.felder.forEach(feld => {
          if (feld.typ === 'single') {
            const selected = feld.optionen.find(o => anamnese.includes(o.id));
            if (selected && selected.gewicht >= 2) {
              const target = kat.id === 'ace' ? 'predisposing' : (feld.id.includes('weiteres') || kat.id === 'ace') ? 'predisposing' : 'predisposing';
              suggestions[target].push({ text: `${kat.icon} ${selected.label}`, source: 'Anamnese', key: selected.id });
            }
          } else if (feld.typ === 'multi') {
            feld.optionen.forEach(opt => {
              if (anamnese.includes(opt.id) && opt.gewicht >= 1) {
                // Precipitating events vs predisposing factors
                const isPrecipitating = ['scheidung', 'flucht', 'tod_elternteil'].includes(opt.id);
                const target = isPrecipitating ? 'precipitating' : 'predisposing';
                suggestions[target].push({ text: `${kat.icon} ${opt.label}`, source: 'Anamnese', key: opt.id });
              }
            });
          }
        });
      }
    });
  }

  // 3. Stärken → Protective
  const profil = s.staerkenProfil || {};
  const ratings = profil.ratings || {};
  if (typeof STAERKEN_DIMENSIONEN !== 'undefined') {
    STAERKEN_DIMENSIONEN.forEach(d => {
      if ((ratings[d.id] || 0) >= 7) {
        suggestions.protective.push({ text: `💪 ${d.label} (${ratings[d.id]}/10)`, source: 'Stärken', key: d.id });
      }
    });
  }
  (profil.schutzfaktoren || []).forEach(sf => {
    suggestions.protective.push({ text: `🛡️ ${sf}`, source: 'Stärken', key: sf });
  });
  (profil.interessen || []).forEach(int => {
    suggestions.protective.push({ text: `🎯 ${int}`, source: 'Stärken', key: int });
  });

  // 4. Hypothesen → mapped to 5P columns
  try {
    const hypos = generateHypothesen(sid);
    hypos.forEach(h => {
      if (h.typ === 'risiko') {
        suggestions.predisposing.push({ text: `🧠 ${h.titel}`, source: 'Hypothese', key: h.id, hypo: true });
      } else if (h.typ === 'schutz') {
        suggestions.protective.push({ text: `🧠 ${h.titel}`, source: 'Hypothese', key: h.id, hypo: true });
      } else if (h.typ === 'differenzial') {
        suggestions.presenting.push({ text: `🔀 ${h.titel}`, source: 'Hypothese', key: h.id, hypo: true });
      }
    });
  } catch(e) {}

  // 5. Verhalten (from Notizen SOAP) → Presenting + Perpetuating
  const notizen = DB.getNotizen(sid);
  const soapNotizen = notizen.filter(n => n.soap && n.soap.objektiv);
  if (soapNotizen.length > 0 && typeof VERHALTENS_KATALOG !== 'undefined') {
    // Check which behaviors have been observed in SOAP notes
    VERHALTENS_KATALOG.forEach(kat => {
      const katIcon = kat.kategorie === 'externalisierend' ? '⚡' : kat.kategorie === 'internalisierend' ? '🌊' : kat.kategorie === 'beziehung' ? '🤝' : '🏫';
      kat.eintraege.forEach(e => {
        const mentioned = soapNotizen.some(n =>
          (n.soap.objektiv || '').toLowerCase().includes(e.titel.toLowerCase()) ||
          (n.soap.subjektiv || '').toLowerCase().includes(e.titel.toLowerCase())
        );
        if (mentioned) {
          suggestions.presenting.push({ text: `${katIcon} ${e.titel}`, source: 'SOAP', key: e.id });
        }
      });
    });
  }

  return suggestions;
}

function renderFallformulierung() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const container = document.getElementById('fallformulierung-container');
  if (!container) return;

  let ff = DB.getFallformulierung(sid);

  // Auto-populate: gather all suggestions and auto-add new ones
  const autoSugg = gatherAutoSuggestions(sid);
  if (!ff) {
    // Auto-create if there's data to populate
    const hasData = Object.values(autoSugg).some(arr => arr.length > 0);
    if (hasData) {
      ff = DB.createFallformulierung(sid);
    }
  }
  if (ff) {
    // Track dismissed suggestions
    if (!ff._dismissed) ff._dismissed = {};
    // Auto-add new suggestions that aren't already present and not dismissed
    let autoAdded = 0;
    ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(key => {
      const existing = ff[key] || [];
      const dismissed = ff._dismissed[key] || [];
      (autoSugg[key] || []).forEach(s => {
        const isDuplicate = existing.some(e => e.includes(s.key) || e === s.text || (s.key && e.includes(s.key)));
        const isDismissed = dismissed.includes(s.key);
        if (!isDuplicate && !isDismissed && !s.hypo) {
          ff[key].push(s.text);
          autoAdded++;
        }
      });
    });
    if (autoAdded > 0) {
      DB.saveFallformulierung(ff);
    }
  }

  // Get pending suggestions (hypo-based that aren't yet added)
  const pendingSugg = {};
  if (ff) {
    ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(key => {
      const existing = ff[key] || [];
      const dismissed = ff._dismissed[key] || [];
      pendingSugg[key] = (autoSugg[key] || []).filter(s => {
        if (!s.hypo) return false;
        const isDuplicate = existing.some(e => e.includes(s.key) || e === s.text);
        const isDismissed = dismissed.includes(s.key);
        return !isDuplicate && !isDismissed;
      });
    });
  }

  const pDefs = [
    { key: 'presenting',     label: 'Presenting',     farbe: '#EF4444', bg: '#FEF2F2', desc: 'Aktuelle Symptome & Probleme' },
    { key: 'predisposing',   label: 'Predisposing',   farbe: '#F97316', bg: '#FFF7ED', desc: 'Vorbestehende Risikofaktoren' },
    { key: 'precipitating',  label: 'Precipitating',  farbe: '#EAB308', bg: '#FEFCE8', desc: 'Auslösende Ereignisse' },
    { key: 'perpetuating',   label: 'Perpetuating',   farbe: '#3B82F6', bg: '#EFF6FF', desc: 'Aufrechterhaltende Faktoren' },
    { key: 'protective',     label: 'Protective',     farbe: '#22C55E', bg: '#F0FDF4', desc: 'Schutzfaktoren & Ressourcen' },
  ];

  // Inline hypotheses
  let hypothesenHtml = '';
  try {
    const hypos = generateHypothesen(sid);
    if (hypos && hypos.length > 0) {
      hypothesenHtml = render5PInlineHypothesen(hypos);
    }
  } catch(e) {}

  container.innerHTML = `
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <div>
        <h3 style="margin:0;font-size:18px;">🧩 5P-Fallformulierung</h3>
        <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Klinische Fallkonzeption — automatisch befüllt aus allen gesammelten Daten</p>
      </div>
      <div style="display:flex;gap:8px;">
        ${typeof FIVEP_BEISPIEL_KOMPLETT !== 'undefined' ? `<button class="btn btn-secondary btn-sm" onclick="open5PBeispiel()">📖 Beispiel</button>` : ''}
        ${ff ? `<button class="btn btn-secondary btn-sm" onclick="generate5PHypothese()">💡 Hypothese generieren</button>` : ''}
        ${ff ? `<button class="btn btn-secondary btn-sm" onclick="fivePToRoadmap()">🗺️ → Förderplan</button>` : ''}
        ${ff ? `<button class="btn btn-outline btn-sm" onclick="delete5P()">🗑</button>` : ''}
      </div>
    </div>

    <div class="fivep-grid">
      ${pDefs.map(p => {
        const items = ff ? (ff[p.key] || []) : [];
        const pending = pendingSugg[p.key] || [];
        return `
          <div class="fivep-column" style="border-top:3px solid ${p.farbe};">
            <div class="fivep-col-header" style="background:${p.bg};">
              <span class="fivep-col-dot" style="background:${p.farbe};"></span>
              <div style="flex:1;">
                <div style="display:flex;align-items:center;gap:6px;">
                  <strong>${p.label}</strong>
                  <span style="font-size:11px;color:${p.farbe};font-weight:600;">${items.length}</span>
                  <button class="soap-beispiel-btn" onclick="toggle5PHilfe('${p.key}')" title="Erklärung & Beispiele" style="font-size:13px;line-height:1;">ℹ️</button>
                </div>
                <div class="fivep-col-desc">${p.desc}</div>
              </div>
            </div>
            <div class="fivep-hilfe-box" id="fivep-hilfe-${p.key}" style="display:none;"></div>
            <div class="fivep-col-body">
              <div class="fivep-tags" id="fivep-tags-${p.key}">
                ${items.map((item, i) => `
                  <span class="fivep-tag" style="background:${p.bg};border-color:${p.farbe};">
                    ${item}
                    <span class="fivep-tag-del" onclick="remove5PTag('${p.key}', ${i})">×</span>
                  </span>
                `).join('')}
                ${pending.map(s => `
                  <span class="fivep-tag fivep-tag-suggestion" style="background:${p.bg}80;border-color:${p.farbe};border-style:dashed;opacity:0.75;">
                    ${s.text}
                    <span class="fivep-tag-accept" onclick="accept5PSuggestion('${p.key}','${s.key.replace(/'/g, "\\'")}','${s.text.replace(/'/g, "\\'")}')" title="Übernehmen" style="cursor:pointer;color:#22C55E;font-weight:bold;margin-left:4px;">✓</span>
                    <span class="fivep-tag-del" onclick="dismiss5PSuggestion('${p.key}','${s.key.replace(/'/g, "\\'")}')" title="Ablehnen">×</span>
                  </span>
                `).join('')}
              </div>
              <div class="fivep-input-row">
                <input type="text" class="fivep-input" id="fivep-input-${p.key}"
                  placeholder="Faktor eingeben…"
                  onkeydown="if(event.key==='Enter'){add5PTag('${p.key}')}" />
                <button class="btn btn-sm" style="background:${p.farbe};color:#fff;border:none;"
                  onclick="add5PTag('${p.key}')">+</button>
              </div>
            </div>
          </div>`;
      }).join('')}
    </div>

    <div class="fivep-hypothese" style="margin-top:20px;">
      <label style="font-weight:600;font-size:13px;display:block;margin-bottom:6px;">
        💡 Klinische Hypothese / Formulierung
      </label>
      <textarea class="fivep-hypothese-input" id="fivep-hypothese" rows="4"
        placeholder="Zusammenfassende klinische Hypothese basierend auf den 5P-Faktoren…"
        onchange="save5PHypothese(this.value)">${ff ? (ff.hypothese || '') : ''}</textarea>
    </div>

    ${ff ? renderHandlungsTriage(ff, sid) : ''}
    ${ff ? render5PPatternAnalysis(ff) : ''}
    ${ff ? render5PKomorbidity(ff) : ''}

    <!-- Inline Hypothesen (vorher separater Tab) -->
    ${hypothesenHtml}

    <!-- Radar-Chart -->
    <div id="fivep-radar-container" style="margin-top:18px;max-width:400px;margin-left:auto;margin-right:auto;">
      <canvas id="fivep-radar-chart" width="400" height="300"></canvas>
    </div>
  `;

  // Radar-Chart initialisieren
  if (ff) setTimeout(render5PRadar, 50);
}

// Accept a hypothesis-based suggestion into 5P
function accept5PSuggestion(key, suggKey, text) {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);
  if (!ff[key]) ff[key] = [];
  if (!ff[key].includes(text)) ff[key].push(text);
  DB.saveFallformulierung(ff);
  renderFallformulierung();
}

// Dismiss a suggestion so it doesn't appear again
function dismiss5PSuggestion(key, suggKey) {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) return;
  if (!ff._dismissed) ff._dismissed = {};
  if (!ff._dismissed[key]) ff._dismissed[key] = [];
  if (!ff._dismissed[key].includes(suggKey)) ff._dismissed[key].push(suggKey);
  DB.saveFallformulierung(ff);
  renderFallformulierung();
}

// Render hypotheses inline within the 5P view
function render5PInlineHypothesen(hypothesen) {
  if (!hypothesen || hypothesen.length === 0) return '';

  const diffs = hypothesen.filter(h => h.typ === 'differenzial');
  const risikos = hypothesen.filter(h => h.typ === 'risiko').sort((a, b) => b.staerkeWert - a.staerkeWert).slice(0, 8);
  const schutz = hypothesen.filter(h => h.typ === 'schutz').slice(0, 5);

  function miniCard(h) {
    const borderColor = h.typ === 'schutz' ? '#22C55E' : h.typ === 'differenzial' ? '#8B5CF6'
      : h.staerkeWert >= 4 ? '#991B1B' : h.staerkeWert >= 3 ? '#EF4444' : '#F59E0B';
    const typIcon = h.typ === 'schutz' ? '🛡️' : h.typ === 'differenzial' ? '🔀' : '⚠️';
    const staerkeLabel = h.staerkeWert >= 4 ? 'Sehr wahrsch.' : h.staerkeWert >= 2 ? 'Wahrsch.' : 'Hinweis';
    return `
      <div style="border-left:3px solid ${borderColor};padding:8px 12px;background:#fff;border-radius:0 6px 6px 0;margin-bottom:6px;font-size:12px;">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span>${typIcon}</span>
          <strong style="flex:1;">${h.titel}</strong>
          ${h._konfidenz != null ? `<span style="font-size:10px;color:#6B7280;background:#F3F4F6;padding:1px 6px;border-radius:8px;">${h._konfidenz}%</span>` : ''}
          <span style="font-size:10px;padding:1px 6px;border-radius:8px;background:${borderColor}15;color:${borderColor};font-weight:600;">${staerkeLabel}</span>
        </div>
        <details style="font-size:11px;color:#6B7280;">
          <summary style="cursor:pointer;">Details</summary>
          <p style="margin:4px 0;">${h.erklaerung}</p>
          ${h.empfehlung ? `<p style="margin:4px 0;color:#1D4ED8;"><strong>→</strong> ${h.empfehlung}</p>` : ''}
          <p style="margin:2px 0;font-size:10px;">📚 ${h.quelle}</p>
        </details>
      </div>`;
  }

  let html = '<div style="margin-top:24px;">';
  html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">';
  html += '<h3 style="margin:0;font-size:16px;">🧠 Klinische Hypothesen</h3>';
  html += `<span style="font-size:12px;color:#6B7280;">${hypothesen.length} aktiv</span>`;
  html += `<button class="btn btn-sm btn-outline-primary" style="margin-left:auto;font-size:11px;" onclick="showPhase('analyse', 'hypothesen-tab')">Alle anzeigen →</button>`;
  html += '</div>';

  // Differenzialdiagnosen (prominently)
  if (diffs.length > 0) {
    html += '<div style="margin-bottom:14px;">';
    html += '<div style="font-size:12px;font-weight:600;color:#5B21B6;margin-bottom:6px;">🔀 Differenzialdiagnosen (' + diffs.length + ')</div>';
    diffs.forEach(h => { html += miniCard(h); });
    html += '</div>';
  }

  // Top Risiko-Hypothesen
  if (risikos.length > 0) {
    html += '<div style="margin-bottom:14px;">';
    html += '<div style="font-size:12px;font-weight:600;color:#991B1B;margin-bottom:6px;">⚠️ Top Risiko-Hypothesen (' + risikos.length + ')</div>';
    risikos.forEach(h => { html += miniCard(h); });
    html += '</div>';
  }

  // Schutz-Hypothesen
  if (schutz.length > 0) {
    html += '<div style="margin-bottom:14px;">';
    html += '<div style="font-size:12px;font-weight:600;color:#166534;margin-bottom:6px;">🛡️ Schutzfaktoren (' + schutz.length + ')</div>';
    schutz.forEach(h => { html += miniCard(h); });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function add5PTag(key) {
  const input = document.getElementById(`fivep-input-${key}`);
  const val = input.value.trim();
  if (!val) return;

  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) {
    ff = DB.createFallformulierung(sid);
  }
  if (!ff[key]) ff[key] = [];
  ff[key].push(val);
  DB.saveFallformulierung(ff);
  input.value = '';
  renderFallformulierung();
}

function remove5PTag(key, idx) {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) return;
  ff[key].splice(idx, 1);
  DB.saveFallformulierung(ff);
  renderFallformulierung();
}

function save5PHypothese(text) {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) {
    ff = DB.createFallformulierung(sid);
  }
  ff.hypothese = text;
  DB.saveFallformulierung(ff);
}

function delete5P() {
  if (!confirm('5P-Formulierung wirklich zurücksetzen?')) return;
  const sid = APP.currentSchuelerId;
  const ff = DB.getFallformulierung(sid);
  if (ff) DB.deleteFallformulierung(ff.id);
  renderFallformulierung();
  showToast('5P-Formulierung zurückgesetzt', 'success');
}

// ---- 5P Suggestion Chips pro Spalte (simplified — main logic is in gatherAutoSuggestions) ----
function render5PSuggestions(key, existingTags) {
  // Minimal static suggestions as quick-add chips
  const suggestions = {
    presenting: [],
    predisposing: ['Familiäre Vorbelastung', 'Bindungsstörung', 'Vernachlässigung'],
    precipitating: ['Schulwechsel', 'Trennung der Eltern', 'Verlust/Tod', 'Mobbing'],
    perpetuating: ['Fehlende Tagesstruktur', 'Soziale Isolation', 'Negative Denkmuster'],
    protective: ['Stabile Bezugsperson', 'Hobbys/Interessen', 'Peer-Gruppe'],
  };

  const chips = (suggestions[key] || []).filter(s => !existingTags.includes(s));
  if (chips.length === 0) return '';

  return '<div class="suggestion-chips" style="margin-top:6px;">' +
    chips.slice(0, 5).map(c =>
      `<button type="button" class="suggestion-chip" onclick="add5PTagDirect('${key}','${c.replace(/'/g, "\\'")}')">${c}</button>`
    ).join('') + '</div>';
}

function add5PTagDirect(key, value) {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);
  if (!ff[key]) ff[key] = [];
  if (ff[key].includes(value)) return;
  ff[key].push(value);
  DB.saveFallformulierung(ff);
  renderFallformulierung();
  // Radar aktualisieren
  setTimeout(render5PRadar, 50);
}

// ---- Auto-Hypothese ----
function generate5PHypothese() {
  const sid = APP.currentSchuelerId;
  const ff = DB.getFallformulierung(sid);
  if (!ff) return;
  const s = DB.getSchuelerById(sid);
  const name = s ? s.vorname : 'Der/Die Jugendliche';

  const presenting = (ff.presenting || []).join(', ') || '[keine Symptome eingetragen]';
  const predisposing = (ff.predisposing || []).join(', ') || '[keine Risikofaktoren]';
  const precipitating = (ff.precipitating || []).join(', ') || '[keine Auslöser]';
  const perpetuating = (ff.perpetuating || []).join(', ') || '[keine aufrechterhaltenden Faktoren]';
  const protective = (ff.protective || []).join(', ') || '[keine Schutzfaktoren]';

  // Basis-Narrativ
  let hypothese =
    `${name} zeigt aktuell ${presenting} (Presenting). ` +
    `Diese Problematik ist vor dem Hintergrund von ${predisposing} (Predisposing) zu verstehen ` +
    `und wurde ausgelöst durch ${precipitating} (Precipitating). ` +
    `Aufrechterhalten wird die Symptomatik durch ${perpetuating} (Perpetuating). ` +
    `Als Schutzfaktoren stehen ${protective} (Protective) zur Verfügung, ` +
    `die im Behandlungsverlauf gezielt gestärkt werden sollten.`;

  // Muster-basierte Interpretation
  const pres = ff.presenting || [];
  const extIcons = pres.filter(p => p.startsWith('⚡')).length;
  const intIcons = pres.filter(p => p.startsWith('🌊')).length;
  const relIcons = pres.filter(p => p.startsWith('🤝')).length;
  const schulIcons = pres.filter(p => p.startsWith('🏫')).length;

  if (extIcons > 0 || intIcons > 0 || relIcons > 0 || schulIcons > 0) {
    hypothese += '\n\n--- Muster-Interpretation ---\n';
    if (extIcons > intIcons && extIcons > 0) {
      hypothese += `Das klinische Bild ist überwiegend externalisierend geprägt (${extIcons} externalisierendes Verhalten). ` +
        `Dies deutet auf eine Stressverarbeitung über Aktivierung (Sympathikus) hin. ` +
        `Interventionen sollten auf Selbstregulation, Impulskontrolle und sichere Beziehungserfahrungen fokussieren. `;
    } else if (intIcons > extIcons && intIcons > 0) {
      hypothese += `Das klinische Bild ist überwiegend internalisierend geprägt (${intIcons} internalisierendes Verhalten). ` +
        `Dies deutet auf eine Stressverarbeitung über Rückzug (Dorsal-Vagal) hin. ` +
        `Interventionen sollten auf emotionale Aktivierung, Selbstwert und soziale Anbindung fokussieren. `;
    } else if (extIcons > 0 && intIcons > 0) {
      hypothese += `Es liegt ein gemischtes Bild vor mit externalisierenden (${extIcons}) und internalisierenden (${intIcons}) Anteilen. ` +
        `Dies kann auf eine instabile Regulationsfähigkeit hinweisen, bei der zwischen Über- und Untererregung gewechselt wird. ` +
        `Ein multimodaler Ansatz ist empfohlen. `;
    }
    if (relIcons > 0) {
      hypothese += `Zusätzlich zeigen sich ${relIcons} beziehungsbezogene Auffälligkeiten, die auf bindungsrelevante Themen hinweisen. `;
    }
    if (schulIcons > 0) {
      hypothese += `${schulIcons} schulbezogene Auffälligkeiten weisen auf Interventionsbedarf im schulischen Setting hin. `;
    }
  }

  // Handlungspriorität basierend auf Triage-Kategorien
  if (typeof SCREENING_DOMAINS !== 'undefined' && typeof resolveHandlung === 'function') {
    const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
    const latestScr = screenings.length > 0
      ? screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0]
      : null;
    const scrScores = latestScr ? (latestScr.scores || {}) : {};

    const prioItems = [];
    pres.forEach(tag => {
      const dom = SCREENING_DOMAINS.find(d => tag.includes(d.label));
      if (!dom || !dom.handlung) return;
      const sc = scrScores[dom.id] || 0;
      const handlung = resolveHandlung(dom, sc);
      prioItems.push({ dom, score: sc, handlung });
    });

    // Sortierung: krise > abklaerung > intervention > beobachtung
    const prioOrder = { krise: 0, abklaerung: 1, intervention: 2, beobachtung: 3 };
    prioItems.sort((a, b) => prioOrder[a.handlung] - prioOrder[b.handlung]);

    if (prioItems.length > 0) {
      hypothese += '\n\n--- Handlungspriorit\u00E4t ---\n';
      prioItems.forEach((item, idx) => {
        const cfg = HANDLUNG_CONFIG[item.handlung];
        let detail = '';
        if (item.handlung === 'krise') {
          detail = `Krisenprotokoll aktivieren${item.dom.ueberweisungAn ? ', ' + item.dom.ueberweisungAn + ' kontaktieren' : ''}`;
        } else if (item.handlung === 'abklaerung') {
          detail = `\u00DCberweisung an ${item.dom.ueberweisungAn || 'Fachstelle'} initiieren`;
          const themen = (typeof SCREENING_THEMA_MAP !== 'undefined' && SCREENING_THEMA_MAP[item.dom.id])
            ? SCREENING_THEMA_MAP[item.dom.id].slice(0, 3)
            : [];
          if (themen.length > 0) {
            detail += `\n   \u2192 Bis zur Diagnostik: ${themen.join(', ')}`;
          }
        } else if (item.handlung === 'intervention') {
          detail = 'In-house Arbeit m\u00F6glich';
        } else {
          detail = 'Beobachten und st\u00E4rken';
        }
        hypothese += `${cfg.icon} PRIORIT\u00C4T ${idx + 1}: ${item.dom.label} \u2014 ${detail}\n`;
      });
    }
  }

  // Hebelpunkt-Identifikation
  const perps = ff.perpetuating || [];
  if (perps.length >= 2) {
    hypothese += `\n\n--- Hebelpunkt-Analyse ---\n` +
      `Mit ${perps.length} aufrechterhaltenden Faktoren bieten sich mehrere Ansatzpunkte. ` +
      `Priorit\u00E4r sollte an "${perps[0]}" gearbeitet werden, da aufrechterhaltende Faktoren ` +
      `oft den effektivsten Hebel f\u00FCr Ver\u00E4nderung darstellen.`;
  }

  // Interventionsempfehlung basierend auf verwandten Themen
  if (typeof THEMA_INTERVENTIONEN !== 'undefined' && pres.length > 0) {
    const themenHits = {};
    pres.forEach(p => {
      // Suche verwandte Themen in VERHALTENS_KATALOG
      if (typeof VERHALTENS_KATALOG !== 'undefined') {
        VERHALTENS_KATALOG.forEach(kat => {
          kat.eintraege.forEach(e => {
            if (p.includes(e.titel) && e.verwandte_themen) {
              e.verwandte_themen.forEach(t => {
                themenHits[t] = (themenHits[t] || 0) + 1;
              });
            }
          });
        });
      }
    });
    const topThemen = Object.entries(themenHits).sort((a, b) => b[1] - a[1]).slice(0, 3);
    if (topThemen.length > 0) {
      hypothese += `\n\n--- Empfohlene Interventions-Themen ---\n` +
        topThemen.map((t, i) => `${i + 1}. ${t[0]} (${t[1]}× verknüpft)`).join('\n');
    }
  }

  const textarea = document.getElementById('fivep-hypothese');
  if (textarea) {
    textarea.value = hypothese;
    save5PHypothese(hypothese);
  }
  showToast('Hypothese generiert — bitte anpassen', 'success');
}

// ---- 5P → Förderplan ----
// Krisen-Themen die in Phase 1 (Sicherheit & Beziehung) gehören
const KRISEN_THEMEN = ['krisenintervention', 'suizidpraevention', 'selbstverletzung', 'trauma'];

function fivePToRoadmap() {
  const sid = APP.currentSchuelerId;
  const ff = DB.getFallformulierung(sid);
  if (!ff) return;

  const presenting = ff.presenting || [];

  // Screening-Daten für Score-basierte Eskalation
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  const latestScr = screenings.length > 0
    ? screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0]
    : null;
  const scores = latestScr ? (latestScr.scores || {}) : {};

  let roadmap = DB.getRoadmap(sid);
  if (!roadmap) {
    roadmap = DB.createRoadmap(sid);
    DB.saveRoadmap(roadmap);
  }

  const addToPhase = (nr, themen) => {
    const phase = roadmap.phasen.find(p => p.nr === nr);
    if (!phase) return 0;
    let count = 0;
    for (const tid of themen) {
      if (!phase.themen.includes(tid)) {
        phase.themen.push(tid);
        count++;
      }
    }
    return count;
  };

  let totalAdded = 0;

  // Map presenting tags → Domains → Themen mit handlungsbasierter Phasen-Zuordnung
  for (const tag of presenting) {
    const dom = SCREENING_DOMAINS.find(d => tag.includes(d.label));
    if (!dom) continue;

    const themen = (typeof SCREENING_THEMA_MAP !== 'undefined' && SCREENING_THEMA_MAP[dom.id])
      ? SCREENING_THEMA_MAP[dom.id]
      : [];
    if (themen.length === 0) continue;

    const score = scores[dom.id] || 0;
    const handlung = resolveHandlung(dom, score);

    switch (handlung) {
      case 'krise':
        // Phase 1 (Sicherheit & Beziehung): Krisen-Themen
        totalAdded += addToPhase(1, themen.filter(t => KRISEN_THEMEN.includes(t)));
        // Restliche Themen → Phase 4 für spätere Arbeit
        totalAdded += addToPhase(4, themen.filter(t => !KRISEN_THEMEN.includes(t)));
        break;
      case 'abklaerung':
        // Phase 2 (Exploration): Diagnostik-relevante Themen
        totalAdded += addToPhase(2, themen.slice(0, 2));
        // Phase 4: Adaptive Interventionen parallel
        totalAdded += addToPhase(4, themen.slice(2));
        break;
      case 'intervention':
        // Phase 4 (Intervention): Kernarbeit
        totalAdded += addToPhase(4, themen);
        break;
      case 'beobachtung':
        // Phase 5 (Konsolidierung): Monitoring-Themen
        totalAdded += addToPhase(5, themen);
        break;
    }
  }

  if (totalAdded === 0) {
    showToast('Keine neuen Themen gefunden oder alle bereits im Förderplan', 'info');
    return;
  }

  DB.saveRoadmap(roadmap);

  // Zusammenfassung der Phasen-Verteilung
  const phasenInfo = [1, 2, 4, 5]
    .map(nr => {
      const p = roadmap.phasen.find(ph => ph.nr === nr);
      return p && p.themen.length > 0 ? `Phase ${nr}: ${p.themen.length}` : null;
    })
    .filter(Boolean)
    .join(', ');

  showToast(`${totalAdded} Themen verteilt (${phasenInfo})`, 'success');
}

// ---- Komorbidität in 5P anzeigen ----
function render5PKomorbidity(ff) {
  const presenting = (ff.presenting || []).map(p => {
    const dom = SCREENING_DOMAINS.find(d => d.label === p);
    return dom ? dom.id : p.toLowerCase().replace(/\s/g, '-');
  });

  const matches = KOMORBIDITÄT_MUSTER.filter(m => m.bedingung(presenting));
  if (matches.length === 0) return '';

  return '<div style="margin-top:14px;">' +
    '<div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:8px;">⚡ Erkannte Muster</div>' +
    matches.map(m =>
      '<div style="padding:8px 12px;background:#fff;border:1px solid ' + m.farbe + '40;border-left:3px solid ' + m.farbe +
      ';border-radius:6px;margin-bottom:6px;font-size:12px;">' +
      '<strong style="color:' + m.farbe + ';">' + m.label + '</strong><br>' +
      '<span style="color:#6B7280;">' + m.beschreibung + '</span></div>'
    ).join('') + '</div>';
}

// ---- 5P Radar Chart ----
function render5PRadar() {
  const sid = APP.currentSchuelerId;
  const ff = DB.getFallformulierung(sid);
  const canvas = document.getElementById('fivep-radar-chart');
  if (!canvas || !ff) return;

  // Alten Chart zerstören
  if (window._fivepRadarChart) window._fivepRadarChart.destroy();

  const data = {
    labels: ['Presenting', 'Predisposing', 'Precipitating', 'Perpetuating', 'Protective'],
    datasets: [{
      label: '5P-Profil',
      data: [
        (ff.presenting || []).length,
        (ff.predisposing || []).length,
        (ff.precipitating || []).length,
        (ff.perpetuating || []).length,
        (ff.protective || []).length,
      ],
      backgroundColor: 'rgba(99, 102, 241, 0.15)',
      borderColor: '#6366F1',
      borderWidth: 2,
      pointBackgroundColor: ['#EF4444', '#F97316', '#EAB308', '#3B82F6', '#22C55E'],
      pointRadius: 5,
    }]
  };

  window._fivepRadarChart = new Chart(canvas, {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          beginAtZero: true,
          ticks: { stepSize: 1, font: { size: 11 } },
          pointLabels: { font: { size: 12, weight: '600' } },
          grid: { color: 'rgba(0,0,0,0.06)' },
        }
      }
    }
  });
}

function render5PPatternAnalysis(ff) {
  const total = (ff.presenting?.length || 0) + (ff.predisposing?.length || 0) +
    (ff.precipitating?.length || 0) + (ff.perpetuating?.length || 0) + (ff.protective?.length || 0);
  if (total < 3) return '';

  const protCount = ff.protective?.length || 0;
  const riskCount = (ff.presenting?.length || 0) + (ff.perpetuating?.length || 0);
  const ratio = riskCount > 0 ? (protCount / riskCount).toFixed(1) : '∞';

  let insight = '';
  if (protCount === 0) {
    insight = '⚠️ <strong>Keine Schutzfaktoren identifiziert.</strong> Fokus auf Ressourcenarbeit empfohlen.';
  } else if (protCount < riskCount) {
    insight = `⚡ <strong>Risiko-Schutz-Verhältnis ${ratio}:1</strong> — Schutzfaktoren gezielt aufbauen.`;
  } else {
    insight = `✅ <strong>Gutes Gleichgewicht</strong> (Verhältnis ${ratio}:1) — Schutzfaktoren sind vorhanden.`;
  }

  const perpCount = ff.perpetuating?.length || 0;
  let perpHint = '';
  if (perpCount >= 2) {
    perpHint = `<br>🔄 <strong>${perpCount} aufrechterhaltende Faktoren</strong> — diese sind oft der beste Hebel für Veränderung.`;
  }

  // Muster-Erkennung: Externalisierend vs. Internalisierend
  const pres = ff.presenting || [];
  const extCount = pres.filter(p => p.startsWith('⚡')).length;
  const intCount = pres.filter(p => p.startsWith('🌊')).length;
  let musterHint = '';
  if (extCount > 0 || intCount > 0) {
    if (extCount > intCount) {
      musterHint = `<br>🔥 <strong>Überwiegend externalisierendes Muster</strong> (${extCount}× extern. / ${intCount}× intern.) — Fokus auf Regulation & Impulskontrolle.`;
    } else if (intCount > extCount) {
      musterHint = `<br>💧 <strong>Überwiegend internalisierendes Muster</strong> (${intCount}× intern. / ${extCount}× extern.) — Fokus auf Aktivierung & Selbstwert.`;
    } else if (extCount > 0 && intCount > 0) {
      musterHint = `<br>🔀 <strong>Gemischtes Muster</strong> (${extCount}× extern. / ${intCount}× intern.) — Multimodaler Ansatz empfohlen.`;
    }
  }

  // Interventions-Empfehlungen basierend auf Presenting + Perpetuating
  let interventionHtml = '';
  if (typeof VERHALTENS_KATALOG !== 'undefined' && typeof THEMA_INTERVENTIONEN !== 'undefined') {
    const themenHits = {};
    pres.forEach(p => {
      VERHALTENS_KATALOG.forEach(kat => {
        kat.eintraege.forEach(e => {
          if (p.includes(e.titel) && e.verwandte_themen) {
            e.verwandte_themen.forEach(t => {
              themenHits[t] = (themenHits[t] || 0) + 1;
            });
          }
        });
      });
    });
    const topThemen = Object.entries(themenHits).sort((a, b) => b[1] - a[1]).slice(0, 4);
    if (topThemen.length > 0) {
      interventionHtml = `
        <div style="margin-top:10px;padding:10px 12px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:8px;">
          <div style="font-size:12px;font-weight:600;color:#166534;margin-bottom:6px;">🎯 Empfohlene Interventions-Themen</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${topThemen.map(([thema, count]) =>
              `<span style="padding:3px 10px;background:#DCFCE7;border:1px solid #86EFAC;border-radius:12px;font-size:12px;color:#166534;">
                ${thema} <span style="color:#15803D;font-weight:600;">(${count}×)</span>
              </span>`
            ).join('')}
          </div>
        </div>`;
    }
  }

  // Stärken-Aktivierung
  let staerkenHtml = '';
  const prots = ff.protective || [];
  if (prots.length > 0 && pres.length > 0) {
    const staerken = prots.filter(p => p.startsWith('💪')).slice(0, 2);
    if (staerken.length > 0) {
      staerkenHtml = `
        <div style="margin-top:8px;padding:8px 12px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:8px;font-size:12px;">
          <strong style="color:#1D4ED8;">💡 Stärken-Aktivierung:</strong>
          ${staerken.map(s => `<em>${s.replace('💪 ', '')}</em>`).join(', ')}
          können gezielt als Ressource in der Arbeit an den Presenting-Faktoren eingesetzt werden.
        </div>`;
    }
  }

  // Hebelpunkt hervorheben
  let hebelHtml = '';
  const perps = ff.perpetuating || [];
  if (perps.length >= 1) {
    hebelHtml = `
      <div style="margin-top:8px;padding:8px 12px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:8px;font-size:12px;">
        <strong style="color:#C2410C;">🎯 Prioritärer Ansatzpunkt:</strong>
        <em>${perps[0]}</em> — Perpetuating-Faktoren sind der effektivste Hebel für nachhaltige Veränderung.
      </div>`;
  }

  return `
    <div class="fivep-analysis" style="margin-top:18px;">
      <div class="fivep-analysis-header">📊 Muster-Analyse</div>
      <div class="fivep-analysis-body">
        <div class="fivep-analysis-stat">
          <span class="fivep-stat-num">${total}</span>
          <span class="fivep-stat-label">Faktoren gesamt</span>
        </div>
        <div class="fivep-analysis-stat">
          <span class="fivep-stat-num" style="color:#EF4444;">${riskCount}</span>
          <span class="fivep-stat-label">Risikofaktoren</span>
        </div>
        <div class="fivep-analysis-stat">
          <span class="fivep-stat-num" style="color:#22C55E;">${protCount}</span>
          <span class="fivep-stat-label">Schutzfaktoren</span>
        </div>
      </div>
      <div class="fivep-analysis-insight">${insight}${perpHint}${musterHint}</div>
      ${interventionHtml}
      ${hebelHtml}
      ${staerkenHtml}
    </div>
  `;
}

// ============================================================
// Handlungs-Triage-Panel in 5P-Fallformulierung
// ============================================================
function renderHandlungsTriage(ff, sid) {
  if (!ff || !ff.presenting || ff.presenting.length === 0) return '';
  if (typeof SCREENING_DOMAINS === 'undefined') return '';

  // Screening-Daten holen für Score-basierte Eskalation
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  const latestScr = screenings.length > 0
    ? screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0]
    : null;
  const scores = latestScr ? (latestScr.scores || {}) : {};

  // Presenting-Tags → Domains zuordnen und nach Handlung gruppieren
  const grouped = { krise: [], abklaerung: [], intervention: [], beobachtung: [] };

  ff.presenting.forEach(tag => {
    const dom = SCREENING_DOMAINS.find(d => tag.includes(d.label));
    if (!dom || !dom.handlung) return;

    const score = scores[dom.id] || 0;
    const handlung = resolveHandlung(dom, score);
    grouped[handlung].push({ dom, score, tag });
  });

  const totalGrouped = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);
  if (totalGrouped === 0) return '';

  // SCREENING_THEMA_MAP Themen-Empfehlungen für Interventions-Gruppe
  const getThemenForDomain = (domId) => {
    if (typeof SCREENING_THEMA_MAP === 'undefined') return [];
    return (SCREENING_THEMA_MAP[domId] || []).slice(0, 3);
  };

  let html = `
    <div style="margin-top:20px;border:2px solid #E5E7EB;border-radius:12px;overflow:hidden;">
      <div style="padding:12px 16px;background:#F8FAFC;border-bottom:1px solid #E5E7EB;display:flex;align-items:center;gap:8px;">
        <span style="font-size:16px;">\u{1F3E5}</span>
        <strong style="font-size:14px;color:#1F2937;">Klinische Handlungs\u00FCbersicht</strong>
        <span style="font-size:11px;color:#9CA3AF;margin-left:auto;">Automatisch aus Screening-Ergebnissen</span>
      </div>`;

  // Krise
  if (grouped.krise.length > 0) {
    html += `
      <div style="padding:12px 16px;background:#FEF2F2;border-bottom:2px solid #FCA5A5;">
        <div style="font-size:13px;font-weight:700;color:#991B1B;margin-bottom:8px;">\u{1F6A8} SOFORT HANDELN</div>`;
    grouped.krise.forEach(({ dom, score }) => {
      html += `
        <div style="padding:8px 12px;background:#fff;border:1px solid #FCA5A5;border-left:4px solid #DC2626;border-radius:6px;margin-bottom:6px;">
          <div style="font-weight:600;color:#991B1B;">${dom.icon} ${dom.label} <span style="font-weight:400;color:#6B7280;">(Score: ${score})</span></div>
          ${dom.ueberweisungAn ? `<div style="font-size:12px;color:#991B1B;margin-top:4px;">\u{260E}\u{FE0F} <strong>${dom.ueberweisungAn}</strong></div>` : ''}
          <div style="font-size:11px;color:#B91C1C;margin-top:4px;font-style:italic;">Krisenprotokoll pr\u00FCfen \u2014 Sicherheit hat Vorrang vor therapeutischer Arbeit</div>
        </div>`;
    });
    html += '</div>';
  }

  // Abklärung
  if (grouped.abklaerung.length > 0) {
    html += `
      <div style="padding:12px 16px;background:#F5F3FF;border-bottom:1px solid #DDD6FE;">
        <div style="font-size:13px;font-weight:700;color:#7C3AED;margin-bottom:8px;">\u{1F52C} FACHDIAGNOSTIK EMPFOHLEN</div>`;
    grouped.abklaerung.forEach(({ dom, score }) => {
      const themen = getThemenForDomain(dom.id);
      html += `
        <div style="padding:8px 12px;background:#fff;border:1px solid #DDD6FE;border-left:4px solid #7C3AED;border-radius:6px;margin-bottom:6px;">
          <div style="font-weight:600;color:#5B21B6;">${dom.icon} ${dom.label} <span style="font-weight:400;color:#6B7280;">(Score: ${score})</span></div>
          ${dom.ueberweisungAn ? `<div style="font-size:12px;color:#7C3AED;margin-top:4px;">\u{1F4CB} \u00DCberweisung an: <strong>${dom.ueberweisungAn}</strong></div>` : ''}
          ${themen.length > 0 ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">Was wir parallel tun k\u00F6nnen: ${themen.map(t => `<em>${t}</em>`).join(', ')}</div>` : ''}
        </div>`;
    });
    html += '</div>';
  }

  // Intervention
  if (grouped.intervention.length > 0) {
    html += `
      <div style="padding:12px 16px;background:#EFF6FF;border-bottom:1px solid #BFDBFE;">
        <div style="font-size:13px;font-weight:700;color:#2563EB;margin-bottom:8px;">\u{1F3AF} UNSERE ARBEIT</div>`;
    const allThemen = [];
    grouped.intervention.forEach(({ dom, score }) => {
      const themen = getThemenForDomain(dom.id);
      themen.forEach(t => { if (!allThemen.includes(t)) allThemen.push(t); });
      html += `
        <span style="display:inline-block;padding:4px 10px;background:#fff;border:1px solid #BFDBFE;border-radius:16px;font-size:12px;color:#1D4ED8;margin:0 4px 4px 0;">
          ${dom.icon} ${dom.label} (${score})
        </span>`;
    });
    if (allThemen.length > 0) {
      html += `
        <div style="font-size:12px;color:#6B7280;margin-top:8px;">
          Empfohlene Themen: ${allThemen.slice(0, 6).map(t => `<strong>${t}</strong>`).join(', ')}
        </div>`;
    }
    html += '</div>';
  }

  // Beobachtung
  if (grouped.beobachtung.length > 0) {
    html += `
      <div style="padding:12px 16px;background:#F9FAFB;">
        <div style="font-size:13px;font-weight:700;color:#6B7280;margin-bottom:8px;">\u{1F441}\u{FE0F} BEOBACHTEN</div>`;
    grouped.beobachtung.forEach(({ dom, score }) => {
      html += `
        <span style="display:inline-block;padding:4px 10px;background:#fff;border:1px solid #E5E7EB;border-radius:16px;font-size:12px;color:#6B7280;margin:0 4px 4px 0;">
          ${dom.icon} ${dom.label} (${score}) \u2014 st\u00E4rken
        </span>`;
    });
    html += '</div>';
  }

  html += '</div>';
  return html;
}

// ============================================================
// BERICHTE (SCAS, Elternbrief, Kollegenübergabe)
// ============================================================

function renderBerichte() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const container = document.getElementById('berichte-container');
  if (!container) return;

  const s = DB.getSchuelerById(sid);
  const name = `${s.vorname} ${s.nachname}`;

  container.innerHTML = `
    <div class="section-header" style="margin-bottom:18px;">
      <h3 style="margin:0;font-size:18px;">📄 Berichts-Generator</h3>
      <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Automatisierte Berichte auf Basis der Falldaten</p>
    </div>

    <div class="berichte-grid">
      <div class="bericht-card" onclick="generateBericht('scas')">
        <div class="bericht-card-icon" style="background:#FEF2F2;color:#EF4444;">🏛</div>
        <div class="bericht-card-body">
          <strong>SCAS-Bericht</strong>
          <p>Offizieller Bericht für den Service Central d'Assistance Sociale</p>
        </div>
        <span class="bericht-card-arrow">→</span>
      </div>

      <div class="bericht-card" onclick="generateBericht('eltern')">
        <div class="bericht-card-icon" style="background:#EFF6FF;color:#3B82F6;">👨‍👩‍👧</div>
        <div class="bericht-card-body">
          <strong>Elternbrief</strong>
          <p>Zusammenfassung für Eltern/Erziehungsberechtigte</p>
        </div>
        <span class="bericht-card-arrow">→</span>
      </div>

      <div class="bericht-card" onclick="generateBericht('uebergabe')">
        <div class="bericht-card-icon" style="background:#F0FDF4;color:#22C55E;">🤝</div>
        <div class="bericht-card-body">
          <strong>Kollegenübergabe</strong>
          <p>Fallübergabe an Kolleg:innen mit allen relevanten Informationen</p>
        </div>
        <span class="bericht-card-arrow">→</span>
      </div>

      <div class="bericht-card" onclick="showUeberweisungsForm()">
        <div class="bericht-card-icon" style="background:#FDF4FF;color:#A855F7;">📨</div>
        <div class="bericht-card-body">
          <strong>Überweisungsschreiben</strong>
          <p>Formelles Schreiben an Fachstellen (Psychologe, Psychiater, Beratungsstelle)</p>
        </div>
        <span class="bericht-card-arrow">→</span>
      </div>
    </div>

    <div id="bericht-preview" style="display:none;margin-top:20px;">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
        <h4 style="margin:0;" id="bericht-preview-titel"></h4>
        <div style="display:flex;gap:8px;">
          <button class="btn btn-sm btn-outline" onclick="druckeBericht()">🖨 Drucken</button>
          <button class="btn btn-sm btn-outline" onclick="document.getElementById('bericht-preview').style.display='none'">✕ Schließen</button>
        </div>
      </div>
      <div class="bericht-inhalt" id="bericht-inhalt"></div>
    </div>
  `;
}

function generateBericht(typ) {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  const name = `${s.vorname} ${s.nachname}`;
  const notizen = DB.getNotizen().filter(n => n.schuelerId === sid && n.kategorie === 'session');
  const screenings = DB.getScreenings(sid);
  const latestScr = screenings.length ? screenings.sort((a, b) => b.datum.localeCompare(a.datum))[0] : null;
  const roadmap = DB.getRoadmap(sid);
  const ff = DB.getFallformulierung(sid);
  const wb = DB.getWohlbefinden(sid);
  const heute = new Date().toLocaleDateString('de-DE');

  const preview = document.getElementById('bericht-preview');
  const titel = document.getElementById('bericht-preview-titel');
  const inhalt = document.getElementById('bericht-inhalt');

  let html = '';

  if (typ === 'scas') {
    titel.textContent = '🏛 SCAS-Bericht';
    html = generateSCASBericht(s, name, notizen, latestScr, roadmap, ff, wb, heute);
  } else if (typ === 'eltern') {
    titel.textContent = '👨‍👩‍👧 Elternbrief';
    html = generateElternbrief(s, name, notizen, roadmap, wb, heute);
  } else if (typ === 'uebergabe') {
    titel.textContent = '🤝 Kollegenübergabe';
    html = generateUebergabe(s, name, notizen, latestScr, roadmap, ff, wb, heute);
  }

  inhalt.innerHTML = html;
  preview.style.display = 'block';
  preview.scrollIntoView({ behavior: 'smooth' });
}

function generateSCASBericht(s, name, notizen, scr, roadmap, ff, wb, heute) {
  const alter = s.geburtsdatum ? Math.floor((Date.now() - new Date(s.geburtsdatum)) / 31557600000) : '—';
  const sitzungen = notizen.length;
  const ersteSitzung = sitzungen ? notizen.sort((a, b) => a.datum.localeCompare(b.datum))[0].datum : '—';
  const letzteSitzung = sitzungen ? notizen.sort((a, b) => b.datum.localeCompare(a.datum))[0].datum : '—';

  let scrAbschnitt = '';
  if (scr) {
    const flagged = Object.entries(scr.antworten || {}).filter(([, v]) => v >= 3);
    scrAbschnitt = `
      <h4>3. Screening-Ergebnisse</h4>
      <p>Datum: ${scr.datum} | Schweregrad: <strong>${scr.severity || 'nicht bewertet'}</strong></p>
      ${flagged.length ? `<p>Auffällige Bereiche: ${flagged.map(([k]) => k).join(', ')}</p>` : '<p>Keine auffälligen Bereiche.</p>'}
    `;
  }

  let ffAbschnitt = '';
  if (ff) {
    ffAbschnitt = `
      <h4>4. Klinische Fallformulierung (5P-Modell)</h4>
      ${ff.presenting?.length ? `<p><strong>Presenting:</strong> ${ff.presenting.join(', ')}</p>` : ''}
      ${ff.predisposing?.length ? `<p><strong>Predisposing:</strong> ${ff.predisposing.join(', ')}</p>` : ''}
      ${ff.precipitating?.length ? `<p><strong>Precipitating:</strong> ${ff.precipitating.join(', ')}</p>` : ''}
      ${ff.perpetuating?.length ? `<p><strong>Perpetuating:</strong> ${ff.perpetuating.join(', ')}</p>` : ''}
      ${ff.protective?.length ? `<p><strong>Protective:</strong> ${ff.protective.join(', ')}</p>` : ''}
      ${ff.hypothese ? `<p><em>Hypothese: ${ff.hypothese}</em></p>` : ''}
    `;
  }

  let roadmapAbschnitt = '';
  if (roadmap) {
    const aktiv = roadmap.phasen.find(p => p.status === 'aktiv');
    roadmapAbschnitt = `
      <h4>5. Förderplan</h4>
      <p>Aktuelle Phase: <strong>${aktiv ? `Phase ${aktiv.nr}` : 'Keine aktive Phase'}</strong></p>
      ${aktiv?.themen?.length ? `<p>Aktuelle Themen: ${aktiv.themen.map(t => t.titel || t).join(', ')}</p>` : ''}
    `;
  }

  return `
    <div class="bericht-doc">
      <div class="bericht-header-block">
        <strong>CDSE Luxembourg — Service Bezugspädagogik</strong><br>
        <strong>Bericht für SCAS</strong><br>
        Datum: ${heute}
      </div>
      <hr>
      <h4>1. Stammdaten</h4>
      <table class="bericht-table">
        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Geburtsdatum:</strong></td><td>${s.geburtsdatum || '—'}</td></tr>
        <tr><td><strong>Alter:</strong></td><td>${alter} Jahre</td></tr>
        <tr><td><strong>Klasse:</strong></td><td>${s.klasse || '—'}</td></tr>
        <tr><td><strong>Eintritt:</strong></td><td>${s.eintrittsdatum || '—'}</td></tr>
        <tr><td><strong>Risikostufe:</strong></td><td>${capitalize(s.risiko || 'niedrig')}</td></tr>
      </table>

      <h4>2. Betreuungsverlauf</h4>
      <p>Anzahl Sitzungen: <strong>${sitzungen}</strong></p>
      <p>Erste Sitzung: ${ersteSitzung} | Letzte Sitzung: ${letzteSitzung}</p>
      ${wb.length ? `<p>Letzter Wohlbefindens-Score: ${wb.sort((a, b) => b.datum.localeCompare(a.datum))[0].score}/10</p>` : ''}

      ${scrAbschnitt}
      ${ffAbschnitt}
      ${roadmapAbschnitt}

      <h4>6. Empfehlung</h4>
      <p><em>[Hier Empfehlung einfügen]</em></p>

      <div class="bericht-footer">
        <br><br>
        <p>_________________________<br>Bezugspädagoge/in<br>CDSE Luxembourg</p>
      </div>
    </div>
  `;
}

function generateElternbrief(s, name, notizen, roadmap, wb, heute) {
  const sitzungen = notizen.length;

  let fortschritt = '';
  if (wb.length >= 2) {
    const sorted = wb.sort((a, b) => a.datum.localeCompare(b.datum));
    const first = sorted[0].score;
    const last = sorted[sorted.length - 1].score;
    const diff = last - first;
    if (diff > 0) fortschritt = `Das Wohlbefinden von ${s.vorname} hat sich positiv entwickelt.`;
    else if (diff < 0) fortschritt = `${s.vorname} braucht weiterhin Unterstützung im Bereich Wohlbefinden.`;
    else fortschritt = `Das Wohlbefinden von ${s.vorname} ist stabil.`;
  }

  let themen = '';
  if (roadmap) {
    const aktiv = roadmap.phasen.find(p => p.status === 'aktiv');
    if (aktiv?.themen?.length) {
      themen = `<p>Aktuelle Schwerpunkte: ${aktiv.themen.map(t => t.titel || t).join(', ')}</p>`;
    }
  }

  return `
    <div class="bericht-doc">
      <div class="bericht-header-block">
        <strong>CDSE Luxembourg</strong><br>
        Datum: ${heute}
      </div>
      <hr>
      <p>Liebe Eltern von <strong>${name}</strong>,</p>

      <p>wir möchten Ihnen einen kurzen Überblick über den Stand der Betreuung Ihres Kindes geben.</p>

      <p><strong>Bisherige Sitzungen:</strong> ${sitzungen} Sitzung${sitzungen !== 1 ? 'en' : ''}</p>
      ${fortschritt ? `<p><strong>Entwicklung:</strong> ${fortschritt}</p>` : ''}
      ${themen}

      <p>Wir arbeiten weiterhin daran, ${s.vorname} bestmöglich zu unterstützen.
      Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>

      <p>Mit freundlichen Grüßen,<br>
      <em>Bezugspädagogisches Team — CDSE Luxembourg</em></p>
    </div>
  `;
}

function generateUebergabe(s, name, notizen, scr, roadmap, ff, wb, heute) {
  const sitzungen = notizen.length;
  const letzteNotizen = notizen.sort((a, b) => b.datum.localeCompare(a.datum)).slice(0, 3);

  return `
    <div class="bericht-doc">
      <div class="bericht-header-block">
        <strong>Kollegenübergabe — Vertraulich</strong><br>
        Datum: ${heute}
      </div>
      <hr>
      <h4>Stammdaten</h4>
      <p><strong>${name}</strong> | Klasse: ${s.klasse || '—'} | Risiko: ${capitalize(s.risiko || 'niedrig')} | Sitzungen: ${sitzungen}</p>

      ${ff ? `
        <h4>5P-Fallformulierung</h4>
        ${ff.presenting?.length ? `<p>🔴 <strong>Presenting:</strong> ${ff.presenting.join(', ')}</p>` : ''}
        ${ff.predisposing?.length ? `<p>🟠 <strong>Predisposing:</strong> ${ff.predisposing.join(', ')}</p>` : ''}
        ${ff.precipitating?.length ? `<p>🟡 <strong>Precipitating:</strong> ${ff.precipitating.join(', ')}</p>` : ''}
        ${ff.perpetuating?.length ? `<p>🔵 <strong>Perpetuating:</strong> ${ff.perpetuating.join(', ')}</p>` : ''}
        ${ff.protective?.length ? `<p>🟢 <strong>Protective:</strong> ${ff.protective.join(', ')}</p>` : ''}
        ${ff.hypothese ? `<p><em>${ff.hypothese}</em></p>` : ''}
      ` : ''}

      ${roadmap ? (() => {
        const aktiv = roadmap.phasen.find(p => p.status === 'aktiv');
        return `
          <h4>Förderplan</h4>
          <p>Phase: ${aktiv ? aktiv.nr : '—'} | Themen: ${aktiv?.themen?.length ? aktiv.themen.map(t => t.titel || t).join(', ') : 'Keine'}</p>
        `;
      })() : ''}

      ${wb.length ? (() => {
        const latest = wb.sort((a, b) => b.datum.localeCompare(a.datum))[0];
        return `<h4>Wohlbefinden</h4><p>Letzter Score: ${latest.score}/10 (${new Date(latest.datum).toLocaleDateString('de-DE')})</p>`;
      })() : ''}

      <h4>Letzte Sitzungen</h4>
      ${letzteNotizen.length ? letzteNotizen.map(n => `
        <div class="bericht-notiz-block">
          <strong>${n.datum}</strong>
          <p>${(n.inhalt || '').substring(0, 300)}${n.inhalt?.length > 300 ? '…' : ''}</p>
        </div>
      `).join('') : '<p>Keine Sitzungsprotokolle vorhanden.</p>'}

      <h4>Wichtige Hinweise für die Übernahme</h4>
      <p><em>[Hier individuelle Hinweise einfügen]</em></p>
    </div>
  `;
}

// ---- Überweisungsschreiben ----
function showUeberweisungsForm() {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  const preview = document.getElementById('bericht-preview');
  const titel = document.getElementById('bericht-preview-titel');
  const inhalt = document.getElementById('bericht-inhalt');

  titel.textContent = '📨 Überweisungsschreiben erstellen';

  const empfaengerOptionen = [
    { id: 'psychologe', label: 'Psycholog:in' },
    { id: 'psychiater', label: 'Kinder- & Jugendpsychiater:in' },
    { id: 'beratungsstelle', label: 'Beratungsstelle' },
    { id: 'schule', label: 'Schule / Schulleitung' },
    { id: 'gericht', label: 'Gericht / Jugendamt' },
    { id: 'andere', label: 'Andere Fachstelle' }
  ];

  inhalt.innerHTML = `
    <div style="max-width:500px;">
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Empfänger</label>
        <select id="ueberw-empfaenger" class="form-input" style="width:100%;">
          ${empfaengerOptionen.map(e => `<option value="${e.id}">${e.label}</option>`).join('')}
        </select>
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Name der Einrichtung / Person</label>
        <input type="text" id="ueberw-name" class="form-input" style="width:100%;" placeholder="z.B. Dr. Schmidt, CHL Pädiatrie">
      </div>
      <div style="margin-bottom:16px;">
        <label style="font-size:13px;font-weight:600;display:block;margin-bottom:6px;">Empfehlung / Fragestellung</label>
        <textarea id="ueberw-empfehlung" class="form-input" rows="3" style="width:100%;" placeholder="z.B. Abklärung ADHS, Traumatherapie empfohlen..."></textarea>
      </div>
      <button class="btn btn-primary" onclick="generateUeberweisungsschreiben()">Schreiben generieren</button>
    </div>
  `;

  preview.style.display = 'block';
  preview.scrollIntoView({ behavior: 'smooth' });
}

function generateUeberweisungsschreiben() {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  const name = `${s.vorname} ${s.nachname}`;
  const alter = s.geburtsdatum ? Math.floor((Date.now() - new Date(s.geburtsdatum)) / 31557600000) : '—';
  const heute = new Date().toLocaleDateString('de-DE');

  const empfaenger = document.getElementById('ueberw-empfaenger').value;
  const empfName = document.getElementById('ueberw-name').value || '[Empfänger]';
  const empfehlung = document.getElementById('ueberw-empfehlung').value || '[Fragestellung einfügen]';

  const empfLabels = {
    psychologe: 'Psycholog:in', psychiater: 'Kinder- & Jugendpsychiater:in',
    beratungsstelle: 'Beratungsstelle', schule: 'Schule / Schulleitung',
    gericht: 'Gericht / Jugendamt', andere: 'Fachstelle'
  };

  const notizen = DB.getNotizen().filter(n => n.schuelerId === sid && n.kategorie === 'session');
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  const latestScr = screenings.length ? screenings.sort((a, b) => b.datum.localeCompare(a.datum))[0] : null;
  const ff = DB.getFallformulierung(sid);
  const roadmap = DB.getRoadmap(sid);

  const sitzungen = notizen.length;
  const ersteSitzung = sitzungen ? notizen.sort((a, b) => a.datum.localeCompare(b.datum))[0].datum : '—';
  const letzteSitzung = sitzungen ? notizen.sort((a, b) => b.datum.localeCompare(a.datum))[0].datum : '—';

  // Auffällige Bereiche aus Screening
  let auffaellig = '';
  if (latestScr && latestScr.flaggedAreas && latestScr.flaggedAreas.length > 0) {
    auffaellig = latestScr.flaggedAreas.map(a => {
      const dom = SCREENING_DOMAINS.find(d => d.id === a);
      const label = dom ? dom.label : a;
      return `<span class="screening-hypo-link" onclick="scrollToHypothesenForDomain('${label}')" title="Verknüpfte Hypothesen anzeigen">${label}</span>`;
    }).join(', ');
  }

  // 5P-Zusammenfassung
  let fivePText = '';
  if (ff) {
    const parts = [];
    if (ff.presenting?.length) parts.push(`Vorstellungsgrund: ${ff.presenting.join(', ')}`);
    if (ff.predisposing?.length) parts.push(`Prädisponierende Faktoren: ${ff.predisposing.join(', ')}`);
    if (ff.precipitating?.length) parts.push(`Auslöser: ${ff.precipitating.join(', ')}`);
    if (ff.perpetuating?.length) parts.push(`Aufrechterhaltende Faktoren: ${ff.perpetuating.join(', ')}`);
    if (ff.protective?.length) parts.push(`Schutzfaktoren: ${ff.protective.join(', ')}`);
    fivePText = parts.join('<br>');
  }

  // Fortschritt
  let fortschritt = '';
  if (roadmap) {
    const aktiv = roadmap.phasen.find(p => p.status === 'aktiv');
    const abgeschlossen = roadmap.phasen.filter(p => p.status === 'abgeschlossen').length;
    fortschritt = `Aktuelle Phase: ${aktiv ? aktiv.nr + ' (' + (ROADMAP_PHASEN[aktiv.nr]?.titel || '') + ')' : '—'}, ${abgeschlossen} Phase${abgeschlossen !== 1 ? 'n' : ''} abgeschlossen`;
  }

  const titel = document.getElementById('bericht-preview-titel');
  const inhalt = document.getElementById('bericht-inhalt');

  titel.textContent = '📨 Überweisungsschreiben';

  inhalt.innerHTML = `
    <div class="bericht-doc">
      <div class="bericht-header-block">
        <strong>Centre de Documentation et de Services pour l'Éducation (CDSE)</strong><br>
        Überweisungsschreiben<br>
        <small>Datum: ${heute}</small>
      </div>
      <hr>

      <p>An: <strong>${empfLabels[empfaenger] || 'Fachstelle'}</strong><br>
      ${empfName}</p>

      <p>Betreff: <strong>Überweisung — ${name}</strong></p>

      <h4>1. Angaben zum Jugendlichen</h4>
      <table>
        <tr><td><strong>Name:</strong></td><td>${name}</td></tr>
        <tr><td><strong>Alter:</strong></td><td>${alter} Jahre</td></tr>
        <tr><td><strong>Klasse:</strong></td><td>${s.klasse || '—'}</td></tr>
        <tr><td><strong>Begleitung seit:</strong></td><td>${ersteSitzung !== '—' ? new Date(ersteSitzung).toLocaleDateString('de-DE') : '—'}</td></tr>
        <tr><td><strong>Anzahl Sitzungen:</strong></td><td>${sitzungen}</td></tr>
      </table>

      <h4>2. Anlass der Überweisung</h4>
      <p>${empfehlung}</p>

      ${auffaellig ? `
        <h4>3. Screening-Ergebnisse</h4>
        <p>Screening vom ${new Date(latestScr.datum).toLocaleDateString('de-DE')} ergab auffällige Werte in folgenden Bereichen:</p>
        <p><strong>${auffaellig}</strong></p>
      ` : ''}

      ${fivePText ? `
        <h4>${auffaellig ? '4' : '3'}. Klinische Einschätzung (5P-Modell)</h4>
        <p>${fivePText}</p>
        ${ff.hypothese ? `<p><em>Hypothese: ${ff.hypothese}</em></p>` : ''}
      ` : ''}

      ${fortschritt ? `
        <h4>${(auffaellig ? 4 : 3) + (fivePText ? 1 : 0) + 1}. Bisheriger Verlauf</h4>
        <p>${fortschritt}</p>
        <p>Die Begleitung umfasste bisher ${sitzungen} Sitzung${sitzungen !== 1 ? 'en' : ''}
        ${letzteSitzung !== '—' ? '(letzte: ' + new Date(letzteSitzung).toLocaleDateString('de-DE') + ')' : ''}.</p>
      ` : ''}

      <h4>Empfehlung</h4>
      <p>Aufgrund der oben beschriebenen Befunde wird eine weiterführende ${empfLabels[empfaenger] || 'fachliche'}ische Abklärung/Begleitung empfohlen.</p>

      <div class="bericht-footer">
        <p>Mit freundlichen Grüßen,</p>
        <br><br>
        <p>_________________________________<br>
        Bezugspädagoge/in, CDSE<br>
        ${heute}</p>
      </div>
    </div>
  `;
}

function druckeBericht() {
  const inhalt = document.getElementById('bericht-inhalt').innerHTML;
  const w = window.open('', '_blank');
  w.document.write(`<!DOCTYPE html><html><head><title>Bericht</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; padding: 40px; font-size: 13px; line-height: 1.6; color: #1F2937; }
      h4 { margin-top: 20px; color: #374151; border-bottom: 1px solid #E5E7EB; padding-bottom: 4px; }
      table { border-collapse: collapse; width: 100%; }
      td { padding: 4px 12px 4px 0; }
      .bericht-header-block { text-align: center; margin-bottom: 12px; }
      .bericht-notiz-block { background: #F9FAFB; padding: 8px 12px; border-radius: 6px; margin-bottom: 8px; }
      .bericht-footer { margin-top: 40px; }
      @media print { body { padding: 20px; } }
    </style>
  </head><body>${inhalt}</body></html>`);
  w.document.close();
  w.print();
}

// ============================================================
// FÖRDERPLAN / ROADMAP MODULE
// ============================================================

function renderRoadmap() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const container = document.getElementById('roadmap-container');
  if (!container) return;

  let roadmap = DB.getRoadmap(sid);
  const screenings = DB.getScreenings(sid).filter(s => s.abgeschlossen);
  const latestScreening = screenings.length ? screenings.sort((a,b) => b.datum.localeCompare(a.datum))[0] : null;
  const s = DB.getSchuelerById(sid);

  // No roadmap yet — show creation UI
  if (!roadmap) {
    container.innerHTML = `
      <div class="roadmap-empty">
        <div class="roadmap-empty-icon">🗺️</div>
        <h3>Noch kein Förderplan erstellt</h3>
        <p>Der Förderplan ist eine strukturierte Roadmap für die Begleitung von <strong>${s.vorname}</strong>.
           Er gliedert die Arbeit in 7 Phasen (0–6) — von der Vorbereitung bis zum Abschluss.</p>
        ${latestScreening
          ? `<button class="btn btn-primary" onclick="generateRoadmapFromScreening('${latestScreening.id}')">
               🔍 Aus Screening generieren
             </button>
             <p style="font-size:12px;color:#6B7280;margin-top:8px;">
               Basierend auf Screening vom ${new Date(latestScreening.datum).toLocaleDateString('de-DE')}
               (${(latestScreening.flaggedAreas||[]).length} auffällige Bereiche)
             </p>`
          : `<p style="font-size:12px;color:#9CA3AF;margin-top:8px;">
               💡 Tipp: Führe zuerst ein Screening durch — der Förderplan wird dann automatisch mit passenden Themen gefüllt.
             </p>`}
        <button class="btn btn-secondary" style="margin-top:8px;" onclick="createEmptyRoadmap()">
          📝 Leeren Förderplan erstellen
        </button>
      </div>`;
    return;
  }

  // Render existing roadmap
  const totalThemen = roadmap.phasen.reduce((sum, p) => sum + p.themen.length, 0);
  const erledigteThemen = roadmap.phasen.reduce((sum, p) => sum + p.themen.filter(t => t.status === 'abgeschlossen').length, 0);
  const gesamtFortschritt = totalThemen > 0 ? Math.round((erledigteThemen / totalThemen) * 100) : 0;
  const aktivePhasenNr = roadmap.phasen.find(p => p.status === 'aktiv')?.nr || 0;

  container.innerHTML = `
    <div class="roadmap-header">
      <div class="roadmap-header-left">
        <h2 class="roadmap-titel">🗺️ Förderplan — ${s.vorname} ${s.nachname}</h2>
        <div class="roadmap-meta">
          Erstellt: ${new Date(roadmap.erstellt).toLocaleDateString('de-DE')} ·
          ${totalThemen} Themen · Phase ${aktivePhasenNr}/6
        </div>
      </div>
      <div class="roadmap-header-actions">
        ${latestScreening ? `<button class="btn btn-secondary btn-sm" onclick="generateRoadmapFromScreening('${latestScreening.id}')">🔄 Aus Screening aktualisieren</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="druckeRoadmap()">🖨️ Drucken</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCurrentRoadmap()">🗑</button>
      </div>
    </div>

    <!-- Gesamtfortschritt -->
    <div class="roadmap-progress-bar-container">
      <div class="roadmap-progress-label">
        <span>Gesamtfortschritt</span>
        <span>${gesamtFortschritt}% (${erledigteThemen}/${totalThemen} Themen)</span>
      </div>
      <div class="roadmap-progress-bar">
        <div class="roadmap-progress-fill" style="width:${gesamtFortschritt}%;"></div>
      </div>
    </div>

    <!-- Phasen-Timeline -->
    <div class="roadmap-timeline">
      ${roadmap.phasen.map((phase, idx) => renderRoadmapPhase(roadmap, phase, idx)).join('')}
    </div>
  `;
}

function renderRoadmapPhase(roadmap, phase, idx) {
  const def = ROADMAP_PHASEN[idx];
  const isAktiv = phase.status === 'aktiv';
  const isErledigt = phase.status === 'erledigt';
  const isOffen = phase.status === 'offen';
  const themenDone = phase.themen.filter(t => t.status === 'abgeschlossen').length;
  const themenTotal = phase.themen.length;
  const phasePct = themenTotal > 0 ? Math.round((themenDone / themenTotal) * 100) : 0;

  // Find theme titles
  const getThemaTitel = (themaId) => {
    for (const kat of THEMEN_KATEGORIEN) {
      const t = kat.themen.find(th => th.id === themaId);
      if (t) return t.titel;
    }
    return themaId;
  };

  const getThemaKat = (themaId) => {
    for (const kat of THEMEN_KATEGORIEN) {
      if (kat.themen.find(th => th.id === themaId)) return kat;
    }
    return null;
  };

  return `
    <div class="roadmap-phase ${isAktiv ? 'aktiv' : ''} ${isErledigt ? 'erledigt' : ''} ${isOffen ? 'offen' : ''}">
      <!-- Phase-Marker -->
      <div class="roadmap-phase-marker" style="--phase-farbe:${def.farbe};">
        <div class="roadmap-phase-dot">
          ${isErledigt ? '✓' : def.nr}
        </div>
        ${idx < ROADMAP_PHASEN.length - 1 ? '<div class="roadmap-phase-line"></div>' : ''}
      </div>

      <!-- Phase-Content -->
      <div class="roadmap-phase-content">
        <div class="roadmap-phase-header" onclick="toggleRoadmapPhase(${phase.nr})">
          <div class="roadmap-phase-header-left">
            <span class="roadmap-phase-icon">${renderIcon(def.icon)}</span>
            <div>
              <div class="roadmap-phase-label">Phase ${def.nr}: ${def.label}</div>
              <div class="roadmap-phase-desc">${def.beschreibung}</div>
              <div class="roadmap-phase-timing">
                ${def.dauer}
                ${phase.startDatum ? ` · Start: ${new Date(phase.startDatum).toLocaleDateString('de-DE')}` : ''}
                ${phase.endDatum ? ` · Ende: ${new Date(phase.endDatum).toLocaleDateString('de-DE')}` : ''}
              </div>
            </div>
          </div>
          <div class="roadmap-phase-header-right">
            <span class="roadmap-phase-status-badge roadmap-status-${phase.status}">
              ${phase.status === 'aktiv' ? '▶ Aktiv' : phase.status === 'erledigt' ? '✓ Erledigt' : '○ Offen'}
            </span>
            ${themenTotal > 0 ? `<span class="roadmap-phase-count">${themenDone}/${themenTotal}</span>` : ''}
            <span class="roadmap-phase-arrow" id="roadmap-arrow-${phase.nr}">▼</span>
          </div>
        </div>

        <!-- Phase-Body (collapsible) -->
        <div class="roadmap-phase-body" id="roadmap-body-${phase.nr}" style="display:${isAktiv ? 'block' : 'none'};">
          <!-- Progress -->
          ${themenTotal > 0 ? `
          <div class="roadmap-phase-progress">
            <div class="roadmap-mini-bar"><div class="roadmap-mini-bar-fill" style="width:${phasePct}%;background:${def.farbe};"></div></div>
            <span>${phasePct}%</span>
          </div>` : ''}

          <!-- Themen-Liste -->
          <div class="roadmap-themen-liste">
            ${phase.themen.length === 0
              ? `<div class="roadmap-themen-empty">Noch keine Themen zugewiesen</div>`
              : phase.themen.map((t, ti) => {
                  const kat = getThemaKat(t.id);
                  return `
                  <div class="roadmap-thema-item ${t.status === 'abgeschlossen' ? 'done' : ''}">
                    <button class="roadmap-thema-check"
                      onclick="toggleRoadmapThema(${phase.nr}, ${ti})"
                      style="border-color:${def.farbe};${t.status === 'abgeschlossen' ? `background:${def.farbe};color:#fff;` : ''}">
                      ${t.status === 'abgeschlossen' ? '✓' : ''}
                    </button>
                    <div class="roadmap-thema-info">
                      <span class="roadmap-thema-titel">${getThemaTitel(t.id)}</span>
                      ${kat ? `<span class="roadmap-thema-kat" style="color:${kat.farbe};">${renderIcon(kat.icon)} ${kat.titel}</span>` : ''}
                    </div>
                    <div class="roadmap-thema-actions">
                      ${typeof findWikiForThema === 'function' && findWikiForThema(t.id) ? `<button class="btn-icon btn-xs" title="Wiki-Artikel" onclick="openWikiArtikel('${findWikiForThema(t.id).id}')" style="color:#3B82F6;">📚</button>` : ''}
                      <button class="btn-icon btn-xs" title="Thema öffnen" onclick="openRoadmapThema('${t.id}')">📋</button>
                      <button class="btn-icon btn-xs" title="Entfernen" onclick="removeRoadmapThema(${phase.nr}, ${ti})">✕</button>
                    </div>
                  </div>`;
                }).join('')}
          </div>

          <!-- Thema hinzufügen -->
          <div class="roadmap-add-thema">
            <select id="roadmap-add-select-${phase.nr}" class="roadmap-select">
              <option value="">+ Thema hinzufügen...</option>
              ${THEMEN_KATEGORIEN.map(kat =>
                `<optgroup label="${renderIcon(kat.icon)} ${kat.titel}">
                  ${kat.themen.map(t =>
                    `<option value="${t.id}">${t.titel}</option>`
                  ).join('')}
                </optgroup>`
              ).join('')}
            </select>
            <button class="btn btn-secondary btn-sm" onclick="addRoadmapThema(${phase.nr})">Hinzufügen</button>
          </div>

          <!-- Phase-Notizen -->
          <div class="roadmap-phase-notizen">
            <textarea class="roadmap-notiz-input" placeholder="Notizen zu dieser Phase..."
              id="roadmap-notiz-${phase.nr}"
              onchange="saveRoadmapNotiz(${phase.nr}, this.value)">${phase.notizen || ''}</textarea>
          </div>

          <!-- Phase-Aktionen -->
          <div class="roadmap-phase-actions">
            ${phase.status === 'offen' ? `<button class="btn" style="background:${def.farbe};color:#fff;border:none;padding:10px 20px;font-size:15px;font-weight:600;border-radius:8px;" onclick="setRoadmapPhaseStatus(${phase.nr}, 'aktiv')">▶ Phase starten</button>` : ''}
            ${phase.status === 'aktiv' ? `<button class="btn" style="background:${def.farbe};color:#fff;border:none;padding:10px 20px;font-size:15px;font-weight:600;border-radius:8px;box-shadow:0 2px 8px ${def.farbe}40;" onclick="setRoadmapPhaseStatus(${phase.nr}, 'erledigt')">✓ Phase abschließen</button>` : ''}
            ${phase.status === 'erledigt' ? `<button class="btn btn-secondary" style="padding:8px 16px;font-size:14px;" onclick="setRoadmapPhaseStatus(${phase.nr}, 'aktiv')">↺ Wieder öffnen</button>` : ''}
          </div>

          <!-- Phasen-Ressourcen -->
          ${renderPhaseRessourcen(phase, idx, roadmap)}
        </div>
      </div>
    </div>`;
}

function toggleRoadmapPhase(nr) {
  const body = document.getElementById(`roadmap-body-${nr}`);
  const arrow = document.getElementById(`roadmap-arrow-${nr}`);
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.style.transform = open ? '' : 'rotate(180deg)';
}

function createEmptyRoadmap() {
  const roadmap = DB.createRoadmap(APP.currentSchuelerId);
  DB.saveRoadmap(roadmap);
  renderRoadmap();
}

function generateRoadmapFromScreening(screeningId) {
  const scr = DB.getScreenings().find(s => s.id === screeningId);
  if (!scr) return;

  let roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) {
    roadmap = DB.createRoadmap(APP.currentSchuelerId);
  }
  roadmap.screeningId = screeningId;

  // Clear existing auto-generated themes
  roadmap.phasen.forEach(p => { p.themen = []; });

  const flagged = scr.flaggedAreas || [];
  const scores = scr.scores || {};

  // Collect all relevant themes from flagged domains, scored by severity
  const themaScores = {};
  flagged.forEach(domainId => {
    const domain = SCREENING_DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    const score = scores[domainId] || 0;
    const max = domain.items.length * 3;
    const severity = score / max; // 0-1

    const mappedThemen = SCREENING_THEMA_MAP[domainId] || [];
    mappedThemen.forEach((themaId, idx) => {
      // Primary theme gets full score, secondary themes get less
      const weight = severity * (1 - idx * 0.15);
      themaScores[themaId] = Math.max(themaScores[themaId] || 0, weight);
    });
  });

  // ── Hypothesen-basierte Themen hinzufügen ──
  try {
    const hypothesen = generateHypothesen(APP.currentSchuelerId);
    if (typeof HYPOTHESEN_THEMA_MAP !== 'undefined') {
      hypothesen.forEach(h => {
        if (!h.wiki_ids) return;
        const weight = h.typ === 'risiko' ? (h.staerkeWert * 0.2) : (h.typ === 'schutz' ? 0.15 : 0.25);
        h.wiki_ids.forEach(wid => {
          const mapped = HYPOTHESEN_THEMA_MAP[wid] || [];
          mapped.forEach((tid, idx) => {
            const w = weight * (1 - idx * 0.15);
            themaScores[tid] = Math.max(themaScores[tid] || 0, w);
          });
        });
      });
    }
  } catch(e) { /* silent */ }

  // Sort themes by score
  const sortedThemen = Object.entries(themaScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  // Assign to 7 phases (0-6)
  const assigned = new Set();

  // Phase 0 (Vorbereitung): Assessment-Themen
  const phase0Ids = ROADMAP_PHASEN[0].schwerpunkt;
  sortedThemen.forEach(t => {
    if (phase0Ids.includes(t.id)) {
      roadmap.phasen[0].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 1 (Sicherheit & Beziehung): Krisenthemen mit hoher Severity
  const phase1Ids = ROADMAP_PHASEN[1].schwerpunkt;
  sortedThemen.forEach(t => {
    if (!assigned.has(t.id) && phase1Ids.includes(t.id) && t.score > 0.3) {
      roadmap.phasen[1].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 2 (Exploration): Verstehens-Themen
  const phase2Ids = ROADMAP_PHASEN[2].schwerpunkt;
  sortedThemen.forEach(t => {
    if (!assigned.has(t.id) && phase2Ids.includes(t.id)) {
      roadmap.phasen[2].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 3 (Ziele & Plan): Planungs-Themen
  const phase3Ids = ROADMAP_PHASEN[3].schwerpunkt;
  sortedThemen.forEach(t => {
    if (!assigned.has(t.id) && phase3Ids.includes(t.id)) {
      roadmap.phasen[3].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 4 (Intervention): Alle verbleibenden hochpriorisierten Themen
  sortedThemen.forEach(t => {
    if (!assigned.has(t.id) && t.score > 0.2) {
      roadmap.phasen[4].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 5 (Konsolidierung): Transfer-Themen
  const phase5Ids = ROADMAP_PHASEN[5].schwerpunkt;
  phase5Ids.forEach(id => {
    if (!assigned.has(id)) {
      roadmap.phasen[5].themen.push({ id, status: 'offen' });
      assigned.add(id);
    }
  });

  // Phase 6 (Abschluss): Zukunftsthemen
  const phase6Ids = ROADMAP_PHASEN[6].schwerpunkt;
  phase6Ids.forEach(id => {
    if (!assigned.has(id)) {
      roadmap.phasen[6].themen.push({ id, status: 'offen' });
      assigned.add(id);
    }
  });

  DB.saveRoadmap(roadmap);
  renderRoadmap();
}

function deleteCurrentRoadmap() {
  if (!confirm('Förderplan wirklich löschen?')) return;
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (roadmap) DB.deleteRoadmap(roadmap.id);
  renderRoadmap();
}

function setRoadmapPhaseStatus(nr, status) {
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const phase = roadmap.phasen.find(p => p.nr === nr);
  if (!phase) return;
  phase.status = status;
  if (status === 'aktiv' && !phase.startDatum) {
    phase.startDatum = new Date().toISOString().split('T')[0];
  }
  if (status === 'erledigt') {
    phase.endDatum = new Date().toISOString().split('T')[0];
    // Auto-start next phase
    const next = roadmap.phasen.find(p => p.nr === nr + 1);
    if (next && next.status === 'offen') {
      next.status = 'aktiv';
      next.startDatum = new Date().toISOString().split('T')[0];
    }
  }
  DB.saveRoadmap(roadmap);
  renderRoadmap();
}

function toggleRoadmapThema(phaseNr, themaIdx) {
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const phase = roadmap.phasen.find(p => p.nr === phaseNr);
  if (!phase || !phase.themen[themaIdx]) return;
  phase.themen[themaIdx].status = phase.themen[themaIdx].status === 'abgeschlossen' ? 'offen' : 'abgeschlossen';
  DB.saveRoadmap(roadmap);
  renderRoadmap();
}

function addRoadmapThema(phaseNr) {
  const sel = document.getElementById(`roadmap-add-select-${phaseNr}`);
  if (!sel || !sel.value) return;
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const phase = roadmap.phasen.find(p => p.nr === phaseNr);
  if (!phase) return;
  // Avoid duplicates across all phases
  const allIds = roadmap.phasen.flatMap(p => p.themen.map(t => t.id));
  if (allIds.includes(sel.value)) {
    alert('Dieses Thema ist bereits im Förderplan enthalten.');
    return;
  }
  phase.themen.push({ id: sel.value, status: 'offen' });
  DB.saveRoadmap(roadmap);
  renderRoadmap();
}

function removeRoadmapThema(phaseNr, themaIdx) {
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const phase = roadmap.phasen.find(p => p.nr === phaseNr);
  if (!phase) return;
  phase.themen.splice(themaIdx, 1);
  DB.saveRoadmap(roadmap);
  renderRoadmap();
}

function saveRoadmapNotiz(phaseNr, text) {
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const phase = roadmap.phasen.find(p => p.nr === phaseNr);
  if (!phase) return;
  phase.notizen = text;
  DB.saveRoadmap(roadmap);
}

function openRoadmapThema(themaId) {
  // Find theme category and open the side panel
  for (const kat of THEMEN_KATEGORIEN) {
    const t = kat.themen.find(th => th.id === themaId);
    if (t) {
      openThemaPanel(kat.id, themaId);
      return;
    }
  }
}

function druckeRoadmap() {
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;

  const getThemaTitel = (themaId) => {
    for (const kat of THEMEN_KATEGORIEN) {
      const t = kat.themen.find(th => th.id === themaId);
      if (t) return t.titel;
    }
    return themaId;
  };

  const html = `<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">
    <title>Förderplan – ${s.vorname} ${s.nachname}</title>
    <style>
      body{font-family:'Segoe UI',system-ui,sans-serif;margin:40px;color:#1F2937;font-size:13px;line-height:1.6;}
      h1{font-size:20px;margin-bottom:4px;} h2{font-size:15px;margin:20px 0 8px;color:#374151;}
      .meta{color:#6B7280;font-size:12px;margin-bottom:20px;}
      .phase{margin-bottom:24px;padding:16px;border:1px solid #E5E7EB;border-radius:8px;page-break-inside:avoid;}
      .phase-header{display:flex;align-items:center;gap:12px;margin-bottom:10px;}
      .phase-dot{width:28px;height:28px;border-radius:50%;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;}
      .phase-label{font-weight:700;font-size:14px;}
      .phase-desc{font-size:12px;color:#6B7280;}
      .thema{padding:4px 0;display:flex;align-items:center;gap:8px;}
      .thema-check{width:14px;height:14px;border:2px solid #D1D5DB;border-radius:3px;display:inline-flex;align-items:center;justify-content:center;font-size:10px;}
      .thema-check.done{background:#059669;border-color:#059669;color:#fff;}
      .notiz{margin-top:10px;padding:10px;background:#F9FAFB;border-radius:6px;font-size:12px;font-style:italic;}
      @media print{body{margin:20px;}.phase{border:1px solid #ccc;}}
    </style></head><body>
    <h1>🗺️ Förderplan — ${s.vorname} ${s.nachname}</h1>
    <div class="meta">Erstellt: ${new Date(roadmap.erstellt).toLocaleDateString('de-DE')} · Klasse: ${s.klasse} · Gedruckt: ${new Date().toLocaleDateString('de-DE')}</div>
    ${roadmap.phasen.map((phase, idx) => {
      const def = ROADMAP_PHASEN[idx];
      return `<div class="phase">
        <div class="phase-header">
          <div class="phase-dot" style="background:${def.farbe};">${def.nr}</div>
          <div>
            <div class="phase-label">${renderIcon(def.icon)} Phase ${def.nr}: ${def.label}</div>
            <div class="phase-desc">${def.beschreibung} · ${def.dauer}
              ${phase.startDatum ? ` · Start: ${new Date(phase.startDatum).toLocaleDateString('de-DE')}` : ''}
              ${phase.endDatum ? ` · Ende: ${new Date(phase.endDatum).toLocaleDateString('de-DE')}` : ''}
              · <strong>${phase.status === 'aktiv' ? '▶ Aktiv' : phase.status === 'erledigt' ? '✓ Erledigt' : '○ Offen'}</strong>
            </div>
          </div>
        </div>
        ${phase.themen.length ? phase.themen.map(t =>
          `<div class="thema"><span class="thema-check ${t.status === 'abgeschlossen' ? 'done' : ''}">${t.status === 'abgeschlossen' ? '✓' : ''}</span> ${getThemaTitel(t.id)}</div>`
        ).join('') : '<div style="color:#9CA3AF;font-size:12px;">Keine Themen zugewiesen</div>'}
        ${phase.notizen ? `<div class="notiz">${phase.notizen}</div>` : ''}
      </div>`;
    }).join('')}
  </body></html>`;

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

// ============================================================
// SCREENING MODULE
// ============================================================

function renderScreening(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!s) return;

  document.getElementById('screening-topbar-titel').textContent =
    `Screening – ${s.vorname} ${s.nachname}`;
  document.getElementById('screening-alert-banner').style.display = 'none';

  // Reset to list view
  scrShowContainer('liste');
  APP.currentScreeningId = null;

  renderScreeningHistorie(schuelerId);
}

function renderScreeningHistorie(schuelerId) {
  const screenings = DB.getScreenings(schuelerId).sort(
    (a, b) => new Date(b.datum) - new Date(a.datum)
  );
  const el = document.getElementById('screening-historie');
  if (!screenings.length) {
    el.innerHTML = '<div style="color:#888;padding:20px;text-align:center;">Noch kein Screening vorhanden. Klicke auf "+ Neues Screening".</div>';
    return;
  }
  el.innerHTML = screenings.map((scr, i) => {
    const sev = scr.severity || 'low';
    const sevBadge = severityBadgeHtml(sev);
    const datum = new Date(scr.datum).toLocaleDateString('de-DE');
    const flagged = (scr.flaggedAreas || []).length;
    const label = `T${screenings.length - i}`;
    return `<div class="scr-historie-item" onclick="screeningOeffnen('${scr.id}')">
      <div class="scr-historie-label">${label}</div>
      <div class="scr-historie-datum">${datum}</div>
      <div style="flex:1;">${flagged} auffällige Bereiche</div>
      ${sevBadge}
      ${!scr.abgeschlossen ? '<span class="scr-badge-entwurf">Entwurf</span>' : ''}
    </div>`;
  }).join('');
}

function neuesScreeningStarten() {
  APP.screeningStep = 0;
  APP.screeningAntworten = {};
  APP.currentScreeningId = null;
  scrShowContainer('formular');
  renderScreeningSchritt(0);
}

function screeningOeffnen(screeningId) {
  const scr = DB.getScreenings().find(s => s.id === screeningId);
  if (!scr) return;
  APP.currentScreeningId = screeningId;

  if (!scr.abgeschlossen) {
    // Reopen for editing
    APP.screeningAntworten = { ...scr.antworten };
    APP.screeningStep = 0;
    scrShowContainer('formular');
    renderScreeningSchritt(0);
  } else {
    scrShowContainer('ergebnis');
    renderScreeningErgebnis(scr);
  }
}

function renderScreeningSchritt(step) {
  const domain = SCREENING_DOMAINS[step];
  const total = SCREENING_DOMAINS.length;
  const pct = Math.round((step / total) * 100);

  document.getElementById('scr-domain-label').textContent = domain.label;
  document.getElementById('scr-step-info').textContent = `Schritt ${step + 1} / ${total}`;
  document.getElementById('scr-progress-fill').style.width = pct + '%';
  document.getElementById('scr-domain-icon').textContent = domain.icon;
  document.getElementById('scr-domain-name').textContent = domain.label;
  document.getElementById('scr-domain-icd').textContent = domain.icd ? `ICD-10: ${domain.icd}` : 'Risikofaktor / Schutzfaktor';

  const liste = document.getElementById('scr-items-liste');
  liste.innerHTML = domain.items.map((item, idx) => {
    const key = `${domain.id}_${idx}`;
    const gespeichert = APP.screeningAntworten[key];
    return `<div class="scr-item-row">
      <div class="scr-item-text">${item}</div>
      <div class="scr-skala-buttons">
        ${[0,1,2,3].map(v => `<button
          class="scr-skala-btn ${gespeichert === v ? 'selected' : ''}"
          data-key="${key}" data-val="${v}"
          onclick="scrWaehlen('${key}', ${v}, this)">${v}</button>`).join('')}
      </div>
    </div>`;
  }).join('');

  // Back button
  document.getElementById('scr-btn-zurueck').style.display = step === 0 ? 'none' : '';
  document.getElementById('scr-btn-weiter').textContent =
    step === total - 1 ? '✅ Auswerten' : 'Weiter →';
}

function scrWaehlen(key, val, btn) {
  APP.screeningAntworten[key] = val;
  // Update button states in this row
  const row = btn.closest('.scr-skala-buttons');
  row.querySelectorAll('.scr-skala-btn').forEach(b => {
    b.classList.toggle('selected', parseInt(b.dataset.val) === val);
  });
  // Check alert items (self-harm domain)
  const domain = SCREENING_DOMAINS.find(d => d.alertItems && key.startsWith(d.id + '_'));
  if (domain) {
    const itemIdx = parseInt(key.split('_').pop());
    if (domain.alertItems.includes(itemIdx) && val > 1) {
      document.getElementById('screening-alert-banner').style.display = 'flex';
    }
  }
}

function screeningWeiter() {
  const step = APP.screeningStep;
  const domain = SCREENING_DOMAINS[step];

  // Check all items answered
  const unanswered = domain.items.filter((_, idx) => {
    const key = `${domain.id}_${idx}`;
    return APP.screeningAntworten[key] === undefined;
  });
  if (unanswered.length > 0) {
    showToast('Bitte alle Fragen beantworten', 'warning');
    // Highlight unanswered
    document.querySelectorAll('.scr-item-row').forEach((row, idx) => {
      const key = `${domain.id}_${idx}`;
      row.classList.toggle('scr-unanswered', APP.screeningAntworten[key] === undefined);
    });
    return;
  }

  if (step < SCREENING_DOMAINS.length - 1) {
    APP.screeningStep = step + 1;
    renderScreeningSchritt(APP.screeningStep);
  } else {
    // Auswerten
    screeningAuswerten();
  }
}

function screeningZurueck() {
  if (APP.screeningStep > 0) {
    APP.screeningStep--;
    renderScreeningSchritt(APP.screeningStep);
  }
}

function screeningAuswerten() {
  const antworten = APP.screeningAntworten;

  // Scores per domain
  const scores = {};
  SCREENING_DOMAINS.forEach(domain => {
    const summe = domain.items.reduce((acc, _, idx) => {
      const key = `${domain.id}_${idx}`;
      return acc + (antworten[key] || 0);
    }, 0);
    scores[domain.id] = summe;
  });

  // Flagged areas (above cutoff)
  const flaggedAreas = SCREENING_DOMAINS
    .filter(d => !d.invertiert && scores[d.id] >= d.cutoff && d.cutoff > 0)
    .map(d => d.id);

  // Comorbidity patterns
  const comorbidityPattern = KOMORBIDITÄT_MUSTER
    .filter(m => m.bedingung(flaggedAreas))
    .map(m => m.id);

  // Alert-Items identifizieren (Item-Level Granularität)
  const alertItems = [];
  SCREENING_DOMAINS.forEach(domain => {
    if (!domain.alertItems) return;
    domain.alertItems.forEach(idx => {
      const val = antworten[`${domain.id}_${idx}`] || 0;
      if (val > 1) {
        alertItems.push({
          domainId: domain.id,
          itemIdx: idx,
          itemText: domain.items[idx],
          wert: val,
        });
      }
    });
  });

  // Severity — klinisch kalibriert (K3)
  // "urgent" nur bei aktiver Suizidalität (alertItems positiv) oder hohem Gesamtscore
  // Psychose ≥3 statt ≥2 (reduziert False Positives bei normalem Adoleszentenverhalten)
  let severity = 'low';
  const selfharmScore = scores['selbstverletzung'] || 0;
  const psychoseScore = scores['psychose'] || 0;
  const svvAlertHit = SCREENING_DOMAINS.find(d => d.id === 'selbstverletzung')?.alertItems?.some(
    idx => (antworten[`selbstverletzung_${idx}`] || 0) > 1
  );

  if (svvAlertHit || selfharmScore >= 6 || psychoseScore >= 3) severity = 'urgent';
  else if (flaggedAreas.length >= 5 || comorbidityPattern.includes('krisenindikator')) severity = 'high';
  else if (flaggedAreas.length >= 3 || selfharmScore >= 4 || psychoseScore >= 2) severity = 'medium';
  else severity = 'low';

  // Worksheet recommendations
  const worksheetScores = {};
  SCREENING_DOMAINS.forEach(domain => {
    if (!domain.invertiert) {
      const score = scores[domain.id];
      (domain.worksheets || []).forEach(ws => {
        if (!worksheetScores[ws]) worksheetScores[ws] = 0;
        worksheetScores[ws] += score;
      });
    }
  });
  const worksheetRecommendations = Object.entries(worksheetScores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([datei, score]) => ({ datei, score }));

  // Save
  let scr;
  if (APP.currentScreeningId) {
    scr = DB.getScreenings().find(s => s.id === APP.currentScreeningId);
    scr = { ...scr, antworten, scores, flaggedAreas, comorbidityPattern, worksheetRecommendations, severity, alertItems, abgeschlossen: true, geaendert: new Date().toISOString() };
  } else {
    scr = DB.createScreening(APP.currentSchuelerId);
    scr = { ...scr, antworten, scores, flaggedAreas, comorbidityPattern, worksheetRecommendations, severity, alertItems, abgeschlossen: true };
  }
  DB.saveScreening(scr);
  APP.currentScreeningId = scr.id;

  scrShowContainer('ergebnis');
  renderScreeningErgebnis(scr);
  renderSidebar(); // Update urgent indicator
  showToast('Screening ausgewertet', 'success');

  // C-SSRS Trigger (K5): Bei positivem SVV-alertItem → strukturiertes Assessment anbieten
  const svvAlerts = alertItems.filter(a => a.domainId === 'selbstverletzung');
  if (svvAlerts.length > 0 || severity === 'urgent') {
    setTimeout(() => showCSSRSAssessment(scr), 500);
  }
}

// ── Strukturiertes Suizid-Assessment (K5) — angelehnt an C-SSRS Screening-Version ──
function showCSSRSAssessment(screening) {
  let overlay = document.getElementById('cssrs-overlay');
  if (overlay) overlay.remove();

  overlay = document.createElement('div');
  overlay.id = 'cssrs-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.6);z-index:99999;display:flex;align-items:center;justify-content:center;';

  const modal = document.createElement('div');
  modal.style.cssText = 'background:#fff;border-radius:12px;max-width:550px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 20px 60px rgba(0,0,0,0.3);';
  modal.innerHTML = `
    <div style="padding:20px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
        <span style="font-size:24px;">🚨</span>
        <div>
          <h3 style="margin:0;color:#DC2626;">Strukturiertes Suizid-Assessment</h3>
          <div style="font-size:11px;color:#6B7280;">Angelehnt an Columbia-Suicide Severity Rating Scale (C-SSRS) Screening-Version</div>
        </div>
      </div>
      <div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:10px;margin-bottom:16px;font-size:12px;color:#991B1B;">
        <strong>Wichtig:</strong> Dieses Assessment ersetzt KEINE psychiatrische Diagnostik. Bei positivem Ergebnis: Sofortige Weiterleitung an Fachstelle.
      </div>
      <div id="cssrs-fragen" style="display:flex;flex-direction:column;gap:10px;">
        ${[
          { nr: 1, frage: 'Wunsch tot zu sein?', detail: '"Hast du in letzter Zeit gewünscht, du wärst tot oder nicht mehr da?"' },
          { nr: 2, frage: 'Aktive Suizidgedanken?', detail: '"Hast du tatsächlich daran gedacht, dich umzubringen?"' },
          { nr: 3, frage: 'Methode überlegt?', detail: '"Hast du darüber nachgedacht, WIE du es tun würdest?"' },
          { nr: 4, frage: 'Absicht zu handeln?', detail: '"Hattest du die Absicht, danach zu handeln — also es wirklich zu tun?"' },
          { nr: 5, frage: 'Konkreter Plan?', detail: '"Hast du die Details ausgearbeitet? Weißt du wann, wo, wie?"' },
        ].map(q => `
          <div style="padding:10px;border:1px solid #E5E7EB;border-radius:8px;">
            <div style="font-weight:600;margin-bottom:4px;">${q.nr}. ${q.frage}</div>
            <div style="font-size:11px;color:#6B7280;margin-bottom:6px;font-style:italic;">${q.detail}</div>
            <div style="display:flex;gap:8px;">
              <button class="btn btn-sm" onclick="this.parentNode.querySelectorAll('.btn').forEach(b=>b.style.background='');this.style.background='#FECACA';this.parentNode.dataset.antwort='ja'" style="border:1px solid #E5E7EB;border-radius:6px;padding:4px 16px;">Ja</button>
              <button class="btn btn-sm" onclick="this.parentNode.querySelectorAll('.btn').forEach(b=>b.style.background='');this.style.background='#D1FAE5';this.parentNode.dataset.antwort='nein'" style="border:1px solid #E5E7EB;border-radius:6px;padding:4px 16px;">Nein</button>
            </div>
          </div>
        `).join('')}
      </div>
      <div style="display:flex;gap:8px;margin-top:16px;">
        <button class="btn btn-danger" onclick="evaluateCSSRS()" style="flex:1;">Auswerten</button>
        <button class="btn btn-secondary" onclick="document.getElementById('cssrs-overlay').remove()" style="flex:1;">Später</button>
      </div>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function evaluateCSSRS() {
  const fragen = document.querySelectorAll('#cssrs-fragen > div');
  const antworten = [];
  fragen.forEach(f => {
    const btns = f.querySelector('[data-antwort]');
    antworten.push(btns ? btns.dataset.antwort : null);
  });

  const jaCount = antworten.filter(a => a === 'ja').length;
  const overlay = document.getElementById('cssrs-overlay');

  let ergebnis = '';
  let farbe = '';

  if (jaCount === 0) {
    ergebnis = `<div style="color:#059669;font-weight:600;">Kein akutes Suizidrisiko erkannt.</div>
      <div style="font-size:12px;margin-top:4px;">Weiterhin aufmerksam bleiben. Re-Assessment bei Veränderungen.</div>`;
    farbe = '#D1FAE5';
  } else if (jaCount <= 2) {
    ergebnis = `<div style="color:#D97706;font-weight:600;">Erhöhtes Risiko (${jaCount}/5 positiv)</div>
      <div style="font-size:12px;margin-top:4px;">
        <strong>Empfohlen:</strong><br>
        - Safety-Plan erstellen (Krisenplan-Arbeitsblatt)<br>
        - Therapeutische Anbindung einleiten<br>
        - Re-Assessment innerhalb 1 Woche
      </div>
      <button class="btn btn-warning btn-sm" onclick="window.open('arbeitsblaetter/krisenplan.html','_blank');document.getElementById('cssrs-overlay').remove();" style="margin-top:8px;">Krisenplan-Arbeitsblatt öffnen</button>`;
    farbe = '#FEF3C7';
  } else {
    ergebnis = `<div style="color:#DC2626;font-weight:600;">AKUTE GEFÄHRDUNG (${jaCount}/5 positiv)</div>
      <div style="font-size:12px;margin-top:4px;">
        <strong>SOFORTMASSNAHMEN:</strong><br>
        - Jugendlichen NICHT alleine lassen<br>
        - Sofort Kinder-/Jugendpsychiatrie kontaktieren<br>
        - <strong>CHL KJP: (+352) 4411-6058</strong><br>
        - <strong>SOS Détresse: 45 45 45</strong><br>
        - Eltern/Sorgeberechtigte informieren<br>
        - Krisenprotokoll der Einrichtung aktivieren
      </div>`;
    farbe = '#FEE2E2';
  }

  // Ergebnis in Screening speichern
  if (APP.currentScreeningId) {
    const screenings = JSON.parse(localStorage.getItem('cdse_screenings') || '[]');
    const scr = screenings.find(s => s.id === APP.currentScreeningId);
    if (scr) {
      scr.cssrsErgebnis = { jaCount, antworten, datum: new Date().toISOString() };
      localStorage.setItem('cdse_screenings', JSON.stringify(screenings));
    }
  }

  if (overlay) {
    const modal = overlay.querySelector('div > div');
    if (modal) {
      modal.innerHTML = `
        <div style="padding:20px;">
          <h3 style="margin:0 0 12px;">C-SSRS Ergebnis</h3>
          <div style="background:${farbe};border-radius:8px;padding:14px;">
            ${ergebnis}
          </div>
          <button class="btn btn-secondary" onclick="document.getElementById('cssrs-overlay').remove()" style="margin-top:16px;width:100%;">Schließen</button>
        </div>`;
    }
  }
}

function renderScreeningErgebnis(scr) {
  // Meta row
  document.getElementById('scr-severity-badge').innerHTML = severityBadgeHtml(scr.severity, true);
  document.getElementById('scr-datum-info').textContent =
    'Screening vom ' + new Date(scr.datum).toLocaleDateString('de-DE');

  // Comorbidity patterns
  const muster = KOMORBIDITÄT_MUSTER.filter(m => (scr.comorbidityPattern || []).includes(m.id));
  const musterEl = document.getElementById('scr-komorbiditat-patterns');
  if (muster.length) {
    musterEl.innerHTML = '<div class="scr-muster-row">' + muster.map(m =>
      `<div class="scr-muster-chip" style="background:${m.farbe}20;border:1.5px solid ${m.farbe};color:${m.farbe};">
        <strong>${m.label}</strong> – ${m.beschreibung}
      </div>`).join('') + '</div>';
  } else {
    musterEl.innerHTML = '';
  }

  // Flagged areas
  const flagged = scr.flaggedAreas || [];
  const flaggedEl = document.getElementById('scr-flagged-areas');
  if (flagged.length) {
    const flaggedDomains = SCREENING_DOMAINS.filter(d => flagged.includes(d.id));
    flaggedEl.innerHTML = '<div class="scr-flagged-grid">' + flaggedDomains.map(d => {
      const score = scr.scores[d.id] || 0;
      const max = d.items.length * 3;
      const pct = Math.round((score / max) * 100);
      // Interpretation based on score above cutoff
      const diff = score - d.cutoff;
      const isKrise = d.id === 'selbstverletzung' || d.id === 'suizidalitaet' || d.id === 'psychose';
      let interpretText = '';
      let interpretColor = '';
      if (isKrise && diff > 0) {
        interpretText = '⚠️ Krisenrelevant — Krisenprotokoll prüfen, ggf. sofort handeln';
        interpretColor = '#DC2626';
      } else if (diff >= 5) {
        interpretText = 'Stark erhöht — Dringender Handlungsbedarf, externe Fachstelle einbeziehen';
        interpretColor = '#DC2626';
      } else if (diff >= 3) {
        interpretText = 'Deutlich erhöht — Im Förderplan priorisieren';
        interpretColor = '#D97706';
      } else {
        interpretText = 'Leicht erhöht — Beobachten und im Förderplan berücksichtigen';
        interpretColor = '#F59E0B';
      }
      return `<div class="scr-flagged-chip" style="border-left:4px solid ${d.farbe};">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-weight:600;font-size:13px;">${d.icon} ${d.label}</span>
          <span style="font-size:12px;color:${d.farbe};font-weight:700;">${score}/${max}</span>
        </div>
        <div class="scr-mini-bar"><div class="scr-mini-bar-fill" style="width:${pct}%;background:${d.farbe};"></div></div>
        ${d.icd ? `<div style="font-size:11px;color:#888;margin-top:3px;">ICD-10: ${d.icd}</div>` : ''}
        <div style="font-size:11px;color:${interpretColor};margin-top:4px;font-weight:500;">${interpretText}</div>
        ${typeof SCREENING_INTERPRETATION !== 'undefined' && SCREENING_INTERPRETATION[d.id] ? `<details style="margin-top:6px;"><summary style="font-size:11px;cursor:pointer;color:#3B82F6;font-weight:500;">💡 Was tun? Details anzeigen</summary><div style="font-size:11px;line-height:1.6;margin-top:6px;padding:8px;background:#F0F9FF;border-radius:6px;"><div style="margin-bottom:6px;color:#1E3A5F;">${SCREENING_INTERPRETATION[d.id].was_bedeutet_auffaellig}</div><div style="font-weight:600;margin-bottom:3px;color:#1E40AF;">Sofortmaßnahmen:</div><ul style="margin:0 0 6px 16px;padding:0;">${SCREENING_INTERPRETATION[d.id].sofort_massnahmen.map(m => '<li style="margin-bottom:2px;">' + m + '</li>').join('')}</ul><div style="font-size:10px;color:#DC2626;font-weight:500;">${SCREENING_INTERPRETATION[d.id].wann_ueberweisen}</div></div></details>` : ''}
        ${(typeof findWikiForScreeningDomain === 'function' && findWikiForScreeningDomain(d.id)) ? renderWikiLink(findWikiForScreeningDomain(d.id).id) : ''}
      </div>`;
    }).join('') + '</div>'
    + '<div style="font-size:11px;color:#6B7280;padding:8px 12px;margin-top:8px;background:#F9FAFB;border-radius:6px;line-height:1.5;">ℹ️ <strong>Was bedeutet „auffällig"?</strong> Scores über dem Cutoff-Wert deuten auf erhöhte Belastung hin. Diese Bereiche sollten im Förderplan priorisiert und bei der 5P-Analyse als „Presenting" aufgenommen werden.</div>';
  } else {
    flaggedEl.innerHTML = '<div style="color:#22c55e;padding:12px;font-weight:500;">✅ Keine Bereiche über dem Cutoff-Wert.</div>';
  }

  // Notes
  document.getElementById('scr-clinical-notes').value = scr.clinicalNotes || '';
  document.getElementById('scr-followup-date').value = scr.followUpDate || '';

  // Chart
  renderScrProfilChart(scr);
  renderScrRadarChart(scr);
  renderScrEmpfehlungen(scr);
  renderScrVerlauf(scr.schuelerId);

  // Tab reset
  showScrTab('risikoprofil');
}

function renderScrProfilChart(scr) {
  const ctx = document.getElementById('scr-chart-profil');
  if (!ctx) return;

  if (APP.scrProfilChart) {
    APP.scrProfilChart.destroy();
    APP.scrProfilChart = null;
  }

  const domains = SCREENING_DOMAINS.filter(d => !d.invertiert);
  const labels = domains.map(d => d.label);
  const data = domains.map(d => scr.scores[d.id] || 0);
  const maxScores = domains.map(d => d.items.length * 3);
  const cutoffs = domains.map(d => d.cutoff);
  const colors = domains.map(d => {
    const score = scr.scores[d.id] || 0;
    return score >= d.cutoff && d.cutoff > 0 ? d.farbe : d.farbe + '80';
  });

  APP.scrProfilChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Score',
          data,
          backgroundColor: colors,
          borderColor: domains.map(d => d.farbe),
          borderWidth: 1.5,
          borderRadius: 4,
        },
        {
          label: 'Cutoff',
          data: cutoffs,
          type: 'line',
          borderColor: '#EF4444',
          borderDash: [4, 4],
          borderWidth: 1.5,
          pointRadius: 0,
          fill: false,
          tension: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom' },
        tooltip: {
          callbacks: {
            afterLabel: (ctx) => {
              if (ctx.datasetIndex === 0) {
                const d = domains[ctx.dataIndex];
                return `Max: ${d.items.length * 3} · Cutoff: ${d.cutoff}`;
              }
            },
          },
        },
      },
      scales: {
        x: { ticks: { font: { size: 10 }, maxRotation: 45 } },
        y: { beginAtZero: true, ticks: { stepSize: 1 } },
      },
    },
  });
}

function renderScrRadarChart(scr) {
  const canvas = document.getElementById('scr-radar-chart');
  if (!canvas) return;

  if (window._scrRadarChart) window._scrRadarChart.destroy();

  const domains = SCREENING_DOMAINS.filter(d => !d.invertiert);
  const labels = domains.map(d => d.label.length > 18 ? d.label.substring(0, 16) + '…' : d.label);
  const scores = domains.map(d => scr.scores[d.id] || 0);
  const cutoffs = domains.map(d => d.cutoff);
  const maxScores = domains.map(d => d.items.length * 3);
  // Normalisiere auf 0-100%
  const normalizedScores = scores.map((s, i) => Math.round((s / maxScores[i]) * 100));
  const normalizedCutoffs = cutoffs.map((c, i) => Math.round((c / maxScores[i]) * 100));

  window._scrRadarChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Score (%)',
          data: normalizedScores,
          backgroundColor: 'rgba(99, 102, 241, 0.15)',
          borderColor: '#6366F1',
          borderWidth: 2,
          pointBackgroundColor: domains.map(d => {
            const s = scr.scores[d.id] || 0;
            return s >= d.cutoff && d.cutoff > 0 ? d.farbe : '#6366F1';
          }),
          pointRadius: 4,
        },
        {
          label: 'Cutoff',
          data: normalizedCutoffs,
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          borderColor: '#EF444480',
          borderDash: [4, 4],
          borderWidth: 1.5,
          pointRadius: 0,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 13 } } },
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: { stepSize: 25, font: { size: 11 }, callback: v => v + '%' },
          pointLabels: { font: { size: 12, weight: '500' } },
          grid: { color: 'rgba(0,0,0,0.08)' },
        }
      }
    }
  });
}

function renderScrEmpfehlungen(scr) {
  const el = document.getElementById('scr-empfehlungen-liste');
  const recs = scr.worksheetRecommendations || [];

  if (!recs.length) {
    el.innerHTML = '<div style="color:#888;padding:20px;text-align:center;">Keine Empfehlungen verfügbar.</div>';
    return;
  }

  el.innerHTML = recs.map((rec, i) => {
    const domain = SCREENING_DOMAINS.find(d => (d.worksheets || []).includes(rec.datei));
    const icon = domain ? domain.icon : '📋';
    const farbe = domain ? domain.farbe : '#3B6CB7';
    // Find worksheet title from ARBEITSBLÄTTER
    const key = rec.datei.replace('.html', '');
    const titel = (ARBEITSBLÄTTER[key] && ARBEITSBLÄTTER[key][0]) ?
      ARBEITSBLÄTTER[key][0].titel : rec.datei;

    return `<div class="scr-empfehlung-card" style="border-left:4px solid ${farbe};">
      <div class="scr-empf-rank">${i + 1}</div>
      <div class="scr-empf-info">
        <div class="scr-empf-titel">${icon} ${titel}</div>
        <div class="scr-empf-meta">Relevanz-Score: ${rec.score}</div>
      </div>
      <a class="btn btn-secondary btn-sm" href="arbeitsblatter/${rec.datei}" target="_blank">📄 Öffnen</a>
    </div>`;
  }).join('');
}

function renderScrVerlauf(schuelerId) {
  const screenings = DB.getScreenings(schuelerId)
    .filter(s => s.abgeschlossen)
    .sort((a, b) => new Date(a.datum) - new Date(b.datum));

  const verlaufEl = document.getElementById('scr-verlauf-leer');
  const canvas = document.getElementById('scr-chart-verlauf');

  if (screenings.length < 2) {
    if (verlaufEl) verlaufEl.style.display = 'block';
    if (canvas) canvas.style.display = 'none';
    return;
  }

  if (verlaufEl) verlaufEl.style.display = 'none';
  if (canvas) canvas.style.display = 'block';

  if (APP.scrVerlaufChart) {
    APP.scrVerlaufChart.destroy();
    APP.scrVerlaufChart = null;
  }

  const labels = screenings.map((s, i) => `T${i + 1} (${new Date(s.datum).toLocaleDateString('de-DE')})`);
  const flaggedDomains = SCREENING_DOMAINS.filter(d => {
    return screenings.some(s => (s.flaggedAreas || []).includes(d.id));
  }).slice(0, 6); // Max 6 lines for readability

  const datasets = flaggedDomains.map(d => ({
    label: d.label,
    data: screenings.map(s => s.scores[d.id] || 0),
    borderColor: d.farbe,
    backgroundColor: d.farbe + '20',
    tension: 0.3,
    fill: false,
    pointRadius: 4,
  }));

  APP.scrVerlaufChart = new Chart(canvas, {
    type: 'line',
    data: { labels, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

function showScrTab(tab) {
  document.querySelectorAll('#screening-ergebnis-tabs .profil-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.scrtab === tab);
  });
  document.querySelectorAll('.screening-ergebnis-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.scrtab === tab);
  });
  if (tab === 'verlauf') {
    renderScrVerlauf(APP.currentSchuelerId);
  }
}

function saveScrNotes() {
  if (!APP.currentScreeningId) return;
  const scr = DB.getScreenings().find(s => s.id === APP.currentScreeningId);
  if (!scr) return;
  scr.clinicalNotes = document.getElementById('scr-clinical-notes').value;
  scr.followUpDate = document.getElementById('scr-followup-date').value;
  scr.geaendert = new Date().toISOString();
  DB.saveScreening(scr);
}

function screeningBearbeiten() {
  if (!APP.currentScreeningId) return;
  const scr = DB.getScreenings().find(s => s.id === APP.currentScreeningId);
  if (!scr) return;
  APP.screeningAntworten = { ...scr.antworten };
  APP.screeningStep = 0;
  scrShowContainer('formular');
  renderScreeningSchritt(0);
}

function screeningLoeschen() {
  if (!APP.currentScreeningId) return;
  if (!confirm('Screening wirklich löschen?')) return;
  DB.deleteScreening(APP.currentScreeningId);
  APP.currentScreeningId = null;
  scrShowContainer('liste');
  renderScreeningHistorie(APP.currentSchuelerId);
  renderSidebar();
  showToast('Screening gelöscht', 'success');
}

function scrShowContainer(which) {
  document.getElementById('screening-liste-container').style.display = which === 'liste' ? '' : 'none';
  document.getElementById('screening-formular-container').style.display = which === 'formular' ? '' : 'none';
  document.getElementById('screening-ergebnis-container').style.display = which === 'ergebnis' ? '' : 'none';
}

function severityBadgeHtml(severity, large = false) {
  const map = {
    low:    { label: 'Unauffällig', bg: '#DCFCE7', color: '#166534' },
    medium: { label: 'Erhöhter Bedarf', bg: '#FEF9C3', color: '#854D0E' },
    high:   { label: 'Hoher Bedarf', bg: '#FEE2E2', color: '#991B1B' },
    urgent: { label: '🚨 Dringend', bg: '#7F1D1D', color: '#FEF2F2' },
  };
  const s = map[severity] || map.low;
  const sz = large ? 'font-size:13px;padding:6px 14px;' : 'font-size:11px;padding:3px 10px;';
  return `<span class="scr-severity" style="background:${s.bg};color:${s.color};${sz}border-radius:20px;font-weight:600;">${s.label}</span>`;
}

// ============================================================
// SCREENING EMBEDDED (im Profil-Tab)
// ============================================================
function renderScreeningEmbedded() {
  const container = document.getElementById('screening-embedded-container');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  const screenings = DB.getScreenings(sid);
  const abgeschlossene = screenings.filter(sc => sc.abgeschlossen)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const latestScr = abgeschlossene[0] || null;

  let scrSummary = '';
  if (latestScr) {
    const flagged = latestScr.flaggedAreas || [];
    const domainLabels = flagged.map(areaId => {
      const d = (typeof SCREENING_DOMAINS !== 'undefined') ? SCREENING_DOMAINS.find(dom => dom.id === areaId) : null;
      return d ? `<span style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;background:${d.farbe}18;border:1px solid ${d.farbe}40;border-radius:12px;font-size:11px;color:${d.farbe};">${d.icon} ${d.label}</span>` : areaId;
    }).join(' ');

    scrSummary = `
      <div class="card" style="margin-bottom:16px;">
        <div class="card-header">
          <span>📊</span>
          <div class="card-title">Letztes Screening</div>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center;">
            ${renderSeverityBadge(latestScr.severity, false)}
            <span style="font-size:12px;color:#6B7280;">${new Date(latestScr.datum).toLocaleDateString('de-DE')}</span>
          </div>
        </div>
        <div class="card-body">
          ${flagged.length > 0 ? `
            <div style="margin-bottom:12px;">
              <div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:6px;">Auffällige Bereiche (${flagged.length})</div>
              <div style="display:flex;gap:6px;flex-wrap:wrap;">${domainLabels}</div>
            </div>
          ` : '<div style="color:#059669;font-size:13px;">✅ Keine auffälligen Bereiche</div>'}

          <div style="display:flex;gap:8px;margin-top:12px;">
            <button class="btn btn-secondary btn-sm" onclick="showView('screening', '${sid}')">📊 Ergebnisse anzeigen</button>
            <button class="btn btn-primary btn-sm" onclick="screeningTo5P()">🧩 → 5P-Analyse übernehmen</button>
          </div>
        </div>
      </div>`;
  }

  container.innerHTML = `
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <div>
        <h3 style="margin:0;font-size:18px;">🔍 Screening</h3>
        <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Multi-dimensionales Belastungsscreening</p>
      </div>
      <div style="display:flex;gap:8px;">
        <button class="btn btn-primary btn-sm" onclick="showView('screening', '${sid}')">
          ${abgeschlossene.length > 0 ? '📊 Ergebnisse öffnen' : '+ Neues Screening'}
        </button>
      </div>
    </div>

    ${scrSummary}

    <!-- Screening-Historie -->
    ${abgeschlossene.length > 0 ? `
    <div class="card">
      <div class="card-header">
        <span>📋</span>
        <div class="card-title">Screening-Verlauf</div>
        <span style="margin-left:auto;font-size:12px;color:#6B7280;">${abgeschlossene.length} durchgeführt</span>
      </div>
      <div class="card-body">
        ${abgeschlossene.map(scr => {
          const flagged = scr.flaggedAreas || [];
          return `
          <div style="display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid #F3F4F6;cursor:pointer;"
               onclick="showView('screening', '${sid}')">
            ${renderSeverityBadge(scr.severity, false)}
            <span style="font-size:13px;font-weight:500;">${new Date(scr.datum).toLocaleDateString('de-DE')}</span>
            <span style="font-size:12px;color:#6B7280;">${flagged.length} auffällige Bereiche</span>
            <span style="margin-left:auto;color:#9CA3AF;">→</span>
          </div>`;
        }).join('')}
      </div>
    </div>` : `
    <div style="text-align:center;padding:40px;color:#6B7280;">
      <div style="font-size:32px;margin-bottom:12px;">🔍</div>
      <p style="font-size:14px;margin-bottom:12px;">Noch kein Screening durchgeführt</p>
      <p style="font-size:12px;color:#9CA3AF;margin-bottom:16px;">
        Das Screening hilft, Belastungsbereiche systematisch zu erfassen und den Förderbedarf zu ermitteln.
      </p>
      <button class="btn btn-primary" onclick="showView('screening', '${sid}')">+ Erstes Screening starten</button>
    </div>`}

    <div class="screening-disclaimer" style="margin-top:16px;">
      <strong>⚠️ Hinweis:</strong> Dieses Screening-Tool ist kein diagnostisches Instrument und ersetzt keine klinische Diagnose.
    </div>
  `;
}

// ============================================================
// FEATURE-VERBINDUNGEN: Screening → 5P
// ============================================================

// Handlungskategorien-Konfiguration
const HANDLUNG_CONFIG = {
  krise:       { icon: '\u{1F6A8}', label: 'SOFORT HANDELN', farbe: '#991B1B', bg: '#FEF2F2', prefix: 'KRISENPROTOKOLL' },
  abklaerung:  { icon: '\u{1F52C}', label: 'FACHDIAGNOSTIK EMPFOHLEN', farbe: '#7C3AED', bg: '#F5F3FF', prefix: 'Fachdiagnostik' },
  intervention:{ icon: '\u{1F3AF}', label: 'UNSERE ARBEIT', farbe: '#2563EB', bg: '#EFF6FF', prefix: '' },
  beobachtung: { icon: '\u{1F441}', label: 'BEOBACHTEN', farbe: '#6B7280', bg: '#F9FAFB', prefix: 'beobachten' },
};

// Score-basierte dynamische Eskalation der Handlungskategorie
function resolveHandlung(domain, score) {
  const base = domain.handlung || 'intervention';
  // Dynamische Eskalation bei hohen Scores
  if (base === 'intervention' && score > 0) {
    if (domain.id === 'depression' && score >= 10) return 'abklaerung';
    if (domain.id === 'trauma' && score >= 8) return 'abklaerung';
    if (domain.id === 'substanz' && score >= 9) return 'abklaerung';
    if (domain.id === 'conduct' && score >= 9) return 'abklaerung';
  }
  return base;
}

function screeningTo5P() {
  const sid = APP.currentSchuelerId;
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  if (screenings.length === 0) {
    showToast('Kein abgeschlossenes Screening vorhanden', 'error');
    return;
  }

  const latestScr = screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
  const flagged = latestScr.flaggedAreas || [];

  if (flagged.length === 0) {
    showToast('Keine auffälligen Bereiche im Screening', 'info');
    return;
  }

  let ff = DB.getFallformulierung(sid);
  if (!ff) {
    ff = DB.createFallformulierung(sid);
  }

  // Flagged areas → Presenting (Symptome) mit Handlungskategorie-Prefix
  const presentingNeu = [];
  flagged.forEach(areaId => {
    const domain = (typeof SCREENING_DOMAINS !== 'undefined') ? SCREENING_DOMAINS.find(d => d.id === areaId) : null;
    const label = domain ? `${domain.icon} ${domain.label}` : areaId;
    const score = latestScr.scores[areaId] || 0;

    // Handlungsbasierter Tag mit Prefix
    let entry;
    if (domain && domain.handlung) {
      const handlung = resolveHandlung(domain, score);
      const cfg = HANDLUNG_CONFIG[handlung];
      const suffix = cfg.prefix ? ` \u2014 ${cfg.prefix}` : '';
      entry = `${cfg.icon} ${domain.label} (Score: ${score})${suffix}`;
    } else {
      entry = `${label} (Screening-Score: ${score})`;
    }

    // Duplikat-Check: auch alte Formate erkennen
    const isDuplicate = ff.presenting.some(p =>
      p.includes(domain ? domain.label : areaId) && p.includes('Score')
    );
    if (!isDuplicate) {
      presentingNeu.push(entry);
    }
  });

  if (presentingNeu.length === 0) {
    showToast('Screening-Daten bereits in 5P vorhanden', 'info');
    return;
  }

  ff.presenting = [...ff.presenting, ...presentingNeu];
  DB.saveFallformulierung(ff);
  showToast(`${presentingNeu.length} Bereiche in 5P-Presenting übernommen`, 'success');
  showProfilTab('fallformulierung');
}

// ============================================================
// FEATURE-VERBINDUNGEN: Stärken → 5P Protective
// ============================================================
function staerkenTo5P() {
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  const profil = s.staerkenProfil || {};
  const ratings = profil.ratings || {};
  const schutzfaktoren = profil.schutzfaktoren || [];
  const interessen = profil.interessen || [];

  let ff = DB.getFallformulierung(sid);
  if (!ff) {
    ff = DB.createFallformulierung(sid);
  }

  const protectiveNeu = [];

  // Hohe Stärken-Werte (>= 7) → Protective
  if (typeof STAERKEN_DIMENSIONEN !== 'undefined') {
    STAERKEN_DIMENSIONEN.forEach(d => {
      if ((ratings[d.id] || 0) >= 7) {
        const entry = `💪 ${d.label} (${ratings[d.id]}/10)`;
        if (!ff.protective.includes(entry)) protectiveNeu.push(entry);
      }
    });
  }

  // Schutzfaktoren direkt übernehmen
  schutzfaktoren.forEach(sf => {
    const entry = `🛡️ ${sf}`;
    if (!ff.protective.includes(entry)) protectiveNeu.push(entry);
  });

  // Interessen als Ressourcen
  interessen.forEach(int => {
    const entry = `🎯 ${int}`;
    if (!ff.protective.includes(entry)) protectiveNeu.push(entry);
  });

  if (protectiveNeu.length === 0) {
    showToast('Stärken-Daten bereits in 5P vorhanden', 'info');
    return;
  }

  ff.protective = [...ff.protective, ...protectiveNeu];
  DB.saveFallformulierung(ff);
  showToast(`${protectiveNeu.length} Schutzfaktoren in 5P übernommen`, 'success');
  showProfilTab('fallformulierung');
}

// ============================================================
// FEATURE-VERBINDUNGEN: Verhalten → 5P (Presenting + Perpetuating)
// ============================================================
function verhaltensTo5P() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;

  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);

  // Modal mit Verhaltens-Checkboxen öffnen
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'verhalten-5p-modal';
  modal.onclick = e => { if (e.target === modal) modal.remove(); };

  const kategorien = typeof VERHALTENS_KATALOG !== 'undefined' ? VERHALTENS_KATALOG : [];
  const katIcons = { 'Externalisierend': '⚡', 'Internalisierend': '🌊', 'Beziehung': '🤝', 'Schulbezogen': '🏫' };

  modal.innerHTML = `
    <div class="modal-content" style="max-width:680px;max-height:85vh;overflow-y:auto;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
        <div>
          <h3 style="margin:0;font-size:17px;">📋 Verhaltensbeobachtungen → 5P</h3>
          <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Beobachtete Verhaltensweisen auswählen — werden als Presenting & Perpetuating übernommen</p>
        </div>
        <button onclick="document.getElementById('verhalten-5p-modal').remove()" style="background:none;border:none;font-size:20px;cursor:pointer;color:#6B7280;">✕</button>
      </div>

      ${kategorien.map(kat => `
        <div style="margin-bottom:14px;">
          <div style="font-weight:600;font-size:13px;color:#374151;padding:6px 0;border-bottom:1px solid #E5E7EB;margin-bottom:8px;">
            ${katIcons[kat.titel] || '📌'} ${kat.titel}
          </div>
          <div style="display:grid;gap:6px;">
            ${kat.eintraege.map(e => `
              <label style="display:flex;align-items:flex-start;gap:8px;padding:6px 10px;background:#F9FAFB;border-radius:6px;cursor:pointer;font-size:13px;border:1px solid #E5E7EB;">
                <input type="checkbox" class="verhalten-5p-check" data-id="${e.id}" data-titel="${e.titel}"
                  data-kategorie="${kat.titel}"
                  data-ursachen="${(e.was_es_bedeuten_kann || []).slice(0, 2).map(w => w.ursache).join('||')}"
                  data-themen="${(e.verwandte_themen || []).join(',')}"
                  style="margin-top:2px;"
                  ${ff.presenting.some(p => p.includes(e.titel)) ? 'checked disabled' : ''} />
                <div>
                  <strong>${e.titel}</strong>
                  <div style="color:#6B7280;font-size:11px;margin-top:2px;">${(e.wie_es_aussieht || []).slice(0, 2).join(' · ')}</div>
                </div>
              </label>
            `).join('')}
          </div>
        </div>
      `).join('')}

      <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:16px;padding-top:12px;border-top:1px solid #E5E7EB;">
        <button class="btn btn-secondary btn-sm" onclick="document.getElementById('verhalten-5p-modal').remove()">Abbrechen</button>
        <button class="btn btn-primary btn-sm" onclick="verhaltensTo5PUebernehmen()">✅ In 5P übernehmen</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

function verhaltensTo5PUebernehmen() {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);

  const checks = document.querySelectorAll('.verhalten-5p-check:checked:not(:disabled)');
  if (checks.length === 0) {
    showToast('Keine neuen Verhaltensweisen ausgewählt', 'info');
    document.getElementById('verhalten-5p-modal')?.remove();
    return;
  }

  let presentingNeu = 0, perpetuatingNeu = 0;

  checks.forEach(cb => {
    const titel = cb.dataset.titel;
    const kategorie = cb.dataset.kategorie;
    const ursachen = cb.dataset.ursachen ? cb.dataset.ursachen.split('||').filter(Boolean) : [];

    // Presenting: Verhalten selbst
    const katIcon = kategorie === 'Externalisierend' ? '⚡' : kategorie === 'Internalisierend' ? '🌊' : kategorie === 'Beziehung' ? '🤝' : '🏫';
    const presentingEntry = `${katIcon} ${titel}`;
    if (!ff.presenting.includes(presentingEntry)) {
      ff.presenting.push(presentingEntry);
      presentingNeu++;
    }

    // Perpetuating: Top 2 mögliche Ursachen
    ursachen.forEach(u => {
      const perpEntry = `🔄 ${u} (→ ${titel})`;
      if (!ff.perpetuating.includes(perpEntry)) {
        ff.perpetuating.push(perpEntry);
        perpetuatingNeu++;
      }
    });
  });

  DB.saveFallformulierung(ff);
  document.getElementById('verhalten-5p-modal')?.remove();

  const msg = [];
  if (presentingNeu > 0) msg.push(`${presentingNeu}× Presenting`);
  if (perpetuatingNeu > 0) msg.push(`${perpetuatingNeu}× Perpetuating`);
  showToast(`In 5P übernommen: ${msg.join(', ')}`, 'success');
  showProfilTab('fallformulierung');
}

// ============================================================
// SITZUNGEN IM THEMEN-TAB
// ============================================================
function renderSitzungenImThemenTab() {
  const container = document.getElementById('sitzungen-im-themen-tab');
  if (!container) return;

  const notizen = DB.getNotizen(APP.currentSchuelerId)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const sitzungen = notizen.filter(n => n.kategorie === 'session' || n.kategorie === 'fortschritt');

  container.innerHTML = `
    <div class="card">
      <div class="card-header" style="cursor:pointer;" onclick="
        const el = document.getElementById('sitzungen-liste-eingebettet');
        el.style.display = el.style.display === 'none' ? 'block' : 'none';
        this.querySelector('.toggle-icon').textContent = el.style.display === 'none' ? '▶' : '▼';
      ">
        <span>💬</span>
        <div class="card-title">Sitzungen & Notizen</div>
        <span style="margin-left:auto;display:flex;align-items:center;gap:8px;">
          <span style="font-size:12px;color:#6B7280;">${notizen.length} Einträge</span>
          <span class="toggle-icon" style="font-size:10px;color:#9CA3AF;">▼</span>
        </span>
      </div>
      <div id="sitzungen-liste-eingebettet" class="card-body">
        <div style="display:flex;gap:8px;margin-bottom:12px;">
          <button class="btn btn-primary btn-sm" onclick="showProfilTab('notizen')">+ Neue Notiz / Protokoll</button>
        </div>
        ${notizen.length === 0
          ? '<div style="text-align:center;padding:24px 16px;"><div style="font-size:28px;margin-bottom:8px;">📋</div><div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Noch keine Sitzungen dokumentiert</div><div style="font-size:12px;color:#6B7280;line-height:1.5;">Dokumentiere jede Sitzung mit dem SOAP-Format oben.<br>So entsteht ein vollständiger Verlauf der Bezugsarbeit.</div></div>'
          : notizen.slice(0, 5).map(n => renderNotizKarte(n)).join('') +
            (notizen.length > 5 ? `<div style="text-align:center;padding:8px;">
              <button class="btn btn-secondary btn-sm" onclick="showProfilTab('notizen')">
                Alle ${notizen.length} Einträge anzeigen →
              </button>
            </div>` : '')}
      </div>
    </div>
  `;
}

// ============================================================
// GENOGRAMM
// ============================================================
const GENO_ROLLEN_LABELS = {
  mutter: '👩 Mutter', vater: '👨 Vater', stiefmutter: '👩 Stiefmutter', stiefvater: '👨 Stiefvater',
  schwester: '👧 Schwester', bruder: '👦 Bruder', halbgeschwister: '👶 Halbgeschwister',
  grossmutter: '👵 Großmutter', grossvater: '👴 Großvater',
  pflegemutter: '👩‍🦱 Pflegemutter', pflegevater: '👨‍🦱 Pflegevater',
  'tante-onkel': '🧑 Tante/Onkel', 'partner-in': '💑 Partner/in', 'freund-in': '🤝 Freund/in',
  'betreuer-in': '🧑‍⚕️ Betreuer/in', 'lehrer-in': '🧑‍🏫 Lehrer/in', sonstige: '👤 Sonstige',
};
const GENO_BEZ_STYLES = {
  eng: { farbe: '#22C55E', label: 'Eng', border: '3px solid #22C55E' },
  normal: { farbe: '#3B82F6', label: 'Normal', border: '2px solid #3B82F6' },
  distanziert: { farbe: '#EAB308', label: 'Distanziert', border: '2px dashed #EAB308' },
  konflikt: { farbe: '#EF4444', label: 'Konflikt', border: '2px solid #EF4444' },
  abbruch: { farbe: '#374151', label: 'Abbruch', border: '2px dotted #374151' },
  ambivalent: { farbe: '#F97316', label: 'Ambivalent', border: '2px dashed #F97316' },
};

function getGenogramm() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  return (s && s.genogramm) || [];
}

function saveGenogramm(genogramm) {
  DB.updateSchueler(APP.currentSchuelerId, { genogramm });
}

function addGenogrammPerson() {
  const name = document.getElementById('geno-name').value.trim();
  if (!name) return;
  const rolle = document.getElementById('geno-rolle').value;
  const beziehung = document.getElementById('geno-beziehung').value;
  const notiz = document.getElementById('geno-notiz').value.trim();
  const geno = getGenogramm();
  geno.push({ name, rolle, beziehung, notiz, id: Date.now() });
  saveGenogramm(geno);
  document.getElementById('geno-name').value = '';
  document.getElementById('geno-notiz').value = '';
  renderGenogramm();
}

function deleteGenogrammPerson(id) {
  const geno = getGenogramm().filter(p => p.id !== id);
  saveGenogramm(geno);
  renderGenogramm();
}

// ============================================================
// VERHALTENSBEOBACHTUNG
// ============================================================
var verhaltensFilter = '';

function renderVerhalten() {
  var container = document.getElementById('verhalten-container');
  if (!container) return;

  var query = verhaltensFilter.toLowerCase().trim();

  var html = '';

  // Header
  html += '<div style="margin-bottom:20px;">';
  html += '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;flex-wrap:wrap;">';
  html += '<h2 style="margin:0;font-size:22px;">👁️ Verhaltensbeobachtung & Handlungshilfen</h2>';
  html += '<button onclick="showToolLegitimation(\'verhalten\')" style="background:none;border:1px solid #D1D5DB;border-radius:6px;padding:4px 10px;font-size:12px;cursor:pointer;color:#6B7280;" title="Fachliche Grundlage anzeigen">📚 Fachliche Grundlage</button>';
  html += '</div>';
  html += '<p style="color:#6B7280;margin:0 0 12px 0;font-size:14px;">Was tun wenn ein Kind herausforderndes Verhalten zeigt? Beobachten → Verstehen → Handeln. Jeder Eintrag gibt dir konkrete Skripte und Handlungsempfehlungen.</p>';

  // Suchfeld
  html += '<div style="position:relative;margin-bottom:16px;">';
  html += '<input type="text" id="verhalten-suche" placeholder="🔍 Suche: z.B. oppositionell, Rückzug, Aggression, Schulvermeidung..." ';
  html += 'value="' + escapeHtml(verhaltensFilter) + '" ';
  html += 'oninput="verhaltensFilter=this.value;renderVerhalten()" ';
  html += 'style="width:100%;padding:10px 14px;border:1px solid #D1D5DB;border-radius:8px;font-size:14px;box-sizing:border-box;">';
  html += '</div>';

  // Quick-Tags
  html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;">';
  var quickTags = ['Oppositionell', 'Aggression', 'Rückzug', 'Angst', 'Selbstverletzung', 'Schulvermeidung', 'Dissoziation', 'Lügen'];
  for (var t = 0; t < quickTags.length; t++) {
    var tag = quickTags[t];
    var isActive = query && tag.toLowerCase().indexOf(query) !== -1;
    html += '<button onclick="verhaltensFilter=\'' + tag + '\';renderVerhalten();" style="padding:4px 12px;border-radius:16px;border:1px solid ' + (isActive ? '#3B82F6' : '#E5E7EB') + ';background:' + (isActive ? '#EFF6FF' : '#fff') + ';font-size:12px;cursor:pointer;color:' + (isActive ? '#2563EB' : '#6B7280') + ';">' + tag + '</button>';
  }
  if (query) {
    html += '<button onclick="verhaltensFilter=\'\';renderVerhalten();" style="padding:4px 12px;border-radius:16px;border:1px solid #FCA5A5;background:#FEF2F2;font-size:12px;cursor:pointer;color:#DC2626;">✕ Filter löschen</button>';
  }
  html += '</div>';
  html += '</div>';

  // Kategorien
  for (var k = 0; k < VERHALTENS_KATALOG.length; k++) {
    var kat = VERHALTENS_KATALOG[k];
    var filteredEntries = kat.eintraege.filter(function(e) {
      if (!query) return true;
      return e.titel.toLowerCase().indexOf(query) !== -1 ||
             e.beschreibung.toLowerCase().indexOf(query) !== -1 ||
             e.id.toLowerCase().indexOf(query) !== -1;
    });

    if (filteredEntries.length === 0) continue;

    html += '<div class="card" style="margin-bottom:16px;border-left:4px solid ' + kat.farbe + ';">';
    html += '<div class="card-header" style="cursor:pointer;" onclick="toggleVerhaltensKategorie(\'' + kat.kategorie + '\')">';
    html += '<span>' + kat.icon + '</span>';
    html += '<div class="card-title">' + kat.titel + ' <span style="font-size:12px;color:#9CA3AF;">(' + filteredEntries.length + ')</span></div>';
    html += '<span style="font-size:18px;transition:transform 0.2s;" id="vk-chevron-' + kat.kategorie + '">▾</span>';
    html += '</div>';
    html += '<div class="card-body" id="vk-body-' + kat.kategorie + '">';

    for (var e = 0; e < filteredEntries.length; e++) {
      html += renderVerhaltensEintrag(filteredEntries[e], kat.farbe);
    }

    html += '</div></div>';
  }

  if (!html.includes('card-header')) {
    html += '<div style="text-align:center;padding:40px;color:#9CA3AF;"><p>Keine Verhaltensweisen gefunden für "' + escapeHtml(query) + '"</p></div>';
  }

  container.innerHTML = html;

  // Focus erhalten nach Re-Render
  if (query) {
    var inp = document.getElementById('verhalten-suche');
    if (inp) { inp.focus(); inp.setSelectionRange(query.length, query.length); }
  }
}

function renderVerhaltensEintrag(e, farbe) {
  var html = '';
  html += '<div style="border:1px solid #E5E7EB;border-radius:8px;margin-bottom:10px;overflow:hidden;">';

  // Header (klappbar)
  html += '<div style="padding:12px 16px;cursor:pointer;display:flex;align-items:center;gap:10px;background:#FAFAFA;" onclick="toggleVerhaltensDetail(\'' + e.id + '\')">';
  html += '<span style="font-size:18px;transition:transform 0.2s;" id="ve-chevron-' + e.id + '">▸</span>';
  html += '<div style="flex:1;">';
  html += '<div style="font-weight:600;font-size:15px;">' + e.titel + '</div>';
  html += '<div style="font-size:12px;color:#6B7280;">' + e.beschreibung + '</div>';
  html += '</div>';
  html += '</div>';

  // Detail (versteckt)
  html += '<div id="ve-detail-' + e.id + '" style="display:none;padding:16px;border-top:1px solid #E5E7EB;">';

  // Wie es aussieht
  html += '<div style="margin-bottom:16px;">';
  html += '<h4 style="margin:0 0 8px 0;font-size:14px;color:' + farbe + ';">👁️ Wie es aussieht</h4>';
  html += '<ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;">';
  for (var i = 0; i < e.wie_es_aussieht.length; i++) {
    html += '<li>' + e.wie_es_aussieht[i] + '</li>';
  }
  html += '</ul></div>';

  // Was es bedeuten kann
  html += '<div style="margin-bottom:16px;">';
  html += '<h4 style="margin:0 0 8px 0;font-size:14px;color:' + farbe + ';">🧠 Was es bedeuten kann</h4>';
  for (var j = 0; j < e.was_es_bedeuten_kann.length; j++) {
    var u = e.was_es_bedeuten_kann[j];
    var pvtColor = u.pvt === 'ventral' ? '#059669' : (u.pvt === 'sympathikus' ? '#D97706' : '#7C3AED');
    var pvtLabel = u.pvt === 'ventral' ? '🟢 Ventral' : (u.pvt === 'sympathikus' ? '🟡 Sympathikus' : '🟣 Dorsal');
    html += '<div style="background:#F9FAFB;border-radius:6px;padding:10px 12px;margin-bottom:6px;">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">';
    html += '<strong style="font-size:13px;">' + u.ursache + '</strong>';
    html += '<span style="font-size:11px;color:' + pvtColor + ';background:' + pvtColor + '15;padding:2px 8px;border-radius:10px;">' + pvtLabel + '</span>';
    html += '</div>';
    html += '<p style="margin:0;font-size:12px;color:#4B5563;line-height:1.6;">' + u.erklaerung + '</p>';
    html += '</div>';
  }
  html += '</div>';

  // Do's
  html += '<div style="margin-bottom:16px;">';
  html += '<h4 style="margin:0 0 8px 0;font-size:14px;color:#059669;">✅ Do\'s — So reagierst du richtig</h4>';
  html += '<ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;">';
  for (var d = 0; d < e.dos.length; d++) {
    html += '<li>' + e.dos[d] + '</li>';
  }
  html += '</ul></div>';

  // Don'ts
  html += '<div style="margin-bottom:16px;">';
  html += '<h4 style="margin:0 0 8px 0;font-size:14px;color:#DC2626;">❌ Don\'ts — Das vermeiden</h4>';
  html += '<ul style="margin:0;padding-left:20px;font-size:13px;line-height:1.8;">';
  for (var n = 0; n < e.donts.length; n++) {
    html += '<li>' + e.donts[n] + '</li>';
  }
  html += '</ul></div>';

  // Skripte
  html += '<div style="margin-bottom:16px;">';
  html += '<h4 style="margin:0 0 8px 0;font-size:14px;color:' + farbe + ';">💬 Konkrete Gesprächsskripte</h4>';
  for (var s = 0; s < e.skripte.length; s++) {
    var sk = e.skripte[s];
    html += '<div style="background:#F0F9FF;border-left:3px solid #3B82F6;border-radius:4px;padding:10px 12px;margin-bottom:8px;">';
    html += '<div style="font-size:11px;font-weight:600;color:#1E40AF;margin-bottom:4px;">Situation: ' + sk.situation + '</div>';
    html += '<div style="font-size:13px;color:#1E3A5F;font-style:italic;line-height:1.6;">' + sk.text + '</div>';
    html += '</div>';
  }
  html += '</div>';

  // Eskalation
  html += '<div style="margin-bottom:16px;">';
  html += '<h4 style="margin:0 0 8px 0;font-size:14px;color:#DC2626;">🚨 Wann eskalieren?</h4>';
  for (var x = 0; x < e.eskalation.length; x++) {
    var es = e.eskalation[x];
    html += '<div style="background:#FEF2F2;border-radius:6px;padding:8px 12px;margin-bottom:6px;font-size:13px;">';
    html += '<strong style="color:#991B1B;">' + es.signal + '</strong>';
    html += '<div style="color:#7F1D1D;margin-top:2px;">' + es.aktion + '</div>';
    html += '</div>';
  }
  html += '</div>';

  // Verknüpfungen
  if (e.verwandte_themen && e.verwandte_themen.length > 0) {
    html += '<div style="margin-bottom:8px;display:flex;flex-wrap:wrap;gap:6px;align-items:center;">';
    html += '<span style="font-size:12px;color:#6B7280;">Verwandte Themen:</span>';
    for (var v = 0; v < e.verwandte_themen.length; v++) {
      html += '<span style="font-size:11px;background:#EFF6FF;color:#2563EB;padding:2px 8px;border-radius:10px;cursor:pointer;" onclick="showProfilTab(\'themen\')">' + e.verwandte_themen[v] + '</span>';
    }
    html += '</div>';
  }

  // Wiki-Link
  if (typeof findWikiForVerhalten === 'function') {
    var wikiArt = findWikiForVerhalten(e.id);
    if (wikiArt) {
      html += '<div style="margin-top:8px;">' + renderWikiLink(wikiArt.id) + '</div>';
    }
  }

  // Action Buttons
  html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #E5E7EB;display:flex;gap:6px;flex-wrap:wrap;">';
  var soapText = e.titel + ': ' + e.wie_es_aussieht.slice(0, 3).join('; ');
  var escapedTitel = e.titel.replace(/'/g, "\\'").replace(/"/g, "&quot;");
  var escapedId = e.id.replace(/'/g, "\\'");
  var escapedSoap = soapText.replace(/'/g, "\\'").replace(/"/g, "&quot;");
  var katIcon = farbe === '#D97706' ? '⚡' : farbe === '#7C3AED' ? '🌊' : farbe === '#059669' ? '🤝' : '🏫';

  // Beobachtet-Toggle
  html += '<button onclick="toggleVerhaltensBeobachtet(\'' + escapedId + '\', this)" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #D1D5DB;border-radius:6px;background:#fff;cursor:pointer;color:#6B7280;" title="Als beobachtet markieren">👁️ Beobachtet</button>';

  // Beobachtung notieren
  html += '<button onclick="verhaltensBeobachtungNotieren(\'' + escapedId + '\', \'' + escapedTitel + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #D1D5DB;border-radius:6px;background:#fff;cursor:pointer;color:#6B7280;" title="Beobachtung notieren">📝 Notieren</button>';

  // In 5P übernehmen
  html += '<button onclick="verhaltensEintragTo5P(\'' + escapedId + '\', \'' + escapedTitel + '\', \'' + katIcon + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #3B82F6;border-radius:6px;background:#EFF6FF;cursor:pointer;color:#2563EB;" title="In 5P-Analyse übernehmen">🧩 In 5P</button>';

  // SOAP übernehmen
  html += '<button onclick="uebernehmeInSOAP(\'' + escapedSoap + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #D1D5DB;border-radius:6px;background:#fff;cursor:pointer;color:#6B7280;" title="In SOAP-Protokoll übernehmen">📋 SOAP</button>';

  // Sitzung starten
  var verwandteThemen = (e.verwandte_themen || []);
  if (verwandteThemen.length > 0) {
    html += '<button onclick="verhaltensStarteSitzung(\'' + verwandteThemen[0] + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #22C55E;border-radius:6px;background:#F0FDF4;cursor:pointer;color:#166534;" title="Sitzung zum verwandten Thema starten">▶️ Sitzung</button>';
  }
  html += '</div>';

  html += '</div>'; // detail
  html += '</div>'; // card
  return html;
}

function toggleVerhaltensKategorie(katId) {
  var body = document.getElementById('vk-body-' + katId);
  var chevron = document.getElementById('vk-chevron-' + katId);
  if (!body) return;
  if (body.style.display === 'none') {
    body.style.display = '';
    if (chevron) chevron.textContent = '▾';
  } else {
    body.style.display = 'none';
    if (chevron) chevron.textContent = '▸';
  }
}

function toggleVerhaltensDetail(eId) {
  var detail = document.getElementById('ve-detail-' + eId);
  var chevron = document.getElementById('ve-chevron-' + eId);
  if (!detail) return;
  if (detail.style.display === 'none') {
    detail.style.display = '';
    if (chevron) chevron.textContent = '▾';
  } else {
    detail.style.display = 'none';
    if (chevron) chevron.textContent = '▸';
  }
}

function uebernehmeInSOAP(text) {
  // Versuche den SOAP-Objektiv-Textarea zu finden und Text einzufügen
  var textarea = document.getElementById('soap-objektiv');
  if (textarea) {
    var current = textarea.value.trim();
    textarea.value = current ? current + '\n' + text : text;
    textarea.dispatchEvent(new Event('change'));
    showProfilTab('themen');
    // Kurze Bestätigung
    alert('✅ In SOAP-Objektiv übernommen:\n\n' + text);
  } else {
    // Wenn kein SOAP-Textarea offen ist, Text in Zwischenablage
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(function() {
        alert('📋 Text in Zwischenablage kopiert (kein SOAP-Protokoll offen):\n\n' + text);
      });
    } else {
      alert('📋 Text zum Einfügen:\n\n' + text + '\n\nKopiere diesen Text in dein SOAP-Objektiv-Feld.');
    }
  }
}

// ---- Verhalten Action Buttons ----
function toggleVerhaltensBeobachtet(eId, btn) {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  if (!s.verhaltensBeobachtungen) s.verhaltensBeobachtungen = {};
  s.verhaltensBeobachtungen[eId] = !s.verhaltensBeobachtungen[eId];
  DB.updateSchueler(sid, { verhaltensBeobachtungen: s.verhaltensBeobachtungen });
  if (s.verhaltensBeobachtungen[eId]) {
    btn.style.background = '#DCFCE7';
    btn.style.borderColor = '#22C55E';
    btn.style.color = '#166534';
    btn.textContent = '✅ Beobachtet';
    showToast('"' + eId + '" als beobachtet markiert', 'success');
  } else {
    btn.style.background = '#fff';
    btn.style.borderColor = '#D1D5DB';
    btn.style.color = '#6B7280';
    btn.textContent = '👁️ Beobachtet';
  }
}

function verhaltensBeobachtungNotieren(eId, titel) {
  const notiz = prompt('Beobachtung zu "' + titel + '" notieren:');
  if (!notiz) return;
  const sid = APP.currentSchuelerId;
  DB.addNotiz(sid, {
    text: '👁️ Verhalten: ' + titel + ' — ' + notiz,
    kategorie: 'verhalten',
    datum: new Date().toISOString(),
    themaId: eId,
  });
  showToast('Beobachtung gespeichert', 'success');
}

function verhaltensEintragTo5P(eId, titel, katIcon) {
  const sid = APP.currentSchuelerId;
  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);

  const presentingEntry = katIcon + ' ' + titel;
  if (!ff.presenting.includes(presentingEntry)) {
    ff.presenting.push(presentingEntry);
    DB.saveFallformulierung(ff);
    showToast('"' + titel + '" in 5P-Presenting übernommen', 'success');
  } else {
    showToast('Bereits in 5P vorhanden', 'info');
  }
}

function verhaltensStarteSitzung(themaId) {
  showProfilTab('themen');
  // Try to open the theme
  setTimeout(function() {
    if (typeof renderSitzungsStart === 'function') {
      renderSitzungsStart(themaId);
    }
  }, 200);
}

function renderGenogramm() {
  const geno = getGenogramm();
  const liste = document.getElementById('genogramm-liste');
  const visual = document.getElementById('genogramm-visual');
  if (!liste || !visual) return;

  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const schuelerName = s ? s.name : 'Schüler';

  if (geno.length === 0) {
    liste.innerHTML = '<div style="text-align:center;padding:16px;color:#9CA3AF;font-size:13px;">Noch keine Personen erfasst. Füge Familienmitglieder und Bezugspersonen hinzu.</div>';
    visual.innerHTML = '';
    return;
  }

  // Visual: Schüler in Mitte, Personen drum herum als Karten
  const eltern = geno.filter(p => ['mutter','vater','stiefmutter','stiefvater','pflegemutter','pflegevater'].includes(p.rolle));
  const geschwister = geno.filter(p => ['schwester','bruder','halbgeschwister'].includes(p.rolle));
  const erweitert = geno.filter(p => ['grossmutter','grossvater','tante-onkel'].includes(p.rolle));
  const andere = geno.filter(p => !eltern.includes(p) && !geschwister.includes(p) && !erweitert.includes(p));

  function personCard(p) {
    const bez = GENO_BEZ_STYLES[p.beziehung] || GENO_BEZ_STYLES.normal;
    const rolleLabel = GENO_ROLLEN_LABELS[p.rolle] || p.rolle;
    return '<div style="background:#fff;border:' + bez.border + ';border-radius:10px;padding:8px 10px;min-width:100px;text-align:center;position:relative;">'
      + '<div style="font-size:13px;font-weight:600;">' + escapeHtml(p.name) + '</div>'
      + '<div style="font-size:10px;color:#6B7280;">' + rolleLabel + '</div>'
      + '<div style="font-size:9px;color:' + bez.farbe + ';font-weight:600;margin-top:2px;">' + bez.label + '</div>'
      + (p.notiz ? '<div style="font-size:9px;color:#9CA3AF;margin-top:2px;font-style:italic;">' + escapeHtml(p.notiz) + '</div>' : '')
      + '<button onclick="deleteGenogrammPerson(' + p.id + ')" style="position:absolute;top:2px;right:4px;background:none;border:none;font-size:10px;cursor:pointer;color:#D1D5DB;">✕</button>'
      + '</div>';
  }

  let vHtml = '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';

  if (erweitert.length > 0) {
    vHtml += '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;opacity:0.8;">'
      + erweitert.map(personCard).join('') + '</div>'
      + '<div style="color:#D1D5DB;font-size:16px;">│</div>';
  }

  if (eltern.length > 0) {
    vHtml += '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'
      + eltern.map(personCard).join('') + '</div>'
      + '<div style="color:#D1D5DB;font-size:16px;">│</div>';
  }

  vHtml += '<div style="background:linear-gradient(135deg,#6366F1,#8B5CF6);color:#fff;border-radius:12px;padding:10px 20px;font-weight:700;font-size:14px;box-shadow:0 2px 8px rgba(99,102,241,0.3);">'
    + '⭐ ' + escapeHtml(schuelerName) + '</div>';

  if (geschwister.length > 0) {
    vHtml += '<div style="color:#D1D5DB;font-size:16px;">│</div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">'
      + geschwister.map(personCard).join('') + '</div>';
  }

  if (andere.length > 0) {
    vHtml += '<div style="color:#D1D5DB;font-size:16px;">│</div>'
      + '<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center;opacity:0.9;">'
      + andere.map(personCard).join('') + '</div>';
  }

  vHtml += '</div>';
  visual.innerHTML = vHtml;

  // Legende
  liste.innerHTML = '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">'
    + Object.entries(GENO_BEZ_STYLES).map(([k, v]) =>
      '<span style="font-size:10px;padding:2px 8px;border:' + v.border + ';border-radius:12px;color:' + v.farbe + ';">' + v.label + '</span>'
    ).join('')
    + '</div>';
}

// ============================================================
// GESPRÄCHSLEITFÄDEN — Rendering
// ============================================================
var gespraechsleitfaedenOpen = {};

function renderGespraechsleitfaedenWidget() {
  var container = document.getElementById('gespraechsleitfaeden-widget');
  if (!container || typeof GESPRAECHSLEITFAEDEN === 'undefined') return;

  var html = '<div class="card" style="margin-top:16px;">';
  html += '<div class="card-header" style="cursor:pointer;" onclick="toggleGespraechsleitfaedenWidget()">';
  html += '<span>📋</span><div class="card-title">Gesprächsleitfäden</div>';
  html += '<span style="font-size:12px;color:#6B7280;">6 Leitfäden für den Praxisalltag</span>';
  html += '</div>';
  html += '<div class="card-body" id="gespraechsleitfaeden-body">';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:10px;">';

  GESPRAECHSLEITFAEDEN.forEach(function(g) {
    html += '<div onclick="openGespraechsleitfaden(\'' + g.id + '\')" style="cursor:pointer;padding:14px;border-radius:10px;border:2px solid ' + g.farbe + '20;background:' + g.farbe + '08;transition:all 0.2s;" onmouseover="this.style.borderColor=\'' + g.farbe + '\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'' + g.farbe + '20\';this.style.transform=\'none\'">';
    html += '<div style="font-size:28px;margin-bottom:6px;">' + g.icon + '</div>';
    html += '<div style="font-weight:600;font-size:13px;color:#1E293B;">' + g.titel + '</div>';
    html += '<div style="font-size:11px;color:#6B7280;margin-top:4px;line-height:1.4;">' + g.wann.substring(0, 80) + '...</div>';
    html += '</div>';
  });

  html += '</div></div></div>';
  container.innerHTML = html;
}

function toggleGespraechsleitfaedenWidget() {
  var body = document.getElementById('gespraechsleitfaeden-body');
  if (body) body.style.display = body.style.display === 'none' ? '' : 'none';
}

function openGespraechsleitfaden(id) {
  var g = GESPRAECHSLEITFAEDEN.find(function(x) { return x.id === id; });
  if (!g) return;

  var html = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)this.remove()">';
  html += '<div style="background:white;border-radius:16px;max-width:800px;width:100%;max-height:90vh;overflow-y:auto;padding:0;" onclick="event.stopPropagation()">';
  
  // Header
  html += '<div style="background:' + g.farbe + ';color:white;padding:24px;border-radius:16px 16px 0 0;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:start;">';
  html += '<div><span style="font-size:36px;">' + g.icon + '</span>';
  html += '<h2 style="margin:8px 0 4px;font-size:22px;">' + g.titel + '</h2>';
  html += '<p style="margin:0;opacity:0.9;font-size:13px;">' + g.wann + '</p></div>';
  html += '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer;">✕</button>';
  html += '</div></div>';

  html += '<div style="padding:24px;">';

  // Vorbereitung
  html += '<div style="background:#FEF3C7;border-radius:10px;padding:14px;margin-bottom:16px;">';
  html += '<div style="font-weight:600;font-size:13px;color:#92400E;margin-bottom:8px;">📝 Vorbereitung</div>';
  g.vorbereitung.forEach(function(v) {
    html += '<div style="font-size:12px;color:#78350F;padding:3px 0;display:flex;gap:6px;"><span>☐</span><span>' + v + '</span></div>';
  });
  html += '</div>';

  // Phasen
  g.phasen.forEach(function(p, i) {
    var isOpen = gespraechsleitfaedenOpen[g.id + '_phase_' + i];
    html += '<div style="border:1px solid #E5E7EB;border-radius:10px;margin-bottom:10px;overflow:hidden;">';
    html += '<div onclick="toggleGespraechsPhase(\'' + g.id + '\',' + i + ')" style="cursor:pointer;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;background:#F9FAFB;">';
    html += '<div><span style="display:inline-block;background:' + g.farbe + ';color:white;border-radius:50%;width:24px;height:24px;text-align:center;line-height:24px;font-size:12px;font-weight:600;margin-right:8px;">' + (i + 1) + '</span>';
    html += '<span style="font-weight:600;font-size:13px;">' + p.name + '</span></div>';
    html += '<span style="font-size:11px;color:#6B7280;background:#F3F4F6;padding:2px 8px;border-radius:10px;">⏱ ' + p.dauer + '</span>';
    html += '</div>';
    html += '<div id="gespraechs-phase-' + g.id + '-' + i + '" style="display:' + (isOpen ? 'block' : 'none') + ';padding:14px;">';

    // Skripte
    html += '<div style="margin-bottom:10px;"><div style="font-size:11px;font-weight:600;color:#6B7280;margin-bottom:6px;">💬 Gesprächsskripte</div>';
    p.skripte.forEach(function(s) {
      html += '<div style="background:#EFF6FF;border-left:3px solid #3B82F6;padding:8px 10px;margin-bottom:4px;border-radius:0 6px 6px 0;font-size:12px;color:#1E40AF;font-style:italic;">' + s + '</div>';
    });
    html += '</div>';

    // Tipps
    html += '<div><div style="font-size:11px;font-weight:600;color:#6B7280;margin-bottom:6px;">💡 Praxis-Tipps</div>';
    p.tipps.forEach(function(t) {
      html += '<div style="font-size:12px;color:#374151;padding:3px 0;display:flex;gap:6px;"><span style="color:#10B981;">•</span><span>' + t + '</span></div>';
    });
    html += '</div>';

    html += '</div></div>';
  });

  // Do's & Don'ts
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:16px;">';
  html += '<div style="background:#ECFDF5;border-radius:10px;padding:14px;">';
  html += '<div style="font-weight:600;font-size:13px;color:#065F46;margin-bottom:8px;">✅ Do\'s</div>';
  g.dos.forEach(function(d) {
    html += '<div style="font-size:12px;color:#047857;padding:3px 0;">✓ ' + d + '</div>';
  });
  html += '</div>';
  html += '<div style="background:#FEF2F2;border-radius:10px;padding:14px;">';
  html += '<div style="font-weight:600;font-size:13px;color:#991B1B;margin-bottom:8px;">❌ Don\'ts</div>';
  g.donts.forEach(function(d) {
    html += '<div style="font-size:12px;color:#B91C1C;padding:3px 0;">✗ ' + d + '</div>';
  });
  html += '</div></div>';

  // Nachbereitung & Dokumentation
  html += '<div style="background:#F0F9FF;border-radius:10px;padding:14px;margin-top:16px;">';
  html += '<div style="font-weight:600;font-size:13px;color:#0C4A6E;margin-bottom:6px;">📄 Nachbereitung & Dokumentation</div>';
  html += '<div style="font-size:12px;color:#0369A1;margin-bottom:6px;">' + g.nachbereitung + '</div>';
  html += '<div style="font-size:11px;color:#6B7280;border-top:1px solid #BAE6FD;padding-top:6px;margin-top:6px;">📋 ' + g.dokumentation + '</div>';
  html += '</div>';

  html += '</div></div></div>';

  var overlay = document.createElement('div');
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstChild);
}

function toggleGespraechsPhase(gId, phaseIdx) {
  var key = gId + '_phase_' + phaseIdx;
  gespraechsleitfaedenOpen[key] = !gespraechsleitfaedenOpen[key];
  var el = document.getElementById('gespraechs-phase-' + gId + '-' + phaseIdx);
  if (el) el.style.display = gespraechsleitfaedenOpen[key] ? 'block' : 'none';
}

// ============================================================
// FALLBEISPIELE — Rendering
// ============================================================
function renderFallbeispieleWidget() {
  var container = document.getElementById('gespraechsleitfaeden-widget');
  if (!container || typeof FALLBEISPIELE === 'undefined') return;

  // Append after existing widget content
  var html = '<div class="card" style="margin-top:16px;">';
  html += '<div class="card-header" style="cursor:pointer;" onclick="this.nextElementSibling.style.display=this.nextElementSibling.style.display===\'none\'?\'\':\'none\'">';
  html += '<span>📖</span><div class="card-title">Fallbeispiele</div>';
  html += '<span style="font-size:12px;color:#6B7280;">3 komplett durchgearbeitete Fälle</span>';
  html += '</div>';
  html += '<div class="card-body">';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:10px;">';

  FALLBEISPIELE.forEach(function(f) {
    html += '<div onclick="openFallbeispiel(\'' + f.id + '\')" style="cursor:pointer;padding:14px;border-radius:10px;border:2px solid ' + f.farbe + '20;background:' + f.farbe + '08;transition:all 0.2s;" onmouseover="this.style.borderColor=\'' + f.farbe + '\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'' + f.farbe + '20\';this.style.transform=\'none\'">';
    html += '<div style="font-size:28px;margin-bottom:6px;">' + f.icon + '</div>';
    html += '<div style="font-weight:600;font-size:13px;color:#1E293B;">' + f.titel + '</div>';
    html += '<div style="font-size:11px;color:#6B7280;margin-top:4px;"><span style="background:' + f.farbe + '20;color:' + f.farbe + ';padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;">' + f.typ + '</span></div>';
    html += '</div>';
  });

  html += '</div></div></div>';
  container.innerHTML += html;
}

function openFallbeispiel(id) {
  var f = FALLBEISPIELE.find(function(x) { return x.id === id; });
  if (!f) return;

  var html = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)this.remove()">';
  html += '<div style="background:white;border-radius:16px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;padding:0;" onclick="event.stopPropagation()">';

  // Header
  html += '<div style="background:' + f.farbe + ';color:white;padding:24px;border-radius:16px 16px 0 0;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:start;">';
  html += '<div><span style="font-size:36px;">' + f.icon + '</span>';
  html += '<h2 style="margin:8px 0 4px;font-size:20px;">' + f.titel + '</h2>';
  html += '<span style="background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:12px;font-size:12px;">' + f.typ + '</span></div>';
  html += '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer;">✕</button>';
  html += '</div></div>';

  html += '<div style="padding:24px;">';

  // Fallvignette
  html += '<div style="background:#F9FAFB;border-radius:10px;padding:14px;margin-bottom:16px;border-left:4px solid ' + f.farbe + ';">';
  html += '<div style="font-weight:600;font-size:13px;margin-bottom:6px;">📋 Fallvignette</div>';
  html += '<div style="font-size:12px;color:#374151;line-height:1.6;">' + f.vorstellung + '</div>';
  html += '</div>';

  // Screening-Ergebnis
  html += '<details style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">🔍 Screening-Ergebnis</summary>';
  html += '<div style="padding:8px 0;">';
  f.screening_ergebnis.auffaellig.forEach(function(s) {
    html += '<div style="background:#FEF2F2;border-left:3px solid #EF4444;padding:8px 10px;margin-bottom:6px;border-radius:0 6px 6px 0;">';
    html += '<div style="font-weight:600;font-size:12px;color:#991B1B;">' + s.domain + ' — Score: ' + s.score + '/' + s.cutoff + ' (Cutoff)</div>';
    html += '<div style="font-size:11px;color:#7F1D1D;margin-top:2px;">' + s.text + '</div></div>';
  });
  html += '<div style="font-size:11px;color:#6B7280;margin-top:6px;">Unauffällig: ' + f.screening_ergebnis.unauffaellig.join(', ') + '</div>';
  html += '</div></details>';

  // 5P-Formulierung
  html += '<details style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">🧩 5P-Fallformulierung</summary>';
  html += '<div style="padding:8px 0;">';
  var pLabels = { presenting: '🔴 Presenting', predisposing: '🟡 Predisposing', precipitating: '🟠 Precipitating', perpetuating: '🔵 Perpetuating', protective: '🟢 Protective' };
  ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(function(key) {
    html += '<div style="margin-bottom:10px;"><div style="font-weight:600;font-size:12px;margin-bottom:4px;">' + pLabels[key] + '</div>';
    f.fivep[key].forEach(function(item) {
      html += '<div style="font-size:12px;color:#374151;padding:3px 0;">• ' + item + '</div>';
    });
    html += '</div>';
  });
  html += '<div style="background:#EFF6FF;border-radius:8px;padding:10px;margin-top:8px;"><div style="font-weight:600;font-size:12px;color:#1E40AF;margin-bottom:4px;">💡 Hypothese</div>';
  html += '<div style="font-size:12px;color:#1E40AF;line-height:1.5;font-style:italic;">' + f.fivep.hypothese + '</div></div>';
  html += '</div></details>';

  // SMART-Ziele
  html += '<details style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">🎯 SMART-Ziele</summary>';
  html += '<div style="padding:8px 0;">';
  f.ziele.forEach(function(z) {
    html += '<div style="background:#ECFDF5;border-left:3px solid #10B981;padding:8px 10px;margin-bottom:6px;border-radius:0 6px 6px 0;">';
    html += '<div style="font-size:11px;font-weight:600;color:#065F46;">' + z.bereich + '</div>';
    html += '<div style="font-size:12px;color:#047857;margin-top:2px;">' + z.smart + '</div></div>';
  });
  html += '</div></details>';

  // Sitzungsverlauf (SOAP)
  html += '<details style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">📝 Sitzungsverlauf (SOAP-Beispiele)</summary>';
  html += '<div style="padding:8px 0;">';
  f.intervention_verlauf.forEach(function(s) {
    html += '<div style="border:1px solid #E5E7EB;border-radius:10px;padding:12px;margin-bottom:10px;">';
    html += '<div style="display:flex;justify-content:space-between;margin-bottom:8px;">';
    html += '<span style="font-weight:600;font-size:13px;">Sitzung ' + s.sitzung + ': ' + s.thema + '</span>';
    var pvtColors = { dorsal: '#8B5CF6', sympathikus: '#EF4444', ventral: '#10B981', 'sympathikus-ventral': '#F59E0B', 'dorsal-sympathikus': '#F97316', 'dorsal-ventral': '#6366F1', 'ventral-sympathikus': '#14B8A6' };
    html += '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:' + (pvtColors[s.pvt] || '#6B7280') + '20;color:' + (pvtColors[s.pvt] || '#6B7280') + ';font-weight:500;">' + s.pvt + '</span></div>';
    ['s', 'o', 'a', 'p'].forEach(function(k) {
      var labels = { s: 'S — Subjektiv', o: 'O — Objektiv', a: 'A — Assessment', p: 'P — Plan' };
      var colors = { s: '#3B82F6', o: '#10B981', a: '#F59E0B', p: '#8B5CF6' };
      html += '<div style="margin-bottom:6px;"><span style="font-size:10px;font-weight:600;color:' + colors[k] + ';">' + labels[k] + '</span>';
      html += '<div style="font-size:11px;color:#374151;line-height:1.5;margin-top:2px;">' + s.soap[k] + '</div></div>';
    });
    html += '</div>';
  });
  html += '</div></details>';

  // PVT-Verlauf
  html += '<details style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">🧠 PVT-Verlauf</summary>';
  html += '<div style="padding:8px 0;display:flex;gap:10px;flex-wrap:wrap;">';
  f.pvt_verlauf.forEach(function(p) {
    var pvtColors = { dorsal: '#8B5CF6', sympathikus: '#EF4444', ventral: '#10B981', 'sympathikus-ventral': '#F59E0B', 'dorsal-sympathikus': '#F97316', 'dorsal-ventral': '#6366F1', 'ventral-sympathikus': '#14B8A6' };
    html += '<div style="flex:1;min-width:180px;background:' + (pvtColors[p.zustand] || '#6B7280') + '10;border:1px solid ' + (pvtColors[p.zustand] || '#6B7280') + '30;border-radius:8px;padding:10px;">';
    html += '<div style="font-weight:600;font-size:12px;color:' + (pvtColors[p.zustand] || '#6B7280') + ';">Sitzung ' + p.sitzung + '</div>';
    html += '<div style="font-size:11px;color:#374151;margin-top:4px;">' + p.beschreibung + '</div></div>';
  });
  html += '</div></details>';

  // Outcome
  html += '<div style="background:linear-gradient(135deg,#ECFDF5,#EFF6FF);border:1px solid #BBF7D0;border-radius:10px;padding:14px;">';
  html += '<div style="font-weight:600;font-size:13px;color:#065F46;margin-bottom:6px;">🏆 Outcome</div>';
  html += '<div style="font-size:12px;color:#047857;line-height:1.6;">' + f.outcome + '</div>';
  html += '</div>';

  html += '</div></div></div>';

  var overlay = document.createElement('div');
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstChild);
}

// ============================================================
// 5P KOMPLETT-BEISPIEL — Button + Rendering
// ============================================================
function open5PBeispiel() {
  if (typeof FIVEP_BEISPIEL_KOMPLETT === 'undefined') return;
  var b = FIVEP_BEISPIEL_KOMPLETT;

  var html = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)this.remove()">';
  html += '<div style="background:white;border-radius:16px;max-width:800px;width:100%;max-height:90vh;overflow-y:auto;padding:0;" onclick="event.stopPropagation()">';

  html += '<div style="background:linear-gradient(135deg,#3B82F6,#6366F1);color:white;padding:24px;border-radius:16px 16px 0 0;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:start;">';
  html += '<div><span style="font-size:36px;">📖</span>';
  html += '<h2 style="margin:8px 0 4px;font-size:20px;">' + b.titel + '</h2>';
  html += '<p style="margin:0;opacity:0.9;font-size:12px;">' + b.beschreibung + '</p></div>';
  html += '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:32px;height:32px;border-radius:50%;font-size:18px;cursor:pointer;">✕</button>';
  html += '</div></div>';

  html += '<div style="padding:24px;">';

  var sectionColors = { presenting: { bg: '#FEF2F2', border: '#EF4444', title: '🔴 Presenting — Was zeigt sich?' },
    predisposing: { bg: '#FFFBEB', border: '#F59E0B', title: '🟡 Predisposing — Was macht anfällig?' },
    precipitating: { bg: '#FFF7ED', border: '#F97316', title: '🟠 Precipitating — Was hat es ausgelöst?' },
    perpetuating: { bg: '#EFF6FF', border: '#3B82F6', title: '🔵 Perpetuating — Was hält es aufrecht?' },
    protective: { bg: '#ECFDF5', border: '#10B981', title: '🟢 Protective — Was schützt?' } };

  ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(function(key) {
    var sc = sectionColors[key];
    html += '<div style="background:' + sc.bg + ';border-left:4px solid ' + sc.border + ';border-radius:0 10px 10px 0;padding:14px;margin-bottom:12px;">';
    html += '<div style="font-weight:600;font-size:13px;color:#1E293B;margin-bottom:8px;">' + sc.title + '</div>';
    b[key].forEach(function(item) {
      html += '<div style="margin-bottom:8px;"><div style="font-size:12px;font-weight:500;color:#1F2937;">• ' + item.eintrag + '</div>';
      html += '<div style="font-size:11px;color:#6B7280;margin-left:14px;margin-top:2px;font-style:italic;">→ ' + item.erklaerung + '</div></div>';
    });
    html += '</div>';
  });

  // Hypothese
  html += '<div style="background:linear-gradient(135deg,#EFF6FF,#F0FDF4);border:2px solid #3B82F6;border-radius:10px;padding:16px;">';
  html += '<div style="font-weight:600;font-size:14px;color:#1E40AF;margin-bottom:8px;">💡 Hypothese — So hängt alles zusammen</div>';
  html += '<div style="font-size:12px;color:#1E40AF;line-height:1.7;">' + b.hypothese + '</div>';
  html += '</div>';

  html += '</div></div></div>';

  var overlay = document.createElement('div');
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstChild);
}

// ============================================================
// PÄDAGOGISCHES WIKI — Wissensdatenbank
// ============================================================
var wikiFilter = '';
var wikiKategorieFilter = '';

function renderWiki() {
  var container = document.getElementById('wiki-container');
  if (!container || typeof WIKI_ARTIKEL === 'undefined') return;

  var artikel = WIKI_ARTIKEL;

  // Filter
  if (wikiFilter) {
    var q = wikiFilter.toLowerCase();
    artikel = artikel.filter(function(a) {
      return a.titel.toLowerCase().indexOf(q) !== -1 ||
        (a.aliases && a.aliases.some(function(al) { return al.toLowerCase().indexOf(q) !== -1; })) ||
        a.definition.toLowerCase().indexOf(q) !== -1 ||
        (a.kategorie && a.kategorie.toLowerCase().indexOf(q) !== -1);
    });
  }
  if (wikiKategorieFilter) {
    artikel = artikel.filter(function(a) { return a.kategorie === wikiKategorieFilter; });
  }

  var html = '';

  // Header
  html += '<div style="margin-bottom:20px;">';
  html += '<h3 style="margin:0 0 4px;font-size:20px;">📚 Pädagogisches Wiki</h3>';
  html += '<p style="margin:0;font-size:12px;color:#6B7280;">Nachschlagewerk für Fachkräfte — Störungsbilder, Methoden, Konzepte & Recht</p>';
  html += '</div>';

  // Suchfeld
  html += '<div style="margin-bottom:14px;">';
  html += '<input type="text" id="wiki-search" placeholder="Suche (z.B. ADHS, Bindung, ODD, Trauma...)" value="' + escapeHtml(wikiFilter) + '" oninput="wikiFilter=this.value;renderWiki();" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:10px;font-size:13px;outline:none;transition:border-color 0.2s;" onfocus="this.style.borderColor=\'#3B82F6\'" onblur="this.style.borderColor=\'#E5E7EB\'">';
  html += '</div>';

  // Kategorie-Filter
  if (typeof WIKI_KATEGORIEN !== 'undefined') {
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">';
    html += '<button onclick="wikiKategorieFilter=\'\';renderWiki();" style="padding:5px 12px;border-radius:20px;border:1px solid ' + (!wikiKategorieFilter ? '#3B82F6' : '#E5E7EB') + ';background:' + (!wikiKategorieFilter ? '#3B82F6' : 'white') + ';color:' + (!wikiKategorieFilter ? 'white' : '#374151') + ';font-size:12px;cursor:pointer;">Alle</button>';
    WIKI_KATEGORIEN.forEach(function(k) {
      var active = wikiKategorieFilter === k.id;
      html += '<button onclick="wikiKategorieFilter=\'' + k.id + '\';renderWiki();" style="padding:5px 12px;border-radius:20px;border:1px solid ' + (active ? k.farbe : '#E5E7EB') + ';background:' + (active ? k.farbe : 'white') + ';color:' + (active ? 'white' : '#374151') + ';font-size:12px;cursor:pointer;">' + k.icon + ' ' + k.titel + '</button>';
    });
    html += '</div>';
  }

  // Anzahl
  html += '<div style="font-size:11px;color:#9CA3AF;margin-bottom:10px;">' + artikel.length + ' Artikel' + (wikiFilter || wikiKategorieFilter ? ' (gefiltert)' : '') + '</div>';

  // Artikel-Grid
  if (artikel.length === 0) {
    html += '<div style="text-align:center;padding:40px;color:#9CA3AF;"><div style="font-size:36px;margin-bottom:8px;">🔍</div>Kein Artikel gefunden. Versuche einen anderen Suchbegriff.</div>';
  } else {
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">';
    artikel.forEach(function(a) {
      var kat = (typeof WIKI_KATEGORIEN !== 'undefined') ? WIKI_KATEGORIEN.find(function(k) { return k.id === a.kategorie; }) : null;
      html += '<div onclick="openWikiArtikel(\'' + a.id + '\')" style="cursor:pointer;padding:16px;border-radius:12px;border:1px solid #E5E7EB;background:white;transition:all 0.2s;box-shadow:0 1px 3px rgba(0,0,0,0.05);" onmouseover="this.style.borderColor=\'' + a.farbe + '\';this.style.boxShadow=\'0 4px 12px rgba(0,0,0,0.1)\';this.style.transform=\'translateY(-2px)\'" onmouseout="this.style.borderColor=\'#E5E7EB\';this.style.boxShadow=\'0 1px 3px rgba(0,0,0,0.05)\';this.style.transform=\'none\'">';
      html += '<div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px;">';
      html += '<span style="font-size:28px;">' + a.icon + '</span>';
      if (a.icd10) html += '<span style="font-size:10px;background:#F3F4F6;color:#6B7280;padding:2px 6px;border-radius:4px;font-family:monospace;">' + a.icd10.code + '</span>';
      html += '</div>';
      html += '<div style="font-weight:700;font-size:14px;color:#1E293B;margin-bottom:4px;">' + a.titel + '</div>';
      if (kat) html += '<span style="font-size:10px;background:' + kat.farbe + '15;color:' + kat.farbe + ';padding:2px 8px;border-radius:10px;font-weight:500;">' + kat.icon + ' ' + kat.titel + '</span>';
      html += '<div style="font-size:12px;color:#6B7280;margin-top:8px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;">' + a.definition + '</div>';
      html += '</div>';
    });
    html += '</div>';
  }

  container.innerHTML = html;

  // Fokus auf Suchfeld behalten
  if (wikiFilter) {
    var s = document.getElementById('wiki-search');
    if (s) { s.focus(); s.selectionStart = s.selectionEnd = s.value.length; }
  }
}

function openWikiArtikel(id) {
  var a = (typeof WIKI_ARTIKEL !== 'undefined') ? WIKI_ARTIKEL.find(function(x) { return x.id === id; }) : null;
  if (!a) return;
  var kat = (typeof WIKI_KATEGORIEN !== 'undefined') ? WIKI_KATEGORIEN.find(function(k) { return k.id === a.kategorie; }) : null;

  var html = '<div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;" onclick="if(event.target===this)this.remove()">';
  html += '<div style="background:white;border-radius:16px;max-width:900px;width:100%;max-height:90vh;overflow-y:auto;padding:0;" onclick="event.stopPropagation()">';

  // Header
  html += '<div style="background:' + a.farbe + ';color:white;padding:24px;border-radius:16px 16px 0 0;">';
  html += '<div style="display:flex;justify-content:space-between;align-items:start;">';
  html += '<div><span style="font-size:40px;">' + a.icon + '</span>';
  html += '<h2 style="margin:8px 0 6px;font-size:22px;">' + a.titel + '</h2>';
  html += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
  if (a.icd10) html += '<span style="background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:12px;font-size:11px;font-family:monospace;">ICD-10: ' + a.icd10.code + ' — ' + a.icd10.label + '</span>';
  if (a.icd11) html += '<span style="background:rgba(255,255,255,0.2);padding:3px 10px;border-radius:12px;font-size:11px;font-family:monospace;">ICD-11: ' + a.icd11.code + '</span>';
  if (kat) html += '<span style="background:rgba(255,255,255,0.15);padding:3px 10px;border-radius:12px;font-size:11px;">' + kat.icon + ' ' + kat.titel + '</span>';
  html += '</div>';
  if (a.altersgruppe) html += '<div style="margin-top:6px;font-size:12px;opacity:0.85;">Altersgruppe: ' + a.altersgruppe + (a.praevalenz ? ' · Prävalenz: ' + a.praevalenz : '') + '</div>';
  html += '</div>';
  html += '<button onclick="this.closest(\'div[style*=fixed]\').remove()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:36px;height:36px;border-radius:50%;font-size:18px;cursor:pointer;flex-shrink:0;">✕</button>';
  html += '</div></div>';

  html += '<div style="padding:24px;">';

  // Definition
  html += '<div style="font-size:14px;color:#1E293B;line-height:1.7;margin-bottom:20px;border-left:4px solid ' + a.farbe + ';padding-left:14px;">' + a.definition + '</div>';

  // Erscheinungsbild
  if (a.erscheinungsbild && a.erscheinungsbild.length) {
    html += '<details open style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">👁️ Erscheinungsbild — Wie zeigt es sich?</summary>';
    html += '<div style="padding:8px 0;display:grid;grid-template-columns:1fr 1fr;gap:6px;">';
    a.erscheinungsbild.forEach(function(e) {
      html += '<div style="font-size:12px;color:#374151;padding:6px 10px;background:#F9FAFB;border-radius:6px;display:flex;gap:6px;"><span style="color:' + a.farbe + ';">•</span>' + e + '</div>';
    });
    html += '</div></details>';
  }

  // Ursachen
  if (a.ursachen && a.ursachen.length) {
    html += '<details style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">🔍 Ursachen & Risikofaktoren</summary>';
    html += '<div style="padding:8px 0;">';
    a.ursachen.forEach(function(u) {
      html += '<div style="background:#F9FAFB;border-radius:8px;padding:10px 12px;margin-bottom:6px;border-left:3px solid ' + a.farbe + ';">';
      html += '<div style="font-weight:600;font-size:12px;color:' + a.farbe + ';margin-bottom:3px;">' + u.faktor + '</div>';
      html += '<div style="font-size:12px;color:#374151;line-height:1.5;">' + u.text + '</div></div>';
    });
    html += '</div></details>';
  }

  // Differentialdiagnose
  if (a.differentialdiagnose && a.differentialdiagnose.length) {
    html += '<details style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">⚖️ Differentialdiagnose</summary>';
    html += '<div style="padding:8px 0;">';
    a.differentialdiagnose.forEach(function(d) {
      html += '<div style="display:flex;gap:10px;padding:8px 0;border-bottom:1px solid #F3F4F6;">';
      html += '<div style="font-weight:600;font-size:12px;color:#1E293B;min-width:120px;">' + d.was + '</div>';
      html += '<div style="font-size:12px;color:#6B7280;">' + d.unterschied + '</div></div>';
    });
    html += '</div></details>';
  }

  // Komorbiditäten
  if (a.komorbiditaeten && a.komorbiditaeten.length) {
    html += '<details style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">🔗 Häufige Komorbiditäten</summary>';
    html += '<div style="padding:8px 0;display:flex;gap:6px;flex-wrap:wrap;">';
    a.komorbiditaeten.forEach(function(k) {
      html += '<span style="font-size:12px;background:#EFF6FF;color:#1E40AF;padding:4px 10px;border-radius:12px;">' + k + '</span>';
    });
    html += '</div></details>';
  }

  // Evidenzbasierte Interventionen
  if (a.evidenzbasierte_interventionen && a.evidenzbasierte_interventionen.length) {
    html += '<details open style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">🔬 Evidenzbasierte Interventionen</summary>';
    html += '<div style="padding:8px 0;">';
    a.evidenzbasierte_interventionen.forEach(function(i) {
      html += '<div style="background:#ECFDF5;border-radius:8px;padding:10px 12px;margin-bottom:6px;">';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">';
      html += '<span style="font-weight:600;font-size:12px;color:#065F46;">' + i.methode + '</span>';
      html += '<span style="font-size:11px;color:#F59E0B;">' + i.evidenz + '</span></div>';
      html += '<div style="font-size:12px;color:#047857;">' + i.beschreibung + '</div></div>';
    });
    html += '</div></details>';
  }

  // Praxis-Tipps
  if (a.praxis_tipps && a.praxis_tipps.length) {
    html += '<details open style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">💡 Praxis-Tipps für Bezugspersonen</summary>';
    html += '<div style="padding:8px 0;">';
    a.praxis_tipps.forEach(function(t) {
      html += '<div style="font-size:12px;color:#374151;padding:6px 10px;background:#F0FDF4;border-radius:6px;margin-bottom:4px;display:flex;gap:6px;"><span style="color:#10B981;font-weight:bold;">✓</span>' + t + '</div>';
    });
    html += '</div></details>';
  }

  // Wann überweisen
  if (a.wann_ueberweisen) {
    html += '<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:10px;padding:12px;margin-bottom:14px;">';
    html += '<div style="font-weight:600;font-size:13px;color:#991B1B;margin-bottom:4px;">🚨 Wann überweisen?</div>';
    html += '<div style="font-size:12px;color:#B91C1C;line-height:1.5;">' + a.wann_ueberweisen + '</div></div>';
  }

  // Luxemburg-spezifisch
  if (a.luxemburg_spezifisch) {
    html += '<div style="background:#EFF6FF;border:1px solid #BFDBFE;border-radius:10px;padding:12px;margin-bottom:14px;">';
    html += '<div style="font-weight:600;font-size:13px;color:#1E40AF;margin-bottom:4px;">🇱🇺 Luxemburg-spezifisch</div>';
    html += '<div style="font-size:12px;color:#1D4ED8;line-height:1.5;">' + a.luxemburg_spezifisch + '</div></div>';
  }

  // Verknüpfte Ressourcen
  html += renderWikiRessourcen(a);

  // Verwandte Wiki-Artikel
  if (a.verwandte_wiki && a.verwandte_wiki.length) {
    html += '<div style="margin-top:16px;padding-top:14px;border-top:1px solid #E5E7EB;">';
    html += '<div style="font-weight:600;font-size:13px;color:#1E293B;margin-bottom:8px;">📚 Verwandte Artikel</div>';
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;">';
    a.verwandte_wiki.forEach(function(vid) {
      var va = WIKI_ARTIKEL.find(function(x) { return x.id === vid; });
      if (va) {
        html += '<button onclick="event.stopPropagation();this.closest(\'div[style*=fixed]\').remove();openWikiArtikel(\'' + vid + '\')" style="padding:5px 12px;border-radius:8px;border:1px solid ' + va.farbe + '30;background:' + va.farbe + '08;color:' + va.farbe + ';font-size:12px;cursor:pointer;font-weight:500;">' + va.icon + ' ' + va.titel + '</button>';
      }
    });
    html += '</div></div>';
  }

  // Quellen
  if (a.quellen && a.quellen.length) {
    html += '<details style="margin-top:14px;"><summary style="font-size:11px;color:#9CA3AF;cursor:pointer;">📖 Quellen (' + a.quellen.length + ')</summary>';
    html += '<div style="padding:6px 0;">';
    a.quellen.forEach(function(q, i) {
      html += '<div style="font-size:11px;color:#9CA3AF;padding:2px 0;">[' + (i + 1) + '] ' + q + '</div>';
    });
    html += '</div></details>';
  }

  html += '</div></div></div>';

  var overlay = document.createElement('div');
  overlay.innerHTML = html;
  document.body.appendChild(overlay.firstChild);
}

function renderWikiRessourcen(a) {
  var html = '';
  var hasAny = false;

  // Sammle alle verlinkten Ressourcen
  var links = [];

  // Arbeitsblätter
  if (a.themen_ids && typeof ARBEITSBLÄTTER !== 'undefined') {
    a.themen_ids.forEach(function(tid) {
      var ab = ARBEITSBLÄTTER[tid];
      if (ab) ab.forEach(function(b) {
        links.push({ typ: 'Arbeitsblatt', icon: '📝', titel: b.titel, href: 'arbeitsblatter/' + b.datei });
      });
    });
  }

  // Therapiemodule
  if (a.themen_ids && typeof THERAPIE_MODULE_DATEIEN !== 'undefined') {
    a.themen_ids.forEach(function(tid) {
      var tm = THERAPIE_MODULE_DATEIEN[tid];
      if (tm) links.push({ typ: 'Therapiemodul', icon: '🧠', titel: tid.replace(/-/g, ' '), href: 'therapie-module/' + tm });
    });
  }

  // Fachkraft-Module
  if (a.themen_ids && typeof FACHKRAFT_MODULE_DATEIEN !== 'undefined') {
    var fkSeen = {};
    a.themen_ids.forEach(function(tid) {
      var fk = FACHKRAFT_MODULE_DATEIEN[tid];
      if (fk && !fkSeen[fk]) {
        fkSeen[fk] = true;
        links.push({ typ: 'Fachkraft-Modul', icon: '🎓', titel: tid.replace(/-/g, ' '), href: 'fachkraft-module/' + fk });
      }
    });
  }

  // Gesprächsleitfäden
  if (a.leitfaden_ids && typeof GESPRAECHSLEITFAEDEN !== 'undefined') {
    a.leitfaden_ids.forEach(function(lid) {
      var gl = GESPRAECHSLEITFAEDEN.find(function(g) { return g.id === lid; });
      if (gl) links.push({ typ: 'Gesprächsleitfaden', icon: '📋', titel: gl.titel, onclick: 'openGespraechsleitfaden(\'' + lid + '\')' });
    });
  }

  if (links.length === 0) return '';

  html += '<div style="margin-top:16px;padding-top:14px;border-top:1px solid #E5E7EB;">';
  html += '<div style="font-weight:600;font-size:13px;color:#1E293B;margin-bottom:8px;">🔧 Verknüpfte Ressourcen</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:6px;">';
  links.forEach(function(l) {
    if (l.onclick) {
      html += '<div onclick="' + l.onclick + '" style="cursor:pointer;font-size:12px;padding:8px 10px;background:#F9FAFB;border-radius:6px;display:flex;gap:6px;align-items:center;border:1px solid #E5E7EB;">';
      html += '<span>' + l.icon + '</span><div><div style="font-weight:500;color:#1E293B;">' + l.titel + '</div><div style="font-size:10px;color:#9CA3AF;">' + l.typ + '</div></div></div>';
    } else {
      html += '<a href="' + l.href + '" target="_blank" style="text-decoration:none;font-size:12px;padding:8px 10px;background:#F9FAFB;border-radius:6px;display:flex;gap:6px;align-items:center;border:1px solid #E5E7EB;">';
      html += '<span>' + l.icon + '</span><div><div style="font-weight:500;color:#1E293B;">' + l.titel + '</div><div style="font-size:10px;color:#9CA3AF;">' + l.typ + '</div></div></a>';
    }
  });
  html += '</div></div>';
  return html;
}

function renderWikiLink(artikelId) {
  if (typeof WIKI_ARTIKEL === 'undefined') return '';
  var a = WIKI_ARTIKEL.find(function(x) { return x.id === artikelId; });
  if (!a) return '';
  return '<span onclick="openWikiArtikel(\'' + artikelId + '\')" style="cursor:pointer;font-size:11px;color:#3B82F6;font-weight:500;display:inline-flex;align-items:center;gap:3px;">📚 ' + a.titel + '</span>';
}

function findWikiForScreeningDomain(domainId) {
  if (typeof WIKI_ARTIKEL === 'undefined') return null;
  return WIKI_ARTIKEL.find(function(a) {
    return a.screening_domains && a.screening_domains.indexOf(domainId) !== -1;
  });
}

function findWikiForThema(themaId) {
  if (typeof WIKI_ARTIKEL === 'undefined') return null;
  return WIKI_ARTIKEL.find(function(a) {
    return (a.themen_ids && a.themen_ids.indexOf(themaId) !== -1) || a.id === themaId;
  });
}

function findWikiForVerhalten(verhaltensId) {
  if (typeof WIKI_ARTIKEL === 'undefined') return null;
  return WIKI_ARTIKEL.find(function(a) {
    return a.verhaltens_ids && a.verhaltens_ids.indexOf(verhaltensId) !== -1;
  });
}

function renderWikiTeaserWidget() {
  var container = document.getElementById('gespraechsleitfaeden-widget');
  if (!container || typeof WIKI_ARTIKEL === 'undefined' || WIKI_ARTIKEL.length === 0) return;

  // Pick a pseudo-random article based on the day
  var dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  var artikel = WIKI_ARTIKEL[dayOfYear % WIKI_ARTIKEL.length];
  var kat = WIKI_KATEGORIEN.find(function(k) { return k.id === artikel.kategorie; });

  var html = '<div class="card" style="margin-top:16px;">';
  html += '<div class="card-header">';
  html += '<span>📚</span><div class="card-title">Wiki-Artikel des Tages</div>';
  html += '</div>';
  html += '<div class="card-body" style="padding:14px;">';
  html += '<div onclick="openWikiArtikel(\'' + artikel.id + '\')" style="cursor:pointer;padding:14px;border-radius:10px;background:' + (artikel.farbe || '#3B82F6') + '10;border:1px solid ' + (artikel.farbe || '#3B82F6') + '25;transition:transform 0.15s;">';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
  html += '<span style="font-size:28px;">' + (artikel.icon || '📖') + '</span>';
  html += '<div>';
  html += '<div style="font-weight:700;font-size:14px;color:' + (artikel.farbe || '#1E40AF') + ';">' + artikel.titel + '</div>';
  if (kat) html += '<div style="font-size:11px;color:#6B7280;">' + kat.icon + ' ' + kat.titel + '</div>';
  html += '</div></div>';
  html += '<div style="font-size:12px;color:#374151;line-height:1.5;">' + (artikel.definition || '').substring(0, 180) + '...</div>';
  html += '<div style="margin-top:8px;font-size:11px;color:#3B82F6;font-weight:600;">📚 Artikel lesen →</div>';
  html += '</div>';
  html += '<div style="text-align:center;margin-top:10px;"><button class="btn btn-sm" onclick="toggleWikiPanel()" style="font-size:11px;padding:4px 14px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:6px;cursor:pointer;">Alle ' + WIKI_ARTIKEL.length + ' Wiki-Artikel anzeigen</button></div>';
  html += '</div></div>';

  container.insertAdjacentHTML('beforeend', html);
}

// ============================================================
// COMMAND PALETTE (Cmd+K / Ctrl+K)
// ============================================================
(function() {
  var cmdPaletteOpen = false;
  var cmdSelectedIdx = 0;
  var cmdResults = [];

  function getCommandItems(query) {
    var items = [];
    var q = (query || '').toLowerCase().trim();

    // Students
    try {
      var schueler = DB.getSchueler();
      schueler.forEach(function(s) {
        items.push({
          icon: '👤',
          label: s.vorname + ' ' + s.nachname,
          hint: 'Schüler·in',
          action: function() { showView('profil', s.id); }
        });
      });
    } catch(e) {}

    // Navigation
    items.push({ icon: '🏠', label: 'Startseite', hint: 'Navigation', action: function() { showView('home'); } });
    items.push({ icon: '📅', label: 'Kalender', hint: 'Navigation', action: function() { showView('kalender'); } });
    items.push({ icon: '➕', label: 'Neuen Schüler anlegen', hint: 'Aktion', action: function() { openSchuelerModal(); } });

    // Profile tabs (only when in profile view)
    if (APP.currentView === 'profil' && APP.currentSchuelerId) {
      var tabs = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'roadmap', icon: '🗺️', label: 'Roadmap & Ziele' },
        { id: 'themen', icon: '💬', label: 'Themen & Sitzungen' },
        { id: 'staerken', icon: '💪', label: 'Stärken & Ressourcen' },
        { id: 'verhalten', icon: '📈', label: 'Verhaltensbeobachtung' },
        { id: 'screening', icon: '🔍', label: 'Screening' },
        { id: 'fallformulierung', icon: '📝', label: 'Fallformulierung' },
        { id: 'berichte', icon: '📄', label: 'Berichte' },
        { id: 'notizen', icon: '🗒️', label: 'Notizen' },
        { id: 'info', icon: '📋', label: 'Info & Anamnese' },
        { id: 'genogramm', icon: '🌳', label: 'Genogramm' }
      ];
      tabs.forEach(function(t) {
        items.push({
          icon: t.icon,
          label: t.label,
          hint: 'Tab',
          action: function() { showProfilTab(t.id); }
        });
      });
    }

    // Wiki articles
    if (typeof WIKI_ARTIKEL !== 'undefined') {
      WIKI_ARTIKEL.slice(0, 20).forEach(function(a) {
        items.push({
          icon: a.icon || '📖',
          label: a.titel,
          hint: 'Wiki',
          action: function() { openWikiArtikel(a.id); }
        });
      });
    }

    // Filter
    if (q) {
      items = items.filter(function(item) {
        return item.label.toLowerCase().indexOf(q) !== -1 ||
               item.hint.toLowerCase().indexOf(q) !== -1;
      });
    }

    return items.slice(0, 12);
  }

  function renderCommandPalette() {
    var existing = document.querySelector('.command-palette-overlay');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.className = 'command-palette-overlay';
    overlay.innerHTML =
      '<div class="command-palette">' +
        '<input class="command-palette-input" placeholder="Suche Schüler, Seiten, Wiki-Artikel…" autocomplete="off" />' +
        '<div class="command-palette-results"></div>' +
        '<div class="command-palette-footer">' +
          '<span><kbd>↑↓</kbd> Navigieren</span>' +
          '<span><kbd>↵</kbd> Öffnen</span>' +
          '<span><kbd>Esc</kbd> Schließen</span>' +
        '</div>' +
      '</div>';

    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeCommandPalette();
    });

    document.body.appendChild(overlay);
    cmdPaletteOpen = true;
    cmdSelectedIdx = 0;

    var input = overlay.querySelector('.command-palette-input');
    input.focus();

    input.addEventListener('input', function() {
      cmdSelectedIdx = 0;
      updateCommandResults(input.value);
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        cmdSelectedIdx = Math.min(cmdSelectedIdx + 1, cmdResults.length - 1);
        highlightCommandItem();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        cmdSelectedIdx = Math.max(cmdSelectedIdx - 1, 0);
        highlightCommandItem();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (cmdResults[cmdSelectedIdx]) {
          cmdResults[cmdSelectedIdx].action();
          closeCommandPalette();
        }
      } else if (e.key === 'Escape') {
        closeCommandPalette();
      }
    });

    updateCommandResults('');
  }

  function updateCommandResults(query) {
    cmdResults = getCommandItems(query);
    var container = document.querySelector('.command-palette-results');
    if (!container) return;

    if (cmdResults.length === 0) {
      container.innerHTML = '<div style="padding:24px;text-align:center;color:#9CA3AF;font-size:13px;">Keine Ergebnisse</div>';
      return;
    }

    var html = '';
    cmdResults.forEach(function(item, i) {
      html += '<div class="command-palette-item' + (i === cmdSelectedIdx ? ' active' : '') + '" data-idx="' + i + '">' +
        '<span class="command-palette-item-icon">' + item.icon + '</span>' +
        '<span class="command-palette-item-label">' + item.label + '</span>' +
        '<span class="command-palette-item-hint">' + item.hint + '</span>' +
      '</div>';
    });
    container.innerHTML = html;

    container.querySelectorAll('.command-palette-item').forEach(function(el) {
      el.addEventListener('click', function() {
        var idx = parseInt(el.dataset.idx);
        if (cmdResults[idx]) {
          cmdResults[idx].action();
          closeCommandPalette();
        }
      });
      el.addEventListener('mouseenter', function() {
        cmdSelectedIdx = parseInt(el.dataset.idx);
        highlightCommandItem();
      });
    });
  }

  function highlightCommandItem() {
    document.querySelectorAll('.command-palette-item').forEach(function(el, i) {
      el.classList.toggle('active', i === cmdSelectedIdx);
      if (i === cmdSelectedIdx) el.scrollIntoView({ block: 'nearest' });
    });
  }

  function closeCommandPalette() {
    var overlay = document.querySelector('.command-palette-overlay');
    if (overlay) overlay.remove();
    cmdPaletteOpen = false;
  }

  // Global keyboard shortcut
  document.addEventListener('keydown', function(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (cmdPaletteOpen) {
        closeCommandPalette();
      } else {
        renderCommandPalette();
      }
    }
  });

  // Show keyboard hint on first visit
  if (!localStorage.getItem('cmdPaletteHintShown')) {
    setTimeout(function() {
      var hint = document.createElement('div');
      hint.className = 'kbd-hint';
      hint.innerHTML = 'Tipp: <kbd>⌘</kbd><kbd>K</kbd> für Schnellsuche';
      document.body.appendChild(hint);
      setTimeout(function() { hint.classList.add('visible'); }, 100);
      setTimeout(function() {
        hint.classList.remove('visible');
        setTimeout(function() { hint.remove(); }, 300);
      }, 5000);
      localStorage.setItem('cmdPaletteHintShown', '1');
    }, 3000);
  }
})();
