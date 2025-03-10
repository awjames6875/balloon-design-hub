
import { AnalysisResults } from "./AnalysisResults"
import { DesignAssistant } from "../DesignAssistant/DesignAssistant"
import type { AIAnalysisData } from "@/utils/designCalculations"
import type { CorrectionProps } from "../BalloonGeni/types"
import type { ColorCluster } from "../ColorClusterManager"

interface DesignAnalysisSectionProps {
  analysisData: AIAnalysisData
  onDesignAssistantUpdate: (correction: CorrectionProps) => Promise<void>
}

export const DesignAnalysisSection = ({ 
  analysisData,
  onDesignAssistantUpdate
}: DesignAnalysisSectionProps) => {
  // Map clusters to expected format for DesignAssistant
  const colorClusters: ColorCluster[] = analysisData.numberedAnalysis?.clusters.map(c => ({
    color: c.definedColor,
    baseClusters: Math.ceil(c.count * 0.7),
    extraClusters: Math.floor(c.count * 0.3)
  })) || []

  return (
    <>
      <AnalysisResults 
        data={analysisData}
      />
      <DesignAssistant 
        onUpdate={onDesignAssistantUpdate}
        colorClusters={colorClusters}
      />
    </>
  )
}
