import { motion, type Variants } from "framer-motion";
import { ArrowRight, MapPin, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_URL, CITY } from "../lib/constants";
import { DashboardMockup } from "./DashboardMockup";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  }),
};

export function Hero() {
  const { t } = useTranslation();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16"
    >
      {/* Ambient gradient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-bg" />
        <div className="absolute left-1/2 top-[-10%] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-accent/20 blur-[140px]" />
        <div className="absolute right-[-10%] top-1/3 h-[420px] w-[420px] rounded-full bg-info/10 blur-[120px]" />
        <div className="bg-grain absolute inset-0" />
      </div>

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Copy column */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-1.5 text-xs font-medium text-text-muted backdrop-blur"
          >
            <span className="h-1.5 w-1.5 animate-glow-pulse rounded-full bg-accent" />
            {t("hero.badge", { city: CITY })}
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="text-4xl font-extrabold leading-[1.08] tracking-tight text-text sm:text-5xl lg:text-6xl"
          >
            {t("hero.titleLine1")}
            <br />
            <span className="text-gradient-gold">{t("hero.titleHighlight")}</span>{" "}
            {t("hero.titleLine2")}
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mx-auto mt-6 max-w-lg text-lg text-text-muted lg:mx-0"
          >
            {t("hero.subtitle")}
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <a
              href="#for-business"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-accent-soft to-accent px-7 py-3.5 text-sm font-semibold text-accent-ink shadow-[0_0_30px_rgba(212,175,90,0.35)] transition-transform hover:scale-[1.03] active:scale-95 sm:w-auto"
            >
              {t("hero.ctaBusiness")}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border bg-surface/60 px-7 py-3.5 text-sm font-semibold text-text backdrop-blur transition-colors hover:bg-surface-2 sm:w-auto"
            >
              {t("hero.ctaCustomer")}
            </a>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 flex items-center justify-center gap-6 text-sm text-text-faint lg:justify-start"
          >
            <div className="flex items-center gap-1.5">
              <Star size={15} className="fill-accent text-accent" />
              <span className="text-text-muted">4.9 {t("hero.rating")}</span>
            </div>
            <div className="hidden h-4 w-px bg-border sm:block" />
            <div className="hidden items-center gap-1.5 sm:flex">
              <MapPin size={15} className="text-accent" />
              <span className="text-text-muted">30+ {t("hero.businesses")}</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard mockup column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto h-[380px] w-full max-w-md sm:h-[440px] lg:h-[500px] lg:max-w-none"
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
