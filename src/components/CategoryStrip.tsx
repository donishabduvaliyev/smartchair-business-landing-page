import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  Droplet,
  Eye,
  Flower2,
  Hand,
  Paintbrush,
  Scissors,
  Sparkle,
  Wind,
} from "lucide-react";

const CATEGORIES = [
  { icon: Scissors, key: "barber" },
  { icon: Wind, key: "hair" },
  { icon: Hand, key: "nails" },
  { icon: Flower2, key: "massage" },
  { icon: Droplet, key: "spa" },
  { icon: Sparkle, key: "cosmetology" },
  { icon: Paintbrush, key: "makeup" },
  { icon: Eye, key: "browsLashes" },
] as const;

export function CategoryStrip() {
  const { t } = useTranslation();

  return (
    <section className="relative py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -3 }}
              className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-sm text-text-muted backdrop-blur transition-colors hover:border-accent/40 hover:text-text"
            >
              <cat.icon size={15} className="text-accent" />
              {t(`categories.${cat.key}`)}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
