import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { CurrentInventorySection } from "@/components/inventory/CurrentInventorySection"
import { StockAnalyticsSection } from "@/components/inventory/StockAnalyticsSection"
import { InventoryActions } from "@/components/inventory/InventoryActions"
import { BackToHome } from "@/components/BackToHome"
import type { BalloonInventory } from "@/components/inventory/types"

const Inventory = () => {
  const [inventory, setInventory] = useState<BalloonInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

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
        toOrder: 0
      }))

      setInventory(formattedInventory)
      toast({
        title: "Inventory Updated",
        description: "The inventory data has been refreshed.",
      })
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()

    // Subscribe to changes in balloon_inventory table
    const inventoryChannel = supabase
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

    // Subscribe to changes in production_details table
    const productionChannel = supabase
      .channel('production_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'production_details'
        },
        () => {
          console.log('New production added, refreshing inventory...')
          fetchInventory()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(inventoryChannel)
      supabase.removeChannel(productionChannel)
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