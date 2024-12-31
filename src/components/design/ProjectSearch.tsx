import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Project {
  id: number
  client_name: string
  project_name: string
}

interface ProjectSearchProps {
  onProjectSelect: (project: Project) => void
}

export const ProjectSearch = ({ onProjectSelect }: ProjectSearchProps) => {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_projects")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        throw error
      }

      return data || []
    },
  })

  return (
    <Command className="rounded-lg border shadow-md">
      <CommandInput placeholder="Search projects..." />
      <CommandEmpty>No projects found.</CommandEmpty>
      {!isLoading && (
        <CommandGroup>
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              value={`${project.client_name} - ${project.project_name}`}
              onSelect={() => onProjectSelect(project)}
            >
              {project.client_name} - {project.project_name}
            </CommandItem>
          ))}
        </CommandGroup>
      )}
    </Command>
  )
}