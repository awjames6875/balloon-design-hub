
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { InventoryItem, ColorCluster } from "./types"
import { getColorName, normalizeColorName } from "./utils/colorUtils"
import { getInventoryStatus, calculateBalloonsPerColor } from "./utils/inventoryStatusUtils"
import { getLatestInventory, findColorInventory } from "./services/inventoryDataService"

// Export all utility functions to maintain backward compatibility
export { getColorName, normalizeColorName } from "./utils/colorUtils"
export { getInventoryStatus, calculateBalloonsPerColor } from "./utils/inventoryStatusUtils"
export { getLatestInventory } from "./services/inventoryDataService"

export const checkInventory = async (colorClusters: ColorCluster[]): Promise<InventoryItem[]> => {
  console.log("Checking inventory for color clusters:", colorClusters)
  const balloonsByColor = calculateBalloonsPerColor(colorClusters)
  console.log("Calculated balloons by color:", balloonsByColor)
  const inventoryList: InventoryItem[] = []

  // Get the latest inventory data from the database
  const latestInventory = await getLatestInventory()

  for (const colorData of balloonsByColor) {
    const colorDisplay = getColorName(colorData.color)
    
    try {
      // Find inventory data for this color
      const colorInventory = findColorInventory(latestInventory, colorDisplay)
      
      console.log(`Final inventory for ${colorDisplay}:`, colorInventory)
      
      // Get quantities for both sizes
      const quantity11 = colorInventory['11in'] || 0
      console.log(`11" balloons available for ${colorDisplay}:`, quantity11)

      const quantity16 = colorInventory['16in'] || 0
      console.log(`16" balloons available for ${colorDisplay}:`, quantity16)

      // Calculate what would remain after this project
      const remaining11 = quantity11 - colorData.balloons11
      const remaining16 = quantity16 - colorData.balloons16

      inventoryList.push({
        color: colorDisplay,
        size: '11in',
        quantity: quantity11,
        required: colorData.balloons11,
        status: getInventoryStatus(quantity11, colorData.balloons11),
        remaining: Math.max(0, remaining11)
      })

      inventoryList.push({
        color: colorDisplay,
        size: '16in',
        quantity: quantity16,
        required: colorData.balloons16,
        status: getInventoryStatus(quantity16, colorData.balloons16),
        remaining: Math.max(0, remaining16)
      })
    } catch (error) {
      console.error(`Unexpected error while processing ${colorDisplay}:`, error)
      toast.error("Something went wrong while checking inventory. Please try again.")
    }
  }

  console.log("Final inventory list:", inventoryList)
  return inventoryList
}
