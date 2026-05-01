const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 5000;

// Разрешаем запросы с любого фронтенда
app.use(cors());
app.use(express.json());

// =================== Комментарии ===================

// Получить все комментарии
app.get("/api/comments", (req, res) => {
  const rows = db.prepare("SELECT * FROM comments ORDER BY id DESC").all();
  res.json(rows);
});

// Добавить новый комментарий
app.post("/api/comments", (req, res) => {
  const { user, text, rating } = req.body;

  if (!text) return res.status(400).json({ error: "Text is required" });

  const stmt = db.prepare(
    "INSERT INTO comments (user, text, rating, date) VALUES (?, ?, ?, ?)"
  );
  const info = stmt.run(user || "Anonymous", text, rating || 5, new Date().toISOString());

  const newComment = db.prepare("SELECT * FROM comments WHERE id = ?").get(info.lastInsertRowid);
  res.json(newComment);
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
