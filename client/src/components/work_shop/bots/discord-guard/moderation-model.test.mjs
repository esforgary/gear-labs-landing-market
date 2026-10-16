import assert from 'node:assert/strict';
import test from 'node:test';
import { ADMIN_ID, MEMBER_ID, createDemoState, restoreDemoState, memberRestriction, sendMessage, reportMessage, moderateMember, deleteMessage, reviewReport } from './moderation-model.ts';

const now = Date.UTC(2026, 9, 16, 10);
const reason = 'Повторный офтоп в общем канале';
const member = state => state.members.find(item => item.id === MEMBER_ID);
function frozen(value) { Object.freeze(value); for (const item of Object.values(value)) if (item && typeof item === 'object') frozen(item); return value; }
function success(result) { assert.equal(result.error, undefined); return result.state; }
function failure(result, initial, pattern) { assert.match(result.error, pattern); assert.strictEqual(result.state, initial); }

test('both personas send normalized messages into one immutable channel', () => {
  const initial = frozen(createDemoState(now));
  const first = success(sendMessage(initial, 'member', '  Покажу свой проект.  ', now));
  assert.equal(initial.messages.length, 4);
  assert.equal(first.messages.at(-1).text, 'Покажу свой проект.');
  assert.equal(first.messages.at(-1).memberId, MEMBER_ID);
  const second = success(sendMessage(frozen(first), 'admin', 'Ждём!', now + 1));
  assert.equal(second.messages.at(-1).memberId, ADMIN_ID);
  assert.equal(second.messages.length, 6);
  assert.equal(new Set(second.messages.map(item => item.id)).size, 6);
});

test('warn, timeout, member restriction, lifting and report resolution share state', () => {
  let state = success(moderateMember(frozen(createDemoState(now)), 'admin', MEMBER_ID, 'warn', reason, now));
  assert.equal(member(state).warnings, 1);
  state = success(moderateMember(frozen(state), 'admin', MEMBER_ID, 'timeout', reason, now + 1));
  assert.equal(member(state).timeoutUntil, now + 1 + 600000);
  assert.match(memberRestriction(state, now + 1), /10 мин/);
  failure(sendMessage(frozen(state), 'member', 'Сообщение', now + 2), state, /Тайм-аут/);
  state = success(sendMessage(state, 'admin', 'Пожалуйста, соблюдайте тему канала.', now + 2));
  state = success(moderateMember(frozen(state), 'admin', MEMBER_ID, 'untimeout', 'Участник ознакомился с правилами', now + 3));
  assert.equal(memberRestriction(state, now + 3), null);
  state = success(sendMessage(frozen(state), 'member', 'Хорошо, вернёмся к проектам.', now + 4));
  state = success(reviewReport(frozen(state), 'admin', 5, 'resolved', now + 5));
  assert.equal(state.reports[0].status, 'resolved');
  assert.deepEqual(state.events.slice(-4).map(item => item.kind), ['warn', 'timeout', 'untimeout', 'resolved']);
  assert.ok(state.messages.some(item => item.text === 'Хорошо, вернёмся к проектам.'));
});

test('timeouts expire at the exact deadline and can then be applied again', () => {
  let state = success(moderateMember(createDemoState(now), 'admin', MEMBER_ID, 'timeout', reason, now));
  failure(moderateMember(state, 'admin', MEMBER_ID, 'timeout', reason, now + 1), state, /уже действует/);
  assert.match(memberRestriction(state, now + 599999), /1 мин/);
  assert.equal(memberRestriction(state, now + 600000), null);
  state = success(sendMessage(frozen(state), 'member', 'Снова могу писать', now + 600000));
  failure(moderateMember(state, 'admin', MEMBER_ID, 'untimeout', reason, now + 600001), state, /нет активного/);
  state = success(moderateMember(frozen(state), 'admin', MEMBER_ID, 'timeout', reason, now + 600002));
  assert.equal(member(state).timeoutUntil, now + 1200002);
});

