import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { CurrentInventorySection } from "@/components/inventory/CurrentInventorySection"
import { StockAnalyticsSection } from "@/components/inventory/StockAnalyticsSection"
import { InventoryActions } from "@/components/inventory/InventoryActions"
import { BackToHome } from "@/components/BackToHome"
import type { BalloonInventory } from "@/components/inventory/types"

const Inventory = () => {
  const [inventory, setInventory] = useState<BalloonInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInventory = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('balloon_inventory')
        .select('*')
        .order('color')
        .order('size')

      if (error) throw error

      const formattedInventory = data.map(item => ({
        type: item.color,
        style: item.size,
        inStock: item.quantity,
        toOrder: item.quantity < 100 ? 100 - item.quantity : 0 // Example reorder point
      }))

      setInventory(formattedInventory)
      toast.success("Inventory data refreshed")
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast.error("Failed to load inventory data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('inventory_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'balloon_inventory'
        },
        () => {
          console.log('Inventory changed, refreshing data...')
          fetchInventory()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <BackToHome />
      </div>
      
      <h1 className="text-2xl font-bold text-center mb-8">
        Inventory Management
      </h1>

      <CurrentInventorySection 
        inventory={inventory}
        isLoading={isLoading}
        onInventoryUpdate={fetchInventory}
      />

      <StockAnalyticsSection inventory={inventory} />

      <InventoryActions 
        onRefresh={fetchInventory}
        inventory={inventory}
      />
    </div>
  )
}

export default Inventory