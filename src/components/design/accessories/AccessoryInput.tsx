import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export const ACCESSORY_TYPES = [
  { value: "Starburst Large", label: "Starburst Large" },
  { value: "Starburst Small", label: "Starburst Small" },
  { value: "Pearl Garland", label: "Pearl Garland" },
  { value: "Balloon Tassels", label: "Balloon Tassels" },
  { value: "LED Lights", label: "LED Lights" },
]

interface AccessoryInputProps {
  accessoryType: string
  quantity: string
  onTypeChange: (value: string) => void
  onQuantityChange: (value: string) => void
  onAdd: () => void
}

export const AccessoryInput = ({
  accessoryType,
  quantity,
  onTypeChange,
  onQuantityChange,
  onAdd,
}: AccessoryInputProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accessoryType">Accessory Type</Label>
          <Select value={accessoryType} onValueChange={onTypeChange}>
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
            onChange={(e) => onQuantityChange(e.target.value)}
            min="1"
            placeholder="Enter quantity"
          />
        </div>
      </div>
      <Button onClick={onAdd} className="w-full">
        Add Accessory
      </Button>
    </div>
  )
}