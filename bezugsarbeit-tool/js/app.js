// ============================================================
// CDSE Bezugsarbeit Tool - App Logic
// ============================================================

// ---- State ----
const APP = {
  currentView: 'home',
  currentSchuelerId: null,
  currentProfilTab: 'themen',
  kalenderDatum: new Date(),
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

  liste.innerHTML = schueler.map(s => `
    <div class="schueler-item" data-id="${s.id}" onclick="showView('profil','${s.id}')">
      <div class="schueler-avatar">${s.foto
        ? `<img src="${s.foto}" alt="">`
        : getInitials(s.vorname, s.nachname)}
      </div>
      <div class="schueler-item-info">
        <div class="schueler-item-name">${s.vorname} ${s.nachname}</div>
        <div class="schueler-item-meta">${s.klasse || '—'} · ${alter(s.geburtsdatum)}</div>
      </div>
      <div class="risiko-badge risiko-${s.risiko || 'niedrig'}"></div>
    </div>
  `).join('');
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
  const blaetter = ARBEITSBLÄTTER[themaId];
  if (!blaetter || blaetter.length === 0) return '';
  return `
    <div style="margin-bottom:20px;">
      <label style="display:block;margin-bottom:8px;">📄 Arbeitsblätter</label>
      <div style="display:flex;flex-direction:column;gap:6px;">
        ${blaetter.map(b => `
          <a href="arbeitsblatter/${b.datei}" target="_blank"
             style="display:flex;align-items:center;gap:10px;padding:9px 12px;
                    background:#F0F9FF;border:1.5px solid #BAE6FD;border-radius:6px;
                    text-decoration:none;color:#0369A1;font-size:12px;font-weight:600;
                    transition:background 0.15s;">
            <span style="font-size:16px;">📋</span>
            <span style="flex:1;">${b.titel}</span>
            <span style="font-size:11px;opacity:0.7;">Öffnen →</span>
          </a>`).join('')}
      </div>
    </div>`;
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
      if (!confirm(`${daten.schueler.length} Schüler, ${daten.notizen?.length || 0} Notizen, ${daten.termine?.length || 0} Termine importieren?\n\nAchtung: Bestehende Daten werden ergänzt (nicht überschrieben).`)) return;
      // Merge: bestehende IDs behalten, neue hinzufügen
      const vorhandeneIds = new Set(DB.getSchueler().map(s => s.id));
      const neueSchueler = [...DB.getSchueler(), ...(daten.schueler || []).filter(s => !vorhandeneIds.has(s.id))];
      DB.saveSchueler(neueSchueler);
      const vorhandeneNIds = new Set(DB.getNotizen().map(n => n.id));
      const alleNotizen = [...DB.getNotizen(), ...(daten.notizen || []).filter(n => !vorhandeneNIds.has(n.id))];
      localStorage.setItem(DB.KEYS.NOTIZEN, JSON.stringify(alleNotizen));
      const vorhandeneTIds = new Set(DB.getTermine().map(t => t.id));
      const alleTermine = [...DB.getTermine(), ...(daten.termine || []).filter(t => !vorhandeneTIds.has(t.id))];
      localStorage.setItem(DB.KEYS.TERMINE, JSON.stringify(alleTermine));
      renderSidebar();
      renderHome();
      showToast(`Import erfolgreich: ${daten.schueler.length} Schüler`, 'success');
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
