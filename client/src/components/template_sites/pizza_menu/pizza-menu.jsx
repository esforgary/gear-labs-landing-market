import { useMemo, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  X,
} from "lucide-react";
import "./pizza-menu.scss";
import pizzaHero from "./img/pizza-hero.svg";

const PIZZAS = [
  {
    id: 1,
    name: "Маргарита Неаполь",
    category: "Классика",
    basePrice: 590,
    accent: "#ff6b1a",
    ingredients: ["моцарелла", "томаты", "базилик", "пармезан"],
    text: "Мягкое тесто, сладкие томаты и много тянущейся моцареллы.",
  },
  {
    id: 2,
    name: "Пепперони Файр",
    category: "Острое",
    basePrice: 690,
    accent: "#e92e27",
    ingredients: ["пепперони", "моцарелла", "чили", "томатный соус"],
    text: "Плотная мясная классика с легкой остротой и хрустящим краем.",
  },
  {
    id: 3,
    name: "Четыре сыра",
    category: "Классика",
    basePrice: 720,
    accent: "#ffd45a",
    ingredients: ["моцарелла", "дорблю", "чеддер", "пармезан"],
    text: "Сливочная, насыщенная и очень сырная пицца без лишнего шума.",
  },
  {
    id: 4,
    name: "BBQ Бекон",
    category: "Мясные",
    basePrice: 760,
    accent: "#8d361c",
    ingredients: ["бекон", "курица", "лук", "барбекю", "моцарелла"],
    text: "Дымный соус, сочная курица и бекон для сытного заказа.",
  },
  {
    id: 5,
    name: "Груша и горгонзола",
    category: "Авторские",
    basePrice: 790,
    accent: "#73b36c",
    ingredients: ["груша", "горгонзола", "грецкий орех", "руккола"],
    text: "Сладко-соленая авторская пицца с мягким сливочным вкусом.",
  },
  {
    id: 6,
    name: "Ветчина Грибы",
    category: "Классика",
    basePrice: 650,
    accent: "#d19a54",
    ingredients: ["ветчина", "шампиньоны", "моцарелла", "сливочный соус"],
    text: "Спокойный любимец для семьи: грибы, ветчина и нежный соус.",
  },
  {
    id: 7,
    name: "Мясной микс",
    category: "Мясные",
    basePrice: 850,
    accent: "#b6221f",
    ingredients: ["говядина", "пепперони", "бекон", "курица", "лук"],
    text: "Большой мясной набор с ярким томатным соусом.",
  },
  {
    id: 8,
    name: "Овощная терраса",
    category: "Вегетарианские",
    basePrice: 620,
    accent: "#27a85c",
    ingredients: ["перец", "томаты", "оливки", "лук", "шампиньоны"],
    text: "Легкая овощная пицца с сочными кусочками и свежим ароматом.",
  },
  {
    id: 9,
    name: "Гавайская",
    category: "Авторские",
    basePrice: 690,
    accent: "#f7b733",
    ingredients: ["курица", "ананас", "моцарелла", "сливочный соус"],
    text: "Сладкий ананас и нежная курица на мягкой сырной базе.",
  },
  {
    id: 10,
    name: "Трюфельная",
    category: "Авторские",
    basePrice: 920,
    accent: "#101827",
    ingredients: ["трюфельный крем", "грибы", "моцарелла", "руккола"],
    text: "Более ресторанный вкус: грибы, крем и тонкий аромат трюфеля.",
  },
  {
    id: 11,
    name: "Диабло",
    category: "Острое",
    basePrice: 770,
    accent: "#ff3b22",
    ingredients: ["пепперони", "халапеньо", "чили", "моцарелла"],
    text: "Острая пицца с перцем, которая не просит разрешения.",
  },
  {
    id: 12,
    name: "Цезарь пицца",
    category: "Мясные",
    basePrice: 740,
    accent: "#d6b26d",
    ingredients: ["курица", "томаты", "пармезан", "айсберг", "соус цезарь"],
    text: "Все узнаваемое из салата, но в горячем формате.",
  },
];

