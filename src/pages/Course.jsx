// src/pages/Course.jsx — light theme; modules with colorful thin separators, colors from CSS
import { useParams } from 'react-router-dom'

/** ---------- Bild-Pfade -------------------------------------------------- **/
const ASSET_BASE = '/assets/course-thumbs' // liegt in /public
const assetPath = (slug, file) => `${ASSET_BASE}/${slug}/${file}`

const COURSE_DATA = {
    // Steuern
  'steuern-finanzen': {
    title: 'Tag der Abrechnung: Finanzen & Steuern für Musiker:innen',
    price: '€ 149',
    introImg: 'main_finance.jpg',
    modules: [
      {
        title: '1. Startklar: Bin ich überhaupt steuerpflichtig?',
        lessons: [
          { img: '1-1.png', length: '07:42', title: 'Überblick & Check', desc: 'Kurzer Einstieg: Welche Fragen musst du für dich klären? Drei einfache Checks.' },
          { img: '1-2.png', length: '08:10', title: 'Hobby oder Gewerbe?', desc: 'So trennst du eindeutig: Gewinnerzielungsabsicht, Indizien, Konsequenzen.' },
          { img: '1-3.png', length: '09:05', title: 'Kleinunternehmerregel – einfach erklärt', desc: 'Grenzen, Meldungen, Vor- & Nachteile, typische Szenarien.' },
          { img: '1-4.png', length: '04:30', title: 'Eigenes Konto – ja oder nein?', desc: 'Warum Trennung hilft und wie du’s pragmatisch löst.' },
          { img: '1-5.png', length: '06:20', title: 'Solo, Duo/Band: Wer versteuert was?', desc: 'Abrechnung, Verantwortlichkeiten & klare Spielregeln.' },
        ]
      },
      {
        title: '2. Geld verstehen: Einnahmen, Ausgaben, Gewinn',
        lessons: [
          { img: '2-1.png', length: '08:55', title: 'Einnahmen vs. Ausgaben', desc: 'Mit Musiker:innen-Beispielen – ohne Fachjargon.' },
          { img: '2-2.png', length: '07:35', title: 'Brutto, Netto & was bleibt übrig', desc: 'Daumenregeln und eine einfache Beispielrechnung.' },
          { img: '2-3.png', length: '06:50', title: 'Einkommensarten im Musikalltag', desc: 'Gage, CD/Merch, Straßenmusik – so ordnest du richtig ein.' },
          { img: '2-4.png', length: '06:10', title: 'Dienst- vs. Werkvertrag', desc: 'Der Unterschied in 6 Minuten – praxisnah erklärt.' },
        ]
      },
      {
        title: '3. Dokumente & Workflow: Von Anfrage bis Rechnung',
        lessons: [
          { img: '3-1.png', length: '07:25', title: 'Angebot & Auftragsbestätigung', desc: 'Was muss rein? Plus Musterformulierungen.' },
          { img: '3-2.png', length: '08:40', title: 'Rechnung richtig stellen', desc: 'Pflichtangaben, KUR-Hinweis, Checkliste.' },
          { img: '3-3.png', length: '06:55', title: 'Anfrage → Gig → Rechnung', desc: 'Dein einfacher Prozess ohne Chaos.' },
          { img: '3-4.png', length: '05:20', title: 'Ablage & Aufbewahrung', desc: 'Wie lange heben? So findest du später alles wieder.' },
        ]
      },
      {
        title: '4. Preise & Fair Pay',
        lessons: [
          { img: '4-1.png', length: '09:15', title: 'Gage kalkulieren in 5 Schritten', desc: 'Zeit, Vorbereitung, Fahrt & Technik – klare Formel.' },
          { img: '4-2.png', length: '07:40', title: 'Fair Pay & Benchmarks', desc: 'Orientierung aus der Praxis – realistische Spannen.' },
          { img: '4-3.png', length: '06:05', title: 'Privatkund:innen vs. Firmen', desc: 'Preislogik, MwSt-Themen & Kommunikation.' },
        ]
      },
      {
        title: '5. Fehler vermeiden',
        lessons: [
          { img: '5-1.png', length: '07:15', title: 'Top 5 Steuer-Fails', desc: 'Nicht melden, falsche Rechnungen, fehlende Belege & Co.' },
          { img: '5-2.png', length: '04:55', title: 'Rücklagen richtig bilden', desc: 'Einfache Prozentsatz-Regel & separates Konto.' },
          { img: '5-3.png', length: '05:30', title: 'Rechnungs-Checkliste', desc: 'Einmal prüfen – später sparen.' },
        ]
      },
      {
        title: '6. Profi-Wissen kompakt',
        lessons: [
          { img: '6-1.png', length: '08:20', title: 'Förderungen: KSVF & mica', desc: 'Was wird gefördert, wie beantragen? Kurz & konkret.' },
          { img: '6-2.png', length: '08:45', title: 'Rechte & Verwertung', desc: 'AKM, Austromechana/GEMA – Basiswissen zum Loslegen.' },
          { img: '6-3.png', length: '06:00', title: 'Verträge & AGB-Basics', desc: 'Was brauchst du wirklich? Praxisblick.' },
        ]
      },
      {
        title: 'Bonus: Vorlagen & Tools',
        lessons: [
          { img: '7-1.png', length: '03:10', title: 'Downloads & Vorlagen', desc: 'Rechnung, Angebot, Auftragsbestätigung, Excel, Fair-Pay-Guide.' },
        ]
      },
    ]
  },

  // Showkonzept
  'showkonzept': {
    title: 'Publikumsmagnet: Dein Showkonzept entwickeln',
    price: '€ 149',
    introImg: 'main_show.jpg',
    modules: [
      {
        title: '1. Dein Showplan',
        lessons: [
          { img: '1-1.png', length: '06:40', title: 'Showziel & USP', desc: 'Was willst du erreichen? Was macht dich unverwechselbar?' },
          { img: '1-2.png', length: '08:30', title: 'Storyboard & Skript', desc: 'Struktur, Übergänge, Spannungsbögen – klar aufgebaut.' },
          { img: '1-3.png', length: '07:10', title: 'Setlist, Moderation & Timing', desc: 'Vom ersten Ton bis zum Finale: Fluss statt Zufall.' },
          { img: '1-4.png', length: '06:10', title: 'Probenplan: Blatt vs. auswendig', desc: 'So übst du effizient – alleine & im Team.' },
        ]
      },
      {
        title: '2. Publikum & Auftritt',
        lessons: [
          { img: '2-1.png', length: '05:50', title: 'Zielgruppen-Check: Club, Hotel & Co.', desc: 'Welche Show passt zu welchem Ort? Schnell geprüft.' },
          { img: '2-2.png', length: '08:20', title: 'Auftrittstipps: Start, Peak, Finale', desc: 'Direkt umsetzbare Do’s & Don’ts aus der Praxis.' },
          { img: '2-3.png', length: '05:30', title: 'Lampenfieber in den Griff', desc: 'Drei Tools für Ruhe vor dem ersten Ton.' },
          { img: '2-4.png', length: '06:05', title: 'Open Stage & Straßenkunst', desc: 'Sicher auftreten, Chancen nutzen – ohne Stress.' },
        ]
      },
      {
        title: '3. Technik & Material',
        lessons: [
          { img: '3-1.png', length: '07:45', title: 'Ton & Licht: Die Basics', desc: 'Was du wissen musst, damit die Show klingt & wirkt.' },
          { img: '3-2.png', length: '06:35', title: 'Home-Setup vs. Live-Setup', desc: 'Was wohin gehört – pragmatische Empfehlungen.' },
          { img: '3-3.png', length: '08:10', title: 'Software-Quickstart', desc: 'Audacity & CapCut für Demos, Reels & Showreel.' },
        ]
      },
      {
        title: '4. Qualität & Weiterentwicklung',
        lessons: [
          { img: '4-1.png', length: '06:20', title: 'Qualitätskriterien', desc: 'Woran du erkennst, dass deine Show „ready“ ist.' },
          { img: '4-2.png', length: '07:15', title: 'Mini-Tour planen', desc: 'Routen, Anfragen, Logistik – klein anfangen, groß denken.' },
        ]
      },
      {
        title: 'Bonus: Checklisten & Templates',
        lessons: [
          { img: '5-1.png', length: '03:00', title: 'Vorlagenpaket', desc: 'Setlist, Moderationskarte, Probeplan, Tech-Check.' },
        ]
      },
    ]
  },

  // Workflow & Organisation
  'workflow': {
    title: 'Workflow einfach: Organisation mit kostenlosen Tools',
    price: '€ 99',
    introImg: 'main_workflow.jpg',
    modules: [
      {
        title: '1. Admin leicht gemacht',
        lessons: [
          { img: '1-1.png', length: '06:00', title: 'Druckdaten Basics', desc: 'Flyer & Visitenkarten ohne Stolperfallen (Formate, Beschnitt).'},
          { img: '1-2.png', length: '05:10', title: 'Bestell-Workflow', desc: 'Online drucken – Schritt für Schritt.'},
          { img: '1-3.png', length: '06:20', title: 'QR-Codes & Ordnerstruktur', desc: 'Schnell verlinken und alles wiederfinden.'},
          { img: '1-4.png', length: '05:15', title: 'Einfache Cloud-Ablage', desc: 'Drive/Cloud so nutzen, dass nix verloren geht.'},
        ]
      },
      {
        title: '2. Zeit & Fokus',
        lessons: [
          { img: '2-1.png', length: '07:40', title: 'Wochen- & Monatsplan in 15 Min', desc: 'So planst du realistisch – Musik & Orga im Blick.' },
          { img: '2-2.png', length: '06:05', title: 'Prioritäten mit der Eisenhower-Matrix', desc: 'Wichtig statt dringend – mit Beispielen.' },
          { img: '2-3.png', length: '05:35', title: 'Pomodoro für Proben & Aufgaben', desc: 'Konzentration halten – ohne Überforderung.' },
          { img: '2-4.png', length: '04:50', title: 'Prokrastination stoppen', desc: 'Drei alltagstaugliche Tricks für den Start.' },
        ]
      },
      {
        title: '3. Digital sicher arbeiten',
        lessons: [
          { img: '3-1.png', length: '07:30', title: 'Online-Tools im Alltag', desc: 'Canva, Drive & Co. – was wirklich hilft.' },
          { img: '3-2.png', length: '05:40', title: 'Verifizierungen & Accounts', desc: 'Saubere Logins, 2FA & Profilpflege.' },
          { img: '3-3.png', length: '08:20', title: 'Cyber-Sicherheit Basics', desc: 'Phishing, Passwörter, sichere Dateien – verständlich erklärt.' },
          { img: '3-4.png', length: '06:10', title: 'Backups & Passwortmanager', desc: 'Einmal aufsetzen, dauerhaft entspannt arbeiten.' },
        ]
      },
      {
        title: 'Bonus: Vorlagenpaket',
        lessons: [
          { img: '4-1.png', length: '03:05', title: 'Downloads & Templates', desc: 'Kanban-Board, To-do-Listen, Kalender, Checklisten.' },
        ]
      },
    ]
  },

  // Marketing & Sales
  'marketing-sales': {
    title: 'Marketing & Sales: Sichtbar werden und gebucht werden',
    price: '€ 149',
    introImg: 'main_sales.jpg',
    modules: [
      {
        title: '1. Marke & Auftritt',
        lessons: [
          { img: '1-1.png', length: '06:15', title: 'Künstlername finden & prüfen', desc: 'Namensideen testen, Domains & Handles checken.' },
          { img: '1-2.png', length: '07:45', title: 'Deine Marke auf 1 Seite', desc: 'Moodboard: Farben, Tonalität, Bildsprache.' },
          { img: '1-3.png', length: '08:05', title: 'Website & Profile: Must-haves', desc: 'Bio, Termine, Kontakt – klar und überzeugend.' },
          { img: '1-4.png', length: '05:25', title: 'Printmaterial: Flyer & Karten', desc: 'Schnell professionelle Drucksachen erstellen.' },
        ]
      },
      {
        title: '2. Marketing-Grundlagen',
        lessons: [
          { img: '2-1.png', length: '06:00', title: 'Dein USP in 3 Sätzen', desc: 'Nutzen statt Floskeln – mit Beispielstruktur.' },
          { img: '2-2.png', length: '08:10', title: 'Online-Strategie kurz & lang', desc: 'Content-Pfade, Newsletter, Wiederverwertung.' },
          { img: '2-3.png', length: '07:00', title: 'Offline: Networking & Kooperationen', desc: 'Wo du Leute triffst – und wie du dranbleibst.' },
        ]
      },
      {
        title: '3. Social Media & Content',
        lessons: [
          { img: '3-1.png', length: '08:30', title: 'Content-Plan in 30 Minuten', desc: 'Formate, Frequenz, Themen – realistisch umsetzen.' },
          { img: '3-2.png', length: '07:20', title: 'Plattformen & Formate', desc: 'Was passt zu dir? Reels, Shorts, Lives & mehr.' },
          { img: '3-3.png', length: '06:40', title: 'Von Community zu Käufer:innen', desc: 'Einfache Wege zu Merch, Tickets & Gigs.' },
        ]
      },
      {
        title: '4. Presse & Medien',
        lessons: [
          { img: '4-1.png', length: '08:15', title: 'In die Presse kommen', desc: 'Ansprechliste, Pitch-Mail, Timing – so klappt’s.' },
          { img: '4-2.png', length: '07:10', title: 'Interview-Prep', desc: 'Fragen antizipieren, Kernbotschaften setzen.' },
          { img: '4-3.png', length: '07:35', title: 'Showreel & Pressekit', desc: 'Was rein muss und wie du es teilst.' },
        ]
      },
      {
        title: '5. Sales: Gigs finden & abschließen',
        lessons: [
          { img: '5-1.png', length: '08:55', title: 'Akquise legal & clever', desc: 'Recherche, Ansprache, DSGVO-konform handeln.' },
          { img: '5-2.png', length: '06:20', title: 'Sales-Kanäle & Agenturen', desc: 'Eigene Kanäle, Plattformen, Agenturen finden.' },
          { img: '5-3.png', length: '07:00', title: 'Von Anfrage zu Buchung', desc: 'Ablauf, Follow-ups, Abschluss ohne Druck.' },
        ]
      },
      {
        title: '6. Material & Ablage',
        lessons: [
          { img: '6-1.png', length: '08:20', title: 'Media Kit: Bio, Repertoire, Rider', desc: 'Strukturiert, aktuell, teilbar.' },
          { img: '6-2.png', length: '05:35', title: 'Cloud-Ordner & Linklisten', desc: 'Alles an einem Ort – für dich & Veranstalter:innen.' },
        ]
      },
    ]
  },
}

/** ---------- Komponente --------------------------------------------------- **/
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

      {/* Intro-Bild statt Video */}
      <div className="video-card">
        <div className="video-wrap">
          <img
            className="intro-thumb"
            src={assetPath(slug, course.introImg || 'intro.jpg')}
            alt={`${course.title} – Titelbild`}
            loading="eager"
            decoding="async"
          />
        </div>
      </div>

      {/* Module + Bilder */}
      <article className="course-card">
        {blocks.map((mod, mi) => (
          <section key={mi} className="course-module">
            {mod.title ? <ModuleSeparator title={mod.title} /> : null}
            <ul className="lesson-grid">
              {(mod.lessons || []).map((l, idx) => {
                const imgSrc = assetPath(slug, l.img)
                return (
                  <li key={`${mi}-${idx}`} className="lesson-item">
                    <div className="lesson-inner">
                      <div className="lesson-thumb">
                        <img
                          src={imgSrc}
                          alt={`Kapitel ${mi + 1}-${idx + 1}: ${l.title}`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
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
