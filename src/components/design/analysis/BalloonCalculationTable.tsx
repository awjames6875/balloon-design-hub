
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BalloonData {
  color: string
  balloons11: number
  balloons16: number
  clustersCount: number
}

interface BalloonCalculationTableProps {
  balloonsPerColor: BalloonData[]
  totalClusters: number
  BALLOONS_11_PER_CLUSTER: number
  BALLOONS_16_PER_CLUSTER: number
  totalBalloons11: number
  totalBalloons16: number
}

export const BalloonCalculationTable = ({
  balloonsPerColor,
  totalClusters,
  BALLOONS_11_PER_CLUSTER,
  BALLOONS_16_PER_CLUSTER,
  totalBalloons11,
  totalBalloons16,
}: BalloonCalculationTableProps) => {
  return (
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
            <TableCell className="text-right">
              {colorData.clustersCount * BALLOONS_11_PER_CLUSTER}
            </TableCell>
            <TableCell className="text-right">
              {colorData.clustersCount * BALLOONS_16_PER_CLUSTER}
            </TableCell>
          </TableRow>
        ))}
        <TableRow className="font-medium bg-muted/50">
          <TableCell>Total</TableCell>
          <TableCell className="text-right">{totalClusters}</TableCell>
          <TableCell className="text-right">{totalBalloons11 / totalClusters}</TableCell>
          <TableCell className="text-right">{totalBalloons16 / totalClusters}</TableCell>
          <TableCell className="text-right">{totalBalloons11}</TableCell>
          <TableCell className="text-right">{totalBalloons16}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}
