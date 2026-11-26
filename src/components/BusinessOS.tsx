import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const TABS = [
  { key: "bookings", icon: CalendarClock },
  { key: "queue", icon: QrCode },
  { key: "register", icon: Receipt },
  { key: "staff", icon: UsersRound },
  { key: "crm", icon: Users2 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const TIME_LABELS = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

type BookingSegment = { span: number; label?: string; time?: string };
type StaffColumn = { name: string; accent: string; dot: string; segments: BookingSegment[] };

const STAFF_COLUMNS: StaffColumn[] = [
  {
    name: "Aziz",
    accent: "border-l-accent",
    dot: "bg-accent",
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
    accent: "border-l-info",
    dot: "bg-info",
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
    accent: "border-l-ok",
    dot: "bg-ok",
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
      ? "bg-ok/15 text-ok"
      : statusKey === "onBreak"
        ? "bg-warn/15 text-warn"
        : "bg-surface-3 text-text-muted";
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
      ? "bg-accent-soft text-accent"
      : tagKey === "new"
        ? "bg-info/15 text-info"
        : "bg-surface-3 text-text-muted";
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
      <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
        <p className="text-sm font-medium text-text">{t("businessOS.bookings.today")}</p>
        <span className="flex items-center gap-2 font-mono text-xs tabular-nums text-text-muted">
          <span className="h-2 w-2 rounded-full bg-danger" />
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
                <p className="truncate text-xs font-medium text-text">{col.name}</p>
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
                    className="absolute right-2 -translate-y-1/2 font-mono text-xs tabular-nums text-text-muted"
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
                        className={`flex flex-col justify-center overflow-hidden rounded-[10px] border border-hairline border-l-2 ${col.accent} bg-surface-2 px-2.5 py-1`}
                      >
                        <span className="truncate text-xs font-medium text-text">
                          {seg.label}
                        </span>
                        <span className="truncate font-mono text-xs tabular-nums text-text-muted">
                          {seg.time}
                        </span>
                      </div>
                    ) : (
                      <div
                        key={i}
                        style={{ flexGrow: seg.span, flexBasis: 0 }}
                        className="rounded-[10px] border border-dashed border-hairline bg-transparent"
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
              <span className="-ml-1 h-2 w-2 shrink-0 rounded-full bg-danger" />
              <span className="h-px w-full bg-danger/70" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-hairline pt-3 text-xs text-text-muted">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-xs border border-dashed border-text-muted" />
          {t("businessOS.bookings.free")}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-xs border-l-2 border-accent bg-surface-2" />
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <p className="text-sm font-medium text-text">{t("businessOS.queue.title")}</p>
          <p className="text-xs text-text-muted">{t("businessOS.queue.scanHint")}</p>
        </div>
        <div className="flex items-center gap-2.5 font-mono text-xs tabular-nums">
          <span className="rounded-md bg-surface-2 px-3 py-1 text-text-secondary">
            {t("businessOS.queue.waiting")}: 3
          </span>
          <span className="rounded-md bg-accent-soft px-3 py-1 text-accent">
            {t("businessOS.queue.avgWait")}: 12 min
          </span>
        </div>
      </div>

      <div className="space-y-2.5">
        {QUEUE_TICKETS.map((item) => (
          <div
            key={item.ticket}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="rounded-md border border-hairline bg-surface-1 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-accent">
                {item.ticket}
              </span>
              <div>
                <p className="text-xs font-medium text-text">
                  {item.client} · {item.service}
                </p>
                <p className="text-xs text-text-muted">{item.master}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs tabular-nums text-text-muted">{item.time}</span>
              <span
                className={`shrink-0 whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium ${
                  item.state === "inChair"
                    ? "bg-ok/15 text-ok"
                    : "bg-surface-3 text-text-muted"
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <p className="text-sm font-medium text-text">{t("businessOS.register.title")}</p>
        <span className="shrink-0 whitespace-nowrap rounded-md bg-ok/15 px-3 py-1 text-xs font-medium text-ok">
          {t("businessOS.register.open")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-hairline bg-surface-2 p-4">
          <p className="text-xs text-text-muted">{t("businessOS.register.total")}</p>
          <p className="mt-1.5 font-mono text-2xl font-medium tabular-nums text-text">
            2,450,000 UZS
          </p>
          <div className="mt-4 space-y-2 border-t border-hairline pt-3">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between text-xs">
                <span className="text-text-secondary">{r.label}</span>
                <span className="font-mono font-medium tabular-nums text-text">{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-xl border border-hairline bg-surface-2 p-4">
          <div>
            <p className="text-sm font-medium text-text">{t("businessOS.register.zReport")}</p>
            <p className="mt-1 font-mono text-xs tabular-nums text-text-muted">
              14 completed receipts · 0 refunds
            </p>
          </div>
          <div className="mt-6 rounded-[10px] border border-hairline bg-surface-1 px-3.5 py-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">Expected cash</span>
              <span className="font-mono tabular-nums text-text">920,000 UZS</span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-text-secondary">Reconciliation</span>
              <span className="font-mono font-medium tabular-nums text-accent">
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-hairline pb-3">
        <p className="text-sm font-medium text-text">{t("businessOS.staff.title")}</p>
        <span className="text-xs text-text-muted">
          {t("businessOS.staff.commission")} · {t("businessOS.staff.payout")}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {STAFF_LIST.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 px-4 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text">{s.name}</p>
              <p className="mt-0.5 truncate text-xs text-text-muted">{s.role}</p>
              <p className="mt-1.5 font-mono text-xs tabular-nums text-text-secondary">
                {s.commission} · <span className="text-text">{s.payout}</span>
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
      <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
        <p className="text-sm font-medium text-text">{t("businessOS.crm.title")}</p>
        <span className="font-mono text-xs text-text-muted">Telegram CRM</span>
      </div>

      <div className="space-y-2.5">
        {CUSTOMERS.map((c) => (
          <div
            key={c.name}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-2 px-4 py-3"
          >
            <div>
              <p className="text-xs font-medium text-text">{c.name}</p>
              <p className="mt-0.5 font-mono text-xs tabular-nums text-text-muted">
                {c.visits} {t("businessOS.crm.visits")} · {t("businessOS.crm.last")} {c.last}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {c.overdue && (
                <span className="shrink-0 whitespace-nowrap rounded-md bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
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
  const reducedMotion = useReducedMotion();
  const ActivePanel = PANELS[active];

  const rawTitle = t("businessOS.title").trim();
  const titleWords = rawTitle.split(/\s+/);
  const accentCount =
    titleWords.length > 2 && titleWords[titleWords.length - 2] === "SmartChair"
      ? 1
      : Math.min(2, Math.max(1, titleWords.length - 1));
  const titleLead = titleWords.slice(0, -accentCount).join(" ");
  const titleEditorial = titleWords.slice(-accentCount).join(" ");

  return (
    <section
      id="for-business"
      className="mx-auto max-w-[1160px] px-6 py-24 lg:px-8 lg:py-32"
    >
      <div>
        <p className="text-[13px] font-medium text-text-muted">{t("businessOS.eyebrow")}</p>
        <h2 className="mt-2.5 max-w-[26ch] text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
          {titleLead ? `${titleLead} ` : ""}
          <span className="font-editorial italic font-normal text-[1.12em] text-text">
            {titleEditorial}
          </span>
        </h2>
        <p className="mt-3.5 max-w-[54ch] text-base leading-[1.6] text-text-secondary">
          {t("businessOS.subtitle")}
        </p>
      </div>

      {/* Compact Segmented Tab Bar */}
      <div
        role="tablist"
        aria-label={t("businessOS.eyebrow")}
        className="mt-10 inline-flex flex-wrap gap-1 rounded-xl border border-hairline bg-surface-1 p-1"
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
              className={`relative inline-flex min-h-[40px] items-center gap-2 rounded-[9px] px-3.5 py-2 text-sm font-medium transition-colors ${
                isActive ? "text-text" : "text-text-muted hover:text-text-secondary"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="business-os-tab"
                  aria-hidden="true"
                  className="absolute inset-0 rounded-[9px] bg-surface-3"
                  transition={
                    reducedMotion
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 400, damping: 32 }
                  }
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <tab.icon
                  size={15}
                  strokeWidth={1.6}
                  className="shrink-0 text-text-secondary"
                />
                <span>{t(`businessOS.tabs.${tab.key}`)}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Workspace Panel */}
      <div
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="specular-card mt-6 rounded-[20px] p-6 sm:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : { duration: 0.18, ease: [0.23, 1, 0.32, 1] }
            }
          >
            <ActivePanel />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Action Row */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-xs text-text-muted">
          {t("businessOS.eyebrow")} · UZ · RU · EN
        </span>
        <button
          type="button"
          onClick={openPartnerModal}
          className="btn-secondary group inline-flex h-10 items-center gap-2 rounded-[10px] px-5 text-sm font-medium"
        >
          {t("businessOS.cta")}
          <ArrowRight
            size={15}
            className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
          />
        </button>
      </div>
    </section>
  );
}
