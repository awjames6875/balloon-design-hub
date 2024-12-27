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
      // Validate input
      const newQuantity = parseInt(quantity)
      
      if (isNaN(newQuantity)) {
        toast.error('Please enter a valid number', {
          description: 'The quantity must be a numeric value.'
        })
        return
      }

      if (newQuantity < 0) {
        toast.error('Invalid Quantity', {
          description: 'Quantity cannot be a negative number.'
        })
        return
      }

      // Check if record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('balloon_inventory')
        .select('id, quantity')
        .eq('color', color)
        .eq('size', size)
        .maybeSingle()

      if (checkError) {
        console.error('Error checking inventory record:', checkError)
        toast.error('Inventory Check Failed', {
          description: `Unable to verify ${color} ${size} balloon inventory.`
        })
        return
      }

      // Determine if we're creating a new record or updating an existing one
      if (!existingRecord) {
        // Create new record
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
          toast.error('Record Creation Failed', {
            description: `Could not create inventory record for ${color} ${size} balloons.`
          })
          return
        }

        toast.success('New Inventory Record Created', {
          description: `Added ${newQuantity} ${color} ${size} balloons to inventory.`
        })
      } else {
        // Update existing record
        const { error: updateError } = await supabase
          .from('balloon_inventory')
          .update({ 
            quantity: newQuantity,
            updated_at: new Date().toISOString()
          })
          .eq('color', color)
          .eq('size', size)

        if (updateError) {
          console.error('Error updating inventory:', updateError)
          toast.error('Inventory Update Failed', {
            description: `Could not update ${color} ${size} balloon quantity.`
          })
          return
        }

        const changeAmount = newQuantity - existingRecord.quantity
        const changeType = changeAmount > 0 ? 'increased' : 'decreased'
        
        toast.success('Inventory Updated', {
          description: `${color} ${size} balloons ${changeType} by ${Math.abs(changeAmount)}. New quantity: ${newQuantity}.`
        })
      }

      // Trigger parent component update and reset form state
      onUpdate()
      setHasChanged(false)
    } catch (error) {
      console.error('Unexpected inventory update error:', error)
      toast.error('Unexpected Error', {
        description: 'An unexpected problem occurred while updating inventory.'
      })
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
          disabled={isUpdating}
        />
      </div>
      <Button 
        type="submit" 
        disabled={isUpdating || !hasChanged}
        variant={hasChanged ? "destructive" : "default"}
      >
        {isUpdating ? "Updating..." : "Update"}
      </Button>
    </form>
  )
}