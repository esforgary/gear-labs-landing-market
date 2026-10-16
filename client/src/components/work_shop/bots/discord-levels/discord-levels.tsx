import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChevronDown, Hash, Plus, Send, Settings, Sparkles, Trophy, X } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../../apps/mobile-apps/app-preview-presentation";
import { getDiscordLevelsCopy } from "./preview-copy";
import { ADMIN_ID, MEMBER_ID, STORAGE_KEY, createDemoState, levelOf, memberRoles, resetStats, restoreDemoState, runCommand, sendMessage, updateSettings, type Channel, type DemoState, type Embed, type Result, type Reward, type Role } from "./levels-model";
import "./discord-levels.scss";

const time = (at: number) => new Date(at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
const buttonLabel = (command: string) => command === "/rank" ? "Мой ранг" : command === "/leaderboard" ? "Рейтинг" : command === "/rewards" ? "Награды" : command === "/help" ? "Команды" : "Ранг участника";
function initialState() {
  try { return { ...restoreDemoState(localStorage.getItem(STORAGE_KEY)), storageError: false }; }
  catch { return { state: createDemoState(), recovered: false, storageError: true }; }
}
function BotEmbed({ embed, command }: { embed: Embed; command: (text: string) => void }) {
  return <><div className={`discord-levels-embed is-${embed.accent ?? "purple"}`}><strong>{embed.title}</strong><p>{embed.body}</p>{embed.progress !== undefined && <div className="discord-levels-progress" role="progressbar" aria-label="Опыт до следующего уровня" aria-valuemin={0} aria-valuemax={100} aria-valuenow={embed.progress}><i style={{ width: `${embed.progress}%` }} /></div>}{embed.rows?.map((row, index) => <div className="discord-levels-embed-row" key={index}>{row}</div>)}</div>{embed.buttons && <div className="discord-levels-buttons">{embed.buttons.map(text => <button key={text} type="button" onClick={() => command(text)}>{buttonLabel(text)}</button>)}</div>}</>;
}
export default function DiscordLevelsPreview() {
  const { lang } = useThemeLang();
  const copy = getDiscordLevelsCopy(lang);
  const [initial] = useState(initialState);
  const [state, setState] = useState(initial.state);
  const stateRef = useRef(state);
  const [role, setRole] = useState<Role>("member");
  const [channel, setChannel] = useState<Channel>("общий");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [now, setNow] = useState(Date.now);
  const [modal, setModal] = useState<"settings" | "reset" | null>(null);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [cooldown, setCooldown] = useState(8);
  const [storageError, setStorageError] = useState(initial.storageError);
  const [recovered, setRecovered] = useState(initial.recovered);
  const [resetConfirm, setResetConfirm] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLElement>(null);
  const member = state.members.find(item => item.id === (role === "admin" ? ADMIN_ID : MEMBER_ID))!;
  const wait = Math.max(0, Math.ceil((member.lastEarnedAt + state.cooldown * 1000 - now) / 1000));
  const awarded = memberRoles(state, member);

  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 500); return () => window.clearInterval(timer); }, []);
  useEffect(() => { scroll.current?.scrollTo({ top: scroll.current.scrollHeight }); }, [state.messages.length, state.nextId, channel]);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const restored = restoreDemoState(event.newValue);
      stateRef.current = restored.state; setState(restored.state); setRecovered(restored.recovered); setModal(null); setError(""); setFeedback("");
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    if (!modal) return;
    const previous = document.activeElement as HTMLElement | null;
    const panel = dialog.current;
    panel?.querySelector<HTMLElement>("input, button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setModal(null); setError(""); }
      if (event.key === "Tab" && panel) {
        const elements = Array.from(panel.querySelectorAll<HTMLElement>("button:not(:disabled), input, select"));
        const first = elements[0], last = elements.at(-1);
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { document.removeEventListener("keydown", handleKey); previous?.focus(); };
  }, [modal]);

  function save(next: DemoState) {
    stateRef.current = next; setState(next); setNow(Date.now());
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); }
  }
  function apply(result: Result) {
    if (result.error) { setError(result.error); setFeedback(""); return false; }
    save(result.state); setError(""); setFeedback(result.feedback ?? ""); return true;
  }
  function command(text: string) {
    setError(""); setFeedback("");
    if (text === "/settings" || text === "/reset") {
      if (role !== "admin") { setError("Эта команда доступна только администратору."); return; }
      setRewards(stateRef.current.rewards.map(item => ({ ...item }))); setCooldown(stateRef.current.cooldown); setModal(text === "/settings" ? "settings" : "reset"); setMessage(""); return;
    }
    if (apply(runCommand(stateRef.current, role, channel, text))) setMessage("");
  }
  function submit(event: FormEvent) {
    event.preventDefault();
    if (message.trim().startsWith("/")) command(message.trim());
    else if (apply(sendMessage(stateRef.current, role, channel, message))) setMessage("");
  }
  function switchRole(next: Role) { setRole(next); setModal(null); setMessage(""); setError(""); setFeedback(""); setResetConfirm(false); }
  function switchChannel(next: Channel) {
    setChannel(next); setError(""); setFeedback(""); setMessage("");
    if (next === "рейтинг" && channel !== next) apply(runCommand(stateRef.current, role, next, "/leaderboard"));
  }
  function settingsSubmit(event: FormEvent) {
    event.preventDefault();
    if (apply(updateSettings(stateRef.current, role, rewards, cooldown, channel))) setModal(null);
  }
  const commands = [
    { value: "/rank", text: "Ваш уровень и роли", fill: "/rank" },
    { value: "/leaderboard", text: "Рейтинг участников", fill: "/leaderboard" },
    { value: "/rewards", text: "Награды за уровни", fill: "/rewards" },
    { value: "/help", text: "Как получить XP", fill: "/help" },
    ...(role === "admin" ? [{ value: "/xp", text: "Добавить или снять XP", fill: "/xp add @luna 20" }, { value: "/settings", text: "Роли и пауза начисления", fill: "/settings" }, { value: "/reset", text: "Сбросить XP с подтверждением", fill: "/reset" }] : []),
  ];
  const suggestions = message.startsWith("/rank ") ? state.members.map(item => ({ value: `/rank @${item.id}`, text: item.name, fill: `/rank @${item.id}` })).filter(item => item.value.toLowerCase().startsWith(message.toLowerCase())) : commands.filter(item => item.value.startsWith(message.toLowerCase().split(" ")[0]));

  return <div className="mobile-app-preview mobile-app-preview--discord-levels">
    <div className="mobile-app-preview__device"><div className="app-phone-frame"><div className="discord-levels-phone" lang="ru">
      <PhoneStatusBar />
      <header className="discord-levels-header"><span className="discord-levels-server"><Sparkles size={22} /></span><div><h3>Pixel Club <ChevronDown size={14} /></h3><small><i /> Место для своих · 128 участников</small></div></header>
      <nav className="discord-levels-channels" aria-label="Каналы сервера">{(["общий", "рейтинг"] as const).map(item => <button type="button" key={item} aria-pressed={channel === item} onClick={() => switchChannel(item)}><Hash size={16} />{item}{item === "рейтинг" && <Trophy size={12} />}</button>)}</nav>
      <div className="discord-levels-channel-heading"><Hash size={20} /><strong>{channel}</strong><span>Levels <b>APP</b></span></div>
      <div className="discord-levels-chat" ref={scroll} tabIndex={0} aria-label={`История канала ${channel}`}>
        <div className="discord-levels-welcome"><span><Hash size={23} /></span><h4>{channel === "общий" ? "Разговор начинается здесь." : "Каждый уровень — история."}</h4><p>{channel === "общий" ? "Делитесь идеями, общайтесь и получайте роли." : "Рейтинг обновляется при открытии канала и по кнопке «Рейтинг»."}</p></div>
        <div className="discord-levels-day">СЕГОДНЯ</div>
        <div className="discord-levels-messages" role="log" aria-live="polite" aria-label="Сообщения Levels">
          {state.messages.filter(item => item.channel === channel).map(item => {
            const author = state.members.find(person => person.id === item.authorId);
            return <article key={item.id} className="discord-levels-message"><span className="discord-levels-avatar" style={{ background: author?.color ?? "#5865f2" }}>{author ? author.name[0] : <Trophy size={17} />}</span><div><header><b style={{ color: author?.color }}>{author?.name ?? "Levels"}</b>{!author && <span className="discord-levels-app">✓ APP</span>}{author?.id === ADMIN_ID && <span className="discord-levels-mod">МОД</span>}<time>{time(item.at)}</time></header>{item.text && <p className={item.text.startsWith("/") ? "is-command" : ""}>{item.text}</p>}{item.embed && <BotEmbed embed={item.embed} command={command} />}</div></article>;
          })}
        </div>
      </div>
      {error && !modal && <p className="discord-levels-feedback is-error" role="alert">{error}</p>}
      {feedback && <p className="discord-levels-feedback" role="status">{feedback}</p>}
      <div className="discord-levels-input-area">
        {message.startsWith("/") && suggestions.length > 0 && <div className="discord-levels-suggestions" aria-label="Подсказки команд"><small>КОМАНДЫ LEVELS</small>{suggestions.map(item => <button type="button" key={item.value} onClick={() => { setMessage(item.fill); input.current?.focus(); }}><span><b>{item.value}</b><small>{item.text}</small></span><Trophy size={14} /></button>)}</div>}
        <form className="discord-levels-composer" onSubmit={submit}><button type="button" className="discord-levels-slash" aria-label="Показать команды" onClick={() => { setMessage("/"); input.current?.focus(); }}>＋</button><input ref={input} aria-label={`Сообщение в канал ${channel}`} maxLength={500} value={message} onChange={event => { setMessage(event.target.value); setError(""); }} placeholder={`Написать в #${channel}`} /><button type="submit" aria-label="Отправить сообщение" disabled={!message.trim()}><Send size={17} /></button></form>
        <div className="discord-levels-cooldown">{channel !== "общий" ? "За общение XP начисляется в #общий" : wait ? `Следующие +15 XP через ${wait} с · писать можно` : "+15 XP за новое сообщение · пауза " + state.cooldown + " с"}</div>
      </div>
      <footer className="discord-levels-profile"><span className="discord-levels-avatar" style={{ background: member.color }}>{member.name[0]}</span><div><strong>{member.name} <small>ур. {levelOf(member.xp)}</small></strong><span>{role === "admin" ? "Администратор" : awarded.join(" · ") || "Участник"} · {member.xp} XP</span></div>{role === "admin" ? <button type="button" aria-label="Настройки Levels" onClick={() => command("/settings")}><Settings size={17} /></button> : <button type="button" aria-label="Мой ранг" onClick={() => command("/rank")}><Trophy size={17} /></button>}</footer>
      {modal && <div className="discord-levels-backdrop"><section ref={dialog} className="discord-levels-dialog" role="dialog" aria-modal="true" aria-label={modal === "settings" ? "Настройки Levels" : "Сброс статистики"}><header><strong>{modal === "settings" ? "Настройки Levels" : "Сбросить статистику?"}</strong><button type="button" aria-label="Закрыть окно" onClick={() => { setModal(null); setError(""); }}><X size={18} /></button></header>
        {modal === "settings" ? <form onSubmit={settingsSubmit}><p>Роли выдаются по уровню автоматически. Изменения применятся ко всем участникам.</p><label>Пауза начисления XP, секунды<input type="number" min={3} max={60} required value={Number.isNaN(cooldown) ? "" : cooldown} onChange={event => setCooldown(event.target.valueAsNumber)} /></label><small>Демо ускорено: 3–60 с. Сообщения во время паузы разрешены, но не дают XP.</small><div className="discord-levels-reward-head"><span>Уровень</span><span>Роль</span></div>{rewards.map((reward, index) => <div className="discord-levels-reward-edit" key={index}><input type="number" min={1} max={100} required aria-label={`Уровень награды ${index + 1}`} value={Number.isNaN(reward.level) ? "" : reward.level} onChange={event => setRewards(items => items.map((item, i) => i === index ? { ...item, level: event.target.valueAsNumber } : item))} /><input required maxLength={24} aria-label={`Название роли ${index + 1}`} value={reward.name} onChange={event => setRewards(items => items.map((item, i) => i === index ? { ...item, name: event.target.value } : item))} /><button type="button" aria-label={`Удалить награду ${index + 1}`} disabled={rewards.length <= 1} onClick={() => setRewards(items => items.filter((_, i) => i !== index))}><X size={14} /></button></div>)}<button className="discord-levels-secondary" type="button" disabled={rewards.length >= 5} onClick={() => setRewards(items => [...items, { level: Math.min(100, Math.max(0, ...items.map(item => Number.isFinite(item.level) ? item.level : 0)) + 1), name: "" }])}><Plus size={13} /> Добавить роль</button>{error && <p className="discord-levels-feedback is-error" role="alert">{error}</p>}<button className="discord-levels-primary" type="submit">Сохранить настройки</button><button className="discord-levels-danger-link" type="button" onClick={() => { setModal("reset"); setError(""); }}>Сбросить XP всех участников</button></form> : <><p>Все участники получат 0 XP и уровень 0. Заработанные роли будут сняты. Настройки наград и сообщения сохранятся.</p>{error && <p role="alert" className="discord-levels-feedback is-error">{error}</p>}<div className="discord-levels-confirm"><button type="button" className="discord-levels-secondary" onClick={() => setModal(null)}>Отмена</button><button type="button" className="discord-levels-danger" onClick={() => { if (apply(resetStats(stateRef.current, role, true, channel))) setModal(null); }}>Сбросить статистику</button></div></>}
      </section></div>}
    </div></div></div>
    <div className="discord-levels-presentation"><AppPreviewCopy kicker={copy.kicker} title="Discord Levels" description={copy.description} features={copy.features} /><div className="discord-levels-controls"><div className="discord-levels-role-switch" role="group" aria-label={copy.roleLabel}><button type="button" aria-pressed={role === "member"} onClick={() => switchRole("member")}>{copy.member}</button><button type="button" aria-pressed={role === "admin"} onClick={() => switchRole("admin")}>{copy.admin}</button></div><p>{copy.notice}</p>{storageError && <p role="status">{copy.storageError}</p>}{recovered && <p role="status">{copy.recovered}</p>}{resetConfirm ? <div className="discord-levels-reset-confirm"><span>{copy.resetPrompt}</span><button type="button" onClick={() => { save(createDemoState()); setRecovered(false); switchRole("member"); setChannel("общий"); }}>{copy.resetConfirm}</button><button type="button" onClick={() => setResetConfirm(false)}>{copy.cancel}</button></div> : <button className="discord-levels-reset" type="button" onClick={() => setResetConfirm(true)}>{copy.reset}</button>}</div></div>
  </div>;
}
