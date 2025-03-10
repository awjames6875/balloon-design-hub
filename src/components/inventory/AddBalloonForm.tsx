
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addNewBalloonType } from "@/services/inventoryOperations"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { BalloonFormFields } from "./BalloonFormFields"
import { useColorSuggestions } from "./useColorSuggestions"

interface AddBalloonFormProps {
  onBalloonAdded: () => void
}

export const AddBalloonForm = ({ onBalloonAdded }: AddBalloonFormProps) => {
  const [formValues, setFormValues] = useState({
    color: "",
    size: "",
    quantity: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { color, resetColor, findStandardizedColor } = useColorSuggestions()

  const handleFieldsChange = (fields: { color: string; size: string; quantity: string }) => {
    setFormValues(fields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validate inputs
      if (!color || !color.trim()) {
        toast.error("Please enter a color name")
        setIsSubmitting(false)
        return
      }

      if (!formValues.size.trim()) {
        toast.error("Please select a balloon size")
        setIsSubmitting(false)
        return
      }

      if (!formValues.quantity.trim() || parseInt(formValues.quantity) < 0) {
        toast.error("Please enter a valid quantity")
        setIsSubmitting(false)
        return
      }

      // Size is already standardized from the dropdown
      console.log(`Adding new balloon: ${color} ${formValues.size} - ${formValues.quantity}`)
      
      // Standardize color name format
      const standardizedColor = findStandardizedColor()
      
      // Use the standardized color or fall back to the current color if no match found
      const finalColor = standardizedColor || color;

      const success = await addNewBalloonType(
        finalColor,
        formValues.size,
        parseInt(formValues.quantity)
      )

      if (success) {
        // Reset form
        setFormValues({
          color: "",
          size: "",
          quantity: ""
        })
        resetColor() // Reset the color in the useColorSuggestions hook
        
        // Notify success
        toast.success(`Added ${formValues.quantity} ${finalColor} ${formValues.size} balloons to inventory`)
        
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
      <BalloonFormFields 
        isSubmitting={isSubmitting}
        onFieldsChange={handleFieldsChange}
      />
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
