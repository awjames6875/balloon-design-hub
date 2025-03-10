
import { supabase } from "@/integrations/supabase/client"
import { InventoryItem, ColorCluster } from "./types"
import { toast } from "sonner"

const colorMap: { [key: string]: string } = {
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FFA500": "Orange",
  "#800080": "Purple",
  "#FFC0CB": "Pink",
  "#FFFFFF": "White",
  "#000000": "Black",
  "#C0C0C0": "Silver",
  "#FFD700": "Gold",
  "#7E69AB": "Purple" // Additional purple shade
}

export const getColorName = (hexColor: string) => {
  return colorMap[hexColor.toUpperCase()] || hexColor
}

export const getInventoryStatus = (available: number, required: number): 'in-stock' | 'low' | 'out-of-stock' => {
  if (available >= required) {
    return available >= required * 1.2 ? 'in-stock' : 'low'
  }
  return 'out-of-stock'
}

export const calculateBalloonsPerColor = (colorClusters: ColorCluster[]) => {
  console.log("Calculating balloons per color for clusters:", colorClusters)
  // Each cluster has exactly 11 11-inch balloons and 2 16-inch balloons
  return colorClusters.map(cluster => {
    const totalClusters = cluster.baseClusters + cluster.extraClusters
    return {
      color: cluster.color,
      balloons11: totalClusters * 11,
      balloons16: totalClusters * 2
    }
  })
}

export const checkInventory = async (colorClusters: ColorCluster[]): Promise<InventoryItem[]> => {
  console.log("Checking inventory for color clusters:", colorClusters)
  const balloonsByColor = calculateBalloonsPerColor(colorClusters)
  console.log("Calculated balloons by color:", balloonsByColor)
  const inventoryList: InventoryItem[] = []

  for (const colorData of balloonsByColor) {
    const colorName = getColorName(colorData.color)
    console.log(`Processing color: ${colorName}`)

    try {
      // Check 11" balloons
      const { data: data11, error: error11 } = await supabase
        .from('balloon_inventory')
        .select('quantity')
        .eq('color', colorName)
        .eq('size', '11in')
        .maybeSingle()

      if (error11) {
        console.error(`Error checking 11" balloon inventory:`, error11)
        toast.error(`Error checking inventory for ${colorName} 11" balloons`)
        continue
      }

      console.log(`11" balloons available for ${colorName}:`, data11?.quantity || 0)

      // Check 16" balloons
      const { data: data16, error: error16 } = await supabase
        .from('balloon_inventory')
        .select('quantity')
        .eq('color', colorName)
        .eq('size', '16in')
        .maybeSingle()

      if (error16) {
        console.error(`Error checking 16" balloon inventory:`, error16)
        toast.error(`Error checking inventory for ${colorName} 16" balloons`)
        continue
      }

      console.log(`16" balloons available for ${colorName}:`, data16?.quantity || 0)

      // Add inventory items to the list
      inventoryList.push({
        color: colorName,
        size: '11in',
        quantity: data11?.quantity || 0,
        required: colorData.balloons11,
        status: getInventoryStatus(data11?.quantity || 0, colorData.balloons11)
      })

      inventoryList.push({
        color: colorName,
        size: '16in',
        quantity: data16?.quantity || 0,
        required: colorData.balloons16,
        status: getInventoryStatus(data16?.quantity || 0, colorData.balloons16)
      })
    } catch (error) {
      console.error(`Unexpected error while processing ${colorName}:`, error)
      toast.error("Something went wrong while checking inventory. Please try again.")
    }
  }

  console.log("Final inventory list:", inventoryList)
  return inventoryList
}
