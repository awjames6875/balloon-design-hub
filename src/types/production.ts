import { Json } from "@/integrations/supabase/types"

export interface DesignState {
  clientName: string
  projectName: string
  length: string
  style: string
  shape: string
  colorClusters: Array<{
    color: string
    baseClusters: number
    extraClusters: number
  }>
  calculations: {
    baseClusters: number
    extraClusters: number
    totalClusters: number
    littlesQuantity: number
    grapesQuantity: number
    balloons11in: number
    balloons16in: number
    totalBalloons: number
  }
  imagePreview: string | null
  clientReference: string | null
  designAnalysisId?: number
}

export interface ProductionDetails {
  client_name: string
  project_name: string
  dimensions_ft: number
  shape: string
  colors: Json
  base_clusters: number
  extra_clusters: number
  total_clusters: number
  littles_quantity: number
  grapes_quantity: number
  balloons_11in: number
  balloons_16in: number
  total_balloons: number
  accents: Json
  production_time: string
  creation_date: string | null
  width_ft: number | null
  design_analysis_id: number | null
}