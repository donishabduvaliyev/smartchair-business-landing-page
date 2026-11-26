import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { renderEditorialHeading } from "../lib/editorial";

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
            {renderEditorialHeading(t("howItWorks.title"))}
          </h2>
          <p className="mt-3.5 max-w-[54ch] text-base leading-[1.6] tracking-[0.005em] text-text-secondary [text-wrap:pretty]">
            {t("howItWorks.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-0 md:divide-x md:divide-white/[0.06]">
          {Array.isArray(steps) &&
            steps.map((step, i) => (
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
                className="md:px-10 first:md:pl-0 last:md:pr-0"
              >
                <span className="block select-none font-editorial italic text-[56px] font-normal leading-none text-accent/85 sm:text-[68px]">
                  {step.num}
                </span>
                <h3 className="mt-6 text-xl font-medium leading-[1.35] tracking-[-0.015em] text-text">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-[1.7] tracking-[0.005em] text-text-secondary">
                  {step.desc}
                </p>
              </motion.div>
            ))}
        </div>

        <div className="mt-16 grid grid-cols-2 gap-8 border-y border-white/[0.07] py-8 lg:grid-cols-4">
          {Array.isArray(slaItems) &&
            slaItems.map((item, idx) => (
              <div key={idx}>
                <p className="font-editorial text-3xl font-medium tracking-tight text-text sm:text-4xl">
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
