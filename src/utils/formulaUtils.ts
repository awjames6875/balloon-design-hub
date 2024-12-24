import { supabase } from "@/integrations/supabase/client"

export const getFormulaForLength = async (length: number) => {
  const { data, error } = await supabase
    .from("balloonformula")
    .select("*")
    .eq("size_ft", length)
    .single()

  if (error) {
    console.error("Error fetching formula:", error)
    throw error
  }

  return data
}