import { useState, useEffect, useMemo } from "react"
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
  const defaultColors = useMemo(() => [
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
  ], []);

  const [availableColors, setAvailableColors] = useState<string[]>(defaultColors)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const MAX_COLORS = 4

  // Effect to handle image color analysis
  useEffect(() => {
    const fetchColors = async () => {
      if (designImage) {
        try {
          const detectedColors = await analyzeImageColors(designImage)
          if (detectedColors && detectedColors.length > 0) {
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

    // Update local state first
    setSelectedColors(prevColors => {
      // If color is already selected, remove it
      if (prevColors.includes(color)) {
        const newColors = prevColors.filter(c => c !== color)
        onColorsSelected(newColors) // Notify parent after state update
        return newColors
      }
      
      // Check if we're at the maximum colors limit
      if (prevColors.length >= MAX_COLORS) {
        toast.error(`Maximum ${MAX_COLORS} colors can be selected`)
        return prevColors
      }
      
      // Add the new color
      const newColors = [...prevColors, color]
      onColorsSelected(newColors) // Notify parent after state update
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