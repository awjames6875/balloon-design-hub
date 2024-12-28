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
      // Update 11" balloons
      const { data: data11, error: error11 } = await supabase
        .from('balloon_inventory')
        .select('quantity')
        .eq('color', colorName)
        .eq('size', '11in')
        .maybeSingle()

      if (error11) {
        console.error('Error checking 11" balloon inventory:', error11)
        toast.error(`Error checking inventory for ${colorName} 11" balloons`)
        return false
      }

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
          .eq('color', colorName)
          .eq('size', '11in')

        if (updateError11) {
          console.error('Error updating 11" balloon inventory:', updateError11)
          toast.error(`Failed to update inventory for ${colorName} 11" balloons`)
          return false
        }
      }

      // Update 16" balloons
      const { data: data16, error: error16 } = await supabase
        .from('balloon_inventory')
        .select('quantity')
        .eq('color', colorName)
        .eq('size', '16in')
        .maybeSingle()

      if (error16) {
        console.error('Error checking 16" balloon inventory:', error16)
        toast.error(`Error checking inventory for ${colorName} 16" balloons`)
        return false
      }

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
          .eq('color', colorName)
          .eq('size', '16in')

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
    const { data: data11 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', color)
      .eq('size', '11in')
      .maybeSingle()

    const { data: data16 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', color)
      .eq('size', '16in')
      .maybeSingle()

    if (!data11 || !data16 || data11.quantity < 100 || data16.quantity < 50) {
      toast.warning(`Low inventory for ${color} balloons`)
      return false
    }
  }

  return true
}