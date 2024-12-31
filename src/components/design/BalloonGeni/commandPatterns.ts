import { CorrectionProps } from './types';

interface CommandPattern {
  regex: RegExp;
  handler: (matches: RegExpMatchArray) => CorrectionProps;
}

export const commandPatterns: CommandPattern[] = [
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
];

export const analyzeGeniCommand = (command: string): CorrectionProps | null => {
  for (const pattern of commandPatterns) {
    const matches = command.match(pattern.regex)
    if (matches) {
      return pattern.handler(matches)
    }
  }
  return null
}