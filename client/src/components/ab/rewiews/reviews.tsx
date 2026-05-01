import React, { useCallback, useEffect, useRef, useState } from "react";
import "./reviews.scss";

interface ReviewItem {
  id: number;
  user?: string;
  name: string;
  date: string;
  rating: number;
  text: string;
  avatarColor: string;
}

const avatarColors = ["#FF6B6B", "#91e59cff", "#3777d1ff", "#b377e4ff", "#e29555ff"];
const apiBaseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "";
const API_URL = `${apiBaseUrl}/api/comments`;
const localReviewsKey = "gearlabs-local-reviews";
const fallbackReviews: ReviewItem[] = [
  {
    id: 1,
    name: "Alice",
    date: "1 May 13:22",
    rating: 4,
    text: "Очень интересный продукт, понравилось всё, особенно внимание к деталям. Очень интересный продукт, понравилось всё, особенно внимание к деталям.",
    avatarColor: avatarColors[0],
  },
  {
    id: 2,
    name: "Bob",
    date: "1 May 13:22",
    rating: 5,
    text: "Отличная поддержка клиентов, помогли с настройкой быстро и удобно.",
    avatarColor: avatarColors[1],
  },
  {
    id: 3,
    name: "Charlie",
    date: "1 May 13:22",
    rating: 3,
    text: "В целом хороший сервис, но есть моменты, которые можно улучшить.",
    avatarColor: avatarColors[2],
  },
  {
    id: 4,
    name: "Diana",
    date: "1 May 13:22",
    rating: 4,
    text: "Продукт полностью соответствует описанию, буду рекомендовать друзьям.",
    avatarColor: avatarColors[3],
  },
  {
    id: 5,
    name: "Edward",
    date: "1 May 13:22",
    rating: 5,
    text: "Очень доволен, качественно, надежно и удобно.",
    avatarColor: avatarColors[4],
  },
];

const normalizeReview = (review: ReviewItem): ReviewItem => ({
  ...review,
  name: review.name || review.user || "Anonymous",
  rating: Math.min(5, Math.max(1, Number(review.rating) || 5)),
  avatarColor: review.avatarColor || avatarColors[0],
});

