import 'bootstrap/dist/css/bootstrap.min.css';
import './App.scss'; 
import Container from 'react-bootstrap/Container';

import Header from "./components/header/header";
import { Banner } from './components/banner/banner';
import { Technologys } from './components/technologys/technologys';
import AboutUs from './components/ab/about-us';
import FitbackForm from './components/fitback_form/fitback-form';
import WorkShop from './components/work_shop/work-shop';
import Footer from './components/footer/footer';
import SiteBuilderPromo from './components/site_builder_promo/site-builder-promo';
import FaqChatBot from './components/chat_bot/FaqChatBot';
import { ThemeLangProvider } from './context/ThemeLangContext';
import { ProjectSelectionProvider } from './context/ProjectSelectionContext';
import { startFloatingParticles } from './components/scripts/floatingParticles';

import { Suspense, lazy, useEffect, useRef, useState, type CSSProperties } from "react";

const SiteBuilderPage = lazy(() => import("./pages/site_builder/site-builder-page"));

type GlobalTooltipState = {
  text: string;
  x: number;
  y: number;
  placement: "top" | "bottom";
};

function App() {
  const [isBuilderPage, setIsBuilderPage] = useState(() => window.location.hash === "#constructor");
  const [globalTooltip, setGlobalTooltip] = useState<GlobalTooltipState | null>(null);
  const tooltipTimerRef = useRef<number | null>(null);
  const tooltipTargetRef = useRef<HTMLElement | null>(null);

  useEffect(() => startFloatingParticles(), []);

  useEffect(() => {
    const syncRoute = () => setIsBuilderPage(window.location.hash === "#constructor");

    window.addEventListener("hashchange", syncRoute);
    syncRoute();

    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);

  useEffect(() => {
    if (isBuilderPage) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const target = window.location.hash.replace("#", "");
    if (!target) return;

    requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [isBuilderPage]);

  useEffect(() => {
    document.body.classList.toggle("is-builder-route", isBuilderPage);
    return () => document.body.classList.remove("is-builder-route");
  }, [isBuilderPage]);

  useEffect(() => {
    const titleSelector = "[title]";
    const tooltipSelector = "[data-tooltip-text]";

    const stripNativeTitle = (element: Element) => {
      const title = element.getAttribute("title")?.trim();
      if (!title || !(element instanceof HTMLElement)) return;

      element.dataset.tooltipText = title;
      element.dataset.nativeTitle = title;
      element.removeAttribute("title");

      const isInteractive =
        element.matches("button, a, input, select, textarea, [role='button']") ||
        Boolean(element.closest("button, a, [role='button']"));
      if (isInteractive && !element.getAttribute("aria-label")) {
        element.setAttribute("aria-label", title);
      }
    };

    const refreshNativeTitles = (root: ParentNode = document) => {
      root.querySelectorAll(titleSelector).forEach(stripNativeTitle);
    };

    const getTooltipTarget = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return null;
      return target.closest(tooltipSelector) as HTMLElement | null;
    };

    const clearTooltipTimer = () => {
      if (tooltipTimerRef.current === null) return;
      window.clearTimeout(tooltipTimerRef.current);
      tooltipTimerRef.current = null;
    };

    const showTooltip = (target: HTMLElement) => {
      const text = target.dataset.tooltipText?.trim();
      if (!text || !document.body.contains(target)) return;

      const rect = target.getBoundingClientRect();
      const widthEstimate = Math.min(window.innerWidth - 24, Math.max(108, text.length * 8 + 36));
      const centeredX = rect.left + rect.width / 2;
      const x = Math.min(Math.max(centeredX, widthEstimate / 2 + 12), window.innerWidth - widthEstimate / 2 - 12);
      const placement = rect.top > 78 ? "top" : "bottom";

      setGlobalTooltip({
        text,
        x,
        y: placement === "top" ? rect.top : rect.bottom,
        placement,
      });
    };

    const scheduleTooltip = (target: HTMLElement) => {
      if (tooltipTargetRef.current === target && tooltipTimerRef.current !== null) return;

      clearTooltipTimer();
      setGlobalTooltip(null);
      tooltipTargetRef.current = target;
      tooltipTimerRef.current = window.setTimeout(() => {
        if (tooltipTargetRef.current !== target) return;
        tooltipTimerRef.current = null;
        showTooltip(target);
      }, 5000);
    };

    refreshNativeTitles();

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.target instanceof Element) {
          stripNativeTitle(mutation.target);
          return;
        }

        mutation.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          stripNativeTitle(node);
          refreshNativeTitles(node);
        });
      });
    });

    observer.observe(document.body, {
      attributeFilter: ["title"],
      attributes: true,
      childList: true,
      subtree: true,
    });

    const handlePointerOver = (event: PointerEvent) => {
      const target = getTooltipTarget(event.target);
      if (target) scheduleTooltip(target);
    };

    const handlePointerOut = (event: PointerEvent) => {
      const target = getTooltipTarget(event.target);
      if (!target) return;

      const nextTarget = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (nextTarget && target.contains(nextTarget)) return;
      if (tooltipTargetRef.current === target) tooltipTargetRef.current = null;
      clearTooltipTimer();
      setGlobalTooltip(null);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const target = getTooltipTarget(event.target);
      if (target) showTooltip(target);
    };

    const handleHide = () => {
      tooltipTargetRef.current = null;
      clearTooltipTimer();
      setGlobalTooltip(null);
    };

    document.addEventListener("pointerover", handlePointerOver);
    document.addEventListener("pointerout", handlePointerOut);
    document.addEventListener("focusin", handleFocusIn);
    document.addEventListener("focusout", handleHide);
    document.addEventListener("pointerdown", handleHide);
    window.addEventListener("scroll", handleHide, true);
    window.addEventListener("resize", handleHide);

    return () => {
      clearTooltipTimer();
      observer.disconnect();
      document.removeEventListener("pointerover", handlePointerOver);
      document.removeEventListener("pointerout", handlePointerOut);
      document.removeEventListener("focusin", handleFocusIn);
      document.removeEventListener("focusout", handleHide);
      document.removeEventListener("pointerdown", handleHide);
      window.removeEventListener("scroll", handleHide, true);
      window.removeEventListener("resize", handleHide);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 50) {
          el.classList.add('visible');
          (el as HTMLElement).style.setProperty('--delay', `${Math.min(index * 0.03, 0.12)}s`);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isBuilderPage]);

  return (
    <ThemeLangProvider>
      <ProjectSelectionProvider>
        <Header />
        <div className={`app-route ${isBuilderPage ? "app-route--builder" : "app-route--main"}`}>
          {isBuilderPage ? (
            <Suspense fallback={<div className="route-loading">Загрузка конструктора...</div>}>
              <SiteBuilderPage />
            </Suspense>
          ) : (
            <>
              <Container className='wrapper'>
                <section id="home" className="page-section">
                  <Banner/>
                </section>
                <section id="development" className="page-section">
                  <Technologys/>
                </section>
                <section id="catalog" className="page-section">
                  <WorkShop/>
                </section>
                <section id="about" className="page-section">
                  <AboutUs/>
                </section>
                <section id="start" className="page-section">
                  <FitbackForm/>
                </section>
                <section id="builder-promo" className="page-section">
                  <SiteBuilderPromo/>
                </section>
              </Container>
              <Footer/>
            </>
          )}
        </div>
        {globalTooltip && (
          <div
            className={`global-tooltip global-tooltip--${globalTooltip.placement}`}
            style={{
              "--tooltip-x": `${globalTooltip.x}px`,
              "--tooltip-y": `${globalTooltip.y}px`,
            } as CSSProperties}
          >
            {globalTooltip.text}
          </div>
        )}
        {!isBuilderPage && <FaqChatBot />}
      </ProjectSelectionProvider>
    </ThemeLangProvider>
  );
}

export default App;
