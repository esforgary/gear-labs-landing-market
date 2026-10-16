import { useEffect, useRef, useState, type FormEvent } from "react";
import { CalendarDays, CheckCheck, ChevronLeft, Menu, Send } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../../apps/mobile-apps/app-preview-presentation";
import { getTgBookingPreviewCopy } from "./preview-copy";
import { STORAGE_KEY, createDemoState, restoreDemoState } from "./booking-model";
import { createBookingSession, refreshBookingSession, submitBookingTurn, type BookingRole, type ConversationInput } from "./booking-conversation";
import "./tg-booking.scss";

function readState() {
  try { return { ...restoreDemoState(localStorage.getItem(STORAGE_KEY)), storageError: false }; }
  catch { return { state: createDemoState(), recovered: false, storageError: true }; }
}

export default function TgBookingPreview() {
  const { lang } = useThemeLang();
  const copy = getTgBookingPreviewCopy(lang);
  const [initial] = useState(readState);
  const [session, setSession] = useState(() => createBookingSession(initial.state));
  const sessionRef = useRef(session);
  const [storageError, setStorageError] = useState(initial.storageError);
  const [recovered, setRecovered] = useState(initial.recovered);
  const [resetConfirm, setResetConfirm] = useState(false);
  const [role, setRole] = useState<BookingRole>("customer");
  const [inputs, setInputs] = useState<Record<BookingRole, string>>({ customer: "", admin: "" });
  const [menu, setMenu] = useState(false);
  const chat = useRef<HTMLDivElement>(null);
  const current = session.chats[role];
  const input = inputs[role];
  const commands = role === "customer"
    ? [["/book", "Новая запись"], ["/bookings", "Мои записи"], ["/cancel", "Отменить действие"], ["/help", "Помощь"]]
    : [["/bookings", "Все заявки"], ["/slots", "Расписание"], ["/cancel", "Отменить действие"], ["/help", "Помощь"]];

  useEffect(() => {
    const area = chat.current, latest = area?.lastElementChild as HTMLElement | null;
    if (!area || !latest) return;
    // Long inline keyboards start at the bot's question; the composer always stays visible.
    const target = latest.getBoundingClientRect().top - area.getBoundingClientRect().top + area.scrollTop - 10;
    area.scrollTo({ top: latest.offsetHeight > area.clientHeight - 24 ? target : area.scrollHeight });
  }, [current.messages, role]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const restored = restoreDemoState(event.newValue);
      const next = refreshBookingSession(sessionRef.current, restored.state);
      sessionRef.current = next; setSession(next); setRecovered(restored.recovered);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  function persist(next: typeof session) {
    if (next.data !== sessionRef.current.data) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next.data)); setStorageError(false); }
      catch { setStorageError(true); }
    }
    sessionRef.current = next; setSession(next);
  }
  function submit(value: ConversationInput) {
    persist(submitBookingTurn(sessionRef.current, role, value));
    setMenu(false);
    setInputs(previous => ({ ...previous, [role]: "" }));
  }
  function send(event: FormEvent) { event.preventDefault(); if (input.trim()) submit({ text: input }); }
  function switchRole(next: BookingRole) { setRole(next); setMenu(false); setResetConfirm(false); }
  function reset() {
    persist(createBookingSession()); setRecovered(false); setInputs({ customer: "", admin: "" }); switchRole("customer");
  }
  const placeholder = current.flow.step === "name" ? "Ваше имя…" : current.flow.step === "contact" ? "Telegram или телефон…" : "Сообщение";

  return <div className="mobile-app-preview mobile-app-preview--tg-booking">
    <div className="mobile-app-preview__device"><div className="app-phone-frame"><div className="tg-booking-phone">
      <PhoneStatusBar />
      <header className="tg-booking-header"><ChevronLeft size={21} aria-hidden="true" /><span className="tg-booking-avatar"><CalendarDays size={20} /></span><div><h3>TG Booking <span>✓</span></h3><small>бот · запись в студию</small></div><button type="button" aria-label="Команды бота" aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu size={19} /></button></header>
      <div className="tg-booking-banner">Демо Telegram · {role === "customer" ? "клиент" : "администратор"}</div>
      <div className="tg-booking-chat" ref={chat} role="log" aria-label="Переписка с ботом" aria-live="polite" aria-relevant="additions">
        <span className="tg-booking-today">Сегодня</span>
        {current.messages.map(entry => <div className={`tg-booking-message${entry.user ? " is-user" : ""}${entry.error ? " is-error" : ""}`} key={`${role}-${entry.id}`}>
          {entry.studio && <div className="tg-booking-studio"><span>ТИХОЕ УТРО</span><b>Время для себя.</b><i>✧</i><small>Ваша студия красоты</small></div>}
          <p>{entry.text}</p>
          <span className="tg-booking-message-time">{entry.studio ? "09:41" : "сейчас"}{entry.user && <CheckCheck size={12} />}</span>
          {entry.choices && <div className={`tg-booking-inline${entry.layout ? ` is-${entry.layout}` : ""}${entry.id !== current.activeId ? " is-history" : ""}`} aria-label={entry.id === current.activeId ? "Варианты ответа" : "Предыдущие варианты ответа"}>
            {entry.choices.map(item => <button type="button" key={item.value} disabled={entry.id !== current.activeId || item.disabled} title={item.hint} aria-label={item.hint ? `${item.label.replaceAll("\n", " · ")} · ${item.hint}` : item.label.replaceAll("\n", " · ")} className={item.value === "back" || item.value.startsWith("command:") ? "is-navigation" : undefined} onClick={() => submit({ messageId: entry.id, value: item.value })}>{item.label}</button>)}
          </div>}
        </div>)}
      </div>
      <nav className="tg-booking-quick" aria-label="Действия бота">
        <button type="button" onClick={() => submit({ text: role === "customer" ? "/book" : "/slots" })}>{role === "customer" ? "Записаться" : "Расписание"}</button>
        <button type="button" onClick={() => submit({ text: "/bookings" })}>{role === "customer" ? "Мои записи" : "Все заявки"}</button>
      </nav>
      <form className="tg-booking-composer" onSubmit={send}>
        <button type="button" aria-label="Меню команд" aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu size={19} /></button>
        <input aria-label="Сообщение боту" value={input} maxLength={200} placeholder={placeholder} autoComplete="off" onChange={event => setInputs(previous => ({ ...previous, [role]: event.target.value }))} />
        <button type="submit" aria-label="Отправить" disabled={!input.trim()}><Send size={17} /></button>
      </form>
      {menu && <div className="tg-booking-menu">{commands.map(([value, label]) => <button key={value} type="button" onClick={() => submit({ text: value })}><strong>{value}</strong><span>{label}</span></button>)}</div>}
    </div></div></div>
    <div className="tg-booking-presentation"><AppPreviewCopy kicker={copy.kicker} title="TG Booking" description={copy.description} features={copy.features} /><div className="tg-booking-controls"><div className="tg-booking-role-switch" aria-label={copy.demoMode}><button type="button" aria-pressed={role === "customer"} onClick={() => switchRole("customer")}>{copy.customer}</button><button type="button" aria-pressed={role === "admin"} onClick={() => switchRole("admin")}>{copy.admin}</button></div><p className="tg-booking-demo-note">{copy.demoNote}</p>{storageError && <p className="tg-booking-external-notice" role="status">{copy.storageError}</p>}{recovered && <p className="tg-booking-external-notice" role="status">{copy.restoreNotice}</p>}{resetConfirm ? <div className="tg-booking-reset"><span>{copy.resetQuestion}</span><button type="button" key="reset-confirm" onClick={reset}>{copy.confirmReset}</button><button type="button" key="reset-cancel" onClick={() => setResetConfirm(false)}>{copy.cancel}</button></div> : <button type="button" key="reset-open" className="tg-booking-reset" onClick={() => setResetConfirm(true)}>{copy.reset}</button>}</div></div>
  </div>;
}
