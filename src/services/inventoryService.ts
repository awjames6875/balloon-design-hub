import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ColorBalloonData {
  color: string
  balloons11: number
  balloons16: number
}

export const updateInventory = async (balloonsPerColor: ColorBalloonData[]): Promise<boolean> => {
  for (const colorData of balloonsPerColor) {
    // Update 11" balloons
    const { data: data11, error: error11 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', colorData.color)
      .eq('size', '11in')
      .single()

    if (error11) {
      console.error('Error checking 11" balloon inventory:', error11)
      toast.error(`Error checking inventory for ${colorData.color} 11" balloons`)
      return false
    }

    const newQuantity11 = data11.quantity - colorData.balloons11
    if (newQuantity11 < 0) {
      toast.error(`Insufficient inventory for ${colorData.color} 11" balloons`)
      return false
    }

    const { error: updateError11 } = await supabase
      .from('balloon_inventory')
      .update({ quantity: newQuantity11 })
      .eq('color', colorData.color)
      .eq('size', '11in')

    if (updateError11) {
      console.error('Error updating 11" balloon inventory:', updateError11)
      toast.error(`Failed to update inventory for ${colorData.color} 11" balloons`)
      return false
    }

    // Update 16" balloons
    const { data: data16, error: error16 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', colorData.color)
      .eq('size', '16in')
      .single()

    if (error16) {
      console.error('Error checking 16" balloon inventory:', error16)
      toast.error(`Error checking inventory for ${colorData.color} 16" balloons`)
      return false
    }

    const newQuantity16 = data16.quantity - colorData.balloons16
    if (newQuantity16 < 0) {
      toast.error(`Insufficient inventory for ${colorData.color} 16" balloons`)
      return false
    }

    const { error: updateError16 } = await supabase
      .from('balloon_inventory')
      .update({ quantity: newQuantity16 })
      .eq('color', colorData.color)
      .eq('size', '16in')

    if (updateError16) {
      console.error('Error updating 16" balloon inventory:', updateError16)
      toast.error(`Failed to update inventory for ${colorData.color} 16" balloons`)
      return false
    }
  }
  return true
}