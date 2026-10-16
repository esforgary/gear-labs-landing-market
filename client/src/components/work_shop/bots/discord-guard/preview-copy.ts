type PreviewLanguage = "ru" | "en" | "de" | "fr" | "it" | "pl" | "cz" | "sk";

type DiscordGuardCopy = {
  kicker: string;
  title: string;
  description: string;
  features: readonly string[];
  roleLabel: string;
  member: string;
  admin: string;
  notice: string;
  reset: string;
  resetPrompt: string;
  resetConfirm: string;
  cancel: string;
  storageError: string;
  recovered: string;
};

const copy: Record<PreviewLanguage, DiscordGuardCopy> = {
  ru: {
    kicker: "Discord-бот", title: "Discord Guard",
    description: "Порядок на сервере начинается с понятной модерации. Отправьте сообщение или жалобу от лица участника, затем переключитесь на администратора: разберите жалобу, выдайте предупреждение или тайм-аут. Все действия остаются в общем журнале.",
    features: ["Жалобы участников", "Предупреждения и тайм-ауты", "Модерация сообщений", "Журнал действий"],
    roleLabel: "Режим демонстрации", member: "Участник", admin: "Администратор",
    notice: "Локальная демонстрация с вымышленными данными сохраняется в этом браузере. Подключения к настоящему Discord нет.",
    reset: "Сбросить демо", resetPrompt: "Восстановить исходный демо-сервер и удалить внесённые изменения?", resetConfirm: "Подтвердить сброс", cancel: "Отмена",
    storageError: "Не удалось сохранить данные. Изменения доступны до закрытия окна.",
    recovered: "Сохранённые данные не удалось прочитать. Восстановлен исходный демо-сервер.",
  },
  en: {
    kicker: "Discord bot", title: "Discord Guard",
    description: "Keep your server welcoming with clear moderation tools. Send a message or report as a member, then switch to the administrator role: review reports, issue a warning or apply a timeout. Every action is recorded in a shared log.",
    features: ["Member reports", "Warnings and timeouts", "Message moderation", "Activity log"],
    roleLabel: "Demo mode", member: "Member", admin: "Administrator",
    notice: "This local demo uses fictional data saved in this browser. There is no connection to real Discord.",
    reset: "Reset demo", resetPrompt: "Restore the original demo server and discard your changes?", resetConfirm: "Confirm reset", cancel: "Cancel",
    storageError: "Could not save the data. Changes remain available until you close the window.",
    recovered: "The saved data could not be read. The original demo server has been restored.",
  },
  de: {
    kicker: "Discord-Bot", title: "Discord Guard",
    description: "Übersichtliche Moderation für eine freundliche Community. Senden Sie als Mitglied eine Nachricht oder Meldung und wechseln Sie dann zur Administratorrolle: Prüfen Sie Meldungen, erteilen Sie Verwarnungen oder verhängen Sie Timeouts. Alle Aktionen werden gemeinsam protokolliert.",
    features: ["Meldungen von Mitgliedern", "Verwarnungen und Timeouts", "Nachrichtenmoderation", "Aktionsprotokoll"],
    roleLabel: "Demomodus", member: "Mitglied", admin: "Administrator",
    notice: "Diese lokale Demo verwendet fiktive Daten, die in diesem Browser gespeichert werden. Es besteht keine Verbindung zum echten Discord.",
    reset: "Demo zurücksetzen", resetPrompt: "Ursprünglichen Demoserver wiederherstellen und Ihre Änderungen verwerfen?", resetConfirm: "Zurücksetzen bestätigen", cancel: "Abbrechen",
    storageError: "Die Daten konnten nicht gespeichert werden. Änderungen bleiben verfügbar, bis Sie das Fenster schließen.",
    recovered: "Die gespeicherten Daten konnten nicht gelesen werden. Der ursprüngliche Demoserver wurde wiederhergestellt.",
  },
  fr: {
    kicker: "Bot Discord", title: "Discord Guard",
    description: "Des outils de modération clairs pour un serveur accueillant. Envoyez un message ou un signalement en tant que membre, puis passez au rôle d’administrateur : examinez les signalements, donnez un avertissement ou appliquez une exclusion temporaire. Chaque action figure dans un journal commun.",
    features: ["Signalements des membres", "Avertissements et exclusions", "Modération des messages", "Journal des actions"],
    roleLabel: "Mode de démonstration", member: "Membre", admin: "Administrateur",
    notice: "Cette démonstration locale utilise des données fictives enregistrées dans ce navigateur. Aucune connexion au véritable service Discord.",
    reset: "Réinitialiser la démo", resetPrompt: "Restaurer le serveur de démonstration d’origine et supprimer vos modifications ?", resetConfirm: "Confirmer la réinitialisation", cancel: "Annuler",
    storageError: "Impossible d’enregistrer les données. Les modifications restent disponibles jusqu’à la fermeture de la fenêtre.",
    recovered: "Les données enregistrées n’ont pas pu être lues. Le serveur de démonstration d’origine a été restauré.",
  },
  it: {
    kicker: "Bot Discord", title: "Discord Guard",
    description: "Strumenti di moderazione chiari per un server accogliente. Invia un messaggio o una segnalazione come membro, poi passa al ruolo di amministratore: esamina le segnalazioni, invia un avvertimento o applica un timeout. Ogni azione viene salvata in un registro condiviso.",
    features: ["Segnalazioni dei membri", "Avvertimenti e timeout", "Moderazione dei messaggi", "Registro delle attività"],
    roleLabel: "Modalità demo", member: "Membro", admin: "Amministratore",
    notice: "Questa demo locale usa dati fittizi salvati in questo browser. Non è collegata al vero servizio Discord.",
    reset: "Ripristina demo", resetPrompt: "Ripristinare il server demo originale ed eliminare le tue modifiche?", resetConfirm: "Conferma ripristino", cancel: "Annulla",
    storageError: "Impossibile salvare i dati. Le modifiche restano disponibili fino alla chiusura della finestra.",
    recovered: "Impossibile leggere i dati salvati. Il server demo originale è stato ripristinato.",
  },
  pl: {
    kicker: "Bot Discord", title: "Discord Guard",
    description: "Przejrzysta moderacja dla przyjaznego serwera. Wyślij wiadomość lub zgłoszenie jako członek, a następnie przełącz się na administratora: rozpatrz zgłoszenia, udziel ostrzeżenia lub zastosuj czasowe wyciszenie. Wszystkie działania trafiają do wspólnego dziennika.",
    features: ["Zgłoszenia członków", "Ostrzeżenia i wyciszenia", "Moderacja wiadomości", "Dziennik działań"],
    roleLabel: "Tryb demonstracyjny", member: "Członek", admin: "Administrator",
    notice: "To lokalne demo używa fikcyjnych danych zapisanych w tej przeglądarce. Nie ma połączenia z prawdziwym Discordem.",
    reset: "Zresetuj demo", resetPrompt: "Przywrócić początkowy serwer demonstracyjny i usunąć wprowadzone zmiany?", resetConfirm: "Potwierdź reset", cancel: "Anuluj",
    storageError: "Nie udało się zapisać danych. Zmiany będą dostępne do zamknięcia okna.",
    recovered: "Nie udało się odczytać zapisanych danych. Przywrócono początkowy serwer demonstracyjny.",
  },
  cz: {
    kicker: "Discord bot", title: "Discord Guard",
    description: "Přehledné moderování pro přátelský server. Pošlete zprávu nebo hlášení jako člen a pak se přepněte do role správce: posuďte hlášení, udělte varování nebo dočasné ztlumení. Každá akce se zaznamená do společného protokolu.",
    features: ["Hlášení členů", "Varování a dočasné ztlumení", "Moderování zpráv", "Protokol akcí"],
    roleLabel: "Režim ukázky", member: "Člen", admin: "Správce",
    notice: "Tato místní ukázka používá smyšlená data uložená v tomto prohlížeči. Není připojena ke skutečnému Discordu.",
    reset: "Obnovit ukázku", resetPrompt: "Obnovit původní ukázkový server a zahodit provedené změny?", resetConfirm: "Potvrdit obnovení", cancel: "Zrušit",
    storageError: "Data se nepodařilo uložit. Změny zůstanou dostupné do zavření okna.",
    recovered: "Uložená data se nepodařilo přečíst. Původní ukázkový server byl obnoven.",
  },
  sk: {
    kicker: "Discord bot", title: "Discord Guard",
    description: "Prehľadné moderovanie pre priateľský server. Pošlite správu alebo hlásenie ako člen a potom sa prepnite do roly správcu: posúďte hlásenia, udeľte upozornenie alebo dočasné stíšenie. Každá akcia sa zaznamená do spoločného protokolu.",
    features: ["Hlásenia členov", "Upozornenia a dočasné stíšenie", "Moderovanie správ", "Protokol akcií"],
    roleLabel: "Režim ukážky", member: "Člen", admin: "Správca",
    notice: "Táto miestna ukážka používa vymyslené údaje uložené v tomto prehliadači. Nie je pripojená k skutočnému Discordu.",
    reset: "Obnoviť ukážku", resetPrompt: "Obnoviť pôvodný ukážkový server a zahodiť vykonané zmeny?", resetConfirm: "Potvrdiť obnovenie", cancel: "Zrušiť",
    storageError: "Údaje sa nepodarilo uložiť. Zmeny zostanú dostupné do zatvorenia okna.",
    recovered: "Uložené údaje sa nepodarilo prečítať. Pôvodný ukážkový server bol obnovený.",
  },
};

export function getDiscordGuardCopy(lang: string): DiscordGuardCopy {
  return copy[lang as PreviewLanguage] ?? copy.en;
}
