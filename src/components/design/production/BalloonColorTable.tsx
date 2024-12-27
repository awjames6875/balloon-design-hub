import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface BalloonColorTableProps {
  balloonsByColor: Array<{
    color: string;
    balloons11: number;
    balloons16: number;
    totalClusters: number;
  }>;
  calculations?: {
    balloons11in: number;
    balloons16in: number;
    totalClusters: number;
  };
}

export const BalloonColorTable = ({
  balloonsByColor,
  calculations,
}: BalloonColorTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead className="text-right">11" Balloons</TableHead>
            <TableHead className="text-right">16" Balloons</TableHead>
            <TableHead className="text-right">Total Clusters</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balloonsByColor.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: item.color }}
                />
                {item.color}
              </TableCell>
              <TableCell className="text-right">{item.balloons11}</TableCell>
              <TableCell className="text-right">{item.balloons16}</TableCell>
              <TableCell className="text-right">{item.totalClusters}</TableCell>
            </TableRow>
          ))}
          {calculations && (
            <TableRow className="font-medium">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{calculations.balloons11in}</TableCell>
              <TableCell className="text-right">{calculations.balloons16in}</TableCell>
              <TableCell className="text-right">{calculations.totalClusters}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}