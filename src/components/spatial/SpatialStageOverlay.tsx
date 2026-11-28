import { useEffect, useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CITY, TELEGRAM_URL } from "../../lib/constants";
import type { ScrollState } from "../../lib/useScroll";
import { scrollToProgress, type SpatialWorldState } from "../../lib/spatialWorld";
import { DiscoveryAtelier } from "./DiscoveryAtelier";
import { BusinessOperationsSpine } from "./BusinessOperationsSpine";
import { ReceptionConsole } from "./ReceptionConsole";

export function SpatialStageOverlay({
  scroll,
  world,
  onOpenConnect,
}: {
  scroll: React.RefObject<ScrollState>;
  world: React.RefObject<SpatialWorldState>;
  onOpenConnect: () => void;
}) {
  const { t } = useTranslation();

  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const act3Ref = useRef<HTMLDivElement>(null);
  const act4Ref = useRef<HTMLDivElement>(null);
  const act5Ref = useRef<HTMLDivElement>(null);
  const chairTagRef = useRef<HTMLDivElement>(null);
  const mirrorTagRef = useRef<HTMLDivElement>(null);
  const opsTagRef = useRef<HTMLDivElement>(null);
  const receptionTagRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const p = scroll.current?.smooth ?? 0;

      // Act I Threshold overlay visibility (0.00 -> 0.11)
      if (act1Ref.current) {
        const v1 = p < 0.05 ? 1 : Math.max(0, 1 - (p - 0.05) / 0.06);
        act1Ref.current.style.opacity = v1.toFixed(3);
        act1Ref.current.style.pointerEvents = v1 > 0.35 ? "auto" : "none";
        act1Ref.current.style.transform = `translate3d(0, ${(p * -120).toFixed(1)}px, 0)`;
      }

      // Act II Metamorphosis caption visibility (0.14 -> 0.38)
      if (act2Ref.current) {
        const inV = Math.min(1, Math.max(0, (p - 0.14) / 0.045));
        const outV = Math.min(1, Math.max(0, (0.39 - p) / 0.05));
        const v2 = Math.min(inV, outV);
        act2Ref.current.style.opacity = v2.toFixed(3);
        act2Ref.current.style.pointerEvents = v2 > 0.35 ? "auto" : "none";
        act2Ref.current.style.transform = `translate3d(0, ${((1 - v2) * 18).toFixed(1)}px, 0)`;
      }

      // World-projected tether anchored directly to the levitating 3D Hero Chair
      if (chairTagRef.current && world.current) {
        const anchor = world.current.anchors.chair;
        const inV = Math.min(1, Math.max(0, (p - 0.14) / 0.04));
        const outV = Math.min(1, Math.max(0, (0.33 - p) / 0.04));
        const vis = anchor?.visible ? Math.min(inV, outV) : 0;
        chairTagRef.current.style.opacity = vis.toFixed(3);
        if (anchor && vis > 0.02) {
          chairTagRef.current.style.transform = `translate3d(${anchor.x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0)`;
        }
      }

      // Act III Customer Discovery Atelier visibility (0.42 -> 0.62)
      if (act3Ref.current) {
        const inV = Math.min(1, Math.max(0, (p - 0.41) / 0.045));
        const outV = Math.min(1, Math.max(0, (0.63 - p) / 0.05));
        const v3 = Math.min(inV, outV);
        act3Ref.current.style.opacity = v3.toFixed(3);
        act3Ref.current.dataset.interactive = v3 > 0.35 ? "true" : "false";
        act3Ref.current.style.transform = `translate3d(0, ${((1 - v3) * 18).toFixed(1)}px, 0)`;
      }

      // World-projected tether anchored to the illuminated Salon Mirror in Act III
      if (mirrorTagRef.current && world.current) {
        const anchor = world.current.anchors.discovery;
        const inV = Math.min(1, Math.max(0, (p - 0.32) / 0.05));
        const outV = Math.min(1, Math.max(0, (0.54 - p) / 0.05));
        const vis = anchor?.visible ? Math.min(inV, outV) : 0;
        mirrorTagRef.current.style.opacity = vis.toFixed(3);
        if (anchor && vis > 0.02) {
          mirrorTagRef.current.style.transform = `translate3d(${anchor.x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0)`;
        }
      }

      // Act IV Business Operations Spine visibility (0.63 -> 0.85)
      if (act4Ref.current) {
        const inV = Math.min(1, Math.max(0, (p - 0.63) / 0.045));
        const outV = Math.min(1, Math.max(0, (0.86 - p) / 0.05));
        const v4 = Math.min(inV, outV);
        act4Ref.current.style.opacity = v4.toFixed(3);
        act4Ref.current.dataset.interactive = v4 > 0.35 ? "true" : "false";
        act4Ref.current.style.transform = `translate3d(0, ${((1 - v4) * 18).toFixed(1)}px, 0)`;
      }

      // World-projected tether anchored to Operations Zone in Act IV
      if (opsTagRef.current && world.current) {
        const anchor = world.current.anchors.operations;
        const inV = Math.min(1, Math.max(0, (p - 0.58) / 0.05));
        const outV = Math.min(1, Math.max(0, (0.81 - p) / 0.05));
        const vis = anchor?.visible ? Math.min(inV, outV) : 0;
        opsTagRef.current.style.opacity = vis.toFixed(3);
        if (anchor && vis > 0.02) {
          opsTagRef.current.style.transform = `translate3d(${anchor.x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0)`;
        }
      }

      // Act V Illuminated Reception Desk Console visibility (0.84 -> 1.00)
      if (act5Ref.current) {
        const v5 = p > 0.83 ? Math.min(1, Math.max(0, (p - 0.83) / 0.06)) : 0;
        act5Ref.current.style.opacity = v5.toFixed(3);
        act5Ref.current.dataset.interactive = v5 > 0.35 ? "true" : "false";
        act5Ref.current.style.transform = `translate3d(0, ${((1 - v5) * 18).toFixed(1)}px, 0)`;
      }

      // World-projected tether anchored to Reception Desk in Act V
      if (receptionTagRef.current && world.current) {
        const anchor = world.current.anchors.reception;
        const vis = anchor?.visible && p > 0.85 ? Math.min(1, (p - 0.85) / 0.05) : 0;
        receptionTagRef.current.style.opacity = vis.toFixed(3);
        if (anchor && vis > 0.02) {
          receptionTagRef.current.style.transform = `translate3d(${anchor.x.toFixed(1)}px, ${anchor.y.toFixed(1)}px, 0)`;
        }
      }

      if (scrollHintRef.current) {
        scrollHintRef.current.style.opacity = p > 0.03 ? "0" : "1";
      }

      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [scroll, world]);

  return (
    <div className="pointer-events-none fixed inset-0 z-20 overflow-hidden">
      {/* Act I — Threshold Action Anchor (Bottom-Left, leaves 3D room & 3D text open) */}
      <div
        ref={act1Ref}
        className="absolute inset-x-0 bottom-16 mx-auto max-w-[1320px] px-5 sm:bottom-12 lg:px-8"
      >
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/45 px-3 py-1 font-mono text-[11px] tracking-wider text-[#d4af5a] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d4af5a] animate-pulse" />
            <span>{t("hero.badge", { city: CITY })}</span>
          </div>

          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            {t("hero.subtitle")}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenConnect}
              className="btn-primary group inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-medium shadow-[0_0_24px_rgba(255,255,255,0.16)]"
            >
              {t("hero.ctaBusiness")}
              <ArrowRight
                size={16}
                className="transition-transform duration-150 group-hover:translate-x-0.5"
              />
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex h-11 items-center justify-center rounded-[10px] border border-white/15 bg-black/45 px-5 text-sm font-medium backdrop-blur-md hover:border-[#d4af5a]/50"
            >
              {t("hero.ctaCustomer")}
            </a>
          </div>
        </div>
      </div>

      {/* World-Projected Tether Tag on the Levitating Hero Chair */}
      <div
        ref={chairTagRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-full pb-4"
      >
        <div className="flex items-center gap-2 rounded-full border border-[#d4af5a]/45 bg-[#08090c]/75 px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-[#d4af5a] backdrop-blur-md">
          <Sparkles size={11} />
          <span>SmartChair Portal · Metamorphosis</span>
        </div>
        <div className="mx-auto h-8 w-px bg-gradient-to-b from-[#d4af5a]/70 to-transparent" />
      </div>

      {/* Act II — Chair Transformation Narrative Plate */}
      <div
        ref={act2Ref}
        style={{ opacity: 0 }}
        className="absolute inset-x-0 bottom-12 mx-auto max-w-[1320px] px-5 lg:px-8"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div className="max-w-md border-l border-[#d4af5a]/50 pl-4">
            <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#d4af5a]">
              02 · Spatial Metamorphosis
            </p>
            <p className="mt-2 text-sm leading-relaxed text-white/85 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              The physical chair dissolves into one connected system — linking customer Telegram discovery directly to salon schedules and register control.
            </p>
          </div>
          <button
            type="button"
            onClick={() => scrollToProgress(0.42)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-black/45 px-4 py-2 font-mono text-[11px] tracking-wider uppercase text-white/80 backdrop-blur-md transition-colors hover:border-[#d4af5a]/50 hover:text-white"
          >
            <span>Enter Platform World</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* World-Projected Tether Tag on the Grooming Art Plinth (Act III) */}
      <div
        ref={mirrorTagRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-full pb-3 hidden md:block"
      >
        <div className="flex items-center gap-2 rounded-full border border-[#8C6D46]/45 bg-[#FAF6EE]/92 px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-[#6E502B] backdrop-blur-md shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8C6D46]" />
          <span>Atelier Plinth · Specialist &amp; Slots</span>
        </div>
        <div className="mx-auto h-6 w-px bg-gradient-to-b from-[#8C6D46]/70 to-transparent" />
      </div>

      {/* Act III — Customer Discovery Atelier */}
      <div
        ref={act3Ref}
        data-interactive="false"
        style={{ opacity: 0 }}
        className="group pointer-events-none absolute inset-x-0 bottom-4 max-h-[calc(100vh-112px)] overflow-y-auto sm:bottom-10 lg:overflow-visible"
      >
        <DiscoveryAtelier world={world} />
      </div>

      {/* World-Projected Tether Tag in Operations Zone (Act IV) */}
      <div
        ref={opsTagRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-full pb-3 hidden md:block"
      >
        <div className="flex items-center gap-2 rounded-full border border-[#8C6D46]/45 bg-[#FAF6EE]/92 px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-[#6E502B] backdrop-blur-md shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8C6D46]" />
          <span>Vitruvian Horologium · Schedule &amp; Register</span>
        </div>
        <div className="mx-auto h-6 w-px bg-gradient-to-b from-[#8C6D46]/70 to-transparent" />
      </div>

      {/* Act IV — Business Operations Spine */}
      <div
        ref={act4Ref}
        data-interactive="false"
        style={{ opacity: 0 }}
        className="group pointer-events-none absolute inset-x-0 bottom-4 max-h-[calc(100vh-112px)] overflow-y-auto sm:bottom-10 lg:overflow-visible"
      >
        <BusinessOperationsSpine />
      </div>

      {/* World-Projected Tether Tag at Concierge Rostrum (Act V) */}
      <div
        ref={receptionTagRef}
        style={{ opacity: 0 }}
        className="pointer-events-none absolute left-0 top-0 -translate-x-1/2 -translate-y-full pb-3 hidden md:block"
      >
        <div className="flex items-center gap-2 rounded-full border border-[#8C6D46]/45 bg-[#FAF6EE]/92 px-3 py-1 font-mono text-[10px] tracking-widest uppercase text-[#6E502B] backdrop-blur-md shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8C6D46]" />
          <span>Concierge Rostrum · Partner Ledger</span>
        </div>
        <div className="mx-auto h-6 w-px bg-gradient-to-b from-[#8C6D46]/70 to-transparent" />
      </div>

      {/* Act V — Illuminated Reception Desk Enquiry Console */}
      <div
        ref={act5Ref}
        data-interactive="false"
        style={{ opacity: 0 }}
        className="group pointer-events-none absolute inset-x-0 bottom-4 max-h-[calc(100vh-112px)] overflow-y-auto sm:bottom-6 lg:overflow-visible"
      >
        <ReceptionConsole />
      </div>

      {/* Scroll Cue */}
      <div
        ref={scrollHintRef}
        className="pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1.5 font-mono text-[10px] tracking-[0.24em] uppercase text-white/45 transition-opacity duration-500"
      >
        <span>Scroll to enter</span>
        <span className="h-5 w-px bg-gradient-to-b from-[#d4af5a] to-transparent" />
      </div>
    </div>
  );
}
