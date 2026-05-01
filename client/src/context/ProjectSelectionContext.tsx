import { createContext, useContext, useMemo, useState } from "react";
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

const readStoredProject = (): SelectedProject | null => {
  try {
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

export function ProjectSelectionProvider({ children }: { children: ReactNode }) {
  const [selectedProject, setSelectedProject] = useState<SelectedProject | null>(readStoredProject);

  const value = useMemo(
    () => ({
      selectedProject,
      selectProject: (project: SelectedProject) => {
        setSelectedProject(project);
        localStorage.setItem(storageKey, JSON.stringify(project));
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
