import { motion, useReducedMotion } from "framer-motion";
import { CalendarCheck2, FileText, SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";

interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
}

interface SlaLedgerItem {
  value: string;
  label: string;
}

const STEP_ICONS = [FileText, SlidersHorizontal, CalendarCheck2] as const;

export function HowItWorks() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const steps = (t("howItWorks.steps", { returnObjects: true }) as HowItWorksStep[]) || [];
  const slaItems =
    (t("howItWorks.slaLedger.items", { returnObjects: true }) as SlaLedgerItem[]) || [];

  return (
    <section id="how-it-works" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1160px] px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-[13px] font-medium text-text-muted">
            {t("howItWorks.eyebrow")}
          </p>
          <h2 className="mt-2.5 max-w-[26ch] text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
            {t("howItWorks.title")}
          </h2>
          <p className="mt-3.5 max-w-[54ch] text-base leading-[1.6] tracking-[0.005em] text-text-secondary [text-wrap:pretty]">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {Array.isArray(steps) &&
            steps.map((step, i) => {
              const Icon = STEP_ICONS[i % STEP_ICONS.length];
              return (
                <motion.div
                  key={step.num || i}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.28,
                    delay: reducedMotion ? 0 : i * 0.05,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="surface-card rounded-[20px] p-7"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-surface-2 text-text-secondary">
                      <Icon size={18} strokeWidth={1.5} />
                    </span>
                    <span className="font-mono text-xs tabular-nums text-text-muted">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="mt-6 text-lg font-medium leading-[1.35] tracking-[-0.015em] text-text">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-[1.6] tracking-[0.005em] text-text-secondary">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
        </div>

        <div className="surface-card mt-5 grid grid-cols-2 gap-6 rounded-[20px] p-6 sm:p-7 lg:grid-cols-4">
          {Array.isArray(slaItems) &&
            slaItems.map((item, idx) => (
              <div key={idx}>
                <p className="font-mono text-2xl font-medium tabular-nums text-text">
                  {item.value}
                </p>
                <p className="mt-1.5 text-xs text-text-muted">{item.label}</p>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
