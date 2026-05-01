import { useState } from "react";
import "./footer.scss";

export default function Footer() {
  const [hoverColors, setHoverColors] = useState<{ [key: string]: string }>({});

  const colors = ["var(--blue)", "var(--orange)"];

  const handleMouseEnter = (key: string) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    setHoverColors((prev) => ({ ...prev, [key]: randomColor }));
  };

  const handleMouseLeave = (key: string) => {
    setHoverColors((prev) => ({ ...prev, [key]: "#ffffff" }));
  };

  const menuLinks = ["GearLabs", "Про нас", "Разработка", "Каталог", "Приступим"];

  return (
    <footer className="footer-wrapper">
      <div className="footer-inner">
        {/* 1 колонка */}
        <div className="footer-col logo-col">
          <div
            className="footer-logo"
            style={{ color: hoverColors.logo || "#fff" }}
            onMouseEnter={() => handleMouseEnter("logo")}
            onMouseLeave={() => handleMouseLeave("logo")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 23 24"
              width="60"
              height="60"
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
            <p>GearLabs</p>
          </div>

          <div className="footer-socials">
            {/* Telegram */}
            <a
              className="footer-social"
              style={{ color: hoverColors.tg || "#fff" }}
              onMouseEnter={() => handleMouseEnter("tg")}
              onMouseLeave={() => handleMouseLeave("tg")}
            >
              <svg viewBox="0 0 512 512">
                <path
                  fill="currentColor"
                  d="M470.435 45.423L16.827 221.249c-18.254 8.188-24.428 24.585-4.412 33.484l116.37 37.173l281.368-174.79c15.363-10.973 31.091-8.047 17.557 4.024L186.053 341.075l-7.591 93.076c7.031 14.371 19.905 14.438 28.117 7.295l66.858-63.589l114.505 86.187c26.595 15.826 41.066 5.613 46.788-23.394l75.105-357.47c7.798-35.705-5.5-51.437-39.4-37.757"
                />
              </svg>
            </a>

            {/* Facebook */}
            <a
              className="footer-social"
              style={{ color: hoverColors.fb || "#fff" }}
              onMouseEnter={() => handleMouseEnter("fb")}
              onMouseLeave={() => handleMouseLeave("fb")}
            >
              <svg viewBox="0 0 32 32">
                <path
                  fill="currentColor"
                  d="M26.67 4H5.33A1.34 1.34 0 0 0 4 5.33v21.34A1.34 1.34 0 0 0 5.33 28h11.49v-9.28H13.7v-3.63h3.12v-2.67c0-3.1 1.89-4.79 4.67-4.79h2.79V11h-1.91c-1.51 0-1.8.72-1.8 1.77v2.31h3.6l-.47 3.63h-3.13V28h6.1A1.34 1.34 0 0 0 28 26.67V5.33A1.34 1.34 0 0 0 26.67 4"
                />
              </svg>
            </a>

            {/* GitHub */}
            <a
              className="footer-social"
              style={{ color: hoverColors.gh || "#fff" }}
              onMouseEnter={() => handleMouseEnter("gh")}
              onMouseLeave={() => handleMouseLeave("gh")}
            >
              <svg viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385c.6.105.825-.255.825-.57v-2.04c-3.345.735-4.05-1.61-4.05-1.61c-.546-1.386-1.335-1.755-1.335-1.755c-1.09-.75.083-.735.083-.735c1.205.084 1.84 1.236 1.84 1.236c1.07 1.83 2.805 1.302 3.495.996"
                />
              </svg>
            </a>
          </div>
        </div>

        {/* 2 колонка */}
        <div className="footer-col">
          {menuLinks.map((item) => (
            <span
              key={item}
              className="footer-link"
              style={{ color: hoverColors[item] || "#fff" }}
              onMouseEnter={() => handleMouseEnter(item)}
              onMouseLeave={() => handleMouseLeave(item)}
            >
              {item}
            </span>
          ))}
        </div>

        {/* 3 колонка */}
        <div className="footer-col">
          {["Текст 1", "Текст 2", "Текст 3", "Текст 4", "Текст 5"].map(
            (item, i) => (
              <span
                key={i}
                className="footer-link"
                style={{ color: hoverColors[`t${i}`] || "#fff" }}
                onMouseEnter={() => handleMouseEnter(`t${i}`)}
                onMouseLeave={() => handleMouseLeave(`t${i}`)}
              >
                {item}
              </span>
            )
          )}
        </div>
      </div>

      <div className="footer-copy">
        Copyright © 2025 GearLabs.
      </div>
    </footer>
  );
}
