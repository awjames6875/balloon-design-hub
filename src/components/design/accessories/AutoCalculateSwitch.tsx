import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface AutoCalculateSwitchProps {
  autoCalculate: boolean
  onAutoCalculateChange: (checked: boolean) => void
}

export const AutoCalculateSwitch = ({
  autoCalculate,
  onAutoCalculateChange,
}: AutoCalculateSwitchProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="auto-calculate"
        checked={autoCalculate}
        onCheckedChange={onAutoCalculateChange}
      />
      <Label htmlFor="auto-calculate">
        Auto-calculate accessories based on extra clusters
      </Label>
    </div>
  )
}