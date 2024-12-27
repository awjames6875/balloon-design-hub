import { useState } from "react"
import { ImageUploadSection } from "@/components/design/page/ImageUploadSection"
import { DesignSpecsForm } from "@/components/design/DesignSpecsForm"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"

export default function NewDesign() {
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<{
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  } | null>(null)
  const navigate = useNavigate()

  const handleImageUploaded = (imagePath: string) => {
    setDesignImage(imagePath)
  }

  const handleAnalysisDataSubmitted = (data: {
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  }) => {
    setAnalysisData(data)
    console.log("Analysis data received:", data)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      // Navigate to inventory first with the design data
      navigate("/inventory", {
        state: {
          fromDesign: true,
          designData: {
            clientName: formData.clientName,
            projectName: formData.projectName,
            length: formData.length,
            style: formData.style,
            shape: formData.shape,
            colorClusters: formData.colorClusters,
            calculations: formData.calculations,
            imagePreview: designImage,
            clientReference: null,
            analysisData // Include the manual analysis data
          }
        }
      })
      toast.success("Design saved! Please check inventory before proceeding.")
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Failed to save design")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <BackToHome />

        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-800">Create New Design</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Start by uploading your design image, then specify the requirements below
            </p>
          </div>

          <div className="space-y-8">
            {/* Image Upload Section with Manual Analysis Form */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <ImageUploadSection 
                onImageUploaded={handleImageUploaded}
                onAnalysisDataSubmitted={handleAnalysisDataSubmitted}
              />
            </div>

            {/* Design Specs Form */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <DesignSpecsForm
                onSubmit={handleFormSubmit}
                designImage={designImage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}