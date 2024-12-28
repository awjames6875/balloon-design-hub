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
    if (!imagePath) {
      console.log('No image path provided, using default colors')
      return getDefaultColors()
    }

    // Call the analyze-design edge function
    const { data, error } = await supabase.functions.invoke('analyze-design', {
      body: { imageUrl: imagePath }
    })

    if (error) {
      console.error('Error analyzing image:', error)
      toast.error('Failed to analyze image colors')
      return getDefaultColors()
    }

    if (data?.colors && Array.isArray(data.colors)) {
      console.log("Detected colors:", data.colors)
      return data.colors
    }

    console.log("No colors detected, using defaults")
    return getDefaultColors()
  } catch (error) {
    console.error('Error in analyzeImageColors:', error)
    toast.error('Failed to analyze image colors')
    return getDefaultColors()
  }
}

const getDefaultColors = (): string[] => {
  return [
    "#FF0000", // Red
    "#FFA500", // Orange
    "#FFFF00", // Yellow
    "#008000", // Green
    "#0000FF", // Blue
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#FFFFFF", // White
    "#000000"  // Black
  ]
}