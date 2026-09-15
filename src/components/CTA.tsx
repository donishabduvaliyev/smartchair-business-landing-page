import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_URL } from "../lib/constants";
import { LogoMark } from "./Logo";
import { DotGrid } from "./PanelChrome";

export function CTA() {
  const { t } = useTranslation();
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[40px] border border-border bg-gradient-to-br from-surface via-surface to-surface-2 px-8 py-16 text-center sm:px-16"
        >
          <DotGrid />
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/25 blur-[120px]" />
          </div>

          <motion.span
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface-2 p-3 text-text shadow-[0_0_40px_rgba(212,175,90,0.35)]"
          >
            <LogoMark />
          </motion.span>

          <h2 className="relative text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-lg text-text-muted">
            {t("cta.subtitle")}
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-soft to-accent px-8 py-4 text-sm font-semibold text-accent-ink shadow-[0_0_30px_rgba(212,175,90,0.35)] transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              {t("cta.ctaBusiness")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border px-8 py-4 text-sm font-semibold text-text transition-colors hover:bg-surface-2 sm:w-auto"
            >
              {t("cta.ctaCustomer")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
