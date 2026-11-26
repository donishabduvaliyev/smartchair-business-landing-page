import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePartnerModal } from "../context/PartnerModalContext";
import { CITY, TELEGRAM_URL } from "../lib/constants";
import { DashboardMockup } from "./DashboardMockup";

export function Hero() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const trustRaw = t("hero.trust", { returnObjects: true });
  const trustItems = Array.isArray(trustRaw) ? (trustRaw as string[]) : [];

  return (
    <section
      id="top"
      className="relative overflow-x-clip bg-bg pt-32 pb-24 lg:pt-40 lg:pb-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 50% at 72% 50%, rgba(255,255,255,0.035), transparent)",
        }}
      />

      <div className="relative mx-auto grid max-w-[1160px] grid-cols-1 items-center gap-12 px-6 lg:grid-cols-2 lg:gap-10 lg:px-8">
        {/* Left editorial column */}
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-1 px-3.5 py-1.5 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-ok" />
            {t("hero.badge", { city: CITY })}
          </span>

          <h1 className="mt-6 text-[38px] font-medium leading-[1.06] tracking-[-0.03em] text-text [text-wrap:balance] sm:text-[48px] lg:text-[54px]">
            {t("hero.titleLine1")} {t("hero.titleHighlight")} {t("hero.titleLine2")}
          </h1>

          <p className="mt-5 max-w-[48ch] text-base leading-[1.6] tracking-[0.005em] text-text-secondary [text-wrap:pretty] sm:text-[17px]">
            {t("hero.subtitle")}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={openPartnerModal}
              className="btn-primary group inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-medium"
            >
              {t("hero.ctaBusiness")}
              <ArrowRight
                size={16}
                className="transition-transform duration-150 ease-out group-hover:translate-x-0.5"
              />
            </button>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex h-11 items-center justify-center rounded-[10px] px-6 text-sm font-medium"
            >
              {t("hero.ctaCustomer")}
            </a>
          </div>

          {trustItems.length > 0 && (
            <ul className="mt-8 grid max-w-[460px] grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {trustItems.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-text-secondary"
                >
                  <Check
                    size={15}
                    className="shrink-0 text-text-muted"
                    strokeWidth={1.75}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Right 3D Dashboard Mockup column */}
        <div className="relative mx-auto h-[390px] w-full max-w-md sm:h-[450px] lg:h-[500px] lg:max-w-none">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}
