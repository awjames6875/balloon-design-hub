
import { normalizeColorName, getAlternateColorNames } from "@/components/design/inventory/utils/colorUtils"

export const findMatchingInventoryRecords = (
  allInventoryRecords: any[],
  colorName: string
) => {
  const colorNormalized = normalizeColorName(colorName)
  console.log(`Processing ${colorName}: normalized to ${colorNormalized}`)

  // Enhanced inventory matching - try multiple approaches to find the correct inventory
  // First, try exact match on color name (case-insensitive)
  let colorInventory = allInventoryRecords.filter(item => 
    item.color.toLowerCase() === colorName.toLowerCase()
  )
  
  // If no match, try normalized color names
  if (colorInventory.length === 0) {
    colorInventory = allInventoryRecords.filter(item => 
      normalizeColorName(item.color) === colorNormalized
    )
  }
  
  // If still no match, try partial matching
  if (colorInventory.length === 0) {
    colorInventory = allInventoryRecords.filter(item => 
      normalizeColorName(item.color).includes(colorNormalized) || 
      colorNormalized.includes(normalizeColorName(item.color))
    )
  }
  
  // Try alternate names if we still have no match
  if (colorInventory.length === 0) {
    const alternateNames = getAlternateColorNames(colorName);
    for (const altName of alternateNames) {
      const altNormalized = normalizeColorName(altName);
      const matchingItems = allInventoryRecords.filter(item => 
        normalizeColorName(item.color) === altNormalized ||
        normalizeColorName(item.color).includes(altNormalized) ||
        altNormalized.includes(normalizeColorName(item.color))
      );
      
      if (matchingItems.length > 0) {
        colorInventory = matchingItems;
        console.log(`Found match using alternate name ${altName}:`, colorInventory);
        break;
      }
    }
  }
  
  console.log(`Inventory for ${colorName}:`, colorInventory)
  return colorInventory
}

export const findInventoryBySize = (colorInventory: any[], sizeIdentifier: string) => {
  return colorInventory.find(item => 
    item.size === `${sizeIdentifier}in` ||
    item.size === sizeIdentifier ||
    item.size.toLowerCase().includes(sizeIdentifier)
  )
}
