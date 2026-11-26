import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { renderEditorialHeading } from "../lib/editorial";

interface QuoteItem {
  name: string;
  role: string;
  quote: string;
}

export function Testimonials() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const quotes = (t("testimonials.quotes", { returnObjects: true }) as QuoteItem[]) || [];

  const featureIdx = quotes[1] ? 1 : 0;
  const featured = quotes[featureIdx];
  const secondaryQuotes = quotes.filter((_, idx) => idx !== featureIdx);

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
            {renderEditorialHeading(t("testimonials.title"))}
          </h2>
        </motion.div>

        {Array.isArray(quotes) && quotes.length > 0 && (
          <div className="mt-14 grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            {featured && (
              <motion.blockquote
                initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
                className="lg:col-span-7"
              >
                <p className="font-editorial italic text-[28px] leading-[1.18] text-text sm:text-[36px] lg:text-[42px]">
                  &ldquo;{featured.quote}&rdquo;
                </p>
                <footer className="mt-6 flex items-center gap-3">
                  <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent" />
                  <span className="text-sm font-medium text-text">{featured.name}</span>
                  <span className="text-sm text-text-muted">{featured.role}</span>
                </footer>
              </motion.blockquote>
            )}

            <div className="divide-y divide-white/[0.07] border-t border-white/[0.07] lg:col-span-5 lg:border-t-0">
              {secondaryQuotes.map((q, i) => (
                <motion.blockquote
                  key={q.name || i}
                  initial={reducedMotion ? false : { opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{
                    duration: 0.28,
                    delay: reducedMotion ? 0 : (i + 1) * 0.05,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                  className="py-6 first:lg:pt-0"
                >
                  <p className="text-[15px] leading-[1.7] tracking-[0.005em] text-text-secondary">
                    &ldquo;{q.quote}&rdquo;
                  </p>
                  <footer className="mt-3 text-xs text-text-muted">
                    {q.name} &middot; {q.role}
                  </footer>
                </motion.blockquote>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
