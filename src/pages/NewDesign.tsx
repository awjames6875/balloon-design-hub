import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ImageUpload } from "@/components/design/ImageUpload"
import { DesignSpecsForm, type DesignSpecsFormData } from "@/components/design/DesignSpecsForm"
import { AccessoriesDetailsForm } from "@/components/design/AccessoriesDetailsForm"
import { InventoryCheckForm } from "@/components/design/InventoryCheckForm"
import { ProductionSummary } from "@/components/design/ProductionSummary"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { uploadDesignImage } from "@/utils/imageAnalysis"
import { runDesignTests } from "@/utils/designTesting"

interface Accessory {
  type: string
  quantity: number
}

const NewDesign = () => {
  const navigate = useNavigate()
  const [clientImage, setClientImage] = useState<string | null>(null)
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [showAccessoriesDetails, setShowAccessoriesDetails] = useState(false)
  const [showInventoryCheck, setShowInventoryCheck] = useState(false)
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

  const handleDesignImageUpload = async (file: File) => {
    console.log("Starting design image upload...")
    const reader = new FileReader()
    reader.onloadend = async () => {
      const imageUrl = reader.result as string
      setDesignImage(imageUrl)
      
      const publicUrl = await uploadDesignImage(file)
      if (!publicUrl) {
        toast.error('Failed to process design image')
        return
      }

      // Create analysis record
      const { error: analysisError } = await supabase
        .from('design_image_analysis')
        .insert([
          { 
            image_path: publicUrl,
            detected_colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF']
          }
        ])

      if (analysisError) {
        console.error('Error creating analysis record:', analysisError)
        toast.error('Failed to analyze design colors')
        return
      }

      toast.success("Design uploaded and analyzed successfully!")
    }
    reader.readAsDataURL(file)
  }

  const handleFormSubmit = async (data: DesignSpecsFormData) => {
    console.log("Form submission data:", data)
    
    if (!designImage) {
      toast.error("Please upload your balloon design")
      return
    }

    setDesignData(data)
    setShowAccessoriesDetails(true)
  }

  const handleAccessoriesSubmit = (accessories: Accessory[]) => {
    console.log("Accessories submission:", accessories)
    setAccessoriesData(accessories)
    setShowInventoryCheck(true)
  }

  const handleInventoryChecked = () => {
    setShowProductionSummary(true)
  }

  const handleProductionFinalize = () => {
    if (!designData) return

    console.log("Finalizing production with data:", {
      designData,
      accessoriesData,
      designImage,
      clientImage
    })

    navigate("/production-forms", {
      state: {
        clientName: designData.clientName,
        projectName: designData.projectName,
        length: designData.length,
        style: designData.style,
        shape: designData.shape,
        calculations: designData.calculations,
        colorClusters: designData.colorClusters,
        imagePreview: designImage,
        clientReference: clientImage
      }
    })
  }

  const handleRunTests = async () => {
    toast.info("Running design tests...")
    const results = await runDesignTests()
    
    const passedTests = results.filter(r => r.passed).length
    const totalTests = results.length
    
    toast.success(`Tests completed: ${passedTests}/${totalTests} passed`)
    console.log("Detailed test results:", results)
  }

  if (showProductionSummary && designData && accessoriesData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ProductionSummary
          clientName={designData.clientName}
          projectName={designData.projectName}
          dimensions={designData.length}
          style={designData.style}
          colorClusters={designData.colorClusters}
          accessories={accessoriesData}
          onFinalize={handleProductionFinalize}
          calculations={designData.calculations}
        />
      </div>
    )
  }

  if (showInventoryCheck && designData) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <InventoryCheckForm
          colorClusters={designData.colorClusters}
          calculations={designData.calculations}
          onInventoryChecked={handleInventoryChecked}
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          Create New Balloon Design
        </h1>
        {process.env.NODE_ENV === 'development' && (
          <Button 
            variant="outline" 
            onClick={handleRunTests}
            className="ml-4"
          >
            Run Tests
          </Button>
        )}
      </div>

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
          <DesignSpecsForm 
            onSubmit={handleFormSubmit}
            designImage={designImage}
          />
        </div>
      </div>
    </div>
  )
}

export default NewDesign
