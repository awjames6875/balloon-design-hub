
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { normalizeColorName } from "@/components/design/inventory/utils/colorUtils"
import type { SuggestionColor } from "./ColorSuggestions"

export function useColorInput() {
  const [color, setColor] = useState("")
  const [colorSuggestions, setColorSuggestions] = useState<SuggestionColor[]>([])
  const [filteredSuggestions, setFilteredSuggestions] = useState<SuggestionColor[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Fetch color standards from database for autocomplete
  useEffect(() => {
    async function fetchColorStandards() {
      try {
        const { data, error } = await supabase
          .from('color_standards')
          .select('color_name, display_name')
          .order('display_name', { ascending: true })
        
        if (error) {
          console.error('Error fetching color standards:', error)
          return
        }
        
        // Transform data to match the SuggestionColor interface
        const transformedData: SuggestionColor[] = data?.map(item => ({
          name: item.color_name,
          display_name: item.display_name
        })) || []
        
        setColorSuggestions(transformedData)
      } catch (err) {
        console.error('Failed to fetch color standards:', err)
      }
    }
    
    fetchColorStandards()
  }, [])

  // Update filtered suggestions when color input changes
  useEffect(() => {
    if (color.length > 1) {
      const normalized = normalizeColorName(color)
      const filtered = colorSuggestions.filter(c => 
        c.display_name.toLowerCase().includes(color.toLowerCase()) ||
        normalizeColorName(c.display_name).includes(normalized)
      )
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [color, colorSuggestions])

  const handleSelectSuggestion = (suggestion: string) => {
    console.log("Selected suggestion:", suggestion)
    setColor(suggestion)
    setShowSuggestions(false)
  }

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Color changing to:", e.target.value)
    setColor(e.target.value)
    if (e.target.value.length > 1) {
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }

  // Find matching standard color
  const findStandardizedColor = () => {
    console.log("Finding standardized color for:", color)
    if (!color || color.trim() === "") return "";
    
    const matchingColor = colorSuggestions.find(c => 
      normalizeColorName(c.display_name) === normalizeColorName(color)
    );
    
    return matchingColor ? matchingColor.display_name : color;
  }

  const resetColor = () => {
    console.log("Resetting color field")
    setColor("");
  }

  const isColorValid = () => {
    const trimmedColor = color.trim();
    console.log("Checking if color is valid:", trimmedColor, "Length:", trimmedColor.length)
    return trimmedColor !== "" && trimmedColor.length > 0;
  }

  return {
    color,
    setColor,
    filteredSuggestions,
    showSuggestions,
    handleColorChange,
    handleSelectSuggestion,
    findStandardizedColor,
    resetColor,
    isColorValid
  }
}
