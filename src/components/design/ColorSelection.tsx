import { Button } from "@/components/ui/button"

interface ColorSelectionProps {
  detectedColors: string[]
  selectedColors: string[]
  onColorSelect: (color: string) => void
}

export const ColorSelection = ({
  detectedColors,
  selectedColors,
  onColorSelect,
}: ColorSelectionProps) => {
  if (detectedColors.length === 0) return null

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Select Colors</label>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {detectedColors.map((color) => (
          <Button
            key={color}
            type="button"
            variant={selectedColors.includes(color) ? "default" : "outline"}
            className="flex items-center gap-2"
            onClick={() => onColorSelect(color)}
          >
            <div
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}