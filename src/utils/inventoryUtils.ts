import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface InventoryUpdate {
  color: string;
  size: string;
  quantity: number;
}

export const updateInventoryQuantities = async (updates: InventoryUpdate[]): Promise<boolean> => {
  for (const update of updates) {
    const { data, error } = await supabase
      .from("balloon_inventory")
      .select("quantity")
      .eq("color", update.color)
      .eq("size", update.size)
      .single();

    if (error) {
      console.error("Error checking inventory:", error);
      toast.error(`Failed to check inventory for ${update.color} ${update.size}`);
      return false;
    }

    // Check if we have enough inventory before updating
    if (data.quantity < update.quantity) {
      toast.error(`Insufficient inventory for ${update.color} ${update.size}`);
      return false;
    }

    // Update the quantity
    const { error: updateError } = await supabase
      .from("balloon_inventory")
      .update({ quantity: data.quantity - update.quantity })
      .eq("color", update.color)
      .eq("size", update.size);

    if (updateError) {
      console.error("Error updating inventory:", updateError);
      toast.error(`Failed to update inventory for ${update.color} ${update.size}`);
      return false;
    }
  }

  return true;
};