import { useCallback, useEffect, useRef, useState } from "react";
import { Power, Settings, ShieldCheck, UserRound } from "lucide-react";
import { useThemeLang } from "../../../../../context/ThemeLangContext";
import "./gearshield-vpn.scss";
type VpnFlagVariant = "de" | "nl" | "us" | "jp" | "uk" | "fr" | "sg" | "ca" | "br" | "au";
type VpnSignalLevel = "bad" | "ok" | "good";

const vpnCopy = {
  en: {
    secureTunnel: "Secure tunnel",
    vpnConnect: "VPN Connect",
    connecting: "Connecting",
    disconnect: "Disconnect",
    connect: "Connect",
    servers: "Servers",
    active: "active",
    quick: "quick select",
    connected: "Connected",
    profile: "Profile",
    settings: "Settings",
    subscription: "Premium subscription active until 24.08.2026",
    traffic: "Traffic",
    devices: "Devices",
    light: "Light",
    dark: "Dark",
    key: "Subscription key",
    copyKicker: "Mobile app",
    copyTitle: "GearShield VPN",
    copyDesc: "Demo VPN app mockup: one-tap connection, 10 live servers, subscription profile and fast theme settings.",
    features: ["One-tap connection", "10 countries and live signal", "Subscription profile", "Light and dark themes"],
    countries: { de: "Germany", nl: "Netherlands", us: "United States", jp: "Japan", uk: "United Kingdom", fr: "France", sg: "Singapore", ca: "Canada", br: "Brazil", au: "Australia" },
  },
  ru: {
    secureTunnel: "Защищенный канал",
    vpnConnect: "VPN подключение",
    connecting: "Подключение",
    disconnect: "Отключить",
    connect: "Подключить",
    servers: "Серверы",
    active: "активен",
    quick: "быстрый выбор",
    connected: "Подключено",
    profile: "Профиль",
    settings: "Настройки",
    subscription: "Подписка Premium активна до 24.08.2026",
    traffic: "Трафик",
    devices: "Устройств",
    light: "Светлая",
    dark: "Темная",
    key: "Ключ подписки",
    copyKicker: "Мобильное приложение",
    copyTitle: "GearShield VPN",
    copyDesc: "Демонстрационный макет VPN-приложения: подключение в один тап, 10 серверов с живым состоянием сети, профиль подписки и быстрые настройки схемы.",
    features: ["Подключение в 1 касание", "10 стран и живой сигнал", "Профиль подписки", "Светлая и темная схема"],
    countries: { de: "Германия", nl: "Нидерланды", us: "США", jp: "Япония", uk: "Великобритания", fr: "Франция", sg: "Сингапур", ca: "Канада", br: "Бразилия", au: "Австралия" },
  },
  de: {
    secureTunnel: "Sicherer Tunnel",
    vpnConnect: "VPN Verbindung",
    connecting: "Verbinden",
    disconnect: "Trennen",
    connect: "Verbinden",
    servers: "Server",
    active: "aktiv",
    quick: "Schnellauswahl",
    connected: "Verbunden",
    profile: "Profil",
    settings: "Einstellungen",
    subscription: "Premium-Abo aktiv bis 24.08.2026",
    traffic: "Traffic",
    devices: "Gerate",
    light: "Hell",
    dark: "Dunkel",
    key: "Abo-Schlussel",
    copyKicker: "Mobile App",
    copyTitle: "GearShield VPN",
    copyDesc: "VPN-App-Mockup: Verbindung mit einem Tipp, 10 Live-Server, Abo-Profil und schnelle Theme-Einstellungen.",
    features: ["1-Tap Verbindung", "10 Lander mit Live-Signal", "Abo-Profil", "Helles und dunkles Theme"],
    countries: { de: "Deutschland", nl: "Niederlande", us: "USA", jp: "Japan", uk: "Vereinigtes Konigreich", fr: "Frankreich", sg: "Singapur", ca: "Kanada", br: "Brasilien", au: "Australien" },
  },
  fr: {
    secureTunnel: "Tunnel securise",
    vpnConnect: "Connexion VPN",
    connecting: "Connexion",
    disconnect: "Deconnecter",
    connect: "Connecter",
    servers: "Serveurs",
    active: "actif",
    quick: "selection rapide",
    connected: "Connecte",
    profile: "Profil",
    settings: "Parametres",
    subscription: "Abonnement Premium actif jusqu'au 24.08.2026",
    traffic: "Trafic",
    devices: "Appareils",
    light: "Clair",
    dark: "Sombre",
    key: "Cle d'abonnement",
    copyKicker: "Application mobile",
    copyTitle: "GearShield VPN",
    copyDesc: "Maquette VPN mobile: connexion en un geste, 10 serveurs vivants, profil d'abonnement et reglages rapides.",
    features: ["Connexion en 1 geste", "10 pays et signal en direct", "Profil d'abonnement", "Themes clair et sombre"],
    countries: { de: "Allemagne", nl: "Pays-Bas", us: "Etats-Unis", jp: "Japon", uk: "Royaume-Uni", fr: "France", sg: "Singapour", ca: "Canada", br: "Bresil", au: "Australie" },
  },
  it: {
    secureTunnel: "Tunnel sicuro",
    vpnConnect: "Connessione VPN",
    connecting: "Connessione",
    disconnect: "Disconnetti",
    connect: "Connetti",
    servers: "Server",
    active: "attivo",
    quick: "scelta rapida",
    connected: "Connesso",
    profile: "Profilo",
    settings: "Impostazioni",
    subscription: "Abbonamento Premium attivo fino al 24.08.2026",
    traffic: "Traffico",
    devices: "Dispositivi",
    light: "Chiaro",
    dark: "Scuro",
    key: "Chiave abbonamento",
    copyKicker: "App mobile",
    copyTitle: "GearShield VPN",
    copyDesc: "Mockup VPN mobile: connessione in un tap, 10 server live, profilo abbonamento e temi rapidi.",
    features: ["Connessione in 1 tap", "10 paesi e segnale live", "Profilo abbonamento", "Tema chiaro e scuro"],
    countries: { de: "Germania", nl: "Paesi Bassi", us: "Stati Uniti", jp: "Giappone", uk: "Regno Unito", fr: "Francia", sg: "Singapore", ca: "Canada", br: "Brasile", au: "Australia" },
  },
  pl: {
    secureTunnel: "Bezpieczny tunel",
    vpnConnect: "Polaczenie VPN",
    connecting: "Laczenie",
    disconnect: "Rozlacz",
    connect: "Polacz",
    servers: "Serwery",
    active: "aktywny",
    quick: "szybki wybor",
    connected: "Polaczono",
    profile: "Profil",
    settings: "Ustawienia",
    subscription: "Subskrypcja Premium aktywna do 24.08.2026",
    traffic: "Ruch",
    devices: "Urzadzenia",
    light: "Jasny",
    dark: "Ciemny",
    key: "Klucz subskrypcji",
    copyKicker: "Aplikacja mobilna",
    copyTitle: "GearShield VPN",
    copyDesc: "Mockup aplikacji VPN: polaczenie jednym tapnieciem, 10 serwerow live, profil subskrypcji i szybkie motywy.",
    features: ["Polaczenie 1 tap", "10 krajow i sygnal live", "Profil subskrypcji", "Jasny i ciemny motyw"],
    countries: { de: "Niemcy", nl: "Holandia", us: "USA", jp: "Japonia", uk: "Wielka Brytania", fr: "Francja", sg: "Singapur", ca: "Kanada", br: "Brazylia", au: "Australia" },
  },
  cz: {
    secureTunnel: "Bezpecny tunel",
    vpnConnect: "VPN pripojeni",
    connecting: "Pripojovani",
    disconnect: "Odpojit",
    connect: "Pripojit",
    servers: "Servery",
    active: "aktivni",
    quick: "rychly vyber",
    connected: "Pripojeno",
    profile: "Profil",
    settings: "Nastaveni",
    subscription: "Premium predplatne aktivni do 24.08.2026",
    traffic: "Provoz",
    devices: "Zarizeni",
    light: "Svetly",
    dark: "Tmavy",
    key: "Klic predplatneho",
    copyKicker: "Mobilni aplikace",
    copyTitle: "GearShield VPN",
    copyDesc: "VPN mockup: pripojeni jednim klepnutim, 10 live serveru, profil predplatneho a rychle motivy.",
    features: ["1 klepnuti", "10 zemi a live signal", "Profil predplatneho", "Svetly a tmavy motiv"],
    countries: { de: "Nemecko", nl: "Nizozemsko", us: "USA", jp: "Japonsko", uk: "Velka Britanie", fr: "Francie", sg: "Singapur", ca: "Kanada", br: "Brazilie", au: "Australie" },
  },
  sk: {
    secureTunnel: "Bezpecny tunel",
    vpnConnect: "VPN pripojenie",
    connecting: "Pripajanie",
    disconnect: "Odpojit",
    connect: "Pripojit",
    servers: "Servery",
    active: "aktivny",
    quick: "rychly vyber",
    connected: "Pripojene",
    profile: "Profil",
    settings: "Nastavenia",
    subscription: "Premium predplatne aktivne do 24.08.2026",
    traffic: "Prenos",
    devices: "Zariadenia",
    light: "Svetly",
    dark: "Tmavy",
    key: "Kluc predplatneho",
    copyKicker: "Mobilna aplikacia",
    copyTitle: "GearShield VPN",
    copyDesc: "VPN mockup: pripojenie jednym klepnutim, 10 live serverov, profil predplatneho a rychle temy.",
    features: ["1 klepnutie", "10 krajin a live signal", "Profil predplatneho", "Svetla a tmava tema"],
    countries: { de: "Nemecko", nl: "Holandsko", us: "USA", jp: "Japonsko", uk: "Velka Britania", fr: "Francuzsko", sg: "Singapur", ca: "Kanada", br: "Brazilia", au: "Australia" },
  },
} as const;

