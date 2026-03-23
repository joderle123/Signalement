// ============================================================
// CDSE Bezugsarbeit Tool - Datendefinitionen
// ============================================================

// Zuordnung: Thema-ID → Arbeitsblatt-Datei(en)
const ARBEITSBLÄTTER = {
  'emotionserkennung':     [{ titel: 'Meine Gefühle kennenlernen',         datei: 'emotionserkennung.html' }],
  'emotionsregulation':    [{ titel: 'Meine Gefühle regulieren',            datei: 'emotionsregulation.html' }],
  'wut-aggression':        [{ titel: 'Meine Wut verstehen & steuern',       datei: 'wut-aggression.html' }],
  'stress-angst':          [{ titel: 'Stress & Angst verstehen',            datei: 'stress-angst.html' }],
  'selbstwertgefuehl':     [{ titel: 'Mein Selbstwertgefühl stärken',       datei: 'selbstwertgefuehl.html' }],
  'depressive-stimmungen': [{ titel: 'Mein Selbstwertgefühl stärken',       datei: 'selbstwertgefuehl.html' }],
  'trauer-verlust':        [{ titel: 'Trauer & Verlust',                    datei: 'trauer-verlust.html' }],
  'freude-wohlbefinden':   [{ titel: 'Meine Gefühle kennenlernen',          datei: 'emotionserkennung.html' }],
  'cannabis':              [{ titel: 'Cannabis & Konsum – Fakten & Motive', datei: 'konsum-cannabis.html' }],
  'selbstmedikation':      [{ titel: 'Cannabis & Konsum – Fakten & Motive', datei: 'konsum-cannabis.html' }],
  'freundschaften':        [{ titel: 'Freundschaft & Konflikte',            datei: 'freundschaft-konflikte.html' }],
  'konfliktmanagement':    [{ titel: 'Freundschaft & Konflikte',            datei: 'freundschaft-konflikte.html' },
                            { titel: 'Kommunikation & Grenzen setzen',      datei: 'kommunikation-grenzen.html' }],
  'kommunikation':         [{ titel: 'Kommunikation & Grenzen setzen',      datei: 'kommunikation-grenzen.html' }],
  'grenzen-setzen':        [{ titel: 'Kommunikation & Grenzen setzen',      datei: 'kommunikation-grenzen.html' }],
  'mobbing':               [{ titel: 'Mobbing & Cybermobbing',              datei: 'mobbing-cybermobbing.html' }],
  'gruppendynamik':        [{ titel: 'Mobbing & Cybermobbing',              datei: 'mobbing-cybermobbing.html' }],
  'empathie':              [{ titel: 'Kommunikation & Grenzen setzen',      datei: 'kommunikation-grenzen.html' }],
  'romantische-beziehungen': [{ titel: 'Romantische Beziehungen & Liebe',  datei: 'romantische-beziehungen.html' }],
  'berufsorientierung':    [{ titel: 'Meine Zukunft – Wer will ich werden?', datei: 'zukunftsplanung.html' }],
  'zukunftsplanung':       [{ titel: 'Meine Zukunft – Wer will ich werden?', datei: 'zukunftsplanung.html' }],
  'motivation':            [{ titel: 'Meine Zukunft – Wer will ich werden?', datei: 'zukunftsplanung.html' },
                            { titel: 'Lernstrategien & Schule',              datei: 'lernstrategien-schule.html' }],
  'lernstrategien':        [{ titel: 'Lernstrategien & Schule',              datei: 'lernstrategien-schule.html' }],
  'schulisches-engagement':[{ titel: 'Lernstrategien & Schule',              datei: 'lernstrategien-schule.html' }],
  'prüfungsangst':         [{ titel: 'Lernstrategien & Schule',              datei: 'lernstrategien-schule.html' }],
  'krisenintervention':    [{ titel: 'Mein Sicherheitsplan',                datei: 'krisenplan.html' }],
  'suizidpraevention':     [{ titel: 'Mein Sicherheitsplan',                datei: 'krisenplan.html' }],
  'selbstverletzung':      [{ titel: 'Mein Sicherheitsplan',                datei: 'krisenplan.html' }],
  'resilienz':             [{ titel: 'Resilienz & Stärken',                 datei: 'resilienz-staerken.html' }],
  'lebenssinn':            [{ titel: 'Resilienz & Stärken',                 datei: 'resilienz-staerken.html' }],
  'zugehoerigkeit':        [{ titel: 'Resilienz & Stärken',                 datei: 'resilienz-staerken.html' }],
  // Familie
  'familienzusammensetzung': [{ titel: 'Meine Familie verstehen',           datei: 'familie.html' }],
  'eltern-kind-beziehung':   [{ titel: 'Meine Familie verstehen',           datei: 'familie.html' }],
  'geschwister':             [{ titel: 'Meine Familie verstehen',           datei: 'familie.html' }],
  'wohnsituation':           [{ titel: 'Meine Familie verstehen',           datei: 'familie.html' }],
  'trennung-scheidung':      [{ titel: 'Meine Familie verstehen',           datei: 'familie.html' }],
  'genogramm':               [{ titel: 'Meine Familie verstehen',           datei: 'familie.html' }],
  // Konsum
  'alkohol':                 [{ titel: 'Alkohol – Was ich wirklich wissen sollte', datei: 'konsum-alkohol.html' }],
  'tabak':                   [{ titel: 'Tabak & E-Zigarette',                     datei: 'konsum-tabak.html' }],
  'e-zigarette':             [{ titel: 'Tabak & E-Zigarette',                     datei: 'konsum-tabak.html' }],
  'nikotin':                 [{ titel: 'Tabak & E-Zigarette',                     datei: 'konsum-tabak.html' }],
  'rauchen':                 [{ titel: 'Tabak & E-Zigarette',                     datei: 'konsum-tabak.html' }],
  // Gesundheit
  'schlaf':                  [{ titel: 'Schlaf, Gesundheit & Energie',      datei: 'schlaf-gesundheit.html' }],
  'ernaehrung':              [{ titel: 'Schlaf, Gesundheit & Energie',      datei: 'schlaf-gesundheit.html' }],
  'sport-bewegung':          [{ titel: 'Schlaf, Gesundheit & Energie',      datei: 'schlaf-gesundheit.html' }],
  // Identität
  'selbstbild':              [{ titel: 'Wer bin ich? – Meine Identität',    datei: 'identitaet.html' }],
  'werte-moral':             [{ titel: 'Wer bin ich? – Meine Identität',    datei: 'identitaet.html' }],
  'kulturelle-identitaet':   [{ titel: 'Wer bin ich? – Meine Identität',   datei: 'identitaet.html' }],
  'lebenssinn':              [{ titel: 'Wer bin ich? – Meine Identität',    datei: 'identitaet.html' }],
  // Soziale Medien & Gaming
  'social-media':            [{ titel: 'Soziale Medien & Gaming',           datei: 'soziale-medien-gaming.html' }],
  'gaming':                  [{ titel: 'Soziale Medien & Gaming',           datei: 'soziale-medien-gaming.html' }],
  'mediennutzung':           [{ titel: 'Soziale Medien & Gaming',           datei: 'soziale-medien-gaming.html' }],
  // Trauma
  'trauma':                  [{ titel: 'Trauma verstehen & Stabilität finden', datei: 'trauma-stabilisierung.html' }],
  'trennungsangst':          [{ titel: 'Trauma verstehen & Stabilität finden', datei: 'trauma-stabilisierung.html' }],
  // Körperbild & Sexualität
  'sexualitaet':             [{ titel: 'Körper, Pubertät & Sexualität',     datei: 'koerperbild-sexualitaet.html' }],
  'koerperbild':             [{ titel: 'Körper, Pubertät & Sexualität',     datei: 'koerperbild-sexualitaet.html' }],
  'geschlechtsidentitaet':   [{ titel: 'Körper, Pubertät & Sexualität',     datei: 'koerperbild-sexualitaet.html' }],
  // Gewalt & Schutz
  'gewalt':                  [{ titel: 'Gewalt & Schutz',                   datei: 'gewalt-schutz.html' }],
  'missbrauch':              [{ titel: 'Gewalt & Schutz',                   datei: 'gewalt-schutz.html' }],
  'sicherheit':              [{ titel: 'Gewalt & Schutz',                   datei: 'gewalt-schutz.html' }],
  'haeusliche-gewalt':       [{ titel: 'Gewalt & Schutz',                   datei: 'gewalt-schutz.html' }],
  // Finanzen
  'finanzen':                [{ titel: 'Finanzen & Geld',                   datei: 'finanzen-geld.html' }],
  'schulden':                [{ titel: 'Finanzen & Geld',                   datei: 'finanzen-geld.html' }],
  'taschengeld':             [{ titel: 'Finanzen & Geld',                   datei: 'finanzen-geld.html' }],
  'budget':                  [{ titel: 'Finanzen & Geld',                   datei: 'finanzen-geld.html' }],
};

