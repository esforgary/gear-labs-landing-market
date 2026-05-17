import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { LayoutGroup, motion } from "framer-motion";
import "./pet-first-landing.scss";
import heroDog from "./img/hero-dog.png";
import parentingDog from "./img/parenting-dog.png";
import reviewer from "./img/reviewer.png";
import newsDog from "./img/news-dog.png";

const petImages = import.meta.glob("./img/pets/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
  query: "?url",
});

const petData = [
  { file: "cat-1.webp", type: "Cat", name: "Luna" },
  { file: "kesha.png", type: "Parrot", name: "Kesha" },
  { file: "dog-1.webp", type: "Dog", name: "Jasper" },
  { file: "corner.webp", type: "Parrot", name: "Rio" },
  { file: "dog-2.png", type: "Dog", name: "Archie" },
  { file: "cat-2.png", type: "Cat", name: "Snow" },
  { file: "dog-3.png", type: "Dog", name: "Bean" },
  { file: "cat-3.png", type: "Cat", name: "Nero" },
  { file: "rabbit-1.png", type: "Rabbit", name: "Rook" },
  { file: "dog-4.webp", type: "Dog", name: "Taco" },
  { file: "dog-5.png", type: "Dog", name: "Mochi" },
  { file: "cat-4.png", type: "Cat", name: "Misty" },
  { file: "rabbit-2.webp", type: "Rabbit", name: "Bun" },
];

const pets = petData
  .map((pet) => {
    const path = Object.keys(petImages).find((key) => key.endsWith(`/${pet.file}`));
    return path ? { ...pet, image: petImages[path] } : null;
  })
  .filter(Boolean);

const fallbackPets = [
  { type: "Dog", name: "Jasper", image: heroDog },
];

const petBackgrounds = ["#ffc10b", "#1b9fa9", "#efe7cf", "#f5edd8", "#003646", "#d9cfac", "#79b5ad", "#fff8df"];

const services = [
  {
    title: "Pharmacy",
    copy:
      "Apoquel is an oral tablet that works differently than other allergy medications. It goes straight to the source to help relieve itch and inflammation at its core.",
    icon: "stethoscope",
  },
  {
    title: "Breed-specific Haircuts",
    copy:
      "Regular grooming is essential to your pet's health as it helps prevent skin issues such as matting.",
    icon: "feather",
  },
  {
    title: "Cloths",
    copy:
      "Is your closet ready for cold walks? Don't forget a comfortable raincoat for your pet's next trip.",
    icon: "shirt",
  },
  {
    title: "Meal Plans",
    copy:
      "Balanced meals are matched to age, breed, and daily activity so every pet gets the right routine.",
    icon: "bowl",
  },
  {
    title: "Vet Visits",
    copy:
      "Book gentle checkups, vaccines, and follow-up care without losing track of your pet's wellness plan.",
    icon: "calendar",
  },
];

function getServiceAt(index) {
  const serviceIndex = (index + services.length) % services.length;
  return {
    ...services[serviceIndex],
    serviceIndex,
  };
}

const reviews = [
  "As we continue to push for better regulation in the Australian pet food industry, it can be hard to trust many pet food brands. Our 2021 Best Cat Food in Australia list will offer you a great starting point in deciding what to feed your cat.",
  "The team helped us build a calmer weekly routine: grooming, better food, and quick answers whenever our dog needed extra care.",
  "Pet-First feels practical and kind. The service cards are clear, appointments are fast, and the wellness advice is easy to follow.",
];

const footerLinks = ["About", "Project", "Service", "Client", "Team", "Blog", "Contact"];

const petLayoutTransition = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 0.8,
};

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function Icon({ type }) {
  if (type === "feather") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M34 5c-9 2-18 11-21 22-1 4 1 7 4 9 3 1 7 1 10-2 8-7 12-18 7-29Z" />
        <path d="M14 36c6-10 13-17 22-28" />
      </svg>
    );
  }

  if (type === "shirt") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M17 8 9 12l-5 9 8 4 4-5v21h16V20l4 5 8-4-5-9-8-4c-2 4-12 4-14 0Z" />
      </svg>
    );
  }

  if (type === "bowl") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M8 25h32c0 9-6 15-16 15S8 34 8 25Z" />
        <path d="M14 25c1-5 5-8 10-8s9 3 10 8" />
        <path d="M18 11c0 4-4 4-4 8" />
        <path d="M26 8c0 4-4 5-4 9" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <rect x="9" y="12" width="30" height="28" rx="5" />
        <path d="M15 8v8" />
        <path d="M33 8v8" />
        <path d="M9 21h30" />
        <path d="m17 31 4 4 10-10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M17 7v12c0 6 4 11 9 11s9-5 9-11V7" />
      <path d="M13 7h8" />
      <path d="M31 7h8" />
      <path d="M26 30v4c0 4-3 7-7 7s-7-3-7-7v-3" />
      <circle cx="12" cy="28" r="3" />
    </svg>
  );
}

