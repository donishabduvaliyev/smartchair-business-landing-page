import { useEffect, useState } from "react";
import { ArrowRight, CalendarClock, Receipt } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { normalizeLang, STORY_CONTENT, type OpsModuleKey } from "../../content/storyContent";
import { scrollToProgress, type SpatialWorldState } from "../../lib/spatialWorld";

const FULL_DEMO_LABEL = {
  uz: "To'liq Salon OS imkoniyatlari",
  ru: "Все функции Salon OS",
  en: "Explore Full Salon OS",
} as const;

/**
 * Chapter IV Whisper — Single compact frosted-glass card leaving the
 * Pantheon Floor Clock, Barber Chair, Pocket Watch & Cash Register unobstructed.
 */
export function BusinessOperationsSpine({
  world,
}: {
  world: React.RefObject<SpatialWorldState>;
}) {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = STORY_CONTENT[lang].act4;

  const [activeKey, setActiveKey] = useState<OpsModuleKey>("requests");

  useEffect(() => {
    let id = 0;
    const sync = () => {
      const wMod = world.current?.selectedOpsModule;
      if (wMod && wMod !== activeKey) {
        setActiveKey(wMod);
      }
      id = requestAnimationFrame(sync);
    };
    id = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(id);
  }, [world, activeKey]);

  const handleSelectModule = (key: OpsModuleKey) => {
    setActiveKey(key);
    if (world.current) {
      world.current.selectedOpsModule = key;
      world.current.userClickedGaze = true;
    }
  };

  const heroModules = c.modules.filter((m) => m.key === "requests" || m.key === "register");
  const activeMod = c.modules.find((m) => m.key === activeKey) ?? heroModules[0];

  return (
    <section
      aria-labelledby="ch4-heading"
      className="mx-auto flex w-full max-w-[1340px] justify-start px-5 lg:px-10"
    >
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-md rounded-2xl border border-white/55 bg-white/38 p-5 backdrop-blur-xl shadow-[0_12px_36px_rgba(28,25,23,0.08)]">
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-[#6E502B]">
          <span className="h-px w-5 bg-[#8C6D46]" />
          <span>{c.eyebrow}</span>
        </div>

        <h2
          id="ch4-heading"
          className="mt-1.5 font-sans text-2xl font-medium tracking-[-0.025em] text-[#1C1917] sm:text-3xl"
        >
          {c.headline}{" "}
          <span className="font-editorial italic font-normal text-[#6E502B]">
            {c.headlineAccent}
          </span>
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-[#2C2621]/85 sm:text-sm">
          {activeMod.desc}
        </p>

        {/* Two Monument Gaze Switchers: Pocket Watch & Cash Register */}
        <div className="mt-3.5 grid grid-cols-2 gap-2.5 border-t border-[#1C1917]/12 pt-3">
          {heroModules.map((mod) => {
            const active = activeKey === mod.key;
            return (
              <button
                key={mod.key}
                type="button"
                onClick={() => handleSelectModule(mod.key)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-left transition-all ${
                  active
                    ? "border-[#8C6D46]/55 bg-white/55 text-[#1C1917]"
                    : "border-white/35 bg-white/20 text-[#1C1917]/70 hover:bg-white/40"
                }`}
              >
                {mod.key === "requests" ? (
                  <CalendarClock size={14} className="shrink-0 text-[#6E502B]" />
                ) : (
                  <Receipt size={14} className="shrink-0 text-[#6E502B]" />
                )}
                <span className="font-mono text-[10px] uppercase tracking-wider truncate">
                  {mod.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1C1917]/12 pt-3">
          <Link
            to="/for-salons"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#1C1917] transition-colors hover:text-[#6E502B]"
          >
            <span>{FULL_DEMO_LABEL[lang]}</span>
            <ArrowRight size={12} />
          </Link>
          <button
            type="button"
            onClick={() => scrollToProgress(0.97)}
            className="font-mono text-[10px] tracking-wider uppercase text-[#6E502B] hover:text-[#1C1917]"
          >
            {c.cta}
          </button>
        </div>
      </div>
    </section>
  );
}
