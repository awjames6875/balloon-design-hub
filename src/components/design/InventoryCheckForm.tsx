import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface InventoryCheckProps {
  colorClusters: Array<{
    color: string
    baseClusters: number
    extraClusters: number
  }>
  calculations: {
    balloons11in: number
    balloons16in: number
  }
  onInventoryChecked: () => void
}

interface InventoryItem {
  color: string
  size: string
  quantity: number
}

const colorNameMap: { [key: string]: string } = {
  "#FF0000": "Red",
  "#FFA500": "Orange",
  "#FFFF00": "Yellow",
  "#008000": "Green",
  "#0000FF": "Blue",
  "#800080": "Purple",
  "#FFC0CB": "Pink",
  "#FFFFFF": "White",
  "#000000": "Black",
  // Add more mappings as needed
}

export const InventoryCheckForm = ({ 
  colorClusters, 
  calculations,
  onInventoryChecked 
}: InventoryCheckProps) => {
  const [inventoryStatus, setInventoryStatus] = useState<{[key: string]: boolean}>({})
  const [isLoading, setIsLoading] = useState(true)

  const calculateBalloonsPerColor = () => {
    const balloonsPerCluster = {
      '11inch': 11,
      '16inch': 2
    }

    return colorClusters.map(cluster => ({
      color: cluster.color,
      balloons11: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['11inch']),
      balloons16: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['16inch'])
    }))
  }

  const getColorName = (hexColor: string) => {
    return colorNameMap[hexColor.toUpperCase()] || hexColor
  }

  const checkInventory = async () => {
    setIsLoading(true)
    const balloonsByColor = calculateBalloonsPerColor()
    const status: {[key: string]: boolean} = {}

    try {
      for (const colorData of balloonsByColor) {
        const colorName = getColorName(colorData.color)
        
        // Check 11" balloons
        const { data: data11, error: error11 } = await supabase
          .from('balloon_inventory')
          .select('quantity')
          .eq('color', colorName)
          .eq('size', '11in')
          .maybeSingle()

        if (error11) {
          console.error('Error checking 11" inventory:', error11)
          continue
        }

        // Check 16" balloons
        const { data: data16, error: error16 } = await supabase
          .from('balloon_inventory')
          .select('quantity')
          .eq('color', colorName)
          .eq('size', '16in')
          .maybeSingle()

        if (error16) {
          console.error('Error checking 16" inventory:', error16)
          continue
        }

        const has11InchStock = data11 && data11.quantity >= colorData.balloons11
        const has16InchStock = data16 && data16.quantity >= colorData.balloons16
        
        status[colorData.color] = has11InchStock && has16InchStock

        if (!has11InchStock || !has16InchStock) {
          console.log(`Inventory check failed for ${colorName}:`, {
            has11InchStock,
            has16InchStock,
            required11: colorData.balloons11,
            available11: data11?.quantity,
            required16: colorData.balloons16,
            available16: data16?.quantity
          })
        }
      }

      setInventoryStatus(status)
      
      const allInStock = Object.values(status).every(Boolean)
      if (allInStock) {
        toast.success("All required balloons are in stock!")
      } else {
        toast.error("Some balloons are out of stock")
      }
    } catch (error) {
      console.error('Error checking inventory:', error)
      toast.error("Failed to check inventory")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    checkInventory()
  }, [])

  const balloonsByColor = calculateBalloonsPerColor()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Pre-Inflation Inventory Check</h2>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Color</TableHead>
              <TableHead>11" Balloons</TableHead>
              <TableHead>16" Balloons</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {balloonsByColor.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{getColorName(item.color)}</TableCell>
                <TableCell>{item.balloons11}</TableCell>
                <TableCell>{item.balloons16}</TableCell>
                <TableCell>
                  {isLoading ? (
                    <span className="text-gray-500">Checking...</span>
                  ) : (
                    <span className={inventoryStatus[item.color] ? "text-green-500" : "text-red-500"}>
                      {inventoryStatus[item.color] ? "In Stock" : "Out of Stock"}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex gap-4">
        <Button 
          onClick={checkInventory} 
          variant="outline"
          disabled={isLoading}
        >
          Refresh Inventory
        </Button>
        <Button
          onClick={onInventoryChecked}
          disabled={isLoading || !Object.values(inventoryStatus).every(Boolean)}
          className="flex-1"
        >
          Continue
        </Button>
      </div>
    </div>
  )
}