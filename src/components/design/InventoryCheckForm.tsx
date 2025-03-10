
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { InventoryTable } from "./inventory/InventoryTable"
import { checkInventory } from "./inventory/inventoryService"
import { saveDesignToProduction } from "@/services/productionService"
import { updateInventory } from "@/services/inventoryService"
import { calculateBalloonsPerColor } from "@/utils/balloonCalculationUtils"
import type { InventoryItem, ColorCluster, Calculations } from "./inventory/types"
import { supabase } from "@/integrations/supabase/client"

interface InventoryCheckProps {
  colorClusters: ColorCluster[]
  calculations: Calculations
  onInventoryChecked: () => void
  clientName: string
  projectName: string
  dimensions: string
  style: string
}

export const InventoryCheckForm = ({ 
  colorClusters, 
  calculations,
  onInventoryChecked,
  clientName,
  projectName,
  dimensions,
  style
}: InventoryCheckProps) => {
  const navigate = useNavigate()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingForm, setIsGeneratingForm] = useState(false)

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
      } else {
        toast.success("All required balloons are in stock!")
      }
    } catch (error) {
      console.error('Error checking inventory:', error)
      toast.error("Failed to check inventory")
    } finally {
      setIsLoading(false)
    }
  }

  const generateProductionForm = async () => {
    setIsGeneratingForm(true)
    try {
      console.log("Starting production form generation with color clusters:", colorClusters)
      
      // Calculate balloons needed per color
      const balloonsPerColor = calculateBalloonsPerColor(colorClusters, calculations)
      console.log("Calculated balloons per color:", balloonsPerColor)
      
      // Update inventory first
      const inventoryUpdated = await updateInventory(balloonsPerColor)
      
      if (!inventoryUpdated) {
        toast.error("Failed to update inventory")
        return
      }

      // Then save the production form
      await saveDesignToProduction({
        clientName,
        projectName,
        dimensionsFt: parseInt(dimensions),
        colors: colorClusters.map(cluster => cluster.color),
        baseClusters: calculations.baseClusters,
        extraClusters: calculations.extraClusters,
        totalClusters: calculations.totalClusters,
        littlesQuantity: calculations.littlesQuantity,
        grapesQuantity: calculations.grapesQuantity,
        balloons11in: calculations.balloons11in,
        balloons16in: calculations.balloons16in,
        totalBalloons: calculations.totalBalloons,
        accents: {},
        productionTime: `${Math.floor((calculations.totalClusters * 15) / 60)}h ${(calculations.totalClusters * 15) % 60}m`,
        shape: 'Straight'
      })

      toast.success("Production form generated and inventory updated successfully!")
      
      // Navigate to production forms with the design data
      navigate("/production-forms", {
        state: {
          designData: {
            clientName,
            projectName,
            length: dimensions,
            style,
            colorClusters,
            calculations,
            shape: 'Straight'
          }
        }
      })
      
      onInventoryChecked()
    } catch (error) {
      console.error('Error generating production form:', error)
      toast.error("Failed to generate production form")
    } finally {
      setIsGeneratingForm(false)
    }
  }

  // Set up a realtime subscription to inventory changes
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
        (payload) => {
          console.log('Inventory changed, refreshing inventory check:', payload)
          handleInventoryCheck() // Refresh inventory data when changes occur
        }
      )
      .subscribe()

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [colorClusters])

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
              disabled={isLoading || isGeneratingForm}
            >
              Refresh Inventory
            </Button>
            {canProceed && (
              <Button
                onClick={generateProductionForm}
                disabled={isLoading || isGeneratingForm}
                className="flex-1"
              >
                Generate Production Form
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
