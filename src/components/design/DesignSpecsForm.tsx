import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ProjectSearch } from "./ProjectSearch"
import { DimensionsInput } from "./DimensionsInput"
import { StyleSelect } from "./StyleSelect"
import { ClientInfoFields } from "./ClientInfoFields"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"
import { saveDesignForm } from "@/services/designFormService"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"

export interface DesignSpecsFormData {
  clientName: string
  projectName: string
  length: string
  style: string
  shape: string
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
}

export const DesignSpecsForm = ({ onSubmit }: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [length, setLength] = useState("")
  const [style, setStyle] = useState("")
  const [shape, setShape] = useState("Straight")
  
  const { data: balloonStyles, isLoading: isLoadingStyles } = useBalloonStyles()

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

    try {
      // Calculate all balloon requirements
      const calculations = await calculateBalloonRequirements(parseInt(length), style)

      console.log("Calculated values:", calculations)

      const formData: DesignSpecsFormData = {
        clientName,
        projectName,
        length,
        style,
        shape,
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

  const handleProjectSelect = (project: { client_name: string; project_name: string }) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ProjectSearch onProjectSelect={handleProjectSelect} />

      <ClientInfoFields
        clientName={clientName}
        projectName={projectName}
        onClientNameChange={setClientName}
        onProjectNameChange={setProjectName}
      />

      <DimensionsInput
        length={length}
        onLengthChange={setLength}
      />

      <StyleSelect
        value={style}
        onValueChange={setStyle}
        styles={balloonStyles}
        isLoading={isLoadingStyles}
      />

      <Button type="submit" className="w-full">
        Generate Production Form
      </Button>
    </form>
  )
}