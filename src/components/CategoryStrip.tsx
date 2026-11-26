import { useTranslation } from "react-i18next";
import {
  Droplet,
  Eye,
  Flower2,
  Hand,
  Paintbrush,
  Scissors,
  Sparkle,
  Wind,
} from "lucide-react";

const CATEGORIES = [
  { icon: Scissors, key: "barber" },
  { icon: Wind, key: "hair" },
  { icon: Hand, key: "nails" },
  { icon: Flower2, key: "massage" },
  { icon: Droplet, key: "spa" },
  { icon: Sparkle, key: "cosmetology" },
  { icon: Paintbrush, key: "makeup" },
  { icon: Eye, key: "browsLashes" },
] as const;

export function CategoryStrip() {
  const { t } = useTranslation();
  const ecoRaw = t("ecosystem.items", { returnObjects: true });
  const ecoItems = Array.isArray(ecoRaw) ? (ecoRaw as string[]) : [];

  return (
    <section className="mx-auto max-w-[1160px] px-6 py-8 lg:px-8">
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="py-7">
        {/* Subtle Ecosystem Capabilities Row */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 pb-6">
          <span className="text-[13px] font-medium text-text-muted">
            {t("ecosystem.label")}
          </span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            {ecoItems.map((item) => (
              <span key={item} className="text-xs text-text-muted">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* 8 Grooming & Wellness Verticals */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center gap-2 text-sm text-text-secondary"
            >
              <cat.icon
                size={15}
                strokeWidth={1.5}
                className="shrink-0 text-text-muted"
              />
              <span className="whitespace-nowrap">{t(`categories.${cat.key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </section>
  );
}
