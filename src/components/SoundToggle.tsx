import { useEffect, useState } from "react";
import { SoundController } from "./audio/SoundController";
import { VolumeX } from "lucide-react";

export function SoundToggle() {
  const [muted, setMuted] = useState(SoundController.getMuted());

  useEffect(() => {
    return SoundController.subscribe((newMuted) => {
      setMuted(newMuted);
    });
  }, []);

  return (
    <button
      type="button"
      onClick={() => SoundController.toggleMute()}
      className="group relative flex items-center gap-1.5 h-8 px-2.5 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] transition-colors text-white/70 hover:text-white"
      title={muted ? "Ovozni yoqish (Sound On)" : "Ovozni o'chirish (Sound Mute)"}
      aria-label="Sound Toggle"
    >
      {muted ? (
        <VolumeX className="w-3.5 h-3.5 text-white/50 group-hover:text-white/80 transition-colors" />
      ) : (
        <div className="flex items-center gap-[2.5px] h-3.5 px-0.5">
          <span className="w-[2px] h-3 bg-champagne rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
          <span className="w-[2px] h-2 bg-champagne rounded-full animate-[pulse_0.6s_ease-in-out_infinite_0.15s]" />
          <span className="w-[2px] h-3.5 bg-champagne rounded-full animate-[pulse_0.9s_ease-in-out_infinite_0.3s]" />
          <span className="w-[2px] h-1.5 bg-champagne rounded-full animate-[pulse_0.7s_ease-in-out_infinite_0.1s]" />
        </div>
      )}
      <span className="text-[11px] font-mono tracking-wider uppercase text-white/60 group-hover:text-white/90">
        {muted ? "MUTE" : "AUDIO"}
      </span>
    </button>
  );
}
