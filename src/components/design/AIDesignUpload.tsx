import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "./ImageUpload"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "sonner"
import { analyzeImageColors, uploadDesignImage } from "@/utils/imageAnalysis"

interface AIAnalysisData {
  clusters: number
  colors: string[]
  sizes: Array<{
    size: string
    quantity: number
  }>
}

interface AIDesignUploadProps {
  onAnalysisComplete: (data: AIAnalysisData) => void
  onImageUploaded: (imagePath: string) => void
}

export const AIDesignUpload = ({ onAnalysisComplete, onImageUploaded }: AIDesignUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null)
  const [designImage, setDesignImage] = useState<string | null>(null)

  const handleImageUpload = async (file: File) => {
    try {
      setIsAnalyzing(true)
      
      // First upload the image
      const imagePath = await uploadDesignImage(file)
      if (!imagePath) {
        toast.error("Failed to upload image")
        return
      }

      setDesignImage(imagePath)
      onImageUploaded(imagePath)

      // Then analyze the colors
      const detectedColors = await analyzeImageColors(imagePath)
      
      // Create analysis data
      const newAnalysisData: AIAnalysisData = {
        clusters: Math.floor(Math.random() * 20) + 10, // Placeholder for demo
        colors: detectedColors,
        sizes: [
          { size: "11in", quantity: Math.floor(Math.random() * 50) + 20 },
          { size: "16in", quantity: Math.floor(Math.random() * 30) + 10 }
        ]
      }

      setAnalysisData(newAnalysisData)
      onAnalysisComplete(newAnalysisData)
      toast.success("Design analysis completed")
    } catch (error) {
      console.error("Error in image upload and analysis:", error)
      toast.error("Failed to analyze design")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Design Upload & Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <ImageUpload
          title="Design Image"
          description="Upload your balloon design image for AI analysis"
          image={designImage}
          onImageUpload={handleImageUpload}
        />

        {isAnalyzing && (
          <div className="text-center text-sm text-muted-foreground">
            Analyzing design...
          </div>
        )}

        {analysisData && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Detected Clusters</h4>
                <p className="text-2xl font-bold">{analysisData.clusters}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Detected Colors</h4>
                <div className="flex gap-2">
                  {analysisData.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium mb-2">Balloon Sizes</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analysisData.sizes.map((size, index) => (
                    <TableRow key={index}>
                      <TableCell>{size.size}</TableCell>
                      <TableCell className="text-right">{size.quantity}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}