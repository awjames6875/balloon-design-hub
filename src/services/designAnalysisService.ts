
import { supabase } from "@/integrations/supabase/client"
import { AIAnalysisData } from "@/utils/designCalculations"
import { toast } from "sonner"

export const saveDesignAnalysis = async (
  totalClusters: number,
  colors: string[],
  sizes: AIAnalysisData['sizes']
): Promise<{ id: number } | null> => {
  const { data: savedAnalysis, error } = await supabase
    .from('design_analysis')
    .insert([{
      clusters: totalClusters,
      colors: colors,
      sizes: sizes,
      total_balloons: totalClusters * 13
    }])
    .select()
    .single()

  if (error) {
    console.error('Error saving analysis to database:', error)
    toast.error('Failed to save analysis')
    return null
  }

  console.log("Saved design analysis with ID:", savedAnalysis.id)
  return savedAnalysis
}

export const updateDesignAnalysis = async (
  designId: number,
  clusters: number,
  sizes: AIAnalysisData['sizes']
): Promise<boolean> => {
  console.log(`Updating design analysis ${designId} with ${clusters} clusters`)
  
  const { error } = await supabase
    .from('design_analysis')
    .update({
      clusters: clusters,
      sizes: sizes,
      total_balloons: clusters * 13
    })
    .eq('id', designId)

  if (error) {
    console.error('Error updating analysis in database:', error)
    toast.error('Failed to update analysis')
    return false
  }

  console.log(`Successfully updated design analysis ${designId}`)
  return true
}
