/* ============================================
   Questionnaire Data - FR/DE
   Signalement Generator - CDSE Annexe Junglinster
   ============================================ */

const questionnaireData = {

    // === Section 3: Motifs du signalement ===
    motifs: {
        fr: [
            "Difficultés d'apprentissage globales",
            "Difficultés en lecture / écriture",
            "Difficultés en mathématiques",
            "Difficultés langagières",
            "Troubles du comportement",
            "Difficultés émotionnelles",
            "Problèmes d'attention / concentration",
            "Hyperactivité / agitation",
            "Retrait social / isolement",
            "Absentéisme scolaire",
            "Suspicion de haut potentiel",
            "Difficultés motrices",
            "Problèmes familiaux",
            "Suspicion de maltraitance / négligence",
            "Problèmes de santé impactant la scolarité",
            "Difficultés d'intégration",
        ],
        de: [
            "Allgemeine Lernschwierigkeiten",
            "Schwierigkeiten beim Lesen / Schreiben",
            "Schwierigkeiten in Mathematik",
            "Sprachliche Schwierigkeiten",
            "Verhaltensstörungen",
            "Emotionale Schwierigkeiten",
            "Aufmerksamkeits- / Konzentrationsprobleme",
            "Hyperaktivität / Unruhe",
            "Sozialer Rückzug / Isolation",
            "Schulabsentismus",
            "Verdacht auf Hochbegabung",
            "Motorische Schwierigkeiten",
            "Familiäre Probleme",
            "Verdacht auf Misshandlung / Vernachlässigung",
            "Gesundheitliche Probleme mit Auswirkung auf die Schule",
            "Integrationsschwierigkeiten",
        ]
    },

    // === Section 4: Comportement d'apprentissage ===
    learning: {
        fr: [
            { category: "Compétences scolaires", items: [
                "Compréhension orale",
                "Expression orale",
                "Lecture",
                "Écriture / production écrite",
                "Calcul / mathématiques",
                "Raisonnement logique",
            ]},
            { category: "Attitude face au travail", items: [
                "Motivation / engagement",
                "Autonomie dans le travail",
                "Organisation du travail",
                "Respect des consignes",
                "Persévérance",
                "Rythme de travail",
            ]},
        ],
        de: [
            { category: "Schulische Kompetenzen", items: [
                "Hörverstehen",
                "Mündlicher Ausdruck",
                "Lesen",
                "Schreiben / schriftlicher Ausdruck",
                "Rechnen / Mathematik",
                "Logisches Denken",
            ]},
            { category: "Arbeitsverhalten", items: [
                "Motivation / Engagement",
                "Selbstständiges Arbeiten",
                "Arbeitsorganisation",
                "Befolgen von Anweisungen",
                "Ausdauer",
                "Arbeitstempo",
            ]},
        ]
    },

    // === Section 5: Comportement social et émotionnel ===
    social: {
        fr: [
            { category: "Relations sociales", items: [
                "Contact avec les pairs",
                "Contact avec les adultes",
                "Capacité à coopérer",
                "Respect des règles de vie",
                "Gestion des conflits",
                "Intégration dans le groupe",
            ]},
            { category: "Développement émotionnel", items: [
                "Confiance en soi",
                "Gestion des émotions",
                "Tolérance à la frustration",
                "Réaction face à l'échec",
                "Bien-être général",
                "Anxiété / stress",
            ]},
        ],
        de: [
            { category: "Soziale Beziehungen", items: [
                "Kontakt mit Gleichaltrigen",
                "Kontakt mit Erwachsenen",
                "Kooperationsfähigkeit",
                "Einhaltung der Regeln",
                "Konfliktbewältigung",
                "Integration in die Gruppe",
            ]},
            { category: "Emotionale Entwicklung", items: [
                "Selbstvertrauen",
                "Umgang mit Emotionen",
                "Frustrationstoleranz",
                "Reaktion auf Misserfolg",
                "Allgemeines Wohlbefinden",
                "Angst / Stress",
            ]},
        ]
    },

    // === Section 6: Développement langagier ===
    language: {
        fr: [
            { category: "Compréhension", items: [
                "Compréhension de consignes simples",
                "Compréhension de consignes complexes",
                "Compréhension de textes lus",
                "Compréhension du vocabulaire scolaire",
            ]},
            { category: "Expression", items: [
                "Expression orale spontanée",
                "Vocabulaire actif",
                "Construction de phrases",
                "Narration / récit",
                "Expression écrite",
            ]},
            { category: "Compétences multilingues", items: [
                "Luxembourgeois",
                "Français",
                "Allemand",
                "Langue d'origine",
            ]},
        ],
        de: [
            { category: "Verständnis", items: [
                "Verstehen einfacher Anweisungen",
                "Verstehen komplexer Anweisungen",
                "Leseverständnis",
                "Verständnis des schulischen Wortschatzes",
            ]},
            { category: "Ausdruck", items: [
                "Spontaner mündlicher Ausdruck",
                "Aktiver Wortschatz",
                "Satzbau",
                "Erzählfähigkeit",
                "Schriftlicher Ausdruck",
            ]},
            { category: "Mehrsprachige Kompetenzen", items: [
                "Luxemburgisch",
                "Französisch",
                "Deutsch",
                "Herkunftssprache",
            ]},
        ]
    },

    // === Section 7: Motricité et concentration ===
    motor: {
        fr: [
            { category: "Motricité", items: [
                "Motricité globale",
                "Motricité fine",
                "Graphomotricité / écriture",
                "Coordination",
                "Latéralisation",
            ]},
            { category: "Attention et concentration", items: [
                "Durée de concentration",
                "Attention sélective",
                "Résistance aux distractions",
                "Capacité à écouter",
                "Mémoire de travail",
            ]},
        ],
        de: [
            { category: "Motorik", items: [
                "Grobmotorik",
                "Feinmotorik",
                "Graphomotorik / Schrift",
                "Koordination",
                "Lateralisation",
            ]},
            { category: "Aufmerksamkeit und Konzentration", items: [
                "Konzentrationsdauer",
                "Selektive Aufmerksamkeit",
                "Ablenkbarkeit",
                "Zuhörfähigkeit",
                "Arbeitsgedächtnis",
            ]},
        ]
    },

    // === Section 8: Mesures déjà prises ===
    measures: {
        fr: [
            "Différenciation pédagogique en classe",
            "Entretien avec les parents",
            "Appui scolaire / cours d'appui",
            "Plan de développement individualisé (PDI)",
            "Intervention de l'équipe de soutien (ESEB)",
            "Soutien par un éducateur/éducatrice",
            "Consultation psychologique",
            "Consultation logopédique",
            "Consultation médicale",
            "Adaptation du matériel scolaire",
            "Aide aux devoirs",
            "Collaboration avec le SEA / Maison relais",
            "Médiation scolaire",
            "Autre intervention spécialisée",
        ],
        de: [
            "Pädagogische Differenzierung im Unterricht",
            "Elterngespräch",
            "Schulische Förderung / Stützkurs",
            "Individueller Entwicklungsplan (PDI)",
            "Einsatz des Unterstützungsteams (ESEB)",
            "Unterstützung durch Erzieher/in",
            "Psychologische Beratung",
            "Logopädische Beratung",
            "Ärztliche Beratung",
            "Anpassung des Schulmaterials",
            "Hausaufgabenhilfe",
            "Zusammenarbeit mit dem SEA / Maison relais",
            "Schulmediation",
            "Andere spezialisierte Intervention",
        ]
    }
};

