import { FileArchive, Mail, MessageSquareText, Paperclip, PenLine, ShoppingBag, Sparkles, UserRound } from "lucide-react";
import ButtonWithExplosion from "../Button/button";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./fitback-form.scss";

export default function FitbackForm() {
  const { t } = useThemeLang();

  const featureItems = [
    {
      icon: <ShoppingBag />,
      title: t("fitback.feature.site.title"),
      text: t("fitback.feature.site.text"),
      tone: "orange",
    },
    {
      icon: <PenLine />,
      title: t("fitback.feature.wishes.title"),
      text: t("fitback.feature.wishes.text"),
      tone: "blue",
    },
    {
      icon: <FileArchive />,
      title: t("fitback.feature.content.title"),
      text: t("fitback.feature.content.text"),
      tone: "silver",
      upload: true,
    },
  ];

  return (
    <section className="fitback-form-section">
      <div className="fitback-heading">
        <span className="fitback-eyebrow section-eyebrow scroll-animate">
          <Sparkles size={18} />
          {t("fitback.form.badge")}
        </span>
        <h1 className="section-title scroll-animate">{t("fitback.title")}</h1>
      </div>

      <div className="fitback-form-wrapper">
        <div className="form-left">
          {featureItems.map((item, index) => (
            <article className="feature-item scroll-animate" key={item.title}>
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
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
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
