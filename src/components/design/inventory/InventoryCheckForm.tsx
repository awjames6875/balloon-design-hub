import { useState } from "react"
import { toast } from "sonner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryTable } from "./InventoryTable"
import { InventoryActions } from "./InventoryActions"
import { checkInventory } from "./inventoryService"
import { saveDesignToProduction } from "@/services/productionService"
import { updateInventory } from "@/services/inventoryService"
import { calculateBalloonsPerColor } from "@/utils/balloonCalculationUtils"
import type { ColorCluster, Calculations } from "./types"

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
  const [inventoryItems, setInventoryItems] = useState<Array<{
    color: string
    status: 'in-stock' | 'low' | 'out-of-stock'
    required: number
    available: number
  }>>([])
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
      
      // Refresh the inventory display
      await handleInventoryCheck()
      
      onInventoryChecked()
    } catch (error) {
      console.error('Error generating production form:', error)
      toast.error("Failed to generate production form")
    } finally {
      setIsGeneratingForm(false)
    }
  }

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

          <InventoryActions
            onRefresh={handleInventoryCheck}
            onGenerate={generateProductionForm}
            canProceed={!inventoryItems.some(item => item.status === 'out-of-stock')}
            isLoading={isLoading}
            isGenerating={isGeneratingForm}
          />
        </div>
      </CardContent>
    </Card>
  )
}