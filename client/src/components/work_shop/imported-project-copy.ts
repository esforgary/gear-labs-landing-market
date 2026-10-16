import tgMarketJson from "./bots/tg-market/catalog.json?raw";

type ProjectText = readonly [title: string, text: string, type: string];
type CatalogCopy = { title: string; text: string; type: string; price: string; time: string };

const projects: Record<string, Record<string, ProjectText>> = {
  "ru": {
    "market-analysis": [
      "Meridian — Анализ рынков",
      "Обзор рынков: активы, графики, валюты, новости и избранное.",
      "Аналитика"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Интерактивный справочник по тестированию: темы, поиск, вопросы и проверка знаний.",
      "База знаний"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Фоторедактор",
      "Фоторедактор со слоями, кистями, текстом, эффектами и экспортом PNG. Сохранение на устройстве.",
      "Фоторедактор"
    ],
    "calorie-calculator": [
      "Ритм — Калькулятор калорий",
      "Дневник питания: калории, продукты, рецепты, вода и активность. Без регистрации, с локальным сохранением.",
      "Дневник питания"
    ]
  },
  "en": {
    "market-analysis": [
      "Meridian — Market Analysis",
      "Market overview with assets, charts, currencies, news and favorites.",
      "Analytics"
    ],
    "qa-abstract": [
      "QA Abstract",
      "An interactive software testing handbook with topics, search, questions and knowledge checks.",
      "Knowledge base"
    ],
    "scenarios-photo-editor": [
      "Scenarios Photo Editor",
      "A photo editor with layers, brushes, text, effects and PNG export. Projects are saved on your device.",
      "Photo editor"
    ],
    "calorie-calculator": [
      "Ritm — Calorie Calculator",
      "A nutrition diary with calories, foods, recipes, water and activity. No registration, with local storage.",
      "Nutrition diary"
    ]
  },
  "de": {
    "market-analysis": [
      "Meridian — Marktanalyse",
      "Marktübersicht mit Anlagen, Diagrammen, Währungen, Nachrichten und Favoriten.",
      "Analyse"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Interaktives Nachschlagewerk für Softwaretests mit Themen, Suche, Fragen und Wissenstests.",
      "Wissensdatenbank"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Fotoeditor",
      "Fotoeditor mit Ebenen, Pinseln, Text, Effekten und PNG-Export. Projekte werden auf dem Gerät gespeichert.",
      "Fotoeditor"
    ],
    "calorie-calculator": [
      "Ritm — Kalorienrechner",
      "Ernährungstagebuch mit Kalorien, Lebensmitteln, Rezepten, Wasser und Aktivitäten. Ohne Registrierung, lokal gespeichert.",
      "Ernährungstagebuch"
    ]
  },
  "fr": {
    "market-analysis": [
      "Meridian — Analyse des marchés",
      "Vue d’ensemble des marchés : actifs, graphiques, devises, actualités et favoris.",
      "Analyse"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Guide interactif des tests logiciels : thèmes, recherche, questions et vérification des connaissances.",
      "Base de connaissances"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Éditeur photo",
      "Éditeur photo avec calques, pinceaux, texte, effets et export PNG. Projets enregistrés sur votre appareil.",
      "Éditeur photo"
    ],
    "calorie-calculator": [
      "Ritm — Calculateur de calories",
      "Journal alimentaire : calories, aliments, recettes, eau et activité. Sans inscription, avec sauvegarde locale.",
      "Journal alimentaire"
    ]
  },
  "it": {
    "market-analysis": [
      "Meridian — Analisi dei mercati",
      "Panoramica dei mercati con asset, grafici, valute, notizie e preferiti.",
      "Analisi"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Guida interattiva al testing software con argomenti, ricerca, domande e verifica delle conoscenze.",
      "Base di conoscenza"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Editor fotografico",
      "Editor fotografico con livelli, pennelli, testo, effetti ed esportazione PNG. Progetti salvati sul dispositivo.",
      "Editor fotografico"
    ],
    "calorie-calculator": [
      "Ritm — Calcolatore di calorie",
      "Diario alimentare con calorie, alimenti, ricette, acqua e attività. Senza registrazione, con salvataggio locale.",
      "Diario alimentare"
    ]
  },
  "pl": {
    "market-analysis": [
      "Meridian — Analiza rynków",
      "Przegląd rynków: aktywa, wykresy, waluty, wiadomości i ulubione.",
      "Analityka"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Interaktywny przewodnik po testowaniu oprogramowania: tematy, wyszukiwanie, pytania i sprawdzanie wiedzy.",
      "Baza wiedzy"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Edytor zdjęć",
      "Edytor zdjęć z warstwami, pędzlami, tekstem, efektami i eksportem PNG. Projekty zapisywane na urządzeniu.",
      "Edytor zdjęć"
    ],
    "calorie-calculator": [
      "Ritm — Kalkulator kalorii",
      "Dziennik żywienia: kalorie, produkty, przepisy, woda i aktywność. Bez rejestracji, z zapisem lokalnym.",
      "Dziennik żywienia"
    ]
  },
  "cz": {
    "market-analysis": [
      "Meridian — Analýza trhů",
      "Přehled trhů: aktiva, grafy, měny, zprávy a oblíbené položky.",
      "Analytika"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Interaktivní příručka testování softwaru: témata, vyhledávání, otázky a ověřování znalostí.",
      "Znalostní báze"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Editor fotografií",
      "Editor fotografií s vrstvami, štětci, textem, efekty a exportem PNG. Projekty se ukládají do zařízení.",
      "Editor fotografií"
    ],
    "calorie-calculator": [
      "Ritm — Kalkulačka kalorií",
      "Stravovací deník: kalorie, potraviny, recepty, voda a aktivita. Bez registrace, s místním ukládáním.",
      "Stravovací deník"
    ]
  },
  "sk": {
    "market-analysis": [
      "Meridian — Analýza trhov",
      "Prehľad trhov: aktíva, grafy, meny, správy a obľúbené položky.",
      "Analytika"
    ],
    "qa-abstract": [
      "QA Abstract",
      "Interaktívna príručka testovania softvéru: témy, vyhľadávanie, otázky a overovanie vedomostí.",
      "Znalostná báza"
    ],
    "scenarios-photo-editor": [
      "Scenarios — Editor fotografií",
      "Editor fotografií s vrstvami, štetcami, textom, efektmi a exportom PNG. Projekty sa ukladajú do zariadenia.",
      "Editor fotografií"
    ],
    "calorie-calculator": [
      "Ritm — Kalkulačka kalórií",
      "Stravovací denník: kalórie, potraviny, recepty, voda a aktivita. Bez registrácie, s miestnym ukladaním.",
      "Stravovací denník"
    ]
  }
};

