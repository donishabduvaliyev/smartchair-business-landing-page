import { cn } from "../lib/utils";

// Recreates the SmartChair grid mark: a 2x2 grid of rounded squares with the
// top-right square highlighted in champagne brass — the booking calendar's "open slot".
export function LogoMark({
  className,
  "aria-label": ariaLabel,
}: {
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
      aria-hidden={ariaLabel ? undefined : "true"}
      aria-label={ariaLabel}
      role={ariaLabel ? "img" : undefined}
    >
      <rect x="2" y="2" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
      <rect x="26" y="2" width="20" height="20" rx="7" fill="#d4af5a" />
      <rect x="2" y="26" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
      <rect x="26" y="26" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function Logo({
  className,
  tone: _tone,
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  void _tone;
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap", className)}>
      <span className="h-7 w-7 shrink-0 text-text sm:h-8 sm:w-8">
        <LogoMark />
      </span>
      <span className="font-sans text-[17px] font-medium tracking-[-0.02em] text-text sm:text-lg">
        SmartChair
      </span>
    </span>
  );
}
