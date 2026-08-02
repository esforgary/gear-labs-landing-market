import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowUpRight,
  BadgePercent,
  Bell,
  CalendarDays,
  ChevronDown,
  CircleDollarSign,
  Coins,
  CreditCard,
  Eye,
  EyeOff,
  Gift,
  Gauge,
  Landmark,
  LockKeyhole,
  PiggyBank,
  ReceiptText,
  Repeat2,
  Send,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useThemeLang } from "../../../../../context/ThemeLangContext";
import "./finflow-wallet.scss";

const finflowMark = new URL("./img/finflow-mark.svg", import.meta.url).href;

type Screen = "home" | "cashback" | "deposits" | "credit" | "savings" | "settings";
type ProductScreen = Exclude<Screen, "home" | "settings">;
type HomeTab = "card" | "products" | "activity" | "exchange";

type BankCopy = {
  previewBadge: string;
  title: string;
  text: string;
  chips: string[];
  phone: {
    brand: string;
    greeting: string;
    balance: string;
    cardName: string;
    cardStatus: string;
    flip: string;
    front: string;
    back: string;
    copied: string;
    products: string;
    activity: string;
    settings: string;
    nav: Record<Screen, string>;
    actions: {
      send: string;
      topup: string;
      statement: string;
    };
    productsList: Array<{
      title: string;
      text: string;
      value: string;
    }>;
    operations: Array<{
      title: string;
      text: string;
      amount: string;
      type: "in" | "out";
    }>;
    details: Record<ProductScreen, {
      title: string;
      text: string;
      items: Array<{
        title: string;
        text: string;
        value: string;
      }>;
      action: string;
    }>;
    settingsList: Array<{
      title: string;
      text: string;
    }>;
  };
};

