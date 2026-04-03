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
  renderSidebar();
  showView('home');
});

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

  // Aktiven Tab rendern
  showProfilTab(APP.currentProfilTab);
}

function showProfilTab(tab) {
  APP.currentProfilTab = tab;
  // Notizen-Tab hat keinen eigenen Header-Tab, wird dem Themen-Tab zugeordnet
  const highlightTab = (tab === 'notizen') ? 'themen' : tab;
  document.querySelectorAll('.profil-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === highlightTab);
  });
  document.querySelectorAll('.profil-tab-content').forEach(c => {
    c.classList.toggle('active', c.dataset.tab === tab);
  });

  if (tab === 'dashboard') renderDashboard();
  if (tab === 'roadmap') renderRoadmap();
  if (tab === 'themen') { renderThemen(); renderSitzungenImThemenTab(); }
  if (tab === 'notizen') renderNotizen();
  if (tab === 'ziele') renderZiele();
  if (tab === 'staerken') renderStaerken();
  if (tab === 'fallformulierung') renderFallformulierung();
  if (tab === 'screening') renderScreeningEmbedded();
  if (tab === 'berichte') renderBerichte();
  if (tab === 'info') renderInfo();
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
        <div class="kategorie-icon" style="background:${kat.farbe}22;">${kat.icon}</div>
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
      <span style="font-size:22px;">${kat.icon}</span>
      <div class="thema-panel-title">${thema.titel}</div>
      <button class="btn-icon" onclick="document.getElementById('thema-panel').remove()">✕</button>
    </div>
    <div class="thema-panel-body">
      <p style="color:var(--text-light);font-size:13px;margin-bottom:16px;">${thema.beschreibung}</p>

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
            ? '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:16px;">Noch keine Notizen</div>'
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
    liste.innerHTML = '<div style="text-align:center;color:var(--text-muted);padding:30px;">Noch keine Notizen vorhanden</div>';
  } else {
    liste.innerHTML = notizen.map(n => renderNotizKarte(n)).join('');
  }
}

function renderNotizKarte(notiz) {
  const kat = NOTIZ_KATEGORIEN[notiz.kategorie] || NOTIZ_KATEGORIEN.session;
  return `
    <div class="notiz-karte" style="border-left-color:${kat.farbe};">
      <div class="notiz-karte-header">
        <span class="notiz-badge" style="background:${kat.farbe}22;color:${kat.farbe};">${kat.icon} ${kat.label}</span>
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
      `<optgroup label="${kat.icon} ${kat.titel}">
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

  liste.innerHTML = ziele.length === 0
    ? '<div style="color:var(--text-muted);font-size:13px;text-align:center;padding:20px;">Noch keine Ziele definiert</div>'
    : ziele.map((z, i) => `
      <div class="ziel-item">
        <input type="checkbox" class="ziel-checkbox" ${z.erledigt ? 'checked' : ''}
          onchange="toggleZiel(${i})">
        <span class="ziel-text ${z.erledigt ? 'erledigt' : ''}">${escapeHtml(z.text)}</span>
        <button class="btn-icon btn-sm" style="font-size:12px;" onclick="deleteZiel(${i})">🗑</button>
      </div>`).join('');
}

function addZiel() {
  const input = document.getElementById('neues-ziel-input');
  const text = input.value.trim();
  if (!text) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele.push({ text, erledigt: false, erstellt: new Date().toISOString() });
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  input.value = '';
  renderZiele();
}

function toggleZiel(index) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele[index].erledigt = !ziele[index].erledigt;
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
// INFO TAB
// ============================================================
function renderInfo() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  document.getElementById('info-allgemein').value = s.allgemeineNotizen || '';
  document.getElementById('info-risiko').value = s.risiko || 'niedrig';
}

