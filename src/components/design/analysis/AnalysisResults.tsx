import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface AnalysisData {
  clusters: number
  colors: string[]
  sizes: Array<{
    size: string
    quantity: number
  }>
}

interface AnalysisResultsProps {
  data: AnalysisData | null
}

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  if (!data) {
    return <div>No analysis data available</div>
  }

  // Calculate balloons per cluster for each color
  const balloonsPerColor = (data.colors || []).map(color => ({
    color,
    balloons11: 11, // Each cluster uses 11 11-inch balloons
    balloons16: 2,  // Each cluster uses 2 16-inch balloons
    clustersCount: Math.floor(data.clusters / (data.colors?.length || 1))
  }))

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
                <TableCell className="text-right">{colorData.balloons11}</TableCell>
                <TableCell className="text-right">{colorData.balloons16}</TableCell>
                <TableCell className="text-right">{colorData.clustersCount * colorData.balloons11}</TableCell>
                <TableCell className="text-right">{colorData.clustersCount * colorData.balloons16}</TableCell>
              </TableRow>
            ))}
            <TableRow className="font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{data.clusters}</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">-</TableCell>
              <TableCell className="text-right">
                {balloonsPerColor.reduce((sum, color) => sum + (color.clustersCount * color.balloons11), 0)}
              </TableCell>
              <TableCell className="text-right">
                {balloonsPerColor.reduce((sum, color) => sum + (color.clustersCount * color.balloons16), 0)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}