type DaypartBackground = "spotlight-rings" | "edge-particles" | "scroll-orbs" | "spark-stars";

let backgroundLayer: HTMLDivElement | null = null;
let activeEffect: DaypartBackground | null = null;
let edgeParticlesInterval: number | null = null;
let daypartCheckInterval: number | null = null;
let cleanupCallbacks: Array<() => void> = [];

const getDaypartBackground = (date = new Date()): DaypartBackground => {
  const minutes = date.getHours() * 60 + date.getMinutes();

  if (minutes >= 6 * 60 + 1 && minutes <= 11 * 60) return "spotlight-rings";
  if (minutes >= 11 * 60 + 1 && minutes <= 17 * 60) return "edge-particles";
  if (minutes >= 17 * 60 + 1 && minutes <= 21 * 60) return "scroll-orbs";

  return "spark-stars";
};

const clearEffectRuntime = () => {
  if (edgeParticlesInterval) {
    window.clearInterval(edgeParticlesInterval);
    edgeParticlesInterval = null;
  }

  cleanupCallbacks.forEach((cleanup) => cleanup());
  cleanupCallbacks = [];
};

const resetLayer = (layer: HTMLDivElement, effect: DaypartBackground) => {
  clearEffectRuntime();
  layer.className = `daypart-background daypart-background--${effect}`;
  layer.innerHTML = "";
  activeEffect = effect;
};

const createEdgeParticle = (layer: HTMLElement, fromLeft: boolean) => {
  const particle = document.createElement("span");
  particle.className = "daypart-background__edge-particle";

  const size = Math.random() * 15 + 5;
  particle.style.width = `${size}px`;
  particle.style.height = `${size}px`;
  particle.style.background = fromLeft ? "var(--orange)" : "var(--blue)";
  particle.style.boxShadow = fromLeft
    ? "0 0 18px color-mix(in srgb, var(--orange) 34%, transparent)"
    : "0 0 18px color-mix(in srgb, var(--blue) 34%, transparent)";
  particle.style.left = fromLeft ? "-30px" : "calc(100vw + 30px)";
  particle.style.top = `${Math.random() * window.innerHeight}px`;

  layer.appendChild(particle);

  const travel = window.innerWidth / 2 + 60;
  const waves = Math.random() * 3 + 2;
  const amplitude = Math.random() * 200 + 50;
  const phase = Math.random() * Math.PI * 2;
  const duration = Math.random() * 18000 + 12000;

  const keyframes = Array.from({ length: 50 }).map((_, index) => {
    const progress = index / 49;
    const x = progress * travel * (fromLeft ? 1 : -1);
    const y = Math.sin(progress * waves * Math.PI * 2 + phase) * amplitude;
    const opacity = Math.max(0, 0.74 * Math.pow(1 - progress, 1.55));

    return { transform: `translateX(${x}px) translateY(${y}px)`, opacity };
  });

  const animation = particle.animate(keyframes, {
    duration,
    easing: "ease-in-out",
    fill: "forwards",
  });

  animation.onfinish = () => particle.remove();

  const timeoutId = window.setTimeout(() => particle.remove(), duration + 500);
  cleanupCallbacks.push(() => window.clearTimeout(timeoutId));
};

const renderEdgeParticles = (layer: HTMLDivElement) => {
  for (let index = 0; index < 8; index += 1) {
    const timeoutId = window.setTimeout(() => createEdgeParticle(layer, index % 2 === 0), index * 150);
    cleanupCallbacks.push(() => window.clearTimeout(timeoutId));
  }

  edgeParticlesInterval = window.setInterval(() => {
    createEdgeParticle(layer, true);
    createEdgeParticle(layer, false);
  }, 600);
};

const renderSparkStars = (layer: HTMLDivElement) => {
  Array.from({ length: 84 }).forEach((_, index) => {
    const star = document.createElement("span");
    star.className = "daypart-background__star";

    const color =
      index % 3 === 0 ? "var(--orange)" : index % 3 === 1 ? "var(--blue)" : "var(--text-primary)";
    const size = Math.random() * 4 + 3;

    star.style.setProperty("--star-x", `${Math.random() * 100}%`);
    star.style.setProperty("--star-y", `${Math.random() * 100}%`);
    star.style.setProperty("--star-size", `${size}px`);
    star.style.setProperty("--star-delay", `${Math.random() * -7}s`);
    star.style.setProperty("--star-duration", `${Math.random() * 3.8 + 3.2}s`);
    star.style.setProperty("--star-color", color);
    layer.appendChild(star);
  });
};

const renderSpotlightRings = (layer: HTMLDivElement) => {
  Array.from({ length: 5 }).forEach((_, index) => {
    const ring = document.createElement("span");
    ring.className = "daypart-background__ring";
    ring.style.setProperty("--ring-x", `${14 + Math.random() * 76}%`);
    ring.style.setProperty("--ring-y", `${12 + Math.random() * 72}%`);
    ring.style.setProperty("--ring-size", `${180 + Math.random() * 280}px`);
    ring.style.setProperty("--ring-delay", `${index * -1.8}s`);
    ring.style.setProperty("--ring-color", index % 2 === 0 ? "var(--blue)" : "var(--orange)");
    layer.appendChild(ring);
  });
};

const renderScrollOrbs = (layer: HTMLDivElement) => {
  Array.from({ length: 7 }).forEach((_, index) => {
    const orb = document.createElement("span");
    orb.className = "daypart-background__orb";
    orb.style.setProperty("--orb-x", `${Math.random() * 100}%`);
    orb.style.setProperty("--orb-y", `${Math.random() * 100}%`);
    orb.style.setProperty("--orb-size", `${120 + Math.random() * 260}px`);
    orb.style.setProperty("--orb-delay", `${index * -2.4}s`);
    orb.style.setProperty("--orb-color", index % 2 === 0 ? "var(--orange)" : "var(--blue)");
    layer.appendChild(orb);
  });
};

const renderEffect = (layer: HTMLDivElement, effect: DaypartBackground) => {
  resetLayer(layer, effect);

  if (effect === "edge-particles") renderEdgeParticles(layer);
  if (effect === "spark-stars") renderSparkStars(layer);
  if (effect === "spotlight-rings") renderSpotlightRings(layer);
  if (effect === "scroll-orbs") renderScrollOrbs(layer);
};

export function startFloatingParticles() {
  if (backgroundLayer) {
    return () => undefined;
  }

  backgroundLayer = document.createElement("div");
  backgroundLayer.setAttribute("aria-hidden", "true");
  document.body.prepend(backgroundLayer);

  renderEffect(backgroundLayer, getDaypartBackground());

  daypartCheckInterval = window.setInterval(() => {
    if (!backgroundLayer) return;

    const nextEffect = getDaypartBackground();
    if (nextEffect !== activeEffect) renderEffect(backgroundLayer, nextEffect);
  }, 60_000);

  return () => {
    if (daypartCheckInterval) {
      window.clearInterval(daypartCheckInterval);
      daypartCheckInterval = null;
    }

    clearEffectRuntime();
    backgroundLayer?.remove();
    backgroundLayer = null;
    activeEffect = null;
  };
}