// ============================================================
// Aktivitäten & Interventionen pro Thema
// ============================================================
const THEMA_AKTIVITÄTEN = {
  'familienzusammensetzung': [
    { titel: 'Familienbild malen', beschreibung: 'Zeichne deine Familie so, wie du sie siehst – Personen, Tiere, wichtige Orte.', dauer: '20 Min' },
    { titel: 'Familienrollen-Karten', beschreibung: 'Lege Karten mit typischen Familienrollen aus und ordne sie deinen Familienmitgliedern zu.', dauer: '15 Min' },
    { titel: 'Meine Familie in 5 Wörtern', beschreibung: 'Nenne 5 Wörter, die deine Familie beschreiben – gut und weniger gut.', dauer: '10 Min' },
  ],
  'eltern-kind-beziehung': [
    { titel: 'Brief an Elternteil', beschreibung: 'Schreibe einen Brief an ein Elternteil – was du sagen möchtest, aber nie konntest.', dauer: '20 Min' },
    { titel: 'Beziehungsthermometer', beschreibung: 'Bewerte die Beziehung zu Mutter und Vater auf einer Skala von 1–10 und erkläre warum.', dauer: '10 Min' },
    { titel: 'Positive Momente sammeln', beschreibung: 'Erinnere dich an 3 schöne Momente mit deinen Eltern und erzähle davon.', dauer: '15 Min' },
  ],
  'geschwister': [
    { titel: 'Geschwister-Stärken-Map', beschreibung: 'Schreibe für jedes Geschwister eine Stärke auf – auch wenn die Beziehung schwierig ist.', dauer: '15 Min' },
    { titel: 'Konflikt-Tagebuch', beschreibung: 'Beschreibe einen typischen Geschwisterkonflikt und überlege, wie er anders laufen könnte.', dauer: '15 Min' },
  ],
  'wohnsituation': [
    { titel: 'Mein Zimmer / mein Rückzugsort', beschreibung: 'Zeichne oder beschreibe deinen persönlichen Rückzugsort zuhause. Hast du einen?', dauer: '15 Min' },
    { titel: 'Sicherheits-Check', beschreibung: 'Was macht zuhause sicher / unsicher? Liste Punkte auf.', dauer: '10 Min' },
  ],
  'trennung-scheidung': [
    { titel: 'Zwei-Häuser-Bild', beschreibung: 'Male oder beschreibe dein Leben zwischen zwei Zuhause – was ist in jedem Haus anders?', dauer: '20 Min' },
    { titel: 'Gefühls-Kompass Scheidung', beschreibung: 'Welche Gefühle tauchen auf, wenn du an die Trennung denkst? Benenne und ordne sie.', dauer: '15 Min' },
    { titel: 'Was ich mir wünsche', beschreibung: 'Formuliere drei Wünsche an deine Eltern bezüglich ihrer Trennung.', dauer: '10 Min' },
  ],
  'genogramm': [
    { titel: 'Familienstammbaum zeichnen', beschreibung: 'Zeichne deinen Familienstammbaum über 3 Generationen – Großeltern, Eltern, Geschwister.', dauer: '30 Min' },
    { titel: 'Familiengeschichten', beschreibung: 'Erzähle eine Geschichte aus deiner Familiengeschichte, die dir wichtig ist.', dauer: '20 Min' },
  ],
  'pflegefamilie': [
    { titel: 'Meine Geschichte', beschreibung: 'Schreibe oder erzähle deine Lebensgeschichte – woher du kommst und wo du jetzt bist.', dauer: '25 Min' },
    { titel: 'Wichtige Personen in meinem Leben', beschreibung: 'Zeichne ein Netzwerk aller Menschen, die dir wichtig sind – Familie, Pflege, Freunde.', dauer: '20 Min' },
  ],

  // ── Emotionen ──────────────────────────────────────────────
  'emotionserkennung': [
    { titel: 'Gefühls-Tagebuch', beschreibung: 'Schreibe täglich 3 Gefühle auf, die du erlebt hast – mit Auslöser und Körpergefühl.', dauer: '5 Min täglich' },
    { titel: 'Gefühls-Rad ausfüllen', beschreibung: 'Male ein Rad mit deinen häufigsten Gefühlen – wie groß ist jedes Stück?', dauer: '15 Min' },
    { titel: 'Körper-Landkarte', beschreibung: 'Zeichne einen Körperumriss und markiere, wo du Wut, Angst, Trauer und Freude spürst.', dauer: '20 Min' },
  ],
  'emotionsregulation': [
    { titel: 'Mein Notfallkoffer', beschreibung: 'Sammle 5 persönliche Strategien für schwierige Momente – was hilft dir wirklich?', dauer: '20 Min' },
    { titel: 'Entspannungs-Experiment', beschreibung: 'Probiere 3 verschiedene Entspannungstechniken aus (Atmung, PMR, Visualisierung) und bewerte sie.', dauer: '25 Min' },
  ],
  'wut-aggression': [
    { titel: 'Mein Wut-Auslöser-Kalender', beschreibung: 'Eine Woche lang: Wann, wo und warum war ich wütend? Muster erkennen.', dauer: '5 Min täglich' },
    { titel: 'Wut kreativ rauslassen', beschreibung: 'Zeichne deine Wut – Farben, Formen, Symbole – ohne Worte.', dauer: '15 Min' },
    { titel: 'Stopp-Signal üben', beschreibung: 'Entwickle ein persönliches Stopp-Signal (Wort, Geste) für den Moment, bevor die Wut eskaliert.', dauer: '10 Min' },
  ],
  'stress-angst': [
    { titel: 'Sorgen-Box', beschreibung: 'Schreibe Sorgen auf Zettel und lege sie in eine Box – aus dem Kopf, in die Box.', dauer: '10 Min' },
    { titel: 'Mein Entspannungs-Ritual', beschreibung: 'Entwickle ein 5-minütiges Ritual für stressige Momente (Musik, Atemübung, Bewegung).', dauer: '15 Min' },
    { titel: 'Ressourcen-Oase', beschreibung: 'Stelle dir einen inneren Rückzugsort vor – beschreibe oder zeichne ihn detailliert.', dauer: '20 Min' },
  ],
  'selbstwertgefuehl': [
    { titel: 'Mein Stärken-Poster', beschreibung: 'Erstelle ein Poster mit deinen 10 größten Stärken – mit Beispielen und Symbolen.', dauer: '30 Min' },
    { titel: 'Kompliment-Tagebuch', beschreibung: 'Notiere jedes Kompliment, das du erhältst – und wie es sich anfühlt.', dauer: '5 Min täglich' },
    { titel: 'Brief an mein jüngeres Ich', beschreibung: 'Was würdest du deinem 10-jährigen Ich sagen? Schreibe einen ermutigenden Brief.', dauer: '20 Min' },
  ],
  'depressive-stimmungen': [
    { titel: 'Freude-Liste', beschreibung: 'Schreibe 20 Dinge auf, die dir (früher) Freude gemacht haben – klein und groß.', dauer: '15 Min' },
    { titel: 'Wochenplan mit Highlights', beschreibung: 'Plane für jeden Tag der Woche mindestens eine angenehme Aktivität ein.', dauer: '15 Min' },
  ],
  'trauer-verlust': [
    { titel: 'Abschiedsbrief', beschreibung: 'Schreibe einen Brief an etwas oder jemanden, den du verloren hast – was du sagen möchtest.', dauer: '20 Min' },
    { titel: 'Erinnerungs-Collage', beschreibung: 'Gestalte eine Collage aus Fotos, Symbolen und Wörtern, die die verlorene Person beschreiben.', dauer: '30 Min' },
  ],
  'freude-wohlbefinden': [
    { titel: 'Glücks-Tagebuch', beschreibung: 'Notiere täglich 3 Dinge, für die du dankbar bist oder die dich gefreut haben.', dauer: '5 Min täglich' },
    { titel: 'Mein Flow-Profil', beschreibung: 'Wann verliere ich das Zeitgefühl? Identifiziere deine persönlichen Flow-Aktivitäten.', dauer: '15 Min' },
  ],
};

