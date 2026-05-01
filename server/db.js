const Database = require('better-sqlite3');
const db = new Database('mydatabase.db');

// Создаем таблицы, если их нет
db.exec(`
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT,
  text TEXT,
  rating INTEGER,
  date TEXT
);
`);


module.exports = db;