test('ban blocks sending and reporting, unban restores member interaction', () => {
  let state = success(moderateMember(createDemoState(now), 'admin', MEMBER_ID, 'timeout', reason, now));
  state = success(moderateMember(frozen(state), 'admin', MEMBER_ID, 'ban', 'Повторное нарушение', now + 1));
  assert.equal(member(state).banned, true);
  assert.equal(member(state).timeoutUntil, null);
  failure(sendMessage(state, 'member', 'Привет', now + 2), state, /заблокированы/);
  failure(reportMessage(state, 'member', 4, 'Спам', now + 2), state, /Заблокированный/);
  failure(moderateMember(state, 'admin', MEMBER_ID, 'warn', reason, now + 2), state, /Сначала снимите/);
  state = success(moderateMember(frozen(state), 'admin', MEMBER_ID, 'unban', 'Апелляция одобрена', now + 3));
  assert.equal(memberRestriction(state, now + 3), null);
  state = success(sendMessage(frozen(state), 'member', 'Спасибо!', now + 4));
  assert.equal(state.events.at(-1).kind, 'unban');
  failure(moderateMember(state, 'admin', MEMBER_ID, 'unban', reason, now + 5), state, /не заблокирован/);
});

test('member reports spam; admin deletes it and resolves report with audit history', () => {
  let state = success(reportMessage(frozen(createDemoState(now)), 'member', 4, '  Реклама и спам  ', now));
  const report = state.reports.at(-1);
  assert.equal(report.reason, 'Реклама и спам');
  assert.equal(report.reporterId, MEMBER_ID);
  failure(reportMessage(state, 'member', 4, 'Повторная жалоба', now), state, /уже отправили/);
  state = success(deleteMessage(frozen(state), 'admin', 4, 'Реклама запрещена', now + 1));
  assert.equal(state.messages.find(item => item.id === 4).deleted, true);
  assert.equal(state.messages.length, 4);
  state = success(reviewReport(frozen(state), 'admin', report.id, 'resolved', now + 2));
  assert.equal(state.reports.at(-1).status, 'resolved');
  assert.deepEqual(state.events.slice(-3).map(item => item.kind), ['report', 'delete', 'resolved']);
  failure(reportMessage(state, 'member', 4, 'Спам', now + 3), state, /недоступно/);
  failure(deleteMessage(state, 'admin', 4, reason, now + 3), state, /уже удалено/);
  assert.equal(restoreDemoState(JSON.stringify(state)).recovered, false);
});

test('admin can dismiss a report but cannot review it twice', () => {
  const state = success(reviewReport(createDemoState(now), 'admin', 5, 'dismissed', now));
  assert.equal(state.reports[0].status, 'dismissed');
  assert.equal(state.events.at(-1).kind, 'dismissed');
  failure(reviewReport(state, 'admin', 5, 'resolved', now + 1), state, /уже рассмотрена/);
});

test('roles, self-reports and administrator sanctions are enforced by the model', () => {
  const state = frozen(createDemoState(now));
  for (const result of [
    moderateMember(state, 'member', 'nova', 'ban', reason, now),
    deleteMessage(state, 'member', 4, reason, now),
    reviewReport(state, 'member', 5, 'resolved', now),
  ]) failure(result, state, /администратору/);
  failure(moderateMember(state, 'admin', ADMIN_ID, 'timeout', reason, now), state, /администратору/);
  failure(reportMessage(state, 'member', 3, reason, now), state, /своё сообщение/);
  failure(reportMessage(state, 'admin', 4, reason, now), state, /может участник/);
  failure(sendMessage(state, 'owner', 'Привет', now), state, /Неизвестная роль/);
});

