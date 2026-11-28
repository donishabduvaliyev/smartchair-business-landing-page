import { useTranslation } from "react-i18next";
import { cn } from "../lib/utils";
import { normalizeLang, type LangCode } from "../content/storyContent";

const LANGS: { code: LangCode; label: string }[] = [
  { code: "uz", label: "UZ" },
  { code: "ru", label: "RU" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const { i18n, t } = useTranslation();
  const current = normalizeLang(i18n.language);
  const isLight = tone === "light";

  const handleSelect = (code: LangCode) => {
    i18n.changeLanguage(code);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("lang", code);
      window.history.replaceState({}, "", url.pathname + url.search + url.hash);
    }
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border p-0.5 transition-colors",
        isLight
          ? "border-[#8C6D46]/25 bg-[#EFE7D8]/80"
          : "border-hairline bg-surface-1",
        className
      )}
    >
      {LANGS.map((lang) => {
        const isActive = current === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => handleSelect(lang.code)}
            aria-pressed={isActive}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
              isLight
                ? isActive
                  ? "bg-[#1C1917] text-[#F5EFE6]"
                  : "text-[#1C1917]/65 hover:text-[#1C1917]"
                : isActive
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
