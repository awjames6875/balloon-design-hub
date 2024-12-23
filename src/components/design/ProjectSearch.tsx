import { ProjectSearchCombobox } from "./search/ProjectSearchCombobox"

interface ProjectSearchProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export function ProjectSearch({ onProjectSelect }: ProjectSearchProps) {
  return <ProjectSearchCombobox onProjectSelect={onProjectSelect} />
}