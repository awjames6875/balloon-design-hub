import { useState, useEffect } from "react"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"
import { generateColorPattern } from "@/utils/colorPatterns"
import { toast } from "sonner"

interface Calculations {
  baseClusters: number
  extraClusters: number
  totalClusters: number
  littlesQuantity: number
  grapesQuantity: number
  balloons11in: number
  balloons16in: number
  totalBalloons: number
}

export const useDesignCalculations = (length: string, style: string) => {
  const [calculations, setCalculations] = useState<Calculations | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [colorClusters, setColorClusters] = useState<Array<{
    color: string
    baseClusters: number
    extraClusters: number
  }>>([])

  useEffect(() => {
    const updateCalculations = async () => {
      if (!length || !style) return
      
      setIsCalculating(true)
      console.log("Updating calculations for length:", length, "and style:", style)

      try {
        const newCalculations = await calculateBalloonRequirements(parseInt(length), style)
        console.log("New calculations:", newCalculations)
        setCalculations(newCalculations)
      } catch (error) {
        console.error("Error updating calculations:", error)
        toast.error("Failed to update balloon calculations")
      } finally {
        setIsCalculating(false)
      }
    }

    updateCalculations()
  }, [length, style])

  const updateColorClusters = (selectedColors: string[]) => {
    if (selectedColors.length === 4 && calculations) {
      console.log("Updating color clusters with colors:", selectedColors)
      const newColorClusters = generateColorPattern(
        selectedColors,
        calculations.totalClusters
      )
      console.log("New color clusters:", newColorClusters)
      setColorClusters(newColorClusters)
    }
  }

  return {
    calculations,
    isCalculating,
    colorClusters,
    updateColorClusters,
  }
}