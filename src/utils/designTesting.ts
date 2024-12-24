import { toast } from "sonner"
import { calculateBalloonRequirements } from "./balloonCalculations"
import { generateColorPattern } from "./colorPatterns"
import { supabase } from "@/integrations/supabase/client"

interface TestCase {
  length: number
  colors: string[]
  style: string
  includeAccessories: boolean
}

const testCases: TestCase[] = [
  {
    length: 14,
    colors: ['Wildberry', 'Goldenrod', 'Teal', 'Orange'],
    style: 'Classic',
    includeAccessories: true
  },
  {
    length: 8,
    colors: ['Wildberry', 'Orange'],
    style: 'Modern',
    includeAccessories: false
  },
  {
    length: 20,
    colors: ['Goldenrod', 'Teal', 'Orange'],
    style: 'Elegant',
    includeAccessories: true
  }
]

export const runDesignTests = async () => {
  console.log("Starting design tests...")
  const results = []

  for (const testCase of testCases) {
    try {
      console.log(`Testing ${testCase.length}ft design with colors:`, testCase.colors)
      
      // Test balloon calculations
      const calculations = await calculateBalloonRequirements(testCase.length, testCase.style)
      console.log("Balloon calculations:", calculations)

      // Test color pattern generation
      const colorPattern = generateColorPattern(testCase.colors, calculations.totalClusters)
      console.log("Color pattern:", colorPattern)

      // Verify inventory availability
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('balloon_inventory')
        .select('*')
        .in('color', testCase.colors)

      if (inventoryError) {
        throw new Error(`Inventory check failed: ${inventoryError.message}`)
      }

      console.log("Inventory check:", inventoryData)

      // Calculate total balloons needed per color
      const balloonsPerColor = colorPattern.reduce((acc, cluster) => {
        const color = cluster.color
        acc[color] = (acc[color] || 0) + (calculations.balloons11in / colorPattern.length)
        return acc
      }, {} as Record<string, number>)

      // Check if inventory is sufficient
      const inventoryStatus = inventoryData.map(item => ({
        color: item.color,
        available: item.quantity,
        required: Math.ceil(balloonsPerColor[item.color] || 0),
        sufficient: item.quantity >= (balloonsPerColor[item.color] || 0)
      }))

      results.push({
        testCase,
        calculations,
        colorPattern,
        inventoryStatus,
        passed: inventoryStatus.every(status => status.sufficient)
      })

    } catch (error) {
      console.error(`Test failed for ${testCase.length}ft design:`, error)
      toast.error(`Test failed for ${testCase.length}ft design`)
      results.push({
        testCase,
        error: error instanceof Error ? error.message : 'Unknown error',
        passed: false
      })
    }
  }

  console.log("Test results:", results)
  return results
}

// Helper function to run a single test case
export const testDesign = async (
  length: number,
  colors: string[],
  style: string,
  includeAccessories: boolean
) => {
  const testCase = { length, colors, style, includeAccessories }
  const results = await runDesignTests([testCase])
  return results[0]
}