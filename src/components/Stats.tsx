import type { RefObject } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCountUp } from "../hooks/useCountUp";
import { DotGrid, PanelChrome } from "./PanelChrome";

// Placeholder launch numbers — swap for real figures once you have them.
const STATS = [
  { value: 30, suffix: "+", key: "businesses", isDecimal: false },
  { value: 2000, suffix: "+", key: "bookings", isDecimal: false },
  { value: 10, suffix: "+", key: "categories", isDecimal: false },
  { value: 49, suffix: "", key: "rating", isDecimal: true },
] as const;

function StatItem({
  value,
  suffix,
  label,
  isDecimal,
}: {
  value: number;
  suffix: string;
  label: string;
  isDecimal?: boolean;
}) {
  const { ref, value: animated } = useCountUp(value);
  const display = isDecimal ? (animated / 10).toFixed(1) : animated.toLocaleString();

  return (
    <div className="text-center">
      <p
        ref={ref as RefObject<HTMLParagraphElement>}
        className="font-display text-4xl font-extrabold text-gradient-gold sm:text-5xl"
      >
        {display}
        {suffix}
      </p>
      <p className="mt-2 text-sm text-text-muted">{label}</p>
    </div>
  );
}

export function Stats() {
  const { t } = useTranslation();

  return (
    <section className="relative py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="card-glass relative overflow-hidden rounded-[32px] px-8 py-10"
        >
          <DotGrid />
          <div className="relative">
            <PanelChrome label={t("stats.panelLabel")} />
            <div className="grid grid-cols-2 gap-10 pt-2 sm:grid-cols-4">
              {STATS.map((s) => (
                <StatItem
                  key={s.key}
                  value={s.value}
                  suffix={s.suffix}
                  isDecimal={s.isDecimal}
                  label={t(`stats.${s.key}`)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
