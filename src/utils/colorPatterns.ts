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

  // Validate total clusters match
  const totalCalculated = colorClusters.reduce(
    (sum, cluster) => sum + cluster.baseClusters + cluster.extraClusters,
    0
  )

  // Adjust if there's any discrepancy
  if (totalCalculated !== totalClusters && colorClusters.length > 0) {
    const diff = totalClusters - totalCalculated
    if (diff > 0) {
      colorClusters[0].extraClusters += diff
    } else {
      // Remove from extra clusters first, then base if necessary
      let remaining = -diff
      for (let i = 0; i < colorClusters.length && remaining > 0; i++) {
        if (colorClusters[i].extraClusters > 0) {
          const toRemove = Math.min(colorClusters[i].extraClusters, remaining)
          colorClusters[i].extraClusters -= toRemove
          remaining -= toRemove
        }
      }
    }
  }

  return colorClusters
}

export const getColorName = (hexColor: string): string => {
  const colorMap: { [key: string]: string } = {
    '#FFFFFF': 'White',
    '#000000': 'Black',
    '#FF0000': 'Red',
    '#FFA500': 'Orange',
    '#FFFF00': 'Yellow',
    '#008000': 'Green',
    '#0000FF': 'Blue',
    '#800080': 'Purple',
    '#FFC0CB': 'Pink',
    '#C0C0C0': 'Silver',
    '#FFD700': 'Gold'
  }

  return colorMap[hexColor.toUpperCase()] || hexColor
}