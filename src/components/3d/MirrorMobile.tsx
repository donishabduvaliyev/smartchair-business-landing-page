import { useState } from "react";
import { Sparkles, CheckCircle2, User } from "lucide-react";
import { SoundController } from "../audio/SoundController";

interface SlotItem {
  id: string;
  time: string;
  title: string;
  master: string;
  price: string;
  status: "active" | "vip" | "telegram" | "open";
}

const MOBILE_SLOTS: SlotItem[] = [
  {
    id: "slot-1",
    time: "14:30",
    title: "Fade & Soqol Gradiyenti",
    master: "Sardor K.",
    price: "180 000 UZS",
    status: "active",
  },
  {
    id: "slot-2",
    time: "15:15",
    title: "Premium Royal Shave",
    master: "Alisher T.",
    price: "240 000 UZS",
    status: "vip",
  },
  {
    id: "slot-3",
    time: "16:00",
    title: "Soch Turmagi & Bosh Spa",
    master: "Olim V.",
    price: "150 000 UZS",
    status: "telegram",
  },
  {
    id: "slot-4",
    time: "16:45",
    title: "SmartChair Avto-Slot",
    master: "94% Bandlik",
    price: "Ochiq Kreslo",
    status: "open",
  },
];

export function MirrorMobile() {
  const [selectedId, setSelectedId] = useState<string>("slot-1");

  return (
    <div className="relative w-full max-w-[440px] mx-auto select-none">
      {/* 2.5D Obsidian Beveled Mirror Container */}
      <div className="relative rounded-3xl p-5 bg-[#0d0e12] border-2 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Warm Champagne Backlight Glow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 h-32 bg-champagne/15 rounded-full blur-3xl pointer-events-none" />

        {/* Specular Top Rim */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

        {/* Mirror Header */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-champagne animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-champagne uppercase font-medium">
              SMARTCHAIR // MIRROR PORTAL
            </span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-champagne/15 border border-champagne/30 text-[10px] font-mono text-champagne font-semibold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            94% BANDLIK
          </div>
        </div>

        {/* Interactive Holographic Laser Slots List */}
        <div className="mt-4 space-y-2.5">
          {MOBILE_SLOTS.map((slot) => {
            const isSelected = selectedId === slot.id;
            return (
              <button
                key={slot.id}
                type="button"
                onClick={() => {
                  setSelectedId(slot.id);
                  SoundController.playLaserClick(slot.status === "vip" ? 1200 : 980);
                }}
                className={`w-full text-left p-3.5 rounded-2xl transition-all duration-300 relative border ${
                  isSelected
                    ? "bg-[#161822] border-champagne/60 shadow-[0_4px_20px_rgba(212,175,90,0.15)] translate-x-1"
                    : "bg-[#111217] border-white/5 hover:border-white/15"
                }`}
              >
                {/* Active Indicator Bar */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-champagne rounded-r" />
                )}

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-champagne">
                      {slot.time}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-white/60">
                      {slot.status.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-white/80">
                    {slot.price}
                  </span>
                </div>

                <div className="mt-1.5 flex items-center justify-between">
                  <div className="text-sm font-medium text-white/95">
                    {slot.title}
                  </div>
                  <div className="text-xs text-white/50 flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{slot.master}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Telemetry Footer */}
        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Telegram Sync Active</span>
          </div>
          <div className="font-mono text-[11px] text-white/40">
            Avto-Slot Engine
          </div>
        </div>
      </div>
    </div>
  );
}
