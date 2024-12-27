import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Project {
  client_name: string
  project_name: string
}

export const useProjectSearch = () => {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["completed-projects"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("production_details")
          .select("client_name, project_name")
          .order("creation_date", { ascending: false })

        if (error) {
          console.error("Error fetching projects:", error)
          return []
        }

        // Remove duplicates based on client_name and project_name combination
        const uniqueProjects = data?.reduce((acc: Project[], current) => {
          const exists = acc.some(
            project =>
              project.client_name === current.client_name &&
              project.project_name === current.project_name
          )
          if (!exists) {
            acc.push(current)
          }
          return acc
        }, []) || []

        console.log("Fetched projects:", uniqueProjects)
        return uniqueProjects
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