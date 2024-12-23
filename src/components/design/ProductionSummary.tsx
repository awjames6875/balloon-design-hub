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

interface ProductionSummaryProps {
  clientName: string
  projectName: string
  dimensions: string
  style: string
  colorClusters: never[] // Kept for backward compatibility but not used
  accessories: Accessory[]
  onFinalize: () => void
  calculations?: DesignSpecsFormData['calculations']
}

export const ProductionSummary = ({
  clientName,
  projectName,
  dimensions,
  style,
  accessories,
  onFinalize,
  calculations
}: ProductionSummaryProps) => {
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
        colors: [],
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
        productionTime: `${Math.floor((calculations.totalClusters * 15) / 60)}h ${(calculations.totalClusters * 15) % 60}m`,
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

      {calculations && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Production Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <p><span className="font-semibold">Base Clusters:</span> {calculations.baseClusters}</p>
            <p><span className="font-semibold">Extra Clusters:</span> {calculations.extraClusters}</p>
            <p><span className="font-semibold">Total Clusters:</span> {calculations.totalClusters}</p>
            <p><span className="font-semibold">Littles Quantity:</span> {calculations.littlesQuantity}</p>
            <p><span className="font-semibold">Grapes Quantity:</span> {calculations.grapesQuantity}</p>
            <p><span className="font-semibold">11" Balloons:</span> {calculations.balloons11in}</p>
            <p><span className="font-semibold">16" Balloons:</span> {calculations.balloons16in}</p>
            <p><span className="font-semibold">Total Balloons:</span> {calculations.totalBalloons}</p>
            <p><span className="font-semibold">Production Time:</span> {`${Math.floor((calculations.totalClusters * 15) / 60)}h ${(calculations.totalClusters * 15) % 60}m`}</p>
          </div>
        </div>
      )}

      <Button onClick={handleFinalize} className="w-full">
        Finalize Production
      </Button>
    </div>
  )
}