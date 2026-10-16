import assert from 'node:assert/strict';
import test from 'node:test';
import { ADMIN_ID, MEMBER_ID, createDemoState, levelOf, memberRoles, ranking, rankEmbed, sendMessage, runCommand, updateSettings, resetStats, restoreDemoState } from './levels-model.ts';

const now = Date.UTC(2026, 9, 16, 10);
const member = (state, id = MEMBER_ID) => state.members.find(item => item.id === id);
function freeze(value) { Object.freeze(value); for (const item of Object.values(value)) if (item && typeof item === 'object') freeze(item); return value; }
function success(result) { assert.equal(result.error, undefined); return result.state; }
function failure(result, initial, pattern) { assert.match(result.error, pattern); assert.strictEqual(result.state, initial); }

test('first qualifying message levels up and awards the configured role without mutation', () => {
  const initial = freeze(createDemoState(now));
  const result = sendMessage(initial, 'member', 'общий', '  Всем привет, покажу свой проект!  ', now);
  const next = success(result);
  assert.equal(member(initial).xp, 90);
  assert.equal(member(next).xp, 105);
  assert.equal(levelOf(member(next).xp), 1);
  assert.deepEqual(memberRoles(next, member(next)), ['Свои']);
  assert.equal(next.messages.at(-2).text, 'Всем привет, покажу свой проект!');
  assert.match(next.messages.at(-1).embed.title, /Новый уровень/);
  assert.match(next.messages.at(-1).embed.body, /Свои/);
  assert.match(result.feedback, /\+15 XP/);
});

test('cooldown sends messages without XP and expires at the exact boundary', () => {
  let state = success(sendMessage(createDemoState(now), 'member', 'общий', 'Первое сообщение', now));
  const during = sendMessage(freeze(state), 'member', 'общий', 'Второе сообщение', now + 7999);
  state = success(during);
  assert.equal(member(state).xp, 105);
  assert.equal(state.messages.at(-1).text, 'Второе сообщение');
  assert.match(during.feedback, /1 с/);
  state = success(sendMessage(freeze(state), 'member', 'общий', 'Третье сообщение', now + 8000));
  assert.equal(member(state).xp, 120);
  assert.equal(member(state).lastEarnedAt, now + 8000);
});

test('duplicates are normalized and detected beyond the immediately previous message', () => {
  let state = success(sendMessage(createDemoState(now), 'member', 'общий', 'Всем привет', now));
  state = success(sendMessage(state, 'member', 'общий', 'А вот и новый проект', now + 8000));
  const duplicate = sendMessage(freeze(state), 'member', 'общий', '  ВСЕМ   ПРИВЕТ  ', now + 16000);
  state = success(duplicate);
  assert.equal(member(state).xp, 120);
  assert.match(duplicate.feedback, /повтор/);
  assert.equal(member(state).lastEarnedAt, now + 8000);
});

test('short messages, commands and ranking-channel messages never earn XP', () => {
  let state = createDemoState(now);
  for (const [channel, text] of [['общий', '  а б в  '], ['рейтинг', 'Достаточно длинное сообщение'], ['общий', '/rank'], ['общий', '/leaderboard'], ['общий', '/rewards'], ['общий', '/help']]) {
    state = success(sendMessage(freeze(state), 'member', channel, text, now));
    assert.equal(member(state).xp, 90);
    assert.equal(member(state).lastEarnedAt, 0);
  }
});

