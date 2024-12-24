import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { ProjectSearch } from "./ProjectSearch"
import { DimensionsInput } from "./DimensionsInput"
import { StyleSelect } from "./StyleSelect"
import { ClientInfoFields } from "./ClientInfoFields"
import { ColorSelection } from "./ColorSelection"
import { useBalloonStyles } from "@/hooks/use-balloon-styles"
import { saveDesignForm } from "@/services/designFormService"
import { calculateBalloonRequirements } from "@/utils/balloonCalculations"
import { supabase } from "@/integrations/supabase/client"

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
  const [detectedColors, setDetectedColors] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  
  const { data: balloonStyles, isLoading: isLoadingStyles } = useBalloonStyles()

  // Analyze image colors when design image changes
  const analyzeImageColors = async (imagePath: string) => {
    try {
      const { data, error } = await supabase
        .from('design_image_analysis')
        .select('detected_colors')
        .eq('image_path', imagePath)
        .single()

      if (error) throw error

      if (data?.detected_colors) {
        setDetectedColors(data.detected_colors as string[])
      }
    } catch (error) {
      console.error('Error fetching color analysis:', error)
      toast.error("Failed to analyze image colors")
    }
  }

  // Update colors when design image changes
  useEffect(() => {
    if (designImage) {
      analyzeImageColors(designImage)
    }
  }, [designImage])

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

    try {
      // Calculate all balloon requirements
      const calculations = await calculateBalloonRequirements(parseInt(length), style)

      // Calculate clusters per color
      const clustersPerColor = Math.floor(calculations.totalClusters / selectedColors.length)
      const extraClustersPerColor = Math.floor(calculations.extraClusters / selectedColors.length)

      const colorClusters = selectedColors.map(color => ({
        color,
        baseClusters: clustersPerColor,
        extraClusters: extraClustersPerColor
      }))

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

  const handleProjectSelect = (project: { client_name: string; project_name: string }) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
  }

  const handleColorSelect = (color: string) => {
    if (selectedColors.includes(color)) {
      setSelectedColors(selectedColors.filter(c => c !== color))
    } else {
      setSelectedColors([...selectedColors, color])
    }
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

      <ColorSelection
        detectedColors={detectedColors}
        selectedColors={selectedColors}
        onColorSelect={handleColorSelect}
      />

      <Button type="submit" className="w-full">
        Generate Production Form
      </Button>
    </form>
  )
}
