import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface Project {
  client_name: string
  project_name: string
}

export const useProjectSearch = () => {
  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: async (): Promise<Project[]> => {
      const { data, error } = await supabase
        .from('client_projects')
        .select('client_name, project_name')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching projects:', error)
        throw error
      }

      console.info('Fetched projects:', data)
      return data || [] // Ensure we always return an array
    }
  })

  return {
    projects: projects || [], // Ensure we always return an array even if data is undefined
    isLoading,
    error
  }
}