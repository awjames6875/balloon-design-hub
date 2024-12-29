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

interface DesignSpecsFormProps {
  onSubmit: (data: any) => void
  designImage?: string | null
}

export const DesignSpecsForm = ({ onSubmit, designImage }: DesignSpecsFormProps) => {
  const [clientName, setClientName] = useState("")
  const [projectName, setProjectName] = useState("")
  const [length, setLength] = useState("")
  const [style, setStyle] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalClusters, setTotalClusters] = useState<number | null>(null)

  const calculations = useDesignCalculations({
    length: parseInt(length) || 0,
    style,
    totalClusters: totalClusters || 0
  })

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
      const clustersPerColor = Math.floor((totalClusters || 0) / selectedColors.length)
      const remainingClusters = (totalClusters || 0) % selectedColors.length

      const colorClusters = selectedColors.map((color, index) => ({
        color,
        baseClusters: clustersPerColor + (index < remainingClusters ? 1 : 0),
        extraClusters: 0
      }))

      const formData = {
        clientName,
        projectName,
        length,
        style,
        shape: 'Straight',
        colorClusters,
        calculations: {
          ...calculations,
          totalClusters: totalClusters || calculations.totalClusters
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

  // Update total clusters when analysis data changes
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
          />

          <DimensionsForm
            length={length}
            onLengthChange={setLength}
          />

          <StyleSelect
            value={style}
            onChange={setStyle}
          />

          <ColorSelectionForm
            selectedColors={selectedColors}
            onColorsChange={setSelectedColors}
            designImage={designImage}
          />

          <FormSubmitButton
            isSubmitting={isSubmitting}
            isValid={selectedColors.length > 0 && !!length && !!style}
          />
        </CardContent>
      </Card>
    </form>
  )
}