const bankCopy: Record<string, BankCopy> = {
  ru: {
    previewBadge: "Банковское приложение",
    title: "FinFlow Bank",
    text: "Мобильный банк в стиле Monobank: живая карта, кешбек, депозиты, кредитный лимит, накопления и быстрые операции.",
    chips: ["Переворот карты", "Кешбек и банки", "Депозиты и кредит", "Умные накопления"],
    phone: {
      brand: "FinFlow",
      greeting: "Добрый вечер",
      balance: "Доступно",
      cardName: "Black card",
      cardStatus: "Активна",
      flip: "Повернуть карту",
      front: "Лицевая сторона",
      back: "Задняя сторона",
      copied: "Данные карты показаны",
      products: "Банковские продукты",
      activity: "Последние операции",
      settings: "Безопасность",
      nav: {
        home: "Главная",
        cashback: "Кешбек",
        deposits: "Депозиты",
        credit: "Кредит",
        savings: "Банки",
        settings: "Настройки",
      },
      actions: {
        send: "Перевести",
        topup: "Пополнить",
        statement: "Выписка",
      },
      productsList: [
        { title: "Кешбек", text: "Категории месяца и повышенные проценты", value: "до 20%" },
        { title: "Депозиты", text: "Гибкие сроки, проценты и досрочное закрытие", value: "15.5%" },
        { title: "Кредит", text: "Лимит, платежи и контроль нагрузки", value: "$3 200" },
        { title: "Накопления", text: "Банки под цели, округления и автоплатежи", value: "$840" },
      ],
      operations: [
        { title: "Кофейня Urban", text: "Сегодня, 09:42", amount: "-$4.80", type: "out" },
        { title: "Зарплата", text: "Сегодня, 08:10", amount: "+$1 240", type: "in" },
        { title: "Такси", text: "Вчера, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: {
          title: "Кешбек месяца",
          text: "Выберите категории и смотрите, где карта возвращает больше.",
          action: "Активировать категории",
          items: [
            { title: "Кафе и рестораны", text: "Считается сразу после оплаты", value: "12%" },
            { title: "Такси", text: "Повышенный процент в выходные", value: "8%" },
            { title: "Техника", text: "Для онлайн-магазинов", value: "5%" },
          ],
        },
        deposits: {
          title: "Депозиты",
          text: "Откройте вклад, пополняйте и отслеживайте рост прямо в приложении.",
          action: "Открыть депозит",
          items: [
            { title: "Стабильный", text: "6 месяцев, пополнение доступно", value: "15.5%" },
            { title: "Быстрый", text: "30 дней, деньги рядом", value: "9.8%" },
            { title: "Валютный", text: "USD, фиксированный процент", value: "4.2%" },
          ],
        },
        credit: {
          title: "Кредитный лимит",
          text: "Покажите доступный лимит, дату платежа и безопасную нагрузку.",
          action: "Настроить лимит",
          items: [
            { title: "Доступно сейчас", text: "Без скрытых комиссий", value: "$3 200" },
            { title: "Минимальный платеж", text: "До 12 августа", value: "$86" },
            { title: "Грейс-период", text: "Покупки без процентов", value: "62 дня" },
          ],
        },
        savings: {
          title: "Банки накоплений",
          text: "Разделите цели и пополняйте их вручную или автоматически.",
          action: "Создать банку",
          items: [
            { title: "Путешествие", text: "Собрано 48% цели", value: "$480" },
            { title: "Новый ноутбук", text: "Округление каждой покупки", value: "$220" },
            { title: "Подушка", text: "Автопополнение каждую неделю", value: "$140" },
          ],
        },
      },
      settingsList: [
        { title: "Face ID и PIN", text: "Вход и подтверждение операций" },
        { title: "Лимиты карты", text: "Онлайн, снятие наличных и переводы" },
        { title: "Уведомления", text: "Пуши по операциям и важным событиям" },
      ],
    },
  },
  en: {
    previewBadge: "Banking app",
    title: "FinFlow Bank",
    text: "A Monobank-inspired mobile bank with a flipping card, cashback, deposits, credit limits, savings jars, and quick payments.",
    chips: ["Flipping card", "Cashback and jars", "Deposits and credit", "Smart savings"],
    phone: {
      brand: "FinFlow",
      greeting: "Good evening",
      balance: "Available",
      cardName: "Black card",
      cardStatus: "Active",
      flip: "Flip card",
      front: "Front side",
      back: "Back side",
      copied: "Card details shown",
      products: "Banking products",
      activity: "Recent activity",
      settings: "Security",
      nav: {
        home: "Home",
        cashback: "Cashback",
        deposits: "Deposits",
        credit: "Credit",
        savings: "Jars",
        settings: "Settings",
      },
      actions: {
        send: "Send",
        topup: "Top up",
        statement: "Statement",
      },
      productsList: [
        { title: "Cashback", text: "Monthly categories and boosted rewards", value: "up to 20%" },
        { title: "Deposits", text: "Flexible terms, rates, and early close", value: "15.5%" },
        { title: "Credit", text: "Limit, payments, and load control", value: "$3,200" },
        { title: "Savings", text: "Goal jars, roundups, and autopayments", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Today, 09:42", amount: "-$4.80", type: "out" },
        { title: "Salary", text: "Today, 08:10", amount: "+$1,240", type: "in" },
        { title: "Taxi", text: "Yesterday, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: {
          title: "Monthly cashback",
          text: "Pick categories and see where the card returns more.",
          action: "Activate categories",
          items: [
            { title: "Cafes and dining", text: "Applied right after payment", value: "12%" },
            { title: "Taxi", text: "Boosted on weekends", value: "8%" },
            { title: "Electronics", text: "For online stores", value: "5%" },
          ],
        },
        deposits: {
          title: "Deposits",
          text: "Open a deposit, top it up, and track growth in the app.",
          action: "Open deposit",
          items: [
            { title: "Stable", text: "6 months, top-ups available", value: "15.5%" },
            { title: "Quick", text: "30 days, money stays close", value: "9.8%" },
            { title: "Currency", text: "USD fixed rate", value: "4.2%" },
          ],
        },
        credit: {
          title: "Credit limit",
          text: "Show available limit, payment date, and safe load.",
          action: "Adjust limit",
          items: [
            { title: "Available now", text: "No hidden fees", value: "$3,200" },
            { title: "Minimum payment", text: "Until August 12", value: "$86" },
            { title: "Grace period", text: "Interest-free purchases", value: "62 days" },
          ],
        },
        savings: {
          title: "Savings jars",
          text: "Split goals and fund them manually or automatically.",
          action: "Create jar",
          items: [
            { title: "Travel", text: "48% of the goal collected", value: "$480" },
            { title: "New laptop", text: "Roundups from every payment", value: "$220" },
            { title: "Safety fund", text: "Weekly auto top-up", value: "$140" },
          ],
        },
      },
      settingsList: [
        { title: "Face ID and PIN", text: "Login and operation approval" },
        { title: "Card limits", text: "Online, cash withdrawal, and transfers" },
        { title: "Notifications", text: "Pushes for payments and key events" },
      ],
    },
  },
  de: {
    previewBadge: "Banking-App",
    title: "FinFlow Bank",
    text: "Mobile Bank im Monobank-Stil: drehbare Karte, Cashback, Einlagen, Kreditlimit, Sparziele und schnelle Zahlungen.",
    chips: ["Drehbare Karte", "Cashback", "Einlagen und Kredit", "Sparziele"],
    phone: {
      brand: "FinFlow",
      greeting: "Guten Abend",
      balance: "Verfugbar",
      cardName: "Black card",
      cardStatus: "Aktiv",
      flip: "Karte drehen",
      front: "Vorderseite",
      back: "Ruckseite",
      copied: "Kartendaten angezeigt",
      products: "Bankprodukte",
      activity: "Letzte Vorgange",
      settings: "Sicherheit",
      nav: {
        home: "Start",
        cashback: "Cashback",
        deposits: "Einlagen",
        credit: "Kredit",
        savings: "Ziele",
        settings: "Einstellungen",
      },
      actions: {
        send: "Senden",
        topup: "Aufladen",
        statement: "Auszug",
      },
      productsList: [
        { title: "Cashback", text: "Monatskategorien und Boni", value: "bis 20%" },
        { title: "Einlagen", text: "Flexible Laufzeiten und Zinsen", value: "15.5%" },
        { title: "Kredit", text: "Limit, Zahlungen und Kontrolle", value: "$3 200" },
        { title: "Sparen", text: "Ziele, Rundungen und Autopay", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Heute, 09:42", amount: "-$4.80", type: "out" },
        { title: "Gehalt", text: "Heute, 08:10", amount: "+$1 240", type: "in" },
        { title: "Taxi", text: "Gestern, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: {
          title: "Cashback des Monats",
          text: "Wahlen Sie Kategorien und sehen Sie bessere Ruckzahlungen.",
          action: "Kategorien aktivieren",
          items: [
            { title: "Cafes", text: "Direkt nach Zahlung", value: "12%" },
            { title: "Taxi", text: "Mehr am Wochenende", value: "8%" },
            { title: "Technik", text: "Fur Online-Shops", value: "5%" },
          ],
        },
        deposits: {
          title: "Einlagen",
          text: "Eroffnen, auffullen und Wachstum verfolgen.",
          action: "Einlage offnen",
          items: [
            { title: "Stabil", text: "6 Monate, Aufladung moglich", value: "15.5%" },
            { title: "Schnell", text: "30 Tage", value: "9.8%" },
            { title: "Wahrung", text: "USD Festzins", value: "4.2%" },
          ],
        },
        credit: {
          title: "Kreditlimit",
          text: "Limit, Zahlungstermin und Belastung zeigen.",
          action: "Limit einstellen",
          items: [
            { title: "Verfugbar", text: "Ohne versteckte Gebuhren", value: "$3 200" },
            { title: "Mindestzahlung", text: "Bis 12. August", value: "$86" },
            { title: "Grace Period", text: "Zinsfreie Einkaufe", value: "62 Tage" },
          ],
        },
        savings: {
          title: "Sparziele",
          text: "Ziele trennen und automatisch auffullen.",
          action: "Ziel erstellen",
          items: [
            { title: "Reise", text: "48% gesammelt", value: "$480" },
            { title: "Laptop", text: "Rundungen jeder Zahlung", value: "$220" },
            { title: "Reserve", text: "Wochentlich automatisch", value: "$140" },
          ],
        },
      },
      settingsList: [
        { title: "Face ID und PIN", text: "Login und Bestatigung" },
        { title: "Kartenlimits", text: "Online, Bargeld und Transfers" },
        { title: "Benachrichtigungen", text: "Zahlungen und Ereignisse" },
      ],
    },
  },
  fr: {
    previewBadge: "App bancaire",
    title: "FinFlow Bank",
    text: "Banque mobile inspiree de Monobank avec carte retournable, cashback, depots, credit, cagnottes et paiements rapides.",
    chips: ["Carte retournable", "Cashback", "Depots et credit", "Cagnottes"],
    phone: {
      brand: "FinFlow",
      greeting: "Bonsoir",
      balance: "Disponible",
      cardName: "Black card",
      cardStatus: "Active",
      flip: "Retourner",
      front: "Face avant",
      back: "Face arriere",
      copied: "Details de carte affiches",
      products: "Produits bancaires",
      activity: "Operations recentes",
      settings: "Securite",
      nav: { home: "Accueil", cashback: "Cashback", deposits: "Depots", credit: "Credit", savings: "Cagnottes", settings: "Reglages" },
      actions: { send: "Envoyer", topup: "Recharger", statement: "Releve" },
      productsList: [
        { title: "Cashback", text: "Categories du mois et bonus", value: "jusqu'a 20%" },
        { title: "Depots", text: "Durees flexibles et taux", value: "15.5%" },
        { title: "Credit", text: "Limite, paiements et controle", value: "$3 200" },
        { title: "Epargne", text: "Objectifs, arrondis et auto-paiement", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Aujourd'hui, 09:42", amount: "-$4.80", type: "out" },
        { title: "Salaire", text: "Aujourd'hui, 08:10", amount: "+$1 240", type: "in" },
        { title: "Taxi", text: "Hier, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: { title: "Cashback du mois", text: "Choisissez les categories avec meilleur retour.", action: "Activer", items: [
          { title: "Cafes", text: "Applique apres paiement", value: "12%" },
          { title: "Taxi", text: "Plus fort le week-end", value: "8%" },
          { title: "Tech", text: "Pour boutiques en ligne", value: "5%" },
        ] },
        deposits: { title: "Depots", text: "Ouvrez, rechargez et suivez la croissance.", action: "Ouvrir depot", items: [
          { title: "Stable", text: "6 mois, recharge possible", value: "15.5%" },
          { title: "Rapide", text: "30 jours", value: "9.8%" },
          { title: "Devise", text: "USD taux fixe", value: "4.2%" },
        ] },
        credit: { title: "Limite credit", text: "Limite disponible, date et charge sure.", action: "Ajuster", items: [
          { title: "Disponible", text: "Sans frais caches", value: "$3 200" },
          { title: "Paiement min.", text: "Jusqu'au 12 aout", value: "$86" },
          { title: "Delai grace", text: "Achats sans interet", value: "62 j" },
        ] },
        savings: { title: "Cagnottes", text: "Objectifs separes et versements auto.", action: "Creer", items: [
          { title: "Voyage", text: "48% collecte", value: "$480" },
          { title: "Laptop", text: "Arrondis automatiques", value: "$220" },
          { title: "Reserve", text: "Chaque semaine", value: "$140" },
        ] },
      },
      settingsList: [
        { title: "Face ID et PIN", text: "Connexion et validation" },
        { title: "Limites carte", text: "Online, cash et virements" },
        { title: "Notifications", text: "Paiements et evenements" },
      ],
    },
  },
  it: {
    previewBadge: "App bancaria",
    title: "FinFlow Bank",
    text: "Banca mobile in stile Monobank: carta ribaltabile, cashback, depositi, credito, salvadanai e pagamenti rapidi.",
    chips: ["Carta flip", "Cashback", "Depositi e credito", "Risparmi"],
    phone: {
      brand: "FinFlow",
      greeting: "Buona sera",
      balance: "Disponibile",
      cardName: "Black card",
      cardStatus: "Attiva",
      flip: "Gira carta",
      front: "Fronte",
      back: "Retro",
      copied: "Dati carta mostrati",
      products: "Prodotti bancari",
      activity: "Movimenti recenti",
      settings: "Sicurezza",
      nav: { home: "Home", cashback: "Cashback", deposits: "Depositi", credit: "Credito", savings: "Salvad.", settings: "Impost." },
      actions: { send: "Invia", topup: "Ricarica", statement: "Estratto" },
      productsList: [
        { title: "Cashback", text: "Categorie mensili e bonus", value: "fino 20%" },
        { title: "Depositi", text: "Scadenze flessibili e tassi", value: "15.5%" },
        { title: "Credito", text: "Limite, rate e controllo", value: "$3 200" },
        { title: "Risparmi", text: "Obiettivi, arrotondamenti e auto", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Oggi, 09:42", amount: "-$4.80", type: "out" },
        { title: "Stipendio", text: "Oggi, 08:10", amount: "+$1 240", type: "in" },
        { title: "Taxi", text: "Ieri, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: { title: "Cashback mese", text: "Scegli le categorie migliori.", action: "Attiva", items: [
          { title: "Cafe", text: "Dopo il pagamento", value: "12%" },
          { title: "Taxi", text: "Bonus weekend", value: "8%" },
          { title: "Tech", text: "Per shop online", value: "5%" },
        ] },
        deposits: { title: "Depositi", text: "Apri e segui la crescita.", action: "Apri", items: [
          { title: "Stabile", text: "6 mesi, ricaricabile", value: "15.5%" },
          { title: "Rapido", text: "30 giorni", value: "9.8%" },
          { title: "Valuta", text: "USD fisso", value: "4.2%" },
        ] },
        credit: { title: "Limite credito", text: "Disponibile, pagamento e carico.", action: "Imposta", items: [
          { title: "Disponibile", text: "Senza commissioni nascoste", value: "$3 200" },
          { title: "Pagamento min.", text: "Entro 12 agosto", value: "$86" },
          { title: "Periodo grace", text: "Acquisti senza interessi", value: "62 giorni" },
        ] },
        savings: { title: "Salvadanai", text: "Obiettivi separati e automatici.", action: "Crea", items: [
          { title: "Viaggio", text: "48% raccolto", value: "$480" },
          { title: "Laptop", text: "Arrotondamenti", value: "$220" },
          { title: "Riserva", text: "Ogni settimana", value: "$140" },
        ] },
      },
      settingsList: [
        { title: "Face ID e PIN", text: "Accesso e conferme" },
        { title: "Limiti carta", text: "Online, contanti e bonifici" },
        { title: "Notifiche", text: "Pagamenti ed eventi" },
      ],
    },
  },
  pl: {
    previewBadge: "Aplikacja bankowa",
    title: "FinFlow Bank",
    text: "Bank mobilny w stylu Monobank: odwracana karta, cashback, lokaty, kredyt, skarbonki i szybkie platnosci.",
    chips: ["Karta flip", "Cashback", "Lokaty i kredyt", "Skarbonki"],
    phone: {
      brand: "FinFlow",
      greeting: "Dobry wieczor",
      balance: "Dostepne",
      cardName: "Black card",
      cardStatus: "Aktywna",
      flip: "Obroc karte",
      front: "Przod",
      back: "Tyl",
      copied: "Dane karty pokazane",
      products: "Produkty bankowe",
      activity: "Ostatnie operacje",
      settings: "Bezpieczenstwo",
      nav: { home: "Start", cashback: "Cashback", deposits: "Lokaty", credit: "Kredyt", savings: "Cele", settings: "Ustaw." },
      actions: { send: "Wyslij", topup: "Doladuj", statement: "Wyciag" },
      productsList: [
        { title: "Cashback", text: "Kategorie miesiaca i bonusy", value: "do 20%" },
        { title: "Lokaty", text: "Elastyczne terminy i oprocentowanie", value: "15.5%" },
        { title: "Kredyt", text: "Limit, raty i kontrola", value: "$3 200" },
        { title: "Oszczednosci", text: "Cele, zaokraglenia i auto", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Dzis, 09:42", amount: "-$4.80", type: "out" },
        { title: "Pensja", text: "Dzis, 08:10", amount: "+$1 240", type: "in" },
        { title: "Taxi", text: "Wczoraj, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: { title: "Cashback miesiaca", text: "Wybierz kategorie z lepszym zwrotem.", action: "Aktywuj", items: [
          { title: "Kawiarnie", text: "Po platnosci", value: "12%" },
          { title: "Taxi", text: "Bonus weekendowy", value: "8%" },
          { title: "Technika", text: "Sklepy online", value: "5%" },
        ] },
        deposits: { title: "Lokaty", text: "Otworz i sledz wzrost.", action: "Otworz lokate", items: [
          { title: "Stabilna", text: "6 miesiecy", value: "15.5%" },
          { title: "Szybka", text: "30 dni", value: "9.8%" },
          { title: "Walutowa", text: "USD staly procent", value: "4.2%" },
        ] },
        credit: { title: "Limit kredytu", text: "Limit, termin i bezpieczne obciazenie.", action: "Ustaw limit", items: [
          { title: "Dostepne", text: "Bez ukrytych oplat", value: "$3 200" },
          { title: "Minimalna rata", text: "Do 12 sierpnia", value: "$86" },
          { title: "Grace period", text: "Zakupy bez odsetek", value: "62 dni" },
        ] },
        savings: { title: "Skarbonki", text: "Cele i automatyczne wplaty.", action: "Utworz", items: [
          { title: "Podroz", text: "48% celu", value: "$480" },
          { title: "Laptop", text: "Zaokraglenia platnosci", value: "$220" },
          { title: "Rezerwa", text: "Co tydzien", value: "$140" },
        ] },
      },
      settingsList: [
        { title: "Face ID i PIN", text: "Logowanie i potwierdzenia" },
        { title: "Limity karty", text: "Online, gotowka i przelewy" },
        { title: "Powiadomienia", text: "Platnosci i zdarzenia" },
      ],
    },
  },
  cz: {
    previewBadge: "Bankovni app",
    title: "FinFlow Bank",
    text: "Mobilni banka ve stylu Monobank: otocna karta, cashback, vklady, kredit, sporici cile a rychle platby.",
    chips: ["Otocna karta", "Cashback", "Vklady a kredit", "Sporeni"],
    phone: {
      brand: "FinFlow",
      greeting: "Dobry vecer",
      balance: "Dostupne",
      cardName: "Black card",
      cardStatus: "Aktivni",
      flip: "Otocit kartu",
      front: "Predni strana",
      back: "Zadni strana",
      copied: "Detaily karty zobrazeny",
      products: "Bankovni produkty",
      activity: "Posledni operace",
      settings: "Bezpecnost",
      nav: { home: "Domu", cashback: "Cashback", deposits: "Vklady", credit: "Kredit", savings: "Cile", settings: "Nast." },
      actions: { send: "Poslat", topup: "Dobit", statement: "Vypis" },
      productsList: [
        { title: "Cashback", text: "Mesicni kategorie a bonusy", value: "az 20%" },
        { title: "Vklady", text: "Flexibilni doby a uroky", value: "15.5%" },
        { title: "Kredit", text: "Limit, platby a kontrola", value: "$3 200" },
        { title: "Sporeni", text: "Cile, zaokrouhleni a auto", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Dnes, 09:42", amount: "-$4.80", type: "out" },
        { title: "Mzda", text: "Dnes, 08:10", amount: "+$1 240", type: "in" },
        { title: "Taxi", text: "Vcera, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: { title: "Cashback mesice", text: "Vyberte kategorie s vyssim navratem.", action: "Aktivovat", items: [
          { title: "Kavarny", text: "Po platbe", value: "12%" },
          { title: "Taxi", text: "Vikendovy bonus", value: "8%" },
          { title: "Technika", text: "Online obchody", value: "5%" },
        ] },
        deposits: { title: "Vklady", text: "Otevrete a sledujte rust.", action: "Otevrit", items: [
          { title: "Stabilni", text: "6 mesicu", value: "15.5%" },
          { title: "Rychly", text: "30 dni", value: "9.8%" },
          { title: "Menovy", text: "USD fixni urok", value: "4.2%" },
        ] },
        credit: { title: "Kreditni limit", text: "Limit, splatka a bezpecna zatez.", action: "Nastavit", items: [
          { title: "Dostupne", text: "Bez skrytych poplatku", value: "$3 200" },
          { title: "Minimalni platba", text: "Do 12. srpna", value: "$86" },
          { title: "Grace period", text: "Nakupy bez uroku", value: "62 dni" },
        ] },
        savings: { title: "Sporici cile", text: "Cile a automaticke dobijeni.", action: "Vytvorit", items: [
          { title: "Cesta", text: "48% cile", value: "$480" },
          { title: "Laptop", text: "Zaokrouhleni plateb", value: "$220" },
          { title: "Rezerva", text: "Kazdy tyden", value: "$140" },
        ] },
      },
      settingsList: [
        { title: "Face ID a PIN", text: "Prihlaseni a potvrzeni" },
        { title: "Limity karty", text: "Online, hotovost a prevody" },
        { title: "Oznameni", text: "Platby a udalosti" },
      ],
    },
  },
  sk: {
    previewBadge: "Bankova appka",
    title: "FinFlow Bank",
    text: "Mobilna banka v style Monobank: otocna karta, cashback, vklady, kredit, sporiace ciele a rychle platby.",
    chips: ["Otocna karta", "Cashback", "Vklady a kredit", "Sporenie"],
    phone: {
      brand: "FinFlow",
      greeting: "Dobry vecer",
      balance: "Dostupne",
      cardName: "Black card",
      cardStatus: "Aktivna",
      flip: "Otocit kartu",
      front: "Predna strana",
      back: "Zadna strana",
      copied: "Udaje karty zobrazene",
      products: "Bankove produkty",
      activity: "Posledne operacie",
      settings: "Bezpecnost",
      nav: { home: "Domov", cashback: "Cashback", deposits: "Vklady", credit: "Kredit", savings: "Ciele", settings: "Nast." },
      actions: { send: "Poslat", topup: "Dobit", statement: "Vypis" },
      productsList: [
        { title: "Cashback", text: "Mesacne kategorie a bonusy", value: "do 20%" },
        { title: "Vklady", text: "Flexibilne doby a uroky", value: "15.5%" },
        { title: "Kredit", text: "Limit, platby a kontrola", value: "$3 200" },
        { title: "Sporenie", text: "Ciele, zaokruhlenia a auto", value: "$840" },
      ],
      operations: [
        { title: "Urban Coffee", text: "Dnes, 09:42", amount: "-$4.80", type: "out" },
        { title: "Vyplata", text: "Dnes, 08:10", amount: "+$1 240", type: "in" },
        { title: "Taxi", text: "Vcera, 22:18", amount: "-$12.50", type: "out" },
      ],
      details: {
        cashback: { title: "Cashback mesiaca", text: "Vyberte kategorie s vyssim navratom.", action: "Aktivovat", items: [
          { title: "Kaviarne", text: "Po platbe", value: "12%" },
          { title: "Taxi", text: "Vikendovy bonus", value: "8%" },
          { title: "Technika", text: "Online obchody", value: "5%" },
        ] },
        deposits: { title: "Vklady", text: "Otvorte a sledujte rast.", action: "Otvorit", items: [
          { title: "Stabilny", text: "6 mesiacov", value: "15.5%" },
          { title: "Rychly", text: "30 dni", value: "9.8%" },
          { title: "Menovy", text: "USD fixny urok", value: "4.2%" },
        ] },
        credit: { title: "Kreditny limit", text: "Limit, splatka a bezpecna zataz.", action: "Nastavit", items: [
          { title: "Dostupne", text: "Bez skrytych poplatkov", value: "$3 200" },
          { title: "Minimalna platba", text: "Do 12. augusta", value: "$86" },
          { title: "Grace period", text: "Nakupy bez uroku", value: "62 dni" },
        ] },
        savings: { title: "Sporiace ciele", text: "Ciele a automaticke dobijanie.", action: "Vytvorit", items: [
          { title: "Cesta", text: "48% ciela", value: "$480" },
          { title: "Laptop", text: "Zaokruhlenia platieb", value: "$220" },
          { title: "Rezerva", text: "Kazdy tyzden", value: "$140" },
        ] },
      },
      settingsList: [
        { title: "Face ID a PIN", text: "Prihlasenie a potvrdenia" },
        { title: "Limity karty", text: "Online, hotovost a prevody" },
        { title: "Upozornenia", text: "Platby a udalosti" },
      ],
    },
  },
};

const normalizeBankLocale = (lang: string) => (lang in bankCopy ? lang : "en");

const productTargets: ProductScreen[] = ["cashback", "deposits", "credit", "savings"];
const productIcons = [Gift, Landmark, CreditCard, PiggyBank];

type CurrencyItem = {
  code: string;
  name: string;
  symbol: string;
  color: string;
  usd: number;
};

const currencyCatalog: CurrencyItem[] = [
  { code: "USD", name: "US Dollar", symbol: "$", color: "#36d697", usd: 1 },
  { code: "EUR", name: "Euro", symbol: "€", color: "#5b7cff", usd: 1.09 },
  { code: "UAH", name: "Hryvnia", symbol: "₴", color: "#ffb51f", usd: 0.024 },
  { code: "PLN", name: "Zloty", symbol: "zł", color: "#ff7a00", usd: 0.254 },
  { code: "GBP", name: "Pound", symbol: "£", color: "#c15cff", usd: 1.29 },
  { code: "CHF", name: "Franc", symbol: "Fr", color: "#ff3b5f", usd: 1.12 },
  { code: "JPY", name: "Yen", symbol: "¥", color: "#f85d6a", usd: 0.0066 },
  { code: "CNY", name: "Yuan", symbol: "¥", color: "#ff9b2f", usd: 0.139 },
  { code: "TRY", name: "Lira", symbol: "₺", color: "#f04a56", usd: 0.03 },
  { code: "GEL", name: "Lari", symbol: "₾", color: "#67d6ff", usd: 0.368 },
  { code: "KZT", name: "Tenge", symbol: "₸", color: "#3db8ff", usd: 0.0021 },
  { code: "CZK", name: "Koruna", symbol: "Kč", color: "#7b8cff", usd: 0.044 },
  { code: "SEK", name: "Krona", symbol: "kr", color: "#5fe0c4", usd: 0.095 },
  { code: "NOK", name: "Krone", symbol: "kr", color: "#ff6b8a", usd: 0.093 },
  { code: "DKK", name: "Krone", symbol: "kr", color: "#f04d45", usd: 0.146 },
  { code: "CAD", name: "Canadian Dollar", symbol: "$", color: "#ff5263", usd: 0.73 },
  { code: "AUD", name: "Australian Dollar", symbol: "$", color: "#37c8b9", usd: 0.66 },
  { code: "NZD", name: "New Zealand Dollar", symbol: "$", color: "#4aa3ff", usd: 0.61 },
  { code: "AED", name: "Dirham", symbol: "د.إ", color: "#22c55e", usd: 0.272 },
  { code: "ILS", name: "Shekel", symbol: "₪", color: "#50b6ff", usd: 0.276 },
  { code: "INR", name: "Rupee", symbol: "₹", color: "#ff8a00", usd: 0.012 },
  { code: "KRW", name: "Won", symbol: "₩", color: "#8b5cf6", usd: 0.00072 },
  { code: "SGD", name: "Singapore Dollar", symbol: "$", color: "#fb7185", usd: 0.78 },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "$", color: "#f97316", usd: 0.128 },
  { code: "MXN", name: "Peso", symbol: "$", color: "#16a34a", usd: 0.056 },
  { code: "BRL", name: "Real", symbol: "R$", color: "#65a30d", usd: 0.18 },
  { code: "ZAR", name: "Rand", symbol: "R", color: "#facc15", usd: 0.055 },
  { code: "THB", name: "Baht", symbol: "฿", color: "#a855f7", usd: 0.027 },
  { code: "RON", name: "Leu", symbol: "lei", color: "#2563eb", usd: 0.219 },
  { code: "HUF", name: "Forint", symbol: "Ft", color: "#06b6d4", usd: 0.0028 },
];

const currencyByCode = currencyCatalog.reduce<Record<string, CurrencyItem>>((acc, item) => {
  acc[item.code] = item;
  return acc;
}, {});

const getCurrency = (code: string) => currencyByCode[code] ?? currencyCatalog[0];
const getNextCurrency = (code: string) => currencyCatalog.find((item) => item.code !== code)?.code ?? currencyCatalog[0].code;
const getExchangeRate = (from: CurrencyItem, to: CurrencyItem) => from.usd / to.usd;
const formatExchangeRate = (value: number) => {
  if (value >= 100) return value.toFixed(2);
  if (value >= 10) return value.toFixed(2);
  if (value >= 1) return value.toFixed(3);
  return value.toFixed(4);
};
const formatExchangeAmount = (value: number) => value.toLocaleString("en-US", {
  maximumFractionDigits: value >= 100 ? 0 : 2,
});
const getExchangeChange = (from: string, to: string) => {
  const score = `${from}${to}`.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const change = ((score % 19) - 8) / 10;
  return `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
};

const exchangeCopy: Record<string, {
  tab: string;
  title: string;
  subtitle: string;
  from: string;
  to: string;
  rate: string;
  fee: string;
  action: string;
  pairs: Array<{ from: string; to: string; rate: string; change: string }>;
}> = {
  ru: {
    tab: "Обмен",
    title: "Обмен валют",
    subtitle: "Выберите пару, проверьте курс и подтвердите обмен без лишних шагов.",
    from: "Продать",
    to: "Получить",
    rate: "Курс",
    fee: "Комиссия 0%",
    action: "Обмен готов",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  en: {
    tab: "Exchange",
    title: "Currency exchange",
    subtitle: "Pick a pair, check the live rate and confirm the exchange in one flow.",
    from: "Sell",
    to: "Receive",
    rate: "Rate",
    fee: "0% fee",
    action: "Exchange prepared",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  de: {
    tab: "Wechsel",
    title: "Wahrungswechsel",
    subtitle: "Paar auswahlen, Kurs prufen und den Wechsel direkt bestatigen.",
    from: "Verkaufen",
    to: "Erhalten",
    rate: "Kurs",
    fee: "0% Gebuhr",
    action: "Wechsel vorbereitet",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  fr: {
    tab: "Change",
    title: "Change de devises",
    subtitle: "Choisissez une paire, verifiez le taux et confirmez l'echange.",
    from: "Vendre",
    to: "Recevoir",
    rate: "Taux",
    fee: "0% frais",
    action: "Change prepare",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  it: {
    tab: "Cambio",
    title: "Cambio valuta",
    subtitle: "Scegli la coppia, controlla il tasso e conferma lo scambio.",
    from: "Vendi",
    to: "Ricevi",
    rate: "Tasso",
    fee: "0% commissione",
    action: "Cambio pronto",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  pl: {
    tab: "Wymiana",
    title: "Wymiana walut",
    subtitle: "Wybierz pare, sprawdz kurs i potwierdz wymiane.",
    from: "Sprzedaj",
    to: "Otrzymaj",
    rate: "Kurs",
    fee: "0% oplaty",
    action: "Wymiana gotowa",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  cz: {
    tab: "Smena",
    title: "Smena men",
    subtitle: "Vyberte par, zkontrolujte kurz a potvrdte smenu.",
    from: "Prodat",
    to: "Ziskat",
    rate: "Kurz",
    fee: "0% poplatek",
    action: "Smena pripravena",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
  sk: {
    tab: "Vymena",
    title: "Vymena mien",
    subtitle: "Vyberte par, skontrolujte kurz a potvrdte vymenu.",
    from: "Predat",
    to: "Ziskat",
    rate: "Kurz",
    fee: "0% poplatok",
    action: "Vymena pripravena",
    pairs: [
      { from: "USD", to: "EUR", rate: "0.92", change: "+0.4%" },
      { from: "EUR", to: "UAH", rate: "44.20", change: "+0.8%" },
      { from: "USD", to: "PLN", rate: "3.95", change: "-0.2%" },
    ],
  },
};

const financeUiCopy: Record<string, {
  selected: string;
  categories: string;
  merchants: string;
  active: string;
  month: string;
  calculator: string;
  startAmount: string;
  projected: string;
  profit: string;
  schedule: string;
  used: string;
  available: string;
  payment: string;
  dueDate: string;
  goals: string;
  autoSave: string;
  saved: string;
  filters: string;
  all: string;
  income: string;
  expenses: string;
  today: string;
  currency: string;
}> = {
  ru: {
    selected: "Выбрано",
    categories: "Категории",
    merchants: "Партнеры",
    active: "Активно",
    month: "Месяц",
    calculator: "Калькулятор",
    startAmount: "Сумма",
    projected: "Итог",
    profit: "Доход",
    schedule: "График",
    used: "Использовано",
    available: "Доступно",
    payment: "Платеж",
    dueDate: "12 августа",
    goals: "Цели",
    autoSave: "Авто",
    saved: "Собрано",
    filters: "Фильтры",
    all: "Все",
    income: "Доходы",
    expenses: "Расходы",
    today: "Сегодня",
    currency: "Валюта",
  },
  en: {
    selected: "Selected",
    categories: "Categories",
    merchants: "Partners",
    active: "Active",
    month: "Month",
    calculator: "Calculator",
    startAmount: "Amount",
    projected: "Projected",
    profit: "Profit",
    schedule: "Schedule",
    used: "Used",
    available: "Available",
    payment: "Payment",
    dueDate: "August 12",
    goals: "Goals",
    autoSave: "Auto",
    saved: "Saved",
    filters: "Filters",
    all: "All",
    income: "Income",
    expenses: "Expenses",
    today: "Today",
    currency: "Currency",
  },
  de: {
    selected: "Gewahlt",
    categories: "Kategorien",
    merchants: "Partner",
    active: "Aktiv",
    month: "Monat",
    calculator: "Rechner",
    startAmount: "Betrag",
    projected: "Prognose",
    profit: "Gewinn",
    schedule: "Plan",
    used: "Genutzt",
    available: "Verfugbar",
    payment: "Zahlung",
    dueDate: "12. August",
    goals: "Ziele",
    autoSave: "Auto",
    saved: "Gespart",
    filters: "Filter",
    all: "Alle",
    income: "Einnahmen",
    expenses: "Ausgaben",
    today: "Heute",
    currency: "Wahrung",
  },
  fr: {
    selected: "Choisi",
    categories: "Categories",
    merchants: "Partenaires",
    active: "Actif",
    month: "Mois",
    calculator: "Calculateur",
    startAmount: "Montant",
    projected: "Prevu",
    profit: "Gain",
    schedule: "Calendrier",
    used: "Utilise",
    available: "Disponible",
    payment: "Paiement",
    dueDate: "12 aout",
    goals: "Objectifs",
    autoSave: "Auto",
    saved: "Epargne",
    filters: "Filtres",
    all: "Tout",
    income: "Revenus",
    expenses: "Depenses",
    today: "Aujourd'hui",
    currency: "Devise",
  },
  it: {
    selected: "Scelte",
    categories: "Categorie",
    merchants: "Partner",
    active: "Attivo",
    month: "Mese",
    calculator: "Calcolo",
    startAmount: "Importo",
    projected: "Previsto",
    profit: "Profitto",
    schedule: "Scadenze",
    used: "Usato",
    available: "Disponibile",
    payment: "Pagamento",
    dueDate: "12 agosto",
    goals: "Obiettivi",
    autoSave: "Auto",
    saved: "Risparmiato",
    filters: "Filtri",
    all: "Tutti",
    income: "Entrate",
    expenses: "Spese",
    today: "Oggi",
    currency: "Valuta",
  },
  pl: {
    selected: "Wybrane",
    categories: "Kategorie",
    merchants: "Partnerzy",
    active: "Aktywne",
    month: "Miesiac",
    calculator: "Kalkulator",
    startAmount: "Kwota",
    projected: "Prognoza",
    profit: "Zysk",
    schedule: "Plan",
    used: "Wykorzystano",
    available: "Dostepne",
    payment: "Platnosc",
    dueDate: "12 sierpnia",
    goals: "Cele",
    autoSave: "Auto",
    saved: "Zebrano",
    filters: "Filtry",
    all: "Wszystkie",
    income: "Przychody",
    expenses: "Wydatki",
    today: "Dzis",
    currency: "Waluta",
  },
  cz: {
    selected: "Vybrano",
    categories: "Kategorie",
    merchants: "Partneri",
    active: "Aktivni",
    month: "Mesic",
    calculator: "Kalkulator",
    startAmount: "Castka",
    projected: "Odhad",
    profit: "Zisk",
    schedule: "Plan",
    used: "Využito",
    available: "Dostupne",
    payment: "Platba",
    dueDate: "12. srpna",
    goals: "Cile",
    autoSave: "Auto",
    saved: "Nasporeno",
    filters: "Filtry",
    all: "Vse",
    income: "Prijmy",
    expenses: "Vydaje",
    today: "Dnes",
    currency: "Mena",
  },
  sk: {
    selected: "Vybrane",
    categories: "Kategorie",
    merchants: "Partneri",
    active: "Aktivne",
    month: "Mesiac",
    calculator: "Kalkulacka",
    startAmount: "Suma",
    projected: "Odhad",
    profit: "Zisk",
    schedule: "Plan",
    used: "Využité",
    available: "Dostupne",
    payment: "Platba",
    dueDate: "12. augusta",
    goals: "Ciele",
    autoSave: "Auto",
    saved: "Nasetrene",
    filters: "Filtre",
    all: "Vsetko",
    income: "Prijmy",
    expenses: "Vydavky",
    today: "Dnes",
    currency: "Mena",
  },
};

export function FinFlowWalletPreview() {
  const { lang } = useThemeLang();
  const locale = normalizeBankLocale(lang);
  const copy = bankCopy[locale];
  const exchange = exchangeCopy[locale] ?? exchangeCopy.en;
  const ui = financeUiCopy[locale] ?? financeUiCopy.en;
  const [screen, setScreen] = useState<Screen>("home");
  const [homeTab, setHomeTab] = useState<HomeTab>("card");
  const [exchangeFrom, setExchangeFrom] = useState("USD");
  const [exchangeTo, setExchangeTo] = useState("EUR");
  const [exchangeAmount, setExchangeAmount] = useState("1000");
  const [openCurrencyMenu, setOpenCurrencyMenu] = useState<"from" | "to" | null>(null);
  const [isCardBack, setIsCardBack] = useState(false);
  const [balanceHidden, setBalanceHidden] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [cashbackActive, setCashbackActive] = useState([true, true, false]);
  const [depositPlan, setDepositPlan] = useState(0);
  const [creditLimit, setCreditLimit] = useState(3200);
  const [savingsAuto, setSavingsAuto] = useState(true);
  const [securityActive, setSecurityActive] = useState([true, true, false]);
  const currencyPickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 2300);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!openCurrencyMenu) return;

    const closeMenu = (event: PointerEvent) => {
      if (!currencyPickerRef.current?.contains(event.target as Node)) {
        setOpenCurrencyMenu(null);
      }
    };

    window.addEventListener("pointerdown", closeMenu);
    return () => window.removeEventListener("pointerdown", closeMenu);
  }, [openCurrencyMenu]);

  const selectedDetails = screen !== "home" && screen !== "settings" ? copy.phone.details[screen] : null;

  const totalBalance = useMemo(() => (balanceHidden ? "$•••••" : "$12 840.32"), [balanceHidden]);
  const fromCurrency = getCurrency(exchangeFrom);
  const toCurrency = getCurrency(exchangeTo);
  const exchangeRate = getExchangeRate(fromCurrency, toCurrency);
  const exchangeNumericAmount = Math.max(0, Number(exchangeAmount.replace(/\s/g, "").replace(",", ".")) || 0);
  const receivedAmount = exchangeNumericAmount * exchangeRate;
  const exchangeChange = getExchangeChange(exchangeFrom, exchangeTo);
  const popularCurrencies = currencyCatalog.slice(0, 8);

  const showNotice = (message: string) => setNotice(message);

  const updateExchangeFrom = (code: string) => {
    setExchangeFrom(code);
    if (code === exchangeTo) {
      setExchangeTo(getNextCurrency(code));
    }
  };

  const updateExchangeTo = (code: string) => {
    setExchangeTo(code);
    if (code === exchangeFrom) {
      setExchangeFrom(getNextCurrency(code));
    }
  };

  const renderCurrencyPicker = (
    side: "from" | "to",
    selectedCurrency: CurrencyItem,
    blockedCode: string,
    onSelect: (code: string) => void,
  ) => {
    const isOpen = openCurrencyMenu === side;

    return (
      <div className={`finflow-currency-picker finflow-currency-picker--${side} ${isOpen ? "is-open" : ""}`}>
        <button
          type="button"
          className="finflow-currency-select"
          onClick={() => setOpenCurrencyMenu(isOpen ? null : side)}
          aria-expanded={isOpen}
        >
          <span
            className="finflow-currency-logo"
            style={{ "--currency-color": selectedCurrency.color } as CSSProperties}
          >
            {selectedCurrency.symbol}
          </span>
          <span className="finflow-currency-select__text">
            <strong>{selectedCurrency.code}</strong>
            <small>{selectedCurrency.name}</small>
          </span>
          <ChevronDown size={15} />
        </button>

        <div className="finflow-currency-menu">
          {currencyCatalog.map((currency) => {
            const disabled = currency.code === blockedCode;
            return (
              <button
                type="button"
                key={currency.code}
                className={currency.code === selectedCurrency.code ? "is-active" : ""}
                disabled={disabled}
                onClick={() => {
                  if (disabled) return;
                  onSelect(currency.code);
                  setOpenCurrencyMenu(null);
                }}
              >
                <span
                  className="finflow-currency-logo"
                  style={{ "--currency-color": currency.color } as CSSProperties}
                >
                  {currency.symbol}
                </span>
                <span>
                  <strong>{currency.code}</strong>
                  <small>{currency.name}</small>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const toggleCashback = (index: number, message: string) => {
    setCashbackActive((items) => items.map((item, itemIndex) => (itemIndex === index ? !item : item)));
    showNotice(message);
  };

  const toggleSecurity = (index: number, message: string) => {
    setSecurityActive((items) => items.map((item, itemIndex) => (itemIndex === index ? !item : item)));
    showNotice(message);
  };

  const homeTabs = [
    { id: "card" as const, label: copy.phone.balance, icon: <CreditCard size={16} /> },
    { id: "products" as const, label: copy.phone.products, icon: <Wallet size={16} /> },
    { id: "activity" as const, label: copy.phone.activity, icon: <ReceiptText size={16} /> },
    { id: "exchange" as const, label: exchange.tab, icon: <TrendingUp size={16} /> },
  ];

  const renderHome = () => (
    <main className="finflow-screen finflow-screen--home">
      <header className="finflow-topbar">
        <div>
          <span>{copy.phone.greeting}</span>
          <strong>{copy.phone.brand}</strong>
        </div>
        <button type="button" className="finflow-icon-btn" onClick={() => setScreen("settings")} aria-label={copy.phone.settings}>
          <ShieldCheck size={18} />
        </button>
      </header>

      <nav className="finflow-home-tabs" aria-label="FinFlow sections">
        {homeTabs.map((tab) => (
          <button
            type="button"
            key={tab.id}
            className={homeTab === tab.id ? "is-active" : ""}
            onClick={() => setHomeTab(tab.id)}
            aria-label={tab.label}
            title={tab.label}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

      {homeTab === "card" && (
        <div className="finflow-tab-panel">
          <section className="finflow-balance-card">
            <div className="finflow-balance-card__head">
              <span>{copy.phone.balance}</span>
              <button type="button" onClick={() => setBalanceHidden((value) => !value)} aria-label={copy.phone.balance}>
                {balanceHidden ? <Eye size={17} /> : <EyeOff size={17} />}
              </button>
            </div>
            <strong>{totalBalance}</strong>
            <div className="finflow-card-shell">
              <button
                type="button"
                className={`finflow-bank-card ${isCardBack ? "is-flipped" : ""}`}
                onClick={() => {
                  setIsCardBack((value) => !value);
                  showNotice(isCardBack ? copy.phone.front : copy.phone.back);
                }}
              >
                <span className="finflow-card-side finflow-card-side--front">
                  <span className="finflow-card-brand">
                    <img src={finflowMark} alt="" />
                    {copy.phone.cardName}
                  </span>
                  <span className="finflow-card-number">5375  ••••  ••••  8042</span>
                  <span className="finflow-card-row">
                    <span>STANISLAV S.</span>
                    <span>08/30</span>
                  </span>
                </span>
                <span className="finflow-card-side finflow-card-side--back">
                  <span className="finflow-magnetic" />
                  <span className="finflow-cvv">CVV 742</span>
                  <span className="finflow-card-row">
                    <span>{copy.phone.cardStatus}</span>
                    <span>24/7</span>
                  </span>
                </span>
              </button>
            </div>
          </section>

          <div className="finflow-quick-actions">
            <button type="button" onClick={() => showNotice(copy.phone.actions.send)}>
              <Send size={18} />
              <span>{copy.phone.actions.send}</span>
            </button>
            <button type="button" onClick={() => showNotice(copy.phone.actions.topup)}>
              <ArrowDownLeft size={18} />
              <span>{copy.phone.actions.topup}</span>
            </button>
            <button type="button" onClick={() => showNotice(copy.phone.actions.statement)}>
              <ReceiptText size={18} />
              <span>{copy.phone.actions.statement}</span>
            </button>
          </div>
        </div>
      )}

      {homeTab === "products" && (
        <section className="finflow-panel finflow-tab-panel">
          <div className="finflow-section-title">
            <strong>{copy.phone.products}</strong>
            <span>4</span>
          </div>
          <div className="finflow-product-grid">
            {copy.phone.productsList.map((product, index) => {
              const Icon = productIcons[index];
              return (
                <button
                  type="button"
                  className="finflow-product-tile"
                  key={product.title}
                  onClick={() => setScreen(productTargets[index])}
                >
                  <span className={`finflow-product-icon finflow-product-icon--${index + 1}`}>
                    <Icon size={18} />
                  </span>
                  <strong>{product.title}</strong>
                  <small>{product.text}</small>
                  <b>{product.value}</b>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {homeTab === "activity" && (
        <section className="finflow-panel finflow-tab-panel finflow-activity-panel">
          <div className="finflow-section-title">
            <strong>{copy.phone.activity}</strong>
            <SlidersHorizontal size={17} />
          </div>
          <div className="finflow-activity-summary">
            <span>
              <small>{ui.expenses}</small>
              <strong>-$17.30</strong>
            </span>
            <span>
              <small>{ui.income}</small>
              <strong>+$1 240</strong>
            </span>
          </div>
          <div className="finflow-activity-filters" aria-label={ui.filters}>
            {[ui.all, ui.expenses, ui.income].map((filter, index) => (
              <button type="button" key={filter} className={index === 0 ? "is-active" : ""} onClick={() => showNotice(filter)}>
                {filter}
              </button>
            ))}
          </div>
          <div className="finflow-operations finflow-operations--timeline">
            {copy.phone.operations.map((operation, index) => (
              <button type="button" className="finflow-operation" key={operation.title} onClick={() => showNotice(operation.title)}>
                <span className={`finflow-operation__icon finflow-operation__icon--${operation.type}`}>
                  {operation.type === "in" ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </span>
                <span>
                  <strong>{operation.title}</strong>
                  <small>{index === 0 ? ui.today : operation.text}</small>
                </span>
                <b className={operation.type === "in" ? "is-positive" : ""}>{operation.amount}</b>
              </button>
            ))}
          </div>
        </section>
      )}

      {homeTab === "exchange" && (
        <section className="finflow-panel finflow-tab-panel finflow-exchange-panel">
          <div className="finflow-section-title">
            <strong>{exchange.title}</strong>
            <span>{exchange.fee}</span>
          </div>
          <p className="finflow-exchange-lead">{exchange.subtitle}</p>

          <div className="finflow-exchange-card" ref={currencyPickerRef}>
            <div className="finflow-currency-box">
              <span className="finflow-currency-head">
                <span
                  className="finflow-currency-logo"
                  style={{ "--currency-color": fromCurrency.color } as CSSProperties}
                >
                  {fromCurrency.symbol}
                </span>
                <small>{exchange.from}</small>
              </span>
              <span className="finflow-currency-control">
                <input
                  inputMode="decimal"
                  value={exchangeAmount}
                  onChange={(event) => setExchangeAmount(event.target.value.replace(/[^\d.,\s]/g, ""))}
                  aria-label={exchange.from}
                />
                {renderCurrencyPicker("from", fromCurrency, exchangeTo, updateExchangeFrom)}
              </span>
            </div>

            <button
              type="button"
              className="finflow-exchange-swap"
              onClick={() => {
                setExchangeFrom(exchangeTo);
                setExchangeTo(exchangeFrom);
                showNotice(`${exchange.rate}: ${exchangeTo}/${exchangeFrom}`);
              }}
              aria-label={exchange.rate}
            >
              <ArrowDownLeft size={16} />
              <ArrowUpRight size={16} />
            </button>

            <div className="finflow-currency-box">
              <span className="finflow-currency-head">
                <span
                  className="finflow-currency-logo"
                  style={{ "--currency-color": toCurrency.color } as CSSProperties}
                >
                  {toCurrency.symbol}
                </span>
                <small>{exchange.to}</small>
              </span>
              <span className="finflow-currency-control">
                <strong>{formatExchangeAmount(receivedAmount)}</strong>
                {renderCurrencyPicker("to", toCurrency, exchangeFrom, updateExchangeTo)}
              </span>
            </div>
          </div>

          <div className="finflow-exchange-rate-card">
            <span>{exchange.rate} {exchangeFrom}/{exchangeTo}</span>
            <strong>{formatExchangeRate(exchangeRate)}</strong>
            <small>{exchangeChange}</small>
          </div>

          <div className="finflow-currency-quick" aria-label={exchange.rate}>
            {popularCurrencies.map((currency) => (
              <button
                type="button"
                key={currency.code}
                className={exchangeTo === currency.code ? "is-active" : ""}
                onClick={() => updateExchangeTo(currency.code)}
                disabled={currency.code === exchangeFrom}
              >
                <span
                  className="finflow-currency-logo"
                  style={{ "--currency-color": currency.color } as CSSProperties}
                >
                  {currency.symbol}
                </span>
                {currency.code}
              </button>
            ))}
          </div>

          <button type="button" className="finflow-exchange-action" onClick={() => showNotice(`${exchange.action}: ${exchangeFrom}/${exchangeTo}`)}>
            {exchange.action}
          </button>
        </section>
      )}
    </main>
  );

  const renderDetails = () => {
    if (!selectedDetails) return null;
    const activeCashbackCount = cashbackActive.filter(Boolean).length;
    const selectedDeposit = selectedDetails.items[depositPlan] ?? selectedDetails.items[0];
    const depositYield = Number.parseFloat((selectedDeposit?.value ?? "9.8").replace(",", "."));
    const depositBase = [2500, 1800, 3200][depositPlan] ?? 2500;
    const depositProgress = [82, 58, 34][depositPlan] ?? 60;
    const depositProjected = Math.round(depositBase * (1 + depositYield / 100));
    const creditUsed = Math.round(creditLimit * 0.36);
    const creditAvailable = creditLimit - creditUsed;
    const creditProgress = Math.round((creditUsed / creditLimit) * 100);
    const creditPayment = Math.max(36, Math.round(creditLimit * 0.027));
    const savingsProgress = [48, 26, 64];

    return (
      <main className={`finflow-screen finflow-screen--details finflow-screen--${screen}`}>
        <header className="finflow-topbar">
          <button type="button" className="finflow-icon-btn" onClick={() => setScreen("home")} aria-label="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <span>{copy.phone.nav[screen]}</span>
            <strong>{selectedDetails.title}</strong>
          </div>
        </header>

        {screen === "cashback" && (
          <section className="finflow-detail-card finflow-cashback-workspace">
            <div className="finflow-cashback-hero">
              <span>
                <BadgePercent size={15} />
                {ui.month}
              </span>
              <strong>{selectedDetails.title}</strong>
              <p>{selectedDetails.text}</p>
              <b>{activeCashbackCount}/3 {ui.selected}</b>
            </div>
            <div className="finflow-cashback-grid" aria-label={ui.categories}>
              {selectedDetails.items.map((item, index) => (
                <button
                  type="button"
                  className={cashbackActive[index] ? "is-active" : ""}
                  key={item.title}
                  onClick={() => toggleCashback(index, item.title)}
                >
                  <span><ShoppingBag size={16} /></span>
                  <strong>{item.title}</strong>
                  <small>{item.text}</small>
                  <b>{item.value}</b>
                </button>
              ))}
            </div>
            <div className="finflow-cashback-merchants">
              <small>{ui.merchants}</small>
              {["Urban", "Market", "Tech"].map((merchant, index) => (
                <span key={merchant}>
                  <i>{index + 1}</i>
                  {merchant}
                  <b>{selectedDetails.items[index]?.value}</b>
                </span>
              ))}
            </div>
            <button type="button" className="finflow-primary-action" onClick={() => showNotice(selectedDetails.action)}>
              {selectedDetails.action}
            </button>
          </section>
        )}

        {screen === "deposits" && (
          <section className="finflow-detail-card finflow-deposit-workspace">
            <div className="finflow-deposit-dashboard">
              <span>
                <Coins size={15} />
                {ui.calculator}
              </span>
              <strong>{selectedDeposit.title}</strong>
              <p>{selectedDeposit.text}</p>
              <div className="finflow-deposit-numbers">
                <em>
                  <small>{ui.startAmount}</small>
                  <b>${depositBase.toLocaleString("en-US")}</b>
                </em>
                <em>
                  <small>{ui.projected}</small>
                  <b>${depositProjected.toLocaleString("en-US")}</b>
                </em>
                <em>
                  <small>{ui.profit}</small>
                  <b>{selectedDeposit.value}</b>
                </em>
              </div>
              <i className="finflow-deposit-chart" style={{ "--deposit-progress": `${depositProgress}%` } as CSSProperties} />
            </div>
            <div className="finflow-deposit-plan-list" aria-label={ui.schedule}>
              {selectedDetails.items.map((item, index) => (
                <button
                  type="button"
                  className={depositPlan === index ? "is-active" : ""}
                  key={item.title}
                  onClick={() => {
                    setDepositPlan(index);
                    showNotice(item.title);
                  }}
                >
                  <CalendarDays size={15} />
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                  <b>{item.value}</b>
                </button>
              ))}
            </div>
            <button type="button" className="finflow-primary-action" onClick={() => showNotice(selectedDetails.action)}>
              {selectedDetails.action}
            </button>
          </section>
        )}

        {screen === "credit" && (
          <section className="finflow-detail-card finflow-credit-workspace">
            <div className="finflow-credit-dashboard">
              <div>
                <span>
                  <Gauge size={15} />
                  {ui.available}
                </span>
                <strong>${creditAvailable.toLocaleString("en-US")}</strong>
                <small>{selectedDetails.text}</small>
              </div>
              <i style={{ "--credit-progress": `${creditProgress * 3.6}deg` } as CSSProperties}>
                <b>{creditProgress}%</b>
              </i>
            </div>
            <label className="finflow-credit-slider">
              <span>
                <small>{ui.used}</small>
                <b>${creditUsed.toLocaleString("en-US")}</b>
              </span>
              <input
                type="range"
                min="1200"
                max="8200"
                step="200"
                value={creditLimit}
                onChange={(event) => setCreditLimit(Number(event.target.value))}
                aria-label={selectedDetails.title}
              />
            </label>
            <div className="finflow-credit-metrics">
              <span>
                <CircleDollarSign size={15} />
                <small>{ui.payment}</small>
                <b>${creditPayment}</b>
              </span>
              <span>
                <CalendarDays size={15} />
                <small>{ui.dueDate}</small>
                <b>{selectedDetails.items[2]?.value}</b>
              </span>
            </div>
            <div className="finflow-credit-list">
              {selectedDetails.items.map((item, index) => (
                <button type="button" key={item.title} onClick={() => showNotice(item.title)}>
                  <span>0{index + 1}</span>
                  <div>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </div>
                  <b>{index === 0 ? `$${creditLimit.toLocaleString("en-US")}` : item.value}</b>
                </button>
              ))}
            </div>
          </section>
        )}

        {screen === "savings" && (
          <section className="finflow-detail-card finflow-savings-workspace">
            <div className="finflow-savings-control">
              <div>
                <span>{ui.goals}</span>
                <strong>{selectedDetails.title}</strong>
                <p>{selectedDetails.text}</p>
              </div>
              <button
                type="button"
                className={savingsAuto ? "is-active" : ""}
                onClick={() => {
                  setSavingsAuto((value) => !value);
                  showNotice(selectedDetails.action);
                }}
              >
                <Repeat2 size={16} />
                {ui.autoSave}
              </button>
            </div>
            <div className="finflow-saving-goals">
              {selectedDetails.items.map((item, index) => (
                <button type="button" key={item.title} onClick={() => showNotice(item.title)}>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.text}</small>
                  </span>
                  <b>{item.value}</b>
                  <i style={{ "--jar-progress": `${savingsProgress[index] ?? 40}%` } as CSSProperties} />
                  <em>{ui.saved} {savingsProgress[index] ?? 40}%</em>
                </button>
              ))}
            </div>
            <button type="button" className="finflow-primary-action" onClick={() => showNotice(selectedDetails.action)}>
              {selectedDetails.action}
            </button>
          </section>
        )}
      </main>
    );
  };

  const renderSettings = () => (
    <main className="finflow-screen finflow-screen--settings">
      <header className="finflow-topbar">
        <button type="button" className="finflow-icon-btn" onClick={() => setScreen("home")} aria-label="Back">
          <ArrowLeft size={18} />
        </button>
        <div>
          <span>{copy.phone.nav.settings}</span>
          <strong>{copy.phone.settings}</strong>
        </div>
      </header>

      <section className="finflow-security-card">
        <div>
          <LockKeyhole size={22} />
          <span>{copy.phone.cardStatus}</span>
        </div>
        <strong>3D Secure</strong>
        <small>Token Pay • Push OTP • Face ID</small>
      </section>

      <div className="finflow-settings-list">
        {copy.phone.settingsList.map((item, index) => (
          <button
            type="button"
            key={item.title}
            className={securityActive[index] ? "is-active" : ""}
            onClick={() => toggleSecurity(index, item.title)}
          >
            <span>{index === 0 ? <LockKeyhole size={17} /> : index === 1 ? <CreditCard size={17} /> : <Bell size={17} />}</span>
            <div>
              <strong>{item.title}</strong>
              <small>{item.text}</small>
            </div>
            <i />
          </button>
        ))}
      </div>
    </main>
  );

  return (
    <div className="mobile-app-preview mobile-app-preview--finflow">
      <div className="mobile-app-preview__device">
        <div className="app-phone-frame app-phone-frame--finflow">
          <div className="finflow-phone-app">
            {screen === "home" && renderHome()}
            {selectedDetails && renderDetails()}
            {screen === "settings" && renderSettings()}

            <nav className="finflow-bottom-nav" aria-label="FinFlow navigation">
              {(["home", "cashback", "deposits", "credit", "savings"] as Screen[]).map((item) => (
                <button
                  type="button"
                  key={item}
                  className={screen === item ? "is-active" : ""}
                  onClick={() => {
                    setScreen(item);
                    if (item === "home") setHomeTab("card");
                  }}
                >
                  {item === "home" && <Wallet size={18} />}
                  {item === "cashback" && <Gift size={18} />}
                  {item === "deposits" && <Landmark size={18} />}
                  {item === "credit" && <CreditCard size={18} />}
                  {item === "savings" && <PiggyBank size={18} />}
                  <span>{copy.phone.nav[item]}</span>
                </button>
              ))}
            </nav>

            {notice && <div className="finflow-toast">{notice}</div>}
          </div>
        </div>
      </div>

      <div className="mobile-app-preview__copy finflow-preview-copy">
        <span>{copy.previewBadge}</span>
        <h3>{copy.title}</h3>
        <p>{copy.text}</p>
        <div>
          {copy.chips.map((chip) => (
            <small key={chip}>{chip}</small>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FinFlowWalletPreview;
