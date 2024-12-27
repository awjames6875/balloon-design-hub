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

    const { data, error } = await supabase
      .from('design_image_analysis')
      .select('detected_colors')
      .eq('image_path', imagePath)
      .maybeSingle()

    if (error) {
      console.error('Error fetching color analysis:', error)
      toast.error('Failed to analyze image colors')
      return getDefaultColors()
    }

    if (data?.detected_colors) {
      console.log("Detected colors:", data.detected_colors)
      return (data.detected_colors as any[])
        .filter((color): color is string => typeof color === 'string')
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
    "Red",
    "Orange", 
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
    "White",
    "Black"
  ]
}