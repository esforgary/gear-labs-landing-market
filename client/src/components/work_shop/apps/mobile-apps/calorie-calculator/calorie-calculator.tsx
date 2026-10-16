import { useThemeLang } from "../../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../app-preview-presentation";
import { getCaloriePreviewCopy } from "./preview-copy";
import "./calorie-calculator.scss";

export default function CalorieCalculatorPreview() {
  const { lang } = useThemeLang();
  const copy = getCaloriePreviewCopy(lang);
  return (
    <div className="mobile-app-preview mobile-app-preview--calorie">
      <div className="mobile-app-preview__device">
        <div className="app-phone-frame">
          <div className="calorie-phone-app">
            <PhoneStatusBar />
            <iframe
              title={copy.frameTitle}
              src={`${import.meta.env.BASE_URL}imported/calorie-calculator/index.html`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-downloads allow-popups allow-popups-to-escape-sandbox"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
      <AppPreviewCopy
        kicker={copy.kicker}
        title={copy.title}
        description={copy.description}
        features={copy.features}
      />
    </div>
  );
}
