import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "@/components/design/ImageUpload"

interface ImageUploadSectionProps {
  onImageUploaded: (imagePath: string) => void
}

export const ImageUploadSection = ({ onImageUploaded }: ImageUploadSectionProps) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Upload Design Image</CardTitle>
      </CardHeader>
      <CardContent>
        <ImageUpload onImageUploaded={onImageUploaded} />
      </CardContent>
    </Card>
  )
}