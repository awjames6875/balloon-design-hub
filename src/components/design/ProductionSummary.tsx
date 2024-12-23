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

interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

interface Accessory {
  type: string
  quantity: number
}

interface ProductionSummaryProps {
  clientName: string
  projectName: string
  dimensions: string
  style: string
  colorClusters: ColorCluster[]
  accessories: Accessory[]
  onFinalize: () => void
}

export const ProductionSummary = ({
  clientName,
  projectName,
  dimensions,
  style,
  colorClusters,
  accessories,
  onFinalize,
}: ProductionSummaryProps) => {
  const totalBaseClusters = colorClusters.reduce((sum, cluster) => sum + cluster.baseClusters, 0)
  const totalExtraClusters = colorClusters.reduce((sum, cluster) => sum + cluster.extraClusters, 0)
  const totalClusters = totalBaseClusters + totalExtraClusters
  
  // Calculate balloon quantities
  const balloons11Inch = totalClusters * 11 // Each cluster uses 11 balloons
  const balloons16Inch = Math.ceil(totalClusters * 0.2) // 20% of clusters need 16" balloons
  
  // Estimate production time (15 minutes per cluster)
  const totalMinutes = totalClusters * 15
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  const productionTime = `${hours}h ${minutes}m`

  const handleFinalize = async () => {
    try {
      await saveDesignToProduction({
        clientName,
        projectName,
        dimensionsFt: parseInt(dimensions),
        colors: colorClusters.map(c => c.color),
        baseClusters: totalBaseClusters,
        extraClusters: totalExtraClusters,
        totalClusters,
        littlesQuantity: totalClusters,
        grapesQuantity: Math.ceil(totalClusters * 0.5),
        balloons11in: balloons11Inch,
        balloons16in: balloons16Inch,
        accents: accessories.reduce((acc, curr) => ({
          ...acc,
          [curr.type]: curr.quantity
        }), {}),
        productionTime,
      })
      
      toast.success("Production details saved successfully!")
      onFinalize()
    } catch (error) {
      console.error("Error saving production:", error)
      toast.error("Failed to save production details")
    }
  }

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
        <h3 className="text-lg font-semibold">Colors and Clusters</h3>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Base Clusters</TableHead>
                <TableHead>Extras</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colorClusters.map((cluster, index) => (
                <TableRow key={index}>
                  <TableCell>{cluster.color}</TableCell>
                  <TableCell>{cluster.baseClusters}</TableCell>
                  <TableCell>{cluster.extraClusters}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

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

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Production Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <p><span className="font-semibold">Base Clusters:</span> {totalBaseClusters}</p>
          <p><span className="font-semibold">Extra Clusters:</span> {totalExtraClusters}</p>
          <p><span className="font-semibold">11" Balloons:</span> {balloons11Inch}</p>
          <p><span className="font-semibold">16" Balloons:</span> {balloons16Inch}</p>
          <p><span className="font-semibold">Production Time:</span> {productionTime}</p>
        </div>
      </div>

      <Button onClick={handleFinalize} className="w-full">
        Finalize Production
      </Button>
    </div>
  )
}