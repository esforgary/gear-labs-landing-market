export type Role = "member" | "admin";
export type Rsvp = "join" | "maybe" | "decline";
export type Event = { id: number; title: string; description: string; startsAt: number; capacity: number; cancelled: boolean; responses: Record<string, Rsvp>; poll: { options: number[]; votes: Record<string, number> } | null };
export type Message = { id: number; author: "bot" | "member" | "admin" | "lena"; text: string; eventId?: number; at: number };
export type DemoState = { version: 1; nextId: number; events: Event[]; messages: Message[] };
export type EventInput = { title: string; description: string; startsAt: number; capacity: number };
type Result = { state: DemoState; error?: string };
export const STORAGE_KEY = "gearlabs.discord-events.v1";
export const names: Record<string, string> = { member: "Алекс", admin: "Марк", lena: "Лена", nikita: "Никита", sonya: "Соня" };
export const responseLabels: Record<Rsvp, string> = { join: "Пойду", maybe: "Возможно", decline: "Не пойду" };
const people = Object.keys(names);
const hour = 3600000;
export function formatDate(at: number) { return new Date(at).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }
export function createDemoState(now = Date.now()): DemoState {
  const first = new Date(now + 24 * hour); first.setHours(19, 0, 0, 0);
  return { version: 1, nextId: 10, events: [
    { id: 1, title: "Вечер настолок", description: "Собираемся в голосовом канале «Гостиная». Играем в Codenames и знакомимся!", startsAt: +first, capacity: 4, cancelled: false, responses: { lena: "join", nikita: "join", sonya: "maybe" }, poll: null },
    { id: 2, title: "Киновечер: выбираем время", description: "Смотрим фантастику и обсуждаем после титров. Проголосуйте за удобное время ниже.", startsAt: +first + 48 * hour, capacity: 8, cancelled: false, responses: { lena: "join", sonya: "join" }, poll: { options: [+first + 48 * hour, +first + 49 * hour], votes: { lena: 0, sonya: 1 } } },
  ], messages: [
    { id: 3, author: "admin", text: "Всем привет! Здесь планируем встречи клуба. Записывайтесь через кнопки бота 👇", at: now - 15 * 60000 },
    { id: 4, author: "lena", text: "На настолки уже записалась. Алекс, присоединяйся!", at: now - 12 * 60000 },
    { id: 5, author: "bot", text: "Новая встреча в Pixel Club", eventId: 1, at: now - 10 * 60000 },
    { id: 6, author: "bot", text: "Следующая встреча · выберите удобное время", eventId: 2, at: now - 5 * 60000 },
  ] };
}
export function addMessage(state: DemoState, author: Message["author"], text: string, eventId?: number, now = Date.now()): DemoState {
  return { ...state, nextId: state.nextId + 1, messages: [...state.messages, { id: state.nextId, author, text: text.slice(0, 2000), ...(eventId ? { eventId } : {}), at: now }].slice(-100) };
}
export function exchange(state: DemoState, role: Role, input: string, reply: string, eventId?: number): DemoState {
  return addMessage(addMessage(state, role, input), "bot", reply, eventId);
}
const fail = (state: DemoState, error: string): Result => ({ state, error });
const joined = (event: Event) => Object.values(event.responses).filter(value => value === "join").length;
function usable(state: DemoState, id: number, now: number): string | undefined {
  const event = state.events.find(item => item.id === id);
  if (!event) return "Событие не найдено. Используйте /events.";
  if (event.cancelled) return "Событие отменено. Запись и голосование закрыты.";
  if (event.startsAt <= now) return "Событие уже началось. Запись и голосование закрыты.";
}
export function respond(state: DemoState, role: Role, id: number, response: Rsvp, now = Date.now()): Result {
  if (!["member", "admin"].includes(role) || !["join", "maybe", "decline"].includes(response)) return fail(state, "Неверное действие.");
  const error = usable(state, id, now); if (error) return fail(state, error);
  const event = state.events.find(item => item.id === id)!;
  if (response === "join" && event.responses[role] !== "join" && joined(event) >= event.capacity) return fail(state, "Все места заняты. Выберите «Возможно» или дождитесь свободного места.");
  if (event.responses[role] === response) return fail(state, "Этот ответ уже записан.");
  const updated = { ...event, responses: { ...event.responses, [role]: response } };
  const next = { ...state, events: state.events.map(item => item.id === id ? updated : item) };
  return { state: exchange(next, role, `${responseLabels[response]} · #${id}`, `@${names[role]}, ответ «${responseLabels[response]}» сохранён. ${joined(updated)} из ${event.capacity} мест занято.`, id) };
}
export function vote(state: DemoState, role: Role, id: number, option: number, now = Date.now()): Result {
  if (!["member", "admin"].includes(role)) return fail(state, "Неверная роль.");
  const error = usable(state, id, now); if (error) return fail(state, error);
  const event = state.events.find(item => item.id === id)!;
  if (!event.poll || !Number.isInteger(option) || option < 0 || option >= event.poll.options.length) return fail(state, "Вариант голосования не найден.");
  if (event.poll.options[option] <= now) return fail(state, "Это время уже прошло.");
  if (event.poll.votes[role] === option) return fail(state, "Ваш голос уже учтён.");
  const next = { ...state, events: state.events.map(item => item.id === id ? { ...item, poll: { ...event.poll!, votes: { ...event.poll!.votes, [role]: option } } } : item) };
  return { state: exchange(next, role, `Голосую: ${formatDate(event.poll.options[option])} · #${id}`, "Голос сохранён. Можно изменить выбор; запись на встречу выполняется отдельно.", id) };
}
function validateInput(input: EventInput, now: number) {
  if (!input.title.trim() || input.title.trim().length > 80) return "Название: от 1 до 80 символов.";
  if (!input.description.trim() || input.description.trim().length > 500) return "Описание: от 1 до 500 символов.";
  if (!Number.isFinite(input.startsAt) || input.startsAt <= now || input.startsAt > now + 366 * 24 * hour) return "Выберите дату в будущем, в пределах одного года.";
  if (!Number.isInteger(input.capacity) || input.capacity < 1 || input.capacity > 100) return "Количество мест: целое число от 1 до 100.";
}
export function saveEvent(state: DemoState, role: Role, input: EventInput, id?: number, now = Date.now()): Result {
  if (role !== "admin") return fail(state, "Эта команда доступна только администратору.");
  const error = validateInput(input, now); if (error) return fail(state, error);
  const current = id === undefined ? undefined : state.events.find(item => item.id === id);
  if (id !== undefined && !current) return fail(state, "Событие не найдено.");
  if (current?.cancelled) return fail(state, "Отменённое событие нельзя изменить. Создайте новое.");
  if (current && input.capacity < joined(current)) return fail(state, "Лимит не может быть меньше числа записавшихся участников.");
  if (!current && state.events.length >= 30) return fail(state, "В демо можно создать до 30 событий. Для новой сессии сбросьте демо.");
  const event: Event = { ...(current ?? { id: state.nextId, cancelled: false, responses: {}, poll: null }), ...input, title: input.title.trim(), description: input.description.trim() };
  if (current && current.startsAt !== input.startsAt) event.poll = null;
  const next = { ...state, nextId: current ? state.nextId : state.nextId + 1, events: current ? state.events.map(item => item.id === id ? event : item) : [...state.events, event] };
  return { state: exchange(next, role, `${current ? "/edit" : "/create"} ${event.title}`, current ? `Событие #${event.id} обновлено. Участники сохраняют свои ответы.` : "Встреча создана! Запись открыта.", event.id) };
}
export function reschedule(state: DemoState, role: Role, id: number, startsAt: number, now = Date.now()): Result {
  if (role !== "admin") return fail(state, "Эта команда доступна только администратору.");
  const event = state.events.find(item => item.id === id);
  if (!event) return fail(state, "Событие не найдено.");
  if (event.cancelled) return fail(state, "Отменённое событие нельзя перенести.");
  const error = validateInput({ ...event, startsAt }, now); if (error) return fail(state, error);
  const next = { ...state, events: state.events.map(item => item.id === id ? { ...item, startsAt, poll: null } : item) };
  return { state: exchange(next, role, `/reschedule ${id}`, `Встреча перенесена на ${formatDate(startsAt)}. Ответы участников сохранены; голосование за время завершено.`, id) };
}
export function cancelEvent(state: DemoState, role: Role, id: number): Result {
  if (role !== "admin") return fail(state, "Эта команда доступна только администратору.");
  const event = state.events.find(item => item.id === id);
  if (!event) return fail(state, "Событие не найдено.");
  if (event.cancelled) return fail(state, "Событие уже отменено.");
  const next = { ...state, events: state.events.map(item => item.id === id ? { ...item, cancelled: true } : item) };
  return { state: exchange(next, role, `/cancel ${id}`, "Встреча отменена. Запись и голосование закрыты, список ответов сохранён.", id) };
}
export function participants(event: Event) {
  return (["join", "maybe", "decline"] as const).map(status => `${responseLabels[status]}: ${Object.entries(event.responses).filter(([, value]) => value === status).map(([id]) => names[id]).join(", ") || "пока никого"}`).join("\n");
}
const record = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const int = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) > 0;
const timestamp = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v) && v > 0 && v < 8640000000000000;
export function restoreDemoState(raw: string | null, now = Date.now()): { state: DemoState; recovered: boolean } {
  const fallback = (recovered: boolean) => ({ state: createDemoState(now), recovered });
  if (!raw) return fallback(false);
  try {
    if (raw.length > 300000) return fallback(true);
    const s: unknown = JSON.parse(raw);
    if (!record(s) || s.version !== 1 || !int(s.nextId) || !Array.isArray(s.events) || !s.events.length || s.events.length > 30 || !Array.isArray(s.messages) || s.messages.length > 100) return fallback(true);
    const ids = new Set<number>();
    for (const event of s.events) {
      if (!record(event) || !int(event.id) || ids.has(event.id) || typeof event.title !== "string" || !event.title.trim() || event.title.length > 80 || typeof event.description !== "string" || !event.description.trim() || event.description.length > 500 || !timestamp(event.startsAt) || !int(event.capacity) || event.capacity > 100 || typeof event.cancelled !== "boolean" || !record(event.responses)) return fallback(true);
      ids.add(event.id);
      if (Object.entries(event.responses).some(([key, value]) => !people.includes(key) || !["join", "maybe", "decline"].includes(value as string)) || Object.values(event.responses).filter(v => v === "join").length > event.capacity) return fallback(true);
      if (event.poll !== null) {
        const poll = event.poll;
        if (!record(poll) || !Array.isArray(poll.options) || poll.options.length < 2 || poll.options.length > 5 || !poll.options.every(timestamp) || new Set(poll.options).size !== poll.options.length || !record(poll.votes)) return fallback(true);
        const size = poll.options.length;
        if (Object.entries(poll.votes).some(([key, value]) => !people.includes(key) || !Number.isInteger(value) || (value as number) < 0 || (value as number) >= size)) return fallback(true);
      }
    }
    const eventIds = new Set(ids);
    for (const message of s.messages) {
      if (!record(message) || !int(message.id) || ids.has(message.id) || !["member", "admin", "lena", "bot"].includes(message.author as string) || typeof message.text !== "string" || message.text.length > 2000 || !timestamp(message.at) || (message.eventId !== undefined && !eventIds.has(message.eventId as number))) return fallback(true);
      ids.add(message.id);
    }
    if ([...ids].some(id => id >= (s.nextId as number))) return fallback(true);
    return { state: s as DemoState, recovered: false };
  } catch { return fallback(true); }
}
