import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DimensionsInputProps {
  length: string
  width: string
  onLengthChange: (value: string) => void
  onWidthChange: (value: string) => void
}

export const DimensionsInput = ({
  length,
  width,
  onLengthChange,
  onWidthChange,
}: DimensionsInputProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="length">Length (ft)</Label>
          <Input
            id="length"
            type="number"
            min="0"
            value={length}
            onChange={(e) => onLengthChange(e.target.value)}
            placeholder="Enter length"
          />
        </div>
        <div>
          <Label htmlFor="width">Width (ft)</Label>
          <Input
            id="width"
            type="number"
            min="0"
            value={width}
            onChange={(e) => onWidthChange(e.target.value)}
            placeholder="Enter width"
          />
        </div>
      </div>
    </div>
  )
}