import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { MirrorPortal } from "./MirrorPortal";
import { MirrorMobile } from "./MirrorMobile";
import { useTranslation } from "react-i18next";
import { Sparkles, Clock, CheckCircle2, User } from "lucide-react";
import { SoundController } from "../audio/SoundController";

interface MirrorCanvasProps {
  scrollProgress?: number;
}

interface InteractiveSlot {
  id: string;
  time: string;
  title: string;
  master: string;
  price: string;
  status: "active" | "vip" | "telegram" | "open";
  positionClass: string;
  accentColor: string;
}

const OVERLAY_SLOTS: InteractiveSlot[] = [
  {
    id: "slot-1",
    time: "14:30",
    title: "Fade & Soqol Gradiyenti",
    master: "Sardor K.",
    price: "180 000 UZS",
    status: "active",
    positionClass: "top-[23%] left-[6%] w-[45%]",
    accentColor: "border-emerald-500/60 text-emerald-400 bg-emerald-500/10",
  },
  {
    id: "slot-2",
    time: "15:15",
    title: "Premium Royal Shave",
    master: "Alisher T.",
    price: "240 000 UZS",
    status: "vip",
    positionClass: "top-[38%] right-[6%] w-[45%]",
    accentColor: "border-champagne/70 text-champagne bg-champagne/10",
  },
  {
    id: "slot-3",
    time: "16:00",
    title: "Soch Turmagi & Bosh Spa",
    master: "Olim V.",
    price: "150 000 UZS",
    status: "telegram",
    positionClass: "top-[53%] left-[6%] w-[45%]",
    accentColor: "border-blue-400/60 text-blue-400 bg-blue-400/10",
  },
  {
    id: "slot-4",
    time: "16:45",
    title: "SmartChair Avto-Slot",
    master: "94% Bandlik",
    price: "Ochiq Kreslo",
    status: "open",
    positionClass: "top-[68%] right-[6%] w-[45%]",
    accentColor: "border-rose-400/60 text-rose-400 bg-rose-400/10",
  },
];

function checkWebGLSupport(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
  } catch {
    return false;
  }
}

export function MirrorCanvas({ scrollProgress = 0 }: MirrorCanvasProps) {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [hasWebGL] = useState(checkWebGLSupport);
  const [hoveredSlot, setHoveredSlot] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => {
      const isNarrow = window.innerWidth < 768;
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setIsMobile(isNarrow || prefersReduced);
    };

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // If mobile or no WebGL, render touch-optimized 2.5D Mirror
  if (isMobile || !hasWebGL) {
    return <MirrorMobile />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] sm:aspect-[1/1] max-w-[560px] lg:max-w-[620px] mx-auto select-none"
    >
      {/* 3D WebGL Canvas Layer */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.85)] border border-white/10">
        <Suspense
          fallback={
            <div className="w-full h-full bg-[#0d0e12] flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border-2 border-champagne/20 border-t-champagne animate-spin" />
            </div>
          }
        >
          <Canvas
            camera={{ position: [0, 0, 5.2], fov: 42 }}
            dpr={[1, 2]}
            gl={{
              antialias: true,
              powerPreference: "high-performance",
              alpha: true,
            }}
          >
            <MirrorPortal scrollProgress={scrollProgress} />
          </Canvas>
        </Suspense>
      </div>

      {/* Crisp HTML Holographic Laser Slots Overlay */}
      {OVERLAY_SLOTS.map((slot) => {
        const isHovered = hoveredSlot === slot.id;
        return (
          <div
            key={slot.id}
            onMouseEnter={() => {
              setHoveredSlot(slot.id);
              SoundController.playHover();
            }}
            onMouseLeave={() => setHoveredSlot(null)}
            onClick={() => {
              SoundController.playLaserClick(slot.status === "vip" ? 1240 : 960);
            }}
            className={`absolute ${slot.positionClass} z-10 p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 cursor-pointer ${
              isHovered
                ? "bg-[#181a24]/95 border-champagne shadow-[0_8px_30px_rgba(212,175,90,0.25)] scale-[1.04]"
                : "bg-[#0d0f15]/80 border-white/10 hover:border-white/30"
            }`}
          >
            <div className="flex items-center justify-between gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? "bg-champagne animate-ping" : "bg-white/40"}`} />
                <span className="text-[11px] font-mono font-bold text-white tracking-wider">
                  {slot.time}
                </span>
              </div>
              <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${slot.accentColor}`}>
                {slot.status}
              </span>
            </div>

            <div className="mt-1 text-xs font-medium text-white/95 truncate">
              {slot.title}
            </div>

            <div className="mt-0.5 flex items-center justify-between text-[10px] text-white/50">
              <span className="flex items-center gap-1">
                <User className="w-2.5 h-2.5 text-white/40" />
                {slot.master}
              </span>
              <span className="font-mono text-white/80">{slot.price}</span>
            </div>
          </div>
        );
      })}

      {/* Floating Spatial HUD Badges Anchored on Canvas */}
      {/* 1. Top Mirror Brand Header */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-black/60 backdrop-blur-md border border-champagne/30 text-[10px] font-mono tracking-widest uppercase text-champagne flex items-center gap-2 pointer-events-none z-10 shadow-lg">
        <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-pulse" />
        SMARTCHAIR // DIGITAL MIRROR PORTAL
      </div>

      {/* 2. Top-Right Live Occupancy Ring Tag */}
      <div className="absolute top-4 right-4 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-xs font-mono text-white/90 flex items-center gap-2 z-10 shadow-xl pointer-events-none">
        <Sparkles className="w-3.5 h-3.5 text-champagne" />
        <span>94% BANDLIK</span>
      </div>

      {/* 3. Bottom Interactive Telemetry Bar */}
      <div className="absolute bottom-4 inset-x-4 p-3 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/15 z-10 shadow-2xl flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-champagne/15 border border-champagne/40 flex items-center justify-center text-champagne">
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">
              {t("hero.telemetry_active_slot", "Navbatdagi Bron")}
            </div>
            <div className="font-semibold text-white/95">
              14:30 · Fade & Soqol (Sardor K.)
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[11px]">
          <CheckCircle2 className="w-3 h-3" />
          <span>Telegram Sync OK</span>
        </div>
      </div>

      {/* 4. Interactive Micro Hint */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[11px] font-mono tracking-wider text-white/40 uppercase pointer-events-none flex items-center gap-1.5 whitespace-nowrap">
        <span>Kursor bilan boshqaring</span>
        <span className="text-champagne">·</span>
        <span>Pastga suring</span>
      </div>
    </div>
  );
}
