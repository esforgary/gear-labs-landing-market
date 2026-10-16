import assert from 'node:assert/strict';
import test from 'node:test';
import { addMessage, cancelEvent, createDemoState, participants, reschedule, respond, restoreDemoState, saveEvent, vote } from './events-model.ts';

const now = Date.UTC(2026, 9, 16, 10);
const input = { title: 'Новая встреча', description: 'Обсуждаем проекты', startsAt: now + 86400000, capacity: 6 };
function frozen(value) { Object.freeze(value); for (const item of Object.values(value)) if (item && typeof item === 'object') frozen(item); return value; }
function success(result) { assert.equal(result.error, undefined); return result.state; }
function failure(result, state, pattern) { assert.match(result.error, pattern); assert.strictEqual(result.state, state); }
const event = (state, id = 1) => state.events.find(item => item.id === id);

test('member and administrator RSVPs share state and immutable conversation', () => {
  const initial = frozen(createDemoState(now));
  const first = success(respond(initial, 'member', 1, 'join', now));
  const second = success(respond(frozen(first), 'admin', 1, 'join', now));
  assert.equal(event(initial).responses.member, undefined);
  assert.equal(event(second).responses.member, 'join');
  assert.equal(event(second).responses.admin, 'join');
  assert.equal(second.messages.at(-1).author, 'bot');
  assert.equal(second.messages.at(-2).author, 'admin');
  assert.match(second.messages.at(-1).text, /4 из 4/);
});

test('capacity blocks a new seat; maybe and decline release it', () => {
  let state = createDemoState(now);
  state.events[0].capacity = 3;
  state = success(respond(frozen(state), 'member', 1, 'join', now));
  failure(respond(state, 'admin', 1, 'join', now), state, /места заняты/);
  state = success(respond(frozen(state), 'member', 1, 'maybe', now));
  state = success(respond(frozen(state), 'admin', 1, 'join', now));
  assert.equal(event(state).responses.member, 'maybe');
  state = success(respond(frozen(state), 'admin', 1, 'decline', now));
  state = success(respond(frozen(state), 'member', 1, 'join', now));
  assert.equal(event(state).responses.member, 'join');
});

test('repeating an RSVP cannot inflate capacity or mutate messages', () => {
  const state = frozen(success(respond(createDemoState(now), 'member', 1, 'join', now)));
  failure(respond(state, 'member', 1, 'join', now), state, /уже записан/);
  failure(respond(state, 'bogus', 1, 'join', now), state, /Неверное/);
  failure(respond(state, 'member', 1, 'bogus', now), state, /Неверное/);
});

test('poll choices change one vote without changing RSVP or schedule', () => {
  const initial = frozen(createDemoState(now));
  let state = success(vote(initial, 'member', 2, 0, now));
  state = success(vote(frozen(state), 'member', 2, 1, now));
  state = success(vote(frozen(state), 'admin', 2, 1, now));
  assert.equal(Object.keys(event(state, 2).poll.votes).length, 4);
  assert.equal(event(state, 2).poll.votes.member, 1);
  assert.equal(event(state, 2).responses.member, undefined);
  assert.equal(event(state, 2).startsAt, event(initial, 2).startsAt);
  failure(vote(state, 'member', 2, 1, now), state, /уже учтён/);
});

test('invalid vote targets and expired events cannot be used', () => {
  const state = frozen(createDemoState(now));
  for (const option of [-1, 2, 0.5, NaN]) failure(vote(state, 'member', 2, option, now), state, /не найден/);
  failure(vote(state, 'member', 1, 0, now), state, /не найден/);
  failure(vote(state, 'member', 99, 0, now), state, /не найдено/);
  failure(vote(state, 'member', 2, 0, event(state, 2).startsAt), state, /уже началось/);
  failure(respond(state, 'member', 1, 'join', event(state).startsAt), state, /уже началось/);
});

test('all administration operations enforce role at the model boundary', () => {
  const state = frozen(createDemoState(now));
  failure(saveEvent(state, 'member', input, undefined, now), state, /администратору/);
  failure(saveEvent(state, 'member', input, 1, now), state, /администратору/);
  failure(reschedule(state, 'member', 1, input.startsAt, now), state, /администратору/);
  failure(cancelEvent(state, 'member', 1), state, /администратору/);
});

test('create normalizes input and allocates distinct event and message IDs', () => {
  const original = frozen(createDemoState(now));
  const state = success(saveEvent(original, 'admin', { ...input, title: '  Встреча  ', description: '  Обсуждение  ' }, undefined, now));
  assert.equal(state.events.at(-1).title, 'Встреча');
  assert.equal(state.events.at(-1).description, 'Обсуждение');
  assert.equal(state.events.at(-1).id, original.nextId);
  assert.equal(state.messages.at(-1).eventId, original.nextId);
  const ids = [...state.events, ...state.messages].map(item => item.id);
  assert.equal(ids.length, new Set(ids).size);
  assert.ok(ids.every(id => id < state.nextId));
});

test('invalid title, description, date and capacity are rejected', () => {
  const state = frozen(createDemoState(now));
  for (const patch of [{ title: '' }, { title: ' '.repeat(4) }, { title: 'a'.repeat(81) }, { description: '' }, { description: 'a'.repeat(501) }, { startsAt: now }, { startsAt: NaN }, { startsAt: now + 367 * 86400000 }, { capacity: 0 }, { capacity: 1.5 }, { capacity: 101 }]) {
    const result = saveEvent(state, 'admin', { ...input, ...patch }, undefined, now);
    assert.ok(result.error); assert.strictEqual(result.state, state);
  }
});

