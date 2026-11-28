import { useEffect, useRef } from "react";

/**
 * 2.39:1 anamorphic cinema letterbox framing.
 * Leaves comfortable breathing room for interactive HUD bars.
 */
export function Matte({
  open,
  frame,
}: {
  open: boolean;
  frame: React.RefObject<{ top: number; bottom: number }>;
}) {
  const top = useRef<HTMLDivElement>(null);
  const bot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const size = () => {
      const H = window.innerHeight;
      // Sleek 56px cinema framing bars on desktop so 3D stage and overlays have generous breathing room
      const bar = open ? Math.min(60, Math.max(44, H * 0.065)) : H * 0.5;
      if (top.current) top.current.style.height = bar + "px";
      if (bot.current) bot.current.style.height = bar + "px";
      (frame as React.MutableRefObject<{ top: number; bottom: number }>).current = {
        top: bar,
        bottom: H - bar,
      };
    };
    size();
    window.addEventListener("resize", size);
    return () => window.removeEventListener("resize", size);
  }, [open, frame]);

  return (
    <>
      <div className="matte top" ref={top} />
      <div className="matte bot" ref={bot} />
    </>
  );
}

/** Lower-third gradient scrim so editorial typography stays readable over floor/chairs. */
export function Scrim({ shown }: { shown: boolean }) {
  return <div id="scrim" className={shown ? "on" : ""} aria-hidden="true" />;
}

/** Smooth rangefinder crosshair cursor. */
export function Cursor({
  pointer,
}: {
  pointer: React.RefObject<{ x: number; y: number; sx: number; sy: number }>;
}) {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let tx = x;
    let ty = y;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    let id = 0;

    const tick = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      if (el.current) {
        el.current.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
      }
      id = requestAnimationFrame(tick);
    };

    id = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(id);
    };
  }, [pointer]);

  return <div id="cursor" ref={el} aria-hidden="true" />;
}
