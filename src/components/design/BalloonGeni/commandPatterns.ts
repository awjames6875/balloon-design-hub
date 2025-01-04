import { CorrectionProps, CorrectionType } from './types';

export const analyzeGeniCommand = (command: string): CorrectionProps | null => {
  console.log("Processing command:", command);
  
  const patterns = [
    // Change cluster count pattern
    {
      regex: /(?:change|set|update) (\w+)(?: color)?(?: clusters?)? (?:to|=) (\d+)/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'cluster_count' as CorrectionType,
        color: matches[1].toLowerCase(),
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'update_clusters',
        clusterCount: parseInt(matches[2])
      })
    },
    
    // Make cluster count pattern
    {
      regex: /(?:make|set) (\w+) (?:to|=) (\d+) clusters?/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'cluster_count' as CorrectionType,
        color: matches[1].toLowerCase(),
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'update_clusters',
        clusterCount: parseInt(matches[2])
      })
    },

    // Add new color pattern
    {
      regex: /add (\w+)(?: color)? with (\d+) clusters?/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'add_color' as CorrectionType,
        color: matches[1].toLowerCase(),
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'add_color',
        clusterCount: parseInt(matches[2])
      })
    },

    // Remove color pattern
    {
      regex: /remove (\w+)(?: color)?/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'remove_color' as CorrectionType,
        color: matches[1].toLowerCase(),
        originalValue: matches[1],
        newValue: '',
        action: 'remove_color'
      })
    }
  ];

  for (const pattern of patterns) {
    const matches = command.match(pattern.regex);
    if (matches) {
      console.log("Pattern matched:", pattern.regex);
      console.log("Matches:", matches);
      const correction = pattern.handler(matches);
      console.log("Generated correction:", correction);
      return correction;
    }
  }

  console.log("No pattern matched for command:", command);
  return null;
}

// Make it available globally for browser testing
if (typeof window !== 'undefined') {
  (window as any).analyzeGeniCommand = analyzeGeniCommand;
}