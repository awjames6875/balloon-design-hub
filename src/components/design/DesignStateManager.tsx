import { useState } from "react"
import { BalloonChart } from "@/components/charts/BalloonChart"
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

  const [chartColors, setChartColors] = useState({
    actual: "hsl(220 80% 50%)",
    effective: "hsl(150 80% 50%)"
  })

  const handleDesignUpdate = (updatedDesign: Partial<DesignData>) => {
    setDesignData(prev => ({
      ...prev,
      ...updatedDesign
    }))
  }

  // Transform design data for the chart
  const chartData = Object.entries(designData.colorDistribution).map(([color, data]) => ({
    name: color,
    actual: data.balloons11,
    effective: data.balloons16
  }))

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-4">Design Distribution</h3>
        <BalloonChart 
          data={chartData}
          colors={chartColors}
        />
      </div>

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