test('invalid inputs and timestamps fail atomically', () => {
  const state = frozen(createDemoState(now));
  const original = JSON.stringify(state);
  for (const text of ['', '   ', null, 'x'.repeat(1001)]) failure(sendMessage(state, 'member', text, now), state, /Сообщение/);
  for (const text of ['', ' ', 'x'.repeat(181)]) {
    failure(reportMessage(state, 'member', 4, text, now), state, /Причина жалобы/);
    failure(moderateMember(state, 'admin', MEMBER_ID, 'warn', text, now), state, /Причина/);
    failure(deleteMessage(state, 'admin', 4, text, now), state, /Причина удаления/);
  }
  failure(moderateMember(state, 'admin', MEMBER_ID, 'kick', reason, now), state, /Неизвестное действие/);
  failure(moderateMember(state, 'admin', 'missing', 'warn', reason, now), state, /не найден/);
  failure(reviewReport(state, 'admin', 5, 'pending', now), state, /Неизвестный результат/);
  failure(reviewReport(state, 'admin', 999, 'resolved', now), state, /не найдена/);
  failure(reportMessage(state, 'member', 999, reason, now), state, /недоступно/);
  for (const at of [NaN, Infinity, -1, 0, 1.25]) failure(sendMessage(state, 'member', 'Привет', at), state, /время/);
  assert.equal(JSON.stringify(state), original);
});

test('valid state persists moderation, shared chat and report history', () => {
  let state = success(reportMessage(createDemoState(now), 'member', 4, 'Спам', now));
  state = success(moderateMember(state, 'admin', MEMBER_ID, 'warn', reason, now));
  state = success(moderateMember(state, 'admin', MEMBER_ID, 'timeout', reason, now));
  state = success(deleteMessage(state, 'admin', 4, 'Спам', now));
  const restored = restoreDemoState(JSON.stringify(state));
  assert.equal(restored.recovered, false);
  assert.deepEqual(restored.state, state);
  assert.match(memberRestriction(restored.state, now + 1), /Тайм-аут/);
  assert.equal(restoreDemoState(null).recovered, false);
});

test('corrupt, incompatible or cross-linked storage recovers a safe seed', () => {
  const badStates = [
    state => { state.version = 2; },
    state => { state.nextId = 4; },
    state => { state.members.pop(); },
    state => { state.members[1].id = ADMIN_ID; },
    state => { state.members[1].role = 'admin'; },
    state => { state.members[0].banned = true; },
    state => { state.members[1].warnings = -1; },
    state => { state.members[1].color = 'url(evil)'; },
    state => { state.members[1].timeoutUntil = 'tomorrow'; },
    state => { state.messages[0].memberId = 'missing'; },
    state => { state.messages[1].id = state.messages[0].id; },
    state => { state.messages[0].deleted = 'yes'; },
    state => { state.messages[0].text = ' '; },
    state => { state.reports[0].messageId = 999; },
    state => { state.reports[0].reporterId = MEMBER_ID; },
    state => { state.reports[0].at = 1; },
    state => { state.reports.push({ ...state.reports[0], id: state.nextId++ }); },
    state => { state.events[0].targetId = 'missing'; },
    state => { state.events[0].kind = 'invalid'; },
    state => { state.events[1].at = 1; },
  ];
  const raws = ['', '{broken', 'null', '[]', 'x'.repeat(1000001), ...badStates.map(change => { const state = createDemoState(now); change(state); return JSON.stringify(state); })];
  for (const raw of raws) {
    const restored = restoreDemoState(raw);
    assert.equal(restored.recovered, true);
    assert.equal(restored.state.members.length, 4);
    assert.equal(member(restored.state).banned, false);
    assert.equal(restoreDemoState(JSON.stringify(restored.state)).recovered, false);
  }
});

test('demo capacity failures keep original state and audit trail intact', () => {
  let state = createDemoState(now);
  for (let i = state.messages.length; i < 200; i++) state = success(sendMessage(state, 'member', `Сообщение ${i}`, now));
  failure(sendMessage(frozen(state), 'member', 'Ещё', now), state, /История сообщений заполнена/);
  const fullLog = { ...createDemoState(now), events: Array.from({ length: 300 }, (_, index) => ({ id: index + 100, kind: 'setup', targetId: null, text: 'Демо', at: now })), nextId: 400 };
  failure(reportMessage(frozen(fullLog), 'member', 4, 'Спам', now), fullLog, /Журнал демо заполнен/);
  failure(moderateMember(fullLog, 'admin', MEMBER_ID, 'ban', reason, now), fullLog, /Журнал демо заполнен/);
  failure(deleteMessage(fullLog, 'admin', 4, reason, now), fullLog, /Журнал демо заполнен/);
  assert.equal(member(fullLog).banned, false);
});
