import { useTranslation } from "react-i18next";

export function PanelChrome({ label, live = true }: { label: string; live?: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="mb-5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-surface-3">
          <span className="h-2 w-2 rounded-sm bg-accent" />
        </span>
        <span className="text-xs font-semibold text-text">{label}</span>
        {live && (
          <span className="flex items-center gap-1 rounded-full bg-success/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-success">
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-success" />
            {t("heroMockup.live")}
          </span>
        )}
      </div>
      <div className="flex gap-1.5">
        <span className="h-2 w-2 rounded-full bg-danger/60" />
        <span className="h-2 w-2 rounded-full bg-warning/60" />
        <span className="h-2 w-2 rounded-full bg-success/60" />
      </div>
    </div>
  );
}

export function DotGrid({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-dot-grid pointer-events-none absolute inset-0 text-accent opacity-[0.06] ${className}`}
    />
  );
}
