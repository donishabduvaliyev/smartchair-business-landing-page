export interface SceneCard {
  badge: string;
  title: string;
  metric?: string;
  items?: { label: string; value: string; accent?: boolean }[];
}

export interface SceneData {
  id: string;
  slate: string;
  hud: string;
  title: string;
  subtitle: string;
  meta?: string;
  lens: number;
  a: number;
  b: number;
  card?: SceneCard;
}

export type LangCode = "uz" | "ru" | "en";

export const FOCUS_KEYS: { p: number; d: number }[] = [
  { p: 0.0, d: 24 }, { p: 0.06, d: 9 },
  { p: 0.14, d: 18 }, { p: 0.21, d: 12 },
  { p: 0.3, d: 30 }, { p: 0.37, d: 14 },
  { p: 0.45, d: 22 }, { p: 0.53, d: 16 },
  { p: 0.62, d: 11 }, { p: 0.69, d: 19 },
  { p: 0.76, d: 7 },
  { p: 0.86, d: 10 }, { p: 0.93, d: 16 }, { p: 1.0, d: 12 },
];

export const SCENES_BY_LANG: Record<LangCode, SceneData[]> = {
  en: [
    {
      id: "origin",
      slate: "Sc. 01 / Entrance",
      hud: "Reception",
      title: "Every chair booked, <b>every sum</b> accounted for.",
      subtitle: "Your paper diary knows who is coming in at four. SmartChair turns it into 24/7 Telegram bookings, walk-in QR queues, and automated cashier control.",
      meta: "Live in Uzbekistan · Zero client app download · uz / ru / en",
      lens: 40, a: 0.0, b: 0.098,
    },
    {
      id: "craft",
      slate: "Sc. 02 / Discovery",
      hud: "Telegram App",
      title: "Booking with <b>nothing to download</b>.",
      subtitle: "Clients open Telegram, browse nearby barbershops on the live map, compare transparent UZS prices, and lock their chair in one tap.",
      lens: 28, a: 0.098, b: 0.246,
      card: {
        badge: "TELEGRAM MINI APP",
        title: "Top Blade Barbershop",
        metric: "0.4 km · Open",
        items: [
          { label: "Haircut + Beard · 60 min", value: "110,000 UZS", accent: true },
          { label: "Next Available Slot", value: "16:00 Today" },
        ],
      },
    },
    {
      id: "smartchair",
      slate: "Sc. 03 / Cutting Floor",
      hud: "Walk-In QR",
      title: "Turn street walk-ins into an <b>orderly live queue</b>.",
      subtitle: "Place a custom QR stand at reception. Walk-in guests scan, pick a specialist or next free chair, and stay synced with online bookings.",
      lens: 24, a: 0.246, b: 0.407,
      card: {
        badge: "RECEPTION QR QUEUE",
        title: "Unified Live Timeline",
        metric: "3 Active",
        items: [
          { label: "#B-09 · Bekzod (Telegram)", value: "In Chair", accent: true },
          { label: "#A-14 · Aziz (Walk-in QR)", value: "~12 min wait" },
        ],
      },
    },
    {
      id: "slots",
      slate: "Sc. 04 / Slot Engine",
      hud: "Slot Engine",
      title: "Four constraints, <b>one free hour</b>.",
      subtitle: "Chair capacity, master hours, service qualifications, and existing bookings calculated in real time—so two clients never arrive for one chair.",
      lens: 50, a: 0.407, b: 0.564,
      card: {
        badge: "REAL-TIME TELEMETRY",
        title: "Chair Utilization",
        metric: "94% Bandlik",
        items: [
          { label: "Double-Booking Conflicts", value: "0.0%", accent: true },
          { label: "Active Masters Today", value: "6 / 6 Online" },
        ],
      },
    },
    {
      id: "lifecycle",
      slate: "Sc. 05 / Retention",
      hud: "Lifecycle",
      title: "Discover. Book. <b>Come back</b>.",
      subtitle: "Automated Telegram reminders 2 hours before every visit, favorite master shortcuts, and 1-tap rebooking eliminate no-shows.",
      lens: 35, a: 0.564, b: 0.712,
      card: {
        badge: "RETENTION ENGINE",
        title: "Automated Telegram Reminders",
        metric: "-68% No-Shows",
        items: [
          { label: "2h Prior Alert Delivered", value: "100% Read", accent: true },
          { label: "1-Tap Rebook Rate", value: "3.4x Higher" },
        ],
      },
    },
    {
      id: "surface",
      slate: "Sc. 06 / Station",
      hud: "Station 01",
      title: "Precision, inside <b>every station</b>.",
      subtitle: "Every specialist sees their personal schedule, client preferences, and service notes right on their phone—zero front-desk shouting.",
      lens: 65, a: 0.712, b: 0.83,
      card: {
        badge: "STATION 01 // LIVE",
        title: "Sardor K. — Senior Barber",
        metric: "6 Slots Today",
        items: [
          { label: "14:30 · Fade & Soqol", value: "180,000 UZS", accent: true },
          { label: "15:30 · Royal Shave (VIP)", value: "240,000 UZS" },
        ],
      },
    },
    {
      id: "system",
      slate: "Sc. 07 / Backroom",
      hud: "Cashier",
      title: "Clean <b>Z-reports</b> at daily close.",
      subtitle: "Track cash, Uzcard/Humo, and Click/Payme totals, calculate master commissions automatically, and close the register in 30 seconds.",
      lens: 28, a: 0.83, b: 0.924,
      card: {
        badge: "DAILY Z-REPORT",
        title: "Shift Close Summary",
        metric: "2,640,000 UZS",
        items: [
          { label: "Completed Visits", value: "24 Services", accent: true },
          { label: "Staff Commission Split", value: "Auto-Calculated" },
        ],
      },
    },
    {
      id: "end",
      slate: "Sc. 08 / Partner",
      hud: "Connect",
      title: "If it still runs on <b>paper</b>, let's talk.",
      subtitle: "Leave your salon details below. Our team connects your chairs, configures your masters, and launches your Telegram booking bot within 24 hours.",
      lens: 40, a: 0.924, b: 1.02,
    },
  ],
  uz: [
    {
      id: "origin",
      slate: "Sc. 01 / Kirish",
      hud: "Resepshn",
      title: "Har bir kreslo band, <b>har bir so'm</b> hisobda.",
      subtitle: "Qog'oz daftar soat to'rtda kim kelishini biladi. SmartChair esa uni 24/7 Telegram bron, jonli QR navbat va aniq kassa nazoratiga aylantiradi.",
      meta: "O'zbekiston bo'ylab · Ilova yuklash shart emas · uz / ru / en",
      lens: 40, a: 0.0, b: 0.098,
    },
    {
      id: "craft",
      slate: "Sc. 02 / Katalog",
      hud: "Telegram Ilova",
      title: "Mijozlar uchun <b>hech narsa yuklamasdan</b> bron.",
      subtitle: "Mijozlar Telegramni ochadi, xaritadan yaqin barbershopni topadi, aniq narxlarni ko'radi va bir bosishda joy band qiladi.",
      lens: 28, a: 0.098, b: 0.246,
      card: {
        badge: "TELEGRAM MINI APP",
        title: "Top Blade Barbershop",
        metric: "0.4 km · Ochiq",
        items: [
          { label: "Soch + Soqol · 60 daq", value: "110 000 UZS", accent: true },
          { label: "Eng yaqin bo'sh vaqt", value: "Bugun 16:00" },
        ],
      },
    },
    {
      id: "smartchair",
      slate: "Sc. 03 / Zal",
      hud: "QR Navbat",
      title: "Ko'chadan kirgan mijozlarni <b>jonli navbatga</b> oling.",
      subtitle: "Resepshnga maxsus QR stend qo'ying. Kirgan mehmon skanerlaydi, ustani tanlaydi va onlayn kalendar bilan bir vaqtda navbat oladi.",
      lens: 24, a: 0.246, b: 0.407,
      card: {
        badge: "RESEPSHN QR NAVBAT",
        title: "Yagona Jonli Jadval",
        metric: "3 ta faol",
        items: [
          { label: "#B-09 · Bekzod (Telegram)", value: "Kresloda", accent: true },
          { label: "#A-14 · Aziz (QR navbat)", value: "~12 daq kutish" },
        ],
      },
    },
    {
      id: "slots",
      slate: "Sc. 04 / Slot Dvigateli",
      hud: "Slot Engine",
      title: "To'rtta cheklov, <b>bitta bo'sh soat</b>.",
      subtitle: "Kreslo sig'imi, usta grafigi, malakasi va band vaqtlar real vaqtda hisoblanadi — bitta kresloga ikki mijoz hech qachon to'g'ri kelmaydi.",
      lens: 50, a: 0.407, b: 0.564,
      card: {
        badge: "REAL-VAQT TELEMETRIYA",
        title: "Kreslo Bandligi",
        metric: "94% Bandlik",
        items: [
          { label: "Vaqt to'qnashuvlari", value: "0.0%", accent: true },
          { label: "Faol ustalar", value: "6 / 6 Onlayn" },
        ],
      },
    },
    {
      id: "lifecycle",
      slate: "Sc. 05 / Qaytish",
      hud: "Eslatmalar",
      title: "Toping. Bron qiling. <b>Yana qayting</b>.",
      subtitle: "Tashrifdan 2 soat oldin avtomatik Telegram eslatmalar va 1 bosishda qayta bron qilish mijoz kelmay qolishini keskin kamaytiradi.",
      lens: 35, a: 0.564, b: 0.712,
      card: {
        badge: "RETENTION TIZIMI",
        title: "Avtomatik Eslatmalar",
        metric: "-68% Kechikish",
        items: [
          { label: "2 soat oldingi xabar", value: "100% O'qiladi", accent: true },
          { label: "Qayta bron qilish", value: "3.4x Ko'proq" },
        ],
      },
    },
    {
      id: "surface",
      slate: "Sc. 06 / Ish Joyi",
      hud: "Stansiya 01",
      title: "Har bir stansiyada <b>aniq tartib</b>.",
      subtitle: "Har bir usta o'zining shaxsiy jadvali va mijoz istaklarini telefonida ko'rib turadi — ortiqcha shovqinsiz.",
      lens: 65, a: 0.712, b: 0.83,
      card: {
        badge: "STANSIYA 01 // JONLI",
        title: "Sardor K. — Top Usta",
        metric: "6 ta bron",
        items: [
          { label: "14:30 · Fade & Soqol", value: "180 000 UZS", accent: true },
          { label: "15:30 · Royal Shave (VIP)", value: "240 000 UZS" },
        ],
      },
    },
    {
      id: "system",
      slate: "Sc. 07 / Kassa",
      hud: "Kassa",
      title: "Kun yakunida toza <b>Z-hisobotlar</b>.",
      subtitle: "Naqd, karta va Payme/Click tushumlarini kuzating, ustalar foizini avtomatik hisoblang va kassani 30 soniyada yoping.",
      lens: 28, a: 0.83, b: 0.924,
      card: {
        badge: "KUNLIK Z-HISOBOT",
        title: "Smena Yakuni",
        metric: "2 640 000 UZS",
        items: [
          { label: "Yakunlangan xizmatlar", value: "24 ta mijoz", accent: true },
          { label: "Ustalar ulushi", value: "Avto-hisob" },
        ],
      },
    },
    {
      id: "end",
      slate: "Sc. 08 / Hamkorlik",
      hud: "Ulanish",
      title: "Saloningiz hali ham <b>qog'ozda</b> bo'lsa, bog'laning.",
      subtitle: "Ma'lumotlaringizni qoldiring. Jamoamiz 24 soat ichida kreslolarni sozlab, Telegram bron tizimini ishga tushirib beradi.",
      lens: 40, a: 0.924, b: 1.02,
    },
  ],
  ru: [
    {
      id: "origin",
      slate: "Sc. 01 / Вход",
      hud: "Ресепшн",
      title: "Каждое кресло занято, <b>каждый сум</b> учтён.",
      subtitle: "Бумажный журнал помнит, кто придёт в четыре. SmartChair превращает его в Telegram-запись 24/7, QR-очередь и точный кассовый контроль.",
      meta: "Работает в Узбекистане · Без скачивания приложений · uz / ru / en",
      lens: 40, a: 0.0, b: 0.098,
    },
    {
      id: "craft",
      slate: "Sc. 02 / Поиск",
      hud: "Telegram App",
      title: "Запись без <b>установки приложений</b>.",
      subtitle: "Клиенты открывают Telegram, находят ближайший барбершоп на карте, видят честные цены в сумах и бронируют кресло в один тап.",
      lens: 28, a: 0.098, b: 0.246,
      card: {
        badge: "TELEGRAM MINI APP",
        title: "Top Blade Barbershop",
        metric: "0.4 км · Открыто",
        items: [
          { label: "Стрижка + Борода · 60 мин", value: "110 000 UZS", accent: true },
          { label: "Ближайший слот", value: "Сегодня 16:00" },
        ],
      },
    },
    {
      id: "smartchair",
      slate: "Sc. 03 / Зал",
      hud: "QR-Очередь",
      title: "Превратите гостей с улицы в <b>живую очередь</b>.",
      subtitle: "Поставьте QR-стойку на ресепшне. Гости сканируют код, выбирают мастера и попадают в единое расписание с онлайн-записями.",
      lens: 24, a: 0.246, b: 0.407,
      card: {
        badge: "QR-ОЧЕРЕДЬ РЕСЕПШН",
        title: "Единое расписание",
        metric: "3 активных",
        items: [
          { label: "#B-09 · Бекзод (Telegram)", value: "В кресле", accent: true },
          { label: "#A-14 · Азиз (QR-вход)", value: "~12 мин ожидания" },
        ],
      },
    },
    {
      id: "slots",
      slate: "Sc. 04 / Слот-движок",
      hud: "Slot Engine",
      title: "Четыре фильтра, <b>один свободный час</b>.",
      subtitle: "Количество кресел, график мастера, специализация и текущие записи проверяются мгновенно — никаких накладок.",
      lens: 50, a: 0.407, b: 0.564,
      card: {
        badge: "ТЕЛЕМЕТРИЯ ЗАЛА",
        title: "Загрузка кресел",
        metric: "94% Загрузка",
        items: [
          { label: "Накладки записей", value: "0.0%", accent: true },
          { label: "Мастера в смене", value: "6 / 6 Онлайн" },
        ],
      },
    },
    {
      id: "lifecycle",
      slate: "Sc. 05 / Возврат",
      hud: "Напоминания",
      title: "Найти. Записаться. <b>Вернуться</b>.",
      subtitle: "Автоматические напоминания в Telegram за 2 часа до визита и повторная запись в один клик сводят неявки к минимуму.",
      lens: 35, a: 0.564, b: 0.712,
      card: {
        badge: "ВОЗВРАТ КЛИЕНТОВ",
        title: "Авто-напоминания Telegram",
        metric: "-68% Неявок",
        items: [
          { label: "Уведомление за 2 часа", value: "100% Доставка", accent: true },
          { label: "Повторные визиты", value: "В 3.4 раза чаще" },
        ],
      },
    },
    {
      id: "surface",
      slate: "Sc. 06 / Рабочее место",
      hud: "Станция 01",
      title: "Точность у <b>каждого зеркала</b>.",
      subtitle: "Каждый мастер видит своё расписание и заметки по клиентам прямо в телефоне — без лишних вопросов администратору.",
      lens: 65, a: 0.712, b: 0.83,
      card: {
        badge: "СТАНЦИЯ 01 // ОНЛАЙН",
        title: "Сардор К. — Топ-барбер",
        metric: "6 записей",
        items: [
          { label: "14:30 · Fade & Борода", value: "180 000 UZS", accent: true },
          { label: "15:30 · Королевское бритьё", value: "240 000 UZS" },
        ],
      },
    },
    {
      id: "system",
      slate: "Sc. 07 / Касса",
      hud: "Z-Отчёт",
      title: "Чистые <b>Z-отчёты</b> при закрытии смены.",
      subtitle: "Учёт наличных, карт и переводов, автоматический расчёт процентов мастеров и закрытие смены за 30 секунд.",
      lens: 28, a: 0.83, b: 0.924,
      card: {
        badge: "ДНЕВНОЙ Z-ОТЧЁТ",
        title: "Итоги смены",
        metric: "2 640 000 UZS",
        items: [
          { label: "Выполнено визитов", value: "24 услуги", accent: true },
          { label: "Выплаты мастерам", value: "Авто-расчёт" },
        ],
      },
    },
    {
      id: "end",
      slate: "Sc. 08 / Подключение",
      hud: "Заявка",
      title: "Если вы всё ещё в <b>тетради</b>, давайте начнём.",
      subtitle: "Оставьте контакты салона. Наша команда настроит кресла, мастеров и запустит вашего Telegram-бота за 24 часа.",
      lens: 40, a: 0.924, b: 1.02,
    },
  ],
};

// Default SCENES for Rig.tsx lens & timing calculations (geometry is identical across langs)
export const SCENES = SCENES_BY_LANG.en;
