import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  Compass,
  CreditCard,
  Heart,
  Leaf,
  LockKeyhole,
  MapPin,
  Minus,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Store,
  Trash2,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { useThemeLang } from "../../../../../context/ThemeLangContext";
import carrotIcon from "./img/carrot.svg";
import "./nectar-grocery.scss";

const baseCopy = {
  app: "Nectar",
  subtitle: "online groceries",
  splashHint: "Fresh products delivered quickly",
  location: "Dhaka, Banassre",
  search: "Search products",
  bannerTitle: "Fresh vegetables",
  bannerText: "Up to 40% off",
  exclusive: "Best offers",
  best: "Popular",
  groceries: "Categories",
  seeAll: "See all",
  nav: { shop: "Shop", explore: "Search", cart: "Cart", fav: "Favorites", account: "Account" },
  add: "Add",
  added: "Added",
  details: "Product details",
  nutrition: "Nutrition",
  review: "Review",
  basket: "Add to cart",
  checkout: "Checkout",
  emptyCart: "Cart is empty",
  emptyFav: "Favorites are empty",
  total: "Total",
  delivery: "Delivery",
  payment: "Payment",
  orderAccepted: "Order accepted",
  orderText: "Your products are being packed. The courier will bring them at the selected time.",
  track: "Track order",
  backHome: "Back home",
  filters: "Filters",
  accountTitle: "My account",
  accountHint: "Manage address, payment and notifications.",
  profile: "Profile",
  orders: "My orders",
  notifications: "Notifications",
  help: "Help",
  categoryAll: "All",
  categoryFruits: "Fruits",
  categoryVegetables: "Vegetables",
  categoryPulses: "Pulses",
  categoryNuts: "Nuts",
  categoryMeat: "Meat",
  categoryGrains: "Grains",
  copyKicker: "Mobile app",
  copyTitle: "Nectar Grocery",
  copyDesc:
    "Mobile grocery app mockup: splash, auth flow, location, shop, search, cart, favorites, account and checkout.",
  features: ["Auth screens", "Empty cart by default", "Working favorites", "Real categories"],
  onboardingWelcome: "Get your groceries with Nectar",
  onboardingText: "Choose fresh food, save favorites and place an order in a few taps.",
  phoneTitle: "Enter your mobile number",
  phoneLabel: "Mobile number",
  verificationTitle: "Enter your 4-digit code",
  codeLabel: "Code",
  resendCode: "Resend code",
  locationTitle: "Select your location",
  locationText: "Switch on your location to stay in tune with what is happening in your area.",
  zone: "Your zone",
  area: "Your area",
  submit: "Submit",
  loginTitle: "Log in",
  signupTitle: "Sign up",
  email: "Email",
  password: "Password",
  username: "Username",
  forgot: "Forgot password?",
  agree: "I agree with terms",
  login: "Log in",
  signup: "Sign up",
  createAccount: "Create an account",
  haveAccount: "Already have an account?",
  social: "Or connect with social media",
  continueGoogle: "Continue with Google",
  continueFacebook: "Continue with Facebook",
  accountDetails: {
    profile: "Address: Dhaka, Banassre. Payment card: saved.",
    orders: "Latest order: vegetables, fruits and rice. Delivery today at 18:40.",
    notifications: "Push notifications for deals, order status and delivery are enabled.",
    help: "Support chat is ready: delivery, refunds, payment and product quality.",
  },
  products: {
    banana: ["Organic Bananas", "7 pcs, price"],
    apple: ["Red Apple", "1 kg, price"],
    pepper: ["Red Pepper", "1 kg, price"],
    ginger: ["Ginger", "250 g, price"],
    beef: ["Beef", "1 kg, price"],
    chicken: ["Chicken", "1 kg, price"],
    pulses: ["Bean Mix", "1 kg, price"],
    rice: ["Basmati Rice", "1 kg, price"],
    nuts: ["Nut Mix", "300 g, price"],
  },
};

const copyByLang = {
  ru: {
    location: "Дакка, Банассре",
    search: "Найти продукты",
    bannerTitle: "Свежие овощи",
    bannerText: "Скидка до 40%",
    exclusive: "Лучшие предложения",
    best: "Популярное",
    groceries: "Категории",
    seeAll: "Смотреть все",
    nav: { shop: "Магазин", explore: "Поиск", cart: "Корзина", fav: "Избранное", account: "Аккаунт" },
    add: "Добавить",
    added: "Добавлено",
    details: "Детали продукта",
    nutrition: "Пищевая ценность",
    review: "Отзывы",
    basket: "В корзину",
    checkout: "Оформить",
    emptyCart: "Корзина пока пустая",
    emptyFav: "В избранном пока пусто",
    total: "Итого",
    delivery: "Доставка",
    payment: "Оплата",
    orderAccepted: "Заказ принят",
    orderText: "Продукты уже собираются. Курьер привезет заказ в выбранное время.",
    track: "Отследить заказ",
    backHome: "На главную",
    filters: "Фильтры",
    accountTitle: "Мой аккаунт",
    accountHint: "Управляйте адресом, оплатой и уведомлениями.",
    profile: "Профиль",
    orders: "Мои заказы",
    notifications: "Уведомления",
    help: "Помощь",
    categoryAll: "Все",
    categoryFruits: "Фрукты",
    categoryVegetables: "Овощи",
    categoryPulses: "Бобовые",
    categoryNuts: "Орехи",
    categoryMeat: "Мясо",
    categoryGrains: "Крупы",
    copyKicker: "Мобильное приложение",
    copyDesc:
      "Мобильный магазин продуктов по макету Nectar: splash, вход, выбор локации, витрина, поиск, корзина, избранное, профиль и оформление заказа.",
    features: ["Экраны входа", "Пустая корзина", "Рабочее избранное", "Реальные категории"],
    onboardingWelcome: "Покупайте продукты с Nectar",
    onboardingText: "Выбирайте свежие товары, сохраняйте избранное и оформляйте заказ в пару касаний.",
    phoneTitle: "Введите номер телефона",
    phoneLabel: "Номер телефона",
    verificationTitle: "Введите 4-значный код",
    codeLabel: "Код",
    resendCode: "Отправить код снова",
    locationTitle: "Выберите локацию",
    locationText: "Укажите район, чтобы показать доставку, акции и доступные продукты рядом с вами.",
    zone: "Ваш район",
    area: "Ваша зона",
    submit: "Подтвердить",
    loginTitle: "Вход",
    signupTitle: "Регистрация",
    email: "Email",
    password: "Пароль",
    username: "Имя пользователя",
    forgot: "Забыли пароль?",
    agree: "Согласен с условиями",
    login: "Войти",
    signup: "Зарегистрироваться",
    createAccount: "Создать аккаунт",
    haveAccount: "Уже есть аккаунт?",
    social: "Войти через соцсети",
    continueGoogle: "Продолжить с Google",
    continueFacebook: "Продолжить с Facebook",
    accountDetails: {
      profile: "Адрес: Дакка, Банассре. Карта оплаты сохранена.",
      orders: "Последний заказ: овощи, фрукты и рис. Доставка сегодня в 18:40.",
      notifications: "Push-уведомления об акциях, заказе и доставке включены.",
      help: "Чат поддержки готов помочь с доставкой, возвратом, оплатой и качеством продуктов.",
    },
    products: {
      banana: ["Органические бананы", "7 шт, цена"],
      apple: ["Красное яблоко", "1 кг, цена"],
      pepper: ["Красный перец", "1 кг, цена"],
      ginger: ["Имбирь", "250 г, цена"],
      beef: ["Говядина", "1 кг, цена"],
      chicken: ["Курица", "1 кг, цена"],
      pulses: ["Бобовый набор", "1 кг, цена"],
      rice: ["Рис басмати", "1 кг, цена"],
    },
  },
  de: {
    search: "Produkte suchen",
    nav: { shop: "Shop", explore: "Suche", cart: "Korb", fav: "Favoriten", account: "Konto" },
    categoryFruits: "Obst",
    categoryVegetables: "Gemuse",
    categoryPulses: "Hulsenfruchte",
    categoryNuts: "Nusse",
    categoryMeat: "Fleisch",
    categoryGrains: "Getreide",
    emptyCart: "Der Korb ist leer",
    emptyFav: "Keine Favoriten",
    copyKicker: "Mobile App",
    features: ["Login Screens", "Leerer Korb", "Favoriten", "Kategorien"],
  },
  fr: {
    search: "Chercher des produits",
    nav: { shop: "Shop", explore: "Recherche", cart: "Panier", fav: "Favoris", account: "Compte" },
    categoryFruits: "Fruits",
    categoryVegetables: "Legumes",
    categoryPulses: "Legumineuses",
    categoryNuts: "Noix",
    categoryMeat: "Viande",
    categoryGrains: "Cereales",
    emptyCart: "Panier vide",
    emptyFav: "Aucun favori",
    copyKicker: "Application mobile",
  },
  it: {
    search: "Cerca prodotti",
    nav: { shop: "Shop", explore: "Cerca", cart: "Carrello", fav: "Preferiti", account: "Account" },
    categoryFruits: "Frutta",
    categoryVegetables: "Verdure",
    categoryPulses: "Legumi",
    categoryNuts: "Noci",
    categoryMeat: "Carne",
    categoryGrains: "Cereali",
    emptyCart: "Carrello vuoto",
    emptyFav: "Nessun preferito",
    copyKicker: "App mobile",
  },
  pl: {
    search: "Szukaj produktow",
    nav: { shop: "Sklep", explore: "Szukaj", cart: "Koszyk", fav: "Ulubione", account: "Konto" },
    categoryFruits: "Owoce",
    categoryVegetables: "Warzywa",
    categoryPulses: "Straczki",
    categoryNuts: "Orzechy",
    categoryMeat: "Mieso",
    categoryGrains: "Zboza",
    emptyCart: "Koszyk jest pusty",
    emptyFav: "Brak ulubionych",
    copyKicker: "Aplikacja mobilna",
  },
  cz: {
    search: "Hledat produkty",
    nav: { shop: "Obchod", explore: "Hledat", cart: "Kosik", fav: "Oblibene", account: "Ucet" },
    categoryFruits: "Ovoce",
    categoryVegetables: "Zelenina",
    categoryPulses: "Lusteniny",
    categoryNuts: "Orechy",
    categoryMeat: "Maso",
    categoryGrains: "Obiloviny",
    emptyCart: "Kosik je prazdny",
    emptyFav: "Zadne oblibene",
    copyKicker: "Mobilni aplikace",
  },
  sk: {
    search: "Hladat produkty",
    nav: { shop: "Obchod", explore: "Hladat", cart: "Kosik", fav: "Oblubene", account: "Ucet" },
    categoryFruits: "Ovocie",
    categoryVegetables: "Zelenina",
    categoryPulses: "Strukoviny",
    categoryNuts: "Orechy",
    categoryMeat: "Maso",
    categoryGrains: "Obilniny",
    emptyCart: "Kosik je prazdny",
    emptyFav: "Ziadne oblubene",
    copyKicker: "Mobilna aplikacia",
  },
};

