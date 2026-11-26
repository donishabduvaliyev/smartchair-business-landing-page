import type { PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const BASE_ROTATE_X = 7;
const BASE_ROTATE_Y = -11;
const SPRING_CONFIG = { stiffness: 140, damping: 24 };

interface ScheduleSlot {
  time: string;
  title: string;
  variant: "brass" | "slate" | "open";
}

interface BarberColumn {
  name: string;
  slots: ScheduleSlot[];
}

const BARBER_COLUMNS: BarberColumn[] = [
  {
    name: "Aziz",
    slots: [
      { time: "10:00", title: "Skin Fade", variant: "brass" },
      { time: "11:30", title: "Fade + Beard", variant: "brass" },
      { time: "13:00", title: "Open slot", variant: "open" },
    ],
  },
  {
    name: "Bekzod",
    slots: [
      { time: "10:00", title: "Classic Cut", variant: "slate" },
      { time: "11:30", title: "Walk-In #A-14", variant: "brass" },
      { time: "13:00", title: "Beard Trim", variant: "slate" },
    ],
  },
  {
    name: "Sardor",
    slots: [
      { time: "10:00", title: "Cut + Style", variant: "slate" },
      { time: "11:30", title: "Open slot", variant: "open" },
      { time: "13:00", title: "Royal Shave", variant: "brass" },
    ],
  },
];

const TELEGRAM_SLOTS = [
  { time: "14:30", active: false },
  { time: "16:00", active: true },
  { time: "17:30", active: false },
] as const;

function OccupancyRing({ percent = 82 }: { percent?: number }) {
  const size = 40;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - percent / 100);

  return (
    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#d4af5a"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span className="absolute font-mono text-xs font-medium tabular-nums text-obsidian-text">
        {percent}%
      </span>
    </div>
  );
}

function ArchitecturalWireframe() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox="0 0 560 440"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <rect
        x="24"
        y="24"
        width="512"
        height="392"
        rx="16"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
      />
      <line x1="24" y1="112" x2="536" y2="112" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="24" y1="220" x2="536" y2="220" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="24" y1="328" x2="536" y2="328" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="194" y1="24" x2="194" y2="416" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <line x1="366" y1="24" x2="366" y2="416" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <path d="M16 24H32M24 16V32" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
      <path d="M528 416H544M536 408V424" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
    </svg>
  );
}

