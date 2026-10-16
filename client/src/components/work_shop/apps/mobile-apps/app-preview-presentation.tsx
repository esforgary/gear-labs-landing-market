import "./app-preview-presentation.scss";

type AppPreviewCopyProps = {
  kicker: string;
  title: string;
  description: string;
  features: readonly string[];
};

export function AppPreviewCopy({ kicker, title, description, features }: AppPreviewCopyProps) {
  return (
    <aside className="mobile-app-preview__copy">
      <span className="mobile-app-preview__kicker">{kicker}</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <div className="mobile-app-preview__features">
        {features.map((feature) => <span key={feature}>{feature}</span>)}
      </div>
    </aside>
  );
}

export function PhoneStatusBar() {
  return (
    <div className="app-phone-status" aria-hidden="true">
      <span>9:41</span>
      <i />
      <b />
    </div>
  );
}
