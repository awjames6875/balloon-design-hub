
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { BalloonType } from '../types/inventory'

/**
 * Validates if a color string is valid
 * Modified to be more lenient - accepts any non-empty string
 * @param color The color string to validate
 * @returns true if the color is valid, false otherwise
 */
export const validateColor = (color: string): boolean => {
  // Accept any non-empty string as a valid color
  return color !== undefined && color.trim() !== '';
};

/**
 * Validates if a balloon size is valid
 * @param size The size string to validate
 * @returns true if the size is valid, false otherwise
 */
export const validateSize = (size: string): boolean => {
  return size !== undefined && size.trim() !== '';
};

/**
 * Validates if a quantity is valid
 * @param quantity The quantity to validate
 * @returns true if the quantity is valid, false otherwise
 */
export const validateQuantity = (quantity: number): boolean => {
  return !isNaN(quantity) && quantity >= 0;
};

/**
 * Validates a balloon type object
 * @param balloonType The balloon type object to validate
 * @returns An object with validation results
 */
export const validateBalloonType = (balloonType: Partial<BalloonType>) => {
  const errors: Record<string, string> = {};
  
  if (!balloonType.color || !validateColor(balloonType.color)) {
    errors.color = 'Please enter a valid color name';
  }
  
  if (!balloonType.size || !validateSize(balloonType.size)) {
    errors.size = 'Please enter a valid size';
  }
  
  if (balloonType.quantity === undefined || !validateQuantity(balloonType.quantity)) {
    errors.quantity = 'Please enter a valid quantity';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates inventory update inputs
 * @param color The color string
 * @param size The size string
 * @param quantity The quantity
 * @returns true if all inputs are valid, false otherwise
 */
export const validateInventoryUpdate = async (
  color: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  console.log("Validating inventory update:", { color, size, quantity })
  
  // Simplified validation that only checks if values are present
  if (!color || color.trim() === '') {
    console.error("Color validation failed - empty value:", color)
    toast.error("Color name cannot be empty")
    return false
  }

  if (!size || size.trim() === '') {
    console.error("Size validation failed - empty value")
    toast.error("Please select a balloon size")
    return false
  }

  if (isNaN(quantity) || quantity < 0) {
    console.error("Quantity validation failed:", quantity)
    toast.error("Please enter a valid quantity")
    return false
  }

  // Always consider any non-empty color string as valid
  console.log("Validation successful for:", { color, size, quantity })
  return true
}

export const checkExistingBalloon = async (
  color: string,
  size: string
) => {
  if (!color || !size) {
    console.error("Cannot check for existing balloon with empty color or size")
    return null
  }
  
  const cleanColor = color.trim();
  const cleanSize = size.trim();
  
  console.log("Checking for existing balloon:", { color: cleanColor, size: cleanSize })
  
  const { data, error } = await supabase
    .from("balloon_inventory")
    .select("*")
    .eq("color", cleanColor)
    .eq("size", cleanSize)
    .maybeSingle()

  if (error) {
    console.error("Error checking existing balloon:", error)
    return null
  }
  
  console.log("Existing balloon check result:", data)
  return data
}

// Subscribe to realtime updates for the balloon_inventory table
export const enableRealtimeForInventory = async (): Promise<boolean> => {
  try {
    // Create a channel for realtime updates
    const channel = supabase
      .channel('inventory-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'balloon_inventory'
        },
        (payload) => {
          console.log('Realtime update received:', payload)
        }
      )
      .subscribe()
    
    if (channel) {
      console.log("Realtime enabled for balloon_inventory table")
      return true
    } else {
      console.error("Failed to enable realtime for balloon_inventory")
      return false
    }
  } catch (error) {
    console.error("Error in enableRealtimeForInventory:", error)
    return false
  }
}
