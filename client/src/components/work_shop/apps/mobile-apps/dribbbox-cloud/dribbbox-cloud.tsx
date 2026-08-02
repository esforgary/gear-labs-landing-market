import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ChevronLeft,
  Cloud,
  Folder,
  Grid2X2,
  HardDrive,
  HelpCircle,
  Languages,
  List,
  LockKeyhole,
  LogOut,
  Menu,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Share2,
  Trash2,
  UserPlus,
  UserRound,
  X,
} from "lucide-react";
import { useThemeLang } from "../../../../../context/ThemeLangContext";
import "./dribbbox-cloud.scss";

const dribbCopy = {
  en: {
    welcomeTo: "Welcome to", intro: "Cloud storage for business and individuals to manage files, folders and team data.", join: "Join for free.", smartId: "Smart Id", signIn: "Sign in", social: "Use Social Login", createAccount: "Create an account",
    homeTitle: "Your Dribbbox", search: "Search Folder", recent: "Recent", newFolder: "New folder", newSubgroup: "New subgroup", folderPlaceholder: "Folder name", create: "Create",
    profileTitle: "My Profile", profileRole: "UI / UX Designer", profileText: "Workspace owner with shared folders, prototypes and brand resources in one place.", myFolders: "My Folders",
    storageTitle: "Storage Details", available: "Available", total: "Total", export: "Export Details",
    settingsTitle: "Settings", addAccount: "Add Account", changePassword: "Change Password", changeLanguage: "Change Language", upgradePlan: "Upgrade Plan", multipleAccount: "Multiple Account", enableSync: "Enable Sync", enable2fa: "Enable 2 Step Verification",
    sharedTitle: "Shared Files", helpTitle: "Help", sharedHeading: "Shared workspace", helpHeading: "Support center", sharedText: "Links, invites and team files will appear here.", helpText: "Short answers and account tips are collected here.",
    home: "Home", profile: "Profile", storage: "Storage", shared: "Shared", stats: "Stats", settings: "Settings", help: "Help", logout: "Logout", version: "Version 2.0.1",
    accountName: "Account name", accountEmail: "Email for a new workspace", add: "Add", currentPassword: "Current password", newPassword: "New password", confirmPassword: "Confirm password", savePassword: "Save password",
    planBasic: "Basic", planPro: "Pro", planTeam: "Team", choosePlan: "Choose plan", activeAccount: "Active account", connectAccount: "Connect account",
    copyKicker: "Mobile app", copyTitle: "Dribbbox Cloud", copyDesc: "Mobile cloud storage mockup: smooth authorization, folder list, grid/list views, color groups, profile, settings, and storage chart.", features: ["Smooth onboarding", "Grid and list folders", "7 color groups", "Live storage chart"],
  },
  ru: {
    welcomeTo: "Добро пожаловать в", intro: "Облачное хранилище для бизнеса и личных файлов: папки, команды и данные в одном месте.", join: "Присоединяйтесь бесплатно.", smartId: "Smart ID", signIn: "Войти", social: "Вход через соцсети", createAccount: "Создать аккаунт",
    homeTitle: "Ваш Dribbbox", search: "Поиск папки", recent: "Недавние", newFolder: "Новая папка", newSubgroup: "Новая подгруппа", folderPlaceholder: "Название папки", create: "Создать",
    profileTitle: "Профиль", profileRole: "UI / UX дизайнер", profileText: "Владелец пространства с общими папками, прототипами и бренд-ресурсами.", myFolders: "Мои папки",
    storageTitle: "Хранилище", available: "Свободно", total: "Всего", export: "Экспорт деталей",
    settingsTitle: "Настройки", addAccount: "Добавить аккаунт", changePassword: "Сменить пароль", changeLanguage: "Сменить язык", upgradePlan: "Улучшить тариф", multipleAccount: "Несколько аккаунтов", enableSync: "Включить синхронизацию", enable2fa: "Включить 2FA",
    sharedTitle: "Общие файлы", helpTitle: "Помощь", sharedHeading: "Общее пространство", helpHeading: "Центр помощи", sharedText: "Здесь появятся ссылки, приглашения и командные файлы.", helpText: "Короткие ответы и подсказки по аккаунту собраны здесь.",
    home: "Главная", profile: "Профиль", storage: "Хранилище", shared: "Общие", stats: "Статистика", settings: "Настройки", help: "Помощь", logout: "Выйти", version: "Версия 2.0.1",
    accountName: "Имя аккаунта", accountEmail: "Email для нового пространства", add: "Добавить", currentPassword: "Текущий пароль", newPassword: "Новый пароль", confirmPassword: "Повторите пароль", savePassword: "Сохранить",
    planBasic: "Базовый", planPro: "Про", planTeam: "Команда", choosePlan: "Выбрать тариф", activeAccount: "Активный аккаунт", connectAccount: "Подключить аккаунт",
    copyKicker: "Мобильное приложение", copyTitle: "Dribbbox Cloud", copyDesc: "Мобильный макет облачного хранилища: плавная авторизация, папки, сетка/список, цветовые группы, профиль, настройки и диаграмма заполнения.", features: ["Плавный onboarding", "Папки: сетка и список", "7 цветовых групп", "Живая диаграмма"],
  },
  de: {
    welcomeTo: "Willkommen bei", intro: "Cloud-Speicher fur Teams, Dateien, Ordner und gemeinsame Projektdaten.", join: "Kostenlos starten.", smartId: "Smart ID", signIn: "Einloggen", social: "Social Login", createAccount: "Konto erstellen",
    homeTitle: "Dein Dribbbox", search: "Ordner suchen", recent: "Aktuell", newFolder: "Neuer Ordner", newSubgroup: "Neue Gruppe", folderPlaceholder: "Ordnername", create: "Erstellen",
    profileTitle: "Mein Profil", profileRole: "UI / UX Designer", profileText: "Workspace mit geteilten Ordnern, Prototypen und Markenmaterialien.", myFolders: "Meine Ordner",
    storageTitle: "Speicher", available: "Verfugbar", total: "Gesamt", export: "Details exportieren",
    settingsTitle: "Einstellungen", addAccount: "Konto hinzufugen", changePassword: "Passwort andern", changeLanguage: "Sprache andern", upgradePlan: "Tarif upgraden", multipleAccount: "Mehrere Konten", enableSync: "Sync aktivieren", enable2fa: "2FA aktivieren",
    sharedTitle: "Geteilte Dateien", helpTitle: "Hilfe", sharedHeading: "Geteilter Bereich", helpHeading: "Support Center", sharedText: "Links, Einladungen und Teamdateien erscheinen hier.", helpText: "Kurze Antworten und Konto-Tipps sind hier gesammelt.",
    home: "Start", profile: "Profil", storage: "Speicher", shared: "Geteilt", stats: "Statistik", settings: "Einstellungen", help: "Hilfe", logout: "Abmelden", version: "Version 2.0.1",
    accountName: "Kontoname", accountEmail: "E-Mail fur Workspace", add: "Hinzufugen", currentPassword: "Aktuelles Passwort", newPassword: "Neues Passwort", confirmPassword: "Passwort bestatigen", savePassword: "Speichern",
    planBasic: "Basic", planPro: "Pro", planTeam: "Team", choosePlan: "Tarif wahlen", activeAccount: "Aktives Konto", connectAccount: "Konto verbinden",
    copyKicker: "Mobile App", copyTitle: "Dribbbox Cloud", copyDesc: "Mobiles Cloud-Speicher-Mockup mit Login, Ordnern, Grid/List, Farbgruppen, Profil, Einstellungen und Speicherdiagramm.", features: ["Sanfter Einstieg", "Grid und Liste", "7 Farbgruppen", "Live-Speicherdiagramm"],
  },
  fr: {
    welcomeTo: "Bienvenue sur", intro: "Stockage cloud pour gerer fichiers, dossiers et donnees d'equipe.", join: "Inscription gratuite.", smartId: "Smart ID", signIn: "Connexion", social: "Connexion sociale", createAccount: "Creer un compte",
    homeTitle: "Votre Dribbbox", search: "Rechercher un dossier", recent: "Recent", newFolder: "Nouveau dossier", newSubgroup: "Nouveau groupe", folderPlaceholder: "Nom du dossier", create: "Creer",
    profileTitle: "Mon profil", profileRole: "Designer UI / UX", profileText: "Espace avec dossiers partages, prototypes et ressources de marque.", myFolders: "Mes dossiers",
    storageTitle: "Stockage", available: "Disponible", total: "Total", export: "Exporter",
    settingsTitle: "Parametres", addAccount: "Ajouter un compte", changePassword: "Changer le mot de passe", changeLanguage: "Changer la langue", upgradePlan: "Ameliorer l'abonnement", multipleAccount: "Comptes multiples", enableSync: "Activer la sync", enable2fa: "Activer 2FA",
    sharedTitle: "Fichiers partages", helpTitle: "Aide", sharedHeading: "Espace partage", helpHeading: "Centre d'aide", sharedText: "Liens, invitations et fichiers d'equipe apparaitront ici.", helpText: "Reponses courtes et conseils de compte sont ici.",
    home: "Accueil", profile: "Profil", storage: "Stockage", shared: "Partage", stats: "Stats", settings: "Parametres", help: "Aide", logout: "Deconnexion", version: "Version 2.0.1",
    accountName: "Nom du compte", accountEmail: "Email du nouvel espace", add: "Ajouter", currentPassword: "Mot de passe actuel", newPassword: "Nouveau mot de passe", confirmPassword: "Confirmer le mot de passe", savePassword: "Enregistrer",
    planBasic: "Basic", planPro: "Pro", planTeam: "Equipe", choosePlan: "Choisir", activeAccount: "Compte actif", connectAccount: "Connecter un compte",
    copyKicker: "Application mobile", copyTitle: "Dribbbox Cloud", copyDesc: "Maquette mobile de stockage cloud avec connexion fluide, dossiers, grille/liste, groupes colores, profil, parametres et graphique.", features: ["Onboarding fluide", "Grille et liste", "7 groupes couleurs", "Graphique vivant"],
  },
  it: {
    welcomeTo: "Benvenuto in", intro: "Archivio cloud per gestire file, cartelle e dati del team.", join: "Inizia gratis.", smartId: "Smart ID", signIn: "Accedi", social: "Accesso social", createAccount: "Crea account",
    homeTitle: "Il tuo Dribbbox", search: "Cerca cartella", recent: "Recenti", newFolder: "Nuova cartella", newSubgroup: "Nuovo gruppo", folderPlaceholder: "Nome cartella", create: "Crea",
    profileTitle: "Profilo", profileRole: "UI / UX Designer", profileText: "Spazio con cartelle condivise, prototipi e materiali del brand.", myFolders: "Le mie cartelle",
    storageTitle: "Archivio", available: "Disponibile", total: "Totale", export: "Esporta dettagli",
    settingsTitle: "Impostazioni", addAccount: "Aggiungi account", changePassword: "Cambia password", changeLanguage: "Cambia lingua", upgradePlan: "Aggiorna piano", multipleAccount: "Account multipli", enableSync: "Attiva sync", enable2fa: "Attiva 2FA",
    sharedTitle: "File condivisi", helpTitle: "Aiuto", sharedHeading: "Spazio condiviso", helpHeading: "Centro aiuto", sharedText: "Link, inviti e file del team appariranno qui.", helpText: "Risposte rapide e consigli account sono qui.",
    home: "Home", profile: "Profilo", storage: "Archivio", shared: "Condivisi", stats: "Statistiche", settings: "Impostazioni", help: "Aiuto", logout: "Esci", version: "Versione 2.0.1",
    accountName: "Nome account", accountEmail: "Email spazio", add: "Aggiungi", currentPassword: "Password attuale", newPassword: "Nuova password", confirmPassword: "Conferma password", savePassword: "Salva",
    planBasic: "Basic", planPro: "Pro", planTeam: "Team", choosePlan: "Scegli piano", activeAccount: "Account attivo", connectAccount: "Collega account",
    copyKicker: "App mobile", copyTitle: "Dribbbox Cloud", copyDesc: "Mockup cloud mobile con login fluido, cartelle, griglia/lista, gruppi colore, profilo, impostazioni e grafico.", features: ["Onboarding fluido", "Griglia e lista", "7 gruppi colore", "Grafico live"],
  },
  pl: {
    welcomeTo: "Witaj w", intro: "Chmura do zarzadzania plikami, folderami i danymi zespolu.", join: "Dolacz za darmo.", smartId: "Smart ID", signIn: "Zaloguj", social: "Logowanie social", createAccount: "Utworz konto",
    homeTitle: "Twoj Dribbbox", search: "Szukaj folderu", recent: "Ostatnie", newFolder: "Nowy folder", newSubgroup: "Nowa grupa", folderPlaceholder: "Nazwa folderu", create: "Utworz",
    profileTitle: "Profil", profileRole: "UI / UX Designer", profileText: "Obszar z folderami, prototypami i zasobami marki.", myFolders: "Moje foldery",
    storageTitle: "Pamiec", available: "Dostepne", total: "Razem", export: "Eksport",
    settingsTitle: "Ustawienia", addAccount: "Dodaj konto", changePassword: "Zmien haslo", changeLanguage: "Zmien jezyk", upgradePlan: "Zmien plan", multipleAccount: "Wiele kont", enableSync: "Wlacz sync", enable2fa: "Wlacz 2FA",
    sharedTitle: "Udostepnione", helpTitle: "Pomoc", sharedHeading: "Wspolna przestrzen", helpHeading: "Centrum pomocy", sharedText: "Linki, zaproszenia i pliki zespolu pojawia sie tutaj.", helpText: "Krotkie odpowiedzi i porady sa tutaj.",
    home: "Start", profile: "Profil", storage: "Pamiec", shared: "Wspolne", stats: "Statystyki", settings: "Ustawienia", help: "Pomoc", logout: "Wyloguj", version: "Wersja 2.0.1",
    accountName: "Nazwa konta", accountEmail: "Email obszaru", add: "Dodaj", currentPassword: "Obecne haslo", newPassword: "Nowe haslo", confirmPassword: "Potwierdz haslo", savePassword: "Zapisz",
    planBasic: "Basic", planPro: "Pro", planTeam: "Team", choosePlan: "Wybierz plan", activeAccount: "Aktywne konto", connectAccount: "Polacz konto",
    copyKicker: "Aplikacja mobilna", copyTitle: "Dribbbox Cloud", copyDesc: "Mobilny mockup chmury: logowanie, foldery, siatka/lista, grupy kolorow, profil, ustawienia i wykres.", features: ["Plynny onboarding", "Siatka i lista", "7 grup kolorow", "Wykres live"],
  },
  cz: {
    welcomeTo: "Vitejte v", intro: "Cloud pro spravu souboru, slozek a tymovych dat.", join: "Zacnete zdarma.", smartId: "Smart ID", signIn: "Prihlasit", social: "Social login", createAccount: "Vytvorit ucet",
    homeTitle: "Vas Dribbbox", search: "Hledat slozku", recent: "Nedavne", newFolder: "Nova slozka", newSubgroup: "Nova skupina", folderPlaceholder: "Nazev slozky", create: "Vytvorit",
    profileTitle: "Profil", profileRole: "UI / UX Designer", profileText: "Pracovni prostor se sdilenymi slozkami, prototypy a brand zdroji.", myFolders: "Moje slozky",
    storageTitle: "Uloziste", available: "Dostupne", total: "Celkem", export: "Export detailu",
    settingsTitle: "Nastaveni", addAccount: "Pridat ucet", changePassword: "Zmenit heslo", changeLanguage: "Zmenit jazyk", upgradePlan: "Zlepsit tarif", multipleAccount: "Vice uctu", enableSync: "Zapnout sync", enable2fa: "Zapnout 2FA",
    sharedTitle: "Sdilene soubory", helpTitle: "Pomoc", sharedHeading: "Sdileny prostor", helpHeading: "Centrum pomoci", sharedText: "Odkazy, pozvanky a tymove soubory budou zde.", helpText: "Kratke odpovedi a tipy k uctu jsou zde.",
    home: "Domu", profile: "Profil", storage: "Uloziste", shared: "Sdilene", stats: "Statistiky", settings: "Nastaveni", help: "Pomoc", logout: "Odhlasit", version: "Verze 2.0.1",
    accountName: "Nazev uctu", accountEmail: "Email prostoru", add: "Pridat", currentPassword: "Aktualni heslo", newPassword: "Nove heslo", confirmPassword: "Potvrdit heslo", savePassword: "Ulozit",
    planBasic: "Basic", planPro: "Pro", planTeam: "Tym", choosePlan: "Vybrat tarif", activeAccount: "Aktivni ucet", connectAccount: "Pripojit ucet",
    copyKicker: "Mobilni aplikace", copyTitle: "Dribbbox Cloud", copyDesc: "Mobilni cloudovy mockup s loginem, slozkami, mrizkou/seznamem, barvami, profilem, nastavenim a grafem.", features: ["Plynuly onboarding", "Mrizka a seznam", "7 barevnych skupin", "Zivy graf"],
  },
  sk: {
    welcomeTo: "Vitajte v", intro: "Cloud na spravu suborov, priecinkov a timovych dat.", join: "Zacnite zdarma.", smartId: "Smart ID", signIn: "Prihlasit", social: "Social login", createAccount: "Vytvorit ucet",
    homeTitle: "Vas Dribbbox", search: "Hladat priecinok", recent: "Nedavne", newFolder: "Novy priecinok", newSubgroup: "Nova skupina", folderPlaceholder: "Nazov priecinka", create: "Vytvorit",
    profileTitle: "Profil", profileRole: "UI / UX Designer", profileText: "Pracovny priestor so zdielanymi priecinkami, prototypmi a brand zdrojmi.", myFolders: "Moje priecinky",
    storageTitle: "Ulozisko", available: "Dostupne", total: "Spolu", export: "Export detailov",
    settingsTitle: "Nastavenia", addAccount: "Pridat ucet", changePassword: "Zmenit heslo", changeLanguage: "Zmenit jazyk", upgradePlan: "Zlepsit plan", multipleAccount: "Viac uctov", enableSync: "Zapnut sync", enable2fa: "Zapnut 2FA",
    sharedTitle: "Zdielane subory", helpTitle: "Pomoc", sharedHeading: "Zdielany priestor", helpHeading: "Centrum pomoci", sharedText: "Odkazy, pozvanky a timove subory budu tu.", helpText: "Kratke odpovede a tipy k uctu su tu.",
    home: "Domov", profile: "Profil", storage: "Ulozisko", shared: "Zdielane", stats: "Statistiky", settings: "Nastavenia", help: "Pomoc", logout: "Odhlasit", version: "Verzia 2.0.1",
    accountName: "Nazov uctu", accountEmail: "Email priestoru", add: "Pridat", currentPassword: "Aktualne heslo", newPassword: "Nove heslo", confirmPassword: "Potvrdit heslo", savePassword: "Ulozit",
    planBasic: "Basic", planPro: "Pro", planTeam: "Tim", choosePlan: "Vybrat plan", activeAccount: "Aktivny ucet", connectAccount: "Pripojit ucet",
    copyKicker: "Mobilna aplikacia", copyTitle: "Dribbbox Cloud", copyDesc: "Mobilny cloudovy mockup s loginom, priecinkami, mriezkou/zoznamom, farbami, profilom, nastaveniami a grafom.", features: ["Plynuly onboarding", "Mriezka a zoznam", "7 farebnych skupin", "Zivy graf"],
  },
} as const;

