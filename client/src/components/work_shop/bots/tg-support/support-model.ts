export const STORAGE_KEY = "gearlabs.tg-support.demo.v1";
export const topics = ["Заказ и доставка", "Оплата", "Технический вопрос", "Другое"] as const;
export type Topic = typeof topics[number];
export type Status = "new" | "in-progress" | "waiting" | "resolved";
export const statusLabels: Record<Status, string> = { new: "Новое", "in-progress": "В работе", waiting: "Ждём клиента", resolved: "Закрыто" };
export type Actor = { role: "customer" | "admin"; id: string };
export const customerActor: Actor = { role: "customer", id: "demo-customer" };
export const adminActor: Actor = { role: "admin", id: "demo-operator" };
export type TicketEvent = { id: number; author: "customer" | "admin" | "system"; text: string; at: number };
export type Ticket = { id: number; customerId: string; topic: Topic; subject: string; status: Status; assignee: string | null; createdAt: number; updatedAt: number; history: TicketEvent[] };
export type DemoState = { version: 1; nextTicketId: number; tickets: Ticket[] };
export type TicketDraft = { topic: Topic; subject: string; message: string };
const MAX_TICKETS = 100;
const MAX_EVENTS = 300;
const statuses = Object.keys(statusLabels);
const validTime = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 8640000000000000;
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const validText = (value: unknown, max: number): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= max;
function text(value: unknown, label: string, max: number) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label}: заполните поле.`);
  const normalized = value.trim();
  if (normalized.length > max) throw new Error(`${label}: не более ${max} символов.`);
  return normalized;
}
function checkActor(actor: Actor) {
  if (!actor || (actor.role !== "customer" && actor.role !== "admin") || !validText(actor.id, 80)) throw new Error("Неизвестная роль.");
}
function adminOnly(actor: Actor) { checkActor(actor); if (actor.role !== "admin") throw new Error("Действие доступно администратору."); }
function access(state: DemoState, actor: Actor, id: number) {
  checkActor(actor);
  const ticket = state.tickets.find(item => item.id === id);
  if (!ticket || (actor.role === "customer" && ticket.customerId !== actor.id)) throw new Error("Обращение не найдено.");
  return ticket;
}
function append(ticket: Ticket, author: TicketEvent["author"], message: string, at: number): Ticket {
  if (!validTime(at) || at < ticket.updatedAt) throw new Error("Некорректное время события.");
  if (ticket.history.length >= MAX_EVENTS) throw new Error("История демо заполнена. Сбросьте демо, чтобы продолжить.");
  return { ...ticket, updatedAt: at, history: [...ticket.history, { id: ticket.history.length + 1, author, text: message, at }] };
}
function replace(state: DemoState, ticket: Ticket): DemoState { return { ...state, tickets: state.tickets.map(item => item.id === ticket.id ? ticket : item) }; }

export function createDemoState(): DemoState {
  const at = Date.UTC(2026, 0, 15, 9);
  return { version: 1, nextTicketId: 2003, tickets: [
    { id: 2001, customerId: "demo-customer", topic: "Заказ и доставка", subject: "Изменить пункт выдачи", status: "new", assignee: null, createdAt: at, updatedAt: at, history: [
      { id: 1, author: "system", text: "Пример обращения. Все данные вымышлены.", at },
      { id: 2, author: "customer", text: "Здравствуйте! Можно изменить пункт выдачи для демо-заказа № 42?", at },
    ] },
    { id: 2002, customerId: "demo-customer-2", topic: "Технический вопрос", subject: "Не открывается инструкция", status: "new", assignee: null, createdAt: at + 60000, updatedAt: at + 60000, history: [
      { id: 1, author: "system", text: "Пример другого клиента. Все данные вымышлены.", at: at + 60000 },
      { id: 2, author: "customer", text: "В демо-каталоге не открывается инструкция к устройству.", at: at + 60000 },
    ] },
  ] };
}

export function visibleTickets(state: DemoState, actor: Actor): Ticket[] {
  checkActor(actor);
  return state.tickets.filter(ticket => actor.role === "admin" || ticket.customerId === actor.id).sort((a, b) => b.updatedAt - a.updatedAt || b.id - a.id);
}
export function createTicket(state: DemoState, actor: Actor, draft: TicketDraft, at = Date.now()): DemoState {
  checkActor(actor);
  if (actor.role !== "customer") throw new Error("Создать обращение может клиент.");
  if (!topics.includes(draft.topic)) throw new Error("Выберите тему обращения.");
  const subject = text(draft.subject, "Заголовок", 80);
  const message = text(draft.message, "Сообщение", 1200);
  if (!validTime(at)) throw new Error("Некорректное время обращения.");
  if (state.tickets.length >= MAX_TICKETS) throw new Error("Достигнут лимит демо-обращений. Сбросьте демо.");
  const ticket: Ticket = { id: state.nextTicketId, customerId: actor.id, topic: draft.topic, subject, status: "new", assignee: null, createdAt: at, updatedAt: at, history: [
    { id: 1, author: "system", text: "Обращение создано в локальном демо.", at },
    { id: 2, author: "customer", text: message, at },
  ] };
  return { ...state, nextTicketId: state.nextTicketId + 1, tickets: [...state.tickets, ticket] };
}
export function claimTicket(state: DemoState, actor: Actor, id: number, at = Date.now()): DemoState {
  adminOnly(actor);
  const ticket = access(state, actor, id);
  if (ticket.status === "resolved") throw new Error("Сначала откройте обращение снова.");
  if (ticket.assignee && ticket.assignee !== actor.id) throw new Error("Обращение уже назначено другому оператору.");
  if (ticket.assignee === actor.id) return state;
  return replace(state, append({ ...ticket, assignee: actor.id, status: "in-progress" }, "system", "Демо-оператор взял обращение в работу.", at));
}
export function setTicketStatus(state: DemoState, actor: Actor, id: number, status: Status, at = Date.now()): DemoState {
  adminOnly(actor);
  const ticket = access(state, actor, id);
  if (!statuses.includes(status)) throw new Error("Неизвестный статус.");
  if (ticket.status === status) return state;
  return replace(state, append({ ...ticket, status }, "system", `Администратор: статус «${statusLabels[status]}».`, at));
}
export function replyToTicket(state: DemoState, actor: Actor, id: number, message: string, at = Date.now()): DemoState {
  const ticket = access(state, actor, id);
  if (ticket.status === "resolved") throw new Error("Сначала откройте обращение снова.");
  const body = text(message, "Сообщение", 1200);
  const status: Status = actor.role === "admin" ? "waiting" : ticket.status === "waiting" ? (ticket.assignee ? "in-progress" : "new") : ticket.status;
  const updated = append({ ...ticket, status }, actor.role, body, at);
  return replace(state, status === ticket.status ? updated : append(updated, "system", `Статус: ${statusLabels[status]}.`, at));
}
export function closeTicket(state: DemoState, actor: Actor, id: number, at = Date.now()): DemoState {
  const ticket = access(state, actor, id);
  if (ticket.status === "resolved") return state;
  return replace(state, append({ ...ticket, status: "resolved" }, "system", `${actor.role === "customer" ? "Клиент" : "Администратор"} закрыл обращение.`, at));
}
export function reopenTicket(state: DemoState, actor: Actor, id: number, at = Date.now()): DemoState {
  const ticket = access(state, actor, id);
  if (ticket.status !== "resolved") throw new Error("Обращение уже открыто.");
  return replace(state, append({ ...ticket, status: ticket.assignee ? "in-progress" : "new" }, "system", `${actor.role === "customer" ? "Клиент" : "Администратор"} открыл обращение снова.`, at));
}

export function restoreDemoState(raw: string | null): DemoState {
  try {
    if (!raw || raw.length > 2000000) return createDemoState();
    const state: unknown = JSON.parse(raw);
    if (!record(state) || state.version !== 1 || !Number.isSafeInteger(state.nextTicketId) || (state.nextTicketId as number) < 2001 || !Array.isArray(state.tickets) || state.tickets.length > MAX_TICKETS) return createDemoState();
    const ids = new Set<number>();
    for (const ticket of state.tickets) {
      if (!record(ticket) || !Number.isSafeInteger(ticket.id) || (ticket.id as number) < 2001 || (ticket.id as number) >= (state.nextTicketId as number) || ids.has(ticket.id as number) || !validText(ticket.customerId, 80) || !topics.includes(ticket.topic as Topic) || !validText(ticket.subject, 80) || !statuses.includes(ticket.status as string) || !(ticket.assignee === null || validText(ticket.assignee, 80)) || !validTime(ticket.createdAt) || !validTime(ticket.updatedAt) || ticket.updatedAt < ticket.createdAt || !Array.isArray(ticket.history) || ticket.history.length < 2 || ticket.history.length > MAX_EVENTS) return createDemoState();
      let previous = ticket.createdAt;
      for (const [index, event] of ticket.history.entries()) {
        if (!record(event) || event.id !== index + 1 || !["customer", "admin", "system"].includes(event.author as string) || !validText(event.text, 1200) || !validTime(event.at) || event.at < previous || event.at > ticket.updatedAt) return createDemoState();
        previous = event.at;
      }
      if (previous !== ticket.updatedAt) return createDemoState();
      ids.add(ticket.id as number);
    }
    return state as unknown as DemoState;
  } catch { return createDemoState(); }
}
