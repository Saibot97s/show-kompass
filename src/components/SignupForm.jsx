import { useState, useRef } from "react";

export default function SignupForm({ className = "" }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const iframeRef = useRef(null);
  const leadFiredRef = useRef(false);

  // Eindeutige Namen je Instanz
  const uidRef = useRef(`mc_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`);
  const frameName = `${uidRef.current}_target`;
  const emailInputId = `${uidRef.current}_email`;

  // Mailchimp-Action (deine IDs beibehalten)
const MC_ACTION =
  "https://showkompass.us16.list-manage.com/subscribe/post?u=6181d0a84ad9c7219033badec&id=e0f5b82a74&f_id=001692e1f0";


  function handleSubmit() {
    setSubmitted(true);
    setLoading(true);
    setMsg(null);
    leadFiredRef.current = false;
  }

  function handleIframeLoad() {
    // nur auf echte Submits reagieren
    if (!submitted || leadFiredRef.current) return;

    setLoading(false);
    setMsg("Danke dir. Wir schicken dir in den nächsten Tagen deinen Zugang.");

    // optionales Facebook Pixel
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      window.fbq("track", "Purchase", { content_name: "Mailchimp Signup" });
    }
    leadFiredRef.current = true;
  }

  return (
    <>
      <form
        className={className}
        action={MC_ACTION}
        method="post"
        target={frameName}       // ← einzigartig pro Instanz
        noValidate
        onSubmit={handleSubmit}
        acceptCharset="UTF-8"
      >
        <label htmlFor={emailInputId} className="sr-only">E-Mail</label>
        <input
          id={emailInputId}      // ← einzigartig pro Instanz
          type="email"
          name="EMAIL"
          placeholder="Deine E-Mail-Adresse"
          required
          inputMode="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Honeypot unverändert lassen */}
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

        {msg && <p role="status" className="muted" style={{ marginTop: 8 }}>{msg}</p>}
      </form>

      <iframe
        name={frameName} 
        ref={iframeRef}
        onLoad={handleIframeLoad}
        style={{ display: "none" }}
        title={`mailchimp-target-${uidRef.current}`}
      />
    </>
  );
}
