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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

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
    fetchInventory()
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
            <Sheet>
              <SheetTrigger asChild>
                <Button className="bg-accent hover:bg-accent/90">
                  Proceed to Production Form
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                  <SheetTitle>Production Form</SheetTitle>
                  <SheetDescription>
                    Review and confirm production details
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6">
                  <Button 
                    onClick={handleProceedToProduction}
                    className="w-full"
                  >
                    Confirm and Proceed
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        <CurrentInventorySection 
          inventory={inventory}
          isLoading={isLoading}
          onInventoryUpdate={handleInventoryUpdate}
        />

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

        <StockAnalyticsSection inventory={inventory} />
      </div>
    </div>
  )
}