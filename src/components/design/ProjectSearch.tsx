import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import { useProjectSearch } from "./search/use-project-search"

interface ProjectSearchProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export const ProjectSearch = ({ onProjectSelect }: ProjectSearchProps) => {
  const { projects, isLoading } = useProjectSearch()
  
  // Ensure we have a valid array of projects
  const validProjects = Array.isArray(projects) ? projects : []

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search previous projects..." />
      <CommandEmpty>{isLoading ? "Loading..." : "No projects found."}</CommandEmpty>
      {validProjects.length > 0 && (
        <CommandGroup>
          {validProjects.map((project) => (
            <CommandItem
              key={`${project.client_name}-${project.project_name}`}
              value={`${project.client_name}-${project.project_name}`}
              onSelect={() => onProjectSelect(project)}
            >
              <span>{project.client_name}</span>
              <span className="ml-2 text-muted-foreground">
                - {project.project_name}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  )
}