import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Accessory {
  type: string
  quantity: number
}

interface AccessoriesTableProps {
  accessories: Accessory[]
  autoCalculate: boolean
  onRemove?: (type: string) => void
}

export const AccessoriesTable = ({
  accessories,
  autoCalculate,
  onRemove,
}: AccessoriesTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Quantity</TableHead>
            {!autoCalculate && <TableHead className="w-[100px]">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {accessories.map((accessory, index) => (
            <TableRow key={index}>
              <TableCell>{accessory.type}</TableCell>
              <TableCell>{accessory.quantity}</TableCell>
              {!autoCalculate && onRemove && (
                <TableCell>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onRemove(accessory.type)}
                  >
                    Remove
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}