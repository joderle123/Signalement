/* ============================================
   Word Document Generator (.docx)
   Signalement Generator - CDSE Annexe Junglinster
   Uses docx library for professional Word export
   ============================================ */

class WordGenerator {
    constructor() {
        this.libraryLoaded = false;
    }

    async loadLibrary() {
        if (this.libraryLoaded) return;
        // Load docx library dynamically
        await this.loadScript('https://unpkg.com/docx@8.5.0/build/index.umd.js');
        // Load FileSaver for download
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
        this.libraryLoaded = true;
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            // Check if already loaded
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async generate(data) {
        await this.loadLibrary();

        const lang = data.language || 'fr';
        const t = (key) => i18n.t(key);

        const {
            Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
            WidthType, AlignmentType, HeadingLevel, BorderStyle, ShadingType,
            PageBreak, TabStopPosition, TabStopType, Header, Footer,
            ImageRun, UnderlineType, TableLayoutType
        } = docx;

        // Color constants
        const PRIMARY = '1a56db';
        const PRIMARY_LIGHT = 'e8eefb';
        const GRAY = '6b7280';
        const BLACK = '111827';
        const WHITE = 'ffffff';
        const RED = 'dc2626';

        // Helper: create a styled heading
        const sectionHeading = (number, text) => {
            return new Paragraph({
                spacing: { before: 300, after: 150 },
                border: {
                    bottom: { color: PRIMARY, space: 4, style: BorderStyle.SINGLE, size: 6 },
                },
                children: [
                    new TextRun({
                        text: `${number}. `,
                        bold: true,
                        color: PRIMARY,
                        size: 26,
                        font: 'Calibri',
                    }),
                    new TextRun({
                        text: text,
                        bold: true,
                        color: PRIMARY,
                        size: 26,
                        font: 'Calibri',
                    }),
                ],
            });
        };

        // Helper: field line
        const fieldLine = (label, value) => {
            return new Paragraph({
                spacing: { after: 60 },
                children: [
                    new TextRun({
                        text: `${label} : `,
                        bold: true,
                        size: 21,
                        font: 'Calibri',
                        color: BLACK,
                    }),
                    new TextRun({
                        text: value || '—',
                        size: 21,
                        font: 'Calibri',
                        color: BLACK,
                    }),
                ],
            });
        };

        // Helper: empty line
        const emptyLine = () => new Paragraph({ spacing: { after: 80 }, children: [] });

        // Helper: checkbox text
        const checkItem = (text, checked) => {
            return new Paragraph({
                spacing: { after: 40 },
                children: [
                    new TextRun({
                        text: checked ? '☑ ' : '☐ ',
                        size: 22,
                        font: 'Calibri',
                    }),
                    new TextRun({
                        text: text,
                        size: 21,
                        font: 'Calibri',
                        color: BLACK,
                    }),
                ],
            });
        };

        // Helper: sub-heading for categories
        const categoryHeading = (text) => {
            return new Paragraph({
                spacing: { before: 160, after: 80 },
                shading: { type: ShadingType.SOLID, color: PRIMARY_LIGHT },
                children: [
                    new TextRun({
                        text: text,
                        bold: true,
                        size: 21,
                        font: 'Calibri',
                        color: PRIMARY,
                    }),
                ],
            });
        };

        // Helper: rating value to display text
        const ratingDisplay = (val) => {
            if (!val || val === 'na') return 'N/A';
            const labels = {
                '1': t('rating_1'),
                '2': t('rating_2'),
                '3': t('rating_3'),
                '4': t('rating_4'),
                '5': t('rating_5'),
            };
            return labels[val] || val;
        };

        // Helper: rating value to visual indicator
        const ratingVisual = (val) => {
            if (!val || val === 'na') return '—';
            const dots = { '1': '●○○○○', '2': '●●○○○', '3': '●●●○○', '4': '●●●●○', '5': '●●●●●' };
            return dots[val] || '—';
        };

        // Build rating table
        const buildRatingTableDoc = (ratings, categories) => {
            const rows = [];

            // Header row
            const headerCells = [
                new TableCell({
                    width: { size: 4000, type: WidthType.DXA },
                    shading: { type: ShadingType.SOLID, color: PRIMARY },
                    children: [new Paragraph({
                        children: [new TextRun({ text: '', bold: true, size: 18, color: WHITE, font: 'Calibri' })]
                    })],
                }),
                ...[t('rating_na'), t('rating_1'), t('rating_2'), t('rating_3'), t('rating_4'), t('rating_5')].map(h =>
                    new TableCell({
                        width: { size: 1100, type: WidthType.DXA },
                        shading: { type: ShadingType.SOLID, color: PRIMARY },
                        children: [new Paragraph({
                            alignment: AlignmentType.CENTER,
                            children: [new TextRun({ text: h, bold: true, size: 14, color: WHITE, font: 'Calibri' })]
                        })],
                    })
                ),
            ];
            rows.push(new TableRow({ children: headerCells }));

            // Data rows from categories
            categories.forEach(cat => {
                // Category row
                const catCells = [
                    new TableCell({
                        columnSpan: 7,
                        shading: { type: ShadingType.SOLID, color: PRIMARY_LIGHT },
                        children: [new Paragraph({
                            children: [new TextRun({ text: cat.category, bold: true, size: 18, color: PRIMARY, font: 'Calibri' })]
                        })],
                    }),
                ];
                rows.push(new TableRow({ children: catCells }));

                cat.items.forEach(item => {
                    const ratingVal = ratings[item] || null;
                    const values = ['na', '1', '2', '3', '4', '5'];
                    const itemCells = [
                        new TableCell({
                            width: { size: 4000, type: WidthType.DXA },
                            children: [new Paragraph({
                                children: [new TextRun({ text: item, size: 18, font: 'Calibri', color: BLACK })]
                            })],
                        }),
                        ...values.map(v =>
                            new TableCell({
                                width: { size: 1100, type: WidthType.DXA },
                                children: [new Paragraph({
                                    alignment: AlignmentType.CENTER,
                                    children: [new TextRun({
                                        text: ratingVal === v ? '●' : '○',
                                        size: 20,
                                        font: 'Calibri',
                                        color: ratingVal === v ? PRIMARY : 'cccccc',
                                    })]
                                })],
                            })
                        ),
                    ];
                    rows.push(new TableRow({ children: itemCells }));
                });
            });

            return new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                rows: rows,
                layout: TableLayoutType.FIXED,
            });
        };

