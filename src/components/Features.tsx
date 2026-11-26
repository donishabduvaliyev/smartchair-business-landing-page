import { Check, MapPin, MessageSquare, QrCode, Receipt, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { BlueprintFrame, Crosshair } from "./BlueprintGrid";

type FeatureRow = {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
};

function BookingVisual() {
  const slots = ["14:00", "15:30", "16:00", "17:00"];
  return (
    <div className="mt-7 rounded-xl border border-grid bg-paper-subtle p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-grid pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-grid bg-surface text-brass-ink">
            <MapPin size={15} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">Top Blade Barbershop</p>
            <p className="truncate text-xs text-ink-muted">Namangan · Chorsu · 0.4 km</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md border border-grid bg-surface px-2.5 py-1 text-xs font-medium text-status-ok-ink">
          Open
        </span>
      </div>

      <div className="mt-3.5 rounded-lg border border-grid bg-surface p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-ink">Haircut + Beard</span>
          <span className="shrink-0 text-xs font-semibold tabular-nums text-ink">
            110,000 UZS
          </span>
        </div>
        <p className="mt-1 text-xs text-ink-muted">Aziz Karimov · 60 min</p>
      </div>

      <div className="mt-3.5">
        <div className="grid grid-cols-4 gap-2">
          {slots.map((time) => {
            const active = time === "16:00";
            return (
              <div
                key={time}
                className={`flex items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-semibold tabular-nums ${
                  active
                    ? "border-obsidian bg-obsidian text-obsidian-text"
                    : "border-grid bg-surface text-ink-muted"
                }`}
              >
                {active && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
                <span>{time}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3.5 flex items-center justify-between rounded-lg bg-obsidian px-3.5 py-2.5 text-obsidian-text">
        <span className="text-xs text-obsidian-muted">Telegram · 1-tap slot lock</span>
        <span className="font-mono text-xs font-medium tabular-nums text-brass">
          Locked 16:00
        </span>
      </div>
    </div>
  );
}

function WalkInQueueVisual() {
  const tickets = [
    {
      id: "#B-09",
      source: "Telegram",
      master: "Bekzod",
      state: "In chair",
      tone: "border-grid bg-surface text-status-ok-ink",
    },
    {
      id: "#A-14",
      source: "Walk-In QR",
      master: "Aziz",
      state: "~8 min",
      tone: "border-brass/30 bg-brass-wash text-brass-ink",
    },
    {
      id: "#A-15",
      source: "Walk-In QR",
      master: "Sardor",
      state: "~18 min",
      tone: "border-grid bg-paper-subtle text-ink-muted",
    },
  ];

  return (
    <div className="mt-7 rounded-xl border border-grid bg-paper-subtle p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-grid pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-grid bg-surface text-brass-ink">
            <QrCode size={15} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-ink">Reception Walk-In Queue</p>
            <p className="truncate text-xs text-ink-muted">QR stand · Synced with schedule</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md border border-grid bg-surface px-2.5 py-1 text-xs font-medium tabular-nums text-ink-muted">
          3 active
        </span>
      </div>

      <div className="mt-3.5 space-y-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-grid bg-surface px-3.5 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-mono text-xs font-semibold tabular-nums text-ink">
                {ticket.id}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-ink">{ticket.master}</p>
                <p className="truncate text-xs text-ink-muted">{ticket.source}</p>
              </div>
            </div>
            <span
              className={`shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1 text-xs font-medium tabular-nums ${ticket.tone}`}
            >
              {ticket.state}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CashierRegisterVisual() {
  const tenders = [
    { label: "Cash (Naqd)", amount: "920,000 UZS" },
    { label: "Click", amount: "640,000 UZS" },
    { label: "Payme", amount: "890,000 UZS" },
  ];

  return (
    <div className="mt-7 rounded-xl border border-obsidian-border bg-obsidian-surface p-4 text-obsidian-text sm:p-5">
      <div className="flex items-center justify-between gap-3 border-b border-obsidian-border pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-obsidian-border bg-obsidian-raised text-brass">
            <Receipt size={15} strokeWidth={1.75} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-obsidian-text">
              Register #01 · Z-Report
            </p>
            <p className="truncate text-xs text-obsidian-muted">Shift close reconciliation</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md bg-status-ok/15 px-2.5 py-1 text-xs font-medium tabular-nums text-status-ok">
          0 UZS variance
        </span>
      </div>

      <div className="mt-3.5 rounded-lg border border-obsidian-border bg-obsidian-raised p-3.5">
        <p className="text-xs text-obsidian-muted">Total shift revenue</p>
        <p className="mt-1 text-xl font-semibold tabular-nums text-obsidian-text">
          2,450,000 UZS
        </p>
      </div>

      <div className="mt-2.5 space-y-2">
        {tenders.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-lg border border-obsidian-border bg-obsidian-raised/60 px-3.5 py-2"
          >
            <span className="text-xs text-obsidian-muted">{row.label}</span>
            <span className="text-xs font-semibold tabular-nums text-obsidian-text">
              {row.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StaffPayrollCrmVisual() {
  const staff = [
    { name: "Aziz Karimov", rate: "50%", payout: "480,000 UZS" },
    { name: "Bekzod Yusupov", rate: "45%", payout: "360,000 UZS" },
  ];

  return (
    <div className="mt-7 rounded-xl border border-grid bg-paper-subtle p-4 sm:p-5">
      <div className="flex items-center justify-between border-b border-grid pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-grid bg-surface text-brass-ink">
            <Users size={15} strokeWidth={1.75} />
          </span>
          <p className="text-xs font-semibold text-ink">Daily Commission Ledger</p>
        </div>
        <span className="font-mono text-xs text-ink-faint">SHIFT TODAY</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {staff.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-2 rounded-lg border border-grid bg-surface px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-ink">{s.name}</p>
              <p className="text-xs tabular-nums text-ink-muted">Commission {s.rate}</p>
            </div>
            <span className="shrink-0 text-xs font-semibold tabular-nums text-brass-ink">
              {s.payout}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-lg border border-grid bg-surface p-3.5">
        <div className="flex items-center gap-2 text-xs font-medium text-brass-ink">
          <MessageSquare size={14} strokeWidth={1.75} />
          <span>Telegram Win-Back · Overdue 32d</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
          &ldquo;Salom, Ali! It has been 32 days since your last visit with Aziz. Tap below to
          pick a slot this week.&rdquo;
        </p>
      </div>
    </div>
  );
}

function FeatureCellContent({
  indexTag,
  row,
}: {
  indexTag: string;
  row?: FeatureRow;
}) {
  if (!row) return null;
  return (
    <>
      <span className="font-mono text-xs font-medium text-brass-ink">{indexTag}</span>
      <h3 className="mt-3 text-xl font-semibold tracking-[-0.02em] text-ink sm:text-2xl">
        {row.title}
      </h3>
      <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{row.desc}</p>
      <ul className="mt-5 space-y-2">
        {row.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-xs text-ink sm:text-sm">
            <Check size={14} strokeWidth={2.25} className="mt-0.5 shrink-0 text-brass-ink" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Features() {
  const { t } = useTranslation();
  const rowsRaw = t("features.rows", { returnObjects: true });
  const rows = Array.isArray(rowsRaw) ? (rowsRaw as FeatureRow[]) : [];

  return (
    <section id="features" className="border-b border-grid bg-paper">
      <BlueprintFrame>
        <Crosshair position="tl" />
        <Crosshair position="tr" />
        <Crosshair position="bl" />
        <Crosshair position="br" />

        {/* Header Cell */}
        <div className="border-b border-grid p-8 lg:p-12">
          <span className="font-mono text-xs text-brass-ink">[02 / ARCHITECTURE]</span>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Flush 12-Column Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Cell 01: 7 cols */}
          <div className="relative border-b border-grid p-8 lg:col-span-7 lg:border-r lg:p-10">
            <Crosshair position="br" />
            <FeatureCellContent indexTag="[01]" row={rows[0]} />
            <BookingVisual />
          </div>

          {/* Cell 02: 5 cols */}
          <div className="relative border-b border-grid p-8 lg:col-span-5 lg:p-10">
            <FeatureCellContent indexTag="[02]" row={rows[1]} />
            <WalkInQueueVisual />
          </div>

          {/* Cell 03: 5 cols */}
          <div className="relative border-b border-grid p-8 lg:col-span-5 lg:border-b-0 lg:border-r lg:p-10">
            <FeatureCellContent indexTag="[03]" row={rows[2]} />
            <CashierRegisterVisual />
          </div>

          {/* Cell 04: 7 cols */}
          <div className="relative p-8 lg:col-span-7 lg:p-10">
            <FeatureCellContent indexTag="[04]" row={rows[3]} />
            <StaffPayrollCrmVisual />
          </div>
        </div>
      </BlueprintFrame>
    </section>
  );
}
