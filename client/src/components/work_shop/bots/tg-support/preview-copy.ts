type PreviewLanguage = "ru" | "en" | "de" | "fr" | "it" | "pl" | "cz" | "sk";

type TgSupportPreviewCopy = {
  kicker: string;
  description: string;
  features: readonly string[];
  demoMode: string;
  customer: string;
  admin: string;
  demoNote: string;
  storageError: string;
  resetQuestion: string;
  confirmReset: string;
  cancel: string;
  reset: string;
};

const copy: Record<PreviewLanguage, TgSupportPreviewCopy> = {
  ru: {
    kicker: "Telegram-бот",
    description: "Поддержка прямо в мессенджере: создавайте обращения и следите за ответами. Переключитесь на администратора, чтобы открыть очередь, ответить клиенту и изменить статус. История переписки общая для обеих ролей.",
    features: ["Создание обращений", "Общая история переписки", "Очередь и ответы", "Статусы обращений"],
    demoMode: "Режим демонстрации",
    customer: "Клиент",
    admin: "Администратор",
    demoNote: "Локальная демонстрация с вымышленными данными сохраняется в этом браузере. Интерфейс телефона на русском языке. Подключения к настоящему Telegram нет.",
    storageError: "Не удалось сохранить данные. Изменения доступны до закрытия окна.",
    resetQuestion: "Восстановить исходные демо-обращения и удалить внесённые изменения?",
    confirmReset: "Подтвердить сброс",
    cancel: "Отмена",
    reset: "Сбросить демо",
  },
  en: {
    kicker: "Telegram bot",
    description: "Support right in your messenger: create tickets and follow replies. Switch to the administrator role to open the queue, reply to a customer and update the status. Both roles share the same conversation history.",
    features: ["Create support tickets", "Shared conversation history", "Queue and replies", "Ticket statuses"],
    demoMode: "Demo mode",
    customer: "Customer",
    admin: "Administrator",
    demoNote: "This local demo uses fictional data saved in this browser. The phone interface is in Russian. There is no connection to real Telegram.",
    storageError: "Could not save the data. Changes remain available until you close the window.",
    resetQuestion: "Restore the original demo tickets and discard your changes?",
    confirmReset: "Confirm reset",
    cancel: "Cancel",
    reset: "Reset demo",
  },
  de: {
    kicker: "Telegram-Bot",
    description: "Support direkt im Messenger: Erstellen Sie Anfragen und verfolgen Sie die Antworten. Wechseln Sie zur Administratorrolle, um die Warteschlange zu öffnen, Kunden zu antworten und den Status zu ändern. Beide Rollen sehen denselben Gesprächsverlauf.",
    features: ["Supportanfragen erstellen", "Gemeinsamer Gesprächsverlauf", "Warteschlange und Antworten", "Status der Anfragen"],
    demoMode: "Demomodus",
    customer: "Kunde",
    admin: "Administrator",
    demoNote: "Diese lokale Demo verwendet fiktive Daten, die in diesem Browser gespeichert werden. Die Telefonoberfläche ist auf Russisch. Es besteht keine Verbindung zum echten Telegram.",
    storageError: "Die Daten konnten nicht gespeichert werden. Änderungen bleiben verfügbar, bis Sie das Fenster schließen.",
    resetQuestion: "Ursprüngliche Demoanfragen wiederherstellen und Ihre Änderungen verwerfen?",
    confirmReset: "Zurücksetzen bestätigen",
    cancel: "Abbrechen",
    reset: "Demo zurücksetzen",
  },
  fr: {
    kicker: "Bot Telegram",
    description: "L’assistance dans votre messagerie : créez des tickets et suivez les réponses. Passez en mode administrateur pour consulter la file d’attente, répondre au client et modifier le statut. Les deux rôles partagent le même historique de conversation.",
    features: ["Création de tickets", "Historique partagé", "File d’attente et réponses", "Statuts des tickets"],
    demoMode: "Mode de démonstration",
    customer: "Client",
    admin: "Administrateur",
    demoNote: "Cette démonstration locale utilise des données fictives enregistrées dans ce navigateur. L’interface du téléphone est en russe. Aucune connexion au véritable service Telegram.",
    storageError: "Impossible d’enregistrer les données. Les modifications restent disponibles jusqu’à la fermeture de la fenêtre.",
    resetQuestion: "Restaurer les tickets de démonstration d’origine et supprimer vos modifications ?",
    confirmReset: "Confirmer la réinitialisation",
    cancel: "Annuler",
    reset: "Réinitialiser la démo",
  },
  it: {
    kicker: "Bot Telegram",
    description: "Assistenza direttamente in chat: crea ticket e segui le risposte. Passa al ruolo di amministratore per aprire la coda, rispondere al cliente e modificare lo stato. Entrambi i ruoli condividono la stessa cronologia della conversazione.",
    features: ["Creazione di ticket", "Cronologia condivisa", "Coda e risposte", "Stati dei ticket"],
    demoMode: "Modalità demo",
    customer: "Cliente",
    admin: "Amministratore",
    demoNote: "Questa demo locale usa dati fittizi salvati in questo browser. L’interfaccia del telefono è in russo. Non è collegata al vero servizio Telegram.",
    storageError: "Impossibile salvare i dati. Le modifiche restano disponibili fino alla chiusura della finestra.",
    resetQuestion: "Ripristinare i ticket demo originali ed eliminare le tue modifiche?",
    confirmReset: "Conferma ripristino",
    cancel: "Annulla",
    reset: "Ripristina demo",
  },
  pl: {
    kicker: "Bot Telegram",
    description: "Wsparcie prosto w komunikatorze: twórz zgłoszenia i śledź odpowiedzi. Przełącz się na administratora, aby otworzyć kolejkę, odpowiedzieć klientowi i zmienić status. Obie role korzystają ze wspólnej historii rozmowy.",
    features: ["Tworzenie zgłoszeń", "Wspólna historia rozmowy", "Kolejka i odpowiedzi", "Statusy zgłoszeń"],
    demoMode: "Tryb demonstracyjny",
    customer: "Klient",
    admin: "Administrator",
    demoNote: "To lokalne demo używa fikcyjnych danych zapisanych w tej przeglądarce. Interfejs telefonu jest w języku rosyjskim. Nie ma połączenia z prawdziwym Telegramem.",
    storageError: "Nie udało się zapisać danych. Zmiany będą dostępne do zamknięcia okna.",
    resetQuestion: "Przywrócić początkowe zgłoszenia demonstracyjne i usunąć wprowadzone zmiany?",
    confirmReset: "Potwierdź reset",
    cancel: "Anuluj",
    reset: "Zresetuj demo",
  },
  cz: {
    kicker: "Telegram bot",
    description: "Podpora přímo v chatu: vytvářejte požadavky a sledujte odpovědi. Přepněte se do role správce, otevřete frontu, odpovězte zákazníkovi a změňte stav. Obě role sdílejí stejnou historii konverzace.",
    features: ["Vytváření požadavků", "Sdílená historie konverzace", "Fronta a odpovědi", "Stavy požadavků"],
    demoMode: "Režim ukázky",
    customer: "Zákazník",
    admin: "Správce",
    demoNote: "Tato místní ukázka používá smyšlená data uložená v tomto prohlížeči. Rozhraní telefonu je v ruštině. Není připojena ke skutečnému Telegramu.",
    storageError: "Data se nepodařilo uložit. Změny zůstanou dostupné do zavření okna.",
    resetQuestion: "Obnovit původní ukázkové požadavky a zahodit provedené změny?",
    confirmReset: "Potvrdit obnovení",
    cancel: "Zrušit",
    reset: "Obnovit ukázku",
  },
  sk: {
    kicker: "Telegram bot",
    description: "Podpora priamo v chate: vytvárajte požiadavky a sledujte odpovede. Prepnite sa do roly správcu, otvorte front, odpovedzte zákazníkovi a zmeňte stav. Obe roly zdieľajú rovnakú históriu konverzácie.",
    features: ["Vytváranie požiadaviek", "Zdieľaná história konverzácie", "Front a odpovede", "Stavy požiadaviek"],
    demoMode: "Režim ukážky",
    customer: "Zákazník",
    admin: "Správca",
    demoNote: "Táto miestna ukážka používa vymyslené údaje uložené v tomto prehliadači. Rozhranie telefónu je v ruštine. Nie je pripojená k skutočnému Telegramu.",
    storageError: "Údaje sa nepodarilo uložiť. Zmeny zostanú dostupné do zatvorenia okna.",
    resetQuestion: "Obnoviť pôvodné ukážkové požiadavky a zahodiť vykonané zmeny?",
    confirmReset: "Potvrdiť obnovenie",
    cancel: "Zrušiť",
    reset: "Obnoviť ukážku",
  },
};

export function getTgSupportPreviewCopy(lang: string): TgSupportPreviewCopy {
  return copy[lang as PreviewLanguage] ?? copy.en;
}
