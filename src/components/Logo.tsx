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
      <rect x="26" y="2" width="20" height="20" rx="7" fill="var(--color-brass)" />
      <rect x="2" y="26" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
      <rect x="26" y="26" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function Logo({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const textColor = tone === "dark" ? "text-obsidian-text" : "text-ink";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className={cn("h-8 w-8 sm:h-9 sm:w-9", textColor)}>
        <LogoMark />
      </span>
      <span className={cn("font-sans text-lg font-semibold tracking-tight sm:text-xl", textColor)}>
        SmartChair
      </span>
    </span>
  );
}
