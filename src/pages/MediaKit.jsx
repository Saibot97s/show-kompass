import { useState, useRef, useMemo, useId } from "react";
import html2pdf from "html2pdf.js";
import Cropper from "react-easy-crop";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const TEMPLATE_URL = "/templates/mediakit.html";
const HERO_ASPECT = 1 / 1;
const PORTRAIT_ASPECT = 3 / 4;

const COLOR_TEMPLATES = [
  {
    id: "ocean", name: "Ocean",
    c1: "#0ea5e9", c2: "#111827", c3: "#e6f6fe",
    on1: "#ffffff", on2: "#ffffff", on3: "#0b1220"
  },
  {
    id: "forest", name: "Forest",
    c1: "#10b981", c2: "#064e3b", c3: "rgba(194, 255, 196, 1)",
    on1: "#0b1f16", on2: "#eafff6", on3: "#083f2f"
  },
  {
    id: "violet", name: "Violet",
    c1: "#8b5cf6", c2: "#1f2937", c3: "#efe9ff",
    on1: "#ffffff", on2: "#e5e7eb", on3: "#261b4a"
  },
  {
    id: "slate", name: "Slate",
    c1: "#111827", c2: "#6b7280", c3: "#f3f4f6",
    on1: "#ffffff", on2: "#ffffff", on3: "#111827"
  },
  {
    id: "ember", name: "Ember",
    c1: "#f97316", c2: "#1f2937", c3: "#fff3e6",
    on1: "#111111", on2: "#ffffff", on3: "#111111"
  },
  {
    id: "gold", name: "Gold",
    c1: "#d97706", c2: "#0f172a", c3: "#fff7e6",
    on1: "#111111", on2: "#ffffff", on3: "#111111"
  },
  {
    id: "mono", name: "Mono",
    c1: "#111827", c2: "#374151", c3: "#f3f4f6",
    on1: "#ffffff", on2: "#ffffff", on3: "#111827"
  },
  {
    id: "teal", name: "Teal",
    c1: "#14b8a6", c2: "#0f172a", c3: "#e7f7f5",
    on1: "#07231f", on2: "#e5e7eb", on3: "#0b1220"
  },
  {
    id: "blush", name: "Blush",
    c1: "#f43f5e", c2: "#1f2937", c3: "#ffe4ea",
    on1: "#ffffff", on2: "#e5e7eb", on3: "#6b0f1a"
  },
  {
    id: "indigo", name: "Indigo",
    c1: "#4f46e5", c2: "#111827", c3: "#eef2ff",
    on1: "#ffffff", on2: "#ffffff", on3: "#111827"
  },
  {
    id: "copper", name: "Copper",
    c1: "#b45309", c2: "#1f2937", c3: "#fff4e6",
    on1: "#ffffff", on2: "#e5e7eb", on3: "#111827"
  },
  {
    id: "aqua", name: "Aqua",
    c1: "#06b6d4", c2: "#0b132b", c3: "#e0faff",
    on1: "#082f49", on2: "#e5e7eb", on3: "#06202a"
  },
  {
    id: "berry", name: "Berry",
    c1: "#a21caf", c2: "#3b0a2a", c3: "#fde7ff",
    on1: "#ffffff", on2: "#ffffff", on3: "#3b0a2a"
  },
];


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

