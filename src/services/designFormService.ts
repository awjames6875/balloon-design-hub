import { supabase } from "@/integrations/supabase/client"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"
import { toast } from "sonner"
import { DesignSpecsFormData } from "@/components/design/DesignSpecsForm"

export const saveDesignForm = async (formData: DesignSpecsFormData) => {
  try {
    console.log("Saving design form with data:", formData)
    
    const calculations = await calculateBalloonRequirements(parseInt(formData.length), formData.style)
    
    if (!calculations) {
      toast.error("Could not calculate balloon requirements")
      return false
    }

    // First check if project exists
    const { data: existingProject } = await supabase
      .from("client_projects")
      .select("id")
      .eq("client_name", formData.clientName)
      .eq("project_name", formData.projectName)
      .maybeSingle()

    // Only insert if project doesn't exist
    if (!existingProject) {
      const { error: projectError } = await supabase
        .from("client_projects")
        .insert([{
          client_name: formData.clientName,
          project_name: formData.projectName,
        }])

      if (projectError && !projectError.message.includes('duplicate key')) {
        console.error("Error saving client project:", projectError)
        toast.error("Failed to save client project")
        return false
      }
    }

    // Save production details
    const { error: productionError } = await supabase
      .from("production_details")
      .insert([{
        client_name: formData.clientName,
        project_name: formData.projectName,
        dimensions_ft: parseInt(formData.length),
        colors: formData.colorClusters.map(c => c.color),
        base_clusters: calculations.baseClusters,
        extra_clusters: calculations.extraClusters,
        total_clusters: calculations.totalClusters,
        littles_quantity: calculations.littlesQuantity,
        grapes_quantity: calculations.grapesQuantity,
        balloons_11in: calculations.balloons11in,
        balloons_16in: calculations.balloons16in,
        total_balloons: calculations.totalBalloons,
        shape: formData.style,
        production_time: `${Math.floor((calculations.totalClusters * 15) / 60)}h ${(calculations.totalClusters * 15) % 60}m`
      }])

    if (productionError) {
      console.error("Error saving production details:", productionError)
      toast.error("Failed to save production details")
      return false
    }

    console.log("Design form saved successfully")
    toast.success("Design form saved successfully!")
    return true
  } catch (error) {
    console.error("Error saving design form:", error)
    toast.error(`Failed to save design form: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}