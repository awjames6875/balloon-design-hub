import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface ColorBalloonData {
  color: string
  balloons11: number
  balloons16: number
}

export const updateInventory = async (balloonsPerColor: ColorBalloonData[]): Promise<boolean> => {
  console.log("Updating inventory with:", balloonsPerColor)
  
  for (const colorData of balloonsPerColor) {
    // Get the color name from the hex code if needed
    const colorName = getColorName(colorData.color)
    console.log(`Processing ${colorName}: ${colorData.balloons11} 11" and ${colorData.balloons16} 16" balloons`)

    // Update 11" balloons
    const { data: data11, error: error11 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', colorName)
      .eq('size', '11in')
      .single()

    if (error11) {
      console.error('Error checking 11" balloon inventory:', error11)
      toast.error(`Error checking inventory for ${colorName} 11" balloons`)
      return false
    }

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

    // Update 16" balloons
    const { data: data16, error: error16 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', colorName)
      .eq('size', '16in')
      .single()

    if (error16) {
      console.error('Error checking 16" balloon inventory:', error16)
      toast.error(`Error checking inventory for ${colorName} 16" balloons`)
      return false
    }

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

    console.log(`Successfully updated inventory for ${colorName}`)
  }

  toast.success("Inventory updated successfully")
  return true
}

// Helper function to convert hex colors to color names
const getColorName = (hexColor: string): string => {
  const colorMap: { [key: string]: string } = {
    "#FF0000": "Red",
    "#FFA500": "Orange",
    "#FFFF00": "Yellow",
    "#008000": "Green",
    "#0000FF": "Blue",
    "#800080": "Purple",
    "#FFC0CB": "Pink",
    "#FFFFFF": "White",
    "#000000": "Black",
    "#C0C0C0": "Silver",
    "#FFD700": "Gold",
    "#7E69AB": "Purple" // Adding support for the additional purple shade
  }

  return colorMap[hexColor.toUpperCase()] || hexColor
}