type DribbLocale = keyof typeof dribbCopy;
type DribbSettingsDetail = "account" | "password" | "upgrade" | "multiple" | null;

const normalizeDribbLocale = (lang: string): DribbLocale =>
  lang in dribbCopy ? (lang as DribbLocale) : "en";

const dribbLanguageOptions: Array<{ code: DribbLocale; label: string }> = [
  { code: "en", label: "English" },
  { code: "ru", label: "Русский" },
  { code: "de", label: "Deutsch" },
  { code: "fr", label: "Francais" },
  { code: "it", label: "Italiano" },
  { code: "pl", label: "Polski" },
  { code: "cz", label: "Cesky" },
  { code: "sk", label: "Slovensky" },
];

const dribbDefaultFolderNames: Record<DribbLocale, string[]> = {
  en: ["Mobile Apps", "SVG Icons", "Prototypes", "Avatars", "Design", "Portfolio", "References", "Clients"],
  ru: ["Мобильные приложения", "SVG иконки", "Прототипы", "Аватары", "Дизайн", "Портфолио", "Референсы", "Клиенты"],
  de: ["Mobile Apps", "SVG Icons", "Prototypen", "Avatare", "Design", "Portfolio", "Referenzen", "Kunden"],
  fr: ["Apps mobiles", "Icones SVG", "Prototypes", "Avatars", "Design", "Portfolio", "References", "Clients"],
  it: ["App mobili", "Icone SVG", "Prototipi", "Avatar", "Design", "Portfolio", "Riferimenti", "Clienti"],
  pl: ["Aplikacje mobilne", "Ikony SVG", "Prototypy", "Awatary", "Design", "Portfolio", "Referencje", "Klienci"],
  cz: ["Mobilni aplikace", "SVG ikony", "Prototypy", "Avatary", "Design", "Portfolio", "Reference", "Klienti"],
  sk: ["Mobilne aplikacie", "SVG ikony", "Prototypy", "Avatary", "Dizajn", "Portfolio", "Referencie", "Klienti"],
};

