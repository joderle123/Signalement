/* ============================================
   Main Application Logic
   Signalement MiTe - CDSE Annexe Junglinster
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const formHandler = new FormHandler();
    const wordGenerator = new WordGenerator();

    // Set today's date
    const today = new Date().toISOString().split('T')[0];
    const signatureDate = document.getElementById('signatureDate');
    if (signatureDate && !signatureDate.value) signatureDate.value = today;

    // Current school year
    const schoolYear = document.getElementById('schoolYear');
    if (schoolYear && !schoolYear.value) {
        const now = new Date();
        const year = now.getMonth() >= 8 ? now.getFullYear() : now.getFullYear() - 1;
        schoolYear.value = `${year}-${year + 1}`;
    }

    // Apply initial translations
    i18n.applyTranslations();

    // Add initial fact entries
    const factsContainer = document.getElementById('factsContainer');
    for (let i = 0; i < 3; i++) {
        addFactEntry(factsContainer);
    }

    // ========================
    // Language Toggle
    // ========================
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            i18n.setLanguage(lang);
        });
    });

    // ========================
    // Add Fact Button
    // ========================
    document.getElementById('btnAddFact').addEventListener('click', () => {
        addFactEntry(factsContainer);
        // Focus the new textarea
        const entries = factsContainer.querySelectorAll('.fact-entry textarea');
        if (entries.length) entries[entries.length - 1].focus();
    });

    // ========================
    // Toast Notifications
    // ========================
    function showToast(message, type = '') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = 'toast show' + (type ? ` ${type}` : '');
        setTimeout(() => { toast.className = 'toast'; }, 3000);
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

    document.getElementById('btnExportWord').addEventListener('click', exportWord);
    document.getElementById('btnExportWordBottom').addEventListener('click', exportWord);
    document.getElementById('btnExportFromPreview')?.addEventListener('click', () => {
        closePreview();
        exportWord();
    });

    // ========================
    // Save / Load Draft
    // ========================
    document.getElementById('btnSaveDraft').addEventListener('click', () => {
        if (formHandler.saveDraft()) showToast(i18n.t('msg_saved'), 'success');
    });

    document.getElementById('btnLoadDraft').addEventListener('click', () => {
        const draft = formHandler.loadDraft();
        if (draft) {
            formHandler.restoreFromDraft(draft);
            showToast(i18n.t('msg_loaded'), 'success');
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
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });

    // ========================
    // Preview Modal
    // ========================
    const previewModal = document.getElementById('previewModal');
    const previewContent = document.getElementById('previewContent');

    function openPreview() {
        const data = formHandler.collectData();
        const t = (key) => i18n.t(key);

        const formatDate = (dateStr, place) => {
            if (!dateStr) return '';
            try {
                const d = new Date(dateStr);
                const lang = data.language || 'fr';
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const dateFormatted = d.toLocaleDateString(lang === 'fr' ? 'fr-LU' : 'de-LU', options);
                return place ? `${place}, le ${dateFormatted}` : dateFormatted;
            } catch { return dateStr; }
        };

        const recipientLines = (data.recipientAddress || '').split('\n').filter(l => l.trim());
        const subjectText = data.studentMatricule
            ? `${t('doc_subject_prefix')} ${data.studentName || 'xxx'} (matricule : ${data.studentMatricule})`
            : `${t('doc_subject_prefix')} ${data.studentName || 'xxx'}`;

        let html = `<div class="preview-letter">`;

        // Header with logo
        html += `<div class="preview-letter-header">
            <img src="assets/cdse-logo.jpeg" alt="CDSE">
        </div>`;

        // Recipient
        html += `<div class="preview-recipient">`;
        html += `<strong>${data.recipientInstitution || ''}</strong><br>`;
        recipientLines.forEach(l => { html += `${l}<br>`; });
        html += `</div>`;

        // Date
        html += `<div class="preview-date">${formatDate(data.signatureDate, data.signaturePlace)}</div>`;

        // Subject
        html += `<div class="preview-subject">${subjectText}</div>`;

        // Body
        html += `<div class="preview-body">`;

        // Salutation
        html += `<p>${t('doc_salutation')}</p>`;

        // Context
        if (data.contextText) {
            data.contextText.split('\n').filter(p => p.trim()).forEach(p => {
                html += `<p>${p}</p>`;
            });
        }

        // Measures
        if (data.measuresText) {
            data.measuresText.split('\n').filter(p => p.trim()).forEach(p => {
                html += `<p>${p}</p>`;
            });
        }

        // Facts
        if (data.facts && data.facts.length > 0) {
            html += `<ul>`;
            data.facts.forEach((fact, idx) => {
                let text = fact;
                if (idx === data.facts.length - 1) {
                    if (!text.endsWith('.')) text = text.replace(/\s*;\s*$/, '') + '.';
                } else {
                    if (!text.endsWith(';') && !text.endsWith('.')) text += ' ;';
                }
                html += `<li>${text}</li>`;
            });
            html += `</ul>`;
        }

        // Facts conclusion
        if (data.factsConclusion) {
            data.factsConclusion.split('\n').filter(p => p.trim()).forEach(p => {
                html += `<p>${p}</p>`;
            });
        }

        // Additional
        if (data.additionalInfo) {
            data.additionalInfo.split('\n').filter(p => p.trim()).forEach(p => {
                html += `<p>${p}</p>`;
            });
        }

        // Request
        if (data.requestText) {
            data.requestText.split('\n').filter(p => p.trim()).forEach(p => {
                html += `<p>${p}</p>`;
            });
        }

        html += `</div>`; // end preview-body

        // Closing
        html += `<div class="preview-closing">`;
        html += `<p>${t('doc_closing')}</p>`;
        html += `<p>${t('doc_regards')}</p>`;
        html += `</div>`;

        // Signatures
        html += `<div class="preview-signatures">`;
        if (data.signatory1Name) {
            html += `<div class="preview-sig-block">
                <div class="sig-name">${data.signatory1Name}</div>
                <div class="sig-role">${data.signatory1Role || ''}</div>
                <div class="sig-contact">${data.signatory1Email || ''}</div>
                <div class="sig-contact">${data.signatory1Phone || ''}</div>
            </div>`;
        }
        if (data.signatory2Name) {
            html += `<div class="preview-sig-block">
                <div class="sig-name">${data.signatory2Name}</div>
                <div class="sig-role">${data.signatory2Role || ''}</div>
                <div class="sig-contact">${data.signatory2Email || ''}</div>
                <div class="sig-contact">${data.signatory2Phone || ''}</div>
            </div>`;
        }
        html += `</div>`;

        // Footer
        html += `<div class="preview-footer">
            ${t('doc_footer_address')} &nbsp;&nbsp; ${t('doc_footer_phone')}<br>
            ${t('doc_footer_city')} &nbsp;&nbsp; ${t('doc_footer_email')}
        </div>`;

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

    // Auto-save on unload
    window.addEventListener('beforeunload', () => {
        formHandler.saveDraft();
    });
});
