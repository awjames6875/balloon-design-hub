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
  console.log("Calculating requirements for length:", length, "and style:", style)
  
  // Always use 'Straight' calculations as per requirement
  const { data: formulaData, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", length)
    .eq("shape", "Straight")
    .order('id', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    throw new Error(`Failed to fetch balloon requirements: ${error.message}`)
  }

  if (!formulaData) {
    console.error("No formula found for:", { length, style })
    throw new Error(`No formula found for ${length}ft ${style} style`)
  }

  console.log("Using formula:", formulaData)

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