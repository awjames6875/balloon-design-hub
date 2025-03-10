
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const updateBalloonQuantity = async (
  id: number,
  newQuantity: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("balloon_inventory")
      .update({ 
        quantity: newQuantity,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)

    if (error) {
      console.error("Error updating balloon quantity:", error)
      toast.error("Failed to update balloon quantity")
      return false
    }

    toast.success("Quantity updated successfully")
    return true
  } catch (error) {
    console.error("Error in updateBalloonQuantity:", error)
    toast.error("An unexpected error occurred")
    return false
  }
}
