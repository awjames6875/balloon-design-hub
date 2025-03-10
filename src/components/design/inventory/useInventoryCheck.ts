import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { checkInventory, getLatestInventory } from "./inventoryService"
import type { InventoryItem, ColorCluster } from "./types"

export const useInventoryCheck = (colorClusters: ColorCluster[], refreshTrigger?: number) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleInventoryCheck = async () => {
    setIsLoading(true)
    try {
      console.log("Running inventory check for color clusters:", colorClusters)
      
      // If no color clusters provided (demo mode), create some demo clusters
      const clustersToCheck = colorClusters.length > 0 
        ? colorClusters 
        : await createDemoClusters();
      
      const items = await checkInventory(clustersToCheck)
      setInventoryItems(items)
      
      const hasLowStock = items.some(item => item.status === 'low')
      const hasOutOfStock = items.some(item => item.status === 'out-of-stock')

      if (hasOutOfStock) {
        toast.error("Some balloons are out of stock. Please check inventory and try again.")
      } else if (hasLowStock) {
        toast.warning("Some balloon colors are running low, but you can proceed.")
      } else if (items.length > 0) {
        toast.success("All required balloons are in stock!")
      }
    } catch (error) {
      console.error('Error checking inventory:', error)
      toast.error("Failed to check inventory")
    } finally {
      setIsLoading(false)
    }
  }

  // Create demo color clusters based on available inventory
  const createDemoClusters = async (): Promise<ColorCluster[]> => {
    try {
      // Get the latest inventory to find colors that have stock
      const inventoryData = await getLatestInventory()
      const availableColors = Object.keys(inventoryData).slice(0, 3) // Take up to 3 colors
      
      if (availableColors.length === 0) {
        return [{
          color: "#FF0000",  // Default red if no inventory
          baseClusters: 3,
          extraClusters: 1
        }]
      }
      
      // Create sample clusters from available inventory colors
      return availableColors.map(colorName => {
        // Get a sample hex color or use a default
        const sampleHexColors: {[key: string]: string} = {
          "red": "#FF0000",
          "blue": "#0000FF",
          "green": "#00FF00",
          "yellow": "#FFFF00",
          "purple": "#800080",
          "pink": "#FFC0CB",
          "teal": "#008080"
        }
        
        // Try to match the color name to a hex color, or use black as fallback
        const colorLower = colorName.toLowerCase()
        const matchedColor = Object.keys(sampleHexColors).find(key => 
          colorLower.includes(key)
        )
        
        const hexColor = matchedColor 
          ? sampleHexColors[matchedColor] 
          : "#000000" // Default to black if no match
        
        return {
          color: hexColor,
          baseClusters: 3,
          extraClusters: 1
        }
      })
    } catch (error) {
      console.error("Error creating demo clusters:", error)
      // Return a default cluster if there's an error
      return [{
        color: "#FF0000",
        baseClusters: 3,
        extraClusters: 1
      }]
    }
  }

  // Set up realtime subscription and perform initial inventory check
  useEffect(() => {
    // Initial inventory check
    handleInventoryCheck()
    
    // Set up realtime subscription to inventory table changes
    const channel = supabase
      .channel('inventory-check-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'balloon_inventory'
        },
        () => {
          console.log('Inventory changed, refreshing inventory check')
          handleInventoryCheck() // Refresh inventory data when changes occur
        }
      )
      .subscribe()

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [colorClusters])

  // Refresh when the refresh trigger changes
  useEffect(() => {
    if (refreshTrigger) {
      console.log("Refresh trigger changed, refreshing inventory check")
      handleInventoryCheck()
    }
  }, [refreshTrigger, colorClusters])

  return {
    inventoryItems,
    isLoading,
    refreshInventory: handleInventoryCheck
  }
}
