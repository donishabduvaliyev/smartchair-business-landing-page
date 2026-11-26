import { Check, MapPin, MessageSquare, QrCode, Receipt, Users } from "lucide-react";
import { useTranslation } from "react-i18next";
import { renderEditorialHeading } from "../lib/editorial";

type FeatureRow = {
  eyebrow: string;
  title: string;
  desc: string;
  bullets: string[];
};

function BookingVisual() {
  const slots = ["14:00", "15:30", "16:00", "17:00"];
  return (
    <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
      <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-surface-3 text-text-secondary">
            <MapPin size={15} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-text">Top Blade Barbershop</p>
            <p className="truncate text-xs text-text-muted">Namangan · Chorsu · 0.4 km</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md bg-surface-3 px-2.5 py-1 text-xs font-medium text-ok">
          Open
        </span>
      </div>

      <div className="mt-3.5 rounded-[10px] border border-hairline bg-surface-1 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-text">Haircut + Beard</span>
          <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-text">
            110,000 UZS
          </span>
        </div>
        <p className="mt-1 text-xs text-text-muted">Aziz Karimov · 60 min</p>
      </div>

      <div className="mt-3.5 grid grid-cols-4 gap-2">
        {slots.map((time) => {
          const active = time === "16:00";
          return (
            <div
              key={time}
              className={`flex items-center justify-center gap-1.5 rounded-[10px] border py-2 font-mono text-xs font-medium tabular-nums ${
                active
                  ? "border-accent/40 bg-accent-soft text-accent"
                  : "border-hairline bg-surface-1 text-text-muted"
              }`}
            >
              {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              <span>{time}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-3.5 flex items-center justify-between rounded-[10px] border border-hairline bg-surface-1 px-3.5 py-2.5">
        <span className="text-xs text-text-secondary">Telegram · 1-tap slot lock</span>
        <span className="font-mono text-xs font-medium tabular-nums text-text">
          16:00
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
      tone: "bg-surface-3 text-ok border-hairline",
    },
    {
      id: "#A-14",
      source: "Walk-In QR",
      master: "Aziz",
      state: "~8 min",
      tone: "bg-accent-soft text-accent border-accent/30",
    },
    {
      id: "#A-15",
      source: "Walk-In QR",
      master: "Sardor",
      state: "~18 min",
      tone: "bg-surface-2 text-text-muted border-hairline",
    },
  ];

  return (
    <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
      <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-surface-3 text-text-secondary">
            <QrCode size={15} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-text">Reception Walk-In Queue</p>
            <p className="truncate text-xs text-text-muted">QR stand · Synced with schedule</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md bg-surface-3 px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-text-secondary">
          3 active
        </span>
      </div>

      <div className="mt-3.5 space-y-2">
        {tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="flex items-center justify-between gap-2 rounded-[10px] border border-hairline bg-surface-1 px-3.5 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span className="font-mono text-xs font-medium tabular-nums text-text">
                {ticket.id}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-text">{ticket.master}</p>
                <p className="truncate text-xs text-text-muted">{ticket.source}</p>
              </div>
            </div>
            <span
              className={`shrink-0 whitespace-nowrap rounded-md border px-2.5 py-1 font-mono text-xs font-medium tabular-nums ${ticket.tone}`}
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
    <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
      <div className="flex items-center justify-between gap-3 border-b border-hairline pb-3.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-surface-3 text-text-secondary">
            <Receipt size={15} strokeWidth={1.5} />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-text">Register #01 · Z-Report</p>
            <p className="truncate text-xs text-text-muted">Shift close reconciliation</p>
          </div>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-md border border-accent/30 bg-accent-soft px-2.5 py-1 font-mono text-xs font-medium tabular-nums text-accent">
          0 UZS balanced
        </span>
      </div>

      <div className="mt-3.5 rounded-[10px] border border-hairline bg-surface-1 p-3.5">
        <p className="text-xs text-text-muted">Total shift revenue</p>
        <p className="mt-1 font-mono text-xl font-medium tabular-nums text-text">
          2,450,000 UZS
        </p>
      </div>

      <div className="mt-2.5 space-y-2">
        {tenders.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between rounded-[10px] border border-hairline bg-surface-1 px-3.5 py-2"
          >
            <span className="text-xs text-text-secondary">{row.label}</span>
            <span className="font-mono text-xs font-medium tabular-nums text-text">
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
    <div className="mt-6 rounded-xl border border-hairline bg-surface-2 p-4">
      <div className="flex items-center justify-between border-b border-hairline pb-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-hairline bg-surface-3 text-text-secondary">
            <Users size={15} strokeWidth={1.5} />
          </span>
          <p className="text-xs font-medium text-text">Daily Commission Ledger</p>
        </div>
        <span className="font-mono text-xs text-text-muted">Today</span>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {staff.map((s) => (
          <div
            key={s.name}
            className="flex items-center justify-between gap-2 rounded-[10px] border border-hairline bg-surface-1 px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-text">{s.name}</p>
              <p className="text-xs tabular-nums text-text-muted">Commission {s.rate}</p>
            </div>
            <span className="shrink-0 font-mono text-xs font-medium tabular-nums text-text">
              {s.payout}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-3 rounded-[10px] border border-hairline bg-surface-1 p-3.5">
        <div className="flex items-center gap-2 text-xs font-medium text-accent">
          <MessageSquare size={14} strokeWidth={1.6} />
          <span>Telegram Win-Back · Overdue 32d</span>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-text-secondary">
          &ldquo;Salom, Ali! It has been 32 days since your last visit with Aziz. Tap below to
          pick a slot this week.&rdquo;
        </p>
      </div>
    </div>
  );
}

function FeatureCellHeader({ row }: { row?: FeatureRow }) {
  if (!row) return null;
  return (
    <>
      <span className="text-[13px] font-medium text-text-muted">{row.eyebrow}</span>
      <h3 className="mt-2 text-lg font-medium tracking-[-0.015em] text-text">
        {row.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{row.desc}</p>
      <ul className="mt-4 space-y-2">
        {row.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-2.5 text-sm text-text-secondary">
            <Check size={15} strokeWidth={1.75} className="mt-0.5 shrink-0 text-text-muted" />
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
    <section id="features" className="mx-auto max-w-[1160px] px-6 py-24 lg:px-8 lg:py-32">
      <div>
        <p className="text-[13px] font-medium text-text-muted">{t("features.eyebrow")}</p>
        <h2 className="mt-2.5 max-w-[26ch] text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
          {renderEditorialHeading(t("features.title"))}
        </h2>
        <p className="mt-3.5 max-w-[54ch] text-base leading-[1.6] text-text-secondary">
          {t("features.subtitle")}
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="specular-card flex flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:p-7 lg:col-span-7">
          <div>
            <div className="relative -mx-6 -mt-6 mb-6 h-44 overflow-hidden sm:-mx-7 sm:-mt-7 sm:h-48">
              <img
                src="/images/craft-shears.webp"
                alt="Handcrafted steel barber shears on dark honed slate"
                width={1376}
                height={768}
                loading="lazy"
                className="h-full w-full object-cover opacity-85"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/35 to-transparent" />
            </div>
            <FeatureCellHeader row={rows[0]} />
          </div>
          <BookingVisual />
        </div>

        <div className="specular-card flex flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:p-7 lg:col-span-5">
          <div>
            <FeatureCellHeader row={rows[1]} />
          </div>
          <WalkInQueueVisual />
        </div>

        <div className="specular-card flex flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:p-7 lg:col-span-5">
          <div>
            <FeatureCellHeader row={rows[2]} />
          </div>
          <CashierRegisterVisual />
        </div>

        <div className="specular-card flex flex-col justify-between overflow-hidden rounded-[20px] p-6 sm:p-7 lg:col-span-7">
          <div>
            <div className="relative -mx-6 -mt-6 mb-6 h-44 overflow-hidden sm:-mx-7 sm:-mt-7 sm:h-48">
              <img
                src="/images/salon-sanctuary.webp"
                alt="Minimalist luxury salon reception counter in warm chiaroscuro light"
                width={1376}
                height={768}
                loading="lazy"
                className="h-full w-full object-cover opacity-85"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0e11] via-[#0d0e11]/35 to-transparent" />
            </div>
            <FeatureCellHeader row={rows[3]} />
          </div>
          <StaffPayrollCrmVisual />
        </div>
      </div>
    </section>
  );
}
