import { useState } from "react"
import { Search } from "lucide-react"
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
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ProjectSearchProps {
  onProjectSelect: (project: { client_name: string; project_name: string }) => void
}

export function ProjectSearch({ onProjectSelect }: ProjectSearchProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  const { data: projects = [], isError } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_projects")
        .select("*")
        .order("created_at", { ascending: false })
      
      if (error) {
        toast.error("Failed to load projects")
        throw error
      }
      
      return data || []
    },
  })

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
            ? projects.find(
                (project) =>
                  `${project.client_name} - ${project.project_name}` === value
              )?.project_name || "Search previous projects..."
            : "Search previous projects..."}
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandEmpty>No projects found.</CommandEmpty>
          <CommandGroup>
            {projects.map((project) => {
              const projectLabel = `${project.client_name} - ${project.project_name}`
              return (
                <CommandItem
                  key={project.id}
                  value={projectLabel}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue)
                    onProjectSelect(project)
                    setOpen(false)
                  }}
                >
                  {projectLabel}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}