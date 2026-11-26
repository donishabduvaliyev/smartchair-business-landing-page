import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";

const LANGS = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
] as const;

export function LanguageSwitcher({
  className,
  tone: _tone,
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  void _tone;
  const { i18n, t } = useTranslation();
  const current = LANGS.find((l) => i18n.language?.startsWith(l.code))?.code ?? "en";

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border border-hairline bg-surface-1 p-0.5",
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
                ? "bg-surface-3 text-text"
                : "text-text-secondary hover:text-text"
            )}
          >
            {t(`lang.${lang.code}`, lang.label)}
          </button>
        );
      })}
    </div>
  );
}
