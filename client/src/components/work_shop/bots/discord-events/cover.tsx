import { CalendarDays, Check, Hash, Users } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { getDiscordEventsCopy } from "./preview-copy";
import "./cover.scss";

export function DiscordEventsCover() {
  const { lang } = useThemeLang();
  const copy = getDiscordEventsCopy(lang);
  return <div className="discord-events-cover" aria-hidden="true">
    <div className="discord-events-cover__orbit" />
    <div className="discord-events-cover__window"><aside><span><CalendarDays size={21} /></span><i>P</i><i>+</i></aside><div className="discord-events-cover__chat"><header><Hash size={15} /><b>события</b><Users size={13} /></header><div className="discord-events-cover__message"><i><CalendarDays size={16} /></i><div><b>Events <em>ПРИЛОЖЕНИЕ</em></b><small>Новая встреча в Pixel Club</small><article><span>СОБЫТИЕ #01</span><strong>Вечер настолок</strong><p>Завтра · 19:00</p><div><Users size={12} /> 3 / 8</div></article><div className="discord-events-cover__buttons"><span><Check size={10} /> Пойду</span><span>Возможно</span></div></div></div><footer><span>+</span>Написать в #события</footer></div></div>
    <div className="discord-events-cover__badge"><CalendarDays size={28} /><strong>Discord Events</strong><small>{copy.features[0]}</small></div><div className="discord-events-cover__caption"><i />{copy.kicker}</div>
  </div>;
}
