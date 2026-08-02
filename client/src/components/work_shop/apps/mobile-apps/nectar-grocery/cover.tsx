import bananaImg from "./img/banana.png";
import appleImg from "./img/apple.png";
import carrotIcon from "./img/carrot.svg";
import "./nectar-grocery.scss";

export const NectarGroceryCover = () => (
  <div className="nectar-product-cover" aria-hidden="true">
    <div className="nectar-cover-top">
      <img src={carrotIcon} alt="" />
      <span />
      <span />
    </div>
    <div className="nectar-cover-basket">
      <img src={bananaImg} alt="" />
      <img src={appleImg} alt="" />
      <b>40%</b>
    </div>
    <div className="nectar-cover-cards">
      <span />
      <span />
    </div>
  </div>
);
