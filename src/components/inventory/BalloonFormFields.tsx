
import { useState, useEffect } from "react"
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
import { useColorInput } from "./useColorInput"

interface BalloonFormFieldsProps {
  isSubmitting: boolean;
  onFieldsChange: (fields: { color: string; size: string; quantity: string }) => void;
}

export const BalloonFormFields = ({ 
  isSubmitting, 
  onFieldsChange 
}: BalloonFormFieldsProps) => {
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([])
  
  // Fetch color suggestions
  const [colorSuggestions, setColorSuggestions] = useState<any[]>([])
  
  useEffect(() => {
    async function fetchColorStandards() {
      try {
        const { data, error } = await supabase
          .from('color_standards')
          .select('color_name, display_name')
          .order('display_name', { ascending: true })
        
        if (error) {
          console.error('Error fetching color standards:', error)
          return
        }
        
        const transformedData = data?.map(item => ({
          name: item.color_name,
          display_name: item.display_name
        })) || []
        
        setColorSuggestions(transformedData)
      } catch (err) {
        console.error('Failed to fetch color standards:', err)
      }
    }
    
    fetchColorStandards()
  }, [])
  
  // Filter suggestions when color input changes
  useEffect(() => {
    if (color.length > 1) {
      const filtered = colorSuggestions.filter(c => 
        c.display_name.toLowerCase().includes(color.toLowerCase())
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [color, colorSuggestions])

  // Update parent component when fields change
  useEffect(() => {
    console.log("Fields changed, updating parent:", { color, size, quantity })
    onFieldsChange({
      color,
      size,
      quantity
    })
  }, [color, size, quantity, onFieldsChange])

  // Handle color input change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Color changing to:", e.target.value)
    setColor(e.target.value)
    if (e.target.value.length > 1) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }
  
  // Handle color suggestion selection
  const handleSelectSuggestion = (suggestion: string) => {
    console.log("Selected suggestion:", suggestion)
    setColor(suggestion)
    setShowSuggestions(false)
  }

  // Handle size change
  const handleSizeChange = (value: string) => {
    console.log("Size changed to:", value)
    setSize(value)
  }

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Quantity changed to:", e.target.value)
    setQuantity(e.target.value)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2 relative">
        <Label htmlFor="color">Color</Label>
        <Input
          id="color"
          value={color}
          onChange={handleColorChange}
          placeholder="Enter balloon color"
          disabled={isSubmitting}
          className="relative"
        />
        <ColorSuggestions 
          suggestions={filteredSuggestions}
          visible={showSuggestions}
          onSelect={handleSelectSuggestion}
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

// Import supabase for fetching color standards
import { supabase } from "@/integrations/supabase/client"
