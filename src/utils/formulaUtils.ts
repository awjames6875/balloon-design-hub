import { supabase } from "@/integrations/supabase/client"

export const getFormulaForLength = async (length: number) => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", length)
    .order('id', { ascending: false })  // Get the most recent formula
    .limit(1)  // Only get one result
    .maybeSingle()  // Use maybeSingle instead of single to handle no results case

  if (error) {
    console.error("Error fetching formula:", error)
    throw error
  }

  if (!data) {
    const errorMessage = `No formula found for size ${length}ft`
    console.error(errorMessage)
    throw new Error(errorMessage)
  }

  return data
}