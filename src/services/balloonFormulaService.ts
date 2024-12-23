import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const fetchBalloonFormula = async (size: number, shape: string) => {
  console.log("Fetching formula for size:", size, "and shape:", shape)
  
  const { data, error } = await supabase
    .from("balloonformula")
    .select()
    .eq("size_ft", size)
    .eq("shape", shape)
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    toast.error("Error fetching balloon formula")
    throw error
  }

  if (!data) {
    const errorMessage = `No formula found for size ${size}ft and shape ${shape}`
    console.error(errorMessage)
    toast.error(errorMessage)
    throw new Error(errorMessage)
  }

  console.log("Retrieved balloon formula:", data)
  return data
}

export const calculateBalloonRequirements = async (length: number, style: string) => {
  try {
    console.log("Calculating requirements for length:", length, "and style:", style)
    const formula = await fetchBalloonFormula(length, style)
    
    return {
      baseClusters: formula.base_clusters,
      extraClusters: formula.extra_clusters,
      totalClusters: formula.total_clusters,
      littlesQuantity: formula.littles_quantity,
      grapesQuantity: formula.grapes_quantity,
      balloons11in: formula.balloons_11in,
      balloons16in: formula.balloons_16in,
      totalBalloons: formula.total_balloons,
    }
  } catch (error) {
    console.error("Error calculating balloon requirements:", error)
    throw error
  }
}