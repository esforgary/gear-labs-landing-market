import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import type { MouseEvent } from "react";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./header.scss";

const navItems = [
  { key: "nav.home", target: "home" },
  { key: "nav.about", target: "about" },
  { key: "nav.development", target: "development" },
  { key: "nav.catalog", target: "catalog" },
  { key: "nav.start", target: "start" },
];

export default function Header() {
  const { currentTheme, themes, setThemeId, lang, setLang, languages, t } = useThemeLang();
  const currentFlag = languages.find((language) => language.code === lang)?.flag || "img/flags/ru.svg";

  const scrollToSection = (target: string) => (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${target}`);
    }
  };

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        <div className="header-left">
          <a className="logo" href="#home" onClick={scrollToSection("home")} aria-label="GearLabs">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 24"
              width="30"
              height="30"
            >
              <path
                fill="currentColor"
                d="M22.171 19.68L14.819 8.369V2.962h1.708V0H6.098v2.965H7.82v5.407L.454 19.68A2.792 2.792 0 0 0 2.791 24h17.034a2.8 2.8 0 0 0 2.34-4.331l.007.011zm-.905 2.302a1.633 1.633 0 0 1-1.434.854H2.791a1.635 1.635 0 0 1-1.37-2.531l-.004.006l7.549-11.6V2.96h4.686v5.754l7.541 11.6c.17.251.272.561.272.895c0 .285-.074.553-.204.785l.004-.008z"
              />

              <g transform="translate(11.5 11.5) scale(0.55) translate(-12 -2.5)">
                <path
                  fill="currentColor"
                  d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5s-1.57 3.5-3.5 3.5z"
                >
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 12 12"
                    to="360 12 12"
                    dur="10s"
                    repeatCount="indefinite"
                  />
                </path>
              </g>
            </svg>
            <span className="gear-labs">
              <span className="gear">Gear</span>
              <span className="labs">Labs</span>
            </span>
          </a>
        </div>

        <nav className="header-center" aria-label="Main navigation">
          <Nav className="header-menu">
            {navItems.map((item) => (
              <Nav.Link
                key={item.target}
                href={`#${item.target}`}
                onClick={scrollToSection(item.target)}
              >
                {t(item.key)}
              </Nav.Link>
            ))}
          </Nav>
        </nav>

        <div className="header-controls">
          <Dropdown align="end">
            <Dropdown.Toggle className="control-btn theme-toggle" aria-label={t(currentTheme.nameKey)}>
              <span className="theme-circle" style={{ background: currentTheme.preview }} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {themes.map((theme) => (
                <Dropdown.Item
                  key={theme.id}
                  active={theme.id === currentTheme.id}
                  onClick={() => setThemeId(theme.id)}
                >
                  <div className="theme-option">
                    <span className="theme-circle small" style={{ background: theme.preview }} />
                    <span>{t(theme.nameKey)}</span>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown align="end">
            <Dropdown.Toggle className="control-btn lang-toggle" aria-label={lang}>
              <img src={currentFlag} alt={lang} className="lang-flag" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((language) => (
                <Dropdown.Item
                  key={language.code}
                  active={language.code === lang}
                  onClick={() => setLang(language.code)}
                >
                  <div className="lang-option">
                    <img src={language.flag} className="lang-flag" alt={language.code} />
                    <span>{language.name}</span>
                  </div>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
