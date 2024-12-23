import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DimensionsInputProps {
  width: string
  height: string
  onWidthChange: (value: string) => void
  onHeightChange: (value: string) => void
}

export const DimensionsInput = ({
  width,
  height,
  onWidthChange,
  onHeightChange,
}: DimensionsInputProps) => {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="height">Length (ft)</Label>
          <Input
            id="height"
            type="number"
            min="0"
            value={height}
            onChange={(e) => onHeightChange(e.target.value)}
            placeholder="Enter length"
          />
        </div>
      </div>
    </div>
  )
}