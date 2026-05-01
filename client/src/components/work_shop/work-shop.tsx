import { useEffect, useMemo, useState } from "react";
import ButtonWithExplosion from "../Button/button"
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import { ArrowUpRight, BadgeDollarSign, Eye, Layers3, Sparkles } from "lucide-react";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./work-shop.scss";

type WorkshopCategory = "sites" | "apps" | "bots";

const previewImages = [
  "./img/banner/gearlabs-web-3d-v2.jpg",
  "./img/banner/gearlabs-app-3d-v2.jpg",
  "./img/banner/gearlabs-bot-3d-v2.jpg",
];

function WorkShop() {
  const { t } = useThemeLang();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState<WorkshopCategory>("sites");

  const categories = useMemo(
    () => [
      { id: "sites" as const, label: t("workshop.tabs.sites"), type: "Landing", img: previewImages[0] },
      { id: "apps" as const, label: t("workshop.tabs.apps"), type: "Dashboard", img: previewImages[1] },
      { id: "bots" as const, label: t("workshop.tabs.bots"), type: "Automation", img: previewImages[2] },
    ],
    [t]
  );

  const items = Array.from({ length: 18 }, (_, i) => {
    const category = categories[i % categories.length];

    return {
      id: i,
      category: category.id,
      title: t("workshop.card.prefix", { number: i + 1 }),
      text: t("workshop.card.text"),
      img: category.img,
      type: category.type,
      time: [t("workshop.time.0"), t("workshop.time.1"), t("workshop.time.2")][i % 3],
    };
  });

  // Пагинация
  const perPage = 6;
  const filteredItems = items.filter((item) => item.category === activeCategory);
  const totalPages = Math.ceil(filteredItems.length / perPage);
  const pageItems = filteredItems.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [activeCategory]);

  return (
    <div className="workshop-section">
      <div className="section-heading workshop-heading">
        <span className="section-eyebrow scroll-animate">
          <Sparkles size={18} />
          {t("eyebrow.catalog")}
        </span>
        <div className="workshop-heading-row">
          <h1 className="workshop-title scroll-animate">{t("workshop.title")}</h1>
          <div className="workshop-summary scroll-animate">
            <Layers3 size={20} />
            <span>{t("workshop.summary")}</span>
          </div>
        </div>
      </div>

      <div className="workshop-tabs scroll-animate" role="tablist" aria-label={t("workshop.title")}>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={activeCategory === category.id}
            className={`workshop-tab ${activeCategory === category.id ? "active" : ""}`}
            onClick={() => setActiveCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

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
                <div className="workshop-preview">
                  <Card.Img variant="top" src={item.img} />
                  <span className="layout-type">{item.type}</span>
                  <span className="layout-time">{item.time}</span>
                </div>
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>{item.text}</Card.Text>

                  <div className="buttons">
                    <ButtonWithExplosion color="blue">
                      <BadgeDollarSign size={18} />
                      500 $
                    </ButtonWithExplosion>
                    <ButtonWithExplosion color="orange">
                      <Eye size={18} />
                      {t("workshop.review")}
                    </ButtonWithExplosion>
                  </div>
                </Card.Body>
                <ArrowUpRight className="card-corner-icon" size={24} />
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
