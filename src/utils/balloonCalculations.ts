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

const calculateClusters = (length: number) => {
  // Base calculation: 1 base cluster per 1.5 ft
  const baseClusters = Math.floor(length / 1.5)
  // Extras calculation: 1 extra per 1.5 base clusters
  const extraClusters = Math.ceil(baseClusters / 1.5)
  
  return {
    baseClusters,
    extraClusters,
    totalClusters: baseClusters + extraClusters
  }
}

const calculateBalloonQuantities = (totalClusters: number) => {
  // Calculate balloon quantities based on total clusters
  const littlesQuantity = totalClusters * 3 // 3 littles per cluster
  const grapesQuantity = totalClusters * 2 // 2 grapes per cluster
  const balloons11in = littlesQuantity // 11" balloons for littles
  const balloons16in = grapesQuantity // 16" balloons for grapes
  
  return {
    littlesQuantity,
    grapesQuantity,
    balloons11in,
    balloons16in,
    totalBalloons: littlesQuantity + grapesQuantity
  }
}

export const calculateBalloonRequirements = async (length: number, style: string): Promise<BalloonRequirements> => {
  console.log("Calculating requirements for length:", length, "and style:", style)
  
  // Calculate clusters using the new formula
  const { baseClusters, extraClusters, totalClusters } = calculateClusters(length)
  
  // Calculate balloon quantities
  const quantities = calculateBalloonQuantities(totalClusters)
  
  // Return combined calculations
  return {
    baseClusters,
    extraClusters,
    totalClusters,
    ...quantities
  }
}