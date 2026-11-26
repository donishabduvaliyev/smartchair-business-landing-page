import { ArrowRight, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { usePartnerModal } from "../context/PartnerModalContext";
import { CITY, TELEGRAM_URL } from "../lib/constants";
import { Crosshair } from "./BlueprintGrid";
import { SpatialPlatform3D } from "./SpatialPlatform3D";

export function Hero() {
  const { t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const trustRaw = t("hero.trust", { returnObjects: true });
  const trustItems = Array.isArray(trustRaw) ? (trustRaw as string[]) : [];

  return (
    <section
      id="top"
      className="border-b border-obsidian-border bg-obsidian text-obsidian-text"
    >
      <div className="relative mx-auto max-w-[1200px] border-x border-white/[0.06] px-6 pt-28 pb-20 lg:px-10 lg:pt-36 lg:pb-28">
        <Crosshair dark position="bl" />
        <Crosshair dark position="br" />

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left editorial column */}
          <div className="lg:col-span-6">
            <p className="mb-5 font-mono text-xs text-brass">
              [00] · {t("hero.badge", { city: CITY })}
            </p>

            <h1 className="text-[36px] leading-[1.04] font-medium tracking-[-0.03em] text-obsidian-text sm:text-[48px] lg:text-[54px]">
              {t("hero.titleLine1")}
              <br />
              <span className="font-serif font-normal italic text-brass">
                {t("hero.titleHighlight")}
              </span>{" "}
              {t("hero.titleLine2")}
            </h1>

            <p className="mt-6 max-w-[500px] text-base leading-relaxed text-obsidian-muted sm:text-lg">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={openPartnerModal}
                className="btn-brass press-spring group inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-medium"
              >
                {t("hero.ctaBusiness")}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                />
              </button>
              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost-dark press-spring inline-flex items-center justify-center rounded-lg px-6 py-3.5 text-sm font-medium"
              >
                {t("hero.ctaCustomer")}
              </a>
            </div>

            {trustItems.length > 0 && (
              <ul className="mt-8 grid max-w-[460px] grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {trustItems.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-obsidian-muted">
                    <Check size={15} className="shrink-0 text-brass" strokeWidth={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right 3D Spatial Platform column */}
          <div className="lg:col-span-6">
            <SpatialPlatform3D />
          </div>
        </div>
      </div>
    </section>
  );
}
