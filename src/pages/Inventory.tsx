import { useState, useEffect } from "react"
import { Package, TrendingUp } from "lucide-react"
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
import { balloonDensityData } from "@/lib/balloon-density"
import { BalloonChart } from "@/components/charts/BalloonChart"
import { supabase } from "@/integrations/supabase/client"

interface BalloonInventory {
  type: string
  style: string
  inStock: number
  toOrder: number
}

const Inventory = () => {
  const [inventory, setInventory] = useState<BalloonInventory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('balloon_inventory')
        .select('*')
        .order('color')
        .order('size')

      if (error) throw error

      const formattedInventory = data.map(item => ({
        type: item.color,
        style: item.size,
        inStock: item.quantity,
        toOrder: 0
      }))

      setInventory(formattedInventory)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      toast({
        title: "Error",
        description: "Failed to load inventory data",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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

  const getUsageData = () => {
    return inventory.map((item) => ({
      name: `${item.type} (${item.style})`,
      actual: item.inStock,
      effective: Math.floor(
        item.inStock *
          (balloonDensityData.find((d) => d.Style === item.style)?.Density || 1)
      ),
    }))
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading inventory...</div>
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
              <TableHead>Size</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">To Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item, index) => (
              <TableRow key={`${item.type}-${item.style}-${index}`}>
                <TableCell className="font-medium">{item.type}</TableCell>
                <TableCell>{item.style}</TableCell>
                <TableCell className="text-right">{item.inStock}</TableCell>
                <TableCell className="text-right">{item.toOrder}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Stock Usage Analytics</h2>
        <BalloonChart data={getUsageData()} />
      </div>

      <div className="flex justify-center gap-4">
        <Button
          onClick={handleOrder}
          className="flex items-center gap-2"
          variant="default"
        >
          <Package className="h-4 w-4" />
          Order More Balloons
        </Button>
        <Button
          onClick={fetchInventory}
          className="flex items-center gap-2"
          variant="outline"
        >
          <TrendingUp className="h-4 w-4" />
          Refresh Inventory
        </Button>
      </div>
    </div>
  )
}

export default Inventory