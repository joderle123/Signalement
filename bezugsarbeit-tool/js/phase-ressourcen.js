// ============================================================
// PHASEN-RESSOURCEN — Kontextbezogene Werkzeuge pro Phase
// ============================================================

function savePhaseData(key, value) {
  var sid = APP.currentSchuelerId;
  if (!sid) return;
  var roadmap = DB.getRoadmap(sid);
  if (!roadmap) return;
  if (!roadmap.phasenDaten) roadmap.phasenDaten = {};
  roadmap.phasenDaten[key] = value;
  DB.saveRoadmap(roadmap);
}

function getPhaseData(key, fallback) {
  var sid = APP.currentSchuelerId;
  if (!sid) return fallback;
  var roadmap = DB.getRoadmap(sid);
  if (!roadmap || !roadmap.phasenDaten) return fallback;
  return roadmap.phasenDaten[key] !== undefined ? roadmap.phasenDaten[key] : fallback;
}

// Dispatcher
function renderPhaseRessourcen(phase, idx, roadmap) {
  var inhalt = '';
  switch (phase.nr) {
    case 0: inhalt = renderRessourcenPhase0(); break;
    case 1: inhalt = renderRessourcenPhase1(); break;
    case 2: inhalt = renderRessourcenPhase2(); break;
    case 3: inhalt = renderRessourcenPhase3(); break;
    case 4: inhalt = renderRessourcenPhase4(); break;
    case 5: inhalt = renderRessourcenPhase5(); break;
    case 6: inhalt = renderRessourcenPhase6(); break;
    default: return '';
  }
  if (!inhalt) return '';

  return '<div class="phase-ressourcen">' +
    '<div class="phase-ressourcen-header">' +
      '<span class="phase-ressourcen-icon">&#128218;</span> Ressourcen &amp; Werkzeuge' +
    '</div>' +
    inhalt +
  '</div>';
}

// ---- Phase 0: Vorbereitung ----
function renderRessourcenPhase0() {
  var checks = getPhaseData('ueberweisungChecklist', [false, false, false, false, false]);
  var labels = [
    'Einverständniserklärung eingeholt',
    'Bezugspersonen identifiziert',
    'Vorgeschichte dokumentiert',
    'Netzwerk-Kontakte notiert',
    'Erstgespräch geplant'
  ];
  var done = checks.filter(Boolean).length;
  var systemkarte = getPhaseData('systemkarte', '');

  var html = '';

  // Vorlagen-Links
  html += '<div class="phase-res-links">' +
    '<a href="therapie-module/therapiemodul-genogramm.html" target="_blank" class="btn btn-secondary btn-sm phase-res-btn">' +
      '&#127795; Genogramm-Vorlage</a>' +
    '<a href="arbeitsblatter/familie.html" target="_blank" class="btn btn-secondary btn-sm phase-res-btn">' +
      '&#128104;&#8205;&#128105;&#8205;&#128103; Familie-Arbeitsblatt</a>' +
  '</div>';

  // Systemkarte
  html += '<div class="phase-res-section">' +
    '<label class="phase-res-label">&#128506; Systemkarte — Wer ist involviert?</label>' +
    '<textarea class="phase-res-textarea" ' +
      'placeholder="Eltern, Lehrer, Sozialarbeiter, Therapeut, Jugendgericht, weitere Bezugspersonen..." ' +
      'onchange="savePhaseData(\'systemkarte\', this.value)">' + escapeHtml(systemkarte) + '</textarea>' +
  '</div>';

  // Überweisungs-Checkliste
  html += '<div class="phase-res-checklist">' +
    '<div class="phase-res-checklist-header">' +
      '<span class="phase-res-checklist-title">Überweisungs-Checkliste</span>' +
      '<span class="phase-res-checklist-count">' + done + '/5 erledigt</span>' +
    '</div>';

  for (var i = 0; i < labels.length; i++) {
    var checked = checks[i];
    html += '<label class="phase-res-check-item" onclick="toggleUeberweisungCheck(' + i + ')">' +
      '<span class="phase-res-checkbox ' + (checked ? 'checked' : '') + '">' +
        (checked ? '&#10003;' : '') +
      '</span>' +
      '<span' + (checked ? ' class="phase-res-done"' : '') + '>' + labels[i] + '</span>' +
    '</label>';
  }

  html += '</div>';

  return html;
}

function toggleUeberweisungCheck(index) {
  var checks = getPhaseData('ueberweisungChecklist', [false, false, false, false, false]);
  checks[index] = !checks[index];
  savePhaseData('ueberweisungChecklist', checks);
  if (typeof renderRoadmap === 'function') renderRoadmap();
}

// Platzhalter für Phase 1–6 (werden schrittweise implementiert)
function renderRessourcenPhase1() { return ''; }
function renderRessourcenPhase2() { return ''; }
function renderRessourcenPhase3() { return ''; }
function renderRessourcenPhase4() { return ''; }
function renderRessourcenPhase5() { return ''; }
function renderRessourcenPhase6() { return ''; }
