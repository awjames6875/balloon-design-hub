import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/design/ImageUpload"
import { ManualImageAnalysisForm } from "@/components/design/ManualImageAnalysisForm"
import { uploadDesignImage } from "@/utils/imageAnalysis"
import { toast } from "sonner"
import { useState } from "react"

interface ImageUploadSectionProps {
  onImageUploaded: (imagePath: string) => void
  onAnalysisDataSubmitted?: (data: {
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  }) => void
}

export const ImageUploadSection = ({ 
  onImageUploaded,
  onAnalysisDataSubmitted 
}: ImageUploadSectionProps) => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    setIsUploading(true)
    try {
      const imagePath = await uploadDesignImage(file)
      if (imagePath) {
        setUploadedImage(imagePath)
        onImageUploaded(imagePath)
        toast.success("Image uploaded successfully")
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleAnalysisDataSubmit = (data: {
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  }) => {
    if (onAnalysisDataSubmitted) {
      onAnalysisDataSubmitted(data)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Design Image</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload 
            title="Design Image"
            description="Upload an image of your balloon design"
            image={uploadedImage}
            onImageUpload={handleImageUpload}
          />
        </CardContent>
      </Card>

      <ManualImageAnalysisForm
        onDataSubmit={handleAnalysisDataSubmit}
        disabled={isUploading}
      />
    </div>
  )
}