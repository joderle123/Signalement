/* ============================================
   Form Handler - Signalement MiTe
   CDSE Annexe Junglinster
   ============================================ */

class FormHandler {
    constructor() {
        this.form = document.getElementById('signalementForm');
        this.draftKey = 'signalement_mite_draft';
    }

    collectData() {
        return {
            // Recipient
            recipientInstitution: this.val('recipientInstitution'),
            recipientAddress: this.val('recipientAddress'),

            // Student
            studentName: this.val('studentName'),
            studentMatricule: this.val('studentMatricule'),
            studentAge: this.val('studentAge'),
            studentClass: this.val('studentClass'),
            schoolYear: this.val('schoolYear'),

            // Content
            contextText: this.val('contextText'),
            measuresText: this.val('measuresText'),
            facts: this.collectFacts(),
            factsConclusion: this.val('factsConclusion'),
            additionalInfo: this.val('additionalInfo'),
            requestText: this.val('requestText'),

            // Signature
            signatureDate: this.val('signatureDate'),
            signaturePlace: this.val('signaturePlace'),

            // Signatories
            signatory1Name: this.valByName('signatory1Name'),
            signatory1Role: this.valByName('signatory1Role'),
            signatory1Email: this.valByName('signatory1Email'),
            signatory1Phone: this.valByName('signatory1Phone'),
            signatory2Name: this.valByName('signatory2Name'),
            signatory2Role: this.valByName('signatory2Role'),
            signatory2Email: this.valByName('signatory2Email'),
            signatory2Phone: this.valByName('signatory2Phone'),

            // Meta
            language: i18n.getLang(),
            generatedAt: new Date().toISOString(),
        };
    }

    val(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    valByName(name) {
        const el = document.querySelector(`[name="${name}"]`);
        return el ? el.value : '';
    }

    collectFacts() {
        const facts = [];
        document.querySelectorAll('.fact-entry textarea').forEach(ta => {
            const text = ta.value.trim();
            if (text) facts.push(text);
        });
        return facts;
    }

    saveDraft() {
        try {
            const data = this.collectData();
            localStorage.setItem(this.draftKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save draft error:', e);
            return false;
        }
    }

    loadDraft() {
        try {
            const raw = localStorage.getItem(this.draftKey);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.error('Load draft error:', e);
            return null;
        }
    }

    restoreFromDraft(data) {
        if (!data) return;

        if (data.language) {
            i18n.setLanguage(data.language);
        }

        // Simple fields
        const fields = [
            'recipientInstitution', 'recipientAddress',
            'studentName', 'studentMatricule', 'studentAge', 'studentClass', 'schoolYear',
            'contextText', 'measuresText', 'factsConclusion', 'additionalInfo', 'requestText',
            'signatureDate', 'signaturePlace',
        ];
        fields.forEach(f => {
            const el = document.getElementById(f);
            if (el && data[f]) el.value = data[f];
        });

        // Named fields (signatories)
        const namedFields = [
            'signatory1Name', 'signatory1Role', 'signatory1Email', 'signatory1Phone',
            'signatory2Name', 'signatory2Role', 'signatory2Email', 'signatory2Phone',
        ];
        namedFields.forEach(f => {
            const el = document.querySelector(`[name="${f}"]`);
            if (el && data[f]) el.value = data[f];
        });

        // Facts - rebuild entries
        if (data.facts && data.facts.length > 0) {
            const container = document.getElementById('factsContainer');
            container.innerHTML = '';
            data.facts.forEach((fact, idx) => {
                addFactEntry(container, fact);
            });
        }
    }

    resetForm() {
        this.form.reset();
        const container = document.getElementById('factsContainer');
        if (container) container.innerHTML = '';
        // Re-add 3 empty facts
        for (let i = 0; i < 3; i++) {
            addFactEntry(container);
        }
    }
}

// Global fact entry helper
function addFactEntry(container, text = '') {
    if (!container) container = document.getElementById('factsContainer');
    const count = container.querySelectorAll('.fact-entry').length + 1;
    const div = document.createElement('div');
    div.className = 'fact-entry';
    div.innerHTML = `
        <span class="fact-number">${count}</span>
        <textarea name="fact_${count}" rows="2" placeholder="">${text}</textarea>
        <button type="button" class="btn-remove-fact" title="Supprimer">&times;</button>
    `;
    div.querySelector('.btn-remove-fact').addEventListener('click', () => {
        div.remove();
        renumberFacts();
    });
    container.appendChild(div);
}

function renumberFacts() {
    const entries = document.querySelectorAll('.fact-entry');
    entries.forEach((entry, idx) => {
        entry.querySelector('.fact-number').textContent = idx + 1;
    });
}
