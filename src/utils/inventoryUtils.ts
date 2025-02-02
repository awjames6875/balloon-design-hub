import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface InventoryUpdate {
  color: string
  size: string
  quantity: number
}

export const updateInventoryQuantities = async (updates: InventoryUpdate[]): Promise<boolean> => {
  for (const update of updates) {
    // First get current quantity
    const { data, error } = await supabase
      .from("balloon_inventory")
      .select("quantity")
      .eq("color", update.color)
      .eq("size", update.size)
      .single()

    if (error) {
      console.error("Error checking inventory:", error)
      toast.error(`Failed to check inventory for ${update.color} ${update.size}`)
      return false
    }

    // Calculate new quantity
    const newQuantity = data.quantity - update.quantity
    if (newQuantity < 0) {
      toast.error(`Insufficient inventory for ${update.color} ${update.size}`)
      return false
    }

    // Update the quantity
    const { error: updateError } = await supabase
      .from("balloon_inventory")
      .update({ quantity: newQuantity })
      .eq("color", update.color)
      .eq("size", update.size)

    if (updateError) {
      console.error("Error updating inventory:", updateError)
      toast.error(`Failed to update inventory for ${update.color} ${update.size}`)
      return false
    }
  }

  toast.success("Inventory updated successfully")
  return true
}