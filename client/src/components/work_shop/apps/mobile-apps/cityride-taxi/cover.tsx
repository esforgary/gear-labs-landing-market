import "./cityride-taxi.scss";

const cityrideCar = new URL("./img/cityride-car.svg", import.meta.url).href;

export const CityRideTaxiCover = () => (
  <div className="cityride-product-cover" aria-hidden="true">
    <div className="cityride-cover-map">
      <span className="cityride-cover-pin cityride-cover-pin--from" />
      <span className="cityride-cover-pin cityride-cover-pin--to" />
      <i className="cityride-cover-route" />
      <img src={cityrideCar} alt="" />
    </div>
    <div className="cityride-cover-info">
      <strong>CityRide</strong>
      <span />
      <span />
    </div>
    <div className="cityride-cover-price">12 min</div>
  </div>
);
