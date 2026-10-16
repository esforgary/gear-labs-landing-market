import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { CalendarDays, Check, ChevronDown, Hash, Headphones, Menu, PlusCircle, Send, Smile, Users, X } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../../apps/mobile-apps/app-preview-presentation";
import { getDiscordEventsCopy } from "./preview-copy";
import { STORAGE_KEY, addMessage, cancelEvent, createDemoState, exchange, formatDate, names, participants, reschedule, respond, responseLabels, restoreDemoState, saveEvent, vote, type DemoState, type Event, type Role, type Rsvp } from "./events-model";
import "./discord-events.scss";

type Sheet = { kind: "create" | "edit" | "reschedule" | "cancel"; id?: number };
const commands = [
  { name: "/help", hint: "Все команды", admin: false }, { name: "/events", hint: "Список встреч", admin: false }, { name: "/event", hint: "Карточка · укажите ID", admin: false },
  { name: "/create", hint: "Создать встречу", admin: true }, { name: "/edit", hint: "Изменить · укажите ID", admin: true }, { name: "/reschedule", hint: "Перенести · укажите ID", admin: true }, { name: "/cancel", hint: "Отменить · укажите ID", admin: true }, { name: "/participants", hint: "Участники · укажите ID", admin: true },
];
const time = (at: number) => new Date(at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
const localDate = (at: number) => { const date = new Date(at); return new Date(at - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16); };
function initialState() {
  try { return { ...restoreDemoState(localStorage.getItem(STORAGE_KEY)), storageError: false }; }
  catch { return { state: createDemoState(), recovered: false, storageError: true }; }
}

export default function DiscordEventsPreview() {
  const { lang } = useThemeLang();
  const copy = getDiscordEventsCopy(lang);
  const [initial] = useState(initialState);
  const [state, setState] = useState(initial.state);
  const stateRef = useRef(state);
  const [role, setRole] = useState<Role>("member");
  const [input, setInput] = useState("");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", capacity: "8" });
  const [error, setError] = useState("");
  const [storageError, setStorageError] = useState(initial.storageError);
  const [recovered, setRecovered] = useState(initial.recovered);
  const [resetConfirm, setResetConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousMessageId = useRef<number | undefined>(undefined);
  const selected = state.events.find(item => item.id === sheet?.id);
  const suggestions = input.startsWith("/") && !input.includes(" ") ? commands.filter(item => item.name.startsWith(input.toLowerCase()) && (!item.admin || role === "admin")) : [];

  useEffect(() => {
    if (previousMessageId.current !== state.messages.at(-1)?.id) scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    previousMessageId.current = state.messages.at(-1)?.id;
  }, [state.messages]);
  useEffect(() => {
    if (!sheet) return;
    const previous = document.activeElement as HTMLElement | null;
    dialogRef.current?.querySelector<HTMLInputElement>("input, button")?.focus();
    return () => previous?.focus();
  }, [sheet]);
  useEffect(() => {
    const receive = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = restoreDemoState(event.newValue);
      stateRef.current = next.state; setState(next.state); setRecovered(next.recovered); setSheet(null); setError("");
    };
    window.addEventListener("storage", receive); return () => window.removeEventListener("storage", receive);
  }, []);

  function save(next: DemoState) {
    stateRef.current = next; setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); }
  }
  function apply(result: { state: DemoState; error?: string }, echo: string) {
    if (result.error) { save(exchange(stateRef.current, role, echo, result.error)); return; }
    save(result.state);
  }
  function openSheet(kind: Sheet["kind"], event?: Event) {
    if (role !== "admin") return;
    setError(""); setForm({ title: event?.title ?? "", description: event?.description ?? "", date: localDate(event?.startsAt ?? Date.now() + 86400000), capacity: String(event?.capacity ?? 8) });
    setSheet({ kind, ...(event ? { id: event.id } : {}) });
  }
  function submitCommand(event: FormEvent) {
    event.preventDefault();
    const text = input.trim(); if (!text) return;
    setInput("");
    const [command, argument, ...extra] = text.toLowerCase().split(/\s+/);
    const current = stateRef.current;
    if (!text.startsWith("/")) { save(addMessage(current, role, text)); return; }
    const reply = (message: string, eventId?: number) => save(exchange(current, role, text, message, eventId));
    if (command === "/help") { reply("Команды Events:\n/events — все встречи\n/event ID — открыть карточку\nКнопки под карточкой: записаться, ответить «Возможно» или отказаться.\nАдминистратор: /create, /edit ID, /reschedule ID, /cancel ID, /participants ID."); return; }
    if (command === "/events") {
      let next = exchange(current, role, text, "Встречи Pixel Club · время указано в вашем часовом поясе.");
      for (const item of [...current.events].sort((a, b) => a.startsAt - b.startsAt)) next = addMessage(next, "bot", item.cancelled ? "Отменённая встреча" : "Встреча сообщества", item.id);
      save(next); return;
    }
    const definition = commands.find(item => item.name === command);
    if (!definition) { reply("Неизвестная команда. Напишите /help или выберите команду из подсказок."); return; }
    if (definition.admin && role !== "admin") { reply("Эта команда доступна только администратору."); return; }
    if (command === "/create") { openSheet("create"); return; }
    const id = Number(argument);
    if (!/^\d+$/.test(argument ?? "") || !Number.isSafeInteger(id) || extra.length) { reply(`Укажите ID события: ${command} 1`); return; }
    const item = current.events.find(event => event.id === id);
    if (!item) { reply("Событие не найдено. Используйте /events."); return; }
    if (command === "/event") { reply("Карточка события", id); return; }
    if (command === "/participants") { reply(`Участники «${item.title}»\n${participants(item)}`); return; }
    if (item.cancelled) { reply("Событие отменено. Создайте новую встречу через /create."); return; }
    openSheet(command.slice(1) as Sheet["kind"], item);
  }
  function submitForm(event: FormEvent) {
    event.preventDefault(); if (!sheet) return;
    const result = sheet.kind === "cancel" ? cancelEvent(stateRef.current, role, sheet.id!)
      : sheet.kind === "reschedule" ? reschedule(stateRef.current, role, sheet.id!, new Date(form.date).getTime())
      : saveEvent(stateRef.current, role, { title: form.title, description: form.description, startsAt: new Date(form.date).getTime(), capacity: Number(form.capacity) }, sheet.kind === "edit" ? sheet.id : undefined);
    if (result.error) { setError(result.error); return; }
    save(result.state); setSheet(null); setError("");
  }
  function trapDialog(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); setSheet(null); setError(""); return; }
    if (event.key !== "Tab") return;
    const targets = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled])') ?? []);
    const first = targets[0], last = targets[targets.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  }
  function eventEmbed(item: Event) {
    const count = Object.values(item.responses).filter(value => value === "join").length;
    const closed = item.cancelled || item.startsAt <= Date.now();
    return <>
      <div className={`discord-events-embed${item.cancelled ? " is-cancelled" : ""}`}>
        <small><CalendarDays size={12} /> СОБЫТИЕ #{item.id} <span>{item.cancelled ? "ОТМЕНЕНО" : closed ? "НАЧАЛОСЬ" : "ЗАПИСЬ ОТКРЫТА"}</span></small>
        <h4>{item.title}</h4><p>{item.description}</p>
        <div className="discord-events-fields"><div><b>Когда</b><span>{formatDate(item.startsAt)}</span></div><div><b>Участники</b><span>{count} / {item.capacity} мест</span></div></div>
        <div className="discord-events-attending"><Users size={12} />{Object.entries(item.responses).filter(([, value]) => value === "join").map(([id]) => names[id]).join(", ") || "Будьте первым участником"}</div>
        <footer>{item.responses[role] ? `Ваш ответ: ${responseLabels[item.responses[role]]}` : "Вы ещё не ответили"} · местное время</footer>
      </div>
      <div className="discord-events-actions">{(["join", "maybe", "decline"] as Rsvp[]).map(response => <button type="button" key={response} className={response === "join" ? "is-success" : ""} aria-pressed={item.responses[role] === response} disabled={closed || item.responses[role] === response} onClick={() => apply(respond(stateRef.current, role, item.id, response), `${responseLabels[response]} · #${item.id}`)}>{response === "join" ? <Check size={12} /> : response === "decline" ? <X size={12} /> : "?"}{responseLabels[response]}</button>)}</div>
      {item.poll && <div className="discord-events-poll"><b>Какое время удобнее?</b>{item.poll.options.map((option, index) => <button type="button" key={option} aria-pressed={item.poll!.votes[role] === index} disabled={closed || item.poll!.votes[role] === index} onClick={() => apply(vote(stateRef.current, role, item.id, index), `Голос за ${formatDate(option)} · #${item.id}`)}><span>{item.poll!.votes[role] === index && <Check size={10} />}{formatDate(option)}</span><strong>{Object.values(item.poll!.votes).filter(value => value === index).length}</strong></button>)}<small>Один голос · можно изменить выбор</small></div>}
      {role === "admin" && <div className="discord-events-actions discord-events-admin-actions"><button type="button" onClick={() => save(exchange(stateRef.current, role, `/participants ${item.id}`, `Участники «${item.title}»\n${participants(item)}`))}>Участники</button>{!item.cancelled && <><button type="button" onClick={() => openSheet("edit", item)}>Изменить</button><button type="button" onClick={() => openSheet("reschedule", item)}>Перенести</button><button type="button" className="is-danger" onClick={() => openSheet("cancel", item)}>Отменить</button></>}</div>}
    </>;
  }

  return <div className="mobile-app-preview mobile-app-preview--discord-events">
    <div className="mobile-app-preview__device"><div className="app-phone-frame"><div className="discord-events-phone" lang="ru">
      <PhoneStatusBar />
      <header className="discord-events-server"><span className="discord-events-server-icon"><CalendarDays size={21} /></span><div><strong>Pixel Club <ChevronDown size={14} /></strong><small><i /> Сообщество · 128 участников</small></div></header>
      <div className="discord-events-channel"><Menu size={19} /><Hash size={21} /><strong>события</strong><Users size={17} /></div>
      <div className="discord-events-chat" ref={scrollRef}>
        <div className="discord-events-welcome"><span><Hash size={28} /></span><h3>события</h3><p>Здесь начинается ваша следующая встреча.</p><button type="button" onClick={() => save(exchange(stateRef.current, role, "/help", "Начните с /events или нажмите «Пойду» под карточкой. Все команды доступны через /help. Администратор может создать встречу через /create."))}>Открыть подсказку бота</button></div>
        <div className="discord-events-divider">ВСТРЕЧИ СООБЩЕСТВА</div>
        <div role="log" aria-label="Сообщения канала события" aria-live="polite" className="discord-events-messages">
          {state.messages.map(message => <article key={message.id} className="discord-events-message"><span className={`discord-events-avatar is-${message.author}`}>{message.author === "bot" ? <CalendarDays size={18} /> : names[message.author]?.[0]}</span><div><header><b>{message.author === "bot" ? "Events" : names[message.author]}</b>{message.author === "bot" && <span className="discord-events-app"><Check size={8} /> ПРИЛОЖЕНИЕ</span>}<time>{time(message.at)}</time></header><p>{message.text}</p>{message.eventId && state.events.find(item => item.id === message.eventId) && eventEmbed(state.events.find(item => item.id === message.eventId)!)}</div></article>)}
        </div>
      </div>
      <div className="discord-events-compose-area">
        {suggestions.length > 0 && <div className="discord-events-suggestions" aria-label="Подсказки команд"><small>КОМАНДЫ EVENTS</small>{suggestions.map(command => <button type="button" key={command.name} onClick={() => { setInput(command.name + (['/event', '/edit', '/reschedule', '/cancel', '/participants'].includes(command.name) ? " " : "")); composerRef.current?.focus(); }}><CalendarDays size={15} /><b>{command.name}</b><span>{command.hint}</span></button>)}</div>}
        <form className="discord-events-composer" onSubmit={submitCommand}><button type="button" aria-label="Открыть команды" onClick={() => { setInput("/"); composerRef.current?.focus(); }}><PlusCircle size={21} /></button><input ref={composerRef} aria-label="Сообщение или команда" maxLength={1000} placeholder="Написать в #события" value={input} onChange={event => setInput(event.target.value)} /><button type="submit" aria-label="Отправить" disabled={!input.trim()}>{input.trim() ? <Send size={18} /> : <Smile size={20} />}</button></form>
        <div className="discord-events-account"><span className={`discord-events-avatar is-${role}`}>{names[role][0]}</span><div><b>{names[role]}</b><small>{role === "admin" ? "Администратор" : "В сети"}</small></div><Headphones size={16} /><span className="discord-events-online" /></div>
      </div>
      {sheet && <div className="discord-events-backdrop" onClick={event => { if (event.target === event.currentTarget) setSheet(null); }}><div className="discord-events-modal" role="dialog" aria-modal="true" aria-labelledby="discord-events-dialog-title" ref={dialogRef} onKeyDown={trapDialog}><header><div><small>ПРИЛОЖЕНИЕ EVENTS</small><h4 id="discord-events-dialog-title">{sheet.kind === "create" ? "Создать встречу" : sheet.kind === "edit" ? "Изменить встречу" : sheet.kind === "reschedule" ? "Перенести встречу" : "Отменить встречу?"}</h4></div><button type="button" aria-label="Закрыть форму" onClick={() => setSheet(null)}><X size={18} /></button></header>
        <form onSubmit={submitForm}>
          {sheet.kind === "cancel" ? <p>«{selected?.title}» будет отменена. Ответы сохранятся, запись и голосование закроются.</p> : <>
            {sheet.kind !== "reschedule" && <><label>Название<input required maxLength={80} value={form.title} onChange={event => setForm({ ...form, title: event.target.value })} /></label><label>Описание<textarea required maxLength={500} rows={3} value={form.description} onChange={event => setForm({ ...form, description: event.target.value })} /></label></>}
            <label>Дата и время<input required type="datetime-local" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} /></label>
            {sheet.kind !== "reschedule" && <label>Количество мест<input required type="number" min={1} max={100} step={1} value={form.capacity} onChange={event => setForm({ ...form, capacity: event.target.value })} /></label>}
            <small>Местное время. При переносе ответы участников сохранятся, голосование за время завершится.</small>
          </>}
          {error && <p className="discord-events-form-error" role="alert">{error}</p>}
          <div className="discord-events-form-buttons"><button type="button" onClick={() => setSheet(null)}>Назад</button><button type="submit" className={sheet.kind === "cancel" ? "is-danger" : "is-primary"}>{sheet.kind === "cancel" ? "Да, отменить" : sheet.kind === "create" ? "Создать" : "Сохранить"}</button></div>
        </form>
      </div></div>}
    </div></div></div>
    <div className="discord-events-presentation"><AppPreviewCopy {...copy} /><div className="discord-events-controls"><div className="discord-events-role-switch" role="group" aria-label={copy.roleLabel}>{(["member", "admin"] as Role[]).map(value => <button type="button" key={value} aria-pressed={role === value} onClick={() => { setRole(value); setInput(""); setSheet(null); setResetConfirm(false); }}>{copy[value]}</button>)}</div><p>{copy.notice}</p>{storageError && <p role="status">{copy.storageError}</p>}{recovered && <p role="status">{copy.recovered}</p>}
      {resetConfirm ? <div className="discord-events-reset-confirm"><span>{copy.resetPrompt}</span><button type="button" onClick={() => { const next = createDemoState(); previousMessageId.current = undefined; save(next); setRole("member"); setInput(""); setSheet(null); setRecovered(false); setResetConfirm(false); }}>{copy.resetConfirm}</button><button type="button" onClick={() => setResetConfirm(false)}>{copy.cancel}</button></div> : <button type="button" className="discord-events-reset" onClick={() => setResetConfirm(true)}>{copy.reset}</button>}
    </div></div>
  </div>;
}
