import { ColorButton } from "./ColorButton"

interface ColorGridProps {
  availableColors: string[]
  selectedColors: string[]
  onColorSelect: (color: string) => void
}

export const ColorGrid = ({
  availableColors,
  selectedColors,
  onColorSelect,
}: ColorGridProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {availableColors.map((color) => (
        <ColorButton
          key={color}
          color={color}
          isSelected={selectedColors.includes(color)}
          onSelect={onColorSelect}
        />
      ))}
    </div>
  )
}