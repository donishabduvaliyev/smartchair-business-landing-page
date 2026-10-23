export type SupportedLang = "uz" | "ru" | "en";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocContent {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
  complianceNote: string;
  sections: LegalSection[];
}

export interface DeleteAccountFormStrings {
  formTitle: string;
  formSubtitle: string;
  phoneLabel: string;
  phonePlaceholder: string;
  telegramLabel: string;
  telegramPlaceholder: string;
  reasonLabel: string;
  reasonPlaceholder: string;
  confirmLabel: string;
  submitBtn: string;
  submittingBtn: string;
  errorIdentifier: string;
  errorConfirm: string;
  successTitle: string;
  successDesc: string;
  requestIdLabel: string;
}

export interface LegalBundle {
  nav: {
    backHome: string;
    privacy: string;
    terms: string;
    refund: string;
    deleteAccount: string;
    questionsTitle: string;
    questionsSubtitle: string;
    callDirect: string;
  };
  privacy: LegalDocContent;
  terms: LegalDocContent;
  refund: LegalDocContent;
  deleteAccount: LegalDocContent;
  deleteForm: DeleteAccountFormStrings;
}

export const LEGAL_CONTENT: Record<SupportedLang, LegalBundle> = {
  uz: {
    nav: {
      backHome: "Bosh sahifaga qaytish",
      privacy: "Maxfiylik siyosati (O‘RQ-547)",
      terms: "Foydalanish shartlari (Oferta)",
      refund: "Bekor qilish va qaytarish",
      deleteAccount: "Hisob va ma'lumotlarni o'chirish",
      questionsTitle: "Huquqiy yoki maxfiylik bo'yicha savolingiz bormi?",
      questionsSubtitle:
        "Shaxsiy ma'lumotlar operatori va qo'llab-quvvatlash xizmati bilan bevosita bog'laning:",
      callDirect: "Qo'ng'iroq: +998 94 982 70 70",
    },
    privacy: {
      badge: "O‘RQ-547 va Xalqaro Standartlar",
      title: "Maxfiylik siyosati va shaxsiy ma'lumotlarni qayta ishlash tartibi",
      subtitle:
        "SmartChair platformasi mijozlar va biznes hamkorlarning shaxsiy ma'lumotlarini qanday yig'ishi, himoya qilishi va ulardan foydalanishi haqida rasmiy hujjat.",
      lastUpdated: "Oxirgi yangilanish: 2026-yil 23-oktabr",
      complianceNote:
        "Ushbu siyosat O'zbekiston Respublikasining 2019-yil 2-iyuldagi «Shaxsiy ma'lumotlar to'g'risida»gi O‘RQ-547-sonli Qonuni, «Elektron tijorat to'g'risida»gi O‘RQ-792-sonli Qonuni hamda Apple App Store, Google Play va Telegram Mini App xalqaro maxfiylik talablariga to'liq muvofiq ishlab chiqilgan.",
      sections: [
        {
          title: "1. Umumiy qoidalar va Operator haqida ma'lumot",
          paragraphs: [
            "Ushbu Maxfiylik siyosati SmartChair platformasi (Telegram Mini App @SmartChairNamanganbot, veb-sayt, mobil ilovalar va biznes boshqaruv paneli) orqali foydalanuvchilarning shaxsiy ma'lumotlarini yig'ish, saqlash, qayta ishlash va o'chirish tartibini belgilaydi.",
            "Platformadan foydalanish yoki ro'yxatdan o'tish orqali siz O'zbekiston Respublikasining O‘RQ-547-sonli Qonuni 18-moddasiga muvofiq shaxsiy ma'lumotlaringiz ushbu siyosatda ko'rsatilgan maqsadlarda qayta ishlanishiga o'z roziligingizni bildirasiz.",
          ],
        },
        {
          title: "2. Biz yig'adigan shaxsiy ma'lumotlar toifalari",
          paragraphs: [
            "Biz faqat xizmat ko'rsatish va navbatni aniq band qilish uchun zarur bo'lgan minimal ma'lumotlarni yig'amiz:",
          ],
          bullets: [
            "Mijoz identifikatsiya ma'lumotlari: Ism-sharifingiz, aloqa uchun telefon raqamingiz (+998...), Telegram ID raqamingiz va foydalanuvchi nomingiz (@username).",
            "Band qilish va faollik ma'lumotlari: Tanlangan sartaroshxona/salon, xizmat turi, mutaxassis, tashrif sanasi va vaqti, sevimli joylar ro'yxati hamda siz qoldirgan sharh va baholar.",
            "Joylashuv (Geolokatsiya) ma'lumotlari: Faqatgina sizning ruxsatingiz bilan atrofingizdagi eng yaqin sartaroshxona va salonlarni xaritada ko'rsatish uchun ishlatiladi. Joylashuv ma'lumotlari fon rejimida kuzatilmaydi.",
            "Biznes hamkor (B2B) ma'lumotlari: Salon nomi, rahbar ism-sharifi, telefon raqami, manzil, ustalar jadvali va xizmatlar narxnomasi.",
          ],
        },
        {
          title: "3. Ma'lumotlarni qayta ishlash maqsadlari",
          bullets: [
            "Tanlangan sartaroshxona, go'zallik saloni yoki spada sizning nomingizga navbat (bron) rasmiylashtirish.",
            "Telegram yoki ilova orqali navbat tasdiqlangani, o'zgargani hamda tashrif vaqti yaqinlashgani haqida avtomatik eslatmalar yuborish.",
            "Mijozlarga xizmat sifatini baholash va haqqoniy sharhlar qoldirish imkoniyatini yaratish.",
            "Biznes egalari bilan hamkorlik o'rnatish va texnik qo'llab-quvvatlash ko'rsatish.",
          ],
        },
        {
          title: "4. Ma'lumotlarni uchinchi shaxslarga uzatish chegaralari",
          paragraphs: [
            "SmartChair foydalanuvchilarning shaxsiy ma'lumotlarini hech qachon uchinchi tomon reklama kompaniyalariga sotmaydi va ijaraga bermaydi.",
            "Sizning ismingiz, telefon raqamingiz va tanlangan xizmat haqidagi ma'lumot faqatgina siz o'zingiz navbat band qilgan aniq sartaroshxona yoki go'zallik saloniga (xizmatni ko'rsatish va zarur hollarda siz bilan bog'lanish uchun) taqdim etiladi.",
          ],
        },
        {
          title: "5. Ma'lumotlarni saqlash va xavfsizlik choralari (O‘RQ-547 27-1-modda)",
          paragraphs: [
            "Barcha ma'lumotlar shifrlangan aloqa kanallari (HTTPS/TLS), kriptografik Telegram HMAC-SHA256 imzosi va JWT tokenlar yordamida himoyalanadi. Ma'lumotlar bazasiga kirish qat'iy cheklangan.",
          ],
        },
        {
          title: "6. Subyektning huquqlari va ma'lumotlarni o'chirish",
          paragraphs: [
            "O‘RQ-547-sonli Qonunning 21 va 30-moddalariga binoan har bir foydalanuvchi quyidagi huquqlarga ega:",
          ],
          bullets: [
            "O'zining qanday shaxsiy ma'lumotlari saqlanayotgani haqida ma'lumot olish va ularga tuzatish kiritish.",
            "Shaxsiy ma'lumotlarni qayta ishlashga bergan roziligini istalgan vaqtda qaytarib olish.",
            "Saytimizning «Hisob va ma'lumotlarni o'chirish» (/delete-account) sahifasi orqali barcha shaxsiy ma'lumotlarini 72 soat ichida butunlay o'chirishni talab qilish.",
          ],
        },
      ],
    },
    terms: {
      badge: "O‘RQ-792 · Ommaviy Oferta",
      title: "Foydalanish shartlari va Ommaviy oferta",
      subtitle:
        "SmartChair onlayn navbat band qilish platformasidan mijozlar va hamkor bizneslar tomonidan foydalanishning huquqiy qoidalari.",
      lastUpdated: "Oxirgi yangilanish: 2026-yil 23-oktabr",
      complianceNote:
        "Ushbu hujjat O'zbekiston Respublikasi Fuqarolik kodeksining 367–370-moddalari hamda «Elektron tijorat to'g'risida»gi O‘RQ-792-sonli Qonuniga muvofiq rasmiy Ommaviy oferta hisoblanadi.",
      sections: [
        {
          title: "1. Platformaning maqomi va xizmat predmeti",
          paragraphs: [
            "SmartChair — mijozlarga sartaroshxona, go'zallik saloni, spa va xususiy mutaxassislarni topish hamda onlayn navbat band qilish imkonini beruvchi texnologik axborot vositachisi (agregator) hisoblanadi.",
            "Sartaroshlik, kosmetologiya va go'zallik xizmatlari bevosita mustaqil Biznes Hamkorlar (salonlar va ustalar) tomonidan ko'rsatiladi. Ko'rsatilgan xizmat sifati, sanitariya-gigiyena qoidalari va xavfsizligi uchun bevosita xizmat ko'rsatuvchi salon javobgardir.",
          ],
        },
        {
          title: "2. Mijozlarning huquq va majburiyatlari",
          bullets: [
            "Navbat band qilishda o'zining haqiqiy ismi va ishlab turgan telefon raqamini ko'rsatish.",
            "Band qilingan vaqtda salonga o'z vaqtida yetib kelish yoki kela olmaslik holatida kamida 2 soat oldin ilova orqali navbatni bekor qilish.",
            "Ketma-ket 3 marta sababsiz va ogohlantirishsiz kelmaslik (no-show) holatida tizim foydalanuvchining onlayn band qilish imkoniyatini vaqtincha cheklashi mumkin.",
          ],
        },
        {
          title: "3. Biznes Hamkorlarning (Salon va Sartaroshxonalarning) majburiyatlari",
          bullets: [
            "Platformada ko'rsatilgan xizmat turlari, davomiyligi va O'zbekiston so'midagi (UZS) narxlarning haqqoniyligini ta'minlash.",
            "Tasdiqlangan navbat bo'yicha kelgan mijozni o'z vaqtida qabul qilish va sifatli xizmat ko'rsatish.",
            "Mijozlarning telefon raqamlari va shaxsiy ma'lumotlaridan faqatgina band qilingan tashrif doirasida foydalanish (O‘RQ-547 talablariga rioya etish).",
          ],
        },
        {
          title: "4. Intellektual mulk huquqi",
          paragraphs: [
            "SmartChair brendi, logotipi, dasturiy kodi, dizayni va interfeys elementlari mualliflik huquqi bilan himoyalangan. Ularni ruxsatsiz nusxalash yoki tijorat maqsadida tarqatish taqiqlanadi.",
          ],
        },
        {
          title: "5. Qo'llaniladigan qonunchilik va nizolarni hal etish",
          paragraphs: [
            "Ushbu shartlar O'zbekiston Respublikasi qonunchiligi bilan tartibga solinadi. Barcha kelishmovchiliklar avvalo muzokaralar va da'vo arizasini ko'rib chiqish (15 ish kuni ichida) yo'li bilan, kelishuvga erishilmagan taqdirda O'zbekiston Respublikasining vakolatli sudlarida hal etiladi.",
          ],
        },
      ],
    },
    refund: {
      badge: "Iste'molchilar huquqlari himoyasi",
      title: "Navbatni bekor qilish, to'lovlar va qaytarish siyosati",
      subtitle:
        "Mijozlar va biznes hamkorlar uchun navbatni bekor qilish, o'zgartirish hamda to'lovlarni qaytarishning shaffof qoidalari.",
      lastUpdated: "Oxirgi yangilanish: 2026-yil 23-oktabr",
      complianceNote:
        "O'zbekiston Respublikasining «Iste'molchilarning huquqlarini himoya qilish to'g'risida»gi Qonuni hamda xalqaro to'lov va ilova do'konlari talablari asosida.",
      sections: [
        {
          title: "1. Mijozlar uchun bepul band qilish va bekor qilish",
          paragraphs: [
            "SmartChair platformasi orqali navbat band qilish mijozlar uchun bepul. Mijoz xizmat haqini xizmat ko'rsatilganidan so'ng bevosita sartaroshxona yoki salonda (naqd pul, Uzcard, Humo, Click yoki Payme orqali) to'laydi.",
          ],
          bullets: [
            "Navbatni bepul bekor qilish: Tashrif vaqtidan kamida 2 soat oldin Telegram Mini App yoki mobil ilovaning «Profil -> Bandlarim» bo'limi orqali hech qanday jarimasiz bekor qilish mumkin.",
            "Vaqtni ko'chirish: Bo'sh soatlar mavjud bo'lsa, tashrif vaqtini bir tegishda boshqa vaqtga o'zgartirish mumkin.",
          ],
        },
        {
          title: "2. Oldindan to'lov (zakalat) yoki xizmat uchun to'lovni qaytarish tartibi",
          paragraphs: [
            "Agar ayrim maxsus xizmatlar uchun salon bilan kelishilgan holda oldindan to'lov amalga oshirilgan bo'lsa:",
          ],
          bullets: [
            "Tashrifdan kamida 2 soat oldin bekor qilinganda yoki salon tomonidan navbat bekor qilinganda — oldindan to'langan summa 100% miqdorda qaytariladi.",
            "Agar ko'rsatilgan xizmat sifati O'zbekiston Respublikasi «Iste'molchilarning huquqlarini himoya qilish to'g'risida»gi Qonuni talablariga javob bermasa, mijoz kamchiliklarni bepul bartaraf etishni yoki to'lovni qaytarishni talab qilishga haqli.",
          ],
        },
        {
          title: "3. Salon tomonidan navbatning bekor qilinishi",
          paragraphs: [
            "Agar favqulodda holat sababli usta mijozni qabul qila olmasa, salon ma'muriyati mijozni oldindan xabardor qilishi va eng yaqin qulay vaqtga ko'chirib berishi shart.",
          ],
        },
        {
          title: "4. Biznes hamkorlar (B2B) uchun to'lovlarni qaytarish shartlari",
          paragraphs: [
            "Pullik B2B obuna yoki qo'shimcha reklama xizmatlaridan foydalanuvchi salonlar xizmat yoqilgan kundan boshlab 14 kalendar kuni ichida foydalanilmagan davr uchun to'lovni qaytarish bo'yicha murojaat qilishlari mumkin. Murojaatlar 3–5 ish kuni ichida ko'rib chiqiladi.",
          ],
        },
        {
          title: "5. Shikoyat va murojaatlarni ko'rib chiqish (48 soat ichida)",
          paragraphs: [
            "Har qanday bahsli vaziyat yoki to'lovni qaytarish masalasida +998 94 982 70 70 raqamiga yoki Telegram qo'llab-quvvatlash xizmatiga murojaat qiling. Har bir murojaat 48 soat ichida ko'rib chiqiladi.",
          ],
        },
      ],
    },
    deleteAccount: {
      badge: "O‘RQ-547 21-modda · App Store & Google Play",
      title: "Hisobni va shaxsiy ma'lumotlarni o'chirish",
      subtitle:
        "Foydalanuvchi hisobini hamda unga bog'langan barcha shaxsiy ma'lumotlarni tizimdan butunlay o'chirish tartibi va onlayn so'rov shakli.",
      lastUpdated: "Oxirgi yangilanish: 2026-yil 23-oktabr",
      complianceNote:
        "O'zbekiston Respublikasi O‘RQ-547-sonli Qonuni 21-moddasi, Apple App Store Guideline 5.1.1(v) va Google Play Data Safety talablariga muvofiq har bir foydalanuvchi o'z ma'lumotlarini mustaqil ravishda o'chirish huquqiga ega.",
      sections: [
        {
          title: "1. Ma'lumotlarni o'chirishning 2 xil usuli",
          bullets: [
            "1-usul (Onlayn veb-so'rov — quyidagi shakl orqali): Telefon raqamingiz yoki Telegram foydalanuvchi nomingizni quyidagi shaklga kiriting va «Ma'lumotlarni o'chirish so'rovini yuborish» tugmasini bosing.",
            "2-usul (Bevosita murojaat): +998 94 982 70 70 raqamiga yoki Telegram botimizga hisobni o'chirish haqida xabar yuboring.",
          ],
        },
        {
          title: "2. Qanday ma'lumotlar butunlay o'chiriladi?",
          bullets: [
            "Foydalanuvchi profili: Ism-sharifingiz, telefon raqamingiz, Telegram ID va @username ma'lumotlari.",
            "Faollik tarixi: Saqlangan sevimli salonlar, faol avtorizatsiya sessiyalari (JWT tokenlar) va shaxsiy bildirishnoma sozlamalari.",
            "Kelgusidagi faol navbatlar (bronlar) avtomatik ravishda bekor qilinadi.",
          ],
        },
        {
          title: "3. O'chirish muddati (72 soat)",
          paragraphs: [
            "So'rov yuborilgan vaqtdan boshlab ko'pi bilan 72 soat ichida barcha shaxsiy identifikatorlar asosiy ma'lumotlar bazasidan qayta tiklanmaydigan tarzda o'chiriladi.",
          ],
        },
      ],
    },
    deleteForm: {
      formTitle: "Hisob va shaxsiy ma'lumotlarni o'chirish so'rovi",
      formSubtitle:
        "Ro'yxatdan o'tgan telefon raqamingiz yoki Telegram username'ingizni kiriting. So'rovingiz darhol qayd etiladi va 72 soat ichida bajariladi.",
      phoneLabel: "Telefon raqamingiz",
      phonePlaceholder: "+998 90 123 45 67",
      telegramLabel: "Telegram username yoki ID",
      telegramPlaceholder: "@username",
      reasonLabel: "O'chirish sababi (ixtiyoriy)",
      reasonPlaceholder: "Nima sababdan hisobingizni o'chirmoqchisiz?",
      confirmLabel:
        "Men SmartChair hisobim va barcha shaxsiy ma'lumotlarim butunlay o'chirilishini tasdiqlayman.",
      submitBtn: "Ma'lumotlarni o'chirish so'rovini yuborish",
      submittingBtn: "Yuborilmoqda...",
      errorIdentifier:
        "Iltimos, ro'yxatdan o'tgan telefon raqamingizni yoki Telegram username'ingizni kiriting.",
      errorConfirm: "Davom etish uchun o'chirishni tasdiqlash belgisini qo'ying.",
      successTitle: "O'chirish so'rovi qabul qilindi",
      successDesc:
        "Sizning hisob va shaxsiy ma'lumotlarni o'chirish bo'yicha so'rovingiz rasmiy ro'yxatga olindi va 72 soat ichida to'liq bajariladi.",
      requestIdLabel: "So'rov raqami (ID):",
    },
  },
  ru: {
    nav: {
      backHome: "Вернуться на главную",
      privacy: "Конфиденциальность (ЗРУ-547)",
      terms: "Публичная оферта и условия",
      refund: "Политика отмены и возврата",
      deleteAccount: "Удаление аккаунта и данных",
      questionsTitle: "Вопросы по праву или защите данных?",
      questionsSubtitle:
        "Свяжитесь напрямую с оператором персональных данных и службой поддержки SmartChair:",
      callDirect: "Позвонить: +998 94 982 70 70",
    },
    privacy: {
      badge: "Закон РУз № ЗРУ-547 и Международные стандарты",
      title: "Политика конфиденциальности и обработки персональных данных",
      subtitle:
        "Официальный порядок сбора, хранения, защиты и использования персональных данных клиентов и бизнес-партнёров платформы SmartChair.",
      lastUpdated: "Последнее обновление: 23 октября 2026 г.",
      complianceNote:
        "Настоящая Политика разработана в строгом соответствии с Законом Республики Узбекистан № ЗРУ-547 «О персональных данных» от 02.07.2019 г., Законом № ЗРУ-792 «Об электронной коммерции», а также требованиями Apple App Store, Google Play и Telegram Mini Apps.",
      sections: [
        {
          title: "1. Общие положения и согласие пользователя",
          paragraphs: [
            "Настоящая Политика конфиденциальности регулирует обработку персональных данных всех пользователей экосистемы SmartChair (Telegram Mini App @SmartChairNamanganbot, веб-сайта, мобильных приложений и панели управления бизнесом).",
            "Используя платформу или отправляя заявку на запись/подключение, вы выражаете добровольное согласие на обработку своих персональных данных согласно статье 18 Закона РУз № ЗРУ-547.",
          ],
        },
        {
          title: "2. Какие категории персональных данных мы собираем",
          paragraphs: [
            "Мы придерживаемся принципа минимизации данных и запрашиваем только то, что необходимо для бронирования услуг:",
          ],
          bullets: [
            "Идентификационные данные клиента: Имя, контактный номер телефона (+998...), Telegram ID и имя пользователя (@username).",
            "Данные о бронированиях: Выбранный барбершоп/салон, услуга, мастер, дата и время визита, список избранных заведений и оставленные отзывы.",
            "Данные геолокации: Используются исключительно с вашего разрешения для отображения ближайших барбершопов и салонов на карте. Фоновое отслеживание не ведётся.",
            "Данные бизнес-партнёров (B2B): Название салона, ФИО владельца/управляющего, контактный телефон, адрес, графики мастеров и прайс-лист.",
          ],
        },
        {
          title: "3. Цели обработки персональных данных",
          bullets: [
            "Оформление и передача заявки на запись в выбранный пользователем барбершоп, салон красоты или спа.",
            "Отправка мгновенных подтверждений и автоматических напоминаний о предстоящем визите в Telegram.",
            "Обеспечение работы системы честных отзывов и рейтингов заведений.",
            "Подключение новых бизнес-партнёров и оказание технической поддержки.",
          ],
        },
        {
          title: "4. Передача данных третьим лицам",
          paragraphs: [
            "SmartChair никогда не продаёт и не передаёт персональные данные пользователей рекламным агентствам или сторонним брокерам данных.",
            "Ваше имя и номер телефона передаются исключительно тому конкретному барбершопу или салону красоты, в который вы самостоятельно оформили запись.",
          ],
        },
        {
          title: "5. Защита и хранение данных (ст. 27-1 ЗРУ-547)",
          paragraphs: [
            "Передача данных осуществляется по защищённым протоколам HTTPS/TLS с проверкой криптографической подписи Telegram HMAC-SHA256 и JWT-авторизацией.",
          ],
        },
        {
          title: "6. Права субъекта персональных данных и удаление данных",
          paragraphs: [
            "В соответствии со статьями 21 и 30 Закона № ЗРУ-547 вы имеете право:",
          ],
          bullets: [
            "Получать информацию о своих обрабатываемых данных и требовать их уточнения.",
            "В любой момент отозвать согласие на обработку персональных данных.",
            "Потребовать полного удаления своего аккаунта и персональных данных через страницу «Удаление аккаунта» (/delete-account) со сроком исполнения до 72 часов.",
          ],
        },
      ],
    },
    terms: {
      badge: "Закон РУз № ЗРУ-792 · Публичная Оферта",
      title: "Условия использования и Публичная оферта",
      subtitle:
        "Правила использования платформы онлайн-записи SmartChair для клиентов и заведений-партнёров.",
      lastUpdated: "Последнее обновление: 23 октября 2026 г.",
      complianceNote:
        "Настоящий документ является официальной Публичной офертой в соответствии со статьями 367–370 Гражданского кодекса Республики Узбекистан и Законом № ЗРУ-792 «Об электронной коммерции».",
      sections: [
        {
          title: "1. Статус платформы и предмет соглашения",
          paragraphs: [
            "SmartChair предоставляет информационно-технологическую платформу для поиска барбершопов, салонов красоты, спа и онлайн-бронирования времени визита.",
            "Непосредственные услуги (стрижка, уход, косметология и др.) оказываются независимыми Бизнес-Партнёрами (салонами и мастерами). Ответственность за качество услуги, санитарные нормы и безопасность в кресле несёт непосредственно заведение-исполнитель.",
          ],
        },
        {
          title: "2. Права и обязанности Клиентов",
          bullets: [
            "Указывать достоверное имя и действующий номер телефона при оформлении записи.",
            "Приходить к назначенному времени либо отменять/переносить запись через приложение не позднее чем за 2 часа до визита.",
            "В случае 3 и более систематических неявок без предупреждения (no-show) платформа вправе временно ограничить функцию онлайн-бронирования.",
          ],
        },
        {
          title: "3. Обязанности Бизнес-Партнёров (Салонов и Барбершопов)",
          bullets: [
            "Поддерживать актуальность расписания мастеров, перечня услуг и цен в узбекских сумах (UZS).",
            "Принимать клиентов строго по подтверждённой записи без необоснованных отказов.",
            "Использовать контактные данные клиентов исключительно для обслуживания конкретного визита в соответствии с Законом № ЗРУ-547.",
          ],
        },
        {
          title: "4. Интеллектуальная собственность",
          paragraphs: [
            "Товарный знак SmartChair, логотип, дизайн, программный код и базы данных защищены законодательством об авторском праве.",
          ],
        },
        {
          title: "5. Применимое право и разрешение споров",
          paragraphs: [
            "Настоящие Условия регулируются законодательством Республики Узбекистан. Споры решаются путём переговоров и соблюдения претензионного порядка (срок ответа — 15 рабочих дней), а при недостижении согласия — в компетентных судах Республики Узбекистан.",
          ],
        },
      ],
    },
    refund: {
      badge: "Защита прав потребителей",
      title: "Политика отмены записи и возврата средств",
      subtitle:
        "Прозрачные правила отмены, переноса визитов и урегулирования споров для клиентов и бизнес-партнёров.",
      lastUpdated: "Последнее обновление: 23 октября 2026 г.",
      complianceNote:
        "Разработано в соответствии с Законом Республики Узбекистан «О защите прав потребителей» и международными правилами платёжной прозрачности.",
      sections: [
        {
          title: "1. Бесплатное бронирование и отмена для клиентов",
          paragraphs: [
            "Онлайн-бронирование через SmartChair для клиентов полностью бесплатно. Оплата за услугу производится непосредственно в барбершопе или салоне после её оказания.",
          ],
          bullets: [
            "Бесплатная отмена: Вы можете бесплатно отменить запись через раздел «Профиль -> Мои записи» не менее чем за 2 часа до начала визита.",
            "Перенос времени: При наличии свободных слотов у мастера вы можете перенести визит на другое удобное время.",
          ],
        },
        {
          title: "2. Возврат предоплаты и споры по качеству услуг",
          bullets: [
            "Если за отдельную услугу салоном взималась предварительная оплата (депозит), при отмене визита не менее чем за 2 часа до начала либо при отмене со стороны салона сумма предоплаты возвращается клиенту в размере 100%.",
            "В случае ненадлежащего оказания услуги клиент вправе потребовать безвозмездного устранения недостатков или возврата уплаченной суммы согласно Закону РУз «О защите прав потребителей».",
          ],
        },
        {
          title: "3. Отмена записи со стороны салона",
          paragraphs: [
            "Если мастер по уважительной причине не может принять клиента, администратор салона обязан заблаговременно уведомить клиента и предложить приоритетное время для переноса.",
          ],
        },
        {
          title: "4. Условия возврата для Бизнес-Партнёров (B2B)",
          paragraphs: [
            "При оплате коммерческих B2B-тарифов или продвижения на платформе возврат за неиспользованный период возможен по обращению владельца бизнеса в течение 14 календарных дней с момента оплаты. Возврат осуществляется в течение 3–5 рабочих дней.",
          ],
        },
        {
          title: "5. Служба разрешения споров (до 48 часов)",
          paragraphs: [
            "По любым спорным ситуациям обращайтесь по телефону +998 94 982 70 70 или в поддержку Telegram. Каждое обращение рассматривается в течение 48 часов.",
          ],
        },
      ],
    },
    deleteAccount: {
      badge: "Ст. 21 ЗРУ-547 · App Store & Google Play",
      title: "Удаление аккаунта и персональных данных",
      subtitle:
        "Инструкция и интерактивная форма для полного удаления учётной записи и персональных данных из системы SmartChair.",
      lastUpdated: "Последнее обновление: 23 октября 2026 г.",
      complianceNote:
        "В соответствии со ст. 21 Закона РУз № ЗРУ-547 «О персональных данных», Apple App Store Review Guideline 5.1.1(v) и требованиями Google Play Data Safety.",
      sections: [
        {
          title: "1. Как запросить удаление аккаунта и данных",
          bullets: [
            "Способ 1 (Онлайн через форму ниже): Укажите свой номер телефона или Telegram username в форме ниже и нажмите «Отправить запрос на удаление данных».",
            "Способ 2 (Прямое обращение): Позвоните по номеру +998 94 982 70 70 или напишите в наш бот поддержки с просьбой удалить аккаунт.",
          ],
        },
        {
          title: "2. Какие данные удаляются безвозвратно?",
          bullets: [
            "Профиль пользователя: Имя, номер телефона, Telegram ID и @username.",
            "Данные активности: Избранные салоны, активные сессии авторизации (JWT-токены) и настройки уведомлений.",
            "Все предстоящие активные записи автоматически отменяются.",
          ],
        },
        {
          title: "3. Сроки выполнения запроса (до 72 часов)",
          paragraphs: [
            "Ваш запрос обрабатывается в течение максимум 72 часов с момента подачи, после чего персональные идентификаторы безвозвратно стираются из рабочей базы данных.",
          ],
        },
      ],
    },
    deleteForm: {
      formTitle: "Форма запроса на удаление аккаунта и персональных данных",
      formSubtitle:
        "Укажите номер телефона или Telegram username, привязанный к вашему профилю. Запрос будет выполнен в течение 72 часов.",
      phoneLabel: "Номер телефона",
      phonePlaceholder: "+998 90 123 45 67",
      telegramLabel: "Telegram username или ID",
      telegramPlaceholder: "@username",
      reasonLabel: "Причина удаления (необязательно)",
      reasonPlaceholder: "Расскажите, почему вы решили удалить аккаунт...",
      confirmLabel:
        "Я подтверждаю, что хочу безвозвратно удалить свой аккаунт SmartChair и все связанные персональные данные.",
      submitBtn: "Отправить запрос на удаление данных",
      submittingBtn: "Отправка запроса...",
      errorIdentifier:
        "Пожалуйста, укажите ваш номер телефона или Telegram username.",
      errorConfirm: "Необходимо подтвердить согласие на безвозвратное удаление данных.",
      successTitle: "Запрос на удаление зарегистрирован",
      successDesc:
        "Ваш запрос принят в обработку. Все персональные данные будут полностью удалены из базы SmartChair в течение 72 часов.",
      requestIdLabel: "Номер заявки (ID):",
    },
  },
  en: {
    nav: {
      backHome: "Back to home",
      privacy: "Privacy & Data Policy (O‘RQ-547)",
      terms: "Terms & Public Offer",
      refund: "Refund & Cancellation",
      deleteAccount: "Delete Account & Data",
      questionsTitle: "Have a legal or data privacy question?",
      questionsSubtitle:
        "Contact the SmartChair Data Protection Operator and Support Team directly:",
      callDirect: "Call: +998 94 982 70 70",
    },
    privacy: {
      badge: "Uzbekistan Law O‘RQ-547 & Global Standards",
      title: "Privacy Policy & Personal Data Processing Notice",
      subtitle:
        "How SmartChair collects, protects, processes, and deletes customer and business partner personal data.",
      lastUpdated: "Last updated: October 23, 2026",
      complianceNote:
        "Prepared in strict compliance with the Law of the Republic of Uzbekistan No. O‘RQ-547 'On Personal Data' (dated July 2, 2019), Law No. O‘RQ-792 'On Electronic Commerce', GDPR data minimization principles, and Apple App Store / Google Play / Telegram Mini App privacy rules.",
      sections: [
        {
          title: "1. General Provisions & Data Operator Disclosure",
          paragraphs: [
            "This Privacy Policy governs the collection, storage, processing, and deletion of personal data across the SmartChair ecosystem (Telegram Mini App @SmartChairNamanganbot, web platform, mobile applications, and SmartChair Business Dashboard).",
            "By creating a booking, logging in via Telegram, or submitting a business partner inquiry, you provide explicit, informed consent to the processing of your personal data under Article 18 of Republic of Uzbekistan Law No. O‘RQ-547.",
          ],
        },
        {
          title: "2. Categories of Personal Data We Collect",
          paragraphs: [
            "We practice strict data minimization and collect only the information required to deliver real-time appointment booking:",
          ],
          bullets: [
            "Customer Identity & Contact Data: Full name, phone number (+998...), Telegram user ID, and Telegram username (@username).",
            "Booking & Preference Data: Selected barbershop/salon, service, specialist, appointment date and time, saved favorite shops, and submitted ratings/reviews.",
            "Location Data (Optional): Used strictly with your explicit permission to display nearby barbershops and salons on the interactive map. We never track your location in the background.",
            "Business Partner (B2B) Data: Salon/barbershop name, owner/manager name, phone number, address, staff schedules, and service price catalog.",
          ],
        },
        {
          title: "3. Legal Basis & Purposes of Processing",
          bullets: [
            "Transmitting your appointment booking request to the specific barbershop, salon, or specialist you selected.",
            "Sending instant booking confirmations, schedule updates, and automated appointment reminders via Telegram.",
            "Maintaining verified customer reviews and preventing fraudulent or spam bookings.",
            "Onboarding partner businesses and providing technical support.",
          ],
        },
        {
          title: "4. Data Sharing Boundaries & Zero Third-Party Sale",
          paragraphs: [
            "SmartChair never sells, rents, or trades your personal data to third-party advertisers or data brokers.",
            "Your name, phone number, and selected service details are shared solely with the specific barbershop or beauty salon where you book an appointment so they can reserve your chair and serve you.",
          ],
        },
        {
          title: "5. Data Security & Storage Compliance (Law O‘RQ-547 Art. 27-1)",
          paragraphs: [
            "All data in transit is encrypted via HTTPS/TLS, and user sessions are verified using cryptographic Telegram WebApp HMAC-SHA256 signatures and signed JWT tokens.",
          ],
        },
        {
          title: "6. Your Data Subject Rights & Right to Erasure",
          paragraphs: [
            "Under Articles 21 and 30 of Law No. O‘RQ-547 and international privacy standards, you have the right to:",
          ],
          bullets: [
            "Access and review the personal data SmartChair holds about you and request corrections.",
            "Withdraw your consent to personal data processing at any time.",
            "Request permanent deletion of your account and personal data via our dedicated Delete Account portal (/delete-account), processed within 72 hours.",
          ],
        },
      ],
    },
    terms: {
      badge: "Law O‘RQ-792 · Public Offer",
      title: "Terms of Service & Public Offer",
      subtitle:
        "Legal terms governing the use of the SmartChair booking platform by customers and partner businesses.",
      lastUpdated: "Last updated: October 23, 2026",
      complianceNote:
        "This document constitutes a binding Public Offer (Ommaviy oferta) pursuant to Articles 367–370 of the Civil Code of the Republic of Uzbekistan and Law No. O‘RQ-792 'On Electronic Commerce'.",
      sections: [
        {
          title: "1. Platform Role & Scope of Service",
          paragraphs: [
            "SmartChair operates as a technology marketplace and scheduling intermediary that connects customers with independent barbershops, beauty salons, spas, and self-care specialists.",
            "All grooming, beauty, and wellness services are performed directly by independent Partner Businesses. Partner Businesses are solely responsible for in-salon service quality, hygiene, licensing, and safety.",
          ],
        },
        {
          title: "2. Customer Obligations",
          bullets: [
            "Provide an accurate name and active phone number when booking an appointment.",
            "Arrive on time for confirmed appointments or cancel/reschedule via the app at least 2 hours in advance.",
            "Repeated unexcused no-shows (3 or more missed appointments without cancellation) may result in temporary suspension of instant booking privileges.",
          ],
        },
        {
          title: "3. Partner Business Obligations",
          bullets: [
            "Maintain accurate service descriptions, durations, staff working hours, and transparent prices in Uzbek Soum (UZS).",
            "Honor confirmed customer bookings promptly and professionally.",
            "Process customer contact information strictly for fulfilling the booked appointment in compliance with Uzbekistan Law No. O‘RQ-547.",
          ],
        },
        {
          title: "4. Intellectual Property",
          paragraphs: [
            "The SmartChair name, logo, software architecture, UI design, and original visual assets are protected by applicable copyright and trademark laws.",
          ],
        },
        {
          title: "5. Governing Law & Dispute Resolution",
          paragraphs: [
            "These Terms are governed by the laws of the Republic of Uzbekistan. Any disputes shall first be addressed through good-faith negotiation and a 15-business-day pre-trial claim procedure, failing which they shall be resolved by the competent courts of the Republic of Uzbekistan.",
          ],
        },
      ],
    },
    refund: {
      badge: "Consumer Protection & Transparency",
      title: "Refund, Cancellation & Dispute Policy",
      subtitle:
        "Clear rules for appointment cancellations, rescheduling, refunds, and dispute resolution.",
      lastUpdated: "Last updated: October 23, 2026",
      complianceNote:
        "Aligned with the Law of the Republic of Uzbekistan 'On Protection of Consumer Rights' and international commerce standards.",
      sections: [
        {
          title: "1. Free Customer Booking & Cancellation Policy",
          paragraphs: [
            "Booking appointments through SmartChair is 100% free for customers. Customers pay for their haircut, styling, or beauty treatment directly at the barbershop or salon after the service is completed.",
          ],
          bullets: [
            "Free Cancellation Window: Customers may cancel any booking free of charge up to 2 hours before the scheduled appointment time inside the Telegram Mini App or mobile app.",
            "Instant Rescheduling: You may modify or rebook your appointment for any other available slot at no cost.",
          ],
        },
        {
          title: "2. Prepayments, Deposits & Service Quality Refunds",
          bullets: [
            "If a specific partner salon requires an advance deposit for a specialized package, canceling at least 2 hours prior to the appointment — or any cancellation initiated by the salon — entitles the customer to a 100% refund of the deposit.",
            "If an in-salon service fails to meet statutory consumer quality standards under the Law of the Republic of Uzbekistan 'On Protection of Consumer Rights', the customer is entitled to free remediation or a refund from the service provider.",
          ],
        },
        {
          title: "3. Cancellations by Partner Businesses",
          paragraphs: [
            "If an emergency prevents a specialist from fulfilling a confirmed appointment, the salon must notify the customer immediately and offer priority rescheduling.",
          ],
        },
        {
          title: "4. B2B Partner Subscription Refunds",
          paragraphs: [
            "Partner businesses subscribing to paid B2B software tiers or promotional placements may request a pro-rata refund for unused billing periods within 14 calendar days of payment. Approved refunds are processed within 3–5 business days.",
          ],
        },
        {
          title: "5. 48-Hour Dispute Resolution Contact",
          paragraphs: [
            "If you experience any billing issue, unfair cancellation, or dispute with a listed business, contact SmartChair Support at +998 94 982 70 70. Every case is reviewed within 48 hours.",
          ],
        },
      ],
    },
    deleteAccount: {
      badge: "Law O‘RQ-547 Art. 21 · App Store & Google Play",
      title: "Account & Personal Data Deletion",
      subtitle:
        "Instructions and self-service web request form to permanently delete your SmartChair account and personal data.",
      lastUpdated: "Last updated: October 23, 2026",
      complianceNote:
        "Provided in compliance with Article 21 of Uzbekistan Law No. O‘RQ-547 'On Personal Data', Apple App Store Review Guideline 5.1.1(v), and Google Play Data Safety requirements.",
      sections: [
        {
          title: "1. How to Request Account & Data Deletion",
          bullets: [
            "Option 1 (Instant Web Form Below): Enter your registered phone number or Telegram username in the form below and click 'Submit Data Deletion Request'.",
            "Option 2 (Direct Support Contact): Call +998 94 982 70 70 or message @SmartChairNamanganbot requesting account deletion.",
          ],
        },
        {
          title: "2. What Data is Permanently Deleted?",
          bullets: [
            "Personal Profile: Your full name, phone number, Telegram ID, and @username.",
            "App Activity & Tokens: Saved favorite shops, active mobile/web authentication tokens, and notification preferences.",
            "Any upcoming pending or confirmed appointments are automatically canceled.",
          ],
        },
        {
          title: "3. Deletion Timeline (Within 72 Hours)",
          paragraphs: [
            "All verified deletion requests are executed within a maximum of 72 hours, permanently purging your personal identifiers from active SmartChair databases.",
          ],
        },
      ],
    },
    deleteForm: {
      formTitle: "Request Account & Personal Data Deletion",
      formSubtitle:
        "Enter the phone number or Telegram username linked to your SmartChair profile. Your request will be logged immediately and completed within 72 hours.",
      phoneLabel: "Registered Phone Number",
      phonePlaceholder: "+998 90 123 45 67",
      telegramLabel: "Telegram Username or ID",
      telegramPlaceholder: "@username",
      reasonLabel: "Reason for deletion (optional)",
      reasonPlaceholder: "Let us know why you are deleting your account...",
      confirmLabel:
        "I confirm that I want to permanently delete my SmartChair account and all associated personal data.",
      submitBtn: "Submit Data Deletion Request",
      submittingBtn: "Submitting request...",
      errorIdentifier:
        "Please enter either your registered phone number or your Telegram username.",
      errorConfirm: "Please check the confirmation box to proceed with account deletion.",
      successTitle: "Deletion Request Registered",
      successDesc:
        "Your account and personal data deletion request has been logged and will be permanently completed within 72 hours.",
      requestIdLabel: "Request Reference ID:",
    },
  },
};

export function resolveLegalLang(rawLang?: string): SupportedLang {
  if (!rawLang) return "uz";
  const short = rawLang.slice(0, 2).toLowerCase();
  if (short === "ru") return "ru";
  if (short === "en") return "en";
  return "uz";
}
