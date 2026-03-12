/* ============================================
   Word Document Generator (.docx)
   Signalement MiTe - CDSE Annexe Junglinster
   Generates official letter matching the CDSE template exactly:
   - Calibri 12pt, A4, 2.54cm margins
   - CDSE logo in header
   - Footer with address/phone/email
   - Formal letter structure
   ============================================ */

class WordGenerator {
    constructor() {
        this.libraryLoaded = false;
    }

    async loadLibrary() {
        if (this.libraryLoaded) return;
        await this.loadScript('https://unpkg.com/docx@8.5.0/build/index.umd.js');
        await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js');
        this.libraryLoaded = true;
    }

    loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    async loadLogoAsBase64() {
        try {
            const response = await fetch('assets/cdse-logo.jpeg');
            const blob = await response.blob();
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result.split(',')[1];
                    resolve(base64);
                };
                reader.readAsDataURL(blob);
            });
        } catch (e) {
            console.warn('Could not load logo:', e);
            return null;
        }
    }

    async generate(data) {
        await this.loadLibrary();

        const t = (key) => i18n.t(key);

        const {
            Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
            WidthType, AlignmentType, BorderStyle, ShadingType,
            Header, Footer, ImageRun, TabStopPosition, TabStopType,
            NumberFormat, LevelFormat, convertInchesToTwip
        } = docx;

        // Load logo
        const logoBase64 = await this.loadLogoAsBase64();

        // Format date
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

        // Standard paragraph style: Calibri 12pt, justified
        const bodyPara = (text, options = {}) => {
            return new Paragraph({
                alignment: options.align || AlignmentType.JUSTIFIED,
                spacing: { after: options.after !== undefined ? options.after : 200, line: options.line || 276 },
                indent: options.indent,
                children: [
                    new TextRun({
                        text: text,
                        size: 24, // 12pt in half-points
                        font: 'Calibri',
                        bold: options.bold || false,
                        italics: options.italic || false,
                        color: options.color || '000000',
                    }),
                ],
            });
        };

        // Multi-run paragraph (for mixed formatting in one paragraph)
        const multiRunPara = (runs, options = {}) => {
            return new Paragraph({
                alignment: options.align || AlignmentType.JUSTIFIED,
                spacing: { after: options.after !== undefined ? options.after : 200, line: options.line || 276 },
                children: runs.map(r => new TextRun({
                    text: r.text,
                    size: r.size || 24,
                    font: r.font || 'Calibri',
                    bold: r.bold || false,
                    italics: r.italic || false,
                    color: r.color || '000000',
                })),
            });
        };

        // Empty paragraph
        const emptyPara = (after = 200) => new Paragraph({
            spacing: { after },
            children: [],
        });

        // Bullet list item (dash style like the original)
        const bulletItem = (text) => {
            return new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                spacing: { after: 60, line: 276 },
                indent: { left: 720, hanging: 360 },
                children: [
                    new TextRun({
                        text: '–  ',
                        size: 24,
                        font: 'Calibri',
                    }),
                    new TextRun({
                        text: text.endsWith(';') || text.endsWith('.') ? text : text + ' ;',
                        size: 24,
                        font: 'Calibri',
                    }),
                ],
            });
        };

        // Build the recipient address lines
        const recipientLines = (data.recipientAddress || '').split('\n').filter(l => l.trim());
        const recipientParagraphs = [
            bodyPara(data.recipientInstitution || '', { align: AlignmentType.LEFT, after: 0 }),
            ...recipientLines.map((line, i) =>
                bodyPara(line.trim(), {
                    align: AlignmentType.LEFT,
                    after: i === recipientLines.length - 1 ? 200 : 0
                })
            ),
        ];

        // Build facts list
        const factsParagraphs = (data.facts || []).map((fact, idx) => {
            // Last item ends with period, others with semicolon
            let text = fact;
            if (idx === (data.facts || []).length - 1) {
                if (!text.endsWith('.')) text = text.replace(/\s*;\s*$/, '') + '.';
            } else {
                if (!text.endsWith(';') && !text.endsWith('.')) text += ' ;';
            }
            return bulletItem(text);
        });

        // Subject line
        const subjectText = data.studentMatricule
            ? `${t('doc_subject_prefix')} ${data.studentName || 'xxx'} (matricule : ${data.studentMatricule})`
            : `${t('doc_subject_prefix')} ${data.studentName || 'xxx'}`;

        // Build header children
        const headerChildren = [];
        if (logoBase64) {
            headerChildren.push(
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: Uint8Array.from(atob(logoBase64), c => c.charCodeAt(0)),
                            transformation: { width: 170, height: 85 },
                            type: 'jpg',
                        }),
                    ],
                })
            );
        }

        // Build document
        const doc = new Document({
            styles: {
                default: {
                    document: {
                        run: { font: 'Calibri', size: 24 },
                    },
                },
            },
            sections: [{
                properties: {
                    page: {
                        size: { width: 11906, height: 16838 }, // A4
                        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
                    },
                },
                headers: {
                    default: new Header({ children: headerChildren }),
                },
                footers: {
                    default: new Footer({
                        children: [
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0 },
                                children: [
                                    new TextRun({ text: t('doc_footer_address'), size: 18, font: 'Calibri', color: '666666' }),
                                    new TextRun({ text: '\t\t', size: 18 }),
                                    new TextRun({ text: t('doc_footer_phone'), size: 18, font: 'Calibri', color: '666666' }),
                                ],
                            }),
                            new Paragraph({
                                alignment: AlignmentType.CENTER,
                                spacing: { after: 0 },
                                children: [
                                    new TextRun({ text: t('doc_footer_city'), size: 18, font: 'Calibri', color: '666666' }),
                                    new TextRun({ text: '\t\t', size: 18 }),
                                    new TextRun({ text: t('doc_footer_email'), size: 18, font: 'Calibri', color: '666666' }),
                                ],
                            }),
                        ],
                    }),
                },
                children: [
                    // === Recipient ===
                    ...recipientParagraphs,

                    // === Date (right-aligned) ===
                    emptyPara(100),
                    bodyPara(formatDate(data.signatureDate, data.signaturePlace), {
                        align: AlignmentType.RIGHT,
                        after: 300,
                    }),

                    // === Subject (bold) ===
                    bodyPara(subjectText, { bold: true, after: 300 }),

                    // === Salutation ===
                    bodyPara(t('doc_salutation'), { after: 200 }),

                    // === Context ===
                    ...(data.contextText ? data.contextText.split('\n').filter(p => p.trim()).map(p =>
                        bodyPara(p.trim())
                    ) : []),

                    // === Measures ===
                    ...(data.measuresText ? data.measuresText.split('\n').filter(p => p.trim()).map(p =>
                        bodyPara(p.trim())
                    ) : []),

                    // === Facts list ===
                    ...factsParagraphs,

                    // === Facts conclusion ===
                    ...(data.factsConclusion ? data.factsConclusion.split('\n').filter(p => p.trim()).map(p =>
                        bodyPara(p.trim())
                    ) : []),

                    // === Additional info ===
                    ...(data.additionalInfo ? data.additionalInfo.split('\n').filter(p => p.trim()).map(p =>
                        bodyPara(p.trim())
                    ) : []),

                    // === Request ===
                    ...(data.requestText ? data.requestText.split('\n').filter(p => p.trim()).map(p =>
                        bodyPara(p.trim())
                    ) : []),

                    // === Closing ===
                    bodyPara(t('doc_closing'), { after: 200 }),
                    bodyPara(t('doc_regards'), { after: 400 }),

                    // === Signatures ===
                    emptyPara(200),
                    ...(data.signatory1Name || data.signatory2Name ? [
                        new Paragraph({
                            alignment: AlignmentType.LEFT,
                            spacing: { after: 0 },
                            children: [
                                ...(data.signatory1Name ? [
                                    new TextRun({ text: data.signatory1Name, bold: true, size: 24, font: 'Calibri' }),
                                ] : []),
                                ...(data.signatory2Name ? [
                                    new TextRun({ text: '\t\t\t\t', size: 24 }),
                                    new TextRun({ text: data.signatory2Name, bold: true, size: 24, font: 'Calibri' }),
                                ] : []),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 0 },
                            children: [
                                ...(data.signatory1Role ? [
                                    new TextRun({ text: data.signatory1Role, size: 22, font: 'Calibri', color: '444444' }),
                                ] : []),
                                ...(data.signatory2Role ? [
                                    new TextRun({ text: '\t\t\t\t', size: 22 }),
                                    new TextRun({ text: data.signatory2Role, size: 22, font: 'Calibri', color: '444444' }),
                                ] : []),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 0 },
                            children: [
                                ...(data.signatory1Email ? [
                                    new TextRun({ text: data.signatory1Email, size: 20, font: 'Calibri', color: '666666' }),
                                ] : []),
                                ...(data.signatory2Email ? [
                                    new TextRun({ text: '\t\t\t\t', size: 20 }),
                                    new TextRun({ text: data.signatory2Email, size: 20, font: 'Calibri', color: '666666' }),
                                ] : []),
                            ],
                        }),
                        new Paragraph({
                            spacing: { after: 0 },
                            children: [
                                ...(data.signatory1Phone ? [
                                    new TextRun({ text: data.signatory1Phone, size: 20, font: 'Calibri', color: '666666' }),
                                ] : []),
                                ...(data.signatory2Phone ? [
                                    new TextRun({ text: '\t\t\t\t', size: 20 }),
                                    new TextRun({ text: data.signatory2Phone, size: 20, font: 'Calibri', color: '666666' }),
                                ] : []),
                            ],
                        }),
                    ] : []),
                ],
            }],
        });

        // Generate and download
        const blob = await Packer.toBlob(doc);
        const studentName = (data.studentName || 'Eleve').trim().replace(/\s+/g, '_');
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const filename = `${dateStr} Signalement MiTe ${data.studentName || 'Eleve'}.docx`;

        saveAs(blob, filename);
        return filename;
    }
}
