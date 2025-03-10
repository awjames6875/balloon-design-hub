
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ColorBalloonData {
  color: string  
  balloons11: number
  balloons16: number
}

export const updateInventory = async (balloonsPerColor: ColorBalloonData[]): Promise<boolean> => {
  console.log("Starting inventory update with:", balloonsPerColor)
  
  for (const colorData of balloonsPerColor) {
    const colorName = colorData.color
    console.log(`Processing ${colorName}: ${colorData.balloons11} 11" and ${colorData.balloons16} 16" balloons`)

    try {
      // Get all inventory for this color (case-insensitive)
      const { data: allInventory, error: inventoryError } = await supabase
        .from('balloon_inventory')
        .select('*')
        .ilike('color', colorName)
      
      if (inventoryError) {
        console.error(`Error fetching inventory for ${colorName}:`, inventoryError)
        toast.error(`Error checking inventory for ${colorName} balloons`)
        return false
      }

      console.log(`All inventory for ${colorName}:`, allInventory)
      
      // Find 11" balloons
      const data11 = allInventory?.find(item => 
        item.color.toLowerCase() === colorName.toLowerCase() && 
        item.size === '11in'
      )

      if (!data11) {
        // If no inventory exists, create a new record
        const { error: insertError11 } = await supabase
          .from('balloon_inventory')
          .insert([
            {
              color: colorName,
              size: '11in',
              quantity: colorData.balloons11
            }
          ])

        if (insertError11) {
          console.error(`Error creating inventory for ${colorName} 11" balloons:`, insertError11)
          toast.error(`Failed to create inventory for ${colorName} 11" balloons`)
          return false
        }
      } else {
        // Update existing inventory
        const newQuantity11 = data11.quantity - colorData.balloons11
        if (newQuantity11 < 0) {
          toast.error(`Insufficient inventory for ${colorName} 11" balloons`)
          return false
        }

        const { error: updateError11 } = await supabase
          .from('balloon_inventory')
          .update({ quantity: newQuantity11 })
          .eq('id', data11.id)

        if (updateError11) {
          console.error('Error updating 11" balloon inventory:', updateError11)
          toast.error(`Failed to update inventory for ${colorName} 11" balloons`)
          return false
        }
      }

      // Find 16" balloons
      const data16 = allInventory?.find(item => 
        item.color.toLowerCase() === colorName.toLowerCase() && 
        item.size === '16in'
      )

      if (!data16) {
        // If no inventory exists, create a new record
        const { error: insertError16 } = await supabase
          .from('balloon_inventory')
          .insert([
            {
              color: colorName,
              size: '16in',
              quantity: colorData.balloons16
            }
          ])

        if (insertError16) {
          console.error(`Error creating inventory for ${colorName} 16" balloons:`, insertError16)
          toast.error(`Failed to create inventory for ${colorName} 16" balloons`)
          return false
        }
      } else {
        // Update existing inventory
        const newQuantity16 = data16.quantity - colorData.balloons16
        if (newQuantity16 < 0) {
          toast.error(`Insufficient inventory for ${colorName} 16" balloons`)
          return false
        }

        const { error: updateError16 } = await supabase
          .from('balloon_inventory')
          .update({ quantity: newQuantity16 })
          .eq('id', data16.id)

        if (updateError16) {
          console.error('Error updating 16" balloon inventory:', updateError16)
          toast.error(`Failed to update inventory for ${colorName} 16" balloons`)
          return false
        }
      }

      console.log(`Successfully updated inventory for ${colorName}`)
    } catch (error) {
      console.error(`Error processing ${colorName}:`, error)
      toast.error(`Unexpected error updating inventory for ${colorName}`)
      return false
    }
  }

  toast.success("Inventory updated successfully")
  return true
}

export const checkInventoryLevels = async (colors: string[]): Promise<boolean> => {
  for (const color of colors) {
    // Get all inventory for this color (case-insensitive)
    const { data: allInventory } = await supabase
      .from('balloon_inventory')
      .select('*')
      .ilike('color', color)
    
    const data11 = allInventory?.find(item => 
      item.color.toLowerCase() === color.toLowerCase() && 
      item.size === '11in'
    )
    
    const data16 = allInventory?.find(item => 
      item.color.toLowerCase() === color.toLowerCase() && 
      item.size === '16in'
    )

    if (!data11 || !data16 || data11.quantity < 100 || data16.quantity < 50) {
      toast.warning(`Low inventory for ${color} balloons`)
      return false
    }
  }

  return true
}
