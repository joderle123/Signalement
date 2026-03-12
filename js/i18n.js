/* ============================================
   i18n - Français / Deutsch
   Signalement Generator - CDSE Annexe Junglinster
   ============================================ */

const translations = {
    fr: {
        // App header
        app_title: "Signalement",
        app_subtitle: "CDSE — Annexe Junglinster",
        btn_reset: "Nouveau signalement",
        btn_export: "Exporter Word",
        btn_save_draft: "Sauvegarder brouillon",
        btn_load_draft: "Charger brouillon",
        btn_preview: "Aperçu",
        btn_close: "Fermer",
        btn_clear_signature: "Effacer",
        preview_title: "Aperçu du signalement",

        // Section titles
        section_student: "Informations de l'élève",
        section_parents: "Parents / Responsables légaux",
        section_motif: "Motif du signalement",
        section_learning: "Comportement d'apprentissage",
        section_social: "Comportement social et émotionnel",
        section_language: "Développement langagier",
        section_motor: "Motricité et concentration",
        section_measures: "Mesures déjà prises",
        section_observations: "Observations et recommandations",
        section_signature: "Date et signature",

        // Section short names (progress bar)
        section_short_1: "Élève",
        section_short_2: "Parents",
        section_short_3: "Motif",
        section_short_4: "Apprentissage",
        section_short_5: "Social",
        section_short_6: "Langagier",
        section_short_7: "Motricité",
        section_short_8: "Mesures",
        section_short_9: "Observations",
        section_short_10: "Signature",

        // Student info labels
        label_lastname: "Nom",
        label_firstname: "Prénom",
        label_dob: "Date de naissance",
        label_class: "Classe",
        label_school: "École",
        label_school_year: "Année scolaire",
        label_teacher: "Titulaire de classe",
        label_nationality: "Nationalité",
        label_home_language: "Langue(s) parlée(s) à la maison",
        label_lux_level: "Niveau de luxembourgeois",

        // Select options
        select_placeholder: "-- Choisir --",
        level_none: "Aucune connaissance",
        level_basic: "Notions de base",
        level_intermediate: "Intermédiaire",
        level_good: "Bon",
        level_fluent: "Courant",

        // Parents
        label_parent1: "Parent / Responsable 1",
        label_parent2: "Parent / Responsable 2",
        label_name: "Nom et prénom",
        label_phone: "Téléphone",
        label_email: "Email",
        label_address: "Adresse",

        // Motif
        instruction_motif: "Veuillez sélectionner le(s) motif(s) du signalement :",
        label_other_motif: "Autre motif (préciser)",

        // Rating instructions
        instruction_learning: "Évaluez les domaines suivants :",
        instruction_social: "Évaluez les aspects suivants :",
        instruction_language: "Évaluez les compétences langagières :",
        instruction_motor: "Évaluez les aspects suivants :",

        // Rating scale headers
        rating_na: "N/A",
        rating_1: "Très insuffisant",
        rating_2: "Insuffisant",
        rating_3: "Satisfaisant",
        rating_4: "Bon",
        rating_5: "Très bon",

        // Comments
        label_learning_comments: "Observations complémentaires",
        label_social_comments: "Observations complémentaires",
        label_language_comments: "Observations complémentaires",
        label_motor_comments: "Observations complémentaires",

        // Measures
        instruction_measures: "Quelles mesures ont déjà été mises en place ?",
        label_measures_details: "Détails des mesures prises",
        label_measures_effect: "Effets observés",

        // Observations
        label_teacher_obs: "Observations de l'enseignant(e)",
        placeholder_observations: "Décrivez vos observations concernant l'élève...",
        label_recommendations: "Recommandations / Demandes",
        label_additional: "Informations supplémentaires",

        // Signature
        label_date: "Date",
        label_place: "Lieu",
        label_signatory: "Nom du signataire",
        label_signatory_role: "Fonction",
        label_signature_area: "Signature",

        // Messages
        msg_saved: "Brouillon sauvegardé avec succès",
        msg_loaded: "Brouillon chargé avec succès",
        msg_no_draft: "Aucun brouillon trouvé",
        msg_reset_confirm: "Voulez-vous vraiment créer un nouveau signalement ? Toutes les données non sauvegardées seront perdues.",
        msg_exported: "Document Word exporté avec succès",
        msg_export_error: "Erreur lors de l'export",

        // Word document
        doc_title: "SIGNALEMENT",
        doc_subtitle: "Centre pour le Développement Socio-Émotionnel",
        doc_annexe: "Annexe Junglinster",
        doc_confidential: "CONFIDENTIEL",
        doc_page: "Page",
        doc_generated: "Généré le",
        doc_signature_line: "Signature :",
        doc_yes: "Oui",
        doc_no: "Non",
    },

    de: {
        // App header
        app_title: "Signalement",
        app_subtitle: "CDSE — Annexe Junglinster",
        btn_reset: "Neues Signalement",
        btn_export: "Word exportieren",
        btn_save_draft: "Entwurf speichern",
        btn_load_draft: "Entwurf laden",
        btn_preview: "Vorschau",
        btn_close: "Schließen",
        btn_clear_signature: "Löschen",
        preview_title: "Vorschau des Signalements",

        // Section titles
        section_student: "Schülerinformationen",
        section_parents: "Eltern / Erziehungsberechtigte",
        section_motif: "Grund des Signalements",
        section_learning: "Lernverhalten",
        section_social: "Sozial- und Emotionalverhalten",
        section_language: "Sprachentwicklung",
        section_motor: "Motorik und Konzentration",
        section_measures: "Bereits ergriffene Maßnahmen",
        section_observations: "Beobachtungen und Empfehlungen",
        section_signature: "Datum und Unterschrift",

        // Section short names (progress bar)
        section_short_1: "Schüler",
        section_short_2: "Eltern",
        section_short_3: "Grund",
        section_short_4: "Lernen",
        section_short_5: "Sozial",
        section_short_6: "Sprache",
        section_short_7: "Motorik",
        section_short_8: "Maßnahmen",
        section_short_9: "Beobachtungen",
        section_short_10: "Unterschrift",

        // Student info labels
        label_lastname: "Nachname",
        label_firstname: "Vorname",
        label_dob: "Geburtsdatum",
        label_class: "Klasse",
        label_school: "Schule",
        label_school_year: "Schuljahr",
        label_teacher: "Klassenlehrer/in",
        label_nationality: "Nationalität",
        label_home_language: "Zu Hause gesprochene Sprache(n)",
        label_lux_level: "Luxemburgisch-Niveau",

        // Select options
        select_placeholder: "-- Auswählen --",
        level_none: "Keine Kenntnisse",
        level_basic: "Grundkenntnisse",
        level_intermediate: "Mittelstufe",
        level_good: "Gut",
        level_fluent: "Fließend",

        // Parents
        label_parent1: "Elternteil / Erziehungsberechtigte(r) 1",
        label_parent2: "Elternteil / Erziehungsberechtigte(r) 2",
        label_name: "Name und Vorname",
        label_phone: "Telefon",
        label_email: "E-Mail",
        label_address: "Adresse",

        // Motif
        instruction_motif: "Bitte wählen Sie den/die Grund/Gründe des Signalements:",
        label_other_motif: "Anderer Grund (bitte angeben)",

        // Rating instructions
        instruction_learning: "Bewerten Sie die folgenden Bereiche:",
        instruction_social: "Bewerten Sie die folgenden Aspekte:",
        instruction_language: "Bewerten Sie die sprachlichen Kompetenzen:",
        instruction_motor: "Bewerten Sie die folgenden Aspekte:",

        // Rating scale headers
        rating_na: "N/A",
        rating_1: "Sehr unzureichend",
        rating_2: "Unzureichend",
        rating_3: "Befriedigend",
        rating_4: "Gut",
        rating_5: "Sehr gut",

        // Comments
        label_learning_comments: "Ergänzende Beobachtungen",
        label_social_comments: "Ergänzende Beobachtungen",
        label_language_comments: "Ergänzende Beobachtungen",
        label_motor_comments: "Ergänzende Beobachtungen",

        // Measures
        instruction_measures: "Welche Maßnahmen wurden bereits ergriffen?",
        label_measures_details: "Details der ergriffenen Maßnahmen",
        label_measures_effect: "Beobachtete Wirkungen",

        // Observations
        label_teacher_obs: "Beobachtungen der Lehrkraft",
        placeholder_observations: "Beschreiben Sie Ihre Beobachtungen zum Schüler/zur Schülerin...",
        label_recommendations: "Empfehlungen / Anträge",
        label_additional: "Zusätzliche Informationen",

        // Signature
        label_date: "Datum",
        label_place: "Ort",
        label_signatory: "Name des Unterzeichners",
        label_signatory_role: "Funktion",
        label_signature_area: "Unterschrift",

        // Messages
        msg_saved: "Entwurf erfolgreich gespeichert",
        msg_loaded: "Entwurf erfolgreich geladen",
        msg_no_draft: "Kein Entwurf gefunden",
        msg_reset_confirm: "Möchten Sie wirklich ein neues Signalement erstellen? Alle nicht gespeicherten Daten gehen verloren.",
        msg_exported: "Word-Dokument erfolgreich exportiert",
        msg_export_error: "Fehler beim Export",

        // Word document
        doc_title: "SIGNALEMENT",
        doc_subtitle: "Centre pour le Développement Socio-Émotionnel",
        doc_annexe: "Annexe Junglinster",
        doc_confidential: "VERTRAULICH",
        doc_page: "Seite",
        doc_generated: "Erstellt am",
        doc_signature_line: "Unterschrift:",
        doc_yes: "Ja",
        doc_no: "Nein",
    }
};

// i18n engine
class I18n {
    constructor(defaultLang = 'fr') {
        this.currentLang = defaultLang;
        this.listeners = [];
    }

    t(key) {
        const langData = translations[this.currentLang];
        return langData[key] || translations['fr'][key] || key;
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            this.applyTranslations();
            this.listeners.forEach(fn => fn(lang));
            document.documentElement.lang = lang;
        }
    }

    applyTranslations() {
        // Translate data-i18n elements
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (el.tagName === 'INPUT' && el.type !== 'submit') {
                // skip input values
            } else if (el.tagName === 'OPTION') {
                el.textContent = text;
            } else {
                el.textContent = text;
            }
        });

        // Translate placeholders
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            el.placeholder = this.t(key);
        });
    }

    onLanguageChange(fn) {
        this.listeners.push(fn);
    }

    getLang() {
        return this.currentLang;
    }
}

// Global instance
const i18n = new I18n('fr');
