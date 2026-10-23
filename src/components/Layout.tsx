import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { PartnerApplicationModal } from "./PartnerApplicationModal";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    let attempts = 0;
    const id = hash.slice(1);
    const tryScroll = () => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (attempts < 20) {
        attempts += 1;
        requestAnimationFrame(tryScroll);
      }
    };
    tryScroll();
  }, [pathname, hash]);
  return null;
}

export function Layout() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-bg text-text">
      <ScrollToTop />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <PartnerApplicationModal />
    </div>
  );
}
