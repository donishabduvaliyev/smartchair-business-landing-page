import type { ReactNode } from "react";
import { cn } from "../lib/utils";

export function BlueprintFrame({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("relative mx-auto max-w-[1200px] border-x border-grid", className)}>
      {children}
    </div>
  );
}

const POSITION_CLASSES = {
  tl: "-top-[5px] -left-[5px]",
  tr: "-top-[5px] -right-[5px]",
  bl: "-bottom-[5px] -left-[5px]",
  br: "-bottom-[5px] -right-[5px]",
} as const;

export function Crosshair({
  position = "tl",
  dark = false,
}: {
  position?: "tl" | "tr" | "bl" | "br";
  dark?: boolean;
}) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10",
        POSITION_CLASSES[position],
        dark ? "text-obsidian-border" : "text-grid-strong"
      )}
    >
      <path d="M5 0V10M0 5H10" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}
