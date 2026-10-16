import { useEffect, useMemo, useRef, useState } from "react";
import { Code2, Palette, Rocket } from "lucide-react";
import ButtonWithExplosion from "../Button/button";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./banner.scss";

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const clientBaseUrl = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
const staticBaseUrl = apiBaseUrl || clientBaseUrl;
const serverAsset = (path: string) => {
  if (/^(https?:|data:|blob:)/.test(path)) return path;
  return `${staticBaseUrl}${path.startsWith("/") ? path : `/${path}`}`;
};

const imageSources = [
  serverAsset("/static/home/hero/web.jpg"),
  serverAsset("/static/home/hero/app.jpg"),
  serverAsset("/static/home/hero/bot.jpg"),
];

const createPointTones = () => {
  const tones = ["orange", "blue", Math.random() > 0.5 ? "orange" : "blue"];
  return tones.sort(() => Math.random() - 0.5);
};

const processSteps = [
  { key: "design", Icon: Palette },
  { key: "dev", Icon: Code2 },
  { key: "launch", Icon: Rocket },
];

const useFloatingSlider = () => {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const boundary = boundaryRef.current;
    const slider = sliderRef.current;
    if (!boundary || !slider) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;

    const reset = () => {
      cancelAnimationFrame(frame);
      slider.style.removeProperty("--hero-repel-x");
      slider.style.removeProperty("--hero-repel-y");
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (reducedMotion.matches || !finePointer.matches || event.pointerType !== "mouse") {
        reset();
        return;
      }

      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // Measure the stationary container so the floating image never chases its own bounds.
        const rect = boundary.getBoundingClientRect();
        const dx = rect.left + rect.width / 2 - event.clientX;
        const dy = rect.top + rect.height / 2 - event.clientY;
        const edgeDistance = Math.hypot(
          Math.max(Math.abs(dx) - rect.width / 2, 0),
          Math.max(Math.abs(dy) - rect.height / 2, 0)
        );
        const proximity = Math.max(0, 1 - edgeDistance / 160);
        const strength = 8 * proximity * proximity;
        // Ease through the center instead of flipping direction at full strength.
        const distance = Math.max(Math.hypot(dx, dy), 80);
        slider.style.setProperty("--hero-repel-x", `${(dx / distance * strength).toFixed(2)}px`);
        slider.style.setProperty("--hero-repel-y", `${(dy / distance * strength).toFixed(2)}px`);
      });
    };

    const handlePointerOut = (event: PointerEvent) => {
      if (!event.relatedTarget) reset();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerout", handlePointerOut);
    window.addEventListener("pointercancel", reset);
    window.addEventListener("blur", reset);
    window.addEventListener("resize", reset);
    window.addEventListener("scroll", reset, { capture: true, passive: true });
    document.addEventListener("visibilitychange", reset);
    reducedMotion.addEventListener("change", reset);
    finePointer.addEventListener("change", reset);

    return () => {
      reset();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerout", handlePointerOut);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("blur", reset);
      window.removeEventListener("resize", reset);
      window.removeEventListener("scroll", reset, true);
      document.removeEventListener("visibilitychange", reset);
      reducedMotion.removeEventListener("change", reset);
      finePointer.removeEventListener("change", reset);
    };
  }, []);

  return { boundaryRef, sliderRef };
};

export const Banner = () => {
  const { lang, t } = useThemeLang();
  const { boundaryRef, sliderRef } = useFloatingSlider();
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typingPhase, setTypingPhase] = useState<"typing" | "pause" | "deleting">("typing");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(false);
  const [pointTones] = useState(createPointTones);

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
  const heroPoints = [
    t("banner.point.design"),
    t("banner.point.dev"),
    t("banner.point.launch"),
  ];
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
            {heroPoints.map((point, index) => (
              <span className={`point-${pointTones[index]}`} key={point}>
                {point}
              </span>
            ))}
          </div>
        </div>

        <div className="banner-right scroll-animate" ref={boundaryRef}>
          <div className="image-block" ref={sliderRef}>
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

      <ol className="hero-process">
        {processSteps.map(({ key, Icon }, index) => (
          <li className="hero-process-step" key={key}>
            <span className={`hero-process-icon hero-process-icon--${pointTones[index]}`} aria-hidden="true"><Icon size={22} /></span>
            <div>
              <strong>{t(`banner.point.${key}`)}</strong>
              <p>{t(`banner.process.${key}`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};
