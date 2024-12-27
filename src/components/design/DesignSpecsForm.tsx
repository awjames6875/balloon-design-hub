import { useState } from "react"
import { toast } from "sonner"
import { saveDesignForm } from "@/services/designFormService"
import { ProjectInfoForm } from "./forms/ProjectInfoForm"
import { DimensionsForm } from "./forms/DimensionsForm"
import { ColorSelectionForm } from "./forms/ColorSelectionForm"
import { FormSubmitButton } from "./forms/FormSubmitButton"
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
  buttonText?: string
}

export const DesignSpecsForm = ({ 
  onSubmit, 
  designImage,
  buttonText = "Submit" 
}: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [length, setLength] = useState("")
  const [style, setStyle] = useState("")
  const [shape, setShape] = useState("Straight")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

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
    
    if (isSubmitting) return

    const isValid = validateDesignForm({
      clientName,
      projectName,
      length,
      style,
      selectedColors,
      calculations,
    })

    if (!isValid) return

    setIsSubmitting(true)

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
        toast.success("Design form saved successfully!")
        onSubmit(formData)
      }
    } catch (error) {
      console.error("Error in form submission:", error)
      toast.error("Error calculating balloon requirements")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Updated validation logic to be more precise
  const isFormValid = Boolean(
    clientName && 
    projectName && 
    length && 
    style && 
    selectedColors.length === 4 && 
    calculations && 
    !isCalculating
  )

  console.log("Form validation state:", {
    clientName: Boolean(clientName),
    projectName: Boolean(projectName),
    length: Boolean(length),
    style: Boolean(style),
    selectedColors: selectedColors.length === 4,
    calculations: Boolean(calculations),
    isCalculating,
    isFormValid
  })

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProjectInfoForm
        clientName={clientName}
        projectName={projectName}
        onClientNameChange={setClientName}
        onProjectNameChange={setProjectName}
        onProjectSelect={handleProjectSelect}
      />

      <DimensionsForm
        length={length}
        style={style}
        onLengthChange={setLength}
        onStyleChange={setStyle}
        disabled={isCalculating}
      />

      <ColorSelectionForm
        designImage={designImage || null}
        onColorsSelected={handleColorsSelected}
        disabled={isCalculating}
      />

      {isCalculating && (
        <div className="text-center text-sm text-muted-foreground">
          Updating calculations...
        </div>
      )}

      <FormSubmitButton
        isValid={isFormValid}
        isCalculating={isCalculating || isSubmitting}
        buttonText={buttonText}
      />
    </form>
  )
}