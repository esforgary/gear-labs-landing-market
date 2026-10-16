import assert from 'node:assert/strict';
import test from 'node:test';
import { createDemoState } from './support-model.ts';
import { advanceSupportConversation, createSupportSession, syncSupportSession } from './support-conversation.ts';

const at = Date.UTC(2026, 9, 16, 10);
const last = session => session.entries.at(-1);
const ticket = (state, id) => state.tickets.find(item => item.id === id);
function conversation(role = 'customer', state = createDemoState()) {
  let current = { state, session: createSupportSession(role, at) };
  let time = at;
  return {
    get state() { return current.state; },
    get session() { return current.session; },
    send(input, sourceId) {
      current = advanceSupportConversation(current.state, current.session, role, input, ++time, sourceId);
      return current;
    },
  };
}

test('new-ticket dialogue echoes each choice and creates a ticket only after its details', () => {
  const chat = conversation();
  chat.send('/new', last(chat.session).id);
  assert.equal(chat.session.step, 'topic');
  assert.equal(chat.session.entries.at(-2).text, '/new');
  chat.send('Оплата', last(chat.session).id);
  assert.equal(chat.session.step, 'subject');
  chat.send('Дважды списалась оплата');
  assert.equal(chat.session.step, 'message');
  assert.equal(chat.state.tickets.length, 2);
  chat.send('В демо-заказе № 42 вижу два списания.');
  assert.equal(chat.session.step, 'ticket');
  assert.equal(chat.session.ticketId, 2003);
  assert.deepEqual(chat.session.entries.filter(item => item.from === 'user').map(item => item.text), [
    '/new', 'Оплата', 'Дважды списалась оплата', 'В демо-заказе № 42 вижу два списания.',
  ]);
  assert.equal(ticket(chat.state, 2003).topic, 'Оплата');
  assert.equal(ticket(chat.state, 2003).subject, 'Дважды списалась оплата');
  assert.equal(ticket(chat.state, 2003).history.at(-1).text, 'В демо-заказе № 42 вижу два списания.');
  assert.match(last(chat.session).text, /Напишите сообщение/);
  assert.ok(last(chat.session).choices.some(item => item.value === '/close 2003'));
});

test('a question typed in the initial composer becomes the body without being requested twice', () => {
  const chat = conversation();
  chat.send('Не приходит письмо с подтверждением.');
  assert.equal(chat.session.step, 'topic');
  chat.send('3');
  assert.equal(chat.session.step, 'subject');
  chat.send('Письмо с подтверждением');
  assert.equal(chat.session.step, 'ticket');
  assert.equal(ticket(chat.state, 2003).topic, 'Технический вопрос');
  assert.equal(ticket(chat.state, 2003).history.at(-1).text, 'Не приходит письмо с подтверждением.');
  assert.deepEqual(chat.session.draft, {});
});

test('customer and operator conversations synchronize new replies once with correct speakers', () => {
  let state = createDemoState();
  let customer = advanceSupportConversation(state, createSupportSession('customer', at), 'customer', '/ticket 2001', at).session;
  let admin = advanceSupportConversation(state, createSupportSession('admin', at), 'admin', '/ticket 2001', at).session;
  assert.ok(customer.entries.some(item => item.from === 'user' && item.text.includes('пункт выдачи')));
  assert.ok(admin.entries.some(item => item.from === 'bot' && item.text.startsWith('Сообщение клиента:')));
  ({ state, session: admin } = advanceSupportConversation(state, admin, 'admin', 'Уточните новый пункт выдачи.', at + 1));
  customer = syncSupportSession(state, customer, 'customer', at + 2);
  assert.equal(customer.entries.filter(item => item.text === 'Ответ поддержки:\nУточните новый пункт выдачи.').length, 1);
  assert.strictEqual(syncSupportSession(state, customer, 'customer', at + 3), customer);
  ({ state, session: customer } = advanceSupportConversation(state, customer, 'customer', 'Пункт на Лесной улице.', at + 4));
  admin = syncSupportSession(state, admin, 'admin', at + 5);
  assert.equal(admin.entries.filter(item => item.text === 'Сообщение клиента:\nПункт на Лесной улице.').length, 1);
  assert.equal(customer.entries.filter(item => item.from === 'user' && item.text === 'Пункт на Лесной улице.').length, 1);
  assert.strictEqual(syncSupportSession(state, customer, 'customer', at + 6), customer);
});

test('closing and reopening a conversation gives usable prompts and blocks replies while closed', () => {
  const chat = conversation();
  chat.send('/ticket 2001');
  chat.send('/close 2001', last(chat.session).id);
  assert.equal(ticket(chat.state, 2001).status, 'resolved');
  assert.match(last(chat.session).text, /Переписка закрыта/);
  assert.ok(last(chat.session).choices.some(item => item.value === '/reopen 2001'));
  const closed = chat.state;
  chat.send('Ещё один вопрос');
  assert.strictEqual(chat.state, closed);
  assert.match(last(chat.session).text, /откройте обращение снова/);
  chat.send('/reopen 2001', last(chat.session).id);
  assert.equal(ticket(chat.state, 2001).status, 'new');
  chat.send('Теперь можно ответить.');
  assert.equal(ticket(chat.state, 2001).history.at(-1).text, 'Теперь можно ответить.');
});

