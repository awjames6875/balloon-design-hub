import { useState } from "react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { useProjectSearch } from "./search/use-project-search"

interface ProjectSearchProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export const ProjectSearch = ({ onProjectSelect }: ProjectSearchProps) => {
  const [inputValue, setInputValue] = useState("")
  const { projects, isLoading } = useProjectSearch()

  // Ensure projects is always an array even if undefined
  const safeProjects = projects || []

  return (
    <Command className="rounded-lg border shadow-md" shouldFilter={true}>
      <CommandInput 
        placeholder="Search projects..." 
        value={inputValue}
        onValueChange={setInputValue}
      />
      <CommandEmpty>
        {isLoading ? "Loading..." : "No projects found."}
      </CommandEmpty>
      <CommandGroup>
        {safeProjects.map((project, index) => (
          <CommandItem
            key={`${project.client_name}-${project.project_name}-${index}`}
            value={`${project.client_name}-${project.project_name}`}
            onSelect={() => {
              onProjectSelect(project)
              setInputValue("")
            }}
          >
            {project.client_name} - {project.project_name}
          </CommandItem>
        ))}
      </CommandGroup>
    </Command>
  )
}