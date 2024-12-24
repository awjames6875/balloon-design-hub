import { useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ColorManagerProps {
  designImage: string | null
  onColorsSelected: (colors: string[]) => void
}

export const ColorManager = ({ designImage, onColorsSelected }: ColorManagerProps) => {
  const [availableColors, setAvailableColors] = useState<string[]>([
    "#FF0000", // Red
    "#FFA500", // Orange
    "#FFFF00", // Yellow
    "#008000", // Green
    "#0000FF", // Blue
    "#800080", // Purple
    "#FFC0CB", // Pink
    "#FFFFFF", // White
    "#000000", // Black
    "#C0C0C0", // Silver
    "#FFD700", // Gold
  ])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  useEffect(() => {
    if (designImage) {
      analyzeImageColors(designImage)
    }
  }, [designImage])

  const analyzeImageColors = async (imagePath: string) => {
    try {
      console.log("Analyzing colors for image:", imagePath)
      const { data, error } = await supabase
        .from('design_image_analysis')
        .select('detected_colors')
        .eq('image_path', imagePath)
        .single()

      if (error) throw error

      if (data?.detected_colors) {
        console.log("Detected colors:", data.detected_colors)
        // Ensure detected_colors is treated as a string array
        const detectedColors = Array.isArray(data.detected_colors) 
          ? data.detected_colors as string[]
          : []
        
        setAvailableColors(prevColors => {
          // Combine detected colors with standard colors, removing duplicates
          const allColors = [...new Set([...detectedColors, ...prevColors])]
          return allColors
        })
      }
    } catch (error) {
      console.error('Error fetching color analysis:', error)
      toast.error("Failed to analyze image colors")
    }
  }

  const handleColorSelect = (color: string) => {
    setSelectedColors(prev => {
      const newColors = prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
      
      onColorsSelected(newColors)
      return newColors
    })
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Select Balloon Colors</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {availableColors.map((color) => (
            <Button
              key={color}
              variant={selectedColors.includes(color) ? "default" : "outline"}
              className="w-full flex items-center justify-start gap-2 p-4"
              onClick={() => handleColorSelect(color)}
            >
              <div
                className="w-6 h-6 rounded-full border border-gray-300"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm">
                {color === "#FFFFFF" ? "White" :
                 color === "#000000" ? "Black" :
                 color === "#FF0000" ? "Red" :
                 color === "#FFA500" ? "Orange" :
                 color === "#FFFF00" ? "Yellow" :
                 color === "#008000" ? "Green" :
                 color === "#0000FF" ? "Blue" :
                 color === "#800080" ? "Purple" :
                 color === "#FFC0CB" ? "Pink" :
                 color === "#C0C0C0" ? "Silver" :
                 color === "#FFD700" ? "Gold" :
                 color}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}