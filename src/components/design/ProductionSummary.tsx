import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { saveDesignToProduction } from "@/services/productionService"
import { calculateInflationTime } from "@/utils/timeCalculations"
import { ProjectDetails } from "./production/ProjectDetails"
import { BalloonColorTable } from "./production/BalloonColorTable"
import { ProductionMetrics } from "./production/ProductionMetrics"
import { AccessoriesTable } from "./production/AccessoriesTable"

interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

interface ProductionSummaryProps {
  clientName: string
  projectName: string
  dimensions: string
  style: string
  colorClusters: ColorCluster[]
  accessories: Array<{ type: string; quantity: number }>
  onFinalize: () => void
  calculations?: {
    baseClusters: number
    extraClusters: number
    totalClusters: number
    littlesQuantity: number
    grapesQuantity: number
    balloons11in: number
    balloons16in: number
    totalBalloons: number
  }
}

export const ProductionSummary = ({
  clientName,
  projectName,
  dimensions,
  style,
  colorClusters,
  accessories,
  onFinalize,
  calculations
}: ProductionSummaryProps) => {
  const calculateBalloonsPerColor = () => {
    if (!calculations) return [];
    
    const balloonsPerCluster = {
      '11inch': 11,
      '16inch': 2
    };

    return colorClusters.map(cluster => ({
      color: cluster.color,
      balloons11: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['11inch']),
      balloons16: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['16inch']),
      totalClusters: cluster.baseClusters + cluster.extraClusters
    }));
  };

  const handleFinalize = async () => {
    if (!calculations) {
      toast.error("Missing balloon calculations")
      return
    }

    try {
      await saveDesignToProduction({
        clientName,
        projectName,
        dimensionsFt: parseInt(dimensions),
        colors: colorClusters.map(cluster => cluster.color),
        baseClusters: calculations.baseClusters,
        extraClusters: calculations.extraClusters,
        totalClusters: calculations.totalClusters,
        littlesQuantity: calculations.littlesQuantity,
        grapesQuantity: calculations.grapesQuantity,
        balloons11in: calculations.balloons11in,
        balloons16in: calculations.balloons16in,
        accents: accessories.reduce((acc, curr) => ({
          ...acc,
          [curr.type]: curr.quantity
        }), {}),
        productionTime: calculateInflationTime(calculations.totalClusters),
      })
      
      toast.success("Production details saved successfully!")
      onFinalize()
    } catch (error) {
      console.error("Error saving production:", error)
      toast.error("Failed to save production details")
    }
  }

  const balloonsByColor = calculateBalloonsPerColor();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Production Summary</h2>

      <ProjectDetails
        clientName={clientName}
        projectName={projectName}
        dimensions={dimensions}
        style={style}
      />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Balloon Requirements by Color</h3>
        <BalloonColorTable
          balloonsByColor={balloonsByColor}
          calculations={calculations}
        />
      </div>

      <ProductionMetrics calculations={calculations} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Accessories</h3>
        <AccessoriesTable accessories={accessories} />
      </div>

      <Button onClick={handleFinalize} className="w-full">
        Finalize Production
      </Button>
    </div>
  )
}