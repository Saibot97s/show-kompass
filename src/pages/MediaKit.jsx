import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import Cropper from "react-easy-crop";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const TEMPLATE_URL = "/templates/mediakit.html";
const PHOTO_ASPECT = 1 / 1;

function slugify(s) {
  return (s || "media-kit")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/(^-|-$)/g, "");
}

function escapeHtml(str) {
  return (str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Hilfefunktion: Bild laden
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

// Zuschneiden (Canvas aus cropPixels erstellen)
async function getCroppedImg(imageSrc, cropPixels, type = "image/jpeg") {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = Math.round(cropPixels.width);
  canvas.height = Math.round(cropPixels.height);

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return canvas.toDataURL(type, 0.98);
}


async function waitForImages(root) {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(imgs.map(img => {
    if (img.complete) return Promise.resolve();
    return new Promise(res => {
      const done = () => res();
      img.onload = done; img.onerror = done;
      if (img.decode) { img.decode().then(done).catch(done); }
    });
  }));
}

export default function MediaKit() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState(""); // final (DataURL, ggf. zugeschnitten)
  const [rawPhotoUrl, setRawPhotoUrl] = useState(""); // original DataURL vorm Zuschnitt
  const [tagline, setTagline] = useState("");
  const [contact, setContact] = useState("");      // mehrzeilig
  const [heroText, setHeroText] = useState("");    // mehrzeilig
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Jetzt ansehen");

  // Seite 2
  const [bioBlock, setBioBlock] = useState("");            // mehrzeilig
  const [repertoireBlock, setRepertoireBlock] = useState(""); // mehrzeilig
  const [riderBlock, setRiderBlock] = useState("");        // mehrzeilig

  // Bild für Seite 2
  const [portraitPhotoUrl, setPortraitPhotoUrl] = useState("");

  // Cropper-UI
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const [busy, setBusy] = useState(false);
  const hiddenHostRef = useRef(null);

  async function onGenerate(e) {
    e?.preventDefault?.();

    if (!name.trim() || !bio.trim() || !photoUrl) {
      alert("Bitte Name, Bio und ein (zugeschnittenes) Foto angeben.");
      return;
    }

    if (!portraitPhotoUrl) {
      alert("Bitte auch das Portrait für Seite 2 hochladen.");
      return;
    }

    setBusy(true);
    try {
      // 1) Template laden
      const res = await fetch(TEMPLATE_URL);
      if (!res.ok) throw new Error(`Template nicht gefunden: ${TEMPLATE_URL}`);
      let html = await res.text();

      // 2) Platzhalter
      const autoTagline = (bio || "").split(/\n/).find(l => l.trim()) || "";
      const finalTagline = (tagline && tagline.trim())
        ? tagline.trim()
        : autoTagline.slice(0, 120);
      html = html
        // Seite 1
        .replaceAll("{{name}}", escapeHtml(name))
        .replaceAll("{{tagline}}", escapeHtml(finalTagline))
        .replaceAll("{{contact}}", escapeHtml(contact))
        .replaceAll("{{herotext}}", escapeHtml(heroText))
        .replaceAll("{{ctaUrl}}", escapeHtml(ctaUrl))
        .replaceAll("{{ctaLabel}}", escapeHtml(ctaLabel))
        // Seite 2
        .replaceAll("{{bioBlock}}", escapeHtml(bioBlock))
        .replaceAll("{{repertoireBlock}}", escapeHtml(repertoireBlock))
        .replaceAll("{{riderBlock}}", escapeHtml(riderBlock))
        .replaceAll("{{page2ImageUrl}}", portraitPhotoUrl)   // <— WICHTIG
        // Hero-Bild Seite 1
        .replaceAll("{{photoDataUrl}}", photoUrl);

      // 3) OFFSCREEN Host (sichtbar renderbar!)
      let host = hiddenHostRef.current;
      if (!host) {
        host = document.createElement("div");
        host.setAttribute("aria-hidden", "true");
        host.style.position = "absolute";
        host.style.left = "-10000px"; // außerhalb Viewport
        host.style.top = "0";
        host.style.width = "794px"; // A4 @ 96dpi
        host.style.height = "auto"; // mehrere Seiten
        host.style.pointerEvents = "none";
        document.body.appendChild(host);
        hiddenHostRef.current = host;
      }
      host.innerHTML = html;

      // 4) Seiten sammeln
      const pages = Array.from(host.querySelectorAll(".page"));
      if (!pages.length) throw new Error("Keine .page im Template gefunden");

      // Auf Bilder warten (je Seite)
      for (const p of pages) await waitForImages(p);

      // 5) PDF erstellen (A4 mm)
      const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

      // Canvas -> Bild -> Seite
      for (let i = 0; i < pages.length; i++) {
        const canvas = await html2canvas(pages[i], {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff", // gegen transparent/weiß
          scrollX: 0, scrollY: 0
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        const pageW = pdf.internal.pageSize.getWidth(); // 210 mm
        const pageH = pdf.internal.pageSize.getHeight(); // 297 mm

        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
      }

      pdf.save(`${slugify(name)}.pdf`);
    } catch (err) {
      console.error(err);
      alert(err.message || "Fehler beim PDF-Export.");
    } finally {
      setBusy(false);
    }
  }


  function onPhotoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setRawPhotoUrl(dataUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedPixels(null);
      setCropOpen(true); // direkt Crop-Dialog öffnen
    };
    reader.readAsDataURL(file);
  }


  function portraitPhotoChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setPortraitPhotoUrl(String(r.result || ""));
    r.readAsDataURL(f);
  }

  async function confirmCrop() {
    if (!rawPhotoUrl) return;
    let pixels = croppedPixels;
    if (!pixels) {
      // Wenn der User nicht interagiert hat: gesamten Bildbereich verwenden
      const img = await createImage(rawPhotoUrl);
      pixels = { x: 0, y: 0, width: img.width, height: img.height };
    }
    const cropped = await getCroppedImg(rawPhotoUrl, pixels, "image/jpeg");
    setPhotoUrl(cropped);
    setCropOpen(false);
  }

  return (
    <main className="container section">
      <header style={{ marginBottom: 16 }}>
        <h1 style={{ margin: 0 }}>Media-Kit Generator</h1>
        <p className="muted" style={{ margin: "6px 0 0" }}>
        </p>
      </header>

      <form className="form-card" onSubmit={onGenerate}>
        <div className="field">
          <label htmlFor="mk-name" className="label">Name *</label>
          <input
            id="mk-name"
            name="name"
            className="big-input"
            placeholder="Künstler*in / Bandname"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="mk-bio" className="label">Bio *</label>
          <textarea
            id="mk-bio"
            name="bio"
            className="big-textarea"
            placeholder="Kurz-Biografie …"
            required
            rows={10}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>


        <div className="field">
          <label htmlFor="tagline" className="label">Tagline *</label>
          <input
            className="big-input"
            placeholder="Kurzer Claim …"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>


        <div className="field">
          <label htmlFor="tagline" className="label">Kontakt *</label>
          <textarea
            className="big-textarea"
            placeholder={"Max Mustermann\nmax@example.com\n+43 660 1234567"}
            rows={5}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="tagline" className="label">Hero Text Rechts *</label>
          <textarea
            className="big-textarea"
            placeholder="Kurztext …"
            rows={6}
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="tagline" className="label">CTA URL & LAbel *</label>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="big-input"
              placeholder="https://…"
              value={ctaUrl}
              onChange={(e) => setCtaUrl(e.target.value)}
              style={{ flex: 2 }}
            />
            <input
              className="big-input"
              placeholder="Button-Text"
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>

        <h3 style={{ marginTop: 24 }}>Seite 2</h3>

        <div className="field">
          <label htmlFor="tagline" className="label">Bio *</label>
          <textarea
            className="big-textarea"
            placeholder="BIO …"
            rows={8}
            value={bioBlock}
            onChange={(e) => setBioBlock(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="tagline" className="label">Reportaout *</label>
          <textarea
            className="big-textarea"
            placeholder="Repertoire …"
            rows={6}
            value={repertoireBlock}
            onChange={(e) => setRepertoireBlock(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="tagline" className="label">Tech Rider *</label>
          <textarea
            className="big-textarea"
            placeholder="Technische Anforderungen …"
            rows={6}
            value={riderBlock}
            onChange={(e) => setRiderBlock(e.target.value)}
          />
        </div>

        <div className="field">
          <label className="label">Portrait Seite 2 *</label>
          <div className="photo-drop">
            <input type="file" accept="image/*" required onChange={portraitPhotoChange} />
            <small className="muted">JPG oder PNG.</small>
            {portraitPhotoUrl && (
              <div style={{ marginTop: 8 }}>
                <img src={portraitPhotoUrl} alt="Vorschau Seite 2" className="preview" />
              </div>
            )}
          </div>
        </div>


        <div className="field">
          <label className="label">Hero Foto *</label>
          <div className="photo-drop">
            <input type="file" accept="image/*" onChange={onPhotoChange} />
            <small className="muted">JPG oder PNG. Ziel-Format: 4:5.</small>

            {photoUrl && (
              <div style={{ marginTop: 12 }}>
                <img src={photoUrl} alt="Vorschau Foto" className="preview" />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button type="button" className="btn" onClick={() => setCropOpen(true)}>Foto erneut zuschneiden</button>
                </div>
              </div>
            )}
          </div>
        </div>




        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button type="submit" className="btn primary generate-btn" disabled={busy}>
            {busy ? "Erzeuge…" : "PDF generieren"}
          </button>
          <a className="btn" href={TEMPLATE_URL} download>Template herunterladen</a>
        </div>
      </form>

      {/* Crop-Dialog */}
      {cropOpen && rawPhotoUrl && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Foto zuschneiden">
          <div className="modal">
            <div className="cropper-wrap">
              <Cropper
                image={rawPhotoUrl}
                crop={crop}
                zoom={zoom}
                aspect={PHOTO_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, croppedPixels) => setCroppedPixels(croppedPixels)}
                restrictPosition={true}
                showGrid={false}
              />
            </div>
            <div className="modal-actions">
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                aria-label="Zoom"
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="btn" onClick={() => setCropOpen(false)}>Abbrechen</button>
                <button type="button" className="btn primary" onClick={confirmCrop}>Übernehmen</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
