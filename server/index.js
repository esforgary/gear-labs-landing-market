const express = require("express");
const cors = require("cors");
const path = require("path");
const db = require("./db");
const workshopItems = require("./data/workshop-items");
const builderCatalog = require("./data/builder-blocks");
const { answerQuestion, getFaqSuggestions } = require("./data/chatbot-faq");

const app = express();
const PORT = process.env.PORT || 5050;
const avatarColors = ["#FF6B6B", "#91e59cff", "#3777d1ff", "#b377e4ff", "#e29555ff"];

// Разрешаем запросы с любого фронтенда
app.use(cors());
app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "public"), { maxAge: "7d" }));

const formatDate = (d) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
};

const normalizeRating = (rating) => {
  const value = Number(rating);
  if (!Number.isFinite(value)) return 5;
  return Math.min(5, Math.max(1, Math.round(value)));
};

const colorForName = (name) => {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
};

const toClientComment = (row) => ({
  id: row.id,
  user: row.user,
  name: row.user,
  text: row.text,
  rating: row.rating,
  date: row.date,
  avatarColor: row.avatarColor || colorForName(row.user || "Anonymous"),
});

const getTranslations = () => {
  const languages = db
    .prepare("SELECT code, name, flag FROM languages WHERE enabled = 1 ORDER BY sortOrder ASC, code ASC")
    .all();

  const rows = db
    .prepare("SELECT lang, translationKey, value FROM translations ORDER BY lang ASC, translationKey ASC")
    .all();

  const translations = rows.reduce((acc, row) => {
    if (!acc[row.lang]) acc[row.lang] = {};
    acc[row.lang][row.translationKey] = row.value;
    return acc;
  }, {});

  return { languages, translations };
};

// =================== Комментарии ===================

// Получить все комментарии
app.get("/api/comments", (req, res) => {
  const rows = db.prepare("SELECT * FROM comments ORDER BY id DESC").all();
  res.json(rows.map(toClientComment));
});

// Добавить новый комментарий
app.post("/api/comments", (req, res) => {
  const { user, name, text, rating } = req.body;
  const cleanText = typeof text === "string" ? text.trim() : "";
  const cleanName = typeof (name || user) === "string" ? (name || user).trim() : "";
  const commentUser = cleanName || "Anonymous";
  const commentRating = normalizeRating(rating);
  const avatarColor = colorForName(commentUser);

  if (!cleanText) return res.status(400).json({ error: "Text is required" });

  const stmt = db.prepare(
    "INSERT INTO comments (user, text, rating, date, avatarColor) VALUES (?, ?, ?, ?, ?)"
  );
  const info = stmt.run(commentUser, cleanText, commentRating, formatDate(new Date()), avatarColor);

  const newComment = db.prepare("SELECT * FROM comments WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(toClientComment(newComment));
});

// =================== Переводы интерфейса ===================
app.get("/api/i18n", (req, res) => {
  res.json(getTranslations());
});

// =================== Каталоги макетов и конструктора ===================
app.get("/api/workshop/items", (req, res) => {
  const { category } = req.query;
  const items =
    typeof category === "string"
      ? workshopItems.filter((item) => item.category === category)
      : workshopItems;

  res.json({
    items,
    updatedAt: new Date().toISOString(),
  });
});

app.get("/api/builder/catalog", (req, res) => {
  res.json({
    ...builderCatalog,
    updatedAt: new Date().toISOString(),
  });
});

app.get("/api/chatbot/faqs", (req, res) => {
  const lang = typeof req.query.lang === "string" ? req.query.lang : "ru";
  res.json({
    suggestions: getFaqSuggestions(lang),
    updatedAt: new Date().toISOString(),
  });
});

app.post("/api/chatbot/message", (req, res) => {
  const lang = typeof req.body?.lang === "string" ? req.body.lang : "ru";
  const message = typeof req.body?.message === "string" ? req.body.message : "";
  res.json({
    ...answerQuestion(message, lang),
    updatedAt: new Date().toISOString(),
  });
});

app.get("/api/builder/state/:id", (req, res) => {
  const stateId = String(req.params.id || "default").trim() || "default";
  const row = db.prepare("SELECT id, payload, updatedAt FROM builder_state WHERE id = ?").get(stateId);

  if (!row) {
    res.json({ id: stateId, payload: null, updatedAt: null });
    return;
  }

  try {
    res.json({
      id: row.id,
      payload: JSON.parse(row.payload),
      updatedAt: row.updatedAt,
    });
  } catch {
    res.status(500).json({ error: "Saved builder state is corrupted" });
  }
});

app.put("/api/builder/state/:id", (req, res) => {
  const stateId = String(req.params.id || "default").trim() || "default";
  const payload = req.body?.payload;

  if (!payload || typeof payload !== "object") {
    res.status(400).json({ error: "Payload object is required" });
    return;
  }

  const updatedAt = new Date().toISOString();
  db.prepare(
    `INSERT INTO builder_state (id, payload, updatedAt)
     VALUES (?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET payload = excluded.payload, updatedAt = excluded.updatedAt`
  ).run(stateId, JSON.stringify(payload), updatedAt);

  res.json({ id: stateId, updatedAt });
});

// =================== Технологии (пример) ===================
app.get("/api/technologies", (req, res) => {
  const rows = db.prepare("SELECT * FROM technologies").all();
  res.json(rows);
});

app.post("/api/technologies", (req, res) => {
  const { title, description, iconBg, iconColor } = req.body;
  const stmt = db.prepare(
    "INSERT INTO technologies (title, description, iconBg, iconColor) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(title, description, iconBg, iconColor);
  const newTech = db.prepare("SELECT * FROM technologies WHERE id = ?").get(info.lastInsertRowid);
  res.json(newTech);
});

// =================== Тестовый маршрут ===================
app.get("/", (req, res) => res.send("Server OK"));

// =================== Запуск ===================
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