const THEMA_INTERVENTIONEN = {
  'familienzusammensetzung': [
    { titel: 'Systemische Familienkarte', ansatz: 'Systemisch', beschreibung: 'Gemeinsames Erstellen einer visuellen Familienkarte, um Strukturen und Beziehungen sichtbar zu machen.', indikation: 'Unklarheit über Familienstruktur, neue Patchwork-Konstellationen', dauer: '30–45 Min' },
    { titel: 'Ressourcen-Interview', ansatz: 'Lösungsfokussiert', beschreibung: 'Strukturiertes Interview zu Stärken und Ressourcen innerhalb der Familie.', indikation: 'Defizitfokussierte Sichtweise auf Familie', dauer: '20–30 Min' },
  ],
  'eltern-kind-beziehung': [
    { titel: 'Leerer-Stuhl-Technik', ansatz: 'Gestalttherapie', beschreibung: 'Kind richtet Worte an imaginäres Elternteil auf leerem Stuhl – Gefühle ausdrücken ohne Konfrontation.', indikation: 'Unausgesprochene Konflikte, Distanz zu Elternteil', dauer: '20–30 Min' },
    { titel: 'Bindungsstil-Psychoedukation', ansatz: 'Bindungstheorie', beschreibung: 'Erklärung von Bindungsstilen (sicher/unsicher) und Reflexion des eigenen Bindungsmusters.', indikation: 'Schwierigkeiten in Beziehungen, Verlassensangst', dauer: '25 Min' },
    { titel: 'Beziehungslinie', ansatz: 'Narrativ', beschreibung: 'Zeitlinie der Eltern-Kind-Beziehung zeichnen: Hochpunkte, Tiefpunkte, Wendepunkte.', indikation: 'Ambivalenz gegenüber Elternteil', dauer: '30 Min' },
  ],
  'geschwister': [
    { titel: 'Positionierungsübung', ansatz: 'Systemisch', beschreibung: 'Jugendlicher positioniert sich räumlich zu imaginären Geschwistern – Nähe, Distanz, Rollen.', indikation: 'Geschwisterkonflikte, Rivalität', dauer: '20 Min' },
  ],
  'wohnsituation': [
    { titel: 'Sicherheitsnetz kartieren', ansatz: 'Ressourcenorientiert', beschreibung: 'Welche Menschen, Orte und Routinen geben Sicherheit? Visuell festhalten.', indikation: 'Instabile Wohnsituation, häufige Umzüge', dauer: '20 Min' },
  ],
  'trennung-scheidung': [
    { titel: 'Entlastungsbrief', ansatz: 'Kognitiv-behavioral', beschreibung: 'Kind schreibt Brief, in dem es sich von Schuldgefühlen bezüglich der Elterntrennung entlastet.', indikation: 'Selbstvorwürfe, Schuldgefühle wegen Scheidung', dauer: '20–25 Min' },
    { titel: 'Loyalitätskonflikt bearbeiten', ansatz: 'Systemisch', beschreibung: 'Visualisierung des Loyalitätskonflikts: zwischen welchen Elternteilen steht das Kind? Wege zur Entlastung.', indikation: 'Loyalitätskonflikte, Eltern gegeneinander ausgespielt', dauer: '30 Min' },
  ],
  'genogramm': [
    { titel: 'Mehrgenerationenperspektive', ansatz: 'Systemisch', beschreibung: 'Genogramm über 3 Generationen erstellen und Muster (Trennungen, Verluste, Stärken) benennen.', indikation: 'Wiederkehrende Familienmuster, transgenerationale Weitergabe', dauer: '45–60 Min' },
  ],
  'pflegefamilie': [
    { titel: 'Lebensgeschichtsbuch', ansatz: 'Narrativ', beschreibung: 'Gemeinsames Erstellen eines Buches über die Lebensgeschichte des Jugendlichen – Herkunft bis heute.', indikation: 'Identitätsfragen, Brüche in der Biografie', dauer: 'mehrere Sitzungen' },
    { titel: 'Doppelte Loyalität', ansatz: 'Systemisch', beschreibung: 'Loyalitätskonflikte zwischen Herkunfts- und Pflegefamilie sichtbar machen und bearbeiten.', indikation: 'Ambivalenz zwischen zwei Familien', dauer: '30–40 Min' },
  ],

  // ── Emotionen ──────────────────────────────────────────────
  'emotionserkennung': [
    { titel: 'Gefühls-Barometer', ansatz: 'Emotionsfokussiert', beschreibung: 'Jugendlicher markiert auf einem Thermometer täglich seine Stimmung und benennt den Auslöser.', indikation: 'Schwierigkeiten beim Benennen von Gefühlen', dauer: '10–15 Min' },
    { titel: 'Körper-Scan', ansatz: 'Körpertherapeutisch', beschreibung: 'Wo im Körper spüre ich welches Gefühl? Körperumriss zeichnen und Gefühle einzeichnen.', indikation: 'Dissoziation, mangelndes Körpergefühl', dauer: '20 Min' },
    { titel: 'Gefühlskarten-Sortierung', ansatz: 'Psychoedukativ', beschreibung: 'Gefühlskarten sortieren: welche kenne ich, welche fühle ich oft, welche kaum?', indikation: 'Eingeschränktes emotionales Vokabular', dauer: '15 Min' },
  ],
  'emotionsregulation': [
    { titel: '5-4-3-2-1 Grounding', ansatz: 'Achtsamkeit', beschreibung: '5 Dinge sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken – Rückkehr in den Moment.', indikation: 'Überwältigung, Dissoziation, Flashbacks', dauer: '5–10 Min' },
    { titel: 'Notfallkoffer basteln', ansatz: 'DBT', beschreibung: 'Gemeinsam einen symbolischen Koffer mit persönlichen Regulationsstrategien befüllen.', indikation: 'Fehlende Bewältigungsstrategien', dauer: '25 Min' },
    { titel: 'Ampel-Modell', ansatz: 'Kognitiv-behavioral', beschreibung: 'Grün = ruhig, Gelb = angespannt, Rot = Krise. Signale und Strategien für jede Phase erarbeiten.', indikation: 'Impulsivität, Eskalationsmuster', dauer: '20 Min' },
  ],
  'wut-aggression': [
    { titel: 'Wut-Tagebuch', ansatz: 'Kognitiv-behavioral', beschreibung: 'Auslöser, Gedanken, Körpergefühle und Reaktionen bei Wutepisoden festhalten.', indikation: 'Häufige Wutausbrüche, Fremdaggression', dauer: '10 Min täglich' },
    { titel: 'Wut-Thermometer', ansatz: 'Psychoedukativ', beschreibung: 'Skala von 1–10: Was passiert in mir bei Stufe 3, 6, 9? Frühwarnsignale erkennen.', indikation: 'Mangelnde Selbstwahrnehmung bei Wut', dauer: '15 Min' },
    { titel: 'Alternative Ventile', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Liste mit körperlichen Alternativen zur Wutentladung (Sport, Zerreißen, Schreien im Auto).', indikation: 'Destruktive Wutentladung', dauer: '15 Min' },
  ],
  'stress-angst': [
    { titel: 'Stressoren-Karte', ansatz: 'Kognitiv-behavioral', beschreibung: 'Alle Stressquellen aufschreiben und in beeinflussbar / nicht beeinflussbar einteilen.', indikation: 'Generalisierter Stress, Überforderung', dauer: '20 Min' },
    { titel: 'Atemübung 4-7-8', ansatz: 'Physiologisch', beschreibung: '4 Sek einatmen, 7 Sek halten, 8 Sek ausatmen. Aktiviert den Parasympathikus.', indikation: 'Akute Angst, Panikattacken', dauer: '5 Min' },
    { titel: 'Sorgenzeit einführen', ansatz: 'Kognitiv-behavioral', beschreibung: '10 Min täglich bewusst für Sorgen einplanen – außerhalb dieser Zeit Gedanken verschieben.', indikation: 'Grübeln, Gedankenkarussell', dauer: '10 Min täglich' },
  ],
  'selbstwertgefuehl': [
    { titel: 'Stärken-Inventar', ansatz: 'Positive Psychologie', beschreibung: '10 persönliche Stärken aufschreiben – mit Beispielen aus dem Alltag belegen.', indikation: 'Negatives Selbstbild, Selbstkritik', dauer: '20 Min' },
    { titel: 'Innerer Kritiker vs. Innerer Coach', ansatz: 'Schematherapie', beschreibung: 'Typische Selbstkritik aufschreiben und in eine wohlwollende Coach-Stimme umformulieren.', indikation: 'Perfektionismus, harte Selbstkritik', dauer: '20 Min' },
    { titel: 'Erfolgs-Tagebuch', ansatz: 'Kognitiv-behavioral', beschreibung: 'Täglich 3 kleine Erfolge notieren – unabhängig von Leistung.', indikation: 'Niedriges Selbstwertgefühl, Hoffnungslosigkeit', dauer: '5 Min täglich' },
  ],
  'depressive-stimmungen': [
    { titel: 'Aktivitätsplanung', ansatz: 'Verhaltensaktivierung', beschreibung: 'Angenehme Aktivitäten planen und im Stimmungs-Tagebuch mit Wohlbefinden verknüpfen.', indikation: 'Rückzug, Antriebslosigkeit', dauer: '20 Min' },
    { titel: 'Gedankenprotokoll', ansatz: 'Kognitiv-behavioral', beschreibung: 'Negative automatische Gedanken identifizieren und realistische Alternativen erarbeiten.', indikation: 'Negative Denkmuster, Hoffnungslosigkeit', dauer: '20–30 Min' },
  ],
  'trauer-verlust': [
    { titel: 'Erinnerungsbox', ansatz: 'Trauertherapie', beschreibung: 'Eine symbolische Box befüllen mit Dingen, Fotos oder Texten, die an die verlorene Person erinnern.', indikation: 'Trauer nach Verlust, Abschied', dauer: '30 Min' },
    { titel: 'Brief an die verstorbene Person', ansatz: 'Narrativ', beschreibung: 'Ungesagte Dinge in einem Brief ausdrücken – was ich noch sagen wollte.', indikation: 'Komplizierte Trauer, Schuldgefühle', dauer: '20 Min' },
    { titel: 'Trauerphasen-Psychoedukation', ansatz: 'Psychoedukativ', beschreibung: 'Trauerphasen nach Kübler-Ross erklären und einordnen, wo man sich gerade befindet.', indikation: 'Normalisierungsbedarf, Verstehen der eigenen Reaktion', dauer: '15 Min' },
  ],
  'freude-wohlbefinden': [
    { titel: 'Freuden-Inventar', ansatz: 'Positive Psychologie', beschreibung: 'Liste von 20 Dingen, die Freude machen – groß und klein. Wie oft kommen sie vor?', indikation: 'Freudlosigkeit, Anhedonie', dauer: '15 Min' },
    { titel: 'Flow-Erlebnisse finden', ansatz: 'Positive Psychologie', beschreibung: 'Wann verliere ich das Zeitgefühl? Flow-Momente identifizieren und gezielt einplanen.', indikation: 'Fehlende Motivation, Langeweile', dauer: '20 Min' },
  ],
};

const THEMEN_KATEGORIEN = [
  {
    id: 'familie',
    titel: 'Familie & Soziales Umfeld',
    icon: '🏠',
    farbe: '#4A90D9',
    themen: [
      { id: 'familienzusammensetzung', titel: 'Familienzusammensetzung', beschreibung: 'Eltern, Geschwister, Patchwork, Alleinerziehend' },
      { id: 'eltern-kind-beziehung', titel: 'Eltern-Kind-Beziehung', beschreibung: 'Bindung, Kommunikation, Konflikte mit Eltern' },
      { id: 'geschwister', titel: 'Geschwisterbeziehungen', beschreibung: 'Dynamik, Rivalität, Unterstützung' },
      { id: 'wohnsituation', titel: 'Wohnsituation', beschreibung: 'Wohnverhältnisse, Stabilität, Umzüge' },
      { id: 'trennung-scheidung', titel: 'Trennung & Scheidung', beschreibung: 'Umgang mit elterlicher Trennung' },
      { id: 'soziales-netzwerk', titel: 'Soziales Netzwerk', beschreibung: 'Ressourcen, Unterstützungspersonen, Isolation' },
      { id: 'genogramm', titel: 'Genogramm', beschreibung: 'Familienstammbaum, Mehrgenerationenperspektive' },
      { id: 'pflegefamilie', titel: 'Pflegefamilie / Heimunterbringung', beschreibung: 'Fremdunterbringung, Bindung, Übergänge' },
    ]
  },
  {
    id: 'emotionen',
    titel: 'Emotionen & Wohlbefinden',
    icon: '💙',
    farbe: '#7B5EA7',
    themen: [
      { id: 'emotionserkennung', titel: 'Emotionserkennung', beschreibung: 'Gefühle benennen, Körpersignale verstehen' },
      { id: 'emotionsregulation', titel: 'Emotionsregulation', beschreibung: 'Strategien zur Gefühlssteuerung' },
      { id: 'stress-angst', titel: 'Stress & Angst', beschreibung: 'Stressoren erkennen, Angstbewältigung' },
      { id: 'wut-aggression', titel: 'Wut & Aggression', beschreibung: 'Wutmanagement, konstruktiver Ausdruck' },
      { id: 'trauer-verlust', titel: 'Trauer & Verlust', beschreibung: 'Trauerprozesse, Abschiede, Verlusterfahrungen' },
      { id: 'selbstwertgefuehl', titel: 'Selbstwertgefühl', beschreibung: 'Selbstbild, Stärken erkennen, Kritik umgehen' },
      { id: 'depressive-stimmungen', titel: 'Depressive Stimmungen', beschreibung: 'Antriebslosigkeit, Hoffnungslosigkeit, Rückzug' },
      { id: 'freude-wohlbefinden', titel: 'Freude & Wohlbefinden', beschreibung: 'Positive Emotionen stärken, Flow-Erlebnisse' },
    ]
  },
  {
    id: 'soziale-kompetenzen',
    titel: 'Soziale Kompetenzen',
    icon: '🤝',
    farbe: '#27AE60',
    themen: [
      { id: 'freundschaften', titel: 'Freundschaften', beschreibung: 'Freundschaften aufbauen & pflegen' },
      { id: 'konfliktmanagement', titel: 'Konfliktmanagement', beschreibung: 'Konflikte lösen, Mediation' },
      { id: 'kommunikation', titel: 'Kommunikation', beschreibung: 'Aktives Zuhören, gewaltfreie Kommunikation' },
      { id: 'romantische-beziehungen', titel: 'Romantische Beziehungen', beschreibung: 'Liebe, Partnerschaft, Trennung' },
      { id: 'grenzen-setzen', titel: 'Grenzen setzen', beschreibung: 'Nein sagen, eigene Grenzen kennen & respektieren' },
      { id: 'mobbing', titel: 'Mobbing & Ausgrenzung', beschreibung: 'Cybermobbing, Opfer/Täter/Zuschauer' },
      { id: 'gruppendynamik', titel: 'Gruppendynamik', beschreibung: 'Peer-Pressure, Rollen in der Gruppe' },
      { id: 'empathie', titel: 'Empathie & Perspektivenwechsel', beschreibung: 'Sich in andere hineinversetzen' },
    ]
  },
  {
    id: 'konsum',
    titel: 'Konsum & Risikoverhalten',
    icon: '⚠️',
    farbe: '#E67E22',
    themen: [
      { id: 'alkohol', titel: 'Alkohol', beschreibung: 'Konsum, Risiken, Sucht, Prävention' },
      { id: 'cannabis', titel: 'Cannabis & illegale Drogen', beschreibung: 'Wirkung, Risiken, Abhängigkeit' },
      { id: 'tabak-ezigarette', titel: 'Tabak & E-Zigarette', beschreibung: 'Rauchen, Nikotinsucht, Ausstieg' },
      { id: 'gaming', titel: 'Gaming & Bildschirmzeit', beschreibung: 'Exzessives Spielen, Suchtpotenzial' },
      { id: 'social-media', titel: 'Social Media & Internet', beschreibung: 'Nutzungsverhalten, Vergleiche, FOMO' },
      { id: 'gluecksspiel', titel: 'Glücksspiel & Wetten', beschreibung: 'Online-Wetten, Spielsucht' },
      { id: 'selbstmedikation', titel: 'Selbstmedikation', beschreibung: 'Umgang mit Medikamenten, Missbrauch' },
    ]
  },
  {
    id: 'schule-zukunft',
    titel: 'Schule & Zukunft',
    icon: '📚',
    farbe: '#2980B9',
    themen: [
      { id: 'schulisches-engagement', titel: 'Schulisches Engagement', beschreibung: 'Motivation, Anwesenheit, Beteiligung' },
      { id: 'lernstrategien', titel: 'Lernstrategien', beschreibung: 'Arbeitsorganisation, Lernmethoden' },
      { id: 'schulkonflikt', titel: 'Schulkonflikte', beschreibung: 'Konflikte mit Lehrern / Mitschülern' },
      { id: 'berufsorientierung', titel: 'Berufsorientierung', beschreibung: 'Interessen erkunden, Berufsfelder, Praktika' },
      { id: 'zukunftsplanung', titel: 'Zukunftsplanung', beschreibung: 'Ziele setzen, Lebensplanung, Träume' },
      { id: 'motivation', titel: 'Motivation & Antrieb', beschreibung: 'Intrinsische Motivation, Zielorientierung' },
      { id: 'prüfungsangst', titel: 'Prüfungsangst', beschreibung: 'Leistungsdruck, Prüfungsvorbereitung' },
    ]
  },
  {
    id: 'gesundheit',
    titel: 'Gesundheit & Körper',
    icon: '💪',
    farbe: '#16A085',
    themen: [
      { id: 'schlaf', titel: 'Schlaf & Erholung', beschreibung: 'Schlafroutine, Schlafqualität, Chronotyp' },
      { id: 'ernaehrung', titel: 'Ernährung', beschreibung: 'Essgewohnheiten, Essstörungen, Körperbild' },
      { id: 'sport-bewegung', titel: 'Sport & Bewegung', beschreibung: 'Sportgewohnheiten, Körperwahrnehmung' },
      { id: 'sexualitaet', titel: 'Sexualität & Körper', beschreibung: 'Pubertät, Aufklärung, Verhütung, Identität' },
      { id: 'koerperbild', titel: 'Körperbild & Aussehen', beschreibung: 'Selbstwahrnehmung, Körperzufriedenheit' },
      { id: 'mentale-gesundheit', titel: 'Mentale Gesundheit', beschreibung: 'Psychische Stabilität, Ressourcen, Hilfe suchen' },
      { id: 'chronische-erkrankung', titel: 'Chronische Erkrankungen', beschreibung: 'Umgang mit körperlichen Einschränkungen' },
    ]
  },
  {
    id: 'alltag-mobilitaet',
    titel: 'Alltag & Mobilität',
    icon: '🚌',
    farbe: '#8E44AD',
    themen: [
      { id: 'transport', titel: 'Transport & Mobilität', beschreibung: 'Öffentlicher Transport, Führerschein, Fahrrad' },
      { id: 'finanzen', titel: 'Finanzen & Taschengeld', beschreibung: 'Umgang mit Geld, Budgetplanung, Schulden' },
      { id: 'haushalt', titel: 'Haushaltsführung', beschreibung: 'Kochen, Putzen, Selbstversorgung' },
      { id: 'freizeit', titel: 'Freizeit & Hobbys', beschreibung: 'Freizeitgestaltung, Interessen, Kreativität' },
      { id: 'mediennutzung', titel: 'Mediennutzung & Digital Literacy', beschreibung: 'Kritischer Umgang mit Medien, Fake News' },
      { id: 'ehrenamt', titel: 'Ehrenamt & Engagement', beschreibung: 'Gesellschaftliches Engagement, Sinn & Zweck' },
    ]
  },
  {
    id: 'recht-gesellschaft',
    titel: 'Recht & Gesellschaft',
    icon: '⚖️',
    farbe: '#C0392B',
    themen: [
      { id: 'jugendrecht', titel: 'Jugendrecht & Gesetze', beschreibung: 'Rechtliche Grundlagen für Jugendliche in Luxemburg' },
      { id: 'jugendschutz', titel: 'Jugendschutz', beschreibung: 'Schutzrechte, Meldepflicht, Behörden' },
      { id: 'soziale-dienste', titel: 'Soziale Dienste & Hilfsangebote', beschreibung: 'SCAS, OPJ, Krisentelefon, Beratungsstellen' },
      { id: 'polizei-justiz', titel: 'Polizei & Justiz', beschreibung: 'Straftaten, Konsequenzen, Jugendgericht' },
      { id: 'buergerrechte', titel: 'Bürgerrechte & Demokratie', beschreibung: 'Rechte & Pflichten, politische Teilhabe' },
      { id: 'diskriminierung', titel: 'Diskriminierung & Rassismus', beschreibung: 'Erfahrungen, Rechte, Gegenstrategien' },
    ]
  },
  {
    id: 'identitaet',
    titel: 'Identität & Werte',
    icon: '🌟',
    farbe: '#F39C12',
    themen: [
      { id: 'selbstbild', titel: 'Selbstbild & Identität', beschreibung: 'Wer bin ich? Selbstkonzept, Rollen' },
      { id: 'werte-moral', titel: 'Werte & Moral', beschreibung: 'Eigene Werte kennen, moralische Entwicklung' },
      { id: 'kulturelle-identitaet', titel: 'Kulturelle Identität', beschreibung: 'Herkunft, Sprache, bikulturelle Identität' },
      { id: 'geschlechtsidentitaet', titel: 'Geschlechtsidentität & Sexuelle Orientierung', beschreibung: 'LGBTIQ+, Coming Out, Akzeptanz' },
      { id: 'spiritualitaet', titel: 'Spiritualität & Religion', beschreibung: 'Glaube, Spiritualität, Gemeinschaft' },
      { id: 'zugehoerigkeit', titel: 'Zugehörigkeit & Ausgrenzung', beschreibung: 'Dazugehören, Außenseiter, soziale Inklusion' },
      { id: 'lebenssinn', titel: 'Lebenssinn & Lebensfreude', beschreibung: 'Bedeutung finden, Ressourcen aktivieren' },
    ]
  },
  {
    id: 'krise-trauma',
    titel: 'Krisen & Trauma',
    icon: '🆘',
    farbe: '#E74C3C',
    themen: [
      { id: 'krisenintervention', titel: 'Krisenintervention', beschreibung: 'Akute Krisen erkennen und stabilisieren' },
      { id: 'trauma', titel: 'Trauma & Traumaverarbeitung', beschreibung: 'Traumafolgen, Stabilisierungstechniken' },
      { id: 'suizidpraevention', titel: 'Suizidprävention', beschreibung: 'Risikoerkennung, Sicherheitsplanung, Ressourcen' },
      { id: 'selbstverletzung', titel: 'Selbstverletzung', beschreibung: 'NSSI, Ursachen, Alternativstrategien' },
      { id: 'gewalt', titel: 'Gewalt & Missbrauch', beschreibung: 'Häusliche Gewalt, sexueller Missbrauch, Schutz' },
      { id: 'resilienz', titel: 'Resilienz & Schutzfaktoren', beschreibung: 'Stärken aufbauen, Widerstandsfähigkeit' },
      { id: 'trennungsangst', titel: 'Trennungsangst & Verlassensangst', beschreibung: 'Bindungsangst, Sicherheit aufbauen' },
    ]
  },
];

// ============================================================
// Status-Definitionen
// ============================================================
const THEMA_STATUS = {
  'nicht-begonnen': { label: 'Nicht begonnen', farbe: '#BDC3C7', icon: '○' },
  'in-bearbeitung': { label: 'In Bearbeitung', farbe: '#3498DB', icon: '◐' },
  'abgeschlossen': { label: 'Abgeschlossen', farbe: '#27AE60', icon: '●' },
  'nicht-relevant': { label: 'Nicht relevant', farbe: '#95A5A6', icon: '—' },
};

const NOTIZ_KATEGORIEN = {
  'session': { label: 'Sitzung', farbe: '#3498DB', icon: '💬' },
  'beobachtung': { label: 'Beobachtung', farbe: '#F39C12', icon: '👁' },
  'wichtig': { label: 'Wichtig', farbe: '#E74C3C', icon: '⚠️' },
  'fortschritt': { label: 'Fortschritt', farbe: '#27AE60', icon: '📈' },
  'elternkontakt': { label: 'Elternkontakt', farbe: '#8E44AD', icon: '📞' },
};

const TERMIN_TYPEN = {
  'gespraech': { label: 'Gespräch', farbe: '#3498DB', icon: '💬' },
  'termin': { label: 'Termin', farbe: '#E67E22', icon: '📅' },
  'ereignis': { label: 'Ereignis', farbe: '#9B59B6', icon: '⚡' },
  'ziel': { label: 'Ziel', farbe: '#27AE60', icon: '🎯' },
  'elterngespraech': { label: 'Elterngespräch', farbe: '#C0392B', icon: '👨‍👩‍👦' },
};

// ============================================================
// Datenverwaltung (localStorage)
// ============================================================
const DB = {
  KEYS: {
    SCHUELER: 'cdse_schueler',
    NOTIZEN: 'cdse_notizen',
    TERMINE: 'cdse_termine',
  },

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  },

  // Schüler
  getSchueler() {
    return JSON.parse(localStorage.getItem(this.KEYS.SCHUELER) || '[]');
  },
  saveSchueler(schuelerListe) {
    localStorage.setItem(this.KEYS.SCHUELER, JSON.stringify(schuelerListe));
  },
  getSchuelerById(id) {
    return this.getSchueler().find(s => s.id === id) || null;
  },
  createSchueler(daten) {
    const schuelerListe = this.getSchueler();
    const neuerSchueler = {
      id: this.generateId(),
      vorname: daten.vorname || '',
      nachname: daten.nachname || '',
      geburtsdatum: daten.geburtsdatum || '',
      klasse: daten.klasse || '',
      eintrittsdatum: daten.eintrittsdatum || new Date().toISOString().split('T')[0],
      foto: daten.foto || null,
      allgemeineNotizen: daten.allgemeineNotizen || '',
      topicStatus: {},
      topicNotizen: {},
      risiko: daten.risiko || 'niedrig',
      ziele: daten.ziele || [],
      erstellt: new Date().toISOString(),
      geaendert: new Date().toISOString(),
    };
    schuelerListe.push(neuerSchueler);
    this.saveSchueler(schuelerListe);
    return neuerSchueler;
  },
  updateSchueler(id, daten) {
    const schuelerListe = this.getSchueler();
    const idx = schuelerListe.findIndex(s => s.id === id);
    if (idx === -1) return null;
    schuelerListe[idx] = { ...schuelerListe[idx], ...daten, geaendert: new Date().toISOString() };
    this.saveSchueler(schuelerListe);
    return schuelerListe[idx];
  },
  deleteSchueler(id) {
    const schuelerListe = this.getSchueler().filter(s => s.id !== id);
    this.saveSchueler(schuelerListe);
    // Notizen und Termine auch löschen
    const notizen = this.getNotizen().filter(n => n.schuelerId !== id);
    localStorage.setItem(this.KEYS.NOTIZEN, JSON.stringify(notizen));
    const termine = this.getTermine().filter(t => t.schuelerId !== id);
    localStorage.setItem(this.KEYS.TERMINE, JSON.stringify(termine));
  },

  // Notizen
  getNotizen(schuelerId = null) {
    const alle = JSON.parse(localStorage.getItem(this.KEYS.NOTIZEN) || '[]');
    return schuelerId ? alle.filter(n => n.schuelerId === schuelerId) : alle;
  },
  createNotiz(daten) {
    const alle = this.getNotizen();
    const neu = {
      id: this.generateId(),
      schuelerId: daten.schuelerId,
      datum: daten.datum || new Date().toISOString().split('T')[0],
      inhalt: daten.inhalt || '',
      kategorie: daten.kategorie || 'session',
      themaId: daten.themaId || null,
      erstellt: new Date().toISOString(),
    };
    alle.push(neu);
    localStorage.setItem(this.KEYS.NOTIZEN, JSON.stringify(alle));
    return neu;
  },
  deleteNotiz(id) {
    const alle = this.getNotizen().filter(n => n.id !== id);
    localStorage.setItem(this.KEYS.NOTIZEN, JSON.stringify(alle));
  },

  // Termine / Kalender
  getTermine(schuelerId = null) {
    const alle = JSON.parse(localStorage.getItem(this.KEYS.TERMINE) || '[]');
    return schuelerId ? alle.filter(t => t.schuelerId === schuelerId || t.schuelerId === null) : alle;
  },
  createTermin(daten) {
    const alle = this.getTermine();
    const neu = {
      id: this.generateId(),
      schuelerId: daten.schuelerId || null,
      datum: daten.datum,
      uhrzeit: daten.uhrzeit || '',
      titel: daten.titel || '',
      beschreibung: daten.beschreibung || '',
      typ: daten.typ || 'termin',
      erstellt: new Date().toISOString(),
    };
    alle.push(neu);
    localStorage.setItem(this.KEYS.TERMINE, JSON.stringify(alle));
    return neu;
  },
  deleteTermin(id) {
    const alle = this.getTermine().filter(t => t.id !== id);
    localStorage.setItem(this.KEYS.TERMINE, JSON.stringify(alle));
  },
};
