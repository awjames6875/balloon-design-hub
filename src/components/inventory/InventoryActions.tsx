import { Package, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface InventoryActionsProps {
  onRefresh: () => void
  inventory: Array<{ toOrder: number }>
}

export const InventoryActions = ({ onRefresh, inventory }: InventoryActionsProps) => {
  const handleOrder = () => {
    const itemsToOrder = inventory.filter((item) => item.toOrder > 0)
    if (itemsToOrder.length === 0) {
      toast("No items to order", {
        description: "There are no balloons that need to be ordered at this time.",
      })
      return
    }

    toast("Order placed successfully", {
      description: "Your balloon order has been submitted for processing.",
    })
  }

  return (
    <div className="flex justify-center gap-4 mt-8">
      <Button
        onClick={handleOrder}
        className="flex items-center gap-2"
        variant="default"
      >
        <Package className="h-4 w-4" />
        Order More Balloons
      </Button>
      <Button
        onClick={onRefresh}
        className="flex items-center gap-2"
        variant="outline"
      >
        <TrendingUp className="h-4 w-4" />
        Refresh Inventory
      </Button>
    </div>
  )
}