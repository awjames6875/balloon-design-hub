import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ManualImageAnalysisFormProps {
  onDataSubmit: (data: {
    clusters: number
    colors: string[]
    sizes: { size: string; quantity: number }[]
  }) => void
  disabled?: boolean
}

export const ManualImageAnalysisForm = ({
  onDataSubmit,
  disabled = false,
}: ManualImageAnalysisFormProps) => {
  const [clusters, setClusters] = useState("")
  const [colors, setColors] = useState("")
  const [sizes, setSizes] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Parse and validate inputs
      const parsedClusters = parseInt(clusters)
      if (isNaN(parsedClusters) || parsedClusters <= 0) {
        throw new Error("Please enter a valid number of clusters")
      }

      const parsedColors = colors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean)
      if (parsedColors.length === 0) {
        throw new Error("Please enter at least one color")
      }

      const parsedSizes = sizes
        .split(",")
        .map((size) => {
          const [sizeStr, quantityStr] = size.split("x").map((s) => s.trim())
          const quantity = parseInt(quantityStr)
          if (!sizeStr || isNaN(quantity)) {
            throw new Error("Invalid size format")
          }
          return { size: sizeStr, quantity }
        })

      onDataSubmit({
        clusters: parsedClusters,
        colors: parsedColors,
        sizes: parsedSizes,
      })

      toast.success("Analysis data saved successfully")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid input")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manual Image Analysis Input</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="clusters">Number of Clusters</Label>
            <Input
              type="number"
              id="clusters"
              value={clusters}
              onChange={(e) => setClusters(e.target.value)}
              placeholder="e.g., 10"
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colors">Colors (comma-separated)</Label>
            <Input
              type="text"
              id="colors"
              value={colors}
              onChange={(e) => setColors(e.target.value)}
              placeholder="e.g., Red, Blue, Green"
              disabled={disabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sizes">
              Sizes and Quantities (format: size x quantity, comma-separated)
            </Label>
            <Input
              type="text"
              id="sizes"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="e.g., 11-inch x 10, 16-inch x 2"
              disabled={disabled}
            />
          </div>

          <Button type="submit" className="w-full" disabled={disabled}>
            Save Analysis Data
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}