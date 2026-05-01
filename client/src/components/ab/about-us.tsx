import AboutUsCard from "./about_us_card/about-us";
import Reviews from "./rewiews/reviews";
import { BadgeCheck } from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./about-us.scss";

export default function AboutUs() {
  const { t } = useThemeLang();

  return (
    <div className="about-section">
      <div className="section-heading about-heading">
        <span className="section-eyebrow scroll-animate">
          <BadgeCheck size={18} />
          {t("eyebrow.about")}
        </span>
        <h1 className="scroll-animate">
          {t("about.title")}
        </h1>
      </div>

      <div className="about-content">
        <div>
          <AboutUsCard />
        </div>

        <div>
          <Reviews />
        </div>
      </div>
    </div>
  );
}
