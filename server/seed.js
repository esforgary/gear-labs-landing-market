const db = require('./db');

const tempComments = [
  { name: "Alice", rating: 4, text: "Очень интересный продукт, понравилось всё, особенно внимание к деталям. Очень интересный продукт, понравилось всё, особенно внимание к деталям."},
  { name: "Bob", rating: 5, text: "Отличная поддержка клиентов, помогли с настройкой быстро и удобно."},
  { name: "Charlie", rating: 3, text: "В целом хороший сервис, но есть моменты, которые можно улучшить." },
  { name: "Diana", rating: 4, text: "Продукт полностью соответствует описанию, буду рекомендовать друзьям." },
  { name: "Edward", rating: 5, text: "Очень доволен, качественно, надежно и удобно." },
];

const formatDate = (d) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const hours = d.getHours().toString().padStart(2, "0");
  const minutes = d.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${hours}:${minutes}`;
};

// Добавляем в базу
tempComments.forEach(comment => {
  const stmt = db.prepare('INSERT INTO comments (user, text, rating, date) VALUES (?, ?, ?, ?)');
  stmt.run(comment.name, comment.text, comment.rating, formatDate(new Date()));
});

console.log('Комментарии успешно добавлены!');
