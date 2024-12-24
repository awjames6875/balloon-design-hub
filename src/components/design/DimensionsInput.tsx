import { memo } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface DimensionsInputProps {
  length: string
  onLengthChange: (value: string) => void
  disabled?: boolean
}

const DimensionsInputComponent = ({
  length,
  onLengthChange,
  disabled = false,
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
          disabled={disabled}
        />
      </div>
    </div>
  )
}

export const DimensionsInput = memo(DimensionsInputComponent)