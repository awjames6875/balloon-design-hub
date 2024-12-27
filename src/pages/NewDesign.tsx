import { useState } from "react"
import { Header } from "@/components/Header"
import { ImageUploadSection } from "@/components/design/page/ImageUploadSection"
import { DesignSpecsForm } from "@/components/design/DesignSpecsForm"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

export default function NewDesign() {
  const [designImage, setDesignImage] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleImageUploaded = (imagePath: string) => {
    setDesignImage(imagePath)
  }

  const handleFormSubmit = async (formData: any) => {
    try {
      toast.success("Design saved successfully")
      navigate("/production-forms")
    } catch (error) {
      console.error("Error saving design:", error)
      toast.error("Failed to save design")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Create New Design</h1>
            <p className="text-gray-600">
              Upload your design image and specify the requirements
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <ImageUploadSection onImageUploaded={handleImageUploaded} />
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <DesignSpecsForm
                onSubmit={handleFormSubmit}
                designImage={designImage}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}