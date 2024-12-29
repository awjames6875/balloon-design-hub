import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ClusterData {
  number: number
  appearances: number
  positions: string[]
  color: string
}

interface ClusterAnalysisProps {
  clusters: ClusterData[]
}

export const ClusterAnalysis = ({ clusters }: ClusterAnalysisProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cluster #</TableHead>
              <TableHead>Appearances</TableHead>
              <TableHead>Positions</TableHead>
              <TableHead>Color</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clusters.map((cluster) => (
              <TableRow key={cluster.number}>
                <TableCell className="font-medium">#{cluster.number}</TableCell>
                <TableCell>{cluster.appearances}</TableCell>
                <TableCell>{cluster.positions.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-200" 
                      style={{ backgroundColor: cluster.color }}
                    />
                    {cluster.color}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}