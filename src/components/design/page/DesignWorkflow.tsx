import { useState } from "react"
import { Card } from "@/components/ui/card"
import { DesignSpecsForm, DesignSpecsFormData } from "@/components/design/DesignSpecsForm"
import { InventoryCheckForm } from "@/components/design/InventoryCheckForm"
import { AccessoriesDetailsForm } from "@/components/design/AccessoriesDetailsForm"
import { ProductionSummary } from "@/components/design/ProductionSummary"

type Step = "specs" | "inventory" | "accessories" | "summary"

interface DesignWorkflowProps {
  designImage?: string | null
}

export const DesignWorkflow = ({ designImage }: DesignWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("specs")
  const [formData, setFormData] = useState<DesignSpecsFormData | null>(null)
  const [accessories, setAccessories] = useState<Array<{ type: string; quantity: number }>>([])

  const handleSpecsSubmit = (data: DesignSpecsFormData) => {
    setFormData(data)
    setCurrentStep("inventory")
  }

  const handleInventoryChecked = () => {
    setCurrentStep("accessories")
  }

  const handleAccessoriesSubmit = (accessoryData: Array<{ type: string; quantity: number }>) => {
    setAccessories(accessoryData)
    setCurrentStep("summary")
  }

  if (!formData && currentStep !== "specs") {
    return null
  }

  return (
    <Card className="p-6">
      {currentStep === "specs" && (
        <DesignSpecsForm onSubmit={handleSpecsSubmit} designImage={designImage} />
      )}

      {currentStep === "inventory" && formData && (
        <InventoryCheckForm
          colorClusters={formData.colorClusters}
          calculations={formData.calculations}
          onInventoryChecked={handleInventoryChecked}
        />
      )}

      {currentStep === "accessories" && formData && (
        <AccessoriesDetailsForm
          calculations={formData.calculations}
          onSubmit={handleAccessoriesSubmit}
        />
      )}

      {currentStep === "summary" && formData && (
        <ProductionSummary
          designSpecs={formData}
          accessories={accessories}
        />
      )}
    </Card>
  )
}