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
  // Fixes for existing worksheets with different IDs
  'tabak-ezigarette':      [{ titel: 'Tabak & E-Zigarette',                        datei: 'konsum-tabak.html' }],
  'diskriminierung':       [{ titel: 'Diskriminierung & Rassismus',                datei: 'diskriminierung.html' }],
  // New worksheets
  'soziales-netzwerk':     [{ titel: 'Mein soziales Netzwerk',                     datei: 'soziales-netzwerk.html' }],
  'pflegefamilie':         [{ titel: 'Pflegefamilie & meine Geschichte',           datei: 'pflegefamilie.html' }],
  'gluecksspiel':          [{ titel: 'Glücksspiel & Wetten',                       datei: 'gluecksspiel.html' }],
  'schulkonflikt':         [{ titel: 'Schulkonflikte verstehen & lösen',           datei: 'schulkonflikt.html' }],
  'mentale-gesundheit':    [{ titel: 'Meine mentale Gesundheit',                   datei: 'mentale-gesundheit.html' }],
  'chronische-erkrankung': [{ titel: 'Leben mit chronischer Erkrankung',           datei: 'chronische-erkrankung.html' }],
  'transport':             [{ titel: 'Transport & Mobilität',                      datei: 'transport.html' }],
  'haushalt':              [{ titel: 'Haushalt & Selbstversorgung',               datei: 'haushalt.html' }],
  'freizeit':              [{ titel: 'Freizeit & Hobbys',                         datei: 'freizeit.html' }],
  'ehrenamt':              [{ titel: 'Ehrenamt & gesellschaftliches Engagement',   datei: 'ehrenamt.html' }],
  'jugendrecht':           [{ titel: 'Jugendrecht & Jugendschutz',                datei: 'jugendrecht.html' }],
  'jugendschutz':          [{ titel: 'Jugendrecht & Jugendschutz',                datei: 'jugendrecht.html' }],
  'soziale-dienste':       [{ titel: 'Hilfe finden – Soziale Dienste & Beratung', datei: 'soziale-dienste.html' }],
  'polizei-justiz':        [{ titel: 'Polizei, Justiz & Bürgerrechte',            datei: 'polizei-justiz.html' }],
  'buergerrechte':         [{ titel: 'Polizei, Justiz & Bürgerrechte',            datei: 'polizei-justiz.html' }],
  'spiritualitaet':        [{ titel: 'Spiritualität, Religion & Sinn',            datei: 'spiritualitaet.html' }],
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

  // ── Soziale Kompetenzen ────────────────────────────────────
  'soziales-netzwerk': [
    { titel: 'Mein Netzwerk zeichnen', beschreibung: 'Zeichne dein soziales Netz: Wer ist sehr nah, wer weiter weg? Wer fehlt dir?', dauer: '20 Min' },
    { titel: 'Unterstützungsquellen benennen', beschreibung: 'Wer hilft dir bei Problemen, bei Freude, bei Hausaufgaben, in der Krise? Ordne Personen zu.', dauer: '15 Min' },
    { titel: 'Netzwerk stärken', beschreibung: 'Wähle eine Person und plane eine konkrete Aktion, um die Verbindung zu stärken.', dauer: '10 Min' },
  ],
  'freundschaften': [
    { titel: 'Freundschafts-Qualitäts-Check', beschreibung: 'Bewerte deine engsten Freundschaften: Vertrauen, Gegenseitigkeit, Spaß, Ehrlichkeit – von 1 bis 10.', dauer: '15 Min' },
    { titel: 'Was ich gebe und bekomme', beschreibung: 'Was bringst du in Freundschaften ein? Was bekommst du zurück? Ist das ausgeglichen?', dauer: '15 Min' },
    { titel: 'Neue Kontakte knüpfen', beschreibung: 'Wo könntest du neue Freundschaften finden? Plane einen ersten konkreten Schritt.', dauer: '10 Min' },
  ],
  'konfliktmanagement': [
    { titel: 'Konflikt analysieren', beschreibung: 'Beschreibe einen echten Konflikt: Was passierte, wie reagierte ich, was hätte besser funktioniert?', dauer: '20 Min' },
    { titel: 'WIN-WIN Lösung finden', beschreibung: 'Was will ich, was will die andere Person? Schreibe eine Lösung, die für beide passt.', dauer: '15 Min' },
    { titel: 'Ich-Botschaften formulieren', beschreibung: 'Wandle 5 Du-Botschaften um: "Wenn du X, fühle ich Y, weil Z, ich wünsche mir W."', dauer: '15 Min' },
  ],
  'kommunikation': [
    { titel: 'Mein Kommunikationsstil', beschreibung: 'Bin ich eher passiv, aggressiv oder assertiv? Erkenne deine Muster anhand konkreter Beispiele.', dauer: '15 Min' },
    { titel: 'Aktives Zuhören', beschreibung: 'Höre einer Person 5 Minuten zu ohne zu unterbrechen. Fasse danach zusammen was sie gesagt hat.', dauer: '15 Min' },
  ],
  'romantische-beziehungen': [
    { titel: 'Meine Beziehungswerte', beschreibung: 'Was ist mir in einer Beziehung wirklich wichtig? Erstelle eine Rangliste deiner 5 wichtigsten Werte.', dauer: '15 Min' },
    { titel: 'Gesunde Beziehung – Checkliste', beschreibung: 'Merkmale einer gesunden Beziehung vs. Warnsignale: Zwei Spalten ausfüllen und mit eigenen Erfahrungen vergleichen.', dauer: '20 Min' },
  ],
  'grenzen-setzen': [
    { titel: 'Meine Grenzen kennen', beschreibung: 'In welchen Bereichen fällt mir Nein-sagen schwer? Schreibe Beispiele auf.', dauer: '15 Min' },
    { titel: 'Nein formulieren üben', beschreibung: 'Schreibe 3 Situationen auf, wo du Nein sagen solltest – und formuliere jeweils eine klare, freundliche Antwort.', dauer: '15 Min' },
  ],
  'mobbing': [
    { titel: 'Mobbing dokumentieren', beschreibung: 'Notiere: Wann, wo, was, wer war dabei, wer hat es gesehen? Dokumentation ist wichtig.', dauer: '15 Min' },
    { titel: 'Meine Reaktionsstrategien', beschreibung: 'Was kannst du tun, wenn du gemobbt wirst? Erstelle eine persönliche Liste mit 5 konkreten Optionen.', dauer: '15 Min' },
    { titel: 'Unterstützungsnetz aktivieren', beschreibung: 'Wer in der Schule kann helfen? Wer außerhalb? Plane wen du als nächstes ansprechen würdest.', dauer: '10 Min' },
  ],
  'gruppendynamik': [
    { titel: 'Meine Rolle in der Gruppe', beschreibung: 'Welche Rolle nehme ich ein? Anführer, Vermittler, Mitläufer? Schreibe konkrete Beispiele auf.', dauer: '15 Min' },
    { titel: 'Peer-Pressure erkennen', beschreibung: 'Erinnere dich an eine Situation mit Gruppendruck. Wie hast du reagiert? Wie würdest du heute reagieren?', dauer: '15 Min' },
  ],
  'empathie': [
    { titel: 'Perspektivenwechsel', beschreibung: 'Beschreibe einen Streit aus der Sicht der anderen Person: ihre Gedanken, Gefühle, Bedürfnisse.', dauer: '20 Min' },
    { titel: 'Empathie-Tagebuch', beschreibung: 'Beobachte täglich eine Person: Wie könnte sie sich fühlen? Was braucht sie gerade?', dauer: '5 Min täglich' },
  ],

  // ── Konsum & Risikoverhalten ───────────────────────────────
  'alkohol': [
    { titel: 'Konsum-Tagebuch', beschreibung: 'Eine Woche: Wann, wie viel, warum, wie fühlte ich mich davor/danach?', dauer: '5 Min täglich' },
    { titel: 'Vor- und Nachteile', beschreibung: 'Vier-Felder: Was spricht für meinen Konsum, was dagegen – kurz- und langfristig?', dauer: '20 Min' },
    { titel: 'Meine Auslöser kennen', beschreibung: 'Welche Situationen, Gefühle oder Personen lösen den Wunsch zu trinken aus?', dauer: '15 Min' },
  ],
  'cannabis': [
    { titel: 'Faktencheck Cannabis', beschreibung: 'Schreibe auf was du über Cannabis weißt. Markiere: Was ist Fakt, was ist Mythos?', dauer: '15 Min' },
    { titel: 'Meine Konsummotive', beschreibung: 'Warum konsumiere ich? Stress, Spaß, Langeweile, Dazugehören? Benenne deine echten Motive.', dauer: '15 Min' },
    { titel: 'Alternativen finden', beschreibung: 'Was würde ich statt kiffen tun bei Stress / Langeweile / Traurigkeit? Liste mit 10 Alternativen.', dauer: '15 Min' },
  ],
  'tabak-ezigarette': [
    { titel: 'Rauch-Protokoll', beschreibung: 'Jeden Zug dokumentieren: Uhrzeit, Situation, Stimmung davor/danach – Muster erkennen.', dauer: '5 Min täglich' },
    { titel: 'Wahre Kosten ausrechnen', beschreibung: 'Was kostet das Rauchen wirklich? Geld pro Tag, Monat, Jahr – und was könnte ich stattdessen kaufen?', dauer: '15 Min' },
  ],
  'gaming': [
    { titel: 'Gaming-Protokoll', beschreibung: 'Eine Woche: Spielzeiten, Stimmung davor/danach, was ich deswegen vernachlässigt habe.', dauer: '5 Min täglich' },
    { titel: 'Was erfülle ich im Spiel?', beschreibung: 'Welche Bedürfnisse erfülle ich durch Gaming? Erfolg, Zugehörigkeit, Kontrolle? Echte Alternativen finden.', dauer: '20 Min' },
    { titel: 'Balance-Plan', beschreibung: 'Wie viele Stunden Gaming pro Tag ist gesund für mich? Eigene Regeln aufstellen.', dauer: '10 Min' },
  ],
  'social-media': [
    { titel: 'Social-Media-Audit', beschreibung: 'Screen-Time analysieren: Welche Apps, wie lange, wann? Wie fühle ich mich danach?', dauer: '15 Min' },
    { titel: 'Vergleichsfalle erkennen', beschreibung: 'Welche Profile lösen Neid oder Unzufriedenheit aus? Was denke ich automatisch beim Scrollen?', dauer: '15 Min' },
    { titel: 'Digital-Detox-Tag planen', beschreibung: 'Einen Tag ohne Social Media planen: Was machst du stattdessen? Wie war es danach?', dauer: '15 Min' },
  ],
  'gluecksspiel': [
    { titel: 'Wahre Kosten berechnen', beschreibung: 'Addiere alle Verluste der letzten Wochen. Was könntest du stattdessen damit machen?', dauer: '20 Min' },
    { titel: 'Meine Auslöser kennen', beschreibung: 'Wann zocke ich? Langeweile, Stress, nach Verlust? Muster erkennen.', dauer: '15 Min' },
    { titel: 'Gesunde Alternativen', beschreibung: 'Was gibt mir ähnliche Gefühle wie Glücksspiel (Spannung, Risiko), ohne die Risiken?', dauer: '10 Min' },
  ],
  'selbstmedikation': [
    { titel: 'Was betäube ich?', beschreibung: 'Welche Gefühle oder Situationen soll der Konsum betäuben? Ehrlich aufschreiben.', dauer: '20 Min' },
    { titel: 'Meine Ressourcen aufbauen', beschreibung: 'Was gibt mir Kraft ohne Substanzen? Liste mit 10 echten Alternativen erstellen.', dauer: '15 Min' },
  ],

  // ── Schule & Zukunft ───────────────────────────────────────
  'schulisches-engagement': [
    { titel: 'Mein Schulalltag unter der Lupe', beschreibung: 'Was läuft gut, was schlecht? Stunden, Pausen, Lernzeiten analysieren und einen Punkt verbessern.', dauer: '20 Min' },
    { titel: '2-Wochen-Ziele setzen', beschreibung: 'Drei konkrete, erreichbare Ziele für die nächsten zwei Wochen in der Schule formulieren.', dauer: '15 Min' },
  ],
  'lernstrategien': [
    { titel: 'Mein Lerntyp', beschreibung: 'Bin ich eher visuell, auditiv oder kinästhetisch? Lerntyp bestimmen und passende Strategien ableiten.', dauer: '20 Min' },
    { titel: 'Realistischer Lernplan', beschreibung: 'Gemeinsam einen Wochenplan mit Lernzeiten, Pausen und Freizeit erstellen.', dauer: '20 Min' },
    { titel: 'Pomodoro ausprobieren', beschreibung: '25 Min konzentriert lernen, 5 Min Pause. Technik erklären und einmal direkt ausprobieren.', dauer: '15 Min' },
  ],
  'schulkonflikt': [
    { titel: 'Konflikt analysieren', beschreibung: 'Was passierte genau? Wer war beteiligt, wie habe ich reagiert, was hätte geholfen?', dauer: '20 Min' },
    { titel: 'Meine Rechte und Pflichten', beschreibung: 'Was sind meine Rechte in der Schule? Was sind meine Pflichten? Wo liegt die Grenze?', dauer: '15 Min' },
    { titel: 'De-Eskalation planen', beschreibung: 'Beim nächsten Konflikt: Was tue ich in den ersten 60 Sekunden um nicht zu eskalieren?', dauer: '10 Min' },
  ],
  'berufsorientierung': [
    { titel: 'Interessen-Profil', beschreibung: 'Was mache ich gerne, was kann ich gut, was ist der Welt nützlich? Schnittmengen finden.', dauer: '25 Min' },
    { titel: '3 Berufsfelder erkunden', beschreibung: 'Drei Berufsfelder recherchieren die zu den Interessen passen – Vor- und Nachteile notieren.', dauer: '25 Min' },
  ],
  'zukunftsplanung': [
    { titel: 'Brief aus der Zukunft', beschreibung: 'Schreibe einen Brief von deinem 30-jährigen Ich an dich heute – was hast du erreicht?', dauer: '20 Min' },
    { titel: 'Vision Board', beschreibung: 'Bilder, Wörter und Symbole für die Zukunft sammeln und auf ein Blatt Papier anordnen.', dauer: '30 Min' },
    { titel: '3 Lebensziele', beschreibung: 'Schreibe 3 Dinge auf, die du in 10 Jahren erreicht haben möchtest – und je einen ersten Schritt.', dauer: '15 Min' },
  ],
  'motivation': [
    { titel: 'Intrinsische Motivatoren finden', beschreibung: 'Was tue ich freiwillig, weil es mich erfüllt – nicht wegen Belohnung? Liste erstellen.', dauer: '20 Min' },
    { titel: 'Mini-Ziele formulieren', beschreibung: 'Ein großes Ziel in 5 sehr kleine Schritte aufteilen – ersten Schritt sofort angehen.', dauer: '15 Min' },
  ],
  'prüfungsangst': [
    { titel: 'Katastrophen-Stopp', beschreibung: 'Was ist das Schlimmste, das passieren kann? Wie wahrscheinlich ist das wirklich? Realistisch einschätzen.', dauer: '15 Min' },
    { titel: 'Mein Prüfungs-Ritual', beschreibung: 'Ein persönliches Beruhigungs-Ritual für den Prüfungstag entwickeln (Musik, Atemübung, Routine).', dauer: '20 Min' },
    { titel: 'Vorbereitung sichtbar machen', beschreibung: 'Liste alles auf was du schon weißt – manchmal hilft es zu sehen wie viel man bereits kann.', dauer: '15 Min' },
  ],

  // ── Gesundheit & Körper ────────────────────────────────────
  'schlaf': [
    { titel: 'Schlaf-Tagebuch', beschreibung: 'Eine Woche: Schlafzeiten, Einschlafzeit, Aufwachen und Erholung morgens notieren.', dauer: '5 Min täglich' },
    { titel: 'Schlafhygiene-Check', beschreibung: 'Checkliste: Koffein, Bildschirme, Rituale, Raumtemperatur – was läuft gut, was nicht?', dauer: '15 Min' },
    { titel: 'Abend-Routine entwickeln', beschreibung: 'Eine persönliche Routine für die letzte Stunde vor dem Schlafen entwickeln.', dauer: '15 Min' },
  ],
  'ernaehrung': [
    { titel: 'Essverhalten beobachten', beschreibung: 'Eine Woche: Was, wann, wie viel, in welcher Stimmung gegessen? Muster erkennen.', dauer: '5 Min täglich' },
    { titel: 'Hunger vs. Appetit', beschreibung: 'Wann habe ich körperlichen Hunger, wann esse ich aus emotionalen Gründen? Unterschied kennenlernen.', dauer: '15 Min' },
  ],
  'sport-bewegung': [
    { titel: 'Lieblingsaktivitäten', beschreibung: 'Welche körperlichen Aktivitäten mache ich gerne? Wie oft? Was verhindert mich öfter dabei?', dauer: '15 Min' },
    { titel: 'Mini-Bewegungsplan', beschreibung: 'Einen realistischen Wochenplan mit kleinen Bewegungseinheiten erstellen und erste Schritte festlegen.', dauer: '15 Min' },
  ],
  'sexualitaet': [
    { titel: 'Fakten und Mythen', beschreibung: 'Was weiß ich über Sexualität? Schreibe Fragen auf, die du hast – ohne sie bewerten zu müssen.', dauer: '15 Min' },
    { titel: 'Meine persönlichen Grenzen', beschreibung: 'Was ist okay für mich, was nicht? Persönliche Grenzen im intimen Bereich klar formulieren.', dauer: '20 Min' },
  ],
  'koerperbild': [
    { titel: 'Körper-Dankbarkeit', beschreibung: 'Was leistet mein Körper jeden Tag? 10 Dinge aufschreiben für die du dankbar sein kannst.', dauer: '15 Min' },
    { titel: 'Medien-Körperbild analysieren', beschreibung: 'Bilder aus Magazinen/Social Media: Welche Körperbilder werden verkauft? Wer profitiert davon?', dauer: '20 Min' },
  ],
  'mentale-gesundheit': [
    { titel: 'Wohlbefindens-Check', beschreibung: 'Wie geht es mir in verschiedenen Lebensbereichen (Schule, Familie, Freunde, Gefühle)? Skala von 1–10.', dauer: '15 Min' },
    { titel: 'Meine Schutzfaktoren', beschreibung: 'Was hält mich stabil? Personen, Aktivitäten, Gedanken – liste alle Schutzfaktoren auf.', dauer: '15 Min' },
    { titel: 'Frühwarnsignale kennen', beschreibung: 'Woran merkst du, dass es dir nicht gut geht? Körperlich, emotional, sozial – liste deine persönlichen Signale.', dauer: '15 Min' },
  ],
  'chronische-erkrankung': [
    { titel: 'Meine Erkrankung erklären', beschreibung: 'Erkläre deine Erkrankung in eigenen Worten: Was ist es, was passiert in meinem Körper?', dauer: '20 Min' },
    { titel: 'Alltag mit der Erkrankung', beschreibung: 'Wie beeinflusst die Erkrankung Schule, Freundschaften, Sport, Stimmung? Ehrlich aufschreiben.', dauer: '15 Min' },
    { titel: 'Was anderen helfen würde zu wissen', beschreibung: 'Was sollten Lehrer, Freunde, Familie über meine Erkrankung wissen, um mir besser helfen zu können?', dauer: '15 Min' },
  ],

  // ── Alltag & Mobilität ─────────────────────────────────────
  'transport': [
    { titel: 'Meine Transport-Situation', beschreibung: 'Wie komme ich derzeit zur Schule, zu Freunden, zu Aktivitäten? Was ist einfach, was schwierig?', dauer: '15 Min' },
    { titel: 'Wichtige Verbindungen', beschreibung: 'Schreibe 5 Wege auf, die du regelmäßig brauchst. Welche öffentlichen Verbindungen gibt es?', dauer: '15 Min' },
    { titel: 'Ziel: Selbstständige Mobilität', beschreibung: 'Was fehlt mir noch zur Selbstständigkeit (Führerschein, ÖPNV-Kenntnisse)? Ersten Schritt planen.', dauer: '10 Min' },
  ],
  'finanzen': [
    { titel: 'Mein Monatsbudget', beschreibung: 'Einnahmen und Ausgaben auflisten – wo geht das Geld wirklich hin?', dauer: '20 Min' },
    { titel: 'Sparziel definieren', beschreibung: 'Ein konkretes Sparziel festlegen und ausrechnen, wie lange man dafür braucht.', dauer: '15 Min' },
    { titel: 'Impulskäufe erkennen', beschreibung: 'Denke an die letzten Käufe: Was davon hätte ich nicht gebraucht? Was wäre besser gewesen?', dauer: '10 Min' },
  ],
  'haushalt': [
    { titel: 'Selbstcheck Haushaltsskills', beschreibung: 'Checkliste: Kochen, Waschen, Putzen, Einkaufen, Budget – was kann ich, was noch nicht?', dauer: '15 Min' },
    { titel: 'Einfaches Gericht planen', beschreibung: 'Plane eine einfache Mahlzeit: Zutaten, Kosten, Zubereitung Schritt für Schritt.', dauer: '20 Min' },
    { titel: 'Mein Wochenputzplan', beschreibung: 'Welche Aufgaben fallen wöchentlich an? Erstelle einen realistischen Reinigungsplan.', dauer: '10 Min' },
  ],
  'freizeit': [
    { titel: 'Meine Freizeitaktivitäten', beschreibung: 'Was tue ich in meiner Freizeit? Wie oft? Wie fühle ich mich danach – Energie oder Erschöpfung?', dauer: '15 Min' },
    { titel: 'Eine neue Aktivität ausprobieren', beschreibung: 'Wähle eine Aktivität, die du noch nie probiert hast. Was brauchst du, um sie auszuprobieren?', dauer: '15 Min' },
    { titel: 'Balance-Check', beschreibung: 'Wie verteilt sich meine Zeit zwischen Schule, Schlafen, Familie und Freizeit? Ist das ausgewogen?', dauer: '10 Min' },
  ],
  'mediennutzung': [
    { titel: 'Medien-Audit', beschreibung: 'Welche Medien nutze ich täglich, wie lange und wann? Wie fühle ich mich danach?', dauer: '15 Min' },
    { titel: 'Fake News erkennen', beschreibung: 'Was macht eine Quelle vertrauenswürdig? Überprüfe eine aktuelle Schlagzeile auf ihre Quellen.', dauer: '20 Min' },
  ],
  'ehrenamt': [
    { titel: 'Was liegt mir am Herzen?', beschreibung: 'Wofür würde ich mich einsetzen? Umwelt, Tiere, ältere Menschen, Sport? Schreibe auf was dich berührt.', dauer: '15 Min' },
    { titel: 'Lokale Angebote recherchieren', beschreibung: 'Finde 2–3 Möglichkeiten für Ehrenamt oder Engagement in deiner Nähe oder online.', dauer: '20 Min' },
    { titel: 'Vorteile des Engagements', beschreibung: 'Was könnte ich durch Ehrenamt gewinnen? Neue Kontakte, Fähigkeiten, Sinn? Liste aufstellen.', dauer: '10 Min' },
  ],

  // ── Recht & Gesellschaft ───────────────────────────────────
  'jugendrecht': [
    { titel: 'Meine Rechte als Minderjährige/r', beschreibung: 'Welche Rechte habe ich in Luxemburg? Nenne 5 und erkläre sie in eigenen Worten.', dauer: '20 Min' },
    { titel: 'Altersgrenzen kennen', beschreibung: 'Was darf ich ab welchem Alter? Alkohol, Führerschein, Ausgehen, Arbeiten – Tabelle ausfüllen.', dauer: '15 Min' },
  ],
  'jugendschutz': [
    { titel: 'Schutzmechanismen kennen', beschreibung: 'Wer ist verpflichtet mich zu schützen? Was passiert, wenn jemand meinen Schutz verletzt?', dauer: '15 Min' },
    { titel: 'Mein Sicherheitsnetz', beschreibung: 'Welche Personen und Stellen würden mir helfen, wenn ich in Gefahr bin? Liste aufstellen.', dauer: '15 Min' },
  ],
  'soziale-dienste': [
    { titel: 'Hilfsstellen in Luxemburg', beschreibung: 'Recherchiere 5 Stellen, die Jugendlichen helfen. Notiere: Name, Telefon, wofür zuständig.', dauer: '20 Min' },
    { titel: 'Wann brauche ich Hilfe?', beschreibung: 'Erkenne Situationen, in denen du professionelle Hilfe suchen solltest – ohne Scham.', dauer: '15 Min' },
    { titel: 'Um Hilfe bitten üben', beschreibung: 'Schreibe auf, was du sagen würdest, wenn du einen Beratungstermin anfragen möchtest.', dauer: '10 Min' },
  ],
  'polizei-justiz': [
    { titel: 'Was passiert wenn...?', beschreibung: 'Beschreibe für 3 Szenarien (Diebstahl, Schlägerei, Sachbeschädigung): Was sind die rechtlichen Folgen?', dauer: '20 Min' },
    { titel: 'Meine Rechte bei einer Kontrolle', beschreibung: 'Was darf ich tun und was nicht, wenn die Polizei mich anhält? Liste aufstellen.', dauer: '15 Min' },
  ],
  'buergerrechte': [
    { titel: 'Demokratisch mitmachen', beschreibung: 'Welche Möglichkeiten habe ich als Jugendliche/r, die Gesellschaft mitzugestalten? 5 Optionen finden.', dauer: '15 Min' },
    { titel: 'Was liegt mir an der Gesellschaft?', beschreibung: 'Nenne 3 Dinge in der Gesellschaft, die du verändern möchtest – und eine mögliche Aktion.', dauer: '15 Min' },
  ],
  'diskriminierung': [
    { titel: 'Diskriminierung erkennen', beschreibung: 'Was ist Diskriminierung? Beschreibe 3 Formen (direkt, indirekt, strukturell) mit je einem Beispiel.', dauer: '20 Min' },
    { titel: 'Meine Erfahrungen', beschreibung: 'Hast du Diskriminierung erlebt oder beobachtet? Wie hast du dich dabei gefühlt, was hättest du gebraucht?', dauer: '15 Min' },
    { titel: 'Gegenstrategie entwickeln', beschreibung: 'Was kann ich tun, wenn ich Diskriminierung erlebe oder sehe? Konkrete Optionen erarbeiten.', dauer: '15 Min' },
  ],

  // ── Identität & Werte ──────────────────────────────────────
  'selbstbild': [
    { titel: 'Wer bin ich? – Mindmap', beschreibung: 'Erstelle eine Mindmap zu deiner Person: Stärken, Werte, Rollen, Interessen, Träume.', dauer: '20 Min' },
    { titel: 'Innerer Kritiker vs. Innerer Coach', beschreibung: 'Was sagt dein innerer Kritiker? Was würde ein wohlwollender Coach stattdessen sagen?', dauer: '20 Min' },
  ],
  'werte-moral': [
    { titel: 'Meine Werte-Hitliste', beschreibung: 'Wähle aus einer Liste von 20 Werten deine 5 wichtigsten und erkläre warum.', dauer: '20 Min' },
    { titel: 'Werte im Alltag', beschreibung: 'Stimmt mein Alltag mit meinen Werten überein? Wo gibt es Lücken und wie könnte ich sie schließen?', dauer: '20 Min' },
  ],
  'kulturelle-identitaet': [
    { titel: 'Meine kulturellen Wurzeln', beschreibung: 'Woher komme ich? Welche Werte, Traditionen und Sprachen gehören zu mir?', dauer: '20 Min' },
    { titel: 'Zwischen den Kulturen', beschreibung: 'Wie navigiere ich zwischen verschiedenen kulturellen Erwartungen? Was stärkt mich dabei?', dauer: '20 Min' },
  ],
  'geschlechtsidentitaet': [
    { titel: 'Was ich weiß und was mich beschäftigt', beschreibung: 'Schreibe Fragen auf, die du zur Geschlechtsidentität oder sexuellen Orientierung hast – ohne Bewertung.', dauer: '15 Min' },
    { titel: 'Meine Geschichte mit mir', beschreibung: 'Erzähle oder schreibe deine persönliche Geschichte zum Thema Identität – in eigenen Worten.', dauer: '25 Min' },
  ],
  'spiritualitaet': [
    { titel: 'Was gibt mir Kraft?', beschreibung: 'Was gibt mir Halt und Sinn? Glaube, Natur, Gemeinschaft, Kunst? Schreibe deine persönlichen Quellen auf.', dauer: '15 Min' },
    { titel: 'Mein Verhältnis zur Religion', beschreibung: 'Bin ich religiös, spirituell oder keines von beidem? Reflektiere deine Haltung ohne Bewertung.', dauer: '15 Min' },
    { titel: 'Rituale die mir wichtig sind', beschreibung: 'Welche Rituale oder Praktiken geben dir Halt? Überlege wie du sie im Alltag bewusster einsetzen kannst.', dauer: '15 Min' },
  ],
  'zugehoerigkeit': [
    { titel: 'Wo gehöre ich dazu?', beschreibung: 'In welchen Gruppen, Orten oder Gemeinschaften fühle ich mich zugehörig? Was macht das aus?', dauer: '15 Min' },
    { titel: 'Erfahrungen mit Ausgrenzung', beschreibung: 'Wann habe ich mich ausgeschlossen gefühlt? Was hätte mir damals geholfen?', dauer: '15 Min' },
    { titel: 'Zugehörigkeit aufbauen', beschreibung: 'Was kann ich tun, um mich in einem Bereich stärker zugehörig zu fühlen? Einen konkreten Schritt planen.', dauer: '10 Min' },
  ],
  'lebenssinn': [
    { titel: 'Gründe zu leben', beschreibung: 'Schreibe 20 Dinge auf, für die es sich lohnt aufzustehen – Menschen, Momente, Dinge.', dauer: '20 Min' },
    { titel: 'Wann fühle ich mich lebendig?', beschreibung: 'In welchen Momenten bist du ganz bei dir und fühlst dich lebendig? Was haben sie gemeinsam?', dauer: '15 Min' },
    { titel: 'Mein Beitrag zur Welt', beschreibung: 'Was möchtest du der Welt geben oder hinterlassen? Schreibe in Sätzen oder als Mindmap.', dauer: '20 Min' },
  ],

  // ── Krisen & Trauma ────────────────────────────────────────
  'krisenintervention': [
    { titel: 'Eine Krise erkennen', beschreibung: 'Welche Zeichen zeigen mir, dass ich in einer Krise bin? Körperlich, emotional, im Verhalten?', dauer: '15 Min' },
    { titel: 'Mein Sicherheitsplan', beschreibung: 'Erstelle die Grundzüge eines Sicherheitsplans: Warnzeichen, Ablenkungen, wen ich anrufe.', dauer: '20 Min' },
    { titel: 'Krisen-Kontaktkarte', beschreibung: 'Karte mit Notfallnummern anlegen: Telefonseelsorge, Vertrauensperson, Krisentelefon.', dauer: '10 Min' },
  ],
  'suizidpraevention': [
    { titel: 'Mein Sicherheitsplan', beschreibung: 'Warnzeichen, Ablenkungsstrategien, Notfallnummern und Vertrauenspersonen schriftlich festhalten.', dauer: '30 Min' },
    { titel: 'Gründe zum Leben', beschreibung: 'Menschen, Dinge, Momente, Pläne die mir wichtig sind – auch kleine Dinge zählen.', dauer: '20 Min' },
    { titel: 'Krisen-Telefon-Karte', beschreibung: 'Karte mit Notfallnummern anfertigen und griffbereit aufbewahren.', dauer: '10 Min' },
  ],
  'gewalt': [
    { titel: 'Gewalt erkennen', beschreibung: 'Was sind die verschiedenen Formen von Gewalt? Körperlich, emotional, sexuell, digital – Beispiele benennen.', dauer: '20 Min' },
    { titel: 'Mein Sicherheitsplan', beschreibung: 'Was kann ich tun, wenn ich in Gefahr bin? Wer kann helfen, wohin kann ich gehen?', dauer: '20 Min' },
    { titel: 'Anzeige und Hilfe in Luxemburg', beschreibung: 'Welche Möglichkeiten habe ich, Hilfe zu suchen oder eine Situation zu melden?', dauer: '15 Min' },
  ],
  'resilienz': [
    { titel: 'Meine Resilienz-Faktoren', beschreibung: 'Was hat mir bisher geholfen, schwierige Zeiten zu überwinden? Liste alle Faktoren auf.', dauer: '20 Min' },
    { titel: 'Wie ich Schwieriges überwunden habe', beschreibung: 'Erinnere dich an eine Zeit, die schwierig war – und wie du es geschafft hast. Was war deine Stärke?', dauer: '20 Min' },
    { titel: 'Resilienz-Muskel stärken', beschreibung: 'Wähle eine Resilienz-Strategie aus (z.B. Dankbarkeit, Sport, Verbindung) und übe sie eine Woche.', dauer: '10 Min' },
  ],
  'trennungsangst': [
    { titel: 'Meine Bindungsängste benennen', beschreibung: 'Wovor habe ich Angst, wenn es um Beziehungen geht? Verlassen werden, allein sein, abgelehnt werden?', dauer: '20 Min' },
    { titel: 'Innere Sicherheit aufbauen', beschreibung: 'Was gibt mir Sicherheit, auch wenn andere Menschen nicht da sind? Liste erstellen.', dauer: '15 Min' },
    { titel: 'Grounding bei Trennungsangst', beschreibung: 'Übe 5-4-3-2-1: 5 sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken – jetzt, in diesem Moment.', dauer: '10 Min' },
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

  // ── Soziale Kompetenzen ────────────────────────────────────
  'freundschaften': [
    { titel: 'Freundschafts-Netzwerk', ansatz: 'Systemisch', beschreibung: 'Alle Freundschaften als Netz zeichnen – Nähe, Häufigkeit, Qualität einschätzen.', indikation: 'Soziale Isolation, Beziehungsprobleme', dauer: '20 Min' },
    { titel: 'Was macht eine gute Freundschaft aus?', ansatz: 'Psychoedukativ', beschreibung: 'Gemeinsam Kriterien für eine gesunde Freundschaft erarbeiten und auf eigene Beziehungen anwenden.', indikation: 'Toxische Freundschaften, Unsicherheit', dauer: '20 Min' },
  ],
  'konfliktmanagement': [
    { titel: 'Konflikt-Analyse', ansatz: 'Kognitiv-behavioral', beschreibung: 'Einen konkreten Konflikt zerlegen: Was passierte? Wie reagierte ich? Was hätte geholfen?', indikation: 'Eskalation, destruktive Konfliktmuster', dauer: '25 Min' },
    { titel: 'Gewaltfreie Kommunikation üben', ansatz: 'GFK nach Rosenberg', beschreibung: 'Beobachtung / Gefühl / Bedürfnis / Bitte – an einem echten Konfliktbeispiel üben.', indikation: 'Vorwürfe, Eskalation in Konflikten', dauer: '25 Min' },
    { titel: 'Ich-Botschaften trainieren', ansatz: 'Kommunikationstraining', beschreibung: 'Du-Botschaften in Ich-Botschaften umformulieren – anhand von Alltagsbeispielen.', indikation: 'Anklagendes Kommunikationsmuster', dauer: '15 Min' },
  ],
  'kommunikation': [
    { titel: 'Aktives Zuhören üben', ansatz: 'Gesprächsführung', beschreibung: 'In Paaren: einer spricht, einer hört aktiv zu (Blickkontakt, Zusammenfassen, Nachfragen).', indikation: 'Kommunikationsprobleme, Missverständnisse', dauer: '20 Min' },
    { titel: 'Kommunikationsstile kennenlernen', ansatz: 'Psychoedukativ', beschreibung: 'Passiv / aggressiv / assertiv – eigene Muster erkennen und Assertivität einüben.', indikation: 'Schwierigkeit, Bedürfnisse zu äußern', dauer: '20 Min' },
  ],
  'grenzen-setzen': [
    { titel: 'Meine Grenzen kennen', ansatz: 'Ressourcenorientiert', beschreibung: 'In welchen Bereichen fällt es mir schwer, Nein zu sagen? Körperliche Reaktion bei Grenzüberschreitung.', indikation: 'Schwierigkeit mit Grenzsetzung', dauer: '20 Min' },
    { titel: 'Nein sagen üben', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Rollenspiel: verschiedene Situationen, in denen Nein gesagt werden muss – mit Feedback.', indikation: 'Übermäßige Anpassung, Angst vor Ablehnung', dauer: '20 Min' },
  ],
  'mobbing': [
    { titel: 'Mobbing-Analyse', ansatz: 'Psychoedukativ', beschreibung: 'Was ist Mobbing, was nicht? Täter-Opfer-Zuschauer-Rollen besprechen und einordnen.', indikation: 'Mobbing-Erfahrungen, Unsicherheit über Rollen', dauer: '20 Min' },
    { titel: 'Meine Reaktions-Strategien', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Was kann ich tun, wenn ich gemobbt werde? Konkrete Handlungsoptionen erarbeiten.', indikation: 'Hilflosigkeit bei Mobbing', dauer: '20 Min' },
  ],
  'gruppendynamik': [
    { titel: 'Meine Rolle in der Gruppe', ansatz: 'Systemisch', beschreibung: 'Welche Rolle nehme ich in meiner Klasse / Gruppe ein? Anführer, Clown, Außenseiter…', indikation: 'Peer-Pressure, Rollenprobleme in der Gruppe', dauer: '15 Min' },
    { titel: 'Peer-Pressure-Szenarien', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Rollenspiel mit typischen Situationen, in denen Gruppendruck entsteht – und wie man standhält.', indikation: 'Risikoverhalten durch Gruppendruck', dauer: '20 Min' },
  ],
  'empathie': [
    { titel: 'Perspektivenwechsel-Übung', ansatz: 'Empathietraining', beschreibung: 'Eine Situation aus der Sicht einer anderen Person beschreiben – Gedanken, Gefühle, Bedürfnisse.', indikation: 'Egozentrische Sichtweise, Konflikte durch Missverständnisse', dauer: '20 Min' },
    { titel: 'Empathie-Tagebuch', ansatz: 'Achtsamkeit', beschreibung: 'Täglich eine Person beobachten: Wie könnte sie sich fühlen? Was braucht sie gerade?', indikation: 'Soziale Wahrnehmungsprobleme', dauer: '5 Min täglich' },
  ],
  'romantische-beziehungen': [
    { titel: 'Meine Beziehungs-Werte', ansatz: 'Werteklärung', beschreibung: 'Was ist mir in einer Beziehung wichtig? Werte sortieren und priorisieren.', indikation: 'Ungesunde Beziehungsmuster, erste Beziehungen', dauer: '20 Min' },
    { titel: 'Gesunde vs. ungesunde Beziehung', ansatz: 'Psychoedukativ', beschreibung: 'Merkmale einer gesunden Beziehung erarbeiten und auf die eigene Situation anwenden.', indikation: 'Toxische Beziehungen, Eifersucht, Kontrolle', dauer: '20 Min' },
  ],

  // ── Konsum & Risikoverhalten ───────────────────────────────
  'alkohol': [
    { titel: 'Konsum-Protokoll', ansatz: 'Motivational Interviewing', beschreibung: 'Eine Woche lang Konsum dokumentieren: Wann, wie viel, warum, wie danach.', indikation: 'Bagatellisierung des Konsums', dauer: '5 Min täglich' },
    { titel: 'Vor- und Nachteile abwägen', ansatz: 'Motivational Interviewing', beschreibung: 'Vier-Felder-Matrix: Was spricht für / gegen den Konsum? Kurz- und langfristig.', indikation: 'Ambivalenz bezüglich des Konsums', dauer: '20 Min' },
    { titel: 'Meine Auslöser kennen', ansatz: 'Suchttherapie', beschreibung: 'Situationen, Gefühle und Gedanken identifizieren, die den Konsum auslösen.', indikation: 'Konditionierter Konsum, Hochrisikosituationen', dauer: '20 Min' },
  ],
  'cannabis': [
    { titel: 'Cannabis-Faktencheck', ansatz: 'Psychoedukativ', beschreibung: 'Mythen und Fakten über Cannabis gemeinsam durchgehen – Was stimmt wirklich?', indikation: 'Verharmlosung, Fehlinformationen', dauer: '15 Min' },
    { titel: 'Konsum-Motive erforschen', ansatz: 'Motivational Interviewing', beschreibung: 'Warum konsumiere ich? Stress, Spaß, Dazugehören, Langeweile – Motive benennen.', indikation: 'Selbstmedikation, Flucht vor Problemen', dauer: '20 Min' },
    { titel: 'Alternativen zu Cannabis', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Was würde ich statt kiffen tun, wenn ich Stress/Langeweile/Traurigkeit habe?', indikation: 'Selbstmedikation, Abhängigkeit', dauer: '15 Min' },
  ],
  'tabak-ezigarette': [
    { titel: 'Mein Rauch-Tagebuch', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Jeden Zug dokumentieren: Uhrzeit, Situation, Stimmung davor/danach.', indikation: 'Unbewusstes Rauchen, Routinekonsum', dauer: '5 Min täglich' },
    { titel: 'Kosten-Nutzen-Rechnung', ansatz: 'Kognitiv-behavioral', beschreibung: 'Was kostet mich das Rauchen wirklich? Geld, Gesundheit, Zeit – konkret ausrechnen.', indikation: 'Motivationssteigerung für Ausstieg', dauer: '15 Min' },
  ],
  'gaming': [
    { titel: 'Gaming-Protokoll', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Eine Woche lang Spielzeiten, Stimmung davor/danach und Vernachlässigtes notieren.', indikation: 'Exzessives Gaming, Realitätsflucht', dauer: '5 Min täglich' },
    { titel: 'Was erfülle ich im Spiel?', ansatz: 'Motivational Interviewing', beschreibung: 'Welche Bedürfnisse erfülle ich durch Gaming (Erfolg, Zugehörigkeit, Kontrolle)? Reale Alternativen finden.', indikation: 'Suchtpotenzial, soziale Isolation durch Gaming', dauer: '20 Min' },
  ],
  'social-media': [
    { titel: 'Social-Media-Audit', ansatz: 'Achtsamkeit', beschreibung: 'Screen-Time analysieren: Welche Apps, wie lange, wann? Wie fühle ich mich danach?', indikation: 'Exzessiver Medienkonsum, FOMO', dauer: '15 Min' },
    { titel: 'Vergleichsfalle erkennen', ansatz: 'Kognitiv-behavioral', beschreibung: 'Welche Profile lösen Neid/Unzufriedenheit aus? Automatische Gedanken beim Scrollen benennen.', indikation: 'Negatives Körperbild durch Social Media, Vergleiche', dauer: '20 Min' },
  ],
  'gluecksspiel': [
    { titel: 'Verlust-Protokoll', ansatz: 'Suchttherapie', beschreibung: 'Alle Einsätze und Verluste der letzten Wochen dokumentieren – reale Kosten sehen.', indikation: 'Bagatellisierung von Verlusten', dauer: '20 Min' },
    { titel: 'Ausstiegs-Plan', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Schrittweise einen Plan erarbeiten, um den Zugang zu Glücksspielen zu reduzieren.', indikation: 'Pathologisches Spielen', dauer: '25 Min' },
  ],
  'selbstmedikation': [
    { titel: 'Was betäube ich?', ansatz: 'Tiefenpsychologisch', beschreibung: 'Welche Gefühle, Gedanken oder Situationen soll der Konsum betäuben oder erleichtern?', indikation: 'Selbstmedikation bei psychischen Problemen', dauer: '20 Min' },
    { titel: 'Ressourcen stärken', ansatz: 'Ressourcenorientiert', beschreibung: 'Was gibt mir Kraft, ohne Substanzen? Ressourcen identifizieren und gezielt einsetzen.', indikation: 'Fehlende Alternativen zur Selbstmedikation', dauer: '20 Min' },
  ],

  // ── Schule & Zukunft ───────────────────────────────────────
  'schulisches-engagement': [
    { titel: 'Mein Schulalltag unter der Lupe', ansatz: 'Verhaltensanalyse', beschreibung: 'Was läuft gut, was schlecht? Stunden, Pausen, Lernzeiten analysieren und optimieren.', indikation: 'Schulvermeidung, Motivationsprobleme', dauer: '20 Min' },
    { titel: 'Kurzfristige Schulziele', ansatz: 'Zielorientiert', beschreibung: 'Drei konkrete, erreichbare Ziele für die nächsten zwei Wochen in der Schule formulieren.', indikation: 'Demotivation, Überforderung', dauer: '15 Min' },
  ],
  'lernstrategien': [
    { titel: 'Lerntyp-Test', ansatz: 'Psychoedukativ', beschreibung: 'Visuell, auditiv, kinästhetisch? Lerntyp bestimmen und passende Strategien ableiten.', indikation: 'Ineffektives Lernen, schlechte Noten trotz Aufwand', dauer: '20 Min' },
    { titel: 'Wochenplan erstellen', ansatz: 'Strukturierung', beschreibung: 'Gemeinsam einen realistischen Lernwochenplan mit Pausen und Freizeit erstellen.', indikation: 'Unstrukturiertes Lernen, Prokrastination', dauer: '20 Min' },
    { titel: 'Pomodoro-Technik einführen', ansatz: 'Verhaltenstherapeutisch', beschreibung: '25 Min Fokus, 5 Min Pause – Technik erklären und in der Sitzung ausprobieren.', indikation: 'Konzentrationsprobleme, Ablenkung', dauer: '15 Min' },
  ],
  'berufsorientierung': [
    { titel: 'Interessen-Profil', ansatz: 'Karriereberatung', beschreibung: 'Was mache ich gerne, was kann ich gut, was ist der Welt nützlich? Schnittmengen finden.', indikation: 'Orientierungslosigkeit bzgl. Beruf', dauer: '25 Min' },
    { titel: 'Berufsfelder erkunden', ansatz: 'Psychoedukativ', beschreibung: '5 Berufsfelder recherchieren, die zu den Interessen passen – Vor- und Nachteile.', indikation: 'Eingeschränktes Berufsbild', dauer: '25 Min' },
  ],
  'zukunftsplanung': [
    { titel: 'Brief aus der Zukunft', ansatz: 'Lösungsfokussiert', beschreibung: 'Schreibe einen Brief von deinem 30-jährigen Ich an dich heute – was hast du erreicht?', indikation: 'Fehlende Zukunftsperspektive, Hoffnungslosigkeit', dauer: '20 Min' },
    { titel: 'Vision Board', ansatz: 'Positive Psychologie', beschreibung: 'Bilder, Wörter und Symbole für die Zukunft sammeln und auf ein Board kleben/zeichnen.', indikation: 'Mangelnde Ziele, Antriebslosigkeit', dauer: '30 Min' },
  ],
  'motivation': [
    { titel: 'Intrinsische Motivatoren', ansatz: 'Selbstbestimmungstheorie', beschreibung: 'Was tue ich freiwillig, weil es mich erfüllt? Intrinsische vs. extrinsische Motivation unterscheiden.', indikation: 'Rein externer Antrieb, Demotivation', dauer: '20 Min' },
    { titel: 'Mini-Ziele formulieren', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Ein großes Ziel in 5 sehr kleine Schritte aufteilen – ersten Schritt sofort angehen.', indikation: 'Überwältigung durch große Ziele', dauer: '15 Min' },
  ],
  'prüfungsangst': [
    { titel: 'Katastrophen-Stopp', ansatz: 'Kognitiv-behavioral', beschreibung: 'Was ist das Schlimmste, das passieren kann? Wie wahrscheinlich ist es wirklich? Realistisch einschätzen.', indikation: 'Katastrophisieren vor Prüfungen', dauer: '15 Min' },
    { titel: 'Prüfungs-Ritual entwickeln', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Ein persönliches Beruhigungs- und Vorbereitungsritual für den Prüfungstag erarbeiten.', indikation: 'Panik am Prüfungstag', dauer: '20 Min' },
  ],

  // ── Gesundheit & Körper ────────────────────────────────────
  'schlaf': [
    { titel: 'Schlaf-Tagebuch', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Eine Woche lang Schlafzeiten, Einschlafzeit, Aufwachen und Erholung morgens notieren.', indikation: 'Schlafprobleme, Insomnie', dauer: '5 Min täglich' },
    { titel: 'Schlafhygiene-Check', ansatz: 'Psychoedukativ', beschreibung: 'Checkliste: Koffein, Bildschirme, Rituale, Raumtemperatur – was läuft gut, was nicht?', indikation: 'Schlechte Schlafqualität', dauer: '15 Min' },
    { titel: 'Abend-Routine entwickeln', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Eine persönliche Schlafroutine für die letzte Stunde vor dem Schlafengehen erarbeiten.', indikation: 'Einschlafprobleme', dauer: '15 Min' },
  ],
  'koerper-bild': [
    { titel: 'Körper-Dankbarkeit', ansatz: 'Positive Psychologie', beschreibung: 'Was leistet mein Körper jeden Tag? 10 Dinge aufschreiben, für die man dankbar ist.', indikation: 'Negatives Körperbild', dauer: '15 Min' },
    { titel: 'Medien-Körperbild analysieren', ansatz: 'Medienkritik', beschreibung: 'Bilder aus Magazinen/Social Media analysieren: Welche Körperbilder werden verkauft? Wer profitiert?', indikation: 'Unrealistische Körperideale, Essstörungstendenzen', dauer: '20 Min' },
  ],
  'ernaehrung': [
    { titel: 'Essverhalten beobachten', ansatz: 'Achtsamkeit', beschreibung: 'Eine Woche lang aufschreiben: Was, wann, wie viel, in welcher Stimmung gegessen.', indikation: 'Emotionales Essen, Essstörungstendenzen', dauer: '5 Min täglich' },
    { titel: 'Hunger vs. Appetit', ansatz: 'Achtsamkeit', beschreibung: 'Den Unterschied zwischen körperlichem Hunger und emotionalem Hunger kennenlernen.', indikation: 'Unkontrolliertes Essen, Emotionales Essen', dauer: '15 Min' },
  ],
  'bewegung': [
    { titel: 'Bewegungs-Check', ansatz: 'Ressourcenorientiert', beschreibung: 'Welche körperlichen Aktivitäten mache ich gerne? Wie oft? Barrieren und Lösungen benennen.', indikation: 'Bewegungsmangel, Depression', dauer: '15 Min' },
    { titel: 'Mini-Bewegungsplan', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Einen realistischen Wochenplan mit kleinen Bewegungseinheiten erstellen und erste Schritte festlegen.', indikation: 'Antriebslosigkeit, Übergewicht', dauer: '15 Min' },
  ],
  'sexualitaet': [
    { titel: 'Was weiß ich über Sexualität?', ansatz: 'Psychoedukativ', beschreibung: 'Offenes Gespräch über Fragen, Mythen und Fakten zur Sexualität – ohne Wertung.', indikation: 'Scham, Fehlinformationen, Erstkontakt mit Thema', dauer: '20 Min' },
    { titel: 'Meine Grenzen im intimen Bereich', ansatz: 'Werteklärung', beschreibung: 'Was ist okay, was nicht? Persönliche Grenzen bezüglich Intimität klar formulieren.', indikation: 'Grenzüberschreitungen, Unsicherheit', dauer: '20 Min' },
  ],
  'hygiene-selbstfuersorge': [
    { titel: 'Selbstfürsorge-Plan', ansatz: 'Ressourcenorientiert', beschreibung: 'In vier Bereichen (körperlich, sozial, emotional, geistig) je eine Selbstfürsorge-Aktivität planen.', indikation: 'Vernachlässigung der Selbstfürsorge', dauer: '20 Min' },
    { titel: 'Routine-Anker setzen', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Tätigkeiten an bestehende Routinen knüpfen (nach dem Frühstück = …), um neue Gewohnheiten zu festigen.', indikation: 'Schwierigkeiten mit Tagesstruktur', dauer: '15 Min' },
  ],

  // ── Alltag & Lebenspraxis ──────────────────────────────────
  'alltagsstruktur': [
    { titel: 'Tagesstruktur-Plan', ansatz: 'Strukturierung', beschreibung: 'Einen idealen Tagesablauf gemeinsam entwerfen – mit festen Ankerpunkten.', indikation: 'Chaos im Alltag, Depression, Verwahrlosen', dauer: '20 Min' },
    { titel: 'Wochenziele setzen', ansatz: 'Zielorientiert', beschreibung: 'Jeden Montag drei kleine, erreichbare Ziele setzen – Freitag Rückschau halten.', indikation: 'Orientierungslosigkeit, mangelnde Struktur', dauer: '10 Min' },
  ],
  'finanzen': [
    { titel: 'Mein Monatsbudget', ansatz: 'Psychoedukativ', beschreibung: 'Einnahmen und Ausgaben auflisten – wo geht das Taschengeld wirklich hin?', indikation: 'Schulden, impulsives Ausgeben', dauer: '20 Min' },
    { titel: 'Sparziele definieren', ansatz: 'Zielorientiert', beschreibung: 'Ein konkretes Sparziel festlegen und ausrechnen, wie lange man dafür braucht.', indikation: 'Kein Umgang mit Geld, keine Sparziele', dauer: '15 Min' },
  ],
  'mediennutzung': [
    { titel: 'Meine Medien-Welt', ansatz: 'Systemisch', beschreibung: 'Alle genutzten Medien und Plattformen aufzeichnen – Nutzen, Risiken, Alternativen.', indikation: 'Exzessiver Medienkonsum, Digital Detox', dauer: '20 Min' },
    { titel: 'Digital Detox-Tag planen', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Einen Tag ohne Social Media planen: Was stattdessen tun? Erfahrungen hinterher besprechen.', indikation: 'Social Media Abhängigkeit', dauer: '15 Min' },
  ],

  // ── Rechtliches & Schutz ──────────────────────────────────
  'meine-rechte': [
    { titel: 'Meine Rechte als Minderjährige/r', ansatz: 'Psychoedukativ', beschreibung: 'Grundlegende Rechte von Kindern und Jugendlichen (UN-Kinderrechtskonvention) kennenlernen.', indikation: 'Rechtsunsicherheit, Missachtung von Rechten', dauer: '20 Min' },
    { titel: 'Wo bekomme ich Hilfe?', ansatz: 'Ressourcenorientiert', beschreibung: 'Hilfsangebote für Jugendliche kennenlernen – Beratungsstellen, Notrufnummern, Online-Angebote.', indikation: 'Isolierung, Unwissen über Hilfsmöglichkeiten', dauer: '15 Min' },
  ],
  'cybermobbing': [
    { titel: 'Cybermobbing erkennen', ansatz: 'Psychoedukativ', beschreibung: 'Was ist Cybermobbing? Formen, Täter, Opfer, Zuschauer – Unterschiede zu realem Mobbing.', indikation: 'Cybermobbing-Erfahrungen, Täter-Verhalten', dauer: '20 Min' },
    { titel: 'Screenshot & Melden', ansatz: 'Handlungsorientiert', beschreibung: 'Schritte bei Cybermobbing: Dokumentieren, Melden, Sperren, Vertraute informieren.', indikation: 'Hilflosigkeit bei Cybermobbing', dauer: '15 Min' },
  ],
  'sexueller-missbrauch': [
    { titel: 'Ich habe das Recht Nein zu sagen', ansatz: 'Empowerment', beschreibung: 'Körperliche Grenzen kennen, benennen und schützen – auch gegenüber Erwachsenen.', indikation: 'Grenzüberschreitungen, Schutzarbeit', dauer: '20 Min' },
    { titel: 'Vertraute Erwachsene benennen', ansatz: 'Ressourcenorientiert', beschreibung: 'Drei Erwachsene identifizieren, denen man sich anvertrauen kann und die helfen würden.', indikation: 'Isolation, Missbrauchsrisiko', dauer: '15 Min' },
  ],

  // ── Identität & Entwicklung ────────────────────────────────
  'selbstbild': [
    { titel: 'Wer bin ich?', ansatz: 'Identitätsarbeit', beschreibung: 'Mindmap zur eigenen Person: Stärken, Werte, Rollen, Interessen, Träume.', indikation: 'Identitätsdiffusion, niedrige Selbstwirksamkeit', dauer: '20 Min' },
    { titel: 'Mein innerer Kritiker', ansatz: 'Schematherapie', beschreibung: 'Den inneren Kritiker kennenlernen und ihm einen freundlicheren inneren Berater entgegenstellen.', indikation: 'Selbstkritik, niedriges Selbstwertgefühl', dauer: '20 Min' },
  ],
  'kulturelle-identitaet': [
    { titel: 'Meine kulturellen Wurzeln', ansatz: 'Systemisch', beschreibung: 'Woher komme ich? Welche Werte, Traditionen und Sprachen gehören zu mir?', indikation: 'Identitätskonflikte durch Migration, Bikulturelle Identität', dauer: '25 Min' },
    { titel: 'Zwischen zwei Welten', ansatz: 'Narrative Therapie', beschreibung: 'Wie navigiere ich zwischen verschiedenen kulturellen Erwartungen? Geschichte der eigenen Identität schreiben.', indikation: 'Akkulturationsstress, Zugehörigkeitsgefühl', dauer: '25 Min' },
  ],
  'sexuelle-orientierung': [
    { titel: 'Was weiß ich über Sexuelle Orientierung?', ansatz: 'Psychoedukativ', beschreibung: 'Homo-, Bi-, Pan-, Asexualität und mehr – ohne Wertung informieren und Fragen beantworten.', indikation: 'Unsicherheit, Scham, Fragen zur Orientierung', dauer: '20 Min' },
    { titel: 'Meine Geschichte mit mir', ansatz: 'Narrative Therapie', beschreibung: 'Die eigene Geschichte bezüglich Identität und Orientierung in eigenen Worten erzählen – ohne Urteil.', indikation: 'Coming-out-Prozess, Identitätsfindung', dauer: '30 Min' },
  ],
  'werte-lebensinn': [
    { titel: 'Meine Werte-Hitliste', ansatz: 'Akzeptanz- und Commitmenttherapie', beschreibung: 'Aus 30 Werte-Karten die 5 wichtigsten auswählen und erklären, warum.', indikation: 'Orientierungslosigkeit, innere Leere', dauer: '20 Min' },
    { titel: 'Leben nach meinen Werten', ansatz: 'Akzeptanz- und Commitmenttherapie', beschreibung: 'Stimmt mein Alltag mit meinen Werten überein? Wo gibt es Lücken und wie kann ich sie schließen?', indikation: 'Sinnkrise, Leere, Entfremdung', dauer: '25 Min' },
  ],

  // ── Krisenintervention ─────────────────────────────────────
  'suizidalitaet': [
    { titel: 'Sicherheitsplan erstellen', ansatz: 'Krisenintervention', beschreibung: 'Gemeinsam einen schriftlichen Sicherheitsplan erarbeiten: Warnzeichen, Ablenkungen, Kontakte, Notfallnummern.', indikation: 'Suizidgedanken, Suizidalität', dauer: '30 Min' },
    { titel: 'Gründe zum Leben', ansatz: 'Lösungsfokussiert', beschreibung: 'Dinge, Menschen und Momente sammeln, die Grund zum Weiterleben geben – auch kleine.', indikation: 'Hoffnungslosigkeit, passive Suizidalität', dauer: '20 Min' },
    { titel: 'Krisentelefon-Karte', ansatz: 'Ressourcenorientiert', beschreibung: 'Karte mit Notfallnummern (Telefonseelsorge 0800 111 0 111, Notaufnahme, Bezugsperson) anfertigen.', indikation: 'Akute Krisenmomente ohne Begleitung', dauer: '10 Min' },
  ],
  'selbstverletzung': [
    { titel: 'Funktionen von Selbstverletzung verstehen', ansatz: 'Psychoedukativ', beschreibung: 'Warum tue ich das? Gefühle regulieren, Kontrolle gewinnen, Bestrafung – ohne Verurteilung besprechen.', indikation: 'Selbstverletzung, Verständnis fördern', dauer: '25 Min' },
    { titel: 'Alternatives Verhalten-Plan', ansatz: 'DBT', beschreibung: 'Konkrete Alternativen zur Selbstverletzung erarbeiten – Eiswürfel, Sport, Schreien ins Kissen, Malen.', indikation: 'Selbstverletzung, Impulsregulation', dauer: '20 Min' },
    { titel: 'Emotionen benennen lernen', ansatz: 'DBT', beschreibung: 'Das Emotions-Rad nutzen: Welches Gefühl liegt hinter der Selbstverletzung? Präzise benennen.', indikation: 'Alexithymie, emotionale Dysregulation', dauer: '20 Min' },
  ],
  'trauma': [
    { titel: 'Sicherer Ort', ansatz: 'Traumatherapie', beschreibung: 'Eine innere sichere Ort-Imagination erarbeiten und verankern – für akute Dissoziations- oder Überflutungsmomente.', indikation: 'PTBS, Traumafolgestörungen', dauer: '20 Min' },
    { titel: 'Grounding-Übung 5-4-3-2-1', ansatz: 'Achtsamkeit/Traumatherapie', beschreibung: '5 sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken – zurück in die Gegenwart kommen.', indikation: 'Dissoziation, Flashbacks', dauer: '10 Min' },
    { titel: 'Trigger-Map', ansatz: 'Traumatherapie', beschreibung: 'Was löst starke Reaktionen aus? Trigger identifizieren und Bewältigungsstrategien für jeden Trigger festlegen.', indikation: 'Häufige Triggerreaktionen, PTBS', dauer: '25 Min' },
  ],
  'trauer-verlust': [
    { titel: 'Abschiedsbrief schreiben', ansatz: 'Narrative Therapie', beschreibung: 'Einen Brief an die verlorene Person / das verlorene Tier / die verlorene Situation schreiben.', indikation: 'Komplizierte Trauer, Verluste', dauer: '30 Min' },
    { titel: 'Erinnerungs-Ritual', ansatz: 'Trauertherapie', beschreibung: 'Ein persönliches Ritual entwickeln, um an die verlorene Person zu erinnern und Abschied zu nehmen.', indikation: 'Trauerbewältigung', dauer: '20 Min' },
    { titel: 'Phasen der Trauer', ansatz: 'Psychoedukativ', beschreibung: 'Trauerphasen kennenlernen (nicht als starre Reihenfolge!) und eigene Trauer einordnen.', indikation: 'Normalisierung von Trauerreaktionen', dauer: '20 Min' },
  ],

  // ── ID-Aliase für korrektes Themen-Mapping ─────────────────
  'sport-bewegung': [
    { titel: 'Bewegungs-Check', ansatz: 'Ressourcenorientiert', beschreibung: 'Welche körperlichen Aktivitäten werden gerne gemacht? Wie oft? Barrieren und Lösungen benennen.', indikation: 'Bewegungsmangel, Depression', dauer: '15 Min' },
    { titel: 'Mini-Bewegungsplan', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Einen realistischen Wochenplan mit kleinen Bewegungseinheiten erstellen und erste Schritte festlegen.', indikation: 'Antriebslosigkeit, Übergewicht', dauer: '15 Min' },
  ],
  'koerperbild': [
    { titel: 'Körper-Dankbarkeit', ansatz: 'Positive Psychologie', beschreibung: 'Was leistet mein Körper jeden Tag? 10 Dinge aufschreiben, für die man dankbar ist.', indikation: 'Negatives Körperbild', dauer: '15 Min' },
    { titel: 'Medien-Körperbild analysieren', ansatz: 'Medienkritik', beschreibung: 'Bilder aus Magazinen/Social Media analysieren: Welche Körperbilder werden verkauft? Wer profitiert?', indikation: 'Unrealistische Körperideale, Essstörungstendenzen', dauer: '20 Min' },
    { titel: 'Selbstmitgefühl üben', ansatz: 'Achtsamkeit', beschreibung: 'Wie würde ich mit einer guten Freundin sprechen, die sich schlecht über ihren Körper fühlt? Dieselben Worte an sich selbst richten.', indikation: 'Starke Selbstkritik bzgl. Körper', dauer: '15 Min' },
  ],
  'suizidpraevention': [
    { titel: 'Sicherheitsplan erstellen', ansatz: 'Krisenintervention', beschreibung: 'Gemeinsam einen schriftlichen Sicherheitsplan erarbeiten: Warnzeichen, Ablenkungen, Kontakte, Notfallnummern.', indikation: 'Suizidgedanken, Suizidalität', dauer: '30 Min' },
    { titel: 'Gründe zum Leben', ansatz: 'Lösungsfokussiert', beschreibung: 'Dinge, Menschen und Momente sammeln, die Grund zum Weiterleben geben – auch kleine.', indikation: 'Hoffnungslosigkeit, passive Suizidalität', dauer: '20 Min' },
    { titel: 'Krisentelefon-Karte', ansatz: 'Ressourcenorientiert', beschreibung: 'Karte mit Notfallnummern (Kanner-Jugendtelefon 116 111, SOS Détresse 454545) anfertigen und griffbereit aufbewahren.', indikation: 'Akute Krisenmomente ohne Begleitung', dauer: '10 Min' },
  ],
  'werte-moral': [
    { titel: 'Werte-Karten sortieren', ansatz: 'Akzeptanz- und Commitmenttherapie', beschreibung: 'Aus einer Liste von 30 Werten die 5 wichtigsten auswählen und erklären warum.', indikation: 'Orientierungslosigkeit, Identitätsunsicherheit', dauer: '20 Min' },
    { titel: 'Moralische Dilemmata besprechen', ansatz: 'Werteklärung', beschreibung: 'Anhand von Alltagsszenarien moralische Überzeugungen herausarbeiten und auf Konflikte mit dem Umfeld eingehen.', indikation: 'Wertekonflikt mit Familie/Peers', dauer: '25 Min' },
    { titel: 'Leben nach meinen Werten', ansatz: 'Akzeptanz- und Commitmenttherapie', beschreibung: 'Wo gibt es Diskrepanz zwischen meinen Werten und meinem Handeln? Schritte zur Konsistenz erarbeiten.', indikation: 'Innere Leere, Sinnlosigkeit', dauer: '20 Min' },
  ],
  'lebenssinn': [
    { titel: 'Sinnquellen erkunden', ansatz: 'Existenzielle Therapie', beschreibung: 'Was gibt meinem Leben Bedeutung? Beziehungen, Tätigkeit, Werte, Leid-Bewältigung – alle Dimensionen erkunden.', indikation: 'Sinnkrise, existenzielle Leere', dauer: '30 Min' },
    { titel: 'Flow-Erlebnisse finden', ansatz: 'Positive Psychologie', beschreibung: 'Wann verliere ich das Zeitgefühl? Flow-Momente identifizieren und gezielt einplanen.', indikation: 'Fehlende Motivation, Anhedonie', dauer: '20 Min' },
    { titel: 'Brief an die Zukunft', ansatz: 'Lösungsfokussiert', beschreibung: 'Brief von einem erfüllten Ich in 10 Jahren – was wurde anders, was ist wichtig geblieben?', indikation: 'Hoffnungslosigkeit, fehlendes Zukunftsbild', dauer: '25 Min' },
  ],
  'geschlechtsidentitaet': [
    { titel: 'Psychoedukation Geschlechtsidentität', ansatz: 'Psychoedukativ', beschreibung: 'Erklärung von biologischem Geschlecht, Geschlechtsidentität, Ausdruck und sexueller Orientierung – ohne Wertung.', indikation: 'Verwirrung über Begriffe, erstes Nachdenken über Identität', dauer: '20 Min' },
    { titel: 'Affirmatives Gespräch', ansatz: 'Affirmative Therapie', beschreibung: 'Raum schaffen für das Erzählen der eigenen Geschichte zur Identität – aktiv zuhören ohne Bewertung oder Ratschläge.', indikation: 'Coming-out-Prozess, Scham, Einsamkeit', dauer: '30 Min' },
    { titel: 'Meine Geschichte', ansatz: 'Narrative Therapie', beschreibung: 'Die eigene Identitätsgeschichte in eigenen Worten erzählen oder aufschreiben – als Akt der Selbstbestimmung.', indikation: 'Identitätsfindung, Selbstakzeptanz', dauer: '30 Min' },
  ],

  // ── Fehlende Kategorien ergänzen ───────────────────────────
  'soziales-netzwerk': [
    { titel: 'Soziales Netzwerk kartieren', ansatz: 'Systemisch', beschreibung: 'Alle wichtigen Personen als Netz zeichnen – Nähe, Häufigkeit des Kontakts, Qualität der Unterstützung einschätzen.', indikation: 'Soziale Isolation, fehlende Ressourcen', dauer: '25 Min' },
    { titel: 'Ressourcen-Interview', ansatz: 'Lösungsfokussiert', beschreibung: 'Strukturiertes Interview: Wer unterstützt wofür? Wo gibt es Lücken? Was könnte das Netz stärken?', indikation: 'Defizitfokus, Übersehen vorhandener Ressourcen', dauer: '20 Min' },
    { titel: 'Netzwerk-Intervention planen', ansatz: 'Ressourcenorientiert', beschreibung: 'Eine konkrete Maßnahme zur Netzwerkstärkung identifizieren und die ersten Schritte gemeinsam planen.', indikation: 'Isolation, schwaches soziales Netz', dauer: '20 Min' },
  ],
  'schulkonflikt': [
    { titel: 'Konflikt-Analyse', ansatz: 'Kognitiv-behavioral', beschreibung: 'Den Schulkonflikt systematisch analysieren: Auslöser, beteiligte Personen, Reaktionen, Eskalationsmuster.', indikation: 'Eskalierte Schulkonflikte, Ausschluss', dauer: '25 Min' },
    { titel: 'Mediation vorbereiten', ansatz: 'Mediation', beschreibung: 'Klärung der eigenen Position, Bedürfnisse und Verhandlungsbereitschaft vor einem Gespräch mit Lehrern/Direktion.', indikation: 'Schwierige Lehrer-Schüler-Beziehung, Schulabbruchrisiko', dauer: '20 Min' },
    { titel: 'De-Eskalationstechniken', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Konkrete Techniken für hitzige Schulsituationen: Pause nehmen, tief atmen, weg gehen, Vertrauensperson einschalten.', indikation: 'Impulsdurchbrüche in der Schule', dauer: '15 Min' },
  ],
  'mentale-gesundheit': [
    { titel: 'Psychoedukation psychische Gesundheit', ansatz: 'Psychoedukativ', beschreibung: 'Was bedeutet psychische Gesundheit? Kontinuum zwischen gesund und krank, Entstigmatisierung, Schutzfaktoren.', indikation: 'Stigma, Unwissenheit über psychische Gesundheit', dauer: '20 Min' },
    { titel: 'Ressourcen-Inventar', ansatz: 'Ressourcenorientiert', beschreibung: 'Alle vorhandenen Schutzfaktoren sichtbar machen: sozial, körperlich, emotional, kognitiv.', indikation: 'Defizitfokus, unerkannte Stärken', dauer: '20 Min' },
    { titel: 'Hilfe suchen entstigmatisieren', ansatz: 'Psychoedukativ', beschreibung: 'Gemeinsam Hindernisse für Hilfsuche besprechen und konkrete nächste Schritte zur Unterstützung planen.', indikation: 'Widerstand gegen professionelle Hilfe', dauer: '20 Min' },
  ],
  'chronische-erkrankung': [
    { titel: 'Akzeptanz-Arbeit', ansatz: 'Akzeptanz- und Commitmenttherapie', beschreibung: 'Raum schaffen für Trauer und Wut über die Erkrankung – Akzeptanz als aktiver Prozess, nicht Aufgabe.', indikation: 'Widerstand gegen Erkrankung, Nicht-Wahrhaben-Wollen', dauer: '25 Min' },
    { titel: 'Selbstmanagement stärken', ansatz: 'Ressourcenorientiert', beschreibung: 'Was hat der Jugendliche bereits entwickelt, um mit der Erkrankung umzugehen? Kompetenzen sichtbar machen.', indikation: 'Hilflosigkeit, passives Krankheitskonzept', dauer: '20 Min' },
    { titel: 'Schnittstelle Schule', ansatz: 'Systemisch', beschreibung: 'Welche Anpassungen in der Schule würden helfen? Wie kann die Bezugsperson zwischen Jugendlichem und Schule vermitteln?', indikation: 'Schulische Probleme durch chronische Erkrankung', dauer: '20 Min' },
  ],
  'transport': [
    { titel: 'Mobilitäts-Kompetenzaufbau', ansatz: 'Kompetenzaufbau', beschreibung: 'Schrittweise Einführung in öffentliche Verkehrsmittel: gemeinsam Verbindungen suchen, Tickets kaufen, planen.', indikation: 'Abhängigkeit von anderen für Transport, Mobilitätsangst', dauer: '30 Min' },
    { titel: 'Selbstständigkeit stärken', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Kleine Schritte zu mehr Selbstständigkeit: erst mit Begleitung, dann alleine – Erfolgserlebnisse aufbauen.', indikation: 'Trennungsangst, geringe Selbstständigkeit', dauer: '20 Min' },
  ],
  'haushalt': [
    { titel: 'Haushaltskompetenzen aufbauen', ansatz: 'Kompetenzaufbau', beschreibung: 'Konkrete Haushaltstätigkeiten schrittweise einführen und üben – Kochen, Waschen, Einkaufen.', indikation: 'Mangelnde Alltagskompetenzen, Vorbereitung auf Selbstständigkeit', dauer: '30 Min' },
    { titel: 'Zukunftsorientierte Planung', ansatz: 'Lösungsfokussiert', beschreibung: 'Wie sieht mein Leben in 2 Jahren aus? Welche Alltagskompetenzen brauche ich dafür?', indikation: 'Unklare Zukunftsperspektive, fehlende Eigenverantwortung', dauer: '20 Min' },
  ],
  'freizeit': [
    { titel: 'Freizeitgestaltung optimieren', ansatz: 'Positive Psychologie', beschreibung: 'Bestehende Aktivitäten nach Flow, Genuss und Sinn bewerten und neue Aktivitäten gezielt einplanen.', indikation: 'Langeweile, Antriebslosigkeit, fehlende Interessen', dauer: '20 Min' },
    { titel: 'Aktivitätsplanung', ansatz: 'Verhaltensaktivierung', beschreibung: 'Angenehme Freizeitaktivitäten konkret in den Wochenplan einbauen – Datum, Zeit, Ort festlegen.', indikation: 'Rückzug, depressive Stimmung', dauer: '20 Min' },
  ],
  'ehrenamt': [
    { titel: 'Sinn und Identität', ansatz: 'Positive Psychologie', beschreibung: 'Wie kann Ehrenamt zu Sinnerleben und Identitätsbildung beitragen? Eigene Werte mit möglichem Engagement verknüpfen.', indikation: 'Sinnkrise, Identitätsunsicherheit', dauer: '20 Min' },
    { titel: 'Stärken einsetzen', ansatz: 'Lösungsfokussiert', beschreibung: 'Welche Stärken könnte der Jugendliche in ein Ehrenamt einbringen? Passende Einsatzfelder finden.', indikation: 'Geringe Selbstwirksamkeit, unerkannte Stärken', dauer: '20 Min' },
  ],
  'jugendrecht': [
    { titel: 'Psychoedukation Jugendrecht', ansatz: 'Psychoedukativ', beschreibung: 'Grundlegende Rechte Minderjähriger in Luxemburg erklären (UN-Kinderrechtskonvention, Code de la jeunesse).', indikation: 'Rechtsunsicherheit, Schutz vor Ausbeutung', dauer: '20 Min' },
    { titel: 'Empowerment durch Rechtswissen', ansatz: 'Empowerment', beschreibung: 'Rechtliche Handlungsmöglichkeiten bei Rechtsverletzungen kennenlernen – wen kontaktieren, was tun.', indikation: 'Ohnmacht, Missachtung von Rechten', dauer: '20 Min' },
  ],
  'jugendschutz': [
    { titel: 'Schutzrechte verstehen', ansatz: 'Psychoedukativ', beschreibung: 'Wer ist verpflichtet Jugendliche zu schützen? Meldepflichten, Behörden, Schutzmaßnahmen erklären.', indikation: 'Gefährdungssituationen, Schutzarbeit', dauer: '20 Min' },
    { titel: 'Sicherheitsplanung', ansatz: 'Ressourcenorientiert', beschreibung: 'Konkreten Schutzplan erstellen: Vertrauenspersonen, Notfallkontakte, sichere Orte.', indikation: 'Häusliche Gewalt, Vernachlässigung, Gefährdung', dauer: '25 Min' },
  ],
  'soziale-dienste': [
    { titel: 'Hilfesystem Luxemburg', ansatz: 'Psychoedukativ', beschreibung: 'Überblick über Beratungsstellen, Krisendienste und soziale Einrichtungen in Luxemburg vermitteln.', indikation: 'Unkenntnis des Hilfesystems, Isolation', dauer: '20 Min' },
    { titel: 'Brücke zu Hilfsangeboten', ansatz: 'Ressourcenorientiert', beschreibung: 'Hindernisse für Inanspruchnahme von Hilfe besprechen. Begleitung zum ersten Kontakt anbieten.', indikation: 'Schwellenangst, fehlende Unterstützung', dauer: '20 Min' },
  ],
  'polizei-justiz': [
    { titel: 'Psychoedukation Jugendstrafrecht', ansatz: 'Psychoedukativ', beschreibung: 'Luxemburger Jugendstrafrecht erklären: Tribunal de la jeunesse, Erziehungsmaßnahmen vs. Strafe.', indikation: 'Delinquenz, Kontakt mit Strafverfolgung', dauer: '25 Min' },
    { titel: 'Konsequenzen realistisch einschätzen', ansatz: 'Kognitiv-behavioral', beschreibung: 'Risiken und Folgen von Straftaten realistisch durchdenken – ohne zu moralisieren, aber klar benennen.', indikation: 'Verharmlosung von Delinquenz, Impulshandlungen', dauer: '20 Min' },
  ],
  'buergerrechte': [
    { titel: 'Demokratische Teilhabe', ansatz: 'Psychoedukativ', beschreibung: 'Möglichkeiten der demokratischen Teilhabe für Jugendliche in Luxemburg vorstellen – Jugendparlament, Petitionen, Wahlen.', indikation: 'Politische Apathie, Ohnmachtsgefühl', dauer: '20 Min' },
    { titel: 'Bürgerrechte und Pflichten', ansatz: 'Empowerment', beschreibung: 'Grundrechte und Pflichten als Bürger/in besprechen. Was schützt mich, was wird von mir erwartet?', indikation: 'Unkenntnis über Rechte, fehlende Eigenverantwortung', dauer: '20 Min' },
  ],
  'diskriminierung': [
    { titel: 'Diskriminierungserfahrungen anerkennen', ansatz: 'Narrative Therapie', beschreibung: 'Raum für Erfahrungen mit Diskriminierung schaffen – zuhören, validieren, benennen ohne zu bagatellisieren.', indikation: 'Erfahrungen mit Rassismus, Ausgrenzung, Stigmatisierung', dauer: '25 Min' },
    { titel: 'Empowerment und Gegenstrategien', ansatz: 'Empowerment', beschreibung: 'Welche Handlungsmöglichkeiten gibt es bei Diskriminierung? Rechtswege, Anlaufstellen (CET), eigene Stärken.', indikation: 'Ohnmacht, Hilflosigkeit bei Diskriminierung', dauer: '20 Min' },
    { titel: 'Identitätsstärkung', ansatz: 'Ressourcenorientiert', beschreibung: 'Kulturelle oder andere marginalisierte Identitäten als Ressource und Stärke neu verankern.', indikation: 'Negative Selbstwahrnehmung durch Diskriminierung', dauer: '25 Min' },
  ],
  'spiritualitaet': [
    { titel: 'Sinnquellen erkunden', ansatz: 'Existenzielle Therapie', beschreibung: 'Welche spirituellen, religiösen oder weltanschaulichen Überzeugungen tragen den Jugendlichen? Ohne Wertung erkunden.', indikation: 'Sinnkrise, existenzielle Fragen', dauer: '25 Min' },
    { titel: 'Rituale als Ressource', ansatz: 'Ressourcenorientiert', beschreibung: 'Welche Rituale (religiös, kulturell, persönlich) geben Halt und Orientierung? Bewusst einsetzen.', indikation: 'Mangel an Stabilität und Struktur', dauer: '20 Min' },
  ],
  'zugehoerigkeit': [
    { titel: 'Zugehörigkeitsanalyse', ansatz: 'Systemisch', beschreibung: 'In welchen Gruppen fühlt sich der Jugendliche zugehörig? Was erzeugt das Gefühl der Zugehörigkeit? Was fehlt?', indikation: 'Außenseiter-Erleben, soziale Isolation', dauer: '20 Min' },
    { titel: 'Gemeinschaft aufbauen', ansatz: 'Ressourcenorientiert', beschreibung: 'Konkrete Schritte erarbeiten, um Zugehörigkeit zu einer gewünschten Gemeinschaft zu erleben.', indikation: 'Einsamkeit, fehlendes Zugehörigkeitsgefühl', dauer: '20 Min' },
  ],
  'krisenintervention': [
    { titel: 'Krisenentspannung', ansatz: 'Stabilisierung', beschreibung: 'In der akuten Krise: Grounding, Atemtechniken, sicherer Ort – Rückkehr zur Handlungsfähigkeit.', indikation: 'Akute Krise, Überwältigung', dauer: '15 Min' },
    { titel: 'Sicherheitsplan gemeinsam erstellen', ansatz: 'Krisenintervention', beschreibung: 'Schriftlichen Sicherheitsplan erarbeiten: Frühwarnsignale, Strategien, Kontakte, Notfallnummern.', indikation: 'Suizidalität, selbstgefährdendes Verhalten', dauer: '25 Min' },
    { titel: 'Nächste Schritte planen', ansatz: 'Lösungsfokussiert', beschreibung: 'Nach Stabilisierung: Was sind die nächsten kleinen Schritte? Welche Unterstützung ist notwendig?', indikation: 'Nach akuter Krise, Destabilisierung', dauer: '20 Min' },
  ],
  'gewalt': [
    { titel: 'Gewalt benennen und validieren', ansatz: 'Traumatherapie', beschreibung: 'Erfahrungen von Gewalt benennen ohne Bagatellisierung. Validierung, Entlastung von Schuldgefühlen.', indikation: 'Häusliche Gewalt, Missbrauch, sexuelle Übergriffe', dauer: '25 Min' },
    { titel: 'Sicherheitsplan erstellen', ansatz: 'Empowerment', beschreibung: 'Gemeinsam einen Plan entwickeln: Warnzeichen, sichere Orte, Vertrauenspersonen, Notfallkontakte in Luxemburg.', indikation: 'Anhaltende Gewaltsituation', dauer: '25 Min' },
    { titel: 'Ressourcen und Stärken aktivieren', ansatz: 'Ressourcenorientiert', beschreibung: 'Welche Stärken hat der Jugendliche entwickelt, um mit Gewalt umzugehen? Diese sichtbar machen und stärken.', indikation: 'Erfahrungen mit Gewalt, Traumafolgen', dauer: '20 Min' },
  ],
  'resilienz': [
    { titel: 'Resilienzfaktoren sichtbar machen', ansatz: 'Positive Psychologie', beschreibung: 'Die 7 Säulen der Resilienz (Optimismus, Akzeptanz, Lösungsorientierung, Netzwerk, Verantwortung, Zukunftsorientierung, Selbstfürsorge) anwenden.', indikation: 'Geringe Widerstandsfähigkeit, Rückschläge', dauer: '25 Min' },
    { titel: 'Überlebensstärken', ansatz: 'Narrative Therapie', beschreibung: 'Wie hat der Jugendliche bisher schwierige Situationen überwunden? Diese Stärken benennen und als Ressource verankern.', indikation: 'Negatives Selbstbild, Übersehen eigener Stärken', dauer: '20 Min' },
    { titel: 'Resilienz-Strategie einüben', ansatz: 'Verhaltenstherapeutisch', beschreibung: 'Eine konkrete Strategie auswählen und in den Alltag integrieren (z.B. tägliche Dankbarkeitsübung, Bewegung, soziale Kontakte).', indikation: 'Fehlende Resilienzstrategien', dauer: '20 Min' },
  ],
  'trennungsangst': [
    { titel: 'Bindungsstil erkunden', ansatz: 'Bindungstheorie', beschreibung: 'Den eigenen Bindungsstil verstehen (sicher/unsicher-vermeidend/unsicher-ängstlich) und auf aktuelle Beziehungen anwenden.', indikation: 'Verlassensangst, Klammern, extreme Eifersucht', dauer: '25 Min' },
    { titel: 'Innere Sicherheit aufbauen', ansatz: 'Ressourcenorientiert', beschreibung: 'Imaginationsübung: Was gibt mir Sicherheit unabhängig von anderen Menschen? Innere Ressourcen verankern.', indikation: 'Starke Trennungsangst, Verlassenheitsangst', dauer: '20 Min' },
    { titel: 'Grounding bei Trennungsangst', ansatz: 'Kognitiv-behavioral', beschreibung: 'In akuten Angstsituationen: 5-4-3-2-1-Grounding anwenden. Automatische Katastrophengedanken identifizieren und hinterfragen.', indikation: 'Panikattacken bei Trennungen, Überflutung', dauer: '15 Min' },
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
// Screening – Domänen & Items (ICD-10 orientiert)
// Skala: 0 = nie/gar nicht, 1 = selten/manchmal, 2 = oft, 3 = fast immer/sehr stark
// ============================================================
const SCREENING_DOMAINS = [
  {
    id: 'depression',
    label: 'Depressive Stimmung',
    icd: 'F32/F33',
    farbe: '#5B6ABF',
    icon: '😔',
    cutoff: 6,
    items: [
      'Fühlt sich die meiste Zeit traurig oder leer',
      'Hat kaum Freude oder Interesse an Dingen, die früher Spaß gemacht haben',
      'Fühlt sich wertlos oder macht sich übermäßig Vorwürfe',
      'Hat Konzentrationsschwierigkeiten oder Entscheidungsprobleme',
      'Zieht sich von Freunden und Familie zurück',
    ],
    worksheets: ['depressive-stimmungen', 'selbstwertgefuehl', 'resilienz-staerken'],
  },
  {
    id: 'angst-generalisiert',
    label: 'Generalisierte Angst',
    icd: 'F41.1',
    farbe: '#E8A838',
    icon: '😰',
    cutoff: 5,
    items: [
      'Sorgt sich übermäßig und unkontrollierbar um viele Dinge',
      'Fühlt sich angespannt, nervös oder innerlich unruhig',
      'Hat körperliche Anzeichen (Zittern, Schwitzen, Herzklopfen)',
      'Schläft schlecht wegen Sorgen',
    ],
    worksheets: ['stress-angst', 'emotionsregulation'],
  },
  {
    id: 'angst-sozial',
    label: 'Soziale Angst',
    icd: 'F40.1',
    farbe: '#E07B39',
    icon: '😶',
    cutoff: 5,
    items: [
      'Vermeidet soziale Situationen (Klasse, Gruppenarbeit, Mensa)',
      'Fürchtet, bewertet oder ausgelacht zu werden',
      'Errötet, zittert oder schwitzt stark in sozialen Situationen',
      'Spricht kaum in der Gruppe, obwohl er/sie etwas zu sagen hätte',
    ],
    worksheets: ['stress-angst', 'kommunikation-grenzen', 'selbstwertgefuehl'],
  },
  {
    id: 'trauma',
    label: 'Trauma / Belastungsreaktion',
    icd: 'F43',
    farbe: '#9C4E77',
    icon: '⚡',
    cutoff: 4,
    items: [
      'Erlebt Flashbacks oder aufdringliche Erinnerungen an belastende Ereignisse',
      'Vermeidet Orte, Menschen oder Situationen, die an das Ereignis erinnern',
      'Zeigt übermäßige Schreckreaktionen oder ist hypervigilant',
      'Hat Schlafprobleme oder Alpträume in Zusammenhang mit dem Ereignis',
    ],
    worksheets: ['krisenplan', 'stress-angst', 'resilienz-staerken'],
  },
  {
    id: 'adhs',
    label: 'ADHS / Aufmerksamkeit',
    icd: 'F90',
    farbe: '#3DA8A8',
    icon: '⚡',
    cutoff: 7,
    items: [
      'Hat große Schwierigkeiten, die Aufmerksamkeit aufrechtzuerhalten',
      'Vergisst Aufgaben, verliert Gegenstände, ist unorganisiert',
      'Handelt impulsiv, ohne nachzudenken',
      'Ist motorisch unruhig, kann schlecht stillsitzen',
      'Wechselt häufig Aktivitäten, ohne eine zu beenden',
    ],
    worksheets: ['lernstrategien-schule', 'motivation', 'stress-angst'],
  },
  {
    id: 'conduct',
    label: 'Verhaltensauffälligkeiten',
    icd: 'F91',
    farbe: '#C0392B',
    icon: '🔥',
    cutoff: 5,
    items: [
      'Zeigt aggressives Verhalten gegenüber Personen oder Tieren',
      'Verstößt wiederholt gegen Regeln (Schule, Heimregeln)',
      'Lügt, stiehlt oder täuscht andere',
      'Zerstört absichtlich Eigentum anderer',
    ],
    worksheets: ['wut-aggression', 'kommunikation-grenzen', 'mobbing-cybermobbing'],
  },
  {
    id: 'selbstverletzung',
    label: 'Selbstverletzung / Suizidalität',
    icd: 'F43.2/F33.8',
    farbe: '#7B2D2D',
    icon: '⚠️',
    cutoff: 2,
    items: [
      'Verletzt sich absichtlich (Schneiden, Kratzen, Verbrennen)',
      'Hat Gedanken daran, sich selbst zu verletzen',
      'Hat Gedanken, nicht mehr leben zu wollen',
      'Hat konkrete Pläne, sich das Leben zu nehmen',
    ],
    worksheets: ['krisenplan', 'selbstverletzung', 'depressive-stimmungen'],
    alertItems: [2, 3], // 0-indexed — bei Score > 1 → Alarmbanner
  },
  {
    id: 'essstoerung',
    label: 'Essstörung / Körperbild',
    icd: 'F50',
    farbe: '#8E5EA2',
    icon: '🍽️',
    cutoff: 5,
    items: [
      'Hat ein sehr negatives Körperbild oder fühlt sich zu dick/dünn',
      'Isst extrem wenig oder verweigert Mahlzeiten',
      'Isst unkontrolliert große Mengen (Essanfälle)',
      'Kompensiert durch Erbrechen, Abführmittel oder übermäßigen Sport',
    ],
    worksheets: ['selbstwertgefuehl', 'stress-angst', 'emotionserkennung'],
  },
  {
    id: 'substanz',
    label: 'Substanzkonsum',
    icd: 'F10-F19',
    farbe: '#556B2F',
    icon: '🚬',
    cutoff: 5,
    items: [
      'Konsumiert regelmäßig Alkohol (mehr als 1x/Woche)',
      'Konsumiert Cannabis oder andere Drogen',
      'Benutzt Substanzen, um negative Gefühle zu regulieren',
      'Hat Schwierigkeiten, den Konsum zu kontrollieren oder zu reduzieren',
    ],
    worksheets: ['konsum-cannabis', 'konsum-alkohol', 'stress-angst'],
  },
  {
    id: 'schlaf',
    label: 'Schlafstörungen',
    icd: 'G47/F51',
    farbe: '#2C5F7A',
    icon: '🌙',
    cutoff: 5,
    items: [
      'Hat anhaltende Ein- oder Durchschlafprobleme',
      'Schläft am Tag sehr viel (mehr als 10h) oder ist tagsüber sehr müde',
      'Hat einen stark verschobenen Schlaf-Wach-Rhythmus',
      'Die Schlafprobleme beeinträchtigen Schule und Alltag erheblich',
    ],
    worksheets: ['schlaf-gesundheit', 'stress-angst'],
  },
  {
    id: 'psychose',
    label: 'Psychose-Hinweise',
    icd: 'F20-F29',
    farbe: '#4A2D6B',
    icon: '🔮',
    cutoff: 2,
    items: [
      'Berichtet über Stimmen oder Wahrnehmungen ohne äußere Ursache',
      'Hat ungewöhnliche oder bizarre Überzeugungen (Verfolgung, besondere Mission)',
      'Zeigt deutlich veränderte oder flache Emotionen',
    ],
    worksheets: ['krisenplan'],
  },
  {
    id: 'autismus',
    label: 'Autismus-Spektrum',
    icd: 'F84',
    farbe: '#2A7D6E',
    icon: '🧩',
    cutoff: 6,
    items: [
      'Hat große Schwierigkeiten mit sozialer Kommunikation',
      'Zeigt ungewöhnliche oder sehr eingeschränkte Interessen',
      'Besteht auf strikten Routinen, reagiert stark auf Veränderungen',
      'Hat sensorische Über- oder Unterempfindlichkeiten',
    ],
    worksheets: ['kommunikation-grenzen', 'emotionserkennung', 'stress-angst'],
  },
  {
    id: 'trennungsangst',
    label: 'Trennungsangst',
    icd: 'F93.0',
    farbe: '#C0834A',
    icon: '🏠',
    cutoff: 4,
    items: [
      'Hat übermäßige Angst, von Bezugspersonen getrennt zu werden',
      'Weigert sich, alleine zu sein oder ohne Bezugspersonen zur Schule zu gehen',
      'Hat körperliche Beschwerden (Bauchschmerzen, Kopfschmerzen) vor Trennungen',
    ],
    worksheets: ['stress-angst', 'familie', 'resilienz-staerken'],
  },
  {
    id: 'mobbing',
    label: 'Mobbing / Viktimisierung',
    icd: null,
    farbe: '#B05030',
    icon: '👊',
    cutoff: 4,
    items: [
      'Wird von Peers regelmäßig ausgegrenzt, gehänselt oder schikaniert',
      'Erlebt Cybermobbing (Nachrichten, Bilder, Gruppen)',
      'Hat Angst vor bestimmten Schüler/innen oder Situationen in der Schule',
    ],
    worksheets: ['mobbing-cybermobbing', 'kommunikation-grenzen', 'selbstwertgefuehl'],
  },
  {
    id: 'familie',
    label: 'Familiäre Belastungen',
    icd: null,
    farbe: '#6B4F30',
    icon: '👨‍👩‍👦',
    cutoff: 5,
    items: [
      'Erlebt oder erlebte häusliche Gewalt (direkt oder als Zeuge)',
      'Hat einen Elternteil mit psychischer Erkrankung oder Suchtproblem',
      'Lebt in sehr instabilen oder wechselnden Wohnverhältnissen',
      'Hat keinen oder kaum Kontakt zu einem Elternteil',
    ],
    worksheets: ['familie', 'resilienz-staerken', 'krisenplan'],
  },
  {
    id: 'diskriminierung',
    label: 'Diskriminierung / Identität',
    icd: null,
    farbe: '#B03060',
    icon: '⚖️',
    cutoff: 4,
    items: [
      'Erlebt Diskriminierung aufgrund von Herkunft, Religion oder Aussehen',
      'Hat Schwierigkeiten mit der eigenen kulturellen oder religiösen Identität',
      'Fühlt sich in der Gesellschaft oder Schule nicht zugehörig',
    ],
    worksheets: ['diskriminierung', 'identitaet', 'selbstwertgefuehl'],
  },
  {
    id: 'soziale-isolation',
    label: 'Soziale Isolation',
    icd: null,
    farbe: '#445566',
    icon: '🏝️',
    cutoff: 4,
    items: [
      'Hat keine oder kaum Freundschaften',
      'Verbringt die meiste Freizeit allein (ohne bewusste Wahl)',
      'Fühlt sich einsam und unverstanden',
      'Zieht sich aus sozialen Aktivitäten zurück',
    ],
    worksheets: ['freundschaft-konflikte', 'kommunikation-grenzen', 'selbstwertgefuehl'],
  },
  {
    id: 'resilienz',
    label: 'Schutzfaktoren / Resilienz',
    icd: null,
    farbe: '#2E7D32',
    icon: '💪',
    cutoff: 0,
    invertiert: true, // Höherer Score = besser (Ressourcen)
    items: [
      'Hat mindestens eine stabile Vertrauensperson (Familie oder Peers)',
      'Hat Hobbys oder Interessen, die ihm/ihr Freude machen',
      'Kann über Probleme sprechen und Hilfe annehmen',
      'Zeigt Durchhaltevermögen bei Schwierigkeiten',
    ],
    worksheets: ['resilienz-staerken', 'identitaet'],
  },
];

// Komorbiditats-Muster-Erkennung
const KOMORBIDITÄT_MUSTER = [
  {
    id: 'internalisierend',
    label: 'Internalisierendes Muster',
    beschreibung: 'Depression + Angst deutet auf internalisierendes Syndrom hin',
    farbe: '#5B6ABF',
    bedingung: (flags) => flags.includes('depression') && (flags.includes('angst-generalisiert') || flags.includes('angst-sozial')),
  },
  {
    id: 'externalisierend',
    label: 'Externalisierendes Muster',
    beschreibung: 'ADHS + Verhaltensauffälligkeiten deutet auf externalisierendes Syndrom hin',
    farbe: '#C0392B',
    bedingung: (flags) => flags.includes('adhs') && flags.includes('conduct'),
  },
  {
    id: 'krisenindikator',
    label: 'Krisenindikator',
    beschreibung: 'Depression + Selbstverletzung/Suizidalität — sofortige Begleitung erforderlich',
    farbe: '#7B2D2D',
    bedingung: (flags) => flags.includes('selbstverletzung') && flags.includes('depression'),
  },
  {
    id: 'trauma-komplex',
    label: 'Komplextrauma-Hinweis',
    beschreibung: 'Trauma + familiäre Belastungen + Dissoziation/Psychose',
    farbe: '#9C4E77',
    bedingung: (flags) => flags.includes('trauma') && flags.includes('familie'),
  },
  {
    id: 'sozial-rueckzug',
    label: 'Sozialer Rückzug',
    beschreibung: 'Soziale Angst + Isolation + Depression',
    farbe: '#445566',
    bedingung: (flags) => flags.includes('soziale-isolation') && (flags.includes('angst-sozial') || flags.includes('depression')),
  },
  {
    id: 'substanz-selbstmedikation',
    label: 'Selbstmedikation',
    beschreibung: 'Substanzkonsum als Bewältigungsstrategie bei Angst/Depression',
    farbe: '#556B2F',
    bedingung: (flags) => flags.includes('substanz') && (flags.includes('depression') || flags.includes('angst-generalisiert') || flags.includes('trauma')),
  },
];

// ============================================================
// Datenverwaltung (localStorage)
// ============================================================
const DB = {
  KEYS: {
    SCHUELER: 'cdse_schueler',
    NOTIZEN: 'cdse_notizen',
    TERMINE: 'cdse_termine',
    SCREENINGS: 'cdse_screenings',
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

  // Screenings
  getScreenings(schuelerId = null) {
    const alle = JSON.parse(localStorage.getItem(this.KEYS.SCREENINGS) || '[]');
    return schuelerId ? alle.filter(s => s.schuelerId === schuelerId) : alle;
  },
  saveScreening(data) {
    const alle = this.getScreenings();
    const idx = alle.findIndex(s => s.id === data.id);
    if (idx >= 0) {
      alle[idx] = data;
    } else {
      alle.push(data);
    }
    localStorage.setItem(this.KEYS.SCREENINGS, JSON.stringify(alle));
    return data;
  },
  createScreening(schuelerId) {
    const neu = {
      id: this.generateId(),
      schuelerId,
      datum: new Date().toISOString(),
      antworten: {},          // { domainId_itemIdx: 0-3 }
      scores: {},             // { domainId: number }
      flaggedAreas: [],       // [domainId]
      comorbidityPattern: [], // [string]
      worksheetRecommendations: [], // [{ datei, titel, score }]
      severity: 'low',        // 'low'|'medium'|'high'|'urgent'
      clinicalNotes: '',
      followUpDate: '',
      abgeschlossen: false,
      erstellt: new Date().toISOString(),
      geaendert: new Date().toISOString(),
    };
    const alle = this.getScreenings();
    alle.push(neu);
    localStorage.setItem(this.KEYS.SCREENINGS, JSON.stringify(alle));
    return neu;
  },
  deleteScreening(id) {
    const alle = this.getScreenings().filter(s => s.id !== id);
    localStorage.setItem(this.KEYS.SCREENINGS, JSON.stringify(alle));
  },
};

// ─── Sitzungsbasierte Therapiemodule (Ebene 2) ────────────────────────────────
const THEMA_MODULE = {

  'familienzusammensetzung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit komplexen Familienverhältnissen oder Orientierungsbedarf',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Familie – ein Überblick',
        dauer: '60 Min',
        ziel: 'Eigene Familienkonstellation klar beschreiben und einordnen können',
        psychoedukation: {
          titel: 'Was ist eine Familie?',
          inhalt: 'Familien gibt es in vielen Formen: Kernfamilien, Patchworkfamilien, Alleinerziehende, Großfamilien, gleichgeschlechtliche Eltern. Keine Form ist „falscher" als eine andere. Entscheidend ist, wer für dich da ist und Verantwortung übernimmt.'
        },
        interventionen: [
          {
            titel: 'Familienbild zeichnen',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Der Schüler zeichnet oder schreibt, wer zu seiner Familie gehört – ohne Vorgabe. Anschließend gemeinsam besprechen: Wer fehlt? Wer war überraschend dabei? Was fühlt sich richtig an?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Familienmitglieder vorstellen',
            beschreibung: 'Jedes Familienmitglied kurz in drei Worten beschreiben: Wer ist diese Person für mich? Was verbindet uns? Was trennt uns?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Familien-Steckbrief',
          beschreibung: 'Ein kurzes Blatt: „Meine Familie besteht aus…" – mit Namen, Rollen und einem Satz pro Person.',
          dauer: '15 Min'
        },
        reflexion: [
          'War es einfach oder schwer, deine Familie zu beschreiben? Warum?',
          'Gibt es jemanden, den du dazuzählen würdest, obwohl er/sie nicht biologisch verwandt ist?'
        ]
      },
      {
        nr: 2,
        titel: 'Rollen und Regeln in meiner Familie',
        dauer: '60 Min',
        ziel: 'Familienrollen und -regeln bewusst wahrnehmen und hinterfragen',
        psychoedukation: {
          titel: 'Rollen in Familien',
          inhalt: 'In jeder Familie gibt es unausgesprochene Rollen: der Vermittler, der Starke, das Sorgenkind, der Unsichtbare. Diese Rollen entstehen oft unbewusst und können einengen. Sie zu erkennen ist der erste Schritt, um selbst zu entscheiden, wer man sein möchte.'
        },
        interventionen: [
          {
            titel: 'Rollenlandkarte',
            ansatz: 'Systemisch',
            beschreibung: 'Welche Rolle(n) nimmst du in deiner Familie ein? Welche wurden dir zugeschrieben? Macht diese Rolle dir das Leben leichter oder schwerer? Gemeinsam erarbeiten, ob und wie sich Rollen verändern lassen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Familienregeln sammeln',
            beschreibung: 'Schreibe 5 Regeln auf, die in deiner Familie gelten – auch unausgesprochene. Markiere: Welche findest du sinnvoll? Welche belasten dich?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eine Woche beobachten',
          beschreibung: 'Beobachte diese Woche, wann du in deiner „Familienrolle" bist – und wann du einfach du selbst sein kannst.',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Welche Rolle möchtest du in deiner Familie einnehmen?',
          'Gibt es Regeln, die du gerne ändern würdest? Was bräuchte es dafür?'
        ]
      },
      {
        nr: 3,
        titel: 'Stärken und Ressourcen meiner Familie',
        dauer: '60 Min',
        ziel: 'Familienressourcen aktivieren und als Stütze im Alltag nutzen',
        psychoedukation: {
          titel: 'Familiäre Schutzfaktoren',
          inhalt: 'Selbst in schwierigen Familienverhältnissen gibt es meistens Ressourcen: eine verlässliche Person, gemeinsame Rituale, geteilte Werte oder positive Erinnerungen. Diese Schutzfaktoren zu erkennen und zu stärken ist eine wichtige Grundlage für Resilienz.'
        },
        interventionen: [
          {
            titel: 'Ressourcenkarte Familie',
            ansatz: 'Ressourcenorientiert / Lösungsfokussiert',
            beschreibung: 'Gemeinsam erarbeiten: Was läuft in deiner Familie gut? Wer unterstützt dich? Welche positiven Momente gibt es? Diese Ressourcen auf einer Karte festhalten und als Anker nutzen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief an meine Familie',
            beschreibung: 'Schreibe einen kurzen Brief (der nicht abgeschickt werden muss): Was schätzt du an deiner Familie? Was wünschst du dir von ihr?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Positiver Moment',
          beschreibung: 'Tue diese Woche bewusst etwas, das eine positive Verbindung in deiner Familie stärkt – egal wie klein.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du deine Familiensituation in einem Jahr beschreiben?'
        ]
      }
    ]
  },

  'eltern-kind-beziehung': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit Bindungsproblemen, Konflikten oder eingeschränkter Kommunikation mit Eltern',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie ist meine Beziehung zu meinen Eltern?',
        dauer: '60 Min',
        ziel: 'Aktuelle Beziehungsqualität realistisch einschätzen',
        psychoedukation: {
          titel: 'Bindung und Beziehung',
          inhalt: 'Die Beziehung zu den eigenen Eltern ist die erste und prägendste Beziehung im Leben. Bindungserfahrungen – ob sicher, ängstlich oder vermeidend – beeinflussen, wie wir später Vertrauen, Nähe und Konflikte erleben. Bindungsmuster lassen sich aber verändern.'
        },
        interventionen: [
          {
            titel: 'Beziehungsbarometer',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Der Schüler bewertet die Beziehung zu Mutter und Vater (oder relevanten Bezugspersonen) auf einer Skala 1–10: Nähe, Vertrauen, Kommunikation, Konflikt. Ergebnisse besprechen: Was fällt auf? Was überrascht?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Drei Erinnerungen',
            beschreibung: 'Nenne je eine positive, eine neutrale und eine schwierige Erinnerung mit einem Elternteil. Was sagen diese Erinnerungen über die Beziehung aus?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beziehungs-Tagebuch',
          beschreibung: 'Diese Woche täglich einen Satz aufschreiben: „Heute mit Mama/Papa war…"',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was wünschst du dir von deinen Eltern, das du bisher nicht hattest?',
          'Was glaubst du, was sich deine Eltern von dir wünschen?'
        ]
      },
      {
        nr: 2,
        titel: 'Konflikte mit Eltern verstehen',
        dauer: '60 Min',
        ziel: 'Wiederkehrende Konfliktmuster erkennen und analysieren',
        psychoedukation: {
          titel: 'Warum streiten Eltern und Kinder?',
          inhalt: 'Konflikte zwischen Eltern und Jugendlichen sind normal – sie gehören zur Entwicklung der Eigenständigkeit. Häufige Themen: Freiheit vs. Schutz, Kontrolle vs. Vertrauen, unterschiedliche Werte. Konflikte können auch Chancen sein, die Beziehung neu auszuhandeln.'
        },
        interventionen: [
          {
            titel: 'Konfliktanalyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Einen typischen Streit mit den Eltern durchgehen: Auslöser → Reaktion (eigene + elterliche) → Eskalation → Ende. Was steckt hinter dem Streit? Welches Bedürfnis hat jede Seite? Wie könnte es anders laufen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Perspektivwechsel',
            beschreibung: 'Beschreibe den letzten Streit aus der Sicht deiner Eltern. Was haben sie gefühlt, gedacht, gewollt?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Streit-Stopp-Karte',
          beschreibung: 'Schreibe einen Satz auf, den du beim nächsten Konflikt sagen kannst, um eine Pause einzulegen (z.B.: „Ich brauche kurz Zeit zum Nachdenken.").',
          dauer: '10 Min'
        },
        reflexion: [
          'Welches Bedürfnis steckt meistens hinter deinen Konflikten mit den Eltern?',
          'Was könnte dein Anteil an der Eskalation sein?'
        ]
      },
      {
        nr: 3,
        titel: 'Kommunikation verbessern',
        dauer: '60 Min',
        ziel: 'Konkrete Kommunikationsstrategien erproben',
        psychoedukation: {
          titel: 'Ich-Botschaften und aktives Zuhören',
          inhalt: 'Viele Gespräche eskalieren durch Vorwürfe (\"Du machst immer…\"). Ich-Botschaften beschreiben die eigene Wirkung ohne Anklage: „Ich fühle mich verletzt, wenn…" Aktives Zuhören bedeutet, wirklich zu verstehen, was der andere meint – nicht nur auf eine Pause zu warten.'
        },
        interventionen: [
          {
            titel: 'Gesprächstraining',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Rollenspiel: Ein schwieriges Gespräch mit einem Elternteil üben. Erst mit der bisherigen Strategie, dann mit Ich-Botschaften und aktivem Zuhören. Feedback geben: Was war anders? Was war schwer?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ich-Botschaften formulieren',
            beschreibung: 'Wandle 3 typische Vorwürfe in Ich-Botschaften um: „Du hörst mir nie zu." → „Ich wünsche mir, dass du mir zuhörst, wenn ich dir etwas Wichtiges erzähle."',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Echtes Gespräch',
          beschreibung: 'Führe diese Woche bewusst ein Gespräch mit einem Elternteil, in dem du mindestens eine Ich-Botschaft verwendest.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war bei dem Gespräch anders als sonst?',
          'Was möchtest du weiter üben?'
        ]
      },
      {
        nr: 4,
        titel: 'Eine neue Beziehung gestalten',
        dauer: '60 Min',
        ziel: 'Wünsche und Grenzen in der Elternbeziehung klar formulieren',
        psychoedukation: {
          titel: 'Beziehungen aktiv mitgestalten',
          inhalt: 'Auch wenn Eltern sich nicht ändern, kann ich verändern, wie ich auf sie reagiere. Ich kann klarmachen, was ich brauche, Grenzen setzen und Nähe gezielt suchen. Das gibt mir Handlungsfähigkeit – egal wie die Eltern reagieren.'
        },
        interventionen: [
          {
            titel: 'Wünsche-Brief',
            ansatz: 'Narrativ / Emotionsfokussiert',
            beschreibung: 'Der Schüler schreibt einen Brief an seine Eltern – der nicht abgeschickt werden muss. Was wünschst du dir? Was tut dir weh? Was möchtest du ihnen sagen, was du bisher nicht gesagt hast?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Grenzen definieren',
            beschreibung: 'Schreibe auf: Was ist für mich in dieser Beziehung okay – und was nicht? Wie kann ich diese Grenzen klar und freundlich kommunizieren?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Positive Geste',
          beschreibung: 'Tue diese Woche eine kleine Geste, die die Beziehung zu einem Elternteil stärkt – unabhängig davon, wie sie reagieren.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen einen Schritt möchtest du in den nächsten zwei Wochen gehen?'
        ]
      }
    ]
  },

};
