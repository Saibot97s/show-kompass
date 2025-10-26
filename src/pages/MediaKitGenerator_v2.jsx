import React, { useEffect, useMemo, useRef, useState, memo } from "react";
import Cropper from "react-easy-crop";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// ===== MUI =====
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Chip,
  Stack,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

// ======= CONSTANTS / CONFIG =======
const PURPLE = "#7e57c2"; // Primary highlight
const SUCCESS = "#2e7d32";

const TEMPLATE_URL = "/templates/mediakit.html";
const HERO_ASPECT = 1 / 1;
const PORTRAIT_ASPECT = 3 / 4;

const STORAGE_KEY = "mk:autosave:v1";

const COLOR_TEMPLATES = [
  { id: "ocean", name: "Ocean", c1: "#0ea5e9", c2: "#111827", c3: "#e6f6fe", on1: "#ffffff", on2: "#ffffff", on3: "#0b1220" },
  { id: "forest", name: "Forest", c1: "#10b981", c2: "#064e3b", c3: "rgba(194, 255, 196, 1)", on1: "#0b1f16", on2: "#eafff6", on3: "#083f2f" },
  { id: "violet", name: "Violet", c1: "#8b5cf6", c2: "#1f2937", c3: "#efe9ff", on1: "#ffffff", on2: "#e5e7eb", on3: "#261b4a" },
  { id: "slate", name: "Slate", c1: "#111827", c2: "#6b7280", c3: "#f3f4f6", on1: "#ffffff", on2: "#ffffff", on3: "#111827" },
  { id: "ember", name: "Ember", c1: "#f97316", c2: "#1f2937", c3: "#fff3e6", on1: "#111111", on2: "#ffffff", on3: "#111111" },
  { id: "gold", name: "Gold", c1: "#d97706", c2: "#0f172a", c3: "#fff7e6", on1: "#111111", on2: "#ffffff", on3: "#111111" },
  { id: "mono", name: "Mono", c1: "#111827", c2: "#374151", c3: "#f3f4f6", on1: "#ffffff", on2: "#ffffff", on3: "#111827" },
  { id: "teal", name: "Teal", c1: "#14b8a6", c2: "#0f172a", c3: "#e7f7f5", on1: "#07231f", on2: "#e5e7eb", on3: "#0b1220" },
  { id: "blush", name: "Blush", c1: "#f43f5e", c2: "#1f2937", c3: "#ffe4ea", on1: "#ffffff", on2: "#e5e7eb", on3: "#6b0f1a" },
  { id: "indigo", name: "Indigo", c1: "#4f46e5", c2: "#111827", c3: "#eef2ff", on1: "#ffffff", on2: "#ffffff", on3: "#111827" },
  { id: "copper", name: "Copper", c1: "#b45309", c2: "#1f2937", c3: "#fff4e6", on1: "#ffffff", on2: "#e5e7eb", on3: "#111827" },
  { id: "aqua", name: "Aqua", c1: "#06b6d4", c2: "#0b132b", c3: "#e0faff", on1: "#082f49", on2: "e5e7eb", on3: "#06202a" },
  { id: "berry", name: "Berry", c1: "#a21caf", c2: "#3b0a2a", c3: "#fde7ff", on1: "#ffffff", on2: "#ffffff", on3: "#3b0a2a" },
];

const GENRES = [
  "Pop",
  "Rock",
  "Jazz",
  "Electronic",
  "Hip-Hop",
  "Classical",
  "Singer-Songwriter",
  "Indie",
  "R&B / Soul",
  "Country",
  "EDM",
  "House / Techno",
  "Metal",
  "Folk",
  "Andere",
];

// ======= UTILS =======
function isIOS() {
  const ua = navigator.userAgent || "";
  const iOSDevice = /iPad|iPhone|iPod/.test(ua);
  const iPadOS = navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOSDevice || iPadOS;
}
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
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}
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
  const imgs = Array.from(root.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise((res) => {
        const done = () => res();
        img.onload = done;
        img.onerror = done;
        if (img.decode) {
          img.decode().then(done).catch(done);
        }
      });
    })
  );
}
function getCoverCropPixels(imgW, imgH, targetAspect) {
  const imgAspect = imgW / imgH;
  if (imgAspect > targetAspect) {
    const cropH = imgH;
    const cropW = Math.round(imgH * targetAspect);
    const x = Math.round((imgW - cropW) / 2);
    return { x, y: 0, width: cropW, height: cropH };
  } else {
    const cropW = imgW;
    const cropH = Math.round(imgW / targetAspect);
    const y = Math.round((imgH - cropH) / 2);
    return { x: 0, y, width: cropW, height: cropH };
  }
}
function normalizeUrl(u) {
  if (!u) return "";
  const hasProto = /^https?:\/\//i.test(u);
  return hasProto ? u : `https://${u}`;
}

