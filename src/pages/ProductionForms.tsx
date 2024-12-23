import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home } from "lucide-react";
import { calculateBalloonRequirements } from "@/utils/balloonCalculations";
import { toast } from "sonner";

interface DesignState {
  width: string;
  height: string;
  style: string;
  colors: string[];
  imagePreview: string;
  clientReference: string | null;
  notes: string;
}

const ProductionForms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const designState = location.state as DesignState;

  // Fetch formula based on the width dimension
  const { data: calculationResult, isLoading } = useQuery({
    queryKey: ['balloonFormula', designState?.width],
    queryFn: () => calculateBalloonRequirements(Number(designState?.width || 0)),
    enabled: !!designState?.width,
    meta: {
      onError: () => {
        toast.error("Error fetching balloon formula");
      }
    }
  });

  if (!designState) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Design Specifications</h1>
        <p className="mb-4">Please create a new design first.</p>
        <Button onClick={() => navigate("/new-design")}>Create New Design</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Production Form</h1>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {designState.clientReference && (
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
              src={designState.imagePreview}
              alt="Design Preview"
              className="max-h-64 w-full object-contain rounded-lg"
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Design Specifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-4 text-sm">
              <div>
                <p className="font-semibold">Dimensions:</p>
                <p>{designState.width} ft × {designState.height} ft</p>
              </div>
              <div>
                <p className="font-semibold">Style:</p>
                <p>{designState.style}</p>
              </div>
              <div>
                <p className="font-semibold">Total Area:</p>
                <p>{Number(designState.width) * Number(designState.height)} sq ft</p>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-4">Loading formula...</div>
            ) : calculationResult ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Component</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Base Clusters</TableCell>
                    <TableCell className="text-right">{calculationResult.baseClusters}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Extra Clusters</TableCell>
                    <TableCell className="text-right">{calculationResult.extraClusters}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Littles (L's)</TableCell>
                    <TableCell className="text-right">{calculationResult.formula.littles_quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Grapes (G's)</TableCell>
                    <TableCell className="text-right">{calculationResult.formula.grapes_quantity}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">11" Balloons</TableCell>
                    <TableCell className="text-right">{calculationResult.formula.balloons_11in}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">16" Balloons</TableCell>
                    <TableCell className="text-right">{calculationResult.formula.balloons_16in}</TableCell>
                  </TableRow>
                  <TableRow className="bg-muted/50">
                    <TableCell className="font-bold">Total Balloons</TableCell>
                    <TableCell className="text-right font-bold">{calculationResult.totalBalloons}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-red-500">
                No formula found for the specified size
              </div>
            )}

            {designState.notes && (
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
  );
};

export default ProductionForms;