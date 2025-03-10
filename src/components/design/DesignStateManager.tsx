import { useState, useEffect } from "react"
import type { AIAnalysisData } from "@/utils/designCalculations"

interface ColorDistribution {
  [color: string]: {
    clusters: number
    balloons11: number
    balloons16: number
  }
}

interface DesignData {
  totalClusters: number
  colorDistribution: ColorDistribution
  totalBalloons: {
    '11inch': number
    '16inch': number
  }
}

interface DesignStateManagerProps {
  analysisData?: AIAnalysisData | null
}

export const DesignStateManager = ({ analysisData }: DesignStateManagerProps) => {
  const [designData, setDesignData] = useState<DesignData>({
    totalClusters: 12,
    colorDistribution: {
      'Wild Berry': { clusters: 3, balloons11: 33, balloons16: 6 },
      'Golden Rod': { clusters: 3, balloons11: 33, balloons16: 6 },
      'Teal': { clusters: 3, balloons11: 33, balloons16: 6 },
      'Orange': { clusters: 3, balloons11: 33, balloons16: 6 }
    },
    totalBalloons: {
      '11inch': 132,
      '16inch': 24
    }
  })

  // Update design data when analysis data changes
  useEffect(() => {
    if (analysisData) {
      console.log("DesignStateManager received updated analysis data:", analysisData)
      const balloons11 = analysisData.sizes.find(size => size.size === "11in")?.quantity || 0
      const balloons16 = analysisData.sizes.find(size => size.size === "16in")?.quantity || 0
      
      const colorDistribution: ColorDistribution = {}
      
      // Create distribution from numbered analysis if available
      if (analysisData.numberedAnalysis) {
        analysisData.numberedAnalysis.clusters.forEach(cluster => {
          colorDistribution[cluster.definedColor] = {
            clusters: cluster.count,
            balloons11: cluster.count * 11,
            balloons16: cluster.count * 2
          }
        })
      } else {
        // Fallback to distributing evenly
        const clustersPerColor = Math.floor(analysisData.clusters / analysisData.colors.length)
        const remainingClusters = analysisData.clusters % analysisData.colors.length
        
        analysisData.colors.forEach((color, index) => {
          const colorClusters = clustersPerColor + (index < remainingClusters ? 1 : 0)
          colorDistribution[color] = {
            clusters: colorClusters,
            balloons11: colorClusters * 11,
            balloons16: colorClusters * 2
          }
        })
      }
      
      const newDesignData = {
        totalClusters: analysisData.clusters,
        colorDistribution,
        totalBalloons: {
          '11inch': balloons11,
          '16inch': balloons16
        }
      }
      
      console.log("Updated designData:", newDesignData)
      setDesignData(newDesignData)
    }
  }, [analysisData])

  if (!analysisData) return null

  // No rendering anymore, this is just a data processor component
  return null
}
