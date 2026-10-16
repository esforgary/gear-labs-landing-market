import assert from 'node:assert/strict';
import test from 'node:test';
import { adminActor, customerActor, createDemoState, restoreDemoState, visibleTickets, createTicket, claimTicket, setTicketStatus, replyToTicket, closeTicket, reopenTicket } from './support-model.ts';

const at = Date.UTC(2026, 1, 1, 10);
const draft = { topic: 'Оплата', subject: '  Проверить оплату  ', message: '  Нужна помощь с демо-заказом.  ' };
const other = { role: 'customer', id: 'demo-customer-2' };
const find = (state, id = 2003) => state.tickets.find(ticket => ticket.id === id);
function frozen(value) { Object.freeze(value); for (const child of Object.values(value)) if (child && typeof child === 'object') frozen(child); return value; }

test('customer creates a normalized ticket without mutating frozen state', () => {
  const initial = frozen(createDemoState());
  const next = createTicket(initial, customerActor, draft, at);
  assert.equal(initial.tickets.length, 2);
  assert.equal(next.nextTicketId, 2004);
  assert.equal(find(next).subject, 'Проверить оплату');
  assert.equal(find(next).history[1].text, 'Нужна помощь с демо-заказом.');
  assert.equal(find(next).status, 'new');
  assert.equal(find(next).customerId, customerActor.id);
  assert.deepEqual(visibleTickets(next, customerActor).map(ticket => ticket.id), [2003, 2001]);
  assert.equal(visibleTickets(next, adminActor).length, 3);
  assert.deepEqual(visibleTickets(next, other).map(ticket => ticket.id), [2002]);
});

test('claim, admin reply, customer reply, close and reopen preserve shared history', () => {
  let state = createTicket(createDemoState(), customerActor, draft, at);
  state = claimTicket(frozen(state), adminActor, 2003, at + 1);
  assert.equal(find(state).status, 'in-progress');
  assert.equal(find(state).assignee, adminActor.id);
  state = replyToTicket(frozen(state), adminActor, 2003, 'Уточните номер демо-заказа.', at + 2);
  assert.equal(find(state).status, 'waiting');
  assert.ok(visibleTickets(state, customerActor)[0].history.some(event => event.author === 'admin' && event.text === 'Уточните номер демо-заказа.'));
  state = replyToTicket(frozen(state), customerActor, 2003, 'Номер 42.', at + 3);
  assert.equal(find(state).status, 'in-progress');
  assert.ok(visibleTickets(state, adminActor)[0].history.some(event => event.author === 'customer' && event.text === 'Номер 42.'));
  const historyLength = find(state).history.length;
  state = closeTicket(frozen(state), customerActor, 2003, at + 4);
  assert.equal(find(state).status, 'resolved');
  assert.throws(() => replyToTicket(state, adminActor, 2003, 'Ответ', at + 5), /откройте/);
  assert.throws(() => replyToTicket(state, customerActor, 2003, 'Ответ', at + 5), /откройте/);
  assert.throws(() => claimTicket(state, adminActor, 2003, at + 5), /откройте/);
  state = reopenTicket(frozen(state), customerActor, 2003, at + 5);
  assert.equal(find(state).status, 'in-progress');
  assert.equal(find(state).history.length, historyLength + 2);
  assert.deepEqual(find(state).history.map(event => event.id), Array.from({ length: find(state).history.length }, (_, index) => index + 1));
});

test('admin can set every status and reopen; unassigned tickets reopen as new', () => {
  let state = createDemoState();
  for (const status of ['in-progress', 'waiting', 'resolved', 'new']) {
    state = setTicketStatus(frozen(state), adminActor, 2001, status, at);
    assert.equal(find(state, 2001).status, status);
  }
  state = closeTicket(state, adminActor, 2001, at);
  assert.strictEqual(closeTicket(state, adminActor, 2001, at), state);
  state = reopenTicket(state, adminActor, 2001, at);
  assert.equal(find(state, 2001).status, 'new');
  assert.throws(() => reopenTicket(state, customerActor, 2001, at), /уже открыто/);
  state = setTicketStatus(state, adminActor, 2001, 'waiting', at);
  state = replyToTicket(state, customerActor, 2001, 'Уточнение', at);
  assert.equal(find(state, 2001).status, 'new');
});

