import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronDown, Phone, UserCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PHONE_HREF } from "../lib/constants";
import { cn } from "../lib/utils";
import { BlueprintFrame } from "./BlueprintGrid";

type FaqTab = "customers" | "businesses";

interface FaqItem {
  q: string;
  a: string;
}

export function FAQ() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<FaqTab>("customers");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = (t(`faq.${activeTab}`, { returnObjects: true }) as FaqItem[]) || [];

  const handleTabChange = (tab: FaqTab) => {
    setActiveTab(tab);
    setOpenIndex(0);
  };

  return (
    <section id="faq" className="bg-paper border-b border-grid">
      <BlueprintFrame>
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left 4 cols: Header, Segmented Control & Direct Phone Link */}
          <div className="lg:col-span-4 p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-grid flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-brass-ink">
                [06 / FAQ]
              </span>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.025em] text-ink">
                {t("faq.title")}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                {t("faq.subtitle")}
              </p>

              {/* Segmented Control */}
              <div className="mt-6 inline-flex w-full rounded-lg bg-paper-subtle border border-grid p-1 sm:w-auto">
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
                        "press-spring flex flex-1 items-center justify-center gap-2 rounded-md px-3.5 py-2 text-xs font-medium transition-colors sm:flex-initial",
                        isActive
                          ? "bg-surface text-ink border border-grid shadow-2xs"
                          : "border border-transparent text-ink-muted hover:text-ink"
                      )}
                    >
                      <tab.icon size={14} />
                      {t(`faq.tabs.${tab.key}`)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Direct Phone Link */}
            <div className="mt-8 border-t border-grid pt-6">
              <p className="text-xs font-medium text-ink-muted">{t("faq.stillHaveQuestions")}</p>
              <a
                href={PHONE_HREF}
                className="btn-ghost-light press-spring mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold sm:w-auto"
              >
                <Phone size={14} className="text-brass-ink" />
                {t("faq.callDirectly")}
              </a>
            </div>
          </div>

          {/* Right 8 cols: Mono-indexed Accordion Rows */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="divide-y divide-grid"
              >
                {Array.isArray(items) &&
                  items.map((item, idx) => {
                    const isOpen = openIndex === idx;
                    const indexLabel = `[${String(idx + 1).padStart(2, "0")}]`;
                    return (
                      <div key={idx}>
                        <button
                          type="button"
                          onClick={() => setOpenIndex(isOpen ? null : idx)}
                          className="flex w-full items-center justify-between gap-4 px-6 sm:px-8 py-5 text-left transition-colors hover:bg-paper-subtle/60"
                          aria-expanded={isOpen}
                        >
                          <div className="flex items-baseline gap-3.5">
                            <span className="shrink-0 font-mono text-xs tabular-nums text-brass-ink">
                              {indexLabel}
                            </span>
                            <span className="text-base font-medium text-ink">{item.q}</span>
                          </div>
                          <ChevronDown
                            size={16}
                            className={cn(
                              "shrink-0 text-ink-muted transition-transform duration-200",
                              isOpen ? "rotate-180 text-ink" : ""
                            )}
                          />
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 sm:px-8 pb-5 pl-14 sm:pl-16 text-sm leading-relaxed text-ink-muted">
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
      </BlueprintFrame>
    </section>
  );
}
