import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { usePartnerModal } from "../context/PartnerModalContext";
import { cn } from "../lib/utils";
import { TELEGRAM_URL } from "../lib/constants";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { SoundToggle } from "./SoundToggle";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();
  const lang = i18n.language?.slice(0, 2);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const LINKS = [
    { label: lang === "uz" ? "3D Bosh sahifa" : lang === "ru" ? "3D Главная" : "3D Gallery", to: "/" },
    { label: lang === "uz" ? "Xizmatlar" : lang === "ru" ? "Услуги" : "Services", to: "/services" },
    { label: t("nav.forBusiness"), to: "/for-salons" },
    { label: t("nav.faq"), to: "/faq" },
  ];

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-150",
        scrolled || open
          ? "bg-[#060608]/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-[1160px] items-center justify-between gap-4 px-6 lg:px-8">
        <Link to="/" aria-label="SmartChair Home" className="shrink-0 whitespace-nowrap">
          <Logo />
        </Link>

        <div className="hidden items-center gap-4 xl:gap-6 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="whitespace-nowrap text-sm font-normal text-text-secondary transition-colors hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <SoundToggle />
          <LanguageSwitcher />
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-2 py-1.5 text-sm font-normal text-text-secondary transition-colors hover:text-text"
          >
            {t("nav.customerApp")}
          </a>
          <button
            type="button"
            onClick={openPartnerModal}
            className="btn-primary inline-flex h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] px-4 text-sm font-medium"
          >
            {t("nav.listBusiness")}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <SoundToggle />
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="press-spring flex h-10 w-10 items-center justify-center rounded-[10px] border border-hairline bg-surface-1 text-text transition-colors hover:bg-surface-2"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reducedMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden border-t border-white/[0.06] bg-[#060608]/95 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-[1160px] flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-sm font-normal text-text-secondary transition-colors hover:bg-surface-1 hover:text-text"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="whitespace-nowrap rounded-[10px] px-3.5 py-2.5 text-sm font-normal text-text-secondary transition-colors hover:bg-surface-1 hover:text-text"
              >
                {t("nav.customerApp")}
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPartnerModal();
                }}
                className="btn-primary mt-2.5 inline-flex h-10 items-center justify-center whitespace-nowrap rounded-[10px] px-4 text-sm font-medium"
              >
                {t("nav.listBusiness")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
