
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { addNewBalloonType } from "@/services/inventoryOperations"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import BalloonFormFields from "./BalloonFormFields"
import { BalloonType } from "@/types/inventory"

interface AddBalloonFormProps {
  onBalloonAdded: () => void
}

export const AddBalloonForm = ({ onBalloonAdded }: AddBalloonFormProps) => {
  const [formValues, setFormValues] = useState<Partial<BalloonType>>({
    color: "",
    size: "",
    quantity: 0
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const handleFormChange = (values: Partial<BalloonType>) => {
    setFormValues(values)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Submit button clicked with values:", formValues)
    
    // Only validate that fields are not empty
    if (!formValues.color || formValues.color.trim() === "") {
      toast.error("Please enter a color name")
      return
    }

    if (!formValues.size || formValues.size === "") {
      toast.error("Please select a balloon size")
      return
    }

    const quantity = formValues.quantity || 0
    if (quantity < 0) {
      toast.error("Please enter a valid quantity (minimum 0)")
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
        quantity
      )

      if (success) {
        // Reset form
        setFormValues({
          color: "",
          size: "",
          quantity: 0
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
        initialValues={formValues}
        onChange={handleFormChange}
      />
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full md:w-auto mt-4"
      >
        {isSubmitting ? "Adding..." : "Add Balloon Type"}
      </Button>
    </form>
  )
}
