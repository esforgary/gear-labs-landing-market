let floatingParticlesInterval: number | null = null;

export function startFloatingParticles() {
  if (floatingParticlesInterval) {
    return () => undefined;
  }

  function createParticle(fromLeft: boolean) {
    const particle = document.createElement("span");
    particle.className = "floating-particle";

    // размер 5-20 px
    const size = Math.random() * 15 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.background = fromLeft ? "var(--orange)" : "var(--blue)";
    particle.style.boxShadow = fromLeft
      ? "0 0 18px color-mix(in srgb, var(--orange) 34%, transparent)"
      : "0 0 18px color-mix(in srgb, var(--blue) 34%, transparent)";

    // старт
    particle.style.position = "fixed";
    particle.style.left = fromLeft ? "-30px" : "calc(100vw + 30px)";
    particle.style.top = Math.random() * window.innerHeight + "px";

    particle.style.zIndex = "0";
    particle.style.borderRadius = "50%";
    particle.style.pointerEvents = "none";

    document.body.appendChild(particle);

    // частицы летят только к центру и исчезают там, чтобы не спорить с контентом
    const travel = window.innerWidth / 2 + 60;
    const waves = Math.random() * 3 + 2; // 2-5 колебаний
    const amplitude = Math.random() * 200 + 50; // 50-250 px
    const phase = Math.random() * Math.PI * 2; // случайная фаза
    const duration = Math.random() * 18000 + 12000; // 12-32 сек

    const keyframes = Array.from({ length: 50 }).map((_, i) => {
      const progress = i / 49;
      const x = progress * travel * (fromLeft ? 1 : -1);
      const y = Math.sin(progress * waves * Math.PI * 2 + phase) * amplitude;
      const opacity = Math.max(0, 0.74 * Math.pow(1 - progress, 1.55));
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
  floatingParticlesInterval = window.setInterval(() => {
    createParticle(true);
    createParticle(false);
  }, 600);

  return () => {
    if (floatingParticlesInterval) {
      window.clearInterval(floatingParticlesInterval);
      floatingParticlesInterval = null;
    }

    document.querySelectorAll(".floating-particle").forEach((particle) => particle.remove());
  };
}
