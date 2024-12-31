import { BalloonCalculationTable } from "./BalloonCalculationTable"
import { BalloonSummary } from "./BalloonSummary"

interface AnalysisData {
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

interface AnalysisResultsProps {
  data: AnalysisData | null
}

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  if (!data) {
    return <div>No analysis data available</div>
  }

  // Constants for balloons per cluster
  const BALLOONS_11_PER_CLUSTER = 11
  const BALLOONS_16_PER_CLUSTER = 2

  // Use the numbered analysis data to get accurate cluster counts per color
  const balloonsPerColor = (data.colors || []).map(color => {
    // Find the cluster data for this color from the numbered analysis
    const clusterData = data.numberedAnalysis?.clusters.find(
      cluster => cluster.definedColor === color
    )
    
    return {
      color,
      balloons11: BALLOONS_11_PER_CLUSTER,
      balloons16: BALLOONS_16_PER_CLUSTER,
      clustersCount: clusterData?.count || 0
    }
  })

  // Calculate totals based on the actual cluster count
  const totalClusters = balloonsPerColor.reduce((sum, color) => 
    sum + color.clustersCount, 0
  )
  const totalBalloons11 = totalClusters * BALLOONS_11_PER_CLUSTER
  const totalBalloons16 = totalClusters * BALLOONS_16_PER_CLUSTER

  return (
    <div className="space-y-4">
      <BalloonCalculationTable
        balloonsPerColor={balloonsPerColor}
        totalClusters={totalClusters}
        BALLOONS_11_PER_CLUSTER={BALLOONS_11_PER_CLUSTER}
        BALLOONS_16_PER_CLUSTER={BALLOONS_16_PER_CLUSTER}
        totalBalloons11={totalBalloons11}
        totalBalloons16={totalBalloons16}
      />
      <BalloonSummary
        totalBalloons11={totalBalloons11}
        totalBalloons16={totalBalloons16}
      />
    </div>
  )
}