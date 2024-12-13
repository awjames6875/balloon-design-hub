import { useState } from "react"
import { Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"

interface BalloonInventory {
  type: string
  inStock: number
  toOrder: number
}

const initialInventory: BalloonInventory[] = [
  { type: "Red", inStock: 50, toOrder: 0 },
  { type: "Blue", inStock: 20, toOrder: 30 },
  { type: "White", inStock: 35, toOrder: 15 },
  { type: "Gold", inStock: 25, toOrder: 25 },
]

const Inventory = () => {
  const [inventory] = useState<BalloonInventory[]>(initialInventory)
  const { toast } = useToast()

  const handleOrder = () => {
    const itemsToOrder = inventory.filter((item) => item.toOrder > 0)
    if (itemsToOrder.length === 0) {
      toast({
        title: "No items to order",
        description: "There are no balloons that need to be ordered at this time.",
      })
      return
    }

    toast({
      title: "Order placed successfully",
      description: "Your balloon order has been submitted for processing.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">
        Inventory Management
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Balloon Type</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">To Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.type}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell className="text-right">{item.inStock}</TableCell>
                <TableCell className="text-right">{item.toOrder}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={handleOrder}
          className="flex items-center gap-2"
          variant="default"
        >
          <Package className="h-4 w-4" />
          Order More Balloons
        </Button>
      </div>
    </div>
  )
}

export default Inventory