const repeatableBlockDefaults = {
  cards: 3,
  catalog: 6,
  pricing: 3,
  reviews: 2,
  gallery: 5,
  team: 3,
  marquee: 3,
  progress: 3,
  stats: 4,
  article: 4,
};

const repeatableBlockLimits = {
  cards: { min: 1, max: 8 },
  catalog: { min: 1, max: 12 },
  pricing: { min: 1, max: 8 },
  reviews: { min: 1, max: 6 },
  gallery: { min: 1, max: 14 },
  team: { min: 1, max: 8 },
  marquee: { min: 1, max: 8 },
  progress: { min: 1, max: 8 },
  stats: { min: 1, max: 10 },
  article: { min: 1, max: 12 },
};

const blockSections = [
  {
    title: "Шапка",
    blocks: [
      { id: "header-clean", type: "header", section: "Шапка", title: "Базовая шапка", description: "Логотип, меню и CTA", price: 120, height: 92, icon: "PanelTop", singleton: true, variant: "logo" },
      { id: "header-store", type: "header", section: "Шапка", title: "Шапка магазина", description: "Поиск, меню и корзина", price: 150, height: 96, icon: "PanelTop", singleton: true, variant: "store" },
      { id: "header-pill", type: "header", section: "Шапка", title: "Плавающая шапка", description: "Панель с отступами", price: 150, height: 110, icon: "PanelTop", singleton: true, variant: "pill" },
    ],
  },
  {
    title: "Баннер",
    blocks: [
      { id: "hero-product", type: "hero", section: "Баннер", title: "Товарный экран", description: "Оффер, CTA и магнитный визуал", price: 260, height: 260, icon: "Image", variant: "product" },
      { id: "hero-editorial", type: "hero", section: "Баннер", title: "Редакционный hero", description: "Крупный заголовок и факты", price: 240, height: 245, icon: "Image", variant: "editorial" },
      { id: "hero-app", type: "hero", section: "Баннер", title: "Баннер GearLabs", description: "Печать, карусель и две кнопки", price: 280, height: 270, icon: "Image", variant: "app" },
      { id: "hero-majestic", type: "hero", section: "Баннер", title: "Городской старт", description: "Город, серверы и запуск", price: 300, height: 300, icon: "Image", variant: "majestic" },
      { id: "hero-majestic-strip", type: "hero", section: "Баннер", title: "Hover-панели", description: "5-7 ч/б панелей с hover", price: 340, height: 340, icon: "Image", variant: "majestic-strip" },
    ],
  },
  {
    title: "Инфо-карточки",
    blocks: [
      { id: "cards-services", type: "cards", section: "Инфо-карточки", title: "Услуги", description: "Три карточки с иконками", price: 180, height: 190, icon: "LayoutGrid", variant: "services" },
      { id: "cards-metrics", type: "cards", section: "Инфо-карточки", title: "Метрики", description: "Цифры и короткие выводы", price: 170, height: 170, icon: "LayoutGrid", variant: "metrics" },
      { id: "cards-process", type: "cards", section: "Инфо-карточки", title: "Процесс", description: "Шаги работы", price: 190, height: 210, icon: "LayoutGrid", variant: "process" },
      { id: "cards-tabs", type: "cards", section: "Инфо-карточки", title: "Вкладки", description: "3-5 преимуществ в одном блоке", price: 220, height: 330, icon: "LayoutGrid", variant: "tabs" },
    ],
  },
  {
    title: "Форма регистрации",
    blocks: [
      { id: "form-compact", type: "form", section: "Форма регистрации", title: "Регистрация / вход", description: "Логин, пароль и создание аккаунта", price: 160, height: 245, icon: "UserPlus", variant: "compact" },
      { id: "form-split", type: "form", section: "Форма регистрации", title: "Фидбек клиента", description: "Отзыв, оценка и контакт", price: 210, height: 265, icon: "UserPlus", variant: "split" },
    ],
  },
  {
    title: "Карта",
    blocks: [
      { id: "map-contact", type: "map", section: "Карта", title: "Контакты", description: "Карта и адрес", price: 170, height: 210, icon: "MapPinned", variant: "contact" },
      { id: "map-points", type: "map", section: "Карта", title: "Точки выдачи", description: "Несколько локаций", price: 190, height: 220, icon: "MapPinned", variant: "points" },
    ],
  },
  {
    title: "Каталог товаров",
    blocks: [
      { id: "catalog-grid", type: "catalog", section: "Каталог товаров", title: "Каталог 3x2", description: "Карточки, модалка и страницы", price: 320, height: 280, icon: "ShoppingBag", singleton: true, variant: "grid" },
      { id: "catalog-feature", type: "catalog", section: "Каталог товаров", title: "Каталог с догрузкой", description: "3x2 и кнопка посмотреть еще", price: 260, height: 250, icon: "ShoppingBag", singleton: true, variant: "feature" },
    ],
  },
  {
    title: "Платная подписка",
    blocks: [
      { id: "pricing-classic", type: "pricing", section: "Платная подписка", title: "Тарифы", description: "Basic, Pro, Max", price: 260, height: 260, icon: "CreditCard", singleton: true, variant: "classic" },
      { id: "pricing-focus", type: "pricing", section: "Платная подписка", title: "Pro-акцент", description: "Темный блок и выделенный тариф", price: 290, height: 275, icon: "CreditCard", singleton: true, variant: "focus" },
    ],
  },
  {
    title: "Отзывы",
    blocks: [
      { id: "reviews-row", type: "reviews", section: "Отзывы", title: "Отзывы-лента", description: "Бегущие цитаты клиентов", price: 170, height: 190, icon: "MessageCircle", variant: "row" },
      { id: "reviews-highlight", type: "reviews", section: "Отзывы", title: "Кейс-отзыв", description: "Один сильный отзыв с деталями", price: 160, height: 180, icon: "MessageCircle", variant: "highlight" },
      { id: "reviews-slider", type: "reviews", section: "Отзывы", title: "Отзывы-слайдер", description: "Фото, текст и переключение", price: 220, height: 300, icon: "MessageCircle", variant: "slider" },
    ],
  },
  {
    title: "Бегущая строка",
    blocks: [
      { id: "marquee-light", type: "marquee", section: "Бегущая строка", title: "Бегущая", description: "Лента статусов", price: 120, height: 44, icon: "ScrollText", variant: "light" },
      { id: "marquee-card", type: "marquee", section: "Бегущая строка", title: "Инфо-слайд", description: "Карточки с быстрой сменой", price: 150, height: 140, icon: "ScrollText", variant: "card" },
      { id: "marquee-typing", type: "marquee", section: "Бегущая строка", title: "Печатающая строка", description: "Текст стирается и печатается", price: 160, height: 150, icon: "ScrollText", variant: "typing" },
    ],
  },
  {
    title: "Прогресс",
    blocks: [
      { id: "progress-bars", type: "progress", section: "Прогресс", title: "Линейный прогресс", description: "Проценты с анимацией", price: 160, height: 220, icon: "LayoutGrid", variant: "bars" },
      { id: "progress-circle", type: "progress", section: "Прогресс", title: "Круговой прогресс", description: "Навыки как в портфолио", price: 190, height: 240, icon: "LayoutGrid", variant: "circle" },
    ],
  },
  {
    title: "Статистика",
    blocks: [
      { id: "stats-line", type: "stats", section: "Статистика", title: "Линейный график", description: "График динамики как в Excel", price: 180, height: 270, icon: "LineChart", variant: "line" },
      { id: "stats-bar", type: "stats", section: "Статистика", title: "Столбцы", description: "Сравнение по колонкам", price: 180, height: 270, icon: "BarChart3", variant: "bar" },
      { id: "stats-pie", type: "stats", section: "Статистика", title: "Диаграмма", description: "Доли и легенда", price: 190, height: 270, icon: "PieChart", variant: "pie" },
    ],
  },
  {
    title: "Статьи",
    blocks: [
      { id: "article-nav", type: "article", section: "Статьи", title: "Статья с навигацией", description: "Текст с оглавлением", price: 100, height: 420, icon: "FileText", variant: "nav" },
      { id: "article-image-flow", type: "article", section: "Статьи", title: "Журнальный текст", description: "Обтекание как в документе", price: 140, height: 430, icon: "FileText", variant: "image-flow" },
      { id: "article-infobox", type: "article", section: "Статьи", title: "Вики-карточка", description: "Картинка и инфотаблица", price: 180, height: 500, icon: "FileText", variant: "infobox" },
    ],
  },
  {
    title: "Фоновые эффекты",
    blocks: [
      { id: "bg-scroll-gradient", type: "background", section: "Фоновые эффекты", title: "Градиент от скролла", description: "Цвет меняется при прокрутке", price: 200, height: 0, icon: "Sparkles", singleton: true, variant: "scroll-gradient" },
      { id: "bg-scroll-orbs", type: "background", section: "Фоновые эффекты", title: "Размытые круги", description: "Мягкие пятна двигаются от скролла", price: 200, height: 0, icon: "Sparkles", singleton: true, variant: "scroll-orbs" },
      { id: "bg-edge-particles", type: "background", section: "Фоновые эффекты", title: "Частицы с краев", description: "Как на главной странице", price: 300, height: 0, icon: "Sparkles", singleton: true, variant: "edge-particles" },
      { id: "bg-spark-stars", type: "background", section: "Фоновые эффекты", title: "Сияющие звезды", description: "Появляются и исчезают", price: 300, height: 0, icon: "Sparkles", singleton: true, variant: "spark-stars" },
      { id: "bg-aurora-grid", type: "background", section: "Фоновые эффекты", title: "Aurora grid", description: "Световая сетка и глубина", price: 400, height: 0, icon: "Sparkles", singleton: true, variant: "aurora-grid" },
      { id: "bg-spotlight-rings", type: "background", section: "Фоновые эффекты", title: "Spotlight rings", description: "Кольца и мягкий свет", price: 400, height: 0, icon: "Sparkles", singleton: true, variant: "spotlight-rings" },
    ],
  },
  {
    title: "FAQ",
    blocks: [
      { id: "faq-simple", type: "faq", section: "FAQ", title: "Вопросы", description: "Список ответов", price: 130, height: 180, icon: "CircleHelp", variant: "simple" },
      { id: "faq-split", type: "faq", section: "FAQ", title: "FAQ + CTA", description: "Ответы и кнопка", price: 160, height: 205, icon: "CircleHelp", variant: "split" },
    ],
  },
  {
    title: "Галерея",
    blocks: [
      { id: "gallery-mosaic", type: "gallery", section: "Галерея", title: "Мозаика", description: "Сетка изображений", price: 210, height: 235, icon: "Images", variant: "mosaic" },
      { id: "gallery-slider", type: "gallery", section: "Галерея", title: "Слайдер", description: "Большой кадр и превью", price: 230, height: 560, icon: "Images", variant: "slider" },
    ],
  },
  {
    title: "Команда",
    blocks: [
      { id: "team-cards", type: "team", section: "Команда", title: "Команда", description: "Карточки специалистов", price: 180, height: 210, icon: "Users", variant: "cards" },
      { id: "team-line", type: "team", section: "Команда", title: "Линия экспертов", description: "Компактный блок", price: 150, height: 170, icon: "Users", variant: "line" },
      { id: "team-spotlight", type: "team", section: "Команда", title: "Фокус на эксперта", description: "Большая карточка и 4 мини", price: 220, height: 280, icon: "Users", variant: "spotlight" },
    ],
  },
  {
    title: "Футер",
    blocks: [
      { id: "footer-compact", type: "footer", section: "Футер", title: "Маленький", description: "Лого, ссылки, соцсети", price: 100, height: 118, icon: "PanelBottom", singleton: true, variant: "compact" },
      { id: "footer-columns", type: "footer", section: "Футер", title: "Средний", description: "Колонки, контакты, соцсети", price: 140, height: 190, icon: "PanelBottom", singleton: true, variant: "columns" },
      { id: "footer-cta", type: "footer", section: "Футер", title: "Большой", description: "CTA, меню, контакты, соцсети", price: 160, height: 250, icon: "PanelBottom", singleton: true, variant: "cta" },
    ],
  },
];

module.exports = { blockSections, repeatableBlockDefaults, repeatableBlockLimits };
