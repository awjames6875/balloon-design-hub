
import { supabase } from "@/integrations/supabase/client"
import { BalloonType } from "@/types/inventory"

/**
 * Fetches all balloon types from the database
 * @returns Array of balloon types
 */
export const getBalloonTypes = async (): Promise<BalloonType[]> => {
  try {
    console.log("Fetching balloon types...");
    
    const { data, error } = await supabase
      .from("balloon_inventory")
      .select("*")
      .order("color")
      .order("size");
    
    if (error) {
      console.error("Error fetching balloon types:", error);
      throw new Error("Failed to fetch balloon types");
    }
    
    console.log("Successfully fetched balloon types:", data);
    return data as BalloonType[];
  } catch (error) {
    console.error("Unexpected error in getBalloonTypes:", error);
    throw error;
  }
};
