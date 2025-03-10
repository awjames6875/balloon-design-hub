
import { normalizeColorName } from "@/components/design/inventory/inventoryService"

interface SuggestionColor {
  name: string;
  display_name: string;
}

interface ColorSuggestionsProps {
  suggestions: SuggestionColor[];
  visible: boolean;
  onSelect: (suggestion: string) => void;
}

export const ColorSuggestions = ({ 
  suggestions, 
  visible, 
  onSelect 
}: ColorSuggestionsProps) => {
  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
      {suggestions.map((suggestion, index) => (
        <div 
          key={index}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSelect(suggestion.display_name)}
        >
          {suggestion.display_name}
        </div>
      ))}
    </div>
  )
}

export type { SuggestionColor }
