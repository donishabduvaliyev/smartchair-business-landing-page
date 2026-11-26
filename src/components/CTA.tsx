import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePartnerModal } from "../context/PartnerModalContext";
import { TELEGRAM_URL } from "../lib/constants";

function renderAccentTitle(title: string) {
  const parts = title.trim().split(" ");
  if (parts.length <= 1) {
    return <span className="font-serif italic font-normal text-brass">{title}</span>;
  }
  const lastWord = parts.pop();
  return (
    <>
      {parts.join(" ")}{" "}
      <span className="font-serif italic font-normal text-brass">{lastWord}</span>
    </>
  );
}

export function CTA() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();

  return (
    <section className="bg-obsidian text-obsidian-text">
      <div className="mx-auto max-w-[1200px] border-x border-white/[0.06] py-20 lg:py-24 px-8 lg:px-12 border-b border-white/[0.08]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end"
        >
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-brass">
              [07 / LAUNCH]
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-obsidian-text sm:text-4xl lg:text-[44px] lg:leading-[1.1]">
              {renderAccentTitle(t("cta.title"))}
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-obsidian-muted">
              {t("cta.subtitle")}
            </p>
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
            <button
              type="button"
              onClick={openPartnerModal}
              className="btn-brass press-spring group inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-7 py-3.5 text-sm font-semibold sm:w-auto"
            >
              {t("cta.ctaBusiness")}
              <ArrowRight
                size={16}
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              />
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-dark press-spring inline-flex w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-7 py-3.5 text-sm font-semibold sm:w-auto"
            >
              {t("cta.ctaCustomer")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
