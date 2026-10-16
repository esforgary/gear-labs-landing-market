import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, ChevronDown, Flag, Hash, History, MessageSquare, Send, ShieldCheck, Users, X } from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { AppPreviewCopy, PhoneStatusBar } from "../../apps/mobile-apps/app-preview-presentation";
import { getDiscordGuardCopy } from "./preview-copy";
import { ADMIN_ID, MEMBER_ID, STORAGE_KEY, createDemoState, deleteMessage, memberRestriction, moderateMember, reportMessage, restoreDemoState, reviewReport, sendMessage, type DemoState, type Member, type Role } from "./moderation-model";
import "./discord-guard.scss";

type Tab = "chat" | "reports" | "members" | "log";
type ModerationAction = "warn" | "timeout" | "untimeout" | "ban" | "unban";
type Sheet = { kind: "report"; messageId: number } | { kind: "delete"; messageId: number } | { kind: "member"; memberId: string };
const actionLabels: Record<ModerationAction, string> = { warn: "Предупредить", timeout: "Тайм-аут · 10 мин", untimeout: "Снять тайм-аут", ban: "Заблокировать", unban: "Разблокировать" };
const reportLabels = { open: "Открыта", resolved: "Решена", dismissed: "Отклонена" };
const time = (at: number) => new Date(at).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
function readInitial() {
  try { return { ...restoreDemoState(localStorage.getItem(STORAGE_KEY)), storageError: false }; }
  catch { return { state: createDemoState(), recovered: false, storageError: true }; }
}
function Avatar({ member }: { member?: Member }) {
  return <span className="discord-guard-avatar" style={{ background: member?.color ?? "#5865f2" }}>{member?.role === "admin" ? <ShieldCheck size={16} /> : member?.name.slice(0, 1) ?? "?"}</span>;
}

