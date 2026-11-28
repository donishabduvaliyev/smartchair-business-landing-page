import { Phone, Sparkles } from "lucide-react";
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
import { PartnerFormBody } from "../PartnerApplicationModal";

const CONSOLE_COPY = {
  en: {
    eyebrow: "05 · Illuminated Reception Desk",
    headline: "Bring your salon into one living system.",
    sub: "Leave your salon details at the reception console. Our onboarding team sets up your workspace, specialist shifts, and Telegram booking bot within 24 hours.",
  },
  uz: {
    eyebrow: "05 · Yorug' Resepshn Stoli",
    headline: "Saloningizni yagona jonli tizimga ulang.",
    sub: "Resepshn konsolida ma'lumotlaringizni qoldiring. Jamoamiz 24 soat ichida ish joyingiz, ustalar grafigi va Telegram bron botingizni sozlab beradi.",
  },
  ru: {
    eyebrow: "05 · Стойка ресепшн",
    headline: "Объедините ваш салон в единую живую систему.",
    sub: "Оставьте контакты на стойке ресепшн. Наша команда настроит рабочее пространство, графики мастеров и Telegram-бота за 24 часа.",
  },
} as const;

export function ReceptionConsole() {
  const { t, i18n } = useTranslation();
  const lang = (["uz", "ru", "en"].includes(i18n.language)
    ? i18n.language
    : "en") as "uz" | "ru" | "en";
  const c = CONSOLE_COPY[lang];

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-center lg:px-8">
      {/* Left: Reception Desk Invitation, Direct Contact & Legal Links */}
      <div className="max-w-md rounded-2xl border border-white/10 bg-[#07080c]/75 p-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.65)]">
        <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] uppercase text-[#d4af5a]">
          <Sparkles size={11} />
          <span>{c.eyebrow}</span>
        </p>

        <h3 className="mt-2 font-editorial text-3xl italic text-[#f2efe9] sm:text-4xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
          {c.headline}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {c.sub}
        </p>

        {/* Direct Contact Strip */}
        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
          <a
            href={PHONE_HREF}
            className="inline-flex items-center gap-2 rounded-full border border-[#d4af5a]/40 bg-[#d4af5a]/10 px-3.5 py-1.5 font-mono text-[#d4af5a] transition-colors hover:bg-[#d4af5a]/20"
          >
            <Phone size={12} />
            <span>{PHONE_NUMBER}</span>
          </a>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white/75 transition-colors hover:text-white"
          >
            {TELEGRAM_HANDLE}
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-white/75 transition-colors hover:text-white"
          >
            {INSTAGRAM_HANDLE}
          </a>
        </div>

        {/* Preserved Legal Navigation */}
        <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-wider text-white/45">
          <Link to="/privacy" className="transition-colors hover:text-white/85">
            {t("footer.privacy", "Privacy Policy")}
          </Link>
          <Link to="/terms" className="transition-colors hover:text-white/85">
            {t("footer.terms", "Terms")}
          </Link>
          <Link to="/refund" className="transition-colors hover:text-white/85">
            {t("footer.refund", "Refund")}
          </Link>
          <Link to="/delete-account" className="transition-colors hover:text-white/85">
            {t("footer.deleteAccount", "Delete Account")}
          </Link>
        </div>
      </div>

      {/* Right: Diegetic Illuminated Reception Desk Enquiry Terminal */}
      <div className="relative w-full max-w-[490px] shrink-0 rounded-2xl border border-[#d4af5a]/35 bg-[#090b10]/90 p-4 sm:p-5 backdrop-blur-2xl shadow-[0_28px_90px_rgba(0,0,0,0.9)] max-h-[calc(100vh-112px)] overflow-y-auto">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#d4af5a]/70 to-transparent"
        />
        <PartnerFormBody compact />
      </div>
    </div>
  );
}
