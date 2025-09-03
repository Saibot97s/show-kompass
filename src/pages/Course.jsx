// src/pages/Course.jsx — light theme; modules with colorful thin separators, colors from CSS

import { useParams } from 'react-router-dom'

const COURSE_DATA = {
  // PRODUKT 1 – Finanzen & Steuern
  'steuern-finanzen': {
    title: 'Tag der Abrechnung: Finanzen & Steuern für Musiker:innen',
    price: '€ 149',
    introVideoId: '8MUWTRnI3j0', // Platzhalter
    modules: [
      {
        title: '1. Startklar: Bin ich überhaupt steuerpflichtig?',
        lessons: [
          { id: 'sf01-start', length: '07:42', title: 'Überblick & Check', desc: 'Kurzer Einstieg: Welche Fragen musst du für dich klären? Drei einfache Checks.' },
          { id: 'sf01-hobby', length: '08:10', title: 'Hobby oder Gewerbe?', desc: 'So trennst du eindeutig: Gewinnerzielungsabsicht, Indizien, Konsequenzen.' },
          { id: 'sf01-klein', length: '09:05', title: 'Kleinunternehmerregel – einfach erklärt', desc: 'Grenzen, Meldungen, Vor- & Nachteile, typische Szenarien.' },
          { id: 'sf01-konto', length: '04:30', title: 'Eigenes Konto – ja oder nein?', desc: 'Warum Trennung hilft und wie du’s pragmatisch löst.' },
          { id: 'sf01-solo', length: '06:20', title: 'Solo, Duo/Band: Wer versteuert was?', desc: 'Abrechnung, Verantwortlichkeiten & klare Spielregeln.' },
        ]
      },
      {
        title: '2. Geld verstehen: Einnahmen, Ausgaben, Gewinn',
        lessons: [
          { id: 'sf02-ea', length: '08:55', title: 'Einnahmen vs. Ausgaben', desc: 'Mit Musiker:innen-Beispielen – ohne Fachjargon.' },
          { id: 'sf02-bnn', length: '07:35', title: 'Brutto, Netto & was bleibt übrig', desc: 'Daumenregeln und eine einfache Beispielrechnung.' },
          { id: 'sf02-arten', length: '06:50', title: 'Einkommensarten im Musikalltag', desc: 'Gage, CD/Merch, Straßenmusik – so ordnest du richtig ein.' },
          { id: 'sf02-vertrag', length: '06:10', title: 'Dienst- vs. Werkvertrag', desc: 'Der Unterschied in 6 Minuten – praxisnah erklärt.' },
        ]
      },
      {
        title: '3. Dokumente & Workflow: Von Anfrage bis Rechnung',
        lessons: [
          { id: 'sf03-angebot', length: '07:25', title: 'Angebot & Auftragsbestätigung', desc: 'Was muss rein? Plus Musterformulierungen.' },
          { id: 'sf03-rechnung', length: '08:40', title: 'Rechnung richtig stellen', desc: 'Pflichtangaben, KUR-Hinweis, Checkliste.' },
          { id: 'sf03-flow', length: '06:55', title: 'Anfrage → Gig → Rechnung', desc: 'Dein einfacher Prozess ohne Chaos.' },
          { id: 'sf03-ablage', length: '05:20', title: 'Ablage & Aufbewahrung', desc: 'Wie lange heben? So findest du später alles wieder.' },
        ]
      },
      {
        title: '4. Preise & Fair Pay',
        lessons: [
          { id: 'sf04-gage5', length: '09:15', title: 'Gage kalkulieren in 5 Schritten', desc: 'Zeit, Vorbereitung, Fahrt & Technik – klare Formel.' },
          { id: 'sf04-fair', length: '07:40', title: 'Fair Pay & Benchmarks', desc: 'Orientierung aus der Praxis – realistische Spannen.' },
          { id: 'sf04-kunden', length: '06:05', title: 'Privatkund:innen vs. Firmen', desc: 'Preislogik, MwSt-Themen & Kommunikation.' },
        ]
      },
      {
        title: '5. Fehler vermeiden',
        lessons: [
          { id: 'sf05-top5', length: '07:15', title: 'Top 5 Steuer-Fails', desc: 'Nicht melden, falsche Rechnungen, fehlende Belege & Co.' },
          { id: 'sf05-rueck', length: '04:55', title: 'Rücklagen richtig bilden', desc: 'Einfache Prozentsatz-Regel & separates Konto.' },
          { id: 'sf05-check', length: '05:30', title: 'Rechnungs-Checkliste', desc: 'Einmal prüfen – später sparen.' },
        ]
      },
      {
        title: '6. Profi-Wissen kompakt',
        lessons: [
          { id: 'sf06-foerd', length: '08:20', title: 'Förderungen: KSVF & mica', desc: 'Was wird gefördert, wie beantragen? Kurz & konkret.' },
          { id: 'sf06-rechte', length: '08:45', title: 'Rechte & Verwertung', desc: 'AKM, Austromechana/GEMA – Basiswissen zum Loslegen.' },
          { id: 'sf06-vertrag', length: '06:00', title: 'Verträge & AGB-Basics', desc: 'Was brauchst du wirklich? Praxisblick.' },
        ]
      },
      {
        title: 'Bonus: Vorlagen & Tools',
        lessons: [
          { id: 'sf07-bonus', length: '03:10', title: 'Downloads & Vorlagen', desc: 'Rechnung, Angebot, Auftragsbestätigung, Excel, Fair-Pay-Guide.' },
        ]
      },
    ]
  },

  // PRODUKT 2 – Showkonzept
  'showkonzept': {
    title: 'Publikumsmagnet: Dein Showkonzept entwickeln',
    price: '€ 149',
    introVideoId: 'ysz5S6PUM-U', // Platzhalter
    modules: [
      {
        title: '1. Dein Showplan',
        lessons: [
          { id: 'sk01-usp', length: '06:40', title: 'Showziel & USP', desc: 'Was willst du erreichen? Was macht dich unverwechselbar?' },
          { id: 'sk01-story', length: '08:30', title: 'Storyboard & Skript', desc: 'Struktur, Übergänge, Spannungsbögen – klar aufgebaut.' },
          { id: 'sk01-set', length: '07:10', title: 'Setlist, Moderation & Timing', desc: 'Vom ersten Ton bis zum Finale: Fluss statt Zufall.' },
          { id: 'sk01-probe', length: '06:10', title: 'Probenplan: Blatt vs. auswendig', desc: 'So übst du effizient – alleine & im Team.' },
        ]
      },
      {
        title: '2. Publikum & Auftritt',
        lessons: [
          { id: 'sk02-zg', length: '05:50', title: 'Zielgruppen-Check: Club, Hotel & Co.', desc: 'Welche Show passt zu welchem Ort? Schnell geprüft.' },
          { id: 'sk02-tipps', length: '08:20', title: 'Auftrittstipps: Start, Peak, Finale', desc: 'Direkt umsetzbare Do’s & Don’ts aus der Praxis.' },
          { id: 'sk02-nerv', length: '05:30', title: 'Lampenfieber in den Griff', desc: 'Drei Tools für Ruhe vor dem ersten Ton.' },
          { id: 'sk02-open', length: '06:05', title: 'Open Stage & Straßenkunst', desc: 'Sicher auftreten, Chancen nutzen – ohne Stress.' },
        ]
      },
      {
        title: '3. Technik & Material',
        lessons: [
          { id: 'sk03-ton', length: '07:45', title: 'Ton & Licht: Die Basics', desc: 'Was du wissen musst, damit die Show klingt & wirkt.' },
          { id: 'sk03-setup', length: '06:35', title: 'Home-Setup vs. Live-Setup', desc: 'Was wohin gehört – pragmatische Empfehlungen.' },
          { id: 'sk03-soft', length: '08:10', title: 'Software-Quickstart', desc: 'Audacity & CapCut für Demos, Reels & Showreel.' },
        ]
      },
      {
        title: '4. Qualität & Weiterentwicklung',
        lessons: [
          { id: 'sk04-qual', length: '06:20', title: 'Qualitätskriterien', desc: 'Woran du erkennst, dass deine Show „ready“ ist.' },
          { id: 'sk04-tour', length: '07:15', title: 'Mini-Tour planen', desc: 'Routen, Anfragen, Logistik – klein anfangen, groß denken.' },
        ]
      },
      {
        title: 'Bonus: Checklisten & Templates',
        lessons: [
          { id: 'sk05-bonus', length: '03:00', title: 'Vorlagenpaket', desc: 'Setlist, Moderationskarte, Probeplan, Tech-Check.' },
        ]
      },
    ]
  },

  // PRODUKT 3 – Workflow & Organisation
  'workflow': {
    title: 'Workflow einfach: Organisation mit kostenlosen Tools',
    price: '€ 99',
    introVideoId: 'dQw4w9WgXcQ', // Platzhalter
    modules: [
      {
        title: '1. Admin leicht gemacht',
        lessons: [
          { id: 'wf01-druck', length: '06:00', title: 'Druckdaten Basics', desc: 'Flyer & Visitenkarten ohne Stolperfallen (Formate, Beschnitt).'},
          { id: 'wf01-bestell', length: '05:10', title: 'Bestell-Workflow', desc: 'Online drucken – Schritt für Schritt.'},
          { id: 'wf01-qr', length: '06:20', title: 'QR-Codes & Ordnerstruktur', desc: 'Schnell verlinken und alles wiederfinden.'},
          { id: 'wf01-cloud', length: '05:15', title: 'Einfache Cloud-Ablage', desc: 'Drive/Cloud so nutzen, dass nix verloren geht.'},
        ]
      },
      {
        title: '2. Zeit & Fokus',
        lessons: [
          { id: 'wf02-plan', length: '07:40', title: 'Wochen- & Monatsplan in 15 Min', desc: 'So planst du realistisch – Musik & Orga im Blick.' },
          { id: 'wf02-prio', length: '06:05', title: 'Prioritäten mit der Eisenhower-Matrix', desc: 'Wichtig statt dringend – mit Beispielen.' },
          { id: 'wf02-pomo', length: '05:35', title: 'Pomodoro für Proben & Aufgaben', desc: 'Konzentration halten – ohne Überforderung.' },
          { id: 'wf02-prok', length: '04:50', title: 'Prokrastination stoppen', desc: 'Drei alltagstaugliche Tricks für den Start.' },
        ]
      },
      {
        title: '3. Digital sicher arbeiten',
        lessons: [
          { id: 'wf03-tools', length: '07:30', title: 'Online-Tools im Alltag', desc: 'Canva, Drive & Co. – was wirklich hilft.' },
          { id: 'wf03-acc', length: '05:40', title: 'Verifizierungen & Accounts', desc: 'Saubere Logins, 2FA & Profilpflege.' },
          { id: 'wf03-cyber', length: '08:20', title: 'Cyber-Sicherheit Basics', desc: 'Phishing, Passwörter, sichere Dateien – verständlich erklärt.' },
          { id: 'wf03-backup', length: '06:10', title: 'Backups & Passwortmanager', desc: 'Einmal aufsetzen, dauerhaft entspannt arbeiten.' },
        ]
      },
      {
        title: 'Bonus: Vorlagenpaket',
        lessons: [
          { id: 'wf04-bonus', length: '03:05', title: 'Downloads & Templates', desc: 'Kanban-Board, To-do-Listen, Kalender, Checklisten.' },
        ]
      },
    ]
  },

  // PRODUKT 4 – Marketing & Sales
  'marketing-sales': {
    title: 'Marketing & Sales: Sichtbar werden und gebucht werden',
    price: '€ 149',
    introVideoId: 'aqz-KE-bpKQ', // Platzhalter
    modules: [
      {
        title: '1. Marke & Auftritt',
        lessons: [
          { id: 'ms01-name', length: '06:15', title: 'Künstlername finden & prüfen', desc: 'Namensideen testen, Domains & Handles checken.' },
          { id: 'ms01-mood', length: '07:45', title: 'Deine Marke auf 1 Seite', desc: 'Moodboard: Farben, Tonalität, Bildsprache.' },
          { id: 'ms01-web', length: '08:05', title: 'Website & Profile: Must-haves', desc: 'Bio, Termine, Kontakt – klar und überzeugend.' },
          { id: 'ms01-print', length: '05:25', title: 'Printmaterial: Flyer & Karten', desc: 'Schnell professionelle Drucksachen erstellen.' },
        ]
      },
      {
        title: '2. Marketing-Grundlagen',
        lessons: [
          { id: 'ms02-usp', length: '06:00', title: 'Dein USP in 3 Sätzen', desc: 'Nutzen statt Floskeln – mit Beispielstruktur.' },
          { id: 'ms02-online', length: '08:10', title: 'Online-Strategie kurz & lang', desc: 'Content-Pfade, Newsletter, Wiederverwertung.' },
          { id: 'ms02-offline', length: '07:00', title: 'Offline: Networking & Kooperationen', desc: 'Wo du Leute triffst – und wie du dranbleibst.' },
        ]
      },
      {
        title: '3. Social Media & Content',
        lessons: [
          { id: 'ms03-plan', length: '08:30', title: 'Content-Plan in 30 Minuten', desc: 'Formate, Frequenz, Themen – realistisch umsetzen.' },
          { id: 'ms03-platt', length: '07:20', title: 'Plattformen & Formate', desc: 'Was passt zu dir? Reels, Shorts, Lives & mehr.' },
          { id: 'ms03-funnel', length: '06:40', title: 'Von Community zu Käufer:innen', desc: 'Einfache Wege zu Merch, Tickets & Gigs.' },
        ]
      },
      {
        title: '4. Presse & Medien',
        lessons: [
          { id: 'ms04-presse', length: '08:15', title: 'In die Presse kommen', desc: 'Ansprechliste, Pitch-Mail, Timing – so klappt’s.' },
          { id: 'ms04-inter', length: '07:10', title: 'Interview-Prep', desc: 'Fragen antizipieren, Kernbotschaften setzen.' },
          { id: 'ms04-reel', length: '07:35', title: 'Showreel & Pressekit', desc: 'Was rein muss und wie du es teilst.' },
        ]
      },
      {
        title: '5. Sales: Gigs finden & abschließen',
        lessons: [
          { id: 'ms05-akquise', length: '08:55', title: 'Akquise legal & clever', desc: 'Recherche, Ansprache, DSGVO-konform handeln.' },
          { id: 'ms05-kanaele', length: '06:20', title: 'Sales-Kanäle & Agenturen', desc: 'Eigene Kanäle, Plattformen, Agenturen finden.' },
          { id: 'ms05-ablauf', length: '07:00', title: 'Von Anfrage zu Buchung', desc: 'Ablauf, Follow-ups, Abschluss ohne Druck.' },
        ]
      },
      {
        title: '6. Material & Ablage',
        lessons: [
          { id: 'ms06-media', length: '08:20', title: 'Media Kit: Bio, Repertoire, Rider', desc: 'Strukturiert, aktuell, teilbar.' },
          { id: 'ms06-cloud', length: '05:35', title: 'Cloud-Ordner & Linklisten', desc: 'Alles an einem Ort – für dich & Veranstalter:innen.' },
        ]
      },
    ]
  },
}

