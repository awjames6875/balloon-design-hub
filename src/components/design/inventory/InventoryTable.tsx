import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { InventoryStatus } from "./InventoryStatus"
import { InventoryItem } from "./types"

interface InventoryTableProps {
  items: InventoryItem[]
  isLoading: boolean
}

export const InventoryTable = ({ items, isLoading }: InventoryTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Required</TableHead>
            <TableHead className="text-right">Available</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                Checking inventory...
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.color}</TableCell>
                <TableCell>{item.size}</TableCell>
                <TableCell className="text-right">{item.required}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell>
                  <InventoryStatus status={item.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}