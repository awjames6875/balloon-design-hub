
import { useState } from "react"
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

interface AddBalloonFormProps {
  onBalloonAdded: () => void
}

export const AddBalloonForm = ({ onBalloonAdded }: AddBalloonFormProps) => {
  const [color, setColor] = useState("")
  const [size, setSize] = useState("")
  const [quantity, setQuantity] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate inputs
      if (!color.trim()) {
        toast.error("Please enter a color name")
        return
      }

      if (!size.trim()) {
        toast.error("Please enter a balloon size")
        return
      }

      if (!quantity.trim() || parseInt(quantity) < 0) {
        toast.error("Please enter a valid quantity")
        return
      }

      // Ensure size is in the correct format
      let normalizedSize = size.trim();
      if (normalizedSize !== '11in' && normalizedSize !== '16in') {
        if (normalizedSize.includes('11')) {
          normalizedSize = '11in';
        } else if (normalizedSize.includes('16')) {
          normalizedSize = '16in';
        } else {
          toast.error("Size must be either 11in or 16in")
          return;
        }
      }

      console.log(`Adding new balloon: ${color} ${normalizedSize} - ${quantity}`)

      const success = await addNewBalloonType(
        color,
        normalizedSize,
        parseInt(quantity)
      )

      if (success) {
        // Reset form
        setColor("")
        setSize("")
        setQuantity("")
        
        // Notify success
        toast.success(`Added ${quantity} ${color} ${normalizedSize} balloons to inventory`)
        
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
        <div className="space-y-2">
          <Label htmlFor="color">Color</Label>
          <Input
            id="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            placeholder="Enter balloon color"
            disabled={isSubmitting}
          />
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
