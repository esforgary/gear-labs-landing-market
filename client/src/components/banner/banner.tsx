import { useEffect, useState } from "react";
import ButtonWithExplosion from "../Button/button";
import "./banner.scss";

const typingTexts = [
  {
    title: "Адаптивная верстка Web-сайтов на заказ",
    body: "Легкая и интуитивная страница для вашего бизнесса может стать отличным инструментом в продвижении услуг и привлечения новых клиентов."
  },
  {
    title: "Разработка мобильных и десктопных приложений",
    body: "Все ещё выполняете ежедневные задачи в ручную? Мы поможем облегчить вам работу разработав специально для ваших целей уникальное приложение. Превратите рутину в нажатие одной кнопки."
  },
  {
    title: "Создание Telegram ботов и приложений",
    body: "Все мы ежедневно пользуемся онлайн месенджерами, а их развитие так же не стоит на месте. Улучшайте комфорт ваших клиетов интеграцией своих услуг в Telegram."
  }
];

const imageTexts = [
  { text: "Первый блок текста", img: "./img/banner/1.jpg" },
  { text: "Второй блок текста", img: "./img/banner/2.jpg" },
  { text: "Третий блок текста", img: "./img/banner/3.jpg" }
];

export const Banner = () => {
  const [currentTypingIndex, setCurrentTypingIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [typingPhase, setTypingPhase] = useState<"typing" | "pause" | "deleting">("typing");

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(false);

  const fullText = typingTexts[currentTypingIndex].title + "\n" + typingTexts[currentTypingIndex].body;

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
      <h1>Приветствуем в <span className="logo"><span className="orange">Gear</span><span className="blue">Labs</span></span></h1>

      <div className="banner">
        <div className="banner-left scroll-animate">
          <div className="typing-text">{renderTypingText()}</div>
        </div>

        <div className="banner-right scroll-animate">
          <div className="image-block">
            <div className="image-container">
              <div className={`content ${fade ? "fade-out" : "fade-in"}`}>
                <p className="image-caption">{imageTexts[currentImageIndex].text}</p>
                <img src={imageTexts[currentImageIndex].img} alt="" />
              </div>
            </div>
          </div>

          <div className="buttons-block">
            <div className="buttons-bg">
              <ButtonWithExplosion color="orange">Выбрать макет</ButtonWithExplosion>
              <ButtonWithExplosion color="blue">Как заказать?</ButtonWithExplosion>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};