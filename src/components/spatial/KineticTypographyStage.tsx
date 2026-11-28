import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ScrollState } from "../../lib/useScroll";

const TYPE_COPY = {
  en: {
    act1Top: "EVERY",
    act1Accent: "chair",
    act1Bottom: "IN SYNC.",
    partLeft: "Physical",
    partLeftSub: "CRAFT",
    partRight: "living",
    partRightSub: "PLATFORM.",
  },
  uz: {
    act1Top: "HAR BIR",
    act1Accent: "kreslo",
    act1Bottom: "ALOQADA.",
    partLeft: "Jismoniy",
    partLeftSub: "HUNAR",
    partRight: "yagona",
    partRightSub: "TIZIMGA.",
  },
  ru: {
    act1Top: "КАЖДОЕ",
    act1Accent: "кресло",
    act1Bottom: "В РИТМЕ.",
    partLeft: "Живое",
    partLeftSub: "РЕМЕСЛО",
    partRight: "единый",
    partRightSub: "МИР.",
  },
} as const;

export function KineticTypographyStage({
  scroll,
}: {
  scroll: React.RefObject<ScrollState>;
}) {
  const { i18n } = useTranslation();
  const lang = (["uz", "ru", "en"].includes(i18n.language)
    ? i18n.language
    : "en") as "uz" | "ru" | "en";
  const c = TYPE_COPY[lang];

  const act1Group = useRef<HTMLDivElement>(null);
  const act1Back = useRef<HTMLDivElement>(null);
  const act1Front = useRef<HTMLDivElement>(null);

  const partGroup = useRef<HTMLDivElement>(null);
  const partLeftRef = useRef<HTMLDivElement>(null);
  const partRightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const p = scroll.current?.smooth ?? 0;

      // Act I Monumental Asymmetric Display (0.00 -> 0.13)
      if (act1Group.current && act1Back.current && act1Front.current) {
        const vis = p < 0.05 ? 1 : Math.max(0, 1 - (p - 0.05) / 0.075);
        act1Group.current.style.opacity = vis.toFixed(3);
        // Multi-depth parallax split as camera advances
        const shift = p * 950;
        act1Back.current.style.transform = `translate3d(${(-shift * 0.25).toFixed(1)}px, ${(-shift * 0.12).toFixed(1)}px, 0)`;
        act1Front.current.style.transform = `translate3d(${(shift * 0.18).toFixed(1)}px, ${(-shift * 0.35).toFixed(1)}px, 0)`;
      }

      // Act II Parting Portal Headline (0.14 -> 0.39): words physically split open around the disintegrating chair
      if (partGroup.current && partLeftRef.current && partRightRef.current) {
        const inV = Math.min(1, Math.max(0, (p - 0.13) / 0.05));
        const outV = Math.min(1, Math.max(0, (0.40 - p) / 0.06));
        const vis = Math.min(inV, outV);
        partGroup.current.style.opacity = vis.toFixed(3);

        const partT = Math.min(1, Math.max(0, (p - 0.22) / 0.16));
        const eased = partT * partT * (3 - 2 * partT);
        const spreadVw = eased * 32;
        const scale = 1 + eased * 0.28;
        partLeftRef.current.style.transform = `translate3d(${(-spreadVw).toFixed(2)}vw, 0, 0) scale(${scale.toFixed(3)})`;
        partRightRef.current.style.transform = `translate3d(${spreadVw.toFixed(2)}vw, 0, 0) scale(${scale.toFixed(3)})`;
      }

      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [scroll]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-10 overflow-hidden select-none"
    >
      {/* Act I — Oversized Multi-Depth Threshold Display */}
      <div
        ref={act1Group}
        className="mx-auto flex h-full max-w-[1360px] flex-col justify-center px-6 pb-20 lg:px-10"
      >
        <div ref={act1Back} className="will-change-transform">
          <div className="font-sans text-[clamp(48px,8.2vw,126px)] font-medium leading-[0.88] tracking-[-0.04em] text-[#f2efe9]/90 drop-shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
            {c.act1Top}
          </div>
        </div>
        <div
          ref={act1Front}
          className="mt-1 flex flex-wrap items-baseline gap-x-5 pl-[8vw] will-change-transform"
        >
          <span className="font-editorial text-[clamp(62px,10.2vw,154px)] italic font-normal leading-[0.82] text-[#d4af5a] drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
            {c.act1Accent}
          </span>
          <span className="font-sans text-[clamp(42px,6.8vw,106px)] font-medium leading-[0.9] tracking-[-0.035em] text-white/95 drop-shadow-[0_12px_40px_rgba(0,0,0,0.75)]">
            {c.act1Bottom}
          </span>
        </div>
      </div>

      {/* Act II — Parting Portal Typography (splits left & right as camera flies through) */}
      <div
        ref={partGroup}
        style={{ opacity: 0 }}
        className="absolute inset-0 mx-auto flex max-w-[1400px] items-center justify-between px-6 lg:px-12"
      >
        <div ref={partLeftRef} className="will-change-transform text-left">
          <div className="font-editorial text-[clamp(44px,6.6vw,104px)] italic leading-[0.9] text-[#d4af5a] drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            {c.partLeft}
          </div>
          <div className="font-sans text-[clamp(38px,5.6vw,88px)] font-medium tracking-[-0.03em] text-white/90 drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            {c.partLeftSub}
          </div>
        </div>

        <div ref={partRightRef} className="will-change-transform text-right">
          <div className="font-editorial text-[clamp(44px,6.6vw,104px)] italic leading-[0.9] text-[#d4af5a] drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            {c.partRight}
          </div>
          <div className="font-sans text-[clamp(38px,5.6vw,88px)] font-medium tracking-[-0.03em] text-white/90 drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)]">
            {c.partRightSub}
          </div>
        </div>
      </div>
    </div>
  );
}
