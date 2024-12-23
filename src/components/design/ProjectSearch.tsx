import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChevronDown } from "lucide-react"

interface ClientProject {
  client_name: string
  project_name: string
}

interface ProjectSearchProps {
  existingProjects: ClientProject[]
  onProjectSelect: (project: ClientProject) => void
}

export const ProjectSearch = ({ existingProjects, onProjectSelect }: ProjectSearchProps) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-2">
      <Label htmlFor="projectSearch">Search Existing Projects</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            Search projects...
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder="Search projects..." />
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              {existingProjects.map((project, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => {
                    onProjectSelect(project)
                    setOpen(false)
                  }}
                >
                  {project.client_name} - {project.project_name}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}