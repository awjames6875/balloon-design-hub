import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { saveDesignForm } from "@/services/designFormService"
import { ProjectInfoForm } from "./forms/ProjectInfoForm"
import { DesignDetailsForm } from "./forms/DesignDetailsForm"
import { useDesignCalculations } from "@/hooks/use-design-calculations"
import { validateDesignForm } from "@/utils/design-form-validation"

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

  const {
    calculations,
    isCalculating,
    colorClusters,
    updateColorClusters,
  } = useDesignCalculations(length, style)

  const handleProjectSelect = (project: { client_name: string; project_name: string }) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
  }

  const handleColorsSelected = (colors: string[]) => {
    console.log("Colors selected in DesignSpecsForm:", colors)
    setSelectedColors(colors)
    updateColorClusters(colors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isValid = validateDesignForm({
      clientName,
      projectName,
      length,
      style,
      selectedColors,
      calculations,
    })

    if (!isValid) return

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

  const isFormValid = clientName && 
    projectName && 
    length && 
    style && 
    selectedColors.length === 4 && 
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