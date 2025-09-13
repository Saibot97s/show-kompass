import { useState } from 'react'
import { Link } from 'react-router-dom'
import PreviewModal from '../components/PreviewModal'
import LogoLeiste from '../components/LogoLeiste'
import SignupForm from "../components/SignupForm";

export default function Home() {
  const [showPreview, setShowPreview] = useState(false)

  return (
    <main>

      {/* HERO v2 — Split Layout (minimal) */}
      <section className="hero hero--split" aria-label="Mediakit Generator – Hero">
        <div className="container hero-grid">
          {/* Copy left */}
          <div className="hero-copy">
            <h1 className="hero-title">
              <span className="gradient-title">Erstelle DEIN Media Kit</span>
              <span className="title-shadow">Erstelle DEIN Media Kit</span>
            </h1>
            <h1>und hole dir die Gigs.</h1>

            <p className="hero-lead">
              Erstelle mit unserem kostenlosen Generator in wenigen Klicks ein professionelles Media Kit, das Booker:innen lieben.
              Mit Vorlage, Auto-Layout und 1-Klick-Export als PDF.
            </p>


            <br />    <br />


            <br />

            {/* CTA */}
            <SignupForm className="cta-form" />

            <br />
            <div className="proof" aria-live="polite">
              <div className="faces" aria-hidden="true">
                <span className="face f1" />
                <span className="face f2" />
                <span className="face f3" />
                <span className="face f4" />
              </div>
              <span><strong>30 Artists</strong> haben zuletzt den Generator genutzt</span>
            </div>
          </div>

          {/* Media right */}
          <div className="hero-media">
            <div className="device img-overlay" role="img" aria-label="Vorschau deines Media Kits">
              <img className="device-img" src={import.meta.env.BASE_URL + 'img2.jpeg'} alt="Mediakit Vorschau" loading="eager" />
              <button
                className="play-btn play-btn--center"
                aria-label="Vorschauvideo abspielen"
                onClick={() => setShowPreview(true)}
              >
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 5v14l11-7L8 5z" fill="white" />
                </svg>
              </button>
            </div>

            {/* Mini-benefits */}
            <div className="mini-benefits">
              <div className="mini">
                <strong>0€</strong>
                <span>Kostenlos starten</span>
              </div>
              <div className="mini">
                <strong>15&nbsp;Min</strong>
                <span>Zur fertigen Datei</span>
              </div>
              <div className="mini">
                <strong>1-Klick</strong>
                <span>PDF Export</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <button className="scroll-cue" aria-label="Weiter scrollen">
          <span className="chev" aria-hidden="true">▾</span>
        </button>
      </section>





      <br /><br /><br /><br /><br />


      {/* WAS IST EIN MEDIAKIT */}
      <section className="container section" aria-labelledby="mediakit-title">
        <div className="responsivegridL">
          <div className='hide-on-mobile'>
            <img src={import.meta.env.BASE_URL + 'mediakit-sample.png'} alt="Beispiel eines Mediakit" style={{ width: '100%', borderRadius: '12px' }} />
          </div>
          <div>
            <h2 id="mediakit-title">Was ist ein Mediakit?</h2>

            <p>
              Ein <strong>Mediakit</strong> ist deine digitale Visitenkarte als Musiker:in. Es fasst alle wichtigen Infos über dich, deine Musik und deine Auftritte in einem professionellen Dokument zusammen – klar, ansprechend und überzeugend.
            </p>
            <ul>
              <li> Vorstellung deiner Person und deiner Musik</li>
              <li> Hochwertige Fotos & Videos</li>
              <li> Referenzen & bisherige Auftritte</li>
              <li> Kontaktdaten & Buchungsinfos</li>
            </ul>
            <p>
              Mit einem Mediakit überzeugst du Veranstalter:innen, Hotels oder Firmen auf den ersten Blick – und erhöhst so deine Chancen auf neue Auftritte und Kooperationen.
            </p>
          </div>
        </div>
      </section>





      {/* SIRUS – PORTRAIT*/}
      <section className="container section" aria-labelledby="sirus-title">

        <div
          className="responsivegridR"
        >
          <div>

            {/* Großes Zitat */}
            <blockquote
              style={{
                position: 'relative',
                margin: '0 0 28px 0',
                padding: '28px 24px 24px 72px',
                lineHeight: 1.3,
                background: 'linear-gradient(135deg, #4f46e5 0%, #ec4899 100%)',
                color: '#fff',
                borderRadius: '16px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                overflow: 'hidden',
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: '20px',
                  top: '6px',
                  fontSize: 'clamp(3rem, 8vw, 6rem)',
                  lineHeight: 1,
                  opacity: 0.25,
                  fontWeight: 900,
                }}
              >
                “
              </span>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 'clamp(1.2rem, 2.vw, 1.5rem)' }}>
                Ich weiß aus eigener Erfahrung: Talent
                allein reicht nicht. Wer sich auf der Bühne verkaufen möchte, muss auch das Business
                dahinter verstehen.
              </p>
              <p>
                Sirus Madjderey
              </p>
            </blockquote>

            <p>
              Ich bin Musiker, Autor und Businessmensch. Vor einigen Jahren habe ich ein ungewöhnliches Handwerk für mich entdeckt: das Pfeifen.
              Ja, richtig gehört – ich pfeife auf der Bühne. Und klar, du fragst dich: Wer engagiert einen Kunstpfeifer? Genau diese Frage habe ich mir am Anfang auch gestellt. Heute halte ich den Weltrekord und war in unzähligen TV- , Radio- und Printmedien vertreten. Nicht, weil ich der beste Musiker bin – weit gefehlt. Sondern weil ich meine
              unternehmerische Erfahrung in meine Kunst einfließen ließ, dem Markt zugehört und das passende Produkt geschnürt habe. So konnte ich daraus ein Business bauen. – und genau das kannst du auch.
            </p>
            <h4>Du kennst mich vielleicht aus:</h4>

          </div>

          <div>
            <img
              src={import.meta.env.BASE_URL + 'sirus-portrait.jpg'}
              alt="Sirus – Kunstpfeiffer, Business-Mensch und Bestseller-Autor"
              style={{ width: '100%', borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)' }}
            />
          </div>
        </div>


        {/* LOGO-REIHE – sehr schmales Foto */}
        <LogoLeiste></LogoLeiste>
      </section>

      <section className="section" aria-label="Problem-Lösung-Vergleich">
        <div className="container">
          <section className="flow-box" role="group">

            <div className="flow-cols" aria-label="Spaltenüberschriften">
              <div className="colhead left"><span className="pill big">❌ Ohne Mediakit</span></div>
              <div className="colspacer" aria-hidden="true"></div>
              <div className="colhead right"><span className="pill big good">✅ Mit Mediakit</span></div>
            </div>

            <div role="list">
              <div className="flow-row" role="listitem">
                <div className="p-card">
                  <h3>❌  Viel Arbeit für Booker</h3>
                  <p className="muted">Kein Media Kit = Zusatzaufwand. → Booking-Agenturen haben keine Zeit für langes Nachfragen.</p>
                </div>
                <div className="bridge" aria-hidden="true">
                  <svg viewBox="0 0 60 70" className="arrow" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--brand)" />
                        <stop offset="100%" stopColor="var(--brand-2)" />
                      </linearGradient>
                    </defs>
                    <polygon points="55,35 5,5 5,65" fill="url(#grad1)" opacity="0.98" />
                  </svg>


                </div>
                <div className="s-card">
                  <h3>✅  Leicht weiterzuempfehlen</h3>
                  <p className="muted">ein PDF oder Link lässt sich schnell teilen. Mit einem Klick hat alle Infos immer verfügbar: digital/print.</p>
                </div>
              </div>

              <hr className="divider" />

              <div className="flow-row" role="listitem">
                <div className="p-card">
                  <h3>❌ Weniger Vertrauen & Glaubwürdigkeit</h3>
                  <p className="muted">Ein fehlendes Media Kit wirkt wie fehlendes Business-Know-how → Booker zweifeln, ob du zuverlässig bist.</p>
                </div>
                <div className="bridge" aria-hidden="true">
                  <svg viewBox="0 0 60 70" className="arrow" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--brand)" />
                        <stop offset="100%" stopColor="var(--brand-2)" />
                      </linearGradient>
                    </defs>
                    <polygon points="55,35 5,5 5,65" fill="url(#grad1)" opacity="0.98" />
                  </svg>

                </div>
                <div className="s-card">
                  <h3>✅ Professioneller Auftritt</h3>
                  <p className="muted">Zeigt, dass du weißt, wie das Geschäft funktioniert. Biografie, Pressetexte, Bilder, Videos, Logos, Social Links und Kontaktdaten übersichtlich gebündelt.
                  </p>
                </div>
              </div>

              <hr className="divider" />


              <div className="flow-row" role="listitem">
                <div className="p-card">
                  <h3>❌ Schlechtere Vermarktungschancen</h3>
                  <p className="muted">Presse oder Sponsoren brauchen Infos & Fotos sofort → ohne Kit bist du nicht „PR-fähig“</p>
                </div>
                <div className="bridge" aria-hidden="true">
                  <svg viewBox="0 0 60 70" className="arrow" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="var(--brand)" />
                        <stop offset="100%" stopColor="var(--brand-2)" />
                      </linearGradient>
                    </defs>
                    <polygon points="55,35 5,5 5,65" fill="url(#grad1)" opacity="0.98" />
                  </svg>

                </div>
                <div className="s-card">
                  <h3>✅  Presse & PR ready</h3>
                  <p className="muted">Journalist:innen, Blogger:innen, oder Radiostationen, etc. können direkt aus dem Kit zitieren, Fotos nutzen oder dich featuren. Reibungslose Kommunikation.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>


      {/* SALES/CTA SECTION – farbig, prominent */}
      <section className="container section cta-hero" aria-labelledby="mediakit-cta">
        <div className="cta-wrap">
          {/* Links: Produktmockup */}
          <div className="cta-left">
            <img
              src={import.meta.env.BASE_URL + 'mockup-mediakit.png'}
              alt="Produktmockup: Mediakit-Generator"
            />
          </div>

          {/* Rechts: Claim + Vorteile + Newsletter/Generator-CTA */}
          <div className="cta-right">
            <span className="badge" aria-hidden>
              KOSTENLOS
            </span>
            <h2 id="mediakit-cta">Kostenlos. Versprochen! - und fertig in Minuten.</h2>
            <p className="lead">
              Sofortiger Zugang zum <strong>Mediakit‑Generator</strong>. Melde dich an und erhalte zusätzlich kompakte Profi-Tipps & Vorlagen per Newsletter.
            </p>
            <ul className="benefits" aria-label="Vorteile">
              <li>Erstelle dein Mediakit in Minuten</li>
              <li>Direkt im Browser, ohne Software</li>
              <li>Export als Link oder PDF</li>
              <li>Bewährte Layouts für Booking & PR</li>
            </ul>
                <SignupForm className="cta-form" />
          </div>
        </div>
      </section>

      {/* KURSE */}
      {/*
      <section id="kurse" className="container section" aria-labelledby="kurse-title">
        <h2 id="kurse-title">Vielleicht ineressieren dich auch unsere Kurse:</h2>
        <div className="grid">
          <article className="card">
            <div className="thumb" role="img" aria-label="Kursbild – Steuern & Finanzen">
              <img src={import.meta.env.BASE_URL + '/kurse/sales.jpeg'} alt="Kursbild: Marketing & Sales" loading="lazy" />
            </div>
            <div className="content">
              <div className="title">Marketing & Sales</div>
              <div className="meta">6 Stunden • 7 Module • 25 Videos</div>
              <div className="price">€ 99</div>
              <div className="actions">
                <Link to="/kurs/steuern-finanzen" className="btn primary">Mehr zum Kurs</Link>
              </div>
            </div>
          </article>
          <article className="card">
            <div className="thumb" role="img" aria-label="Kursbild – Marketing und Vertrieb">
              <img src={import.meta.env.BASE_URL + '/kurse/finanzen.jpeg'} alt="Kursbild: Marketing & Sales" loading="lazy" />

            </div>
            <div className="content">
              <div className="title">Finanzen & Steuern</div>
              <div className="meta">5 Stunden • 6 Module • 20 Videos</div>
              <div className="price">€ 129</div>
              <div className="actions">
                <Link to="/kurs/marketing" className="btn primary">Mehr zum Kurs</Link>
              </div>
            </div>
          </article>
          <article className="card">
            <div className="thumb" role="img" aria-label="Kursbild – Bühnenshows und Entertainment">
              <img src={import.meta.env.BASE_URL + 'kurse/workflow.jpeg'} alt="Kursbild – Bühnenshows und Entertainment" loading="lazy" />

            </div>
            <div className="content">
              <div className="title">Zeitmanagement, Mindset & Workflow</div>
              <div className="meta">6 Stunden • 7 Module • 25 Videos</div>
              <div className="price">€ 139</div>
              <div className="actions">
                <Link to="/kurs/buehnenshows" className="btn primary">Mehr zum Kurs</Link>
              </div>
            </div>
          </article>
          <article className="card">
            <div className="thumb" role="img" aria-label="Kursbild – Steuern & Finanzen">
              <img src={import.meta.env.BASE_URL + '/kurse/showact.jpeg'} alt="Kursbild: Marketing & Sales" loading="lazy" />
            </div>
            <div className="content">
              <div className="title">Showact & Entertainment</div>
              <div className="meta">6 Stunden • 6 Modiule • 22 Videos</div>
              <div className="price">€ 99</div>
              <div className="actions">
                <Link to="/kurs/steuern-finanzen" className="btn primary">Mehr zum Kurs</Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      */}
      <PreviewModal open={showPreview} onClose={() => setShowPreview(false)} />
    </main>
  )
}
