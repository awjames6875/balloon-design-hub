import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const validateInventoryUpdate = async (
  color: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  // Validate input
  if (!color.trim() || !size.trim()) {
    toast.error("Missing information", {
      description: "Please fill in both color and size fields."
    })
    return false
  }

  if (isNaN(quantity) || quantity < 0) {
    toast.error("Invalid quantity", {
      description: "Please enter a valid number greater than or equal to 0."
    })
    return false
  }

  return true
}

export const checkExistingBalloon = async (color: string, size: string) => {
  const { data, error } = await supabase
    .from("balloon_inventory")
    .select("id, quantity")
    .eq("color", color.trim())
    .eq("size", size.trim())
    .maybeSingle()

  if (error) {
    console.error("Error checking for existing balloon:", error)
    toast.error("Database error", {
      description: "Failed to check for existing balloon type."
    })
    return null
  }

  return data
}