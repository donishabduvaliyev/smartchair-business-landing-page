import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarCheck, Compass, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TELEGRAM_URL } from "../../lib/constants";
import type { SpatialWorldState } from "../../lib/spatialWorld";

const DISCOVERY_VERTICALS = [
  { key: "barber", image: "/images/hero-studio.webp" },
  { key: "hair", image: "/images/craft-shears.webp" },
  { key: "nails", image: "/images/salon-sanctuary.webp" },
  { key: "massage", image: "/images/salon-sanctuary.webp" },
  { key: "spa", image: "/images/salon-sanctuary.webp" },
  { key: "cosmetology", image: "/images/craft-shears.webp" },
  { key: "makeup", image: "/images/hero-studio.webp" },
  { key: "browsLashes", image: "/images/craft-shears.webp" },
] as const;

const COPY = {
  en: {
    eyebrow: "03 · Spatial Discovery Horizon",
    headline: "Discover. Choose.",
    headlineAccent: "Book in Telegram.",
    sub: "Click any suspended 3D monolith or vertical below. Clients browse local establishments, check durations and UZS pricing, and request a slot with 0 so'm fee.",
    scenes: [
      { step: "I", title: "Discover a place", desc: "Explore local barbershops, nail studios, and spas by category or map." },
      { step: "II", title: "Choose a specialist", desc: "Check real service durations, transparent UZS prices, and open hours." },
      { step: "III", title: "Confirm via Telegram", desc: "Send your request in one tap and receive automated pre-visit reminders." },
    ],
    cta: "Open Telegram Mini App",
  },
  uz: {
    eyebrow: "03 · Mijozlar uchun kashfiyot",
    headline: "Toping. Tanlang.",
    headlineAccent: "Telegramda bron.",
    sub: "Istalgan 3D ustunni yoki yo'nalishni tanlang. Mijozlar yaqin salonlarni topadi, aniq narxlarni ko'radi va 0 so'm to'lov bilan vaqt band qiladi.",
    scenes: [
      { step: "I", title: "Joyni toping", desc: "Barbershop, tirnoq studiyasi va spa markazlarini xarita orqali ko'ring." },
      { step: "II", title: "Ustani tanlang", desc: "Xizmat davomiyligi, aniq UZS narxlar va bo'sh vaqtlarni solishtiring." },
      { step: "III", title: "Telegramda tasdiqlang", desc: "Bir bosishda so'rov yuboring va tashrifdan oldin eslatma oling." },
    ],
    cta: "Telegram ilovasini ochish",
  },
  ru: {
    eyebrow: "03 · Горизонт поиска",
    headline: "Найти. Выбрать.",
    headlineAccent: "Бронь в Telegram.",
    sub: "Нажмите на любой 3D-монолит или категорию. Клиенты находят салоны на карте, видят цены в сумах и бронируют визит без комиссии.",
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

  // Sync if visitor clicks a 3D Category Monolith directly in WebGL
  useEffect(() => {
    let id = 0;
    const sync = () => {
      const wKey = world.current?.selectedCategory;
      if (wKey && wKey !== selectedKey) {
        setSelectedKey(wKey);
      }
      id = requestAnimationFrame(sync);
    };
    id = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(id);
  }, [world, selectedKey]);

  const activeVertical =
    DISCOVERY_VERTICALS.find((v) => v.key === selectedKey) ?? DISCOVERY_VERTICALS[0];

  const handleSelectCategory = (key: string) => {
    setSelectedKey(key);
    if (world.current) {
      world.current.selectedCategory = key;
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-[1340px] flex-col justify-between gap-8 px-5 lg:flex-row lg:items-end lg:px-10">
      {/* Left: Open Asymmetric Editorial Typography & Hairline 3-Beat Strip */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto max-w-xl bg-[#FAF6EE]/82 p-5 sm:p-6 backdrop-blur-md border-l border-[#8C6D46]/35 shadow-[0_18px_45px_rgba(44,34,20,0.08)]">
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

        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#4B433B]">
          {c.sub}
        </p>

        <div className="mt-5 space-y-2 border-l border-[#8C6D46]/40 pl-4">
          {c.scenes.map((scene, idx) => {
            const active = activeBeat === idx;
            return (
              <button
                key={scene.step}
                type="button"
                onClick={() => setActiveBeat(idx)}
                className={`block w-full text-left transition-opacity ${
                  active ? "opacity-100" : "opacity-55 hover:opacity-90"
                }`}
              >
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-[10px] text-[#7A5B34]">{scene.step}</span>
                  <span className="text-sm font-medium text-[#1C1917]">{scene.title}</span>
                </div>
                {active && (
                  <p className="mt-0.5 pl-5 text-xs leading-relaxed text-[#4B433B]">
                    {scene.desc}
                  </p>
                )}
              </button>
            );
          })}
        </div>

        {/* Hairline Vertical Selector (zero pill bubbles) */}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#1C1917]/12 pt-3.5">
          {DISCOVERY_VERTICALS.map((v) => {
            const active = selectedKey === v.key;
            return (
              <button
                key={v.key}
                type="button"
                onClick={() => handleSelectCategory(v.key)}
                className={`border-b pb-0.5 font-mono text-[10px] tracking-wider uppercase transition-all ${
                  active
                    ? "border-[#7A5B34] text-[#7A5B34]"
                    : "border-transparent text-[#1C1917]/55 hover:text-[#1C1917]"
                }`}
              >
                {t(`categories.${v.key}`)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right: Frameless Vellum & Bronze Photographic Plate */}
      <div className="pointer-events-none group-data-[interactive=true]:pointer-events-auto w-full max-w-[350px] shrink-0 border-l border-t border-[#8C6D46]/35 bg-[#FAF6EE]/90 p-3 backdrop-blur-md shadow-[0_20px_50px_rgba(44,34,20,0.10)]">
        <div className="relative h-28 w-full overflow-hidden sm:h-40">
          <img
            src={activeVertical.image}
            alt={t(`categories.${activeVertical.key}`)}
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1917]/75 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-3 font-mono text-[10px] tracking-widest uppercase text-[#F5EFE6]">
            {t(`categories.${activeVertical.key}`)} · 0 UZS FEE
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-b border-[#1C1917]/12 pb-2.5 text-xs text-[#1C1917]">
          <span className="inline-flex items-center gap-2">
            {activeBeat === 0 && <Compass size={13} className="text-[#7A5B34]" />}
            {activeBeat === 1 && <Scissors size={13} className="text-[#7A5B34]" />}
            {activeBeat === 2 && <CalendarCheck size={13} className="text-[#7A5B34]" />}
            <span>{c.scenes[activeBeat].title}</span>
          </span>
        </div>

        <a
          href={TELEGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex w-full items-center justify-between font-mono text-[11px] tracking-wider uppercase text-[#1C1917] transition-colors hover:text-[#7A5B34]"
        >
          <span>{c.cta}</span>
          <ArrowUpRight size={14} className="text-[#7A5B34]" />
        </a>
      </div>
    </div>
  );
}
