import { cn } from "../lib/utils";

// Recreates the SmartChair grid mark: a 2x2 grid of rounded squares with the
// top-right square highlighted gold — the booking calendar's "open slot".
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", className)}
    >
      <rect x="2" y="2" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
      <rect x="26" y="2" width="20" height="20" rx="7" fill="var(--color-accent)" />
      <rect x="2" y="26" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
      <rect x="26" y="26" width="20" height="20" rx="7" stroke="currentColor" strokeWidth="4" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span className="h-8 w-8 text-text sm:h-9 sm:w-9">
        <LogoMark />
      </span>
      <span className="font-serif text-lg font-bold tracking-tight text-text sm:text-xl">
        SmartChair
      </span>
    </span>
  );
}
