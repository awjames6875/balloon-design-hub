import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { saveDesignForm } from "@/services/designFormService"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"
import { generateColorPattern } from "@/utils/colorPatterns"
import { ProjectInfoForm } from "./forms/ProjectInfoForm"
import { DesignDetailsForm } from "./forms/DesignDetailsForm"

export interface DesignSpecsFormData {
  clientName: string
  projectName: string
  length: string
  style: string
  shape: string
  colorClusters: Array<{
    color: string
    baseClusters: number
    extraClusters: number
  }>
  calculations: {
    baseClusters: number
    extraClusters: number
    totalClusters: number
    littlesQuantity: number
    grapesQuantity: number
    balloons11in: number
    balloons16in: number
    totalBalloons: number
  }
}

interface DesignSpecsFormProps {
  onSubmit: (data: DesignSpecsFormData) => void
  designImage?: string | null
}

export const DesignSpecsForm = ({ onSubmit, designImage }: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [length, setLength] = useState("")
  const [style, setStyle] = useState("")
  const [shape, setShape] = useState("Straight")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [calculations, setCalculations] = useState<DesignSpecsFormData["calculations"] | null>(null)
  const [colorClusters, setColorClusters] = useState<DesignSpecsFormData["colorClusters"]>([])
  const [isCalculating, setIsCalculating] = useState(false)

  const handleProjectSelect = (project: { client_name: string; project_name: string }) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
  }

  // Effect to update calculations when length or style changes
  useEffect(() => {
    const updateCalculations = async () => {
      if (!length || !style) return
      
      setIsCalculating(true)
      console.log("Updating calculations for length:", length, "and style:", style)

      try {
        const newCalculations = await calculateBalloonRequirements(parseInt(length), style)
        console.log("New calculations:", newCalculations)
        setCalculations(newCalculations)

        // Update color clusters if we have colors selected
        if (selectedColors.length > 0 && newCalculations) {
          console.log("Updating color clusters with colors:", selectedColors)
          const newColorClusters = generateColorPattern(
            selectedColors,
            newCalculations.totalClusters
          )
          console.log("New color clusters:", newColorClusters)
          setColorClusters(newColorClusters)
        }
      } catch (error) {
        console.error("Error updating calculations:", error)
        toast.error("Failed to update balloon calculations")
      } finally {
        setIsCalculating(false)
      }
    }

    updateCalculations()
  }, [length, style, selectedColors])

  // Effect to update color clusters when colors change
  useEffect(() => {
    if (calculations && selectedColors.length > 0) {
      console.log("Updating color clusters due to color change:", selectedColors)
      const newColorClusters = generateColorPattern(
        selectedColors,
        calculations.totalClusters
      )
      console.log("New color clusters after color change:", newColorClusters)
      setColorClusters(newColorClusters)
    }
  }, [selectedColors, calculations])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!clientName || !projectName) {
      toast.error("Please enter both client name and project name")
      return
    }

    if (!length) {
      toast.error("Please enter the length")
      return
    }

    if (!style) {
      toast.error("Please select a balloon style")
      return
    }

    if (selectedColors.length === 0) {
      toast.error("Please select at least one color")
      return
    }

    if (!calculations || colorClusters.length === 0) {
      toast.error("Please wait for calculations to complete")
      return
    }

    try {
      const formData: DesignSpecsFormData = {
        clientName,
        projectName,
        length,
        style,
        shape,
        colorClusters,
        calculations
      }

      const success = await saveDesignForm(formData)
      if (success) {
        onSubmit(formData)
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error("Error calculating balloon requirements")
    }
  }

  const handleColorsSelected = (colors: string[]) => {
    console.log("Colors selected:", colors)
    setSelectedColors(colors)
  }

  const isFormValid = clientName && 
    projectName && 
    length && 
    style && 
    selectedColors.length > 0 && 
    calculations !== null && 
    !isCalculating

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProjectInfoForm
        clientName={clientName}
        projectName={projectName}
        onClientNameChange={setClientName}
        onProjectNameChange={setProjectName}
        onProjectSelect={handleProjectSelect}
      />

      <DesignDetailsForm
        length={length}
        style={style}
        designImage={designImage}
        onLengthChange={setLength}
        onStyleChange={setStyle}
        onColorsSelected={handleColorsSelected}
        isCalculating={isCalculating}
      />

      {isCalculating && (
        <div className="text-center text-sm text-muted-foreground">
          Updating calculations...
        </div>
      )}

      <Button 
        type="submit" 
        className="w-full"
        disabled={!isFormValid}
      >
        Generate Production Form
      </Button>
    </form>
  )
}