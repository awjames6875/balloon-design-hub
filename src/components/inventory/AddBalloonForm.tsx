
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addNewBalloonType } from "@/services/inventoryOperations"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { BalloonFormFields } from "./BalloonFormFields"

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
  
  const handleFieldsChange = (fields: { color: string; size: string; quantity: string }) => {
    setFormValues(fields)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit button clicked with values:", formValues)
    
    // Basic validation
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
      
      const cleanedColor = formValues.color.trim()
      console.log("Using final color:", cleanedColor)

      // Add the balloon type
      const success = await addNewBalloonType(
        cleanedColor,
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