test('rank targets, leaderboard and help reflect the current shared state', () => {
  let state = success(runCommand(createDemoState(now), 'admin', 'общий', '/xp add @luna 300', now));
  assert.equal(ranking(state)[0].id, MEMBER_ID);
  state = success(runCommand(freeze(state), 'member', 'рейтинг', '/rank @luna', now + 1));
  assert.match(state.messages.at(-1).embed.body, /Уровень 3 · место #1/);
  assert.equal(state.messages.at(-1).embed.progress, 90);
  state = success(runCommand(state, 'member', 'рейтинг', '/rank Мира', now + 2));
  assert.match(state.messages.at(-1).embed.title, /Мира/);
  assert.match(rankEmbed(state, ADMIN_ID).title, /Алекс/);
  state = success(runCommand(state, 'member', 'рейтинг', '/leaderboard', now + 3));
  assert.match(state.messages.at(-1).embed.rows[0], /1. Луна/);
});

test('all administrative mutations enforce the role in the model', () => {
  const state = freeze(createDemoState(now));
  failure(runCommand(state, 'member', 'общий', '/xp add @luna 50', now), state, /администратор/);
  failure(runCommand(state, 'member', 'общий', '/settings', now), state, /администратор/);
  failure(runCommand(state, 'member', 'общий', '/reset', now), state, /администратор/);
  failure(updateSettings(state, 'member', [{ level: 2, name: 'Клуб' }], 5, 'общий', now), state, /администратор/);
  failure(resetStats(state, 'member', true, 'общий', now), state, /администратор/);
  failure(sendMessage(state, 'owner', 'общий', 'Привет всем', now), state, /роль/);
});

test('administrator XP adjustments grant and remove roles with an audit response', () => {
  const initial = freeze(createDemoState(now));
  let state = success(runCommand(initial, 'admin', 'общий', '/xp add @luna 220', now));
  assert.deepEqual(memberRoles(state, member(state)), ['Свои', 'Завсегдатай']);
  assert.match(state.messages.at(-1).embed.title, /журнал действий/);
  assert.match(state.messages.at(-1).embed.body, /Алекс добавил 220 XP/);
  state = success(runCommand(freeze(state), 'admin', 'общий', '/xp remove @luna 220', now + 1));
  assert.equal(member(state).xp, 90);
  assert.deepEqual(memberRoles(state, member(state)), []);
  assert.match(state.messages.at(-1).embed.rows[1], /нет/);
  assert.equal(member(initial).xp, 90);
});

test('invalid commands and XP amounts leave state untouched', () => {
  const state = freeze(createDemoState(now));
  for (const command of ['/xp add @luna -1', '/xp add @luna 1.5', '/xp add @luna nope', '/xp add @luna 0', '/xp add @luna 10001', '/xp add @luna 10000', '/xp remove @luna 91', '/xp add @missing 20', '/xp add @luna 2 extra', '/rank @missing', '/leaderboard extra', '/unknown']) {
    const result = runCommand(state, 'admin', 'общий', command, now);
    assert.ok(result.error, command);
    assert.strictEqual(result.state, state);
  }
  failure(sendMessage(state, 'member', 'общий', ' '.repeat(3), now), state, /1 до 500/);
  failure(runCommand(state, 'admin', 'общий', '/rank ' + 'x'.repeat(500), now), state, /500/);
});

test('reward edits recalculate all roles and cooldown with strict threshold validation', () => {
  const initial = freeze(createDemoState(now));
  const state = success(updateSettings(initial, 'admin', [{ level: 3, name: '  Ветеран ' }, { level: 2, name: 'Активист' }], 3, 'общий', now));
  assert.equal(state.cooldown, 3);
  assert.deepEqual(memberRoles(state, member(state, 'mira')), ['Активист', 'Ветеран']);
  assert.deepEqual(memberRoles(state, member(state, 'nexo')), ['Активист']);
  assert.match(state.messages.at(-1).embed.title, /Настройки сохранены/);
  for (const rewards of [[], [{ level: 0, name: 'Роль' }], [{ level: 101, name: 'Роль' }], [{ level: 1, name: ' ' }], [{ level: 1, name: 'Роль' }, { level: 1, name: 'Другая' }], [{ level: 1, name: 'Роль' }, { level: 2, name: 'РОЛЬ' }]]) {
    assert.ok(updateSettings(state, 'admin', rewards, 8, 'общий', now).error);
  }
  for (const cooldown of [2, 61, 3.5, NaN]) assert.ok(updateSettings(state, 'admin', state.rewards, cooldown, 'общий', now).error);
});

test('statistics reset requires confirmation, preserves messages/settings and can earn XP again', () => {
  let state = success(sendMessage(createDemoState(now), 'member', 'общий', 'Приветствую всех', now));
  failure(resetStats(freeze(state), 'admin', false, 'общий', now), state, /Подтвердите/);
  const before = state;
  state = success(resetStats(state, 'admin', true, 'общий', now + 1));
  assert.deepEqual(state.rewards, before.rewards);
  assert.equal(state.messages.length, before.messages.length + 2);
  assert.ok(state.members.every(item => item.xp === 0 && item.lastEarnedAt === 0 && item.recent.length === 0));
  state = success(sendMessage(state, 'member', 'общий', 'Приветствую всех', now + 2));
  assert.equal(member(state).xp, 15);
});

test('persistence round trips real interactions and rejects corrupt nested data', () => {
  let state = success(sendMessage(createDemoState(now), 'member', 'общий', 'Скоро покажу проект', now));
  state = success(runCommand(state, 'admin', 'общий', '/xp add @mira 30', now + 1));
  const restored = restoreDemoState(JSON.stringify(state), now + 2);
  assert.equal(restored.recovered, false);
  assert.deepEqual(restored.state, state);
  assert.equal(restoreDemoState(null, now).recovered, false);
  for (const raw of ['', '{', 'null', '[]', '{"version":2}']) assert.equal(restoreDemoState(raw, now).recovered, true);
  const mutations = [
    s => { s.members[0].xp = -1; }, s => { s.members[0].xp = 1.5; }, s => { s.members[0].id = 'owner'; },
    s => { s.members[0].recent = [5]; }, s => { s.members[0].lastEarnedAt = now + 100000; }, s => { s.cooldown = 0; },
    s => { s.messages[0].text = {}; }, s => { s.messages[1].id = s.messages[0].id; }, s => { s.messages[0].channel = 'bad'; },
    s => { s.messages[0].channel = ['общий']; }, s => { s.messages[0].authorId = ['luna']; },
    s => { s.messages[2].embed.buttons = ['/xp add @luna 100']; }, s => { s.messages[2].embed.rows = [{}]; },
    s => { s.rewards[0].name = ''; }, s => { s.rewards[1].level = s.rewards[0].level; }, s => { s.nextId = 1; },
  ];
  for (const mutate of mutations) { const bad = structuredClone(state); mutate(bad); assert.equal(restoreDemoState(JSON.stringify(bad), now + 2).recovered, true); }
});

test('long sessions cap history and duplicate memory while retaining unique message IDs', () => {
  let state = createDemoState(now);
  for (let i = 0; i < 170; i++) state = success(sendMessage(state, 'member', 'общий', `Новое сообщение номер ${i}`, now + i * 8000));
  assert.equal(state.messages.length, 150);
  assert.equal(new Set(state.messages.map(item => item.id)).size, 150);
  assert.equal(member(state).recent.length, 20);
  assert.equal(restoreDemoState(JSON.stringify(state), now + 170 * 8000).recovered, false);
});
