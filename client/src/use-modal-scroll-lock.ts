import { useLayoutEffect, useRef } from "react";
import "./modal-scroll-lock.scss";

// Native scrollbars cannot fade after overflow is locked. Keep an identical
// frozen track until the overlay has finished opening or closing.
export function useModalScrollLock(active: boolean, visible: boolean) {
  const scrollbarRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    const body = document.body;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const width = Math.max(0, window.innerWidth - root.getBoundingClientRect().width);
    const previousOverflow = root.style.overflow;
    const previousPadding = body.style.paddingRight;
    const previousBehavior = root.style.scrollBehavior;
    const padding = Number.parseFloat(getComputedStyle(body).paddingRight) || 0;
    const scrollbar = document.createElement("div");
    const thumb = document.createElement("div");
    scrollbar.className = "modal-background-scrollbar";
    scrollbar.setAttribute("aria-hidden", "true");
    scrollbar.inert = true;
    scrollbar.style.width = `${width}px`;
    thumb.className = "modal-background-scrollbar__thumb";
    scrollbar.append(thumb);
    const updateThumb = () => {
      const height = window.innerHeight;
      const pageHeight = root.scrollHeight;
      const thumbHeight = Math.min(height, Math.max(28, height * height / pageHeight));
      const progress = Math.min(1, Math.max(0, scrollY / Math.max(1, pageHeight - height)));
      thumb.style.height = `${thumbHeight}px`;
      thumb.style.top = `${progress * (height - thumbHeight)}px`;
    };
    updateThumb();
    if (width > 0) body.append(scrollbar);
    scrollbarRef.current = scrollbar;
    root.style.overflow = "hidden";
    root.style.scrollBehavior = "auto";
    body.style.paddingRight = `${padding + width}px`;
    window.addEventListener("resize", updateThumb);

    return () => {
      scrollbar.remove();
      scrollbarRef.current = null;
      window.removeEventListener("resize", updateThumb);
      root.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = previousBehavior;
    };
  }, [active]);

  useLayoutEffect(() => {
    const scrollbar = scrollbarRef.current;
    if (!scrollbar) return;
    let frame = 0;
    if (visible) {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => scrollbar.classList.add("is-hidden"));
      });
    } else {
      scrollbar.classList.remove("is-hidden");
    }
    return () => cancelAnimationFrame(frame);
  }, [active, visible]);
}
