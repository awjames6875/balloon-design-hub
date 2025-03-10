
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
  "#7E69AB": "Purple"
}

export const getColorName = (hexColor: string) => {
  return colorMap[hexColor.toUpperCase()] || hexColor
}

export const getInventoryStatus = (available: number, required: number): 'in-stock' | 'low' | 'out-of-stock' => {
  console.log(`Checking status for available: ${available}, required: ${required}`)
  if (available === 0) return 'out-of-stock'
  if (available < required) return 'out-of-stock'
  if (available >= required * 1.2) return 'in-stock'
  return 'low'
}

export const calculateBalloonsPerColor = (colorClusters: ColorCluster[]) => {
  console.log("Calculating balloons per color for clusters:", colorClusters)
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
      // Get all inventory for this color regardless of exact case
      const { data: allInventory, error: inventoryError } = await supabase
        .from('balloon_inventory')
        .select('*')
        .ilike('color', colorName)
      
      if (inventoryError) {
        console.error(`Error fetching inventory for ${colorName}:`, inventoryError)
        toast.error(`Error checking inventory for ${colorName} balloons`)
        continue
      }

      console.log(`All inventory for ${colorName}:`, allInventory)
      
      // Find 11" balloons
      const match11 = allInventory?.find(item => 
        item.color.toLowerCase() === colorName.toLowerCase() && 
        item.size === '11in'
      );

      const quantity11 = match11?.quantity || 0
      console.log(`11" balloons available for ${colorName}:`, quantity11)

      // Find 16" balloons
      const match16 = allInventory?.find(item => 
        item.color.toLowerCase() === colorName.toLowerCase() && 
        item.size === '16in'
      );

      const quantity16 = match16?.quantity || 0
      console.log(`16" balloons available for ${colorName}:`, quantity16)

      inventoryList.push({
        color: colorName,
        size: '11in',
        quantity: quantity11,
        required: colorData.balloons11,
        status: getInventoryStatus(quantity11, colorData.balloons11)
      })

      inventoryList.push({
        color: colorName,
        size: '16in',
        quantity: quantity16,
        required: colorData.balloons16,
        status: getInventoryStatus(quantity16, colorData.balloons16)
      })
    } catch (error) {
      console.error(`Unexpected error while processing ${colorName}:`, error)
      toast.error("Something went wrong while checking inventory. Please try again.")
    }
  }

  console.log("Final inventory list:", inventoryList)
  return inventoryList
}
