import { ColorCluster, Calculations } from "@/components/design/inventory/types"

export const calculateBalloonsPerColor = (
  colorClusters: ColorCluster[],
  calculations?: Calculations
) => {
  if (!calculations) {
    console.error("No calculations provided for balloon calculation")
    return []
  }

  console.log("Calculating balloons per color with clusters:", colorClusters)
  
  // Calculate balloons needed for each color
  return colorClusters.map(cluster => {
    const totalClusters = cluster.baseClusters + cluster.extraClusters
    const balloons11 = Math.round(totalClusters * 11) // Each cluster uses 11 11-inch balloons
    const balloons16 = Math.round(totalClusters * 2)  // Each cluster uses 2 16-inch balloons

    console.log(`Color ${cluster.color}: ${balloons11} 11" balloons and ${balloons16} 16" balloons`)

    return {
      color: cluster.color,
      balloons11,
      balloons16,
      totalClusters
    }
  })
}