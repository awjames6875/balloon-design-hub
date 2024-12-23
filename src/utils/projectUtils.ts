import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { calculateBalloonRequirements } from "./balloonCalculations"

interface SaveProjectParams {
  clientName: string
  projectName: string
  length: string
  colors: string[]
  style: string
  shape: string
}

export const saveProject = async ({
  clientName,
  projectName,
  length,
  colors,
  style,
  shape,
}: SaveProjectParams) => {
  try {
    // Check if project already exists
    const { data: existingProject } = await supabase
      .from("client_projects")
      .select("id")
      .eq("client_name", clientName)
      .eq("project_name", projectName)
      .maybeSingle()

    // Only insert if project doesn't exist
    if (!existingProject) {
      const { error: projectError } = await supabase
        .from("client_projects")
        .insert([{
          client_name: clientName,
          project_name: projectName,
        }])

      if (projectError) {
        console.error("Error saving client project:", projectError)
        toast.error("Failed to save client project")
        return false
      }
    }

    const calculations = await calculateBalloonRequirements(parseInt(length), shape)
    
    if (!calculations) {
      toast.error("Could not find balloon formula for the selected dimensions and style")
      return false
    }

    // Save production details
    const { error: productionError } = await supabase
      .from("production_details")
      .insert([{
        client_name: clientName,
        project_name: projectName,
        dimensions_ft: parseInt(length),
        colors: colors,
        base_clusters: calculations.baseClusters,
        extra_clusters: calculations.extraClusters,
        total_clusters: calculations.totalClusters,
        littles_quantity: calculations.littlesQuantity,
        grapes_quantity: calculations.grapesQuantity,
        balloons_11in: calculations.balloons11in,
        balloons_16in: calculations.balloons16in,
        total_balloons: calculations.totalBalloons,
        shape: shape,
      }])

    if (productionError) {
      console.error("Error saving production details:", productionError)
      toast.error("Failed to save production details")
      return false
    }

    toast.success("Project saved successfully!")
    return true
  } catch (error) {
    console.error("Error saving project:", error)
    toast.error("Failed to save project")
    return false
  }
}