import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ProductionDetails {
  clientName: string
  projectName: string
  dimensionsFt: number
  colors: string[]
  baseClusters: number
  extraClusters: number
  totalClusters: number
  littlesQuantity: number
  grapesQuantity: number
  balloons11in: number
  balloons16in: number
  totalBalloons: number
  accents: Record<string, number>
  productionTime: string
  shape: string
}

export const saveDesignToProduction = async (details: ProductionDetails) => {
  console.log("Saving production details to Supabase:", details)
  
  const { error } = await supabase
    .from("production_details")
    .insert([
      {
        client_name: details.clientName,
        project_name: details.projectName,
        dimensions_ft: details.dimensionsFt,
        colors: details.colors,
        base_clusters: details.baseClusters,
        extra_clusters: details.extraClusters,
        total_clusters: details.totalClusters,
        littles_quantity: details.littlesQuantity,
        grapes_quantity: details.grapesQuantity,
        balloons_11in: details.balloons11in,
        balloons_16in: details.balloons16in,
        total_balloons: details.totalBalloons,
        accents: details.accents,
        production_time: details.productionTime,
        shape: details.shape
      }
    ])

  if (error) {
    console.error("Error saving production details:", error)
    throw error
  }
}