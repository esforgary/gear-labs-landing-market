import { ArrowUp, Hash, Sparkles, Trophy } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { getDiscordLevelsCopy } from "./preview-copy";
import "./cover.scss";

export function DiscordLevelsCover() {
  const { lang } = useThemeLang();
  const copy = getDiscordLevelsCopy(lang);
  return <div className="discord-levels-cover" aria-hidden="true"><div className="discord-levels-cover__window"><aside><span><Sparkles size={20} /></span><i>G</i><i>+</i></aside><section><header><Hash size={14} /><b>рейтинг</b><Trophy size={13} /></header><div className="discord-levels-cover__message"><i>Л</i><div><b>Луна</b><p>/rank</p></div></div><div className="discord-levels-cover__message is-bot"><i><Trophy size={14} /></i><div><b>Levels <em>APP</em></b><div className="discord-levels-cover__embed"><strong>Луна · 105 XP</strong><span /><small>{copy.features[1]}</small><p>1 → 2</p></div></div></div><footer><span>+</span><span># рейтинг</span></footer></section></div><div className="discord-levels-cover__badge"><span><ArrowUp size={13} /> +15 XP</span><Trophy size={36} /><strong>Discord Levels</strong><small>{copy.features[2]}</small><div><i /><b>01</b><i /></div></div><div className="discord-levels-cover__caption"><i /><span>{copy.kicker}</span></div></div>;
}
