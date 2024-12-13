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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Home } from "lucide-react"

interface DesignState {
  width: string
  height: string
  style: string
  colors: string[]
  imagePreview: string
  clientReference: string | null
  notes: string
}

const ProductionForms = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const designState = location.state as DesignState

  // Calculate balloons needed based on dimensions and style
  const calculateBalloons = (width: number, height: number, style: string) => {
    const area = width * height
    const baseBalloons = Math.ceil(area * 12) // Base: 12 balloons per square foot

    // Adjust based on style
    const styleMultiplier = {
      Straight: 1,
      Curved: 1.2,
      Cluster: 1.5,
      Organic: 1.8,
      Geometric: 1.3,
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

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Reference Images */}
        {designState?.clientReference && (
          <Card>
            <CardHeader>
              <CardTitle>Client Reference</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={designState.clientReference}
                alt="Client Reference"
                className="max-h-64 w-full object-contain rounded-lg"
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Balloon Design</CardTitle>
          </CardHeader>
          <CardContent>
            <img
              src={designState?.imagePreview}
              alt="Design Preview"
              className="max-h-64 w-full object-contain rounded-lg"
            />
          </CardContent>
        </Card>

        {/* Design Specifications */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Design Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="font-semibold">Dimensions:</p>
                <p>{designState?.width || "N/A"} ft × {designState?.height || "N/A"} ft</p>
              </div>
              <div>
                <p className="font-semibold">Style:</p>
                <p>{designState?.style || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Total Area:</p>
                <p>{Number(designState?.width || 0) * Number(designState?.height || 0)} sq ft</p>
              </div>
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

            {designState?.notes && (
              <div className="mt-4">
                <p className="font-semibold mb-2">Additional Notes:</p>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{designState.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
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