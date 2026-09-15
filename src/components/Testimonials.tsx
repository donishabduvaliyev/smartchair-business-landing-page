import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { DotGrid } from "./PanelChrome";

export function Testimonials() {
  const { t } = useTranslation();
  const quotes = t("testimonials.quotes", { returnObjects: true }) as {
    name: string;
    role: string;
    quote: string;
  }[];

  return (
    <section id="reviews" className="relative overflow-hidden py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t("testimonials.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {t("testimonials.title")}
          </h2>
        </motion.div>
      </div>

      <div className="relative mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-bg to-transparent sm:w-40" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-bg to-transparent sm:w-40" />

        <div className="flex w-max animate-marquee gap-5 hover:[animation-play-state:paused]">
          {[...quotes, ...quotes].map((q, i) => (
            <div
              key={i}
              className="card-glass relative w-[320px] shrink-0 overflow-hidden rounded-3xl p-7 sm:w-[380px]"
            >
              <DotGrid />
              <div className="relative flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} size={14} className="fill-accent" />
                ))}
              </div>
              <p className="relative mt-4 text-sm leading-relaxed text-text-muted">
                &ldquo;{q.quote}&rdquo;
              </p>
              <div className="relative mt-6 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent-soft to-accent-dim text-sm font-bold text-accent-ink">
                  {q.name[0]}
                </span>
                <div>
                  <p className="text-sm font-semibold text-text">{q.name}</p>
                  <p className="text-xs text-text-faint">{q.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
