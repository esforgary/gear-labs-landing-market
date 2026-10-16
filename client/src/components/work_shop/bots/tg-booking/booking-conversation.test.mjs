import test from "node:test";
import assert from "node:assert/strict";
import { createBookingSession, refreshBookingSession, submitBookingTurn } from "./booking-conversation.ts";
import { availabilityStatus, createDemoState, daysFromToday } from "./booking-model.ts";

const now = new Date("2030-05-06T08:00:00");
const [, tomorrow] = daysFromToday(now);
const fresh = () => createBookingSession(createDemoState(now), now);
const say = (session, text, role = "customer") => submitBookingTurn(session, role, { text }, now);
const click = (session, value, role = "customer") => submitBookingTurn(session, role, { messageId: session.chats[role].activeId, value }, now);
const last = (session, role = "customer") => session.chats[role].messages.at(-1);
function request(session = fresh()) {
  for (const text of ["/book", "Стрижка и укладка", "Анна", "7.5", "09:00", "Тестовый клиент", "@demo_test", "Отправить заявку"]) session = say(session, text);
  return session;
}

test("the entire booking can be completed by ordinary messages and produces outgoing commands", () => {
  const session = request();
  assert.equal(session.data.bookings.length, 4);
  const booking = session.data.bookings.at(-1);
  assert.equal(booking.name, "Тестовый клиент");
  assert.equal(booking.contact, "@demo_test");
  assert.equal(booking.date, tomorrow);
  assert.equal(booking.time, "09:00");
  assert.equal(booking.status, "requested");
  assert.equal(session.chats.customer.flow.step, "detail");
  assert.equal(session.chats.customer.messages[1].text, "/book");
  assert.equal(session.chats.customer.messages[1].user, true);
  assert.match(last(session).text, /Заявка отправлена/);
  assert.match(last(session, "admin").text, /Поступила новая заявка/);
});

test("inline commands echo commands, callbacks echo choices, and old keyboards are inert", () => {
  const initial = fresh(), oldId = initial.chats.customer.activeId;
  let session = click(initial, "command:/book");
  assert.equal(session.chats.customer.messages.at(-2).text, "/book");
  const stale = submitBookingTurn(session, "customer", { messageId: oldId, value: "command:/book" }, now);
  assert.equal(stale, session);
  session = click(session, "service:cut");
  assert.equal(session.chats.customer.messages.at(-2).text, "Стрижка и укладка");
  assert.equal(session.chats.customer.flow.step, "staff");
  assert.equal(submitBookingTurn(session, "customer", { messageId: session.chats.customer.activeId, value: "save" }, now), session);
});

test("admin confirmation is delivered into the customer chat and rescheduling requires confirmation again", () => {
  let session = request();
  session = click(session, "status:confirmed", "admin");
  assert.equal(session.data.bookings.at(-1).status, "confirmed");
  assert.match(last(session).text, /Обновление записи №1004: подтверждена/);
  session = click(session, "move");
  session = say(session, "7.5");
  session = say(session, "11:00");
  assert.equal(session.chats.customer.flow.step, "confirm");
  session = click(session, "save");
  assert.equal(session.data.bookings.at(-1).time, "11:00");
  assert.equal(session.data.bookings.at(-1).status, "requested");
  assert.match(last(session, "admin").text, /Клиент перенёс запись/);
  assert.equal(availabilityStatus(session.data, "anna", tomorrow, "09:00", now), "open");
});

test("cancellation asks for confirmation while /cancel only abandons the dialog", () => {
  let session = request();
  const data = session.data;
  session = click(session, "cancel-booking");
  assert.equal(session.chats.customer.flow.step, "cancel");
  assert.equal(session.data, data);
  session = say(session, "/cancel");
  assert.equal(session.data, data);
  assert.equal(session.chats.customer.flow.step, "menu");
  session = say(session, "/booking 1004");
  session = click(session, "cancel-booking");
  session = click(session, "cancel-yes");
  assert.equal(session.data.bookings.at(-1).status, "cancelled");
  assert.match(last(session, "admin").text, /отменена/);
});

test("availability is conversational, guarded by role, and rejects occupied intervals", () => {
  let session = say(fresh(), "/slots");
  assert.equal(session.chats.customer.flow.step, "menu");
  session = say(session, "/slots", "admin");
  session = click(session, "schedule-staff:anna", "admin");
  session = say(session, "7.5", "admin");
  session = say(session, "14:00", "admin");
  assert.equal(availabilityStatus(session.data, "anna", tomorrow, "14:00", now), "closed");
  session = say(session, "14:00", "admin");
  assert.equal(availabilityStatus(session.data, "anna", tomorrow, "14:00", now), "open");
  const before = session.data;
  session = say(session, "10:00", "admin");
  assert.equal(session.data, before);
  assert.equal(last(session, "admin").error, true);
});

test("invalid typed input retains the current question and cannot submit or reserve unavailable time", () => {
  let session = say(fresh(), "/book");
  session = click(session, "service:cut");
  session = click(session, "staff:anna");
  session = say(session, "7.5");
  const before = session.data;
  session = say(session, "10:00");
  assert.equal(session.chats.customer.flow.step, "time");
  assert.equal(session.data, before);
  assert.match(last(session).text, /занято/);
  session = say(session, "09:00");
  session = say(session, "X".repeat(61));
  assert.equal(session.chats.customer.flow.step, "name");
  assert.equal(last(session).error, true);
  session = say(session, "/help");
  assert.equal(session.chats.customer.flow.step, "name");
  session = say(session, "/back");
  assert.equal(session.chats.customer.flow.step, "time");
});

test("role conversations remain separate and customer cannot open guest bookings or administer visits", () => {
  let session = say(fresh(), "/book");
  const customer = session.chats.customer;
  session = say(session, "/slots", "admin");
  assert.equal(session.chats.customer, customer);
  session = say(session, "/booking 1002");
  assert.equal(session.chats.customer.flow.step, "service");
  assert.match(last(session).text, /Запись не найдена/);
  session = say(session, "/booking 1003", "admin");
  session = click(session, "status:completed", "admin");
  assert.equal(session.data.bookings.find(item => item.id === 1003).status, "completed");
});

test("booking filters are functional and external data refresh invalidates stale choice context", () => {
  let session = say(fresh(), "/bookings", "admin");
  session = click(session, "filter:requested", "admin");
  const bookingChoices = last(session, "admin").choices.filter(item => item.value.startsWith("booking:"));
  assert.deepEqual(bookingChoices.map(item => item.value), ["booking:1002"]);
  const oldId = session.chats.admin.activeId;
  session = refreshBookingSession(session, createDemoState(now), now);
  assert.equal(session.chats.admin.flow.step, "menu");
  assert.equal(submitBookingTurn(session, "admin", { messageId: oldId, value: "booking:1002" }, now), session);
});
