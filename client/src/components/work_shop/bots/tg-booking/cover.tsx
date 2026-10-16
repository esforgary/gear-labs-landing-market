import { CalendarDays } from "lucide-react";
import "./tg-booking.scss";

export function TgBookingCover() {
  return <div className="tg-booking-cover" aria-hidden="true">
    <div className="tg-booking-cover__chat">
      <div className="tg-booking-cover__header"><span><CalendarDays size={18} /></span><div><b>TG Booking</b><small>бот · запись в студию</small></div></div>
      <div className="tg-booking-cover__bubble">Время для себя 🌿<br /><b>Когда вам удобно?</b><small>09:41</small></div>
      <div className="tg-booking-cover__reply">Завтра, после обеда</div>
      <div className="tg-booking-cover__button">Выбрать свободное время</div>
      <div className="tg-booking-cover__input">Сообщение <b>➤</b></div>
    </div>
    <div className="tg-booking-cover__calendar"><small>ВАША ЗАПИСЬ</small><b>Тихое утро</b><div>{Array.from({ length: 12 }, (_, index) => <i key={index} className={index === 6 ? "is-picked" : ""}>{index + 12}</i>)}</div><span>14:00 · Анна</span></div>
    <div className="tg-booking-cover__tag">✓ Запись подтверждена</div>
  </div>;
}
