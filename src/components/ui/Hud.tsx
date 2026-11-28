import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { SCENES } from "../../content/scenes";
import type { ScrollState } from "../../lib/useScroll";
import { Logo } from "../Logo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { usePartnerModal } from "../../context/PartnerModalContext";

const timecode = (sec: number) => {
  const f = Math.floor((sec % 1) * 24);
  const s = Math.floor(sec) % 60;
  const m = Math.floor(sec / 60) % 60;
  const h = Math.floor(sec / 3600);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
};

export function Hud({
  scroll,
  frame,
  soundOn,
  onToggleSound,
  focusRef,
}: {
  scroll: React.RefObject<ScrollState>;
  frame: React.RefObject<{ top: number; bottom: number }>;
  soundOn: boolean;
  onToggleSound: () => void;
  focusRef: React.RefObject<number>;
}) {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();

  const tc = useRef<HTMLElement>(null);
  const shot = useRef<HTMLElement>(null);
  const scn = useRef<HTMLElement>(null);
  const scName = useRef<HTMLElement>(null);
  const lens = useRef<HTMLElement>(null);
  const fd = useRef<HTMLElement>(null);
  const fbar = useRef<HTMLElement>(null);
  const cue = useRef<HTMLDivElement>(null);
  const corners = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const t0 = performance.now();
    let id = 0;
    const tick = () => {
      const p = scroll.current?.smooth ?? 0;
      const i = scroll.current?.active ?? 0;
      const f = frame.current ?? { top: 0, bottom: window.innerHeight };
      const inset = 18;
      corners.current.forEach((el, k) => {
        if (!el) return;
        el.style.top = (k < 2 ? f.top + inset : f.bottom - inset - 16) + "px";
      });
      if (cue.current) {
        cue.current.style.top = f.bottom - inset - 52 + "px";
        cue.current.style.opacity = p > 0.02 ? "0" : "1";
      }
      if (tc.current) tc.current.textContent = timecode((performance.now() - t0) / 1000);
      if (shot.current) shot.current.textContent = "C" + String(Math.floor(p * 120) + 1).padStart(3, "0");
      if (scn.current) scn.current.textContent = String(i + 1).padStart(2, "0");
      if (scName.current) scName.current.textContent = SCENES[i]?.hud ?? "";
      if (lens.current) lens.current.textContent = String(SCENES[i]?.lens ?? 40);
      const focus = focusRef.current ?? 16;
      if (fd.current) fd.current.textContent = focus.toFixed(1);
      if (fbar.current) fbar.current.style.left = Math.max(0, Math.min(75, (focus / 50) * 75)) + "px";
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [scroll, frame, focusRef]);

  return (
    <div id="hud">
      {/* Top-Left: Brand Mark & Camera Rec Timecode */}
      <div
        className="hudline"
        ref={(el) => {
          corners.current[0] = el;
        }}
        style={{ left: "clamp(22px,4.5vw,72px)" }}
      >
        <div className="pointer-events-auto mr-3">
          <Logo />
        </div>
        <span className="rec hidden sm:inline-flex">
          <u />
          Rec
        </span>
        <span className="hidden md:inline">
          <b ref={tc as React.RefObject<HTMLElement>}>00:00:00:00</b>
        </span>
        <span className="hudseg hidden lg:inline">
          A001 <b ref={shot as React.RefObject<HTMLElement>}>C001</b>
        </span>
      </div>

      {/* Top-Right: Lens, Sound, Language & Connect CTA */}
      <div
        className="hudline"
        ref={(el) => {
          corners.current[1] = el;
        }}
        style={{ right: "clamp(22px,4.5vw,72px)" }}
      >
        <span className="hudseg hidden xl:inline">
          Aperture <b>T2.0</b>
        </span>
        <span className="hidden sm:inline">
          <b ref={lens as React.RefObject<HTMLElement>}>40</b>mm
        </span>

        <button
          id="sound"
          type="button"
          className={soundOn ? "on" : ""}
          onClick={onToggleSound}
          aria-label="Toggle shop sound"
        >
          {soundOn ? "Sound On" : "Sound Off"}
        </button>

        <div className="pointer-events-auto">
          <LanguageSwitcher />
        </div>

        <button
          type="button"
          onClick={openPartnerModal}
          className="pointer-events-auto ml-1 inline-flex h-8 items-center justify-center rounded-lg bg-[#f2f2f3] px-3.5 text-[11px] font-medium tracking-normal normal-case text-[#060608] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {t("nav.listBusiness")}
        </button>
      </div>

      {/* Bottom-Left: Active Scene Slate */}
      <div
        className="hudline"
        ref={(el) => {
          corners.current[2] = el;
        }}
        style={{ left: "clamp(22px,4.5vw,72px)" }}
      >
        <span className="hudseg">
          Scene <b ref={scn as React.RefObject<HTMLElement>}>01</b>
        </span>
        <span ref={scName as React.RefObject<HTMLElement>}>Reception</span>
      </div>

      {/* Bottom-Right: Focus Distance & 24fps */}
      <div
        className="hudline"
        ref={(el) => {
          corners.current[3] = el;
        }}
        style={{ right: "clamp(22px,4.5vw,72px)" }}
      >
        <span className="hudseg">
          Focus <b ref={fd as React.RefObject<HTMLElement>}>18.0</b>m
        </span>
        <span className="focusbar hidden sm:inline-block">
          <i ref={fbar as React.RefObject<HTMLElement>} />
        </span>
        <span>
          <em>24</em>fps
        </span>
      </div>

      {/* Scroll Cue */}
      <div id="cue" ref={cue}>
        <u />
        Scroll
      </div>
    </div>
  );
}