function saveInfo() {
  DB.updateSchueler(APP.currentSchuelerId, {
    allgemeineNotizen: document.getElementById('info-allgemein').value,
    risiko: document.getElementById('info-risiko').value,
  });
  renderProfil(APP.currentSchuelerId);
  renderSidebar();
  showToast('Informationen gespeichert', 'success');
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
      <div style="font-size:12px;font-weight:700;color:#2C5F8A;margin-bottom:4px;">${kat.icon} ${kat.titel}</div>
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
            <div style="font-size:12px;font-weight:700;color:${def.farbe};">${def.icon} Phase ${def.nr}: ${def.label} <span style="font-weight:400;color:#6B7280;font-size:10px;">(${statusLabel})</span></div>
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
        <span style="font-size:10px;font-weight:700;color:${kat.farbe};">${kat.icon} ${kat.label}</span>
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
// DASHBOARD
// ============================================================

function renderDashboard() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;
  renderNaechsteSchritte();
  renderDashKalender();
  renderDashTodo();
  renderWohlbefinden();
  renderNotizbuch();
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
              <span style="font-size:13px;">${p.done ? '✅' : p.icon}</span>
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

  // Render chart
  renderWohlbefindenChart(sid);

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
  DB.addWohlbefinden(APP.currentSchuelerId, score, notiz);
  APP.wohlbefindenScore = null;
  const input = document.getElementById('wohlbefinden-notiz');
  if (input) input.value = '';
  renderWohlbefinden();
  showToast('Wohlbefinden gespeichert', 'success');
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
// 5P-FALLFORMULIERUNG
// ============================================================

function renderFallformulierung() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const container = document.getElementById('fallformulierung-container');
  if (!container) return;

  let ff = DB.getFallformulierung(sid);

  const pDefs = [
    { key: 'presenting',     label: 'Presenting',     icon: '🔴', farbe: '#EF4444', bg: '#FEF2F2', desc: 'Aktuelle Symptome & Probleme' },
    { key: 'predisposing',   label: 'Predisposing',   icon: '🟠', farbe: '#F97316', bg: '#FFF7ED', desc: 'Vorbestehende Risikofaktoren' },
    { key: 'precipitating',  label: 'Precipitating',  icon: '🟡', farbe: '#EAB308', bg: '#FEFCE8', desc: 'Auslösende Ereignisse' },
    { key: 'perpetuating',   label: 'Perpetuating',   icon: '🔵', farbe: '#3B82F6', bg: '#EFF6FF', desc: 'Aufrechterhaltende Faktoren' },
    { key: 'protective',     label: 'Protective',     icon: '🟢', farbe: '#22C55E', bg: '#F0FDF4', desc: 'Schutzfaktoren & Ressourcen' },
  ];

  container.innerHTML = `
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <div>
        <h3 style="margin:0;font-size:18px;">🧩 5P-Fallformulierung</h3>
        <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Klinische Fallkonzeption nach dem 5P-Modell</p>
      </div>
      ${ff ? `<button class="btn btn-outline btn-sm" onclick="delete5P()">🗑 Zurücksetzen</button>` : ''}
    </div>

    <div class="fivep-grid">
      ${pDefs.map(p => {
        const items = ff ? (ff[p.key] || []) : [];
        return `
          <div class="fivep-column" style="border-top:3px solid ${p.farbe};">
            <div class="fivep-col-header" style="background:${p.bg};">
              <span class="fivep-col-icon">${p.icon}</span>
              <div>
                <strong>${p.label}</strong>
                <div class="fivep-col-desc">${p.desc}</div>
              </div>
            </div>
            <div class="fivep-col-body">
              <div class="fivep-tags" id="fivep-tags-${p.key}">
                ${items.map((item, i) => `
                  <span class="fivep-tag" style="background:${p.bg};border-color:${p.farbe};">
                    ${item}
                    <span class="fivep-tag-del" onclick="remove5PTag('${p.key}', ${i})">×</span>
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

    ${ff ? render5PPatternAnalysis(ff) : ''}

    <!-- Datenübernahme-Buttons -->
    <div style="margin-top:18px;display:flex;gap:10px;flex-wrap:wrap;">
      ${(function(){
        const scrs = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
        return scrs.length > 0
          ? '<button class="btn btn-secondary btn-sm" onclick="screeningTo5P()">🔍 Screening → Presenting übernehmen</button>'
          : '';
      })()}
      ${(function(){
        const schul = DB.getSchuelerById(sid);
        const p = schul ? (schul.staerkenProfil || {}) : {};
        const has = Object.values(p.ratings || {}).filter(v => v > 0).length > 0 || (p.schutzfaktoren || []).length > 0;
        return has
          ? '<button class="btn btn-secondary btn-sm" onclick="staerkenTo5P()">💪 Stärken → Protective übernehmen</button>'
          : '';
      })()}
    </div>
  `;
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
      <div class="fivep-analysis-insight">${insight}${perpHint}</div>
    </div>
  `;
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
           Er gliedert die Arbeit in 4 Phasen — von der Stabilisierung bis zum Transfer.</p>
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
          ${totalThemen} Themen · Phase ${aktivePhasenNr}/4
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
        ${idx < 3 ? '<div class="roadmap-phase-line"></div>' : ''}
      </div>

      <!-- Phase-Content -->
      <div class="roadmap-phase-content">
        <div class="roadmap-phase-header" onclick="toggleRoadmapPhase(${phase.nr})">
          <div class="roadmap-phase-header-left">
            <span class="roadmap-phase-icon">${def.icon}</span>
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
                      ${kat ? `<span class="roadmap-thema-kat" style="color:${kat.farbe};">${kat.icon} ${kat.titel}</span>` : ''}
                    </div>
                    <div class="roadmap-thema-actions">
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
                `<optgroup label="${kat.icon} ${kat.titel}">
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
            ${phase.status === 'offen' ? `<button class="btn btn-sm" style="background:${def.farbe};color:#fff;border:none;" onclick="setRoadmapPhaseStatus(${phase.nr}, 'aktiv')">▶ Phase starten</button>` : ''}
            ${phase.status === 'aktiv' ? `<button class="btn btn-sm" style="background:${def.farbe};color:#fff;border:none;" onclick="setRoadmapPhaseStatus(${phase.nr}, 'erledigt')">✓ Phase abschließen</button>` : ''}
            ${phase.status === 'erledigt' ? `<button class="btn btn-secondary btn-sm" onclick="setRoadmapPhaseStatus(${phase.nr}, 'aktiv')">↺ Wieder öffnen</button>` : ''}
          </div>
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

  // Sort themes by score
  const sortedThemen = Object.entries(themaScores)
    .sort((a, b) => b[1] - a[1])
    .map(([id, score]) => ({ id, score }));

  // Assign to phases
  const assigned = new Set();

  // Phase 1: Crisis/stabilization themes (high severity + crisis topics)
  const phase1Ids = ROADMAP_PHASEN[0].schwerpunkt;
  sortedThemen.forEach(t => {
    if (phase1Ids.includes(t.id) && t.score > 0.3) {
      roadmap.phasen[0].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 2: Understanding themes
  const phase2Ids = ROADMAP_PHASEN[1].schwerpunkt;
  sortedThemen.forEach(t => {
    if (!assigned.has(t.id) && phase2Ids.includes(t.id)) {
      roadmap.phasen[1].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 3: All remaining high-priority themes
  sortedThemen.forEach(t => {
    if (!assigned.has(t.id) && t.score > 0.2) {
      roadmap.phasen[2].themen.push({ id: t.id, status: 'offen' });
      assigned.add(t.id);
    }
  });

  // Phase 4: Transfer themes
  const phase4Ids = ROADMAP_PHASEN[3].schwerpunkt;
  phase4Ids.forEach(id => {
    if (!assigned.has(id)) {
      roadmap.phasen[3].themen.push({ id, status: 'offen' });
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
            <div class="phase-label">${def.icon} Phase ${def.nr}: ${def.label}</div>
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

  // Severity
  let severity = 'low';
  const selfharmDomain = SCREENING_DOMAINS.find(d => d.id === 'selbstverletzung');
  const selfharmScore = scores['selbstverletzung'] || 0;
  const psychoseScore = scores['psychose'] || 0;

  if (selfharmScore >= 4 || psychoseScore >= 2) severity = 'urgent';
  else if (flaggedAreas.length >= 5 || comorbidityPattern.includes('krisenindikator')) severity = 'high';
  else if (flaggedAreas.length >= 3) severity = 'medium';
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
    scr = { ...scr, antworten, scores, flaggedAreas, comorbidityPattern, worksheetRecommendations, severity, abgeschlossen: true, geaendert: new Date().toISOString() };
  } else {
    scr = DB.createScreening(APP.currentSchuelerId);
    scr = { ...scr, antworten, scores, flaggedAreas, comorbidityPattern, worksheetRecommendations, severity, abgeschlossen: true };
  }
  DB.saveScreening(scr);
  APP.currentScreeningId = scr.id;

  scrShowContainer('ergebnis');
  renderScreeningErgebnis(scr);
  renderSidebar(); // Update urgent indicator
  showToast('Screening ausgewertet', 'success');
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
      return `<div class="scr-flagged-chip" style="border-left:4px solid ${d.farbe};">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
          <span style="font-weight:600;font-size:13px;">${d.icon} ${d.label}</span>
          <span style="font-size:12px;color:${d.farbe};font-weight:700;">${score}/${max}</span>
        </div>
        <div class="scr-mini-bar"><div class="scr-mini-bar-fill" style="width:${pct}%;background:${d.farbe};"></div></div>
        ${d.icd ? `<div style="font-size:11px;color:#888;margin-top:4px;">ICD-10: ${d.icd}</div>` : ''}
      </div>`;
    }).join('') + '</div>';
  } else {
    flaggedEl.innerHTML = '<div style="color:#22c55e;padding:12px;font-weight:500;">✅ Keine Bereiche über dem Cutoff-Wert.</div>';
  }

  // Notes
  document.getElementById('scr-clinical-notes').value = scr.clinicalNotes || '';
  document.getElementById('scr-followup-date').value = scr.followUpDate || '';

  // Chart
  renderScrProfilChart(scr);
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

  // Flagged areas → Presenting (Symptome)
  const presentingNeu = [];
  flagged.forEach(areaId => {
    const domain = (typeof SCREENING_DOMAINS !== 'undefined') ? SCREENING_DOMAINS.find(d => d.id === areaId) : null;
    const label = domain ? `${domain.icon} ${domain.label}` : areaId;
    const score = latestScr.scores[areaId] || 0;
    const entry = `${label} (Screening-Score: ${score})`;
    if (!ff.presenting.includes(entry)) {
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
          ? '<div style="text-align:center;color:#9CA3AF;padding:16px;">Noch keine Sitzungen</div>'
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
