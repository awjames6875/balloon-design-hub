import { analyzeGeniCommand } from '../commandPatterns'

describe('analyzeGeniCommand', () => {
  // Test cluster count changes
  test('handles cluster count changes', () => {
    const command = 'change pink clusters to 5'
    const result = analyzeGeniCommand(command)
    
    expect(result).toEqual({
      type: 'cluster_count',
      color: 'pink',
      originalValue: null,
      newValue: 5,
      action: 'update_clusters',
      clusterCount: 5
    })
  })

  // Test color name changes
  test('handles color name changes', () => {
    const command = 'change red color to burgundy'
    const result = analyzeGeniCommand(command)
    
    expect(result).toEqual({
      type: 'color_name',
      color: 'red',
      originalValue: 'red',
      newValue: 'burgundy',
      action: 'update_color'
    })
  })

  // Test balloon count changes
  test('handles balloon count changes', () => {
    const command = 'change blue 11" balloons to 15'
    const result = analyzeGeniCommand(command)
    
    expect(result).toEqual({
      type: 'balloon_count',
      color: 'blue',
      originalValue: null,
      newValue: 15,
      action: 'update_balloon_count',
      balloonSize: '11'
    })
  })

  // Test adding new color
  test('handles adding new color', () => {
    const command = 'add purple with 3 clusters'
    const result = analyzeGeniCommand(command)
    
    expect(result).toEqual({
      type: 'add_color',
      color: 'purple',
      originalValue: null,
      newValue: 3,
      action: 'add_color',
      clusterCount: 3
    })
  })

  // Test removing color
  test('handles removing color', () => {
    const command = 'remove green color'
    const result = analyzeGeniCommand(command)
    
    expect(result).toEqual({
      type: 'remove_color',
      color: 'green',
      originalValue: 'green',
      newValue: '',
      action: 'remove_color'
    })
  })

  // Test invalid commands
  test('returns null for invalid commands', () => {
    const command = 'this is not a valid command'
    const result = analyzeGeniCommand(command)
    
    expect(result).toBeNull()
  })
})