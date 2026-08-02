import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Clock3,
  CreditCard,
  FileText,
  GripVertical,
  Heart,
  Image,
  Images,
  LayoutGrid,
  LineChart,
  MapPinned,
  Menu,
  MessageCircle,
  PanelBottom,
  PanelTop,
  PieChart,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Settings,
  UserPlus,
  Users,
  Zap,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type DragEvent,
  type FocusEvent as ReactFocusEvent,
  type HTMLAttributes,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./site-builder-page.scss";

const builderIconByName: Record<string, LucideIcon> = {
  BarChart3,
  CircleHelp,
  Clock3,
  CreditCard,
  FileText,
  Heart,
  Image,
  Images,
  LayoutGrid,
  LineChart,
  MapPinned,
  Menu,
  MessageCircle,
  PanelBottom,
  PanelTop,
  PieChart,
  ScrollText,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  UserPlus,
  Users,
  Zap,
};

type BlockType =
  | "header"
  | "hero"
  | "cards"
  | "form"
  | "map"
  | "catalog"
  | "pricing"
  | "footer"
  | "reviews"
  | "faq"
  | "gallery"
  | "team"
  | "marquee"
  | "progress"
  | "stats"
  | "article"
  | "background";

interface BuilderBlock {
  id: string;
  type: BlockType;
  section: string;
  title: string;
  description: string;
  price: number;
  height: number;
  icon: LucideIcon;
  singleton?: boolean;
  variant: string;
}

interface BlockSection {
  title: string;
  blocks: BuilderBlock[];
}

type BuilderBlockPayload = Omit<BuilderBlock, "icon"> & { icon: string };

interface BuilderCatalogResponse {
  blockSections?: Array<{ title: string; blocks: BuilderBlockPayload[] }>;
  repeatableBlockDefaults?: Partial<Record<BlockType, number>>;
  repeatableBlockLimits?: Partial<Record<BlockType, { min: number; max: number }>>;
}

interface BuilderStateResponse {
  payload?: {
    canvasItems?: CanvasItem[];
    colors?: BuilderColors;
    builderFonts?: BuilderFonts;
  } | null;
}

interface CanvasItem {
  instanceId: string;
  blockId: string;
  text: Record<string, string>;
  media: Record<string, string>;
  options?: Record<string, number | string>;
  layout?: "full" | "half";
}

interface BuilderColors {
  primary: string;
  accent: string;
  surface: string;
  text: string;
}

interface BuilderFonts {
  heading: string;
  body: string;
  ui: string;
}

type BuilderCopy = Record<string, string>;
type PageLink = { instanceId: string; label: string };
type CartProduct = { name: string; price: string };
type CanvasSide = "left" | "right";
type CanvasStackPosition = "before" | "after";
type ReviewModalData = {
  id: string;
  textField: string;
  textFallback: string;
  authorField: string;
  authorFallback: string;
  roleField: string;
  roleFallback: string;
  detailField: string;
  detailFallback: string;
};

const repeatableBlockDefaults: Partial<Record<BlockType, number>> = {
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

const repeatableBlockLimits: Partial<Record<BlockType, { min: number; max: number }>> = {
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

const blockSections: BlockSection[] = [
  {
    title: "Шапка",
    blocks: [
      { id: "header-clean", type: "header", section: "Шапка", title: "Базовая шапка", description: "Логотип, меню и CTA", price: 120, height: 92, icon: PanelTop, singleton: true, variant: "logo" },
      { id: "header-store", type: "header", section: "Шапка", title: "Шапка магазина", description: "Поиск, меню и корзина", price: 150, height: 96, icon: PanelTop, singleton: true, variant: "store" },
      { id: "header-pill", type: "header", section: "Шапка", title: "Плавающая шапка", description: "Панель с отступами", price: 150, height: 110, icon: PanelTop, singleton: true, variant: "pill" },
    ],
  },
  {
    title: "Баннер",
    blocks: [
      { id: "hero-product", type: "hero", section: "Баннер", title: "Товарный экран", description: "Оффер, CTA и магнитный визуал", price: 260, height: 260, icon: Image, variant: "product" },
      { id: "hero-editorial", type: "hero", section: "Баннер", title: "Редакционный hero", description: "Крупный заголовок и факты", price: 240, height: 245, icon: Image, variant: "editorial" },
      { id: "hero-app", type: "hero", section: "Баннер", title: "Баннер GearLabs", description: "Печать, карусель и две кнопки", price: 280, height: 270, icon: Image, variant: "app" },
      { id: "hero-majestic", type: "hero", section: "Баннер", title: "Городской старт", description: "Город, серверы и запуск", price: 300, height: 300, icon: Image, variant: "majestic" },
      { id: "hero-majestic-strip", type: "hero", section: "Баннер", title: "Hover-панели", description: "5-7 ч/б панелей с hover", price: 340, height: 340, icon: Image, variant: "majestic-strip" },
    ],
  },
  {
    title: "Инфо-карточки",
    blocks: [
      { id: "cards-services", type: "cards", section: "Инфо-карточки", title: "Услуги", description: "Три карточки с иконками", price: 180, height: 190, icon: LayoutGrid, variant: "services" },
      { id: "cards-metrics", type: "cards", section: "Инфо-карточки", title: "Метрики", description: "Цифры и короткие выводы", price: 170, height: 170, icon: LayoutGrid, variant: "metrics" },
      { id: "cards-process", type: "cards", section: "Инфо-карточки", title: "Процесс", description: "Шаги работы", price: 190, height: 210, icon: LayoutGrid, variant: "process" },
      { id: "cards-tabs", type: "cards", section: "Инфо-карточки", title: "Вкладки", description: "3-5 преимуществ в одном блоке", price: 220, height: 330, icon: LayoutGrid, variant: "tabs" },
    ],
  },
  {
    title: "Форма регистрации",
    blocks: [
      { id: "form-compact", type: "form", section: "Форма регистрации", title: "Регистрация / вход", description: "Логин, пароль и создание аккаунта", price: 160, height: 245, icon: UserPlus, variant: "compact" },
      { id: "form-split", type: "form", section: "Форма регистрации", title: "Фидбек клиента", description: "Отзыв, оценка и контакт", price: 210, height: 265, icon: UserPlus, variant: "split" },
    ],
  },
  {
    title: "Карта",
    blocks: [
      { id: "map-contact", type: "map", section: "Карта", title: "Контакты", description: "Карта и адрес", price: 170, height: 210, icon: MapPinned, variant: "contact" },
      { id: "map-points", type: "map", section: "Карта", title: "Точки выдачи", description: "Несколько локаций", price: 190, height: 220, icon: MapPinned, variant: "points" },
    ],
  },
  {
    title: "Каталог товаров",
    blocks: [
      { id: "catalog-grid", type: "catalog", section: "Каталог товаров", title: "Каталог 3x2", description: "Карточки, модалка и страницы", price: 320, height: 280, icon: ShoppingBag, singleton: true, variant: "grid" },
      { id: "catalog-feature", type: "catalog", section: "Каталог товаров", title: "Каталог с догрузкой", description: "3x2 и кнопка посмотреть еще", price: 260, height: 250, icon: ShoppingBag, singleton: true, variant: "feature" },
    ],
  },
  {
    title: "Платная подписка",
    blocks: [
      { id: "pricing-classic", type: "pricing", section: "Платная подписка", title: "Тарифы", description: "Basic, Pro, Max", price: 260, height: 260, icon: CreditCard, singleton: true, variant: "classic" },
      { id: "pricing-focus", type: "pricing", section: "Платная подписка", title: "Pro-акцент", description: "Темный блок и выделенный тариф", price: 290, height: 275, icon: CreditCard, singleton: true, variant: "focus" },
    ],
  },
  {
    title: "Отзывы",
    blocks: [
      { id: "reviews-row", type: "reviews", section: "Отзывы", title: "Отзывы-лента", description: "Бегущие цитаты клиентов", price: 170, height: 190, icon: MessageCircle, variant: "row" },
      { id: "reviews-highlight", type: "reviews", section: "Отзывы", title: "Кейс-отзыв", description: "Один сильный отзыв с деталями", price: 160, height: 180, icon: MessageCircle, variant: "highlight" },
      { id: "reviews-slider", type: "reviews", section: "Отзывы", title: "Отзывы-слайдер", description: "Фото, текст и переключение", price: 220, height: 300, icon: MessageCircle, variant: "slider" },
    ],
  },
  {
    title: "Бегущая строка",
    blocks: [
      { id: "marquee-light", type: "marquee", section: "Бегущая строка", title: "Бегущая", description: "Лента статусов", price: 120, height: 44, icon: ScrollText, variant: "light" },
      { id: "marquee-card", type: "marquee", section: "Бегущая строка", title: "Инфо-слайд", description: "Карточки с быстрой сменой", price: 150, height: 140, icon: ScrollText, variant: "card" },
      { id: "marquee-typing", type: "marquee", section: "Бегущая строка", title: "Печатающая строка", description: "Текст стирается и печатается", price: 160, height: 150, icon: ScrollText, variant: "typing" },
    ],
  },
  {
    title: "Прогресс",
    blocks: [
      { id: "progress-bars", type: "progress", section: "Прогресс", title: "Линейный прогресс", description: "Проценты с анимацией", price: 160, height: 220, icon: LayoutGrid, variant: "bars" },
      { id: "progress-circle", type: "progress", section: "Прогресс", title: "Круговой прогресс", description: "Навыки как в портфолио", price: 190, height: 240, icon: LayoutGrid, variant: "circle" },
    ],
  },
  {
    title: "Статистика",
    blocks: [
      { id: "stats-line", type: "stats", section: "Статистика", title: "Линейный график", description: "График динамики как в Excel", price: 180, height: 270, icon: LineChart, variant: "line" },
      { id: "stats-bar", type: "stats", section: "Статистика", title: "Столбцы", description: "Сравнение по колонкам", price: 180, height: 270, icon: BarChart3, variant: "bar" },
      { id: "stats-pie", type: "stats", section: "Статистика", title: "Диаграмма", description: "Доли и легенда", price: 190, height: 270, icon: PieChart, variant: "pie" },
    ],
  },
  {
    title: "Статьи",
    blocks: [
      { id: "article-nav", type: "article", section: "Статьи", title: "Статья с навигацией", description: "Текст с оглавлением", price: 100, height: 420, icon: FileText, variant: "nav" },
      { id: "article-image-flow", type: "article", section: "Статьи", title: "Журнальный текст", description: "Обтекание как в документе", price: 140, height: 430, icon: FileText, variant: "image-flow" },
      { id: "article-infobox", type: "article", section: "Статьи", title: "Вики-карточка", description: "Картинка и инфотаблица", price: 180, height: 500, icon: FileText, variant: "infobox" },
    ],
  },
  {
    title: "Фоновые эффекты",
    blocks: [
      { id: "bg-scroll-gradient", type: "background", section: "Фоновые эффекты", title: "Градиент от скролла", description: "Цвет меняется при прокрутке", price: 200, height: 0, icon: Sparkles, singleton: true, variant: "scroll-gradient" },
      { id: "bg-scroll-orbs", type: "background", section: "Фоновые эффекты", title: "Размытые круги", description: "Мягкие пятна двигаются от скролла", price: 200, height: 0, icon: Sparkles, singleton: true, variant: "scroll-orbs" },
      { id: "bg-edge-particles", type: "background", section: "Фоновые эффекты", title: "Частицы с краев", description: "Как на главной странице", price: 300, height: 0, icon: Sparkles, singleton: true, variant: "edge-particles" },
      { id: "bg-spark-stars", type: "background", section: "Фоновые эффекты", title: "Сияющие звезды", description: "Появляются и исчезают", price: 300, height: 0, icon: Sparkles, singleton: true, variant: "spark-stars" },
      { id: "bg-aurora-grid", type: "background", section: "Фоновые эффекты", title: "Aurora grid", description: "Световая сетка и глубина", price: 400, height: 0, icon: Sparkles, singleton: true, variant: "aurora-grid" },
      { id: "bg-spotlight-rings", type: "background", section: "Фоновые эффекты", title: "Spotlight rings", description: "Кольца и мягкий свет", price: 400, height: 0, icon: Sparkles, singleton: true, variant: "spotlight-rings" },
    ],
  },
  {
    title: "FAQ",
    blocks: [
      { id: "faq-simple", type: "faq", section: "FAQ", title: "Вопросы", description: "Список ответов", price: 130, height: 180, icon: CircleHelp, variant: "simple" },
      { id: "faq-split", type: "faq", section: "FAQ", title: "FAQ + CTA", description: "Ответы и кнопка", price: 160, height: 205, icon: CircleHelp, variant: "split" },
    ],
  },
  {
    title: "Галерея",
    blocks: [
      { id: "gallery-mosaic", type: "gallery", section: "Галерея", title: "Мозаика", description: "Сетка изображений", price: 210, height: 235, icon: Images, variant: "mosaic" },
      { id: "gallery-slider", type: "gallery", section: "Галерея", title: "Слайдер", description: "Большой кадр и превью", price: 230, height: 560, icon: Images, variant: "slider" },
    ],
  },
  {
    title: "Команда",
    blocks: [
      { id: "team-cards", type: "team", section: "Команда", title: "Команда", description: "Карточки специалистов", price: 180, height: 210, icon: Users, variant: "cards" },
      { id: "team-line", type: "team", section: "Команда", title: "Линия экспертов", description: "Компактный блок", price: 150, height: 170, icon: Users, variant: "line" },
      { id: "team-spotlight", type: "team", section: "Команда", title: "Фокус на эксперта", description: "Большая карточка и 4 мини", price: 220, height: 280, icon: Users, variant: "spotlight" },
    ],
  },
  {
    title: "Футер",
    blocks: [
      { id: "footer-compact", type: "footer", section: "Футер", title: "Маленький", description: "Лого, ссылки, соцсети", price: 100, height: 118, icon: PanelBottom, singleton: true, variant: "compact" },
      { id: "footer-columns", type: "footer", section: "Футер", title: "Средний", description: "Колонки, контакты, соцсети", price: 140, height: 190, icon: PanelBottom, singleton: true, variant: "columns" },
      { id: "footer-cta", type: "footer", section: "Футер", title: "Большой", description: "CTA, меню, контакты, соцсети", price: 160, height: 250, icon: PanelBottom, singleton: true, variant: "cta" },
    ],
  },
];

const allBlocks = blockSections.flatMap((section) => section.blocks);
const blockById = new Map(allBlocks.map((block) => [block.id, block]));
const initialCanvas: CanvasItem[] = [];

const resolveBlockSections = (sections: BuilderCatalogResponse["blockSections"]): BlockSection[] => {
  if (!Array.isArray(sections)) return blockSections;

  return sections.map((section) => ({
    title: section.title,
    blocks: Array.isArray(section.blocks)
      ? section.blocks.map((block) => ({
          ...block,
          icon: builderIconByName[block.icon] ?? LayoutGrid,
        }))
      : [],
  }));
};

const normalizeBuilderColors = (value: unknown): BuilderColors | null => {
  if (!value || typeof value !== "object") return null;
  const colors = value as Partial<BuilderColors>;
  if (
    typeof colors.primary !== "string" ||
    typeof colors.accent !== "string" ||
    typeof colors.surface !== "string" ||
    typeof colors.text !== "string"
  ) {
    return null;
  }

  return {
    primary: colors.primary,
    accent: colors.accent,
    surface: colors.surface,
    text: colors.text,
  };
};

const normalizeBuilderFonts = (value: unknown): BuilderFonts | null => {
  if (!value || typeof value !== "object") return null;
  const fonts = value as Partial<BuilderFonts>;

  return {
    heading: typeof fonts.heading === "string" ? fonts.heading : "inherit",
    body: typeof fonts.body === "string" ? fonts.body : "inherit",
    ui: typeof fonts.ui === "string" ? fonts.ui : "inherit",
  };
};

const readSavedCanvasItems = () => {
  if (typeof window === "undefined") return initialCanvas;

  try {
    const saved = window.localStorage.getItem(builderCanvasStorageKey);
    if (!saved) return initialCanvas;

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) return initialCanvas;

    return normalizeCanvasRows(
      parsed
        .filter((item): item is CanvasItem =>
          Boolean(
            item &&
              typeof item.instanceId === "string" &&
              typeof item.blockId === "string" &&
              blockById.has(item.blockId)
          )
        )
        .map((item) => ({
          instanceId: item.instanceId,
          blockId: item.blockId,
          text: item.text && typeof item.text === "object" ? item.text : {},
          media: item.media && typeof item.media === "object" ? item.media : {},
          options: item.options && typeof item.options === "object" ? item.options : undefined,
          layout: item.layout === "half" ? "half" : "full",
        }))
    );
  } catch {
    return initialCanvas;
  }
};

const readSavedBuilderFonts = () => {
  if (typeof window === "undefined") return defaultBuilderFonts;

  try {
    const saved = window.localStorage.getItem(builderFontsStorageKey);
    if (!saved) return defaultBuilderFonts;

    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object") return defaultBuilderFonts;

    return {
      heading: typeof parsed.heading === "string" ? parsed.heading : defaultBuilderFonts.heading,
      body: typeof parsed.body === "string" ? parsed.body : defaultBuilderFonts.body,
      ui: typeof parsed.ui === "string" ? parsed.ui : defaultBuilderFonts.ui,
    };
  } catch {
    return defaultBuilderFonts;
  }
};

const defaultColors: BuilderColors = {
  primary: "#3e98ff",
  accent: "#ff7300",
  surface: "#ffffff",
  text: "#20262e",
};

const getBuilderColorsFromTheme = (vars: Record<string, string>): BuilderColors => ({
  primary: vars.blue ?? defaultColors.primary,
  accent: vars.orange ?? defaultColors.accent,
  surface: vars.surface ?? vars["page-bg-soft"] ?? defaultColors.surface,
  text: vars["text-primary"] ?? vars["space-gray"] ?? defaultColors.text,
});

const parseColorChannels = (value: string) => {
  const color = value.trim();
  const shortHex = color.match(/^#([0-9a-f]{3})$/i);
  if (shortHex) {
    return shortHex[1].split("").map((part) => Number.parseInt(part + part, 16));
  }

  const longHex = color.match(/^#([0-9a-f]{6})$/i);
  if (longHex) {
    const hex = longHex[1];
    return [0, 2, 4].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));
  }

  const rgb = color.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const channels = rgb[1]
      .split(",")
      .slice(0, 3)
      .map((part) => Number.parseFloat(part.trim()));

    if (channels.length === 3 && channels.every((channel) => Number.isFinite(channel))) {
      return channels;
    }
  }

  return null;
};

