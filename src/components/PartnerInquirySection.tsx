import { motion } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PHONE_HREF,
  PHONE_NUMBER,
} from "../lib/constants";
import { BlueprintFrame } from "./BlueprintGrid";
import { PartnerFormBody } from "./PartnerApplicationModal";

export function PartnerInquirySection() {
  const { t } = useTranslation();
  const benefits = t("partnerForm.benefits", { returnObjects: true }) as string[];

  return (
    <section id="partner-apply" className="bg-paper border-b border-grid">
      <BlueprintFrame>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 5 cols: Obsidian Founder Direct SLA & Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 bg-obsidian text-obsidian-text p-8 lg:p-12 border-b lg:border-b-0 lg:border-r border-obsidian-border flex flex-col justify-between"
          >
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-brass">
                {t("partnerForm.eyebrow")}
              </span>

              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-obsidian-text sm:text-4xl">
                {t("partnerForm.title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-obsidian-muted">
                {t("partnerForm.subtitle")}
              </p>

              <div className="mt-7 space-y-2.5">
                <p className="font-mono text-xs uppercase tracking-wider text-obsidian-faint">
                  {t("partnerForm.benefitsTitle")}
                </p>
                {Array.isArray(benefits) &&
                  benefits.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 text-sm text-obsidian-text/90"
                    >
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-brass" />
                      <span>{item}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Founder Direct Line */}
            <div className="mt-8 border-t border-obsidian-border pt-7">
              <p className="font-mono text-xs uppercase tracking-wider text-brass">
                {t("partnerForm.directContactTitle")}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-obsidian-muted">
                {t("partnerForm.directContactDesc")}
              </p>
              <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                <a
                  href={PHONE_HREF}
                  className="btn-brass press-spring inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-semibold"
                >
                  <Phone size={15} />
                  {PHONE_NUMBER}
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-dark press-spring inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-xs font-medium"
                >
                  {INSTAGRAM_HANDLE}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right 7 cols: Interactive B2B Partner Form */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.45, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-surface p-8 lg:p-12"
          >
            <PartnerFormBody />
          </motion.div>
        </div>
      </BlueprintFrame>
    </section>
  );
}
