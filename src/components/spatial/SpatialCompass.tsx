import { useEffect, useRef, useState } from "react";
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
  const [isClassical, setIsClassical] = useState(false);
  const lastDimRef = useRef<"salon" | "classical">("salon");

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const act = world.current?.activeAct ?? 0;
      const dim = world.current?.dimension ?? "salon";
      if (dim !== lastDimRef.current) {
        lastDimRef.current = dim;
        setIsClassical(dim === "classical");
      }
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
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b backdrop-blur-xl transition-colors duration-500 ${
        isClassical
          ? "border-[#8C6D46]/20 bg-[#F6F1E7]/85 text-[#1C1917]"
          : "border-white/[0.06] bg-[#060608]/55 text-white"
      }`}
    >
      <nav className="mx-auto flex h-14 sm:h-16 max-w-[1320px] items-center justify-between gap-1.5 sm:gap-4 px-3 sm:px-5 lg:px-8">
        <Link to="/" aria-label="SmartChair Home" className="shrink-0 scale-90 origin-left sm:scale-100">
          <Logo tone={isClassical ? "light" : "dark"} />
        </Link>

        {/* 5-Act Spatial Compass */}
        <div
          aria-label="Spatial journey sections"
          className={`hidden items-center gap-1 rounded-full border px-2 py-1 xl:flex transition-colors duration-500 ${
            isClassical
              ? "border-[#8C6D46]/20 bg-[#EFE7D8]/75"
              : "border-white/[0.08] bg-black/30"
          }`}
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
              className={`group flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[11px] tracking-wider uppercase transition-all ${
                isClassical
                  ? "text-[#1C1917]/55 hover:text-[#1C1917] data-[active=true]:bg-[#8C6D46]/15 data-[active=true]:text-[#7A5B34]"
                  : "text-white/50 hover:text-white data-[active=true]:bg-[#d4af5a]/15 data-[active=true]:text-[#d4af5a]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60 group-data-[active=true]:opacity-100" />
              <span>{ACT_LABELS[idx][lang]}</span>
            </button>
          ))}
        </div>

        {/* Utility, Side Page Navigation & Direct Actions */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
          <div className="hidden md:flex items-center gap-3 mr-1 font-mono text-[10px] uppercase tracking-wider">
            <Link
              to="/services"
              className={`transition-colors ${
                isClassical ? "text-[#1C1917]/70 hover:text-[#1C1917]" : "text-white/70 hover:text-white"
              }`}
            >
              {lang === "uz" ? "Xizmatlar" : lang === "ru" ? "Услуги" : "Services"}
            </Link>
            <Link
              to="/for-salons"
              className={`transition-colors ${
                isClassical ? "text-[#1C1917]/70 hover:text-[#1C1917]" : "text-white/70 hover:text-white"
              }`}
            >
              {lang === "uz" ? "Biznes" : lang === "ru" ? "Салонам" : "For Salons"}
            </Link>
            <Link
              to="/faq"
              className={`transition-colors ${
                isClassical ? "text-[#1C1917]/70 hover:text-[#1C1917]" : "text-white/70 hover:text-white"
              }`}
            >
              FAQ
            </Link>
          </div>
          <span className="hidden sm:inline-flex">
            <SoundToggle tone={isClassical ? "light" : "dark"} />
          </span>
          <LanguageSwitcher tone={isClassical ? "light" : "dark"} />
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`hidden whitespace-nowrap px-2 py-1.5 text-xs font-medium transition-colors md:inline-block ${
              isClassical ? "text-[#1C1917]/75 hover:text-[#1C1917]" : "text-white/75 hover:text-white"
            }`}
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
            className={`inline-flex h-8 sm:h-9 shrink-0 items-center justify-center whitespace-nowrap rounded-[10px] px-2.5 sm:px-4 text-[11px] font-medium sm:text-sm transition-colors ${
              isClassical
                ? "bg-[#1C1917] text-[#F5EFE6] hover:bg-[#332D29]"
                : "btn-primary"
            }`}
          >
            {t("nav.listBusiness")}
          </button>
        </div>
      </nav>

      {/* Mobile / Tablet Compact 5-Act Wayfinder */}
      <div
        className={`flex items-center justify-between sm:justify-center gap-1 overflow-x-auto border-t px-2.5 py-1.5 xl:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${
          isClassical ? "border-[#8C6D46]/15" : "border-white/[0.05]"
        }`}
      >
        {ACT_SCROLL_TARGETS.map((target, idx) => (
          <button
            key={target.id}
            type="button"
            onClick={() => scrollToProgress(target.p)}
            className={`shrink-0 rounded-full border px-1.5 sm:px-2 py-0.5 font-mono text-[8.5px] sm:text-[9px] tracking-wider uppercase transition-colors ${
              isClassical
                ? "border-[#8C6D46]/25 bg-[#FBF8F2]/80 text-[#1C1917]/70 hover:border-[#8C6D46] hover:text-[#7A5B34]"
                : "border-white/10 bg-black/40 text-white/65 hover:border-[#d4af5a]/50 hover:text-[#d4af5a]"
            }`}
          >
            {ACT_LABELS[idx][lang]}
          </button>
        ))}
      </div>
    </header>
  );
}
