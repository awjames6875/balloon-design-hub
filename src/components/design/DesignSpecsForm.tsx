import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { ProjectSearch } from "./ProjectSearch"
import { DimensionsInput } from "./DimensionsInput"
import { ColorSelect } from "./ColorSelect"
import { StyleSelect } from "./StyleSelect"
import { ClientInfoFields } from "./ClientInfoFields"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"

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
  const [shape, setShape] = useState("Straight") // Default to Straight shape
  
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

    try {
      // First save the client project
      const { error: projectError } = await supabase
        .from("client_projects")
        .insert([{
          client_name: clientName,
          project_name: projectName,
        }])

      if (projectError) throw projectError

      const calculations = await calculateBalloonRequirements(parseInt(length), style)
      
      if (!calculations) {
        toast.error("Could not find balloon formula for the selected dimensions and style")
        return
      }

      // Then save production details
      const { error: productionError } = await supabase
        .from("production_details")
        .insert([{
          client_name: clientName,
          project_name: projectName,
          dimensions_ft: parseInt(length),
          colors: selectedColors,
          base_clusters: calculations.baseClusters,
          extra_clusters: calculations.extraClusters,
          total_clusters: calculations.totalClusters,
          littles_quantity: calculations.littlesQuantity,
          grapes_quantity: calculations.grapesQuantity,
          balloons_11in: calculations.balloons11in,
          balloons_16in: calculations.balloons16in,
          total_balloons: calculations.totalBalloons,
          shape: shape,
        }])

      if (productionError) throw productionError

      toast.success("Project saved successfully!")
      
      onSubmit({
        clientName,
        projectName,
        length,
        colors: selectedColors,
        style,
        shape,
      })
    } catch (error) {
      console.error("Error saving project:", error)
      toast.error("Failed to save project")
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