export const STORAGE_KEY = "gearlabs:tg-booking:demo:v1";
export const SERVICES = [
  { id: "cut", name: "Стрижка и укладка", description: "Форма, которая подходит именно вам", minutes: 60, price: 2400, icon: "✂", color: "peach" },
  { id: "style", name: "Экспресс-укладка", description: "Лёгкий образ для особенного дня", minutes: 30, price: 1400, icon: "✧", color: "lilac" },
  { id: "care", name: "Уход и восстановление", description: "Бережный ритуал для ваших волос", minutes: 90, price: 3600, icon: "❋", color: "mint" },
] as const;
export const STAFF = [
  { id: "anna", name: "Анна", role: "Стилист · 6 лет опыта", initials: "А", services: ["cut", "style", "care"] },
  { id: "maria", name: "Мария", role: "Стилист · 4 года опыта", initials: "М", services: ["cut", "style"] },
] as const;
export type Status = "requested" | "confirmed" | "completed" | "cancelled";
export const statusLabels: Record<Status, string> = { requested: "Ждёт подтверждения", confirmed: "Подтверждена", completed: "Завершена", cancelled: "Отменена" };
export type Booking = { id: number; serviceId: string; staffId: string; date: string; time: string; customerId: "demo" | "guest"; name: string; contact: string; status: Status };
export type BookingDraft = Pick<Booking, "serviceId" | "staffId" | "date" | "time" | "name" | "contact">;
export type DemoState = { version: 1; bookings: Booking[]; closedSlots: string[]; nextId: number };
export const TIMES = Array.from({ length: 18 }, (_, index) => `${String(9 + Math.floor(index / 2)).padStart(2, "0")}:${index % 2 ? "30" : "00"}`);
const DAY_COUNT = 14;
export function dateKey(date: Date): string { return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`; }
export function daysFromToday(now = new Date()): string[] { return Array.from({ length: DAY_COUNT }, (_, offset) => { const date = new Date(now); date.setDate(date.getDate() + offset); return dateKey(date); }); }
export function at(date: string, time: string): number { return new Date(`${date}T${time}:00`).getTime(); }
export function endsAt(booking: Booking): number { return at(booking.date, booking.time) + SERVICES.find(service => service.id === booking.serviceId)!.minutes * 60000; }
export function isActive(booking: Booking): boolean { return booking.status === "requested" || booking.status === "confirmed"; }
export function slotKey(staffId: string, date: string, time: string): string { return `${staffId}|${date}|${time}`; }
function validDate(date: unknown): date is string { return typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(at(date, "12:00")) && dateKey(new Date(at(date, "12:00"))) === date; }
function overlaps(start: number, end: number, booking: Booking): boolean { return start < endsAt(booking) && end > at(booking.date, booking.time); }
function error(message: string): never { throw new Error(message); }

export function slotProblem(state: DemoState, draft: Pick<BookingDraft, "serviceId" | "staffId" | "date" | "time">, now = new Date(), ignoreId?: number): string | null {
  const service = SERVICES.find(item => item.id === draft.serviceId);
  const staff = STAFF.find(item => item.id === draft.staffId);
  if (!service || !staff || !(staff.services as readonly string[]).includes(draft.serviceId)) return "Выберите услугу и подходящего специалиста.";
  if (!validDate(draft.date) || !daysFromToday(now).includes(draft.date) || !TIMES.includes(draft.time)) return "Выберите время в ближайшие 14 дней.";
  const start = at(draft.date, draft.time), end = start + service.minutes * 60000;
  if (start <= now.getTime()) return "Это время уже прошло.";
  if (end > at(draft.date, "18:00")) return "Услуга должна закончиться до 18:00.";
  for (let minute = 0; minute < service.minutes; minute += 30) {
    const time = new Date(start + minute * 60000).toTimeString().slice(0, 5);
    if (state.closedSlots.includes(slotKey(draft.staffId, draft.date, time))) return "Это время закрыто администратором.";
  }
  if (state.bookings.some(booking => booking.id !== ignoreId && booking.status !== "cancelled" && booking.staffId === draft.staffId && overlaps(start, end, booking))) return "Время уже занято. Выберите другой интервал.";
  if (state.bookings.some(booking => booking.id !== ignoreId && booking.status !== "cancelled" && booking.customerId === "demo" && overlaps(start, end, booking))) return "У вас уже есть запись на это время.";
  return null;
}
export function createBooking(state: DemoState, draft: BookingDraft, now = new Date()): DemoState {
  const problem = slotProblem(state, draft, now); if (problem) error(problem);
  if (!draft.name.trim() || draft.name.trim().length > 60 || !draft.contact.trim() || draft.contact.trim().length > 80) error("Укажите имя и контакт: до 60 и 80 символов соответственно.");
  if (state.bookings.length >= 300) error("Демо заполнено. Сбросьте данные, чтобы начать заново.");
  const booking: Booking = { ...draft, name: draft.name.trim(), contact: draft.contact.trim(), id: state.nextId, customerId: "demo", status: "requested" };
  return { ...state, bookings: [...state.bookings, booking], nextId: state.nextId + 1 };
}
export function rescheduleBooking(state: DemoState, id: number, date: string, time: string, now = new Date()): DemoState {
  const booking = state.bookings.find(item => item.id === id);
  if (!booking || booking.customerId !== "demo" || !isActive(booking) || at(booking.date, booking.time) <= now.getTime()) error("Эту запись уже нельзя перенести.");
  if (date === booking.date && time === booking.time) error("Выберите другое время для переноса.");
  const problem = slotProblem(state, { ...booking, date, time }, now, id); if (problem) error(problem);
  return { ...state, bookings: state.bookings.map(item => item.id === id ? { ...item, date, time, status: "requested" } : item) };
}
export function changeStatus(state: DemoState, id: number, status: Status, role: "customer" | "admin", now = new Date()): DemoState {
  const booking = state.bookings.find(item => item.id === id);
  if (!booking || !isActive(booking)) error("Эта запись уже закрыта.");
  if (role === "customer" && (status !== "cancelled" || booking.customerId !== "demo" || at(booking.date, booking.time) <= now.getTime())) error("Эту запись нельзя изменить в режиме клиента.");
  if (status === "confirmed" && (role !== "admin" || booking.status !== "requested" || at(booking.date, booking.time) <= now.getTime())) error("Подтвердить можно только предстоящую заявку.");
  if (status === "completed" && (role !== "admin" || booking.status !== "confirmed" || endsAt(booking) > now.getTime())) error("Завершить можно подтверждённую запись после окончания услуги.");
  if (!["confirmed", "completed", "cancelled"].includes(status)) error("Недопустимый переход статуса.");
  return { ...state, bookings: state.bookings.map(item => item.id === id ? { ...item, status } : item) };
}
export function availabilityStatus(state: DemoState, staffId: string, date: string, time: string, now = new Date()): "past" | "busy" | "closed" | "open" {
  const start = at(date, time);
  if (start <= now.getTime()) return "past";
  if (state.bookings.some(booking => booking.staffId === staffId && booking.status !== "cancelled" && overlaps(start, start + 30 * 60000, booking))) return "busy";
  return state.closedSlots.includes(slotKey(staffId, date, time)) ? "closed" : "open";
}
export function toggleSlot(state: DemoState, staffId: string, date: string, time: string, now = new Date()): DemoState {
  if (!STAFF.some(item => item.id === staffId) || !daysFromToday(now).includes(date) || !TIMES.includes(time)) error("Неизвестный интервал.");
  const status = availabilityStatus(state, staffId, date, time, now);
  if (status === "past" || status === "busy") error("Прошедшее или занятое время нельзя закрыть.");
  const key = slotKey(staffId, date, time);
  return { ...state, closedSlots: status === "closed" ? state.closedSlots.filter(item => item !== key) : [...state.closedSlots, key] };
}
export function createDemoState(now = new Date()): DemoState {
  const dates = daysFromToday(now), yesterday = new Date(now); yesterday.setDate(yesterday.getDate() - 1);
  return { version: 1, nextId: 1004, closedSlots: [slotKey("anna", dates[1], "13:00"), slotKey("anna", dates[1], "13:30")], bookings: [
    { id: 1001, serviceId: "cut", staffId: "anna", date: dates[1], time: "10:00", customerId: "demo", name: "Александра · демо", contact: "@demo_client", status: "confirmed" },
    { id: 1002, serviceId: "care", staffId: "anna", date: dates[2], time: "12:00", customerId: "guest", name: "Михаил · демо", contact: "@demo_guest", status: "requested" },
    { id: 1003, serviceId: "style", staffId: "maria", date: dateKey(yesterday), time: "11:00", customerId: "demo", name: "Александра · демо", contact: "@demo_client", status: "confirmed" },
  ] };
}

// Validate the complete payload before accepting it. Corrupt snapshots never partially restore.
export function restoreDemoState(raw: string | null, now = new Date()): { state: DemoState; recovered: boolean } {
  const fallback = (recovered: boolean) => ({ state: createDemoState(now), recovered });
  if (!raw) return fallback(false);
  try {
    if (raw.length > 250000) return fallback(true);
    const value = JSON.parse(raw) as DemoState;
    if (!value || value.version !== 1 || !Array.isArray(value.bookings) || value.bookings.length > 300 || !Array.isArray(value.closedSlots) || value.closedSlots.length > 1500 || !Number.isSafeInteger(value.nextId) || value.nextId < 1001) return fallback(true);
    const ids = new Set<number>();
    for (const booking of value.bookings) {
      const service = SERVICES.find(item => item.id === booking?.serviceId), staff = STAFF.find(item => item.id === booking?.staffId);
      if (!booking || !service || !staff || !(staff.services as readonly string[]).includes(booking.serviceId) || !Number.isSafeInteger(booking.id) || booking.id < 1001 || booking.id >= value.nextId || ids.has(booking.id) || !validDate(booking.date) || !TIMES.includes(booking.time) || endsAt(booking) > at(booking.date, "18:00") || !["demo", "guest"].includes(booking.customerId) || typeof booking.name !== "string" || !booking.name.trim() || booking.name.length > 60 || typeof booking.contact !== "string" || !booking.contact.trim() || booking.contact.length > 80 || !Object.hasOwn(statusLabels, booking.status)) return fallback(true);
      ids.add(booking.id);
    }
    for (const booking of value.bookings) {
      if (booking.status !== "cancelled" && value.bookings.some(other => other.id !== booking.id && other.status !== "cancelled" && (other.staffId === booking.staffId || other.customerId === "demo" && booking.customerId === "demo") && overlaps(at(booking.date, booking.time), endsAt(booking), other))) return fallback(true);
    }
    if (new Set(value.closedSlots).size !== value.closedSlots.length) return fallback(true);
    for (const key of value.closedSlots) {
      if (typeof key !== "string") return fallback(true);
      const parts = key.split("|");
      if (parts.length !== 3 || !STAFF.some(item => item.id === parts[0]) || !validDate(parts[1]) || !TIMES.includes(parts[2])) return fallback(true);
      if (value.bookings.some(booking => booking.status !== "cancelled" && booking.staffId === parts[0] && overlaps(at(parts[1], parts[2]), at(parts[1], parts[2]) + 30 * 60000, booking))) return fallback(true);
    }
    return { state: { version: 1, bookings: value.bookings.map(({ id, serviceId, staffId, date, time, customerId, name, contact, status }) => ({ id, serviceId, staffId, date, time, customerId, name, contact, status })), closedSlots: [...value.closedSlots], nextId: value.nextId }, recovered: false };
  } catch { return fallback(true); }
}