type VpnLocale = keyof typeof vpnCopy;

const normalizeVpnLocale = (lang: string): VpnLocale =>
  lang in vpnCopy ? (lang as VpnLocale) : "en";

const VpnFlag = ({ variant }: { variant: VpnFlagVariant }) => {
  if (variant === "de") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="8" fill="#111827" />
        <rect y="8" width="36" height="8" fill="#dd2027" />
        <rect y="16" width="36" height="8" fill="#ffd43b" />
      </svg>
    );
  }

  if (variant === "nl") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="8" fill="#ae1c28" />
        <rect y="8" width="36" height="8" fill="#ffffff" />
        <rect y="16" width="36" height="8" fill="#21468b" />
      </svg>
    );
  }

  if (variant === "jp") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="24" fill="#ffffff" />
        <circle cx="18" cy="12" r="6" fill="#bc002d" />
      </svg>
    );
  }

  if (variant === "uk") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="24" fill="#012169" />
        <path d="M0 0l36 24M36 0L0 24" stroke="#fff" strokeWidth="5" />
        <path d="M0 0l36 24M36 0L0 24" stroke="#c8102e" strokeWidth="2.4" />
        <path d="M18 0v24M0 12h36" stroke="#fff" strokeWidth="8" />
        <path d="M18 0v24M0 12h36" stroke="#c8102e" strokeWidth="4.6" />
      </svg>
    );
  }

  if (variant === "fr") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="12" height="24" fill="#0055a4" />
        <rect x="12" width="12" height="24" fill="#ffffff" />
        <rect x="24" width="12" height="24" fill="#ef4135" />
      </svg>
    );
  }

  if (variant === "sg") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="12" fill="#ef3340" />
        <rect y="12" width="36" height="12" fill="#ffffff" />
        <circle cx="8" cy="6" r="4" fill="#fff" />
        <circle cx="9.5" cy="6" r="3.4" fill="#ef3340" />
        <circle cx="15" cy="6" r="1.2" fill="#fff" />
      </svg>
    );
  }

  if (variant === "ca") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="8" height="24" fill="#d52b1e" />
        <rect x="8" width="20" height="24" fill="#ffffff" />
        <rect x="28" width="8" height="24" fill="#d52b1e" />
        <path d="M18 5l1.4 4 3.2-.8-2.1 3 2.9 1.2-3.4 1.1.7 3.5-2.7-2.1-2.7 2.1.7-3.5-3.4-1.1 2.9-1.2-2.1-3 3.2.8z" fill="#d52b1e" />
      </svg>
    );
  }

  if (variant === "br") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="24" fill="#009b3a" />
        <path d="M18 3l15 9-15 9-15-9z" fill="#ffdf00" />
        <circle cx="18" cy="12" r="5.2" fill="#002776" />
      </svg>
    );
  }

  if (variant === "au") {
    return (
      <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
        <rect width="36" height="24" fill="#012169" />
        <path d="M0 0l16 10.7M16 0L0 10.7" stroke="#fff" strokeWidth="3" />
        <path d="M0 0l16 10.7M16 0L0 10.7" stroke="#c8102e" strokeWidth="1.4" />
        <path d="M8 0v12M0 6h17" stroke="#fff" strokeWidth="4" />
        <path d="M8 0v12M0 6h17" stroke="#c8102e" strokeWidth="2.2" />
        <circle cx="27" cy="7" r="1.6" fill="#fff" />
        <circle cx="23" cy="15" r="1.4" fill="#fff" />
        <circle cx="31" cy="17" r="1.2" fill="#fff" />
      </svg>
    );
  }

  return (
    <svg className="vpn-flag" viewBox="0 0 36 24" aria-hidden="true">
      <rect width="36" height="24" fill="#ffffff" />
      <rect width="36" height="1.846" y="0" fill="#b22234" />
      <rect width="36" height="1.846" y="3.692" fill="#b22234" />
      <rect width="36" height="1.846" y="7.384" fill="#b22234" />
      <rect width="36" height="1.846" y="11.076" fill="#b22234" />
      <rect width="36" height="1.846" y="14.768" fill="#b22234" />
      <rect width="36" height="1.846" y="18.46" fill="#b22234" />
      <rect width="36" height="1.846" y="22.152" fill="#b22234" />
      <rect width="15.8" height="12.92" fill="#3c3b6e" />
    </svg>
  );
};

