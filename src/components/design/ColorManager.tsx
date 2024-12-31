import { useState, useEffect } from "react"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { ColorGrid } from "./ColorGrid"
import { ColorSelectionStatus } from "./ColorSelectionStatus"
import { DEFAULT_COLORS, REQUIRED_COLORS } from "@/constants/colors"

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
  const [availableColors, setAvailableColors] = useState<string[]>(DEFAULT_COLORS)
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  useEffect(() => {
    onColorsSelected(selectedColors)
  }, [selectedColors, onColorsSelected])

  const handleColorSelect = (color: string) => {
    if (disabled) return

    setSelectedColors(prevColors => {
      if (prevColors.includes(color)) {
        return prevColors.filter(c => c !== color)
      }
      
      if (prevColors.length < REQUIRED_COLORS) {
        return [...prevColors, color]
      }
      
      toast.error(`Please select exactly ${REQUIRED_COLORS} colors`)
      return prevColors
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
        <ColorSelectionStatus
          selectedCount={selectedColors.length}
          requiredColors={REQUIRED_COLORS}
        />
      </CardContent>
    </>
  )
}