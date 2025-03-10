
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { InventoryTable } from "./InventoryTable"
import { DemoAlert } from "./DemoAlert"
import { InventoryActionButtons } from "./InventoryActionButtons"
import { useInventoryCheck } from "./useInventoryCheck"
import { useProductionForm } from "./useProductionForm"
import type { ColorCluster, Calculations } from "./types"

interface InventoryCheckProps {
  colorClusters: ColorCluster[]
  calculations?: Calculations
  onInventoryChecked: () => void
  clientName: string
  projectName: string
  dimensions: string
  style: string
  refreshTrigger?: number
  showDemoMessage?: boolean
}

export const InventoryCheckForm = ({ 
  colorClusters, 
  calculations,
  onInventoryChecked,
  clientName,
  projectName,
  dimensions,
  style,
  refreshTrigger,
  showDemoMessage = false
}: InventoryCheckProps) => {
  // Use our custom hooks
  const { inventoryItems, isLoading, refreshInventory } = useInventoryCheck(
    colorClusters,
    refreshTrigger
  )
  
  const { generateProductionForm, isGeneratingForm } = useProductionForm({
    colorClusters,
    calculations,
    clientName,
    projectName,
    dimensions,
    style,
    onComplete: onInventoryChecked
  })

  // Determine if we can proceed based on inventory status
  const canProceed = !inventoryItems.some(item => item.status === 'out-of-stock') && 
                    colorClusters.length > 0 && 
                    calculations !== undefined

  // Handle refreshing inventory
  const handleRefreshInventory = () => {
    refreshInventory()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {showDemoMessage && <DemoAlert />}
          
          <InventoryTable 
            items={inventoryItems}
            isLoading={isLoading}
          />

          <InventoryActionButtons
            onRefresh={handleRefreshInventory}
            onGenerateForm={generateProductionForm}
            isLoading={isLoading}
            isGeneratingForm={isGeneratingForm}
            canProceed={canProceed}
          />
        </div>
      </CardContent>
    </Card>
  )
}
