const fallbackLang = "ru";

const copy = {
  ru: {
    greeting: "Привет. Я помогу быстро сориентироваться по макетам, конструктору, цене и запуску проекта.",
    fallback: "Я пока лучше отвечаю на частые вопросы по GearLabs. Могу подсказать про цену, сроки, макеты, конструктор, оплату, правки и запуск.",
  },
  en: {
    greeting: "Hi. I can help with templates, the builder, pricing, and project launch.",
    fallback: "I am best at GearLabs FAQ right now. Ask me about pricing, timelines, templates, the builder, payment, revisions, or launch.",
  },
  de: {
    greeting: "Hallo. Ich helfe bei Layouts, Konstruktor, Preisen und Projektstart.",
    fallback: "Ich beantworte aktuell am besten GearLabs-FAQ: Preise, Fristen, Layouts, Konstruktor, Zahlung, Korrekturen und Launch.",
  },
  fr: {
    greeting: "Bonjour. Je peux aider avec les maquettes, le constructeur, les prix et le lancement.",
    fallback: "Je reponds surtout aux FAQ GearLabs: prix, delais, maquettes, constructeur, paiement, corrections et lancement.",
  },
  it: {
    greeting: "Ciao. Posso aiutare con layout, builder, prezzi e lancio del progetto.",
    fallback: "Per ora rispondo meglio alle FAQ GearLabs: prezzi, tempi, layout, builder, pagamenti, modifiche e lancio.",
  },
  pl: {
    greeting: "Czesc. Pomoge z makietami, konstruktorem, cena i uruchomieniem projektu.",
    fallback: "Najlepiej odpowiadam teraz na FAQ GearLabs: ceny, terminy, makiety, konstruktor, platnosc, poprawki i start.",
  },
  cz: {
    greeting: "Ahoj. Pomuzu s layouty, konstruktorem, cenou a spustenim projektu.",
    fallback: "Zatim nejlepe odpovidam na GearLabs FAQ: ceny, terminy, layouty, konstruktor, platby, upravy a spusteni.",
  },
  sk: {
    greeting: "Ahoj. Pomozem s layoutmi, konstruktorom, cenou a spustenim projektu.",
    fallback: "Zatial najlepsie odpovedam na GearLabs FAQ: ceny, terminy, layouty, konstruktor, platby, upravy a spustenie.",
  },
};

