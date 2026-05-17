import { useEffect, useMemo, useState } from "react";
import { ArrowRightCircle, Menu, Send, X } from "lucide-react";
import "./portfolio-landing.scss";

const asset = (name) => new URL(`./img/${name}`, import.meta.url).href;

const navItems = [
  { id: "portfolio-home", label: "Главная" },
  { id: "portfolio-skills", label: "Навыки" },
  { id: "portfolio-projects", label: "Проэкты" },
];

const socialIcons = ["nav-icon1.svg", "nav-icon2.svg", "nav-icon3.svg"];

const skills = [
  { title: "Front-End", image: "meter1.svg" },
  { title: "Web Designer", image: "meter2.svg" },
  { title: "Back-End", image: "meter3.svg" },
];

const projects = [
  {
    title: "Business Startup",
    description: "Design & Development",
    image: "project-img1.png",
  },
  {
    title: "Business Startup",
    description: "Design & Development",
    image: "project-img2.png",
  },
  {
    title: "Business Startup",
    description: "Design & Development",
    image: "project-img3.png",
  },
];

const tabs = [
  { id: "first", label: "Вкладка 1" },
  { id: "second", label: "Вкладка 2" },
  { id: "third", label: "Вкладка 3" },
];

function SocialLinks() {
  return (
    <div className="portfolio-social" aria-label="Социальные ссылки">
      {socialIcons.map((icon) => (
        <a href="#portfolio-home" key={icon} aria-label={icon.replace(".svg", "")}>
          <img src={asset(icon)} alt="" />
        </a>
      ))}
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <article className="portfolio-project-card">
      <img src={asset(project.image)} alt="" />
      <div>
        <h3>{project.title}</h3>
        <span>{project.description}</span>
      </div>
    </article>
  );
}

export default function PortfolioLanding() {
  const [activeLink, setActiveLink] = useState("portfolio-home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("first");
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleText, setRoleText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [newsletterSent, setNewsletterSent] = useState(false);

  const roles = useMemo(() => ["Web Developer", "Web Designer", "UI/UX Designer"], []);

  useEffect(() => {
    const fullText = roles[roleIndex % roles.length];
    const doneTyping = !deleting && roleText === fullText;
    const doneDeleting = deleting && roleText === "";
    const delay = doneTyping ? 1400 : deleting ? 48 : 92;

    const timer = window.setTimeout(() => {
      if (doneTyping) {
        setDeleting(true);
        return;
      }

      if (doneDeleting) {
        setDeleting(false);
        setRoleIndex((value) => (value + 1) % roles.length);
        return;
      }

      setRoleText((value) =>
        deleting ? fullText.slice(0, value.length - 1) : fullText.slice(0, value.length + 1)
      );
    }, delay);

    return () => window.clearTimeout(timer);
  }, [deleting, roleIndex, roleText, roles]);

  const goTo = (id) => {
    setActiveLink(id);
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="portfolio-site">
      <header className="portfolio-nav">
        <div className="portfolio-container portfolio-nav-inner">
          <a className="portfolio-logo" href="#portfolio-home" onClick={() => setActiveLink("portfolio-home")}>
            <img src={asset("logo.svg")} alt="Portfolio" />
          </a>

          <button
            className="portfolio-menu-toggle"
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className={`portfolio-nav-panel ${menuOpen ? "open" : ""}`}>
            <nav aria-label="Portfolio navigation">
              {navItems.map((item) => (
                <button
                  className={activeLink === item.id ? "active" : ""}
                  key={item.id}
                  type="button"
                  onClick={() => goTo(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </nav>
            <div className="portfolio-nav-actions">
              <SocialLinks />
              <button type="button" className="portfolio-outline-btn" onClick={() => goTo("portfolio-connect")}>
                <span>Оставить Отзыв</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="portfolio-hero" id="portfolio-home">
        <div className="portfolio-container portfolio-hero-grid">
          <div className="portfolio-hero-copy">
            <span className="portfolio-tagline">Моё портфолио</span>
            <h1>
              Начинающий <span className="portfolio-typed">{roleText}</span>
            </h1>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type
              and scrambled it to make a type specimen book.
            </p>
            <button type="button" onClick={() => goTo("portfolio-connect")}>
              Оставить Отзыв
              <ArrowRightCircle size={25} />
            </button>
          </div>
          <img className="portfolio-hero-art" src={asset("header-img.svg")} alt="" />
        </div>
      </section>

      <section className="portfolio-skills" id="portfolio-skills">
        <div className="portfolio-container">
          <div className="portfolio-skill-box">
            <h2>Мои Навыки</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
              industry&apos;s standard dummy text ever since the 1500s.
            </p>
            <div className="portfolio-skill-list">
              {skills.map((skill) => (
                <article className="portfolio-skill-item" key={skill.title}>
                  <img src={asset(skill.image)} alt="" />
                  <h3>{skill.title}</h3>
                </article>
              ))}
            </div>
          </div>
        </div>
        <img className="portfolio-bg-left" src={asset("color-sharp.png")} alt="" />
      </section>

      <section className="portfolio-projects" id="portfolio-projects">
        <div className="portfolio-container">
          <h2>Мои Проэкты</h2>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
            industry&apos;s standard dummy text ever since the 1500s.
          </p>

          <div className="portfolio-tabs" role="tablist" aria-label="Проекты">
            {tabs.map((tab) => (
              <button
                className={activeTab === tab.id ? "active" : ""}
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "first" ? (
            <div className="portfolio-project-grid">
              {projects.map((project) => (
                <ProjectCard project={project} key={project.image} />
              ))}
            </div>
          ) : (
            <div className="portfolio-tab-note">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quam, quod neque provident velit, rem
              explicabo excepturi id illo molestiae.
            </div>
          )}
        </div>
        <img className="portfolio-bg-right" src={asset("color-sharp2.png")} alt="" />
      </section>

      <section className="portfolio-contact" id="portfolio-connect">
        <div className="portfolio-container portfolio-contact-grid">
          <img src={asset("contact-img.svg")} alt="" />
          <div>
            <h2>Связаться с автором</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setContactSent(true);
              }}
            >
              <div className="portfolio-form-grid">
                <input type="text" placeholder="Имя" aria-label="Имя" />
                <input type="text" placeholder="Фамилия" aria-label="Фамилия" />
                <input type="email" placeholder="Почта" aria-label="Почта" />
                <input type="tel" placeholder="Номер телефона" aria-label="Номер телефона" />
                <textarea rows="6" placeholder="Сообщение" aria-label="Сообщение" />
              </div>
              <button type="submit">
                <span>Отправить</span>
              </button>
              {contactSent && <p className="portfolio-form-status">Сообщение сохранено в демо-режиме.</p>}
            </form>
          </div>
        </div>
      </section>

      <footer className="portfolio-footer">
        <div className="portfolio-container">
          <div className="portfolio-newsletter">
            <h3>Подписаться на рассылку новостей</h3>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setNewsletterSent(true);
              }}
            >
              <div>
                <input type="email" placeholder="Почта" aria-label="Почта для рассылки" />
                <button type="submit">Подписаться</button>
              </div>
              {newsletterSent && <p>Подписка сохранена в демо-режиме.</p>}
            </form>
          </div>

          <div className="portfolio-footer-bottom">
            <img src={asset("logo.svg")} alt="Portfolio" />
            <div>
              <SocialLinks />
              <p>@eSForgary 2023</p>
            </div>
          </div>
        </div>
        <Send className="portfolio-footer-mark" aria-hidden="true" />
      </footer>
    </main>
  );
}