test('customer cannot access another customer ticket or administrator actions', () => {
  const state = frozen(createDemoState());
  for (const action of [
    () => replyToTicket(state, customerActor, 2002, 'Ответ', at),
    () => closeTicket(state, customerActor, 2002, at),
    () => reopenTicket(state, customerActor, 2002, at),
    () => claimTicket(state, customerActor, 2001, at),
    () => setTicketStatus(state, customerActor, 2001, 'resolved', at),
    () => createTicket(state, adminActor, draft, at),
    () => visibleTickets(state, { role: 'root', id: 'demo' }),
    () => visibleTickets(state, { role: 'customer', id: ' ' }),
  ]) assert.throws(action);
  assert.throws(() => replyToTicket(state, adminActor, 9999, 'Ответ', at), /не найдено/);
  const assigned = claimTicket(state, adminActor, 2001, at);
  assert.strictEqual(claimTicket(assigned, adminActor, 2001, at), assigned);
  assert.throws(() => claimTicket(assigned, { role: 'admin', id: 'another-operator' }, 2001, at), /другому/);
});

test('blank, oversized and invalid drafts or replies fail atomically', () => {
  const state = frozen(createDemoState());
  const before = JSON.stringify(state);
  for (const bad of [{ ...draft, topic: 'Unknown' }, { ...draft, subject: ' ' }, { ...draft, subject: 'a'.repeat(81) }, { ...draft, message: '' }, { ...draft, message: 'a'.repeat(1201) }]) assert.throws(() => createTicket(state, customerActor, bad, at));
  for (const body of [' ', 'a'.repeat(1201), null]) assert.throws(() => replyToTicket(state, customerActor, 2001, body, at));
  assert.throws(() => setTicketStatus(state, adminActor, 2001, 'invalid', at));
  assert.throws(() => createTicket(state, customerActor, draft, NaN));
  assert.throws(() => replyToTicket(state, customerActor, 2001, 'Ответ', 0));
  assert.equal(JSON.stringify(state), before);
});

test('valid persistence restores shared state, including empty ticket queue', () => {
  let state = createTicket(createDemoState(), customerActor, draft, at);
  state = replyToTicket(state, adminActor, 2003, 'Проверим демо-заказ.', at + 1);
  assert.deepEqual(restoreDemoState(JSON.stringify(state)), state);
  const empty = { version: 1, nextTicketId: 2001, tickets: [] };
  assert.deepEqual(restoreDemoState(JSON.stringify(empty)), empty);
});

test('malformed persistence safely resets without partially accepting corrupt tickets', () => {
  const corruptions = [
    state => { state.version = 99; }, state => { state.nextTicketId = 2001; },
    state => { state.tickets[0].status = 'invalid'; }, state => { state.tickets[0].topic = 'invalid'; },
    state => { state.tickets[0].subject = ''; }, state => { state.tickets[0].history = []; },
    state => { state.tickets[0].history[0].author = 'root'; }, state => { state.tickets[0].history[1].id = 7; },
    state => { state.tickets[0].history[0].at = -1; }, state => { state.tickets[0].updatedAt += 1; },
    state => { state.tickets.push(state.tickets[0]); }, state => { state.tickets[0].assignee = 123; },
  ];
  for (const mutate of corruptions) { const state = createDemoState(); mutate(state); assert.deepEqual(restoreDemoState(JSON.stringify(state)), createDemoState()); }
  for (const raw of [null, '', '{bad', 'null', '[]', '{}', 'x'.repeat(2000001)]) assert.deepEqual(restoreDemoState(raw), createDemoState());
});

test('event and ticket limits reject changes without dropping history', () => {
  let state = createDemoState();
  for (let index = 2; index < 300; index++) state = replyToTicket(state, customerActor, 2001, `Сообщение ${index}`, at);
  const before = JSON.stringify(state);
  assert.throws(() => replyToTicket(state, adminActor, 2001, 'Ещё ответ', at), /заполнена/);
  assert.equal(JSON.stringify(state), before);
  state = createDemoState();
  for (let index = 2; index < 100; index++) state = createTicket(state, customerActor, draft, at);
  assert.throws(() => createTicket(state, customerActor, draft, at), /лимит/);
});
