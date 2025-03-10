
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
    
    // Final validation before submission
    if (!color || color.trim() === "") {
      console.error("Color validation failed at submission time")
      toast.error("Color name cannot be empty")
      return false
    }

    const isValid = await validateInventoryUpdate(color, size, quantity)
    if (!isValid) {
      console.error("Validation failed for balloon type")
      return false
    }

    // Make sure we have clean values
    const cleanColor = color.trim()
    const cleanSize = size.trim()
    
    console.log("Checking for existing balloon with values:", { cleanColor, cleanSize })
    const existingBalloon = await checkExistingBalloon(cleanColor, cleanSize)
    
    if (existingBalloon) {
      // Update existing balloon quantity
      console.log("Found existing balloon, updating quantity:", existingBalloon)
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

      console.log("Balloon quantity updated successfully:", updateData)
      toast.success("Balloon quantity updated", {
        description: `Added ${quantity} to existing ${cleanColor} ${cleanSize} balloons. New total: ${newQuantity}`
      })
      return true
    } else {
      // Add new balloon type
      console.log("No existing balloon found, inserting new balloon:", { 
        color: cleanColor, 
        size: cleanSize, 
        quantity 
      })
      
      const { data: insertData, error: insertError } = await supabase
        .from("balloon_inventory")
        .insert([
          {
            color: cleanColor,
            size: cleanSize,
            quantity: quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()

      if (insertError) {
        console.error("Error adding balloon type:", insertError)
        // Log the full error for debugging
        console.error("Full error details:", JSON.stringify(insertError, null, 2))
        
        toast.error("Failed to add balloon type", {
          description: "Please try again or contact support"
        })
        return false
      }

      console.log("Successfully added balloon:", insertData)
      toast.success("New balloon type added", {
        description: `Added ${cleanColor} ${cleanSize} balloons with quantity ${quantity}.`
      })
      return true
    }
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
