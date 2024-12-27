import { memo } from "react"
import { Button } from "@/components/ui/button"

interface ColorButtonProps {
  color: string
  isSelected: boolean
  onSelect: (color: string) => void
  disabled?: boolean
}

const ColorButtonComponent = ({ 
  color, 
  isSelected, 
  onSelect,
  disabled = false 
}: ColorButtonProps) => {
  const getBackgroundColor = (colorName: string) => {
    const colorMap: Record<string, string> = {
      "Red": "#FF0000",
      "Orange": "#FFA500",
      "Yellow": "#FFFF00",
      "Green": "#008000",
      "Blue": "#0000FF",
      "Purple": "#800080",
      "Pink": "#FFC0CB",
      "White": "#FFFFFF",
      "Black": "#000000",
      "Silver": "#C0C0C0",
      "Gold": "#FFD700",
      "Neutral Gray": "#8E9196",
      "Primary Purple": "#9b87f5",
      "Secondary Purple": "#7E69AB",
      "Tertiary Purple": "#6E59A5",
      "Dark Purple": "#1A1F2C",
      "Light Purple": "#D6BCFA",
      "Soft Green": "#F2FCE2",
      "Soft Yellow": "#FEF7CD",
      "Soft Orange": "#FEC6A1",
      "Soft Purple": "#E5DEFF",
      "Soft Pink": "#FFDEE2",
      "Soft Peach": "#FDE1D3",
      "Soft Blue": "#D3E4FD",
      "Soft Gray": "#F1F0FB",
      "Vivid Purple": "#8B5CF6",
      "Magenta Pink": "#D946EF",
      "Bright Orange": "#F97316",
      "Ocean Blue": "#0EA5E9",
    }
    return colorMap[colorName] || colorName
  }

  return (
    <Button
      variant={isSelected ? "default" : "outline"}
      className={`w-full flex items-center justify-start gap-2 p-4 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={() => !disabled && onSelect(color)}
      disabled={disabled}
    >
      <div
        className="w-6 h-6 rounded-full border border-gray-300"
        style={{ backgroundColor: getBackgroundColor(color) }}
      />
      <span className="text-sm">{color}</span>
    </Button>
  )
}

export const ColorButton = memo(ColorButtonComponent)