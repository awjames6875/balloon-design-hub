
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CurrentInventorySection } from "@/components/inventory/CurrentInventorySection"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"
import { InventoryCheckForm } from "@/components/design/inventory/InventoryCheckForm"
import { supabase } from "@/integrations/supabase/client"
import type { BalloonInventory } from "@/components/inventory/types"
import { ArrowLeft } from "lucide-react"
import { enableRealtimeForInventory } from "@/utils/inventoryValidation"
import { BalloonType } from "@/types/inventory"
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
  const [balloonTypes, setBalloonTypes] = useState<BalloonType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [inventoryRefreshTrigger, setInventoryRefreshTrigger] = useState(Date.now())

  const fetchInventory = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('balloon_inventory')
        .select('*')
        .order('color')
        .order('size')
        
      if (error) {
        throw error
      }

      // Set the BalloonType data for the inventory table
      setBalloonTypes(data as BalloonType[])

      // Transform data for the InventoryCheckForm
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
    // Force refresh of the inventory check component
    setInventoryRefreshTrigger(Date.now())
  }

  const handleGoBack = () => {
    navigate(-1)
  }

  useEffect(() => {
    // Initialize realtime for inventory when component mounts
    enableRealtimeForInventory()
      .then(success => {
        if (success) {
          console.log("Realtime enabled for inventory")
        } else {
          console.error("Failed to enable realtime for inventory")
        }
      })
    
    fetchInventory()
  }, [])

  const handleProceedToProduction = () => {
    if (designData) {
      navigate("/production-forms", { state: designData })
      toast.success("Proceeding to production form")
    }
  }

  // Set up realtime subscription for the inventory table
  useEffect(() => {
    const channel = supabase
      .channel('inventory-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'balloon_inventory'
        },
        () => {
          console.log('Inventory changed, refreshing main inventory list...')
          fetchInventory() // Refresh inventory data when changes occur
        }
      )
      .subscribe()

    // Clean up subscription on unmount
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="outline" 
          onClick={handleGoBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <BackToHome />
      </div>
      
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

        <div className="bg-white rounded-lg shadow-md p-6">
          <CurrentInventorySection 
            balloonTypes={balloonTypes}
            onBalloonAdded={handleInventoryUpdate}
            onQuantityUpdate={handleInventoryUpdate}
          />
        </div>

        {/* Only show one version of the InventoryCheckForm based on fromDesign flag */}
        {fromDesign && designData ? (
          <InventoryCheckForm
            colorClusters={designData.colorClusters}
            calculations={designData.calculations}
            onInventoryChecked={handleProceedToProduction}
            clientName={designData.clientName}
            projectName={designData.projectName}
            dimensions={designData.length}
            style={designData.style}
            refreshTrigger={inventoryRefreshTrigger}
          />
        ) : (
          <InventoryCheckForm
            colorClusters={[]}
            calculations={undefined}
            onInventoryChecked={() => {}}
            clientName=""
            projectName=""
            dimensions=""
            style=""
            refreshTrigger={inventoryRefreshTrigger}
            showDemoMessage={true}
          />
        )}
      </div>
    </div>
  )
}
