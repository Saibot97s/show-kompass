// src/pages/Privacy.jsx
import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import LogoLeiste from "../components/LogoLeiste";

export default function Privacy() {
  return (
    <main>
      <section className="container section" aria-labelledby="full-title">
        <h2 id="full-title">Impressum &amp; Datenschutzerklärung</h2>

        <div className="flow-box" role="group">
          <div role="list" className="flow-col">
            {/* 1. Verantwortlicher */}
            <article className="p-card" role="listitem">
              <h3>1. Verantwortlicher</h3>
              <p>
                <strong>ShowKompass</strong><br />
                Sirus Madjderey<br />
                Adresse: Teinfaltstraße 4/B10, 1010 Wien<br />
                Tel: +43 699 176 54 300<br />
                Mail: <a href="mailto:office@kunstpfeifer.com">office@kunstpfeifer.com</a><br />
                Webseite: <a href="https://kunstpfeifer.com" rel="noopener noreferrer" target="_blank">kunstpfeifer.com</a>
              </p>
            </article>

            {/* 2. Zwecke & Rechtsgrundlagen */}
            <article className="p-card" role="listitem">
              <h3>2. Zwecke &amp; Rechtsgrundlagen</h3>
              <ul className="muted">
                <li>
                  <strong>Newsletter &amp; Werbung</strong> (Art. 6 Abs. 1 lit. a DSGVO – Einwilligung).
                </li>
                <li>
                  <strong>Website-Betrieb</strong> (Art. 6 Abs. 1 lit. f DSGVO – berechtigtes Interesse an stabiler, sicherer Website).
                </li>
                <li>
                  <strong>Vertrag/Anbahnung</strong> (Art. 6 Abs. 1 lit. b DSGVO), sofern du kostenpflichtige Leistungen nutzt.
                </li>
              </ul>
              <p className="muted">
                Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln Ihre personenbezogenen Daten
                vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung. Die Nutzung unserer
                Webseite ist in der Regel ohne Angabe personenbezogener Daten möglich. Soweit auf unseren Seiten personenbezogene Daten
                (z. B. Name, Telefonnummer oder E-Mail-Adresse) erhoben werden, erfolgt dies – soweit möglich – stets auf freiwilliger Basis.
                Diese Daten werden ohne Ihre ausdrückliche Zustimmung nicht an Dritte weitergegeben.
              </p>
            </article>

            {/* 3. Newsletter-Einwilligung & Werbung */}
            <article className="p-card" role="listitem">
              <h3>3. Newsletter-Einwilligung &amp; Werbung</h3>
              <p>
                Bei Anmeldung speichern wir E-Mail (und optional Name), um dir den Newsletter <strong>und Werbung</strong> zu senden.
                Double-Opt-In wird verwendet. Widerruf jederzeit über Abmeldelink oder per E-Mail an{" "}
                <a href="mailto:office@kunstpfeifer.com">office@kunstpfeifer.com</a>.
              </p>
            </article>

            {/* 4. Auftragsverarbeiter */}
            <article className="p-card" role="listitem">
              <h3>4. Auftragsverarbeiter</h3>
              <p className="muted">
                Für Versand/Hosting können Dienstleister eingesetzt sein (z. B. Newsletter-Dienst). Mit diesen bestehen DSGVO-konforme
                Verträge. Eine Liste stellen wir auf Anfrage bereit.
              </p>
            </article>

            {/* 5. Speicherdauer */}
            <article className="p-card" role="listitem">
              <h3>5. Speicherdauer</h3>
              <p className="muted">
                Bis Widerruf bzw. Beendigung der Zwecke; darüber hinaus nur, wenn gesetzliche Aufbewahrungspflichten bestehen.
              </p>
            </article>

            {/* 6. Deine Rechte */}
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

            {/* 7. Kontakt für Datenschutz */}
            <article className="p-card" role="listitem">
              <h3>7. Kontakt für Datenschutz</h3>
              <p>
                Tel: +43 699 176 54 300<br />
                Mail: <a href="mailto:office@kunstpfeifer.com">office@kunstpfeifer.com</a><br />
                Wir antworten so rasch wie möglich.
              </p>
            </article>

            {/* 8. Cookies */}
            <article className="p-card" role="listitem">
              <h3>8. Cookies</h3>
              <p>
                Unsere Website verwendet teilweise Cookies. Cookies richten auf Ihrem Gerät keinen Schaden an und enthalten keine Viren.
                Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen. Die meisten Cookies sind
                „Session-Cookies“ und werden nach Ende Ihres Besuchs automatisch gelöscht. Andere Cookies bleiben gespeichert, bis Sie diese
                löschen und ermöglichen die Wiedererkennung Ihres Browsers.
              </p>
              <p className="muted">
                Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden, Cookies nur im Einzelfall
                erlauben, die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen beim
                Schließen des Browsers aktivieren. Bei Deaktivierung von Cookies kann die Funktionalität der Website eingeschränkt sein.
              </p>
            </article>

            {/* 9. Server-Log-Files */}
            <article className="p-card" role="listitem">
              <h3>9. Server-Log-Files</h3>
              <p>
                Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Files, die Ihr Browser
                automatisch übermittelt: Browsertyp und -version, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden
                Rechners, Uhrzeit der Serveranfrage. Diese Daten sind nicht bestimmten Personen zuordenbar. Eine Zusammenführung mit anderen
                Datenquellen erfolgt nicht. Wir behalten uns vor, diese Daten nachträglich zu prüfen, wenn konkrete Anhaltspunkte für eine
                rechtswidrige Nutzung bekannt werden.
              </p>
            </article>

            {/* 10. Kontaktformular */}
            <article className="p-card" role="listitem">
              <h3>10. Kontaktformular</h3>
              <p>
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben inklusive der Kontaktdaten zur Bearbeitung der
                Anfrage und für Anschlussfragen gespeichert. Eine Weitergabe erfolgt nicht ohne Ihre Einwilligung.
              </p>
            </article>

            {/* 11. Newsletterdaten */}
            <article className="p-card" role="listitem">
              <h3>11. Newsletterdaten</h3>
              <p>
                Für den Newsletter benötigen wir Ihre E-Mail-Adresse sowie eine Bestätigung, dass Sie der Inhaber der Adresse sind und mit
                dem Empfang einverstanden sind (Double-Opt-In). Weitere Daten werden nicht erhoben. Die erteilte Einwilligung können Sie
                jederzeit widerrufen, z. B. über den „Austragen“-Link im Newsletter.
              </p>
            </article>

            {/* 12. Webanalyse mit PostHog (statt Matomo) */}
            <article className="p-card" role="listitem">
              <h3>12. Webanalyse mit PostHog</h3>
              <p>
                Wir verwenden den Analysedienst <strong>PostHog</strong>, um die Nutzung unserer Website und ggf. unserer App zu verstehen
                und zu verbessern. PostHog kann hierzu Technologien wie Cookies oder ähnliche Identifier einsetzen, um wiederkehrende
                Nutzer zu erkennen und Interaktionen (z. B. Seitenaufrufe, Klicks) zu messen.
              </p>
              <p className="muted">
                <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Analyse und Verbesserung
                unseres Angebots). Sofern wir Ihre Einwilligung für optionale Cookies/Tracking einholen, erfolgt die Verarbeitung auf
                Grundlage von Art. 6 Abs. 1 lit. a DSGVO; die Einwilligung ist jederzeit widerrufbar.
              </p>
              <ul className="muted">
                <li>
                  <strong>Datenkategorien:</strong> z. B. IP-Adresse (gekürzt/anonymisiert, sofern technisch möglich), Browser-/Geräte-Infos,
                  Referrer, Interaktionsdaten (Ereignisse).
                </li>
                <li>
                  <strong>Speicherdauer:</strong> gemäß technischen Notwendigkeiten und Einstellungen; wir bewahren Daten nur so lange auf,
                  wie es für die genannten Zwecke erforderlich ist.
                </li>
                <li>
                  <strong>Opt-Out / Präferenzen:</strong> Sie können in unseren Cookie-Einstellungen nicht notwendige Cookies deaktivieren.
                  Außerdem respektieren wir – soweit technisch möglich – „Do-Not-Track“-Signale Ihres Browsers.
                </li>
              </ul>
            </article>

            {/* 13. Facebook-Plugins (Like-Button) */}
            <article className="p-card" role="listitem">
              <h3>13. Facebook-Plugins (Like-Button)</h3>
              <p>
                Auf unseren Seiten sind Plugins des sozialen Netzwerks Facebook (Anbieter: Meta Platforms, Inc., 1 Hacker Way, Menlo Park,
                CA 94025, USA) integriert. Die Plugins erkennen Sie am Facebook-Logo oder dem „Like-Button“. Eine Übersicht finden Sie unter{" "}
                <a href="http://developers.facebook.com/docs/plugins/" target="_blank" rel="noopener noreferrer">
                  developers.facebook.com/docs/plugins/
                </a>.
              </p>
              <p className="muted">
                Beim Besuch unserer Seiten wird über das Plugin eine direkte Verbindung zwischen Ihrem Browser und dem Facebook-Server
                hergestellt. Facebook erhält dadurch die Information, dass Sie mit Ihrer IP-Adresse unsere Seite besucht haben. Wenn Sie den
                „Like-Button“ anklicken, während Sie bei Facebook eingeloggt sind, kann Facebook den Besuch Ihrem Benutzerkonto zuordnen.
                Weitere Informationen:{" "}
                <a href="http://de-de.facebook.com/policy.php" target="_blank" rel="noopener noreferrer">
                  de-de.facebook.com/policy.php
                </a>. Wenn Sie keine Zuordnung wünschen, loggen Sie sich bitte aus Ihrem Facebook-Konto aus.
              </p>
            </article>

            {/* 14. YouTube */}
            <article className="p-card" role="listitem">
              <h3>14. YouTube</h3>
              <p>
                Unsere Website nutzt Plugins der von Google betriebenen Plattform YouTube (YouTube, LLC, 901 Cherry Ave., San Bruno,
                CA 94066, USA). Beim Aufruf einer Seite mit YouTube-Plugin wird eine Verbindung zu YouTube-Servern hergestellt und
                mitgeteilt, welche Seite Sie besuchen. Wenn Sie in Ihrem YouTube-Account eingeloggt sind, kann YouTube Ihr Surfverhalten
                Ihrem persönlichen Profil zuordnen. Dies können Sie durch Ausloggen verhindern. Weitere Informationen:{" "}
                <a
                  href="https://www.google.de/intl/de/policies/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  google.de/intl/de/policies/privacy
                </a>.
              </p>
            </article>

            {/* 15. SSL-Verschlüsselung */}
            <article className="p-card" role="listitem">
              <h3>15. SSL-Verschlüsselung</h3>
              <p>
                Diese Seite nutzt aus Gründen der Sicherheit und zum Schutz der Übertragung vertraulicher Inhalte (z. B. Anfragen) eine
                SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie am Wechsel von „http://“ auf „https://“ sowie am
                Schloss-Symbol in der Adresszeile. Bei aktiver Verschlüsselung können übermittelte Daten nicht von Dritten mitgelesen werden.
              </p>
            </article>

            {/* 16. Rechtsbehelfserklärung */}
            <article className="p-card" role="listitem">
              <h3>16. Rechtsbehelfserklärung</h3>
              <p>
                Ihnen stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und
                Widerspruch zu. Hierzu sowie zu weiteren Fragen zu personenbezogenen Daten können Sie sich jederzeit unter der im Impressum
                angegebenen Adresse an uns wenden. Wenn Sie glauben, dass die Verarbeitung Ihrer Daten gegen das Datenschutzrecht verstößt
                oder Ihre datenschutzrechtlichen Ansprüche sonst verletzt worden sind, können Sie sich bei der Aufsichtsbehörde beschweren.
                In Österreich ist die Datenschutzbehörde zuständig.
              </p>
            </article>

            {/* 17. Widerspruch Werbe-Mails */}
            <article className="p-card" role="listitem">
              <h3>17. Widerspruch gegen Werbe-Mails</h3>
              <p>
                Der Nutzung von im Rahmen der Impressumspflicht veröffentlichten Kontaktdaten zur Übersendung von nicht ausdrücklich
                angeforderter Werbung und Informationsmaterialien wird hiermit widersprochen. Die Betreiber der Seiten behalten sich
                ausdrücklich rechtliche Schritte im Falle der unverlangten Zusendung von Werbeinformationen (z. B. Spam-E-Mails) vor.
              </p>
            </article>
          </div>
        </div>

        {/* Optional: Newsletter-Teaser oder Logos, falls gewünscht */}
        {/* <SignupForm /> */}
        {/* <LogoLeiste /> */}
      </section>
    </main>
  );
}
