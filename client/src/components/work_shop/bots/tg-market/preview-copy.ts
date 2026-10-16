type PreviewLanguage = "ru" | "en" | "de" | "fr" | "it" | "pl" | "cz" | "sk";

type TgMarketPreviewCopy = {
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

const copy: Record<PreviewLanguage, TgMarketPreviewCopy> = {
  ru: {
    kicker: "Telegram-бот",
    description: "Магазин прямо в мессенджере: каталог, корзина и оформление заказа. Переключитесь на администратора, чтобы добавить товар, удалить его или изменить статус доставки.",
    features: ["Каталог и корзина", "Статусы заказов", "Управление товарами", "Импорт CSV / JSON"],
    demoMode: "Режим демонстрации",
    customer: "Покупатель",
    admin: "Администратор",
    demoNote: "Интерактивная демонстрация. Товары и заказы сохраняются в этом браузере.",
    storageError: "Не удалось сохранить данные. Изменения доступны до закрытия окна.",
    resetQuestion: "Восстановить исходные товары и очистить демо-заказы?",
    confirmReset: "Подтвердить сброс",
    cancel: "Отмена",
    reset: "Сбросить демо",
  },
  en: {
    kicker: "Telegram bot",
    description: "A shop right in your messenger: a catalog, cart and checkout. Switch to the admin role to add or remove products and update delivery status.",
    features: ["Catalog and cart", "Order status", "Product management", "CSV / JSON import"],
    demoMode: "Demo mode",
    customer: "Customer",
    admin: "Administrator",
    demoNote: "Interactive demo. Products and orders are saved in this browser.",
    storageError: "Could not save the data. Changes remain available until you close the window.",
    resetQuestion: "Restore the original products and clear demo orders?",
    confirmReset: "Confirm reset",
    cancel: "Cancel",
    reset: "Reset demo",
  },
  de: {
    kicker: "Telegram-Bot",
    description: "Ein Shop direkt im Messenger: Katalog, Warenkorb und Bestellabschluss. Wechseln Sie zur Administratorrolle, um Produkte hinzuzufügen oder zu entfernen und den Lieferstatus zu ändern.",
    features: ["Katalog und Warenkorb", "Bestellstatus", "Produktverwaltung", "CSV-/JSON-Import"],
    demoMode: "Demomodus",
    customer: "Kunde",
    admin: "Administrator",
    demoNote: "Interaktive Demo. Produkte und Bestellungen werden in diesem Browser gespeichert.",
    storageError: "Die Daten konnten nicht gespeichert werden. Änderungen bleiben verfügbar, bis Sie das Fenster schließen.",
    resetQuestion: "Ursprüngliche Produkte wiederherstellen und Demobestellungen löschen?",
    confirmReset: "Zurücksetzen bestätigen",
    cancel: "Abbrechen",
    reset: "Demo zurücksetzen",
  },
  fr: {
    kicker: "Bot Telegram",
    description: "Une boutique dans votre messagerie : catalogue, panier et commande. Passez en mode administrateur pour ajouter ou supprimer des produits et modifier le statut de livraison.",
    features: ["Catalogue et panier", "Statut des commandes", "Gestion des produits", "Import CSV / JSON"],
    demoMode: "Mode de démonstration",
    customer: "Client",
    admin: "Administrateur",
    demoNote: "Démonstration interactive. Les produits et les commandes sont enregistrés dans ce navigateur.",
    storageError: "Impossible d’enregistrer les données. Les modifications restent disponibles jusqu’à la fermeture de la fenêtre.",
    resetQuestion: "Restaurer les produits d’origine et effacer les commandes de démonstration ?",
    confirmReset: "Confirmer la réinitialisation",
    cancel: "Annuler",
    reset: "Réinitialiser la démo",
  },
  it: {
    kicker: "Bot Telegram",
    description: "Un negozio direttamente in chat: catalogo, carrello e acquisto. Passa al ruolo di amministratore per aggiungere o rimuovere prodotti e modificare lo stato della consegna.",
    features: ["Catalogo e carrello", "Stato degli ordini", "Gestione prodotti", "Importazione CSV / JSON"],
    demoMode: "Modalità demo",
    customer: "Cliente",
    admin: "Amministratore",
    demoNote: "Demo interattiva. Prodotti e ordini vengono salvati in questo browser.",
    storageError: "Impossibile salvare i dati. Le modifiche restano disponibili fino alla chiusura della finestra.",
    resetQuestion: "Ripristinare i prodotti originali ed eliminare gli ordini demo?",
    confirmReset: "Conferma ripristino",
    cancel: "Annulla",
    reset: "Ripristina demo",
  },
  pl: {
    kicker: "Bot Telegram",
    description: "Sklep prosto w komunikatorze: katalog, koszyk i składanie zamówień. Przełącz się na administratora, aby dodawać lub usuwać produkty i zmieniać status dostawy.",
    features: ["Katalog i koszyk", "Status zamówień", "Zarządzanie produktami", "Import CSV / JSON"],
    demoMode: "Tryb demonstracyjny",
    customer: "Klient",
    admin: "Administrator",
    demoNote: "Interaktywna demonstracja. Produkty i zamówienia są zapisywane w tej przeglądarce.",
    storageError: "Nie udało się zapisać danych. Zmiany będą dostępne do zamknięcia okna.",
    resetQuestion: "Przywrócić początkowe produkty i usunąć zamówienia demonstracyjne?",
    confirmReset: "Potwierdź reset",
    cancel: "Anuluj",
    reset: "Zresetuj demo",
  },
  cz: {
    kicker: "Telegram bot",
    description: "Obchod přímo v chatu: katalog, košík a objednávky. Přepněte se do role správce a přidávejte či odebírejte produkty nebo měňte stav doručení.",
    features: ["Katalog a košík", "Stav objednávek", "Správa produktů", "Import CSV / JSON"],
    demoMode: "Režim ukázky",
    customer: "Zákazník",
    admin: "Správce",
    demoNote: "Interaktivní ukázka. Produkty a objednávky se ukládají v tomto prohlížeči.",
    storageError: "Data se nepodařilo uložit. Změny zůstanou dostupné do zavření okna.",
    resetQuestion: "Obnovit původní produkty a smazat ukázkové objednávky?",
    confirmReset: "Potvrdit obnovení",
    cancel: "Zrušit",
    reset: "Obnovit ukázku",
  },
  sk: {
    kicker: "Telegram bot",
    description: "Obchod priamo v chate: katalóg, košík a objednávky. Prepnite sa do roly správcu a pridávajte či odstraňujte produkty alebo meňte stav doručenia.",
    features: ["Katalóg a košík", "Stav objednávok", "Správa produktov", "Import CSV / JSON"],
    demoMode: "Režim ukážky",
    customer: "Zákazník",
    admin: "Správca",
    demoNote: "Interaktívna ukážka. Produkty a objednávky sa ukladajú v tomto prehliadači.",
    storageError: "Údaje sa nepodarilo uložiť. Zmeny zostanú dostupné do zatvorenia okna.",
    resetQuestion: "Obnoviť pôvodné produkty a vymazať ukážkové objednávky?",
    confirmReset: "Potvrdiť obnovenie",
    cancel: "Zrušiť",
    reset: "Obnoviť ukážku",
  },
};

export function getTgMarketPreviewCopy(lang: string): TgMarketPreviewCopy {
  return copy[lang as PreviewLanguage] ?? copy.en;
}
