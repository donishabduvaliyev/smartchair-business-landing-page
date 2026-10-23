import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  LineChart,
  ListChecks,
  Users2,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_URL } from "../lib/constants";
import { DotGrid, PanelChrome } from "./PanelChrome";

const TABS = [
  { key: "bookings", icon: CalendarClock },
  { key: "staff", icon: UsersRound },
  { key: "services", icon: ListChecks },
  { key: "crm", icon: Users2 },
  { key: "analytics", icon: LineChart },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TIME_LABELS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

type BookingSegment = { span: number; label?: string; time?: string };
type StaffColumn = { name: string; color: string; dot: string; segments: BookingSegment[] };

// Each staff column is a sequence of segments spanning the 7 one-hour slots
// between TIME_LABELS[0] and TIME_LABELS[7]. Segment spans must sum to 7.
const STAFF_COLUMNS: StaffColumn[] = [
  {
    name: "Aziz",
    color: "bg-accent",
    dot: "bg-accent",
    segments: [
      { span: 1 },
      { span: 2, label: "Haircut", time: "10:00–12:00" },
      { span: 1 },
      { span: 1, label: "Beard", time: "13:00–13:20" },
      { span: 2 },
    ],
  },
  {
    name: "Bekzod",
    color: "bg-info",
    dot: "bg-info",
    segments: [
      { span: 2 },
      { span: 1, label: "Color", time: "11:00–12:00" },
      { span: 1 },
      { span: 2, label: "Style", time: "13:00–15:00" },
      { span: 1 },
    ],
  },
  {
    name: "Sardor",
    color: "bg-success",
    dot: "bg-success",
    segments: [
      { span: 2, label: "Cut + Beard", time: "09:00–11:00" },
      { span: 4 },
      { span: 1, label: "Trim", time: "15:00–15:30" },
    ],
  },
];

const STAFF_LIST = [
  { name: "Aziz Karimov", role: "Senior Barber", hours: "09:00–18:00", status: "onShift" },
  { name: "Bekzod Yusupov", role: "Colorist", hours: "10:00–19:00", status: "onShift" },
  { name: "Sardor Islomov", role: "Barber", hours: "09:00–15:00", status: "onBreak" },
  { name: "Dilnoza Rashidova", role: "Nail Master", hours: "11:00–20:00", status: "offToday" },
] as const;

const SERVICES = [
  { name: "Haircut", category: "hair", duration: "45 min", price: "80,000 UZS" },
  { name: "Beard Trim", category: "barber", duration: "20 min", price: "40,000 UZS" },
  { name: "Manicure", category: "nails", duration: "50 min", price: "90,000 UZS" },
  { name: "Classic Massage", category: "spa", duration: "60 min", price: "180,000 UZS" },
] as const;

const CUSTOMERS = [
  { name: "Ali Nazarov", visits: 12, last: "2d", tag: "vip" },
  { name: "Kamola Yusupova", visits: 1, last: "1d", tag: "new" },
  { name: "Jamshid Rakhimov", visits: 6, last: "7d", tag: "regular" },
  { name: "Nodira Saidova", visits: 3, last: "21d", tag: "regular" },
] as const;

const ANALYTICS_BARS = [30, 45, 38, 60, 52, 80, 68];

function StatusPill({ statusKey }: { statusKey: string }) {
  const { t } = useTranslation();
  const tone =
    statusKey === "onShift"
      ? "bg-success/15 text-success"
      : statusKey === "onBreak"
        ? "bg-warning/15 text-warning"
        : "bg-surface-3 text-text-faint";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      {t(`businessOS.status.${statusKey}`)}
    </span>
  );
}

function TagPill({ tagKey }: { tagKey: string }) {
  const { t } = useTranslation();
  const tone =
    tagKey === "vip"
      ? "bg-accent/15 text-accent"
      : tagKey === "new"
        ? "bg-info/15 text-info"
        : "bg-surface-3 text-text-faint";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
      {t(`businessOS.tags.${tagKey}`)}
    </span>
  );
}

