import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { InventoryTable } from "./inventory/InventoryTable"
import { checkInventory } from "./inventory/inventoryService"
import type { InventoryItem, ColorCluster, Calculations } from "./inventory/types"

interface InventoryCheckProps {
  colorClusters: ColorCluster[]
  calculations: Calculations
  onInventoryChecked: () => void
}

export const InventoryCheckForm = ({ 
  colorClusters, 
  calculations,
  onInventoryChecked 
}: InventoryCheckProps) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const handleInventoryCheck = async () => {
    setIsLoading(true)
    try {
      const items = await checkInventory(colorClusters)
      setInventoryItems(items)
      
      const hasLowStock = items.some(item => item.status === 'low')
      const hasOutOfStock = items.some(item => item.status === 'out-of-stock')

      if (hasOutOfStock) {
        toast.error("Some balloons are out of stock. Please check inventory and try again.")
      } else if (hasLowStock) {
        toast.warning("Some balloon colors are running low, but you can proceed.")
      }
    } catch (error) {
      console.error('Error checking inventory:', error)
      toast.error("Failed to check inventory")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    handleInventoryCheck()
  }, [])

  const canProceed = !inventoryItems.some(item => item.status === 'out-of-stock')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <InventoryTable 
            items={inventoryItems}
            isLoading={isLoading}
          />

          <div className="flex gap-4">
            <Button 
              onClick={handleInventoryCheck} 
              variant="outline"
              disabled={isLoading}
            >
              Refresh Inventory
            </Button>
            {canProceed && (
              <Button
                onClick={onInventoryChecked}
                disabled={isLoading}
                className="flex-1"
              >
                Continue to Accessories
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}