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

// ---- Phase 1: Sicherheit & Beziehung ----
function renderRessourcenPhase1() {
  var html = '';

  // Gesprächsleitfaden Erstgespräch (Accordion)
  html += '<div class="phase-res-accordion">' +
    '<div class="phase-res-accordion-head" onclick="togglePhaseAccordion(\'leitfaden-erstgespraech\')">' +
      '<span class="phase-res-accordion-title">&#128483; Gesprächsleitfaden Erstgespräch</span>' +
      '<span class="phase-res-accordion-toggle" id="leitfaden-erstgespraech-toggle">&#9660; Aufklappen</span>' +
    '</div>' +
    '<div class="phase-res-accordion-body" id="leitfaden-erstgespraech">' +
      '<div class="phase-res-tip phase-res-tip-green">' +
        '<strong>Einstieg:</strong><br>' +
        '&laquo;Schön, dass du da bist. Ich bin [Name] und arbeite hier als Bezugsperson. ' +
        'Mein Job ist es, dich zu unterstützen — nicht dich zu bewerten. Alles was du hier sagst, ' +
        'bleibt zwischen uns, es sei denn, du oder jemand anderes ist in Gefahr. ' +
        'Was beschäftigt dich gerade?&raquo;' +
      '</div>' +
      '<div class="phase-res-tip phase-res-tip-yellow">' +
        '<strong>Wenn blockiert:</strong><br>' +
        'Wenn der Jugendliche schweigt oder abweisend ist: &laquo;Das ist völlig okay. ' +
        'Wir müssen heute nicht über alles reden. Magst du mir stattdessen erzählen, ' +
        'was du in deiner Freizeit gerne machst?&raquo; — Wechsel auf Stärken/Interessen als Einstieg.' +
      '</div>' +
      '<div class="phase-res-tip phase-res-tip-blue">' +
        '<strong>Abschluss:</strong><br>' +
        '&laquo;Danke, dass du heute hier warst. Nächstes Mal können wir da weitermachen, ' +
        'wo du möchtest. Gibt es etwas, das du dir für unser nächstes Treffen wünschst?&raquo;' +
      '</div>' +
    '</div>' +
  '</div>';

  // Krisenprotokoll-Accordion
  html += '<div class="phase-res-accordion">' +
    '<div class="phase-res-accordion-head" onclick="togglePhaseAccordion(\'krisenprotokoll\')">' +
      '<span class="phase-res-accordion-title">&#9888; Krisen-Checkliste: Was tun wenn...</span>' +
      '<span class="phase-res-accordion-toggle" id="krisenprotokoll-toggle">&#9660; Aufklappen</span>' +
    '</div>' +
    '<div class="phase-res-accordion-body" id="krisenprotokoll">' +
      '<div class="phase-res-tip phase-res-tip-red">' +
        '<strong>Suizidale Äußerung:</strong><br>' +
        '1. Ruhig bleiben, ernst nehmen<br>' +
        '2. Direkt fragen: &laquo;Denkst du daran, dir etwas anzutun?&raquo;<br>' +
        '3. Nicht allein lassen<br>' +
        '4. Sofort Krisenteam / Notarzt informieren<br>' +
        '5. Dokumentieren (Zeitpunkt, Wortlaut, Maßnahmen)' +
      '</div>' +
      '<div class="phase-res-tip phase-res-tip-yellow">' +
        '<strong>Selbstverletzung entdeckt:</strong><br>' +
        '1. Nicht erschrecken oder Vorwürfe machen<br>' +
        '2. &laquo;Ich sehe, dass es dir nicht gut geht. Magst du mir erzählen, was passiert ist?&raquo;<br>' +
        '3. Wunden versorgen (lassen)<br>' +
        '4. Sicherheitsplan gemeinsam erstellen<br>' +
        '5. Eltern / Therapeut informieren (nach Absprache)' +
      '</div>' +
      '<div class="phase-res-tip phase-res-tip-purple">' +
        '<strong>Dissoziativer Zustand:</strong><br>' +
        '1. Sanft ansprechen mit Namen<br>' +
        '2. Grounding: &laquo;Kannst du mir 5 Dinge sagen, die du gerade siehst?&raquo;<br>' +
        '3. Kaltes Wasser anbieten, Eiswürfel in die Hand<br>' +
        '4. Nicht anfassen ohne Erlaubnis<br>' +
        '5. Raum geben, Sicherheit signalisieren' +
      '</div>' +
    '</div>' +
  '</div>';

  // Buttons
  html += '<div class="phase-res-links">' +
    '<button class="btn btn-secondary btn-sm phase-res-btn" onclick="showProfilTab(\'staerken\')">' +
      '&#128170; Stärken-Ersterfassung &#8594;</button>' +
    '<a href="arbeitsblatter/krisenplan.html" target="_blank" ' +
      'class="btn btn-secondary btn-sm phase-res-btn">' +
      '&#127384; Krisenplan-Vorlage</a>' +
  '</div>';

  // Hinweis
  html += '<div class="phase-res-info phase-res-info-yellow">' +
    '&#9888; <strong>Noch keine Arbeitsblätter in dieser Phase</strong> — erst Beziehung aufbauen. ' +
    'Arbeitsblätter kommen ab Phase 4 (Intervention).' +
  '</div>';

  return html;
}

function togglePhaseAccordion(id) {
  var body = document.getElementById(id);
  var toggle = document.getElementById(id + '-toggle');
  if (!body) return;
  var isOpen = body.classList.contains('open');
  body.classList.toggle('open');
  if (toggle) {
    toggle.textContent = isOpen ? '\u25BC Aufklappen' : '\u25B2 Zuklappen';
  }
}
function renderRessourcenPhase2() { return ''; }
function renderRessourcenPhase3() { return ''; }
function renderRessourcenPhase4() { return ''; }
function renderRessourcenPhase5() { return ''; }
function renderRessourcenPhase6() { return ''; }
