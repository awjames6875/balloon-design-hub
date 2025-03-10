
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const updateBalloonInventory = async (
  dataRecord: any, 
  colorName: string, 
  size: string, 
  quantity: number
) => {
  if (!dataRecord) {
    // If no inventory exists, create a new record
    const { error: insertError } = await supabase
      .from('balloon_inventory')
      .insert([
        {
          color: colorName,
          size: size,
          quantity: quantity
        }
      ])

    if (insertError) {
      console.error(`Error creating inventory for ${colorName} ${size} balloons:`, insertError)
      toast.error(`Failed to create inventory for ${colorName} ${size} balloons`)
      return false
    }
    return true
  } else {
    // Update existing inventory
    const newQuantity = dataRecord.quantity - quantity
    if (newQuantity < 0) {
      toast.error(`Insufficient inventory for ${colorName} ${size} balloons`)
      return false
    }

    const { error: updateError } = await supabase
      .from('balloon_inventory')
      .update({ quantity: newQuantity })
      .eq('id', dataRecord.id)

    if (updateError) {
      console.error(`Error updating ${size} balloon inventory:`, updateError)
      toast.error(`Failed to update inventory for ${colorName} ${size} balloons`)
      return false
    }
    return true
  }
}
