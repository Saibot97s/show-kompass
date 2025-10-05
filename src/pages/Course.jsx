// src/pages/Course.jsx — light theme; modules with colorful thin separators, colors from CSS
import { useParams } from 'react-router-dom'

/** ---------- Bild-Pfade -------------------------------------------------- **/
const ASSET_BASE = `${import.meta.env.BASE_URL}course-assets`;

const assetPath = (slug, file) => `${ASSET_BASE}/${file}`;

//mit Kursordnern
//const assetPath = (slug, file) => `${ASSET_BASE}/${slug}/${file}`;

const COURSE_DATA = {
    // Steuern
  'steuern-finanzen': {
    title: 'Finanzen & Steuern für Musiker:innen',
    price: '',
    introImg: 'kurs/finanzen.jpeg',
    modules: [
      {
        title: '',
        lessons: [
          { img: '1-1.png', length: '5 Videos', title: 'Dein Start in die Selbstständigkeit als Musiker:in', desc: 'Du erfährst, ob du steuerpflichtig bist, wie du zwischen Hobby und Gewerbe einordnest und was die Kleinunternehmerregelung bedeutet. Außerdem klären wir wichtige Basics wie Geschäftskonto oder Duo-Auftritte. Am Ende weißt du genau, wo du stehst und welche Schritte nötig sind.' },
          { img: '1-2.png', length: '6 Videos', title: 'Einnahmen, Ausgaben, Gewinn – endlich durchblicken', desc: 'Du lernst die Grundlagen der Buchhaltung mit einfachen Beispielen kennen: Einnahmen vs. Ausgaben, Gewinn vs. Umsatz, Brutto vs. Netto. Wir klären, was du absetzen darfst, welche Einkommensarten es gibt und wo der Unterschied zwischen Dienst- und Werkvertrag liegt. So hast du deine Finanzen im Griff und vermeidest teure Fehler.' },
          { img: '1-3.png', length: '5 Videos', title: 'Ordnung statt Chaos – So funktioniert Buchhaltung', desc: 'Du lernst, welche Dokumente wichtig sind – von Rechnung bis Auftragsbestätigung – und wie ein sauberer Workflow aussieht, vom ersten Auftrag bis zum Jahresabschluss. Mit smarten Tools wie Scan-App, Excel oder Notion organisierst du alles übersichtlich und kannst deine Unterlagen stressfrei an den Steuerberater übergeben.' },
          { img: '1-4.png', length: '5 Videos', title: 'Gagen, Preise & Fair Pay', desc: 'Du erfährst, wie du Auftritte realistisch kalkulierst – inklusive Fahrtkosten, Technik und Vorbereitungszeit. Wir sprechen über Fair Pay, Durchschnittshonorare und die Unterschiede zwischen Privat- und Firmenkunden. So setzt du deine Preise klar und selbstbewusst durch.' },
          { img: '1-5.png', length: '6 Videos', title: 'Förderungen, Verträge & Rechte an deiner Musik', desc: 'Du erfährst, welche Förderungen und Unterstützungen es gibt (MICA, KSVF), was in Auftrittsverträgen und AGB wichtig ist und worauf du bei Musik-Uploads achten musst. Außerdem lernst du die Grundlagen zu AKM, Austromechana und GEMA. So bist du rechtlich und finanziell abgesichert.' },
          { img: '1-6.png', length: '5 Videos', title: 'Bonusmodul: Tools, Tipps & Goodies', desc: 'Du erhältst praktische Vorlagen (Rechnung, Angebot, Excel für den Steuerberater), nützliche Ressourcen wie Mediakit- und Fair-Pay-Beispiele, Tool-Empfehlungen sowie Buchempfehlungen. Zusätzlich kannst du zwei kostenlose Kurz-Calls nutzen. So setzt du dein Wissen direkt in die Praxis um.' },
        ]
      }
    ]
  },

  // Showkonzept
  'showkonzept': {
    title: 'Dein Showkonzept entwickeln - bereit für die Bühne',
    price: '',
    introImg: 'main_show.jpg',
    modules: [
      {
        title: '',
        lessons: [
          { img: '2-1.png', length: '7 Videos', title: 'Showkonzept und Qualität', desc: 'Du lernst, wie du ein professionelles Showkonzept entwickelst – von Storyboard und Skript über Moderation bis zur richtigen Dauer. Dazu gibt es Tipps für Auftritt und Lampenfieber, Einblicke in Zielgruppenbedürfnisse und wie du Qualität und USP deiner Show herausarbeitest. So bist du optimal auf deine Bühne vorbereitet.' },
          { img: '2-2.png', length: '4 Videos', title: 'Technik, Equipment', desc: 'Du bekommst einen Überblick über die wichtigste Software für Musiker:innen (Audiobearbeitung, Videoschnitt) sowie die passende Hardware – sowohl für Zuhause als auch für Live-Auftritte. So bist du technisch bestens ausgestattet.' },
        ]
      }
    ]
  },

  // Workflow & Organisation
  'workflow': {
    title: 'Dich besser organisieren mit kostenlosen Tools & Vorlagen',
    price: '',
    introImg: 'main_workflow.jpg',
    modules: [
      {
        title: '',
        lessons: [
          { img: '3-1.png', length: '4 Videos', title: 'Administration', desc: 'Du lernst, wie du Druckdaten professionell erstellst und Flyer oder Visitenkarten bestellst. Außerdem erfährst du, wie du Organisations-Tools wie Canva, Google Drive oder QR-Code-Generator effizient nutzt, um deine Abläufe zu vereinfachen.'},
          { img: '3-2.png', length: '5 Videos', title: 'Produktivität und Zeitmanagement', desc: 'Du lernst bewährte Zeitmanagement-Methoden kennen und erstellst effektive Wochen- und Monatspläne. Außerdem erfährst du, wie du Prioritäten richtig setzt und Prokrastination vermeidest – für mehr Fokus und Effizienz im Musiker-Alltag.'},
          { img: '3-3.png', length: '3 Videos', title: 'Technologie und Digitalisierung', desc: 'Du entdeckst nützliche Online-Tools für Organisation und Zusammenarbeit, lernst digitale Plattformen kennen und erhältst wichtige Tipps zur Cyber-Sicherheit. So arbeitest du effizient und schützt dich vor Hacking und Identitätsdiebstahl.'},
        ]
      }
    ]
  },

  // Marketing & Sales
  'marketing-sales': {
    title: 'Marketing & Sales: Sichtbar werden und gebucht werden',
    price: '',
    introImg: 'main_workflow.jpg',
    modules: [
      {
        title: '',
        lessons: [
          { img: '4-1.png', length: '4 Videos', title: 'Corporate Identity (CI)', desc: 'Du lernst, wie du deine Markenidentität entwickelst – von Logo und Moodboard bis zu Website und Visitenkarten. Außerdem erhältst du Tipps zur Wahl deines Künstlernamens und zur Domain-Verfügbarkeit. So baust du ein professionelles Auftreten von Anfang an auf.' },
          { img: '4-2.png', length: '8 Videos', title: 'Marketing', desc: 'Du lernst die Grundlagen erfolgreichen Marketings: von Referenzen und USP über Strategien bis hin zu Online- und Offline-Maßnahmen. Wir behandeln Social Media, Streaming-Plattformen, Networking und Pressearbeit – inkl. Tipps aus der Praxis. So machst du deine Musik sichtbar und erreichst deine Zielgruppe.' },
          { img: '4-3.png', length: '3 Videos', title: 'Medien & Material', desc: 'Du erfährst, wie du ein professionelles Media Kit erstellst – mit Showreel, Presseinfos, Bio, Fotos und Technical Rider. Außerdem lernst du, Cloud-Services sinnvoll zu nutzen. So präsentierst du dich rundum professionell gegenüber Veranstaltern und Presse.' },
          { img: '4-4.png', length: '6 Videos', title: 'Sales – Wie komme ich zu meinen Auftritten?', desc: 'Du lernst verschiedene Wege kennen, um an Auftritte zu kommen: von Akquise-Strategien und Recherche über passende Sales-Kanäle bis hin zur Zusammenarbeit mit Agenturen. Zusätzlich erhältst du Einblicke in nützliche Abwicklungsplattformen. So findest du effektiv neue Auftrittsmöglichkeiten.' },
        ]
      }
    ]
  },
}

/** ---------- Komponente --------------------------------------------------- **/
export default function Course(){
  const { slug } = useParams()
  const course = COURSE_DATA[slug] || COURSE_DATA['steuern-finanzen']

  const handleBuy = () => alert(`Danke für dein Interesse. `)
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
      {/*
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
      */}

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
          <button className="btn primary">Schon bald verfügbar</button>
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
          <button className="btn primary">Schon bald verfügbar</button>
        </div>
      </div>
    </div>
  )
}

