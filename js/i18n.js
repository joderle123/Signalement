/* ============================================
   i18n - Français / Deutsch
   Signalement MiTe - CDSE Annexe Junglinster
   ============================================ */

const translations = {
    fr: {
        // Header
        btn_reset: "Nouveau signalement",
        btn_export: "Exporter Word",
        btn_save_draft: "Sauvegarder brouillon",
        btn_load_draft: "Charger brouillon",
        btn_preview: "Aperçu",
        btn_close: "Fermer",
        btn_add_fact: "Ajouter un fait",
        preview_title: "Aperçu du signalement",

        // Section titles
        section_recipient: "Destinataire",
        section_student: "Informations de l'élève",
        section_context: "Contexte et parcours scolaire",
        section_measures: "Mesures déjà prises",
        section_observations: "Faits observés",
        section_additional: "Éléments supplémentaires",
        section_request: "Démarche et demande",
        section_signatories: "Signataires",

        // Labels
        label_institution: "Institution / Destinataire",
        label_recipient_address: "Adresse",
        label_student_name: "Nom et prénom de l'élève",
        label_matricule: "Matricule",
        label_age: "Âge",
        label_class: "Classe / Structure",
        label_school_year: "Année scolaire",
        label_context: "Introduction et contexte",
        label_measures_text: "Mesures antérieures",
        label_facts_conclusion: "Conclusion / Analyse des faits",
        label_additional_info: "Informations complémentaires",
        label_request: "Motif du signalement et demande",
        label_date: "Date",
        label_place: "Lieu",
        label_signatory_1: "Signataire 1",
        label_signatory_2: "Signataire 2",
        label_signatory_name: "Nom",
        label_signatory_role: "Fonction",
        label_signatory_email: "Email",
        label_signatory_phone: "Téléphone",

        // Instructions
        instruction_context: "Décrivez le contexte général, le parcours scolaire et les antécédents pertinents de l'élève.",
        instruction_measures: "Énumérez les mesures mises en place et leur effet.",
        instruction_observations: "Listez les faits et comportements observés. Chaque fait sera présenté sous forme de point dans le document final.",
        instruction_additional: "Ajoutez tout élément complémentaire pertinent (situations particulières, enjeux éducatifs, etc.).",
        instruction_request: "Précisez la démarche entreprise et la demande adressée au destinataire.",

        // Placeholders
        placeholder_context: "Par la présente, nous voulons faire part de nos inquiétudes quant au bien-être de l'élève...",
        placeholder_measures: "Différentes mesures ont été mises en place depuis... (assistance en famille, thérapie, etc.)",
        placeholder_facts_conclusion: "Ces événements ne constituent pas des situations isolées mais s'inscrivent dans une dynamique comportementale...",
        placeholder_request: "Le présent signalement s'inscrit dans une démarche de protection et de prévention...",

        // Messages
        msg_saved: "Brouillon sauvegardé avec succès",
        msg_loaded: "Brouillon chargé avec succès",
        msg_no_draft: "Aucun brouillon trouvé",
        msg_reset_confirm: "Voulez-vous vraiment créer un nouveau signalement ? Toutes les données non sauvegardées seront perdues.",
        msg_exported: "Document Word exporté avec succès",
        msg_export_error: "Erreur lors de l'export",

        // Word document
        doc_salutation: "Madame, Monsieur,",
        doc_closing: "Nous restons bien entendu à votre disposition pour toute information complémentaire.",
        doc_regards: "Veuillez agréer, Madame, Monsieur, l'expression de nos sentiments distingués.",
        doc_subject_prefix: "Objet: Signalement de l'élève",
        doc_footer_address: "31, rue du Parc",
        doc_footer_phone: "Tél: 247-65117",
        doc_footer_city: "L-5374 Munsbach-Château",
        doc_footer_email: "Email: info@cc-cdse.lu",
    },

    de: {
        // Header
        btn_reset: "Neues Signalement",
        btn_export: "Word exportieren",
        btn_save_draft: "Entwurf speichern",
        btn_load_draft: "Entwurf laden",
        btn_preview: "Vorschau",
        btn_close: "Schließen",
        btn_add_fact: "Fakt hinzufügen",
        preview_title: "Vorschau des Signalements",

        // Section titles
        section_recipient: "Empfänger",
        section_student: "Schülerinformationen",
        section_context: "Kontext und schulischer Werdegang",
        section_measures: "Bereits ergriffene Maßnahmen",
        section_observations: "Beobachtete Fakten",
        section_additional: "Zusätzliche Elemente",
        section_request: "Vorgehen und Antrag",
        section_signatories: "Unterzeichner",

        // Labels
        label_institution: "Institution / Empfänger",
        label_recipient_address: "Adresse",
        label_student_name: "Name und Vorname des Schülers",
        label_matricule: "Matrikelnummer",
        label_age: "Alter",
        label_class: "Klasse / Struktur",
        label_school_year: "Schuljahr",
        label_context: "Einleitung und Kontext",
        label_measures_text: "Bisherige Maßnahmen",
        label_facts_conclusion: "Schlussfolgerung / Analyse der Fakten",
        label_additional_info: "Ergänzende Informationen",
        label_request: "Grund des Signalements und Antrag",
        label_date: "Datum",
        label_place: "Ort",
        label_signatory_1: "Unterzeichner 1",
        label_signatory_2: "Unterzeichner 2",
        label_signatory_name: "Name",
        label_signatory_role: "Funktion",
        label_signatory_email: "E-Mail",
        label_signatory_phone: "Telefon",

        // Instructions
        instruction_context: "Beschreiben Sie den allgemeinen Kontext, den schulischen Werdegang und die relevanten Vorgeschichten des Schülers.",
        instruction_measures: "Führen Sie die bereits ergriffenen Maßnahmen und deren Wirkung auf.",
        instruction_observations: "Listen Sie die beobachteten Fakten und Verhaltensweisen auf. Jeder Fakt wird im Dokument als Aufzählungspunkt dargestellt.",
        instruction_additional: "Fügen Sie alle relevanten ergänzenden Elemente hinzu (besondere Situationen, pädagogische Herausforderungen etc.).",
        instruction_request: "Erläutern Sie das Vorgehen und den Antrag an den Empfänger.",

        // Placeholders
        placeholder_context: "Hiermit möchten wir unsere Bedenken bezüglich des Wohlbefindens des Schülers mitteilen...",
        placeholder_measures: "Seit... wurden verschiedene Maßnahmen ergriffen (Familienbegleitung, Therapie etc.)",
        placeholder_facts_conclusion: "Diese Vorfälle stellen keine Einzelfälle dar, sondern reihen sich in eine anhaltende Verhaltensdynamik ein...",
        placeholder_request: "Dieses Signalement erfolgt im Rahmen einer Schutz- und Präventionsmaßnahme...",

        // Messages
        msg_saved: "Entwurf erfolgreich gespeichert",
        msg_loaded: "Entwurf erfolgreich geladen",
        msg_no_draft: "Kein Entwurf gefunden",
        msg_reset_confirm: "Möchten Sie wirklich ein neues Signalement erstellen? Alle nicht gespeicherten Daten gehen verloren.",
        msg_exported: "Word-Dokument erfolgreich exportiert",
        msg_export_error: "Fehler beim Export",

        // Word document
        doc_salutation: "Sehr geehrte Damen und Herren,",
        doc_closing: "Für weitere Informationen stehen wir Ihnen selbstverständlich gerne zur Verfügung.",
        doc_regards: "Mit freundlichen Grüßen",
        doc_subject_prefix: "Betreff: Signalement des Schülers",
        doc_footer_address: "31, rue du Parc",
        doc_footer_phone: "Tel: 247-65117",
        doc_footer_city: "L-5374 Munsbach-Château",
        doc_footer_email: "E-Mail: info@cc-cdse.lu",
    }
};

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
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const text = this.t(key);
            if (el.tagName === 'OPTION') {
                el.textContent = text;
            } else {
                el.textContent = text;
            }
        });
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

const i18n = new I18n('fr');
