import { useState } from "react"
import { Card } from "@/components/ui/card"
import { DesignSpecsForm, DesignSpecsFormData } from "@/components/design/DesignSpecsForm"
import { InventoryCheckForm } from "@/components/design/InventoryCheckForm"
import { AccessoriesDetailsForm } from "@/components/design/AccessoriesDetailsForm"
import { ProductionSummary } from "@/components/design/ProductionSummary"
import { toast } from "sonner"

type Step = "specs" | "inventory" | "accessories" | "summary"

interface DesignWorkflowProps {
  designImage?: string | null
}

export const DesignWorkflow = ({ designImage }: DesignWorkflowProps) => {
  const [currentStep, setCurrentStep] = useState<Step>("specs")
  const [formData, setFormData] = useState<DesignSpecsFormData | null>(null)
  const [accessories, setAccessories] = useState<Array<{ type: string; quantity: number }>>([])

  const handleSpecsSubmit = (data: DesignSpecsFormData) => {
    console.log("Design specs submitted:", data)
    setFormData(data)
    setCurrentStep("inventory")
    toast.success("Design specifications saved")
  }

  const handleInventoryChecked = () => {
    console.log("Inventory checked, moving to accessories")
    setCurrentStep("accessories")
    toast.success("Inventory check completed")
  }

  const handleAccessoriesSubmit = (accessoryData: Array<{ type: string; quantity: number }>) => {
    console.log("Accessories submitted:", accessoryData)
    setAccessories(accessoryData)
    setCurrentStep("summary")
    toast.success("Accessories added")
  }

  const handleFinalize = () => {
    toast.success("Production form generated successfully")
  }

  return (
    <Card className="p-6">
      {currentStep === "specs" && (
        <DesignSpecsForm 
          onSubmit={handleSpecsSubmit} 
          designImage={designImage}
        />
      )}

      {currentStep === "inventory" && formData && (
        <InventoryCheckForm
          colorClusters={formData.colorClusters}
          calculations={formData.calculations}
          onInventoryChecked={handleInventoryChecked}
          clientName={formData.clientName}
          projectName={formData.projectName}
          dimensions={formData.length}
          style={formData.style}
        />
      )}

      {currentStep === "accessories" && formData && (
        <AccessoriesDetailsForm
          onSubmit={handleAccessoriesSubmit}
          calculations={formData.calculations}
        />
      )}

      {currentStep === "summary" && formData && (
        <ProductionSummary
          clientName={formData.clientName}
          projectName={formData.projectName}
          dimensions={formData.length}
          style={formData.style}
          colorClusters={formData.colorClusters}
          accessories={accessories}
          onFinalize={handleFinalize}
          calculations={formData.calculations}
        />
      )}
    </Card>
  )
}