test('typed commands cannot bypass role or ticket visibility restrictions', () => {
  const chat = conversation();
  const initial = chat.state;
  for (const input of ['/queue', '/ticket 2002', '/take 2001', '/status 2001', '/status 2001 resolved', '/clarify 2001']) {
    chat.send(input);
    assert.strictEqual(chat.state, initial, input);
    assert.equal(chat.session.entries.at(-2).text, input);
    assert.match(last(chat.session).text, /администратор|не найдено/, input);
  }
  chat.send('/tickets');
  assert.ok(last(chat.session).choices.some(item => item.value === '/ticket 2001'));
  assert.ok(!last(chat.session).choices.some(item => item.value === '/ticket 2002'));
  const operator = conversation('admin');
  const before = operator.state;
  operator.send('/new');
  assert.strictEqual(operator.state, before);
  assert.match(last(operator.session).text, /роли клиента/);
  operator.send('Ответ без выбранного обращения');
  assert.strictEqual(operator.state, before);
  assert.match(last(operator.session).text, /Сначала откройте обращение/);
});

test('old inline keyboards and values absent from the current keyboard are ignored', () => {
  const chat = conversation();
  const menuId = last(chat.session).id;
  chat.send('/new', menuId);
  const topicId = last(chat.session).id;
  const current = chat.session;
  chat.send('/tickets', menuId);
  assert.strictEqual(chat.session, current);
  chat.send('/close 2001', topicId);
  assert.strictEqual(chat.session, current);
  chat.send('Оплата', topicId);
  assert.equal(chat.session.step, 'subject');
  const subject = chat.session;
  chat.send('Технический вопрос', topicId);
  assert.strictEqual(chat.session, subject);
  assert.equal(chat.state.tickets.length, 2);
});

test('invalid subjects keep the current step and cancellation clears only the unfinished draft', () => {
  const chat = conversation();
  const original = chat.state;
  chat.send('/new');
  chat.send('Оплата');
  chat.send('x'.repeat(81));
  assert.equal(chat.session.step, 'subject');
  assert.equal(chat.session.draft.subject, undefined);
  assert.match(last(chat.session).text, /80 символов/);
  assert.strictEqual(chat.state, original);
  chat.send('Короткий заголовок');
  assert.equal(chat.session.step, 'message');
  chat.send('/cancel', last(chat.session).id);
  assert.equal(chat.session.step, 'idle');
  assert.equal(chat.session.ticketId, null);
  assert.deepEqual(chat.session.draft, {});
  assert.strictEqual(chat.state, original);
  assert.ok(last(chat.session).choices.some(item => item.value === '/new'));
});

test('operator commands expose status choices and filter the queue to matching tickets', () => {
  const chat = conversation('admin');
  chat.send('/queue');
  assert.equal(last(chat.session).choices.filter(item => item.value.startsWith('/ticket ')).length, 2);
  chat.send('/ticket 2001', last(chat.session).id);
  chat.send('/take 2001', last(chat.session).id);
  assert.equal(ticket(chat.state, 2001).assignee, 'demo-operator');
  chat.send('/status 2001', last(chat.session).id);
  assert.deepEqual(last(chat.session).choices.map(item => item.value), [
    '/status 2001 new', '/status 2001 in-progress', '/status 2001 waiting', '/status 2001 resolved',
  ]);
  chat.send('/status 2001 waiting', last(chat.session).id);
  chat.send('/queue', last(chat.session).id);
  chat.send('/filter', last(chat.session).id);
  chat.send('/queue waiting', last(chat.session).id);
  assert.deepEqual(last(chat.session).choices.filter(item => item.value.startsWith('/ticket ')).map(item => item.value), ['/ticket 2001']);
  assert.match(last(chat.session).text, /Ждём клиента/);
  chat.send('/queue resolved');
  assert.match(last(chat.session).text, /пока нет/);
  assert.equal(last(chat.session).choices.filter(item => item.value.startsWith('/ticket ')).length, 0);
});

test('synchronization returns to the menu if the selected ticket no longer exists', () => {
  const chat = conversation();
  chat.send('/ticket 2001');
  const empty = { ...chat.state, tickets: [] };
  const session = syncSupportSession(empty, chat.session, 'customer', at + 1);
  assert.equal(session.step, 'idle');
  assert.equal(session.ticketId, null);
  assert.match(last(session).text, /больше недоступно/);
  assert.ok(last(session).choices.some(item => item.value === '/new'));
});
