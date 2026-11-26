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
import { BlueprintFrame } from "./BlueprintGrid";

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
    <section className="border-b border-grid bg-paper">
      <BlueprintFrame>
        {/* Top Row: Ecosystem Capabilities */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-grid px-6 py-4 lg:px-10">
          <span className="font-mono text-xs text-ink-faint">[01 / ECOSYSTEM]</span>
          <div className="flex flex-wrap items-center divide-x divide-grid">
            {ecoItems.map((item) => (
              <span
                key={item}
                className="px-3 py-0.5 text-xs font-medium text-ink-muted first:pl-0 last:pr-0"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Row: 8 Grooming & Wellness Categories */}
        <div className="grid grid-cols-2 divide-x divide-y divide-grid sm:grid-cols-4 lg:grid-cols-8 lg:divide-y-0">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center gap-2.5 px-4 py-4 text-xs font-medium text-ink-muted"
            >
              <cat.icon size={15} strokeWidth={1.5} className="shrink-0 text-brass-ink" />
              <span className="truncate">{t(`categories.${cat.key}`)}</span>
            </div>
          ))}
        </div>
      </BlueprintFrame>
    </section>
  );
}
