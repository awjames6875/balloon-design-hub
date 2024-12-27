import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

interface InventoryUpdateFormProps {
  color: string
  size: string
  currentQuantity: number
  onUpdate: () => void
}

export const InventoryUpdateForm = ({ 
  color, 
  size, 
  currentQuantity, 
  onUpdate 
}: InventoryUpdateFormProps) => {
  const [quantity, setQuantity] = useState(currentQuantity.toString())
  const [isUpdating, setIsUpdating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const newQuantity = parseInt(quantity)
      
      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error('Please enter a valid quantity')
        return
      }

      const { error } = await supabase
        .from('balloon_inventory')
        .update({ quantity: newQuantity })
        .eq('color', color)
        .eq('size', size)

      if (error) throw error

      toast.success(`Updated ${color} ${size} balloons quantity to ${newQuantity}`)
      onUpdate()
    } catch (error) {
      console.error('Error updating inventory:', error)
      toast.error('Failed to update inventory')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-4">
      <div className="space-y-2">
        <Label htmlFor={`quantity-${color}-${size}`}>New Quantity</Label>
        <Input
          id={`quantity-${color}-${size}`}
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="w-32"
        />
      </div>
      <Button type="submit" disabled={isUpdating}>
        Update
      </Button>
    </form>
  )
}