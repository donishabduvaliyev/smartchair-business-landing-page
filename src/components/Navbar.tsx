import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  const [open, setOpen] = useState(false);

  const LINKS = [
    { label: t("nav.forBusiness"), href: "/#for-business" },
    { label: t("nav.features"), href: "/#features" },
    { label: t("nav.howItWorks"), href: "/#how-it-works" },
    { label: t("nav.reviews"), href: "/#reviews" },
    { label: t("nav.faq"), href: "/#faq" },
  ];

  const isDark = true;
  const tone = "dark";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md transition-colors duration-200",
        isDark
          ? "border-obsidian-border bg-obsidian/90 text-obsidian-text"
          : "border-grid bg-paper/95 text-ink"
      )}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-4 px-6 lg:px-8">
        <Link to="/" aria-label="SmartChair Home" className="shrink-0">
          <Logo tone={tone} />
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isDark
                  ? "text-obsidian-muted hover:text-obsidian-text"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher tone={tone} />
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "px-2 py-1.5 text-sm font-medium transition-colors",
              isDark
                ? "text-obsidian-muted hover:text-obsidian-text"
                : "text-ink-muted hover:text-ink"
            )}
          >
            {t("nav.customerApp")}
          </a>
          <button
            type="button"
            onClick={openPartnerModal}
            className={cn(
              "press-spring rounded-lg px-5 py-2.5 text-sm font-medium",
              isDark ? "btn-brass" : "btn-obsidian"
            )}
          >
            {t("nav.listBusiness")}
          </button>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher tone={tone} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={cn(
              "press-spring flex h-10 w-10 items-center justify-center rounded-lg border transition-colors",
              isDark
                ? "border-obsidian-border bg-obsidian-surface text-obsidian-text"
                : "border-grid bg-surface text-ink"
            )}
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
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "overflow-hidden border-t lg:hidden",
              isDark
                ? "border-obsidian-border bg-obsidian text-obsidian-text"
                : "border-grid bg-paper text-ink"
            )}
          >
            <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-6 py-4">
              {LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3.5 py-3 text-sm font-medium transition-colors",
                    isDark
                      ? "text-obsidian-muted hover:bg-obsidian-surface hover:text-obsidian-text"
                      : "text-ink-muted hover:bg-paper-subtle hover:text-ink"
                  )}
                >
                  {link.label}
                </a>
              ))}
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3.5 py-3 text-sm font-medium transition-colors",
                  isDark
                    ? "text-obsidian-muted hover:bg-obsidian-surface hover:text-obsidian-text"
                    : "text-ink-muted hover:bg-paper-subtle hover:text-ink"
                )}
              >
                {t("nav.customerApp")}
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  openPartnerModal();
                }}
                className={cn(
                  "press-spring mt-2.5 rounded-lg px-5 py-3 text-center text-sm font-medium",
                  isDark ? "btn-brass" : "btn-obsidian"
                )}
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
