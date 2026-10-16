import { adminActor, customerActor, topics, statusLabels, visibleTickets, createTicket, claimTicket, setTicketStatus, replyToTicket, closeTicket, reopenTicket, type DemoState, type Status, type Ticket, type Topic } from "./support-model.ts";

export type SupportRole = "customer" | "admin";
export type Choice = { label: string; value: string };
export type ChatEntry = { id: number; from: "user" | "bot"; text: string; at: number; choices: Choice[] };
export type SupportSession = { entries: ChatEntry[]; nextId: number; step: "idle" | "topic" | "subject" | "message" | "ticket"; ticketId: number | null; draft: { topic?: Topic; subject?: string; message?: string }; seen: Record<number, number> };
const actorFor = (role: SupportRole) => role === "admin" ? adminActor : customerActor;
const choice = (label: string, value: string): Choice => ({ label, value });
const menu = (role: SupportRole) => role === "admin" ? [choice("Очередь обращений", "/queue"), choice("Команды бота", "/help")] : [choice("Создать обращение", "/new"), choice("Мои обращения", "/tickets")];
const selected = (state: DemoState, session: SupportSession, role: SupportRole) => visibleTickets(state, actorFor(role)).find(ticket => ticket.id === session.ticketId);
const append = (session: SupportSession, from: ChatEntry["from"], text: string, choices: Choice[], at: number): SupportSession => ({ ...session, nextId: session.nextId + 1, entries: [...session.entries.slice(-149), { id: session.nextId, from, text, choices, at }] });
function actions(ticket: Ticket, role: SupportRole) {
  const result: Choice[] = [];
  if (ticket.status === "resolved") result.push(choice("Открыть снова", `/reopen ${ticket.id}`));
  else {
    if (role === "admin") {
      if (!ticket.assignee) result.push(choice("Взять в работу", `/take ${ticket.id}`));
      result.push(choice("Изменить статус", `/status ${ticket.id}`), choice("Запросить уточнение", `/clarify ${ticket.id}`));
    }
    result.push(choice("Закрыть обращение", `/close ${ticket.id}`));
  }
  result.push(choice(role === "admin" ? "Все обращения" : "Мои обращения", role === "admin" ? "/queue" : "/tickets"));
  return result;
}
function nextChoices(state: DemoState, session: SupportSession, role: SupportRole): Choice[] {
  if (session.step === "topic") return [...topics.map(topic => choice(topic, topic)), choice("Отмена", "/cancel")];
  if (session.step === "subject" || session.step === "message") return [choice("Отмена", "/cancel")];
  const ticket = selected(state, session, role);
  return session.step === "ticket" && ticket ? actions(ticket, role) : menu(role);
}
function ticketPrompt(ticket: Ticket) { return `Обращение #${ticket.id} · ${statusLabels[ticket.status]}\n${ticket.subject}\n\n${ticket.status === "resolved" ? "Переписка закрыта. Можно открыть обращение снова." : "Напишите сообщение в строке ниже — я передам его собеседнику."}`; }
export function createSupportSession(role: SupportRole, at = Date.now()): SupportSession {
  return append({ entries: [], nextId: 1, step: "idle", ticketId: null, draft: {}, seen: {} }, "bot", role === "admin" ? "Здравствуйте! Вы в чате оператора TG Support.\n/queue — очередь обращений. Откройте обращение, чтобы ответить клиенту." : "Привет! Я помогу связаться с поддержкой.\nНапишите свой вопрос или выберите команду ниже.\n/new — новое обращение\n/tickets — мои обращения", menu(role), at);
}
export function syncSupportSession(state: DemoState, session: SupportSession, role: SupportRole, at = Date.now()): SupportSession {
  if (session.step !== "ticket") return session;
  const ticket = selected(state, session, role);
  if (!ticket) return append({ ...session, step: "idle", ticketId: null }, "bot", "Обращение больше недоступно. Выберите действие.", menu(role), at);
  const unseen = ticket.history.filter(event => event.id > (session.seen[ticket.id] ?? 0));
  if (!unseen.length) return session;
  let next = session;
  for (const event of unseen) next = append(next, event.author === role ? "user" : "bot", event.author === "system" ? event.text : `${event.author === role ? "" : event.author === "admin" ? "Ответ поддержки:\n" : "Сообщение клиента:\n"}${event.text}`, [], event.at);
  next = { ...next, seen: { ...next.seen, [ticket.id]: ticket.history.at(-1)!.id } };
  return append(next, "bot", ticketPrompt(ticket), actions(ticket, role), at);
}

