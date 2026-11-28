import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, Sparkles } from "lucide-react";
import { SCENES_BY_LANG, type LangCode } from "../../content/scenes";
import type { ScrollState } from "../../lib/useScroll";
import { usePartnerModal } from "../../context/PartnerModalContext";
import { PHONE_HREF, PHONE_NUMBER, TELEGRAM_URL } from "../../lib/constants";
import { PartnerFormBody } from "../PartnerApplicationModal";

export function Titles({
  scroll,
  frame,
}: {
  scroll: React.RefObject<ScrollState>;
  frame: React.RefObject<{ top: number; bottom: number }>;
}) {
  const { i18n, t } = useTranslation();
  const { openPartnerModal } = usePartnerModal();
  const lang = (["uz", "ru", "en"].includes(i18n.language) ? i18n.language : "en") as LangCode;
  const scenes = SCENES_BY_LANG[lang];

  const secs = useRef<(HTMLElement | null)[]>([]);
  const inners = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let id = 0;
    const tick = () => {
      const p = scroll.current?.smooth ?? 0;
      const f = frame.current ?? { top: 0, bottom: window.innerHeight };
      scenes.forEach((sc, i) => {
        const el = secs.current[i];
        const inner = inners.current[i];
        if (!el || !inner) return;
        const local = (p - sc.a) / (sc.b - sc.a);
        let vis = 0;
        if (i === 0) {
          // Scene 01 starts fully visible at scroll 0 and fades out cleanly after 0.72
          vis = local < 0.72 ? 1 : Math.max(0, Math.min(1, (1.1 - local) / 0.38));
        } else if (i === scenes.length - 1) {
          // Scene 08 fades in and stays locked visible at the end of the runway
          vis = local > -0.1 ? Math.min(1, Math.max(0, (local + 0.1) / 0.35)) : 0;
        } else if (local > -0.3 && local < 1.3) {
          vis = Math.min(
            Math.max((local + 0.1) / 0.28, 0),
            Math.max((1.1 - local) / 0.28, 0),
            1
          );
        }
        el.style.opacity = vis.toFixed(3);
        el.style.visibility = vis > 0.01 ? "visible" : "hidden";
        el.style.pointerEvents = vis > 0.45 ? "auto" : "none";
        el.style.top = f.top + "px";
        el.style.height = f.bottom - f.top + "px";
        el.style.paddingTop = "68px";
        el.style.paddingBottom = "64px";
        el.classList.toggle("on", vis > 0.55);
        inner.style.transform = `translate3d(0,${((1 - vis) * 18).toFixed(2)}px,0)`;
      });
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [scroll, frame, scenes]);

  return (
    <main id="narration">
      {scenes.map((sc, i) => (
        <section
          key={sc.id}
          className="chapter"
          ref={(el) => {
            secs.current[i] = el;
          }}
        >
          <div
            className={`inner w-full max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between gap-6 ${
              sc.id === "end" ? "md:items-center" : "md:items-end"
            }`}
            ref={(el) => {
              inners.current[i] = el;
            }}
          >
            {/* Left Editorial Narrative Block */}
            <div className="max-w-[540px]">
              <div className="slate">{sc.slate}</div>
              <h2 dangerouslySetInnerHTML={{ __html: sc.title }} />
              <p>{sc.subtitle}</p>
              {sc.meta && <div className="meta">{sc.meta}</div>}

              {/* Scene 01 Hero Dual CTAs */}
              {sc.id === "origin" && (
                <div className="mt-7 flex flex-wrap items-center gap-3 pointer-events-auto">
                  <button
                    type="button"
                    onClick={openPartnerModal}
                    className="btn-primary group inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-6 text-sm font-medium shadow-[0_0_24px_rgba(255,255,255,0.14)]"
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
                    className="btn-secondary inline-flex h-11 items-center justify-center rounded-[10px] px-6 text-sm font-medium backdrop-blur-md bg-black/40 border border-white/15 hover:border-white/30"
                  >
                    {t("hero.ctaCustomer")}
                  </a>
                </div>
              )}

              {/* Scene 08 Direct Contacts & Legal Footer Links */}
              {sc.id === "end" && (
                <div className="mt-6 space-y-4 pointer-events-auto">
                  <div className="flex flex-wrap items-center gap-4">
                    <a
                      href={PHONE_HREF}
                      className="inline-flex items-center gap-2 text-sm font-mono text-[#d4af5a] hover:underline"
                    >
                      <Phone size={14} />
                      {PHONE_NUMBER}
                    </a>
                    <a
                      href={TELEGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-mono text-white/80 hover:text-white hover:underline"
                    >
                      Telegram Bot
                    </a>
                  </div>
                  <div className="flex flex-wrap items-center gap-5 text-[11px] font-mono uppercase tracking-wider text-white/45">
                    <Link to="/privacy" className="hover:text-white/80">
                      {t("footer.privacy", "Privacy")}
                    </Link>
                    <Link to="/terms" className="hover:text-white/80">
                      {t("footer.terms", "Terms")}
                    </Link>
                    <Link to="/refund" className="hover:text-white/80">
                      {t("footer.refund", "Refund")}
                    </Link>
                    <Link to="/delete-account" className="hover:text-white/80">
                      {t("footer.deleteAccount", "Delete Account")}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Right Interactive Glass Business Card (Scenes 02 - 07) */}
            {sc.card && (
              <div className="hidden md:block w-full max-w-[360px] rounded-2xl border border-white/12 bg-[#0a0c10]/75 backdrop-blur-xl p-5 shadow-[0_20px_60px_rgba(0,0,0,0.7)] pointer-events-auto">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-[#d4af5a] flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" />
                    {sc.card.badge}
                  </span>
                  {sc.card.metric && (
                    <span className="px-2 py-0.5 rounded-md bg-white/8 text-[11px] font-mono text-white/90">
                      {sc.card.metric}
                    </span>
                  )}
                </div>

                <div className="mt-3 text-base font-medium text-white/95">
                  {sc.card.title}
                </div>

                {sc.card.items && (
                  <div className="mt-3 space-y-2">
                    {sc.card.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-xs"
                      >
                        <span className="text-white/65">{item.label}</span>
                        <span
                          className={`font-mono font-medium ${
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

            {/* Right Interactive Partner Inquiry Form (Scene 08) */}
            {sc.id === "end" && (
              <div className="w-full max-w-[460px] rounded-2xl border border-white/15 bg-[#0a0c10]/85 backdrop-blur-2xl p-4 sm:p-5 shadow-[0_24px_80px_rgba(0,0,0,0.85)] pointer-events-auto max-h-[calc(100vh-180px)] overflow-y-auto">
                <PartnerFormBody />
              </div>
            )}
          </div>
        </section>
      ))}
    </main>
  );
}
