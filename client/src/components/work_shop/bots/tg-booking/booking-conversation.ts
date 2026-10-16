import { SERVICES, STAFF, TIMES, at, availabilityStatus, changeStatus, createBooking, createDemoState, daysFromToday, endsAt, isActive, rescheduleBooking, slotProblem, statusLabels, toggleSlot, type Booking, type BookingDraft, type DemoState, type Status } from "./booking-model.ts";

export type BookingRole = "customer" | "admin";
type Filter = "all" | Status;
type Flow =
  | { step: "menu" }
  | { step: "service" }
  | { step: "staff" | "day" | "time" | "name" | "contact" | "confirm"; draft: BookingDraft; movingId?: number }
  | { step: "bookings"; filter: Filter; page: number }
  | { step: "detail" | "cancel"; id: number }
  | { step: "schedule-staff" }
  | { step: "schedule-day"; staffId: string }
  | { step: "schedule-time"; staffId: string; date: string };
export type ChatChoice = { value: string; label: string; reply?: string; disabled?: boolean; hint?: string };
export type ChatMessage = { id: number; text: string; user?: boolean; choices?: ChatChoice[]; layout?: "days" | "times"; studio?: boolean; error?: boolean };
export type Conversation = { flow: Flow; messages: ChatMessage[]; activeId: number; nextId: number };
export type BookingSession = { data: DemoState; chats: Record<BookingRole, Conversation> };
type Prompt = Omit<ChatMessage, "id" | "user">;
export type ConversationInput = { text: string } | { messageId: number; value: string };
const money = (amount: number) => `${amount.toLocaleString("ru-RU")} ₽`;
export const dayLabel = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString("ru-RU", { weekday: "short", day: "numeric", month: "short" });
const freshDraft = (now: Date): BookingDraft => ({ serviceId: "cut", staffId: "anna", date: daysFromToday(now)[1], time: "", name: "", contact: "" });
const choice = (value: string, label: string, reply?: string): ChatChoice => ({ value, label, reply });
const command = (value: string, label: string) => choice(`command:${value}`, label, value);
const back = choice("back", "‹ Назад", "Назад");
const menu = command("/start", "Главное меню");
const serviceOf = (id: string) => SERVICES.find(item => item.id === id)!;
const staffOf = (id: string) => STAFF.find(item => item.id === id)!;
function bookingFor(data: DemoState, role: BookingRole, id: number): Booking {
  const booking = data.bookings.find(item => item.id === id && (role === "admin" || item.customerId === "demo"));
  if (!booking) throw new Error("Запись не найдена. Откройте актуальный список командой /bookings.");
  return booking;
}
function summary(booking: BookingDraft, id?: number) {
  const service = serviceOf(booking.serviceId);
  return `${id ? `Запись №${id}\n` : ""}${service.name}\n${dayLabel(booking.date)} · ${booking.time}\nМастер: ${staffOf(booking.staffId).name}\n${service.minutes} мин · ${money(service.price)}`;
}
function prompt(data: DemoState, role: BookingRole, flow: Flow, now: Date): Prompt {
  switch (flow.step) {
    case "menu": return {
      text: role === "customer" ? "Привет! Это студия «Тихое утро». 🌿\nПомогу записаться к мастеру. Нажмите «Записаться» или отправьте /book — пройдём всё прямо в переписке." : "Вы в чате администратора студии.\nПроверяйте заявки и управляйте временем мастеров. Все изменения сразу увидит клиент.",
      choices: role === "customer" ? [command("/book", "🌿 Записаться"), command("/bookings", "Мои записи")] : [command("/bookings", "Все заявки"), command("/slots", "Расписание мастеров")],
    };
    case "service": return { text: "На какую услугу вас записать?\nВыберите вариант ниже или напишите название.", choices: [...SERVICES.map(item => choice(`service:${item.id}`, `${item.name}\n${money(item.price)} · ${item.minutes} мин`, item.name)), menu] };
    case "staff": return { text: `${serviceOf(flow.draft.serviceId).name} — отличный выбор.\nК какому мастеру хотите записаться?`, choices: [...STAFF.filter(item => (item.services as readonly string[]).includes(flow.draft.serviceId)).map(item => choice(`staff:${item.id}`, `${item.name} · ${item.role}`, item.name)), back] };
    case "day": return { text: `${flow.movingId ? "Выберите новую дату визита." : `Мастер — ${staffOf(flow.draft.staffId).name}. На какой день вас записать?`}\nМожно выбрать дату или написать её в формате ДД.ММ.`, layout: "days", choices: [...daysFromToday(now).map(date => choice(`day:${date}`, dayLabel(date))), back] };
    case "time": {
      const current = flow.movingId ? data.bookings.find(item => item.id === flow.movingId) : undefined;
      const choices = TIMES.map(time => {
        const reason = slotProblem(data, { ...flow.draft, time }, now, flow.movingId) ?? (current?.date === flow.draft.date && current.time === time ? "Текущее время записи" : undefined);
        return { ...choice(`time:${time}`, time), disabled: !!reason, hint: reason ?? "Свободно" };
      });
      return { text: `${dayLabel(flow.draft.date)} · ${staffOf(flow.draft.staffId).name}\n${choices.every(item => item.disabled) ? "Свободного времени на этот день нет. Выберите другую дату." : "Во сколько вам удобно? Серые интервалы уже недоступны."}`, layout: "times", choices: [...choices, back] };
    }
    case "name": return { text: "Как вас зовут?\nНапишите имя в строке сообщения внизу. Для демо используйте вымышленное имя.", choices: [choice("name:Александра · демо", "Использовать демо-имя", "Александра · демо"), back] };
    case "contact": return { text: `Спасибо, ${flow.draft.name}!\nОставьте Telegram или телефон для связи — отправьте его сообщением. В демо можно использовать @demo_client.`, choices: [choice("contact:@demo_client", "Использовать @demo_client", "@demo_client"), back] };
    case "confirm": return { text: `${summary(flow.draft)}\n\n${flow.movingId ? "Подтвердите перенос. Старое время освободится, а мастер снова подтвердит новую дату." : `Клиент: ${flow.draft.name}\nКонтакт: ${flow.draft.contact}\n\nВсё верно? Отправить заявку мастеру?`}`, choices: [choice("save", flow.movingId ? "Подтвердить перенос" : "Отправить заявку"), back, command("/cancel", "Отменить действие")] };
    case "bookings": {
      const items = data.bookings.filter(item => (role === "admin" || item.customerId === "demo") && (flow.filter === "all" || item.status === flow.filter)).sort((a, b) => at(b.date, b.time) - at(a.date, a.time));
      const start = flow.page * 4;
      return { text: `${role === "admin" ? "Заявки студии" : "Ваши записи"} · ${flow.filter === "all" ? "все статусы" : statusLabels[flow.filter].toLowerCase()}\n${items.length ? `Найдено: ${items.length}. Выберите запись для подробностей.` : "Пока нет записей с таким статусом."}`, choices: [
        ...items.slice(start, start + 4).map(item => choice(`booking:${item.id}`, `№${item.id} · ${serviceOf(item.serviceId).name}\n${dayLabel(item.date)} · ${item.time} · ${statusLabels[item.status]}`, `Запись №${item.id}`)),
        ...(start > 0 ? [choice(`page:${flow.page - 1}`, "‹ Предыдущие записи")] : []), ...(start + 4 < items.length ? [choice(`page:${flow.page + 1}`, "Следующие записи ›")] : []),
        choice("filter:all", "Все статусы"), ...Object.entries(statusLabels).map(([value, label]) => choice(`filter:${value}`, label)), menu,
      ] };
    }
    case "detail": {
      const booking = bookingFor(data, role, flow.id), future = at(booking.date, booking.time) > now.getTime();
      return { text: `${summary(booking, booking.id)}\nСтатус: ${statusLabels[booking.status]}\nКлиент: ${booking.name}\nКонтакт: ${booking.contact}${!future && isActive(booking) ? "\n\nВизит уже начался или прошёл. Его статус может обновить администратор." : ""}`, choices: [
        ...(role === "customer" && isActive(booking) && future ? [choice("move", "Перенести запись")] : []),
        ...(role === "admin" && booking.status === "requested" && future ? [choice("status:confirmed", "Подтвердить запись")] : []),
        ...(role === "admin" && booking.status === "confirmed" ? [{ ...choice("status:completed", "Завершить визит"), disabled: endsAt(booking) > now.getTime(), hint: "Доступно после окончания услуги" }] : []),
        ...(isActive(booking) && (role === "admin" || future) ? [choice("cancel-booking", "Отменить запись")] : []), command("/bookings", "К списку записей"), menu,
      ] };
    }
    case "cancel": return { text: `Отменить запись №${flow.id}?\nПосле подтверждения время станет доступно другим клиентам.`, choices: [choice("cancel-yes", "Да, отменить"), choice("cancel-no", "Оставить запись")] };
    case "schedule-staff": return { text: "Чьё расписание хотите изменить?", choices: [...STAFF.map(item => choice(`schedule-staff:${item.id}`, item.name)), menu] };
    case "schedule-day": return { text: `${staffOf(flow.staffId).name} · выберите день.\nТакже можно отправить дату в формате ДД.ММ.`, layout: "days", choices: [...daysFromToday(now).map(date => choice(`schedule-day:${date}`, dayLabel(date))), back] };
    case "schedule-time": return { text: `${staffOf(flow.staffId).name} · ${dayLabel(flow.date)}\nНажмите на свободные 30 минут, чтобы закрыть их. На закрытый интервал — чтобы снова открыть. Занятое время защищено.`, layout: "times", choices: [...TIMES.map(time => {
      const status = availabilityStatus(data, flow.staffId, flow.date, time, now);
      const label = { open: "открыто", closed: "закрыто", busy: "занято", past: "прошло" }[status];
      return { ...choice(`slot:${time}`, `${time}\n${label}`, `${status === "closed" ? "Открыть" : "Закрыть"} ${time}`), disabled: status === "busy" || status === "past" };
    }), back, menu] };
  }
}
function append(chat: Conversation, message: Prompt & { user?: boolean }): Conversation {
  return { ...chat, nextId: chat.nextId + 1, messages: [...chat.messages.slice(-79), { ...message, id: chat.nextId }] };
}
function ask(chat: Conversation, data: DemoState, role: BookingRole, flow: Flow, now: Date, prefix?: string): Conversation {
  const message = prompt(data, role, flow, now);
  const next = append(chat, { ...message, text: prefix ? `${prefix}\n\n${message.text}` : message.text });
  return { ...next, flow, activeId: next.nextId - 1 };
}
export function createConversation(data: DemoState, role: BookingRole, now = new Date()): Conversation {
  const next = ask({ flow: { step: "menu" }, messages: [], activeId: 0, nextId: 1 }, data, role, { step: "menu" }, now);
  return { ...next, messages: next.messages.map(message => ({ ...message, studio: true })) };
}
export function createBookingSession(data = createDemoState(), now = new Date()): BookingSession {
  return { data, chats: { customer: createConversation(data, "customer", now), admin: createConversation(data, "admin", now) } };
}
export function refreshBookingSession(session: BookingSession, data: DemoState, now = new Date()): BookingSession {
  return { data, chats: {
    customer: ask(session.chats.customer, data, "customer", { step: "menu" }, now, "Данные обновились в другой вкладке. Откройте нужное действие заново."),
    admin: ask(session.chats.admin, data, "admin", { step: "menu" }, now, "Данные обновились в другой вкладке. Откройте нужное действие заново."),
  } };
}
function previous(flow: Flow): Flow {
  switch (flow.step) {
    case "staff": return { step: "service" };
    case "day": return flow.movingId ? { step: "detail", id: flow.movingId } : { ...flow, step: "staff" };
    case "time": return { ...flow, step: "day" };
    case "name": return { ...flow, step: "time" };
    case "contact": return { ...flow, step: "name" };
    case "confirm": return { ...flow, step: flow.movingId ? "time" : "contact" };
    case "schedule-day": return { step: "schedule-staff" };
    case "schedule-time": return { step: "schedule-day", staffId: flow.staffId };
    default: return { step: "menu" };
  }
}
function normal(value: string): string { return value.toLocaleLowerCase("ru-RU").replace(/ё/g, "е").trim(); }
function typedChoice(text: string, choices: ChatChoice[], flow: Flow, now: Date): string | undefined {
  const value = normal(text);
  if (flow.step === "name") return `name:${text}`;
  if (flow.step === "contact") return `contact:${text}`;
  if (flow.step === "day" || flow.step === "schedule-day") {
    const date = daysFromToday(now).find(day => day === text || `${Number(day.slice(8))}.${Number(day.slice(5, 7))}` === text.split(".").map(Number).join(".") || normal(dayLabel(day)) === value);
    if (date) return `${flow.step === "day" ? "day" : "schedule-day"}:${date}`;
  }
  if ((flow.step === "time" || flow.step === "schedule-time") && /^\d{1,2}:\d{2}$/.test(value)) return `${flow.step === "time" ? "time" : "slot"}:${value.padStart(5, "0")}`;
  if (flow.step === "bookings" && /^#?\d{4,}$/.test(value)) return `booking:${value.replace("#", "")}`;
  const exact = choices.find(item => normal(item.label) === value || normal(item.reply ?? "") === value);
  if (exact) return exact.value;
  const matches = choices.filter(item => normal(item.reply ?? item.label).includes(value));
  return value.length >= 3 && matches.length === 1 ? matches[0].value : undefined;
}

/** Each turn appends an outgoing message and a bot response. Old inline keyboards cannot mutate data. */
export function submitBookingTurn(session: BookingSession, role: BookingRole, input: ConversationInput, now = new Date()): BookingSession {
  const current = session.chats[role];
  const active = current.messages.find(message => message.id === current.activeId);
  if ("messageId" in input && (input.messageId !== current.activeId || !active?.choices?.some(item => item.value === input.value && !item.disabled))) return session;
  const picked = "messageId" in input ? active?.choices?.find(item => item.value === input.value) : undefined;
  const text = "text" in input ? input.text.trim() : picked?.reply ?? picked?.label ?? "";
  if (!text || text.length > 200) return session;
  let chat = append(current, { text, user: true });
  let data = session.data;
  let flow = current.flow;
  let prefix = "";
  let notification: { role: BookingRole; text: string; bookingId: number } | undefined;
  const finish = (): BookingSession => {
    const chats = { ...session.chats, [role]: chat };
    if (notification) chats[notification.role] = ask(chats[notification.role], data, notification.role, { step: "detail", id: notification.bookingId }, now, notification.text);
    return { data, chats };
  };
  try {
    const token = picked?.value ?? (text.startsWith("/") ? `command:${normal(text)}` : typedChoice(text, active?.choices ?? [], flow, now));
    if (token?.startsWith("command:")) {
      const value = token.slice(8);
      if (value === "/start" || value === "/cancel") { flow = { step: "menu" }; if (value === "/cancel") prefix = "Текущее действие отменено. Существующие записи сохранены."; }
      else if (value === "/book" && role === "customer") flow = { step: "service" };
      else if (value === "/bookings") flow = { step: "bookings", filter: "all", page: 0 };
      else if (value === "/slots" && role === "admin") flow = { step: "schedule-staff" };
      else if (value === "/back") flow = previous(flow);
      else if (/^\/booking[ _]\d+$/.test(value)) { const id = Number(value.split(/[ _]/)[1]); bookingFor(data, role, id); flow = { step: "detail", id }; }
      else prefix = `${value === "/help" ? "Доступные команды:" : "Эта команда недоступна. Попробуйте:"}\n${role === "customer" ? "/book — новая запись" : "/slots — расписание мастеров"}\n/bookings — список записей\n/booking 1001 — открыть запись\n/back — предыдущий шаг\n/cancel — отменить текущий диалог\n/start — главное меню\n\nМожно отправлять названия, даты и время обычным сообщением.`;
    } else if (token === "back") flow = previous(flow);
    else if (flow.step === "service" && token?.startsWith("service:")) {
      const serviceId = token.slice(8); if (!SERVICES.some(item => item.id === serviceId)) throw new Error("Выберите услугу из списка.");
      flow = { step: "staff", draft: { ...freshDraft(now), serviceId } };
    } else if (flow.step === "staff" && token?.startsWith("staff:")) {
      const staffId = token.slice(6); if (!STAFF.some(item => item.id === staffId && (item.services as readonly string[]).includes(flow.step === "staff" ? flow.draft.serviceId : ""))) throw new Error("Выберите подходящего мастера.");
      flow = { ...flow, step: "day", draft: { ...flow.draft, staffId, time: "" } };
    } else if (flow.step === "day" && token?.startsWith("day:")) {
      const date = token.slice(4); if (!daysFromToday(now).includes(date)) throw new Error("Выберите дату в ближайшие 14 дней.");
      flow = { ...flow, step: "time", draft: { ...flow.draft, date, time: "" } };
    } else if (flow.step === "time" && token?.startsWith("time:")) {
      const time = token.slice(5), draft = { ...flow.draft, time };
      const problem = slotProblem(data, draft, now, flow.movingId); if (problem) throw new Error(problem);
      const existing = flow.movingId ? bookingFor(data, role, flow.movingId) : undefined;
      if (existing?.date === draft.date && existing.time === time) throw new Error("Выберите другое время для переноса.");
      flow = { ...flow, step: flow.movingId ? "confirm" : "name", draft };
    } else if (flow.step === "name" && token?.startsWith("name:")) {
      const name = token.slice(5).trim(); if (!name || name.length > 60) throw new Error("Напишите имя длиной от 1 до 60 символов.");
      flow = { ...flow, step: "contact", draft: { ...flow.draft, name } };
    } else if (flow.step === "contact" && token?.startsWith("contact:")) {
      const contact = token.slice(8).trim(); if (!contact || contact.length > 80) throw new Error("Напишите Telegram или телефон длиной до 80 символов.");
      flow = { ...flow, step: "confirm", draft: { ...flow.draft, contact } };
    } else if (flow.step === "confirm" && token === "save") {
      const id = flow.movingId ?? data.nextId;
      if (role !== "customer") throw new Error("Запись доступна в режиме клиента.");
      data = flow.movingId ? rescheduleBooking(data, id, flow.draft.date, flow.draft.time, now) : createBooking(data, flow.draft, now);
      prefix = flow.movingId ? "Время изменено! Ждём повторного подтверждения мастера." : "Заявка отправлена! Мастер скоро подтвердит визит. Это локальная демонстрация.";
      notification = { role: "admin", text: flow.movingId ? "Клиент перенёс запись. Нужно подтвердить новое время." : "Поступила новая заявка от клиента.", bookingId: id };
      flow = { step: "detail", id };
    } else if (flow.step === "bookings" && token?.startsWith("booking:")) { const id = Number(token.slice(8)); bookingFor(data, role, id); flow = { step: "detail", id }; }
    else if (flow.step === "bookings" && token?.startsWith("filter:")) { const filter = token.slice(7); if (filter !== "all" && !Object.hasOwn(statusLabels, filter)) throw new Error("Неизвестный статус."); flow = { ...flow, filter: filter as Filter, page: 0 }; }
    else if (flow.step === "bookings" && token?.startsWith("page:")) flow = { ...flow, page: Math.max(0, Number(token.slice(5)) || 0) };
    else if (flow.step === "detail" && token === "move") {
      const booking = bookingFor(data, role, flow.id);
      if (role !== "customer" || !isActive(booking) || at(booking.date, booking.time) <= now.getTime()) throw new Error("Эту запись уже нельзя перенести.");
      flow = { step: "day", movingId: booking.id, draft: { ...booking, time: "" } };
    } else if (flow.step === "detail" && token === "cancel-booking") { bookingFor(data, role, flow.id); flow = { step: "cancel", id: flow.id }; }
    else if (flow.step === "cancel" && token === "cancel-no") flow = { step: "detail", id: flow.id };
    else if (flow.step === "detail" && token?.startsWith("status:") || flow.step === "cancel" && token === "cancel-yes") {
      if (flow.step !== "detail" && flow.step !== "cancel") throw new Error("Сначала откройте запись.");
      const booking = bookingFor(data, role, flow.id), next = token === "cancel-yes" ? "cancelled" : token!.slice(7) as Status;
      data = changeStatus(data, booking.id, next, role, now);
      prefix = next === "cancelled" ? "Запись отменена. Время снова свободно." : `Готово! ${statusLabels[next]}.`;
      if (booking.customerId === "demo") notification = { role: role === "admin" ? "customer" : "admin", text: `Обновление записи №${booking.id}: ${statusLabels[next].toLowerCase()}.`, bookingId: booking.id };
      flow = { step: "detail", id: booking.id };
    } else if (role === "admin" && flow.step === "schedule-staff" && token?.startsWith("schedule-staff:")) {
      const staffId = token.slice(15); if (!STAFF.some(item => item.id === staffId)) throw new Error("Выберите мастера из списка.");
      flow = { step: "schedule-day", staffId };
    } else if (role === "admin" && flow.step === "schedule-day" && token?.startsWith("schedule-day:")) {
      const date = token.slice(13); if (!daysFromToday(now).includes(date)) throw new Error("Выберите дату в ближайшие 14 дней.");
      flow = { ...flow, step: "schedule-time", date };
    } else if (role === "admin" && flow.step === "schedule-time" && token?.startsWith("slot:")) {
      const time = token.slice(5), wasClosed = availabilityStatus(data, flow.staffId, flow.date, time, now) === "closed";
      data = toggleSlot(data, flow.staffId, flow.date, time, now);
      prefix = `${time}: ${wasClosed ? "время открыто" : "интервал закрыт"}.`;
    } else throw new Error("Не удалось распознать ответ. Выберите вариант под последним сообщением бота или отправьте /help.");
    chat = ask(chat, data, role, flow, now, prefix);
  } catch (cause) {
    const error = cause instanceof Error ? cause.message : "Не удалось выполнить действие. Попробуйте ещё раз.";
    try { chat = ask(chat, data, role, current.flow, now, error); }
    catch { chat = ask(chat, data, role, { step: "menu" }, now, error); }
    chat = { ...chat, messages: chat.messages.map(message => message.id === chat.activeId ? { ...message, error: true } : message) };
  }
  return finish();
}
