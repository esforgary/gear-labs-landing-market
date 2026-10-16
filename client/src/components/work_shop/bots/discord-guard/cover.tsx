import { Check, Flag, Hash, ShieldCheck, Users, Volume2 } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { getDiscordGuardCopy } from "./preview-copy";
import "./cover.scss";

export function DiscordGuardCover() {
  const { lang } = useThemeLang();
  const copy = getDiscordGuardCopy(lang);
  return <div className="discord-guard-cover" aria-hidden="true">
    <div className="discord-guard-cover__window">
      <aside className="discord-guard-cover__servers"><span><ShieldCheck size={20} /></span><i>G</i><i>+</i></aside>
      <div className="discord-guard-cover__channels"><b>GearLabs</b><span><Hash size={11} /> general</span><span className="is-active"><Hash size={11} /> reports</span><span><Volume2 size={11} /> lounge</span><small><Users size={11} /> 128</small></div>
      <div className="discord-guard-cover__conversation">
        <header><Hash size={13} /><b>reports</b><ShieldCheck size={13} /></header>
        <div className="discord-guard-cover__message"><i>A</i><div><b>alex</b><small>12:41</small><p /><p /></div></div>
        <div className="discord-guard-cover__message is-bot"><i><ShieldCheck size={13} /></i><div><b>Guard <em>BOT</em></b><p /><p /></div></div>
        <div className="discord-guard-cover__composer"><span>+</span><span># reports</span></div>
      </div>
    </div>
    <div className="discord-guard-cover__report"><span><Flag size={13} /> #0042</span><ShieldCheck size={34} /><b>Discord Guard</b><small>{copy.features[0]}</small><div><Check size={12} /><span>{copy.features[3]}</span></div></div>
    <div className="discord-guard-cover__caption"><i /><span>{copy.kicker}</span></div>
  </div>;
}
