
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

// This function gets the latest inventory data directly from the database
export const getLatestInventory = async (): Promise<Record<string, Record<string, number>>> => {
  const { data: allInventoryRecords, error: fetchError } = await supabase
    .from('balloon_inventory')
    .select('*')

  if (fetchError) {
    console.error('Error fetching all inventory:', fetchError)
    toast.error('Failed to fetch inventory data')
    return {}
  }

  // Create a nested object organized by color and size for easy lookup
  const inventory: Record<string, Record<string, number>> = {}
  
  allInventoryRecords.forEach(item => {
    const colorName = item.color.toLowerCase()
    const size = item.size

    if (!inventory[colorName]) {
      inventory[colorName] = {}
    }
    
    // Always use the standardized sizes
    const normalizedSize = size.includes('11') ? '11in' : size.includes('16') ? '16in' : size
    inventory[colorName][normalizedSize] = item.quantity
  })

  console.log("Latest inventory data:", inventory)
  return inventory
}

export const checkInventory = async (colorClusters: ColorCluster[]): Promise<InventoryItem[]> => {
  console.log("Checking inventory for color clusters:", colorClusters)
  const balloonsByColor = calculateBalloonsPerColor(colorClusters)
  console.log("Calculated balloons by color:", balloonsByColor)
  const inventoryList: InventoryItem[] = []

  // Get the latest inventory data
  const latestInventory = await getLatestInventory()

  for (const colorData of balloonsByColor) {
    const colorName = getColorName(colorData.color)
    console.log(`Processing color: ${colorName}`)

    try {
      // Look up inventory for this color (case-insensitive)
      const colorInventory = latestInventory[colorName.toLowerCase()] || {}
      
      console.log(`Inventory for ${colorName}:`, colorInventory)
      
      // Get quantities for both sizes
      const quantity11 = colorInventory['11in'] || 0
      console.log(`11" balloons available for ${colorName}:`, quantity11)

      const quantity16 = colorInventory['16in'] || 0
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
