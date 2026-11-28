import { useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  QrCode,
  Receipt,
  Users2,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { usePartnerModal } from "../context/PartnerModalContext";
import { normalizeLang, STORY_CONTENT } from "../content/storyContent";

const SALON_PAGE_COPY = {
  uz: {
    seoTitle: "Biznes va Salonlar Uchun — SmartChair Salon OS",
    seoDesc:
      "Telegram bronlar, Walk-In QR navbat, Naqd/Payme/Click kassa Z-hisobotlari va mijozlar CRM bazasi — O'zbekiston salonlari uchun yagona tizim.",
    eyebrow: "SmartChair Business · Salon OS",
    h1: "Kreslodagi mahoratni aniq boshqaruv va kassa hisobi bilan birlashtiring",
    lead: "SmartChair administrator, ustalar va kassirning kundalik ishini bitta tizimga jamlaydi — onlayn bronlar, ko'chadan kirgan jonli navbat, smena Z-hisoboti va Telegram eslatmalar.",
    cta: "Saloningizni ulash",
    backTo3D: "3D Galereyaga qaytish",
  },
  ru: {
    seoTitle: "Для бизнеса и салонов — SmartChair Salon OS",
    seoDesc:
      "Заявки из Telegram, живая Walk-In QR-очередь, касса (Наличные, Payme, Click) с Z-отчётами и база гостей для барбершопов и салонов Узбекистана.",
    eyebrow: "SmartChair Business · Salon OS",
    h1: "Единая система для расписания мастеров, живой очереди и кассы салона",
    lead: "SmartChair объединяет работу администратора, барберов и кассира: онлайн-бронирования из Telegram, Walk-In QR-талоны, расчёт по сменам и автоматические напоминания.",
    cta: "Подключить салон",
    backTo3D: "Вернуться в 3D-галерею",
  },
  en: {
    seoTitle: "For Salons & Business Owners — SmartChair Salon OS",
    seoDesc:
      "Manage Telegram booking requests, Walk-In QR waitlists, Cash/Payme/Click Z-reports, staff shifts, and client reminders in one unified platform.",
    eyebrow: "SmartChair Business · Salon OS",
    h1: "One calm operating system for salon schedules, walk-in queues, and checkout",
    lead: "SmartChair connects your reception desk, specialist shifts, and checkout register — uniting online Telegram requests, Walk-In QR turn tracking, and automated pre-visit reminders.",
    cta: "Connect Your Salon",
    backTo3D: "Return to 3D Gallery",
  },
} as const;

export function ForSalonsPage() {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const copy = SALON_PAGE_COPY[lang];
  const act4 = STORY_CONTENT[lang].act4;
  const { openPartnerModal } = usePartnerModal();
  const [requestState, setRequestState] = useState<"pending" | "accepted" | "declined">("pending");

  useSEO({
    title: copy.seoTitle,
    description: copy.seoDesc,
    canonicalPath: "/for-salons",
  });

  return (
    <div className="mx-auto max-w-[1160px] px-6 pt-28 pb-20 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d4af5a]">
          {copy.eyebrow}
        </p>
        <h1 className="mt-3 font-editorial text-4xl italic tracking-[-0.02em] text-text sm:text-5xl">
          {copy.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {copy.lead}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openPartnerModal}
            className="btn-primary inline-flex h-11 items-center gap-2 rounded-[10px] px-5 text-sm font-medium"
          >
            <span>{copy.cta}</span>
            <ArrowRight size={15} />
          </button>
          <Link
            to="/"
            className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-text-muted transition-colors hover:text-text"
          >
            {copy.backTo3D}
          </Link>
        </div>
      </div>

      {/* 4 Purposeful Salon OS Modules */}
      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {act4.modules.map((mod) => (
          <article
            key={mod.key}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
          >
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-wider text-[#d4af5a]">
              <span>
                {mod.num} · {mod.monument}
              </span>
              {mod.key === "requests" && <CalendarClock size={16} />}
              {mod.key === "queue" && <QrCode size={16} />}
              {mod.key === "register" && <Receipt size={16} />}
              {mod.key === "crm" && <Users2 size={16} />}
            </div>
            <h2 className="mt-3 text-xl font-medium text-text">{mod.title}</h2>
            <p className="mt-1 text-xs italic text-[#d4af5a]/85">{mod.curatorNote}</p>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{mod.desc}</p>

            {/* Interactive Module Previews */}
            {mod.key === "requests" && (
              <div className="mt-5 rounded-xl border border-white/10 bg-black/35 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#d4af5a]">{act4.demo.requestsTitle}</span>
                  <span className="font-mono text-text-muted">{requestState.toUpperCase()}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm font-medium text-text">
                  <span>{act4.demo.requestItem}</span>
                  <span className="text-xs text-text-muted">{act4.demo.requestMeta}</span>
                </div>
                {requestState === "pending" ? (
                  <div className="mt-3 grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setRequestState("accepted")}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#d4af5a] bg-[#d4af5a]/15 font-mono text-xs text-[#d4af5a]"
                    >
                      <Check size={13} />
                      <span>{act4.demo.accept}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRequestState("declined")}
                      className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/15 font-mono text-xs text-text-secondary"
                    >
                      <X size={13} />
                      <span>{act4.demo.decline}</span>
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between text-xs text-[#d4af5a]">
                    <span>
                      {requestState === "accepted" ? act4.demo.accepted : act4.demo.declined}
                    </span>
                    <button
                      type="button"
                      onClick={() => setRequestState("pending")}
                      className="underline"
                    >
                      {act4.demo.reset}
                    </button>
                  </div>
                )}
              </div>
            )}

            {mod.key === "queue" && (
              <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-black/35 p-4 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>{act4.demo.queueOnlineLabel}</span>
                  <span className="font-mono text-emerald-400">{act4.demo.queueOnlineBadge}</span>
                </div>
                <div className="flex justify-between">
                  <span>{act4.demo.queueWalkInLabel}</span>
                  <span className="font-mono text-[#d4af5a]">{act4.demo.queueWalkInBadge}</span>
                </div>
              </div>
            )}

            {mod.key === "register" && (
              <div className="mt-5 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-black/35 p-4 font-mono text-xs text-text">
                {act4.demo.registerMethods.map((m) => (
                  <div key={m} className="rounded-lg border border-white/10 px-3 py-2 text-center">
                    {m}
                  </div>
                ))}
              </div>
            )}

            {mod.key === "crm" && (
              <div className="mt-5 space-y-2 rounded-xl border border-white/10 bg-black/35 p-4 text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span>{act4.demo.crmReminderLabel}</span>
                  <span className="font-mono text-[#d4af5a]">{act4.demo.crmReminderBadge}</span>
                </div>
                <div className="flex justify-between">
                  <span>{act4.demo.crmNotesLabel}</span>
                  <span className="font-mono text-emerald-400">{act4.demo.crmNotesBadge}</span>
                </div>
              </div>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
