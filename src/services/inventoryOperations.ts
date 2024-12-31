import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { validateInventoryUpdate, checkExistingBalloon } from "@/utils/inventoryValidation"

export const addNewBalloonType = async (
  color: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  try {
    console.log("Adding new balloon type:", { color, size, quantity })
    const isValid = await validateInventoryUpdate(color, size, quantity)
    if (!isValid) return false

    const existingBalloon = await checkExistingBalloon(color, size)
    
    if (existingBalloon) {
      // Update existing balloon quantity
      const newQuantity = existingBalloon.quantity + quantity
      const { data: updateData, error: updateError } = await supabase
        .from("balloon_inventory")
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingBalloon.id)
        .select()
        .maybeSingle()

      if (updateError) {
        console.error("Error updating balloon quantity:", updateError)
        toast.error("Failed to update balloon quantity")
        return false
      }

      toast.success("Balloon quantity updated", {
        description: `Added ${quantity} to existing ${color} ${size} balloons. New total: ${newQuantity}`
      })
    } else {
      // Add new balloon type
      const { data: insertData, error: insertError } = await supabase
        .from("balloon_inventory")
        .insert([
          {
            color: color.trim(),
            size: size.trim(),
            quantity: quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .maybeSingle()

      if (insertError) {
        console.error("Error adding balloon type:", insertError)
        if (insertError.message.includes("Invalid color format")) {
          toast.error("Invalid color format", {
            description: "Please check the color name and try again"
          })
        } else {
          toast.error("Failed to add balloon type")
        }
        return false
      }

      toast.success("New balloon type added", {
        description: `Added ${color} ${size} balloons with quantity ${quantity}.`
      })
    }

    return true
  } catch (error) {
    console.error("Error in addNewBalloonType:", error)
    toast.error("An unexpected error occurred")
    return false
  }
}

export const updateBalloonQuantity = async (
  id: number,
  newQuantity: number
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from("balloon_inventory")
      .update({ quantity: newQuantity })
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