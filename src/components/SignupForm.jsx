import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SignupForm({ className }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const iframeRef = useRef(null);
  const navigate = useNavigate();

  // Mailchimp-Action exakt aus deinem Embed (echte & statt &amp;)
  const MC_ACTION =
    "https://us19.list-manage.com/subscribe/post?u=2ba12036c00c7bce1283f2d64&id=5c660d7608&f_id=00c4c2e1f0";


  const handleSubmit = () => {
    setSubmitted(true);
    setLoading(true);
    setMsg(null);
  };

  const handleIframeLoad = () => {
    if (!submitted) return;
    setLoading(false);
    setMsg("Danke dir. Wir schicken dir in den nächsten Tagen deinen Zugang.");
    // Weiter zum Generator
    //navigate("/mediakit");
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
