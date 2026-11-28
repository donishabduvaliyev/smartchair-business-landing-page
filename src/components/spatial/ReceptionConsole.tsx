import { ChevronDown, Phone, Sparkles } from "lucide-react";
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
import { PartnerFormBody } from "../PartnerApplicationModal";

export function ReceptionConsole() {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = STORY_CONTENT[lang].act5;

  return (
    <section
      aria-labelledby="ch5-heading"
      className="mx-auto flex w-full max-w-[1320px] flex-col justify-between gap-6 px-5 lg:flex-row lg:items-end lg:px-8"
    >
      {/* Left: Atelier Registry Story, Direct Contact, FAQ Drawer & Legal Links */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-md border-l border-t border-[#8C6D46]/35 bg-[#FAF6EE]/90 p-5 sm:p-6 backdrop-blur-md shadow-[0_20px_50px_rgba(44,34,20,0.08)]">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#7A5B34]">
          <Sparkles size={11} />
          <span>{c.eyebrow}</span>
        </p>

        <h2
          id="ch5-heading"
          className="mt-2 font-editorial text-3xl italic text-[#1C1917] sm:text-4xl"
        >
          {c.headline}
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-[#4B433B]">
          {c.sub}
        </p>

        {/* Direct Contact Strip */}
        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-full border border-[#8C6D46]/40 bg-[#8C6D46]/10 px-3.5 py-1.5 font-mono text-[#6E502B] transition-colors hover:bg-[#8C6D46]/20"
          >
            <Phone size={12} />
            <span>{PHONE_NUMBER}</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#4B433B] transition-colors hover:text-[#1C1917]"
          >
            {TELEGRAM_HANDLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[#4B433B] transition-colors hover:text-[#1C1917]"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        {/* Truthful Crawlable Vellum FAQ Accordion matching JSON-LD FAQPage */}
        <div className="mt-4 border-t border-[#1C1917]/12 pt-3">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#7A5B34]">
            {c.faqTitle}
          </p>
          <div className="space-y-1.5 max-h-[168px] overflow-y-auto pr-1">
            {c.faqs.map((item) => (
              <details
                key={item.q}
                className="group/faq border-b border-[#1C1917]/10 pb-1.5 text-xs"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-2 font-medium text-[#1C1917] hover:text-[#7A5B34]">
                  <span>{item.q}</span>
                  <ChevronDown
                    size={13}
                    className="shrink-0 text-[#7A5B34] transition-transform group-open/faq:rotate-180"
                  />
                </summary>
                <p className="mt-1 leading-relaxed text-[#4B433B]">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Preserved Legal Navigation */}
        <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#1C1917]/12 pt-3 font-mono text-[10px] uppercase tracking-wider text-[#5C5349]">
          <Link to="/privacy" className="transition-colors hover:text-[#1C1917]">
            {t("footer.privacy", "Privacy Policy")}
          </Link>
          <Link to="/terms" className="transition-colors hover:text-[#1C1917]">
            {t("footer.terms", "Terms")}
          </Link>
          <Link to="/refund" className="transition-colors hover:text-[#1C1917]">
            {t("footer.refund", "Refund")}
          </Link>
          <Link to="/delete-account" className="transition-colors hover:text-[#1C1917]">
            {t("footer.deleteAccount", "Delete Account")}
          </Link>
        </div>
      </div>

      {/* Right: Vellum & Bronze Architectural Partnership Ledger */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto relative w-full max-w-[490px] shrink-0 border-l border-t border-[#8C6D46]/45 bg-[#FAF6EE]/94 p-5 sm:p-6 backdrop-blur-md shadow-[0_24px_60px_rgba(44,34,20,0.12)] max-h-[calc(100vh-112px)] overflow-y-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[#8C6D46]/80 via-[#8C6D46]/30 to-transparent"
        />
        <PartnerFormBody compact variant="architectural" />
      </div>
    </section>
  );
}
