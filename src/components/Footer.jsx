import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="kontakt" className="container">
      <p>
        © <span>{year}</span> ShowKompass ·{" "}
        <a href="/privacy">Impressum & Datenschutz</a>;
        · v0.0.9
      </p>
    </footer>
  );
}