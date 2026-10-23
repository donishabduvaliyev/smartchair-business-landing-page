import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Globe } from "lucide-react";
import { cn } from "../lib/utils";

const LANGS = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "uz", label: "UZ" },
] as const;

export function LanguageSwitcher({ className }: { className?: string }) {
  const { i18n, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGS.find((l) => l.code === i18n.language)?.code ?? "en";

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="press-spring flex items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-2 text-xs font-medium text-text-muted transition-colors hover:text-text hover:border-border-soft"
        aria-label="Change language"
      >
        <Globe size={14} />
        {LANGS.find((l) => l.code === current)?.label}
        <ChevronDown size={12} className={cn("transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="card-glass absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-border bg-surface-2/95 p-1 shadow-2xl backdrop-blur-xl"
          >
            {LANGS.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text"
              >
                {t(`lang.${lang.code}`)}
                {current === lang.code && <Check size={14} className="text-accent" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
