import { useCallback, useEffect, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { createPortal } from "react-dom";
import ButtonWithExplosion from "../Button/button"
import Card from "react-bootstrap/Card";
import { ArrowUpRight, BadgeDollarSign, Eye, Layers3, LayoutTemplate, X } from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";
import { useProjectSelection } from "../../context/ProjectSelectionContext";
import WallpaperLanding from "../template_sites/wallpaper_landing/wallpaper-landing.jsx";
import TechStore from "../template_sites/tech_store/tech-store.jsx";
import EducationPlatform from "../template_sites/education_platform/education-platform.jsx";
import CursusLanding from "../template_sites/cursus_landing/cursus-landing.jsx";
import PortfolioLanding from "../template_sites/portfolio_landing/portfolio-landing.jsx";
import CryptoCapLanding from "../template_sites/crypto_cap_landing/crypto-cap-landing.jsx";
import PetFirstLanding from "../template_sites/pet_first_landing/pet-first-landing.jsx";
import AiSaudeLanding from "../template_sites/ai_saude_landing/ai-saude-landing.jsx";
import SneakerLanding from "../template_sites/sneaker_landing/sneaker-landing.jsx";
import PizzaMenuLanding from "../template_sites/pizza_menu/pizza-menu.jsx";
import "./work-shop.scss";

type WorkshopCategory = "sites" | "apps" | "bots";
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
  DemoComponent?: ComponentType;
  previewClassName?: string;
}

const previewImages = [
  "./img/banner/gearlabs-web-3d-v2.jpg",
  "./img/banner/gearlabs-app-3d-v2.jpg",
  "./img/banner/gearlabs-bot-3d-v2.jpg",
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

function WorkShop() {
  const { lang, t } = useThemeLang();
  const { selectProject } = useProjectSelection();
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<WorkshopCategory>("sites");
  const [activePreview, setActivePreview] = useState<WorkshopItem | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const categories = useMemo(
    () => [
      { id: "sites" as const, label: t("workshop.tabs.sites"), type: "Landing", img: previewImages[0] },
      { id: "apps" as const, label: t("workshop.tabs.apps"), type: "Dashboard", img: previewImages[1] },
      { id: "bots" as const, label: t("workshop.tabs.bots"), type: "Automation", img: previewImages[2] },
    ],
    [t]
  );

  const items: WorkshopItem[] = Array.from({ length: 30 }, (_, i) => {
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

  // Пагинация
  const perPage = 6;
  const filteredItems = items.filter((item) => item.category === activeCategory);
  const totalPages = Math.ceil(filteredItems.length / perPage);
  const pageItems = filteredItems.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  const openPreview = useCallback((item: WorkshopItem) => {
    setActivePreview(item);
    window.requestAnimationFrame(() => {
      setIsPreviewVisible(true);
    });
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewVisible(false);
  }, []);

  useEffect(() => {
    if (!activePreview) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePreview();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
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
          <div className="workshop-card-wrapper scroll-animate" key={item.id}>
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
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {activePreview && ActivePreview && createPortal(
        <div
          className={`template-preview-overlay ${isPreviewVisible ? "is-open" : "is-closing"}`}
          onClick={closePreview}
          onTransitionEnd={(event) => {
            if (event.target === event.currentTarget && !isPreviewVisible) {
              setActivePreview(null);
            }
          }}
          role="dialog"
          aria-modal="true"
          aria-label={`Обзор ${activePreview.title}`}
        >
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
              <ActivePreview />
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}

export default WorkShop;
