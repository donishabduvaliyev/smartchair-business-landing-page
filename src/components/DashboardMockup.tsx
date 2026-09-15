import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Bell, CalendarDays, Scissors, TrendingUp, Users, Zap } from "lucide-react";
import { useTranslation } from "react-i18next";

const WEEK_BARS = [38, 52, 44, 70, 58, 92, 76];
const APPOINTMENTS = [
  { name: "Aziz K.", time: "17:00", color: "bg-accent" },
  { name: "Malika R.", time: "18:30", color: "bg-info" },
  { name: "Sardor T.", time: "19:15", color: "bg-success" },
];
const OCCUPANCY_PERCENT = 82;

function DepthLayer({
  z,
  className,
  children,
  style,
}: {
  z: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={className} style={{ transform: `translateZ(${z}px)`, ...style }}>
      {children}
    </div>
  );
}

function OccupancyRing({ percent }: { percent: number }) {
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative h-10 w-10 shrink-0">
      <svg width="40" height="40" viewBox="0 0 40 40" className="-rotate-90">
        <circle cx="20" cy="20" r={radius} strokeWidth="4" fill="none" className="stroke-surface-3" />
        <motion.circle
          cx="20"
          cy="20"
          r={radius}
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-text">
        {percent}%
      </span>
    </div>
  );
}

export function DashboardMockup() {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 22 });
  const days = t("heroMockup.days").split(",");

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
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
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full max-w-md"
      >
        {/* Main dashboard panel */}
        <DepthLayer
          z={0}
          className="card-glass relative w-full overflow-hidden rounded-3xl p-4 shadow-2xl sm:p-5"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "14px 14px",
              color: "var(--color-accent)",
            }}
          />

          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-3">
                  <span className="h-2 w-2 rounded-sm bg-accent" />
                </span>
                <span className="text-xs font-semibold text-text">{t("heroMockup.brand")}</span>
                <span className="flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-success">
                  <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-success" />
                  {t("heroMockup.live")}
                </span>
              </div>
              <div className="flex gap-1.5">
                <span className="h-2 w-2 rounded-full bg-danger/60" />
                <span className="h-2 w-2 rounded-full bg-warning/60" />
                <span className="h-2 w-2 rounded-full bg-success/60" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-[auto_1fr] gap-4">
              <div className="flex flex-col gap-2">
                {[CalendarDays, Users, Scissors, TrendingUp].map((Icon, i) => (
                  <span
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                      i === 0 ? "bg-accent/15 text-accent" : "bg-surface-2 text-text-faint"
                    }`}
                  >
                    <Icon size={14} />
                  </span>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-medium text-text-faint">{t("heroMockup.thisWeek")}</p>
                  <p className="text-[11px] font-semibold text-success">{t("heroMockup.change")}</p>
                </div>
                <div className="mt-3 flex h-16 items-end gap-1.5 sm:h-20">
                  {WEEK_BARS.map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                      className={`flex-1 rounded-full ${
                        i === 5 ? "bg-gradient-to-t from-accent-dim to-accent" : "bg-surface-3"
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-1.5 flex gap-1.5">
                  {days.map((d, i) => (
                    <span
                      key={i}
                      className={`flex-1 text-center text-[9px] ${
                        i === 5 ? "font-bold text-accent" : "text-text-faint"
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
                      className="flex items-center justify-between rounded-xl bg-surface-2/70 px-3 py-2"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${row.color}`} />
                        <span className="text-[11px] font-medium text-text">{row.name}</span>
                      </div>
                      <span className="text-[11px] text-text-faint">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DepthLayer>

        {/* Floating revenue card */}
        <DepthLayer
          z={70}
          className="card-glass absolute -left-6 -top-6 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl sm:-left-10 sm:-top-8"
        >
          <FloatBob delay={0}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-success/15 text-success">
              <TrendingUp size={16} />
            </span>
          </FloatBob>
          <div>
            <p className="text-xs font-semibold text-text">{t("heroMockup.revenueToday")}</p>
            <p className="text-[11px] text-text-faint">{t("heroMockup.revenueDesc")}</p>
          </div>
        </DepthLayer>

        {/* Floating booking notification */}
        <DepthLayer
          z={90}
          className="card-glass absolute -bottom-6 -right-4 flex items-center gap-2.5 rounded-2xl px-4 py-3 shadow-xl sm:-bottom-8 sm:-right-8"
        >
          <FloatBob delay={0.6}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/15 text-accent">
              <Bell size={16} />
            </span>
          </FloatBob>
          <div>
            <p className="text-xs font-semibold text-text">{t("heroMockup.newBooking")}</p>
            <p className="text-[11px] text-text-faint">{t("heroMockup.newBookingDesc")}</p>
          </div>
        </DepthLayer>

        {/* Floating staff chip */}
        <DepthLayer
          z={50}
          className="card-glass absolute -right-3 top-8 hidden items-center gap-2 rounded-2xl px-3.5 py-2.5 shadow-xl sm:flex sm:-right-6"
        >
          <FloatBob delay={1.1}>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-info/15 text-info">
              <Zap size={13} />
            </span>
          </FloatBob>
          <p className="text-[11px] font-semibold text-text">{t("heroMockup.staffOnShift")}</p>
        </DepthLayer>

        {/* Floating occupancy ring */}
        <DepthLayer
          z={60}
          className="card-glass absolute -left-4 bottom-16 hidden items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-xl sm:flex"
        >
          <FloatBob delay={1.6}>
            <OccupancyRing percent={OCCUPANCY_PERCENT} />
          </FloatBob>
          <div>
            <p className="text-xs font-semibold text-text">{t("heroMockup.occupancy")}</p>
            <p className="text-[11px] text-text-faint">{t("heroMockup.occupancyDesc")}</p>
          </div>
        </DepthLayer>
      </motion.div>
    </div>
  );
}

function FloatBob({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.span
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
      className="inline-flex"
    >
      {children}
    </motion.span>
  );
}
