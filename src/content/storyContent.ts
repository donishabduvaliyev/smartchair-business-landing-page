export type LangCode = "uz" | "ru" | "en";
export type OpsModuleKey = "requests" | "queue" | "register" | "crm";

export interface CategoryStory {
  key: "barber" | "hair" | "nails" | "massage" | "spa" | "cosmetology" | "makeup" | "browsLashes";
  nicheKey: "barber" | "hair" | "spa" | "cosmetology" | "nails" | "browsLashes";
  image: string;
  alt: string;
  sculptureTitle: string;
  curatorNote: string;
}

export interface ChapterStoryBundle {
  act1: {
    h1: string;
    storyLead: string;
    scrollCue: string;
  };
  act2: {
    tether: string;
    eyebrow: string;
    heading: string;
    body: string;
    cta: string;
  };
  act3: {
    tether: string;
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    sub: string;
    steps: readonly { step: string; title: string; desc: string }[];
    cta: string;
    categories: readonly CategoryStory[];
  };
  act4: {
    tether: string;
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    sub: string;
    cta: string;
    modules: readonly {
      key: OpsModuleKey;
      num: string;
      monument: string;
      title: string;
      curatorNote: string;
      desc: string;
    }[];
    demo: {
      requestsTitle: string;
      requestItem: string;
      requestMeta: string;
      accept: string;
      decline: string;
      accepted: string;
      declined: string;
      reset: string;
      queueTitle: string;
      queueOnlineLabel: string;
      queueOnlineBadge: string;
      queueWalkInLabel: string;
      queueWalkInBadge: string;
      registerTitle: string;
      registerMethods: readonly string[];
      crmTitle: string;
      crmReminderLabel: string;
      crmReminderBadge: string;
      crmNotesLabel: string;
      crmNotesBadge: string;
    };
  };
  act5: {
    tether: string;
    eyebrow: string;
    headline: string;
    sub: string;
    faqTitle: string;
    faqs: readonly { q: string; a: string }[];
  };
}