const getRelativeLuminance = (color: string) => {
  const channels = parseColorChannels(color);
  if (!channels) return null;

  const [r, g, b] = channels.map((channel) => {
    const value = Math.max(0, Math.min(255, channel)) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const colorControls: Array<{ key: keyof BuilderColors; labelKey: string }> = [
  { key: "primary", labelKey: "builder.color.primary" },
  { key: "accent", labelKey: "builder.color.accent" },
  { key: "surface", labelKey: "builder.color.surface" },
  { key: "text", labelKey: "builder.color.text" },
];

const builderCanvasStorageKey = "gear-labs-site-builder-canvas-v8";
const builderFontsStorageKey = "gear-labs-site-builder-fonts-v1";
const defaultBuilderFonts: BuilderFonts = {
  heading: "inherit",
  body: "inherit",
  ui: "inherit",
};
const builderFontOptions = [
  { value: "inherit", label: "Тема сайта" },
  { value: "'Montserrat', Arial, sans-serif", label: "Montserrat" },
  { value: "'Inter', Arial, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "'Georgia', serif", label: "Georgia" },
  { value: "'Courier New', monospace", label: "Mono" },
  { value: "'Roboto', Arial, sans-serif", label: "Roboto" },
  { value: "'Poppins', Arial, sans-serif", label: "Poppins" },
  { value: "'Manrope', Arial, sans-serif", label: "Manrope" },
  { value: "'Playfair Display', Georgia, serif", label: "Playfair" },
];

const getBuilderFontLabel = (value: string) => {
  const option = builderFontOptions.find((item) => item.value === value);
  if (option) return option.label;

  return value
    .split(",")[0]
    .replace(/["']/g, "")
    .trim() || "Свой шрифт";
};

const loadBuilderFontTag = (rawValue: string) => {
  const href = rawValue.match(/href=["']([^"']+)["']/i)?.[1]
    ?? rawValue.match(/@import\s+url\(["']?([^"')]+)["']?\)/i)?.[1];

  if (!href || typeof document === "undefined") return;
  if (document.querySelector(`link[data-builder-font-href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  link.dataset.builderFontHref = href;
  document.head.appendChild(link);
};

const normalizeBuilderFontValue = (rawValue: string) => {
  const value = rawValue.trim();
  if (!value) return "";

  const familyFromCss = value.match(/font-family\s*:\s*([^;]+)/i)?.[1]?.trim();
  if (familyFromCss) return familyFromCss;

  const familyFromGoogle = value.match(/[?&]family=([^:&"']+)/i)?.[1];
  if (familyFromGoogle) {
    return `'${decodeURIComponent(familyFromGoogle).replace(/\+/g, " ")}', sans-serif`;
  }

  return value;
};

function BuilderFontPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [isOpen]);

  const applyCustomFont = () => {
    const nextValue = normalizeBuilderFontValue(customValue);
    if (!nextValue) return;

    loadBuilderFontTag(customValue);
    onChange(nextValue);
    setCustomValue("");
    setIsOpen(false);
  };

  return (
    <div className={`builder-font-picker ${isOpen ? "is-open" : ""}`} ref={pickerRef}>
      <button
        className="builder-font-picker__trigger"
        type="button"
        onClick={() => setIsOpen((current) => !current)}
      >
        <span>{getBuilderFontLabel(value)}</span>
      </button>
      <div className="builder-font-picker__menu">
        <div className="builder-font-picker__options">
          {builderFontOptions.map((option) => (
            <button
              className={option.value === value ? "is-active" : ""}
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
        <div className="builder-font-picker__custom">
          <span>Свой шрифт</span>
          <input
            value={customValue}
            onChange={(event) => setCustomValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                applyCustomFont();
              }
            }}
            placeholder="'My Font', sans-serif или link/@import"
          />
          <button type="button" onClick={applyCustomFont}>OK</button>
        </div>
      </div>
    </div>
  );
}

const makeInstanceId = (blockId: string) => `${blockId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const hasOwnValue = (source: Record<string, string> | undefined, field: string) =>
  !!source && Object.prototype.hasOwnProperty.call(source, field);

const canShareCanvasRow = (block: BuilderBlock) =>
  !["header", "footer", "catalog", "pricing", "background"].includes(block.type);

const canShareCanvasItem = (item: CanvasItem) => {
  const block = blockById.get(item.blockId);
  return Boolean(block && canShareCanvasRow(block));
};

const getDefaultCanvasItemCount = (block: BuilderBlock) =>
  block.id === "team-spotlight" ? 5 : repeatableBlockDefaults[block.type];

const createCanvasItem = (block: BuilderBlock, layout: CanvasItem["layout"] = "full"): CanvasItem => {
  const defaultCount = getDefaultCanvasItemCount(block);

  return {
    instanceId: makeInstanceId(block.id),
    blockId: block.id,
    text: {},
    media: {},
    layout,
    options: defaultCount ? { count: defaultCount } : undefined,
  };
};

const normalizeCanvasRows = (items: CanvasItem[]) => {
  const next = items.map((item) => ({ ...item }));
  let index = 0;

  while (index < next.length) {
    const item = next[index];
    const following = next[index + 1];

    if (
      item.layout === "half" &&
      following?.layout === "half" &&
      canShareCanvasItem(item) &&
      canShareCanvasItem(following)
    ) {
      index += 2;
      continue;
    }

    if (item.layout === "half") {
      next[index] = { ...item, layout: "full" };
    }
    index += 1;
  }

  return next;
};

const getCanvasItemCount = (item: CanvasItem, type: BlockType) => {
  const rawCount = item.options?.count;
  const count = typeof rawCount === "number" ? rawCount : Number(rawCount);
  return Number.isFinite(count) ? count : repeatableBlockDefaults[type] ?? 0;
};

const repeatableOrderKey = (index: number) => `order.${index}`;

const getRepeatableSourceIndices = (item: CanvasItem, type: BlockType) => {
  const count = getCanvasItemCount(item, type);

  return Array.from({ length: count }, (_, index) => {
    const sourceIndex = item.options?.[repeatableOrderKey(index)];
    const parsedSourceIndex = typeof sourceIndex === "number" ? sourceIndex : Number(sourceIndex);
    return Number.isFinite(parsedSourceIndex) ? parsedSourceIndex : index;
  });
};

const setRepeatableOrderOptions = (options: CanvasItem["options"], order: number[]) => {
  const nextOptions = Object.fromEntries(
    Object.entries(options ?? {}).filter(([key]) => !key.startsWith("order."))
  ) as Record<string, number | string>;

  nextOptions.count = order.length;
  order.forEach((sourceIndex, index) => {
    nextOptions[repeatableOrderKey(index)] = sourceIndex;
  });

  return nextOptions;
};

const clampCount = (type: BlockType, value: number) => {
  const limits = repeatableBlockLimits[type];
  if (!limits) return value;
  return Math.min(limits.max, Math.max(limits.min, value));
};

const parsePercentValue = (value: string | undefined, fallback: number) => {
  const match = value?.replace(",", ".").match(/\d+(?:\.\d+)?/);
  if (!match) return fallback;
  return Math.min(100, Math.max(0, Math.round(Number(match[0]))));
};

const getBlockPrice = (block: BuilderBlock) => Math.round(block.price * 0.5);

const getCanvasItemPrice = (item: CanvasItem, blocks: Map<string, BuilderBlock> = blockById) => {
  const block = blocks.get(item.blockId);
  if (!block) return 0;

  const basePrice = getBlockPrice(block);
  const defaultCount = repeatableBlockDefaults[block.type];
  if (!defaultCount) return basePrice;

  const count = getCanvasItemCount(item, block.type);
  const extraCount = Math.max(0, count - defaultCount);
  const extraUnitPrice = Math.max(15, Math.round(basePrice / defaultCount * 0.35));

  return basePrice + extraCount * extraUnitPrice;
};

const editableTextSelector = [
  ".builder-header strong:not(.editable-text)",
  ".builder-header nav span",
  ".builder-header button",
  ".builder-hero > div:first-child > span:not(.editable-text)",
  ".builder-hero h3",
  ".builder-hero p",
  ".builder-hero button",
  ".builder-cards strong",
  ".builder-cards p",
  ".builder-info-tabs strong",
  ".builder-info-tabs p",
  ".builder-form h3",
  ".builder-form p",
  ".builder-form form span",
  ".builder-form small",
  ".builder-form button",
  ".builder-map h3",
  ".builder-map p",
  ".builder-map__meta span",
  ".builder-map__points-list span",
  ".builder-catalog strong",
  ".builder-catalog small",
  ".builder-catalog p",
  ".builder-pricing strong",
  ".builder-pricing span",
  ".builder-pricing small",
  ".builder-pricing p",
  ".builder-reviews p",
  ".builder-reviews strong",
  ".builder-faq h3",
  ".builder-faq strong",
  ".builder-faq span",
  ".builder-faq p",
  ".builder-faq button",
  ".builder-gallery strong",
  ".builder-gallery p",
  ".builder-gallery small",
  ".builder-team strong",
  ".builder-team p",
  ".builder-team small",
  ".builder-progress strong",
  ".builder-progress small",
  ".builder-progress p",
  ".builder-stats strong",
  ".builder-stats span",
  ".builder-stats p",
  ".builder-stats small",
  ".builder-article h3",
  ".builder-article h4",
  ".builder-article strong",
  ".builder-article p",
  ".builder-article small",
  ".builder-footer strong",
  ".builder-footer span",
  ".builder-footer button",
].join(",");

const editableMediaSelector = [
  ".builder-hero__slide",
  ".builder-hero-magnet__image",
  ".builder-majestic-strip__media",
  ".builder-info-tabs__halo i",
  ".builder-cards div > span:first-child",
  ".builder-map__grid",
  ".builder-catalog__image",
  ".builder-product-modal__media",
  ".builder-gallery__media",
  ".builder-gallery-slider__media",
  ".builder-team-card__photo",
  ".builder-team-line__photo",
  ".builder-team-spotlight__photo",
  ".builder-team-spotlight__mini-photo",
  ".builder-reviews-slider__photo",
  ".builder-article__image",
  ".builder-article-infobox__image",
  ".builder-header__logo",
].join(",");

const builderPageTranslations: Record<string, BuilderCopy> = {
  ru: {
    "builder.sidebar.eyebrow": "Конструктор",
    "builder.sidebar.title": "Блоки сайта",
    "builder.sidebar.open": "Открыть меню",
    "builder.sidebar.close": "Свернуть меню",
    "builder.palette.title": "Цвета",
    "builder.color.primary": "Основной",
    "builder.color.accent": "Акцент",
    "builder.color.surface": "Фон",
    "builder.color.text": "Текст",
    "builder.price": "Цена: {price} $",
    "builder.pricing.month": "Месяц",
    "builder.pricing.year": "Год",
    "builder.pricing.perMonth": "в месяц",
    "builder.pricing.perYear": "в год",
    "builder.workspace.eyebrow": "Конструктор сайтов",
    "builder.workspace.title": "Холст проекта",
    "builder.summary.blocks": "{count} блоков",
    "builder.drop.empty": "Перетащите блок сюда",
    "builder.drop.active": "Отпустите блок",
    "builder.editor.upload": "Загрузить",
    "builder.editor.textPlaceholder": "Текст",
    "builder.deleteBlock": "Удалить блок",
    "builder.section.header": "Шапка",
    "builder.section.hero": "Баннер",
    "builder.section.cards": "Инфо-карточки",
    "builder.section.form": "Форма регистрации",
    "builder.section.map": "Карта",
    "builder.section.catalog": "Каталог товаров",
    "builder.section.pricing": "Платная подписка",
    "builder.section.reviews": "Отзывы",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Галерея",
    "builder.section.team": "Команда",
    "builder.section.marquee": "Бегущая строка",
    "builder.section.progress": "Прогресс",
    "builder.section.stats": "Статистика",
    "builder.section.article": "Статьи",
    "builder.section.background": "Фоновые эффекты",
    "builder.section.footer": "Футер",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Логин",
    "builder.auth.label.password": "Пароль",
    "builder.auth.label.repeat": "Подтверждение",
    "builder.auth.badge.account": "Личный кабинет",
    "builder.auth.badge.email": "Email подтверждение",
    "builder.auth.forgot": "Забыли пароль?",
    "builder.auth.remember": "Запомнить меня",
    "builder.auth.agreePrefix": "Согласен с",
    "builder.auth.termsLink": "условиями",
    "builder.auth.social.login": "Войти через",
    "builder.auth.social.register": "Зарегистрироваться через",
    "builder.feedback.label.name": "Имя",
    "builder.feedback.label.contact": "Контакт",
    "builder.feedback.label.review": "Отзыв",
    "builder.feedback.label.note": "Фидбек",
    "builder.catalog.more": "Подробнее",
    "builder.catalog.loadMore": "Посмотреть еще",
    "builder.catalog.close": "Закрыть товар",
    "builder.header.search": "Поиск товаров",
    "builder.footer.menu": "Меню",
    "builder.footer.socials": "Соцсети",
    "builder.footer.contacts": "Контакты",
    "builder.footer.nav": "Навигация",
  },
  en: {
    "builder.sidebar.eyebrow": "Builder",
    "builder.sidebar.title": "Site blocks",
    "builder.sidebar.open": "Open menu",
    "builder.sidebar.close": "Collapse menu",
    "builder.palette.title": "Colors",
    "builder.color.primary": "Primary",
    "builder.color.accent": "Accent",
    "builder.color.surface": "Background",
    "builder.color.text": "Text",
    "builder.price": "Price: {price} $",
    "builder.pricing.month": "Month",
    "builder.pricing.year": "Year",
    "builder.pricing.perMonth": "per month",
    "builder.pricing.perYear": "per year",
    "builder.workspace.eyebrow": "Website builder",
    "builder.workspace.title": "Project canvas",
    "builder.summary.blocks": "{count} blocks",
    "builder.drop.empty": "Drag a block here",
    "builder.drop.active": "Drop the block",
    "builder.editor.upload": "Upload",
    "builder.editor.textPlaceholder": "Text",
    "builder.deleteBlock": "Delete block",
    "builder.section.header": "Header",
    "builder.section.hero": "Banner",
    "builder.section.cards": "Info cards",
    "builder.section.form": "Registration form",
    "builder.section.map": "Map",
    "builder.section.catalog": "Product catalog",
    "builder.section.pricing": "Paid subscription",
    "builder.section.reviews": "Reviews",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Gallery",
    "builder.section.team": "Team",
    "builder.section.marquee": "Marquee",
    "builder.section.progress": "Progress",
    "builder.section.stats": "Statistics",
    "builder.section.article": "Articles",
    "builder.section.background": "Background effects",
    "builder.section.footer": "Footer",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Password",
    "builder.auth.label.repeat": "Confirm",
    "builder.auth.badge.account": "Account area",
    "builder.auth.badge.email": "Email confirmation",
    "builder.auth.forgot": "Forgot password?",
    "builder.auth.remember": "Remember me",
    "builder.auth.agreePrefix": "I agree to",
    "builder.auth.termsLink": "the terms",
    "builder.auth.social.login": "Sign in with",
    "builder.auth.social.register": "Sign up with",
    "builder.feedback.label.name": "Name",
    "builder.feedback.label.contact": "Contact",
    "builder.feedback.label.review": "Review",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Details",
    "builder.catalog.loadMore": "Show more",
    "builder.catalog.close": "Close product",
    "builder.header.search": "Search products",
    "builder.footer.menu": "Menu",
    "builder.footer.socials": "Socials",
    "builder.footer.contacts": "Contacts",
    "builder.footer.nav": "Navigation",
  },
  de: {
    "builder.sidebar.eyebrow": "Builder",
    "builder.sidebar.title": "Website-Blocke",
    "builder.sidebar.open": "Menu offnen",
    "builder.sidebar.close": "Menu einklappen",
    "builder.palette.title": "Farben",
    "builder.color.primary": "Primar",
    "builder.color.accent": "Akzent",
    "builder.color.surface": "Hintergrund",
    "builder.color.text": "Text",
    "builder.price": "Preis: {price} $",
    "builder.pricing.month": "Monat",
    "builder.pricing.year": "Jahr",
    "builder.pricing.perMonth": "pro Monat",
    "builder.pricing.perYear": "pro Jahr",
    "builder.workspace.eyebrow": "Website-Builder",
    "builder.workspace.title": "Projekt-Leinwand",
    "builder.summary.blocks": "{count} Blocke",
    "builder.drop.empty": "Block hierher ziehen",
    "builder.drop.active": "Block loslassen",
    "builder.editor.upload": "Hochladen",
    "builder.editor.textPlaceholder": "Text",
    "builder.deleteBlock": "Block loschen",
    "builder.section.header": "Kopfbereich",
    "builder.section.hero": "Banner",
    "builder.section.cards": "Infokarten",
    "builder.section.form": "Registrierungsformular",
    "builder.section.map": "Karte",
    "builder.section.catalog": "Produktkatalog",
    "builder.section.pricing": "Abo-Tarife",
    "builder.section.reviews": "Bewertungen",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Galerie",
    "builder.section.team": "Team",
    "builder.section.marquee": "Lauftext",
    "builder.section.progress": "Fortschritt",
    "builder.section.stats": "Statistik",
    "builder.section.article": "Artikel",
    "builder.section.background": "Hintergrundeffekte",
    "builder.section.footer": "Fusszeile",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Passwort",
    "builder.auth.label.repeat": "Bestatigung",
    "builder.auth.badge.account": "Kundenkonto",
    "builder.auth.badge.email": "E-Mail Bestatigung",
    "builder.auth.forgot": "Passwort vergessen?",
    "builder.feedback.label.name": "Name",
    "builder.feedback.label.contact": "Kontakt",
    "builder.feedback.label.review": "Bewertung",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Details",
    "builder.catalog.loadMore": "Mehr anzeigen",
    "builder.catalog.close": "Produkt schliessen",
  },
  fr: {
    "builder.sidebar.eyebrow": "Constructeur",
    "builder.sidebar.title": "Blocs du site",
    "builder.sidebar.open": "Ouvrir le menu",
    "builder.sidebar.close": "Reduire le menu",
    "builder.palette.title": "Couleurs",
    "builder.color.primary": "Principal",
    "builder.color.accent": "Accent",
    "builder.color.surface": "Fond",
    "builder.color.text": "Texte",
    "builder.price": "Prix : {price} $",
    "builder.pricing.month": "Mois",
    "builder.pricing.year": "Annee",
    "builder.pricing.perMonth": "par mois",
    "builder.pricing.perYear": "par an",
    "builder.workspace.eyebrow": "Constructeur de site",
    "builder.workspace.title": "Canvas du projet",
    "builder.summary.blocks": "{count} blocs",
    "builder.drop.empty": "Glissez un bloc ici",
    "builder.drop.active": "Deposez le bloc",
    "builder.editor.upload": "Importer",
    "builder.editor.textPlaceholder": "Texte",
    "builder.deleteBlock": "Supprimer le bloc",
    "builder.section.header": "En-tete",
    "builder.section.hero": "Banniere",
    "builder.section.cards": "Cartes info",
    "builder.section.form": "Formulaire",
    "builder.section.map": "Carte",
    "builder.section.catalog": "Catalogue",
    "builder.section.pricing": "Abonnement",
    "builder.section.reviews": "Avis",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Galerie",
    "builder.section.team": "Equipe",
    "builder.section.marquee": "Texte defilant",
    "builder.section.progress": "Progression",
    "builder.section.stats": "Statistiques",
    "builder.section.article": "Articles",
    "builder.section.background": "Effets de fond",
    "builder.section.footer": "Pied de page",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Mot de passe",
    "builder.auth.label.repeat": "Confirmation",
    "builder.auth.badge.account": "Espace client",
    "builder.auth.badge.email": "Confirmation email",
    "builder.auth.forgot": "Mot de passe oublie ?",
    "builder.feedback.label.name": "Nom",
    "builder.feedback.label.contact": "Contact",
    "builder.feedback.label.review": "Avis",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Details",
    "builder.catalog.loadMore": "Voir plus",
    "builder.catalog.close": "Fermer le produit",
  },
  it: {
    "builder.sidebar.eyebrow": "Builder",
    "builder.sidebar.title": "Blocchi sito",
    "builder.sidebar.open": "Apri menu",
    "builder.sidebar.close": "Chiudi menu",
    "builder.palette.title": "Colori",
    "builder.color.primary": "Primario",
    "builder.color.accent": "Accento",
    "builder.color.surface": "Sfondo",
    "builder.color.text": "Testo",
    "builder.price": "Prezzo: {price} $",
    "builder.pricing.month": "Mese",
    "builder.pricing.year": "Anno",
    "builder.pricing.perMonth": "al mese",
    "builder.pricing.perYear": "all'anno",
    "builder.workspace.eyebrow": "Builder sito",
    "builder.workspace.title": "Tela progetto",
    "builder.summary.blocks": "{count} blocchi",
    "builder.drop.empty": "Trascina un blocco qui",
    "builder.drop.active": "Rilascia il blocco",
    "builder.editor.upload": "Carica",
    "builder.editor.textPlaceholder": "Testo",
    "builder.deleteBlock": "Elimina blocco",
    "builder.section.header": "Intestazione",
    "builder.section.hero": "Banner",
    "builder.section.cards": "Card info",
    "builder.section.form": "Modulo registrazione",
    "builder.section.map": "Mappa",
    "builder.section.catalog": "Catalogo prodotti",
    "builder.section.pricing": "Abbonamento",
    "builder.section.reviews": "Recensioni",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Galleria",
    "builder.section.team": "Team",
    "builder.section.marquee": "Ticker",
    "builder.section.progress": "Progressi",
    "builder.section.stats": "Statistiche",
    "builder.section.article": "Articoli",
    "builder.section.background": "Effetti sfondo",
    "builder.section.footer": "Pie pagina",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Password",
    "builder.auth.label.repeat": "Conferma",
    "builder.auth.badge.account": "Area personale",
    "builder.auth.badge.email": "Conferma email",
    "builder.auth.forgot": "Password dimenticata?",
    "builder.feedback.label.name": "Nome",
    "builder.feedback.label.contact": "Contatto",
    "builder.feedback.label.review": "Recensione",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Dettagli",
    "builder.catalog.loadMore": "Mostra altro",
    "builder.catalog.close": "Chiudi prodotto",
  },
  pl: {
    "builder.sidebar.eyebrow": "Kreator",
    "builder.sidebar.title": "Bloki strony",
    "builder.sidebar.open": "Otworz menu",
    "builder.sidebar.close": "Zwin menu",
    "builder.palette.title": "Kolory",
    "builder.color.primary": "Glowny",
    "builder.color.accent": "Akcent",
    "builder.color.surface": "Tlo",
    "builder.color.text": "Tekst",
    "builder.price": "Cena: {price} $",
    "builder.pricing.month": "Miesiac",
    "builder.pricing.year": "Rok",
    "builder.pricing.perMonth": "miesiecznie",
    "builder.pricing.perYear": "rocznie",
    "builder.workspace.eyebrow": "Kreator stron",
    "builder.workspace.title": "Obszar projektu",
    "builder.summary.blocks": "{count} blokow",
    "builder.drop.empty": "Przeciagnij blok tutaj",
    "builder.drop.active": "Upusc blok",
    "builder.editor.upload": "Wgraj",
    "builder.editor.textPlaceholder": "Tekst",
    "builder.deleteBlock": "Usun blok",
    "builder.section.header": "Naglowek",
    "builder.section.hero": "Banner",
    "builder.section.cards": "Karty info",
    "builder.section.form": "Formularz",
    "builder.section.map": "Mapa",
    "builder.section.catalog": "Katalog produktow",
    "builder.section.pricing": "Subskrypcja",
    "builder.section.reviews": "Opinie",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Galeria",
    "builder.section.team": "Zespol",
    "builder.section.marquee": "Pasek info",
    "builder.section.progress": "Postep",
    "builder.section.stats": "Statystyki",
    "builder.section.article": "Artykuly",
    "builder.section.background": "Efekty tla",
    "builder.section.footer": "Stopka",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Haslo",
    "builder.auth.label.repeat": "Potwierdzenie",
    "builder.auth.badge.account": "Panel klienta",
    "builder.auth.badge.email": "Potwierdzenie email",
    "builder.auth.forgot": "Nie pamietasz hasla?",
    "builder.feedback.label.name": "Imie",
    "builder.feedback.label.contact": "Kontakt",
    "builder.feedback.label.review": "Opinia",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Szczegoly",
    "builder.catalog.loadMore": "Pokaz wiecej",
    "builder.catalog.close": "Zamknij produkt",
  },
  cz: {
    "builder.sidebar.eyebrow": "Tvurce",
    "builder.sidebar.title": "Bloky webu",
    "builder.sidebar.open": "Otevrit menu",
    "builder.sidebar.close": "Sbalit menu",
    "builder.palette.title": "Barvy",
    "builder.color.primary": "Hlavni",
    "builder.color.accent": "Akcent",
    "builder.color.surface": "Pozadi",
    "builder.color.text": "Text",
    "builder.price": "Cena: {price} $",
    "builder.pricing.month": "Mesic",
    "builder.pricing.year": "Rok",
    "builder.pricing.perMonth": "za mesic",
    "builder.pricing.perYear": "za rok",
    "builder.workspace.eyebrow": "Tvurce webu",
    "builder.workspace.title": "Platno projektu",
    "builder.summary.blocks": "{count} bloku",
    "builder.drop.empty": "Pretahnete blok sem",
    "builder.drop.active": "Pustte blok",
    "builder.editor.upload": "Nahrat",
    "builder.editor.textPlaceholder": "Text",
    "builder.deleteBlock": "Smazat blok",
    "builder.section.header": "Hlavicka",
    "builder.section.hero": "Banner",
    "builder.section.cards": "Info karty",
    "builder.section.form": "Registracni formular",
    "builder.section.map": "Mapa",
    "builder.section.catalog": "Katalog produktu",
    "builder.section.pricing": "Predplatne",
    "builder.section.reviews": "Recenze",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Galerie",
    "builder.section.team": "Tym",
    "builder.section.marquee": "BeЕѕici text",
    "builder.section.progress": "Prubeh",
    "builder.section.stats": "Statistika",
    "builder.section.article": "Clanky",
    "builder.section.background": "Efekty pozadi",
    "builder.section.footer": "Paticka",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Heslo",
    "builder.auth.label.repeat": "Potvrzeni",
    "builder.auth.badge.account": "Klientska zona",
    "builder.auth.badge.email": "Potvrzeni e-mailu",
    "builder.auth.forgot": "Zapomneli jste heslo?",
    "builder.feedback.label.name": "Jmeno",
    "builder.feedback.label.contact": "Kontakt",
    "builder.feedback.label.review": "Recenze",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Detail",
    "builder.catalog.loadMore": "Zobrazit dalsi",
    "builder.catalog.close": "Zavrit produkt",
  },
  sk: {
    "builder.sidebar.eyebrow": "Tvorca",
    "builder.sidebar.title": "Bloky webu",
    "builder.sidebar.open": "Otvorit menu",
    "builder.sidebar.close": "Zbalit menu",
    "builder.palette.title": "Farby",
    "builder.color.primary": "Hlavna",
    "builder.color.accent": "Akcent",
    "builder.color.surface": "Pozadie",
    "builder.color.text": "Text",
    "builder.price": "Cena: {price} $",
    "builder.pricing.month": "Mesiac",
    "builder.pricing.year": "Rok",
    "builder.pricing.perMonth": "za mesiac",
    "builder.pricing.perYear": "za rok",
    "builder.workspace.eyebrow": "Tvorca webu",
    "builder.workspace.title": "Platno projektu",
    "builder.summary.blocks": "{count} blokov",
    "builder.drop.empty": "Presunte blok sem",
    "builder.drop.active": "Pustite blok",
    "builder.editor.upload": "Nahrat",
    "builder.editor.textPlaceholder": "Text",
    "builder.deleteBlock": "Vymazat blok",
    "builder.section.header": "Hlavicka",
    "builder.section.hero": "Banner",
    "builder.section.cards": "Info karty",
    "builder.section.form": "Registracny formular",
    "builder.section.map": "Mapa",
    "builder.section.catalog": "Katalog produktov",
    "builder.section.pricing": "Predplatne",
    "builder.section.reviews": "Recenzie",
    "builder.section.faq": "FAQ",
    "builder.section.gallery": "Galeria",
    "builder.section.team": "Tim",
    "builder.section.marquee": "Beziaci text",
    "builder.section.progress": "Priebeh",
    "builder.section.stats": "Statistika",
    "builder.section.article": "Clanky",
    "builder.section.background": "Efekty pozadia",
    "builder.section.footer": "Paticka",
    "builder.default.headerBrand": "Brand",
    "builder.auth.label.login": "Login",
    "builder.auth.label.password": "Heslo",
    "builder.auth.label.repeat": "Potvrdenie",
    "builder.auth.badge.account": "Klientska zona",
    "builder.auth.badge.email": "Potvrdenie e-mailu",
    "builder.auth.forgot": "Zabudli ste heslo?",
    "builder.feedback.label.name": "Meno",
    "builder.feedback.label.contact": "Kontakt",
    "builder.feedback.label.review": "Recenzia",
    "builder.feedback.label.note": "Feedback",
    "builder.catalog.more": "Detail",
    "builder.catalog.loadMore": "Zobrazit viac",
    "builder.catalog.close": "Zavriet produkt",
  },
};

const builderStatsCopyByLang: Record<string, BuilderCopy> = {
  ru: {
    "builder.stats.line.title": "Динамика показателей",
    "builder.stats.bar.title": "Сравнение показателей",
    "builder.stats.pie.title": "Распределение",
    "builder.stats.line.text": "Линия с точками для роста, заявок, выручки или прогресса по месяцам.",
    "builder.stats.bar.text": "Добавьте подписи и значения, чтобы показать сравнение по месяцам, услугам или каналам.",
    "builder.stats.pie.text": "Покажите доли бюджета, продаж, источников заявок или состава аудитории.",
    "builder.stats.months": "Январь|Февраль|Март|Апрель|Май|Июнь|Июль|Август|Сентябрь|Октябрь",
    "builder.stats.segments": "Продажи|Реклама|Повторы|Партнеры|Поиск|Соцсети|Рассылки|Рефералы|Оффлайн|Другое",
    "builder.stats.point": "Пункт {number}",
    "builder.stats.segment": "Сегмент {number}",
  },
  en: {
    "builder.stats.line.title": "Performance dynamics",
    "builder.stats.bar.title": "Metric comparison",
    "builder.stats.pie.title": "Distribution",
    "builder.stats.line.text": "Line chart for growth, requests, revenue, or monthly progress.",
    "builder.stats.bar.text": "Add labels and values to compare months, services, or channels.",
    "builder.stats.pie.text": "Show budget, sales, lead source, or audience share.",
    "builder.stats.months": "January|February|March|April|May|June|July|August|September|October",
    "builder.stats.segments": "Sales|Ads|Repeat|Partners|Search|Social|Email|Referrals|Offline|Other",
    "builder.stats.point": "Item {number}",
    "builder.stats.segment": "Segment {number}",
  },
  de: {
    "builder.stats.line.title": "Kennzahlen-Dynamik",
    "builder.stats.bar.title": "Kennzahlenvergleich",
    "builder.stats.pie.title": "Verteilung",
    "builder.stats.line.text": "Liniendiagramm fur Wachstum, Anfragen, Umsatz oder Fortschritt nach Monaten.",
    "builder.stats.bar.text": "Vergleichen Sie Monate, Services oder Kanale mit editierbaren Werten.",
    "builder.stats.pie.text": "Zeigen Sie Budget, Umsatz, Leadquellen oder Zielgruppenanteile.",
    "builder.stats.months": "Januar|Februar|Marz|April|Mai|Juni|Juli|August|September|Oktober",
    "builder.stats.segments": "Verkauf|Werbung|Wiederkehr|Partner|Suche|Social|E-Mail|Empfehlung|Offline|Andere",
    "builder.stats.point": "Punkt {number}",
    "builder.stats.segment": "Segment {number}",
  },
  fr: {
    "builder.stats.line.title": "Evolution des indicateurs",
    "builder.stats.bar.title": "Comparaison des indicateurs",
    "builder.stats.pie.title": "Repartition",
    "builder.stats.line.text": "Courbe pour croissance, demandes, chiffre d'affaires ou progression mensuelle.",
    "builder.stats.bar.text": "Comparez mois, services ou canaux avec des valeurs modifiables.",
    "builder.stats.pie.text": "Montrez budget, ventes, sources de leads ou parts d'audience.",
    "builder.stats.months": "Janvier|Fevrier|Mars|Avril|Mai|Juin|Juillet|Aout|Septembre|Octobre",
    "builder.stats.segments": "Ventes|Publicite|Retours|Partenaires|Recherche|Social|Email|Parrainage|Offline|Autre",
    "builder.stats.point": "Point {number}",
    "builder.stats.segment": "Segment {number}",
  },
  it: {
    "builder.stats.line.title": "Andamento metriche",
    "builder.stats.bar.title": "Confronto metriche",
    "builder.stats.pie.title": "Distribuzione",
    "builder.stats.line.text": "Grafico linea per crescita, richieste, ricavi o progresso mensile.",
    "builder.stats.bar.text": "Confronta mesi, servizi o canali con valori modificabili.",
    "builder.stats.pie.text": "Mostra budget, vendite, fonti lead o quote pubblico.",
    "builder.stats.months": "Gennaio|Febbraio|Marzo|Aprile|Maggio|Giugno|Luglio|Agosto|Settembre|Ottobre",
    "builder.stats.segments": "Vendite|Annunci|Ritorni|Partner|Ricerca|Social|Email|Referral|Offline|Altro",
    "builder.stats.point": "Punto {number}",
    "builder.stats.segment": "Segmento {number}",
  },
  pl: {
    "builder.stats.line.title": "Dynamika wskaznikow",
    "builder.stats.bar.title": "Porownanie wskaznikow",
    "builder.stats.pie.title": "Rozklad",
    "builder.stats.line.text": "Wykres liniowy dla wzrostu, zgloszen, przychodow lub postepu miesiecznego.",
    "builder.stats.bar.text": "Porownaj miesiace, uslugi lub kanaly z edytowalnymi wartosciami.",
    "builder.stats.pie.text": "Pokaz udzial budzetu, sprzedazy, zrodel leadow lub odbiorcow.",
    "builder.stats.months": "Styczen|Luty|Marzec|Kwiecien|Maj|Czerwiec|Lipiec|Sierpien|Wrzesien|Pazdziernik",
    "builder.stats.segments": "Sprzedaz|Reklama|Powroty|Partnerzy|Szukaj|Social|Email|Polecenia|Offline|Inne",
    "builder.stats.point": "Punkt {number}",
    "builder.stats.segment": "Segment {number}",
  },
  cz: {
    "builder.stats.line.title": "Dynamika ukazatelu",
    "builder.stats.bar.title": "Porovnani ukazatelu",
    "builder.stats.pie.title": "Rozdeleni",
    "builder.stats.line.text": "Carovy graf pro rust, poptavky, trzby nebo mesicni pokrok.",
    "builder.stats.bar.text": "Porovnejte mesice, sluzby nebo kanaly s editovatelnymi hodnotami.",
    "builder.stats.pie.text": "Ukazte podily rozpoctu, prodeje, zdroju leadu nebo publika.",
    "builder.stats.months": "Leden|Unor|Brezen|Duben|Kveten|Cerven|Cervenec|Srpen|Zari|Rijen",
    "builder.stats.segments": "Prodej|Reklama|Navraty|Partneri|Vyhledani|Social|E-mail|Doporuceni|Offline|Jine",
    "builder.stats.point": "Polozka {number}",
    "builder.stats.segment": "Segment {number}",
  },
  sk: {
    "builder.stats.line.title": "Dynamika ukazovatelov",
    "builder.stats.bar.title": "Porovnanie ukazovatelov",
    "builder.stats.pie.title": "Rozdelenie",
    "builder.stats.line.text": "Ciarovy graf pre rast, dopyty, trzby alebo mesacny pokrok.",
    "builder.stats.bar.text": "Porovnajte mesiace, sluzby alebo kanaly s editovatelnymi hodnotami.",
    "builder.stats.pie.text": "Ukazte podiely rozpoctu, predaja, zdrojov leadov alebo publika.",
    "builder.stats.months": "Januar|Februar|Marec|April|Maj|Jun|Jul|August|September|Oktober",
    "builder.stats.segments": "Predaj|Reklama|Navraty|Partneri|Vyhladavanie|Social|E-mail|Odporucania|Offline|Ine",
    "builder.stats.point": "Polozka {number}",
    "builder.stats.segment": "Segment {number}",
  },
};

Object.entries(builderStatsCopyByLang).forEach(([copyLang, copy]) => {
  builderPageTranslations[copyLang] = {
    ...(builderPageTranslations[copyLang] ?? builderPageTranslations.en),
    ...copy,
  };
});

const builderSettingsCopyByLang: Record<string, BuilderCopy> = {
  ru: {
    "builder.blockSettings.title": "Настройки блока",
    "builder.blockSettings.aria": "Настройки блока",
    "builder.blockSettings.mode": "Режим блока",
    "builder.blockSettings.auto": "Авто",
    "builder.blockSettings.light": "Светлый",
    "builder.blockSettings.dark": "Темный",
    "builder.blockSettings.primary": "Основной",
    "builder.blockSettings.accent": "Акцент",
    "builder.blockSettings.surface": "Фон",
    "builder.blockSettings.text": "Текст",
    "builder.blockSettings.headingFont": "Заголовки",
    "builder.blockSettings.bodyFont": "Текст",
    "builder.blockSettings.uiFont": "Подписи",
    "builder.blockSettings.count": "Количество",
    "builder.blockSettings.delete": "Удалить",
  },
  en: {
    "builder.blockSettings.title": "Block settings",
    "builder.blockSettings.aria": "Block settings",
    "builder.blockSettings.mode": "Block mode",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Light",
    "builder.blockSettings.dark": "Dark",
    "builder.blockSettings.primary": "Primary",
    "builder.blockSettings.accent": "Accent",
    "builder.blockSettings.surface": "Background",
    "builder.blockSettings.text": "Text",
    "builder.blockSettings.headingFont": "Headings",
    "builder.blockSettings.bodyFont": "Text",
    "builder.blockSettings.uiFont": "Labels",
    "builder.blockSettings.count": "Count",
    "builder.blockSettings.delete": "Delete",
  },
  de: {
    "builder.blockSettings.title": "Blockeinstellungen",
    "builder.blockSettings.aria": "Blockeinstellungen",
    "builder.blockSettings.mode": "Blockmodus",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Hell",
    "builder.blockSettings.dark": "Dunkel",
    "builder.blockSettings.primary": "Primar",
    "builder.blockSettings.accent": "Akzent",
    "builder.blockSettings.surface": "Hintergrund",
    "builder.blockSettings.text": "Text",
    "builder.blockSettings.headingFont": "Uberschriften",
    "builder.blockSettings.bodyFont": "Text",
    "builder.blockSettings.uiFont": "Labels",
    "builder.blockSettings.count": "Anzahl",
    "builder.blockSettings.delete": "Loschen",
  },
  fr: {
    "builder.blockSettings.title": "Parametres du bloc",
    "builder.blockSettings.aria": "Parametres du bloc",
    "builder.blockSettings.mode": "Mode du bloc",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Clair",
    "builder.blockSettings.dark": "Sombre",
    "builder.blockSettings.primary": "Principal",
    "builder.blockSettings.accent": "Accent",
    "builder.blockSettings.surface": "Fond",
    "builder.blockSettings.text": "Texte",
    "builder.blockSettings.headingFont": "Titres",
    "builder.blockSettings.bodyFont": "Texte",
    "builder.blockSettings.uiFont": "Libelles",
    "builder.blockSettings.count": "Nombre",
    "builder.blockSettings.delete": "Supprimer",
  },
  it: {
    "builder.blockSettings.title": "Impostazioni blocco",
    "builder.blockSettings.aria": "Impostazioni blocco",
    "builder.blockSettings.mode": "Modo blocco",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Chiaro",
    "builder.blockSettings.dark": "Scuro",
    "builder.blockSettings.primary": "Primario",
    "builder.blockSettings.accent": "Accento",
    "builder.blockSettings.surface": "Sfondo",
    "builder.blockSettings.text": "Testo",
    "builder.blockSettings.headingFont": "Titoli",
    "builder.blockSettings.bodyFont": "Testo",
    "builder.blockSettings.uiFont": "Etichette",
    "builder.blockSettings.count": "Quantita",
    "builder.blockSettings.delete": "Elimina",
  },
  pl: {
    "builder.blockSettings.title": "Ustawienia bloku",
    "builder.blockSettings.aria": "Ustawienia bloku",
    "builder.blockSettings.mode": "Tryb bloku",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Jasny",
    "builder.blockSettings.dark": "Ciemny",
    "builder.blockSettings.primary": "Glowny",
    "builder.blockSettings.accent": "Akcent",
    "builder.blockSettings.surface": "Tlo",
    "builder.blockSettings.text": "Tekst",
    "builder.blockSettings.headingFont": "Naglowki",
    "builder.blockSettings.bodyFont": "Tekst",
    "builder.blockSettings.uiFont": "Etykiety",
    "builder.blockSettings.count": "Liczba",
    "builder.blockSettings.delete": "Usun",
  },
  cz: {
    "builder.blockSettings.title": "Nastaveni bloku",
    "builder.blockSettings.aria": "Nastaveni bloku",
    "builder.blockSettings.mode": "Rezim bloku",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Svetly",
    "builder.blockSettings.dark": "Tmavy",
    "builder.blockSettings.primary": "Hlavni",
    "builder.blockSettings.accent": "Akcent",
    "builder.blockSettings.surface": "Pozadi",
    "builder.blockSettings.text": "Text",
    "builder.blockSettings.headingFont": "Nadpisy",
    "builder.blockSettings.bodyFont": "Text",
    "builder.blockSettings.uiFont": "Popisky",
    "builder.blockSettings.count": "Pocet",
    "builder.blockSettings.delete": "Smazat",
  },
  sk: {
    "builder.blockSettings.title": "Nastavenia bloku",
    "builder.blockSettings.aria": "Nastavenia bloku",
    "builder.blockSettings.mode": "Rezim bloku",
    "builder.blockSettings.auto": "Auto",
    "builder.blockSettings.light": "Svetly",
    "builder.blockSettings.dark": "Tmavy",
    "builder.blockSettings.primary": "Hlavna",
    "builder.blockSettings.accent": "Akcent",
    "builder.blockSettings.surface": "Pozadie",
    "builder.blockSettings.text": "Text",
    "builder.blockSettings.headingFont": "Nadpisy",
    "builder.blockSettings.bodyFont": "Text",
    "builder.blockSettings.uiFont": "Popisky",
    "builder.blockSettings.count": "Pocet",
    "builder.blockSettings.delete": "Vymazat",
  },
};

Object.entries(builderSettingsCopyByLang).forEach(([copyLang, copy]) => {
  builderPageTranslations[copyLang] = {
    ...(builderPageTranslations[copyLang] ?? builderPageTranslations.en),
    ...copy,
  };
});

const builderBlockCopy: Record<string, { title: string; description: string }> = {
  "header-clean": { title: "Basic header", description: "Logo, menu, and CTA" },
  "header-store": { title: "Store header", description: "Search, menu, and cart" },
  "header-center": { title: "Ice glass", description: "Frosted glass and navigation" },
  "header-dark": { title: "Dark header", description: "Black panel and accent" },
  "header-pill": { title: "Floating header", description: "Inset rounded panel" },
  "hero-product": { title: "Product screen", description: "Offer, CTA, and magnetic visual" },
  "hero-editorial": { title: "Editorial hero", description: "Large headline and facts" },
  "hero-app": { title: "GearLabs banner", description: "Typing, carousel, and two buttons" },
  "hero-majestic": { title: "City start", description: "City, servers, and game start" },
  "hero-majestic-strip": { title: "Hover panels", description: "5-7 grayscale hover panels" },
  "cards-services": { title: "Services", description: "Three icon cards" },
  "cards-metrics": { title: "Metrics", description: "Numbers and short insights" },
  "cards-process": { title: "Process", description: "Work steps" },
  "cards-tabs": { title: "Tabbed benefits", description: "3-5 benefits in one block" },
  "form-compact": { title: "Login / sign up", description: "Login, password, and account" },
  "form-split": { title: "Client feedback", description: "Review, rating, and contact" },
  "map-contact": { title: "Contacts", description: "Map and address" },
  "map-points": { title: "Pickup points", description: "Several locations" },
  "catalog-grid": { title: "Catalog 3x2", description: "Cards, modal, and pagination" },
  "catalog-feature": { title: "Load-more catalog", description: "3x2 and load-more button" },
  "pricing-classic": { title: "Plans", description: "Basic, Pro, Max" },
  "pricing-focus": { title: "Pro focus", description: "Plans with highlight" },
  "reviews-row": { title: "Review ticker", description: "Customer quotes in motion" },
  "reviews-highlight": { title: "Case review", description: "One strong detailed review" },
  "reviews-slider": { title: "Review slider", description: "Photo, text, and controls" },
  "marquee-light": { title: "Marquee", description: "Status strip" },
  "marquee-card": { title: "Info switcher", description: "Rotating compact cards" },
  "marquee-typing": { title: "Typing ticker", description: "Erase and type messages" },
  "progress-bars": { title: "Linear progress", description: "Animated percentages" },
  "progress-circle": { title: "Circle progress", description: "Portfolio-style skills" },
  "stats-line": { title: "Line chart", description: "Excel-style trend chart" },
  "stats-bar": { title: "Columns", description: "Column comparison" },
  "stats-pie": { title: "Diagram", description: "Shares and legend" },
  "article-nav": { title: "Article navigation", description: "Text with heading navigation" },
  "article-image-flow": { title: "Magazine text", description: "Word-style text wrapping" },
  "article-infobox": { title: "Wiki card", description: "Image and info table" },
  "bg-scroll-gradient": { title: "Scroll gradient", description: "Color shifts while scrolling" },
  "bg-scroll-orbs": { title: "Blurred circles", description: "Soft motion tied to scroll" },
  "bg-edge-particles": { title: "Edge particles", description: "Particles from page edges" },
  "bg-spark-stars": { title: "Spark stars", description: "Appearing glowing dots" },
  "bg-aurora-grid": { title: "Aurora grid", description: "Light grid and depth" },
  "bg-spotlight-rings": { title: "Spotlight rings", description: "Rings and soft light" },
  "faq-simple": { title: "Questions", description: "Answer list" },
  "faq-split": { title: "FAQ + CTA", description: "Answers and a button" },
  "gallery-mosaic": { title: "Mosaic", description: "Image grid" },
  "gallery-slider": { title: "Slider", description: "Large frame and previews" },
  "team-cards": { title: "Team", description: "Specialist cards" },
  "team-line": { title: "Expert line", description: "Compact block" },
  "team-spotlight": { title: "Expert focus", description: "Large profile and 4 mini cards" },
  "footer-compact": { title: "Small footer", description: "Logo, links, socials" },
  "footer-columns": { title: "Medium footer", description: "Columns, contacts, socials" },
  "footer-cta": { title: "Large footer", description: "CTA, menu, contacts, socials" },
  "footer-white": { title: "White footer", description: "Light bottom section" },
};

const builderBlockCopyByLang: Record<string, Record<string, { title: string; description: string }>> = {
  en: builderBlockCopy,
  de: {
    "header-clean": { title: "Klare Navigation", description: "Logo, Menu und CTA" },
    "header-store": { title: "Shop", description: "Suche, Katalog und Warenkorb" },
    "header-center": { title: "Zentriert", description: "Menu rund um die Marke" },
    "header-dark": { title: "Dunkle Navigation", description: "Schwarze Leiste und Akzent" },
    "header-pill": { title: "Abgerundet mit Abstand", description: "Runde Leiste mit Seitenabstand" },
    "hero-product": { title: "Produkt-Hero", description: "Text, Button und Showcase" },
    "hero-editorial": { title: "Editorial", description: "Grosse Headline und Fakten" },
    "hero-app": { title: "App-Vorschau", description: "Promo-Block fur App" },
    "hero-majestic": { title: "City Start", description: "Stadt, Server und Spielstart" },
    "hero-majestic-strip": { title: "Hover Cards", description: "5-7 Schwarzweiss Hover-Panels" },
    "cards-services": { title: "Services", description: "Drei Karten mit Icons" },
    "cards-metrics": { title: "Metriken", description: "Zahlen und kurze Aussagen" },
    "cards-process": { title: "Prozess", description: "Arbeitsschritte" },
    "form-compact": { title: "Login / Registrierung", description: "Login, Passwort und Konto" },
    "form-split": { title: "Kundenfeedback", description: "Bewertung, Kontakt und Text" },
    "map-contact": { title: "Kontakte", description: "Karte und Adresse" },
    "map-points": { title: "Abholpunkte", description: "Mehrere Standorte" },
    "catalog-grid": { title: "Grid + Seiten", description: "3x2, Karten und Pagination" },
    "catalog-feature": { title: "Grid + Mehr laden", description: "3x2 und Mehr-Button" },
    "pricing-classic": { title: "3 Tarife", description: "Basic, Pro, Max" },
    "pricing-focus": { title: "Pro-Fokus", description: "Tarife mit Highlight" },
    "reviews-row": { title: "Bewertungen", description: "Kundenstimmen" },
    "reviews-highlight": { title: "Hauptbewertung", description: "Ein starker Case" },
    "reviews-slider": { title: "Bewertungs-Slider", description: "Foto, Text und Steuerung" },
    "stats-line": { title: "Liniendiagramm", description: "Trend wie in Excel" },
    "stats-bar": { title: "Balkendiagramm", description: "Vergleich in Spalten" },
    "stats-pie": { title: "Kreisdiagramm", description: "Anteile und Legende" },
    "bg-scroll-gradient": { title: "Scroll-Gradient", description: "Farbe folgt dem Scrollen" },
    "bg-scroll-orbs": { title: "Weiche Kreise", description: "Blur-Flachen mit Scroll" },
    "bg-edge-particles": { title: "Partikel am Rand", description: "Partikel von den Seiten" },
    "bg-spark-stars": { title: "Leuchtsterne", description: "Punkte erscheinen und verschwinden" },
    "bg-aurora-grid": { title: "Aurora-Raster", description: "Lichtgitter mit Tiefe" },
    "bg-spotlight-rings": { title: "Spotlight-Ringe", description: "Ringe und weiches Licht" },
    "faq-simple": { title: "Fragen", description: "Antwortliste" },
    "faq-split": { title: "FAQ + CTA", description: "Antworten und Button" },
    "gallery-mosaic": { title: "Mosaik", description: "Bildergitter" },
    "gallery-slider": { title: "Slider", description: "Grosser Frame und Previews" },
    "team-cards": { title: "Team", description: "Expertenkarten" },
    "team-line": { title: "Expertenreihe", description: "Kompakter Block" },
    "team-spotlight": { title: "Expertenfokus", description: "Grosses Profil und 4 Mini-Karten" },
    "footer-compact": { title: "Kompakt", description: "Logo und Links" },
    "footer-columns": { title: "Spalten", description: "Navigation und Kontakte" },
    "footer-cta": { title: "Footer mit CTA", description: "Anfrage am Ende" },
    "footer-white": { title: "Weisser Footer", description: "Heller Seitenabschluss" },
  },
  fr: {
    "header-clean": { title: "Navigation claire", description: "Logo, menu et CTA" },
    "header-store": { title: "Boutique", description: "Recherche, catalogue et panier" },
    "header-center": { title: "Centree", description: "Menu autour de la marque" },
    "header-dark": { title: "En-tete sombre", description: "Barre noire et accent" },
    "header-pill": { title: "Arrondi avec marges", description: "Barre ronde avec recul" },
    "hero-product": { title: "Hero produit", description: "Texte, bouton et vitrine" },
    "hero-editorial": { title: "Editorial", description: "Grand titre et faits" },
    "hero-app": { title: "Apercu app", description: "Bloc promo application" },
    "hero-majestic": { title: "Depart ville", description: "Ville, serveurs et depart" },
    "hero-majestic-strip": { title: "Hover cards", description: "5-7 panneaux hover gris" },
    "cards-services": { title: "Services", description: "Trois cartes avec icones" },
    "cards-metrics": { title: "Metriques", description: "Chiffres et messages courts" },
    "cards-process": { title: "Processus", description: "Etapes de travail" },
    "form-compact": { title: "Login / inscription", description: "Login, mot de passe et compte" },
    "form-split": { title: "Feedback client", description: "Avis, note et contact" },
    "map-contact": { title: "Contacts", description: "Carte et adresse" },
    "map-points": { title: "Points relais", description: "Plusieurs lieux" },
    "catalog-grid": { title: "Grille + pages", description: "3x2, cartes et pagination" },
    "catalog-feature": { title: "Grille + voir plus", description: "3x2 et chargement" },
    "pricing-classic": { title: "3 offres", description: "Basic, Pro, Max" },
    "pricing-focus": { title: "Focus Pro", description: "Offres avec accent" },
    "reviews-row": { title: "Avis", description: "Citations clients" },
    "reviews-highlight": { title: "Avis principal", description: "Un cas fort" },
    "reviews-slider": { title: "Slider d'avis", description: "Photo, texte et controles" },
    "stats-line": { title: "Graphique ligne", description: "Tendance type Excel" },
    "stats-bar": { title: "Graphique barres", description: "Comparaison en colonnes" },
    "stats-pie": { title: "Camembert", description: "Parts et legende" },
    "bg-scroll-gradient": { title: "Degrade au scroll", description: "Couleur liee au scroll" },
    "bg-scroll-orbs": { title: "Cercles flous", description: "Halo doux au scroll" },
    "bg-edge-particles": { title: "Particules bords", description: "Particules depuis les bords" },
    "bg-spark-stars": { title: "Etoiles brillantes", description: "Points qui apparaissent" },
    "bg-aurora-grid": { title: "Grille aurora", description: "Grille lumineuse profonde" },
    "bg-spotlight-rings": { title: "Anneaux spotlight", description: "Anneaux et lumiere douce" },
    "faq-simple": { title: "Questions", description: "Liste de reponses" },
    "faq-split": { title: "FAQ + CTA", description: "Reponses et bouton" },
    "gallery-mosaic": { title: "Mosaique", description: "Grille d'images" },
    "gallery-slider": { title: "Slider", description: "Grand cadre et apercus" },
    "team-cards": { title: "Equipe", description: "Cartes specialistes" },
    "team-line": { title: "Ligne experts", description: "Bloc compact" },
    "team-spotlight": { title: "Focus expert", description: "Grand profil et 4 mini-cartes" },
    "footer-compact": { title: "Compact", description: "Logo et liens" },
    "footer-columns": { title: "Colonnes", description: "Navigation et contacts" },
    "footer-cta": { title: "Footer avec CTA", description: "Demande en bas" },
    "footer-white": { title: "Footer blanc", description: "Bas de page clair" },
  },
  it: {
    "header-clean": { title: "Navigazione pulita", description: "Logo, menu e CTA" },
    "header-store": { title: "Store", description: "Ricerca, catalogo e carrello" },
    "header-center": { title: "Centrata", description: "Menu intorno al brand" },
    "header-dark": { title: "Header scuro", description: "Barra nera e accento" },
    "header-pill": { title: "Arrotondata con margini", description: "Barra tonda con distacco" },
    "hero-product": { title: "Hero prodotto", description: "Testo, bottone e vetrina" },
    "hero-editorial": { title: "Editoriale", description: "Titolo grande e dati" },
    "hero-app": { title: "Anteprima app", description: "Promo applicazione" },
    "hero-majestic": { title: "Avvio citta", description: "Citta, server e avvio" },
    "hero-majestic-strip": { title: "Hover cards", description: "5-7 pannelli hover grigi" },
    "cards-services": { title: "Servizi", description: "Tre card con icone" },
    "cards-metrics": { title: "Metriche", description: "Numeri e insight brevi" },
    "cards-process": { title: "Processo", description: "Step di lavoro" },
    "form-compact": { title: "Login / registrazione", description: "Login, password e account" },
    "form-split": { title: "Feedback cliente", description: "Recensione, voto e contatto" },
    "map-contact": { title: "Contatti", description: "Mappa e indirizzo" },
    "map-points": { title: "Punti ritiro", description: "Diverse sedi" },
    "catalog-grid": { title: "Griglia + pagine", description: "3x2, card e paginazione" },
    "catalog-feature": { title: "Griglia + altro", description: "3x2 e carica altro" },
    "pricing-classic": { title: "3 piani", description: "Basic, Pro, Max" },
    "pricing-focus": { title: "Focus Pro", description: "Piani in evidenza" },
    "reviews-row": { title: "Recensioni", description: "Citazioni clienti" },
    "reviews-highlight": { title: "Recensione top", description: "Un caso forte" },
    "reviews-slider": { title: "Slider recensioni", description: "Foto, testo e controlli" },
    "stats-line": { title: "Grafico linea", description: "Trend stile Excel" },
    "stats-bar": { title: "Grafico barre", description: "Confronto a colonne" },
    "stats-pie": { title: "Grafico torta", description: "Quote e legenda" },
    "bg-scroll-gradient": { title: "Gradiente scroll", description: "Colore legato allo scroll" },
    "bg-scroll-orbs": { title: "Cerchi sfocati", description: "Aloni morbidi allo scroll" },
    "bg-edge-particles": { title: "Particelle bordi", description: "Particelle dai lati" },
    "bg-spark-stars": { title: "Stelle luminose", description: "Punti che appaiono" },
    "bg-aurora-grid": { title: "Griglia aurora", description: "Griglia luminosa profonda" },
    "bg-spotlight-rings": { title: "Anelli spotlight", description: "Anelli e luce morbida" },
    "faq-simple": { title: "Domande", description: "Lista risposte" },
    "faq-split": { title: "FAQ + CTA", description: "Risposte e bottone" },
    "gallery-mosaic": { title: "Mosaico", description: "Griglia immagini" },
    "gallery-slider": { title: "Slider", description: "Frame grande e preview" },
    "team-cards": { title: "Team", description: "Card specialisti" },
    "team-line": { title: "Linea esperti", description: "Blocco compatto" },
    "team-spotlight": { title: "Focus esperto", description: "Profilo grande e 4 mini card" },
    "footer-compact": { title: "Compatto", description: "Logo e link" },
    "footer-columns": { title: "Colonne", description: "Navigazione e contatti" },
    "footer-cta": { title: "Footer con CTA", description: "Richiesta in basso" },
    "footer-white": { title: "Footer bianco", description: "Chiusura chiara" },
  },
  pl: {
    "header-clean": { title: "Czysta nawigacja", description: "Logo, menu i CTA" },
    "header-store": { title: "Sklep", description: "Szukaj, katalog i koszyk" },
    "header-center": { title: "Wycentrowana", description: "Menu wokol marki" },
    "header-dark": { title: "Ciemny naglowek", description: "Czarny pasek i akcent" },
    "header-pill": { title: "Zaokraglony z marginesem", description: "Pasek z odstepem od krawedzi" },
    "hero-product": { title: "Hero produktu", description: "Tekst, przycisk i prezentacja" },
    "hero-editorial": { title: "Editorial", description: "Duzy naglowek i fakty" },
    "hero-app": { title: "Podglad app", description: "Promo aplikacji" },
    "hero-majestic": { title: "Start miasta", description: "Miasto, serwery i start gry" },
    "hero-majestic-strip": { title: "Hover cards", description: "5-7 szarych paneli hover" },
    "cards-services": { title: "Uslugi", description: "Trzy karty z ikonami" },
    "cards-metrics": { title: "Metryki", description: "Liczby i krotkie wnioski" },
    "cards-process": { title: "Proces", description: "Kroki pracy" },
    "form-compact": { title: "Login / rejestracja", description: "Login, haslo i konto" },
    "form-split": { title: "Feedback klienta", description: "Opinia, ocena i kontakt" },
    "map-contact": { title: "Kontakty", description: "Mapa i adres" },
    "map-points": { title: "Punkty odbioru", description: "Kilka lokalizacji" },
    "catalog-grid": { title: "Siatka + strony", description: "3x2, karty i paginacja" },
    "catalog-feature": { title: "Siatka + wiecej", description: "3x2 i dogrywanie" },
    "pricing-classic": { title: "3 taryfy", description: "Basic, Pro, Max" },
    "pricing-focus": { title: "Fokus Pro", description: "Taryfy z wyroznieniem" },
    "reviews-row": { title: "Opinie", description: "Cytaty klientow" },
    "reviews-highlight": { title: "Glowna opinia", description: "Jeden mocny case" },
    "reviews-slider": { title: "Slider opinii", description: "Zdjecie, tekst i sterowanie" },
    "stats-line": { title: "Wykres liniowy", description: "Trend jak w Excelu" },
    "stats-bar": { title: "Wykres slupkowy", description: "Porownanie kolumn" },
    "stats-pie": { title: "Wykres kolowy", description: "Udzialy i legenda" },
    "bg-scroll-gradient": { title: "Gradient scroll", description: "Kolor zmienia sie przy scrollu" },
    "bg-scroll-orbs": { title: "Rozmyte kola", description: "Miekkie plamy przy scrollu" },
    "bg-edge-particles": { title: "Czastki z krawedzi", description: "Czastki z bokow strony" },
    "bg-spark-stars": { title: "Iskrzace gwiazdy", description: "Punkty pojawiaja sie i znikaja" },
    "bg-aurora-grid": { title: "Siatka aurora", description: "Swietlna siatka i glebia" },
    "bg-spotlight-rings": { title: "Kregi spotlight", description: "Kregi i miekkie swiatlo" },
    "faq-simple": { title: "Pytania", description: "Lista odpowiedzi" },
    "faq-split": { title: "FAQ + CTA", description: "Odpowiedzi i przycisk" },
    "gallery-mosaic": { title: "Mozaika", description: "Siatka obrazow" },
    "gallery-slider": { title: "Slider", description: "Duze okno i miniatury" },
    "team-cards": { title: "Zespol", description: "Karty specjalistow" },
    "team-line": { title: "Linia ekspertow", description: "Kompaktowy blok" },
    "team-spotlight": { title: "Fokus eksperta", description: "Duzy profil i 4 mini karty" },
    "footer-compact": { title: "Kompaktowy", description: "Logo i linki" },
    "footer-columns": { title: "Kolumny", description: "Nawigacja i kontakty" },
    "footer-cta": { title: "Footer z CTA", description: "Zapytanie na dole" },
    "footer-white": { title: "Biala stopka", description: "Jasne zakonczenie strony" },
  },
  cz: {
    "header-clean": { title: "Cista navigace", description: "Logo, menu a CTA" },
    "header-store": { title: "Obchod", description: "Hledani, katalog a kosik" },
    "header-dark": { title: "Tmava hlavicka", description: "Cerna lista a akcent" },
    "header-pill": { title: "Zaoblena s okraji", description: "Lista s odstupem od stran" },
    "header-center": { title: "CentrovanГЎ", description: "Menu kolem znacky" },
    "hero-product": { title: "Produktovy hero", description: "Text, tlacitko a ukazka" },
    "hero-editorial": { title: "Editorial", description: "Velky nadpis a fakta" },
    "hero-app": { title: "Nahled app", description: "Promo aplikace" },
    "hero-majestic": { title: "Start mesta", description: "Mesto, servery a start hry" },
    "hero-majestic-strip": { title: "Hover cards", description: "5-7 cernobilych hover panelu" },
    "cards-services": { title: "Sluzby", description: "Tri karty s ikonami" },
    "cards-metrics": { title: "Metriky", description: "Cisla a kratke zavery" },
    "cards-process": { title: "Proces", description: "Kroky prace" },
    "form-compact": { title: "Login / registrace", description: "Login, heslo a ucet" },
    "form-split": { title: "Feedback klienta", description: "Recenze, hodnoceni a kontakt" },
    "map-contact": { title: "Kontakty", description: "Mapa a adresa" },
    "map-points": { title: "Vydejni mista", description: "Vice lokaci" },
    "catalog-grid": { title: "Mrizka + stranky", description: "3x2, karty a paginace" },
    "catalog-feature": { title: "Mrizka + dalsi", description: "3x2 a nacitani" },
    "pricing-classic": { title: "3 tarify", description: "Basic, Pro, Max" },
    "pricing-focus": { title: "Fokus Pro", description: "Tarify se zvyraznenim" },
    "reviews-row": { title: "Recenze", description: "Citace zakazniku" },
    "reviews-highlight": { title: "Hlavni recenze", description: "Jeden silny case" },
    "reviews-slider": { title: "Slider recenzi", description: "Foto, text a ovladani" },
    "stats-line": { title: "Carovy graf", description: "Trend jako v Excelu" },
    "stats-bar": { title: "Sloupcovy graf", description: "Porovnani ve sloupcich" },
    "stats-pie": { title: "Kolacovy graf", description: "Podily a legenda" },
    "bg-scroll-gradient": { title: "Scroll gradient", description: "Barva se meni pri scrollu" },
    "bg-scroll-orbs": { title: "Rozmazane kruhy", description: "Mekke plochy pri scrollu" },
    "bg-edge-particles": { title: "Castice z okraju", description: "Castice ze stran webu" },
    "bg-spark-stars": { title: "Zarici hvezdy", description: "Body se objevuji a mizi" },
    "bg-aurora-grid": { title: "Aurora mrizka", description: "Svetelna mrizka a hloubka" },
    "bg-spotlight-rings": { title: "Spotlight kruhy", description: "Kruhy a mekke svetlo" },
    "faq-simple": { title: "Otazky", description: "Seznam odpovedi" },
    "faq-split": { title: "FAQ + CTA", description: "Odpovedi a tlacitko" },
    "gallery-mosaic": { title: "Mozaika", description: "Mrizka obrazku" },
    "gallery-slider": { title: "Slider", description: "Velky ramec a nahledy" },
    "team-cards": { title: "Tym", description: "Karty specialistu" },
    "team-line": { title: "Rada expertu", description: "Kompaktni blok" },
    "team-spotlight": { title: "Fokus experta", description: "Velky profil a 4 mini karty" },
    "footer-compact": { title: "Kompaktni", description: "Logo a odkazy" },
    "footer-columns": { title: "Sloupce", description: "Navigace a kontakty" },
    "footer-cta": { title: "Footer s CTA", description: "Poptavka dole" },
    "footer-white": { title: "Bila paticka", description: "Svetly konec stranky" },
  },
  sk: {
    "header-clean": { title: "Cista navigacia", description: "Logo, menu a CTA" },
    "header-store": { title: "Obchod", description: "Hladanie, katalog a kosik" },
    "header-dark": { title: "Tmava hlavicka", description: "Cierna lista a akcent" },
    "header-pill": { title: "Zaoblena s okrajmi", description: "Lista s odstupom od stran" },
    "header-center": { title: "CentrovanГЎ", description: "Menu okolo znacky" },
    "hero-product": { title: "Produktovy hero", description: "Text, tlacidlo a ukazka" },
    "hero-editorial": { title: "Editorial", description: "Velky nadpis a fakty" },
    "hero-app": { title: "Nahlad app", description: "Promo aplikacie" },
    "hero-majestic": { title: "Start mesta", description: "Mesto, servery a start hry" },
    "hero-majestic-strip": { title: "Hover cards", description: "5-7 ciernobielych hover panelov" },
    "cards-services": { title: "Sluzby", description: "Tri karty s ikonami" },
    "cards-metrics": { title: "Metriky", description: "Cisla a kratke zavery" },
    "cards-process": { title: "Proces", description: "Kroky prace" },
    "form-compact": { title: "Login / registracia", description: "Login, heslo a ucet" },
    "form-split": { title: "Feedback klienta", description: "Recenzia, hodnotenie a kontakt" },
    "map-contact": { title: "Kontakty", description: "Mapa a adresa" },
    "map-points": { title: "Vydajne miesta", description: "Viac lokalit" },
    "catalog-grid": { title: "Mriezka + stranky", description: "3x2, karty a paginacia" },
    "catalog-feature": { title: "Mriezka + viac", description: "3x2 a nacitanie dalsich" },
    "pricing-classic": { title: "3 tarify", description: "Basic, Pro, Max" },
    "pricing-focus": { title: "Fokus Pro", description: "Tarify so zvyraznenim" },
    "reviews-row": { title: "Recenzie", description: "Citacie zakaznikov" },
    "reviews-highlight": { title: "Hlavna recenzia", description: "Jeden silny case" },
    "reviews-slider": { title: "Slider recenzii", description: "Foto, text a ovladanie" },
    "stats-line": { title: "Ciarovy graf", description: "Trend ako v Exceli" },
    "stats-bar": { title: "Stlpcovy graf", description: "Porovnanie v stlpcoch" },
    "stats-pie": { title: "Kolacovy graf", description: "Podiely a legenda" },
    "bg-scroll-gradient": { title: "Scroll gradient", description: "Farba sa meni pri scrollovani" },
    "bg-scroll-orbs": { title: "Rozmazane kruhy", description: "Makke plochy pri scrollovani" },
    "bg-edge-particles": { title: "Castice z okrajov", description: "Castice zo stran webu" },
    "bg-spark-stars": { title: "Ziarive hviezdy", description: "Body sa objavuju a miznu" },
    "bg-aurora-grid": { title: "Aurora mriezka", description: "Svetelna mriezka a hlbka" },
    "bg-spotlight-rings": { title: "Spotlight kruhy", description: "Kruhy a makke svetlo" },
    "faq-simple": { title: "Otazky", description: "Zoznam odpovedi" },
    "faq-split": { title: "FAQ + CTA", description: "Odpovede a tlacidlo" },
    "gallery-mosaic": { title: "Mozaika", description: "Mriezka obrazkov" },
    "gallery-slider": { title: "Slider", description: "Velky ramec a nahlady" },
    "team-cards": { title: "Tim", description: "Karty specialistov" },
    "team-line": { title: "Rad expertov", description: "Kompaktny blok" },
    "team-spotlight": { title: "Fokus experta", description: "Velky profil a 4 mini karty" },
    "footer-compact": { title: "Kompaktny", description: "Logo a odkazy" },
    "footer-columns": { title: "Stlpce", description: "Navigacia a kontakty" },
    "footer-cta": { title: "Footer s CTA", description: "Dopyt dole" },
    "footer-white": { title: "Biela paticka", description: "Svetly koniec stranky" },
  },
};

const builderDefaultTextEn: Record<string, string> = {
  "header.0": "Home",
  "header.1": "Catalog",
  "header.2": "Contacts",
  "header.3": "Start",
  "hero.0": "New launch",
  "hero.1": "A site that shows value instantly",
  "hero.2": "A short offer, clear next step, and visual accent.",
  "hero.3": "Leave a request",
  "hero.5": "Show the benefit, launch timing, and the action a client should take.",
  "hero.6": "Replace this line with your offer, campaign, service, or product launch.",
  "cards.0": "Speed",
  "cards.1": "A short card text with clear benefit.",
  "cards.2": "Trust",
  "cards.3": "A short card text with clear benefit.",
  "cards.4": "Growth",
  "cards.5": "A short card text with clear benefit.",
  "form.0": "Create an account",
  "form.1": "A clear login and registration form for personal accounts, stores, services, or closed sections.",
  "form.2": "Email or login",
  "form.3": "Password",
  "form.4": "Repeat password",
  "form.5": "I agree to the terms",
  "form.6": "Create account",
  "form.7": "Already have an account? Log in",
  "form.8": "Sign in",
  "form.9": "Sign up",
  "form.10": "Secure access",
  "form.20": "Share feedback",
  "form.21": "Collect a client review, rating, contact details, and a message after an order or project.",
  "form.22": "Client name",
  "form.23": "Email or phone",
  "form.24": "What did you like?",
  "form.25": "What can we improve?",
  "form.26": "Send feedback",
  "form.27": "Rating",
  "form.28": "Public review",
  "form.29": "Manager will reply",
  "map.0": "Where to find us",
  "map.1": "Show visitors the address, opening hours, pickup point, and a quick route.",
  "map.2": "12 Market Street",
  "map.3": "Mon-Fri, 10:00-19:00",
  "map.4": "Build route",
  "map.5": "Pickup points",
  "map.6": "Show several branches, pickup zones, workload, and a selected point.",
  "map.7": "Central branch",
  "map.8": "Open until 21:00",
  "map.9": "North pickup",
  "map.10": "12 orders ready",
  "map.11": "South warehouse",
  "map.12": "Courier dispatch",
  "catalog.0": "HIT",
  "catalog.1": "NovaBook Air 14",
  "catalog.2": "Light laptop for work, study, and travel with a bright IPS display.",
  "catalog.3": "14 inch IPS",
  "catalog.4": "16 GB RAM",
  "catalog.5": "512 GB SSD",
  "catalog.6": "$1,290",
  "catalog.7": "Add to cart",
  "catalog.8": "Details",
  "catalog.9": "Warranty, delivery terms, available colors, and package contents.",
  "catalog.10": "-15%",
  "catalog.11": "ClearSound Max",
  "catalog.12": "Wireless headphones with active noise cancellation and soft ear cushions.",
  "catalog.13": "ANC",
  "catalog.14": "Bluetooth 5.3",
  "catalog.15": "40 hours",
  "catalog.16": "$260",
  "catalog.17": "Add to cart",
  "catalog.18": "Details",
  "catalog.19": "Warranty, delivery terms, available colors, and package contents.",
  "catalog.20": "NEW",
  "catalog.21": "PixelWay S",
  "catalog.22": "Compact smartphone with a clean camera, fast charging, and a bright screen.",
  "catalog.23": "OLED 120 Hz",
  "catalog.24": "256 GB",
  "catalog.25": "50 MP",
  "catalog.26": "$780",
  "catalog.27": "Add to cart",
  "catalog.28": "Details",
  "catalog.29": "Warranty, delivery terms, available colors, and package contents.",
  "catalog.30": "PRO",
  "catalog.31": "Canon EOS Kit",
  "catalog.32": "Camera set for product photos, content, and studio shooting.",
  "catalog.33": "24 MP",
  "catalog.34": "Lens kit",
  "catalog.35": "4K video",
  "catalog.36": "$540",
  "catalog.37": "Add to cart",
  "catalog.38": "Details",
  "catalog.39": "Warranty, delivery terms, available colors, and package contents.",
  "catalog.40": "TOP",
  "catalog.41": "SmartWatch Pro",
  "catalog.42": "Smart watch with health tracking, calls, and long battery life.",
  "catalog.43": "GPS",
  "catalog.44": "AMOLED",
  "catalog.45": "7 days",
  "catalog.46": "$310",
  "catalog.47": "Add to cart",
  "catalog.48": "Details",
  "catalog.49": "Warranty, delivery terms, available colors, and package contents.",
  "catalog.50": "DESK",
  "catalog.51": "Slim Keyboard",
  "catalog.52": "Compact keyboard for a clean desk and quiet daily work.",
  "catalog.53": "Wireless",
  "catalog.54": "Aluminum",
  "catalog.55": "Quiet keys",
  "catalog.56": "$140",
  "catalog.57": "Add to cart",
  "catalog.58": "Details",
  "catalog.59": "Warranty, delivery terms, available colors, and package contents.",
  "pricing.0": "Choose a plan",
  "pricing.1": "Show the difference between plans clearly, with features inside each card.",
  "pricing.2": "Basic",
  "pricing.3": "19 $",
  "pricing.4": "per month",
  "pricing.5": "For a simple launch page and first requests.",
  "pricing.6": "1 page",
  "pricing.7": "Basic analytics",
  "pricing.8": "Email support",
  "pricing.9": "Pro",
  "pricing.10": "49 $",
  "pricing.11": "per month",
  "pricing.12": "For sales pages, subscriptions, and regular updates.",
  "pricing.13": "3 pages",
  "pricing.14": "CRM integration",
  "pricing.15": "Priority support",
  "pricing.16": "Max",
  "pricing.17": "99 $",
  "pricing.18": "per month",
  "pricing.19": "For catalogs, payments, automation, and scaling.",
  "pricing.20": "Catalog",
  "pricing.21": "Payments",
  "pricing.22": "Automation",
  "reviews.0": "Careful launch, clear structure, and strong visual design.",
  "reviews.1": "Client 1",
  "reviews.2": "Careful launch, clear structure, and strong visual design.",
  "reviews.3": "Client 2",
  "faq.0": "How long does launch take?",
  "faq.1": "Usually 5-10 business days after the content and structure are approved.",
  "faq.2": "Can blocks be changed?",
  "faq.3": "Yes. You can replace sections, add cards, update text, and upload your own images.",
  "faq.4": "What is included in the price?",
  "faq.5": "Design, layout, adaptive behavior, basic setup, and preparation for launch.",
  "gallery.0": "Project interior",
  "gallery.1": "Main visual zone with a caption and short context.",
  "gallery.2": "Details",
  "gallery.3": "Show product, place, process, or results.",
  "gallery.4": "Atmosphere",
  "gallery.5": "Add a short note so images are not just decoration.",
  "gallery.6": "Process",
  "gallery.7": "Show the work stage, team, or production moment.",
  "gallery.8": "Result",
  "gallery.9": "Add a short note about the final outcome.",
  "team.0": "Anna Morris",
  "team.1": "Designer",
  "team.2": "Shapes the visual system, interfaces, and clear user path.",
  "team.3": "Mark Stone",
  "team.4": "Frontend",
  "team.5": "Turns layouts into fast, responsive, and editable pages.",
  "team.6": "Maria White",
  "team.7": "Marketing",
  "team.8": "Keeps the offer, messages, and launch plan focused.",
  "marquee.0": "Free audit",
  "marquee.1": "Launch in 7 days",
  "marquee.2": "Mobile-ready",
  "marquee.3": "CRM and requests",
  "marquee.4": "Online payments",
  "marquee.5": "Support after launch",
  "progress.0": "Project metrics",
  "progress.1": "Show percentage progress, skills, delivery stages, or plan coverage.",
  "progress.2": "Design",
  "progress.3": "92%",
  "progress.4": "Layout",
  "progress.5": "76%",
  "progress.6": "Content",
  "progress.7": "64%",
  "progress.8": "Integrations",
  "progress.9": "48%",
  "stats.0": "Performance overview",
  "stats.1": "Show growth, requests, revenue, or channel split with editable values.",
  "stats.2": "28%",
  "stats.3": "January",
  "stats.5": "46%",
  "stats.6": "February",
  "stats.8": "38%",
  "stats.9": "March",
  "stats.11": "64%",
  "stats.12": "April",
  "footer.0": "Brand",
  "footer.1": "Navigation",
  "footer.2": "Contacts",
  "footer.3": "Contact us",
};

const buildLocalizedDefaults = (overrides: BuilderCopy): BuilderCopy => ({
  ...builderDefaultTextEn,
  ...overrides,
});

const builderDefaultTextByLang: Record<string, BuilderCopy> = {
  en: builderDefaultTextEn,
  de: buildLocalizedDefaults({
    "header.0": "Startseite",
    "header.1": "Katalog",
    "header.2": "Kontakte",
    "header.3": "Starten",
    "hero.0": "Neuer Launch",
    "hero.1": "Eine Website, die sofort Wert zeigt",
    "hero.2": "Kurzes Angebot, klarer nachster Schritt und visueller Akzent.",
    "hero.3": "Anfrage senden",
    "form.0": "Konto erstellen",
    "form.1": "Klare Login- und Registrierungsform fur Kundenkonten, Shops, Services oder geschlossene Bereiche.",
    "form.2": "E-Mail oder Login",
    "form.3": "Passwort",
    "form.4": "Passwort wiederholen",
    "form.5": "Ich akzeptiere die Bedingungen",
    "form.6": "Konto erstellen",
    "form.7": "Schon ein Konto? Einloggen",
    "form.8": "Einloggen",
    "form.9": "Registrieren",
    "form.10": "Sicherer Zugriff",
    "form.20": "Feedback geben",
    "form.21": "Sammeln Sie Kundenbewertung, Kontakt, offentliche Rezension und kurze Ruckmeldung nach Bestellung oder Projekt.",
    "form.22": "Kundenname",
    "form.23": "E-Mail oder Telefon",
    "form.24": "Was hat gefallen?",
    "form.25": "Was konnen wir verbessern?",
    "form.26": "Feedback senden",
    "form.27": "Kundenbewertung",
    "form.28": "Rezension veroffentlichen",
    "form.29": "Manager meldet sich",
    "map.0": "Wo Sie uns finden",
    "map.1": "Zeigen Sie Adresse, Offnungszeiten, Abholpunkt und schnelle Route.",
    "map.4": "Route bauen",
    "map.5": "Abholpunkte",
    "map.6": "Zeigen Sie Filialen, Abholzonen, Auslastung und den gewahlten Punkt.",
    "map.7": "Zentrale Filiale",
    "map.8": "Offen bis 21:00",
    "map.9": "Nord-Abholung",
    "map.10": "12 Bestellungen bereit",
    "map.11": "Sudlager",
    "map.12": "Kurier-Versand",
    "catalog.2": "Leichtes Notebook fur Arbeit, Studium und Reisen mit hellem IPS-Display.",
    "catalog.9": "Garantie, Lieferung, Farben und Lieferumfang.",
    "catalog.12": "Kabellose Kopfhorer mit aktiver Gerauschunterdruckung und weichen Polstern.",
    "catalog.19": "Garantie, Lieferung, Farben und Lieferumfang.",
    "catalog.22": "Kompaktes Smartphone mit sauberer Kamera, schnellem Laden und hellem Display.",
    "catalog.29": "Garantie, Lieferung, Farben und Lieferumfang.",
    "catalog.32": "Kamera-Set fur Produktfotos, Content und Studioaufnahmen.",
    "catalog.39": "Garantie, Lieferung, Farben und Lieferumfang.",
    "catalog.42": "Smartwatch mit Gesundheitsdaten, Anrufen und langer Akkulaufzeit.",
    "catalog.49": "Garantie, Lieferung, Farben und Lieferumfang.",
    "catalog.52": "Kompakte Tastatur fur ruhigen Schreibtisch und leise Arbeit.",
    "catalog.59": "Garantie, Lieferung, Farben und Lieferumfang.",
    "catalog.7": "In den Warenkorb",
    "catalog.17": "In den Warenkorb",
    "catalog.27": "In den Warenkorb",
    "catalog.37": "In den Warenkorb",
    "catalog.47": "In den Warenkorb",
    "catalog.57": "In den Warenkorb",
    "pricing.0": "Tarif wahlen",
    "pricing.1": "Zeigen Sie Preis, Zielgruppe und Leistungen in jeder Karte klar.",
    "faq.0": "Wie lange dauert der Launch?",
    "faq.1": "Normalerweise 5-10 Werktage nach Freigabe von Struktur und Content.",
    "footer.1": "Navigation",
    "footer.2": "Kontakte",
    "footer.3": "Kontakt aufnehmen",
  }),
  fr: buildLocalizedDefaults({
    "header.0": "Accueil",
    "header.1": "Catalogue",
    "header.2": "Contacts",
    "header.3": "Demarrer",
    "hero.0": "Nouveau lancement",
    "hero.1": "Un site qui montre la valeur tout de suite",
    "hero.2": "Offre courte, prochaine etape claire et accent visuel.",
    "hero.3": "Laisser une demande",
    "form.0": "Creer un compte",
    "form.1": "Formulaire clair de connexion et inscription pour comptes clients, boutiques, services ou espaces fermes.",
    "form.2": "Email ou login",
    "form.3": "Mot de passe",
    "form.4": "Repeter le mot de passe",
    "form.5": "J'accepte les conditions",
    "form.6": "Creer un compte",
    "form.7": "Deja un compte ? Connexion",
    "form.8": "Connexion",
    "form.9": "Inscription",
    "form.10": "Acces securise",
    "form.20": "Partager un avis",
    "form.21": "Collectez note client, contact, avis public et feedback court apres une commande ou un projet.",
    "form.22": "Nom du client",
    "form.23": "Email ou telephone",
    "form.24": "Qu'avez-vous aime ?",
    "form.25": "Que pouvons-nous ameliorer ?",
    "form.26": "Envoyer l'avis",
    "form.27": "Note client",
    "form.28": "Avis public",
    "form.29": "Un manager repondra",
    "map.0": "Ou nous trouver",
    "map.1": "Montrez l'adresse, les horaires, le point relais et un trajet rapide.",
    "map.4": "Creer l'itineraire",
    "map.5": "Points relais",
    "map.6": "Montrez plusieurs agences, zones de retrait, charge et point choisi.",
    "map.7": "Agence centrale",
    "map.8": "Ouvert jusqu'a 21:00",
    "map.9": "Relais nord",
    "map.10": "12 commandes pretes",
    "map.11": "Depot sud",
    "map.12": "Depart coursier",
    "catalog.2": "Ordinateur leger pour travail, etudes et voyages avec ecran IPS lumineux.",
    "catalog.9": "Garantie, livraison, couleurs disponibles et contenu du pack.",
    "catalog.12": "Casque sans fil avec reduction de bruit active et coussinets souples.",
    "catalog.19": "Garantie, livraison, couleurs disponibles et contenu du pack.",
    "catalog.22": "Smartphone compact avec camera nette, charge rapide et ecran lumineux.",
    "catalog.29": "Garantie, livraison, couleurs disponibles et contenu du pack.",
    "catalog.32": "Kit camera pour photos produit, contenu et studio.",
    "catalog.39": "Garantie, livraison, couleurs disponibles et contenu du pack.",
    "catalog.42": "Montre connectee avec sante, appels et longue autonomie.",
    "catalog.49": "Garantie, livraison, couleurs disponibles et contenu du pack.",
    "catalog.52": "Clavier compact pour bureau propre et travail silencieux.",
    "catalog.59": "Garantie, livraison, couleurs disponibles et contenu du pack.",
    "catalog.7": "Au panier",
    "catalog.17": "Au panier",
    "catalog.27": "Au panier",
    "catalog.37": "Au panier",
    "catalog.47": "Au panier",
    "catalog.57": "Au panier",
    "pricing.0": "Choisir une offre",
    "pricing.1": "Montrez clairement prix, cible et contenu de chaque offre.",
    "faq.0": "Combien dure le lancement ?",
    "faq.1": "En general 5-10 jours ouvrables apres validation de la structure et du contenu.",
    "footer.1": "Navigation",
    "footer.2": "Contacts",
    "footer.3": "Nous contacter",
  }),
  it: buildLocalizedDefaults({
    "header.0": "Home",
    "header.1": "Catalogo",
    "header.2": "Contatti",
    "header.3": "Inizia",
    "hero.0": "Nuovo lancio",
    "hero.1": "Un sito che mostra subito valore",
    "hero.2": "Offerta breve, prossimo passo chiaro e accento visivo.",
    "hero.3": "Lascia richiesta",
    "form.0": "Crea account",
    "form.1": "Form chiaro per login e registrazione di account, store, servizi o aree chiuse.",
    "form.2": "Email o login",
    "form.3": "Password",
    "form.4": "Ripeti password",
    "form.5": "Accetto le condizioni",
    "form.6": "Crea account",
    "form.7": "Hai gia un account? Accedi",
    "form.8": "Accedi",
    "form.9": "Registrati",
    "form.10": "Accesso sicuro",
    "form.20": "Lascia feedback",
    "form.21": "Raccogli recensione, voto, contatto e messaggio del cliente dopo ordine o progetto.",
    "form.22": "Nome cliente",
    "form.23": "Email o telefono",
    "form.24": "Cosa ti e piaciuto?",
    "form.25": "Cosa possiamo migliorare?",
    "form.26": "Invia feedback",
    "form.27": "Voto cliente",
    "form.28": "Recensione pubblica",
    "form.29": "Il manager rispondera",
    "map.0": "Dove trovarci",
    "map.1": "Mostra indirizzo, orari, punto ritiro e percorso rapido.",
    "map.4": "Crea percorso",
    "map.5": "Punti ritiro",
    "map.6": "Mostra sedi, zone ritiro, carico e punto selezionato.",
    "map.7": "Filiale centrale",
    "map.8": "Aperto fino alle 21:00",
    "map.9": "Ritiro nord",
    "map.10": "12 ordini pronti",
    "map.11": "Magazzino sud",
    "map.12": "Spedizione corriere",
    "catalog.2": "Notebook leggero per lavoro, studio e viaggi con display IPS luminoso.",
    "catalog.9": "Garanzia, consegna, colori disponibili e contenuto della confezione.",
    "catalog.12": "Cuffie wireless con cancellazione attiva del rumore e pad morbidi.",
    "catalog.19": "Garanzia, consegna, colori disponibili e contenuto della confezione.",
    "catalog.22": "Smartphone compatto con camera pulita, ricarica veloce e schermo luminoso.",
    "catalog.29": "Garanzia, consegna, colori disponibili e contenuto della confezione.",
    "catalog.32": "Kit camera per foto prodotto, contenuti e studio.",
    "catalog.39": "Garanzia, consegna, colori disponibili e contenuto della confezione.",
    "catalog.42": "Smartwatch con salute, chiamate e batteria lunga.",
    "catalog.49": "Garanzia, consegna, colori disponibili e contenuto della confezione.",
    "catalog.52": "Tastiera compatta per scrivania pulita e lavoro silenzioso.",
    "catalog.59": "Garanzia, consegna, colori disponibili e contenuto della confezione.",
    "catalog.7": "Nel carrello",
    "catalog.17": "Nel carrello",
    "catalog.27": "Nel carrello",
    "catalog.37": "Nel carrello",
    "catalog.47": "Nel carrello",
    "catalog.57": "Nel carrello",
    "pricing.0": "Scegli piano",
    "pricing.1": "Mostra chiaramente prezzo, pubblico e funzioni di ogni piano.",
    "faq.0": "Quanto dura il lancio?",
    "faq.1": "Di solito 5-10 giorni lavorativi dopo approvazione di struttura e contenuti.",
    "footer.1": "Navigazione",
    "footer.2": "Contatti",
    "footer.3": "Contattaci",
  }),
  pl: buildLocalizedDefaults({
    "header.0": "Glowna",
    "header.1": "Katalog",
    "header.2": "Kontakt",
    "header.3": "Start",
    "hero.0": "Nowy start",
    "hero.1": "Strona, ktora od razu pokazuje wartosc",
    "hero.2": "Krotka oferta, jasny nastepny krok i wizualny akcent.",
    "hero.3": "Zostaw zgloszenie",
    "form.0": "Utworz konto",
    "form.1": "Czytelny formularz logowania i rejestracji dla kont, sklepow, uslug lub zamknietych sekcji.",
    "form.2": "Email lub login",
    "form.3": "Haslo",
    "form.4": "Powtorz haslo",
    "form.5": "Akceptuje warunki",
    "form.6": "Utworz konto",
    "form.7": "Masz juz konto? Zaloguj sie",
    "form.8": "Logowanie",
    "form.9": "Rejestracja",
    "form.10": "Bezpieczny dostep",
    "form.20": "Dodaj opinie",
    "form.21": "Zbierz ocene klienta, kontakt, publiczna opinie i krotki feedback po zamowieniu lub projekcie.",
    "form.22": "Imie klienta",
    "form.23": "Email lub telefon",
    "form.24": "Co sie podobalo?",
    "form.25": "Co mozemy poprawic?",
    "form.26": "Wyslij opinie",
    "form.27": "Ocena klienta",
    "form.28": "Opinia publiczna",
    "form.29": "Manager odpowie",
    "map.0": "Gdzie nas znalezc",
    "map.1": "Pokaz adres, godziny pracy, punkt odbioru i szybka trase.",
    "map.4": "Zbuduj trase",
    "map.5": "Punkty odbioru",
    "map.6": "Pokaz oddzialy, strefy odbioru, obciazenie i wybrany punkt.",
    "map.7": "Oddzial centralny",
    "map.8": "Otwarte do 21:00",
    "map.9": "Odbior polnoc",
    "map.10": "12 zamowien gotowych",
    "map.11": "Magazyn poludnie",
    "map.12": "Wysylka kurierem",
    "catalog.2": "Lekki laptop do pracy, nauki i podrozy z jasnym ekranem IPS.",
    "catalog.9": "Gwarancja, dostawa, kolory i zawartosc zestawu.",
    "catalog.12": "Bezprzewodowe sluchawki z ANC i miekkimi nausznikami.",
    "catalog.19": "Gwarancja, dostawa, kolory i zawartosc zestawu.",
    "catalog.22": "Kompaktowy smartfon z dobra kamera, szybkim ladowaniem i jasnym ekranem.",
    "catalog.29": "Gwarancja, dostawa, kolory i zawartosc zestawu.",
    "catalog.32": "Zestaw aparatu do zdjec produktow, contentu i studia.",
    "catalog.39": "Gwarancja, dostawa, kolory i zawartosc zestawu.",
    "catalog.42": "Smartwatch ze zdrowiem, rozmowami i dlugim czasem pracy.",
    "catalog.49": "Gwarancja, dostawa, kolory i zawartosc zestawu.",
    "catalog.52": "Kompaktowa klawiatura do czystego biurka i cichej pracy.",
    "catalog.59": "Gwarancja, dostawa, kolory i zawartosc zestawu.",
    "catalog.7": "Do koszyka",
    "catalog.17": "Do koszyka",
    "catalog.27": "Do koszyka",
    "catalog.37": "Do koszyka",
    "catalog.47": "Do koszyka",
    "catalog.57": "Do koszyka",
    "pricing.0": "Wybierz plan",
    "pricing.1": "Pokaz jasno cene, odbiorce i zawartosc kazdego pakietu.",
    "faq.0": "Ile trwa start?",
    "faq.1": "Zwykle 5-10 dni roboczych po zatwierdzeniu struktury i tresci.",
    "footer.1": "Nawigacja",
    "footer.2": "Kontakt",
    "footer.3": "Skontaktuj sie",
  }),
  cz: buildLocalizedDefaults({
    "header.0": "Domu",
    "header.1": "Katalog",
    "header.2": "Kontakt",
    "header.3": "Start",
    "hero.0": "Novy start",
    "hero.1": "Web, ktery hned ukaze hodnotu",
    "hero.2": "Kratka nabidka, jasny dalsi krok a vizualni akcent.",
    "hero.3": "Odeslat poptavku",
    "form.0": "Vytvorit ucet",
    "form.1": "Jasny formular prihlaseni a registrace pro ucty, obchody, sluzby nebo uzavrene sekce.",
    "form.2": "E-mail nebo login",
    "form.3": "Heslo",
    "form.4": "Zopakujte heslo",
    "form.5": "Souhlasim s podminkami",
    "form.6": "Vytvorit ucet",
    "form.7": "Uz mate ucet? Prihlasit",
    "form.8": "Prihlaseni",
    "form.9": "Registrace",
    "form.10": "Bezpecny pristup",
    "form.20": "Sdilet feedback",
    "form.21": "Sbirejte hodnoceni klienta, kontakt, verejnou recenzi a kratkou zpetnou vazbu po objednavce nebo projektu.",
    "form.22": "Jmeno klienta",
    "form.23": "E-mail nebo telefon",
    "form.24": "Co se libilo?",
    "form.25": "Co muzeme zlepsit?",
    "form.26": "Odeslat feedback",
    "form.27": "Hodnoceni klienta",
    "form.28": "Verejna recenze",
    "form.29": "Manager odpovi",
    "map.0": "Kde nas najdete",
    "map.1": "Ukazte adresu, oteviraci dobu, vydejni misto a rychlou trasu.",
    "map.4": "Vytvorit trasu",
    "map.5": "Vydejni mista",
    "map.6": "Ukazte pobocky, vydejni zony, vytizeni a vybrany bod.",
    "map.7": "Centralni pobocka",
    "map.8": "Otevreno do 21:00",
    "map.9": "Severni vydej",
    "map.10": "12 objednavek pripraveno",
    "map.11": "Jizni sklad",
    "map.12": "Kuryri odesilani",
    "catalog.2": "Lehky notebook pro praci, studium a cesty s jasnym IPS displejem.",
    "catalog.9": "Zaruka, doruceni, dostupne barvy a obsah baleni.",
    "catalog.12": "Bezdratova sluchatka s aktivnim potlacenim hluku a mekkymi nausniky.",
    "catalog.19": "Zaruka, doruceni, dostupne barvy a obsah baleni.",
    "catalog.22": "Kompaktni smartphone s cistou kamerou, rychlym nabijenim a jasnym displejem.",
    "catalog.29": "Zaruka, doruceni, dostupne barvy a obsah baleni.",
    "catalog.32": "Sada fotoaparatu pro produktove fotky, obsah a studio.",
    "catalog.39": "Zaruka, doruceni, dostupne barvy a obsah baleni.",
    "catalog.42": "Chytre hodinky se zdravim, hovory a dlouhou vydrzi.",
    "catalog.49": "Zaruka, doruceni, dostupne barvy a obsah baleni.",
    "catalog.52": "Kompaktni klavesnice pro cisty stul a tichou praci.",
    "catalog.59": "Zaruka, doruceni, dostupne barvy a obsah baleni.",
    "catalog.7": "Do kosiku",
    "catalog.17": "Do kosiku",
    "catalog.27": "Do kosiku",
    "catalog.37": "Do kosiku",
    "catalog.47": "Do kosiku",
    "catalog.57": "Do kosiku",
    "pricing.0": "Vybrat tarif",
    "pricing.1": "Ukazte jasne cenu, cil a obsah kazdeho tarifu.",
    "faq.0": "Jak dlouho trva spusteni?",
    "faq.1": "Obvykle 5-10 pracovnich dni po schvaleni struktury a obsahu.",
    "footer.1": "Navigace",
    "footer.2": "Kontakt",
    "footer.3": "Kontaktovat",
  }),
  sk: buildLocalizedDefaults({
    "header.0": "Domov",
    "header.1": "Katalog",
    "header.2": "Kontakt",
    "header.3": "Start",
    "hero.0": "Novy start",
    "hero.1": "Web, ktory hned ukaze hodnotu",
    "hero.2": "Kratka ponuka, jasny dalsi krok a vizualny akcent.",
    "hero.3": "Odoslat dopyt",
    "form.0": "Vytvorit ucet",
    "form.1": "Jasny formular prihlasenia a registracie pre ucty, obchody, sluzby alebo uzavrete sekcie.",
    "form.2": "E-mail alebo login",
    "form.3": "Heslo",
    "form.4": "Zopakujte heslo",
    "form.5": "Suhlasim s podmienkami",
    "form.6": "Vytvorit ucet",
    "form.7": "Uz mate ucet? Prihlasit",
    "form.8": "Prihlasenie",
    "form.9": "Registracia",
    "form.10": "Bezpecny pristup",
    "form.20": "Zdielat feedback",
    "form.21": "Zbierajte hodnotenie klienta, kontakt, verejnu recenziu a kratku spatnu vazbu po objednavke alebo projekte.",
    "form.22": "Meno klienta",
    "form.23": "E-mail alebo telefon",
    "form.24": "Co sa pacilo?",
    "form.25": "Co mozeme zlepsit?",
    "form.26": "Odoslat feedback",
    "form.27": "Hodnotenie klienta",
    "form.28": "Verejna recenzia",
    "form.29": "Manager odpovie",
    "map.0": "Kde nas najdete",
    "map.1": "Ukazte adresu, otvaracie hodiny, vyzdvihnutie a rychlu trasu.",
    "map.4": "Vytvorit trasu",
    "map.5": "Vyzdvihnutia",
    "map.6": "Ukazte pobocky, vyzdvihovacie zony, vytazenie a vybrany bod.",
    "map.7": "Centralna pobocka",
    "map.8": "Otvorene do 21:00",
    "map.9": "Severne miesto",
    "map.10": "12 objednavok pripravenych",
    "map.11": "Juzny sklad",
    "map.12": "Kurierske odoslanie",
    "catalog.2": "Lahky notebook na pracu, studium a cesty s jasnym IPS displejom.",
    "catalog.9": "Zaruka, dorucenie, dostupne farby a obsah balenia.",
    "catalog.12": "Bezdratove sluchadla s aktivnym potlacenim hluku a makkkymi nausnikmi.",
    "catalog.19": "Zaruka, dorucenie, dostupne farby a obsah balenia.",
    "catalog.22": "Kompaktny smartfon s cistou kamerou, rychlym nabijanim a jasnym displejom.",
    "catalog.29": "Zaruka, dorucenie, dostupne farby a obsah balenia.",
    "catalog.32": "Sada fotoaparatu pre produktove fotky, obsah a studio.",
    "catalog.39": "Zaruka, dorucenie, dostupne farby a obsah balenia.",
    "catalog.42": "Chytre hodinky so zdravim, hovormi a dlhou vydrzou.",
    "catalog.49": "Zaruka, dorucenie, dostupne farby a obsah balenia.",
    "catalog.52": "Kompaktna klavesnica pre cisty stol a tichu pracu.",
    "catalog.59": "Zaruka, dorucenie, dostupne farby a obsah balenia.",
    "catalog.7": "Do kosika",
    "catalog.17": "Do kosika",
    "catalog.27": "Do kosika",
    "catalog.37": "Do kosika",
    "catalog.47": "Do kosika",
    "catalog.57": "Do kosika",
    "pricing.0": "Vybrat tarif",
    "pricing.1": "Ukazte jasne cenu, ciel a obsah kazdeho tarifu.",
    "faq.0": "Ako dlho trva spustenie?",
    "faq.1": "Obvykle 5-10 pracovnych dni po schvaleni struktury a obsahu.",
    "footer.1": "Navigacia",
    "footer.2": "Kontakt",
    "footer.3": "Kontaktovat",
  }),
};

const getBuilderText = (copy: BuilderCopy, key: string, params?: Record<string, string | number>) => {
  const template = copy[key] ?? builderPageTranslations.en[key] ?? builderPageTranslations.ru[key] ?? key;
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, name: string) => String(params[name] ?? `{${name}}`));
};

const serializeCanvasItems = (items: CanvasItem[]) => JSON.stringify(items);
const cloneCanvasItems = (items: CanvasItem[]) => JSON.parse(JSON.stringify(items)) as CanvasItem[];
const canvasBlockIdPrefix = "builder-section-";

const getCanvasBlockId = (element: Element | null) => {
  const blockElement = element?.closest<HTMLElement>(".builder-block-preview");
  if (!blockElement?.id.startsWith(canvasBlockIdPrefix)) return null;
  return blockElement.id.slice(canvasBlockIdPrefix.length);
};

const isEditorTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
};

const isBuilderStaticTarget = (target: EventTarget | null) => {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest("button, a, input, textarea, select, [contenteditable='true'], [data-builder-static='true'], .builder-block-settings"));
};

export default function SiteBuilderPage() {
  const { lang, currentTheme } = useThemeLang();
  const themeColors = useMemo(() => getBuilderColorsFromTheme(currentTheme.vars), [currentTheme]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isBuilderSettingsOpen, setIsBuilderSettingsOpen] = useState(false);
  const [catalogSections, setCatalogSections] = useState<BlockSection[]>(blockSections);
  const [canvasItems, setCanvasItems] = useState<CanvasItem[]>(readSavedCanvasItems);
  const [activeDropIndex, setActiveDropIndex] = useState<number | null>(null);
  const [activeSideDrop, setActiveSideDrop] = useState<string | null>(null);
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);
  const [draggedCanvasId, setDraggedCanvasId] = useState<string | null>(null);
  const [colors, setColors] = useState<BuilderColors>(() => themeColors);
  const [builderFonts, setBuilderFonts] = useState<BuilderFonts>(readSavedBuilderFonts);
  const [removingIds, setRemovingIds] = useState<Set<string>>(() => new Set());
  const [displayedPrice, setDisplayedPrice] = useState(0);
  const [effectsHeight, setEffectsHeight] = useState(0);
  const [isBuilderStateReady, setIsBuilderStateReady] = useState(false);
  const [hoveredCanvasItemId, setHoveredCanvasItemId] = useState<string | null>(null);
  const [selectedCanvasItemId, setSelectedCanvasItemId] = useState<string | null>(null);
  const [selectedRepeatableItem, setSelectedRepeatableItem] = useState<{ instanceId: string; index: number } | null>(null);
  const previousPriceRef = useRef(0);
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const builderSettingsRef = useRef<HTMLDivElement | null>(null);
  const selectedRepeatableElementRef = useRef<HTMLElement | null>(null);
  const canvasHistoryRef = useRef<{ past: CanvasItem[][]; future: CanvasItem[][]; applying: boolean; last: string }>({
    past: [],
    future: [],
    applying: false,
    last: "",
  });
  const activeAllBlocks = useMemo(() => catalogSections.flatMap((section) => section.blocks), [catalogSections]);
  const activeBlockById = useMemo(() => new Map(activeAllBlocks.map((block) => [block.id, block])), [activeAllBlocks]);

  const draggedCanvasItem = draggedCanvasId ? canvasItems.find((item) => item.instanceId === draggedCanvasId) : undefined;
  const draggedBlock = draggedBlockId ? activeBlockById.get(draggedBlockId) : draggedCanvasItem ? activeBlockById.get(draggedCanvasItem.blockId) : undefined;
  const builderCopy = useMemo(() => builderPageTranslations[lang] ?? builderPageTranslations.en, [lang]);
  const defaultTexts = useMemo(() => (lang === "ru" ? {} : builderDefaultTextByLang[lang] ?? builderDefaultTextEn), [lang]);
  const bt = (key: string, params?: Record<string, string | number>) => getBuilderText(builderCopy, key, params);
  const getSectionLabel = (type: BlockType) => bt(`builder.section.${type}`);
  const getBlockCopy = (block: BuilderBlock) =>
    lang === "ru" ? block : builderBlockCopyByLang[lang]?.[block.id] ?? builderBlockCopy[block.id] ?? block;
  const getNavLabel = (item: CanvasItem, block: BuilderBlock) => {
    if (block.type === "form" && block.variant === "split") return "Отзывы";
    return item.text.label || getSectionLabel(block.type);
  };
  const pageLinks = useMemo<PageLink[]>(
    () =>
      canvasItems
        .map((item) => {
          const block = activeBlockById.get(item.blockId);
          if (!block || block.type === "header" || block.type === "footer" || block.type === "background") return null;
          if (block.type === "form" && block.variant === "compact") return null;

          return {
            instanceId: item.instanceId,
            label: getNavLabel(item, block),
          };
        })
        .filter((item): item is PageLink => Boolean(item)),
    [builderCopy, canvasItems]
  );
  const headerCtaLink = useMemo<PageLink | null>(() => {
    const authItem = canvasItems.find((item) => {
      const block = activeBlockById.get(item.blockId);
      return block?.type === "form" && block.variant === "compact";
    });

    if (authItem) return { instanceId: authItem.instanceId, label: "Авторизация" };

    const lastContentItem = [...canvasItems].reverse().find((item) => {
      const block = activeBlockById.get(item.blockId);
      return block && block.type !== "header" && block.type !== "footer" && block.type !== "background";
    });

    if (!lastContentItem) return null;

    const block = activeBlockById.get(lastContentItem.blockId);
    if (!block) return null;

    return { instanceId: lastContentItem.instanceId, label: getNavLabel(lastContentItem, block) };
  }, [builderCopy, canvasItems]);
  const cartProducts = useMemo<CartProduct[]>(() => {
    const catalogItem = canvasItems.find((item) => activeBlockById.get(item.blockId)?.type === "catalog");
    if (!catalogItem) return [];

    const sourceIndices = getRepeatableSourceIndices(catalogItem, "catalog");
    const fallbackNames = ["NovaBook Air 14", "ClearSound Max", "PixelWay S", "Canon EOS Kit", "SmartWatch Pro", "Slim Keyboard"];
    const fallbackPrices = ["$1,290", "$260", "$780", "$540", "$310", "$140"];

    return sourceIndices.map((sourceIndex) => ({
      name: catalogItem.text[`auto-text.${sourceIndex * 10 + 1}`] || defaultTexts[`catalog.${sourceIndex * 10 + 1}`] || fallbackNames[sourceIndex] || `Товар ${sourceIndex + 1}`,
      price: catalogItem.text[`auto-text.${sourceIndex * 10 + 6}`] || defaultTexts[`catalog.${sourceIndex * 10 + 6}`] || fallbackPrices[sourceIndex] || "$190",
    }));
  }, [canvasItems, defaultTexts]);
  const totalPrice = useMemo(
    () => canvasItems.reduce((sum, item) => sum + getCanvasItemPrice(item, activeBlockById), 0),
    [activeBlockById, canvasItems]
  );
  const activeBackgroundItem = useMemo(
    () => canvasItems.find((item) => activeBlockById.get(item.blockId)?.type === "background"),
    [canvasItems]
  );
  const activeBackgroundBlock = activeBackgroundItem ? activeBlockById.get(activeBackgroundItem.blockId) : undefined;
  const surfaceLuminance = getRelativeLuminance(colors.surface);
  const isDarkSurface = surfaceLuminance !== null && surfaceLuminance < 0.24;

  const canvasStyle = {
    "--builder-primary": colors.primary,
    "--builder-accent": colors.accent,
    "--builder-surface": colors.surface,
    "--builder-text": colors.text,
    "--builder-dark-block-bg": isDarkSurface
      ? "color-mix(in srgb, var(--builder-surface) 4%, #ffffff)"
      : "color-mix(in srgb, var(--builder-text) 94%, #000000)",
    "--builder-dark-block-bg-strong": isDarkSurface
      ? "#ffffff"
      : "color-mix(in srgb, var(--builder-text) 98%, #000000)",
    "--builder-dark-block-text": isDarkSurface ? "#111827" : "#ffffff",
    "--builder-dark-block-muted": isDarkSurface
      ? "color-mix(in srgb, #111827 68%, transparent)"
      : "color-mix(in srgb, #ffffff 68%, transparent)",
    "--builder-dark-block-border": isDarkSurface
      ? "color-mix(in srgb, #111827 13%, transparent)"
      : "color-mix(in srgb, #ffffff 12%, transparent)",
    "--builder-effects-height": `${Math.max(effectsHeight, 1)}px`,
    "--builder-effect-surface-mix": "50%",
    "--builder-heading-font": builderFonts.heading,
    "--builder-body-font": builderFonts.body,
    "--builder-ui-font": builderFonts.ui,
  } as CSSProperties;

  useEffect(() => {
    const serialized = serializeCanvasItems(canvasItems);
    const history = canvasHistoryRef.current;

    if (!history.last) {
      history.last = serialized;
      return;
    }

    if (history.applying) {
      history.last = serialized;
      history.applying = false;
      return;
    }

    if (serialized === history.last) return;

    history.past.push(cloneCanvasItems(JSON.parse(history.last) as CanvasItem[]));
    if (history.past.length > 80) history.past.shift();
    history.future = [];
    history.last = serialized;
  }, [canvasItems]);

  const restoreCanvasHistory = useCallback((direction: "undo" | "redo") => {
    const history = canvasHistoryRef.current;
    const currentSnapshot = cloneCanvasItems(canvasItems);

    if (direction === "undo") {
      const previous = history.past.pop();
      if (!previous) return;
      history.future.unshift(currentSnapshot);
      history.applying = true;
      history.last = serializeCanvasItems(previous);
      setCanvasItems(previous);
      setSelectedCanvasItemId(null);
      setSelectedRepeatableItem(null);
      selectedRepeatableElementRef.current = null;
      return;
    }

    const next = history.future.shift();
    if (!next) return;
    history.past.push(currentSnapshot);
    history.applying = true;
    history.last = serializeCanvasItems(next);
    setCanvasItems(next);
    setSelectedCanvasItemId(null);
    setSelectedRepeatableItem(null);
    selectedRepeatableElementRef.current = null;
  }, [canvasItems]);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/builder/catalog")
      .then((response) => {
        if (!response.ok) throw new Error(`Builder catalog failed: ${response.status}`);
        return response.json() as Promise<BuilderCatalogResponse>;
      })
      .then((payload) => {
        if (!isMounted) return;
        setCatalogSections(resolveBlockSections(payload.blockSections));
      })
      .catch(() => {
        if (isMounted) setCatalogSections(blockSections);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetch("/api/builder/state/default")
      .then((response) => {
        if (!response.ok) throw new Error(`Builder state failed: ${response.status}`);
        return response.json() as Promise<BuilderStateResponse>;
      })
      .then((data) => {
        if (!isMounted || !data.payload) return;
        const savedItems = data.payload.canvasItems;
        const savedColors = normalizeBuilderColors(data.payload.colors);
        const savedFonts = normalizeBuilderFonts(data.payload.builderFonts);

        if (Array.isArray(savedItems)) {
          setCanvasItems(
            normalizeCanvasRows(
              savedItems
                .filter((item): item is CanvasItem =>
                  Boolean(
                    item &&
                      typeof item.instanceId === "string" &&
                      typeof item.blockId === "string" &&
                      blockById.has(item.blockId)
                  )
                )
                .map((item) => ({
                  instanceId: item.instanceId,
                  blockId: item.blockId,
                  text: item.text && typeof item.text === "object" ? item.text : {},
                  media: item.media && typeof item.media === "object" ? item.media : {},
                  options: item.options && typeof item.options === "object" ? item.options : undefined,
                  layout: item.layout === "half" ? "half" : "full",
                }))
            )
          );
        }

        if (savedColors) setColors(savedColors);
        if (savedFonts) setBuilderFonts(savedFonts);
      })
      .catch(() => undefined)
      .finally(() => {
        if (isMounted) setIsBuilderStateReady(true);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setColors(themeColors);
  }, [themeColors]);

  useEffect(() => {
    setCanvasItems((current) => normalizeCanvasRows(current.filter((item) => activeBlockById.has(item.blockId))));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(builderCanvasStorageKey, JSON.stringify(canvasItems));
  }, [canvasItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(builderFontsStorageKey, JSON.stringify(builderFonts));
  }, [builderFonts]);

  useEffect(() => {
    if (!isBuilderStateReady || typeof window === "undefined") return;

    const timeoutId = window.setTimeout(() => {
      fetch("/api/builder/state/default", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payload: {
            canvasItems,
            colors,
            builderFonts,
          },
        }),
      }).catch(() => undefined);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [builderFonts, canvasItems, colors, isBuilderStateReady]);

  useEffect(() => {
    if (isSidebarCollapsed) setIsBuilderSettingsOpen(false);
  }, [isSidebarCollapsed]);

  useEffect(() => {
    if (!isBuilderSettingsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (builderSettingsRef.current?.contains(target)) return;
      if (target.closest(".site-builder__settings-toggle")) return;
      setIsBuilderSettingsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isBuilderSettingsOpen]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !activeBackgroundBlock) {
      setEffectsHeight(0);
      return undefined;
    }

    let animationFrame = 0;
    const getContentHeight = () => {
      const contentNodes = Array.from(canvas.children).filter((child) =>
        child.matches(".builder-block-preview, .site-builder__canvas-row, .site-builder__drop-zone")
      );

      return contentNodes.reduce((height, child) => {
        if (!(child instanceof HTMLElement)) return height;
        return Math.max(height, child.offsetTop + child.offsetHeight);
      }, canvas.clientHeight);
    };

    const syncEffectsHeight = () => {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        const nextHeight = Math.ceil(getContentHeight());
        setEffectsHeight((current) => (current === nextHeight ? current : nextHeight));
      });
    };

    syncEffectsHeight();

    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncEffectsHeight) : null;
    resizeObserver?.observe(canvas);

    const mutationObserver = new MutationObserver(syncEffectsHeight);
    mutationObserver.observe(canvas, { childList: true, subtree: true, attributes: true });

    canvas.addEventListener("scroll", syncEffectsHeight, { passive: true });
    window.addEventListener("resize", syncEffectsHeight);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver?.disconnect();
      mutationObserver.disconnect();
      canvas.removeEventListener("scroll", syncEffectsHeight);
      window.removeEventListener("resize", syncEffectsHeight);
    };
  }, [activeBackgroundBlock?.variant, canvasItems.length]);

  useEffect(() => {
    const startValue = previousPriceRef.current;
    const difference = totalPrice - startValue;
    const duration = 520;
    let animationFrame = 0;
    let startTime = 0;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedPrice(Math.round(startValue + difference * eased));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        previousPriceRef.current = totalPrice;
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [totalPrice]);

  const insertBlock = (block: BuilderBlock, index: number, layout: CanvasItem["layout"] = "full") => {
    setCanvasItems((current) => {
      let insertIndex = Math.min(index, current.length);
      let nextItems = current;

      if (block.singleton) {
        const removedBeforeIndex = current
          .slice(0, insertIndex)
          .filter((item) => activeBlockById.get(item.blockId)?.type === block.type).length;
        nextItems = current.filter((item) => activeBlockById.get(item.blockId)?.type !== block.type);
        insertIndex -= removedBeforeIndex;
      }

      if (block.type === "header") insertIndex = 0;
      if (block.type === "footer") insertIndex = nextItems.length;
      if (block.type === "background") insertIndex = nextItems.length;

      const nextItem = createCanvasItem(block, layout);
      return normalizeCanvasRows([...nextItems.slice(0, insertIndex), nextItem, ...nextItems.slice(insertIndex)]);
    });
  };

  const moveCanvasItem = (instanceId: string, index: number, layout: CanvasItem["layout"] = "full") => {
    setCanvasItems((current) => {
      const currentIndex = current.findIndex((item) => item.instanceId === instanceId);
      if (currentIndex < 0) return current;

      const movingItem = { ...current[currentIndex], layout };
      const movingBlock = activeBlockById.get(movingItem.blockId);
      const withoutMoving = current.filter((item) => item.instanceId !== instanceId);
      let insertIndex = Math.min(currentIndex < index ? index - 1 : index, withoutMoving.length);

      if (movingBlock?.type === "header") insertIndex = 0;
      if (movingBlock?.type === "footer") insertIndex = withoutMoving.length;
      if (movingBlock?.type === "background") insertIndex = withoutMoving.length;

      return normalizeCanvasRows([
        ...withoutMoving.slice(0, insertIndex),
        movingItem,
        ...withoutMoving.slice(insertIndex),
      ]);
    });
  };

  const placeBesideCanvasItem = (targetInstanceId: string, side: CanvasSide, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const sourceInstanceId = event.dataTransfer.getData("application/x-builder-instance") || draggedCanvasId;
    const sourceBlockId = event.dataTransfer.getData("application/x-builder-block") || event.dataTransfer.getData("text/plain") || draggedBlockId;

    setCanvasItems((current) => {
      const sourceFromCanvas = sourceInstanceId
        ? current.find((item) => item.instanceId === sourceInstanceId)
        : undefined;
      const sourceBlock = sourceFromCanvas
        ? activeBlockById.get(sourceFromCanvas.blockId)
        : sourceBlockId
          ? activeBlockById.get(sourceBlockId)
          : undefined;

      if (!sourceBlock || sourceInstanceId === targetInstanceId) return current;

      let nextItems = sourceFromCanvas
        ? current.filter((item) => item.instanceId !== sourceInstanceId)
        : current;

      if (!sourceFromCanvas && sourceBlock.singleton) {
        nextItems = nextItems.filter((item) => activeBlockById.get(item.blockId)?.type !== sourceBlock.type);
      }

      const targetIndex = nextItems.findIndex((item) => item.instanceId === targetInstanceId);
      const targetItem = nextItems[targetIndex];
      const targetBlock = targetItem ? activeBlockById.get(targetItem.blockId) : undefined;

      if (!targetItem || !targetBlock) return current;

      const sourceItem = sourceFromCanvas
        ? { ...sourceFromCanvas, layout: "half" as const }
        : createCanvasItem(sourceBlock, "half");

      if (!canShareCanvasRow(targetBlock) || !canShareCanvasRow(sourceBlock)) {
        const insertIndex = side === "left" ? targetIndex : targetIndex + 1;
        return normalizeCanvasRows([
          ...nextItems.slice(0, insertIndex),
          { ...sourceItem, layout: "full" },
          ...nextItems.slice(insertIndex),
        ]);
      }

      const detachedItems = nextItems.map((item, index) => {
        const isTargetPairNeighbor =
          item.layout === "half" &&
          ((index === targetIndex - 1 && targetItem.layout === "half") ||
            (index === targetIndex + 1 && targetItem.layout === "half"));

        if (item.instanceId === targetInstanceId) return { ...item, layout: "half" as const };
        if (isTargetPairNeighbor) return { ...item, layout: "full" as const };
        return item;
      });

      const insertIndex = side === "left" ? targetIndex : targetIndex + 1;

      return normalizeCanvasRows([
        ...detachedItems.slice(0, insertIndex),
        sourceItem,
        ...detachedItems.slice(insertIndex),
      ]);
    });

    resetDragState();
  };

  const placeStackCanvasItem = (targetInstanceId: string, position: CanvasStackPosition, event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const sourceInstanceId = event.dataTransfer.getData("application/x-builder-instance") || draggedCanvasId;
    const sourceBlockId = event.dataTransfer.getData("application/x-builder-block") || event.dataTransfer.getData("text/plain") || draggedBlockId;
    const targetIndex = canvasItems.findIndex((item) => item.instanceId === targetInstanceId);

    if (targetIndex < 0 || sourceInstanceId === targetInstanceId) {
      resetDragState();
      return;
    }

    const previousItem = canvasItems[targetIndex - 1];
    const targetItem = canvasItems[targetIndex];
    const nextItem = canvasItems[targetIndex + 1];
    const isLeftSideOfSplit =
      targetItem.layout === "half" &&
      nextItem?.layout === "half" &&
      canShareCanvasItem(targetItem) &&
      canShareCanvasItem(nextItem);
    const isRightSideOfSplit =
      targetItem.layout === "half" &&
      previousItem?.layout === "half" &&
      canShareCanvasItem(previousItem) &&
      canShareCanvasItem(targetItem);
    const splitStartIndex = isRightSideOfSplit ? targetIndex - 1 : targetIndex;
    const splitEndIndex = isLeftSideOfSplit ? targetIndex + 1 : targetIndex;
    const insertIndex = position === "before" ? splitStartIndex : splitEndIndex + 1;

    if (sourceInstanceId) {
      moveCanvasItem(sourceInstanceId, insertIndex, "full");
      resetDragState();
      return;
    }

    const block = sourceBlockId ? activeBlockById.get(sourceBlockId) : undefined;
    if (block) insertBlock(block, insertIndex, "full");
    resetDragState();
  };

  const handlePaletteDragStart = (event: DragEvent<HTMLElement>, block: BuilderBlock) => {
    event.dataTransfer.effectAllowed = "copyMove";
    event.dataTransfer.setData("application/x-builder-block", block.id);
    event.dataTransfer.setData("text/plain", block.id);
    setDraggedBlockId(block.id);
  };

  const resetDragState = () => {
    setActiveDropIndex(null);
    setActiveSideDrop(null);
    setDraggedBlockId(null);
    setDraggedCanvasId(null);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault();
    const blockId = event.dataTransfer.getData("application/x-builder-block") || event.dataTransfer.getData("text/plain") || draggedBlockId;
    const instanceId = event.dataTransfer.getData("application/x-builder-instance") || draggedCanvasId;
    if (instanceId) {
      moveCanvasItem(instanceId, index, "full");
      resetDragState();
      return;
    }
    const block = blockId ? activeBlockById.get(blockId) : undefined;

    if (!block) {
      resetDragState();
      return;
    }

    insertBlock(block, index);
    resetDragState();
  };

  const handleCanvasDragStart = (event: DragEvent<HTMLElement>, item: CanvasItem) => {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("application/x-builder-instance", item.instanceId);
    event.dataTransfer.setData("text/plain", item.blockId);
    setDraggedCanvasId(item.instanceId);
    setDraggedBlockId(null);
  };

  const removeItem = (instanceId: string) => {
    setRemovingIds((current) => new Set(current).add(instanceId));
    window.setTimeout(() => {
      setCanvasItems((current) => normalizeCanvasRows(current.filter((item) => item.instanceId !== instanceId)));
      setRemovingIds((current) => {
        const next = new Set(current);
        next.delete(instanceId);
        return next;
      });
    }, 280);
  };

  const removeRepeatableItem = (instanceId: string, visibleIndex: number) => {
    const targetItem = canvasItems.find((item) => item.instanceId === instanceId);
    const targetBlock = targetItem ? activeBlockById.get(targetItem.blockId) : undefined;

    if (!targetItem || !targetBlock || !repeatableBlockDefaults[targetBlock.type]) return;

    const currentCount = getCanvasItemCount(targetItem, targetBlock.type);
    if (currentCount <= 1) {
      removeItem(instanceId);
      return;
    }

    setCanvasItems((current) =>
      current.map((item) => {
        if (item.instanceId !== instanceId) return item;

        const order = getRepeatableSourceIndices(item, targetBlock.type);
        const nextOrder = order.filter((_, index) => index !== visibleIndex);

        return {
          ...item,
          options: setRepeatableOrderOptions(item.options, nextOrder),
        };
      })
    );
  };

  const deleteSelectedRepeatableItem = useCallback(() => {
    if (!selectedRepeatableItem) return false;

    const targetItem = canvasItems.find((item) => item.instanceId === selectedRepeatableItem.instanceId);
    const targetBlock = targetItem ? activeBlockById.get(targetItem.blockId) : undefined;

    if (!targetItem || !targetBlock || !repeatableBlockDefaults[targetBlock.type]) {
      setSelectedRepeatableItem(null);
      selectedRepeatableElementRef.current = null;
      return false;
    }

    const element = selectedRepeatableElementRef.current;
    if (element?.isConnected) element.classList.add("is-removing");

    window.setTimeout(() => {
      removeRepeatableItem(selectedRepeatableItem.instanceId, selectedRepeatableItem.index);
      setSelectedRepeatableItem(null);
      selectedRepeatableElementRef.current = null;
    }, 240);

    return true;
  }, [activeBlockById, canvasItems, selectedRepeatableItem]);

  const deleteSelectedCanvasItem = useCallback(() => {
    const instanceId = selectedCanvasItemId ?? hoveredCanvasItemId;
    if (!instanceId) return false;

    const item = canvasItems.find((canvasItem) => canvasItem.instanceId === instanceId);
    const block = item ? activeBlockById.get(item.blockId) : undefined;
    if (!item || block?.type === "background") return false;

    removeItem(instanceId);
    setSelectedCanvasItemId(null);
    setSelectedRepeatableItem(null);
    selectedRepeatableElementRef.current = null;
    return true;
  }, [activeBlockById, canvasItems, hoveredCanvasItemId, selectedCanvasItemId]);

  const handleCanvasPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const target = event.target;
    setHoveredCanvasItemId(target instanceof Element ? getCanvasBlockId(target) : null);
  };

  const handleCanvasClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    const target = event.target;
    if (!(target instanceof Element) || isBuilderStaticTarget(target)) return;

    const instanceId = getCanvasBlockId(target);
    if (!instanceId) {
      setSelectedCanvasItemId(null);
      setSelectedRepeatableItem(null);
      selectedRepeatableElementRef.current = null;
      return;
    }

    const repeatableElement = target.closest<HTMLElement>(".builder-repeatable-item");
    if (repeatableElement) {
      const blockElement = target.closest<HTMLElement>(".builder-block-preview");
      const repeatableElements = blockElement ? Array.from(blockElement.querySelectorAll<HTMLElement>(".builder-repeatable-item")) : [];
      const repeatableIndex = repeatableElements.indexOf(repeatableElement);

      if (repeatableIndex >= 0) {
        setSelectedRepeatableItem({ instanceId, index: repeatableIndex });
        selectedRepeatableElementRef.current = repeatableElement;
        setSelectedCanvasItemId(instanceId);
        return;
      }
    }

    setSelectedCanvasItemId(instanceId);
    setSelectedRepeatableItem(null);
    selectedRepeatableElementRef.current = null;
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditorTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();
      const isMod = event.ctrlKey || event.metaKey;

      if (isMod && key === "z") {
        event.preventDefault();
        restoreCanvasHistory(event.shiftKey ? "redo" : "undo");
        return;
      }

      if (isMod && key === "y") {
        event.preventDefault();
        restoreCanvasHistory("redo");
        return;
      }

      if (event.key === "Delete") {
        if (deleteSelectedRepeatableItem() || deleteSelectedCanvasItem()) {
          event.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [deleteSelectedCanvasItem, deleteSelectedRepeatableItem, restoreCanvasHistory]);

  const updateItemText = (instanceId: string, field: string, value: string) => {
    setCanvasItems((current) =>
      current.map((item) =>
        item.instanceId === instanceId
          ? { ...item, text: { ...item.text, [field]: value } }
          : item
      )
    );
  };

  const updateItemMedia = (instanceId: string, field: string, value: string) => {
    setCanvasItems((current) =>
      current.map((item) =>
        item.instanceId === instanceId
          ? { ...item, media: { ...item.media, [field]: value } }
          : item
      )
    );
  };

  const updateItemOption = (instanceId: string, key: string, value: number | string) => {
    setCanvasItems((current) =>
      current.map((item) => {
        if (item.instanceId !== instanceId) return item;

        const block = activeBlockById.get(item.blockId);
        const nextValue = typeof value === "number" && block ? clampCount(block.type, value) : value;

        if (block && key === "count" && typeof nextValue === "number" && repeatableBlockDefaults[block.type]) {
          const currentOrder = getRepeatableSourceIndices(item, block.type);
          const nextOrder = currentOrder.slice(0, nextValue);
          const highestSourceIndex = Math.max(-1, ...currentOrder);

          while (nextOrder.length < nextValue) {
            nextOrder.push(highestSourceIndex + nextOrder.length - currentOrder.length + 1);
          }

          return { ...item, options: setRepeatableOrderOptions(item.options, nextOrder) };
        }

        return { ...item, options: { ...item.options, [key]: nextValue } };
      })
    );
  };

  const removeActiveBackground = () => {
    if (activeBackgroundItem) removeItem(activeBackgroundItem.instanceId);
  };

  const clearCanvas = () => {
    setRemovingIds(new Set());
    setCanvasItems([]);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(builderCanvasStorageKey);
    }
  };

  const updateColor = (key: keyof BuilderColors, value: string) => {
    setColors((current) => ({ ...current, [key]: value }));
  };

  const renderDropZone = (index: number, empty = false) => (
    <DropZone
      key={`drop-${index}-${empty ? "empty" : "line"}`}
      index={index}
      activeDropIndex={activeDropIndex}
      draggedBlock={draggedBlock}
      empty={empty}
      emptyText={bt("builder.drop.empty")}
      activeText={bt("builder.drop.active")}
      onDragOver={setActiveDropIndex}
      onDrop={handleDrop}
    />
  );

  const renderCanvasBlock = (item: CanvasItem) => {
    const block = activeBlockById.get(item.blockId);
    if (!block) return null;

    return (
      <CanvasBlock
        key={item.instanceId}
        item={item}
        block={block}
        removing={removingIds.has(item.instanceId)}
        builderCopy={builderCopy}
        defaultTexts={defaultTexts}
        pageLinks={pageLinks}
        headerCtaLink={headerCtaLink}
        cartProducts={cartProducts}
        sectionLabel={getBlockCopy(block).title}
        colors={colors}
        builderFonts={builderFonts}
        dragging={Boolean(draggedBlockId || draggedCanvasId)}
        activeSideDrop={activeSideDrop}
        onSideDrop={placeBesideCanvasItem}
        onSideDragOver={setActiveSideDrop}
        onStackDrop={placeStackCanvasItem}
        onStackDragOver={setActiveSideDrop}
        onCanvasDragStart={handleCanvasDragStart}
        onCanvasDragEnd={resetDragState}
        onRemove={removeItem}
        onRepeatableItemRemove={removeRepeatableItem}
        onTextChange={updateItemText}
        onMediaChange={updateItemMedia}
        onOptionChange={updateItemOption}
      />
    );
  };

  const renderCanvasContent = () => {
    const visibleItems = canvasItems.filter((item) => activeBlockById.get(item.blockId)?.type !== "background");
    if (visibleItems.length === 0) return renderDropZone(0, true);

    const nodes: ReactNode[] = [];
    let index = 0;

    while (index < visibleItems.length) {
      const item = visibleItems[index];
      const block = activeBlockById.get(item.blockId);
      const nextItem = visibleItems[index + 1];
      const nextBlock = nextItem ? activeBlockById.get(nextItem.blockId) : undefined;

      nodes.push(renderDropZone(index));

      if (
        block &&
        nextBlock &&
        item.layout === "half" &&
        nextItem.layout === "half" &&
        canShareCanvasRow(block) &&
        canShareCanvasRow(nextBlock)
      ) {
        nodes.push(
          <div key={`${item.instanceId}-${nextItem.instanceId}`} className="site-builder__canvas-row site-builder__canvas-row--split">
            {renderCanvasBlock(item)}
            {renderCanvasBlock(nextItem)}
          </div>
        );
        index += 2;
        continue;
      }

      nodes.push(renderCanvasBlock(item));
      index += 1;
    }

    nodes.push(renderDropZone(visibleItems.length));
    return nodes;
  };

  return (
    <main className={`site-builder ${isSidebarCollapsed ? "site-builder--collapsed" : ""} ${isDarkSurface ? "site-builder--dark-surface" : ""}`} style={canvasStyle}>
      <aside className="site-builder__sidebar">
        <div className="site-builder__sidebar-head">
          {!isSidebarCollapsed && (
            <div>
              <span className="site-builder__eyebrow">
                <Sparkles size={15} />
                {bt("builder.sidebar.eyebrow")}
              </span>
              <h1>{bt("builder.sidebar.title")}</h1>
            </div>
          )}
          <div className="site-builder__head-actions">
            {!isSidebarCollapsed && (
              <button
                className={`site-builder__settings-toggle ${isBuilderSettingsOpen ? "is-active" : ""}`}
                type="button"
                aria-label="Настройки конструктора"
                onClick={() => setIsBuilderSettingsOpen((value) => !value)}
              >
                <Settings size={19} />
              </button>
            )}
            <button
              className="site-builder__collapse"
              type="button"
              aria-label={isSidebarCollapsed ? bt("builder.sidebar.open") : bt("builder.sidebar.close")}
              onClick={() => setIsSidebarCollapsed((value) => !value)}
            >
              {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>
        </div>

        {!isSidebarCollapsed && (
          <div
            ref={builderSettingsRef}
            className={`site-builder__settings-panel ${isBuilderSettingsOpen ? "is-open" : ""}`}
            aria-hidden={!isBuilderSettingsOpen}
          >
            <div className="site-builder__settings-group">
              <strong>Цвета сайта</strong>
              <div className="site-builder__color-grid">
                {colorControls.map((control) => (
                  <label key={`settings-${control.key}`} className="site-builder__color-field">
                    <span>{bt(control.labelKey)}</span>
                    <input
                      type="color"
                      value={colors[control.key]}
                      onChange={(event) => updateColor(control.key, event.target.value)}
                      aria-label={bt(control.labelKey)}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="site-builder__settings-group">
              <strong>Шрифты</strong>
              {([
                ["heading", "Заголовки"],
                ["body", "Основной текст"],
                ["ui", "Подписи и кнопки"],
              ] as Array<[keyof BuilderFonts, string]>).map(([key, label]) => (
                <label key={key} className="site-builder__font-field">
                  <span>{label}</span>
                  <BuilderFontPicker
                    value={builderFonts[key]}
                    onChange={(nextValue) => setBuilderFonts((current) => ({ ...current, [key]: nextValue }))}
                  />
                </label>
              ))}
            </div>
            {activeBackgroundItem && activeBackgroundBlock && (
              <button className="site-builder__settings-action" type="button" onClick={removeActiveBackground}>
                <Sparkles size={16} />
                Убрать эффект: {getBlockCopy(activeBackgroundBlock).title}
              </button>
            )}
            <button className="site-builder__settings-clear" type="button" onClick={clearCanvas}>
              Очистить холст
            </button>
          </div>
        )}

        <div className="site-builder__library">
          {catalogSections.map((section) => (
            <section key={section.title} className="site-builder__library-section">
              {!isSidebarCollapsed && <h2>{section.blocks[0] ? getSectionLabel(section.blocks[0].type) : section.title}</h2>}
              <div className="site-builder__library-list">
                {section.blocks.map((block) => {
                  const Icon = block.icon;
                  const blockCopy = getBlockCopy(block);

                  return (
                    <div
                      key={block.id}
                      className="site-builder__library-card"
                      draggable
                      role="button"
                      tabIndex={0}
                      aria-label={blockCopy.title}
                      onDragStart={(event) => handlePaletteDragStart(event, block)}
                      onDragEnd={resetDragState}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter" && event.key !== " ") return;
                        event.preventDefault();
                        insertBlock(block, canvasItems.length);
                      }}
                    >
                      <span className="site-builder__library-icon">
                        <Icon size={18} />
                      </span>
                      {!isSidebarCollapsed && (
                        <>
                          <span className="site-builder__miniature">
                            <BlockMiniature type={block.type} variant={block.variant} />
                          </span>
                          <span className="site-builder__library-copy">
                            <strong title={blockCopy.title}>{blockCopy.title}</strong>
                            <small title={blockCopy.description}>{blockCopy.description}</small>
                          </span>
                          <span className="site-builder__library-price">{getBlockPrice(block)} $</span>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <button className="site-builder__price" type="button">
          {isSidebarCollapsed ? `${displayedPrice} $` : bt("builder.price", { price: displayedPrice })}
        </button>
      </aside>

      <section className="site-builder__workspace">
        <div className={`site-builder__canvas-shell ${canvasItems.some((item) => activeBlockById.get(item.blockId)?.type !== "background") ? "" : "site-builder__canvas-shell--empty"}`}>
          <div
            ref={canvasRef}
            className={`site-builder__canvas ${activeBackgroundBlock ? `site-builder__canvas--bg-${activeBackgroundBlock.variant}` : ""}`}
            style={canvasStyle}
            onPointerMove={handleCanvasPointerMove}
            onPointerLeave={() => setHoveredCanvasItemId(null)}
            onClick={handleCanvasClick}
            onDragOver={(event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = draggedCanvasId ? "move" : "copy";
              if (activeDropIndex === null) setActiveDropIndex(canvasItems.length);
            }}
            onDrop={(event) => handleDrop(event, activeDropIndex ?? canvasItems.length)}
          >
            {activeBackgroundBlock?.variant === "edge-particles" && <BuilderEdgeParticles />}
            {activeBackgroundBlock?.variant === "spark-stars" && <BuilderSparkStars />}
            {renderCanvasContent()}
          </div>
        </div>
      </section>
    </main>
  );
}

function BuilderSparkStars() {
  const stars = useMemo(
    () =>
      Array.from({ length: 72 }).map((_, index) => ({
        id: index,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 3,
        delay: Math.random() * -7,
        duration: Math.random() * 3.8 + 3.2,
        color: index % 3 === 0 ? "var(--builder-accent)" : index % 3 === 1 ? "var(--builder-primary)" : "var(--builder-text)",
      })),
    []
  );

  return (
    <div className="builder-spark-stars" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          style={{
            "--star-x": `${star.x}%`,
            "--star-y": `${star.y}%`,
            "--star-size": `${star.size}px`,
            "--star-delay": `${star.delay}s`,
            "--star-duration": `${star.duration}s`,
            "--star-color": star.color,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function BuilderEdgeParticles() {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return undefined;

    let intervalId = 0;
    const timeouts: number[] = [];

    const createParticle = (fromLeft = Math.random() > 0.5) => {
      if (!layer.isConnected) return;

      const rect = layer.getBoundingClientRect();
      if (rect.width < 20 || rect.height < 20) return;

      const particle = document.createElement("span");
      particle.className = "builder-edge-particle";

      const size = Math.random() * 14 + 5;
      const top = Math.random() * rect.height;
      const travel = rect.width * (0.42 + Math.random() * 0.46) + 90;
      const waves = Math.random() * 3 + 1.8;
      const amplitude = Math.min(rect.height * 0.42, Math.random() * 180 + 44);
      const phase = Math.random() * Math.PI * 2;
      const duration = Math.random() * 18000 + 12000;
      const color = fromLeft ? "var(--builder-accent)" : "var(--builder-primary)";

      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = fromLeft ? `${-size - 28}px` : `${rect.width + size + 28}px`;
      particle.style.top = `${top}px`;
      particle.style.background = color;
      particle.style.boxShadow = `0 0 ${Math.round(size * 1.9 + 10)}px color-mix(in srgb, ${color} 42%, transparent)`;

      layer.appendChild(particle);

      const keyframes = Array.from({ length: 56 }).map((_, index) => {
        const progress = index / 55;
        const x = progress * travel * (fromLeft ? 1 : -1);
        const y = Math.sin(progress * waves * Math.PI * 2 + phase) * amplitude;
        const scale = 0.82 + Math.sin(progress * Math.PI) * 0.28;
        const opacityIn = Math.min(progress / 0.12, 1);
        const opacityOut = Math.pow(Math.max(1 - progress, 0), 1.35);
        const opacity = Math.min(0.88, opacityIn * opacityOut * (0.62 + size / 28));

        return {
          opacity,
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
        };
      });

      const animation = particle.animate(keyframes, {
        duration,
        easing: "ease-in-out",
        fill: "forwards",
      });

      animation.onfinish = () => particle.remove();
      timeouts.push(window.setTimeout(() => particle.remove(), duration + 800));
    };

    for (let index = 0; index < 14; index += 1) {
      timeouts.push(window.setTimeout(() => createParticle(index % 2 === 0), index * 170));
    }

    intervalId = window.setInterval(() => {
      createParticle(true);
      createParticle(false);
    }, 620);

    return () => {
      window.clearInterval(intervalId);
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
      layer.querySelectorAll(".builder-edge-particle").forEach((particle) => particle.remove());
    };
  }, []);

  return <div className="builder-edge-particles" aria-hidden="true" ref={layerRef} />;
}

function DropZone({
  index,
  activeDropIndex,
  draggedBlock,
  onDragOver,
  onDrop,
  emptyText,
  activeText,
  empty = false,
}: {
  index: number;
  activeDropIndex: number | null;
  draggedBlock?: BuilderBlock;
  emptyText: string;
  activeText: string;
  empty?: boolean;
  onDragOver: (index: number) => void;
  onDrop: (event: DragEvent<HTMLDivElement>, index: number) => void;
}) {
  const isActive = activeDropIndex === index;
  const height = isActive ? draggedBlock?.height ?? 120 : undefined;

  return (
    <div
      className={`site-builder__drop-zone ${empty ? "site-builder__drop-zone--empty" : ""} ${isActive ? "is-active" : ""}`}
      style={height ? { "--drop-height": `${height}px` } as CSSProperties : undefined}
      onDragEnter={(event) => {
        event.preventDefault();
        onDragOver(index);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "copy";
        onDragOver(index);
      }}
      onDrop={(event) => {
        event.stopPropagation();
        onDrop(event, index);
      }}
    >
      {empty && <span className="site-builder__drop-zone-text">{isActive ? activeText : emptyText}</span>}
    </div>
  );
}

type TextChangeHandler = (instanceId: string, field: string, value: string) => void;
type MediaChangeHandler = (instanceId: string, field: string, value: string) => void;
type EditableTextTag = "span" | "strong" | "h3" | "h4" | "p" | "small" | "button";
type AuthModalType = "terms" | "reset";

function CanvasBlock({
  item,
  block,
  removing,
  builderCopy,
  defaultTexts,
  pageLinks,
  headerCtaLink,
  cartProducts,
  sectionLabel,
  colors,
  builderFonts,
  onRemove,
  onRepeatableItemRemove,
  onTextChange,
  onMediaChange,
  onOptionChange,
  dragging,
  activeSideDrop,
  onSideDrop,
  onSideDragOver,
  onStackDrop,
  onStackDragOver,
  onCanvasDragStart,
  onCanvasDragEnd,
}: {
  item: CanvasItem;
  block: BuilderBlock;
  removing: boolean;
  builderCopy: BuilderCopy;
  defaultTexts: Record<string, string>;
  pageLinks: PageLink[];
  headerCtaLink: PageLink | null;
  cartProducts: CartProduct[];
  sectionLabel: string;
  colors: BuilderColors;
  builderFonts: BuilderFonts;
  onRemove: (instanceId: string) => void;
  onRepeatableItemRemove: (instanceId: string, index: number) => void;
  onTextChange: TextChangeHandler;
  onMediaChange: MediaChangeHandler;
  onOptionChange: (instanceId: string, key: string, value: number | string) => void;
  dragging: boolean;
  activeSideDrop: string | null;
  onSideDrop: (targetInstanceId: string, side: CanvasSide, event: DragEvent<HTMLDivElement>) => void;
  onSideDragOver: (value: string | null) => void;
  onStackDrop: (targetInstanceId: string, position: CanvasStackPosition, event: DragEvent<HTMLDivElement>) => void;
  onStackDragOver: (value: string | null) => void;
  onCanvasDragStart: (event: DragEvent<HTMLElement>, item: CanvasItem) => void;
  onCanvasDragEnd: () => void;
}) {
  const blockRef = useRef<HTMLElement>(null);
  const blockSettingsRef = useRef<HTMLDivElement>(null);
  const itemCount = getCanvasItemCount(item, block.type);
  const [catalogPage, setCatalogPage] = useState(0);
  const [catalogVisibleCount, setCatalogVisibleCount] = useState(6);
  const [activeCatalogProduct, setActiveCatalogProduct] = useState<number | null>(null);
  const [gallerySlide, setGallerySlide] = useState(0);
  const [reviewsSlide, setReviewsSlide] = useState(0);
  const [highlightReviewSourceIndex, setHighlightReviewSourceIndex] = useState<number | null>(null);
  const [activeReviewModal, setActiveReviewModal] = useState<ReviewModalData | null>(null);
  const [reviewModalClosing, setReviewModalClosing] = useState(false);
  const [pricingAnnual, setPricingAnnual] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("register");
  const [authAgreed, setAuthAgreed] = useState(false);
  const [activeAuthModal, setActiveAuthModal] = useState<AuthModalType | null>(null);
  const [authModalClosing, setAuthModalClosing] = useState(false);
  const [feedbackPublic, setFeedbackPublic] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [removingRepeatableIndex, setRemovingRepeatableIndex] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const canDropBeside = dragging && canShareCanvasRow(block);
  const canDropAround = dragging;
  const blockMode = item.options?.blockMode === "dark" ? "dark" : item.options?.blockMode === "light" ? "light" : "auto";
  const blockPrimary = typeof item.options?.blockPrimary === "string" ? item.options.blockPrimary : undefined;
  const blockAccent = typeof item.options?.blockAccent === "string" ? item.options.blockAccent : undefined;
  const blockSurface = typeof item.options?.blockSurface === "string" ? item.options.blockSurface : undefined;
  const blockText = typeof item.options?.blockText === "string" ? item.options.blockText : undefined;
  const blockStyle = {
    ...(blockPrimary ? { "--builder-primary": blockPrimary, "--blue": blockPrimary } : {}),
    ...(blockAccent ? { "--builder-accent": blockAccent, "--orange": blockAccent } : {}),
    ...(blockSurface ? {
      "--builder-surface": blockSurface,
      "--builder-dark-block-bg": blockSurface,
      "--builder-dark-block-bg-strong": blockSurface,
      "--surface": blockSurface,
      "--surface-soft": `color-mix(in srgb, ${blockSurface} 90%, ${blockPrimary ?? colors.primary} 5%)`,
      "--surface-muted": `color-mix(in srgb, ${blockSurface} 76%, ${blockPrimary ?? colors.primary} 12%)`,
    } : {}),
    ...(blockText ? {
      "--builder-text": blockText,
      "--builder-dark-block-text": blockText,
      "--builder-dark-block-muted": `color-mix(in srgb, ${blockText} 68%, transparent)`,
      "--builder-dark-block-border": `color-mix(in srgb, ${blockText} 14%, transparent)`,
      "--text-primary": blockText,
      "--text-secondary": `color-mix(in srgb, ${blockText} 72%, ${blockSurface ?? colors.surface})`,
      "--text-muted": `color-mix(in srgb, ${blockText} 58%, transparent)`,
      "--border-soft": `color-mix(in srgb, ${blockText} 12%, transparent)`,
    } : {}),
    ...(typeof item.options?.blockHeadingFont === "string" ? { "--builder-heading-font": item.options.blockHeadingFont } : {}),
    ...(typeof item.options?.blockBodyFont === "string" ? { "--builder-body-font": item.options.blockBodyFont } : {}),
    ...(typeof item.options?.blockUiFont === "string" ? { "--builder-ui-font": item.options.blockUiFont } : {}),
  } as CSSProperties;

  const handleRepeatableItemRemove = (index: number) => {
    if (itemCount <= 1) {
      onRemove(item.instanceId);
      return;
    }

    setRemovingRepeatableIndex(index);
    window.setTimeout(() => {
      onRepeatableItemRemove(item.instanceId, index);
      setRemovingRepeatableIndex(null);
    }, 280);
  };

  const closeReviewModal = () => {
    setReviewModalClosing(true);
    window.setTimeout(() => {
      setActiveReviewModal(null);
      setReviewModalClosing(false);
    }, 240);
  };

  const openAuthModal = (modal: AuthModalType) => {
    setAuthModalClosing(false);
    setActiveAuthModal(modal);
  };

  const closeAuthModal = () => {
    if (!activeAuthModal) return;

    setAuthModalClosing(true);
    window.setTimeout(() => {
      setActiveAuthModal(null);
      setAuthModalClosing(false);
    }, 240);
  };

  useEffect(() => {
    if (block.type !== "catalog") return;

    const maxPage = Math.max(0, Math.ceil(itemCount / 6) - 1);
    const sourceIndices = getRepeatableSourceIndices(item, block.type);
    setCatalogPage((current) => Math.min(current, maxPage));
    setCatalogVisibleCount((current) => Math.min(Math.max(6, current), Math.max(6, itemCount)));
    setActiveCatalogProduct((current) => (current !== null && !sourceIndices.includes(current) ? null : current));
  }, [block.type, item, itemCount]);

  useEffect(() => {
    if (!settingsOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (blockSettingsRef.current?.contains(target)) return;
      setSettingsOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [settingsOpen]);

  useEffect(() => {
    if (block.type !== "gallery") return;
    setGallerySlide((current) => Math.min(current, Math.max(0, itemCount - 1)));
  }, [block.type, itemCount]);

  useEffect(() => {
    if (block.type !== "reviews") return;
    setReviewsSlide((current) => Math.min(current, Math.max(0, itemCount - 1)));
  }, [block.type, itemCount]);

  useEffect(() => {
    if (block.type !== "reviews" || block.variant !== "highlight") {
      setHighlightReviewSourceIndex(null);
      return;
    }

    const sourceIndices = getRepeatableSourceIndices(item, block.type);
    if (highlightReviewSourceIndex !== null && !sourceIndices.includes(highlightReviewSourceIndex)) {
      setHighlightReviewSourceIndex(null);
    }
  }, [block.type, block.variant, highlightReviewSourceIndex, item]);

  useEffect(() => {
    const root = blockRef.current;
    if (!root) return;

    const cleanupCallbacks: Array<() => void> = [];

    root.querySelectorAll<HTMLElement>(editableTextSelector).forEach((element, index) => {
      if (element.closest(".builder-block-settings")) return;
      if (element.closest("[data-builder-static='true']")) return;
      if (element.classList.contains("editable-text") && !element.classList.contains("editable-text--auto")) return;

      const field = `auto-text.${index}`;
      const translatedDefault = defaultTexts[`${block.type}.${index}`];
      element.classList.add("editable-text", "editable-text--auto");
      element.setAttribute("contenteditable", "true");
      element.setAttribute("spellcheck", "false");
      element.dataset.placeholder = getBuilderText(builderCopy, "builder.editor.textPlaceholder");

      if (document.activeElement !== element && hasOwnValue(item.text, field)) {
        element.textContent = normalizeRussianMojibake(item.text[field]);
      } else if (document.activeElement !== element && !hasOwnValue(item.text, field) && translatedDefault) {
        element.textContent = normalizeRussianMojibake(translatedDefault);
      }

      const handleBlur = () => onTextChange(item.instanceId, field, normalizeRussianMojibake(element.textContent ?? ""));
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Enter" && element.tagName !== "P") {
          event.preventDefault();
          element.blur();
        }

        event.stopPropagation();
      };
      const stopPointer = (event: PointerEvent) => event.stopPropagation();

      element.addEventListener("blur", handleBlur);
      element.addEventListener("keydown", handleKeyDown);
      element.addEventListener("pointerdown", stopPointer);

      cleanupCallbacks.push(() => {
        element.removeEventListener("blur", handleBlur);
        element.removeEventListener("keydown", handleKeyDown);
        element.removeEventListener("pointerdown", stopPointer);
      });
    });

    root.querySelectorAll<HTMLElement>(editableMediaSelector).forEach((element, index) => {
      const fallbackField = element.dataset.mediaField ?? `auto-media.${index}`;
      const getMediaField = () => element.dataset.mediaField ?? fallbackField;
      const field = getMediaField();
      element.classList.add("editable-media-target");
      element.dataset.uploadLabel = getBuilderText(builderCopy, "builder.editor.upload");
      element.setAttribute("title", getBuilderText(builderCopy, "builder.editor.upload"));

      const source = hasOwnValue(item.media, field) ? item.media[field] : "";
      if (source) {
        element.classList.add("has-uploaded-media");
        element.style.backgroundImage = `url("${source}")`;
        element.style.backgroundPosition = "center";
        element.style.backgroundSize = "cover";
      } else {
        element.classList.remove("has-uploaded-media");
        element.style.backgroundImage = "";
        element.style.backgroundPosition = "";
        element.style.backgroundSize = "";
      }

      const handleClick = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();

        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png,image/jpeg,image/svg+xml,image/webp,image/gif";
        input.onchange = () => {
          const file = input.files?.[0];
          if (!file) return;

          const isImageFile = file.type.startsWith("image/") || /\.(svg|png|jpe?g|webp|gif)$/i.test(file.name);
          if (!isImageFile) return;

          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === "string") {
              onMediaChange(item.instanceId, getMediaField(), reader.result);
            }
          };
          reader.readAsDataURL(file);
        };
        input.click();
      };

      element.addEventListener("click", handleClick);
      cleanupCallbacks.push(() => element.removeEventListener("click", handleClick));
    });

    return () => cleanupCallbacks.forEach((cleanup) => cleanup());
  }, [block.type, builderCopy, defaultTexts, item, onTextChange, onMediaChange]);

  return (
    <article
      id={`builder-section-${item.instanceId}`}
      ref={blockRef}
      className={`builder-block-preview builder-block-preview--${block.type} builder-block-preview--${block.variant} builder-block-preview--mode-${blockMode} ${settingsOpen ? "is-settings-open" : ""} ${removing ? "is-removing" : ""}`}
      style={blockStyle}
    >
      <div ref={blockSettingsRef} className={`builder-block-settings ${settingsOpen ? "is-open" : ""}`} data-builder-static="true">
        <button
          className="builder-block-preview__settings"
          type="button"
          aria-label={getBuilderText(builderCopy, "builder.blockSettings.aria")}
          onClick={() => setSettingsOpen((value) => !value)}
        >
          <Settings size={20} strokeWidth={2.4} />
        </button>
        {settingsOpen && (
          <div className="builder-block-settings__panel">
            <strong>{getBuilderText(builderCopy, "builder.blockSettings.title")}</strong>
            <div className="builder-block-settings__modes" role="group" aria-label={getBuilderText(builderCopy, "builder.blockSettings.mode")}>
              {(["auto", "light", "dark"] as const).map((mode) => (
                <button
                  key={mode}
                  className={blockMode === mode ? "is-active" : ""}
                  type="button"
                  onClick={() => onOptionChange(item.instanceId, "blockMode", mode)}
                >
                  {getBuilderText(builderCopy, `builder.blockSettings.${mode}`)}
                </button>
              ))}
            </div>
            <div className="builder-block-settings__colors">
              {([
                ["blockPrimary", "builder.blockSettings.primary", colors.primary],
                ["blockAccent", "builder.blockSettings.accent", colors.accent],
                ["blockSurface", "builder.blockSettings.surface", colors.surface],
                ["blockText", "builder.blockSettings.text", colors.text],
              ] as Array<[string, string, string]>).map(([key, label, fallback]) => (
                <label key={key}>
                  <span>{getBuilderText(builderCopy, label)}</span>
                  <input
                    type="color"
                    value={typeof item.options?.[key] === "string" ? String(item.options[key]) : fallback}
                    onChange={(event) => onOptionChange(item.instanceId, key, event.target.value)}
                  />
                </label>
              ))}
            </div>
            <div className="builder-block-settings__fonts">
              {([
                ["blockHeadingFont", "builder.blockSettings.headingFont", "heading"],
                ["blockBodyFont", "builder.blockSettings.bodyFont", "body"],
                ["blockUiFont", "builder.blockSettings.uiFont", "ui"],
              ] as Array<[string, string, keyof BuilderFonts]>).map(([key, label, fallbackKey]) => (
                <label key={key}>
                  <span>{getBuilderText(builderCopy, label)}</span>
                  <BuilderFontPicker
                    value={typeof item.options?.[key] === "string" ? String(item.options[key]) : builderFonts[fallbackKey]}
                    onChange={(nextValue) => onOptionChange(item.instanceId, key, nextValue)}
                  />
                </label>
              ))}
            </div>
            {repeatableBlockDefaults[block.type] && (
              <label className="builder-block-settings__count">
                <span>{getBuilderText(builderCopy, "builder.blockSettings.count")}</span>
                <input
                  type="number"
                  min={repeatableBlockLimits[block.type]?.min ?? 1}
                  max={repeatableBlockLimits[block.type]?.max ?? 30}
                  value={itemCount}
                  onChange={(event) => onOptionChange(item.instanceId, "count", Number(event.target.value))}
                />
              </label>
            )}
            <button className="builder-block-settings__delete" type="button" onClick={() => onRemove(item.instanceId)}>
              {getBuilderText(builderCopy, "builder.blockSettings.delete")}
            </button>
          </div>
        )}
      </div>
      <div className="builder-block-preview__label">
        <span
          className="builder-block-preview__drag-handle"
          draggable
          title="Переместить блок"
          onDragStart={(event) => onCanvasDragStart(event, item)}
          onDragEnd={onCanvasDragEnd}
        >
          <GripVertical size={15} />
        </span>
        <EditableText item={item} field="label" fallback={sectionLabel} onTextChange={onTextChange} />
      </div>
      {canDropAround && (["before", "after"] as const).map((position) => {
        const dropKey = `${item.instanceId}:${position}`;

        return (
          <div
            key={dropKey}
            className={`builder-block-preview__stack-drop builder-block-preview__stack-drop--${position} ${activeSideDrop === dropKey ? "is-active" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onStackDragOver(dropKey);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              event.dataTransfer.dropEffect = event.dataTransfer.types.includes("application/x-builder-instance") ? "move" : "copy";
              onStackDragOver(dropKey);
            }}
            onDrop={(event) => onStackDrop(item.instanceId, position, event)}
          />
        );
      })}
      {canDropBeside && (["left", "right"] as const).map((side) => {
        const dropKey = `${item.instanceId}:${side}`;

        return (
          <div
            key={dropKey}
            className={`builder-block-preview__side-drop builder-block-preview__side-drop--${side} ${activeSideDrop === dropKey ? "is-active" : ""}`}
            onDragEnter={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onSideDragOver(dropKey);
            }}
            onDragOver={(event) => {
              event.preventDefault();
              event.stopPropagation();
              event.dataTransfer.dropEffect = event.dataTransfer.types.includes("application/x-builder-instance") ? "move" : "copy";
              onSideDragOver(dropKey);
            }}
            onDrop={(event) => onSideDrop(item.instanceId, side, event)}
          />
        );
      })}
      {renderBlockContent(
        block,
        item,
        onTextChange,
        builderCopy,
        defaultTexts,
        pageLinks,
        headerCtaLink,
        cartProducts,
        isCartOpen,
        setIsCartOpen,
        pricingAnnual,
        setPricingAnnual,
        authMode,
        setAuthMode,
        authAgreed,
        setAuthAgreed,
        activeAuthModal,
        authModalClosing,
        openAuthModal,
        closeAuthModal,
        feedbackPublic,
        setFeedbackPublic,
        itemCount,
        catalogPage,
        setCatalogPage,
        activeCatalogProduct,
        setActiveCatalogProduct,
        catalogVisibleCount,
        setCatalogVisibleCount,
        gallerySlide,
        setGallerySlide,
        reviewsSlide,
        setReviewsSlide,
        highlightReviewSourceIndex,
        setHighlightReviewSourceIndex,
        setActiveReviewModal,
        removingRepeatableIndex,
        handleRepeatableItemRemove,
        (key, value) => onOptionChange(item.instanceId, key, value)
      )}
      {activeReviewModal && (
        <BuilderReviewModal
          item={item}
          modal={activeReviewModal}
          closing={reviewModalClosing}
          onClose={closeReviewModal}
          onTextChange={onTextChange}
        />
      )}
    </article>
  );
}

const russianMojibakeMap: Record<string, string> = {
  "РЃ": "Ё",
  "Рђ": "А",
  "Р‘": "Б",
  "Р’": "В",
  "Р“": "Г",
  "Р”": "Д",
  "Р•": "Е",
  "Р–": "Ж",
  "Р—": "З",
  "Р\u0098": "И",
  "Р˜": "И",
  "Р™": "Й",
  "Рљ": "К",
  "Р›": "Л",
  "Рњ": "М",
  "Рќ": "Н",
  "Рћ": "О",
  "Рџ": "П",
  "Р\u00a0": "Р",
  "РЎ": "С",
  "Рў": "Т",
  "РЈ": "У",
  "Р¤": "Ф",
  "РҐ": "Х",
  "Р¦": "Ц",
  "Р§": "Ч",
  "РЁ": "Ш",
  "Р©": "Щ",
  "РЄ": "Ъ",
  "Р«": "Ы",
  "Р¬": "Ь",
  "Р­": "Э",
  "Р®": "Ю",
  "РЇ": "Я",
  "Р°": "а",
  "Р±": "б",
  "РІ": "в",
  "Рі": "г",
  "Рґ": "д",
  "Рµ": "е",
  "Р¶": "ж",
  "Р·": "з",
  "Рё": "и",
  "Р№": "й",
  "Рє": "к",
  "Р»": "л",
  "Рј": "м",
  "РЅ": "н",
  "Рѕ": "о",
  "Рї": "п",
  "СЂ": "р",
  "СЃ": "с",
  "С‚": "т",
  "Сѓ": "у",
  "С„": "ф",
  "С…": "х",
  "С†": "ц",
  "С‡": "ч",
  "С€": "ш",
  "С‰": "щ",
  "СЉ": "ъ",
  "С‹": "ы",
  "СЊ": "ь",
  "СЌ": "э",
  "СЋ": "ю",
  "СЏ": "я",
  "С‘": "ё",
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const russianMojibakePattern = new RegExp(
  Object.keys(russianMojibakeMap).sort((left, right) => right.length - left.length).map(escapeRegExp).join("|"),
  "g",
);
const likelyRussianMojibakePattern = /(?:Р[\u0080-\u04ff]|С[\u0080-\u04ff])/;
const normalizeRussianMojibake = (value: string) =>
  likelyRussianMojibakePattern.test(value)
    ? value.replace(russianMojibakePattern, (chunk) => russianMojibakeMap[chunk] ?? chunk)
    : value;

function EditableText({
  as = "span",
  item,
  field,
  fallback,
  className = "",
  onTextChange,
}: {
  as?: EditableTextTag;
  item: CanvasItem;
  field: string;
  fallback: string;
  className?: string;
  onTextChange: TextChangeHandler;
}) {
  const ref = useRef<HTMLElement>(null);
  const value = normalizeRussianMojibake(hasOwnValue(item.text, field) ? item.text[field] : fallback);

  useEffect(() => {
    if (!ref.current || document.activeElement === ref.current) return;
    if (ref.current.textContent !== value) {
      ref.current.textContent = value;
    }
  }, [value]);

  const commitText = () => {
    onTextChange(item.instanceId, field, normalizeRussianMojibake(ref.current?.textContent ?? ""));
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && as !== "p") {
      event.preventDefault();
      event.currentTarget.blur();
    }

    event.stopPropagation();
  };

  const props = {
    ref,
    className: `editable-text ${className}`.trim(),
    contentEditable: true,
    ...(as === "button" ? { type: "button" } : {}),
    "data-placeholder": fallback,
    suppressContentEditableWarning: true,
    spellCheck: false,
    onBlur: commitText,
    onKeyDown: handleKeyDown,
    onPointerDown: (event: ReactPointerEvent<HTMLElement>) => event.stopPropagation(),
  } as HTMLAttributes<HTMLElement> & { ref: typeof ref; type?: "button" };

  return createElement(as, props, value);
}

function BuilderReviewModal({
  item,
  modal,
  closing,
  onClose,
  onTextChange,
}: {
  item: CanvasItem;
  modal: ReviewModalData;
  closing: boolean;
  onClose: () => void;
  onTextChange: TextChangeHandler;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className={`builder-review-modal ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="builder-review-modal__panel" onMouseDown={(event) => event.stopPropagation()}>
        <button className="builder-review-modal__close" type="button" aria-label="Закрыть отзыв" onClick={onClose}>
          <X size={22} strokeWidth={2.6} />
        </button>
        <div className="builder-review-modal__stars" data-builder-static="true">
          {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={20} />)}
        </div>
        <EditableText item={item} field={modal.textField} fallback={modal.textFallback} as="h3" onTextChange={onTextChange} />
        <EditableText item={item} field={modal.detailField} fallback={modal.detailFallback} as="p" className="builder-review-modal__details" onTextChange={onTextChange} />
        <div className="builder-review-modal__author">
          <span data-builder-static="true" />
          <div>
            <EditableText item={item} field={modal.authorField} fallback={modal.authorFallback} as="strong" onTextChange={onTextChange} />
            <EditableText item={item} field={modal.roleField} fallback={modal.roleFallback} as="small" onTextChange={onTextChange} />
          </div>
        </div>
      </section>
    </div>
  );
}

function BuilderAuthModal({
  item,
  type,
  closing,
  onClose,
  onTextChange,
}: {
  item: CanvasItem;
  type: AuthModalType;
  closing: boolean;
  onClose: () => void;
  onTextChange: TextChangeHandler;
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const isReset = type === "reset";

  return (
    <div
      className={`builder-auth-modal ${closing ? "is-closing" : ""}`}
      role="dialog"
      aria-modal="true"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <section className="builder-auth-modal__panel" onMouseDown={(event) => event.stopPropagation()}>
        <button className="builder-auth-modal__close" type="button" aria-label="Закрыть окно" onClick={onClose}>
          <X size={22} strokeWidth={2.6} />
        </button>
        {isReset ? (
          <>
            <EditableText item={item} field="auth.reset.title" fallback="Восстановить пароль" as="h3" onTextChange={onTextChange} />
            <EditableText item={item} field="auth.reset.text" fallback="Укажите email или телефон, и мы отправим ссылку для сброса пароля." as="p" onTextChange={onTextChange} />
            <EditableText item={item} field="auth.reset.contact" fallback="Email или телефон" as="span" className="builder-form__field builder-auth-modal__field" onTextChange={onTextChange} />
            <EditableText item={item} field="auth.reset.cta" fallback="Отправить ссылку" as="button" className="builder-auth-modal__cta" onTextChange={onTextChange} />
          </>
        ) : (
          <>
            <EditableText item={item} field="auth.terms.title" fallback="Условия использования" as="h3" onTextChange={onTextChange} />
            <div className="builder-auth-modal__terms">
              <EditableText item={item} field="auth.terms.0" fallback="Данные используются только для входа, заявок и связи с клиентом по выбранной услуге." as="p" onTextChange={onTextChange} />
              <EditableText item={item} field="auth.terms.1" fallback="Пользователь подтверждает корректность контактов и соглашается получать служебные уведомления." as="p" onTextChange={onTextChange} />
              <EditableText item={item} field="auth.terms.2" fallback="Пароль, заявки и личные данные защищаются и не передаются третьим лицам без необходимости." as="p" onTextChange={onTextChange} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function TypingEditableText({
  item,
  field,
  fallback,
  displayValue,
  onTextChange,
}: {
  item: CanvasItem;
  field: string;
  fallback: string;
  displayValue: string;
  onTextChange: TextChangeHandler;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [focused, setFocused] = useState(false);
  const value = normalizeRussianMojibake(hasOwnValue(item.text, field) ? item.text[field] : fallback);
  const visibleValue = focused ? value : normalizeRussianMojibake(displayValue);

  useEffect(() => {
    if (!ref.current || document.activeElement === ref.current) return;
    if (ref.current.textContent !== visibleValue) {
      ref.current.textContent = visibleValue;
    }
  }, [visibleValue]);

  const commitText = () => {
    setFocused(false);
    onTextChange(item.instanceId, field, normalizeRussianMojibake(ref.current?.textContent ?? ""));
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.blur();
    }

    event.stopPropagation();
  };

  return (
    <span
      ref={ref}
      className="editable-text"
      contentEditable
      data-placeholder={fallback}
      data-typing-active={focused ? undefined : "true"}
      suppressContentEditableWarning
      spellCheck={false}
      onFocus={() => {
        setFocused(true);
        if (ref.current && ref.current.textContent !== value) {
          ref.current.textContent = value;
        }
      }}
      onBlur={commitText}
      onKeyDown={handleKeyDown}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {visibleValue}
    </span>
  );
}

function BuilderHeroTypingCopy({
  item,
  entries,
  onTextChange,
}: {
  item: CanvasItem;
  entries: Array<{ field: string; fallback: string }>;
  onTextChange: TextChangeHandler;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const [visibleChars, setVisibleChars] = useState(0);

  useEffect(() => {
    setActiveIndex((current) => (entries.length ? Math.min(current, entries.length - 1) : 0));
  }, [entries.length]);

  const activeEntry = entries[activeIndex] ?? entries[0];
  const activeText = activeEntry
    ? normalizeRussianMojibake(hasOwnValue(item.text, activeEntry.field) ? item.text[activeEntry.field] : activeEntry.fallback)
    : "";
  const activeChars = useMemo(() => Array.from(activeText), [activeText]);

  useEffect(() => {
    setPhase("typing");
    setVisibleChars(0);
  }, [activeEntry?.field]);

  useEffect(() => {
    setVisibleChars((current) => Math.min(current, activeChars.length));
  }, [activeChars.length]);

  useEffect(() => {
    if (!activeEntry || !entries.length) return;

    if (phase === "typing") {
      if (visibleChars < activeChars.length) {
        const timeout = window.setTimeout(() => {
          setVisibleChars((current) => Math.min(activeChars.length, current + 1));
        }, 42);

        return () => window.clearTimeout(timeout);
      }

      setPhase("holding");
      return;
    }

    if (phase === "holding") {
      const timeout = window.setTimeout(() => {
        setPhase("deleting");
      }, 2200);

      return () => window.clearTimeout(timeout);
    }

    if (phase === "deleting") {
      if (visibleChars > 0) {
        const timeout = window.setTimeout(() => {
          setVisibleChars((current) => Math.max(0, current - 2));
        }, 24);

        return () => window.clearTimeout(timeout);
      }

      setActiveIndex((current) => (current + 1) % entries.length);
      setPhase("typing");
    }

    return;
  }, [activeChars.length, activeEntry, entries.length, phase, visibleChars]);

  if (!activeEntry) return null;

  return (
    <div className="builder-hero__typing-copy" data-phase={phase}>
      <TypingEditableText
        item={item}
        field={activeEntry.field}
        fallback={activeEntry.fallback}
        displayValue={activeChars.slice(0, visibleChars).join("")}
        onTextChange={onTextChange}
      />
    </div>
  );
}

function BuilderMagneticHeroImage() {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const dx = centerX - event.clientX;
    const dy = centerY - event.clientY;
    const distance = Math.hypot(dx, dy);
    const radius = 190;

    if (distance > radius || distance === 0) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    const strength = (1 - distance / radius) * 30;
    setOffset({
      x: (dx / distance) * strength,
      y: (dy / distance) * strength,
    });
  };

  return (
    <div
      className="builder-hero-magnet"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setOffset({ x: 0, y: 0 })}
    >
      <span
        className="builder-hero-magnet__image"
        data-media-field="hero.product.image"
        style={{
          "--magnet-x": `${offset.x}px`,
          "--magnet-y": `${offset.y}px`,
        } as CSSProperties}
      >
        <Image size={42} />
      </span>
    </div>
  );
}

const parsePriceNumber = (value: string) => {
  const match = value.replace(/\s/g, "").match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return null;

  const parsed = Number(match[0].replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

const formatPriceNumber = (template: string, value: number) => {
  const normalized = Math.round(value).toLocaleString("en-US").replace(/,/g, " ");
  if (template.trim().startsWith("$")) return `$${normalized}`;
  if (template.includes("$")) return `${normalized} $`;

  return normalized;
};

function AnimatedEditablePrice({
  item,
  field,
  fallback,
  className,
  onTextChange,
}: {
  item: CanvasItem;
  field: string;
  fallback: string;
  className: string;
  onTextChange: TextChangeHandler;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasCustomValue = hasOwnValue(item.text, field);
  const [displayValue, setDisplayValue] = useState(hasCustomValue ? item.text[field] : fallback);
  const lastFallbackRef = useRef(fallback);

  useEffect(() => {
    if (hasCustomValue) {
      setDisplayValue(item.text[field]);
      return;
    }

    const startValue = parsePriceNumber(lastFallbackRef.current);
    const endValue = parsePriceNumber(fallback);
    lastFallbackRef.current = fallback;

    if (startValue === null || endValue === null || startValue === endValue) {
      setDisplayValue(fallback);
      return;
    }

    let frame = 0;
    const duration = 620;
    const startedAt = performance.now();

    const tick = (time: number) => {
      const progress = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(formatPriceNumber(fallback, startValue + (endValue - startValue) * eased));

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      } else {
        setDisplayValue(fallback);
      }
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [fallback, field, hasCustomValue, item.text]);

  useEffect(() => {
    if (!ref.current || document.activeElement === ref.current) return;
    if (ref.current.textContent !== displayValue) {
      ref.current.textContent = displayValue;
    }
  }, [displayValue]);

  const handleBlur = () => {
    onTextChange(item.instanceId, field, ref.current?.textContent ?? "");
  };

  return (
    <span
      ref={ref}
      className={`editable-text ${className}`.trim()}
      contentEditable
      data-placeholder={fallback}
      suppressContentEditableWarning
      spellCheck={false}
      onBlur={handleBlur}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }

        event.stopPropagation();
      }}
      onPointerDown={(event) => event.stopPropagation()}
    >
      {displayValue}
    </span>
  );
}

const tabbedInfoDefaults = [
  {
    title: "Быстро",
    text: "Покажите главный плюс без лишнего шума: посетитель сразу понимает, куда нажать и зачем.",
    Icon: Clock3,
  },
  {
    title: "Надежно",
    text: "Подчеркните гарантии, опыт, безопасность сделки или понятный порядок работы с клиентом.",
    Icon: ShieldCheck,
  },
  {
    title: "Аккуратно",
    text: "Соберите преимущества в один чистый блок, чтобы страница не расползалась по десяткам карточек.",
    Icon: Sparkles,
  },
  {
    title: "Практично",
    text: "Оставьте только то, что помогает пользователю быстро понять предложение и сделать следующий шаг.",
    Icon: Zap,
  },
  {
    title: "С заботой",
    text: "Добавьте человеческий тон: поддержку, сопровождение, быстрые ответы и внимание к деталям.",
    Icon: Heart,
  },
] satisfies Array<{ title: string; text: string; Icon: LucideIcon }>;

function BuilderTabbedInfo({
  item,
  itemCount,
  sourceIndices,
  removingRepeatableIndex,
  defaultText,
  onTextChange,
  onRepeatableItemRemove,
}: {
  item: CanvasItem;
  itemCount: number;
  sourceIndices: number[];
  removingRepeatableIndex: number | null;
  defaultText: (index: number, fallback: string) => string;
  onTextChange: TextChangeHandler;
  onRepeatableItemRemove?: (index: number) => void;
}) {
  const tabCount = Math.min(5, Math.max(1, itemCount || 1));
  const visibleSourceIndices = sourceIndices.slice(0, tabCount);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTab = Math.min(activeIndex, tabCount - 1);
  const activeSourceIndex = visibleSourceIndices[activeTab] ?? activeTab;
  const activeConfig = tabbedInfoDefaults[activeSourceIndex] ?? tabbedInfoDefaults[0];
  const activeIconField = `tabs.${activeSourceIndex}.icon`;
  const activeIconSource = item.media[activeIconField];

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, tabCount - 1));
  }, [tabCount]);

  const tabText = (field: string, fallback: string, as: EditableTextTag = "span", className = "") => (
    <EditableText item={item} field={field} fallback={fallback} as={as} className={className} onTextChange={onTextChange} />
  );

  return (
    <div className="builder-info-tabs">
      <div className="builder-info-tabs__nav" role="tablist" data-builder-static="true">
        {visibleSourceIndices.map((sourceIndex, index) => {
          const { title } = tabbedInfoDefaults[sourceIndex] ?? tabbedInfoDefaults[0];
          const iconField = `tabs.${sourceIndex}.icon`;
          const uploadedIcon = item.media[iconField];

          return (
          <button
            key={`${sourceIndex}-${title}`}
            type="button"
            className={index === activeTab ? "is-active" : ""}
            aria-label={title}
            aria-selected={index === activeTab}
            role="tab"
            onClick={(event) => {
              event.stopPropagation();
              setActiveIndex(index);
            }}
          >
            {uploadedIcon ? (
              <span className="builder-info-tabs__nav-media" style={{ backgroundImage: `url("${uploadedIcon}")` }} />
            ) : (
              <Image size={22} />
            )}
          </button>
          );
        })}
      </div>
      <section className={`builder-info-tabs__card builder-repeatable-item ${removingRepeatableIndex === activeTab ? "is-removing" : ""}`} role="tabpanel">
        <span className="builder-info-tabs__halo" data-builder-static="true">
          <i
            className={`editable-media-target ${activeIconSource ? "has-uploaded-media" : ""}`.trim()}
            data-media-field={activeIconField}
            style={{
              backgroundImage: activeIconSource ? `url("${activeIconSource}")` : undefined,
              backgroundPosition: activeIconSource ? "center" : undefined,
              backgroundSize: activeIconSource ? "cover" : undefined,
            }}
          >
            <Image size={54} />
          </i>
        </span>
        <div className="builder-info-tabs__copy" key={activeSourceIndex}>
          {tabText(`tabs.${activeSourceIndex}.title`, defaultText(80 + activeSourceIndex * 2, activeConfig.title), "strong")}
          {tabText(`tabs.${activeSourceIndex}.text`, defaultText(81 + activeSourceIndex * 2, activeConfig.text), "p")}
        </div>
        <button
          className="builder-repeatable-item__delete"
          type="button"
          data-builder-static="true"
          aria-label="Удалить вкладку"
          onClick={(event) => {
            event.stopPropagation();
            onRepeatableItemRemove?.(activeTab);
          }}
        >
          <X size={18} strokeWidth={2.4} />
        </button>
      </section>
    </div>
  );
}

type BuilderMarqueeEntry = {
  sourceIndex: number;
  index: number;
  label: string;
};

function BuilderCyclicMarquee({
  items,
  light = false,
  rootClassName,
  trackClassName = "builder-marquee__track",
  itemClassName = "builder-marquee__item",
  renderItem,
  addButton,
}: {
  items: BuilderMarqueeEntry[];
  light?: boolean;
  rootClassName?: string;
  trackClassName?: string;
  itemClassName?: string;
  renderItem: (entry: BuilderMarqueeEntry) => ReactNode;
  addButton: ReactNode;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cycleRef = useRef<HTMLSpanElement>(null);
  const [cycleCount, setCycleCount] = useState(2);
  const isRunning = items.length > 1;

  useEffect(() => {
    if (!isRunning) {
      setCycleCount(1);
      return;
    }

    const updateCycleCount = () => {
      const viewportWidth = viewportRef.current?.clientWidth ?? 0;
      const cycleWidth = cycleRef.current?.scrollWidth ?? 0;

      if (!viewportWidth || !cycleWidth) {
        setCycleCount(3);
        return;
      }

      const nextCycleCount = Math.min(6, Math.max(2, Math.ceil(viewportWidth / cycleWidth) + 1));
      setCycleCount((current) => (current === nextCycleCount ? current : nextCycleCount));
    };

    updateCycleCount();

    if (typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(updateCycleCount);
    if (viewportRef.current) observer.observe(viewportRef.current);
    if (cycleRef.current) observer.observe(cycleRef.current);

    return () => observer.disconnect();
  }, [isRunning, items.length]);

  const cycles = useMemo(
    () => Array.from({ length: isRunning ? cycleCount : 1 }, (_, index) => index),
    [cycleCount, isRunning],
  );
  const duration = Math.max(14, Math.min(42, items.length * 5));
  const className = rootClassName ?? `builder-marquee ${light ? "builder-marquee--light" : ""}`.trim();

  return (
    <div className={className}>
      <div className="builder-marquee__viewport" ref={viewportRef}>
        <div
          className={`${trackClassName} ${isRunning ? "is-running" : ""}`.trim()}
          style={{
            "--marquee-cycles": cycles.length,
            "--marquee-duration": `${duration}s`,
          } as CSSProperties}
        >
          {cycles.map((cycle) => (
            <span
              key={cycle}
              className="builder-marquee__cycle"
              ref={cycle === 0 ? cycleRef : undefined}
            >
              {items.map((entry) => (
                <span key={`${cycle}-${entry.sourceIndex}`} className={itemClassName}>
                  {renderItem(entry)}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
      {addButton}
    </div>
  );
}

function BuilderSwitchingInfoBlock({
  items,
  renderCard,
  renderPreview,
  addButton,
}: {
  items: BuilderMarqueeEntry[];
  renderCard: (entry: BuilderMarqueeEntry) => ReactNode;
  renderPreview: (entry: BuilderMarqueeEntry) => ReactNode;
  addButton: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [isEditingPaused, setIsEditingPaused] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);
  const paused = isHoverPaused || isEditingPaused;

  useEffect(() => {
    setActiveIndex((current) => (items.length ? Math.min(current, items.length - 1) : 0));
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3400);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, items.length, paused, timerResetKey]);

  const selectActiveIndex = (index: number) => {
    setActiveIndex(index);
    setTimerResetKey((current) => current + 1);
  };

  const activeItem = items[activeIndex] ?? items[0];
  const previewItems = items.filter((_, index) => index !== activeIndex);

  const handleFocus = (event: ReactFocusEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest(".editable-text")) {
      setIsEditingPaused(true);
    }
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsEditingPaused(false);
    }
  };

  return (
    <div
      className="builder-marquee builder-marquee--card builder-info-switcher"
      data-paused={paused ? "true" : "false"}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={() => setIsHoverPaused(true)}
      onMouseLeave={() => setIsHoverPaused(false)}
    >
      <span className="builder-info-switcher__orb builder-info-switcher__orb--one" data-builder-static="true" />
      <span className="builder-info-switcher__orb builder-info-switcher__orb--two" data-builder-static="true" />

      {activeItem && (
        <article key={activeItem.sourceIndex} className="builder-info-switcher__active">
          {renderCard(activeItem)}
        </article>
      )}

      <div className="builder-info-switcher__rail" data-builder-static="true">
        {previewItems.slice(0, 3).map((entry, previewIndex) => (
          <button
            key={entry.sourceIndex}
            className="builder-info-switcher__preview"
            type="button"
            style={{ "--preview-index": previewIndex } as CSSProperties}
            onClick={(event) => {
              event.stopPropagation();
              selectActiveIndex(entry.index);
            }}
          >
            {renderPreview(entry)}
          </button>
        ))}
      </div>

      <div className="builder-info-switcher__dots" data-builder-static="true">
        {items.map((entry, index) => (
          <button
            key={entry.sourceIndex}
            className={index === activeIndex ? "is-active" : ""}
            type="button"
            aria-label={`Показать сообщение ${index + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              selectActiveIndex(index);
            }}
          />
        ))}
      </div>

      {addButton}
    </div>
  );
}

function BuilderTeamSpotlight({
  items,
  renderFeatured,
  renderCompact,
  addButton,
}: {
  items: BuilderMarqueeEntry[];
  renderFeatured: (entry: BuilderMarqueeEntry) => ReactNode;
  renderCompact: (entry: BuilderMarqueeEntry, selectEntry: () => void) => ReactNode;
  addButton: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timerResetKey, setTimerResetKey] = useState(0);

  useEffect(() => {
    setActiveIndex((current) => (items.length ? Math.min(current, items.length - 1) : 0));
  }, [items.length]);

  useEffect(() => {
    if (paused || items.length <= 1) return;

    const timeout = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % items.length);
    }, 3600);

    return () => window.clearTimeout(timeout);
  }, [activeIndex, items.length, paused, timerResetKey]);

  const selectEntry = (index: number) => {
    setActiveIndex(index);
    setTimerResetKey((current) => current + 1);
  };
  const activeItem = items[activeIndex] ?? items[0];
  const compactItems = items.filter((_, index) => index !== activeIndex).slice(0, 4);

  return (
    <div
      className="builder-team builder-team--spotlight"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {activeItem && (
        <div key={activeItem.sourceIndex} className="builder-team-spotlight__featured">
          {renderFeatured(activeItem)}
        </div>
      )}
      <div className="builder-team-spotlight__rail">
        <div className="builder-team-spotlight__list">
          {compactItems.map((entry) => renderCompact(entry, () => selectEntry(entry.index)))}
          {addButton}
        </div>
      </div>
    </div>
  );
}

function BuilderTypingMarquee({
  items,
  title,
  getItemText,
  renderActiveItem,
  addButton,
}: {
  items: BuilderMarqueeEntry[];
  title: ReactNode;
  getItemText: (entry: BuilderMarqueeEntry) => string;
  renderActiveItem: (entry: BuilderMarqueeEntry, displayText: string) => ReactNode;
  addButton: ReactNode;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing");
  const [visibleChars, setVisibleChars] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    setActiveIndex((current) => (items.length ? Math.min(current, items.length - 1) : 0));
  }, [items.length]);

  const activeItem = items[activeIndex] ?? items[0];
  const activeText = activeItem ? getItemText(activeItem) : "";
  const activeChars = useMemo(() => Array.from(activeText), [activeText]);

  useEffect(() => {
    setPhase("typing");
    setVisibleChars(0);
  }, [activeItem?.sourceIndex]);

  useEffect(() => {
    setVisibleChars((current) => Math.min(current, activeChars.length));
  }, [activeChars.length]);

  useEffect(() => {
    if (!activeItem || paused) return;

    if (phase === "typing") {
      if (visibleChars < activeChars.length) {
        const timeout = window.setTimeout(() => {
          setVisibleChars((current) => Math.min(activeChars.length, current + 1));
        }, 62);

        return () => window.clearTimeout(timeout);
      }

      setPhase("holding");
      return;
    }

    if (phase === "holding") {
      const timeout = window.setTimeout(() => {
        setPhase("deleting");
      }, 2200);

      return () => window.clearTimeout(timeout);
    }

    if (phase === "deleting") {
      if (visibleChars > 0) {
        const timeout = window.setTimeout(() => {
          setVisibleChars((current) => Math.max(0, current - 1));
        }, 28);

        return () => window.clearTimeout(timeout);
      }

      setActiveIndex((current) => (current + 1) % items.length);
      setPhase("typing");
      return;
    }

    return;
  }, [activeChars.length, activeItem, items.length, paused, phase, visibleChars]);

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setPaused(false);
    }
  };
  const displayText = activeChars.slice(0, visibleChars).join("");

  return (
    <div className="builder-marquee builder-marquee--typing">
      <div className="builder-marquee-typing__content">
        <small className="builder-marquee-typing__badge" data-builder-static="true">typing</small>
        {title}
        <div
          className="builder-marquee-typing__live"
          onFocus={() => setPaused(true)}
          onBlur={handleBlur}
          data-phase={phase}
        >
          {activeItem && renderActiveItem(activeItem, paused ? activeText : displayText)}
        </div>
      </div>
      <div className="builder-marquee-typing__actions">
        {addButton}
      </div>
    </div>
  );
}

function renderBlockContent(
  block: BuilderBlock,
  item: CanvasItem,
  onTextChange: TextChangeHandler,
  builderCopy: BuilderCopy,
  defaultTexts: Record<string, string>,
  pageLinks: PageLink[],
  headerCtaLink: PageLink | null,
  cartProducts: CartProduct[],
  isCartOpen: boolean,
  onCartOpenChange: (value: boolean) => void,
  pricingAnnual: boolean,
  onPricingAnnualChange: (value: boolean) => void,
  authMode: "login" | "register" = "register",
  onAuthModeChange?: (value: "login" | "register") => void,
  authAgreed = false,
  onAuthAgreedChange?: (value: boolean) => void,
  activeAuthModal: AuthModalType | null = null,
  authModalClosing = false,
  onAuthModalOpen?: (modal: AuthModalType) => void,
  onAuthModalClose?: () => void,
  feedbackPublic = false,
  onFeedbackPublicChange?: (value: boolean) => void,
  itemCount = 0,
  catalogPage = 0,
  onCatalogPageChange?: (page: number) => void,
  activeCatalogProduct: number | null = null,
  onActiveCatalogProductChange?: (index: number | null) => void,
  catalogVisibleCount = 6,
  onCatalogVisibleCountChange?: (count: number) => void,
  gallerySlide = 0,
  onGallerySlideChange?: (index: number) => void,
  reviewsSlide = 0,
  onReviewsSlideChange?: (index: number) => void,
  highlightReviewSourceIndex: number | null = null,
  onHighlightReviewChange?: (sourceIndex: number | null) => void,
  onReviewModalOpen?: (data: ReviewModalData) => void,
  removingRepeatableIndex: number | null = null,
  onRepeatableItemRemove?: (index: number) => void,
  onItemOptionChange?: (key: string, value: number) => void
) {
  const defaultText = (index: number, fallback: string) => defaultTexts[`${block.type}.${index}`] ?? fallback;
  const plainText = (field: string, fallback: string) => normalizeRussianMojibake(hasOwnValue(item.text, field) ? item.text[field] : fallback);
  const text = (field: string, fallback: string, as: EditableTextTag = "span", className = "") => (
    <EditableText item={item} field={field} fallback={fallback} as={as} className={className} onTextChange={onTextChange} />
  );
  const repeatableSourceIndices = getRepeatableSourceIndices(item, block.type);
  const repeatableClass = (index: number, className = "") =>
    `builder-repeatable-item ${className} ${removingRepeatableIndex === index ? "is-removing" : ""}`.trim();
  const removeItemButton = (index: number, label = "Удалить пункт") => (
    <button
      className="builder-repeatable-item__delete"
      type="button"
      data-builder-static="true"
      aria-label={label}
      onClick={(event) => {
        event.stopPropagation();
        onRepeatableItemRemove?.(index);
      }}
    >
      <X size={18} strokeWidth={2.4} />
    </button>
  );
  const addItemButton = (_label = "Добавить") => null;
  const handleBuilderNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, instanceId: string) => {
    event.preventDefault();
    event.stopPropagation();

    const canvas = event.currentTarget.closest(".site-builder__canvas");
    const target = canvas?.querySelector<HTMLElement>(`#builder-section-${instanceId}`);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const headerCta = (fallback = "Начать") => {
    if (!headerCtaLink) return text("auto-text.3", defaultText(3, fallback), "button");

    const label = headerCtaLink.label === "Авторизация"
      ? headerCtaLink.label
      : plainText("auto-text.3", defaultText(3, fallback));

    return (
      <a
        className="builder-header__cta"
        href={`#builder-section-${headerCtaLink.instanceId}`}
        data-builder-static="true"
        onClick={(event) => handleBuilderNavClick(event, headerCtaLink.instanceId)}
      >
        {label}
      </a>
    );
  };

  switch (block.type) {
    case "header":
      const headerNav = pageLinks.length ? pageLinks.map((link) => (
        <a
          key={link.instanceId}
          href={`#builder-section-${link.instanceId}`}
          onClick={(event) => handleBuilderNavClick(event, link.instanceId)}
        >
          {link.label}
        </a>
      )) : (
        <>
          {text("auto-text.0", defaultText(0, "Главная"))}
          {text("auto-text.1", defaultText(1, "Каталог"))}
          {text("auto-text.2", defaultText(2, "Контакты"))}
        </>
      );

      if (block.variant === "store") {
        return (
          <div className="builder-header builder-header--store">
            <div className="builder-header__brand">
              <span className="builder-header__logo" data-media-field="header.logo"><i /></span>
              {text("header.brand", getBuilderText(builderCopy, "builder.default.headerBrand"), "strong")}
            </div>
            <div className="builder-header__search">
              {text("header.search", getBuilderText(builderCopy, "builder.header.search"))}
            </div>
            <nav>{headerNav}</nav>
            {headerCta("Оплата")}
            <div className="builder-header__cart-wrap" data-builder-static="true">
              <button
                className="builder-header__cart"
                type="button"
                aria-label="Корзина"
                aria-expanded={isCartOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  onCartOpenChange(!isCartOpen);
                }}
              >
                <ShoppingBag size={18} />
                <span>{cartProducts.length}</span>
              </button>
              {isCartOpen && (
                <div className="builder-header__cart-panel">
                  <strong>{cartProducts.length ? "Корзина" : "Каталог не добавлен"}</strong>
                  {cartProducts.length ? (
                    <>
                      {cartProducts.slice(0, 4).map((product, index) => (
                        <div key={`${product.name}-${index}`}>
                          <span>{product.name}</span>
                          <small>{product.price}</small>
                        </div>
                      ))}
                      {cartProducts.length > 4 && <em>+{cartProducts.length - 4} еще</em>}
                    </>
                  ) : (
                    <p>Добавьте блок каталога, и товары появятся здесь автоматически.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      }

      if (block.variant === "glass") {
        return (
          <div className="builder-header builder-header--glass">
            <div className="builder-header__brand">
              <span className="builder-header__logo" data-media-field="header.logo"><i /></span>
              {text("header.brand", getBuilderText(builderCopy, "builder.default.headerBrand"), "strong")}
            </div>
            <nav>{headerNav}</nav>
            {headerCta("Начать")}
          </div>
        );
      }

      if (block.variant === "dark" || block.variant === "pill") {
        return (
          <div className={`builder-header builder-header--${block.variant}`}>
            <div className="builder-header__brand">
              <span className="builder-header__logo" data-media-field="header.logo"><i /></span>
              {text("header.brand", getBuilderText(builderCopy, "builder.default.headerBrand"), "strong")}
            </div>
            <nav>{headerNav}</nav>
            {headerCta(block.variant === "dark" ? "Старт" : "Начать")}
          </div>
        );
      }

      return (
        <div className="builder-header builder-header--logo">
          <div className="builder-header__brand">
            <span className="builder-header__logo" data-media-field="header.logo"><i /></span>
            {text("header.brand", getBuilderText(builderCopy, "builder.default.headerBrand"), "strong")}
          </div>
          <nav>{headerNav}</nav>
          {headerCta("Старт")}
        </div>
      );
    case "hero":
      if (block.variant === "majestic-strip") {
        return (
          <div className="builder-majestic-strip">
            <div className="builder-majestic-strip__cards">
              {Array.from({ length: 7 }, (_, index) => (
                <span
                  key={index}
                  className={`builder-majestic-strip__media builder-majestic-strip__media--${index}`}
                  data-media-field={`majestic-strip.${index}.image`}
                >
                  <i />
                  <em />
                </span>
              ))}
            </div>
          </div>
        );
      }

      const heroDefaults = block.variant === "majestic"
        ? {
            eyebrow: "Динамичный старт",
            title: "Баннер с живым визуалом",
            text: "Загрузите картинку: она будет мягко подпрыгивать и сразу цеплять внимание в первом экране.",
            secondText: "Подходит для промо, обуви, одежды, игровых предметов и ярких продуктовых запусков.",
            thirdText: "Картинка двигается сама, а текст остается статичным и понятным для клиента.",
            button: "Смотреть",
            secondButton: "Оставить заявку",
          }
        : block.variant === "product"
          ? {
            eyebrow: "Витрина продукта",
            title: "Покажите товар так, чтобы его захотели купить",
            text: "Крупный визуал, цена, выгоды и быстрый переход к покупке без лишнего поиска.",
            secondText: "Добавьте подборку товаров, акцию, комплектацию и понятную кнопку заказа.",
            thirdText: "Подходит для магазинов, промо-страниц, новинок и быстрых запусков продаж.",
            button: "Смотреть товар",
            secondButton: "В корзину",
            }
          : block.variant === "app"
            ? {
                eyebrow: "Стартовый блок",
                title: "Сайты, которые продают и быстро запускаются",
                text: "Делаем адаптивные лендинги, каталоги и корпоративные страницы с понятной структурой.",
                secondText: "Выберите макет, добавьте контент и сразу покажите клиенту готовую механику.",
                thirdText: "Карусель, две кнопки и печатающееся описание работают как главный баннер сайта.",
                button: "Выбрать макет",
                secondButton: "Как заказать?",
              }
            : {
                eyebrow: "Стартовый блок",
                title: "Сайты, которые продают и быстро запускаются",
                text: "Короткий оффер, понятный следующий шаг и визуальный акцент.",
                secondText: "Покажите пользу, сроки запуска и действие, которое должен сделать клиент.",
                thirdText: "Меняйте этот текст под оффер, акцию, услугу или запуск продукта.",
                button: "Выбрать макет",
                secondButton: "Как заказать?",
              };
      const heroText = (index: number, fallback: string) =>
        block.variant === "majestic" ? fallback : defaultText(index, fallback);
      const heroVisualClass = block.variant === "product"
        ? "builder-hero-product-slot"
        : block.variant === "app"
          ? "builder-hero-app-slot"
          : block.variant === "majestic"
            ? "builder-hero-jump-slot"
          : [
              "builder-hero__visual",
              "builder-hero__visual--carousel",
            ].filter(Boolean).join(" ");

      return (
        <div className="builder-hero">
          <div>
            {text("auto-text.0", heroText(0, heroDefaults.eyebrow))}
            {text("auto-text.1", heroText(1, heroDefaults.title), "h3")}
            {block.variant === "product" || block.variant === "majestic" ? (
              text("auto-text.2", heroText(2, heroDefaults.text), "p", "builder-hero__static-copy")
            ) : (
              <BuilderHeroTypingCopy
                item={item}
                entries={[
                  { field: "auto-text.2", fallback: heroText(2, heroDefaults.text) },
                  { field: "auto-text.5", fallback: heroText(5, heroDefaults.secondText) },
                  { field: "auto-text.6", fallback: heroText(6, heroDefaults.thirdText) },
                ]}
                onTextChange={onTextChange}
              />
            )}
            <div className="builder-hero__actions">
              {text("auto-text.3", heroText(3, heroDefaults.button), "button")}
              {text("auto-text.4", heroText(4, heroDefaults.secondButton), "button")}
            </div>
          </div>
          <div className={heroVisualClass}>
            {block.variant === "majestic" ? (
              <div className="builder-hero-jump__media" data-media-field="hero.majestic.image">
                <Image size={58} strokeWidth={1.9} />
              </div>
            ) : block.variant === "app" ? (
              <div className="builder-hero__carousel">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className={`builder-hero__slide builder-hero__slide--${index}`}
                    data-media-field={`hero.${index}.image`}
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                ))}
                <div className="builder-hero__dots" data-builder-static="true">
                  <span />
                  <span />
                  <span />
                </div>
                <small data-builder-static="true">01/03</small>
              </div>
            ) : block.variant === "product" ? (
              <BuilderMagneticHeroImage />
            ) : (
              <div className="builder-hero__carousel">
                {[0, 1, 2].map((index) => (
                  <span
                    key={index}
                    className={`builder-hero__slide builder-hero__slide--${index}`}
                    data-media-field={`hero.${index}.image`}
                  >
                    <i />
                    <i />
                    <i />
                  </span>
                ))}
                <div className="builder-hero__dots" data-builder-static="true">
                  <span />
                  <span />
                  <span />
                </div>
                <small data-builder-static="true">01/03</small>
              </div>
            )}
          </div>
        </div>
      );
    case "cards":
      if (block.variant === "tabs") {
        return (
          <BuilderTabbedInfo
            item={item}
            itemCount={itemCount}
            sourceIndices={repeatableSourceIndices}
            removingRepeatableIndex={removingRepeatableIndex}
            defaultText={defaultText}
            onTextChange={onTextChange}
            onRepeatableItemRemove={onRepeatableItemRemove}
          />
        );
      }

      if (block.variant === "metrics") {
        return (
          <div className="builder-cards builder-cards--metrics">
            {repeatableSourceIndices.map((sourceIndex, index) => {
              const value = ["98%", "24ч", "4.9", "12k", "7д", "3x", "60%", "1м"][sourceIndex] ?? `${sourceIndex + 1}x`;

              return (
              <div key={`${sourceIndex}-${value}`} className={repeatableClass(index)}>
                {text(`auto-text.${sourceIndex * 3}`, defaultText(sourceIndex * 3, value), "strong")}
                {text(`auto-text.${sourceIndex * 3 + 1}`, defaultText(sourceIndex * 3 + 1, ["Заявок", "Ответ", "Оценка", "Клиентов"][sourceIndex] ?? "Метрика"), "span")}
                {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, "Короткое пояснение цифры и почему она важна."), "p")}
                {removeItemButton(index)}
              </div>
              );
            })}
            {addItemButton("Добавить метрику")}
          </div>
        );
      }

      if (block.variant === "process") {
        return (
          <div className="builder-cards builder-cards--process">
            {repeatableSourceIndices.map((sourceIndex, index) => {
              const title = ["Бриф", "Дизайн", "Запуск", "Контент", "Тесты", "Рост", "CRM", "Оплата"][sourceIndex] ?? `Шаг ${sourceIndex + 1}`;

              return (
              <div key={`${sourceIndex}-${title}`} className={repeatableClass(index)}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {text(`auto-text.${sourceIndex * 2}`, defaultText(sourceIndex * 2, title), "strong")}
                {text(`auto-text.${sourceIndex * 2 + 1}`, defaultText(sourceIndex * 2 + 1, "Короткое описание шага, результата и следующего действия."), "p")}
                {removeItemButton(index)}
              </div>
              );
            })}
            {addItemButton("Добавить шаг")}
          </div>
        );
      }

      return (
        <div className="builder-cards">
          {repeatableSourceIndices.map((sourceIndex, index) => {
            const title = ["Скорость", "Доверие", "Рост", "Поддержка", "Запуск", "Продажи", "Контент", "Сервис"][sourceIndex] ?? `Карточка ${sourceIndex + 1}`;

            return (
            <div key={`${sourceIndex}-${title}`} className={repeatableClass(index)}>
              <span />
              {text(`auto-text.${sourceIndex * 2}`, defaultText(sourceIndex * 2, title), "strong")}
              {text(`auto-text.${sourceIndex * 2 + 1}`, defaultText(sourceIndex * 2 + 1, "Короткий текст карточки с пользой."), "p")}
              {removeItemButton(index)}
            </div>
            );
          })}
          {addItemButton("Добавить карточку")}
        </div>
      );
    case "form":
      if (block.variant === "split") {
        const rawFeedbackRating = item.options?.rating;
        const feedbackRating = Math.min(
          5,
          Math.max(1, Math.round(typeof rawFeedbackRating === "number" ? rawFeedbackRating : Number(rawFeedbackRating) || 5))
        );

        return (
          <div className="builder-form builder-form--feedback">
            <div className="builder-form__intro">
              {text("auto-text.20", defaultText(20, "Оставьте отзыв"), "h3")}
              {text("auto-text.21", defaultText(21, "Соберите оценку клиента, контакт, публичный отзыв и короткий фидбек после заказа или проекта."), "p")}
              <div className="builder-form__rating">
                <div className="builder-form__rating-stars" data-builder-static="true" role="radiogroup" aria-label="Оценка клиента">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      className={`builder-form__rating-star ${rating <= feedbackRating ? "is-active" : ""}`}
                      aria-label={`${rating} из 5`}
                      aria-checked={feedbackRating === rating}
                      role="radio"
                      onClick={(event) => {
                        event.stopPropagation();
                        onItemOptionChange?.("rating", rating);
                      }}
                    >
                      <Star size={20} />
                    </button>
                  ))}
                </div>
                {text("auto-text.27", defaultText(27, "Оценка клиента"))}
              </div>
            </div>
            <form className="builder-form__card builder-feedback-form">
              <div className="builder-form__row">
                <label>
                  {text("feedback.label.0", getBuilderText(builderCopy, "builder.feedback.label.name"), "small")}
                  {text("auto-text.22", defaultText(22, "Имя клиента"), "span", "builder-form__field")}
                </label>
                <label>
                  {text("feedback.label.1", getBuilderText(builderCopy, "builder.feedback.label.contact"), "small")}
                  {text("auto-text.23", defaultText(23, "Email или телефон"), "span", "builder-form__field")}
                </label>
              </div>
              <label>
                {text("feedback.label.2", getBuilderText(builderCopy, "builder.feedback.label.review"), "small")}
                {text("auto-text.24", defaultText(24, "Что понравилось в работе или покупке?"), "span", "builder-form__field builder-form__field--textarea")}
              </label>
              <label>
                {text("feedback.label.3", getBuilderText(builderCopy, "builder.feedback.label.note"), "small")}
                {text("auto-text.25", defaultText(25, "Что можно улучшить в следующий раз?"), "span", "builder-form__field")}
              </label>
              <div className="builder-form__checks">
                <button
                  className={`builder-feedback-form__check ${feedbackPublic ? "is-checked" : ""}`}
                  type="button"
                  data-builder-static="true"
                  aria-pressed={feedbackPublic}
                  onClick={(event) => {
                    event.stopPropagation();
                    onFeedbackPublicChange?.(!feedbackPublic);
                  }}
                >
                  <span aria-hidden="true" />
                  {plainText("auto-text.28", defaultText(28, "Можно опубликовать отзыв"))}
                </button>
                {text("auto-text.29", defaultText(29, "Менеджер свяжется для уточнения"))}
              </div>
              <div className="builder-form__actions">
                {text("auto-text.26", defaultText(26, "Отправить отзыв"), "button")}
              </div>
            </form>
          </div>
        );
      }

      const authIsLogin = authMode === "login";
      const authSocialProviders = [
        {
          name: "Google",
          modifier: "google",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285f4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.1h6c-.3 1.4-1.1 2.6-2.3 3.4v2.8h3.7c2.1-2 3.3-4.9 3.3-8.1z" />
              <path fill="#34a853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.7-2.8c-1 .7-2.3 1.1-3.7 1.1-2.8 0-5.2-1.9-6-4.5H2.2v2.9C4 20.5 7.6 23 12 23z" />
              <path fill="#fbbc05" d="M6 14.1c-.2-.7-.4-1.4-.4-2.1s.1-1.5.4-2.1V7H2.2C1.4 8.5 1 10.2 1 12s.4 3.5 1.2 5l3.8-2.9z" />
              <path fill="#ea4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2C17.5 2.1 15 1 12 1 7.6 1 4 3.5 2.2 7L6 9.9c.8-2.6 3.2-4.5 6-4.5z" />
            </svg>
          ),
        },
        {
          name: "Yandex",
          modifier: "yandex",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#fc3f1d" d="M13.9 22h-3.1V9.8L6.2 22H3.5L8.2 9.1c-2.1-1-3.2-2.8-3.2-5.1C5 1.4 6.8 0 10.2 0h3.7v22zM10.8 2.6c-1.7 0-2.7.8-2.7 2.4s.9 2.5 2.7 2.5h.1V2.6h-.1z" />
            </svg>
          ),
        },
        {
          name: "Facebook",
          modifier: "facebook",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#1877f2" d="M22 12a10 10 0 1 0-11.6 9.9v-7h-2.5V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" />
            </svg>
          ),
        },
        {
          name: "VK",
          modifier: "vk",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#2787f5" d="M12.8 18.5c-6.6 0-10.4-4.5-10.5-12h3.3c.1 5.5 2.5 7.8 4.3 8.3V6.5H13v4.7c1.8-.2 3.6-2 4.2-4.7h3.1c-.5 3.3-2.7 5.1-4.2 5.9 1.5.6 3.9 2.2 4.8 6.1h-3.5c-.7-2.6-2.5-4.6-4.4-4.8v4.8h-.4z" />
            </svg>
          ),
        },
        {
          name: "Telegram",
          modifier: "telegram",
          icon: (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#2aabee" d="M22 4.2 18.7 20c-.2 1.1-.9 1.4-1.9.9l-5.2-3.8-2.5 2.4c-.3.3-.5.5-1 .5l.4-5.3 9.6-8.7c.4-.4-.1-.6-.6-.2L5.6 13.2.5 11.6c-1.1-.4-1.1-1.1.2-1.6L20.1 2.5c.9-.3 1.7.2 1.4 1.7z" />
            </svg>
          ),
        },
      ];
      const authTabButton = (mode: "login" | "register", label: string) => (
        <button
          className={authMode === mode ? "is-active" : ""}
          type="button"
          data-builder-static="true"
          onClick={(event) => {
            event.stopPropagation();
            onAuthModeChange?.(mode);
          }}
        >
          {label}
        </button>
      );

      return (
        <>
          <div className="builder-form builder-form--auth">
            <div className="builder-form__intro">
              {text(authIsLogin ? "auth.title.login" : "auto-text.0", authIsLogin ? "Войти в аккаунт" : defaultText(0, "Создать аккаунт"), "h3")}
              {text(
                authIsLogin ? "auth.text.login" : "auth.text.register",
                authIsLogin
                  ? "Быстрый вход в личный кабинет: заявки, заказы, профиль и сохраненные настройки уже на месте."
                  : "Регистрация для нового клиента: доступ к заказам, подпискам, настройкам профиля и закрытым разделам сервиса.",
                "p"
              )}
              <div className="builder-form__benefits">
                {authIsLogin ? (
                  <>
                    {text("auth.login.badge.0", "Быстрый вход")}
                    {text("auth.login.badge.1", "Сброс пароля")}
                    {text("auth.login.badge.2", "Безопасная сессия")}
                  </>
                ) : (
                  <>
                    {text("auto-text.10", defaultText(10, "Безопасный доступ"))}
                    {text("auth.badge.0", getBuilderText(builderCopy, "builder.auth.badge.account"))}
                    {text("auth.badge.1", getBuilderText(builderCopy, "builder.auth.badge.email"))}
                  </>
                )}
              </div>
            </div>
            <form className="builder-form__card builder-auth-form">
              <div className="builder-auth-form__tabs">
                {authTabButton("login", plainText("auto-text.8", defaultText(8, "Вход")))}
                {authTabButton("register", plainText("auto-text.9", defaultText(9, "Регистрация")))}
              </div>
              <div className="builder-auth-form__socials" data-builder-static="true">
                <small>{getBuilderText(builderCopy, authIsLogin ? "builder.auth.social.login" : "builder.auth.social.register")}</small>
                <div>
                  {authSocialProviders.map((provider) => (
                    <button
                      key={provider.name}
                      className={`builder-auth-form__social builder-auth-form__social--${provider.modifier}`}
                      type="button"
                      aria-label={provider.name}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <span>{provider.icon}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label>
                {text("auth.label.0", getBuilderText(builderCopy, "builder.auth.label.login"), "small")}
                {text("auto-text.2", defaultText(2, "Email или логин"), "span", "builder-form__field")}
              </label>
              <label>
                {text("auth.label.1", getBuilderText(builderCopy, "builder.auth.label.password"), "small")}
                {text("auto-text.3", defaultText(3, "Пароль"), "span", "builder-form__field builder-form__field--password")}
              </label>
              <label className={`builder-auth-form__repeat ${authIsLogin ? "is-hidden" : ""}`} aria-hidden={authIsLogin}>
                {text("auth.label.2", getBuilderText(builderCopy, "builder.auth.label.repeat"), "small")}
                {text("auto-text.4", defaultText(4, "Повторите пароль"), "span", "builder-form__field builder-form__field--password")}
              </label>
              <div className="builder-form__checks">
                <div className="builder-auth-form__checkline" data-builder-static="true">
                  <button
                    className={`builder-auth-form__checkmark ${authAgreed ? "is-checked" : ""}`}
                    type="button"
                    aria-pressed={authAgreed}
                    onClick={(event) => {
                      event.stopPropagation();
                      onAuthAgreedChange?.(!authAgreed);
                    }}
                  >
                    <span aria-hidden="true" />
                  </button>
                  {authIsLogin ? (
                    <span className="builder-auth-form__check-text">{getBuilderText(builderCopy, "builder.auth.remember")}</span>
                  ) : (
                    <span className="builder-auth-form__check-text">
                      {getBuilderText(builderCopy, "builder.auth.agreePrefix")}{" "}
                      <button
                        className="builder-auth-form__link"
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          onAuthModalOpen?.("terms");
                        }}
                      >
                        {getBuilderText(builderCopy, "builder.auth.termsLink")}
                      </button>
                    </span>
                  )}
                </div>
                <button
                  className="builder-auth-form__forgot"
                  type="button"
                  data-builder-static="true"
                  onClick={(event) => {
                    event.stopPropagation();
                    onAuthModalOpen?.("reset");
                  }}
                >
                  {getBuilderText(builderCopy, "builder.auth.forgot")}
                </button>
              </div>
              <div className="builder-form__actions">
                {text(authIsLogin ? "auth.cta.login" : "auto-text.6", authIsLogin ? "Войти" : defaultText(6, "Создать аккаунт"), "button")}
                <small className={`builder-auth-form__switch ${authIsLogin ? "is-hidden" : ""}`} data-builder-static="true" aria-hidden={authIsLogin}>
                  Уже есть аккаунт?{" "}
                  <button
                    type="button"
                    tabIndex={authIsLogin ? -1 : 0}
                    onClick={(event) => {
                      event.stopPropagation();
                      onAuthModeChange?.("login");
                    }}
                  >
                    Войти
                  </button>
                </small>
              </div>
            </form>
          </div>
          {activeAuthModal && (
            <BuilderAuthModal
              item={item}
              type={activeAuthModal}
              closing={authModalClosing}
              onClose={onAuthModalClose ?? (() => undefined)}
              onTextChange={onTextChange}
            />
          )}
        </>
      );
    case "map":
      if (block.variant === "points") {
        return (
          <div className="builder-map builder-map--points">
            <div className="builder-map__grid builder-map__grid--routes">
              <span />
              <span />
              <span />
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="builder-map__content">
              {text("auto-text.5", defaultText(5, "Точки выдачи"), "h3")}
              {text("auto-text.6", defaultText(6, "Покажите несколько филиалов, зоны выдачи, загрузку точек и выбранный пункт на карте."), "p")}
              <div className="builder-map__points-list">
                <div>
                  {text("auto-text.7", defaultText(7, "Центральный филиал"), "strong")}
                  {text("auto-text.8", defaultText(8, "Открыто до 21:00"), "span")}
                </div>
                <div>
                  {text("auto-text.9", defaultText(9, "Северная точка"), "strong")}
                  {text("auto-text.10", defaultText(10, "12 заказов готовы"), "span")}
                </div>
                <div>
                  {text("auto-text.11", defaultText(11, "Южный склад"), "strong")}
                  {text("auto-text.12", defaultText(12, "Курьерская отправка"), "span")}
                </div>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="builder-map">
          <div className="builder-map__grid">
            <i />
            <i />
            <i />
          </div>
          <div className="builder-map__content">
            {text("auto-text.0", defaultText(0, "Где нас найти"), "h3")}
            {text("auto-text.1", defaultText(1, "Покажите посетителям адрес, часы работы, точку выдачи и быстрый маршрут."), "p")}
            <div className="builder-map__meta">
              {text("auto-text.2", defaultText(2, "ул. Маркетная, 12"))}
              {text("auto-text.3", defaultText(3, "Пн-Пт, 10:00-19:00"))}
            </div>
            {text("auto-text.4", defaultText(4, "Построить маршрут"), "button")}
          </div>
        </div>
      );
    case "catalog":
      const catalogPageSize = 6;
      const catalogPageCount = Math.max(1, Math.ceil(itemCount / catalogPageSize));
      const safeCatalogPage = Math.min(catalogPage, catalogPageCount - 1);
      const catalogItems = repeatableSourceIndices.map((sourceIndex, index) => ({ sourceIndex, index }));
      const isLoadMoreCatalog = block.variant === "feature";
      const safeCatalogVisibleCount = Math.min(itemCount, Math.max(catalogPageSize, catalogVisibleCount));
      const visibleCatalogItems = isLoadMoreCatalog
        ? catalogItems.slice(0, safeCatalogVisibleCount)
        : catalogItems.slice(safeCatalogPage * catalogPageSize, safeCatalogPage * catalogPageSize + catalogPageSize);
      const catalogValue = (index: number, offset: number, fallback: string) => defaultText(index * 10 + offset, fallback);
      const renderCatalogImage = (index: number, modal = false) => (
        <span
          className={`${modal ? "builder-product-modal__media" : "builder-catalog__image"} builder-catalog__image--${index % 6}`}
          data-media-field={`catalog.${index}.image`}
        >
          <i />
          <i />
          <i />
        </span>
      );
      const renderCatalogCard = ({ sourceIndex, index }: { sourceIndex: number; index: number }) => {
        const catalogItem = sourceIndex + 1;

        return (
          <article key={sourceIndex} className={repeatableClass(index, "builder-catalog__card")}>
            {text(`auto-text.${sourceIndex * 10}`, catalogValue(sourceIndex, 0, ["ХИТ", "-15%", "NEW", "PRO", "TOP", "DESK"][sourceIndex] ?? "NEW"), "small", "builder-catalog__badge")}
            {renderCatalogImage(sourceIndex)}
            <div className="builder-catalog__body">
              {text(`auto-text.${sourceIndex * 10 + 1}`, catalogValue(sourceIndex, 1, ["NovaBook Air 14", "ClearSound Max", "PixelWay S", "Canon EOS Kit", "SmartWatch Pro", "Slim Keyboard"][sourceIndex] ?? `Товар ${catalogItem}`), "strong")}
              {text(`auto-text.${sourceIndex * 10 + 2}`, catalogValue(sourceIndex, 2, "Описание товара: чем полезен, кому подходит и почему его стоит купить."), "p")}
              <div className="builder-catalog__chips">
                {text(`auto-text.${sourceIndex * 10 + 3}`, catalogValue(sourceIndex, 3, "Быстрая доставка"), "small")}
                {text(`auto-text.${sourceIndex * 10 + 4}`, catalogValue(sourceIndex, 4, "Гарантия"), "small")}
                {text(`auto-text.${sourceIndex * 10 + 5}`, catalogValue(sourceIndex, 5, "В наличии"), "small")}
              </div>
              <div className="builder-catalog__buy">
                {text(`auto-text.${sourceIndex * 10 + 6}`, catalogValue(sourceIndex, 6, `$${[1290, 260, 780, 540, 310, 140][sourceIndex] ?? 190}`), "strong", "builder-catalog__cost")}
                {text(`auto-text.${sourceIndex * 10 + 7}`, catalogValue(sourceIndex, 7, "В корзину"), "button")}
              </div>
              <button
                className="builder-catalog__more"
                type="button"
                data-builder-static="true"
                onClick={(event) => {
                  event.stopPropagation();
                  onActiveCatalogProductChange?.(sourceIndex);
                }}
              >
                {getBuilderText(builderCopy, "builder.catalog.more")}
              </button>
            </div>
            {removeItemButton(index, "Удалить товар")}
          </article>
        );
      };

      return (
        <div className={`builder-catalog ${isLoadMoreCatalog ? "builder-catalog--load-more" : "builder-catalog--paged"}`}>
          <div className="builder-catalog__grid">
            {visibleCatalogItems.map((catalogItem) => renderCatalogCard(catalogItem))}
            {addItemButton("Добавить товар")}
          </div>
          {!isLoadMoreCatalog && catalogPageCount > 1 && (
            <div className="builder-catalog__pagination" data-builder-static="true">
              {Array.from({ length: catalogPageCount }, (_, index) => (
                <button
                  key={index}
                  className={index === safeCatalogPage ? "is-active" : ""}
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onCatalogPageChange?.(index);
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
          {isLoadMoreCatalog && itemCount > safeCatalogVisibleCount && (
            <div className="builder-catalog__load-more" data-builder-static="true">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCatalogVisibleCountChange?.(Math.min(itemCount, safeCatalogVisibleCount + catalogPageSize));
                }}
              >
                {getBuilderText(builderCopy, "builder.catalog.loadMore")}
              </button>
              <span>{safeCatalogVisibleCount} / {itemCount}</span>
            </div>
          )}
          {activeCatalogProduct !== null && repeatableSourceIndices.includes(activeCatalogProduct) && (
            <div
              className="builder-product-modal"
              data-builder-static="true"
              role="dialog"
              aria-modal="true"
              onMouseDown={(event) => {
                if (event.currentTarget === event.target) onActiveCatalogProductChange?.(null);
              }}
            >
              <div className="builder-product-modal__panel">
                <button
                  className="builder-product-modal__close"
                  type="button"
                  aria-label={getBuilderText(builderCopy, "builder.catalog.close")}
                  onClick={() => onActiveCatalogProductChange?.(null)}
                >
                  <X size={24} />
                </button>
                <div className="builder-product-modal__visual">
                  {renderCatalogImage(activeCatalogProduct, true)}
                </div>
                <div className="builder-product-modal__content">
                  {text(`auto-text.${activeCatalogProduct * 10}`, catalogValue(activeCatalogProduct, 0, "NEW"), "small", "builder-catalog__badge")}
                  {text(`auto-text.${activeCatalogProduct * 10 + 1}`, catalogValue(activeCatalogProduct, 1, `Товар ${activeCatalogProduct + 1}`), "h3")}
                  {text(`auto-text.${activeCatalogProduct * 10 + 2}`, catalogValue(activeCatalogProduct, 2, "Подробное описание товара, его сценарии использования и главные преимущества для покупателя."), "p")}
                  <div className="builder-product-modal__specs">
                    {text(`auto-text.${activeCatalogProduct * 10 + 3}`, catalogValue(activeCatalogProduct, 3, "Быстрая доставка"), "small")}
                    {text(`auto-text.${activeCatalogProduct * 10 + 4}`, catalogValue(activeCatalogProduct, 4, "Гарантия"), "small")}
                    {text(`auto-text.${activeCatalogProduct * 10 + 5}`, catalogValue(activeCatalogProduct, 5, "В наличии"), "small")}
                  </div>
                  {text(`auto-text.${activeCatalogProduct * 10 + 9}`, catalogValue(activeCatalogProduct, 9, "Комплектация, доставка, размеры, материалы, условия возврата и все подробности, которые нужны покупателю перед заказом."), "p", "builder-product-modal__details")}
                  <div className="builder-product-modal__bottom">
                    {text(`auto-text.${activeCatalogProduct * 10 + 6}`, catalogValue(activeCatalogProduct, 6, "$190"), "strong", "builder-catalog__cost")}
                    {text(`auto-text.${activeCatalogProduct * 10 + 7}`, catalogValue(activeCatalogProduct, 7, "В корзину"), "button")}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    case "pricing":
      const pricingNames = ["Basic", "Pro", "Max", "Team", "Business", "Enterprise", "Ultra", "Custom"];
      const pricingMonthlyPrices = block.variant === "focus"
        ? ["0 $", "49 $", "129 $", "249 $", "499 $", "990 $", "1490 $", "Custom"]
        : ["19 $", "49 $", "99 $", "149 $", "249 $", "399 $", "599 $", "Custom"];
      const pricingAnnualPrices = block.variant === "focus"
        ? ["0 $", "470 $", "1238 $", "2390 $", "4790 $", "9500 $", "14300 $", "Custom"]
        : ["182 $", "470 $", "950 $", "1430 $", "2390 $", "3830 $", "5750 $", "Custom"];
      const pricingPrices = pricingAnnual ? pricingAnnualPrices : pricingMonthlyPrices;
      const pricingIsPremium = block.variant === "classic";
      const pricingHasBilling = block.variant === "classic" || block.variant === "focus";
      const pricingPeriod = pricingAnnual
        ? getBuilderText(builderCopy, "builder.pricing.perYear")
        : getBuilderText(builderCopy, "builder.pricing.perMonth");
      const pricingFeatureDefaults = [
        ["Начальный доступ", "Базовая аналитика", "Email-поддержка"],
        ["Безлимитные заявки", "Интеграция CRM", "Приоритетная поддержка"],
        ["Каталог и оплата", "Автоматизация", "Персональная настройка"],
        ["Командный доступ", "Несколько страниц", "Расширенная поддержка"],
      ];

      return (
        <div className={`builder-pricing builder-pricing--${block.variant}${pricingIsPremium ? " builder-pricing--premium" : ""}`}>
          {pricingHasBilling && (
            <div className={`builder-pricing__billing ${pricingIsPremium ? "builder-pricing__billing--premium" : "builder-pricing__billing--focus"} ${pricingAnnual ? "is-annual" : "is-monthly"}`} data-builder-static="true">
              <span className="builder-pricing__billing-track" />
              <button
                className={!pricingAnnual ? "is-active" : ""}
                type="button"
                aria-pressed={!pricingAnnual}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  onPricingAnnualChange(false);
                }}
              >
                {getBuilderText(builderCopy, "builder.pricing.month")}
              </button>
              <button
                className={pricingAnnual ? "is-active" : ""}
                type="button"
                aria-pressed={pricingAnnual}
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation();
                  onPricingAnnualChange(true);
                }}
              >
                {getBuilderText(builderCopy, "builder.pricing.year")}
              </button>
            </div>
          )}
          <div className="builder-pricing__intro">
            {text("auto-text.0", defaultText(0, pricingIsPremium ? "Выберите тариф" : "Тарифы с акцентом на рост"), "h3")}
            {text("auto-text.1", defaultText(1, pricingIsPremium ? "Покажите разницу между пакетами понятно: цена, кому подходит и что входит внутрь." : "Выделите главный пакет, покажите экономию и помогите клиенту быстро выбрать подходящий уровень."), "p")}
          </div>
          <div className="builder-pricing__grid">
            {repeatableSourceIndices.map((sourceIndex, index) => {
              const title = pricingNames[sourceIndex] ?? `Plan ${sourceIndex + 1}`;

              return (
              <div key={`${sourceIndex}-${title}`} className={repeatableClass(index, index === 1 ? "is-featured" : "")}>
                {text(`auto-text.${sourceIndex * 7 + 2}`, defaultText(sourceIndex * 7 + 2, title), "strong")}
                <AnimatedEditablePrice
                  item={item}
                  field={`auto-text.${sourceIndex * 7 + 3}`}
                  fallback={pricingPrices[sourceIndex] ?? "Custom"}
                  className="builder-pricing__cost"
                  onTextChange={onTextChange}
                />
                {text(`auto-text.${sourceIndex * 7 + 4}`, index === 1 ? "лучший выбор" : pricingPeriod, "small")}
                {text(`auto-text.${sourceIndex * 7 + 5}`, defaultText(sourceIndex * 7 + 5, ["Для простой посадочной страницы и первых заявок.", "Для продаж, подписок и регулярных обновлений.", "Для каталогов, оплаты, автоматизации и роста.", "Для команды и нескольких направлений."][sourceIndex] ?? "Для понятного пакета услуг."), "p")}
                <ul>
                  <li><i data-builder-static="true" />{text(`auto-text.${sourceIndex * 7 + 6}`, defaultText(sourceIndex * 7 + 6, pricingFeatureDefaults[sourceIndex]?.[0] ?? "Лендинг"))}</li>
                  <li><i data-builder-static="true" />{text(`auto-text.${sourceIndex * 7 + 7}`, defaultText(sourceIndex * 7 + 7, pricingFeatureDefaults[sourceIndex]?.[1] ?? "Настройка"))}</li>
                  <li><i data-builder-static="true" />{text(`auto-text.${sourceIndex * 7 + 8}`, defaultText(sourceIndex * 7 + 8, pricingFeatureDefaults[sourceIndex]?.[2] ?? "Поддержка"))}</li>
                </ul>
                {pricingIsPremium && text(`pricing-cta.${sourceIndex}`, defaultText(100 + sourceIndex, index === 1 ? "Приобрести" : "Выбрать"), "button", "builder-pricing__cta")}
                {block.variant === "focus" && index === 1 && <em data-builder-static="true">Popular</em>}
                {removeItemButton(index, "Удалить тариф")}
              </div>
              );
            })}
            {addItemButton("Добавить тариф")}
          </div>
        </div>
      );
    case "reviews":
      if (block.variant === "slider") {
        const slideCount = Math.max(1, itemCount);
        const activeReviewSlide = Math.min(reviewsSlide, slideCount - 1);
        const reviewNames = ["Алексей Морозов", "Мария Ким", "Илья Новиков", "Елена Соколова", "Денис Орлов", "Анна Волкова"];
        const reviewRoles = ["владелец сервиса", "маркетолог", "основатель студии", "руководитель проекта", "интернет-магазин", "локальный бизнес"];

        return (
          <div className="builder-reviews builder-reviews--slider" style={{ "--reviews-active-slide": activeReviewSlide } as CSSProperties}>
            <div className="builder-reviews-slider__viewport">
              <div className="builder-reviews-slider__track">
                {repeatableSourceIndices.map((sourceIndex, index) => (
                  <article key={sourceIndex} className={repeatableClass(index, "builder-reviews-slider__slide")}>
                    <span className="builder-reviews-slider__photo" data-media-field={`reviews.${sourceIndex}.photo`}>
                      <i data-builder-static="true" />
                    </span>
                    <div className="builder-reviews-slider__content">
                      {text(`auto-text.${sourceIndex * 5}`, defaultText(sourceIndex * 5, index === 0 ? "Что говорят клиенты" : "Отзыв после запуска"), "h3")}
                      {text(`auto-text.${sourceIndex * 5 + 1}`, defaultText(sourceIndex * 5 + 1, "Страница получилась понятной: посетитель быстро видит пользу, листает блоки и оставляет заявку без лишних вопросов."), "p")}
                      {text(`auto-text.${sourceIndex * 5 + 2}`, defaultText(sourceIndex * 5 + 2, reviewNames[sourceIndex] ?? `Клиент ${sourceIndex + 1}`), "strong")}
                      {text(`auto-text.${sourceIndex * 5 + 3}`, defaultText(sourceIndex * 5 + 3, reviewRoles[sourceIndex] ?? "клиент проекта"), "small")}
                      <div className="builder-reviews-slider__stars" data-builder-static="true">
                        {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={18} />)}
                      </div>
                    </div>
                    {removeItemButton(index, "Удалить отзыв")}
                  </article>
                ))}
              </div>
            </div>
            <div className="builder-reviews-slider__controls" data-builder-static="true">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onReviewsSlideChange?.((activeReviewSlide - 1 + slideCount) % slideCount);
                }}
              >
                Prev
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onReviewsSlideChange?.((activeReviewSlide + 1) % slideCount);
                }}
              >
                Next
              </button>
            </div>
            {addItemButton("Добавить отзыв")}
          </div>
        );
      }

      if (block.variant === "highlight") {
        const mainReview = {
          id: "main",
          index: -1,
          sourceIndex: null,
          textField: "auto-text.0",
          authorField: "auto-text.1",
          roleField: "auto-text.2",
          detailField: "review-detail.main",
          textFallback: defaultText(0, "Команда быстро собрала страницу, сразу было понятно, куда нажимать и почему стоит оставить заявку."),
          authorFallback: defaultText(1, "Алексей, владелец сервиса"),
          roleFallback: defaultText(2, "Запуск лендинга за неделю"),
          detailFallback: "Главный отзыв держит основной кейс: что изменилось после запуска, как быстро клиент понял ценность и почему оставил заявку.",
        };
        const miniDefaults = ["Без лишней воды", "Сразу виден оффер", "Удобно править контент", "Хорошо смотрится на телефоне", "Стало проще продавать", "Быстрый запуск без хаоса"];
        const miniReviewEntries = repeatableSourceIndices.map((sourceIndex, index) => ({
          id: `mini-${sourceIndex}`,
          index,
          sourceIndex,
          textField: `auto-text.${sourceIndex * 2 + 3}`,
          authorField: `auto-text.${sourceIndex * 2 + 4}`,
          roleField: `review-role.${sourceIndex}`,
          detailField: `review-detail.${sourceIndex}`,
          textFallback: defaultText(sourceIndex * 2 + 3, miniDefaults[sourceIndex] ?? "Короткий отзыв клиента"),
          authorFallback: defaultText(sourceIndex * 2 + 4, `Клиент ${sourceIndex + 1}`),
          roleFallback: "Клиент проекта",
          detailFallback: "Подробный отзыв: что именно стало понятнее на странице, какой блок сработал лучше всего и какой результат клиент получил после запуска.",
        }));
        const activeMiniReview = miniReviewEntries.find((entry) => entry.sourceIndex === highlightReviewSourceIndex);
        const activeReview = activeMiniReview ?? mainReview;
        const sideReviewEntries = activeMiniReview
          ? [mainReview, ...miniReviewEntries.filter((entry) => entry.sourceIndex !== activeMiniReview.sourceIndex)]
          : miniReviewEntries;
        const handleMiniReviewClick = (event: ReactMouseEvent<HTMLElement>, sourceIndex: number | null) => {
          const target = event.target as HTMLElement;
          if (target.closest(".editable-text, .builder-repeatable-item__delete, .builder-review-open")) return;
          onHighlightReviewChange?.(sourceIndex);
        };
        const reviewOpenButton = (entry: ReviewModalData) => (
          <button
            className="builder-review-open"
            type="button"
            data-builder-static="true"
            aria-label="Открыть отзыв"
            onClick={(event) => {
              event.stopPropagation();
              onReviewModalOpen?.(entry);
            }}
          >
            <MessageCircle size={17} strokeWidth={2.4} />
          </button>
        );

        return (
          <div className={`builder-reviews builder-reviews--highlight ${activeMiniReview ? "builder-reviews--swapped" : ""}`}>
            <div
              key={activeReview.id}
              className={`builder-reviews__feature ${activeMiniReview ? "builder-reviews__feature--expanded" : ""}`}
            >
              <div className="builder-reviews__score" data-builder-static="true">
                {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={18} />)}
              </div>
              <div className="builder-reviews__feature-copy">
                {text(activeReview.textField, activeReview.textFallback, "p")}
                {text(activeReview.detailField, activeReview.detailFallback, "p", "builder-reviews__details")}
              </div>
              {reviewOpenButton(activeReview)}
              <div className="builder-reviews__author">
                <span data-builder-static="true" />
                <div>
                  {text(activeReview.authorField, activeReview.authorFallback, "strong")}
                  {text(activeReview.roleField, activeReview.roleFallback, "small")}
                </div>
              </div>
            </div>
            <div className="builder-reviews__side">
              {sideReviewEntries.map((entry) => (
                <div
                  key={`${activeReview.id}-${entry.id}`}
                  className={`${entry.sourceIndex === null ? "builder-reviews__mini builder-reviews__mini--main" : repeatableClass(entry.index, "builder-reviews__mini")}`}
                  role="button"
                  tabIndex={0}
                  onClick={(event) => handleMiniReviewClick(event, entry.sourceIndex)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onHighlightReviewChange?.(entry.sourceIndex);
                    }
                  }}
                >
                  <Star size={15} data-builder-static="true" />
                  {text(entry.textField, entry.textFallback, "p")}
                  {text(entry.authorField, entry.authorFallback, "strong")}
                  {reviewOpenButton(entry)}
                  {entry.sourceIndex !== null && removeItemButton(entry.index, "Удалить отзыв")}
                </div>
              ))}
              {addItemButton("Добавить отзыв")}
            </div>
          </div>
        );
      }

      return (
        <BuilderCyclicMarquee
          items={repeatableSourceIndices.map((sourceIndex, index) => ({
            sourceIndex,
            index,
            label: `review-${sourceIndex}`,
          }))}
          rootClassName="builder-reviews-marquee"
          trackClassName="builder-marquee__track builder-reviews-marquee__track"
          itemClassName="builder-marquee__item builder-reviews-marquee__item"
          renderItem={({ sourceIndex, index }) => (
            <article className={repeatableClass(index, "builder-reviews-marquee__card")}>
              <div className="builder-reviews-marquee__stars" data-builder-static="true">
                {[0, 1, 2, 3, 4].map((star) => <Star key={star} size={15} />)}
              </div>
              {text(`auto-text.${sourceIndex * 2}`, defaultText(sourceIndex * 2, "Аккуратный запуск, понятная структура и хороший визуал."), "p")}
              {text(`auto-text.${sourceIndex * 2 + 1}`, defaultText(sourceIndex * 2 + 1, `Клиент ${sourceIndex + 1}`), "strong")}
              {removeItemButton(index, "Удалить отзыв")}
            </article>
          )}
          addButton={addItemButton("Добавить отзыв")}
        />
      );
    case "marquee":
      const marqueeItems = repeatableSourceIndices.map((sourceIndex, index) => ({
        sourceIndex,
        index,
        label: ["Бесплатный аудит", "Запуск за 7 дней", "Адаптив под телефон", "CRM и заявки", "Оплата онлайн", "Поддержка"][sourceIndex] ?? `Сообщение ${sourceIndex + 1}`,
      }));

      if (block.variant === "card") {
        const getSwitchTitle = (sourceIndex: number, label: string) => (
          normalizeRussianMojibake(hasOwnValue(item.text, `auto-text.${sourceIndex}`) ? item.text[`auto-text.${sourceIndex}`] : defaultText(sourceIndex, label))
        );
        const getSwitchText = (sourceIndex: number) => (
          normalizeRussianMojibake(
            hasOwnValue(item.text, `auto-text.${sourceIndex + 8}`)
              ? item.text[`auto-text.${sourceIndex + 8}`]
              : defaultText(sourceIndex + 8, ["Новая акция на этой неделе", "Быстрое обновление статуса", "Короткая важная новость"][sourceIndex] ?? "Короткая сменяемая информация"),
          )
        );

        return (
          <BuilderSwitchingInfoBlock
            items={marqueeItems}
            renderCard={({ sourceIndex, index, label }) => (
              <div className={repeatableClass(index, "builder-info-switcher__content")}>
                <small>{String(index + 1).padStart(2, "0")}</small>
                {text(`auto-text.${sourceIndex}`, defaultText(sourceIndex, label), "strong")}
                {text(`auto-text.${sourceIndex + 8}`, defaultText(sourceIndex + 8, ["Новая акция на этой неделе", "Быстрое обновление статуса", "Короткая важная новость"][sourceIndex] ?? "Короткая сменяемая информация"), "p")}
                {text(`auto-text.${sourceIndex + 16}`, defaultText(sourceIndex + 16, "live update"), "span", "builder-info-switcher__tag")}
                {removeItemButton(index, "Удалить сообщение")}
              </div>
            )}
            renderPreview={({ sourceIndex, index, label }) => (
              <>
                <small>{String(index + 1).padStart(2, "0")}</small>
                <strong>{getSwitchTitle(sourceIndex, label)}</strong>
                <span>{getSwitchText(sourceIndex)}</span>
              </>
            )}
            addButton={addItemButton("Добавить сообщение")}
          />
        );
      }

      if (block.variant === "typing") {
        return (
          <BuilderTypingMarquee
            items={marqueeItems}
            title={text("auto-text.heading", "Пишите главное крупно", "strong", "builder-marquee-typing__title")}
            getItemText={({ sourceIndex, label }) => (
              normalizeRussianMojibake(hasOwnValue(item.text, `auto-text.${sourceIndex}`) ? item.text[`auto-text.${sourceIndex}`] : defaultText(sourceIndex, label))
            )}
            renderActiveItem={({ sourceIndex, index, label }, displayText) => (
              <div
                key={`${sourceIndex}-${label}-live`}
                className={`builder-marquee-typing__line ${removingRepeatableIndex === index ? "is-removing" : ""}`}
              >
                <TypingEditableText
                  item={item}
                  field={`auto-text.${sourceIndex}`}
                  fallback={defaultText(sourceIndex, label)}
                  displayValue={displayText}
                  onTextChange={onTextChange}
                />
                {removeItemButton(index, "Удалить фразу")}
              </div>
            )}
            addButton={addItemButton("Добавить фразу")}
          />
        );
      }

      return (
        <>
        <BuilderCyclicMarquee
          items={marqueeItems}
          light={block.variant === "light"}
          renderItem={({ sourceIndex, index, label }) => (
            <span className={repeatableClass(index, "builder-marquee__pill")}>
              {text(`auto-text.${sourceIndex}`, defaultText(sourceIndex, label))}
              {removeItemButton(index, "Удалить сообщение")}
            </span>
          )}
          addButton={addItemButton("Добавить сообщение")}
        />
        </>
      );
    case "progress":
      const progressValues = [92, 76, 64, 48, 35, 88, 57, 99];

      if (block.variant === "circle") {
        return (
          <div className="builder-progress builder-progress--circle">
            <div className="builder-progress__intro">
              {text("auto-text.0", defaultText(0, "Мои навыки"), "strong")}
              {text("auto-text.1", defaultText(1, "Покажите компетенции, уровень готовности или ключевые показатели проекта."), "p")}
            </div>
            <div className="builder-progress__circles">
              {repeatableSourceIndices.map((sourceIndex, index) => {
                const label = ["Front-End", "Web Designer", "Back-End", "SEO", "Маркетинг", "Автоматизация"][sourceIndex] ?? `Навык ${sourceIndex + 1}`;
                const valueField = `auto-text.${sourceIndex * 2 + 3}`;
                const defaultValue = progressValues[sourceIndex] ?? 70;
                const value = parsePercentValue(item.text[valueField] ?? defaultText(sourceIndex * 2 + 3, `${defaultValue}%`), defaultValue);

                return (
                  <div
                    key={`${sourceIndex}-${label}`}
                    className={repeatableClass(index, "builder-progress__circle")}
                    style={{ "--progress-deg": `${value * 3.6}deg` } as CSSProperties}
                  >
                    <span data-builder-static="true"><i /></span>
                    <div>
                      {text(valueField, defaultText(sourceIndex * 2 + 3, `${value}%`), "strong")}
                      {text(`auto-text.${sourceIndex * 2 + 2}`, defaultText(sourceIndex * 2 + 2, label), "small")}
                    </div>
                    {removeItemButton(index, "Удалить прогресс")}
                  </div>
                );
              })}
            </div>
            {addItemButton("Добавить прогресс")}
          </div>
        );
      }

      return (
        <div className="builder-progress">
          <div className="builder-progress__intro">
            {text("auto-text.0", defaultText(0, "Показатели проекта"), "strong")}
            {text("auto-text.1", defaultText(1, "Покажите проценты, этапы готовности, навыки или заполненность тарифа."), "p")}
          </div>
          <div className="builder-progress__list">
            {repeatableSourceIndices.map((sourceIndex, index) => {
              const label = ["Дизайн", "Верстка", "Контент", "Интеграции", "SEO", "Оплата", "Автоматизация", "Поддержка"][sourceIndex] ?? `Пункт ${sourceIndex + 1}`;
              const valueField = `auto-text.${sourceIndex * 2 + 3}`;
              const defaultValue = progressValues[sourceIndex] ?? 70;
              const value = parsePercentValue(item.text[valueField] ?? defaultText(sourceIndex * 2 + 3, `${defaultValue}%`), defaultValue);

              return (
                <div key={`${sourceIndex}-${label}`} className={repeatableClass(index, "builder-progress__row")} style={{ "--progress-value": `${value}%` } as CSSProperties}>
                  <div>
                    {text(`auto-text.${sourceIndex * 2 + 2}`, defaultText(sourceIndex * 2 + 2, label), "strong")}
                    {text(valueField, defaultText(sourceIndex * 2 + 3, `${value}%`), "small")}
                  </div>
                  <span data-builder-static="true"><i /></span>
                  {removeItemButton(index, "Удалить прогресс")}
                </div>
              );
            })}
          </div>
          {addItemButton("Добавить прогресс")}
        </div>
      );
    case "stats": {
      const statsLabels = getBuilderText(builderCopy, "builder.stats.months").split("|");
      const statsSegments = getBuilderText(builderCopy, "builder.stats.segments").split("|");
      const statsValuesFallback = [28, 46, 38, 64, 78, 69, 84, 57, 72, 91];
      const statsPointLabel = (index: number) => getBuilderText(builderCopy, "builder.stats.point", { number: index + 1 });
      const statsSegmentLabel = (index: number) => getBuilderText(builderCopy, "builder.stats.segment", { number: index + 1 });
      const statsEntries = repeatableSourceIndices.map((sourceIndex, index) => {
        const field = `auto-text.${sourceIndex * 3 + 2}`;
        const fallback = statsValuesFallback[sourceIndex] ?? 50;
        return {
          sourceIndex,
          index,
          value: parsePercentValue(item.text[field] ?? defaultText(sourceIndex * 3 + 2, `${fallback}%`), fallback),
        };
      });
      const statsValues = statsEntries.map(({ value }) => value);
      const statsMax = Math.max(100, ...statsValues);
      const linePoints = statsValues.map((value, index) => {
        const x = itemCount <= 1 ? 34 : 34 + index * (332 / Math.max(1, itemCount - 1));
        const y = 178 - (value / statsMax) * 132;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(" ");
      const pieTotal = Math.max(1, statsValues.slice(0, Math.max(3, itemCount)).reduce((sum, value) => sum + value, 0));
      const piePalette = [
        "var(--builder-primary)",
        "var(--builder-accent)",
        "color-mix(in srgb, var(--builder-text) 24%, var(--builder-surface))",
        "color-mix(in srgb, var(--builder-primary) 58%, var(--builder-accent))",
        "color-mix(in srgb, var(--builder-accent) 46%, var(--builder-text))",
        "color-mix(in srgb, var(--builder-primary) 42%, var(--builder-surface))",
        "color-mix(in srgb, var(--builder-text) 42%, var(--builder-accent))",
        "color-mix(in srgb, var(--builder-primary) 72%, var(--builder-text))",
        "color-mix(in srgb, var(--builder-accent) 28%, var(--builder-surface))",
        "color-mix(in srgb, var(--builder-primary) 26%, var(--builder-text))",
        "color-mix(in srgb, var(--builder-accent) 68%, var(--builder-primary))",
        "color-mix(in srgb, var(--builder-text) 34%, var(--builder-surface))",
      ];
      const pieColor = (index: number) => piePalette[index % piePalette.length];
      let pieCursor = 0;
      const pieStops = statsValues.slice(0, Math.max(3, itemCount)).map((value, index) => {
        const start = pieCursor;
        const next = pieCursor + value / pieTotal * 100;
        pieCursor = next;
        return `${pieColor(index)} ${start}% ${next}%`;
      }).join(", ");
      const statsHeading = block.variant === "pie"
        ? getBuilderText(builderCopy, "builder.stats.pie.title")
        : block.variant === "bar"
          ? getBuilderText(builderCopy, "builder.stats.bar.title")
          : getBuilderText(builderCopy, "builder.stats.line.title");
      const statsDescription = block.variant === "pie"
        ? getBuilderText(builderCopy, "builder.stats.pie.text")
        : block.variant === "bar"
          ? getBuilderText(builderCopy, "builder.stats.bar.text")
          : getBuilderText(builderCopy, "builder.stats.line.text");

      if (block.variant === "bar") {
        return (
          <div className="builder-stats builder-stats--bar">
            <div className="builder-stats__head">
              {text("auto-text.0", statsHeading, "strong")}
              {text("auto-text.1", statsDescription, "p")}
            </div>
            <div className="builder-stats__bars">
              {statsEntries.map(({ sourceIndex, index, value }) => (
                <div key={sourceIndex} className={repeatableClass(index, "builder-stats__bar")} style={{ "--stats-height": `${Math.max(34, value * 1.75)}px` } as CSSProperties}>
                  <span data-builder-static="true" />
                  {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, `${value}%`), "small")}
                  {text(`auto-text.${sourceIndex * 3 + 3}`, statsLabels[sourceIndex] ?? statsPointLabel(sourceIndex), "strong")}
                  {removeItemButton(index, "Удалить столбец")}
                </div>
              ))}
              {addItemButton("Добавить столбец")}
            </div>
          </div>
        );
      }

      if (block.variant === "pie") {
        return (
          <div className="builder-stats builder-stats--pie">
            <div className="builder-stats__head">
              {text("auto-text.0", statsHeading, "strong")}
              {text("auto-text.1", statsDescription, "p")}
            </div>
            <div className="builder-stats__pie-wrap">
              <div className="builder-stats__pie" style={{ background: `conic-gradient(${pieStops})` }} data-builder-static="true" />
              <div className="builder-stats__legend">
                {statsEntries.map(({ sourceIndex, index, value }) => (
                  <div key={sourceIndex} className={repeatableClass(index)} style={{ "--stats-color": pieColor(index) } as CSSProperties}>
                    <i data-builder-static="true" />
                    {text(`auto-text.${sourceIndex * 3 + 3}`, statsSegments[sourceIndex] ?? statsSegmentLabel(sourceIndex), "strong")}
                    {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, `${value}%`), "small")}
                    {removeItemButton(index, "Удалить сектор")}
                  </div>
                ))}
                {addItemButton("Добавить сектор")}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="builder-stats builder-stats--line">
          <div className="builder-stats__head">
            {text("auto-text.0", statsHeading, "strong")}
            {text("auto-text.1", statsDescription, "p")}
          </div>
          <div className="builder-stats__chart" data-builder-static="true">
            <svg viewBox="0 0 400 210" role="img" aria-hidden="true">
              <g className="builder-stats__grid">
                <line x1="26" y1="46" x2="374" y2="46" />
                <line x1="26" y1="90" x2="374" y2="90" />
                <line x1="26" y1="134" x2="374" y2="134" />
                <line x1="26" y1="178" x2="374" y2="178" />
              </g>
              <polyline points={linePoints} />
              {statsValues.map((value, index) => {
                const x = itemCount <= 1 ? 34 : 34 + index * (332 / Math.max(1, itemCount - 1));
                const y = 178 - (value / statsMax) * 132;
                return <circle key={index} cx={x} cy={y} r="6" />;
              })}
            </svg>
          </div>
          <div className="builder-stats__labels">
            {statsEntries.map(({ sourceIndex, index, value }) => (
              <div key={sourceIndex} className={repeatableClass(index)}>
                {text(`auto-text.${sourceIndex * 3 + 3}`, statsLabels[sourceIndex] ?? statsPointLabel(sourceIndex), "strong")}
                {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, `${value}%`), "small")}
                {removeItemButton(index, "Удалить точку")}
              </div>
            ))}
            {addItemButton("Добавить точку")}
          </div>
        </div>
      );
    }
    case "article": {
      const articleTitles = ["Ключевая мысль", "Почему это важно", "Как это работает", "Что получает читатель", "Следующий шаг", "Детали", "Пример", "Итог"];
      const articleParagraphs = [
        "Начните с короткого вывода: что произошло, зачем это нужно и какую пользу читатель получит дальше.",
        "Разверните контекст простым языком, без перегруза, чтобы длинный материал оставался понятным.",
        "Добавьте практический блок: шаги, примеры, цифры или последовательность действий.",
        "Покажите результат и объясните, как использовать информацию на практике.",
        "Завершите понятным действием: куда перейти, что скачать, кому написать или что проверить.",
      ];
      const articleEntries = repeatableSourceIndices.map((sourceIndex, index) => ({ sourceIndex, index }));
      const articleNavClick = (event: ReactMouseEvent<HTMLAnchorElement>, sourceIndex: number) => {
        event.preventDefault();
        event.stopPropagation();
        const target = event.currentTarget
          .closest(".builder-article")
          ?.querySelector<HTMLElement>(`#builder-article-${item.instanceId}-${sourceIndex}`);
        target?.scrollIntoView({ behavior: "smooth", block: "center" });
      };

      if (block.variant === "image-flow") {
        return (
          <div className="builder-article builder-article--image-flow">
            <span className="builder-article__image builder-article__image--float" data-media-field="article.flow.image">
              <i />
            </span>
            <article className="builder-article__body">
              {text("auto-text.0", defaultText(0, "Материал с живой иллюстрацией"), "h3")}
              {text("auto-text.1", defaultText(1, "Загрузите изображение, добавьте вступление и ведите текст так, как в документе: сначала вокруг картинки, потом обычным потоком."), "p", "builder-article__lead")}
              {articleEntries.map(({ sourceIndex, index }) => (
                <section key={sourceIndex} className={repeatableClass(index, "builder-article__paragraph")}>
                  {text(
                    `auto-text.${sourceIndex * 2 + 2}`,
                    defaultText(sourceIndex * 2 + 2, articleParagraphs[sourceIndex % articleParagraphs.length]),
                    "p"
                  )}
                  {removeItemButton(index, "Удалить абзац")}
                </section>
              ))}
              {addItemButton("Добавить абзац")}
            </article>
          </div>
        );
      }

      if (block.variant === "infobox") {
        const tableLabels = ["Страна", "Статус", "Дата запуска", "Площадь", "Команда", "Бюджет", "Сайт", "Контакты"];
        const tableValues = ["Беларусь", "Городской проект", "2026", "353,64 км²", "12 специалистов", "от 90 $", "example.com", "info@example.com"];

        return (
          <div className="builder-article builder-article--infobox">
            <article className="builder-article__wiki-body">
              <aside className="builder-article-infobox">
                <span className="builder-article-infobox__image" data-media-field="article.infobox.image">
                  <i />
                </span>
                <div className="builder-article-infobox__rows">
                  {articleEntries.map(({ sourceIndex, index }) => (
                    <div key={sourceIndex} className={repeatableClass(index, "builder-article-infobox__row")}>
                      {text(`auto-text.${sourceIndex * 2 + 10}`, defaultText(sourceIndex * 2 + 10, tableLabels[sourceIndex] ?? `Графа ${sourceIndex + 1}`), "strong")}
                      {text(`auto-text.${sourceIndex * 2 + 11}`, defaultText(sourceIndex * 2 + 11, tableValues[sourceIndex] ?? "Информация"), "span")}
                      {removeItemButton(index, "Удалить строку")}
                    </div>
                  ))}
                  {addItemButton("Добавить строку")}
                </div>
              </aside>
              {text("auto-text.0", defaultText(0, "Статья с инфотаблицей"), "h3")}
              {text("auto-text.1", defaultText(1, "Подходит для справочных страниц, описания объекта, проекта, места, продукта или человека. Таблица справа дает быстрые факты, а основной текст раскрывает тему."), "p", "builder-article__lead")}
              {text("auto-text.2", defaultText(2, "Первый абзац обтекает информационный блок и помогает читателю быстро понять контекст. Добавьте сюда историю, важные характеристики, вводные данные и ссылки на связанные разделы."), "p")}
              {text("auto-text.3", defaultText(3, "Дальше текст продолжается обычным образом: можно описать историю, особенности, этапы развития, результаты, условия или любую другую длинную информацию."), "p")}
            </article>
          </div>
        );
      }

      return (
        <div className="builder-article builder-article--nav">
          <aside className="builder-article__toc" data-builder-static="true">
            <strong>Оглавление</strong>
            <nav>
              {articleEntries.map(({ sourceIndex, index }) => (
                <a
                  key={sourceIndex}
                  href={`#builder-article-${item.instanceId}-${sourceIndex}`}
                  onClick={(event) => articleNavClick(event, sourceIndex)}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <em>{plainText(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, articleTitles[sourceIndex] ?? `Раздел ${sourceIndex + 1}`))}</em>
                </a>
              ))}
            </nav>
          </aside>
          <article className="builder-article__body">
            {text("auto-text.0", defaultText(0, "Большая статья"), "h3")}
            {text("auto-text.1", defaultText(1, "Соберите длинный материал с понятной структурой: заголовки, разделы и быстрая навигация по ним."), "p", "builder-article__lead")}
            {articleEntries.map(({ sourceIndex, index }) => (
              <section
                key={sourceIndex}
                id={`builder-article-${item.instanceId}-${sourceIndex}`}
                className={repeatableClass(index, "builder-article__section")}
              >
                {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, articleTitles[sourceIndex] ?? `Раздел ${sourceIndex + 1}`), "h4")}
                {text(
                  `auto-text.${sourceIndex * 3 + 3}`,
                  defaultText(sourceIndex * 3 + 3, articleParagraphs[sourceIndex % articleParagraphs.length]),
                  "p"
                )}
                {removeItemButton(index, "Удалить раздел")}
              </section>
            ))}
            {addItemButton("Добавить раздел")}
          </article>
        </div>
      );
    }
    case "faq":
      if (block.variant === "split") {
        return (
          <div className="builder-faq builder-faq--split">
            <div className="builder-faq__aside">
              {text("faq.split.0", "Остались вопросы?", "h3")}
              {text("faq.split.1", "Добавьте рядом с ответами заметный блок связи, чтобы посетитель не уходил искать контакты.", "p")}
              {text("faq.split.2", "Задать вопрос", "button")}
            </div>
            <div className="builder-faq__list">
              {["Как быстро вы отвечаете?", "Можно ли добавить свои разделы?", "Что нужно для старта?"].map((question, index) => (
                <details key={question} className="builder-faq__item" open={index === 0}>
                  <summary>
                    {text(`auto-text.${index * 2}`, defaultText(index * 2, question), "strong")}
                    <i aria-hidden="true" />
                  </summary>
                  {text(`auto-text.${index * 2 + 1}`, defaultText(index * 2 + 1, ["Обычно отвечаем в течение рабочего дня и сразу подсказываем следующий шаг.", "Да. Можно добавить блоки, карточки, товары, формы и нужные ссылки.", "Нужны цель сайта, примерный контент, контакты и пожелания по визуалу."][index] ?? "Короткий понятный ответ на вопрос клиента."), "p")}
                </details>
              ))}
            </div>
          </div>
        );
      }

      return (
        <div className="builder-faq">
          {["Сколько длится запуск?", "Можно ли менять блоки?", "Что входит в стоимость?"].map((question, index) => (
            <details key={question} className="builder-faq__item" open={index === 0}>
              <summary>
                {text(`auto-text.${index * 2}`, defaultText(index * 2, question), "strong")}
                <i aria-hidden="true" />
              </summary>
              {text(`auto-text.${index * 2 + 1}`, defaultText(index * 2 + 1, ["Обычно 5-10 рабочих дней после согласования структуры и контента.", "Да. Можно заменять секции, добавлять карточки, менять текст и загружать свои изображения.", "Дизайн, верстка, адаптив, базовая настройка и подготовка к запуску."][index] ?? "Короткий понятный ответ на вопрос клиента."), "p")}
            </details>
          ))}
        </div>
      );
    case "gallery":
      if (block.variant === "slider") {
        const slideCount = Math.max(1, itemCount);
        const slides = repeatableSourceIndices.map((sourceIndex, index) => ({ sourceIndex, index }));
        const sliderStyle = {
          "--gallery-slide-count": slideCount,
          "--gallery-active-slide": Math.min(gallerySlide, slideCount - 1),
          "--gallery-slide-duration": `${Math.max(12, slideCount * 3.4)}s`,
        } as CSSProperties;

        return (
          <div className="builder-gallery builder-gallery--slider" style={sliderStyle}>
            <div className="builder-gallery-slider">
              <div className="builder-gallery-slider__viewport">
                <div className="builder-gallery-slider__track">
                  {slides.map(({ sourceIndex, index }) => (
                    <section key={sourceIndex} className={repeatableClass(index, "builder-gallery-slider__slide")}>
                      <span className="builder-gallery-slider__media" data-media-field={`gallery.${sourceIndex}.image`}>
                        <i />
                        <i />
                      </span>
                      <div className="builder-gallery-slider__caption">
                        {text(`auto-text.${sourceIndex * 3}`, defaultText(sourceIndex * 3, ["Главный кадр", "Детали проекта", "Атмосфера", "Процесс", "Результат"][sourceIndex] ?? `Слайд ${sourceIndex + 1}`), "strong")}
                        {text(`auto-text.${sourceIndex * 3 + 1}`, defaultText(sourceIndex * 3 + 1, "Загрузите фото, добавьте подпись и используйте этот слайд как полноценный экран сайта."), "p")}
                        {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, String(sourceIndex + 1).padStart(2, "0")), "small")}
                      </div>
                      {removeItemButton(index, "Удалить слайд")}
                    </section>
                  ))}
                </div>
                <button
                  className="builder-gallery-slider__arrow builder-gallery-slider__arrow--prev"
                  type="button"
                  data-builder-static="true"
                  aria-label="Предыдущий слайд"
                  onClick={(event) => {
                    event.stopPropagation();
                    onGallerySlideChange?.((gallerySlide - 1 + slideCount) % slideCount);
                  }}
                >
                  <ChevronLeft size={28} strokeWidth={3} />
                </button>
                <button
                  className="builder-gallery-slider__arrow builder-gallery-slider__arrow--next"
                  type="button"
                  data-builder-static="true"
                  aria-label="Следующий слайд"
                  onClick={(event) => {
                    event.stopPropagation();
                    onGallerySlideChange?.((gallerySlide + 1) % slideCount);
                  }}
                >
                  <ChevronRight size={28} strokeWidth={3} />
                </button>
              </div>
              <div className="builder-gallery-slider__footer" data-builder-static="true">
                <div className="builder-gallery-slider__thumbs">
                  {slides.slice(0, 7).map(({ sourceIndex, index }) => (
                    <span key={sourceIndex} className={index === Math.min(gallerySlide, slideCount - 1) ? "is-active" : ""} style={{ "--thumb-index": index } as CSSProperties} />
                  ))}
                </div>
                <div className="builder-gallery-slider__counter">{slideCount} фото</div>
                {addItemButton("Добавить фото")}
              </div>
            </div>
          </div>
        );
      }

      return (
        <div className="builder-gallery">
          {repeatableSourceIndices.map((sourceIndex, index) => (
            <figure key={sourceIndex} className={repeatableClass(index)}>
              <span className="builder-gallery__media" data-media-field={`gallery.${sourceIndex}.image`}>
                <i />
              </span>
              <figcaption>
                {text(`auto-text.${sourceIndex * 2}`, defaultText(sourceIndex * 2, ["Интерьер проекта", "Детали", "Атмосфера", "Процесс", "Результат"][sourceIndex] ?? `Кадр ${sourceIndex + 1}`), "strong")}
                {text(`auto-text.${sourceIndex * 2 + 1}`, defaultText(sourceIndex * 2 + 1, "Добавьте короткое описание, чтобы картинка была частью истории, а не пустым декором."), "p")}
              </figcaption>
              {removeItemButton(index, "Удалить изображение")}
            </figure>
          ))}
          {addItemButton("Добавить изображение")}
        </div>
      );
    case "team":
      const teamNames = ["Анна Мороз", "Илья Волков", "Мария Сокол", "Денис Орлов", "Ольга Рей", "Марк Лин", "Ника Браун", "Тимур Ким"];
      const teamRoles = ["Дизайнер", "Frontend", "Backend", "Маркетинг", "Контент", "Поддержка", "Продажи", "Аналитика"];
      const teamItems = repeatableSourceIndices.map((sourceIndex, index) => ({
        sourceIndex,
        index,
        label: teamNames[sourceIndex] ?? `Участник ${sourceIndex + 1}`,
      }));

      if (block.variant === "spotlight") {
        return (
          <BuilderTeamSpotlight
            items={teamItems}
            renderFeatured={({ sourceIndex, index, label }) => (
              <article className={repeatableClass(index, "builder-team-spotlight__card builder-team-spotlight__card--active")}>
                <span className="builder-team-spotlight__photo" data-media-field={`team.${sourceIndex}.photo`}>
                  <i />
                  <i />
                </span>
                <div className="builder-team-spotlight__copy">
                  {text(`auto-text.${sourceIndex * 3}`, defaultText(sourceIndex * 3, label), "strong")}
                  {text(`auto-text.${sourceIndex * 3 + 1}`, defaultText(sourceIndex * 3 + 1, teamRoles[sourceIndex] ?? "Специалист"), "small")}
                  {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, "Опишите опыт, сильную сторону и зону ответственности участника команды."), "p")}
                </div>
                {removeItemButton(index, "Удалить участника")}
              </article>
            )}
            renderCompact={({ sourceIndex, index, label }, selectEntry) => (
              <article
                key={`${sourceIndex}-${label}-spotlight`}
                className={repeatableClass(index, "builder-team-spotlight__mini")}
                role="button"
                tabIndex={0}
                onPointerDown={(event) => {
                  const target = event.target as HTMLElement;
                  if (target.closest(".editable-text,.editable-media-target,[data-media-field],.builder-repeatable-item__delete")) return;
                  event.stopPropagation();
                  selectEntry();
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  event.stopPropagation();
                  selectEntry();
                }}
              >
                <span className="builder-team-spotlight__mini-photo" data-media-field={`team.${sourceIndex}.photo`}>
                  <i />
                  <i />
                </span>
                <span className="builder-team-spotlight__mini-copy">
                  {text(`auto-text.${sourceIndex * 3}`, defaultText(sourceIndex * 3, label), "strong")}
                  {text(`auto-text.${sourceIndex * 3 + 1}`, defaultText(sourceIndex * 3 + 1, teamRoles[sourceIndex] ?? "Специалист"), "small")}
                </span>
                {removeItemButton(index, "Удалить участника")}
              </article>
            )}
            addButton={addItemButton("Добавить участника")}
          />
        );
      }

      if (block.variant === "line") {
        return (
          <div className="builder-team builder-team--line">
            {repeatableSourceIndices.map((sourceIndex, index) => {
              const name = teamNames[sourceIndex] ?? `Участник ${sourceIndex + 1}`;

              return (
              <article key={`${sourceIndex}-${name}`} className={repeatableClass(index, "builder-team-line")}>
                <span className="builder-team-line__photo" data-media-field={`team.${sourceIndex}.photo`}>
                  <i />
                  <i />
                </span>
                <div className="builder-team-line__copy">
                  {text(`auto-text.${sourceIndex * 3}`, defaultText(sourceIndex * 3, name), "strong")}
                  {text(`auto-text.${sourceIndex * 3 + 1}`, defaultText(sourceIndex * 3 + 1, teamRoles[sourceIndex] ?? "Специалист"), "small")}
                  {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, "Отвечает за свой участок проекта и быстро подключается к запуску."), "p")}
                </div>
                {removeItemButton(index, "Удалить участника")}
              </article>
              );
            })}
            {addItemButton("Добавить участника")}
          </div>
        );
      }

      return (
        <div className="builder-team builder-team--cards">
          {repeatableSourceIndices.map((sourceIndex, index) => {
            const name = teamNames[sourceIndex] ?? `Участник ${sourceIndex + 1}`;

            return (
            <article key={`${sourceIndex}-${name}`} className={repeatableClass(index, "builder-team-card")}>
              <span className="builder-team-card__photo" data-media-field={`team.${sourceIndex}.photo`}>
                <i />
                <i />
              </span>
              <div className="builder-team-card__body">
                {text(`auto-text.${sourceIndex * 3}`, defaultText(sourceIndex * 3, name), "strong")}
                {text(`auto-text.${sourceIndex * 3 + 1}`, defaultText(sourceIndex * 3 + 1, teamRoles[sourceIndex] ?? "Специалист"), "small")}
                {text(`auto-text.${sourceIndex * 3 + 2}`, defaultText(sourceIndex * 3 + 2, "Коротко опишите роль, опыт и чем этот человек полезен клиенту."), "p")}
              </div>
              {removeItemButton(index, "Удалить участника")}
            </article>
            );
          })}
          {addItemButton("Добавить участника")}
        </div>
      );
    case "footer":
      const footerNav = pageLinks.length ? pageLinks.map((link) => (
        <a
          key={link.instanceId}
          href={`#builder-section-${link.instanceId}`}
          onClick={(event) => handleBuilderNavClick(event, link.instanceId)}
        >
          {link.label}
        </a>
      )) : (
        <>
          {text("auto-text.1", defaultText(1, "Навигация"))}
          {text("auto-text.2", defaultText(2, "Контакты"))}
          {text("auto-text.4", defaultText(4, "Каталог"))}
        </>
      );
      const socialLink = (index: number, icon: string, href: string) => {
        const linkField = `footer.social.href.${index}`;
        const url = item.text[linkField] || href;

        return (
          <a
            key={index}
            className="builder-footer__social-link"
            href={url}
            onClick={(event) => event.preventDefault()}
          >
            {text(`footer.social.icon.${index}`, icon, "strong")}
            {text(linkField, href, "small")}
          </a>
        );
      };

      if (block.variant === "columns") {
        return (
          <div className="builder-footer builder-footer--columns">
            <div className="builder-footer__brand">
              {text("auto-text.0", defaultText(0, "Brand"), "strong")}
              {text("footer.text", "Коротко о проекте, услугах и том, почему сюда стоит вернуться.", "span")}
            </div>
            <div>
              <small data-builder-static="true">{getBuilderText(builderCopy, "builder.footer.menu")}</small>
              <nav>{footerNav}</nav>
            </div>
            <div>
              <small data-builder-static="true">{getBuilderText(builderCopy, "builder.footer.socials")}</small>
              <div className="builder-footer__socials">
                {socialLink(0, "TG", "https://t.me/brand")}
                {socialLink(1, "IG", "https://instagram.com/brand")}
                {socialLink(2, "YT", "https://youtube.com/@brand")}
              </div>
            </div>
          </div>
        );
      }

      if (block.variant === "cta") {
        return (
          <div className="builder-footer builder-footer--cta">
            <div className="builder-footer__cta">
              {text("auto-text.0", defaultText(0, "Готовы начать?"), "strong")}
              {text("footer.cta.text", "Оставьте заявку, и мы быстро соберем структуру, визуал и план запуска.", "span")}
              {text("auto-text.3", defaultText(3, "Связаться"), "button")}
            </div>
            <div className="builder-footer__columns">
              <div>
                <small data-builder-static="true">{getBuilderText(builderCopy, "builder.footer.nav")}</small>
                <nav>{footerNav}</nav>
              </div>
              <div>
                <small data-builder-static="true">{getBuilderText(builderCopy, "builder.footer.contacts")}</small>
                {text("footer.contact.0", "hello@brand.site")}
                {text("footer.contact.1", "+7 900 000-00-00")}
              </div>
              <div>
                <small data-builder-static="true">{getBuilderText(builderCopy, "builder.footer.socials")}</small>
                <div className="builder-footer__socials">
                  {socialLink(0, "TG", "https://t.me/brand")}
                  {socialLink(1, "VK", "https://vk.com/brand")}
                  {socialLink(2, "YT", "https://youtube.com/@brand")}
                  {socialLink(3, "IG", "https://instagram.com/brand")}
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (block.variant === "white") {
        return (
          <div className="builder-footer builder-footer--white">
            <div className="builder-footer__brand">
              {text("auto-text.0", defaultText(0, "Brand"), "strong")}
              {text("footer.text", "Светлый футер для аккуратного финала: навигация, контакты, соцсети и короткое описание.", "span")}
            </div>
            <nav>{footerNav}</nav>
            <div className="builder-footer__socials">
              {socialLink(0, "TG", "https://t.me/brand")}
              {socialLink(1, "VK", "https://vk.com/brand")}
              {socialLink(2, "IG", "https://instagram.com/brand")}
            </div>
          </div>
        );
      }

      return (
        <div className="builder-footer builder-footer--compact">
          {text("auto-text.0", defaultText(0, "Brand"), "strong")}
          <nav>{footerNav}</nav>
          <div className="builder-footer__socials">
            {socialLink(0, "TG", "https://t.me/brand")}
            {socialLink(1, "VK", "https://vk.com/brand")}
            {socialLink(2, "YT", "https://youtube.com/@brand")}
          </div>
        </div>
      );
    default:
      return null;
  }
}

function BlockMiniature({ type, variant }: { type: BlockType; variant: string }) {
  const itemCount = type === "cards" && variant === "tabs" ? 5 : type === "team" && variant === "spotlight" ? 5 : 4;

  return (
    <span className={`block-miniature block-miniature--${type} block-miniature--${variant}`}>
      {Array.from({ length: itemCount }, (_, index) => <i key={index} />)}
    </span>
  );
}
