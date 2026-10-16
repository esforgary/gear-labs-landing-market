export const STORAGE_KEY = "gearlabs.discord-guard.demo.v1";
export const MEMBER_ID = "mila";
export const ADMIN_ID = "admin";
export type Role = "member" | "admin";
export type Member = { id: string; name: string; color: string; role: Role; warnings: number; timeoutUntil: number | null; banned: boolean };
export type ChatMessage = { id: number; memberId: string; text: string; at: number; deleted: boolean };
export type Report = { id: number; messageId: number; reporterId: string; reason: string; status: "open" | "resolved" | "dismissed"; at: number };
export type ModEvent = { id: number; kind: string; targetId: string | null; text: string; at: number };
export type DemoState = { version: 1; members: Member[]; messages: ChatMessage[]; reports: Report[]; events: ModEvent[]; nextId: number };
export type ActionResult = { state: DemoState; error?: string };
export type ModerationAction = "warn" | "timeout" | "untimeout" | "ban" | "unban";

const TIMEOUT_MS = 10 * 60 * 1000;
const MAX_TIME = 8640000000000000;
const MAX_MESSAGES = 200;
const MAX_REPORTS = 100;
const MAX_EVENTS = 300;
const memberIds = [ADMIN_ID, MEMBER_ID, "max", "nova"];
const eventKinds = ["setup", "report", "warn", "timeout", "untimeout", "ban", "unban", "delete", "resolved", "dismissed"];
const record = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null && !Array.isArray(value);
const validTime = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= MAX_TIME;
const validId = (value: unknown): value is number => typeof value === "number" && Number.isSafeInteger(value) && value > 0;
const validText = (value: unknown, max: number): value is string => typeof value === "string" && value.trim().length > 0 && value.length <= max;
function input(value: unknown, label: string, max: number): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label}: заполните поле.`);
  const normalized = value.trim();
  if (normalized.length > max) throw new Error(`${label}: не более ${max} символов.`);
  return normalized;
}
function checkRole(role: Role) {
  if (role !== "member" && role !== "admin") throw new Error("Неизвестная роль.");
}
function adminOnly(role: Role) {
  checkRole(role);
  if (role !== "admin") throw new Error("Действие доступно администратору.");
}
function checkTime(state: DemoState, now: number) {
  if (!validTime(now) || [...state.messages, ...state.reports, ...state.events].some(item => item.at > now)) throw new Error("Некорректное время действия.");
}
function run(state: DemoState, role: Role, now: number, action: () => DemoState): ActionResult {
  try {
    checkRole(role);
    checkTime(state, now);
    if (state.nextId >= 999998) throw new Error("Достигнут лимит демо. Сбросьте демо, чтобы продолжить.");
    return { state: action() };
  }
  catch (error) { return { state, error: error instanceof Error ? error.message : "Не удалось выполнить действие." }; }
}
function event(state: DemoState, kind: string, targetId: string | null, text: string, at: number): DemoState {
  if (state.events.length >= MAX_EVENTS) throw new Error("Журнал демо заполнен. Сбросьте демо, чтобы продолжить.");
  return { ...state, nextId: state.nextId + 1, events: [...state.events, { id: state.nextId, kind, targetId, text, at }] };
}

export function createDemoState(now = Date.now()): DemoState {
  const at = validTime(now) ? now : Date.now();
  const earlier = (minutes: number) => Math.max(0, at - minutes * 60000);
  return {
    version: 1,
    members: [
      { id: ADMIN_ID, name: "Алекс · админ", color: "#9581ff", role: "admin", warnings: 0, timeoutUntil: null, banned: false },
      { id: MEMBER_ID, name: "Мила", color: "#ed8cae", role: "member", warnings: 0, timeoutUntil: null, banned: false },
      { id: "max", name: "Макс", color: "#62b5ee", role: "member", warnings: 0, timeoutUntil: null, banned: false },
      { id: "nova", name: "Нова", color: "#e7ad65", role: "member", warnings: 0, timeoutUntil: null, banned: false },
    ],
    messages: [
      { id: 1, memberId: ADMIN_ID, text: "Добро пожаловать в Pixel Club! Обсуждаем проекты, помогаем друг другу. Реклама и спам запрещены.", at: earlier(12), deleted: false },
      { id: 2, memberId: "max", text: "Привет! Кто сегодня покажет свой новый проект?", at: earlier(9), deleted: false },
      { id: 3, memberId: MEMBER_ID, text: "А давайте лучше весь вечер обсуждать сериалы? Забудем про проекты 🙂", at: earlier(7), deleted: false },
      { id: 4, memberId: "nova", text: "БЕСПЛАТНЫЕ ПОДАРКИ! Пишите мне! ПОДАРКИ! ПОДАРКИ!", at: earlier(5), deleted: false },
    ],
    reports: [{ id: 5, messageId: 3, reporterId: "max", reason: "Уводит обсуждение от темы канала", status: "open", at: earlier(4) }],
    events: [{ id: 6, kind: "setup", targetId: null, text: "Демо-сервер готов. Все участники и сообщения вымышлены.", at: earlier(14) }, { id: 7, kind: "report", targetId: MEMBER_ID, text: "Макс отправил жалобу на сообщение Милы. Ожидает проверки.", at: earlier(4) }],
    nextId: 8,
  };
}

export function memberRestriction(state: DemoState, now = Date.now()): string | null {
  const member = state.members.find(item => item.id === MEMBER_ID);
  if (!member || member.banned) return "Вы заблокированы на сервере. Администратор может снять блокировку.";
  if (member.timeoutUntil !== null && member.timeoutUntil > now) return `Тайм-аут: отправка сообщений недоступна ещё ${Math.ceil((member.timeoutUntil - now) / 60000)} мин.`;
  return null;
}

export function sendMessage(state: DemoState, role: Role, text: string, now = Date.now()): ActionResult {
  return run(state, role, now, () => {
    const restriction = role === "member" ? memberRestriction(state, now) : null;
    if (restriction) throw new Error(restriction);
    const body = input(text, "Сообщение", 1000);
    if (state.messages.length >= MAX_MESSAGES) throw new Error("История сообщений заполнена. Сбросьте демо.");
    return { ...state, nextId: state.nextId + 1, messages: [...state.messages, { id: state.nextId, memberId: role === "admin" ? ADMIN_ID : MEMBER_ID, text: body, at: now, deleted: false }] };
  });
}

export function reportMessage(state: DemoState, role: Role, messageId: number, reason: string, now = Date.now()): ActionResult {
  return run(state, role, now, () => {
    if (role !== "member") throw new Error("Отправить жалобу может участник. Администратор рассматривает жалобы.");
    if (state.members.find(item => item.id === MEMBER_ID)?.banned) throw new Error("Заблокированный участник не может отправить жалобу.");
    const message = state.messages.find(item => item.id === messageId);
    if (!message || message.deleted) throw new Error("Сообщение недоступно.");
    if (message.memberId === MEMBER_ID) throw new Error("Нельзя пожаловаться на своё сообщение.");
    if (state.reports.some(item => item.messageId === messageId && item.reporterId === MEMBER_ID)) throw new Error("Вы уже отправили жалобу на это сообщение.");
    const body = input(reason, "Причина жалобы", 180);
    if (state.reports.length >= MAX_REPORTS) throw new Error("Список жалоб заполнен. Сбросьте демо.");
    const next: DemoState = { ...state, nextId: state.nextId + 1, reports: [...state.reports, { id: state.nextId, messageId, reporterId: MEMBER_ID, reason: body, status: "open", at: now }] };
    return event(next, "report", message.memberId, `Мила отправила жалобу на сообщение №${messageId}: ${body}`, now);
  });
}

export function moderateMember(state: DemoState, role: Role, targetId: string, action: ModerationAction, reason: string, now = Date.now()): ActionResult {
  return run(state, role, now, () => {
    adminOnly(role);
    const member = state.members.find(item => item.id === targetId);
    if (!member) throw new Error("Участник не найден.");
    if (member.role === "admin") throw new Error("Нельзя применить санкции к администратору.");
    if (!["warn", "timeout", "untimeout", "ban", "unban"].includes(action)) throw new Error("Неизвестное действие модерации.");
    const body = input(reason, "Причина", 180);
    let updated: Member = { ...member };
    let description: string;
    if (action === "unban") {
      if (!member.banned) throw new Error("Участник не заблокирован.");
      updated.banned = false;
      description = "блокировка снята";
    } else {
      if (member.banned) throw new Error("Сначала снимите блокировку участника.");
      switch (action) {
        case "warn":
          if (member.warnings >= 99) throw new Error("Достигнут лимит предупреждений демо.");
          updated.warnings += 1;
          description = `предупреждение №${updated.warnings}`;
          break;
        case "timeout":
          if (member.timeoutUntil !== null && member.timeoutUntil > now) throw new Error("У участника уже действует тайм-аут.");
          if (now > MAX_TIME - TIMEOUT_MS) throw new Error("Некорректное время тайм-аута.");
          updated.timeoutUntil = now + TIMEOUT_MS;
          description = "тайм-аут на 10 минут";
          break;
        case "untimeout":
          if (member.timeoutUntil === null || member.timeoutUntil <= now) throw new Error("У участника нет активного тайм-аута.");
          updated.timeoutUntil = null;
          description = "тайм-аут снят";
          break;
        case "ban":
          updated.banned = true;
          updated.timeoutUntil = null;
          description = "заблокирован на сервере";
          break;
        default: throw new Error("Неизвестное действие модерации.");
      }
    }
    return event({ ...state, members: state.members.map(item => item.id === targetId ? updated : item) }, action, targetId, `${member.name}: ${description}. Причина: ${body}`, now);
  });
}

export function deleteMessage(state: DemoState, role: Role, messageId: number, reason: string, now = Date.now()): ActionResult {
  return run(state, role, now, () => {
    adminOnly(role);
    const message = state.messages.find(item => item.id === messageId);
    if (!message || message.deleted) throw new Error("Сообщение уже удалено или не найдено.");
    const body = input(reason, "Причина удаления", 180);
    return event({ ...state, messages: state.messages.map(item => item.id === messageId ? { ...item, deleted: true } : item) }, "delete", message.memberId, `Удалено сообщение №${messageId}. Причина: ${body}`, now);
  });
}

export function reviewReport(state: DemoState, role: Role, reportId: number, status: "resolved" | "dismissed", now = Date.now()): ActionResult {
  return run(state, role, now, () => {
    adminOnly(role);
    if (status !== "resolved" && status !== "dismissed") throw new Error("Неизвестный результат проверки.");
    const report = state.reports.find(item => item.id === reportId);
    if (!report) throw new Error("Жалоба не найдена.");
    if (report.status !== "open") throw new Error("Жалоба уже рассмотрена.");
    const targetId = state.messages.find(item => item.id === report.messageId)?.memberId ?? null;
    return event({ ...state, reports: state.reports.map(item => item.id === reportId ? { ...item, status } : item) }, status, targetId, `Жалоба №${reportId}: ${status === "resolved" ? "рассмотрена, меры приняты" : "отклонена"}.`, now);
  });
}

export function restoreDemoState(raw: string | null): { state: DemoState; recovered: boolean } {
  const fresh = (recovered: boolean) => ({ state: createDemoState(), recovered });
  if (raw === null) return fresh(false);
  try {
    if (!raw || raw.length > 1000000) return fresh(true);
    const state: unknown = JSON.parse(raw);
    if (!record(state) || state.version !== 1 || !validId(state.nextId) || state.nextId > 1000000 || !Array.isArray(state.members) || state.members.length !== 4 || !Array.isArray(state.messages) || state.messages.length > MAX_MESSAGES || !Array.isArray(state.reports) || state.reports.length > MAX_REPORTS || !Array.isArray(state.events) || state.events.length > MAX_EVENTS) return fresh(true);
    const seenMembers = new Set<string>();
    for (const member of state.members) {
      if (!record(member) || typeof member.id !== "string" || !memberIds.includes(member.id) || seenMembers.has(member.id) || !validText(member.name, 50) || typeof member.color !== "string" || !/^#[0-9a-f]{6}$/i.test(member.color) || member.role !== (member.id === ADMIN_ID ? "admin" : "member") || !Number.isInteger(member.warnings) || (member.warnings as number) < 0 || (member.warnings as number) > 99 || !(member.timeoutUntil === null || validTime(member.timeoutUntil)) || typeof member.banned !== "boolean" || (member.banned && member.timeoutUntil !== null) || (member.role === "admin" && (member.warnings !== 0 || member.timeoutUntil !== null || member.banned))) return fresh(true);
      seenMembers.add(member.id);
    }
    const ids = new Set<number>();
    const checkId = (id: unknown) => {
      if (!validId(id) || id >= (state.nextId as number) || ids.has(id)) return false;
      ids.add(id); return true;
    };
    const messages = new Map<number, ChatMessage>();
    for (const message of state.messages) {
      if (!record(message) || !checkId(message.id) || typeof message.memberId !== "string" || !seenMembers.has(message.memberId) || !validText(message.text, 1000) || !validTime(message.at) || typeof message.deleted !== "boolean") return fresh(true);
      messages.set(message.id as number, message as unknown as ChatMessage);
    }
    const reportPairs = new Set<string>();
    for (const report of state.reports) {
      if (!record(report) || !checkId(report.id) || !validId(report.messageId) || !messages.has(report.messageId) || typeof report.reporterId !== "string" || !seenMembers.has(report.reporterId) || report.reporterId === ADMIN_ID || messages.get(report.messageId)?.memberId === report.reporterId || !validText(report.reason, 180) || !["open", "resolved", "dismissed"].includes(report.status as string) || !validTime(report.at) || report.at < messages.get(report.messageId)!.at) return fresh(true);
      const pair = `${report.reporterId}:${report.messageId}`;
      if (reportPairs.has(pair)) return fresh(true);
      reportPairs.add(pair);
    }
    let previous = 0;
    for (const item of state.events) {
      if (!record(item) || !checkId(item.id) || !eventKinds.includes(item.kind as string) || !(item.targetId === null || (typeof item.targetId === "string" && seenMembers.has(item.targetId))) || !validText(item.text, 400) || !validTime(item.at) || item.at < previous) return fresh(true);
      previous = item.at;
    }
    return { state: state as unknown as DemoState, recovered: false };
  } catch { return fresh(true); }
}
