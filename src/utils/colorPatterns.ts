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

  // Ensure even distribution of clusters among colors
  const basePerColor = Math.floor(totalClusters / colors.length)
  const remainder = totalClusters % colors.length

  // Create color clusters with proper distribution
  const colorClusters: ColorCluster[] = colors.map((color, index) => {
    // Distribute remaining clusters evenly
    const extraFromRemainder = index < remainder ? 1 : 0
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