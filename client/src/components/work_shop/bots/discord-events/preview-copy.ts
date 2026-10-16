type Language = "ru" | "en" | "de" | "fr" | "it" | "pl" | "cz" | "sk";
type Copy = { kicker: string; title: string; description: string; features: string[]; roleLabel: string; member: string; admin: string; notice: string; reset: string; resetPrompt: string; resetConfirm: string; cancel: string; storageError: string; recovered: string };
const copies: Record<Language, Copy> = {
  ru: {
    kicker: "Discord-бот", title: "Discord Events", description: "Собирайте сообщество на встречи прямо в Discord. Бот публикует события, принимает ответы участников и помогает выбрать удобное время. Администратор управляет расписанием и видит, кто придёт.",
    features: ["Запись и лимит мест", "Голосование за время", "Команды в чате", "Управление встречами"], roleLabel: "Роль в демонстрации", member: "Участник", admin: "Администратор",
    notice: "Локальная демонстрация с вымышленными данными. Изменения сохраняются в этом браузере; подключения к Discord нет.", reset: "Сбросить демо", resetPrompt: "Восстановить исходные встречи и удалить ваши изменения?", resetConfirm: "Да, сбросить", cancel: "Отмена", storageError: "Не удалось сохранить данные. Изменения доступны до закрытия окна.", recovered: "Сохранённые данные повреждены. Восстановлены исходные встречи.",
  },
  en: {
    kicker: "Discord bot", title: "Discord Events", description: "Bring your community together right in Discord. The bot publishes events, collects member responses and helps choose a convenient time. Administrators manage the schedule and see who is coming.",
    features: ["RSVP and capacity limits", "Time polls", "Chat commands", "Event management"], roleLabel: "Demo role", member: "Member", admin: "Administrator",
    notice: "A local demo with fictional data. Changes are saved in this browser; there is no Discord connection.", reset: "Reset demo", resetPrompt: "Restore the original events and discard your changes?", resetConfirm: "Yes, reset", cancel: "Cancel", storageError: "Data could not be saved. Changes remain available until you close the window.", recovered: "Saved data was invalid. The original events have been restored.",
  },
  de: {
    kicker: "Discord-Bot", title: "Discord Events", description: "Organisieren Sie gemeinsame Treffen direkt in Discord. Der Bot veröffentlicht Veranstaltungen, sammelt Rückmeldungen und hilft bei der Terminwahl. Administratoren verwalten den Zeitplan und sehen, wer teilnimmt.",
    features: ["Zusagen und Platzlimits", "Terminabstimmungen", "Chat-Befehle", "Veranstaltungsverwaltung"], roleLabel: "Rolle in der Demo", member: "Mitglied", admin: "Administrator",
    notice: "Lokale Demo mit fiktiven Daten. Änderungen werden in diesem Browser gespeichert; es besteht keine Verbindung zu Discord.", reset: "Demo zurücksetzen", resetPrompt: "Ursprüngliche Veranstaltungen wiederherstellen und Änderungen verwerfen?", resetConfirm: "Ja, zurücksetzen", cancel: "Abbrechen", storageError: "Daten konnten nicht gespeichert werden. Änderungen bleiben bis zum Schließen des Fensters verfügbar.", recovered: "Gespeicherte Daten waren ungültig. Die ursprünglichen Veranstaltungen wurden wiederhergestellt.",
  },
  fr: {
    kicker: "Bot Discord", title: "Discord Events", description: "Réunissez votre communauté directement dans Discord. Le bot publie les événements, recueille les réponses et aide à choisir un horaire. Les administrateurs gèrent le calendrier et consultent les participants.",
    features: ["Inscriptions et places limitées", "Sondages horaires", "Commandes dans le chat", "Gestion des événements"], roleLabel: "Rôle dans la démo", member: "Membre", admin: "Administrateur",
    notice: "Démonstration locale avec des données fictives. Les modifications sont enregistrées dans ce navigateur, sans connexion à Discord.", reset: "Réinitialiser la démo", resetPrompt: "Restaurer les événements d’origine et supprimer vos modifications ?", resetConfirm: "Oui, réinitialiser", cancel: "Annuler", storageError: "Impossible d’enregistrer les données. Les modifications restent disponibles jusqu’à la fermeture de la fenêtre.", recovered: "Les données enregistrées étaient invalides. Les événements d’origine ont été restaurés.",
  },
  it: {
    kicker: "Bot Discord", title: "Discord Events", description: "Riunisci la tua community direttamente su Discord. Il bot pubblica eventi, raccoglie le risposte e aiuta a scegliere l’orario. Gli amministratori gestiscono il calendario e vedono chi parteciperà.",
    features: ["Iscrizioni e limite posti", "Sondaggi sugli orari", "Comandi in chat", "Gestione eventi"], roleLabel: "Ruolo nella demo", member: "Membro", admin: "Amministratore",
    notice: "Demo locale con dati fittizi. Le modifiche sono salvate in questo browser, senza connessione a Discord.", reset: "Ripristina demo", resetPrompt: "Ripristinare gli eventi iniziali ed eliminare le modifiche?", resetConfirm: "Sì, ripristina", cancel: "Annulla", storageError: "Impossibile salvare i dati. Le modifiche restano disponibili fino alla chiusura della finestra.", recovered: "I dati salvati non erano validi. Gli eventi iniziali sono stati ripristinati.",
  },
  pl: {
    kicker: "Bot Discord", title: "Discord Events", description: "Organizuj spotkania społeczności bezpośrednio na Discordzie. Bot publikuje wydarzenia, zbiera odpowiedzi i pomaga wybrać dogodny termin. Administratorzy zarządzają kalendarzem i widzą, kto przyjdzie.",
    features: ["Zapisy i limit miejsc", "Ankiety terminów", "Komendy na czacie", "Zarządzanie wydarzeniami"], roleLabel: "Rola w demonstracji", member: "Członek", admin: "Administrator",
    notice: "Lokalne demo z fikcyjnymi danymi. Zmiany są zapisywane w tej przeglądarce, bez połączenia z Discordem.", reset: "Zresetuj demo", resetPrompt: "Przywrócić początkowe wydarzenia i usunąć zmiany?", resetConfirm: "Tak, zresetuj", cancel: "Anuluj", storageError: "Nie udało się zapisać danych. Zmiany będą dostępne do zamknięcia okna.", recovered: "Zapisane dane były nieprawidłowe. Przywrócono początkowe wydarzenia.",
  },
  cz: {
    kicker: "Discord bot", title: "Discord Events", description: "Pořádejte komunitní setkání přímo na Discordu. Bot zveřejňuje události, sbírá odpovědi a pomáhá zvolit vhodný čas. Správci řídí kalendář a vidí, kdo dorazí.",
    features: ["Přihlášky a kapacita", "Hlasování o termínu", "Příkazy v chatu", "Správa událostí"], roleLabel: "Role v ukázce", member: "Člen", admin: "Správce",
    notice: "Místní ukázka se smyšlenými daty. Změny se ukládají v tomto prohlížeči bez připojení k Discordu.", reset: "Obnovit ukázku", resetPrompt: "Obnovit původní události a zahodit změny?", resetConfirm: "Ano, obnovit", cancel: "Zrušit", storageError: "Data se nepodařilo uložit. Změny zůstanou dostupné do zavření okna.", recovered: "Uložená data byla neplatná. Původní události byly obnoveny.",
  },
  sk: {
    kicker: "Discord bot", title: "Discord Events", description: "Organizujte komunitné stretnutia priamo na Discorde. Bot zverejňuje udalosti, zbiera odpovede a pomáha vybrať vhodný čas. Správcovia riadia kalendár a vidia, kto príde.",
    features: ["Prihlášky a kapacita", "Hlasovanie o termíne", "Príkazy v chate", "Správa udalostí"], roleLabel: "Rola v ukážke", member: "Člen", admin: "Správca",
    notice: "Miestna ukážka s vymyslenými údajmi. Zmeny sa ukladajú v tomto prehliadači bez pripojenia k Discordu.", reset: "Obnoviť ukážku", resetPrompt: "Obnoviť pôvodné udalosti a zahodiť zmeny?", resetConfirm: "Áno, obnoviť", cancel: "Zrušiť", storageError: "Údaje sa nepodarilo uložiť. Zmeny zostanú dostupné do zatvorenia okna.", recovered: "Uložené údaje boli neplatné. Pôvodné udalosti boli obnovené.",
  },
};
export function getDiscordEventsCopy(lang: string) { return copies[lang as Language] ?? copies.en; }
