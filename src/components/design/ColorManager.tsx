import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { analyzeImageColors } from "@/utils/imageAnalysis"
import { toast } from "sonner"

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
  const MAX_COLORS = 4

  useEffect(() => {
    const fetchColors = async () => {
      if (designImage) {
        const detectedColors = await analyzeImageColors(designImage)
        setAvailableColors(prevColors => {
          const allColors = [...new Set([...detectedColors, ...prevColors])]
          return allColors
        })
      }
    }

    fetchColors()
  }, [designImage])

  const handleColorSelect = (color: string) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        // Remove color if already selected
        const newColors = prev.filter(c => c !== color)
        onColorsSelected(newColors)
        return newColors
      } else {
        // Add color if under limit
        if (prev.length >= MAX_COLORS) {
          toast.error(`Maximum ${MAX_COLORS} colors can be selected`)
          return prev
        }
        const newColors = [...prev, color]
        onColorsSelected(newColors)
        return newColors
      }
    })
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Select Balloon Colors (up to 4)</CardTitle>
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
        <p className="text-sm text-muted-foreground mt-2">
          Selected colors: {selectedColors.length} / {MAX_COLORS}
        </p>
      </CardContent>
    </Card>
  )
}