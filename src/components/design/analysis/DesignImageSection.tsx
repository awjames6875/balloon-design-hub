
import { ImageUpload } from "../ImageUpload"

interface DesignImageSectionProps {
  isAnalyzing: boolean
  designImage: string | null
  onImageUpload: (file: File) => void
}

export const DesignImageSection = ({
  isAnalyzing,
  designImage,
  onImageUpload
}: DesignImageSectionProps) => {
  return (
    <>
      <ImageUpload
        title="Design Image"
        description="Upload your balloon design image for AI analysis"
        image={designImage}
        onImageUpload={onImageUpload}
      />

      {isAnalyzing && (
        <div className="text-center text-sm text-muted-foreground">
          Analyzing design...
        </div>
      )}
    </>
  )
}
