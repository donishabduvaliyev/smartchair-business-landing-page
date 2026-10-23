import { motion } from "framer-motion";
import { CheckCircle2, Phone, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
} from "../lib/constants";
import { PartnerFormBody } from "./PartnerApplicationModal";
import { DotGrid } from "./PanelChrome";

export function PartnerInquirySection() {
  const { t } = useTranslation();
  const benefits = t("partnerForm.benefits", { returnObjects: true }) as string[];

  return (
    <section id="partner-apply" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/12 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Left column: Value prop + Direct Founder Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-accent">
              <Sparkles size={13} />
              {t("partnerForm.eyebrow")}
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
              {t("partnerForm.title")}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-text-muted">
              {t("partnerForm.subtitle")}
            </p>

            <div className="mt-7 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-text-faint">
                {t("partnerForm.benefitsTitle")}
              </p>
              {Array.isArray(benefits) &&
                benefits.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-text-muted">
                    <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-accent" />
                    <span>{item}</span>
                  </div>
                ))}
            </div>

            {/* Direct Founder Phone & Instagram Card */}
            <div className="card-glass relative mt-8 overflow-hidden rounded-3xl border border-accent/30 p-6">
              <DotGrid />
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  {t("partnerForm.directContactTitle")}
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  {t("partnerForm.directContactDesc")}
                </p>
                <div className="mt-4 flex flex-col gap-2.5 sm:flex-row">
                  <a
                    href={PHONE_HREF}
                    className="btn-gold press-spring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-bold"
                  >
                    <Phone size={15} />
                    {PHONE_NUMBER}
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary press-spring inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-semibold"
                  >
                    {INSTAGRAM_HANDLE}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right column: Interactive B2B Partner Form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="card-glass relative overflow-hidden rounded-3xl border border-border p-6 sm:p-8 lg:col-span-7"
          >
            <DotGrid />
            <div className="relative">
              <PartnerFormBody />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
