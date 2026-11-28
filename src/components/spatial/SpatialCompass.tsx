import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Logo } from "../Logo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { SoundToggle } from "../SoundToggle";
import { TELEGRAM_URL } from "../../lib/constants";
import {
  ACT_SCROLL_TARGETS,
  scrollToProgress,
  type SpatialWorldState,
} from "../../lib/spatialWorld";

const ACT_LABELS = [
  { uz: "Kirish", ru: "Вход", en: "Threshold" },
  { uz: "Metamorfoz", ru: "Портал", en: "Chair Portal" },
  { uz: "Mijozlar", ru: "Клиенты", en: "Discovery" },
  { uz: "Boshqaruv", ru: "Бизнес", en: "Operations" },
  { uz: "Resepshn", ru: "Заявка", en: "Reception" },
] as const;

export function SpatialCompass({
  world,
  onConnectClick,
}: {
  world: React.RefObject<SpatialWorldState>;
  onConnectClick?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = (["uz", "ru", "en"].includes(i18n.language)
    ? i18n.language
    : "en") as "uz" | "ru" | "en";

  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const act = world.current?.activeAct ?? 0;
      dotRefs.current.forEach((btn, idx) => {
        if (!btn) return;
        const active = idx === act;
        btn.dataset.active = active ? "true" : "false";
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [world]);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/[0.06] bg-[#060608]/55 backdrop-blur-xl">
      <nav className="mx-auto flex h-14 sm:h-16 max-w-[1320px] items-center justify-between gap-2 sm:gap-4 px-3.5 sm:px-5 lg:px-8">
        <Link to="/" aria-label="SmartChair Home" className="shrink-0">
          <Logo />
        </Link>

        {/* 5-Act Spatial Compass */}
        <div
          aria-label="Spatial journey sections"
          className="hidden items-center gap-1 rounded-full border border-white/[0.08] bg-black/30 px-2 py-1 lg:flex"
        >
          {ACT_SCROLL_TARGETS.map((target, idx) => (
            <button
              key={target.id}
              ref={(el) => {
                dotRefs.current[idx] = el;
              }}
              type="button"
              data-active={idx === 0 ? "true" : "false"}
              onClick={() => scrollToProgress(target.p)}
              className="group flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] tracking-wider uppercase text-white/50 transition-all hover:text-white data-[active=true]:bg-[#d4af5a]/15 data-[active=true]:text-[#d4af5a]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 group-data-[active=true]:opacity-100" />
              <span>{ACT_LABELS[idx][lang]}</span>
            </button>
          ))}
        </div>

        {/* Utility & Direct Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          <SoundToggle />
          <LanguageSwitcher />
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden whitespace-nowrap px-2.5 py-1.5 text-xs font-medium text-white/75 transition-colors hover:text-white sm:inline-block"
          >
            {t("nav.customerApp")}
          </a>
          <button
            type="button"
            onClick={() => {
              if (onConnectClick) {
                onConnectClick();
              } else {
                scrollToProgress(0.96);
              }
            }}
            className="btn-primary inline-flex h-8 sm:h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] px-2.5 sm:px-4 text-[11px] font-medium sm:text-sm"
          >
            {t("nav.listBusiness")}
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Compact 5-Act Wayfinder */}
      <div className="flex items-center justify-start sm:justify-center gap-1 overflow-x-auto border-t border-white/[0.05] px-3 py-1.5 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {ACT_SCROLL_TARGETS.map((target, idx) => (
          <button
            key={target.id}
            type="button"
            onClick={() => scrollToProgress(target.p)}
            className="shrink-0 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase text-white/65 transition-colors hover:border-[#d4af5a]/50 hover:text-[#d4af5a]"
          >
            {ACT_LABELS[idx][lang]}
          </button>
        ))}
      </div>
    </header>
  );
}
