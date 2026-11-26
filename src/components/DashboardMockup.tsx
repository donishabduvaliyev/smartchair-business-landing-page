import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { Bell, CalendarDays, Scissors, TrendingUp, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const WEEK_BARS = [38, 52, 44, 70, 58, 92, 76];
const APPOINTMENTS = [
  { name: "Aziz K.", time: "17:00", dot: "bg-accent" },
  { name: "Malika R.", time: "18:30", dot: "bg-info" },
  { name: "Sardor T.", time: "19:15", dot: "bg-ok" },
];
const OCCUPANCY_PERCENT = 82;

function DepthLayer({
  z,
  className,
  children,
}: {
  z: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${z}px)` }}>
      {children}
    </div>
  );
}

export function OccupancyRing({ percent }: { percent: number }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-10 w-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={radius} strokeWidth="3.5" fill="none" className="stroke-surface-3" />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-medium tabular-nums text-text">
        {percent}%
      </span>
    </div>
  );
}

export function DashboardMockup() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 22 });
  const days = t("heroMockup.days").split(",");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reducedMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 16);
    rotateX.set(py * -16);
  }

  function handleMouseLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative flex h-full w-full items-center justify-center"
      style={{ perspective: 1600 }}
    >
      <motion.div
        style={{
          rotateX: reducedMotion ? 0 : springX,
          rotateY: reducedMotion ? 0 : springY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-md"
      >
        {/* Depth 0: Main Dashboard Panel */}
        <DepthLayer z={0} className="surface-card relative w-full overflow-hidden rounded-[20px] p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/[0.06] pb-3.5">
            <div className="flex items-center gap-2.5">
              <span className="h-2 w-2 rounded-xs bg-accent" />
              <span className="text-xs font-medium text-text">{t("heroMockup.brand")}</span>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" />
              {t("heroMockup.live")}
            </span>
          </div>

          <div className="grid grid-cols-[auto_1fr] gap-4">
            <div className="flex flex-col gap-2">
              {[CalendarDays, Users, Scissors, TrendingUp].map((Icon, i) => (
                <span
                  key={i}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                    i === 0 ? "bg-surface-3 text-text" : "bg-surface-2 text-text-muted"
                  }`}
                >
                  <Icon size={15} strokeWidth={1.5} />
                </span>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-text-muted">{t("heroMockup.thisWeek")}</p>
                <p className="font-mono text-xs font-medium tabular-nums text-ok">{t("heroMockup.change")}</p>
              </div>
              <div className="mt-3 flex h-16 items-end gap-1.5 sm:h-20">
                {WEEK_BARS.map((h, i) => (
                  <motion.span
                    key={i}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                    style={{ height: `${h}%`, transformOrigin: "bottom" }}
                    className={`flex-1 rounded-md ${i === 5 ? "bg-accent" : "bg-surface-3"}`}
                  />
                ))}
              </div>
              <div className="mt-2 flex gap-1.5">
                {days.map((d, i) => (
                  <span
                    key={i}
                    className={`flex-1 text-center font-mono text-[11px] ${
                      i === 5 ? "font-medium text-accent" : "text-text-muted"
                    }`}
                  >
                    {d}
                  </span>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {APPOINTMENTS.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between rounded-[10px] bg-surface-2 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${row.dot}`} />
                      <span className="text-xs font-medium text-text">{row.name}</span>
                    </div>
                    <span className="font-mono text-xs tabular-nums text-text-muted">{row.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DepthLayer>

        {/* Depth 70: Revenue Today (Top-Left) */}
        <DepthLayer
          z={70}
          className="surface-floating absolute -left-3 -top-6 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 sm:-left-10 sm:-top-8 sm:px-4 sm:py-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface-3 text-ok">
            <TrendingUp size={16} strokeWidth={1.6} />
          </span>
          <div>
            <p className="text-xs font-medium tabular-nums text-text">{t("heroMockup.revenueToday")}</p>
            <p className="text-[11px] text-text-secondary">{t("heroMockup.revenueDesc")}</p>
          </div>
        </DepthLayer>

        {/* Depth 90: New Booking Notification (Bottom-Right) */}
        <DepthLayer
          z={90}
          className="surface-floating absolute -bottom-6 -right-2 flex items-center gap-3 rounded-2xl px-3.5 py-2.5 sm:-bottom-8 sm:-right-8 sm:px-4 sm:py-3"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-surface-3 text-accent">
            <Bell size={16} strokeWidth={1.6} />
          </span>
          <div>
            <p className="text-xs font-medium text-text">{t("heroMockup.newBooking")}</p>
            <p className="text-[11px] text-text-secondary">{t("heroMockup.newBookingDesc")}</p>
          </div>
        </DepthLayer>

        {/* Depth 50: Staff on Shift (Top-Right) */}
        <DepthLayer
          z={50}
          className="surface-floating absolute -right-2 top-8 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 sm:flex sm:-right-6"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface-3 text-info">
            <Zap size={14} strokeWidth={1.6} />
          </span>
          <p className="text-xs font-medium text-text">{t("heroMockup.staffOnShift")}</p>
        </DepthLayer>

        {/* Depth 60: Occupancy Ring (Bottom-Left) */}
        <DepthLayer
          z={60}
          className="surface-floating absolute -left-4 bottom-16 hidden items-center gap-3 rounded-2xl px-3.5 py-2.5 sm:flex"
        >
          <OccupancyRing percent={OCCUPANCY_PERCENT} />
          <div>
            <p className="text-xs font-medium tabular-nums text-text">{t("heroMockup.occupancy")}</p>
            <p className="text-[11px] text-text-secondary">{t("heroMockup.occupancyDesc")}</p>
          </div>
        </DepthLayer>
      </motion.div>
    </div>
  );
}
