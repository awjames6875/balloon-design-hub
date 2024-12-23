import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

interface ClusterDetailsFormProps {
  onNext: (clusters: ColorCluster[]) => void
}

export const ClusterDetailsForm = ({ onNext }: ClusterDetailsFormProps) => {
  const [colorClusters, setColorClusters] = useState<ColorCluster[]>([])
  const [colorName, setColorName] = useState("")
  const [baseClusters, setBaseClusters] = useState("")
  const [extraClusters, setExtraClusters] = useState("")

  const handleAddColor = () => {
    if (!colorName || !baseClusters || !extraClusters) {
      return
    }

    const newCluster: ColorCluster = {
      color: colorName,
      baseClusters: parseInt(baseClusters),
      extraClusters: parseInt(extraClusters),
    }

    setColorClusters([...colorClusters, newCluster])
    setColorName("")
    setBaseClusters("")
    setExtraClusters("")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Cluster and Color Details</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="colorName">Color Name</Label>
            <Input
              id="colorName"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Enter color name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseClusters">Base Clusters</Label>
            <Input
              id="baseClusters"
              type="number"
              value={baseClusters}
              onChange={(e) => setBaseClusters(e.target.value)}
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="extraClusters">Extra Clusters</Label>
            <Input
              id="extraClusters"
              type="number"
              value={extraClusters}
              onChange={(e) => setExtraClusters(e.target.value)}
              min="0"
            />
          </div>
        </div>

        <Button onClick={handleAddColor} className="w-full">
          Add Color
        </Button>
      </div>

      {colorClusters.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Base Clusters</TableHead>
                <TableHead>Extra Clusters</TableHead>
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
      )}

      <Button
        onClick={() => onNext(colorClusters)}
        className="w-full"
        disabled={colorClusters.length === 0}
      >
        Next
      </Button>
    </div>
  )
}