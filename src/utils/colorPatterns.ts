interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

export const generateColorPattern = (
  colors: string[],
  totalClusters: number
): ColorCluster[] => {
  if (colors.length === 0) return []

  // Calculate base distribution
  const basePerColor = Math.floor(totalClusters / colors.length)
  const remainder = totalClusters % colors.length

  // Create initial distribution
  const colorClusters: ColorCluster[] = colors.map((color, index) => {
    const extra = index < remainder ? 1 : 0
    const total = basePerColor + extra
    
    return {
      color,
      baseClusters: Math.ceil(total * 0.7), // 70% base clusters
      extraClusters: Math.floor(total * 0.3), // 30% extra clusters
    }
  })

  return colorClusters
}