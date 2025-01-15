import { BalloonCalculationTable } from "../production/BalloonCalculationTable"
import { BalloonSummary } from "./BalloonSummary"

interface AnalysisResultsProps {
  data: {
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
  onDesignAssistantUpdate?: (totalClusters: number) => void
}

export const AnalysisResults = ({ data, onDesignAssistantUpdate }: AnalysisResultsProps) => {
  console.log("AnalysisResults received data:", data);

  const balloons11 = data.sizes.find(size => size.size === "11in")?.quantity || 0;
  const balloons16 = data.sizes.find(size => size.size === "16in")?.quantity || 0;

  return (
    <div className="space-y-6">
      <BalloonSummary
        totalBalloons11={balloons11}
        totalBalloons16={balloons16}
        totalClusters={data.clusters}
        onUpdate={onDesignAssistantUpdate}
      />
      {data.numberedAnalysis && (
        <BalloonCalculationTable
          balloonsByColor={Object.entries(data.numberedAnalysis.colorKey).map(([number, color]) => {
            const cluster = data.numberedAnalysis!.clusters.find(c => c.number.toString() === number);
            return {
              color,
              balloons11: (cluster?.count || 0) * 11,
              balloons16: (cluster?.count || 0) * 2,
              totalClusters: cluster?.count || 0
            };
          })}
          calculations={{
            balloons11in: balloons11,
            balloons16in: balloons16,
            totalClusters: data.clusters
          }}
        />
      )}
    </div>
  )
}