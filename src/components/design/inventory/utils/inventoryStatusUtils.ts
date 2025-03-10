
import { ColorCluster } from "../types"

export const getInventoryStatus = (available: number, required: number): 'in-stock' | 'low' | 'out-of-stock' => {
  console.log(`Checking status for available: ${available}, required: ${required}`)
  if (available === 0) return 'out-of-stock'
  if (available < required) return 'out-of-stock'
  if (available >= required * 1.2) return 'in-stock'
  return 'low'
}

export const calculateBalloonsPerColor = (colorClusters: ColorCluster[]) => {
  console.log("Calculating balloons per color for clusters:", colorClusters)
  return colorClusters.map(cluster => {
    const totalClusters = cluster.baseClusters + cluster.extraClusters
    return {
      color: cluster.color,
      balloons11: totalClusters * 11,
      balloons16: totalClusters * 2
    }
  })
}
