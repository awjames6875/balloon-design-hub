
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { InventoryTable } from "./InventoryTable"
import { checkInventory, getLatestInventory } from "./inventoryService"
import { saveDesignToProduction } from "@/services/productionService"
import { updateInventory } from "@/services/inventoryService"
import { calculateBalloonsPerColor } from "@/utils/balloonCalculationUtils"
import type { InventoryItem, ColorCluster, Calculations } from "./types"
import { supabase } from "@/integrations/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

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
  const navigate = useNavigate()
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingForm, setIsGeneratingForm] = useState(false)

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

  const generateProductionForm = async () => {
    if (!calculations) {
      toast.error("Missing calculations data")
      return
    }
    
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

  // Force refresh inventory when the refresh button is clicked
  const handleRefreshInventory = () => {
    handleInventoryCheck()
    toast.success("Refreshing inventory data...")
  }

  // Initial inventory check and setup realtime
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

  // Refresh when the refresh trigger changes or color clusters change
  useEffect(() => {
    if (refreshTrigger) {
      console.log("Refresh trigger changed, refreshing inventory check")
      handleInventoryCheck()
    }
  }, [refreshTrigger, colorClusters])

  const canProceed = !inventoryItems.some(item => item.status === 'out-of-stock') && 
                    colorClusters.length > 0 && 
                    calculations !== undefined

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Inventory Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {showDemoMessage && (
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                This is a demo of the inventory check system. Create a design with color clusters to see real inventory requirements.
              </AlertDescription>
            </Alert>
          )}
          
          <InventoryTable 
            items={inventoryItems}
            isLoading={isLoading}
          />

          <div className="flex gap-4">
            <Button 
              onClick={handleRefreshInventory} 
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
