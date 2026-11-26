import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  QrCode,
  Receipt,
  Users2,
  UsersRound,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePartnerModal } from "../context/PartnerModalContext";
import { Crosshair } from "./BlueprintGrid";

const TABS = [
  { key: "bookings", num: "01", icon: CalendarClock },
  { key: "queue", num: "02", icon: QrCode },
  { key: "register", num: "03", icon: Receipt },
  { key: "staff", num: "04", icon: UsersRound },
  { key: "crm", num: "05", icon: Users2 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TIME_LABELS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

type BookingSegment = { span: number; label?: string; time?: string };
type StaffColumn = { name: string; accent: string; dot: string; segments: BookingSegment[] };

const STAFF_COLUMNS: StaffColumn[] = [
  {
    name: "Aziz",
    accent: "border-l-brass",
    dot: "bg-brass",
    segments: [
      { span: 1 },
      { span: 2, label: "Haircut", time: "10:00–12:00" },
      { span: 1 },
      { span: 1, label: "Beard", time: "13:00–13:45" },
      { span: 2 },
    ],
  },
  {
    name: "Bekzod",
    accent: "border-l-status-info",
    dot: "bg-status-info",
    segments: [
      { span: 2 },
      { span: 1, label: "Fade", time: "11:00–12:00" },
      { span: 1 },
      { span: 2, label: "Style", time: "13:00–15:00" },
      { span: 1 },
    ],
  },
  {
    name: "Sardor",
    accent: "border-l-status-ok",
    dot: "bg-status-ok",
    segments: [
      { span: 2, label: "Cut + Beard", time: "09:00–11:00" },
      { span: 4 },
      { span: 1, label: "Trim", time: "15:00–16:00" },
    ],
  },
];

const QUEUE_TICKETS = [
  { ticket: "#B-09", client: "Jasur T.", service: "Haircut", master: "Bekzod", state: "inChair", time: "Now" },
  { ticket: "#A-14", client: "Walk-in Guest", service: "Fade + Beard", master: "Aziz", state: "waiting", time: "8 min" },
  { ticket: "#A-15", client: "Walk-in Guest", service: "Beard Trim", master: "Sardor", state: "waiting", time: "16 min" },
  { ticket: "#B-10", client: "Otabek M.", service: "Classic Cut", master: "Aziz", state: "waiting", time: "25 min" },
] as const;

const STAFF_LIST = [
  { name: "Aziz Karimov", role: "Senior Barber · 09:00–18:00", commission: "50%", payout: "480,000 UZS", status: "onShift" },
  { name: "Bekzod Yusupov", role: "Barber · 10:00–19:00", commission: "45%", payout: "360,000 UZS", status: "onShift" },
  { name: "Sardor Islomov", role: "Barber · 09:00–15:00", commission: "45%", payout: "290,000 UZS", status: "onBreak" },
  { name: "Dilnoza Rashidova", role: "Nail Master · 11:00–20:00", commission: "50%", payout: "0 UZS", status: "offToday" },
] as const;

const CUSTOMERS = [
  { name: "Ali Nazarov", visits: 12, last: "2d", tag: "vip", overdue: false },
  { name: "Kamola Yusupova", visits: 2, last: "1d", tag: "new", overdue: false },
  { name: "Jamshid Rakhimov", visits: 6, last: "32d", tag: "regular", overdue: true },
  { name: "Nodira Saidova", visits: 4, last: "14d", tag: "regular", overdue: false },
] as const;

function StatusPill({ statusKey }: { statusKey: string }) {
  const { t } = useTranslation();
  const tone =
    statusKey === "onShift"
      ? "bg-status-ok/15 text-status-ok"
      : statusKey === "onBreak"
        ? "bg-status-warn/15 text-status-warn"
        : "bg-obsidian-raised text-obsidian-muted";
  return (
    <span className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${tone}`}>
      {t(`businessOS.status.${statusKey}`)}
    </span>
  );
}

function TagPill({ tagKey }: { tagKey: string }) {
  const { t } = useTranslation();
  const tone =
    tagKey === "vip"
      ? "bg-brass-wash text-brass"
      : tagKey === "new"
        ? "bg-status-info/15 text-status-info"
        : "bg-obsidian-raised text-obsidian-muted";
  return (
    <span className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${tone}`}>
      {t(`businessOS.tags.${tagKey}`)}
    </span>
  );
}

const ROW_HEIGHT = 38;
const AXIS_WIDTH = 48;
const NOW_HOUR_INDEX = 3;
const NOW_FRACTION = 2 / 3;

function BookingsPanel() {
  const { t } = useTranslation();
  const bodyHeight = ROW_HEIGHT * 7;
  const nowTop = (NOW_HOUR_INDEX + NOW_FRACTION) * ROW_HEIGHT;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-b border-obsidian-border pb-3">
        <p className="text-sm font-semibold text-obsidian-text">{t("businessOS.bookings.today")}</p>
        <span className="flex items-center gap-2 text-xs tabular-nums text-obsidian-muted">
          <span className="h-2 w-2 rounded-full bg-status-danger" />
          {t("businessOS.bookings.now")} 12:40
        </span>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[480px]">
          <div
            className="grid gap-x-2.5"
            style={{ gridTemplateColumns: `${AXIS_WIDTH}px repeat(3, 1fr)` }}
          >
            <div />
            {STAFF_COLUMNS.map((col) => (
              <div key={col.name} className="mb-2.5 flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${col.dot}`} />
                <p className="truncate text-xs font-semibold text-obsidian-text">{col.name}</p>
              </div>
            ))}
          </div>

          <div className="relative">
            <div
              className="grid gap-x-2.5"
              style={{ gridTemplateColumns: `${AXIS_WIDTH}px repeat(3, 1fr)` }}
            >
              <div className="relative" style={{ height: bodyHeight }}>
                {TIME_LABELS.slice(0, -1).map((label, i) => (
                  <span
                    key={label}
                    className="absolute right-2 -translate-y-1/2 font-mono text-xs tabular-nums text-obsidian-muted"
                    style={{ top: i * ROW_HEIGHT }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {STAFF_COLUMNS.map((col) => (
                <div
                  key={col.name}
                  className="flex flex-col gap-1"
                  style={{ height: bodyHeight }}
                >
                  {col.segments.map((seg, i) =>
                    seg.label ? (
                      <div
                        key={i}
                        style={{ flexGrow: seg.span, flexBasis: 0 }}
                        className={`flex flex-col justify-center overflow-hidden rounded-lg border border-obsidian-border border-l-2 ${col.accent} bg-obsidian-raised px-2.5 py-1`}
                      >
                        <span className="truncate text-xs font-semibold text-obsidian-text">
                          {seg.label}
                        </span>
                        <span className="truncate text-xs tabular-nums text-obsidian-muted">
                          {seg.time}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={i}
                        style={{ flexGrow: seg.span, flexBasis: 0 }}
                        className="rounded-lg border border-dashed border-obsidian-border/70 bg-transparent"
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
              <span className="-ml-1 h-2 w-2 shrink-0 rounded-full bg-status-danger" />
              <span className="h-px w-full bg-status-danger/70" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-obsidian-border pt-3 text-xs text-obsidian-muted">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm border border-dashed border-obsidian-muted" />
          {t("businessOS.bookings.free")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm border-l-2 border-brass bg-obsidian-raised" />
          {t("businessOS.bookings.booked")}
        </span>
      </div>
    </div>
  );
}

function QueuePanel() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <div>
          <p className="text-sm font-semibold text-obsidian-text">{t("businessOS.queue.title")}</p>
          <p className="text-xs text-obsidian-muted">{t("businessOS.queue.scanHint")}</p>
        </div>
        <div className="flex items-center gap-2.5 text-xs tabular-nums">
          <span className="rounded-md bg-obsidian-raised px-3 py-1 text-obsidian-text">
            {t("businessOS.queue.waiting")}: 3
          </span>
          <span className="rounded-md bg-brass-wash px-3 py-1 text-brass">
            {t("businessOS.queue.avgWait")}: 12 min
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {QUEUE_TICKETS.map((item) => (
          <div
            key={item.ticket}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-obsidian-border bg-obsidian-raised px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-obsidian-border bg-obsidian-surface px-2.5 py-1 font-mono text-xs font-semibold tabular-nums text-brass">
                {item.ticket}
              </span>
              <div>
                <p className="text-xs font-semibold text-obsidian-text">
                  {item.client} · {item.service}
                </p>
                <p className="text-xs text-obsidian-muted">{item.master}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-xs tabular-nums text-obsidian-muted">{item.time}</span>
              <span
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${
                  item.state === "inChair"
                    ? "bg-status-ok/15 text-status-ok"
                    : "bg-obsidian-surface text-obsidian-muted"
                }`}
              >
                {t(`businessOS.queue.${item.state}`)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RegisterPanel() {
  const { t } = useTranslation();
  const rows = [
    { label: t("businessOS.register.cash"), value: "920,000 UZS" },
    { label: t("businessOS.register.card"), value: "540,000 UZS" },
    { label: t("businessOS.register.digital"), value: "990,000 UZS" },
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <p className="text-sm font-semibold text-obsidian-text">{t("businessOS.register.title")}</p>
        <span className="shrink-0 whitespace-nowrap rounded-md bg-status-ok/15 px-3 py-1 text-xs font-medium text-status-ok">
          {t("businessOS.register.open")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-obsidian-border bg-obsidian-raised p-4">
          <p className="text-xs text-obsidian-muted">{t("businessOS.register.total")}</p>
          <p className="mt-1.5 text-2xl font-semibold tabular-nums text-obsidian-text">
            2,450,000 UZS
          </p>
          <div className="mt-4 space-y-2 border-t border-obsidian-border pt-3">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="text-obsidian-muted">{r.label}</span>
                <span className="font-semibold tabular-nums text-obsidian-text">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-obsidian-border bg-obsidian-raised p-4">
          <div>
            <p className="text-sm font-semibold text-obsidian-text">
              {t("businessOS.register.zReport")}
            </p>
            <p className="mt-1 text-xs tabular-nums text-obsidian-muted">
              14 completed receipts · 0 refunds
            </p>
          </div>
          <div className="mt-6 rounded-lg border border-obsidian-border bg-obsidian-surface px-3.5 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-obsidian-muted">Expected cash</span>
              <span className="tabular-nums text-obsidian-text">920,000 UZS</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-obsidian-muted">Reconciliation</span>
              <span className="font-semibold tabular-nums text-status-ok">
                {t("businessOS.register.variance")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StaffPanel() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-obsidian-border pb-3">
        <p className="text-sm font-semibold text-obsidian-text">{t("businessOS.staff.title")}</p>
        <span className="text-xs text-obsidian-muted">
          {t("businessOS.staff.commission")} · {t("businessOS.staff.payout")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STAFF_LIST.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-3 rounded-lg border border-obsidian-border bg-obsidian-raised px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-obsidian-text">{s.name}</p>
              <p className="mt-0.5 truncate text-xs text-obsidian-muted">{s.role}</p>
              <p className="mt-1.5 text-xs tabular-nums text-brass">
                {s.commission} · {s.payout}
              </p>
            </div>
            <StatusPill statusKey={s.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

function CrmPanel() {
  const { t } = useTranslation();
  return (
    <div>
      <div className="mb-4 flex items-center justify-between border-b border-obsidian-border pb-3">
        <p className="text-sm font-semibold text-obsidian-text">{t("businessOS.crm.title")}</p>
        <span className="font-mono text-xs text-brass">Telegram CRM</span>
      </div>

      <div className="space-y-2.5">
        {CUSTOMERS.map((c) => (
          <div
            key={c.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-obsidian-border bg-obsidian-raised px-4 py-3"
          >
            <div>
              <p className="text-xs font-semibold text-obsidian-text">{c.name}</p>
              <p className="mt-0.5 text-xs tabular-nums text-obsidian-muted">
                {c.visits} {t("businessOS.crm.visits")} · {t("businessOS.crm.last")} {c.last}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {c.overdue && (
                <span className="shrink-0 whitespace-nowrap rounded-md bg-brass-wash px-2.5 py-1 text-xs font-medium text-brass">
                  {t("businessOS.crm.winBackSent")}
                </span>
              )}
              <TagPill tagKey={c.tag} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const PANELS: Record<TabKey, React.ComponentType> = {
  bookings: BookingsPanel,
  queue: QueuePanel,
  register: RegisterPanel,
  staff: StaffPanel,
  crm: CrmPanel,
};

export function BusinessOS() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const [active, setActive] = useState<TabKey>("bookings");
  const ActivePanel = PANELS[active];

  return (
    <section
      id="for-business"
      className="border-b border-obsidian-border bg-obsidian text-obsidian-text"
    >
      <div className="relative mx-auto max-w-[1200px] border-x border-white/[0.06]">
        <Crosshair dark position="tl" />
        <Crosshair dark position="tr" />
        <Crosshair dark position="bl" />
        <Crosshair dark position="br" />

        {/* Header Row */}
        <div className="border-b border-white/[0.08] p-8 lg:p-12">
          <span className="font-mono text-xs text-brass">[03 / WORKSPACE]</span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.025em] text-obsidian-text sm:text-4xl">
            {t("businessOS.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-obsidian-muted">
            {t("businessOS.subtitle")}
          </p>
        </div>

        {/* Flush 5-Tab Bar */}
        <div
          role="tablist"
          aria-label={t("businessOS.eyebrow")}
          className="grid grid-cols-2 border-b border-white/[0.08] sm:grid-cols-5"
        >
          {TABS.map((tab) => {
            const isActive = active === tab.key;
            return (
              <button
                key={tab.key}
                id={`tab-${tab.key}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.key}`}
                onClick={() => setActive(tab.key)}
                className={`relative flex items-center gap-2.5 border-b border-r border-white/[0.06] px-4 py-3.5 text-left text-xs font-medium transition-colors last:border-r-0 sm:border-b-0 sm:px-5 sm:py-4 ${
                  isActive
                    ? "bg-obsidian-surface text-obsidian-text"
                    : "bg-obsidian text-obsidian-muted hover:bg-obsidian-surface/50 hover:text-obsidian-text"
                }`}
              >
                {isActive && (
                  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-brass" />
                )}
                <span
                  className={`font-mono text-xs tabular-nums ${
                    isActive ? "text-brass" : "text-obsidian-faint"
                  }`}
                >
                  {tab.num}
                </span>
                <tab.icon
                  size={15}
                  strokeWidth={1.6}
                  className={`shrink-0 ${isActive ? "text-brass" : "text-obsidian-faint"}`}
                />
                <span className="leading-snug">{t(`businessOS.tabs.${tab.key}`)}</span>
              </button>
            );
          })}
        </div>

        {/* Workspace Panel */}
        <div
          id={`panel-${active}`}
          role="tabpanel"
          aria-labelledby={`tab-${active}`}
          className="bg-obsidian-surface p-6 sm:p-8"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] px-6 py-5 sm:px-8">
          <span className="font-mono text-xs text-obsidian-muted">
            {t("businessOS.eyebrow")} · UZ · RU · EN
          </span>
          <button
            type="button"
            onClick={openPartnerModal}
            className="btn-brass press-spring group inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium"
          >
            {t("businessOS.cta")}
            <ArrowRight
              size={15}
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
