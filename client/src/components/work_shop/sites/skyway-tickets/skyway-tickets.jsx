import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BellRing,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  Headphones,
  Luggage,
  Search,
  Users,
  X,
} from "lucide-react";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import planeImg from "./img/plane.svg";
import "./skyway-tickets.scss";

const copy = {
  ru: {
    brand: "SkyWay",
    nav: ["Маршруты", "Рейсы", "Помощь"],
    heroKicker: "Авиабилеты без суеты",
    heroTitle: "Найдите рейс и забронируйте билет за пару минут",
    heroText: "Сравните прямые и стыковочные рейсы, выберите багаж, места, страховку и сразу увидьте итоговую цену.",
    primary: "Найти билеты",
    secondary: "Горящие рейсы",
    searchTitle: "Поиск рейса",
    from: "Откуда",
    to: "Куда",
    date: "Дата",
    passengers: "Пассажиры",
    seats: "Мест",
    routeFrom: "Москва",
    routeTo: "Стамбул",
    routeDate: "24 июля",
    routePeople: "2 взрослых",
    flightsTitle: "Ближайшие рейсы",
    flightsText: "Выбирайте направление, дату, день недели, багаж и количество мест. Список прокручивается, чтобы не раздувать экран.",
    direct: "прямой",
    transfer: "стыковка",
    choose: "Выбрать",
    seatsLeft: "мест",
    modalTitle: "Бронирование билета",
    modalText: "Настройте маршрут и проверьте итоговую стоимость перед оплатой.",
    trip: "Тип поездки",
    roundTrip: "Туда-обратно",
    oneWay: "В одну сторону",
    classLabel: "Класс",
    economy: "Эконом",
    business: "Бизнес",
    luggageLabel: "Багаж",
    cabinBag: "Ручная кладь",
    fullBag: "Багаж 23 кг",
    insurance: "Страховка",
    insuranceYes: "Добавить",
    insuranceNo: "Без страховки",
    bookFor: "Забронировать за",
    close: "Закрыть",
    dealsTitle: "Маршруты, которые быстро разбирают",
    dealText: "Каждая строка показывает направление, дату, день недели, длительность, пересадки и остаток мест.",
    stepsTitle: "Как проходит заказ",
    steps: ["Выберите рейс", "Укажите детали", "Получите билет"],
    supportTitle: "Поддержка в пути",
    supportText: "Уведомления о посадке, изменении выхода и задержках приходят сразу после обновления авиакомпании.",
    footer: "Бронируйте перелеты, которые подходят вашему графику.",
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
  en: {
    brand: "SkyWay",
    nav: ["Routes", "Flights", "Help"],
    heroKicker: "Flights without friction",
    heroTitle: "Find a flight and book your ticket in minutes",
    heroText: "Compare direct and transfer flights, choose luggage, seats, insurance, and see the final price instantly.",
    primary: "Find tickets",
    secondary: "Hot flights",
    searchTitle: "Flight search",
    from: "From",
    to: "To",
    date: "Date",
    passengers: "Passengers",
    seats: "Seats",
    routeFrom: "London",
    routeTo: "Lisbon",
    routeDate: "24 July",
    routePeople: "2 adults",
    flightsTitle: "Nearest flights",
    flightsText: "Pick a route, date, weekday, luggage, and seats. The list scrolls without stretching the page.",
    direct: "direct",
    transfer: "transfer",
    choose: "Choose",
    seatsLeft: "seats",
    modalTitle: "Ticket booking",
    modalText: "Tune the route and check the final price before payment.",
    trip: "Trip",
    roundTrip: "Round trip",
    oneWay: "One way",
    classLabel: "Class",
    economy: "Economy",
    business: "Business",
    luggageLabel: "Luggage",
    cabinBag: "Cabin bag",
    fullBag: "23 kg bag",
    insurance: "Insurance",
    insuranceYes: "Add",
    insuranceNo: "No insurance",
    bookFor: "Book for",
    close: "Close",
    dealsTitle: "Routes that sell fast",
    dealText: "Each row shows direction, date, weekday, duration, stops, and remaining seats.",
    stepsTitle: "How booking works",
    steps: ["Choose flight", "Set details", "Get ticket"],
    supportTitle: "Travel support",
    supportText: "Boarding, gate, and delay updates arrive as soon as the airline changes them.",
    footer: "Book flights that fit your schedule.",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  de: {
    brand: "SkyWay",
    nav: ["Routen", "Fluge", "Hilfe"],
    heroKicker: "Fluge ohne Aufwand",
    heroTitle: "Finden und buchen Sie Ihren Flug in Minuten",
    heroText: "Vergleichen Sie Direkt- und Umsteigefluge, wahlen Sie Gepack, Sitze und Versicherung und sehen Sie sofort den Endpreis.",
    primary: "Tickets suchen",
    secondary: "Top-Fluge",
    searchTitle: "Flugsuche",
    from: "Von",
    to: "Nach",
    date: "Datum",
    passengers: "Passagiere",
    seats: "Sitze",
    routeFrom: "Berlin",
    routeTo: "Rom",
    routeDate: "24 Juli",
    routePeople: "2 Erwachsene",
    flightsTitle: "Nachste Fluge",
    flightsText: "Wahlen Sie Route, Datum, Wochentag, Gepack und Sitzanzahl. Die Liste scrollt ohne die Seite zu strecken.",
    direct: "direkt",
    transfer: "Umstieg",
    choose: "Wahlen",
    seatsLeft: "Sitze",
    modalTitle: "Ticketbuchung",
    modalText: "Passen Sie die Route an und prufen Sie den Endpreis vor der Zahlung.",
    trip: "Reiseart",
    roundTrip: "Hin und zuruck",
    oneWay: "Einfach",
    classLabel: "Klasse",
    economy: "Economy",
    business: "Business",
    luggageLabel: "Gepack",
    cabinBag: "Handgepack",
    fullBag: "Gepack 23 kg",
    insurance: "Versicherung",
    insuranceYes: "Hinzufugen",
    insuranceNo: "Ohne Versicherung",
    bookFor: "Buchen fur",
    close: "Schliessen",
    dealsTitle: "Routen, die schnell weg sind",
    dealText: "Jede Zeile zeigt Richtung, Datum, Wochentag, Dauer, Umstiege und freie Sitze.",
    stepsTitle: "So funktioniert die Buchung",
    steps: ["Flug wahlen", "Details festlegen", "Ticket erhalten"],
    supportTitle: "Support unterwegs",
    supportText: "Updates zu Boarding, Gate und Verspatung kommen sofort nach der Airline-Anderung.",
    footer: "Buchen Sie Fluge, die zu Ihrem Zeitplan passen.",
    days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
  },
  fr: {
    brand: "SkyWay",
    nav: ["Trajets", "Vols", "Aide"],
    heroKicker: "Billets d'avion simples",
    heroTitle: "Trouvez un vol et reservez en quelques minutes",
    heroText: "Comparez vols directs et correspondances, choisissez bagages, sieges et assurance, puis voyez le prix final.",
    primary: "Trouver",
    secondary: "Vols chauds",
    searchTitle: "Recherche de vol",
    from: "Depart",
    to: "Arrivee",
    date: "Date",
    passengers: "Passagers",
    seats: "Places",
    routeFrom: "Paris",
    routeTo: "Madrid",
    routeDate: "24 juillet",
    routePeople: "2 adultes",
    flightsTitle: "Prochains vols",
    flightsText: "Choisissez trajet, date, jour, bagage et places. La liste defile sans agrandir l'ecran.",
    direct: "direct",
    transfer: "escale",
    choose: "Choisir",
    seatsLeft: "places",
    modalTitle: "Reservation du billet",
    modalText: "Ajustez le trajet et verifiez le prix final avant le paiement.",
    trip: "Voyage",
    roundTrip: "Aller-retour",
    oneWay: "Aller simple",
    classLabel: "Classe",
    economy: "Economique",
    business: "Affaires",
    luggageLabel: "Bagage",
    cabinBag: "Cabine",
    fullBag: "Bagage 23 kg",
    insurance: "Assurance",
    insuranceYes: "Ajouter",
    insuranceNo: "Sans assurance",
    bookFor: "Reserver pour",
    close: "Fermer",
    dealsTitle: "Trajets qui partent vite",
    dealText: "Chaque ligne affiche trajet, date, jour, duree, escales et places restantes.",
    stepsTitle: "Comment reserver",
    steps: ["Choisir le vol", "Regler les details", "Recevoir le billet"],
    supportTitle: "Aide en voyage",
    supportText: "Les changements d'embarquement, porte et retard arrivent des que la compagnie les publie.",
    footer: "Reservez des vols adaptes a votre planning.",
    days: ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"],
  },
  it: {
    brand: "SkyWay",
    nav: ["Rotte", "Voli", "Aiuto"],
    heroKicker: "Voli senza stress",
    heroTitle: "Trova un volo e prenota il biglietto in pochi minuti",
    heroText: "Confronta voli diretti e scali, scegli bagagli, posti e assicurazione e vedi subito il prezzo finale.",
    primary: "Cerca biglietti",
    secondary: "Voli caldi",
    searchTitle: "Ricerca voli",
    from: "Da",
    to: "A",
    date: "Data",
    passengers: "Passeggeri",
    seats: "Posti",
    routeFrom: "Milano",
    routeTo: "Atene",
    routeDate: "24 luglio",
    routePeople: "2 adulti",
    flightsTitle: "Prossimi voli",
    flightsText: "Scegli rotta, data, giorno, bagaglio e posti. La lista scorre senza allungare lo schermo.",
    direct: "diretto",
    transfer: "scalo",
    choose: "Scegli",
    seatsLeft: "posti",
    modalTitle: "Prenotazione biglietto",
    modalText: "Regola il viaggio e controlla il prezzo finale prima del pagamento.",
    trip: "Viaggio",
    roundTrip: "Andata e ritorno",
    oneWay: "Solo andata",
    classLabel: "Classe",
    economy: "Economy",
    business: "Business",
    luggageLabel: "Bagaglio",
    cabinBag: "Bagaglio a mano",
    fullBag: "Bagaglio 23 kg",
    insurance: "Assicurazione",
    insuranceYes: "Aggiungi",
    insuranceNo: "Senza assicurazione",
    bookFor: "Prenota per",
    close: "Chiudi",
    dealsTitle: "Rotte che finiscono presto",
    dealText: "Ogni riga mostra direzione, data, giorno, durata, scali e posti rimasti.",
    stepsTitle: "Come si prenota",
    steps: ["Scegli il volo", "Imposta dettagli", "Ricevi biglietto"],
    supportTitle: "Supporto viaggio",
    supportText: "Notifiche su imbarco, gate e ritardi arrivano appena la compagnia aggiorna.",
    footer: "Prenota voli adatti al tuo programma.",
    days: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
  },
  pl: {
    brand: "SkyWay",
    nav: ["Trasy", "Loty", "Pomoc"],
    heroKicker: "Loty bez stresu",
    heroTitle: "Znajdz lot i zarezerwuj bilet w kilka minut",
    heroText: "Porownaj loty bezposrednie i z przesiadkami, wybierz bagaz, miejsca i ubezpieczenie, a cena pojawi sie od razu.",
    primary: "Znajdz bilety",
    secondary: "Gorace loty",
    searchTitle: "Wyszukiwarka lotow",
    from: "Skad",
    to: "Dokad",
    date: "Data",
    passengers: "Pasazerowie",
    seats: "Miejsca",
    routeFrom: "Warszawa",
    routeTo: "Praga",
    routeDate: "24 lipca",
    routePeople: "2 doroslych",
    flightsTitle: "Najblizsze loty",
    flightsText: "Wybierz trase, date, dzien, bagaz i liczbe miejsc. Lista przewija sie bez rozciagania strony.",
    direct: "bezposredni",
    transfer: "przesiadka",
    choose: "Wybierz",
    seatsLeft: "miejsc",
    modalTitle: "Rezerwacja biletu",
    modalText: "Ustaw trase i sprawdz cene koncowa przed platnoscia.",
    trip: "Typ podrozy",
    roundTrip: "Tam i z powrotem",
    oneWay: "W jedna strone",
    classLabel: "Klasa",
    economy: "Ekonomiczna",
    business: "Biznes",
    luggageLabel: "Bagaz",
    cabinBag: "Podreczny",
    fullBag: "Bagaz 23 kg",
    insurance: "Ubezpieczenie",
    insuranceYes: "Dodaj",
    insuranceNo: "Bez ubezpieczenia",
    bookFor: "Rezerwuj za",
    close: "Zamknij",
    dealsTitle: "Trasy, ktore szybko znikaja",
    dealText: "Kazdy wiersz pokazuje kierunek, date, dzien, czas, przesiadki i wolne miejsca.",
    stepsTitle: "Jak dziala zakup",
    steps: ["Wybierz lot", "Ustaw szczegoly", "Odbierz bilet"],
    supportTitle: "Wsparcie w drodze",
    supportText: "Zmiany bramki, wejscia i opoznien pojawiaja sie po aktualizacji linii.",
    footer: "Rezerwuj loty pasujace do planu.",
    days: ["Pn", "Wt", "Sr", "Cz", "Pt", "Sb", "Nd"],
  },
  cz: {
    brand: "SkyWay",
    nav: ["Trasy", "Lety", "Pomoc"],
    heroKicker: "Letenky bez stresu",
    heroTitle: "Najdete let a rezervujte letenku za par minut",
    heroText: "Porovnejte prime a prestupni lety, vyberte zavazadla, sedadla a pojisteni a hned uvidite cenu.",
    primary: "Najit letenky",
    secondary: "Zive lety",
    searchTitle: "Vyhledani letu",
    from: "Odkud",
    to: "Kam",
    date: "Datum",
    passengers: "Cestujici",
    seats: "Mista",
    routeFrom: "Praha",
    routeTo: "Viden",
    routeDate: "24 cervence",
    routePeople: "2 dospeli",
    flightsTitle: "Nejblizsi lety",
    flightsText: "Vyberte trasu, datum, den, zavazadla a pocet mist. Seznam se posouva bez natazeni stranky.",
    direct: "primy",
    transfer: "prestup",
    choose: "Vybrat",
    seatsLeft: "mist",
    modalTitle: "Rezervace letenky",
    modalText: "Upravte trasu a zkontrolujte konecnou cenu pred platbou.",
    trip: "Typ cesty",
    roundTrip: "Zpetni",
    oneWay: "Jednosmerna",
    classLabel: "Trida",
    economy: "Economy",
    business: "Business",
    luggageLabel: "Zavazadlo",
    cabinBag: "Prirucni",
    fullBag: "Zavazadlo 23 kg",
    insurance: "Pojisteni",
    insuranceYes: "Pridat",
    insuranceNo: "Bez pojisteni",
    bookFor: "Rezervovat za",
    close: "Zavrit",
    dealsTitle: "Trasy, ktere rychle mizi",
    dealText: "Kazdy radek ukazuje smer, datum, den, dobu, prestupy a volne misto.",
    stepsTitle: "Jak objednat",
    steps: ["Vyberte let", "Nastavte detaily", "Ziskejte letenku"],
    supportTitle: "Podpora na ceste",
    supportText: "Zmeny brany, nastupu a zpozdeni prijdou hned po aktualizaci aerolinky.",
    footer: "Rezervujte lety podle sveho programu.",
    days: ["Po", "Ut", "St", "Ct", "Pa", "So", "Ne"],
  },
  sk: {
    brand: "SkyWay",
    nav: ["Trasy", "Lety", "Pomoc"],
    heroKicker: "Letenky bez stresu",
    heroTitle: "Najdite let a rezervujte letenku za par minut",
    heroText: "Porovnajte priame a prestupne lety, vyberte batozinu, sedadla a poistenie a hned uvidite cenu.",
    primary: "Najst letenky",
    secondary: "Aktualne lety",
    searchTitle: "Vyhladavanie letu",
    from: "Odkial",
    to: "Kam",
    date: "Datum",
    passengers: "Cestujuci",
    seats: "Miesta",
    routeFrom: "Bratislava",
    routeTo: "Split",
    routeDate: "24 jula",
    routePeople: "2 dospeli",
    flightsTitle: "Najblizsie lety",
    flightsText: "Vyberte trasu, datum, den, batozinu a pocet miest. Zoznam sa posuva bez natahovania stranky.",
    direct: "priamy",
    transfer: "prestup",
    choose: "Vybrat",
    seatsLeft: "miest",
    modalTitle: "Rezervacia letenky",
    modalText: "Upravte trasu a skontrolujte konecnu cenu pred platbou.",
    trip: "Typ cesty",
    roundTrip: "Spatna",
    oneWay: "Jednosmerna",
    classLabel: "Trieda",
    economy: "Economy",
    business: "Business",
    luggageLabel: "Batozina",
    cabinBag: "Prirucna",
    fullBag: "Batozina 23 kg",
    insurance: "Poistenie",
    insuranceYes: "Pridat",
    insuranceNo: "Bez poistenia",
    bookFor: "Rezervovat za",
    close: "Zavriet",
    dealsTitle: "Trasy, ktore rychlo miznu",
    dealText: "Kazdy riadok ukazuje smer, datum, den, trvanie, prestupy a volne miesta.",
    stepsTitle: "Ako objednat",
    steps: ["Vyberte let", "Nastavte detaily", "Ziskajte letenku"],
    supportTitle: "Podpora na ceste",
    supportText: "Zmeny brany, nastupu a meskania pridu hned po aktualizacii aerolinky.",
    footer: "Rezervujte lety podla svojho programu.",
    days: ["Po", "Ut", "St", "Stv", "Pi", "So", "Ne"],
  },
};

const fallback = copy.en;
const assistCopy = {
  ru: [
    { title: "Поддержка 24/7", text: "Пуши о посадке, задержках и смене выхода приходят без задержки.", label: "Live updates", icon: BellRing },
    { title: "Багаж без сюрпризов", text: "Сразу видно, что входит в билет, а где нужно добавить багаж.", label: "Smart luggage", icon: Luggage },
    { title: "Оплата после проверки", text: "Итоговая стоимость обновляется перед оплатой, без скрытых доплат.", label: "Clear price", icon: CreditCard },
    { title: "Подбор мест", text: "Выбирайте места для одного пассажира или группы, чтобы лететь вместе.", label: "Seat plan", icon: Users },
    { title: "Чат на маршруте", text: "Оператор поможет с обменом, допуском к рейсу и страховкой.", label: "Support desk", icon: Headphones },
  ],
  en: [
    { title: "24/7 trip support", text: "Boarding, delay, and gate-change alerts arrive right after the airline update.", label: "Live updates", icon: BellRing },
    { title: "Luggage without surprises", text: "See what is included in the ticket and where extra baggage is worth adding.", label: "Smart luggage", icon: Luggage },
    { title: "Pay after checking", text: "The final price updates before payment, without hidden route or baggage fees.", label: "Clear price", icon: CreditCard },
    { title: "Seat selection", text: "Pick seats for one passenger or a group so everyone travels together.", label: "Seat plan", icon: Users },
    { title: "Route chat", text: "An operator helps with changes, flight access, insurance, and route details.", label: "Support desk", icon: Headphones },
  ],
  de: [
    { title: "24/7 Reisehilfe", text: "Hinweise zu Boarding, Verspatung und Gate-Wechsel kommen direkt nach dem Airline-Update.", label: "Live-Updates", icon: BellRing },
    { title: "Gepack ohne Uberraschung", text: "Sie sehen sofort, was im Ticket enthalten ist und wann Zusatzgepack sinnvoll ist.", label: "Smartes Gepack", icon: Luggage },
    { title: "Zahlen nach Prufung", text: "Der Endpreis bleibt vor der Zahlung klar sichtbar, ohne versteckte Routen- oder Gepackkosten.", label: "Klarer Preis", icon: CreditCard },
    { title: "Sitzplatzwahl", text: "Wahlen Sie Platze fur eine Person oder Gruppe, damit alle zusammen fliegen.", label: "Sitzplan", icon: Users },
    { title: "Chat zur Route", text: "Der Support hilft bei Anderungen, Zugang zum Flug, Versicherung und Routendetails.", label: "Support", icon: Headphones },
  ],
  fr: [
    { title: "Assistance 24/7", text: "Les alertes d'embarquement, de retard et de porte arrivent juste apres la mise a jour.", label: "Mises a jour", icon: BellRing },
    { title: "Bagage sans surprise", text: "Voyez ce qui est inclus dans le billet et quand ajouter un bagage supplementaire.", label: "Bagage malin", icon: Luggage },
    { title: "Paiement apres controle", text: "Le prix final reste clair avant paiement, sans frais caches de route ou de bagage.", label: "Prix clair", icon: CreditCard },
    { title: "Choix des places", text: "Choisissez les places pour une personne ou un groupe afin de voyager ensemble.", label: "Plan de sieges", icon: Users },
    { title: "Chat trajet", text: "Un conseiller aide pour les changements, l'acces au vol, l'assurance et les details.", label: "Support", icon: Headphones },
  ],
  it: [
    { title: "Supporto 24/7", text: "Avvisi su imbarco, ritardi e gate arrivano subito dopo l'aggiornamento della compagnia.", label: "Aggiornamenti", icon: BellRing },
    { title: "Bagaglio chiaro", text: "Vedi cosa include il biglietto e quando vale la pena aggiungere un bagaglio.", label: "Bagaglio smart", icon: Luggage },
    { title: "Paghi dopo il controllo", text: "Il prezzo finale resta chiaro prima del pagamento, senza costi nascosti.", label: "Prezzo chiaro", icon: CreditCard },
    { title: "Scelta posti", text: "Scegli i posti per una persona o un gruppo, cosi si viaggia insieme.", label: "Mappa posti", icon: Users },
    { title: "Chat di viaggio", text: "Un operatore aiuta con modifiche, accesso al volo, assicurazione e dettagli.", label: "Supporto", icon: Headphones },
  ],
  pl: [
    { title: "Wsparcie 24/7", text: "Powiadomienia o wejsciu, opoznieniach i zmianie bramki przychodza po aktualizacji linii.", label: "Aktualizacje", icon: BellRing },
    { title: "Bagaz bez niespodzianek", text: "Od razu widac, co zawiera bilet i kiedy warto dodac dodatkowy bagaz.", label: "Smart bagaz", icon: Luggage },
    { title: "Platnosc po sprawdzeniu", text: "Cena koncowa jest jasna przed platnoscia, bez ukrytych kosztow trasy lub bagazu.", label: "Jasna cena", icon: CreditCard },
    { title: "Wybor miejsc", text: "Wybierz miejsca dla jednej osoby albo grupy, zeby leciec razem.", label: "Plan miejsc", icon: Users },
    { title: "Chat trasy", text: "Operator pomaga przy zmianach, dostepie do lotu, ubezpieczeniu i szczegolach.", label: "Support", icon: Headphones },
  ],
  cz: [
    { title: "Podpora 24/7", text: "Upozorneni na nastup, zpozdeni a zmenu brany prijdou hned po aktualizaci aerolinky.", label: "Live update", icon: BellRing },
    { title: "Zavazadla bez prekvapeni", text: "Hned vidite, co je v letenke a kdy se vyplati pridat dalsi zavazadlo.", label: "Smart zavazadlo", icon: Luggage },
    { title: "Platba po kontrole", text: "Konecna cena je jasna pred platbou, bez skrytych poplatku za trasu nebo zavazadlo.", label: "Jasna cena", icon: CreditCard },
    { title: "Vyber sedadel", text: "Vyberte sedadla pro jednu osobu nebo skupinu, aby vsichni leteli spolu.", label: "Plan sedadel", icon: Users },
    { title: "Chat k trase", text: "Operator pomuze se zmenami, pristupem k letu, pojistenim a detaily trasy.", label: "Podpora", icon: Headphones },
  ],
  sk: [
    { title: "Podpora 24/7", text: "Upozornenia na nastup, meskanie a zmenu brany pridu hned po aktualizacii aerolinky.", label: "Live update", icon: BellRing },
    { title: "Batozina bez prekvapeni", text: "Hned vidite, co je v letenke a kedy sa oplati pridat dalsiu batozinu.", label: "Smart batozina", icon: Luggage },
    { title: "Platba po kontrole", text: "Konecna cena je jasna pred platbou, bez skrytych poplatkov za trasu alebo batozinu.", label: "Jasna cena", icon: CreditCard },
    { title: "Vyber sedadiel", text: "Vyberte sedadla pre jednu osobu alebo skupinu, aby vsetci leteli spolu.", label: "Plan sedadiel", icon: Users },
    { title: "Chat k trase", text: "Operator pomoze so zmenami, pristupom k letu, poistenim a detailmi trasy.", label: "Podpora", icon: Headphones },
  ],
};

const airports = ["Москва", "Стамбул", "Дубай", "Рим", "Барселона", "Париж", "Берлин", "Прага", "Тбилиси", "Бали"];

const airportOptionsByLang = {
  en: ["London", "Lisbon", "Dubai", "Rome", "Barcelona", "Paris", "Berlin", "Prague", "Tbilisi", "Bali"],
  de: ["Berlin", "Rome", "Dubai", "Vienna", "Barcelona", "Paris", "Prague", "Lisbon", "Tbilisi", "Bali"],
  fr: ["Paris", "Madrid", "Dubai", "Rome", "Barcelone", "Berlin", "Prague", "Lisbonne", "Tbilissi", "Bali"],
  it: ["Milano", "Atene", "Dubai", "Roma", "Barcellona", "Parigi", "Berlino", "Praga", "Tbilisi", "Bali"],
  pl: ["Warszawa", "Praga", "Dubaj", "Rzym", "Barcelona", "Paryz", "Berlin", "Lizbona", "Tbilisi", "Bali"],
  cz: ["Praha", "Viden", "Dubaj", "Rim", "Barcelona", "Pariz", "Berlin", "Lisabon", "Tbilisi", "Bali"],
  sk: ["Bratislava", "Split", "Dubaj", "Rim", "Barcelona", "Pariz", "Berlin", "Praha", "Tbilisi", "Bali"],
};

const localizedFlightRows = {
  en: [
    ["London", "Lisbon", "24 July"], ["London", "Dubai", "25 July"], ["Lisbon", "Rome", "26 July"], ["Prague", "Barcelona", "27 July"],
    ["Paris", "Berlin", "28 July"], ["Tbilisi", "Prague", "29 July"], ["Bali", "Dubai", "30 July"], ["Rome", "London", "31 July"],
    ["Berlin", "Lisbon", "1 August"], ["Barcelona", "Tbilisi", "2 August"], ["Dubai", "Bali", "3 August"], ["Lisbon", "Paris", "4 August"],
  ],
  de: [
    ["Berlin", "Rome", "24 Juli"], ["Berlin", "Dubai", "25 Juli"], ["Vienna", "Rome", "26 Juli"], ["Prague", "Barcelona", "27 Juli"],
    ["Paris", "Berlin", "28 Juli"], ["Tbilisi", "Prague", "29 Juli"], ["Bali", "Dubai", "30 Juli"], ["Rome", "Berlin", "31 Juli"],
    ["Berlin", "Lisbon", "1 August"], ["Barcelona", "Tbilisi", "2 August"], ["Dubai", "Bali", "3 August"], ["Lisbon", "Paris", "4 August"],
  ],
  fr: [
    ["Paris", "Madrid", "24 juillet"], ["Paris", "Dubai", "25 juillet"], ["Lisbonne", "Rome", "26 juillet"], ["Prague", "Barcelone", "27 juillet"],
    ["Paris", "Berlin", "28 juillet"], ["Tbilissi", "Prague", "29 juillet"], ["Bali", "Dubai", "30 juillet"], ["Rome", "Paris", "31 juillet"],
    ["Berlin", "Lisbonne", "1 aout"], ["Barcelone", "Tbilissi", "2 aout"], ["Dubai", "Bali", "3 aout"], ["Lisbonne", "Paris", "4 aout"],
  ],
  it: [
    ["Milano", "Atene", "24 luglio"], ["Milano", "Dubai", "25 luglio"], ["Atene", "Roma", "26 luglio"], ["Praga", "Barcellona", "27 luglio"],
    ["Parigi", "Berlino", "28 luglio"], ["Tbilisi", "Praga", "29 luglio"], ["Bali", "Dubai", "30 luglio"], ["Roma", "Milano", "31 luglio"],
    ["Berlino", "Atene", "1 agosto"], ["Barcellona", "Tbilisi", "2 agosto"], ["Dubai", "Bali", "3 agosto"], ["Atene", "Parigi", "4 agosto"],
  ],
  pl: [
    ["Warszawa", "Praga", "24 lipca"], ["Warszawa", "Dubaj", "25 lipca"], ["Lizbona", "Rzym", "26 lipca"], ["Praga", "Barcelona", "27 lipca"],
    ["Paryz", "Berlin", "28 lipca"], ["Tbilisi", "Praga", "29 lipca"], ["Bali", "Dubaj", "30 lipca"], ["Rzym", "Warszawa", "31 lipca"],
    ["Berlin", "Lizbona", "1 sierpnia"], ["Barcelona", "Tbilisi", "2 sierpnia"], ["Dubaj", "Bali", "3 sierpnia"], ["Lizbona", "Paryz", "4 sierpnia"],
  ],
  cz: [
    ["Praha", "Viden", "24 cervence"], ["Praha", "Dubaj", "25 cervence"], ["Lisabon", "Rim", "26 cervence"], ["Praha", "Barcelona", "27 cervence"],
    ["Pariz", "Berlin", "28 cervence"], ["Tbilisi", "Praha", "29 cervence"], ["Bali", "Dubaj", "30 cervence"], ["Rim", "Praha", "31 cervence"],
    ["Berlin", "Lisabon", "1 srpna"], ["Barcelona", "Tbilisi", "2 srpna"], ["Dubaj", "Bali", "3 srpna"], ["Lisabon", "Pariz", "4 srpna"],
  ],
  sk: [
    ["Bratislava", "Split", "24 jula"], ["Bratislava", "Dubaj", "25 jula"], ["Lisabon", "Rim", "26 jula"], ["Praha", "Barcelona", "27 jula"],
    ["Pariz", "Berlin", "28 jula"], ["Tbilisi", "Praha", "29 jula"], ["Bali", "Dubaj", "30 jula"], ["Rim", "Bratislava", "31 jula"],
    ["Berlin", "Lisabon", "1 augusta"], ["Barcelona", "Tbilisi", "2 augusta"], ["Dubaj", "Bali", "3 augusta"], ["Lisabon", "Pariz", "4 augusta"],
  ],
};

function t(c, key) {
  return c[key] ?? fallback[key];
}

function MarkerSvg() {
  return (
    <svg className="skyway-marker-svg" viewBox="0 0 64 64" aria-hidden="true">
      <path d="M32 4C20.4 4 11 13.1 11 24.4c0 14.7 17.1 31.8 19.7 34.3a1.9 1.9 0 0 0 2.6 0C35.9 56.2 53 39.1 53 24.4 53 13.1 43.6 4 32 4Z" />
      <circle cx="32" cy="24" r="8.5" />
    </svg>
  );
}

function TicketAirlineIcon() {
  return (
    <svg viewBox="0 0 96 96" aria-hidden="true">
      <path d="M18 18h60a8 8 0 0 1 8 8v12a10 10 0 0 0 0 20v12a8 8 0 0 1-8 8H18a8 8 0 0 1-8-8V58a10 10 0 0 0 0-20V26a8 8 0 0 1 8-8Z" />
      <path d="M30 56h18l14 12h8L62 56h8c4 0 7-3 7-7s-3-7-7-7h-8l8-12h-8L48 42H30l-7-8h-6l4 15-4 15h6l7-8Z" />
    </svg>
  );
}

function buildFlights(days, lang = "ru") {
  const localizedRows = localizedFlightRows[lang];
  const baseRows = [
    ["Москва", "Стамбул", "24 июля", days[0], "08:40", "12:05", "3ч 25м", 240, 18, "direct"],
    ["Москва", "Дубай", "25 июля", days[1], "10:15", "16:05", "5ч 50м", 390, 11, "direct"],
    ["Стамбул", "Рим", "26 июля", days[2], "13:20", "15:45", "2ч 25м", 180, 9, "direct"],
    ["Прага", "Барселона", "27 июля", days[3], "09:30", "12:10", "2ч 40м", 210, 7, "direct"],
    ["Париж", "Берлин", "28 июля", days[4], "18:00", "19:45", "1ч 45м", 160, 16, "direct"],
    ["Тбилиси", "Прага", "29 июля", days[5], "07:25", "11:30", "4ч 05м", 260, 5, "transfer"],
    ["Бали", "Дубай", "30 июля", days[6], "22:20", "05:10", "6ч 50м", 520, 4, "direct"],
    ["Рим", "Москва", "31 июля", days[0], "15:15", "20:20", "5ч 05м", 230, 13, "transfer"],
    ["Берлин", "Стамбул", "1 августа", days[1], "12:45", "16:40", "3ч 55м", 205, 21, "direct"],
    ["Барселона", "Тбилиси", "2 августа", days[2], "06:50", "14:05", "7ч 15м", 310, 6, "transfer"],
    ["Дубай", "Бали", "3 августа", days[3], "02:15", "15:35", "9ч 20м", 580, 8, "direct"],
    ["Стамбул", "Париж", "4 августа", days[4], "17:10", "20:05", "2ч 55м", 190, 12, "direct"],
  ];
  const rows = localizedRows
    ? baseRows.map((row, index) => [
      localizedRows[index][0],
      localizedRows[index][1],
      localizedRows[index][2],
      ...row.slice(3),
    ])
    : baseRows;

  return rows.map(([from, to, date, day, depart, arrive, duration, price, seatsLeft, kind], index) => ({
    id: `flight-${index}`,
    from,
    to,
    date,
    day,
    depart,
    arrive,
    duration,
    price,
    seatsLeft,
    kind,
  }));
}

function SkywayTicketsLanding() {
  const { lang } = useThemeLang();
  const c = useMemo(() => ({ ...fallback, ...(copy[lang] ?? {}) }), [lang]);
  const flights = useMemo(() => buildFlights(t(c, "days"), lang), [c, lang]);
  const airportOptions = airportOptionsByLang[lang] ?? airports;
  const supportCards = assistCopy[lang] ?? assistCopy.en;
  const navTargets = ["#skyway-search", "#skyway-flights", "#skyway-assist"];
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(flights[0]);
  const [booking, setBooking] = useState({
    from: "Москва",
    to: "Стамбул",
    date: "24 июля",
    seats: 2,
    trip: "round",
    travelClass: "economy",
    luggage: "cabin",
    insurance: "yes",
  });

  const bookingPrice = Number(selectedFlight?.price ?? flights[0]?.price ?? 0);

  useEffect(() => {
    const firstFlight = flights[0];
    if (!firstFlight) return;

    setSelectedFlight(firstFlight);
    setBooking((current) => ({
      ...current,
      from: firstFlight.from,
      to: firstFlight.to,
      date: firstFlight.date,
    }));
  }, [flights]);

  function openBooking(flight = selectedFlight) {
    setSelectedFlight(flight);
    setBooking((current) => ({
      ...current,
      from: flight.from,
      to: flight.to,
      date: flight.date,
    }));
    setBookingOpen(true);
  }

  function updateBooking(field, value) {
    setBooking((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="skyway-site">
      <header className="skyway-header">
        <a className="skyway-logo" href="#skyway-hero" aria-label={t(c, "brand")}>
          <span className="skyway-logo-mark"><img src={planeImg} alt="" /></span>
          <span>{t(c, "brand")}</span>
        </a>
        <nav className="skyway-nav" aria-label="SkyWay navigation">
          {t(c, "nav").map((item, index) => (
            <a href={navTargets[index] ?? "#skyway-flights"} key={item}>{item}</a>
          ))}
        </nav>
        <button className="skyway-header-cta" type="button" onClick={() => openBooking()}>{t(c, "primary")}</button>
      </header>

      <main>
        <section className="skyway-hero" id="skyway-hero">
          <div className="skyway-airspace" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <div className={`skyway-plane skyway-plane--${index + 1}`} key={index}>
                <span className="skyway-plane-smoke" />
                <img src={planeImg} alt="" />
              </div>
            ))}
          </div>

          <div className="skyway-cloud skyway-cloud--one" aria-hidden="true" />
          <div className="skyway-cloud skyway-cloud--two" aria-hidden="true" />
          <div className="skyway-route-line" aria-hidden="true" />

          <div className="skyway-hero-content">
            <span className="skyway-kicker">{t(c, "heroKicker")}</span>
            <h1>{t(c, "heroTitle")}</h1>
            <p>{t(c, "heroText")}</p>
            <div className="skyway-actions">
              <button className="skyway-btn skyway-btn--primary" type="button" onClick={() => openBooking()}>{t(c, "primary")}</button>
              <a className="skyway-btn skyway-btn--ghost" href="#skyway-flights">{t(c, "secondary")}</a>
            </div>
          </div>

          <div className="skyway-ticket-panel" aria-label={t(c, "searchTitle")}>
            <div className="skyway-ticket-icon"><TicketAirlineIcon /></div>
            <div>
              <span>{t(c, "from")}{" -> "}{t(c, "to")}</span>
              <strong>{booking.from}{" -> "}{booking.to}</strong>
              <small>{booking.date} · {booking.seats} {t(c, "seats").toLowerCase()}</small>
            </div>
            <button type="button" onClick={() => openBooking()}><ChevronRight size={22} /></button>
          </div>
        </section>

        <section className="skyway-search" id="skyway-search">
          <div className="skyway-section-head">
            <span><Search size={18} /> {t(c, "searchTitle")}</span>
            <h2>{t(c, "dealsTitle")}</h2>
          </div>
          <div className="skyway-search-grid">
            <label>
              <span><MarkerSvg /> {t(c, "from")}</span>
              <strong>{booking.from}</strong>
            </label>
            <label>
              <span><MarkerSvg /> {t(c, "to")}</span>
              <strong>{booking.to}</strong>
            </label>
            <label>
              <span><CalendarDays size={15} /> {t(c, "date")}</span>
              <strong>{booking.date}</strong>
            </label>
            <label>
              <span><Users size={15} /> {t(c, "passengers")}</span>
              <strong>{booking.seats} {t(c, "seats").toLowerCase()}</strong>
            </label>
            <button type="button" onClick={() => openBooking()}>{t(c, "primary")}</button>
          </div>
        </section>

        <section className="skyway-flights" id="skyway-flights">
          <div className="skyway-route-copy">
            <span className="skyway-kicker">{t(c, "secondary")}</span>
            <h2>{t(c, "flightsTitle")}</h2>
            <p>{t(c, "flightsText")}</p>
          </div>
          <div className="skyway-flight-board">
            <div className="skyway-flight-board-head">
              <strong>{t(c, "dealsTitle")}</strong>
              <span>{flights.length} routes</span>
            </div>
            <div className="skyway-flight-list">
              {flights.map((flight) => (
                <article
                  className="skyway-flight-row"
                  key={flight.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${t(c, "choose")} ${flight.from} -> ${flight.to}`}
                  onClick={() => openBooking(flight)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      openBooking(flight);
                    }
                  }}
                >
                  <div className="skyway-flight-main">
                    <b>{flight.from}{" -> "}{flight.to}</b>
                    <span>{flight.date}, {flight.day} · {flight.kind === "direct" ? t(c, "direct") : t(c, "transfer")}</span>
                  </div>
                  <div className="skyway-flight-time">
                    <Clock3 size={16} />
                    <strong>{flight.depart} - {flight.arrive}</strong>
                    <span>{flight.duration}</span>
                  </div>
                  <div className="skyway-flight-price">
                    <span>{flight.seatsLeft} {t(c, "seatsLeft")}</span>
                    <b>${flight.price}</b>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="skyway-process">
          <h2>{t(c, "stepsTitle")}</h2>
          <div className="skyway-step-grid">
            {t(c, "steps").map((step, index) => (
              <article key={step}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step}</strong>
                {index < t(c, "steps").length - 1 && <ArrowRight className="skyway-step-arrow" size={22} />}
              </article>
            ))}
          </div>
        </section>

        <section className="skyway-assist" id="skyway-assist" aria-label={t(c, "supportTitle")}>
          {supportCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <article className={`skyway-assist-card${index % 2 ? " skyway-assist-card--reverse" : ""}`} key={card.title}>
                <div className="skyway-assist-copy">
                  <span>{String(index + 1).padStart(2, "0")} / 05</span>
                  <h2>{card.title}</h2>
                  <p>{card.text}</p>
                </div>
                <div className="skyway-assist-visual">
                  <Icon size={48} />
                  <strong>{card.label}</strong>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      <footer className="skyway-footer">
        <strong>{t(c, "brand")}</strong>
        <span>{t(c, "footer")}</span>
      </footer>

      {bookingOpen && (
        <div className="skyway-booking-backdrop" role="presentation" onMouseDown={() => setBookingOpen(false)}>
          <div className="skyway-booking-modal" role="dialog" aria-modal="true" aria-label={t(c, "modalTitle")} onMouseDown={(event) => event.stopPropagation()}>
            <button className="skyway-booking-close" type="button" aria-label={t(c, "close")} onClick={() => setBookingOpen(false)}>
              <X size={22} />
            </button>
            <div className="skyway-booking-title">
              <span><TicketAirlineIcon /></span>
              <div>
                <h2>{t(c, "modalTitle")}</h2>
                <p>{t(c, "modalText")}</p>
              </div>
            </div>

            <div className="skyway-booking-route">
              <label>
                <span><MarkerSvg /> {t(c, "from")}</span>
                <select value={booking.from} onChange={(event) => updateBooking("from", event.target.value)}>
                  {airportOptions.map((airport) => <option key={airport}>{airport}</option>)}
                </select>
              </label>
              <label>
                <span><MarkerSvg /> {t(c, "to")}</span>
                <select value={booking.to} onChange={(event) => updateBooking("to", event.target.value)}>
                  {airportOptions.map((airport) => <option key={airport}>{airport}</option>)}
                </select>
              </label>
            </div>

            <div className="skyway-booking-grid">
              <label>
                <span>{t(c, "date")}</span>
                <input value={booking.date} onChange={(event) => updateBooking("date", event.target.value)} />
              </label>
              <label>
                <span>{t(c, "seats")}</span>
                <input min="1" max="9" type="number" value={booking.seats} onChange={(event) => updateBooking("seats", event.target.value)} />
              </label>
              <label>
                <span>{t(c, "trip")}</span>
                <select value={booking.trip} onChange={(event) => updateBooking("trip", event.target.value)}>
                  <option value="round">{t(c, "roundTrip")}</option>
                  <option value="one">{t(c, "oneWay")}</option>
                </select>
              </label>
              <label>
                <span>{t(c, "classLabel")}</span>
                <select value={booking.travelClass} onChange={(event) => updateBooking("travelClass", event.target.value)}>
                  <option value="economy">{t(c, "economy")}</option>
                  <option value="business">{t(c, "business")}</option>
                </select>
              </label>
              <label>
                <span>{t(c, "luggageLabel")}</span>
                <select value={booking.luggage} onChange={(event) => updateBooking("luggage", event.target.value)}>
                  <option value="cabin">{t(c, "cabinBag")}</option>
                  <option value="full">{t(c, "fullBag")}</option>
                </select>
              </label>
              <label>
                <span>{t(c, "insurance")}</span>
                <select value={booking.insurance} onChange={(event) => updateBooking("insurance", event.target.value)}>
                  <option value="yes">{t(c, "insuranceYes")}</option>
                  <option value="no">{t(c, "insuranceNo")}</option>
                </select>
              </label>
            </div>

            <button className="skyway-booking-pay" type="button">
              {t(c, "bookFor")} ${bookingPrice}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SkywayTicketsLanding;
