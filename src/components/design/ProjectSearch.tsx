import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useProjectSearch } from "./search/use-project-search"

interface ProjectSearchProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export const ProjectSearch = ({ onProjectSelect }: ProjectSearchProps) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { data: projects = [], isLoading } = useProjectSearch()

  const handleSelect = (currentValue: string) => {
    setValue(currentValue)
    setOpen(false)
    const selectedProject = projects.find(
      (project) =>
        `${project.client_name} - ${project.project_name}` === currentValue
    )
    if (selectedProject) {
      onProjectSelect({
        client_name: selectedProject.client_name,
        project_name: selectedProject.project_name,
      })
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={isLoading}
        >
          {value
            ? value
            : isLoading
            ? "Loading..."
            : "Search existing projects..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup>
            {(projects || []).map((project) => {
              const projectValue = `${project.client_name} - ${project.project_name}`
              return (
                <CommandItem
                  key={projectValue}
                  value={projectValue}
                  onSelect={handleSelect}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === projectValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {projectValue}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}