import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  ShoppingBag,
  Star,
  X,
} from "lucide-react";
import "./sneaker-landing.scss";
import heroShoe from "./img/colorful-sneaker.png";
import skullArt from "./img/skull-illustration.png";
import sneakersArt from "./img/sneakers-art.png";
import repoLogo from "./img/react-sneakers-logo.png";
import shoe1 from "./img/products/1.png";
import shoe2 from "./img/products/2.png";
import shoe3 from "./img/products/3.png";
import shoe4 from "./img/products/4.png";
import shoe5 from "./img/products/5.png";
import shoe6 from "./img/products/6.png";
import shoe7 from "./img/products/7.png";
import shoe8 from "./img/products/8.png";
import shoe9 from "./img/products/9.png";
import shoe10 from "./img/products/10.png";
import shoe11 from "./img/products/11.png";
import shoe12 from "./img/products/12.png";

const categories = ["All", "Running", "Basketball", "Lifestyle", "Training"];
const PRODUCTS_PER_PAGE = 6;

const products = [
  {
    id: 1,
    title: "Nike Air Max 270",
    category: "Running",
    price: 179,
    oldPrice: 210,
    image: shoe1,
    colors: ["#f6f7fb", "#20b7d6", "#f5a623"],
    sizes: [7, 8, 9, 10, 11],
    text: "A lightweight daily runner with responsive Air cushioning and a clean street profile.",
  },
  {
    id: 2,
    title: "Nike Blazer Mid Suede",
    category: "Lifestyle",
    price: 118,
    oldPrice: 150,
    image: shoe2,
    colors: ["#f7f4e9", "#24324c", "#b28455"],
    sizes: [6, 7, 8, 9, 10],
    text: "Vintage court shape, suede upper and padded ankle support for a relaxed everyday fit.",
  },
  {
    id: 3,
    title: "Puma Future Rider",
    category: "Training",
    price: 129,
    oldPrice: 170,
    image: shoe3,
    colors: ["#f04f24", "#44d3ff", "#fbca32"],
    sizes: [7, 8, 9, 10],
    text: "Bright layered panels, soft foam and a flexible sole made for active city movement.",
  },
  {
    id: 4,
    title: "Under Armour Curry 8",
    category: "Basketball",
    price: 199,
    oldPrice: 240,
    image: shoe4,
    colors: ["#ffffff", "#1a5ca8", "#101827"],
    sizes: [8, 9, 10, 11, 12],
    text: "A court-ready pair with locked-in traction, stable heel support and quick cuts in mind.",
  },
  {
    id: 5,
    title: "Blazer Rebel Orange",
    category: "Lifestyle",
    price: 149,
    oldPrice: 190,
    image: shoe5,
    colors: ["#f47a22", "#101827", "#ffffff"],
    sizes: [6, 7, 8, 9, 10],
    text: "Bold color, durable stitching and classic side profile for people who like loud details.",
  },
  {
    id: 6,
    title: "Nike Kyrie 7",
    category: "Basketball",
    price: 165,
    oldPrice: 205,
    image: shoe6,
    colors: ["#ef2d56", "#141b4d", "#f3f7ff"],
    sizes: [8, 9, 10, 11],
    text: "Fast-footed basketball shape with curved traction and a breathable forefoot zone.",
  },
  {
    id: 7,
    title: "Air Jordan 11",
    category: "Lifestyle",
    price: 220,
    oldPrice: 260,
    image: shoe7,
    colors: ["#111827", "#ffffff", "#d6dce7"],
    sizes: [7, 8, 9, 10, 11, 12],
    text: "Glossy overlays, iconic silhouette and a premium finish for weekend rotation.",
  },
  {
    id: 8,
    title: "Nike LeBron XVIII",
    category: "Basketball",
    price: 235,
    oldPrice: 280,
    image: shoe8,
    colors: ["#7a2df0", "#20d1ff", "#ff7a18"],
    sizes: [8, 9, 10, 11, 12],
    text: "High-impact cushioning, sculpted support and color energy built for power players.",
  },
  {
    id: 9,
    title: "LeBron XVIII Low",
    category: "Running",
    price: 188,
    oldPrice: 230,
    image: shoe9,
    colors: ["#fd5f00", "#f8f8f8", "#101827"],
    sizes: [7, 8, 9, 10, 11],
    text: "Lower collar, lighter feel and a chunky performance sole that still looks sharp outside.",
  },
  {
    id: 10,
    title: "Blazer Ash Runner",
    category: "Training",
    price: 110,
    oldPrice: 145,
    image: shoe10,
    colors: ["#d7d9dd", "#1f2937", "#f2b44b"],
    sizes: [6, 7, 8, 9, 10],
    text: "A clean training option with a soft collar and enough grip for a full day on foot.",
  },
  {
    id: 11,
    title: "Puma Rider Ice",
    category: "Running",
    price: 136,
    oldPrice: 175,
    image: shoe11,
    colors: ["#dcecf8", "#fa4a7a", "#1e376b"],
    sizes: [7, 8, 9, 10],
    text: "Retro runner attitude, icy panels and a cushioned platform for soft daily miles.",
  },
  {
    id: 12,
    title: "Nike Kyrie Flytrap IV",
    category: "Basketball",
    price: 158,
    oldPrice: 200,
    image: shoe12,
    colors: ["#ffffff", "#101827", "#ffb100"],
    sizes: [8, 9, 10, 11, 12],
    text: "Responsive court control with a lightweight upper and aggressive outsole pattern.",
  },
];

