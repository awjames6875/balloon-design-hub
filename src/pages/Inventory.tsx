import { useState } from "react"
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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis } from "recharts"
import { balloonDensityData, calculateRequiredStock } from "@/lib/balloon-density"

interface BalloonInventory {
  type: string;
  style: string;
  inStock: number;
  toOrder: number;
}

const initialInventory: BalloonInventory[] = [
  { type: "Red", style: "Straight", inStock: 50, toOrder: 0 },
  { type: "Blue", style: "Curved", inStock: 20, toOrder: 30 },
  { type: "White", style: "Straight", inStock: 35, toOrder: 15 },
  { type: "Gold", style: "Cluster", inStock: 25, toOrder: 25 },
]

const Inventory = () => {
  const [inventory, setInventory] = useState<BalloonInventory[]>(initialInventory)
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

  const getUsageData = () => {
    return inventory.map((item) => ({
      name: item.type,
      actual: item.inStock,
      effective: Math.floor(item.inStock * 
        (balloonDensityData.find(d => d.Style === item.style)?.Density || 1)),
    }))
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
              <TableHead>Style</TableHead>
              <TableHead className="text-right">In Stock</TableHead>
              <TableHead className="text-right">Effective Stock</TableHead>
              <TableHead className="text-right">To Order</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventory.map((item) => {
              const effectiveStock = Math.floor(
                item.inStock * 
                (balloonDensityData.find(d => d.Style === item.style)?.Density || 1)
              )
              return (
                <TableRow key={`${item.type}-${item.style}`}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell>{item.style}</TableCell>
                  <TableCell className="text-right">{item.inStock}</TableCell>
                  <TableCell className="text-right">{effectiveStock}</TableCell>
                  <TableCell className="text-right">{item.toOrder}</TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Stock Usage Analytics</h2>
        <div className="h-[300px]">
          <ChartContainer
            config={{
              actual: {
                label: "Actual Stock",
                theme: { light: "hsl(220 80% 50%)", dark: "hsl(220 80% 50%)" },
              },
              effective: {
                label: "Effective Stock",
                theme: { light: "hsl(150 80% 50%)", dark: "hsl(150 80% 50%)" },
              },
            }}
          >
            <BarChart data={getUsageData()}>
              <XAxis dataKey="name" />
              <YAxis />
              <Bar dataKey="actual" fill="var(--color-actual)" />
              <Bar dataKey="effective" fill="var(--color-effective)" />
              <ChartTooltip content={ChartTooltipContent} />
              <ChartLegend content={ChartLegendContent} />
            </BarChart>
          </ChartContainer>
        </div>
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
          onClick={() => {
            toast({
              title: "Analytics Updated",
              description: "Stock usage patterns have been recalculated.",
            })
          }}
          className="flex items-center gap-2"
          variant="outline"
        >
          <TrendingUp className="h-4 w-4" />
          Update Analytics
        </Button>
      </div>
    </div>
  )
}

export default Inventory