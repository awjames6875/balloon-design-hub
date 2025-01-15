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
      console.log("Starting Geni update with correction:", correction)
      
      if (correction.type === 'cluster_count') {
        console.log("Processing cluster count update")
        const matchingCluster = colorClusters.find(cluster => {
          const clusterColor = cluster.color.toLowerCase()
          const correctionColor = correction.color.toLowerCase()
          return clusterColor === correctionColor || 
                 clusterColor.includes(correctionColor) || 
                 correctionColor.includes(clusterColor)
        })

        if (!matchingCluster) {
          console.error("No matching cluster found for color:", correction.color)
          toast.error(`Color ${correction.color} not found in current design`)
          return
        }

        const updatedClusters = colorClusters.map(cluster => {
          if (cluster.color === matchingCluster.color) {
            const totalClusters = correction.clusterCount!
            return {
              ...cluster,
              baseClusters: Math.ceil(totalClusters * 0.7),
              extraClusters: Math.floor(totalClusters * 0.3)
            }
          }
          return cluster
        })

        console.log("Updated clusters:", updatedClusters)
        onClustersUpdate(updatedClusters)
        
        const totalClustersCount = updatedClusters.reduce(
          (sum, cluster) => sum + cluster.baseClusters + cluster.extraClusters, 
          0
        )
        onTotalClustersUpdate(totalClustersCount)
        toast.success(`Updated clusters for ${matchingCluster.color}`)

      } else if (correction.type === 'total_clusters') {
        console.log("Processing total clusters update to:", correction.clusterCount)
        const totalClusters = correction.clusterCount!
        const clustersPerColor = Math.floor(totalClusters / colorClusters.length)
        const remainingClusters = totalClusters % colorClusters.length

        const updatedClusters = colorClusters.map((cluster, index) => {
          const clusterTotal = clustersPerColor + (index < remainingClusters ? 1 : 0)
          return {
            ...cluster,
            baseClusters: Math.ceil(clusterTotal * 0.7),
            extraClusters: Math.floor(clusterTotal * 0.3)
          }
        })

        console.log("Distributing total clusters:", totalClusters, "Updated clusters:", updatedClusters)
        onClustersUpdate(updatedClusters)
        onTotalClustersUpdate(totalClusters)
        toast.success(`Updated total clusters to ${totalClusters}`)
      }
    } catch (error) {
      console.error("Error in handleGeniUpdate:", error)
      toast.error("Failed to update design")
    }
  }

  return { handleGeniUpdate }
}