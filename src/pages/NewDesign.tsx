import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageUpload } from "@/components/design/ImageUpload"
import { DesignSpecsForm, type DesignSpecsFormData } from "@/components/design/DesignSpecsForm"
import { AccessoriesDetailsForm } from "@/components/design/AccessoriesDetailsForm"
import { ProductionSummary } from "@/components/design/ProductionSummary"
import { toast } from "sonner"

interface Accessory {
  type: string
  quantity: number
}

const NewDesign = () => {
  const navigate = useNavigate()
  const [clientImage, setClientImage] = useState<string | null>(null)
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [showAccessoriesDetails, setShowAccessoriesDetails] = useState(false)
  const [showProductionSummary, setShowProductionSummary] = useState(false)
  const [designData, setDesignData] = useState<DesignSpecsFormData | null>(null)
  const [accessoriesData, setAccessoriesData] = useState<Accessory[] | null>(null)

  const handleClientImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setClientImage(reader.result as string)
      toast.success("Client reference image uploaded!")
    }
    reader.readAsDataURL(file)
  }

  const handleDesignImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setDesignImage(reader.result as string)
      toast.success("Design uploaded successfully!")
    }
    reader.readAsDataURL(file)
  }

  const handleFormSubmit = async (data: DesignSpecsFormData) => {
    if (!designImage) {
      toast.error("Please upload your balloon design")
      return
    }

    setDesignData(data)
    setShowAccessoriesDetails(true)
  }

  const handleAccessoriesSubmit = (accessories: Accessory[]) => {
    setAccessoriesData(accessories)
    setShowProductionSummary(true)
  }

  const handleProductionFinalize = () => {
    navigate("/production-forms", {
      state: {
        clientName: designData?.clientName,
        projectName: designData?.projectName,
        length: designData?.length,
        style: designData?.style,
        shape: designData?.shape,
        calculations: designData?.calculations,
        imagePreview: designImage,
        clientReference: clientImage
      }
    })
  }

  if (showProductionSummary && designData && accessoriesData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProductionSummary
          clientName={designData.clientName}
          projectName={designData.projectName}
          dimensions={designData.length}
          style={designData.style}
          colorClusters={[]}
          accessories={accessoriesData}
          onFinalize={handleProductionFinalize}
          calculations={designData.calculations}
        />
      </div>
    )
  }

  if (showAccessoriesDetails) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <AccessoriesDetailsForm onNext={handleAccessoriesSubmit} />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">
        Create New Balloon Design
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        <ImageUpload
          title="Client Reference"
          description="Upload the client's inspiration image"
          image={clientImage}
          onImageUpload={handleClientImageUpload}
        />

        <ImageUpload
          title="Balloon Design"
          description="Upload your balloon arrangement design"
          image={designImage}
          onImageUpload={handleDesignImageUpload}
        />

        <div className="md:col-span-2">
          <DesignSpecsForm onSubmit={handleFormSubmit} />
        </div>
      </div>
    </div>
  )
}

export default NewDesign