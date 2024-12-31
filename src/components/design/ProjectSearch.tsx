import { Command } from "@/components/ui/command"
import { useProjectSearch } from "./search/use-project-search"

export const ProjectSearch = ({
  onProjectSelected,
}: {
  onProjectSelected: (project: { client_name: string; project_name: string }) => void
}) => {
  const { data: projects, isLoading } = useProjectSearch()

  // Ensure we have a valid array even when data is loading or undefined
  const safeProjects = projects || []

  return (
    <Command className="rounded-lg border shadow-md">
      <Command.Input placeholder="Search all projects..." />
      <Command.List>
        {isLoading ? (
          <Command.Loading>Loading...</Command.Loading>
        ) : safeProjects.length === 0 ? (
          <Command.Empty>No projects found.</Command.Empty>
        ) : (
          safeProjects.map((project) => (
            <Command.Item
              key={`${project.client_name}-${project.project_name}`}
              value={`${project.client_name} - ${project.project_name}`}
              onSelect={() => onProjectSelected(project)}
            >
              {project.client_name} - {project.project_name}
            </Command.Item>
          ))
        )}
      </Command.List>
    </Command>
  )
}