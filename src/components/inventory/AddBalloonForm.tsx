
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addNewBalloonType } from "@/services/inventoryOperations"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { normalizeColorName } from "@/components/design/inventory/inventoryService"

interface AddBalloonFormProps {
  onBalloonAdded: () => void
}

interface SuggestionColor {
  name: string;
  display_name: string;
}

export const AddBalloonForm = ({ onBalloonAdded }: AddBalloonFormProps) => {
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [colorSuggestions, setColorSuggestions] = useState<SuggestionColor[]>([])
  const [filteredSuggestions, setFilteredSuggestions] = useState<SuggestionColor[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch color standards from database for autocomplete
  useEffect(() => {
    async function fetchColorStandards() {
      try {
        const { data, error } = await supabase
          .from('color_standards')
          .select('name, display_name')
          .order('display_name', { ascending: true })
        
        if (error) {
          console.error('Error fetching color standards:', error)
          return
        }
        
        setColorSuggestions(data || [])
      } catch (err) {
        console.error('Failed to fetch color standards:', err)
      }
    }
    
    fetchColorStandards()
  }, [])

  // Update filtered suggestions when color input changes
  useEffect(() => {
    if (color.length > 1) {
      const normalized = normalizeColorName(color)
      const filtered = colorSuggestions.filter(c => 
        c.display_name.toLowerCase().includes(color.toLowerCase()) ||
        normalizeColorName(c.display_name).includes(normalized)
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [color, colorSuggestions])

  const handleSelectSuggestion = (suggestion: string) => {
    setColor(suggestion)
    setShowSuggestions(false)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value)
    if (e.target.value.length > 1) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!color.trim()) {
        toast.error("Please enter a color name")
        setIsSubmitting(false)
        return
      }

      if (!size.trim()) {
        toast.error("Please select a balloon size")
        setIsSubmitting(false)
        return
      }

      if (!quantity.trim() || parseInt(quantity) < 0) {
        toast.error("Please enter a valid quantity")
        setIsSubmitting(false)
        return
      }

      // Size is already standardized from the dropdown
      console.log(`Adding new balloon: ${color} ${size} - ${quantity}`)

      const success = await addNewBalloonType(
        color,
        size,
        parseInt(quantity)
      )

      if (success) {
        // Reset form
        setColor("")
        setSize("")
        setQuantity("")
        
        // Notify success
        toast.success(`Added ${quantity} ${color} ${size} balloons to inventory`)
        
        // Trigger event for realtime updates
        await supabase
          .from('balloon_inventory')
          .select('*')
          .limit(1)
          
        // Call callback
        onBalloonAdded()
      }
    } catch (error) {
      console.error("Error adding balloon type:", error)
      toast.error("Failed to add balloon type")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4">Add New Balloon Type</h3>
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
          {showSuggestions && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
              {filteredSuggestions.map((suggestion, index) => (
                <div 
                  key={index}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSuggestion(suggestion.display_name)}
                >
                  {suggestion.display_name}
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Use standard color names like "Wild Berry" or "Golden Rod"
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select 
            value={size} 
            onValueChange={setSize}
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
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter initial quantity"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? "Adding..." : "Add Balloon Type"}
      </Button>
    </form>
  )
}