/** Inline choices belong to the last bot message; stale choices cannot mutate tickets. */
export function advanceSupportConversation(state: DemoState, original: SupportSession, role: SupportRole, input: string, at = Date.now(), sourceId?: number): { state: DemoState; session: SupportSession } {
  const text = input.trim();
  if (!text) return { state, session: original };
  const last = original.entries.at(-1);
  if (sourceId !== undefined && (last?.id !== sourceId || !last.choices.some(item => item.value === input))) return { state, session: original };
  let session = append(original, "user", text, [], at);
  let nextState = state;
  const say = (body: string, choices = nextChoices(nextState, session, role)) => { session = append(session, "bot", body, choices, at); };
  const actor = actorFor(role);
  const openTicket = (ticket: Ticket, fullHistory = false) => {
    session = { ...session, step: "ticket", ticketId: ticket.id, draft: {} };
    if (fullHistory) {
      say(`Открываю обращение #${ticket.id}\n${ticket.topic} · ${ticket.subject}`, []);
      for (const event of ticket.history.slice(-12)) session = append(session, event.author === role ? "user" : "bot", event.author === "system" ? event.text : `${event.author === role ? "" : event.author === "admin" ? "Ответ поддержки:\n" : "Сообщение клиента:\n"}${event.text}`, [], event.at);
    }
    session = { ...session, seen: { ...session.seen, [ticket.id]: ticket.history.at(-1)!.id } };
    say(ticketPrompt(ticket), actions(ticket, role));
  };
  const makeTicket = () => {
    const id = nextState.nextTicketId;
    nextState = createTicket(nextState, actor, { topic: session.draft.topic!, subject: session.draft.subject!, message: session.draft.message! }, at);
    say(`Готово! Создано обращение #${id}. Оператор увидит ваш вопрос.`, []);
    openTicket(nextState.tickets.find(ticket => ticket.id === id)!);
  };
  try {
    if (text.length > 1200) throw new Error("Сообщение слишком длинное. Максимум — 1200 символов.");
    if (text.startsWith("/")) {
      const [rawCommand, argument, value] = text.split(/\s+/);
      const command = rawCommand.toLowerCase();
      if (["/start", "/cancel"].includes(command)) {
        session = { ...session, step: "idle", ticketId: null, draft: {} };
        say(command === "/cancel" ? "Текущее действие отменено. Обращения сохранены. Чем помочь?" : "Я на связи. Выберите действие или напишите команду.", menu(role));
      } else if (command === "/help") {
        say(role === "admin" ? "/queue — очередь\n/ticket 2001 — открыть обращение\n/take 2001 — взять в работу\n/status 2001 — выбрать статус\n/close 2001 — закрыть\n/reopen 2001 — открыть снова\n/cancel — вернуться в меню" : "/new — новое обращение\n/tickets — мои обращения\n/ticket 2001 — открыть переписку\n/close 2001 — закрыть\n/reopen 2001 — открыть снова\n/cancel — отменить текущее действие");
      } else if (command === "/new") {
        if (role !== "customer") throw new Error("Обращения создаются в роли клиента. Откройте /queue, чтобы ответить.");
        session = { ...session, step: "topic", ticketId: null, draft: {} };
        say("Давайте создадим обращение.\nВыберите тему вопроса:");
      } else if (command === "/tickets" || command === "/queue") {
        if (command === "/queue" && role !== "admin") throw new Error("Очередь доступна администратору. Ваши обращения — /tickets.");
        const status = argument as Status | undefined;
        if (status && !(status in statusLabels)) throw new Error("Такого статуса нет. Отправьте /tickets или /queue.");
        const tickets = visibleTickets(nextState, actor).filter(ticket => !status || ticket.status === status);
        session = { ...session, step: "idle", ticketId: null, draft: {} };
        say(tickets.length ? `${role === "admin" ? "Очередь поддержки" : "Ваши обращения"}${status ? ` · ${statusLabels[status]}` : ""}: ${tickets.length}\nВыберите переписку.` : "С таким статусом обращений пока нет.", [...tickets.map(ticket => choice(`#${ticket.id} · ${ticket.subject} · ${statusLabels[ticket.status]}`, `/ticket ${ticket.id}`)), choice("Фильтр по статусу", "/filter"), ...menu(role)]);
      } else if (command === "/filter") {
        const list = role === "admin" ? "/queue" : "/tickets";
        say("Какие обращения показать?", [choice("Все", list), ...Object.entries(statusLabels).map(([key, label]) => choice(label, `${list} ${key}`))]);
      } else if (["/ticket", "/take", "/status", "/close", "/reopen", "/clarify"].includes(command)) {
        const id = argument ? Number(argument) : session.ticketId;
        const ticket = visibleTickets(nextState, actor).find(item => item.id === id);
        if (!ticket) throw new Error("Обращение не найдено. Выберите его в списке.");
        if (command === "/ticket") openTicket(ticket, true);
        else if (command === "/status" && !value) {
          if (role !== "admin") throw new Error("Изменение статуса доступно администратору.");
          session = { ...session, step: "ticket", ticketId: ticket.id };
          say(`Выберите статус обращения #${ticket.id}:`, Object.entries(statusLabels).map(([key, label]) => choice(label, `/status ${ticket.id} ${key}`)));
        } else {
          if (command === "/take") nextState = claimTicket(nextState, actor, ticket.id, at);
          if (command === "/status") nextState = setTicketStatus(nextState, actor, ticket.id, value as Status, at);
          if (command === "/close") nextState = closeTicket(nextState, actor, ticket.id, at);
          if (command === "/reopen") nextState = reopenTicket(nextState, actor, ticket.id, at);
          if (command === "/clarify") {
            if (role !== "admin") throw new Error("Команда доступна администратору.");
            nextState = replyToTicket(nextState, actor, ticket.id, "Спасибо за обращение! Уточните, пожалуйста, номер демо-заказа.", at);
            say("Клиенту отправлен запрос: «Уточните, пожалуйста, номер демо-заказа». Используйте строку ввода для своего ответа.", []);
          }
          openTicket(nextState.tickets.find(item => item.id === ticket.id)!);
        }
      } else say("Не знаю эту команду. /help покажет доступные действия.");
    } else if (session.step === "topic") {
      const index = /^\d$/.test(text) ? Number(text) - 1 : -1;
      const topic = topics.find(item => item.toLowerCase() === text.toLowerCase()) ?? topics[index];
      if (!topic) throw new Error("Выберите тему кнопкой или напишите её название.");
      session = { ...session, step: "subject", draft: { ...session.draft, topic } };
      say(`Тема: ${topic}.\nКак кратко назвать ваш вопрос? Напишите заголовок одним сообщением (до 80 символов).`);
    } else if (session.step === "subject") {
      if (text.length > 80) throw new Error("Заголовок должен быть короче 80 символов. Попробуйте ещё раз.");
      session = { ...session, step: "message", draft: { ...session.draft, subject: text } };
      if (session.draft.message) makeTicket();
      else say("Теперь расскажите подробнее, что произошло. Напишите сообщение ниже — я передам его оператору.");
    } else if (session.step === "message") {
      session = { ...session, draft: { ...session.draft, message: text } };
      makeTicket();
    } else if (session.step === "ticket") {
      const ticket = selected(nextState, session, role);
      if (!ticket) throw new Error("Сначала выберите обращение.");
      nextState = replyToTicket(nextState, actor, ticket.id, text, at);
      say(role === "admin" ? "Ответ передан клиенту." : "Сообщение передано оператору.", []);
      openTicket(nextState.tickets.find(item => item.id === ticket.id)!);
    } else if (role === "customer") {
      session = { ...session, step: "topic", ticketId: null, draft: { message: text } };
      say("Принял ваш вопрос. Чтобы передать его нужному специалисту, выберите тему:");
    } else say("Сначала откройте обращение через /queue. После этого можно писать ответ в этой же строке.", menu(role));
  } catch (error) { say(error instanceof Error ? error.message : "Не удалось выполнить действие. Попробуйте ещё раз."); }
  return { state: nextState, session };
}
