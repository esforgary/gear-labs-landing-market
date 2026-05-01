import React, { useState, useEffect } from "react";
import "./about-us.scss";

interface CardData {
  title: string;
  description: string;
  svg: React.ReactNode;
}

const cards: CardData[] = [
  {
    title: "Быстро",
    description: "Мы не подведем вас и ваших клиентов. Благодаря нашему опыту и умениям план будет выполнен в указанные сроки.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Sharp-access-time SVG Icon</title><path fill="currentColor" d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8m.5-13H11v6l5.25 3.15l.75-1.23l-4.5-2.67z"/></svg>
    ),
  },
  {
    title: "Надежно",
    description: "Будьте уверены в нашей работе. Мы гарантируем безупречный продукт, который не подведет ваших пользователей на любых устройствах.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><title>Shield-alt SVG Icon</title><path fill="currentColor" d="m466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3c11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3M256.1 446.3l-.1-381l175.9 73.3c-3.3 151.4-82.1 261.1-175.8 307.7"/></svg>
    ),
  },
  {
    title: "Стильно",
    description: "Лаконичный и минималистичный дизайн, приятные анимации, интуитивный интерфейс и современные технологии помогут вашему сайту или приложению идти в ногу со временем.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Magic-button-outline SVG Icon</title><path fill="currentColor" d="M10 14.175L11 12l2.175-1L11 10l-1-2.175L9 10l-2.175 1L9 12l1 2.175ZM10 19l-2.5-5.5L2 11l5.5-2.5L10 3l2.5 5.5L18 11l-5.5 2.5L10 19Zm8 2l-1.25-2.75L14 17l2.75-1.25L18 13l1.25 2.75L22 17l-2.75 1.25L18 21Zm-8-10Z"/></svg>
    ),
  },
  {
    title: "Практично",
    description: "Используйте удобные для вас и ваших поситителей функции. Мы поможем вам подключить и настроить Telegram ботов, локации на Google и Яндекс картах, платежные системы и рекламу.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><title>Lightning-charge-fill SVG Icon</title><path fill="currentColor" d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/></svg>
    ),
  },
  {
    title: "Заботливо",
    description: "Только сайт, который удовлитворит вас. Мы учитываем ваши пожелания и замечания, и будем вносить правки пока ваш заказ не будет выполнен идеально.",
    svg: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><title>Heart-solid SVG Icon</title><path fill="currentColor" d="M8.4 5.25c-2.78 0-5.15 2.08-5.15 4.78c0 1.863.872 3.431 2.028 4.73c1.153 1.295 2.64 2.382 3.983 3.292l2.319 1.57a.75.75 0 0 0 .84 0l2.319-1.57c1.344-.91 2.83-1.997 3.982-3.292c1.157-1.299 2.029-2.867 2.029-4.73c0-2.7-2.37-4.78-5.15-4.78c-1.434 0-2.695.672-3.6 1.542c-.905-.87-2.167-1.542-3.6-1.542"/></svg>
    ),
  },
];

const AboutUsCard: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % cards.length);
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  // Функция генерации частиц
  const createParticles = (parent: HTMLElement) => {
    const rect = parent.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    for (let i = 0; i < 15; i++) {
      const circle = document.createElement("span");
      circle.className = "explosion-circle";
      circle.style.background = "var(--blue)";
      const size = Math.random() * 3 + 3 + "px";
      circle.style.width = size;
      circle.style.height = size;

      const offsetX = (Math.random() - 0.5) * rect.width;
      const offsetY = (Math.random() - 0.5) * rect.height;

      circle.style.left = centerX + offsetX + "px";
      circle.style.top = centerY + offsetY + "px";

      parent.appendChild(circle);

      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 30 + 10;

      const translateX = Math.cos(angle) * distance;
      const translateY = Math.sin(angle) * distance;

      circle.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${translateX}px, ${translateY}px)`, opacity: 0 }
        ],
        {
          duration: 600 + Math.random() * 300,
          easing: "ease-out"
        }
      );

      setTimeout(() => circle.remove(), 1000);
    }
  };

  const handleClick = (idx: number, e: React.MouseEvent<HTMLDivElement>) => {
    setActiveIndex(idx);
    createParticles(e.currentTarget);
  };

  return (
    <div className="about-us-container">
      <div className="pagination-about-us scroll-animate">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className={`pagination-item ${idx === activeIndex ? "active" : ""}`}
            onClick={(e) => handleClick(idx, e)}
          >
            <div className="pagination-svg">{cards[idx].svg}</div>
          </div>
        ))}
      </div>

      <div className="card-abut-us scroll-animate">
        <div className="top-circle">
          <div className="inner-circle">{cards[activeIndex].svg}</div>
        </div>
        <h2>{cards[activeIndex].title}</h2>
        <p>{cards[activeIndex].description}</p>
      </div>
    </div>
  );
};

export default AboutUsCard;