function CollapsibleText({ children, collapsedLines = 6 }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="collapsible">
      <div
        className={`collapsible-content ${open ? "" : "is-clamped"}`}
        style={{ "--lines": collapsedLines }}
      >
        {children}
      </div>

      <button
        type="button"
        className="link-btn"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        {open ? "weniger anzeigen" : "mehr anzeigen"}
      </button>
    </div>
  );
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
  const [bio, setBio] = useState("[Name] ist ein/e [Genre]-Musiker/in aus [Ort], der/die seit [Jahr] Musik veröffentlicht. Erste Erfolge waren [Highlight 1] und [Highlight 2]. Sein/ihr Sound bewegt sich zwischen [Genre/Einflüsse] und [besondere Merkmale]. [Name] begann mit [Instrument] im Alter von [X Jahren]. Inspiriert von [Einflüsse] entwickelte er/sie einen Stil, der [Beschreibung des Sounds]. Zurzeit arbeitet [Name] an [Projekt/Release/Tour]. Zusätzlich ist er/sie in [Nebenprojekte] involviert. In den kommenden Monaten stehen [Events/Shows] an.");
  const [photoUrl, setPhotoUrl] = useState(""); // final (DataURL, ggf. zugeschnitten)
  const [rawPhotoUrl, setRawPhotoUrl] = useState(""); // original DataURL vorm Zuschnitt
  const [tagline, setTagline] = useState("");
  const [contact, setContact] = useState("DEIN NAME\ndeine@email.com\n+00 000 000\nInsta @instagram\nTiktok @tikto");
  const [heroText, setHeroText] = useState("[Name] verbindet druckvolle [Genre/Mix: z. B. Melodic & Tech House] mit organischen Samples und detailverliebten Arrangements. Ideal für [Event-Typ] und andere Events.\n \n Bekannt aus: Bekannt aus: [Sender 1] · [Zeitung 1]");
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Jetzt ansehen");

  //Templates
  const [templateId, setTemplateId] = useState(COLOR_TEMPLATES[0].id);
  const activeTpl = COLOR_TEMPLATES.find(t => t.id === templateId) || COLOR_TEMPLATES[0];

  // Seite 2
  const [bioBlock, setBioBlock] = useState("[Name] ist ein/e [Genre]-Musiker/in aus [Ort], der/die seit [Jahr] Musik veröffentlicht. Erste Erfolge waren [Highlight 1] und [Highlight 2]. Sein/ihr Sound bewegt sich zwischen [Genre/Einflüsse] und [besondere Merkmale]. [Name] begann mit [Instrument] im Alter von [X Jahren]. Inspiriert von [Einflüsse] entwickelte er/sie einen Stil, der [Beschreibung des Sounds]. Zurzeit arbeitet [Name] an [Projekt/Release/Tour]. Zusätzlich ist er/sie in [Nebenprojekte] involviert. In den kommenden Monaten stehen [Events/Shows] an.");
  const [repertoireBlock, setRepertoireBlock] = useState("");
  const [riderBlock, setRiderBlock] = useState("");

  // Bild für Seite 2
  const [portraitPhotoUrl, setPortraitPhotoUrl] = useState("");


  // --- Hero-Crop-UI (für das große Foto auf Seite 1) ---
  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  // Portrait-Crop-UI ---
  const [portraitCropOpen, setPortraitCropOpen] = useState(false);
  const [rawPortraitPhotoUrl, setRawPortraitPhotoUrl] = useState("");
  const [portraitCrop, setPortraitCrop] = useState({ x: 0, y: 0 });
  const [portraitZoom, setPortraitZoom] = useState(1);
  const [portraitCroppedPixels, setPortraitCroppedPixels] = useState(null);

  const [busy, setBusy] = useState(false);
  const hiddenHostRef = useRef(null);

  function normalizeUrl(u) {
    if (!u) return "";
    const hasProto = /^https?:\/\//i.test(u);
    return hasProto ? u : `https://${u}`;
  }

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

      // nach host.innerHTML = html;
      const { c1, c2, c3, on1, on2, on3 } = activeTpl;
      host.style.setProperty("--c1", c1);
      host.style.setProperty("--c2", c2);
      host.style.setProperty("--c3", c3 ?? c1);
      host.style.setProperty("--on-c1", on1);
      host.style.setProperty("--on-c2", on2);
      host.style.setProperty("--on-c3", on3 ?? on1);


      host.prepend();


      // 4) Seiten sammeln
      const pages = Array.from(host.querySelectorAll(".page"));
      if (!pages.length) throw new Error("Keine .page im Template gefunden");

      // Auf Bilder warten (je Seite)
      for (const p of pages) await waitForImages(p);

      // 5) PDF erstellen (A4 mm)
