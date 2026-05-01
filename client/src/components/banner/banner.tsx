import { useEffect, useMemo, useState } from "react";
import { Rocket } from "lucide-react";
import ButtonWithExplosion from "../Button/button";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./banner.scss";

const imageSources = [
  "./img/banner/gearlabs-web-3d-v2.jpg",
  "./img/banner/gearlabs-app-3d-v2.jpg",
  "./img/banner/gearlabs-bot-3d-v2.jpg",
];

export const Banner = () => {
  const { lang, t } = useThemeLang();
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typingPhase, setTypingPhase] = useState<"typing" | "pause" | "deleting">("typing");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const typingTexts = useMemo(
    () => [
      {
        title: t("banner.title.0"),
        body: t("banner.body.0"),
      },
      {
        title: t("banner.title.1"),
        body: t("banner.body.1"),
      },
      {
        title: t("banner.title.2"),
        body: t("banner.body.2"),
      },
    ],
    [t]
  );

  const imageTexts = useMemo(
    () => imageSources.map((img, index) => ({
      label: t(`banner.image.${index}.label`),
      title: t(`banner.image.${index}.title`),
      img,
    })),
    [t]
  );

  const fullText = typingTexts[currentTypingIndex].title + "\n" + typingTexts[currentTypingIndex].body;
  const currentImage = imageTexts[currentImageIndex];
  const reserveText = useMemo(
    () => typingTexts.reduce(
      (longest, item) => ({
        title: item.title.length > longest.title.length ? item.title : longest.title,
        body: item.body.length > longest.body.length ? item.body : longest.body,
      }),
      typingTexts[0]
    ),
    [typingTexts]
  );

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (typingPhase === "typing") {
      if (displayedText.length < fullText.length) {
        const nextChar = fullText[displayedText.length];
        const delay = nextChar === "\n" ? 600 : 70;
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length + 1));
        }, delay);
      } else {
        setTypingPhase("pause");
      }
    } else if (typingPhase === "pause") {
      timeout = setTimeout(() => setTypingPhase("deleting"), 5000);
    } else if (typingPhase === "deleting") {
      if (displayedText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayedText(fullText.slice(0, displayedText.length - 1));
        }, 30);
      } else {
        setCurrentTypingIndex((prev) => (prev + 1) % typingTexts.length);
        setTypingPhase("typing");
      }
    }

    return () => clearTimeout(timeout);
  }, [displayedText, typingPhase, currentTypingIndex, fullText]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % imageTexts.length);
        setFade(false);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentTypingIndex(0);
    setDisplayedText("");
    setTypingPhase("typing");
  }, [lang]);

  const scrollToSection = (target: string) => {
    const element = document.getElementById(target);

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", `#${target}`);
    }
  };

  const renderTypingText = () => {
    const { title } = typingTexts[currentTypingIndex];
    const titleLength = title.length;

    const showCursor =
      typingPhase === "typing" || typingPhase === "pause" || (typingPhase === "deleting" && displayedText.length > 0);

    if (displayedText.length <= titleLength) {
      return (
        <>
          <h3>
            {displayedText}
            {showCursor && <span className="cursor" />}
          </h3>
          <p></p>
        </>
      );
    }

    return (
      <>
        <h3>{title}</h3>
        <p>
          {displayedText.slice(titleLength + 1)}
          {showCursor && <span className="cursor" />}
        </p>
      </>
    );
  };

  return (
    <div className="banner-wrapper">
      <span className="hero-glow hero-glow-orange" />
      <span className="hero-glow hero-glow-blue" />
      <h1>{t("banner.welcome")} <span className="logo"><span className="orange">Gear</span><span className="blue">Labs</span></span></h1>

      <div className="banner">
        <div className="banner-left scroll-animate">
          <div className="hero-kicker section-eyebrow">
            <Rocket size={18} />
            {t("eyebrow.banner")}
          </div>
          <div className="typing-text">
            <div className="typing-reserve" aria-hidden="true">
              <h3>{reserveText.title}</h3>
              <p>{reserveText.body}</p>
            </div>
            <div className="typing-live">{renderTypingText()}</div>
          </div>

          <div className="hero-actions">
            <ButtonWithExplosion color="orange" type="button" onClick={() => scrollToSection("catalog")}>
              {t("banner.action.template")}
            </ButtonWithExplosion>
            <ButtonWithExplosion color="blue" type="button" onClick={() => scrollToSection("start")}>
              {t("banner.action.order")}
            </ButtonWithExplosion>
          </div>

          <div className="hero-points">
            <span>{t("banner.point.design")}</span>
            <span>{t("banner.point.dev")}</span>
            <span>{t("banner.point.launch")}</span>
          </div>
        </div>

        <div className="banner-right scroll-animate">
          <div className="image-block">
            <div className="visual-toolbar">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="slide-counter">0{currentImageIndex + 1}/03</span>
            </div>

            <div className="image-container">
              <div className={`content ${fade ? "fade-out" : "fade-in"}`}>
                <img src={currentImage.img} alt={currentImage.title} />
                <div className="image-caption">
                  <span>{currentImage.label}</span>
                  <strong>{currentImage.title}</strong>
                </div>
              </div>
            </div>

            <div className="slide-dots">
              {imageTexts.map((item, index) => (
                <button
                  key={item.title}
                  className={index === currentImageIndex ? "active" : ""}
                  type="button"
                  aria-label={`Показать ${item.title}`}
                  onClick={() => {
                    setFade(true);
                    setTimeout(() => {
                      setCurrentImageIndex(index);
                      setFade(false);
                    }, 260);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
