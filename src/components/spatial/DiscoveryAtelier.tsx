import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarCheck, Compass, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_URL } from "../../lib/constants";
import { normalizeLang, STORY_CONTENT } from "../../content/storyContent";
import type { SpatialWorldState } from "../../lib/spatialWorld";

export function DiscoveryAtelier({
  world,
}: {
  world: React.RefObject<SpatialWorldState>;
}) {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = STORY_CONTENT[lang].act3;

  const [selectedKey, setSelectedKey] = useState<string>("barber");
  const [activeBeat, setActiveBeat] = useState<number>(0);

  // Sync if visitor clicks a 3D Wall Niche directly in WebGL
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
    }
  };

  return (
    <section
      aria-labelledby="ch3-heading"
      className="mx-auto flex w-full max-w-[1340px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-10"
    >
      {/* Left: Storytelling & Category Selector */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-xl bg-[#FAF6EE]/86 p-5 sm:p-6 backdrop-blur-md border-l border-[#8C6D46]/35 shadow-[0_18px_45px_rgba(44,34,20,0.08)]">
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-[#7A5B34]">
          <span className="h-px w-6 bg-[#8C6D46]" />
          <span>{c.eyebrow}</span>
        </div>

        <h2
          id="ch3-heading"
          className="mt-2 font-sans text-3xl font-medium tracking-[-0.03em] text-[#1C1917] sm:text-5xl"
        >
          {c.headline}{" "}
          <span className="font-editorial italic font-normal text-[#7A5B34]">
            {c.headlineAccent}
          </span>
        </h2>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#4B433B]">
          {c.sub}
        </p>

        <div className="mt-5 space-y-2 border-l border-[#8C6D46]/40 pl-4">
          {c.steps.map((stepItem, idx) => {
            const active = activeBeat === idx;
            return (
              <button
                key={stepItem.step}
                type="button"
                onClick={() => setActiveBeat(idx)}
                className={`block w-full text-left transition-opacity ${
                  active ? "opacity-100" : "opacity-55 hover:opacity-90"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-[#7A5B34]">{stepItem.step}</span>
                  <span className="text-sm font-medium text-[#1C1917]">{stepItem.title}</span>
                </div>
                {active && (
                  <p className="mt-0.5 pl-5 text-xs leading-relaxed text-[#4B433B]">
                    {stepItem.desc}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Hairline Vertical Selector */}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#1C1917]/12 pt-3.5">
          {c.categories.map((v) => {
            const active = selectedKey === v.key;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => handleSelectCategory(v.key)}
                className={`border-b pb-0.5 font-mono text-[10px] tracking-wider uppercase transition-all ${
                  active
                    ? "border-[#7A5B34] text-[#7A5B34]"
                    : "border-transparent text-[#1C1917]/55 hover:text-[#1C1917]"
                }`}
              >
                {t(`categories.${v.key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Curator Sculpture Plate & Context-Accurate Category Photo */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto w-full max-w-[360px] shrink-0 border-l border-t border-[#8C6D46]/35 bg-[#FAF6EE]/92 p-3.5 backdrop-blur-md shadow-[0_20px_50px_rgba(44,34,20,0.10)]">
        <div className="relative h-32 w-full overflow-hidden sm:h-44">
          <img
            src={activeCategory.image}
            alt={activeCategory.alt}
            width={640}
            height={400}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/80 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-3 font-mono text-[10px] tracking-widest uppercase text-[#F5EFE6]">
            {t(`categories.${activeCategory.key}`)} · 0 UZS
          </span>
        </div>

        <div className="mt-3 border-b border-[#1C1917]/12 pb-2.5">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
            {activeBeat === 0 && <Compass size={12} />}
            {activeBeat === 1 && <Scissors size={12} />}
            {activeBeat === 2 && <CalendarCheck size={12} />}
            <span>{activeCategory.sculptureTitle}</span>
          </div>
          <p className="mt-1 text-xs leading-relaxed text-[#4B433B]">
            {activeCategory.curatorNote}
          </p>
        </div>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-between font-mono text-[11px] tracking-wider uppercase text-[#1C1917] transition-colors hover:text-[#7A5B34]"
        >
          <span>{c.cta}</span>
          <ArrowUpRight size={14} className="text-[#7A5B34]" />
        </a>
      </div>
    </section>
  );
}
