import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ColorSelectProps {
  selectedColors: string[]
  onColorsChange: (colors: string[]) => void
}

export const ColorSelect = ({ selectedColors, onColorsChange }: ColorSelectProps) => {
  const balloonColors = ["Orange", "Wild Berry", "Golden Rod", "Teal"]

  const handleColorSelect = (color: string) => {
    if (selectedColors.includes(color)) {
      onColorsChange(selectedColors.filter((c) => c !== color))
    } else {
      onColorsChange([...selectedColors, color])
    }
  }

  const removeColor = (colorToRemove: string) => {
    onColorsChange(selectedColors.filter((color) => color !== colorToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label>Balloon Colors</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-muted-foreground cursor-help">
              (Click multiple colors to select)
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click multiple colors to select them</p>
          </TooltipContent>
        </Tooltip>
      </div>

      <Select onValueChange={handleColorSelect}>
        <SelectTrigger className="w-full bg-background border-input">
          <SelectValue placeholder="Select colors" />
        </SelectTrigger>
        <SelectContent className="bg-popover border shadow-md">
          {balloonColors.map((color) => (
            <SelectItem
              key={color}
              value={color}
              className={`${
                selectedColors.includes(color) ? "bg-accent" : "bg-background hover:bg-accent"
              }`}
            >
              {color}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedColors.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedColors.map((color) => (
            <div
              key={color}
              className="flex items-center gap-1 bg-accent rounded-full px-3 py-1"
            >
              <span className="text-sm">{color}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => removeColor(color)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}