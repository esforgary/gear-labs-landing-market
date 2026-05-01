import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface ThemePreset {
  id: string;
  nameKey: string;
  preview: string;
  vars: Record<string, string>;
}

export interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

type TranslationMap = Record<string, Record<string, string>>;

interface I18nResponse {
  languages?: LanguageOption[];
  translations?: TranslationMap;
}

interface ThemeLangContextValue {
  themeId: string;
  setThemeId: (id: string) => void;
  currentTheme: ThemePreset;
  themes: ThemePreset[];
  lang: string;
  setLang: (code: string) => void;
  languages: LanguageOption[];
  t: (key: string, params?: Record<string, string | number>) => string;
}

const defaultLanguages: LanguageOption[] = [
  { code: "ru", name: "Россия", flag: "img/flags/ru.svg" },
  { code: "en", name: "England", flag: "img/flags/en.svg" },
  { code: "de", name: "Deutschland", flag: "img/flags/de.svg" },
  { code: "fr", name: "France", flag: "img/flags/fr.svg" },
  { code: "it", name: "Italia", flag: "img/flags/it.svg" },
  { code: "pl", name: "Polska", flag: "img/flags/pl.svg" },
  { code: "cz", name: "Cesko", flag: "img/flags/cz.svg" },
  { code: "sk", name: "Slovensko", flag: "img/flags/sk.svg" },
];

export const themePresets: ThemePreset[] = [
  {
    id: "light",
    nameKey: "theme.light",
    preview: "conic-gradient(#ff7300 0deg 90deg, #3e98ff 90deg 180deg, #f1f1f1 180deg 270deg, #ffffff 270deg 360deg)",
    vars: {
      orange: "#ff7300",
      blue: "#3e98ff",
      silver: "#f1f1f1",
      red: "#ff3333",
      yellow: "#ffc400",
      "space-gray": "#181818",
      "page-bg": "#f1f1f1",
      "page-bg-soft": "#f8fafc",
      surface: "#ffffff",
      "surface-soft": "#f6f8fb",
      "surface-muted": "#eef3f8",
      "surface-inverse": "#181818",
      "text-primary": "#20262e",
      "text-secondary": "#4d5865",
      "text-muted": "#6f7883",
      "text-inverse": "#ffffff",
      "border-soft": "rgba(24, 24, 24, 0.08)",
      "border-strong": "rgba(24, 24, 24, 0.14)",
      "shadow-soft": "0 18px 46px rgba(29, 35, 45, 0.08)",
      "shadow-strong": "0 30px 80px rgba(35, 45, 60, 0.16)",
      "hero-bg-start": "#ffffff",
      "hero-bg-end": "#eef5ff",
      "input-bg": "#ffffff",
      "input-text": "#111827",
      "input-border": "rgba(255, 255, 255, 0.18)",
      "catalog-bg-start": "#1a1b1f",
      "catalog-bg-end": "#0f1013",
      "catalog-surface": "#202229",
      "catalog-surface-soft": "#262933",
      "catalog-surface-muted": "#303440",
      "catalog-text-primary": "#f7f8fb",
      "catalog-text-secondary": "#c3cad5",
      "catalog-text-muted": "#8e97a5",
      "catalog-border": "rgba(255, 255, 255, 0.12)",
      "catalog-chip-bg": "rgba(255, 255, 255, 0.08)",
      "catalog-shadow": "0 34px 90px rgba(0, 0, 0, 0.34)",
      "theme-preview": "conic-gradient(#ff7300 0deg 90deg, #3e98ff 90deg 180deg, #f1f1f1 180deg 270deg, #ffffff 270deg 360deg)",
    },
  },
  {
    id: "dark",
    nameKey: "theme.dark",
    preview: "conic-gradient(#ff2b2b 0deg 90deg, #ffc400 90deg 180deg, #121212 180deg 270deg, #000000 270deg 360deg)",
    vars: {
      orange: "#ff2b2b",
      blue: "#ffc400",
      silver: "#101114",
      red: "#ff2b2b",
      yellow: "#ffc400",
      "space-gray": "#050505",
      "page-bg": "#101114",
      "page-bg-soft": "#17181d",
      surface: "#181a20",
      "surface-soft": "#20222a",
      "surface-muted": "#252833",
      "surface-inverse": "#080808",
      "text-primary": "#f5f7fb",
      "text-secondary": "#d6d9df",
      "text-muted": "#a8afba",
      "text-inverse": "#ffffff",
      "border-soft": "rgba(255, 255, 255, 0.10)",
      "border-strong": "rgba(255, 255, 255, 0.18)",
      "shadow-soft": "0 18px 48px rgba(0, 0, 0, 0.32)",
      "shadow-strong": "0 34px 90px rgba(0, 0, 0, 0.48)",
      "hero-bg-start": "#181a20",
      "hero-bg-end": "#101114",
      "input-bg": "#ffffff",
      "input-text": "#0f1115",
      "input-border": "rgba(255, 255, 255, 0.18)",
      "catalog-bg-start": "#ffffff",
      "catalog-bg-end": "#eef5ff",
      "catalog-surface": "#ffffff",
      "catalog-surface-soft": "#f6f8fb",
      "catalog-surface-muted": "#eef3f8",
      "catalog-text-primary": "#20262e",
      "catalog-text-secondary": "#4d5865",
      "catalog-text-muted": "#6f7883",
      "catalog-border": "rgba(24, 24, 24, 0.08)",
      "catalog-chip-bg": "rgba(255, 255, 255, 0.74)",
      "catalog-shadow": "0 30px 80px rgba(35, 45, 60, 0.16)",
      "theme-preview": "conic-gradient(#ff2b2b 0deg 90deg, #ffc400 90deg 180deg, #121212 180deg 270deg, #000000 270deg 360deg)",
    },
  },
];

