import { ArrowRight, ArrowUpRight, CalendarCheck, Compass, Scissors } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useSEO } from "../hooks/useSEO";
import { usePartnerModal } from "../context/PartnerModalContext";
import { normalizeLang, STORY_CONTENT } from "../content/storyContent";
import { TELEGRAM_URL } from "../lib/constants";

const PAGE_COPY = {
  uz: {
    seoTitle: "Xizmatlar va Toifalar — SmartChair Online Navbat",
    seoDesc:
      "Sartaroshxona, soch saloni, manikyur, spa, massaj, kosmetologiya va qosh-kiprik studiyalariga 0 so'm komissiya bilan Telegram orqali yoziling.",
    eyebrow: "SmartChair · Mijozlar uchun qo'llanma",
    h1: "O'zbekistondagi barcha go'zallik va parvarish xizmatlari bitta tizimda",
    lead: "Har bir yo'nalish o'ziga xos ustalik va parvarish madaniyatini talab qiladi. SmartChair orqali yaqin salonlarni xaritadan toping, aniq so'm narxlarini ko'ring va qo'ng'iroqsiz navbat oling.",
    ownerCta: "Saloningizni qo'shing",
    backTo3D: "3D Galereyaga qaytish",
  },
  ru: {
    seoTitle: "Услуги и категории — Онлайн-запись SmartChair",
    seoDesc:
      "Онлайн-запись в барбершопы, парикмахерские, нейл-студии, спа, массаж, косметологию и студии визажа в Узбекистане с 0 сум комиссии.",
    eyebrow: "SmartChair · Гид для клиентов",
    h1: "Все направления красоты и ухода Узбекистана в одной системе",
    lead: "Каждое направление требует своего мастерства. Находите проверенные салоны на карте, сравнивайте цены в сумах и бронируйте визит в Telegram без лишних звонков.",
    ownerCta: "Подключить салон",
    backTo3D: "Вернуться в 3D-галерею",
  },
  en: {
    seoTitle: "Services & Categories — SmartChair Online Booking",
    seoDesc:
      "Book barbershops, hair ateliers, nail studios, spas, massage, cosmetology, and brow studios across Uzbekistan with 0 UZS customer fee.",
    eyebrow: "SmartChair · Client Craft Guide",
    h1: "Every grooming and beauty craft in Uzbekistan, connected in one calm place",
    lead: "Each discipline has its own rhythm and tools. Discover local establishments on the map, compare real UZS pricing and durations, and confirm in Telegram with zero phone tag.",
    ownerCta: "Connect Your Salon",
    backTo3D: "Return to 3D Gallery",
  },
} as const;

export function ServicesPage() {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);
  const c = PAGE_COPY[lang];
  const act3 = STORY_CONTENT[lang].act3;
  const { openPartnerModal } = usePartnerModal();

  useSEO({
    title: c.seoTitle,
    description: c.seoDesc,
    canonicalPath: "/services",
  });

  return (
    <div className="mx-auto max-w-[1160px] px-6 pt-28 pb-20 lg:px-8">
      <div className="max-w-2xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#d4af5a]">
          {c.eyebrow}
        </p>
        <h1 className="mt-3 font-editorial text-4xl italic tracking-[-0.02em] text-text sm:text-5xl">
          {c.h1}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-text-secondary">
          {c.lead}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex h-11 items-center gap-2 rounded-[10px] px-5 text-sm font-medium"
          >
            <span>{act3.cta}</span>
            <ArrowUpRight size={15} />
          </a>
          <button
            type="button"
            onClick={openPartnerModal}
            className="btn-secondary inline-flex h-11 items-center gap-2 rounded-[10px] border border-white/15 px-5 text-sm font-medium"
          >
            <span>{c.ownerCta}</span>
            <ArrowRight size={15} />
          </button>
          <Link
            to="/"
            className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-text-muted transition-colors hover:text-text"
          >
            {c.backTo3D}
          </Link>
        </div>
      </div>

      {/* 3-Step Client Booking Journey */}
      <section className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
        {act3.steps.map((s, idx) => (
          <div
            key={s.step}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
          >
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#d4af5a]">
              {idx === 0 && <Compass size={14} />}
              {idx === 1 && <Scissors size={14} />}
              {idx === 2 && <CalendarCheck size={14} />}
              <span>{s.step}</span>
            </div>
            <h2 className="mt-2.5 text-lg font-medium text-text">{s.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* All 8 Category Photography & Curator Stories */}
      <section className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {act3.categories.map((cat) => (
          <article
            key={cat.key}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src={cat.image}
                alt={cat.alt}
                width={640}
                height={400}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute bottom-3 left-4 font-mono text-[11px] uppercase tracking-widest text-[#d4af5a]">
                {t(`categories.${cat.key}`)} · 0 UZS
              </span>
            </div>
            <div className="p-5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-[#d4af5a]">
                {cat.sculptureTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {cat.curatorNote}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
