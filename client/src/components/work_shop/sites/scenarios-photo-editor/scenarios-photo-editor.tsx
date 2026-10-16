import { useThemeLang } from "../../../../context/ThemeLangContext";
import { getImportedProjectCopy } from "../../imported-project-copy";

export default function ScenariosPhotoEditor() {
  const { lang } = useThemeLang();
  return <iframe
    title={getImportedProjectCopy("scenarios-photo-editor", lang)!.title}
    src={`${import.meta.env.BASE_URL}imported/scenarios-photo-editor/index.html`}
    style={{ display: "block", width: "100%", height: "100%", minHeight: 520, border: 0, background: "#0d1117" }}
    allow="clipboard-read; clipboard-write"
  />;
}
