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
  const [currentDesignId, setCurrentDesignId] = useState<number | null>(null)

  const recalculateValues = (totalClusters: number, colors: string[]) => {
    const clustersPerColor = Math.floor(totalClusters / colors.length)
    const remainingClusters = totalClusters % colors.length

    return {
      clusters: totalClusters,
      colors: colors,
      sizes: [
        { size: "11in", quantity: totalClusters * 11 },
        { size: "16in", quantity: totalClusters * 2 }
      ],
      numberedAnalysis: {
        colorKey: Object.fromEntries(colors.map((color, i) => [i + 1, color])),
        clusters: colors.map((color, index) => ({
          number: index + 1,
          definedColor: color,
          count: clustersPerColor + (index < remainingClusters ? 1 : 0)
        }))
      }
    }
  }

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

      console.log("Calling analyze-design edge function...")
      const { data: numberedDesignAnalysis, error } = await supabase.functions.invoke('analyze-design', {
        body: { imageUrl: imagePath }
      })

      if (error) {
        console.error('Error analyzing numbered design:', error)
        toast.error('Failed to analyze numbered design')
      } else {
        console.log('Numbered design analysis results:', numberedDesignAnalysis)
        await saveAnalysisToDatabase(numberedDesignAnalysis)
      }
      
      toast.success("Design analysis completed")
    } catch (error) {
      console.error("Error in image upload and analysis:", error)
      toast.error("Failed to analyze design")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const saveAnalysisToDatabase = async (numberedDesignAnalysis: any) => {
    try {
      const totalClusters = numberedDesignAnalysis?.clusters?.reduce((sum: number, cluster: any) => sum + cluster.count, 0) || 0
      const colorsFromKey = Object.values(numberedDesignAnalysis?.colorKey || {}) as string[]
      
      const analysisData = recalculateValues(totalClusters, colorsFromKey)

      const { data: savedAnalysis, error } = await supabase
        .from('design_analysis')
        .insert([{
          clusters: totalClusters,
          colors: colorsFromKey,
          sizes: analysisData.sizes,
          total_balloons: totalClusters * 13
        }])
        .select()
        .single()

      if (error) {
        console.error('Error saving analysis to database:', error)
        toast.error('Failed to save analysis')
        return
      }

      console.log('Analysis saved to database:', savedAnalysis)
      setCurrentDesignId(savedAnalysis.id)
      setAnalysisData(analysisData)
      onAnalysisComplete(analysisData)
    } catch (error) {
      console.error('Error in saveAnalysisToDatabase:', error)
      toast.error('Failed to save analysis data')
    }
  }

  const handleDesignAssistantUpdate = async (updatedClusters: number) => {
    console.log('Handling design assistant update with clusters:', updatedClusters)
    
    if (analysisData?.colors) {
      try {
        // Recalculate all values based on the new total clusters
        const newAnalysisData = recalculateValues(updatedClusters, analysisData.colors)
        
        // Update database
        if (currentDesignId) {
          const { error } = await supabase
            .from('design_analysis')
            .update({
              clusters: updatedClusters,
              sizes: newAnalysisData.sizes,
              total_balloons: updatedClusters * 13
            })
            .eq('id', currentDesignId)

          if (error) {
            console.error('Error updating analysis in database:', error)
            toast.error('Failed to update analysis')
            return
          }
        }

        setAnalysisData(newAnalysisData)
        onAnalysisComplete(newAnalysisData)
        console.log('Analysis updated successfully:', newAnalysisData)
        toast.success('Design analysis updated successfully')
      } catch (error) {
        console.error('Error updating analysis:', error)
        toast.error('Failed to update analysis')
      }
    } else {
      console.error('No color data available')
      toast.error('Cannot update design: No color data available')
    }
  }

  const handleRefresh = () => {
    setAnalysisData(null)
    setDesignImage(null)
    setCurrentDesignId(null)
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