const labels: Record<string, { onRequest: string; preview: string; close: string; loading: string }> = {
  "ru": {
    "onRequest": "По запросу",
    "preview": "Обзор",
    "close": "Закрыть",
    "loading": "Загрузка…"
  },
  "en": {
    "onRequest": "On request",
    "preview": "Preview",
    "close": "Close",
    "loading": "Loading…"
  },
  "de": {
    "onRequest": "Auf Anfrage",
    "preview": "Vorschau",
    "close": "Schließen",
    "loading": "Wird geladen…"
  },
  "fr": {
    "onRequest": "Sur demande",
    "preview": "Aperçu",
    "close": "Fermer",
    "loading": "Chargement…"
  },
  "it": {
    "onRequest": "Su richiesta",
    "preview": "Anteprima",
    "close": "Chiudi",
    "loading": "Caricamento…"
  },
  "pl": {
    "onRequest": "Na zapytanie",
    "preview": "Podgląd",
    "close": "Zamknij",
    "loading": "Ładowanie…"
  },
  "cz": {
    "onRequest": "Na vyžádání",
    "preview": "Náhled",
    "close": "Zavřít",
    "loading": "Načítání…"
  },
  "sk": {
    "onRequest": "Na vyžiadanie",
    "preview": "Náhľad",
    "close": "Zavrieť",
    "loading": "Načítava sa…"
  }
};

const tgMarket = JSON.parse(tgMarketJson) as { translations: Record<string, CatalogCopy> };
const projectPrices: Record<string, string> = {
  "market-analysis": "1000 $",
  "qa-abstract": "600 $",
  "scenarios-photo-editor": "1500 $",
  "calorie-calculator": "1000 $",
};
const projectDays: Record<string, number> = {
  "market-analysis": 14,
  "qa-abstract": 8,
  "scenarios-photo-editor": 18,
  "calorie-calculator": 14,
};
const dayUnits: Record<string, string> = {
  ru: "дней", en: "days", de: "Tage", fr: "jours", it: "giorni", pl: "dni", cz: "dní", sk: "dní",
};

export function getWorkshopPreviewLabels(lang: string) {
  return labels[lang] ?? labels.en;
}

export function getImportedProjectCopy(key: string | undefined, lang: string): CatalogCopy | undefined {
  if (key === "tg-market") return tgMarket.translations[lang] ?? tgMarket.translations.en;
  const row = key && (projects[lang] ?? projects.en)[key];
  if (!row) return undefined;
  const [title, text, type] = row;
  const { onRequest } = getWorkshopPreviewLabels(lang);
  return { title, text, type, price: projectPrices[key!] ?? onRequest, time: `${projectDays[key!]} ${dayUnits[lang] ?? dayUnits.en}` };
}

