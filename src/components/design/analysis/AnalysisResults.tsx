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
  data: AnalysisData
}

export const AnalysisResults = ({ data }: AnalysisResultsProps) => {
  // Calculate balloons per cluster for each color
  const balloonsPerColor = data.colors.map(color => ({
    color,
    balloons11: 11, // Each cluster uses 11 11-inch balloons
    balloons16: 2,  // Each cluster uses 2 16-inch balloons
    clustersCount: Math.floor(data.clusters / data.colors.length)
  }))

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Total Detected Clusters</h4>
          <p className="text-2xl font-bold">{data.clusters}</p>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Detected Colors</h4>
          <div className="flex gap-2">
            {data.colors.map((color, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full border border-gray-200"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Balloons Per Color Cluster</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Clusters</TableHead>
              <TableHead className="text-right">11" Balloons per Cluster</TableHead>
              <TableHead className="text-right">16" Balloons per Cluster</TableHead>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-2">Total Balloons Required</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Total Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.sizes.map((size, index) => (
              <TableRow key={index}>
                <TableCell>{size.size}</TableCell>
                <TableCell className="text-right">{size.quantity}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}