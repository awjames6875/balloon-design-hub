export interface AIAnalysisData {
  clusters: number
  colors: string[]
  sizes: Array<{
    size: string
    quantity: number
  }>
  numberedAnalysis?: {
    colorKey: { [key: string]: string }
    clusters: Array<{
      number: number
      definedColor: string
      count: number
    }>
  }
}

export const recalculateDesignValues = (
  totalClusters: number, 
  colors: string[]
): AIAnalysisData => {
  const clustersPerColor = Math.floor(totalClusters / colors.length)
  const remainingClusters = totalClusters % colors.length

  return {
    clusters: totalClusters,
    colors: colors,
    sizes: [
      { size: "11in", quantity: totalClusters * 11 },
      { size: "16in", quantity: totalClusters * 2 }
    ],
    numberedAnalysis: {
      colorKey: Object.fromEntries(colors.map((color, i) => [i + 1, color])),
      clusters: colors.map((color, index) => ({
        number: index + 1,
        definedColor: color,
        count: clustersPerColor + (index < remainingClusters ? 1 : 0)
      }))
    }
  }
}