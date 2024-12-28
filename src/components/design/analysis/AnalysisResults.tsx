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
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Detected Clusters</h4>
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
        <h4 className="text-sm font-medium mb-2">Balloon Sizes</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
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