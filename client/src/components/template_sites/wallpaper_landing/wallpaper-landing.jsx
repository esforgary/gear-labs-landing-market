import { useState } from "react";
import { CheckCircle2, Image, MapPin, Palette, Send, Smartphone, Star } from "lucide-react";
import "./wallpaper-landing.scss";

const galleryItems = [
  { title: "Dawn Field", tone: "warm", type: "Desktop" },
  { title: "Quiet Grid", tone: "stone", type: "Mobile" },
  { title: "Soft Office", tone: "blue", type: "Desktop" },
  { title: "Paper Coast", tone: "green", type: "Tablet" },
  { title: "City Calm", tone: "ink", type: "Desktop" },
  { title: "Studio Wall", tone: "sand", type: "Mobile" },
];

const carouselItems = [
  {
    title: "Morning Pack",
    note: "12 светлых обоев для рабочих экранов",
    tone: "warm",
  },
  {
    title: "Focus Pack",
    note: "минимальные сетки и спокойные плоскости",
    tone: "blue",
  },
  {
    title: "Natural Pack",
    note: "мягкие природные цвета без визуального шума",
    tone: "green",
  },
];

function WallpaperTile({ item }) {
  return (
    <article className={`wallpaper-tile tone-${item.tone}`}>
      <span>{item.type}</span>
      <strong>{item.title}</strong>
    </article>
  );
}

export default function WallpaperLanding() {
  const [slide, setSlide] = useState(0);
  const [sent, setSent] = useState(false);
  const currentSlide = carouselItems[slide];

  const nextSlide = () => setSlide((value) => (value + 1) % carouselItems.length);
  const prevSlide = () => setSlide((value) => (value - 1 + carouselItems.length) % carouselItems.length);

  return (
    <main className="wallpaper-site">
      <header className="wallpaper-header">
        <a href="#wall-home" className="wallpaper-logo">NordWall</a>
        <nav aria-label="NordWall navigation">
          <a href="#wall-gallery">Галерея</a>
          <a href="#wall-sets">Коллекции</a>
          <a href="#wall-map">Локация</a>
          <a href="#wall-contact">Telegram</a>
        </nav>
      </header>

      <section className="wallpaper-hero" id="wall-home">
        <div className="wallpaper-hero-copy">
          <span className="wallpaper-kicker">minimal wallpaper studio</span>
          <h1>Спокойные обои для рабочих экранов</h1>
          <p>
            NordWall собирает чистые фоны для телефонов, планшетов и desktop. Без лишнего шума,
            кислотных цветов и перегруженных деталей.
          </p>
          <div className="wallpaper-actions">
            <a href="#wall-gallery">Смотреть галерею</a>
            <a href="#wall-contact">Запросить подборку</a>
          </div>
        </div>
        <div className="wallpaper-hero-preview" aria-label="Wallpaper preview">
          <div className="wallpaper-browser">
            <span />
            <span />
            <span />
          </div>
          <div className="wallpaper-preview-grid">
            <div className="preview-card large" />
            <div className="preview-card" />
            <div className="preview-card muted" />
          </div>
        </div>
      </section>

      <section className="wallpaper-features" aria-label="Преимущества">
        <article>
          <Palette />
          <h2>Базовые цвета</h2>
          <p>Палитры держатся на белом, сером, графитовом и мягких природных оттенках.</p>
        </article>
        <article>
          <Smartphone />
          <h2>Под разные экраны</h2>
          <p>Каждый набор готовится в форматах для desktop, tablet и mobile.</p>
        </article>
        <article>
          <Image />
          <h2>Готовые подборки</h2>
          <p>Коллекции можно быстро скачать или запросить подбор под свой стиль.</p>
        </article>
      </section>

      <section className="wallpaper-section" id="wall-gallery">
        <div className="wallpaper-section-head">
          <span>gallery</span>
          <h2>Галерея обоев</h2>
        </div>
        <div className="wallpaper-gallery">
          {galleryItems.map((item) => (
            <WallpaperTile item={item} key={item.title} />
          ))}
        </div>
      </section>

      <section className="wallpaper-info">
        <div>
          <span>about collection</span>
          <h2>Фоны, которые не спорят с интерфейсом</h2>
        </div>
        <p>
          Обои сделаны так, чтобы иконки, виджеты и рабочие панели оставались читаемыми. Основной
          акцент — ровные поверхности, округлые формы и лёгкий контраст.
        </p>
        <ul>
          <li><CheckCircle2 /> без визуального мусора</li>
          <li><CheckCircle2 /> готовые размеры</li>
          <li><CheckCircle2 /> мягкая цветовая система</li>
        </ul>
      </section>

      <section className="wallpaper-section" id="wall-sets">
        <div className="wallpaper-section-head">
          <span>sets</span>
          <h2>Карусель подборок</h2>
        </div>
        <div className="wallpaper-carousel">
          <button type="button" onClick={prevSlide}>Назад</button>
          <article className={`carousel-card tone-${currentSlide.tone}`}>
            <Star />
            <span>{String(slide + 1).padStart(2, "0")} / 03</span>
            <h3>{currentSlide.title}</h3>
            <p>{currentSlide.note}</p>
          </article>
          <button type="button" onClick={nextSlide}>Вперёд</button>
        </div>
      </section>

      <section className="wallpaper-map" id="wall-map">
        <div>
          <span>location</span>
          <h2>Студия в Санкт-Петербурге</h2>
          <p>Небольшая команда собирает коллекции удалённо, а офлайн-встречи проводит в коворкинге у Невы.</p>
        </div>
        <div className="map-card" aria-label="Карта местоположения">
          <MapPin />
          <strong>59.9343 N, 30.3351 E</strong>
        </div>
      </section>

      <section className="wallpaper-contact" id="wall-contact">
        <div>
          <span>telegram</span>
          <h2>Краткая связь</h2>
          <p>Оставьте ник в Telegram и коротко опишите, какие обои нужны.</p>
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}>
          <input aria-label="Telegram" placeholder="@telegram" />
          <input aria-label="Тематика" placeholder="тематика подборки" />
          <button type="submit">
            <Send size={18} />
            Отправить
          </button>
          {sent && <p className="form-note">Заявка сохранена в демо-режиме.</p>}
        </form>
      </section>

      <footer className="wallpaper-footer">
        <strong>NordWall</strong>
        <span>minimal wallpapers / 2026</span>
      </footer>
    </main>
  );
}
