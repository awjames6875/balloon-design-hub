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
  
  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search previous projects..." />
      <CommandEmpty>
        {isLoading ? "Loading..." : "No completed projects found."}
      </CommandEmpty>
      <CommandGroup>
        {projects?.length > 0 ? (
          projects.map((project) => (
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
          ))
        ) : !isLoading && (
          <div className="py-2 px-4 text-sm text-muted-foreground">
            No projects found
          </div>
        )}
      </CommandGroup>
    </Command>
  )
}