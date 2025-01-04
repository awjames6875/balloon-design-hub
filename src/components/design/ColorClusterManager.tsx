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
        // Case-insensitive color matching
        const matchingCluster = colorClusters.find(cluster => 
          cluster.color.toLowerCase().includes(correction.color.toLowerCase()) ||
          correction.color.toLowerCase().includes(cluster.color.toLowerCase())
        )

        if (!matchingCluster) {
          toast.error(`Color ${correction.color} not found in current design`)
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