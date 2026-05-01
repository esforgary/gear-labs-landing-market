import { useState } from "react";
import Nav from "react-bootstrap/Nav";
import Dropdown from "react-bootstrap/Dropdown";
import "./header.scss";

export default function Header() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [lang, setLang] = useState("ru");

  const [hoverColors, setHoverColors] = useState<{ [key: string]: string }>({});

  const languages = [
    { code: "ru", name: "Россия", flag: "img/flags/ru.svg" },
    { code: "en", name: "England", flag: "img/flags/en.svg" },
    { code: "de", name: "Deutschland", flag: "img/flags/de.svg" },
    { code: "fr", name: "France", flag: "img/flags/fr.svg" },
    { code: "it", name: "Italia", flag: "img/flags/it.svg" },
    { code: "pl", name: "Polska", flag: "img/flags/pl.svg" },
    { code: "cz", name: "Česko", flag: "img/flags/cz.svg" },
    { code: "sk", name: "Slovensko", flag: "img/flags/sk.svg" },
  ];

  const currentFlag =
    languages.find((l) => l.code === lang)?.flag || "img/flags/ru.svg";

  const handleMouseEnter = (key: string) => {
    const colors = ["var(--blue)", "var(--orange)"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setHoverColors((prev) => ({ ...prev, [key]: randomColor }));
  };

  const handleMouseLeave = (key: string) => {
    setHoverColors((prev) => ({ ...prev, [key]: "#000000" }));
  };

  return (
    <header className="header-wrapper">
      <div className="header-inner">
        {/* Левая колонка — логотип */}
        <div className="header-left">
          <span className="logo">
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

              <g
                transform="translate(11.5 11.5) scale(0.55) translate(-12 -2.5)"
              >
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
            <p className="gear-labs">
              <span className="gear">Gear</span>
              <span className="labs">Labs</span>
            </p>
          </span>
        </div>

        {/* Центр — меню */}
        <nav className="header-center">
          <Nav className="header-menu">
            {["GearLabs", "Про нас", "Разработка", "Каталог", "Приступим"].map((item, idx) => (
              <Nav.Link
                key={idx}
                href={`#${item.toLowerCase()}`}
                style={{
                  color: hoverColors[item] || "#000",
                  transition: "color 0.5s ease",
                }}
                onMouseEnter={() => handleMouseEnter(item)}
                onMouseLeave={() => handleMouseLeave(item)}
              >
                {item}
              </Nav.Link>
            ))}
          </Nav>
        </nav>

        {/* Правая колонка — селекторы */}
        <div className="header-controls ">
          <Dropdown align="end">
            <Dropdown.Toggle className="control-btn theme-toggle">
              <div className={`theme-circle theme-${theme}`} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setTheme("light")}>
                <div className="theme-option">
                  <div className="theme-circle small theme-light" />
                  <span>Светлая</span>
                </div>
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setTheme("dark")}>
                <div className="theme-option">
                  <div className="theme-circle small theme-dark" />
                  <span>Тёмная</span>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown align="end">
            <Dropdown.Toggle className="control-btn lang-toggle">
              <img src={currentFlag} alt={lang} className="lang-flag" />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {languages.map((l) => (
                <Dropdown.Item key={l.code} onClick={() => setLang(l.code)}>
                  <div className="lang-option">
                    <img src={l.flag} className="lang-flag" />
                    <span>{l.name}</span>
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
