
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const validateInventoryUpdate = async (
  color: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  console.log("Validating inventory update:", { color, size, quantity })
  
  if (!color || color.trim() === '') {
    console.error("Color validation failed - empty value:", color)
    toast.error("Color name cannot be empty")
    return false
  }

  if (!size || size.trim() === '') {
    console.error("Size validation failed - empty value")
    toast.error("Please select a balloon size")
    return false
  }

  if (isNaN(quantity) || quantity < 0) {
    console.error("Quantity validation failed:", quantity)
    toast.error("Please enter a valid quantity")
    return false
  }

  return true
}

export const checkExistingBalloon = async (
  color: string,
  size: string
) => {
  if (!color || !size) {
    console.error("Cannot check for existing balloon with empty color or size")
    return null
  }
  
  const cleanColor = color.trim();
  const cleanSize = size.trim();
  
  console.log("Checking for existing balloon:", { color: cleanColor, size: cleanSize })
  
  const { data, error } = await supabase
    .from("balloon_inventory")
    .select("*")
    .eq("color", cleanColor)
    .eq("size", cleanSize)
    .maybeSingle()

  if (error) {
    console.error("Error checking existing balloon:", error)
    return null
  }
  
  console.log("Existing balloon check result:", data)
  return data
}

// Subscribe to realtime updates for the balloon_inventory table
export const enableRealtimeForInventory = async (): Promise<boolean> => {
  try {
    // Create a channel for realtime updates
    const channel = supabase
      .channel('inventory-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'balloon_inventory'
        },
        (payload) => {
          console.log('Realtime update received:', payload)
        }
      )
      .subscribe()
    
    if (channel) {
      console.log("Realtime enabled for balloon_inventory table")
      return true
    } else {
      console.error("Failed to enable realtime for balloon_inventory")
      return false
    }
  } catch (error) {
    console.error("Error in enableRealtimeForInventory:", error)
    return false
  }
}
