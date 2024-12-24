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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  required: number
  status: 'in-stock' | 'low' | 'out-of-stock'
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
  "#C0C0C0": "Silver",
  "#FFD700": "Gold"
}

export const InventoryCheckForm = ({ 
  colorClusters, 
  calculations,
  onInventoryChecked 
}: InventoryCheckProps) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
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

  const getInventoryStatus = (available: number, required: number): 'in-stock' | 'low' | 'out-of-stock' => {
    if (available >= required) {
      return available >= required * 1.2 ? 'in-stock' : 'low'
    }
    return 'out-of-stock'
  }

  const checkInventory = async () => {
    setIsLoading(true)
    const balloonsByColor = calculateBalloonsPerColor()
    const inventoryList: InventoryItem[] = []

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

        inventoryList.push({
          color: colorName,
          size: '11in',
          quantity: data11?.quantity || 0,
          required: colorData.balloons11,
          status: getInventoryStatus(data11?.quantity || 0, colorData.balloons11)
        })

        inventoryList.push({
          color: colorName,
          size: '16in',
          quantity: data16?.quantity || 0,
          required: colorData.balloons16,
          status: getInventoryStatus(data16?.quantity || 0, colorData.balloons16)
        })
      }

      setInventoryItems(inventoryList)
      
      const hasLowStock = inventoryList.some(item => item.status === 'low')
      const hasOutOfStock = inventoryList.some(item => item.status === 'out-of-stock')

      if (hasOutOfStock) {
        toast.error("Some balloons are out of stock")
      } else if (hasLowStock) {
        toast.warning("Some balloon colors are running low")
      } else {
        toast.success("All required balloons are in stock!")
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

  const getStatusColor = (status: 'in-stock' | 'low' | 'out-of-stock') => {
    switch (status) {
      case 'in-stock':
        return 'text-green-500'
      case 'low':
        return 'text-yellow-500'
      case 'out-of-stock':
        return 'text-red-500'
    }
  }

  const getStatusText = (status: 'in-stock' | 'low' | 'out-of-stock') => {
    switch (status) {
      case 'in-stock':
        return 'In Stock'
      case 'low':
        return 'Low Stock'
      case 'out-of-stock':
        return 'Out of Stock'
    }
  }

  const canProceed = !inventoryItems.some(item => item.status === 'out-of-stock')

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pre-Inflation Inventory Check</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
                  inventoryItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.color}</TableCell>
                      <TableCell>{item.size}</TableCell>
                      <TableCell className="text-right">{item.required}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>
                        <span className={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
              disabled={isLoading || !canProceed}
              className="flex-1"
            >
              {canProceed ? "Continue" : "Cannot Proceed - Check Inventory"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}