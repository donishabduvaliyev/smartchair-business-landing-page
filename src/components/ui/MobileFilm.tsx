import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { SCENES_BY_LANG, type LangCode } from "../../content/scenes";
import { Logo } from "../Logo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { usePartnerModal } from "../../context/PartnerModalContext";
import { PHONE_HREF, PHONE_NUMBER, TELEGRAM_URL } from "../../lib/constants";
import { PartnerFormBody } from "../PartnerApplicationModal";

export function MobileFilm() {
  const { i18n, t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const lang = (["uz", "ru", "en"].includes(i18n.language) ? i18n.language : "en") as LangCode;
  const scenes = SCENES_BY_LANG[lang];

  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const chs = Array.from(el.querySelectorAll<HTMLElement>(".m-chapter"));
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("on");
        }),
      { threshold: 0.15 }
    );
    chs.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [scenes]);

  return (
    <div id="mobile" ref={root} className="min-h-screen bg-[#060608] text-[#f2f2f3]">
      <div className="m-grain" aria-hidden="true" />

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#060608]/85 backdrop-blur-xl border-b border-white/[0.06]">
        <Logo />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={openPartnerModal}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-[#f2f2f3] px-3 text-xs font-medium text-[#060608]"
          >
            {t("nav.listBusiness")}
          </button>
        </div>
      </header>

      {/* Atmospheric Mobile Chapters */}
      <div className="px-5">
        {scenes.map((sc, idx) => (
          <section
            key={sc.id}
            className={`m-chapter ${idx === 0 ? "m-title on" : ""}`}
          >
            <div className="slate">{sc.slate}</div>
            {idx === 0 ? (
              <h1 dangerouslySetInnerHTML={{ __html: sc.title }} />
            ) : (
              <h2 dangerouslySetInnerHTML={{ __html: sc.title }} />
            )}
            <p className="mt-2 text-white/75">{sc.subtitle}</p>
            {sc.meta && <div className="meta mt-4">{sc.meta}</div>}

            {idx === 0 && (
              <div className="mt-7 flex flex-col gap-3">
                <button
                  type="button"
                  onClick={openPartnerModal}
                  className="btn-primary inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 text-sm font-medium"
                >
                  {t("hero.ctaBusiness")}
                  <ArrowRight size={16} />
                </button>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary inline-flex h-11 items-center justify-center rounded-[10px] px-5 text-sm font-medium"
                >
                  {t("hero.ctaCustomer")}
                </a>
              </div>
            )}

            {sc.card && (
              <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d0e12]/90 p-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af5a] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {sc.card.badge}
                  </span>
                  {sc.card.metric && (
                    <span className="text-[11px] font-mono text-white/80">
                      {sc.card.metric}
                    </span>
                  )}
                </div>
                <div className="mt-2.5 text-sm font-medium text-white">
                  {sc.card.title}
                </div>
                {sc.card.items && (
                  <div className="mt-2.5 space-y-1.5">
                    {sc.card.items.map((item, k) => (
                      <div
                        key={k}
                        className="flex items-center justify-between rounded-lg bg-white/[0.03] px-3 py-2 text-xs"
                      >
                        <span className="text-white/65">{item.label}</span>
                        <span
                          className={`font-mono ${
                            item.accent ? "text-[#d4af5a]" : "text-white/90"
                          }`}
                        >
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {sc.id === "end" && (
              <div className="mt-6 space-y-6">
                <div className="rounded-2xl border border-white/15 bg-[#0d0e12] p-5">
                  <PartnerFormBody />
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href={PHONE_HREF}
                    className="inline-flex items-center gap-2 text-sm font-mono text-[#d4af5a]"
                  >
                    <Phone size={14} />
                    {PHONE_NUMBER}
                  </a>
                  <a
                    href={TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-mono text-white/80"
                  >
                    Telegram Bot
                  </a>
                </div>

                <div className="flex flex-wrap gap-4 text-[11px] font-mono uppercase tracking-wider text-white/45 pb-8">
                  <Link to="/privacy">{t("footer.privacy", "Privacy")}</Link>
                  <Link to="/terms">{t("footer.terms", "Terms")}</Link>
                  <Link to="/refund">{t("footer.refund", "Refund")}</Link>
                  <Link to="/delete-account">{t("footer.deleteAccount", "Delete Account")}</Link>
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
