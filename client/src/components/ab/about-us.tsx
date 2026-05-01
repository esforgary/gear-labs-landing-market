import AboutUsCard from "./about_us_card/about-us";
import Reviews from "./rewiews/reviews";
import { Sparkles } from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";

export default function AboutUs() {
  const { t } = useThemeLang();

  return (
    <div className="about-section" style={{ margin: "100px 0" }}>
      <div className="section-heading" style={{ marginLeft: "20px" }}>
        <span className="section-eyebrow scroll-animate">
          <Sparkles size={18} />
          {t("eyebrow.about")}
        </span>
        <h1 className="scroll-animate" style={{ marginBottom: "40px", fontSize: "36px", fontWeight: "bold" }}>
          {t("about.title")}
        </h1>
      </div>

      <div className="d-flex" style={{justifyContent: 'space-around'}}>
        <div >
          <AboutUsCard />
        </div>

        <div >
          <Reviews />
        </div>
      </div>
    </div>
  );
}
