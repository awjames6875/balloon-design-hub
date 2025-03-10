
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { calculateBalloonsPerColor } from "@/utils/balloonCalculationUtils"
import { updateInventory } from "@/services/inventoryService"
import { saveDesignToProduction } from "@/services/productionService"
import type { ColorCluster, Calculations } from "./types"

interface UseProductionFormProps {
  colorClusters: ColorCluster[]
  calculations?: Calculations
  clientName: string
  projectName: string
  dimensions: string
  style: string
  onComplete: () => void
}

export const useProductionForm = ({
  colorClusters,
  calculations,
  clientName,
  projectName,
  dimensions,
  style,
  onComplete
}: UseProductionFormProps) => {
  const navigate = useNavigate()
  const [isGeneratingForm, setIsGeneratingForm] = useState(false)

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
      
      onComplete()
    } catch (error) {
      console.error('Error generating production form:', error)
      toast.error("Failed to generate production form")
    } finally {
      setIsGeneratingForm(false)
    }
  }

  return {
    generateProductionForm,
    isGeneratingForm
  }
}
