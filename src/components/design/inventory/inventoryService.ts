
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

// Normalize color name by removing spaces and converting to lowercase
export const normalizeColorName = (colorName: string): string => {
  return colorName.toLowerCase().replace(/\s+/g, "");
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
    // Store both normalized and original versions of the color name
    const colorNormalized = normalizeColorName(item.color)
    const colorOriginal = item.color.toLowerCase()
    const size = item.size

    // Add entry with normalized color name (no spaces)
    if (!inventory[colorNormalized]) {
      inventory[colorNormalized] = {}
    }
    
    // Also add entry with original format (may have spaces)
    if (!inventory[colorOriginal]) {
      inventory[colorOriginal] = {}
    }
    
    // Always use the standardized sizes
    const normalizedSize = size.includes('11') ? '11in' : size.includes('16') ? '16in' : size
    
    // Store quantity in both normalized and original color entries
    inventory[colorNormalized][normalizedSize] = item.quantity
    inventory[colorOriginal][normalizedSize] = item.quantity
  })

  console.log("Latest inventory data:", inventory)
  return inventory
}

export const checkInventory = async (colorClusters: ColorCluster[]): Promise<InventoryItem[]> => {
  console.log("Checking inventory for color clusters:", colorClusters)
  const balloonsByColor = calculateBalloonsPerColor(colorClusters)
  console.log("Calculated balloons by color:", balloonsByColor)
  const inventoryList: InventoryItem[] = []

  // Get the latest inventory data from the database
  const latestInventory = await getLatestInventory()

  for (const colorData of balloonsByColor) {
    const colorDisplay = getColorName(colorData.color)
    const colorLower = colorDisplay.toLowerCase()
    const colorNormalized = normalizeColorName(colorDisplay)
    
    console.log(`Processing color: ${colorDisplay} (normalized: ${colorNormalized})`)

    try {
      // Try all possible color name formats for more robust matching
      const possibleColorNames = [colorLower, colorNormalized]
      let colorInventory = {}
      
      // Check each possible color name format
      for (const nameFormat of possibleColorNames) {
        if (latestInventory[nameFormat]) {
          colorInventory = latestInventory[nameFormat]
          console.log(`Found inventory match for ${nameFormat}:`, colorInventory)
          break
        }
      }
      
      // If no exact match found, try partial matching
      if (Object.keys(colorInventory).length === 0) {
        // Find color that contains our search term
        for (const dbColor in latestInventory) {
          if (dbColor.includes(colorNormalized) || colorNormalized.includes(dbColor)) {
            colorInventory = latestInventory[dbColor]
            console.log(`Found partial match for ${colorDisplay} using ${dbColor}:`, colorInventory)
            break
          }
        }
      }
      
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
