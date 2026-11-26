import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BlueprintFrame } from "./BlueprintGrid";

interface HowItWorksStep {
  num: string;
  title: string;
  desc: string;
}

interface SlaLedgerItem {
  value: string;
  label: string;
}

export function HowItWorks() {
  const { t } = useTranslation();
  const steps = (t("howItWorks.steps", { returnObjects: true }) as HowItWorksStep[]) || [];
  const slaItems =
    (t("howItWorks.slaLedger.items", { returnObjects: true }) as SlaLedgerItem[]) || [];

  return (
    <section id="how-it-works" className="bg-paper border-b border-grid">
      <BlueprintFrame>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="p-8 lg:p-12 border-b border-grid"
        >
          <span className="font-mono text-xs uppercase tracking-wider text-brass-ink">
            [04 / ONBOARDING]
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
            {t("howItWorks.title")}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* Flush 3-Column Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-grid border-b border-grid">
          {Array.isArray(steps) &&
            steps.map((step, i) => (
              <motion.div
                key={step.num || i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="p-8 lg:p-10"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-ink-faint">
                    STEP {step.num}
                  </span>
                  <span className="font-serif text-3xl italic leading-none text-brass-ink">
                    {step.num}
                  </span>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-muted">{step.desc}</p>
              </motion.div>
            ))}
        </div>

        {/* 4-Cell Architectural SLA & Terms Ledger */}
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-grid bg-paper-subtle">
          {Array.isArray(slaItems) &&
            slaItems.map((item, idx) => (
              <div key={idx} className="p-6 lg:p-8">
                <p className="font-mono text-2xl font-medium tabular-nums text-ink">
                  {item.value}
                </p>
                <p className="mt-1.5 text-xs text-ink-muted">{item.label}</p>
              </div>
            ))}
        </div>
      </BlueprintFrame>
    </section>
  );
}
