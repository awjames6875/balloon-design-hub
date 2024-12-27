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
      
      if (isNaN(newQuantity)) {
        toast.error('Please enter a valid number')
        return
      }

      if (newQuantity < 0) {
        toast.error('Quantity cannot be negative')
        return
      }

      // First verify if the record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('balloon_inventory')
        .select('id, quantity')
        .eq('color', color)
        .eq('size', size)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking inventory record:', checkError)
        toast.error(`Failed to check inventory for ${color} ${size} balloons`)
        return
      }

      let updateError

      if (!existingRecord) {
        // Create new record if it doesn't exist
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
        
        if (insertError) {
          console.error('Error creating inventory record:', insertError)
          toast.error(`Failed to create inventory record for ${color} ${size} balloons`)
          return
        }

        toast.success(`Created new inventory record for ${color} ${size} balloons with quantity ${newQuantity}`)
      } else {
        // Update existing record
        const { error: updateRecordError } = await supabase
          .from('balloon_inventory')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('color', color)
          .eq('size', size)

        if (updateRecordError) {
          console.error('Error updating inventory:', updateRecordError)
          toast.error(`Failed to update ${color} ${size} balloons quantity`)
          return
        }

        const changeAmount = newQuantity - existingRecord.quantity
        const changeText = changeAmount > 0 ? `increased by ${changeAmount}` : `decreased by ${Math.abs(changeAmount)}`
        
        toast.success(
          `Updated ${color} ${size} balloons quantity to ${newQuantity} (${changeText})`
        )
      }

      onUpdate()
      setHasChanged(false)
    } catch (error) {
      console.error('Unexpected error updating inventory:', error)
      toast.error('An unexpected error occurred while updating inventory')
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
        {isUpdating ? "Updating..." : "Update"}
      </Button>
    </form>
  )
}