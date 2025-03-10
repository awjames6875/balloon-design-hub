
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { normalizeColorName } from "@/components/design/inventory/utils/colorUtils"
import { ColorBalloonData } from "./inventory/types"
import { findMatchingInventoryRecords, findInventoryBySize } from "./inventory/inventoryMatcher"
import { updateBalloonInventory } from "./inventory/balloonInventoryUpdate"
import { checkInventoryLevels } from "./inventory/inventoryChecker"

export { checkInventoryLevels }

export const updateInventory = async (balloonsPerColor: ColorBalloonData[]): Promise<boolean> => {
  console.log("Starting inventory update with:", balloonsPerColor)
  
  // Get all inventory records in one query to reduce database calls
  const { data: allInventoryRecords, error: fetchError } = await supabase
    .from('balloon_inventory')
    .select('*')

  if (fetchError) {
    console.error('Error fetching all inventory:', fetchError)
    toast.error('Failed to fetch inventory data')
    return false
  }

  console.log("All inventory records:", allInventoryRecords)
  
  for (const colorData of balloonsPerColor) {
    const colorName = colorData.color
    console.log(`Processing ${colorName}: ${colorData.balloons11} 11" and ${colorData.balloons16} 16" balloons`)

    try {
      // Find matching inventory records for this color
      const colorInventory = findMatchingInventoryRecords(allInventoryRecords, colorName)
      
      // Process 11" balloons
      const data11 = findInventoryBySize(colorInventory, '11')
      const success11 = await updateBalloonInventory(data11, colorName, '11in', colorData.balloons11)
      if (!success11) return false

      // Process 16" balloons
      const data16 = findInventoryBySize(colorInventory, '16')
      const success16 = await updateBalloonInventory(data16, colorName, '16in', colorData.balloons16)
      if (!success16) return false

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
