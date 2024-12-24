interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

const isSimilarColor = (color1: string, color2: string): boolean => {
  // Simple check for similar colors based on hex values
  // This can be expanded to include more sophisticated color similarity checks
  const similar = [
    ['#FF0000', '#FFA500'], // Red and Orange
    ['#FFA500', '#FFFF00'], // Orange and Yellow
    ['#0000FF', '#800080'], // Blue and Purple
    ['#FFC0CB', '#FF0000'], // Pink and Red
  ]

  return similar.some(pair => 
    (pair.includes(color1.toUpperCase()) && pair.includes(color2.toUpperCase()))
  )
}

export const generateColorPattern = (colors: string[], totalClusters: number): ColorCluster[] => {
  if (colors.length === 0) return []

  // Calculate base distribution
  const clustersPerColor = Math.floor(totalClusters / colors.length)
  const remainingClusters = totalClusters % colors.length

  // Initialize pattern with even distribution
  let pattern: string[] = []
  colors.forEach(color => {
    for (let i = 0; i < clustersPerColor; i++) {
      pattern.push(color)
    }
  })

  // Distribute remaining clusters
  for (let i = 0; i < remainingClusters; i++) {
    pattern.push(colors[i])
  }

  // Adjust pattern to avoid similar adjacent colors
  for (let i = 1; i < pattern.length; i++) {
    if (isSimilarColor(pattern[i], pattern[i - 1])) {
      // Try to swap with next non-similar color
      for (let j = i + 1; j < pattern.length; j++) {
        if (!isSimilarColor(pattern[j], pattern[i - 1])) {
          // Swap colors
          [pattern[i], pattern[j]] = [pattern[j], pattern[i]]
          break
        }
      }
    }
  }

  // Calculate clusters per color
  const colorCounts = colors.reduce((acc, color) => {
    const count = pattern.filter(c => c === color).length
    const baseClusters = Math.floor(count * 0.7) // 70% base clusters
    const extraClusters = count - baseClusters // remaining as extra clusters
    
    acc.push({
      color,
      baseClusters,
      extraClusters
    })
    return acc
  }, [] as ColorCluster[])

  return colorCounts
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