const CATEGORIES = ["Все", "Классика", "Мясные", "Острое", "Авторские", "Вегетарианские"];
const SIZES = [
  { label: "30 см", value: 30, extra: 0 },
  { label: "45 см", value: 45, extra: 240 },
  { label: "60 см", value: 60, extra: 520 },
];
const ADDONS = [
  { name: "сырный борт", price: 120 },
  { name: "доп. моцарелла", price: 90 },
  { name: "пепперони", price: 110 },
  { name: "халапеньо", price: 70 },
  { name: "грибы", price: 65 },
  { name: "бекон", price: 130 },
];

const TOPPING_CLASS_BY_NAME = {
  "сырный борт": "cheese",
  "доп. моцарелла": "mozzarella",
  "пепперони": "pepperoni",
  "халапеньо": "jalapeno",
  "грибы": "mushroom",
  "бекон": "bacon",
};
const LOCATIONS = [
  { city: "Москва", address: "Тверская 18", x: 44, y: 37 },
  { city: "Москва", address: "Парк Горького", x: 58, y: 62 },
  { city: "Санкт-Петербург", address: "Невский 76", x: 47, y: 48 },
  { city: "Казань", address: "Баумана 21", x: 64, y: 34 },
  { city: "Краснодар", address: "Красная 92", x: 38, y: 69 },
];

const INITIAL_FORM = {
  city: "Москва",
  address: "",
  telegram: "",
  phone: "",
  comment: "",
  payment: "На месте при получении",
};

