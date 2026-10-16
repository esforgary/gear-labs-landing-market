import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckCheck, Headphones, Menu, Send } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../../apps/mobile-apps/app-preview-presentation";
import { getTgSupportPreviewCopy } from "./preview-copy";
import { STORAGE_KEY, createDemoState, restoreDemoState, visibleTickets, customerActor, adminActor, statusLabels, type DemoState } from "./support-model";
import { advanceSupportConversation, createSupportSession, syncSupportSession, type SupportRole } from "./support-conversation";
import "./tg-support.scss";

const formatTime = (at: number) => new Date(at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
function readState() { try { return restoreDemoState(localStorage.getItem(STORAGE_KEY)); } catch { return createDemoState(); } }

export default function TgSupportPreview() {
  const { lang } = useThemeLang();
  const copy = getTgSupportPreviewCopy(lang);
  const [state, setState] = useState<DemoState>(readState);
  const stateRef = useRef(state);
  const [role, setRole] = useState<SupportRole>("customer");
  const [sessions, setSessions] = useState(() => ({ customer: createSupportSession("customer"), admin: createSupportSession("admin") }));
  const sessionsRef = useRef(sessions);
  const [input, setInput] = useState("");
  const [menu, setMenu] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const session = sessions[role];
  const ticket = visibleTickets(state, role === "admin" ? adminActor : customerActor).find(item => item.id === session.ticketId);
  const lastId = session.entries.at(-1)?.id;
  const commands = role === "customer" ? [["/new", "Новое обращение"], ["/tickets", "Мои обращения"], ["/cancel", "Главное меню"], ["/help", "Помощь"]] : [["/queue", "Очередь"], ["/cancel", "Главное меню"], ["/help", "Помощь"]];

  useEffect(() => {
    const chat = chatRef.current;
    const last = chat?.lastElementChild as HTMLElement | null;
    if (!chat || !last) return;
    const top = last.offsetHeight > chat.clientHeight - 20 ? last.getBoundingClientRect().top - chat.getBoundingClientRect().top + chat.scrollTop - 10 : chat.scrollHeight;
    chat.scrollTo({ top, behavior: "smooth" });
  }, [session.entries.length, lastId, role]);
  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const next = restoreDemoState(event.newValue);
      stateRef.current = next; setState(next);
      const updated = { customer: syncSupportSession(next, sessionsRef.current.customer, "customer"), admin: syncSupportSession(next, sessionsRef.current.admin, "admin") };
      sessionsRef.current = updated; setSessions(updated);
    };
    window.addEventListener("storage", sync); return () => window.removeEventListener("storage", sync);
  }, []);
  function save(next: DemoState) {
    stateRef.current = next; setState(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); }
  }
  function dispatch(value: string, sourceId?: number) {
    const result = advanceSupportConversation(stateRef.current, sessionsRef.current[role], role, value, Date.now(), sourceId);
    if (result.state !== stateRef.current) save(result.state);
    const updated = { ...sessionsRef.current, [role]: result.session };
    sessionsRef.current = updated; setSessions(updated); setMenu(false);
  }
  function send(event: FormEvent) { event.preventDefault(); if (!input.trim()) return; dispatch(input); setInput(""); }
  function switchRole(next: SupportRole) {
    const updated = { ...sessionsRef.current, [next]: syncSupportSession(stateRef.current, sessionsRef.current[next], next) };
    sessionsRef.current = updated; setSessions(updated); setRole(next); setInput(""); setMenu(false); setResetConfirm(false);
  }
  function reset() {
    save(createDemoState());
    const updated = { customer: createSupportSession("customer"), admin: createSupportSession("admin") };
    sessionsRef.current = updated; setSessions(updated); setRole("customer"); setInput(""); setMenu(false); setResetConfirm(false);
  }

  return <div className="mobile-app-preview mobile-app-preview--tg-support">
    <div className="mobile-app-preview__device"><div className="app-phone-frame"><div className="tg-support-phone" lang="ru">
      <PhoneStatusBar />
      <header className="tg-support-header"><span className="tg-support-avatar"><Headphones size={21} /></span><div><h3>TG Support <span>✓</span></h3><small>бот · служба поддержки</small></div></header>
      <div className="tg-support-banner">Демо Telegram · {role === "customer" ? "клиент" : "администратор"}</div>
      <div className="tg-support-chat" ref={chatRef} role="log" aria-label="Переписка с TG Support" aria-live="polite">
        <span className="tg-support-chat-date">Сегодня</span>
        {session.entries.map(entry => <div key={entry.id} className={`tg-support-chat-entry${entry.from === "user" ? " is-own" : ""}`}>
          <div className={`tg-support-bubble${entry.from === "user" ? " is-own" : ""}`}><p className={entry.text.startsWith("/") ? "is-command" : undefined}>{entry.text}</p><time>{formatTime(entry.at)}{entry.from === "user" && <CheckCheck size={12} />}</time></div>
          {entry.choices.length > 0 && <div className="tg-support-inline-keyboard" role="group" aria-label={entry.id === lastId ? "Доступные действия бота" : "Предыдущие действия"}>{entry.choices.map(item => <button key={item.value} type="button" disabled={entry.id !== lastId} onClick={() => dispatch(item.value, entry.id)}>{item.label}</button>)}</div>}
        </div>)}
      </div>
      {ticket && <div className="tg-support-active-ticket">#{ticket.id} · {statusLabels[ticket.status]}<button type="button" onClick={() => dispatch("/cancel")}>В меню</button></div>}
      {menu && <nav className="tg-support-command-menu" aria-label="Команды TG Support">{commands.map(([command, label]) => <button type="button" key={command} onClick={() => dispatch(command)}><b>{command}</b><span>{label}</span></button>)}</nav>}
      <form className="tg-support-composer" onSubmit={send}>
        <button type="button" className="tg-support-menu-button" aria-label="Меню команд" aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu size={19} /></button>
        <textarea aria-label="Сообщение боту" placeholder={session.step === "subject" ? "Кратко назовите вопрос…" : session.step === "message" ? "Опишите ваш вопрос…" : "Сообщение"} rows={1} maxLength={1200} value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (input.trim()) { dispatch(input); setInput(""); } } }} />
        <button key="send-message" type="submit" disabled={!input.trim()} aria-label="Отправить сообщение"><Send size={17} /></button>
      </form>
    </div></div></div>
    <div className="tg-support-presentation"><AppPreviewCopy kicker={copy.kicker} title="TG Support" description={copy.description} features={copy.features} />
      <div className="tg-support-controls"><div className="tg-support-role-switch" role="group" aria-label={copy.demoMode}><button type="button" aria-pressed={role === "customer"} onClick={() => switchRole("customer")}>{copy.customer}</button><button type="button" aria-pressed={role === "admin"} onClick={() => switchRole("admin")}>{copy.admin}</button></div>
        <p className="tg-support-demo-note">{copy.demoNote}</p>{storageError && <p className="tg-support-storage-error" role="status">{copy.storageError}</p>}
        {resetConfirm ? <div className="tg-support-reset-confirm"><span>{copy.resetQuestion}</span><button key="confirm-reset" type="button" onClick={reset}>{copy.confirmReset}</button><button key="cancel-reset" type="button" onClick={() => setResetConfirm(false)}>{copy.cancel}</button></div> : <button key="ask-reset" type="button" className="tg-support-reset" onClick={() => setResetConfirm(true)}>{copy.reset}</button>}
      </div>
    </div>
  </div>;
}
