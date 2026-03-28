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

  'geschwister': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Rivalitäts-, Eifersucht- oder Rollenthemen im Geschwistersystem',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Geschwister und ich',
        dauer: '60 Min',
        ziel: 'Geschwisterdynamik bewusst wahrnehmen und einordnen',
        psychoedukation: {
          titel: 'Geschwisterpositionen und ihre Wirkung',
          inhalt: 'Die Position in der Geschwisterreihe – Älteste/r, Mittleres Kind, Jüngste/r, Einzelkind – beeinflusst, welche Rolle man in der Familie einnimmt. Älteste übernehmen oft Verantwortung, Jüngste genießen mehr Freiheit, mittlere Kinder lernen früh Vermitteln. Diese Muster sind keine Schicksale, aber es lohnt sich, sie zu kennen.'
        },
        interventionen: [
          {
            titel: 'Geschwister-Landkarte',
            ansatz: 'Systemisch',
            beschreibung: 'Der Schüler zeichnet sich und seine Geschwister mit Pfeilen: Wer ist wem wie nah? Wo gibt es Spannung? Was verbindet? Anschließend besprechen: Was überrascht dich daran?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Geschwister in drei Worten',
            beschreibung: 'Beschreibe jedes Geschwister in drei Adjektiven – und dann dich selbst im Vergleich. Was fällt auf?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtungsauftrag',
          beschreibung: 'Beobachte diese Woche, wann du dich mit einem Geschwister verbunden fühlst – und wann nicht.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Welche Rolle spielst du unter deinen Geschwistern?',
          'Wurde dir diese Rolle zugewiesen oder hast du sie selbst gewählt?'
        ]
      },
      {
        nr: 2,
        titel: 'Rivalität und Eifersucht verstehen',
        dauer: '60 Min',
        ziel: 'Geschwisterrivalität normalisieren und konstruktiv umgehen',
        psychoedukation: {
          titel: 'Warum gibt es Geschwisterrivalität?',
          inhalt: 'Geschwisterrivalität entsteht, weil Kinder um die Aufmerksamkeit und Liebe der Eltern konkurrieren – das ist biologisch normal. Vergleiche ("Dein Bruder schafft das doch auch") verstärken Rivalität. Was hilft: das eigene Ich stärken, statt sich ständig zu vergleichen.'
        },
        interventionen: [
          {
            titel: 'Vergleichs-Falle aufdecken',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Welche Vergleiche machen dich traurig oder wütend? Gemeinsam analysieren: Was steckt dahinter? Wessen Bewertung ist das wirklich – und wie siehst du das selbst?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meine eigenen Stärken',
            beschreibung: 'Liste 5 Dinge auf, in denen du gut bist – unabhängig davon, was deine Geschwister können oder nicht.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vergleich-Stopp',
          beschreibung: 'Achte diese Woche darauf, wann du dich mit Geschwistern vergleichst. Schreibe auf: Was denkst du dann? Was könntest du stattdessen denken?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann fühlst du dich deinen Geschwistern gegenüber im Nachteil?',
          'Was würdest du dir von deinen Eltern wünschen, damit das besser wird?'
        ]
      },
      {
        nr: 3,
        titel: 'Geschwisterbeziehung stärken',
        dauer: '60 Min',
        ziel: 'Ressourcen in der Geschwisterbeziehung aktivieren',
        psychoedukation: {
          titel: 'Geschwister als lebenslange Beziehung',
          inhalt: 'Geschwisterbeziehungen sind oft die längsten Beziehungen im Leben. Selbst wenn es jetzt schwierig ist: Die Möglichkeit, diese Beziehung zu gestalten, bleibt. Kleine Schritte – Interesse zeigen, gemeinsam etwas erleben – können viel verändern.'
        },
        interventionen: [
          {
            titel: 'Positive Geschwistermomente',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Gemeinsam positive Erinnerungen mit Geschwistern sammeln. Was habt ihr gemeinsam erlebt? Was verbindet euch, auch wenn es gerade schwierig ist? Wie könnte eine bessere Beziehung aussehen?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Eine Geste planen',
            beschreibung: 'Überlege eine konkrete kleine Geste, die deine Beziehung zu einem Geschwister stärken könnte. Was genau, wann, wie?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gemeinsame Zeit',
          beschreibung: 'Verbringe diese Woche bewusst 15 Minuten mit einem Geschwister – ohne Ablenkung.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du deine Geschwisterbeziehung in Zukunft gestalten?'
        ]
      }
    ]
  },

  'wohnsituation': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit instabiler Wohnsituation, häufigen Umzügen oder beengten Verhältnissen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wo lebe ich – und wie fühlt sich das an?',
        dauer: '60 Min',
        ziel: 'Eigene Wohnsituation beschreiben und emotional einordnen',
        psychoedukation: {
          titel: 'Wohnen als Grundbedürfnis',
          inhalt: 'Ein stabiles Zuhause ist eines der wichtigsten Grundbedürfnisse. Es geht nicht nur um einen Platz zum Schlafen, sondern um Sicherheit, Rückzugsmöglichkeit und ein Gefühl von Zugehörigkeit. Wenn die Wohnsituation unsicher oder belastend ist, wirkt sich das auf fast alle Lebensbereiche aus.'
        },
        interventionen: [
          {
            titel: 'Mein Zuhause beschreiben',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Der Schüler beschreibt oder zeichnet sein Zuhause: Wo schläfst du? Hast du einen eigenen Platz? Wo kannst du dich zurückziehen? Was gefällt dir, was belastet dich?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sicherheits-Skala',
            beschreibung: 'Wie sicher und stabil fühlt sich deine Wohnsituation an (1–10)? Was bräuchte es, damit die Zahl höher wäre?',
            dauer: '10 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Mein Lieblingsplatz',
          beschreibung: 'Finde diese Woche einen Ort (zu Hause oder woanders), der sich gut anfühlt, und schreibe auf, warum er dir gut tut.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was bedeutet „Zuhause" für dich?',
          'Hattest du schon mal ein Zuhause, wo du dich wirklich sicher gefühlt hast?'
        ]
      },
      {
        nr: 2,
        titel: 'Umzüge und Veränderungen verarbeiten',
        dauer: '60 Min',
        ziel: 'Auswirkungen von Umzügen und Instabilität auf das eigene Leben erkennen',
        psychoedukation: {
          titel: 'Was Umzüge mit uns machen',
          inhalt: 'Häufige Umzüge bedeuten: neue Schule, neue Nachbarschaft, neue Freunde finden. Das kostet enorm viel Energie. Viele Kinder entwickeln dabei Strategien – manche ziehen sich zurück, andere werden besonders anpassungsfähig. Beide Reaktionen sind verständlich. Wichtig ist, die eigene Reaktion zu kennen.'
        },
        interventionen: [
          {
            titel: 'Umzugs-Zeitlinie',
            ansatz: 'Narrativ',
            beschreibung: 'Alle Wohnorte/Umzüge der bisherigen Kindheit auf einer Zeitlinie eintragen. Zu jedem Ort: Was war gut? Was war schlimm? Was hast du dabei gelernt?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Was ich immer dabei habe',
            beschreibung: 'Was nimmst du bei jedem Umzug mit – nicht materiell, sondern als Person? Welche Stärken hast du durch die Veränderungen entwickelt?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Erinnerungsgegenstand',
          beschreibung: 'Such einen Gegenstand, der dir ein Gefühl von Kontinuität gibt – etwas, das immer bei dir ist, egal wo du wohnst.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hat dich durch alle Veränderungen hindurch begleitet?',
          'Was würdest du dir für eine stabile Wohnsituation wünschen?'
        ]
      },
      {
        nr: 3,
        titel: 'Stabilität aufbauen – trotz äußerer Unsicherheit',
        dauer: '60 Min',
        ziel: 'Innere Stabilität und externe Ressourcen stärken',
        psychoedukation: {
          titel: 'Innere Heimat finden',
          inhalt: 'Wenn die äußere Situation nicht stabil ist, können innere Ressourcen und verlässliche Beziehungen ein „inneres Zuhause" bieten. Das können Rituale, vertraute Menschen, Interessen oder Orte sein, die sich sicher anfühlen – auch wenn man gerade keine feste Wohnadresse hat.'
        },
        interventionen: [
          {
            titel: 'Stabilitätsanker identifizieren',
            ansatz: 'Ressourcenorientiert / Lösungsfokussiert',
            beschreibung: 'Gemeinsam erarbeiten: Welche Menschen, Orte, Aktivitäten geben dir ein Gefühl von Stabilität? Wie kannst du diese stärker in deinen Alltag einbinden?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Mein stabiler Alltag',
            beschreibung: 'Entwirf einen Tagesablauf, der dir trotz unsicherer Wohnsituation Struktur gibt: feste Zeiten fürs Schlafen, Essen, Schule, Erholung.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ein Ritual einführen',
          beschreibung: 'Führe diese Woche ein kleines tägliches Ritual ein (z.B. morgens 5 Min Musik hören, abends aufschreiben was gut war).',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Was gibt dir am meisten Halt in deinem Leben?',
          'Welche Ressource möchtest du weiter stärken?'
        ]
      }
    ]
  },

  'trennung-scheidung': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler, deren Eltern sich getrennt haben oder gerade trennen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was passiert gerade in meiner Familie?',
        dauer: '60 Min',
        ziel: 'Die Trennungssituation benennen und eigene Reaktionen normalisieren',
        psychoedukation: {
          titel: 'Trennung – was das bedeutet',
          inhalt: 'Wenn Eltern sich trennen, verändert sich vieles gleichzeitig: Wohnen, Alltag, Loyalitäten. Kinder und Jugendliche reagieren sehr unterschiedlich – manche sind wütend, manche traurig, manche fühlen sich schuldig (ohne es zu sein), manche wirken nach außen hin stabil. Alle Reaktionen sind verständlich.'
        },
        interventionen: [
          {
            titel: 'Meine Situation in Worten',
            ansatz: 'Narrativ',
            beschreibung: 'Der Schüler erzählt oder schreibt, was passiert ist und wie es ihm dabei geht. Keine Wertung, kein Ratschlag – nur zuhören und spiegeln. Was beschäftigt dich am meisten?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühls-Thermometer',
            beschreibung: 'Zeichne ein Thermometer: Welche Gefühle hast du wegen der Trennung? Benenne sie und ordne sie nach Intensität.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gedanken aufschreiben',
          beschreibung: 'Schreibe diese Woche auf, was dich zum Thema Trennung beschäftigt – Gedanken, Fragen, Sorgen.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was beschäftigt dich gerade am meisten?',
          'Gibt es jemanden, mit dem du über die Trennung reden kannst?'
        ]
      },
      {
        nr: 2,
        titel: 'Schuld, Loyalität und Verantwortung klären',
        dauer: '60 Min',
        ziel: 'Falsche Schuldgefühle und Loyalitätskonflikte auflösen',
        psychoedukation: {
          titel: 'Es ist nicht deine Schuld',
          inhalt: 'Viele Kinder glauben, die Trennung der Eltern mitverursacht zu haben – durch Streit, Verhalten oder den bloßen Wunsch, dass der andere Elternteil gewinnt. Das stimmt nicht. Eltern trennen sich wegen ihrer eigenen Beziehung. Kinder haben daran keine Schuld – und auch keine Verantwortung, es zu reparieren.'
        },
        interventionen: [
          {
            titel: 'Loyalitätskonflikt sichtbar machen',
            ansatz: 'Systemisch',
            beschreibung: 'Mit zwei Stühlen oder Karten: Der Schüler steht zwischen beiden Elternteilen. Was erwartet jeder von ihm? Wie fühlt sich das an? Was wäre, wenn er sich von diesem Druck befreien könnte?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief: „Es ist nicht meine Schuld"',
            beschreibung: 'Schreibe dir selbst einen Brief, in dem du erklärst, warum die Trennung nicht deine Schuld ist.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Verantwortung abgeben',
          beschreibung: 'Schreibe auf: Was ist NICHT meine Aufgabe in dieser Situation? Was können nur die Erwachsenen lösen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wofür fühlst du dich verantwortlich, obwohl du es nicht bist?',
          'Was wäre, wenn du diese Last abgeben könntest?'
        ]
      },
      {
        nr: 3,
        titel: 'Mit zwei Zuhausen umgehen',
        dauer: '60 Min',
        ziel: 'Praktische Strategien für das Leben zwischen zwei Haushalten',
        psychoedukation: {
          titel: 'Pendelkind – zwischen zwei Welten',
          inhalt: 'Viele Kinder nach Trennungen pendeln zwischen zwei Wohnorten. Das bedeutet: zwei Zimmer, zwei Regelsysteme, zwei Alltage. Das kann erschöpfend sein, bietet aber auch die Chance, flexible Fähigkeiten zu entwickeln. Wichtig ist: Beide Eltern können gute Eltern sein – auch getrennt.'
        },
        interventionen: [
          {
            titel: 'Zwei-Häuser-Plan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was läuft gut beim Wechsel? Was ist schwierig? Gemeinsam konkrete Strategien entwickeln: Was kannst du tun, damit sich das Pendeln leichter anfühlt? (z.B. feste Rituale bei Ankunft, Packliste, eigene Gegenstände an beiden Orten)',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meine Regeln für beide Haushalte',
            beschreibung: 'Was sind die wichtigsten Dinge, die du brauchst, damit es dir in beiden Häusern gut geht?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ankommens-Ritual entwickeln',
          beschreibung: 'Entwickle ein kleines Ritual für das Ankommen am jeweils anderen Elternteil – etwas, das dir hilft, „anzukommen".',
          dauer: '15 Min'
        },
        reflexion: [
          'Was ist das Schwierigste am Leben in zwei Haushalten?',
          'Was könnte dir das Pendeln erleichtern?'
        ]
      },
      {
        nr: 4,
        titel: 'Meine eigene Stärke entdecken',
        dauer: '60 Min',
        ziel: 'Resilienz und persönliche Ressourcen nach der Trennung stärken',
        psychoedukation: {
          titel: 'Resilienz – was Kinder stark macht',
          inhalt: 'Kinder, die schwierige Familiensituationen durchlebt haben, entwickeln oft besondere Stärken: Empathie, Flexibilität, Problemlösung, Selbstständigkeit. Diese Stärken sind real – auch wenn sie sich gerade nicht so anfühlen. Resilienz wächst durch Herausforderungen und durch unterstützende Beziehungen.'
        },
        interventionen: [
          {
            titel: 'Stärken aus der Krise',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Gemeinsam erarbeiten: Was hast du durch die Trennungssituation gelernt? Welche Stärken hast du entwickelt? Wie kannst du diese Ressourcen in anderen Lebensbereichen nutzen?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief aus der Zukunft',
            beschreibung: 'Stell dir vor, du bist 25 Jahre alt und schaust zurück. Was schreibst du dem jetzigen dir über diese Zeit?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Unterstützungsnetz aktivieren',
          beschreibung: 'Schreibe auf, wer dir in dieser Zeit hilft oder helfen könnte. Wende dich diese Woche bewusst an eine dieser Personen.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche eine Stärke möchtest du weiter ausbauen?'
        ]
      }
    ]
  },

  'soziales-netzwerk': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit sozialer Isolation, dünnen Netzwerken oder mangelnder Unterstützung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wer ist für mich da?',
        dauer: '60 Min',
        ziel: 'Eigenes soziales Netzwerk sichtbar machen und einschätzen',
        psychoedukation: {
          titel: 'Soziale Unterstützung als Schutzfaktor',
          inhalt: 'Menschen, die auf verlässliche Beziehungen zurückgreifen können, sind widerstandsfähiger gegen Stress, Krisen und psychische Belastungen. Soziale Unterstützung ist einer der stärksten Schutzfaktoren überhaupt. Dabei geht es nicht um die Anzahl der Kontakte, sondern um deren Qualität.'
        },
        interventionen: [
          {
            titel: 'Netzwerkkarte zeichnen',
            ansatz: 'Systemisch / Ressourcenorientiert',
            beschreibung: 'Der Schüler zeichnet sich selbst in der Mitte und ordnet Personen in konzentrischen Kreisen an: sehr nah, mittel, am Rand. Für jeden Kreis besprechen: Wer ist dort? Auf wen kannst du zählen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Unterstützungsarten erkennen',
            beschreibung: 'Unterscheide: Wer gibt dir emotionale Unterstützung (zuhören)? Praktische Hilfe? Rat? Spaß und Ablenkung? Kann eine Person alles – oder braucht es mehrere?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Netzwerk-Check',
          beschreibung: 'Schreibe auf: An wen würdest du dich wenden, wenn… (a) du traurig bist, (b) du Hilfe brauchst, (c) du feiern möchtest?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie zufrieden bist du mit deinem sozialen Netzwerk?',
          'Gibt es Lücken – jemanden, den du vermisst oder gerne hättest?'
        ]
      },
      {
        nr: 2,
        titel: 'Verbindungen stärken und neue knüpfen',
        dauer: '60 Min',
        ziel: 'Bestehende Beziehungen vertiefen und neue aufbauen',
        psychoedukation: {
          titel: 'Wie Freundschaften entstehen und wachsen',
          inhalt: 'Freundschaften brauchen drei Dinge: Nähe (regelmäßigen Kontakt), Offenheit (sich zeigen wie man ist) und gegenseitiges Vertrauen. Neue Verbindungen entstehen nicht über Nacht – aber regelmäßige kleine Schritte haben großen Effekt.'
        },
        interventionen: [
          {
            titel: 'Beziehungsbarrieren analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Was hindert dich, engere Verbindungen zu anderen aufzubauen? (z.B. Angst, abgelehnt zu werden; schlechte Erfahrungen; Misstrauen). Gemeinsam überlegen: Wie realistisch sind diese Befürchtungen? Was wäre ein kleiner sicherer Schritt?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Netzwerk erweitern – Ideen sammeln',
            beschreibung: 'Wo könnte ich neue Menschen kennenlernen? (Verein, AG, Nachbarschaft, Online-Community, Jugendgruppe…) Notiere 3 konkrete Möglichkeiten.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kleiner Kontakt',
          beschreibung: 'Diese Woche: eine Person ansprechen, der du bisher kaum begegnet bist – im Schulbus, im Verein, in der Klasse.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hält dich davon ab, auf andere zuzugehen?',
          'Was wäre der kleinste mögliche erste Schritt?'
        ]
      },
      {
        nr: 3,
        titel: 'Umgang mit Einsamkeit',
        dauer: '60 Min',
        ziel: 'Einsamkeit aushalten und aktiv gegen Isolation vorgehen',
        psychoedukation: {
          titel: 'Einsamkeit verstehen',
          inhalt: 'Einsamkeit ist nicht dasselbe wie allein sein. Man kann in einer Gruppe sein und sich einsam fühlen – oder allein sein und sich vollständig fühlen. Chronische Einsamkeit ist ein ernstes Signal, das Handeln erfordert. Sie entsteht oft durch eine Lücke zwischen gewünschten und tatsächlichen sozialen Kontakten.'
        },
        interventionen: [
          {
            titel: 'Einsamkeits-Gedanken hinterfragen',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Typische Gedanken bei Einsamkeit: „Niemand mag mich." „Ich bin anders." „Es hat keinen Sinn, es zu versuchen." Gemeinsam diese Gedanken untersuchen: Sind sie wahr? Was spricht dagegen? Was würde ein Freund dir sagen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Aktivitäten, die gut tun',
            beschreibung: 'Was kannst du tun, wenn du dich einsam fühlst und niemanden erreichst? Liste 5 Aktivitäten auf, die dir Kraft geben.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Aktiver Schritt',
          beschreibung: 'Unternimm diese Woche einen aktiven Schritt gegen Isolation: ein Gespräch führen, einer Gruppe beitreten oder jemandem schreiben.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen Schritt möchtest du in den nächsten Wochen gehen?'
        ]
      }
    ]
  },

  'genogramm': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler, die ihre Familiengeschichte verstehen und Muster erkennen wollen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Familiengeschichte kartieren',
        dauer: '60 Min',
        ziel: 'Ein Genogramm über drei Generationen erstellen',
        psychoedukation: {
          titel: 'Was ist ein Genogramm?',
          inhalt: 'Ein Genogramm ist ein erweiterter Familienstammbaum. Es zeigt nicht nur, wer zu wem gehört, sondern auch Beziehungsqualitäten, Trennungen, Verluste und Wiederholungsmuster. Indem wir die Familiengeschichte über mehrere Generationen betrachten, können wir verstehen, warum bestimmte Themen in unserer Familie immer wieder auftauchen.'
        },
        interventionen: [
          {
            titel: 'Genogramm zeichnen',
            ansatz: 'Systemisch',
            beschreibung: 'Gemeinsam das Genogramm über drei Generationen erstellen: Großeltern, Eltern, Geschwister, eigene Person. Symbole für Ehen, Trennungen, Todesfälle einzeichnen. Beziehungslinien (eng, konfliktreich, abgebrochen) ergänzen.',
            dauer: '35 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Erstes Staunen',
            beschreibung: 'Was fällt dir beim Betrachten deines Genogramms auf? Was überrascht dich? Was war dir vorher nicht bewusst?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Familiengeschichte erkunden',
          beschreibung: 'Frage ein Familienmitglied nach einer Geschichte oder Person aus der Familiengeschichte, die du noch nicht kennst.',
          dauer: '20 Min'
        },
        reflexion: [
          'Was hast du beim Zeichnen gefühlt?',
          'Gibt es jemanden in deiner Familiengeschichte, den du gerne besser kennen würdest?'
        ]
      },
      {
        nr: 2,
        titel: 'Muster und Wiederholungen entdecken',
        dauer: '60 Min',
        ziel: 'Transgenerationale Muster erkennen und verstehen',
        psychoedukation: {
          titel: 'Transgenerationale Weitergabe',
          inhalt: 'Manche Themen wiederholen sich in Familien über Generationen: frühe Trennungen, bestimmte Berufe, Suchtmuster, psychische Erkrankungen oder besondere Stärken. Diese Muster werden oft unbewusst weitergegeben – durch Erziehung, Vorbilder oder ungelöste Trauer. Sie zu kennen, ist der erste Schritt, um selbst zu entscheiden, welche Muster man fortführen und welche man verändern möchte.'
        },
        interventionen: [
          {
            titel: 'Muster-Analyse',
            ansatz: 'Systemisch / Narrativ',
            beschreibung: 'Gemeinsam das Genogramm auf Muster untersuchen: Gibt es Themen, die sich wiederholen? (z.B. frühe Todesfälle, Trennungen, Berufe, Erkrankungen). Was wird in deiner Familie oft erzählt? Was wird verschwiegen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Familiengeschichten sammeln',
            beschreibung: 'Schreibe zwei Familiengeschichten auf, die immer wieder erzählt werden. Was sagen sie über Werte und Prioritäten in deiner Familie aus?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Muster reflektieren',
          beschreibung: 'Welches Muster aus deiner Familie erkennst du in dir selbst wieder? Schreibe einen kurzen Gedanken dazu.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welches Muster aus deiner Familie möchtest du weiterführen?',
          'Welches möchtest du verändern?'
        ]
      },
      {
        nr: 3,
        titel: 'Mein eigener Weg',
        dauer: '60 Min',
        ziel: 'Eigenverantwortliche Entscheidungen für die eigene Zukunft treffen',
        psychoedukation: {
          titel: 'Familiengeschichte ≠ eigene Geschichte',
          inhalt: 'Die Familiengeschichte erklärt vieles – aber sie bestimmt nicht, was aus dir wird. Du hast die Möglichkeit, bewusst zu wählen, welche Werte und Muster du übernehmen und welche du hinter dir lassen möchtest. Diese Entscheidung ist ein Akt der Eigenverantwortung.'
        },
        interventionen: [
          {
            titel: 'Eigene Geschichte schreiben',
            ansatz: 'Narrativ / Ressourcenorientiert',
            beschreibung: 'Der Schüler formuliert: „Ich komme aus einer Familie, die… Ich habe dabei gelernt… Für mein eigenes Leben möchte ich…" Das ist kein Abschied von der Familie, sondern die bewusste Entscheidung für den eigenen Weg.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ressourcen aus der Familiengeschichte',
            beschreibung: 'Welche Stärken, Talente oder Werte hat dir deine Familie mitgegeben? Liste drei davon auf und beschreibe, wie du sie nutzen kannst.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Brief an die nächste Generation',
          beschreibung: 'Schreibe einen kurzen Brief an deine künftigen Kinder: Was möchtest du ihnen mitgeben? Was soll bei dir enden?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du deine eigene Geschichte gestalten?'
        ]
      }
    ]
  },

  'pflegefamilie': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler in Pflege- oder Heimunterbringung; Verarbeitung von Übergängen und Bindungsbrüchen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Geschichte – wo komme ich her?',
        dauer: '60 Min',
        ziel: 'Eigene Biografie in die Hand nehmen und kohärent erzählen können',
        psychoedukation: {
          titel: 'Was Fremdunterbringung bedeutet',
          inhalt: 'In einer Pflege- oder Heimfamilie zu leben bedeutet, dass die eigene Herkunftsfamilie nicht in der Lage war, für dich zu sorgen – nicht weil du etwas falsch gemacht hast, sondern weil Erwachsene Verantwortung für dich übernommen haben. Es ist normal, dabei gemischte Gefühle zu haben: Dankbarkeit, Trauer, Wut, Verwirrung – oft gleichzeitig.'
        },
        interventionen: [
          {
            titel: 'Lebenszeitleiste',
            ansatz: 'Narrativ / Biographisch',
            beschreibung: 'Der Schüler zeichnet eine Zeitlinie seines Lebens mit wichtigen Stationen: Geburt, Umzüge, Unterbringungen, Wechsel. Zu jedem Punkt: Was war das? Wie alt warst du? Was hast du damals gefühlt?',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meine Geschichte in drei Sätzen',
            beschreibung: 'Formuliere drei Sätze, die deine Geschichte auf den Punkt bringen – nicht für andere, sondern für dich selbst.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Wichtige Gegenstände',
          beschreibung: 'Bring nächste Woche einen Gegenstand mit (oder ein Foto davon), der für deine Geschichte wichtig ist.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie fühlt es sich an, über deine Geschichte zu sprechen?',
          'Gibt es Teile davon, über die du noch nie gesprochen hast?'
        ]
      },
      {
        nr: 2,
        titel: 'Zwischen zwei Familien',
        dauer: '60 Min',
        ziel: 'Loyalitätskonflikte und gemischte Gefühle zu Herkunfts- und Pflegefamilie bearbeiten',
        psychoedukation: {
          titel: 'Zwei Familien, ein Kind',
          inhalt: 'In einer Pflegefamilie zu leben, bedeutet nicht, die Herkunftsfamilie zu vergessen oder zu verleugnen. Beides kann gleichzeitig wahr sein: dass du deine Herkunftsfamilie liebst und vermisst – und dass du auch deine Pflegefamilie liebst. Das ist kein Verrat. Loyalitätskonflikte sind normal und zeigen, wie viel dir an Menschen liegt.'
        },
        interventionen: [
          {
            titel: 'Zwei-Familien-Karte',
            ansatz: 'Systemisch',
            beschreibung: 'Zwei Kreise: Herkunftsfamilie und Pflegefamilie. Was verbindet dich mit jeder? Was ist schwierig? Was vermisst du? Was schätzt du? Gemeinsam besprechen: Wie kannst du zu beiden einen guten Umgang finden?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühle sortieren',
            beschreibung: 'Schreibe für jede Familie 3 Gefühle auf, die du hast, wenn du an sie denkst. Was fällt auf?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Brief (nicht abschicken)',
          beschreibung: 'Schreibe einen Brief an jemanden aus deiner Herkunftsfamilie – was du sagen würdest, wenn du könntest.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was vermisst du an deiner Herkunftsfamilie am meisten?',
          'Was gibt dir deine Pflegefamilie, das du vorher nicht hattest?'
        ]
      },
      {
        nr: 3,
        titel: 'Sicherheit und Vertrauen aufbauen',
        dauer: '60 Min',
        ziel: 'Bindungsfähigkeit und Vertrauen in die Pflegebeziehung stärken',
        psychoedukation: {
          titel: 'Bindung nach Brüchen',
          inhalt: 'Wer früh erfahren hat, dass Erwachsene nicht verlässlich sind, lernt, sich zu schützen – durch Distanz, Kontrolle oder Anpassung. Das war einmal sinnvoll. In einer sicheren Umgebung kann Vertrauen aber neu gelernt werden. Es braucht Zeit und es ist okay, wenn es langsam geht.'
        },
        interventionen: [
          {
            titel: 'Vertrauens-Skala',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Wie viel Vertrauen hast du zu deiner Pflegefamilie (1–10)? Was würde es brauchen, damit die Zahl höher wird? Was tust du bereits, um Vertrauen aufzubauen? Was kannst du tun?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sicherheitssignale',
            beschreibung: 'Woran merkst du, dass jemand wirklich für dich da ist? Liste 5 konkrete Zeichen auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kleiner Vertrauensschritt',
          beschreibung: 'Tue diese Woche etwas, das Vertrauen zeigt oder aufbaut – mit jemandem aus deiner Pflegefamilie.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was macht es schwer, Vertrauen aufzubauen?',
          'Was passiert, wenn du es trotzdem versuchst?'
        ]
      },
      {
        nr: 4,
        titel: 'Zukunft gestalten – trotz allem',
        dauer: '60 Min',
        ziel: 'Eigene Zukunftsperspektive entwickeln und Ressourcen aktivieren',
        psychoedukation: {
          titel: 'Resilienz trotz schwieriger Geschichte',
          inhalt: 'Viele Menschen, die schwierige Kindheiten in Pflege oder Heim verbracht haben, führen als Erwachsene erfüllte Leben. Was ihnen hilft: mindestens eine verlässliche Bezugsperson, das Gefühl, das eigene Leben gestalten zu können, und die Fähigkeit, Sinn in der eigenen Geschichte zu finden. Alle diese Dinge lassen sich stärken.'
        },
        interventionen: [
          {
            titel: 'Zukunftsbild entwickeln',
            ansatz: 'Ressourcenorientiert / Lösungsfokussiert',
            beschreibung: 'Wie stellst du dir dein Leben mit 25 vor? Wo lebst du? Was machst du? Mit wem bist du zusammen? Was ist dir wichtig? Dieses Bild als Ziel formulieren und fragen: Was brauchst du dafür? Was hast du bereits?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meine Stärken aus der Geschichte',
            beschreibung: 'Was hast du durch deine schwierige Geschichte gelernt? Welche Fähigkeiten hast du entwickelt, die andere nicht haben?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Einen Schritt planen',
          beschreibung: 'Was ist ein konkreter Schritt, den du in den nächsten zwei Wochen tun kannst, um deiner Zukunftsvision näherzukommen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du nie vergessen?'
        ]
      }
    ]
  },

  'emotionserkennung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Schwierigkeiten beim Benennen, Erkennen oder Differenzieren von Gefühlen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Gefühle – was sind das überhaupt?',
        dauer: '60 Min',
        ziel: 'Grundverständnis von Emotionen aufbauen; Körpersignale kennenlernen',
        psychoedukation: {
          titel: 'Wozu sind Gefühle da?',
          inhalt: 'Gefühle sind keine Schwäche – sie sind Informationen. Angst warnt vor Gefahr, Wut zeigt, dass eine Grenze überschritten wurde, Trauer hilft beim Verarbeiten von Verlusten, Freude zeigt, was uns gut tut. Jedes Gefühl hat eine Funktion. Probleme entstehen nicht durch das Fühlen, sondern dadurch, Gefühle nicht zu erkennen oder nicht ausdrücken zu können.'
        },
        interventionen: [
          {
            titel: 'Körperkarte der Gefühle',
            ansatz: 'Körperorientiert / Psychoedukativ',
            beschreibung: 'Auf einer Körperumriss-Zeichnung: Wo spürst du Wut, Angst, Freude, Trauer im Körper? Einzeichnen und besprechen. Viele Schüler sind überrascht, wie präzise der Körper Gefühle zeigt.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühlswörterbuch',
            beschreibung: 'Sammle gemeinsam so viele Gefühlswörter wie möglich (Ziel: 20+). Ordne sie in Gruppen: zur Freude, Trauer, Wut, Angst, Scham, Überraschung.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gefühls-Check-in',
          beschreibung: 'Jeden Abend kurz innehalten: Welche Gefühle hatte ich heute? Kannst du sie benennen? Notiere sie kurz.',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Welche Gefühle fällt dir leicht zu benennen – und welche schwer?',
          'Gibt es Gefühle, die du lieber nicht haben möchtest? Warum?'
        ]
      },
      {
        nr: 2,
        titel: 'Gefühle lesen – bei mir und anderen',
        dauer: '60 Min',
        ziel: 'Mimik, Gestik und Körpersprache als Gefühlssignale lesen lernen',
        psychoedukation: {
          titel: 'Emotionale Intelligenz',
          inhalt: 'Emotionen zeigen sich nicht nur innen, sondern auch außen: in der Mimik, Körperhaltung, Stimme und im Verhalten. Wer diese Signale lesen kann – bei sich selbst und bei anderen – kommuniziert klarer, versteht Konflikte besser und kann gezielter helfen oder Grenzen setzen.'
        },
        interventionen: [
          {
            titel: 'Mimik-Detektiv',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Bilder oder kurze Filmclips mit Personen zeigen. Der Schüler erkennt und benennt Gefühle anhand von Mimik und Körpersprache. Was signalisiert dieser Ausdruck? Was könnte die Person gerade brauchen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Eigene Mimik spüren',
            beschreibung: 'Stell Gefühle mimisch dar und schau in den Spiegel: Wie sieht Wut aus? Freude? Traurigkeit? Was verrät dein Gesicht, das du vielleicht nicht zeigen wolltest?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtungsauftrag',
          beschreibung: 'Beobachte diese Woche eine Person in deinem Umfeld: Was erkennst du an ihrer Körpersprache? Was fühlt sie gerade – ohne Worte?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hast du diese Woche bei anderen an Gefühlen wahrgenommen?',
          'Wann hast du selbst Gefühle „versteckt"?'
        ]
      },
      {
        nr: 3,
        titel: 'Gefühle differenzieren und ausdrücken',
        dauer: '60 Min',
        ziel: 'Gefühlstiefe und -nuancen kennenlernen; angemessenen Ausdruck üben',
        psychoedukation: {
          titel: 'Das Rad der Emotionen',
          inhalt: 'Gefühle sind nicht schwarz-weiß. Zwischen „gut" und „schlecht" liegen Hunderte von Nuancen. Wut kann Ärger, Frustration, Empörung oder Enttäuschung sein – je nach Intensität und Ursache. Je mehr Worte wir für unsere Gefühle haben, desto besser können wir kommunizieren, was wir brauchen.'
        },
        interventionen: [
          {
            titel: 'Gefühlsintensitäts-Skala',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Eine Emotion auswählen (z.B. Wut). Auf einer Skala 1–10: Was ist „leichte Verstimmung" vs. „Raserei"? Welche körperlichen, gedanklichen und Verhaltensänderungen gibt es bei unterschiedlichen Intensitäten?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühle in Worte fassen',
            beschreibung: 'Übe, ein Gefühl in einem Satz zu beschreiben: „Ich fühle mich _____, weil _____, und ich brauche _____."',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gefühls-Tagebuch',
          beschreibung: 'Führe drei Tage lang ein Gefühls-Tagebuch: Situation → Gefühl (mit Intensität 1–10) → Körpersignal → Reaktion.',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Welche Emotion ist für dich am schwersten auszudrücken?',
          'Was nimmst du aus diesem Modul für deinen Alltag mit?'
        ]
      }
    ]
  },

  'emotionsregulation': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit impulsivem Verhalten, emotionaler Überflutung oder Schwierigkeiten im Umgang mit starken Gefühlen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Mein Gefühlssystem verstehen',
        dauer: '60 Min',
        ziel: 'Eigene Regulationsstrategien und -muster kennenlernen',
        psychoedukation: {
          titel: 'Das Gehirn und Emotionen',
          inhalt: 'Starke Gefühle entstehen im emotionalen Teil des Gehirns (Amygdala) – schnell, automatisch, ohne Kontrolle. Der denkende Teil (Präfrontaler Kortex) kann bremsen und lenken – aber erst wenn die Emotion etwas abgeklungen ist. Deshalb hilft es, zuerst zu beruhigen und dann zu denken.'
        },
        interventionen: [
          {
            titel: 'Trigger-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Was bringt dich aus dem Gleichgewicht? Gemeinsam die typischen Auslöser für starke Emotionen identifizieren: Situationen, Personen, Gedanken, Tageszeiten. Muster erkennen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Bisherige Strategien inventarisieren',
            beschreibung: 'Was tust du bisher, wenn du wütend/ängstlich/überwältigt bist? Sortiere: Was hilft kurzfristig, aber schadet langfristig? Was hilft wirklich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Trigger-Tagebuch',
          beschreibung: 'Diese Woche: Wann fühlst du dich emotional überwältigt? Situation, Gefühl, Intensität (1–10) notieren.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Welche Situation bringt dich am häufigsten aus der Ruhe?',
          'Was hast du bisher getan – und hat es geholfen?'
        ]
      },
      {
        nr: 2,
        titel: 'Beruhigungsstrategien – akut',
        dauer: '60 Min',
        ziel: 'Konkrete Techniken zur akuten Emotionsregulation erlernen und üben',
        psychoedukation: {
          titel: 'Erste Hilfe für starke Gefühle',
          inhalt: 'Wenn Gefühle überfluten, hilft nichts Rationales. Zuerst braucht der Körper Beruhigung. Bewährte Methoden: tiefes Atmen aktiviert den Parasympathikus; körperliche Bewegung baut Stresshormone ab; Grounding (5-4-3-2-1) unterbricht den Gedankenstrudel.'
        },
        interventionen: [
          {
            titel: 'Atemübung Box-Breathing',
            ansatz: 'Körperorientiert',
            beschreibung: '4 Sekunden einatmen, 4 halten, 4 ausatmen, 4 halten. Dreimal wiederholen. Gemeinsam üben, Wirkung besprechen. Diese Technik ist überall und jederzeit anwendbar.',
            dauer: '15 Min'
          },
          {
            titel: '5-4-3-2-1 Grounding',
            ansatz: 'Achtsamkeitsbasiert',
            beschreibung: '5 Dinge sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken. Gemeinsam durchführen und danach besprechen: Was hat diese Übung ausgelöst? Wann könnte sie helfen?',
            dauer: '15 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Persönlichen Notfallplan erstellen',
            beschreibung: 'Eine Karte mit 3 Strategien, die ich sofort einsetzen kann, wenn ich überflute: Atemübung, Grounding, eine Vertrauensperson anrufen.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Strategie ausprobieren',
          beschreibung: 'Wende diese Woche mindestens einmal eine der Techniken an – auch wenn die Emotion nicht stark ist. Üben, solange es ruhig ist.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Technik hat sich am besten angefühlt?',
          'Wann wäre sie im Alltag besonders nützlich?'
        ]
      },
      {
        nr: 3,
        titel: 'Gedanken und Gefühle auseinanderhalten',
        dauer: '60 Min',
        ziel: 'Kognitive Umstrukturierung als mittelfristige Regulationsstrategie',
        psychoedukation: {
          titel: 'Gedanken sind keine Fakten',
          inhalt: 'Was wir denken, beeinflusst stark, was wir fühlen. „Niemand mag mich" erzeugt andere Gefühle als „Die anderen sind gerade beschäftigt". Gedanken können automatisch und verzerrend sein – sie zu erkennen und zu hinterfragen ist eine erlernbare Fähigkeit.'
        },
        interventionen: [
          {
            titel: 'ABC-Schema',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'A = Auslöser (Situation), B = Bewertung (Gedanke), C = Consequence (Gefühl). Anhand eines konkreten Beispiels durcharbeiten. Zeigen: Wenn B sich ändert, ändert sich auch C.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gedanken-Gegenbeweis',
            beschreibung: 'Nimm einen negativen automatischen Gedanken. Sammle 3 Gegenbeweise. Formuliere eine ausgewogene Alternative.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gedanken beobachten',
          beschreibung: 'Notiere diese Woche zweimal: Situation → automatischer Gedanke → Gefühl. Welches Muster erkennst du?',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher automatische Gedanke taucht bei dir besonders häufig auf?',
          'Was wäre ein realistischerer Gedanke?'
        ]
      },
      {
        nr: 4,
        titel: 'Langfristige Stabilität aufbauen',
        dauer: '60 Min',
        ziel: 'Regulationskompetenz in den Alltag integrieren',
        psychoedukation: {
          titel: 'Emotionale Fitness',
          inhalt: 'Emotionsregulation ist wie ein Muskel – er wächst durch regelmäßiges Training. Schlaf, Bewegung, soziale Kontakte und Selbstfürsorge sind die Grundlage. Darauf aufbauend helfen Achtsamkeit, kognitive Strategien und verlässliche Routinen.'
        },
        interventionen: [
          {
            titel: 'Persönlicher Regulationsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen individuellen Plan erstellen: Was sind meine Frühwarnzeichen? Was tue ich bei Intensität 3, 6, 9 (von 10)? Welche Person kann ich einbeziehen? Dieser Plan wird schriftlich festgehalten.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wohlgefühl-Routine',
            beschreibung: 'Entwirf eine tägliche 10-Minuten-Routine, die deine emotionale Stabilität stärkt: Bewegung, Atemübung, Dankbarkeits-Notiz o.ä.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Regulationsplan testen',
          beschreibung: 'Wende den Plan in der nächsten Woche aktiv an. Notiere: Was hat geholfen? Was muss angepasst werden?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat sich in diesem Modul für dich verändert?',
          'Was nimmst du als wichtigste Strategie mit?'
        ]
      }
    ]
  },

  'stress-angst': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit Stresssymptomen, Prüfungsangst, sozialer Angst oder allgemeiner Anspannung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Stress und Angst verstehen',
        dauer: '60 Min',
        ziel: 'Physiologie von Stress und Angst verstehen; eigene Stressoren identifizieren',
        psychoedukation: {
          titel: 'Kampf, Flucht, Erstarren – das Stresssystem',
          inhalt: 'Stress und Angst sind biologische Alarmsignale: Herzrasen, Schwitzen, Muskelanspannung – der Körper bereitet sich auf Gefahr vor. Das war in der Steinzeit sinnvoll. Heute lösen soziale Situationen, Prüfungen oder Konflikte dieselbe Reaktion aus. Das Gehirn unterscheidet nicht zwischen echtem Tiger und sozialem Druck.'
        },
        interventionen: [
          {
            titel: 'Stress-Thermometer',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Auf einer Skala 1–10: Wie gestresst bist du gerade? Was sind deine typischen Stressoren? Welche körperlichen Signale hast du bei Stress? Gemeinsam eine persönliche Stresskarte erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Körperscan',
            beschreibung: 'Schließe die Augen, gehe durch deinen Körper von Kopf bis Fuß: Wo spürst du Anspannung? Enge? Unruhe?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stress-Tagebuch',
          beschreibung: 'Notiere diese Woche täglich: Was hat Stress ausgelöst? Wie stark (1–10)? Was habe ich gemacht?',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was sind deine stärksten Stressoren im Moment?',
          'Wie reagiert dein Körper typischerweise auf Stress?'
        ]
      },
      {
        nr: 2,
        titel: 'Angst analysieren',
        dauer: '60 Min',
        ziel: 'Angstmuster verstehen; zwischen hilfreicher und hinderlicher Angst unterscheiden',
        psychoedukation: {
          titel: 'Angst als Signal – nicht als Feind',
          inhalt: 'Nicht alle Angst ist schlecht. Leichte Angst vor einer Prüfung schärft die Aufmerksamkeit. Problematisch wird Angst, wenn sie vermieden wird – denn Vermeidung verstärkt die Angst langfristig. Der Ausweg führt durch die Angst hindurch, nicht um sie herum.'
        },
        interventionen: [
          {
            titel: 'Angst-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Eine konkrete Angstsituation durchgehen: Was genau passiert? Was befürchtest du? Wie wahrscheinlich ist das wirklich? Was wäre das Schlimmste – und könntest du damit umgehen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Angst-Skala erstellen',
            beschreibung: 'Liste Situationen auf, die Angst auslösen, von leicht (1) bis sehr stark (10). Das ist die Basis für eine spätere schrittweise Konfrontation.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vermeidungscheck',
          beschreibung: 'Was vermeidest du wegen Angst? Notiere 3 Situationen, die du seit Kurzem meidest.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Situation löst bei dir die stärkste Angst aus?',
          'Was verlierst du, weil du diese Situation vermeidest?'
        ]
      },
      {
        nr: 3,
        titel: 'Strategien gegen Stress und Angst',
        dauer: '60 Min',
        ziel: 'Konkrete Techniken erlernen: Entspannung, Atemübungen, kognitive Umstrukturierung',
        psychoedukation: {
          titel: 'Der Parasympathikus als Gegenspieler',
          inhalt: 'Das Gegenteil von Stress ist nicht Nichts-Tun, sondern aktive Entspannung. Der Parasympathikus – unser Ruhesystem – lässt sich gezielt aktivieren: durch langsames Ausatmen, progressive Muskelentspannung oder Achtsamkeit.'
        },
        interventionen: [
          {
            titel: 'Progressive Muskelentspannung (Kurzform)',
            ansatz: 'Körperorientiert',
            beschreibung: 'Wichtige Muskelgruppen anspannen (5 Sek.) und loslassen (10 Sek.): Hände, Arme, Schultern, Gesicht, Bauch, Beine. Danach besprechen: Was hat sich verändert?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sorgen-Stopp-Technik',
            beschreibung: '1. Sorge aufschreiben. 2. Fragen: Kann ich etwas daran ändern? 3a. Ja → konkreten Schritt planen. 3b. Nein → bewusst loslassen und ablenken.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Entspannungsroutine',
          beschreibung: 'Führe diese Woche täglich 5 Minuten Entspannung durch (Atemübung oder Muskelentspannung).',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Welche Technik hat am besten gewirkt?',
          'Wann im Alltag könntest du sie einsetzen?'
        ]
      },
      {
        nr: 4,
        titel: 'Schrittweise Angstbewältigung',
        dauer: '60 Min',
        ziel: 'Angstvermeidung reduzieren; Schritt-für-Schritt-Konfrontation planen',
        psychoedukation: {
          titel: 'Exposition – durch die Angst hindurch',
          inhalt: 'Angst nimmt ab, wenn man in der Situation bleibt, ohne zu flüchten. Der Körper gewöhnt sich. Das nennt sich Habituation. Es muss nicht sofort mit der größten Angst beginnen – man startet mit einer kleinen Stufe und arbeitet sich langsam hoch.'
        },
        interventionen: [
          {
            titel: 'Angstleiter erstellen',
            ansatz: 'Verhaltenstherapeutisch',
            beschreibung: 'Die Angst-Skala aus Sitzung 2 nutzen und eine konkrete Stufenleiter entwickeln: Schritt 1 (leichteste Situation) bis Schritt 5 (herausfordernde Situation). Den ersten Schritt konkret planen: Wann? Wo? Mit wem?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Erster Schritt der Angstleiter',
            beschreibung: 'Den ersten geplanten Schritt in der Sitzung imaginär durchgehen: Wie geht es dir dabei? Was passiert? Was kannst du tun?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt gehen',
          beschreibung: 'Führe diese Woche den ersten Schritt der Angstleiter durch. Danach aufschreiben: Was war vorher, während und danach?',
          dauer: '20 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen nächsten Schritt auf der Angstleiter möchtest du gehen?'
        ]
      }
    ]
  },

  'wut-aggression': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit Impulskontrollproblemen, aggressivem Verhalten oder Wutausbrüchen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wut verstehen – nicht bekämpfen',
        dauer: '60 Min',
        ziel: 'Wut als legitimes Gefühl anerkennen; Ursachen und Körpersignale kennen',
        psychoedukation: {
          titel: 'Was Wut uns sagen will',
          inhalt: 'Wut entsteht, wenn eine Grenze überschritten oder ein Bedürfnis verletzt wird. Sie ist ein natürliches, wichtiges Gefühl. Das Problem ist nicht die Wut selbst – sondern wie sie ausgedrückt wird. Wut wegzudrücken ist genauso schädlich wie unkontrolliert explodieren.'
        },
        interventionen: [
          {
            titel: 'Wut-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Einen konkreten Wutausbruch der letzten Zeit analysieren: Was war der Auslöser? Welche Gedanken kamen? Körpersignale? Reaktion? Konsequenzen? Gemeinsam die Kette verstehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wut-Frühwarnsystem',
            beschreibung: 'Welche körperlichen Zeichen signalisieren dir, dass Wut aufsteigt? (z.B. heiße Ohren, Anspannung, Herzrasen). Liste deine persönlichen Frühwarnsignale auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Wut-Tagebuch',
          beschreibung: 'Diese Woche: Wenn Wut auftaucht, kurz notieren: Auslöser → Intensität (1–10) → was ich getan habe.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Welche Situation löst bei dir am häufigsten Wut aus?',
          'Was steckt hinter dieser Wut – welches Bedürfnis oder welche Grenze?'
        ]
      },
      {
        nr: 2,
        titel: 'Im heißen Moment – Impulse bremsen',
        dauer: '60 Min',
        ziel: 'Konkrete Techniken zur Impulskontrolle in Echtzeit',
        psychoedukation: {
          titel: 'Die 6-Sekunden-Regel',
          inhalt: 'Ein Impuls dauert ca. 6 Sekunden. Wenn du in dieser Zeit nichts tust, beginnt der rationale Teil des Gehirns wieder zu arbeiten. Diese 6 Sekunden Pause zu schaffen – z.B. durch Atmen, rausgehen, Hände unter kaltes Wasser – ist das Ziel der Impulskontrolle.'
        },
        interventionen: [
          {
            titel: 'Pausen-Signalwort',
            ansatz: 'Verhaltenstherapeutisch',
            beschreibung: 'Der Schüler wählt ein persönliches Stopp-Signal (Wort, Geste, mentales Bild), das er im Moment der aufsteigenden Wut einsetzt. Üben: zuerst im ruhigen Zustand, dann in leicht aufgewühlten Situationen.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Abtank-Strategien',
            beschreibung: 'Sammle 5 Dinge, die du tun kannst, wenn Wut aufsteigt (vor dem Ausbruch): Sport, rausgehen, tiefatmen, Kissen, kalt Wasser. Schreibe sie auf eine Karte.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Pausen-Technik einsetzen',
          beschreibung: 'Setze diese Woche das Stopp-Signal mindestens einmal bewusst ein – und halte danach inne.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann fällt es dir besonders schwer, innezuhalten?',
          'Was hilft dir, in einem heißen Moment die Kontrolle zu behalten?'
        ]
      },
      {
        nr: 3,
        titel: 'Wut konstruktiv ausdrücken',
        dauer: '60 Min',
        ziel: 'Assertive Kommunikation von Ärger und Grenzen üben',
        psychoedukation: {
          titel: 'Ärger ausdrücken – ohne zu verletzen',
          inhalt: 'Es ist möglich, Wut und Ärger klar auszudrücken, ohne anzugreifen. Der Unterschied liegt in der Sprache: „Du bist immer so gemein" vs. „Ich werde wütend, wenn du meine Sachen nimmst ohne zu fragen." Ersteres greift an – letzteres kommuniziert ein Bedürfnis.'
        },
        interventionen: [
          {
            titel: 'Ich-Botschaften bei Wut',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Üben, Ärger in Ich-Botschaften auszudrücken: „Ich werde wütend, wenn _____, weil _____, ich brauche _____." Rollenspiel mit typischen Wutsituationen. Feedback: Was war anders? Was hat sich besser angefühlt?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Grenzen setzen',
            beschreibung: 'Formuliere für 3 typische Grenzüberschreitungen einen klaren, respektvollen Satz, der deine Grenze ausdrückt.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Assertiver Ausdruck üben',
          beschreibung: 'Versuche diese Woche, in einer Situation, die dich ärgert, eine Ich-Botschaft zu verwenden statt zu schweigen oder zu explodieren.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war schwierig beim Formulieren von Ich-Botschaften?',
          'Wie hat die andere Person reagiert?'
        ]
      },
      {
        nr: 4,
        titel: 'Langfristig ruhiger – Prävention',
        dauer: '60 Min',
        ziel: 'Allgemeines Stresslevel senken; präventive Selbstfürsorge aufbauen',
        psychoedukation: {
          titel: 'Das Stresspegel-Fass',
          inhalt: 'Wutausbrüche entstehen oft nicht nur durch den direkten Auslöser – sondern weil das Stresspegel-Fass bereits voll ist. Schlafmangel, Hunger, anhäufende Konflikte füllen das Fass. Prävention bedeutet, das Fass regelmäßig zu leeren: durch Schlaf, Bewegung, Erholung, positive Erlebnisse.'
        },
        interventionen: [
          {
            titel: 'Persönlicher Deeskalationsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen konkreten Plan entwickeln: Was tue ich, wenn Anzeichen von Wut kommen? Was tue ich täglich, um das Fass nicht überlaufen zu lassen? Wer kann mir helfen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wohlgefühl-Aktivitäten',
            beschreibung: 'Liste 5 Dinge auf, die dein Stresslevel regelmäßig senken. Plane eine davon für diese Woche konkret ein.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Deeskalationsplan anwenden',
          beschreibung: 'Halte dich diese Woche an deinen Plan. Schreibe auf, was geklappt hat und was nicht.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was hat sich in deinem Umgang mit Wut verändert?'
        ]
      }
    ]
  },

  'trauer-verlust': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler nach Verlusten (Tod, Trennung, Umzug, Freundschaft) oder mit unverarbeitetem Schmerz',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ich verloren habe',
        dauer: '60 Min',
        ziel: 'Den Verlust benennen und emotional ankommen',
        psychoedukation: {
          titel: 'Trauer – kein Fehler, sondern Liebe',
          inhalt: 'Trauer ist die natürliche Reaktion auf Verlust. Nicht nur der Tod eines Menschen kann Trauer auslösen – auch der Verlust einer Freundschaft, eines Zuhause, einer Gewohnheit oder einer Kindheit. Trauer zu fühlen bedeutet, dass das Verlorene wichtig war. Es gibt kein Richtig oder Falsch beim Trauern.'
        },
        interventionen: [
          {
            titel: 'Verlust in Worte fassen',
            ansatz: 'Narrativ / Emotionsfokussiert',
            beschreibung: 'Der Schüler erzählt oder schreibt, was verloren gegangen ist. Was war diese Person/Sache für dich? Was bedeutet das Fehlen? Nur zuhören, nicht bewerten.',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Erinnerungskasten',
            beschreibung: 'Was möchtest du von dem Verlorenen behalten? Schreibe 5 Erinnerungen oder Eigenschaften auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Brief schreiben',
          beschreibung: 'Schreibe einen Brief an die verlorene Person/das Verlorene – was du noch sagen wolltest.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was fehlt dir am meisten?',
          'Gibt es etwas, das du nie sagen oder tun konntest?'
        ]
      },
      {
        nr: 2,
        titel: 'Trauerphasen verstehen',
        dauer: '60 Min',
        ziel: 'Eigene Trauerprozesse einordnen; Normalisierung von Trauergefühlen',
        psychoedukation: {
          titel: 'Trauer hat viele Gesichter',
          inhalt: 'Trauer verläuft nicht in festen Phasen – sie kommt in Wellen. Manchmal fühlt man Schmerz, manchmal Taubheit, manchmal Wut, manchmal sogar Erleichterung. All das ist normal. Trauer drängt sich manchmal zu unerwarteten Momenten auf – und das ist okay.'
        },
        interventionen: [
          {
            titel: 'Trauerwellen-Karte',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Gemeinsam auf einer Zeitlinie: Wann war die Trauer besonders stark? Wann ruhiger? Was hat geholfen? Was hat es schwerer gemacht?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Trauer-Auslöser erkennen',
            beschreibung: 'Was löst die Trauer besonders aus? (Orte, Lieder, Jahrestage, Gerüche…). Wähle einen aus und beschreibe, was er in dir auslöst.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Rituale zum Erinnern',
          beschreibung: 'Überlege ein kleines Ritual, das dir hilft, die Verbindung zum Verlorenen aufrechtzuerhalten (z.B. ein Foto aufstellen, an einem bestimmten Ort sein).',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann taucht die Trauer am unerwartetsten auf?',
          'Was hilft dir, in diesen Momenten bei dir zu bleiben?'
        ]
      },
      {
        nr: 3,
        titel: 'Mit dem Schmerz umgehen',
        dauer: '60 Min',
        ziel: 'Selbstfürsorge in der Trauer; Schmerz halten ohne zu erstarren',
        psychoedukation: {
          titel: 'Trauer halten – nicht bekämpfen',
          inhalt: 'Trauer vergeht schneller, wenn wir ihr Raum geben – und langsamer, wenn wir sie vermeiden. Gleichzeitig darf Trauer nicht das gesamte Leben ausfüllen. Es hilft, Zeitfenster fürs Trauern zu haben – und dann bewusst wieder ins Leben zurückzukehren.'
        },
        interventionen: [
          {
            titel: 'Duale Aufmerksamkeit',
            ansatz: 'Ressourcenorientiert / EMDR-nah',
            beschreibung: 'Gleichzeitig auf den Schmerz schauen UND auf etwas Stabiles im Hier und Jetzt. Übung: Verlust im Bewusstsein halten, dabei einen sicheren Ort oder eine gute Erinnerung beschreiben.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Selbstfürsorge-Plan',
            beschreibung: 'Was tut dir in dieser Trauerphase gut? Erstelle eine Liste mit 5 konkreten Selbstfürsorge-Aktivitäten für diese Woche.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Trauer-Fenster',
          beschreibung: 'Setze dir täglich 10 Minuten, in denen du bewusst trauerst – und danach eine Aktivität, die dich ins Jetzt zurückbringt.',
          dauer: 'täglich 10 Min'
        },
        reflexion: [
          'Was hilft dir, trotz der Trauer im Leben zu bleiben?',
          'Was gibt dir Kraft?'
        ]
      },
      {
        nr: 4,
        titel: 'Weiterleben – nicht vergessen',
        dauer: '60 Min',
        ziel: 'Integration des Verlustes; Zukunftsperspektive entwickeln',
        psychoedukation: {
          titel: 'Trauer endet nicht – sie verändert sich',
          inhalt: 'Trauer endet nicht mit dem Vergessen – sie verändert sich. Das Ziel ist nicht, den Verlust hinter sich zu lassen, sondern ihn in das eigene Leben zu integrieren. Das Verlorene bekommt einen Platz im Herzen, ohne das Leben zu beherrschen.'
        },
        interventionen: [
          {
            titel: 'Innerer Platz für den Verlust',
            ansatz: 'Narrativ / Emotionsfokussiert',
            beschreibung: 'Gemeinsam überlegen: Welchen Platz soll das Verlorene in deinem Leben einnehmen? Wie möchtest du erinnern – ohne darin steckenzubleiben?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief aus der Zukunft',
            beschreibung: 'Stell dir vor, du bist 5 Jahre älter. Wie schreibst du über diesen Verlust? Was hat er dich gelehrt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ein Zeichen setzen',
          beschreibung: 'Tue diese Woche etwas, das du dem Verlorenen widmest – ein kleines Ritual, eine Geste, eine Erinnerung.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat dieser Verlust dich über dich selbst gelehrt?',
          'Was nimmst du aus diesem Modul mit?'
        ]
      }
    ]
  },

  'selbstwertgefuehl': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit negativem Selbstbild, Selbstzweifeln oder geringem Selbstwertgefühl',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie sehe ich mich selbst?',
        dauer: '60 Min',
        ziel: 'Eigenes Selbstbild explorieren und kritisch hinterfragen',
        psychoedukation: {
          titel: 'Selbstwert – was ist das?',
          inhalt: 'Selbstwert ist das Gefühl, grundsätzlich gut genug zu sein – nicht perfekt, aber wertvoll. Selbstwert entsteht durch Erfahrungen, Beziehungen und Rückmeldungen. Er ist nicht fest – er kann gestärkt werden. Niedriger Selbstwert entsteht oft durch negative Botschaften, die wir irgendwann für wahr gehalten haben.'
        },
        interventionen: [
          {
            titel: 'Selbstbild-Inventur',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Der Schüler beschreibt sich selbst: Was denke ich über mich? Was denken andere über mich? Woher kommen diese Überzeugungen? Gemeinsam analysieren: Welche Botschaften hat er/sie über sich internalisiert?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Innerer Kritiker vs. innerer Freund',
            beschreibung: 'Schreibe auf, was dein innerer Kritiker über dich sagt. Dann: Was würde ein guter Freund über dich sagen?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stärken-Tagebuch beginnen',
          beschreibung: 'Schreibe täglich eine Sache auf, die du gut gemacht hast oder auf die du stolz sein kannst – egal wie klein.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Woher kommen deine negativen Überzeugungen über dich selbst?',
          'Sind diese Überzeugungen wirklich wahr?'
        ]
      },
      {
        nr: 2,
        titel: 'Meine Stärken entdecken',
        dauer: '60 Min',
        ziel: 'Eigene Ressourcen und Stärken bewusst wahrnehmen',
        psychoedukation: {
          titel: 'Stärken – nicht Perfektion',
          inhalt: 'Selbstwert wächst nicht durch Perfektion, sondern durch das Erleben von Kompetenz. Es geht nicht darum, der Beste zu sein – sondern darum, zu erkennen, was man kann und wer man ist. Jeder Mensch hat Stärken – auch wenn sie manchmal vergraben sind.'
        },
        interventionen: [
          {
            titel: 'Stärken-Interview',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Fragen: Was kannst du gut? Wann bist du in deinem Element? Was sagen andere über deine Stärken? Was hast du trotz Schwierigkeiten geschafft? Gemeinsam eine persönliche Stärkenliste erarbeiten.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meisterleistungen sammeln',
            beschreibung: 'Liste 5 Dinge auf, auf die du stolz bist – aus deinem bisherigen Leben. Kleines zählt genauso wie Großes.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stärken einsetzen',
          beschreibung: 'Setze diese Woche bewusst eine deiner Stärken ein – in der Schule, zu Hause oder mit Freunden.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war überraschend an deiner Stärkenliste?',
          'Welche Stärke möchtest du weiter ausbauen?'
        ]
      },
      {
        nr: 3,
        titel: 'Negative Selbstüberzeugungen verändern',
        dauer: '60 Min',
        ziel: 'Automatische negative Gedanken über sich selbst identifizieren und umformulieren',
        psychoedukation: {
          titel: 'Selbstabwertende Gedanken erkennen',
          inhalt: 'Niedriger Selbstwert wird durch automatische negative Gedanken aufrechterhalten: „Ich bin nicht gut genug", „Ich schaffe das sowieso nicht", „Die anderen sind besser." Diese Gedanken fühlen sich wahr an – sind es aber oft nicht. Sie lassen sich hinterfragen und verändern.'
        },
        interventionen: [
          {
            titel: 'Gedanken-Umstrukturierung',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Die häufigsten selbstabwertenden Gedanken identifizieren. Für jeden: Welche Beweise gibt es dafür? Welche dagegen? Wie würde eine realistischere Version lauten?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Selbstmitgefühl üben',
            beschreibung: 'Schreibe dir selbst einen Brief, so mitfühlend wie du ihn einem guten Freund in derselben Situation schreiben würdest.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kritischen Gedanken begegnen',
          beschreibung: 'Wenn ein negativer Gedanke über dich kommt, schreibe ihn auf und formuliere eine freundlichere, realistischere Alternative.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher negative Gedanke ist der hartnäckigste?',
          'Was würdest du einem Freund sagen, der so über sich denkt?'
        ]
      },
      {
        nr: 4,
        titel: 'Selbstwert im Alltag stärken',
        dauer: '60 Min',
        ziel: 'Langfristige Strategien zur Selbstwert-Pflege entwickeln',
        psychoedukation: {
          titel: 'Selbstwert braucht Pflege',
          inhalt: 'Selbstwert ist kein Zustand, den man einmal erreicht – er wird täglich gepflegt. Durch Selbstfürsorge, gesunde Grenzen, ehrliche Selbstreflexion und Beziehungen, in denen man sich wohl fühlt. Wer sich selbst gut behandelt, sendet sich selbst die Botschaft: Ich bin es wert.'
        },
        interventionen: [
          {
            titel: 'Persönliche Selbstwert-Praxis',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam entwickeln: Welche täglichen oder wöchentlichen Praktiken stärken deinen Selbstwert? (z.B. Stärken-Tagebuch fortführen, nein sagen üben, Vergleiche vermeiden, Zeit mit unterstützenden Menschen verbringen)',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: '30-Tage-Stärken-Plan',
            beschreibung: 'Entwirf einen 30-Tage-Plan mit einer täglichen kleinen Aktion, die dein Selbstwertgefühl stärkt.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Erste Woche des Plans',
          beschreibung: 'Setze die erste Woche deines Plans um und beobachte, was sich verändert.',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du in einem Jahr über dich denken?'
        ]
      }
    ]
  },

  'depressive-stimmungen': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit anhaltend gedrückter Stimmung, Rückzug oder Antriebslosigkeit (keine klinische Diagnose vorausgesetzt)',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie fühlt sich diese Schwere an?',
        dauer: '60 Min',
        ziel: 'Depressive Stimmungen benennen und explorieren ohne Pathologisierung',
        psychoedukation: {
          titel: 'Trübsinn, Schwere, Leere – was passiert da?',
          inhalt: 'Depressive Stimmungen sind mehr als „schlechte Laune". Sie können sich anfühlen wie eine graue Wolke, innere Leere, Erschöpfung oder das Gefühl, alles ist sinnlos. Das ist real – keine Einbildung, keine Schwäche. Und: Es gibt einen Ausweg.'
        },
        interventionen: [
          {
            titel: 'Stimmungstagebuch der letzten Woche',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Gemeinsam die Stimmung der letzten 7 Tage auf einer Skala (1=sehr schlecht, 10=sehr gut) eintragen. Muster erkennen: Wann war es besser, wann schlechter? Was war an guten Tagen anders?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Die Schwere beschreiben',
            beschreibung: 'Wenn deine depressive Stimmung ein Wetter, ein Bild oder ein Objekt wäre – was wäre es? Zeichne oder schreibe es.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stimmungs-Check',
          beschreibung: 'Trage jeden Abend deine Stimmung (1–10) in eine Tabelle ein und notiere ein Ereignis oder Gedanken des Tages.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Seit wann fühlst du dich so?',
          'Gibt es Momente, in denen es etwas leichter ist?'
        ]
      },
      {
        nr: 2,
        titel: 'Der Teufelskreis der Depression',
        dauer: '60 Min',
        ziel: 'Verhaltens- und Gedankenmuster verstehen, die Stimmung aufrechterhalten',
        psychoedukation: {
          titel: 'Rückzug verstärkt Schwere',
          inhalt: 'Depressive Stimmung führt zu Rückzug → Rückzug führt zu weniger positiven Erlebnissen → weniger Erlebnisse verstärken die Schwere. Dieser Teufelskreis hält sich selbst aufrecht. Der Ausweg: kleine Aktivitäten, auch wenn man sich nicht danach fühlt – denn Motivation kommt oft erst nach der Handlung, nicht davor.'
        },
        interventionen: [
          {
            titel: 'Teufelskreis zeichnen',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Gemeinsam den persönlichen Teufelskreis des Schülers visualisieren: Schwere → Gedanken → Verhalten → Konsequenz → mehr Schwere. Wo könnte man eingreifen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Angenehme Aktivitäten identifizieren',
            beschreibung: 'Liste 10 Aktivitäten auf, die dir früher Freude gemacht haben oder die du dir vorstellen könntest. Sortiere nach Aufwand (gering bis hoch).',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eine Aktivität pro Tag',
          beschreibung: 'Plane für jeden Tag der Woche eine kleine Aktivität aus deiner Liste ein – auch wenn du keine Lust hast. Notiere danach: Wie war es?',
          dauer: 'täglich 15 Min'
        },
        reflexion: [
          'Welche Aktivitäten haben dir am meisten geholfen?',
          'Was hält dich davon ab, aktiver zu sein?'
        ]
      },
      {
        nr: 3,
        titel: 'Gedanken, die schwer machen',
        dauer: '60 Min',
        ziel: 'Negative Denkmuster erkennen und herausfordern',
        psychoedukation: {
          titel: 'Depressives Denken',
          inhalt: 'Depressive Stimmung geht oft mit typischen Denkverzerrungen einher: alles schwarz sehen, Positives nicht wahrnehmen, sich selbst die Schuld geben, die Zukunft hoffnungslos sehen. Diese Gedanken fühlen sich wahr an – aber sie sind gefärbt durch die Stimmung, nicht durch die Realität.'
        },
        interventionen: [
          {
            titel: 'Gedanken-Check',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Häufige depressive Gedanken identifizieren und für jeden prüfen: Wie wahr ist das wirklich? Was spricht dagegen? Was würde jemand, der mich mag, dazu sagen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Positives-Dinge-Logbuch',
            beschreibung: 'Finde täglich 3 kleine Dinge, die nicht schlecht waren – egal wie winzig. Schreibe sie auf.',
            dauer: 'täglich 5 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gedankenprotokoll',
          beschreibung: 'Wenn ein schwerer Gedanke kommt: aufschreiben, Intensität (1–10), Gegenbeweis notieren.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher Gedanke belastet dich am meisten?',
          'Was wäre, wenn dieser Gedanke nur halb so wahr wäre?'
        ]
      },
      {
        nr: 4,
        titel: 'Licht finden – Perspektive und Ressourcen',
        dauer: '60 Min',
        ziel: 'Ressourcen und Hoffnung aktivieren; Unterstützungssystem stärken',
        psychoedukation: {
          titel: 'Hoffnung ist erlernbar',
          inhalt: 'Auch in schwerer Stimmung gibt es Momente, die etwas heller sind. Diese zu erkennen und zu stärken ist aktive Arbeit – keine Verdrängung. Unterstützung suchen ist kein Zeichen von Schwäche, sondern von Weisheit.'
        },
        interventionen: [
          {
            titel: 'Ressourcen aktivieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Gemeinsam: Was hat dir in der Vergangenheit geholfen, dunkle Phasen zu überstehen? Welche Menschen, Orte, Aktivitäten geben dir Kraft? Wie kannst du diese stärker einsetzen?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief in die Zukunft',
            beschreibung: 'Schreibe einen Brief an dich selbst in einem Jahr: Was wünschst du dir? Was soll sich verändert haben?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Unterstützungsnetz aktivieren',
          beschreibung: 'Wende dich diese Woche an eine Person, der du vertraust – nicht um Probleme zu lösen, sondern einfach um Kontakt zu haben.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat dir in diesem Modul geholfen?',
          'An wen kannst du dich wenden, wenn es wieder schwerer wird?'
        ]
      }
    ]
  },

  'freude-wohlbefinden': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit wenig Freudeerlebnissen, flachem Alltag oder als präventiver Abschluss anderer Module',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was macht mich glücklich?',
        dauer: '60 Min',
        ziel: 'Persönliche Quellen von Freude und Wohlbefinden erkunden',
        psychoedukation: {
          titel: 'Positive Emotionen – mehr als nur Spaß',
          inhalt: 'Positive Emotionen erweitern unseren Horizont: Sie machen kreativer, verbinden uns mit anderen und stärken die Resilienz. Freude, Dankbarkeit, Neugier und Begeisterung sind trainierbar – nicht Glücksache. Wer regelmäßig positive Erlebnisse wahrnimmt und genießt, hat langfristig mehr Wohlbefinden.'
        },
        interventionen: [
          {
            titel: 'Freuden-Inventur',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was macht dir Freude? Wo bist du in deinem Element? Was vergisst du dabei die Zeit? Gemeinsam eine Liste erstellen: Aktivitäten, Menschen, Orte, Sinneseindrücke.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Peak-Erlebnisse erinnern',
            beschreibung: 'Beschreibe einen Moment, in dem du dich wirklich lebendig oder glücklich gefühlt hast. Was war daran besonders?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Freuden-Tagebuch',
          beschreibung: 'Notiere täglich eine Sache, die dir Freude bereitet hat – egal wie klein.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Wann hast du zuletzt echte Freude empfunden?',
          'Was steht dir im Weg, öfter Freude zu erleben?'
        ]
      },
      {
        nr: 2,
        titel: 'Freude aktiv gestalten',
        dauer: '60 Min',
        ziel: 'Flow-Erlebnisse fördern; positive Aktivitäten bewusst einplanen',
        psychoedukation: {
          titel: 'Flow – im Strom sein',
          inhalt: 'Flow ist der Zustand, wenn man vollkommen in einer Tätigkeit aufgeht – weder gelangweilt noch überfordert. Flow entsteht, wenn Fähigkeiten und Herausforderung ausgewogen sind. Solche Aktivitäten regelmäßig zu haben ist eine der verlässlichsten Quellen von Wohlbefinden.'
        },
        interventionen: [
          {
            titel: 'Flow-Aktivitäten identifizieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Welche Aktivitäten bringen dich in einen Flow-Zustand? Gemeinsam überlegen, wie diese Aktivitäten in den Alltag integriert werden können.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wochenplan mit Freude',
            beschreibung: 'Erstelle einen Wochenplan und plane bewusst mindestens eine Freude-Aktivität pro Tag ein.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Freude-Aktivität durchführen',
          beschreibung: 'Führe eine geplante Freude-Aktivität durch und beobachte: Wie geht es dir vorher, während und danach?',
          dauer: '30 Min'
        },
        reflexion: [
          'Was hat dich überrascht beim bewussten Erleben von Freude?',
          'Was hindert dich, öfter solche Aktivitäten zu machen?'
        ]
      },
      {
        nr: 3,
        titel: 'Dankbarkeit und Genuss',
        dauer: '60 Min',
        ziel: 'Dankbarkeit und Genussfähigkeit als Wohlbefindens-Ressourcen stärken',
        psychoedukation: {
          titel: 'Dankbarkeit verändert das Gehirn',
          inhalt: 'Regelmäßige Dankbarkeit – bewusst wahrnehmen, was gut ist – stärkt positive neuronale Verbindungen. Dabei geht es nicht um erzwungene Positivität, sondern um ehrliche Aufmerksamkeit für das, was da ist. Selbst in schwierigen Zeiten gibt es Dinge, die real und gut sind.'
        },
        interventionen: [
          {
            titel: 'Dankbarkeits-Praxis',
            ansatz: 'Achtsamkeitsbasiert',
            beschreibung: 'Täglich 3 konkrete, spezifische Dinge aufschreiben, für die man dankbar ist – mit Begründung. Gemeinsam üben und besprechen: Was war überraschend? Was hat sich verändert?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Genuss-Übung',
            beschreibung: 'Führe eine Genuss-Übung durch: Iss etwas Leckeres sehr langsam und bewusst. Alle Sinne einsetzen. Nachher: Was hast du wahrgenommen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: '7-Tage-Dankbarkeit',
          beschreibung: 'Führe eine Woche lang täglich dein Dankbarkeits-Tagebuch. Was verändert sich?',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was ist deine verlässlichste Quelle von Freude und Wohlbefinden?'
        ]
      }
    ]
  },

  'freundschaften': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Schwierigkeiten beim Aufbau oder Erhalt von Freundschaften',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Freundschaft?',
        dauer: '60 Min',
        ziel: 'Eigene Vorstellungen von Freundschaft klären; aktuelle Freundschaften einschätzen',
        psychoedukation: {
          titel: 'Was eine Freundschaft ausmacht',
          inhalt: 'Echte Freundschaft basiert auf Gegenseitigkeit, Vertrauen und Respekt. Sie entwickelt sich langsam durch gemeinsame Erlebnisse und geteilte Verletzlichkeit. Nicht jeder Bekannte ist ein Freund – und das ist okay. Wenige tiefe Freundschaften sind wertvoller als viele oberflächliche Kontakte.'
        },
        interventionen: [
          {
            titel: 'Freundschafts-Analyse',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Aktuelle Freundschaften auf einer Karte: Wer ist wirklich nah? Was schätze ich an dieser Person? Ist die Freundschaft ausgeglichen? Was würde ich mir mehr wünschen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ideale Freundschaft beschreiben',
            beschreibung: 'Was sind die 5 wichtigsten Eigenschaften eines guten Freundes? Vergleiche: Habe ich selbst diese Eigenschaften?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Freundschaft stärken',
          beschreibung: 'Tue diese Woche etwas Konkretes für eine bestehende Freundschaft: eine Nachricht schicken, Zeit einplanen, Interesse zeigen.',
          dauer: '15 Min'
        },
        reflexion: [
          'Wer ist gerade dein wichtigster Freund/deine wichtigste Freundin?',
          'Was schätzt du an dieser Person besonders?'
        ]
      },
      {
        nr: 2,
        titel: 'Neue Freundschaften knüpfen',
        dauer: '60 Min',
        ziel: 'Hemmnisse beim Kennenlernen erkennen; konkrete Gesprächsstrategien üben',
        psychoedukation: {
          titel: 'Wie Freundschaften entstehen',
          inhalt: 'Freundschaften entstehen durch drei Faktoren: Nähe (regelmäßiger Kontakt), Offenheit (sich zeigen) und positive Erlebnisse. Das Schwierigste ist der erste Schritt. Aber: Fast jeder Mensch freut sich, wenn jemand echtes Interesse zeigt.'
        },
        interventionen: [
          {
            titel: 'Gesprächs-Einstieg üben',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Rollenspiel: Wie starte ich ein Gespräch mit jemandem, den ich noch nicht gut kenne? Üben: Offene Fragen stellen, echtes Interesse zeigen, etwas von sich erzählen. Feedback geben.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Kontaktmöglichkeiten brainstormen',
            beschreibung: 'Wo könnte ich neue Menschen kennenlernen, die meine Interessen teilen? Liste 5 konkrete Möglichkeiten auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Erster Schritt',
          beschreibung: 'Diese Woche: Sprich jemanden an, den du interessant findest, aber noch nicht gut kennst.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was macht es schwer, auf neue Menschen zuzugehen?',
          'Was hat dich bei bestehenden Freundschaften anfangs überwunden?'
        ]
      },
      {
        nr: 3,
        titel: 'Freundschaften pflegen und Konflikte überleben',
        dauer: '60 Min',
        ziel: 'Freundschaften aktiv pflegen; Konflikte als normale Phase verstehen',
        psychoedukation: {
          titel: 'Freundschaft ist aktive Arbeit',
          inhalt: 'Freundschaften wachsen nicht von allein – sie brauchen Zeit, Aufmerksamkeit und manchmal auch Konflikt. Konflikte in Freundschaften sind normal und können die Beziehung sogar stärken, wenn sie konstruktiv gelöst werden. Freundschaft bedeutet auch: ehrlich sein, auch wenn es unbequem ist.'
        },
        interventionen: [
          {
            titel: 'Freundschaftskonflikt analysieren',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Einen aktuellen oder vergangenen Konflikt mit einem Freund durchgehen: Was ist passiert? Wie wurde es gelöst – oder nicht? Was hätte geholfen? Was lernst du daraus?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Freundschaftspflege-Rituale',
            beschreibung: 'Welche regelmäßigen Dinge könntest du tun, um wichtige Freundschaften zu pflegen? Erstelle einen konkreten kleinen Plan.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Freundschaftspflege umsetzen',
          beschreibung: 'Setze diese Woche einen Punkt deines Plans um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du in deinen Freundschaften anders machen?'
        ]
      }
    ]
  },

  'konfliktmanagement': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit häufigen Konflikten, eskalierende Streitigkeiten oder fehlenden Deeskalationsstrategien',
    sitzungen: [
      {
        nr: 1,
        titel: 'Konflikte verstehen',
        dauer: '60 Min',
        ziel: 'Konflikte als normale Erscheinung einordnen; eigene Konfliktstile kennenlernen',
        psychoedukation: {
          titel: 'Konflikte sind unvermeidbar',
          inhalt: 'Überall, wo Menschen unterschiedliche Bedürfnisse, Werte oder Interessen haben, entstehen Konflikte. Das ist normal. Problematisch wird es, wenn Konflikte eskalieren, vermieden werden oder immer nach demselben destruktiven Muster laufen. Die gute Nachricht: Konflikte lassen sich lösen lernen.'
        },
        interventionen: [
          {
            titel: 'Eigener Konfliktstil',
            ansatz: 'Systemisch',
            beschreibung: 'Welcher Konfliktstil bin ich? (Kämpfer, Flüchter, Nachgeber, Problemlöser). Anhand eines konkreten Konflikts herausarbeiten: Was tue ich typischerweise? Was sind die Konsequenzen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Konflikt-Zeitlinie',
            beschreibung: 'Zeichne einen typischen Konflikt: Auslöser → Eskalation → Höhepunkt → Ergebnis. Wo hättest du eingreifen können?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Konflikt beobachten',
          beschreibung: 'Beobachte diese Woche einen Konflikt (eigener oder fremder) und notiere: Auslöser, Reaktionen, Ergebnis.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher Konfliktstil ist deiner? Was sind die Vor- und Nachteile?',
          'Was würdest du gerne anders machen?'
        ]
      },
      {
        nr: 2,
        titel: 'Deeskalieren in heißen Momenten',
        dauer: '60 Min',
        ziel: 'Konkrete Deeskalationstechniken für akute Konfliktsituationen',
        psychoedukation: {
          titel: 'Im heißen Moment klug handeln',
          inhalt: 'Wenn Emotionen hochkochen, ist rationales Denken eingeschränkt. Deeskalation bedeutet: erst die Temperatur senken, dann das Problem lösen. Wer deeskaliert, verliert nicht – er gewinnt die Möglichkeit, das Problem wirklich zu lösen.'
        },
        interventionen: [
          {
            titel: 'Deeskalations-Toolbox',
            ansatz: 'Verhaltenstherapeutisch',
            beschreibung: 'Techniken erarbeiten und üben: Pause einlegen, Tempo rausnehmen, Ton senken, aktiv zuhören, gemeinsame Interessen benennen. Rollenspiel: ein eskalierende Situation deeskalieren.',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Deeskalations-Sätze formulieren',
            beschreibung: 'Formuliere 3 Sätze, die du in einem Konflikt sagen kannst, um die Temperatur zu senken (z.B. „Ich möchte das wirklich lösen. Können wir kurz pausieren?").',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Deeskalation ausprobieren',
          beschreibung: 'Setze in einem Konflikt dieser Woche eine Deeskalationstechnik bewusst ein.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was war schwierig am Deeskalieren?',
          'Was hat funktioniert?'
        ]
      },
      {
        nr: 3,
        titel: 'Interessen statt Positionen',
        dauer: '60 Min',
        ziel: 'Hinter Positionen liegende Bedürfnisse erkennen; Win-Win-Lösungen entwickeln',
        psychoedukation: {
          titel: 'Das Eisberg-Modell des Konflikts',
          inhalt: 'Sichtbar ist im Konflikt die Position: „Ich will X!" Darunter liegen Interessen und Bedürfnisse: Warum will ich X? Was brauche ich wirklich? Wenn beide Seiten ihre tiefer liegenden Bedürfnisse kennen, lassen sich oft Lösungen finden, die beide zufriedenstellen.'
        },
        interventionen: [
          {
            titel: 'Positions-Interessen-Analyse',
            ansatz: 'Systemisch / Lösungsfokussiert',
            beschreibung: 'Anhand eines konkreten Konflikts: Was ist meine Position? Was ist mein dahinterliegendes Bedürfnis? Was könnte das dahinterliegende Bedürfnis der anderen Seite sein? Welche Lösung würde beide Bedürfnisse erfüllen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Lösungsoptionen brainstormen',
            beschreibung: 'Für einen aktuellen Konflikt: Sammle 5 mögliche Lösungen, ohne sie zu bewerten. Dann wähle die beste aus.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Lösung umsetzen',
          beschreibung: 'Versuche diese Woche in einem Konflikt, hinter die Position der anderen Person zu schauen und ein Gespräch über Bedürfnisse zu führen.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war überraschend, wenn du hinter die Position geschaut hast?',
          'Hat sich die Lösung verändert, wenn du die Bedürfnisse siehst?'
        ]
      },
      {
        nr: 4,
        titel: 'Langfristig konfliktfähig werden',
        dauer: '60 Min',
        ziel: 'Konfliktlösung als Kompetenz verankern; Umgang mit ungelösten Konflikten',
        psychoedukation: {
          titel: 'Nicht jeder Konflikt lässt sich lösen',
          inhalt: 'Manchmal ist eine vollständige Lösung nicht möglich – weil die andere Seite nicht will, weil die Positionen zu weit auseinander liegen, oder weil es Zeit braucht. Dann geht es darum, mit dem Konflikt umzugehen, ohne ihn zu vergiften. Auch das ist eine Kompetenz.'
        },
        interventionen: [
          {
            titel: 'Persönliches Konflikt-Protokoll',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen persönlichen Konfliktplan erstellen: Was sind meine Stärken und Schwächen im Konflikt? Welche Techniken helfen mir am meisten? Wann brauche ich Unterstützung?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ungelöste Konflikte einordnen',
            beschreibung: 'Gibt es Konflikte, die du gerne lösen würdest, aber nicht kannst? Was kannst du kontrollieren? Was nicht? Wie kannst du damit leben?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Konfliktplan anwenden',
          beschreibung: 'Wende in dieser Woche deinen persönlichen Konfliktplan an und reflektiere, was gut funktioniert hat.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat sich in diesem Modul in deinem Umgang mit Konflikten verändert?',
          'Was nimmst du als wichtigste Erkenntnis mit?'
        ]
      }
    ]
  },

  'kommunikation': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit Kommunikationsschwierigkeiten, Missverständnissen oder passivem/aggressivem Kommunikationsstil',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie kommuniziere ich?',
        dauer: '60 Min',
        ziel: 'Eigenen Kommunikationsstil erkennen; Grundlagen der Kommunikation verstehen',
        psychoedukation: {
          titel: 'Man kann nicht nicht kommunizieren',
          inhalt: 'Kommunikation ist mehr als Worte. 55% der Botschaft kommt über Körpersprache, 38% über Tonfall, nur 7% über den Inhalt. Missverständnisse entstehen, weil Sender und Empfänger dieselbe Nachricht unterschiedlich verstehen. Das 4-Ohren-Modell zeigt: Jede Nachricht hat Sachebene, Beziehungsebene, Selbstoffenbarung und Appell.'
        },
        interventionen: [
          {
            titel: '4-Ohren-Analyse',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Ein Beispielsatz analysieren (z.B. „Das Essen ist kalt."): Was sagt der Sender auf jeder Ebene? Wie hört der Empfänger es auf jeder Ebene? Wo entstehen Missverständnisse?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Eigenen Stil einschätzen',
            beschreibung: 'Bin ich eher passiv (schweige, weiche aus), aggressiv (kritisiere, greife an) oder assertiv (klar, direkt, respektvoll)? Beispiele aus dem Alltag sammeln.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kommunikation beobachten',
          beschreibung: 'Beobachte diese Woche ein Gespräch: Auf welcher Ebene kommuniziert jeder? Gibt es Missverständnisse? Warum?',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher Kommunikationsstil ist deiner? Was sind die Folgen?',
          'Wann kommunizierst du am klarsten?'
        ]
      },
      {
        nr: 2,
        titel: 'Aktiv zuhören',
        dauer: '60 Min',
        ziel: 'Aktives Zuhören als Kernkompetenz entwickeln',
        psychoedukation: {
          titel: 'Zuhören ist aktiv',
          inhalt: 'Die meisten Menschen hören nicht wirklich zu – sie warten auf ihre Antwort. Aktives Zuhören bedeutet: vollständige Aufmerksamkeit geben, nachfragen, zusammenfassen, Gefühle spiegeln. Das zeigt dem anderen: Du bist wichtig. Und es verhindert Missverständnisse, bevor sie entstehen.'
        },
        interventionen: [
          {
            titel: 'Aktives Zuhören üben',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Übung in Paaren: Eine Person erzählt 3 Minuten etwas. Die andere hört zu (kein Smartphone, kein Unterbrechen). Danach: Zusammenfassung + Nachfrage. Dann Rollen tauschen. Feedback: Wie hat es sich angefühlt, wirklich zugehört zu werden?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühle spiegeln',
            beschreibung: 'Übe, Gefühle zu benennen, die du beim Gegenüber wahrnimmst: „Ich höre, dass du frustriert bist…" – ohne zu interpretieren oder zu bewerten.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Zuhör-Experiment',
          beschreibung: 'Führe diese Woche ein Gespräch, in dem du bewusst aktiv zuhörst. Danach aufschreiben: Was war anders?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war beim aktiven Zuhören schwierig?',
          'Wie hat sich der andere verändert, wenn er merkte, dass du wirklich zuhörst?'
        ]
      },
      {
        nr: 3,
        titel: 'Gewaltfreie Kommunikation',
        dauer: '60 Min',
        ziel: 'GFK-Modell (Beobachtung, Gefühl, Bedürfnis, Bitte) kennen und anwenden',
        psychoedukation: {
          titel: 'Gewaltfreie Kommunikation nach Rosenberg',
          inhalt: 'Gewaltfrei bedeutet nicht schwach – sondern klar und ehrlich ohne Vorwürfe. Das GFK-Modell hat 4 Schritte: 1. Beobachtung (ohne Bewertung), 2. Gefühl, 3. Bedürfnis, 4. Konkrete Bitte. Beispiel: „Als du gestern nicht kamst (B), war ich enttäuscht (G), weil mir Verlässlichkeit wichtig ist (B). Bitte sag mir vorher Bescheid (Bitte)."'
        },
        interventionen: [
          {
            titel: 'GFK-Sätze formulieren',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Aus typischen Alltagskonflikten GFK-Formulierungen entwickeln. Zuerst gemeinsam, dann selbstständig. Rollenspiel: GFK in einer schwierigen Situation ausprobieren.',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Vorwurf → GFK umwandeln',
            beschreibung: 'Wandle 3 typische Vorwürfe in GFK-Formulierungen um: „Du hörst mir nie zu" → „Wenn du während ich spreche auf dein Handy schaust, fühle ich mich nicht wichtig, weil ich mir Aufmerksamkeit wünsche. Könntest du das Handy kurz weglegen?"',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'GFK im Alltag',
          beschreibung: 'Verwende diese Woche in mindestens einem Gespräch eine GFK-Formulierung.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war überraschend an der GFK?',
          'In welcher Situation wäre sie am hilfreichsten?'
        ]
      },
      {
        nr: 4,
        titel: 'Assertive Kommunikation in schwierigen Situationen',
        dauer: '60 Min',
        ziel: 'In herausfordernden Situationen klar und respektvoll kommunizieren',
        psychoedukation: {
          titel: 'Assertivität – für sich einstehen ohne anzugreifen',
          inhalt: 'Assertiv zu sein bedeutet: eigene Bedürfnisse und Meinungen klar zu vertreten, ohne andere zu verletzen oder selbst zu kapitulieren. Es ist der Mittelweg zwischen Passivität und Aggression. Assertivität schützt Beziehungen und stärkt das Selbstwertgefühl.'
        },
        interventionen: [
          {
            titel: 'Schwierige Gespräche üben',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Rollenspiele mit herausfordernden Situationen: Kritik äußern, Nein sagen, um etwas bitten, eine Entschuldigung annehmen. Jeweils mit Feedback: Was war assertiv? Was war passiv oder aggressiv?',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Persönlicher Kommunikationsplan',
            beschreibung: 'Welche kommunikativen Stärken habe ich? Wo möchte ich mich verbessern? Welche Technik nehme ich als erstes mit in den Alltag?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Assertives Gespräch führen',
          beschreibung: 'Führe diese Woche bewusst ein Gespräch, in dem du assertiv kommunizierst – etwas sagst, das du sonst vermieden hättest.',
          dauer: '20 Min'
        },
        reflexion: [
          'Was hat sich in diesem Modul in deiner Kommunikation verändert?',
          'Welche Technik nimmst du als wichtigste mit?'
        ]
      }
    ]
  },

  'romantische-beziehungen': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit Fragen zu Liebe, Partnerschaft, Trennung oder toxischen Beziehungsmustern',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Liebe – und was nicht?',
        dauer: '60 Min',
        ziel: 'Gesunde vs. ungesunde Beziehungsmuster erkennen',
        psychoedukation: {
          titel: 'Liebe vs. Abhängigkeit',
          inhalt: 'Echte Liebe stärkt beide Partner – sie lässt Raum für Eigenständigkeit, Freundschaften und individuelle Interessen. Eifersucht, Kontrolle oder das Gefühl, ohne die andere Person nicht existieren zu können, sind keine Liebeszeichen – sie deuten auf ungesunde Muster hin. Liebe muss sich gut anfühlen – nicht beängstigend.'
        },
        interventionen: [
          {
            titel: 'Gesund vs. toxisch',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Gemeinsam eine Liste erstellen: Was sind Zeichen einer gesunden Beziehung? Was sind Warnsignale (Red Flags)? Der Schüler ordnet eigene Erfahrungen oder Beobachtungen ein.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meine Vorstellung von Partnerschaft',
            beschreibung: 'Beschreibe deine ideale Beziehung: Wie sieht sie aus? Was ist dir wichtig? Was möchtest du nicht?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beziehungsvorbilder beobachten',
          beschreibung: 'Beobachte diese Woche eine Beziehung in deinem Umfeld (oder in Medien): Welche Muster erkennst du? Gesund oder nicht?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hast du in der Vergangenheit in Beziehungen akzeptiert, das nicht okay war?',
          'Was ist für dich eine absolute Grenze in einer Beziehung?'
        ]
      },
      {
        nr: 2,
        titel: 'Kommunikation in Beziehungen',
        dauer: '60 Min',
        ziel: 'Offen über Gefühle, Bedürfnisse und Grenzen sprechen',
        psychoedukation: {
          titel: 'Warum Paare aneinander vorbeireden',
          inhalt: 'In romantischen Beziehungen steigen die emotionalen Einsätze – und damit auch das Risiko von Missverständnissen. Viele Konflikte entstehen, weil Bedürfnisse nicht ausgesprochen werden. Offene, ehrliche Kommunikation ohne Vorwürfe ist die Grundlage jeder gesunden Beziehung.'
        },
        interventionen: [
          {
            titel: 'Bedürfnisse in Beziehungen',
            ansatz: 'Emotionsfokussiert',
            beschreibung: 'Welche Bedürfnisse hast du in einer romantischen Beziehung? (Nähe, Freiheit, Sicherheit, Bestätigung, Abwechslung…). Welche dieser Bedürfnisse hast du bisher ausgesprochen – welche nicht?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Grenzgespräch üben',
            beschreibung: 'Rollenspiel: Eine Grenze in einer romantischen Situation klar kommunizieren. Feedback: War es klar? Respektvoll? Wie hat es sich angefühlt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Bedürfnisliste schreiben',
          beschreibung: 'Erstelle eine persönliche Liste: Was brauche ich in einer Beziehung? Was kann ich geben?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was ist schwer daran, in romantischen Beziehungen offen zu sein?',
          'Was passiert, wenn du deine Bedürfnisse nicht ausdrückst?'
        ]
      },
      {
        nr: 3,
        titel: 'Trennungen verarbeiten',
        dauer: '60 Min',
        ziel: 'Trennungsschmerz normalisieren; konstruktive Verarbeitungsstrategien entwickeln',
        psychoedukation: {
          titel: 'Trennungsschmerz ist echter Schmerz',
          inhalt: 'Bildgebende Studien zeigen: Trennungsschmerz aktiviert dieselben Gehirnregionen wie körperlicher Schmerz. Er ist real. Er vergeht – aber nicht von allein. Aktives Verarbeiten (Gefühle zulassen, Abstand schaffen, neue Routinen aufbauen) beschleunigt die Heilung.'
        },
        interventionen: [
          {
            titel: 'Trennung verarbeiten',
            ansatz: 'Emotionsfokussiert / Narrativ',
            beschreibung: 'Was ist passiert? Was vermisst du? Was ist erleichternd? Was hast du gelernt? Keine Wertung – nur Raum geben für alle Gefühle.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Abschlussbrief',
            beschreibung: 'Schreibe einen Brief an die Ex-Person (der nicht abgeschickt wird): Was willst du sagen? Was lässt du los?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Neue Routine einführen',
          beschreibung: 'Plane diese Woche eine neue Aktivität oder Routine ein, die dir hilft, vorwärtszukommen.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat die Beziehung dir gegeben?',
          'Was nimmst du als Lernerfahrung mit?'
        ]
      },
      {
        nr: 4,
        titel: 'Beziehungsfähigkeit stärken',
        dauer: '60 Min',
        ziel: 'Eigene Bindungsmuster verstehen; gesunde Beziehungen aktiv gestalten',
        psychoedukation: {
          titel: 'Bindungsstile in der Liebe',
          inhalt: 'Wie wir als Kinder Bindung erfahren haben, beeinflusst unsere romantischen Beziehungen im Erwachsenenleben. Sicher gebundene Menschen können Nähe und Distanz gut regulieren. Ängstlich gebundene klammern sich, vermeidend gebundene distanzieren sich. Diese Muster sind nicht Schicksal – sie können verändert werden.'
        },
        interventionen: [
          {
            titel: 'Eigener Bindungsstil',
            ansatz: 'Psychoedukativ / Ressourcenorientiert',
            beschreibung: 'Gemeinsam herausarbeiten: Welcher Bindungsstil ist meiner? Woher kommt er? Wie zeigt er sich in meinen Beziehungen? Was will ich anders machen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gesunde Beziehung visualisieren',
            beschreibung: 'Beschreibe oder zeichne eine Szene aus deiner idealen Beziehung in 5 Jahren. Was ist dabei anders als bisher?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Einen Schritt zur Beziehungsfähigkeit',
          beschreibung: 'Was ist ein konkreter Schritt, den du tun kannst, um in zukünftigen Beziehungen gesünder zu sein?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du in zukünftigen Beziehungen anders machen?'
        ]
      }
    ]
  },

  'grenzen-setzen': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Schwierigkeiten, Nein zu sagen, eigene Grenzen zu kennen oder durchzusetzen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was sind meine Grenzen?',
        dauer: '60 Min',
        ziel: 'Eigene körperliche, emotionale und soziale Grenzen erkennen',
        psychoedukation: {
          titel: 'Grenzen schützen',
          inhalt: 'Grenzen sind keine Mauern – sie sind Markierungen dessen, was für uns okay ist und was nicht. Wer keine Grenzen hat, erschöpft sich, wird ausgenutzt oder verliert sich selbst. Grenzen zu setzen ist kein Egoismus – es ist Selbstfürsorge und eine Voraussetzung für gesunde Beziehungen.'
        },
        interventionen: [
          {
            titel: 'Grenzen-Inventur',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Körperliche Grenzen (Berührung, Raum), emotionale Grenzen (Themen, die mir zu nah gehen), soziale Grenzen (Zeit, Energie, Erwartungen). Welche Grenzen werden bei dir häufig überschritten? Wie reagierst du?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ja/Nein sortieren',
            beschreibung: 'Liste 10 Situationen auf und markiere: Wann sage ich ja, obwohl ich nein meine? Wann fühlt sich ein Ja gut an?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Grenzverletzungen beobachten',
          beschreibung: 'Beobachte diese Woche, wann deine Grenzen überschritten werden. Notiere: Situation, deine Reaktion, wie du dich dabei gefühlt hast.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Warum fällt es dir schwer, Grenzen zu setzen?',
          'Was passiert mit dir, wenn deine Grenzen ständig überschritten werden?'
        ]
      },
      {
        nr: 2,
        titel: 'Nein sagen – klar und respektvoll',
        dauer: '60 Min',
        ziel: 'Grenzen klar kommunizieren ohne Schuldgefühle',
        psychoedukation: {
          titel: 'Nein ist ein vollständiger Satz',
          inhalt: 'Viele Menschen können nicht Nein sagen, weil sie Ablehnung, Konflikt oder Schuldgefühle fürchten. Ein Nein muss nicht erklärt oder entschuldigt werden. Ein klar kommuniziertes Nein respektiert beide Seiten – und stärkt langfristig die Beziehung.'
        },
        interventionen: [
          {
            titel: 'Nein-sagen üben',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Rollenspiele: In verschiedenen Situationen (Freund bittet um Gefallen, Druck in der Gruppe, unangemessene Anfrage) klar und respektvoll Nein sagen. Feedback: War das Nein klar? Wie hat es sich angefühlt?',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Nein-Formulierungen sammeln',
            beschreibung: 'Formuliere 5 verschiedene Arten, Nein zu sagen – von weich bis klar. Welche passen zu dir?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Einmal Nein sagen',
          beschreibung: 'Sage diese Woche in einer Situation Nein, in der du normalerweise Ja sagst. Notiere: Wie war es?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie hat sich die andere Person auf dein Nein reagiert?',
          'Wie hast du dich danach gefühlt?'
        ]
      },
      {
        nr: 3,
        titel: 'Grenzen dauerhaft halten',
        dauer: '60 Min',
        ziel: 'Grenzen auch unter Druck aufrechterhalten; Selbstfürsorge als Grenzschutz',
        psychoedukation: {
          titel: 'Grenzen unter Druck',
          inhalt: 'Es gibt Menschen, die Grenzen nicht respektieren – durch Betteln, Schuldgefühle erzeugen oder Druck. Eine Grenze ist erst dann eine Grenze, wenn sie auch unter Druck standhält. Das erfordert Übung und die Überzeugung: Meine Grenze ist berechtigt.'
        },
        interventionen: [
          {
            titel: 'Grenze unter Druck halten',
            ansatz: 'Verhaltenstherapeutisch',
            beschreibung: 'Rollenspiel: Die andere Seite setzt Grenzen unter Druck (bettelt, Schuldgefühle, Wut). Üben, bei der Grenze zu bleiben ohne zu eskalieren. Techniken: Grenze wiederholen, ruhig bleiben, Gespräch beenden.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Mein Selbstfürsorge-Plan',
            beschreibung: 'Was tue ich für mich, damit meine Grenzen nicht täglich verletze werden? (Raum brauchen, Nein-Übung, Beziehungen pflegen, die mich respektieren)',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Selbstfürsorge stärken',
          beschreibung: 'Führe diese Woche eine Selbstfürsorge-Aktivität durch, die deine Grenzen stärkt.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Grenze möchtest du als erstes konsequenter setzen?'
        ]
      }
    ]
  },

  'mobbing': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler als Betroffene, Zeugen oder Täter von Mobbing/Cybermobbing',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Mobbing – und was nicht?',
        dauer: '60 Min',
        ziel: 'Mobbing von Konflikten unterscheiden; Dynamik verstehen',
        psychoedukation: {
          titel: 'Mobbing definieren',
          inhalt: 'Mobbing ist kein einmaliger Streit. Es ist systematische, wiederholte Ausgrenzung, Demütigung oder Aggression gegen eine Person, die sich nicht wirksam wehren kann. Das Machtungleichgewicht ist entscheidend. Cybermobbing hat dieselbe Dynamik – mit dem Unterschied, dass es 24/7 stattfindet und ein breites Publikum hat.'
        },
        interventionen: [
          {
            titel: 'Meine Situation einordnen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Gemeinsam herausarbeiten: Ist das, was der Schüler erlebt, Mobbing? Wie lange? Wie intensiv? Wer ist beteiligt? Was wurde bisher getan? Keine Bagatellisierung und keine Dramatisierung.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Rollen im Mobbing',
            beschreibung: 'Erkläre die Rollen: Täter, Opfer, Verstärker, Zuschauer, Verteidiger. Wer bist du in der Situation? Was kannst du als Zuschauer tun?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Situation dokumentieren',
          beschreibung: 'Schreibe auf, was passiert ist: Datum, Was, Wer, Zeugen. Das ist wichtig, falls du dich melden möchtest.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie lange geht das schon so?',
          'Hast du bisher mit jemandem darüber gesprochen?'
        ]
      },
      {
        nr: 2,
        titel: 'Auswirkungen und Gefühle',
        dauer: '60 Min',
        ziel: 'Emotionale Wunden durch Mobbing benennen und ernst nehmen',
        psychoedukation: {
          titel: 'Was Mobbing macht',
          inhalt: 'Mobbing hinterlässt Spuren: Angst, Scham, Selbstzweifel, sozialer Rückzug, Schlaf- und Konzentrationsprobleme. Das sind normale Reaktionen auf eine abnormale Situation. Es ist nicht deine Schuld – weder dein Charakter noch dein Aussehen rechtfertigen Mobbing. Niemand verdient es.'
        },
        interventionen: [
          {
            titel: 'Auswirkungen benennen',
            ansatz: 'Emotionsfokussiert',
            beschreibung: 'Wie hat das Mobbing dich verändert? Was tust du jetzt, was du früher nicht getan hast? Was vermeidest du? Gemeinsam die Folgen benennen und normalisieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief an den Täter',
            beschreibung: 'Schreibe alles auf, was du dem Täter sagen möchtest – der Brief wird nicht abgeschickt. Was hat er/sie dir angetan? Wie hat es sich angefühlt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vertraute Person einweihen',
          beschreibung: 'Erzähle diese Woche einer Vertrauensperson von der Situation – Familie, Lehrer, Schulberater.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war das Schlimmste an der Situation?',
          'Was hält dich davon ab, um Hilfe zu bitten?'
        ]
      },
      {
        nr: 3,
        titel: 'Strategien und Schutz',
        dauer: '60 Min',
        ziel: 'Konkrete Schutzstrategien entwickeln; Unterstützungsnetz aktivieren',
        psychoedukation: {
          titel: 'Was hilft – und was nicht',
          inhalt: 'Nicht hilfreiche Strategien: ignorieren (wenn es schon lange dauert), konfrontieren ohne Plan, Rache. Hilfreiche Strategien: klare Grenzen zeigen (ohne emotional zu reagieren), Verbündete suchen, Erwachsene einbeziehen, Beweise sichern, sichere Orte aufsuchen.'
        },
        interventionen: [
          {
            titel: 'Schutzplan entwickeln',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen konkreten Schutzplan: Welche sicheren Orte gibt es? Wen kann ich einbeziehen? Wie reagiere ich, wenn die Situation passiert? Was sind die nächsten Schritte?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Reaktion üben',
            beschreibung: 'Rollenspiel: Wie reagiere ich auf eine Mobbinghandlung? Ziel: ruhig, klar, ohne Eskalation. Zum Beispiel: weggehen, ignorieren mit erhobenem Kopf, kurz und direkt zurückkommunizieren.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Unterstützung aktivieren',
          beschreibung: 'Wende dich diese Woche an eine Vertrauensperson oder Institution (z.B. Schulberater, Eltern, Beratungsstelle).',
          dauer: '15 Min'
        },
        reflexion: [
          'Welche Strategie fühlt sich am machbarsten an?',
          'Wer kann dir helfen?'
        ]
      },
      {
        nr: 4,
        titel: 'Selbstwert nach Mobbing wieder aufbauen',
        dauer: '60 Min',
        ziel: 'Beschädigtes Selbstbild reparieren; Resilienz stärken',
        psychoedukation: {
          titel: 'Du bist mehr als das, was andere über dich sagen',
          inhalt: 'Mobbing hinterlässt oft falsche Überzeugungen: „Ich bin es nicht wert, dazuzugehören." Das sind Lügen des Mobbings. Dein Wert als Mensch hängt nicht davon ab, was deine Täter sagen. Selbstwert nach Mobbing neu aufzubauen braucht Zeit – aber es ist möglich.'
        },
        interventionen: [
          {
            titel: 'Mobbingnarrative hinterfragen',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Welche Botschaften hat das Mobbing in dir hinterlassen? (z.B. „Ich bin komisch", „Niemand mag mich"). Für jede: Wie wahr ist das? Was beweist das Gegenteil?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Stärken-Liste nach Mobbing',
            beschreibung: 'Was hat dir geholfen, die Situation so lange zu überstehen? Welche Stärken hast du dabei entwickelt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Positive Verbindungen suchen',
          beschreibung: 'Verbringe diese Woche Zeit mit Menschen, bei denen du dich wohl und angenommen fühlst.',
          dauer: '60 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du in einem Jahr auf diese Zeit zurückblicken?'
        ]
      }
    ]
  },

  'gruppendynamik': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Peer-Pressure-Problemen, Schwierigkeiten bei Gruppenrollen oder sozialer Anpassung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie funktionieren Gruppen?',
        dauer: '60 Min',
        ziel: 'Gruppendynamik und Peer-Pressure verstehen',
        psychoedukation: {
          titel: 'Gruppen und Rollen',
          inhalt: 'In jeder Gruppe entstehen automatisch Rollen: Anführer, Mitläufer, Außenseiter, Vermittler, Clown. Diese Rollen werden oft unbewusst zugewiesen und aufrechterhalten. Peer-Pressure ist der Druck, sich anzupassen – auch gegen die eigenen Werte. Er ist stärker in der Adoleszenz als in jedem anderen Lebensabschnitt.'
        },
        interventionen: [
          {
            titel: 'Gruppenrollen-Analyse',
            ansatz: 'Systemisch',
            beschreibung: 'Welche Rolle nimmst du in deiner Gruppe ein? Wurde sie dir zugewiesen? Magst du sie? Was würde passieren, wenn du sie verändern würdest?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Peer-Pressure-Situationen sammeln',
            beschreibung: 'Nenne 3 Situationen, in denen du Druck gespürt hast, dich anzupassen. Was hast du getan? Was hättest du lieber getan?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gruppenbeobachtung',
          beschreibung: 'Beobachte diese Woche eine Gruppe (Klasse, Freundeskreis): Welche Rollen erkennst du? Welche ungeschriebenen Regeln gibt es?',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Rolle in der Gruppe entspricht dir wirklich?',
          'Wann passt du dich an – und wann bleibst du du selbst?'
        ]
      },
      {
        nr: 2,
        titel: 'Peer-Pressure widerstehen',
        dauer: '60 Min',
        ziel: 'Eigene Werte stärken; Strategien zum Umgang mit Gruppendruck entwickeln',
        psychoedukation: {
          titel: 'Warum Peer-Pressure so stark ist',
          inhalt: 'Das Gehirn Jugendlicher reagiert stärker auf Gruppenbewertungen als das Gehirn von Erwachsenen. Dazugehören ist ein biologisches Grundbedürfnis. Gegen den Gruppenstrom zu schwimmen braucht mehr Mut als für Erwachsene. Aber: Wer einmal gelernt hat, bei sich zu bleiben, gewinnt Selbstachtung und echte Freundschaften.'
        },
        interventionen: [
          {
            titel: 'Eigene Werte klären',
            ansatz: 'Wertebasiert',
            beschreibung: 'Was sind meine wichtigsten Werte? Wofür stehe ich? Gemeinsam herausarbeiten und prüfen: In welchen Situationen habe ich gegen meine Werte gehandelt – wegen Gruppendruck?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ablehnung üben',
            beschreibung: 'Rollenspiele: Druck in der Gruppe – und dabei bei sich bleiben. Verschiedene Formulierungen üben: humorvoll ablehnen, klar ablehnen, Thema wechseln.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Bei sich bleiben',
          beschreibung: 'Entscheide diese Woche einmal bewusst gegen den Gruppendruck. Was war das Ergebnis?',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher deiner Werte ist dir am wichtigsten?',
          'Was verlierst du, wenn du immer nachgibst?'
        ]
      },
      {
        nr: 3,
        titel: 'Echte Zugehörigkeit finden',
        dauer: '60 Min',
        ziel: 'Authentische Zugehörigkeit statt erzwungener Anpassung',
        psychoedukation: {
          titel: 'Dazugehören ohne sich zu verlieren',
          inhalt: 'Es gibt einen Unterschied zwischen Zugehörigkeit und Anpassung. Echte Zugehörigkeit bedeutet: Du wirst so akzeptiert, wie du bist. Erzwungene Anpassung bedeutet: Du passt dich an, um nicht ausgeschlossen zu werden. Gruppen, die dich nur mögen, wenn du jemand anderes bist, sind keine echte Heimat.'
        },
        interventionen: [
          {
            titel: 'Gruppe vs. echte Freundschaft',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wer in deinem Freundes- oder Klassenkreis akzeptiert dich so, wie du wirklich bist? Wer setzt dich unter Druck? Gemeinsam überlegen: Wo investierst du deine Zeit – und wo solltest du es mehr tun?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Authentizitäts-Momente',
            beschreibung: 'Beschreibe eine Situation, in der du vollständig du selbst warst. Wie hat sich das angefühlt? Was war anders?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Echte Verbindung suchen',
          beschreibung: 'Verbringe diese Woche Zeit mit jemandem, bei dem du dich nicht verstellen musst.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Mit wem bist du am authentischsten du selbst?'
        ]
      }
    ]
  },

  'empathie': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Schwierigkeiten beim Perspektivenwechsel, eingeschränkter sozialer Wahrnehmung oder fehlender Empathie',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Empathie?',
        dauer: '60 Min',
        ziel: 'Empathie von Mitgefühl und Projektion unterscheiden; eigene Empathiefähigkeit einschätzen',
        psychoedukation: {
          titel: 'Empathie – sich hineinversetzen ohne zu verlieren',
          inhalt: 'Empathie bedeutet, die Welt durch die Augen eines anderen zu sehen – ohne dabei die eigene Perspektive aufzugeben. Es gibt kognitive Empathie (ich verstehe, was du denkst) und emotionale Empathie (ich fühle, was du fühlst). Empathie ist erlernbar und stärkt alle sozialen Beziehungen.'
        },
        interventionen: [
          {
            titel: 'Empathie-Übung mit Figuren',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Eine kurze Geschichte oder Szene aus verschiedenen Perspektiven betrachten: Was denkt Person A? Was fühlt sie? Was braucht sie? Dann: Was denkt/fühlt/braucht Person B?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Perspektivenwechsel im Alltag',
            beschreibung: 'Denke an einen Konflikt der letzten Zeit. Beschreibe ihn aus der Sicht der anderen Person. Was könnte sie gefühlt, gedacht, gebraucht haben?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Täglicher Perspektivenwechsel',
          beschreibung: 'Wähle täglich eine Person aus deinem Umfeld und stelle dir vor: Wie war ihr Tag? Was hat sie beschäftigt?',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Wann fällt dir Empathie leicht – und wann schwer?',
          'Gibt es Menschen, für die du weniger Empathie empfindest? Warum?'
        ]
      },
      {
        nr: 2,
        titel: 'Zuhören und verstehen',
        dauer: '60 Min',
        ziel: 'Empathisches Zuhören als aktive Praxis entwickeln',
        psychoedukation: {
          titel: 'Empathisches Zuhören ist mehr als Zuhören',
          inhalt: 'Empathisch zuhören bedeutet: Nicht sofort Ratschläge geben, nicht das Gespräch auf sich lenken, nicht beurteilen. Sondern: wirklich verstehen wollen, Gefühle spiegeln, nachfragen. Die meisten Menschen wollen nicht Lösungen – sie wollen sich verstanden fühlen.'
        },
        interventionen: [
          {
            titel: 'Empathie-Antworten üben',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Jemand erzählt etwas Schwieriges. Üben: Was ist eine empathische Antwort? Was ist eine nicht-empathische Antwort? Unterschied erleben: Rat geben vs. verstehen wollen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühle benennen ohne zu urteilen',
            beschreibung: 'Übe, Gefühle anderer zu benennen ohne zu bewerten: „Es klingt, als wärst du wirklich erschöpft." – Nicht: „Du solltest mal einen Gang runterschalten."',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Empathisches Gespräch',
          beschreibung: 'Führe diese Woche ein Gespräch, in dem du bewusst empathisch zuhörst. Was war das Ergebnis?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat sich verändert, wenn du wirklich empathisch zugehört hast?',
          'Was war schwierig daran?'
        ]
      },
      {
        nr: 3,
        titel: 'Empathie in schwierigen Beziehungen',
        dauer: '60 Min',
        ziel: 'Empathie auch für Menschen einüben, mit denen man Konflikte hat',
        psychoedukation: {
          titel: 'Empathie bedeutet nicht, alles zu akzeptieren',
          inhalt: 'Empathie zu zeigen bedeutet nicht, das Verhalten einer Person gutzuheißen. Man kann jemanden verstehen und trotzdem Grenzen setzen. In Konflikten hilft Empathie, die Eskalation zu verhindern und Lösungen zu finden – nicht weil man nachgibt, sondern weil man versteht.'
        },
        interventionen: [
          {
            titel: 'Empathie für den Täter',
            ansatz: 'Narrativ / Systemisch',
            beschreibung: 'Wähle jemanden, mit dem du Schwierigkeiten hast. Versuche, dessen Perspektive zu verstehen: Was könnte seine/ihre Geschichte sein? Was braucht er/sie vielleicht? Das bedeutet nicht, das Verhalten zu entschuldigen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Empathie als Werkzeug',
            beschreibung: 'Welchen Konflikt könntest du durch mehr Empathie für die andere Seite lösen oder mildern? Was wäre ein konkreter Schritt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Empathie in Aktion',
          beschreibung: 'Zeige diese Woche jemandem gegenüber, mit dem du Spannungen hast, ein echtes Zeichen von Empathie. Was passiert?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie hat sich deine Sichtweise durch die Empathie-Übungen verändert?'
        ]
      }
    ]
  },

  'alkohol': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit riskantem Alkoholkonsum, Neugier oder familiärem Alkoholproblem',
    sitzungen: [
      {
        nr: 1,
        titel: 'Alkohol – was er wirklich macht',
        dauer: '60 Min',
        ziel: 'Faktenbasiertes Wissen über Alkohol; eigenes Konsumverhalten einschätzen',
        psychoedukation: {
          titel: 'Alkohol – Mythen und Fakten',
          inhalt: 'Alkohol ist eine psychoaktive Substanz, die das Gehirn direkt beeinflusst. Er dämpft Hemmungen, verlangsamt Reaktionen und beeinträchtigt das Urteilsvermögen. Das Jugendhirn ist bis ca. 25 Jahre im Aufbau – Alkohol schadet in dieser Phase nachweislich mehr als im Erwachsenenleben. „Soziales Trinken" ist kulturell normalisiert – das macht es nicht harmlos.'
        },
        interventionen: [
          {
            titel: 'Eigenes Konsumverhalten analysieren',
            ansatz: 'Motivational Interviewing',
            beschreibung: 'Ohne Vorwurf: Wie viel, wie oft, in welchen Situationen? Was bringt der Alkohol dir? Was kostet er? Gemeinsam eine ehrliche Bilanz ziehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Vor- und Nachteile abwägen',
            beschreibung: 'Liste die Vorteile deines Konsums auf – und die Nachteile. Was überwiegt ehrlich?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Konsumprotokoll',
          beschreibung: 'Führe diese Woche ein ehrliches Protokoll: Wann, wie viel, in welcher Situation, wie war danach.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'In welchen Situationen trinkst du – und warum gerade dann?',
          'Was wäre, wenn du es nicht tätest?'
        ]
      },
      {
        nr: 2,
        titel: 'Warum ich trinke – Motive verstehen',
        dauer: '60 Min',
        ziel: 'Hinter den Konsum liegende Bedürfnisse erkennen',
        psychoedukation: {
          titel: 'Funktionaler Konsum',
          inhalt: 'Alkohol wird oft als Lösung für etwas anderes eingesetzt: Hemmungen überwinden, Schmerz dämpfen, dazugehören, Langeweile bekämpfen. Das funktioniert kurzfristig – aber nicht nachhaltig. Wenn man versteht, welches Bedürfnis dahintersteckt, findet man bessere Wege, es zu erfüllen.'
        },
        interventionen: [
          {
            titel: 'Motiv-Analyse',
            ansatz: 'Motivational Interviewing',
            beschreibung: 'Warum trinkst du? Gemeinsam die tiefer liegenden Motive herausarbeiten: Angst, Einsamkeit, Neugier, sozialer Druck, Entspannung. Für jedes Motiv: Gibt es einen gesünderen Weg, dieses Bedürfnis zu erfüllen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Alternativen entwickeln',
            beschreibung: 'Wähle das wichtigste Motiv. Brainstorme 5 alternative Wege, dieses Bedürfnis ohne Alkohol zu erfüllen.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Alternative ausprobieren',
          beschreibung: 'Wenn du diese Woche in einer Situation bist, in der du normalerweise trinken würdest – probiere eine Alternative.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was steckt wirklich hinter deinem Konsum?',
          'Was brauchst du eigentlich?'
        ]
      },
      {
        nr: 3,
        titel: 'Risiken kennen – Grenzen setzen',
        dauer: '60 Min',
        ziel: 'Persönliche Grenzen für den Konsum entwickeln',
        psychoedukation: {
          titel: 'Risikokonsum erkennen',
          inhalt: 'Zeichen, dass Alkohol problematisch wird: Konsum alleine, um Gefühle zu dämpfen; Kontrollverlust über die Menge; Konsequenzen (Schule, Beziehungen) werden ignoriert; Gedanken an Alkohol nehmen zu. Diese Zeichen ernst nehmen ist keine Schwäche – es ist klug.'
        },
        interventionen: [
          {
            titel: 'Persönliche Grenzen definieren',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was sind deine persönlichen Grenzen beim Alkoholkonsum? In welchen Situationen sagst du Nein? Gemeinsam konkrete, realistische Grenzen formulieren.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ablehnungsstrategien üben',
            beschreibung: 'Rollenspiel: Jemand bietet dir Alkohol an – du möchtest ablehnen. Verschiedene Formulierungen üben: direkt, humorvoll, ohne Erklärung.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Grenzen einhalten',
          beschreibung: 'Wende diese Woche deine selbstdefinierten Grenzen in einer konkreten Situation an.',
          dauer: '15 Min'
        },
        reflexion: [
          'Welche Grenze ist die wichtigste für dich?',
          'Wann fällt es besonders schwer, diese Grenze einzuhalten?'
        ]
      },
      {
        nr: 4,
        titel: 'Veränderung – wenn nötig',
        dauer: '60 Min',
        ziel: 'Motivation zur Veränderung stärken; Unterstützungsmöglichkeiten kennen',
        psychoedukation: {
          titel: 'Veränderung ist ein Prozess',
          inhalt: 'Wer seinen Konsum reduzieren oder beenden möchte, braucht keinen Willensakt – sondern einen Plan, Unterstützung und Geduld. Rückschritte sind Teil des Prozesses. Professionelle Hilfe zu suchen ist kein Scheitern – es ist der klügste Schritt.'
        },
        interventionen: [
          {
            titel: 'Veränderungsplan',
            ansatz: 'Motivational Interviewing / Lösungsfokussiert',
            beschreibung: 'Möchtest du etwas ändern? Was genau? Welche konkreten Schritte sind realistisch? Welche Unterstützung brauchst du? Welche Hindernisse könnten auftauchen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Hilfsangebote kennenlernen',
            beschreibung: 'Welche Anlaufstellen gibt es? (Suchtberatung, Schulpsychologie, Jugendberatung). Schreibe eine konkrete Kontaktmöglichkeit auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt gehen',
          beschreibung: 'Setze diese Woche einen konkreten ersten Schritt aus deinem Veränderungsplan um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen Schritt möchtest du als nächstes gehen?'
        ]
      }
    ]
  },

  'cannabis': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Schüler mit Cannabiskonsum oder -interesse; auch bei anderen illegalen Substanzen anwendbar',
    sitzungen: [
      {
        nr: 1,
        titel: 'Cannabis – was stimmt, was nicht?',
        dauer: '60 Min',
        ziel: 'Faktenbasiertes Wissen; Mythen über Cannabis entkräften',
        psychoedukation: {
          titel: 'Was Cannabis wirklich macht',
          inhalt: 'Cannabis gilt als „weich" und „harmlos" – das stimmt nicht vollständig. THC (der psychoaktive Wirkstoff) verändert Gedächtnis, Konzentration und Stimmung. Bei regelmäßigem Konsum im Jugendalter steigt das Risiko für psychische Erkrankungen (u.a. Psychosen), Gedächtnisprobleme und Motivationseinbußen deutlich. Das Gehirn reagiert auf Cannabis empfindlicher als das Erwachsenengehirn.'
        },
        interventionen: [
          {
            titel: 'Mythen und Fakten sortieren',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Häufige Aussagen über Cannabis gemeinsam prüfen: „Cannabis macht nicht abhängig" (falsch), „Cannabis ist natürlich, also sicher" (falsch), „Cannabis hilft bei Angst" (kurzfristig manchmal, langfristig riskant). Ehrlicher Austausch ohne Moralisieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Persönliche Bilanz',
            beschreibung: 'Was bringt dir Cannabis? Was kostet es dich? (Schule, Geld, Stimmung, Beziehungen, Pläne).',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Konsumprotokoll',
          beschreibung: 'Wenn du Konsumierst: Führe diese Woche ein ehrliches Protokoll. Wenn nicht: Notiere, wann du daran gedacht hast und warum.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was glaubst du selbst über Cannabis – und was hast du heute dazugelernt?',
          'Inwiefern beeinflusst dein Konsum deinen Alltag?'
        ]
      },
      {
        nr: 2,
        titel: 'Motive und Bedürfnisse',
        dauer: '60 Min',
        ziel: 'Hinter den Konsum liegende Bedürfnisse herausarbeiten',
        psychoedukation: {
          titel: 'Selbstmedikation mit Cannabis',
          inhalt: 'Viele Jugendliche nutzen Cannabis zur Selbstmedikation: gegen Angst, Schlafprobleme, sozialen Druck, ADHS-Symptome oder Schmerzen. Das ist verständlich – aber problematisch, weil Cannabis die Ursachen nicht löst und die Toleranz schnell steigt.'
        },
        interventionen: [
          {
            titel: 'Selbstmedikations-Analyse',
            ansatz: 'Motivational Interviewing',
            beschreibung: 'Wann und warum konsumierst du genau? Was spürst du vorher, was danach? Welches Bedürfnis erfüllt der Konsum? Für jedes Bedürfnis: Was wäre eine gesündere Alternative?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Alternative Copingstrategien',
            beschreibung: 'Wähle das wichtigste Motiv. Brainstorme 5 Alternativen. Bewerte: Welche wäre realistisch umsetzbar?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Alternative testen',
          beschreibung: 'Teste diese Woche eine Alternative für eine Situation, in der du normalerweise konsumieren würdest.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was brauchst du wirklich – und was gibt dir Cannabis stattdessen?',
          'Was verlierst du durch den Konsum?'
        ]
      },
      {
        nr: 3,
        titel: 'Risiken und Abhängigkeit erkennen',
        dauer: '60 Min',
        ziel: 'Abhängigkeitspotenzial einschätzen; Warnsignale kennen',
        psychoedukation: {
          titel: 'Cannabis-Abhängigkeit ist real',
          inhalt: 'Ca. 10% der Konsumenten entwickeln eine Abhängigkeit – bei Tagesbenutzern steigt die Rate auf ca. 25%. Zeichen: Konsum zur Normalisierung des Alltags nötig, Gereiztheit/Schlafprobleme ohne Cannabis, Konsum trotz negativer Konsequenzen, gedankliche Fixierung.'
        },
        interventionen: [
          {
            titel: 'Abhängigkeits-Check',
            ansatz: 'Psychoedukativ / Lösungsfokussiert',
            beschreibung: 'Gemeinsam die Zeichen einer Abhängigkeit prüfen: Trifft etwas davon zu? Ohne Vorwurf – mit dem Ziel, die Situation realistisch einzuschätzen.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Konsum-Pause planen',
            beschreibung: 'Bist du bereit, eine kurze Pause zu machen – z.B. 3 Tage? Was würde das für dich bedeuten? Was wäre schwierig?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Pause versuchen',
          beschreibung: 'Versuche diese Woche eine kurze Pause (1–3 Tage). Was passiert? Was fällt auf?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was sagen dir die Zeichen?',
          'Was würde eine Veränderung für dein Leben bedeuten?'
        ]
      },
      {
        nr: 4,
        titel: 'Veränderungspfad entwickeln',
        dauer: '60 Min',
        ziel: 'Konkrete Schritte zur Reduktion oder zum Ausstieg; Unterstützung aktivieren',
        psychoedukation: {
          titel: 'Ausstieg braucht einen Plan',
          inhalt: 'Eine Veränderung beim Substanzkonsum ist selten ein einmaliger Entschluss. Sie erfordert: Verstehen der eigenen Motive, Aufbau alternativer Strategien, Unterstützung und Umgang mit Rückfällen. Rückfall bedeutet nicht Versagen – er ist Teil des Prozesses.'
        },
        interventionen: [
          {
            titel: 'Veränderungsplan konkretisieren',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was möchtest du ändern? Konsum reduzieren, kontrollieren, beenden? Welche Schritte sind realistisch? Welche Hindernisse kennst du schon? Wer kann unterstützen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Unterstützungsnetz kartieren',
            beschreibung: 'Wer in deinem Umfeld unterstützt deine Veränderung? Wer könnte sie erschweren? Wie gehst du mit letzterem um?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Schritt umsetzen',
          beschreibung: 'Setze diese Woche den ersten konkreten Schritt deines Plans um. Notiere, wie es war.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen ersten Schritt gehst du?'
        ]
      }
    ]
  },

  'tabak-ezigarette': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Tabak- oder E-Zigaretten-Konsum oder Ausstiegswunsch',
    sitzungen: [
      {
        nr: 1,
        titel: 'Nikotin – mehr als Gewohnheit',
        dauer: '60 Min',
        ziel: 'Nikotinabhängigkeit und eigenes Rauchverhalten verstehen',
        psychoedukation: {
          titel: 'Wie Nikotin süchtig macht',
          inhalt: 'Nikotin ist eine der am stärksten suchtmachenden Substanzen. Es setzt Dopamin frei und erzeugt schnell körperliche Abhängigkeit. E-Zigaretten werden oft als „harmlos" vermarktet – enthalten aber Nikotin und andere Chemikalien. Jugendliche werden schneller abhängig als Erwachsene.'
        },
        interventionen: [
          {
            titel: 'Rauchprofil erstellen',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Wie viel, wann, in welchen Situationen? Was löst den Griff zur Zigarette aus? Stress, Langeweile, soziale Situationen? Gemeinsam ein ehrliches Profil erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Kosten-Nutzen-Analyse',
            beschreibung: 'Was kostet dich das Rauchen – finanziell, gesundheitlich, sozial? Was bringt es dir? Ehrliche Bilanz.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Rauchertagebuch',
          beschreibung: 'Eine Woche lang notieren: Wann, wie viele, in welcher Situation, was war vorher.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Wann greifst du am häufigsten zur Zigarette?',
          'Was würde sich ändern, wenn du aufhören würdest?'
        ]
      },
      {
        nr: 2,
        titel: 'Ausstiegsmotivation stärken',
        dauer: '60 Min',
        ziel: 'Persönliche Gründe für den Ausstieg herausarbeiten; Ambivalenz überwinden',
        psychoedukation: {
          titel: 'Warum Aufhören schwer ist',
          inhalt: 'Aufhören zu rauchen hat zwei Seiten: körperliche Entzugssymptome (Unruhe, Reizbarkeit, Konzentrationsprobleme – dauern ca. 2–4 Wochen) und psychische Gewohnheit (Rituale, Pausen, Hände beschäftigen). Beide lassen sich mit Strategien überwinden.'
        },
        interventionen: [
          {
            titel: 'Motivationskompass',
            ansatz: 'Motivational Interviewing',
            beschreibung: 'Was wären die wichtigsten Gründe, aufzuhören? Gesundheit, Geld, Sport, Geruch, Vorbild sein? Diese Gründe konkret und persönlich formulieren – nicht abstrakt.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Zukunftsvision',
            beschreibung: 'Stelle dir vor, du rauchst seit einem Jahr nicht mehr. Was ist besser? Was hast du gewonnen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Motivationskarte schreiben',
          beschreibung: 'Schreibe deine 3 wichtigsten Ausstiegsgründe auf eine Karte – die du griffbereit hast.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was ist dein persönlichster Grund aufzuhören?',
          'Was hält dich noch davon ab?'
        ]
      },
      {
        nr: 3,
        titel: 'Ausstiegsplan und Strategien',
        dauer: '60 Min',
        ziel: 'Konkreten Ausstiegsplan erstellen; Alternativen für Auslöser entwickeln',
        psychoedukation: {
          titel: 'Ausstieg strukturieren',
          inhalt: 'Erfolgreiches Aufhören braucht drei Dinge: einen konkreten Ausstiegstermin, Alternativen für die häufigsten Auslöser, und Unterstützung. Viele schaffen es beim dritten oder vierten Versuch – Rückfälle sind normal.'
        },
        interventionen: [
          {
            titel: 'Ausstiegsplan erstellen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam: Ausstiegsdatum festlegen, Strategien für die wichtigsten Auslöser, Umgang mit Entzugssymptomen, Wer unterstützt mich? Hilfsangebote besprechen (Rauchtelefon, Apps, Nikotinersatz).',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Alternativen für Auslöser',
            beschreibung: 'Für deine 3 häufigsten Auslöser: Was tue ich stattdessen? (z.B. bei Stress → Atemübung; bei Pause → Tee trinken; bei Langeweile → kurz rausgehen)',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Plan umsetzen',
          beschreibung: 'Starte deinen Ausstiegsplan – oder reduziere zumindest um 50% diese Woche.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie zuversichtlich bist du auf einer Skala von 1–10?'
        ]
      }
    ]
  },

  'gaming': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit exzessivem Gaming, Schlaf-/Schulproblemen durch Gaming oder Kontrollverlust',
    sitzungen: [
      {
        nr: 1,
        titel: 'Gaming – Hobby oder Sucht?',
        dauer: '60 Min',
        ziel: 'Eigenes Spielverhalten ehrlich einschätzen',
        psychoedukation: {
          titel: 'Wenn Gaming zum Problem wird',
          inhalt: 'Gaming ist nicht per se problematisch. Problematisch wird es, wenn: wichtige Lebensbereiche (Schule, Schlaf, Beziehungen) leiden, das Spielen nicht mehr gestoppt werden kann, Entzug zu Gereiztheit oder Angst führt oder Gaming als einzige Möglichkeit gilt, sich gut zu fühlen. Das nennt sich Gaming Disorder (WHO-anerkannte Diagnose).'
        },
        interventionen: [
          {
            titel: 'Gaming-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Wie viele Stunden pro Tag/Woche? Wann – nachts, statt Hausaufgaben, statt sozialer Kontakte? Was passiert, wenn du nicht spielen kannst? Gemeinsam die Auswirkungen auf alle Lebensbereiche einschätzen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Lebensbereiche-Check',
            beschreibung: 'Bewerte auf einer Skala 1–10: Schule, Schlaf, Freundschaften, Familie, Körper. Was hat sich durch Gaming verändert?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gaming-Protokoll',
          beschreibung: 'Eine Woche lang ehrlich aufschreiben: Spielstunden pro Tag, was darunter leidet, wie du dich dabei fühlst.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was gibt dir Gaming, das du anderswo nicht findest?',
          'Was verlierst du durch das übermäßige Spielen?'
        ]
      },
      {
        nr: 2,
        titel: 'Bedürfnisse hinter dem Gaming',
        dauer: '60 Min',
        ziel: 'Psychologische Bedürfnisse, die Gaming erfüllt, verstehen und Alternativen entwickeln',
        psychoedukation: {
          titel: 'Warum Gaming so anziehend ist',
          inhalt: 'Games erfüllen grundlegende psychologische Bedürfnisse: Kompetenz (Fortschritt, Level-ups), Zugehörigkeit (Online-Gemeinschaften), Kontrolle (in der Spielwelt bin ich erfolgreich). Wenn diese Bedürfnisse im realen Leben unerfüllt sind, wird Gaming umso attraktiver.'
        },
        interventionen: [
          {
            titel: 'Bedürfnis-Analyse',
            ansatz: 'Motivational Interviewing',
            beschreibung: 'Welches Bedürfnis erfüllt Gaming für dich am stärksten? Kompetenz, Zugehörigkeit, Kontrolle, Eskapismus? Wie könnte dieses Bedürfnis im Alltag besser erfüllt werden?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Reale Alternativen brainstormen',
            beschreibung: 'Finde für dein wichtigstes Bedürfnis 3 reale Alternativen. Was wäre machbar?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Alternative ausprobieren',
          beschreibung: 'Ersetze diese Woche einmal eine Gaming-Einheit durch eine reale Alternative.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was hat die Alternative dir gegeben?',
          'Was gefehlt im Vergleich zum Gaming?'
        ]
      },
      {
        nr: 3,
        titel: 'Grenzen setzen und Balance finden',
        dauer: '60 Min',
        ziel: 'Konkrete Kontrollstrategien entwickeln; gesunde Balance herstellen',
        psychoedukation: {
          titel: 'Kontrolliertes Gaming lernen',
          inhalt: 'Das Ziel ist meist nicht totales Aufhören, sondern eine gesunde Balance. Strategien dafür: feste Zeiten statt unbegrenzt, Gaming nie auf Kosten von Schlaf oder Schule, andere Aktivitäten aktiv einplanen.'
        },
        interventionen: [
          {
            titel: 'Gaming-Balance-Plan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen realistischen Plan entwickeln: Maximale Spielzeit pro Tag, welche Zeiten sind tabu (nach 22 Uhr, vor Hausaufgaben), welche Aktivitäten werden aufgebaut.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wochenplan erstellen',
            beschreibung: 'Erstelle einen Wochenplan, der Gaming, Schule, Schlaf, Sport und soziale Kontakte ausbalanciert.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Plan durchhalten',
          beschreibung: 'Halte dich diese Woche an deinen Plan. Notiere am Ende: Was hat geklappt, was nicht?',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was ist dein wichtigster Schritt zur Balance?'
        ]
      }
    ]
  },

  'social-media': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Social-Media-Übernutzung, Vergleichsproblematik, FOMO oder Cybermobbing-Erfahrungen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Social Media – Fluch und Segen',
        dauer: '60 Min',
        ziel: 'Eigenes Nutzungsverhalten einschätzen; Mechanismen der Plattformen verstehen',
        psychoedukation: {
          titel: 'Wie Social Media das Gehirn manipuliert',
          inhalt: 'Social-Media-Plattformen sind designed, um maximale Aufmerksamkeit zu erzeugen: unendlicher Scroll, variable Belohnungen (Likes), FOMO. Das Gehirn schüttet bei Likes Dopamin aus – und verlangt nach mehr. Das ist keine Schwäche – es ist das Design.'
        },
        interventionen: [
          {
            titel: 'Nutzungsanalyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Wie viele Stunden pro Tag? Welche Plattformen? Wie fühlst du dich danach – besser oder schlechter? Was löst das Öffnen der App aus?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Social-Media-Audit',
            beschreibung: 'Gehe deine Accounts durch: Welche Accounts machen dir Freude? Welche machen dich unruhig oder traurig? Was kannst du entweder abbestellen oder mehr sehen?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Bildschirmzeit messen',
          beschreibung: 'Schau dir diese Woche deine tägliche Bildschirmzeit pro App an und notiere es.',
          dauer: 'täglich 2 Min'
        },
        reflexion: [
          'Wie fühlst du dich typischerweise nach einer langen Social-Media-Session?',
          'Welche App macht dich am unzufriedensten?'
        ]
      },
      {
        nr: 2,
        titel: 'Vergleiche und FOMO verstehen',
        dauer: '60 Min',
        ziel: 'Sozialen Vergleich und Fear of Missing Out (FOMO) erkennen und relativieren',
        psychoedukation: {
          titel: 'Instagram-Leben vs. echtes Leben',
          inhalt: 'Was auf Social Media gezeigt wird, ist eine Highlights-Sammlung – keine Realität. Trotzdem vergleichen wir unser Innenleben mit dem Außenleben anderer. Das macht uns unzufriedener. FOMO (Fear of Missing Out) entsteht durch das Gefühl, dass alle anderen mehr Spaß haben – was eine Illusion ist.'
        },
        interventionen: [
          {
            titel: 'Vergleichs-Falle erkennen',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Welche Accounts oder Inhalte lösen Neid, Unzufriedenheit oder FOMO aus? Gemeinsam hinterfragen: Was sehen wir wirklich? Was wird versteckt? Was wäre das echte Bild?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Mein echtes Highlights-Reel',
            beschreibung: 'Was wäre in deinem Leben, wenn du nur deine echten guten Momente zeigen würdest – auch die kleinen? Schreibe 5 auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Digital Detox',
          beschreibung: 'Lege einen Tag oder Abend diese Woche ohne Social Media ein. Was passiert? Was vermisst du – und was nicht?',
          dauer: 'ein ganzer Abend'
        },
        reflexion: [
          'Wessen Leben auf Social Media machst du dich unglücklich?',
          'Was wäre, wenn du diesen Account nicht mehr folgst?'
        ]
      },
      {
        nr: 3,
        titel: 'Gesunde digitale Gewohnheiten entwickeln',
        dauer: '60 Min',
        ziel: 'Konkrete Strategien für einen bewussteren Umgang mit Social Media',
        psychoedukation: {
          titel: 'Digital Wellbeing',
          inhalt: 'Es geht nicht darum, Social Media aufzugeben – sondern es bewusst und selektiv zu nutzen. Strategien: Benachrichtigungen abschalten, feste Offline-Zeiten, Apps nach Wohlbefinden kuratieren, Social Media nicht als erstes und letztes des Tages.'
        },
        interventionen: [
          {
            titel: 'Persönliche Digital-Regeln',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam 5 konkrete persönliche Regeln entwickeln, die realistisch und umsetzbar sind (z.B. kein Handy im Bett, 30 Min Limit pro Tag für TikTok).',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Offline-Aktivitäten stärken',
            beschreibung: 'Was tätest du mit der Zeit, die du täglich für Social Media aufwendest? Erstelle eine Liste von 5 Alternativen.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Regeln eine Woche testen',
          beschreibung: 'Teste deine 5 Regeln eine Woche lang. Was klappt, was ist zu streng, was zu locker?',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Regel möchtest du dauerhaft beibehalten?'
        ]
      }
    ]
  },

  'gluecksspiel': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Wett- oder Glücksspielverhalten, Loot-Box-Problematik oder Spielschulden',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie Glücksspiel funktioniert',
        dauer: '60 Min',
        ziel: 'Mechanismen von Glücksspiel und Manipulation verstehen',
        psychoedukation: {
          titel: 'Das Haus gewinnt immer',
          inhalt: 'Glücksspiel ist darauf ausgelegt, Geld zu nehmen – nicht zu geben. Variable Belohnungen (manchmal gewinnen, oft verlieren) sind die stärkste bekannte Form der Konditionierung. Fast-Wins (knapp daneben) sind bewusst eingebaut, um weiterzuspielen. Wetten und Loot Boxes folgen denselben Prinzipien.'
        },
        interventionen: [
          {
            titel: 'Spielverhalten analysieren',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Was spielst du? Wie viel Geld und Zeit? Was passiert, wenn du verlierst – spielst du mehr, um den Verlust auszugleichen? Gemeinsam die echten Kosten berechnen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Echte Kosten berechnen',
            beschreibung: 'Berechne, wie viel du in den letzten 3 Monaten für Glücksspiel, Wetten oder Loot Boxes ausgegeben hast. Was hättest du damit kaufen können?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Protokoll führen',
          beschreibung: 'Protokolliere diese Woche: Wie oft, wie lange, wie viel Geld.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was erwartest du jedes Mal, wenn du spielst?',
          'Was passiert tatsächlich?'
        ]
      },
      {
        nr: 2,
        titel: 'Motive und Kontrolle',
        dauer: '60 Min',
        ziel: 'Auslöser und Motive verstehen; Kontrollverlust erkennen',
        psychoedukation: {
          titel: 'Wenn das Spielen die Kontrolle übernimmt',
          inhalt: 'Zeichen für problematisches Glücksspiel: Weiterspielen trotz Verlusten, Lügen über den Konsum, mit gestohlenen oder geborgten Geld spielen, Schule und Beziehungen leiden, gedankliche Fixierung auf das nächste Spiel.'
        },
        interventionen: [
          {
            titel: 'Auslöser-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Wann spielst du? Langeweile, Stress, nach Verlusten, mit Freunden? Für jeden Auslöser: Was wäre eine Alternative?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Stop-Strategien',
            beschreibung: 'Formuliere 3 konkrete Strategien, um das Spielen zu stoppen, wenn du merkst, dass du die Kontrolle verlierst.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stop-Strategie anwenden',
          beschreibung: 'Wende diese Woche eine Stop-Strategie an, wenn der Drang zum Spielen kommt.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann verlierst du die Kontrolle am ehesten?',
          'Was hilft dir, aufzuhören?'
        ]
      },
      {
        nr: 3,
        titel: 'Ausstieg und Unterstützung',
        dauer: '60 Min',
        ziel: 'Konkrete Schritte zur Reduktion oder zum Ausstieg',
        psychoedukation: {
          titel: 'Spielsucht ist behandelbar',
          inhalt: 'Spielsucht ist eine anerkannte psychische Erkrankung – und sie ist behandelbar. Professionelle Hilfe zu suchen ist kein Zeichen von Schwäche. Hilfsangebote: Suchtberatungsstellen, Selbsthilfegruppen, Online-Beratung. Erste Schritte: Zugang zum Spielen einschränken, Schulden transparent machen, Unterstützung aktivieren.'
        },
        interventionen: [
          {
            titel: 'Ausstiegsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was ist der erste Schritt? Apps löschen, Kreditkarte weggeben, jemandem vertrauen, Beratungsstelle aufsuchen? Gemeinsam konkrete Schritte formulieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Hilfsangebote kennen',
            beschreibung: 'Recherchiere eine konkrete Anlaufstelle (Jugendberatung, Suchtberatung). Schreibe Kontaktdaten auf.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt gehen',
          beschreibung: 'Setze diese Woche einen konkreten ersten Schritt um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen ersten Schritt gehst du?'
        ]
      }
    ]
  },

  'selbstmedikation': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit missbräuchlichem Medikamentenkonsum (Schlafmittel, Schmerzmittel, ADHS-Medikamente)',
    sitzungen: [
      {
        nr: 1,
        titel: 'Medikamente – was ich darüber wissen muss',
        dauer: '60 Min',
        ziel: 'Grundwissen über Medikamentenmissbrauch; eigenes Verhalten einschätzen',
        psychoedukation: {
          titel: 'Wenn Medikamente zum Problem werden',
          inhalt: 'Medikamente, die verschrieben oder freiverkäuflich erhältlich sind, können missbraucht werden: zur Stimmungsaufhellung, zum Schlafen oder Wachbleiben, zur Leistungssteigerung. Was legal ist, ist nicht automatisch ungefährlich. Abhängigkeit kann auch ohne illegale Substanzen entstehen.'
        },
        interventionen: [
          {
            titel: 'Ehrliche Nutzungsanalyse',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Was nimmst du, wann, wie oft? Wurden diese Medikamente verschrieben? Nimmst du mehr als vorgeschrieben? Warum? Ohne Vorwurf – mit dem Ziel, die Situation zu verstehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Risiko einschätzen',
            beschreibung: 'Für jedes Medikament: Was sind die Risiken bei Missbrauch? Was passiert langfristig? Recherchiere gemeinsam.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ehrliches Protokoll',
          beschreibung: 'Diese Woche: Jede Einnahme notieren, die nicht strikt nach Anweisung war.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was erhoffst du dir von den Medikamenten?',
          'Was würde ohne sie passieren?'
        ]
      },
      {
        nr: 2,
        titel: 'Was ich wirklich brauche',
        dauer: '60 Min',
        ziel: 'Bedürfnisse hinter der Selbstmedikation erkennen; gesündere Strategien entwickeln',
        psychoedukation: {
          titel: 'Selbstmedikation als Symptom',
          inhalt: 'Selbstmedikation ist oft ein Zeichen dafür, dass etwas anderes nicht stimmt: unbehandelte Angst, Schlafstörungen, Schmerzen, ADHS oder Depressionen. Die eigentliche Ursache zu behandeln – durch professionelle Hilfe – ist nachhaltiger als Selbstmedikation.'
        },
        interventionen: [
          {
            titel: 'Grundproblem identifizieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was versuchst du mit den Medikamenten zu lösen? Schlaf, Schmerz, Angst, Konzentration, Stimmung? Welche professionelle Unterstützung könnte das Grundproblem angehen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Alternative Strategien',
            beschreibung: 'Was könntest du statt der Selbstmedikation tun? Für Schlaf, Schmerz oder Stress alternative Strategien erarbeiten.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Alternative ausprobieren',
          beschreibung: 'Versuche diese Woche einmal eine Alternative statt der Selbstmedikation.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was ist das eigentliche Problem, das du lösen möchtest?',
          'Wer könnte dir dabei helfen?'
        ]
      },
      {
        nr: 3,
        titel: 'Hilfe suchen und Veränderung planen',
        dauer: '60 Min',
        ziel: 'Professionelle Unterstützung aktivieren; konkreten Veränderungsplan erstellen',
        psychoedukation: {
          titel: 'Wenn Selbsthilfe nicht reicht',
          inhalt: 'Medikamentenmissbrauch erfordert oft professionelle Unterstützung – vom Arzt, Schulpsychologen oder einer Beratungsstelle. Das ist keine Schwäche. Je früher man Hilfe sucht, desto leichter die Veränderung.'
        },
        interventionen: [
          {
            titel: 'Veränderungsplan mit Unterstützung',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was möchtest du ändern? Welche professionelle Unterstützung brauchst du? Welche Schritte sind realistisch? Gemeinsam konkret planen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Arztgespräch vorbereiten',
            beschreibung: 'Wenn ein Arztbesuch sinnvoll ist: Was möchtest du sagen? Notiere die wichtigsten Punkte.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt gehen',
          beschreibung: 'Einen konkreten ersten Schritt aus dem Plan umsetzen.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen Schritt möchtest du als nächstes gehen?'
        ]
      }
    ]
  },

  'schulisches-engagement': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Motivationsproblemen, häufigen Fehlzeiten oder geringer schulischer Beteiligung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Warum gehe ich – oder warum nicht – zur Schule?',
        dauer: '60 Min',
        ziel: 'Eigene Einstellung zur Schule und Hindernisse verstehen',
        psychoedukation: {
          titel: 'Schule und Selbstwirksamkeit',
          inhalt: 'Schulisches Engagement hängt stark davon ab, ob man das Gefühl hat, dass eigene Anstrengung etwas bewirkt. Wer wiederholt gescheitert ist oder sich ungesehen fühlt, zieht sich zurück. Das Wiederentdecken kleiner Erfolge ist der erste Schritt zur Neuorientierung.'
        },
        interventionen: [
          {
            titel: 'Schulmotivations-Interview',
            ansatz: 'Motivational Interviewing',
            beschreibung: 'Was läuft in der Schule gut? Was ist schwierig? Was bräuchte es, damit Schule sich anders anfühlt? Keine Bewertung – echtes Zuhören und gemeinsames Verstehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schulische Stärken finden',
            beschreibung: 'Was kannst du in der Schule gut – auch wenn es klein ist? Liste 5 Dinge auf, auf die du stolz sein kannst.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtungsauftrag',
          beschreibung: 'Beobachte diese Woche: Wann in der Schule fühlst du dich am wenigsten schlecht? Was ist in diesen Momenten anders?',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was war mal gut an der Schule – auch wenn es lange her ist?',
          'Was müsste sich ändern, damit du lieber zur Schule gehst?'
        ]
      },
      {
        nr: 2,
        titel: 'Hindernisse für den Schulbesuch',
        dauer: '60 Min',
        ziel: 'Konkrete Barrieren für Fehlzeiten oder Passivität identifizieren und angehen',
        psychoedukation: {
          titel: 'Schulvermeidung hat Gründe',
          inhalt: 'Fehlzeiten entstehen selten aus reiner Faulheit. Häufige Ursachen: Angst (soziale Angst, Prüfungsangst), Mobbing, familiäre Belastungen, unerkannte Lernprobleme, psychische Erkrankungen. Diese Ursachen zu kennen ist der erste Schritt zur Lösung.'
        },
        interventionen: [
          {
            titel: 'Barrieren-Analyse',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was hindert dich konkret, regelmäßig zur Schule zu gehen oder mitzumachen? Für jedes Hindernis: Was wäre ein erster kleiner Schritt, der es leichter macht?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schrittplan entwickeln',
            beschreibung: 'Entwickle einen Stufenplan: Was ist der kleinste mögliche erste Schritt? Was ist der nächste? Nicht perfekt – aber machbar.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt umsetzen',
          beschreibung: 'Setze diese Woche den ersten Schritt deines Plans um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was war das Schwierigste am ersten Schritt?',
          'Was hat geholfen?'
        ]
      },
      {
        nr: 3,
        titel: 'Schule als Ressource nutzen',
        dauer: '60 Min',
        ziel: 'Schule als Ort für persönliche Entwicklung neu entdecken',
        psychoedukation: {
          titel: 'Schule und Lebenschancen',
          inhalt: 'Schule ist kein Selbstzweck – sie eröffnet Türen: für Berufsfelder, soziale Kontakte, Fähigkeiten und Selbstvertrauen. Wer die Verbindung zwischen Schule und seinen eigenen Zielen erkennt, findet leichter Motivation.'
        },
        interventionen: [
          {
            titel: 'Verbindung zu Zielen herstellen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was sind deine Ziele für die Zukunft? Welche schulischen Schritte führen dahin? Wie könnte Schule dir helfen, diese Ziele zu erreichen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Unterstützungspersonen in der Schule',
            beschreibung: 'Wer in der Schule könnte dir helfen – Lehrer, Schulberater, Mitschüler? Wen könntest du ansprechen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Unterstützung aktivieren',
          beschreibung: 'Wende dich diese Woche an eine Person in der Schule, die dir helfen kann.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welchen Schritt möchtest du als nächstes gehen?'
        ]
      }
    ]
  },

  'lernstrategien': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit schlechter Lernorganisation, Prokrastination oder ineffektivem Lernen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie lerne ich – und wie lerne ich besser?',
        dauer: '60 Min',
        ziel: 'Eigene Lernstärken und -schwächen erkennen; effektive Methoden kennenlernen',
        psychoedukation: {
          titel: 'Wie das Gehirn lernt',
          inhalt: 'Lernen ist kein passives Aufnehmen – es ist aktives Verarbeiten. Das Gehirn speichert besser, wenn man Stoff erklärt, anwendet und in Abständen wiederholt. Passives Lesen oder Abschreiben ist ineffizient. Effektives Lernen braucht Pausen, Schlaf und Aktivierung – nicht Menge.'
        },
        interventionen: [
          {
            titel: 'Lerntypanalyse',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was funktioniert für dich beim Lernen? (Visuell, auditiv, kinästhetisch). Wann und wo lernst du am besten? Was stört? Eigenes Lernprofil erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Effektive Methoden ausprobieren',
            beschreibung: 'Lerne 10 Minuten lang einen Stoff mit der Methode des Erklärens: Erkläre dir selbst laut, als ob du jemand anderem erklärst. Wie war es?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Lernprotokoll',
          beschreibung: 'Diese Woche: Notiere täglich, wie lange und wie du gelernt hast – und wie effektiv es war.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was funktioniert bei dir am besten?',
          'Was sabotiert dein Lernen am häufigsten?'
        ]
      },
      {
        nr: 2,
        titel: 'Prokrastination überwinden',
        dauer: '60 Min',
        ziel: 'Ursachen von Aufschieberitis verstehen; konkrete Strategien entwickeln',
        psychoedukation: {
          titel: 'Prokrastination ist kein Charakterfehler',
          inhalt: 'Prokrastination entsteht oft aus Angst vor Versagen, Überforderung oder fehlender Selbstwirksamkeit – nicht aus Faulheit. Das Gehirn sucht kurzfristige Erleichterung, auch wenn langfristig der Stress steigt. Strategien: Aufgaben verkleinern, Anfangen ohne fertig werden zu müssen, Belohnungen planen.'
        },
        interventionen: [
          {
            titel: 'Prokrastinations-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Welche Aufgaben schiebst du am liebsten auf? Was steckt dahinter: Angst, Überforderung, Desinteresse? Für jede: Was wäre der kleinste mögliche erste Schritt?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: '2-Minuten-Regel',
            beschreibung: 'Alles, was weniger als 2 Minuten dauert: sofort erledigen. Alles andere: in 10-Minuten-Blöcke aufteilen. Probiere es jetzt mit einer konkreten Aufgabe.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eine aufgeschobene Aufgabe erledigen',
          beschreibung: 'Wähle diese Woche eine Aufgabe, die du lange aufgeschoben hast. Starte mit 10 Minuten.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hat dir beim Starten geholfen?',
          'Was war das Schwierigste?'
        ]
      },
      {
        nr: 3,
        titel: 'Lernroutinen aufbauen',
        dauer: '60 Min',
        ziel: 'Nachhaltige Lerngewohnheiten entwickeln und verankern',
        psychoedukation: {
          titel: 'Gewohnheiten brauchen Wiederholung',
          inhalt: 'Gute Lerngewohnheiten entstehen nicht durch Willenskraft – sondern durch Struktur und Wiederholung. Die Cue-Routine-Reward-Schleife: Ein Auslöser (Cue) aktiviert eine Routine, die durch eine Belohnung verstärkt wird. Wenn man das bewusst gestaltet, werden gute Gewohnheiten automatisch.'
        },
        interventionen: [
          {
            titel: 'Persönlicher Lernplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen realistischen Wochenplan mit festen Lernzeiten erstellen. Nicht perfekt – aber konsistent. Cue und Belohnung definieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Lernumgebung optimieren',
            beschreibung: 'Was braucht dein idealer Lernplatz? Ruhe, Ordnung, bestimmte Musik? Gestalte ihn so.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Lernplan eine Woche testen',
          beschreibung: 'Teste deinen Plan eine Woche. Was klappt? Was muss angepasst werden?',
          dauer: 'täglich 30–60 Min Lernzeit'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche eine Lerngewohnheit möchtest du dauerhaft aufbauen?'
        ]
      }
    ]
  },

  'schulkonflikt': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Konflikten mit Lehrern oder Mitschülern, Disziplinproblemen oder Schulausschluss-Risiko',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Konflikte in der Schule verstehen',
        dauer: '60 Min',
        ziel: 'Wiederkehrende Konfliktsituationen analysieren; eigenen Anteil erkennen',
        psychoedukation: {
          titel: 'Konflikte in der Schule – normal oder eskalierend?',
          inhalt: 'Konflikte mit Lehrern oder Mitschülern sind normal. Problematisch wird es, wenn sie sich wiederholen, eskalieren oder zu Konsequenzen führen (Verweis, Schulwechsel). Hinter Schulkonflikten stecken oft tiefere Themen: mangelndes Gefühl von Respekt, Ungerechtigkeit, Überforderung oder Machtlosigkeit.'
        },
        interventionen: [
          {
            titel: 'Konfliktkarte Schule',
            ansatz: 'Systemisch',
            beschreibung: 'Mit wem gibt es Konflikte? Wie häufig? Was ist typischerweise der Auslöser? Was eskaliert? Was wäre das Muster? Gemeinsam eine ehrliche Karte der Schulkonflikte erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Eigener Anteil',
            beschreibung: 'Wähle einen konkreten Konflikt. Was war dein Anteil – auch wenn der andere „mehr Schuld" hatte? Was hättest du anders tun können?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Konfliktbeobachtung',
          beschreibung: 'Beobachte diese Woche einen Schulkonflikt (eigener oder fremder): Was hat ihn ausgelöst? Was hat ihn verschärft?',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher Konflikt belastet dich in der Schule am meisten?',
          'Was steckt wirklich dahinter?'
        ]
      },
      {
        nr: 2,
        titel: 'Umgang mit Autorität',
        dauer: '60 Min',
        ziel: 'Eigenes Verhältnis zu Autoritätspersonen reflektieren; konstruktive Alternativen entwickeln',
        psychoedukation: {
          titel: 'Lehrer sind auch Menschen',
          inhalt: 'Konflikte mit Lehrern entstehen oft aus gegenseitigen Missverständnissen: Der Lehrer interpretiert Verhalten als Respektlosigkeit – der Schüler fühlt sich ungerecht behandelt. Beide Seiten haben Bedürfnisse. Wer lernt, seine Bedürfnisse zu kommunizieren statt zu provozieren, gewinnt mehr Spielraum.'
        },
        interventionen: [
          {
            titel: 'Perspektivenwechsel Lehrer',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Einen Konflikt mit einem Lehrer aus dessen Sicht beschreiben: Was hat er/sie wahrgenommen? Was könnte er/sie gedacht haben? Was braucht er/sie? Dann: Was kannst du anders machen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gesprächsstrategie vorbereiten',
            beschreibung: 'Bereite ein Gespräch mit einem Lehrer vor, mit dem du Konflikte hast: Was möchtest du sagen? Wie bleibst du ruhig?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gespräch führen',
          beschreibung: 'Führe diese Woche ein ruhiges Gespräch mit dem betreffenden Lehrer.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was war überraschend, als du die Perspektive des Lehrers eingenommen hast?',
          'Was möchtest du beim nächsten Mal anders machen?'
        ]
      },
      {
        nr: 3,
        titel: 'Deeskalation und Neustart',
        dauer: '60 Min',
        ziel: 'Konkrete Deeskalationsstrategien; beschädigte Beziehungen reparieren',
        psychoedukation: {
          titel: 'Neustart ist möglich',
          inhalt: 'Selbst in beschädigten Lehrerbeziehungen ist ein Neustart möglich. Was hilft: Verantwortung für den eigenen Anteil übernehmen (nicht für alles), ein ehrliches Gespräch, konsequentes Verhalten ändern. Beziehungsreparatur ist aktive Arbeit.'
        },
        interventionen: [
          {
            titel: 'Beziehungsreparatur planen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Wie kannst du die beschädigte Beziehung reparieren? Was wäre ein konkreter erster Schritt? Was musst du ändern – und was nicht?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Deeskalations-Karte erstellen',
            beschreibung: 'Was tue ich, wenn ein Konflikt in der Schule eskaliert? 3 konkrete Strategien aufschreiben.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Neustart umsetzen',
          beschreibung: 'Setze diese Woche einen konkreten Neustartschritt um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du in deinen Schulbeziehungen ändern?'
        ]
      }
    ]
  },

  'berufsorientierung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler ohne klare berufliche Orientierung oder mit unrealistischen/fehlenden Berufsvorstellungen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wer bin ich – was interessiert mich?',
        dauer: '60 Min',
        ziel: 'Eigene Interessen, Stärken und Werte im Kontext Beruf entdecken',
        psychoedukation: {
          titel: 'Berufswahl beginnt mit Selbstkenntnis',
          inhalt: 'Die beste Berufswahl kommt nicht aus einem Berufsfeld-Test – sondern aus Selbstkenntnis. Wer bin ich? Was kann ich gut? Was macht mir Freude? Was ist mir wichtig? Diese Fragen zu beantworten ist die Grundlage jeder guten Berufsentscheidung.'
        },
        interventionen: [
          {
            titel: 'Stärken-Interessen-Werte-Profil',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Gemeinsam ein Profil erstellen: Was sind meine Stärken? Was sind meine Interessen (auch außerhalb der Schule)? Was sind meine Werte (Kreativität, Sicherheit, Helfen, Technik)? Welche Berufsfelder könnten passen?',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Berufsfelder erkunden',
            beschreibung: 'Wähle 3 Berufsfelder, die zu deinem Profil passen könnten. Was wusstest du schon? Was überrascht dich?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Erkunden',
          beschreibung: 'Recherchiere diese Woche ein konkretes Berufsbild, das dich interessiert.',
          dauer: '20 Min'
        },
        reflexion: [
          'Was überrascht dich an deinem eigenen Profil?',
          'Was wäre ein Beruf, den du dir nicht zugetraut hättest?'
        ]
      },
      {
        nr: 2,
        titel: 'Berufe erkunden und ausprobieren',
        dauer: '60 Min',
        ziel: 'Konkrete Berufsfelder kennenlernen; Informationsquellen und Praktikum planen',
        psychoedukation: {
          titel: 'Ausprobieren schlägt Theorisieren',
          inhalt: 'Kein Berufsfeld-Test ersetzt die eigene Erfahrung. Praktika, Informationsgespräche, Schnuppertage – wer ausprobiert, weiß mehr als wer nur nachdenkt. Und: Die erste Entscheidung muss nicht die endgültige sein.'
        },
        interventionen: [
          {
            titel: 'Erkunderplan erstellen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Berufsfelder möchte ich erkunden? Welche Informationsquellen gibt es? Praktikum, BIZ, Informationsgespräch mit Berufstätigen – gemeinsam einen konkreten Erkundeplan erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Berufs-Interview vorbereiten',
            beschreibung: 'Formuliere 5 Fragen, die du jemandem stellen würdest, der in deinem Wunschberuf arbeitet.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Erkunden umsetzen',
          beschreibung: 'Setze einen Schritt des Erkundeplans um: Recherche, Informationsgespräch oder Praktikumsanfrage.',
          dauer: '20 Min'
        },
        reflexion: [
          'Was hat dich bei der Recherche überrascht?',
          'Hat sich dein Bild eines Berufs verändert?'
        ]
      },
      {
        nr: 3,
        titel: 'Berufsplan entwickeln',
        dauer: '60 Min',
        ziel: 'Konkreten nächsten Schritt für die Berufsorientierung planen',
        psychoedukation: {
          titel: 'Der Weg zum Beruf',
          inhalt: 'Hinter jedem Beruf steht ein Weg: Schulabschluss, Ausbildung, Studium, Praktika, Weiterbildung. Diesen Weg zu kennen, macht ihn weniger beängstigend. Man muss nicht alles wissen – man muss nur den nächsten Schritt kennen.'
        },
        interventionen: [
          {
            titel: 'Berufswegsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Wähle einen oder zwei Berufswünsche. Welche Schritte sind nötig? Was kann jetzt schon vorbereitet werden? Gemeinsam einen realistischen Zeitplan erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Nächste Schritte definieren',
            beschreibung: 'Was sind die 3 nächsten konkreten Schritte auf deinem Berufsweg? Mit Datum.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt umsetzen',
          beschreibung: 'Setze diese Woche den ersten Schritt deines Plans um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was ist dein wichtigster nächster Schritt?'
        ]
      }
    ]
  },

  'zukunftsplanung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler ohne klare Lebensziele, mit Orientierungslosigkeit oder überwältigenden Zukunftsvorstellungen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Träume und Wünsche',
        dauer: '60 Min',
        ziel: 'Eigene Zukunftsvorstellungen und Werte explorieren',
        psychoedukation: {
          titel: 'Träume als Kompass',
          inhalt: 'Träume und Wünsche sind keine kindliche Spielerei – sie geben Orientierung. Wer weiß, was ihm wichtig ist und was er anstrebt, trifft bessere Entscheidungen. Es geht nicht darum, alles sofort zu planen – sondern eine Richtung zu haben.'
        },
        interventionen: [
          {
            titel: 'Zukunftsvision entwickeln',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Stelle dir vor, du bist 30 Jahre alt und dein Leben läuft gut. Wo wohnst du? Was machst du? Mit wem bist du zusammen? Was ist dir wichtig? Diese Vision beschreiben oder zeichnen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Lebensbereiche gewichten',
            beschreibung: 'Bewerte, wie wichtig dir folgende Bereiche in deiner Zukunft sind (1–10): Beruf, Familie, Freundschaft, Gesundheit, Freiheit, Kreativität, Geld, Abenteuer, Sicherheit.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Traum-Collage',
          beschreibung: 'Erstelle eine Collage (physisch oder digital) deiner Zukunftsvision.',
          dauer: '20 Min'
        },
        reflexion: [
          'Was in deiner Zukunftsvision überrascht dich selbst?',
          'Was davon ist bisher noch weit entfernt?'
        ]
      },
      {
        nr: 2,
        titel: 'Ziele setzen und planen',
        dauer: '60 Min',
        ziel: 'Träume in konkrete Ziele und Schritte übersetzen',
        psychoedukation: {
          titel: 'Ziele SMART formulieren',
          inhalt: 'Ein Traum wird zum Ziel, wenn er konkret, messbar, erreichbar, relevant und zeitgebunden ist (SMART). „Ich möchte erfolgreich sein" ist kein Ziel. „Ich mache bis Ende des Schuljahres einen Praktikumsplatz im Bereich X" ist eins.'
        },
        interventionen: [
          {
            titel: 'SMART-Ziel formulieren',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Aus der Zukunftsvision ein oder zwei konkrete SMART-Ziele für das nächste Jahr ableiten. Gemeinsam auf Konkretheit und Realismus prüfen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Rückwärtsplanung',
            beschreibung: 'Starte beim Ziel und plane rückwärts: Was muss 6 Monate vorher passieren? 3 Monate? 1 Monat? Jetzt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt gehen',
          beschreibung: 'Setze diese Woche den ersten Schritt deines Plans um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was ist überraschend realistisch – und was doch weiter weg als gedacht?',
          'Was motiviert dich am meisten?'
        ]
      },
      {
        nr: 3,
        titel: 'Hindernisse und Resilienz',
        dauer: '60 Min',
        ziel: 'Realistisch mit Rückschlägen umgehen; Resilienz für die Zielverfolgung stärken',
        psychoedukation: {
          titel: 'Kein Weg ist gerade',
          inhalt: 'Kein Lebensplan verläuft genau wie geplant. Rückschläge, Umwege und veränderte Pläne sind Teil des Lebens – keine Zeichen des Scheiterns. Wer gelernt hat, mit Hindernissen umzugehen, kommt weiter als wer glaubt, alles muss glatt laufen.'
        },
        interventionen: [
          {
            titel: 'Hindernisse antizipieren',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Hindernisse könnten auf dem Weg zu deinen Zielen auftauchen? Für jedes: Was ist dein Plan B? Wer kann helfen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief aus der Zukunft',
            beschreibung: 'Schreibe einen Brief vom zukünftigen dir – der den Weg bis dorthin schon gegangen ist. Was sagst du deinem jetzigen Ich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Plan weiterführen',
          beschreibung: 'Führe deinen Plan diese Woche weiter. Was läuft? Was muss angepasst werden?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was ist dein größter Traum für dein Leben?'
        ]
      }
    ]
  },

  'motivation': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Antriebslosigkeit, Gleichgültigkeit oder Motivationsproblemen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Warum tu ich – oder tu ich nicht?',
        dauer: '60 Min',
        ziel: 'Motivation und Antriebslosigkeit verstehen; eigene Motivationsquellen erkunden',
        psychoedukation: {
          titel: 'Intrinsische vs. extrinsische Motivation',
          inhalt: 'Extrinsische Motivation (Noten, Lob, Druck) hält selten an. Intrinsische Motivation (Neugier, Freude, Sinn) ist nachhaltiger. Antriebslosigkeit entsteht oft, wenn keine Verbindung zwischen Tätigkeit und eigenem Sinn besteht.'
        },
        interventionen: [
          {
            titel: 'Motivationsquellen finden',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wann warst du zuletzt wirklich motiviert – in irgendeinem Bereich? Was war anders? Was hat dir Energie gegeben? Gemeinsam Muster herausarbeiten.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Energiespender und Energieräuber',
            beschreibung: 'Liste 5 Dinge auf, die dir Energie geben – und 5, die sie rauben. Was überwiegt in deinem Alltag?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Energie-Protokoll',
          beschreibung: 'Notiere diese Woche täglich: Wann hattest du Energie und Antrieb? Was war gerade los?',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Wann warst du zuletzt wirklich motiviert?',
          'Was fehlte dir in letzter Zeit?'
        ]
      },
      {
        nr: 2,
        titel: 'Antriebslosigkeit als Signal',
        dauer: '60 Min',
        ziel: 'Antriebslosigkeit als Information nutzen; Ursachen angehen',
        psychoedukation: {
          titel: 'Antriebslosigkeit hat Gründe',
          inhalt: 'Anhaltende Antriebslosigkeit kann ein Signal für Überforderung, Unterforderung, unerfüllte Bedürfnisse oder psychische Belastungen sein. Sie wegzudrücken hilft nicht. Sie ernst zu nehmen und die Ursache anzugehen ist der produktivere Weg.'
        },
        interventionen: [
          {
            titel: 'Ursachen-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Was steckt hinter der Antriebslosigkeit? Angst, Sinnlosigkeit, Erschöpfung, Unsicherheit, Ärger? Gemeinsam herausarbeiten und angehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Kleine Erfolge sammeln',
            beschreibung: 'Erledige eine kleine, konkrete Aufgabe jetzt sofort. Wie fühlt sich das an?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Täglich eine kleine Sache tun',
          beschreibung: 'Erledige täglich eine kleine Aufgabe, die du bisher vermieden hast. Notiere, wie es sich anfühlt.',
          dauer: 'täglich 10 Min'
        },
        reflexion: [
          'Was steckt wirklich hinter deiner Antriebslosigkeit?',
          'Was wäre, wenn du damit einen Arzt oder Berater aufsuchst?'
        ]
      },
      {
        nr: 3,
        titel: 'Sinn finden und Motivation aufbauen',
        dauer: '60 Min',
        ziel: 'Sinn und Bedeutung als Motivationsgrundlage stärken',
        psychoedukation: {
          titel: 'Sinn als stärkste Motivationsquelle',
          inhalt: 'Menschen, die einen Sinn in dem sehen, was sie tun, sind ausdauernder, resilienter und zufriedener. Sinn entsteht durch: Verbindung zu eigenen Werten, Beitrag zu etwas Größerem, Kompetenzerleben und Beziehungen. Diese Quellen sind aktiv stärkbar.'
        },
        interventionen: [
          {
            titel: 'Sinnquellen entwickeln',
            ansatz: 'Wertebasiert',
            beschreibung: 'Was gibt deinem Leben Sinn? Woraus ziehst du Energie und Bedeutung? Wie kannst du mehr davon in deinen Alltag bringen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Motivations-Ritual',
            beschreibung: 'Entwickle ein kurzes tägliches Ritual, das dir Energie gibt und an deinen Sinn erinnert (z.B. Morgenroutine mit Zielfrage: „Warum tu ich das heute?").',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ritual testen',
          beschreibung: 'Teste dein Ritual diese Woche täglich. Was verändert sich?',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was gibt dir wirklich Antrieb?'
        ]
      }
    ]
  },

  'prüfungsangst': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Prüfungsangst, Blackouts oder starkem Leistungsdruck',
    sitzungen: [
      {
        nr: 1,
        titel: 'Prüfungsangst verstehen',
        dauer: '60 Min',
        ziel: 'Prüfungsangst normalisieren; eigene Angstsymptome einordnen',
        psychoedukation: {
          titel: 'Leistungsangst – woher sie kommt',
          inhalt: 'Prüfungsangst ist eine Form der Leistungsangst. Sie entsteht, wenn die Bewertungssituation als bedrohlich erlebt wird – oft weil Selbstwert und Leistung gleichgesetzt werden: „Wenn ich versage, bin ich ein Versager." Diese Gleichsetzung ist das Problem, nicht die Prüfung.'
        },
        interventionen: [
          {
            titel: 'Angstsymptome kartieren',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Was passiert vor, während und nach Prüfungen? (körperlich, gedanklich, verhaltensmäßig). Gemeinsam das persönliche Angstprofil erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Hilfreiche vs. hinderliche Angst',
            beschreibung: 'Leichte Angst schärft die Aufmerksamkeit. Starke Angst blockiert. Auf einer Skala: Wo bist du bei Prüfungen typischerweise?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Angsttagebuch',
          beschreibung: 'Vor der nächsten Prüfungssituation: Gedanken und Körpersignale notieren.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann hat Prüfungsangst dich das erste Mal wirklich gestört?',
          'Was passiert in dem Moment, wenn die Angst besonders stark wird?'
        ]
      },
      {
        nr: 2,
        titel: 'Angstgedanken verändern',
        dauer: '60 Min',
        ziel: 'Katastrophen-Denken stoppen; realistischere Bewertungen entwickeln',
        psychoedukation: {
          titel: 'Gedanken erzeugen Angst',
          inhalt: 'Prüfungsangst wird durch Gedanken verstärkt: „Ich werde versagen", „Alle werden mich auslachen", „Das ist das Ende." Diese Gedanken sind selten realistisch. Sie zu hinterfragen – ohne sie zu ignorieren – reduziert die Angst.'
        },
        interventionen: [
          {
            titel: 'Katastrophen-Gedanken untersuchen',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Die häufigsten Prüfungsgedanken identifizieren. Für jeden: Wie wahrscheinlich ist das wirklich? Was wäre das Schlimmste – und könntest du damit umgehen? Was ist eine realistischere Version?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Realistische Selbstinstruktionen',
            beschreibung: 'Formuliere 3 Sätze, die du dir vor und während der Prüfung sagen kannst (z.B. „Ich habe gelernt. Ich tue mein Bestes. Das reicht.").',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Selbstinstruktionen üben',
          beschreibung: 'Trainiere die Selbstinstruktionen täglich – nicht nur vor Prüfungen, sondern auch in normalen Situationen.',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Welcher Gedanke verschlimmert deine Prüfungsangst am meisten?',
          'Was ist eine realistischere Alternative?'
        ]
      },
      {
        nr: 3,
        titel: 'Vorbereitung und Beruhigung',
        dauer: '60 Min',
        ziel: 'Konkrete Strategien für Prüfungsvorbereitung und akute Angst',
        psychoedukation: {
          titel: 'Vorbereitung schlägt Angst',
          inhalt: 'Die beste Strategie gegen Prüfungsangst ist gute Vorbereitung – kombiniert mit Entspannungstechniken für den akuten Moment. Überlernen kurz vor der Prüfung hilft nicht. Was hilft: rechtzeitig anfangen, Schlaf, eine Entspannungstechnik einüben.'
        },
        interventionen: [
          {
            titel: 'Persönliches Prüfungsritual',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam ein Ritual für Prüfungstage entwickeln: Abend vorher, Morgen, direkt vor der Prüfung. Was gibt Sicherheit? Was reduziert Stress?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Entspannungstechnik üben',
            beschreibung: 'Übe Box-Breathing oder progressive Muskelentspannung für den Moment kurz vor der Prüfung.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ritual testen',
          beschreibung: 'Teste dein Prüfungsritual bei der nächsten Prüfung oder Leistungssituation.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was verändert sich, wenn du dich gut vorbereitest?'
        ]
      }
    ]
  },

  'schlaf': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Schlafproblemen, schlechter Schlafroutine oder Erschöpfung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Schlaf verstehen – warum er so wichtig ist',
        dauer: '60 Min',
        ziel: 'Bedeutung von Schlaf für Körper und Geist verstehen',
        psychoedukation: {
          titel: 'Was im Schlaf passiert',
          inhalt: 'Im Schlaf regeneriert sich der Körper, das Gehirn verarbeitet Erlebnisse und festigt Erinnerungen. Jugendliche brauchen 8–10 Stunden Schlaf. Schlafmangel beeinträchtigt Konzentration, Stimmung, Impulskontrolle und Immunsystem. Chronischer Schlafmangel erhöht das Risiko für Depressionen und Angststörungen.'
        },
        interventionen: [
          {
            titel: 'Schlafprotokoll auswerten',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Wie viele Stunden schläfst du? Wann gehst du ins Bett, wann stehst du auf? Wie fühlst du dich morgens? Gibt es Einschlaf- oder Durchschlafprobleme? Gemeinsam das aktuelle Schlafsystem analysieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schlafqualitäts-Einschätzung',
            beschreibung: 'Bewerte deinen Schlaf der letzten 7 Tage auf einer Skala 1–10. Was hat die Unterschiede verursacht?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Schlafprotokoll führen',
          beschreibung: 'Führe eine Woche lang täglich ein Schlafprotokoll: Einschlafzeit, Aufwachzeit, Schlafqualität (1–10), Stimmung morgens.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Wie viel Schlaf brauchst du, um dich gut zu fühlen?',
          'Was raubt dir am meisten Schlaf?'
        ]
      },
      {
        nr: 2,
        titel: 'Schlafhygiene verbessern',
        dauer: '60 Min',
        ziel: 'Konkrete Maßnahmen für bessere Schlafqualität',
        psychoedukation: {
          titel: 'Schlafhygiene – die Grundregeln',
          inhalt: 'Gute Schlafhygiene: feste Schlafenszeiten (auch am Wochenende), kein Bildschirm 30–60 Min vor dem Schlafen (Blaulicht hemmt Melatonin), kühles und dunkles Zimmer, kein Koffein nach 14 Uhr. Das Bett nur zum Schlafen nutzen – nicht zum Lernen oder Serien schauen.'
        },
        interventionen: [
          {
            titel: 'Schlafbeeinflussende Faktoren identifizieren',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was in deiner aktuellen Routine stört deinen Schlaf? Bildschirm, Lärm, spätes Essen, unregelmäßige Zeiten, Stress? Für jeden Faktor: Was könnte verändert werden?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Abendroutine entwerfen',
            beschreibung: 'Entwickle eine 30-minütige Abendroutine, die deinen Körper auf Schlaf vorbereitet.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Abendroutine testen',
          beschreibung: 'Teste deine Abendroutine diese Woche. Was verändert sich an deinem Schlaf?',
          dauer: 'täglich 30 Min'
        },
        reflexion: [
          'Was ist der größte Störfaktor deines Schlafs?',
          'Was wäre dein realistischster erster Schritt?'
        ]
      },
      {
        nr: 3,
        titel: 'Einschlafprobleme und Grübeln',
        dauer: '60 Min',
        ziel: 'Konkrete Techniken gegen Einschlafprobleme und nächtliches Grübeln',
        psychoedukation: {
          titel: 'Das Grübel-Paradox',
          inhalt: 'Wer schlafen will, aber grübelt, kämpft gegen das Gehirn. Aktive Entspannung (Atemübungen, Körperscan, Gedanken aufschreiben) ist effektiver als „einfach nicht denken". Paradoxe Intention: Wer sich erlaubt, wach zu bleiben, schläft oft schneller ein.'
        },
        interventionen: [
          {
            titel: 'Einschlaf-Toolbox',
            ansatz: 'Körperorientiert / Kognitiv-behavioral',
            beschreibung: 'Verschiedene Techniken üben und bewerten: Körperscan, 4-7-8-Atmung, Gedanken aufschreiben vor dem Schlafen, mentales Bildkino. Welche passt zu diesem Schüler?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sorgen-Notizbuch',
            beschreibung: 'Schreibe 30 Min vor dem Schlafen alle Gedanken und Sorgen auf – damit das Gehirn weiß: Es ist gespeichert, ich muss jetzt nicht daran denken.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Einschlaf-Technik anwenden',
          beschreibung: 'Wende diese Woche täglich eine Einschlaf-Technik an.',
          dauer: 'täglich 10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Veränderung möchtest du dauerhaft beibehalten?'
        ]
      }
    ]
  },

  'ernaehrung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit auffälligem Essverhalten, schlechten Ernährungsgewohnheiten oder erstem Verdacht auf Essstörung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie esse ich – und wie fühle ich mich dabei?',
        dauer: '60 Min',
        ziel: 'Eigenes Essverhalten reflektieren; Zusammenhang zwischen Essen und Gefühlen verstehen',
        psychoedukation: {
          titel: 'Essen ist mehr als Ernährung',
          inhalt: 'Essen stillt nicht nur Hunger – es reguliert Gefühle, gibt Kontrolle, verbindet sozial oder dient als Belohnung und Trost. Das ist normal. Problematisch wird es, wenn Essen das wichtigste Werkzeug zur Emotionsregulation wird oder das Verhältnis zum eigenen Körper leidet.'
        },
        interventionen: [
          {
            titel: 'Essverhalten-Interview',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was isst du normalerweise? Wann, wie viel, in welchen Situationen? Gibt es Essen, das du meidest? Essen, das du nicht stoppen kannst? Wie fühlst du dich beim Essen – während und danach?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Hunger-Sättigungs-Skala',
            beschreibung: 'Bewerte vor und nach einer Mahlzeit deinen Hunger (1 = ausgehungert, 10 = übervoll). Was bemerkst du?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Esstagebuch',
          beschreibung: 'Führe 3 Tage lang ein Esstagebuch: Was, wann, wie viel – und welche Gefühle vorher und danach.',
          dauer: 'täglich 5 Min'
        },
        reflexion: [
          'Wie beschreibst du deine Beziehung zum Essen?',
          'Gibt es Situationen, in denen du anders isst als du möchtest?'
        ]
      },
      {
        nr: 2,
        titel: 'Emotionales Essen erkennen',
        dauer: '60 Min',
        ziel: 'Emotionales Essen von körperlichem Hunger unterscheiden',
        psychoedukation: {
          titel: 'Hunger vs. emotionaler Hunger',
          inhalt: 'Körperlicher Hunger kommt langsam, wird durch Essen befriedigt und hält an. Emotionaler Hunger kommt plötzlich, ist auf bestimmte Lebensmittel gerichtet und wird von Schuldgefühlen begleitet. Beides zu unterscheiden ist der erste Schritt zu einer gesünderen Essbeziehung.'
        },
        interventionen: [
          {
            titel: 'Trigger-Analyse',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'In welchen emotionalen Zuständen isst du anders als geplant? (Stress, Langeweile, Trauer, Feiern). Was löst das Essen aus? Was würde helfen, dieses Bedürfnis anders zu erfüllen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Alternativen entwickeln',
            beschreibung: 'Für deine 3 häufigsten emotionalen Hunger-Auslöser: Was könntest du stattdessen tun?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Pause vor dem Essen',
          beschreibung: 'Mache diese Woche vor jeder Mahlzeit eine 2-Minuten-Pause und frage dich: Bin ich wirklich hungrig – oder brauche ich gerade etwas anderes?',
          dauer: 'täglich 2 Min'
        },
        reflexion: [
          'In welchen Situationen isst du emotional?',
          'Was brauchst du in diesen Situationen wirklich?'
        ]
      },
      {
        nr: 3,
        titel: 'Gesunde Beziehung zum Essen aufbauen',
        dauer: '60 Min',
        ziel: 'Intuitive Ernährung; Körpersignale vertrauen lernen',
        psychoedukation: {
          titel: 'Kein Essen ist verboten',
          inhalt: 'Restriktive Essregeln (verbotene Lebensmittel, Kalorienzählen) führen langfristig oft zu mehr Problemen als sie lösen. Intuitive Ernährung bedeutet: auf Körpersignale hören, alle Lebensmittel erlauben, Genuss ohne Schuldgefühle. Das ist kein Freifahrtschein – sondern eine gesündere Grundhaltung.'
        },
        interventionen: [
          {
            titel: 'Körpersignale spüren',
            ansatz: 'Achtsamkeitsbasiert',
            beschreibung: 'Bewusstes Essen üben: Langsam essen, alle Sinne einsetzen, stoppen wenn satt. Gemeinsam besprechen: Was verändert sich, wenn man bewusster isst?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Eine Mahlzeit bewusst genießen',
            beschreibung: 'Iss eine Mahlzeit komplett ohne Ablenkung (kein Handy, kein TV). Was fällt auf?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Täglich eine achtsame Mahlzeit',
          beschreibung: 'Diese Woche: Mindestens eine Mahlzeit täglich bewusst und ohne Ablenkung essen.',
          dauer: 'täglich 15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du in Zukunft mit Essen umgehen?'
        ]
      }
    ]
  },

  'sport-bewegung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Bewegungsmangel, negativer Körpererfahrung durch Sport oder übermäßigem Sport als Kompensation',
    sitzungen: [
      {
        nr: 1,
        titel: 'Bewegung und ich',
        dauer: '60 Min',
        ziel: 'Eigene Beziehung zur Bewegung erkunden; Potenzial von Sport für Wohlbefinden verstehen',
        psychoedukation: {
          titel: 'Bewegung als Medizin',
          inhalt: 'Regelmäßige Bewegung ist eine der wirksamsten Maßnahmen für psychisches Wohlbefinden. Sie reduziert Stress, Angst und depressive Symptome, verbessert Schlaf und Selbstwert. Nicht Leistung ist das Ziel – sondern Bewegung, die sich gut anfühlt.'
        },
        interventionen: [
          {
            titel: 'Bewegungsbiografie',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Welche Erfahrungen hast du mit Sport und Bewegung gemacht? Positive und negative. Was hat dir Spaß gemacht? Was war schlimm? Was bist du gerne – oder nicht gerne – gemacht?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Bewegungsformen sammeln',
            beschreibung: 'Liste alle Formen von Bewegung auf, die du dir vorstellen könntest – von Tanzen bis Spazierengehen. Welche reizt dich?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Bewegungsprotokoll',
          beschreibung: 'Führe diese Woche ein kurzes Protokoll: Wann hast du dich bewegt? Wie hat es sich angefühlt?',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was verbindest du mit Sport – positiv und negativ?',
          'Wann hast du dich zuletzt nach Bewegung gut gefühlt?'
        ]
      },
      {
        nr: 2,
        titel: 'Bewegung in den Alltag bringen',
        dauer: '60 Min',
        ziel: 'Konkrete Bewegungsgewohnheiten entwickeln; Hindernisse überwinden',
        psychoedukation: {
          titel: 'Bewegung braucht keine Gym-Mitgliedschaft',
          inhalt: 'Schon 30 Minuten moderate Bewegung täglich zeigen nachweisliche Wirkung. Das muss kein Sport sein: Zu Fuß gehen, Treppensteigen, Tanzen in der Küche, Radfahren. Entscheidend ist Regelmäßigkeit, nicht Intensität.'
        },
        interventionen: [
          {
            titel: 'Bewegungsplan erstellen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was ist realistisch umsetzbar? Welche Bewegungsform passt zu deinem Alltag? Einen konkreten Plan mit mindestens 3 Bewegungseinheiten pro Woche erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Hindernisse analysieren',
            beschreibung: 'Was hindert dich, dich mehr zu bewegen? Für jedes Hindernis eine Lösung entwickeln.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Plan umsetzen',
          beschreibung: 'Setze deinen Bewegungsplan diese Woche um. Notiere, wie es sich anfühlt.',
          dauer: 'nach Plan'
        },
        reflexion: [
          'Was macht Bewegung leichter für dich?',
          'Was würde dich langfristig motivieren?'
        ]
      },
      {
        nr: 3,
        titel: 'Körper und Geist verbinden',
        dauer: '60 Min',
        ziel: 'Körperwahrnehmung stärken; Bewegung als Selbstfürsorge begreifen',
        psychoedukation: {
          titel: 'Körper und Geist sind eins',
          inhalt: 'Was wir mit unserem Körper tun, beeinflusst unser Denken und Fühlen – und umgekehrt. Bewegung ist eine Form der Körperpflege und Selbstfürsorge. Wer gut auf seinen Körper achtet, behandelt sich selbst mit Respekt.'
        },
        interventionen: [
          {
            titel: 'Körperwahrnehmungs-Übung',
            ansatz: 'Achtsamkeitsbasiert / Körperorientiert',
            beschreibung: 'Kurze achtsame Bewegungseinheit: Langsam gehen, jeden Schritt spüren, Atemrhythmus wahrnehmen. Danach besprechen: Was hast du bemerkt?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Bewegung als Stimmungsregulation',
            beschreibung: 'Was passiert mit deiner Stimmung nach Bewegung? Teste es: Vor einer Aktivität Stimmung bewerten (1–10), danach noch mal. Was veränder sich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Bewegung als Selbstfürsorge',
          beschreibung: 'Plane diese Woche Bewegung bewusst als Selbstfürsorge-Aktivität ein – nicht als Pflicht.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Bewegungsform möchtest du dauerhaft beibehalten?'
        ]
      }
    ]
  },

  'sexualitaet': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Fragen zu Pubertät, Sexualität, Verhütung oder sexueller Identität',
    sitzungen: [
      {
        nr: 1,
        titel: 'Körper, Pubertät und Veränderung',
        dauer: '60 Min',
        ziel: 'Körperliche Veränderungen in der Pubertät verstehen und normalisieren',
        psychoedukation: {
          titel: 'Was in der Pubertät passiert',
          inhalt: 'Pubertät ist eine intensive körperliche und emotionale Entwicklungsphase. Hormone verändern Körper, Stimmungen und soziale Bedürfnisse. Alle Menschen entwickeln sich unterschiedlich schnell. Vergleiche mit anderen sind sinnlos – der eigene Rhythmus ist normal.'
        },
        interventionen: [
          {
            titel: 'Fragen und Unsicherheiten klären',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Raum für Fragen geben: Was beschäftigt dich rund um Körper, Pubertät und Sexualität? Ehrlich und sachlich beantworten. Mythen aufklären.',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Was ich weiß – was ich nicht weiß',
            beschreibung: 'Schreibe anonym auf, was du über Sexualität sicher weißt – und was du dir nicht sicher bist. Gemeinsam klären.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Zuverlässige Informationsquellen',
          beschreibung: 'Suche eine zuverlässige Informationsquelle zum Thema (z.B. Bundeszentrale für gesundheitliche Aufklärung).',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Frage beschäftigt dich am meisten?',
          'Mit wem könntest du über dieses Thema sprechen?'
        ]
      },
      {
        nr: 2,
        titel: 'Sexualität, Grenzen und Konsens',
        dauer: '60 Min',
        ziel: 'Konsens, Grenzen und Selbstbestimmung in sexuellen Kontexten verstehen',
        psychoedukation: {
          titel: 'Konsens ist klar und enthusiastisch',
          inhalt: 'Konsens bedeutet: beide sagen aktiv Ja – klar, frei und ohne Druck. Kein Nein zu hören ist kein Ja. Unsicherheit ist kein Ja. Alkohol verhindert Konsens. Eigene Grenzen kennen und kommunizieren ist ein Recht – und eine Pflicht gegenüber anderen.'
        },
        interventionen: [
          {
            titel: 'Grenzen und Konsens besprechen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Was bedeutet Konsens konkret? Was sind meine Grenzen? Wie kommuniziere ich sie? Rollenspiele für Grenzkommunikation – altersgerecht und respektvoll.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Grenzen formulieren',
            beschreibung: 'Formuliere 3 Sätze, die du in einer Situation sagen kannst, in der deine Grenzen überschritten werden.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Reflexion',
          beschreibung: 'Denke über folgende Frage nach: Was sind meine persönlichen Grenzen – und wie kann ich sie klar kommunizieren?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann ist es schwer, Grenzen zu setzen?',
          'Was hilft dir, bei deinen Grenzen zu bleiben?'
        ]
      },
      {
        nr: 3,
        titel: 'Sexuelle Identität und Vielfalt',
        dauer: '60 Min',
        ziel: 'Sexuelle und geschlechtliche Vielfalt verstehen; eigene Identität explorieren',
        psychoedukation: {
          titel: 'Sexuelle Identität ist vielfältig',
          inhalt: 'Sexuelle Orientierung und geschlechtliche Identität sind ein Spektrum – nicht schwarz-weiß. Heterosexualität, Homosexualität, Bisexualität, Asexualität, Trans- und Nicht-binäre Identitäten sind alle normale Varianten menschlicher Vielfalt. Identität kann sich im Laufe des Lebens entwickeln und verändern.'
        },
        interventionen: [
          {
            titel: 'Identitäts-Exploration',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Raum geben für Fragen zur eigenen Identität: Was weiß ich? Was bin ich unsicher? Was fühlt sich stimmig an? Ohne Druck zur Entscheidung.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Unterstützende Ressourcen kennen',
            beschreibung: 'Welche Beratungsangebote oder Gemeinschaften gibt es für LGBTQ+ Jugendliche? (z.B. Jugendberatung, Online-Communities).',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vertrauensperson finden',
          beschreibung: 'Überlege: Mit wem könntest du über Fragen zur eigenen Identität sprechen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du noch herausfinden oder erkunden?'
        ]
      }
    ]
  },

  'koerperbild': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit negativem Körperbild, Körperscham oder Selbstwahrnehmungsproblemen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie sehe ich meinen Körper?',
        dauer: '60 Min',
        ziel: 'Eigenes Körperbild reflektieren; Einflüsse auf Körperzufriedenheit verstehen',
        psychoedukation: {
          titel: 'Körperbild entsteht im Kopf',
          inhalt: 'Körperbild ist nicht dasselbe wie Aussehen. Es ist, wie wir unseren Körper wahrnehmen und bewerten – beeinflusst durch Medien, Kommentare, kulturelle Normen und persönliche Erfahrungen. Negative Körperbilder sind weit verbreitet – besonders unter Jugendlichen und besonders bei Mädchen.'
        },
        interventionen: [
          {
            titel: 'Körperbild-Interview',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wie zufrieden bist du mit deinem Körper? Was magst du? Was störst du? Woher kommen diese Gedanken? Wann begann das? Ohne Bewertung – nur Verstehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Medien-Analyse',
            beschreibung: 'Sammle 5 Körperideale aus Medien oder Social Media. Wie realistisch sind sie? Was wird versteckt oder bearbeitet?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Body-Talk-Beobachtung',
          beschreibung: 'Beobachte diese Woche, was du dir über deinen Körper sagst – innerlich. Notiere die häufigsten Gedanken.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was ist der häufigste negative Gedanke über deinen Körper?',
          'Woher kommt dieser Gedanke?'
        ]
      },
      {
        nr: 2,
        titel: 'Körperscham überwinden',
        dauer: '60 Min',
        ziel: 'Körperscham normalisieren; Selbstmitgefühl gegenüber dem eigenen Körper entwickeln',
        psychoedukation: {
          titel: 'Kein Körper ist fehlerfrei',
          inhalt: 'Körperscham entsteht, wenn wir glauben, unsere Körper entsprechen nicht dem, was sie „sollten". Kein Körper ist perfekt – auch nicht die Körper, die wir in Medien sehen. Selbstmitgefühl für den eigenen Körper ist keine Selbstgefälligkeit – es ist psychische Gesundheit.'
        },
        interventionen: [
          {
            titel: 'Selbstmitgefühl üben',
            ansatz: 'Achtsamkeitsbasiert',
            beschreibung: 'Schreibe einen Brief an deinen Körper – so mitfühlend wie du einem guten Freund schreiben würdest. Was hat dein Körper geleistet? Was trägt er täglich für dich?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Was mein Körper kann',
            beschreibung: 'Liste 10 Dinge auf, die dein Körper kann oder für dich tut. Fokus: Funktion, nicht Aussehen.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Körper-Dankbarkeit',
          beschreibung: 'Notiere täglich eine Sache, für die du deinem Körper dankbar bist.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was hat sich verändert, wenn du deinen Körper aus der Funktion statt aus dem Aussehen betrachtest?',
          'Was würdest du deinem besten Freund sagen, wenn er so über seinen Körper denkt?'
        ]
      },
      {
        nr: 3,
        titel: 'Gesundes Körperbild entwickeln',
        dauer: '60 Min',
        ziel: 'Langfristig neutrales bis positives Körperbild aufbauen',
        psychoedukation: {
          titel: 'Body Neutrality vs. Body Positivity',
          inhalt: 'Body Positivity (meinen Körper lieben) ist für viele zu weit gegriffen. Body Neutrality ist realistischer: Den Körper weder lieben noch hassen – ihn als Werkzeug sehen, das trägt und lebt. Das ist ein ausreichendes Ziel.'
        },
        interventionen: [
          {
            titel: 'Persönlicher Körperbild-Plan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was beeinflusst dein Körperbild negativ? (Social Media, Vergleiche, Kommentare). Was können wir verändern? Gemeinsam konkrete Schritte entwickeln.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Social-Media-Diät',
            beschreibung: 'Bestelle alle Accounts ab, die dein Körperbild verschlechtern. Füge Accounts hinzu, die Körpervielfalt zeigen.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Körperbild-Pflege',
          beschreibung: 'Diese Woche: Tue jeden Tag eine Sache, die gut für die Beziehung zu deinem Körper ist.',
          dauer: 'täglich 10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie möchtest du in Zukunft über deinen Körper denken?'
        ]
      }
    ]
  },

  'mentale-gesundheit': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler zur allgemeinen psychischen Stärkung oder mit ersten Zeichen psychischer Belastung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist mentale Gesundheit?',
        dauer: '60 Min',
        ziel: 'Mentale Gesundheit verstehen; eigene Stärken und Belastungen einschätzen',
        psychoedukation: {
          titel: 'Mentale Gesundheit – nicht nur keine Krankheit',
          inhalt: 'Mentale Gesundheit ist mehr als das Fehlen von Erkrankungen. Sie umfasst: Wohlbefinden, die Fähigkeit, Stress zu bewältigen, produktiv zu sein und Beziehungen zu gestalten. Wie körperliche Gesundheit braucht sie Pflege – täglich.'
        },
        interventionen: [
          {
            titel: 'Mentaler Gesundheits-Check',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wie geht es mir aktuell in den Bereichen: Stimmung, Energie, Schlaf, Beziehungen, Schule, Freude? Was ist gut? Was belastet mich?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schutzfaktoren identifizieren',
            beschreibung: 'Was stärkt deine mentale Gesundheit? Liste alle Faktoren auf: Personen, Aktivitäten, Gewohnheiten, Werte.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Wohlbefinden-Tagebuch',
          beschreibung: 'Führe diese Woche täglich einen kurzen Wohlbefinden-Check: Stimmung (1–10), was war gut, was war schwierig.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was stärkt deine mentale Gesundheit am meisten?',
          'Was belastet sie gerade?'
        ]
      },
      {
        nr: 2,
        titel: 'Selbstfürsorge als Praxis',
        dauer: '60 Min',
        ziel: 'Konkrete Selbstfürsorge-Strategien entwickeln und verankern',
        psychoedukation: {
          titel: 'Selbstfürsorge ist keine Eitelkeit',
          inhalt: 'Selbstfürsorge bedeutet, die eigenen Grundbedürfnisse zu kennen und zu erfüllen: Schlaf, Ernährung, Bewegung, soziale Verbindung, Erholung, Sinn. Wer nicht für sich sorgt, kann langfristig auch nicht für andere da sein.'
        },
        interventionen: [
          {
            titel: 'Persönliche Selbstfürsorge-Strategie',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen konkreten Selbstfürsorge-Plan entwickeln: Was tue ich täglich, wöchentlich, monatlich für meine mentale Gesundheit?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Selbstfürsorge-Menü',
            beschreibung: 'Erstelle ein persönliches Selbstfürsorge-Menü: Kleine Dinge (5 Min), mittlere Dinge (30 Min), große Dinge (Stunden). Für jeden Bedarf etwas dabei.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Selbstfürsorge-Woche',
          beschreibung: 'Setze täglich mindestens eine Selbstfürsorge-Aktivität aus deinem Menü um.',
          dauer: 'täglich 10–30 Min'
        },
        reflexion: [
          'Was ist für dich die wichtigste Form der Selbstfürsorge?',
          'Was hält dich oft davon ab?'
        ]
      },
      {
        nr: 3,
        titel: 'Hilfe suchen – wann und wie',
        dauer: '60 Min',
        ziel: 'Stigma rund um psychische Hilfe abbauen; Anlaufstellen kennen',
        psychoedukation: {
          titel: 'Hilfe suchen ist Stärke',
          inhalt: 'Bei körperlichen Beschwerden geht man zum Arzt. Bei psychischen Belastungen ist das genauso sinnvoll – aber gesellschaftlich noch immer mit Stigma belastet. Professionelle Hilfe zu suchen ist mutig und klug, nicht schwach.'
        },
        interventionen: [
          {
            titel: 'Hilfsangebote kennenlernen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Welche Unterstützung gibt es? (Schulpsychologischer Dienst, Jugendberatung, Therapeuten, Krisentelefon). Wie läuft ein erstes Gespräch ab? Was kann man erwarten?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Signale kennen',
            beschreibung: 'Liste Zeichen auf, die anzeigen, dass professionelle Hilfe sinnvoll wäre. Wann würdest du dir selbst raten, Hilfe zu suchen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ressourcen notieren',
          beschreibung: 'Schreibe dir 2–3 Anlaufstellen auf, die du kontaktieren könntest, wenn du Unterstützung brauchst.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was wäre der erste Schritt, wenn du professionelle Hilfe suchen würdest?'
        ]
      }
    ]
  },

  'chronische-erkrankung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit chronischen körperlichen Erkrankungen oder Behinderungen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Mit einer Erkrankung leben',
        dauer: '60 Min',
        ziel: 'Eigene Erkrankung und deren Auswirkungen verstehen und benennen',
        psychoedukation: {
          titel: 'Chronisch krank sein – was das bedeutet',
          inhalt: 'Eine chronische Erkrankung ist nicht etwas, das man hat und dann vergisst. Sie verändert den Alltag, die Zukunftspläne, das Körperbild und manchmal die sozialen Beziehungen. Das anzuerkennen – ohne sich davon definieren zu lassen – ist die zentrale Aufgabe.'
        },
        interventionen: [
          {
            titel: 'Erkrankungs-Erzählung',
            ansatz: 'Narrativ',
            beschreibung: 'Erzähle deine Geschichte mit der Erkrankung: Wann begann es? Was hat sich verändert? Was ist geblieben? Raum geben für alle Gefühle – Wut, Trauer, Anpassung.',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ich bin mehr als meine Erkrankung',
            beschreibung: 'Schreibe 10 Dinge auf, die dich als Person ausmachen – unabhängig von deiner Erkrankung.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Belastungen dokumentieren',
          beschreibung: 'Notiere diese Woche, welche Bereiche deines Lebens die Erkrankung am meisten beeinflusst.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was ist das Schwierigste an deiner Erkrankung für dich?',
          'Gibt es etwas, das durch die Erkrankung stärker geworden ist?'
        ]
      },
      {
        nr: 2,
        titel: 'Umgang mit Einschränkungen',
        dauer: '60 Min',
        ziel: 'Coping-Strategien für erkrankungsbedingte Einschränkungen entwickeln',
        psychoedukation: {
          titel: 'Coping – mit Grenzen leben',
          inhalt: 'Coping bedeutet, mit den Anforderungen einer Erkrankung umzugehen. Es gibt problemfokussiertes Coping (praktische Lösungen), emotionsfokussiertes Coping (Gefühle regulieren) und sinnfokussiertes Coping (Bedeutung finden). Alle drei sind wichtig.'
        },
        interventionen: [
          {
            titel: 'Coping-Strategien entwickeln',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Einschränkungen macht die Erkrankung am meisten zu schaffen? Für jede: Was hilft praktisch? Was hilft emotional? Was gibt Sinn?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ressourcen trotz Erkrankung',
            beschreibung: 'Was kannst du trotz der Erkrankung gut? Was hast du durch sie gelernt? Welche Stärken hast du entwickelt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Strategie anwenden',
          beschreibung: 'Setze diese Woche eine Coping-Strategie bewusst ein.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hilft dir am meisten im Umgang mit den Einschränkungen?',
          'Was möchtest du weiter stärken?'
        ]
      },
      {
        nr: 3,
        titel: 'Zukunft trotz Erkrankung planen',
        dauer: '60 Min',
        ziel: 'Realistische Zukunftsperspektive mit und trotz Erkrankung entwickeln',
        psychoedukation: {
          titel: 'Die Erkrankung gehört dazu – aber sie bestimmt nicht alles',
          inhalt: 'Chronische Erkrankungen erfordern manchmal, Pläne anzupassen – aber sie verhindern selten alles. Viele Menschen mit chronischen Erkrankungen führen erfüllte, aktive Leben. Der Schlüssel: Realismus + Kreativität + Unterstützung.'
        },
        interventionen: [
          {
            titel: 'Zukunftsbild anpassen',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wie sieht eine gute Zukunft aus – mit der Erkrankung? Welche Anpassungen braucht es? Was bleibt möglich? Gemeinsam eine realistische, positive Perspektive entwickeln.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Unterstützungsnetz aktivieren',
            beschreibung: 'Wer unterstützt mich bei meiner Erkrankung? (Familie, Ärzte, Selbsthilfegruppen, Schulberater). Was brauche ich mehr Unterstützung bei?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Unterstützung suchen',
          beschreibung: 'Wende dich diese Woche an eine Person oder Stelle für mehr Unterstützung.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was ist dein wichtigster nächster Schritt?'
        ]
      }
    ]
  },

  'transport': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit eingeschränkter Mobilität, fehlenden Kenntnissen über öffentliche Verkehrsmittel oder Unabhängigkeitszielen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wie komme ich von A nach B?',
        dauer: '60 Min',
        ziel: 'Aktuelle Mobilitätssituation einschätzen; Möglichkeiten kennenlernen',
        psychoedukation: {
          titel: 'Mobilität ist Selbstständigkeit',
          inhalt: 'Wer sich selbstständig fortbewegen kann, ist unabhängiger – in Schule, Freizeit, Beruf. Öffentliche Verkehrsmittel, Fahrrad und perspektivisch der Führerschein sind Schlüssel zur Teilhabe. Das lässt sich erlernen.'
        },
        interventionen: [
          {
            titel: 'Mobilitätsprofil erstellen',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wie kommst du aktuell zur Schule, zu Freunden, zu Aktivitäten? Was ist schwierig? Was schränkt dich ein? Gemeinsam die Mobilitätssituation analysieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Öffentlichen Verkehr erkunden',
            beschreibung: 'Welche Linien oder Apps kannst du nutzen? Gemeinsam einen einfachen Weg planen.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Neuen Weg ausprobieren',
          beschreibung: 'Fahre diese Woche einen Weg mit öffentlichen Verkehrsmitteln, den du noch nie selbst gefahren bist.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was macht dich in Bezug auf Mobilität unsicher?',
          'Was wäre, wenn du dich freier bewegen könntest?'
        ]
      },
      {
        nr: 2,
        titel: 'Selbstständig unterwegs sein',
        dauer: '60 Min',
        ziel: 'Mobilität als Unabhängigkeit erleben; konkrete Schritte zur Erweiterung',
        psychoedukation: {
          titel: 'Schritt für Schritt zur Unabhängigkeit',
          inhalt: 'Mobilität aufzubauen geht schrittweise: erst bekannte Strecken, dann neue. Fehler gehören dazu – sich verfahren ist lehrreich, nicht gefährlich. Hilfsmittel wie Apps, Fahrpläne und Notfallnummern geben Sicherheit.'
        },
        interventionen: [
          {
            titel: 'Mobilitätsziele setzen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was sind deine Mobilitätsziele? (Allein zur Schule, Freunde besuchen, Einkaufen). Gemeinsam einen Stufenplan entwickeln.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Notfallplan erstellen',
            beschreibung: 'Was tue ich, wenn ich mich verfahre? Welche Nummern habe ich? Gemeinsam einen einfachen Notfallplan erstellen.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Mobilitätsziel umsetzen',
          beschreibung: 'Setze diese Woche einen Schritt deines Mobilitätsplans um.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was hat dich beim selbstständigen Unterwegssein überrascht?',
          'Was möchtest du als nächstes ausprobieren?'
        ]
      },
      {
        nr: 3,
        titel: 'Führerschein und langfristige Mobilität',
        dauer: '60 Min',
        ziel: 'Langfristige Mobilitätsperspektiven entwickeln; Führerschein als Ziel planen',
        psychoedukation: {
          titel: 'Führerschein als Meilenstein',
          inhalt: 'Der Führerschein öffnet neue Möglichkeiten für Arbeit, Freizeit und Selbstständigkeit. Er erfordert Vorbereitung, Zeit und Geld – lässt sich aber systematisch angehen.'
        },
        interventionen: [
          {
            titel: 'Langfristiger Mobilitätsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Mobilitätsziele hast du langfristig? Führerschein, Fahrrad, E-Scooter? Welche Schritte sind nötig? Wann, womit?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Führerschein-Recherche',
            beschreibung: 'Was kostet der Führerschein? Was sind die Voraussetzungen? Was ist der nächste Schritt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Schritt planen',
          beschreibung: 'Definiere einen konkreten ersten Schritt auf dem Weg zu deinem Mobilitätsziel.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was wäre möglich, wenn du dich freier bewegen könntest?'
        ]
      }
    ]
  },

  'finanzen': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit schlechtem Umgang mit Geld, Schulden oder fehlendem Finanzwissen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Geld verstehen – Einnahmen und Ausgaben',
        dauer: '60 Min',
        ziel: 'Eigene Finanzsituation verstehen; Einnahmen und Ausgaben kennen',
        psychoedukation: {
          titel: 'Geld ist ein Werkzeug',
          inhalt: 'Geld selbst ist neutral – der Umgang damit entscheidet. Wer mehr ausgibt als er einnimmt, gerät in Schulden. Wer einen Überblick hat, kann Entscheidungen treffen. Finanzbildung ist eine Lebenskompetenz, die in der Schule kaum gelehrt wird – aber entscheidend für Selbstständigkeit ist.'
        },
        interventionen: [
          {
            titel: 'Finanzprofil erstellen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Wie viel Geld kommt rein (Taschengeld, Job)? Wo geht es hin? Gibt es Schulden? Gemeinsam ein ehrliches Bild der Finanzsituation erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ausgaben-Tracking',
            beschreibung: 'Schätze: Wofür gibst du dein Geld aus? Welche Ausgaben überraschen dich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ausgabenprotokoll',
          beschreibung: 'Führe diese Woche ein ehrliches Ausgabenprotokoll: Jeden Kauf notieren.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was überrascht dich an deinen Ausgaben?',
          'Wofür gibst du Geld aus, das dir nicht wirklich wichtig ist?'
        ]
      },
      {
        nr: 2,
        titel: 'Haushaltsplan und Sparen',
        dauer: '60 Min',
        ziel: 'Einfachen Haushaltsplan erstellen; Spartipps kennen und anwenden',
        psychoedukation: {
          titel: 'Budget-Regel 50/30/20',
          inhalt: '50% für Notwendiges (Essen, Transport), 30% für Freizeit und Wünsche, 20% sparen. Das ist eine einfache Grundregel, die sich anpassen lässt. Wer auch nur 10% spart, baut langfristig Sicherheit auf.'
        },
        interventionen: [
          {
            titel: 'Persönlichen Haushaltsplan erstellen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Mit den eigenen Zahlen einen Haushaltsplan erstellen: Einnahmen, fixe Ausgaben, variable Ausgaben, Sparbetrag. Ist es realistisch? Was kann optimiert werden?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Spartipps bewerten',
            beschreibung: 'Liste 5 konkrete Möglichkeiten auf, diese Woche weniger auszugeben – ohne zu verzichten.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Haushaltsplan anwenden',
          beschreibung: 'Wende deinen Haushaltsplan diese Woche an. Was klappt, was nicht?',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was fällt dir beim Sparen am schwersten?',
          'Was motiviert dich, für etwas Bestimmtes zu sparen?'
        ]
      },
      {
        nr: 3,
        titel: 'Schulden vermeiden und Zukunft planen',
        dauer: '60 Min',
        ziel: 'Schulden-Risiken kennen; langfristige finanzielle Ziele entwickeln',
        psychoedukation: {
          titel: 'Schulden – wie sie entstehen und was man tun kann',
          inhalt: 'Schulden entstehen oft durch Impulskäufe, Abonnements, Ratenkäufe oder Notsituationen. Wer Schulden hat, sollte sie nicht ignorieren, sondern aktiv angehen: Gläubiger kontaktieren, Beratung suchen, Prioritäten setzen. In Luxemburg gibt es kostenlose Schuldnerberatung.'
        },
        interventionen: [
          {
            titel: 'Finanzielle Ziele setzen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was möchtest du dir langfristig leisten? Führerschein, eigene Wohnung, Urlaub? Gemeinsam überlegen: Wie viel, wie lange sparen? Was ist realistisch?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sparziel konkretisieren',
            beschreibung: 'Wähle ein konkretes Sparziel. Wie lange musst du sparen? Was musst du dafür anpassen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Spar-Start',
          beschreibung: 'Lege diese Woche zum ersten Mal einen kleinen Betrag beiseite – für dein Sparziel.',
          dauer: '5 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was wird sich ändern, wenn du deinen Umgang mit Geld verbesserst?'
        ]
      }
    ]
  },

  'haushalt': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit fehlenden Alltagskompetenzen oder in Vorbereitung auf selbstständiges Wohnen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was kann ich – was muss ich noch lernen?',
        dauer: '60 Min',
        ziel: 'Eigene Haushaltskompetenzen einschätzen; Lücken identifizieren',
        psychoedukation: {
          titel: 'Haushaltsführung als Lebenskompetenz',
          inhalt: 'Wer selbstständig wohnen will, braucht praktische Fähigkeiten: Kochen, Putzen, Wäsche waschen, Einkaufen, Rechnungen bezahlen. Diese Fähigkeiten werden meist nicht gelehrt – sie müssen aktiv erlernt werden. Es ist nie zu früh anzufangen.'
        },
        interventionen: [
          {
            titel: 'Haushaltskompetenz-Inventur',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Gemeinsam durchgehen: Was kann ich schon? (Kochen, Putzen, Waschen, Einkaufen, Bügeln). Was fehlt noch? Prioritäten setzen: Was ist am wichtigsten zu lernen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wochenmenü planen',
            beschreibung: 'Plane 5 einfache Mahlzeiten für eine Woche: Was brauchst du? Was kostet es? Schreibe eine Einkaufsliste.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eine Mahlzeit selbst kochen',
          beschreibung: 'Koche diese Woche eine Mahlzeit komplett selbst.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was kannst du bereits gut?',
          'Was wäre das Wichtigste zu lernen für deine Selbstständigkeit?'
        ]
      },
      {
        nr: 2,
        titel: 'Putzen, Waschen, Ordnung halten',
        dauer: '60 Min',
        ziel: 'Grundlegende Reinigungsroutinen entwickeln',
        psychoedukation: {
          titel: 'Warum Ordnung Energie spart',
          inhalt: 'Ein aufgeräumtes, sauberes Zuhause reduziert Stress und verbessert die Konzentration. Routine hilft: Wenn Putzen zum festen Bestandteil des Alltags wird, kostet es weniger mentale Energie als sporadisches Großreinemachen.'
        },
        interventionen: [
          {
            titel: 'Putzplan entwickeln',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Aufgaben fallen wöchentlich, monatlich an? Gemeinsam einen realistischen Putzplan erstellen.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wäsche-Tutorial',
            beschreibung: 'Was bedeuten Wäschesymbole? Was kann zusammen gewaschen werden? Kurze Übung mit Wäschekunde.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Hausaufgabe: Aufräumen',
          beschreibung: 'Räume diese Woche bewusst deinen eigenen Bereich auf – nach Plan.',
          dauer: '20 Min'
        },
        reflexion: [
          'Was fällt dir bei der Haushaltsführung am schwersten?',
          'Was würde dir den Alltag erleichtern?'
        ]
      },
      {
        nr: 3,
        titel: 'Selbstständig wohnen vorbereiten',
        dauer: '60 Min',
        ziel: 'Gesamtbild der Selbstständigkeit entwickeln; nächste Schritte planen',
        psychoedukation: {
          titel: 'Selbstständig wohnen – was noch dazugehört',
          inhalt: 'Neben Kochen und Putzen gehören zum selbstständigen Wohnen: Rechnungen bezahlen, Verträge verstehen, Reparaturen melden, Behördengänge erledigen. Sich vorzubereiten, bevor man auszieht, macht den Übergang leichter.'
        },
        interventionen: [
          {
            titel: 'Selbstständigkeitsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was fehlt noch bis zur Selbstständigkeit? Gemeinsam einen Lernplan für die wichtigsten fehlenden Kompetenzen erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Budget für eine Wohnung',
            beschreibung: 'Berechne grob, was eine eigene Wohnung kosten würde: Miete, Nebenkosten, Lebensmittel, Transport. Was fehlt noch?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Skill trainieren',
          beschreibung: 'Lerne diese Woche eine neue Haushaltsfähigkeit – koche etwas Neues, repariere etwas, wasche alleine.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Kompetenz möchtest du als nächstes entwickeln?'
        ]
      }
    ]
  },

  'freizeit': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Freizeitarmut, fehlenden Hobbys oder unausgeglichener Zeitgestaltung',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was tu ich mit meiner Zeit?',
        dauer: '60 Min',
        ziel: 'Aktuelle Freizeitgestaltung reflektieren; Balance einschätzen',
        psychoedukation: {
          titel: 'Freizeit ist keine Leerlaufzeit',
          inhalt: 'Freizeit ist nicht einfach „keine Schule". Sie ist Zeit für Erholung, Kreativität, soziale Verbindung und persönliche Entwicklung. Wer Freizeit sinnvoll gestaltet, kommt erholter in die Schule und hat ein höheres Wohlbefinden.'
        },
        interventionen: [
          {
            titel: 'Freizeitprofil erstellen',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wie verbringst du deine Freizeit? Was macht dir Freude? Was ist passive Beschäftigung (TV, Handy)? Was ist aktiv? Ist es ausgewogen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Aktivitäten-Rad',
            beschreibung: 'Zeichne ein Rad mit den Bereichen: Sport, Kreativität, Soziales, Natur, Lernen, Entspannung. Wie viel Zeit verbringst du in jedem? Was fehlt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Freizeitprotokoll',
          beschreibung: 'Protokolliere diese Woche, wie du deine Freizeit verbringst – ehrlich und detailliert.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Was machst du in deiner Freizeit, das dir wirklich gut tut?',
          'Was raubt dir Energie, ohne dir etwas zurückzugeben?'
        ]
      },
      {
        nr: 2,
        titel: 'Hobbys entdecken und entwickeln',
        dauer: '60 Min',
        ziel: 'Neue Interessen erkunden; ein Hobby konkret aufbauen',
        psychoedukation: {
          titel: 'Hobbys als Anker',
          inhalt: 'Hobbys geben Stabilität, Identität und Freude. Wer ein Hobby hat, hat einen Bereich, in dem er kompetent ist und sich selbst gehört. Das stärkt Selbstwert und Resilienz.'
        },
        interventionen: [
          {
            titel: 'Interessens-Erkundung',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was hat dich als Kind fasziniert? Was würdest du gerne können? Was interessiert dich, obwohl du es noch nie ausprobiert hast? Gemeinsam Ideen sammeln und eine ausprobieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Hobby-Aktionsplan',
            beschreibung: 'Wähle ein Hobby, das du ausprobieren möchtest. Was brauchst du dazu? Was ist der erste Schritt?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Hobby ausprobieren',
          beschreibung: 'Probiere diese Woche dein ausgewähltes Hobby zum ersten Mal aus.',
          dauer: '30 Min'
        },
        reflexion: [
          'Was macht ein Hobby zu einem guten Hobby für dich?',
          'Was möchtest du regelmäßig tun?'
        ]
      },
      {
        nr: 3,
        titel: 'Freizeit bewusst gestalten',
        dauer: '60 Min',
        ziel: 'Ausgewogene Freizeitgestaltung planen; Bildschirmzeit und Aktivzeit balancieren',
        psychoedukation: {
          titel: 'Balance zwischen Erholung und Aktivität',
          inhalt: 'Erholung ist wichtig – aber echte Erholung durch Bewegung, Natur, Kreativität oder soziale Kontakte regeneriert besser als passives Scrollen. Wer seine Freizeit aktiv gestaltet, profitiert mehr davon.'
        },
        interventionen: [
          {
            titel: 'Persönlicher Freizeitplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam einen ausgewogenen Wochenplan entwickeln: Wann ist Zeit für Hobbys, soziale Kontakte, Bewegung, Erholung? Realistisch und mit Spaß.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Offline-Stunden einplanen',
            beschreibung: 'Plane täglich mindestens eine Stunde offline und aktiv. Was wirst du tun?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Plan leben',
          beschreibung: 'Lebe deinen Freizeitplan diese Woche. Was klappt, was nicht?',
          dauer: 'täglich nach Plan'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du an deiner Freizeitgestaltung dauerhaft ändern?'
        ]
      }
    ]
  },

  'mediennutzung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit unkritischem Medienkonsum, Fake-News-Anfälligkeit oder digitalem Überkonsum',
    sitzungen: [
      {
        nr: 1,
        titel: 'Medien verstehen – wer macht was und warum?',
        dauer: '60 Min',
        ziel: 'Medienkompetenz aufbauen; Interessen hinter Medieninhalten verstehen',
        psychoedukation: {
          titel: 'Medien sind nicht neutral',
          inhalt: 'Jedes Medium hat Interessen: Klicks, Werbeeinnahmen, politische Einflussnahme. Algorithmen zeigen uns, was uns länger auf der Plattform hält – nicht was wahr oder wichtig ist. Medienkompetenz bedeutet, diese Mechanismen zu kennen und kritisch zu fragen: Wer macht das, warum, für wen?'
        },
        interventionen: [
          {
            titel: 'Medienanalyse',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Ein konkretes Medienbeispiel gemeinsam analysieren: Wer hat das gemacht? Welches Interesse steckt dahinter? Was fehlt in der Berichterstattung? Was ist Fakt, was Meinung?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Informationsquellen bewerten',
            beschreibung: 'Bewerte 3 Quellen, die du regelmäßig nutzt: Wie glaubwürdig sind sie? Was weißt du über ihre Interessen?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Fake-News-Check',
          beschreibung: 'Prüfe diese Woche einmal eine Schlagzeile oder Meldung auf ihre Richtigkeit (z.B. mit Faktencheck-Websites).',
          dauer: '15 Min'
        },
        reflexion: [
          'Welchen Medien vertraust du – und warum?',
          'Was lässt dich an einer Meldung zweifeln?'
        ]
      },
      {
        nr: 2,
        titel: 'Fake News erkennen und einordnen',
        dauer: '60 Min',
        ziel: 'Fake News, Desinformation und Manipulation erkennen',
        psychoedukation: {
          titel: 'Wie Desinformation funktioniert',
          inhalt: 'Fake News verbreiten sich schneller als Richtigstellungen – weil sie emotional aufwühlen. Typische Merkmale: reißerische Überschriften, fehlende Quellen, unbekannte Seiten, emotionale Sprache. Wer zweimal hinschaut, erkennt viele Falschinformationen.'
        },
        interventionen: [
          {
            titel: 'Faktencheck-Training',
            ansatz: 'Kognitiv-behavioral',
            beschreibung: 'Mehrere Meldungen gemeinsam prüfen: Wer hat das publiziert? Gibt es andere Quellen? Was sagen Faktencheck-Seiten? Übung im kritischen Lesen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'SIFT-Methode',
            beschreibung: 'Stop (nicht sofort teilen), Investigate (Quelle prüfen), Find (andere Quellen), Trace (Original finden). Methode mit einem Beispiel üben.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'SIFT anwenden',
          beschreibung: 'Wende die SIFT-Methode diese Woche auf mindestens eine Meldung an.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat dich beim Faktencheck überrascht?',
          'Welche Quellen vertraust du jetzt weniger?'
        ]
      },
      {
        nr: 3,
        titel: 'Gesunder Medienkonsum',
        dauer: '60 Min',
        ziel: 'Bewussten und ausgewogenen Medienkonsum entwickeln',
        psychoedukation: {
          titel: 'Digital Detox und Mediendiät',
          inhalt: 'Guter Medienkonsum bedeutet: aktiv wählen statt passiv konsumieren, Qualität über Quantität, Offline-Zeiten einhalten. Eine bewusste „Mediendiät" – wie eine Ernährungsdiät – hilft, Konsum zu reduzieren ohne zu verzichten.'
        },
        interventionen: [
          {
            titel: 'Persönliche Medienregeln',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Gemeinsam 5 konkrete, realistische Regeln entwickeln für einen bewussten Medienkonsum.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Medienfreie Zeit planen',
            beschreibung: 'Wähle täglich 2 Stunden, die du offline verbringst. Was tust du stattdessen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Medienregeln testen',
          beschreibung: 'Teste deine Regeln diese Woche. Was klappt, was ist zu schwierig?',
          dauer: 'täglich'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Medienregel möchtest du dauerhaft beibehalten?'
        ]
      }
    ]
  },

  'ehrenamt': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler auf der Suche nach Sinn und Engagement oder zur Stärkung sozialer Teilhabe',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was kann ich für andere tun?',
        dauer: '60 Min',
        ziel: 'Eigene Werte und Stärken im Kontext von Engagement erkunden',
        psychoedukation: {
          titel: 'Ehrenamt stärkt beide Seiten',
          inhalt: 'Freiwilliges Engagement gibt anderen etwas – und einem selbst auch: Sinn, soziale Kontakte, Kompetenzentwicklung, Selbstwert. Studien zeigen: Wer anderen hilft, ist glücklicher. Engagement muss nicht groß sein – auch kleine Beiträge zählen.'
        },
        interventionen: [
          {
            titel: 'Werte-Stärken-Profil',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was sind dir wichtig? (Umwelt, Tiere, Kinder, Ältere, Sport, Kultur). Was kannst du gut? Gemeinsam mögliche Engagementfelder herausarbeiten.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Engagement-Ideen sammeln',
            beschreibung: 'Brainstorme 10 Möglichkeiten, wie du dich engagieren könntest – von klein (Nachbarshilfe) bis groß (Verein).',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Recherche',
          beschreibung: 'Recherchiere eine konkrete Möglichkeit des Engagements in deiner Nähe.',
          dauer: '15 Min'
        },
        reflexion: [
          'Wofür würdest du dich einsetzen, auch ohne Bezahlung?',
          'Was gibt dir das Gefühl, etwas Sinnvolles zu tun?'
        ]
      },
      {
        nr: 2,
        titel: 'Engagement ausprobieren',
        dauer: '60 Min',
        ziel: 'Konkrete Engagementmöglichkeit auswählen und planen',
        psychoedukation: {
          titel: 'Einfach anfangen',
          inhalt: 'Engagement muss nicht perfekt sein. Man kann klein anfangen: einmalig helfen, eine Aktion mitmachen, einen Verein besuchen. Der erste Schritt ist oft der schwerste.'
        },
        interventionen: [
          {
            titel: 'Engagementplan erstellen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Möglichkeit des Engagements möchtest du ausprobieren? Was sind die nächsten Schritte? Wen musst du kontaktieren? Gemeinsam einen konkreten Plan machen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Erste Kontaktaufnahme üben',
            beschreibung: 'Schreibe eine kurze Anfrage-E-Mail oder bereite ein Telefonat vor.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kontakt aufnehmen',
          beschreibung: 'Nimm diese Woche Kontakt zu einer Engagementmöglichkeit auf.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was fühlt sich richtig für dich an?',
          'Was hält dich noch zurück?'
        ]
      },
      {
        nr: 3,
        titel: 'Sinn durch Beitrag',
        dauer: '60 Min',
        ziel: 'Engagementerfahrung reflektieren; Ehrenamt als langfristige Ressource verankern',
        psychoedukation: {
          titel: 'Engagement und Sinn',
          inhalt: 'Menschen, die das Gefühl haben, etwas beigetragen zu haben, berichten von mehr Lebenszufriedenheit und weniger Stress. Ehrenamtliches Engagement ist eine der verlässlichsten Quellen von Sinn – unabhängig von Schule, Familie oder Freunden.'
        },
        interventionen: [
          {
            titel: 'Erste Erfahrung reflektieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wenn die erste Engagementerfahrung gemacht wurde: Was war gut? Was überraschend? Was war schwierig? Wie möchtest du weitermachen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sinn-Quellen kartieren',
            beschreibung: 'Was gibt dir Sinn – durch Engagement, Beziehungen, Kreativität, Glaube? Wie kannst du mehr davon in deinen Alltag bringen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Engagement fortführen',
          beschreibung: 'Plane, wie du dein Engagement in den nächsten Wochen weiterführen kannst.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was gibt dir in deinem Leben am meisten Sinn?'
        ]
      }
    ]
  },

  'jugendrecht': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Wissenslücken über ihre Rechte und Pflichten als Jugendliche in Luxemburg',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Rechte als Jugendliche/r',
        dauer: '60 Min',
        ziel: 'Grundlegende Jugendrechte kennen und verstehen',
        psychoedukation: {
          titel: 'Rechte geben Handlungsspielraum',
          inhalt: 'Jugendliche in Luxemburg haben konkrete Rechte: auf Bildung, Schutz, Gesundheit, Privatsphäre, freie Meinungsäußerung. Diese Rechte sind nicht abstrakt – sie gelten im Alltag. Wer seine Rechte kennt, kann sie einfordern.'
        },
        interventionen: [
          {
            titel: 'Rechte-Quiz',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Mit praktischen Alltagsbeispielen: Was darf ich ab wann? (Arztbesuch alleine, Konto, Ausgang, Arbeiten). Gemeinsam die wichtigsten Altersunterschiede klären.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Rechte in meinem Alltag',
            beschreibung: 'In welchen Situationen spielen deine Rechte eine Rolle – in der Schule, zu Hause, mit der Polizei?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Rechte-Recherche',
          beschreibung: 'Recherchiere ein konkretes Recht, das dich interessiert.',
          dauer: '15 Min'
        },
        reflexion: [
          'Welches Recht überrascht dich am meisten?',
          'In welcher Situation hättest du dein Recht gerne gewusst?'
        ]
      },
      {
        nr: 2,
        titel: 'Pflichten und Konsequenzen',
        dauer: '60 Min',
        ziel: 'Rechtliche Pflichten kennen; Konsequenzen von Regelbrüchen verstehen',
        psychoedukation: {
          titel: 'Rechte haben Pflichten',
          inhalt: 'Mit Rechten kommen Pflichten: Schulpflicht, Respekt vor dem Eigentum anderer, kein Schaden an Dritten. Bei Verstößen gibt es Konsequenzen – abhängig vom Alter. Das Jugendgericht in Luxemburg handelt anders als das Erwachsenengericht, aber auch es hat Konsequenzen.'
        },
        interventionen: [
          {
            titel: 'Fallbeispiele besprechen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Konkrete Szenarien besprechen: Was passiert wenn… (Ladendiebstahl, Schlägerei, Cybermobbing)? Welche rechtlichen Konsequenzen drohen? Was sind die Alternativen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Konsequenzen einschätzen',
            beschreibung: 'Für 3 Szenarien: Was wären die kurzfristigen und langfristigen Konsequenzen – rechtlich und persönlich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eigene Situation prüfen',
          beschreibung: 'Gibt es in deinem Umfeld etwas, das rechtlich problematisch sein könnte? Was könntest du tun?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was überrascht dich an den rechtlichen Konsequenzen?',
          'Wie beeinflusst das dein Verhalten?'
        ]
      },
      {
        nr: 3,
        titel: 'Recht in der Praxis',
        dauer: '60 Min',
        ziel: 'Anlaufstellen kennen; Rechte aktiv einfordern können',
        psychoedukation: {
          titel: 'Hilfe ist ein Recht',
          inhalt: 'Wer seine Rechte kennt und verletzt sieht, kann handeln: Behörden kontaktieren, Beratung suchen, Anzeige erstatten. Das ist kein Petzen – das ist Selbstschutz und gesellschaftliche Verantwortung.'
        },
        interventionen: [
          {
            titel: 'Anlaufstellen kennenlernen',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Welche Anlaufstellen gibt es in Luxemburg? (Ombudsmann, SCAS, Maison des jeunes, Polizei, OPJ). Für welches Problem welche Stelle?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Szenario-Training',
            beschreibung: 'Für ein konkretes Problem: An wen wendest du dich? Was sagst du? Durchspielen.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Anlaufstellen notieren',
          beschreibung: 'Schreibe dir 2–3 Anlaufstellen auf, die für dich relevant sein könnten.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'In welcher Situation wäre dieses Wissen nützlich?'
        ]
      }
    ]
  },

  'jugendschutz': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler in schutzrelevanten Situationen oder zur allgemeinen Prävention',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was mich schützt',
        dauer: '60 Min',
        ziel: 'Jugendschutzgesetze und Schutzrechte kennen',
        psychoedukation: {
          titel: 'Jugendschutz in Luxemburg',
          inhalt: 'Jugendschutz bedeutet: Der Staat hat eine Verantwortung, Kinder und Jugendliche vor Schaden zu schützen. Dazu gehören: Altersgrenzen für Alkohol, Tabak, Nacht, Arbeit – aber auch Schutz vor Gewalt, Vernachlässigung und Ausbeutung. Diese Schutzrechte gelten auch gegenüber Eltern.'
        },
        interventionen: [
          {
            titel: 'Schutzrechte erkunden',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Was schützt mich in Luxemburg? Gemeinsam die wichtigsten Schutzrechte und Altersgrenzen besprechen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schutzrechte im Alltag',
            beschreibung: 'In welchen Situationen hätte ich einen Anspruch auf Schutz gehabt oder habe ich ihn?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Situation einschätzen',
          beschreibung: 'Gibt es in deinem Umfeld etwas, das gegen Jugendschutz verstößt?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was überrascht dich an den Schutzrechten?',
          'Hast du dich jemals ungeschützt gefühlt?'
        ]
      },
      {
        nr: 2,
        titel: 'Wenn etwas nicht stimmt',
        dauer: '60 Min',
        ziel: 'Grenzverletzungen und Schutzrelevanz erkennen; Hilfe suchen',
        psychoedukation: {
          titel: 'Wenn Grenzen überschritten werden',
          inhalt: 'Nicht alles, was passiert, ist okay – auch nicht von Eltern oder Erwachsenen. Körperliche, psychische oder sexuelle Gewalt durch Erwachsene ist illegal und kein Familienproblem, das alleine gelöst werden muss. Es gibt Anlaufstellen, die vertraulich helfen.'
        },
        interventionen: [
          {
            titel: 'Grenzverletzungen benennen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Was sind Zeichen dafür, dass etwas nicht stimmt? Wann ist professionelle Hilfe wichtig? Ohne Druck – Raum für eigene Erfahrungen lassen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Anlaufstellen kennen',
            beschreibung: 'Welche Stellen helfen in Luxemburg bei Schutzrelevanz? (OPJ, SCAS, Krisentelefon). Nummern notieren.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vertrauensperson',
          beschreibung: 'Überlege: An wen könntest du dich wenden, wenn etwas nicht stimmt?',
          dauer: '10 Min'
        },
        reflexion: [
          'Gibt es etwas, das dich in deiner Situation besorgt?',
          'Was wäre nötig, damit du Hilfe holen würdest?'
        ]
      },
      {
        nr: 3,
        titel: 'Meldepflicht und Verantwortung',
        dauer: '60 Min',
        ziel: 'Meldepflicht und gesellschaftliche Verantwortung verstehen',
        psychoedukation: {
          titel: 'Verantwortung für andere',
          inhalt: 'In Luxemburg haben bestimmte Berufsgruppen Meldepflicht bei Kindsgefährdung. Aber auch als Privatperson kann und sollte man handeln, wenn jemand in Gefahr ist. Wegsehen ist keine neutrale Option.'
        },
        interventionen: [
          {
            titel: 'Was würde ich tun?',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Szenarien besprechen: Mein Freund zeigt Zeichen von Vernachlässigung – was tue ich? Ich sehe wie ein Erwachsener ein Kind misshandelt – was tue ich?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Handlungsplan erstellen',
            beschreibung: 'Für ein konkretes Szenario: Was genau tue ich? An wen wende ich mich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Verantwortung üben',
          beschreibung: 'Zeige diese Woche Verantwortung für jemanden in deinem Umfeld – auch in kleinen Dingen.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was würdest du anders machen, wenn du wüsstest, was du heute weißt?'
        ]
      }
    ]
  },

  'soziale-dienste': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler, die Unterstützungsangebote nicht kennen oder nicht nutzen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wer kann mir helfen?',
        dauer: '60 Min',
        ziel: 'Soziale Dienste und Beratungsangebote in Luxemburg kennen',
        psychoedukation: {
          titel: 'Hilfe annehmen ist Stärke',
          inhalt: 'Es gibt viele Unterstützungsangebote – aber viele Jugendliche nutzen sie nicht, weil sie sie nicht kennen, Angst vor Konsequenzen haben oder glauben, stark sein zu müssen. Hilfe suchen ist keine Schwäche. Es ist der klügste Schritt.'
        },
        interventionen: [
          {
            titel: 'Hilfsnetzwerk kartieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Welche Dienste gibt es in Luxemburg? (SCAS, OPJ, Kanner-Jugendtelefon, Maison des jeunes, Jugendberatung, Schulpsychologin). Für welches Problem welche Stelle?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Mein persönliches Hilfsnetz',
            beschreibung: 'Trage in eine Netzwerkkarte ein: Welche professionellen und persönlichen Unterstützungsquellen habe ich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eine Stelle recherchieren',
          beschreibung: 'Recherchiere eine Beratungsstelle, die für dich oder dein Umfeld relevant sein könnte.',
          dauer: '15 Min'
        },
        reflexion: [
          'Welche dieser Stellen war dir bisher nicht bekannt?',
          'Für welches Thema wärst du am ehesten bereit, Hilfe zu suchen?'
        ]
      },
      {
        nr: 2,
        titel: 'Hilfe in Anspruch nehmen',
        dauer: '60 Min',
        ziel: 'Hemmschwellen gegenüber professioneller Hilfe abbauen',
        psychoedukation: {
          titel: 'Wie ein erstes Gespräch abläuft',
          inhalt: 'Viele wissen nicht, was sie bei einer Beratungsstelle erwartet. Typisch: Ein erstes vertrauliches Gespräch, keine Verpflichtungen, Schweigepflicht (mit Ausnahmen). Man muss nicht alles sofort erzählen – es reicht, anzufangen.'
        },
        interventionen: [
          {
            titel: 'Erstkontakt vorbereiten',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was würdest du einer Beratungsstelle sagen? Was ist das Wichtigste? Rollenspiel: Wie ein erstes Gespräch beginnen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Barrieren benennen',
            beschreibung: 'Was hält dich oder andere davon ab, Hilfe zu suchen? Wie realistisch sind diese Bedenken?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ersten Kontakt wagen',
          beschreibung: 'Wenn du magst: Kontaktiere diese Woche eine Beratungsstelle – per Chat oder Telefon.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was macht es schwer, Hilfe zu suchen?',
          'Was wäre nötig, damit du den Schritt wagst?'
        ]
      },
      {
        nr: 3,
        titel: 'Für andere da sein',
        dauer: '60 Min',
        ziel: 'Anderen helfen, professionelle Unterstützung zu finden',
        psychoedukation: {
          titel: 'Aktive Unterstützung durch Peers',
          inhalt: 'Jugendliche suchen Hilfe am häufigsten bei Freunden. Wer gut informiert ist, kann andere weiterleiten – ohne selbst Therapeut spielen zu müssen. Das nennt sich aktive Unterstützung: Ich höre zu, ich leite weiter, ich bleibe dabei.'
        },
        interventionen: [
          {
            titel: 'Peer-Unterstützung üben',
            ansatz: 'Kommunikationstraining',
            beschreibung: 'Rollenspiel: Freund braucht Hilfe. Wie leite ich ihn weiter, ohne ihn zu überfordern oder alleinzulassen? Üben und Feedback geben.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Weiterleitungs-Karte',
            beschreibung: 'Erstelle eine Karte mit den wichtigsten Anlaufstellen – die du Freunden zeigen kannst.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Informationen teilen',
          beschreibung: 'Teile diese Woche eine wichtige Information über ein Hilfsangebot mit jemandem in deinem Umfeld.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Welche Anlaufstelle wäre für dich am wichtigsten?'
        ]
      }
    ]
  },

  'polizei-justiz': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Kontakten zum Strafrecht oder zur Prävention',
    sitzungen: [
      {
        nr: 1,
        titel: 'Polizei und meine Rechte',
        dauer: '60 Min',
        ziel: 'Rechte und Pflichten bei Polizeikontakten kennen',
        psychoedukation: {
          titel: 'Polizei – Rechte kennen',
          inhalt: 'Bei einem Polizeikontakt: Du hast das Recht zu schweigen. Du musst dich ausweisen. Du darfst keinen aggressiven Widerstand leisten. Du hast Recht auf einen Anwalt. Kooperativ zu bleiben schützt dich – auch wenn du dich ungerecht behandelt fühlst.'
        },
        interventionen: [
          {
            titel: 'Polizeikontakt-Szenarien',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Typische Szenarien besprechen: Kontrolle auf der Straße, Verdacht, Festnahme. Was darf die Polizei? Was darfst du? Was solltest du tun?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Rollenspiel Polizeikontakt',
            beschreibung: 'Übe, ruhig und respektvoll zu bleiben, deine Rechte zu kennen und keinen Fehler zu machen.',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Rechte notieren',
          beschreibung: 'Schreibe deine 5 wichtigsten Rechte bei einem Polizeikontakt auf.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hättest du bisher falsch gemacht?',
          'Was ist dir am wichtigsten zu wissen?'
        ]
      },
      {
        nr: 2,
        titel: 'Das Jugendgericht in Luxemburg',
        dauer: '60 Min',
        ziel: 'Jugendstrafrechtssystem verstehen; Konsequenzen von Straftaten kennen',
        psychoedukation: {
          titel: 'Jugendstrafrecht in Luxemburg',
          inhalt: 'Jugendliche unter 18 werden in Luxemburg nach dem Jugendschutzgesetz behandelt. Das Ziel ist Erziehung, nicht Bestrafung. Aber: Auch das Jugendgericht hat Konsequenzen – Auflagen, Sozialstunden, Heimunterbringung oder sogar Jugendgefängnis bei schweren Fällen.'
        },
        interventionen: [
          {
            titel: 'Verfahren verstehen',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Was passiert, wenn ein Jugendlicher straffällig wird? Welche Verfahrensschritte gibt es? Wer ist beteiligt?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Folgen einschätzen',
            beschreibung: 'Für 3 Straftaten: Was wären die möglichen Konsequenzen – kurzfristig, langfristig?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Reflexion',
          beschreibung: 'Gibt es in deinem Umfeld oder deiner Vergangenheit etwas, das vor Gericht hätte enden können?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was überrascht dich am Jugendstrafrecht?',
          'Was verändert das an deiner Einschätzung?'
        ]
      },
      {
        nr: 3,
        titel: 'Bürgerrechte und demokratische Teilhabe',
        dauer: '60 Min',
        ziel: 'Demokratische Grundrechte kennen; politische Teilhabe als Recht und Chance verstehen',
        psychoedukation: {
          titel: 'Demokratie braucht Teilnahme',
          inhalt: 'Bürgerrechte sind nicht nur Schutzrechte – sie sind auch Teilhaberechte: Meinungsfreiheit, Versammlungsfreiheit, Wahlrecht. Jugendliche können ab 16 wählen (in Luxemburg Gemeinderatswahlen). Wer nicht wählt oder sich nicht engagiert, überlässt anderen die Entscheidung.'
        },
        interventionen: [
          {
            titel: 'Bürgerrechte erkunden',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Welche Grundrechte haben Jugendliche in Luxemburg? Wie können sie sich politisch einbringen? Welche Möglichkeiten gibt es?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gesellschaftliches Engagement planen',
            beschreibung: 'Was interessiert dich politisch oder gesellschaftlich? Wie könntest du dich einbringen?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Politisches Thema erkunden',
          beschreibung: 'Recherchiere diese Woche ein politisches Thema, das dich betrifft.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du in deiner Gesellschaft verändern?'
        ]
      }
    ]
  },

  'buergerrechte': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit wenig demokratischem Bewusstsein oder Interesse an gesellschaftlicher Teilhabe',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was sind Bürgerrechte?',
        dauer: '60 Min',
        ziel: 'Grundlegende Bürgerrechte in Luxemburg kennen',
        psychoedukation: {
          titel: 'Rechte, die uns alle schützen',
          inhalt: 'Bürgerrechte schützen uns vor staatlichen Übergriffen und ermöglichen Teilhabe: Meinungsfreiheit, Versammlungsfreiheit, Religionsfreiheit, Gleichheit vor dem Gesetz. Diese Rechte wurden erkämpft – sie sind kein Selbstläufer. Wer sie nicht kennt, kann sie nicht verteidigen.'
        },
        interventionen: [
          {
            titel: 'Bürgerrechte-Inventur',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Welche Bürgerrechte gibt es in Luxemburg? Welche wurden in deinem Leben schon relevant? Gemeinsam erkunden.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Rechte im Alltag',
            beschreibung: 'In welchen Situationen nutzt du täglich Bürgerrechte, ohne es zu merken?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Recht vertiefen',
          beschreibung: 'Recherchiere ein Bürgerrecht, das dir besonders wichtig ist.',
          dauer: '15 Min'
        },
        reflexion: [
          'Welches Recht ist dir am wichtigsten?',
          'Gibt es ein Recht, das du gerne hättest, aber nicht hast?'
        ]
      },
      {
        nr: 2,
        titel: 'Demokratie – wie sie funktioniert',
        dauer: '60 Min',
        ziel: 'Demokratische Grundprinzipien verstehen; politisches System Luxemburgs kennen',
        psychoedukation: {
          titel: 'Demokratie ist kein Selbstläufer',
          inhalt: 'Demokratie basiert auf Teilhabe, freier Presse, unabhängiger Justiz und dem Recht auf Opposition. Ohne aktive Bürger degeneriert Demokratie. Jugendliche unterschätzen oft ihren Einfluss – aber Geschichte zeigt: Junge Menschen haben Gesellschaften verändert.'
        },
        interventionen: [
          {
            titel: 'Politisches System erkunden',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Wie funktioniert die Demokratie in Luxemburg? Welche Institutionen gibt es? Wie werden Entscheidungen getroffen?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Mein politisches Anliegen',
            beschreibung: 'Was möchtest du in deiner Gesellschaft verändern? An wen könntest du dich wenden?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Aktuelle Politik verfolgen',
          beschreibung: 'Verfolge diese Woche eine politische Entwicklung in Luxemburg.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was interessiert dich an Politik?',
          'Was interessiert dich gar nicht – und warum?'
        ]
      },
      {
        nr: 3,
        titel: 'Aktiv teilhaben',
        dauer: '60 Min',
        ziel: 'Möglichkeiten politischer und gesellschaftlicher Teilhabe kennen und nutzen',
        psychoedukation: {
          titel: 'Möglichkeiten zur Teilhabe',
          inhalt: 'Teilhabe ist mehr als wählen: Petitionen unterschreiben, demonstrieren, Leserbriefe schreiben, in Jugendräten aktiv sein, Organisationen unterstützen. Auch online gibt es Möglichkeiten – wenn man sie bewusst nutzt.'
        },
        interventionen: [
          {
            titel: 'Persönlicher Teilhabeplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was liegt mir am Herzen? Wie kann ich mich einbringen? Welche Möglichkeit ist realistisch für mich jetzt?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ersten Schritt wählen',
            beschreibung: 'Wähle eine konkrete Möglichkeit zur Teilhabe und plane den ersten Schritt.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Teilhabe ausprobieren',
          beschreibung: 'Setze diese Woche einen ersten Schritt zur gesellschaftlichen Teilhabe um.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du in deiner Gesellschaft verändern?'
        ]
      }
    ]
  },

  'diskriminierung': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Schüler mit Diskriminierungserfahrungen oder zur Sensibilisierung für alle',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Diskriminierung?',
        dauer: '60 Min',
        ziel: 'Diskriminierung erkennen und benennen; eigene Erfahrungen einordnen',
        psychoedukation: {
          titel: 'Diskriminierung definieren',
          inhalt: 'Diskriminierung bedeutet: Menschen werden wegen eines Merkmals (Hautfarbe, Herkunft, Geschlecht, Religion, Behinderung, sexuelle Orientierung) ungleich behandelt. Sie kann direkt sein (offene Beleidigung) oder indirekt (Strukturen, die bestimmte Gruppen benachteiligen).'
        },
        interventionen: [
          {
            titel: 'Diskriminierungserfahrungen erkunden',
            ansatz: 'Narrativ',
            beschreibung: 'Hast du selbst Diskriminierung erlebt – oder beobachtet? Was ist passiert? Wie hat es sich angefühlt? Raum geben ohne zu bagatellisieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Formen der Diskriminierung kennen',
            beschreibung: 'Benenne für 5 Diskriminierungsformen konkrete Beispiele aus dem Alltag von Jugendlichen.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtungsauftrag',
          beschreibung: 'Beobachte diese Woche, wann und wo Diskriminierung auftaucht – in deinem Umfeld oder in Medien.',
          dauer: 'täglich 3 Min'
        },
        reflexion: [
          'Welche Form von Diskriminierung betrifft dich persönlich?',
          'Was macht es schwer, über Diskriminierung zu sprechen?'
        ]
      },
      {
        nr: 2,
        titel: 'Auswirkungen und eigene Reaktionen',
        dauer: '60 Min',
        ziel: 'Auswirkungen von Diskriminierung auf Betroffene verstehen; eigene Reaktionen reflektieren',
        psychoedukation: {
          titel: 'Was Diskriminierung macht',
          inhalt: 'Diskriminierung hinterlässt Spuren: Misstrauen, Rückzug, Scham, Wut, vermindertes Selbstwertgefühl. Diese Reaktionen sind normal. Gleichzeitig muss niemand Diskriminierung akzeptieren oder sich daran gewöhnen.'
        },
        interventionen: [
          {
            titel: 'Auswirkungen benennen',
            ansatz: 'Emotionsfokussiert',
            beschreibung: 'Was hat die Diskriminierungserfahrung in dir ausgelöst? Wie hat sie dich verändert? Was trägst du noch mit dir?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Reaktionsmöglichkeiten',
            beschreibung: 'Was sind mögliche Reaktionen auf Diskriminierung? Welche fühlen sich richtig an? Welche schützen mich?',
            dauer: '20 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ressourcen aktivieren',
          beschreibung: 'Schreibe auf: Was hilft dir, trotz Diskriminierungserfahrungen stark zu bleiben?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hilft dir am meisten, mit Diskriminierung umzugehen?',
          'Was wünschst du dir von anderen?'
        ]
      },
      {
        nr: 3,
        titel: 'Gegenstrategien und Allyship',
        dauer: '60 Min',
        ziel: 'Handlungsmöglichkeiten gegen Diskriminierung kennen; Allyship verstehen',
        psychoedukation: {
          titel: 'Was ich tun kann',
          inhalt: 'Gegen Diskriminierung kann man vorgehen: Vorfälle melden (Polizei, Antidiskriminierungsstellen), Solidarität zeigen, eigene Vorurteile reflektieren. Allyship bedeutet: als nicht-Betroffener für Betroffene einzustehen – nicht für sie sprechen, sondern Raum geben und unterstützen.'
        },
        interventionen: [
          {
            titel: 'Gegenstrategien entwickeln',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Für eine konkrete Diskriminierungssituation: Was könnte ich tun? Als Betroffene/r? Als Zeuge? Gemeinsam Strategien entwickeln.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Anlaufstellen kennen',
            beschreibung: 'Welche Antidiskriminierungsstellen gibt es in Luxemburg? Wie kann ich Vorfälle melden?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Allyship zeigen',
          beschreibung: 'Zeige diese Woche Solidarität mit jemandem, der Diskriminierung erlebt.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Was möchtest du gegen Diskriminierung tun?'
        ]
      }
    ]
  },

  'selbstbild': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche, die ihr Selbstbild klären und stärken möchten',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wer bin ich? – Selbstwahrnehmung',
        dauer: '60 Min',
        ziel: 'Die eigene Selbstwahrnehmung bewusst machen und beschreiben',
        psychoedukation: {
          titel: 'Selbstbild und Fremdbild',
          inhalt: 'Das Selbstbild ist, wie wir uns selbst sehen – geprägt durch Erfahrungen, Rückmeldungen und innere Überzeugungen. Es unterscheidet sich oft vom Fremdbild (wie andere uns sehen). Beides beeinflusst unser Verhalten und Wohlbefinden.'
        },
        interventionen: [
          {
            titel: 'Eigenschafts-Collage',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Jugendliche wählen 10 Adjektive, die sie auf sich beziehen würden. Dann: Welche davon kommen von innen, welche von außen (Rückmeldungen anderer)?',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Spiegel-Übung',
            beschreibung: 'Schreibe 5 Dinge auf, die du an dir schätzt – ohne die Meinung anderer. Was siehst du, wenn du ehrlich hinschaust?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Tagebucheintrag: Ich heute',
          beschreibung: 'Schreibe abends auf, wie du dich heute wahrgenommen hast. Was war positiv, was negativ?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was überrascht dich an deinem Selbstbild?',
          'Woher kommen deine Überzeugungen über dich?'
        ]
      },
      {
        nr: 2,
        titel: 'Stärken und Schwächen realistisch sehen',
        dauer: '60 Min',
        ziel: 'Ein realistisches, ausgewogenes Selbstbild entwickeln',
        psychoedukation: {
          titel: 'Stärken-Schwächen-Balance',
          inhalt: 'Ein gesundes Selbstbild bedeutet nicht, keine Schwächen zu haben – sondern sie realistisch einzuschätzen und Stärken gleichwertig anzuerkennen. Selbstkritik ist hilfreich, wenn sie konstruktiv ist; destruktive Selbstkritik schadet.'
        },
        interventionen: [
          {
            titel: 'SWOT-Analyse persönlich',
            ansatz: 'Kognitiv-behavioural',
            beschreibung: 'Persönliche SWOT-Analyse: Stärken, Schwächen, Chancen, Risiken. Fokus: Was kann ich aus meinen Stärken machen? Wie gehe ich mit Schwächen konstruktiv um?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Stärkenbrief',
            beschreibung: 'Schreibe dir selbst einen Brief, in dem du deine drei größten Stärken anerkennst und begründest, warum sie wertvoll sind.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stärken beobachten',
          beschreibung: 'Notiere diese Woche jeden Tag eine Situation, in der du eine Stärke gezeigt hast.',
          dauer: '10 Min'
        },
        reflexion: [
          'Fällt es dir leichter, Stärken oder Schwächen zu benennen?',
          'Was hindert dich daran, deine Stärken anzuerkennen?'
        ]
      },
      {
        nr: 3,
        titel: 'Innere Kritik und Selbstmitgefühl',
        dauer: '60 Min',
        ziel: 'Den inneren Kritiker kennen und mit Selbstmitgefühl begegnen',
        psychoedukation: {
          titel: 'Der innere Kritiker',
          inhalt: 'Viele Menschen haben eine innere Stimme, die sie bewertet und kritisiert. Diese Stimme entstand oft durch Erfahrungen. Selbstmitgefühl bedeutet, sich selbst so zu behandeln wie einen guten Freund – mit Verständnis statt Verurteilung.'
        },
        interventionen: [
          {
            titel: 'Innerer-Kritiker-Dialog',
            ansatz: 'Schematherapeutisch',
            beschreibung: 'Was sagt dein innerer Kritiker typischerweise? Schreibe es auf. Dann: Was würdest du einem guten Freund in dieser Situation sagen? Vergleiche beide Stimmen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Selbstmitgefühls-Brief',
            beschreibung: 'Schreibe dir einen Brief über eine Situation, in der du Fehler gemacht hast – mit dem Mitgefühl, das du einem Freund schenken würdest.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kritiker-Tagebuch',
          beschreibung: 'Notiere diese Woche, wann dein innerer Kritiker laut wird. Was löst ihn aus? Was hilft, ihn zu beruhigen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann ist dein innerer Kritiker hilfreich, wann schädlich?',
          'Was brauchst du, um freundlicher mit dir zu sein?'
        ]
      },
      {
        nr: 4,
        titel: 'Mein Selbstbild – gestern, heute, morgen',
        dauer: '60 Min',
        ziel: 'Das Selbstbild als veränderlich und wachstumsfähig erleben',
        psychoedukation: {
          titel: 'Growth Mindset',
          inhalt: 'Das Selbstbild ist keine feste Größe – es entwickelt sich. Wer glaubt, sich verändern zu können (Growth Mindset), geht offener mit Herausforderungen um. Vergangene Erfahrungen prägen, bestimmen aber nicht die Zukunft.'
        },
        interventionen: [
          {
            titel: 'Zeitstrahl des Selbstbildes',
            ansatz: 'Narrativ',
            beschreibung: 'Zeichne einen Zeitstrahl: Wie habe ich mich früher gesehen? Wie sehe ich mich heute? Wie möchte ich mich in 5 Jahren sehen? Was hat sich verändert?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Vision meines Selbst',
            beschreibung: 'Beschreibe in 5 Sätzen, wie dein zukünftiges Ich aussehen soll. Was will es verkörpern?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Wachstums-Schritt',
          beschreibung: 'Wähle eine kleine Handlung diese Woche, die dich deinem Wunsch-Selbstbild näher bringt.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hat dein Selbstbild am meisten geprägt?',
          'Was möchtest du an deinem Selbstbild verändern?'
        ]
      }
    ]
  },

  'werte-moral': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Jugendliche, die eigene Werte und moralische Orientierung entwickeln möchten',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist mir wichtig? – Werte entdecken',
        dauer: '60 Min',
        ziel: 'Eigene Werte benennen und ihre Herkunft verstehen',
        psychoedukation: {
          titel: 'Was sind Werte?',
          inhalt: 'Werte sind innere Leitprinzipien, die unser Handeln und Urteilen leiten – z.B. Ehrlichkeit, Loyalität, Freiheit. Sie entstehen durch Familie, Kultur, Erfahrungen. Wer seine Werte kennt, trifft Entscheidungen leichter und lebt authentischer.'
        },
        interventionen: [
          {
            titel: 'Werte-Kartenspiel',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Aus einer Sammlung von 30 Werte-Karten (z.B. Freiheit, Sicherheit, Familie, Abenteuer) wählt der Jugendliche seine Top 5. Anschließend Begründung und Vergleich.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Werte-Stammbaum',
            beschreibung: 'Welche Werte haben dir wichtige Menschen in deinem Leben mitgegeben? Zeichne einen Stammbaum deiner Werte.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Werte im Alltag beobachten',
          beschreibung: 'Achte diese Woche darauf, wann du einen deiner Werte lebst – und wann du dich gezwungen siehst, gegen ihn zu handeln.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welcher Wert ist dir am wichtigsten? Warum?',
          'Gibt es Werte, die dir aufgezwungen wurden und die du nicht teilst?'
        ]
      },
      {
        nr: 2,
        titel: 'Moralische Dilemmata – Entscheidungen treffen',
        dauer: '60 Min',
        ziel: 'Eigene moralische Urteilsfähigkeit stärken',
        psychoedukation: {
          titel: 'Moralische Entwicklung',
          inhalt: 'Moral entwickelt sich – von "was belohnt wird" über "was Regeln sagen" bis hin zu "was ich für richtig halte". Dilemmata helfen, die eigene Moral zu verstehen: Gibt es ein eindeutiges Richtig und Falsch?'
        },
        interventionen: [
          {
            titel: 'Dilemma-Diskussion',
            ansatz: 'Sokratisch',
            beschreibung: 'Bearbeitung eines Dilemmas (z.B. "Ein Freund hat gestohlen – sagst du es?"). Fragen: Was würdest du tun? Was wäre richtig? Was wären die Konsequenzen? Gibt es einen Unterschied?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Pro-Contra-Tabelle',
            beschreibung: 'Erstelle für das Dilemma eine Pro-Contra-Tabelle aus verschiedenen Perspektiven (meiner, der Betroffenen, der Gesellschaft).',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eigenes Dilemma',
          beschreibung: 'Beschreibe eine Situation aus deinem Leben, in der du eine schwierige moralische Entscheidung getroffen hast. Was hat dir dabei geholfen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann handelst du nach deinen Werten, wann dagegen?',
          'Was macht eine Entscheidung für dich "moralisch richtig"?'
        ]
      },
      {
        nr: 3,
        titel: 'Werte in Konflikten und Beziehungen',
        dauer: '60 Min',
        ziel: 'Werte in sozialen Situationen vertreten und Kompromisse finden',
        psychoedukation: {
          titel: 'Wertekonflikte',
          inhalt: 'Manchmal kollidieren unsere Werte mit denen anderer – oder unsere eigenen Werte widersprechen sich (z.B. Loyalität vs. Ehrlichkeit). Wer das erkennt, kann konstruktiver mit Konflikten umgehen.'
        },
        interventionen: [
          {
            titel: 'Werte-Konflikt-Analyse',
            ansatz: 'Systemisch',
            beschreibung: 'Beschreibe einen aktuellen Konflikt. Welche Werte stehen dahinter (bei dir? beim anderen)? Wo gibt es Überschneidungen, wo Unterschiede? Was wäre ein Kompromiss?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Werte-Ranking',
            beschreibung: 'Wenn zwei deiner Werte in Konflikt geraten – welcher hat Vorrang? Erstelle eine persönliche Hierarchie deiner Top-5-Werte.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Werte kommunizieren',
          beschreibung: 'Sprich diese Woche mit jemandem über einen Wert, der dir wichtig ist. Wie reagiert die Person? Was lernst du daraus?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie verteidigst du deine Werte, ohne andere zu verurteilen?',
          'Was nimmst du aus diesem Modul für dein Leben mit?'
        ]
      }
    ]
  },

  'kulturelle-identitaet': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Jugendliche mit Migrationshintergrund oder bikultureller Biographie',
    sitzungen: [
      {
        nr: 1,
        titel: 'Meine Herkunft – Schatz und Bürde',
        dauer: '60 Min',
        ziel: 'Kulturelle Herkunft als Teil der Identität reflektieren',
        psychoedukation: {
          titel: 'Kulturelle Identität',
          inhalt: 'Kulturelle Identität umfasst Sprache, Traditionen, Werte und Zugehörigkeiten, die uns durch Herkunft geprägt haben. Bei bikulturell aufgewachsenen Jugendlichen entstehen oft zwei oder mehr Identitätsanteile, die manchmal in Spannung stehen.'
        },
        interventionen: [
          {
            titel: 'Kulturelle Landkarte',
            ansatz: 'Narrativ',
            beschreibung: 'Erstelle eine Karte deiner kulturellen Identität: Woher komme ich? Welche Sprachen spreche ich? Welche Traditionen kenne ich? Was übernehme ich, was lehne ich ab?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Stolz und Herausforderung',
            beschreibung: 'Nenne 3 Dinge aus deiner Herkunftskultur, auf die du stolz bist – und eine Sache, die dich herausfordert.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Interview mit Familie',
          beschreibung: 'Frage ein Familienmitglied: Was bedeutet unsere Kultur/Herkunft für dich? Was soll ich davon weitergeben?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was bedeutet "Herkunft" für dich?',
          'Wann bist du auf deine Herkunft stolz, wann fühlt sie sich wie Last an?'
        ]
      },
      {
        nr: 2,
        titel: 'Zwischen den Welten – Bikulturelle Identität',
        dauer: '60 Min',
        ziel: 'Herausforderungen und Chancen bikultureller Identität erkennen',
        psychoedukation: {
          titel: 'Bikulturalität',
          inhalt: 'Zwischen zwei Kulturen zu leben kann bereichernd sein – aber auch belasten: Welchen Erwartungen soll ich gerecht werden? "Bin ich X oder Y genug?" Diese Fragen sind normal. Das Ziel ist nicht, sich zu entscheiden, sondern beide Anteile zu integrieren.'
        },
        interventionen: [
          {
            titel: 'Zwei-Welten-Analyse',
            ansatz: 'Systemisch',
            beschreibung: 'Welche Regeln, Werte und Erwartungen gibt es in Kultur A und Kultur B? Wo überschneiden sie sich, wo widersprechen sie sich? Was machst du mit dem Widerspruch?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ich bin beides',
            beschreibung: 'Schreibe 5 Sätze, die mit "Ich bin X, und ich bin auch Y" beginnen – beides integriert ohne Wertung.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Code-Switching beobachten',
          beschreibung: 'Wechsle ich je nach Umfeld, wie ich spreche oder mich verhalte? Beobachte das diese Woche. Was löst das in dir aus?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann fühlst du dich "zerrissen"? Wann "bereichert"?',
          'Was hilft dir, in beiden Welten zu Hause zu sein?'
        ]
      },
      {
        nr: 3,
        titel: 'Meine eigene Identität gestalten',
        dauer: '60 Min',
        ziel: 'Eine eigene, integrierte kulturelle Identität entwickeln',
        psychoedukation: {
          titel: 'Identitätssynthese',
          inhalt: 'Eine gesunde bikulturelle Identität bedeutet: Ich wähle, was ich aus verschiedenen Kulturen übernehme. Ich lasse mich nicht definieren – ich definiere mich selbst. Das ist ein aktiver, lebenslanger Prozess.'
        },
        interventionen: [
          {
            titel: 'Identitäts-Manifest',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Schreibe ein persönliches Identitäts-Manifest: Wer bin ich? Was nehme ich aus welcher Kultur? Was lehne ich ab? Was erfinde ich neu? Kein Richtig oder Falsch.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Zukunftsvision Identität',
            beschreibung: 'Wie möchte ich in 10 Jahren auf meine kulturelle Identität zurückblicken? Was soll Teil von mir sein?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Identitätsobjekt',
          beschreibung: 'Suche ein Objekt, das deine kulturelle Identität symbolisiert. Bringe es zur nächsten Sitzung mit oder beschreibe es.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was macht deine kulturelle Identität einzigartig?',
          'Was möchtest du an deine Kinder weitergeben?'
        ]
      }
    ]
  },

  'geschlechtsidentitaet': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Jugendliche, die ihre Geschlechtsidentität erkunden oder klären möchten',
    sitzungen: [
      {
        nr: 1,
        titel: 'Geschlecht verstehen – mehr als Biologie',
        dauer: '60 Min',
        ziel: 'Unterschied zwischen biologischem Geschlecht, Geschlechtsidentität und Geschlechtsausdruck verstehen',
        psychoedukation: {
          titel: 'Geschlecht ist vielfältig',
          inhalt: 'Biologisches Geschlecht (Sex), Geschlechtsidentität (inneres Erleben) und Geschlechtsausdruck (wie man sich zeigt) sind drei verschiedene Dimensionen. Geschlecht ist ein Spektrum – nicht nur "männlich" oder "weiblich". Das Verständnis davon wächst weltweit.'
        },
        interventionen: [
          {
            titel: 'Spektrum-Reflexion',
            ansatz: 'Aufklärend',
            beschreibung: 'Visuelles Modell der drei Dimensionen (Biologisches Geschlecht / Identität / Ausdruck). Jugendliche markieren auf jedem Spektrum, wo sie sich verorten – ohne Bewertung, mit Offenheit.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Wörter und Gefühle',
            beschreibung: 'Welche Wörter beschreiben dein Erleben von Geschlecht? (z.B. Frau, Mann, non-binär, queer, keines davon...) Wie fühlt sich jedes Wort an?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtung im Alltag',
          beschreibung: 'Achte diese Woche darauf, wie Geschlechterrollen in deinem Alltag sichtbar werden (Werbung, Schule, Familie). Was fällt dir auf?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was bedeutet Geschlecht für dich persönlich?',
          'Welche Fragen hast du zu deiner eigenen Geschlechtsidentität?'
        ]
      },
      {
        nr: 2,
        titel: 'Meine Geschlechtsidentität – Erkundung',
        dauer: '60 Min',
        ziel: 'Die eigene Geschlechtsidentität erkunden und ausdrücken',
        psychoedukation: {
          titel: 'Identitätsentwicklung und Geschlecht',
          inhalt: 'Die Auseinandersetzung mit der eigenen Geschlechtsidentität ist ein normaler Teil der Adoleszenz. Manche Jugendliche erleben eine klare Identität, andere brauchen Zeit zur Erkundung. Beides ist in Ordnung. Es gibt keine Pflicht zur Entscheidung.'
        },
        interventionen: [
          {
            titel: 'Identitäts-Collage',
            ansatz: 'Kreativ-expressiv',
            beschreibung: 'Erstelle eine Collage oder Zeichnung: Wie möchtest du dich zeigen? Was fühlt sich authentisch an? Kleidung, Farben, Symbole, Wörter – alles erlaubt.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ich bin... (Satzanfänge)',
            beschreibung: 'Vollende 10 Sätze, die mit "Als Mädchen/Junge/Person bin ich..." oder "Ich fühle mich, wenn..." beginnen. Ohne Zensur.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vorbild suchen',
          beschreibung: 'Suche eine Person (real oder aus Medien), die deine Geschlechtsidentität auf positive Weise verkörpert. Was bewunderst du an ihr/ihm/ihnen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was fühlst du, wenn du an deine Geschlechtsidentität denkst?',
          'Wann fühlst du dich in deiner Identität wohl, wann nicht?'
        ]
      },
      {
        nr: 3,
        titel: 'Identität und soziales Umfeld',
        dauer: '60 Min',
        ziel: 'Umgang mit sozialen Erwartungen und Unterstützung finden',
        psychoedukation: {
          titel: 'Coming-out und soziale Reaktionen',
          inhalt: 'Ein Coming-out – falls gewünscht – ist ein persönlicher Prozess ohne Zeitdruck. Nicht jeder muss sich "outen". Wichtig ist: sichere Vertrauenspersonen zu haben, die Unterstützung bieten. Diskriminierung ist nicht deine Schuld.'
        },
        interventionen: [
          {
            titel: 'Unterstützungsnetz kartieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Wer in meinem Umfeld kennt und akzeptiert meine Identität? Wer noch nicht? Wer wäre eine sichere Person zum Reden? Erstelle eine Karte deines Unterstützungsnetzes.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Antworten vorbereiten',
            beschreibung: 'Was sage ich, wenn jemand eine verletzende Frage stellt? Entwickle 2–3 Antworten, mit denen du dich sicher fühlst.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ressourcen erkunden',
          beschreibung: 'Recherchiere eine Anlaufstelle (z.B. LSBT+ Beratungsstelle in Luxemburg), die dir bei Fragen helfen könnte.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was brauchst du, um dich sicher und akzeptiert zu fühlen?',
          'Wer ist die Person, der du am meisten vertraust?'
        ]
      }
    ]
  },

  'spiritualitaet': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Jugendliche, die Sinn, Glaube und innere Orientierung erkunden möchten',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was bedeutet Spiritualität für mich?',
        dauer: '60 Min',
        ziel: 'Eigenes Verständnis von Spiritualität, Glaube und Sinn entwickeln',
        psychoedukation: {
          titel: 'Spiritualität ist vielfältig',
          inhalt: 'Spiritualität ist nicht dasselbe wie Religion, obwohl sie sich überschneiden können. Sie umfasst das Suchen nach Sinn, Transzendenz, innerer Stille, Verbundenheit oder Werten jenseits des Alltags. Jeder Mensch entwickelt seine eigene Spiritualität.'
        },
        interventionen: [
          {
            titel: 'Spiritualitäts-Landkarte',
            ansatz: 'Reflektiv',
            beschreibung: 'Was gehört zu meiner Spiritualität? (Religion, Natur, Meditation, Musik, Verbundenheit?) Erstelle eine visuelle Karte deiner spirituellen Welt.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Momente der Stille',
            beschreibung: 'Erinnere dich an einen Moment, der sich "heilig", besonders oder tiefgründig angefühlt hat. Was war das? Was hat er ausgelöst?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stille-Erfahrung',
          beschreibung: 'Nimm dir diese Woche 10 Minuten für Stille (Natur, Meditation, Gebet oder einfach sein). Was erlebst du dabei?',
          dauer: '10 Min'
        },
        reflexion: [
          'Glaubst du an etwas, das größer ist als du selbst?',
          'Was gibt dir im Leben Halt und Orientierung?'
        ]
      },
      {
        nr: 2,
        titel: 'Glaube, Zweifel und Fragen',
        dauer: '60 Min',
        ziel: 'Mit Glaubensfragen und Zweifeln konstruktiv umgehen',
        psychoedukation: {
          titel: 'Zweifel als Teil des Glaubens',
          inhalt: 'Zweifel gehören zur spirituellen Entwicklung. Viele religiöse und philosophische Traditionen sehen Fragen als Zeichen von Wachstum. Es gibt keine Pflicht zu Gewissheit. Wichtig ist, ehrlich mit den eigenen Fragen umzugehen.'
        },
        interventionen: [
          {
            titel: 'Glaubensfragen erforschen',
            ansatz: 'Sokratisch',
            beschreibung: 'Was glaubst du? Was zweifelst du? Was weißt du nicht? Strukturierte Reflexion in drei Spalten: Mein Glaube / Meine Zweifel / Meine offenen Fragen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief an das Universum',
            beschreibung: 'Schreibe einen Brief an Gott, das Universum oder das Leben selbst – mit deinen Fragen, Hoffnungen und Zweifeln.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Spirituelle Ressource',
          beschreibung: 'Suche ein Gebet, ein Zitat, eine Musik oder ein Ritual, das dir Kraft gibt. Bring es zur nächsten Sitzung.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie gehst du mit Fragen um, die keine Antwort haben?',
          'Was stärkt deinen Glauben oder dein Vertrauen ins Leben?'
        ]
      },
      {
        nr: 3,
        titel: 'Spiritualität als Ressource im Alltag',
        dauer: '60 Min',
        ziel: 'Spiritualität als Kraftquelle im Alltag nutzen',
        psychoedukation: {
          titel: 'Spiritualität und psychische Gesundheit',
          inhalt: 'Forschungen zeigen: Spiritualität und Religiosität können psychische Resilienz stärken – durch Sinngebung, Gemeinschaft, Rituale und Hoffnung. Das gilt unabhängig davon, welcher Tradition jemand angehört.'
        },
        interventionen: [
          {
            titel: 'Rituale entwickeln',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Welche kleinen täglichen Rituale geben mir Halt? (Morgengebet, Dankbarkeitsmoment, Naturspaziergang...) Entwickle ein persönliches Ritual für schwierige Tage.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Dankbarkeits-Meditation',
            beschreibung: 'Kurze Dankbarkeitsmeditation: 5 Dinge, für die du heute dankbar bist. Spüre das Gefühl der Dankbarkeit im Körper.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ritual praktizieren',
          beschreibung: 'Führe das entwickelte Ritual diese Woche täglich durch. Was verändert sich?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie hilft dir Spiritualität in schwierigen Zeiten?',
          'Was möchtest du an spiritueller Praxis in deinen Alltag integrieren?'
        ]
      }
    ]
  },

  'zugehoerigkeit': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Jugendliche, die Zugehörigkeit vermissen oder Ausgrenzung erleben',
    sitzungen: [
      {
        nr: 1,
        titel: 'Wo gehöre ich dazu?',
        dauer: '60 Min',
        ziel: 'Eigene Zugehörigkeitsgefühle und -bedürfnisse erkennen',
        psychoedukation: {
          titel: 'Zugehörigkeit als Grundbedürfnis',
          inhalt: 'Das Bedürfnis nach Zugehörigkeit ist ein grundlegendes menschliches Bedürfnis. Fehlende Zugehörigkeit kann Einsamkeit, Schmerz und Rückzug auslösen. Zugehörigkeit bedeutet: sich gesehen, angenommen und Teil von etwas zu fühlen.'
        },
        interventionen: [
          {
            titel: 'Zugehörigkeits-Kreise',
            ansatz: 'Systemisch',
            beschreibung: 'Zeichne konzentrische Kreise: Ich in der Mitte, dann Gruppen/Menschen, zu denen ich gehöre (Familie, Freunde, Schule, Verein...). Wie stark fühle ich mich wo zugehörig? Farbkodierung: stark/mittel/schwach.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Zugehörigkeits-Momente',
            beschreibung: 'Erinnere dich an 3 Momente, in denen du dich wirklich zugehörig gefühlt hast. Was hat diese Momente ermöglicht?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtung: Wann fühle ich mich dazu?',
          beschreibung: 'Notiere diese Woche Situationen, in denen du Zugehörigkeit gespürt hast – und Situationen, in denen du sie vermisst hast.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was brauche ich, um mich zugehörig zu fühlen?',
          'Gibt es Orte oder Gruppen, wo du dich nie ganz dazugehörig fühlst?'
        ]
      },
      {
        nr: 2,
        titel: 'Ausgrenzung und Einsamkeit',
        dauer: '60 Min',
        ziel: 'Ausgrenzungserfahrungen verarbeiten und Ressourcen stärken',
        psychoedukation: {
          titel: 'Soziale Ausgrenzung',
          inhalt: 'Soziale Ausgrenzung – ob durch Mobbing, Ignorieren oder Anderssein – tut körperlich weh. Das ist wissenschaftlich belegt. Wer ausgeschlossen wird, reagiert oft mit Rückzug oder Überanpassung. Beides ist verständlich – aber es gibt andere Wege.'
        },
        interventionen: [
          {
            titel: 'Ausgrenzungs-Analyse',
            ansatz: 'Kognitiv-behavioural',
            beschreibung: 'Beschreibe eine Ausgrenzungssituation. Was ist passiert? Was habe ich gedacht/gefühlt? Was habe ich getan? Was hätte ich gebraucht? Gemeinsam alternative Reaktionen entwickeln.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Selbstmitgefühl bei Einsamkeit',
            beschreibung: 'Schreibe dir in einem Brief, was du einem Freund sagen würdest, der sich genauso einsam fühlt wie du gerade.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Verbindung suchen',
          beschreibung: 'Nimm diese Woche bewusst Kontakt zu jemandem auf, dem du dich verbunden fühlst – auch wenn es nur eine Nachricht ist.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie reagierst du, wenn du dich ausgeschlossen fühlst?',
          'Was hilft dir, nicht in Isolation zu versinken?'
        ]
      },
      {
        nr: 3,
        titel: 'Zugehörigkeit aktiv gestalten',
        dauer: '60 Min',
        ziel: 'Neue Zugehörigkeiten aufbauen und Verbindungen stärken',
        psychoedukation: {
          titel: 'Zugehörigkeit gestalten',
          inhalt: 'Zugehörigkeit passiert selten von allein – sie entsteht durch Engagement, Verletzlichkeit und gemeinsame Erfahrungen. Wer aktiv Verbindungen sucht, hat mehr Chancen, diese zu finden. Auch online-Gemeinschaften können echte Zugehörigkeit schaffen.'
        },
        interventionen: [
          {
            titel: 'Zugehörigkeits-Aktionsplan',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Wo möchte ich mehr Zugehörigkeit erleben? Was kann ich konkret tun? (Verein beitreten, Gespräch suchen, Gruppe gründen...) Konkrete nächste Schritte formulieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Meine Gemeinschaft',
            beschreibung: 'Beschreibe die Gemeinschaft, die du dir wünschst. Was teilt sie? Welche Werte hat sie? Wo könntest du sie finden?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Erster Schritt',
          beschreibung: 'Setze diese Woche einen konkreten ersten Schritt, um eine neue Verbindung oder Zugehörigkeit zu stärken.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hindert dich daran, Zugehörigkeit zu suchen?',
          'Was nimmst du aus diesem Modul mit?'
        ]
      }
    ]
  },

  'lebenssinn': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche, die nach Sinn und Lebensrichtung suchen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was gibt meinem Leben Sinn?',
        dauer: '60 Min',
        ziel: 'Persönliche Sinnquellen entdecken und benennen',
        psychoedukation: {
          titel: 'Sinn als psychologisches Grundbedürfnis',
          inhalt: 'Viktor Frankl und andere Psychologen zeigen: Menschen brauchen Sinn, um psychisch gesund zu bleiben. Sinn kann kommen aus Beziehungen, Leistung, Werten, Erfahrungen oder Leiden. Er ist individuell – nicht jeder findet ihn am gleichen Ort.'
        },
        interventionen: [
          {
            titel: 'Sinnquellen-Karte',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Welche Tätigkeiten, Beziehungen oder Momente geben dir das Gefühl, dass dein Leben bedeutungsvoll ist? Erstelle eine Karte deiner persönlichen Sinnquellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Flow-Momente',
            beschreibung: 'Wann bist du völlig vertieft in eine Tätigkeit – vergisst Zeit und Raum? Was sagt das über deine Stärken und Werte aus?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Sinn-Tagebuch',
          beschreibung: 'Notiere diese Woche abends eine Sache, die sich heute bedeutungsvoll angefühlt hat – auch kleine Dinge zählen.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wann hast du zuletzt das Gefühl gehabt, dass dein Leben Sinn hat?',
          'Was wäre sinnlos, wenn du es nicht tätest?'
        ]
      },
      {
        nr: 2,
        titel: 'Lebensziele und Visionen',
        dauer: '60 Min',
        ziel: 'Eigene Lebensziele und -visionen entwickeln',
        psychoedukation: {
          titel: 'Ziele und Sinn',
          inhalt: 'Lebensziele geben Richtung und Motivation. Wichtig ist der Unterschied: Ziele, die aus Werten kommen ("Ich will anderen helfen"), tragen nachhaltiger als Ziele, die aus Druck entstehen ("Ich soll Arzt werden"). Eigene Ziele fühlen sich anders an als aufgezwungene.'
        },
        interventionen: [
          {
            titel: 'Lebensrad',
            ansatz: 'Coaching',
            beschreibung: 'Das Lebensrad: 8 Lebensbereiche (Familie, Freundschaft, Gesundheit, Schule/Arbeit, Hobbies, Spiritualität, Finanzen, persönliches Wachstum). Wie zufrieden bin ich in jedem Bereich? Was möchte ich entwickeln?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: '5-Jahres-Brief',
            beschreibung: 'Schreibe dir selbst einen Brief aus der Zukunft (in 5 Jahren): Was hat sich erfüllt? Was bist du jetzt? Was war das Wichtigste?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ein Ziel, ein Schritt',
          beschreibung: 'Wähle ein Lebensziel aus dem Lebensrad. Was ist der kleinstmögliche erste Schritt dorthin? Tue ihn diese Woche.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Ziele kommen wirklich von dir – welche von anderen?',
          'Was würdest du bereuen, wenn du es nie versucht hättest?'
        ]
      },
      {
        nr: 3,
        titel: 'Sinn in schwierigen Zeiten',
        dauer: '60 Min',
        ziel: 'Sinn auch in Leid und Herausforderungen finden',
        psychoedukation: {
          titel: 'Posttraumatisches Wachstum',
          inhalt: 'Viele Menschen finden gerade durch schwierige Erfahrungen tieferen Sinn. Das nennt man posttraumatisches Wachstum. Sinn bedeutet nicht, dass alles gut ist – sondern dass man einen Rahmen hat, der Schwieriges erträglich macht.'
        },
        interventionen: [
          {
            titel: 'Sinn in der Krise',
            ansatz: 'Logotherapeutisch',
            beschreibung: 'Beschreibe eine schwierige Erfahrung. Was hast du daraus gelernt? Was hat sie dir gegeben (auch wenn du sie nicht wolltest)? Wo liegt ein möglicher Sinn?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Resilienz-Anker',
            beschreibung: 'Was hat dir in deiner schwierigsten Zeit Halt gegeben? Eine Person, ein Glaube, ein Ziel? Benenne deinen persönlichen Resilienz-Anker.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Dankbarkeit für Schwieriges',
          beschreibung: 'Schreibe über eine schwierige Erfahrung, für die du – mit Abstand – irgendwie dankbar bist. Was hat sie dir gegeben?',
          dauer: '10 Min'
        },
        reflexion: [
          'Glaubst du, dass schwierige Erfahrungen Sinn haben können?',
          'Was gibt dir Kraft, wenn das Leben keinen Sinn zu machen scheint?'
        ]
      },
      {
        nr: 4,
        titel: 'Mein Lebensauftrag',
        dauer: '60 Min',
        ziel: 'Ein persönliches Leitbild und Lebensauftrag formulieren',
        psychoedukation: {
          titel: 'Ikigai – Sinn des Lebens',
          inhalt: 'Das japanische Konzept "Ikigai" beschreibt den Sinn als Schnittmenge von: Was ich liebe / Was ich gut kann / Was die Welt braucht / Womit ich meinen Lebensunterhalt verdienen kann. Diese Schnittmenge zu finden gibt tiefe Erfüllung.'
        },
        interventionen: [
          {
            titel: 'Ikigai-Diagramm',
            ansatz: 'Werteorientiert',
            beschreibung: 'Erstelle ein persönliches Ikigai-Diagramm: 4 Kreise, die sich überschneiden. In jeden Kreis Antworten auf die vier Ikigai-Fragen. Was liegt in der Mitte?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Persönliches Mission-Statement',
            beschreibung: 'Formuliere in 1–2 Sätzen deinen persönlichen Lebensauftrag: "Ich bin hier, um..."',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Auftrag leben',
          beschreibung: 'Wie kannst du diese Woche eine kleine Handlung tun, die deinem Lebensauftrag entspricht?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was ist dein Beitrag zur Welt?',
          'Was möchtest du nach dir hinterlassen?'
        ]
      }
    ]
  },

  'krisenintervention': {
    dauer: '3 Sitzungen · ca. 3 Std.',
    zielgruppe: 'Jugendliche in akuten oder post-akuten Krisensituationen',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist eine Krise? – Verstehen und Stabilisieren',
        dauer: '60 Min',
        ziel: 'Die aktuelle Krise einordnen und erste Stabilisierung erreichen',
        psychoedukation: {
          titel: 'Krisen sind vorübergehend',
          inhalt: 'Eine Krise ist ein vorübergehender Zustand intensiver emotionaler Belastung, der die normalen Bewältigungsmechanismen überfordert. Krisen sind schmerzhaft – aber sie gehen vorbei. Jede Krise enthält auch die Möglichkeit zur Veränderung.'
        },
        interventionen: [
          {
            titel: 'Krisenlandkarte',
            ansatz: 'Stabilisierend',
            beschreibung: 'Was ist passiert? Wer ist betroffen? Was hat sich verändert? Gemeinsam die Krise strukturieren, um Chaos zu reduzieren und einen klaren Überblick zu gewinnen.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: '5-4-3-2-1 Grounding',
            beschreibung: '5 Dinge sehen, 4 hören, 3 fühlen, 2 riechen, 1 schmecken. Diese Übung aktiviert die Sinne und hilft, im Hier und Jetzt zu bleiben.',
            dauer: '10 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Sicherheitsliste',
          beschreibung: 'Erstelle eine Liste mit 3 Dingen, die dir Sicherheit geben (Personen, Orte, Tätigkeiten). Halte sie griffbereit.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was brauchst du gerade am dringendsten?',
          'Wer oder was gibt dir in dieser Krise Halt?'
        ]
      },
      {
        nr: 2,
        titel: 'Ressourcen aktivieren',
        dauer: '60 Min',
        ziel: 'Persönliche und soziale Ressourcen zur Krisenbewältigung aktivieren',
        psychoedukation: {
          titel: 'Ressourcen in der Krise',
          inhalt: 'In einer Krise vergessen wir oft, was uns normalerweise hilft. Ressourcen können sein: Personen, Tätigkeiten, innere Stärken, Überzeugungen, Spiritualität. Sie zu kennen und zu aktivieren ist ein zentraler Teil der Krisenbewältigung.'
        },
        interventionen: [
          {
            titel: 'Ressourcen-Inventar',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was hat mir früher in schwierigen Situationen geholfen? Welche Menschen kann ich anrufen? Was gibt mir Kraft? Gemeinsam eine konkrete Ressourcen-Liste erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sichere Ort Imagination',
            beschreibung: 'Stelle dir einen sicheren, geborgenen Ort vor (real oder imaginär). Beschreibe ihn in Detail: Wie sieht er aus? Was fühlst du dort? Nutze ihn als inneren Rückzugsort.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Notfallkoffer',
          beschreibung: 'Erstelle einen persönlichen "Notfallkoffer" (Liste oder Box): Was hilft mir in sehr schwierigen Momenten? Musik, Foto, Kontakt, Übung...',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Ressource hat dich bisher am meisten getragen?',
          'Was fehlte dir in dieser Krise am meisten?'
        ]
      },
      {
        nr: 3,
        titel: 'Krise als Wendepunkt',
        dauer: '60 Min',
        ziel: 'Lernen aus der Krise und Rückfallprävention planen',
        psychoedukation: {
          titel: 'Nach der Krise',
          inhalt: 'Krisen hinterlassen Spuren – und können Wachstumspunkte sein. Wichtig ist, nach einer Krise zu reflektieren: Was hat sie ausgelöst? Was hat geholfen? Wie kann ich mich besser schützen? Präventionsplanung ist kein Zeichen von Schwäche, sondern von Stärke.'
        },
        interventionen: [
          {
            titel: 'Krisenanalyse und Lernpunkte',
            ansatz: 'Kognitiv-reflektiv',
            beschreibung: 'Rückblick auf die Krise: Was hat sie ausgelöst? Was hat geholfen, was nicht? Was würde ich beim nächsten Mal anders machen? Persönlichen Krisenplan erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Krisenplan schreiben',
            beschreibung: 'Schreibe einen persönlichen Krisenplan: Frühwarnzeichen / Was mir hilft / Wen ich anrufe / Was ich nicht tue / Notfallnummern.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Krisenplan sichern',
          beschreibung: 'Speichere deinen Krisenplan als Foto auf dem Handy oder hinterlege ihn bei einer Vertrauensperson.',
          dauer: '5 Min'
        },
        reflexion: [
          'Was hast du in dieser Krise über dich gelernt?',
          'Was möchtest du in Zukunft anders machen?'
        ]
      }
    ]
  },

  'trauma': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche mit traumatischen Erfahrungen (stabilisierungsphase)',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was passiert bei Trauma? – Verstehen',
        dauer: '60 Min',
        ziel: 'Trauma-Reaktionen normalisieren und verstehen',
        psychoedukation: {
          titel: 'Trauma und das Gehirn',
          inhalt: 'Traumatische Erfahrungen hinterlassen Spuren im Nervensystem. Das Gehirn reagiert mit Kampf, Flucht oder Erstarrung. Flashbacks, Albträume, Schreckhaftigkeit oder emotionale Taubheit sind normale Reaktionen auf abnormale Ereignisse – keine Zeichen von Schwäche.'
        },
        interventionen: [
          {
            titel: 'Trauma-Psychoedukation interaktiv',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Erklärung des Ampel-Modells: Grün (sicher), Gelb (aktiviert), Rot (überwältigt). Wo befinde ich mich? Was sind meine typischen Signale in jeder Zone?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Körper-Scanning',
            beschreibung: 'Langsamer Körper-Scan: Wo spüre ich gerade Anspannung, Enge, Wärme? Ohne Bewertung – nur beobachten.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ampel-Tagebuch',
          beschreibung: 'Notiere diese Woche täglich, in welcher Ampelzone du dich befunden hast. Was hat die Zone ausgelöst?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hat sich in deinem Körper und Verhalten verändert seit dem Erlebnis?',
          'Was hilft dir, dich sicherer zu fühlen?'
        ]
      },
      {
        nr: 2,
        titel: 'Stabilisierung und Sicherheit',
        dauer: '60 Min',
        ziel: 'Stabilisierungstechniken erlernen und anwenden',
        psychoedukation: {
          titel: 'Stabilisierung vor Verarbeitung',
          inhalt: 'Trauma-Therapie beginnt immer mit Stabilisierung. Das bedeutet: sicherer Ort, Körper beruhigen, Alltag strukturieren. Erst wenn jemand stabil genug ist, können traumatische Inhalte bearbeitet werden. Stabilisierung ist kein Umweg – sie ist der erste notwendige Schritt.'
        },
        interventionen: [
          {
            titel: 'Ressourcen-Aktivierung',
            ansatz: 'EMDR-informiert',
            beschreibung: 'Positive Ressource aktivieren: Erinnerung an einen Moment, in dem ich mich sicher und stark gefühlt habe. Details ausmalen, Körpergefühl spüren. Diese Ressource als Anker verankern.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Atem-Beruhigung',
            beschreibung: 'Verlängerte Ausatmung: 4 Sekunden einatmen, 6 Sekunden ausatmen. Parasympathikus aktivieren, Nervensystem beruhigen.',
            dauer: '10 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stabilisierungsroutine',
          beschreibung: 'Wähle eine Stabilisierungsübung (Atem, Grounding, sicherer Ort) und übe sie täglich 5 Minuten.',
          dauer: '5 Min täglich'
        },
        reflexion: [
          'Welche Übung hat sich am hilfreichsten angefühlt?',
          'Wann wirst du die Übung im Alltag nutzen?'
        ]
      },
      {
        nr: 3,
        titel: 'Trigger erkennen und umgehen',
        dauer: '60 Min',
        ziel: 'Traumatische Auslöser kennen und Umgang entwickeln',
        psychoedukation: {
          titel: 'Was sind Trigger?',
          inhalt: 'Trigger sind Reize (Geräusche, Gerüche, Situationen, Worte), die an das Trauma erinnern und starke Reaktionen auslösen. Das Gehirn verwechselt Vergangenheit mit Gegenwart. Das ist normal – und es gibt Strategien damit umzugehen.'
        },
        interventionen: [
          {
            titel: 'Trigger-Landkarte',
            ansatz: 'Kognitiv-behavioural',
            beschreibung: 'Welche Situationen, Orte, Personen, Gefühle, Geräusche oder Gerüche lösen starke Reaktionen aus? Gemeinsam eine Trigger-Karte erstellen – ohne die Trigger zu aktivieren.',
            dauer: '20 Min'
          }
        ],
        uebungen: [
          {
            titel: 'STOP-Technik',
            beschreibung: 'Bei Trigger: Stop (innehalten) / Take a breath (atmen) / Observe (beobachten was passiert) / Proceed (weitermachen mit Bewusstsein). Üben mit fiktivem Szenario.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Trigger-Protokoll',
          beschreibung: 'Notiere diese Woche, wenn du getriggert wirst: Was war der Auslöser? Was habe ich getan? Was hat geholfen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Trigger sind am schwierigsten für dich?',
          'Was hilft dir, wieder in die Gegenwart zu kommen?'
        ]
      },
      {
        nr: 4,
        titel: 'Weiterleben – Zukunft gestalten',
        dauer: '60 Min',
        ziel: 'Positive Zukunftsperspektive trotz traumatischer Vergangenheit entwickeln',
        psychoedukation: {
          titel: 'Trauma und Identität',
          inhalt: 'Traumatische Erfahrungen prägen – aber sie definieren nicht, wer wir sind. Viele Überlebende berichten von persönlichem Wachstum ("posttraumatisches Wachstum"): mehr Dankbarkeit, tiefere Beziehungen, neue Prioritäten. Das Ziel ist: das Trauma integrieren – nicht vergessen.'
        },
        interventionen: [
          {
            titel: 'Lebensgeschichte neu schreiben',
            ansatz: 'Narrativ',
            beschreibung: 'Meine Geschichte: Was ist passiert (kurz). Was habe ich überlebt. Was das über mich aussagt. Wie ich jetzt weiterleben möchte. Fokus auf Stärke und Handlungsfähigkeit.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief an mein jüngeres Ich',
            beschreibung: 'Schreibe einen Brief an dich selbst zum Zeitpunkt des Traumas: Was würdest du dir sagen? Was wüsstest du heute, was du damals nicht wusstest?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Ein kleiner Schritt vorwärts',
          beschreibung: 'Wähle eine Sache, die du diese Woche tun möchtest – die zum Leben, nicht zum Überleben gehört.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wer bist du jenseits deines Traumas?',
          'Was möchtest du in deinem Leben trotz allem noch erleben?'
        ]
      }
    ]
  },

  'suizidpraevention': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche mit Suizidgedanken oder nach Suizidversuch (stabilisierungsphase)',
    sitzungen: [
      {
        nr: 1,
        titel: 'Über Suizidgedanken sprechen – Tabu brechen',
        dauer: '60 Min',
        ziel: 'Suizidgedanken offen und sicher thematisieren',
        psychoedukation: {
          titel: 'Suizidgedanken sind häufiger als wir denken',
          inhalt: 'Viele Menschen haben in schwierigen Zeiten Gedanken daran, das Leben zu beenden. Das ist kein Zeichen von Schwäche – sondern ein Zeichen extremen Schmerzes. Über diese Gedanken zu sprechen erhöht nicht das Risiko – es senkt es. Schweigen macht es schlimmer.'
        },
        interventionen: [
          {
            titel: 'Suizidgedanken einordnen',
            ansatz: 'Sicherheitscheck',
            beschreibung: 'Wie intensiv sind die Gedanken? (Wunsch zu sterben / Gedanken an Suizid / konkrete Pläne / Vorbereitungen?) Strukturiertes Einschätzungsgespräch – ohne Wertung, mit Fürsorge.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gründe zum Leben',
            beschreibung: 'Was hält mich am Leben? Was möchte ich noch erleben? Wer würde mich vermissen? Auch kleine Dinge zählen – eine Person, ein Tier, ein Traum.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gründe-Liste aufbewahren',
          beschreibung: 'Schreibe deine Gründe zum Leben auf und bewahre sie griffbereit auf – für Momente, in denen du sie brauchst.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hat dich bisher davon abgehalten, die Gedanken in die Tat umzusetzen?',
          'Wem kannst du vertrauen, wenn es dir sehr schlecht geht?'
        ]
      },
      {
        nr: 2,
        titel: 'Den Schmerz verstehen',
        dauer: '60 Min',
        ziel: 'Den Schmerz hinter Suizidgedanken erkennen und benennen',
        psychoedukation: {
          titel: 'Suizidgedanken als Schmerzsignal',
          inhalt: 'Suizidgedanken sind oft ein Zeichen, dass jemand extreme psychische Schmerzen erlebt – und keinen anderen Ausweg sieht. Ziel ist nicht der Tod selbst, sondern das Ende des Schmerzes. Wenn wir den Schmerz verstehen, können wir andere Wege finden.'
        },
        interventionen: [
          {
            titel: 'Schmerzlandkarte',
            ansatz: 'Emotionsfokussiert',
            beschreibung: 'Was tut so weh? Woher kommt der Schmerz? Wie lange hält er schon an? Wann ist er am stärksten? Gemeinsam den Schmerz konkret benennen statt ihn abstrakt zu lassen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schmerz und Bedürfnis',
            beschreibung: 'Hinter jedem Schmerz steckt ein unerfülltes Bedürfnis. Was brauche ich wirklich? (Zugehörigkeit, Liebe, Anerkennung, Kontrolle, Ruhe?)',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Schmerz-Tagebuch',
          beschreibung: 'Notiere diese Woche, wann der Schmerz stärker oder schwächer ist. Was beeinflusst ihn?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was wäre, wenn du nicht sterben müsstest – nur der Schmerz aufhören?',
          'Was bräuchtest du, damit es dir besser geht?'
        ]
      },
      {
        nr: 3,
        titel: 'Sicherheitsplan erstellen',
        dauer: '60 Min',
        ziel: 'Einen persönlichen Sicherheitsplan für Krisen entwickeln',
        psychoedukation: {
          titel: 'Was ist ein Sicherheitsplan?',
          inhalt: 'Ein Sicherheitsplan ist ein persönlicher Notfallplan für suizidale Krisen. Er hilft, gefährliche Momente zu überstehen. Er enthält: Warnzeichen, was mir hilft, wen ich anrufe, Krisentelefone. Er muss vor der nächsten Krise fertig sein – nicht in ihr.'
        },
        interventionen: [
          {
            titel: 'Sicherheitsplan gemeinsam erstellen',
            ansatz: 'Sicherheitsplanung (Stanley & Brown)',
            beschreibung: 'Schritt für Schritt: 1) Warnzeichen / 2) Ablenkungen und Coping / 3) Soziale Kontakte / 4) Professionelle Hilfe / 5) Mittel sichern / 6) Gründe zum Leben.',
            dauer: '30 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Sicherheitsplan testen',
            beschreibung: 'Gehe den Plan durch: Würde ich ihn wirklich nutzen? Gibt es Lücken? Passe ihn gemeinsam mit dem Fachkraft an.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Plan verfügbar machen',
          beschreibung: 'Speichere den Sicherheitsplan auf dem Handy, drucke ihn aus oder gib ihn einer Vertrauensperson. Stelle sicher, dass du ihn in einer Krise findest.',
          dauer: '10 Min'
        },
        reflexion: [
          'Kannst du dir vorstellen, diesen Plan in einer Krise zu nutzen?',
          'Wer weiß, dass dieser Plan existiert?'
        ]
      },
      {
        nr: 4,
        titel: 'Weiter leben – Hoffnung und Zukunft',
        dauer: '60 Min',
        ziel: 'Hoffnung und Zukunftsperspektive aufbauen',
        psychoedukation: {
          titel: 'Hoffnung ist lernbar',
          inhalt: 'Hoffnung bedeutet nicht, dass alles gut sein wird – sondern dass Veränderung möglich ist. Hoffnung kann man aufbauen: durch kleine Ziele, positive Erfahrungen, Verbindung zu anderen. Sie entsteht langsam – und das ist in Ordnung.'
        },
        interventionen: [
          {
            titel: 'Hoffnungs-Galerie',
            ansatz: 'Lösungsfokussiert',
            beschreibung: 'Was könnte besser werden? In einem Monat? In einem Jahr? Was wünschst du dir für dein Leben? Bilder, Sätze oder Symbole sammeln.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Brief in die Zukunft',
            beschreibung: 'Schreibe dir einen Brief, den du in einem Jahr lesen wirst: Was hoffst du, dass sich verändert hat? Was möchtest du dir sagen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Kleines Ziel',
          beschreibung: 'Wähle ein kleines, erreichbares Ziel für diese Woche – etwas, das Leben bedeutet.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was gibst du nicht auf, auch wenn es schwer ist?',
          'Wer oder was hält die Hoffnung in dir am Leben?'
        ]
      }
    ]
  },

  'selbstverletzung': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche mit selbstverletzendem Verhalten',
    sitzungen: [
      {
        nr: 1,
        titel: 'Selbstverletzung verstehen – ohne Scham',
        dauer: '60 Min',
        ziel: 'Selbstverletzendes Verhalten als Bewältigungsstrategie verstehen',
        psychoedukation: {
          titel: 'Selbstverletzung ist kein Versagen',
          inhalt: 'Selbstverletzung ist oft eine Strategie, um mit unerträglichen Gefühlen umzugehen – nicht Aufmerksamkeitssuche oder Manipulation. Sie gibt kurzfristige Erleichterung, löst aber das Grundproblem nicht. Kein Urteil – nur Verständnis und gemeinsame Suche nach anderen Wegen.'
        },
        interventionen: [
          {
            titel: 'Funktion verstehen',
            ansatz: 'DBT-informiert',
            beschreibung: 'Was passiert vor der Selbstverletzung? (Auslöser) Was passiert dabei? (Gefühle) Was passiert danach? (Konsequenzen) Gemeinsam den Kreislauf ohne Wertung analysieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühlsbarometer',
            beschreibung: 'Beschreibe die Gefühle vor der Selbstverletzung auf einer Skala von 1–10. Was macht den Unterschied zwischen einem "3" und einem "9"-Moment?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Auslöser-Tagebuch',
          beschreibung: 'Notiere diese Woche, wann der Drang zur Selbstverletzung auftritt. Was ist passiert? Was hast du gefühlt?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was gibt dir die Selbstverletzung, das du anders nicht bekommst?',
          'Was wäre, wenn du das auch anders bekommen könntest?'
        ]
      },
      {
        nr: 2,
        titel: 'Alternativen entwickeln',
        dauer: '60 Min',
        ziel: 'Alternative Bewältigungsstrategien entwickeln und erproben',
        psychoedukation: {
          titel: 'Alternativen zur Selbstverletzung',
          inhalt: 'Alternativen müssen dieselbe Funktion erfüllen wie die Selbstverletzung: starke Gefühle entladen, Kontrolle geben, Erleichterung schaffen. Was für eine Person funktioniert, passt nicht für alle. Es braucht Ausprobieren ohne Druck.'
        },
        interventionen: [
          {
            titel: 'Alternativen-Kiste',
            ansatz: 'DBT-Skills',
            beschreibung: 'Gemeinsam eine Liste von Alternativen erstellen (körperlich intensive Tätigkeiten, Kälte/Wärme-Reize, Ablenkung, emotionale Entladung, soziale Verbindung). Welche passen zu mir? Was bin ich bereit auszuprobieren?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Alternative ausprobieren',
            beschreibung: 'Wähle eine Alternative und probiere sie in der Sitzung kurz aus (z.B. Eiswürfel halten, intensiv atmen, reißen von Papier). Wie fühlt es sich an?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Alternativen-Box',
          beschreibung: 'Erstelle eine physische oder digitale "Notfall-Box" mit deinen Top-3-Alternativen. Stelle sie griffbereit.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Alternative hat sich am besten angefühlt?',
          'Was macht es schwer, eine Alternative zu nutzen?'
        ]
      },
      {
        nr: 3,
        titel: 'Emotionsregulation stärken',
        dauer: '60 Min',
        ziel: 'Werkzeuge zur Emotionsregulation erlernen',
        psychoedukation: {
          titel: 'Emotionen regulieren',
          inhalt: 'Emotionsregulation bedeutet: Gefühle weder zu unterdrücken noch von ihnen überwältigt zu werden. Es geht darum, Gefühle zu spüren, sie zu benennen und mit ihnen umzugehen. Das ist eine Fähigkeit, die man lernen kann.'
        },
        interventionen: [
          {
            titel: 'TIPP-Skills',
            ansatz: 'DBT',
            beschreibung: 'TIPP: Temperatur (kaltes Wasser ins Gesicht) / Intensives Training / Paced Breathing (verlangsamtes Atmen) / Progressive Muskelentspannung. Jede Technik kurz erklären und ausprobieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Gefühle benennen',
            beschreibung: 'Gefühlsrad: Wähle das Gefühl, das am stärksten ist. Dann: Woher kommt es? Was brauche ich? Was kann ich tun?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Emotionsregulations-Übung täglich',
          beschreibung: 'Wähle einen TIPP-Skill und übe ihn täglich – auch wenn kein Drang da ist. So wird er verfügbar, wenn er gebraucht wird.',
          dauer: '5 Min täglich'
        },
        reflexion: [
          'Welcher Skill fühlt sich am einfachsten an?',
          'Kannst du dir vorstellen, ihn in einer schwierigen Situation zu nutzen?'
        ]
      },
      {
        nr: 4,
        titel: 'Langfristige Veränderung und Unterstützung',
        dauer: '60 Min',
        ziel: 'Unterstützungsnetz stärken und langfristige Perspektive entwickeln',
        psychoedukation: {
          titel: 'Veränderung braucht Zeit',
          inhalt: 'Selbstverletzendes Verhalten aufzugeben braucht Zeit und Rückschläge sind normal. Kein Rückfall bedeutet Versagen – sondern ein Zeichen, dass du weiter übst. Langfristige Veränderung braucht professionelle Unterstützung, nicht nur Willenskraft.'
        },
        interventionen: [
          {
            titel: 'Unterstützungsnetz stärken',
            ansatz: 'Systemisch',
            beschreibung: 'Wer weiß von der Selbstverletzung? Wen könnte ich ins Vertrauen ziehen? Welche Fachperson unterstützt mich? Gemeinsam ein reales Unterstützungsnetz mit konkreten Personen und Kontakten erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Zukunftsblick ohne Selbstverletzung',
            beschreibung: 'Stelle dir vor, in einem Jahr ohne Selbstverletzung zu leben. Wie fühlt es sich an? Was ist anders? Was hast du gewonnen?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Vertrauensperson informieren',
          beschreibung: 'Sprich mit einer Vertrauensperson über deine Arbeit an diesem Thema – du musst nicht alles sagen, aber jemanden einweihen.',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat sich in den letzten Wochen verändert?',
          'Welche nächsten Schritte möchtest du gehen?'
        ]
      }
    ]
  },

  'gewalt': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche, die Gewalt erlebt oder ausgeübt haben',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Gewalt? – Formen erkennen',
        dauer: '60 Min',
        ziel: 'Verschiedene Gewaltformen erkennen und benennen',
        psychoedukation: {
          titel: 'Gewalt hat viele Gesichter',
          inhalt: 'Gewalt umfasst körperliche, emotionale, sexuelle und strukturelle Gewalt. Emotionale Gewalt (Erniedrigung, Kontrolle, Isolation) wird oft unterschätzt, hinterlässt aber tiefe Spuren. Gewalt ist immer ein Macht- und Kontrollmittel – und sie ist nie die Schuld des Opfers.'
        },
        interventionen: [
          {
            titel: 'Gewaltformen-Analyse',
            ansatz: 'Psychoedukativ',
            beschreibung: 'Unterschiedliche Gewaltformen besprechen und Beispiele aus dem Alltag erkennen. Interaktive Diskussion: Was ist Gewalt? Was ist "normal"? Wo ziehe ich die Grenze?',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Grenzen kennen',
            beschreibung: 'Zeichne einen Körperumriss. Was gehört zu dir – und was darf kein anderer ohne Erlaubnis? Körperliche und emotionale Grenzen markieren.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Beobachtung im Alltag',
          beschreibung: 'Achte diese Woche auf Situationen, in denen Grenzen verletzt werden – in der Schule, im TV, in der Familie. Was fällt dir auf?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wo hast du Gewalt erlebt oder gesehen?',
          'Was hat dich dabei am meisten getroffen?'
        ]
      },
      {
        nr: 2,
        titel: 'Gewalt als Erfahrung verarbeiten',
        dauer: '60 Min',
        ziel: 'Erlebte Gewalt benennen und erste Verarbeitung beginnen',
        psychoedukation: {
          titel: 'Gewalt hinterlässt Spuren',
          inhalt: 'Wer Gewalt erlebt hat, trägt das oft lange in sich – als Scham, Wut, Taubheit oder Angst. Das sind normale Reaktionen. Zu reden ist ein erster Schritt zur Heilung. Die erlebte Gewalt war nie deine Schuld.'
        },
        interventionen: [
          {
            titel: 'Erfahrung sicher benennen',
            ansatz: 'Traumasensibel',
            beschreibung: 'Was ist passiert (so viel wie sicher ist)? Wie hast du damals reagiert? Wie geht es dir heute damit? Kein Druck – in dem Tempo, das sich sicher anfühlt.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Schuld und Verantwortung trennen',
            beschreibung: 'Wer trägt die Verantwortung für die Gewalt? Gemeinsam klar machen: die Verantwortung liegt immer bei der ausübenden Person.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Brief an mein jüngeres Ich',
          beschreibung: 'Schreibe (wenn du magst) einen Brief an dich in der Zeit der Gewalterfahrung: Was möchtest du dir sagen?',
          dauer: '10 Min'
        },
        reflexion: [
          'Wie hat die Gewalt dein Bild von dir selbst beeinflusst?',
          'Was brauchst du, um dich sicherer zu fühlen?'
        ]
      },
      {
        nr: 3,
        titel: 'Gewalt und eigene Reaktionen',
        dauer: '60 Min',
        ziel: 'Eigene Gewaltbereitschaft reflektieren und Alternativen entwickeln',
        psychoedukation: {
          titel: 'Gewalt lernt man',
          inhalt: 'Wer Gewalt erlebt hat, trägt manchmal das Muster in sich – und gibt es weiter. Das ist kein Versagen, sondern erlernte Reaktion. Wer das erkennt, kann es ändern. Niemand ist "gewalttätig von Natur aus" – Gewalt ist immer erlerntes Verhalten.'
        },
        interventionen: [
          {
            titel: 'Eskalations-Analyse',
            ansatz: 'Kognitiv-behavioural',
            beschreibung: 'Wann werde ich selbst gewalttätig oder aggressiv? Was geht davor? Was spüre ich im Körper? Was löst es aus? Gemeinsam den eigenen Eskalationspfad verstehen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'De-Eskalationsstrategien',
            beschreibung: 'Was hilft mir, bevor ich die Kontrolle verliere? (Raus gehen, atmen, zählen, Hilfe holen) Eigene Top-3-Strategien entwickeln.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eskalations-Protokoll',
          beschreibung: 'Notiere diese Woche, wann du aggressiv wirst oder werden könntest. Was war der Auslöser? Was hast du getan?',
          dauer: '10 Min'
        },
        reflexion: [
          'Was löst bei dir Aggression aus?',
          'Was hilft dir, nicht gewalttätig zu werden?'
        ]
      },
      {
        nr: 4,
        titel: 'Gewalt beenden – Sicherheit schaffen',
        dauer: '60 Min',
        ziel: 'Konkrete Schritte zur Sicherheit und Gewaltfreiheit planen',
        psychoedukation: {
          titel: 'Sicherheit ist ein Recht',
          inhalt: 'Jeder Mensch hat das Recht, in Sicherheit zu leben – frei von Gewalt. Wenn Gewalt im direkten Umfeld stattfindet, ist es wichtig, Hilfe zu holen. Das ist kein Verrat – sondern Selbstschutz. Es gibt Anlaufstellen, die helfen können.'
        },
        interventionen: [
          {
            titel: 'Sicherheitsplan bei häuslicher Gewalt',
            ansatz: 'Sicherheitsplanung',
            beschreibung: 'Falls Gewalt im Umfeld stattfindet: Wer kann helfen? Wohin kann ich gehen? Was nehme ich mit? Wichtige Nummern kennen. Sicherheitsplan konkret erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Notfallnummern',
            beschreibung: 'Welche Stellen in Luxemburg helfen bei Gewalt? (Kanner-Jugendtelefon, VISAVI, SOS-Maltraitance...) Nummern sammeln und speichern.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Eine Schutzmaßnahme',
          beschreibung: 'Wähle eine konkrete Schutzmaßnahme, die du diese Woche umsetzen kannst.',
          dauer: '10 Min'
        },
        reflexion: [
          'Was hat sich für dich durch dieses Modul verändert?',
          'Was nimmst du mit für deine Sicherheit?'
        ]
      }
    ]
  },

  'resilienz': {
    dauer: '4 Sitzungen · ca. 4 Std.',
    zielgruppe: 'Jugendliche, die ihre Widerstandskraft stärken möchten',
    sitzungen: [
      {
        nr: 1,
        titel: 'Was ist Resilienz?',
        dauer: '60 Min',
        ziel: 'Resilienz verstehen und eigene Resilienzfaktoren entdecken',
        psychoedukation: {
          titel: 'Resilienz ist lernbar',
          inhalt: 'Resilienz ist die Fähigkeit, nach schwierigen Erfahrungen wieder aufzustehen – wie ein Gummiband, das sich zurückformt. Sie ist keine angeborene Eigenschaft, sondern erlernbar. Resilienz entsteht durch: enge Beziehungen, Selbstwirksamkeit, Sinnorientierung und Copingstrategien.'
        },
        interventionen: [
          {
            titel: 'Resilienz-Anker identifizieren',
            ansatz: 'Ressourcenorientiert',
            beschreibung: 'Was hat dir in vergangenen schwierigen Zeiten geholfen? Welche Ressourcen hast du genutzt? Gemeinsam eine persönliche Resilienz-Landkarte erstellen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Ich habe überlebt',
            beschreibung: 'Denke an eine schwierige Zeit, die du überstanden hast. Was hat dir dabei geholfen? Was sagt das über deine Stärken aus?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Stärken-Radar',
          beschreibung: 'Frage zwei Personen, die dich kennen: Was siehst du als meine größte Stärke? Wie reagierst du auf die Antworten?',
          dauer: '15 Min'
        },
        reflexion: [
          'Was hat dich bisher stark gemacht?',
          'Welche deiner Stärken nimmst du noch nicht wahr?'
        ]
      },
      {
        nr: 2,
        titel: 'Denkmuster und Resilienz',
        dauer: '60 Min',
        ziel: 'Resiliente Denkmuster entwickeln',
        psychoedukation: {
          titel: 'Wie wir denken, beeinflusst wie wir fühlen',
          inhalt: 'Resiliente Menschen interpretieren Rückschläge anders: nicht als persönliches Versagen ("Ich bin ein Versager"), sondern als vorübergehende Situation ("Das ist gerade schwierig"). Diese Denkweise nennt man Attribution – und sie ist veränderbar.'
        },
        interventionen: [
          {
            titel: 'Gedanken umformulieren',
            ansatz: 'Kognitiv-behavioural',
            beschreibung: 'Stelle einem negativen, starren Gedanken einen flexibleren, realistischeren gegenüber. Nicht "positiv denken", sondern realistischer denken. Üben mit konkreten Beispielen.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Was kann ich beeinflussen?',
            beschreibung: 'Trenne die Situation in: Was liegt in meiner Kontrolle? Was nicht? Fokussiere Energie auf das, was du beeinflussen kannst.',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Gedanken-Protokoll',
          beschreibung: 'Notiere diese Woche, wenn ein negativer Gedanke auftaucht. Formuliere ihn realistischer um.',
          dauer: '10 Min'
        },
        reflexion: [
          'Welche Gedankenmuster hindern dich an Resilienz?',
          'Wann denkst du am resilientesten?'
        ]
      },
      {
        nr: 3,
        titel: 'Beziehungen als Schutzfaktor',
        dauer: '60 Min',
        ziel: 'Schützende Beziehungen erkennen und stärken',
        psychoedukation: {
          titel: 'Verbundenheit schützt',
          inhalt: 'Einer der wichtigsten Resilienzfaktoren ist: mindestens eine stabile, vertrauensvolle Beziehung zu haben. Soziale Unterstützung puffert Stress ab und gibt Halt. Diese Beziehungen können aktiv gepflegt werden.'
        },
        interventionen: [
          {
            titel: 'Beziehungs-Inventar',
            ansatz: 'Systemisch',
            beschreibung: 'Wer steht mir bei, wenn es mir schlecht geht? Wer glaubt an mich? Wer hört zu? Gemeinsam schützende Beziehungen kartieren und Lücken identifizieren.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Dankbarkeit ausdrücken',
            beschreibung: 'Denke an eine Person, die für dich da war. Was möchtest du ihr sagen? (Brief schreiben oder Nachricht überlegen)',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Verbindung stärken',
          beschreibung: 'Nimm diese Woche Kontakt zu einer wichtigen Bezugsperson auf – auch wenn es nur eine Nachricht ist.',
          dauer: '10 Min'
        },
        reflexion: [
          'Wem kannst du wirklich vertrauen?',
          'Was hindert dich daran, Unterstützung anzunehmen?'
        ]
      },
      {
        nr: 4,
        titel: 'Resilienz im Alltag verankern',
        dauer: '60 Min',
        ziel: 'Resiliente Gewohnheiten und Routinen entwickeln',
        psychoedukation: {
          titel: 'Resilienz täglich üben',
          inhalt: 'Resilienz ist kein einmaliger Akt – sie wird durch tägliche Gewohnheiten gestärkt: Schlaf, Bewegung, Verbindung, Sinn, Dankbarkeit. Kleine Routinen bauen langfristige Widerstandskraft auf.'
        },
        interventionen: [
          {
            titel: 'Resilienz-Routine entwickeln',
            ansatz: 'Verhaltensaktivierung',
            beschreibung: 'Welche täglichen Gewohnheiten stärken meine Resilienz? Gemeinsam eine realistische Routinen-Liste erstellen: morgens, abends, wöchentlich.',
            dauer: '25 Min'
          }
        ],
        uebungen: [
          {
            titel: 'Dankbarkeits-Übung',
            beschreibung: 'Nenne 3 Dinge, für die du heute dankbar bist. Auch kleine Dinge zählen. Was verändert sich, wenn du das täglich tust?',
            dauer: '15 Min'
          }
        ],
        hausaufgabe: {
          titel: 'Resilienz-Routine 7 Tage',
          beschreibung: 'Führe deine Resilienz-Routine eine Woche durch. Was verändert sich? Was bleibt?',
          dauer: '10 Min täglich'
        },
        reflexion: [
          'Was nimmst du aus diesem Modul mit?',
          'Wie willst du deine Resilienz langfristig stärken?'
        ]
      }
    ]
  },

};
