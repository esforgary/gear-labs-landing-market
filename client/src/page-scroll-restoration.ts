type ScrollPosition = { x: number; y: number };

const storagePrefix = "gearlabs:page-scroll:v1:";
const restoreWindowMs = 15_000;
const scrollKeys = new Set(["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Tab", "Enter"]);

const routeKey = () => `${window.location.pathname}${window.location.search}${window.location.hash}`;

function readPosition(key: string): ScrollPosition | null {
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(storagePrefix + key) ?? "null");
    if (typeof value !== "object" || value === null) return null;
    const { x, y } = value as Partial<ScrollPosition>;
    return typeof x === "number" && Number.isFinite(x) && x >= 0 &&
      typeof y === "number" && Number.isFinite(y) && y >= 0 ? { x, y } : null;
  } catch {
    return null;
  }
}

/** Keep reload restoration separate from intentional anchor/constructor navigation. */
export function startPageScrollRestoration() {
  const initialRoute = routeKey();
  const navigation = window.performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
  let pendingPosition = navigation?.type === "reload" ? readPosition(initialRoute) : null;
  const previousScrollRestoration = window.history.scrollRestoration;
  let restoreFrame = 0;
  let saveFrame = 0;
  let anchorFrame = 0;
  let restoreTimer = 0;
  let observer: ResizeObserver | undefined;

  const savePosition = () => {
    try {
      // Do not overwrite a deep position with the temporarily short loading layout.
      const position = pendingPosition && routeKey() === initialRoute
        ? pendingPosition
        : { x: window.scrollX, y: window.scrollY };
      window.sessionStorage.setItem(storagePrefix + routeKey(), JSON.stringify(position));
    } catch {
      // Storage may be disabled or full; navigation should still work.
    }
  };

  const stopRestoring = () => {
    pendingPosition = null;
    window.cancelAnimationFrame(restoreFrame);
    window.clearTimeout(restoreTimer);
    observer?.disconnect();
    window.history.scrollRestoration = previousScrollRestoration;
  };

  const restorePosition = () => {
    restoreFrame = 0;
    if (!pendingPosition) return;
    if (routeKey() !== initialRoute) {
      stopRestoring();
      return;
    }

    const root = document.documentElement;
    const maxX = Math.max(0, root.scrollWidth - window.innerWidth);
    const maxY = Math.max(0, root.scrollHeight - window.innerHeight);
    const left = Math.min(pendingPosition.x, maxX);
    const top = Math.min(pendingPosition.y, maxY);
    if (Math.abs(window.scrollX - left) > 1 || Math.abs(window.scrollY - top) > 1) {
      window.scrollTo({ left, top, behavior: "instant" });
    }
  };

  const scheduleRestore = () => {
    if (pendingPosition && !restoreFrame) restoreFrame = window.requestAnimationFrame(restorePosition);
  };

  const scrollToRoute = () => {
    window.cancelAnimationFrame(anchorFrame);
    const deadline = window.performance.now() + restoreWindowMs;
    const scrollWhenMounted = () => {
      anchorFrame = 0;
      if (window.location.hash === "#constructor") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        const target = window.location.hash.slice(1);
        if (!target) return;
        const element = document.getElementById(target);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        } else if (window.performance.now() < deadline) {
          anchorFrame = window.requestAnimationFrame(scrollWhenMounted);
        }
      }
    };
    anchorFrame = window.requestAnimationFrame(scrollWhenMounted);
  };

  const handleRouteChange = () => {
    stopRestoring();
    scrollToRoute();
  };

  const handleScroll = () => {
    if (pendingPosition) {
      scheduleRestore();
      return;
    }
    if (!saveFrame) {
      saveFrame = window.requestAnimationFrame(() => {
        saveFrame = 0;
        savePosition();
      });
    }
  };

  const handleInteraction = () => {
    window.cancelAnimationFrame(anchorFrame);
    anchorFrame = 0;
    if (!pendingPosition) return;
    stopRestoring();
    savePosition();
  };
  const handleKeyDown = (event: KeyboardEvent) => {
    if (scrollKeys.has(event.key)) handleInteraction();
  };
  const handleVisibility = () => {
    if (document.visibilityState === "hidden") savePosition();
  };

  if (pendingPosition) {
    window.history.scrollRestoration = "manual";
    // Images, the catalog request and the lazy constructor can grow the page later.
    observer = new ResizeObserver(scheduleRestore);
    observer.observe(document.documentElement);
    observer.observe(document.body);
    scheduleRestore();
    restoreTimer = window.setTimeout(() => {
      stopRestoring();
      savePosition();
    }, restoreWindowMs);
  } else {
    scrollToRoute();
  }

  window.addEventListener("hashchange", handleRouteChange);
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", scheduleRestore);
  window.addEventListener("load", scheduleRestore);
  window.addEventListener("pagehide", savePosition);
  window.addEventListener("wheel", handleInteraction, { passive: true });
  window.addEventListener("touchstart", handleInteraction, { passive: true });
  window.addEventListener("pointerdown", handleInteraction, true);
  window.addEventListener("click", handleInteraction, true);
  window.addEventListener("keydown", handleKeyDown, true);
  document.addEventListener("visibilitychange", handleVisibility);

  return () => {
    savePosition();
    stopRestoring();
    window.cancelAnimationFrame(saveFrame);
    window.cancelAnimationFrame(anchorFrame);
    window.removeEventListener("hashchange", handleRouteChange);
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", scheduleRestore);
    window.removeEventListener("load", scheduleRestore);
    window.removeEventListener("pagehide", savePosition);
    window.removeEventListener("wheel", handleInteraction);
    window.removeEventListener("touchstart", handleInteraction);
    window.removeEventListener("pointerdown", handleInteraction, true);
    window.removeEventListener("click", handleInteraction, true);
    window.removeEventListener("keydown", handleKeyDown, true);
    document.removeEventListener("visibilitychange", handleVisibility);
  };
}
