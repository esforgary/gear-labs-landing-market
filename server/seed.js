const db = require('./db');

const initialComments = [
  {
    name: "Alice",
    rating: 4,
    avatarColor: "#FF6B6B",
    text: "Очень интересный продукт, понравилось всё, особенно внимание к деталям. Очень интересный продукт, понравилось всё, особенно внимание к деталям.",
  },
  {
    name: "Bob",
    rating: 5,
    avatarColor: "#91e59cff",
    text: "Отличная поддержка клиентов, помогли с настройкой быстро и удобно.",
  },
  {
    name: "Charlie",
    rating: 3,
    avatarColor: "#3777d1ff",
    text: "В целом хороший сервис, но есть моменты, которые можно улучшить.",
  },
  {
    name: "Diana",
    rating: 4,
    avatarColor: "#b377e4ff",
    text: "Продукт полностью соответствует описанию, буду рекомендовать друзьям.",
  },
  {
    name: "Edward",
    rating: 5,
    avatarColor: "#e29555ff",
    text: "Очень доволен, качественно, надежно и удобно.",
  },
];

const formatDate = (d) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
};

const insertComment = db.prepare(
  'INSERT INTO comments (user, text, rating, date, avatarColor) VALUES (?, ?, ?, ?, ?)'
);
const updateComment = db.prepare(
  'UPDATE comments SET rating = ?, date = ?, avatarColor = ? WHERE id = ?'
);
const findComment = db.prepare(
  'SELECT id FROM comments WHERE user = ? AND text = ? LIMIT 1'
);
const seedDate = formatDate(new Date());

initialComments.forEach((comment) => {
  const existing = findComment.get(comment.name, comment.text);

  if (existing) {
    updateComment.run(comment.rating, seedDate, comment.avatarColor, existing.id);
    return;
  }

  insertComment.run(comment.name, comment.text, comment.rating, seedDate, comment.avatarColor);
});

console.log('Комментарии успешно синхронизированы с базой!');
