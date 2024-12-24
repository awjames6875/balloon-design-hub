import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BalloonRequirement {
  color: string;
  balloons11: number;
  balloons16: number;
  totalClusters: number;
}

interface BalloonRequirementsTableProps {
  balloonsByColor: BalloonRequirement[];
  totalClusters: number;
  totalBalloons11: number;
  totalBalloons16: number;
}

export const BalloonRequirementsTable = ({
  balloonsByColor,
  totalClusters,
  totalBalloons11,
  totalBalloons16,
}: BalloonRequirementsTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead className="text-right">Clusters</TableHead>
            <TableHead className="text-right">11" Balloons</TableHead>
            <TableHead className="text-right">16" Balloons</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balloonsByColor.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.color}</TableCell>
              <TableCell className="text-right">{item.totalClusters}</TableCell>
              <TableCell className="text-right">{item.balloons11}</TableCell>
              <TableCell className="text-right">{item.balloons16}</TableCell>
            </TableRow>
          ))}
          <TableRow className="font-medium">
            <TableCell>Total</TableCell>
            <TableCell className="text-right">{totalClusters}</TableCell>
            <TableCell className="text-right">{totalBalloons11}</TableCell>
            <TableCell className="text-right">{totalBalloons16}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};