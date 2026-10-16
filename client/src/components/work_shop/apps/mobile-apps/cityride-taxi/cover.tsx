import "./cityride-taxi.scss";

const cityrideCar = new URL("./img/cityride-car.svg", import.meta.url).href;

export const CityRideTaxiCover = () => (
  <div className="cityride-product-cover" aria-hidden="true">
    <div className="cityride-cover-map">
      <span className="cityride-cover-pin cityride-cover-pin--from" />
      <span className="cityride-cover-pin cityride-cover-pin--to" />
      <i className="cityride-cover-route" />
      <img className="cityride-cover-car" src={cityrideCar} alt="" />
    </div>
    <div className="cityride-cover-info">
      <strong>CityRide</strong>
      <span>go anywhere</span>
    </div>
    <div className="cityride-cover-price">4 min <span>→</span></div>
  </div>
);
