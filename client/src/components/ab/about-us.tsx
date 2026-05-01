import AboutUsCard from "./about_us_card/about-us";
import Reviews from "./rewiews/reviews";

export default function AboutUs() {
  return (
    <div style={{ margin: "100px 0" }}>
      <h1 className="scroll-animate" style={{ marginBottom: "40px", marginLeft: "20px", fontSize: "36px", fontWeight: "bold" }}>
        Почему стоит выбрать нас
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
