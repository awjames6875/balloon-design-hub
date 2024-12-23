import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>Balloon Colors</Label>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-muted-foreground cursor-help">
              (Click multiple colors to select them)
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>You can select multiple colors from the dropdown</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            role="combobox"
          >
            {selectedColors.length === 0
              ? "Select colors"
              : selectedColors.join(", ")}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] bg-white dark:bg-gray-800 border shadow-lg">
          {balloonColors.map((color) => (
            <DropdownMenuCheckboxItem
              key={color}
              checked={selectedColors.includes(color)}
              onCheckedChange={(checked) => {
                onColorsChange(
                  checked
                    ? [...selectedColors, color]
                    : selectedColors.filter((c) => c !== color)
                )
              }}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {color}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {selectedColors.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Selected: {selectedColors.join(", ")}
        </div>
      )}
    </div>
  )
}