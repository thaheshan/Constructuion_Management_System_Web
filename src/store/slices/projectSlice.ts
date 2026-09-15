import { StateCreator } from 'zustand';
import { Project, Milestone } from '../../types/project';

export interface ProjectSlice {
  projects: Project[];
  selectedProject: Project | null;
  milestones: Milestone[];
  setProjects: (projects: Project[]) => void;
  selectProject: (project: Project) => void;
  addProject: (project: Project) => void;
}

export const createProjectSlice: StateCreator<ProjectSlice> = (set) => ({
  projects: [],
  selectedProject: null,
  milestones: [],
  setProjects: (projects) => set({ projects }),
  selectProject: (project) => set({ selectedProject: project }),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
});
