import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

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

  // Calculate totals
  const totalClusters = balloonsPerColor.reduce((sum, color) => 
    sum + color.clustersCount, 0
  )
  const totalBalloons11 = balloonsPerColor.reduce((sum, color) => 
    sum + (color.clustersCount * BALLOONS_11_PER_CLUSTER), 0
  )
  const totalBalloons16 = balloonsPerColor.reduce((sum, color) => 
    sum + (color.clustersCount * BALLOONS_16_PER_CLUSTER), 0
  )

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Balloons Per Color Cluster</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Total Clusters</TableHead>
              <TableHead className="text-right">11" Balloons per Cluster</TableHead>
              <TableHead className="text-right">16" Balloons per Cluster</TableHead>
              <TableHead className="text-right">Total 11" Balloons</TableHead>
              <TableHead className="text-right">Total 16" Balloons</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balloonsPerColor.map((colorData, index) => (
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-gray-200"
                    style={{ backgroundColor: colorData.color }}
                  />
                  {colorData.color}
                </TableCell>
                <TableCell className="text-right">{colorData.clustersCount}</TableCell>
                <TableCell className="text-right">{BALLOONS_11_PER_CLUSTER}</TableCell>
                <TableCell className="text-right">{BALLOONS_16_PER_CLUSTER}</TableCell>
                <TableCell className="text-right font-medium">
                  {colorData.clustersCount * BALLOONS_11_PER_CLUSTER}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {colorData.clustersCount * BALLOONS_16_PER_CLUSTER}
                </TableCell>
              </TableRow>
            ))}
            <TableRow className="font-medium bg-muted/50">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{totalClusters}</TableCell>
              <TableCell className="text-right">{BALLOONS_11_PER_CLUSTER}</TableCell>
              <TableCell className="text-right">{BALLOONS_16_PER_CLUSTER}</TableCell>
              <TableCell className="text-right">{totalBalloons11}</TableCell>
              <TableCell className="text-right">{totalBalloons16}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 p-4 bg-muted rounded-lg">
        <h4 className="text-sm font-medium mb-2">Summary</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total 11" Balloons Needed</p>
            <p className="text-2xl font-bold">{totalBalloons11}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total 16" Balloons Needed</p>
            <p className="text-2xl font-bold">{totalBalloons16}</p>
          </div>
        </div>
      </div>
    </div>
  )
}