import { useMemo, useState } from "react";
import "./cursus-landing.scss";

const asset = (name) => new URL(`./img/${name}`, import.meta.url).href;

const heroPills = [
  "Cursus Integer",
  "Integer Consequat",
  "Tellus Euismod Pellentesque",
  "Aliquot Tristique",
  "Pellentesque Tempus",
  "Mauris Fermentum Praesent",
];

const featureCards = [
  {
    number: "1.",
    icon: asset("feature-icon-1.svg"),
    title: "Phasellus Vitae",
    kicker: "Quisque",
    text: "Porttitor Vitae Vel Amet",
  },
  {
    number: "2.",
    icon: asset("feature-icon-2.svg"),
    title: "Iaculis Magna",
    kicker: "Porttitor",
    text: "Neque Scelerisque Mattis.",
  },
  {
    number: "3.",
    icon: asset("feature-icon-3.svg"),
    title: "Eleifend Pulvinar",
    kicker: "Vitae",
    text: "Consectetur Nibh Velit",
  },
  {
    number: "4.",
    icon: asset("feature-icon-4.svg"),
    title: "Velit Odio Phir",
    kicker: "Ametneq",
    text: "Magna Consectetur Leo.",
  },
];

const checklist = [
  "Ac viverra sed risus praesent vulputate.",
  "Natoqu consectetur pulvinar.",
  "Sollicitudin ornare tempus nulla varius pulvinar.",
  "Varius pulvinar",
  "Natoque id tellus consectetur",
  "Vulputate et vulputate suspendisse",
];

const testimonials = [
  {
    name: "Holly Davidson",
    title: "What our customers thought?",
    text:
      "Euismod magna id purus eget nunc ligula suspendisse dui netus. Condimentum blandit rutrum at mauris enim pulvinar duis etiam duis.",
  },
  {
    name: "Alex Morgan",
    title: "Fast launch, clean process.",
    text:
      "Pellentesque tempus sed phasellus vel. The team gave us a calm, readable page and all the sections we needed for launch.",
  },
  {
    name: "Mia Patterson",
    title: "Everything felt structured.",
    text:
      "Mauris fermentum praesent tellus euismod pellentesque urna. The FAQ and content blocks made the offer easy to understand.",
  },
];

const faqs = [
  {
    question: "Quam vehicula faucibus amet lorem.",
    answer:
      "Euismod magna id purus eget nunc ligula suspendisse dui netus. Condimentum blandit rutrum at mauris enim pulvinar duis etiam duis.",
  },
  {
    question: "Pellentesque tempus sed phasellus vel.",
    answer:
      "Pellentesque tempus sed phasellus vel amet neque scelerisque mattis. Consectetur nibh velit magna consectetur leo.",
  },
  {
    question: "Mauris fermentum praesent tellus euismod pellentesque urna ac massa in.",
    answer:
      "Integer consequat tristique keeps the process clear: discovery, content, visual system and launch preparation.",
  },
  {
    question: "Vulputate et vulputate suspendisse natoque id tellus consectetur pulvinar et.",
    answer:
      "Suspendisse natoque id tellus consectetur pulvinar et. Varius pulvinar is grouped into clear content modules.",
  },
  {
    question: "Sollicitudin ornare tempus felis nulla varius pulvinar nibh viverra ornare.",
    answer:
      "Sollicitudin ornare tempus felis nulla varius pulvinar nibh viverra ornare with responsive blocks and smooth states.",
  },
  {
    question: "Consectetur nibh velit magna consectetur leo.",
    answer:
      "Consectetur nibh velit magna consectetur leo. Each section follows the same token system and visual rhythm.",
  },
  {
    question: "Quisque porttitor vitae vel amet neque scelerisque mattis.",
    answer:
      "Quisque porttitor vitae vel amet neque scelerisque mattis. The final page includes local assets and interactive sections.",
  },
];

function ButtonArrowIcon() {
  return (
    <svg viewBox="0 0 32 32" focusable="false" aria-hidden="true">
      <circle cx="16" cy="16" r="13.5" />
      <path d="M9.5 16h12.2" />
      <path d="m17.2 10.8 5.2 5.2-5.2 5.2" />
    </svg>
  );
}

function CursusButton({ children, dark = false, href = "#cursus-faq" }) {
  return (
    <a className={`cursus-btn ${dark ? "dark" : ""}`} href={href}>
      <span>{children}</span>
      <span className="cursus-btn-arrow" aria-hidden="true">
        <ButtonArrowIcon />
      </span>
    </a>
  );
}

function Pill({ children }) {
  return (
    <span className="cursus-pill">
      <span className="cursus-check" aria-hidden="true">
        ✓
      </span>
      {children}
    </span>
  );
}

function LanguageSwitch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="cursus-language">
      <button type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span className="cursus-flag" aria-hidden="true" />
        <span className="cursus-lang-arrow" aria-hidden="true" />
      </button>
      {open && (
        <div className="cursus-language-menu">
          <button type="button">English</button>
          <button type="button">Deutsch</button>
          <button type="button">Francais</button>
        </div>
      )}
    </div>
  );
}

function HeroIllustration() {
  return (
    <div className="cursus-hero-illustration" aria-hidden="true">
      <div className="hero-paper one" />
      <div className="hero-paper two" />
      <div className="hero-laptop">
        <span />
        <span />
      </div>
      <div className="hero-person">
        <i />
      </div>
      <div className="hero-chat left">A</div>
      <div className="hero-chat right">B</div>
    </div>
  );
}

