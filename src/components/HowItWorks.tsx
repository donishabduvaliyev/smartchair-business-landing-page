import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { CalendarCheck, MessageCircleMore, Search, Send } from "lucide-react";

const STEP_KEYS = [
  { icon: Send, key: "open" },
  { icon: Search, key: "browse" },
  { icon: CalendarCheck, key: "book" },
  { icon: MessageCircleMore, key: "confirm" },
] as const;

export function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section id="how-it-works" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t("howItWorks.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {t("howItWorks.title")}
          </h2>
          <p className="mt-4 text-lg text-text-muted">{t("howItWorks.subtitle")}</p>
        </motion.div>

        <div className="relative mt-20">
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "left" }}
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-accent via-accent-soft to-info lg:block"
          />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {STEP_KEYS.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
              >
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-surface text-accent shadow-[0_0_30px_rgba(212,175,90,0.12)]">
                  <step.icon size={26} strokeWidth={1.8} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[11px] font-bold text-accent-ink">
                    {i + 1}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-text">
                  {t(`howItWorks.steps.${step.key}.title`)}
                </h3>
                <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-text-muted">
                  {t(`howItWorks.steps.${step.key}.desc`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
