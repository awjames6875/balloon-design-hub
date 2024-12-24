import { Button } from "@/components/ui/button"

interface ColorButtonProps {
  color: string
  isSelected: boolean
  onSelect: (color: string) => void
  disabled?: boolean
}

export const ColorButton = ({ 
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
    }
    return colorMap[hexColor.toUpperCase()] || hexColor
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