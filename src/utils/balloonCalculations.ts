import { supabase } from "@/integrations/supabase/client"

export const fetchBalloonFormula = async (size: number, shape: string) => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select()
    .eq("size_ft", size)
    .eq("shape", shape)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    throw error
  }

  return data
}

export const calculateBalloonRequirements = async (length: number, style: string) => {
  try {
    const formula = await fetchBalloonFormula(length, style)
    
    if (!formula) {
      return null
    }

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