const vpnServers = [
  { flag: "de" as const, country: "Germany", ip: "185.221.86.14", ping: "24 ms", signal: "good" as const, quality: 92 },
  { flag: "nl" as const, country: "Netherlands", ip: "91.204.55.21", ping: "37 ms", signal: "good" as const, quality: 78 },
  { flag: "us" as const, country: "United States", ip: "172.64.19.88", ping: "63 ms", signal: "ok" as const, quality: 54 },
  { flag: "jp" as const, country: "Japan", ip: "103.140.23.10", ping: "118 ms", signal: "bad" as const, quality: 31 },
  { flag: "uk" as const, country: "United Kingdom", ip: "45.92.18.74", ping: "42 ms", signal: "good" as const, quality: 88 },
  { flag: "fr" as const, country: "France", ip: "51.210.42.19", ping: "48 ms", signal: "ok" as const, quality: 66 },
  { flag: "sg" as const, country: "Singapore", ip: "103.253.144.6", ping: "96 ms", signal: "ok" as const, quality: 61 },
  { flag: "ca" as const, country: "Canada", ip: "198.27.76.33", ping: "72 ms", signal: "good" as const, quality: 84 },
  { flag: "br" as const, country: "Brazil", ip: "177.54.152.8", ping: "142 ms", signal: "bad" as const, quality: 29 },
  { flag: "au" as const, country: "Australia", ip: "139.99.210.4", ping: "151 ms", signal: "bad" as const, quality: 35 },
];

