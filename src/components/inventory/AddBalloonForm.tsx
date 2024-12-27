import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

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
      // Validate input
      const parsedQuantity = parseInt(quantity)
      if (isNaN(parsedQuantity) || parsedQuantity < 0) {
        toast.error("Invalid quantity", {
          description: "Please enter a valid number greater than or equal to 0."
        })
        return
      }

      if (!color.trim() || !size.trim()) {
        toast.error("Missing information", {
          description: "Please fill in both color and size fields."
        })
        return
      }

      // Check if balloon type already exists
      const { data: existingBalloon, error: checkError } = await supabase
        .from("balloon_inventory")
        .select("id, quantity")
        .eq("color", color.trim())
        .eq("size", size.trim())
        .maybeSingle()

      if (checkError) {
        console.error("Error checking for existing balloon:", checkError)
        toast.error("Database error", {
          description: "Failed to check for existing balloon type."
        })
        return
      }

      if (existingBalloon) {
        // Update existing balloon quantity
        const newQuantity = existingBalloon.quantity + parsedQuantity
        const { error: updateError } = await supabase
          .from("balloon_inventory")
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingBalloon.id)

        if (updateError) {
          console.error("Error updating balloon quantity:", updateError)
          toast.error("Failed to update balloon quantity", {
            description: "An unexpected error occurred while updating the quantity."
          })
          return
        }

        toast.success("Balloon quantity updated", {
          description: `Added ${parsedQuantity} to existing ${color} ${size} balloons. New total: ${newQuantity}`
        })
      } else {
        // Add new balloon type
        const { error: insertError } = await supabase
          .from("balloon_inventory")
          .insert([
            {
              color: color.trim(),
              size: size.trim(),
              quantity: parsedQuantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])

        if (insertError) {
          console.error("Error adding balloon type:", insertError)
          toast.error("Failed to add balloon type", {
            description: "An unexpected error occurred while adding the balloon type."
          })
          return
        }

        toast.success("New balloon type added", {
          description: `Added ${color} ${size} balloons with quantity ${quantity}.`
        })
      }

      // Reset form and notify parent
      setColor("")
      setSize("")
      setQuantity("")
      onBalloonAdded()

    } catch (error) {
      console.error("Error adding balloon type:", error)
      toast.error("Failed to add balloon type", {
        description: "An unexpected error occurred. Please try again."
      })
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
          <Input
            id="size"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Enter balloon size"
            disabled={isSubmitting}
          />
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