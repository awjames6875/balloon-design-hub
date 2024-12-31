import { ImageIcon, Upload } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

interface ImageUploadProps {
  title: string
  description: string
  image: string | null
  onImageUpload: (file: File) => void
}

export const ImageUpload = ({
  title,
  description,
  image,
  onImageUpload,
}: ImageUploadProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(image)

  // Update preview when image prop changes
  useEffect(() => {
    setPreviewUrl(image)
  }, [image])

  const handleClick = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/*"
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        // Create a preview URL for immediate display
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)
        onImageUpload(file)
      }
    }
    input.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={handleClick}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={title}
              className="max-h-64 mx-auto rounded-lg object-contain"
            />
          ) : (
            <div className="space-y-2">
              {title.toLowerCase().includes("client") ? (
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              ) : (
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
              )}
              <p className="text-sm text-gray-500">Click to upload {title.toLowerCase()}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}