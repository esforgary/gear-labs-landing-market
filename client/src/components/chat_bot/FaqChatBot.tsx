import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLayoutEffect } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./faq-chat-bot.scss";

type ChatRole = "bot" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  retryQuestion?: string;
};

type ChatSuggestion = {
  id: string;
  title: string;
};

type ChatCopy = {
  title: string;
  subtitle: string;
  greeting: string;
  placeholder: string;
  send: string;
  open: string;
  close: string;
  fallback: string;
  retry: string;
  thinking: string;
};

const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";

const chatCopy: Record<string, ChatCopy> = {
  ru: {
    title: "GearLabs чат",
    subtitle: "FAQ по запуску проекта",
    greeting: "Привет. Я помогу быстро разобраться с макетами, конструктором, ценой и запуском.",
    placeholder: "Спросить про сайт...",
    send: "Отправить",
    open: "Открыть чат",
    close: "Закрыть чат",
    fallback: "Не удалось получить ответ. Попробуйте ещё раз — ваш вопрос сохранён.",
    retry: "Повторить",
    thinking: "Готовлю ответ…",
  },
  en: {
    title: "GearLabs chat",
    subtitle: "Project launch FAQ",
    greeting: "Hi. I can help with templates, the builder, pricing, and launch.",
    placeholder: "Ask about your site...",
    send: "Send",
    open: "Open chat",
    close: "Close chat",
    fallback: "Could not get a reply. Please try again — your question is saved.",
    retry: "Try again",
    thinking: "Preparing a reply…",
  },
  de: {
    title: "GearLabs Chat",
    subtitle: "FAQ zum Projektstart",
    greeting: "Hallo. Ich helfe bei Layouts, Konstruktor, Preisen und Start.",
    placeholder: "Frage zum Projekt...",
    send: "Senden",
    open: "Chat offnen",
    close: "Chat schliessen",
    fallback: "Die Antwort konnte nicht geladen werden. Bitte erneut versuchen — Ihre Frage bleibt erhalten.",
    retry: "Erneut versuchen",
    thinking: "Antwort wird vorbereitet…",
  },
  fr: {
    title: "Chat GearLabs",
    subtitle: "FAQ de lancement",
    greeting: "Bonjour. Je peux aider avec les maquettes, le constructeur, les prix et le lancement.",
    placeholder: "Poser une question...",
    send: "Envoyer",
    open: "Ouvrir le chat",
    close: "Fermer le chat",
    fallback: "Impossible de recevoir la réponse. Réessayez — votre question est conservée.",
    retry: "Réessayer",
    thinking: "Préparation de la réponse…",
  },
};

const fallbackSuggestions: Record<string, ChatSuggestion[]> = {
  ru: [
    { id: "price", title: "Как считается цена?" },
    { id: "timeline", title: "Сколько длится запуск?" },
    { id: "builder", title: "Что делает конструктор?" },
  ],
  en: [
    { id: "price", title: "How is the price calculated?" },
    { id: "timeline", title: "How long does launch take?" },
    { id: "builder", title: "What does the builder do?" },
  ],
  de: [
    { id: "price", title: "Wie wird der Preis berechnet?" },
    { id: "timeline", title: "Wie lange dauert der Start?" },
    { id: "builder", title: "Was macht der Konstruktor?" },
  ],
  fr: [
    { id: "price", title: "Comment le prix est calcule ?" },
    { id: "timeline", title: "Combien de temps prend le lancement ?" },
    { id: "builder", title: "A quoi sert le constructeur ?" },
  ],
};

const getCopy = (lang: string) => chatCopy[lang] ?? chatCopy.ru;
const getFallbackSuggestions = (lang: string) => fallbackSuggestions[lang] ?? fallbackSuggestions.ru;

