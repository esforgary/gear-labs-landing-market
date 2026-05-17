import { useMemo, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  CheckCircle2,
  CreditCard,
  Globe2,
  Menu,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import "./crypto-cap-landing.scss";

const asset = (name) => new URL(`./img/${name}`, import.meta.url).href;

const navItems = [
  { id: "crypto-home", label: "Home" },
  { id: "crypto-features", label: "Businesses" },
  { id: "crypto-market", label: "Trade" },
  { id: "crypto-market", label: "Market" },
  { id: "crypto-learn", label: "Learn" },
];

const trendCoins = [
  { symbol: "BTC", name: "Bitcoin", icon: "coin-btc.svg", tag: "BITCOIN", price: "$56,623.54", change: "1.41%", chart: "chart-green.svg" },
  { symbol: "ETH", name: "Ethereum", icon: "coin-eth.svg", tag: "ETHEREUM", price: "$4,267.90", change: "2.22%", chart: "chart-green.svg" },
  { symbol: "BNB", name: "Binance", icon: "coin-bnb.svg", tag: "BINANCE", price: "$587.74", change: "0.82%", chart: "chart-green.svg" },
  { symbol: "USDT", name: "Tether", icon: "coin-usdt.svg", tag: "TETHER", price: "$0.9998", change: "0.03%", chart: "chart-green.svg" },
];

const marketCoins = [
  { no: 1, name: "Bitcoin", symbol: "BTC", icon: "coin-btc.svg", price: "$56,623.54", change: "1.41%", category: "Popular", status: "up" },
  { no: 2, name: "Ethereum", symbol: "ETH", icon: "coin-eth.svg", price: "$4,267.90", change: "2.22%", category: "Popular", status: "up" },
  { no: 3, name: "Binance", symbol: "BNB", icon: "coin-bnb.svg", price: "$587.74", change: "-0.82%", category: "Metaverse", status: "down" },
  { no: 4, name: "Tether", symbol: "USDT", icon: "coin-usdt.svg", price: "$0.9998", change: "-0.03%", category: "Entertainment", status: "up" },
  { no: 5, name: "Solana", symbol: "SOL", icon: "coin-sol.svg", price: "$213.67", change: "-0.53%", category: "Gaming", status: "down" },
  { no: 6, name: "XRP", symbol: "XRP", icon: "coin-xrp.svg", price: "$1.04", change: "-0.44%", category: "Energy", status: "down" },
  { no: 7, name: "USD Coin", symbol: "USDC", icon: "coin-usdc.svg", price: "$1.00", change: "-0.03%", category: "Music", status: "down" },
];

const featureCards = [
  {
    title: "Manage Portfolio",
    text: "Buy and sell popular digital currencies, keep track of them in one place.",
    icon: WalletCards,
  },
  {
    title: "Protected Securely",
    text: "All cash balances are covered by FDIC insurance, up to a maximum of $250,000.",
    icon: ShieldCheck,
  },
  {
    title: "Cryptocurrency Variety",
    text: "Supports a variety of the most popular digital currencies and always up to date.",
    icon: BadgeCheck,
  },
  {
    title: "Learn Best Practice",
    text: "Easy to know how cryptocurrency works and friendly to newbie investors.",
    icon: BookOpen,
  },
];

const steps = [
  { title: "Create Your Account", text: "Your account and personal identity are guaranteed safe.", icon: UserRound },
  { title: "Connect Bank Account", text: "Connect the bank account to start transactions.", icon: CreditCard },
  { title: "Start Build Portfolio", text: "Buy and sell popular currencies and keep track of them.", icon: CheckCircle2 },
];

const articleCards = [
  {
    title: "All about Investing in NFTs and related risks",
    text: "Everything you need to know before entering the NFT market.",
    image: "article-nft.svg",
    large: true,
  },
  {
    title: "What is cryptocurrency? all you need to know",
    text: "Cryptocurrencies are basically digital assets. It is secured by cryptography.",
    image: "article-coins.svg",
  },
  {
    title: "Can crypto really replace your bank account?",
    text: "From direct deposit to earning yield, learn how crypto can help you take control.",
    image: "article-banking.svg",
  },
  {
    title: "The fact about bitcoin must you know",
    text: "The world's first widely adopted cryptocurrency still allows for secure exchange.",
    image: "article-bitcoin.svg",
  },
  {
    title: "When is the best time to invest in crypto?",
    text: "When prices are fluctuating, how do you know when to buy?",
    image: "article-trading.svg",
  },
  {
    title: "What Is DeFi? Inside the Wild West of Cryptocurrency.",
    text: "Welcome to decentralized finance, a new frontier of crypto that writes its own rules.",
    image: "article-defi.svg",
  },
];

const categories = ["Popular", "Metaverse", "Entertainment", "Energy", "Gaming", "Music", "See All 12+"];

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function CoinName({ coin }) {
  return (
    <div className="crypto-coin-name">
      <img src={asset(coin.icon)} alt="" />
      <span>{coin.name}</span>
      <em>{coin.symbol}</em>
    </div>
  );
}

export default function CryptoCapLanding() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Popular");
  const [search, setSearch] = useState("");
  const [language, setLanguage] = useState("EN");
  const [tradedSymbol, setTradedSymbol] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(articleCards[0].title);

  const filteredCoins = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return marketCoins.filter((coin) => {
      const categoryMatches = activeCategory === "See All 12+" || coin.category === activeCategory;
      const searchMatches =
        !normalizedSearch ||
        coin.name.toLowerCase().includes(normalizedSearch) ||
        coin.symbol.toLowerCase().includes(normalizedSearch);
      return categoryMatches && searchMatches;
    });
  }, [activeCategory, search]);

  const handleNavClick = (id) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  return (
    <main className="crypto-cap-page" id="crypto-home">
      <header className="crypto-header">
        <div className="crypto-container crypto-header-inner">
          <button type="button" className="crypto-brand" onClick={() => handleNavClick("crypto-home")}>
            <img src={asset("logo-mark.svg")} alt="" />
            <span>Crypto<span>Cap</span></span>
          </button>

          <button
            className="crypto-menu-btn"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={`crypto-nav-panel ${menuOpen ? "open" : ""}`}>
            <nav aria-label="CryptoCap navigation">
              {navItems.map((item) => (
                <button type="button" key={`${item.label}-${item.id}`} onClick={() => handleNavClick(item.id)}>
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="crypto-header-actions">
              <button type="button" onClick={() => setLanguage((value) => (value === "EN" ? "RU" : "EN"))}>
                <Globe2 size={16} />
                {language}
              </button>
              <button type="button" className="crypto-primary-btn" onClick={() => handleNavClick("crypto-market")}>
                Get Started
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="crypto-hero">
        <div className="crypto-container">
          <div className="crypto-hero-copy">
            <h1>Start and Build Your Crypto Portfolio Here</h1>
            <p>
              Only at CryptoCap, you can build a good portfolio and learn best practices about cryptocurrency.
            </p>
            <button type="button" className="crypto-primary-btn" onClick={() => handleNavClick("crypto-market")}>
              Get Started
            </button>
          </div>

          <div className="crypto-trend-strip" aria-label="Market trend">
            <h2>Market Trend</h2>
            <div className="crypto-trend-grid">
              {trendCoins.map((coin) => (
                <article className="crypto-trend-card" key={coin.symbol}>
                  <div className="crypto-trend-top">
                    <img src={asset(coin.icon)} alt="" />
                    <strong>{coin.symbol}</strong>
                    <span>{coin.tag}</span>
                    <button type="button" onClick={() => setSearch(coin.symbol)} aria-label={`Find ${coin.name}`}>
                      <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="crypto-trend-bottom">
                    <div>
                      <b>{coin.price}</b>
                      <em>{coin.change}</em>
                    </div>
                    <img src={asset(coin.chart)} alt="" />
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="crypto-features" id="crypto-features">
        <div className="crypto-container">
          <div className="crypto-section-head">
            <h2>CryptoCap Amazing Features</h2>
            <p>Explore sensational features to prepare your best investment in cryptocurrency</p>
          </div>
          <div className="crypto-feature-grid">
            {featureCards.map((feature) => {
              const Icon = feature.icon;
              return (
                <article className="crypto-feature-card" key={feature.title}>
                  <span>
                    <Icon size={30} />
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                  <button type="button" onClick={() => handleNavClick("crypto-learn")}>
                    See Explained
                    <ArrowRight size={15} />
                  </button>
                </article>
              );
            })}
          </div>

          <div className="crypto-info-banner">
            <div>
              <h3>New In Cryptocurrency?</h3>
              <p>We'll tell you what cryptocurrencies are, how they work and why you should own one right now. So let's do it.</p>
            </div>
            <button type="button" className="crypto-primary-btn" onClick={() => handleNavClick("crypto-learn")}>
              Learn & Explore Now
            </button>
          </div>
        </div>
      </section>

      <section className="crypto-market" id="crypto-market">
        <div className="crypto-container">
          <div className="crypto-market-head">
            <div>
              <h2>Market Update</h2>
              <p>Cryptocurrency Categories</p>
            </div>
            <label className="crypto-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Search Coin"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
          </div>

          <div className="crypto-category-row" aria-label="Cryptocurrency categories">
            {categories.map((category) => (
              <button
                type="button"
                key={category}
                className={activeCategory === category ? "active" : ""}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="crypto-market-table" role="table" aria-label="Market update">
            <div className="crypto-market-row crypto-market-row-head" role="row">
              <span>NO</span>
              <span>NAME</span>
              <span>LAST PRICE</span>
              <span>CHANGE</span>
              <span>MARKET STATS</span>
              <span>TRADE</span>
            </div>
            {filteredCoins.map((coin) => (
              <div className="crypto-market-row" role="row" key={coin.symbol}>
                <span>{coin.no}</span>
                <CoinName coin={coin} />
                <span>{coin.price}</span>
                <span className={coin.status === "down" ? "negative" : ""}>{coin.change}</span>
                <img src={asset(coin.status === "down" ? "chart-red.svg" : "chart-green.svg")} alt="" />
                <button type="button" onClick={() => setTradedSymbol(coin.symbol)}>
                  {tradedSymbol === coin.symbol ? "Added" : "Trade"}
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="crypto-link-btn" onClick={() => setActiveCategory("See All 12+")}>
            See All Coins
          </button>
          {tradedSymbol && <p className="crypto-action-note">{tradedSymbol} added to your demo watchlist.</p>}
        </div>
      </section>

      <section className="crypto-started">
        <div className="crypto-container crypto-started-grid">
          <div>
            <h2>How To Get Started</h2>
            <p>Simple and easy way to start your investment in cryptocurrency</p>
            <button type="button" className="crypto-primary-btn" onClick={() => handleNavClick("crypto-market")}>
              Get Started
            </button>
          </div>
          <div className="crypto-step-list">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <button type="button" className="crypto-step-card" key={step.title} onClick={() => handleNavClick("crypto-market")}>
                  <span>
                    <Icon size={30} />
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="crypto-learn" id="crypto-learn">
        <div className="crypto-container">
          <div className="crypto-section-head">
            <h2>Learn About Cryptocurrency</h2>
            <p>Learn all about cryptocurrency to start investing</p>
          </div>
          <div className="crypto-article-grid">
            {articleCards.map((article) => (
              <button
                type="button"
                className={`crypto-article-card ${article.large ? "large" : ""} ${
                  selectedArticle === article.title ? "selected" : ""
                }`}
                key={article.title}
                onClick={() => setSelectedArticle(article.title)}
              >
                <img src={asset(article.image)} alt="" />
                <div>
                  <span>CRYPTO BASIC</span>
                  <h3>{article.title}</h3>
                  <p>{article.text}</p>
                </div>
              </button>
            ))}
          </div>
          <button type="button" className="crypto-link-btn" onClick={() => setSelectedArticle(articleCards[0].title)}>
            See All Articles
          </button>
        </div>
      </section>

      <footer className="crypto-footer">
        <div className="crypto-container crypto-footer-grid">
          <div>
            <button type="button" className="crypto-brand" onClick={() => handleNavClick("crypto-home")}>
              <img src={asset("logo-mark.svg")} alt="" />
              <span>Crypto<span>Cap</span></span>
            </button>
            <div className="crypto-socials">
              {["in", "f", "x", "yt"].map((social) => (
                <button type="button" key={social} onClick={() => handleNavClick("crypto-home")}>
                  {social}
                </button>
              ))}
            </div>
            <p>2021 CoinMarketCap. All rights reserved</p>
          </div>
          <nav>
            <h3>About Us</h3>
            <button type="button">About</button>
            <button type="button">Careers</button>
            <button type="button">Blog</button>
            <button type="button">Legal & privacy</button>
          </nav>
          <nav>
            <h3>Services</h3>
            <button type="button">Applications</button>
            <button type="button">Buy Crypto</button>
            <button type="button">Affiliate</button>
            <button type="button">Institutional Services</button>
          </nav>
          <nav>
            <h3>Learn</h3>
            <button type="button" onClick={() => handleNavClick("crypto-features")}>What is Cryptocurrency?</button>
            <button type="button" onClick={() => handleNavClick("crypto-learn")}>Crypto Basic</button>
            <button type="button" onClick={() => handleNavClick("crypto-learn")}>Tips and Tutorials</button>
            <button type="button" onClick={() => handleNavClick("crypto-market")}>Market Update</button>
          </nav>
        </div>
      </footer>
    </main>
  );
}
