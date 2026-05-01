import { useEffect, useState } from "react";
import ButtonWithExplosion from "../Button/button"
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./work-shop.scss";

function WorkShop() {
  const { t } = useThemeLang();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const items = Array.from({ length: 17 }, (_, i) => ({
    id: i,
    title: t("workshop.card.prefix", { number: i + 1 }),
    text: t("workshop.card.text"),
    img: "./img/temp.jpg",
  }));

  // Пагинация
  const perPage = 6;
  const totalPages = Math.ceil(items.length / perPage);
  const pageItems = items.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="workshop-section">
      <h1 className="workshop-title scroll-animate">{t("workshop.title")}</h1>

      <div className="workshop-grid">
        {pageItems.map((item) => (
          <div className="workshop-card-wrapper scroll-animate" key={item.id}>
            {loading ? (
              <Card className="workshop-card skeleton">
                <Card.Img variant="top" src="holder.js/300x180" />

                <Card.Body>
                  <Placeholder as={Card.Title} animation="glow">
                    <Placeholder xs={6} />
                  </Placeholder>

                  <Placeholder as={Card.Text} animation="glow">
                    <Placeholder xs={7} /> <Placeholder xs={4} />
                    <Placeholder xs={6} /> <Placeholder xs={8} />
                  </Placeholder>

                  <Placeholder.Button variant="primary" xs={6} />
                </Card.Body>
              </Card>
            ) : (
              <Card className="workshop-card">
                <Card.Img variant="top" src={item.img} />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.text}</Card.Text>

                  <div className="buttons">
                    <ButtonWithExplosion color="blue">500 $</ButtonWithExplosion>
                    <ButtonWithExplosion color="orange">{t("workshop.review")}</ButtonWithExplosion>
                  </div>
                </Card.Body>
              </Card>
            )}
          </div>
        ))}
      </div>

      {/* Пагинация */}
      {!loading && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? "active" : ""}`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkShop;
