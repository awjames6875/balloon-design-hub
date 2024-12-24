import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface AccessoriesTableProps {
  accessories: Array<{
    type: string;
    quantity: number;
  }>;
}

export const AccessoriesTable = ({ accessories }: AccessoriesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessories.map((accessory, index) => (
            <TableRow key={index}>
              <TableCell>{accessory.type}</TableCell>
              <TableCell>{accessory.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};