// Helper to build checkbox grids
function buildCheckboxGrid(containerId, items, namePrefix) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'checkbox-item';
        div.innerHTML = `
            <input type="checkbox" id="${namePrefix}_${index}" name="${namePrefix}_${index}" value="${item}">
            <span>${item}</span>
        `;
        div.addEventListener('click', (e) => {
            if (e.target.tagName !== 'INPUT') {
                const cb = div.querySelector('input[type="checkbox"]');
                cb.checked = !cb.checked;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            }
            div.classList.toggle('checked', div.querySelector('input').checked);
        });
        container.appendChild(div);
    });
}

// Helper to build rating tables
function buildRatingTable(containerId, categories, lang) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    const table = document.createElement('table');
    table.className = 'rating-table';

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = [
        '',
        i18n.t('rating_na'),
        i18n.t('rating_1'),
        i18n.t('rating_2'),
        i18n.t('rating_3'),
        i18n.t('rating_4'),
        i18n.t('rating_5'),
    ];
    headers.forEach((h, i) => {
        const th = document.createElement('th');
        th.textContent = h;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');
    categories.forEach(cat => {
        // Category header row
        const catRow = document.createElement('tr');
        catRow.className = 'rating-category';
        const catTd = document.createElement('td');
        catTd.colSpan = 7;
        catTd.textContent = cat.category;
        catRow.appendChild(catTd);
        tbody.appendChild(catRow);

        // Item rows
        cat.items.forEach((item, idx) => {
            const row = document.createElement('tr');
            const nameAttr = `${containerId}_${cat.category.replace(/\s/g, '_')}_${idx}`;

            // Label
            const labelTd = document.createElement('td');
            labelTd.textContent = item;
            row.appendChild(labelTd);

            // Rating options: na, 1-5
            const values = ['na', '1', '2', '3', '4', '5'];
            values.forEach(val => {
                const td = document.createElement('td');
                const label = document.createElement('label');
                const radio = document.createElement('input');
                radio.type = 'radio';
                radio.name = nameAttr;
                radio.value = val;
                label.appendChild(radio);
                td.appendChild(label);
                row.appendChild(td);
            });

            tbody.appendChild(row);
        });
    });
    table.appendChild(tbody);
    container.appendChild(table);
}

// Build all questionnaire sections for a given language
function buildQuestionnaire(lang) {
    const data = questionnaireData;

    // Motifs
    buildCheckboxGrid('motifGrid', data.motifs[lang], 'motif');

    // Measures
    buildCheckboxGrid('measuresGrid', data.measures[lang], 'measure');

    // Rating tables
    buildRatingTable('learningRatings', data.learning[lang], lang);
    buildRatingTable('socialRatings', data.social[lang], lang);
    buildRatingTable('languageRatings', data.language[lang], lang);
    buildRatingTable('motorRatings', data.motor[lang], lang);
}
