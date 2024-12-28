import { supabase } from "@/integrations/supabase/client"
import { ProductionDetails } from "@/types/production"
import { toast } from "sonner"

export const saveProductionDetails = async (details: ProductionDetails) => {
  const { data, error } = await supabase
    .from("production_details")
    .insert(details)
    .select()
    .single()

  if (error) {
    console.error("Error saving production details:", error)
    toast.error("Failed to save production details")
    throw error
  }

  toast.success("Production details saved successfully")
  return data
}