const dribbFolderColors = [
  { id: "blue", label: "Blue", hex: "#5f7df3", bg: "#eaf1ff" },
  { id: "yellow", label: "Yellow", hex: "#ffc83d", bg: "#fff6d9" },
  { id: "red", label: "Red", hex: "#f45757", bg: "#ffe8e8" },
  { id: "cyan", label: "Cyan", hex: "#2fc8c8", bg: "#e2fbfb" },
  { id: "purple", label: "Purple", hex: "#7c5cff", bg: "#efeaff" },
  { id: "green", label: "Green", hex: "#36c76b", bg: "#e8faef" },
  { id: "orange", label: "Orange", hex: "#ff8a3d", bg: "#fff0e5" },
] as const;

type DribbFolderColor = (typeof dribbFolderColors)[number]["id"];
type DribbScreen = "welcome" | "home" | "profile" | "storage" | "settings" | "shared" | "help";
type DribbViewMode = "grid" | "list";

const dribbStorageLabels: Record<DribbLocale, Record<DribbFolderColor, string>> = {
  en: { blue: "Blue files", yellow: "Yellow files", red: "Red files", cyan: "Cyan files", purple: "Purple files", green: "Green files", orange: "Orange files" },
  ru: { blue: "Синие файлы", yellow: "Желтые файлы", red: "Красные файлы", cyan: "Бирюзовые файлы", purple: "Фиолетовые файлы", green: "Зеленые файлы", orange: "Оранжевые файлы" },
  de: { blue: "Blaue Dateien", yellow: "Gelbe Dateien", red: "Rote Dateien", cyan: "Cyan-Dateien", purple: "Violette Dateien", green: "Grune Dateien", orange: "Orange Dateien" },
  fr: { blue: "Fichiers bleus", yellow: "Fichiers jaunes", red: "Fichiers rouges", cyan: "Fichiers cyan", purple: "Fichiers violets", green: "Fichiers verts", orange: "Fichiers orange" },
  it: { blue: "File blu", yellow: "File gialli", red: "File rossi", cyan: "File ciano", purple: "File viola", green: "File verdi", orange: "File arancioni" },
  pl: { blue: "Pliki niebieskie", yellow: "Pliki zolte", red: "Pliki czerwone", cyan: "Pliki cyan", purple: "Pliki fioletowe", green: "Pliki zielone", orange: "Pliki pomaranczowe" },
  cz: { blue: "Modre soubory", yellow: "Zlute soubory", red: "Cervene soubory", cyan: "Tyrkysove soubory", purple: "Fialove soubory", green: "Zelene soubory", orange: "Oranzove soubory" },
  sk: { blue: "Modre subory", yellow: "Zlte subory", red: "Cervene subory", cyan: "Tyrkysove subory", purple: "Fialove subory", green: "Zelene subory", orange: "Oranzove subory" },
};

