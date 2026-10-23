import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronDown, Phone, Sparkles, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePartnerModal } from "../context/PartnerModalContext";
import { PHONE_HREF } from "../lib/constants";
import { cn } from "../lib/utils";

type FaqTab = "customers" | "businesses";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQ() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const [activeTab, setActiveTab] = useState<FaqTab>("customers");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = (t(`faq.${activeTab}`, { returnObjects: true }) as FaqItem[]) || [];

  const handleTabChange = (tab: FaqTab) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <section id="faq" className="relative py-28">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {t("faq.eyebrow")}
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-text sm:text-4xl">
            {t("faq.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
            {t("faq.subtitle")}
          </p>

          {/* Dual-Tab Switcher with Spring Physics */}
          <div className="mt-9 inline-flex rounded-full border border-border bg-surface/70 p-1.5 backdrop-blur">
            {(
              [
                { key: "customers" as const, icon: UserCheck },
                { key: "businesses" as const, icon: Building2 },
              ] as const
            ).map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => handleTabChange(tab.key)}
                  className={cn(
                    "press-spring relative flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold transition-colors sm:text-sm",
                    isActive ? "text-accent" : "text-text-muted hover:text-text"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFaqTabPill"
                      className="absolute inset-0 rounded-full border border-accent/50 bg-accent/15 shadow-[0_0_24px_rgba(212,175,90,0.2)]"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <tab.icon size={15} />
                    {t(`faq.tabs.${tab.key}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Accordion List */}
        <div className="mt-12 space-y-3.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-3.5"
            >
              {Array.isArray(items) &&
                items.map((item, idx) => {
                  const isOpen = openIndex === idx;
                  return (
                    <div
                      key={idx}
                      className={cn(
                        "card-glass overflow-hidden rounded-2xl border transition-colors duration-200",
                        isOpen ? "border-accent/40 bg-surface-2/80" : "border-border"
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                        aria-expanded={isOpen}
                      >
                        <span className="text-base font-semibold text-text">
                          {item.q}
                        </span>
                        <span
                          className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-200",
                            isOpen
                              ? "rotate-180 border-accent/50 bg-accent/15 text-accent"
                              : "border-border bg-surface-2 text-text-muted"
                          )}
                        >
                          <ChevronDown size={16} />
                        </span>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <div className="border-t border-border-soft px-6 pb-5 pt-3.5 text-sm leading-relaxed text-text-muted">
                              {item.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Direct Contact / Partner CTA Strip */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 flex flex-col items-center justify-between gap-4 rounded-3xl border border-border bg-surface/60 px-6 py-5 text-center sm:flex-row sm:text-left"
        >
          <p className="text-sm font-medium text-text-muted">
            {t("faq.stillHaveQuestions")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={PHONE_HREF}
              className="btn-secondary press-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              <Phone size={14} className="text-accent" />
              {t("faq.callDirectly")}
            </a>
            <button
              type="button"
              onClick={openPartnerModal}
              className="btn-gold press-spring inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold"
            >
              <Sparkles size={14} />
              {t("faq.applyPartner")}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
