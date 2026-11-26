import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
} from "../lib/constants";
import { PartnerFormBody } from "./PartnerApplicationModal";

export function PartnerInquirySection() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const benefits = t("partnerForm.benefits", { returnObjects: true }) as string[];

  return (
    <section id="partner-apply" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1160px] px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left 5 cols: Benefits & Founder Contact */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col justify-between lg:col-span-5"
          >
            <div>
              <p className="text-[13px] font-medium text-text-muted">
                {t("partnerForm.eyebrow")}
              </p>

              <h2 className="mt-2.5 max-w-[26ch] text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
                {t("partnerForm.title")}
              </h2>
              <p className="mt-3.5 text-sm leading-[1.6] tracking-[0.005em] text-text-secondary">
                {t("partnerForm.subtitle")}
              </p>

              <div className="mt-7 space-y-3">
                <p className="text-[13px] font-medium text-text-muted">
                  {t("partnerForm.benefitsTitle")}
                </p>
                {Array.isArray(benefits) &&
                  benefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-sm leading-[1.55] text-text-secondary"
                    >
                      <CheckCircle2
                        size={16}
                        strokeWidth={1.5}
                        className="mt-0.5 shrink-0 text-text-muted"
                      />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Founder Contact Card */}
            <div className="surface-card mt-8 rounded-[20px] p-6">
              <p className="text-sm font-medium text-text">
                {t("partnerForm.directContactTitle")}
              </p>
              <p className="mt-1.5 text-xs leading-[1.6] text-text-secondary">
                {t("partnerForm.directContactDesc")}
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
                <a
                  href={PHONE_HREF}
                  className="btn-primary inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium whitespace-nowrap"
                >
                  <Phone size={14} strokeWidth={1.5} />
                  {PHONE_NUMBER}
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex h-10 items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium whitespace-nowrap"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right 7 cols: Interactive B2B Partner Form */}
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{
              duration: 0.28,
              delay: reducedMotion ? 0 : 0.05,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="surface-card rounded-[20px] p-6 sm:p-8 lg:col-span-7"
          >
            <PartnerFormBody />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
