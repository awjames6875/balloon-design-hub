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
    "Red",
    "Orange",
    "Yellow",
    "Green",
    "Blue",
    "Purple",
    "Pink",
    "White",
    "Black",
    "Silver",
    "Gold",
    "Neutral Gray",
    "Primary Purple",
    "Secondary Purple",
    "Tertiary Purple",
    "Dark Purple",
    "Light Purple",
    "Soft Green",
    "Soft Yellow",
    "Soft Orange",
    "Soft Purple",
    "Soft Pink",
    "Soft Peach",
    "Soft Blue",
    "Soft Gray",
    "Vivid Purple",
    "Magenta Pink",
    "Bright Orange",
    "Ocean Blue"
  ], [])

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

  useEffect(() => {
    onColorsSelected(selectedColors)
  }, [selectedColors, onColorsSelected])

  const handleColorSelect = (color: string) => {
    if (disabled) return

    setSelectedColors(prevColors => {
      let newColors: string[]
      
      if (prevColors.includes(color)) {
        newColors = prevColors.filter(c => c !== color)
      } else if (prevColors.length < REQUIRED_COLORS) {
        newColors = [...prevColors, color]
      } else {
        toast.error(`Please select exactly ${REQUIRED_COLORS} colors`)
        return prevColors
      }
      
      return newColors
    })
  }

  return (
    <>
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
    </>
  )
}