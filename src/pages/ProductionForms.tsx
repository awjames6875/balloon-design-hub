import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Home } from "lucide-react"

interface DesignState {
  width: string
  height: string
  style: string
  colors: string[]
}

const ProductionForms = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const designState = location.state as DesignState

  // Calculate balloons needed based on dimensions and style
  const calculateBalloons = (width: number, height: number, style: string) => {
    // Basic calculation: 1 balloon per square foot
    // This is a simplified calculation - in a real app, you'd want more sophisticated logic
    const area = width * height
    const baseBalloons = Math.ceil(area)

    // Adjust based on style
    const styleMultiplier = {
      Straight: 1,
      Curved: 1.2, // Curved designs need ~20% more balloons
      Cluster: 1.5, // Clusters need ~50% more balloons
    }[style] || 1

    return Math.ceil(baseBalloons * styleMultiplier)
  }

  const totalBalloons = calculateBalloons(
    Number(designState?.width || 0),
    Number(designState?.height || 0),
    designState?.style || "Straight"
  )

  // Distribute total balloons among selected colors
  const balloonsPerColor = Math.ceil(
    totalBalloons / (designState?.colors?.length || 1)
  )

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Production Form</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="mb-4 text-sm text-gray-600">
          <p>Design Specifications:</p>
          <p>Width: {designState?.width || "N/A"} ft</p>
          <p>Height: {designState?.height || "N/A"} ft</p>
          <p>Style: {designState?.style || "N/A"}</p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Balloon Color</TableHead>
              <TableHead className="text-right">Quantity Needed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {designState?.colors?.map((color) => (
              <TableRow key={color}>
                <TableCell className="font-medium">{color}</TableCell>
                <TableCell className="text-right">{balloonsPerColor}</TableCell>
              </TableRow>
            )) || (
              <TableRow>
                <TableCell colSpan={2} className="text-center text-gray-500">
                  No colors selected
                </TableCell>
              </TableRow>
            )}
            <TableRow className="bg-muted/50">
              <TableCell className="font-bold">Total Balloons</TableCell>
              <TableCell className="text-right font-bold">{totalBalloons}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
      </div>
    </div>
  )
}

export default ProductionForms