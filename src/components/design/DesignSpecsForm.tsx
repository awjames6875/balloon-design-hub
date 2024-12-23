import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ProjectSearch } from "./ProjectSearch"
import { DimensionsInput } from "./DimensionsInput"
import { ColorSelect } from "./ColorSelect"
import { StyleSelect } from "./StyleSelect"
import { ClientInfoFields } from "./ClientInfoFields"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"
import { saveDesignForm } from "@/services/designFormService"

export interface DesignSpecsFormData {
  clientName: string
  projectName: string
  length: string
  colors: string[]
  style: string
  shape: string
}

interface DesignSpecsFormProps {
  onSubmit: (data: DesignSpecsFormData) => void
}

export const DesignSpecsForm = ({ onSubmit }: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [length, setLength] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
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

    if (selectedColors.length === 0) {
      toast.error("Please select at least one color")
      return
    }

    if (!style) {
      toast.error("Please select a balloon style")
      return
    }

    const formData: DesignSpecsFormData = {
      clientName,
      projectName,
      length,
      colors: selectedColors,
      style,
      shape,
    }

    const success = await saveDesignForm(formData)

    if (success) {
      onSubmit(formData)
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

      <ColorSelect
        selectedColors={selectedColors}
        onColorsChange={setSelectedColors}
      />

      <Button type="submit" className="w-full">
        Generate Production Form
      </Button>
    </form>
  )
}