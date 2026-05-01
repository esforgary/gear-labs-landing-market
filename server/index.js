const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5050;
const avatarColors = ["#FF6B6B", "#91e59cff", "#3777d1ff", "#b377e4ff", "#e29555ff"];

// Разрешаем запросы с любого фронтенда
app.use(cors());
app.use(express.json());

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