function SocialIcon({ type }) {
  if (type === "facebook") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.1 8.1V6.6c0-.8.6-1.1 1.2-1.1h1.4V2.8c-.7-.1-1.5-.2-2.2-.2-2.4 0-4.1 1.5-4.1 4.1v1.4H7.8v3h2.6v7.5h3.1v-7.5h2.5l.4-3h-2.3Z" />
      </svg>
    );
  }

  if (type === "x") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14.5 10.4 20.4 3h-2.7l-4.5 5.7L9.5 3H3.4l6.3 9.2L3 21h2.7l5.3-6.7 4.4 6.7h6.1l-7-10.6Zm-2.4 2-1.1-1.6L6.2 5.1h2.1l3.6 5.4 1.1 1.6 5 6.8h-2.1l-3.8-6.5Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.2" y="4.2" width="15.6" height="15.6" rx="4.4" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="16.7" cy="7.3" r="1" />
    </svg>
  );
}

function LoopDecor() {
  return (
    <svg className="pet-first-loop" viewBox="0 0 170 170" aria-hidden="true">
      <path d="M26 94c24-52 102-67 127-25 18 30-27 67-70 38-37-25-5-78 42-69 35 7 46 48 18 72-34 30-97 13-110-30" />
      <path d="M19 84c25-61 116-76 143-26 20 37-35 78-83 43-39-29 0-88 51-72" />
      <path d="M13 106c34 28 91 36 125 4" />
    </svg>
  );
}

function ScratchDecor({ light = false }) {
  return (
    <svg className={`pet-first-scratch ${light ? "is-light" : ""}`} viewBox="0 0 90 96" aria-hidden="true">
      <path d="M67 5 40 74" />
      <path d="M80 20 54 88" />
      <path d="M45 1 18 66" />
      <path d="M25 18 7 63" />
    </svg>
  );
}

function BoneDecor() {
  return (
    <svg className="pet-first-bone" viewBox="0 0 92 92" aria-hidden="true">
      <path d="M23 22c-3-7 2-15 10-15 5 0 9 3 11 7 4-4 10-5 15-2 7 4 8 13 2 18l-9 9 13 13c6-5 15-4 18 3 4 7-1 15-9 16-1 8-10 12-17 8-6-3-7-11-3-17L41 49l-9 9c-5 6-14 5-18-2-3-5-2-11 2-15-4-2-7-6-7-11 0-8 8-13 14-8Z" />
    </svg>
  );
}

function ServiceCard({ service, active, exiting, onExplore }) {
  const tiltClass = `is-tilt-${(service.serviceIndex % 3) + 1}`;

  return (
    <article
      className={`pet-first-service-card ${tiltClass} ${active ? "is-active" : ""} ${
        exiting ? "is-exiting" : ""
      }`}
    >
      <div className="pet-first-service-inner">
        <span className="pet-first-service-icon">
          <Icon type={service.icon} />
        </span>
        <h3>{service.title}</h3>
        <p>{service.copy}</p>
        <button type="button" onClick={() => onExplore(service.title)}>
          Explore
        </button>
      </div>
    </article>
  );
}

