import { useState } from "react"
import { ImageUploadSection } from "@/components/design/page/ImageUploadSection"
import { DesignSpecsForm } from "@/components/design/DesignSpecsForm"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewDesign() {
  const [designImage, setDesignImage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleImageUploaded = (imagePath: string) => {
    setDesignImage(imagePath)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      // Navigate to production forms with all the necessary data
      navigate("/production-forms", {
        state: {
          clientName: formData.clientName,
          projectName: formData.projectName,
          length: formData.length,
          style: formData.style,
          shape: formData.shape,
          colorClusters: formData.colorClusters,
          calculations: formData.calculations,
          imagePreview: designImage,
          clientReference: null // Optional reference that can be added later
        }
      })
      toast.success("Design saved successfully")
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Failed to save design")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 hover:bg-white/60"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-800">Create New Design</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Start by uploading your design image, then specify the requirements below
            </p>
          </div>

          <div className="space-y-8">
            {/* Image Upload Section */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <ImageUploadSection onImageUploaded={handleImageUploaded} />
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