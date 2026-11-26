import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { BlueprintFrame } from "./BlueprintGrid";

interface QuoteItem {
  name: string;
  role: string;
  quote: string;
}

export function Testimonials() {
  const { t } = useTranslation();
  const quotes = (t("testimonials.quotes", { returnObjects: true }) as QuoteItem[]) || [];

  return (
    <section id="reviews" className="bg-paper border-b border-grid">
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
            [05 / PARTNERS]
          </span>
          <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-ink sm:text-4xl">
            {t("testimonials.title")}
          </h2>
        </motion.div>

        {/* Flush 3-Column Quote Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-grid">
          {Array.isArray(quotes) &&
            quotes.map((q, i) => (
              <motion.div
                key={q.name || i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col justify-between p-8 lg:p-10"
              >
                <div>
                  <span
                    aria-hidden="true"
                    className="block font-serif text-3xl italic leading-none text-brass-ink"
                  >
                    &ldquo;
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-ink-muted">{q.quote}</p>
                </div>

                <div className="mt-8 border-t border-grid pt-4">
                  <p className="text-sm font-semibold text-ink">{q.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-ink-faint">{q.role}</p>
                </div>
              </motion.div>
            ))}
        </div>
      </BlueprintFrame>
    </section>
  );
}