        // Get questionnaire data for current language
        const qData = questionnaireData;

        // Format date
        const formatDate = (dateStr) => {
            if (!dateStr) return '—';
            try {
                const d = new Date(dateStr);
                return d.toLocaleDateString(lang === 'fr' ? 'fr-LU' : 'de-LU');
            } catch { return dateStr; }
        };

        // Level display
        const levelText = (val) => {
            const key = `level_${val}`;
            return val ? t(key) : '—';
        };

        // Collect all motifs for the questionnaire
        const allMotifs = qData.motifs[lang];
        const checkedMotifs = data.motifs || [];

        const allMeasures = qData.measures[lang];
        const checkedMeasures = data.measures || [];

        // ========================
        // BUILD DOCUMENT
        // ========================
        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: { font: 'Calibri', size: 22 },
                    },
                },
            },
            sections: [{
                properties: {
                    page: {
                        margin: { top: 1200, right: 1000, bottom: 1000, left: 1000 },
                    },
                },
                headers: {
                    default: new Header({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0 },
                                children: [
                                    new TextRun({
                                        text: t('doc_subtitle').toUpperCase(),
                                        bold: true,
                                        size: 18,
                                        font: 'Calibri',
                                        color: PRIMARY,
                                    }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0 },
                                children: [
                                    new TextRun({
                                        text: t('doc_annexe'),
                                        size: 16,
                                        font: 'Calibri',
                                        color: GRAY,
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.RIGHT,
                                children: [
                                    new TextRun({
                                        text: `${t('doc_confidential')}`,
                                        size: 16,
                                        italics: true,
                                        color: RED,
                                        font: 'Calibri',
                                    }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    // === TITLE ===
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { before: 200, after: 80 },
                        children: [
                            new TextRun({
                                text: t('doc_title'),
                                bold: true,
                                size: 40,
                                font: 'Calibri',
                                color: PRIMARY,
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 60 },
                        children: [
                            new TextRun({
                                text: `${t('doc_generated')} ${formatDate(data.generatedAt)}`,
                                size: 18,
                                italics: true,
                                color: GRAY,
                                font: 'Calibri',
                            }),
                        ],
                    }),
                    new Paragraph({
                        alignment: AlignmentType.CENTER,
                        spacing: { after: 200 },
                        border: {
                            bottom: { color: PRIMARY, space: 8, style: BorderStyle.SINGLE, size: 12 },
                        },
                        children: [
                            new TextRun({
                                text: t('doc_confidential'),
                                bold: true,
                                size: 20,
                                color: RED,
                                font: 'Calibri',
                            }),
                        ],
                    }),

                    // === SECTION 1: Student Info ===
                    sectionHeading('1', t('section_student')),
                    fieldLine(t('label_lastname'), data.studentLastName),
                    fieldLine(t('label_firstname'), data.studentFirstName),
                    fieldLine(t('label_dob'), formatDate(data.studentDOB)),
                    fieldLine(t('label_class'), data.studentClass),
                    fieldLine(t('label_school'), data.studentSchool),
                    fieldLine(t('label_school_year'), data.schoolYear),
                    fieldLine(t('label_teacher'), data.classTeacher),
                    fieldLine(t('label_nationality'), data.studentNationality),
                    fieldLine(t('label_home_language'), data.homeLanguage),
                    fieldLine(t('label_lux_level'), levelText(data.luxembourgishLevel)),

                    // === SECTION 2: Parents ===
                    sectionHeading('2', t('section_parents')),
                    categoryHeading(t('label_parent1')),
                    fieldLine(t('label_name'), data.parent1Name),
                    fieldLine(t('label_phone'), data.parent1Phone),
                    fieldLine(t('label_email'), data.parent1Email),
                    categoryHeading(t('label_parent2')),
                    fieldLine(t('label_name'), data.parent2Name),
                    fieldLine(t('label_phone'), data.parent2Phone),
                    fieldLine(t('label_email'), data.parent2Email),
                    fieldLine(t('label_address'), data.parentAddress),

                    // === SECTION 3: Motifs ===
                    sectionHeading('3', t('section_motif')),
                    ...allMotifs.map(m => checkItem(m, checkedMotifs.includes(m))),
                    ...(data.motifOther ? [
                        emptyLine(),
                        fieldLine(t('label_other_motif'), data.motifOther),
                    ] : []),

                    // === SECTION 4: Learning ===
                    sectionHeading('4', t('section_learning')),
                    buildRatingTableDoc(data.learningRatings || {}, qData.learning[lang]),
                    ...(data.learningComments ? [
                        emptyLine(),
                        fieldLine(t('label_learning_comments'), data.learningComments),
                    ] : []),

                    // === SECTION 5: Social ===
                    sectionHeading('5', t('section_social')),
                    buildRatingTableDoc(data.socialRatings || {}, qData.social[lang]),
                    ...(data.socialComments ? [
                        emptyLine(),
                        fieldLine(t('label_social_comments'), data.socialComments),
                    ] : []),

                    // === SECTION 6: Language ===
                    sectionHeading('6', t('section_language')),
                    buildRatingTableDoc(data.languageRatings || {}, qData.language[lang]),
                    ...(data.languageComments ? [
                        emptyLine(),
                        fieldLine(t('label_language_comments'), data.languageComments),
                    ] : []),

                    // === SECTION 7: Motor ===
                    sectionHeading('7', t('section_motor')),
                    buildRatingTableDoc(data.motorRatings || {}, qData.motor[lang]),
                    ...(data.motorComments ? [
                        emptyLine(),
                        fieldLine(t('label_motor_comments'), data.motorComments),
                    ] : []),

                    // === SECTION 8: Measures ===
                    sectionHeading('8', t('section_measures')),
                    ...allMeasures.map(m => checkItem(m, checkedMeasures.includes(m))),
                    ...(data.measuresDetails ? [
                        emptyLine(),
                        fieldLine(t('label_measures_details'), data.measuresDetails),
                    ] : []),
                    ...(data.measuresEffect ? [
                        fieldLine(t('label_measures_effect'), data.measuresEffect),
                    ] : []),

                    // === SECTION 9: Observations ===
                    sectionHeading('9', t('section_observations')),
                    ...(data.teacherObservations ? [
                        new Paragraph({
                            spacing: { before: 80, after: 60 },
                            children: [
                                new TextRun({ text: `${t('label_teacher_obs')} :`, bold: true, size: 21, font: 'Calibri', color: BLACK }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 100 },
                            children: [
                                new TextRun({ text: data.teacherObservations, size: 21, font: 'Calibri', color: BLACK }),
                            ],
                        }),
                    ] : []),
                    ...(data.recommendations ? [
                        new Paragraph({
                            spacing: { before: 80, after: 60 },
                            children: [
                                new TextRun({ text: `${t('label_recommendations')} :`, bold: true, size: 21, font: 'Calibri', color: BLACK }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 100 },
                            children: [
                                new TextRun({ text: data.recommendations, size: 21, font: 'Calibri', color: BLACK }),
                            ],
                        }),
                    ] : []),
                    ...(data.additionalInfo ? [
                        new Paragraph({
                            spacing: { before: 80, after: 60 },
                            children: [
                                new TextRun({ text: `${t('label_additional')} :`, bold: true, size: 21, font: 'Calibri', color: BLACK }),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 100 },
                            children: [
                                new TextRun({ text: data.additionalInfo, size: 21, font: 'Calibri', color: BLACK }),
                            ],
                        }),
                    ] : []),

                    // === SECTION 10: Signature ===
                    sectionHeading('10', t('section_signature')),
                    fieldLine(t('label_date'), formatDate(data.signatureDate)),
                    fieldLine(t('label_place'), data.signaturePlace),
                    fieldLine(t('label_signatory'), data.signatureName),
                    fieldLine(t('label_signatory_role'), data.signatoryRole),
                    emptyLine(),
                    emptyLine(),
                    new Paragraph({
                        spacing: { before: 200 },
                        children: [
                            new TextRun({
                                text: t('doc_signature_line'),
                                bold: true,
                                size: 21,
                                font: 'Calibri',
                                color: BLACK,
                            }),
                        ],
                    }),
                    new Paragraph({
                        spacing: { before: 40 },
                        border: {
                            bottom: { color: BLACK, space: 1, style: BorderStyle.SINGLE, size: 4 },
                        },
                        children: [
                            new TextRun({ text: '                                                                          ', size: 21 }),
                        ],
                    }),
                ],
            }],
        });

        // Generate and download
        const blob = await Packer.toBlob(doc);
        const studentName = `${data.studentLastName || 'Eleve'}_${data.studentFirstName || ''}`.trim().replace(/\s+/g, '_');
        const dateStr = new Date().toISOString().slice(0, 10);
        const filename = `Signalement_${studentName}_${dateStr}.docx`;

        saveAs(blob, filename);
        return filename;
    }
}
