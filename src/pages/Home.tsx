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
import { Hero } from "../components/Hero";
import { CategoryStrip } from "../components/CategoryStrip";
import { Features } from "../components/Features";
import { BusinessOS } from "../components/BusinessOS";
import { HowItWorks } from "../components/HowItWorks";
import { Testimonials } from "../components/Testimonials";
import { PartnerInquirySection } from "../components/PartnerInquirySection";
import { FAQ } from "../components/FAQ";
import { CTA } from "../components/CTA";

export function Home() {
  useSEO({ canonicalPath: "/" });

  const scroll = useScrollState();
  const pointer = usePointer();
  const focusRef = useRef(16);

  const [reduced] = useState(prefersReducedMotion);
  const [handheld] = useState(isHandheld);
  const [tooWeak, setTooWeak] = useState(false);
  const audio = useAudio();

  // Sync Navbar SoundToggle with 3D spatial salon audio
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

  const show3DStage = !handheld && !reduced && !tooWeak;

  return (
    <>
      {show3DStage && (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 h-screen w-screen overflow-hidden"
        >
          <Scene
            scroll={scroll}
            pointer={pointer}
            reduced={reduced}
            focusRef={focusRef}
            onCriticalPerf={() => setTooWeak(true)}
          />
          {/* Subtle atmospheric readability veil so foreground copy & cards pop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/45 via-[#060608]/25 to-[#060608]/65" />
        </div>
      )}

      <div className="relative z-10">
        <Hero />
        <CategoryStrip />
        <Features />
        <BusinessOS />
        <HowItWorks />
        <Testimonials />
        <PartnerInquirySection />
        <FAQ />
        <CTA />
      </div>
    </>
  );
}
