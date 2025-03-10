
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addNewBalloonType } from "@/services/inventoryOperations"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { BalloonFormFields } from "./BalloonFormFields"
import { useColorInput } from "./useColorInput"

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
  const colorHook = useColorInput()
  
  const handleFieldsChange = (fields: { color: string; size: string; quantity: string }) => {
    console.log("Form fields changing to:", fields)
    setFormValues(fields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit button clicked with values:", formValues)
    
    // Validate all inputs before proceeding
    if (!formValues.color || formValues.color.trim() === "") {
      toast.error("Please enter a color name")
      return
    }

    if (!formValues.size || formValues.size === "") {
      toast.error("Please select a balloon size")
      return
    }

    if (!formValues.quantity || parseInt(formValues.quantity) < 1) {
      toast.error("Please enter a valid quantity (minimum 1)")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      console.log("Submitting form with values:", formValues)
      
      // Standardize color name if possible
      const standardizedColor = colorHook.findStandardizedColor()
      
      // Use the standardized color or fall back to the current color if no match found
      const finalColor = standardizedColor || formValues.color;
      console.log("Using final color:", finalColor)

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
        colorHook.resetColor() // Reset the color in the color hook
        
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
