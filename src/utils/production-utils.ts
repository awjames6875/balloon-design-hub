import { DesignState, ProductionDetails } from "@/types/production"
import { Json } from "@/integrations/supabase/types"

export const calculateProductionTime = (totalClusters: number): string => {
  const minutes = totalClusters * 15
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export const createProductionDetails = (designState: DesignState): ProductionDetails => {
  return {
    client_name: designState.clientName,
    project_name: designState.projectName,
    dimensions_ft: parseInt(designState.length),
    shape: designState.shape,
    colors: designState.colorClusters.map(c => c.color) as Json,
    base_clusters: designState.calculations.baseClusters,
    extra_clusters: designState.calculations.extraClusters,
    total_clusters: designState.calculations.totalClusters,
    littles_quantity: designState.calculations.littlesQuantity,
    grapes_quantity: designState.calculations.grapesQuantity,
    balloons_11in: designState.calculations.balloons11in,
    balloons_16in: designState.calculations.balloons16in,
    total_balloons: designState.calculations.totalBalloons,
    accents: {} as Json,
    production_time: calculateProductionTime(designState.calculations.totalClusters),
    creation_date: null,
    width_ft: null,
    design_analysis_id: designState.designAnalysisId || null
  }
}