interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

interface BalloonCalculations {
  color: string
  balloons11: number
  balloons16: number
  totalClusters: number
}

export const calculateBalloonsPerColor = (
  colorClusters: ColorCluster[],
  calculations?: {
    baseClusters: number
    extraClusters: number
    totalClusters: number
    littlesQuantity: number
    grapesQuantity: number
    balloons11in: number
    balloons16in: number
    totalBalloons: number
  }
): BalloonCalculations[] => {
  if (!calculations) return []
  
  const balloonsPerCluster = {
    '11inch': 11,
    '16inch': 2
  }

  return colorClusters.map(cluster => ({
    color: cluster.color,
    balloons11: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['11inch']),
    balloons16: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['16inch']),
    totalClusters: cluster.baseClusters + cluster.extraClusters
  }))
}