const ru = {
  "theme.light": "Светлая",
  "theme.dark": "Темная",
  "nav.home": "GearLabs",
  "nav.about": "Про нас",
  "nav.development": "Разработка",
  "nav.catalog": "Каталог",
  "nav.start": "Приступим",
  "eyebrow.banner": "Стартовый блок",
  "eyebrow.tech": "Стек проекта",
  "eyebrow.catalog": "Каталог макетов",
  "eyebrow.about": "Преимущества",
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
  "workshop.summary": "18 вариантов",
  "workshop.tabs.sites": "Сайты",
  "workshop.tabs.apps": "Приложения",
  "workshop.tabs.bots": "Боты",
  "workshop.time.0": "5 дней",
  "workshop.time.1": "7 дней",
  "workshop.time.2": "10 дней",
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
  "footer.tagline": "Делаем сайты, приложения и ботов с аккуратным визуалом, быстрым запуском и понятной структурой.",
  "footer.navigation": "Навигация",
  "footer.services": "Услуги",
  "footer.cta.badge": "Готовы начать",
  "footer.cta.title": "Соберем проект под вашу задачу",
  "footer.copy": "Создано для быстрых цифровых запусков.",
};

const fallbackTranslations: TranslationMap = {
  ru,
  en: {
    ...ru,
    "theme.light": "Light",
    "theme.dark": "Dark",
    "nav.about": "About",
    "nav.development": "Development",
    "nav.catalog": "Catalog",
    "nav.start": "Start",
    "eyebrow.banner": "Hero section",
    "eyebrow.tech": "Project stack",
    "eyebrow.catalog": "Layout catalog",
    "eyebrow.about": "Advantages",
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
    "banner.point.design": "Design",
    "banner.point.dev": "Development",
    "banner.point.launch": "Launch",
    "banner.image.0.title": "Responsive websites",
    "banner.image.1.title": "Apps and dashboards",
    "banner.image.2.title": "Bots and integrations",
    "tech.title": "Technologies",
    "workshop.title": "Layouts",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Layout description. Details will be shown here.",
    "workshop.review": "review",
    "workshop.summary": "18 options",
    "workshop.tabs.sites": "Websites",
    "workshop.tabs.apps": "Apps",
    "workshop.tabs.bots": "Bots",
    "workshop.time.0": "5 days",
    "workshop.time.1": "7 days",
    "workshop.time.2": "10 days",
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
    "footer.tagline": "We build websites, apps, and bots with clean visuals, fast launch, and clear structure.",
    "footer.navigation": "Navigation",
    "footer.services": "Services",
    "footer.cta.badge": "Ready to start",
    "footer.cta.title": "We will shape a project for your task",
    "footer.copy": "Created for fast digital launches.",
  },
  de: {
    ...ru,
    "theme.light": "Hell",
    "theme.dark": "Dunkel",
    "nav.about": "Uber uns",
    "nav.development": "Entwicklung",
    "nav.catalog": "Katalog",
    "nav.start": "Starten",
    "eyebrow.banner": "Startbereich",
    "eyebrow.tech": "Projekt-Stack",
    "eyebrow.catalog": "Layout-Katalog",
    "eyebrow.about": "Vorteile",
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
    "banner.point.design": "Design",
    "banner.point.dev": "Entwicklung",
    "banner.point.launch": "Start",
    "banner.image.0.title": "Adaptive Websites",
    "banner.image.1.title": "Apps und Dashboards",
    "banner.image.2.title": "Bots und Integrationen",
    "tech.title": "Technologien",
    "workshop.title": "Layouts",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Layoutbeschreibung. Details werden hier angezeigt.",
    "workshop.review": "Ubersicht",
    "workshop.summary": "18 Varianten",
    "workshop.tabs.sites": "Websites",
    "workshop.tabs.apps": "Apps",
    "workshop.tabs.bots": "Bots",
    "workshop.time.0": "5 Tage",
    "workshop.time.1": "7 Tage",
    "workshop.time.2": "10 Tage",
    "about.title": "Warum wir",
    "fitback.title": "Wie funktioniert es?",
    "fitback.feature.site.title": "Ihre Website",
    "fitback.feature.site.text": "Wahlen Sie das Design der zukunftigen Website aus den Varianten oben.",
    "fitback.feature.wishes.title": "Ihre Wunsche",
    "fitback.feature.wishes.text": "Beschreiben Sie Aufgabe, Ziele und Stimmung. Klare Angaben bringen uns schneller zum passenden Design.",
    "fitback.feature.content.title": "Inhalte",
    "fitback.feature.content.text": "Fugen Sie Fotos, Videos und Texte hinzu, die auf Website oder App erscheinen sollen.",
    "fitback.form.badge": "Abschlussformular",
    "fitback.form.title": "Letzter Schritt",
    "fitback.form.name": "Name",
    "fitback.form.contact": "Kontaktdaten",
    "fitback.form.comment": "Kommentar",
    "fitback.form.submit": "Senden",
    "footer.tagline": "Wir bauen Websites, Apps und Bots mit klarem Design, schnellem Start und sauberer Struktur.",
    "footer.navigation": "Navigation",
    "footer.services": "Services",
    "footer.cta.badge": "Bereit zum Start",
    "footer.cta.title": "Wir formen ein Projekt fur Ihre Aufgabe",
    "footer.copy": "Erstellt fur schnelle digitale Starts.",
  },
  fr: {
    ...ru,
    "theme.light": "Clair",
    "theme.dark": "Sombre",
    "nav.about": "A propos",
    "nav.development": "Developpement",
    "nav.catalog": "Catalogue",
    "nav.start": "Commencer",
    "eyebrow.banner": "Bloc principal",
    "eyebrow.tech": "Stack projet",
    "eyebrow.catalog": "Catalogue",
    "eyebrow.about": "Avantages",
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
    "banner.point.design": "Design",
    "banner.point.dev": "Developpement",
    "banner.point.launch": "Lancement",
    "banner.image.0.title": "Sites responsives",
    "banner.image.1.title": "Apps et tableaux",
    "banner.image.2.title": "Bots et integrations",
    "tech.title": "Technologies",
    "workshop.title": "Modeles",
    "workshop.card.prefix": "Modele #{number}",
    "workshop.card.text": "Description du modele. Les details seront affiches ici.",
    "workshop.review": "apercu",
    "workshop.summary": "18 options",
    "workshop.tabs.sites": "Sites",
    "workshop.tabs.apps": "Apps",
    "workshop.tabs.bots": "Bots",
    "workshop.time.0": "5 jours",
    "workshop.time.1": "7 jours",
    "workshop.time.2": "10 jours",
    "about.title": "Pourquoi nous choisir",
    "fitback.title": "Comment ca marche?",
    "fitback.feature.site.title": "Votre site",
    "fitback.feature.site.text": "Choisissez le design du futur site parmi les options ci-dessus.",
    "fitback.feature.wishes.title": "Vos souhaits",
    "fitback.feature.wishes.text": "Decrivez la tache, les objectifs et l'ambiance souhaitee. Des informations claires accelerent le bon visuel.",
    "fitback.feature.content.title": "Contenu",
    "fitback.feature.content.text": "Ajoutez photos, videos et textes qui doivent apparaitre sur le site ou l'application.",
    "fitback.form.badge": "Formulaire final",
    "fitback.form.title": "Derniere etape",
    "fitback.form.name": "Nom complet",
    "fitback.form.contact": "Contacts",
    "fitback.form.comment": "Commentaire",
    "fitback.form.submit": "Envoyer",
    "footer.tagline": "Nous creons sites, apps et bots avec un visuel propre, un lancement rapide et une structure claire.",
    "footer.navigation": "Navigation",
    "footer.services": "Services",
    "footer.cta.badge": "Pret a commencer",
    "footer.cta.title": "Nous construirons un projet pour votre objectif",
    "footer.copy": "Cree pour des lancements digitaux rapides.",
  },
  it: {
    ...ru,
    "theme.light": "Chiara",
    "theme.dark": "Scura",
    "nav.about": "Chi siamo",
    "nav.development": "Sviluppo",
    "nav.catalog": "Catalogo",
    "nav.start": "Iniziamo",
    "eyebrow.banner": "Blocco iniziale",
    "eyebrow.tech": "Stack progetto",
    "eyebrow.catalog": "Catalogo layout",
    "eyebrow.about": "Vantaggi",
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
    "banner.point.design": "Design",
    "banner.point.dev": "Sviluppo",
    "banner.point.launch": "Lancio",
    "banner.image.0.title": "Siti responsive",
    "banner.image.1.title": "App e dashboard",
    "banner.image.2.title": "Bot e integrazioni",
    "tech.title": "Tecnologie",
    "workshop.title": "Layout",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Descrizione del layout. I dettagli saranno mostrati qui.",
    "workshop.review": "anteprima",
    "workshop.summary": "18 opzioni",
    "workshop.tabs.sites": "Siti",
    "workshop.tabs.apps": "App",
    "workshop.tabs.bots": "Bot",
    "workshop.time.0": "5 giorni",
    "workshop.time.1": "7 giorni",
    "workshop.time.2": "10 giorni",
    "about.title": "Perche sceglierci",
    "fitback.title": "Come funziona?",
    "fitback.feature.site.title": "Il tuo sito",
    "fitback.feature.site.text": "Scegli il design del futuro sito dalle opzioni qui sopra.",
    "fitback.feature.wishes.title": "I tuoi desideri",
    "fitback.feature.wishes.text": "Descrivi obiettivo, compito e atmosfera. Input chiari ci portano prima al visual giusto.",
    "fitback.feature.content.title": "Contenuti",
    "fitback.feature.content.text": "Allega foto, video e testi che dovranno apparire sul sito o nell'app.",
    "fitback.form.badge": "Modulo finale",
    "fitback.form.title": "Ultimo passo",
    "fitback.form.name": "Nome completo",
    "fitback.form.contact": "Contatti",
    "fitback.form.comment": "Commento",
    "fitback.form.submit": "Invia",
    "footer.tagline": "Creiamo siti, app e bot con visual pulito, lancio rapido e struttura chiara.",
    "footer.navigation": "Navigazione",
    "footer.services": "Servizi",
    "footer.cta.badge": "Pronti a partire",
    "footer.cta.title": "Costruiremo un progetto per il tuo obiettivo",
    "footer.copy": "Creato per lanci digitali rapidi.",
  },
  pl: {
    ...ru,
    "theme.light": "Jasny",
    "theme.dark": "Ciemny",
    "nav.about": "O nas",
    "nav.development": "Rozwoj",
    "nav.catalog": "Katalog",
    "nav.start": "Zaczynamy",
    "eyebrow.banner": "Sekcja startowa",
    "eyebrow.tech": "Stack projektu",
    "eyebrow.catalog": "Katalog layoutow",
    "eyebrow.about": "Zalety",
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
    "banner.point.design": "Design",
    "banner.point.dev": "Rozwoj",
    "banner.point.launch": "Start",
    "banner.image.0.title": "Responsywne strony",
    "banner.image.1.title": "Aplikacje i panele",
    "banner.image.2.title": "Boty i integracje",
    "tech.title": "Technologie",
    "workshop.title": "Layouty",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Opis layoutu. Szczegoly beda pokazane tutaj.",
    "workshop.review": "podglad",
    "workshop.summary": "18 opcji",
    "workshop.tabs.sites": "Strony",
    "workshop.tabs.apps": "Aplikacje",
    "workshop.tabs.bots": "Boty",
    "workshop.time.0": "5 dni",
    "workshop.time.1": "7 dni",
    "workshop.time.2": "10 dni",
    "about.title": "Dlaczego my",
    "fitback.title": "Jak to dziala?",
    "fitback.feature.site.title": "Twoja strona",
    "fitback.feature.site.text": "Wybierz projekt przyszlej strony z opcji powyzej.",
    "fitback.feature.wishes.title": "Twoje zyczenia",
    "fitback.feature.wishes.text": "Opisz zadanie, cele i klimat. Jasne informacje szybciej prowadza do wlasciwego wygladu.",
    "fitback.feature.content.title": "Tresci",
    "fitback.feature.content.text": "Dolacz zdjecia, filmy i teksty, ktore maja pojawic sie na stronie lub w aplikacji.",
    "fitback.form.badge": "Formularz koncowy",
    "fitback.form.title": "Ostatni krok",
    "fitback.form.name": "Imie i nazwisko",
    "fitback.form.contact": "Kontakt",
    "fitback.form.comment": "Komentarz",
    "fitback.form.submit": "Wyslij",
    "footer.tagline": "Tworzymy strony, aplikacje i boty z czystym wygladem, szybkim startem i jasna struktura.",
    "footer.navigation": "Nawigacja",
    "footer.services": "Uslugi",
    "footer.cta.badge": "Gotowi zaczac",
    "footer.cta.title": "Zbudujemy projekt pod Twoj cel",
    "footer.copy": "Stworzone dla szybkich cyfrowych startow.",
  },
  cz: {
    ...ru,
    "theme.light": "Svetla",
    "theme.dark": "Tmava",
    "nav.about": "O nas",
    "nav.development": "Vyvoj",
    "nav.catalog": "Katalog",
    "nav.start": "Zacit",
    "eyebrow.banner": "Uvodni blok",
    "eyebrow.tech": "Stack projektu",
    "eyebrow.catalog": "Katalog layoutu",
    "eyebrow.about": "Vyhody",
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
    "banner.point.design": "Design",
    "banner.point.dev": "Vyvoj",
    "banner.point.launch": "Spusteni",
    "banner.image.0.title": "Responzivni weby",
    "banner.image.1.title": "Aplikace a panely",
    "banner.image.2.title": "Boti a integrace",
    "tech.title": "Technologie",
    "workshop.title": "Layouty",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Popis layoutu. Podrobnosti se zobrazi zde.",
    "workshop.review": "nahled",
    "workshop.summary": "18 moznosti",
    "workshop.tabs.sites": "Weby",
    "workshop.tabs.apps": "Aplikace",
    "workshop.tabs.bots": "Boti",
    "workshop.time.0": "5 dni",
    "workshop.time.1": "7 dni",
    "workshop.time.2": "10 dni",
    "about.title": "Proc si vybrat nas",
    "fitback.title": "Jak to funguje?",
    "fitback.feature.site.title": "Vas web",
    "fitback.feature.site.text": "Vyberte design budouciho webu z moznosti vyse.",
    "fitback.feature.wishes.title": "Vase prani",
    "fitback.feature.wishes.text": "Popiste ukol, cile a naladu. Jasne zadani nas rychleji dovede ke spravnemu vizualu.",
    "fitback.feature.content.title": "Obsah",
    "fitback.feature.content.text": "Prilozte fotky, videa a texty, ktere se maji objevit na webu nebo v aplikaci.",
    "fitback.form.badge": "Zaverecny formular",
    "fitback.form.title": "Posledni krok",
    "fitback.form.name": "Jmeno",
    "fitback.form.contact": "Kontakt",
    "fitback.form.comment": "Komentar",
    "fitback.form.submit": "Odeslat",
    "footer.tagline": "Tvorime weby, aplikace a boty s cistym vizualem, rychlym startem a jasnou strukturou.",
    "footer.navigation": "Navigace",
    "footer.services": "Sluzby",
    "footer.cta.badge": "Pripraveni zacit",
    "footer.cta.title": "Postavime projekt pro vas cil",
    "footer.copy": "Vytvoreno pro rychle digitalni starty.",
  },
  sk: {
    ...ru,
    "theme.light": "Svetla",
    "theme.dark": "Tmava",
    "nav.about": "O nas",
    "nav.development": "Vyvoj",
    "nav.catalog": "Katalog",
    "nav.start": "Zacat",
    "eyebrow.banner": "Uvodny blok",
    "eyebrow.tech": "Stack projektu",
    "eyebrow.catalog": "Katalog layoutov",
    "eyebrow.about": "Vyhody",
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
    "banner.point.design": "Dizajn",
    "banner.point.dev": "Vyvoj",
    "banner.point.launch": "Spustenie",
    "banner.image.0.title": "Responzivne weby",
    "banner.image.1.title": "Aplikacie a panely",
    "banner.image.2.title": "Boti a integracie",
    "tech.title": "Technologie",
    "workshop.title": "Layouty",
    "workshop.card.prefix": "Layout #{number}",
    "workshop.card.text": "Popis layoutu. Podrobnosti sa zobrazia tu.",
    "workshop.review": "nahlad",
    "workshop.summary": "18 moznosti",
    "workshop.tabs.sites": "Weby",
    "workshop.tabs.apps": "Aplikacie",
    "workshop.tabs.bots": "Boti",
    "workshop.time.0": "5 dni",
    "workshop.time.1": "7 dni",
    "workshop.time.2": "10 dni",
    "about.title": "Preco si vybrat nas",
    "fitback.title": "Ako to funguje?",
    "fitback.feature.site.title": "Vas web",
    "fitback.feature.site.text": "Vyberte dizajn buduceho webu z moznosti vyssie.",
    "fitback.feature.wishes.title": "Vase zelania",
    "fitback.feature.wishes.text": "Popiste ulohu, ciele a naladu. Jasne zadanie nas rychlejsie dovedie k spravnemu vizualu.",
    "fitback.feature.content.title": "Obsah",
    "fitback.feature.content.text": "Prilozte fotky, videa a texty, ktore sa maju objavit na webe alebo v aplikacii.",
    "fitback.form.badge": "Zaverecny formular",
    "fitback.form.title": "Posledny krok",
    "fitback.form.name": "Meno",
    "fitback.form.contact": "Kontakt",
    "fitback.form.comment": "Komentar",
    "fitback.form.submit": "Odoslat",
    "footer.tagline": "Tvorime weby, aplikacie a boty s cistym vizualom, rychlym startom a jasnou strukturou.",
    "footer.navigation": "Navigacia",
    "footer.services": "Sluzby",
    "footer.cta.badge": "Pripraveni zacat",
    "footer.cta.title": "Postavime projekt pre vas ciel",
    "footer.copy": "Vytvorene pre rychle digitalne starty.",
  },
};

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

