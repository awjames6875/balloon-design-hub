import { supabase } from "@/integrations/supabase/client"
import { InventoryItem, ColorCluster } from "./types"

const colorNameMap: { [key: string]: string } = {
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
  "#FFD700": "Gold"
}

export const getColorName = (hexColor: string) => {
  return colorNameMap[hexColor.toUpperCase()] || hexColor
}

export const getInventoryStatus = (available: number, required: number): 'in-stock' | 'low' | 'out-of-stock' => {
  if (available >= required) {
    return available >= required * 1.2 ? 'in-stock' : 'low'
  }
  return 'out-of-stock'
}

export const calculateBalloonsPerColor = (colorClusters: ColorCluster[]) => {
  // Calculate balloons needed per cluster
  const balloonsPerCluster = {
    '11inch': 11,
    '16inch': 2
  }

  // Calculate balloons needed for each color
  return colorClusters.map(cluster => ({
    color: cluster.color,
    balloons11: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['11inch']),
    balloons16: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['16inch'])
  }))
}

export const checkInventory = async (colorClusters: ColorCluster[]): Promise<InventoryItem[]> => {
  console.log("Checking inventory for color clusters:", colorClusters)
  const balloonsByColor = calculateBalloonsPerColor(colorClusters)
  console.log("Calculated balloons by color:", balloonsByColor)
  const inventoryList: InventoryItem[] = []

  for (const colorData of balloonsByColor) {
    const colorName = getColorName(colorData.color)
    console.log(`Checking inventory for color: ${colorName}`)
    
    // Check 11" balloons
    const { data: data11, error: error11 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', colorName)
      .eq('size', '11in')
      .maybeSingle()

    if (error11) {
      console.error('Error checking 11" inventory:', error11)
      continue
    }

    // Check 16" balloons
    const { data: data16, error: error16 } = await supabase
      .from('balloon_inventory')
      .select('quantity')
      .eq('color', colorName)
      .eq('size', '16in')
      .maybeSingle()

    if (error16) {
      console.error('Error checking 16" inventory:', error16)
      continue
    }

    // Add 11" balloon inventory item
    inventoryList.push({
      color: colorName,
      size: '11in',
      quantity: data11?.quantity || 0,
      required: colorData.balloons11,
      status: getInventoryStatus(data11?.quantity || 0, colorData.balloons11)
    })

    // Add 16" balloon inventory item
    inventoryList.push({
      color: colorName,
      size: '16in',
      quantity: data16?.quantity || 0,
      required: colorData.balloons16,
      status: getInventoryStatus(data16?.quantity || 0, colorData.balloons16)
    })
  }

  console.log("Final inventory list:", inventoryList)
  return inventoryList
}