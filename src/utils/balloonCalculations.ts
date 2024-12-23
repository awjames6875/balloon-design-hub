import { supabase } from "@/integrations/supabase/client"

export const calculateBalloonRequirements = async (length: number, style: string) => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", length)
    .eq("shape", style)
    .maybeSingle()

  if (error) {
    console.error("Error fetching balloon formula:", error)
    throw error
  }

  if (!data) {
    throw new Error(`No formula found for length ${length}ft and style ${style}`)
  }

  return {
    baseClusters: data.base_clusters,
    extraClusters: data.extra_clusters,
    totalClusters: data.total_clusters,
    littlesQuantity: data.littles_quantity,
    grapesQuantity: data.grapes_quantity,
    balloons11in: data.balloons_11in,
    balloons16in: data.balloons_16in,
    totalBalloons: data.total_balloons
  }
}