const stories = [
  {
    id: "skull",
    title: "I still have my feet on the ground. I just wear better shoes.",
    text: "Every pair is selected for comfort, shape and daily wear. The idea is simple: shoes should look fearless without slowing you down.",
    image: skullArt,
    imageAlt: "Colorful skull illustration",
    tone: "orange",
  },
  {
    id: "nylon",
    title: "Men Minimalist Large capacity Nylon Shoe",
    text: "Lightweight materials, strong lines and bold accents keep the collection practical for travel, training and long city days.",
    image: sneakersArt,
    imageAlt: "Sneaker artwork",
    tone: "blue",
  },
];

const reviews = [
  {
    name: "Jordan Miles",
    role: "Streetwear buyer",
    text:
      "The product cards make it easy to compare color, shape and price without opening a dozen tabs. I picked my size, checked the color circles and added the pair in less than a minute.",
  },
  {
    name: "Mia Laurent",
    role: "Runner",
    text:
      "I like that the shop feels energetic but still clear. The featured carousel helped me browse the strongest models first, and the detailed view had the sizing info I needed.",
  },
  {
    name: "Artem Silva",
    role: "Collector",
    text:
      "The gallery is the best part. Filters do not feel heavy, product previews are big enough, and the orange-blue palette gives the whole shop a real sneaker drop mood.",
  },
];

function scrollToSneakerSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function money(value) {
  return `$${value}`;
}

function getFeaturedVisibleCount() {
  if (typeof window === "undefined") return 4;

  if (window.innerWidth <= 780) return 1;
  if (window.innerWidth <= 1180) return 2;

  return 4;
}