export default function DiscordGuardPreview() {
  const { lang } = useThemeLang();
  const copy = getDiscordGuardCopy(lang);
  const [initial] = useState(readInitial);
  const [state, setState] = useState(initial.state);
  const stateRef = useRef(state);
  const [role, setRole] = useState<Role>("member");
  const [tab, setTab] = useState<Tab>("chat");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [reason, setReason] = useState("");
  const [action, setAction] = useState<ModerationAction>("warn");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [filter, setFilter] = useState<"open" | "all">("open");
  const [now, setNow] = useState(Date.now);
  const [storageError, setStorageError] = useState(initial.storageError);
  const [recovered, setRecovered] = useState(initial.recovered);
  const [resetConfirm, setResetConfirm] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const self = state.members.find(member => member.id === MEMBER_ID)!;
  const selectedMember = sheet?.kind === "member" ? state.members.find(member => member.id === sheet.memberId) : undefined;
  const selectedMessage = sheet && sheet.kind !== "member" ? state.messages.find(item => item.id === sheet.messageId) : undefined;
  const restriction = role === "member" ? memberRestriction(state, now) : null;
  const reports = state.reports.filter(report => (role === "admin" || report.reporterId === MEMBER_ID) && (filter === "all" || report.status === "open"));
  const events = state.events.filter(event => role === "admin" || event.targetId === MEMBER_ID);

  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(timer); }, []);
  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY) return;
      const restored = restoreDemoState(event.newValue);
      stateRef.current = restored.state; setState(restored.state); setRecovered(restored.recovered); setSheet(null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: tab === "chat" ? scrollRef.current.scrollHeight : 0 });
  }, [tab, state.messages.length]);

  function save(next: DemoState) {
    stateRef.current = next; setState(next); setNow(Date.now());
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); setStorageError(false); } catch { setStorageError(true); }
  }
  function run(operation: (current: DemoState) => { state: DemoState; error?: string }, success: string) {
    const result = operation(stateRef.current);
    if (result.error) { setError(result.error); return false; }
    save(result.state); setError(""); setNotice(success); return true;
  }
  function switchTab(next: Tab) { setTab(next); setError(""); setNotice(""); setSheet(null); }
  function switchRole(next: Role) { setRole(next); switchTab("chat"); setMessage(""); setReason(""); setResetConfirm(false); }
  function openSheet(next: Sheet) { setSheet(next); setReason(""); setAction("warn"); setError(""); setNotice(""); }
  function submitMessage(event: FormEvent) {
    event.preventDefault();
    if (run(current => sendMessage(current, role, message), "")) setMessage("");
  }
  function submitAction(event: FormEvent) {
    event.preventDefault();
    if (!sheet) return;
    const success = sheet.kind === "report" ? "Жалоба отправлена. Администратор увидит её в очереди." : "Действие выполнено и добавлено в журнал.";
    const done = run(current => sheet.kind === "report" ? reportMessage(current, role, sheet.messageId, reason)
      : sheet.kind === "delete" ? deleteMessage(current, role, sheet.messageId, reason)
      : moderateMember(current, role, sheet.memberId, availableActions.includes(action) ? action : availableActions[0], reason), success);
    if (done) { setSheet(null); setReason(""); }
  }
  function reset() { save(createDemoState()); setRecovered(false); switchRole("member"); }
  const memberStatus = (member: Member) => member.banned ? "Заблокирован" : member.timeoutUntil && member.timeoutUntil > now ? `Тайм-аут до ${time(member.timeoutUntil)}` : member.role === "admin" ? "Администратор" : "Участник";
  const availableActions: ModerationAction[] = selectedMember?.banned ? ["unban"] : selectedMember?.timeoutUntil && selectedMember.timeoutUntil > now ? ["warn", "untimeout", "ban"] : ["warn", "timeout", "ban"];

  return <div className="mobile-app-preview mobile-app-preview--discord-guard">
    <div className="mobile-app-preview__device"><div className="app-phone-frame"><div className="discord-guard-phone" lang="ru">
      <PhoneStatusBar />
      <header className="discord-guard-header"><span className="discord-guard-server"><ShieldCheck size={22} /></span><div><h3>Pixel Club <ChevronDown size={13} /></h3><small><i /> Сервер сообщества · демо</small></div></header>
      <div className="discord-guard-channel"><Hash size={19} /><strong>{tab === "chat" ? "общий" : tab === "reports" ? "жалобы" : tab === "members" ? "участники" : "журнал"}</strong><span>{role === "admin" ? "ADMIN" : "УЧАСТНИК"}</span></div>
      <div className="discord-guard-body" ref={scrollRef}>
        {tab === "chat" && <>
          <div className="discord-guard-welcome"><ShieldCheck size={24} /><strong>Место для своих.</strong><p>Общаемся уважительно, без спама. Discord Guard помогает поддерживать порядок.</p></div>
          <div className="discord-guard-day">СЕГОДНЯ</div>
          <div role="log" aria-label="Сообщения канала" aria-live="polite" className="discord-guard-messages">
            {state.messages.map(item => { const author = state.members.find(member => member.id === item.memberId); return <article key={item.id} className={`discord-guard-message${item.deleted ? " is-deleted" : ""}`}>
              <Avatar member={author} /><div><header><b style={{ color: author?.color }}>{author?.name}</b>{item.memberId === ADMIN_ID && <span>MOD</span>}<time>{time(item.at)}</time></header><p>{item.deleted ? "Сообщение удалено модератором" : item.text}</p>
                {!item.deleted && <div className="discord-guard-message-actions">{role === "admin" ? <><button type="button" onClick={() => openSheet({ kind: "delete", messageId: item.id })}>Удалить</button>{author?.role !== "admin" && <button type="button" onClick={() => openSheet({ kind: "member", memberId: item.memberId })}>Меры</button>}</> : item.memberId !== MEMBER_ID && item.memberId !== ADMIN_ID && <button type="button" disabled={self.banned || state.reports.some(report => report.messageId === item.id && report.reporterId === MEMBER_ID)} onClick={() => openSheet({ kind: "report", messageId: item.id })}><Flag size={10} /> Пожаловаться</button>}</div>}
              </div></article>; })}
          </div>
        </>}
        {tab === "reports" && <>
          <div className="discord-guard-section-title"><Flag size={22} /><h4>{role === "admin" ? "Очередь жалоб" : "Мои жалобы"}</h4><p>{role === "admin" ? "Изучите контекст и выберите действие." : "Жалобы видны администратору. Решение появится здесь."}</p></div>
          <label className="discord-guard-filter">Показать<select value={filter} onChange={event => setFilter(event.target.value as "open" | "all")}><option value="open">Открытые</option><option value="all">Все жалобы</option></select></label>
          {!reports.length && <p className="discord-guard-empty">Здесь пока нет жалоб. На сообщение в общем канале можно пожаловаться.</p>}
          {reports.map(report => { const reportedMessage = state.messages.find(item => item.id === report.messageId); const member = state.members.find(item => item.id === reportedMessage?.memberId); return <article className="discord-guard-card" key={report.id}>
            <header><b>Жалоба #{report.id}</b><span className={`discord-guard-badge is-${report.status}`}>{reportLabels[report.status]}</span></header>
            <small>На сообщение {member?.name}</small><blockquote>{reportedMessage?.deleted ? "Сообщение удалено" : reportedMessage?.text}</blockquote><p>{report.reason}</p>
            {role === "admin" && report.status === "open" && <div className="discord-guard-card-actions"><button type="button" onClick={() => openSheet({ kind: "member", memberId: member!.id })}>Меры: {member?.name}</button>{reportedMessage && !reportedMessage.deleted && <button type="button" onClick={() => openSheet({ kind: "delete", messageId: reportedMessage.id })}>Удалить сообщение</button>}<button type="button" onClick={() => run(current => reviewReport(current, role, report.id, "resolved"), "Жалоба решена.")}><Check size={12} /> Решено</button><button type="button" onClick={() => run(current => reviewReport(current, role, report.id, "dismissed"), "Жалоба отклонена.")}>Отклонить</button></div>}
          </article>; })}
        </>}
        {tab === "members" && <>
          <div className="discord-guard-section-title"><Users size={24} /><h4>{role === "admin" ? "Участники сервера" : "Мой статус"}</h4><p>{role === "admin" ? "Предупреждения и ограничения с указанием причины." : "Ваши предупреждения и ограничения видны здесь."}</p></div>
          {(role === "admin" ? state.members : [self]).map(member => <article key={member.id} className="discord-guard-member-card"><Avatar member={member} /><div><strong>{member.name}</strong><span>{memberStatus(member)}</span><small>Предупреждений: {member.warnings}</small></div>{role === "admin" && member.role !== "admin" && <button type="button" aria-label={`Модерация: ${member.name}`} onClick={() => openSheet({ kind: "member", memberId: member.id })}>Меры</button>}</article>)}
          {role === "member" && <div className="discord-guard-card"><b>Ваши права</b><p>{restriction || "Вы можете писать в общий канал и отправлять жалобы на сообщения."}</p></div>}
        </>}
        {tab === "log" && <>
          <div className="discord-guard-section-title"><History size={24} /><h4>{role === "admin" ? "Журнал модерации" : "Мои уведомления"}</h4><p>Discord Guard <span className="discord-guard-bot-tag">APP</span></p></div>
          {!events.length && <p className="discord-guard-empty">Действий модератора пока нет.</p>}
          {[...events].reverse().map(event => <article key={event.id} className="discord-guard-event"><ShieldCheck size={15} /><div><p>{event.text}</p><time>{new Date(event.at).toLocaleDateString("ru-RU")} · {time(event.at)}</time></div></article>)}
        </>}
      </div>
      {notice && <div className="discord-guard-notice" role="status">{notice}</div>}
      {error && !sheet && <div className="discord-guard-error" role="alert">{error}</div>}
      {tab === "chat" && <>{restriction && <div className="discord-guard-restriction" role="status">{restriction}</div>}<form className="discord-guard-composer" onSubmit={submitMessage}><input aria-label="Сообщение в общий канал" maxLength={500} disabled={!!restriction} value={message} onChange={event => setMessage(event.target.value)} placeholder={restriction ? "Отправка недоступна" : "Написать в #общий"} /><button type="submit" aria-label="Отправить сообщение" disabled={!!restriction || !message.trim()}><Send size={17} /></button></form></>}
      <nav className="discord-guard-nav" aria-label="Разделы сервера">{([{ id: "chat", label: "Чат", Icon: MessageSquare }, { id: "reports", label: "Жалобы", Icon: Flag }, { id: "members", label: role === "admin" ? "Участники" : "Мой статус", Icon: Users }, { id: "log", label: "Журнал", Icon: History }] as const).map(({ id, label, Icon }) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => switchTab(id)}><Icon size={18} /><span>{label}</span>{id === "reports" && state.reports.some(report => report.status === "open" && (role === "admin" || report.reporterId === MEMBER_ID)) && <i />}</button>)}</nav>
      {sheet && <div className="discord-guard-sheet-backdrop"><section className="discord-guard-sheet" aria-label="Действие модерации"><header><strong>{sheet.kind === "report" ? "Отправить жалобу" : sheet.kind === "delete" ? "Удалить сообщение" : selectedMember?.name}</strong><button type="button" aria-label="Закрыть действие" onClick={() => { setSheet(null); setError(""); }}><X size={18} /></button></header>
        <form key={`${sheet.kind}-${sheet.kind === "member" ? sheet.memberId : sheet.messageId}`} onSubmit={submitAction}>
          {selectedMessage && <blockquote>{selectedMessage.text}</blockquote>}
          {selectedMember && <><p className="discord-guard-sheet-status">{memberStatus(selectedMember)} · предупреждений: {selectedMember.warnings}</p><label>Действие<select value={availableActions.includes(action) ? action : availableActions[0]} onChange={event => setAction(event.target.value as ModerationAction)}>{availableActions.map(value => <option key={value} value={value}>{actionLabels[value]}</option>)}</select></label></>}
          <label>{sheet.kind === "report" ? "Причина жалобы" : "Причина действия"}<textarea autoFocus required maxLength={180} rows={3} value={reason} onChange={event => setReason(event.target.value)} placeholder={sheet.kind === "report" ? "Что нарушает правила сервера?" : "Объясните причину участнику…"} /></label>
          <small>Только вымышленные данные · {reason.length}/180</small>
          {error && <p className="discord-guard-error" role="alert">{error}</p>}
          <button key="apply-action" type="submit" className="discord-guard-primary">{sheet.kind === "report" ? "Отправить жалобу" : sheet.kind === "delete" ? "Подтвердить удаление" : "Применить действие"}</button>
        </form>
      </section></div>}
    </div></div></div>
    <div className="discord-guard-presentation"><AppPreviewCopy kicker={copy.kicker} title={copy.title} description={copy.description} features={copy.features} /><div className="discord-guard-controls">
      <div className="discord-guard-role-switch" role="group" aria-label={copy.roleLabel}><button type="button" aria-pressed={role === "member"} onClick={() => switchRole("member")}>{copy.member}</button><button type="button" aria-pressed={role === "admin"} onClick={() => switchRole("admin")}>{copy.admin}</button></div>
      <p>{copy.notice}</p>{storageError && <p role="status" className="discord-guard-storage-error">{copy.storageError}</p>}{recovered && <p role="status">{copy.recovered}</p>}
      {resetConfirm ? <div className="discord-guard-reset-confirm"><span>{copy.resetPrompt}</span><button key="confirm-reset" type="button" onClick={reset}>{copy.resetConfirm}</button><button key="cancel-reset" type="button" onClick={() => setResetConfirm(false)}>{copy.cancel}</button></div> : <button key="ask-reset" type="button" className="discord-guard-reset" onClick={() => setResetConfirm(true)}>{copy.reset}</button>}
    </div></div>
  </div>;
}
