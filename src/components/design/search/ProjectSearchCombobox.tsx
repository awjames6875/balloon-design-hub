import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
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
import { useProjectSearch } from "./use-project-search"

interface ProjectSearchComboboxProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export const ProjectSearchCombobox = ({ onProjectSelect }: ProjectSearchComboboxProps) => {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const { data: projects = [], isError } = useProjectSearch()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? projects.find((project) => 
                `${project.client_name}-${project.project_name}` === value
              )?.project_name
            : "Search projects..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandEmpty>
            {isError ? "Failed to load projects." : "No projects found."}
          </CommandEmpty>
          <CommandGroup>
            {projects.map((project) => {
              const projectValue = `${project.client_name}-${project.project_name}`
              return (
                <CommandItem
                  key={projectValue}
                  value={projectValue}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onProjectSelect(project)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === projectValue ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {project.project_name} ({project.client_name})
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}