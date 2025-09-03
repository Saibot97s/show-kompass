import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";
import Cropper from "react-easy-crop";

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

  setBusy(true);
  try {
    // 1) Template laden
    const res = await fetch(TEMPLATE_URL);
    if (!res.ok) throw new Error(`Template nicht gefunden: ${TEMPLATE_URL}`);
    let html = await res.text();

    // 2) Platzhalter ersetzen (inkl. Tagline-Fix)
    const bioHtml = escapeHtml(bio).replace(/\n/g, "<br>");
    const firstLine = (bio || "").split(/\n/).find(l => l.trim().length > 0) || "";
    const tagline = firstLine.slice(0, 120);

    html = html
      .replaceAll("{{name}}", escapeHtml(name))
      .replaceAll("{{bioHtml}}", bioHtml)
      .replaceAll("{{photoDataUrl}}", photoUrl)
      .replaceAll("{{year}}", String(new Date().getFullYear()))
      .replaceAll("{{tagline}}", escapeHtml(tagline));

    // Plausibilitätscheck auf Platzhalter
    if (html.includes("{{photoDataUrl}}")) {
      throw new Error("Template-Platzhalter {{photoDataUrl}} wurde nicht ersetzt. Prüfe Dateipfad oder Platzhalternamen.");
    }

    // 3) Versteckten Host im Viewport anlegen (sichtbar layouten)
    let host = hiddenHostRef.current;
    if (!host) {
      host = document.createElement("div");
      host.setAttribute("aria-hidden", "true");
      host.style.position = "fixed";
      host.style.left = "0";
      host.style.top = "0";
      host.style.width = "794px";    // A4 @ 96dpi
      host.style.height = "1123px";  // A4 @ 96dpi
      host.style.visibility = "hidden";
      host.style.pointerEvents = "none";
      host.style.zIndex = "-1";
      document.body.appendChild(host);
      hiddenHostRef.current = host;
    }
    host.innerHTML = html;

    // >>> WICHTIG: HIER pageEl definieren – DANN benutzen!
    const pageEl = host.querySelector(".page") || host;

    // Debug-Helfer (optional)
    const imgEl = pageEl.querySelector("img");
    console.log(
      "IMG present?", !!imgEl,
      "complete?", imgEl ? imgEl.complete : null,
      "dataURL?", imgEl ? String(imgEl.src).startsWith("data:image/") : null
    );

    // Auf Bilder warten, bevor gerendert wird
    await waitForImages(pageEl);

    // 4) PDF erzeugen
    const filename = `${slugify(name)}.pdf`;
    const opt = {
      margin: 0,
      filename,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        windowWidth: 794
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["css", "legacy"] },
    };

    await html2pdf().set(opt).from(pageEl).save();
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
          <label className="label">Foto *</label>
          <div className="photo-drop">
            <input type="file" accept="image/*" onChange={onPhotoChange} />
            <small className="muted">JPG oder PNG. Zuschnitt im nächsten Schritt. Ziel-Format: 4:5 (Portrait).</small>

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