const productCollections = {
  fruits: [
    {
      key: "banana",
      names: { en: "Organic Bananas", ru: "Органические бананы" },
      units: { en: "7 pcs, price", ru: "7 шт, цена" },
      price: 4.99,
      tone: "#fff2a5",
      visual: "banana",
      color: "#ffd84f",
      dark: "#f59f00",
    },
    {
      key: "apple",
      names: { en: "Red Apple", ru: "Красное яблоко" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 4.99,
      tone: "#ffd7d7",
      visual: "apple",
      color: "#e94857",
      dark: "#b92f39",
    },
    {
      key: "orange",
      names: { en: "Sweet Oranges", ru: "Сладкие апельсины" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.85,
      tone: "#ffe4b7",
      visual: "orange",
      color: "#ff9f1c",
      dark: "#df6d00",
    },
    {
      key: "pear",
      names: { en: "Green Pears", ru: "Зеленые груши" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 4.35,
      tone: "#ddf6b8",
      visual: "pear",
      color: "#9bd35f",
      dark: "#5a9f3b",
    },
    {
      key: "grapes",
      names: { en: "Blue Grapes", ru: "Синий виноград" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 5.75,
      tone: "#eadcff",
      visual: "grapes",
      color: "#7c5ce0",
      dark: "#4932a5",
    },
    {
      key: "mango",
      names: { en: "Ripe Mango", ru: "Спелое манго" },
      units: { en: "2 pcs, price", ru: "2 шт, цена" },
      price: 6.2,
      tone: "#ffe8a6",
      visual: "mango",
      color: "#ffbf3f",
      dark: "#f27618",
    },
    {
      key: "strawberry",
      names: { en: "Strawberry", ru: "Клубника" },
      units: { en: "400 g, price", ru: "400 г, цена" },
      price: 5.1,
      tone: "#ffd9e6",
      visual: "strawberry",
      color: "#f94158",
      dark: "#c91836",
    },
    {
      key: "kiwi",
      names: { en: "Kiwi", ru: "Киви" },
      units: { en: "6 pcs, price", ru: "6 шт, цена" },
      price: 4.6,
      tone: "#dff5be",
      visual: "kiwi",
      color: "#8bc34a",
      dark: "#6b4f1d",
    },
    {
      key: "lemon",
      names: { en: "Lemons", ru: "Лимоны" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 2.95,
      tone: "#fff7a6",
      visual: "lemon",
      color: "#ffe25a",
      dark: "#d6aa00",
    },
    {
      key: "pineapple",
      names: { en: "Pineapple", ru: "Ананас" },
      units: { en: "1 pc, price", ru: "1 шт, цена" },
      price: 7.4,
      tone: "#ffe9af",
      visual: "pineapple",
      color: "#f2b949",
      dark: "#3f9f55",
    },
  ],
  vegetables: [
    {
      key: "tomato",
      names: { en: "Tomatoes", ru: "Помидоры" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.65,
      tone: "#ffd9d2",
      visual: "tomato",
      color: "#f45b45",
      dark: "#c62828",
    },
    {
      key: "cucumber",
      names: { en: "Cucumbers", ru: "Огурцы" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.8,
      tone: "#dff4df",
      visual: "cucumber",
      color: "#62b45e",
      dark: "#2f7d32",
    },
    {
      key: "carrot",
      names: { en: "Carrots", ru: "Морковь" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.4,
      tone: "#ffe3bf",
      visual: "carrot",
      color: "#ff8a00",
      dark: "#43a047",
    },
    {
      key: "potato",
      names: { en: "Potatoes", ru: "Картофель" },
      units: { en: "2 kg, price", ru: "2 кг, цена" },
      price: 3.3,
      tone: "#f5e4c8",
      visual: "potato",
      color: "#c7904a",
      dark: "#8d5a2b",
    },
    {
      key: "onion",
      names: { en: "Onions", ru: "Лук" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.2,
      tone: "#fff0c7",
      visual: "onion",
      color: "#e2b65c",
      dark: "#9b6d28",
    },
    {
      key: "red-pepper",
      names: { en: "Red Pepper", ru: "Красный перец" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 5.49,
      tone: "#ffe2e2",
      visual: "pepper",
      color: "#e94857",
      dark: "#2f9e44",
    },
    {
      key: "broccoli",
      names: { en: "Broccoli", ru: "Брокколи" },
      units: { en: "1 pc, price", ru: "1 шт, цена" },
      price: 3.9,
      tone: "#dcf6d9",
      visual: "broccoli",
      color: "#53b175",
      dark: "#2d7d46",
    },
    {
      key: "cabbage",
      names: { en: "Cabbage", ru: "Капуста" },
      units: { en: "1 pc, price", ru: "1 шт, цена" },
      price: 2.75,
      tone: "#e8f7df",
      visual: "cabbage",
      color: "#a5d66d",
      dark: "#5f9d3b",
    },
    {
      key: "lettuce",
      names: { en: "Lettuce", ru: "Салат" },
      units: { en: "1 bunch, price", ru: "1 пучок, цена" },
      price: 2.15,
      tone: "#e2f7d7",
      visual: "lettuce",
      color: "#7ccc65",
      dark: "#3c8d3e",
    },
    {
      key: "ginger",
      names: { en: "Ginger", ru: "Имбирь" },
      units: { en: "250 g, price", ru: "250 г, цена" },
      price: 3.25,
      tone: "#f8e6c9",
      visual: "ginger",
      color: "#d8a85d",
      dark: "#9c6b32",
    },
  ],
  pulses: [
    {
      key: "lentils",
      names: { en: "Red Lentils", ru: "Красная чечевица" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.99,
      tone: "#ffe3c5",
      visual: "beans",
      color: "#e9783b",
      dark: "#b84c2b",
    },
    {
      key: "chickpeas",
      names: { en: "Chickpeas", ru: "Нут" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.35,
      tone: "#f8ecd1",
      visual: "beans",
      color: "#d6b263",
      dark: "#96723a",
    },
    {
      key: "peas",
      names: { en: "Green Peas", ru: "Зеленый горох" },
      units: { en: "700 g, price", ru: "700 г, цена" },
      price: 2.7,
      tone: "#dff5d8",
      visual: "peas",
      color: "#68b756",
      dark: "#3d8739",
    },
    {
      key: "kidney",
      names: { en: "Kidney Beans", ru: "Красная фасоль" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.8,
      tone: "#f3d2d2",
      visual: "beans",
      color: "#9e2d31",
      dark: "#6b181c",
    },
    {
      key: "black",
      names: { en: "Black Beans", ru: "Черная фасоль" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.9,
      tone: "#e4e5ea",
      visual: "beans",
      color: "#20252d",
      dark: "#11151b",
    },
    {
      key: "mung",
      names: { en: "Mung Beans", ru: "Маш" },
      units: { en: "800 g, price", ru: "800 г, цена" },
      price: 3.25,
      tone: "#e0f1d4",
      visual: "beans",
      color: "#6c9f44",
      dark: "#3e6a29",
    },
    {
      key: "soy",
      names: { en: "Soybeans", ru: "Соя" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.85,
      tone: "#f1e8bd",
      visual: "beans",
      color: "#cfb95d",
      dark: "#8d7a2f",
    },
    {
      key: "split-peas",
      names: { en: "Split Peas", ru: "Колотый горох" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.65,
      tone: "#e8f2c7",
      visual: "peas",
      color: "#96bc3f",
      dark: "#6e8b2a",
    },
    {
      key: "white-beans",
      names: { en: "White Beans", ru: "Белая фасоль" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.1,
      tone: "#f5f0df",
      visual: "beans",
      color: "#eee6d2",
      dark: "#b5a986",
    },
    {
      key: "mix",
      names: { en: "Bean Mix", ru: "Бобовый микс" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.55,
      tone: "#f7e8c2",
      visual: "mix",
      color: "#e9783b",
      dark: "#22252d",
      accent: "#d6b263",
    },
  ],
  nuts: [
    {
      key: "almond",
      names: { en: "Almonds", ru: "Миндаль" },
      units: { en: "300 g, price", ru: "300 г, цена" },
      price: 7.15,
      tone: "#f0e2c7",
      visual: "nut",
      color: "#c58b55",
      dark: "#895531",
    },
    {
      key: "walnut",
      names: { en: "Walnuts", ru: "Грецкий орех" },
      units: { en: "300 g, price", ru: "300 г, цена" },
      price: 6.8,
      tone: "#ead4b9",
      visual: "walnut",
      color: "#a96f3c",
      dark: "#71421f",
    },
    {
      key: "cashew",
      names: { en: "Cashew", ru: "Кешью" },
      units: { en: "250 g, price", ru: "250 г, цена" },
      price: 7.6,
      tone: "#fff0cf",
      visual: "cashew",
      color: "#f0ca82",
      dark: "#a67830",
    },
    {
      key: "pistachio",
      names: { en: "Pistachio", ru: "Фисташки" },
      units: { en: "250 g, price", ru: "250 г, цена" },
      price: 8.25,
      tone: "#e7f1d1",
      visual: "nut",
      color: "#8fbd5a",
      dark: "#5d7f39",
    },
    {
      key: "hazelnut",
      names: { en: "Hazelnut", ru: "Фундук" },
      units: { en: "300 g, price", ru: "300 г, цена" },
      price: 6.95,
      tone: "#efd7bd",
      visual: "nut",
      color: "#a96f3c",
      dark: "#7a421e",
    },
    {
      key: "peanut",
      names: { en: "Peanuts", ru: "Арахис" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 3.9,
      tone: "#f8e5b9",
      visual: "peanut",
      color: "#d6a34f",
      dark: "#9c6c28",
    },
    {
      key: "pecan",
      names: { en: "Pecan", ru: "Пекан" },
      units: { en: "250 g, price", ru: "250 г, цена" },
      price: 8.4,
      tone: "#eed1b7",
      visual: "walnut",
      color: "#93552f",
      dark: "#5f331a",
    },
    {
      key: "macadamia",
      names: { en: "Macadamia", ru: "Макадамия" },
      units: { en: "200 g, price", ru: "200 г, цена" },
      price: 9.2,
      tone: "#f8eed8",
      visual: "nut",
      color: "#ead8b4",
      dark: "#b99b62",
    },
    {
      key: "pine-nuts",
      names: { en: "Pine Nuts", ru: "Кедровый орех" },
      units: { en: "150 g, price", ru: "150 г, цена" },
      price: 7.9,
      tone: "#fff0cc",
      visual: "seeds",
      color: "#d9b45e",
      dark: "#907135",
    },
    {
      key: "mix",
      names: { en: "Nut Mix", ru: "Ореховый микс" },
      units: { en: "300 g, price", ru: "300 г, цена" },
      price: 7.35,
      tone: "#f3dfc6",
      visual: "mix",
      color: "#c58b55",
      dark: "#8fbd5a",
      accent: "#ead8b4",
    },
  ],
  meat: [
    {
      key: "beef",
      names: { en: "Beef Steak", ru: "Говяжий стейк" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 6.99,
      tone: "#f5d7d7",
      visual: "steak",
      color: "#c43d3d",
      dark: "#7e1f24",
      accent: "#fff0e6",
    },
    {
      key: "chicken",
      names: { en: "Chicken Fillet", ru: "Куриное филе" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 8.25,
      tone: "#ffe7c8",
      visual: "drumstick",
      color: "#f4b66b",
      dark: "#cf7b32",
      accent: "#f8f1e4",
    },
    {
      key: "turkey",
      names: { en: "Turkey", ru: "Индейка" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 8.6,
      tone: "#f8e1cc",
      visual: "drumstick",
      color: "#de9a65",
      dark: "#a95e2d",
      accent: "#fff2dd",
    },
    {
      key: "pork",
      names: { en: "Pork", ru: "Свинина" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 6.45,
      tone: "#ffdce4",
      visual: "steak",
      color: "#ef8f9f",
      dark: "#b94458",
      accent: "#ffeef2",
    },
    {
      key: "lamb",
      names: { en: "Lamb", ru: "Баранина" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 9.1,
      tone: "#f1d0c8",
      visual: "steak",
      color: "#9d423e",
      dark: "#682322",
      accent: "#f8d7ca",
    },
    {
      key: "salmon",
      names: { en: "Salmon", ru: "Лосось" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 10.4,
      tone: "#ffd9c6",
      visual: "fish",
      color: "#ff7f62",
      dark: "#246a73",
    },
    {
      key: "tuna",
      names: { en: "Tuna", ru: "Тунец" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 9.8,
      tone: "#dbe9f6",
      visual: "fish",
      color: "#6d8fb3",
      dark: "#31506e",
    },
    {
      key: "sausages",
      names: { en: "Sausages", ru: "Колбаски" },
      units: { en: "600 g, price", ru: "600 г, цена" },
      price: 5.9,
      tone: "#ffd7c7",
      visual: "sausage",
      color: "#d8543f",
      dark: "#8f2e22",
    },
    {
      key: "bacon",
      names: { en: "Bacon", ru: "Бекон" },
      units: { en: "300 g, price", ru: "300 г, цена" },
      price: 5.4,
      tone: "#ffdce2",
      visual: "bacon",
      color: "#e85d75",
      dark: "#ffd0c7",
    },
    {
      key: "eggs",
      names: { en: "Farm Eggs", ru: "Фермерские яйца" },
      units: { en: "10 pcs, price", ru: "10 шт, цена" },
      price: 3.75,
      tone: "#fff2d4",
      visual: "eggs",
      color: "#fff7e8",
      dark: "#f0b64c",
    },
  ],
  grains: [
    {
      key: "rice",
      names: { en: "Basmati Rice", ru: "Рис басмати" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 3.49,
      tone: "#eef2ff",
      visual: "grain",
      color: "#f3f0df",
      dark: "#b9b08d",
    },
    {
      key: "buckwheat",
      names: { en: "Buckwheat", ru: "Гречка" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.95,
      tone: "#ead7c3",
      visual: "grain",
      color: "#8c5c35",
      dark: "#5f3a1f",
    },
    {
      key: "oats",
      names: { en: "Oats", ru: "Овсянка" },
      units: { en: "700 g, price", ru: "700 г, цена" },
      price: 2.4,
      tone: "#f3ead2",
      visual: "grain",
      color: "#d7bd82",
      dark: "#9a7842",
    },
    {
      key: "quinoa",
      names: { en: "Quinoa", ru: "Киноа" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 5.7,
      tone: "#f5ead1",
      visual: "grain",
      color: "#e0c77b",
      dark: "#7c5b2d",
    },
    {
      key: "bulgur",
      names: { en: "Bulgur", ru: "Булгур" },
      units: { en: "800 g, price", ru: "800 г, цена" },
      price: 3.15,
      tone: "#f5e0bd",
      visual: "grain",
      color: "#c99d52",
      dark: "#8b632d",
    },
    {
      key: "couscous",
      names: { en: "Couscous", ru: "Кускус" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 3.25,
      tone: "#fff0cf",
      visual: "grain",
      color: "#ead083",
      dark: "#ad8841",
    },
    {
      key: "corn",
      names: { en: "Corn Grits", ru: "Кукурузная крупа" },
      units: { en: "700 g, price", ru: "700 г, цена" },
      price: 2.6,
      tone: "#fff0a7",
      visual: "corn",
      color: "#ffcf3a",
      dark: "#3f9f55",
    },
    {
      key: "barley",
      names: { en: "Barley", ru: "Перловка" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.55,
      tone: "#f4e8cd",
      visual: "grain",
      color: "#d2b46b",
      dark: "#95743b",
    },
    {
      key: "pasta",
      names: { en: "Pasta", ru: "Паста" },
      units: { en: "500 g, price", ru: "500 г, цена" },
      price: 2.9,
      tone: "#fff0bd",
      visual: "pasta",
      color: "#f0c65f",
      dark: "#b78931",
    },
    {
      key: "flour",
      names: { en: "Wheat Flour", ru: "Пшеничная мука" },
      units: { en: "1 kg, price", ru: "1 кг, цена" },
      price: 2.2,
      tone: "#f4f1e8",
      visual: "sack",
      color: "#efe6d2",
      dark: "#c9b58a",
    },
  ],
};

const products = Object.entries(productCollections).flatMap(([category, items]) =>
  items.map((product) => ({ ...product, id: `${category}-${product.key}`, category })),
);

const categoryCards = [
  { id: "fruits", className: "nectar-category-card--fruits" },
  { id: "vegetables", className: "nectar-category-card--vegetables" },
  { id: "pulses", className: "nectar-category-card--pulses" },
  { id: "nuts", className: "nectar-category-card--nuts" },
  { id: "meat", className: "nectar-category-card--meat" },
  { id: "grains", className: "nectar-category-card--grains" },
];

const ProductIllustration = ({ product, compact = false }) => {
  const color = product?.color || "#53b175";
  const dark = product?.dark || "#2f7d46";
  const accent = product?.accent || "#ffffff";
  const leaf = product?.leaf || "#53b175";
  const visual = product?.visual || "mix";
  const className = `nectar-product-svg ${compact ? "nectar-product-svg--compact" : ""}`;

  const beanDots = [
    [31, 42, -18, color],
    [47, 31, 14, dark],
    [59, 47, -10, accent],
    [72, 34, 18, color],
    [84, 50, -17, dark],
    [43, 57, 13, accent],
    [64, 62, -8, color],
  ];

  const grainDots = [
    [31, 52, 0],
    [41, 42, -24],
    [51, 55, 18],
    [61, 43, -10],
    [72, 56, 22],
    [83, 45, -18],
    [91, 58, 8],
  ];

  const baseProps = {
    className,
    viewBox: "0 0 120 90",
    role: "img",
    "aria-hidden": "true",
    focusable: "false",
  };

  if (visual === "banana") {
    return (
      <svg {...baseProps}>
        <path d="M28 55C53 77 88 67 99 36C84 53 55 59 34 42C29 38 24 51 28 55Z" fill={color} />
        <path d="M34 42C55 59 84 53 99 36" fill="none" stroke={dark} strokeWidth="8" strokeLinecap="round" />
        <path d="M25 51C22 54 23 60 29 63" fill="none" stroke="#81541c" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (visual === "apple" || visual === "orange" || visual === "lemon" || visual === "kiwi") {
    return (
      <svg {...baseProps}>
        <ellipse cx="57" cy="52" rx="24" ry="22" fill={color} />
        <ellipse cx="74" cy="52" rx="23" ry="22" fill={dark} opacity="0.86" />
        {visual === "kiwi" && <circle cx="62" cy="52" r="19" fill="#d6e987" opacity="0.9" />}
        {visual === "kiwi" && <circle cx="62" cy="52" r="10" fill="#f5f4dc" />}
        {visual === "kiwi" &&
          [0, 1, 2, 3, 4, 5].map((item) => (
            <circle
              cx={62 + Math.cos(item) * 13}
              cy={52 + Math.sin(item) * 13}
              fill="#1d252f"
              key={item}
              r="1.5"
            />
          ))}
        <path d="M63 29C58 20 50 18 43 23C48 32 56 34 63 29Z" fill={leaf} />
        <path d="M64 31C64 24 67 19 71 17" fill="none" stroke="#6d421e" strokeWidth="3" strokeLinecap="round" />
        <circle cx="54" cy="43" r="5" fill="#ffffff" opacity="0.75" />
      </svg>
    );
  }

  if (visual === "pear" || visual === "mango") {
    return (
      <svg {...baseProps}>
        <path
          d="M60 22C74 23 81 40 78 56C76 70 66 77 54 73C40 69 35 57 40 44C43 36 50 32 51 25C52 22 55 21 60 22Z"
          fill={color}
        />
        <path d="M66 26C79 33 80 58 65 69" fill="none" stroke={dark} strokeWidth="10" strokeLinecap="round" opacity="0.45" />
        <path d="M58 23C57 16 60 13 65 10" fill="none" stroke="#6d421e" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 17C72 13 78 15 82 20C76 25 69 25 65 17Z" fill={leaf} />
      </svg>
    );
  }

  if (visual === "grapes") {
    return (
      <svg {...baseProps}>
        {[0, 1, 2, 3, 4, 5, 6].map((item) => (
          <circle
            cx={[49, 61, 73, 55, 67, 49, 61][item]}
            cy={[34, 34, 40, 48, 50, 61, 63][item]}
            fill={item % 2 ? dark : color}
            key={item}
            r="11"
          />
        ))}
        <path d="M58 26C57 18 61 14 67 11" fill="none" stroke="#6d421e" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 18C76 14 83 18 86 26C76 30 68 27 65 18Z" fill={leaf} />
      </svg>
    );
  }

  if (visual === "strawberry") {
    return (
      <svg {...baseProps}>
        <path d="M60 72C38 56 34 35 50 28C57 25 63 28 66 34C70 28 77 26 84 30C99 40 85 62 60 72Z" fill={color} />
        {[47, 58, 70, 82, 55, 68, 78].map((x, index) => (
          <ellipse cx={x} cy={index < 4 ? 43 : 55} fill="#ffe6a2" key={x} rx="2" ry="3" />
        ))}
        <path d="M52 31L47 21L58 27L63 18L67 28L79 22L73 33Z" fill={leaf} />
      </svg>
    );
  }

  if (visual === "pineapple") {
    return (
      <svg {...baseProps}>
        <path d="M54 25C45 31 40 45 44 60C47 74 61 78 73 69C82 61 82 43 75 31C70 23 61 20 54 25Z" fill={color} />
        <path d="M48 42L75 65M47 56L70 29M43 50L80 50" stroke={dark} strokeWidth="3" opacity="0.45" />
        <path d="M58 25L48 8L64 19L70 6L72 22L88 15L78 29Z" fill={dark} />
      </svg>
    );
  }

  if (visual === "tomato") {
    return (
      <svg {...baseProps}>
        <circle cx="55" cy="53" r="24" fill={color} />
        <circle cx="73" cy="53" r="22" fill={dark} opacity="0.75" />
        <path d="M51 32L56 20L62 31L72 23L69 36L81 38L68 43L59 38L49 43L51 35L39 32Z" fill={leaf} />
        <circle cx="52" cy="43" r="5" fill="#ffffff" opacity="0.55" />
      </svg>
    );
  }

  if (visual === "cucumber") {
    return (
      <svg {...baseProps}>
        <path d="M30 57C40 34 71 24 95 32C88 58 58 75 30 57Z" fill={color} />
        <path d="M42 55C58 40 72 34 91 35" fill="none" stroke={dark} strokeWidth="6" strokeLinecap="round" opacity="0.42" />
        {[45, 58, 72, 84].map((x) => (
          <circle cx={x} cy={48 - (x % 3) * 3} fill="#d9f6ce" key={x} r="2" />
        ))}
      </svg>
    );
  }

  if (visual === "carrot") {
    return (
      <svg {...baseProps}>
        <path d="M44 32C58 36 67 43 73 57C60 68 46 72 33 69C33 55 36 42 44 32Z" fill={color} />
        <path d="M48 34C56 47 56 58 49 68" stroke={dark} strokeWidth="3" opacity="0.35" />
        <path d="M48 30C45 19 51 13 61 19C61 12 69 10 74 17C79 12 88 17 84 27C74 29 64 31 48 30Z" fill={dark} />
      </svg>
    );
  }

  if (visual === "potato" || visual === "ginger" || visual === "onion") {
    return (
      <svg {...baseProps}>
        <path d="M34 56C34 38 50 29 66 31C84 34 94 50 82 65C70 81 35 77 34 56Z" fill={color} />
        <path d="M52 34C64 46 71 57 77 69" fill="none" stroke={dark} strokeWidth="8" strokeLinecap="round" opacity="0.28" />
        <circle cx="51" cy="51" r="2.5" fill={dark} opacity="0.55" />
        <circle cx="69" cy="59" r="2" fill={dark} opacity="0.42" />
        {visual === "onion" && <path d="M61 32C56 21 60 16 67 12" fill="none" stroke={leaf} strokeWidth="4" strokeLinecap="round" />}
      </svg>
    );
  }

  if (visual === "pepper") {
    return (
      <svg {...baseProps}>
        <path d="M49 31C62 20 84 28 83 51C83 69 65 77 49 68C36 60 37 41 49 31Z" fill={color} />
        <path d="M65 30C61 20 67 15 76 17" fill="none" stroke={dark} strokeWidth="5" strokeLinecap="round" />
        <path d="M54 35C48 45 48 58 56 67" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity="0.35" />
      </svg>
    );
  }

  if (visual === "broccoli" || visual === "cabbage" || visual === "lettuce") {
    return (
      <svg {...baseProps}>
        <path d="M57 66C58 55 60 45 62 34" stroke={dark} strokeWidth="12" strokeLinecap="round" />
        {[46, 58, 70, 39, 81].map((x, index) => (
          <circle cx={x} cy={index < 3 ? 35 : 47} fill={index % 2 ? dark : color} key={x} r={visual === "lettuce" ? 16 : 13} />
        ))}
      </svg>
    );
  }

  if (visual === "steak") {
    return (
      <svg {...baseProps}>
        <path d="M33 52C31 34 50 23 70 28C91 33 100 53 84 68C68 83 36 75 33 52Z" fill={color} />
        <path d="M52 50C53 40 65 37 73 43C82 49 78 62 68 65C57 69 50 60 52 50Z" fill={accent} opacity="0.95" />
        <path d="M39 51C56 55 70 62 84 68" stroke={dark} strokeWidth="5" strokeLinecap="round" opacity="0.45" />
      </svg>
    );
  }

  if (visual === "drumstick") {
    return (
      <svg {...baseProps}>
        <path d="M47 52C39 39 47 25 63 23C79 21 91 34 86 50C82 66 59 69 47 52Z" fill={color} />
        <path d="M46 55L33 69" stroke={accent} strokeWidth="12" strokeLinecap="round" />
        <circle cx="29" cy="73" r="8" fill={accent} />
        <circle cx="40" cy="72" r="7" fill={accent} />
        <path d="M60 28C70 35 76 43 78 54" fill="none" stroke={dark} strokeWidth="5" strokeLinecap="round" opacity="0.36" />
      </svg>
    );
  }

  if (visual === "fish") {
    return (
      <svg {...baseProps}>
        <path d="M28 52C44 31 73 30 92 52C73 74 44 73 28 52Z" fill={color} />
        <path d="M92 52L108 39V65Z" fill={dark} />
        <circle cx="43" cy="48" r="3" fill="#ffffff" />
        <path d="M62 39C67 47 67 57 62 65" stroke={dark} strokeWidth="4" strokeLinecap="round" opacity="0.45" />
      </svg>
    );
  }

  if (visual === "sausage" || visual === "bacon") {
    return (
      <svg {...baseProps}>
        {[34, 50, 66, 82].map((x, index) => (
          <rect
            fill={index % 2 ? dark : color}
            height={visual === "bacon" ? 46 : 18}
            key={x}
            rx={visual === "bacon" ? 9 : 999}
            transform={`rotate(${visual === "bacon" ? -10 : -15} ${x} 50)`}
            width={visual === "bacon" ? 13 : 36}
            x={x}
            y={visual === "bacon" ? 28 : 45}
          />
        ))}
      </svg>
    );
  }

  if (visual === "eggs") {
    return (
      <svg {...baseProps}>
        {[44, 62, 80].map((x, index) => (
          <ellipse cx={x} cy="52" fill={color} key={x} rx="14" ry="18" />
        ))}
        <circle cx="62" cy="55" r="8" fill={dark} opacity="0.85" />
      </svg>
    );
  }

  if (visual === "peas" || visual === "beans" || visual === "mix" || visual === "nut" || visual === "walnut" || visual === "cashew" || visual === "peanut" || visual === "seeds") {
    return (
      <svg {...baseProps}>
        <path d="M25 66C41 47 80 39 101 58C83 75 48 81 25 66Z" fill="#ffffff" opacity="0.38" />
        {beanDots.map(([x, y, rotate, fill], index) => (
          <ellipse
            cx={x}
            cy={y}
            fill={index % 3 === 2 ? accent : fill}
            key={`${x}-${y}`}
            rx={visual === "seeds" ? 5 : 9}
            ry={visual === "seeds" ? 8 : 13}
            transform={`rotate(${rotate} ${x} ${y})`}
          />
        ))}
      </svg>
    );
  }

  if (visual === "corn") {
    return (
      <svg {...baseProps}>
        <path d="M59 24C78 34 80 57 62 74C45 60 42 38 59 24Z" fill={color} />
        {[42, 50, 58, 66].map((y) => (
          <path d={`M52 ${y}C59 ${y - 4} 67 ${y - 4} 74 ${y}`} fill="none" key={y} stroke={dark} strokeWidth="3" opacity="0.36" />
        ))}
        <path d="M48 57C38 49 34 38 38 28C50 40 56 52 59 72Z" fill={dark} opacity="0.7" />
      </svg>
    );
  }

  if (visual === "pasta") {
    return (
      <svg {...baseProps}>
        {[36, 48, 60, 72, 84].map((x) => (
          <path
            d={`M${x} 31C${x - 8} 42 ${x + 8} 49 ${x} 61C${x - 7} 72 ${x + 12} 75 ${x + 6} 82`}
            fill="none"
            key={x}
            stroke={color}
            strokeLinecap="round"
            strokeWidth="7"
          />
        ))}
        <path d="M35 32H87" stroke={dark} strokeLinecap="round" strokeWidth="5" opacity="0.32" />
      </svg>
    );
  }

  if (visual === "sack") {
    return (
      <svg {...baseProps}>
        <path d="M45 25H76L86 69C78 77 44 77 35 69L45 25Z" fill={color} />
        <path d="M45 25C54 32 67 32 76 25" fill="none" stroke={dark} strokeWidth="5" strokeLinecap="round" />
        <path d="M47 48H74M50 58H70" stroke={dark} strokeLinecap="round" strokeWidth="4" opacity="0.45" />
      </svg>
    );
  }

  return (
    <svg {...baseProps}>
      {grainDots.map(([x, y, rotate], index) => (
        <ellipse
          cx={x}
          cy={y}
          fill={index % 2 ? dark : color}
          key={`${x}-${y}`}
          rx="6"
          ry="12"
          transform={`rotate(${rotate} ${x} ${y})`}
        />
      ))}
    </svg>
  );
};

const CategoryIllustration = ({ categoryId }) => {
  const sample = products.find((product) => product.category === categoryId) || products[0];
  const secondary = products.find((product) => product.category === categoryId && product.key !== sample.key) || sample;

  return (
    <span className={`nectar-category-illustration nectar-category-illustration--${categoryId}`} aria-hidden="true">
      <ProductIllustration product={sample} compact />
      <ProductIllustration product={secondary} compact />
    </span>
  );
};

const getCopy = (lang) => {
  const local = copyByLang[lang] || {};
  return {
    ...baseCopy,
    ...local,
    nav: { ...baseCopy.nav, ...(local.nav || {}) },
    accountDetails: { ...baseCopy.accountDetails, ...(local.accountDetails || {}) },
    products: { ...baseCopy.products, ...(local.products || {}) },
  };
};

const formatPrice = (value) => `$${value.toFixed(2)}`;

export const NectarGroceryPreview = () => {
  const { lang } = useThemeLang();
  const copy = getCopy(lang);
  const [screen, setScreen] = useState("splash");
  const [activeTab, setActiveTab] = useState("shop");
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAll, setShowAll] = useState(false);
  const [cart, setCart] = useState({});
  const [favorites, setFavorites] = useState(() => new Set());
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailQty, setDetailQty] = useState(1);
  const [toast, setToast] = useState("");
  const [notificationOn, setNotificationOn] = useState(false);
  const [accountPanel, setAccountPanel] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const toastTimer = useRef(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setScreen("onboarding"), 1150);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(toastTimer.current);
  }, []);

  const translatedProducts = useMemo(
    () =>
      products.map((product) => {
        const fallback = product.fallbackName || product.id;
        const [legacyName, legacyUnit] = copy.products[product.id] || [];
        const name = product.names?.[lang] || product.names?.en || legacyName || fallback;
        const unit = product.units?.[lang] || product.units?.en || legacyUnit || "1 kg, price";
        const categoryName = `category${product.category.charAt(0).toUpperCase()}${product.category.slice(1)}`;
        return { ...product, categoryLabel: copy[categoryName] || product.category, name, unit };
      }),
    [copy, lang],
  );

  const filteredProducts = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return translatedProducts.filter((product) => {
      const categoryMatch = activeCategory === "all" || product.category === activeCategory;
      const searchableText = `${product.name} ${product.unit} ${product.categoryLabel}`.toLowerCase();
      const queryMatch = !normalized || searchableText.includes(normalized);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query, translatedProducts]);

  const cartItems = translatedProducts
    .filter((product) => cart[product.id])
    .map((product) => ({ ...product, qty: cart[product.id] }));

  const cartCount = cartItems.reduce((sum, product) => sum + product.qty, 0);
  const total = cartItems.reduce((sum, product) => sum + product.qty * product.price, 0);

  const showToast = (message) => {
    window.clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = window.setTimeout(() => setToast(""), 1800);
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setDetailQty(Math.max(1, cart[product.id] || 1));
  };

  const addToCart = (product, amount = 1) => {
    setCart((current) => ({ ...current, [product.id]: Math.max(1, (current[product.id] || 0) + amount) }));
    showToast(`${copy.added}: ${product.name}`);
  };

  const decreaseCart = (product) => {
    setCart((current) => {
      const nextQty = (current[product.id] || 0) - 1;
      const next = { ...current };
      if (nextQty <= 0) delete next[product.id];
      else next[product.id] = nextQty;
      return next;
    });
  };

  const toggleFavorite = (product) => {
    setFavorites((current) => {
      const next = new Set(current);
      if (next.has(product.id)) next.delete(product.id);
      else next.add(product.id);
      return next;
    });
  };

  const goTab = (tab) => {
    setActiveTab(tab);
    setScreen("shop");
    setSelectedProduct(null);
    setAccountPanel(null);
  };

  const chooseCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setQuery("");
    goTab("explore");
  };

  const ProductCard = ({ product }) => (
    <article className="nectar-product-card">
      <button
        className={`nectar-product-card__heart ${favorites.has(product.id) ? "is-active" : ""}`}
        type="button"
        onClick={() => toggleFavorite(product)}
        aria-label={`${copy.nav.fav}: ${product.name}`}
      >
        <Heart size={15} fill={favorites.has(product.id) ? "currentColor" : "none"} />
      </button>
      <button className="nectar-product-card__open" type="button" onClick={() => openProduct(product)}>
        <span className="nectar-product-card__image" style={{ "--product-tone": product.tone }}>
          <ProductIllustration product={product} />
        </span>
        <strong>{product.name}</strong>
        <small>{product.unit}</small>
      </button>
      <span className="nectar-product-card__footer">
        <b>{formatPrice(product.price)}</b>
        <button
          className="nectar-round-action"
          type="button"
          onClick={() => addToCart(product)}
          aria-label={`${copy.basket}: ${product.name}`}
        >
          <Plus size={17} />
        </button>
      </span>
    </article>
  );

  const PhoneTop = () => (
    <div className="nectar-phone-top">
      <span>9:41</span>
      <i />
      <b />
    </div>
  );

  const BottomNav = () => {
    const items = [
      { id: "shop", icon: Store, label: copy.nav.shop },
      { id: "explore", icon: Compass, label: copy.nav.explore },
      { id: "cart", icon: ShoppingBag, label: copy.nav.cart, count: cartCount },
      { id: "fav", icon: Heart, label: copy.nav.fav },
      { id: "account", icon: UserRound, label: copy.nav.account },
    ];

    return (
      <nav className="nectar-bottom-nav">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={activeTab === item.id ? "is-active" : ""}
              key={item.id}
              type="button"
              onClick={() => goTab(item.id)}
            >
              <span>
                <Icon size={19} />
                {!!item.count && <i>{item.count}</i>}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>
    );
  };

  const OnboardingScreen = () => (
    <div className="nectar-screen nectar-screen--auth">
      <div className="nectar-auth-hero">
        <span />
        <img src={carrotIcon} alt="" />
        <i />
      </div>
      <p>{copy.onboardingWelcome}</p>
      <h3>{copy.app}</h3>
      <small>{copy.onboardingText}</small>
      <div className="nectar-auth-actions">
        <button type="button" onClick={() => setScreen("phone")}>
          <LockKeyhole size={16} />
          Smart Id
        </button>
        <button type="button" onClick={() => setScreen("login")}>
          {copy.login}
          <ChevronRight size={16} />
        </button>
      </div>
      <span className="nectar-social-label">{copy.social}</span>
      <div className="nectar-social-row">
        <button type="button" onClick={() => showToast("Instagram")}>
          IG
        </button>
        <button type="button" onClick={() => showToast("Twitter")}>
          TW
        </button>
        <button type="button" onClick={() => showToast("Facebook")}>
          FB
        </button>
      </div>
      <button className="nectar-auth-link" type="button" onClick={() => setScreen("signup")}>
        {copy.createAccount}
      </button>
    </div>
  );

  const Keypad = () => (
    <div className="nectar-keypad" aria-hidden="true">
      {["1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "0", "⌫"].map((key) => (
        <span key={key}>{key}</span>
      ))}
    </div>
  );

  const PhoneScreen = () => (
    <div className="nectar-screen nectar-screen--form">
      <button className="nectar-back" type="button" onClick={() => setScreen("onboarding")}>
        <ArrowLeft size={17} />
      </button>
      <h3>{copy.phoneTitle}</h3>
      <label className="nectar-field">
        <span>{copy.phoneLabel}</span>
        <input defaultValue="+880" />
      </label>
      <button className="nectar-next-button" type="button" onClick={() => setScreen("verification")}>
        <ChevronRight size={22} />
      </button>
      <Keypad />
    </div>
  );

  const VerificationScreen = () => (
    <div className="nectar-screen nectar-screen--form">
      <button className="nectar-back" type="button" onClick={() => setScreen("phone")}>
        <ArrowLeft size={17} />
      </button>
      <h3>{copy.verificationTitle}</h3>
      <label className="nectar-field">
        <span>{copy.codeLabel}</span>
        <input defaultValue="- - - -" />
      </label>
      <button className="nectar-resend" type="button" onClick={() => showToast(copy.resendCode)}>
        {copy.resendCode}
      </button>
      <button className="nectar-next-button" type="button" onClick={() => setScreen("location")}>
        <ChevronRight size={22} />
      </button>
      <Keypad />
    </div>
  );

  const LocationScreen = () => (
    <div className="nectar-screen nectar-screen--form">
      <button className="nectar-back" type="button" onClick={() => setScreen("verification")}>
        <ArrowLeft size={17} />
      </button>
      <div className="nectar-location-art">
        <MapPin size={58} />
      </div>
      <h3>{copy.locationTitle}</h3>
      <p>{copy.locationText}</p>
      <label className="nectar-select-field">
        <span>{copy.zone}</span>
        <select defaultValue="banassre">
          <option value="banassre">Banassre</option>
          <option value="mirpur">Mirpur</option>
          <option value="uttara">Uttara</option>
        </select>
      </label>
      <label className="nectar-select-field">
        <span>{copy.area}</span>
        <select defaultValue="road-12">
          <option value="road-12">Road 12</option>
          <option value="market">Central market</option>
          <option value="garden">Garden block</option>
        </select>
      </label>
      <button className="nectar-primary-button" type="button" onClick={() => setScreen("shop")}>
        {copy.submit}
      </button>
    </div>
  );

  const LoginScreen = () => (
    <div className="nectar-screen nectar-screen--form">
      <button className="nectar-back" type="button" onClick={() => setScreen("onboarding")}>
        <ArrowLeft size={17} />
      </button>
      <img className="nectar-form-logo" src={carrotIcon} alt="" />
      <h3>{copy.loginTitle}</h3>
      <label className="nectar-field">
        <span>{copy.email}</span>
        <input defaultValue="demo@nectar.app" />
      </label>
      <label className="nectar-field">
        <span>{copy.password}</span>
        <input defaultValue="••••••••" />
      </label>
      <button className="nectar-resend" type="button" onClick={() => showToast(copy.forgot)}>
        {copy.forgot}
      </button>
      <button className="nectar-primary-button" type="button" onClick={() => setScreen("shop")}>
        {copy.login}
      </button>
      <button className="nectar-auth-link" type="button" onClick={() => setScreen("signup")}>
        {copy.createAccount}
      </button>
    </div>
  );

  const SignupScreen = () => (
    <div className="nectar-screen nectar-screen--form">
      <button className="nectar-back" type="button" onClick={() => setScreen("onboarding")}>
        <ArrowLeft size={17} />
      </button>
      <img className="nectar-form-logo" src={carrotIcon} alt="" />
      <h3>{copy.signupTitle}</h3>
      <label className="nectar-field">
        <span>{copy.username}</span>
        <input defaultValue="Nectar User" />
      </label>
      <label className="nectar-field">
        <span>{copy.email}</span>
        <input defaultValue="hello@nectar.app" />
      </label>
      <label className="nectar-field">
        <span>{copy.password}</span>
        <input defaultValue="••••••••" />
      </label>
      <button className={`nectar-check-row ${acceptedTerms ? "is-on" : ""}`} type="button" onClick={() => setAcceptedTerms((value) => !value)}>
        <i>{acceptedTerms && <Check size={13} />}</i>
        {copy.agree}
      </button>
      <button className="nectar-primary-button" type="button" onClick={() => setScreen("shop")}>
        {copy.signup}
      </button>
      <button className="nectar-auth-link" type="button" onClick={() => setScreen("login")}>
        {copy.haveAccount} {copy.login}
      </button>
    </div>
  );

  const HomeScreen = () => {
    const pickProducts = (ids) => ids.map((id) => translatedProducts.find((product) => product.id === id)).filter(Boolean);
    const bestOfferProducts = showAll
      ? translatedProducts.slice(0, 6)
      : pickProducts(["fruits-banana", "fruits-apple", "vegetables-tomato", "meat-beef"]);
    const popularProducts = showAll
      ? translatedProducts.slice(6, 12)
      : pickProducts(["vegetables-carrot", "pulses-lentils", "nuts-almond", "grains-rice"]);
    const promoFruit = translatedProducts.find((product) => product.id === "fruits-banana") || translatedProducts[0];
    const promoVegetable = translatedProducts.find((product) => product.id === "vegetables-tomato") || translatedProducts[1];

    return (
      <div className="nectar-screen">
        <div className="nectar-home-head">
          <img src={carrotIcon} alt="" />
          <button type="button" onClick={() => setScreen("location")}>
            <MapPin size={17} />
            {copy.location}
          </button>
        </div>
        <label className="nectar-search">
          <Search size={18} />
          <input
            value={query}
            placeholder={copy.search}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveCategory("all");
              setActiveTab("explore");
            }}
            onFocus={() => setActiveTab("explore")}
          />
        </label>
        <button className="nectar-promo" type="button" onClick={() => chooseCategory("vegetables")}>
          <div>
            <span>{copy.bannerTitle}</span>
            <strong>{copy.bannerText}</strong>
          </div>
          <span className="nectar-promo-art" aria-hidden="true">
            <ProductIllustration product={promoFruit} compact />
            <ProductIllustration product={promoVegetable} compact />
          </span>
        </button>
        <section className="nectar-section">
          <div className="nectar-section__head">
            <h3>{copy.exclusive}</h3>
            <button type="button" onClick={() => setShowAll((value) => !value)}>
              {copy.seeAll}
            </button>
          </div>
          <div className="nectar-card-row">
            {bestOfferProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        <section className="nectar-section">
          <div className="nectar-section__head">
            <h3>{copy.best}</h3>
            <button type="button" onClick={() => setShowAll(true)}>
              {copy.seeAll}
            </button>
          </div>
          <div className="nectar-card-row">
            {popularProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
        <section className="nectar-section">
          <div className="nectar-section__head">
            <h3>{copy.groceries}</h3>
            <button type="button" onClick={() => chooseCategory("all")}>
              {copy.seeAll}
            </button>
          </div>
          <div className="nectar-category-row">
            {categoryCards.map((category) => (
              <button
                className={`nectar-category-card ${category.className}`}
                key={category.id}
                type="button"
                onClick={() => chooseCategory(category.id)}
              >
                <CategoryIllustration categoryId={category.id} />
                <strong>{copy[`category${category.id.charAt(0).toUpperCase()}${category.id.slice(1)}`]}</strong>
              </button>
            ))}
          </div>
        </section>
      </div>
    );
  };

  const ExploreScreen = () => (
    <div className="nectar-screen">
      <div className="nectar-page-title">
        <h3>{copy.nav.explore}</h3>
        <button type="button" onClick={() => showToast(copy.filters)}>
          <SlidersHorizontal size={18} />
        </button>
      </div>
      <label className="nectar-search">
        <Search size={18} />
        <input value={query} placeholder={copy.search} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <div className="nectar-filter-row">
        {[{ id: "all" }, ...categoryCards].map((category) => (
          <button
            className={activeCategory === category.id ? "is-active" : ""}
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
          >
            {copy[`category${category.id.charAt(0).toUpperCase()}${category.id.slice(1)}`]}
          </button>
        ))}
      </div>
      <div className="nectar-product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );

  const CartScreen = () => (
    <div className="nectar-screen">
      <div className="nectar-page-title">
        <h3>{copy.nav.cart}</h3>
        <button type="button" onClick={() => setCart({})}>
          <Trash2 size={18} />
        </button>
      </div>
      {cartItems.length === 0 ? (
        <div className="nectar-empty">
          <ShoppingBag size={34} />
          <strong>{copy.emptyCart}</strong>
          <button type="button" onClick={() => goTab("shop")}>
            {copy.nav.shop}
          </button>
        </div>
      ) : (
        <div className="nectar-cart-list">
          {cartItems.map((product) => (
            <div className="nectar-cart-item" key={product.id}>
              <span className="nectar-cart-item__thumb" style={{ "--product-tone": product.tone }}>
                <ProductIllustration product={product} compact />
              </span>
              <div>
                <strong>{product.name}</strong>
                <small>{product.unit}</small>
                <span>
                  <button type="button" onClick={() => decreaseCart(product)}>
                    <Minus size={15} />
                  </button>
                  {product.qty}
                  <button type="button" onClick={() => addToCart(product)}>
                    <Plus size={15} />
                  </button>
                </span>
              </div>
              <b>{formatPrice(product.qty * product.price)}</b>
            </div>
          ))}
          <div className="nectar-checkout-card">
            <span>
              {copy.delivery}
              <b>$1.99</b>
            </span>
            <span>
              {copy.payment}
              <CreditCard size={18} />
            </span>
            <span>
              {copy.total}
              <b>{formatPrice(total + 1.99)}</b>
            </span>
            <button type="button" onClick={() => setScreen("accepted")}>
              {copy.checkout}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const FavouriteScreen = () => {
    const favouriteProducts = translatedProducts.filter((product) => favorites.has(product.id));
    return (
      <div className="nectar-screen">
        <div className="nectar-page-title">
          <h3>{copy.nav.fav}</h3>
          <Heart size={18} />
        </div>
        {favouriteProducts.length === 0 ? (
          <div className="nectar-empty">
            <Heart size={34} />
            <strong>{copy.emptyFav}</strong>
            <button type="button" onClick={() => goTab("shop")}>
              {copy.nav.shop}
            </button>
          </div>
        ) : (
          <div className="nectar-product-grid">
            {favouriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const AccountScreen = () => {
    if (accountPanel) {
      const Icon = accountPanel.icon;
      return (
        <div className="nectar-screen">
          <button className="nectar-back" type="button" onClick={() => setAccountPanel(null)}>
            <ArrowLeft size={17} />
          </button>
          <div className="nectar-account-detail">
            <Icon size={28} />
            <h3>{accountPanel.label}</h3>
            <p>{accountPanel.text}</p>
            <button type="button" onClick={() => showToast(accountPanel.label)}>
              {copy.submit}
            </button>
          </div>
        </div>
      );
    }

    const rows = [
      { key: "profile", label: copy.profile, icon: UserRound },
      { key: "orders", label: copy.orders, icon: Truck },
      { key: "notifications", label: copy.notifications, icon: Bell },
      { key: "help", label: copy.help, icon: Settings },
    ];

    return (
      <div className="nectar-screen">
        <div className="nectar-account-card">
          <span>
            <UserRound size={23} />
          </span>
          <div>
            <h3>{copy.accountTitle}</h3>
            <p>{copy.accountHint}</p>
          </div>
        </div>
        {rows.map((row) => {
          const Icon = row.icon;
          return (
            <button
              className="nectar-account-row"
              key={row.key}
              type="button"
              onClick={() => setAccountPanel({ ...row, text: copy.accountDetails[row.key] })}
            >
              <Icon size={20} />
              <span>{row.label}</span>
              <ChevronRight size={18} />
            </button>
          );
        })}
        <button
          className={`nectar-toggle-row ${notificationOn ? "is-on" : ""}`}
          type="button"
          onClick={() => setNotificationOn((value) => !value)}
        >
          <span>{copy.notifications}</span>
          <i />
        </button>
      </div>
    );
  };

  const AcceptedScreen = () => (
    <div className="nectar-screen nectar-screen--accepted">
      <div className="nectar-success-art">
        <CheckCircle2 size={74} />
      </div>
      <h3>{copy.orderAccepted}</h3>
      <p>{copy.orderText}</p>
      <button type="button" onClick={() => showToast(copy.track)}>
        {copy.track}
      </button>
      <button className="nectar-ghost-link" type="button" onClick={() => goTab("shop")}>
        {copy.backHome}
      </button>
    </div>
  );

  const CurrentScreen = () => {
    if (screen === "onboarding") return <OnboardingScreen />;
    if (screen === "phone") return <PhoneScreen />;
    if (screen === "verification") return <VerificationScreen />;
    if (screen === "location") return <LocationScreen />;
    if (screen === "login") return <LoginScreen />;
    if (screen === "signup") return <SignupScreen />;
    if (screen === "accepted") return <AcceptedScreen />;
    if (activeTab === "explore") return <ExploreScreen />;
    if (activeTab === "cart") return <CartScreen />;
    if (activeTab === "fav") return <FavouriteScreen />;
    if (activeTab === "account") return <AccountScreen />;
    return <HomeScreen />;
  };

  return (
    <div className="mobile-app-preview mobile-app-preview--nectar">
      <div className="mobile-app-preview__phone-wrap">
        <div className="app-phone-frame app-phone-frame--nectar">
          <div className="nectar-phone-app">
            <PhoneTop />
            {screen === "splash" ? (
              <div className="nectar-splash">
                <img className="nectar-seq" src={carrotIcon} alt="" />
                <h2 className="nectar-seq" style={{ "--delay": "120ms" }}>
                  {copy.app}
                </h2>
                <p className="nectar-seq" style={{ "--delay": "220ms" }}>
                  {copy.subtitle}
                </p>
              </div>
            ) : (
              <>
                <CurrentScreen />
                {["shop", "accepted"].includes(screen) && <BottomNav />}
              </>
            )}
            {selectedProduct && (
              <div className="nectar-sheet" role="dialog" aria-label={copy.details}>
                <button className="nectar-sheet__close" type="button" onClick={() => setSelectedProduct(null)}>
                  <X size={18} />
                </button>
                <div className="nectar-sheet__art" style={{ "--product-tone": selectedProduct.tone }}>
                  <ProductIllustration product={selectedProduct} />
                </div>
                <div className="nectar-sheet__title">
                  <div>
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.unit}</p>
                  </div>
                  <button
                    className={favorites.has(selectedProduct.id) ? "is-active" : ""}
                    type="button"
                    onClick={() => toggleFavorite(selectedProduct)}
                  >
                    <Heart size={22} fill={favorites.has(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                </div>
                <div className="nectar-sheet__qty">
                  <span>
                    <button type="button" onClick={() => setDetailQty((value) => Math.max(1, value - 1))}>
                      <Minus size={17} />
                    </button>
                    {detailQty}
                    <button type="button" onClick={() => setDetailQty((value) => value + 1)}>
                      <Plus size={17} />
                    </button>
                  </span>
                  <b>{formatPrice(selectedProduct.price * detailQty)}</b>
                </div>
                <div className="nectar-sheet__info">
                  <span>{copy.details}</span>
                  <p>{copy.nutrition}: 100g</p>
                  <p>
                    {copy.review}: <Star size={13} fill="currentColor" /> <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                    <Star size={13} fill="currentColor" />
                  </p>
                </div>
                <button
                  className="nectar-primary-button"
                  type="button"
                  onClick={() => {
                    addToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                  }}
                >
                  {copy.basket}
                </button>
              </div>
            )}
            {!!toast && <div className="nectar-toast">{toast}</div>}
          </div>
        </div>
      </div>
      <aside className="mobile-app-preview__copy">
        <span className="mobile-app-preview__kicker">{copy.copyKicker}</span>
        <h2>{copy.copyTitle}</h2>
        <p>{copy.copyDesc}</p>
        <div className="mobile-app-preview__features">
          {copy.features.map((feature) => (
            <span key={feature}>
              <Leaf size={15} />
              {feature}
            </span>
          ))}
        </div>
      </aside>
    </div>
  );
};

export default NectarGroceryPreview;
