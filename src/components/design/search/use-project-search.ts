import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Project {
  id: number
  client_name: string
  project_name: string
  created_at: string
}

export const useProjectSearch = () => {
  return useQuery({
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

      return (data || []) as Project[]
    },
  })
}