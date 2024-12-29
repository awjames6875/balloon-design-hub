import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "./ImageUpload"
import { toast } from "sonner"
import { analyzeImageColors, uploadDesignImage } from "@/utils/imageAnalysis"
import { AnalysisResults } from "./analysis/AnalysisResults"
import { ClusterAnalysis } from "./analysis/ClusterAnalysis"
import { supabase } from "@/integrations/supabase/client"

interface AIAnalysisData {
  clusters: number
  colors: string[]
  sizes: Array<{
    size: string
    quantity: number
  }>
}

interface ColorKey {
  [key: string]: string
}

interface Cluster {
  number: number
  definedColor: string
  count: number
}

interface NumberedAnalysis {
  colorKey: ColorKey
  clusters: Cluster[]
}

interface AIDesignUploadProps {
  onAnalysisComplete: (data: AIAnalysisData) => void
  onImageUploaded: (imagePath: string) => void
}

export const AIDesignUpload = ({ onAnalysisComplete, onImageUploaded }: AIDesignUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null)
  const [numberedAnalysis, setNumberedAnalysis] = useState<NumberedAnalysis | null>(null)
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

      // Analyze the colors
      const detectedColors = await analyzeImageColors(imagePath)
      
      // Analyze numbered clusters using the edge function
      const { data: numberedDesignAnalysis, error } = await supabase.functions.invoke('analyze-design', {
        body: { imageUrl: imagePath }
      })

      if (error) {
        console.error('Error analyzing numbered design:', error)
        toast.error('Failed to analyze numbered design')
      } else {
        console.log('Numbered design analysis results:', numberedDesignAnalysis)
        setNumberedAnalysis(numberedDesignAnalysis)
      }
      
      // Create analysis data
      const newAnalysisData: AIAnalysisData = {
        clusters: numberedDesignAnalysis?.clusters?.length || 0,
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

        {numberedAnalysis && (
          <ClusterAnalysis 
            colorKey={numberedAnalysis.colorKey} 
            clusters={numberedAnalysis.clusters} 
          />
        )}

        {analysisData && <AnalysisResults data={analysisData} />}
      </CardContent>
    </Card>
  )
}