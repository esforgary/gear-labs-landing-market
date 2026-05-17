import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  X,
  Zap,
} from "lucide-react";
import "./tech-store.scss";
import camera1 from "./img/camera/1.png";
import camera2 from "./img/camera/2.png";
import camera3 from "./img/camera/3.png";
import headphones1 from "./img/headphones/1.png";
import headphones2 from "./img/headphones/2.png";
import headphones3 from "./img/headphones/3.png";
import keyboard1 from "./img/keyboard/1.png";
import keyboard2 from "./img/keyboard/2.png";
import keyboard3 from "./img/keyboard/3.png";
import notebook1 from "./img/notebook/1.png";
import notebook2 from "./img/notebook/2.png";
import notebook3 from "./img/notebook/3.png";
import phone1 from "./img/phone/1.png";
import phone2 from "./img/phone/2.png";
import phone3 from "./img/phone/3.png";
import watch1 from "./img/smart watch/1.png";
import watch2 from "./img/smart watch/2.png";
import watch3 from "./img/smart watch/3.png";

const productImages = {
  laptop: [notebook1, notebook2, notebook3],
  headphones: [headphones1, headphones2, headphones3],
  phone: [phone1, phone2, phone3],
  camera: [camera1, camera2, camera3],
  watch: [watch1, watch2, watch3],
  keyboard: [keyboard1, keyboard2, keyboard3],
};

const products = [
  {
    id: "laptop",
    title: "NovaBook Air 14",
    description: "Легкий ноутбук для работы, учебы и поездок с ярким IPS-дисплеем.",
    price: 1290,
    badge: "hit",
    images: productImages.laptop,
    specs: ["14 inch IPS", "16 GB RAM", "512 GB SSD", "до 14 часов работы"],
  },
  {
    id: "headphones",
    title: "ClearSound Max",
    description: "Беспроводные наушники с активным шумоподавлением и мягкими амбушюрами.",
    price: 260,
    badge: "-15%",
    images: productImages.headphones,
    specs: ["ANC", "Bluetooth 5.3", "40 часов", "быстрая зарядка"],
  },
  {
    id: "phone",
    title: "PixelWay S",
    description: "Компактный смартфон с чистой камерой, быстрой зарядкой и ярким экраном.",
    price: 780,
    badge: "new",
    images: productImages.phone,
    specs: ["OLED 120 Hz", "256 GB", "50 MP", "IP68"],
  },
  {
    id: "camera",
    title: "FrameShot Mini",
    description: "Камера для контента, путешествий и предметной съемки в домашней студии.",
    price: 640,
    badge: "pro",
    images: productImages.camera,
    specs: ["24 MP", "4K video", "Wi-Fi", "сменная оптика"],
  },
  {
    id: "watch",
    title: "PulseWatch 2",
    description: "Умные часы для уведомлений, тренировок и контроля ежедневной активности.",
    price: 310,
    badge: "top",
    images: productImages.watch,
    specs: ["AMOLED", "GPS", "NFC", "7 дней"],
  },
  {
    id: "keyboard",
    title: "KeyFlow Studio",
    description: "Тихая механическая клавиатура для рабочего стола и аккуратного сетапа.",
    price: 180,
    badge: "desk",
    images: productImages.keyboard,
    specs: ["hotswap", "USB-C", "2.4 GHz", "подсветка"],
  },
];

const banners = [
  {
    title: "Техника для чистого рабочего места",
    text: "Ноутбуки, аудио и аксессуары в одном минималистичном каталоге.",
    label: "sale / week",
    product: products[0],
  },
  {
    title: "Аудио без лишнего шума",
    text: "Подборки наушников с быстрой доставкой и гарантией магазина.",
    label: "audio day",
    product: products[1],
  },
  {
    title: "Обновите повседневный сетап",
    text: "Гаджеты, которые легко вписываются в работу, учебу и поездки.",
    label: "new arrivals",
    product: products[2],
  },
];

function money(value) {
  return `$${value.toLocaleString("en-US")}`;
}

