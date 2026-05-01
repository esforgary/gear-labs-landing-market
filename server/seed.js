const db = require('./db');

const initialComments = [
  {
    name: "Alice",
    rating: 4,
    avatarColor: "#FF6B6B",
    text: "Очень интересный продукт, понравилось всё, особенно внимание к деталям. Очень интересный продукт, понравилось всё, особенно внимание к деталям.",
  },
  {
    name: "Bob",
    rating: 5,
    avatarColor: "#91e59cff",
    text: "Отличная поддержка клиентов, помогли с настройкой быстро и удобно.",
  },
  {
    name: "Charlie",
    rating: 3,
    avatarColor: "#3777d1ff",
    text: "В целом хороший сервис, но есть моменты, которые можно улучшить.",
  },
  {
    name: "Diana",
    rating: 4,
    avatarColor: "#b377e4ff",
    text: "Продукт полностью соответствует описанию, буду рекомендовать друзьям.",
  },
  {
    name: "Edward",
    rating: 5,
    avatarColor: "#e29555ff",
    text: "Очень доволен, качественно, надежно и удобно.",
  },
];

const formatDate = (d) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
};

const insertComment = db.prepare(
  'INSERT INTO comments (user, text, rating, date, avatarColor) VALUES (?, ?, ?, ?, ?)'
);
const updateComment = db.prepare(
  'UPDATE comments SET rating = ?, date = ?, avatarColor = ? WHERE id = ?'
);
const findComment = db.prepare(
  'SELECT id FROM comments WHERE user = ? AND text = ? LIMIT 1'
);
const seedDate = formatDate(new Date());

initialComments.forEach((comment) => {
  const existing = findComment.get(comment.name, comment.text);

  if (existing) {
    updateComment.run(comment.rating, seedDate, comment.avatarColor, existing.id);
    return;
  }

  insertComment.run(comment.name, comment.text, comment.rating, seedDate, comment.avatarColor);
});

const languages = [
  { code: "ru", name: "Россия", flag: "img/flags/ru.svg", sortOrder: 1 },
  { code: "en", name: "England", flag: "img/flags/en.svg", sortOrder: 2 },
  { code: "de", name: "Deutschland", flag: "img/flags/de.svg", sortOrder: 3 },
  { code: "fr", name: "France", flag: "img/flags/fr.svg", sortOrder: 4 },
  { code: "it", name: "Italia", flag: "img/flags/it.svg", sortOrder: 5 },
  { code: "pl", name: "Polska", flag: "img/flags/pl.svg", sortOrder: 6 },
  { code: "cz", name: "Cesko", flag: "img/flags/cz.svg", sortOrder: 7 },
  { code: "sk", name: "Slovensko", flag: "img/flags/sk.svg", sortOrder: 8 },
];

const ruTranslations = {
  "theme.light": "Светлая",
  "theme.dark": "Темная",
  "nav.home": "GearLabs",
  "nav.about": "Про нас",
  "nav.development": "Разработка",
  "nav.catalog": "Каталог",
  "nav.start": "Приступим",
  "banner.welcome": "Приветствуем в",
  "banner.kicker": "Сайты · приложения · боты",
  "banner.title.0": "Сайты, которые продают и быстро загружаются",
  "banner.body.0": "Делаем адаптивные лендинги, каталоги и корпоративные страницы с понятной структурой, живой анимацией и удобным сценарием заявки.",
  "banner.title.1": "Приложения под ваши рабочие процессы",
  "banner.body.1": "Проектируем мобильные и desktop-интерфейсы, которые автоматизируют рутину, собирают данные и помогают команде быстрее выполнять ежедневные задачи.",
  "banner.title.2": "Боты, которые берут рутину на себя",
  "banner.body.2": "Настраиваем Telegram-ботов для заявок, уведомлений, мини-приложений и поддержки клиентов, чтобы сервис работал даже без постоянного участия менеджера.",
  "banner.action.template": "Выбрать макет",
  "banner.action.order": "Как заказать?",
  "banner.point.design": "Дизайн",
  "banner.point.dev": "Разработка",
  "banner.point.launch": "Запуск",
  "banner.image.0.label": "Web design",
  "banner.image.0.title": "Адаптивные сайты",
  "banner.image.1.label": "App systems",
  "banner.image.1.title": "Приложения и панели",
  "banner.image.2.label": "Automation",
  "banner.image.2.title": "Боты и интеграции",
  "tech.title": "Технологии",
  "workshop.title": "Макеты",
  "workshop.card.prefix": "Макет №{number}",
  "workshop.card.text": "Описание макета. Здесь будет информация о нем.",
  "workshop.review": "обзор",
  "about.title": "Почему стоит выбрать нас",
  "fitback.title": "Как это работает?",
  "fitback.feature.site.title": "Ваш сайт",
  "fitback.feature.site.text": "Выберите дизайн будущего сайта из предложенных выше вариантов.",
  "fitback.feature.wishes.title": "Ваши пожелания",
  "fitback.feature.wishes.text": "Опишите задачу, цели и желаемую атмосферу. Чем точнее вводные, тем быстрее мы попадем в нужный визуал.",
  "fitback.feature.content.title": "Наполнение",
  "fitback.feature.content.text": "Прикрепите фото, видео и тексты, которые должны появиться на сайте или в приложении.",
  "fitback.form.badge": "Финишная форма",
  "fitback.form.title": "Последний шаг",
  "fitback.form.name": "ФИО",
  "fitback.form.contact": "Контактные данные",
  "fitback.form.comment": "Комментарий",
  "fitback.form.submit": "Отправить",
};

