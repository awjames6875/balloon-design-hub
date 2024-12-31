import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useProjectSearch = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("client_projects")
        .select("client_name, project_name")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching projects:", error)
        throw error
      }

      return data || [] // Ensure we always return an array
    },
    initialData: [], // Provide initial empty array
  })
}