test('edit preserves RSVPs, checks occupied capacity, and clears stale time poll', () => {
  let state = success(respond(createDemoState(now), 'member', 2, 'join', now));
  failure(saveEvent(state, 'admin', { ...input, capacity: 2 }, 2, now), state, /меньше числа/);
  state = success(saveEvent(frozen(state), 'admin', { ...input, startsAt: event(state, 2).startsAt }, 2, now));
  assert.ok(event(state, 2).poll);
  state = success(saveEvent(frozen(state), 'admin', { ...input, startsAt: input.startsAt + 7200000 }, 2, now));
  assert.equal(event(state, 2).poll, null);
  assert.equal(event(state, 2).responses.member, 'join');
});

test('reschedule retains responses and announces the date while closing the poll', () => {
  let state = success(respond(createDemoState(now), 'member', 2, 'join', now));
  const original = frozen(state);
  state = success(reschedule(original, 'admin', 2, input.startsAt, now));
  assert.equal(event(state, 2).startsAt, input.startsAt);
  assert.equal(event(state, 2).poll, null);
  assert.deepEqual(event(state, 2).responses, event(original, 2).responses);
  assert.match(state.messages.at(-1).text, /перенесена/);
  failure(reschedule(state, 'admin', 2, now - 1, now), state, /будущем/);
});

test('cancellation preserves attendance and closes RSVP, polls and editing', () => {
  const original = frozen(createDemoState(now));
  const state = frozen(success(cancelEvent(original, 'admin', 2)));
  assert.deepEqual(event(state, 2).responses, event(original, 2).responses);
  failure(respond(state, 'member', 2, 'join', now), state, /отменено/);
  failure(vote(state, 'member', 2, 0, now), state, /отменено/);
  failure(saveEvent(state, 'admin', input, 2, now), state, /Отменённое/);
  failure(reschedule(state, 'admin', 2, input.startsAt, now), state, /Отменённое/);
  failure(cancelEvent(state, 'admin', 2), state, /уже отменено/);
});

test('participant response lists include every status', () => {
  let state = success(respond(createDemoState(now), 'member', 1, 'decline', now));
  const text = participants(event(state));
  assert.match(text, /Пойду: Лена, Никита/);
  assert.match(text, /Возможно: Соня/);
  assert.match(text, /Не пойду: Алекс/);
});

test('missing event actions fail without mutation', () => {
  const state = frozen(createDemoState(now));
  failure(saveEvent(state, 'admin', input, 999, now), state, /не найдено/);
  failure(reschedule(state, 'admin', 999, input.startsAt, now), state, /не найдено/);
  failure(cancelEvent(state, 'admin', 999), state, /не найдено/);
});

test('state round trip preserves choices, votes and cancelled events', () => {
  let state = success(respond(createDemoState(now), 'member', 1, 'join', now));
  state = success(vote(state, 'member', 2, 1, now));
  state = success(cancelEvent(state, 'admin', 1));
  const restored = restoreDemoState(JSON.stringify(state), now);
  assert.equal(restored.recovered, false);
  assert.deepEqual(restored.state, state);
});

test('corrupt persistence recovers from structural and referential errors', () => {
  const cases = [null, '{', 'null', '[]', '{}', JSON.stringify({ ...createDemoState(now), version: 8 })];
  for (const raw of cases) assert.equal(restoreDemoState(raw, now).recovered, raw !== null);
  for (const mutate of [
    s => { s.events[0].responses.evil = 'join'; }, s => { s.events[0].responses.member = 'invalid'; },
    s => { s.events[0].capacity = 1; }, s => { s.events[1].poll.votes.member = 99; },
    s => { s.events[1].poll.options = [NaN, 0]; }, s => { s.events[0].id = s.events[1].id; },
    s => { s.messages[0].id = s.events[0].id; }, s => { s.messages[0].eventId = 999; },
    s => { s.nextId = 2; }, s => { s.messages[0].author = 'unknown'; }, s => { s.events[0].startsAt = 'tomorrow'; },
  ]) {
    const broken = createDemoState(now); mutate(broken);
    const restored = restoreDemoState(JSON.stringify(broken), now);
    assert.equal(restored.recovered, true); assert.deepEqual(restored.state, createDemoState(now));
  }
});

test('chat history stays bounded and remains valid after the cap is reached', () => {
  let state = createDemoState(now);
  for (let i = 0; i < 140; i++) state = addMessage(state, 'member', `Сообщение ${i}`, undefined, now + i);
  assert.equal(state.messages.length, 100);
  assert.equal(state.messages.at(-1).text, 'Сообщение 139');
  assert.equal(restoreDemoState(JSON.stringify(state), now).recovered, false);
});

test('event count cannot grow beyond the persisted limit', () => {
  let state = createDemoState(now);
  while (state.events.length < 30) state = success(saveEvent(state, 'admin', input, undefined, now));
  failure(saveEvent(state, 'admin', input, undefined, now), state, /до 30/);
  assert.equal(restoreDemoState(JSON.stringify(state), now).recovered, false);
});
