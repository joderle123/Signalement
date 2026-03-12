/* ============================================
   Main Application Logic
   Signalement Generator - CDSE Annexe Junglinster
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize components
    const formHandler = new FormHandler();
    const wordGenerator = new WordGenerator();

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    const signatureDate = document.getElementById('signatureDate');
    if (signatureDate && !signatureDate.value) {
        signatureDate.value = today;
    }

    // Current school year
    const schoolYear = document.getElementById('schoolYear');
    if (schoolYear && !schoolYear.value) {
        const now = new Date();
        const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
        schoolYear.value = `${year}-${year + 1}`;
    }

    // Build initial questionnaire
    buildQuestionnaire(i18n.getLang());
    i18n.applyTranslations();

    // ========================
    // Language Toggle
    // ========================
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Save current form state before rebuilding
            const currentData = formHandler.collectData();

            i18n.setLanguage(lang);
            buildQuestionnaire(lang);

            // Restore data after rebuild
            formHandler.restoreFromDraft(currentData);

            updateProgress();
        });
    });

    // ========================
    // Progress Bar
    // ========================
    const progressSteps = document.getElementById('progressSteps');
    const progressFill = document.getElementById('progressFill');
    const sections = document.querySelectorAll('.form-section');

    function buildProgressSteps() {
        progressSteps.innerHTML = '';
        for (let i = 1; i <= sections.length; i++) {
            const step = document.createElement('span');
            step.className = 'progress-step';
            step.dataset.section = i;
            step.textContent = i18n.t(`section_short_${i}`);
            step.addEventListener('click', () => {
                const target = document.querySelector(`[data-section="${i}"]`);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
            progressSteps.appendChild(step);
        }
    }

    function updateProgress() {
        const pct = formHandler.getCompletionPercentage();
        progressFill.style.width = `${pct}%`;

        // Update step highlights based on scroll position
        const scrollPos = window.scrollY + 200;
        document.querySelectorAll('.progress-step').forEach(step => {
            const sectionNum = step.dataset.section;
            const section = document.querySelector(`[data-section="${sectionNum}"]`);
            if (section) {
                const top = section.offsetTop;
                const bottom = top + section.offsetHeight;
                step.classList.toggle('active', scrollPos >= top && scrollPos < bottom);
            }
        });
    }

    buildProgressSteps();
    i18n.onLanguageChange(() => buildProgressSteps());

    // Listen for form changes to update progress
    document.getElementById('signalementForm').addEventListener('input', updateProgress);
    document.getElementById('signalementForm').addEventListener('change', updateProgress);
    window.addEventListener('scroll', updateProgress);

    // ========================
    // Signature Canvas
    // ========================
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const displayWidth = rect.width - 16;
        canvas.style.width = displayWidth + 'px';
        canvas.style.height = '150px';
        canvas.width = displayWidth * dpr;
        canvas.height = 150 * dpr;
        ctx.scale(dpr, dpr);
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function getCanvasPos(e) {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    }

    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        const pos = getCanvasPos(e);
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        const pos = getCanvasPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseleave', () => isDrawing = false);

    // Touch events
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDrawing = true;
        const pos = getCanvasPos(e);
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (!isDrawing) return;
        const pos = getCanvasPos(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
        lastX = pos.x;
        lastY = pos.y;
    });

    canvas.addEventListener('touchend', () => isDrawing = false);

    document.getElementById('btnClearSignature').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // ========================
    // Toast Notifications
    // ========================
    function showToast(message, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show' + (type ? ` ${type}` : '');
        setTimeout(() => {
            toast.className = 'toast';
        }, 3000);
    }

    // ========================
    // Export Word
    // ========================
    async function exportWord() {
        try {
            showToast(i18n.t('btn_export') + '...', '');
            const data = formHandler.collectData();
            const filename = await wordGenerator.generate(data);
            showToast(`${i18n.t('msg_exported')}: ${filename}`, 'success');
        } catch (err) {
            console.error('Export error:', err);
            showToast(i18n.t('msg_export_error') + ': ' + err.message, 'error');
        }
    }

    document.getElementById('btnExportPDF').addEventListener('click', exportWord);
    document.getElementById('btnExportPDFBottom').addEventListener('click', exportWord);
    document.getElementById('btnExportFromPreview')?.addEventListener('click', () => {
        closePreview();
        exportWord();
    });

    // ========================
    // Save / Load Draft
    // ========================
    document.getElementById('btnSaveDraft').addEventListener('click', () => {
        if (formHandler.saveDraft()) {
            showToast(i18n.t('msg_saved'), 'success');
        }
    });

    document.getElementById('btnLoadDraft').addEventListener('click', () => {
        const draft = formHandler.loadDraft();
        if (draft) {
            formHandler.restoreFromDraft(draft);
            showToast(i18n.t('msg_loaded'), 'success');
            updateProgress();
        } else {
            showToast(i18n.t('msg_no_draft'), 'warning');
        }
    });

    // ========================
    // Reset Form
    // ========================
    document.getElementById('btnReset').addEventListener('click', () => {
        if (confirm(i18n.t('msg_reset_confirm'))) {
            formHandler.resetForm();
            buildQuestionnaire(i18n.getLang());
            updateProgress();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            showToast(i18n.t('btn_reset'), 'success');
        }
    });

    // ========================
    // Preview Modal
    // ========================
    const previewModal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');

    function openPreview() {
        const data = formHandler.collectData();
        const lang = data.language || 'fr';
        const t = (key) => i18n.t(key);
        const qData = questionnaireData;

        const formatDate = (dateStr) => {
            if (!dateStr) return '—';
            try {
                const d = new Date(dateStr);
                return d.toLocaleDateString(lang === 'fr' ? 'fr-LU' : 'de-LU');
            } catch { return dateStr; }
        };

        const levelText = (val) => {
            const key = `level_${val}`;
            return val ? t(key) : '—';
        };

        const ratingLabel = (val) => {
            if (!val || val === 'na') return '<span style="color:#9ca3af">N/A</span>';
            const colors = { '1': '#dc2626', '2': '#d97706', '3': '#ca8a04', '4': '#059669', '5': '#16a34a' };
            const labels = { '1': t('rating_1'), '2': t('rating_2'), '3': t('rating_3'), '4': t('rating_4'), '5': t('rating_5') };
            return `<span style="color:${colors[val]};font-weight:600">${labels[val]}</span>`;
        };

        let html = `<div class="preview-document">`;

        // Header
        html += `
            <div class="preview-header">
                <h1>${t('doc_title')}</h1>
                <p>${t('doc_subtitle')} — ${t('doc_annexe')}</p>
                <p style="color:#dc2626;font-weight:bold;margin-top:8px;">${t('doc_confidential')}</p>
            </div>`;

        // Section 1: Student
        html += `<div class="preview-section"><h3>1. ${t('section_student')}</h3>`;
        html += `<div class="preview-field"><span class="label">${t('label_lastname')}:</span><span class="value">${data.studentLastName || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_firstname')}:</span><span class="value">${data.studentFirstName || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_dob')}:</span><span class="value">${formatDate(data.studentDOB)}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_class')}:</span><span class="value">${data.studentClass || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_school')}:</span><span class="value">${data.studentSchool || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_school_year')}:</span><span class="value">${data.schoolYear || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_teacher')}:</span><span class="value">${data.classTeacher || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_nationality')}:</span><span class="value">${data.studentNationality || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_home_language')}:</span><span class="value">${data.homeLanguage || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_lux_level')}:</span><span class="value">${levelText(data.luxembourgishLevel)}</span></div>`;
        html += `</div>`;

        // Section 2: Parents
        html += `<div class="preview-section"><h3>2. ${t('section_parents')}</h3>`;
        html += `<p style="font-weight:600;margin:8px 0 4px">${t('label_parent1')}</p>`;
        html += `<div class="preview-field"><span class="label">${t('label_name')}:</span><span class="value">${data.parent1Name || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_phone')}:</span><span class="value">${data.parent1Phone || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_email')}:</span><span class="value">${data.parent1Email || '—'}</span></div>`;
        html += `<p style="font-weight:600;margin:8px 0 4px">${t('label_parent2')}</p>`;
        html += `<div class="preview-field"><span class="label">${t('label_name')}:</span><span class="value">${data.parent2Name || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_phone')}:</span><span class="value">${data.parent2Phone || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_email')}:</span><span class="value">${data.parent2Email || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_address')}:</span><span class="value">${data.parentAddress || '—'}</span></div>`;
        html += `</div>`;

        // Section 3: Motifs
        html += `<div class="preview-section"><h3>3. ${t('section_motif')}</h3>`;
        const allMotifs = qData.motifs[lang];
        const checkedMotifs = data.motifs || [];
        allMotifs.forEach(m => {
            const checked = checkedMotifs.includes(m);
            html += `<div style="margin:2px 0">${checked ? '☑' : '☐'} ${m}</div>`;
        });
        if (data.motifOther) {
            html += `<div class="preview-field" style="margin-top:8px"><span class="label">${t('label_other_motif')}:</span><span class="value">${data.motifOther}</span></div>`;
        }
        html += `</div>`;

        // Rating sections
        const ratingSections = [
            { num: 4, key: 'learning', title: t('section_learning'), data: data.learningRatings, comments: data.learningComments },
            { num: 5, key: 'social', title: t('section_social'), data: data.socialRatings, comments: data.socialComments },
            { num: 6, key: 'language', title: t('section_language'), data: data.languageRatings, comments: data.languageComments },
            { num: 7, key: 'motor', title: t('section_motor'), data: data.motorRatings, comments: data.motorComments },
        ];

        ratingSections.forEach(s => {
            html += `<div class="preview-section"><h3>${s.num}. ${s.title}</h3>`;
            const categories = qData[s.key][lang];
            categories.forEach(cat => {
                html += `<p style="font-weight:600;color:#1a56db;margin:8px 0 4px">${cat.category}</p>`;
                cat.items.forEach(item => {
                    const val = s.data ? s.data[item] : null;
                    html += `<div class="preview-field"><span class="label">${item}:</span><span class="value">${ratingLabel(val)}</span></div>`;
                });
            });
            if (s.comments) {
                html += `<div class="preview-field" style="margin-top:8px"><span class="label">${t(`label_${s.key}_comments`)}:</span><span class="value">${s.comments}</span></div>`;
            }
            html += `</div>`;
        });

        // Section 8: Measures
        html += `<div class="preview-section"><h3>8. ${t('section_measures')}</h3>`;
        const allMeasures = qData.measures[lang];
        const checkedMeasures = data.measures || [];
        allMeasures.forEach(m => {
            const checked = checkedMeasures.includes(m);
            html += `<div style="margin:2px 0">${checked ? '☑' : '☐'} ${m}</div>`;
        });
        if (data.measuresDetails) {
            html += `<div class="preview-field" style="margin-top:8px"><span class="label">${t('label_measures_details')}:</span><span class="value">${data.measuresDetails}</span></div>`;
        }
        if (data.measuresEffect) {
            html += `<div class="preview-field"><span class="label">${t('label_measures_effect')}:</span><span class="value">${data.measuresEffect}</span></div>`;
        }
        html += `</div>`;

        // Section 9: Observations
        html += `<div class="preview-section"><h3>9. ${t('section_observations')}</h3>`;
        if (data.teacherObservations) {
            html += `<div class="preview-field"><span class="label">${t('label_teacher_obs')}:</span></div>`;
            html += `<p style="margin:4px 0 8px;white-space:pre-wrap">${data.teacherObservations}</p>`;
        }
        if (data.recommendations) {
            html += `<div class="preview-field"><span class="label">${t('label_recommendations')}:</span></div>`;
            html += `<p style="margin:4px 0 8px;white-space:pre-wrap">${data.recommendations}</p>`;
        }
        if (data.additionalInfo) {
            html += `<div class="preview-field"><span class="label">${t('label_additional')}:</span></div>`;
            html += `<p style="margin:4px 0 8px;white-space:pre-wrap">${data.additionalInfo}</p>`;
        }
        html += `</div>`;

        // Section 10: Signature
        html += `<div class="preview-section"><h3>10. ${t('section_signature')}</h3>`;
        html += `<div class="preview-field"><span class="label">${t('label_date')}:</span><span class="value">${formatDate(data.signatureDate)}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_place')}:</span><span class="value">${data.signaturePlace || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_signatory')}:</span><span class="value">${data.signatureName || '—'}</span></div>`;
        html += `<div class="preview-field"><span class="label">${t('label_signatory_role')}:</span><span class="value">${data.signatoryRole || '—'}</span></div>`;
        html += `<div style="margin-top:16px;border-bottom:2px solid #111;width:300px;height:60px"></div>`;
        html += `<p style="font-size:11px;color:#6b7280;margin-top:4px">${t('doc_signature_line')}</p>`;
        html += `</div>`;

        html += `</div>`;

        previewContent.innerHTML = html;
        previewModal.classList.add('active');
    }

    function closePreview() {
        previewModal.classList.remove('active');
    }

    document.getElementById('btnPreview').addEventListener('click', openPreview);
    document.getElementById('btnClosePreview').addEventListener('click', closePreview);
    document.getElementById('btnClosePreviewBottom').addEventListener('click', closePreview);

    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) closePreview();
    });

    // ESC to close modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closePreview();
    });

    // ========================
    // Section collapse/expand
    // ========================
    document.querySelectorAll('.section-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            if (body && body.classList.contains('section-body')) {
                body.style.display = body.style.display === 'none' ? 'block' : 'none';
            }
        });
    });

    // Initial progress
    updateProgress();

    // Auto-save on unload
    window.addEventListener('beforeunload', () => {
        formHandler.saveDraft();
    });
});
