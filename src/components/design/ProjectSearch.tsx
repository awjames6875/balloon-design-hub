import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
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
      <CommandInput placeholder="Search all projects..." />
      <CommandList>
        {isLoading ? (
          <CommandEmpty>Loading...</CommandEmpty>
        ) : safeProjects.length === 0 ? (
          <CommandEmpty>No projects found.</CommandEmpty>
        ) : (
          <CommandGroup>
            {safeProjects.map((project) => (
              <CommandItem
                key={`${project.client_name}-${project.project_name}`}
                value={`${project.client_name} - ${project.project_name}`}
                onSelect={() => onProjectSelected(project)}
              >
                {project.client_name} - {project.project_name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  )
}