const ThemeLangContext = createContext<ThemeLangContextValue | null>(null);

const mergeTranslations = (base: TranslationMap, remote: TranslationMap): TranslationMap => {
  const result: TranslationMap = { ...base };

  Object.entries(remote).forEach(([lang, values]) => {
    result[lang] = {
      ...(result[lang] ?? {}),
      ...values,
    };
  });

  return result;
};

export function ThemeLangProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeIdState] = useState(() => localStorage.getItem("gearlabs-theme") || "light");
  const [lang, setLangState] = useState(() => localStorage.getItem("gearlabs-lang") || "ru");
  const [languages, setLanguages] = useState<LanguageOption[]>(defaultLanguages);
  const [remoteTranslations, setRemoteTranslations] = useState<TranslationMap>({});

  const translations = useMemo(
    () => mergeTranslations(fallbackTranslations, remoteTranslations),
    [remoteTranslations]
  );

  const currentTheme = useMemo(
    () => themePresets.find((theme) => theme.id === themeId) ?? themePresets[0],
    [themeId]
  );

  const setThemeId = useCallback((id: string) => {
    setThemeIdState(themePresets.some((theme) => theme.id === id) ? id : themePresets[0].id);
  }, []);

  const setLang = useCallback((code: string) => {
    setLangState(code);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const template = translations[lang]?.[key] ?? translations.ru?.[key] ?? key;

      if (!params) return template;

      return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
    },
    [lang, translations]
  );

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = currentTheme.id;
    Object.entries(currentTheme.vars).forEach(([name, value]) => {
      root.style.setProperty(`--${name}`, value);
    });
    localStorage.setItem("gearlabs-theme", currentTheme.id);
  }, [currentTheme]);

  useEffect(() => {
    localStorage.setItem("gearlabs-lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${apiBaseUrl}/api/i18n`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Translations are unavailable");
        return response.json() as Promise<I18nResponse>;
      })
      .then((data) => {
        if (data.languages?.length) setLanguages(data.languages);
        if (data.translations) setRemoteTranslations(data.translations);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          setLanguages(defaultLanguages);
        }
      });

    return () => controller.abort();
  }, []);

  const value = useMemo(
    () => ({
      themeId,
      setThemeId,
      currentTheme,
      themes: themePresets,
      lang,
      setLang,
      languages,
      t,
    }),
    [currentTheme, lang, languages, setLang, setThemeId, t, themeId]
  );

  return <ThemeLangContext.Provider value={value}>{children}</ThemeLangContext.Provider>;
}

export function useThemeLang() {
  const context = useContext(ThemeLangContext);
  if (!context) {
    throw new Error("useThemeLang must be used inside ThemeLangProvider");
  }
  return context;
}
