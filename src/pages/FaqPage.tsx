import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { usePartnerModal } from "../context/PartnerModalContext";
import { normalizeLang, STORY_CONTENT } from "../content/storyContent";
import { PHONE_HREF, PHONE_NUMBER, TELEGRAM_HANDLE, TELEGRAM_URL } from "../lib/constants";

const FAQ_META = {
  uz: {
    seoTitle: "Savol-Javob (FAQ) — SmartChair",
    seoDesc:
      "SmartChair orqali mijozlar navbat olishi, salonlarni ulash tartibi, bepul qidiruv va avtomatik Telegram eslatmalari bo'yicha javoblar.",
    eyebrow: "SmartChair · Yordam markazi",
    h1: "Ko'p beriladigan savollar",
    lead: "Platformamizdan foydalanuvchi mijozlar va salon rahbarlari uchun eng muhim savollarga aniq javoblar.",
    cta: "Saloningizni ulash",
    back: "3D Galereyaga qaytish",
  },
  ru: {
    seoTitle: "Частые вопросы (FAQ) — SmartChair",
    seoDesc:
      "Ответы на вопросы о бесплатной онлайн-записи через Telegram, подключении барбершопа или салона к SmartChair за 24 часа и управлении графиком.",
    eyebrow: "SmartChair · Центр ответов",
    h1: "Частые вопросы",
    lead: "Короткие и честные ответы для гостей, бронирующих визит, и владельцев салонов красоты.",
    cta: "Подключить салон",
    back: "Вернуться в 3D-галерею",
  },
  en: {
    seoTitle: "Frequently Asked Questions — SmartChair",
    seoDesc:
      "Clear answers on booking barbershops and salons for free via Telegram, connecting your business in 24 hours, and managing shifts.",
    eyebrow: "SmartChair · Help & Clarity",
    h1: "Frequently Asked Questions",
    lead: "Direct answers for both guests booking an appointment and salon owners joining the platform.",
    cta: "Connect Your Salon",
    back: "Return to 3D Gallery",
  },
} as const;

export function FaqPage() {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const meta = FAQ_META[lang];
  const faqs = STORY_CONTENT[lang].act5.faqs;
  const { openPartnerModal } = usePartnerModal();

  useSEO({
    title: meta.seoTitle,
    description: meta.seoDesc,
    canonicalPath: "/faq",
  });

  return (
    <div className="mx-auto max-w-[920px] px-6 pt-28 pb-20 lg:px-8">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d4af5a]">
        {meta.eyebrow}
      </p>
      <h1 className="mt-3 font-editorial text-4xl italic tracking-[-0.02em] text-text sm:text-5xl">
        {meta.h1}
      </h1>
      <p className="mt-4 text-base leading-relaxed text-text-secondary">
        {meta.lead}
      </p>

      <div className="mt-10 space-y-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            open
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-text">
              <span>{item.q}</span>
              <ChevronDown
                size={16}
                className="shrink-0 text-[#d4af5a] transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{item.a}</p>
          </details>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
        <button
          type="button"
          onClick={openPartnerModal}
          className="btn-primary inline-flex h-10 items-center gap-2 rounded-[10px] px-5 text-sm font-medium"
        >
          <span>{meta.cta}</span>
          <ArrowRight size={15} />
        </button>
        <a
          href={PHONE_HREF}
          className="inline-flex h-10 items-center gap-2 rounded-[10px] border border-white/15 px-4 font-mono text-xs text-text-secondary hover:text-text"
        >
          <Phone size={14} className="text-[#d4af5a]" />
          <span>{PHONE_NUMBER}</span>
        </a>
        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-xs text-text-secondary hover:text-text"
        >
          {TELEGRAM_HANDLE}
        </a>
        <Link
          to="/"
          className="ml-auto font-mono text-xs uppercase tracking-wider text-text-muted hover:text-text"
        >
          {meta.back}
        </Link>
      </div>
    </div>
  );
}