interface DribbFolderItem {
  id: number;
  name: string;
  date: string;
  color: DribbFolderColor;
  usage: number;
}

const dribbDefaultFolders: DribbFolderItem[] = [
  { id: 1, name: "Mobile Apps", date: "20.12.2026", color: "blue", usage: 12.6 },
  { id: 2, name: "SVG Icons", date: "18.12.2026", color: "yellow", usage: 8.4 },
  { id: 3, name: "Prototypes", date: "22.11.2026", color: "red", usage: 15.9 },
  { id: 4, name: "Avatars", date: "10.11.2026", color: "cyan", usage: 6.8 },
  { id: 5, name: "Design", date: "20.12.2026", color: "blue", usage: 18.2 },
  { id: 6, name: "Portfolio", date: "14.12.2026", color: "yellow", usage: 9.1 },
  { id: 7, name: "References", date: "22.11.2026", color: "red", usage: 5.3 },
  { id: 8, name: "Clients", date: "10.11.2026", color: "cyan", usage: 11.4 },
];

const dribbFolderNames = ["Brand Assets", "Invoices", "Presentations", "Backups", "Motion", "Shared Docs", "Launch Kit"];

const getDribbColor = (colorId: DribbFolderColor) =>
  dribbFolderColors.find((color) => color.id === colorId) ?? dribbFolderColors[0];

