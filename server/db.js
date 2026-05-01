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

CREATE TABLE IF NOT EXISTS languages (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  flag TEXT NOT NULL,
  sortOrder INTEGER NOT NULL DEFAULT 0,
  enabled INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS translations (
  lang TEXT NOT NULL,
  namespace TEXT NOT NULL DEFAULT 'common',
  translationKey TEXT NOT NULL,
  value TEXT NOT NULL,
  PRIMARY KEY (lang, namespace, translationKey),
  FOREIGN KEY (lang) REFERENCES languages(code) ON DELETE CASCADE
);
`);

const columns = db.prepare("PRAGMA table_info(comments)").all();
const hasAvatarColor = columns.some((column) => column.name === 'avatarColor');

if (!hasAvatarColor) {
  db.exec("ALTER TABLE comments ADD COLUMN avatarColor TEXT");
}

module.exports = db;
