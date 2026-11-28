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
    eyebrow: "04 · Business Operations Spine",
    headline: "One living workspace behind every chair.",
    sub: "Receive and confirm Telegram booking requests, merge walk-in QR guests into specialist schedules, record checkout Z-reports, and keep client records centralized.",
    cta: "Dock at Reception Desk",
    modules: [
      {
        key: "requests" as OpsKey,
        num: "01",
        anchor: "Chairs & Clock",
        title: "Booking Requests & Shifts",
        desc: "Accept, decline, or reschedule incoming Telegram & web requests in real time alongside specialist working hours.",
      },
      {
        key: "queue" as OpsKey,
        num: "02",
        anchor: "Reception QR Stand",
        title: "Walk-In QR Synchronization",
        desc: "Walk-in guests scan your reception QR to enter the live queue, keeping street traffic synced with booked slots.",
      },
      {
        key: "register" as OpsKey,
        num: "03",
        anchor: "Cashier Counter",
        title: "Register & Z-Reports",
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
      requestsSub: "Selected specialist & service duration checked against shift hours",
      accept: "Accept",
      decline: "Decline",
      accepted: "Confirmed · Telegram alert queued",
      declined: "Declined · Slot released",
      reset: "Reset demo",
      queueTitle: "Reception QR Waitlist",
      queueSub: "Synced with specialist timeline",
      registerTitle: "Shift Register Ledger",
      registerSub: "Recorded at checkout · Cash / Card / Click / Payme",
      crmTitle: "Client Profile & Automated Jobs",
      crmSub: "Visit history, private notes & Telegram reminders",
    },
  },
  uz: {
    eyebrow: "04 · Biznes boshqaruv tizimi",
    headline: "Har bir kreslo ortida yagona jonli tizim.",
    sub: "Telegram bron so'rovlarini qabul qiling, QR navbatni ustalar jadvali bilan birlashtiring, kassa Z-hisobotini yuriting va mijozlar bazasini markazlashtiring.",
    cta: "Resepshn stoliga o'tish",
    modules: [
      {
        key: "requests" as OpsKey,
        num: "01",
        anchor: "Kreslo va Soat",
        title: "Bron so'rovlari va Smenalar",
        desc: "Telegram va veb orqali kelgan so'rovlarni bir bosishda tasdiqlang yoki rad eting, ustalar ish vaqtini boshqaring.",
      },
      {
        key: "queue" as OpsKey,
        num: "02",
        anchor: "Resepshn QR stendi",
        title: "Jonli QR Navbat",
        desc: "Ko'chadan kirgan mehmonlar QR kodni skanerlab jonli navbatga yoziladi — onlayn bronlar bilan to'qnashuvsiz.",
      },
      {
        key: "register" as OpsKey,
        num: "03",
        anchor: "Kassa stoli",
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
      requestsSub: "Ustaning ish vaqti va bo'sh sloti tekshirildi",
      accept: "Tasdiqlash",
      decline: "Rad etish",
      accepted: "Tasdiqlandi · Mijozga xabar yuborildi",
      declined: "Rad etildi · Vaqt bo'shatildi",
      reset: "Qayta ko'rish",
      queueTitle: "Resepshn QR Navbati",
      queueSub: "Ustalar jadvali bilan sinxron",
      registerTitle: "Smena Kassa Jurnali",
      registerSub: "Kassada qayd etiladi · Naqd / Karta / Click / Payme",
      crmTitle: "Mijoz Profili va Eslatmalar",
      crmSub: "Tashrif tarixi, izohlar va Telegram eslatma",
    },
  },
  ru: {
    eyebrow: "04 · Операционная система салона",
    headline: "Единая живая система за каждым креслом.",
    sub: "Принимайте заявки из Telegram, объединяйте QR-очередь с расписанием мастеров, закрывайте смену Z-отчётом и ведите базу клиентов.",
    cta: "К стойке ресепшн",
    modules: [
      {
        key: "requests" as OpsKey,
        num: "01",
        anchor: "Кресла и Часы",
        title: "Заявки и График смен",
        desc: "Подтверждайте, отклоняйте и переносите входящие заявки из Telegram и веба с учётом графика каждого мастера.",
      },
      {
        key: "queue" as OpsKey,
        num: "02",
        anchor: "QR-стойка ресепшн",
        title: "Синхронизация QR-очереди",
        desc: "Гости с улицы сканируют QR на входе и попадают в живую очередь без накладок с онлайн-бронями.",
      },
      {
        key: "register" as OpsKey,
        num: "03",
        anchor: "Кассовая зона",
        title: "Касса и Z-отчёты",
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
      requestsSub: "График мастера и длительность услуги проверены",
      accept: "Принять",
      decline: "Отклонить",
      accepted: "Подтверждено · Уведомление отправлено",
      declined: "Отклонено · Слот освобождён",
      reset: "Сбросить демо",
      queueTitle: "QR-Очередь Ресепшн",
      queueSub: "Синхронизирована с графиком мастеров",
      registerTitle: "Кассовый журнал смены",
      registerSub: "Учёт при расчёте · Наличные / Карта / Click / Payme",
      crmTitle: "Карточка клиента и Автозадачи",
      crmSub: "История визитов, заметки и Telegram-напоминания",
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
    <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-8">
      {/* Left: 4-Module Interactive Operations Spine */}
      <div className="max-w-xl">
        <p className="font-mono text-[10px] tracking-[0.22em] uppercase text-[#d4af5a]">
          {c.eyebrow}
        </p>
        <h3 className="mt-2 font-editorial text-3xl italic text-[#f2efe9] sm:text-4xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)]">
          {c.headline}
        </h3>
        <p className="mt-2.5 text-sm leading-relaxed text-white/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
          {c.sub}
        </p>

        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {c.modules.map((mod) => {
            const active = activeKey === mod.key;
            return (
              <button
                key={mod.key}
                type="button"
                onClick={() => setActiveKey(mod.key)}
                className={`rounded-xl border p-3 text-left transition-all ${
                  active
                    ? "border-[#d4af5a]/70 bg-[#0d0f15]/85 shadow-[0_8px_24px_rgba(212,175,90,0.12)]"
                    : "border-white/10 bg-[#08090c]/60 hover:border-white/25"
                } backdrop-blur-md`}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-wider">
                  <span className={active ? "text-[#d4af5a]" : "text-white/45"}>
                    {mod.num} · {mod.anchor}
                  </span>
                </div>
                <div className="mt-1 text-xs font-medium text-white">
                  {mod.title}
                </div>
                {active && (
                  <p className="mt-1 text-[11px] leading-relaxed text-white/65">
                    {mod.desc}
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Live Interactive Workspace Console Plate */}
      <div className="w-full max-w-[400px] shrink-0 rounded-2xl border border-white/15 bg-[#0a0c10]/85 p-5 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
        {activeKey === "requests" && (
          <div>
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#d4af5a]">
                <CalendarClock size={13} />
                <span>{c.demo.requestsTitle}</span>
              </div>
              <span className="rounded bg-white/8 px-2 py-0.5 font-mono text-[10px] text-white/75">
                {requestState.toUpperCase()}
              </span>
            </div>

            <p className="mt-3 text-xs text-white/65">{c.demo.requestsSub}</p>

            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-xs">
              <div className="flex justify-between font-medium text-white">
                <span>15:00 · Barber Chair #2</span>
                <span className="font-mono text-[#d4af5a]">Telegram</span>
              </div>
              <div className="mt-1 text-white/55">45 min slot · Shift verified</div>
            </div>

            {requestState === "pending" ? (
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setRequestState("accepted")}
                  className="btn-primary inline-flex h-9 items-center justify-center gap-1.5 rounded-lg text-xs font-medium"
                >
                  <Check size={14} />
                  <span>{c.demo.accept}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRequestState("declined")}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 text-xs font-medium text-white/80 hover:border-white/30"
                >
                  <X size={14} />
                  <span>{c.demo.decline}</span>
                </button>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between rounded-lg border border-[#d4af5a]/35 bg-[#d4af5a]/10 px-3 py-2 text-xs text-[#d4af5a]">
                <span>
                  {requestState === "accepted" ? c.demo.accepted : c.demo.declined}
                </span>
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
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-wider text-[#d4af5a]">
              <QrCode size={13} />
              <span>{c.demo.queueTitle}</span>
            </div>
            <p className="mt-3 text-xs text-white/65">{c.demo.queueSub}</p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-white">Online Booking · Schedule</span>
                <span className="font-mono text-emerald-400">Synced</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-white">Walk-In QR (`/waitlist/:shopId`)</span>
                <span className="font-mono text-[#d4af5a]">Live Queue</span>
              </div>
            </div>
          </div>
        )}

        {activeKey === "register" && (
          <div>
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-wider text-[#d4af5a]">
              <Receipt size={13} />
              <span>{c.demo.registerTitle}</span>
            </div>
            <p className="mt-3 text-xs text-white/65">{c.demo.registerSub}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              {["Cash (Naqd)", "Terminal", "Click", "Payme"].map((method) => (
                <div
                  key={method}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-white/85"
                >
                  {method}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeKey === "crm" && (
          <div>
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 font-mono text-[10px] uppercase tracking-wider text-[#d4af5a]">
              <Users2 size={13} />
              <span>{c.demo.crmTitle}</span>
            </div>
            <p className="mt-3 text-xs text-white/65">{c.demo.crmSub}</p>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-white">Pre-visit Telegram reminder</span>
                <span className="font-mono text-[#d4af5a]">Automated</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5">
                <span className="text-white">Customer notes &amp; win-back</span>
                <span className="font-mono text-emerald-400">Active</span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => scrollToProgress(0.96)}
          className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] border border-white/15 bg-white/[0.05] text-xs font-medium text-white transition-colors hover:border-[#d4af5a]/50 hover:text-[#d4af5a]"
        >
          <span>{c.cta}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
