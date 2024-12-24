import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"
import { saveDesignToProduction } from "@/services/productionService"
import { DesignSpecsFormData } from "./DesignSpecsForm"

interface Accessory {
  type: string
  quantity: number
}

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
  accessories: Accessory[]
  onFinalize: () => void
  calculations?: DesignSpecsFormData['calculations']
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
      balloons16: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['16inch'])
    }));
  };

  const calculateInflationTime = () => {
    if (!calculations) return "N/A";
    const minutesPerCluster = 5;
    const totalMinutes = calculations.totalClusters * minutesPerCluster;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
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
        productionTime: calculateInflationTime(),
      })
      
      toast.success("Production details saved successfully!")
      onFinalize()
    } catch (error) {
      console.error("Error saving production:", error)
      toast.error("Failed to save production details")
    }
  }

  const balloonsByColor = calculateBalloonsPerColor();
  const inflationTime = calculateInflationTime();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Production Summary</h2>

      <div className="space-y-2">
        <p><span className="font-semibold">Client:</span> {clientName}</p>
        <p><span className="font-semibold">Project:</span> {projectName}</p>
        <p><span className="font-semibold">Dimensions:</span> {dimensions} ft</p>
        <p><span className="font-semibold">Style:</span> {style}</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Balloon Requirements by Color</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>11" Balloons</TableHead>
                <TableHead>16" Balloons</TableHead>
                <TableHead>Total Clusters</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balloonsByColor.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.color}</TableCell>
                  <TableCell>{item.balloons11}</TableCell>
                  <TableCell>{item.balloons16}</TableCell>
                  <TableCell>
                    {colorClusters[index].baseClusters + colorClusters[index].extraClusters}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {calculations && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Production Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-semibold">Base Clusters:</span> {calculations.baseClusters}</p>
            <p><span className="font-semibold">Extra Clusters:</span> {calculations.extraClusters}</p>
            <p><span className="font-semibold">Total Clusters:</span> {calculations.totalClusters}</p>
            <p><span className="font-semibold">Littles Quantity:</span> {calculations.littlesQuantity}</p>
            <p><span className="font-semibold">Grapes Quantity:</span> {calculations.grapesQuantity}</p>
            <p><span className="font-semibold">Total 11" Balloons:</span> {calculations.balloons11in}</p>
            <p><span className="font-semibold">Total 16" Balloons:</span> {calculations.balloons16in}</p>
            <p><span className="font-semibold">Estimated Inflation Time:</span> {inflationTime}</p>
          </div>
        </div>
      )}

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Accessories</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accessories.map((accessory, index) => (
                <TableRow key={index}>
                  <TableCell>{accessory.type}</TableCell>
                  <TableCell>{accessory.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Button onClick={handleFinalize} className="w-full">
        Finalize Production
      </Button>
    </div>
  )
}