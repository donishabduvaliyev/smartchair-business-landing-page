import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

interface QuoteItem {
  name: string;
  role: string;
  quote: string;
}

export function Testimonials() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const quotes = (t("testimonials.quotes", { returnObjects: true }) as QuoteItem[]) || [];

  return (
    <section id="reviews" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1160px] px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        >
          <p className="text-[13px] font-medium text-text-muted">
            {t("testimonials.eyebrow")}
          </p>
          <h2 className="mt-2.5 max-w-[26ch] text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {Array.isArray(quotes) &&
            quotes.map((q, i) => {
              const initial = q.name?.trim().charAt(0).toUpperCase() || "S";
              return (
                <motion.div
                  key={q.name || i}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.28,
                    delay: reducedMotion ? 0 : i * 0.05,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="surface-card flex flex-col justify-between rounded-[20px] p-7"
                >
                  <p className="text-sm leading-[1.65] tracking-[0.005em] text-text-secondary">
                    {q.quote}
                  </p>

                  <div className="mt-7 flex items-center gap-3 border-t border-white/[0.06] pt-5">
                    <span
                      aria-hidden="true"
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xs font-medium text-text"
                    >
                      {initial}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text">{q.name}</p>
                      <p className="mt-0.5 text-xs text-text-muted">{q.role}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </section>
  );
}
