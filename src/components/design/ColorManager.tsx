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
    "#8E9196", // Neutral Gray
    "#9b87f5", // Primary Purple
    "#7E69AB", // Secondary Purple
    "#6E59A5", // Tertiary Purple
    "#1A1F2C", // Dark Purple
    "#D6BCFA", // Light Purple
    "#F2FCE2", // Soft Green
    "#FEF7CD", // Soft Yellow
    "#FEC6A1", // Soft Orange
    "#E5DEFF", // Soft Purple
    "#FFDEE2", // Soft Pink
    "#FDE1D3", // Soft Peach
    "#D3E4FD", // Soft Blue
    "#F1F0FB", // Soft Gray
    "#8B5CF6", // Vivid Purple
    "#D946EF", // Magenta Pink
    "#F97316", // Bright Orange
    "#0EA5E9", // Ocean Blue
  ], []);

  const [availableColors, setAvailableColors] = useState<string[]>(defaultColors)
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const REQUIRED_COLORS = 4

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

    setSelectedColors(prevColors => {
      let newColors: string[]
      
      // If color is already selected, remove it
      if (prevColors.includes(color)) {
        newColors = prevColors.filter(c => c !== color)
      } else if (prevColors.length < REQUIRED_COLORS) {
        // If we haven't reached the limit, add the color
        newColors = [...prevColors, color]
      } else {
        // If we're at the limit, show an error message
        toast.error(`Please select exactly ${REQUIRED_COLORS} colors`)
        return prevColors
      }
      
      // Just update the parent with the new colors, don't trigger form submission
      onColorsSelected(newColors)
      return newColors
    })
  }

  return (
    <Card className={`mt-4 ${disabled ? 'opacity-50' : ''}`}>
      <CardHeader>
        <CardTitle>Select Balloon Colors (exactly {REQUIRED_COLORS})</CardTitle>
      </CardHeader>
      <CardContent>
        <ColorGrid
          availableColors={availableColors}
          selectedColors={selectedColors}
          onColorSelect={handleColorSelect}
          disabled={disabled}
        />
        <p className="text-sm text-muted-foreground mt-2">
          Selected colors: {selectedColors.length} / {REQUIRED_COLORS}
          {selectedColors.length < REQUIRED_COLORS && (
            <span className="text-red-500 ml-2">
              Please select {REQUIRED_COLORS - selectedColors.length} more color{REQUIRED_COLORS - selectedColors.length !== 1 ? 's' : ''}
            </span>
          )}
        </p>
      </CardContent>
    </Card>
  )
}