function currency(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function scrollToPizzaSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function PizzaArt({ accent, addons = [] }) {
  return (
    <span className="pizza-art" style={{ "--pizza-accent": accent }} aria-hidden="true">
      <i />
      <i />
      <i />
      <i />
      <i />
      {addons.slice(0, 10).map((addon, index) => (
        <span
          key={`${addon.name}-${index}`}
          className={`pizza-art-topping pizza-art-topping--${TOPPING_CLASS_BY_NAME[addon.name] ?? "pepperoni"}`}
          style={{ "--topping-index": index }}
        />
      ))}
    </span>
  );
}

function PizzaMenuLanding() {
  const [activeCategory, setActiveCategory] = useState("Все");
  const [visibleCount, setVisibleCount] = useState(9);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [selectedPizza, setSelectedPizza] = useState(null);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [formError, setFormError] = useState("");
  const [deliveryModal, setDeliveryModal] = useState(null);

  const filteredPizzas = useMemo(() => {
    if (activeCategory === "Все") return PIZZAS;
    return PIZZAS.filter((pizza) => pizza.category === activeCategory);
  }, [activeCategory]);

  const visiblePizzas = filteredPizzas.slice(0, visibleCount);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const selectedAddonsTotal = selectedAddons.reduce((total, addon) => total + addon.price, 0);
  const selectedPrice = selectedPizza ? selectedPizza.basePrice + selectedSize.extra + selectedAddonsTotal : 0;
  const orderSummary = cartItems.length
    ? cartItems
        .map((item) => {
          const addons = item.addons.length ? ` (${item.addons.map((addon) => addon.name).join(", ")})` : "";
          return `${item.name} ${item.size.label}${addons}`;
        })
        .join(", ")
    : "Корзина пока пустая";

  function openPizza(pizza) {
    setSelectedPizza(pizza);
    setSelectedSize(SIZES[0]);
    setSelectedAddons([]);
  }

  function toggleAddon(addon) {
    setSelectedAddons((addons) =>
      addons.some((item) => item.name === addon.name)
        ? addons.filter((item) => item.name !== addon.name)
        : [...addons, addon],
    );
  }

  function addSelectedPizza() {
    if (!selectedPizza) return;

    const configuredPizza = {
      id: `${selectedPizza.id}-${selectedSize.value}-${selectedAddons.map((addon) => addon.name).join("-")}`,
      name: selectedPizza.name,
      size: selectedSize,
      addons: selectedAddons,
      price: selectedPrice,
      imageAccent: selectedPizza.accent,
      quantity: 1,
    };

    setCartItems((items) => {
      const existing = items.find((item) => item.id === configuredPizza.id);
      if (existing) {
        return items.map((item) => (item.id === configuredPizza.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...items, configuredPizza];
    });
    setSelectedPizza(null);
    setCartOpen(true);
  }

  function addPizzaQuick(pizza) {
    setCartItems((items) => {
      const id = `${pizza.id}-30-`;
      const existing = items.find((item) => item.id === id);
      if (existing) {
        return items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
      }

      return [
        ...items,
        {
          id,
          name: pizza.name,
          size: SIZES[0],
          addons: [],
          price: pizza.basePrice,
          imageAccent: pizza.accent,
          quantity: 1,
        },
      ];
    });
    setCartOpen(true);
  }

  function changeQuantity(id, change) {
    setCartItems((items) =>
      items
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity + change } : item))
        .filter((item) => item.quantity > 0),
    );
  }

  function handleOrderClick() {
    setCartOpen(false);
    scrollToPizzaSection("pizza-checkout");
  }

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
  }

  function submitOrder(event) {
    event.preventDefault();

    if (!cartItems.length) {
      setFormError("Добавьте хотя бы одну пиццу в корзину.");
      return;
    }

    if (!form.city || !form.address.trim() || !form.telegram.trim() || !form.phone.trim()) {
      setFormError("Заполните город, адрес, Telegram и телефон.");
      return;
    }

    const cityLocations = LOCATIONS.filter((location) => location.city === form.city);
    const point = cityLocations.length
      ? cityLocations[Math.floor(Math.random() * cityLocations.length)]
      : LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
    const distance = (1.4 + Math.random() * 7.8).toFixed(1).replace(".", ",");

    setDeliveryModal({
      point,
      distance,
      eta: 15,
      address: form.address,
    });
    setCartItems([]);
  }

  return (
    <main className="pizza-site">
      <section className="pizza-hero" id="pizza-home">
        <nav className="pizza-nav" aria-label="Pizza navigation">
          <button type="button" className="pizza-brand" onClick={() => scrollToPizzaSection("pizza-home")}>
            <span className="pizza-brand-mark" />
            Ovenly Pizza
          </button>
          <div className="pizza-nav-links">
            <button type="button" onClick={() => scrollToPizzaSection("pizza-menu")}>Меню</button>
            <button type="button" onClick={() => scrollToPizzaSection("pizza-checkout")}>Оформление</button>
            <button type="button" onClick={() => scrollToPizzaSection("pizza-locations")}>Адреса</button>
          </div>
          <button type="button" className="pizza-cart-button" onClick={() => setCartOpen(true)}>
            <ShoppingCart size={18} />
            <span>{cartCount}</span>
          </button>
        </nav>

        <div className="pizza-hero-grid">
          <div className="pizza-hero-copy">
            <span className="pizza-eyebrow">Горячая печь каждый день</span>
            <h1>
              <span className="pizza-title-brand"><span className="pizza-title-mark" />venly Pizza</span>
              <br />
              Пицца, которая доезжает горячей и исчезает первой.
            </h1>
            <p>
              Выберите основу, насыпьте любимые добавки, поймайте ближайшую печь и оформите заказ
              без звонков. Мы покажем состав, цену и маршрут доставки сразу на странице.
            </p>
            <div className="pizza-hero-actions">
              <button type="button" onClick={() => scrollToPizzaSection("pizza-menu")}>
                Смотреть меню <ArrowRight size={18} />
              </button>
              <button type="button" onClick={() => setCartOpen(true)}>
                Открыть корзину
              </button>
            </div>
          </div>
          <div className="pizza-hero-visual" aria-hidden="true">
            <img src={pizzaHero} alt="" />
            <div className="pizza-hero-card">
              <strong>30 мин</strong>
              <span>средняя доставка</span>
            </div>
          </div>
        </div>
      </section>

      <section className="pizza-menu-section" id="pizza-menu">
        <div className="pizza-section-heading">
          <span>Меню</span>
          <h2>Выберите пиццу</h2>
          <p>Листайте горячие позиции, выбирайте вкус под настроение и открывайте карточку, чтобы собрать размер, корочку и добавки прямо на пицце.</p>
        </div>

        <div className="pizza-filter-row" aria-label="Pizza categories">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={activeCategory === category ? "is-active" : ""}
              onClick={() => {
                setActiveCategory(category);
                setVisibleCount(9);
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="pizza-grid">
          {visiblePizzas.map((pizza) => (
            <article className="pizza-card" key={pizza.id}>
              <button type="button" className="pizza-card-media" onClick={() => openPizza(pizza)}>
                <PizzaArt accent={pizza.accent} />
              </button>
              <div className="pizza-card-body">
                <span>{pizza.category}</span>
                <h3>{pizza.name}</h3>
                <p>{pizza.text}</p>
                <div className="pizza-card-foot">
                  <strong>от {currency(pizza.basePrice)}</strong>
                  <button type="button" onClick={() => addPizzaQuick(pizza)} aria-label={`Добавить ${pizza.name}`}>
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {visibleCount < filteredPizzas.length && (
          <button type="button" className="pizza-show-more" onClick={() => setVisibleCount((count) => count + 3)}>
            Показать еще <ChevronDown size={20} />
          </button>
        )}
      </section>

      <section className="pizza-locations-checkout" id="pizza-checkout">
        <div className="pizza-map-panel" id="pizza-locations">
          <div className="pizza-map">
            {LOCATIONS.map((location) => (
              <span
                key={`${location.city}-${location.address}`}
                className="pizza-map-pin"
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
              >
                <MapPin size={18} />
              </span>
            ))}
            <div className="pizza-map-route" />
          </div>
          <div className="pizza-location-list">
            {LOCATIONS.slice(0, 4).map((location) => (
              <span key={`${location.city}-${location.address}`}>
                <strong>{location.city}</strong>
                {location.address}
              </span>
            ))}
          </div>
        </div>

        <form className="pizza-checkout-form" onSubmit={submitOrder}>
          <span className="pizza-eyebrow">Оформление заказа</span>
          <h2>Куда привезти?</h2>
          <p className="pizza-order-summary">{orderSummary}</p>

          <label>
            Город*
            <select value={form.city} onChange={(event) => updateForm("city", event.target.value)} required>
              {["Москва", "Санкт-Петербург", "Казань", "Краснодар", "Екатеринбург"].map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </label>

          <label>
            Адрес*
            <input
              value={form.address}
              onChange={(event) => updateForm("address", event.target.value)}
              placeholder="Улица, дом, квартира"
              required
            />
          </label>

          <div className="pizza-form-row">
            <label>
              Telegram*
              <input
                value={form.telegram}
                onChange={(event) => updateForm("telegram", event.target.value)}
                placeholder="@username"
                required
              />
            </label>
            <label>
              Телефон*
              <input
                value={form.phone}
                onChange={(event) => updateForm("phone", event.target.value)}
                placeholder="+7 999 000-00-00"
                required
              />
            </label>
          </div>

          <label>
            Комментарий
            <textarea
              value={form.comment}
              onChange={(event) => updateForm("comment", event.target.value)}
              placeholder="Домофон, этаж, пожелания к заказу"
            />
          </label>

          <fieldset className="pizza-payment">
            <legend>Способ оплаты</legend>
            {["На месте при получении", "Онлайн"].map((method) => (
              <button
                key={method}
                type="button"
                className={form.payment === method ? "is-active" : ""}
                onClick={() => updateForm("payment", method)}
              >
                {method}
              </button>
            ))}
          </fieldset>

          <div className="pizza-checkout-total">
            <span>Итого</span>
            <strong>{currency(cartTotal)}</strong>
          </div>
          {formError && <p className="pizza-form-error">{formError}</p>}
          <button type="submit" className="pizza-submit">
            Отправить заказ <Truck size={20} />
          </button>
        </form>
      </section>

      <footer className="pizza-footer">
        <strong>Ovenly Pizza</strong>
        <span>горячее меню, честная корзина и доставка без лишних шагов</span>
        <button type="button" onClick={() => scrollToPizzaSection("pizza-home")}>Наверх</button>
      </footer>

      <aside className={`pizza-cart-drawer ${cartOpen ? "is-open" : ""}`} aria-hidden={!cartOpen}>
        <div className="pizza-cart-head">
          <div>
            <span>Корзина</span>
            <strong>{cartCount} позиции</strong>
          </div>
          <button type="button" onClick={() => setCartOpen(false)} aria-label="Закрыть корзину">
            <X size={22} />
          </button>
        </div>
        <div className="pizza-cart-list">
          {cartItems.length ? (
            cartItems.map((item) => (
              <article className="pizza-cart-item" key={item.id}>
                <PizzaArt accent={item.imageAccent} addons={item.addons} />
                <div>
                  <strong>{item.name}</strong>
                  <span>
                    {item.size.label}
                    {item.addons.length ? ` · ${item.addons.map((addon) => addon.name).join(", ")}` : ""}
                  </span>
                  <em>{currency(item.price)}</em>
                </div>
                <div className="pizza-cart-qty">
                  <button type="button" onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button>
                </div>
              </article>
            ))
          ) : (
            <p className="pizza-cart-empty">Добавьте пиццу из меню, и она появится здесь.</p>
          )}
        </div>
        <div className="pizza-cart-bottom">
          <span>Итого <strong>{currency(cartTotal)}</strong></span>
          <button type="button" onClick={handleOrderClick}>Заказать</button>
        </div>
      </aside>
      <button
        type="button"
        className={`pizza-cart-backdrop ${cartOpen ? "is-open" : ""}`}
        onClick={() => setCartOpen(false)}
        aria-label="Закрыть корзину"
      />

      {selectedPizza && (
        <div className="pizza-modal-backdrop" onClick={() => setSelectedPizza(null)}>
          <section className="pizza-modal" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="pizza-modal-close" onClick={() => setSelectedPizza(null)}>
              <X size={22} />
            </button>
            <div className="pizza-modal-art">
              <PizzaArt accent={selectedPizza.accent} addons={selectedAddons} />
            </div>
            <div className="pizza-modal-content">
              <span className="pizza-eyebrow">{selectedPizza.category}</span>
              <h2>{selectedPizza.name}</h2>
              <p>{selectedPizza.text}</p>
              <p className="pizza-composition">Состав: {selectedPizza.ingredients.join(", ")}.</p>
              <div className="pizza-size-row">
                {SIZES.map((size) => (
                  <button
                    key={size.value}
                    type="button"
                    className={selectedSize.value === size.value ? "is-active" : ""}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size.label}
                    <small>+{currency(size.extra)}</small>
                  </button>
                ))}
              </div>
              <h3>Добавки</h3>
              <div className="pizza-addon-row">
                {ADDONS.map((addon) => (
                  <button
                    key={addon.name}
                    type="button"
                    className={selectedAddons.some((item) => item.name === addon.name) ? "is-active" : ""}
                    onClick={() => toggleAddon(addon)}
                  >
                    {addon.name}
                    <small>{currency(addon.price)}</small>
                  </button>
                ))}
              </div>
              <button type="button" className="pizza-modal-add" onClick={addSelectedPizza}>
                Добавить за {currency(selectedPrice)}
              </button>
            </div>
          </section>
        </div>
      )}

      {deliveryModal && (
        <div className="pizza-delivery-backdrop">
          <section className="pizza-delivery-modal">
            <button type="button" onClick={() => setDeliveryModal(null)} aria-label="Закрыть">
              <X size={22} />
            </button>
            <div className="pizza-delivery-scene">
              <span className="pizza-road" />
              <span className="pizza-car">
                <Truck size={42} />
              </span>
            </div>
            <CheckCircle2 size={42} />
            <h2>Курьер уже в пути</h2>
            <p>
              Заказ передан кухне. Маршрут от точки <strong>{deliveryModal.point.city}, {deliveryModal.point.address}</strong>{" "}
              до адреса <strong>{deliveryModal.address}</strong> построен: примерно {deliveryModal.distance} км.
            </p>
            <div className="pizza-progress">
              <span />
            </div>
            <small>Ориентир: {deliveryModal.eta} минут до передачи заказа курьеру.</small>
          </section>
        </div>
      )}
    </main>
  );
}

export default PizzaMenuLanding;
