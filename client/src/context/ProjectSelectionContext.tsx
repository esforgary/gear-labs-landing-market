import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

export interface SelectedProject {
  id: number;
  title: string;
  price: string;
  type: string;
  category: string;
}

interface ProjectSelectionContextValue {
  selectedProject: SelectedProject | null;
  selectProject: (project: SelectedProject) => void;
}

const storageKey = "gearlabs-selected-project";
const ProjectSelectionContext = createContext<ProjectSelectionContextValue | null>(null);

export function ProjectSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(null);

  useEffect(() => {
    localStorage.removeItem(storageKey);
  }, []);

  const value = useMemo(
    () => ({
      selectedProject,
      selectProject: (project: SelectedProject) => {
        setSelectedProject(project);
      },
    }),
    [selectedProject]
  );

  return (
    <ProjectSelectionContext.Provider value={value}>
      {children}
    </ProjectSelectionContext.Provider>
  );
}

export function useProjectSelection() {
  const context = useContext(ProjectSelectionContext);

  if (!context) {
    throw new Error("useProjectSelection must be used within ProjectSelectionProvider");
  }

  return context;
}
