import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TELEGRAM_URL } from "../../lib/constants";
import { normalizeLang, STORY_CONTENT } from "../../content/storyContent";
import type { SpatialWorldState } from "../../lib/spatialWorld";

const EXPLORE_LABEL = {
  uz: "Barcha xizmatlar va suratlar",
  ru: "Все услуги и галерея",
  en: "Explore all 8 services",
} as const;

/**
 * Chapter III Whisper — Single compact translucent frosted-glass whisper
 * leaving 80%+ of the Renaissance Braccio Nuovo gallery unobstructed.
 */
export function DiscoveryAtelier({
  world,
}: {
  world: React.RefObject<SpatialWorldState>;
}) {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = STORY_CONTENT[lang].act3;

  const [selectedKey, setSelectedKey] = useState<string>("barber");

  useEffect(() => {
    let id = 0;
    const sync = () => {
      const wKey = world.current?.selectedCategory;
      if (wKey && wKey !== selectedKey) {
        setSelectedKey(wKey);
      }
      id = requestAnimationFrame(sync);
    };
    id = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(id);
  }, [world, selectedKey]);

  const activeCategory =
    c.categories.find((v) => v.key === selectedKey) ?? c.categories[0];

  const handleSelectCategory = (key: string) => {
    setSelectedKey(key);
    if (world.current) {
      world.current.selectedCategory = key;
      world.current.userClickedGaze = true;
    }
  };

  return (
    <section
      aria-labelledby="ch3-heading"
      className="mx-auto flex w-full max-w-[1340px] justify-start px-5 lg:px-10"
    >
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-md rounded-2xl border border-white/55 bg-white/38 p-5 backdrop-blur-xl shadow-[0_12px_36px_rgba(28,25,23,0.08)]">
        <div className="flex items-center gap-2.5 font-mono text-[10px] tracking-[0.22em] uppercase text-[#6E502B]">
          <Compass size={11} />
          <span>{c.eyebrow}</span>
        </div>

        <h2
          id="ch3-heading"
          className="mt-1.5 font-sans text-2xl font-medium tracking-[-0.025em] text-[#1C1917] sm:text-3xl"
        >
          {c.headline}{" "}
          <span className="font-editorial italic font-normal text-[#6E502B]">
            {c.headlineAccent}
          </span>
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-[#2C2621]/85 sm:text-sm">
          {activeCategory.curatorNote}
        </p>

        {/* Compact Category Switcher (turns 3D camera gaze to matching alcove) */}
        <div className="mt-3.5 flex flex-wrap gap-x-3.5 gap-y-1.5 border-t border-[#1C1917]/12 pt-3">
          {c.categories.map((v) => {
            const active = selectedKey === v.key;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => handleSelectCategory(v.key)}
                className={`border-b pb-0.5 font-mono text-[10px] tracking-wider uppercase transition-all ${
                  active
                    ? "border-[#1C1917] font-medium text-[#1C1917]"
                    : "border-transparent text-[#1C1917]/60 hover:text-[#1C1917]"
                }`}
              >
                {t(`categories.${v.key}`)}
              </button>
            );
          })}
        </div>

        {/* Links: Dedicated /services Guide & Telegram App */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#1C1917]/12 pt-3">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase text-[#1C1917] transition-colors hover:text-[#6E502B]"
          >
            <span>{EXPLORE_LABEL[lang]}</span>
            <ArrowRight size={12} />
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-[10px] tracking-wider uppercase text-[#6E502B] hover:text-[#1C1917]"
          >
            <span>{c.cta}</span>
            <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </section>
  );
}
