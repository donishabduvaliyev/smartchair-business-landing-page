import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePartnerModal } from "../context/PartnerModalContext";
import { TELEGRAM_URL } from "../lib/constants";
import { renderEditorialHeading } from "../lib/editorial";

export function CTA() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const { openPartnerModal } = usePartnerModal();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1160px] px-6 lg:px-8">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="specular-card relative overflow-hidden rounded-[24px] px-8 py-16 sm:px-14 sm:py-20"
        >
          <img
            src="/images/salon-sanctuary.webp"
            alt=""
            aria-hidden="true"
            width={1376}
            height={768}
            loading="lazy"
            className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-3/5 object-cover opacity-25 sm:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0e11] via-[#0d0e11]/92 to-[#0d0e11]/45"
          />

          <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
                {renderEditorialHeading(t("cta.title"), "accent")}
              </h2>
              <p className="mt-3.5 max-w-[50ch] text-base leading-[1.6] tracking-[0.005em] text-text-secondary [text-wrap:pretty]">
                {t("cta.subtitle")}
              </p>
            </div>

            <div className="flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row">
              <button
                type="button"
                onClick={openPartnerModal}
                className="btn-primary group inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-6 text-sm font-medium sm:w-auto"
              >
                {t("cta.ctaBusiness")}
                <ArrowRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                />
              </button>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex h-11 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[10px] px-6 text-sm font-medium sm:w-auto"
              >
                {t("cta.ctaCustomer")}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
