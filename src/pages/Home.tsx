import { useEffect, useRef, useState } from "react";
import { useSEO } from "../hooks/useSEO";
import { Scene } from "../scene/Scene";
import { useAudio } from "../audio/useAudio";
import { SoundController } from "../components/audio/SoundController";
import {
  isHandheld,
  prefersReducedMotion,
  usePointer,
  useScrollState,
} from "../lib/useScroll";
import { createSpatialWorld, scrollToProgress } from "../lib/spatialWorld";
import { SpatialCompass } from "../components/spatial/SpatialCompass";
import { KineticTypographyStage } from "../components/spatial/KineticTypographyStage";
import { SpatialStageOverlay } from "../components/spatial/SpatialStageOverlay";
import { MobileFilm } from "../components/ui/MobileFilm";

export function Home() {
  useSEO({ canonicalPath: "/" });

  const scroll = useScrollState();
  const pointer = usePointer();
  const focusRef = useRef(16);
  const world = useRef(createSpatialWorld());

  const [reduced] = useState(prefersReducedMotion);
  const [handheld] = useState(isHandheld);
  const [tooWeak, setTooWeak] = useState(false);
  const audio = useAudio();

  // Sync Navbar/Compass SoundToggle with 3D spatial salon audio
  useEffect(() => {
    return SoundController.subscribe((muted) => {
      const wantOn = !muted;
      if (wantOn !== audio.on) {
        audio.toggle();
      }
    });
  }, [audio]);

  // Hand the spatial audio mix the active room once per scroll zone change
  const lastRoom = useRef(-1);
  useEffect(() => {
    let id = 0;
    const tick = () => {
      const a = scroll.current?.active ?? 0;
      if (a !== lastRoom.current) {
        lastRoom.current = a;
        audio.setRoom(a);
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [scroll, audio]);

  if (reduced || tooWeak) {
    return <MobileFilm />;
  }

  return (
    <div className="relative bg-[#060608] text-text">
      {/* Full-Screen 3D World Stage */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 h-screen w-screen overflow-hidden"
      >
        <Scene
          scroll={scroll}
          pointer={pointer}
          reduced={reduced}
          focusRef={focusRef}
          world={world}
          compact={handheld}
          onCriticalPerf={() => setTooWeak(true)}
        />
      </div>

      {/* Minimal Persistent Spatial Compass */}
      <SpatialCompass world={world} onConnectClick={() => scrollToProgress(0.97)} />

      {/* Monumental Kinetic & Parting Portal Typography */}
      <KineticTypographyStage scroll={scroll} />

      {/* Spatial World-Tethered Stage Overlays */}
      <SpatialStageOverlay
        scroll={scroll}
        world={world}
        onOpenConnect={() => scrollToProgress(0.97)}
      />

      {/* Scroll Runway driving the unbroken 3D journey */}
      <div aria-hidden="true" className="relative z-10 h-[760vh] pointer-events-none" />
    </div>
  );
}
