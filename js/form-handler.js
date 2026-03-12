/* ============================================
   Form Handler
   Signalement Generator - CDSE Annexe Junglinster
   ============================================ */

class FormHandler {
    constructor() {
        this.form = document.getElementById('signalementForm');
        this.draftKey = 'signalement_draft';
    }

    // Collect all form data
    collectData() {
        const data = {
            // Student info
            studentLastName: this.val('studentLastName'),
            studentFirstName: this.val('studentFirstName'),
            studentDOB: this.val('studentDOB'),
            studentClass: this.val('studentClass'),
            studentSchool: this.val('studentSchool'),
            schoolYear: this.val('schoolYear'),
            classTeacher: this.val('classTeacher'),
            studentNationality: this.val('studentNationality'),
            homeLanguage: this.val('homeLanguage'),
            luxembourgishLevel: this.val('luxembourgishLevel'),

            // Parents
            parent1Name: this.val('parent1Name'),
            parent1Phone: this.val('parent1Phone'),
            parent1Email: this.val('parent1Email'),
            parent2Name: this.val('parent2Name'),
            parent2Phone: this.val('parent2Phone'),
            parent2Email: this.val('parent2Email'),
            parentAddress: this.val('parentAddress'),

            // Motifs (checkboxes)
            motifs: this.collectCheckboxes('motif'),

            // Rating sections
            learningRatings: this.collectRatings('learningRatings'),
            socialRatings: this.collectRatings('socialRatings'),
            languageRatings: this.collectRatings('languageRatings'),
            motorRatings: this.collectRatings('motorRatings'),

            // Comments
            learningComments: this.val('learningComments'),
            socialComments: this.val('socialComments'),
            languageComments: this.val('languageComments'),
            motorComments: this.val('motorComments'),
            motifOther: this.val('motifOther'),

            // Measures
            measures: this.collectCheckboxes('measure'),
            measuresDetails: this.val('measuresDetails'),
            measuresEffect: this.val('measuresEffect'),

            // Observations
            teacherObservations: this.val('teacherObservations'),
            recommendations: this.val('recommendations'),
            additionalInfo: this.val('additionalInfo'),

            // Signature
            signatureDate: this.val('signatureDate'),
            signaturePlace: this.val('signaturePlace'),
            signatureName: this.val('signatureName'),
            signatoryRole: this.val('signatoryRole'),

            // Meta
            language: i18n.getLang(),
            generatedAt: new Date().toISOString(),
        };

        return data;
    }

    val(id) {
        const el = document.getElementById(id);
        return el ? el.value : '';
    }

    collectCheckboxes(prefix) {
        const checked = [];
        const checkboxes = document.querySelectorAll(`input[name^="${prefix}_"]:checked`);
        checkboxes.forEach(cb => {
            checked.push(cb.value);
        });
        return checked;
    }

    collectRatings(containerId) {
        const ratings = {};
        const container = document.getElementById(containerId);
        if (!container) return ratings;

        const rows = container.querySelectorAll('tbody tr:not(.rating-category)');
        rows.forEach(row => {
            const label = row.querySelector('td:first-child');
            const selected = row.querySelector('input[type="radio"]:checked');
            if (label && selected) {
                ratings[label.textContent.trim()] = selected.value;
            } else if (label) {
                ratings[label.textContent.trim()] = null;
            }
        });
        return ratings;
    }

    // Save draft to localStorage
    saveDraft() {
        try {
            const data = this.collectData();
            // Also save signature canvas
            const canvas = document.getElementById('signatureCanvas');
            if (canvas) {
                data.signatureImage = canvas.toDataURL();
            }
            localStorage.setItem(this.draftKey, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Save draft error:', e);
            return false;
        }
    }

    // Load draft from localStorage
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

    // Restore form from draft data
    restoreFromDraft(data) {
        if (!data) return;

        // Set language first
        if (data.language) {
            i18n.setLanguage(data.language);
            buildQuestionnaire(data.language);
        }

        // Text fields
        const textFields = [
            'studentLastName', 'studentFirstName', 'studentDOB', 'studentClass',
            'studentSchool', 'schoolYear', 'classTeacher', 'studentNationality',
            'homeLanguage', 'luxembourgishLevel', 'parent1Name', 'parent1Phone',
            'parent1Email', 'parent2Name', 'parent2Phone', 'parent2Email',
            'parentAddress', 'learningComments', 'socialComments', 'languageComments',
            'motorComments', 'motifOther', 'measuresDetails', 'measuresEffect',
            'teacherObservations', 'recommendations', 'additionalInfo',
            'signatureDate', 'signaturePlace', 'signatureName', 'signatoryRole'
        ];

        textFields.forEach(field => {
            const el = document.getElementById(field);
            if (el && data[field]) {
                el.value = data[field];
            }
        });

        // Checkboxes - motifs
        if (data.motifs) {
            data.motifs.forEach(val => {
                const cb = document.querySelector(`input[name^="motif_"][value="${CSS.escape(val)}"]`);
                if (cb) {
                    cb.checked = true;
                    cb.closest('.checkbox-item')?.classList.add('checked');
                }
            });
        }

        // Checkboxes - measures
        if (data.measures) {
            data.measures.forEach(val => {
                const cb = document.querySelector(`input[name^="measure_"][value="${CSS.escape(val)}"]`);
                if (cb) {
                    cb.checked = true;
                    cb.closest('.checkbox-item')?.classList.add('checked');
                }
            });
        }

        // Ratings
        this.restoreRatings('learningRatings', data.learningRatings);
        this.restoreRatings('socialRatings', data.socialRatings);
        this.restoreRatings('languageRatings', data.languageRatings);
        this.restoreRatings('motorRatings', data.motorRatings);

        // Signature image
        if (data.signatureImage) {
            const canvas = document.getElementById('signatureCanvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => ctx.drawImage(img, 0, 0);
                img.src = data.signatureImage;
            }
        }
    }

    restoreRatings(containerId, ratings) {
        if (!ratings) return;
        const container = document.getElementById(containerId);
        if (!container) return;

        const rows = container.querySelectorAll('tbody tr:not(.rating-category)');
        rows.forEach(row => {
            const label = row.querySelector('td:first-child');
            if (label) {
                const key = label.textContent.trim();
                const value = ratings[key];
                if (value) {
                    const radio = row.querySelector(`input[value="${value}"]`);
                    if (radio) radio.checked = true;
                }
            }
        });
    }

    // Reset the entire form
    resetForm() {
        this.form.reset();
        // Clear checkbox visual states
        document.querySelectorAll('.checkbox-item.checked').forEach(el => {
            el.classList.remove('checked');
        });
        // Clear signature
        const canvas = document.getElementById('signatureCanvas');
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Calculate form completion percentage
    getCompletionPercentage() {
        const sections = document.querySelectorAll('.form-section');
        let totalSections = sections.length;
        let completedSections = 0;

        sections.forEach(section => {
            const inputs = section.querySelectorAll('input:not([type="radio"]):not([type="checkbox"]), textarea, select');
            const radios = section.querySelectorAll('input[type="radio"]');
            const checkboxes = section.querySelectorAll('input[type="checkbox"]');

            let hasContent = false;

            // Check text inputs
            inputs.forEach(input => {
                if (input.value && input.value.trim()) hasContent = true;
            });

            // Check radios
            if (section.querySelector('input[type="radio"]:checked')) hasContent = true;

            // Check checkboxes
            if (section.querySelector('input[type="checkbox"]:checked')) hasContent = true;

            if (hasContent) completedSections++;
        });

        return Math.round((completedSections / totalSections) * 100);
    }
}
