
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
import { getInventoryStatus } from "./inventoryService"

interface InventoryTableProps {
  items: InventoryItem[]
  isLoading: boolean
}

export const InventoryTable = ({ items, isLoading }: InventoryTableProps) => {
  // Calculate totals
  const totals = items.reduce((acc, item) => {
    if (!acc[item.size]) {
      acc[item.size] = { required: 0, available: 0, remaining: 0 }
    }
    acc[item.size].required += item.required
    acc[item.size].available += item.quantity
    acc[item.size].remaining += (item.remaining || 0)
    return acc
  }, {} as Record<string, { required: number; available: number; remaining: number }>)

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Color</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">Required</TableHead>
            <TableHead className="text-right">Available</TableHead>
            <TableHead className="text-right">Remaining</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Checking inventory...
              </TableCell>
            </TableRow>
          ) : (
            <>
              {items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell className="text-right">{item.required}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{item.remaining !== undefined ? item.remaining : item.quantity - item.required}</TableCell>
                  <TableCell>
                    <InventoryStatus status={item.status} />
                  </TableCell>
                </TableRow>
              ))}
              {/* Add total rows */}
              {Object.entries(totals).map(([size, total]) => (
                <TableRow key={`total-${size}`} className="font-semibold bg-muted/50">
                  <TableCell colSpan={1}>Total</TableCell>
                  <TableCell>{size}</TableCell>
                  <TableCell className="text-right">{total.required}</TableCell>
                  <TableCell className="text-right">{total.available}</TableCell>
                  <TableCell className="text-right">{total.remaining}</TableCell>
                  <TableCell>
                    <InventoryStatus 
                      status={getInventoryStatus(total.available, total.required)} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
