import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { useProjectSearch } from "./search/use-project-search"

interface ProjectSearchProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export const ProjectSearch = ({ onProjectSelect }: ProjectSearchProps) => {
  const [open, setOpen] = useState(false)
  const { projects, isLoading } = useProjectSearch()

  // Ensure projects is always an array even if undefined
  const safeProjects = projects || []

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search projects..." />
      <CommandEmpty>No projects found.</CommandEmpty>
      <CommandGroup>
        {isLoading ? (
          <CommandItem disabled>Loading projects...</CommandItem>
        ) : (
          safeProjects.map((project, index) => (
            <CommandItem
              key={`${project.client_name}-${project.project_name}-${index}`}
              onSelect={() => {
                onProjectSelect(project)
                setOpen(false)
              }}
            >
              {project.client_name} - {project.project_name}
            </CommandItem>
          ))
        )}
      </CommandGroup>
    </Command>
  )
}