function SneakerLanding() {
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredVisible, setFeaturedVisible] = useState(getFeaturedVisibleCount);
  const [featuredDirection, setFeaturedDirection] = useState("next");
  const [featuredMotion, setFeaturedMotion] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [productPage, setProductPage] = useState(0);
  const [query, setQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [expandedReview, setExpandedReview] = useState(null);
  const featuredAnimationTimer = useRef(null);

  const maxFeaturedIndex = Math.max(0, products.length - featuredVisible);
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  function addToCart(product) {
    setCartItems((items) => {
      const existingItem = items.find((item) => item.product.id === product.id);

      if (existingItem) {
        return items.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...items, { product, quantity: 1 }];
    });
    setCheckoutMessage("");
    setIsCartOpen(true);
  }

  function changeCartQuantity(productId, change) {
    setCartItems((items) =>
      items
        .map((item) => (item.product.id === productId ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function checkoutCart() {
    if (!cartItems.length) return;

    setCartItems([]);
    setIsCartOpen(false);
    setCheckoutMessage("ваш заказ успешно выполнен, спасибо вам за покупку");
  }

  function shiftFeatured(direction) {
    if (featuredMotion) return;

    setFeaturedDirection(direction);
    setFeaturedIndex((index) => {
      const nextIndex = direction === "next" ? Math.min(index + 1, maxFeaturedIndex) : Math.max(index - 1, 0);

      if (nextIndex === index) return index;

      const edgeOffset = featuredVisible - 1;
      const leavingIndex = direction === "next" ? index : index + edgeOffset;
      const enteringIndex = direction === "next" ? nextIndex + edgeOffset : nextIndex;

      if (featuredAnimationTimer.current) {
        window.clearTimeout(featuredAnimationTimer.current);
      }

      setFeaturedMotion({ direction, leavingIndex, enteringIndex });
      featuredAnimationTimer.current = window.setTimeout(() => {
        setFeaturedMotion(null);
        featuredAnimationTimer.current = null;
      }, 680);

      return nextIndex;
    });
  }

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory = activeCategory === "All" || product.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        product.title.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const productPageCount = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));
  const paginatedProducts = useMemo(() => {
    const pageStart = productPage * PRODUCTS_PER_PAGE;

    return visibleProducts.slice(pageStart, pageStart + PRODUCTS_PER_PAGE);
  }, [productPage, visibleProducts]);

  const activeReview = reviews[reviewIndex];

  useEffect(() => {
    setProductPage(0);
  }, [activeCategory, query]);

  useEffect(() => {
    setProductPage((page) => Math.min(page, productPageCount - 1));
  }, [productPageCount]);

  useEffect(() => {
    const syncFeaturedVisible = () => setFeaturedVisible(getFeaturedVisibleCount());

    syncFeaturedVisible();
    window.addEventListener("resize", syncFeaturedVisible);

    return () => window.removeEventListener("resize", syncFeaturedVisible);
  }, []);

  useEffect(() => {
    setFeaturedIndex((index) => Math.min(index, maxFeaturedIndex));
  }, [maxFeaturedIndex]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setReviewIndex((index) => (index + 1) % reviews.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!selectedProduct) return;

    setSelectedSize(selectedProduct.sizes[0]);
    setSelectedColor(selectedProduct.colors[0]);
  }, [selectedProduct]);

  useEffect(() => {
    if (!checkoutMessage) return undefined;

    const timer = window.setTimeout(() => setCheckoutMessage(""), 5200);

    return () => window.clearTimeout(timer);
  }, [checkoutMessage]);

  useEffect(() => {
    return () => {
      if (featuredAnimationTimer.current) {
        window.clearTimeout(featuredAnimationTimer.current);
      }
    };
  }, []);

  return (
    <main className="sneaker-site">
      <section className="sneaker-hero" id="sneaker-home">
        <nav className="sneaker-nav" aria-label="Sneakamp navigation">
          <button className="sneaker-brand" type="button" onClick={() => scrollToSneakerSection("sneaker-home")}>
            <img src={repoLogo} alt="" />
            Sneakamp
          </button>
          <label className="sneaker-search">
            <Search size={16} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by item"
              aria-label="Search sneakers"
            />
          </label>
          <div className="sneaker-nav-links">
            <button type="button" onClick={() => scrollToSneakerSection("sneaker-featured")}>
              Featured
            </button>
            <button type="button" onClick={() => scrollToSneakerSection("sneaker-gallery")}>
              Products
            </button>
            <button type="button" onClick={() => scrollToSneakerSection("sneaker-stories")}>
              About Us
            </button>
            <button type="button" onClick={() => scrollToSneakerSection("sneaker-footer")}>
              Contact
            </button>
          </div>
          <div className="sneaker-nav-actions">
            <button className="sneaker-shop-btn" type="button" onClick={() => scrollToSneakerSection("sneaker-gallery")}>
              Shop Now
            </button>
            <button className="sneaker-cart-trigger" type="button" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={19} />
              <span>{cartItemCount}</span>
            </button>
          </div>
        </nav>

        <span className="sneaker-hero-bg-shape" />

        <div className="sneaker-hero-grid">
          <div className="sneaker-hero-copy">
            <p>Exclusive gallery</p>
            <h1>
              This Stylish <span>Shoe</span> is Big Enough
            </h1>
            <div className="sneaker-hero-actions">
              <button type="button" onClick={() => scrollToSneakerSection("sneaker-featured")}>
                Featured
              </button>
              <button type="button" onClick={() => scrollToSneakerSection("sneaker-gallery")}>
                Gallery <ArrowRight size={18} />
              </button>
            </div>
            <div className="sneaker-mini-proof">
              <span>40K</span>
              <small>happy followers</small>
            </div>
          </div>

          <div className="sneaker-hero-visual" aria-label="Colorful sneaker preview">
            <span className="sneaker-star sneaker-star--one" />
            <span className="sneaker-star sneaker-star--two" />
            <img src={heroShoe} alt="Colorful sneaker pair" />
            <div className="sneaker-hero-badge">
              <strong>10K+</strong>
              <span>shoe reviews</span>
            </div>
          </div>
        </div>
      </section>

      <section className="sneaker-featured" id="sneaker-featured">
        <div className="sneaker-section-head">
          <h2>
            Featured <span>Products</span>
          </h2>
        </div>

        <div className="sneaker-featured-shell">
          <button
            className="sneaker-carousel-arrow"
            type="button"
            onClick={() => shiftFeatured("prev")}
            disabled={featuredIndex === 0}
            aria-label="Previous featured sneakers"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="sneaker-featured-window">
            <div
              className={`sneaker-featured-row sneaker-featured-row--${featuredDirection}`}
              style={{ "--featured-index": featuredIndex }}
            >
              {products.map((product, productIndex) => {
                const featuredCardClassName = [
                  "sneaker-featured-card",
                  featuredMotion?.leavingIndex === productIndex ? "sneaker-featured-card--leaving" : "",
                  featuredMotion?.enteringIndex === productIndex ? "sneaker-featured-card--entering" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <article className={featuredCardClassName} key={product.id}>
                    <button
                      className="sneaker-featured-preview"
                      type="button"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <span className="sneaker-card-art">
                        <img src={product.image} alt="" loading="lazy" decoding="async" />
                      </span>
                    </button>
                    <span className="sneaker-featured-info">
                      <button
                        className="sneaker-featured-title"
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                      >
                        <strong>{product.title}</strong>
                      </button>
                      <small>
                        {money(product.price)}
                        <s>{money(product.oldPrice)}</s>
                      </small>
                      <button
                        className="sneaker-featured-cart"
                        type="button"
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.title} to cart`}
                      >
                        <ShoppingBag size={15} />
                      </button>
                    </span>
                  </article>
                );
              })}
            </div>
          </div>
          <button
            className="sneaker-carousel-arrow"
            type="button"
            onClick={() => shiftFeatured("next")}
            disabled={featuredIndex === maxFeaturedIndex}
            aria-label="Next featured sneakers"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      <section className="sneaker-stories" id="sneaker-stories">
        {stories.map((story, index) => {
          const isFlipped = index % 2 === 1;

          const artPanel = (
            <div
              className={`sneaker-story-panel sneaker-story-panel--orange sneaker-story-art sneaker-story-art--${story.id}`}
              key="art"
            >
              <img src={story.image} alt={story.imageAlt} loading="lazy" decoding="async" />
            </div>
          );

          const copyPanel = (
            <div
              className={`sneaker-story-panel sneaker-story-copy ${
                isFlipped ? "sneaker-story-panel--deep" : "sneaker-story-panel--blue"
              }`}
              key="copy"
            >
              <div>
                <h2>{story.title}</h2>
                <p>{story.text}</p>
                <button type="button" onClick={() => scrollToSneakerSection("sneaker-gallery")}>
                  Learn More
                </button>
              </div>
            </div>
          );

          return (
            <article className={`sneaker-story ${isFlipped ? "sneaker-story--flipped" : ""}`} key={story.id}>
              {isFlipped ? [copyPanel, artPanel] : [artPanel, copyPanel]}
            </article>
          );
        })}
      </section>

      <section className="sneaker-gallery" id="sneaker-gallery">
        <div className="sneaker-section-head sneaker-section-head--gallery">
          <h2>
            Choose Your Best <span>Category Product</span>
          </h2>
          <button type="button" onClick={() => scrollToSneakerSection("sneaker-footer")}>
            More <ArrowRight size={17} />
          </button>
        </div>

        <div className="sneaker-shop-grid">
          <aside className="sneaker-filter-panel" aria-label="Sneaker filters">
            <div>
              <Filter size={18} />
              <strong>Browse by category</strong>
            </div>
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? "active" : ""}
                type="button"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </aside>

          <div className="sneaker-products-grid" key={`${activeCategory}-${query}-${productPage}`}>
            {paginatedProducts.map((product) => (
              <button
                className="sneaker-product-card"
                key={product.id}
                type="button"
                onClick={() => setSelectedProduct(product)}
              >
                <img src={product.image} alt={product.title} loading="lazy" decoding="async" />
                <strong>{product.title}</strong>
                <span>
                  {money(product.price)}
                  <s>{money(product.oldPrice)}</s>
                </span>
              </button>
            ))}
          </div>

          {productPageCount > 1 && (
            <nav className="sneaker-products-pagination" aria-label="Products pages">
              <button
                type="button"
                onClick={() => setProductPage((page) => Math.max(page - 1, 0))}
                disabled={productPage === 0}
                aria-label="Previous products page"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: productPageCount }, (_, pageIndex) => (
                <button
                  className={productPage === pageIndex ? "active" : ""}
                  key={pageIndex}
                  type="button"
                  onClick={() => setProductPage(pageIndex)}
                  aria-current={productPage === pageIndex ? "page" : undefined}
                >
                  {pageIndex + 1}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setProductPage((page) => Math.min(page + 1, productPageCount - 1))}
                disabled={productPage === productPageCount - 1}
                aria-label="Next products page"
              >
                <ChevronRight size={20} />
              </button>
            </nav>
          )}
        </div>
      </section>

      <section className="sneaker-feedback" id="sneaker-feedback">
        <h2>
          Customer <span>feedback</span> on our products
        </h2>
        <article className="sneaker-review-card" key={activeReview.name}>
          <div className="sneaker-review-stars" aria-label="5 stars">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={20} fill="currentColor" />
            ))}
          </div>
          <p>{activeReview.text}</p>
          <div className="sneaker-review-author">
            <span>{activeReview.name[0]}</span>
            <div>
              <strong>{activeReview.name}</strong>
              <small>{activeReview.role}</small>
            </div>
            <button type="button" onClick={() => setExpandedReview(activeReview)}>
              Read full
            </button>
          </div>
        </article>
      </section>

      <footer className="sneaker-footer" id="sneaker-footer">
        <div>
          <h2>Subscribe to our Newsletter</h2>
          <label>
            <input placeholder="Enter your email" aria-label="Email for newsletter" />
            <button type="button">Join</button>
          </label>
        </div>
        <nav aria-label="Footer navigation">
          <a href="#sneaker-home">Home</a>
          <a href="#sneaker-featured">Featured</a>
          <a href="#sneaker-gallery">Products</a>
          <a href="#sneaker-feedback">Feedback</a>
        </nav>
        <p>Copyright 2026. All rights reserved.</p>
      </footer>

      {selectedProduct && (
        <div className="sneaker-modal" role="dialog" aria-modal="true" aria-label={selectedProduct.title}>
          <button className="sneaker-modal-backdrop" type="button" onClick={() => setSelectedProduct(null)} />
          <div className="sneaker-product-detail">
            <button className="sneaker-close" type="button" onClick={() => setSelectedProduct(null)} aria-label="Close">
              <X size={22} />
            </button>
            <div className="sneaker-detail-art">
              <img src={selectedProduct.image} alt={selectedProduct.title} />
            </div>
            <div className="sneaker-detail-copy">
              <span>{selectedProduct.category}</span>
              <h2>{selectedProduct.title}</h2>
              <p>{selectedProduct.text}</p>
              <strong className="sneaker-detail-price">{money(selectedProduct.price)}</strong>
              <div className="sneaker-detail-options">
                <small>Size</small>
                <div>
                  {selectedProduct.sizes.map((size) => (
                    <button
                      className={selectedSize === size ? "active" : ""}
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              <div className="sneaker-detail-options">
                <small>Color</small>
                <div>
                  {selectedProduct.colors.map((color) => (
                    <button
                      className={`sneaker-color-dot ${selectedColor === color ? "active" : ""}`}
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      style={{ background: color }}
                      aria-label={`Select color ${color}`}
                    />
                  ))}
                </div>
              </div>
              <button
                className="sneaker-detail-buy"
                type="button"
                onClick={() => {
                  addToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

      {isCartOpen && (
        <div className="sneaker-modal" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <button className="sneaker-modal-backdrop" type="button" onClick={() => setIsCartOpen(false)} />
          <aside className="sneaker-cart-panel">
            <button className="sneaker-close" type="button" onClick={() => setIsCartOpen(false)} aria-label="Close">
              <X size={22} />
            </button>
            <div className="sneaker-cart-head">
              <span>
                <ShoppingBag size={22} />
              </span>
              <div>
                <small>Sneakamp cart</small>
                <h2>Корзина</h2>
              </div>
            </div>

            {cartItems.length ? (
              <>
                <div className="sneaker-cart-list">
                  {cartItems.map((item) => (
                    <article className="sneaker-cart-item" key={item.product.id}>
                      <img src={item.product.image} alt="" />
                      <div>
                        <strong>{item.product.title}</strong>
                        <span>{money(item.product.price)}</span>
                      </div>
                      <div className="sneaker-cart-quantity">
                        <button type="button" onClick={() => changeCartQuantity(item.product.id, -1)}>
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button type="button" onClick={() => changeCartQuantity(item.product.id, 1)}>
                          +
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="sneaker-cart-total">
                  <span>Итого</span>
                  <strong>{money(cartTotal)}</strong>
                </div>
                <button className="sneaker-cart-checkout" type="button" onClick={checkoutCart}>
                  Оплатить
                </button>
              </>
            ) : (
              <p className="sneaker-cart-empty">Корзина пока пустая. Добавь пару из карусели или карточки товара.</p>
            )}
          </aside>
        </div>
      )}

      {expandedReview && (
        <div className="sneaker-modal" role="dialog" aria-modal="true" aria-label="Full customer review">
          <button className="sneaker-modal-backdrop" type="button" onClick={() => setExpandedReview(null)} />
          <div className="sneaker-review-modal">
            <button className="sneaker-close" type="button" onClick={() => setExpandedReview(null)} aria-label="Close">
              <X size={22} />
            </button>
            <div className="sneaker-review-stars" aria-label="5 stars">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} size={22} fill="currentColor" />
              ))}
            </div>
            <h2>{expandedReview.name}</h2>
            <span>{expandedReview.role}</span>
            <p>
              {expandedReview.text} The fit felt true to size, checkout was clear, and the detail panel gave me enough
              confidence to choose a new colorway without guessing.
            </p>
          </div>
        </div>
      )}

      {checkoutMessage && <div className="sneaker-checkout-toast">{checkoutMessage}</div>}
    </main>
  );
}

export default SneakerLanding;
