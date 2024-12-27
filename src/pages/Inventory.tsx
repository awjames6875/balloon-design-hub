import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CurrentInventorySection } from "@/components/inventory/CurrentInventorySection"
import { StockAnalyticsSection } from "@/components/inventory/StockAnalyticsSection"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"
import { InventoryCheckForm } from "@/components/design/InventoryCheckForm"
import { supabase } from "@/integrations/supabase/client"
import type { BalloonInventory } from "@/components/inventory/types"

export default function Inventory() {
  const location = useLocation()
  const navigate = useNavigate()
  const designData = location.state?.designData
  const fromDesign = location.state?.fromDesign

  const [inventory, setInventory] = useState<BalloonInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInventory = async () => {
    try {
      const { data, error } = await supabase
        .from('balloon_inventory')
        .select('*')
        
      if (error) {
        throw error
      }

      // Transform the data to match BalloonInventory type
      const transformedData: BalloonInventory[] = data.map(item => ({
        type: item.color,
        style: item.size,
        inStock: item.quantity,
        toOrder: 0
      }))

      setInventory(transformedData)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast.error('Failed to load inventory data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInventoryUpdate = () => {
    fetchInventory() // Refresh inventory data after update
  }

  useEffect(() => {
    fetchInventory()
  }, [])

  const handleProceedToProduction = () => {
    if (designData) {
      navigate("/production-forms", { state: designData })
      toast.success("Proceeding to production form")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToHome />
      
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          {fromDesign && designData && (
            <Button 
              onClick={handleProceedToProduction}
              className="bg-accent hover:bg-accent/90"
            >
              Proceed to Production Form
            </Button>
          )}
        </div>

        {fromDesign && designData && (
          <InventoryCheckForm
            colorClusters={designData.colorClusters}
            calculations={designData.calculations}
            onInventoryChecked={handleProceedToProduction}
            clientName={designData.clientName}
            projectName={designData.projectName}
            dimensions={designData.length}
            style={designData.style}
          />
        )}

        <div className="grid gap-8 md:grid-cols-2">
          <CurrentInventorySection 
            inventory={inventory}
            isLoading={isLoading}
            onInventoryUpdate={handleInventoryUpdate}
          />
          <StockAnalyticsSection inventory={inventory} />
        </div>
      </div>
    </div>
  )
}