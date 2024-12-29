import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ColorKey {
  [key: string]: string
}

interface Cluster {
  number: number
  definedColor: string
  count: number
}

interface ClusterAnalysisProps {
  colorKey: ColorKey
  clusters: Cluster[]
}

export const ClusterAnalysis = ({ colorKey, clusters }: ClusterAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Analysis</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-2">Color Key</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(colorKey).map(([number, color]) => (
              <div 
                key={number}
                className="flex items-center gap-2 p-2 rounded-md border"
              >
                <span className="font-medium">#{number}:</span>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-gray-200" 
                    style={{ backgroundColor: color }}
                  />
                  <span>{color}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Cluster Counts</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cluster #</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clusters.map((cluster) => (
                <TableRow key={cluster.number}>
                  <TableCell className="font-medium">#{cluster.number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-200" 
                        style={{ backgroundColor: cluster.definedColor }}
                      />
                      {cluster.definedColor}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{cluster.count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}