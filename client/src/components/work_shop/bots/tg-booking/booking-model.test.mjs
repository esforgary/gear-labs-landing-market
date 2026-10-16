import test from "node:test";
import assert from "node:assert/strict";
import { availabilityStatus, changeStatus, createBooking, createDemoState, daysFromToday, rescheduleBooking, restoreDemoState, slotKey, slotProblem, toggleSlot } from "./booking-model.ts";

const now = new Date("2030-05-06T08:00:00");
const [today, tomorrow] = daysFromToday(now);
const draft = (changes = {}) => ({ serviceId: "cut", staffId: "anna", date: today, time: "12:00", name: "Демо-клиент", contact: "@test_demo", ...changes });
const empty = () => ({ ...createDemoState(now), bookings: [], closedSlots: [] });

test("full service duration reserves every overlapping interval; adjacent visits remain possible", () => {
  const state = createBooking(empty(), draft({ serviceId: "care" }), now);
  assert.throws(() => createBooking(state, draft({ serviceId: "style", time: "13:00" }), now), /занято/);
  assert.throws(() => createBooking(state, draft({ time: "11:30" }), now), /занято/);
  assert.equal(slotProblem(state, draft({ time: "13:30" }), now), null);
  assert.equal(availabilityStatus(state, "anna", today, "13:00", now), "busy");
});

test("a client cannot double-book two different specialists", () => {
  const state = createBooking(empty(), draft(), now);
  assert.throws(() => createBooking(state, draft({ staffId: "maria" }), now), /У вас уже есть запись/);
});

test("reschedule is atomic, releases old time, and requests confirmation again", () => {
  const initial = createDemoState(now);
  const moved = rescheduleBooking(initial, 1001, tomorrow, "15:00", now);
  assert.equal(moved.bookings.find(item => item.id === 1001).status, "requested");
  assert.equal(availabilityStatus(moved, "anna", tomorrow, "10:00", now), "open");
  assert.equal(availabilityStatus(moved, "anna", tomorrow, "15:30", now), "busy");
  assert.equal(initial.bookings.find(item => item.id === 1001).time, "10:00");
  assert.throws(() => rescheduleBooking(initial, 1001, tomorrow, "13:00", now), /закрыто/);
  assert.throws(() => rescheduleBooking(initial, 1001, tomorrow, "10:00", now), /другое время/);
  assert.equal(initial.bookings.find(item => item.id === 1001).time, "10:00");
});

test("cancellation frees the complete service interval and terminal statuses cannot reopen", () => {
  const state = createBooking(empty(), draft({ serviceId: "care" }), now);
  const cancelled = changeStatus(state, 1004, "cancelled", "customer", now);
  assert.equal(availabilityStatus(cancelled, "anna", today, "13:00", now), "open");
  assert.doesNotThrow(() => createBooking(cancelled, draft(), now));
  assert.throws(() => changeStatus(cancelled, 1004, "confirmed", "admin", now), /закрыта/);
  assert.throws(() => rescheduleBooking(cancelled, 1004, tomorrow, "14:00", now), /нельзя перенести/);
});

test("admin closes and reopens 30-minute slots without modifying active bookings", () => {
  const state = toggleSlot(empty(), "anna", today, "12:30", now);
  assert.equal(availabilityStatus(state, "anna", today, "12:30", now), "closed");
  assert.throws(() => createBooking(state, draft(), now), /закрыто/);
  const reopened = toggleSlot(state, "anna", today, "12:30", now);
  assert.equal(slotProblem(reopened, draft(), now), null);
  const booked = createBooking(reopened, draft(), now);
  assert.throws(() => toggleSlot(booked, "anna", today, "12:30", now), /занятое/);
});

test("past times, closing time, unsupported staff and dates outside the horizon are rejected", () => {
  const later = new Date("2030-05-06T12:01:00");
  assert.match(slotProblem(empty(), draft(), later), /прошло/);
  assert.throws(() => toggleSlot(empty(), "anna", today, "12:00", later), /Прошедшее/);
  assert.match(slotProblem(empty(), draft({ time: "17:30" }), now), /18:00/);
  assert.match(slotProblem(empty(), draft({ serviceId: "care", staffId: "maria" }), now), /подходящего/);
  assert.match(slotProblem(empty(), draft({ date: "2030-06-01" }), now), /14 дней/);
  assert.match(slotProblem(empty(), draft({ date: "2030-02-31" }), now), /14 дней/);
});

test("only admin can confirm; completion requires a confirmed service that has ended", () => {
  const requested = createBooking(empty(), draft(), now);
  assert.throws(() => changeStatus(requested, 1004, "confirmed", "customer", now), /режиме клиента/);
  assert.throws(() => changeStatus(requested, 1004, "completed", "admin", now), /подтверждённую/);
  const confirmed = changeStatus(requested, 1004, "confirmed", "admin", now);
  assert.throws(() => changeStatus(confirmed, 1004, "completed", "admin", now), /после окончания/);
  const completed = changeStatus(confirmed, 1004, "completed", "admin", new Date("2030-05-06T13:01:00"));
  assert.equal(completed.bookings[0].status, "completed");
  assert.throws(() => changeStatus(completed, 1004, "cancelled", "admin", now), /закрыта/);
});

test("customers cannot change guest or past appointments", () => {
  const state = createDemoState(now);
  assert.throws(() => changeStatus(state, 1002, "cancelled", "customer", now), /режиме клиента/);
  assert.throws(() => rescheduleBooking(state, 1002, tomorrow, "15:00", now), /нельзя перенести/);
  assert.throws(() => changeStatus(state, 1003, "cancelled", "customer", now), /режиме клиента/);
  assert.doesNotThrow(() => changeStatus(state, 1003, "completed", "admin", now));
});

test("restore round-trips valid state and retains history when the date advances", () => {
  const state = createDemoState(now);
  const restored = restoreDemoState(JSON.stringify(state), new Date("2030-06-10T08:00:00"));
  assert.deepEqual(restored.state, state);
  assert.equal(restored.recovered, false);
  assert.equal(restoreDemoState(null, now).recovered, false);
});

test("malformed, incompatible, duplicated, or overlapping snapshots safely reset", () => {
  const state = createDemoState(now);
  const mutations = [
    "{broken", JSON.stringify({ ...state, version: 9 }), JSON.stringify({ ...state, nextId: 1001 }),
    JSON.stringify({ ...state, bookings: [state.bookings[0], state.bookings[0]] }),
    JSON.stringify({ ...state, bookings: [{ ...state.bookings[0], date: "2030-02-31" }] }),
    JSON.stringify({ ...state, bookings: [{ ...state.bookings[0], status: "__proto__" }] }),
    JSON.stringify({ ...state, bookings: [state.bookings[0], { ...state.bookings[0], id: 1002, time: "10:30" }] }),
    JSON.stringify({ ...state, closedSlots: [slotKey("anna", tomorrow, "10:30")] }),
    JSON.stringify({ ...state, closedSlots: ["nobody|2030-05-07|09:00"] }),
  ];
  for (const raw of mutations) { const restored = restoreDemoState(raw, now); assert.equal(restored.recovered, true); assert.deepEqual(restored.state, createDemoState(now)); }
});

test("input validation does not mutate state on failure", () => {
  const state = empty();
  assert.throws(() => createBooking(state, draft({ name: "   " }), now), /Укажите имя/);
  assert.throws(() => createBooking(state, draft({ contact: "x".repeat(81) }), now), /Укажите имя/);
  assert.equal(state.bookings.length, 0);
  assert.equal(state.nextId, 1004);
});
