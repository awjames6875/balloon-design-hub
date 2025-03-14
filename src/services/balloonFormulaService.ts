import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const fetchBalloonFormula = async (size: number) => {
  console.log("Fetching formula for size:", size)
  
  const { data, error } = await supabase
    .from("balloonformula")
    .select()
    .eq("size_ft", size)
    .order('id', { ascending: false })  // Get the most recent formula if multiple exist
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    toast.error("Error fetching balloon formula")
    throw error
  }

  if (!data) {
    const errorMessage = `No formula found for size ${size}ft`
    console.error(errorMessage)
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }

  return data
}

export const calculateBalloonRequirements = async (length: number, style: string) => {
  try {
    // We ignore the style parameter since all styles use the same formula
    const formula = await fetchBalloonFormula(length)
    
    return {
      base_clusters: formula.base_clusters,
      extra_clusters: formula.extra_clusters,
      total_clusters: formula.total_clusters,
      littles_quantity: formula.littles_quantity,
      grapes_quantity: formula.grapes_quantity,
      balloons_11in: formula.balloons_11in,
      balloons_16in: formula.balloons_16in,
      total_balloons: formula.total_balloons,
    }
  } catch (error) {
    console.error("Error calculating balloon formula:", error)
    throw error
  }
}