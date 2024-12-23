import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DimensionsInputProps {
  length: string
  onLengthChange: (value: string) => void
}

export const DimensionsInput = ({
  length,
  onLengthChange,
}: DimensionsInputProps) => {
  return (
    <div className="space-y-2">
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
    </div>
  )
}