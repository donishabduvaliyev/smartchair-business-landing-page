import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Bell,
  Filter,
  Globe,
  Heart,
  MapPinned,
  Zap,
} from "lucide-react";

const FEATURE_KEYS = [
  { icon: MapPinned, key: "map" },
  { icon: Filter, key: "filter" },
  { icon: Zap, key: "instant" },
  { icon: Bell, key: "reminders" },
  { icon: Heart, key: "favorites" },
  { icon: Globe, key: "language" },
] as const;

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t("features.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {t("features.title")}
          </h2>
          <p className="mt-4 text-lg text-text-muted">{t("features.subtitle")}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURE_KEYS.map((f) => (
            <motion.div
              key={f.key}
              variants={item}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="card-glass group relative overflow-hidden rounded-3xl p-7"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft/20 to-accent-dim/20 text-accent">
                <f.icon size={22} strokeWidth={1.8} />
              </span>
              <h3 className="text-lg font-bold text-text">
                {t(`features.items.${f.key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {t(`features.items.${f.key}.desc`)}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
