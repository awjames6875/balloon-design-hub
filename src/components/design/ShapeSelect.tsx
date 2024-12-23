import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface ShapeSelectProps {
  value: string
  onValueChange: (value: string) => void
}

export const ShapeSelect = ({ value, onValueChange }: ShapeSelectProps) => {
  const shapes = ["Straight", "Curved", "S-Shaped", "Cluster"]

  return (
    <div className="space-y-2">
      <Label>Shape</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select balloon shape" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
          {shapes.map((shape) => (
            <SelectItem
              key={shape}
              value={shape}
              className="hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {shape}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}