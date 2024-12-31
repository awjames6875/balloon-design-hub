import { CorrectionProps, CorrectionType } from './types'

export const analyzeGeniCommand = (command: string): CorrectionProps | null => {
  const patterns = [
    // Change cluster count pattern
    {
      regex: /change (\w+) clusters? (?:from \d+ )?to (\d+)/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'cluster_count',
        color: matches[1].toLowerCase(),
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'update_clusters',
        clusterCount: parseInt(matches[2])
      })
    },
    
    // Change color name pattern
    {
      regex: /change (\w+) color to (\w+)/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'color_name',
        color: matches[1].toLowerCase(),
        originalValue: matches[1],
        newValue: matches[2],
        action: 'update_color'
      })
    },

    // Update balloon count pattern
    {
      regex: /change (\w+) (\d+)" balloons? to (\d+)/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'balloon_count',
        color: matches[1].toLowerCase(),
        originalValue: null,
        newValue: parseInt(matches[3]),
        action: 'update_balloon_count',
        balloonSize: matches[2] as '11' | '16'
      })
    },

    // Add new color pattern
    {
      regex: /add (\w+) with (\d+) clusters?/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'add_color',
        color: matches[1].toLowerCase(),
        originalValue: null,
        newValue: parseInt(matches[2]),
        action: 'add_color',
        clusterCount: parseInt(matches[2])
      })
    },

    // Remove color pattern
    {
      regex: /remove (\w+) color/i,
      handler: (matches: RegExpMatchArray): CorrectionProps => ({
        type: 'remove_color',
        color: matches[1].toLowerCase(),
        originalValue: matches[1],
        newValue: '',
        action: 'remove_color'
      })
    }
  ]

  // Try each pattern
  for (const pattern of patterns) {
    const matches = command.match(pattern.regex)
    if (matches) {
      return pattern.handler(matches)
    }
  }

  return null
}