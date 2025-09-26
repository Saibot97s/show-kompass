import { Link } from "react-router-dom";
import SignupForm from "../components/SignupForm";
import LogoLeiste from "../components/LogoLeiste";

export default function NotFound() {
  return (
    <main>

      <section className="hero hero--split" aria-label="Mediakit Generator – Hero">
        <div className="container hero-grid">
          <h1>Diese Seite existiert nicht.</h1>
        </div>
      </section>
    </main>
  );
}
