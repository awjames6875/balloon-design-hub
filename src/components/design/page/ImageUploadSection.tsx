import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/design/ImageUpload"

interface ImageUploadSectionProps {
  onImageUploaded: (imagePath: string) => void
}

export const ImageUploadSection = ({ onImageUploaded }: ImageUploadSectionProps) => {
  const handleImageUpload = async (file: File) => {
    // Handle the file upload and get the image path
    // Then call onImageUploaded with the path
    // This is just a placeholder - implement your actual upload logic
    const imagePath = URL.createObjectURL(file)
    onImageUploaded(imagePath)
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