import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { analyzeImageColors } from "@/utils/imageAnalysis"
import { toast } from "sonner"
import { ColorGrid } from "./ColorGrid"

interface ColorManagerProps {
  designImage: string | null
  onColorsSelected: (colors: string[]) => void
  disabled?: boolean
}

export const ColorManager = ({ 
  designImage, 
  onColorsSelected,
  disabled = false 
}: ColorManagerProps) => {
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
  const MAX_COLORS = 4

  useEffect(() => {
    const fetchColors = async () => {
      if (designImage) {
        try {
          const detectedColors = await analyzeImageColors(designImage)
          if (detectedColors && detectedColors.length > 0) {
            console.log("Detected colors:", detectedColors)
            setAvailableColors(prevColors => {
              const allColors = [...new Set([...detectedColors, ...prevColors])]
              return allColors
            })
          }
        } catch (error) {
          console.error("Error analyzing colors:", error)
          toast.error("Failed to analyze image colors")
        }
      }
    }

    fetchColors()
  }, [designImage])

  const handleColorSelect = (color: string) => {
    if (disabled) return

    setSelectedColors(prevColors => {
      let newColors: string[]
      
      if (prevColors.includes(color)) {
        // Remove color if already selected
        newColors = prevColors.filter(c => c !== color)
      } else {
        // Add color if under limit
        if (prevColors.length >= MAX_COLORS) {
          toast.error(`Maximum ${MAX_COLORS} colors can be selected`)
          return prevColors
        }
        newColors = [...prevColors, color]
      }
      
      // Call the callback with the new colors immediately
      onColorsSelected(newColors)
      console.log("Selected colors in ColorManager:", newColors)
      return newColors
    })
  }

  return (
    <Card className={`mt-4 ${disabled ? 'opacity-50' : ''}`}>
      <CardHeader>
        <CardTitle>Select Balloon Colors (up to {MAX_COLORS})</CardTitle>
      </CardHeader>
      <CardContent>
        <ColorGrid
          availableColors={availableColors}
          selectedColors={selectedColors}
          onColorSelect={handleColorSelect}
          disabled={disabled}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Selected colors: {selectedColors.length} / {MAX_COLORS}
        </p>
      </CardContent>
    </Card>
  )
}