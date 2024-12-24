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

  console.log("Generating color pattern for colors:", colors, "total clusters:", totalClusters)

  // Calculate base clusters per color (rounded down)
  const basePerColor = Math.floor(totalClusters / colors.length)
  
  // Calculate remaining clusters to distribute
  const remainingClusters = totalClusters % colors.length

  // Create color clusters with proper distribution
  const colorClusters: ColorCluster[] = colors.map((color, index) => {
    // Add one extra cluster to some colors if there are remaining clusters
    const extraFromRemainder = index < remainingClusters ? 1 : 0
    const totalForColor = basePerColor + extraFromRemainder

    // Split between base and extra clusters (70/30 split)
    const baseClusters = Math.ceil(totalForColor * 0.7)
    const extraClusters = totalForColor - baseClusters

    return {
      color,
      baseClusters,
      extraClusters
    }
  })

  console.log("Generated color clusters:", colorClusters)
  return colorClusters
}