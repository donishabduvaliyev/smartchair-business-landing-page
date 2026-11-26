import type { ReactNode } from "react";

/**
 * Splits a section heading and sets the final 1–2 words in italic editorial
 * serif (`Cormorant Garamond`) while keeping `"SmartChair"` in upright sans.
 */
export function renderEditorialHeading(
  raw: string,
  accentTone: "text" | "accent" = "text"
): ReactNode {
  const trimmed = raw.trim();
  if (!trimmed) return raw;

  const words = trimmed.split(/\s+/);
  if (words.length <= 1) return trimmed;

  const accentCount =
    words.length > 2 && words[words.length - 2] === "SmartChair"
      ? 1
      : Math.min(2, Math.max(1, words.length - 1));

  const lead = words.slice(0, -accentCount).join(" ");
  const tail = words.slice(-accentCount).join(" ");
  const accentClass =
    accentTone === "accent"
      ? "font-editorial italic font-normal text-[1.12em] text-accent"
      : "font-editorial italic font-normal text-[1.12em] text-text";

  return (
    <>
      {lead ? `${lead} ` : ""}
      <span className={accentClass}>{tail}</span>
    </>
  );
}
