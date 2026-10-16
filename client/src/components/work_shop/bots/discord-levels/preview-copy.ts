type Language = "ru" | "en" | "de" | "fr" | "it" | "pl" | "cz" | "sk";
type Copy = { kicker: string; description: string; features: readonly string[]; roleLabel: string; member: string; admin: string; notice: string; reset: string; resetPrompt: string; resetConfirm: string; cancel: string; storageError: string; recovered: string };
const copies: Record<Language, Copy> = {
  ru: {
    kicker: "Discord-бот",
    description: "Превратите общение на сервере в прогресс. Участники получают опыт, повышают уровень и открывают роли. Администратор управляет наградами и начислением XP прямо через команды бота.",
    features: ["XP за общение", "Уровни и рейтинг", "Автоматические роли", "Защита от повторов"],
    roleLabel: "Режим демонстрации", member: "Участник", admin: "Администратор",
    notice: "Демо на русском языке использует вымышленные данные и сохраняет изменения в этом браузере. Подключения к Discord нет.",
    reset: "Начать демо заново", resetPrompt: "Восстановить исходный сервер и удалить все изменения демо?", resetConfirm: "Восстановить демо", cancel: "Отмена", storageError: "Сохранение недоступно. Изменения останутся только до закрытия окна.", recovered: "Сохранённые данные повреждены или устарели. Восстановлено исходное демо.",
  },
  en: {
    kicker: "Discord bot",
    description: "Turn server conversations into progress. Members earn experience, level up and unlock roles. Administrators manage rewards and XP directly through bot commands.",
    features: ["XP for conversations", "Levels and leaderboard", "Automatic roles", "Duplicate protection"],
    roleLabel: "Demo mode", member: "Member", admin: "Administrator",
    notice: "This Russian-language demo uses fictional data and saves changes in this browser. It is not connected to Discord.",
    reset: "Restart demo", resetPrompt: "Restore the original server and discard all demo changes?", resetConfirm: "Restore demo", cancel: "Cancel", storageError: "Storage is unavailable. Changes will last only until you close the window.", recovered: "Saved data was invalid or outdated. The original demo has been restored.",
  },
  de: {
    kicker: "Discord-Bot",
    description: "Machen Sie Gespräche auf Ihrem Server zu Fortschritt. Mitglieder sammeln Erfahrung, steigen im Level auf und erhalten Rollen. Administratoren verwalten Belohnungen und XP direkt über Bot-Befehle.",
    features: ["XP für Gespräche", "Level und Rangliste", "Automatische Rollen", "Schutz vor Wiederholungen"],
    roleLabel: "Demomodus", member: "Mitglied", admin: "Administrator",
    notice: "Diese russischsprachige Demo verwendet fiktive Daten und speichert Änderungen in diesem Browser. Es besteht keine Verbindung zu Discord.",
    reset: "Demo neu starten", resetPrompt: "Den ursprünglichen Server wiederherstellen und alle Demoänderungen verwerfen?", resetConfirm: "Demo wiederherstellen", cancel: "Abbrechen", storageError: "Speichern ist nicht verfügbar. Änderungen bleiben nur bis zum Schließen des Fensters erhalten.", recovered: "Gespeicherte Daten waren ungültig oder veraltet. Die ursprüngliche Demo wurde wiederhergestellt.",
  },
  fr: {
    kicker: "Bot Discord",
    description: "Transformez les échanges du serveur en progression. Les membres gagnent de l’expérience, montent de niveau et débloquent des rôles. Les administrateurs gèrent les récompenses et les XP avec les commandes du bot.",
    features: ["XP pour les échanges", "Niveaux et classement", "Rôles automatiques", "Protection contre les répétitions"],
    roleLabel: "Mode de démonstration", member: "Membre", admin: "Administrateur",
    notice: "Cette démo en russe utilise des données fictives et enregistre les modifications dans ce navigateur. Elle n’est pas connectée à Discord.",
    reset: "Recommencer la démo", resetPrompt: "Restaurer le serveur initial et supprimer toutes les modifications de la démo ?", resetConfirm: "Restaurer la démo", cancel: "Annuler", storageError: "L’enregistrement est indisponible. Les modifications seront perdues à la fermeture de la fenêtre.", recovered: "Les données enregistrées étaient invalides ou obsolètes. La démo initiale a été restaurée.",
  },
  it: {
    kicker: "Bot Discord",
    description: "Trasforma le conversazioni del server in progressi. I membri guadagnano esperienza, salgono di livello e sbloccano ruoli. Gli amministratori gestiscono ricompense e XP tramite i comandi del bot.",
    features: ["XP per le conversazioni", "Livelli e classifica", "Ruoli automatici", "Protezione dalle ripetizioni"],
    roleLabel: "Modalità demo", member: "Membro", admin: "Amministratore",
    notice: "Questa demo in russo usa dati fittizi e salva le modifiche in questo browser. Non è collegata a Discord.",
    reset: "Ricomincia la demo", resetPrompt: "Ripristinare il server iniziale ed eliminare tutte le modifiche della demo?", resetConfirm: "Ripristina demo", cancel: "Annulla", storageError: "Il salvataggio non è disponibile. Le modifiche dureranno solo fino alla chiusura della finestra.", recovered: "I dati salvati erano non validi o obsoleti. La demo iniziale è stata ripristinata.",
  },
  pl: {
    kicker: "Bot Discord",
    description: "Zamień rozmowy na serwerze w postępy. Członkowie zdobywają doświadczenie, awansują i odblokowują role. Administrator zarządza nagrodami i XP bezpośrednio za pomocą poleceń bota.",
    features: ["XP za rozmowy", "Poziomy i ranking", "Automatyczne role", "Ochrona przed powtórzeniami"],
    roleLabel: "Tryb demonstracji", member: "Członek", admin: "Administrator",
    notice: "To demo w języku rosyjskim używa fikcyjnych danych i zapisuje zmiany w tej przeglądarce. Nie jest połączone z Discordem.",
    reset: "Rozpocznij demo od nowa", resetPrompt: "Przywrócić początkowy serwer i usunąć wszystkie zmiany w demo?", resetConfirm: "Przywróć demo", cancel: "Anuluj", storageError: "Zapis jest niedostępny. Zmiany pozostaną tylko do zamknięcia okna.", recovered: "Zapisane dane były nieprawidłowe lub nieaktualne. Przywrócono początkowe demo.",
  },
  cz: {
    kicker: "Discord bot",
    description: "Proměňte konverzace na serveru v postup. Členové získávají zkušenosti, zvyšují úroveň a odemykají role. Správce řídí odměny a XP přímo pomocí příkazů bota.",
    features: ["XP za konverzace", "Úrovně a žebříček", "Automatické role", "Ochrana před opakováním"],
    roleLabel: "Režim ukázky", member: "Člen", admin: "Správce",
    notice: "Tato ukázka v ruštině používá smyšlená data a ukládá změny v tomto prohlížeči. Není připojena k Discordu.",
    reset: "Spustit ukázku znovu", resetPrompt: "Obnovit původní server a zahodit všechny změny v ukázce?", resetConfirm: "Obnovit ukázku", cancel: "Zrušit", storageError: "Ukládání není dostupné. Změny zůstanou pouze do zavření okna.", recovered: "Uložená data byla neplatná nebo zastaralá. Původní ukázka byla obnovena.",
  },
  sk: {
    kicker: "Discord bot",
    description: "Premeňte rozhovory na serveri na pokrok. Členovia získavajú skúsenosti, zvyšujú úroveň a odomykajú roly. Správca riadi odmeny a XP priamo pomocou príkazov bota.",
    features: ["XP za rozhovory", "Úrovne a rebríček", "Automatické roly", "Ochrana pred opakovaním"],
    roleLabel: "Režim ukážky", member: "Člen", admin: "Správca",
    notice: "Táto ukážka v ruštine používa vymyslené údaje a ukladá zmeny v tomto prehliadači. Nie je pripojená k Discordu.",
    reset: "Spustiť ukážku znova", resetPrompt: "Obnoviť pôvodný server a odstrániť všetky zmeny v ukážke?", resetConfirm: "Obnoviť ukážku", cancel: "Zrušiť", storageError: "Ukladanie nie je dostupné. Zmeny zostanú len do zatvorenia okna.", recovered: "Uložené údaje boli neplatné alebo zastarané. Pôvodná ukážka bola obnovená.",
  },
};
export function getDiscordLevelsCopy(lang: string): Copy { return copies[lang as Language] ?? copies.en; }
