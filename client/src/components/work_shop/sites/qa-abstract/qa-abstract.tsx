import "./qa-abstract.scss";
import { useThemeLang } from "../../../../context/ThemeLangContext";
import { getImportedProjectCopy } from "../../imported-project-copy";

export default function QaAbstract() {
  const { lang } = useThemeLang();
  return (
    <iframe
      className="qa-abstract-demo"
      src={`${import.meta.env.BASE_URL}imported/qa-abstract/index.html`}
      title={getImportedProjectCopy("qa-abstract", lang)!.title}
      sandbox="allow-scripts allow-same-origin allow-downloads allow-popups allow-popups-to-escape-sandbox"
      allow="clipboard-write"
    />
  );
}
