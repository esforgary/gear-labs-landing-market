import { Headphones, CheckCheck, Send } from "lucide-react";
import "./tg-support.scss";

export function TgSupportCover() {
  return <div className="tg-support-cover" aria-hidden="true">
    <div className="tg-support-cover__orb" />
    <div className="tg-support-cover__chat">
      <header><span><Headphones size={22} /></span><div><b>TG Support</b><small>бот · служба поддержки</small></div><i>✓</i></header>
      <div className="tg-support-cover__bubble">Здравствуйте!<br /><b>Чем можем помочь?</b><small>12:41</small></div>
      <div className="tg-support-cover__topics"><span>Заказ и доставка</span><span>Технический вопрос</span></div>
      <div className="tg-support-cover__reply">Нужна помощь с заказом <CheckCheck size={13} /></div>
      <footer>Сообщение <Send size={17} /></footer>
    </div>
    <div className="tg-support-cover__ticket"><span>ОБРАЩЕНИЕ #2001</span><Headphones size={30} /><b>Мы на связи</b><small>Один чат. Вся история.</small><i>В работе</i></div>
    <div className="tg-support-cover__tag">✓ Вопрос решён</div>
  </div>;
}
