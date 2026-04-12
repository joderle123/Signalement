// ============================================================
// Pathways — Therapeutic Case Management
// ============================================================

// ============================================================
// GLOBAL ERROR HANDLER
// ============================================================
window.onerror = function(msg, url, line, col, error) {
  console.error('Global error:', { msg, url, line, col, error });
  const container = document.getElementById('toast-container');
  if (container) {
    const toast = document.createElement('div');
    toast.className = 'toast error';
    toast.setAttribute('role', 'alert');
    toast.textContent = 'Ein Fehler ist aufgetreten. Bitte lade die Seite neu.';
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 5000);
  }
  return false;
};

window.addEventListener('unhandledrejection', function(event) {
  console.error('Unhandled promise rejection:', event.reason);
});

// ============================================================
// SANITIZATION — DOMPurify wrapper with fallback
// ============================================================
function sanitize(html) {
  if (typeof DOMPurify !== 'undefined') {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p', 'span', 'div', 'ul', 'ol', 'li',
                      'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'a', 'img', 'table', 'thead',
                      'tbody', 'tr', 'th', 'td', 'blockquote', 'code', 'pre', 'hr', 'small',
                      'sub', 'sup', 'mark', 'details', 'summary', 'svg', 'path', 'circle',
                      'line', 'rect', 'polygon', 'polyline', 'g', 'defs', 'use', 'text',
                      'tspan', 'clipPath', 'input', 'label', 'select', 'option', 'textarea',
                      'button', 'canvas', 'section', 'header', 'footer', 'nav', 'article'],
      ALLOWED_ATTR: ['class', 'style', 'id', 'href', 'target', 'src', 'alt', 'title',
                      'width', 'height', 'viewBox', 'fill', 'stroke', 'stroke-width',
                      'stroke-linecap', 'stroke-linejoin', 'd', 'cx', 'cy', 'r', 'x', 'y',
                      'x1', 'y1', 'x2', 'y2', 'points', 'opacity', 'transform',
                      'xmlns', 'role', 'aria-label', 'aria-hidden', 'tabindex', 'for',
                      'type', 'name', 'value', 'placeholder', 'checked', 'disabled',
                      'data-id', 'data-val', 'data-phase', 'data-domain', 'data-idx',
                      'data-thema', 'data-schritt', 'data-kat', 'data-toggle',
                      'colspan', 'rowspan', 'min', 'max', 'step', 'rows', 'cols',
                      'readonly', 'multiple', 'selected', 'required', 'pattern',
                      'clip-path', 'clip-rule', 'fill-rule', 'font-size', 'text-anchor', 'stroke-dasharray',
                      'dominant-baseline', 'data-action', 'data-nr', 'data-sitzung'],
      ADD_ATTR: ['onclick', 'onchange', 'oninput', 'onkeydown', 'onkeyup'],
    });
  }
  // Fallback: basic escaping of script tags
  return (html || '').replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
                      .replace(/javascript:/gi, '')
                      .replace(/on(?:error|load|click|mouse|focus|blur|key|submit|reset|change|input|select|drag|drop|copy|paste|cut)\s*=/gi, 'data-removed=');
}

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

// ---- Dirty-Tracking & Auto-Backup ----
APP._dirty = false;
APP._lastSaveTime = Date.now();

let _dirtyTimer = null;
function markDirty() {
  APP._dirty = true;
  if (_dirtyTimer) clearTimeout(_dirtyTimer);
  _dirtyTimer = setTimeout(() => updateSaveIndicator('unsaved'), 500);
}

function markClean() {
  APP._dirty = false;
  APP._lastSaveTime = Date.now();
  updateSaveIndicator('saved');
}

function updateSaveIndicator(state) {
  const el = document.getElementById('save-indicator');
  if (!el) return;
  if (state === 'saved') {
    el.textContent = '✓ Gespeichert';
    el.style.color = '#10B981';
  } else {
    el.textContent = '● Ungespeichert';
    el.style.color = '#F59E0B';
  }
}

function autoBackup() {
  try {
    const keys = ['cdse_schueler', 'cdse_notizen', 'cdse_termine', 'cdse_screenings', 'cdse_roadmaps', 'cdse_wohlbefinden', 'cdse_fallformulierungen'];
    const snapshot = {};
    keys.forEach(k => {
      const v = localStorage.getItem(k);
      if (v) snapshot[k] = v;
    });
    snapshot._backupTime = Date.now();
    localStorage.setItem('pathways_autobackup', JSON.stringify(snapshot));
    markClean();
  } catch (e) {
    console.warn('Auto-Backup fehlgeschlagen:', e);
  }
}

function checkAutoBackupRecovery() {
  try {
    const raw = localStorage.getItem('pathways_autobackup');
    if (!raw) return;
    const backup = JSON.parse(raw);
    if (!backup._backupTime) return;
    const mainTime = parseInt(localStorage.getItem('pathways_lastSave') || '0');
    if (backup._backupTime > mainTime + 30000) {
      const diff = Math.round((backup._backupTime - mainTime) / 60000);
      if (diff > 1) {
        showConfirm(
          `Ein Auto-Backup wurde gefunden (${diff} Min. neuer als die letzten Daten). Backup wiederherstellen?`,
          () => {
            Object.entries(backup).forEach(([k, v]) => {
              if (k !== '_backupTime') localStorage.setItem(k, v);
            });
            localStorage.removeItem('pathways_autobackup');
            location.reload();
          }
        );
      }
    }
  } catch (e) {
    console.warn('Backup-Recovery-Check fehlgeschlagen:', e);
  }
}

// ---- Custom Confirm Modal ----
function showConfirm(text, onJa, onNein) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px 32px;max-width:420px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <div style="font-size:15px;color:#1F2937;line-height:1.6;margin-bottom:20px;">${text}</div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn btn-secondary" id="confirm-nein" style="padding:8px 20px;">Abbrechen</button>
        <button class="btn btn-primary" id="confirm-ja" style="padding:8px 20px;">Bestätigen</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.querySelector('#confirm-ja').onclick = () => { overlay.remove(); if (onJa) onJa(); };
  overlay.querySelector('#confirm-nein').onclick = () => { overlay.remove(); if (onNein) onNein(); };
  overlay.addEventListener('click', e => { if (e.target === overlay) { overlay.remove(); if (onNein) onNein(); } });
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', async () => {
  // PIN Lock check
  const pinIsSetup = await PinLock.isSetup();
  if (pinIsSetup && !PinLock.isSessionValid()) {
    showPinLockScreen();
    return; // Don't init app until unlocked
  }

  initApp();
});

async function initApp() {
  migrateRoadmapsTo7Phasen();
  renderSidebar();
  showView('home');

  // Auto-Backup alle 60 Sekunden
  setInterval(autoBackup, 60000);

  // Warnung bei ungespeicherten Änderungen
  window.addEventListener('beforeunload', e => {
    if (APP._dirty) {
      e.preventDefault();
      e.returnValue = '';
    }
  });

  // Dirty-Tracking: localStorage-Schreibvorgänge abfangen
  const origSetItem = localStorage.setItem.bind(localStorage);
  localStorage.setItem = function(key, value) {
    origSetItem(key, value);
    if (key.startsWith('cdse_')) {
      markDirty();
      origSetItem('pathways_lastSave', String(Date.now()));
    }
  };

  // Backup-Recovery prüfen (verzögert, damit showConfirm verfügbar)
  setTimeout(checkAutoBackupRecovery, 1000);

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('./sw.js');
    } catch (e) {
      console.warn('SW registration failed:', e);
    }
  }

  // Accessibility: add skip-to-content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main';
  skipLink.className = 'skip-to-content';
  skipLink.textContent = 'Zum Hauptinhalt springen';
  document.body.prepend(skipLink);

  // Accessibility: keyboard navigation for nav items
  document.querySelectorAll('.nav-item, .sidebar-phase-item').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
    });
  });

  // Accessibility: modal focus trap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      const modals = document.querySelectorAll('.modal-overlay, .wiki-panel.visible');
      modals.forEach(m => m.remove ? m.remove() : m.classList.remove('visible'));
    }
  });
}

// ---- PIN Lock Screen ----
function showPinLockScreen() {
  document.getElementById('sidebar').style.display = 'none';
  document.getElementById('main').style.display = 'none';

  const lock = document.createElement('div');
  lock.id = 'pin-lock-screen';
  lock.setAttribute('role', 'dialog');
  lock.setAttribute('aria-label', 'PIN-Eingabe');
  lock.innerHTML = sanitize(`
    <div class="pin-lock-container">
      <div class="pin-lock-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          <circle cx="12" cy="16" r="1"/>
        </svg>
      </div>
      <h2 class="pin-lock-title">Pathways</h2>
      <p class="pin-lock-subtitle">PIN eingeben um fortzufahren</p>
      <div class="pin-lock-input-wrap">
        <input type="password" id="pin-input" class="pin-lock-input" maxlength="8"
               placeholder="PIN" autocomplete="off" inputmode="numeric"
               aria-label="PIN eingeben">
      </div>
      <div id="pin-error" class="pin-lock-error" role="alert"></div>
      <button class="btn btn-primary pin-lock-btn" id="pin-submit-btn">Entsperren</button>
    </div>
  `);
  document.body.appendChild(lock);

  const input = document.getElementById('pin-input');
  const errorEl = document.getElementById('pin-error');
  const submitBtn = document.getElementById('pin-submit-btn');

  setTimeout(() => input.focus(), 100);

  async function tryUnlock() {
    const pin = input.value.trim();
    if (!pin) return;
    const ok = await PinLock.unlock(pin);
    if (ok) {
      lock.remove();
      document.getElementById('sidebar').style.display = '';
      document.getElementById('main').style.display = '';
      initApp();
    } else {
      errorEl.textContent = 'Falscher PIN. Bitte erneut versuchen.';
      input.value = '';
      input.focus();
    }
  }

  submitBtn.addEventListener('click', tryUnlock);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') tryUnlock(); });
}

// ---- PIN Setup / Change (called from settings) ----
function openPinSetup() {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(4px);';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-label', 'PIN einrichten');
  overlay.innerHTML = sanitize(`
    <div style="background:#fff;border-radius:12px;padding:28px 32px;max-width:400px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
      <h3 style="margin:0 0 8px;font-size:16px;font-weight:700;color:#111827;">PIN-Schutz einrichten</h3>
      <p style="font-size:13px;color:#6B7280;margin:0 0 16px;">Schütze deine Daten mit einem PIN-Code (4-8 Ziffern).</p>
      <input type="password" id="pin-setup-input" placeholder="Neuer PIN" maxlength="8"
             inputmode="numeric" autocomplete="off"
             style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">
      <input type="password" id="pin-setup-confirm" placeholder="PIN bestätigen" maxlength="8"
             inputmode="numeric" autocomplete="off"
             style="width:100%;padding:10px 14px;border:1px solid #E5E7EB;border-radius:8px;font-size:14px;margin-bottom:10px;box-sizing:border-box;">
      <div id="pin-setup-error" style="color:#EF4444;font-size:12px;min-height:18px;margin-bottom:8px;" role="alert"></div>
      <div style="display:flex;gap:10px;justify-content:flex-end;">
        <button class="btn btn-secondary" id="pin-setup-cancel" style="padding:8px 20px;">Abbrechen</button>
        <button class="btn btn-primary" id="pin-setup-save" style="padding:8px 20px;">Speichern</button>
      </div>
    </div>
  `);
  document.body.appendChild(overlay);

  const pinInput = overlay.querySelector('#pin-setup-input');
  const confirmInput = overlay.querySelector('#pin-setup-confirm');
  const errorEl = overlay.querySelector('#pin-setup-error');

  setTimeout(() => pinInput.focus(), 100);

  overlay.querySelector('#pin-setup-cancel').onclick = () => overlay.remove();
  overlay.querySelector('#pin-setup-save').onclick = async () => {
    const pin = pinInput.value.trim();
    const confirm = confirmInput.value.trim();
    if (pin.length < 4) { errorEl.textContent = 'PIN muss mindestens 4 Zeichen lang sein.'; return; }
    if (pin !== confirm) { errorEl.textContent = 'PINs stimmen nicht überein.'; return; }
    await PinLock.setPin(pin);
    await SecureStorage.init(pin);
    overlay.remove();
    showToast('PIN-Schutz aktiviert', 'success');
  };
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });
}

function removePinLock() {
  showConfirm('PIN-Schutz wirklich entfernen? Daten werden nicht mehr verschlüsselt.', () => {
    PinLock.removePin();
    showToast('PIN-Schutz entfernt', 'success');
  });
}

// ---- Dark Mode Toggle ----
function toggleDarkMode() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('pathways_theme', isDark ? 'light' : 'dark');
  const btn = document.getElementById('dark-mode-btn');
  if (btn) btn.textContent = isDark ? '🌙' : '☀️';
}

// Restore saved theme
(function() {
  const saved = localStorage.getItem('pathways_theme');
  if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
})();

// ---- Mobile Sidebar Toggle ----
function toggleMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebar-backdrop');
  sidebar.classList.toggle('mobile-open');
  backdrop.classList.toggle('visible');
}

// ---- Loading Overlay ----
function showLoading(text) {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loading-overlay';
  overlay.innerHTML = `<div style="text-align:center;"><div class="spinner"></div><div class="loading-text">${text || 'Laden...'}</div></div>`;
  document.body.appendChild(overlay);
}
function hideLoading() {
  const el = document.getElementById('loading-overlay');
  if (el) el.remove();
}

// ---- Photo Compression ----
function compressImage(dataUrl, maxSize, quality, callback) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    if (w > maxSize || h > maxSize) {
      if (w > h) { h = Math.round(h * maxSize / w); w = maxSize; }
      else { w = Math.round(w * maxSize / h); h = maxSize; }
    }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    callback(canvas.toDataURL('image/jpeg', quality));
  };
  img.src = dataUrl;
}

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

  // Show/hide sidebar phase nav based on view
  const sidebarPhaseNav = document.getElementById('sidebar-phase-nav');
  if (sidebarPhaseNav) sidebarPhaseNav.style.display = (view === 'profil' || view === 'screening') ? '' : 'none';

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
  } else if (view === 'bibliothek') {
    document.getElementById('view-bibliothek').classList.add('active');
    document.getElementById('nav-bibliothek').classList.add('active');
    renderBibliothek();
  } else if (view === 'weiterbildung') {
    document.getElementById('view-weiterbildung').classList.add('active');
    document.getElementById('nav-weiterbildung').classList.add('active');
    renderWeiterbildung();
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

  // Aktive Schüler zuerst, dann pausierte, dann abgeschlossene
  const sortiert = [...schueler].sort((a, b) => {
    const ord = { aktiv: 0, pausiert: 1, abgeschlossen: 2 };
    return (ord[a.status || 'aktiv'] || 0) - (ord[b.status || 'aktiv'] || 0);
  });

  liste.innerHTML = sortiert.map(s => {
    const screenings = DB.getScreenings(s.id);
    const urgent = screenings.some(scr => scr.severity === 'urgent');
    const latestScr = screenings.filter(scr => scr.abgeschlossen).sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
    const scrDot = urgent ? '<span class="scr-urgent-dot" title="Dringendes Screening">!</span>' : '';
    const status = s.status || 'aktiv';
    const isInaktiv = status !== 'aktiv';
    const statusLabel = status === 'pausiert' ? ' (pausiert)' : status === 'abgeschlossen' ? ' (abg.)' : '';
    return `<div class="schueler-item" data-id="${s.id}" onclick="showView('profil','${s.id}')" style="${isInaktiv ? 'opacity:0.5;' : ''}">
      <div class="schueler-avatar">${s.foto
        ? `<img src="${s.foto}" alt="">`
        : getInitials(s.vorname, s.nachname)}
      </div>
      <div class="schueler-item-info">
        <div class="schueler-item-name">${s.vorname} ${s.nachname}${scrDot}<span style="font-size:9px;color:#9CA3AF;">${statusLabel}</span></div>
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
    const offeneIntake = schueler.filter(s => (s.status || 'aktiv') === 'aktiv' && !DB.getScreenings(s.id).some(sc => sc.abgeschlossen)).length;
    const statusAktiv = schueler.filter(s => (s.status || 'aktiv') === 'aktiv').length;
    const statusPausiert = schueler.filter(s => s.status === 'pausiert').length;
    const statusAbgeschlossen = schueler.filter(s => s.status === 'abgeschlossen').length;
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
      </div>
      <div class="stat-box">
        <div class="stat-box-zahl ${offeneIntake > 0 ? 'orange' : ''}">${offeneIntake}</div>
        <div class="stat-box-label">Offene Intake</div>
      </div>
      <div class="stat-box">
        <div class="stat-box-zahl">${statusAktiv}<span style="font-size:10px;color:#9CA3AF;">/${statusPausiert}/${statusAbgeschlossen}</span></div>
        <div class="stat-box-label">Aktiv / Paus. / Abg.</div>
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

// ── Kaseload-Dashboard ──
APP.homeView = 'klienten';

function switchHomeView(view) {
  APP.homeView = view;
  const gridEl = document.getElementById('home-grid');
  const kaseEl = document.getElementById('kaseload-view');
  const btnK = document.getElementById('btn-view-klienten');
  const btnL = document.getElementById('btn-view-kaseload');
  if (view === 'kaseload') {
    if (gridEl) gridEl.style.display = 'none';
    if (kaseEl) kaseEl.style.display = '';
    if (btnK) btnK.classList.remove('active');
    if (btnL) btnL.classList.add('active');
    renderKaseloadView();
  } else {
    if (gridEl) gridEl.style.display = '';
    if (kaseEl) kaseEl.style.display = 'none';
    if (btnK) btnK.classList.add('active');
    if (btnL) btnL.classList.remove('active');
  }
}

function renderKaseloadView() {
  const container = document.getElementById('kaseload-view');
  if (!container) return;
  const schueler = DB.getSchueler();
  if (schueler.length === 0) {
    container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-muted);">Noch keine Klienten angelegt.</div>';
    return;
  }

  const heute = new Date();
  const heuteStr = heute.toISOString().split('T')[0];
  const alleNotizen = DB.getNotizen();
  const alleTermine = DB.getTermine();

  // Aggregierte Daten pro Schüler
  const rows = schueler.map(s => {
    const notizen = alleNotizen.filter(n => n.schuelerId === s.id);
    const sitzungen = notizen.filter(n => n.soap);
    const termine = alleTermine.filter(t => t.schuelerId === s.id && t.datum <= heuteStr);

    // ORS/SRS aktuell + Trend
    const mitOrs = sitzungen.filter(n => n.soap.ors?.total != null).sort((a, b) => a.datum.localeCompare(b.datum));
    const mitSrs = sitzungen.filter(n => n.soap.srs?.total != null).sort((a, b) => a.datum.localeCompare(b.datum));
    const orsAkt = mitOrs.length > 0 ? mitOrs[mitOrs.length - 1].soap.ors.total : null;
    const srsAkt = mitSrs.length > 0 ? mitSrs[mitSrs.length - 1].soap.srs.total : null;
    const orsTrend = mitOrs.length >= 2 ? orsAkt - mitOrs[mitOrs.length - 2].soap.ors.total : 0;
    const srsTrend = mitSrs.length >= 2 ? srsAkt - mitSrs[mitSrs.length - 2].soap.srs.total : 0;

    // Anwesenheit
    const mitAw = termine.filter(t => t.anwesenheit);
    const awAnwesend = mitAw.filter(t => t.anwesenheit === 'anwesend').length;
    const awRate = mitAw.length > 0 ? Math.round((awAnwesend / mitAw.length) * 100) : null;

    // Letzte Sitzung
    const letzteSitzung = sitzungen.length > 0
      ? sitzungen.sort((a, b) => b.datum.localeCompare(a.datum))[0].datum : null;
    const tageSeit = letzteSitzung ? Math.floor((heute - new Date(letzteSitzung)) / 86400000) : null;

    return { s, sitzungen: sitzungen.length, orsAkt, srsAkt, orsTrend, srsTrend, awRate, letzteSitzung, tageSeit };
  });

  // Aggregat-Statistiken
  const aktiv = schueler.filter(s => (s.status || 'aktiv') === 'aktiv').length;
  const hochrisiko = schueler.filter(s => s.risiko === 'hoch').length;
  const orsWerte = rows.filter(r => r.orsAkt !== null).map(r => r.orsAkt);
  const srsWerte = rows.filter(r => r.srsAkt !== null).map(r => r.srsAkt);
  const avgOrs = orsWerte.length > 0 ? Math.round(orsWerte.reduce((a, b) => a + b, 0) / orsWerte.length) : null;
  const avgSrs = srsWerte.length > 0 ? Math.round(srsWerte.reduce((a, b) => a + b, 0) / srsWerte.length) : null;
  const avgSitzungen = schueler.length > 0 ? (rows.reduce((n, r) => n + r.sitzungen, 0) / schueler.length).toFixed(1) : 0;
  const verbessernd = rows.filter(r => r.orsTrend > 2).length;
  const verschlechternd = rows.filter(r => r.orsTrend < -2).length;
  const stagnierend = rows.filter(r => r.orsAkt !== null).length - verbessernd - verschlechternd;

  // Risiko-Verteilung
  const risikoN = { niedrig: 0, mittel: 0, hoch: 0 };
  schueler.forEach(s => { risikoN[s.risiko || 'niedrig']++; });
  const risikoTotal = schueler.length || 1;

  const trendIcon = v => v > 2 ? '↑' : v < -2 ? '↓' : '→';
  const trendColor = v => v > 2 ? '#10B981' : v < -2 ? '#EF4444' : '#F59E0B';
  const orsColor = v => v === null ? '#9CA3AF' : v >= 28 ? '#10B981' : v >= 20 ? '#F59E0B' : '#EF4444';
  const srsColor = v => v === null ? '#9CA3AF' : v >= 30 ? '#10B981' : v >= 25 ? '#F59E0B' : '#EF4444';

  let html = `
    <!-- Aggregat-Stats -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:16px;">
      <div class="stat-box"><div class="stat-box-zahl">${aktiv}</div><div class="stat-box-label">Aktive Fälle</div></div>
      <div class="stat-box"><div class="stat-box-zahl ${hochrisiko > 0 ? 'red' : ''}">${hochrisiko}</div><div class="stat-box-label">Hochrisiko</div></div>
      <div class="stat-box"><div class="stat-box-zahl">${avgSitzungen}</div><div class="stat-box-label">∅ Sitzungen</div></div>
      ${avgOrs !== null ? `<div class="stat-box"><div class="stat-box-zahl" style="color:${orsColor(avgOrs)}">${avgOrs}</div><div class="stat-box-label">∅ ORS</div></div>` : ''}
      ${avgSrs !== null ? `<div class="stat-box"><div class="stat-box-zahl" style="color:${srsColor(avgSrs)}">${avgSrs}</div><div class="stat-box-label">∅ SRS</div></div>` : ''}
    </div>

    <!-- Risiko-Verteilung -->
    <div style="margin-bottom:16px;padding:12px;background:var(--card-bg,#fff);border:1px solid var(--border,#E5E7EB);border-radius:10px;">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;">Risiko-Verteilung</div>
      <div style="display:flex;height:24px;border-radius:6px;overflow:hidden;">
        <div style="width:${(risikoN.niedrig/risikoTotal*100).toFixed(0)}%;background:#10B981;" title="Niedrig: ${risikoN.niedrig}"></div>
        <div style="width:${(risikoN.mittel/risikoTotal*100).toFixed(0)}%;background:#F59E0B;" title="Mittel: ${risikoN.mittel}"></div>
        <div style="width:${(risikoN.hoch/risikoTotal*100).toFixed(0)}%;background:#EF4444;" title="Hoch: ${risikoN.hoch}"></div>
      </div>
      <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);margin-top:4px;">
        <span style="color:#10B981;">● Niedrig: ${risikoN.niedrig}</span>
        <span style="color:#F59E0B;">● Mittel: ${risikoN.mittel}</span>
        <span style="color:#EF4444;">● Hoch: ${risikoN.hoch}</span>
      </div>
    </div>

    <!-- Outcome-Trends -->
    ${orsWerte.length > 0 ? `
    <div style="margin-bottom:16px;padding:12px;background:var(--card-bg,#fff);border:1px solid var(--border,#E5E7EB);border-radius:10px;">
      <div style="font-size:13px;font-weight:700;margin-bottom:8px;">Outcome-Trends (ORS)</div>
      <div style="display:flex;gap:16px;font-size:13px;">
        <span style="color:#10B981;font-weight:600;">↑ ${verbessernd} verbessernd</span>
        <span style="color:#F59E0B;font-weight:600;">→ ${stagnierend} stagnierend</span>
        <span style="color:#EF4444;font-weight:600;">↓ ${verschlechternd} verschlechternd</span>
      </div>
    </div>` : ''}

    <!-- Kaseload-Tabelle -->
    <div style="overflow-x:auto;border:1px solid var(--border,#E5E7EB);border-radius:10px;background:var(--card-bg,#fff);">
      <table style="width:100%;border-collapse:collapse;font-size:12px;">
        <thead>
          <tr style="background:var(--bg-muted,#F9FAFB);text-align:left;">
            <th style="padding:8px 10px;font-weight:600;">Klient</th>
            <th style="padding:8px 6px;font-weight:600;">Risiko</th>
            <th style="padding:8px 6px;font-weight:600;">ORS</th>
            <th style="padding:8px 6px;font-weight:600;">SRS</th>
            <th style="padding:8px 6px;font-weight:600;">Sitzungen</th>
            <th style="padding:8px 6px;font-weight:600;">Anwesenh.</th>
            <th style="padding:8px 6px;font-weight:600;">Letzte Sitzung</th>
          </tr>
        </thead>
        <tbody>
          ${rows.sort((a, b) => {
            const rPrio = { hoch: 0, mittel: 1, niedrig: 2 };
            return (rPrio[a.s.risiko || 'niedrig'] || 2) - (rPrio[b.s.risiko || 'niedrig'] || 2);
          }).map(r => {
            const riskBg = r.s.risiko === 'hoch' ? '#FEF2F2' : r.s.risiko === 'mittel' ? '#FFF7ED' : '';
            return `<tr style="border-top:1px solid var(--border,#E5E7EB);cursor:pointer;${riskBg ? 'background:' + riskBg : ''}" onclick="showView('profil','${r.s.id}')">
              <td style="padding:8px 10px;font-weight:500;">${r.s.vorname} ${r.s.nachname}</td>
              <td style="padding:8px 6px;"><span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${r.s.risiko === 'hoch' ? '#EF4444' : r.s.risiko === 'mittel' ? '#F59E0B' : '#10B981'};"></span></td>
              <td style="padding:8px 6px;color:${orsColor(r.orsAkt)};font-weight:600;">${r.orsAkt !== null ? r.orsAkt + ' <span style="color:' + trendColor(r.orsTrend) + '">' + trendIcon(r.orsTrend) + '</span>' : '—'}</td>
              <td style="padding:8px 6px;color:${srsColor(r.srsAkt)};font-weight:600;">${r.srsAkt !== null ? r.srsAkt + ' <span style="color:' + trendColor(r.srsTrend) + '">' + trendIcon(r.srsTrend) + '</span>' : '—'}</td>
              <td style="padding:8px 6px;">${r.sitzungen}</td>
              <td style="padding:8px 6px;${r.awRate !== null && r.awRate < 60 ? 'color:#EF4444;font-weight:600;' : ''}">${r.awRate !== null ? r.awRate + '%' : '—'}</td>
              <td style="padding:8px 6px;${r.tageSeit !== null && r.tageSeit > 14 ? 'color:#EF4444;font-weight:600;' : ''}">${r.letzteSitzung ? formatDatum(r.letzteSitzung) + (r.tageSeit > 14 ? ' ⚠️' : '') : '—'}</td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  container.innerHTML = sanitize(html);
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

    // 5. ORS/SRS Outcome-Verschlechterung (>5 Punkte Abfall)
    const sitzungen = notizen.filter(n => n.soap && (n.soap.ors || n.soap.srs))
      .sort((a, b) => a.datum.localeCompare(b.datum));
    if (sitzungen.length >= 2) {
      const letzte = sitzungen[sitzungen.length - 1];
      const vorletzte = sitzungen[sitzungen.length - 2];
      const orsAkt = letzte.soap.ors?.total;
      const orsVor = vorletzte.soap.ors?.total;
      if (orsAkt != null && orsVor != null && orsVor - orsAkt >= 5) {
        alerts.push({ typ: 'rot', icon: '📉', schueler: s,
          text: `ORS-Verschlechterung (${orsVor}→${orsAkt})`, detail: 'Abfall um ' + (orsVor - orsAkt) + ' Punkte' });
      }
      const srsAkt = letzte.soap.srs?.total;
      const srsVor = vorletzte.soap.srs?.total;
      if (srsAkt != null && srsVor != null && srsVor - srsAkt >= 5) {
        alerts.push({ typ: 'orange', icon: '📊', schueler: s,
          text: `SRS-Verschlechterung (${srsVor}→${srsAkt})`, detail: 'Sitzungsqualität gesunken' });
      }
    }

    // 6. Anwesenheit: Konsekutive No-Shows
    const sTermine = DB.getTermine(s.id)
      .filter(t => t.schuelerId === s.id && t.datum <= heute.toISOString().split('T')[0])
      .sort((a, b) => b.datum.localeCompare(a.datum));
    let konsekNoShow = 0;
    for (const t of sTermine) {
      if (t.anwesenheit === 'abwesend-unentschuldigt') konsekNoShow++;
      else if (t.anwesenheit) break;
    }
    if (konsekNoShow >= 3) {
      alerts.push({ typ: 'rot', icon: '🚫', schueler: s,
        text: `${konsekNoShow} Fehltermine in Folge`, detail: 'Dringende Kontaktaufnahme' });
    } else if (konsekNoShow >= 2) {
      alerts.push({ typ: 'orange', icon: '⚠️', schueler: s,
        text: '2 Fehltermine in Folge', detail: 'Kontakt aufnehmen' });
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
  const klientLabel = document.getElementById('sidebar-klient-label');
  if (klientLabel) klientLabel.textContent = `Klient: ${s.vorname} ${s.nachname}`;
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

  // Status-Dropdown
  const statusEl = document.getElementById('profil-status');
  if (statusEl) statusEl.value = s.status || 'aktiv';

  // Profil-Vollständigkeit
  renderProfilCompleteness(s);

  // Diagnosen + Medikamenten-Badges im Header
  renderProfilBadges(s);

  // Aktiven Tab rendern (über Phasen-Navigation)
  const phase = getPhaseForTab(APP.currentProfilTab);
  showPhase(phase, APP.currentProfilTab);
}

function updateSchuelerStatus(status) {
  if (!APP.currentSchuelerId) return;
  DB.updateSchueler(APP.currentSchuelerId, { status });
  renderSidebar();
  showToast(`Status auf „${status === 'aktiv' ? 'Aktiv' : status === 'pausiert' ? 'Pausiert' : 'Abgeschlossen'}" gesetzt`, 'success');
}

function renderProfilCompleteness(s) {
  const el = document.getElementById('profil-completeness');
  if (!el) return;

  const checks = [
    { label: 'Stammdaten', done: !!(s.vorname && s.nachname && s.geburtsdatum) },
    { label: 'Anamnese', done: (s.anamnese || []).length >= 3 },
    { label: 'Screening', done: DB.getScreenings(s.id).some(sc => sc.abgeschlossen) },
    { label: 'Stärken', done: !!(s.staerkenProfil && Object.keys(s.staerkenProfil.ratings || {}).length >= 3) },
    { label: '5P-Analyse', done: (() => { const ff = DB.getFallformulierung(s.id); return ff && ['presenting','predisposing','precipitating','perpetuating','protective'].reduce((sum,k) => sum + (ff[k]||[]).length, 0) >= 3; })() },
    { label: 'Förderplan', done: !!DB.getRoadmap(s.id) },
    { label: 'Notizen', done: DB.getNotizen(s.id).length >= 1 },
    { label: 'Wohlbefinden', done: DB.getWohlbefinden(s.id).length >= 1 },
  ];

  const done = checks.filter(c => c.done).length;
  const total = checks.length;
  const pct = Math.round(done / total * 100);
  const radius = 24;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';

  el.innerHTML = `
    <div style="display:flex;align-items:center;gap:10px;cursor:pointer;" onclick="this.querySelector('.completeness-details').style.display=this.querySelector('.completeness-details').style.display==='none'?'block':'none'" title="Profil-Vollständigkeit">
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r="${radius}" fill="none" stroke="#E5E7EB" stroke-width="4"/>
        <circle cx="29" cy="29" r="${radius}" fill="none" stroke="${color}" stroke-width="4"
          stroke-dasharray="${circ}" stroke-dashoffset="${offset}"
          stroke-linecap="round" transform="rotate(-90 29 29)"
          style="transition:stroke-dashoffset 0.6s ease;"/>
        <text x="29" y="29" text-anchor="middle" dominant-baseline="central"
          font-size="13" font-weight="700" fill="${color}">${pct}%</text>
      </svg>
      <div class="completeness-details" style="display:none;position:absolute;top:100%;left:0;z-index:100;background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:12px 16px;box-shadow:0 8px 24px rgba(0,0,0,0.12);min-width:200px;margin-top:4px;">
        <div style="font-size:12px;font-weight:700;color:#1F2937;margin-bottom:8px;">Profil-Vollständigkeit</div>
        ${checks.map(c => `
          <div style="display:flex;align-items:center;gap:6px;font-size:12px;padding:3px 0;color:${c.done ? '#10B981' : '#9CA3AF'};">
            <span>${c.done ? '✓' : '○'}</span>
            <span style="color:${c.done ? '#374151' : '#9CA3AF'};">${c.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

// ============================================================
// WEITERBILDUNG — Praxis-Lernpfade & Nachschlagewerke
// ============================================================
let WB_ACTIVE_TAB = 'uebersicht';

function renderWeiterbildung() {
  const container = document.getElementById('weiterbildung-content');
  if (!container) return;

  const tabs = [
    { id: 'uebersicht', label: 'Übersicht', icon: '🏠' },
    { id: 'schnellhilfe', label: 'Schnellhilfe', icon: '🆘' },
    { id: 'lernpfade', label: 'Praxis-Lernpfade', icon: '🎓' },
    { id: 'nachschlagewerke', label: 'Nachschlagewerke', icon: '📖' },
    { id: 'selbstfuersorge', label: 'Selbstfürsorge', icon: '💚' }
  ];

  container.innerHTML = `
    <div class="phase-tabs" style="margin-bottom:20px;">
      ${tabs.map(t => `
        <button class="phase-tab ${WB_ACTIVE_TAB === t.id ? 'active' : ''}"
                onclick="WB_ACTIVE_TAB='${t.id}'; renderWeiterbildung();">
          ${t.icon} ${t.label}
        </button>
      `).join('')}
    </div>
    <div id="wb-tab-content"></div>
  `;

  const content = document.getElementById('wb-tab-content');
  switch (WB_ACTIVE_TAB) {
    case 'uebersicht':       renderWBUebersicht(content); break;
    case 'schnellhilfe':     renderCDSSProblemauswahl(content); break;
    case 'lernpfade':        renderWBLernpfade(content); break;
    case 'nachschlagewerke': renderWBNachschlagewerke(content); break;
    case 'selbstfuersorge':  renderWBSelbstfuersorge(content); break;
    default:                 renderWBUebersicht(content);
  }
}

function getWBProgress() {
  try {
    return JSON.parse(localStorage.getItem('pathways_wb_progress') || '{}');
  } catch(e) { return {}; }
}

function saveWBProgress(progress) {
  localStorage.setItem('pathways_wb_progress', JSON.stringify(progress));
}

function renderWBUebersicht(container) {
  const progress = getWBProgress();
  const gelesen = (progress.geleseneModule || []);
  const quizScores = progress.quizScores || {};

  const totalModule = WB_LERNPFADE.length;
  const gelesenCount = gelesen.length;
  const quizCount = Object.keys(quizScores).length;

  // Kategorie-Stats
  const katStats = {};
  Object.keys(WB_KATEGORIEN).forEach(k => {
    const pfade = WB_LERNPFADE.filter(p => p.kategorie === k);
    const done = pfade.filter(p => gelesen.includes(p.id)).length;
    katStats[k] = { total: pfade.length, done: done };
  });

  container.innerHTML = `
    <!-- Hero -->
    <div class="card" style="background:linear-gradient(135deg,#D97706 0%,#B45309 100%);color:white;border:none;margin-bottom:20px;">
      <div class="card-body" style="padding:28px 24px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:56px;height:56px;background:rgba(255,255,255,0.2);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:28px;">🎓</div>
          <div style="flex:1;">
            <h2 style="font-size:20px;font-weight:800;margin-bottom:4px;">Weiterbildung</h2>
            <p style="font-size:13px;opacity:0.85;line-height:1.5;">Schnellhilfe bei akuten Situationen, praxisnahe Lernpfade, Nachschlagewerke und Selbstfürsorge — alles für deine professionelle Entwicklung.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Schnellhilfe prominent -->
    <div class="card" style="cursor:pointer;border:2px solid #DC2626;margin-bottom:20px;transition:transform 0.15s,box-shadow 0.15s;" onclick="WB_ACTIVE_TAB='schnellhilfe';renderWeiterbildung();" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(220,38,38,0.15)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <div class="card-body" style="padding:20px;">
        <div style="display:flex;align-items:center;gap:16px;">
          <div style="width:52px;height:52px;background:#FEF2F2;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:26px;">🆘</div>
          <div style="flex:1;">
            <div style="font-size:16px;font-weight:800;color:#DC2626;margin-bottom:4px;">Schnellhilfe — "Was mache ich jetzt?"</div>
            <p style="font-size:12px;color:#6B7280;line-height:1.5;">Problem auswählen, Situation beschreiben, fundierte Handlungsempfehlung erhalten. 40 Probleme, hunderte Variablen, evidenzbasierte Empfehlungen mit Referenzen. In 2 Minuten.</p>
          </div>
          <div style="font-size:24px;color:#DC2626;">→</div>
        </div>
      </div>
    </div>

    <!-- 4 Bereiche -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-bottom:20px;">

      <!-- Praxis-Lernpfade -->
      <div class="card" style="cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;" onclick="WB_ACTIVE_TAB='lernpfade';renderWeiterbildung();" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:44px;height:44px;background:#FEF3C7;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">🎓</div>
            <div>
              <div style="font-size:14px;font-weight:700;color:#1F2937;">Praxis-Lernpfade</div>
              <div style="font-size:11px;color:#6B7280;">${gelesenCount}/${totalModule} absolviert</div>
            </div>
          </div>
          <p style="font-size:12px;color:#6B7280;line-height:1.5;margin-bottom:10px;">"Ich will mich vorbereiten" — 20 Kurse mit Theorie, Fallbeispielen, Gesprächsskripten und Wissenstests.</p>
          <div style="display:flex;flex-wrap:wrap;gap:4px;">
            ${Object.entries(WB_KATEGORIEN).map(([key, kat]) => `
              <span style="font-size:10px;padding:3px 8px;border-radius:6px;background:${kat.farbe}15;color:${kat.farbe};font-weight:600;">${kat.icon} ${kat.label.split(' ')[0]}</span>
            `).join('')}
          </div>
          ${gelesenCount > 0 ? `
            <div style="margin-top:10px;background:#E5E7EB;border-radius:4px;height:4px;overflow:hidden;">
              <div style="height:100%;width:${Math.round(gelesenCount/totalModule*100)}%;background:#D97706;border-radius:4px;"></div>
            </div>
          ` : ''}
        </div>
      </div>

      <!-- Nachschlagewerke -->
      <div class="card" style="cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;" onclick="WB_ACTIVE_TAB='nachschlagewerke';renderWeiterbildung();" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:44px;height:44px;background:#EFF6FF;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">📖</div>
            <div>
              <div style="font-size:14px;font-weight:700;color:#1F2937;">Nachschlagewerke</div>
              <div style="font-size:11px;color:#6B7280;">Glossar, Fachmodule, Wiki</div>
            </div>
          </div>
          <p style="font-size:12px;color:#6B7280;line-height:1.5;">"Ich will etwas nachschlagen" — ${Object.keys(FACHKRAFT_MODULE_DATEIEN).length}+ Fachkraft-Module, Wiki-Artikel, Entscheidungsbäume und Glossar.</p>
        </div>
      </div>

      <!-- Selbstfürsorge -->
      <div class="card" style="cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;" onclick="WB_ACTIVE_TAB='selbstfuersorge';renderWeiterbildung();" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:44px;height:44px;background:#F0FDF4;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">💚</div>
            <div>
              <div style="font-size:14px;font-weight:700;color:#1F2937;">Selbstfürsorge</div>
              <div style="font-size:11px;color:#6B7280;">ProQOL, Supervision</div>
            </div>
          </div>
          <p style="font-size:12px;color:#6B7280;line-height:1.5;">"Wie geht es mir?" — Selbstfürsorge-Check, Supervisionsvorbereitung und Burnout-Prävention.</p>
        </div>
      </div>

    </div>

    ${quizCount > 0 ? `
    <!-- Quiz-Ergebnisse -->
    <div class="card">
      <div class="card-header">
        <span>📊</span>
        <div class="card-title">Meine Wissenstests</div>
      </div>
      <div class="card-body">
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:10px;">
          ${Object.entries(quizScores).map(([id, qs]) => {
            const lp = WB_LERNPFADE.find(p => p.id === id);
            if (!lp) return '';
            const pct = Math.round(qs.score / qs.total * 100);
            return `
              <div style="padding:10px 14px;background:#F8FAFC;border-radius:10px;border:1px solid #E5E7EB;">
                <div style="font-size:12px;font-weight:600;margin-bottom:4px;">${lp.icon} ${lp.titel}</div>
                <div style="font-size:18px;font-weight:800;color:${pct >= 80 ? '#16A34A' : pct >= 50 ? '#D97706' : '#DC2626'};">${qs.score}/${qs.total}</div>
                <div style="font-size:10px;color:#6B7280;">${qs.datum || ''}</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
    ` : ''}
  `;
}

let WB_FILTER_KAT = '';

function renderWBLernpfade(container) {
  const progress = getWBProgress();
  const gelesen = progress.geleseneModule || [];

  // Filter
  const kategorien = Object.entries(WB_KATEGORIEN);
  const filtered = WB_FILTER_KAT ? WB_LERNPFADE.filter(p => p.kategorie === WB_FILTER_KAT) : WB_LERNPFADE;

  container.innerHTML = `
    <!-- Filter -->
    <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
      <button class="btn btn-sm ${!WB_FILTER_KAT ? 'btn-primary' : 'btn-secondary'}" onclick="WB_FILTER_KAT='';renderWeiterbildung();">Alle (${WB_LERNPFADE.length})</button>
      ${kategorien.map(([key, kat]) => `
        <button class="btn btn-sm ${WB_FILTER_KAT === key ? 'btn-primary' : 'btn-secondary'}" onclick="WB_FILTER_KAT='${key}';renderWeiterbildung();">
          ${kat.icon} ${kat.label} (${WB_LERNPFADE.filter(p => p.kategorie === key).length})
        </button>
      `).join('')}
    </div>

    <!-- Grid -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;">
      ${filtered.map((lp, idx) => {
        const done = gelesen.includes(lp.id);
        const quizScore = (progress.quizScores || {})[lp.id];
        return `
          <div class="card" style="cursor:pointer;transition:transform 0.15s,box-shadow 0.15s;position:relative;overflow:hidden;${done ? 'border-left:3px solid #16A34A;' : ''}" onclick="window.open('${lp.datei}','_blank')" onmouseenter="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 24px rgba(0,0,0,0.12)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
            <div class="card-body" style="padding:18px;">
              <div style="display:flex;align-items:flex-start;gap:12px;">
                <div style="width:44px;height:44px;background:${lp.farbe}15;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;flex-shrink:0;">${lp.icon}</div>
                <div style="flex:1;min-width:0;">
                  <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
                    <span style="font-size:14px;font-weight:700;color:#1F2937;line-height:1.3;">${lp.titel}</span>
                    ${done ? '<span style="font-size:10px;padding:2px 6px;background:#F0FDF4;color:#16A34A;border-radius:4px;font-weight:600;">Absolviert</span>' : ''}
                  </div>
                  <p style="font-size:12px;color:#6B7280;line-height:1.5;margin-bottom:8px;">${lp.beschreibung}</p>
                  <div style="display:flex;align-items:center;gap:12px;">
                    <span style="font-size:11px;color:#9CA3AF;display:flex;align-items:center;gap:4px;">⏱ ${lp.dauer}</span>
                    <span style="font-size:10px;padding:2px 8px;background:${lp.farbe}15;color:${lp.farbe};border-radius:4px;font-weight:600;">${WB_KATEGORIEN[lp.kategorie]?.label || ''}</span>
                    ${quizScore ? `<span style="font-size:11px;color:${Math.round(quizScore.score/quizScore.total*100)>=80?'#16A34A':'#D97706'};font-weight:600;">Quiz: ${quizScore.score}/${quizScore.total}</span>` : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderWBNachschlagewerke(container) {
  const fmCount = Object.keys(FACHKRAFT_MODULE_DATEIEN).length;
  const wikiCount = typeof WIKI_ARTIKEL !== 'undefined' ? WIKI_ARTIKEL.length : 0;

  container.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">

      <!-- Fachkraft-Module -->
      <div class="card">
        <div class="card-header">
          <span>📚</span>
          <div class="card-title">Fachkraft-Module</div>
        </div>
        <div class="card-body">
          <p style="font-size:12px;color:#6B7280;margin-bottom:12px;">${fmCount}+ klinische Nachschlagewerke mit ICD-Codes, Diagnostik und Interventionen.</p>
          <p style="font-size:11px;color:#9CA3AF;">Zugriff über die Bibliothek (Wissen-Tab) bei einem ausgewählten Schüler.</p>
        </div>
      </div>

      <!-- Wiki-Artikel -->
      <div class="card">
        <div class="card-header">
          <span>📖</span>
          <div class="card-title">Wiki-Artikel</div>
        </div>
        <div class="card-body">
          <p style="font-size:12px;color:#6B7280;margin-bottom:12px;">${wikiCount} Fachartikel zu Themen der Jugendarbeit in Luxemburg.</p>
          <p style="font-size:11px;color:#9CA3AF;">Zugriff über die Bibliothek (Wissen-Tab) bei einem ausgewählten Schüler.</p>
        </div>
      </div>

      <!-- Entscheidungsbäume -->
      <div class="card" style="cursor:pointer;" onclick="window.open('entscheidungsbaeume/triage-baum.html','_blank')">
        <div class="card-header">
          <span>🌳</span>
          <div class="card-title">Entscheidungsbäume</div>
        </div>
        <div class="card-body">
          <p style="font-size:12px;color:#6B7280;margin-bottom:12px;">Interaktive Triage- und Überweisungshilfen für schwierige Entscheidungssituationen.</p>
          <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation();window.open('entscheidungsbaeume/triage-baum.html','_blank')">Triage-Baum öffnen</button>
        </div>
      </div>

      <!-- Evaluationsbögen -->
      <div class="card">
        <div class="card-header">
          <span>📊</span>
          <div class="card-title">Evaluationsbögen</div>
        </div>
        <div class="card-body">
          <p style="font-size:12px;color:#6B7280;margin-bottom:12px;">${EVALUATIONSBOEGEN.length} standardisierte Bewertungsinstrumente für Sitzungs-Feedback, Symptom-Tracking und Selbstfürsorge.</p>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:8px;">
            ${EVALUATIONSBOEGEN.map(e => `
              <span style="font-size:10px;padding:3px 8px;background:#F3F4F6;border-radius:6px;color:#6B7280;cursor:pointer;" onclick="event.stopPropagation();window.open('evaluationsboegen/${e.datei}','_blank')">${e.titel}</span>
            `).join('')}
          </div>
        </div>
      </div>

    </div>
  `;
}

// ============================================================
// CDSS — Schnellhilfe (Klinisches Entscheidungsunterstützungssystem)
// ============================================================
let CDSS_STATE = { problem: null, schritt: 0, antworten: {}, tags: [] };

function renderCDSSProblemauswahl(container) {
  CDSS_STATE = { problem: null, schritt: 0, antworten: {}, tags: [] };

  if (typeof CDSS_PROBLEME === 'undefined' || !CDSS_PROBLEME.length) {
    container.innerHTML = `
      <div class="card" style="border:2px solid #DC2626;margin-bottom:16px;">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
            <div style="font-size:28px;">🆘</div>
            <div>
              <div style="font-size:16px;font-weight:800;color:#DC2626;">Schnellhilfe</div>
              <p style="font-size:12px;color:#6B7280;">Problem auswählen → Situation beschreiben → Handlungsempfehlung erhalten</p>
            </div>
          </div>
          <p style="color:#6B7280;font-size:13px;">Die Schnellhilfe wird gerade aufgebaut — 40 Probleme mit evidenzbasierten Empfehlungen werden Schritt für Schritt hinzugefügt.</p>
        </div>
      </div>
    `;
    return;
  }

  const kategorien = {
    emotional: { label: 'Emotionale / Internalisierende Probleme', icon: '🌧️', farbe: '#3B82F6' },
    externalisierend: { label: 'Externalisierende Probleme', icon: '🔥', farbe: '#EF4444' },
    krisen: { label: 'Krisen / Risiko', icon: '🚨', farbe: '#DC2626' },
    entwicklung: { label: 'Entwicklung / Trauma', icon: '🧠', farbe: '#8B5CF6' },
    sozial: { label: 'Soziale / Kontextuelle Probleme', icon: '🌍', farbe: '#0EA5E9' },
    interaktion: { label: 'Beziehungs- & Interaktionsprobleme', icon: '⚡', farbe: '#F59E0B' },
    schule: { label: 'Schulische Alltagsprobleme', icon: '🏫', farbe: '#EA580C' },
    koerper: { label: 'Körper & Alltag', icon: '🏥', farbe: '#059669' },
    familie: { label: 'Familiäre Alltagssituationen', icon: '👨‍👩‍👧', farbe: '#7C3AED' }
  };

  container.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="font-size:16px;font-weight:800;color:#1F2937;margin-bottom:4px;">🆘 Schnellhilfe — Welches Problem siehst du?</div>
      <p style="font-size:12px;color:#6B7280;">Wähle das Hauptproblem. Du beschreibst danach die Situation genauer und erhältst eine fundierte Handlungsempfehlung.</p>
    </div>
    <input type="text" id="cdss-suche" placeholder="Problem suchen..." oninput="filterCDSSProbleme(this.value)" style="width:100%;padding:10px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;margin-bottom:16px;font-family:inherit;">
    <div id="cdss-problem-grid">
      ${Object.entries(kategorien).map(([katId, kat]) => {
        const probs = CDSS_PROBLEME.filter(p => p.kategorie === katId);
        if (!probs.length) return '';
        return `
          <div class="cdss-kat-section" data-kat="${katId}" style="margin-bottom:20px;">
            <div style="font-size:13px;font-weight:700;color:${kat.farbe};margin-bottom:8px;display:flex;align-items:center;gap:6px;">${kat.icon} ${kat.label}</div>
            <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:8px;">
              ${probs.map(p => `
                <div class="cdss-problem-karte" data-id="${p.id}" style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:white;border:1.5px solid #E5E7EB;border-radius:10px;cursor:pointer;transition:all 0.15s;" onclick="startCDSS('${p.id}')" onmouseenter="this.style.borderColor='${p.farbe}';this.style.background='${p.farbe}08'" onmouseleave="this.style.borderColor='#E5E7EB';this.style.background='white'">
                  <span style="font-size:20px;">${p.icon}</span>
                  <div style="flex:1;min-width:0;">
                    <div style="font-size:12px;font-weight:600;color:#1F2937;">${p.titel}</div>
                    <div style="font-size:10px;color:#9CA3AF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${p.beschreibung}</div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function filterCDSSProbleme(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll('.cdss-problem-karte').forEach(el => {
    const id = el.dataset.id;
    const prob = CDSS_PROBLEME.find(p => p.id === id);
    const match = !q || prob.titel.toLowerCase().includes(q) || prob.beschreibung.toLowerCase().includes(q);
    el.style.display = match ? '' : 'none';
  });
  document.querySelectorAll('.cdss-kat-section').forEach(el => {
    const visibleCards = el.querySelectorAll('.cdss-problem-karte[style*="display: none"]');
    const totalCards = el.querySelectorAll('.cdss-problem-karte');
    el.style.display = visibleCards.length === totalCards.length ? 'none' : '';
  });
}

function startCDSS(problemId) {
  const problem = CDSS_PROBLEME.find(p => p.id === problemId);
  if (!problem) return;
  CDSS_STATE = { problem: problem, schritt: 0, antworten: {}, tags: [] };
  renderCDSSWizard();
}

function renderCDSSWizard() {
  const container = document.getElementById('wb-tab-content');
  if (!container) return;
  const { problem, schritt, antworten } = CDSS_STATE;

  const alleVariablen = [...(typeof CDSS_GEMEINSAME_VARIABLEN !== 'undefined' ? CDSS_GEMEINSAME_VARIABLEN : []), ...(problem.variablen || [])];
  const total = alleVariablen.length;

  if (schritt >= total) {
    renderCDSSErgebnis(container);
    return;
  }

  const v = alleVariablen[schritt];
  const bisherig = antworten[v.id];

  container.innerHTML = `
    <div style="margin-bottom:16px;">
      <button class="btn btn-sm btn-secondary" onclick="CDSS_STATE.schritt=0;CDSS_STATE.antworten={};CDSS_STATE.tags=[];renderCDSSProblemauswahl(document.getElementById('wb-tab-content'));" style="margin-bottom:12px;">← Problemauswahl</button>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="font-size:22px;">${problem.icon}</span>
        <span style="font-size:15px;font-weight:700;color:#1F2937;">${problem.titel}</span>
      </div>
      <!-- Fortschritt -->
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
        <span style="font-size:11px;color:#6B7280;">Schritt ${schritt + 1} von ${total}</span>
        <div style="flex:1;background:#E5E7EB;border-radius:4px;height:4px;overflow:hidden;">
          <div style="height:100%;width:${Math.round((schritt/total)*100)}%;background:#D97706;border-radius:4px;transition:width 0.3s;"></div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:16px;">
      <div class="card-body" style="padding:24px;">
        <div style="font-size:14px;font-weight:700;color:#1F2937;margin-bottom:16px;">${v.frage}</div>
        ${v.typ === 'multi' ? `
          <div style="display:flex;flex-direction:column;gap:8px;" id="cdss-optionen">
            ${v.optionen.map(opt => {
              const checked = Array.isArray(bisherig) && bisherig.includes(opt.id);
              return `
                <label style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:${checked ? '#FEF3C7' : 'white'};border:1.5px solid ${checked ? '#D97706' : '#E5E7EB'};border-radius:10px;cursor:pointer;transition:all 0.15s;" onmouseenter="if(!this.querySelector('input').checked)this.style.background='#F8FAFC'" onmouseleave="if(!this.querySelector('input').checked)this.style.background='white'">
                  <input type="checkbox" value="${opt.id}" ${checked ? 'checked' : ''} onchange="cdssMultiSelect('${v.id}','${opt.id}',this.checked)" style="width:16px;height:16px;accent-color:#D97706;">
                  <span style="font-size:13px;color:#1F2937;">${opt.label}</span>
                </label>
              `;
            }).join('')}
          </div>
          <div style="display:flex;gap:8px;margin-top:16px;">
            ${schritt > 0 ? '<button class="btn btn-sm btn-secondary" onclick="CDSS_STATE.schritt--;renderCDSSWizard();">← Zurück</button>' : ''}
            <button class="btn btn-sm btn-primary" onclick="cdssWeiter()">Weiter →</button>
          </div>
        ` : `
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${v.optionen.map(opt => `
              <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;background:${bisherig === opt.id ? '#FEF3C7' : 'white'};border:1.5px solid ${bisherig === opt.id ? '#D97706' : '#E5E7EB'};border-radius:10px;cursor:pointer;transition:all 0.15s;" onclick="cdssSingleSelect('${v.id}','${opt.id}')" onmouseenter="this.style.background='${bisherig === opt.id ? '#FEF3C7' : '#F8FAFC'}';this.style.borderColor='${bisherig === opt.id ? '#D97706' : '#CBD5E1'}'" onmouseleave="this.style.background='${bisherig === opt.id ? '#FEF3C7' : 'white'}';this.style.borderColor='${bisherig === opt.id ? '#D97706' : '#E5E7EB'}'">
                <span style="font-size:13px;color:#1F2937;">${opt.label}</span>
              </div>
            `).join('')}
          </div>
          ${schritt > 0 ? '<div style="margin-top:12px;"><button class="btn btn-sm btn-secondary" onclick="CDSS_STATE.schritt--;renderCDSSWizard();">← Zurück</button></div>' : ''}
        `}
      </div>
    </div>
  `;
}

function cdssSingleSelect(varId, optId) {
  const problem = CDSS_STATE.problem;
  const alleVariablen = [...(typeof CDSS_GEMEINSAME_VARIABLEN !== 'undefined' ? CDSS_GEMEINSAME_VARIABLEN : []), ...(problem.variablen || [])];
  const v = alleVariablen.find(x => x.id === varId);
  const opt = v.optionen.find(o => o.id === optId);

  // Remove old tags for this variable
  const oldOpt = v.optionen.find(o => o.id === CDSS_STATE.antworten[varId]);
  if (oldOpt && oldOpt.tags) {
    CDSS_STATE.tags = CDSS_STATE.tags.filter(t => !oldOpt.tags.includes(t));
  }

  CDSS_STATE.antworten[varId] = optId;
  if (opt.tags) CDSS_STATE.tags.push(...opt.tags);
  CDSS_STATE.schritt++;
  renderCDSSWizard();
}

function cdssMultiSelect(varId, optId, checked) {
  if (!CDSS_STATE.antworten[varId]) CDSS_STATE.antworten[varId] = [];
  const problem = CDSS_STATE.problem;
  const alleVariablen = [...(typeof CDSS_GEMEINSAME_VARIABLEN !== 'undefined' ? CDSS_GEMEINSAME_VARIABLEN : []), ...(problem.variablen || [])];
  const v = alleVariablen.find(x => x.id === varId);
  const opt = v.optionen.find(o => o.id === optId);

  if (checked) {
    if (!CDSS_STATE.antworten[varId].includes(optId)) CDSS_STATE.antworten[varId].push(optId);
    if (opt.tags) CDSS_STATE.tags.push(...opt.tags);
  } else {
    CDSS_STATE.antworten[varId] = CDSS_STATE.antworten[varId].filter(id => id !== optId);
    if (opt.tags) CDSS_STATE.tags = CDSS_STATE.tags.filter(t => !opt.tags.includes(t));
  }
}

function cdssWeiter() {
  CDSS_STATE.schritt++;
  renderCDSSWizard();
}

function renderCDSSErgebnis(container) {
  const { problem, tags, antworten } = CDSS_STATE;

  // Tag-matching engine
  let besteEmpfehlung = null;
  let bestScore = -1;

  (problem.empfehlungen || []).forEach(emp => {
    // Check required tags
    const erfuellt = (emp.tags_erforderlich || []).every(t => tags.includes(t));
    if (!erfuellt) return;
    // Check exclusion tags
    const ausgeschlossen = (emp.tags_ausschluss || []).some(t => tags.includes(t));
    if (ausgeschlossen) return;
    // Score by weighted tags
    let score = 0;
    const gewichtung = emp.tags_gewichtung || {};
    tags.forEach(t => { score += (gewichtung[t] || 1); });
    if (score > bestScore) { bestScore = score; besteEmpfehlung = emp; }
  });

  // Fallback
  if (!besteEmpfehlung && problem.empfehlungen && problem.empfehlungen.length) {
    besteEmpfehlung = problem.empfehlungen[problem.empfehlungen.length - 1];
  }

  if (!besteEmpfehlung) {
    container.innerHTML = `
      <div class="card"><div class="card-body" style="padding:24px;">
        <button class="btn btn-sm btn-secondary" onclick="WB_ACTIVE_TAB='schnellhilfe';renderWeiterbildung();" style="margin-bottom:16px;">← Neue Problemauswahl</button>
        <p style="font-size:14px;font-weight:700;color:#1F2937;margin-bottom:8px;">${problem.icon} ${problem.titel}</p>
        <p style="color:#6B7280;">Für dieses Problem werden die Empfehlungen gerade aufgebaut. Bitte schaue in den Fachkraft-Modulen oder der Bibliothek nach.</p>
      </div></div>
    `;
    return;
  }

  const e = besteEmpfehlung;
  const risikoFarben = { gruen: '#16A34A', gelb: '#D97706', rot: '#DC2626' };
  const risikoLabels = { gruen: 'GERINGES RISIKO — Beobachten & begleiten', gelb: 'MITTLERES RISIKO — Zeitnahe Intervention empfohlen', rot: 'HOHES RISIKO — Sofortiges Handeln erforderlich' };
  const risikoIcons = { gruen: '🟢', gelb: '🟡', rot: '🔴' };

  container.innerHTML = `
    <div style="margin-bottom:16px;">
      <button class="btn btn-sm btn-secondary" onclick="WB_ACTIVE_TAB='schnellhilfe';renderWeiterbildung();" style="margin-right:8px;">← Neue Problemauswahl</button>
      <button class="btn btn-sm btn-secondary" onclick="window.print();">🖨 Drucken</button>
    </div>

    <!-- Risiko-Banner -->
    <div style="background:${risikoFarben[e.risiko] || '#6B7280'};color:white;padding:14px 20px;border-radius:12px;margin-bottom:16px;display:flex;align-items:center;gap:10px;">
      <span style="font-size:22px;">${risikoIcons[e.risiko] || '⚪'}</span>
      <span style="font-size:14px;font-weight:700;">${risikoLabels[e.risiko] || 'Einschätzung'}</span>
    </div>

    <!-- Fachliche Einschätzung -->
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header"><span>📋</span><div class="card-title">Fachliche Einschätzung</div></div>
      <div class="card-body"><p style="font-size:12px;line-height:1.7;">${e.einschaetzung || ''}</p></div>
    </div>

    <!-- Sofortmaßnahmen -->
    ${e.sofort && e.sofort.length ? `
    <div class="card" style="margin-bottom:12px;border-left:3px solid ${risikoFarben[e.risiko] || '#6B7280'};">
      <div class="card-header"><span>⚡</span><div class="card-title">Sofortmaßnahmen</div></div>
      <div class="card-body">
        <ol style="padding-left:18px;font-size:12px;line-height:1.7;">
          ${e.sofort.map(s => '<li style="margin-bottom:6px;">' + s + '</li>').join('')}
        </ol>
      </div>
    </div>
    ` : ''}

    <!-- Mittelfristige Interventionen -->
    ${e.mittelfristig && e.mittelfristig.length ? `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header"><span>📅</span><div class="card-title">Mittelfristige Interventionen (2-6 Wochen)</div></div>
      <div class="card-body">
        <ul style="padding-left:18px;font-size:12px;line-height:1.7;">
          ${e.mittelfristig.map(m => '<li style="margin-bottom:4px;">' + m + '</li>').join('')}
        </ul>
      </div>
    </div>
    ` : ''}

    <!-- Überweisung -->
    ${e.ueberweisung ? `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header"><span>🏥</span><div class="card-title">Überweisung / Vernetzung</div></div>
      <div class="card-body"><p style="font-size:12px;line-height:1.7;">${e.ueberweisung}</p></div>
    </div>
    ` : ''}

    <!-- Elternarbeit -->
    ${e.elternarbeit ? `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header"><span>👨‍👩‍👧</span><div class="card-title">Elternarbeit</div></div>
      <div class="card-body"><p style="font-size:12px;line-height:1.7;">${e.elternarbeit}</p></div>
    </div>
    ` : ''}

    <!-- Materialien -->
    ${e.materialien ? `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header"><span>📚</span><div class="card-title">Empfohlene Materialien</div></div>
      <div class="card-body">
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${(e.materialien.arbeitsblaetter || []).map(a => `<span style="font-size:11px;padding:4px 10px;background:#F0FDF4;border:1px solid #BBF7D0;border-radius:6px;cursor:pointer;color:#16A34A;" onclick="window.open('arbeitsblaetter/${a}','_blank')">📄 ${a.replace('.html','').replace(/-/g,' ')}</span>`).join('')}
          ${(e.materialien.therapiemodule || []).map(t => `<span style="font-size:11px;padding:4px 10px;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:6px;cursor:pointer;color:#2563EB;" onclick="window.open('therapiemodule/${t}','_blank')">📘 ${t.replace('.html','').replace(/-/g,' ')}</span>`).join('')}
          ${(e.materialien.elterninfo || []).map(ei => `<span style="font-size:11px;padding:4px 10px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;cursor:pointer;color:#D97706;" onclick="window.open('eltern-infoblaetter/${ei}','_blank')">👨‍👩‍👧 ${ei.replace('.html','').replace(/-/g,' ')}</span>`).join('')}
        </div>
      </div>
    </div>
    ` : ''}

    <!-- Referenzen -->
    ${e.referenzen && e.referenzen.length ? `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header"><span>📖</span><div class="card-title">Referenzen</div></div>
      <div class="card-body">
        <ol style="padding-left:18px;font-size:11px;color:#6B7280;line-height:1.7;">
          ${e.referenzen.map(r => '<li style="margin-bottom:4px;">' + r + '</li>').join('')}
        </ol>
      </div>
    </div>
    ` : ''}

    <!-- Gewählte Variablen (klappbar) -->
    <details style="margin-top:12px;">
      <summary style="font-size:12px;color:#6B7280;cursor:pointer;font-weight:600;">Gewählte Variablen anzeigen</summary>
      <div style="margin-top:8px;padding:12px;background:#F8FAFC;border-radius:8px;font-size:11px;line-height:1.8;">
        ${Object.entries(antworten).map(([k, v]) => {
          return `<div><strong>${k}:</strong> ${Array.isArray(v) ? v.join(', ') : v}</div>`;
        }).join('')}
        <div style="margin-top:6px;color:#9CA3AF;"><strong>Tags:</strong> ${tags.join(', ')}</div>
      </div>
    </details>
  `;
}

// ============================================================
// SELBSTFÜRSORGE
// ============================================================
function renderWBSelbstfuersorge(container) {
  container.innerHTML = `
    <div style="margin-bottom:16px;">
      <div style="font-size:16px;font-weight:800;color:#1F2937;margin-bottom:4px;">💚 Selbstfürsorge & Supervision</div>
      <p style="font-size:12px;color:#6B7280;">Werkzeuge für deine eigene professionelle Gesundheit.</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:16px;">
      <div class="card" style="cursor:pointer;" onclick="window.open('evaluationsboegen/selbstfuersorge-check.html','_blank')">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:44px;height:44px;background:#F0FDF4;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">💚</div>
            <div>
              <div style="font-size:14px;font-weight:700;">Selbstfürsorge-Check (ProQOL)</div>
              <div style="font-size:11px;color:#6B7280;">Vierteljährlich empfohlen</div>
            </div>
          </div>
          <p style="font-size:12px;color:#6B7280;line-height:1.5;">Compassion Satisfaction, Burnout & sekundäre Traumatisierung messen. 30 Items, 10 Minuten.</p>
        </div>
      </div>
      <div class="card" style="cursor:pointer;" onclick="window.open('evaluationsboegen/supervisionsvorbereitung.html','_blank')">
        <div class="card-body" style="padding:20px;">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
            <div style="width:44px;height:44px;background:#EDE9FE;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:22px;">📋</div>
            <div>
              <div style="font-size:14px;font-weight:700;">Supervisionsvorbereitung</div>
              <div style="font-size:11px;color:#6B7280;">Vor jeder Supervision</div>
            </div>
          </div>
          <p style="font-size:12px;color:#6B7280;line-height:1.5;">Strukturierte Fallreflexion mit Leitfragen für produktive Supervisionen.</p>
        </div>
      </div>
    </div>
  `;
}

// ============================================================
// PHASEN-NAVIGATION (5 Haupttabs mit Sub-Tabs)
// ============================================================
const PHASE_TABS = {
  fallakte: [
    { id: 'info', label: 'Aufnahme' },
    { id: 'genogramm', label: 'Genogramm' },
    { id: 'kontaktlog', label: 'Kontakte' }
  ],
  diagnostik: [
    { id: 'screening', label: 'Screening' },
    { id: 'staerken', label: 'Stärken' },
    { id: 'verhalten', label: 'Verhalten' }
  ],
  begleitung: [
    { id: 'dashboard', label: 'Heute' },
    { id: 'fallformulierung', label: '5P-Analyse' },
    { id: 'roadmap', label: 'Förderplan & Ziele' },
    { id: 'themen', label: 'Themen & Sitzungen' },
    { id: 'notizen', label: 'Notizen' }
  ],
  auswertung: [
    { id: 'hypothesen-tab', label: 'Hypothesen' },
    { id: 'treatment-tab', label: 'Verlauf' },
    { id: 'verlauf-tracker', label: 'Verlaufs-Tracker' },
    { id: 'berichte', label: 'Berichte' }
  ]
};

// Track current phase
APP.currentPhase = 'begleitung';

function getPhaseForTab(tabId) {
  for (const [phase, tabs] of Object.entries(PHASE_TABS)) {
    if (tabs.some(t => t.id === tabId)) return phase;
  }
  return 'begleitung';
}

function showPhase(phase, subTabId) {
  APP.currentPhase = phase;

  // Highlight sidebar phase item
  document.querySelectorAll('.sidebar-phase-item').forEach(t =>
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
  if (tab === 'verlauf-tracker') { renderVerlaufTracker(); renderRisikoTimeline(); }
  if (tab === 'kontaktlog') renderKontaktlog();
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

  // 6. Eltern-Infoblätter (👨‍👩‍👧 teal)
  if (typeof ELTERN_INFOBLAETTER !== 'undefined') {
    const eiFiles = new Map();
    for (const [themaId, blaetter] of Object.entries(ELTERN_INFOBLAETTER)) {
      for (const ei of blaetter) {
        if (!eiFiles.has(ei.datei)) {
          eiFiles.set(ei.datei, { id: 'ei-' + ei.datei, label: ei.titel, datei: ei.datei, typ: 'elterninfo' });
        }
      }
    }
    eiFiles.forEach(item => allItems.push(item));
  }

  // 7. Gesprächsleitfäden (🗣️ violett)
  if (typeof ELTERN_GESPRAECHSLEITFAEDEN !== 'undefined') {
    ELTERN_GESPRAECHSLEITFAEDEN.forEach(gl => {
      allItems.push({
        id: 'gl-' + gl.id,
        label: gl.titel,
        datei: gl.datei,
        typ: 'leitfaden_eltern',
        beschreibung: gl.beschreibung,
      });
    });
  }

  // 8. Evaluationsbögen (📊 violett)
  if (typeof EVALUATIONSBOEGEN !== 'undefined') {
    EVALUATIONSBOEGEN.forEach(ev => {
      allItems.push({
        id: 'ev-' + ev.id,
        label: ev.titel,
        datei: ev.datei,
        typ: 'evaluation',
        beschreibung: ev.beschreibung,
        frequenz: ev.frequenz,
      });
    });
  }

  // 9. Überweisungsleitfaden (🏥 blau)
  if (typeof UEBERWEISUNGSLEITFADEN !== 'undefined') {
    UEBERWEISUNGSLEITFADEN.forEach(ue => {
      allItems.push({
        id: 'ue-' + ue.id,
        label: ue.titel,
        datei: ue.datei,
        typ: 'ueberweisung',
      });
    });
  }

  // ── Ebenen-Zuordnung + Evidenz-Level ──
  allItems.forEach(item => {
    if (item.typ === 'arbeitsblatt' || item.typ === 'intervention') {
      item.ebene = 'praxis';
    } else if (item.typ === 'therapie') {
      item.ebene = 'leitfaden';
    } else if (item.typ === 'elterninfo' || item.typ === 'leitfaden_eltern') {
      item.ebene = 'elternarbeit';
    } else if (item.typ === 'evaluation') {
      item.ebene = 'evaluation';
    } else if (item.typ === 'ueberweisung') {
      item.ebene = 'vernetzung';
    } else {
      item.ebene = 'fachwissen'; // fachkraft + wiki
    }

    // Evidenz-Level zuweisen (1-3 Sterne)
    if (item.typ === 'therapie') item.evidenz = 3;
    else if (item.typ === 'fachkraft') item.evidenz = 3;
    else if (item.typ === 'wiki') item.evidenz = 2;
    else if (item.typ === 'intervention') item.evidenz = 2;
    else if (item.typ === 'leitfaden_eltern') item.evidenz = 3;
    else if (item.typ === 'elterninfo') item.evidenz = 2;
    else if (item.typ === 'evaluation') item.evidenz = 3;
    else if (item.typ === 'ueberweisung') item.evidenz = 2;
    else item.evidenz = 1;
  });

  // ── Favoriten laden ──
  const favKey = 'pathways_bibliothek_favoriten';
  let favoriten = [];
  try { favoriten = JSON.parse(localStorage.getItem(favKey) || '[]'); } catch(e) { favoriten = []; }

  // Favoriten-Status setzen
  allItems.forEach(item => { item.favorit = favoriten.includes(item.id); });

  // ── Filtern ──
  const q = bibliothekSuche.toLowerCase().trim();
  const filtered = allItems.filter(item => {
    if (bibliothekFilter === 'favoriten') {
      if (!item.favorit) return false;
    } else if (bibliothekFilter !== 'alle') {
      // Support both old typ-based and new ebene-based filtering
      if (item.ebene !== bibliothekFilter && item.typ !== bibliothekFilter) return false;
    }
    if (q) {
      const searchText = (item.label + ' ' + (item.datei || '') + ' ' + (item.themen || []).join(' ') + ' ' + (item.wikiId || '') + ' ' + (item.kategorie || '')).toLowerCase();
      if (!searchText.includes(q)) return false;
    }
    return true;
  });

  // Favoriten zuerst sortieren
  filtered.sort((a, b) => (b.favorit ? 1 : 0) - (a.favorit ? 1 : 0));

  // ── Typ-Konfiguration ──
  const typConfig = {
    fachkraft:       { icon: '📚', label: 'Fachwissen',         farbe: '#6C5CE7', bg: '#F3F1FE' },
    therapie:        { icon: '🎓', label: 'Sitzungsleitfaden',  farbe: '#00B894', bg: '#EEFBF7' },
    intervention:    { icon: '🎯', label: 'Aktivitäten',        farbe: '#FDCB6E', bg: '#FFF9EB' },
    arbeitsblatt:    { icon: '📝', label: 'Arbeitsblatt',       farbe: '#6366F1', bg: '#EEF2FF' },
    wiki:            { icon: '📖', label: 'Wissen',             farbe: '#0D9488', bg: '#F0FDFA' },
    elterninfo:      { icon: '👨‍👩‍👧', label: 'Eltern-Infoblatt',  farbe: '#0F766E', bg: '#F0FDFA' },
    leitfaden_eltern:{ icon: '🗣️', label: 'Gesprächsleitfaden', farbe: '#6D28D9', bg: '#F5F3FF' },
    evaluation:      { icon: '📊', label: 'Evaluationsbogen',   farbe: '#7C3AED', bg: '#F5F3FF' },
    ueberweisung:    { icon: '🏥', label: 'Überweisung',        farbe: '#1D4ED8', bg: '#EFF6FF' },
  };

  // ── Ebenen-Konfiguration ──
  const ebenenConfig = {
    praxis:       { icon: '🛠️', label: 'Praxis',       farbe: '#6366F1', desc: 'Arbeitsblätter & Aktivitäten für die Sitzung' },
    leitfaden:    { icon: '📋', label: 'Leitfaden',     farbe: '#00B894', desc: 'Sitzungsanleitungen für Therapeuten' },
    fachwissen:   { icon: '🎓', label: 'Fachwissen',    farbe: '#6C5CE7', desc: 'Hintergrundwissen, ICD-Codes, Fachpersonal-Material' },
    elternarbeit: { icon: '👨‍👩‍👧', label: 'Elternarbeit', farbe: '#0F766E', desc: 'Infoblätter, Leitfäden & Gesprächsvorbereitung für Eltern' },
    evaluation:   { icon: '📊', label: 'Evaluation',    farbe: '#7C3AED', desc: 'Standardisierte Bewertungsinstrumente' },
    vernetzung:   { icon: '🏥', label: 'Vernetzung',    farbe: '#1D4ED8', desc: 'Überweisungsleitfaden & Luxemburger Hilfsangebote' },
  };

  // ── Zähler pro Ebene ──
  const ebeneCounts = {};
  allItems.forEach(i => { ebeneCounts[i.ebene] = (ebeneCounts[i.ebene] || 0) + 1; });
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
        onfocus="this.style.borderColor='#2563EB'" onblur="this.style.borderColor='#E5E7EB'">
    </div>

    <!-- 3-Ebenen-Filter + Favoriten -->
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:20px;">
      <button onclick="bibliothekFilter='alle';renderBibliothek()"
        style="padding:8px 18px;border-radius:20px;border:2px solid ${bibliothekFilter === 'alle' ? '#2563EB' : '#E5E7EB'};background:${bibliothekFilter === 'alle' ? '#2563EB' : '#fff'};color:${bibliothekFilter === 'alle' ? '#fff' : '#374151'};font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
        Alle <span style="opacity:0.7;">${totalCount}</span>
      </button>
      <button onclick="bibliothekFilter='favoriten';renderBibliothek()"
        style="padding:8px 18px;border-radius:20px;border:2px solid ${bibliothekFilter === 'favoriten' ? '#F59E0B' : '#E5E7EB'};background:${bibliothekFilter === 'favoriten' ? '#F59E0B' : '#fff'};color:${bibliothekFilter === 'favoriten' ? '#fff' : '#374151'};font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
        ⭐ Favoriten <span style="opacity:0.7;">${favoriten.length}</span>
      </button>
      ${Object.entries(ebenenConfig).map(([ebene, cfg]) => {
        const count = ebeneCounts[ebene] || 0;
        if (count === 0) return '';
        const active = bibliothekFilter === ebene;
        return `<button onclick="bibliothekFilter='${ebene}';renderBibliothek()"
          style="padding:8px 18px;border-radius:20px;border:2px solid ${active ? cfg.farbe : '#E5E7EB'};background:${active ? cfg.farbe : '#fff'};color:${active ? '#fff' : '#374151'};font-size:13px;font-weight:600;cursor:pointer;transition:all 0.2s;">
          ${cfg.icon} ${cfg.label} <span style="opacity:0.7;">${count}</span>
        </button>`;
      }).join('')}
    </div>

    <!-- Ergebnis-Info -->
    ${q || bibliothekFilter !== 'alle' ? `<div style="font-size:12px;color:#6B7280;margin-bottom:12px;">${filtered.length} Ergebnis${filtered.length !== 1 ? 'se' : ''}${q ? ' für "' + escapeHtml(q) + '"' : ''}${bibliothekFilter !== 'alle' && ebenenConfig[bibliothekFilter] ? ' in ' + ebenenConfig[bibliothekFilter].label : ''}</div>` : ''}

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
    case 'elterninfo':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('eltern-infoblaetter/${item.datei}', '_blank')">Öffnen</button>`;
      break;
    case 'leitfaden_eltern':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('eltern-infoblaetter/${item.datei}', '_blank')">Öffnen</button>`;
      metaHtml = item.beschreibung ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${item.beschreibung}</div>` : '';
      break;
    case 'evaluation':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('evaluationsboegen/${item.datei}', '_blank')">Öffnen</button>`;
      metaHtml = item.frequenz ? `<div style="font-size:11px;color:#6B7280;margin-top:4px;">${item.frequenz}</div>` : '';
      break;
    case 'ueberweisung':
      actionHtml = `<button class="btn btn-sm" style="background:${cfg.farbe};color:#fff;border:none;border-radius:8px;padding:5px 14px;font-size:12px;cursor:pointer;" onclick="window.open('ueberweisungen/${item.datei}', '_blank')">Öffnen</button>`;
      break;
  }

  const ebene = item.ebene || 'praxis';
  const ebCfg = { praxis: { label: 'Praxis', icon: '🛠️' }, leitfaden: { label: 'Leitfaden', icon: '📋' }, fachwissen: { label: 'Fachwissen', icon: '🎓' }, elternarbeit: { label: 'Elternarbeit', icon: '👨‍👩‍👧' }, evaluation: { label: 'Evaluation', icon: '📊' }, vernetzung: { label: 'Vernetzung', icon: '🏥' } }[ebene];
  const fachpersonalBadge = item.typ === 'fachkraft' ? '<span style="font-size:9px;padding:2px 6px;border-radius:8px;background:#FEF3C7;color:#92400E;font-weight:600;margin-left:auto;">Fachpersonal</span>' : '';

  // Evidenz-Sterne (1-3)
  const evidenz = item.evidenz || 1;
  const evidenzLabels = { 1: 'Ergänzend', 2: 'Praxisbewährt', 3: 'Evidenzbasiert' };
  const sterne = '★'.repeat(evidenz) + '☆'.repeat(3 - evidenz);
  const evidenzHtml = `<span style="font-size:10px;color:#F59E0B;" title="${evidenzLabels[evidenz]}">${sterne}</span>`;

  // Favorit-Button
  const favStar = item.favorit ? '⭐' : '☆';
  const favBtnHtml = `<button onclick="event.stopPropagation();toggleBibliothekFavorit('${item.id}')" style="background:none;border:none;font-size:16px;cursor:pointer;padding:2px;line-height:1;" title="${item.favorit ? 'Favorit entfernen' : 'Als Favorit merken'}">${favStar}</button>`;

  return `
    <div class="bibliothek-karte" style="background:#fff;border:1px solid ${item.favorit ? '#FDE68A' : '#E5E7EB'};border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:8px;transition:box-shadow 0.2s,transform 0.2s;cursor:default;border-top:3px solid ${cfg.farbe};"
      onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)';this.style.transform='translateY(-2px)'"
      onmouseout="this.style.boxShadow='none';this.style.transform='none'">
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span style="font-size:18px;">${item.icon || cfg.icon}</span>
        <span style="font-size:10px;padding:2px 8px;border-radius:10px;background:${cfg.bg};color:${cfg.farbe};font-weight:600;">${cfg.label}</span>
        <span style="font-size:9px;padding:2px 6px;border-radius:8px;background:#F3F4F6;color:#6B7280;">${ebCfg.icon} ${ebCfg.label}</span>
        ${evidenzHtml}
        ${fachpersonalBadge}
        <span style="margin-left:auto;">${favBtnHtml}</span>
      </div>
      <div style="font-weight:600;font-size:14px;color:#1F2937;line-height:1.3;">${item.label}</div>
      ${metaHtml}
      <div style="margin-top:auto;padding-top:8px;display:flex;align-items:center;gap:8px;">
        ${actionHtml}
        <span style="font-size:10px;color:#9CA3AF;margin-left:auto;">${evidenzLabels[evidenz]}</span>
      </div>
    </div>
  `;
}

function filterBibliothek(query) {
  bibliothekSuche = query;
  renderBibliothek();
}

function toggleBibliothekFavorit(itemId) {
  const favKey = 'pathways_bibliothek_favoriten';
  let favoriten = [];
  try { favoriten = JSON.parse(localStorage.getItem(favKey) || '[]'); } catch(e) { favoriten = []; }

  const idx = favoriten.indexOf(itemId);
  if (idx >= 0) {
    favoriten.splice(idx, 1);
  } else {
    favoriten.push(itemId);
  }
  localStorage.setItem(favKey, JSON.stringify(favoriten));
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
    try { renderHypothesenZeitstrahl(APP.currentSchuelerId); } catch(e) { console.warn('Pathways:', e); }
  }
}

// ============================================================
// ANALYSE: Treatment-Response / Verlauf
// ============================================================
function renderTreatmentTab() {
  const container = document.getElementById('treatment-response-container');
  if (!container) return;
  renderTreatmentResponse(APP.currentSchuelerId);
  try { renderScreeningVerlauf(APP.currentSchuelerId); } catch(e) { console.warn('Pathways:', e); }
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
  const elternInfos = typeof ELTERN_INFOBLAETTER !== 'undefined' ? (ELTERN_INFOBLAETTER[themaId] || []) : [];

  if (blaetter.length === 0 && aktivitaeten.length === 0 && interventionen.length === 0 && !modul && !tmDatei && !fkDatei && elternInfos.length === 0) return '';

  const hasModul = modul || aktivitaeten.length > 0 || interventionen.length > 0 || tmDatei;
  const hasFachkraft = !!fkDatei;
  const hasEltern = elternInfos.length > 0;

  return `
    <div style="margin-bottom:20px;">
      <div class="panel-tabs" id="panel-tabs-${themaId}">
        <button class="panel-tab active" onclick="switchPanelTab('${themaId}','ab')">
          🛠️ Praxis
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Arbeitsblätter & Aktivitäten</span>
        </button>
        ${hasModul ? `<button class="panel-tab" onclick="switchPanelTab('${themaId}','tm')">
          📋 Leitfaden
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Sitzungsanleitung</span>
        </button>` : ''}
        ${hasFachkraft ? `<button class="panel-tab" onclick="switchPanelTab('${themaId}','fk')">
          🎓 Fachwissen
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Für Fachpersonal</span>
        </button>` : ''}
        ${hasEltern ? `<button class="panel-tab" onclick="switchPanelTab('${themaId}','el')">
          👨‍👩‍👧 Eltern
          <span style="font-size:10px;font-weight:400;opacity:0.65;display:block;margin-top:1px;">Eltern-Infoblätter</span>
        </button>` : ''}
      </div>

      <div id="pt-ab-${themaId}" class="panel-tab-content">
        ${blaetter.length > 0 ? `
        <div style="font-size:11px;font-weight:600;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">📋 Arbeitsblätter</div>
        ${blaetter.map(b => `
          <a href="arbeitsblatter/${b.datei}" target="_blank"
             style="display:flex;align-items:center;gap:10px;padding:9px 12px;margin-bottom:6px;
                    background:#EFF6FF;border:1.5px solid #BAE6FD;border-radius:6px;
                    text-decoration:none;color:#1D4ED8;font-size:12px;font-weight:600;">
            <span style="font-size:16px;">📋</span>
            <span style="flex:1;">${b.titel}</span>
            <span style="font-size:11px;opacity:0.7;">Öffnen →</span>
          </a>`).join('')}` : ''}
        ${interventionen.length > 0 ? `
        <div style="font-size:11px;font-weight:600;color:#F59E0B;text-transform:uppercase;letter-spacing:0.5px;margin:${blaetter.length > 0 ? '14px' : '0'} 0 8px;">🎯 Aktivitäten (${interventionen.length})</div>
        ${interventionen.slice(0, 5).map(iv => `
          <div style="padding:8px 12px;margin-bottom:6px;background:#FFFBEB;border:1.5px solid #FDE68A;border-radius:6px;">
            <div style="font-weight:600;font-size:12px;color:#92400E;">${iv.titel}</div>
            <div style="font-size:11px;color:#78716C;margin-top:2px;">📌 ${iv.ansatz || 'Allgemein'} · ⏱ ${iv.dauer || '—'} · ${iv.setting === 'gruppe' ? '👥 Gruppe' : '👤 Einzel'}</div>
            <div style="font-size:11px;color:#374151;margin-top:3px;">${iv.beschreibung}</div>
          </div>`).join('')}
        ${interventionen.length > 5 ? `<button class="btn btn-secondary btn-sm" onclick="renderAktivitaetenBrowser('${themaId}')" style="width:100%;margin-top:4px;">Alle ${interventionen.length} Aktivitäten anzeigen →</button>` : ''}
        ` : ''}
        ${blaetter.length === 0 && interventionen.length === 0 ? '<p style="color:var(--text-muted);font-size:12px;text-align:center;padding:14px 0;">Keine Praxis-Materialien verfügbar</p>' : ''}
      </div>

      ${hasModul ? `
      <div id="pt-tm-${themaId}" class="panel-tab-content" style="display:none;">
        ${tmDatei ? `
        <div style="background:#EEF2FF;border:1.5px solid #BFDBFE;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#4338CA;line-height:1.5;">
          <strong>Therapiemodul (Ebene 2)</strong> · Druckbare Sitzungsanleitung<br>
          <span style="opacity:0.75;">Detaillierter Leitfaden mit Timing, Skript &amp; Übungen für jede Sitzung.</span>
        </div>
        <a href="therapie-module/${tmDatei}" target="_blank"
           style="display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:10px;
                  background:#EEF2FF;border:1.5px solid #93C5FD;border-radius:8px;
                  text-decoration:none;color:#4338CA;font-size:13px;font-weight:600;">
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

      ${hasEltern ? `
      <div id="pt-el-${themaId}" class="panel-tab-content" style="display:none;">
        <div style="background:#F0FDFA;border:1.5px solid #99F6E4;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#0F766E;line-height:1.5;">
          <strong>Eltern-Infoblätter</strong> · Zum Ausdrucken und Mitgeben<br>
          <span style="opacity:0.75;">Professionelle Handouts für Elterngespräche zu diesem Thema.</span>
        </div>
        ${elternInfos.map(ei => `
          <a href="eltern-infoblaetter/${ei.datei}" target="_blank"
             style="display:flex;align-items:center;gap:10px;padding:12px 14px;margin-bottom:8px;
                    background:#F0FDFA;border:1.5px solid #99F6E4;border-radius:8px;
                    text-decoration:none;color:#0F766E;font-size:13px;font-weight:600;">
            <span style="font-size:20px;">👨‍👩‍👧</span>
            <span style="flex:1;">${ei.titel}</span>
            <span style="font-size:12px;opacity:0.7;">Öffnen →</span>
          </a>`).join('')}
      </div>` : ''}
    </div>`;
}

function renderTherapiemodul(modul, themaId) {
  const sitzungFarben = ['#4F46E5','#1D4ED8','#065F46','#92400E','#B91C1C','#0F766E'];

  let html = `<div style="background:#EEF2FF;border:1.5px solid #BFDBFE;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#4338CA;line-height:1.5;">
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
        html += `<span style="background:#EFF6FF;border:1px solid #BAE6FD;border-radius:5px;padding:3px 8px;font-size:10px;color:#1D4ED8;">👥 ${s.gruppenformat}</span>`;
      }
      if (s.materialien) {
        html += `<span style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:5px;padding:3px 8px;font-size:10px;color:#065F46;">📋 ${s.materialien.join(', ')}</span>`;
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
        <div style="font-size:10px;font-weight:700;color:#4F46E5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">📚 Psychoedukation</div>
        <div style="background:#FDF4FF;border:1.5px solid #E9D5FF;border-radius:6px;padding:10px 12px;">
          <div style="font-weight:600;font-size:12px;color:#6B21A8;margin-bottom:4px;">${s.psychoedukation.titel}</div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${s.psychoedukation.inhalt}</div>
        </div>
      </div>`;
    }

    if (s.interventionen && s.interventionen.length > 0) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">🧠 Interventionen</div>
        ${s.interventionen.map(i => `
        <div style="background:#EFF6FF;border:1.5px solid #BAE6FD;border-radius:6px;padding:10px 12px;margin-bottom:6px;">
          <div style="font-weight:600;font-size:12px;color:#1D4ED8;margin-bottom:2px;">${i.titel}</div>
          <div style="font-size:10px;color:#1D4ED8;margin-bottom:4px;">📌 ${i.ansatz} · ⏱ ${i.dauer}</div>
          <div style="font-size:12px;color:#374151;line-height:1.6;">${i.beschreibung}</div>
        </div>`).join('')}
      </div>`;
    }

    if (s.uebungen && s.uebungen.length > 0) {
      html += `<div style="margin-bottom:12px;">
        <div style="font-size:10px;font-weight:700;color:#065F46;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">🎯 Übungen</div>
        ${s.uebungen.map(u => `
        <div style="background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:6px;padding:10px 12px;margin-bottom:6px;">
          <div style="font-weight:600;font-size:12px;color:#065F46;margin-bottom:2px;">${u.titel} <span style="font-weight:400;opacity:0.7;">(${u.dauer})</span></div>
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
        <div style="font-size:10px;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">💭 Reflexion</div>
        <div style="background:#EFF6FF;border:1.5px solid #BAE6FD;border-radius:6px;padding:10px 12px;font-size:12px;color:#374151;">
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
  .badge.mat { border-color: #065F46; color: #065F46; }
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
    <span>Pathways · Sitzungsarbeitsblatt</span>
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

  let html = `<div style="background:#EEF2FF;border:1.5px solid #BFDBFE;border-radius:8px;padding:9px 12px;margin-bottom:14px;font-size:11px;color:#4338CA;line-height:1.5;">
    <strong>Therapiemodul (Ebene 2)</strong> · Vollständige Behandlungseinheit · 2–8 Stunden<br>
    <span style="opacity:0.75;">Für Schüler, bei denen dieses Thema ein zentraler Arbeitsbereich ist.</span>
  </div>`;

  if (psychoedukativ.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#4F46E5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">📚 Psychoedukation</div>
      ${psychoedukativ.map(i => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#FDF4FF;border:1.5px solid #E9D5FF;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#6B21A8;margin-bottom:2px;">${i.titel}</div>
          <div style="font-size:11px;color:#4F46E5;margin-bottom:4px;">📌 ${i.ansatz} · ⏱ ${i.dauer}</div>
          <div style="font-size:12px;color:#374151;margin-bottom:3px;">${i.beschreibung}</div>
          <div style="font-size:11px;color:#6B7280;font-style:italic;">Indikation: ${i.indikation}</div>
        </div>`).join('')}
    </div>`;
  }

  if (therapeutisch.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#4F46E5;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">🧠 Interventionen</div>
      ${therapeutisch.map(i => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#FDF4FF;border:1.5px solid #E9D5FF;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#6B21A8;margin-bottom:2px;">${i.titel}</div>
          <div style="font-size:11px;color:#4F46E5;margin-bottom:4px;">📌 ${i.ansatz} · ⏱ ${i.dauer}</div>
          <div style="font-size:12px;color:#374151;margin-bottom:3px;">${i.beschreibung}</div>
          <div style="font-size:11px;color:#6B7280;font-style:italic;">Indikation: ${i.indikation}</div>
        </div>`).join('')}
    </div>`;
  }

  if (uebungen.length > 0) {
    html += `<div style="margin-bottom:14px;">
      <div style="font-size:11px;font-weight:700;color:#065F46;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">🎯 Übungen</div>
      ${uebungen.map(a => `
        <div style="padding:10px 12px;margin-bottom:6px;background:#ECFDF5;border:1.5px solid #A7F3D0;border-radius:6px;">
          <div style="font-weight:600;font-size:12px;color:#065F46;margin-bottom:4px;">${a.titel} <span style="font-weight:400;opacity:0.7;">(${a.dauer})</span></div>
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
    <div style="font-size:11px;font-weight:700;color:#1D4ED8;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:7px;">💭 Reflexion</div>
    <div style="padding:10px 12px;background:#EFF6FF;border:1.5px solid #BAE6FD;border-radius:6px;font-size:12px;color:#374151;">
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

  // Abschluss-Kriterien: Mindestens 2 Sitzungen dokumentiert
  if (status === 'abgeschlossen') {
    const themaNotizen = DB.getNotizen(APP.currentSchuelerId).filter(n => n.kategorie === 'session' && n.themaId === themaId);
    if (themaNotizen.length < 2) {
      showToast(`⚠️ Thema kann erst abgeschlossen werden, wenn mindestens 2 Sitzungen dokumentiert sind (aktuell: ${themaNotizen.length}).`, 'warning', 5000);
      return;
    }

    // Outcome-Messung: SRS-Vergleich erste vs. letzte Sitzung
    const srsWerte = themaNotizen.filter(n => n.soap?.srs?.total != null).map(n => n.soap.srs.total);
    if (srsWerte.length >= 2) {
      const ersteHaelfte = srsWerte.slice(0, Math.ceil(srsWerte.length / 2));
      const zweiteHaelfte = srsWerte.slice(Math.floor(srsWerte.length / 2));
      const preAvg = ersteHaelfte.reduce((a, b) => a + b, 0) / ersteHaelfte.length;
      const postAvg = zweiteHaelfte.reduce((a, b) => a + b, 0) / zweiteHaelfte.length;
      const outcome = Math.round((postAvg - preAvg) * 10) / 10;
      // Outcome im Topic-Status speichern
      if (!s.topicOutcomes) s.topicOutcomes = {};
      s.topicOutcomes[themaId] = { preSrs: Math.round(preAvg * 10) / 10, postSrs: Math.round(postAvg * 10) / 10, diff: outcome, sitzungen: themaNotizen.length, datum: new Date().toISOString().split('T')[0] };
      DB.updateSchueler(APP.currentSchuelerId, { topicOutcomes: s.topicOutcomes });
      const outcomeIcon = outcome > 0 ? '📈' : outcome < 0 ? '📉' : '➡️';
      showToast(`${outcomeIcon} Outcome: SRS ${outcome > 0 ? '+' : ''}${outcome} (${Math.round(preAvg)}→${Math.round(postAvg)}/40)`, outcome >= 0 ? 'success' : 'warning', 5000);
    }
  }

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
APP.notizenFilter = 'alle';

function renderNotizen() {
  populateProtThemen();

  const alleNotizen = DB.getNotizen(APP.currentSchuelerId)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));

  const liste = document.getElementById('notizen-liste');

  // Zähler pro Kategorie
  const counts = { alle: alleNotizen.length };
  alleNotizen.forEach(n => {
    const k = n.kategorie || 'session';
    counts[k] = (counts[k] || 0) + 1;
  });

  // Filtern
  const aktFilter = APP.notizenFilter || 'alle';
  const notizen = aktFilter === 'alle' ? alleNotizen : alleNotizen.filter(n => (n.kategorie || 'session') === aktFilter);

  // Filter-Pills
  const filterKats = [
    { id: 'alle', label: 'Alle', icon: '' },
    { id: 'session', label: 'Sitzungen', icon: '💬' },
    { id: 'beobachtung', label: 'Beobachtungen', icon: '👁' },
    { id: 'wichtig', label: 'Wichtig', icon: '⚠️' },
    { id: 'elternkontakt', label: 'Eltern', icon: '📞' },
    { id: 'fortschritt', label: 'Fortschritt', icon: '📈' },
  ];

  let html = '<div class="notizen-filter-bar">';
  filterKats.forEach(f => {
    const count = counts[f.id] || 0;
    if (f.id !== 'alle' && count === 0) return;
    html += `<button class="notizen-filter-pill ${aktFilter === f.id ? 'active' : ''}" onclick="setNotizenFilter('${f.id}')">
      ${f.icon} ${f.label} <span class="notizen-filter-count">${count}</span>
    </button>`;
  });
  html += '</div>';

  if (notizen.length === 0 && alleNotizen.length === 0) {
    html += '<div style="text-align:center;padding:24px 16px;">'
      + '<div style="font-size:28px;margin-bottom:8px;">📝</div>'
      + '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:6px;">Noch keine Sitzungsprotokolle</div>'
      + '<div style="font-size:12px;color:var(--text-muted,#6B7280);line-height:1.5;">Nutze das SOAP-Format oben um die erste Sitzung zu dokumentieren.</div>'
      + '</div>';
  } else if (notizen.length === 0) {
    html += '<div style="text-align:center;padding:16px;color:#9CA3AF;font-size:13px;">Keine Einträge in dieser Kategorie.</div>';
  } else {
    html += notizen.map(n => renderNotizKarte(n)).join('');
  }

  liste.innerHTML = html;
}

function setNotizenFilter(filter) {
  APP.notizenFilter = filter;
  renderNotizen();
}

function renderNotizKarte(notiz) {
  const kat = NOTIZ_KATEGORIEN[notiz.kategorie] || NOTIZ_KATEGORIEN.session;
  const soap = notiz.soap;
  const hasSoap = soap && (soap.subjektiv || soap.objektiv || soap.assessment || soap.plan);
  const srsTotal = soap && soap.srs ? soap.srs.total : null;
  const orsTotal = soap && soap.ors ? soap.ors.total : null;

  // ORS Badge
  let orsBadge = '';
  if (orsTotal !== null && orsTotal !== undefined) {
    const orsClass = orsTotal >= 28 ? 'gut' : orsTotal >= 20 ? 'mittel' : 'schlecht';
    orsBadge = `<span class="notiz-srs-badge ${orsClass}" style="border-color:#3B82F6;">ORS ${orsTotal}/40</span>`;
  }

  // SRS Badge
  let srsBadge = '';
  if (srsTotal !== null && srsTotal !== undefined) {
    const srsClass = srsTotal >= 30 ? 'gut' : srsTotal >= 25 ? 'mittel' : 'schlecht';
    srsBadge = `<span class="notiz-srs-badge ${srsClass}">SRS ${srsTotal}/40</span>`;
  }

  // Thema-Link
  let themaLink = '';
  if (notiz.themaId) {
    let themaLabel = notiz.themaId;
    if (soap && soap.themaLabel) themaLabel = soap.themaLabel;
    else {
      for (const k of THEMEN_KATEGORIEN) {
        const t = k.themen.find(th => th.id === notiz.themaId);
        if (t) { themaLabel = t.titel; break; }
      }
    }
    themaLink = `<span class="notiz-thema-link" onclick="openRoadmapThema('${notiz.themaId}')">📌 ${themaLabel}</span>`;
  }

  // SOAP Preview (expandierbar)
  let soapPreview = '';
  if (hasSoap) {
    const fields = [
      { key: 'subjektiv', letter: 'S', label: 's', val: soap.subjektiv },
      { key: 'objektiv', letter: 'O', label: 'o', val: soap.objektiv },
      { key: 'assessment', letter: 'A', label: 'a', val: soap.assessment },
      { key: 'plan', letter: 'P', label: 'p', val: soap.plan },
    ].filter(f => f.val);

    if (fields.length > 0) {
      soapPreview = '<div class="notiz-soap-preview">';
      fields.forEach(f => {
        soapPreview += `<div class="notiz-soap-field" onclick="this.classList.toggle('expanded')">
          <div class="notiz-soap-field-label ${f.label}">${f.letter}</div>
          <div class="notiz-soap-field-text">${escapeHtml(f.val)}</div>
        </div>`;
      });
      soapPreview += '</div>';
    }
  }

  // Meta-Zeile für SOAP-Notizen
  let metaLine = '';
  if (soap && soap.dauer) {
    const parts = [];
    if (soap.dauer) parts.push(`⏱ ${soap.dauer} Min.`);
    if (soap.setting) parts.push(`📍 ${soap.setting}`);
    if (soap.stimmung) {
      const stMap = { 'sehr-schlecht': '😫', 'schlecht': '😞', 'neutral': '😐', 'gut': '🙂', 'sehr-gut': '😄' };
      parts.push(stMap[soap.stimmung] || soap.stimmung);
    }
    if (soap.pvt) {
      const pvtMap = { safe: '🟢', activated: '🟡', frozen: '🟣' };
      parts.push(pvtMap[soap.pvt] || soap.pvt);
    }
    metaLine = `<div style="font-size:11px;color:#9CA3AF;margin-top:4px;">${parts.join(' · ')}</div>`;
  }

  // Safety-Flag: Keyword-Detection
  const safetyKeywords = /suizid|selbstverletz|selbstmord|umbringen|sterben.*will|nicht.*leben|missbrauch|misshandlung|gewalt|vergewaltig|schlag|übergriff/i;
  const inhaltText = (notiz.inhalt || '') + (soap ? [soap.subjektiv, soap.objektiv, soap.assessment, soap.plan].filter(Boolean).join(' ') : '');
  const hatSafetyFlag = safetyKeywords.test(inhaltText);
  const safetyBadge = hatSafetyFlag ? '<span style="font-size:11px;padding:1px 6px;border-radius:8px;background:#FEF2F2;color:#DC2626;border:1px solid #FECACA;font-weight:600;">🚨 Safety</span>' : '';
  const safetyBanner = hatSafetyFlag ? '<div style="padding:4px 8px;background:#FEF2F2;border:1px solid #FECACA;border-radius:4px;font-size:11px;color:#991B1B;margin-top:4px;">⚠️ Safety-relevanter Inhalt erkannt — <a href="#" onclick="showPhase(\'analyse\');setTimeout(()=>showSubTab(\'verlauf-tracker\'),100);return false;" style="color:#DC2626;font-weight:600;">Risiko-Check empfohlen</a></div>' : '';

  return `
    <div class="notiz-karte-v2" style="border-left-color:${hatSafetyFlag ? '#DC2626' : kat.farbe};">
      <div class="notiz-karte-v2-header">
        <span class="notiz-badge" style="background:${kat.farbe}22;color:${kat.farbe};">${renderIcon(kat.icon)} ${kat.label}</span>
        ${themaLink}
        ${orsBadge}
        ${srsBadge}
        ${safetyBadge}
        <span class="notiz-datum" style="margin-left:auto;">${formatDatum(notiz.datum)}</span>
        <button class="notiz-delete" onclick="deleteNotiz('${notiz.id}')" style="margin-left:4px;">🗑</button>
      </div>
      ${hasSoap ? soapPreview : `<div class="notiz-inhalt" style="font-size:13px;line-height:1.5;color:#374151;margin-top:6px;">${escapeHtml(notiz.inhalt)}</div>`}
      ${metaLine}
      ${safetyBanner}
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
    // Reset wizard to step 1
    soapWizardGo(1);
  }
}

// ── SOAP Wizard Navigation ──
APP.soapWizardStep = 1;

function soapWizardGo(step) {
  const totalSteps = 4;
  if (step < 1 || step > totalSteps) return;

  // Wenn Step 3: Risiko-Check initialisieren
  if (step === 3 && typeof renderRisikoCheck === 'function') renderRisikoCheck();
  // Wenn Step 4: Vorschau generieren
  if (step === 4) renderSoapVorschau();

  // Alle Steps ausblenden
  for (let i = 1; i <= totalSteps; i++) {
    const el = document.getElementById(`soap-step-${i}`);
    if (el) el.style.display = i === step ? '' : 'none';
  }

  // Stepper-Dots aktualisieren
  document.querySelectorAll('.soap-step-dot').forEach(dot => {
    const dotStep = parseInt(dot.dataset.step);
    dot.classList.remove('active', 'done');
    if (dotStep === step) dot.classList.add('active');
    else if (dotStep < step) dot.classList.add('done');
  });

  // Stepper-Lines aktualisieren
  for (let i = 1; i < totalSteps; i++) {
    const line = document.getElementById(`soap-line-${i}`);
    if (line) {
      line.classList.toggle('done', i < step);
    }
  }

  APP.soapWizardStep = step;
}

function renderSoapVorschau() {
  const container = document.getElementById('soap-vorschau');
  if (!container) return;

  const datum = document.getElementById('prot-datum')?.value || '—';
  const dauer = document.getElementById('prot-dauer')?.value || '—';
  const setting = document.getElementById('prot-setting')?.value || '—';
  const nr = document.getElementById('prot-nr')?.value || '';
  const stimmung = APP.protStimmung || '';
  const pvt = APP.protPVT || '';
  const themaId = document.getElementById('prot-thema-id')?.value || '';
  const subjektiv = document.getElementById('prot-subjektiv')?.value || '';
  const objektiv = document.getElementById('prot-objektiv')?.value || '';
  const assessment = document.getElementById('prot-assessment')?.value || '';
  const plan = document.getElementById('prot-plan')?.value || '';
  const materialien = document.getElementById('prot-materialien')?.value || '';
  const srsTotal = (parseInt(document.getElementById('srs-relationship')?.value || 0)) +
    (parseInt(document.getElementById('srs-goals')?.value || 0)) +
    (parseInt(document.getElementById('srs-approach')?.value || 0)) +
    (parseInt(document.getElementById('srs-overall')?.value || 0));
  const orsTotal = (parseInt(document.getElementById('ors-individual')?.value || 0)) +
    (parseInt(document.getElementById('ors-interpersonal')?.value || 0)) +
    (parseInt(document.getElementById('ors-social')?.value || 0)) +
    (parseInt(document.getElementById('ors-overall')?.value || 0));

  const engagement = document.getElementById('prot-engagement')?.value || '';
  const interventionstyp = document.getElementById('prot-interventionstyp')?.value || '';
  const externeEreignisse = [...document.querySelectorAll('.ext-ereignis-cb:checked')].map(cb => cb.value);
  const pvtEnde = APP._selectedPVTEnde || '';

  const stimmungMap = { 'sehr-schlecht': '😫 Sehr schlecht', 'schlecht': '😞 Schlecht', 'neutral': '😐 Neutral', 'gut': '🙂 Gut', 'sehr-gut': '😄 Sehr gut' };
  const pvtMap = { safe: '🟢 Sicher', activated: '🟡 Angespannt', frozen: '🟣 Eingefroren' };
  const interventionsMap = { gespraechsfuehrung: 'Gesprächsführung', psychoedukation: 'Psychoedukation', rollenspiel: 'Rollenspiel', achtsamkeit: 'Achtsamkeit/Grounding', kreativ: 'Kreativ/Kunst', outdoor: 'Outdoor/Erlebnis', sozialkompetenz: 'Sozialkompetenz', krisenintervention: 'Krisenintervention', arbeitsblatt: 'Arbeitsblatt/Übung', elternarbeit: 'Elterngespräch', motivational: 'Motivational Interviewing', verhaltensaktivierung: 'Verhaltensaktivierung' };
  const ereignisMap = { 'streit-zuhause': 'Streit zu Hause', 'schulprobleme': 'Schulprobleme', 'positiv': 'Positives Erlebnis', 'krise': 'Krise/Notfall', 'veraenderung': 'Veränderung', 'krankheit': 'Krankheit', 'keine': 'Keine besonderen' };

  let themaLabel = '';
  if (themaId) {
    for (const kat of THEMEN_KATEGORIEN) {
      const t = kat.themen.find(th => th.id === themaId);
      if (t) { themaLabel = t.titel; break; }
    }
  }

  const srsColor = srsTotal >= 30 ? '#059669' : srsTotal >= 25 ? '#D97706' : '#DC2626';
  const orsColor = orsTotal >= 28 ? '#059669' : orsTotal >= 20 ? '#D97706' : '#DC2626';

  container.innerHTML = `
    <div class="soap-vorschau">
      <div style="font-size:15px;font-weight:700;color:#1F2937;margin-bottom:16px;">Zusammenfassung</div>

      <div class="soap-vorschau-meta">
        <div class="soap-vorschau-meta-item">📅 ${datum}</div>
        <div class="soap-vorschau-meta-item">⏱ ${dauer} Min.</div>
        <div class="soap-vorschau-meta-item">📍 ${setting}</div>
        ${nr ? `<div class="soap-vorschau-meta-item">#${nr}</div>` : ''}
        ${stimmung ? `<div class="soap-vorschau-meta-item">${stimmungMap[stimmung] || stimmung}</div>` : ''}
        ${pvt ? `<div class="soap-vorschau-meta-item">${pvtMap[pvt] || pvt}</div>` : ''}
        ${themaLabel ? `<div class="soap-vorschau-meta-item">📌 ${themaLabel}</div>` : ''}
        <div class="soap-vorschau-meta-item" style="color:${orsColor};font-weight:700;">📈 ORS: ${orsTotal}/40</div>
        <div class="soap-vorschau-meta-item" style="color:${srsColor};font-weight:700;">📊 SRS: ${srsTotal}/40</div>
        ${engagement ? `<div class="soap-vorschau-meta-item">🎯 Engagement: ${engagement}/10</div>` : ''}
        ${interventionstyp ? `<div class="soap-vorschau-meta-item">🛠️ ${interventionsMap[interventionstyp] || interventionstyp}</div>` : ''}
        ${externeEreignisse.length > 0 ? `<div class="soap-vorschau-meta-item">📌 ${externeEreignisse.map(e => ereignisMap[e] || e).join(', ')}</div>` : ''}
        ${pvtEnde ? `<div class="soap-vorschau-meta-item">🧠 PVT-Ende: ${pvtMap[pvtEnde] || pvtEnde}</div>` : ''}
      </div>

      ${subjektiv ? `<div class="soap-vorschau-section">
        <div class="soap-vorschau-label" style="color:#2563EB;">S — Subjektiv</div>
        <div class="soap-vorschau-value">${escapeHtml(subjektiv)}</div>
      </div>` : ''}
      ${objektiv ? `<div class="soap-vorschau-section">
        <div class="soap-vorschau-label" style="color:#6366F1;">O — Objektiv</div>
        <div class="soap-vorschau-value">${escapeHtml(objektiv)}</div>
      </div>` : ''}
      ${assessment ? `<div class="soap-vorschau-section">
        <div class="soap-vorschau-label" style="color:#D97706;">A — Assessment</div>
        <div class="soap-vorschau-value">${escapeHtml(assessment)}</div>
      </div>` : ''}
      ${plan ? `<div class="soap-vorschau-section">
        <div class="soap-vorschau-label" style="color:#059669;">P — Plan</div>
        <div class="soap-vorschau-value">${escapeHtml(plan)}</div>
      </div>` : ''}
      ${materialien ? `<div class="soap-vorschau-section">
        <div class="soap-vorschau-label">Materialien</div>
        <div class="soap-vorschau-value">${escapeHtml(materialien)}</div>
      </div>` : ''}

      ${!subjektiv && !objektiv && !assessment && !plan ? `
        <div style="text-align:center;padding:20px;color:#9CA3AF;">
          <div style="font-size:24px;margin-bottom:8px;">⚠️</div>
          Noch keine SOAP-Felder ausgefüllt. Gehe zurück zu Schritt 2.
        </div>` : ''}
    </div>`;
}

// ---- SOAP-Vorlagen ----
const SOAP_VORLAGEN = {
  erstgespraech: {
    subjektiv: '• Anlass der Vorstellung:\n• Aktuelle Situation aus Sicht des Jugendlichen:\n• Erwartungen an die Zusammenarbeit:\n• Bisherige Erfahrungen mit Beratung/Therapie:',
    objektiv: '• Erster Eindruck (Erscheinung, Kontaktverhalten):\n• Emotionale Grundstimmung:\n• Kooperationsbereitschaft:\n• Sprache und Kommunikation:',
    assessment: '• Vorläufige Einschätzung der Problemlage:\n• Risikobewertung (Selbst-/Fremdgefährdung):\n• Ressourcen und Schutzfaktoren:\n• Dringlichkeit:',
    plan: '• Vereinbarte Frequenz der Sitzungen:\n• Screening durchführen: ☐\n• Anamnese vervollständigen: ☐\n• Nächster Termin:\n• Ggf. Überweisung an:',
    setting: 'Einzelgespräch',
  },
  regulaer: {
    subjektiv: '• Wie geht es dir seit letztem Mal?\n• Was ist seit der letzten Sitzung passiert?\n• Gibt es aktuelle Belastungen?\n• Was möchtest du heute besprechen?',
    objektiv: '• Stimmung heute im Vergleich zur letzten Sitzung:\n• Beobachtetes Verhalten:\n• Reaktion auf Interventionen:\n• Nonverbale Signale:',
    assessment: '• Fortschritt in Bezug auf Ziele:\n• Wirksamkeit der eingesetzten Methoden:\n• Veränderungen im Gesamtbild:\n• Anpassungsbedarf:',
    plan: '• Vereinbarung für die Woche:\n• Hausaufgabe/Übung:\n• Thema nächste Sitzung:\n• Nächster Termin:',
    setting: 'Einzelgespräch',
  },
  krise: {
    subjektiv: '• Auslöser der Krise:\n• Aktuelle Gefühlslage:\n• Suizidalität abgeklärt: ☐ Ja ☐ Nein\n• Selbstverletzung: ☐ Ja ☐ Nein\n• Sicherheitsgefühl (0-10):',
    objektiv: '• Affektlage (aufgelöst/dissoziiert/aggressiv/...):\n• Vitalzeichen (Zittern, Hyperventilation, ...):\n• Realitätsprüfung:\n• Ansprechbarkeit/Kooperation:',
    assessment: '• Risikobewertung: ☐ Niedrig ☐ Mittel ☐ Hoch ☐ Akut\n• Stabilisierung erreicht: ☐ Ja ☐ Teilweise ☐ Nein\n• Auslösende Faktoren:\n• Schutzfaktoren vorhanden:',
    plan: '• Sicherheitsplan erstellt/aktualisiert: ☐\n• Eltern/Erziehungsberechtigte informiert: ☐\n• Fachstelle kontaktiert: ☐\n• Engmaschiger Folgetermin:\n• Notfallnummern besprochen: ☐',
    setting: 'Krisenintervention',
  },
  eltern: {
    subjektiv: '• Anliegen der Eltern:\n• Beobachtungen zu Hause:\n• Sorgen und Wünsche:\n• Veränderungen seit letztem Gespräch:',
    objektiv: '• Eltern-Kind-Dynamik:\n• Kooperationsbereitschaft der Eltern:\n• Übereinstimmung mit Sicht des Jugendlichen:\n• Familienressourcen:',
    assessment: '• Einschätzung der familiären Situation:\n• Erziehungskompetenzen:\n• Unterstützungsbedarf:\n• Risiko- und Schutzfaktoren im Umfeld:',
    plan: '• Vereinbarungen mit den Eltern:\n• Empfehlungen für zu Hause:\n• Nächstes Elterngespräch:\n• Ggf. Familienberatung empfohlen: ☐',
    setting: 'Elterngespräch',
  },
  abschluss: {
    subjektiv: '• Rückblick des Jugendlichen auf die Zusammenarbeit:\n• Was hat geholfen?\n• Was hätte besser sein können?\n• Wie fühlt sich der Abschluss an?',
    objektiv: '• Veränderungen seit Beginn der Begleitung:\n• Erreichung der vereinbarten Ziele:\n• Aktuelle Stabilität:\n• Verbleibende Risikofaktoren:',
    assessment: '• Gesamteinschätzung des Verlaufs:\n• Prognose:\n• Verbleibender Unterstützungsbedarf:\n• Empfehlung für weiterführende Maßnahmen:',
    plan: '• Nachsorge-Vereinbarung:\n• Notfallplan bei Rückfall:\n• Übergabe an: ☐ Niemand ☐ Fachstelle ☐ Therapeut\n• Abschlussbericht erstellt: ☐',
    setting: 'Einzelgespräch',
  },
  verlauf: {
    subjektiv: '• Allgemeines Befinden:\n• Veränderungen bemerkt?\n• Zufriedenheit mit der Arbeit (0-10):',
    objektiv: '• Vergleich mit Baseline-Screening:\n• Verhaltensbeobachtungen:\n• Wohlbefinden-Trend:',
    assessment: '• Zielerreichung:\n• Anpassung der Ziele notwendig: ☐\n• Phase im Förderplan:\n• Wirksamkeit der Interventionen:',
    plan: '• Ziele anpassen: ☐\n• Neue Themen aufnehmen: ☐\n• Re-Screening durchführen: ☐\n• Nächste Verlaufskontrolle in ___ Wochen',
    setting: 'Einzelgespräch',
  },
};

function applySoapVorlage(vorlageId) {
  if (!vorlageId) return;
  const v = SOAP_VORLAGEN[vorlageId];
  if (!v) return;

  const s = document.getElementById('prot-subjektiv');
  const o = document.getElementById('prot-objektiv');
  const a = document.getElementById('prot-assessment');
  const p = document.getElementById('prot-plan');

  // Only fill empty fields to not overwrite user input
  if (s && !s.value.trim()) s.value = v.subjektiv;
  if (o && !o.value.trim()) o.value = v.objektiv;
  if (a && !a.value.trim()) a.value = v.assessment;
  if (p && !p.value.trim()) p.value = v.plan;

  // Set setting if specified
  if (v.setting) {
    const sel = document.getElementById('prot-setting');
    if (sel) {
      for (const opt of sel.options) {
        if (opt.text === v.setting) { sel.value = opt.value; break; }
      }
    }
  }

  showToast(`Vorlage "${vorlageId}" geladen`, 'success');
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
  const orsI = parseInt(document.getElementById('ors-individual')?.value || 0);
  const orsIP = parseInt(document.getElementById('ors-interpersonal')?.value || 0);
  const orsS = parseInt(document.getElementById('ors-social')?.value || 0);
  const orsO = parseInt(document.getElementById('ors-overall')?.value || 0);
  const orsTotal = orsI + orsIP + orsS + orsO;

  if (!datum) { showToast('Datum ist ein Pflichtfeld', 'error'); return; }
  if (!subjektiv && !objektiv && !assessment && !plan) {
    showToast('Bitte mindestens ein SOAP-Feld ausfüllen', 'error'); return;
  }

  // C-SSRS Schweregrad-Prüfung: Bei Stufe 3+ → Sicherheitsplan muss angehakt sein
  const cssrsSchweregradEl = document.querySelector('input[name="cssrs-schweregrad"]:checked');
  const cssrsSchweregrad = cssrsSchweregradEl ? parseInt(cssrsSchweregradEl.value) : 0;
  if (cssrsSchweregrad >= 3) {
    const sicherheitsplanOk = document.getElementById('soap-sicherheitsplan-check')?.checked;
    if (!sicherheitsplanOk) {
      showToast('⚠️ Bei Suizidalitäts-Schweregrad ≥ 3 muss der Sicherheitsplan dokumentiert werden!', 'error');
      soapWizardGo(3); // Zurück zu Step 3
      return;
    }
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
    `\n📈 ORS: ${orsTotal}/40 (Persönlich: ${orsI}, Beziehungen: ${orsIP}, Sozial: ${orsS}, Gesamt: ${orsO})`,
    `\n📊 SRS: ${srsTotal}/40 (Beziehung: ${srsR}, Ziele: ${srsG}, Ansatz: ${srsA}, Gesamt: ${srsO})`,
  ].filter(Boolean).join('');

  DB.createNotiz({
    schuelerId: APP.currentSchuelerId,
    datum,
    inhalt: text,
    kategorie: 'session',
    themaId: themaId || null,
    soap: { subjektiv, objektiv, assessment, plan, stimmung, setting, dauer, nr, materialien, themaId, themaLabel, pvt: pvtState, ors: { individual: orsI, interpersonal: orsIP, social: orsS, overall: orsO, total: orsTotal }, srs: { relationship: srsR, goals: srsG, approach: srsA, overall: srsO, total: srsTotal },
      engagement: parseInt(document.getElementById('prot-engagement')?.value) || null,
      interventionstyp: document.getElementById('prot-interventionstyp')?.value || null,
      externeEreignisse: [...document.querySelectorAll('.ext-ereignis-cb:checked')].map(cb => cb.value),
      pvtEnde: APP._selectedPVTEnde || null,
      cssrsSchweregrad: cssrsSchweregrad || null,
      sicherheitsplanDokumentiert: cssrsSchweregrad >= 3 ? !!document.getElementById('soap-sicherheitsplan-check')?.checked : null,
      supervisorInformiert: cssrsSchweregrad >= 3 ? !!document.getElementById('soap-supervisor-check')?.checked : null,
    },
  });

  // Auto-Update Risiko-Monitor wenn C-SSRS Schweregrad gesetzt
  if (cssrsSchweregrad >= 3) {
    const risikoWerte = getRisikoFromForm();
    // Falls C-SSRS Items noch nicht auf rot stehen, automatisch setzen
    if (cssrsSchweregrad >= 4) risikoWerte.cssrs_absicht = 'rot';
    if (cssrsSchweregrad >= 3) risikoWerte.cssrs_plan = 'rot';
    if (cssrsSchweregrad >= 2) risikoWerte.cssrs_gedanken = 'rot';
    DB.addRisiko(APP.currentSchuelerId, risikoWerte);
    showToast('🛡️ Risiko-Monitor automatisch aktualisiert (C-SSRS Stufe ' + cssrsSchweregrad + ')', 'warning', 5000);
  }

  // Also log wellbeing if mood was set
  if (stimmung) {
    const moodScore = { 'sehr-schlecht': 2, 'schlecht': 4, 'neutral': 5, 'gut': 7, 'sehr-gut': 9 };
    DB.addWohlbefinden(APP.currentSchuelerId, moodScore[stimmung] || 5, `Sitzung: ${themaLabel || setting}`);
  }

  // Save risk assessment if any non-green values
  if (typeof saveRisikoFromProtokoll === 'function') {
    saveRisikoFromProtokoll();
  }

  // Reset form
  ['prot-subjektiv','prot-objektiv','prot-assessment','prot-plan','prot-materialien'].forEach(id => {
    document.getElementById(id).value = '';
  });
  document.getElementById('prot-thema-id').value = '';
  document.getElementById('prot-nr').value = '';
  APP.protStimmung = null;
  document.querySelectorAll('.prot-stimmung-btn').forEach(b => b.classList.remove('selected'));

  // Reset PVT (Start + Ende)
  APP.protPVT = null;
  APP._selectedPVTEnde = null;
  document.querySelectorAll('.pvt-card').forEach(b => b.classList.remove('selected'));
  const pvtEmpf = document.getElementById('pvt-empfehlung');
  if (pvtEmpf) pvtEmpf.style.display = 'none';
  const pvtEndeFb = document.getElementById('pvt-ende-feedback');
  if (pvtEndeFb) pvtEndeFb.style.display = 'none';

  // Reset neue Felder (Engagement, Interventionstyp, Externe Ereignisse)
  const engSlider = document.getElementById('prot-engagement');
  if (engSlider) { engSlider.value = 5; }
  const engVal = document.getElementById('prot-engagement-val');
  if (engVal) engVal.textContent = '5';
  const intTyp = document.getElementById('prot-interventionstyp');
  if (intTyp) intTyp.value = '';
  document.querySelectorAll('.ext-ereignis-cb').forEach(cb => cb.checked = false);

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
  box.innerHTML = '<div style="font-size:11px;padding:10px 12px;background:#F0F7FF;border-radius:8px;border-left:3px solid #2563EB;margin-bottom:6px;line-height:1.6;">'
    + '<div style="font-weight:600;color:#2563EB;margin-bottom:4px;">' + data.label + '</div>'
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
      <div style="background:#EFF6FF;border-radius:10px;padding:14px;margin-bottom:12px;border-left:4px solid #2563EB;">
        <div style="font-weight:600;color:#1D4ED8;font-size:13px;margin-bottom:6px;">Was ist das?</div>
        <div style="font-size:13px;color:#374151;line-height:1.6;">${data.was}</div>
      </div>
      <div style="background:#ECFDF5;border-radius:10px;padding:14px;margin-bottom:12px;border-left:4px solid #10B981;">
        <div style="font-weight:600;color:#065F46;font-size:13px;margin-bottom:6px;">Warum dieses Tool?</div>
        <div style="font-size:13px;color:#374151;line-height:1.6;">${data.warum}</div>
      </div>
      <div style="background:#FFF7ED;border-radius:10px;padding:14px;margin-bottom:12px;border-left:4px solid #F97316;">
        <div style="font-weight:600;color:#9A3412;font-size:13px;margin-bottom:6px;">Evidenz</div>
        <div style="font-size:13px;color:#374151;line-height:1.6;">${data.evidenz}</div>
      </div>
      <div style="background:#EEF2FF;border-radius:10px;padding:14px;border-left:4px solid #6366F1;">
        <div style="font-weight:600;color:#4338CA;font-size:13px;margin-bottom:6px;">Quelle</div>
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
    + (h.zweck ? '<div style="background:#EFF6FF;border-radius:6px;padding:8px 10px;margin-bottom:8px;color:#1D4ED8;font-size:12px;"><strong>Zweck:</strong> ' + h.zweck + '</div>' : '')
    + (h.abgrenzung ? '<div style="color:#D97706;font-weight:600;margin-bottom:8px;font-size:12px;">' + h.abgrenzung + '</div>' : '')
    + (h.vorgehen ? '<div style="background:#ECFDF5;border-radius:6px;padding:8px 10px;margin-bottom:8px;color:#065F46;font-size:12px;white-space:pre-line;">' + h.vorgehen + '</div>' : '')
    + '<div style="margin-bottom:4px;font-weight:600;color:#6B7280;">Beispiele:</div>'
    + '<ul style="margin:0;padding-left:16px;color:#374151;">' + h.beispiele.map(b => '<li>' + b + '</li>').join('') + '</ul>'
    + (h.tipp ? '<div style="margin-top:8px;color:#2563EB;">' + h.tipp + '</div>' : '')
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
    safe: { farbe: '#059669', bg: '#ECFDF5', border: '#A7F3D0',
      text: '✅ <strong>Tiefenarbeit möglich.</strong> Starte mit dem geplanten Thema. Der Jugendliche ist reguliert und kontaktfähig.' },
    activated: { farbe: '#D97706', bg: '#FFFBEB', border: '#FDE68A',
      text: '⚠️ <strong>Erst regulieren.</strong> Starte mit Atemübungen oder Körperübungen. Kein neues Material heute — Stabilisierung hat Vorrang.' },
    frozen: { farbe: '#4F46E5', bg: '#EEF2FF', border: '#BFDBFE',
      text: '🟣 <strong>Nur Grounding heute.</strong> 5-4-3-2-1 Übung, sanfte Bewegung, warmes Getränk. Die Allianz halten ist das Ziel dieser Sitzung.' },
  };
  const m = map[APP.protPVT];
  empf.style.display = 'block';
  empf.style.background = m.bg;
  empf.style.borderColor = m.border;
  empf.style.color = m.farbe;
  empf.innerHTML = m.text;
}

// ---- PVT Ende (Post-Session) ----
function selectPVTEnde(btn) {
  document.querySelectorAll('#pvt-ende-cards .pvt-card').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
  APP._selectedPVTEnde = btn.dataset.val;

  const fb = document.getElementById('pvt-ende-feedback');
  if (!fb) return;
  const pvtStart = APP.protPVT;
  const pvtEnde = btn.dataset.val;
  const states = { safe: 0, activated: 1, frozen: 2 };
  const labels = { safe: 'Sicher & offen', activated: 'Angespannt', frozen: 'Eingefroren' };

  if (pvtStart && pvtEnde) {
    const delta = states[pvtStart] - states[pvtEnde];
    let text, bg, border, color;
    if (delta > 0) {
      text = `✅ <strong>Regulation gelungen.</strong> ${labels[pvtStart]} → ${labels[pvtEnde]}. Die Sitzung hat den Jugendlichen in einen sichereren Zustand gebracht.`;
      bg = '#ECFDF5'; border = '#A7F3D0'; color = '#059669';
    } else if (delta === 0) {
      text = `➡️ <strong>Zustand stabil.</strong> ${labels[pvtStart]} → ${labels[pvtEnde]}. Keine Veränderung des Regulationszustands.`;
      bg = '#F3F4F6'; border = '#D1D5DB'; color = '#4B5563';
    } else {
      text = `⚠️ <strong>Dysregulation beachten.</strong> ${labels[pvtStart]} → ${labels[pvtEnde]}. Der Jugendliche verlässt die Sitzung weniger reguliert — Nachbetreuung prüfen.`;
      bg = '#FEF3C7'; border = '#FDE68A'; color = '#D97706';
    }
    fb.style.display = 'block';
    fb.style.background = bg;
    fb.style.borderColor = border;
    fb.style.color = color;
    fb.innerHTML = text;
  } else {
    fb.style.display = 'none';
  }
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

function updateORS() {
  const ids = ['individual', 'interpersonal', 'social', 'overall'];
  let total = 0;
  ids.forEach(id => {
    const val = parseInt(document.getElementById(`ors-${id}`).value);
    const valEl = document.getElementById(`ors-val-${id}`);
    if (valEl) valEl.textContent = val;
    total += val;
  });
  const totalEl = document.getElementById('ors-total-zahl');
  if (totalEl) totalEl.textContent = total;
  const alert = document.getElementById('ors-alert');
  if (alert) alert.style.display = total < 28 ? 'block' : 'none';
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
  showConfirm('Notiz wirklich löschen?', () => {
    DB.deleteNotiz(id);
    renderNotizen();
    showToast('Notiz gelöscht');
  });
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
  const avgColor = avgFortschritt >= 70 ? '#10B981' : (avgFortschritt >= 30 ? '#F59E0B' : '#EF4444');

  // Get roadmap themes for linking
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  const roadmapThemen = [];
  if (roadmap) {
    roadmap.phasen.forEach(phase => {
      (phase.themen || []).forEach(t => {
        roadmapThemen.push({ id: t.id || t, titel: t.titel || t, phase: phase.nr });
      });
    });
  }

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
      const farbe = pct >= 70 ? '#10B981' : (pct >= 30 ? '#F59E0B' : '#EF4444');
      const meilensteine = z.meilensteine || [];
      const erledigteMeilensteine = meilensteine.filter(m => m.erledigt).length;
      const roadmapLink = z.roadmapThema ? roadmapThemen.find(t => (t.id || t) === z.roadmapThema) : null;
      return `
        <div class="ziel-item-enhanced">
          <div class="ziel-item-header">
            <input type="checkbox" class="ziel-checkbox" ${pct >= 100 ? 'checked' : ''}
              onchange="toggleZiel(${i})">
            <span class="ziel-text ${pct >= 100 ? 'erledigt' : ''}">${escapeHtml(z.text)}</span>
            <span class="ziel-pct" style="color:${farbe};">${pct}%</span>
            <button class="btn-icon btn-sm" style="font-size:12px;" onclick="deleteZiel(${i})">🗑</button>
          </div>
          ${roadmapLink ? `<div style="font-size:10px;color:#6366F1;margin:2px 0 2px 24px;">🗺️ Verknüpft: ${escapeHtml(roadmapLink.titel)} (Phase ${roadmapLink.phase})</div>` : ''}
          <div class="ziel-slider-row">
            <input type="range" min="0" max="100" step="5" value="${pct}"
              class="ziel-slider" style="--ziel-farbe:${farbe};"
              oninput="updateZielFortschritt(${i}, this.value)">
          </div>
          ${meilensteine.length > 0 ? `
            <div class="meilensteine-liste" style="margin:4px 0 4px 24px;">
              ${meilensteine.map((m, mi) => `
                <div style="display:flex;align-items:center;gap:6px;padding:2px 0;">
                  <input type="checkbox" ${m.erledigt ? 'checked' : ''} onchange="toggleMeilenstein(${i},${mi})" style="margin:0;">
                  <span style="font-size:11px;color:${m.erledigt ? '#10B981' : '#6B7280'};${m.erledigt ? 'text-decoration:line-through;' : ''}">${escapeHtml(m.text)}</span>
                  <button style="background:none;border:none;font-size:10px;cursor:pointer;color:#D1D5DB;" onclick="deleteMeilenstein(${i},${mi})">✕</button>
                </div>
              `).join('')}
              <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">✅ ${erledigteMeilensteine}/${meilensteine.length} Meilensteine</div>
            </div>
          ` : ''}
          <div style="display:flex;gap:4px;margin:4px 0 2px 24px;">
            <input type="text" id="meilenstein-input-${i}" placeholder="Meilenstein hinzufügen..." style="font-size:11px;padding:3px 8px;border:1px solid #E5E7EB;border-radius:6px;flex:1;" onkeydown="if(event.key==='Enter')addMeilenstein(${i})">
            <button class="btn btn-xs btn-secondary" onclick="addMeilenstein(${i})" style="font-size:10px;">+</button>
            ${roadmapThemen.length > 0 && !z.roadmapThema ? `<select onchange="linkZielRoadmap(${i},this.value)" style="font-size:10px;padding:2px 4px;border:1px solid #E5E7EB;border-radius:6px;">
              <option value="">🗺️ Verknüpfen...</option>
              ${roadmapThemen.map(t => `<option value="${t.id || t}">${escapeHtml(t.titel)}</option>`).join('')}
            </select>` : ''}
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

  container.innerHTML = '<div style="background:#EFF6FF;border:1px solid #BAE6FD;border-radius:10px;padding:12px;margin-bottom:12px;">'
    + '<div style="font-size:12px;font-weight:600;color:#1D4ED8;margin-bottom:8px;">💡 Zielvorschläge aus Screening-Ergebnissen</div>'
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

function addMeilenstein(zielIndex) {
  const input = document.getElementById(`meilenstein-input-${zielIndex}`);
  if (!input) return;
  const text = input.value.trim();
  if (!text) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  if (!ziele[zielIndex].meilensteine) ziele[zielIndex].meilensteine = [];
  ziele[zielIndex].meilensteine.push({ text, erledigt: false });
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
}

function toggleMeilenstein(zielIndex, meilensteinIndex) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  const ms = ziele[zielIndex].meilensteine || [];
  ms[meilensteinIndex].erledigt = !ms[meilensteinIndex].erledigt;
  // Auto-update Fortschritt basierend auf Meilensteinen
  if (ms.length > 0) {
    const erledigt = ms.filter(m => m.erledigt).length;
    ziele[zielIndex].fortschritt = Math.round((erledigt / ms.length) * 100);
    ziele[zielIndex].erledigt = ziele[zielIndex].fortschritt >= 100;
  }
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
}

function deleteMeilenstein(zielIndex, meilensteinIndex) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele[zielIndex].meilensteine.splice(meilensteinIndex, 1);
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
}

function linkZielRoadmap(zielIndex, themaId) {
  if (!themaId) return;
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const ziele = s.ziele || [];
  ziele[zielIndex].roadmapThema = themaId;
  DB.updateSchueler(APP.currentSchuelerId, { ziele });
  renderZiele();
  showToast('Ziel mit Roadmap verknüpft', 'success');
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

  // Medikation & Diagnosen
  renderMedikation();
  renderDiagnosen();

  const notizEl = document.getElementById('info-allgemein');
  if (notizEl) notizEl.value = s.allgemeineNotizen || '';
}

// ============================================================
// MEDIKAMENTEN-MANAGEMENT
// ============================================================
function renderMedikation() {
  const container = document.getElementById('medikation-container');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  const meds = s.medikation || [];

  let html = '<div class="med-section">';
  html += '<div class="med-section-header">';
  html += '<h3>💊 Medikation</h3>';
  html += '<button class="btn btn-primary btn-sm" onclick="addMedikament()">+ Medikament</button>';
  html += '</div>';

  html += '<div id="med-form-container"></div>';

  if (meds.length === 0) {
    html += '<div class="med-empty">Keine Medikamente erfasst</div>';
  } else {
    meds.forEach((med, idx) => {
      html += '<div class="med-card">';
      html += '<div class="med-card-header">';
      html += '<span class="med-card-name">' + escapeHtml(med.name || 'Unbenannt') + '</span>';
      html += med.seit ? '<span class="med-card-since">seit ' + escapeHtml(med.seit) + '</span>' : '';
      html += '</div>';
      html += '<div class="med-card-fields">';
      if (med.dosierung) {
        html += '<div class="med-field"><span class="med-field-label">Dosierung</span><span class="med-field-value">' + escapeHtml(med.dosierung) + '</span></div>';
      }
      if (med.arzt) {
        html += '<div class="med-field"><span class="med-field-label">Verordnet von</span><span class="med-field-value">' + escapeHtml(med.arzt) + '</span></div>';
      }
      if (med.nebenwirkungen) {
        html += '<div class="med-field"><span class="med-field-label">Nebenwirkungen / Hinweise</span><span class="med-field-value">' + escapeHtml(med.nebenwirkungen) + '</span></div>';
      }
      html += '</div>';
      html += '<div class="med-card-actions">';
      html += '<button class="btn btn-secondary btn-xs" onclick="editMedikament(' + idx + ')">Bearbeiten</button>';
      html += '<button class="btn btn-danger btn-xs" onclick="deleteMedikament(' + idx + ')">Entfernen</button>';
      html += '</div>';
      html += '</div>';
    });
  }
  html += '</div>';
  container.innerHTML = html;
}

function addMedikament() {
  const formContainer = document.getElementById('med-form-container');
  if (!formContainer) return;
  formContainer.innerHTML = renderMedForm();
}

function editMedikament(idx) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const med = (s.medikation || [])[idx];
  if (!med) return;
  const formContainer = document.getElementById('med-form-container');
  if (!formContainer) return;
  formContainer.innerHTML = renderMedForm(med, idx);
}

function renderMedForm(med, idx) {
  const isEdit = idx !== undefined;
  return '<div class="med-form">'
    + '<div class="med-form-grid">'
    + '<div class="form-group"><label>Medikament *</label><input type="text" id="med-name" placeholder="z.B. Ritalin, Sertralin..." value="' + escapeHtml((med && med.name) || '') + '"></div>'
    + '<div class="form-group"><label>Dosierung</label><input type="text" id="med-dosierung" placeholder="z.B. 10mg 2x täglich" value="' + escapeHtml((med && med.dosierung) || '') + '"></div>'
    + '<div class="form-group"><label>Verordnet von</label><input type="text" id="med-arzt" placeholder="Arzt / Fachperson" value="' + escapeHtml((med && med.arzt) || '') + '"></div>'
    + '<div class="form-group"><label>Seit</label><input type="date" id="med-seit" value="' + ((med && med.seit) || '') + '"></div>'
    + '<div class="form-group" style="grid-column:1/-1;"><label>Nebenwirkungen / Hinweise</label><textarea id="med-nebenwirkungen" rows="2" placeholder="Bekannte Nebenwirkungen, Wechselwirkungen, Einnahmehinweise...">' + escapeHtml((med && med.nebenwirkungen) || '') + '</textarea></div>'
    + '</div>'
    + '<div class="med-form-actions">'
    + '<button class="btn btn-secondary btn-sm" onclick="cancelMedForm()">Abbrechen</button>'
    + '<button class="btn btn-primary btn-sm" onclick="saveMedikament(' + (isEdit ? idx : -1) + ')">' + (isEdit ? 'Aktualisieren' : 'Speichern') + '</button>'
    + '</div></div>';
}

function cancelMedForm() {
  const formContainer = document.getElementById('med-form-container');
  if (formContainer) formContainer.innerHTML = '';
}

function saveMedikament(idx) {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const name = document.getElementById('med-name')?.value?.trim();
  if (!name) { showToast('Bitte Medikamentenname eingeben', 'error'); return; }

  const entry = {
    name,
    dosierung: document.getElementById('med-dosierung')?.value?.trim() || '',
    arzt: document.getElementById('med-arzt')?.value?.trim() || '',
    seit: document.getElementById('med-seit')?.value || '',
    nebenwirkungen: document.getElementById('med-nebenwirkungen')?.value?.trim() || '',
  };

  const s = DB.getSchuelerById(sid);
  const meds = [...(s.medikation || [])];
  if (idx >= 0) {
    meds[idx] = entry;
  } else {
    meds.push(entry);
  }
  DB.updateSchueler(sid, { medikation: meds });
  renderMedikation();
  showToast(idx >= 0 ? 'Medikament aktualisiert' : 'Medikament hinzugefügt', 'success');
}

function deleteMedikament(idx) {
  showConfirm('Medikament wirklich entfernen?', () => {
    const s = DB.getSchuelerById(APP.currentSchuelerId);
    const meds = [...(s.medikation || [])];
    meds.splice(idx, 1);
    DB.updateSchueler(APP.currentSchuelerId, { medikation: meds });
    renderMedikation();
    showToast('Medikament entfernt');
  });
}

// ============================================================
// DIAGNOSEN-MANAGEMENT
// ============================================================
function renderDiagnosen() {
  const container = document.getElementById('diagnosen-container');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  const diagnosen = s.diagnosen || [];

  let html = '<div class="diagnose-section">';
  html += '<div class="med-section-header">';
  html += '<h3>🏥 Diagnosen</h3>';
  html += '<button class="btn btn-primary btn-sm" onclick="addDiagnose()">+ Diagnose</button>';
  html += '</div>';

  html += '<div id="diagnose-form-container"></div>';

  if (diagnosen.length === 0) {
    html += '<div class="med-empty">Keine Diagnosen erfasst</div>';
  } else {
    diagnosen.forEach((d, idx) => {
      html += '<div class="diagnose-card">';
      html += '<div class="diagnose-card-header">';
      html += '<div><span class="diagnose-badge"><span class="icd-code">' + escapeHtml(d.icd || '—') + '</span> ' + escapeHtml(d.label || 'Unbenannt') + '</span></div>';
      html += '<div style="display:flex;gap:6px;">';
      html += '<button class="btn btn-secondary btn-xs" onclick="editDiagnose(' + idx + ')">Bearbeiten</button>';
      html += '<button class="btn btn-danger btn-xs" onclick="deleteDiagnose(' + idx + ')">Entfernen</button>';
      html += '</div>';
      html += '</div>';
      if (d.diagnostiziertAm || d.diagnostiziertVon) {
        html += '<div class="diagnose-card-meta">';
        if (d.diagnostiziertAm) html += 'Diagnostiziert: ' + new Date(d.diagnostiziertAm).toLocaleDateString('de-DE') + ' ';
        if (d.diagnostiziertVon) html += '· von ' + escapeHtml(d.diagnostiziertVon);
        html += '</div>';
      }
      html += '</div>';
    });
  }
  html += '</div>';
  container.innerHTML = html;
}

function addDiagnose() {
  const formContainer = document.getElementById('diagnose-form-container');
  if (!formContainer) return;
  formContainer.innerHTML = renderDiagnoseForm();
}

function editDiagnose(idx) {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  const d = (s.diagnosen || [])[idx];
  if (!d) return;
  const formContainer = document.getElementById('diagnose-form-container');
  if (!formContainer) return;
  formContainer.innerHTML = renderDiagnoseForm(d, idx);
}

function renderDiagnoseForm(d, idx) {
  const isEdit = idx !== undefined;
  return '<div class="med-form">'
    + '<div class="med-form-grid">'
    + '<div class="form-group"><label>ICD-Code</label><input type="text" id="diagnose-icd" placeholder="z.B. F84.0, F90.0" value="' + escapeHtml((d && d.icd) || '') + '"></div>'
    + '<div class="form-group"><label>Bezeichnung *</label><input type="text" id="diagnose-label" placeholder="z.B. Autismus-Spektrum-Störung" value="' + escapeHtml((d && d.label) || '') + '"></div>'
    + '<div class="form-group"><label>Diagnostiziert am</label><input type="date" id="diagnose-am" value="' + ((d && d.diagnostiziertAm) || '') + '"></div>'
    + '<div class="form-group"><label>Diagnostiziert von</label><input type="text" id="diagnose-von" placeholder="Arzt / Klinik" value="' + escapeHtml((d && d.diagnostiziertVon) || '') + '"></div>'
    + '</div>'
    + '<div class="med-form-actions">'
    + '<button class="btn btn-secondary btn-sm" onclick="cancelDiagnoseForm()">Abbrechen</button>'
    + '<button class="btn btn-primary btn-sm" onclick="saveDiagnose(' + (isEdit ? idx : -1) + ')">' + (isEdit ? 'Aktualisieren' : 'Speichern') + '</button>'
    + '</div></div>';
}

function cancelDiagnoseForm() {
  const formContainer = document.getElementById('diagnose-form-container');
  if (formContainer) formContainer.innerHTML = '';
}

function saveDiagnose(idx) {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const label = document.getElementById('diagnose-label')?.value?.trim();
  if (!label) { showToast('Bitte Diagnose-Bezeichnung eingeben', 'error'); return; }

  const entry = {
    icd: document.getElementById('diagnose-icd')?.value?.trim() || '',
    label,
    diagnostiziertAm: document.getElementById('diagnose-am')?.value || '',
    diagnostiziertVon: document.getElementById('diagnose-von')?.value?.trim() || '',
  };

  const s = DB.getSchuelerById(sid);
  const diagnosen = [...(s.diagnosen || [])];
  if (idx >= 0) {
    diagnosen[idx] = entry;
  } else {
    diagnosen.push(entry);
  }
  DB.updateSchueler(sid, { diagnosen });
  renderDiagnosen();
  showToast(idx >= 0 ? 'Diagnose aktualisiert' : 'Diagnose hinzugefügt', 'success');
}

function deleteDiagnose(idx) {
  showConfirm('Diagnose wirklich entfernen?', () => {
    const s = DB.getSchuelerById(APP.currentSchuelerId);
    const diagnosen = [...(s.diagnosen || [])];
    diagnosen.splice(idx, 1);
    DB.updateSchueler(APP.currentSchuelerId, { diagnosen });
    renderDiagnosen();
    showToast('Diagnose entfernt');
  });
}

// Screening-Kontext für Anamnese: welche Items passen zu auffälligen Screening-Domains?
function _getAnamneseScreeningContext() {
  const result = { flaggedDomains: [], matchedItems: new Set() };
  const sid = APP.currentSchuelerId;
  if (!sid) return result;
  const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
  if (screenings.length === 0) return result;
  const latest = screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
  result.flaggedDomains = latest.flaggedAreas || [];

  // Mapping: Screening-Domain → relevante Anamnese-Item-IDs
  const domainItemMap = {
    trauma: ['haeusliche_gewalt', 'misshandlung_physisch', 'misshandlung_emotional', 'missbrauch_sexuell', 'vernachlaessigung_emotional', 'vernachlaessigung_physisch', 'kriegserfahrung', 'flucht'],
    depression: ['tod_elternteil', 'verlust_bezugsperson', 'soziale_isolation', 'psychische_erkrankung_eltern'],
    angst: ['haeusliche_gewalt', 'mobbing', 'schulwechsel_haeufig', 'migration', 'psychische_erkrankung_eltern'],
    adhs: ['schulwechsel_haeufig', 'lernschwaeche', 'schulverweigerung', 'schulausschluss'],
    selbstverletzung: ['misshandlung_physisch', 'missbrauch_sexuell', 'vernachlaessigung_emotional', 'psychische_erkrankung_eltern'],
    suizidalitaet: ['tod_elternteil', 'verlust_bezugsperson', 'haeusliche_gewalt', 'missbrauch_sexuell', 'psychische_erkrankung_eltern'],
    substanz: ['substanzkonsum_eltern', 'peers_negativ', 'schulverweigerung'],
    essstoerung: ['mobbing', 'leistungsdruck'],
    soziale_isolation: ['migration', 'haeufige_umzuege', 'mobbing', 'pflegefamilie', 'heim'],
    conduct: ['haeusliche_gewalt', 'misshandlung_physisch', 'vernachlaessigung_emotional', 'inkonsistente_erziehung', 'kein_vater', 'kein_mutter'],
    bindung: ['kein_vater', 'kein_mutter', 'pflegefamilie', 'heim', 'haeufige_umzuege', 'vernachlaessigung_emotional', 'wechselnde_bezugspersonen'],
    schlaf: ['haeusliche_gewalt', 'leistungsdruck', 'digitale_medien_exzessiv'],
    mobbing: ['mobbing', 'soziale_isolation', 'migration'],
  };
  result.flaggedDomains.forEach(domId => {
    (domainItemMap[domId] || []).forEach(itemId => result.matchedItems.add(itemId));
  });
  return result;
}

function renderAnamneseChips(kat, anamnese) {
  const activeCount = kat.items.filter(it => anamnese.includes(it.id)).length;
  // Screening-Kontext: welche Domains sind auffällig?
  const scrContext = _getAnamneseScreeningContext();
  return `
    <div class="anamnese-kategorie">
      <div class="anamnese-kategorie-header" style="border-left:4px solid ${kat.farbe}">
        <span>${kat.icon} ${kat.label}</span>
        <span class="anamnese-count">${activeCount > 0 ? activeCount + ' ausgewählt' : ''}</span>
      </div>
      <div class="anamnese-chips">
        ${kat.items.map(item => {
          const isHochGewichtet = item.gewicht >= 2;
          const scrMatch = scrContext.matchedItems.has(item.id);
          const badges = [];
          if (isHochGewichtet) badges.push('<span class="anamnese-gewicht-badge" title="Hohes Risiko-Gewicht — besonders beachten">⚠️</span>');
          if (scrMatch) badges.push('<span class="anamnese-scr-badge" title="Passt zum auffälligen Screening-Ergebnis">📊</span>');
          return `
          <div class="anamnese-chip ${anamnese.includes(item.id) ? 'active' : ''} ${isHochGewichtet ? 'anamnese-wichtig' : ''} ${scrMatch ? 'anamnese-scr-match' : ''}"
               style="--chip-color:${kat.farbe}"
               onclick="toggleAnamneseItem('${item.id}')"
               title="${item.evidenz}${isHochGewichtet ? ' · ⚠️ Hohes Gewicht' : ''}${scrMatch ? ' · 📊 Screening-Match' : ''}">
            ${item.label}${badges.length > 0 ? ' ' + badges.join('') : ''}
          </div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderAnamneseFelder(kat, anamnese) {
  const scrContext = _getAnamneseScreeningContext();
  const felderHtml = kat.felder.map(feld => {
    const isMulti = feld.typ === 'multi';
    return `
      <div class="anamnese-feld">
        <div class="anamnese-feld-label">${feld.label}${!isMulti ? ' <span class="anamnese-feld-hint">(eines wählen)</span>' : ''}</div>
        <div class="anamnese-chips">
          ${feld.optionen.map(opt => {
            const isHochGewichtet = (opt.gewicht || 0) >= 2;
            const scrMatch = scrContext.matchedItems.has(opt.id);
            const badges = [];
            if (isHochGewichtet) badges.push('<span class="anamnese-gewicht-badge" title="Hohes Risiko-Gewicht">⚠️</span>');
            if (scrMatch) badges.push('<span class="anamnese-scr-badge" title="Passt zum Screening">📊</span>');
            return `
            <div class="anamnese-chip ${anamnese.includes(opt.id) ? 'active' : ''} ${isHochGewichtet ? 'anamnese-wichtig' : ''} ${scrMatch ? 'anamnese-scr-match' : ''}"
                 style="--chip-color:${kat.farbe}"
                 onclick="toggleAnamneseItem('${opt.id}', '${feld.id}', '${feld.typ}')"
                 title="${opt.evidenz || ''}${isHochGewichtet ? ' · ⚠️ Hohes Gewicht' : ''}${scrMatch ? ' · 📊 Screening-Match' : ''}">
              ${opt.label}${badges.length > 0 ? ' ' + badges.join('') : ''}
            </div>`;
          }).join('')}
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
  else { ampel = '#10B981'; ampelLabel = 'Geschützt'; }

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
            <div class="anamnese-summary-number" style="color:#10B981">${schutz.length}</div>
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
                <span style="font-size:10px;color:#6366F1;font-style:italic;margin-left:4px;">📖 ${r.evidenz}</span>
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
    el.innerHTML = renderEmptyState('🔍', 'Keine Hypothesen', 'Hypothesen werden automatisch aus Anamnese-Daten und Screening-Ergebnissen generiert.');
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
      borderColor = '#10B981'; badgeBg = '#ECFDF5'; badgeText = '#065F46';
    } else if (h.typ === 'differenzial') {
      borderColor = '#6366F1'; badgeBg = '#EEF2FF'; badgeText = '#4338CA';
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

    // Screening-Score-Badges: erkennen und anreichern
    const screeningBadges = [];
    const textDaten = [];
    daten.forEach(d => {
      const m = d.match(/^Screening\s+(.+?):\s*(\d+)\/(\d+)\s*\(Cutoff\s*(\d+)\)/i);
      if (m) {
        const [, label, score, max, cutoff] = m;
        const pct = Math.round(((+score) / (+max)) * 100);
        const ueber = +score - +cutoff;
        const farbe = ueber >= 3 ? '#DC2626' : ueber >= 1 ? '#F59E0B' : '#6B7280';
        screeningBadges.push(`<span style="display:inline-flex;align-items:center;gap:3px;background:${farbe}11;border:1px solid ${farbe}44;color:${farbe};padding:2px 8px;border-radius:10px;font-size:11px;font-weight:600;" title="${label}: ${score}/${max} (Cutoff ${cutoff}, +${ueber})">📊 ${label}: ${score}/${max} <span style="font-size:9px;opacity:.8;">(Cut ${cutoff})</span></span>`);
      } else {
        textDaten.push(d);
      }
    });

    // Quick-Actions bestimmen
    const quickActions = [];
    // 5P übernehmen
    const p5Ziel = h.typ === 'schutz' ? 'protective' : h.typ === 'differenzial' ? 'presenting' : 'predisposing';
    quickActions.push(`<button class="hypo-quick-btn" onclick="event.stopPropagation();quickHypo5P('${h.id}','${p5Ziel}')" title="In 5P-Fallformulierung übernehmen">→ 5P</button>`);
    // Fachkraft-Modul (wenn wiki_ids vorhanden)
    if (h.wiki_ids && h.wiki_ids.length > 0) {
      const fkLinks = [];
      h.wiki_ids.forEach(wId => {
        const wiki = typeof WIKI_ARTIKEL !== 'undefined' ? WIKI_ARTIKEL.find(a => a.id === wId) : null;
        if (!wiki) return;
        const themenIds = wiki.themen_ids || [];
        const fkTid = themenIds.find(tid => typeof FACHKRAFT_MODULE_DATEIEN !== 'undefined' && FACHKRAFT_MODULE_DATEIEN[tid]);
        if (fkTid) fkLinks.push({ datei: FACHKRAFT_MODULE_DATEIEN[fkTid], label: wiki.titel });
      });
      if (fkLinks.length > 0) {
        quickActions.push(`<button class="hypo-quick-btn hypo-quick-fk" onclick="event.stopPropagation();window.open('fachkraft-module/${fkLinks[0].datei}','_blank')" title="Fachkraft-Modul: ${fkLinks[0].label}">🎓 Modul</button>`);
      }
    }
    // Abklärung empfehlen (bei handlung oder empfehlung mit "abklär" / "KJP" / "fachärzt")
    if (h.empfehlung && /abklär|KJP|fachärzt|psychiatr/i.test(h.empfehlung)) {
      quickActions.push(`<button class="hypo-quick-btn hypo-quick-warn" onclick="event.stopPropagation();quickHypoAbklaerung('${h.id}')" title="Abklärungsempfehlung in SOAP-Notiz übernehmen">⚕️ Abklärung</button>`);
    }

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
      trBadgeHtml = `<span style="background:#ECFDF5;color:#065F46;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600;margin-left:4px;" title="${h._trHinweis || ''}">✅ Durch Verlauf bestätigt</span>`;
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
        ${screeningBadges.length > 0 ? `<div class="hypothese-screening-scores" style="display:flex;flex-wrap:wrap;gap:4px;margin:4px 0 2px;">${screeningBadges.join('')}</div>` : ''}
        ${textDaten.length > 0 ? `<div class="hypothese-daten">Basierend auf: ${textDaten.join(' · ')}</div>` : ''}
        ${h.quelle ? `<div style="font-size:11px;color:#6366F1;margin-top:4px;line-height:1.4;font-style:italic;">📚 ${h.quelle}</div>` : ''}
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
                return '<span class="hypothese-wiki-chip" onclick="openWikiArtikel(\'' + wId + '\')" style="cursor:pointer;background:#EFF6FF;border:1px solid #BFDBFE;color:#1D4ED8;padding:3px 8px;border-radius:8px;font-size:11px;display:inline-flex;align-items:center;gap:3px;">' + wiki.icon + ' ' + wiki.titel + '</span>'
                  + (fkDatei ? '<span onclick="window.open(\'fachkraft-module/' + fkDatei + '\',\'_blank\')" style="cursor:pointer;background:#ECFDF5;border:1px solid #A7F3D0;color:#065F46;padding:3px 8px;border-radius:8px;font-size:10px;display:inline-flex;align-items:center;gap:2px;">🎓 Praxis</span>' : '')
                  + renderArbeitsblattChipsFromThemenIds(themenIds);
              }).join('')}
              ${h.icd10 && h.icd10.length > 0 ? h.icd10.map(c => '<span style="background:#F3F4F6;color:#6B7280;padding:2px 6px;border-radius:6px;font-size:10px;font-family:monospace;">' + c + '</span>').join('') : ''}
            </div>
          </div>
        ` : ''}
        ${quickActions.length > 0 ? `<div class="hypo-quick-actions" style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;padding-top:6px;border-top:1px solid #F1F5F9;">${quickActions.join('')}</div>` : ''}
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

  // Sudden-Change-Detection: SRS-Absturz >= 15 Punkte zwischen Sitzungen
  let suddenChange = null;
  if (alleSrs.length >= 2) {
    for (let i = 1; i < alleSrs.length; i++) {
      const diff = alleSrs[i] - alleSrs[i - 1];
      if (diff <= -15) {
        const betroffeneNotiz = notizen.sort((a, b) => a.datum.localeCompare(b.datum))[i];
        suddenChange = {
          vonSrs: alleSrs[i - 1],
          nachSrs: alleSrs[i],
          diff: diff,
          datum: betroffeneNotiz ? betroffeneNotiz.datum : null,
          sitzungNr: i + 1,
        };
        break; // Nur den ersten (neuesten wäre besser, aber erster reicht)
      }
    }
  }

  return { themen: themenAnalyse, gesamtTrend, bestesThema, ansatzAnalyse, besterAnsatz, suddenChange };
}

// ============================================================
// THERAPEUTISCHER ZWILLING — Analyse-Engine
// ============================================================

// ORS/SRS Trend-Analyse für einen Klienten
function analyseORS_SRS_Trend(schuelerId) {
  const notizen = DB.getNotizen(schuelerId)
    .filter(n => n.kategorie === 'session' && n.soap?.ors?.total != null)
    .sort((a, b) => a.datum.localeCompare(b.datum));
  if (notizen.length === 0) return null;

  const orsWerte = notizen.map(n => n.soap.ors.total);
  const srsWerte = notizen.filter(n => n.soap?.srs?.total != null).map(n => n.soap.srs.total);
  const letzte3ORS = orsWerte.slice(-3);
  const letzte3SRS = srsWerte.slice(-3);

  const orsDurchschnitt = Math.round(orsWerte.reduce((a, b) => a + b, 0) / orsWerte.length * 10) / 10;
  const srsDurchschnitt = srsWerte.length > 0 ? Math.round(srsWerte.reduce((a, b) => a + b, 0) / srsWerte.length * 10) / 10 : null;

  // Trend: letzte 3 vs. vorherige
  let orsTrend = 'stabil';
  if (orsWerte.length >= 3) {
    const letzte = orsWerte.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const vorherige = orsWerte.slice(0, -3);
    if (vorherige.length > 0) {
      const vorDurchschnitt = vorherige.reduce((a, b) => a + b, 0) / vorherige.length;
      const delta = letzte - vorDurchschnitt;
      if (delta > 3) orsTrend = 'steigend';
      else if (delta < -3) orsTrend = 'fallend';
    }
  }

  let srsTrend = 'stabil';
  if (srsWerte.length >= 3) {
    const letzte = srsWerte.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const vorherige = srsWerte.slice(0, -3);
    if (vorherige.length > 0) {
      const vorDurchschnitt = vorherige.reduce((a, b) => a + b, 0) / vorherige.length;
      const delta = letzte - vorDurchschnitt;
      if (delta > 3) srsTrend = 'steigend';
      else if (delta < -3) srsTrend = 'fallend';
    }
  }

  // ORS RCI
  const orsRci = berechneRCI(orsWerte);

  return {
    ors: { trend: orsTrend, letzte3: letzte3ORS, durchschnitt: orsDurchschnitt, anzahl: orsWerte.length, rci: orsRci },
    srs: { trend: srsTrend, letzte3: letzte3SRS, durchschnitt: srsDurchschnitt, anzahl: srsWerte.length },
    letzteNotiz: notizen[notizen.length - 1],
  };
}

// Anwesenheitsmuster-Analyse
function analyseAnwesenheitsMuster(schuelerId) {
  const termine = DB.getTermine(schuelerId).sort((a, b) => a.datum.localeCompare(b.datum));
  if (termine.length === 0) return null;

  const total = termine.length;
  const anwesend = termine.filter(t => t.status === 'anwesend').length;
  const noShows = termine.filter(t => t.status === 'no-show').length;
  const abgesagt = termine.filter(t => t.status === 'abgesagt').length;
  const rate = Math.round(anwesend / total * 100);

  // Konsekutive No-Shows (am Ende)
  let konsekutiveNoShows = 0;
  for (let i = termine.length - 1; i >= 0; i--) {
    if (termine[i].status === 'no-show') konsekutiveNoShows++;
    else break;
  }

  // Letzter Termin
  const letzterTermin = termine[termine.length - 1];
  const tageSeitLetztem = letzterTermin ? Math.floor((Date.now() - new Date(letzterTermin.datum).getTime()) / 86400000) : null;

  return { rate, total, anwesend, noShows, abgesagt, konsekutiveNoShows, letzterTermin, tageSeitLetztem };
}

// Stimmungsmuster-Analyse
function analyseStimmungsMuster(schuelerId) {
  const notizen = DB.getNotizen(schuelerId)
    .filter(n => n.kategorie === 'session' && n.soap?.stimmung)
    .sort((a, b) => a.datum.localeCompare(b.datum));
  if (notizen.length === 0) return null;

  const moodScore = { 'sehr-schlecht': 1, 'schlecht': 2, 'neutral': 3, 'gut': 4, 'sehr-gut': 5 };

  // Nach Wochentag
  const nachWochentag = {};
  const tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
  for (const n of notizen) {
    const tag = tage[new Date(n.datum).getDay()];
    if (!nachWochentag[tag]) nachWochentag[tag] = [];
    nachWochentag[tag].push(moodScore[n.soap.stimmung] || 3);
  }
  for (const tag of Object.keys(nachWochentag)) {
    const arr = nachWochentag[tag];
    nachWochentag[tag] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10;
  }

  // Nach Setting
  const nachSetting = {};
  for (const n of notizen) {
    const s = n.soap.setting || 'unbekannt';
    if (!nachSetting[s]) nachSetting[s] = [];
    nachSetting[s].push(moodScore[n.soap.stimmung] || 3);
  }
  for (const s of Object.keys(nachSetting)) {
    const arr = nachSetting[s];
    nachSetting[s] = { avg: Math.round(arr.reduce((a, b) => a + b, 0) / arr.length * 10) / 10, n: arr.length };
  }

  // Trend (letzte 5 vs. vorherige)
  const scores = notizen.map(n => moodScore[n.soap.stimmung] || 3);
  let trend = 'stabil';
  if (scores.length >= 5) {
    const letzte = scores.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const vorherige = scores.slice(0, -3).reduce((a, b) => a + b, 0) / (scores.length - 3);
    if (letzte - vorherige > 0.5) trend = 'steigend';
    else if (vorherige - letzte > 0.5) trend = 'fallend';
  }

  return { nachWochentag, nachSetting, trend, anzahl: notizen.length };
}

// Setting-Wirkung: Welches Setting erzielt die besten SRS-Werte?
function analyseSettingWirkung(schuelerId) {
  const notizen = DB.getNotizen(schuelerId)
    .filter(n => n.kategorie === 'session' && n.soap?.setting && n.soap?.srs?.total != null);
  if (notizen.length === 0) return null;

  const settingMap = {};
  for (const n of notizen) {
    const s = n.soap.setting;
    if (!settingMap[s]) settingMap[s] = [];
    settingMap[s].push(n.soap.srs.total);
  }

  const settingScores = {};
  let bestSetting = null;
  let bestAvg = 0;
  for (const [setting, werte] of Object.entries(settingMap)) {
    const avg = Math.round(werte.reduce((a, b) => a + b, 0) / werte.length * 10) / 10;
    settingScores[setting] = { avg, n: werte.length };
    if (avg > bestAvg && werte.length >= 2) {
      bestAvg = avg;
      bestSetting = setting;
    }
  }

  return { settingScores, bestSetting, bestAvg };
}

// Vernachlässigte Themen: Screening-Flaggen die nie als Sitzungsthema adressiert wurden
function findeVernachlaessigteThemen(schuelerId) {
  const screenings = DB.getScreenings(schuelerId);
  if (!screenings || screenings.length === 0) return [];

  // Letztes Screening
  const letztes = screenings.sort((a, b) => (b.datum || '').localeCompare(a.datum || ''))[0];
  if (!letztes || !letztes.ergebnisse) return [];

  // Flaggen: Domänen über Cutoff
  const domains = typeof SCREENING_DOMAINS !== 'undefined' ? SCREENING_DOMAINS : [];
  const flaggen = [];
  for (const domain of domains) {
    const score = letztes.ergebnisse[domain.id];
    if (score != null && score >= domain.cutoff && !domain.invertiert) {
      flaggen.push({ id: domain.id, label: domain.label, icon: domain.icon, score, cutoff: domain.cutoff });
    }
  }

  // Welche Domänen wurden als Sitzungsthema adressiert?
  const notizen = DB.getNotizen(schuelerId).filter(n => n.kategorie === 'session');
  const adressierteDomains = new Set();

  // Check 1: Über SOAP Freitext-Keyword-Matching
  for (const n of notizen) {
    const text = [n.soap?.subjektiv, n.soap?.objektiv, n.soap?.assessment, n.soap?.plan].filter(Boolean).join(' ').toLowerCase();
    if (typeof THEMEN_KEYWORDS !== 'undefined') {
      for (const [domain, keywords] of Object.entries(THEMEN_KEYWORDS)) {
        if (keywords.some(kw => text.includes(kw))) {
          adressierteDomains.add(domain);
        }
      }
    }
  }

  // Check 2: Thema-Verknüpfung (wenn Thema einer Domäne zugeordnet)
  for (const n of notizen) {
    if (n.themaId) adressierteDomains.add(n.themaId);
  }

  // Flaggen die nie adressiert wurden
  return flaggen.filter(f => !adressierteDomains.has(f.id));
}

// ============================================================
// THERAPEUTISCHER ZWILLING — Sitzungs-Briefing Widget
// ============================================================
function renderSitzungsBriefing(schuelerId) {
  const el = document.getElementById('sitzungs-briefing-widget');
  if (!el) return;

  const notizen = DB.getNotizen(schuelerId).filter(n => n.kategorie === 'session').sort((a, b) => a.datum.localeCompare(b.datum));
  if (notizen.length === 0) {
    el.innerHTML = '';
    return;
  }

  const orsSrsTrend = analyseORS_SRS_Trend(schuelerId);
  const anwesenheit = analyseAnwesenheitsMuster(schuelerId);
  const stimmung = analyseStimmungsMuster(schuelerId);
  const settingWirkung = analyseSettingWirkung(schuelerId);
  const vernachlaessigt = findeVernachlaessigteThemen(schuelerId);

  // Letzte Notiz: Plan-Sektion (Vereinbarung)
  const letzteNotiz = notizen[notizen.length - 1];
  const letzterPlan = letzteNotiz?.soap?.plan || '';
  const letzteDatum = letzteNotiz?.datum ? new Date(letzteNotiz.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';

  // Build briefing cards
  const cards = [];

  // 1. ORS/SRS Trend
  if (orsSrsTrend) {
    const trendIcon = { steigend: '📈', fallend: '📉', stabil: '➡️' };
    const trendColor = { steigend: '#059669', fallend: '#DC2626', stabil: '#6B7280' };
    const ors = orsSrsTrend.ors;
    const srs = orsSrsTrend.srs;
    cards.push(`
      <div class="briefing-card">
        <div class="briefing-card-icon" style="color:${trendColor[ors.trend]};">${trendIcon[ors.trend]}</div>
        <div class="briefing-card-content">
          <div class="briefing-card-title">ORS-Trend: ${ors.trend}</div>
          <div class="briefing-card-detail">Letzte 3: ${ors.letzte3.join(', ')} | ∅ ${ors.durchschnitt}/40${ors.rci ? ` | RCI: ${ors.rci.rci}` : ''}</div>
          ${srs.anzahl > 0 ? `<div class="briefing-card-detail">SRS ∅ ${srs.durchschnitt}/40 (${srs.trend})</div>` : ''}
        </div>
      </div>
    `);
  }

  // 2. Letzte Vereinbarung
  if (letzterPlan) {
    const planKurz = letzterPlan.length > 150 ? letzterPlan.substring(0, 150) + '...' : letzterPlan;
    cards.push(`
      <div class="briefing-card">
        <div class="briefing-card-icon">📋</div>
        <div class="briefing-card-content">
          <div class="briefing-card-title">Letzte Vereinbarung (${letzteDatum})</div>
          <div class="briefing-card-detail" style="white-space:pre-line;">${sanitize(planKurz)}</div>
        </div>
      </div>
    `);
  }

  // 3. Anwesenheit
  if (anwesenheit) {
    let anwWarn = '';
    if (anwesenheit.konsekutiveNoShows >= 2) anwWarn = `<span style="color:#DC2626;font-weight:600;">${anwesenheit.konsekutiveNoShows}x nicht erschienen in Folge!</span>`;
    else if (anwesenheit.tageSeitLetztem > 21) anwWarn = `<span style="color:#D97706;">Letzter Kontakt vor ${anwesenheit.tageSeitLetztem} Tagen</span>`;
    cards.push(`
      <div class="briefing-card">
        <div class="briefing-card-icon">${anwesenheit.rate >= 75 ? '✅' : anwesenheit.rate >= 50 ? '⚠️' : '🚨'}</div>
        <div class="briefing-card-content">
          <div class="briefing-card-title">Anwesenheit: ${anwesenheit.rate}% (${anwesenheit.anwesend}/${anwesenheit.total})</div>
          <div class="briefing-card-detail">${anwesenheit.noShows} No-Shows, ${anwesenheit.abgesagt} abgesagt${anwWarn ? ' | ' + anwWarn : ''}</div>
        </div>
      </div>
    `);
  }

  // 4. Stimmungsmuster
  if (stimmung && stimmung.anzahl >= 3) {
    const trendText = { steigend: 'verbessert sich', fallend: 'verschlechtert sich', stabil: 'stabil' };
    // Bester/schlechtester Wochentag
    const tage = Object.entries(stimmung.nachWochentag).sort((a, b) => b[1] - a[1]);
    const besterTag = tage.length > 0 ? tage[0] : null;
    const schlechtesterTag = tage.length > 1 ? tage[tage.length - 1] : null;
    let tagInfo = '';
    if (besterTag && schlechtesterTag && besterTag[1] !== schlechtesterTag[1]) {
      tagInfo = ` | Bester Tag: ${besterTag[0]} (${besterTag[1]}), Schwierigster: ${schlechtesterTag[0]} (${schlechtesterTag[1]})`;
    }
    cards.push(`
      <div class="briefing-card">
        <div class="briefing-card-icon">${stimmung.trend === 'steigend' ? '🌤️' : stimmung.trend === 'fallend' ? '🌧️' : '☁️'}</div>
        <div class="briefing-card-content">
          <div class="briefing-card-title">Stimmung: ${trendText[stimmung.trend]}</div>
          <div class="briefing-card-detail">${stimmung.anzahl} Sitzungen erfasst${tagInfo}</div>
        </div>
      </div>
    `);
  }

  // 5. Setting-Empfehlung
  if (settingWirkung && settingWirkung.bestSetting && Object.keys(settingWirkung.settingScores).length >= 2) {
    const settings = Object.entries(settingWirkung.settingScores).sort((a, b) => b[1].avg - a[1].avg);
    if (settings.length >= 2 && settings[0][1].avg - settings[settings.length - 1][1].avg > 3) {
      cards.push(`
        <div class="briefing-card">
          <div class="briefing-card-icon">💡</div>
          <div class="briefing-card-content">
            <div class="briefing-card-title">Setting-Empfehlung: ${settingWirkung.bestSetting}</div>
            <div class="briefing-card-detail">SRS ∅ ${settingWirkung.bestAvg}/40 — deutlich besser als andere Settings (${settings.map(([s, d]) => `${s}: ${d.avg}`).join(', ')})</div>
          </div>
        </div>
      `);
    }
  }

  // 6. Vernachlässigte Themen
  if (vernachlaessigt.length > 0) {
    cards.push(`
      <div class="briefing-card" style="border-left-color:#D97706;">
        <div class="briefing-card-icon">🔍</div>
        <div class="briefing-card-content">
          <div class="briefing-card-title">Noch nicht adressierte Screening-Flaggen</div>
          <div class="briefing-card-detail">${vernachlaessigt.map(f => `${f.icon} ${f.label} (Score: ${f.score}/${f.cutoff})`).join(' | ')}</div>
        </div>
      </div>
    `);
  }

  if (cards.length === 0) { el.innerHTML = ''; return; }

  el.innerHTML = `
    <div class="card" style="margin-bottom:12px;border-left:4px solid #8B5CF6;">
      <div class="card-header" style="cursor:pointer;" onclick="this.parentElement.querySelector('.card-body').style.display=this.parentElement.querySelector('.card-body').style.display==='none'?'block':'none';">
        <span>🧠</span>
        <div class="card-title">Sitzungs-Briefing</div>
        <span style="font-size:11px;color:var(--text-muted);margin-left:auto;">Therapeutischer Zwilling</span>
      </div>
      <div class="card-body" style="padding:8px 12px;">
        <div class="briefing-cards">${cards.join('')}</div>
      </div>
    </div>
  `;
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
  const trendColor = (t) => t === 'steigend' ? '#10B981' : t === 'fallend' ? '#EF4444' : '#9CA3AF';
  const responseColor = (r) => r >= 75 ? '#10B981' : r >= 50 ? '#F59E0B' : '#EF4444';

  // Sudden-Change Alert
  const scAlert = analyse.suddenChange;
  const suddenHtml = scAlert ? `<div style="margin-bottom:12px;padding:10px 14px;background:#FEF2F2;border:2px solid #EF4444;border-radius:8px;">
    <div style="font-size:13px;font-weight:700;color:#DC2626;">⚠️ Plötzliche Verschlechterung erkannt</div>
    <div style="font-size:12px;color:#374151;margin-top:4px;">SRS fiel von <strong>${scAlert.vonSrs}</strong> auf <strong>${scAlert.nachSrs}</strong> (${scAlert.diff} Punkte) in Sitzung #${scAlert.sitzungNr}${scAlert.datum ? ' am ' + formatDatum(scAlert.datum) : ''}.</div>
    <div style="font-size:11px;color:#991B1B;margin-top:6px;font-weight:500;">Empfehlung: Risiko-Check durchführen und therapeutische Beziehung reflektieren.</div>
    <button class="btn btn-xs" style="margin-top:6px;background:#EF4444;color:#fff;border:none;" onclick="showPhase('auswertung');setTimeout(()=>showSubTab('verlauf-tracker'),100);">Risiko-Check öffnen</button>
  </div>` : '';

  el.innerHTML = `
    ${suddenHtml}
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
                ${t.srsWerte.map(v => `<span class="treatment-srs-dot" style="background:${v >= 30 ? '#10B981' : v >= 20 ? '#F59E0B' : '#EF4444'}" title="SRS: ${v}/40"></span>`).join('')}
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
                const barColor = a.responseRate >= 75 ? '#10B981' : a.responseRate >= 50 ? '#F59E0B' : '#EF4444';
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
        .hypo.schutz { border-color:#10B981; }
        .hypo.diff { border-color:#6366F1; }
        .hypo-titel { font-weight:600; }
        .hypo-detail { font-size:11px; color:#6B7280; margin-top:3px; }
        .hypo-evidenz { font-size:10px; color:#9CA3AF; margin-top:2px; font-style:italic; }
        .treatment { padding:6px 10px; background:#ECFDF5; border-radius:6px; margin-bottom:4px; }
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
    if (r.typ === 'schutz') return '#10B981';
    if (r.typ === 'differenzial') return '#6366F1';
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
          <span><span class="hypo-zeitstrahl-dot" style="background:#10B981"></span> Schutzfaktor</span>
          <span><span class="hypo-zeitstrahl-dot" style="background:#6366F1"></span> Differenzial</span>
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
      kommentare.push(`<span style="color:#10B981">↓ ${d.label}-Score gesunken um ${Math.abs(d.prozent)}% seit ${delta.von}</span>`);
    }
    for (const d of verschlechtert) {
      kommentare.push(`<span style="color:#EF4444">↑ ${d.label}-Score gestiegen um ${d.prozent}% seit ${delta.von}</span>`);
    }

    // Cutoff-Wechsel
    for (const d of delta.domains) {
      const vorherDomain = deltas.length > 0 ? null : null; // simplified
      if (d.scoreVorher >= d.cutoff && d.scoreAktuell < d.cutoff) {
        kommentare.push(`<span style="color:#10B981">✓ ${d.label} unter klinischem Cutoff gefallen</span>`);
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
                const diffColor = d.diff < 0 ? '#10B981' : d.diff > 0 ? '#EF4444' : '#9CA3AF';
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
  showConfirm(`Klient "${s.vorname} ${s.nachname}" wirklich löschen? Alle Daten gehen verloren!`, () => {
    DB.deleteSchueler(schuelerId);
    renderSidebar();
    showView('home');
    showToast('Klient gelöscht');
  });
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
  const heuteStr = heute.toISOString().split('T')[0];
  const alleTermine = DB.getTermine();
  const sessionDates = getSessionDatesForKalender();

  // Klinische Kalender-Features: Krisen-Daten und Fehltermine sammeln
  const krisenDaten = new Set();
  const fehlterminDaten = new Set();
  const schueler = DB.getSchueler();

  schueler.forEach(s => {
    // Krisen-Daten: SOAP-Einträge mit Krise oder Risiko-rot-Wechsel
    const protokolle = DB.getProtokolle(s.id);
    protokolle.forEach(p => {
      if (p.krise || p.cssrsSchweregrad >= 3) {
        krisenDaten.add(p.datum);
      }
    });

    // Risiko-Audit: rot-Wechsel-Daten
    const risiko = DB.getRisiko(s.id);
    risiko.forEach(r => {
      if (r.wert === 'rot' && r.datum) krisenDaten.add(r.datum);
    });
  });

  // Fehltermine: Geplante Termine in der Vergangenheit ohne zugehörige Sitzungsdokumentation
  alleTermine.forEach(t => {
    if (t.datum < heuteStr && t.schuelerId && (t.typ === 'sitzung' || t.typ === 'termin')) {
      const hatSitzung = sessionDates[t.datum] && sessionDates[t.datum].some(s => s.schuelerId === t.schuelerId);
      if (!hatSitzung) fehlterminDaten.add(t.datum);
    }
  });

  // Risiko-Schüler: Warnung wenn kein Termin seit >2 Wochen
  let risikoOhneTermin = [];
  schueler.forEach(s => {
    const risiko = DB.getRisiko(s.id);
    const hatRot = risiko.some(r => r.wert === 'rot');
    if (!hatRot) return;
    const protokolle = DB.getProtokolle(s.id).sort((a, b) => new Date(b.datum) - new Date(a.datum));
    const letzteSitzung = protokolle.length > 0 ? new Date(protokolle[0].datum) : null;
    const tage = letzteSitzung ? Math.floor((heute - letzteSitzung) / (1000 * 60 * 60 * 24)) : 999;
    if (tage > 14) {
      risikoOhneTermin.push({ name: s.vorname + ' ' + s.nachname, tage });
    }
  });

  let html = '';

  // Risiko-Warnung: Schüler ohne Termin
  if (risikoOhneTermin.length > 0) {
    html = `<div style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:8px 12px;margin-bottom:10px;font-size:11px;">`;
    html += `<div style="font-weight:600;color:#DC2626;margin-bottom:4px;">⚠️ Risiko-Schüler ohne Termin:</div>`;
    risikoOhneTermin.forEach(r => {
      html += `<div style="color:#7F1D1D;">• ${escapeHtml(r.name)} — kein Termin seit ${r.tage} Tagen</div>`;
    });
    html += '</div>';
    const warnContainer = document.getElementById('kalender-risiko-warnung');
    if (warnContainer) warnContainer.innerHTML = html;
    html = '';
  }

  // Leere Felder am Anfang
  for (let i = 0; i < startOffset; i++) {
    html += '<div class="kalender-tag leer"></div>';
  }

  for (let tag = 1; tag <= tageImMonat; tag++) {
    const datumStr = `${jahr}-${String(monat+1).padStart(2,'0')}-${String(tag).padStart(2,'0')}`;
    const isHeute = heute.getFullYear() === jahr && heute.getMonth() === monat && heute.getDate() === tag;
    const termine = alleTermine.filter(t => t.datum === datumStr);
    const sessions = sessionDates[datumStr] || [];
    const istKrise = krisenDaten.has(datumStr);
    const istFehltermin = fehlterminDaten.has(datumStr);

    const extraClasses = [isHeute ? 'heute' : '', istKrise ? 'krise-tag' : ''].filter(Boolean).join(' ');

    html += `
      <div class="kalender-tag ${extraClasses}" onclick="openTerminModal('${datumStr}')" ${istKrise ? 'style="background:#FEF2F2;border:1px solid #FECACA;"' : ''}>
        <div class="tag-nummer">${tag}${istKrise ? ' <span title="Krisenereignis" style="color:#DC2626;">🔴</span>' : ''}${istFehltermin ? ' <span title="Fehltermin" style="color:#F59E0B;">⊘</span>' : ''}</div>
        <div class="tag-events">
          ${sessions.map(s =>
            `<div class="tag-event tag-event-session" style="background:#6366F1;" title="Sitzung: ${s.schuelerName}">📋 ${s.schuelerName.split(' ')[0] || 'Sitzung'}</div>`
          ).join('')}
          ${termine.slice(0,3 - sessions.length).map(t => {
            const typ = TERMIN_TYPEN[t.typ] || TERMIN_TYPEN.termin;
            const aw = t.anwesenheit && ANWESENHEIT_STATUS[t.anwesenheit] ? ANWESENHEIT_STATUS[t.anwesenheit] : null;
            const awDot = aw ? `<span style="font-size:8px;" title="${aw.label}">${aw.icon}</span> ` : '';
            return `<div class="tag-event" style="background:${aw ? aw.farbe + '30' : typ.farbe};${aw ? 'border:1px solid ' + aw.farbe + ';color:' + aw.farbe : ''}" title="${t.titel}${aw ? ' — ' + aw.label : ''}">${awDot}${t.uhrzeit ? t.uhrzeit + ' ' : ''}${t.titel}</div>`;
          }).join('')}
          ${(termine.length + sessions.length) > 3 ? `<div style="font-size:10px;color:var(--text-muted);">+${termine.length + sessions.length - 3} mehr</div>` : ''}
        </div>
      </div>`;
  }

  document.getElementById('kalender-tage').innerHTML = html;
  renderTerminSidebar();
}

function renderTerminSidebar() {
  const heuteStr = new Date().toISOString().split('T')[0];
  const alleTermine = DB.getTermine();

  // Kommende Termine
  const kommende = alleTermine
    .filter(t => t.datum >= heuteStr)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(0, 10);

  // Vergangene Termine ohne Anwesenheit (Quick-Mark)
  const ohneAnwesenheit = alleTermine
    .filter(t => t.datum < heuteStr && t.schuelerId && !t.anwesenheit)
    .sort((a, b) => b.datum.localeCompare(a.datum))
    .slice(0, 5);

  const container = document.getElementById('naechste-termine');
  let html = '';

  // Quick-Mark Sektion für vergangene Termine
  if (ohneAnwesenheit.length > 0) {
    html += `<div style="padding:10px 12px;background:#FEF3C7;border-bottom:1px solid #FDE68A;">
      <div style="font-size:12px;font-weight:700;color:#92400E;margin-bottom:8px;">📋 Anwesenheit erfassen</div>`;
    ohneAnwesenheit.forEach(t => {
      const schueler = DB.getSchuelerById(t.schuelerId);
      const name = schueler ? `${schueler.vorname} ${schueler.nachname}` : 'Unbekannt';
      html += `<div style="padding:6px 0;border-bottom:1px solid #FDE68A50;display:flex;flex-direction:column;gap:4px;">
        <div style="font-size:11px;color:#78350F;">${formatDatum(t.datum)} · ${name} · ${t.titel}</div>
        <div style="display:flex;gap:4px;flex-wrap:wrap;">
          <button onclick="markAnwesenheit('${t.id}','anwesend')" style="font-size:10px;padding:2px 6px;border:1px solid #10B981;background:#ECFDF5;color:#065F46;border-radius:4px;cursor:pointer;">✅</button>
          <button onclick="markAnwesenheit('${t.id}','abwesend-entschuldigt')" style="font-size:10px;padding:2px 6px;border:1px solid #F59E0B;background:#FEF3C7;color:#92400E;border-radius:4px;cursor:pointer;">📨</button>
          <button onclick="markAnwesenheit('${t.id}','abwesend-unentschuldigt')" style="font-size:10px;padding:2px 6px;border:1px solid #EF4444;background:#FEF2F2;color:#991B1B;border-radius:4px;cursor:pointer;">❌</button>
          <button onclick="markAnwesenheit('${t.id}','abgesagt')" style="font-size:10px;padding:2px 6px;border:1px solid #6B7280;background:#F3F4F6;color:#374151;border-radius:4px;cursor:pointer;">🚫</button>
        </div>
      </div>`;
    });
    html += '</div>';
  }

  // Kommende Termine
  if (kommende.length === 0 && ohneAnwesenheit.length === 0) {
    container.innerHTML = '<div style="padding:16px;color:var(--text-muted);font-size:13px;">Keine bevorstehenden Termine</div>';
    return;
  }

  html += kommende.map(t => {
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

  container.innerHTML = html;
}

function markAnwesenheit(terminId, status) {
  DB.updateTermin(terminId, { anwesenheit: status });
  const statusLabel = ANWESENHEIT_STATUS[status]?.label || status;
  showToast(`${ANWESENHEIT_STATUS[status]?.icon || '✓'} ${statusLabel}`, 'success');
  renderKalender();
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
    const severityColor = { low: '#065F46', medium: '#854D0E', high: '#991B1B', urgent: '#7F1D1D' };
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
              ${phase.themen.map(t => `<span style="font-size:10px;padding:1px 6px;border-radius:8px;background:${t.status==='abgeschlossen'?'#DCFCE7':'#F3F4F6'};color:${t.status==='abgeschlossen'?'#065F46':'#374151'};">${t.status==='abgeschlossen'?'✓':' '} ${getThemaTitel(t.id)}</span>`).join('')}
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
            const farbe = w.score <= 3 ? '#EF4444' : w.score <= 5 ? '#F59E0B' : '#10B981';
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

  // -- Kontaktlog Section --
  const kontakte = DB.getKontakte(schuelerId).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  let kontaktHTML = '';
  if (kontakte.length > 0) {
    const offeneNachfass = kontakte.filter(k => k.nachfassDatum && new Date(k.nachfassDatum) >= new Date());
    kontaktHTML = `
      <div class="section">
        <div class="section-title">📞 Kontaktlog (${kontakte.length} Kontakte)</div>
        ${offeneNachfass.length > 0 ? `<div style="margin-bottom:8px;padding:6px 10px;background:#FEF3C7;border:1px solid #FDE68A;border-radius:6px;font-size:10px;color:#92400E;">⏰ ${offeneNachfass.length} offene Nachfass-Termine</div>` : ''}
        ${kontakte.slice(0, 5).map(k => {
          const artIcons = { telefon: '📞', email: '📧', vor_ort: '🏠', meeting: '🤝' };
          return `<div style="padding:4px 0;border-bottom:1px solid #F3F4F6;font-size:11px;">
            <div style="display:flex;align-items:center;gap:6px;">
              <span>${artIcons[k.art] || '📋'}</span>
              <strong>${escapeHtml(k.kontaktperson || '—')}</strong>
              <span style="color:#6B7280;">${formatDatum(k.datum)}${k.dauer ? ' · ' + k.dauer + ' Min.' : ''}</span>
            </div>
            ${k.inhalt ? `<div style="color:#374151;margin-top:2px;padding-left:22px;">${escapeHtml(k.inhalt.substring(0, 150))}${k.inhalt.length > 150 ? '...' : ''}</div>` : ''}
            ${k.vereinbarungen ? `<div style="color:#059669;font-size:10px;margin-top:2px;padding-left:22px;">📌 ${escapeHtml(k.vereinbarungen.substring(0, 100))}</div>` : ''}
          </div>`;
        }).join('')}
        ${kontakte.length > 5 ? `<div style="font-size:10px;color:#9CA3AF;margin-top:4px;">+ ${kontakte.length - 5} weitere Kontakte</div>` : ''}
      </div>`;
  }

  // -- Verlauf-Tracker Section --
  const verlaufDaten = DB.getVerlauf(schuelerId).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  let verlaufHTML = '';
  if (verlaufDaten.length > 0 && typeof VERLAUF_ITEMS !== 'undefined') {
    const letzter = verlaufDaten[verlaufDaten.length - 1];
    const vorLetzter = verlaufDaten.length >= 2 ? verlaufDaten[verlaufDaten.length - 2] : null;
    verlaufHTML = `
      <div class="section">
        <div class="section-title">📊 Verlauf-Tracker (${verlaufDaten.length} Einträge, letzter: ${formatDatum(letzter.datum)})</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${VERLAUF_ITEMS.map(item => {
            const wert = letzter.werte[item.id] || 0;
            const vorWert = vorLetzter ? (vorLetzter.werte[item.id] || 0) : null;
            const trend = vorWert !== null ? (wert > vorWert ? '↑' : wert < vorWert ? '↓' : '→') : '';
            const trendFarbe = trend === '↑' ? '#10B981' : trend === '↓' ? '#EF4444' : '#6B7280';
            const wertFarbe = wert <= 3 ? '#EF4444' : wert <= 5 ? '#F59E0B' : '#10B981';
            return `<span style="display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:10px;font-size:11px;background:${wertFarbe}12;border:1px solid ${wertFarbe}30;">
              ${item.icon} ${item.label}: <strong style="color:${wertFarbe};">${wert}/10</strong>
              ${trend ? `<span style="color:${trendFarbe};font-weight:700;">${trend}</span>` : ''}
            </span>`;
          }).join('')}
        </div>
      </div>`;
  }

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
          <div style="font-size:9px;color:#9CA3AF;margin-top:3px;">Pathways · ${new Date().toLocaleDateString('de-DE')}</div>
        </div>
      </div>

      <div class="stat-row">
        <span class="stat-chip" style="background:#DCFCE7;color:#065F46;">✅ ${abgeschlossen} abgeschlossen</span>
        <span class="stat-chip" style="background:#DBEAFE;color:#1D4ED8;">◐ ${inBearbeitung} in Bearbeitung</span>
        <span class="stat-chip" style="background:#FEF3C7;color:#92400E;">💬 ${notizen.length} Notizen</span>
        <span class="stat-chip" style="background:#F3F4F6;color:#374151;">🎯 ${(s.ziele||[]).length} Ziele</span>
        ${screenings.length ? `<span class="stat-chip" style="background:#DBEAFE;color:#4338CA;">🔍 ${screenings.length} Screening(s)</span>` : ''}
      </div>

      ${s.allgemeineNotizen ? `<div class="section"><div class="section-title">ℹ️ Allgemeine Informationen</div><div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:6px;padding:8px;font-size:11px;">${escapeHtml(s.allgemeineNotizen)}</div></div>` : ''}

      ${screeningHTML}
      ${staerkenHTML}
      ${wbHTML}
      ${verlaufHTML}
      ${kontaktHTML}

      <div class="section">
        <div class="section-title">📋 Bearbeitete Themen</div>
        ${themenHTML || '<p style="color:#9CA3AF;font-size:11px;">Noch keine Themen bearbeitet</p>'}
      </div>

      <div class="section">
        <div class="section-title">🎯 Ziele</div>
        ${zieleHTML}
      </div>

      ${roadmapHTML}

      <div class="footer">Vertraulich · Pathways · Erstellt am ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}</div>
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
function exportProfilPDF(schuelerId) {
  const s = DB.getSchuelerById(schuelerId);
  if (!s) return;

  const notizen = DB.getNotizen(schuelerId).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const screenings = DB.getScreenings(schuelerId).filter(sc => sc.abgeschlossen).sort((a, b) => b.datum.localeCompare(a.datum));
  const ff = DB.getFallformulierung(schuelerId);
  const roadmap = DB.getRoadmap(schuelerId);
  const wb = DB.getWohlbefinden(schuelerId).sort((a, b) => a.datum.localeCompare(b.datum));
  const profil = s.staerkenProfil || {};

  const sec = (title, content) => content ? `<div class="sec"><div class="sec-t">${title}</div>${content}</div>` : '';

  // 5P Section
  let fivePHtml = '';
  if (ff) {
    const pDefs = [
      { key: 'presenting', label: 'Presenting', color: '#EF4444' },
      { key: 'predisposing', label: 'Predisposing', color: '#F97316' },
      { key: 'precipitating', label: 'Precipitating', color: '#EAB308' },
      { key: 'perpetuating', label: 'Perpetuating', color: '#2563EB' },
      { key: 'protective', label: 'Protective', color: '#10B981' },
    ];
    fivePHtml = pDefs.map(p => {
      const items = ff[p.key] || [];
      if (items.length === 0) return '';
      return `<div style="margin-bottom:8px;"><strong style="color:${p.color};">${p.label}:</strong> ${items.map(i => `<span class="tag" style="border-color:${p.color}30;color:${p.color};">${escapeHtml(i)}</span>`).join(' ')}</div>`;
    }).join('');
    if (ff.hypothese) {
      fivePHtml += `<div style="margin-top:8px;padding:8px 10px;background:#F9FAFB;border-radius:6px;font-size:10px;font-style:italic;white-space:pre-wrap;">${escapeHtml(ff.hypothese)}</div>`;
    }
  }

  // Screening
  let scrHtml = '';
  if (screenings.length > 0) {
    const scr = screenings[0];
    const flagged = scr.flaggedAreas || [];
    scrHtml = `<div>Datum: ${formatDatum(scr.datum)} · ${flagged.length} auffällige Bereiche</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;">${flagged.map(fId => {
        const d = SCREENING_DOMAINS.find(dd => dd.id === fId);
        return d ? `<span class="tag">${d.icon} ${d.label} (${scr.scores[d.id]||0})</span>` : '';
      }).join('')}</div>`;
  }

  // Stärken
  const ratings = profil.ratings || {};
  const ratedDims = (typeof STAERKEN_DIMENSIONEN !== 'undefined' ? STAERKEN_DIMENSIONEN : []).filter(d => (ratings[d.id] || 0) > 0);
  let staerkenHtml = ratedDims.length > 0 ? `<div style="display:flex;flex-wrap:wrap;gap:4px;">${ratedDims.sort((a,b) => ratings[b.id]-ratings[a.id]).map(d =>
    `<span class="tag">${d.icon} ${d.label}: ${ratings[d.id]}/10</span>`).join('')}</div>` : '';

  // Roadmap
  let roadmapHtml = '';
  if (roadmap && roadmap.phasen) {
    roadmapHtml = roadmap.phasen.filter(p => p.themen.length > 0 || p.status !== 'offen').map(p => {
      const pDef = ROADMAP_PHASEN.find(rp => rp.nr === p.nr);
      return `<div style="margin-bottom:4px;"><strong>${pDef ? pDef.label : 'Phase ' + p.nr}:</strong> ${p.status} ${p.themen.length > 0 ? '(' + p.themen.join(', ') + ')' : ''}</div>`;
    }).join('');
  }

  // Notizen (letzte 10)
  const notizenHtml = notizen.slice(0, 10).map(n => {
    const kat = n.kategorie === 'session' ? '💬' : n.kategorie === 'fortschritt' ? '📈' : n.kategorie === 'krise' ? '🚨' : '📝';
    return `<div style="padding:6px 0;border-bottom:1px solid #eee;font-size:10px;">
      <strong>${kat} ${formatDatum(n.datum)}</strong> — ${escapeHtml((n.inhalt || '').substring(0, 200))}${(n.inhalt||'').length > 200 ? '...' : ''}
    </div>`;
  }).join('');

  // Wohlbefinden
  let wbHtml = '';
  if (wb.length > 0) {
    wbHtml = `<div style="display:flex;gap:8px;flex-wrap:wrap;">${wb.slice(-8).map(w =>
      `<span class="tag">${formatDatum(w.datum)}: ${w.gesamt || '—'}/10</span>`
    ).join('')}</div>`;
  }

  // Kontaktlog
  const kontakte2 = DB.getKontakte(schuelerId).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  let kontaktHtml = '';
  if (kontakte2.length > 0) {
    const artIcons = { telefon: '📞', email: '📧', vor_ort: '🏠', meeting: '🤝' };
    kontaktHtml = kontakte2.slice(0, 5).map(k =>
      `<div style="padding:3px 0;border-bottom:1px solid #eee;font-size:10px;">${artIcons[k.art] || '📋'} <strong>${escapeHtml(k.kontaktperson || '—')}</strong> · ${formatDatum(k.datum)}${k.inhalt ? ' — ' + escapeHtml(k.inhalt.substring(0, 120)) : ''}</div>`
    ).join('') + (kontakte2.length > 5 ? `<div style="font-size:9px;color:#9CA3AF;">+ ${kontakte2.length - 5} weitere</div>` : '');
  }

  // Verlauf-Tracker
  const verlauf2 = DB.getVerlauf(schuelerId).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  let verlaufHtml = '';
  if (verlauf2.length > 0 && typeof VERLAUF_ITEMS !== 'undefined') {
    const letzter = verlauf2[verlauf2.length - 1];
    const vorLetzter = verlauf2.length >= 2 ? verlauf2[verlauf2.length - 2] : null;
    verlaufHtml = `<div style="display:flex;flex-wrap:wrap;gap:4px;">${VERLAUF_ITEMS.map(item => {
      const w = letzter.werte[item.id] || 0;
      const vw = vorLetzter ? (vorLetzter.werte[item.id] || 0) : null;
      const trend = vw !== null ? (w > vw ? '↑' : w < vw ? '↓' : '→') : '';
      return `<span class="tag">${item.icon} ${item.label}: ${w}/10 ${trend}</span>`;
    }).join('')}</div>`;
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8">
    <title>Fallbericht — ${s.vorname} ${s.nachname}</title>
    <style>
      *{margin:0;padding:0;box-sizing:border-box;}
      body{font-family:'Segoe UI',system-ui,sans-serif;background:#fff;color:#1F2937;padding:20mm 18mm;font-size:11px;line-height:1.5;}
      h1{font-size:18px;color:#1e3a5f;margin-bottom:2px;}
      .meta{font-size:10px;color:#6B7280;}
      .header{display:flex;align-items:center;gap:14px;border-bottom:2px solid #1e3a5f;padding-bottom:10px;margin-bottom:16px;}
      .avatar{width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#1e3a5f,#3A7AB8);display:flex;align-items:center;justify-content:center;color:white;font-size:18px;font-weight:700;flex-shrink:0;}
      .sec{margin-bottom:14px;}
      .sec-t{font-size:12px;font-weight:700;color:#1e3a5f;border-bottom:1px solid #E5E7EB;padding-bottom:3px;margin-bottom:6px;}
      .tag{display:inline-block;padding:2px 7px;border:1px solid #ddd;border-radius:10px;font-size:9px;margin:1px;}
      .footer{text-align:center;font-size:8px;color:#9CA3AF;border-top:1px solid #E5E7EB;padding-top:8px;margin-top:20px;}
      .no-print{text-align:center;margin-bottom:16px;}
      @media print{.no-print{display:none;}body{padding:15mm;}}
    </style>
  </head><body>
    <div class="no-print">
      <button onclick="window.print()" style="padding:10px 24px;background:#1e3a5f;color:white;border:none;border-radius:8px;cursor:pointer;font-size:13px;font-weight:600;">📄 Als PDF speichern (Drucker → "Als PDF speichern" wählen)</button>
    </div>
    <div class="header">
      <div class="avatar">${getInitials(s.vorname, s.nachname)}</div>
      <div>
        <h1>Fallbericht — ${s.vorname} ${s.nachname}</h1>
        <div class="meta">Klasse: ${s.klasse||'—'} · ${alter(s.geburtsdatum)} · Risiko: ${capitalize(s.risiko||'niedrig')} · Erstellt: ${formatDatum(new Date().toISOString().split('T')[0])}</div>
      </div>
    </div>
    ${sec('🔍 Screening', scrHtml)}
    ${sec('🧩 5P-Fallformulierung', fivePHtml)}
    ${sec('💪 Stärken & Ressourcen', staerkenHtml)}
    ${sec('🗺️ Förderplan', roadmapHtml)}
    ${sec('😊 Wohlbefinden-Verlauf', wbHtml)}
    ${sec('📊 Verlauf-Tracker', verlaufHtml)}
    ${sec('📞 Kontaktlog (' + kontakte2.length + ')', kontaktHtml)}
    ${sec('📋 Sitzungsnotizen (letzte 10)', notizenHtml)}
    <div class="footer">Vertraulich · Pathways · ${new Date().toLocaleDateString('de-DE')} ${new Date().toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})}</div>
  </body></html>`;

  const win = window.open('', '_blank');
  if (!win) { showToast('Pop-up blockiert — bitte Pop-ups erlauben', 'error'); return; }
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 800);
}

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
    verlauf: DB.getVerlauf(),
    kontakte: DB.getKontakte(),
    risiko: DB.getRisiko(),
  };
  const json = JSON.stringify(daten, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `pathways-backup-${new Date().toISOString().split('T')[0]}.json`;
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
      showConfirm(
        `Datei: ${file.name}<br>` +
        `Exportiert am: ${exportiertAm}<br>` +
        `Inhalt: ${daten.schueler.length} Klienten, ${daten.notizen?.length || 0} Notizen<br><br>` +
        `Zusammenführen mit bestehenden Daten?`,
        () => { doImportMerge(daten); }
      );
    } catch (err) {
      showToast('Import fehlgeschlagen: ' + err.message, 'error');
    }
  };
  reader.readAsText(file);
}

function doImportMerge(daten) {
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

      // Verlauf zusammenführen
      if (daten.verlauf) {
        const lokalVIds = new Set(DB.getVerlauf().map(v => v.id));
        const alleV = [...DB.getVerlauf(), ...daten.verlauf.filter(v => !lokalVIds.has(v.id))];
        localStorage.setItem(DB.KEYS.VERLAUF, JSON.stringify(alleV));
      }

      // Kontakte zusammenführen
      if (daten.kontakte) {
        const lokalKIds = new Set(DB.getKontakte().map(k => k.id));
        const alleK = [...DB.getKontakte(), ...daten.kontakte.filter(k => !lokalKIds.has(k.id))];
        localStorage.setItem(DB.KEYS.KONTAKTE, JSON.stringify(alleK));
      }

      // Risiko zusammenführen
      if (daten.risiko) {
        const lokalRisikoIds = new Set(DB.getRisiko().map(r => r.id));
        const alleRisiko = [...DB.getRisiko(), ...daten.risiko.filter(r => !lokalRisikoIds.has(r.id))];
        localStorage.setItem(DB.KEYS.RISIKO, JSON.stringify(alleRisiko));
      }

      renderSidebar();
      renderHome();
      showToast(`Import erfolgreich: ${lokalMap.size} Klienten gesamt`, 'success');
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
      compressImage(ev.target.result, 200, 0.6, compressed => {
        DB.updateSchueler(schuelerId, { foto: compressed });
        renderProfil(schuelerId);
        renderSidebar();
        showToast('Foto gespeichert (komprimiert)', 'success');
      });
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
        <div style="background:#EFF6FF;border:1px solid #BAE6FD;border-radius:var(--radius-sm);padding:14px;margin-bottom:14px;">
          <div style="font-weight:700;font-size:13px;color:#1D4ED8;margin-bottom:10px;">${icon('clipboard', 16)} Sofort-Handlungsweg</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${arbeitsblaetter.length > 0 ? arbeitsblaetter.map(ab => `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="width:20px;height:20px;border-radius:50%;background:#1D4ED8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">1</span>
                <span><strong>Arbeitsblatt:</strong> ${ab.titel}</span>
                <a href="arbeitsblaetter/${ab.datei}" target="_blank" style="margin-left:auto;color:#1D4ED8;font-size:11px;">Öffnen →</a>
              </div>
            `).join('') : '<div style="font-size:12px;color:#6B7280;">Kein Arbeitsblatt verfügbar</div>'}
            ${therapieModul ? `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="width:20px;height:20px;border-radius:50%;background:#1D4ED8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">2</span>
                <span><strong>Therapiemodul:</strong> Detaillierter Sitzungsleitfaden</span>
                <a href="therapie-module/${therapieModul}" target="_blank" style="margin-left:auto;color:#1D4ED8;font-size:11px;">Öffnen →</a>
              </div>
            ` : ''}
            ${fachkraftModul ? `
              <div style="display:flex;align-items:center;gap:8px;font-size:12px;">
                <span style="width:20px;height:20px;border-radius:50%;background:#1D4ED8;color:#fff;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">3</span>
                <span><strong>Fachkraft-Hintergrund:</strong> Klinisches Wissen</span>
                <a href="fachkraft-module/${fachkraftModul}" target="_blank" style="margin-left:auto;color:#1D4ED8;font-size:11px;">Öffnen →</a>
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

// ── Safety-Kaskade: Cross-Tool Risiko-Eskalation ──
function checkSafetyEscalation(schuelerId) {
  const sid = schuelerId || APP.currentSchuelerId;
  if (!sid) return { active: false, alerts: [] };

  const alerts = [];

  // 1. Risiko-Monitor: Rot in C-SSRS oder Kindeswohl
  try {
    const risikoDaten = DB.getRisiko(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
    if (risikoDaten.length > 0) {
      const letzter = risikoDaten[0];
      const cssrsItems = RISIKO_ITEMS.filter(i => i.kategorie === 'cssrs');
      const cssrsRot = cssrsItems.filter(i => letzter.werte[i.id] === 'rot');
      if (cssrsRot.length > 0) {
        alerts.push({ typ: 'suizid', stufe: 'akut', label: 'Suizidalitäts-Alarm', detail: cssrsRot.map(i => i.label).join(', '), farbe: '#7F1D1D', icon: '🚑' });
      }
      const kindeswohlItems = RISIKO_ITEMS.filter(i => i.kategorie === 'kindeswohl');
      const kindeswohlRot = kindeswohlItems.filter(i => letzter.werte[i.id] === 'rot');
      if (kindeswohlRot.length > 0) {
        alerts.push({ typ: 'kindeswohl', stufe: 'meldung', label: 'Kindeswohlgefährdung', detail: kindeswohlRot.map(i => i.label).join(', '), farbe: '#4F46E5', icon: '⚖️' });
      }
    }
  } catch(e) { /* silent */ }

  // 2. Screening: Krise-Level
  try {
    const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen).sort((a, b) => b.datum.localeCompare(a.datum));
    if (screenings.length > 0 && screenings[0].severity === 'urgent') {
      alerts.push({ typ: 'screening', stufe: 'urgent', label: 'Screening: Dringend', detail: 'Letztes Screening ergab dringende Auffälligkeiten', farbe: '#DC2626', icon: '🔍' });
    }
  } catch(e) { /* silent */ }

  // 3. Hypothesen: Suizid-/Selbstverletzungs-Hypothese aktiv
  try {
    const hypothesen = generateHypothesen(sid);
    const suizidHypo = hypothesen.find(h => h.typ === 'risiko' && h._konfidenz >= 60 &&
      (h.id || '').match(/suizid|selbstverletz|autolyse/i));
    if (suizidHypo) {
      alerts.push({ typ: 'hypothese', stufe: 'hoch', label: 'Hypothese: ' + suizidHypo.titel, detail: 'Konfidenz ' + suizidHypo._konfidenz + '%', farbe: '#991B1B', icon: '🧠' });
    }
  } catch(e) { /* silent */ }

  // 4. Verlauf: Starke Verschlechterung
  try {
    const verlaufDaten = DB.getVerlauf(sid).sort((a, b) => new Date(a.datum) - new Date(b.datum));
    if (verlaufDaten.length >= 2) {
      const letzter = verlaufDaten[verlaufDaten.length - 1];
      const vorLetzter = verlaufDaten[verlaufDaten.length - 2];
      let starkVerschlechtert = 0;
      VERLAUF_ITEMS.forEach(item => {
        const diff = (letzter.werte[item.id] || 5) - (vorLetzter.werte[item.id] || 5);
        if (diff <= -3) starkVerschlechtert++;
      });
      if (starkVerschlechtert >= 3) {
        alerts.push({ typ: 'verlauf', stufe: 'warnung', label: 'Starke Verlaufs-Verschlechterung', detail: starkVerschlechtert + ' Dimensionen stark verschlechtert', farbe: '#EA580C', icon: '📉' });
      }
    }
  } catch(e) { /* silent */ }

  return { active: alerts.length > 0, alerts };
}

function renderSafetyBanner(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const { active, alerts } = checkSafetyEscalation();
  if (!active) { container.innerHTML = ''; return; }

  const akut = alerts.find(a => a.stufe === 'akut');
  const bannerFarbe = akut ? '#7F1D1D' : '#DC2626';

  let html = `<div class="safety-banner" style="padding:12px 16px;background:${bannerFarbe}10;border:2px solid ${bannerFarbe};border-radius:10px;margin-bottom:12px;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <span style="font-size:18px;">${akut ? '🚑' : '🚨'}</span>
      <strong style="color:${bannerFarbe};font-size:14px;">${akut ? 'AKUTE KRISE — Sofortige Intervention erforderlich' : 'Sicherheits-Warnung — Handlungsbedarf'}</strong>
    </div>
    ${alerts.map(a => `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:12px;">
      <span>${a.icon}</span>
      <strong style="color:${a.farbe};">${a.label}</strong>
      <span style="color:#6B7280;">${a.detail}</span>
    </div>`).join('')}
    <div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap;">
      <button class="btn btn-xs" style="background:${bannerFarbe};color:#fff;border:none;" onclick="showPhase('begleitung');setTimeout(()=>showSubTab('themen'),100);setTimeout(()=>quickStartSession('krisenintervention'),300);">Krisenintervention starten</button>
      <button class="btn btn-xs" style="background:#fff;color:${bannerFarbe};border:1px solid ${bannerFarbe};" onclick="showPhase('auswertung');setTimeout(()=>showSubTab('verlauf-tracker'),100);">Risiko-Check öffnen</button>
    </div>
  </div>`;
  container.innerHTML = html;
}

// ── ORS/SRS Outcome-Verlauf Widget ──
function renderOutcomeVerlauf() {
  const container = document.getElementById('outcome-verlauf-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) { container.innerHTML = ''; return; }

  const notizen = DB.getNotizen(sid)
    .filter(n => n.soap && (n.soap.ors || n.soap.srs))
    .sort((a, b) => a.datum.localeCompare(b.datum));

  if (notizen.length < 2) {
    container.innerHTML = notizen.length === 0 ? '' : `
      <div class="card" style="padding:16px;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:700;margin-bottom:8px;">📈 Outcome-Verlauf</div>
        <div style="font-size:12px;color:var(--text-muted);">Mindestens 2 Sitzungen mit ORS/SRS nötig für den Verlaufsgraph.</div>
      </div>`;
    return;
  }

  // Daten sammeln
  const punkte = notizen.map((n, i) => ({
    nr: i + 1,
    datum: n.datum,
    ors: n.soap.ors ? n.soap.ors.total : null,
    srs: n.soap.srs ? n.soap.srs.total : null,
  }));

  // SVG-Chart generieren
  const W = 400, H = 180, PAD = { top: 20, right: 20, bottom: 30, left: 35 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = punkte.length;
  const xStep = n > 1 ? chartW / (n - 1) : chartW;

  function y(val) { return PAD.top + chartH - (val / 40) * chartH; }
  function x(i) { return PAD.left + i * xStep; }

  // ORS-Linie
  let orsPath = '', orsDots = '';
  let orsFirst = true;
  punkte.forEach((p, i) => {
    if (p.ors !== null) {
      orsPath += (orsFirst ? 'M' : 'L') + `${x(i).toFixed(1)},${y(p.ors).toFixed(1)} `;
      orsDots += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.ors).toFixed(1)}" r="4" fill="#3B82F6" stroke="#fff" stroke-width="1.5"/>`;
      orsFirst = false;
    }
  });

  // SRS-Linie
  let srsPath = '', srsDots = '';
  let srsFirst = true;
  punkte.forEach((p, i) => {
    if (p.srs !== null) {
      srsPath += (srsFirst ? 'M' : 'L') + `${x(i).toFixed(1)},${y(p.srs).toFixed(1)} `;
      srsDots += `<circle cx="${x(i).toFixed(1)}" cy="${y(p.srs).toFixed(1)}" r="4" fill="#8B5CF6" stroke="#fff" stroke-width="1.5"/>`;
      srsFirst = false;
    }
  });

  // Cutoff-Linien
  const orsCutoffY = y(28).toFixed(1);
  const srsCutoffY = y(36).toFixed(1);

  // Y-Achsen-Labels
  let yLabels = '';
  [0, 10, 20, 30, 40].forEach(v => {
    yLabels += `<text x="${PAD.left - 5}" y="${y(v).toFixed(1)}" text-anchor="end" font-size="9" fill="#9CA3AF" dominant-baseline="middle">${v}</text>`;
    yLabels += `<line x1="${PAD.left}" y1="${y(v).toFixed(1)}" x2="${W - PAD.right}" y2="${y(v).toFixed(1)}" stroke="#E5E7EB" stroke-width="0.5"/>`;
  });

  // X-Achsen-Labels
  let xLabels = '';
  const maxLabels = Math.min(n, 8);
  const labelStep = n > maxLabels ? Math.ceil(n / maxLabels) : 1;
  punkte.forEach((p, i) => {
    if (i % labelStep === 0 || i === n - 1) {
      const d = p.datum.substring(5).replace('-', '/');
      xLabels += `<text x="${x(i).toFixed(1)}" y="${H - 5}" text-anchor="middle" font-size="9" fill="#9CA3AF">${d}</text>`;
    }
  });

  // Trend-Berechnung
  const orsWerte = punkte.filter(p => p.ors !== null).map(p => p.ors);
  const srsWerte = punkte.filter(p => p.srs !== null).map(p => p.srs);
  const orsTrend = orsWerte.length >= 2 ? orsWerte[orsWerte.length - 1] - orsWerte[0] : 0;
  const srsTrend = srsWerte.length >= 2 ? srsWerte[srsWerte.length - 1] - srsWerte[0] : 0;
  const trendIcon = v => v > 2 ? '↑' : v < -2 ? '↓' : '→';
  const trendColor = v => v > 2 ? '#10B981' : v < -2 ? '#EF4444' : '#F59E0B';

  const aktuellORS = orsWerte.length > 0 ? orsWerte[orsWerte.length - 1] : null;
  const aktuellSRS = srsWerte.length > 0 ? srsWerte[srsWerte.length - 1] : null;

  container.innerHTML = sanitize(`
    <div class="card" style="padding:16px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <div style="font-size:14px;font-weight:700;">📈 Outcome-Verlauf</div>
        <div style="display:flex;gap:12px;font-size:12px;">
          ${aktuellORS !== null ? `<span style="color:#3B82F6;font-weight:600;">ORS ${aktuellORS}/40 <span style="color:${trendColor(orsTrend)}">${trendIcon(orsTrend)}</span></span>` : ''}
          ${aktuellSRS !== null ? `<span style="color:#8B5CF6;font-weight:600;">SRS ${aktuellSRS}/40 <span style="color:${trendColor(srsTrend)}">${trendIcon(srsTrend)}</span></span>` : ''}
        </div>
      </div>
      <svg viewBox="0 0 ${W} ${H}" style="width:100%;height:auto;max-height:200px;">
        ${yLabels}
        ${xLabels}
        <line x1="${PAD.left}" y1="${orsCutoffY}" x2="${W - PAD.right}" y2="${orsCutoffY}" stroke="#3B82F6" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
        <text x="${W - PAD.right + 2}" y="${orsCutoffY}" font-size="8" fill="#3B82F6" dominant-baseline="middle">28</text>
        <line x1="${PAD.left}" y1="${srsCutoffY}" x2="${W - PAD.right}" y2="${srsCutoffY}" stroke="#8B5CF6" stroke-width="1" stroke-dasharray="4,3" opacity="0.5"/>
        <text x="${W - PAD.right + 2}" y="${srsCutoffY}" font-size="8" fill="#8B5CF6" dominant-baseline="middle">36</text>
        ${orsPath ? `<path d="${orsPath}" fill="none" stroke="#3B82F6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        ${srsPath ? `<path d="${srsPath}" fill="none" stroke="#8B5CF6" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>` : ''}
        ${orsDots}
        ${srsDots}
      </svg>
      <div style="display:flex;gap:16px;justify-content:center;margin-top:8px;font-size:11px;color:var(--text-muted);">
        <span><span style="display:inline-block;width:12px;height:3px;background:#3B82F6;border-radius:2px;vertical-align:middle;margin-right:4px;"></span>ORS (Befindlichkeit)</span>
        <span><span style="display:inline-block;width:12px;height:3px;background:#8B5CF6;border-radius:2px;vertical-align:middle;margin-right:4px;"></span>SRS (Sitzungsqualität)</span>
        <span style="opacity:0.6;">--- Klinischer Cutoff</span>
      </div>
      <div style="font-size:11px;color:var(--text-muted);margin-top:6px;text-align:center;">${punkte.length} Sitzungen erfasst</div>
    </div>
  `);
}

// ── Anwesenheits-Widget (Profil-Dashboard) ──
function renderAnwesenheitWidget() {
  const container = document.getElementById('anwesenheit-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) { container.innerHTML = ''; return; }

  const heute = new Date().toISOString().split('T')[0];
  const termine = DB.getTermine(sid)
    .filter(t => t.schuelerId === sid && t.datum <= heute)
    .sort((a, b) => b.datum.localeCompare(a.datum));

  if (termine.length === 0) { container.innerHTML = ''; return; }

  const mitStatus = termine.filter(t => t.anwesenheit);
  const anwesend = mitStatus.filter(t => t.anwesenheit === 'anwesend').length;
  const rate = mitStatus.length > 0 ? Math.round((anwesend / mitStatus.length) * 100) : null;

  // Konsekutive No-Shows
  let konsekutivNoShow = 0;
  for (const t of termine) {
    if (t.anwesenheit === 'abwesend-unentschuldigt') konsekutivNoShow++;
    else if (t.anwesenheit) break;
  }

  // Letzte 10 Termine als Mini-Balken
  const letzte10 = termine.slice(0, 10).reverse();
  const farben = {
    'anwesend': '#10B981',
    'abwesend-unentschuldigt': '#EF4444',
    'abwesend-entschuldigt': '#F59E0B',
    'abgesagt': '#6B7280',
    'verschoben': '#3B82F6',
  };

  const balken = letzte10.map(t => {
    const f = t.anwesenheit ? (farben[t.anwesenheit] || '#D1D5DB') : '#D1D5DB';
    const label = t.anwesenheit ? (ANWESENHEIT_STATUS[t.anwesenheit]?.label || '') : 'Nicht erfasst';
    return `<div title="${t.datum}: ${label}" style="flex:1;height:20px;background:${f};border-radius:3px;min-width:8px;"></div>`;
  }).join('');

  const rateColor = rate === null ? '#9CA3AF' : rate >= 80 ? '#10B981' : rate >= 60 ? '#F59E0B' : '#EF4444';
  const noShowAlert = konsekutivNoShow >= 2
    ? `<div style="margin-top:8px;padding:6px 10px;background:#FEF2F2;border:1px solid #FECACA;border-radius:6px;font-size:11px;color:#991B1B;">
        ⚠️ <strong>${konsekutivNoShow} aufeinanderfolgende Fehltermine</strong> — Kontakt aufnehmen empfohlen
       </div>`
    : '';

  container.innerHTML = sanitize(`
    <div class="card" style="padding:16px;margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <div style="font-size:14px;font-weight:700;">📅 Anwesenheit</div>
        ${rate !== null ? `<span style="font-size:18px;font-weight:700;color:${rateColor};">${rate}%</span>` : '<span style="font-size:12px;color:#9CA3AF;">Noch nicht erfasst</span>'}
      </div>
      <div style="display:flex;gap:3px;margin-bottom:6px;">${balken}</div>
      <div style="display:flex;gap:10px;font-size:10px;color:var(--text-muted);flex-wrap:wrap;">
        <span><span style="display:inline-block;width:8px;height:8px;background:#10B981;border-radius:2px;vertical-align:middle;margin-right:3px;"></span>Anwesend</span>
        <span><span style="display:inline-block;width:8px;height:8px;background:#EF4444;border-radius:2px;vertical-align:middle;margin-right:3px;"></span>Unentsch.</span>
        <span><span style="display:inline-block;width:8px;height:8px;background:#F59E0B;border-radius:2px;vertical-align:middle;margin-right:3px;"></span>Entsch.</span>
        <span><span style="display:inline-block;width:8px;height:8px;background:#D1D5DB;border-radius:2px;vertical-align:middle;margin-right:3px;"></span>Nicht erfasst</span>
      </div>
      ${noShowAlert}
    </div>
  `);
}

function renderDashboard() {
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;

  // === PRIORITÄTSBASIERTE WIDGET-REIHENFOLGE ===
  // Stufe 1: Safety (nicht wegklickbar)
  renderSafetyBanner('safety-banner-dashboard');

  // Stufe 1b: Therapeutischer Zwilling — Sitzungs-Briefing
  renderSitzungsBriefing(APP.currentSchuelerId);

  // Stufe 2: Risiko-Monitoring
  renderRisikoWidget();

  // Stufe 3: Engagement-Warnung bei kritischem Status (Risiko-Schüler ohne Kontakt)
  renderKontaktNachfassWidget();

  // Stufe 4: Verlauf-Warnungen (Sudden-Change, Verschlechterung)
  renderVerlaufWidget();

  // Stufe 5: Klinische Planung
  renderSitzungsvorschlag();
  renderNaechsteSchritte();
  renderPhaseTransitionPrompt();
  renderRueckschrittAlert();

  // Stufe 5b: Follow-Up Erinnerungen & Medikation
  renderFollowUpReminders();
  renderMedikationWidget();

  // Stufe 5c: Outcome-Verlauf (ORS/SRS)
  renderOutcomeVerlauf();

  // Stufe 5d: Anwesenheits-Tracking
  renderAnwesenheitWidget();

  // Stufe 6: Allgemeine Übersicht
  renderIntakeProgress();
  renderWohlbefinden();
  renderDashKalender();
  renderDashTodo();
  renderNotizbuch();
  renderDashboardSummary();
  renderQuickEntry('quick-entry-dashboard');
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

// Quick-Action: Einzelne Hypothese direkt in 5P übernehmen
function quickHypo5P(hypoId, zielFeld) {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const regel = HYPOTHESEN_REGELN.find(r => r.id === hypoId);
  if (!regel) return;
  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);
  if (!ff[zielFeld]) ff[zielFeld] = [];
  const text = regel.titel;
  if (ff[zielFeld].includes(text)) {
    showToast(`"${text}" ist bereits in 5P (${zielFeld})`, 'info');
    return;
  }
  ff[zielFeld].push(text);
  DB.saveFallformulierung(ff);
  markDirty();
  showToast(`✓ "${text}" → 5P ${zielFeld.charAt(0).toUpperCase() + zielFeld.slice(1)}`, 'success');
}

// Quick-Action: Abklärungsempfehlung anzeigen
function quickHypoAbklaerung(hypoId) {
  const regel = HYPOTHESEN_REGELN.find(r => r.id === hypoId);
  if (!regel || !regel.empfehlung) return;
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'hypo-abklaerung-modal';
  overlay.innerHTML = `
    <div class="modal" style="max-width:480px;">
      <div class="modal-header">
        <span>⚕️</span>
        <span>Abklärungsempfehlung</span>
        <button class="modal-close" onclick="document.getElementById('hypo-abklaerung-modal').remove()">✕</button>
      </div>
      <div class="modal-body">
        <p style="font-weight:600;margin-bottom:8px;">${regel.titel}</p>
        <p style="font-size:13px;line-height:1.6;">${regel.empfehlung}</p>
        ${regel.icd10 && regel.icd10.length > 0 ? `<p style="margin-top:8px;font-size:12px;color:var(--text-muted);">ICD-10: ${regel.icd10.join(', ')}</p>` : ''}
        <div style="margin-top:12px;padding:10px;background:#FEF3C7;border-radius:8px;font-size:12px;">
          <strong>📋 Nächster Schritt:</strong> Diese Empfehlung in die nächste SOAP-Notiz (Plan) übernehmen und mit der Leitung besprechen.
        </div>
      </div>
      <div class="modal-footer" style="display:flex;justify-content:flex-end;gap:8px;padding:12px;">
        <button class="btn btn-secondary" onclick="document.getElementById('hypo-abklaerung-modal').remove()">Schliessen</button>
        <button class="btn btn-primary" onclick="quickCopyAbklaerung('${hypoId}')">📋 Text kopieren</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
}

function quickCopyAbklaerung(hypoId) {
  const regel = HYPOTHESEN_REGELN.find(r => r.id === hypoId);
  if (!regel) return;
  const text = `Abklärungsempfehlung (${regel.titel}): ${regel.empfehlung}${regel.icd10 ? ' [' + regel.icd10.join(', ') + ']' : ''}`;
  navigator.clipboard.writeText(text).then(() => {
    showToast('Empfehlung in Zwischenablage kopiert', 'success');
    document.getElementById('hypo-abklaerung-modal')?.remove();
  }).catch(() => {
    showToast('Kopieren fehlgeschlagen — bitte manuell markieren', 'warning');
  });
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
    if (h.typ === 'schutz') borderColor = '#10B981';
    else if (h.typ === 'differenzial') borderColor = '#6366F1';
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
          <button class="btn btn-sm btn-secondary" onclick="showPhase('fallakte');setTimeout(()=>showSubTab('info'),100)">
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
  const responseColor = (r) => r >= 75 ? '#10B981' : r >= 50 ? '#F59E0B' : '#EF4444';

  el.innerHTML = `
    <div class="card" style="margin-bottom:12px;">
      <div class="card-header">
        <span>💊</span>
        <div class="card-title">Treatment-Response</div>
      </div>
      <div class="card-body" style="padding:10px 14px;">
        ${analyse.bestesThema ? `
          <div style="font-size:12px;margin-bottom:8px;padding:6px 10px;background:#ECFDF5;border-radius:6px;color:#065F46;">
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
          <div style="font-size:11px;margin-top:6px;padding:4px 8px;background:#EFF6FF;border-radius:4px;color:#0C4A6E;">
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
              const color = d.diff < 0 ? '#10B981' : '#EF4444';
              return `<span style="font-size:12px;color:${color}">${icon} ${d.label}: ${d.diff < 0 ? '' : '+'}${d.prozent}%</span>`;
            }).join('')}
          </div>
        ` : ''}
        <div style="display:flex;flex-wrap:wrap;gap:4px;">
          ${deltas.map(d => {
            const diffLabel = d.diff > 0 ? `+${d.diff}` : `${d.diff}`;
            const bg = d.diff < 0 ? '#ECFDF5' : d.diff > 0 ? '#FEF2F2' : '#F9FAFB';
            return `<span class="dash-screening-chip" style="background:${bg};border-left:2px solid ${d.farbe}">${d.label}: ${d.s2} (${diffLabel})</span>`;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

// ---- DASHBOARD SUMMARY — "Alles auf einen Blick" ----
function renderIntakeProgress() {
  const container = document.getElementById('intake-progress-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const s = DB.getSchuelerById(sid);
  if (!s) { container.innerHTML = ''; return; }

  const checks = [
    { label: 'Stammdaten', done: !!(s.vorname && s.nachname && s.geburtsdatum && s.klasse), tab: 'stammdaten', icon: '📋' },
    { label: 'Screening', done: DB.getScreenings(sid).some(sc => sc.abgeschlossen), tab: 'screening', icon: '📊' },
    { label: 'Genogramm', done: (s.genogramm || []).length >= 1, tab: 'genogramm', icon: '👨‍👩‍👦' },
    { label: 'Ziel definiert', done: (s.ziele || []).length >= 1, tab: 'roadmap', icon: '🎯' },
  ];

  const done = checks.filter(c => c.done).length;
  if (done >= checks.length) { container.innerHTML = ''; return; } // Alles erledigt → ausblenden

  container.innerHTML = `
    <div style="background:#FFFBEB;border:1px solid #F59E0B;border-radius:10px;padding:12px 16px;margin-bottom:12px;">
      <div style="font-size:13px;font-weight:700;color:#92400E;margin-bottom:8px;">📝 Intake-Fortschritt (${done}/${checks.length})</div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;">
        ${checks.map(c => `
          <div onclick="showProfilTab('${c.tab}')" style="display:flex;align-items:center;gap:6px;padding:6px 10px;background:${c.done ? '#ECFDF5' : '#FFF'};border:1px solid ${c.done ? '#10B981' : '#D1D5DB'};border-radius:8px;font-size:12px;cursor:pointer;color:${c.done ? '#065F46' : '#374151'};">
            <span>${c.done ? '✅' : c.icon}</span>
            <span style="${c.done ? 'text-decoration:line-through;' : 'font-weight:500;'}">${c.label}</span>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

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
  const zielFarbe = avgZiel >= 70 ? '#10B981' : (avgZiel >= 30 ? '#F59E0B' : '#EF4444');

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
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px;border-top:3px solid ${scrFlagged > 0 ? '#EF4444' : '#10B981'};text-align:center;cursor:pointer;" onclick="showProfilTab('screening')">
        <div style="font-size:22px;margin-bottom:4px;">📊</div>
        <div style="font-size:11px;color:#6B7280;">Screening</div>
        <div style="font-size:16px;font-weight:700;color:${scrFlagged > 0 ? '#EF4444' : '#10B981'};">${screenings.length === 0 ? 'Ausstehend' : scrFlagged + ' auffällig'}</div>
        <div style="font-size:10px;color:#9CA3AF;margin-top:2px;">${screenings.length > 0 ? 'von ' + scrTotal + ' Bereichen' : 'Noch kein Screening'}</div>
      </div>
      <div style="background:#fff;border:1px solid #E5E7EB;border-radius:10px;padding:12px;border-top:3px solid ${zielFarbe};text-align:center;cursor:pointer;" onclick="showPhase('begleitung','roadmap')">
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
    <div style="margin-top:12px;padding:8px 12px;background:#F9FAFB;border-radius:8px;border:1px solid #E5E7EB;">
      <p style="font-size:10px;color:#9CA3AF;margin:0;text-align:center;line-height:1.5;">
        Pathways ist ein pädagogisches Dokumentations- und Planungstool. Es ersetzt keine psychiatrische oder psychologische Diagnostik. Screening-Ergebnisse sind Orientierungshilfen, keine Diagnosen.
      </p>
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

  // ── Sequenzierungs-Guard (K7) + Kontraindikations-Matrix: Bestimmte Themen NUR nach Voraussetzungen ──
  const SEQUENZ_REGELN = [
    { thema: 'trauma', voraussetzung: ['krisenintervention', 'emotionsregulation'],
      warnung: 'Traumaverarbeitung erst nach Stabilisierung (ISTSS 2019)' },
    { thema: 'angstanfaelle', voraussetzung: ['stress-angst', 'emotionsregulation'],
      warnung: 'Exposition erst nach Psychoedukation + Regulationsfertigkeiten' },
    { thema: 'dissoziative-erfahrungen', voraussetzung: ['emotionserkennung', 'krisenintervention'],
      warnung: 'Dissoziationsarbeit erst nach Grounding-Fertigkeiten' },
    { thema: 'suizidpraevention', voraussetzung: ['krisenintervention'],
      warnung: 'Suizidpräventive Arbeit erst nach Krisenplan-Erstellung' },
    // Erweiterte Kontraindikationen
    { thema: 'ptbs', voraussetzung: ['krisenintervention', 'emotionsregulation', 'emotionserkennung'],
      warnung: 'PTBS-Behandlung erfordert sichere therapeutische Beziehung + Emotionsregulation (NICE 2018)' },
    { thema: 'traumaverarbeitung', voraussetzung: ['krisenintervention', 'emotionsregulation'],
      warnung: 'Konfrontative Traumaarbeit erst nach Phase 1 Stabilisierung (Herman 1992)' },
    { thema: 'sexualitaet', voraussetzung: ['emotionserkennung', 'kommunikation-grenzen'],
      warnung: 'Sexualitätsthemen erst nach Aufbau von Grenzsetzungskompetenz' },
    { thema: 'familiengeheimnis', voraussetzung: ['emotionsregulation', 'krisenintervention'],
      warnung: 'Aufdeckungsarbeit erfordert Stabilisierung + Sicherheitsnetz' },
    { thema: 'trauer-verlust', voraussetzung: ['emotionserkennung'],
      warnung: 'Trauerarbeit setzt Emotionserkennungsfähigkeit voraus (Worden 2009)' },
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

  // ── Verlaufs-Warnung bei Verschlechterung ──
  let verlaufHint = '';
  try {
    const verlaufDaten = DB.getVerlauf(sid).sort((a, b) => new Date(a.datum) - new Date(b.datum));
    if (verlaufDaten.length >= 2) {
      const letzter = verlaufDaten[verlaufDaten.length - 1];
      const vorLetzter = verlaufDaten[verlaufDaten.length - 2];
      let verschlechtert = [];
      VERLAUF_ITEMS.forEach(item => {
        const diff = (letzter.werte[item.id] || 5) - (vorLetzter.werte[item.id] || 5);
        if (diff <= -2) verschlechtert.push(item.label + ' (' + (letzter.werte[item.id] || 5) + '/10)');
      });
      if (verschlechtert.length >= 2) {
        verlaufHint = `<div class="sitzungsvorschlag-response-hint warnung" style="margin-top:6px;">📉 <strong>Verlaufs-Verschlechterung:</strong> ${verschlechtert.join(', ')} — Reflexion empfohlen</div>`;
      }
    }
  } catch(e) { /* silent */ }

  // ── Risiko-Override bei Rot ──
  let risikoHint = '';
  try {
    const risikoDaten = DB.getRisiko(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
    if (risikoDaten.length > 0) {
      const letzterR = risikoDaten[0];
      if (Object.values(letzterR.werte).includes('rot')) {
        risikoHint = `<div class="sitzungsvorschlag-response-hint warnung" style="margin-top:6px;border-left:3px solid #DC2626;">🔴 <strong>Risiko-Alarm:</strong> Letzter Sicherheits-Check enthält rote Ampel — Krisenintervention priorisieren!
          <button class="btn btn-xs" style="background:#EF4444;color:#fff;border:none;margin-left:8px;" onclick="quickStartSession('krisenintervention')">Krisenintervention starten</button></div>`;
      }
    }
  } catch(e) { /* silent */ }

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
      const chips = items.map(i => '<span style="background:#ECFDF5;border:1px solid #A7F3D0;border-radius:12px;padding:2px 8px;font-size:10px;color:#065F46;">' + i + '</span>').join(' ');
      ressourcenHint = '<div style="margin-top:6px;font-size:11px;color:#065F46;">💪 Ressourcen nutzen: ' + chips + '</div>';
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
  } catch(e) { console.warn('Pathways:', e); }
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

  // ── Material für empfohlenes Thema sammeln ──
  const empfAB = ARBEITSBLÄTTER[empfohlenesThema.id] || [];
  const empfIV = THEMA_INTERVENTIONEN[empfohlenesThema.id] || [];
  const empfWiki = typeof findWikiForThema === 'function' ? findWikiForThema(empfohlenesThema.id) : null;
  const empfPrio = typeof getThemaPrioritaet === 'function' ? getThemaPrioritaet(empfohlenesThema.id, DB.getRoadmap(sid)) : null;

  let materialHTML = '';
  if (empfAB.length > 0 || empfIV.length > 0 || empfWiki) {
    materialHTML = `<div class="sitzungsvorschlag-materialien">
      <div class="sitzungsvorschlag-materialien-header">Materialien & Interventionen</div>
      <div class="roadmap-material-links">
        ${empfAB.map(ab => `<a href="arbeitsblatter/${ab.datei}" target="_blank" class="roadmap-material-btn arbeitsblatt">📋 ${ab.titel}</a>`).join('')}
        ${empfIV.slice(0, 3).map(iv => `<button class="roadmap-material-btn intervention" onclick="openRoadmapThema('${empfohlenesThema.id}')" title="${(iv.beschreibung || '').substring(0, 100)}">🔧 ${iv.titel} <span style="font-size:10px;opacity:.7;">${iv.dauer || ''}</span></button>`).join('')}
        ${empfIV.length > 3 ? `<button class="roadmap-material-btn intervention" onclick="openRoadmapThema('${empfohlenesThema.id}')">+${empfIV.length - 3} weitere</button>` : ''}
        ${empfWiki ? `<button class="roadmap-material-btn wiki" onclick="openWikiArtikel('${empfWiki.id}')">📚 Wiki</button>` : ''}
      </div>
    </div>`;
  }

  // ── Kontext-Badges ──
  const pvtBadgeClass = lastPVT === 'safe' ? 'sv-badge-pvt-safe' : lastPVT === 'activated' ? 'sv-badge-pvt-activated' : lastPVT === 'frozen' ? 'sv-badge-pvt-frozen' : '';
  const trAnalyseEmpf = trAnalyse ? trAnalyse.themen.find(t => t.themaId === empfohlenesThema.id) : null;

  let kontextHTML = '';
  const badges = [];
  if (lastPVT) badges.push(`<span class="sv-badge ${pvtBadgeClass}">${pvtLabels[lastPVT] || lastPVT}</span>`);
  if (aktivePhase) badges.push(`<span class="sv-badge sv-badge-phase">Phase ${aktivePhase.nr}: ${ROADMAP_PHASEN[aktivePhase.nr]?.label || ''}</span>`);
  if (empfPrio && empfPrio.level === 'essentiell') badges.push(`<span class="sv-badge" style="background:#FEE2E2;color:#DC2626;">⚡ Essentiell</span>`);
  if (trAnalyseEmpf && trAnalyseEmpf.anzahl >= 2) {
    const rr = trAnalyseEmpf.responseRate;
    badges.push(`<span class="sv-badge ${rr >= 60 ? 'sv-badge-response-good' : 'sv-badge-response-bad'}">📊 Response: ${rr}%</span>`);
  }
  if (badges.length > 0) {
    kontextHTML = `<div class="sitzungsvorschlag-kontext">${badges.join('')}</div>`;
  }

  // ── Warnungen sammeln ──
  let warnungenHTML = '';
  const warnungen = [];
  if (sequenzWarnung) warnungen.push(sequenzWarnung);
  if (steppedCareHint) warnungen.push(steppedCareHint);
  if (hypothesenHint) warnungen.push(hypothesenHint);
  if (treatmentHint) warnungen.push(treatmentHint);
  if (risikoHint) warnungen.push(risikoHint);
  if (verlaufHint) warnungen.push(verlaufHint);
  if (warnungen.length > 0) {
    warnungenHTML = `<div class="sitzungsvorschlag-warnungen">${warnungen.join('')}</div>`;
  }

  container.innerHTML = `
    <div class="sitzungsvorschlag-dashboard">
      <div class="sitzungsvorschlag-header">💡 Heutige Sitzung</div>

      <!-- Empfehlung -->
      <div class="sitzungsvorschlag-empfehlung">
        <div class="sitzungsvorschlag-empfehlung-icon" style="background:${empfohlenesThema.farbe || '#EEF2FF'}20;">
          ${empfohlenesThema.icon ? renderIcon(empfohlenesThema.icon) : '📌'}
        </div>
        <div class="sitzungsvorschlag-empfehlung-body">
          <div class="sitzungsvorschlag-empfehlung-titel">${empfohlenesThema.titel}</div>
          <div style="font-size:12px;color:#6B7280;margin-top:2px;">${empfGrund}</div>
          ${begruendung}
          ${overrideHint}
          ${ressourcenHint}
        </div>
      </div>

      <!-- Materialien -->
      ${materialHTML}

      <!-- Kontext-Badges -->
      ${kontextHTML}

      <!-- Warnungen (nur wenn nötig) -->
      ${warnungenHTML}

      <!-- Aktivitäten -->
      ${aktivitaetenHTML ? `<div style="padding:0 20px 12px;">${aktivitaetenHTML}</div>` : ''}

      <!-- Aktionen -->
      <div class="sitzungsvorschlag-aktionen">
        <button class="btn btn-secondary btn-sm" onclick="showQuickEntryPanel('${empfohlenesThema.id}', '${empfohlenesThema.katId || ''}')">Details</button>
        <button class="btn btn-secondary btn-sm" onclick="druckeSitzungsvorbereitung()">🖨️ Vorbereitung</button>
        <button class="btn btn-primary btn-sm" onclick="quickStartSession('${empfohlenesThema.id}')">Sitzung starten</button>
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
            <div class="progress-bar-fill" style="width:${fortschritt}%;background:linear-gradient(90deg,#6366F1,#6366F1);border-radius:5px;transition:width 0.5s;"></div>
          </div>
        </div>

        <!-- Phasen-Schritte -->
        <div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:16px;">
          ${phasen.map(p => `
            <div onclick="showProfilTab('${p.tab}')" style="
              display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:20px;font-size:11px;font-weight:500;cursor:pointer;
              background:${p.done ? '#ECFDF5' : '#F9FAFB'};
              border:1px solid ${p.done ? '#A7F3D0' : '#E5E7EB'};
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
  showConfirm(`Sektion "${nb.sektionen[index].titel}" und alle Notizen darin löschen?`, () => {
    nb.sektionen.splice(index, 1);
    APP.notizbuchAktivSektion = Math.max(0, index - 1);
    DB.updateSchueler(APP.currentSchuelerId, { notizbuch: nb });
    renderNotizbuch();
  });
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
    const farben = ['#DC2626','#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#10B981','#10B981','#059669','#047857'];
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
        const farben = ['','#DC2626','#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#10B981','#10B981','#059669','#047857'];
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
  const wbFarben = ['','#DC2626','#EF4444','#F97316','#F59E0B','#EAB308','#84CC16','#10B981','#10B981','#059669','#047857'];

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
          return '#10B981';
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
                const fc = val <= 3 ? '#EF4444' : (val <= 6 ? '#F59E0B' : '#10B981');
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
    const fc = v <= 3 ? '#EF4444' : (v <= 6 ? '#F59E0B' : '#10B981');
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
  } catch(e) { console.warn('Pathways:', e); }

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
          // Perpetuating: Mögliche Ursachen des beobachteten Verhaltens
          if (e.was_es_bedeuten_kann) {
            e.was_es_bedeuten_kann.slice(0, 2).forEach(u => {
              suggestions.perpetuating.push({
                text: `🔄 ${u.ursache} (→ ${e.titel})`,
                source: 'Verhalten',
                key: `perp-${e.id}-${u.ursache}`
              });
            });
          }
        }
      });
    });
  }

  // 6. Precipitating: Erweiterte Anamnese-Items als Auslöser
  if (typeof ANAMNESE_KATEGORIEN !== 'undefined') {
    const precipitatingIds = ['scheidung', 'flucht', 'tod_elternteil', 'haeufige_umzuege',
      'schulwechsel_haeufig', 'haeusliche_gewalt', 'inhaftierung_elternteil',
      'misshandlung_physisch', 'missbrauch_sexuell', 'vernachlaessigung_emotional',
      'vernachlaessigung_physisch', 'misshandlung_emotional'];
    const anamneseData = s.anamnese || [];
    precipitatingIds.forEach(id => {
      if (anamneseData.includes(id)) {
        let label = id;
        for (const kat of ANAMNESE_KATEGORIEN) {
          if (kat.items) {
            const item = kat.items.find(i => i.id === id);
            if (item) { label = item.label; break; }
          }
          if (kat.felder) {
            for (const f of kat.felder) {
              const opt = f.optionen.find(o => o.id === id);
              if (opt) { label = opt.label; break; }
            }
          }
        }
        if (!suggestions.precipitating.some(p => p.key === id)) {
          suggestions.precipitating.push({ text: `⚡ ${label}`, source: 'Anamnese', key: id });
        }
      }
    });
  }

  // 7. Precipitating: Wohlbefinden-Einbrüche
  const wohlbefinden = DB.getWohlbefinden(sid).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  if (wohlbefinden.length >= 2) {
    for (let i = 1; i < wohlbefinden.length; i++) {
      const prev = wohlbefinden[i - 1].gesamt || 0;
      const curr = wohlbefinden[i].gesamt || 0;
      if (prev > 0 && curr < prev * 0.7) {
        const datum = wohlbefinden[i].datum || '';
        suggestions.precipitating.push({
          text: `📉 Wohlbefinden-Einbruch ${datum ? '(' + datum + ')' : ''}`,
          source: 'Wohlbefinden',
          key: `wb-drop-${i}`
        });
        break; // nur den stärksten Einbruch
      }
    }
  }

  // 8. Perpetuating: Screening-Domains im mittleren Bereich (nicht akut, aber aufrechterhaltend)
  if (typeof SCREENING_DOMAINS !== 'undefined') {
    const screenings = DB.getScreenings(sid).filter(sc => sc.abgeschlossen);
    if (screenings.length > 0) {
      const latestScr = screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0];
      const scores = latestScr.scores || {};
      SCREENING_DOMAINS.forEach(dom => {
        const score = scores[dom.id] || 0;
        if (score > 0 && score < (dom.cutoff || 5)) {
          // Subklinisch aber vorhanden → aufrechterhaltend
          suggestions.perpetuating.push({
            text: `📊 Subklinisch: ${dom.label} (Score ${score})`,
            source: 'Screening',
            key: `perp-scr-${dom.id}`
          });
        }
      });
    }
  }

  // 9. Perpetuating: Wiederkehrende SOAP-Assessment-Themen
  if (soapNotizen.length >= 2) {
    const assessments = soapNotizen.filter(n => n.soap && n.soap.assessment).map(n => n.soap.assessment.toLowerCase());
    if (assessments.length >= 2) {
      const wordFreq = {};
      const stopwords = ['der','die','das','und','ist','ein','eine','für','mit','auf','in','zu','von','nicht','sich','hat','wird','auch','noch','dem','den','des','bei','als','nach','aus','wie'];
      assessments.forEach(a => {
        a.split(/\s+/).forEach(w => {
          const clean = w.replace(/[^\wäöüß]/g, '');
          if (clean.length > 3 && !stopwords.includes(clean)) {
            wordFreq[clean] = (wordFreq[clean] || 0) + 1;
          }
        });
      });
      Object.entries(wordFreq)
        .filter(([, c]) => c >= 2)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .forEach(([word, count]) => {
          suggestions.perpetuating.push({
            text: `🔁 Wiederkehrend: "${word}" (${count}× in Assessments)`,
            source: 'SOAP',
            key: `perp-soap-${word}`
          });
        });
    }
  }

  return suggestions;
}

// Navigate from 5P tag to its data source tab
function navigate5PSource(el) {
  const source = el.dataset.source;
  if (!source) return;
  const tabMap = {
    'Screening': 'screening',
    'Anamnese': 'info',
    'Stärken': 'staerken',
    'SOAP': 'notizen',
    'Hypothese': 'hypothesen-tab',
    'Verhalten': 'verhalten',
    'Wohlbefinden': 'treatment-tab',
  };
  const tab = tabMap[source];
  if (tab) {
    showProfilTab(tab);
    showToast(`Navigiert zu: ${source}`, 'success');
  }
}

// Alle pending 5P-Vorschläge (inkl. Hypothesen) auf einmal übernehmen
function autoAcceptAll5PSuggestions() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  let ff = DB.getFallformulierung(sid);
  if (!ff) ff = DB.createFallformulierung(sid);
  const suggestions = gatherAutoSuggestions(sid);
  let count = 0;
  ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(key => {
    if (!ff[key]) ff[key] = [];
    const dismissed = (ff._dismissed && ff._dismissed[key]) || [];
    (suggestions[key] || []).forEach(s => {
      const isDuplicate = ff[key].some(e => e.includes(s.key) || e === s.text || (s.key && e.includes(s.key)));
      const isDismissed = dismissed.includes(s.key);
      if (!isDuplicate && !isDismissed) {
        ff[key].push(s.text);
        count++;
      }
    });
  });
  if (count > 0) {
    DB.saveFallformulierung(ff);
    markDirty();
    renderFallformulierung();
    showToast(`✓ ${count} Vorschläge in 5P übernommen — bitte prüfen und anpassen`, 'success');
  } else {
    showToast('Alle Vorschläge sind bereits in der 5P-Analyse enthalten', 'info');
  }
}

function renderCollapsible(id, titel, content, open = false) {
  return `<details class="collapsible-panel" ${open ? 'open' : ''} id="panel-${id}">
    <summary class="collapsible-header">${titel}</summary>
    <div class="collapsible-body">${content}</div>
  </details>`;
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

  // Build source map for tag navigation
  const sourceMap = {};
  ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(key => {
    (autoSugg[key] || []).forEach(s => {
      sourceMap[s.text] = s.source;
    });
  });

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
    { key: 'perpetuating',   label: 'Perpetuating',   farbe: '#2563EB', bg: '#EFF6FF', desc: 'Aufrechterhaltende Faktoren' },
    { key: 'protective',     label: 'Protective',     farbe: '#10B981', bg: '#ECFDF5', desc: 'Schutzfaktoren & Ressourcen' },
  ];

  // Hypothesen-Zusammenfassung (kompakt statt volle Inline-Liste)
  let hypoSummaryHtml = '';
  try {
    const hypos = generateHypothesen(sid);
    if (hypos && hypos.length > 0) {
      const top3 = hypos.slice(0, 3).map(h => {
        const icon = h.typ === 'schutz' ? '🛡️' : h.typ === 'differenzial' ? '🔀' : '⚠️';
        return `<span style="font-size:12px;">${icon} ${h.titel}</span>`;
      }).join(' · ');
      hypoSummaryHtml = `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:#F8FAFC;border:1px solid #E2E8F0;border-radius:8px;margin-top:12px;">
          <span style="font-size:14px;">🧠</span>
          <div style="flex:1;font-size:12px;color:#374151;">
            <strong>${hypos.length} Hypothesen aktiv</strong> — ${top3}${hypos.length > 3 ? ` <span style="color:#9CA3AF;">+${hypos.length - 3} weitere</span>` : ''}
          </div>
          <button class="btn btn-sm btn-secondary" onclick="showProfilTab('hypothesen-tab')" style="font-size:11px;white-space:nowrap;">Alle anzeigen →</button>
        </div>`;
    }
  } catch(e) { console.warn('Pathways:', e); }

  container.innerHTML = `
    <div class="section-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:18px;">
      <div>
        <h3 style="margin:0;font-size:18px;">🧩 5P-Fallformulierung</h3>
        <p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Klinische Fallkonzeption — automatisch befüllt aus allen gesammelten Daten</p>
      </div>
      <div style="display:flex;gap:8px;">
        ${typeof FIVEP_BEISPIEL_KOMPLETT !== 'undefined' ? `<button class="btn btn-secondary btn-sm" onclick="open5PBeispiel()">📖 Beispiel</button>` : ''}
        ${ff ? `<button class="btn btn-secondary btn-sm" onclick="autoAcceptAll5PSuggestions()">⚡ Alle Vorschläge übernehmen</button>` : ''}
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
                ${items.map((item, i) => {
                  const src = sourceMap[item] || '';
                  const navAttr = src ? `data-source="${src}" onclick="navigate5PSource(this)" style="cursor:pointer;background:${p.bg};border-color:${p.farbe};" title="Klicke um zur Quelle (${src}) zu springen"` : `style="background:${p.bg};border-color:${p.farbe};"`;
                  return `
                  <span class="fivep-tag" ${navAttr}>
                    ${item}${src ? `<span style="font-size:9px;opacity:0.5;margin-left:3px;">↗</span>` : ''}
                    <span class="fivep-tag-del" onclick="event.stopPropagation();remove5PTag('${p.key}', ${i})">×</span>
                  </span>`;
                }).join('')}
                ${pending.map(s => `
                  <span class="fivep-tag fivep-tag-suggestion" style="background:${p.bg}80;border-color:${p.farbe};border-style:dashed;opacity:0.75;">
                    ${s.text}
                    <span class="fivep-tag-accept" onclick="accept5PSuggestion('${p.key}','${s.key.replace(/'/g, "\\'")}','${s.text.replace(/'/g, "\\'")}')" title="Übernehmen" style="cursor:pointer;color:#10B981;font-weight:bold;margin-left:4px;">✓</span>
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

    ${ff ? `
    <div style="margin-top:12px;">
      <div style="font-size:12px;font-weight:600;color:#6B7280;margin-bottom:4px;">💡 Zusammenfassende Hypothese</div>
      <textarea class="fivep-hypothese-input" id="fivep-hypothese" rows="3"
        style="width:100%;font-size:13px;border:1px solid var(--border);border-radius:8px;padding:8px 12px;resize:vertical;"
        placeholder="Zusammenfassende klinische Hypothese basierend auf den 5P-Faktoren…"
        onchange="save5PHypothese(this.value)">${ff.hypothese || ''}</textarea>
    </div>` : ''}

    ${hypoSummaryHtml}

    <div style="margin-top:16px;">
      ${ff ? renderCollapsible('triage', '🚦 Handlungstriage', renderHandlungsTriage(ff, sid), ff.triageOpen || false) : ''}
      ${ff ? renderCollapsible('muster', '📊 Muster & Analyse', render5PPatternAnalysis(ff) + render5PKomorbidity(ff)) : ''}

      ${renderCollapsible('radar', '📈 Radar-Visualisierung', `
        <div id="fivep-radar-container" style="max-width:400px;margin:0 auto;">
          <canvas id="fivep-radar-chart" width="400" height="300"></canvas>
        </div>
      `)}
    </div>
  `;

  // Radar-Chart initialisieren
  if (ff) setTimeout(render5PRadar, 50);

  // Auto-Hypothese: Wenn genug Tags vorhanden aber keine Hypothese geschrieben
  if (ff && !ff.hypothese) {
    const totalTags = ['presenting','predisposing','precipitating','perpetuating','protective']
      .reduce((sum, k) => sum + (ff[k] || []).length, 0);
    if (totalTags >= 5) {
      setTimeout(() => {
        generate5PHypothese();
        const panel = document.getElementById('panel-hypo');
        if (panel) panel.open = true;
      }, 200);
    }
  }
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
    const borderColor = h.typ === 'schutz' ? '#10B981' : h.typ === 'differenzial' ? '#6366F1'
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
  html += `<button class="btn btn-sm btn-outline-primary" style="margin-left:auto;font-size:11px;" onclick="showPhase('auswertung', 'hypothesen-tab')">Alle anzeigen →</button>`;
  html += '</div>';

  // Differenzialdiagnosen (prominently)
  if (diffs.length > 0) {
    html += '<div style="margin-bottom:14px;">';
    html += '<div style="font-size:12px;font-weight:600;color:#4338CA;margin-bottom:6px;">🔀 Differenzialdiagnosen (' + diffs.length + ')</div>';
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
    html += '<div style="font-size:12px;font-weight:600;color:#065F46;margin-bottom:6px;">🛡️ Schutzfaktoren (' + schutz.length + ')</div>';
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
  showConfirm('5P-Formulierung wirklich zurücksetzen?', () => {
    const sid = APP.currentSchuelerId;
    const ff = DB.getFallformulierung(sid);
    if (ff) DB.deleteFallformulierung(ff.id);
    renderFallformulierung();
    showToast('5P-Formulierung zurückgesetzt', 'success');
  });
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

  // Genogramm-basierte Vorschläge hinzufügen
  if (typeof getGenogramm5PSuggestions === 'function') {
    const genoSugg = getGenogramm5PSuggestions();
    if (genoSugg[key]) {
      genoSugg[key].forEach(s => {
        if (!suggestions[key].includes(s.text)) suggestions[key].push(s.text);
      });
    }
  }

  const chips = (suggestions[key] || []).filter(s => !existingTags.includes(s));
  if (chips.length === 0) return '';

  return '<div class="suggestion-chips" style="margin-top:6px;">' +
    chips.slice(0, 7).map(c =>
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
    // Strip emoji icons and score suffixes for matching
    const cleaned = p.replace(/^[^\w\sÄÖÜäöüß]*/u, '').replace(/\s*\(Score:\s*\d+\)$/, '').trim();
    const dom = SCREENING_DOMAINS.find(d => cleaned.includes(d.label) || d.label.includes(cleaned) || d.id === cleaned.toLowerCase().replace(/\s/g, '-'));
    return dom ? dom.id : cleaned.toLowerCase().replace(/[\s\/]+/g, '-');
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
      pointBackgroundColor: ['#EF4444', '#F97316', '#EAB308', '#2563EB', '#10B981'],
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
        <div style="margin-top:10px;padding:10px 12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:8px;">
          <div style="font-size:12px;font-weight:600;color:#065F46;margin-bottom:6px;">🎯 Empfohlene Interventions-Themen</div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            ${topThemen.map(([thema, count]) =>
              `<span style="padding:3px 10px;background:#DCFCE7;border:1px solid #86EFAC;border-radius:12px;font-size:12px;color:#065F46;">
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
          <span class="fivep-stat-num" style="color:#10B981;">${protCount}</span>
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
      <div style="padding:12px 16px;background:#EEF2FF;border-bottom:1px solid #BFDBFE;">
        <div style="font-size:13px;font-weight:700;color:#4F46E5;margin-bottom:8px;">\u{1F52C} FACHDIAGNOSTIK EMPFOHLEN</div>`;
    grouped.abklaerung.forEach(({ dom, score }) => {
      const themen = getThemenForDomain(dom.id);
      html += `
        <div style="padding:8px 12px;background:#fff;border:1px solid #BFDBFE;border-left:4px solid #4F46E5;border-radius:6px;margin-bottom:6px;">
          <div style="font-weight:600;color:#4338CA;">${dom.icon} ${dom.label} <span style="font-weight:400;color:#6B7280;">(Score: ${score})</span></div>
          ${dom.ueberweisungAn ? `<div style="font-size:12px;color:#4F46E5;margin-top:4px;">\u{1F4CB} \u00DCberweisung an: <strong>${dom.ueberweisungAn}</strong></div>` : ''}
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
        <div class="bericht-card-icon" style="background:#EFF6FF;color:#2563EB;">👨‍👩‍👧</div>
        <div class="bericht-card-body">
          <strong>Elternbrief</strong>
          <p>Zusammenfassung für Eltern/Erziehungsberechtigte</p>
        </div>
        <span class="bericht-card-arrow">→</span>
      </div>

      <div class="bericht-card" onclick="generateBericht('uebergabe')">
        <div class="bericht-card-icon" style="background:#ECFDF5;color:#10B981;">🤝</div>
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
        <strong>Pathways — Service Bezugspädagogik</strong><br>
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

      ${(() => {
        const verlauf = DB.getVerlauf(s.id).sort((a, b) => new Date(a.datum) - new Date(b.datum));
        if (verlauf.length === 0) return '';
        const letzter = verlauf[verlauf.length - 1];
        return `<h4>6. Verlaufs-Tracking</h4>
          <p>${verlauf.length} Erfassungen dokumentiert.</p>
          <p>Letzte Werte: ${VERLAUF_ITEMS.map(item => `${item.label}: ${letzter.werte[item.id] || '—'}/10`).join(' | ')}</p>`;
      })()}

      ${(() => {
        const risiko = DB.getRisiko(s.id).sort((a, b) => new Date(b.datum) - new Date(a.datum));
        if (risiko.length === 0) return '';
        const letzter = risiko[0];
        const maxStufe = Object.values(letzter.werte).includes('rot') ? 'Handeln' : Object.values(letzter.werte).includes('gelb') ? 'Beobachten' : 'Unauffällig';
        return `<h4>7. Risiko-Einschätzung</h4>
          <p>Letzter Sicherheits-Check: <strong>${maxStufe}</strong></p>
          <p>${RISIKO_ITEMS.map(item => `${item.label}: ${RISIKO_STUFEN[letzter.werte[item.id] || 'gruen'].label}`).join(' | ')}</p>`;
      })()}

      ${(() => {
        const kontakte = DB.getKontakte(s.id).sort((a, b) => new Date(b.datum) - new Date(a.datum));
        if (kontakte.length === 0) return '';
        return `<h4>8. Bezugspersonen-Kontakte</h4>
          <p>${kontakte.length} dokumentierte Kontakte.</p>
          <p>Letzte Kontakte: ${kontakte.slice(0, 3).map(k => `${k.kontaktperson} (${formatDatum(k.datum)}, ${(KONTAKT_ARTEN[k.art] || KONTAKT_ARTEN.telefon).label})`).join('; ')}</p>`;
      })()}

      <h4>9. Risikobewertung (Pflichtsektion)</h4>
      <div style="border:2px solid #DC2626;border-radius:6px;padding:10px;margin-bottom:12px;">
        ${(() => {
          const risiko = DB.getRisiko(s.id).sort((a, b) => new Date(b.datum) - new Date(a.datum));
          const cssrsItems = RISIKO_ITEMS.filter(i => i.kategorie === 'cssrs');
          const kindeswohlItems = RISIKO_ITEMS.filter(i => i.kategorie === 'kindeswohl');
          if (risiko.length > 0) {
            const letzter = risiko[0];
            const cssrsRot = cssrsItems.filter(i => letzter.werte[i.id] === 'rot').map(i => i.label);
            const kindeswohlAuffaellig = kindeswohlItems.filter(i => letzter.werte[i.id] !== 'gruen').map(i => i.label);
            return `<p><strong>Suizidalitäts-Screening (C-SSRS):</strong> ${cssrsRot.length > 0 ? '⚠️ Auffällig: ' + cssrsRot.join(', ') : '✅ Keine akuten Hinweise'}</p>
              <p><strong>Kindeswohl:</strong> ${kindeswohlAuffaellig.length > 0 ? '⚠️ ' + kindeswohlAuffaellig.join(', ') : '✅ Keine Hinweise'}</p>
              <p style="font-size:11px;color:#6B7280;">Letzter Check: ${formatDatum(letzter.datum)}</p>`;
          }
          return '<p style="color:#DC2626;">⚠️ Kein Sicherheits-Check dokumentiert. Bitte vor Berichtversand durchführen.</p>';
        })()}
      </div>

      <h4>10. Empfehlung</h4>
      <p><em>[Hier Empfehlung einfügen]</em></p>

      <div class="bericht-footer">
        <br><br>
        <p>_________________________<br>Bezugspädagoge/in</p>
        <div style="margin-top:16px;padding:10px;border-top:2px solid #E5E7EB;font-size:10px;color:#9CA3AF;line-height:1.5;">
          <strong>Haftungsausschluss:</strong> Dieser Bericht basiert auf pädagogischen Beobachtungen und standardisierten Screening-Instrumenten. Er ersetzt keine psychiatrische oder psychologische Diagnostik. Die Risikobewertung ist eine Momentaufnahme und erfordert kontinuierliche Überprüfung. Bei akuter Gefährdung sind die zuständigen Notdienste zu kontaktieren (CHL Kinder-/Jugendpsychiatrie: 4411-6100, Krisentelefon: 45 45 45). Vertraulich — nur für autorisierte Empfänger bestimmt.
        </div>
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
        <strong>Pathways</strong><br>
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
      <em>Bezugspädagogisches Team</em></p>
      <div style="margin-top:16px;padding:8px;border-top:1px solid #E5E7EB;font-size:9px;color:#9CA3AF;line-height:1.4;">
        Dieser Brief basiert auf pädagogischen Beobachtungen und ersetzt keine ärztliche Diagnostik. Bei Fragen wenden Sie sich an das Bezugspädagogik-Team. Vertraulich.
      </div>
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

      <h4>Risiko-Einschätzung</h4>
      ${(() => {
        const risiko = DB.getRisiko(s.id).sort((a, b) => new Date(b.datum) - new Date(a.datum));
        if (risiko.length > 0) {
          const letzter = risiko[0];
          const maxStufe = Object.values(letzter.werte).includes('rot') ? '🔴 Handeln' : Object.values(letzter.werte).includes('gelb') ? '🟡 Beobachten' : '🟢 Unauffällig';
          return `<p>Status: <strong>${maxStufe}</strong> (${formatDatum(letzter.datum)})</p>`;
        }
        return '<p style="color:#DC2626;">⚠️ Kein Sicherheits-Check dokumentiert.</p>';
      })()}

      <h4>Wichtige Hinweise für die Übernahme</h4>
      <p><em>[Hier individuelle Hinweise einfügen]</em></p>

      <div style="margin-top:16px;padding:8px;border-top:1px solid #E5E7EB;font-size:9px;color:#9CA3AF;line-height:1.4;">
        <strong>Vertraulich — Nur für autorisierte Fachpersonen.</strong> Dieser Bericht basiert auf pädagogischen Beobachtungen und standardisierten Screening-Instrumenten. Er ersetzt keine psychiatrische/psychologische Diagnostik. Bei akuter Gefährdung: CHL KJP 4411-6100.
      </div>
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
        <strong>Pathways — Joey Guedes</strong><br>
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
        Bezugspädagoge/in<br>
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

// ── Helfer: Thema-Kategorie nachschlagen ──
function getThemaKat(themaId) {
  for (const kat of THEMEN_KATEGORIEN) {
    if (kat.themen.find(th => th.id === themaId)) return kat;
  }
  return null;
}

// ── Priorität aus Screening-Score berechnen ──
function getThemaPrioritaet(themaId, roadmap) {
  if (!roadmap || !roadmap.screeningId) return { level: 'optional', label: '💡 Optional', css: 'roadmap-prioritaet-optional', score: 0 };
  const scr = DB.getScreenings().find(s => s.id === roadmap.screeningId);
  if (!scr || !scr.scores) return { level: 'optional', label: '💡 Optional', css: 'roadmap-prioritaet-optional', score: 0 };

  let maxSeverity = 0;
  for (const domId in SCREENING_THEMA_MAP) {
    const themen = SCREENING_THEMA_MAP[domId] || [];
    if (themen.includes(themaId)) {
      const domain = SCREENING_DOMAINS.find(d => d.id === domId);
      if (domain && scr.scores[domId] !== undefined) {
        const max = domain.items.length * 3;
        const severity = max > 0 ? scr.scores[domId] / max : 0;
        if (severity > maxSeverity) maxSeverity = severity;
      }
    }
  }

  if (maxSeverity >= 0.7) return { level: 'essentiell', label: '⚡ Essentiell', css: 'roadmap-prioritaet-essentiell', score: maxSeverity };
  if (maxSeverity >= 0.4) return { level: 'empfohlen', label: '📌 Empfohlen', css: 'roadmap-prioritaet-empfohlen', score: maxSeverity };
  return { level: 'optional', label: '💡 Optional', css: 'roadmap-prioritaet-optional', score: maxSeverity };
}

// ── Phasen-Stepper (horizontale Dot-Navigation) ──
function renderPhasenStepper(roadmap) {
  let html = '<div class="roadmap-stepper">';
  roadmap.phasen.forEach((phase, idx) => {
    const def = ROADMAP_PHASEN[idx];
    const gate = checkPhaseGate(roadmap, phase.nr);
    const isLocked = !gate.erlaubt && phase.status === 'offen';
    const dotClass = phase.status === 'erledigt' ? 'erledigt' : phase.status === 'aktiv' ? 'aktiv' : isLocked ? 'locked' : '';
    html += `<div class="stepper-step">
      <div class="stepper-dot-wrap">
        <div class="stepper-dot ${dotClass}" onclick="focusRoadmapPhase(${phase.nr})" title="${isLocked ? '🔒 ' + gate.grund : 'Phase ' + def.nr + ': ' + def.label}">
          ${phase.status === 'erledigt' ? '✓' : isLocked ? '🔒' : def.nr}
        </div>
      </div>`;
    if (idx < roadmap.phasen.length - 1) {
      const lineClass = phase.status === 'erledigt' ? 'erledigt' : phase.status === 'aktiv' ? 'aktiv' : '';
      html += `<div class="stepper-line ${lineClass}"></div>`;
    }
    html += '</div>';
  });
  html += '</div>';
  return html;
}

// ── Fokus Thema-Aktionskarte ──
function renderFokusThemaKarte(thema, themaIdx, phase, roadmap) {
  const titel = getThemaTitel(thema.id);
  const kat = getThemaKat(thema.id);
  const prio = getThemaPrioritaet(thema.id, roadmap);
  const isDone = thema.status === 'abgeschlossen';

  // Verknüpfte Ziele finden
  const schueler = DB.getSchuelerById(APP.currentSchuelerId);
  const verknuepfteZiele = (schueler && schueler.ziele || []).filter(z => z.roadmapThema === thema.id);
  let zielBadgeHtml = '';
  if (verknuepfteZiele.length > 0) {
    zielBadgeHtml = verknuepfteZiele.map(z => {
      const pct = z.fortschritt || (z.erledigt ? 100 : 0);
      const farbe = pct >= 70 ? '#10B981' : (pct >= 30 ? '#F59E0B' : '#EF4444');
      return `<div style="display:flex;align-items:center;gap:6px;padding:4px 8px;margin-top:4px;background:${farbe}10;border:1px solid ${farbe}30;border-radius:6px;font-size:11px;">
        <span style="font-size:13px;">🎯</span>
        <span style="color:var(--text);font-weight:500;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(z.text)}</span>
        <span style="color:${farbe};font-weight:700;flex-shrink:0;">${pct}%</span>
        <div style="width:40px;height:4px;background:#E5E7EB;border-radius:2px;flex-shrink:0;overflow:hidden;">
          <div style="height:100%;width:${pct}%;background:${farbe};border-radius:2px;"></div>
        </div>
      </div>`;
    }).join('');
  }

  // Material sammeln
  const arbeitsblaetter = ARBEITSBLÄTTER[thema.id] || [];
  const interventionen = THEMA_INTERVENTIONEN[thema.id] || [];
  const wiki = typeof findWikiForThema === 'function' ? findWikiForThema(thema.id) : null;

  let materialHtml = '';
  if (arbeitsblaetter.length > 0 || interventionen.length > 0 || wiki) {
    materialHtml = '<div class="roadmap-material-links">';
    arbeitsblaetter.forEach(ab => {
      materialHtml += `<a href="arbeitsblatter/${ab.datei}" target="_blank" class="roadmap-material-btn arbeitsblatt">📋 ${ab.titel}</a>`;
    });
    interventionen.slice(0, 3).forEach(iv => {
      materialHtml += `<button class="roadmap-material-btn intervention" onclick="openRoadmapThema('${thema.id}')" title="${iv.beschreibung || ''}">🔧 ${iv.titel}</button>`;
    });
    if (interventionen.length > 3) {
      materialHtml += `<button class="roadmap-material-btn intervention" onclick="openRoadmapThema('${thema.id}')">+${interventionen.length - 3} weitere</button>`;
    }
    if (wiki) {
      materialHtml += `<button class="roadmap-material-btn wiki" onclick="openWikiArtikel('${wiki.id}')">📚 Wiki</button>`;
    }
    materialHtml += '</div>';
  }

  return `
    <div class="roadmap-thema-karte ${isDone ? 'done' : ''}">
      <div class="roadmap-karte-check ${isDone ? 'checked' : ''}" onclick="toggleRoadmapThema(${phase.nr}, ${themaIdx})">
        ${isDone ? '✓' : ''}
      </div>
      <div class="roadmap-karte-body">
        <div class="roadmap-karte-top">
          <span class="roadmap-karte-titel">${titel}</span>
          ${kat ? `<span class="roadmap-karte-kat" style="border-left:3px solid ${kat.farbe};padding-left:6px;">${renderIcon(kat.icon)} ${kat.titel}</span>` : ''}
          <span class="roadmap-prioritaet ${prio.css}">${prio.label}</span>
          <div class="roadmap-karte-actions-btn">
            <button class="btn-icon btn-xs" title="Thema öffnen" onclick="openRoadmapThema('${thema.id}')">📋</button>
            <button class="btn-icon btn-xs" title="Entfernen" onclick="removeRoadmapThema(${phase.nr}, ${themaIdx})">✕</button>
          </div>
        </div>
        ${zielBadgeHtml}
        ${materialHtml}
      </div>
    </div>`;
}

// ── Aktive Phase (voll expandiert mit Fokus-Karten) ──
function renderAktivePhase(roadmap, phase, idx) {
  const def = ROADMAP_PHASEN[idx];
  const themenDone = phase.themen.filter(t => t.status === 'abgeschlossen').length;
  const themenTotal = phase.themen.length;
  const phasePct = themenTotal > 0 ? Math.round((themenDone / themenTotal) * 100) : 0;

  // Themen sortiert: Essentiell > Empfohlen > Optional, erledigte am Ende
  const sortedThemen = phase.themen.map((t, i) => ({ ...t, _origIdx: i, _prio: getThemaPrioritaet(t.id, roadmap) }));
  sortedThemen.sort((a, b) => {
    if (a.status === 'abgeschlossen' && b.status !== 'abgeschlossen') return 1;
    if (b.status === 'abgeschlossen' && a.status !== 'abgeschlossen') return -1;
    const prioOrder = { essentiell: 0, empfohlen: 1, optional: 2 };
    return (prioOrder[a._prio.level] || 2) - (prioOrder[b._prio.level] || 2);
  });

  return `
    <div class="roadmap-fokus-phase" id="roadmap-fokus-${phase.nr}">
      <div class="roadmap-fokus-phase-header">
        <div class="roadmap-fokus-phase-title">
          <div class="roadmap-fokus-icon" style="background:${def.farbe}15;color:${def.farbe};">
            ${renderIcon(def.icon)}
          </div>
          <div>
            <div class="roadmap-fokus-label">Phase ${def.nr}: ${def.label}</div>
            <div class="roadmap-fokus-desc">${def.beschreibung}</div>
            <div class="roadmap-fokus-timing">
              ${def.dauer}
              ${phase.startDatum ? ` · Gestartet: ${new Date(phase.startDatum).toLocaleDateString('de-DE')}` : ''}
            </div>
          </div>
        </div>
        <div style="display:flex;gap:8px;align-items:center;flex-shrink:0;">
          <span class="roadmap-phase-status-badge roadmap-status-aktiv">▶ Aktiv</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="roadmap-fokus-stats">
        <div class="roadmap-fokus-stat">
          <div class="roadmap-fokus-stat-value">${themenTotal}</div>
          <div class="roadmap-fokus-stat-label">Themen</div>
        </div>
        <div class="roadmap-fokus-stat">
          <div class="roadmap-fokus-stat-value">${themenDone}/${themenTotal}</div>
          <div class="roadmap-fokus-stat-label">Erledigt</div>
        </div>
        <div class="roadmap-fokus-stat">
          <div class="roadmap-fokus-stat-value" style="color:${def.farbe};">${phasePct}%</div>
          <div class="roadmap-fokus-stat-label">Fortschritt</div>
        </div>
      </div>

      <!-- Fortschrittsbalken -->
      ${themenTotal > 0 ? `
      <div class="roadmap-progress-bar-container" style="margin-bottom:16px;">
        <div class="roadmap-progress-bar">
          <div class="roadmap-progress-fill" style="width:${phasePct}%;background:${def.farbe};"></div>
        </div>
      </div>` : ''}

      <!-- WAS JETZT ZU TUN IST -->
      <div class="roadmap-section-header">📋 Was jetzt zu tun ist</div>

      <div class="roadmap-themen-liste">
        ${themenTotal === 0
          ? `<div class="roadmap-themen-empty">Noch keine Themen zugewiesen — füge unten Themen hinzu.</div>`
          : sortedThemen.map(t => renderFokusThemaKarte(t, t._origIdx, phase, roadmap)).join('')}
      </div>

      <!-- Thema hinzufügen -->
      <div class="roadmap-add-thema-fokus">
        <select id="roadmap-add-select-${phase.nr}">
          <option value="">+ Thema hinzufügen...</option>
          ${THEMEN_KATEGORIEN.map(kat =>
            `<optgroup label="${renderIcon(kat.icon)} ${kat.titel}">
              ${kat.themen.map(t => `<option value="${t.id}">${t.titel}</option>`).join('')}
            </optgroup>`
          ).join('')}
        </select>
        <button class="btn btn-secondary btn-sm" onclick="addRoadmapThema(${phase.nr})">Hinzufügen</button>
      </div>

      <!-- Phase-Notizen -->
      <div class="roadmap-phase-notizen" style="margin-top:16px;">
        <textarea class="roadmap-notiz-input" placeholder="Notizen zu dieser Phase..."
          id="roadmap-notiz-${phase.nr}"
          onchange="saveRoadmapNotiz(${phase.nr}, this.value)">${phase.notizen || ''}</textarea>
      </div>

      <!-- Phase-Aktionen -->
      <div class="roadmap-phase-actions" style="margin-top:16px;">
        <button class="btn" style="background:${def.farbe};color:#fff;border:none;padding:10px 20px;font-size:15px;font-weight:600;border-radius:8px;box-shadow:0 2px 8px ${def.farbe}40;" onclick="setRoadmapPhaseStatus(${phase.nr}, 'erledigt')">✓ Phase abschließen</button>
      </div>

      <!-- Phasen-Ressourcen -->
      ${typeof renderPhaseRessourcen === 'function' ? renderPhaseRessourcen(phase, idx, roadmap) : ''}
    </div>`;
}

// ── Nächste Phase Vorschau ──
function renderNaechstePhaseVorschau(roadmap, phase, idx) {
  const def = ROADMAP_PHASEN[idx];
  const themenCount = phase.themen.length;
  return `
    <div class="roadmap-section-header" style="margin-top:24px;">⏭️ Nächste Phase</div>
    <div class="roadmap-naechste-vorschau" id="roadmap-fokus-${phase.nr}">
      <div class="roadmap-naechste-vorschau-icon" style="background:${def.farbe}15;color:${def.farbe};">
        ${renderIcon(def.icon)}
      </div>
      <div>
        <div class="roadmap-naechste-vorschau-label">Phase ${def.nr}: ${def.label}</div>
        <div class="roadmap-naechste-vorschau-desc">${def.beschreibung} · ${def.dauer}</div>
      </div>
      <span class="roadmap-naechste-themen-count">${themenCount} Themen</span>
      <button class="btn btn-secondary btn-sm" onclick="setRoadmapPhaseStatus(${phase.nr}, 'aktiv')" style="margin-left:8px;flex-shrink:0;">▶ Starten</button>
    </div>`;
}

// ── Erledigte Phase (kompakt) ──
function renderPhaseKompakt(phase, idx, type) {
  const def = ROADMAP_PHASEN[idx];
  const themenDone = phase.themen.filter(t => t.status === 'abgeschlossen').length;
  const themenTotal = phase.themen.length;

  if (type === 'erledigt') {
    return `
      <div class="roadmap-erledigt-item" id="roadmap-fokus-${phase.nr}">
        <div class="roadmap-erledigt-dot">✓</div>
        <div class="roadmap-erledigt-info">
          <div class="roadmap-erledigt-label">Phase ${def.nr}: ${def.label}</div>
          <div class="roadmap-erledigt-meta">${themenDone}/${themenTotal} Themen · ${phase.endDatum ? 'Abgeschlossen: ' + new Date(phase.endDatum).toLocaleDateString('de-DE') : ''}</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="setRoadmapPhaseStatus(${phase.nr}, 'aktiv')" style="flex-shrink:0;">↺ Öffnen</button>
      </div>`;
  }

  // Zukünftig (offen)
  return `
    <div class="roadmap-zukunft-item" id="roadmap-fokus-${phase.nr}">
      <div class="roadmap-zukunft-dot">${def.nr}</div>
      <span class="roadmap-zukunft-label">Phase ${def.nr}: ${def.label}</span>
      <span class="roadmap-zukunft-themen">${themenTotal > 0 ? themenTotal + ' Themen' : '—'}</span>
    </div>`;
}

// ── Fokus auf bestimmte Phase (vom Stepper aufgerufen) ──
function focusRoadmapPhase(nr) {
  const el = document.getElementById(`roadmap-fokus-${nr}`);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// ── HAUPTFUNKTION: renderRoadmap() als Fokus-Dashboard ──
function renderRoadmap() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const container = document.getElementById('roadmap-container');
  if (!container) return;

  let roadmap = DB.getRoadmap(sid);
  const screenings = DB.getScreenings(sid).filter(s => s.abgeschlossen);
  const latestScreening = screenings.length ? screenings.sort((a,b) => b.datum.localeCompare(a.datum))[0] : null;
  const s = DB.getSchuelerById(sid);

  // Kein Förderplan → Erstellungs-UI
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

  // Berechne Statistiken
  const totalThemen = roadmap.phasen.reduce((sum, p) => sum + p.themen.length, 0);
  const erledigteThemen = roadmap.phasen.reduce((sum, p) => sum + p.themen.filter(t => t.status === 'abgeschlossen').length, 0);
  const gesamtFortschritt = totalThemen > 0 ? Math.round((erledigteThemen / totalThemen) * 100) : 0;

  // Phasen gruppieren
  const aktivePhase = roadmap.phasen.find(p => p.status === 'aktiv');
  const aktivIdx = aktivePhase ? roadmap.phasen.indexOf(aktivePhase) : -1;
  const erledigtePhasen = roadmap.phasen.filter(p => p.status === 'erledigt');
  const naechstePhase = aktivIdx >= 0 && aktivIdx < roadmap.phasen.length - 1 ? roadmap.phasen[aktivIdx + 1] : null;
  const naechsteIdx = naechstePhase ? roadmap.phasen.indexOf(naechstePhase) : -1;
  const zukuenftigePhasen = roadmap.phasen.filter((p, i) => p.status === 'offen' && i !== naechsteIdx);

  let html = '';

  // Header
  html += `
    <div class="roadmap-header">
      <div class="roadmap-header-left">
        <h2 class="roadmap-titel">🗺️ Förderplan — ${s.vorname} ${s.nachname}</h2>
        <div class="roadmap-meta">
          Erstellt: ${new Date(roadmap.erstellt).toLocaleDateString('de-DE')} ·
          ${totalThemen} Themen · ${gesamtFortschritt}% gesamt
        </div>
      </div>
      <div class="roadmap-header-actions">
        ${latestScreening ? `<button class="btn btn-secondary btn-sm" onclick="generateRoadmapFromScreening('${latestScreening.id}')">🔄 Aktualisieren</button>` : ''}
        <button class="btn btn-secondary btn-sm" onclick="druckeRoadmap()">🖨️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteCurrentRoadmap()">🗑</button>
      </div>
    </div>`;

  // Gesamtfortschritt
  html += `
    <div class="roadmap-progress-bar-container">
      <div class="roadmap-progress-label">
        <span>Gesamtfortschritt</span>
        <span>${gesamtFortschritt}% (${erledigteThemen}/${totalThemen})</span>
      </div>
      <div class="roadmap-progress-bar">
        <div class="roadmap-progress-fill" style="width:${gesamtFortschritt}%;"></div>
      </div>
    </div>`;

  // Phasen-Stepper
  html += renderPhasenStepper(roadmap);

  // Aktive Phase (Fokus-Dashboard)
  if (aktivePhase) {
    html += renderAktivePhase(roadmap, aktivePhase, aktivIdx);
  } else {
    html += `<div style="text-align:center;padding:40px;color:#6B7280;">
      <div style="font-size:32px;margin-bottom:12px;">🎉</div>
      <div style="font-size:16px;font-weight:600;">Alle Phasen abgeschlossen!</div>
      <p style="font-size:13px;">Oder starte eine Phase über den Stepper oben.</p>
    </div>`;
  }

  // Nächste Phase Vorschau
  if (naechstePhase && naechstePhase.status === 'offen') {
    html += renderNaechstePhaseVorschau(roadmap, naechstePhase, naechsteIdx);
  }

  // Erledigte Phasen (collapsible)
  if (erledigtePhasen.length > 0) {
    html += `
      <div class="roadmap-erledigt-section">
        <div class="roadmap-erledigt-toggle" onclick="toggleErledigtePhasen()">
          <span>✓ Abgeschlossene Phasen (${erledigtePhasen.length})</span>
          <span id="erledigt-toggle-arrow" style="font-size:11px;">▼</span>
        </div>
        <div id="erledigt-phasen-body" style="display:none;">
          ${erledigtePhasen.map(p => renderPhaseKompakt(p, roadmap.phasen.indexOf(p), 'erledigt')).join('')}
        </div>
      </div>`;
  }

  // Zukünftige Phasen (kompakt, ohne nächste)
  if (zukuenftigePhasen.length > 0) {
    html += `
      <div class="roadmap-zukunft-section">
        <div class="roadmap-section-header" style="margin-top:20px;">🔮 Weitere Phasen</div>
        ${zukuenftigePhasen.map(p => renderPhaseKompakt(p, roadmap.phasen.indexOf(p), 'zukunft')).join('')}
      </div>`;
  }

  container.innerHTML = html;
}

// ── Toggle erledigte Phasen ──
function toggleErledigtePhasen() {
  const body = document.getElementById('erledigt-phasen-body');
  const arrow = document.getElementById('erledigt-toggle-arrow');
  if (!body) return;
  const open = body.style.display !== 'none';
  body.style.display = open ? 'none' : 'block';
  if (arrow) arrow.textContent = open ? '▼' : '▲';
}

// Legacy-Kompatibilität: renderRoadmapPhase wird nicht mehr direkt aufgerufen,
// aber wir behalten die Signatur für eventuelle externe Aufrufe
function renderRoadmapPhase(roadmap, phase, idx) {
  return renderAktivePhase(roadmap, phase, idx);
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
  showConfirm('Förderplan wirklich löschen?', () => {
    const roadmap = DB.getRoadmap(APP.currentSchuelerId);
    if (roadmap) DB.deleteRoadmap(roadmap.id);
    renderRoadmap();
  });
}

// Phase-Gate: Trauma-relevante Themen, die Stabilisierung voraussetzen (ISTSS 2019)
const TRAUMA_THEMEN = ['trauma', 'dissoziative-erfahrungen', 'angstanfaelle', 'ptbs', 'traumaverarbeitung'];
const STABILISIERUNGS_PHASEN = [0, 1]; // Phasen 0 + 1 müssen ≥80% erledigt sein

function checkPhaseGate(roadmap, targetPhaseNr) {
  if (targetPhaseNr < 3) return { erlaubt: true }; // Phasen 0-2 immer erlaubt

  // Prüfe ob Stabilisierungsphasen (0+1) ≥80% erledigt
  let totalThemen = 0, doneThemen = 0;
  STABILISIERUNGS_PHASEN.forEach(phNr => {
    const ph = roadmap.phasen.find(p => p.nr === phNr);
    if (ph) {
      totalThemen += ph.themen.length;
      doneThemen += ph.themen.filter(t => t.status === 'abgeschlossen').length;
    }
  });

  const pct = totalThemen > 0 ? Math.round(doneThemen / totalThemen * 100) : 100;
  if (pct < 80 && totalThemen > 0) {
    return {
      erlaubt: false,
      grund: `Phase ${targetPhaseNr} kann erst aktiviert werden, wenn die Stabilisierungsphasen (Phase 0+1) zu ≥80% abgeschlossen sind (aktuell: ${pct}%).`,
      zitat: 'ISTSS 2019: Trauma-fokussierte Interventionen erfordern eine vorherige Stabilisierungsphase.',
      pct
    };
  }

  // Prüfe ob Trauma-Themen in dieser Phase sind und Stabilisierung fehlt
  const targetPhase = roadmap.phasen.find(p => p.nr === targetPhaseNr);
  if (targetPhase) {
    const hatTraumaThema = targetPhase.themen.some(t => TRAUMA_THEMEN.includes(t.id));
    if (hatTraumaThema && pct < 100 && totalThemen > 0) {
      return {
        erlaubt: true,
        warnung: `⚠️ Diese Phase enthält Trauma-Themen. Stabilisierungsphasen sind erst ${pct}% erledigt. Vorsicht empfohlen (ISTSS 2019).`
      };
    }
  }

  return { erlaubt: true };
}

function setRoadmapPhaseStatus(nr, status) {
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);
  if (!roadmap) return;
  const phase = roadmap.phasen.find(p => p.nr === nr);
  if (!phase) return;

  // Phase-Gate prüfen bei Aktivierung
  if (status === 'aktiv') {
    const gate = checkPhaseGate(roadmap, nr);
    if (!gate.erlaubt) {
      showToast(`🔒 ${gate.grund}\n\n📚 ${gate.zitat}`, 'error', 8000);
      return;
    }
    if (gate.warnung) {
      showToast(gate.warnung, 'warning', 6000);
    }
  }

  phase.status = status;
  if (status === 'aktiv' && !phase.startDatum) {
    phase.startDatum = new Date().toISOString().split('T')[0];
  }
  if (status === 'erledigt') {
    phase.endDatum = new Date().toISOString().split('T')[0];
    // Auto-start next phase (mit Gate-Check)
    const next = roadmap.phasen.find(p => p.nr === nr + 1);
    if (next && next.status === 'offen') {
      const gate = checkPhaseGate(roadmap, nr + 1);
      if (gate.erlaubt) {
        next.status = 'aktiv';
        next.startDatum = new Date().toISOString().split('T')[0];
        if (gate.warnung) showToast(gate.warnung, 'warning', 6000);
      } else {
        showToast(`🔒 Nächste Phase nicht automatisch aktiviert: ${gate.grund}`, 'warning', 6000);
      }
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
  const themaId = phase.themen[themaIdx].id;
  const wirdAbgeschlossen = phase.themen[themaIdx].status !== 'abgeschlossen';
  phase.themen[themaIdx].status = wirdAbgeschlossen ? 'abgeschlossen' : 'offen';
  DB.saveRoadmap(roadmap);

  // Meilenstein-Check: Verknüpfte Ziele prüfen
  if (wirdAbgeschlossen) {
    const schueler = DB.getSchuelerById(APP.currentSchuelerId);
    const verknuepfteZiele = (schueler && schueler.ziele || []).filter(z => z.roadmapThema === themaId);
    verknuepfteZiele.forEach(z => {
      const offeneMeilensteine = (z.meilensteine || []).filter(m => !m.erledigt);
      if (offeneMeilensteine.length > 0) {
        showToast(`🎯 Thema abgeschlossen! Prüfe Meilensteine für Ziel "${z.text}" (${offeneMeilensteine.length} offen)`, 'info', 5000);
      } else if (z.fortschritt < 100) {
        showToast(`🎯 Thema abgeschlossen! Ziel "${z.text}" aktualisieren?`, 'success', 4000);
      }
    });
  }

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
        ${d.icd ? `<div style="font-size:11px;color:#888;margin-top:3px;">ICD-10: ${d.icd}${d.instrument ? ` · Instrument: <em>${d.instrument}</em>` : ''}</div>` : ''}
        ${d.cutoffQuelle ? `<div style="font-size:10px;color:#9CA3AF;margin-top:2px;">Cutoff ≥${d.cutoff}: ${d.cutoffQuelle}</div>` : ''}
        <div style="font-size:11px;color:${interpretColor};margin-top:4px;font-weight:500;">${interpretText}</div>
        ${typeof SCREENING_INTERPRETATION !== 'undefined' && SCREENING_INTERPRETATION[d.id] ? `<details style="margin-top:6px;"><summary style="font-size:11px;cursor:pointer;color:#2563EB;font-weight:500;">💡 Was tun? Details anzeigen</summary><div style="font-size:11px;line-height:1.6;margin-top:6px;padding:8px;background:#EFF6FF;border-radius:6px;"><div style="margin-bottom:6px;color:#1E3A5F;">${SCREENING_INTERPRETATION[d.id].was_bedeutet_auffaellig}</div><div style="font-weight:600;margin-bottom:3px;color:#1D4ED8;">Sofortmaßnahmen:</div><ul style="margin:0 0 6px 16px;padding:0;">${SCREENING_INTERPRETATION[d.id].sofort_massnahmen.map(m => '<li style="margin-bottom:2px;">' + m + '</li>').join('')}</ul><div style="font-size:10px;color:#DC2626;font-weight:500;">${SCREENING_INTERPRETATION[d.id].wann_ueberweisen}</div></div></details>` : ''}
        ${(() => { const _wiki = (typeof findWikiForScreeningDomain === 'function') ? findWikiForScreeningDomain(d.id) : null; return _wiki ? '<div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:6px;align-items:center;">' + renderWikiLink(_wiki.id) + renderArbeitsblattChipsFromThemenIds(_wiki.themen_ids) + '</div>' : ''; })()}
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
  renderScrNaechsteSchritte(scr);

  // Tab reset
  showScrTab('risikoprofil');
}

// ── Nächster-Schritt-Wizard nach Screening-Abschluss ──
function renderScrNaechsteSchritte(scr) {
  const el = document.getElementById('scr-naechste-schritte');
  if (!el) return;

  const flagged = scr.flaggedAreas || [];
  if (flagged.length === 0) {
    el.style.display = 'none';
    return;
  }
  el.style.display = 'block';

  // Relevante Anamnese-Kategorien basierend auf flagged domains
  const domainAnamneseMap = {
    depression: ['psychische_gesundheit', 'verluste'],
    angst: ['psychische_gesundheit', 'schule'],
    trauma: ['trauma_gewalt', 'verluste', 'migration'],
    adhs: ['schule', 'psychische_gesundheit'],
    selbstverletzung: ['psychische_gesundheit', 'risikoverhalten'],
    suizidalitaet: ['psychische_gesundheit', 'risikoverhalten', 'verluste'],
    substanz: ['risikoverhalten', 'peers'],
    essstoerung: ['psychische_gesundheit', 'koerper'],
    soziale_isolation: ['peers', 'schule', 'migration'],
    conduct: ['familie', 'peers', 'schule'],
    bindung: ['familie', 'fruehe_kindheit', 'betreuungsgeschichte'],
    schlaf: ['psychische_gesundheit', 'alltag'],
    mobbing: ['peers', 'schule', 'digitale_medien'],
  };

  const relevanteAnamnese = new Set();
  flagged.forEach(fId => {
    (domainAnamneseMap[fId] || []).forEach(k => relevanteAnamnese.add(k));
  });

  // Hypothesen zählen
  const hypothesen = generateHypothesen(scr.schuelerId);
  const neueHypo = hypothesen.filter(h => h.ebene === 'dynamisch').length;

  // Fachkraft-Module basierend auf flagged domains
  const relevanteModule = [];
  flagged.forEach(fId => {
    const domain = SCREENING_DOMAINS.find(d => d.id === fId);
    if (!domain) return;
    if (typeof FACHKRAFT_MODULE_DATEIEN !== 'undefined') {
      const datei = FACHKRAFT_MODULE_DATEIEN[fId];
      if (datei) relevanteModule.push({ label: domain.label, icon: domain.icon, datei });
    }
  });

  // Arbeitsblätter basierend auf flagged domains via Wiki
  const relevanteThemenIds = [];
  flagged.forEach(fId => {
    const wiki = typeof findWikiForScreeningDomain === 'function' ? findWikiForScreeningDomain(fId) : null;
    if (wiki && wiki.themen_ids) wiki.themen_ids.forEach(tid => {
      if (relevanteThemenIds.indexOf(tid) === -1) relevanteThemenIds.push(tid);
    });
  });
  const abChipsHtml = renderArbeitsblattChipsFromThemenIds(relevanteThemenIds);

  // Krise erkannt?
  const krisenDomains = flagged.filter(f => ['selbstverletzung', 'suizidalitaet', 'psychose'].includes(f));

  el.innerHTML = `
    <div class="card" style="margin-top:16px;border:2px solid #2563EB;background:linear-gradient(135deg,#EFF6FF,#F8FAFC);">
      <div class="card-header" style="background:#2563EB;color:white;border-radius:8px 8px 0 0;">
        <span>🧭</span>
        <div class="card-title" style="color:white;">Nächste Schritte nach dem Screening</div>
      </div>
      <div class="card-body">
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">
          ${flagged.length} Bereich${flagged.length !== 1 ? 'e' : ''} auffällig — hier ist dein Fahrplan:
        </p>

        ${krisenDomains.length > 0 ? `
        <div class="scr-wizard-step scr-wizard-krise" style="background:#FEF2F2;border:1px solid #FECACA;border-radius:8px;padding:12px;margin-bottom:10px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <span style="font-size:18px;">🚨</span>
            <strong style="color:#DC2626;">PRIORITÄT: Krisenprotokoll prüfen</strong>
          </div>
          <p style="font-size:12px;margin:0 0 8px;">Krisenrelevante Bereiche erkannt: ${krisenDomains.map(k => SCREENING_DOMAINS.find(d => d.id === k)?.label || k).join(', ')}</p>
          <button class="btn btn-sm" style="background:#DC2626;color:white;border:none;" onclick="showProfilTab('risiko');showView('profil',APP.currentSchuelerId);">→ Risikocheck öffnen</button>
        </div>` : ''}

        <div class="scr-wizard-steps" style="display:flex;flex-direction:column;gap:8px;">
          <div class="scr-wizard-step" style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;background:white;border-radius:8px;border:1px solid #E2E8F0;">
            <span class="scr-wizard-nr" style="background:#2563EB;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">1</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">Anamnese vertiefen</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Relevante Kategorien: ${[...relevanteAnamnese].slice(0, 5).map(k => {
                const kat = typeof ANAMNESE_KATEGORIEN !== 'undefined' ? ANAMNESE_KATEGORIEN.find(c => c.id === k) : null;
                return kat ? kat.label : k;
              }).join(', ')}</div>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="showProfilTab('info');showView('profil','${scr.schuelerId}');">Anamnese →</button>
          </div>

          <div class="scr-wizard-step" style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;background:white;border-radius:8px;border:1px solid #E2E8F0;">
            <span class="scr-wizard-nr" style="background:#6366F1;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">2</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">Hypothesen prüfen</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${hypothesen.length} Hypothesen generiert${neueHypo > 0 ? `, davon ${neueHypo} dynamisch (Screening + Anamnese)` : ''}</div>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="showProfilTab('hypothesen-tab');showView('profil','${scr.schuelerId}');">Hypothesen →</button>
          </div>

          ${relevanteModule.length > 0 ? `
          <div class="scr-wizard-step" style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;background:white;border-radius:8px;border:1px solid #E2E8F0;">
            <span class="scr-wizard-nr" style="background:#059669;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">3</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">Fachkraft-Module lesen</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
                ${relevanteModule.slice(0, 4).map(m => `<span onclick="window.open('fachkraft-module/${m.datei}','_blank')" style="cursor:pointer;background:#ECFDF5;border:1px solid #A7F3D0;color:#065F46;padding:2px 8px;border-radius:8px;font-size:11px;">${m.icon} ${m.label}</span>`).join('')}
              </div>
            </div>
          </div>` : ''}

          ${abChipsHtml ? `
          <div class="scr-wizard-step" style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;background:white;border-radius:8px;border:1px solid #E2E8F0;">
            <span class="scr-wizard-nr" style="background:#C2410C;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${relevanteModule.length > 0 ? '4' : '3'}</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">Arbeitsblätter für die Sitzung</div>
              <div style="display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;">
                ${abChipsHtml}
              </div>
            </div>
          </div>` : ''}

          <div class="scr-wizard-step" style="display:flex;align-items:flex-start;gap:12px;padding:10px 12px;background:white;border-radius:8px;border:1px solid #E2E8F0;">
            <span class="scr-wizard-nr" style="background:#D97706;color:white;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;">${(relevanteModule.length > 0 ? 1 : 0) + (abChipsHtml ? 1 : 0) + 3}</span>
            <div style="flex:1;">
              <div style="font-weight:600;font-size:13px;">Förderplan erstellen</div>
              <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">Screening-basierte Roadmap mit priorisierten Themen und Sitzungsvorschlägen</div>
            </div>
            <button class="btn btn-sm btn-secondary" onclick="showProfilTab('roadmap');showView('profil','${scr.schuelerId}');">Roadmap →</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

// ── Adaptive Sitzungssteuerung (Idee 1) ──
function renderScrSitzungsplan(scr) {
  const el = document.getElementById('scr-sitzungsplan');
  if (!el) return;
  const s = DB.getSchuelerById(scr.schuelerId);
  if (!s) return;

  // Bestimme passenden Sitzungstyp basierend auf Screening + ORS/SRS
  const flagged = scr.flaggedAreas || [];
  const krisenDomains = flagged.filter(f => ['selbstverletzung', 'suizidalitaet', 'psychose'].includes(f));
  const notizen = DB.getNotizen(s.id).filter(n => n.soap).sort((a, b) => b.datum.localeCompare(a.datum));
  const letzteORS = notizen.find(n => n.soap.ors?.total != null);
  const letzteSRS = notizen.find(n => n.soap.srs?.total != null);
  const orsWert = letzteORS?.soap.ors.total ?? null;
  const srsWert = letzteSRS?.soap.srs.total ?? null;

  // Template-Auswahl
  let empfohleneTemplates = [];
  if (krisenDomains.length > 0) empfohleneTemplates.push('krise');
  if (notizen.length === 0) empfohleneTemplates.push('erstgespraech');
  if (srsWert !== null && srsWert < 25) empfohleneTemplates.push('srs_niedrig');
  if (orsWert !== null && orsWert < 28) empfohleneTemplates.push('ors_niedrig');
  else if (orsWert !== null && orsWert >= 28) empfohleneTemplates.push('ors_hoch');
  if (empfohleneTemplates.length === 0) empfohleneTemplates.push('regulaer');

  let html = `
    <div style="margin-bottom:16px;">
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">🎯 Adaptive Sitzungssteuerung</div>
      <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">
        Basierend auf Screening-Profil${orsWert !== null ? `, ORS ${orsWert}/40` : ''}${srsWert !== null ? `, SRS ${srsWert}/40` : ''} und ${notizen.length} bisherigen Sitzungen.
      </div>
    </div>`;

  empfohleneTemplates.forEach((key, idx) => {
    const t = SITZUNGS_TEMPLATES[key];
    if (!t) return;
    const isFirst = idx === 0;
    html += `
      <div class="card" style="margin-bottom:12px;${isFirst ? 'border:2px solid ' + t.farbe + ';' : ''}">
        <div class="card-header" style="background:${t.farbe}10;">
          <span>${t.icon}</span>
          <div class="card-title">${t.titel}${isFirst ? ' <span style="font-size:11px;background:' + t.farbe + ';color:white;padding:1px 8px;border-radius:8px;margin-left:6px;">Empfohlen</span>' : ''}</div>
        </div>
        <div class="card-body" style="padding:0;">
          ${t.phasen.map((p, i) => `
            <div style="display:flex;align-items:flex-start;gap:12px;padding:10px 16px;${i > 0 ? 'border-top:1px solid var(--border,#E5E7EB);' : ''}">
              <div style="min-width:50px;font-size:11px;font-weight:600;color:${t.farbe};padding-top:1px;">${p.dauer}</div>
              <div style="flex:1;">
                <div style="font-size:13px;font-weight:600;">${p.label}</div>
                <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${p.beschreibung}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  });

  // Alle Templates als Auswahl anzeigen
  html += `
    <details style="margin-top:12px;">
      <summary style="font-size:12px;cursor:pointer;color:#2563EB;font-weight:500;">Alle Sitzungstypen anzeigen</summary>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:8px;margin-top:8px;">
        ${Object.entries(SITZUNGS_TEMPLATES).map(([key, t]) => `
          <div style="padding:10px;background:var(--card-bg,#fff);border:1px solid var(--border,#E5E7EB);border-radius:8px;border-left:3px solid ${t.farbe};">
            <div style="font-size:13px;font-weight:600;">${t.icon} ${t.titel}</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">${t.phasen.length} Phasen · ${t.phasen.reduce((s, p) => s + parseInt(p.dauer), 0)} Min</div>
          </div>
        `).join('')}
      </div>
    </details>`;

  el.innerHTML = sanitize(html);
}

// ── Mikro-Interventionsbibliothek (Idee 2) ──
function renderScrMikroInterventionen(scr) {
  const el = document.getElementById('scr-mikro-interventionen');
  if (!el) return;

  const flagged = scr.flaggedAreas || [];
  if (flagged.length === 0) {
    el.innerHTML = '<div style="text-align:center;padding:24px;color:var(--text-muted);">Keine auffälligen Bereiche — keine spezifischen Mikro-Interventionen empfohlen.</div>';
    return;
  }

  let html = `
    <div style="margin-bottom:16px;">
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">⚡ Mikro-Interventionsbibliothek</div>
      <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">
        Kurze, evidenzbasierte Übungen (2-5 Min) passend zu den auffälligen Bereichen. Ideal als Sitzungseinstieg oder Abschluss.
      </div>
    </div>`;

  flagged.forEach(domainId => {
    const domain = SCREENING_DOMAINS.find(d => d.id === domainId);
    if (!domain) return;
    const interventionen = MIKRO_INTERVENTIONEN[domainId] || [];
    if (interventionen.length === 0) return;

    html += `
      <div class="card" style="margin-bottom:12px;border-left:4px solid ${domain.farbe};">
        <div class="card-header" style="background:${domain.farbe}10;">
          <span>${domain.icon}</span>
          <div class="card-title">${domain.label}</div>
          <span style="font-size:11px;color:var(--text-muted);">${interventionen.length} Übung${interventionen.length !== 1 ? 'en' : ''}</span>
        </div>
        <div class="card-body" style="padding:0;">
          ${interventionen.map((mi, i) => `
            <div style="padding:12px 16px;${i > 0 ? 'border-top:1px solid var(--border,#E5E7EB);' : ''}">
              <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;">
                <div style="font-size:13px;font-weight:600;">${mi.titel}</div>
                <span style="font-size:10px;padding:2px 8px;background:#F3F4F6;border-radius:8px;color:#6B7280;">⏱ ${mi.dauer}</span>
              </div>
              <div style="font-size:12px;color:var(--text);line-height:1.6;margin-bottom:4px;">${mi.beschreibung}</div>
              <div style="font-size:10px;color:#9CA3AF;font-style:italic;">📚 ${mi.evidenz}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
  });

  if (html.indexOf('card-header') === -1 + html.indexOf('Mikro-Interventionsbibliothek')) {
    html += '<div style="padding:16px;color:var(--text-muted);font-size:12px;">Für die auffälligen Bereiche sind noch keine Mikro-Interventionen hinterlegt.</div>';
  }

  el.innerHTML = sanitize(html);
}

// ── Prognostik-Modul (Idee 4) ──
function renderScrPrognostik(scr) {
  const el = document.getElementById('scr-prognostik');
  if (!el) return;
  const s = DB.getSchuelerById(scr.schuelerId);
  if (!s) return;

  const flagged = scr.flaggedAreas || [];
  const risikoFaktoren = [];
  const schutzFaktoren = [];
  let risikoScore = 0;

  // Risiko-Faktoren prüfen
  PROGNOSTIK_FAKTOREN.risiko.forEach(f => {
    try {
      if (f.check(scr, s)) {
        risikoFaktoren.push(f);
        risikoScore += f.gewicht;
      }
    } catch(e) { /* silent */ }
  });

  // Schutz-Faktoren prüfen
  PROGNOSTIK_FAKTOREN.schutz.forEach(f => {
    try {
      if (f.check(scr, s)) {
        schutzFaktoren.push(f);
        risikoScore += f.gewicht; // gewicht ist negativ
      }
    } catch(e) { /* silent */ }
  });

  // Dauer-Schätzung
  const cfg = PROGNOSTIK_FAKTOREN.dauer_schaetzung;
  const rohWochen = cfg.basis_wochen + (risikoScore * cfg.pro_risiko_punkt);
  const geschaetzteWochen = Math.max(cfg.min_wochen, Math.min(cfg.max_wochen, rohWochen));
  const geschaetzteMonate = Math.round(geschaetzteWochen / 4.3);

  // Prognose-Stufe
  let prognoseStufe, prognoseLabel, prognoseFarbe, prognoseIcon;
  if (risikoScore <= 0) {
    prognoseStufe = 'guenstig';
    prognoseLabel = 'Günstige Prognose';
    prognoseFarbe = '#10B981';
    prognoseIcon = '🟢';
  } else if (risikoScore <= 3) {
    prognoseStufe = 'mittel';
    prognoseLabel = 'Moderate Prognose';
    prognoseFarbe = '#F59E0B';
    prognoseIcon = '🟡';
  } else {
    prognoseStufe = 'komplex';
    prognoseLabel = 'Komplexe Prognose';
    prognoseFarbe = '#EF4444';
    prognoseIcon = '🔴';
  }

  // Empfohlene Sitzungsfrequenz
  let frequenz;
  if (risikoScore >= 5) frequenz = '2x pro Woche';
  else if (risikoScore >= 2) frequenz = '1x pro Woche';
  else if (risikoScore >= 0) frequenz = '1x pro Woche bis 14-tägig';
  else frequenz = '14-tägig bis monatlich';

  let html = `
    <div style="margin-bottom:16px;">
      <div style="font-size:15px;font-weight:700;margin-bottom:4px;">🔮 Prognostische Einschätzung</div>
      <div style="font-size:12px;color:var(--text-muted);line-height:1.5;">
        Basierend auf ${flagged.length} auffälligen Bereichen, ${risikoFaktoren.length} Risiko- und ${schutzFaktoren.length} Schutzfaktoren.
        <br><em>Hinweis: Dies ist eine algorithmusbasierte Orientierung, keine klinische Diagnose.</em>
      </div>
    </div>

    <!-- Prognose-Banner -->
    <div style="padding:16px;background:${prognoseFarbe}10;border:2px solid ${prognoseFarbe};border-radius:12px;margin-bottom:16px;display:flex;align-items:center;gap:16px;">
      <div style="font-size:36px;">${prognoseIcon}</div>
      <div style="flex:1;">
        <div style="font-size:16px;font-weight:700;color:${prognoseFarbe};">${prognoseLabel}</div>
        <div style="font-size:13px;color:var(--text);margin-top:4px;">
          Geschätzte Begleitdauer: <strong>${geschaetzteMonate} Monate</strong> (${geschaetzteWochen} Wochen)
          · Empfohlene Frequenz: <strong>${frequenz}</strong>
        </div>
      </div>
    </div>

    <!-- Risiko/Schutz-Faktoren -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
      <div class="card">
        <div class="card-header" style="background:#FEF2F2;"><span>⚠️</span><div class="card-title" style="color:#DC2626;">Risikofaktoren (${risikoFaktoren.length})</div></div>
        <div class="card-body" style="padding:0;">
          ${risikoFaktoren.length === 0 ? '<div style="padding:12px;color:#10B981;font-size:12px;">Keine identifizierten Risikofaktoren</div>' :
            risikoFaktoren.map(f => `
              <div style="padding:8px 12px;border-bottom:1px solid #FEE2E2;">
                <div style="font-size:12px;font-weight:600;color:#991B1B;">${f.label}</div>
                <div style="font-size:11px;color:#6B7280;margin-top:2px;">${f.beschreibung}</div>
              </div>
            `).join('')}
        </div>
      </div>

      <div class="card">
        <div class="card-header" style="background:#ECFDF5;"><span>🛡️</span><div class="card-title" style="color:#065F46;">Schutzfaktoren (${schutzFaktoren.length})</div></div>
        <div class="card-body" style="padding:0;">
          ${schutzFaktoren.length === 0 ? '<div style="padding:12px;color:#F59E0B;font-size:12px;">Noch keine Schutzfaktoren identifiziert — Stärken-Screening durchführen</div>' :
            schutzFaktoren.map(f => `
              <div style="padding:8px 12px;border-bottom:1px solid #A7F3D0;">
                <div style="font-size:12px;font-weight:600;color:#065F46;">${f.label}</div>
                <div style="font-size:11px;color:#6B7280;margin-top:2px;">${f.beschreibung}</div>
              </div>
            `).join('')}
        </div>
      </div>
    </div>

    <!-- Verlaufsprognose-Hinweise -->
    <div class="card">
      <div class="card-header"><span>📊</span><div class="card-title">Verlaufserwartung</div></div>
      <div class="card-body">
        <div style="font-size:12px;line-height:1.8;">
          ${prognoseStufe === 'guenstig' ? `
            <p>✅ <strong>Erwarteter Verlauf:</strong> Bei regelmäßigen Sitzungen und stabiler Unterstützung ist eine deutliche Besserung innerhalb von ${geschaetzteMonate} Monaten wahrscheinlich.</p>
            <p>📋 <strong>Empfehlung:</strong> Fokussierte Themenarbeit, Stärken-Orientierung, frühzeitige Übergangsplanung.</p>
            <p>📈 <strong>Re-Screening:</strong> In 8 Wochen zur Verlaufskontrolle.</p>
          ` : prognoseStufe === 'mittel' ? `
            <p>🟡 <strong>Erwarteter Verlauf:</strong> Fortschritte sind möglich, aber erfordern strukturierte Arbeit. Rückschläge sind einzuplanen.</p>
            <p>📋 <strong>Empfehlung:</strong> Klare Zielvereinbarungen, engmaschiges ORS/SRS-Monitoring, Elternarbeit intensivieren.</p>
            <p>📈 <strong>Re-Screening:</strong> In 6 Wochen zur Verlaufskontrolle. Bei ORS-Verschlechterung: Behandlungsplan anpassen.</p>
            <p>🔗 <strong>Vernetzung:</strong> Therapeutische Anbindung prüfen, Schule einbeziehen.</p>
          ` : `
            <p>🔴 <strong>Erwarteter Verlauf:</strong> Komplexes Belastungsprofil — langfristige, multimodale Begleitung erforderlich.</p>
            <p>📋 <strong>Empfehlung:</strong> Stabilisierung vor Themenarbeit, Krisenplan aktiv halten, Netzwerkarbeit ist essentiell.</p>
            <p>📈 <strong>Re-Screening:</strong> Alle 4 Wochen. ORS/SRS bei jeder Sitzung. Bei Stagnation nach 8 Wochen: Fallkonferenz.</p>
            <p>🔗 <strong>Vernetzung:</strong> Therapeut, Kinder- und Jugendpsychiater, ggf. ONE/OPJ, Schulpsychologie.</p>
            <p>⚠️ <strong>Achtung:</strong> Therapieabbruch-Risiko erhöht — Beziehungsarbeit priorisieren, niederschwellige Kontaktformen anbieten.</p>
          `}
        </div>
      </div>
    </div>
  `;

  el.innerHTML = sanitize(html);
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
  if (tab === 'sitzungsplan' || tab === 'interventionen' || tab === 'prognostik') {
    const scr = DB.getScreenings().find(s => s.id === APP.currentScreeningId);
    if (scr) {
      if (tab === 'sitzungsplan') renderScrSitzungsplan(scr);
      if (tab === 'interventionen') renderScrMikroInterventionen(scr);
      if (tab === 'prognostik') renderScrPrognostik(scr);
    }
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
  showConfirm('Screening wirklich löschen?', () => {
    DB.deleteScreening(APP.currentScreeningId);
    APP.currentScreeningId = null;
    scrShowContainer('liste');
    renderScreeningHistorie(APP.currentSchuelerId);
    renderSidebar();
    showToast('Screening gelöscht', 'success');
  });
}

function scrShowContainer(which) {
  document.getElementById('screening-liste-container').style.display = which === 'liste' ? '' : 'none';
  document.getElementById('screening-formular-container').style.display = which === 'formular' ? '' : 'none';
  document.getElementById('screening-ergebnis-container').style.display = which === 'ergebnis' ? '' : 'none';
}

function severityBadgeHtml(severity, large = false) {
  const map = {
    low:    { label: 'Unauffällig', bg: '#DCFCE7', color: '#065F46' },
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
  abklaerung:  { icon: '\u{1F52C}', label: 'FACHDIAGNOSTIK EMPFOHLEN', farbe: '#4F46E5', bg: '#EEF2FF', prefix: 'Fachdiagnostik' },
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
  eng: { farbe: '#10B981', label: 'Eng', border: '3px solid #10B981' },
  normal: { farbe: '#2563EB', label: 'Normal', border: '2px solid #2563EB' },
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
    html += '<button onclick="verhaltensFilter=\'' + tag + '\';renderVerhalten();" style="padding:4px 12px;border-radius:16px;border:1px solid ' + (isActive ? '#2563EB' : '#E5E7EB') + ';background:' + (isActive ? '#EFF6FF' : '#fff') + ';font-size:12px;cursor:pointer;color:' + (isActive ? '#2563EB' : '#6B7280') + ';">' + tag + '</button>';
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
    var pvtColor = u.pvt === 'ventral' ? '#059669' : (u.pvt === 'sympathikus' ? '#D97706' : '#4F46E5');
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
    html += '<div style="background:#EFF6FF;border-left:3px solid #2563EB;border-radius:4px;padding:10px 12px;margin-bottom:8px;">';
    html += '<div style="font-size:11px;font-weight:600;color:#1D4ED8;margin-bottom:4px;">Situation: ' + sk.situation + '</div>';
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
      html += '<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;align-items:center;">' + renderWikiLink(wikiArt.id) + renderArbeitsblattChipsFromThemenIds(wikiArt.themen_ids) + '</div>';
    }
  }

  // Action Buttons
  html += '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #E5E7EB;display:flex;gap:6px;flex-wrap:wrap;">';
  var soapText = e.titel + ': ' + e.wie_es_aussieht.slice(0, 3).join('; ');
  var escapedTitel = e.titel.replace(/'/g, "\\'").replace(/"/g, "&quot;");
  var escapedId = e.id.replace(/'/g, "\\'");
  var escapedSoap = soapText.replace(/'/g, "\\'").replace(/"/g, "&quot;");
  var katIcon = farbe === '#D97706' ? '⚡' : farbe === '#4F46E5' ? '🌊' : farbe === '#059669' ? '🤝' : '🏫';

  // Beobachtet-Toggle
  html += '<button onclick="toggleVerhaltensBeobachtet(\'' + escapedId + '\', this)" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #D1D5DB;border-radius:6px;background:#fff;cursor:pointer;color:#6B7280;" title="Als beobachtet markieren">👁️ Beobachtet</button>';

  // Beobachtung notieren
  html += '<button onclick="verhaltensBeobachtungNotieren(\'' + escapedId + '\', \'' + escapedTitel + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #D1D5DB;border-radius:6px;background:#fff;cursor:pointer;color:#6B7280;" title="Beobachtung notieren">📝 Notieren</button>';

  // In 5P übernehmen
  html += '<button onclick="verhaltensEintragTo5P(\'' + escapedId + '\', \'' + escapedTitel + '\', \'' + katIcon + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #2563EB;border-radius:6px;background:#EFF6FF;cursor:pointer;color:#2563EB;" title="In 5P-Analyse übernehmen">🧩 In 5P</button>';

  // SOAP übernehmen
  html += '<button onclick="uebernehmeInSOAP(\'' + escapedSoap + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #D1D5DB;border-radius:6px;background:#fff;cursor:pointer;color:#6B7280;" title="In SOAP-Protokoll übernehmen">📋 SOAP</button>';

  // Sitzung starten
  var verwandteThemen = (e.verwandte_themen || []);
  if (verwandteThemen.length > 0) {
    html += '<button onclick="verhaltensStarteSitzung(\'' + verwandteThemen[0] + '\')" class="verhalten-action-btn" style="font-size:12px;padding:5px 12px;border:1px solid #10B981;border-radius:6px;background:#ECFDF5;cursor:pointer;color:#065F46;" title="Sitzung zum verwandten Thema starten">▶️ Sitzung</button>';
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
    btn.style.borderColor = '#10B981';
    btn.style.color = '#065F46';
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

  // ── Risiko-Flagging: Automatische Warnungen ──
  const genoWarnungen = [];
  const hatMutter = geno.some(p => ['mutter', 'stiefmutter', 'pflegemutter'].includes(p.rolle));
  const hatVater = geno.some(p => ['vater', 'stiefvater', 'pflegevater'].includes(p.rolle));
  if (!hatMutter && !hatVater) {
    genoWarnungen.push({ stufe: 'rot', text: 'Kein Elternteil im Genogramm erfasst — Abklärung Familiensituation empfohlen' });
  } else if (!hatMutter || !hatVater) {
    genoWarnungen.push({ stufe: 'gelb', text: 'Nur ein Elternteil erfasst — fehlender Elternteil klären' });
  }

  const konflikte = geno.filter(p => p.beziehung === 'konflikt');
  const abbrueche = geno.filter(p => p.beziehung === 'abbruch');
  if (konflikte.length + abbrueche.length === geno.length && geno.length >= 2) {
    genoWarnungen.push({ stufe: 'rot', text: 'Alle Beziehungen sind konflikthaft oder abgebrochen — hohe familiäre Belastung' });
  } else if (konflikte.length + abbrueche.length > geno.length / 2) {
    genoWarnungen.push({ stufe: 'gelb', text: 'Mehrheit der Beziehungen belastet (' + (konflikte.length + abbrueche.length) + '/' + geno.length + ')' });
  }

  // Keyword-Detection in Notizen
  const risikoKeywords = /psychisch|depression|sucht|alkohol|drogen|gewalt|missbrauch|misshandl|vernachläss|suizid|psychiatr/i;
  geno.forEach(p => {
    if (p.notiz && risikoKeywords.test(p.notiz)) {
      genoWarnungen.push({ stufe: 'gelb', text: 'Risiko-Hinweis bei ' + p.name + ': "' + p.notiz.substring(0, 60) + '"', person: p.name });
    }
  });

  function personCard(p) {
    const bez = GENO_BEZ_STYLES[p.beziehung] || GENO_BEZ_STYLES.normal;
    const rolleLabel = GENO_ROLLEN_LABELS[p.rolle] || p.rolle;
    const hatRisikoNotiz = p.notiz && risikoKeywords.test(p.notiz);
    return '<div style="background:#fff;border:' + bez.border + ';border-radius:10px;padding:8px 10px;min-width:100px;text-align:center;position:relative;">'
      + (hatRisikoNotiz ? '<div style="position:absolute;top:-6px;left:-6px;font-size:14px;" title="Risiko-Hinweis in Notiz">⚠️</div>' : '')
      + '<div style="font-size:13px;font-weight:600;">' + escapeHtml(p.name) + '</div>'
      + '<div style="font-size:10px;color:#6B7280;">' + rolleLabel + '</div>'
      + '<div style="font-size:9px;color:' + bez.farbe + ';font-weight:600;margin-top:2px;">' + bez.label + '</div>'
      + (p.notiz ? '<div style="font-size:9px;color:#9CA3AF;margin-top:2px;font-style:italic;">' + escapeHtml(p.notiz) + '</div>' : '')
      + '<button onclick="deleteGenogrammPerson(' + p.id + ')" style="position:absolute;top:2px;right:4px;background:none;border:none;font-size:10px;cursor:pointer;color:#D1D5DB;">✕</button>'
      + '</div>';
  }

  let vHtml = '';

  // Risiko-Warnungen anzeigen
  if (genoWarnungen.length > 0) {
    const warnFarben = { rot: { bg: '#FEF2F2', border: '#FECACA', text: '#DC2626' }, gelb: { bg: '#FFFBEB', border: '#FDE68A', text: '#92400E' } };
    vHtml += '<div style="margin-bottom:12px;">';
    genoWarnungen.forEach(w => {
      const f = warnFarben[w.stufe] || warnFarben.gelb;
      vHtml += `<div style="background:${f.bg};border:1px solid ${f.border};border-radius:6px;padding:6px 10px;margin-bottom:4px;font-size:11px;color:${f.text};">${w.stufe === 'rot' ? '🔴' : '🟡'} ${w.text}</div>`;
    });
    vHtml += '</div>';
  }

  vHtml += '<div style="display:flex;flex-direction:column;align-items:center;gap:8px;">';

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

  vHtml += '<div style="background:linear-gradient(135deg,#6366F1,#6366F1);color:#fff;border-radius:12px;padding:10px 20px;font-weight:700;font-size:14px;box-shadow:0 2px 8px rgba(99,102,241,0.3);">'
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
      html += '<div style="background:#EFF6FF;border-left:3px solid #2563EB;padding:8px 10px;margin-bottom:4px;border-radius:0 6px 6px 0;font-size:12px;color:#1D4ED8;font-style:italic;">' + s + '</div>';
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
  html += '<div style="background:#EFF6FF;border-radius:10px;padding:14px;margin-top:16px;">';
  html += '<div style="font-weight:600;font-size:13px;color:#0C4A6E;margin-bottom:6px;">📄 Nachbereitung & Dokumentation</div>';
  html += '<div style="font-size:12px;color:#1D4ED8;margin-bottom:6px;">' + g.nachbereitung + '</div>';
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
  html += '<details open style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">🔍 Screening-Ergebnis</summary>';
  html += '<div style="padding:8px 0;">';
  f.screening_ergebnis.auffaellig.forEach(function(s) {
    html += '<div style="background:#FEF2F2;border-left:3px solid #EF4444;padding:8px 10px;margin-bottom:6px;border-radius:0 6px 6px 0;">';
    html += '<div style="font-weight:600;font-size:12px;color:#991B1B;">' + s.domain + ' — Score: ' + s.score + '/' + s.cutoff + ' (Cutoff)</div>';
    html += '<div style="font-size:11px;color:#7F1D1D;margin-top:2px;">' + s.text + '</div></div>';
  });
  html += '<div style="font-size:11px;color:#6B7280;margin-top:6px;">Unauffällig: ' + f.screening_ergebnis.unauffaellig.join(', ') + '</div>';
  html += '</div></details>';

  // 5P-Formulierung
  html += '<details open style="margin-bottom:12px;"><summary style="font-weight:600;font-size:13px;cursor:pointer;padding:8px 0;">🧩 5P-Fallformulierung</summary>';
  html += '<div style="padding:8px 0;">';
  var pLabels = { presenting: '🔴 Presenting', predisposing: '🟡 Predisposing', precipitating: '🟠 Precipitating', perpetuating: '🔵 Perpetuating', protective: '🟢 Protective' };
  ['presenting', 'predisposing', 'precipitating', 'perpetuating', 'protective'].forEach(function(key) {
    html += '<div style="margin-bottom:10px;"><div style="font-weight:600;font-size:12px;margin-bottom:4px;">' + pLabels[key] + '</div>';
    f.fivep[key].forEach(function(item) {
      html += '<div style="font-size:12px;color:#374151;padding:3px 0;">• ' + item + '</div>';
    });
    html += '</div>';
  });
  html += '<div style="background:#EFF6FF;border-radius:8px;padding:10px;margin-top:8px;"><div style="font-weight:600;font-size:12px;color:#1D4ED8;margin-bottom:4px;">💡 Hypothese</div>';
  html += '<div style="font-size:12px;color:#1D4ED8;line-height:1.5;font-style:italic;">' + f.fivep.hypothese + '</div></div>';
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
    var pvtColors = { dorsal: '#6366F1', sympathikus: '#EF4444', ventral: '#10B981', 'sympathikus-ventral': '#F59E0B', 'dorsal-sympathikus': '#F97316', 'dorsal-ventral': '#6366F1', 'ventral-sympathikus': '#14B8A6' };
    html += '<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:' + (pvtColors[s.pvt] || '#6B7280') + '20;color:' + (pvtColors[s.pvt] || '#6B7280') + ';font-weight:500;">' + s.pvt + '</span></div>';
    ['s', 'o', 'a', 'p'].forEach(function(k) {
      var labels = { s: 'S — Subjektiv', o: 'O — Objektiv', a: 'A — Assessment', p: 'P — Plan' };
      var colors = { s: '#2563EB', o: '#10B981', a: '#F59E0B', p: '#6366F1' };
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
    var pvtColors = { dorsal: '#6366F1', sympathikus: '#EF4444', ventral: '#10B981', 'sympathikus-ventral': '#F59E0B', 'dorsal-sympathikus': '#F97316', 'dorsal-ventral': '#6366F1', 'ventral-sympathikus': '#14B8A6' };
    html += '<div style="flex:1;min-width:180px;background:' + (pvtColors[p.zustand] || '#6B7280') + '10;border:1px solid ' + (pvtColors[p.zustand] || '#6B7280') + '30;border-radius:8px;padding:10px;">';
    html += '<div style="font-weight:600;font-size:12px;color:' + (pvtColors[p.zustand] || '#6B7280') + ';">Sitzung ' + p.sitzung + '</div>';
    html += '<div style="font-size:11px;color:#374151;margin-top:4px;">' + p.beschreibung + '</div></div>';
  });
  html += '</div></details>';

  // Outcome
  html += '<div style="background:linear-gradient(135deg,#ECFDF5,#EFF6FF);border:1px solid #A7F3D0;border-radius:10px;padding:14px;">';
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

  html += '<div style="background:linear-gradient(135deg,#2563EB,#6366F1);color:white;padding:24px;border-radius:16px 16px 0 0;">';
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
    perpetuating: { bg: '#EFF6FF', border: '#2563EB', title: '🔵 Perpetuating — Was hält es aufrecht?' },
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
  html += '<div style="background:linear-gradient(135deg,#EFF6FF,#ECFDF5);border:2px solid #2563EB;border-radius:10px;padding:16px;">';
  html += '<div style="font-weight:600;font-size:14px;color:#1D4ED8;margin-bottom:8px;">💡 Hypothese — So hängt alles zusammen</div>';
  html += '<div style="font-size:12px;color:#1D4ED8;line-height:1.7;">' + b.hypothese + '</div>';
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
  html += '<input type="text" id="wiki-search" placeholder="Suche (z.B. ADHS, Bindung, ODD, Trauma...)" value="' + escapeHtml(wikiFilter) + '" oninput="wikiFilter=this.value;renderWiki();" style="width:100%;padding:10px 14px;border:2px solid #E5E7EB;border-radius:10px;font-size:13px;outline:none;transition:border-color 0.2s;" onfocus="this.style.borderColor=\'#2563EB\'" onblur="this.style.borderColor=\'#E5E7EB\'">';
  html += '</div>';

  // Kategorie-Filter
  if (typeof WIKI_KATEGORIEN !== 'undefined') {
    html += '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px;">';
    html += '<button onclick="wikiKategorieFilter=\'\';renderWiki();" style="padding:5px 12px;border-radius:20px;border:1px solid ' + (!wikiKategorieFilter ? '#2563EB' : '#E5E7EB') + ';background:' + (!wikiKategorieFilter ? '#2563EB' : 'white') + ';color:' + (!wikiKategorieFilter ? 'white' : '#374151') + ';font-size:12px;cursor:pointer;">Alle</button>';
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
    html += '<details open style="margin-bottom:14px;"><summary style="font-weight:600;font-size:14px;cursor:pointer;padding:8px 0;">🔍 Ursachen & Risikofaktoren</summary>';
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
      html += '<span style="font-size:12px;background:#EFF6FF;color:#1D4ED8;padding:4px 10px;border-radius:12px;">' + k + '</span>';
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
      html += '<div style="font-size:12px;color:#374151;padding:6px 10px;background:#ECFDF5;border-radius:6px;margin-bottom:4px;display:flex;gap:6px;"><span style="color:#10B981;font-weight:bold;">✓</span>' + t + '</div>';
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
    html += '<div style="font-weight:600;font-size:13px;color:#1D4ED8;margin-bottom:4px;">🇱🇺 Luxemburg-spezifisch</div>';
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

  // Quellen — erste 3 sichtbar, Rest in Details
  if (a.quellen && a.quellen.length) {
    var previewQuellen = a.quellen.slice(0, 3);
    html += '<div style="margin-top:14px;font-size:11px;color:#6366F1;font-style:italic;line-height:1.6;">';
    html += '📖 ';
    previewQuellen.forEach(function(q, i) {
      html += '[' + (i + 1) + '] ' + q + (i < previewQuellen.length - 1 ? ' · ' : '');
    });
    html += '</div>';
    if (a.quellen.length > 3) {
      html += '<details style="margin-top:4px;"><summary style="font-size:10px;color:#9CA3AF;cursor:pointer;">alle ' + a.quellen.length + ' Quellen anzeigen</summary>';
      html += '<div style="padding:6px 0;">';
      a.quellen.forEach(function(q, i) {
        html += '<div style="font-size:11px;color:#9CA3AF;padding:2px 0;">[' + (i + 1) + '] ' + q + '</div>';
      });
      html += '</div></details>';
    }
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
  return '<span onclick="openWikiArtikel(\'' + artikelId + '\')" style="cursor:pointer;font-size:11px;color:#2563EB;font-weight:500;display:inline-flex;align-items:center;gap:3px;">📚 ' + a.titel + '</span>';
}

function renderArbeitsblattChipsFromThemenIds(themenIds) {
  if (!themenIds || !themenIds.length || typeof ARBEITSBLÄTTER === 'undefined') return '';
  var seen = {};
  var chips = [];
  themenIds.forEach(function(tid) {
    var abs = ARBEITSBLÄTTER[tid];
    if (abs) abs.forEach(function(ab) {
      if (!seen[ab.datei]) {
        seen[ab.datei] = true;
        chips.push('<a href="arbeitsblatter/' + ab.datei + '" target="_blank" style="cursor:pointer;background:#FFF7ED;border:1px solid #FED7AA;color:#C2410C;padding:3px 8px;border-radius:8px;font-size:10px;display:inline-flex;align-items:center;gap:2px;text-decoration:none;">📝 ' + ab.titel + '</a>');
      }
    });
  });
  return chips.join('');
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
  html += '<div onclick="openWikiArtikel(\'' + artikel.id + '\')" style="cursor:pointer;padding:14px;border-radius:10px;background:' + (artikel.farbe || '#2563EB') + '10;border:1px solid ' + (artikel.farbe || '#2563EB') + '25;transition:transform 0.15s;">';
  html += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">';
  html += '<span style="font-size:28px;">' + (artikel.icon || '📖') + '</span>';
  html += '<div>';
  html += '<div style="font-weight:700;font-size:14px;color:' + (artikel.farbe || '#1D4ED8') + ';">' + artikel.titel + '</div>';
  if (kat) html += '<div style="font-size:11px;color:#6B7280;">' + kat.icon + ' ' + kat.titel + '</div>';
  html += '</div></div>';
  html += '<div style="font-size:12px;color:#374151;line-height:1.5;">' + (artikel.definition || '').substring(0, 180) + '...</div>';
  html += '<div style="margin-top:8px;font-size:11px;color:#2563EB;font-weight:600;">📚 Artikel lesen →</div>';
  html += '</div>';
  html += '<div style="text-align:center;margin-top:10px;"><button class="btn btn-sm" onclick="toggleWikiPanel()" style="font-size:11px;padding:4px 14px;background:#EFF6FF;color:#2563EB;border:1px solid #BFDBFE;border-radius:6px;cursor:pointer;">Alle ' + WIKI_ARTIKEL.length + ' Wiki-Artikel anzeigen</button></div>';
  html += '</div></div>';

  container.insertAdjacentHTML('beforeend', html);
}

// ============================================================
// VERLAUFS-TRACKER — Sitzungsweises Tracking von Dimensionen
// ============================================================
function renderVerlaufTracker() {
  const container = document.getElementById('verlauf-tracker-container');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) return;

  const verlaufDaten = DB.getVerlauf(sid).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  const screenings = DB.getScreenings(sid).filter(s => s.abgeschlossen);
  const latestScr = screenings.length ? screenings.sort((a, b) => new Date(b.datum) - new Date(a.datum))[0] : null;

  // Baseline aus Screening (wenn vorhanden)
  const baselineMap = {};
  if (latestScr && latestScr.scores) {
    const scrDomMap = { depression: 'stimmung', angst: 'energie', soziale_angst: 'beziehungen', schulverweigerung: 'schule', schlaf: 'schlaf' };
    for (const [domId, score] of Object.entries(latestScr.scores)) {
      const vId = scrDomMap[domId];
      if (vId) {
        const dom = typeof SCREENING_DOMAINS !== 'undefined' ? SCREENING_DOMAINS.find(d => d.id === domId) : null;
        const maxScore = dom ? dom.items.length * 3 : 10;
        baselineMap[vId] = Math.round(10 - (score / maxScore) * 10);
      }
    }
  }

  let html = '<div class="section-header" style="margin-bottom:18px;">';
  html += '<h3 style="margin:0;font-size:18px;">📈 Verlaufs-Tracker</h3>';
  html += '<p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Systematische Erfassung der Entwicklung über die Zeit</p>';
  html += '</div>';

  // Eingabe-Formular
  html += '<div class="card" style="margin-bottom:20px;">';
  html += '<div class="card-header"><span>➕</span><div class="card-title">Neue Erfassung</div></div>';
  html += '<div class="card-body">';
  html += '<div class="verlauf-eingabe-grid">';
  // Prüfe ob Trauma-Dimensionen aktiviert werden sollen
  const hatTraumaScreening = latestScr && (latestScr.flaggedAreas || []).includes('trauma');
  const alleVerlaufItems = hatTraumaScreening && typeof VERLAUF_TRAUMA_ITEMS !== 'undefined'
    ? [...VERLAUF_ITEMS, ...VERLAUF_TRAUMA_ITEMS] : VERLAUF_ITEMS;

  alleVerlaufItems.forEach((item, idx) => {
    // Separator vor Trauma-Items
    if (hatTraumaScreening && idx === VERLAUF_ITEMS.length) {
      html += '<div style="grid-column:1/-1;border-top:2px dashed #9C4E77;margin:8px 0;padding-top:8px;"><span style="font-size:11px;font-weight:600;color:#9C4E77;">⚡ Trauma-spezifische Dimensionen (aktiviert durch Screening)</span></div>';
    }
    html += `<div class="verlauf-eingabe-item">
      <div class="verlauf-eingabe-label">${item.icon} ${item.label}</div>
      <div class="verlauf-slider-row">
        <input type="range" min="1" max="10" value="5" id="verlauf-${item.id}" class="verlauf-slider" style="--verlauf-farbe:${item.farbe};" oninput="document.getElementById('verlauf-val-${item.id}').textContent=this.value">
        <span class="verlauf-slider-val" id="verlauf-val-${item.id}">5</span>
      </div>
    </div>`;
  });
  html += '</div>';
  html += '<button class="btn btn-primary btn-sm" onclick="saveVerlaufEintrag()" style="margin-top:12px;">📊 Erfassung speichern</button>';
  html += '</div></div>';

  // Trend-Chart (Sparklines)
  if (verlaufDaten.length > 0) {
    html += '<div class="card" style="margin-bottom:20px;">';
    html += '<div class="card-header"><span>📊</span><div class="card-title">Trend-Übersicht</div><span style="font-size:11px;color:#6B7280;">' + verlaufDaten.length + ' Erfassungen</span></div>';
    html += '<div class="card-body">';

    alleVerlaufItems.forEach(item => {
      const werte = verlaufDaten.map(v => v.werte[item.id] || 0);
      if (werte.every(w => w === 0) && !VERLAUF_ITEMS.includes(item)) return; // Skip leere Trauma-Items
      const baseline = baselineMap[item.id];
      const letzter = werte[werte.length - 1];
      const erster = werte[0];
      const trend = letzter - erster;
      const trendIcon = trend > 0 ? '↑' : trend < 0 ? '↓' : '→';
      const trendColor = trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280';

      html += `<div class="verlauf-trend-row">
        <div class="verlauf-trend-label">${item.icon} ${item.label}</div>
        <div class="verlauf-sparkline" id="sparkline-${item.id}"></div>
        <div class="verlauf-trend-wert" style="color:${trendColor};">${letzter}/10 <span style="font-size:10px;">${trendIcon}${Math.abs(trend)}</span></div>
        ${baseline != null ? `<div class="verlauf-baseline" title="Screening-Baseline">Baseline: ${baseline}/10 (${letzter > baseline ? '+' : ''}${letzter - baseline})</div>` : ''}
      </div>`;
    });
    html += '</div></div>';

    // Historie
    html += '<div class="card">';
    html += '<div class="card-header"><span>📋</span><div class="card-title">Verlauf-Historie</div></div>';
    html += '<div class="card-body">';
    verlaufDaten.slice().reverse().forEach(v => {
      const datum = new Date(v.datum).toLocaleDateString('de-DE');
      html += `<div class="verlauf-historie-item">
        <div class="verlauf-historie-datum">${datum}</div>
        <div class="verlauf-historie-werte">
          ${VERLAUF_ITEMS.map(item => {
            const w = v.werte[item.id] || 0;
            const farbe = w >= 7 ? '#10B981' : w >= 4 ? '#F59E0B' : '#EF4444';
            return `<span class="verlauf-historie-chip" style="background:${farbe}15;color:${farbe};border:1px solid ${farbe}30;">${item.icon} ${w}</span>`;
          }).join('')}
        </div>
        <button class="btn-icon btn-sm" style="font-size:11px;" onclick="deleteVerlaufEintrag('${v.id}')">🗑</button>
      </div>`;
    });
    html += '</div></div>';
  } else {
    html += '<div style="text-align:center;padding:32px;color:#9CA3AF;font-size:13px;">Noch keine Verlaufsdaten erfasst. Nutze das Formular oben für die erste Erfassung.</div>';
  }

  container.innerHTML = html;

  // Sparklines rendern
  if (verlaufDaten.length >= 2) {
    setTimeout(() => {
      VERLAUF_ITEMS.forEach(item => {
        const werte = verlaufDaten.map(v => v.werte[item.id] || 0);
        renderSparkline(`sparkline-${item.id}`, werte, item.farbe);
      });
    }, 50);
  }
}

function renderSparkline(containerId, werte, farbe) {
  const container = document.getElementById(containerId);
  if (!container || werte.length < 2) return;
  const w = 120, h = 30;
  const maxVal = 10, minVal = 1;
  const step = w / (werte.length - 1);
  let path = '';
  werte.forEach((v, i) => {
    const x = i * step;
    const y = h - ((v - minVal) / (maxVal - minVal)) * h;
    path += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
  });
  container.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <path d="${path}" fill="none" stroke="${farbe}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${(werte.length - 1) * step}" cy="${h - ((werte[werte.length - 1] - minVal) / (maxVal - minVal)) * h}" r="3" fill="${farbe}"/>
  </svg>`;
}

function saveVerlaufEintrag() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const werte = {};
  // Standard-Items
  VERLAUF_ITEMS.forEach(item => {
    const el = document.getElementById(`verlauf-${item.id}`);
    werte[item.id] = el ? parseInt(el.value) : 5;
  });
  // Trauma-Items (falls vorhanden)
  if (typeof VERLAUF_TRAUMA_ITEMS !== 'undefined') {
    VERLAUF_TRAUMA_ITEMS.forEach(item => {
      const el = document.getElementById(`verlauf-${item.id}`);
      if (el) werte[item.id] = parseInt(el.value);
    });
  }
  DB.addVerlauf(sid, werte);
  renderVerlaufTracker();
  showToast('Verlauf erfasst', 'success');
}

function deleteVerlaufEintrag(id) {
  DB.deleteVerlauf(id);
  renderVerlaufTracker();
  showToast('Eintrag gelöscht');
}

// Dashboard: Verlaufs-Trend-Widget
function renderVerlaufWidget() {
  const container = document.getElementById('verlauf-trend-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const verlaufDaten = DB.getVerlauf(sid).sort((a, b) => new Date(a.datum) - new Date(b.datum));
  if (verlaufDaten.length < 2) { container.innerHTML = ''; return; }

  const letzter = verlaufDaten[verlaufDaten.length - 1];
  const vorLetzter = verlaufDaten[verlaufDaten.length - 2];

  let verschlechtert = 0;
  VERLAUF_ITEMS.forEach(item => {
    const diff = (letzter.werte[item.id] || 5) - (vorLetzter.werte[item.id] || 5);
    if (diff <= -2) verschlechtert++;
  });

  let html = '<div class="card" style="margin-bottom:12px;">';
  html += '<div class="card-header"><span>📈</span><div class="card-title">Verlaufs-Trend</div></div>';
  html += '<div class="card-body" style="padding:10px 14px;">';
  html += '<div style="display:flex;gap:8px;flex-wrap:wrap;">';
  VERLAUF_ITEMS.forEach(item => {
    const w = letzter.werte[item.id] || 5;
    const prev = vorLetzter.werte[item.id] || 5;
    const diff = w - prev;
    const trendIcon = diff > 0 ? '↑' : diff < 0 ? '↓' : '→';
    const trendColor = diff > 0 ? '#10B981' : diff < 0 ? '#EF4444' : '#6B7280';
    html += `<span style="font-size:11px;padding:3px 8px;border-radius:10px;background:${trendColor}10;color:${trendColor};border:1px solid ${trendColor}25;">${item.icon} ${w}/10 ${trendIcon}</span>`;
  });
  html += '</div>';
  if (verschlechtert >= 2) {
    html += '<div style="margin-top:8px;padding:6px 10px;background:#FEF2F2;border-radius:6px;font-size:11px;color:#991B1B;">⚠️ Verschlechterung in ' + verschlechtert + ' Bereichen — Reflexion empfohlen</div>';
  }
  html += '</div></div>';
  container.innerHTML = html;
}

// ============================================================
// RISIKO-MONITOR — Ampelsystem für Sicherheits-Check
// ============================================================
function renderRisikoCheck() {
  const container = document.getElementById('risiko-check-section');
  if (!container) return;

  const kategorien = [
    { id: 'allgemein', label: 'Allgemeine Sicherheit', icon: '🛡️' },
    { id: 'cssrs', label: 'Suizidalitäts-Screening (C-SSRS angelehnt)', icon: '💭',
      hinweis: 'Columbia Suicide Severity Rating Scale — strukturierte Abklärung in 5 Stufen' },
    { id: 'kindeswohl', label: 'Kindeswohlgefährdung', icon: '⚖️' },
  ];

  let html = '<div class="risiko-check-box">';
  html += '<div class="risiko-check-header">🛡️ Sicherheits-Check <span style="font-size:11px;color:#6B7280;">(strukturiert)</span></div>';

  kategorien.forEach(kat => {
    const items = RISIKO_ITEMS.filter(i => i.kategorie === kat.id);
    if (items.length === 0) return;
    html += `<div style="margin-top:10px;margin-bottom:4px;">
      <div style="font-size:12px;font-weight:700;color:#374151;display:flex;align-items:center;gap:6px;">${kat.icon} ${kat.label}</div>
      ${kat.hinweis ? `<div style="font-size:10px;color:#6B7280;margin-top:2px;font-style:italic;">${kat.hinweis}</div>` : ''}
    </div>`;
    items.forEach(item => {
      html += `<div class="risiko-check-row" title="${item.desc}">
        <div class="risiko-check-label">
          ${item.icon} ${item.label}
          ${item.cssrsLevel ? `<span style="font-size:9px;color:#9CA3AF;margin-left:4px;">Stufe ${item.cssrsLevel}</span>` : ''}
        </div>
        <div class="risiko-ampel-group" id="risiko-ampel-${item.id}">
          ${Object.entries(RISIKO_STUFEN).map(([key, stufe]) =>
            `<button class="risiko-ampel-btn ${key === 'gruen' ? 'active' : ''}" data-item="${item.id}" data-stufe="${key}" onclick="setRisikoAmpel('${item.id}','${key}')" style="--ampel-farbe:${stufe.farbe};" title="${stufe.label}: ${item.desc}">${stufe.icon}</button>`
          ).join('')}
        </div>
      </div>`;
    });
  });

  // Entscheidungsregeln-Ergebnis (wird dynamisch aktualisiert)
  html += '<div id="risiko-entscheidung-result" style="margin-top:10px;"></div>';
  html += '</div>';
  container.innerHTML = html;
}

function setRisikoAmpel(itemId, stufe) {
  const group = document.getElementById(`risiko-ampel-${itemId}`);
  if (!group) return;

  // Bestätigung bei Rot-Wechsel für kritische Items
  const item = RISIKO_ITEMS.find(i => i.id === itemId);
  if (stufe === 'rot' && item && (item.kategorie === 'cssrs' || item.kategorie === 'kindeswohl')) {
    showConfirm(
      `⚠️ "${item.label}" wird auf ROT gesetzt.\n\nBitte dokumentieren Sie die Beobachtungen und ergriffenen Maßnahmen.\n\nFortfahren?`,
      () => {
        applyRisikoAmpel(group, stufe);
        updateRisikoEntscheidung();
      }
    );
    return;
  }

  applyRisikoAmpel(group, stufe);
  updateRisikoEntscheidung();
}

function applyRisikoAmpel(group, stufe) {
  group.querySelectorAll('.risiko-ampel-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.stufe === stufe);
  });
}

function updateRisikoEntscheidung() {
  const result = document.getElementById('risiko-entscheidung-result');
  if (!result) return;
  if (typeof RISIKO_ENTSCHEIDUNGSREGELN === 'undefined') { result.innerHTML = ''; return; }

  const werte = getRisikoFromForm();
  let html = '';
  RISIKO_ENTSCHEIDUNGSREGELN.forEach(regel => {
    if (regel.bedingung(werte)) {
      html += `<div style="margin-top:8px;padding:10px 14px;background:${regel.farbe}08;border:2px solid ${regel.farbe};border-radius:8px;">
        <div style="font-size:13px;font-weight:700;color:${regel.farbe};display:flex;align-items:center;gap:6px;">${regel.icon} ${regel.label}</div>
        <div style="font-size:11px;color:#374151;margin-top:6px;line-height:1.5;">${regel.aktion}</div>
        ${regel.stufe === 'akut' ? '<div style="margin-top:8px;padding:6px;background:#FEF2F2;border-radius:4px;font-size:11px;color:#7F1D1D;font-weight:600;">🚑 Jugendlichen NICHT allein lassen! Sofort handeln!</div>' : ''}
      </div>`;
    }
  });
  result.innerHTML = html;

  // C-SSRS Schweregrad-Panel anzeigen wenn C-SSRS-Items nicht alle grün
  const cssrsPanel = document.getElementById('soap-cssrs-schweregrad');
  if (cssrsPanel) {
    const cssrsItems = RISIKO_ITEMS.filter(i => i.kategorie === 'cssrs');
    const hatCSSRSAuffaellig = cssrsItems.some(i => werte[i.id] && werte[i.id] !== 'gruen');
    cssrsPanel.style.display = hatCSSRSAuffaellig ? '' : 'none';
  }
}

// C-SSRS Schweregrad Radiobutton-Handler: Bei Stufe 3+ Sicherheitsplan-Pflicht anzeigen
document.addEventListener('change', function(e) {
  if (e.target.name === 'cssrs-schweregrad') {
    const stufe = parseInt(e.target.value);
    const pflichtBox = document.getElementById('soap-sicherheitsplan-pflicht');
    if (pflichtBox) pflichtBox.style.display = stufe >= 3 ? '' : 'none';
  }
});

function getRisikoFromForm() {
  const werte = {};
  RISIKO_ITEMS.forEach(item => {
    const group = document.getElementById(`risiko-ampel-${item.id}`);
    if (group) {
      const active = group.querySelector('.risiko-ampel-btn.active');
      werte[item.id] = active ? active.dataset.stufe : 'gruen';
    }
  });
  return werte;
}

function saveRisikoFromProtokoll() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const werte = getRisikoFromForm();
  const hatRisiko = Object.values(werte).some(v => v !== 'gruen');
  if (hatRisiko) {
    // Audit-Log: Zeitstempel + Werte + Begruendung
    const auditEntry = {
      datum: new Date().toISOString(),
      werte: { ...werte },
      hatRotCSSRS: RISIKO_ITEMS.filter(i => i.kategorie === 'cssrs').some(i => werte[i.id] === 'rot'),
      hatKindeswohl: RISIKO_ITEMS.filter(i => i.kategorie === 'kindeswohl').some(i => werte[i.id] !== 'gruen'),
    };
    DB.addRisiko(sid, werte, auditEntry);
  }
}

// Dashboard: Risiko-Ampel-Widget
function renderRisikoWidget() {
  const container = document.getElementById('risiko-ampel-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const risikoDaten = DB.getRisiko(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  if (risikoDaten.length === 0) { container.innerHTML = ''; return; }

  const letzter = risikoDaten[0];
  const maxStufe = Object.values(letzter.werte).includes('rot') ? 'rot' : Object.values(letzter.werte).includes('gelb') ? 'gelb' : 'gruen';
  const stufeInfo = RISIKO_STUFEN[maxStufe];

  // Entscheidungsregeln auswerten
  let entscheidungHtml = '';
  if (typeof RISIKO_ENTSCHEIDUNGSREGELN !== 'undefined') {
    RISIKO_ENTSCHEIDUNGSREGELN.forEach(regel => {
      if (regel.bedingung(letzter.werte)) {
        entscheidungHtml += `<div style="margin-top:8px;padding:8px 12px;background:${regel.farbe}08;border:2px solid ${regel.farbe};border-radius:6px;">
          <div style="font-size:12px;font-weight:700;color:${regel.farbe};">${regel.icon} ${regel.label}</div>
          <div style="font-size:11px;color:#374151;margin-top:4px;">${regel.aktion}</div>
        </div>`;
      }
    });
  }

  // Nur nicht-grüne Items anzeigen
  const auffaelligeItems = RISIKO_ITEMS.filter(i => (letzter.werte[i.id] || 'gruen') !== 'gruen');

  let html = '';
  if (maxStufe !== 'gruen') {
    html = `<div class="card risiko-widget risiko-widget-${maxStufe}" style="margin-bottom:12px;border-left:4px solid ${stufeInfo.farbe};">
      <div class="card-body" style="padding:12px 14px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
          <span style="font-size:20px;">${stufeInfo.icon}</span>
          <strong style="color:${stufeInfo.farbe};">Risiko-Status: ${stufeInfo.label}</strong>
          <span style="font-size:10px;color:#6B7280;margin-left:auto;">${new Date(letzter.datum).toLocaleDateString('de-DE')}</span>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          ${auffaelligeItems.map(item => {
            const w = letzter.werte[item.id] || 'gruen';
            const s = RISIKO_STUFEN[w];
            return `<span style="font-size:11px;padding:2px 8px;border-radius:10px;background:${s.farbe}15;color:${s.farbe};border:1px solid ${s.farbe}30;">${item.icon} ${item.label}: ${s.icon} ${s.label}</span>`;
          }).join('')}
        </div>
        ${entscheidungHtml}
        ${maxStufe === 'rot' && !entscheidungHtml ? '<div style="margin-top:8px;padding:6px 10px;background:#FEF2F2;border-radius:6px;font-size:12px;color:#991B1B;font-weight:600;">⚠️ Krisenplan aktivieren — Fachperson informieren! <button class="btn btn-xs" style="background:#EF4444;color:#fff;border:none;margin-left:8px;" onclick="showPhase(\'leitfaden\');setTimeout(()=>showSubTab(\'themen\'),100);setTimeout(()=>quickStartSession(\'krisenintervention\'),300);">Krisenintervention starten</button></div>' : ''}
        ${maxStufe === 'gelb' && !entscheidungHtml ? '<div style="margin-top:8px;padding:6px 10px;background:#FFFBEB;border-radius:6px;font-size:12px;color:#92400E;">👁 Situation beobachten und in nächster Sitzung thematisieren</div>' : ''}
      </div>
    </div>`;
  }
  container.innerHTML = html;
}

// Risiko-Timeline in Verlauf
function renderRisikoTimeline() {
  const container = document.getElementById('risiko-timeline-container');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const risikoDaten = DB.getRisiko(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  if (risikoDaten.length === 0) { container.innerHTML = ''; return; }

  let html = '<div class="card" style="margin-top:16px;">';
  html += '<div class="card-header"><span>🛡️</span><div class="card-title">Risiko-Verlauf</div></div>';
  html += '<div class="card-body">';
  // Chart canvas for risk timeline visualization
  html += '<div class="risiko-chart-container"><canvas id="risiko-chart"></canvas></div>';
  risikoDaten.forEach(r => {
    const datum = new Date(r.datum).toLocaleDateString('de-DE');
    const maxStufe = Object.values(r.werte).includes('rot') ? 'rot' : Object.values(r.werte).includes('gelb') ? 'gelb' : 'gruen';
    html += `<div class="risiko-timeline-item" style="border-left:3px solid ${RISIKO_STUFEN[maxStufe].farbe};padding:6px 12px;margin-bottom:6px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="font-size:10px;color:#6B7280;min-width:70px;">${datum}</span>
        ${RISIKO_ITEMS.map(item => {
          const s = RISIKO_STUFEN[r.werte[item.id] || 'gruen'];
          return `<span style="font-size:10px;">${s.icon}</span>`;
        }).join('')}
      </div>
    </div>`;
  });
  html += '</div></div>';
  container.innerHTML = html;
  // Render the chart after innerHTML is set
  renderRisikoChart(sid);
}

// ============================================================
// KONTAKTLOG — Bezugspersonen-Kontakte tracken
// ============================================================
const KONTAKT_ARTEN = {
  telefon: { icon: '📞', label: 'Telefon' },
  email: { icon: '📧', label: 'E-Mail' },
  'vor-ort': { icon: '🏠', label: 'Vor-Ort-Gespräch' },
  meeting: { icon: '🤝', label: 'Meeting/Besprechung' },
};

function renderKontaktlog() {
  const container = document.getElementById('kontaktlog-container');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) return;

  const kontakte = DB.getKontakte(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const geno = getGenogramm();

  // Engagement-Score berechnen
  const engagement = calculateEngagementScore(sid);
  const engFarben = { gruen: '#10B981', gelb: '#F59E0B', rot: '#EF4444' };
  const engBg = { gruen: '#ECFDF5', gelb: '#FFFBEB', rot: '#FEF2F2' };

  let html = '<div class="section-header" style="margin-bottom:18px;">';
  html += '<h3 style="margin:0;font-size:18px;">📞 Kontaktlog — Bezugspersonen</h3>';
  html += '<p style="margin:4px 0 0;font-size:12px;color:#6B7280;">Dokumentation aller Kontakte mit Eltern, Lehrpersonen und Bezugspersonen</p>';
  html += '</div>';

  // Engagement-Score Anzeige
  html += `<div class="card" style="margin-bottom:14px;border-left:4px solid ${engFarben[engagement.stufe]};background:${engBg[engagement.stufe]};">`;
  html += '<div class="card-body" style="padding:10px 14px;">';
  html += `<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">`;
  html += `<div style="font-weight:700;font-size:13px;color:${engFarben[engagement.stufe]};">`;
  html += engagement.stufe === 'gruen' ? '🟢' : engagement.stufe === 'gelb' ? '🟡' : '🔴';
  html += ` Engagement: ${engagement.label}</div>`;
  html += `<div style="font-size:11px;color:#6B7280;">${engagement.score}/100 Punkte</div>`;
  html += '</div>';
  engagement.details.forEach(d => {
    html += `<div style="font-size:11px;color:#374151;padding:1px 0;">• ${escapeHtml(d)}</div>`;
  });
  html += '</div></div>';

  // Nachfass-Erinnerungen
  const heute = new Date().toISOString().split('T')[0];
  const faellig = kontakte.filter(k => k.nachfassDatum && k.nachfassDatum <= heute);
  if (faellig.length > 0) {
    html += '<div class="card" style="margin-bottom:14px;border-left:4px solid #F59E0B;">';
    html += '<div class="card-body" style="padding:10px 14px;">';
    html += '<div style="font-weight:600;font-size:12px;color:#92400E;margin-bottom:6px;">⏰ Fällige Nachfass-Aktionen</div>';
    faellig.forEach(k => {
      html += `<div style="font-size:12px;padding:3px 0;">• <strong>${escapeHtml(k.kontaktperson)}</strong>: ${escapeHtml(k.vereinbarungen)} <span style="color:#9CA3AF;">(${formatDatum(k.nachfassDatum)})</span></div>`;
    });
    html += '</div></div>';
  }

  // Eingabe-Formular
  html += '<div class="card" style="margin-bottom:20px;">';
  html += '<div class="card-header"><span>➕</span><div class="card-title">Neuer Kontakt</div></div>';
  html += '<div class="card-body">';
  html += '<div class="form-grid">';
  html += `<div class="form-group"><label>Kontaktperson</label>
    <select id="kontakt-person">
      <option value="">— Auswählen —</option>
      ${geno.map(p => `<option value="${escapeHtml(p.name)}">${escapeHtml(p.name)} (${GENO_ROLLEN_LABELS[p.rolle] ? GENO_ROLLEN_LABELS[p.rolle].replace(/^[^ ]+ /, '') : p.rolle})</option>`).join('')}
      <option value="__custom__">✏️ Andere Person...</option>
    </select>
  </div>`;
  html += `<div class="form-group" id="kontakt-custom-name-wrap" style="display:none;"><label>Name</label><input type="text" id="kontakt-custom-name" placeholder="Name der Person"></div>`;
  html += `<div class="form-group"><label>Art</label>
    <select id="kontakt-art">
      ${Object.entries(KONTAKT_ARTEN).map(([k, v]) => `<option value="${k}">${v.icon} ${v.label}</option>`).join('')}
    </select>
  </div>`;
  html += `<div class="form-group"><label>Datum</label><input type="date" id="kontakt-datum" value="${heute}"></div>`;
  html += `<div class="form-group"><label>Dauer</label><input type="text" id="kontakt-dauer" placeholder="z.B. 15 Min."></div>`;
  html += `<div class="form-group full"><label>Inhalt</label><textarea id="kontakt-inhalt" rows="2" placeholder="Was wurde besprochen?"></textarea></div>`;
  html += `<div class="form-group full"><label>Vereinbarungen</label><input type="text" id="kontakt-vereinbarungen" placeholder="Was wurde vereinbart?"></div>`;
  html += `<div class="form-group"><label>Nachfass-Datum</label><input type="date" id="kontakt-nachfass"></div>`;
  html += '</div>';
  html += '<button class="btn btn-primary btn-sm" onclick="addKontaktEintrag()" style="margin-top:8px;">📞 Kontakt speichern</button>';
  html += '</div></div>';

  // Liste
  if (kontakte.length > 0) {
    html += '<div class="card">';
    html += '<div class="card-header"><span>📋</span><div class="card-title">Kontakt-Verlauf</div><span style="font-size:11px;color:#6B7280;">' + kontakte.length + ' Kontakte</span></div>';
    html += '<div class="card-body">';
    kontakte.forEach(k => {
      const art = KONTAKT_ARTEN[k.art] || KONTAKT_ARTEN.telefon;
      html += `<div class="kontakt-item">
        <div class="kontakt-item-header">
          <span class="kontakt-art-badge">${art.icon}</span>
          <strong>${escapeHtml(k.kontaktperson)}</strong>
          <span style="font-size:11px;color:#6B7280;">${formatDatum(k.datum)}${k.dauer ? ' · ' + escapeHtml(k.dauer) : ''}</span>
          <button class="btn-icon btn-sm" style="font-size:11px;margin-left:auto;" onclick="deleteKontaktEintrag('${k.id}')">🗑</button>
        </div>
        <div class="kontakt-item-body">
          <div style="font-size:12px;color:#374151;">${escapeHtml(k.inhalt)}</div>
          ${k.vereinbarungen ? `<div style="font-size:11px;color:#1D4ED8;margin-top:4px;">📝 ${escapeHtml(k.vereinbarungen)}</div>` : ''}
          ${k.nachfassDatum ? `<div style="font-size:10px;color:#92400E;margin-top:2px;">⏰ Nachfassen: ${formatDatum(k.nachfassDatum)}</div>` : ''}
        </div>
      </div>`;
    });
    html += '</div></div>';
  }

  container.innerHTML = html;

  // Toggle für custom name
  const personSelect = document.getElementById('kontakt-person');
  if (personSelect) {
    personSelect.addEventListener('change', function() {
      const wrap = document.getElementById('kontakt-custom-name-wrap');
      if (wrap) wrap.style.display = this.value === '__custom__' ? '' : 'none';
    });
  }
}

function addKontaktEintrag() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  let person = document.getElementById('kontakt-person')?.value || '';
  if (person === '__custom__') person = document.getElementById('kontakt-custom-name')?.value?.trim() || '';
  if (!person) { showToast('Bitte Kontaktperson auswählen', 'error'); return; }
  const inhalt = document.getElementById('kontakt-inhalt')?.value?.trim() || '';
  if (!inhalt) { showToast('Bitte Inhalt eingeben', 'error'); return; }

  DB.addKontakt({
    schuelerId: sid,
    kontaktperson: person,
    art: document.getElementById('kontakt-art')?.value || 'telefon',
    datum: document.getElementById('kontakt-datum')?.value || new Date().toISOString().split('T')[0],
    dauer: document.getElementById('kontakt-dauer')?.value?.trim() || '',
    inhalt,
    vereinbarungen: document.getElementById('kontakt-vereinbarungen')?.value?.trim() || '',
    nachfassDatum: document.getElementById('kontakt-nachfass')?.value || '',
  });
  renderKontaktlog();
  showToast('Kontakt gespeichert', 'success');
}

function deleteKontaktEintrag(id) {
  DB.deleteKontakt(id);
  renderKontaktlog();
  showToast('Kontakt gelöscht');
}

// Engagement-Score Berechnung
function calculateEngagementScore(schuelerId) {
  const sid = schuelerId || APP.currentSchuelerId;
  const kontakte = DB.getKontakte(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const termine = DB.getTermine().filter(t => t.schuelerId === sid);
  const protokolle = DB.getProtokolle(sid);

  const heute = new Date();
  const result = { score: 0, stufe: 'gruen', label: 'Regelmässig', details: [] };

  if (kontakte.length === 0 && termine.length === 0) {
    result.score = 0; result.stufe = 'rot'; result.label = 'Kein Kontakt';
    result.details.push('Keine Kontakte dokumentiert');
    return result;
  }

  let punkte = 0;
  const maxPunkte = 100;

  // 1. Kontaktfrequenz (max 40 Punkte)
  if (kontakte.length > 0) {
    const letzterKontakt = new Date(kontakte[0].datum);
    const tageSeither = Math.floor((heute - letzterKontakt) / (1000 * 60 * 60 * 24));
    if (tageSeither <= 7) { punkte += 40; result.details.push('Letzter Kontakt: vor ' + tageSeither + ' Tagen'); }
    else if (tageSeither <= 14) { punkte += 30; result.details.push('Letzter Kontakt: vor ' + tageSeither + ' Tagen'); }
    else if (tageSeither <= 21) { punkte += 15; result.details.push('Letzter Kontakt: vor ' + tageSeither + ' Tagen — lückenhaft'); }
    else { punkte += 0; result.details.push('Kein Kontakt seit ' + tageSeither + ' Tagen — kritisch'); }

    // Kontakte in letzten 30 Tagen
    const vor30 = new Date(heute); vor30.setDate(vor30.getDate() - 30);
    const kontakte30 = kontakte.filter(k => new Date(k.datum) >= vor30).length;
    if (kontakte30 >= 4) punkte += 10;
    else if (kontakte30 >= 2) punkte += 5;
  }

  // 2. Vereinbarungs-Einhaltung (max 30 Punkte)
  const mitVereinbarung = kontakte.filter(k => k.vereinbarungen && k.vereinbarungen.trim());
  const mitNachfass = kontakte.filter(k => k.nachfassDatum);
  const erledigteNachfass = mitNachfass.filter(k => {
    // Prüfe ob ein Folgekontakt nach dem Nachfass-Datum existiert
    return kontakte.some(f => f.id !== k.id && new Date(f.datum) >= new Date(k.nachfassDatum) && f.kontaktperson === k.kontaktperson);
  });
  if (mitNachfass.length > 0) {
    const quote = erledigteNachfass.length / mitNachfass.length;
    punkte += Math.round(quote * 30);
    result.details.push('Nachfass-Quote: ' + Math.round(quote * 100) + '% (' + erledigteNachfass.length + '/' + mitNachfass.length + ')');
  } else if (mitVereinbarung.length > 0) {
    punkte += 15; // Vereinbarungen dokumentiert, aber kein Nachfass-Tracking
  } else {
    punkte += 10; // Basispunkte für vorhandene Kontakte
  }

  // 3. Terminwahrnehmung (max 20 Punkte)
  if (protokolle.length > 0) {
    const vor60 = new Date(heute); vor60.setDate(vor60.getDate() - 60);
    const recentSessions = protokolle.filter(p => new Date(p.datum) >= vor60).length;
    if (recentSessions >= 4) { punkte += 20; result.details.push(recentSessions + ' Sitzungen in 60 Tagen'); }
    else if (recentSessions >= 2) { punkte += 12; result.details.push(recentSessions + ' Sitzungen in 60 Tagen'); }
    else if (recentSessions >= 1) { punkte += 6; result.details.push(recentSessions + ' Sitzung in 60 Tagen — wenig'); }
    else { result.details.push('Keine Sitzung in 60 Tagen'); }
  }

  result.score = Math.min(punkte, maxPunkte);

  // Stufe bestimmen
  if (result.score >= 60) { result.stufe = 'gruen'; result.label = 'Regelmässig'; }
  else if (result.score >= 30) { result.stufe = 'gelb'; result.label = 'Lückenhaft'; }
  else { result.stufe = 'rot'; result.label = 'Kritisch'; }

  // Spezialfall: Risiko-Schüler ohne Kontakt seit >3 Wochen
  if (kontakte.length > 0) {
    const tageSeither = Math.floor((heute - new Date(kontakte[0].datum)) / (1000 * 60 * 60 * 24));
    if (tageSeither > 21) {
      const risiko = DB.getRisiko(sid);
      const hatRotRisiko = risiko.some(r => r.wert === 'rot');
      if (hatRotRisiko) {
        result.stufe = 'rot';
        result.label = 'Kritisch — Risiko-Schüler';
        result.details.push('WARNUNG: Risiko-Schüler ohne Kontakt seit >3 Wochen');
      }
    }
  }

  return result;
}

// Dashboard: Kontakt-Nachfass-Widget (mit Engagement-Badge)
function renderKontaktNachfassWidget() {
  const container = document.getElementById('kontakt-nachfass-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  const heute = new Date().toISOString().split('T')[0];
  const kontakte = DB.getKontakte(sid).filter(k => k.nachfassDatum && k.nachfassDatum <= heute);

  // Engagement-Badge immer anzeigen
  const engagement = calculateEngagementScore(sid);
  const engFarben = { gruen: '#10B981', gelb: '#F59E0B', rot: '#EF4444' };
  const engIcons = { gruen: '🟢', gelb: '🟡', rot: '🔴' };

  let html = `<div class="card" style="margin-bottom:12px;border-left:4px solid ${engFarben[engagement.stufe]};">`;
  html += '<div class="card-body" style="padding:10px 14px;">';
  html += `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:${kontakte.length > 0 ? '8' : '0'}px;">`;
  html += `<div style="font-weight:600;font-size:12px;color:${engFarben[engagement.stufe]};">${engIcons[engagement.stufe]} Engagement: ${engagement.label} (${engagement.score}/100)</div>`;
  html += `<button class="btn btn-xs btn-secondary" onclick="showPhase('fallakte');setTimeout(()=>showSubTab('kontaktlog'),100);">Kontaktlog</button>`;
  html += '</div>';

  if (kontakte.length > 0) {
    html += '<div style="font-weight:600;font-size:11px;color:#92400E;margin-bottom:4px;">⏰ Offene Nachfass-Aktionen:</div>';
    kontakte.forEach(k => {
      const art = KONTAKT_ARTEN[k.art] || KONTAKT_ARTEN.telefon;
      html += `<div style="font-size:11px;padding:2px 0;">${art.icon} <strong>${escapeHtml(k.kontaktperson)}</strong>: ${escapeHtml(k.vereinbarungen || k.inhalt).substring(0, 50)}</div>`;
    });
  }
  html += '</div></div>';
  container.innerHTML = html;
}

// ============================================================
// GENOGRAMM → 5P VERBINDUNG — Familien-Risikofaktoren vorschlagen
// ============================================================
function getGenogramm5PSuggestions() {
  const geno = getGenogramm();
  if (!geno || geno.length === 0) return {};

  const suggestions = { predisposing: [], precipitating: [], perpetuating: [], protective: [] };

  // Beziehungsqualität → Faktoren
  const konflikte = geno.filter(p => p.beziehung === 'konflikt');
  const abbrueche = geno.filter(p => p.beziehung === 'abbruch');
  const enge = geno.filter(p => p.beziehung === 'eng');
  const distanziert = geno.filter(p => p.beziehung === 'distanziert');

  // Familiäre Risikofaktoren → Predisposing
  if (konflikte.length > 0) {
    suggestions.predisposing.push({
      key: 'geno_konflikt',
      text: 'Familiäre Konflikte (' + konflikte.map(p => p.name).join(', ') + ')',
    });
  }
  if (abbrueche.length > 0) {
    suggestions.predisposing.push({
      key: 'geno_abbruch',
      text: 'Beziehungsabbruch (' + abbrueche.map(p => p.name).join(', ') + ')',
    });
  }

  // Eltern nicht vorhanden → Predisposing
  const hatMutter = geno.some(p => ['mutter', 'stiefmutter', 'pflegemutter'].includes(p.rolle));
  const hatVater = geno.some(p => ['vater', 'stiefvater', 'pflegevater'].includes(p.rolle));
  const hatPflegeeltern = geno.some(p => ['pflegemutter', 'pflegevater'].includes(p.rolle));
  if (hatPflegeeltern) {
    suggestions.predisposing.push({ key: 'geno_pflege', text: 'Fremdplatzierung (Pflegefamilie)' });
  }

  // Distanzierte Beziehungen → Perpetuating
  if (distanziert.length > 0) {
    suggestions.perpetuating.push({
      key: 'geno_distanz',
      text: 'Distanzierte Familienbeziehungen (' + distanziert.map(p => p.name).join(', ') + ')',
    });
  }

  // Enge Beziehungen → Protective
  if (enge.length > 0) {
    suggestions.protective.push({
      key: 'geno_enge',
      text: 'Enge Bezugspersonen (' + enge.map(p => p.name).join(', ') + ')',
    });
  }

  // Notizen mit Schlüsselwörtern → Risikofaktoren
  geno.forEach(p => {
    if (!p.notiz) return;
    const lower = p.notiz.toLowerCase();
    if (lower.includes('psychisch') || lower.includes('depression') || lower.includes('sucht') || lower.includes('alkohol')) {
      suggestions.predisposing.push({
        key: 'geno_psych_' + p.id,
        text: 'Psych. Belastung bei ' + p.name + ' (' + p.notiz + ')',
      });
    }
    if (lower.includes('gewalt') || lower.includes('missbrauch') || lower.includes('vernach')) {
      suggestions.precipitating.push({
        key: 'geno_gewalt_' + p.id,
        text: 'Belastungserfahrung: ' + p.name + ' (' + p.notiz + ')',
      });
    }
  });

  return suggestions;
}

// ============================================================
// MEILENSTEIN-ZIELE + ROADMAP-VERKNÜPFUNG
// ============================================================
function renderZieleMeilensteine() {
  // This extends the existing renderZiele with milestone UI
  const s = DB.getSchuelerById(APP.currentSchuelerId);
  if (!s) return;
  const ziele = s.ziele || [];
  const roadmap = DB.getRoadmap(APP.currentSchuelerId);

  // For each goal, show linked roadmap theme and milestones
  ziele.forEach((z, i) => {
    if (!z.meilensteine) z.meilensteine = [];
    if (!z.roadmapThema) z.roadmapThema = null;
  });
}

// ============================================================
// KALENDER ↔ SITZUNGEN VERBINDUNG
// ============================================================
function getSessionDatesForKalender() {
  const notizen = DB.getNotizen();
  const sessions = {};
  notizen.forEach(n => {
    if (n.kategorie === 'session' && n.datum) {
      if (!sessions[n.datum]) sessions[n.datum] = [];
      const schueler = n.schuelerId ? DB.getSchuelerById(n.schuelerId) : null;
      sessions[n.datum].push({
        id: n.id,
        schuelerId: n.schuelerId,
        schuelerName: schueler ? `${schueler.vorname} ${schueler.nachname}` : '',
        themaId: n.themaId || null,
      });
    }
  });
  return sessions;
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
    } catch(e) { console.warn('Pathways:', e); }

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

// ============================================================
// CSV EXPORT
// ============================================================
function exportCSV() {
  showLoading('CSV exportieren...');
  const schueler = DB.getSchueler();
  if (!schueler.length) {
    hideLoading();
    showToast('Keine Klienten zum Exportieren', 'error');
    return;
  }

  const headers = ['ID', 'Vorname', 'Nachname', 'Geburtsdatum', 'Klasse', 'Eintrittsdatum', 'Risiko', 'Erstellt', 'Geändert'];
  const rows = schueler.map(s => [
    s.id,
    s.vorname || '',
    s.nachname || '',
    s.geburtsdatum || '',
    s.klasse || '',
    s.eintrittsdatum || '',
    s.risiko || '',
    s.erstellt || '',
    s.geaendert || '',
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(';'))
  ].join('\n');

  const BOM = '\uFEFF'; // UTF-8 BOM for Excel compatibility
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pathways-klienten-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  hideLoading();
  showToast('CSV exportiert', 'success');
}

function exportNotizenCSV(schuelerId) {
  const notizen = DB.getNotizen(schuelerId);
  if (!notizen.length) {
    showToast('Keine Notizen zum Exportieren', 'error');
    return;
  }

  const schueler = DB.getSchuelerById(schuelerId);
  const name = schueler ? (schueler.vorname + ' ' + schueler.nachname).trim() : 'Unbekannt';

  const headers = ['Datum', 'Kategorie', 'Thema', 'Inhalt', 'SOAP-S', 'SOAP-O', 'SOAP-A', 'SOAP-P'];
  const rows = notizen.map(n => [
    n.datum || '',
    n.kategorie || '',
    n.themaId || '',
    (n.inhalt || '').replace(/\n/g, ' '),
    n.soap ? (n.soap.s || '') : '',
    n.soap ? (n.soap.o || '') : '',
    n.soap ? (n.soap.a || '') : '',
    n.soap ? (n.soap.p || '') : '',
  ]);

  const csvContent = [
    headers.join(';'),
    ...rows.map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(';'))
  ].join('\n');

  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pathways-notizen-' + name.replace(/\s+/g, '-') + '-' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('Notizen als CSV exportiert', 'success');
}

// ============================================================
// AUDIT LOG
// ============================================================
const AuditLog = {
  KEY: 'pathways_audit_log',
  MAX_ENTRIES: 500,

  log(action, details) {
    try {
      const entries = JSON.parse(localStorage.getItem(this.KEY) || '[]');
      entries.push({
        timestamp: new Date().toISOString(),
        action,
        details: details || '',
      });
      // Keep only last MAX_ENTRIES
      if (entries.length > this.MAX_ENTRIES) {
        entries.splice(0, entries.length - this.MAX_ENTRIES);
      }
      localStorage.setItem(this.KEY, JSON.stringify(entries));
    } catch (e) {
      console.warn('Audit log write failed:', e);
    }
  },

  getEntries(limit) {
    try {
      const entries = JSON.parse(localStorage.getItem(this.KEY) || '[]');
      return limit ? entries.slice(-limit) : entries;
    } catch { return []; }
  },

  clear() {
    localStorage.removeItem(this.KEY);
  },
};

// ============================================================
// ACCESSIBILITY HELPERS
// ============================================================
function announceToScreenReader(message) {
  const el = document.getElementById('toast-container');
  if (el) {
    el.setAttribute('aria-label', message);
  }
}

function trapFocus(element) {
  const focusableEls = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  const firstEl = focusableEls[0];
  const lastEl = focusableEls[focusableEls.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
    } else {
      if (document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
    }
  });

  if (firstEl) firstEl.focus();
}

// ============================================================
// DATA RETENTION / GDPR
// ============================================================
function exportPersonalData(schuelerId) {
  showLoading('Daten exportieren...');
  const schueler = DB.getSchuelerById(schuelerId);
  if (!schueler) { hideLoading(); showToast('Klient nicht gefunden', 'error'); return; }

  const daten = {
    _exportInfo: {
      exportiert: new Date().toISOString(),
      zweck: 'Datenauskunft gemäss Art. 15 DSGVO',
    },
    stammdaten: schueler,
    notizen: DB.getNotizen(schuelerId),
    termine: DB.getTermine(schuelerId),
    screenings: DB.getScreenings(schuelerId),
    wohlbefinden: DB.getWohlbefinden(schuelerId),
    verlauf: DB.getVerlauf(schuelerId),
    kontakte: DB.getKontakte(schuelerId),
    risiko: DB.getRisiko(schuelerId),
  };

  const json = JSON.stringify(daten, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const name = ((schueler.vorname || '') + '-' + (schueler.nachname || '')).replace(/\s+/g, '-') || 'klient';
  a.download = 'dsgvo-auskunft-' + name + '-' + new Date().toISOString().split('T')[0] + '.json';
  a.click();
  URL.revokeObjectURL(url);
  AuditLog.log('dsgvo-export', 'Datenauskunft für ' + (schueler.vorname || '') + ' ' + (schueler.nachname || ''));
  hideLoading();
  showToast('Personenbezogene Daten exportiert (DSGVO)', 'success');
}

function deletePersonalData(schuelerId) {
  const schueler = DB.getSchuelerById(schuelerId);
  if (!schueler) return;
  const name = (schueler.vorname || '') + ' ' + (schueler.nachname || '');
  showConfirm(
    'Alle Daten von <strong>' + escapeHtml(name) + '</strong> unwiderruflich löschen?<br><br>' +
    'Dies umfasst: Profil, Notizen, Termine, Screenings, Wohlbefinden-Daten, Verlauf, Kontakte und Risikobewertungen.<br><br>' +
    '<strong>Diese Aktion kann nicht rückgängig gemacht werden.</strong>',
    () => {
      // Delete all associated data
      const notizenAlle = JSON.parse(localStorage.getItem('cdse_notizen') || '[]').filter(n => n.schuelerId !== schuelerId);
      localStorage.setItem('cdse_notizen', JSON.stringify(notizenAlle));
      const termineAlle = JSON.parse(localStorage.getItem('cdse_termine') || '[]').filter(t => t.schuelerId !== schuelerId);
      localStorage.setItem('cdse_termine', JSON.stringify(termineAlle));
      const screeningsAlle = JSON.parse(localStorage.getItem('cdse_screenings') || '[]').filter(s => s.schuelerId !== schuelerId);
      localStorage.setItem('cdse_screenings', JSON.stringify(screeningsAlle));
      const roadmapsAlle = JSON.parse(localStorage.getItem('cdse_roadmaps') || '[]').filter(r => r.schuelerId !== schuelerId);
      localStorage.setItem('cdse_roadmaps', JSON.stringify(roadmapsAlle));
      const wbAlle = JSON.parse(localStorage.getItem('cdse_wohlbefinden') || '[]').filter(w => w.schuelerId !== schuelerId);
      localStorage.setItem('cdse_wohlbefinden', JSON.stringify(wbAlle));
      const ffAlle = JSON.parse(localStorage.getItem('cdse_fallformulierungen') || '[]').filter(f => f.schuelerId !== schuelerId);
      localStorage.setItem('cdse_fallformulierungen', JSON.stringify(ffAlle));
      const vlAlle = JSON.parse(localStorage.getItem('cdse_verlauf') || '[]').filter(v => v.schuelerId !== schuelerId);
      localStorage.setItem('cdse_verlauf', JSON.stringify(vlAlle));
      const ktAlle = JSON.parse(localStorage.getItem('cdse_kontakte') || '[]').filter(k => k.schuelerId !== schuelerId);
      localStorage.setItem('cdse_kontakte', JSON.stringify(ktAlle));
      const rsAlle = JSON.parse(localStorage.getItem('cdse_risiko') || '[]').filter(r => r.schuelerId !== schuelerId);
      localStorage.setItem('cdse_risiko', JSON.stringify(rsAlle));

      DB.deleteSchueler(schuelerId);
      AuditLog.log('dsgvo-loeschung', 'Vollständige Datenlöschung für ' + name);
      showToast('Alle Daten gelöscht (Recht auf Löschung)', 'success');
      showView('home');
    }
  );
}

// ============================================================
// FEATURE 2: FOLLOW-UP ERINNERUNGEN (Dashboard)
// ============================================================
function renderFollowUpReminders() {
  const container = document.getElementById('followup-reminders-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) return;

  const heute = new Date();
  heute.setHours(0,0,0,0);
  const in7Tagen = new Date(heute);
  in7Tagen.setDate(in7Tagen.getDate() + 7);

  const reminders = [];

  // Check screenings for followUpDate
  const screenings = DB.getScreenings(sid);
  screenings.forEach(sc => {
    if (!sc.followUpDate) return;
    const fDate = new Date(sc.followUpDate);
    fDate.setHours(0,0,0,0);
    if (fDate <= heute) {
      reminders.push({ typ: 'Screening', label: sc.tool || 'Screening', datum: sc.followUpDate, status: 'overdue', diff: Math.floor((heute - fDate) / 86400000) });
    } else if (fDate <= in7Tagen) {
      reminders.push({ typ: 'Screening', label: sc.tool || 'Screening', datum: sc.followUpDate, status: 'upcoming', diff: Math.floor((fDate - heute) / 86400000) });
    }
  });

  // Check contacts for nachfassDatum
  const kontakte = DB.getKontakte(sid);
  kontakte.forEach(k => {
    if (!k.nachfassDatum) return;
    const fDate = new Date(k.nachfassDatum);
    fDate.setHours(0,0,0,0);
    if (fDate <= heute) {
      reminders.push({ typ: 'Kontakt', label: k.kontaktperson || 'Kontakt', datum: k.nachfassDatum, status: 'overdue', diff: Math.floor((heute - fDate) / 86400000) });
    } else if (fDate <= in7Tagen) {
      reminders.push({ typ: 'Kontakt', label: k.kontaktperson || 'Kontakt', datum: k.nachfassDatum, status: 'upcoming', diff: Math.floor((fDate - heute) / 86400000) });
    }
  });

  if (reminders.length === 0) { container.innerHTML = ''; return; }

  // Sort: overdue first (oldest first), then upcoming (soonest first)
  reminders.sort((a, b) => {
    if (a.status !== b.status) return a.status === 'overdue' ? -1 : 1;
    return a.status === 'overdue' ? b.diff - a.diff : a.diff - b.diff;
  });

  let html = '<div class="card" style="margin-bottom:12px;">';
  html += '<div class="card-header"><span>🔔</span><div class="card-title">Follow-Up Erinnerungen</div>';
  html += '<span style="font-size:11px;color:var(--text-muted);">' + reminders.length + ' offen</span></div>';
  html += '<div class="card-body" style="padding:8px 12px;">';

  reminders.forEach(r => {
    const isOverdue = r.status === 'overdue';
    const cssClass = isOverdue ? 'followup-overdue' : 'followup-upcoming';
    const icon = r.typ === 'Screening' ? '📊' : '📞';
    const datumStr = new Date(r.datum).toLocaleDateString('de-DE');
    const diffStr = isOverdue
      ? (r.diff === 0 ? 'Heute fällig' : r.diff + ' Tag' + (r.diff > 1 ? 'e' : '') + ' überfällig')
      : ('in ' + r.diff + ' Tag' + (r.diff > 1 ? 'en' : ''));

    html += '<div class="followup-card ' + cssClass + '">';
    html += '<span class="followup-icon">' + icon + '</span>';
    html += '<div class="followup-info">';
    html += '<div class="followup-name">' + escapeHtml(r.label) + '</div>';
    html += '<div class="followup-detail">' + r.typ + ' · ' + datumStr + '</div>';
    html += '</div>';
    html += '<span class="followup-date" style="color:' + (isOverdue ? 'var(--danger)' : '#92400E') + ';">' + diffStr + '</span>';
    html += '</div>';
  });

  html += '</div></div>';
  container.innerHTML = html;
}

// ============================================================
// FEATURE 1b: MEDIKATION DASHBOARD WIDGET
// ============================================================
function renderMedikationWidget() {
  const container = document.getElementById('medikation-dashboard-widget');
  if (!container) return;
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  const meds = s.medikation || [];
  const diagnosen = s.diagnosen || [];

  if (meds.length === 0 && diagnosen.length === 0) { container.innerHTML = ''; return; }

  let html = '<div class="card" style="margin-bottom:12px;">';
  html += '<div class="card-header"><span>💊</span><div class="card-title">Medikation & Diagnosen</div></div>';
  html += '<div class="card-body" style="padding:10px 14px;">';

  if (diagnosen.length > 0) {
    html += '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:' + (meds.length > 0 ? '10px' : '0') + ';">';
    diagnosen.forEach(d => {
      html += '<span class="diagnose-badge"><span class="icd-code">' + escapeHtml(d.icd || '—') + '</span> ' + escapeHtml(d.label) + '</span>';
    });
    html += '</div>';
  }

  if (meds.length > 0) {
    meds.forEach(m => {
      html += '<div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid var(--border-light, #F3F4F6);font-size:12px;">';
      html += '<span style="font-weight:600;">' + escapeHtml(m.name) + '</span>';
      if (m.dosierung) html += '<span style="color:var(--text-muted);">' + escapeHtml(m.dosierung) + '</span>';
      if (m.arzt) html += '<span style="color:var(--text-muted);margin-left:auto;">(' + escapeHtml(m.arzt) + ')</span>';
      html += '</div>';
    });
  }

  html += '</div></div>';
  container.innerHTML = html;
}

// ============================================================
// FEATURE 3: PROFIL-HEADER BADGES
// ============================================================
function renderProfilBadges(s) {
  const container = document.getElementById('profil-badges-container');
  if (!container) return;
  let html = '';

  const diagnosen = s.diagnosen || [];
  diagnosen.forEach(d => {
    html += '<span class="profil-diagnose-badge">' + escapeHtml(d.icd || d.label) + '</span>';
  });

  const meds = s.medikation || [];
  if (meds.length > 0) {
    html += '<span class="profil-med-badge">' + meds.length + ' Medikament' + (meds.length > 1 ? 'e' : '') + '</span>';
  }

  container.innerHTML = html;
}

// ============================================================
// FEATURE 4: RISIKO-TIMELINE CHART (Chart.js)
// ============================================================
function renderRisikoChart(schuelerId) {
  const ctx = document.getElementById('risiko-chart');
  if (!ctx) return;

  if (APP.risikoChart) {
    APP.risikoChart.destroy();
    APP.risikoChart = null;
  }

  const risikoDaten = DB.getRisiko(schuelerId)
    .sort((a, b) => a.datum.localeCompare(b.datum))
    .slice(-20);

  if (risikoDaten.length < 2) {
    APP.risikoChart = null;
    const parent = ctx.parentElement;
    if (parent) parent.innerHTML = '<div style="text-align:center;padding:8px;font-size:11px;color:var(--text-muted);">Mindestens 2 Bewertungen nötig für den Chart</div>';
    return;
  }

  const labels = risikoDaten.map(r =>
    new Date(r.datum).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit' })
  );

  // Map color values to numbers: gruen=0, gelb=1, rot=2
  const colorToNum = v => v === 'rot' ? 2 : v === 'gelb' ? 1 : 0;

  // Main risk categories
  const sicherheitData = risikoDaten.map(r => colorToNum(r.werte.sicherheit || 'gruen'));
  const selbstverletzungData = risikoDaten.map(r => colorToNum(r.werte.selbstverletzung || 'gruen'));
  const cssrsData = risikoDaten.map(r => {
    // Highest C-SSRS level
    const vals = ['cssrs_gedanken', 'cssrs_plan', 'cssrs_absicht', 'cssrs_mittel', 'cssrs_verhalten']
      .map(k => colorToNum(r.werte[k] || 'gruen'));
    return Math.max(...vals);
  });

  APP.risikoChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'Sicherheit',
          data: sicherheitData,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59,130,246,0.1)',
          borderWidth: 2, pointRadius: 3, tension: 0.3, fill: false,
        },
        {
          label: 'Selbstverletzung',
          data: selbstverletzungData,
          borderColor: '#F59E0B',
          backgroundColor: 'rgba(245,158,11,0.1)',
          borderWidth: 2, pointRadius: 3, tension: 0.3, fill: false,
        },
        {
          label: 'Suizidalität (C-SSRS)',
          data: cssrsData,
          borderColor: '#EF4444',
          backgroundColor: 'rgba(239,68,68,0.1)',
          borderWidth: 2, pointRadius: 3, tension: 0.3, fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: true, position: 'bottom', labels: { font: { size: 10 }, boxWidth: 12 } },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const stufen = ['Grün', 'Gelb', 'Rot'];
              return ctx.dataset.label + ': ' + (stufen[ctx.raw] || 'Grün');
            },
          },
        },
      },
      scales: {
        y: {
          min: 0, max: 2,
          ticks: {
            stepSize: 1,
            font: { size: 10 },
            callback: v => ['Grün', 'Gelb', 'Rot'][v] || '',
          },
        },
        x: { ticks: { font: { size: 10 }, maxRotation: 45 } },
      },
    },
  });
}

// ============================================================
// FEATURE 5: GENOGRAMM DRUCKEN
// ============================================================
function druckeGenogramm() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  if (!s) return;
  const geno = getGenogramm();

  if (geno.length === 0) { showToast('Kein Genogramm vorhanden', 'warning'); return; }

  const rolleLabels = typeof GENO_ROLLEN_LABELS !== 'undefined' ? GENO_ROLLEN_LABELS : {};
  const bezStyles = typeof GENO_BEZ_STYLES !== 'undefined' ? GENO_BEZ_STYLES : {};

  const personenHtml = geno.map(p => {
    const rolleLabel = rolleLabels[p.rolle] || p.rolle || '';
    const bez = bezStyles[p.beziehung] || { label: p.beziehung || '', farbe: '#6B7280' };
    return '<div style="display:inline-block;border:1px solid #D1D5DB;border-radius:8px;padding:8px 14px;margin:4px;text-align:center;min-width:100px;">'
      + '<div style="font-weight:600;font-size:13px;">' + escapeHtml(p.name || '') + '</div>'
      + '<div style="font-size:11px;color:#6B7280;">' + escapeHtml(rolleLabel) + '</div>'
      + '<div style="font-size:10px;color:' + bez.farbe + ';font-weight:600;">' + escapeHtml(bez.label) + '</div>'
      + (p.notiz ? '<div style="font-size:10px;color:#9CA3AF;font-style:italic;margin-top:2px;">' + escapeHtml(p.notiz) + '</div>' : '')
      + '</div>';
  }).join('');

  const html = '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">'
    + '<title>Genogramm – ' + escapeHtml(s.vorname + ' ' + s.nachname) + '</title>'
    + '<style>body{font-family:"Segoe UI",system-ui,sans-serif;margin:40px;color:#1F2937;font-size:13px;line-height:1.6;}'
    + 'h1{font-size:20px;margin-bottom:4px;}.meta{color:#6B7280;font-size:12px;margin-bottom:20px;}'
    + '.center{text-align:center;margin:20px 0;padding:12px;background:#EEF2FF;border-radius:10px;font-weight:700;font-size:15px;}'
    + '@media print{body{margin:20px;}}</style></head><body>'
    + '<h1>Genogramm — ' + escapeHtml(s.vorname + ' ' + s.nachname) + '</h1>'
    + '<div class="meta">Klasse: ' + escapeHtml(s.klasse || '—') + ' · Gedruckt: ' + new Date().toLocaleDateString('de-DE') + '</div>'
    + '<div class="center">' + escapeHtml(s.vorname + ' ' + s.nachname) + '</div>'
    + '<div style="text-align:center;">' + personenHtml + '</div>'
    + '</body></html>';

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

// ============================================================
// FEATURE 6: SITZUNGSVORBEREITUNGS-PDF
// ============================================================
function druckeSitzungsvorbereitung() {
  const sid = APP.currentSchuelerId;
  if (!sid) return;
  const s = DB.getSchuelerById(sid);
  if (!s) return;

  // Last SOAP note
  const notizen = DB.getNotizen(sid)
    .filter(n => n.soap)
    .sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const lastSOAP = notizen.length > 0 ? notizen[0] : null;

  // Active roadmap phase
  const roadmap = DB.getRoadmap(sid);
  const aktivePhase = roadmap ? roadmap.phasen.find(p => p.status === 'aktiv') : null;
  const phaseDef = aktivePhase ? ROADMAP_PHASEN[aktivePhase.nr] : null;

  // Session recommendation
  let empfThema = null;
  if (aktivePhase) {
    empfThema = findNextPhaseThema(aktivePhase, sid);
  }

  // Active goals
  const ziele = (s.ziele || []).filter(z => z.status !== 'erreicht');

  // Risk status
  const risikoDaten = DB.getRisiko(sid).sort((a, b) => new Date(b.datum) - new Date(a.datum));
  const letzterRisiko = risikoDaten.length > 0 ? risikoDaten[0] : null;

  // Medications
  const meds = s.medikation || [];
  const diagnosen = s.diagnosen || [];

  let body = '';

  // Header
  body += '<h1>Sitzungsvorbereitung</h1>';
  body += '<div class="meta">' + escapeHtml(s.vorname + ' ' + s.nachname) + ' · Klasse: ' + escapeHtml(s.klasse || '—') + ' · Datum: ' + new Date().toLocaleDateString('de-DE') + '</div>';

  // Active phase
  if (phaseDef) {
    body += '<div class="section"><h2>Aktuelle Phase</h2>';
    body += '<div class="phase-box">Phase ' + phaseDef.nr + ': ' + escapeHtml(phaseDef.label) + ' — ' + escapeHtml(phaseDef.beschreibung || '') + '</div></div>';
  }

  // Last SOAP
  if (lastSOAP) {
    body += '<div class="section"><h2>Letzte Sitzung (' + new Date(lastSOAP.datum).toLocaleDateString('de-DE') + ')</h2>';
    const soap = lastSOAP.soap;
    if (soap.subjektiv) body += '<div class="soap-item"><strong>S (Subjektiv):</strong> ' + escapeHtml(soap.subjektiv) + '</div>';
    if (soap.objektiv) body += '<div class="soap-item"><strong>O (Objektiv):</strong> ' + escapeHtml(soap.objektiv) + '</div>';
    if (soap.assessment) body += '<div class="soap-item"><strong>A (Assessment):</strong> ' + escapeHtml(soap.assessment) + '</div>';
    if (soap.plan) body += '<div class="soap-item"><strong>P (Plan):</strong> ' + escapeHtml(soap.plan) + '</div>';
    body += '</div>';
  }

  // Session recommendation
  if (empfThema) {
    body += '<div class="section"><h2>Empfohlenes Thema heute</h2>';
    body += '<div class="highlight">' + escapeHtml(empfThema.titel || empfThema.id) + '</div></div>';
  }

  // Active goals
  if (ziele.length > 0) {
    body += '<div class="section"><h2>Offene Ziele</h2>';
    ziele.forEach(z => {
      body += '<div class="goal-item">☐ ' + escapeHtml(z.text || z.titel || '') + '</div>';
    });
    body += '</div>';
  }

  // Risk status
  if (letzterRisiko) {
    const maxStufe = Object.values(letzterRisiko.werte).includes('rot') ? 'rot' : Object.values(letzterRisiko.werte).includes('gelb') ? 'gelb' : 'gruen';
    const farben = { rot: '#EF4444', gelb: '#F59E0B', gruen: '#10B981' };
    body += '<div class="section"><h2>Risiko-Status</h2>';
    body += '<div class="risk-badge" style="color:' + farben[maxStufe] + ';border-color:' + farben[maxStufe] + ';">' + maxStufe.charAt(0).toUpperCase() + maxStufe.slice(1) + ' (' + new Date(letzterRisiko.datum).toLocaleDateString('de-DE') + ')</div></div>';
  }

  // Medications & Diagnoses
  if (meds.length > 0 || diagnosen.length > 0) {
    body += '<div class="section"><h2>Medikation & Diagnosen</h2>';
    if (diagnosen.length > 0) {
      body += '<div style="margin-bottom:6px;">';
      diagnosen.forEach(d => { body += '<span class="diag-pill">' + escapeHtml(d.icd || '') + ' ' + escapeHtml(d.label) + '</span> '; });
      body += '</div>';
    }
    if (meds.length > 0) {
      meds.forEach(m => {
        body += '<div class="med-line">' + escapeHtml(m.name) + (m.dosierung ? ' — ' + escapeHtml(m.dosierung) : '') + '</div>';
      });
    }
    body += '</div>';
  }

  // Notes field for print
  body += '<div class="section"><h2>Notizen</h2>';
  body += '<div class="notes-box"></div></div>';

  const html = '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">'
    + '<title>Sitzungsvorbereitung – ' + escapeHtml(s.vorname + ' ' + s.nachname) + '</title>'
    + '<style>'
    + 'body{font-family:"Segoe UI",system-ui,sans-serif;margin:40px;color:#1F2937;font-size:13px;line-height:1.6;}'
    + 'h1{font-size:20px;margin-bottom:4px;} h2{font-size:14px;margin:16px 0 6px;color:#374151;border-bottom:1px solid #E5E7EB;padding-bottom:4px;}'
    + '.meta{color:#6B7280;font-size:12px;margin-bottom:20px;}'
    + '.section{margin-bottom:16px;page-break-inside:avoid;}'
    + '.phase-box{background:#EEF2FF;padding:8px 12px;border-radius:6px;font-size:12px;font-weight:500;}'
    + '.soap-item{padding:3px 0;font-size:12px;}'
    + '.highlight{background:#ECFDF5;padding:8px 12px;border-radius:6px;font-weight:600;font-size:13px;border-left:3px solid #10B981;}'
    + '.goal-item{padding:3px 0;font-size:12px;}'
    + '.risk-badge{display:inline-block;padding:4px 12px;border:2px solid;border-radius:6px;font-weight:600;font-size:12px;}'
    + '.diag-pill{display:inline-block;background:#EFF6FF;color:#2563EB;padding:2px 8px;border-radius:10px;font-size:11px;font-weight:500;margin:2px;}'
    + '.med-line{font-size:12px;padding:2px 0;}'
    + '.notes-box{border:1px solid #D1D5DB;border-radius:6px;min-height:120px;margin-top:4px;}'
    + '@media print{body{margin:20px;}.notes-box{min-height:150px;}}'
    + '</style></head><body>' + body + '</body></html>';

  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 600);
}

// ============================================================
// FEATURE 7: KONTEXTHILFE / HELP-PANEL
// ============================================================
const HELP_CONTENT = {
  'home': {
    titel: 'Klientenübersicht',
    abschnitte: [
      { titel: 'Übersicht', text: 'Hier siehst du alle erfassten Klientinnen und Klienten. Klicke auf einen Namen, um das Profil zu öffnen.' },
      { titel: 'Neuen Klienten anlegen', text: 'Klicke auf "+ Neuer Klient" um einen neuen Klienten zu erfassen. Mindestens Vor- und Nachname sind erforderlich.' },
      { titel: 'Suche', text: 'Nutze das Suchfeld, um Klienten nach Name oder Klasse zu filtern.' },
    ],
  },
  'dashboard': {
    titel: 'Klienten-Dashboard',
    abschnitte: [
      { titel: 'Prioritäten', text: 'Das Dashboard zeigt Informationen in Prioritätsreihenfolge: Sicherheitswarnungen zuerst, dann Risiko-Status, Engagement, Verlaufs-Trends und Sitzungsvorschläge.' },
      { titel: 'Sitzungsvorschlag', text: 'Basierend auf dem aktuellen Förderplan und dem PVT-Zustand wird automatisch ein Thema für die nächste Sitzung empfohlen.' },
      { titel: 'Follow-Ups', text: 'Überfällige und kommende Nachfass-Termine aus Screenings und Kontakten werden hier angezeigt.' },
    ],
  },
  'screening': {
    titel: 'Screening-Durchführung',
    abschnitte: [
      { titel: 'Ablauf', text: 'Wähle ein Screening-Tool und beantworte die Fragen. Die Auswertung erfolgt automatisch mit Cut-Off-Werten und Empfehlungen.' },
      { titel: 'Follow-Up', text: 'Nach Abschluss kannst du ein Follow-Up-Datum setzen, um die Wiederholung des Screenings zu planen.' },
      { titel: 'Verlauf', text: 'Im Aufnahme-Tab siehst du den Verlauf aller durchgeführten Screenings als Grafik.' },
    ],
  },
  'info': {
    titel: 'Aufnahme / Anamnese',
    abschnitte: [
      { titel: 'Anamnese', text: 'Erfasse systematisch biografische und psychosoziale Informationen. Die Chip-Auswahl ergänzt automatische Hypothesen.' },
      { titel: 'Medikation', text: 'Dokumentiere aktuelle Medikamente mit Dosierung, verordnendem Arzt und Nebenwirkungen. Diese Informationen erscheinen auch im Dashboard.' },
      { titel: 'Diagnosen', text: 'Erfasse ICD-Diagnosen mit Code, Bezeichnung und diagnostizierender Stelle. Diagnosen werden als Badges im Profil-Header angezeigt.' },
    ],
  },
  'roadmap': {
    titel: 'Förderplan (Roadmap)',
    abschnitte: [
      { titel: '7-Phasen-Modell', text: 'Der Förderplan besteht aus 7 aufeinander aufbauenden Phasen: Krisenintervention, Beziehungsaufbau, Diagnostik, Psychoedukation, Kompetenzaufbau, Vertiefung und Abschluss.' },
      { titel: 'Themen zuweisen', text: 'Weise jeder Phase Themen aus dem Themenkatalog zu. Die Reihenfolge berücksichtigt automatisch Voraussetzungen (Sequenzierung).' },
      { titel: 'Drucken', text: 'Den Förderplan kannst du als übersichtliches PDF drucken.' },
    ],
  },
  'verlauf': {
    titel: 'Verlauf & Notizen',
    abschnitte: [
      { titel: 'SOAP-Notizen', text: 'Dokumentiere Sitzungen im SOAP-Format: Subjektiv (Schüler-Bericht), Objektiv (Beobachtungen), Assessment (Einschätzung) und Plan (nächste Schritte).' },
      { titel: 'Risiko-Bewertung', text: 'Erfasse regelmässig den Risiko-Status. Bei mehreren Bewertungen wird ein Verlaufs-Chart angezeigt.' },
    ],
  },
  'genogramm': {
    titel: 'Genogramm',
    abschnitte: [
      { titel: 'Familien-Darstellung', text: 'Das Genogramm visualisiert Familienmitglieder und Bezugspersonen mit ihren Beziehungsqualitäten (eng, distanziert, konflikthaft etc.).' },
      { titel: 'Risiko-Erkennung', text: 'Automatische Warnungen bei fehlenden Elternteilen, vielen Konflikten oder Risiko-Hinweisen in Notizen.' },
      { titel: 'Drucken', text: 'Das Genogramm kann über den Druck-Button exportiert werden.' },
    ],
  },
  'kontaktlog': {
    titel: 'Kontaktlog',
    abschnitte: [
      { titel: 'Dokumentation', text: 'Dokumentiere alle Kontakte mit Eltern, Lehrpersonen und anderen Bezugspersonen. Der Engagement-Score zeigt die Kontaktqualität.' },
      { titel: 'Nachfass-Termine', text: 'Setze Nachfass-Daten für vereinbarte Follow-Ups. Überfällige Termine erscheinen als Erinnerung im Dashboard.' },
    ],
  },
  'kalender': {
    titel: 'Kalender',
    abschnitte: [
      { titel: 'Terminplanung', text: 'Erstelle und verwalte Termine für alle Klienten. Termine erscheinen auch im Dashboard-Mini-Kalender.' },
    ],
  },
};

function toggleHelpPanel() {
  const panel = document.getElementById('help-panel');
  const overlay = document.getElementById('help-overlay');
  if (!panel || !overlay) return;

  const isOpen = panel.classList.contains('open');
  if (isOpen) {
    panel.classList.remove('open');
    overlay.classList.remove('open');
  } else {
    renderHelp();
    panel.classList.add('open');
    overlay.classList.add('open');
  }
}

function renderHelp() {
  const container = document.getElementById('help-container');
  if (!container) return;

  // Determine context
  let contextKey = APP.currentView || 'home';
  if (contextKey === 'profil' && APP.currentProfilTab) {
    contextKey = APP.currentProfilTab;
  }

  const content = HELP_CONTENT[contextKey] || HELP_CONTENT['home'];

  let html = '<div style="margin-bottom:16px;">';
  html += '<div style="font-size:11px;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:4px;">Aktuelle Ansicht</div>';
  html += '<div style="font-size:16px;font-weight:600;">' + escapeHtml(content.titel) + '</div>';
  html += '</div>';

  content.abschnitte.forEach(a => {
    html += '<div class="help-section">';
    html += '<h4>' + escapeHtml(a.titel) + '</h4>';
    html += '<p>' + escapeHtml(a.text) + '</p>';
    html += '</div>';
  });

  // General tips
  html += '<div class="help-tip"><strong>Tipp:</strong> Die Hilfe passt sich automatisch an die aktuelle Ansicht an. Navigiere zu einem anderen Bereich und öffne die Hilfe erneut für kontextsensitive Informationen.</div>';

  // Keyboard shortcuts
  html += '<div class="help-section"><h4>Nützliche Hinweise</h4>';
  html += '<div class="help-shortcut"><span>Alle Daten werden lokal gespeichert</span><span>localStorage</span></div>';
  html += '<div class="help-shortcut"><span>PIN-Schutz aktivieren</span><span>Sidebar</span></div>';
  html += '<div class="help-shortcut"><span>Daten exportieren</span><span>JSON/CSV</span></div>';
  html += '</div>';

  container.innerHTML = html;
}

// ============================================================
// UNSAVED CHANGES WARNING
// ============================================================
var _formDirty = false;

function markFormDirty() { _formDirty = true; }
function clearFormDirty() { _formDirty = false; }

function guardUnsavedChanges(callback) {
  if (_formDirty) {
    showConfirm('Ungespeicherte Änderungen verwerfen?', () => {
      _formDirty = false;
      callback();
    });
  } else {
    callback();
  }
}

// Attach to SOAP form fields
document.addEventListener('input', function(e) {
  const soapFields = ['prot-subjektiv', 'prot-objektiv', 'prot-assessment', 'prot-plan'];
  const medFields = ['med-name', 'med-dosierung', 'med-arzt', 'med-seit', 'med-nebenwirkungen'];
  const diagnoseFields = ['diagnose-icd', 'diagnose-label', 'diagnose-am', 'diagnose-von'];
  const allWatched = [...soapFields, ...medFields, ...diagnoseFields, 'kontakt-inhalt', 'kontakt-vereinbarungen'];
  if (allWatched.includes(e.target.id)) {
    _formDirty = true;
  }
});

// ============================================================
// EMPTY STATES HELPER
// ============================================================
function renderEmptyState(icon, title, text) {
  return '<div class="empty-state">'
    + '<div class="empty-state-icon">' + icon + '</div>'
    + '<div class="empty-state-title">' + escapeHtml(title) + '</div>'
    + '<div class="empty-state-text">' + escapeHtml(text) + '</div>'
    + '</div>';
}
