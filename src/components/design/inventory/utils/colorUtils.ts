
import { supabase } from "@/integrations/supabase/client"

const colorMap: { [key: string]: string } = {
  "#FF0000": "Red",
  "#00FF00": "Green",
  "#0000FF": "Blue",
  "#FFFF00": "Yellow",
  "#FFA500": "Orange",
  "#800080": "Purple",
  "#FFC0CB": "Pink",
  "#FFFFFF": "White",
  "#000000": "Black",
  "#C0C0C0": "Silver",
  "#FFD700": "Gold",
  "#7E69AB": "Purple"
}

export const getColorName = (hexColor: string) => {
  return colorMap[hexColor.toUpperCase()] || hexColor
}

// Improved color name normalization function
export const normalizeColorName = (colorName: string): string => {
  if (!colorName) return "";
  
  // Convert to lowercase and remove spaces
  const normalized = colorName.toLowerCase().replace(/\s+/g, "");
  
  // Special case handling for common naming variations
  const specialCases: Record<string, string> = {
    "wildberry": "wildberry",
    "wild berry": "wildberry",
    "goldenrod": "goldenrod",
    "golden rod": "goldenrod",
    // Add more variations as needed
  };
  
  // Check if this is a special case
  for (const [variant, standard] of Object.entries(specialCases)) {
    if (colorName.toLowerCase() === variant || normalized === standard) {
      return standard;
    }
  }
  
  return normalized;
}

// Helper function to generate alternative names for colors
export const getAlternateColorNames = (colorName: string): string[] => {
  const alternates: string[] = [];
  const colorLower = colorName.toLowerCase();
  
  // Common color name variations
  const variations: Record<string, string[]> = {
    "wild berry": ["wildberry", "wild-berry", "wild_berry"],
    "wildberry": ["wild berry", "wild-berry", "wild_berry"],
    "golden rod": ["goldenrod", "golden-rod", "gold rod"],
    "goldenrod": ["golden rod", "golden-rod", "gold rod"],
    // Add more variations as needed
  };
  
  // Check if we have known variations for this color
  for (const [base, variants] of Object.entries(variations)) {
    if (colorLower === base || variants.includes(colorLower)) {
      // Add all variations including the base
      alternates.push(base, ...variants);
      break;
    }
  }
  
  // If no predefined variations, try basic transformations
  if (alternates.length === 0) {
    // Add with and without spaces
    if (colorLower.includes(' ')) {
      alternates.push(colorLower.replace(/\s+/g, ''));
    } else {
      // Try to split camelCase or insert spaces at logical points
      alternates.push(
        colorLower.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase()
      );
    }
  }
  
  return alternates;
}
