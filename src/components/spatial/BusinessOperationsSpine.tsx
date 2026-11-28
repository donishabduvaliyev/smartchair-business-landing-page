import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarClock,
  Check,
  QrCode,
  Receipt,
  Users2,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { normalizeLang, STORY_CONTENT, type OpsModuleKey } from "../../content/storyContent";
import { scrollToProgress, type SpatialWorldState } from "../../lib/spatialWorld";

export function BusinessOperationsSpine({
  world,
}: {
  world: React.RefObject<SpatialWorldState>;
}) {
  const { i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = STORY_CONTENT[lang].act4;

  const [activeKey, setActiveKey] = useState<OpsModuleKey>("requests");
  const [requestState, setRequestState] = useState<"pending" | "accepted" | "declined">("pending");

  // Sync if visitor clicks any of the 4 Pantheon Rotunda monuments directly in 3D
  useEffect(() => {
    let id = 0;
    const sync = () => {
      const wMod = world.current?.selectedOpsModule;
      if (wMod && wMod !== activeKey) {
        setActiveKey(wMod);
      }
      id = requestAnimationFrame(sync);
    };
    id = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(id);
  }, [world, activeKey]);

  const handleSelectModule = (key: OpsModuleKey) => {
    setActiveKey(key);
    if (world.current) {
      world.current.selectedOpsModule = key;
    }
  };

  const activeMod = c.modules.find((m) => m.key === activeKey) ?? c.modules[0];

  return (
    <section
      aria-labelledby="ch4-heading"
      className="mx-auto flex w-full max-w-[1340px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-10"
    >
      {/* Left: Rotunda Operations Story & 4 Monuments Index */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-xl bg-[#FAF6EE]/86 p-5 sm:p-6 backdrop-blur-md border-l border-[#8C6D46]/35 shadow-[0_18px_45px_rgba(44,34,20,0.08)]">
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-[#7A5B34]">
          <span className="h-px w-6 bg-[#8C6D46]" />
          <span>{c.eyebrow}</span>
        </div>

        <h2
          id="ch4-heading"
          className="mt-2 font-sans text-3xl font-medium tracking-[-0.03em] text-[#1C1917] sm:text-5xl"
        >
          {c.headline}{" "}
          <span className="font-editorial italic font-normal text-[#7A5B34]">
            {c.headlineAccent}
          </span>
        </h2>

        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#4B433B]">
          {c.sub}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 border-t border-[#1C1917]/12 pt-4 sm:grid-cols-2">
          {c.modules.map((mod) => {
            const active = activeKey === mod.key;
            return (
              <button
                key={mod.key}
                type="button"
                onClick={() => handleSelectModule(mod.key)}
                className={`border-l pl-3 text-left transition-all ${
                  active
                    ? "border-[#7A5B34] opacity-100"
                    : "border-[#1C1917]/15 opacity-60 hover:opacity-95"
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
                  {mod.num} · {mod.monument}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[#1C1917]">
                  {mod.title}
                </div>
                {active && (
                  <p className="mt-1 text-[11px] leading-relaxed text-[#4B433B]">
                    {mod.desc}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Frameless Vellum & Bronze Operations Console + Monument Curator Note */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto w-full max-w-[385px] shrink-0 border-l border-t border-[#8C6D46]/40 bg-[#FAF6EE]/92 p-4 backdrop-blur-md shadow-[0_20px_50px_rgba(44,34,20,0.10)]">
        <p className="mb-3 border-b border-[#1C1917]/10 pb-2 text-[11px] italic text-[#5C5349]">
          {activeMod.curatorNote}
        </p>

        {activeKey === "requests" && (
          <div>
            <div className="flex items-center justify-between border-b border-[#1C1917]/12 pb-2.5">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
                <CalendarClock size={13} />
                <span>{c.demo.requestsTitle}</span>
              </div>
              <span className="font-mono text-[10px] text-[#4B433B]">
                {requestState.toUpperCase()}
              </span>
            </div>

            <div className="mt-3 border-b border-[#1C1917]/12 pb-3 text-xs">
              <div className="flex justify-between font-medium text-[#1C1917]">
                <span>{c.demo.requestItem}</span>
                <span className="font-mono text-[#7A5B34]">Telegram</span>
              </div>
              <div className="mt-1 text-[#4B433B]">{c.demo.requestMeta}</div>
            </div>

            {requestState === "pending" ? (
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRequestState("accepted")}
                  className="inline-flex h-9 items-center justify-center gap-1.5 border border-[#7A5B34] bg-[#8C6D46]/12 font-mono text-[11px] uppercase tracking-wider text-[#5C4324] hover:bg-[#8C6D46]/22"
                >
                  <Check size={13} />
                  <span>{c.demo.accept}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestState("declined")}
                  className="inline-flex h-9 items-center justify-center gap-1.5 border border-[#1C1917]/20 font-mono text-[11px] uppercase tracking-wider text-[#4B433B] hover:border-[#1C1917]/40"
                >
                  <X size={13} />
                  <span>{c.demo.decline}</span>
                </button>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between border-l-2 border-[#7A5B34] pl-3 text-xs text-[#5C4324]">
                <span>{requestState === "accepted" ? c.demo.accepted : c.demo.declined}</span>
                <button
                  type="button"
                  onClick={() => setRequestState("pending")}
                  className="font-mono text-[10px] underline"
                >
                  {c.demo.reset}
                </button>
              </div>
            )}
          </div>
        )}

        {activeKey === "queue" && (
          <div>
            <div className="flex items-center gap-2 border-b border-[#1C1917]/12 pb-2.5 font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
              <QrCode size={13} />
              <span>{c.demo.queueTitle}</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#1C1917]/12 pb-2">
                <span className="text-[#1C1917]">{c.demo.queueOnlineLabel}</span>
                <span className="font-mono text-emerald-700">{c.demo.queueOnlineBadge}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-[#1C1917]">{c.demo.queueWalkInLabel}</span>
                <span className="font-mono text-[#7A5B34]">{c.demo.queueWalkInBadge}</span>
              </div>
            </div>
          </div>
        )}

        {activeKey === "register" && (
          <div>
            <div className="flex items-center gap-2 border-b border-[#1C1917]/12 pb-2.5 font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
              <Receipt size={13} />
              <span>{c.demo.registerTitle}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {c.demo.registerMethods.map((method) => (
                <div
                  key={method}
                  className="border-b border-[#1C1917]/15 py-1.5 font-mono text-[11px] text-[#1C1917]"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeKey === "crm" && (
          <div>
            <div className="flex items-center gap-2 border-b border-[#1C1917]/12 pb-2.5 font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
              <Users2 size={13} />
              <span>{c.demo.crmTitle}</span>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between border-b border-[#1C1917]/12 pb-2">
                <span className="text-[#1C1917]">{c.demo.crmReminderLabel}</span>
                <span className="font-mono text-[#7A5B34]">{c.demo.crmReminderBadge}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-[#1C1917]">{c.demo.crmNotesLabel}</span>
                <span className="font-mono text-emerald-700">{c.demo.crmNotesBadge}</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => scrollToProgress(0.97)}
          className="mt-4 inline-flex w-full items-center justify-between border-t border-[#1C1917]/15 pt-3 font-mono text-[11px] uppercase tracking-wider text-[#1C1917] transition-colors hover:text-[#7A5B34]"
        >
          <span>{c.cta}</span>
          <ArrowRight size={14} className="text-[#7A5B34]" />
        </button>
      </div>
    </section>
  );
}