const createVpnSignalState = () =>
  vpnServers.reduce<Record<string, VpnSignalLevel>>((signals, server) => {
    signals[server.ip] = server.signal;
    return signals;
  }, {});

const createVpnPingState = () =>
  vpnServers.reduce<Record<string, string>>((pings, server) => {
    pings[server.ip] = server.ping;
    return pings;
  }, {});

const getRandomVpnSignal = (): VpnSignalLevel => {
  const value = Math.random();
  if (value < 0.28) return "bad";
  if (value < 0.64) return "ok";
  return "good";
};

const getRandomVpnPing = (level: VpnSignalLevel) => {
  const max = level === "good" ? 89 : level === "ok" ? 150 : 999;
  const min = level === "good" ? 14 : level === "ok" ? 90 : 151;
  return `${Math.floor(Math.random() * (max - min + 1)) + min} ms`;
};

const VpnSignalBars = ({ level }: { level: VpnSignalLevel }) => (
  <span className={`vpn-signal vpn-signal--${level}`} aria-label={`Состояние сети: ${level}`}>
    <span />
    <span />
    <span />
  </span>
);

export const VpnAppPreview = () => {
  const { lang } = useThemeLang();
  const [connectionState, setConnectionState] = useState<"idle" | "connecting" | "connected">("idle");
  const [panel, setPanel] = useState<"profile" | "settings" | null>(null);
  const [visiblePanel, setVisiblePanel] = useState<"profile" | "settings" | null>(null);
  const [closingPanel, setClosingPanel] = useState<"profile" | "settings" | null>(null);
  const panelCloseTimerRef = useRef<number | null>(null);
  const [connectedToastVisible, setConnectedToastVisible] = useState(false);
  const [scheme, setScheme] = useState<"dark" | "light">("dark");
  const [activeServerIp, setActiveServerIp] = useState(vpnServers[0].ip);
  const [serverSignals, setServerSignals] = useState<Record<string, VpnSignalLevel>>(createVpnSignalState);
  const [serverPings, setServerPings] = useState<Record<string, string>>(createVpnPingState);

  useEffect(() => {
    if (connectionState !== "connecting") return undefined;
    const timer = window.setTimeout(() => setConnectionState("connected"), 1200);
    return () => window.clearTimeout(timer);
  }, [connectionState]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setServerSignals((currentSignals) => {
        const nextSignals = { ...currentSignals };
        const nextPings: Record<string, string> = {};

        vpnServers.forEach((server) => {
          if (Math.random() > 0.52) {
            const nextSignal = getRandomVpnSignal();
            nextSignals[server.ip] = nextSignal;
            nextPings[server.ip] = getRandomVpnPing(nextSignal);
          }
        });

        if (Object.keys(nextPings).length) {
          setServerPings((currentPings) => ({ ...currentPings, ...nextPings }));
        }

        return nextSignals;
      });
    }, 2600);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (connectionState !== "connected") {
      setConnectedToastVisible(false);
      return undefined;
    }

    setConnectedToastVisible(true);
    const timer = window.setTimeout(() => setConnectedToastVisible(false), 3000);
    return () => window.clearTimeout(timer);
  }, [connectionState, activeServerIp]);

  const clearPanelCloseTimer = useCallback(() => {
    if (panelCloseTimerRef.current !== null) {
      window.clearTimeout(panelCloseTimerRef.current);
      panelCloseTimerRef.current = null;
    }
  }, []);

  const closePanel = useCallback(() => {
    if (!visiblePanel || closingPanel) return;
    clearPanelCloseTimer();
    setPanel(null);
    setClosingPanel(visiblePanel);
    panelCloseTimerRef.current = window.setTimeout(() => {
      setVisiblePanel(null);
      setClosingPanel(null);
      panelCloseTimerRef.current = null;
    }, 240);
  }, [clearPanelCloseTimer, closingPanel, visiblePanel]);

  const togglePanel = useCallback(
    (nextPanel: "profile" | "settings") => {
      if (panel === nextPanel && visiblePanel === nextPanel && !closingPanel) {
        closePanel();
        return;
      }

      clearPanelCloseTimer();
      setClosingPanel(null);
      setVisiblePanel(nextPanel);
      setPanel(nextPanel);
    },
    [clearPanelCloseTimer, closePanel, closingPanel, panel, visiblePanel]
  );

  useEffect(() => () => clearPanelCloseTimer(), [clearPanelCloseTimer]);

  const activeServer = vpnServers.find((server) => server.ip === activeServerIp) ?? vpnServers[0];
  const copy = vpnCopy[normalizeVpnLocale(lang)];
  const getCountryName = (flag: VpnFlagVariant) => copy.countries[flag] ?? flag.toUpperCase();
  const isConnected = connectionState === "connected";
  const connectLabel = connectionState === "connecting" ? copy.connecting : isConnected ? copy.disconnect : copy.connect;

  const connectToServer = (serverIp: string) => {
    if (serverIp === activeServerIp && isConnected) return;
    closePanel();
    setActiveServerIp(serverIp);
    setConnectionState("connecting");
  };

  return (
    <div className="mobile-app-preview">
      <div className="mobile-app-preview__phone-wrap">
        <div className="app-phone-frame">
          <div className={`vpn-phone-app vpn-phone-app--${scheme}`} onClick={closePanel}>
            <div className="vpn-phone-app__notch" />
            <header className="vpn-phone-app__header">
              <div>
                <span>GearShield</span>
                <strong>{isConnected ? copy.secureTunnel : copy.vpnConnect}</strong>
              </div>
              <div className="vpn-phone-app__actions" onClick={(event) => event.stopPropagation()}>
                <button
                  className={panel === "profile" ? "is-active" : ""}
                  type="button"
                  aria-label={copy.profile}
                  onClick={() => togglePanel("profile")}
                >
                  <UserRound size={17} />
                </button>
                <button
                  className={panel === "settings" ? "is-active" : ""}
                  type="button"
                  aria-label={copy.settings}
                  onClick={() => togglePanel("settings")}
                >
                  <Settings size={17} />
                </button>
              </div>
            </header>

            <section className={`vpn-connect-card vpn-connect-card--${connectionState}`}>
              <div className="vpn-connect-card__rings" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <button
                className="vpn-power-button"
                type="button"
                onClick={() => {
                  closePanel();
                  setConnectionState((current) => (current === "connected" ? "idle" : "connecting"));
                }}
              >
                <span className="vpn-power-button__icon">
                  <Power size={38} />
                </span>
                <span className="vpn-power-button__text">{connectLabel}</span>
              </button>
            </section>

            <section className="vpn-server-list">
              <div className="vpn-server-list__head">
                <strong>{copy.servers}</strong>
                <span>{isConnected ? `${copy.active}: ${getCountryName(activeServer.flag)}` : copy.quick}</span>
              </div>
              <div className="vpn-server-list__items">
                {vpnServers.map((server) => (
                  <button
                    key={server.ip}
                    className={`vpn-server-card ${server.ip === activeServerIp && isConnected ? "is-active" : ""} ${server.ip === activeServerIp && connectionState === "connecting" ? "is-loading" : ""}`}
                    type="button"
                    onClick={() => connectToServer(server.ip)}
                  >
                    <VpnFlag variant={server.flag} />
                    <span>
                      <strong>{getCountryName(server.flag)}</strong>
                      <small>{server.ip}</small>
                    </span>
                    <em>{serverPings[server.ip] ?? server.ping}</em>
                    <VpnSignalBars level={serverSignals[server.ip] ?? server.signal} />
                  </button>
                ))}
              </div>
            </section>

            {connectedToastVisible && (
              <div className="vpn-connected-toast">
                <ShieldCheck size={18} />
                <span>{copy.connected}: {getCountryName(activeServer.flag)}</span>
              </div>
            )}

            {visiblePanel === "profile" && (
              <aside className={`vpn-side-panel${closingPanel === "profile" ? " is-closing" : ""}`} onClick={(event) => event.stopPropagation()}>
                <strong>{copy.profile}</strong>
                <p>{copy.subscription}</p>
                <div>
                  <span>{copy.traffic}</span>
                  <b>147 GB</b>
                </div>
                <div>
                  <span>{copy.devices}</span>
                  <b>3 / 5</b>
                </div>
              </aside>
            )}

            {visiblePanel === "settings" && (
              <aside className={`vpn-side-panel vpn-side-panel--settings${closingPanel === "settings" ? " is-closing" : ""}`} onClick={(event) => event.stopPropagation()}>
                <strong>{copy.settings}</strong>
                <div className="vpn-scheme-switch">
                  <button className={scheme === "light" ? "is-active" : ""} type="button" onClick={() => setScheme("light")}>
                    {copy.light}
                  </button>
                  <button className={scheme === "dark" ? "is-active" : ""} type="button" onClick={() => setScheme("dark")}>
                    {copy.dark}
                  </button>
                </div>
                <label>
                  <span>{copy.key}</span>
                  <input placeholder="VPN-XXXX-XXXX" />
                </label>
              </aside>
            )}
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