// ======= THEME =======
// Small design tweaks so it doesn't scream default MUI
const theme = createTheme({
  palette: {
    primary: { main: PURPLE },
    success: { main: SUCCESS },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    button: {
      textTransform: "none",
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
          ":hover": {
            boxShadow: "0 4px 14px rgba(0,0,0,0.12)",
          },
        },
        containedPrimary: {
          backgroundImage: `linear-gradient(90deg, ${PURPLE} 0%, #9c6cf3 100%)`,
        },
        outlined: {
          borderWidth: 2,
          borderColor: "rgba(0,0,0,0.12)",
          ":hover": {
            borderWidth: 2,
            borderColor: PURPLE,
            backgroundColor: "rgba(126,87,194,0.05)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 10,
          },
          "& .MuiFormHelperText-root": {
            fontSize: "0.7rem",
            opacity: 0.8,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: { display: "none" }, // numeric only
        iconContainer: {
          paddingRight: 8,
        },
      },
    },
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: "#d0d0d0",
          borderTopWidth: 2,
          borderRadius: 2,
        },
      },
    },
  },
});

// Custom Step icon:
// - Always purple for CURRENT step (even if already "completed")
// - Green for completed steps user already advanced past
// - Grey for locked/future steps
function NumberStepIcon(props) {
  const { active, completed, icon } = props;

  const bg = active ? PURPLE : completed ? SUCCESS : "#9e9e9e";
  const ringColor = active
    ? "rgba(126,87,194,.28)"
    : completed
    ? "rgba(46,125,50,.25)"
    : "rgba(0,0,0,.12)";

  const size = 28;
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: "10px",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: bg,
        color: "#fff",
        fontWeight: 700,
        fontVariantNumeric: "tabular-nums",
        fontSize: 14,
        boxShadow: `0 0 0 3px ${ringColor}`,
      }}
    >
      {icon}
    </Box>
  );
}

// ====== Counter helpers using MUI TextField ======
const InputWithCounter = memo(function InputWithCounter({ value, maxLength, helper, ...props }) {
  return (
    <TextField
      fullWidth
      value={value}
      inputProps={maxLength ? { maxLength } : undefined}
      helperText={`${value?.length ?? 0}${maxLength ? `/${maxLength}` : ""}${
        helper ? ` — ${helper}` : ""
      }`}
      {...props}
    />
  );
});

const TextareaWithCounter = memo(function TextareaWithCounter({
  value,
  maxLength,
  helper,
  rows = 6,
  ...props
}) {
  return (
    <TextField
      fullWidth
      multiline
      rows={rows}
      value={value}
      inputProps={maxLength ? { maxLength } : undefined}
      helperText={`${value?.length ?? 0}${maxLength ? `/${maxLength}` : ""}${
        helper ? ` — ${helper}` : ""
      }`}
      {...props}
    />
  );
});

