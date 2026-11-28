import { useState } from "react";
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
import { scrollToProgress } from "../../lib/spatialWorld";

type OpsKey = "requests" | "queue" | "register" | "crm";

const OPS_COPY = {
  en: {
    eyebrow: "04 · Horological Schedule & Operations",
    headline: "Chaos snaps into",
    headlineAccent: "clockwork.",
    sub: "As scattered slots align around the 3D Clock Ring, SmartChair unifies booking requests, reception QR walk-ins, specialist shifts, checkout register ledgers, and client reminders.",
    cta: "Dock at Reception Desk",
    modules: [
      {
        key: "requests" as OpsKey,
        num: "01",
        anchor: "Clock Ring",
        title: "Booking Requests & Shifts",
        desc: "Accept, decline, or reschedule incoming Telegram & web requests in real time alongside specialist working hours.",
      },
      {
        key: "queue" as OpsKey,
        num: "02",
        anchor: "QR Totem",
        title: "Walk-In QR Synchronization",
        desc: "Walk-in guests scan your reception QR to enter the live queue, keeping street traffic synced with booked slots.",
      },
      {
        key: "register" as OpsKey,
        num: "03",
        anchor: "Register Ledger",
        title: "Checkout & Z-Reports",
        desc: "Record completed visits across Cash (Naqd), Terminal, Click, and Payme ledgers with shift-close reconciliation and specialist commissions.",
      },
      {
        key: "crm" as OpsKey,
        num: "04",
        anchor: "Client Archive",
        title: "Customer Records & Reminders",
        desc: "Maintain visit history and specialist notes, paired with automated Telegram reminders and overdue win-back messages.",
      },
    ],
    demo: {
      requestsTitle: "Incoming Request · Telegram Bot",
      accept: "Accept",
      decline: "Decline",
      accepted: "Confirmed · Telegram alert queued",
      declined: "Declined · Slot released",
      reset: "Reset",
      queueTitle: "Reception QR Waitlist",
      registerTitle: "Checkout Register Ledger",
      crmTitle: "Client Profile & Automated Jobs",
    },
  },
  uz: {
    eyebrow: "04 · Soat mexanizmi va Boshqaruv",
    headline: "Tartibsizlik aniq",
    headlineAccent: "soatga aylanadi.",
    sub: "Tarqoq yozuvlar 3D Soat halqasi atrofida yig'ilganda, SmartChair Telegram so'rovlari, QR navbat, ustalar smenasi va kassa Z-hisobotini bitta tizimga jamlaydi.",
    cta: "Resepshn stoliga o'tish",
    modules: [
      {
        key: "requests" as OpsKey,
        num: "01",
        anchor: "Soat halqasi",
        title: "Bron so'rovlari va Smenalar",
        desc: "Telegram va veb orqali kelgan so'rovlarni bir bosishda tasdiqlang yoki rad eting, ustalar ish vaqtini boshqaring.",
      },
      {
        key: "queue" as OpsKey,
        num: "02",
        anchor: "QR ustuni",
        title: "Jonli QR Navbat",
        desc: "Ko'chadan kirgan mehmonlar QR kodni skanerlab jonli navbatga yoziladi — onlayn bronlar bilan to'qnashuvsiz.",
      },
      {
        key: "register" as OpsKey,
        num: "03",
        anchor: "Kassa jurnali",
        title: "Kassa va Z-hisobot",
        desc: "Xizmat yakunida Naqd, Terminal, Click va Payme to'lovlarini qayd eting, ustalar ulushi va smena yopilishini tekshiring.",
      },
      {
        key: "crm" as OpsKey,
        num: "04",
        anchor: "Mijozlar arxivi",
        title: "Mijozlar bazasi va Eslatmalar",
        desc: "Tashriflar tarixi, usta qaydnomalari hamda avtomatik Telegram eslatmalar va qayta chaqirish xabarlari.",
      },
    ],
    demo: {
      requestsTitle: "Yangi so'rov · Telegram Bot",
      accept: "Tasdiqlash",
      decline: "Rad etish",
      accepted: "Tasdiqlandi · Xabar yuborildi",
      declined: "Rad etildi · Vaqt bo'shatildi",
      reset: "Qayta",
      queueTitle: "Resepshn QR Navbati",
      registerTitle: "Kassa Jurnali",
      crmTitle: "Mijoz Profili va Eslatmalar",
    },
  },
  ru: {
    eyebrow: "04 · Часовой механизм и Операции",
    headline: "Хаос собирается в",
    headlineAccent: "точный ритм.",
    sub: "Пока разрозненные записи выстраиваются вокруг 3D-циферблата, SmartChair объединяет заявки из Telegram, QR-очередь, смены мастеров и Z-отчёты кассы.",
    cta: "К стойке ресепшн",
    modules: [
      {
        key: "requests" as OpsKey,
        num: "01",
        anchor: "Циферблат",
        title: "Заявки и График смен",
        desc: "Подтверждайте, отклоняйте и переносите входящие заявки из Telegram и веба с учётом графика каждого мастера.",
      },
      {
        key: "queue" as OpsKey,
        num: "02",
        anchor: "QR-стела",
        title: "Синхронизация QR-очереди",
        desc: "Гости с улицы сканируют QR на входе и попадают в живую очередь без накладок с онлайн-бронями.",
      },
      {
        key: "register" as OpsKey,
        num: "03",
        anchor: "Касса",
        title: "Расчёт и Z-отчёты",
        desc: "Фиксируйте оплату наличными, картой, Click и Payme при расчёте, с авторасчётом комиссий и Z-отчётом смены.",
      },
      {
        key: "crm" as OpsKey,
        num: "04",
        anchor: "Архив клиентов",
        title: "База и Напоминания",
        desc: "История визитов и заметки мастеров в связке с автоматическими напоминаниями и возвратом клиентов в Telegram.",
      },
    ],
    demo: {
      requestsTitle: "Входящая заявка · Telegram Бот",
      accept: "Принять",
      decline: "Отклонить",
      accepted: "Подтверждено · Уведомление отправлено",
      declined: "Отклонено · Слот освобождён",
      reset: "Сброс",
      queueTitle: "QR-Очередь Ресепшн",
      registerTitle: "Кассовый журнал смены",
      crmTitle: "Карточка клиента и Автозадачи",
    },
  },
} as const;

