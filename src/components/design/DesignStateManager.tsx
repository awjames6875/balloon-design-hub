import { useState } from "react"
import { SimpleDesignAssistant } from "./SimpleDesignAssistant"

interface ColorDistribution {
  [color: string]: {
    clusters: number
    balloons11: number
    balloons16: number
  }
}

interface DesignData {
  totalClusters: number
  colorDistribution: ColorDistribution
  totalBalloons: {
    '11inch': number
    '16inch': number
  }
}

export const DesignStateManager = () => {
  const [designData, setDesignData] = useState<DesignData>({
    totalClusters: 12,
    colorDistribution: {
      'Wild Berry': { clusters: 3, balloons11: 33, balloons16: 6 },
      'Golden Rod': { clusters: 3, balloons11: 33, balloons16: 6 },
      'Teal': { clusters: 3, balloons11: 33, balloons16: 6 },
      'Orange': { clusters: 3, balloons11: 33, balloons16: 6 }
    },
    totalBalloons: {
      '11inch': 132,
      '16inch': 24
    }
  })

  const handleDesignUpdate = (update: { type: string; value: number }) => {
    if (update.type === 'UPDATE_TOTAL_CLUSTERS') {
      const newClustersPerColor = Math.floor(update.value / Object.keys(designData.colorDistribution).length)
      const remainingClusters = update.value % Object.keys(designData.colorDistribution).length
      
      const updatedColorDistribution = Object.fromEntries(
        Object.entries(designData.colorDistribution).map(([color, _], index) => {
          const colorClusters = newClustersPerColor + (index < remainingClusters ? 1 : 0)
          return [color, {
            clusters: colorClusters,
            balloons11: colorClusters * 11,
            balloons16: colorClusters * 2
          }]
        })
      )

      const totalBalloons11 = Object.values(updatedColorDistribution)
        .reduce((sum, color) => sum + color.balloons11, 0)
      const totalBalloons16 = Object.values(updatedColorDistribution)
        .reduce((sum, color) => sum + color.balloons16, 0)

      setDesignData({
        totalClusters: update.value,
        colorDistribution: updatedColorDistribution,
        totalBalloons: {
          '11inch': totalBalloons11,
          '16inch': totalBalloons16
        }
      })
    }
  }

  return (
    <div className="space-y-6">
      <SimpleDesignAssistant 
        designData={designData}
        onUpdate={handleDesignUpdate}
      />

      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2">Design Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Total Clusters</p>
            <p className="text-xl font-medium">{designData.totalClusters}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Balloons</p>
            <p className="text-xl font-medium">
              {designData.totalBalloons['11inch'] + designData.totalBalloons['16inch']}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}