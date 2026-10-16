import { useEffect, useRef } from "react";
import "./market-analysis.scss";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { getImportedProjectCopy } from "../../imported-project-copy";

export default function MarketAnalysis() {
  const { lang } = useThemeLang();
  const frame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.source === frame.current?.contentWindow && event.origin === window.location.origin && event.data === "meridian-preview:escape") {
        window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return <iframe
    ref={frame}
    className="market-analysis-demo"
    title={getImportedProjectCopy("market-analysis", lang)!.title}
    src={`${import.meta.env.BASE_URL}imported/market-analysis/index.html`}
    sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
    allowFullScreen
  />;
}

export { MarketAnalysisCover } from "./cover";