export const STORY_CONTENT: Record<LangCode, ChapterStoryBundle> = {
  uz: {
    act1: {
      h1: "O'zbekistondagi sartaroshxona va go'zallik salonlariga online navbat va boshqaruv tizimi",
      storyLead:
        "Har bir salon ustaning qo'l mehnati va ishonchidan boshlanadi. Ammo tinimsiz telefon qo'ng'iroqlari, qog'oz daftarlar va yo'qolgan mijoz yozuvlari e'tiborni kreslodan chalg'itadi. SmartChair mijoz navbati va salon boshqaruvini bitta sokin tizimga birlashtiradi.",
      scrollCue: "Ichkariga kirish uchun pastga suring",
    },
    act2: {
      tether: "Usta kreslosi · Ko'zgu ostonasi",
      eyebrow: "II bob · Ko'zgu ortidagi tartib",
      heading: "Oddiy kreslodan — san'at darajasidagi tizimga.",
      body: "Kreslo ko'zguga qarab eriganda, qo'l mehnati raqamli tartib bilan birlashadi. Mijozning Telegramdagi bir bosishi to'g'ridan-to'g'ri ustaning bo'sh vaqti va kassa hisobi bilan bog'lanadi.",
      cta: "Ustalar galereyasiga o'tish",
    },
    act3: {
      tether: "San'at nishasi · Mijoz kashfiyoti",
      eyebrow: "III bob · Go'zallik san'ati galereyasi",
      headline: "Toping. Tanlang.",
      headlineAccent: "Telegramda bron qiling.",
      sub: "Istalgan haykal yoki yo'nalishni tanlang — kamera o'sha hunarga bag'ishlangan nisha tomon buriladi. Mijozlar yaqin salonlarni xaritadan topadi va 0 so'm komissiya bilan yoziladi.",
      steps: [
        {
          step: "I",
          title: "Joyni xaritadan toping",
          desc: "O'zbekiston shaharlari va tumanlari bo'ylab sartaroshxona, salon va spa markazlarini ko'ring.",
        },
        {
          step: "II",
          title: "Usta va narxni solishtiring",
          desc: "Har bir xizmatning aniq so'm narxi, davomiyligi va bo'sh soatlari qo'ng'iroqsiz ko'rinadi.",
        },
        {
          step: "III",
          title: "Telegramda 1 tegishda band qiling",
          desc: "So'rov darhol salonga boradi, tashrifdan oldin esa Telegramda avtomatik eslatma keladi.",
        },
      ],
      cta: "Telegram ilovani ochish",
      categories: [
        {
          key: "barber",
          nicheKey: "barber",
          image: "/images/craft-shears.webp",
          alt: "Klassik erkaklar sartaroshxonasi qaychi va soqol parvarishi anjomlari",
          sculptureTitle: "Klassik yunon haykali · Erkaklar sartaroshligi",
          curatorNote:
            "Antik mutanosiblik timsoli — erkaklar soch turmagi va soqol parvarishi uchun aniq vaqtni oldindan band qilish.",
        },
        {
          key: "hair",
          nicheKey: "hair",
          image: "/images/hair-atelier.webp",
          alt: "Yorug' marmar ustidagi bronza ko'zgu va soch parvarishi cho'tkasi",
          sculptureTitle: "Bronza ko'zgu · Soch san'ati",
          curatorNote:
            "Ko'zgu va siluet uyg'unligi — bo'yash, ukladka va muolajalar davomiyligi bo'yicha ustani tanlash.",
        },
        {
          key: "nails",
          nicheKey: "nails",
          image: "/images/nail-studio.webp",
          alt: "Marmar stoldagi manikyur flakonlari va toza zig'ir sochiq",
          sculptureTitle: "Oltin marosim kosalari · Manikyur va pedikyur",
          curatorNote:
            "Qo'l parvarishi aniqligi — manikyur, qoplama va dizayn bo'yicha bo'sh soatlarni navbatsiz band qilish.",
        },
        {
          key: "spa",
          nicheKey: "spa",
          image: "/images/spa-sanctuary.webp",
          alt: "Marmar havza, yumshoq oq sochiqlar va botanika moylari",
          sculptureTitle: "Antik amfora · Spa va hordiq",
          curatorNote:
            "Issiq tosh va efir moylari marosimi — hammom, bug' va spa muolajalariga tinch vaqtni rejalashtirish.",
        },
        {
          key: "massage",
          nicheKey: "spa",
          image: "/images/spa-sanctuary.webp",
          alt: "Spa va massaj xonasidagi tabiiy toshlar va efir moyi",
          sculptureTitle: "Antik amfora · Tiklovchi massaj",
          curatorNote:
            "Tana muvozanati — klassik, sport va tiklovchi massaj seanslarini qulay soatga belgilash.",
        },
        {
          key: "cosmetology",
          nicheKey: "cosmetology",
          image: "/images/cosmetology-skin.webp",
          alt: "Marmar ustidagi shaffof zardob tomizgichlari va teri parvarishi idishlari",
          sculptureTitle: "Apoteka idishi · Estetik kosmetologiya",
          curatorNote:
            "Toza teri parvarishi — kosmetolog maslahati va muolajalarga shaxsiy tashrif jadvali.",
        },
        {
          key: "browsLashes",
          nicheKey: "browsLashes",
          image: "/images/brows-makeup.webp",
          alt: "Travertin ustidagi qosh pinseti, cho'tkalar va bronza ko'zgu",
          sculptureTitle: "Oltin kesim porgari · Qosh va kiprik",
          curatorNote:
            "Nigoh mutanosibligi — qosh arxitekturasi va kiprik laminatsiyasi ustalariga tezkor yozilish.",
        },
        {
          key: "makeup",
          nicheKey: "browsLashes",
          image: "/images/brows-makeup.webp",
          alt: "Tabiiy yorug'likdagi vizaj cho'tkalari va kompakt ko'zgu",
          sculptureTitle: "Oltin kesim porgari · Vizaj studiyasi",
          curatorNote:
            "Tantana va kundalik obraz — vizajist bilan aniq soatni oldindan band qilib qo'yish.",
        },
      ],
    },
    act4: {
      tether: "Vaqt rotundasi · Boshqaruv markazi",
      eyebrow: "IV bob · Vaqt va tartib rotundasi",
      headline: "Tartibsizlik aniq",
      headlineAccent: "ritmga aylanadi.",
      sub: "Panteon nuri ostida markaziy kreslo Rim soatiga tayanadi. To'rtta ustundan istalgan birini tanlang va tizim har bir jarayonni qanday yagona nazoratda ushlab turishini ko'ring.",
      cta: "Resepshn stoliga o'tish",
      modules: [
        {
          key: "requests",
          num: "01",
          monument: "Horologium · Cho'ntak soati",
          title: "Bron so'rovlari va Smenalar",
          curatorNote: "Har bir so'rov ustaning real ish grafigiga tushadi.",
          desc: "Telegram va veb orqali kelgan arizalarni bir bosishda tasdiqlang, rad eting yoki boshqa vaqtga ko'chiring.",
        },
        {
          key: "queue",
          num: "02",
          monument: "Porta QR · Marmar QR-stela",
          title: "Jonli Walk-In QR Navbat",
          curatorNote: "Ko'chadan kirgan mehmonlar onlayn bronlar bilan to'qnashmaydi.",
          desc: "Mehmon peshtaxtadagi QR kodni skanerlab jonli navbatga yoziladi va kutish raqamini oladi.",
        },
        {
          key: "register",
          num: "03",
          monument: "Thesaurus · Salon kassasi",
          title: "Kassa va Z-hisobotlar",
          curatorNote: "Kreslodagi har bir xizmat shaffof moliyaviy chekka aylanadi.",
          desc: "Naqd, Terminal, Click va Payme to'lovlarini qayd eting, smena oxirida Z-hisobot va ustalar ulushini yoping.",
        },
        {
          key: "crm",
          num: "04",
          monument: "Archivum · Mijozlar kodeksi",
          title: "Mijozlar bazasi va Eslatmalar",
          curatorNote: "Bir marta kelgan mehmon doimiy mijozga aylanadi.",
          desc: "Tashriflar tarixi, usta qaydlari hamda avtomatik Telegram eslatmalari va qayta chaqirish xabarlari.",
        },
      ],
      demo: {
        requestsTitle: "Yangi so'rov · Telegram Bot",
        requestItem: "15:00 · Sartarosh Kreslosi #2",
        requestMeta: "45 daqiqa · Smena tekshirilgan",
        accept: "Tasdiqlash",
        decline: "Rad etish",
        accepted: "Tasdiqlandi · Mijozga xabar ketdi",
        declined: "Rad etildi · Vaqt bo'shatildi",
        reset: "Qayta ko'rish",
        queueTitle: "Resepshn QR Navbati",
        queueOnlineLabel: "Onlayn bronlar · Jadval",
        queueOnlineBadge: "Sinxron",
        queueWalkInLabel: "Walk-In QR (/waitlist/:shopId)",
        queueWalkInBadge: "Jonli navbat",
        registerTitle: "Smena kassa jurnali",
        registerMethods: ["Naqd pul", "Terminal", "Click", "Payme"],
        crmTitle: "Mijoz arxivi va Eslatmalar",
        crmReminderLabel: "Tashrifdan oldingi Telegram eslatma",
        crmReminderBadge: "Avtomatik",
        crmNotesLabel: "Mijoz tarixi va usta qaydlari",
        crmNotesBadge: "Faol",
      },
    },
    act5: {
      tether: "Atelier Ro'yxati · Hamkorlik",
      eyebrow: "V bob · SmartChair Atelier Ro'yxati",
      headline: "Saloningizni yagona jonli tizimga ulang.",
      sub: "Ariza qoldiring — jamoamiz 24 soat ichida saloningiz profili, ustalar grafigi va Telegram bron botingizni ishga tushirib beradi.",
      faqTitle: "Ko'p beriladigan savollar",
      faqs: [
        {
          q: "SmartChair orqali qanday qilib navbat band qilaman?",
          a: "Telegram botimiz (@SmartChairNamanganbot) yoki veb-sayt orqali yaqin sartaroshxona yoxud go'zallik salonini tanlang, usta va bo'sh soatni belgilab so'rov yuboring.",
        },
        {
          q: "Mijozlar uchun navbat olish pullikmi?",
          a: "Yo'q. Mijozlar uchun SmartChair platformasi orqali qidirish va vaqt band qilish 100% bepul (0 so'm). To'lov faqat salonda ko'rsatilgan xizmat uchun amalga oshiriladi.",
        },
        {
          q: "Sartaroshxonam yoki salonimni qanday ulayman?",
          a: "Shu bo'limdagi ro'yxat formasini to'ldiring yoki +998 94 982 70 70 raqamiga qo'ng'iroq qiling. Jamoamiz 24 soat ichida saloningizni sozlab beradi.",
        },
        {
          q: "SmartChair tashriflarni eslatish va boshqarishda qanday yordam beradi?",
          a: "Platforma kelgan bronlarni bitta jadvalga yig'adi, walk-in QR navbat bilan sinxronlaydi hamda mijozlarga tashrifdan oldin avtomatik Telegram eslatmalarini yuboradi.",
        },
      ],
    },
  },
  ru: {
    act1: {
      h1: "Онлайн-запись и система управления для барбершопов и салонов красоты в Узбекистане",
      storyLead:
        "Каждый салон начинается с мастерства в кресле. Но постоянные звонки, бумажные тетради и потерянные записи отвлекают от самого ремесла. SmartChair объединяет запись клиентов и операции салона в единой спокойной системе.",
      scrollCue: "Листайте, чтобы войти",
    },
    act2: {
      tether: "Кресло мастера · Порог зеркала",
      eyebrow: "Глава II · Порядок за зеркалом",
      heading: "От обычного кресла — к искусству точности.",
      body: "Когда физическое кресло растворяется в зеркале, ремесло встречается с цифровым порядком. Одно касание клиента в Telegram напрямую синхронизируется с расписанием мастеров и кассовым журналом.",
      cta: "Войти в галерею мастеров",
    },
    act3: {
      tether: "Ниша искусства · Поиск мастера",
      eyebrow: "Глава III · Галерея мастерства красоты",
      headline: "Найти. Выбрать.",
      headlineAccent: "Бронь в Telegram.",
      sub: "Нажмите на любую скульптуру или категорию — камера повернётся к соответствующей нише. Клиенты находят салоны на карте, видят цены в сумах и бронируют визит без комиссии.",
      steps: [
        {
          step: "I",
          title: "Найдите место на карте",
          desc: "Ищите барбершопы, нейл-студии, косметологию и спа по районам городов Узбекистана.",
        },
        {
          step: "II",
          title: "Сравните мастеров и цены",
          desc: "Длительность процедур, честные цены в сумах и свободные окна видны без единого звонка.",
        },
        {
          step: "III",
          title: "Подтвердите в Telegram",
          desc: "Заявка мгновенно поступает администратору, а гость получает автоматическое напоминание до визита.",
        },
      ],
      cta: "Открыть Telegram Mini App",
      categories: [
        {
          key: "barber",
          nicheKey: "barber",
          image: "/images/craft-shears.webp",
          alt: "Инструменты классического барбершопа: ножницы и уход за бородой",
          sculptureTitle: "Античный бюст · Мужской барберинг",
          curatorNote:
            "Классика мужских пропорций — точная запись на стрижку, моделирование бороды и королевское бритьё.",
        },
        {
          key: "hair",
          nicheKey: "hair",
          image: "/images/hair-atelier.webp",
          alt: "Солнечный столик парикмахерского ателье с бронзовым зеркалом и щёткой",
          sculptureTitle: "Бронзовое зеркало · Искусство волос",
          curatorNote:
            "Линия и отражение — подбор стилиста для окрашивания, укладки и ухода по точному времени.",
        },
        {
          key: "nails",
          nicheKey: "nails",
          image: "/images/nail-studio.webp",
          alt: "Флаконы лака для ногтей на римском травертине и льняное полотенце",
          sculptureTitle: "Ритуальные чаши · Ногтевой сервис",
          curatorNote:
            "Ювелирная аккуратность — удобное бронирование маникюра, педикюра и ухода за руками.",
        },
        {
          key: "spa",
          nicheKey: "spa",
          image: "/images/spa-sanctuary.webp",
          alt: "Мраморная чаша для спа, свёрнутые полотенца и натуральные масла",
          sculptureTitle: "Античная амфора · Спа-ритуалы",
          curatorNote:
            "Вода, пар и покой — бронирование термальных зон и комплексных спа-программ без суеты.",
        },
        {
          key: "massage",
          nicheKey: "spa",
          image: "/images/spa-sanctuary.webp",
          alt: "Спа и массажный кабинет с тёплыми камнями и маслами",
          sculptureTitle: "Античная амфора · Восстановительный массаж",
          curatorNote:
            "Баланс и восстановление — запись на классический, спортивный и расслабляющий массаж.",
        },
        {
          key: "cosmetology",
          nicheKey: "cosmetology",
          image: "/images/cosmetology-skin.webp",
          alt: "Стеклянные пипетки с сывороткой и баночки для ухода за кожей на мраморе",
          sculptureTitle: "Аптекарский сосуд · Эстетическая косметология",
          curatorNote:
            "Наука чистой кожи — запись на консультации косметолога и уходовые процедуры.",
        },
        {
          key: "browsLashes",
          nicheKey: "browsLashes",
          image: "/images/brows-makeup.webp",
          alt: "Пинцеты, кисти для бровей и зеркало на тёплом травертине",
          sculptureTitle: "Циркуль пропорций · Брови и ресницы",
          curatorNote:
            "Архитектура взгляда — быстрая запись к бровистам и мастерам ламинирования ресниц.",
        },
        {
          key: "makeup",
          nicheKey: "browsLashes",
          image: "/images/brows-makeup.webp",
          alt: "Набор кистей для макияжа и компактное зеркало при дневном свете",
          sculptureTitle: "Циркуль пропорций · Студия визажа",
          curatorNote:
            "Свет и образ — резервируйте удобный час у визажиста перед важным событием.",
        },
      ],
    },
    act4: {
      tether: "Ротонда времени · Центр операций",
      eyebrow: "Глава IV · Ротонда времени и порядка",
      headline: "Хаос собирается в",
      headlineAccent: "точный ритм.",
      sub: "В центре ротонды Пантеона кресло стоит на римском циферблате. Выберите любой из четырёх монументов, чтобы увидеть, как SmartChair синхронизирует весь день салона.",
      cta: "К реестру приёма",
      modules: [
        {
          key: "requests",
          num: "01",
          monument: "Horologium · Карманные часы",
          title: "Заявки и График смен",
          curatorNote: "Каждый визит ложится точно в рабочие часы мастера.",
          desc: "Подтверждайте, отклоняйте и переносите заявки из Telegram и веба в один тап.",
        },
        {
          key: "queue",
          num: "02",
          monument: "Porta QR · Мраморная QR-стела",
          title: "Живая Walk-In QR-очередь",
          curatorNote: "Гости с улицы встают в очередь без конфликтов с онлайн-бронью.",
          desc: "Посетитель сканирует QR на стойке, выбирает мастера и получает талон в реальном времени.",
        },
        {
          key: "register",
          num: "03",
          monument: "Thesaurus · Касса салона",
          title: "Касса и Z-отчёты",
          curatorNote: "Каждая завершённая услуга отражается в точном расчёте смены.",
          desc: "Принимайте Наличные, Терминал, Click и Payme, автоматически закрывая смены и комиссии.",
        },
        {
          key: "crm",
          num: "04",
          monument: "Archivum · Кодекс клиентов",
          title: "База гостей и Напоминания",
          curatorNote: "Помнит предпочтения каждого клиента лучше бумажного журнала.",
          desc: "История визитов, заметки мастеров и автоматические напоминания в Telegram.",
        },
      ],
      demo: {
        requestsTitle: "Входящая заявка · Telegram Бот",
        requestItem: "15:00 · Кресло барбера #2",
        requestMeta: "45 минут · Смена подтверждена",
        accept: "Принять",
        decline: "Отклонить",
        accepted: "Подтверждено · Гость уведомлён",
        declined: "Отклонено · Слот открыт",
        reset: "Сбросить",
        queueTitle: "QR-очередь ресепшн",
        queueOnlineLabel: "Онлайн-брони · График",
        queueOnlineBadge: "Синхронно",
        queueWalkInLabel: "Walk-In QR (/waitlist/:shopId)",
        queueWalkInBadge: "Живая очередь",
        registerTitle: "Кассовый журнал смены",
        registerMethods: ["Наличные", "Терминал", "Click", "Payme"],
        crmTitle: "Архив гостей и Автозадачи",
        crmReminderLabel: "Напоминание клиенту в Telegram",
        crmReminderBadge: "Авто",
        crmNotesLabel: "История визитов и заметки мастеров",
        crmNotesBadge: "Активно",
      },
    },
    act5: {
      tether: "Реестр Ателье · Подключение",
      eyebrow: "Глава V · Реестр SmartChair Atelier",
      headline: "Переведите ваш салон в единую живую систему.",
      sub: "Оставьте заявку в реестре — команда SmartChair за 24 часа настроит профиль салона, смены мастеров и Telegram-бота для записи.",
      faqTitle: "Частые вопросы",
      faqs: [
        {
          q: "Как записаться в барбершоп или салон через SmartChair?",
          a: "Откройте Telegram-бот (@SmartChairNamanganbot) или веб-платформу, выберите салон на карте, подходящего мастера и свободное время и отправьте заявку.",
        },
        {
          q: "Сколько стоит онлайн-запись для клиентов?",
          a: "Для клиентов поиск и бронирование через SmartChair полностью бесплатны (0 сум). Вы оплачиваете только оказанную услугу напрямую в салоне.",
        },
        {
          q: "Как подключить свой салон или барбершоп к SmartChair?",
          a: "Заполните форму реестра на этой странице или позвоните по номеру +998 94 982 70 70. Наша команда настроит ваше рабочее пространство в течение 24 часов.",
        },
        {
          q: "Как SmartChair помогает сократить накладки и пропущенные визиты?",
          a: "Система сводит онлайн-запись и Walk-In QR-очередь в единое расписание, хранит историю гостей и заранее отправляет автоматические напоминания в Telegram.",
        },
      ],
    },
  },
  en: {
    act1: {
      h1: "Online booking and salon management platform for barbershops and beauty studios in Uzbekistan",
      storyLead:
        "Every great salon begins with mastery at the chair. Yet endless phone calls, paper notebooks, and scattered schedules pull attention away from the craft. SmartChair unites client booking and daily salon operations in one calm system.",
      scrollCue: "Scroll to enter the salon",
    },
    act2: {
      tether: "Master Chair · Mirror Threshold",
      eyebrow: "Chapter II · Order Beyond the Glass",
      heading: "From a working chair to the art of precision.",
      body: "As the physical chair dissolves into the barber’s looking-glass, everyday craft enters architectural order — linking one client tap in Telegram directly to real shifts and checkout ledgers.",
      cta: "Step into the Gallery",
    },
    act3: {
      tether: "Gallery Niche · Craft & Discovery",
      eyebrow: "Chapter III · Gallery of Living Crafts",
      headline: "Discover. Choose.",
      headlineAccent: "Book in Telegram.",
      sub: "Select any classical alcove or category below — the camera turns toward its bespoke sculpture. Guests explore local salons on the map, see real UZS prices, and book with 0 so'm fee.",
      steps: [
        {
          step: "I",
          title: "Explore salons on the map",
          desc: "Discover barbershops, nail studios, cosmetology rooms, and spas across Uzbekistan.",
        },
        {
          step: "II",
          title: "Inspect masters & real UZS prices",
          desc: "View clear service durations, transparent pricing, and open hours without phone tag.",
        },
        {
          step: "III",
          title: "Confirm in one Telegram tap",
          desc: "Requests reach the salon immediately, followed by automated pre-visit Telegram reminders.",
        },
      ],
      cta: "Open Telegram Mini App",
      categories: [
        {
          key: "barber",
          nicheKey: "barber",
          image: "/images/craft-shears.webp",
          alt: "Classical barbershop tools and precision steel shears in warm daylight",
          sculptureTitle: "Classical Greek Bust · Men's Barbering",
          curatorNote:
            "A study in timeless proportion — book signature cuts, fades, and traditional beard grooming effortlessly.",
        },
        {
          key: "hair",
          nicheKey: "hair",
          image: "/images/hair-atelier.webp",
          alt: "Sunlit hair atelier vanity with ornate bronze mirror and sculpted wooden brush",
          sculptureTitle: "Ornate Looking-Glass · Hair Artistry",
          curatorNote:
            "Line, reflection, and flow — match guests to colorists and stylists with exact service durations.",
        },
        {
          key: "nails",
          nicheKey: "nails",
          image: "/images/nail-studio.webp",
          alt: "Minimalist Roman travertine manicure table with glass nail polish flacons and linen towel",
          sculptureTitle: "Ritual Polish Chalices · Nail Studio",
          curatorNote:
            "Detailed hand care — reserve manicure, gel polish, and restorative nail appointments online.",
        },
        {
          key: "spa",
          nicheKey: "spa",
          image: "/images/spa-sanctuary.webp",
          alt: "Serene classical spa sanctuary with carved marble water basin, rolled towels, and botanical oils",
          sculptureTitle: "Sanctuary Amphora · Spa Rituals",
          curatorNote:
            "Water, warmth, and unhurried rest — schedule steam rooms, baths, and full-body spa rituals cleanly.",
        },
        {
          key: "massage",
          nicheKey: "spa",
          image: "/images/spa-sanctuary.webp",
          alt: "Warm sunlit spa and massage table with natural oils and rolled ivory linen",
          sculptureTitle: "Sanctuary Amphora · Restorative Massage",
          curatorNote:
            "Quiet physical recovery — book sports, deep-tissue, or classic massage therapists at open hours.",
        },
        {
          key: "cosmetology",
          nicheKey: "cosmetology",
          image: "/images/cosmetology-skin.webp",
          alt: "Frosted glass serum dropper bottles and alabaster skincare jars on sunlit Carrara marble",
          sculptureTitle: "Apothecary Vessel · Cosmetology",
          curatorNote:
            "Deliberate skin science — coordinate aesthetic consultations and facial treatments without delays.",
        },
        {
          key: "browsLashes",
          nicheKey: "browsLashes",
          image: "/images/brows-makeup.webp",
          alt: "Precision angled bronze tweezers and brow artistry brushes on warm travertine stone",
          sculptureTitle: "Golden-Ratio Compass · Brows & Lashes",
          curatorNote:
            "Measured facial symmetry — book brow shaping, lamination, and lash specialists in seconds.",
        },
        {
          key: "makeup",
          nicheKey: "browsLashes",
          image: "/images/brows-makeup.webp",
          alt: "Warm sunlit makeup artistry vanity with fine bristle brushes and brass mirror",
          sculptureTitle: "Golden-Ratio Compass · Makeup Atelier",
          curatorNote:
            "Crafted presence — lock in bridal or evening makeup sessions alongside hair and nail appointments.",
        },
      ],
    },
    act4: {
      tether: "Rotunda of Time · Operations",
      eyebrow: "Chapter IV · Rotunda of Mastered Time",
      headline: "Daily operations aligned",
      headlineAccent: "to the hour.",
      sub: "Beneath the Pantheon oculus, the Barber Chair rests on a Roman floor clock surrounded by four purposeful monuments. Choose any pillar to see how SmartChair keeps the whole floor synchronized.",
      cta: "Proceed to Atelier Registry",
      modules: [
        {
          key: "requests",
          num: "01",
          monument: "Horologium · Pocket Watch",
          title: "Booking Requests & Shifts",
          curatorNote: "Every incoming booking respects real specialist hours.",
          desc: "Accept, decline, or reschedule Telegram and web requests in real time alongside active staff shifts.",
        },
        {
          key: "queue",
          num: "02",
          monument: "Porta QR · Marble QR Stele",
          title: "Walk-In QR Synchronization",
          curatorNote: "Street guests join the live line without clashing with booked slots.",
          desc: "Guests scan your reception QR (/waitlist/:shopId) to pick an available chair and track their turn.",
        },
        {
          key: "register",
          num: "03",
          monument: "Thesaurus · Salon Register",
          title: "Checkout & Z-Reports",
          curatorNote: "Every completed chair session reconciles cleanly at close.",
          desc: "Record Cash (Naqd), Terminal, Click, and Payme payments with shift-close Z-reports and specialist payouts.",
        },
        {
          key: "crm",
          num: "04",
          monument: "Archivum · Client Codex",
          title: "Client Records & Reminders",
          curatorNote: "Retains visit history and notes far beyond paper ledgers.",
          desc: "Keep treatment notes and visit history paired with automated Telegram pre-visit reminders and follow-ups.",
        },
      ],
      demo: {
        requestsTitle: "Incoming Request · Telegram Bot",
        requestItem: "15:00 · Barber Chair #2",
        requestMeta: "45 min slot · Shift verified",
        accept: "Accept",
        decline: "Decline",
        accepted: "Confirmed · Guest notified",
        declined: "Declined · Slot reopened",
        reset: "Reset",
        queueTitle: "Reception QR Waitlist",
        queueOnlineLabel: "Online Bookings · Schedule",
        queueOnlineBadge: "Synced",
        queueWalkInLabel: "Walk-In QR (/waitlist/:shopId)",
        queueWalkInBadge: "Live Queue",
        registerTitle: "Shift Checkout Ledger",
        registerMethods: ["Cash (Naqd)", "Terminal", "Click", "Payme"],
        crmTitle: "Client Codex & Automated Alerts",
        crmReminderLabel: "Pre-visit Telegram reminder",
        crmReminderBadge: "Automated",
        crmNotesLabel: "Visit history & specialist notes",
        crmNotesBadge: "Active",
      },
    },
    act5: {
      tether: "Atelier Registry · Partner",
      eyebrow: "Chapter V · The Atelier Registry",
      headline: "Bring your salon into one living system.",
      sub: "Enter your salon details in the registry below. Our onboarding team configures your workspace, staff schedules, and Telegram booking bot within 24 hours.",
      faqTitle: "Frequently Asked Questions",
      faqs: [
        {
          q: "How do customers book an appointment through SmartChair?",
          a: "Open our Telegram bot (@SmartChairNamanganbot) or web platform, choose a barbershop or beauty salon, select your specialist and open time slot, and send your request in one tap.",
        },
        {
          q: "Is booking through SmartChair free for customers?",
          a: "Yes. Discovering salons and booking appointments via SmartChair is 100% free (0 UZS) for customers. You pay only for your service directly at the salon.",
        },
        {
          q: "How can I connect my barbershop or beauty salon to SmartChair?",
          a: "Submit your salon details through the registry form here or call +998 94 982 70 70 directly. Our onboarding team configures your workspace within 24 hours.",
        },
        {
          q: "How does SmartChair prevent scheduling overlaps and missed visits?",
          a: "SmartChair unifies online bookings and walk-in QR queues into one real-time shift schedule, maintains client visit history, and sends automated Telegram reminders before each visit.",
        },
      ],
    },
  },
};

export function normalizeLang(language?: string): LangCode {
  if (language?.startsWith("uz")) return "uz";
  if (language?.startsWith("ru")) return "ru";
  if (language?.startsWith("en")) return "en";
  return "uz";
}
