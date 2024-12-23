import { supabase } from "@/integrations/supabase/client"

export const calculateBalloonRequirements = async (length: number, style: string) => {
  console.log("Calculating requirements for length:", length, "and style:", style)
  
  const { data: formula, error } = await supabase
    .from("balloonformula")
    .select()
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    throw new Error("Failed to fetch balloon formula")
  }

  if (!formula) {
    console.error("No formula found for size:", length, "and style:", style)
    throw new Error(`No formula found for ${length}ft ${style} style`)
  }

  // Map the database fields to camelCase for frontend consistency
  return {
    baseClusters: formula.base_clusters,
    extraClusters: formula.extra_clusters,
    totalClusters: formula.total_clusters,
    littlesQuantity: formula.littles_quantity,
    grapesQuantity: formula.grapes_quantity,
    balloons11in: formula.balloons_11in,
    balloons16in: formula.balloons_16in,
    totalBalloons: formula.total_balloons
  }
}