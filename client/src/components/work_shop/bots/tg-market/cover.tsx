import { ProductArt } from "./product-art";
import "./tg-market.scss";

export function TgMarketCover() {
  return <div className="tg-market-cover" aria-hidden="true">
    <div className="tg-market-cover__orb" />
    <div className="tg-market-cover__chat">
      <div className="tg-market-cover__header"><span>↗</span><div><b>Market Bot</b><small>бот · интернет-магазин</small></div><i>✓</i></div>
      <div className="tg-market-cover__bubble">Привет! Ваш новый<br /><b>любимый магазин здесь.</b><small>12:41</small></div>
      <div className="tg-market-cover__reply">Покажи каталог <small>✓✓</small></div>
      <div className="tg-market-cover__catalog"><span>Каталог товаров</span><span>Мои заказы</span></div>
      <div className="tg-market-cover__input">Сообщение <b>➤</b></div>
    </div>
    <div className="tg-market-cover__product">
      <ProductArt product={{ name: "Беспроводные наушники", imageUrl: "demo:headphones", color: "#6c91bf" }} />
      <small>НОВИНКА</small><b>Sound Air</b><span>4 990 ₽ <i>+</i></span>
    </div>
    <div className="tg-market-cover__tag"><i>✓</i> Заказ оформлен</div>
  </div>;
}
