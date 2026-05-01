export function startFloatingParticles() {
  function createParticle(fromLeft: boolean) {
    const particle = document.createElement("span");
    particle.className = "floating-particle";

    // размер 5-20 px
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    // цвет
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    particle.style.background = bodyBg === "rgb(255, 255, 255)" ? "var(--silver)" : "white";

    // старт
    particle.style.position = "fixed";
    particle.style.left = fromLeft ? "-30px" : "calc(100vw + 30px)";
    particle.style.top = Math.random() * window.innerHeight + "px";

    particle.style.zIndex = "-1"; // за контентом
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";

    document.body.appendChild(particle);

    // параметры зигзага
    const travel = window.innerWidth + 60; // расстояние до противоположного края
    const waves = Math.random() * 3 + 2; // 2-5 колебаний
    const amplitude = Math.random() * 200 + 50; // 50-250 px
    const phase = Math.random() * Math.PI * 2; // случайная фаза
    const duration = Math.random() * 18000 + 12000; // 12-32 сек

    const keyframes = Array.from({ length: 50 }).map((_, i) => {
      const progress = i / 49;
      const x = progress * travel * (fromLeft ? 1 : -1);
      const y = Math.sin(progress * waves * Math.PI * 2 + phase) * amplitude;
      const opacity = 1 - progress;
      return { transform: `translateX(${x}px) translateY(${y}px)`, opacity };
    });

    particle.animate(keyframes, {
      duration,
      easing: "ease-in-out",
      fill: "forwards"
    });

    setTimeout(() => particle.remove(), duration + 500);
  }

  // поток частиц
  setInterval(() => {
    createParticle(true);
    createParticle(false);
  }, 600);
}
