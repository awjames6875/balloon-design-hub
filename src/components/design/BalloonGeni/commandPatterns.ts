import { CorrectionProps } from "./types"

export const analyzeGeniCommand = (command: string): CorrectionProps | null => {
  const patterns: Array<{
    regex: RegExp;
    handler: (matches: RegExpMatchArray) => CorrectionProps;
  }> = [
    // Cluster count changes
    {
      regex: /change (\w+) clusters? (?:from \d+ )?to (\d+)/i,
      handler: (matches) => ({
        type: 'cluster_count',
        color: matches[1],
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'update_clusters'
      })
    },
    // Color name changes
    {
      regex: /change (\w+) color to (\w+)/i,
      handler: (matches) => ({
        type: 'color_name',
        color: matches[1],
        originalValue: matches[1],
        newValue: matches[2],
        action: 'update_color'
      })
    },
    // Add new color
    {
      regex: /add (\w+) with (\d+) clusters?/i,
      handler: (matches) => ({
        type: 'add_color',
        color: matches[1],
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'add_color'
      })
    }
  ]

  for (const pattern of patterns) {
    const matches = command.match(pattern.regex)
    if (matches) {
      return pattern.handler(matches)
    }
  }

  return null
}