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
  const getColorName = (hexColor: string) => {
    const colorMap: Record<string, string> = {
      "#FFFFFF": "White",
      "#000000": "Black",
      "#FF0000": "Red",
      "#FFA500": "Orange",
      "#FFFF00": "Yellow",
      "#008000": "Green",
      "#0000FF": "Blue",
      "#800080": "Purple",
      "#FFC0CB": "Pink",
      "#C0C0C0": "Silver",
      "#FFD700": "Gold",
      "#8E9196": "Neutral Gray",
      "#9b87f5": "Primary Purple",
      "#7E69AB": "Secondary Purple",
      "#6E59A5": "Tertiary Purple",
      "#1A1F2C": "Dark Purple",
      "#D6BCFA": "Light Purple",
      "#F2FCE2": "Soft Green",
      "#FEF7CD": "Soft Yellow",
      "#FEC6A1": "Soft Orange",
      "#E5DEFF": "Soft Purple",
      "#FFDEE2": "Soft Pink",
      "#FDE1D3": "Soft Peach",
      "#D3E4FD": "Soft Blue",
      "#F1F0FB": "Soft Gray",
      "#8B5CF6": "Vivid Purple",
      "#D946EF": "Magenta Pink",
      "#F97316": "Bright Orange",
      "#0EA5E9": "Ocean Blue",
    }
    return colorMap[hexColor.toUpperCase()] || "Custom Color"
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
        style={{ backgroundColor: color }}
      />
      <span className="text-sm">{getColorName(color)}</span>
    </Button>
  )
}

export const ColorButton = memo(ColorButtonComponent)