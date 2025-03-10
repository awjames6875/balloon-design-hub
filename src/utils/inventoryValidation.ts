
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const validateInventoryUpdate = async (
  color: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  if (!color || color.trim() === '') {
    console.error("Color cannot be empty")
    toast.error("Color name cannot be empty")
    return false
  }

  if (!size || size.trim() === '') {
    console.error("Size cannot be empty")
    toast.error("Please select a balloon size")
    return false
  }

  if (isNaN(quantity) || quantity < 0) {
    console.error("Quantity must be a positive number")
    toast.error("Please enter a valid quantity")
    return false
  }

  return true
}

export const checkExistingBalloon = async (
  color: string,
  size: string
) => {
  const { data, error } = await supabase
    .from("balloon_inventory")
    .select("*")
    .eq("color", color.trim())
    .eq("size", size.trim())
    .maybeSingle()

  if (error) {
    console.error("Error checking existing balloon:", error)
    return null
  }
  
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
