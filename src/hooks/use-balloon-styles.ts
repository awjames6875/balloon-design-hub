import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

interface BalloonStyle {
  style_name: string
  density_factor: number
  description: string | null
}

export const useBalloonStyles = () => {
  return useQuery({
    queryKey: ["balloonStyles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("balloon_styles")
        .select("*")
        .order("style_name")

      if (error) {
        console.error("Error fetching balloon styles:", error)
        throw error
      }

      return data as BalloonStyle[]
    },
  })
}