import AboutUsCard from "./about_us_card/about-us";
import Reviews from "./rewiews/reviews";
import { useThemeLang } from "../../context/ThemeLangContext";

export default function AboutUs() {
  const { t } = useThemeLang();

  return (
    <div style={{ margin: "100px 0" }}>
      <h1 className="scroll-animate" style={{ marginBottom: "40px", marginLeft: "20px", fontSize: "36px", fontWeight: "bold" }}>
        {t("about.title")}
      </h1>

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
