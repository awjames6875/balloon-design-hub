
import { ColorCluster, Calculations } from "@/components/design/inventory/types"

export const calculateBalloonsPerColor = (
  colorClusters: ColorCluster[],
  calculations?: Calculations
) => {
  console.log("Calculating balloons per color with clusters:", colorClusters)
  
  // Calculate balloons needed for each color
  return colorClusters.map(cluster => {
    const totalClusters = cluster.baseClusters + cluster.extraClusters
    
    // Each cluster has exactly 11 11-inch balloons and 2 16-inch balloons
    const balloons11 = totalClusters * 11
    const balloons16 = totalClusters * 2

    console.log(`Color ${cluster.color}: ${totalClusters} clusters, ${balloons11} 11" balloons and ${balloons16} 16" balloons`)

    return {
      color: cluster.color,
      balloons11,
      balloons16,
      totalClusters
    }
  })
}
