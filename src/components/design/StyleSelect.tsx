import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface StyleSelectProps {
  value: string
  onValueChange: (value: string) => void
  styles: { style_name: string }[] | undefined
  isLoading: boolean
}

export const StyleSelect = ({ value, onValueChange, styles, isLoading }: StyleSelectProps) => {
  return (
    <div className="space-y-2">
      <Label>Balloon Style</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select balloon style" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border shadow-lg">
          {isLoading ? (
            <SelectItem value="loading">Loading styles...</SelectItem>
          ) : (
            styles?.map((item) => (
              <SelectItem 
                key={item.style_name} 
                value={item.style_name}
                className="hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {item.style_name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  )
}