function FeatureCard({ card, index }) {
  return (
    <article className={`cursus-feature-card card-${index + 1}`}>
      <img className="cursus-card-icon" src={card.icon} alt="" aria-hidden="true" />
      <span className="cursus-card-number">
        {card.number.slice(0, -1)}
        <i aria-hidden="true" />
      </span>
      <strong>{card.title}</strong>
      <p>
        <b>{card.kicker}</b>
        {card.text}
      </p>
    </article>
  );
}

function TestimonialSlider() {
  const [active, setActive] = useState(0);
  const current = testimonials[active];

  const next = () => setActive((value) => (value + 1) % testimonials.length);
  const prev = () => setActive((value) => (value - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="cursus-testimonial-band" aria-label="Testimonials">
      <article className="cursus-testimonial">
        <img className="testimonial-photo" src={asset("testimonial.png")} alt="" />
        <div className="testimonial-copy" key={current.name}>
          <h2>{current.title}</h2>
          <p>{current.text}</p>
          <strong>{current.name}</strong>
          <span className="testimonial-stars" aria-label="Five star rating">
            ★★★★★
          </span>
        </div>
        <div className="testimonial-controls">
          <button type="button" onClick={prev} aria-label="Previous testimonial">Prev</button>
          <button type="button" onClick={next} aria-label="Next testimonial">Next</button>
        </div>
      </article>
    </section>
  );
}

function FaqItem({ item, open, onClick }) {
  return (
    <article className={`cursus-faq-item ${open ? "open" : ""}`}>
      <button type="button" onClick={onClick} aria-expanded={open}>
        <span>{item.question}</span>
        <span className="faq-icon" aria-hidden="true">
          {open ? "−" : "+"}
        </span>
      </button>
      <div className="faq-answer">
        <p>{item.answer}</p>
      </div>
    </article>
  );
}

export default function CursusLanding() {
  const [openFaq, setOpenFaq] = useState(0);
  const visiblePills = useMemo(() => checklist.concat(heroPills.slice(0, 1)), []);

  return (
    <main className="cursus-page">
      <section className="cursus-hero" id="cursus-home">
        <header className="cursus-header">
          <a href="#cursus-home" className="cursus-logo">
            Cursus
          </a>
          <LanguageSwitch />
        </header>

        <div className="cursus-hero-grid">
          <div className="cursus-hero-copy">
            <small>Risus praesent vulputate.</small>
            <h1>
              Cursus Integer <span>Consequat Tristique.</span>
            </h1>
            <div className="cursus-pill-cloud">
              {heroPills.map((pill) => <Pill key={pill}>{pill}</Pill>)}
            </div>
            <CursusButton>Lorem Ipsum</CursusButton>
          </div>
          <HeroIllustration />
        </div>
      </section>

      <section className="cursus-intro">
        <div className="cursus-section-inner two-col">
          <div className="cursus-copy-block">
            <h2>Phasellus a vitae iaculis magna eleifend pulvinar velit odio.</h2>
            <h3>Vulputate et vulputate suspendisse natoque!</h3>
            <p>
              Euismod magna id purus eget nunc ligula suspendisse dui netus. Condimentum blandit
              rutrum at mauris enim pulvinar duis etiam duis vulputate et vulputate suspendisse.
            </p>
            <CursusButton dark>Lorem Ipsum</CursusButton>
          </div>
          <img className="cursus-illustration" src={asset("illustration-2.svg")} alt="" />
        </div>
      </section>

      <section className="cursus-process">
        <div className="cursus-section-inner process-grid">
          <div className="cursus-copy-block light">
            <p>Quisque porttitor vitae vel amet neque scelerisque mattis. Consectetur nibh velit magna consectetur leo.</p>
            <h2>Cursus Integer Conseq Aliquam Tristique.</h2>
            <CursusButton>Lorem Ipsum</CursusButton>
          </div>
          <div className="cursus-feature-grid">
            {featureCards.map((card, index) => <FeatureCard card={card} index={index} key={card.number} />)}
          </div>
        </div>
      </section>

      <TestimonialSlider />

      <section className="cursus-checks">
        <div className="cursus-section-inner two-col reverse">
          <div className="cursus-copy-block">
            <h2>Cursus Integer consequat Tristique.</h2>
            <div className="cursus-pill-stack">
              {visiblePills.slice(0, 6).map((pill) => <Pill key={pill}>{pill}</Pill>)}
            </div>
            <CursusButton dark>Lorem Ipsum</CursusButton>
          </div>
          <img className="cursus-illustration" src={asset("illustration-3.svg")} alt="" />
        </div>
      </section>

      <section className="cursus-faq" id="cursus-faq">
        <div className="cursus-section-inner">
          <div className="cursus-faq-head">
            <h2>Phasellus a vitae iaculis magna.</h2>
            <p>Phasellus a vitae iaculis magna eleifend pulvinar velit odio.</p>
          </div>
          <div className="cursus-faq-list">
            {faqs.map((item, index) => (
              <FaqItem
                item={item}
                key={item.question}
                open={openFaq === index}
                onClick={() => setOpenFaq((value) => (value === index ? -1 : index))}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="cursus-footer">
        <div className="cursus-footer-cta">
          <h2>Vulputate et pulvinar ethre Suspendisse tellus consecteur</h2>
          <CursusButton>Lorem Ipsum</CursusButton>
        </div>
        <div className="cursus-footer-bottom">
          <span>Copyright © 2022 Lorem Ipsum.</span>
          <a href="#cursus-home">Privacy Policy | Terms and Conditions</a>
        </div>
      </footer>
    </main>
  );
}
