
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ColorSuggestions } from "./ColorSuggestions"
import { useColorSuggestions } from "./useColorSuggestions"

interface BalloonFormFieldsProps {
  isSubmitting: boolean;
  onFieldsChange: (fields: { color: string; size: string; quantity: string }) => void;
}

export const BalloonFormFields = ({ 
  isSubmitting, 
  onFieldsChange 
}: BalloonFormFieldsProps) => {
  const {
    color,
    filteredSuggestions,
    showSuggestions,
    handleColorChange,
    handleSelectSuggestion
  } = useColorSuggestions()
  
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState("")

  // Update parent component when fields change
  const updateParent = (
    updatedColor = color, 
    updatedSize = size, 
    updatedQuantity = quantity
  ) => {
    onFieldsChange({
      color: updatedColor,
      size: updatedSize,
      quantity: updatedQuantity
    })
  }

  // Handle color selection
  const handleSuggestionSelect = (suggestion: string) => {
    handleSelectSuggestion(suggestion)
    updateParent(suggestion, size, quantity)
  }

  // Handle size change
  const handleSizeChange = (value: string) => {
    setSize(value)
    updateParent(color, value, quantity)
  }

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuantity(value)
    updateParent(color, size, value)
  }

  // Handle input color change
  const handleInputColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleColorChange(e)
    updateParent(e.target.value, size, quantity)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2 relative">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={color}
          onChange={handleInputColorChange}
          placeholder="Enter balloon color"
          disabled={isSubmitting}
          className="relative"
        />
        <ColorSuggestions 
          suggestions={filteredSuggestions}
          visible={showSuggestions}
          onSelect={handleSuggestionSelect}
        />
        <p className="text-xs text-gray-500 mt-1">
          Use standard color names like "Wild Berry" or "Golden Rod"
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Size</Label>
        <Select 
          value={size} 
          onValueChange={handleSizeChange}
          disabled={isSubmitting}
        >
          <SelectTrigger id="size">
            <SelectValue placeholder="Select balloon size" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="11in">11 inch</SelectItem>
            <SelectItem value="16in">16 inch</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Initial Quantity</Label>
        <Input
          id="quantity"
          type="number"
          min="0"
          value={quantity}
          onChange={handleQuantityChange}
          placeholder="Enter initial quantity"
          disabled={isSubmitting}
        />
      </div>
    </div>
  )
}
