import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/design/ImageUpload"
import { uploadDesignImage } from "@/utils/imageAnalysis"
import { toast } from "sonner"

interface ImageUploadSectionProps {
  onImageUploaded: (imagePath: string) => void
}

export const ImageUploadSection = ({ onImageUploaded }: ImageUploadSectionProps) => {
  const handleImageUpload = async (file: File) => {
    try {
      const imagePath = await uploadDesignImage(file)
      if (imagePath) {
        onImageUploaded(imagePath)
        toast.success("Image uploaded successfully")
      } else {
        toast.error("Failed to upload image")
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Failed to upload image")
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Upload Design Image</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload 
          title="Design Image"
          description="Upload an image of your balloon design"
          image={null}
          onImageUpload={handleImageUpload}
        />
      </CardContent>
    </Card>
  )
}