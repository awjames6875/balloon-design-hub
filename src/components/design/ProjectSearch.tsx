import { useState } from "react"
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
  const [open, setOpen] = useState(false)
  const { projects, isLoading } = useProjectSearch()

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search previous projects..." />
      <CommandEmpty>No projects found.</CommandEmpty>
      {!isLoading && projects && projects.length > 0 && (
        <CommandGroup>
          {projects.map((project, index) => (
            <CommandItem
              key={index}
              value={`${project.client_name}-${project.project_name}`}
              onSelect={() => {
                onProjectSelect(project)
                setOpen(false)
              }}
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