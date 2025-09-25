import React from "react";

/**
* Sehr einfache Logoleiste mit ONLINE-SVG-Links.
* CSS liegt global (siehe CSS-Snippet unten, in deine globale Datei kopieren).
*/
export default function LogoLeiste() {
const logos = [
{ name: "DER STANDARD", src: "https://commons.wikimedia.org/wiki/Special:FilePath/DER%20STANDARD%20LOGO%20schwarz.svg" },
{ name: "Morawa", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Morawa%20Logo.svg" },
{ name: "PULS 4", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Puls%204%20Logo.svg" },
{ name: "SWR2", src: "https://commons.wikimedia.org/wiki/Special:FilePath/SWR2%20Logo.svg" },
{ name: "Radio Arabella", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Radio%20Arabella%20Logo%20(2022).svg" },
{ name: "ORF", src: "https://commons.wikimedia.org/wiki/Special:FilePath/ORF%20logo.svg" },
{ name: "Thalia", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Thalia%20Logo%2010.2019.svg" },
{ name: "KURIER", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Kurier%20Logo.svg" },
{ name: "Die Presse", src: "https://commons.wikimedia.org/wiki/Special:FilePath/Die%20Presse%20logo.svg" },
{ name: "ZDF", src: "https://commons.wikimedia.org/wiki/Special:FilePath/ZDF%20logo.svg" },
];

/**
 * { name: "IMDb", src: "https://commons.wikimedia.org/wiki/Special:FilePath/IMDB%20Logo%202016.svg" },

 * 
 */

return (
<section className="logos section" aria-label="Partner & Presse">
<div className="logos-strip" role="img" aria-label="Logoleiste">
{logos.map((l) => (
<img key={l.name} className="logo" src={l.src} alt={l.name} loading="lazy" />
))}
</div>
</section>
);
}
