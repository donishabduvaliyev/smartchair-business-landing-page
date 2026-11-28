import { useState } from "react";
import { ArrowUpRight, Compass, CalendarCheck, Scissors, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_URL } from "../../lib/constants";
import type { SpatialWorldState } from "../../lib/spatialWorld";

const DISCOVERY_VERTICALS = [
  { key: "barber", image: "/images/hero-studio.webp", tag: "UZS · Telegram" },
  { key: "hair", image: "/images/craft-shears.webp", tag: "UZS · Telegram" },
  { key: "nails", image: "/images/salon-sanctuary.webp", tag: "UZS · Telegram" },
  { key: "massage", image: "/images/salon-sanctuary.webp", tag: "UZS · Telegram" },
  { key: "spa", image: "/images/salon-sanctuary.webp", tag: "UZS · Telegram" },
  { key: "cosmetology", image: "/images/craft-shears.webp", tag: "UZS · Telegram" },
  { key: "makeup", image: "/images/hero-studio.webp", tag: "UZS · Telegram" },
  { key: "browsLashes", image: "/images/craft-shears.webp", tag: "UZS · Telegram" },
] as const;

const COPY = {
  en: {
    eyebrow: "03 · Customer Discovery Atelier",
    headline: "Discover. Choose. Book in Telegram.",
    sub: "Zero app downloads and 0 so'm booking fee. Clients browse nearby establishments on the live map, compare transparent UZS pricing, and request a slot in seconds.",
    scenes: [
      { step: "I", title: "Discover a place", desc: "Explore local barbershops, nail studios, and spas by category or map." },
      { step: "II", title: "Choose a specialist", desc: "Check real service durations, transparent UZS prices, and open hours." },
      { step: "III", title: "Confirm via Telegram", desc: "Send your request in one tap and receive automated pre-visit reminders." },
    ],
    cta: "Open Telegram Mini App",
  },
  uz: {
    eyebrow: "03 · Mijozlar uchun kashfiyot",
    headline: "Toping. Tanlang. Telegramda bron qiling.",
    sub: "Ilova yuklab olish shart emas, bron qilish 0 so'm. Mijozlar jonli xaritadan yaqin salonlarni topadi, aniq narxlarni ko'radi va soniyalarda vaqt band qiladi.",
    scenes: [
      { step: "I", title: "Joyni toping", desc: "Barbershop, tirnoq studiyasi va spa markazlarini xarita orqali ko'ring." },
      { step: "II", title: "Ustani tanlang", desc: "Xizmat davomiyligi, aniq UZS narxlar va bo'sh vaqtlarni solishtiring." },
      { step: "III", title: "Telegramda tasdiqlang", desc: "Bir bosishda so'rov yuboring va tashrifdan oldin eslatma oling." },
    ],
    cta: "Telegram ilovasini ochish",
  },
  ru: {
    eyebrow: "03 · Ателье поиска для клиентов",
    headline: "Найти. Выбрать. Записаться в Telegram.",
    sub: "Без установки приложений и с комиссией 0 сум. Клиенты находят ближайшие салоны на карте, видят честные цены в сумах и бронируют слот за секунды.",
    scenes: [
      { step: "I", title: "Найдите место", desc: "Ищите барбершопы, нейл-студии и спа по категориям и живой карте." },
      { step: "II", title: "Выберите мастера", desc: "Сравнивайте длительность услуг, цены в сумах и свободные окна." },
      { step: "III", title: "Бронь в Telegram", desc: "Отправьте заявку в один тап и получайте напоминания до визита." },
    ],
    cta: "Открыть Telegram Mini App",
  },
} as const;

export function DiscoveryAtelier({
  world,
}: {
  world: React.RefObject<SpatialWorldState>;
}) {
  const { t, i18n } = useTranslation();
  const lang = (["uz", "ru", "en"].includes(i18n.language)
    ? i18n.language
    : "en") as "uz" | "ru" | "en";
  const c = COPY[lang];

  const [selectedKey, setSelectedKey] = useState<string>("barber");
  const [activeBeat, setActiveBeat] = useState<number>(0);

  const activeVertical =
    DISCOVERY_VERTICALS.find((v) => v.key === selectedKey) ?? DISCOVERY_VERTICALS[0];

  const handleSelectCategory = (key: string) => {
    setSelectedKey(key);
    if (world.current) {
      world.current.selectedCategory = key;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1320px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-8">
      {/* Left: 3 Connected Discovery Scenes + Vertical Selector */}
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

        {/* Interactive 3-Beat Narrative Strip (replaces numbered grid cards) */}
        <div className="mt-5 space-y-2 border-l border-white/15 pl-4">
          {c.scenes.map((scene, idx) => {
            const active = activeBeat === idx;
            return (
              <button
                key={scene.step}
                type="button"
                onClick={() => setActiveBeat(idx)}
                className={`block w-full text-left transition-all ${
                  active ? "opacity-100" : "opacity-55 hover:opacity-85"
                }`}
              >
                <div className="flex items-baseline gap-2.5">
                  <span className="font-mono text-[10px] text-[#d4af5a]">
                    {scene.step}
                  </span>
                  <span className="text-sm font-medium text-white">
                    {scene.title}
                  </span>
                </div>
                {active && (
                  <p className="mt-0.5 pl-4 text-xs leading-relaxed text-white/70">
                    {scene.desc}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Grooming & Beauty Vertical Selector Pills */}
        <div className="mt-5 flex flex-wrap gap-1.5">
          {DISCOVERY_VERTICALS.map((v) => {
            const active = selectedKey === v.key;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => handleSelectCategory(v.key)}
                className={`rounded-full border px-3 py-1 font-mono text-[10px] tracking-wider uppercase transition-all ${
                  active
                    ? "border-[#d4af5a] bg-[#d4af5a]/15 text-[#d4af5a]"
                    : "border-white/12 bg-black/45 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                {t(`categories.${v.key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Asymmetric Photographic Monolith Plate */}
      <div className="w-full max-w-[380px] shrink-0">
        <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a0c10]/80 backdrop-blur-xl shadow-[0_24px_60px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:-translate-y-1">
          <div className="relative h-28 w-full overflow-hidden sm:h-44">
            <img
              src={activeVertical.image}
              alt={t(`categories.${activeVertical.key}`)}
              className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[#0a0c10]/30 to-transparent" />
            <div className="absolute left-4 top-3 inline-flex items-center gap-1.5 rounded-full border border-[#d4af5a]/40 bg-black/60 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[#d4af5a] backdrop-blur-md">
              <Sparkles size={10} />
              <span>{t(`categories.${activeVertical.key}`)}</span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between text-xs text-white/70">
              <span className="inline-flex items-center gap-1.5">
                {activeBeat === 0 && <Compass size={13} className="text-[#d4af5a]" />}
                {activeBeat === 1 && <Scissors size={13} className="text-[#d4af5a]" />}
                {activeBeat === 2 && <CalendarCheck size={13} className="text-[#d4af5a]" />}
                <span>{c.scenes[activeBeat].title}</span>
              </span>
              <span className="font-mono text-[10px] text-[#d4af5a]">
                0 UZS Fee
              </span>
            </div>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[10px] px-4 text-xs font-medium"
            >
              <span>{c.cta}</span>
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
