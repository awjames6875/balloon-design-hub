
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { validateInventoryUpdate, checkExistingBalloon } from "@/utils/inventoryValidation"
import { BalloonType } from "@/types/inventory"

export const addBalloonType = async (balloonType: BalloonType): Promise<boolean> => {
  try {
    console.log("Adding balloon type:", balloonType);
    
    // Check if a balloon with the same color and size already exists
    const existingBalloon = await checkExistingBalloon(balloonType.color, balloonType.size);
    
    if (existingBalloon) {
      console.log("Found existing balloon with same color and size:", existingBalloon);
      
      // Update existing balloon by adding to quantity
      const newQuantity = existingBalloon.quantity + balloonType.quantity;
      const { error: updateError } = await supabase
        .from("balloon_inventory")
        .update({ 
          quantity: newQuantity,
          updated_at: new Date().toISOString()
        })
        .eq("id", existingBalloon.id);
      
      if (updateError) {
        console.error("Error updating existing balloon:", updateError);
        throw new Error("Failed to update existing balloon quantity");
      }
      
      toast.success("Inventory updated", {
        description: `Added ${balloonType.quantity} to existing ${balloonType.color} ${balloonType.size} balloons`
      });
      
      return true;
    } else {
      // Insert new balloon type
      console.log("No existing balloon found, creating new entry:", balloonType);
      
      const { error: insertError } = await supabase
        .from("balloon_inventory")
        .insert([
          {
            color: balloonType.color,
            size: balloonType.size,
            quantity: balloonType.quantity,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]);
      
      if (insertError) {
        console.error("Error inserting new balloon type:", insertError);
        throw new Error("Failed to add new balloon type");
      }
      
      toast.success("New balloon type added", {
        description: `Added ${balloonType.color} ${balloonType.size} balloons with quantity ${balloonType.quantity}`
      });
      
      return true;
    }
  } catch (error) {
    console.error("Error in addBalloonType:", error);
    toast.error("Failed to add balloon type");
    return false;
  }
};

export const addNewBalloonType = async (
  color: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  try {
    console.log("Adding new balloon type:", { color, size, quantity })
    
    // Final validation before submission - only check if color is not empty
    if (!color || color.trim() === "") {
      console.error("Color validation failed at submission time")
      toast.error("Color name cannot be empty")
      return false
    }

    // Simplified validation that allows any non-empty color string
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
