export type Role = "member" | "admin";
export type Channel = "общий" | "рейтинг";
export type Member = { id: string; name: string; color: string; xp: number; lastEarnedAt: number; recent: string[] };
export type Reward = { level: number; name: string };
export type Embed = { title: string; body: string; rows?: string[]; progress?: number; accent?: "purple" | "green" | "gold"; buttons?: string[] };
export type Message = { id: number; authorId: string; at: number; channel: Channel; text: string; embed?: Embed };
export type DemoState = { version: 1; members: Member[]; messages: Message[]; rewards: Reward[]; cooldown: number; nextId: number };
export type Result = { state: DemoState; error?: string; feedback?: string };
export const STORAGE_KEY = "gearlabs.discord-levels.v1";
export const MEMBER_ID = "luna";
export const ADMIN_ID = "admin";
export const XP_PER_MESSAGE = 15;
const MAX_XP = 10000;
const MAX_MESSAGES = 150;
const identities = [
  { id: MEMBER_ID, name: "Луна", color: "#b88dff" },
  { id: "mira", name: "Мира", color: "#edaa74" },
  { id: "nexo", name: "Нексо", color: "#6bc9ba" },
  { id: ADMIN_ID, name: "Алекс", color: "#83adff" },
];
export const levelOf = (xp: number) => Math.floor(xp / 100);
export const memberRoles = (state: DemoState, member: Member) => state.rewards.filter(reward => levelOf(member.xp) >= reward.level).map(reward => reward.name);
export const ranking = (state: DemoState) => [...state.members].sort((a, b) => b.xp - a.xp || a.id.localeCompare(b.id));
const normalize = (text: string) => text.toLocaleLowerCase("ru-RU").replace(/\s+/g, " ").trim();
const actorId = (role: Role) => role === "admin" ? ADMIN_ID : MEMBER_ID;
const fail = (state: DemoState, error: string): Result => ({ state, error });
function append(state: DemoState, items: Omit<Message, "id">[]): DemoState {
  return { ...state, nextId: state.nextId + items.length, messages: [...state.messages, ...items.map((item, index) => ({ ...item, id: state.nextId + index }))].slice(-MAX_MESSAGES) };
}
function bot(state: DemoState, channel: Channel, embed: Embed, now: number, command?: { role: Role; text: string }): DemoState {
  return append(state, [...(command ? [{ authorId: actorId(command.role), at: now, channel, text: command.text }] : []), { authorId: "levels", at: now, channel, text: "", embed }]);
}
export function rankEmbed(state: DemoState, memberId = MEMBER_ID): Embed {
  const member = state.members.find(item => item.id === memberId)!;
  const roles = memberRoles(state, member);
  return { title: `Ранг · ${member.name}`, body: `Уровень ${levelOf(member.xp)} · место #${ranking(state).findIndex(item => item.id === memberId) + 1}`, rows: [`${member.xp} XP всего · ${member.xp % 100}/100 до следующего уровня`, `Роли: ${roles.join(", ") || "пока нет"}`], progress: member.xp % 100, buttons: ["/rank", "/leaderboard", "/rewards"] };
}
export function leaderboardEmbed(state: DemoState): Embed {
  return { title: "Рейтинг Pixel Club", body: "Уровни за участие в жизни сервера", accent: "gold", rows: ranking(state).map((member, index) => `${index + 1}. ${member.name} · ур. ${levelOf(member.xp)} · ${member.xp} XP`), buttons: ["/leaderboard", "/rank"] };
}
export function createDemoState(now = Date.now()): DemoState {
  const state: DemoState = { version: 1, members: identities.map((item, index) => ({ ...item, xp: [90, 350, 210, 160][index], lastEarnedAt: 0, recent: [] })), rewards: [{ level: 1, name: "Свои" }, { level: 3, name: "Завсегдатай" }, { level: 5, name: "Легенда" }], cooldown: 8, nextId: 1, messages: [] };
  return append(state, [
    { authorId: "mira", at: now - 180000, channel: "общий", text: "Собрала новый арт! Вечером покажу ✨" },
    { authorId: "nexo", at: now - 120000, channel: "общий", text: "Ждём! Луна, тебе совсем чуть-чуть до первого уровня." },
    { authorId: "levels", at: now - 60000, channel: "общий", text: "", embed: { title: "Общение приносит опыт", body: "За содержательное сообщение: +15 XP. Луна, до уровня 1 осталось 10 XP!", rows: ["В демо: 1 награда за 8 секунд. Повторы последних 20 сообщений не дают XP.", "Команды и сообщения в #рейтинг не дают XP."], buttons: ["/rank", "/rewards", "/help"] } },
    { authorId: "levels", at: now - 30000, channel: "рейтинг", text: "", embed: leaderboardEmbed(state) },
  ]);
}
export function sendMessage(state: DemoState, role: Role, channel: Channel, raw: string, now = Date.now()): Result {
  if (role !== "member" && role !== "admin") return fail(state, "Неизвестная роль.");
  const text = raw.trim();
  if (!text || text.length > 500) return fail(state, "Сообщение должно содержать от 1 до 500 символов.");
  if (text.startsWith("/")) return runCommand(state, role, channel, text, now);
  const member = state.members.find(item => item.id === actorId(role))!;
  const normalized = normalize(text);
  const remaining = Math.max(0, Math.ceil((member.lastEarnedAt + state.cooldown * 1000 - now) / 1000));
  const duplicate = member.recent.includes(normalized);
  const eligible = channel === "общий" && normalized.replace(/\s/g, "").length >= 5 && !duplicate && !remaining;
  const xp = eligible ? Math.min(MAX_XP, member.xp + XP_PER_MESSAGE) : member.xp;
  const changed = { ...member, xp, lastEarnedAt: eligible ? now : member.lastEarnedAt, recent: channel === "общий" ? [...member.recent, normalized].slice(-20) : member.recent };
  let next = append({ ...state, members: state.members.map(item => item.id === member.id ? changed : item) }, [{ authorId: member.id, at: now, channel, text }]);
  if (levelOf(xp) > levelOf(member.xp)) {
    const awarded = state.rewards.filter(item => item.level > levelOf(member.xp) && item.level <= levelOf(xp)).map(item => item.name);
    next = bot(next, channel, { title: `Новый уровень! ${member.name} → ${levelOf(xp)}`, body: awarded.length ? `Автоматически выданы роли: ${awarded.join(", ")}.` : "Спасибо, что развиваете наше сообщество!", accent: "green", rows: [`Всего ${xp} XP`], buttons: ["/rank", "/leaderboard"] }, now);
  }
  const feedback = channel !== "общий" ? "Отправлено. XP начисляется только в #общий." : duplicate ? "Отправлено без XP: повтор одного из последних 20 сообщений." : normalized.replace(/\s/g, "").length < 5 ? "Отправлено без XP: нужно хотя бы 5 символов без пробелов." : remaining ? `Отправлено без XP: до следующей награды ${remaining} с.` : xp === member.xp ? "Достигнут лимит демо: 10 000 XP." : `+${xp - member.xp} XP · следующая награда через ${state.cooldown} с.`;
  return { state: next, feedback };
}
function findMember(state: DemoState, query: string) {
  const name = normalize(query.replace(/^@/, ""));
  return state.members.find(item => item.id === name || normalize(item.name) === name);
}
export function runCommand(state: DemoState, role: Role, channel: Channel, raw: string, now = Date.now()): Result {
  if (role !== "member" && role !== "admin") return fail(state, "Неизвестная роль.");
  if (raw.trim().length > 500) return fail(state, "Команда не должна превышать 500 символов.");
  const parts = raw.trim().split(/\s+/);
  const command = parts[0].toLowerCase();
  let embed: Embed;
  if (command === "/rank") {
    const member = parts[1] ? findMember(state, parts.slice(1).join(" ")) : state.members.find(item => item.id === actorId(role));
    if (!member) return fail(state, "Участник не найден. Используйте @luna, @mira, @nexo или @admin.");
    embed = rankEmbed(state, member.id);
  } else if (command === "/leaderboard" && parts.length === 1) embed = leaderboardEmbed(state);
  else if (command === "/rewards" && parts.length === 1) embed = { title: "Роли за уровни", body: "Роли выдаются автоматически. При снижении XP роль снимается, если уровень ниже порога.", rows: state.rewards.map(item => `Уровень ${item.level} → @${item.name}`), accent: "gold", buttons: ["/rank", "/leaderboard"] };
  else if (command === "/help" && parts.length === 1) embed = { title: "Команды Levels", body: `+15 XP за сообщение от 5 символов в #общий. Пауза в демо: ${state.cooldown} с. Повторы последних 20 сообщений и команды не дают XP.`, rows: ["/rank [@участник] — карточка уровня", "/leaderboard — рейтинг", "/rewards — роли за уровни", ...(role === "admin" ? ["/xp add|remove @участник число", "/settings — награды и пауза", "/reset — сбросить XP с подтверждением"] : [])], buttons: ["/rank", "/leaderboard", "/rewards"] };
  else if (command === "/xp") {
    if (role !== "admin") return fail(state, "Изменять XP может только администратор.");
    if (parts.length !== 4 || !["add", "remove"].includes(parts[1]) || !/^\d+$/.test(parts[3])) return fail(state, "Формат: /xp add|remove @luna 20");
    const target = findMember(state, parts[2]);
    const amount = Number(parts[3]);
    if (!target) return fail(state, "Участник не найден. Используйте @luna, @mira, @nexo или @admin.");
    if (!Number.isSafeInteger(amount) || amount < 1 || amount > MAX_XP) return fail(state, "Количество XP: целое число от 1 до 10 000.");
    const xp = parts[1] === "add" ? target.xp + amount : target.xp - amount;
    if (xp < 0 || xp > MAX_XP) return fail(state, "Итоговый XP должен быть от 0 до 10 000.");
    const next = { ...state, members: state.members.map(item => item.id === target.id ? { ...item, xp } : item) };
    const roles = memberRoles(next, { ...target, xp });
    embed = { title: "XP изменён · журнал действий", body: `Алекс ${parts[1] === "add" ? "добавил" : "снял"} ${amount} XP: ${target.name}.`, rows: [`${target.xp} → ${xp} XP · уровень ${levelOf(xp)}`, `Роли пересчитаны: ${roles.join(", ") || "нет"}`], accent: "green", buttons: [`/rank @${target.id}`, "/leaderboard"] };
    return { state: bot(next, channel, embed, now, { role, text: raw.trim() }) };
  } else if (command === "/settings" || command === "/reset") return fail(state, role === "admin" ? "Откройте окно настройки или подтверждения через подсказку команды." : "Эта команда доступна только администратору.");
  else return fail(state, "Команда не найдена или содержит лишние аргументы. Откройте /help.");
  return { state: bot(state, channel, embed, now, { role, text: raw.trim() }) };
}
export function updateSettings(state: DemoState, role: Role, rewards: Reward[], cooldown: number, channel: Channel, now = Date.now()): Result {
  if (role !== "admin") return fail(state, "Менять награды может только администратор.");
  if (!Number.isInteger(cooldown) || cooldown < 3 || cooldown > 60) return fail(state, "Пауза в демо: целое число от 3 до 60 секунд.");
  if (rewards.length < 1 || rewards.length > 5 || rewards.some(item => !Number.isInteger(item.level) || item.level < 1 || item.level > 100 || !item.name.trim() || item.name.trim().length > 24)) return fail(state, "Добавьте 1–5 ролей: уровень 1–100, название до 24 символов.");
  if (new Set(rewards.map(item => item.level)).size !== rewards.length || new Set(rewards.map(item => normalize(item.name))).size !== rewards.length) return fail(state, "Уровни и названия ролей должны быть уникальными.");
  const next = { ...state, cooldown, rewards: rewards.map(item => ({ ...item, name: item.name.trim() })).sort((a, b) => a.level - b.level) };
  return { state: bot(next, channel, { title: "Настройки сохранены · журнал действий", body: `Алекс установил паузу ${cooldown} с. Роли всех участников пересчитаны.`, rows: next.rewards.map(item => `Уровень ${item.level} → @${item.name}`), buttons: ["/rewards", "/rank"] }, now, { role, text: "/settings" }) };
}
export function resetStats(state: DemoState, role: Role, confirmed: boolean, channel: Channel, now = Date.now()): Result {
  if (role !== "admin") return fail(state, "Сброс XP доступен только администратору.");
  if (!confirmed) return fail(state, "Подтвердите сброс XP всех участников.");
  const next = { ...state, members: state.members.map(item => ({ ...item, xp: 0, lastEarnedAt: 0, recent: [] })) };
  return { state: bot(next, channel, { title: "Статистика сброшена · журнал действий", body: "Алекс обнулил XP всех участников. Уровни и полученные роли сброшены. Настройки наград и история сообщений сохранены.", buttons: ["/leaderboard", "/rewards"] }, now, { role, text: "/reset · подтверждено" }) };
}
export function restoreDemoState(raw: string | null, now = Date.now()): { state: DemoState; recovered: boolean } {
  const fallback = (recovered: boolean) => ({ state: createDemoState(now), recovered });
  if (raw === null) return fallback(false);
  try {
    const value: unknown = JSON.parse(raw);
    const object = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
    const integer = (v: unknown, min: number, max: number): v is number => Number.isSafeInteger(v) && Number(v) >= min && Number(v) <= max;
    const string = (v: unknown, max: number): v is string => typeof v === "string" && v.length <= max;
    if (!object(value) || value.version !== 1 || !integer(value.nextId, 1, Number.MAX_SAFE_INTEGER - 2) || !integer(value.cooldown, 3, 60) || !Array.isArray(value.members) || value.members.length !== 4 || !Array.isArray(value.messages) || value.messages.length > MAX_MESSAGES || !Array.isArray(value.rewards)) return fallback(true);
    if (!value.members.every((m, index) => object(m) && m.id === identities[index].id && m.name === identities[index].name && m.color === identities[index].color && integer(m.xp, 0, MAX_XP) && integer(m.lastEarnedAt, 0, now + 60000) && Array.isArray(m.recent) && m.recent.length <= 20 && m.recent.every(item => string(item, 500)))) return fallback(true);
    if (value.rewards.length < 1 || value.rewards.length > 5 || !value.rewards.every(r => object(r) && integer(r.level, 1, 100) && string(r.name, 24) && r.name.trim().length > 0)) return fallback(true);
    const rewards = value.rewards as Reward[];
    if (new Set(rewards.map(r => r.level)).size !== rewards.length || new Set(rewards.map(r => normalize(r.name))).size !== rewards.length) return fallback(true);
    const ids = new Set<number>();
    for (const m of value.messages) {
      if (!object(m) || !integer(m.id, 1, value.nextId - 1) || ids.has(m.id) || !integer(m.at, 0, now + 60000) || !string(m.text, 500) || typeof m.authorId !== "string" || ![...identities.map(i => i.id), "levels"].includes(m.authorId) || typeof m.channel !== "string" || !["общий", "рейтинг"].includes(m.channel)) return fallback(true);
      ids.add(m.id);
      if (m.embed !== undefined) {
        const e = m.embed;
        if (m.authorId !== "levels" || !object(e) || !string(e.title, 150) || !string(e.body, 600) || (e.rows !== undefined && (!Array.isArray(e.rows) || e.rows.length > 10 || !e.rows.every(r => string(r, 500)))) || (e.progress !== undefined && !integer(e.progress, 0, 100)) || (e.accent !== undefined && (typeof e.accent !== "string" || !["purple", "green", "gold"].includes(e.accent))) || (e.buttons !== undefined && (!Array.isArray(e.buttons) || e.buttons.length > 4 || !e.buttons.every(b => typeof b === "string" && /^\/(rank(?: @(?:luna|mira|nexo|admin))?|leaderboard|rewards|help)$/.test(b))))) return fallback(true);
      }
    }
    return { state: value as DemoState, recovered: false };
  } catch { return fallback(true); }
}
