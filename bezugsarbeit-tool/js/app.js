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
  document.querySelectorAll('.profil-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === tab);
  });
  document.querySelectorAll('.profil-tab-content').forEach(c => {
    c.classList.toggle('active', c.dataset.tab === tab);
  });

  if (tab === 'dashboard') renderDashboard();
  if (tab === 'themen') renderThemen();
  if (tab === 'notizen') renderNotizen();
  if (tab === 'ziele') renderZiele();
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
  const dauer       = document.getElementById('prot-dauer').value.trim();
  const setting     = document.getElementById('prot-setting').value;
  const thema       = document.getElementById('prot-thema').value.trim();
  const verlauf     = document.getElementById('prot-verlauf').value.trim();
  const interv      = document.getElementById('prot-interventionen').value.trim();
  const fortschritt = document.getElementById('prot-fortschritte').value.trim();
  const naechste    = document.getElementById('prot-naechste').value.trim();

  if (!datum || !thema) { showToast('Datum und Thema sind Pflichtfelder', 'error'); return; }

  const text = [
    `🗓 ${datum}  |  ⏱ ${dauer || '—'}  |  📍 ${setting}`,
    `\n📌 Thema: ${thema}`,
    verlauf     ? `\n📝 Verlauf:\n${verlauf}` : '',
    interv      ? `\n🛠 Interventionen:\n${interv}` : '',
    fortschritt ? `\n📈 Fortschritte:\n${fortschritt}` : '',
    naechste    ? `\n➡️ Nächste Schritte:\n${naechste}` : '',
  ].filter(Boolean).join('');

  DB.createNotiz({ schuelerId: APP.currentSchuelerId, datum, inhalt: text, kategorie: 'session' });

  ['prot-thema','prot-verlauf','prot-interventionen','prot-fortschritte','prot-naechste'].forEach(id => {
    document.getElementById(id).value = '';
  });
  renderNotizen();
  showToast('Protokoll gespeichert', 'success');
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

  const notizen = DB.getNotizen(schuelerId)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

  const topicStatus = s.topicStatus || {};
  const abgeschlossen = Object.values(topicStatus).filter(v => v === 'abgeschlossen').length;
  const inBearbeitung = Object.values(topicStatus).filter(v => v === 'in-bearbeitung').length;

  const themenHTML = THEMEN_KATEGORIEN.map(kat => {
    const themenMitStatus = kat.themen.filter(t => topicStatus[t.id] && topicStatus[t.id] !== 'nicht-begonnen');
    if (themenMitStatus.length === 0) return '';
    return `
      <div style="margin-bottom:16px;">
        <div style="font-size:13px;font-weight:700;color:#2C5F8A;margin-bottom:6px;border-bottom:1px solid #DDE2E8;padding-bottom:4px;">
          ${kat.icon} ${kat.titel}
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${themenMitStatus.map(t => {
            const st = THEMA_STATUS[topicStatus[t.id]];
            return `<span style="padding:3px 8px;border-radius:12px;font-size:11px;background:${getStatusFarbe(topicStatus[t.id])}22;color:${getStatusFarbe(topicStatus[t.id])};border:1px solid ${getStatusFarbe(topicStatus[t.id])}44;">
              ${st.icon} ${t.titel}
            </span>`;
          }).join('')}
        </div>
      </div>`;
  }).join('');

  const notizenHTML = notizen.slice(0, 20).map(n => {
    const kat = NOTIZ_KATEGORIEN[n.kategorie] || NOTIZ_KATEGORIEN.session;
    return `
      <div style="border-left:3px solid ${kat.farbe};padding:8px 10px;margin-bottom:8px;background:#F9FAFB;border-radius:0 4px 4px 0;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="font-size:10px;font-weight:700;color:${kat.farbe};">${kat.icon} ${kat.label}</span>
          <span style="font-size:10px;color:#95A5A6;margin-left:auto;">${formatDatum(n.datum)}</span>
        </div>
        <div style="font-size:12px;white-space:pre-wrap;">${escapeHtml(n.inhalt)}</div>
      </div>`;
  }).join('');

  const zieleHTML = (s.ziele || []).map(z =>
    `<div style="display:flex;align-items:center;gap:8px;padding:5px 0;font-size:12px;">
      <span>${z.erledigt ? '✅' : '☐'}</span>
      <span style="${z.erledigt ? 'text-decoration:line-through;color:#95A5A6;' : ''}">${escapeHtml(z.text)}</span>
    </div>`).join('') || '<p style="color:#95A5A6;font-size:12px;">Keine Ziele definiert</p>';

  const fenster = window.open('', '_blank');
  fenster.document.write(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>Profil – ${s.vorname} ${s.nachname}</title>
      <style>
        * { box-sizing: border-box; margin:0; padding:0; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color:#2C3E50; padding:20px; background:#F0F4F8; }
        .seite { width:210mm; background:white; margin:0 auto 20px; padding:16mm 16mm 12mm; box-shadow:0 4px 20px rgba(0,0,0,0.1); }
        .header { border-bottom:3px solid #2C5F8A; padding-bottom:12px; margin-bottom:16px; display:flex; align-items:center; gap:16px; }
        .header-avatar { width:60px; height:60px; border-radius:50%; background:linear-gradient(135deg,#2C5F8A,#3A7AB8); display:flex; align-items:center; justify-content:center; color:white; font-size:22px; font-weight:700; flex-shrink:0; overflow:hidden; }
        .header-avatar img { width:100%; height:100%; object-fit:cover; }
        h1 { font-size:22px; color:#2C5F8A; }
        .meta { font-size:12px; color:#7F8C8D; margin-top:4px; }
        .stat-row { display:flex; gap:10px; margin:12px 0 16px; }
        .stat-chip { background:#EBF5FB; color:#2980B9; padding:4px 10px; border-radius:20px; font-size:11px; font-weight:600; }
        .stat-chip.green { background:#EAFAF1; color:#27AE60; }
        .stat-chip.orange { background:#FEF9E7; color:#E67E22; }
        .stat-chip.red { background:#FDEDEC; color:#E74C3C; }
        .section { margin-bottom:20px; }
        .section-title { font-size:14px; font-weight:700; color:#2C5F8A; margin-bottom:10px; padding-bottom:4px; border-bottom:1px solid #DDE2E8; }
        .info-box { background:#F8FAFB; border:1px solid #DDE2E8; border-radius:6px; padding:10px; font-size:12px; line-height:1.6; }
        .print-btn { display:flex; gap:10px; justify-content:flex-end; width:210mm; margin:0 auto 12px; }
        .btn { padding:9px 18px; border-radius:6px; border:none; cursor:pointer; font-size:13px; font-weight:600; }
        .btn-blue { background:#2C5F8A; color:white; }
        @media print { body { background:white; padding:0; } .seite { box-shadow:none; } .print-btn { display:none; } }
      </style>
    </head>
    <body>
      <div class="print-btn">
        <button class="btn btn-blue" onclick="window.print()">🖨️ Drucken / Als PDF speichern</button>
      </div>
      <div class="seite">
        <div class="header">
          <div class="header-avatar">
            ${s.foto ? `<img src="${s.foto}" alt="">` : getInitials(s.vorname, s.nachname)}
          </div>
          <div>
            <h1>${s.vorname} ${s.nachname}</h1>
            <div class="meta">
              Klasse: ${s.klasse || '—'} &nbsp;·&nbsp; ${alter(s.geburtsdatum)}
              &nbsp;·&nbsp; Seit ${formatDatum(s.eintrittsdatum)}
              &nbsp;·&nbsp; Erstellt: ${formatDatum(s.erstellt?.split('T')[0])}
            </div>
          </div>
          <div style="margin-left:auto;text-align:right;">
            <div style="font-size:11px;font-weight:700;color:${s.risiko==='hoch'?'#E74C3C':s.risiko==='mittel'?'#E67E22':'#27AE60'};">
              ${s.risiko==='hoch'?'🔴':s.risiko==='mittel'?'🟡':'🟢'} Risiko: ${capitalize(s.risiko||'niedrig')}
            </div>
            <div style="font-size:10px;color:#95A5A6;margin-top:4px;">Bericht: ${new Date().toLocaleDateString('de-DE')}</div>
          </div>
        </div>

        <div class="stat-row">
          <div class="stat-chip green">✅ ${abgeschlossen} Themen abgeschlossen</div>
          <div class="stat-chip">◐ ${inBearbeitung} in Bearbeitung</div>
          <div class="stat-chip orange">💬 ${notizen.length} Notizen</div>
          <div class="stat-chip">${(s.ziele||[]).length} Ziele</div>
        </div>

        ${s.allgemeineNotizen ? `
        <div class="section">
          <div class="section-title">ℹ️ Allgemeine Informationen</div>
          <div class="info-box">${escapeHtml(s.allgemeineNotizen)}</div>
        </div>` : ''}

        <div class="section">
          <div class="section-title">📋 Bearbeitete Themen</div>
          ${themenHTML || '<p style="color:#95A5A6;font-size:12px;">Noch keine Themen bearbeitet</p>'}
        </div>

        <div class="section">
          <div class="section-title">🎯 Ziele</div>
          ${zieleHTML}
        </div>
      </div>

      ${notizen.length > 0 ? `
      <div class="seite">
        <div class="section">
          <div class="section-title">💬 Notizen & Sitzungsprotokolle (letzte ${Math.min(notizen.length,20)})</div>
          ${notizenHTML}
        </div>
      </div>` : ''}
    </body>
    </html>
  `);
  fenster.document.close();
}

// ============================================================
// BACKUP / RESTORE
// ============================================================
function exportDaten() {
  const daten = {
    version: 1,
    exportiert: new Date().toISOString(),
    schueler: DB.getSchueler(),
    notizen: DB.getNotizen(),
    termine: DB.getTermine(),
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
  renderDashKalender();
  renderDashTodo();
  renderNotizbuch();
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