const getThumb = (id) => (/^[A-Za-z0-9_-]{11}$/).test(id) ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : ''

export default function Course(){
  const { slug } = useParams()
  const course = COURSE_DATA[slug] || COURSE_DATA['steuern-finanzen']

  const handleBuy = () => alert(`Kurs gekauft: ${course.title}`)
  const handleAdd = () => alert(`Zum Warenkorb hinzugefügt: ${course.title}`)

  const blocks = course.modules
    ? course.modules
    : [{ title: null, lessons: course.lessons || [] }]

  return (
    <main className="container section course" aria-labelledby="course-title">
      {/* Kopfzeile */}
      <div className="course-head">
        <h1 id="course-title">{course.title}</h1>
      </div>

      {/* Intro-Video */}
      <div className="video-card">
        <div className="video-wrap">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${course.introVideoId}?rel=0`}
            title={`${course.title} – Vorstellungsvideo`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>

      {/* Module + Videos */}
      <article className="course-card">
        {blocks.map((mod, mi) => (
          <section key={mi} className="course-module">
            {mod.title ? <ModuleSeparator title={mod.title} /> : null}
            <ul className="lesson-grid">
              {mod.lessons.map((l, idx) => {
                const thumb = getThumb(l.id)
                return (
                  <li key={l.id} className="lesson-item">
                    <div className="lesson-inner">
                      <div
                        className="lesson-thumb"
                        role="img"
                        aria-label={`Kapitel ${idx + 1}: ${l.title}`}
                        style={thumb ? { backgroundImage: `url(${thumb})` } : undefined}
                      />
                      <div className="lesson-text">
                        <div className="lesson-top">
                          <strong>{l.title}</strong>
                          <span className="meta">{l.length}</span>
                        </div>
                        <p className="lesson-desc">{l.desc}</p>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}

        <br/><br/>
        <div className="actions">
          <button className="btn primary" onClick={handleBuy}>Jetzt Vorbestellen</button>
        </div>
      </article>

      {/* Spacer, damit die Sticky-Leiste nichts überlappt */}
      <div aria-hidden className="sticky-spacer" />

      {/* Sticky Kaufleiste unten */}
      <PurchaseBar title={course.title} price={course.price} onBuy={handleBuy} onAdd={handleAdd} />
    </main>
  )
}

function ModuleSeparator({ title }){
  return (
    <div className="module-sep" role="heading" aria-level={3} aria-label={title}>
      <span className="module-title"><h3>{title}</h3></span>
    </div>
  )
}

function PurchaseBar({ title, price, onBuy, onAdd }){
  return (
    <div role="region" aria-label="Kaufen" className="purchase-bar">
      <div className="container bar-inner">
        <div className="bar-info">
          <strong>{title}</strong>
          <span className="price">{price}</span>
        </div>
        <div className="bar-actions">
          <button className="btn" onClick={onAdd}>In den Warenkorb</button>
          <button className="btn primary" onClick={onBuy}>Jetzt kaufen</button>
        </div>
      </div>
    </div>
  )
}
