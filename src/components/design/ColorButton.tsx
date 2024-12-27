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
      <span className="text-sm">{color}</span>
    </Button>
  )
}

export const ColorButton = memo(ColorButtonComponent)