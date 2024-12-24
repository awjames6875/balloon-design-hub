import { supabase } from "@/integrations/supabase/client"

interface BalloonRequirements {
  baseClusters: number
  extraClusters: number
  totalClusters: number
  littlesQuantity: number
  grapesQuantity: number
  balloons11in: number
  balloons16in: number
  totalBalloons: number
}

export const calculateBalloonRequirements = async (length: number, style: string): Promise<BalloonRequirements> => {
  console.log("Fetching requirements for length:", length, "and style:", style)
  
  // Fetch the balloon formula from the database
  const { data: formulaData, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", length)
    .eq("shape", style)
    .order('id', { ascending: false })  // Get the most recent formula if multiple exist
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    throw new Error("Failed to fetch balloon requirements")
  }

  if (!formulaData) {
    console.warn("No formula found for length:", length, "and style:", style)
    throw new Error(`No formula found for ${length}ft ${style} style`)
  }

  // Return the formula from the database
  return {
    baseClusters: formulaData.base_clusters,
    extraClusters: formulaData.extra_clusters,
    totalClusters: formulaData.total_clusters,
    littlesQuantity: formulaData.littles_quantity,
    grapesQuantity: formulaData.grapes_quantity,
    balloons11in: formulaData.balloons_11in,
    balloons16in: formulaData.balloons_16in,
    totalBalloons: formulaData.total_balloons
  }
}