const colorForName = (name: string) => {
  const hash = [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return avatarColors[hash % avatarColors.length];
};

const readLocalReviews = (): ReviewItem[] => {
  try {
    const stored = localStorage.getItem(localReviewsKey);
    if (!stored) return [];
    return (JSON.parse(stored) as ReviewItem[]).map(normalizeReview);
  } catch {
    return [];
  }
};

const saveLocalReview = (review: ReviewItem) => {
  const nextReviews = [review, ...readLocalReviews()].slice(0, 20);
  localStorage.setItem(localReviewsKey, JSON.stringify(nextReviews));
};

const Reviews: React.FC = () => {
  const [allReviews, setAllReviews] = useState<ReviewItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [animatingIndex, setAnimatingIndex] = useState<number | null>(null); // fade-out
  const [enteringIndex, setEnteringIndex] = useState<number | null>(null);   // fade-in
  const [isSending, setIsSending] = useState(false);

  const [mainName, setMainName] = useState("");
  const [mainText, setMainText] = useState("");
  const [mainRating, setMainRating] = useState(0);
  const [modalReview, setModalReview] = useState<ReviewItem | null>(null);
  const allReviewsRef = useRef<ReviewItem[]>([]);

  const formatDate = (d: Date) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = d.getDate();
    const month = monthNames[d.getMonth()];
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${hours}:${minutes}`;
  };

  const loadReviews = useCallback(async () => {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Не удалось загрузить комментарии");
    }

    const data = await response.json() as ReviewItem[];
    const localReviews = readLocalReviews();
    const normalized = [
      ...localReviews,
      ...data.map(normalizeReview).filter((review) => !localReviews.some((localReview) => localReview.id === review.id)),
    ];
    allReviewsRef.current = normalized;
    setAllReviews(normalized);
    setReviews(normalized.slice(0, 3));
  }, []);

  const renderStars = (rating: number, clickable?: (idx: number) => void) => (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, idx) => (
        <svg
          key={idx}
          className={`star ${idx < rating ? "yellow" : "gray"}`}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          onClick={clickable ? () => clickable(idx + 1) : undefined}
        >
          <path
            fill="currentColor"
            d="M12.865 2.996a1 1 0 0 0-1.73 0L8.421 7.674a1.25 1.25 0 0 1-.894.608L2.44 9.05c-.854.13-1.154 1.208-.488 1.76l3.789 3.138c.35.291.515.75.43 1.197L5.18 20.35a1 1 0 0 0 1.448 1.072l4.79-2.522a1.25 1.25 0 0 1 1.164 0l4.79 2.522a1 1 0 0 0 1.448-1.072l-.991-5.205a1.25 1.25 0 0 1 .43-1.197l3.79-3.139c.665-.55.365-1.63-.49-1.759l-5.085-.768a1.25 1.25 0 0 1-.895-.608z"
          />
        </svg>
      ))}
    </div>
  );

  // Инициализация комментариев из базы
  useEffect(() => {
    loadReviews().catch(() => {
      const localReviews = readLocalReviews();
      const normalized = [...localReviews, ...fallbackReviews];
      allReviewsRef.current = normalized;
      setAllReviews(normalized);
      setReviews(normalized.slice(0, 3));
    });
  }, [loadReviews]);

  // Ротация: по очереди меняем позицию, берём следующий с шагом +3 (чтобы не было дубликатов на экране)
  useEffect(() => {
    let rotationStep = 0;

    const interval = setInterval(() => {
      const sourceReviews = allReviewsRef.current;
      if (sourceReviews.length < 4) return;

      const positionToChange = rotationStep % 3;
      rotationStep += 1;

      setAnimatingIndex(positionToChange);
      setEnteringIndex(null);

      setTimeout(() => {
        setReviews((prev) => {
          if (prev.length < 3) return prev;
          const newReviews = [...prev];
          const currentReview = newReviews[positionToChange];
          if (!currentReview) return newReviews;

          const currentIndexInFull = sourceReviews.findIndex(r => r.id === currentReview.id);
          const nextIndex = (currentIndexInFull + 3) % sourceReviews.length;
          newReviews[positionToChange] = sourceReviews[nextIndex];
          return newReviews;
        });

        setEnteringIndex(positionToChange);
        setAnimatingIndex(null);

        setTimeout(() => {
          setEnteringIndex(null);
        }, 400);
      }, 400);
    }, 5000);

    return () => clearInterval(interval);
  }, [allReviews]);

  const handleSend = async () => {
    const cleanText = mainText.trim();
    const cleanName = mainName.trim() || "Anonymous";
    const rating = mainRating || 5;

    if (!cleanText || isSending) return;

    setIsSending(true);

    try {
      let savedReview: ReviewItem;

      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: cleanName,
            text: cleanText,
            rating,
          }),
        });

        if (!response.ok) {
          throw new Error("Не удалось сохранить комментарий");
        }

        savedReview = normalizeReview(await response.json() as ReviewItem);
      } catch (error) {
        console.warn("API комментариев недоступен, отзыв сохранен локально.", error);
        savedReview = normalizeReview({
          id: Date.now(),
          name: cleanName,
          date: formatDate(new Date()),
          rating,
          text: cleanText,
          avatarColor: colorForName(cleanName),
        });
        saveLocalReview(savedReview);
      }

      const nextReviews = [savedReview, ...allReviewsRef.current];
      allReviewsRef.current = nextReviews;
      setAllReviews(nextReviews);
      setReviews(nextReviews.slice(0, 3));
      setMainText("");
      setMainName("");
      setMainRating(0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSending(false);
    }
  };

  const openModal = (r: ReviewItem) => setModalReview(r);
  const closeModal = () => setModalReview(null);

  const getAnimationClass = (index: number) => {
    if (animatingIndex === index) return "fade-out";
    if (enteringIndex === index) return "fade-in";
    return "";
  };

  return (
    <div className="reviews-wrapper">
      <div className="reviews-grid">
        <div className="column-left scroll-animate">
          <div className="main-review review-card">
            <div className="review-header">
              <div className="avatar" style={{ background: avatarColors[0] }}>
                {mainName[0]?.toUpperCase() || "?"}
              </div>
              <div className="name-date">
                <input placeholder="Имя Фамилия" value={mainName} onChange={(e) => setMainName(e.target.value)} />
                <span className="date">{formatDate(new Date())}</span>
              </div>
              {renderStars(mainRating, setMainRating)}
            </div>
            <textarea placeholder="Комментарий" value={mainText} onChange={(e) => setMainText(e.target.value)} />
            <button
              className={`send-arrow ${mainText.trim() ? "active" : ""}`}
              disabled={isSending || !mainText.trim()}
              onClick={handleSend}
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
                <path fill="currentColor" d="M2.345 2.245a1 1 0 0 1 1.102-.14l18 9a1 1 0 0 1 0 1.79l-18 9a1 1 0 0 1-1.396-1.211L4.613 13H10a1 1 0 1 0 0-2H4.613L2.05 3.316a1 1 0 0 1 .294-1.071z" />
              </svg>
            </button>
          </div>

          {/* Левый нижний — позиция 1 */}
          <div
            className={`review-card truncated ${getAnimationClass(1)}`}
            onClick={() => reviews[1] && openModal(reviews[1])}
            key={reviews[1]?.id ?? "left"}
          >
            <div className="review-header">
              <div className="avatar" style={{ background: reviews[1]?.avatarColor }}>
                {reviews[1]?.name[0]?.toUpperCase() || "?"}
              </div>
              <div className="name-date">
                <span className="name">{reviews[1]?.name}</span>
                <span className="date">{reviews[1]?.date}</span>
              </div>
              {renderStars(reviews[1]?.rating || 0)}
            </div>
            <div className="review-text">{reviews[1]?.text}</div>
          </div>
        </div>

        <div className="column-right scroll-animate">
          {/* Правый верхний — позиция 0 */}
          <div
            className={`review-card truncated ${getAnimationClass(0)}`}
            onClick={() => reviews[0] && openModal(reviews[0])}
            key={reviews[0]?.id ?? "right-top"}
          >
            <div className="review-header">
              <div className="avatar" style={{ background: reviews[0]?.avatarColor }}>
                {reviews[0]?.name[0]?.toUpperCase() || "?"}
              </div>
              <div className="name-date">
                <span className="name">{reviews[0]?.name}</span>
                <span className="date">{reviews[0]?.date}</span>
              </div>
              {renderStars(reviews[0]?.rating || 0)}
            </div>
            <div className="review-text">{reviews[0]?.text}</div>
          </div>

          {/* Правый нижний — позиция 2 */}
          <div
            className={`review-card truncated ${getAnimationClass(2)}`}
            onClick={() => reviews[2] && openModal(reviews[2])}
            key={reviews[2]?.id ?? "right-bottom"}
          >
            <div className="review-header">
              <div className="avatar" style={{ background: reviews[2]?.avatarColor }}>
                {reviews[2]?.name[0]?.toUpperCase() || "?"}
              </div>
              <div className="name-date">
                <span className="name">{reviews[2]?.name}</span>
                <span className="date">{reviews[2]?.date}</span>
              </div>
              {renderStars(reviews[2]?.rating || 0)}
            </div>
            <div className="review-text">{reviews[2]?.text}</div>
          </div>
        </div>
      </div>

      <div className={`modal-overlay ${modalReview ? "show" : ""}`} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          {modalReview && (
            <div className="review-card">
              <div className="review-header">
                <div className="avatar" style={{ background: modalReview.avatarColor }}>
                  {modalReview.name[0]?.toUpperCase() || "?"}
                </div>
                <div className="name-date">
                  <span className="name">{modalReview.name}</span>
                  <span className="date">{modalReview.date}</span>
                </div>
                {renderStars(modalReview.rating)}
              </div>
              <div className="review-text">{modalReview.text}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
