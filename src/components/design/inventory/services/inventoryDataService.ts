
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { normalizeColorName, getAlternateColorNames } from "../utils/colorUtils"

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

// Helper function to find inventory data for a specific color
export const findColorInventory = (
  latestInventory: Record<string, Record<string, number>>, 
  colorDisplay: string
): Record<string, number> => {
  const colorLower = colorDisplay.toLowerCase()
  const colorNormalized = normalizeColorName(colorDisplay)
  
  console.log(`Processing color: ${colorDisplay} (normalized: ${colorNormalized})`)

  // Try all possible color name formats for more robust matching
  const possibleColorNames = [colorLower, colorNormalized]
  let colorInventory = {}
  
  // Check each possible color name format
  for (const nameFormat of possibleColorNames) {
    if (latestInventory[nameFormat]) {
      colorInventory = latestInventory[nameFormat]
      console.log(`Found inventory match for ${nameFormat}:`, colorInventory)
      return colorInventory
    }
  }
  
  // If no exact match found, try partial matching
  for (const dbColor in latestInventory) {
    if (dbColor.includes(colorNormalized) || colorNormalized.includes(dbColor)) {
      colorInventory = latestInventory[dbColor]
      console.log(`Found partial match for ${colorDisplay} using ${dbColor}:`, colorInventory)
      return colorInventory
    }
  }
  
  // If still no match, try again with alternate color variations
  const alternateNames = getAlternateColorNames(colorDisplay);
  for (const altName of alternateNames) {
    const normalizedAlt = normalizeColorName(altName);
    for (const dbColor in latestInventory) {
      if (dbColor === normalizedAlt || 
          dbColor.includes(normalizedAlt) || 
          normalizedAlt.includes(dbColor)) {
        colorInventory = latestInventory[dbColor];
        console.log(`Found match using alternate name ${altName} -> ${dbColor}:`, colorInventory);
        return colorInventory;
      }
    }
  }
  
  console.log(`No inventory found for ${colorDisplay}`);
  return {};
}
