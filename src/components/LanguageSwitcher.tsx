import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";

const LANGS = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
] as const;

export function LanguageSwitcher({
  className,
  tone = "light",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const { i18n, t } = useTranslation();
  const current = LANGS.find((l) => i18n.language?.startsWith(l.code))?.code ?? "en";

  const isDark = tone === "dark";

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 transition-colors",
        isDark
          ? "border-obsidian-border bg-obsidian-surface"
          : "border-grid bg-paper-subtle",
        className
      )}
    >
      {LANGS.map((lang) => {
        const isActive = current === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => i18n.changeLanguage(lang.code)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              isActive
                ? isDark
                  ? "border border-obsidian-border bg-obsidian-raised text-obsidian-text"
                  : "border border-grid bg-surface text-ink"
                : isDark
                  ? "border border-transparent text-obsidian-muted hover:text-obsidian-text"
                  : "border border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {t(`lang.${lang.code}`, lang.label)}
          </button>
        );
      })}
    </div>
  );
}
