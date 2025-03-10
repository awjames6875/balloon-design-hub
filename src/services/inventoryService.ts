
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ColorBalloonData {
  color: string  // Changed from colors to color
  balloons11: number
  balloons16: number
}

export const updateInventory = async (balloonsPerColor: ColorBalloonData[]): Promise<boolean> => {
  console.log("Starting inventory update with:", balloonsPerColor)
  
  for (const colorData of balloonsPerColor) {
    const colorName = colorData.color  // Using color instead of colors
    console.log(`Processing ${colorName}: ${colorData.balloons11} 11" and ${colorData.balloons16} 16" balloons`)

    try {
      // Update 11" balloons - Use case-insensitive search
      const { data: matches11, error: matchError11 } = await supabase
        .from('balloon_inventory')
        .select('id, quantity, color')
        .ilike('color', colorName)  // Using case-insensitive match
        .eq('size', '11in')
      
      if (matchError11) {
        console.error('Error checking 11" balloon inventory:', matchError11)
        toast.error(`Error checking inventory for ${colorName} 11" balloons`)
        return false
      }

      // Find best match or null
      const data11 = matches11 && matches11.length > 0 
        ? matches11.find(item => item.color.toLowerCase() === colorName.toLowerCase()) || matches11[0]
        : null

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

      // Update 16" balloons - Use case-insensitive search
      const { data: matches16, error: matchError16 } = await supabase
        .from('balloon_inventory')
        .select('id, quantity, color')
        .ilike('color', colorName)  // Using case-insensitive match
        .eq('size', '16in')
      
      if (matchError16) {
        console.error('Error checking 16" balloon inventory:', matchError16)
        toast.error(`Error checking inventory for ${colorName} 16" balloons`)
        return false
      }

      // Find best match or null
      const data16 = matches16 && matches16.length > 0
        ? matches16.find(item => item.color.toLowerCase() === colorName.toLowerCase()) || matches16[0]
        : null

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
    // Use case-insensitive queries for inventory check
    const { data: matches11 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .ilike('color', color)
      .eq('size', '11in')
    
    const data11 = matches11 && matches11.length > 0 ? matches11[0] : null
    
    const { data: matches16 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .ilike('color', color)
      .eq('size', '16in')
    
    const data16 = matches16 && matches16.length > 0 ? matches16[0] : null

    if (!data11 || !data16 || data11.quantity < 100 || data16.quantity < 50) {
      toast.warning(`Low inventory for ${color} balloons`)
      return false
    }
  }

  return true
}