export function SpatialPlatform3D() {
  const prefersReducedMotion = useReducedMotion();
  const rawRotateX = useMotionValue(BASE_ROTATE_X);
  const rawRotateY = useMotionValue(BASE_ROTATE_Y);

  const rotateX = useSpring(rawRotateX, SPRING_CONFIG);
  const rotateY = useSpring(rawRotateY, SPRING_CONFIG);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;

    rawRotateX.set(BASE_ROTATE_X + py * -12);
    rawRotateY.set(BASE_ROTATE_Y + px * 14);
  }

  function handlePointerLeave() {
    rawRotateX.set(BASE_ROTATE_X);
    rawRotateY.set(BASE_ROTATE_Y);
  }

  return (
    <div
      className="relative w-full max-w-full px-3 py-6 sm:px-6 sm:py-8"
      style={{ perspective: 1800 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <ArchitecturalWireframe />

      <motion.div
        className="relative w-full"
        style={{
          transformStyle: "preserve-3d",
          rotateX: prefersReducedMotion ? BASE_ROTATE_X : rotateX,
          rotateY: prefersReducedMotion ? BASE_ROTATE_Y : rotateY,
        }}
      >
        {/* Plane 0 (z = 0px): Salon OS Command Deck */}
        <div
          className="relative rounded-2xl border border-obsidian-border bg-obsidian-surface p-4 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5"
          style={{ transform: "translateZ(0px)" }}
        >
          {/* Command Deck Header */}
          <div className="flex items-center justify-between gap-3 border-b border-obsidian-border pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-full bg-brass" aria-hidden="true" />
              <span className="text-sm font-medium text-obsidian-text">SmartChair OS</span>
            </div>
            <kbd className="rounded-md border border-obsidian-border bg-obsidian-raised px-2 py-0.5 font-mono text-xs text-obsidian-muted">
              ⌘K
            </kbd>
          </div>

          {/* 3 Barber Schedule Columns */}
          <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
            {BARBER_COLUMNS.map((col) => (
              <div
                key={col.name}
                className="rounded-xl border border-obsidian-border bg-obsidian-raised/60 p-2.5"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-medium text-obsidian-text">{col.name}</span>
                  <span className="font-mono text-xs text-obsidian-muted">3/3</span>
                </div>

                <div className="space-y-1.5">
                  {col.slots.map((slot) => {
                    const blockStyles =
                      slot.variant === "brass"
                        ? "border-l-2 border-brass bg-brass/15 text-obsidian-text"
                        : slot.variant === "slate"
                          ? "border-l-2 border-obsidian-muted/50 bg-obsidian-surface text-obsidian-text"
                          : "border border-dashed border-obsidian-border bg-transparent text-obsidian-muted";

                    return (
                      <div
                        key={`${col.name}-${slot.time}`}
                        className={`rounded-lg px-2.5 py-2 ${blockStyles}`}
                      >
                        <div className="font-mono text-xs tabular-nums text-obsidian-muted">
                          {slot.time}
                        </div>
                        <div className="mt-0.5 truncate text-xs font-medium">{slot.title}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Register Bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-obsidian-border bg-obsidian-raised px-3 py-2.5">
            <span className="font-mono text-xs tabular-nums text-obsidian-text">
              Register #01 · 2,450,000 UZS · Shift Open
            </span>
            <span className="h-2 w-2 rounded-full bg-status-ok" aria-hidden="true" />
          </div>
        </div>

        {/* Plane 1 (z = 48px): Telegram Mini App Client Sheet */}
        <div
          className="absolute -right-2 -bottom-5 w-[205px] rounded-2xl border border-grid bg-paper p-3.5 text-ink shadow-[0_28px_60px_-12px_rgba(0,0,0,0.85)] sm:-right-6 sm:-bottom-7 sm:w-[225px]"
          style={{ transform: "translateZ(48px)" }}
        >
          <div className="flex items-center justify-between border-b border-grid pb-2">
            <span className="text-xs font-semibold text-ink">Top Blade · Telegram</span>
            <span className="h-2 w-2 rounded-full bg-brass" aria-hidden="true" />
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-1.5">
            {TELEGRAM_SLOTS.map((slot) => (
              <div
                key={slot.time}
                className={`flex items-center justify-center gap-1 rounded-lg py-1.5 font-mono text-xs font-medium tabular-nums ${
                  slot.active
                    ? "bg-ink text-paper"
                    : "border border-grid bg-paper-subtle text-ink-muted"
                }`}
              >
                {slot.active && (
                  <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
                )}
                <span>{slot.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-2.5 border-t border-grid pt-2 font-mono text-xs font-medium tabular-nums text-ink">
            80,000 UZS · Instant Confirm
          </div>
        </div>

        {/* Plane 2 (z = 84px): Live Walk-In & Occupancy Card */}
        <div
          className="absolute -top-5 -left-2 flex items-center gap-3 rounded-2xl border border-white/12 bg-obsidian-raised px-3.5 py-2.5 shadow-[0_36px_70px_-14px_rgba(0,0,0,0.9)] sm:-top-7 sm:-left-6"
          style={{ transform: "translateZ(84px)" }}
        >
          <OccupancyRing percent={82} />
          <div className="min-w-0">
            <p className="text-xs font-medium text-obsidian-text">Walk-In #A-14 · Chair 2</p>
            <p className="font-mono text-xs text-brass">Live queue</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
