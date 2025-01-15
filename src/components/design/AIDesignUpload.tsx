import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "./ImageUpload"
import { toast } from "sonner"
import { uploadDesignImage } from "@/utils/imageAnalysis"
import { AnalysisResults } from "./analysis/AnalysisResults"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface AIAnalysisData {
  clusters: number
  colors: string[]
  sizes: Array<{
    size: string
    quantity: number
  }>
  numberedAnalysis?: {
    colorKey: { [key: string]: string }
    clusters: Array<{
      number: number
      definedColor: string
      count: number
    }>
  }
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
      console.log("Starting image upload process...")
      setIsAnalyzing(true)
      
      const imagePath = await uploadDesignImage(file)
      if (!imagePath) {
        console.error("Failed to get image path from uploadDesignImage")
        toast.error("Failed to upload image")
        return
      }

      console.log("Image uploaded successfully, path:", imagePath)
      setDesignImage(imagePath)
      onImageUploaded(imagePath)

      console.log("Testing Supabase connection...")
      const { data: testData, error: testError } = await supabase
        .from('balloon_styles')
        .select('*')
        .limit(1)

      if (testError) {
        console.error("Supabase connection test failed:", testError)
        toast.error("Failed to connect to Supabase")
        return
      }

      console.log("Supabase connection test successful:", testData)

      console.log("Calling analyze-design edge function...")
      const { data: numberedDesignAnalysis, error } = await supabase.functions.invoke('analyze-design', {
        body: { imageUrl: imagePath }
      })

      if (error) {
        console.error('Error analyzing numbered design:', error)
        toast.error('Failed to analyze numbered design')
      } else {
        console.log('Numbered design analysis results:', numberedDesignAnalysis)
        updateAnalysisData(numberedDesignAnalysis)
      }
      
      toast.success("Design analysis completed")
    } catch (error) {
      console.error("Error in image upload and analysis:", error)
      toast.error("Failed to analyze design")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // New function to update analysis data
  const updateAnalysisData = (numberedDesignAnalysis: any) => {
    const totalClusters = numberedDesignAnalysis?.clusters?.reduce((sum: number, cluster: any) => sum + cluster.count, 0) || 0
    const colorsFromKey = Object.values(numberedDesignAnalysis?.colorKey || {}) as string[]
    
    const newAnalysisData: AIAnalysisData = {
      clusters: totalClusters,
      colors: colorsFromKey,
      sizes: [
        { size: "11in", quantity: Math.floor(totalClusters * 11) }, // Each cluster uses 11 11-inch balloons
        { size: "16in", quantity: Math.floor(totalClusters * 2) }   // Each cluster uses 2 16-inch balloons
      ],
      numberedAnalysis: numberedDesignAnalysis
    }

    setAnalysisData(newAnalysisData)
    onAnalysisComplete(newAnalysisData)
  }

  // New function to handle design assistant updates
  const handleDesignAssistantUpdate = (updatedClusters: number) => {
    if (analysisData && analysisData.numberedAnalysis) {
      const updatedAnalysis = {
        ...analysisData.numberedAnalysis,
        clusters: analysisData.numberedAnalysis.clusters.map(cluster => ({
          ...cluster,
          count: Math.floor(updatedClusters / analysisData.numberedAnalysis!.clusters.length)
        }))
      }
      updateAnalysisData(updatedAnalysis)
    }
  }

  const handleRefresh = () => {
    setAnalysisData(null)
    setDesignImage(null)
    onImageUploaded("")
    toast.success("Analysis data cleared. You can now upload a new design.")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Design Upload & Analysis</CardTitle>
        {(designImage || analysisData) && (
          <Button 
            variant="outline" 
            size="icon"
            onClick={handleRefresh}
            className="h-8 w-8"
            title="Start Over"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        )}
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
          <AnalysisResults 
            data={analysisData} 
            onDesignAssistantUpdate={handleDesignAssistantUpdate}
          />
        )}
      </CardContent>
    </Card>
  )
}