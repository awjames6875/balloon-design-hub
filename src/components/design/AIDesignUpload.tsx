import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "./ImageUpload"
import { toast } from "sonner"
import { uploadDesignImage } from "@/utils/imageAnalysis"
import { AnalysisResults } from "./analysis/AnalysisResults"
import { supabase } from "@/integrations/supabase/client"
import { DesignControls } from "./analysis/DesignControls"
import { recalculateDesignValues, type AIAnalysisData } from "@/utils/designCalculations"
import { saveDesignAnalysis, updateDesignAnalysis } from "@/services/designAnalysisService"
import { DesignAssistant } from "./DesignAssistant/DesignAssistant"
import type { CorrectionProps } from "./BalloonGeni/types"

interface AIDesignUploadProps {
  onAnalysisComplete: (data: AIAnalysisData) => void
  onImageUploaded: (imagePath: string) => void
}

export const AIDesignUpload = ({ onAnalysisComplete, onImageUploaded }: AIDesignUploadProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null)
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [currentDesignId, setCurrentDesignId] = useState<number | null>(null)

  const handleImageUpload = async (file: File) => {
    try {
      setIsAnalyzing(true)
      
      const imagePath = await uploadDesignImage(file)
      if (!imagePath) {
        toast.error("Failed to upload image")
        return
      }

      setDesignImage(imagePath)
      onImageUploaded(imagePath)

      const { data: numberedDesignAnalysis, error } = await supabase.functions.invoke('analyze-design', {
        body: { imageUrl: imagePath }
      })

      if (error) {
        console.error('Error analyzing numbered design:', error)
        toast.error('Failed to analyze numbered design')
        return
      }

      const totalClusters = numberedDesignAnalysis?.clusters?.reduce(
        (sum: number, cluster: any) => sum + cluster.count, 
        0
      ) || 0
      const colorsFromKey = Object.values(numberedDesignAnalysis?.colorKey || {}) as string[]
      
      const analysisData = recalculateDesignValues(totalClusters, colorsFromKey)
      const savedAnalysis = await saveDesignAnalysis(
        totalClusters,
        colorsFromKey,
        analysisData.sizes
      )

      if (savedAnalysis) {
        setCurrentDesignId(savedAnalysis.id)
        setAnalysisData(analysisData)
        onAnalysisComplete(analysisData)
      }
      
      toast.success("Design analysis completed")
    } catch (error) {
      console.error("Error in image upload and analysis:", error)
      toast.error("Failed to analyze design")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleDesignAssistantUpdate = async (correction: CorrectionProps) => {
    if (!analysisData?.colors) {
      toast.error('Cannot update design: No color data available')
      return
    }

    try {
      const newAnalysisData = recalculateDesignValues(
        correction.type === 'total_clusters' ? correction.clusterCount! : analysisData.clusters,
        analysisData.colors
      )
      
      if (currentDesignId) {
        const success = await updateDesignAnalysis(
          currentDesignId,
          newAnalysisData.clusters,
          newAnalysisData.sizes
        )

        if (success) {
          setAnalysisData(newAnalysisData)
          onAnalysisComplete(newAnalysisData)
          toast.success('Design analysis updated successfully')
        }
      }
    } catch (error) {
      console.error('Error updating analysis:', error)
      toast.error('Failed to update analysis')
    }
  }

  const handleRefresh = () => {
    setAnalysisData(null)
    setDesignImage(null)
    setCurrentDesignId(null)
    onImageUploaded("")
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Design Upload & Analysis</CardTitle>
        <DesignControls 
          hasDesign={!!(designImage || analysisData)}
          onRefresh={handleRefresh}
        />
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
          <>
            <AnalysisResults 
              data={analysisData}
            />
            <DesignAssistant 
              onUpdate={handleDesignAssistantUpdate}
              colorClusters={analysisData.numberedAnalysis?.clusters.map(c => ({
                color: c.definedColor,
                baseClusters: Math.ceil(c.count * 0.7),
                extraClusters: Math.floor(c.count * 0.3)
              }))}
            />
          </>
        )}
      </CardContent>
    </Card>
  )
}
