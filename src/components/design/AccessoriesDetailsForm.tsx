import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

interface Accessory {
  type: string
  quantity: number
}

interface AccessoriesDetailsFormProps {
  onNext: (accessories: Accessory[]) => void
  extraClusters?: number
}

const ACCESSORY_TYPES = [
  { value: "Starburst Large", label: "Starburst Large" },
  { value: "Starburst Small", label: "Starburst Small" },
  { value: "Pearl Garland", label: "Pearl Garland" },
  { value: "Balloon Tassels", label: "Balloon Tassels" },
  { value: "LED Lights", label: "LED Lights" },
]

export const AccessoriesDetailsForm = ({ onNext, extraClusters = 0 }: AccessoriesDetailsFormProps) => {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [accessoryType, setAccessoryType] = useState("")
  const [quantity, setQuantity] = useState("")
  const [autoCalculate, setAutoCalculate] = useState(true)

  useEffect(() => {
    if (autoCalculate && extraClusters > 0) {
      const calculatedAccessories = [
        {
          type: "Starburst Large",
          quantity: Math.ceil(extraClusters * 0.5)
        },
        {
          type: "Starburst Small",
          quantity: Math.ceil(extraClusters * 0.75)
        },
        {
          type: "Pearl Garland",
          quantity: Math.ceil(extraClusters * 0.25)
        }
      ]
      setAccessories(calculatedAccessories)
    }
  }, [extraClusters, autoCalculate])

  const handleAddAccessory = () => {
    if (!accessoryType || !quantity) {
      toast.error("Please select both accessory type and quantity")
      return
    }

    const quantityNum = parseInt(quantity)
    if (isNaN(quantityNum) || quantityNum <= 0) {
      toast.error("Please enter a valid quantity")
      return
    }

    // Check if accessory type already exists
    const existingIndex = accessories.findIndex(acc => acc.type === accessoryType)
    if (existingIndex !== -1) {
      const updatedAccessories = [...accessories]
      updatedAccessories[existingIndex].quantity = quantityNum
      setAccessories(updatedAccessories)
      toast.success("Accessory quantity updated")
    } else {
      setAccessories([...accessories, {
        type: accessoryType,
        quantity: quantityNum
      }])
      toast.success("Accessory added successfully")
    }

    setAccessoryType("")
    setQuantity("")
  }

  const handleAutoCalculateChange = (checked: boolean) => {
    setAutoCalculate(checked)
    if (!checked) {
      setAccessories([])
    } else if (extraClusters > 0) {
      const calculatedAccessories = [
        {
          type: "Starburst Large",
          quantity: Math.ceil(extraClusters * 0.5)
        },
        {
          type: "Starburst Small",
          quantity: Math.ceil(extraClusters * 0.75)
        },
        {
          type: "Pearl Garland",
          quantity: Math.ceil(extraClusters * 0.25)
        }
      ]
      setAccessories(calculatedAccessories)
    }
  }

  const handleRemoveAccessory = (type: string) => {
    setAccessories(accessories.filter(acc => acc.type !== type))
    toast.success("Accessory removed")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Accessories Details</h2>

      <div className="flex items-center space-x-2">
        <Switch
          id="auto-calculate"
          checked={autoCalculate}
          onCheckedChange={handleAutoCalculateChange}
        />
        <Label htmlFor="auto-calculate">Auto-calculate accessories based on extra clusters</Label>
      </div>

      {!autoCalculate && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessoryType">Accessory Type</Label>
              <Select
                value={accessoryType}
                onValueChange={setAccessoryType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select accessory type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCESSORY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
                placeholder="Enter quantity"
              />
            </div>
          </div>

          <Button onClick={handleAddAccessory} className="w-full">
            Add Accessory
          </Button>
        </div>
      )}

      {accessories.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
                {!autoCalculate && <TableHead className="w-[100px]">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessories.map((accessory, index) => (
                <TableRow key={index}>
                  <TableCell>{accessory.type}</TableCell>
                  <TableCell>{accessory.quantity}</TableCell>
                  {!autoCalculate && (
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveAccessory(accessory.type)}
                      >
                        Remove
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Button
        onClick={() => onNext(accessories)}
        className="w-full"
        disabled={!autoCalculate && accessories.length === 0}
      >
        Next
      </Button>
    </div>
  )
}