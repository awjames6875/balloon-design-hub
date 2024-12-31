import { useState } from "react"
import { DesignSpecsForm } from "@/components/design/DesignSpecsForm"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"
import { AIDesignUpload } from "@/components/design/AIDesignUpload"
import BalloonGeni from "@/components/design/BalloonGeni/BalloonGeniPrompt"
import CopyBalloonGeniPrompt from "@/components/design/BalloonGeni/CopyBalloonGeniPrompt"
import { CorrectionProps } from "@/components/design/BalloonGeni/types"

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

  const handleAnalysisComplete = (data: {
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  }) => {
    setAnalysisData(data)
    console.log("Analysis data received:", data)
    
    // Update URL with analysis data
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('analysisData', JSON.stringify(data))
    window.history.replaceState(null, '', `?${searchParams.toString()}`)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      // Navigate to inventory with the design data
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
            calculations: {
              ...formData.calculations,
              totalClusters: analysisData?.clusters || formData.calculations.totalClusters
            },
            imagePreview: designImage,
            clientReference: null,
            analysisData
          }
        }
      })
      toast.success("Design saved! Please check inventory before proceeding.")
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Failed to save design")
    }
  }

  const handleGeniUpdate = async (correction: CorrectionProps): Promise<void> => {
    console.log("Geni update:", correction)
    // TODO: Implement the actual correction logic
    // For now, just show a success toast
    toast.success("Design updated successfully")
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
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <AIDesignUpload 
                onImageUploaded={handleImageUploaded}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8">
              <DesignSpecsForm
                onSubmit={handleFormSubmit}
                designImage={designImage}
              />
            </div>

            <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">Design Assistant</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <BalloonGeni onUpdate={handleGeniUpdate} />
                </div>
                <div>
                  <CopyBalloonGeniPrompt onUpdate={handleGeniUpdate} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}