export function BusinessOperationsSpine() {
  const { i18n } = useTranslation();
  const lang = (["uz", "ru", "en"].includes(i18n.language)
    ? i18n.language
    : "en") as "uz" | "ru" | "en";
  const c = OPS_COPY[lang];

  const [activeKey, setActiveKey] = useState<OpsKey>("requests");
  const [requestState, setRequestState] = useState<"pending" | "accepted" | "declined">("pending");

  return (
    <div className="mx-auto flex w-full max-w-[1340px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-10">
      {/* Left: Sunlit Vellum Hairline Operations Index */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-xl bg-[#FAF6EE]/84 p-5 sm:p-6 backdrop-blur-md border-l border-[#8C6D46]/35 shadow-[0_18px_45px_rgba(44,34,20,0.08)]">
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] uppercase text-[#7A5B34]">
          <span className="h-px w-6 bg-[#8C6D46]" />
          <span>{c.eyebrow}</span>
        </div>

        <h3 className="mt-2 font-sans text-3xl font-medium tracking-[-0.03em] text-[#1C1917] sm:text-5xl">
          {c.headline}{" "}
          <span className="font-editorial italic font-normal text-[#7A5B34]">
            {c.headlineAccent}
          </span>
        </h3>

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
                onClick={() => setActiveKey(mod.key)}
                className={`border-l pl-3 text-left transition-all ${
                  active
                    ? "border-[#7A5B34] opacity-100"
                    : "border-[#1C1917]/15 opacity-60 hover:opacity-95"
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-[#7A5B34]">
                  {mod.num} · {mod.anchor}
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

      {/* Right: Frameless Vellum & Bronze Operations Console */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto w-full max-w-[380px] shrink-0 border-l border-t border-[#8C6D46]/40 bg-[#FAF6EE]/92 p-4 backdrop-blur-md shadow-[0_20px_50px_rgba(44,34,20,0.10)]">
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
                <span>15:00 · Barber Chair #2</span>
                <span className="font-mono text-[#7A5B34]">Telegram</span>
              </div>
              <div className="mt-1 text-[#4B433B]">45 min slot · Shift verified</div>
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
                <span className="text-[#1C1917]">Online Booking · Schedule</span>
                <span className="font-mono text-emerald-700">Synced</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-[#1C1917]">Walk-In QR (`/waitlist/:shopId`)</span>
                <span className="font-mono text-[#7A5B34]">Live Queue</span>
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
              {["Cash (Naqd)", "Terminal", "Click", "Payme"].map((method) => (
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
                <span className="text-[#1C1917]">Pre-visit Telegram reminder</span>
                <span className="font-mono text-[#7A5B34]">Automated</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-[#1C1917]">Customer notes &amp; win-back</span>
                <span className="font-mono text-emerald-700">Active</span>
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
    </div>
  );
}
