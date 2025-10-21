import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Course from "./pages/Course";
import Privacy from "./pages/Privacy";
import MediaKitGenerator from "./pages/MediaKitGenerator";
import NotFound from "./pages/NotFound";

export default function App() {
  const location = useLocation();

  useEffect(() => {
    // Nur ausführen, wenn PostHog im Fenster verfügbar ist
    if (window.posthog) {
      window.posthog.capture('$pageview', {
        path: location.pathname,
        search: location.search,
        title: document.title,
      });
    }
  }, [location]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mediakit" element={<Home />} />
        <Route path="/mediakit/3Fy9" element={<MediaKitGenerator />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/kurs/:slug" element={<Course />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
