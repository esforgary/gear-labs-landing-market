type PreviewLanguage = "ru" | "en" | "de" | "fr" | "it" | "pl" | "cz" | "sk";

type TgBookingPreviewCopy = {
  kicker: string;
  description: string;
  features: readonly string[];
  demoMode: string;
  customer: string;
  admin: string;
  demoNote: string;
  storageError: string;
  restoreNotice: string;
  resetQuestion: string;
  confirmReset: string;
  cancel: string;
  reset: string;
};

const copy: Record<PreviewLanguage, TgBookingPreviewCopy> = {
  ru: {
    kicker: "Telegram-бот",
    description: "Запись на услуги прямо в мессенджере: выберите услугу, специалиста и свободное время. Переносите и отменяйте записи, а в роли администратора подтверждайте их и управляйте доступным временем.",
    features: ["Услуги и специалисты", "Свободное время", "Перенос и отмена", "Подтверждение записей"],
    demoMode: "Режим демонстрации",
    customer: "Клиент",
    admin: "Администратор",
    demoNote: "Локальная демонстрация с вымышленными данными. Изменения сохраняются только в этом браузере. Реальные записи не создаются.",
    storageError: "Не удалось сохранить данные. Изменения доступны до закрытия окна.",
    restoreNotice: "Не удалось восстановить сохранённые данные. Загружена исходная демонстрация.",
    resetQuestion: "Восстановить исходное расписание и очистить демо-записи?",
    confirmReset: "Подтвердить сброс",
    cancel: "Отмена",
    reset: "Сбросить демо",
  },
  en: {
    kicker: "Telegram bot",
    description: "Book services right in your messenger: choose a service, specialist and available time. Reschedule or cancel appointments, then switch to the admin role to confirm bookings and manage availability.",
    features: ["Services and specialists", "Available times", "Reschedule and cancel", "Booking confirmation"],
    demoMode: "Demo mode",
    customer: "Customer",
    admin: "Administrator",
    demoNote: "Local demo with fictional data. Changes are saved only in this browser. No real appointments are booked.",
    storageError: "Could not save the data. Changes remain available until you close the window.",
    restoreNotice: "Saved data could not be restored. The original demo has been loaded.",
    resetQuestion: "Restore the original schedule and clear demo appointments?",
    confirmReset: "Confirm reset",
    cancel: "Cancel",
    reset: "Reset demo",
  },
  de: {
    kicker: "Telegram-Bot",
    description: "Termine direkt im Messenger buchen: Wählen Sie eine Dienstleistung, eine Fachkraft und eine freie Uhrzeit. Verschieben oder stornieren Sie Termine und wechseln Sie zur Administratorrolle, um Buchungen zu bestätigen und Verfügbarkeiten zu verwalten.",
    features: ["Leistungen und Fachkräfte", "Freie Uhrzeiten", "Verschieben und stornieren", "Buchungen bestätigen"],
    demoMode: "Demomodus",
    customer: "Kunde",
    admin: "Administrator",
    demoNote: "Lokale Demo mit fiktiven Daten. Änderungen werden nur in diesem Browser gespeichert. Es werden keine echten Termine gebucht.",
    storageError: "Die Daten konnten nicht gespeichert werden. Änderungen bleiben verfügbar, bis Sie das Fenster schließen.",
    restoreNotice: "Gespeicherte Daten konnten nicht wiederhergestellt werden. Die ursprüngliche Demo wurde geladen.",
    resetQuestion: "Den ursprünglichen Terminplan wiederherstellen und Demotermine löschen?",
    confirmReset: "Zurücksetzen bestätigen",
    cancel: "Abbrechen",
    reset: "Demo zurücksetzen",
  },
  fr: {
    kicker: "Bot Telegram",
    description: "Prenez rendez-vous dans votre messagerie : choisissez une prestation, un spécialiste et un créneau disponible. Déplacez ou annulez vos rendez-vous, puis passez en mode administrateur pour les confirmer et gérer les disponibilités.",
    features: ["Prestations et spécialistes", "Créneaux disponibles", "Report et annulation", "Confirmation des rendez-vous"],
    demoMode: "Mode de démonstration",
    customer: "Client",
    admin: "Administrateur",
    demoNote: "Démonstration locale avec des données fictives. Les modifications sont enregistrées uniquement dans ce navigateur. Aucun rendez-vous réel n’est pris.",
    storageError: "Impossible d’enregistrer les données. Les modifications restent disponibles jusqu’à la fermeture de la fenêtre.",
    restoreNotice: "Impossible de restaurer les données enregistrées. La démonstration d’origine a été chargée.",
    resetQuestion: "Restaurer le planning d’origine et effacer les rendez-vous de démonstration ?",
    confirmReset: "Confirmer la réinitialisation",
    cancel: "Annuler",
    reset: "Réinitialiser la démo",
  },
  it: {
    kicker: "Bot Telegram",
    description: "Prenota un appuntamento direttamente in chat: scegli il servizio, lo specialista e un orario disponibile. Sposta o annulla gli appuntamenti, poi passa al ruolo di amministratore per confermarli e gestire le disponibilità.",
    features: ["Servizi e specialisti", "Orari disponibili", "Spostamento e annullamento", "Conferma appuntamenti"],
    demoMode: "Modalità demo",
    customer: "Cliente",
    admin: "Amministratore",
    demoNote: "Demo locale con dati fittizi. Le modifiche vengono salvate solo in questo browser. Non vengono prenotati appuntamenti reali.",
    storageError: "Impossibile salvare i dati. Le modifiche restano disponibili fino alla chiusura della finestra.",
    restoreNotice: "Impossibile ripristinare i dati salvati. È stata caricata la demo originale.",
    resetQuestion: "Ripristinare il calendario originale ed eliminare gli appuntamenti demo?",
    confirmReset: "Conferma ripristino",
    cancel: "Annulla",
    reset: "Ripristina demo",
  },
  pl: {
    kicker: "Bot Telegram",
    description: "Umawiaj wizyty prosto w komunikatorze: wybierz usługę, specjalistę i wolny termin. Przekładaj lub odwołuj wizyty, a w roli administratora potwierdzaj rezerwacje i zarządzaj dostępnością.",
    features: ["Usługi i specjaliści", "Wolne terminy", "Zmiana i odwołanie wizyty", "Potwierdzanie rezerwacji"],
    demoMode: "Tryb demonstracyjny",
    customer: "Klient",
    admin: "Administrator",
    demoNote: "Lokalna demonstracja z fikcyjnymi danymi. Zmiany są zapisywane tylko w tej przeglądarce. Nie są tworzone rzeczywiste rezerwacje.",
    storageError: "Nie udało się zapisać danych. Zmiany będą dostępne do zamknięcia okna.",
    restoreNotice: "Nie udało się przywrócić zapisanych danych. Wczytano początkową wersję demonstracji.",
    resetQuestion: "Przywrócić początkowy harmonogram i usunąć wizyty demonstracyjne?",
    confirmReset: "Potwierdź reset",
    cancel: "Anuluj",
    reset: "Zresetuj demo",
  },
  cz: {
    kicker: "Telegram bot",
    description: "Objednejte se na službu přímo v chatu: vyberte službu, specialistu a volný termín. Přesouvejte nebo rušte rezervace a v roli správce je potvrzujte a spravujte dostupné termíny.",
    features: ["Služby a specialisté", "Volné termíny", "Přesunutí a zrušení", "Potvrzování rezervací"],
    demoMode: "Režim ukázky",
    customer: "Zákazník",
    admin: "Správce",
    demoNote: "Místní ukázka se smyšlenými údaji. Změny se ukládají pouze v tomto prohlížeči. Nevytvářejí se žádné skutečné rezervace.",
    storageError: "Data se nepodařilo uložit. Změny zůstanou dostupné do zavření okna.",
    restoreNotice: "Uložená data se nepodařilo obnovit. Byla načtena původní ukázka.",
    resetQuestion: "Obnovit původní rozvrh a smazat ukázkové rezervace?",
    confirmReset: "Potvrdit obnovení",
    cancel: "Zrušit",
    reset: "Obnovit ukázku",
  },
  sk: {
    kicker: "Telegram bot",
    description: "Objednajte sa na službu priamo v chate: vyberte službu, špecialistu a voľný termín. Presúvajte alebo rušte rezervácie a v role správcu ich potvrdzujte a spravujte dostupné termíny.",
    features: ["Služby a špecialisti", "Voľné termíny", "Presunutie a zrušenie", "Potvrdzovanie rezervácií"],
    demoMode: "Režim ukážky",
    customer: "Zákazník",
    admin: "Správca",
    demoNote: "Lokálna ukážka s vymyslenými údajmi. Zmeny sa ukladajú iba v tomto prehliadači. Nevytvárajú sa žiadne skutočné rezervácie.",
    storageError: "Údaje sa nepodarilo uložiť. Zmeny zostanú dostupné do zatvorenia okna.",
    restoreNotice: "Uložené údaje sa nepodarilo obnoviť. Bola načítaná pôvodná ukážka.",
    resetQuestion: "Obnoviť pôvodný rozvrh a vymazať ukážkové rezervácie?",
    confirmReset: "Potvrdiť obnovenie",
    cancel: "Zrušiť",
    reset: "Obnoviť ukážku",
  },
};

export function getTgBookingPreviewCopy(lang: string): TgBookingPreviewCopy {
  return copy[lang as PreviewLanguage] ?? copy.en;
}
