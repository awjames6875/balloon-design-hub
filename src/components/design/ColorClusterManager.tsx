import { useState } from "react"
import { toast } from "sonner"
import type { CorrectionProps } from "./BalloonGeni/types"

export interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

interface ColorClusterManagerProps {
  colorClusters: ColorCluster[]
  onClustersUpdate: (clusters: ColorCluster[]) => void
  onTotalClustersUpdate: (total: number) => void
}

export const useColorClusterManager = ({
  colorClusters,
  onClustersUpdate,
  onTotalClustersUpdate
}: ColorClusterManagerProps) => {
  const handleGeniUpdate = async (correction: CorrectionProps) => {
    try {
      if (correction.type === 'cluster_count') {
        console.log("Checking color clusters:", colorClusters)
        console.log("Looking for color:", correction.color)
        
        // Improved color matching logic
        const matchingCluster = colorClusters.find(cluster => {
          const clusterColor = cluster.color.toLowerCase()
          const correctionColor = correction.color.toLowerCase()
          
          // Check for exact match
          if (clusterColor === correctionColor) return true
          
          // Check if the cluster color contains the correction color or vice versa
          if (clusterColor.includes(correctionColor) || correctionColor.includes(clusterColor)) return true
          
          // Check for common color variations
          if (clusterColor.includes('orange') && correctionColor.includes('orange')) return true
          if (clusterColor.includes('blue') && correctionColor.includes('blue')) return true
          if (clusterColor.includes('red') && correctionColor.includes('red')) return true
          // Add more color variations as needed
          
          return false
        })

        console.log("Found matching cluster:", matchingCluster)

        if (!matchingCluster) {
          toast.error(`Color ${correction.color} not found in current design. Available colors: ${colorClusters.map(c => c.color).join(', ')}`)
          return
        }

        const updatedClusters = colorClusters.map(cluster => {
          if (cluster.color === matchingCluster.color) {
            return {
              ...cluster,
              baseClusters: Math.ceil(correction.clusterCount! * 0.7),
              extraClusters: Math.floor(correction.clusterCount! * 0.3)
            }
          }
          return cluster
        })

        console.log("Updated clusters:", updatedClusters)
        onClustersUpdate(updatedClusters)
        
        // Recalculate totals
        const totalClustersCount = updatedClusters.reduce(
          (sum, cluster) => sum + cluster.baseClusters + cluster.extraClusters, 
          0
        )
        onTotalClustersUpdate(totalClustersCount)

        toast.success(`Updated clusters for ${matchingCluster.color}`)
      }
    } catch (error) {
      console.error("Error updating design:", error)
      toast.error("Failed to update design")
    }
  }

  return { handleGeniUpdate }
}