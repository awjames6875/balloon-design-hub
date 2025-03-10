
import { ColorCluster } from "../types"
import { ColorBalloonData } from "@/services/inventory/types"

// Function to determine the inventory status based on available and required quantities
export const getInventoryStatus = (available: number, required: number): 'in-stock' | 'low' | 'out-of-stock' => {
  if (available >= required) {
    // If we have at least 20% more than needed, it's comfortably in stock
    if (available >= required * 1.2) {
      return 'in-stock'
    }
    // If we have just enough or a bit more, it's considered low
    return 'low'
  }
  // If we don't have enough, it's out of stock
  return 'out-of-stock'
}

// Calculate how many balloons of each color and size are needed
export const calculateBalloonsPerColor = (colorClusters: ColorCluster[]): ColorBalloonData[] => {
  const balloonsByColor: ColorBalloonData[] = []
  
  colorClusters.forEach(cluster => {
    // Each cluster has a mix of 11" and 16" balloons
    // The exact ratio depends on the design style, but we use a common approximation here
    const totalClusters = cluster.baseClusters + cluster.extraClusters
    
    // 11" balloons: typically 3-4 per cluster
    const balloons11 = totalClusters * 4  // Simplified calculation
    
    // 16" balloons: typically 1-2 per cluster
    const balloons16 = totalClusters * 2  // Simplified calculation
    
    balloonsByColor.push({
      color: cluster.color,
      balloons11,
      balloons16
    })
  })
  
  return balloonsByColor
}
