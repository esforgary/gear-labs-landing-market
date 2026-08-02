import { useCallback, useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Suspense, lazy, type LazyExoticComponent } from "react";
import ButtonWithExplosion from "../Button/button"
import Card from "react-bootstrap/Card";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Eye,
  Layers3,
  LayoutTemplate,
  X,
} from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";
import { useProjectSelection } from "../../context/ProjectSelectionContext";
import { VpnAppCover } from "./apps/mobile-apps/gearshield-vpn/cover";
import { DribbboxAppCover } from "./apps/mobile-apps/dribbbox-cloud/cover";
import { NectarGroceryCover } from "./apps/mobile-apps/nectar-grocery/cover";
import { FinFlowWalletCover } from "./apps/mobile-apps/finflow-wallet/cover";
import { CityRideTaxiCover } from "./apps/mobile-apps/cityride-taxi/cover";
import "./work-shop.scss";

type WorkshopCategory = "sites" | "apps" | "bots";
type WorkshopDemoComponent = ComponentType | LazyExoticComponent<ComponentType>;
interface WorkshopItem {
  id: number;
  category: WorkshopCategory;
  title: string;
  text: string;
  img: string;
  type: string;
  price: string;
  time: string;
  cover?: ReactNode;
  DemoComponent?: WorkshopDemoComponent;
  previewClassName?: string;
  previewMode?: "site" | "app";
}

interface WorkshopCatalogItem {
  id: number;
  category: WorkshopCategory;
  title: string;
  text: string;
  img: string;
  type: string;
  price: string;
  time: string;
  coverKey?: string;
  previewKey?: string;
  previewClassName?: string;
  previewMode?: "site" | "app";
  textKey?: string;
  typeKey?: string;
  translations?: Record<string, Partial<Pick<WorkshopCatalogItem, "title" | "text" | "type" | "time">>>;
}

interface WorkshopCatalogResponse {
  items?: WorkshopCatalogItem[];
}

const WallpaperLanding = lazy(() => import("../template_sites/wallpaper_landing/wallpaper-landing.jsx"));
const TechStore = lazy(() => import("../template_sites/tech_store/tech-store.jsx"));
const EducationPlatform = lazy(() => import("../template_sites/education_platform/education-platform.jsx"));
const CursusLanding = lazy(() => import("../template_sites/cursus_landing/cursus-landing.jsx"));
const PortfolioLanding = lazy(() => import("../template_sites/portfolio_landing/portfolio-landing.jsx"));
const CryptoCapLanding = lazy(() => import("../template_sites/crypto_cap_landing/crypto-cap-landing.jsx"));
const PetFirstLanding = lazy(() => import("../template_sites/pet_first_landing/pet-first-landing.jsx"));
const AiSaudeLanding = lazy(() => import("../template_sites/ai_saude_landing/ai-saude-landing.jsx"));
const SneakerLanding = lazy(() => import("../template_sites/sneaker_landing/sneaker-landing.jsx"));
const PizzaMenuLanding = lazy(() => import("../template_sites/pizza_menu/pizza-menu.jsx"));
const SkywayTicketsLanding = lazy(() => import("./sites/skyway-tickets/skyway-tickets.jsx"));
const FlowcraftEditorLanding = lazy(() => import("./sites/flowcraft-editor/flowcraft-editor.jsx"));

const VpnAppPreview = lazy(() =>
  import("./apps/mobile-apps/gearshield-vpn/gearshield-vpn").then((module) => ({
    default: module.VpnAppPreview,
  })),
);

const DribbboxAppPreview = lazy(() =>
  import("./apps/mobile-apps/dribbbox-cloud/dribbbox-cloud").then((module) => ({
    default: module.DribbboxAppPreview,
  })),
);

const NectarGroceryPreview = lazy(() => import("./apps/mobile-apps/nectar-grocery/nectar-grocery.jsx"));

const FinFlowWalletPreview = lazy(() =>
  import("./apps/mobile-apps/finflow-wallet/finflow-wallet").then((module) => ({
    default: module.FinFlowWalletPreview,
  })),
);

