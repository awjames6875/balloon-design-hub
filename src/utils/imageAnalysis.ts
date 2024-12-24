import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

export const uploadDesignImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `design_${Date.now()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('design_images')
      .upload(fileName, file)

    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      toast.error('Failed to upload design image')
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('design_images')
      .getPublicUrl(uploadData.path)

    return publicUrl
  } catch (error) {
    console.error('Error in uploadDesignImage:', error)
    toast.error('Failed to upload image')
    return null
  }
}

export const analyzeImageColors = async (imagePath: string): Promise<string[]> => {
  try {
    // If the image is a data URL, return default colors
    if (imagePath.startsWith('data:')) {
      return [
        "#FF0000", // Red
        "#FFA500", // Orange
        "#FFFF00", // Yellow
        "#008000", // Green
        "#0000FF", // Blue
        "#800080", // Purple
        "#FFC0CB", // Pink
        "#FFFFFF", // White
        "#000000", // Black
      ]
    }

    const { data, error } = await supabase
      .from('design_image_analysis')
      .select('detected_colors')
      .eq('image_path', imagePath)
      .single()

    if (error) {
      console.error('Error fetching color analysis:', error)
      // Return default colors instead of throwing error
      return [
        "#FF0000", // Red
        "#FFA500", // Orange
        "#FFFF00", // Yellow
        "#008000", // Green
        "#0000FF", // Blue
        "#800080", // Purple
        "#FFC0CB", // Pink
        "#FFFFFF", // White
        "#000000", // Black
      ]
    }

    if (data?.detected_colors) {
      console.log("Detected colors:", data.detected_colors)
      // Explicitly cast the detected_colors to string array and filter out non-string values
      return (data.detected_colors as any[])
        .filter((color): color is string => typeof color === 'string')
    }

    return []
  } catch (error) {
    console.error('Error in analyzeImageColors:', error)
    // Return default colors instead of throwing error
    return [
      "#FF0000", // Red
      "#FFA500", // Orange
      "#FFFF00", // Yellow
      "#008000", // Green
      "#0000FF", // Blue
      "#800080", // Purple
      "#FFC0CB", // Pink
      "#FFFFFF", // White
      "#000000", // Black
    ]
  }
}