const translations = {
  ru: ruTranslations,
  en: {
    ...ruTranslations,
    "theme.light": "Light",
    "theme.dark": "Dark",
    "nav.about": "About",
    "nav.development": "Development",
    "nav.catalog": "Catalog",
    "nav.start": "Start",
    "banner.welcome": "Welcome to",
    "banner.kicker": "Websites · apps · bots",
    "banner.title.0": "Websites that sell and load fast",
    "banner.body.0": "We build responsive landing pages, catalogs, and company pages with clear structure, smooth animation, and an easy request flow.",
    "banner.title.1": "Apps for your workflows",
    "banner.body.1": "We design mobile and desktop interfaces that automate routine work, collect data, and help teams move faster every day.",
    "banner.title.2": "Bots that handle routine work",
    "banner.body.2": "We set up Telegram bots for requests, notifications, mini apps, and customer support so the service keeps working without constant manager input.",
    "banner.action.template": "Choose layout",
    "banner.action.order": "How to order?",
    "banner.image.0.title": "Responsive websites",
    "banner.image.1.title": "Apps and dashboards",
    "banner.image.2.title": "Bots and integrations",
    "tech.title": "Technologies",
    "workshop.title": "Layouts",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Layout description. Details will be shown here.",
    "workshop.review": "review",
    "about.title": "Why choose us",
    "fitback.title": "How does it work?",
    "fitback.feature.site.title": "Your website",
    "fitback.feature.site.text": "Choose the future website design from the options above.",
    "fitback.feature.wishes.title": "Your wishes",
    "fitback.feature.wishes.text": "Describe the task, goals, and desired feeling. Clear input helps us reach the right visual faster.",
    "fitback.feature.content.title": "Content",
    "fitback.feature.content.text": "Attach photos, videos, and copy that should appear on the website or app.",
    "fitback.form.badge": "Final form",
    "fitback.form.title": "Last step",
    "fitback.form.name": "Full name",
    "fitback.form.contact": "Contact details",
    "fitback.form.comment": "Comment",
    "fitback.form.submit": "Send",
  },
  de: {
    ...ruTranslations,
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "nav.about": "Uber uns",
    "nav.development": "Entwicklung",
    "nav.catalog": "Katalog",
    "nav.start": "Starten",
    "banner.welcome": "Willkommen bei",
    "banner.kicker": "Websites · Apps · Bots",
    "banner.title.0": "Websites, die verkaufen und schnell laden",
    "banner.body.0": "Wir erstellen adaptive Landingpages, Kataloge und Unternehmensseiten mit klarer Struktur, lebendiger Animation und einfachem Anfrageweg.",
    "banner.title.1": "Apps fur Ihre Arbeitsprozesse",
    "banner.body.1": "Wir entwerfen mobile und Desktop-Oberflachen, die Routine automatisieren, Daten sammeln und Teams schneller machen.",
    "banner.title.2": "Bots ubernehmen Routinearbeit",
    "banner.body.2": "Wir richten Telegram-Bots fur Anfragen, Benachrichtigungen, Mini-Apps und Support ein, damit der Service weiterlauft.",
    "banner.action.template": "Layout wahlen",
    "banner.action.order": "Wie bestellen?",
    "tech.title": "Technologien",
    "workshop.title": "Layouts",
    "about.title": "Warum wir",
    "fitback.title": "Wie funktioniert es?",
    "fitback.form.title": "Letzter Schritt",
    "fitback.form.name": "Name",
    "fitback.form.contact": "Kontaktdaten",
    "fitback.form.comment": "Kommentar",
    "fitback.form.submit": "Senden",
  },
  fr: {
    ...ruTranslations,
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "nav.about": "A propos",
    "nav.development": "Developpement",
    "nav.catalog": "Catalogue",
    "nav.start": "Commencer",
    "banner.welcome": "Bienvenue chez",
    "banner.kicker": "Sites · apps · bots",
    "banner.title.0": "Des sites qui vendent et chargent vite",
    "banner.body.0": "Nous creons des pages, catalogues et sites d'entreprise responsives avec une structure claire et un parcours de demande simple.",
    "banner.title.1": "Des apps pour vos processus",
    "banner.body.1": "Nous concevons des interfaces mobiles et desktop qui automatisent la routine, collectent les donnees et accelerent l'equipe.",
    "banner.title.2": "Des bots qui gerent la routine",
    "banner.body.2": "Nous configurons des bots Telegram pour les demandes, notifications, mini-apps et support client.",
    "banner.action.template": "Choisir un modele",
    "banner.action.order": "Comment commander?",
    "tech.title": "Technologies",
    "workshop.title": "Modeles",
    "about.title": "Pourquoi nous choisir",
    "fitback.title": "Comment ca marche?",
    "fitback.form.title": "Derniere etape",
    "fitback.form.name": "Nom complet",
    "fitback.form.contact": "Contacts",
    "fitback.form.comment": "Commentaire",
    "fitback.form.submit": "Envoyer",
  },
  it: {
    ...ruTranslations,
    "theme.light": "Chiara",
    "theme.dark": "Scura",
    "nav.about": "Chi siamo",
    "nav.development": "Sviluppo",
    "nav.catalog": "Catalogo",
    "nav.start": "Iniziamo",
    "banner.welcome": "Benvenuti in",
    "banner.kicker": "Siti · app · bot",
    "banner.title.0": "Siti che vendono e caricano in fretta",
    "banner.body.0": "Creiamo landing, cataloghi e pagine aziendali responsive con struttura chiara, animazione fluida e richiesta semplice.",
    "banner.title.1": "App per i tuoi processi",
    "banner.body.1": "Progettiamo interfacce mobile e desktop che automatizzano la routine, raccolgono dati e aiutano il team.",
    "banner.title.2": "Bot che gestiscono la routine",
    "banner.body.2": "Configuriamo bot Telegram per richieste, notifiche, mini app e supporto clienti.",
    "banner.action.template": "Scegli layout",
    "banner.action.order": "Come ordinare?",
    "tech.title": "Tecnologie",
    "workshop.title": "Layout",
    "about.title": "Perche sceglierci",
    "fitback.title": "Come funziona?",
    "fitback.form.title": "Ultimo passo",
    "fitback.form.name": "Nome completo",
    "fitback.form.contact": "Contatti",
    "fitback.form.comment": "Commento",
    "fitback.form.submit": "Invia",
  },
  pl: {
    ...ruTranslations,
    "theme.light": "Jasny",
    "theme.dark": "Ciemny",
    "nav.about": "O nas",
    "nav.development": "Rozwoj",
    "nav.catalog": "Katalog",
    "nav.start": "Zaczynamy",
    "banner.welcome": "Witamy w",
    "banner.kicker": "Strony · aplikacje · boty",
    "banner.title.0": "Strony, ktore sprzedaja i szybko sie laduja",
    "banner.body.0": "Tworzymy responsywne landing page, katalogi i strony firmowe z jasna struktura, animacja i wygodnym formularzem.",
    "banner.title.1": "Aplikacje dla Twoich procesow",
    "banner.body.1": "Projektujemy interfejsy mobilne i desktopowe, ktore automatyzuja rutynę, zbieraja dane i wspieraja zespol.",
    "banner.title.2": "Boty przejmuja rutynę",
    "banner.body.2": "Konfigurujemy boty Telegram do zgloszen, powiadomien, mini aplikacji i obslugi klienta.",
    "banner.action.template": "Wybierz layout",
    "banner.action.order": "Jak zamowic?",
    "tech.title": "Technologie",
    "workshop.title": "Layouty",
    "about.title": "Dlaczego my",
    "fitback.title": "Jak to dziala?",
    "fitback.form.title": "Ostatni krok",
    "fitback.form.name": "Imie i nazwisko",
    "fitback.form.contact": "Kontakt",
    "fitback.form.comment": "Komentarz",
    "fitback.form.submit": "Wyslij",
  },
  cz: {
    ...ruTranslations,
    "theme.light": "Svetla",
    "theme.dark": "Tmava",
    "nav.about": "O nas",
    "nav.development": "Vyvoj",
    "nav.catalog": "Katalog",
    "nav.start": "Zacit",
    "banner.welcome": "Vitejte v",
    "banner.kicker": "Weby · aplikace · boti",
    "banner.title.0": "Weby, ktere prodavaji a rychle se nacitaji",
    "banner.body.0": "Tvorime responzivni landing page, katalogy a firemni stranky s jasnou strukturou a pohodlnou poptavkou.",
    "banner.title.1": "Aplikace pro vase procesy",
    "banner.body.1": "Navrhujeme mobilni a desktopova rozhrani, ktera automatizuji rutinu, sbiraji data a zrychluji tym.",
    "banner.title.2": "Boti prevezmou rutinu",
    "banner.body.2": "Nastavujeme Telegram boty pro poptavky, notifikace, mini aplikace a zakaznickou podporu.",
    "banner.action.template": "Vybrat layout",
    "banner.action.order": "Jak objednat?",
    "tech.title": "Technologie",
    "workshop.title": "Layouty",
    "about.title": "Proc si vybrat nas",
    "fitback.title": "Jak to funguje?",
    "fitback.form.title": "Posledni krok",
    "fitback.form.name": "Jmeno",
    "fitback.form.contact": "Kontakt",
    "fitback.form.comment": "Komentar",
    "fitback.form.submit": "Odeslat",
  },
  sk: {
    ...ruTranslations,
    "theme.light": "Svetla",
    "theme.dark": "Tmava",
    "nav.about": "O nas",
    "nav.development": "Vyvoj",
    "nav.catalog": "Katalog",
    "nav.start": "Zacat",
    "banner.welcome": "Vitajte v",
    "banner.kicker": "Weby · aplikacie · boti",
    "banner.title.0": "Weby, ktore predavaju a rychlo sa nacitaju",
    "banner.body.0": "Tvorime responzivne landing page, katalogy a firemne stranky s jasnou strukturou a pohodlnou poziadavkou.",
    "banner.title.1": "Aplikacie pre vase procesy",
    "banner.body.1": "Navrhujeme mobilne a desktopove rozhrania, ktore automatizuju rutinu, zbieraju data a zrychluju tim.",
    "banner.title.2": "Boti preberu rutinu",
    "banner.body.2": "Nastavujeme Telegram boty pre poziadavky, notifikacie, mini aplikacie a podporu zakaznikov.",
    "banner.action.template": "Vybrat layout",
    "banner.action.order": "Ako objednat?",
    "tech.title": "Technologie",
    "workshop.title": "Layouty",
    "about.title": "Preco si vybrat nas",
    "fitback.title": "Ako to funguje?",
    "fitback.form.title": "Posledny krok",
    "fitback.form.name": "Meno",
    "fitback.form.contact": "Kontakt",
    "fitback.form.comment": "Komentar",
    "fitback.form.submit": "Odoslat",
  },
};

const upsertLanguage = db.prepare(`
  INSERT INTO languages (code, name, flag, sortOrder, enabled)
  VALUES (?, ?, ?, ?, 1)
  ON CONFLICT(code) DO UPDATE SET
    name = excluded.name,
    flag = excluded.flag,
    sortOrder = excluded.sortOrder,
    enabled = 1
`);

const upsertTranslation = db.prepare(`
  INSERT INTO translations (lang, namespace, translationKey, value)
  VALUES (?, 'common', ?, ?)
  ON CONFLICT(lang, namespace, translationKey) DO UPDATE SET
    value = excluded.value
`);

languages.forEach((language) => {
  upsertLanguage.run(language.code, language.name, language.flag, language.sortOrder);
});

Object.entries(translations).forEach(([lang, values]) => {
  Object.entries(values).forEach(([key, value]) => {
    upsertTranslation.run(lang, key, value);
  });
});

console.log('Комментарии, языки и переводы успешно синхронизированы с базой!');
