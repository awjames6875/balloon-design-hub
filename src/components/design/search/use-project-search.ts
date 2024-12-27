import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Project {
  client_name: string
  project_name: string
}

export const useProjectSearch = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("client_projects")
          .select("client_name, project_name")
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          return []
        }

        return data || []
      } catch (error) {
        console.error("Error in project search:", error)
        return []
      }
    },
    initialData: [],
  })

  return {
    projects: projects || [],
    isLoading,
  }
}