const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

for (let i = 0; i < pages.length; i++) {
  const pageEl = pages[i];

  const canvas = await html2canvas(pageEl, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    scrollX: 0,
    scrollY: 0,
  });
  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pageW = pdf.internal.pageSize.getWidth();  // 210 mm
  const pageH = pdf.internal.pageSize.getHeight(); // 297 mm

  if (i > 0) pdf.addPage();
  pdf.addImage(imgData, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");

  // === CTA-Link-Annotation (volle Buttonfläche) NUR für Seite 1 ===
  if (i === 0) {
    const ctaEl = pageEl.querySelector(".cta");
    const url = normalizeUrl(ctaUrl); // nimm den State-Wert
    if (ctaEl && url) {
      const pr = pageEl.getBoundingClientRect();
      const br = ctaEl.getBoundingClientRect();

      // DOM-Pixel → PDF-mm (proportional skaliert)
      const x = ((br.left - pr.left) / pr.width)  * pageW;
      const y = ((br.top  - pr.top)  / pr.height) * pageH;
      const w = (br.width  / pr.width)  * pageW;
      const h = (br.height / pr.height) * pageH;

      pdf.link(x, y, w, h, { url });
    }
  }
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
    r.onload = () => {
      const dataUrl = String(r.result || "");
      setRawPortraitPhotoUrl(dataUrl);
      setPortraitCrop({ x: 0, y: 0 });
      setPortraitZoom(1);
      setPortraitCroppedPixels(null);
      setPortraitCropOpen(true);
    };
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

  async function confirmPortraitCrop() {
    if (!rawPortraitPhotoUrl) return;
    let pixels = portraitCroppedPixels;

    if (!pixels) {
      const img = await createImage(rawPortraitPhotoUrl);
      pixels = { x: 0, y: 0, width: img.width, height: img.height };
    }

    const cropped = await getCroppedImg(rawPortraitPhotoUrl, pixels, "image/jpeg");
    setPortraitPhotoUrl(cropped);
    setPortraitCropOpen(false);
  }

  return (
    <main className="container section">
      <h1 style={{ margin: 0 }}>Media-Kit Generator</h1>
      <p className="" style={{ margin: "6px 0 0" }}>
      </p>

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
          <label htmlFor="tagline" className="label">Tagline *</label>
          Beschreibe kurz in wenigen Worten was dich besonders macht.

          <input
            className="big-input"
            placeholder="Jazz Cover-Songs für jedes Event"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="tagline" className="label">Kurzbeschriebung Titelblatt</label>
          <textarea
            className="big-textarea"
            placeholder={"[Name] verbindet druckvolle [Genre/Mix: z. B. Melodic & Tech House] mit organischen Samples und detailverliebten Arrangements. Ideal für [Event-Typ] und andere Events.\n \n Bekannt aus: Bekannt aus: [Sender 1] · [Zeitung 1]"}
            rows={6}
            value={heroText}
            onChange={(e) => setHeroText(e.target.value)}
          />
        </div>


        <div className="field">
          <label htmlFor="tagline" className="label">Kontakt *</label>
          <textarea
            className="big-textarea"
            placeholder={"DEIN NAME\ndeine@email.com\n+00 000 000\nInsta @instagram\nTiktok @tiktok"}
            rows={5}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
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

        <div className="field">
          <label htmlFor="mk-bio" className="label">Bio * (300–400 Wörter)</label>
          <div className="collapsible-box">
            <CollapsibleText collapsedLines={1}>

              <div>
                <div>
                  Die Bio ist dafür da, dich kurz vorzustellen und einen persönlichen Eindruck zu hinterlassen.
                </div><br />
                <strong>Fragen, die du beantworten solltest</strong>
                <ul>
                  <li>Wo lebst und arbeitest du?</li>
                  <li>Wann hast du mit Musik angefangen / veröffentlicht / live gespielt? Auslöser?</li>
                  <li>Welches Genre machst du – wie klingt dein Sound genau?</li>
                  <li>Wer sind deine Einflüsse?</li>
                  <li>Welche Releases gibt es (EPs, Alben, Remixe …)?</li>
                  <li>Welche Auftritte/Shows sind erwähnenswert?</li>
                  <li>Woran arbeitest du gerade (Tour, Studio, Kooperationen …)?</li>
                  <li>Nebenprojekte (Radio, Eventorga, Kollektiv …)?</li>
                </ul>

                <strong>Struktur deiner Bio</strong>
                <ol>
                  <li><em>Einstieg &amp; Highlights:</em> Wer du bist, Herkunft, Genre/Sound + 1–2 Erfolge.</li>
                  <li><em>Hintergrund &amp; Story:</em> Weg zur Musik, Stilprägung, was dich einzigartig macht.</li>
                  <li><em>Aktuell &amp; Ausblick:</em> Woran arbeitest du? Was steht an?</li>
                </ol>

                <strong>Checkliste vor Abgabe</strong>
                <ul>
                  <li>Enthält: Wer bin ich, wie klinge ich, was habe ich gemacht, woran arbeite ich?</li>
                  <li>Sätze aktiv formuliert.</li>
                  <li>Kurz &amp; klar (gekürzt).</li>
                  <li>Fremde verstehen in 10 Sek., was du machst.</li>
                  <li>Rechtschreibung geprüft, Freunde gegenlesen lassen.</li>
                </ul>
              </div>
            </CollapsibleText>
          </div>
          <textarea
            id="mk-bio"
            name="bio"
            className="big-textarea"
            defaultValue="hahah"
            required
            rows={10}
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
          <label className="label">Portrait-Foto *</label>
          <div className="photo-drop">
            <input type="file" accept="image/*" required onChange={portraitPhotoChange} />
            <br />
            <small className="muted">JPG oder PNG. Hochformat.</small>
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
            <br />
            <small className="muted">JPG oder PNG. Ziel-Format: 1:1.</small>

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


        {/*Tempalte*/}
        <div className="field">
          <label className="label">Media-Kit Farben</label>

          <div role="radiogroup" aria-label="Template-Farben" className="tpl-grid">
            {COLOR_TEMPLATES.map((t) => {
              const active = templateId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setTemplateId(t.id)}
                  className={`tpl-opt ${active ? "is-active" : ""}`}
                  style={{
                    "--c1": t.c1,
                    "--c2": t.c2,
                    "--c3": t.c3 ?? t.c1,
                    "--on-c1": t.on1,
                    "--on-c2": t.on2,
                    "--on-c3": t.on3 ?? t.on1,
                  }}
                  title={t.name}
                >
                  <span className="swatch" />
                  <span className="swatch" />
                  <span className="tpl-name">{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>







        <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
          <button type="submit" className="btn primary generate-btn" disabled={busy}>
            {busy ? "Erzeuge…" : "Media Kit generieren"}
          </button>
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
                aspect={HERO_ASPECT}
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

      {portraitCropOpen && rawPortraitPhotoUrl && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Portrait zuschneiden">
          <div className="modal">
            <div className="cropper-wrap">
              <Cropper
                image={rawPortraitPhotoUrl}
                crop={portraitCrop}
                zoom={portraitZoom}
                aspect={PORTRAIT_ASPECT}
                onCropChange={setPortraitCrop}
                onZoomChange={setPortraitZoom}
                onCropComplete={(_, cp) => setPortraitCroppedPixels(cp)}
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
                value={portraitZoom}
                onChange={(e) => setPortraitZoom(Number(e.target.value))}
                aria-label="Zoom"
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="button" className="btn" onClick={() => setPortraitCropOpen(false)}>Abbrechen</button>
                <button type="button" className="btn primary" onClick={confirmPortraitCrop}>Übernehmen</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
