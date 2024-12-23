import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
    <div className="grid md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="width">Width (ft)</Label>
        <Input
          id="width"
          type="number"
          value={width}
          onChange={(e) => onWidthChange(e.target.value)}
          placeholder="Enter width"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="height">Height (ft)</Label>
        <Input
          id="height"
          type="number"
          value={height}
          onChange={(e) => onHeightChange(e.target.value)}
          placeholder="Enter height"
        />
      </div>
    </div>
  )
}