const ROW_HEIGHT = 34; // px per one-hour slot, keeps the time axis, columns, and now-line in lockstep
const AXIS_WIDTH = 44; // px, matches the grid-cols template below
const NOW_HOUR_INDEX = 3; // 12:00 in TIME_LABELS
const NOW_FRACTION = 2 / 3; // 12:40 -> 40 minutes into the 12:00 hour

function BookingsPanel() {
  const { t } = useTranslation();
  const bodyHeight = ROW_HEIGHT * 7;
  const nowTop = (NOW_HOUR_INDEX + NOW_FRACTION) * ROW_HEIGHT;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium text-text-faint">{t("businessOS.bookings.today")}</p>
        <span className="flex items-center gap-1.5 text-[11px] text-text-faint">
          <span className="h-1.5 w-1.5 rounded-full bg-danger" />
          {t("businessOS.bookings.now")} 12:40
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[440px]">
          {/* Header row */}
          <div
            className="grid gap-x-2"
            style={{ gridTemplateColumns: `${AXIS_WIDTH}px repeat(3, 1fr)` }}
          >
            <div />
            {STAFF_COLUMNS.map((col) => (
              <div key={col.name} className="mb-2 flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${col.dot}`} />
                <p className="truncate text-xs font-semibold text-text">{col.name}</p>
              </div>
            ))}
          </div>

          {/* Body: time axis + staff columns, with a "now" line overlay */}
          <div className="relative">
            <div
              className="grid gap-x-2"
              style={{ gridTemplateColumns: `${AXIS_WIDTH}px repeat(3, 1fr)` }}
            >
              <div className="relative" style={{ height: bodyHeight }}>
                {TIME_LABELS.slice(0, -1).map((label, i) => (
                  <span
                    key={label}
                    className="absolute right-2 -translate-y-1/2 text-[10px] text-text-faint"
                    style={{ top: i * ROW_HEIGHT }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {STAFF_COLUMNS.map((col) => (
                <div
                  key={col.name}
                  className="flex flex-col gap-[3px]"
                  style={{ height: bodyHeight }}
                >
                  {col.segments.map((seg, i) =>
                    seg.label ? (
                      <div
                        key={i}
                        style={{ flexGrow: seg.span, flexBasis: 0 }}
                        className={`flex flex-col justify-center overflow-hidden rounded-md border-l-2 ${col.color} bg-surface-3/70 px-2 py-1`}
                      >
                        <span className="truncate text-[10px] font-semibold text-text">
                          {seg.label}
                        </span>
                        <span className="truncate text-[9px] text-text-faint">{seg.time}</span>
                      </div>
                    ) : (
                      <div
                        key={i}
                        style={{ flexGrow: seg.span, flexBasis: 0 }}
                        className="rounded-md bg-surface-2/40"
                      />
                    )
                  )}
                </div>
              ))}
            </div>

            <div
              className="pointer-events-none absolute flex items-center"
              style={{ top: nowTop, left: AXIS_WIDTH + 8, right: 0 }}
            >
              <span className="-ml-1 h-1.5 w-1.5 shrink-0 rounded-full bg-danger" />
              <span className="h-px w-full bg-danger/60" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1.5 text-[11px] text-text-faint">
        <span className="h-2 w-2 rounded-sm bg-surface-2/40" />
        {t("businessOS.bookings.free")}
        <span className="ml-3 h-2 w-2 rounded-sm border-l-2 border-accent bg-surface-3/70" />
        {t("businessOS.bookings.booked")}
      </div>
    </div>
  );
}

function StaffPanel() {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {STAFF_LIST.map((s) => (
        <div key={s.name} className="flex items-center justify-between rounded-xl bg-surface-2/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-accent-dim text-xs font-bold text-accent-ink">
              {s.name[0]}
            </span>
            <div>
              <p className="text-xs font-semibold text-text">{s.name}</p>
              <p className="text-[11px] text-text-faint">
                {s.role} &middot; {s.hours}
              </p>
            </div>
          </div>
          <StatusPill statusKey={s.status} />
        </div>
      ))}
    </div>
  );
}

function ServicesPanel() {
  const { t } = useTranslation();
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[420px] border-collapse text-left">
        <thead>
          <tr className="text-[11px] uppercase tracking-wide text-text-faint">
            <th className="pb-2 font-medium">{t("businessOS.services.header.service")}</th>
            <th className="pb-2 font-medium">{t("businessOS.services.header.category")}</th>
            <th className="pb-2 font-medium">{t("businessOS.services.header.duration")}</th>
            <th className="pb-2 font-medium">{t("businessOS.services.header.price")}</th>
          </tr>
        </thead>
        <tbody>
          {SERVICES.map((s) => (
            <tr key={s.name} className="border-t border-border-soft">
              <td className="py-2.5 text-xs font-semibold text-text">{s.name}</td>
              <td className="py-2.5 text-xs text-text-muted">{t(`categories.${s.category}`)}</td>
              <td className="py-2.5 text-xs text-text-muted">{s.duration}</td>
              <td className="py-2.5 text-xs font-medium text-accent">{s.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CrmPanel() {
  const { t } = useTranslation();
  return (
    <div className="space-y-2">
      {CUSTOMERS.map((c) => (
        <div key={c.name} className="flex items-center justify-between rounded-xl bg-surface-2/60 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-3 text-xs font-bold text-text">
              {c.name[0]}
            </span>
            <div>
              <p className="text-xs font-semibold text-text">{c.name}</p>
              <p className="text-[11px] text-text-faint">
                {c.visits} {t("businessOS.crm.visits")} &middot; {t("businessOS.crm.last")} {c.last}
              </p>
            </div>
          </div>
          <TagPill tagKey={c.tag} />
        </div>
      ))}
    </div>
  );
}

function AnalyticsPanel() {
  const { t } = useTranslation();
  const tiles = [
    { label: t("businessOS.analytics.revenue"), value: "18.2M", suffix: "UZS" },
    { label: t("businessOS.analytics.bookings"), value: "214", suffix: t("businessOS.analytics.thisMonth") },
    { label: t("businessOS.analytics.noShows"), value: "3%", suffix: t("businessOS.analytics.down") },
    { label: t("businessOS.analytics.rating"), value: "4.9", suffix: t("businessOS.analytics.avg") },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {tiles.map((s) => (
          <div key={s.label} className="rounded-xl bg-surface-2/60 px-3.5 py-3">
            <p className="text-[11px] text-text-faint">{s.label}</p>
            <p className="mt-1 text-lg font-bold text-text">{s.value}</p>
            <p className="text-[10px] text-text-faint">{s.suffix}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex h-20 items-end gap-1.5">
        {ANALYTICS_BARS.map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            whileInView={{ height: `${h}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="flex-1 rounded-full bg-gradient-to-t from-accent-dim to-accent"
          />
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<TabKey, React.ComponentType> = {
  bookings: BookingsPanel,
  staff: StaffPanel,
  services: ServicesPanel,
  crm: CrmPanel,
  analytics: AnalyticsPanel,
};

export function BusinessOS() {
  const { t } = useTranslation();
  const [active, setActive] = useState<TabKey>("bookings");
  const ActivePanel = PANELS[active];

  return (
    <section id="for-business" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-info/10 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-info">
            {t("businessOS.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {t("businessOS.title")}
          </h2>
          <p className="mt-4 text-lg text-text-muted">{t("businessOS.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActive(tab.key)}
                className={`press-spring relative flex items-center gap-1.5 rounded-full border border-border/60 bg-surface/40 px-4 py-2 text-xs font-medium transition-colors sm:text-sm ${
                  active === tab.key
                    ? "text-accent"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {active === tab.key && (
                  <motion.div
                    layoutId="activeBusinessTab"
                    className="absolute inset-0 rounded-full border border-accent/50 bg-accent/15 shadow-[0_0_20px_rgba(212,175,90,0.2)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <tab.icon size={14} />
                  {t(`businessOS.tabs.${tab.key}`)}
                </span>
              </button>
            ))}
          </div>

          <div className="card-glass relative mt-6 min-h-[340px] overflow-hidden rounded-3xl p-5 sm:p-7">
            <DotGrid />
            <div className="relative">
              <PanelChrome label={t("heroMockup.brand")} />
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ActivePanel />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary press-spring group inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold"
            >
              {t("businessOS.cta")}
              <ArrowRight size={16} className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
