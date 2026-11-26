import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Building2, ChevronDown, Phone, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PHONE_HREF } from "../lib/constants";
import { renderEditorialHeading } from "../lib/editorial";
import { cn } from "../lib/utils";

type FaqTab = "customers" | "businesses";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQ() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState<FaqTab>("customers");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = (t(`faq.${activeTab}`, { returnObjects: true }) as FaqItem[]) || [];

  const handleTabChange = (tab: FaqTab) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1160px] px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left 4 cols: Header, Segmented Control & Direct Phone Link */}
          <div className="flex flex-col justify-between lg:col-span-4">
            <div>
              <p className="text-[13px] font-medium text-text-muted">
                {t("faq.eyebrow")}
              </p>
              <h2 className="mt-2.5 text-[28px] font-medium leading-[1.12] tracking-[-0.025em] text-text [text-wrap:balance] sm:text-[36px]">
                {renderEditorialHeading(t("faq.title"))}
              </h2>
              <p className="mt-3.5 text-sm leading-[1.6] tracking-[0.005em] text-text-secondary">
                {t("faq.subtitle")}
              </p>

              {/* Segmented Control */}
              <div
                role="tablist"
                aria-label={t("faq.eyebrow")}
                className="mt-6 inline-flex w-full rounded-xl border border-hairline bg-surface-1 p-1 sm:w-auto"
              >
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
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => handleTabChange(tab.key)}
                      className={cn(
                        "relative flex flex-1 items-center justify-center gap-2 rounded-[9px] px-3.5 py-2 text-xs font-medium transition-colors sm:flex-initial",
                        isActive ? "text-text" : "text-text-muted hover:text-text-secondary"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="faq-audience-tab"
                          transition={
                            reducedMotion
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 400, damping: 32 }
                          }
                          className="absolute inset-0 rounded-[9px] bg-surface-3"
                        />
                      )}
                      <span className="relative z-10 inline-flex items-center gap-2 whitespace-nowrap">
                        <tab.icon size={14} strokeWidth={1.5} />
                        {t(`faq.tabs.${tab.key}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Phone Link */}
            <div className="mt-8 border-t border-white/[0.06] pt-6">
              <p className="text-xs font-medium text-text-muted">
                {t("faq.stillHaveQuestions")}
              </p>
              <a
                href={PHONE_HREF}
                className="btn-secondary mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium whitespace-nowrap sm:w-auto"
              >
                <Phone size={14} strokeWidth={1.5} className="text-text-secondary" />
                {t("faq.callDirectly")}
              </a>
            </div>
          </div>

          {/* Right 8 cols: Hairline Accordion Rows */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={reducedMotion ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="divide-y divide-white/[0.06] border-t border-white/[0.06]"
              >
                {Array.isArray(items) &&
                  items.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                      <div key={idx}>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(isOpen ? null : idx)}
                          className="flex min-h-[44px] w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-text"
                          aria-expanded={isOpen}
                        >
                          <span className="text-base font-medium leading-[1.4] text-text">
                            {item.q}
                          </span>
                          <ChevronDown
                            size={16}
                            strokeWidth={1.5}
                            className={cn(
                              "shrink-0 text-text-muted transition-transform duration-200",
                              isOpen ? "rotate-180 text-text" : ""
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{
                                duration: reducedMotion ? 0 : 0.22,
                                ease: [0.23, 1, 0.32, 1],
                              }}
                              className="overflow-hidden"
                            >
                              <div className="pb-5 pr-8 text-sm leading-[1.65] tracking-[0.005em] text-text-secondary">
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
        </div>
      </div>
    </section>
  );
}
