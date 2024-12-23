import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface Project {
  id: number
  client_name: string
  project_name: string
}

export function useProjectSearch() {
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
      
      return (data || []) as Project[]
    },
  })

  return { projects, isError }
}