import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ className }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // Verhindert doppeltes Lead-Event (z. B. in Strict Mode / mehrfaches onLoad)
  const leadFiredRef = useRef(false);

  // Mailchimp-Action exakt aus deinem Embed (echte & statt &amp;)
  const MC_ACTION =
    "https://us19.list-manage.com/subscribe/post?u=2ba12036c00c7bce1283f2d64&id=5c660d7608&f_id=00c4c2e1f0";

  const handleSubmit = () => {
    setSubmitted(true);
    setLoading(true);
    setMsg(null);
    leadFiredRef.current = false; // Reset vor neuem Submit
  };

  const handleIframeLoad = () => {
    if (!submitted) return;               // nur nach einem Submit reagieren
    if (leadFiredRef.current) return;     // Doppel-Trigger vermeiden

    setLoading(false);
    setMsg("Danke dir. Wir schicken dir in den nächsten Tagen deinen Zugang.");

    // Facebook Lead auslösen NACH Mailchimp-Antwort
    // (PageView kommt aus dem globalen Pixel-Snippet)
    if (typeof window !== "undefined" && window.fbq) {
      // kleiner Timeout stellt sicher, dass fbq initialisiert ist
      setTimeout(() => {
        if (!leadFiredRef.current) {
          window.fbq("track", "Lead", {
            content_name: "Mailchimp Signup",
            // keine PII wie E-Mail mitschicken
            // optional: value/currency
            // value: 0, currency: "EUR",
          });
          leadFiredRef.current = true;
        }
      }, 0);
    }

    // Optional: Weiterleitung nach Anmeldung
    // navigate("/mediakit");
  };

  return (
    <>
      <form
        className={className}
        action={MC_ACTION}
        method="post"
        target="mc-target"
        noValidate
        onSubmit={handleSubmit}
      >
        <label htmlFor="mce-EMAIL" className="sr-only">
          E-Mail
        </label>
        <input
          id="mce-EMAIL"
          type="email"
          name="EMAIL"
          placeholder="Deine E-Mail-Adresse"
          required
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Honeypot: exakt so benennen (aus deinem Embed kopiert) */}
        <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
          <input
            type="text"
            name="b_2ba12036c00c7bce1283f2d64_5c660d7608"
            tabIndex={-1}
            defaultValue=""
          />
        </div>

        <button type="submit" disabled={loading} aria-label="Jetzt kostenlos starten">
          {loading ? "Wird gesendet…" : "Jetzt kostenlos starten"}
        </button>

        {msg && (
          <p role="status" className="muted" style={{ marginTop: 8 }}>
            {msg}
          </p>
        )}
      </form>

      {/* Unsichtbares Ziel, damit kein Seitenwechsel passiert */}
      <iframe
        name="mc-target"
        ref={iframeRef}
        onLoad={handleIframeLoad}
        style={{ display: "none" }}
        title="mailchimp-target"
      />
    </>
  );
}
