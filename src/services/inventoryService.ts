
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { normalizeColorName, getAlternateColorNames } from "@/components/design/inventory/utils/colorUtils"

interface ColorBalloonData {
  color: string  
  balloons11: number
  balloons16: number
}

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
    const colorNormalized = normalizeColorName(colorName)
    console.log(`Processing ${colorName}: ${colorData.balloons11} 11" and ${colorData.balloons16} 16" balloons`)

    try {
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
      
      // Find 11" balloons with multiple possible formats
      const data11 = colorInventory.find(item => 
        item.size === '11in' ||
        item.size === '11' ||
        item.size.toLowerCase().includes('11')
      )

      if (!data11) {
        // If no inventory exists, create a new record
        const { error: insertError11 } = await supabase
          .from('balloon_inventory')
          .insert([
            {
              color: colorName,
              size: '11in',
              quantity: colorData.balloons11
            }
          ])

        if (insertError11) {
          console.error(`Error creating inventory for ${colorName} 11" balloons:`, insertError11)
          toast.error(`Failed to create inventory for ${colorName} 11" balloons`)
          return false
        }
      } else {
        // Update existing inventory
        const newQuantity11 = data11.quantity - colorData.balloons11
        if (newQuantity11 < 0) {
          toast.error(`Insufficient inventory for ${colorName} 11" balloons`)
          return false
        }

        const { error: updateError11 } = await supabase
          .from('balloon_inventory')
          .update({ quantity: newQuantity11 })
          .eq('id', data11.id)

        if (updateError11) {
          console.error('Error updating 11" balloon inventory:', updateError11)
          toast.error(`Failed to update inventory for ${colorName} 11" balloons`)
          return false
        }
      }

      // Find 16" balloons with multiple possible formats
      const data16 = colorInventory.find(item => 
        item.size === '16in' ||
        item.size === '16' ||
        item.size.toLowerCase().includes('16')
      )

      if (!data16) {
        // If no inventory exists, create a new record
        const { error: insertError16 } = await supabase
          .from('balloon_inventory')
          .insert([
            {
              color: colorName,
              size: '16in',
              quantity: colorData.balloons16
            }
          ])

        if (insertError16) {
          console.error(`Error creating inventory for ${colorName} 16" balloons:`, insertError16)
          toast.error(`Failed to create inventory for ${colorName} 16" balloons`)
          return false
        }
      } else {
        // Update existing inventory
        const newQuantity16 = data16.quantity - colorData.balloons16
        if (newQuantity16 < 0) {
          toast.error(`Insufficient inventory for ${colorName} 16" balloons`)
          return false
        }

        const { error: updateError16 } = await supabase
          .from('balloon_inventory')
          .update({ quantity: newQuantity16 })
          .eq('id', data16.id)

        if (updateError16) {
          console.error('Error updating 16" balloon inventory:', updateError16)
          toast.error(`Failed to create inventory for ${colorName} 16" balloons`)
          return false
        }
      }

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

export const checkInventoryLevels = async (colors: string[]): Promise<boolean> => {
  for (const color of colors) {
    // Get all inventory for this color using improved matching
    const colorNormalized = normalizeColorName(color)
    
    const { data: allInventory } = await supabase
      .from('balloon_inventory')
      .select('*')
      .or(`color.ilike.%${color}%,color.ilike.%${colorNormalized}%`)
    
    // Enhanced matching for finding the right inventory records
    let data11 = allInventory?.find(item => 
      (item.color.toLowerCase() === color.toLowerCase() || 
       normalizeColorName(item.color) === colorNormalized) && 
      (item.size === '11in' || item.size.includes('11'))
    )
    
    let data16 = allInventory?.find(item => 
      (item.color.toLowerCase() === color.toLowerCase() || 
       normalizeColorName(item.color) === colorNormalized) && 
      (item.size === '16in' || item.size.includes('16'))
    )
    
    // If no exact match was found, try fuzzy matching
    if (!data11 || !data16) {
      // Try alternate names
      const alternateNames = getAlternateColorNames(color);
      for (const altName of alternateNames) {
        const altNormalized = normalizeColorName(altName);
        
        // Check for 11" if not found yet
        if (!data11) {
          data11 = allInventory?.find(item => 
            (normalizeColorName(item.color).includes(altNormalized) || 
             altNormalized.includes(normalizeColorName(item.color))) && 
            (item.size === '11in' || item.size.includes('11'))
          );
        }
        
        // Check for 16" if not found yet
        if (!data16) {
          data16 = allInventory?.find(item => 
            (normalizeColorName(item.color).includes(altNormalized) || 
             altNormalized.includes(normalizeColorName(item.color))) && 
            (item.size === '16in' || item.size.includes('16'))
          );
        }
        
        if (data11 && data16) break;
      }
    }

    if (!data11 || !data16 || data11.quantity < 100 || data16.quantity < 50) {
      toast.warning(`Low inventory for ${color} balloons`)
      return false
    }
  }

  return true
}
