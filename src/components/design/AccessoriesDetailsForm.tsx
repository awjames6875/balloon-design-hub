import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

interface Accessory {
  type: string
  quantity: number
}

interface AccessoriesDetailsFormProps {
  onNext: (accessories: Accessory[]) => void
}

export const AccessoriesDetailsForm = ({ onNext }: AccessoriesDetailsFormProps) => {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [accessoryType, setAccessoryType] = useState("")
  const [quantity, setQuantity] = useState("")

  const handleAddAccessory = () => {
    if (!accessoryType || !quantity) {
      return
    }

    const newAccessory: Accessory = {
      type: accessoryType,
      quantity: parseInt(quantity),
    }

    setAccessories([...accessories, newAccessory])
    setAccessoryType("")
    setQuantity("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Accessories Details</h2>

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
                <SelectItem value="Starburst Large">Starburst Large</SelectItem>
                <SelectItem value="Starburst Small">Starburst Small</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
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
              min="0"
            />
          </div>
        </div>

        <Button onClick={handleAddAccessory} className="w-full">
          Add Accessory
        </Button>
      </div>

      {accessories.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessories.map((accessory, index) => (
                <TableRow key={index}>
                  <TableCell>{accessory.type}</TableCell>
                  <TableCell>{accessory.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Button
        onClick={() => onNext(accessories)}
        className="w-full"
        disabled={accessories.length === 0}
      >
        Next
      </Button>
    </div>
  )
}