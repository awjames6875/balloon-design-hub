import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { DesignSpecsFormData } from "@/components/design/DesignSpecsForm"
import { calculateBalloonRequirements } from "./balloonFormulaService"

export const saveDesignForm = async (formData: DesignSpecsFormData) => {
  try {
    // Check if project already exists
    const { data: existingProject } = await supabase
      .from("client_projects")
      .select("id")
      .eq("client_name", formData.clientName)
      .eq("project_name", formData.projectName)
      .limit(1)
      .maybeSingle()

    // Only insert if project doesn't exist
    if (!existingProject) {
      const { error: projectError } = await supabase
        .from("client_projects")
        .insert([{
          client_name: formData.clientName,
          project_name: formData.projectName,
        }])

      if (projectError) {
        console.error("Error saving client project:", projectError)
        toast.error("Failed to save client project")
        return false
      }
    }

    const calculations = await calculateBalloonRequirements(parseInt(formData.length), formData.style)
    
    if (!calculations) {
      toast.error("Could not calculate balloon requirements")
      return false
    }

    // Save production details
    const { error: productionError } = await supabase
      .from("production_details")
      .insert([{
        client_name: formData.clientName,
        project_name: formData.projectName,
        dimensions_ft: parseInt(formData.length),
        width_ft: parseInt(formData.width),
        colors: formData.colors,
        base_clusters: calculations.baseClusters,
        extra_clusters: calculations.extraClusters,
        total_clusters: calculations.totalClusters,
        littles_quantity: calculations.littlesQuantity,
        grapes_quantity: calculations.grapesQuantity,
        balloons_11in: calculations.balloons11in,
        balloons_16in: calculations.balloons16in,
        total_balloons: calculations.totalBalloons,
        shape: formData.shape,
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