export default function TechStore() {
  const [banner, setBanner] = useState(0);
  const [bannerDirection, setBannerDirection] = useState("next");
  const [cart, setCart] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const currentBanner = banners[banner];

  const cartSummary = useMemo(() => {
    return products.reduce(
      (summary, product) => {
        const amount = cart[product.id] || 0;
        return {
          count: summary.count + amount,
          total: summary.total + amount * product.price,
        };
      },
      { count: 0, total: 0 }
    );
  }, [cart]);

  const changeCart = (product, step) => {
    setCart((current) => {
      const nextValue = Math.max(0, (current[product.id] || 0) + step);
      const nextCart = { ...current, [product.id]: nextValue };
      if (nextValue === 0) delete nextCart[product.id];
      return nextCart;
    });
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedPhoto(0);
  };

  const nextBanner = () => {
    setBannerDirection("next");
    setBanner((value) => (value + 1) % banners.length);
  };
  const prevBanner = () => {
    setBannerDirection("prev");
    setBanner((value) => (value - 1 + banners.length) % banners.length);
  };

  return (
    <main className="tech-store-site">
      <header className="tech-store-header">
        <a className="tech-store-logo" href="#tech-home">DeviceHub</a>
        <nav aria-label="DeviceHub navigation">
          <a href="#tech-products">Каталог</a>
          <a href="#tech-location">Магазин</a>
          <a href="#tech-footer">Контакты</a>
        </nav>
        <div className="tech-store-actions">
          <button type="button" className="tech-cart-button" aria-label="Корзина">
            <ShoppingBag size={18} />
            <span>{cartSummary.count}</span>
          </button>
          <button
            type="button"
            className="tech-pay-button"
            onClick={() => setPaymentStatus(cartSummary.count ? "Оплата подготовлена в демо-режиме." : "Сначала добавьте товар в корзину.")}
          >
            <CreditCard size={18} />
            Оплата
          </button>
        </div>
      </header>

      <section className={`tech-hero tech-hero--${bannerDirection}`} id="tech-home">
        <div className="tech-banner-copy" key={`copy-${banner}`}>
          <span>{currentBanner.label}</span>
          <h1>{currentBanner.title}</h1>
          <p>{currentBanner.text}</p>
          <div className="tech-hero-controls">
            <button type="button" onClick={prevBanner} aria-label="Предыдущий баннер">
              <ChevronLeft size={20} />
            </button>
            <strong>{String(banner + 1).padStart(2, "0")} / 03</strong>
            <button type="button" onClick={nextBanner} aria-label="Следующий баннер">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <button
          type="button"
          className="tech-banner-product"
          key={`banner-${currentBanner.product.id}`}
          onClick={() => openProduct(currentBanner.product)}
        >
          <img src={currentBanner.product.images[0]} alt={currentBanner.product.title} />
          <span>Открыть товар</span>
        </button>
      </section>

      <div className="tech-marquee" aria-label="Акции">
        <div>
          <span>Скидки до 20% на аксессуары</span>
          <span>Бесплатная доставка от $500</span>
          <span>Гарантия магазина 12 месяцев</span>
          <span>Оплата картой или при получении</span>
        </div>
      </div>

      {paymentStatus && <p className="tech-payment-note">{paymentStatus}</p>}

      <section className="tech-products-section" id="tech-products">
        <div className="tech-section-head">
          <span>catalog</span>
          <h2>Популярная техника</h2>
        </div>

        <div className="tech-product-grid">
          {products.map((product) => {
            const amount = cart[product.id] || 0;
            return (
              <article className="tech-product-card" key={product.id}>
                <button type="button" className="tech-product-image" onClick={() => openProduct(product)}>
                  <img src={product.images[0]} alt={product.title} />
                  <span>{product.badge}</span>
                </button>
                <div className="tech-product-body">
                  <button type="button" onClick={() => openProduct(product)} className="tech-product-title">
                    {product.title}
                  </button>
                  <p>{product.description}</p>
                  <ul>
                    {product.specs.slice(0, 3).map((spec) => <li key={spec}>{spec}</li>)}
                  </ul>
                  <div className="tech-product-bottom">
                    <strong>{money(product.price)}</strong>
                    {amount ? (
                      <div className="tech-stepper" aria-label={`${product.title}: ${amount} в корзине`}>
                        <button type="button" onClick={() => changeCart(product, -1)}><Minus size={16} /></button>
                        <span>{amount}</span>
                        <button type="button" onClick={() => changeCart(product, 1)}><Plus size={16} /></button>
                      </div>
                    ) : (
                      <button type="button" onClick={() => changeCart(product, 1)}>В корзину</button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="tech-location" id="tech-location">
        <div>
          <span>location</span>
          <h2>Пункт выдачи в центре города</h2>
          <p>Можно забрать заказ самостоятельно, проверить устройство на месте и оплатить удобным способом.</p>
        </div>
        <div className="tech-map-card" aria-label="Карта магазина">
          <iframe
            title="DeviceHub Pickup на карте"
            src="https://www.google.com/maps?q=Москва,+Тверская+18&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <strong className="tech-map-label"><MapPin size={20} /> DeviceHub Pickup</strong>
        </div>
      </section>

      <footer className="tech-store-footer" id="tech-footer">
        <div>
          <strong>DeviceHub</strong>
          <span>tech store demo / 2026</span>
        </div>
        <div className="tech-cart-total">
          <ShoppingBag size={18} />
          <span>{cartSummary.count} шт.</span>
          <strong>{money(cartSummary.total)}</strong>
        </div>
      </footer>

      {selectedProduct && (
        <div className="tech-product-modal" role="dialog" aria-modal="true" aria-label={selectedProduct.title}>
          <div className="tech-product-modal-card">
            <button type="button" className="tech-modal-close" onClick={() => setSelectedProduct(null)} aria-label="Закрыть">
              <X size={22} />
            </button>
            <div className="tech-modal-gallery">
              <div className="tech-modal-main-image">
                <img src={selectedProduct.images[selectedPhoto]} alt={selectedProduct.title} />
              </div>
              <div className="tech-modal-thumbs">
                {selectedProduct.images.map((image, index) => (
                  <button
                    type="button"
                    key={image}
                    className={selectedPhoto === index ? "active" : ""}
                    onClick={() => setSelectedPhoto(index)}
                    aria-label={`Фото ${index + 1}`}
                  >
                    <img src={image} alt="" />
                  </button>
                ))}
              </div>
            </div>
            <div className="tech-modal-info">
              <span>{selectedProduct.badge}</span>
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.description}</p>
              <ul>
                {selectedProduct.specs.map((spec) => <li key={spec}><Zap size={16} /> {spec}</li>)}
              </ul>
              <div className="tech-modal-buy">
                <strong>{money(selectedProduct.price)}</strong>
                <button type="button" onClick={() => changeCart(selectedProduct, 1)}>Добавить в корзину</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
