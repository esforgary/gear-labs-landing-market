const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'mydatabase.db'));

// Создаем таблицы, если их нет
db.exec(`
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user TEXT,
  text TEXT,
  rating INTEGER,
  date TEXT,
  avatarColor TEXT
);
`);

const columns = db.prepare("PRAGMA table_info(comments)").all();
const hasAvatarColor = columns.some((column) => column.name === 'avatarColor');

if (!hasAvatarColor) {
  db.exec("ALTER TABLE comments ADD COLUMN avatarColor TEXT");
}

module.exports = db;
