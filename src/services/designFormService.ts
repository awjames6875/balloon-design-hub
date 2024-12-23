import { supabase } from "@/integrations/supabase/client"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"
import { toast } from "sonner"
import { DesignSpecsFormData } from "@/components/design/DesignSpecsForm"

export const saveDesignForm = async (formData: DesignSpecsFormData) => {
  try {
    const calculations = await calculateBalloonRequirements(parseInt(formData.length), formData.shape)
    
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
        colors: formData.colors,
        base_clusters: calculations.base_clusters,
        extra_clusters: calculations.extra_clusters,
        total_clusters: calculations.total_clusters,
        littles_quantity: calculations.littles_quantity,
        grapes_quantity: calculations.grapes_quantity,
        balloons_11in: calculations.balloons_11in,
        balloons_16in: calculations.balloons_16in,
        total_balloons: calculations.total_balloons,
        shape: formData.shape,
      }])

    if (productionError) {
      console.error("Error saving production details:", productionError)
      toast.error("Failed to save production details")
      return false
    }

    // Save client project if it doesn't exist
    const { error: projectError } = await supabase
      .from("client_projects")
      .insert([{
        client_name: formData.clientName,
        project_name: formData.projectName,
      }])
      .select()
      .single()

    if (projectError && !projectError.message.includes('duplicate key')) {
      console.error("Error saving client project:", projectError)
      toast.error("Failed to save client project")
      return false
    }

    toast.success("Design form saved successfully!")
    return true
  } catch (error) {
    console.error("Error saving design form:", error)
    toast.error("Failed to save design form")
    return false
  }
}