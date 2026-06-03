/* ============================================================
   Anwesenheit — Absenzen- & Präsenz-Tool
   Vanilla JS · Persistenz via localStorage · kein Build nötig
   ============================================================ */
(function () {
  'use strict';

  const STORAGE_KEY = 'anwesenheit_v1';

  const STATUS = {
    entschuldigt:   { label: 'Entschuldigt',   short: 'E', isAbsence: true },
    unentschuldigt: { label: 'Unentschuldigt', short: 'U', isAbsence: true },
    verspaetet:     { label: 'Verspätet',      short: 'V', isAbsence: false },
  };

  const WEEKDAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  // Reihenfolge für Anzeige: Mo–So
  const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

  /* ---------------- State ---------------- */
  let state = { students: [], periods: [], entries: [] };

  function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        state.students = Array.isArray(parsed.students) ? parsed.students : [];
        state.periods = Array.isArray(parsed.periods) ? parsed.periods : [];
        state.entries = Array.isArray(parsed.entries) ? parsed.entries : [];
      }
    } catch (e) {
      console.error('Konnte Daten nicht laden:', e);
    }
  }

  function storageAvailable() {
    try {
      const k = '__test_' + Date.now();
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false;
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      toast('⚠️ Speichern fehlgeschlagen — bitte Backup exportieren!');
      console.error(e);
    }
  }

  /* ---------------- Helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function studentName(id) {
    const s = state.students.find(function (x) { return x.id === id; });
    return s ? s.name : '— gelöscht —';
  }

  function fmtDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  function weekdayOf(iso) {
    return new Date(iso + 'T00:00:00').getDay();
  }

  function num(n) {
    return (Math.round(n * 100) / 100).toLocaleString('de-CH');
  }

  // Filtert Einträge nach Periode (id) und optional Schüler/Status
  function filterEntries(opts) {
    opts = opts || {};
    let list = state.entries.slice();
    if (opts.periodId) {
      const p = state.periods.find(function (x) { return x.id === opts.periodId; });
      if (p) {
        list = list.filter(function (e) { return e.date >= p.start && e.date <= p.end; });
      }
    }
    if (opts.studentId) list = list.filter(function (e) { return e.studentId === opts.studentId; });
    if (opts.status) list = list.filter(function (e) { return e.status === opts.status; });
    return list;
  }

  let toastTimer;
  function toast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2600);
  }

  /* ---------------- Navigation ---------------- */
  function showView(name) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    const view = document.getElementById('view-' + name);
    if (view) view.classList.add('active');
    const tab = document.querySelector('.tab[data-view="' + name + '"]');
    if (tab) tab.classList.add('active');
    // jeweils neu rendern, damit Auswertungen aktuell sind
    if (name === 'auswertung') renderStats();
    if (name === 'wochentag') renderWeekday();
    if (name === 'erfassung') renderEntries();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------------- Selects befüllen ---------------- */
  function fillStudentSelect(sel, includeAll, allLabel) {
    const cur = sel.value;
    sel.innerHTML = '';
    if (includeAll) {
      const o = document.createElement('option');
      o.value = ''; o.textContent = allLabel || 'Alle Schüler';
      sel.appendChild(o);
    }
    state.students.forEach(function (s) {
      const o = document.createElement('option');
      o.value = s.id;
      o.textContent = s.name + (s.klasse ? ' (' + s.klasse + ')' : '');
      sel.appendChild(o);
    });
    sel.value = cur;
  }

  function fillPeriodSelect(sel) {
    const cur = sel.value;
    sel.innerHTML = '<option value="">Ganzes Schuljahr</option>';
    state.periods.forEach(function (p) {
      const o = document.createElement('option');
      o.value = p.id;
      o.textContent = p.name;
      sel.appendChild(o);
    });
    sel.value = cur;
  }

  function refreshSelects() {
    fillStudentSelect(document.getElementById('entry-student'), false);
    fillStudentSelect(document.getElementById('filter-student'), true);
    fillStudentSelect(document.getElementById('wt-student'), true);
    fillPeriodSelect(document.getElementById('filter-period'));
    fillPeriodSelect(document.getElementById('stat-period'));
    fillPeriodSelect(document.getElementById('wt-period'));
  }

  /* ============================================================
     SCHÜLER
     ============================================================ */
  function renderStudents() {
    const wrap = document.getElementById('students-list');
    document.getElementById('student-count').textContent =
      state.students.length ? '· ' + state.students.length : '';
    if (!state.students.length) {
      wrap.innerHTML = emptyState('🧑‍🎓', 'Noch keine Schüler angelegt.');
      return;
    }
    let rows = state.students.map(function (s) {
      const total = state.entries
        .filter(function (e) { return e.studentId === s.id && STATUS[e.status].isAbsence; })
        .reduce(function (a, e) { return a + (e.lektionen || 0); }, 0);
      return '<tr>' +
        '<td><strong>' + esc(s.name) + '</strong></td>' +
        '<td>' + (s.klasse ? esc(s.klasse) : '<span class="muted">–</span>') + '</td>' +
        '<td class="num">' + num(total) + '</td>' +
        '<td class="num"><div class="inline-actions" style="justify-content:flex-end;">' +
          '<button class="btn btn-ghost btn-sm" data-edit-student="' + s.id + '">Bearbeiten</button>' +
          '<button class="btn btn-danger btn-sm" data-del-student="' + s.id + '">Löschen</button>' +
        '</div></td></tr>';
    }).join('');
    wrap.innerHTML = '<div class="table-wrap"><table>' +
      '<thead><tr><th>Name</th><th>Klasse</th><th class="num">Absenz-Lekt.</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  function submitStudent(e) {
    e.preventDefault();
    const id = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value.trim();
    const klasse = document.getElementById('student-klasse').value.trim();
    if (!name) return;
    if (id) {
      const s = state.students.find(function (x) { return x.id === id; });
      if (s) { s.name = name; s.klasse = klasse; }
      toast('✅ Schüler aktualisiert');
    } else {
      state.students.push({ id: uid(), name: name, klasse: klasse });
      toast('✅ Schüler hinzugefügt');
    }
    save();
    resetStudentForm();
    renderStudents();
    refreshSelects();
  }

  function editStudent(id) {
    const s = state.students.find(function (x) { return x.id === id; });
    if (!s) return;
    document.getElementById('student-id').value = s.id;
    document.getElementById('student-name').value = s.name;
    document.getElementById('student-klasse').value = s.klasse || '';
    document.getElementById('student-submit').textContent = 'Speichern';
    document.getElementById('student-cancel').style.display = '';
    document.getElementById('student-name').focus();
  }

  function delStudent(id) {
    const s = state.students.find(function (x) { return x.id === id; });
    if (!s) return;
    const count = state.entries.filter(function (e) { return e.studentId === id; }).length;
    const msg = count
      ? 'Schüler „' + s.name + '" und alle ' + count + ' zugehörigen Einträge löschen?'
      : 'Schüler „' + s.name + '" löschen?';
    if (!confirm(msg)) return;
    state.students = state.students.filter(function (x) { return x.id !== id; });
    state.entries = state.entries.filter(function (e) { return e.studentId !== id; });
    save();
    renderStudents();
    refreshSelects();
    renderEntries();
    toast('🗑️ Schüler gelöscht');
  }

  function resetStudentForm() {
    document.getElementById('student-form').reset();
    document.getElementById('student-id').value = '';
    document.getElementById('student-submit').textContent = 'Hinzufügen';
    document.getElementById('student-cancel').style.display = 'none';
  }

  /* ============================================================
     EINTRÄGE (Erfassung)
     ============================================================ */
  function renderEntries() {
    const wrap = document.getElementById('entries-list');
    const fStudent = document.getElementById('filter-student').value;
    const fStatus = document.getElementById('filter-status').value;
    const fPeriod = document.getElementById('filter-period').value;

    let list = filterEntries({ studentId: fStudent, status: fStatus, periodId: fPeriod });
    list.sort(function (a, b) { return b.date.localeCompare(a.date); });

    document.getElementById('entry-count').textContent =
      state.entries.length ? '· ' + list.length + ' angezeigt' : '';

    if (!state.students.length) {
      wrap.innerHTML = emptyState('🧑‍🎓', 'Lege zuerst unter „Schüler" deine Schüler an.');
      return;
    }
    if (!list.length) {
      wrap.innerHTML = emptyState('📭', 'Keine Einträge für diese Auswahl.');
      return;
    }

    const rows = list.map(function (e) {
      const st = STATUS[e.status];
      return '<tr>' +
        '<td class="nowrap">' + fmtDate(e.date) + '</td>' +
        '<td class="nowrap muted">' + WEEKDAYS[weekdayOf(e.date)] + '</td>' +
        '<td>' + esc(studentName(e.studentId)) + '</td>' +
        '<td><span class="badge ' + e.status + '"><span class="dot ' + e.status + '"></span>' + st.label + '</span></td>' +
        '<td class="num">' + num(e.lektionen || 0) + '</td>' +
        '<td>' + (e.note ? esc(e.note) : '<span class="muted">–</span>') + '</td>' +
        '<td class="num"><div class="inline-actions" style="justify-content:flex-end;">' +
          '<button class="btn btn-ghost btn-sm" data-edit-entry="' + e.id + '">✎</button>' +
          '<button class="btn btn-danger btn-sm" data-del-entry="' + e.id + '">✕</button>' +
        '</div></td></tr>';
    }).join('');

    wrap.innerHTML = '<div class="table-wrap"><table>' +
      '<thead><tr><th>Datum</th><th>Wochentag</th><th>Schüler</th><th>Status</th>' +
      '<th class="num">Lektionen</th><th>Bemerkung</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  function submitEntry(e) {
    e.preventDefault();
    const id = document.getElementById('entry-id').value;
    const date = document.getElementById('entry-date').value;
    const studentId = document.getElementById('entry-student').value;
    const status = document.getElementById('entry-status').value;
    const lektionen = parseFloat(document.getElementById('entry-lektionen').value) || 0;
    const note = document.getElementById('entry-note').value.trim();
    if (!date || !studentId) { toast('⚠️ Datum und Schüler nötig'); return; }

    if (id) {
      const en = state.entries.find(function (x) { return x.id === id; });
      if (en) { en.date = date; en.studentId = studentId; en.status = status; en.lektionen = lektionen; en.note = note; }
      toast('✅ Eintrag aktualisiert');
    } else {
      state.entries.push({ id: uid(), date: date, studentId: studentId, status: status, lektionen: lektionen, note: note });
      toast('✅ ' + WEEKDAYS[weekdayOf(date)] + ' · ' + num(lektionen) + ' Lekt. erfasst');
    }
    save();
    resetEntryForm();
    renderEntries();
  }

  function editEntry(id) {
    const en = state.entries.find(function (x) { return x.id === id; });
    if (!en) return;
    document.getElementById('entry-id').value = en.id;
    document.getElementById('entry-date').value = en.date;
    document.getElementById('entry-student').value = en.studentId;
    document.getElementById('entry-status').value = en.status;
    document.getElementById('entry-lektionen').value = en.lektionen;
    document.getElementById('entry-note').value = en.note || '';
    document.getElementById('entry-submit').textContent = 'Änderung speichern';
    document.getElementById('entry-cancel').style.display = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.getElementById('entry-date').focus();
  }

  function delEntry(id) {
    if (!confirm('Diesen Eintrag löschen?')) return;
    state.entries = state.entries.filter(function (x) { return x.id !== id; });
    save();
    renderEntries();
    toast('🗑️ Eintrag gelöscht');
  }

  function resetEntryForm() {
    const form = document.getElementById('entry-form');
    form.reset();
    document.getElementById('entry-id').value = '';
    document.getElementById('entry-lektionen').value = '1';
    document.getElementById('entry-date').value = new Date().toISOString().slice(0, 10);
    document.getElementById('entry-submit').textContent = 'Eintrag speichern';
    document.getElementById('entry-cancel').style.display = 'none';
  }

  /* ============================================================
     AUSWERTUNG pro Schüler
     ============================================================ */
  function renderStats() {
    const periodId = document.getElementById('stat-period').value;
    const list = filterEntries({ periodId: periodId });

    // Kennzahlen
    let totEnt = 0, totUnent = 0, totVer = 0, totVerLekt = 0;
    list.forEach(function (e) {
      if (e.status === 'entschuldigt') totEnt += e.lektionen || 0;
      else if (e.status === 'unentschuldigt') totUnent += e.lektionen || 0;
      else if (e.status === 'verspaetet') { totVer += 1; totVerLekt += e.lektionen || 0; }
    });
    const totAbs = totEnt + totUnent;

    document.getElementById('stat-cards').innerHTML =
      statCard('Absenzen total', num(totAbs), 'Lektionen', '') +
      statCard('Entschuldigt', num(totEnt), 'Lektionen', 'is-ok') +
      statCard('Unentschuldigt', num(totUnent), 'Lektionen', 'is-danger') +
      statCard('Verspätungen', String(totVer), totVerLekt ? num(totVerLekt) + ' Lekt.' : 'Vorkommnisse', 'is-warn');

    // Tabelle pro Schüler
    if (!state.students.length) {
      document.getElementById('stat-table').innerHTML = emptyState('🧑‍🎓', 'Noch keine Schüler angelegt.');
      return;
    }

    let sumE = 0, sumU = 0, sumV = 0, sumVL = 0;
    const rows = state.students.map(function (s) {
      const sl = list.filter(function (e) { return e.studentId === s.id; });
      let e1 = 0, u1 = 0, v1 = 0, vl = 0;
      sl.forEach(function (e) {
        if (e.status === 'entschuldigt') e1 += e.lektionen || 0;
        else if (e.status === 'unentschuldigt') u1 += e.lektionen || 0;
        else if (e.status === 'verspaetet') { v1 += 1; vl += e.lektionen || 0; }
      });
      sumE += e1; sumU += u1; sumV += v1; sumVL += vl;
      return '<tr>' +
        '<td><strong>' + esc(s.name) + '</strong>' + (s.klasse ? ' <span class="muted">(' + esc(s.klasse) + ')</span>' : '') + '</td>' +
        '<td class="num">' + num(e1) + '</td>' +
        '<td class="num">' + num(u1) + '</td>' +
        '<td class="num">' + num(e1 + u1) + '</td>' +
        '<td class="num">' + (v1 || '<span class="muted">–</span>') + '</td>' +
        '</tr>';
    }).join('');

    const totalRow = '<tr class="row-total"><td>Total</td>' +
      '<td class="num">' + num(sumE) + '</td>' +
      '<td class="num">' + num(sumU) + '</td>' +
      '<td class="num">' + num(sumE + sumU) + '</td>' +
      '<td class="num">' + (sumV || '–') + '</td></tr>';

    document.getElementById('stat-table').innerHTML = '<div class="table-wrap"><table>' +
      '<thead><tr><th>Schüler</th><th class="num">Entsch.</th><th class="num">Unentsch.</th>' +
      '<th class="num">Absenz total</th><th class="num">Verspätungen</th></tr></thead>' +
      '<tbody>' + rows + totalRow + '</tbody></table></div>';
  }

  /* ============================================================
     WOCHENTAG-AUSWERTUNG (Moyenne)
     ============================================================ */
  function statusMatch(entry, mode) {
    if (mode === 'alle') return true;
    if (mode === 'absenz') return STATUS[entry.status].isAbsence;
    return entry.status === mode;
  }

  function renderWeekday() {
    const periodId = document.getElementById('wt-period').value;
    const studentId = document.getElementById('wt-student').value;
    const mode = document.getElementById('wt-status').value;

    const base = filterEntries({ periodId: periodId }); // alle Schüler (für Tag-Zählung)
    const scoped = base.filter(function (e) {
      return (!studentId || e.studentId === studentId) && statusMatch(e, mode);
    });

    // Pro Wochentag: distinct Daten (egal welcher Schüler) = Nenner; Summe Lektionen (scoped) = Zähler
    const datesByWd = {};   // wd -> Set(dates) aus ALLEN gefilterten Einträgen
    base.forEach(function (e) {
      const wd = weekdayOf(e.date);
      (datesByWd[wd] = datesByWd[wd] || new Set()).add(e.date);
    });
    const sumByWd = {};     // wd -> Summe Lektionen (scoped)
    const cntByWd = {};     // wd -> Anzahl Einträge (scoped)
    scoped.forEach(function (e) {
      const wd = weekdayOf(e.date);
      sumByWd[wd] = (sumByWd[wd] || 0) + (e.lektionen || 0);
      cntByWd[wd] = (cntByWd[wd] || 0) + 1;
    });

    // Kennzahlen: höchster Durchschnitt
    let best = null;
    WEEKDAY_ORDER.forEach(function (wd) {
      const days = datesByWd[wd] ? datesByWd[wd].size : 0;
      if (!days) return;
      const avg = (sumByWd[wd] || 0) / days;
      if (!best || avg > best.avg) best = { wd: wd, avg: avg, days: days };
    });
    const totalScoped = scoped.reduce(function (a, e) { return a + (e.lektionen || 0); }, 0);
    const totalDays = Object.keys(datesByWd).reduce(function (a, wd) { return a + datesByWd[wd].size; }, 0);

    document.getElementById('wt-cards').innerHTML =
      statCard('Summe Lektionen', num(totalScoped), 'in der Auswahl', '') +
      statCard('Erfasste Tage', String(totalDays), 'verschiedene Daten', '') +
      statCard('Spitzen-Wochentag',
        best ? WEEKDAYS[best.wd] : '–',
        best ? 'Ø ' + num(best.avg) + ' Lekt./Tag' : 'keine Daten',
        best ? 'is-danger' : '');

    // Tabelle je Wochentag
    let rows = '';
    let anyData = false;
    WEEKDAY_ORDER.forEach(function (wd) {
      const days = datesByWd[wd] ? datesByWd[wd].size : 0;
      const sum = sumByWd[wd] || 0;
      const cnt = cntByWd[wd] || 0;
      if (!days && !sum) return;
      anyData = true;
      const avg = days ? sum / days : 0;
      rows += '<tr>' +
        '<td><strong>' + WEEKDAYS[wd] + '</strong></td>' +
        '<td class="num">' + days + '</td>' +
        '<td class="num">' + num(sum) + '</td>' +
        '<td class="num">' + cnt + '</td>' +
        '<td class="num"><strong>' + num(avg) + '</strong></td>' +
        '</tr>';
    });

    if (!anyData) {
      document.getElementById('wt-table').innerHTML = emptyState('📅', 'Noch keine Einträge für diese Auswahl.');
      document.getElementById('wt-matrix').innerHTML = '';
      return;
    }

    document.getElementById('wt-table').innerHTML = '<div class="table-wrap"><table>' +
      '<thead><tr><th>Wochentag</th><th class="num">Erfasste Tage</th><th class="num">Summe Lekt.</th>' +
      '<th class="num">Einträge</th><th class="num">Ø Lekt./Tag</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';

    renderWeekdayMatrix(base, mode, datesByWd);
  }

  // Matrix: Schüler × Wochentag, Wert = Ø Lektionen pro erfasstem Tag dieses Wochentags
  function renderWeekdayMatrix(base, mode, datesByWd) {
    const activeWds = WEEKDAY_ORDER.filter(function (wd) { return datesByWd[wd] && datesByWd[wd].size; });
    if (!activeWds.length || !state.students.length) {
      document.getElementById('wt-matrix').innerHTML = emptyState('🔢', 'Nicht genug Daten für die Matrix.');
      return;
    }

    let head = '<tr><th>Schüler</th>';
    activeWds.forEach(function (wd) {
      head += '<th class="num">' + WEEKDAYS[wd].slice(0, 2) + '<br><span class="muted" style="font-weight:400;">' + datesByWd[wd].size + ' Tg</span></th>';
    });
    head += '</tr>';

    let body = '';
    state.students.forEach(function (s) {
      let row = '<td><strong>' + esc(s.name) + '</strong></td>';
      activeWds.forEach(function (wd) {
        const sum = base.filter(function (e) {
          return e.studentId === s.id && weekdayOf(e.date) === wd && statusMatch(e, mode);
        }).reduce(function (a, e) { return a + (e.lektionen || 0); }, 0);
        const days = datesByWd[wd].size;
        const avg = days ? sum / days : 0;
        const heat = avg === 0 ? 'heat-0' : avg < 0.5 ? 'heat-1' : avg < 1 ? 'heat-2' : avg < 2 ? 'heat-3' : 'heat-4';
        row += '<td class="num ' + heat + '">' + (avg ? num(avg) : '·') + '</td>';
      });
      body += '<tr>' + row + '</tr>';
    });

    document.getElementById('wt-matrix').innerHTML = '<div class="table-wrap"><table>' +
      '<thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
      '<p class="muted" style="margin-top:0.625rem; font-size:0.75rem;">Ø = Summe Lektionen ÷ Anzahl erfasster Tage dieses Wochentags. Dunklere Felder = höhere durchschnittliche Absenz.</p>';
  }

  /* ============================================================
     PERIODEN
     ============================================================ */
  function renderPeriods() {
    const wrap = document.getElementById('periods-list');
    if (!state.periods.length) {
      wrap.innerHTML = emptyState('🗓️', 'Noch keine Perioden. Tipp: „Vorlage Schuljahr einfügen".');
      return;
    }
    const sorted = state.periods.slice().sort(function (a, b) { return a.start.localeCompare(b.start); });
    const rows = sorted.map(function (p) {
      const cnt = state.entries.filter(function (e) { return e.date >= p.start && e.date <= p.end; }).length;
      return '<tr>' +
        '<td><strong>' + esc(p.name) + '</strong></td>' +
        '<td><span class="badge ' + (p.type === 'semester' ? 'entschuldigt' : 'verspaetet') + '">' + (p.type === 'semester' ? 'Semester' : 'Trimester') + '</span></td>' +
        '<td class="nowrap">' + fmtDate(p.start) + ' – ' + fmtDate(p.end) + '</td>' +
        '<td class="num">' + cnt + '</td>' +
        '<td class="num"><div class="inline-actions" style="justify-content:flex-end;">' +
          '<button class="btn btn-ghost btn-sm" data-edit-period="' + p.id + '">Bearbeiten</button>' +
          '<button class="btn btn-danger btn-sm" data-del-period="' + p.id + '">Löschen</button>' +
        '</div></td></tr>';
    }).join('');
    wrap.innerHTML = '<div class="table-wrap"><table>' +
      '<thead><tr><th>Bezeichnung</th><th>Typ</th><th>Zeitraum</th><th class="num">Einträge</th><th></th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div>';
  }

  function submitPeriod(e) {
    e.preventDefault();
    const id = document.getElementById('period-id').value;
    const name = document.getElementById('period-name').value.trim();
    const type = document.getElementById('period-type').value;
    const start = document.getElementById('period-start').value;
    const end = document.getElementById('period-end').value;
    if (!name || !start || !end) return;
    if (end < start) { toast('⚠️ „Bis" liegt vor „Von"'); return; }
    if (id) {
      const p = state.periods.find(function (x) { return x.id === id; });
      if (p) { p.name = name; p.type = type; p.start = start; p.end = end; }
      toast('✅ Periode aktualisiert');
    } else {
      state.periods.push({ id: uid(), name: name, type: type, start: start, end: end });
      toast('✅ Periode hinzugefügt');
    }
    save();
    resetPeriodForm();
    renderPeriods();
    refreshSelects();
  }

  function editPeriod(id) {
    const p = state.periods.find(function (x) { return x.id === id; });
    if (!p) return;
    document.getElementById('period-id').value = p.id;
    document.getElementById('period-name').value = p.name;
    document.getElementById('period-type').value = p.type;
    document.getElementById('period-start').value = p.start;
    document.getElementById('period-end').value = p.end;
    document.getElementById('period-submit').textContent = 'Speichern';
    document.getElementById('period-cancel').style.display = '';
    document.getElementById('period-name').focus();
  }

  function delPeriod(id) {
    const p = state.periods.find(function (x) { return x.id === id; });
    if (!p || !confirm('Periode „' + p.name + '" löschen? (Einträge bleiben erhalten.)')) return;
    state.periods = state.periods.filter(function (x) { return x.id !== id; });
    save();
    renderPeriods();
    refreshSelects();
    toast('🗑️ Periode gelöscht');
  }

  function resetPeriodForm() {
    document.getElementById('period-form').reset();
    document.getElementById('period-id').value = '';
    document.getElementById('period-submit').textContent = 'Hinzufügen';
    document.getElementById('period-cancel').style.display = 'none';
  }

  function insertPresets() {
    // Schweizer Schuljahr-Logik: startet im August. Aktuelles Schuljahr ableiten.
    const now = new Date();
    const y = now.getMonth() >= 7 ? now.getFullYear() : now.getFullYear() - 1;
    const presets = [
      { name: '1. Semester ' + y + '/' + (y + 1), type: 'semester', start: y + '-08-01', end: (y + 1) + '-01-31' },
      { name: '2. Semester ' + y + '/' + (y + 1), type: 'semester', start: (y + 1) + '-02-01', end: (y + 1) + '-07-31' },
      { name: '1. Trimester ' + y + '/' + (y + 1), type: 'trimester', start: y + '-08-01', end: y + '-11-30' },
      { name: '2. Trimester ' + y + '/' + (y + 1), type: 'trimester', start: y + '-12-01', end: (y + 1) + '-03-31' },
      { name: '3. Trimester ' + y + '/' + (y + 1), type: 'trimester', start: (y + 1) + '-04-01', end: (y + 1) + '-07-31' },
    ];
    let added = 0;
    presets.forEach(function (pr) {
      if (!state.periods.some(function (p) { return p.name === pr.name; })) {
        state.periods.push({ id: uid(), name: pr.name, type: pr.type, start: pr.start, end: pr.end });
        added++;
      }
    });
    save();
    renderPeriods();
    refreshSelects();
    toast(added ? '✅ ' + added + ' Perioden eingefügt' : 'Perioden existieren bereits');
  }

  /* ============================================================
     DATEN: Export / Import / Reset
     ============================================================ */
  function download(filename, content, type) {
    const blob = new Blob([content], { type: type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  function exportJSON() {
    const stamp = new Date().toISOString().slice(0, 10);
    download('anwesenheit-backup-' + stamp + '.json',
      JSON.stringify(Object.assign({ _version: 1, _exported: new Date().toISOString() }, state), null, 2),
      'application/json');
    toast('⬇️ Backup exportiert');
  }

  function csvCell(v) {
    const s = String(v == null ? '' : v);
    return /[";\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  function exportCSV(entries, filename) {
    const header = ['Datum', 'Wochentag', 'Schueler', 'Klasse', 'Status', 'Lektionen', 'Bemerkung'];
    const lines = [header.join(';')];
    entries.slice().sort(function (a, b) { return a.date.localeCompare(b.date); }).forEach(function (e) {
      const s = state.students.find(function (x) { return x.id === e.studentId; });
      lines.push([
        e.date,
        WEEKDAYS[weekdayOf(e.date)],
        s ? s.name : '(gelöscht)',
        s ? (s.klasse || '') : '',
        STATUS[e.status].label,
        String(e.lektionen || 0).replace('.', ','),
        e.note || '',
      ].map(csvCell).join(';'));
    });
    // BOM für korrekte Umlaute in Excel
    download(filename, '﻿' + lines.join('\r\n'), 'text/csv;charset=utf-8');
    toast('⬇️ CSV exportiert');
  }

  function importJSON(file) {
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const data = JSON.parse(reader.result);
        if (!data || !Array.isArray(data.students)) throw new Error('Ungültiges Format');
        if (!confirm('Backup importieren? Die aktuellen Daten werden ersetzt.')) return;
        state.students = data.students || [];
        state.periods = Array.isArray(data.periods) ? data.periods : [];
        state.entries = Array.isArray(data.entries) ? data.entries : [];
        save();
        renderAll();
        toast('✅ Backup importiert');
      } catch (err) {
        toast('⚠️ Datei konnte nicht gelesen werden');
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  function resetAll() {
    if (!confirm('Wirklich ALLE Daten löschen? Das kann nicht rückgängig gemacht werden.')) return;
    if (!confirm('Letzte Warnung: Schüler, Einträge und Perioden werden gelöscht.')) return;
    state = { students: [], periods: [], entries: [] };
    save();
    renderAll();
    toast('🗑️ Alle Daten gelöscht');
  }

  /* ============================================================
     PDF-BERICHT  (sauberes Dokument, offline via "Als PDF speichern")
     ============================================================ */
  function buildReportHTML(periodId) {
    const period = state.periods.find(function (x) { return x.id === periodId; });
    const periodLabel = period ? period.name + ' (' + fmtDate(period.start) + ' – ' + fmtDate(period.end) + ')' : 'Ganzes Schuljahr';
    const list = filterEntries({ periodId: periodId });
    const today = new Date().toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' });

    // Totale
    let gE = 0, gU = 0, gV = 0;
    list.forEach(function (e) {
      if (e.status === 'entschuldigt') gE += e.lektionen || 0;
      else if (e.status === 'unentschuldigt') gU += e.lektionen || 0;
      else if (e.status === 'verspaetet') gV += 1;
    });

    // Schüler-Tabelle
    let sRows = '';
    state.students.forEach(function (s) {
      const sl = list.filter(function (e) { return e.studentId === s.id; });
      let e1 = 0, u1 = 0, v1 = 0;
      sl.forEach(function (e) {
        if (e.status === 'entschuldigt') e1 += e.lektionen || 0;
        else if (e.status === 'unentschuldigt') u1 += e.lektionen || 0;
        else if (e.status === 'verspaetet') v1 += 1;
      });
      sRows += '<tr><td>' + esc(s.name) + (s.klasse ? ' <span class="k">(' + esc(s.klasse) + ')</span>' : '') + '</td>' +
        '<td class="n">' + num(e1) + '</td><td class="n">' + num(u1) + '</td>' +
        '<td class="n b">' + num(e1 + u1) + '</td><td class="n">' + (v1 || '–') + '</td></tr>';
    });
    if (!sRows) sRows = '<tr><td colspan="5" class="muted">Keine Schüler erfasst.</td></tr>';

    // Wochentag-Tabelle (Absenzen)
    const datesByWd = {}, sumByWd = {};
    list.forEach(function (e) {
      const wd = weekdayOf(e.date);
      (datesByWd[wd] = datesByWd[wd] || new Set()).add(e.date);
      if (STATUS[e.status].isAbsence) sumByWd[wd] = (sumByWd[wd] || 0) + (e.lektionen || 0);
    });
    let wRows = '';
    WEEKDAY_ORDER.forEach(function (wd) {
      if (!datesByWd[wd]) return;
      const days = datesByWd[wd].size, sum = sumByWd[wd] || 0;
      wRows += '<tr><td>' + WEEKDAYS[wd] + '</td><td class="n">' + days + '</td>' +
        '<td class="n">' + num(sum) + '</td><td class="n b">' + num(days ? sum / days : 0) + '</td></tr>';
    });
    if (!wRows) wRows = '<tr><td colspan="4" class="muted">Keine Einträge.</td></tr>';

    return '<!DOCTYPE html><html lang="de"><head><meta charset="UTF-8">' +
      '<title>Absenzen-Bericht ' + esc(periodLabel) + '</title><style>' +
      '@page{margin:18mm 16mm;}' +
      '*{box-sizing:border-box;margin:0;padding:0;}' +
      'body{font-family:-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:#1A1A2E;font-size:12px;line-height:1.45;}' +
      '.head{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #6C5CE7;padding-bottom:12px;margin-bottom:18px;}' +
      '.head h1{font-size:20px;letter-spacing:-0.02em;}' +
      '.head .sub{color:#6C6C8A;font-size:12px;margin-top:3px;}' +
      '.head .meta{text-align:right;font-size:11px;color:#6C6C8A;}' +
      '.cards{display:flex;gap:10px;margin-bottom:18px;}' +
      '.c{flex:1;border:1px solid #E8E8F0;border-radius:8px;padding:10px 12px;}' +
      '.c .l{font-size:9px;text-transform:uppercase;letter-spacing:0.05em;color:#9D9DB5;font-weight:700;}' +
      '.c .v{font-size:22px;font-weight:800;margin-top:2px;}' +
      '.c.u .v{color:#C0392B;}.c.e .v{color:#00B894;}.c.v2 .v{color:#B57E14;}' +
      'h2{font-size:13px;margin:18px 0 8px;color:#5A4BD1;}' +
      'table{width:100%;border-collapse:collapse;font-size:11.5px;}' +
      'th{background:#F3F1FE;text-align:left;padding:7px 9px;font-size:9px;text-transform:uppercase;letter-spacing:0.04em;color:#4A4A68;border-bottom:1px solid #E8E8F0;}' +
      'td{padding:6px 9px;border-bottom:1px solid #F0F0F6;}' +
      'td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;}' +
      'td.b{font-weight:700;}.k{color:#9D9DB5;font-weight:400;}.muted{color:#9D9DB5;text-align:center;}' +
      'tr:last-child td{border-bottom:none;}' +
      '.foot{margin-top:24px;padding-top:10px;border-top:1px solid #E8E8F0;font-size:10px;color:#9D9DB5;}' +
      '</style></head><body>' +
      '<div class="head"><div><h1>Absenzen-Bericht</h1><div class="sub">' + esc(periodLabel) + '</div></div>' +
      '<div class="meta">Erstellt am ' + today + '<br>' + state.students.length + ' Schüler · ' + list.length + ' Einträge</div></div>' +
      '<div class="cards">' +
      '<div class="c"><div class="l">Absenzen total</div><div class="v">' + num(gE + gU) + '</div></div>' +
      '<div class="c e"><div class="l">Entschuldigt</div><div class="v">' + num(gE) + '</div></div>' +
      '<div class="c u"><div class="l">Unentschuldigt</div><div class="v">' + num(gU) + '</div></div>' +
      '<div class="c v2"><div class="l">Verspätungen</div><div class="v">' + gV + '</div></div>' +
      '</div>' +
      '<h2>Absenzen je Schüler (Lektionen)</h2>' +
      '<table><thead><tr><th>Schüler</th><th class="n">Entsch.</th><th class="n">Unentsch.</th><th class="n">Total</th><th class="n">Verspät.</th></tr></thead><tbody>' + sRows + '</tbody></table>' +
      '<h2>Durchschnitt Absenz-Lektionen je Wochentag</h2>' +
      '<table><thead><tr><th>Wochentag</th><th class="n">Erfasste Tage</th><th class="n">Summe Lekt.</th><th class="n">Ø pro Tag</th></tr></thead><tbody>' + wRows + '</tbody></table>' +
      '<div class="foot">Anwesenheits-Tool · Bericht automatisch generiert. Angaben ohne Gewähr.</div>' +
      '</body></html>';
  }

  function generatePDF() {
    const periodId = document.getElementById('stat-period').value;
    const html = buildReportHTML(periodId);
    const win = window.open('', '_blank');
    if (!win) { toast('⚠️ Bitte Pop-ups erlauben'); return; }
    win.document.open();
    win.document.write(html);
    win.document.close();
    // Nach dem Laden Druckdialog öffnen → "Als PDF speichern"
    win.focus();
    setTimeout(function () { win.print(); }, 350);
    toast('📄 Wähle im Dialog „Als PDF speichern"');
  }

  /* ---------------- UI Bausteine ---------------- */
  function emptyState(icon, text) {
    return '<div class="empty"><div class="icon">' + icon + '</div><p>' + esc(text) + '</p></div>';
  }
  function statCard(label, value, sub, cls) {
    return '<div class="stat ' + (cls || '') + '">' +
      '<div class="label">' + esc(label) + '</div>' +
      '<div class="value">' + value + '</div>' +
      '<div class="sub">' + esc(sub) + '</div></div>';
  }

  function renderAll() {
    refreshSelects();
    renderStudents();
    renderEntries();
    renderPeriods();
    renderStats();
    renderWeekday();
  }

  /* ---------------- Event-Wiring ---------------- */
  function init() {
    load();

    // Tabs
    document.querySelectorAll('.tab').forEach(function (t) {
      t.addEventListener('click', function () { showView(t.dataset.view); });
    });

    // Formulare
    document.getElementById('student-form').addEventListener('submit', submitStudent);
    document.getElementById('student-cancel').addEventListener('click', resetStudentForm);
    document.getElementById('entry-form').addEventListener('submit', submitEntry);
    document.getElementById('entry-cancel').addEventListener('click', resetEntryForm);
    document.getElementById('period-form').addEventListener('submit', submitPeriod);
    document.getElementById('period-cancel').addEventListener('click', resetPeriodForm);
    document.getElementById('period-presets').addEventListener('click', insertPresets);

    // Filter-Änderungen
    ['filter-student', 'filter-status', 'filter-period'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', renderEntries);
    });
    document.getElementById('stat-period').addEventListener('change', renderStats);
    ['wt-period', 'wt-student', 'wt-status'].forEach(function (id) {
      document.getElementById(id).addEventListener('change', renderWeekday);
    });

    // Daten-Aktionen
    document.getElementById('export-json').addEventListener('click', exportJSON);
    document.getElementById('export-all-csv').addEventListener('click', function () {
      exportCSV(state.entries, 'anwesenheit-eintraege-' + new Date().toISOString().slice(0, 10) + '.csv');
    });
    document.getElementById('stat-export-csv').addEventListener('click', function () {
      const periodId = document.getElementById('stat-period').value;
      exportCSV(filterEntries({ periodId: periodId }), 'anwesenheit-auswertung-' + new Date().toISOString().slice(0, 10) + '.csv');
    });
    document.getElementById('stat-pdf').addEventListener('click', generatePDF);
    document.getElementById('daten-pdf').addEventListener('click', generatePDF);
    document.getElementById('import-json').addEventListener('change', function (ev) {
      if (ev.target.files[0]) importJSON(ev.target.files[0]);
      ev.target.value = '';
    });
    document.getElementById('reset-all').addEventListener('click', resetAll);

    // Event-Delegation für dynamische Buttons
    document.body.addEventListener('click', function (ev) {
      const t = ev.target.closest('button');
      if (!t) return;
      if (t.dataset.editStudent) editStudent(t.dataset.editStudent);
      else if (t.dataset.delStudent) delStudent(t.dataset.delStudent);
      else if (t.dataset.editEntry) editEntry(t.dataset.editEntry);
      else if (t.dataset.delEntry) delEntry(t.dataset.delEntry);
      else if (t.dataset.editPeriod) editPeriod(t.dataset.editPeriod);
      else if (t.dataset.delPeriod) delPeriod(t.dataset.delPeriod);
    });

    // Standardwerte
    document.getElementById('entry-date').value = new Date().toISOString().slice(0, 10);

    // Speicher-Warnung anzeigen, falls localStorage nicht verfügbar (z.B. privater Modus)
    if (!storageAvailable()) {
      document.getElementById('storage-status-card').style.display = '';
    }

    // Vor dem Schliessen warnen, falls ungespeicherte Datenlage (zusätzliche Sicherheit)
    window.addEventListener('beforeunload', function () { save(); });

    renderAll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
