import { ArrowRight, CircleHelp, CreditCard, FileText, LayoutTemplate, MousePointer2, Palette, PanelTop, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import ButtonWithExplosion from "../Button/button";
import { useThemeLang } from "../../context/ThemeLangContext";
import "./site-builder-promo.scss";

export default function SiteBuilderPromo() {
  const { t } = useThemeLang();
  const goToConstructor = () => {
    window.location.hash = "constructor";
  };

  return (
    <div className="site-builder-promo">
      <div className="section-heading site-builder-promo__heading">
        <span className="section-eyebrow scroll-animate">
          <CircleHelp size={18} />
          {t("builder.promo.eyebrow")}
        </span>
        <h1 className="scroll-animate">{t("builder.promo.title")}</h1>
      </div>

      <div className="site-builder-promo__panel scroll-animate">
        <div className="site-builder-promo__visual" aria-hidden="true">
          <div className="site-builder-promo__builder-shell">
            <div className="site-builder-promo__builder-head">
              <span />
              <span />
              <span />
              <strong>{t("builder.promo.visual.badge")}</strong>
            </div>

            <div className="site-builder-promo__builder-canvas">
              <div className="site-builder-promo__assembled-block site-builder-promo__assembled-block--nav">
                <strong>{t("builder.promo.visual.brand")}</strong>
                <span>{t("builder.promo.visual.nav")}</span>
                <button type="button">{t("builder.promo.visual.cta")}</button>
              </div>

              <div className="site-builder-promo__assembled-block site-builder-promo__assembled-block--hero">
                <div>
                  <small>{t("builder.promo.visual.step.hero")}</small>
                  <strong>{t("builder.promo.visual.heroTitle")}</strong>
                  <span>{t("builder.promo.visual.heroText")}</span>
                </div>
                <i />
              </div>

              <div className="site-builder-promo__assembled-grid">
                <span />
                <span />
                <span />
              </div>

              <div className="site-builder-promo__assembled-block site-builder-promo__assembled-block--form">
                <span>{t("builder.promo.visual.form")}</span>
                <button type="button">{t("builder.promo.visual.send")}</button>
              </div>
            </div>
          </div>

          <div className="site-builder-promo__block-stack">
            <span style={{ "--delay": "0s" } as CSSProperties}>
              <PanelTop size={15} />
              {t("builder.promo.visual.step.header")}
            </span>
            <span style={{ "--delay": "1.15s" } as CSSProperties}>
              <LayoutTemplate size={15} />
              {t("builder.promo.visual.step.hero")}
            </span>
            <span style={{ "--delay": "2.3s" } as CSSProperties}>
              <FileText size={15} />
              {t("builder.promo.visual.step.cards")}
            </span>
            <span style={{ "--delay": "3.45s" } as CSSProperties}>
              <CreditCard size={15} />
              {t("builder.promo.visual.step.form")}
            </span>
          </div>

          <MousePointer2 className="site-builder-promo__cursor" size={28} />

        </div>

        <div className="site-builder-promo__copy">
          <div className="site-builder-promo__copy-card">
            <span className="site-builder-promo__copy-kicker">
              <Sparkles size={16} />
              {t("builder.promo.copy.kicker")}
            </span>

            <p>{t("builder.promo.text")}</p>

            <div className="site-builder-promo__copy-metrics" aria-label={t("builder.promo.copy.metrics")}>
              <span>
                <strong>8+</strong>
                <small>{t("builder.promo.copy.metric.blocks")}</small>
              </span>
              <span>
                <strong>4</strong>
                <small>{t("builder.promo.copy.metric.colors")}</small>
              </span>
              <span>
                <strong>$</strong>
                <small>{t("builder.promo.copy.metric.price")}</small>
              </span>
            </div>
          </div>

          <div className="site-builder-promo__copy-flow">
            <div>
              <span><LayoutTemplate size={17} /></span>
              <div>
                <strong>{t("builder.promo.copy.flow.structure.title")}</strong>
                <small>{t("builder.promo.copy.flow.structure.text")}</small>
              </div>
            </div>
            <div>
              <span><Palette size={17} /></span>
              <div>
                <strong>{t("builder.promo.copy.flow.style.title")}</strong>
                <small>{t("builder.promo.copy.flow.style.text")}</small>
              </div>
            </div>
            <div>
              <span><CreditCard size={17} /></span>
              <div>
                <strong>{t("builder.promo.copy.flow.total.title")}</strong>
                <small>{t("builder.promo.copy.flow.total.text")}</small>
              </div>
            </div>
          </div>

          <ButtonWithExplosion className="site-builder-promo__button" color="orange" type="button" onClick={goToConstructor}>
            {t("builder.promo.button")}
            <ArrowRight size={20} />
          </ButtonWithExplosion>
        </div>
      </div>
    </div>
  );
}
