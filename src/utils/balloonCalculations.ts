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
    console.error("Error calculating balloon requirements:", error)
    throw error
  }
}