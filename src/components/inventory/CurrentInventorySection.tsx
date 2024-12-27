import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InventoryUpdateForm } from "./InventoryUpdateForm"
import { AddBalloonForm } from "./AddBalloonForm"
import { supabase } from "@/integrations/supabase/client"
import { useEffect, useState } from "react"
import type { BalloonInventory } from "./types"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface CurrentInventorySectionProps {
  inventory: BalloonInventory[]
  isLoading: boolean
  onInventoryUpdate: () => void
}

export const CurrentInventorySection = ({ 
  inventory: initialInventory, 
  isLoading: initialLoading,
  onInventoryUpdate
}: CurrentInventorySectionProps) => {
  const [inventory, setInventory] = useState<BalloonInventory[]>(initialInventory)
  const [isLoading, setIsLoading] = useState(initialLoading)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchLatestInventory = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('balloon_inventory')
        .select('*')
        .order('color')
        .order('size')

      if (error) {
        console.error('Error fetching inventory:', error)
        return
      }

      // Transform the data to match BalloonInventory type
      const transformedData: BalloonInventory[] = data.map(item => ({
        type: item.color,
        style: item.size,
        inStock: item.quantity,
        toOrder: 0
      }))

      setInventory(transformedData)
    } catch (error) {
      console.error('Error in fetchLatestInventory:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchLatestInventory()
  }, [])

  const handleInventoryUpdate = async () => {
    await fetchLatestInventory()
    onInventoryUpdate() // Call parent's update function as well
  }

  const handleBalloonAdded = () => {
    handleInventoryUpdate()
    setIsDialogOpen(false)
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading inventory...</div>
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Current Inventory</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Balloon Type
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Balloon Type</DialogTitle>
            </DialogHeader>
            <AddBalloonForm onBalloonAdded={handleBalloonAdded} />
          </DialogContent>
        </Dialog>
      </div>
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
                    onUpdate={handleInventoryUpdate}
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