export default function PetFirstLanding() {
  const initialPetIndex = Math.max(0, pets.findIndex((pet) => pet.name === "Jasper"));
  const activePetRef = useRef(null);
  const petEdgeFrameRef = useRef(null);
  const petScrollerRef = useRef(null);
  const reviewQuoteRef = useRef(null);
  const [petIndex, setPetIndex] = useState(initialPetIndex);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [serviceSlide, setServiceSlide] = useState(null);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewWaveCount, setReviewWaveCount] = useState(5);
  const [mail, setMail] = useState("");
  const [notice, setNotice] = useState("");
  const petItems = useMemo(() => {
    const source = pets.length ? pets : fallbackPets;

    return source.map((pet, index) => ({
      ...pet,
      bg: petBackgrounds[(Math.floor(Math.random() * petBackgrounds.length) + index) % petBackgrounds.length],
    }));
  }, []);
  const petColumns = useMemo(() => {
    if (!petItems.length) return [];

    const activeItem = petItems[petIndex] ?? petItems[0];
    const rows = [[], []];

    petItems.forEach((pet, index) => {
      if (index === petIndex) return;
      const row = index % 2;
      rows[row].push({ pet, index, row });
    });

    if (rows[0].length > rows[1].length) {
      const moveIndex = rows[0].findIndex((item) => item.index > petIndex);
      const [movedItem] = rows[0].splice(moveIndex >= 0 ? moveIndex : rows[0].length - 1, 1);

      if (movedItem) {
        rows[1].push({ ...movedItem, row: 1 });
        rows[1].sort((a, b) => a.index - b.index);
      }
    } else if (rows[1].length > rows[0].length) {
      const moveIndex = rows[1].findIndex((item) => item.index > petIndex);
      const [movedItem] = rows[1].splice(moveIndex >= 0 ? moveIndex : rows[1].length - 1, 1);

      if (movedItem) {
        rows[0].push({ ...movedItem, row: 0 });
        rows[0].sort((a, b) => a.index - b.index);
      }
    }

    const smallColumnCount = Math.max(rows[0].length, rows[1].length);
    const activeColumnIndex = Math.min(Math.floor(petIndex / 2), smallColumnCount);
    const columns = [];

    for (let columnIndex = 0; columnIndex <= smallColumnCount; columnIndex += 1) {
      if (columnIndex === activeColumnIndex) {
        columns.push({
          key: `active-${activeItem.name}`,
          type: "active",
          items: [{ pet: activeItem, index: petIndex }],
        });
      }

      if (columnIndex < smallColumnCount) {
        const columnItems = [rows[0][columnIndex], rows[1][columnIndex]].filter(Boolean);
        columns.push({
          key: `small-${columnIndex}`,
          type: "small",
          items: columnItems,
        });
      }
    }

    return columns;
  }, [petItems, petIndex]);
  const visibleServices = useMemo(() => Array.from({ length: 3 }, (_, index) => getServiceAt(serviceIndex + index)), [
    serviceIndex,
  ]);
  const serviceTrack = useMemo(() => {
    if (serviceSlide === "next") {
      return Array.from({ length: 4 }, (_, index) => getServiceAt(serviceIndex + index));
    }

    if (serviceSlide === "prev") {
      return Array.from({ length: 4 }, (_, index) => getServiceAt(serviceIndex - 1 + index));
    }

    return visibleServices;
  }, [serviceIndex, serviceSlide, visibleServices]);

  const updatePetEdgeState = useCallback(() => {
    const scroller = petScrollerRef.current;
    if (!scroller) return;

    const viewport = scroller.getBoundingClientRect();
    const maxScroll = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    const canFadeLeft = scroller.scrollLeft > 2;
    const canFadeRight = scroller.scrollLeft < maxScroll - 2;
    const isCompactScroller = viewport.width <= 980;
    const fadeZone = isCompactScroller
      ? Math.max(44, Math.min(72, viewport.width * 0.1))
      : Math.max(150, Math.min(240, viewport.width * 0.18));
    const leftEdge = viewport.left + 4;
    const rightEdge = viewport.right - 4;

    scroller.querySelectorAll(".pet-first-pet").forEach((item) => {
      const rect = item.getBoundingClientRect();
      const center = rect.left + rect.width / 2;
      const leftVisibility = canFadeLeft ? Math.max(0, Math.min(1, (center - leftEdge) / fadeZone)) : 1;
      const rightVisibility = canFadeRight ? Math.max(0, Math.min(1, (rightEdge - center) / fadeZone)) : 1;
      const visibility = Math.min(leftVisibility, rightVisibility);
      const easedVisibility = visibility * visibility * (3 - 2 * visibility);
      const scale = 0.06 + easedVisibility * 0.94;
      const opacity = Math.max(0, easedVisibility ** 1.45);

      item.style.setProperty("--pet-edge-scale", scale.toFixed(3));
      item.style.setProperty("--pet-edge-pop-start", (scale * 0.86).toFixed(3));
      item.style.setProperty("--pet-edge-pop-peak", (scale * 1.045).toFixed(3));
      item.style.setProperty("--pet-edge-opacity", opacity.toFixed(3));
      item.style.setProperty("opacity", (item.classList.contains("active") ? opacity : opacity * 0.62).toFixed(3));
    });
  }, []);

  const runPetEdgeAnimation = useCallback(
    (duration = 1100) => {
      if (petEdgeFrameRef.current) {
        window.cancelAnimationFrame(petEdgeFrameRef.current);
      }

      const startedAt = window.performance.now();

      const tick = (now) => {
        updatePetEdgeState();

        if (now - startedAt < duration) {
          petEdgeFrameRef.current = window.requestAnimationFrame(tick);
          return;
        }

        petEdgeFrameRef.current = null;
        updatePetEdgeState();
      };

      petEdgeFrameRef.current = window.requestAnimationFrame(tick);
    },
    [updatePetEdgeState],
  );

  useLayoutEffect(() => {
    const scroller = petScrollerRef.current;
    const activePet = activePetRef.current;
    if (!scroller || !activePet) return;

    const viewport = scroller.getBoundingClientRect();
    const activeRect = activePet.getBoundingClientRect();
    const shouldCenterActivePet = viewport.width <= 980;
    const safeInset = Math.max(34, Math.min(90, scroller.clientWidth * 0.075));
    const safeLeft = viewport.left + safeInset;
    const safeRight = viewport.right - safeInset;
    let nextScroll = scroller.scrollLeft;

    if (shouldCenterActivePet) {
      nextScroll += activeRect.left + activeRect.width / 2 - (viewport.left + viewport.width / 2);
    } else if (activeRect.left < safeLeft) {
      nextScroll -= safeLeft - activeRect.left;
    } else if (activeRect.right > safeRight) {
      nextScroll += activeRect.right - safeRight;
    }

    if (nextScroll !== scroller.scrollLeft) {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      scroller.scrollTo({
        behavior: "smooth",
        left: Math.max(0, Math.min(maxScroll, nextScroll)),
      });
    }

    runPetEdgeAnimation();
  }, [petIndex, runPetEdgeAnimation]);

  useEffect(() => {
    const scroller = petScrollerRef.current;
    if (!scroller) return undefined;

    const handleScroll = () => updatePetEdgeState();
    const handleResize = () => updatePetEdgeState();
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    updatePetEdgeState();

    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      if (petEdgeFrameRef.current) {
        window.cancelAnimationFrame(petEdgeFrameRef.current);
        petEdgeFrameRef.current = null;
      }
    };
  }, [petItems.length, updatePetEdgeState]);

  useEffect(() => {
    if (petItems.length < 2) return undefined;

    const timer = window.setInterval(() => {
      setPetIndex((current) => (current + 1) % petItems.length);
    }, 10000);

    return () => window.clearInterval(timer);
  }, [petItems.length, petIndex]);

  useLayoutEffect(() => {
    const quote = reviewQuoteRef.current;
    if (!quote) return undefined;

    const syncWave = () => {
      const width = quote.getBoundingClientRect().width;
      const preferredStep = width < 480 ? 72 : width < 680 ? 88 : 108;
      const waveCount = Math.max(3, Math.round(width / preferredStep));
      quote.style.setProperty("--review-wave-step", `${width / waveCount}px`);
      setReviewWaveCount((current) => (current === waveCount ? current : waveCount));
    };

    syncWave();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", syncWave);
      return () => window.removeEventListener("resize", syncWave);
    }

    const observer = new ResizeObserver(syncWave);
    observer.observe(quote);

    return () => observer.disconnect();
  }, [reviewIndex]);

  const changePet = (direction) => {
    if (!petItems.length) return;
    setPetIndex((current) => (current + direction + petItems.length) % petItems.length);
  };

  const changeService = (direction) => {
    if (serviceSlide) return;
    setServiceSlide(direction > 0 ? "next" : "prev");
  };

  const handleServiceSlideEnd = (event) => {
    if (event.target !== event.currentTarget || !serviceSlide) return;
    const direction = serviceSlide === "next" ? 1 : -1;
    setServiceIndex((current) => (current + direction + services.length) % services.length);
    setServiceSlide(null);
  };

  const changeReview = (direction) => {
    setReviewIndex((current) => (current + direction + reviews.length) % reviews.length);
  };

  const handleExplore = (title) => {
    setNotice(`${title} selected`);
    scrollToSection("pet-first-parenting");
  };

  const handleSubscribe = (event) => {
    event.preventDefault();
    setNotice(mail ? "Thanks. Pet updates are on the way." : "Enter mail to subscribe");
  };

  return (
    <main className="pet-first-page">
      <section className="pet-first-hero" id="pet-first-home">
        <header className="pet-first-header">
          <button className="pet-first-logo" type="button" onClick={() => scrollToSection("pet-first-home")}>
            Pet-First
          </button>
          <nav aria-label="Pet-First navigation">
            <button type="button" onClick={() => scrollToSection("pet-first-service")}>
              Service
            </button>
            <button type="button" onClick={() => scrollToSection("pet-first-parenting")}>
              Meal Care
            </button>
            <button type="button" onClick={() => scrollToSection("pet-first-footer")}>
              Blog
            </button>
          </nav>
          <button className="pet-first-sign" type="button" onClick={() => scrollToSection("pet-first-subscribe")}>
            Sign up
          </button>
        </header>

        <div className="pet-first-hero-copy">
          <div className="pet-first-availability">
            <span />
            Available in select states
          </div>
          <h1>
            A PET-FIRST
            <span>APPROACH TO</span>
            WELLNESS
          </h1>
          <button type="button" onClick={() => scrollToSection("pet-first-service")}>
            Learn More
          </button>
        </div>

        <div className="pet-first-hero-visual">
          <img src={heroDog} alt="Dog in a black hoodie" />
          <div className="pet-first-hero-controls" aria-label="Pet slider controls">
            <button type="button" onClick={() => changePet(-1)} aria-label="Previous pet">
              <span>‹</span>
            </button>
            <div>
              {petItems.map((pet, index) => (
                <button
                  key={pet.name}
                  type="button"
                  className={index === petIndex ? "active" : ""}
                  onClick={() => setPetIndex(index)}
                  aria-label={`Show ${pet.name}`}
                />
              ))}
            </div>
            <button type="button" onClick={() => changePet(1)} aria-label="Next pet">
              <span>›</span>
            </button>
          </div>
        </div>
      </section>

      <section className="pet-first-strip" aria-label="Pet categories">
        <BoneDecor />
        <div className="pet-first-count">
          <span>45+</span>
          <small>different category</small>
        </div>
        <div className="pet-first-pets" ref={petScrollerRef} tabIndex={0} aria-label="Scrollable pet list">
          <LayoutGroup id="pet-first-pets">
            <motion.div className="pet-first-pet-list" layout transition={petLayoutTransition}>
              {petColumns.map((column) => (
                <motion.div
                  className={`pet-first-pet-column ${column.type === "active" ? "is-active" : ""}`}
                  key={column.key}
                  layout
                  transition={petLayoutTransition}
                >
                  {column.items.map(({ pet, index, row = 0 }) => {
                    const isActive = index === petIndex;

                    return (
                      <motion.button
                        key={pet.name}
                        ref={isActive ? activePetRef : undefined}
                        type="button"
                        className={`pet-first-pet ${isActive ? "active" : ""}`}
                        style={{ "--pet-bg": pet.bg, gridRow: isActive ? undefined : row + 1 }}
                        onClick={() => setPetIndex(index)}
                        aria-label={`Select ${pet.type} ${pet.name}`}
                        layout
                        layoutId={`pet-first-${pet.name}`}
                        transition={petLayoutTransition}
                      >
                        {isActive ? (
                          <span className="pet-first-active-label">
                            {pet.type} <small>({pet.name})</small>
                          </span>
                        ) : null}
                        <img src={pet.image} alt={`${pet.type} ${pet.name}`} />
                      </motion.button>
                    );
                  })}
                </motion.div>
              ))}
            </motion.div>
          </LayoutGroup>
        </div>
      </section>

      <section className="pet-first-services" id="pet-first-service">
        <h2>Our Service</h2>
        <div className={`pet-first-services-viewport ${serviceSlide ? "is-sliding" : ""}`}>
          <div
            className={`pet-first-services-row ${serviceSlide ? `is-track is-${serviceSlide}` : ""}`}
            onAnimationEnd={handleServiceSlideEnd}
          >
            {serviceTrack.map((service, index) => (
              <ServiceCard
                key={`service-${service.serviceIndex}`}
                service={service}
                active={
                  serviceSlide === "next"
                    ? index === 1
                    : serviceSlide === "prev"
                      ? index === 0
                      : index === 0
                }
                exiting={
                  serviceSlide === "next"
                    ? index === 0
                    : serviceSlide === "prev"
                      ? index === 3
                      : false
                }
                onExplore={handleExplore}
              />
            ))}
          </div>
        </div>
        <div className="pet-first-arrow-set">
          <button type="button" onClick={() => changeService(-1)} aria-label="Previous service">
            ←
          </button>
          <button type="button" onClick={() => changeService(1)} aria-label="Next service">
            →
          </button>
        </div>
        <ScratchDecor />
      </section>

      <section className="pet-first-parenting" id="pet-first-parenting">
        <div className="pet-first-parenting-image">
          <img src={parentingDog} alt="Woman smiling with a dog" />
        </div>
        <div className="pet-first-parenting-copy">
          <h2>Making pet parenting easy for everyone</h2>
          <p>
            Could this be the dog with the longest tail? The Rampur Greyhound, shy, sensitive, alert and faithful.
            This is a breed that has climbed its way to being top dog because of its intelligence.
          </p>
          <ul>
            <li>Adoption</li>
            <li>Frozen Raw</li>
            <li>Next Day Delivery</li>
          </ul>
          <button type="button" onClick={() => scrollToSection("pet-first-reviews")}>
            Explore
          </button>
        </div>
        <ScratchDecor light />
      </section>

      <section className="pet-first-reviews" id="pet-first-reviews">
        <div className="pet-first-review-photo">
          <div className="pet-first-review-photo-frame">
            <img src={reviewer} alt="Customer portrait" />
          </div>
          <span className="pet-first-quote">”</span>
          <div className="pet-first-review-dots" aria-hidden="true">
            {reviews.map((_, index) => (
              <span key={index} className={index === reviewIndex ? "active" : ""} />
            ))}
          </div>
        </div>
        <div className="pet-first-review-copy">
          <h2>Customer Reviews</h2>
          <blockquote key={reviewIndex} ref={reviewQuoteRef}>
            <span>{reviews[reviewIndex]}</span>
            <div className="pet-first-review-wave" aria-hidden="true">
              {Array.from({ length: reviewWaveCount }).map((_, index) => (
                <i key={index} />
              ))}
            </div>
          </blockquote>
          <div className="pet-first-arrow-set">
            <button type="button" onClick={() => changeReview(-1)} aria-label="Previous review">
              ←
            </button>
            <button type="button" onClick={() => changeReview(1)} aria-label="Next review">
              →
            </button>
          </div>
        </div>
      </section>

      <section className="pet-first-subscribe" id="pet-first-subscribe">
        <div className="pet-first-subscribe-dog">
          <img src={newsDog} alt="Dog waiting for news" />
        </div>
        <form className="pet-first-subscribe-form" onSubmit={handleSubscribe}>
          <LoopDecor />
          <h2>Subscribe &amp; Get Pet Updatenews</h2>
          <label>
            <span>Mail</span>
            <input value={mail} onChange={(event) => setMail(event.target.value)} type="email" />
            <button type="submit" aria-label="Subscribe">
              →
            </button>
          </label>
        </form>
      </section>

      <footer className="pet-first-footer" id="pet-first-footer">
        <div className="pet-first-footer-brand">Pet-First</div>
        <div>
          <nav aria-label="Footer navigation">
            {footerLinks.map((link) => (
              <button key={link} type="button" onClick={() => scrollToSection("pet-first-home")}>
                {link}
              </button>
            ))}
          </nav>
          <div className="pet-first-social">
            <span>Flow</span>
            <button type="button" aria-label="Facebook">
              <SocialIcon type="facebook" />
            </button>
            <button type="button" aria-label="X">
              <SocialIcon type="x" />
            </button>
            <button type="button" aria-label="Instagram">
              <SocialIcon type="instagram" />
            </button>
          </div>
        </div>
      </footer>

      {notice && (
        <button className="pet-first-notice" type="button" onClick={() => setNotice("")}>
          {notice}
        </button>
      )}
    </main>
  );
}
