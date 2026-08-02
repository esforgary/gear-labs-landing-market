import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Bot, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./faq-chat-bot.scss";

type ChatRole = "bot" | "user";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
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
    fallback: "Похоже, сервер чата сейчас недоступен. Могу подсказать: спроси про цену, сроки, макеты, конструктор или запуск.",
  },
  en: {
    title: "GearLabs chat",
    subtitle: "Project launch FAQ",
    greeting: "Hi. I can help with templates, the builder, pricing, and launch.",
    placeholder: "Ask about your site...",
    send: "Send",
    open: "Open chat",
    close: "Close chat",
    fallback: "The chat server seems unavailable. Ask about pricing, timelines, templates, the builder, or launch.",
  },
  de: {
    title: "GearLabs Chat",
    subtitle: "FAQ zum Projektstart",
    greeting: "Hallo. Ich helfe bei Layouts, Konstruktor, Preisen und Start.",
    placeholder: "Frage zum Projekt...",
    send: "Senden",
    open: "Chat offnen",
    close: "Chat schliessen",
    fallback: "Der Chat-Server ist gerade nicht erreichbar. Frage nach Preis, Fristen, Layouts, Konstruktor oder Launch.",
  },
  fr: {
    title: "Chat GearLabs",
    subtitle: "FAQ de lancement",
    greeting: "Bonjour. Je peux aider avec les maquettes, le constructeur, les prix et le lancement.",
    placeholder: "Poser une question...",
    send: "Envoyer",
    open: "Ouvrir le chat",
    close: "Fermer le chat",
    fallback: "Le serveur du chat semble indisponible. Demandez les prix, delais, maquettes, constructeur ou lancement.",
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

  useEffect(() => {
    setMessages([{ id: "greeting", role: "bot", text: copy.greeting }]);
    setSuggestions(getFallbackSuggestions(lang));
  }, [copy.greeting, lang]);

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
    async (question: string) => {
      const cleanQuestion = question.trim();
      if (!cleanQuestion || isThinking) return;

      setMessages((current) => [
        ...current,
        { id: makeMessageId(), role: "user", text: cleanQuestion },
      ]);
      setInput("");
      setIsThinking(true);

      try {
        const response = await fetch(`${apiBaseUrl}/api/chatbot/message`, {
          body: JSON.stringify({ message: cleanQuestion, lang }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) throw new Error("Chat response failed");
        const payload = (await response.json()) as { answer?: string; suggestions?: ChatSuggestion[] };

        setMessages((current) => [
          ...current,
          { id: makeMessageId(), role: "bot", text: payload.answer || copy.fallback },
        ]);

        if (Array.isArray(payload.suggestions) && payload.suggestions.length) {
          setSuggestions(payload.suggestions);
        }
      } catch {
        setMessages((current) => [
          ...current,
          { id: makeMessageId(), role: "bot", text: copy.fallback },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [copy.fallback, isThinking, lang],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ask(input);
  };

  return (
    <div className={`faq-chat ${isOpen ? "is-open" : ""}`}>
      <div className="faq-chat__panel" aria-hidden={!isOpen}>
        <header className="faq-chat__header">
          <div className="faq-chat__avatar">
            <Bot size={20} />
          </div>
          <div>
            <strong>{copy.title}</strong>
            <span>{copy.subtitle}</span>
          </div>
          <button type="button" onClick={() => setIsOpen(false)} aria-label={copy.close}>
            <X size={19} />
          </button>
        </header>

        <div className="faq-chat__messages" ref={messagesRef}>
          {messages.map((message) => (
            <div className={`faq-chat__message faq-chat__message--${message.role}`} key={message.id}>
              {message.text}
            </div>
          ))}
          {isThinking && (
            <div className="faq-chat__message faq-chat__message--bot faq-chat__message--thinking">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        <div className="faq-chat__suggestions">
          {suggestions.slice(0, 3).map((suggestion) => (
            <button key={suggestion.id} type="button" onClick={() => ask(suggestion.title)}>
              {suggestion.title}
            </button>
          ))}
        </div>

        <form className="faq-chat__form" onSubmit={handleSubmit}>
          <input
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
        className="faq-chat__toggle"
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        aria-label={isOpen ? copy.close : copy.open}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={25} />}
        <Sparkles size={15} className="faq-chat__spark" />
      </button>
    </div>
  );
}

export default FaqChatBot;
