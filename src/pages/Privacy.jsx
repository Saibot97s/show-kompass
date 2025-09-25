// src/pages/Privacy.jsx
import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import LogoLeiste from "../components/LogoLeiste";

export default function Privacy() {
  return (
    <main>

      <section className="container section" aria-labelledby="full-title">
        <h2 id="full-title">Impressum & Datenschutzerklärung</h2>
        <div className="flow-box" role="group">
          <div role="list" className="flow-col">
            <article className="p-card" role="listitem">
              <h3>1. Verantwortlicher</h3>
              <p>
                <strong>ShowKompass</strong><br />
                Sirus Madjderey <br/>
Adresse: Teinfaltstraße 4/B10, 1010 Wien<br/>

Tel: +43 699 176 54 300<br/>
Mail: office@kunstpfeifer.com<br/>
Webseite: kunstpfeifer.com<br/>
              </p>
            </article>

            <article className="p-card" role="listitem">
              <h3>2. Zwecke & Rechtsgrundlagen</h3>
              <ul className="muted">
                <li><strong>Newsletter & Werbung</strong> (Art. 6 Abs. 1 lit. a DSGVO – Einwilligung).</li>
                <li><strong>Website-Betrieb</strong> (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an stabiler, sicherer Website).</li>
                <li><strong>Vertrag/Anbahnung</strong> (Art. 6 Abs. 1 lit. b DSGVO), sofern du kostenpflichtige Leistungen nutzt.</li>
              </ul>
            </article>

            <article className="p-card" role="listitem">
              <h3>3. Newsletter-Einwilligung & Werbung</h3>
              <p>
                Bei Anmeldung speicher’n wir E-Mail (und optional Name), um dir den Newsletter <strong>und Werbung</strong> zu senden.
                Double-Opt-In wird verwendet. Widerruf jederzeit über Abmeldelink oder E-Mail.
              </p>
            </article>

            <article className="p-card" role="listitem">
              <h3>4. Auftragsverarbeiter</h3>
              <p className="muted">
                Für Versand/Hosting können Dienstleister eingesetzt sein (z. B. Newsletter-Dienst). Mit diesen bestehen
                DSGVO-konforme Verträge. Eine Liste stellen wir auf Anfrage bereit.
              </p>
            </article>

            <article className="p-card" role="listitem">
              <h3>5. Speicherdauer</h3>
              <p className="muted">
                Bis Widerruf bzw. Beendigung der Zwecke, darüber hinaus nur, wenn gesetzliche Aufbewahrungspflichten bestehen.
              </p>
            </article>

            <article className="p-card" role="listitem">
              <h3>6. Deine Rechte</h3>
              <ul className="muted">
                <li>Auskunft, Berichtigung, Löschung, Einschränkung</li>
                <li>Datenübertragbarkeit</li>
                <li>Widerspruch (bei berechtigten Interessen)</li>
                <li>Widerruf von Einwilligungen</li>
                <li>Beschwerde bei der Datenschutzbehörde</li>
              </ul>
            </article>

            <article className="p-card" role="listitem">
              <h3>7. Kontakt für Datenschutz</h3>
              <p>
                Tel: +43 699 176 54 300 <br/>
Mail: office@kunstpfeifer.com<br/>
                Wir antworten so rasch wie möglich.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}
