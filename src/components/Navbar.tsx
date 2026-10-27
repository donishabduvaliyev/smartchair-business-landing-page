import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { usePartnerModal } from "../context/PartnerModalContext";
import { cn } from "../lib/utils";
import { TELEGRAM_URL } from "../lib/constants";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Navbar() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const LINKS = [
    { label: t("nav.forBusiness"), href: "/#for-business" },
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.howItWorks"), href: "/#how-it-works" },
    { label: t("nav.reviews"), href: "/#reviews" },
    { label: t("nav.faq"), href: "/#faq" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled ? "bg-bg/80 backdrop-blur-xl border-b border-border" : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" aria-label="SmartChair Home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-7 xl:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <LanguageSwitcher />
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            {t("nav.customerApp")}
          </a>
          <button
            type="button"
            onClick={openPartnerModal}
            className="btn-gold press-spring rounded-full px-5 py-2.5 text-sm font-semibold"
          >
            {t("nav.listBusiness")}
          </button>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher />
          <button
            onClick={() => setOpen((v) => !v)}
            className="press-spring flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface/60 text-text"
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-bg/95 backdrop-blur-xl xl:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3.5 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="rounded-xl px-3.5 py-3 text-sm font-medium text-text-muted transition-colors hover:bg-surface hover:text-text"
              >
                {t("nav.customerApp")}
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPartnerModal();
                }}
                className="btn-gold press-spring mt-2.5 rounded-full px-5 py-3 text-center text-sm font-semibold"
              >
                {t("nav.listBusiness")}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
