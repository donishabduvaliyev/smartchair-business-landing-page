import { useEffect, useState } from "react";
import { SoundController } from "./audio/SoundController";
import { VolumeX } from "lucide-react";

export function SoundToggle({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [muted, setMuted] = useState(SoundController.getMuted());

  useEffect(() => {
    return SoundController.subscribe((newMuted) => {
      setMuted(newMuted);
    });
  }, []);

  const isLight = tone === "light";

  return (
    <button
      type="button"
      onClick={() => SoundController.toggleMute()}
      className={`group relative flex items-center gap-1.5 h-8 px-2.5 rounded-full border transition-colors ${
        isLight
          ? "border-[#8C6D46]/25 bg-[#EFE7D8]/75 hover:bg-[#EFE7D8] text-[#1C1917]/75 hover:text-[#1C1917]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-white/70 hover:text-white"
      }`}
      title={muted ? "Ovozni yoqish (Sound On)" : "Ovozni o'chirish (Sound Mute)"}
      aria-label="Sound Toggle"
    >
      {muted ? (
        <VolumeX
          className={`w-3.5 h-3.5 transition-colors ${
            isLight
              ? "text-[#1C1917]/65 group-hover:text-[#1C1917]"
              : "text-white/50 group-hover:text-white/80"
          }`}
        />
      ) : (
        <div className="flex items-center gap-[2.5px] h-3.5 px-0.5">
          <span className="w-[2px] h-3 bg-champagne rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
          <span className="w-[2px] h-2 bg-champagne rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
          <span className="w-[2px] h-3.5 bg-champagne rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.3s]" />
          <span className="w-[2px] h-1.5 bg-champagne rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s]" />
        </div>
      )}
      <span
        className={`hidden sm:inline text-[11px] font-mono tracking-wider uppercase ${
          isLight
            ? "text-[#1C1917]/70 group-hover:text-[#1C1917]"
            : "text-white/60 group-hover:text-white/90"
        }`}
      >
        {muted ? "MUTE" : "AUDIO"}
      </span>
    </button>
  );
}
