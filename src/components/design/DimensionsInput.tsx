import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DimensionsInputProps {
  width: string
  height: string
  onWidthChange: (value: string) => void
  onHeightChange: (value: string) => void
}

export const DimensionsInput = ({
  width,
  onWidthChange,
}: DimensionsInputProps) => {
  const sizeOptions = ["2", "3", "4", "6", "8", "10", "12", "14", "16"]

  return (
    <div className="space-y-2">
      <Label htmlFor="width">Garland Size (ft)</Label>
      <Select value={width} onValueChange={onWidthChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
          {sizeOptions.map((size) => (
            <SelectItem
              key={size}
              value={size}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {size} ft
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}