
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { normalizeColorName, getAlternateColorNames } from "@/components/design/inventory/utils/colorUtils"

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