const makeMessageId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function FaqChatBot() {
  const { lang } = useThemeLang();
  const copy = useMemo(() => getCopy(lang), [lang]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [suggestions, setSuggestions] = useState<ChatSuggestion[]>(() => getFallbackSuggestions(lang));
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: "greeting", role: "bot", text: getCopy(lang).greeting },
  ]);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);
  const requestRef = useRef<AbortController | null>(null);

  const closeChat = () => {
    setIsOpen(false);
    toggleRef.current?.focus();
  };

  useEffect(() => {
    setMessages([{ id: "greeting", role: "bot", text: copy.greeting }]);
    setSuggestions(getFallbackSuggestions(lang));
    setInput("");
    setIsThinking(false);
    return () => {
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [copy.greeting, lang]);

  useLayoutEffect(() => {
    const chat = chatRef.current;
    const footer = document.querySelector<HTMLElement>(".footer-wrapper");
    if (!chat || !footer) return;

    let frame = 0;
    const updatePosition = () => {
      frame = 0;
      const overlap = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top);
      chat.style.setProperty("--chat-footer-offset", `${overlap}px`);
    };
    const schedulePosition = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePosition);
    };
    const observer = new ResizeObserver(schedulePosition);
    observer.observe(document.body);
    observer.observe(footer);
    window.addEventListener("scroll", schedulePosition, { passive: true });
    window.addEventListener("resize", schedulePosition);
    updatePosition();
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedulePosition);
      window.removeEventListener("resize", schedulePosition);
    };
  }, []);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus({ preventScroll: true });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !chatRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", handleOutsideClick, true);
    return () => document.removeEventListener("click", handleOutsideClick, true);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const controller = new AbortController();
    fetch(`${apiBaseUrl}/api/chatbot/faqs?lang=${encodeURIComponent(lang)}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("FAQ unavailable");
        return response.json() as Promise<{ suggestions?: ChatSuggestion[] }>;
      })
      .then((payload) => {
        if (Array.isArray(payload.suggestions) && payload.suggestions.length) {
          setSuggestions(payload.suggestions);
        }
      })
      .catch((error) => {
        if (error.name !== "AbortError") setSuggestions(getFallbackSuggestions(lang));
      });

    return () => controller.abort();
  }, [isOpen, lang]);

  useEffect(() => {
    if (!isOpen) return;
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: "smooth" });
  }, [isOpen, messages, isThinking]);

  const ask = useCallback(
    async (question: string, retryId?: string) => {
      const cleanQuestion = question.trim();
      if (!cleanQuestion || requestRef.current) return;
      const controller = new AbortController();
      requestRef.current = controller;
      const timeout = window.setTimeout(() => controller.abort(), 12000);

      setMessages((current) => retryId ? current.filter(message => message.id !== retryId) : [
        ...current,
        { id: makeMessageId(), role: "user", text: cleanQuestion },
      ]);
      if (!retryId) setInput("");
      setIsThinking(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/chatbot/message`, {
          body: JSON.stringify({ message: cleanQuestion, lang }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Chat response failed");
        const payload = (await response.json()) as { answer?: string; suggestions?: ChatSuggestion[] };
        if (requestRef.current !== controller) return;
        if (typeof payload.answer !== "string" || !payload.answer.trim()) throw new Error("Empty chat response");
        const answer = payload.answer;

        setMessages((current) => [
          ...current,
          { id: makeMessageId(), role: "bot", text: answer },
        ]);

        if (Array.isArray(payload.suggestions) && payload.suggestions.length) {
          setSuggestions(payload.suggestions);
        }
      } catch {
        if (requestRef.current !== controller) return;
        setMessages((current) => [
          ...current,
          { id: makeMessageId(), role: "bot", text: copy.fallback, retryQuestion: cleanQuestion },
        ]);
      } finally {
        window.clearTimeout(timeout);
        if (requestRef.current === controller) {
          requestRef.current = null;
          setIsThinking(false);
        }
      }
    },
    [copy.fallback, lang],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <div ref={chatRef} className={`faq-chat ${isOpen ? "is-open" : ""}`} onKeyDown={event => {
      if (event.key === "Escape" && isOpen) {
        event.stopPropagation();
        closeChat();
      }
    }}>
      <div id="faq-chat-panel" className="faq-chat__panel" role="dialog" aria-label={copy.title} aria-hidden={!isOpen} inert={!isOpen}>
        <header className="faq-chat__header">
          <div className="faq-chat__avatar">
            <Bot size={20} />
          </div>
          <div>
            <strong>{copy.title}</strong>
            <span>{copy.subtitle}</span>
          </div>
          <button type="button" onClick={closeChat} aria-label={copy.close}>
            <X size={19} />
          </button>
        </header>

        <div className="faq-chat__messages" ref={messagesRef} role="log" aria-live="polite" aria-relevant="additions text" aria-busy={isThinking}>
          {messages.map((message) => (
            <div className={`faq-chat__message faq-chat__message--${message.role}`} key={message.id}>
              {message.text}
              {message.retryQuestion && <button className="faq-chat__retry" type="button" disabled={isThinking} onClick={() => void ask(message.retryQuestion!, message.id)}>{copy.retry}</button>}
            </div>
          ))}
          {isThinking && (
            <div className="faq-chat__message faq-chat__message--bot faq-chat__message--thinking" aria-label={copy.thinking}>
              <span aria-hidden="true" />
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </div>
          )}
        </div>

        <div className="faq-chat__suggestions">
          {suggestions.slice(0, 3).map((suggestion) => (
            <button key={suggestion.id} type="button" disabled={isThinking} onClick={() => void ask(suggestion.title)}>
              {suggestion.title}
            </button>
          ))}
        </div>

        <form className="faq-chat__form" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            maxLength={1000}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={copy.placeholder}
            aria-label={copy.placeholder}
          />
          <button type="submit" disabled={!input.trim() || isThinking} aria-label={copy.send}>
            <Send size={18} />
          </button>
        </form>
      </div>

      <button
        ref={toggleRef}
        className="faq-chat__toggle"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? copy.close : copy.open}
        aria-expanded={isOpen}
        aria-controls="faq-chat-panel"
      >
        <MessageCircle className="faq-chat__toggle-icon faq-chat__toggle-icon--message" size={25} aria-hidden="true" />
        <X className="faq-chat__toggle-icon faq-chat__toggle-icon--close" size={24} aria-hidden="true" />
      </button>
    </div>
  );
}

export default FaqChatBot;
