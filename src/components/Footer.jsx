import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer id="kontakt" className="container">
    <p>
        © <span>{year}</span> ShowKompass ·{" "}
        <Link to="/privacy">Impressum &amp; Datenschutz</Link> · v0.0.13
      </p>
    </footer>
  );
}