// ====== MAIN COMPONENT ======
export default function MediaKitWizard_MUI() {
  // Form state
  const [name, setName] = useState("");
  const [contact, setContact] = useState(
    "DEIN NAME\ndeine@email.com\n+00 000 000\nInsta @instagram\nTiktok @tiktok"
  );
  const [genre, setGenre] = useState("");
  const [tagline, setTagline] = useState("");
  const [heroText, setHeroText] = useState(
    "[Name] verbindet druckvolle [Genre/Mix: z. B. Melodic & Tech House] mit organischen Samples und detailverliebten Arrangements. Ideal für [Event-Typ] und andere Events.\n \n Bekannt aus: Bekannt aus: [Sender 1] · [Zeitung 1]"
  );
  const [ctaUrl, setCtaUrl] = useState("");
  const [ctaLabel, setCtaLabel] = useState("Jetzt ansehen");

  const [bioBlock, setBioBlock] = useState(
    "[Name] ist ein/e [Genre]-Musiker/in aus [Ort], der/die seit [Jahr] Musik veröffentlicht. Erste Erfolge waren [Highlight 1] und [Highlight 2]. Sein/ihr Sound bewegt sich zwischen [Genre/Einflüsse] und [besondere Merkmale]. [Name] begann mit [Instrument] im Alter von [X Jahren]. Inspiriert von [Einflüsse] entwickelte er/sie einen Stil, der [Beschreibung des Sounds]. Zurzeit arbeitet [Name] an [Projekt/Release/Tour]. Zusätzlich ist er/sie in [Nebenprojekte] involviert. In den kommenden Monaten stehen [Events/Shows] an."
  );
  const [repertoireBlock, setRepertoireBlock] = useState("");
  const [riderBlock, setRiderBlock] = useState(
    "Bühne mind. 3x2 m, Stromanschluss (230 V Schuko) bühnennah, 1x Gesangsmikrofon (z. B. SM58), 1x Mikrofonständer, 1x DI-Box oder Klinke-Kabel (3,5 mm auf 2x XLR/Klinke) für Playback, 1x Monitor (Boden oder In-Ear), PA-Anlage passend zur Raumgröße, Mischpult min. 2 Kanäle (Gesang + Playback), Grundbeleuchtung mit weichem Frontlicht \n \n Vorbereitung: \nSoundcheck ca. 15 Min., Aufbauzeit ca. 20–30 Min., Zuspielung über eigenes Abspielgerät (Laptop/Smartphone), Backstage: Umkleide. Outdoor: überdachte Bühne erforderlich, keine direkte Sonne oder Regen auf Technik/Künstlerin."
  );

  // Images (hero + portrait) and cropping
  const [photoUrl, setPhotoUrl] = useState(""); // final cropped hero
  const [rawPhotoUrl, setRawPhotoUrl] = useState("");
  const [portraitPhotoUrl, setPortraitPhotoUrl] = useState("");
  const [rawPortraitPhotoUrl, setRawPortraitPhotoUrl] = useState("");

  const [cropOpen, setCropOpen] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState(null);

  const [portraitCropOpen, setPortraitCropOpen] = useState(false);
  const [portraitCrop, setPortraitCrop] = useState({ x: 0, y: 0 });
  const [portraitZoom, setPortraitZoom] = useState(1);
  const [portraitCroppedPixels, setPortraitCroppedPixels] = useState(null);

  // Template (colors)
  const [templateId, setTemplateId] = useState(COLOR_TEMPLATES[0].id);
  const activeTpl =
    COLOR_TEMPLATES.find((t) => t.id === templateId) || COLOR_TEMPLATES[0];

  // Busy state for generation
  const [busy, setBusy] = useState(false);
  const hiddenHostRef = useRef(null);

  // Menu + upload
  const [menuAnchor, setMenuAnchor] = useState(null);
  const uploadInputRef = useRef(null);

  // ===== Wizard steps =====
  const steps = useMemo(
    () => [
      {
        key: "basic",
        title: "Basic Data",
        video: "https://www.youtube.com/watch?v=Cvm1FZ79d8k",
        desc: "Name, Kontakt und Genre.",
        validate: () => name.trim() && contact.trim(),
      },
      {
        key: "portrait",
        title: "Portrait",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Hochformat-Portrait hochladen und zuschneiden.",
        validate: () => Boolean(portraitPhotoUrl),
      },
      {
        key: "tagbio",
        title: "Tag-Line & Bio-Text",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Kurz-Tagline und längere Bio.",
        validate: () => tagline.trim() && bioBlock.trim(),
      },
      {
        key: "cta",
        title: "CTA URL & Label",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Wohin sollen Interessierte klicken?",
        validate: () => ctaUrl.trim() && ctaLabel.trim(),
      },
      {
        key: "repertoire",
        title: "Repertoire",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Songs/Setlist.",
        validate: () => repertoireBlock.trim(),
      },
      {
        key: "rider",
        title: "Tech Rider",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Technische Anforderungen für Veranstalter:innen.",
        validate: () => riderBlock.trim(),
      },
      {
        key: "hero",
        title: "Hero Foto",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Quadratisches Titelbild (1:1).",
        validate: () => Boolean(photoUrl),
      },
      {
        key: "colors",
        title: "Media-Kit Colors + Download",
        video: "https://www.youtube.com/embed/ysz5S6PUM-U",
        desc: "Farben wählen und PDF generieren.",
        validate: () => Boolean(templateId),
      },
    ],
    [
      name,
      contact,
      portraitPhotoUrl,
      tagline,
      bioBlock,
      ctaUrl,
      ctaLabel,
      repertoireBlock,
      riderBlock,
      photoUrl,
      templateId,
    ]
  );

  const [activeStep, setActiveStep] = useState(0);
  // "maxStepUnlocked" = highest step index we've *visited via Next*
  // this drives "completed/green". A step only turns green once you hit Next and leave it.
  const [maxStepUnlocked, setMaxStepUnlocked] = useState(0);

  // A step is considered "complete/green" only if it's strictly before maxStepUnlocked
  // (so: only after you actually clicked "Weiter" past it)
  const isStepComplete = (index) => index < maxStepUnlocked;

  // You can click any step up to the furthest you've unlocked
  const canClickStep = (index) => index <= maxStepUnlocked;

  const goNext = () => {
    const canProceed = steps[activeStep].validate();
    if (!canProceed) return;
    const next = Math.min(activeStep + 1, steps.length - 1);
    setActiveStep(next);
    setMaxStepUnlocked((v) => Math.max(v, next));
  };

  // Keep video iframe stable to avoid flicker while typing
  const [videoSrc, setVideoSrc] = useState(steps[0].video);
  useEffect(() => {
    setVideoSrc(steps[activeStep].video);
  }, [activeStep]);

  // ===== Autosave =====
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const v = JSON.parse(raw);
      if (typeof v.name === "string") setName(v.name);
      if (typeof v.genre === "string") setGenre(v.genre);
      if (typeof v.tagline === "string") setTagline(v.tagline);
      if (typeof v.contact === "string") setContact(v.contact);
      if (typeof v.heroText === "string") setHeroText(v.heroText);
      if (typeof v.ctaUrl === "string") setCtaUrl(v.ctaUrl);
      if (typeof v.ctaLabel === "string") setCtaLabel(v.ctaLabel);
      if (typeof v.templateId === "string") setTemplateId(v.templateId);
      if (typeof v.bioBlock === "string") setBioBlock(v.bioBlock);
      if (typeof v.repertoireBlock === "string")
        setRepertoireBlock(v.repertoireBlock);
      if (typeof v.riderBlock === "string") setRiderBlock(v.riderBlock);
      if (typeof v.photoUrl === "string") setPhotoUrl(v.photoUrl);
      if (typeof v.portraitPhotoUrl === "string")
        setPortraitPhotoUrl(v.portraitPhotoUrl);
      if (typeof v.maxStepUnlocked === "number")
        setMaxStepUnlocked(v.maxStepUnlocked);
    } catch (e) {
      console.warn("Autosave laden fehlgeschlagen:", e);
    }
  }, []);

  useEffect(() => {
    const payload = {
      name,
      genre,
      tagline,
      contact,
      heroText,
      ctaUrl,
      ctaLabel,
      templateId,
      bioBlock,
      repertoireBlock,
      riderBlock,
      photoUrl,
      portraitPhotoUrl,
      maxStepUnlocked,
    };
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (e) {
        console.warn("Autosave fehlgeschlagen (Speicher voll?):", e);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [
    name,
    genre,
    tagline,
    contact,
    heroText,
    ctaUrl,
    ctaLabel,
    templateId,
    bioBlock,
    repertoireBlock,
    riderBlock,
    photoUrl,
    portraitPhotoUrl,
    maxStepUnlocked,
  ]);

  // ===== File handling + Crop dialogs =====
  function onHeroFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setRawPhotoUrl(String(dataUrl));
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedPixels(null);
      setCropOpen(true);
    };
    reader.readAsDataURL(file);
  }

  async function onPortraitFile(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = async () => {
      const dataUrl = String(r.result || "");
      const img = await createImage(dataUrl);
      const fallback = getCoverCropPixels(
        img.width,
        img.height,
        PORTRAIT_ASPECT
      );
      setRawPortraitPhotoUrl(dataUrl);
      setPortraitCroppedPixels(fallback);
      setPortraitCrop({ x: 0, y: 0 });
      setPortraitZoom(1);
      setPortraitCropOpen(true);
    };
    r.readAsDataURL(f);
  }

  async function confirmHeroCrop() {
    if (!rawPhotoUrl) return;
    let pixels = croppedPixels;
    if (!pixels) {
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
    const cropped = await getCroppedImg(
      rawPortraitPhotoUrl,
      pixels,
      "image/jpeg"
    );
    setPortraitPhotoUrl(cropped);
    setPortraitCropOpen(false);
  }

  // ===== Generate PDF =====
  async function onGenerate() {
    if (!name.trim() || !bioBlock.trim() || !photoUrl) {
      alert("Bitte Name, Bio und ein (zugeschnittenes) Hero-Foto angeben.");
      return;
    }
    if (!portraitPhotoUrl) {
      alert("Bitte auch das Portrait für Seite 2 hochladen.");
      return;
    }

    setBusy(true);
    try {
      const res = await fetch(TEMPLATE_URL);
      if (!res.ok) throw new Error(`Template nicht gefunden: ${TEMPLATE_URL}`);
      let html = await res.text();

      const autoTagline = (bioBlock || "")
        .split()
        .find((l) => l.trim()) || "";
      const finalTagline =
        tagline && tagline.trim()
          ? tagline.trim()
          : autoTagline.slice(0, 120);

      html = html
        .replaceAll("{{name}}", escapeHtml(name))
        .replaceAll("{{tagline}}", escapeHtml(finalTagline))
        .replaceAll("{{contact}}", escapeHtml(contact))
        .replaceAll("{{herotext}}", escapeHtml(heroText))
        .replaceAll("{{ctaUrl}}", escapeHtml(ctaUrl))
        .replaceAll("{{ctaLabel}}", escapeHtml(ctaLabel))
        .replaceAll("{{bioBlock}}", escapeHtml(bioBlock))
        .replaceAll("{{repertoireBlock}}", escapeHtml(repertoireBlock))
        .replaceAll("{{riderBlock}}", escapeHtml(riderBlock))
        .replaceAll("{{page2ImageUrl}}", portraitPhotoUrl)
        .replaceAll("{{photoDataUrl}}", photoUrl);

      // Offscreen host
      let host = hiddenHostRef.current;
      if (!host) {
        host = document.createElement("div");
        host.setAttribute("aria-hidden", "true");
        host.style.position = "absolute";
        host.style.left = "-10000px";
        host.style.top = "0";
        host.style.width = "794px"; // A4 @ 96dpi
        host.style.pointerEvents = "none";
        document.body.appendChild(host);
        hiddenHostRef.current = host;
      }
      host.innerHTML = html;

      const { c1, c2, c3, on1, on2, on3 } = activeTpl;
      host.style.setProperty("--c1", c1);
      host.style.setProperty("--c2", c2);
      host.style.setProperty("--c3", c3 ?? c1);
      host.style.setProperty("--on-c1", on1);
      host.style.setProperty("--on-c2", on2);
      host.style.setProperty("--on-c3", on3 ?? on1);

      const pages = Array.from(host.querySelectorAll(".page"));
      if (!pages.length) throw new Error("Keine .page im Template gefunden");
      for (const p of pages) await waitForImages(p);

      const previewTab = window.open("", "_blank", "noopener,noreferrer");
      if (previewTab) {
        previewTab.document.title = "PDF wird vorbereitet …";
        previewTab.document.body.innerHTML =
          '<p style="font: 14px system-ui; padding:16px">PDF wird vorbereitet …</p>';
      }

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
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
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        if (i > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          0,
          0,
          pageW,
          pageH,
          undefined,
          "FAST"
        );
        if (i === 0) {
          const ctaEl = pageEl.querySelector(".cta");
          const url = normalizeUrl(ctaUrl);
          if (ctaEl && url) {
            const pr = pageEl.getBoundingClientRect();
            const br = ctaEl.getBoundingClientRect();
            const x = ((br.left - pr.left) / pr.width) * pageW;
            const y = ((br.top - pr.top) / pr.height) * pageH;
            const w = (br.width / pr.width) * pageW;
            const h = (br.height / pr.height) * pageH;
            pdf.link(x, y, w, h, { url });
          }
        }
      }

      const filename = `${slugify(name)}.pdf`;
      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      if (previewTab) {
        previewTab.location.href = url;
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
      }
      if (!isIOS()) {
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setTimeout(() => URL.revokeObjectURL(url), 120000);
    } catch (err) {
      console.error(err);
      alert("Beim Erzeugen des PDFs ist etwas schiefgelaufen.");
    } finally {
      setBusy(false);
    }
  }

  // ====== MENU ACTIONS ======
  const openMenu = (e) => setMenuAnchor(e.currentTarget);
  const closeMenu = () => setMenuAnchor(null);

  const payload = () => ({
    name,
    genre,
    tagline,
    contact,
    heroText,
    ctaUrl,
    ctaLabel,
    templateId,
    bioBlock,
    repertoireBlock,
    riderBlock,
    photoUrl,
    portraitPhotoUrl,
    maxStepUnlocked,
  });

  const handleDownloadJson = () => {
    try {
      const data = JSON.stringify(payload(), null, 2);
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${slugify(name) || "mediakit"}-form.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert("Konnte JSON nicht herunterladen.");
    } finally {
      closeMenu();
    }
  };

  const handleReset = () => {
    closeMenu();
    if (
      window.confirm(
        "Formular wirklich zurücksetzen? Alle Eingaben werden gelöscht."
      )
    ) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  };

  const triggerUpload = () => {
    closeMenu();
    uploadInputRef.current?.click();
  };

  const handleUploadFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (typeof data.name === "string") setName(data.name);
      if (typeof data.genre === "string") setGenre(data.genre);
      if (typeof data.tagline === "string") setTagline(data.tagline);
      if (typeof data.contact === "string") setContact(data.contact);
      if (typeof data.heroText === "string") setHeroText(data.heroText);
      if (typeof data.ctaUrl === "string") setCtaUrl(data.ctaUrl);
      if (typeof data.ctaLabel === "string") setCtaLabel(data.ctaLabel);
      if (typeof data.templateId === "string") setTemplateId(data.templateId);
      if (typeof data.bioBlock === "string") setBioBlock(data.bioBlock);
      if (typeof data.repertoireBlock === "string")
        setRepertoireBlock(data.repertoireBlock);
      if (typeof data.riderBlock === "string") setRiderBlock(data.riderBlock);
      if (typeof data.photoUrl === "string") setPhotoUrl(data.photoUrl);
      if (typeof data.portraitPhotoUrl === "string")
        setPortraitPhotoUrl(data.portraitPhotoUrl);
      if (typeof data.maxStepUnlocked === "number")
        setMaxStepUnlocked(data.maxStepUnlocked);

      // try to ensure maxStepUnlocked at least reflects "visited" steps
      setTimeout(() => {
        let highest = 0;
        for (let i = 0; i < steps.length; i++) {
          if (isStepComplete(i)) highest = i;
        }
        setMaxStepUnlocked((v) => Math.max(v, highest));
      }, 0);
    } catch (err) {
      alert("Ungültige oder beschädigte JSON-Datei.");
    } finally {
      e.target.value = ""; // reset
    }
  };

  // ====== RENDER STEP CONTENT ======
  const StepVideo = memo(function StepVideo({ src }) {
    return (
      <Card variant="outlined" sx={{ mb: 2 }}>
        <Box sx={{ position: "relative", pt: "56.25%" }}>
          <Box
            component="iframe"
            src={src}
            title="Explainer Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              border: 0,
              borderRadius: 1,
            }}
          />
        </Box>
      </Card>
    );
  });

  const renderStep = (index) => {
    const s = steps[index];
    switch (s.key) {
      case "basic":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <TextField
                label="Name *"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                helperText="Dein Künstler*innen- oder Bandname."
              />
              <TextField
                label="Kontakt *"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                multiline
                rows={5}
                helperText="E-Mail, Telefon, Socials – jeweils in einer neuen Zeile."
              />
              <TextField
                select
                label="Genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                helperText="Wähle dein Hauptgenre (optional)."
              >
                {GENRES.map((g) => (
                  <MenuItem key={g} value={g}>
                    {g}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </Box>
        );
      case "portrait":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Lade ein Hochformat-Portrait hoch (3:4) und schneide es zu.
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="outlined" component="label">
                  Portrait hochladen
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onPortraitFile}
                  />
                </Button>
                {portraitPhotoUrl && (
                  <Chip
                    label="Portrait bereit"
                    color="success"
                    icon={<CheckCircleIcon />}
                  />
                )}
              </Stack>
              {portraitPhotoUrl && (
                <Box sx={{ maxWidth: 320 }}>
                  <img
                    src={portraitPhotoUrl}
                    alt="Portrait-Vorschau"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      onClick={() => setPortraitCropOpen(true)}
                    >
                      Zuschneiden
                    </Button>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        );
      case "tagbio":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <InputWithCounter
                label="Tagline *"
                placeholder="Jazz Cover-Songs für jedes Event"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                maxLength={120}
                helper="Kurz, knackig, maximal ~10 Wörter."
              />
              <TextareaWithCounter
                label="Bio * (max. 1000)"
                value={bioBlock}
                onChange={(e) => setBioBlock(e.target.value)}
                maxLength={1000}
                rows={10}
                helper="Wer bist du, wie klingst du, was passiert aktuell?"
              />
            </Stack>
          </Box>
        );
      case "cta":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <TextField
                label="CTA URL *"
                placeholder="https://…"
                fullWidth
                value={ctaUrl}
                onChange={(e) => setCtaUrl(e.target.value)}
                helperText="Wohin soll der Button führen? Vollständige URL einfügen."
              />
              <TextField
                label="CTA Label *"
                placeholder="Button-Text"
                fullWidth
                value={ctaLabel}
                onChange={(e) => setCtaLabel(e.target.value)}
                helperText="Beschreibe die Aktion, z. B. 'Jetzt ansehen'."
              />
              <TextareaWithCounter
                label="Kurzbeschreibung Titelblatt"
                value={heroText}
                onChange={(e) => setHeroText(e.target.value)}
                maxLength={250}
                rows={6}
                helper="2–3 Sätze, max. 250 Zeichen."
              />
            </Stack>
          </Box>
        );
      case "repertoire":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <TextareaWithCounter
                label="Repertoire *"
                placeholder="Songname 1 (Interpret), Songname 2 (Interpret), …"
                value={repertoireBlock}
                onChange={(e) => setRepertoireBlock(e.target.value)}
                rows={8}
                maxLength={600}
                helper="Liste wichtiger Songs/Setlist, kommagetrennt."
              />
            </Stack>
          </Box>
        );
      case "rider":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <TextareaWithCounter
                label="Tech Rider *"
                value={riderBlock}
                onChange={(e) => setRiderBlock(e.target.value)}
                rows={8}
                maxLength={850}
                helper="Bühne, Strom, Monitoring, Backline, Aufbau/Abbau."
              />
            </Stack>
          </Box>
        );
      case "hero":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Lade ein quadratisches Titelbild (1:1) hoch und schneide es zu.
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <Button variant="outlined" component="label">
                  Hero-Foto hochladen (1:1)
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={onHeroFile}
                  />
                </Button>
                {photoUrl && (
                  <Chip
                    label="Hero-Foto bereit"
                    color="success"
                    icon={<CheckCircleIcon />}
                  />
                )}
              </Stack>
              {photoUrl && (
                <Box sx={{ maxWidth: 320 }}>
                  <img
                    src={photoUrl}
                    alt="Hero-Vorschau"
                    style={{ width: "100%", borderRadius: 8 }}
                  />
                  <Box sx={{ mt: 1 }}>
                    <Button size="small" onClick={() => setCropOpen(true)}>
                      Zuschneiden
                    </Button>
                  </Box>
                </Box>
              )}
            </Stack>
          </Box>
        );
      case "colors":
        return (
          <Box>
            <StepVideo src={videoSrc} />
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1 }}
            >
              Wähle eine Farbpalette und generiere danach das PDF.
            </Typography>
            <Grid container spacing={2}>
              {COLOR_TEMPLATES.map((t) => {
                const active = templateId === t.id;
                return (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={t.id}
                  >
                    <Card
                      variant={active ? "elevation" : "outlined"}
                      sx={{
                        cursor: "pointer",
                        outline: active
                          ? `2px solid ${PURPLE}`
                          : "none",
                        transition: "outline-color 0.15s ease",
                      }}
                      onClick={() => setTemplateId(t.id)}
                    >
                      <CardContent>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 1 }}
                        >
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: 0.75,
                              bgcolor: t.c1,
                            }}
                          />
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: 0.75,
                              bgcolor: t.c2,
                            }}
                          />
                          <Box
                            sx={{
                              width: 18,
                              height: 18,
                              borderRadius: 0.75,
                              bgcolor: t.c3,
                            }}
                          />
                          <Typography
                            variant="body2"
                            sx={{ ml: 1, fontWeight: 500 }}
                          >
                            {t.name}
                          </Typography>
                          {active && (
                            <Chip
                              size="small"
                              color="primary"
                              label="aktiv"
                              sx={{ ml: "auto" }}
                            />
                          )}
                        </Stack>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Primary
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            bgcolor: t.c1,
                            borderRadius: 999,
                            mb: 1,
                          }}
                        />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          Secondary
                        </Typography>
                        <Box
                          sx={{
                            width: "100%",
                            height: 8,
                            bgcolor: t.c2,
                            borderRadius: 999,
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{ mt: 3 }}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={onGenerate}
                disabled={busy}
              >
                {busy ? "Erzeuge…" : "Media Kit generieren"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
              >
                Formular zurücksetzen
              </Button>
            </Stack>
          </Box>
        );
      default:
        return null;
    }
  };

  // ====== JSX ======
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Top stepper with actions on the right */}
        <Stepper
          nonLinear
          activeStep={activeStep}
          sx={{
            mb: 2,
            p: 1,
            borderRadius: "12px",
            bgcolor: "rgba(126,87,194,0.05)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.04)",
            flexWrap: "wrap",
            rowGap: 1,
          }}
        >
          {steps.map((s, idx) => (
            <Step key={s.key} completed={isStepComplete(idx)}>
              <StepButton
                onClick={() => canClickStep(idx) && setActiveStep(idx)}
                disabled={!canClickStep(idx)}
                aria-label={`${idx + 1}. ${s.title}`}
              >
                <StepLabel StepIconComponent={NumberStepIcon} />
              </StepButton>
            </Step>
          ))}

          {/* right side controls */}
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: "auto" }}
          >
            <Tooltip title="Menü">
              <IconButton onClick={openMenu} size="small">
                <MoreVertIcon />
              </IconButton>
            </Tooltip>

            {activeStep < steps.length - 1 ? (
              <Button
                size="medium"
                variant="contained"
                onClick={goNext}
                disabled={!steps[activeStep].validate()}
              >
                Weiter
              </Button>
            ) : (
              <Button
                size="medium"
                variant="contained"
                onClick={onGenerate}
                disabled={busy}
              >
                {busy ? "Erzeuge…" : "Generieren"}
              </Button>
            )}
          </Stack>
        </Stepper>

        {/* Header row: title only (back arrow removed) */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {steps[activeStep].title}
          </Typography>
        </Box>

        {renderStep(activeStep)}
      </Container>

      {/* Overflow menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
        <MenuItem onClick={handleDownloadJson}>
          <ListItemIcon>
            <FileDownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Formular herunterladen (JSON)</ListItemText>
        </MenuItem>
        <MenuItem onClick={triggerUpload}>
          <ListItemIcon>
            <UploadFileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Formular hochladen</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleReset}>
          <ListItemIcon>
            <RestartAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Formular zurücksetzen</ListItemText>
        </MenuItem>
      </Menu>
      <input
        ref={uploadInputRef}
        type="file"
        accept="application/json"
        style={{ display: "none" }}
        onChange={handleUploadFile}
      />

      {/* HERO crop dialog */}
      <Dialog
        open={cropOpen}
        onClose={() => setCropOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Hero-Foto zuschneiden</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 360,
              bgcolor: "#111",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {rawPhotoUrl && (
              <Cropper
                image={rawPhotoUrl}
                crop={crop}
                zoom={zoom}
                aspect={HERO_ASPECT}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(_, cp) => setCroppedPixels(cp)}
                restrictPosition
                showGrid={false}
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCropOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={confirmHeroCrop}>
            Übernehmen
          </Button>
        </DialogActions>
      </Dialog>

      {/* PORTRAIT crop dialog */}
      <Dialog
        open={portraitCropOpen}
        onClose={() => setPortraitCropOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Portrait zuschneiden</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 400,
              bgcolor: "#111",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {rawPortraitPhotoUrl && (
              <Cropper
                image={rawPortraitPhotoUrl}
                crop={portraitCrop}
                zoom={portraitZoom}
                aspect={PORTRAIT_ASPECT}
                onCropChange={setPortraitCrop}
                onZoomChange={setPortraitZoom}
                onCropComplete={(_, cp) => setPortraitCroppedPixels(cp)}
                restrictPosition
                showGrid={false}
              />
            )}
          </Box>
          <Box sx={{ mt: 2 }}>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={portraitZoom}
              onChange={(e) => setPortraitZoom(Number(e.target.value))}
              style={{ width: "100%" }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPortraitCropOpen(false)}>Abbrechen</Button>
          <Button variant="contained" onClick={confirmPortraitCrop}>
            Übernehmen
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
