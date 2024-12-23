import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ColorSelectProps {
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
}

export const ColorSelect = ({ selectedColors, onColorsChange }: ColorSelectProps) => {
  const balloonColors = ["Orange", "Wild Berry", "Golden Rod", "Teal"]

  const toggleColor = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter((c) => c !== color))
    } else {
      onColorsChange([...selectedColors, color])
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Balloon Colors</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-muted-foreground cursor-help">
              (Click colors to select multiple)
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click multiple colors to select them</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {balloonColors.map((color) => (
          <Button
            key={color}
            variant={selectedColors.includes(color) ? "default" : "outline"}
            onClick={() => toggleColor(color)}
            className="w-full justify-center"
          >
            {color}
          </Button>
        ))}
      </div>

      {selectedColors.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Selected: {selectedColors.join(", ")}
        </div>
      )}
    </div>
  )
}