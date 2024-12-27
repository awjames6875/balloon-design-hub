import { useState, useEffect } from "react"
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
  const [hasChanged, setHasChanged] = useState(false)

  useEffect(() => {
    setHasChanged(quantity !== currentQuantity.toString())
  }, [quantity, currentQuantity])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const newQuantity = parseInt(quantity)
      
      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error('Please enter a valid quantity')
        return
      }

      // First check if the record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('balloon_inventory')
        .select('id')
        .eq('color', color)
        .eq('size', size)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking inventory record:', checkError)
        toast.error('Failed to check inventory record')
        return
      }

      let updateError

      if (!existingRecord) {
        // If record doesn't exist, create it
        const { error: insertError } = await supabase
          .from('balloon_inventory')
          .insert([
            { 
              color, 
              size, 
              quantity: newQuantity,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
        updateError = insertError
      } else {
        // If record exists, update it
        const { error: updateRecordError } = await supabase
          .from('balloon_inventory')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('color', color)
          .eq('size', size)
        updateError = updateRecordError
      }

      if (updateError) {
        console.error('Error updating inventory:', updateError)
        toast.error('Failed to update inventory')
        return
      }

      toast.success(`Updated ${color} ${size} balloons quantity to ${newQuantity}`)
      onUpdate()
      setHasChanged(false)
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
      <Button 
        type="submit" 
        disabled={isUpdating}
        variant={hasChanged ? "destructive" : "default"}
      >
        Update
      </Button>
    </form>
  )
}