const getRandomDribbUsage = () => Math.round((Math.random() * 18 + 4) * 10) / 10;

const DribbFolderCard = ({
  folder,
  displayName,
  view,
  onDelete,
}: {
  folder: DribbFolderItem;
  displayName: string;
  view: DribbViewMode;
  onDelete: (id: number) => void;
}) => {
  const palette = getDribbColor(folder.color);

  return (
    <article
      className={`dribb-folder-card dribb-folder-card--${view}`}
      style={{ ["--folder" as string]: palette.hex, ["--folder-bg" as string]: palette.bg }}
    >
      <span className="dribb-folder-card__icon">
        <Folder size={20} fill="currentColor" />
      </span>
      <div>
        <strong>{displayName}</strong>
        <small>{folder.date}</small>
      </div>
      <button type="button" onClick={() => onDelete(folder.id)} aria-label={`Delete ${displayName}`}>
        <Trash2 size={13} />
      </button>
    </article>
  );
};

const DribbViewToggle = ({
  view,
  onChange,
}: {
  view: DribbViewMode;
  onChange: (view: DribbViewMode) => void;
}) => (
  <div className="dribb-view-toggle" aria-label="View mode">
    <button className={view === "list" ? "is-active" : ""} type="button" onClick={() => onChange("list")}>
      <List size={15} />
    </button>
    <button className={view === "grid" ? "is-active" : ""} type="button" onClick={() => onChange("grid")}>
      <Grid2X2 size={15} />
    </button>
  </div>
);