const CityRideTaxiPreview = lazy(() =>
  import("./apps/mobile-apps/cityride-taxi/cityride-taxi").then((module) => ({
    default: module.CityRideTaxiPreview,
  })),
);

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const clientBaseUrl = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
const staticBaseUrl = apiBaseUrl || clientBaseUrl;
const serverAsset = (path: string) => {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${staticBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const previewImages = [
  serverAsset("/static/workshop/sites/nordwall-studio/img/cover.jpg"),
  serverAsset("/static/workshop/apps/gearshield-vpn/img/cover.jpg"),
  serverAsset("/static/workshop/bots/automation-bot/img/cover.jpg"),
];

const techCoverImage = "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=900&q=80";
const petFirstCoverImage = new URL("../template_sites/pet_first_landing/img/hero-dog.png", import.meta.url).href;
const aiSaudeLogoImage = new URL("../template_sites/ai_saude_landing/img/ai-logo.svg", import.meta.url).href;
const aiSaudeDoctorImage = new URL("../template_sites/ai_saude_landing/img/doctor.svg", import.meta.url).href;
const sneakerCoverImage = new URL("../template_sites/sneaker_landing/img/colorful-sneaker.png", import.meta.url).href;
const pizzaCoverImage = new URL("../template_sites/pizza_menu/img/pizza-hero.svg", import.meta.url).href;
const portfolioHeaderImage = new URL("../template_sites/portfolio_landing/img/header-img.svg", import.meta.url).href;
const cryptoLogoImage = new URL("../template_sites/crypto_cap_landing/img/logo-mark.svg", import.meta.url).href;
const cryptoBtcImage = new URL("../template_sites/crypto_cap_landing/img/coin-btc.svg", import.meta.url).href;
const cryptoEthImage = new URL("../template_sites/crypto_cap_landing/img/coin-eth.svg", import.meta.url).href;
const cryptoBnbImage = new URL("../template_sites/crypto_cap_landing/img/coin-bnb.svg", import.meta.url).href;

const formatWorkshopSummary = (lang: string, count: number) => {
  if (lang === "ru") {
    const mod10 = count % 10;
    const mod100 = count % 100;
    const word =
      mod10 === 1 && mod100 !== 11
        ? "вариант"
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
          ? "варианта"
          : "вариантов";

    return `${count} ${word}`;
  }

  if (lang === "en" || lang === "fr") return `${count} ${count === 1 ? "option" : "options"}`;
  if (lang === "de") return `${count} ${count === 1 ? "Variante" : "Varianten"}`;
  if (lang === "it") return `${count} ${count === 1 ? "opzione" : "opzioni"}`;
  if (lang === "pl") return `${count} ${count === 1 ? "opcja" : "opcji"}`;
  if (lang === "cz" || lang === "sk") return `${count} moznosti`;

  return `${count} options`;
};

const formatWorkshopDays = (lang: string, count: number) => {
  if (lang === "ru") {
    const mod10 = count % 10;
    const mod100 = count % 100;
    const word =
      mod10 === 1 && mod100 !== 11
        ? "день"
        : mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)
          ? "дня"
          : "дней";

    return `${count} ${word}`;
  }

  if (lang === "en") return `${count} ${count === 1 ? "day" : "days"}`;
  if (lang === "de") return `${count} Tage`;
  if (lang === "fr") return `${count} jours`;
  if (lang === "it") return `${count} giorni`;
  if (lang === "pl" || lang === "cz" || lang === "sk") return `${count} dni`;

  return `${count} days`;
};

const workshopTextKeyByPreview: Record<string, string> = {
  wallpaper: "workshop.product.nordwall.text",
  "tech-store": "workshop.product.devicehub.text",
  education: "workshop.product.mec.text",
  cursus: "workshop.product.cursus.text",
  portfolio: "workshop.product.portfolio.text",
  crypto: "workshop.product.cryptocap.text",
  "pet-first": "workshop.product.petfirst.text",
  "ai-saude": "workshop.product.aisaude.text",
  sneaker: "workshop.product.sneakamp.text",
  pizza: "workshop.product.pizza.text",
  flight: "workshop.product.skyway.text",
  flowcraft: "workshop.product.flowcraft.text",
  vpn: "workshop.product.vpn.text",
  dribbbox: "workshop.product.dribbbox.text",
  nectar: "workshop.product.nectar.text",
  finflow: "workshop.product.finflow.text",
  cityride: "workshop.product.cityride.text",
};

const workshopTypeKeyByPreview: Partial<Record<string, string>> = {
  flight: "workshop.product.skyway.type",
  flowcraft: "workshop.product.flowcraft.type",
  vpn: "workshop.product.vpn.type",
  dribbbox: "workshop.product.dribbbox.type",
  nectar: "workshop.product.nectar.type",
  finflow: "workshop.product.finflow.type",
  cityride: "workshop.product.cityride.type",
};

const workshopDaysByPreview: Record<string, number> = {
  wallpaper: 5,
  "tech-store": 10,
  education: 12,
  cursus: 14,
  portfolio: 7,
  crypto: 10,
  "pet-first": 12,
  "ai-saude": 14,
  sneaker: 14,
  pizza: 12,
  flight: 11,
  flowcraft: 16,
  vpn: 9,
  dribbbox: 10,
  nectar: 12,
  finflow: 11,
  cityride: 10,
};

const WallpaperLandingCover = () => (
  <div className="wallpaper-product-cover" aria-hidden="true">
    <div className="cover-browser">
      <span />
      <span />
      <span />
    </div>
    <div className="cover-hero" />
    <div className="cover-cards">
      <span />
      <span />
      <span />
    </div>
    <div className="cover-gallery">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

const TechStoreCover = () => (
  <div className="tech-store-product-cover" aria-hidden="true">
    <div className="tech-cover-nav">
      <span />
      <span />
      <span />
    </div>
    <div className="tech-cover-hero">
      <strong>DeviceHub</strong>
      <img src={techCoverImage} alt="" loading="lazy" decoding="async" />
    </div>
    <div className="tech-cover-products">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const EducationPlatformCover = () => (
  <div className="education-product-cover" aria-hidden="true">
    <div className="edu-cover-head">
      <span />
      <strong>MEC.</strong>
    </div>
    <div className="edu-cover-hero">
      <div>
        <span />
        <span />
        <span />
      </div>
      <i />
    </div>
    <div className="edu-cover-courses">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const CursusLandingCover = () => (
  <div className="cursus-product-cover" aria-hidden="true">
    <div className="cursus-cover-header">
      <strong>Cursus</strong>
      <span />
    </div>
    <div className="cursus-cover-hero">
      <div>
        <strong>Cursus Integer</strong>
        <span />
        <span />
        <span />
      </div>
      <i />
    </div>
    <div className="cursus-cover-bottom">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const PortfolioLandingCover = () => (
  <div className="portfolio-product-cover" aria-hidden="true">
    <div className="portfolio-cover-nav">
      <strong>Portfolio</strong>
      <span />
      <span />
      <span />
    </div>
    <div className="portfolio-cover-hero">
      <div>
        <span />
        <strong>Web Developer</strong>
        <em />
      </div>
      <img src={portfolioHeaderImage} alt="" loading="lazy" decoding="async" />
    </div>
    <div className="portfolio-cover-skills">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const CryptoCapLandingCover = () => (
  <div className="crypto-cap-product-cover" aria-hidden="true">
    <div className="crypto-cap-cover-nav">
      <strong>
        Crypto<span>Cap</span>
      </strong>
      <i />
      <i />
      <i />
    </div>
    <div className="crypto-cap-cover-hero">
      <img src={cryptoLogoImage} alt="" loading="lazy" decoding="async" />
      <strong>Start and Build Crypto</strong>
      <span />
      <button type="button">Get Started</button>
    </div>
    <div className="crypto-cap-cover-coins">
      <span>
        <img src={cryptoBtcImage} alt="" loading="lazy" decoding="async" />
      </span>
      <span>
        <img src={cryptoEthImage} alt="" loading="lazy" decoding="async" />
      </span>
      <span>
        <img src={cryptoBnbImage} alt="" loading="lazy" decoding="async" />
      </span>
    </div>
  </div>
);

const PetFirstLandingCover = () => (
  <div className="pet-first-product-cover" aria-hidden="true">
    <div className="pet-first-cover-nav">
      <strong>Pet-First</strong>
      <span />
      <span />
      <span />
    </div>
    <div className="pet-first-cover-hero">
      <div>
        <strong>A Pet-First Approach</strong>
        <span />
        <button type="button">Learn More</button>
      </div>
      <img src={petFirstCoverImage} alt="" loading="lazy" decoding="async" />
    </div>
    <div className="pet-first-cover-strip">
      <span>45+</span>
      <i />
      <i />
      <i />
    </div>
  </div>
);

const AiSaudeLandingCover = () => (
  <div className="ai-saude-product-cover" aria-hidden="true">
    <div className="ai-saude-cover-nav">
      <span>
        <img src={aiSaudeLogoImage} alt="" loading="lazy" decoding="async" />
        AISAÚDE
      </span>
      <i />
      <i />
      <i />
    </div>
    <div className="ai-saude-cover-hero">
      <div>
        <strong>Recursos especializados</strong>
        <em />
        <button type="button">Comecar</button>
      </div>
      <img src={aiSaudeDoctorImage} alt="" loading="lazy" decoding="async" />
    </div>
    <div className="ai-saude-cover-cards">
      <span />
      <span />
      <span />
    </div>
  </div>
);

const SneakerLandingCover = () => (
  <div className="sneaker-product-cover" aria-hidden="true">
    <div className="sneaker-cover-nav">
      <strong>Sneakamp</strong>
      <i />
      <i />
      <i />
    </div>
    <div className="sneaker-cover-hero">
      <div>
        <span>Stylish Shoe</span>
        <strong>Big Enough</strong>
        <button type="button">Shop</button>
      </div>
      <img src={sneakerCoverImage} alt="" loading="lazy" decoding="async" />
    </div>
    <div className="sneaker-cover-products">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

const PizzaMenuCover = () => (
  <div className="pizza-product-cover" aria-hidden="true">
    <div className="pizza-cover-nav">
      <strong>Ovenly</strong>
      <span />
      <span />
    </div>
    <div className="pizza-cover-hero">
      <div>
        <span>Pizza Menu</span>
        <strong>Hot slices</strong>
        <button type="button">Order</button>
      </div>
      <img src={pizzaCoverImage} alt="" loading="lazy" decoding="async" />
    </div>
    <div className="pizza-cover-grid">
      <span />
      <span />
      <span />
      <span />
    </div>
  </div>
);

const SkywayTicketsCover = () => (
  <div className="skyway-product-cover" aria-hidden="true">
    <div className="skyway-cover-clouds">
      <i />
      <i />
      <i />
    </div>
    <div className="skyway-cover-plane">
      <span />
      <b />
    </div>
    <div className="skyway-cover-search">
      <strong>SkyWay</strong>
      <span />
      <span />
      <button type="button">Search</button>
    </div>
  </div>
);

const FlowcraftEditorCover = () => (
  <div className="flowcraft-product-cover" aria-hidden="true">
    <div className="flowcraft-cover-top">
      <span />
      <span />
      <span />
    </div>
    <div className="flowcraft-cover-canvas">
      <i className="flowcraft-cover-node flowcraft-cover-node--one" />
      <i className="flowcraft-cover-node flowcraft-cover-node--two" />
      <i className="flowcraft-cover-node flowcraft-cover-node--three" />
      <em />
      <b />
    </div>
  </div>
);

const previewComponentByKey: Record<string, WorkshopDemoComponent> = {
  wallpaper: WallpaperLanding,
  "tech-store": TechStore,
  education: EducationPlatform,
  cursus: CursusLanding,
  portfolio: PortfolioLanding,
  crypto: CryptoCapLanding,
  "pet-first": PetFirstLanding,
  "ai-saude": AiSaudeLanding,
  sneaker: SneakerLanding,
  pizza: PizzaMenuLanding,
  flight: SkywayTicketsLanding,
  flowcraft: FlowcraftEditorLanding,
  vpn: VpnAppPreview,
  dribbbox: DribbboxAppPreview,
  nectar: NectarGroceryPreview,
  finflow: FinFlowWalletPreview,
  cityride: CityRideTaxiPreview,
};

function WorkShop() {
  const { lang, t } = useThemeLang();
  const { selectProject } = useProjectSelection();
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<WorkshopCategory>("sites");
  const [activePreview, setActivePreview] = useState<WorkshopItem | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [serverItems, setServerItems] = useState<WorkshopCatalogItem[] | null>(null);

  const categories = useMemo(
    () => [
      { id: "sites" as const, label: t("workshop.tabs.sites"), type: "Landing", img: previewImages[0] },
      { id: "apps" as const, label: t("workshop.tabs.apps"), type: "Dashboard", img: previewImages[1] },
      { id: "bots" as const, label: t("workshop.tabs.bots"), type: "Automation", img: previewImages[2] },
    ],
    [t]
  );

  const generatedItems: WorkshopItem[] = Array.from({ length: 30 }, (_, i) => {
    const category = categories[i % categories.length];
    const baseItem: WorkshopItem = {
      id: i,
      category: category.id,
      title: t("workshop.card.prefix", { number: i + 1 }),
      text: t("workshop.card.text"),
      img: category.img,
      type: category.type,
      price: "500 $",
      time: [t("workshop.time.0"), t("workshop.time.1"), t("workshop.time.2")][i % 3],
    };

    if (i === 0) {
      return {
        ...baseItem,
        title: "NordWall Studio",
        text: t("workshop.product.nordwall.text"),
        price: "300 $",
        cover: <WallpaperLandingCover />,
        DemoComponent: WallpaperLanding,
      };
    }

    if (i === 3) {
      return {
        ...baseItem,
        title: "DeviceHub Store",
        text: t("workshop.product.devicehub.text"),
        type: "Shop",
        price: "600 $",
        time: "10 дней",
        cover: <TechStoreCover />,
        DemoComponent: TechStore,
      };
    }

    if (i === 6) {
      return {
        ...baseItem,
        title: "MEC Education",
        text: t("workshop.product.mec.text"),
        type: "EdTech",
        price: "700 $",
        time: "12 дней",
        cover: <EducationPlatformCover />,
        DemoComponent: EducationPlatform,
      };
    }

    if (i === 9) {
      return {
        ...baseItem,
        title: "Cursus Landing",
        text: t("workshop.product.cursus.text"),
        type: "Landing",
        price: "800 $",
        time: "14 дней",
        cover: <CursusLandingCover />,
        DemoComponent: CursusLanding,
        previewClassName: "template-preview-frame--cursus",
      };
    }

    if (i === 12) {
      return {
        ...baseItem,
        title: "eSForgary Portfolio",
        text: t("workshop.product.portfolio.text"),
        type: "Portfolio",
        price: "800 $",
        time: "7 дней",
        cover: <PortfolioLandingCover />,
        DemoComponent: PortfolioLanding,
        previewClassName: "template-preview-frame--portfolio",
      };
    }

    if (i === 15) {
      return {
        ...baseItem,
        title: "CryptoCap Landing",
        text: t("workshop.product.cryptocap.text"),
        type: "Crypto",
        price: "800 $",
        time: "10 дней",
        cover: <CryptoCapLandingCover />,
        DemoComponent: CryptoCapLanding,
        previewClassName: "template-preview-frame--crypto-cap",
      };
    }

    if (i === 18) {
      return {
        ...baseItem,
        title: "Pet-First Wellness",
        text: t("workshop.product.petfirst.text"),
        type: "Pet Care",
        price: "650 $",
        time: "12 дней",
        cover: <PetFirstLandingCover />,
        DemoComponent: PetFirstLanding,
        previewClassName: "template-preview-frame--pet-first",
      };
    }

    if (i === 21) {
      return {
        ...baseItem,
        title: "AISAÚDE Landing",
        text: t("workshop.product.aisaude.text"),
        type: "AI Health",
        price: "900 $",
        time: "14 дней",
        cover: <AiSaudeLandingCover />,
        DemoComponent: AiSaudeLanding,
        previewClassName: "template-preview-frame--ai-saude",
      };
    }

    if (i === 24) {
      return {
        ...baseItem,
        title: "Sneakamp Store",
        text: t("workshop.product.sneakamp.text"),
        type: "Sneakers",
        price: "1200 $",
        time: "14 дней",
        cover: <SneakerLandingCover />,
        DemoComponent: SneakerLanding,
        previewClassName: "template-preview-frame--sneaker",
      };
    }

    if (i === 27) {
      return {
        ...baseItem,
        title: "Ovenly Pizza Menu",
        text: t("workshop.product.pizza.text"),
        type: "Pizza Menu",
        price: "1000 $",
        time: "12 дней",
        cover: <PizzaMenuCover />,
        DemoComponent: PizzaMenuLanding,
        previewClassName: "template-preview-frame--pizza",
      };
    }

    return baseItem;
  });

  const fallbackItems: WorkshopItem[] = [
    ...generatedItems.filter((item) => item.category === "sites" && item.DemoComponent),
    {
      id: 31,
      category: "sites",
      title: "SkyWay Tickets",
      text: t("workshop.product.skyway.text"),
      img: serverAsset("/static/workshop/sites/skyway-tickets/img/cover.svg"),
      type: t("workshop.product.skyway.type"),
      price: "950 $",
      time: formatWorkshopDays(lang, 11),
      cover: <SkywayTicketsCover />,
      DemoComponent: SkywayTicketsLanding,
      previewClassName: "template-preview-frame--skyway",
    },
    {
      id: 34,
      category: "sites",
      title: "FlowCraft Editor",
      text: t("workshop.product.flowcraft.text"),
      img: serverAsset("/static/workshop/sites/flowcraft-editor/img/cover.svg"),
      type: t("workshop.product.flowcraft.type"),
      price: "1100 $",
      time: formatWorkshopDays(lang, 16),
      cover: <FlowcraftEditorCover />,
      DemoComponent: FlowcraftEditorLanding,
      previewClassName: "template-preview-frame--flowcraft",
    },
    {
      id: 100,
      category: "apps",
      title: "GearShield VPN",
      text: t("workshop.product.vpn.text"),
      img: previewImages[1],
      type: t("workshop.product.vpn.type"),
      price: "900 $",
      time: formatWorkshopDays(lang, 9),
      cover: <VpnAppCover />,
      DemoComponent: VpnAppPreview,
      previewMode: "app",
    },
    {
      id: 101,
      category: "apps",
      title: "Dribbbox Cloud",
      text: t("workshop.product.dribbbox.text"),
      img: previewImages[1],
      type: t("workshop.product.dribbbox.type"),
      price: "850 $",
      time: formatWorkshopDays(lang, 10),
      cover: <DribbboxAppCover />,
      DemoComponent: DribbboxAppPreview,
      previewMode: "app",
    },
    {
      id: 102,
      category: "apps",
      title: "Nectar Grocery",
      text: t("workshop.product.nectar.text"),
      img: previewImages[1],
      type: t("workshop.product.nectar.type"),
      price: "950 $",
      time: formatWorkshopDays(lang, 12),
      cover: <NectarGroceryCover />,
      DemoComponent: NectarGroceryPreview,
      previewMode: "app",
    },
    {
      id: 103,
      category: "apps",
      title: "FinFlow Bank",
      text: t("workshop.product.finflow.text"),
      img: previewImages[1],
      type: t("workshop.product.finflow.type"),
      price: "980 $",
      time: formatWorkshopDays(lang, 11),
      cover: <FinFlowWalletCover />,
      DemoComponent: FinFlowWalletPreview,
      previewMode: "app",
    },
    {
      id: 104,
      category: "apps",
      title: "CityRide Go",
      text: t("workshop.product.cityride.text"),
      img: previewImages[1],
      type: t("workshop.product.cityride.type"),
      price: "920 $",
      time: formatWorkshopDays(lang, 10),
      cover: <CityRideTaxiCover />,
      DemoComponent: CityRideTaxiPreview,
      previewMode: "app",
    },
  ];

  const coverByKey = useMemo<Record<string, ReactNode>>(
    () => ({
      wallpaper: <WallpaperLandingCover />,
      "tech-store": <TechStoreCover />,
      education: <EducationPlatformCover />,
      cursus: <CursusLandingCover />,
      portfolio: <PortfolioLandingCover />,
      crypto: <CryptoCapLandingCover />,
      "pet-first": <PetFirstLandingCover />,
      "ai-saude": <AiSaudeLandingCover />,
      sneaker: <SneakerLandingCover />,
      pizza: <PizzaMenuCover />,
      flight: <SkywayTicketsCover />,
      flowcraft: <FlowcraftEditorCover />,
      vpn: <VpnAppCover />,
      dribbbox: <DribbboxAppCover />,
      nectar: <NectarGroceryCover />,
      finflow: <FinFlowWalletCover />,
      cityride: <CityRideTaxiCover />,
    }),
    []
  );

  useEffect(() => {
    let isMounted = true;

    fetch("/api/workshop/items")
      .then((response) => {
        if (!response.ok) throw new Error(`Workshop API failed: ${response.status}`);
        return response.json() as Promise<WorkshopCatalogResponse>;
      })
      .then((payload) => {
        if (!isMounted || !Array.isArray(payload.items)) return;
        setServerItems(payload.items);
      })
      .catch(() => {
        if (isMounted) setServerItems(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const items: WorkshopItem[] = useMemo(() => {
    if (!serverItems) return fallbackItems;

    const mappedServerItems = serverItems.map((item) => {
      const localized = item.translations?.[lang] ?? item.translations?.ru ?? {};
      const textKey = item.textKey ?? (item.previewKey ? workshopTextKeyByPreview[item.previewKey] : undefined);
      const typeKey = item.typeKey ?? (item.previewKey ? workshopTypeKeyByPreview[item.previewKey] : undefined);
      const days = item.previewKey ? workshopDaysByPreview[item.previewKey] : undefined;

      return {
        id: item.id,
        category: item.category,
        title: item.previewKey === "finflow" ? "FinFlow Bank" : localized.title ?? item.title,
        text: textKey ? t(textKey) : localized.text ?? item.text,
        img: serverAsset(item.img),
        type: typeKey ? t(typeKey) : localized.type ?? item.type,
        price: item.price,
        time: days ? formatWorkshopDays(lang, days) : localized.time ?? item.time,
        cover: item.coverKey ? coverByKey[item.coverKey] : undefined,
        DemoComponent: item.previewKey ? previewComponentByKey[item.previewKey] : undefined,
        previewClassName: item.previewClassName,
        previewMode: item.previewMode,
      };
    });

    return mappedServerItems;
  }, [coverByKey, fallbackItems, lang, serverItems, t]);

  // Пагинация
  const perPage = 6;
  const filteredItems = items.filter((item) => item.category === activeCategory);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / perPage));
  const safePage = Math.min(page, totalPages);
  const pageItems = filteredItems.slice((safePage - 1) * perPage, safePage * perPage);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  useEffect(() => {
    setPage((currentPage) => Math.min(Math.max(currentPage, 1), totalPages));
  }, [totalPages]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const cards = document.querySelectorAll<HTMLElement>(".workshop-grid .scroll-animate");
      cards.forEach((card, index) => {
        card.classList.add("visible");
        card.style.setProperty("--delay", `${Math.min(index * 0.03, 0.12)}s`);
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [activeCategory, safePage, pageItems.length]);

  const openPreview = useCallback((item: WorkshopItem) => {
    setActivePreview(item);
    window.requestAnimationFrame(() => {
      setIsPreviewVisible(true);
    });
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewVisible(false);
    window.setTimeout(() => {
      setActivePreview(null);
    }, 360);
  }, []);

  const preventBackdropWheel = useCallback((event: { target: EventTarget; currentTarget: EventTarget; preventDefault: () => void }) => {
    if (event.target === event.currentTarget) {
      event.preventDefault();
    }
  }, []);

  useEffect(() => {
    if (!activePreview) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };
    const isPreviewContent = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".template-preview-shell, .template-app-preview-shell"));
    const preventBackgroundScroll = (event: WheelEvent | TouchEvent) => {
      if (!isPreviewContent(event.target)) {
        event.preventDefault();
      }
    };

    document.body.classList.add("is-preview-open");
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("wheel", preventBackgroundScroll, { passive: false });
    window.addEventListener("touchmove", preventBackgroundScroll, { passive: false });

    return () => {
      document.body.classList.remove("is-preview-open");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("wheel", preventBackgroundScroll);
      window.removeEventListener("touchmove", preventBackgroundScroll);
    };
  }, [activePreview, closePreview]);

  const handleSelectProject = (item: (typeof items)[number]) => {
    selectProject({
      id: item.id,
      title: item.title,
      price: item.price,
      type: item.type,
      category: item.category,
    });

    const element = document.getElementById("start");

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "#start");
    }
  };

  const ActivePreview = activePreview?.DemoComponent;

  return (
    <div className="workshop-section">
      <div className="section-heading workshop-heading">
        <span className="section-eyebrow scroll-animate">
          <LayoutTemplate size={18} />
          {t("eyebrow.catalog")}
        </span>
        <div className="workshop-heading-row">
          <h1 className="workshop-title scroll-animate">{t("workshop.title")}</h1>
          <div className="workshop-summary scroll-animate">
            <Layers3 size={20} />
            <span>{formatWorkshopSummary(lang, items.length)}</span>
          </div>
        </div>
      </div>

      <div className="workshop-tabs scroll-animate" role="tablist" aria-label={t("workshop.title")}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.id}
            className={`workshop-tab ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="workshop-grid">
        {pageItems.map((item) => (
          <div className="workshop-card-wrapper scroll-animate" key={`${item.category}-${item.id}`}>
            <Card className="workshop-card">
              <div className="workshop-preview">
                {item.cover ?? <Card.Img variant="top" src={item.img} loading="lazy" decoding="async" />}
                <span className="layout-type">{item.type}</span>
                <span className="layout-time">{item.time}</span>
              </div>
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>{item.text}</Card.Text>

                <div className="buttons">
                  <ButtonWithExplosion
                    color="blue"
                    type="button"
                    aria-label={`${item.title}: ${item.price}`}
                    onClick={() => handleSelectProject(item)}
                  >
                    <BadgeDollarSign size={18} />
                    {item.price}
                  </ButtonWithExplosion>
                  <ButtonWithExplosion
                    color="orange"
                    disabled={!item.DemoComponent}
                    onClick={() => item.DemoComponent && openPreview(item)}
                    type="button"
                  >
                    <Eye size={18} />
                    {t("workshop.review")}
                  </ButtonWithExplosion>
                </div>
              </Card.Body>
              <ArrowUpRight className="card-corner-icon" size={24} />
            </Card>
          </div>
        ))}
      </div>

      {/* Пагинация */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-btn ${safePage === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {activePreview && ActivePreview && createPortal(
        <div
          className={`template-preview-overlay ${activePreview.previewMode === "app" ? "template-preview-overlay--app" : ""} ${isPreviewVisible ? "is-open" : "is-closing"}`}
          onClick={closePreview}
          onWheel={preventBackdropWheel}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && !isPreviewVisible) {
              setActivePreview(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Обзор ${activePreview.title}`}
        >
          {activePreview.previewMode === "app" ? (
            <div className="template-app-preview-shell" onClick={(event) => event.stopPropagation()}>
              <button className="template-app-preview-close" type="button" onClick={closePreview} aria-label="Закрыть">
                <X size={30} />
              </button>
              <Suspense fallback={<div className="template-preview-loading">Загрузка...</div>}>
                <ActivePreview />
              </Suspense>
            </div>
          ) : (
          <div className="template-preview-shell" onClick={(event) => event.stopPropagation()}>
            <div className="template-preview-bar">
              <div>
                <span>preview</span>
                <strong>{activePreview.title}</strong>
              </div>
              <button type="button" onClick={closePreview} aria-label="Закрыть">
                <X size={24} />
              </button>
            </div>
            <div className={`template-preview-frame ${activePreview.previewClassName ?? ""}`}>
              <Suspense fallback={<div className="template-preview-loading">Загрузка...</div>}>
                <ActivePreview />
              </Suspense>
            </div>
          </div>
          )}
        </div>,
        document.body,
      )}
    </div>
  );
}

export default WorkShop;


