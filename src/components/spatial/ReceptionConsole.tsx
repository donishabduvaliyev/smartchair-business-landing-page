import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
  TELEGRAM_HANDLE,
  TELEGRAM_URL,
} from "../../lib/constants";
import { normalizeLang, STORY_CONTENT } from "../../content/storyContent";
import { usePartnerModal } from "../../context/PartnerModalContext";

const PAGE_LINKS_LABEL = {
  uz: { services: "Xizmatlar", salons: "Biznes uchun", faq: "Savol-javob" },
  ru: { services: "Услуги", salons: "Для салонов", faq: "FAQ" },
  en: { services: "Services", salons: "For Salons", faq: "FAQ" },
} as const;

/**
 * Chapter V Whisper — Single compact translucent frosted-glass concierge card
 * leaving the Semicircular Marble Apse, Classical Busts & Console unobstructed.
 */
export function ReceptionConsole({
  onOpenConnect,
}: {
  onOpenConnect?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = STORY_CONTENT[lang].act5;
  const navLbl = PAGE_LINKS_LABEL[lang];
  const { openPartnerModal } = usePartnerModal();
  const handleConnect = onOpenConnect ?? openPartnerModal;

  return (
    <section
      aria-labelledby="ch5-heading"
      className="mx-auto flex w-full max-w-[1340px] justify-start px-5 lg:px-10"
    >
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-md rounded-2xl border border-white/55 bg-white/38 p-5 backdrop-blur-xl shadow-[0_12px_36px_rgba(28,25,23,0.08)]">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#6E502B]">
          <Sparkles size={11} />
          <span>{c.eyebrow}</span>
        </p>

        <h2
          id="ch5-heading"
          className="mt-1.5 font-editorial text-2xl italic text-[#1C1917] sm:text-3xl"
        >
          {c.headline}
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-[#2C2621]/85 sm:text-sm">
          {c.sub}
        </p>

        {/* Primary CTA & Direct Call Pill */}
        <div className="mt-4 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleConnect}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#1C1917] px-4 text-xs sm:text-sm font-medium text-[#F5EFE6] transition-colors hover:bg-[#332D29]"
          >
            <span>{t("hero.ctaBusiness")}</span>
            <ArrowRight size={14} />
          </button>
          <a
            href={PHONE_HREF}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#8C6D46]/45 bg-white/45 px-3 font-mono text-xs text-[#6E502B] transition-colors hover:bg-white/70"
          >
            <Phone size={12} />
            <span>{PHONE_NUMBER}</span>
          </a>
        </div>

        {/* Social Handles Strip */}
        <div className="mt-2.5 flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#2C2621]/80">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#1C1917]"
          >
            {TELEGRAM_HANDLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#1C1917]"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        {/* Dedicated Editorial & Legal Pages */}
        <div className="mt-3.5 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t border-[#1C1917]/12 pt-3 font-mono text-[10px] uppercase tracking-wider text-[#4B433B]">
          <Link to="/services" className="inline-flex items-center gap-1 font-medium text-[#1C1917] hover:text-[#6E502B]">
            <span>{navLbl.services}</span>
            <ArrowRight size={10} />
          </Link>
          <Link to="/for-salons" className="inline-flex items-center gap-1 font-medium text-[#1C1917] hover:text-[#6E502B]">
            <span>{navLbl.salons}</span>
            <ArrowRight size={10} />
          </Link>
          <Link to="/faq" className="inline-flex items-center gap-1 font-medium text-[#1C1917] hover:text-[#6E502B]">
            <span>{navLbl.faq}</span>
            <ArrowRight size={10} />
          </Link>
          <Link to="/privacy" className="hover:text-[#1C1917]">
            {t("footer.privacy", "Privacy")}
          </Link>
          <Link to="/terms" className="hover:text-[#1C1917]">
            {t("footer.terms", "Terms")}
          </Link>
        </div>
      </div>
    </section>
  );
}
