
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DesignControls } from "./analysis/DesignControls"
import { DesignImageSection } from "./analysis/DesignImageSection"
import { DesignAnalysisSection } from "./analysis/DesignAnalysisSection"
import { useDesignAnalysis } from "@/hooks/useDesignAnalysis"
import type { AIAnalysisData } from "@/utils/designCalculations"

interface AIDesignUploadProps {
  onAnalysisComplete: (data: AIAnalysisData) => void
  onImageUploaded: (imagePath: string) => void
}

export const AIDesignUpload = ({ onAnalysisComplete, onImageUploaded }: AIDesignUploadProps) => {
  const {
    isAnalyzing,
    analysisData,
    designImage,
    handleImageUpload,
    handleDesignAssistantUpdate,
    handleRefresh
  } = useDesignAnalysis({
    onAnalysisComplete,
    onImageUploaded
  })

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
        <DesignImageSection
          isAnalyzing={isAnalyzing}
          designImage={designImage}
          onImageUpload={handleImageUpload}
        />

        {analysisData && (
          <DesignAnalysisSection 
            analysisData={analysisData}
            onDesignAssistantUpdate={handleDesignAssistantUpdate}
          />
        )}
      </CardContent>
    </Card>
  )
}