export const DribbboxAppPreview = () => {
  const { lang } = useThemeLang();
  const [screen, setScreen] = useState<DribbScreen>("welcome");
  const [navOpen, setNavOpen] = useState(false);
  const [folders, setFolders] = useState<DribbFolderItem[]>(dribbDefaultFolders);
  const [homeView, setHomeView] = useState<DribbViewMode>("grid");
  const [profileView, setProfileView] = useState<DribbViewMode>("grid");
  const [addTarget, setAddTarget] = useState<"home" | "profile" | null>(null);
  const [selectedColor, setSelectedColor] = useState<DribbFolderColor>("blue");
  const [newFolderName, setNewFolderName] = useState("");
  const [language, setLanguage] = useState<DribbLocale>(() => normalizeDribbLocale(lang));
  const [settingsDetail, setSettingsDetail] = useState<DribbSettingsDetail>(null);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);
  const nextFolderId = useRef(20);
  const nextFolderName = useRef(0);
  const copy = dribbCopy[language];
  const folderNameSet = dribbDefaultFolderNames[language] ?? dribbDefaultFolderNames.en;
  const storageLabels = dribbStorageLabels[language] ?? dribbStorageLabels.en;

  useEffect(() => {
    setLanguage(normalizeDribbLocale(lang));
  }, [lang]);

  const openScreen = (nextScreen: DribbScreen) => {
    setScreen(nextScreen);
    setNavOpen(false);
    setAddTarget(null);
    setSettingsDetail(null);
  };

  const addFolder = () => {
    const fallbackName = dribbFolderNames[nextFolderName.current % dribbFolderNames.length];
    nextFolderName.current += 1;
    nextFolderId.current += 1;

    setFolders((current) => [
      ...current,
      {
        id: nextFolderId.current,
        name: newFolderName.trim() || fallbackName,
        date: "12.06.2026",
        color: selectedColor,
        usage: getRandomDribbUsage(),
      },
    ]);
    setNewFolderName("");
    setAddTarget(null);
  };

  const deleteFolder = (id: number) => {
    setFolders((current) => current.filter((folder) => folder.id !== id));
  };

  const usageByColor = useMemo(
    () =>
      dribbFolderColors
        .map((color) => ({
          ...color,
          usage: folders
            .filter((folder) => folder.color === color.id)
            .reduce((total, folder) => total + folder.usage, 0),
        }))
        .filter((color) => color.usage > 0),
    [folders]
  );

  const totalUsed = Math.min(
    118,
    Math.round(usageByColor.reduce((total, color) => total + color.usage, 0) * 10) / 10
  );
  const totalStorage = 128;
  const available = Math.max(0, totalStorage - totalUsed);
  let donutCursor = 0;
  const donutSegments = usageByColor
    .map((color) => {
      const start = donutCursor;
      const end = Math.min(100, start + (color.usage / totalStorage) * 100);
      donutCursor = end;
      return `${color.hex} ${start}% ${end}%`;
    })
    .concat(`#eef3fb ${donutCursor}% 100%`)
    .join(", ");

  const foldersClass = (view: DribbViewMode) => `dribb-folder-grid dribb-folder-grid--${view}`;

  const renderFolderList = (view: DribbViewMode) => (
    <div className={foldersClass(view)}>
      {folders.map((folder) => {
        const defaultIndex = dribbDefaultFolders.findIndex((item) => item.id === folder.id && item.name === folder.name);
        const displayName = defaultIndex >= 0 ? folderNameSet[defaultIndex] ?? folder.name : folder.name;

        return (
          <DribbFolderCard
            key={folder.id}
            folder={folder}
            displayName={displayName}
            view={view}
            onDelete={deleteFolder}
          />
        );
      })}
    </div>
  );

  const renderTopBar = (title: string, right?: ReactNode) => (
    <header className="dribb-screen-top">
      <button type="button" onClick={() => openScreen("home")} aria-label="Back">
        <ChevronLeft size={17} />
      </button>
      <strong>{title}</strong>
      {right ?? (
        <button type="button" aria-label="More">
          <MoreVertical size={17} />
        </button>
      )}
    </header>
  );

  const renderAddSheet = () =>
    addTarget && (
      <div className="dribb-add-sheet" onClick={(event) => event.stopPropagation()}>
        <strong>{addTarget === "profile" ? copy.newSubgroup : copy.newFolder}</strong>
        <input value={newFolderName} onChange={(event) => setNewFolderName(event.target.value)} placeholder={copy.folderPlaceholder} />
        <div className="dribb-color-choice">
          {dribbFolderColors.map((color) => (
            <button
              key={color.id}
              className={selectedColor === color.id ? "is-active" : ""}
              type="button"
              onClick={() => setSelectedColor(color.id)}
              style={{ ["--folder" as string]: color.hex, ["--folder-bg" as string]: color.bg }}
              aria-label={color.label}
            />
          ))}
        </div>
        <button className="dribb-primary-action" type="button" onClick={addFolder}>
          {copy.create}
        </button>
      </div>
    );

  return (
    <div className="mobile-app-preview mobile-app-preview--dribbbox">
      <div className="mobile-app-preview__phone-wrap">
        <div className="app-phone-frame app-phone-frame--dribbbox">
          <div
            className={`dribb-phone-app dribb-phone-app--${screen} ${navOpen ? "is-menu-open" : ""}`}
            onClick={() => {
              setNavOpen(false);
              setAddTarget(null);
            }}
          >
            <div className="dribb-phone-app__notch" />

            {screen === "welcome" && (
              <section className="dribb-welcome">
                <div className="dribb-clouds" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="dribb-hero-art dribb-seq" style={{ ["--delay" as string]: "80ms" }}>
                  <Cloud size={66} fill="currentColor" />
                  <i />
                  <b />
                  <em />
                </div>
                <span className="dribb-seq" style={{ ["--delay" as string]: "180ms" }}>
                  {copy.welcomeTo}
                </span>
                <h3 className="dribb-seq" style={{ ["--delay" as string]: "260ms" }}>
                  Dribbbox
                </h3>
                <p className="dribb-seq" style={{ ["--delay" as string]: "360ms" }}>
                  {copy.intro}
                </p>
                <small className="dribb-seq" style={{ ["--delay" as string]: "460ms" }}>
                  {copy.join}
                </small>
                <div className="dribb-auth-actions dribb-seq" style={{ ["--delay" as string]: "560ms" }}>
                  <button type="button">
                    <LockKeyhole size={15} />
                    {copy.smartId}
                  </button>
                  <button className="is-primary" type="button" onClick={() => openScreen("home")}>
                    {copy.signIn} <ArrowUpRight size={14} />
                  </button>
                </div>
                <div className="dribb-socials dribb-seq" style={{ ["--delay" as string]: "680ms" }}>
                  <span>{copy.social}</span>
                  <div>
                    <button type="button">IG</button>
                    <button type="button">TW</button>
                    <button type="button">FB</button>
                  </div>
                </div>
                <button className="dribb-create-account dribb-seq" style={{ ["--delay" as string]: "780ms" }} type="button">
                  {copy.createAccount}
                </button>
              </section>
            )}

            {screen === "home" && (
              <section className="dribb-screen dribb-home">
                <header className="dribb-home__header">
                  <h3>{copy.homeTitle}</h3>
                  <button type="button" onClick={(event) => { event.stopPropagation(); setNavOpen(true); }} aria-label="Open menu">
                    <Menu size={19} />
                  </button>
                </header>
                <label className="dribb-search">
                  <Search size={15} />
                  <input placeholder={copy.search} />
                </label>
                <div className="dribb-section-head">
                  <span>{copy.recent}</span>
                  <DribbViewToggle view={homeView} onChange={setHomeView} />
                </div>
                {renderFolderList(homeView)}
              </section>
            )}

            {screen === "profile" && (
              <section className="dribb-screen dribb-profile">
                {renderTopBar(copy.profileTitle)}
                <div className="dribb-profile-card">
                  <span className="dribb-avatar">N</span>
                  <em>PRO</em>
                  <strong>Neelesh Chaudhary</strong>
                  <small>{copy.profileRole}</small>
                  <p>{copy.profileText}</p>
                </div>
                <div className="dribb-section-head">
                  <span>{copy.myFolders}</span>
                  <div>
                    <button type="button" onClick={(event) => { event.stopPropagation(); setAddTarget("profile"); }} aria-label="Add subgroup">
                      <Plus size={15} />
                    </button>
                    <DribbViewToggle view={profileView} onChange={setProfileView} />
                  </div>
                </div>
                {renderFolderList(profileView)}
                <div className="dribb-upload-row">
                  <span>W</span>
                  <div>
                    <strong>Projects.docx</strong>
                    <small>22.11.2026</small>
                  </div>
                  <em>300kb</em>
                </div>
              </section>
            )}

            {screen === "storage" && (
              <section className="dribb-screen dribb-storage">
                {renderTopBar(copy.storageTitle)}
                <div className="dribb-donut" style={{ ["--donut" as string]: donutSegments }}>
                  <span />
                </div>
                <strong className="dribb-storage__label">{copy.available}</strong>
                <b className="dribb-storage__value">{available.toFixed(2)} GB</b>
                <small className="dribb-storage__total">{copy.total} {totalStorage} GB</small>
                <div className="dribb-storage-list">
                  {usageByColor.map((color) => (
                    <div key={color.id} style={{ ["--folder" as string]: color.hex }}>
                      <span />
                      <p>
                        <strong>{storageLabels[color.id]}</strong>
                        <small>{color.usage.toFixed(1)} GB</small>
                      </p>
                      <i />
                    </div>
                  ))}
                </div>
                <button className="dribb-export" type="button">{copy.export}</button>
              </section>
            )}

            {screen === "settings" && (
              <section className="dribb-screen dribb-settings">
                {renderTopBar(copy.settingsTitle, <span />)}
                <h3>{copy.settingsTitle}</h3>
                <button type="button" onClick={() => setSettingsDetail("account")}><UserPlus size={15} /> {copy.addAccount}</button>
                <button type="button" onClick={() => setSettingsDetail("password")}><LockKeyhole size={15} /> {copy.changePassword}</button>
                <label className="dribb-setting-select">
                  <span><Languages size={15} /> {copy.changeLanguage}</span>
                  <select value={language} onChange={(event) => setLanguage(event.target.value as DribbLocale)}>
                    {dribbLanguageOptions.map((option) => (
                      <option key={option.code} value={option.code}>{option.label}</option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => setSettingsDetail("upgrade")}><HardDrive size={15} /> {copy.upgradePlan}</button>
                <button type="button" onClick={() => setSettingsDetail("multiple")}><UserRound size={15} /> {copy.multipleAccount}</button>
                <label className="dribb-toggle-row">
                  <span>{copy.enableSync}</span>
                  <input type="checkbox" checked={syncEnabled} onChange={(event) => setSyncEnabled(event.target.checked)} />
                </label>
                <label className="dribb-toggle-row">
                  <span>{copy.enable2fa}</span>
                  <input type="checkbox" checked={twoStepEnabled} onChange={(event) => setTwoStepEnabled(event.target.checked)} />
                </label>
                {settingsDetail && (
                  <div className="dribb-settings-detail" onClick={(event) => event.stopPropagation()}>
                    <button className="dribb-settings-detail__close" type="button" onClick={() => setSettingsDetail(null)} aria-label="Close settings detail">
                      <X size={14} />
                    </button>
                    {settingsDetail === "account" && (
                      <>
                        <strong>{copy.addAccount}</strong>
                        <label className="dribb-form-field">
                          <span>{copy.accountName}</span>
                          <input placeholder="Team workspace" />
                        </label>
                        <label className="dribb-form-field">
                          <span>{copy.accountEmail}</span>
                          <input placeholder="team@mail.com" />
                        </label>
                        <button className="dribb-mini-action" type="button">{copy.add}</button>
                      </>
                    )}
                    {settingsDetail === "password" && (
                      <>
                        <strong>{copy.changePassword}</strong>
                        <label className="dribb-form-field">
                          <span>{copy.currentPassword}</span>
                          <input type="password" placeholder="••••••••" />
                        </label>
                        <label className="dribb-form-field">
                          <span>{copy.newPassword}</span>
                          <input type="password" placeholder="••••••••" />
                        </label>
                        <label className="dribb-form-field">
                          <span>{copy.confirmPassword}</span>
                          <input type="password" placeholder="••••••••" />
                        </label>
                        <button className="dribb-mini-action" type="button">{copy.savePassword}</button>
                      </>
                    )}
                    {settingsDetail === "upgrade" && (
                      <>
                        <strong>{copy.upgradePlan}</strong>
                        <div className="dribb-plan-grid">
                          {[copy.planBasic, copy.planPro, copy.planTeam].map((plan, index) => (
                            <button className={index === 1 ? "is-active" : ""} key={plan} type="button">
                              <b>{plan}</b>
                              <span>{index === 0 ? "15 GB" : index === 1 ? "128 GB" : "1 TB"}</span>
                            </button>
                          ))}
                        </div>
                        <button className="dribb-mini-action" type="button">{copy.choosePlan}</button>
                      </>
                    )}
                    {settingsDetail === "multiple" && (
                      <>
                        <strong>{copy.multipleAccount}</strong>
                        <div className="dribb-account-stack">
                          <span><b>Neelesh</b><small>{copy.activeAccount}</small></span>
                          <span><b>Design Team</b><small>{copy.connectAccount}</small></span>
                          <span><b>Client Space</b><small>{copy.connectAccount}</small></span>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </section>
            )}

            {(screen === "shared" || screen === "help") && (
              <section className="dribb-screen dribb-empty-state">
                {renderTopBar(screen === "shared" ? copy.sharedTitle : copy.helpTitle)}
                {screen === "shared" ? <Share2 size={44} /> : <HelpCircle size={44} />}
                <h3>{screen === "shared" ? copy.sharedHeading : copy.helpHeading}</h3>
                <p>{screen === "shared" ? copy.sharedText : copy.helpText}</p>
              </section>
            )}

            {screen === "home" && (
              <button
                className="dribb-fab"
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setAddTarget("home");
                }}
                aria-label={copy.newFolder}
              >
                <Plus size={20} />
              </button>
            )}

            {navOpen && (
              <aside className="dribb-nav-menu" onClick={(event) => event.stopPropagation()}>
                <div className="dribb-nav-menu__profile">
                  <span>N</span>
                  <div>
                    <strong>Neelesh</strong>
                    <small>Seattle, Washington</small>
                  </div>
                  <button type="button" onClick={() => setNavOpen(false)} aria-label="Close menu">
                    <X size={16} />
                  </button>
                </div>
                {[
                  [copy.home, "home", <Folder size={15} />],
                  [copy.profile, "profile", <UserRound size={15} />],
                  [copy.storage, "storage", <HardDrive size={15} />],
                  [copy.shared, "shared", <Share2 size={15} />],
                  [copy.stats, "storage", <BarChart3 size={15} />],
                  [copy.settings, "settings", <Settings size={15} />],
                  [copy.help, "help", <HelpCircle size={15} />],
                ].map(([label, target, icon]) => (
                  <button key={label as string} type="button" onClick={() => openScreen(target as DribbScreen)}>
                    {icon}
                    {label as string}
                  </button>
                ))}
                <button className="dribb-nav-menu__logout" type="button" onClick={() => openScreen("welcome")}>
                  <LogOut size={15} />
                  {copy.logout}
                </button>
                <small>{copy.version}</small>
              </aside>
            )}

            {renderAddSheet()}
          </div>
        </div>
      </div>

      <aside className="mobile-app-preview__copy">
        <span className="mobile-app-preview__kicker">{copy.copyKicker}</span>
        <h2>{copy.copyTitle}</h2>
        <p>{copy.copyDesc}</p>
        <div className="mobile-app-preview__features">
          {copy.features.map((feature) => (
            <span key={feature}>{feature}</span>
          ))}
        </div>
      </aside>
    </div>
  );
};

