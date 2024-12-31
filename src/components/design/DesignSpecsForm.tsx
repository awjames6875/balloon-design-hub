import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectInfoForm } from "./forms/ProjectInfoForm"
import { DimensionsForm } from "./forms/DimensionsForm"
import { StyleSelect } from "./StyleSelect"
import { ColorSelectionForm } from "./forms/ColorSelectionForm"
import { FormSubmitButton } from "./forms/FormSubmitButton"
import { validateDesignForm } from "@/utils/design-form-validation"
import { useDesignCalculations } from "@/hooks/use-design-calculations"
import { toast } from "sonner"
import BalloonGeni from "./BalloonGeni/BalloonGeniPrompt"
import CopyBalloonGeniPrompt from "./BalloonGeni/CopyBalloonGeniPrompt"
import type { CorrectionProps } from "./BalloonGeni/types"

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
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [colorClusters, setColorClusters] = useState<Array<{
    color: string
    baseClusters: number
    extraClusters: number
  }>>([])
  const [totalClusters, setTotalClusters] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { calculations, isCalculating } = useDesignCalculations({
    length: parseInt(length) || 0,
    style
  })

  const handleProjectSelect = (project: { client_name: string; project_name: string }) => {
    setClientName(project.client_name)
    setProjectName(project.project_name)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const analysisData = urlParams.get('analysisData')
    if (analysisData) {
      try {
        const parsed = JSON.parse(analysisData)
        setTotalClusters(parsed.clusters)
      } catch (error) {
        console.error("Error parsing analysis data:", error)
      }
    }
  }, [])

  const handleGeniUpdate = async (correction: CorrectionProps) => {
    try {
      if (correction.type === 'cluster_count') {
        const updatedClusters = colorClusters.map(cluster => {
          if (cluster.color.toLowerCase() === correction.color.toLowerCase()) {
            return {
              ...cluster,
              baseClusters: Math.ceil(correction.clusterCount! * 0.7),
              extraClusters: Math.floor(correction.clusterCount! * 0.3)
            }
          }
          return cluster
        })

        setColorClusters(updatedClusters)
        
        // Recalculate totals
        const totalClustersCount = updatedClusters.reduce(
          (sum, cluster) => sum + cluster.baseClusters + cluster.extraClusters, 
          0
        )
        setTotalClusters(totalClustersCount)

        toast.success(`Updated clusters for ${correction.color}`)
      }
    } catch (error) {
      console.error("Error updating design:", error)
      toast.error("Failed to update design")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const isValid = validateDesignForm({
        clientName,
        projectName,
        length,
        style,
        selectedColors,
        calculations
      })

      if (!isValid) {
        setIsSubmitting(false)
        return
      }

      // Create color clusters based on the total clusters and selected colors
      const clustersPerColor = Math.floor((totalClusters || calculations?.totalClusters || 0) / selectedColors.length)
      const remainingClusters = (totalClusters || calculations?.totalClusters || 0) % selectedColors.length

      const colorClusters = selectedColors.map((color, index) => ({
        color,
        baseClusters: clustersPerColor + (index < remainingClusters ? 1 : 0),
        extraClusters: 0
      }))

      const formData: DesignSpecsFormData = {
        clientName,
        projectName,
        length,
        style,
        shape: 'Straight',
        colorClusters,
        calculations: {
          ...calculations!,
          totalClusters: totalClusters || calculations?.totalClusters || 0
        }
      }

      onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Failed to submit design specifications")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Design Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
          />

          <ColorSelectionForm
            designImage={designImage}
            onColorsSelected={setSelectedColors}
          />

          {selectedColors.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              <BalloonGeni 
                onUpdate={handleGeniUpdate}
                colorClusters={colorClusters}
              />
              <CopyBalloonGeniPrompt 
                onUpdate={handleGeniUpdate}
                colorClusters={colorClusters}
              />
            </div>
          )}

          <FormSubmitButton
            isCalculating={isCalculating}
            isValid={selectedColors.length > 0 && !!length && !!style}
            buttonText="Save Design"
          />
        </CardContent>
      </Card>
    </form>
  )
}
