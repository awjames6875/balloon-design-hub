import { useState } from "react"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"
import { AIDesignUpload } from "@/components/design/AIDesignUpload"

export default function NewDesign() {
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<{
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  } | null>(null)

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <BackToHome />

        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-800">Create New Design</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Start by uploading your design image
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <AIDesignUpload 
                onImageUploaded={handleImageUploaded}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}