const faqs = [
  {
    id: "price",
    title: {
      ru: "Как считается цена?",
      en: "How is the price calculated?",
      de: "Wie wird der Preis berechnet?",
      fr: "Comment le prix est calcule ?",
      it: "Come si calcola il prezzo?",
      pl: "Jak liczona jest cena?",
      cz: "Jak se pocita cena?",
      sk: "Ako sa pocita cena?",
    },
    keywords: ["цена", "стоимость", "сколько", "price", "cost", "preis", "prix", "cena"],
    answer: {
      ru: "Цена зависит от выбранного макета или набора блоков в конструкторе. В конструкторе сумма обновляется автоматически, потому что каждый блок добавляет свою стоимость.",
      en: "The price depends on the selected template or the blocks added in the builder. The builder updates the total automatically because every block has its own cost.",
      de: "Der Preis hangt vom Layout oder den Bausteinen im Konstruktor ab. Die Summe wird automatisch aktualisiert, weil jeder Block eigene Kosten hat.",
      fr: "Le prix depend de la maquette ou des blocs ajoutes dans le constructeur. Le total se met a jour automatiquement car chaque bloc a son cout.",
      it: "Il prezzo dipende dal template o dai blocchi aggiunti nel builder. Il totale si aggiorna automaticamente perche ogni blocco ha un costo.",
      pl: "Cena zalezy od wybranej makiety lub blokow w konstruktorze. Suma aktualizuje sie automatycznie, bo kazdy blok ma swoj koszt.",
      cz: "Cena zalezi na vybranem layoutu nebo blocich v konstruktoru. Celkova castka se meni automaticky, protoze kazdy blok ma vlastni cenu.",
      sk: "Cena zavisi od vybraneho layoutu alebo blokov v konstruktore. Suma sa meni automaticky, pretoze kazdy blok ma vlastnu cenu.",
    },
  },
  {
    id: "timeline",
    title: {
      ru: "Сколько длится запуск?",
      en: "How long does launch take?",
      de: "Wie lange dauert der Start?",
      fr: "Combien de temps prend le lancement ?",
      it: "Quanto dura il lancio?",
      pl: "Ile trwa start?",
      cz: "Jak dlouho trva spusteni?",
      sk: "Ako dlho trva spustenie?",
    },
    keywords: ["срок", "долго", "дней", "когда", "timeline", "launch", "days", "frist", "delai"],
    answer: {
      ru: "Обычно простой лендинг можно собрать за несколько дней, а магазин или приложение требуют больше времени. На карточках макетов указана примерная длительность запуска.",
      en: "A simple landing page can usually be prepared in a few days, while a store or app takes longer. Template cards show an estimated launch time.",
      de: "Ein einfacher Landingpage-Start dauert meist wenige Tage, Shop oder App brauchen langer. Die Karten zeigen die geschatzte Dauer.",
      fr: "Une landing simple peut etre lancee en quelques jours, tandis qu'une boutique ou une app prend plus de temps. Les cartes indiquent une estimation.",
      it: "Una landing semplice si prepara in pochi giorni, mentre uno shop o un'app richiedono piu tempo. Le card mostrano una stima.",
      pl: "Prosty landing zwykle powstaje w kilka dni, sklep lub aplikacja zajmuja wiecej czasu. Karty pokazuja szacowany termin.",
      cz: "Jednoduchy landing lze pripravit za par dni, obchod nebo aplikace trva dele. Karty ukazuji orientacni termin.",
      sk: "Jednoduchy landing sa da pripravit za par dni, obchod alebo aplikacia trva dlhsie. Karty ukazuju orientacny termin.",
    },
  },
  {
    id: "builder",
    title: {
      ru: "Что делает конструктор?",
      en: "What does the builder do?",
      de: "Was macht der Konstruktor?",
      fr: "A quoi sert le constructeur ?",
      it: "A cosa serve il builder?",
      pl: "Co robi konstruktor?",
      cz: "Co umi konstruktor?",
      sk: "Co robi konstruktor?",
    },
    keywords: ["конструктор", "блок", "собрать", "builder", "block", "konstruktor", "bloc"],
    answer: {
      ru: "Конструктор позволяет собрать страницу из готовых блоков: шапка, баннер, каталог, формы, тарифы, отзывы, статьи и фоновые эффекты. Текущий вариант сохраняется, чтобы не терять сборку после обновления.",
      en: "The builder lets you assemble a page from ready blocks: header, hero, catalog, forms, pricing, reviews, articles, and background effects. The current build is saved after refresh.",
      de: "Im Konstruktor baust du Seiten aus fertigen Blocks: Header, Hero, Katalog, Formulare, Preise, Reviews, Artikel und Effekte. Der Stand bleibt nach Reload erhalten.",
      fr: "Le constructeur assemble une page avec des blocs prets: header, hero, catalogue, formulaires, tarifs, avis, articles et effets de fond. L'etat est conserve apres rechargement.",
      it: "Il builder compone pagine con blocchi pronti: header, hero, catalogo, form, prezzi, recensioni, articoli ed effetti. Lo stato resta dopo refresh.",
      pl: "Konstruktor sklada strone z gotowych blokow: naglowek, hero, katalog, formularze, ceny, opinie, artykuly i efekty tla. Stan zostaje po odswiezeniu.",
      cz: "Konstruktor sklada stranku z hotovych bloku: header, hero, katalog, formulare, ceny, recenze, clanky a efekty. Stav zustane po refreshi.",
      sk: "Konstruktor sklada stranku z hotovych blokov: header, hero, katalog, formulare, ceny, recenzie, clanky a efekty. Stav ostane po refreshi.",
    },
  },
  {
    id: "templates",
    title: {
      ru: "Можно взять готовый макет?",
      en: "Can I use a ready template?",
      de: "Kann ich ein fertiges Layout nehmen?",
      fr: "Puis-je prendre une maquette prete ?",
      it: "Posso usare un template pronto?",
      pl: "Czy moge wziac gotowa makiete?",
      cz: "Muzu pouzit hotovy layout?",
      sk: "Mozem pouzit hotovy layout?",
    },
    keywords: ["макет", "сайт", "приложение", "template", "layout", "app", "maquette"],
    answer: {
      ru: "Да. В разделе макетов есть сайты и мобильные приложения. Нажмите обзор, чтобы открыть интерактивный предпросмотр, а кнопка с ценой привязывает проект к заявке.",
      en: "Yes. The catalog has websites and mobile apps. Click preview for an interactive demo; the price button attaches the project to your request.",
      de: "Ja. Im Katalog gibt es Websites und mobile Apps. Vorschau offnet die Demo, der Preis-Button bindet das Projekt an die Anfrage.",
      fr: "Oui. Le catalogue contient sites et apps mobiles. Apercu ouvre la demo interactive; le bouton prix lie le projet a la demande.",
      it: "Si. Il catalogo include siti e app mobile. Anteprima apre la demo; il pulsante prezzo collega il progetto alla richiesta.",
      pl: "Tak. W katalogu sa strony i aplikacje mobilne. Podglad otwiera demo, a przycisk ceny laczy projekt z formularzem.",
      cz: "Ano. V katalogu jsou weby i mobilni aplikace. Nahled otevre demo a tlacitko ceny pripoji projekt k poptavce.",
      sk: "Ano. V katalogu su weby aj mobilne aplikacie. Nahlad otvori demo a tlacidlo ceny pripoji projekt k poziadavke.",
    },
  },
  {
    id: "edits",
    title: {
      ru: "Можно потом менять контент?",
      en: "Can content be edited later?",
      de: "Kann man Inhalte spater andern?",
      fr: "Peut-on modifier le contenu ensuite ?",
      it: "Si puo modificare il contenuto dopo?",
      pl: "Czy mozna potem zmieniac tresc?",
      cz: "Lze obsah pozdeji menit?",
      sk: "Da sa obsah neskor menit?",
    },
    keywords: ["измен", "редакт", "правк", "edit", "change", "content", "modifier", "andern"],
    answer: {
      ru: "Да. Тексты, изображения и состав блоков можно менять. Если нужен личный кабинет или админка, это лучше обсудить отдельно в заявке.",
      en: "Yes. Texts, images, and block composition can be changed. If you need an admin panel, mention it in the request.",
      de: "Ja. Texte, Bilder und Blocke lassen sich andern. Wenn ein Adminbereich notig ist, schreibe es in die Anfrage.",
      fr: "Oui. Textes, images et blocs peuvent changer. Si un panneau admin est necessaire, indiquez-le dans la demande.",
      it: "Si. Testi, immagini e blocchi si possono cambiare. Se serve admin panel, indicalo nella richiesta.",
      pl: "Tak. Teksty, obrazy i bloki mozna zmieniac. Jesli potrzebny jest panel admina, wpisz to w formularzu.",
      cz: "Ano. Texty, obrazky a bloky lze menit. Pokud je potreba admin panel, uved to v poptavce.",
      sk: "Ano. Texty, obrazky a bloky sa daju menit. Ak treba admin panel, napis to do poziadavky.",
    },
  },
];

const normalizeLang = (lang) => (copy[lang] ? lang : fallbackLang);

const pick = (field, lang) => field[lang] || field[fallbackLang] || Object.values(field)[0] || "";

const getFaqSuggestions = (lang = fallbackLang) => {
  const normalizedLang = normalizeLang(lang);
  return faqs.map((faq) => ({
    id: faq.id,
    title: pick(faq.title, normalizedLang),
  }));
};

const answerQuestion = (message, lang = fallbackLang) => {
  const normalizedLang = normalizeLang(lang);
  const question = String(message || "").toLowerCase();

  if (!question.trim()) {
    return {
      answer: copy[normalizedLang].greeting,
      suggestions: getFaqSuggestions(normalizedLang),
    };
  }

  const match = faqs
    .map((faq) => ({
      faq,
      score: faq.keywords.reduce((sum, keyword) => sum + (question.includes(keyword) ? 1 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)[0];

  return {
    answer: match?.score > 0 ? pick(match.faq.answer, normalizedLang) : copy[normalizedLang].fallback,
    suggestions: getFaqSuggestions(normalizedLang),
  };
};

module.exports = {
  answerQuestion,
  getFaqSuggestions,
};
