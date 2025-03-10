
import { supabase } from "@/integrations/supabase/client"

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
