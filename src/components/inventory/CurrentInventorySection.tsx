import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InventoryUpdateForm } from "./InventoryUpdateForm"
import type { BalloonInventory } from "./types"

interface CurrentInventorySectionProps {
  inventory: BalloonInventory[]
  isLoading: boolean
  onInventoryUpdate: () => void
}

export const CurrentInventorySection = ({ 
  inventory, 
  isLoading,
  onInventoryUpdate
}: CurrentInventorySectionProps) => {
  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading inventory...</div>
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Current Inventory</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Balloon Type</TableHead>
              <TableHead>Size</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead>Update Quantity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={`${item.type}-${item.style}-${index}`}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.style}</TableCell>
                <TableCell className="text-right">{item.inStock}</TableCell>
                <TableCell>
                  <InventoryUpdateForm
                    color={item.type}
                    size={item.style}
                    currentQuantity={item.inStock}
                    onUpdate={onInventoryUpdate}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}