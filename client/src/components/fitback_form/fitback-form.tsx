import type { ReactNode } from "react";
import { ClipboardCheck, ExternalLink, FileArchive, LayoutTemplate, Mail, MessageSquareText, Paperclip, PenLine, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import ButtonWithExplosion from "../Button/button";
import { useThemeLang } from "../../context/ThemeLangContext";
import { useProjectSelection } from "../../context/ProjectSelectionContext";
import "./fitback-form.scss";

type FeatureTone = "orange" | "blue" | "silver";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  text: string;
  tone: FeatureTone;
  upload?: boolean;
  selected?: boolean;
  onClick?: () => void;
  href?: string;
  external?: boolean;
}

const googleFormsPlaceholderUrl = "https://docs.google.com/forms/";

export default function FitbackForm() {
  const { t } = useThemeLang();
  const { selectedProject } = useProjectSelection();

  const scrollToCatalog = () => {
    const element = document.getElementById("catalog");

    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", "#catalog");
    }
  };

  const featureItems: FeatureItem[] = [
    {
      icon: selectedProject ? <LayoutTemplate className="selected-project-icon" /> : <ShoppingBag />,
      title: t("fitback.feature.site.title"),
      text: selectedProject
        ? t("fitback.feature.project.selected", {
            name: selectedProject.title,
            price: selectedProject.price,
          })
        : t("fitback.feature.site.text"),
      tone: "orange",
      selected: Boolean(selectedProject),
      onClick: scrollToCatalog,
    },
    {
      icon: <PenLine />,
      title: t("fitback.feature.wishes.title"),
      text: t("fitback.feature.wishes.text"),
      tone: "blue",
      href: googleFormsPlaceholderUrl,
      external: true,
    },
    {
      icon: <FileArchive />,
      title: t("fitback.feature.content.title"),
      text: t("fitback.feature.content.text"),
      tone: "silver",
      upload: true,
    },
  ];

  const renderFeatureContent = (item: FeatureItem, index: number) => (
    <>
      <div className={`feature-box tone-${item.tone}`}>
        <span className="feature-number">{String(index + 1).padStart(2, "0")}</span>
        {item.upload ? (
          <label htmlFor="file-upload" aria-label={item.title}>
            {item.icon}
          </label>
        ) : (
          item.icon
        )}
      </div>
      <div className="feature-text">
        <h3>
          {item.title}
          {item.external && <ExternalLink size={20} />}
        </h3>
        <p>{item.text}</p>
      </div>
    </>
  );

  return (
    <section className="fitback-form-section">
      <div className="fitback-heading">
        <span className="fitback-eyebrow section-eyebrow scroll-animate">
          <ClipboardCheck size={18} />
          {t("fitback.form.badge")}
        </span>
        <h1 className="section-title scroll-animate">{t("fitback.title")}</h1>
      </div>

      <div className="fitback-form-wrapper">
        <div className="form-left">
          {featureItems.map((item, index) => {
            const className = [
              "feature-item",
              "scroll-animate",
              item.onClick || item.href ? "is-clickable" : "",
              item.selected ? "is-selected" : "",
            ].filter(Boolean).join(" ");

            if (item.href) {
              return (
                <a
                  className={className}
                  href={item.href}
                  key={item.title}
                  rel="noreferrer"
                  target="_blank"
                >
                  {renderFeatureContent(item, index)}
                </a>
              );
            }

            if (item.onClick) {
              return (
                <button className={className} key={item.title} onClick={item.onClick} type="button">
                  {renderFeatureContent(item, index)}
                </button>
              );
            }

            return (
              <article className={className} key={item.title}>
                {renderFeatureContent(item, index)}
              </article>
            );
          })}
          <input type="file" id="file-upload" className="hidden-upload" multiple />
        </div>

        <div className="form-right scroll-animate">
          <form className="form-container" onSubmit={(event) => event.preventDefault()}>
            <div className="form-orbit form-orbit-orange" />
            <div className="form-orbit form-orbit-blue" />

            <div className="form-title">
              <span>{t("fitback.form.title")}</span>
              <Sparkles size={30} />
            </div>

            <label className="form-field" htmlFor="name">
              <span className="field-icon">
                <UserRound size={24} />
              </span>
              <input type="text" id="name" placeholder=" " autoComplete="name" />
              <span className="field-label">{t("fitback.form.name")}</span>
            </label>

            <label className="form-field" htmlFor="contact">
              <span className="field-icon">
                <Mail size={24} />
              </span>
              <input type="text" id="contact" placeholder=" " autoComplete="email tel" />
              <span className="field-label">{t("fitback.form.contact")}</span>
            </label>

            <label className="form-field form-field-textarea" htmlFor="comment">
              <span className="field-icon">
                <MessageSquareText size={24} />
              </span>
              <textarea id="comment" placeholder=" " rows={6}></textarea>
              <span className="field-label">{t("fitback.form.comment")}</span>
            </label>

            <div className="form-footer">
              <label className="attach-pill" htmlFor="file-upload">
                <Paperclip size={18} />
              </label>
              <ButtonWithExplosion color="orange" type="submit">
                {t("fitback.form.submit")}
              </ButtonWithExplosion>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
