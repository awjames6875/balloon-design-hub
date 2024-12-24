import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductionDetailsProps {
  details: Tables<"production_details">;
  clientReference?: string | null;
  designPreview?: string | null;
}

export const ProductionDetails = ({ details, clientReference, designPreview }: ProductionDetailsProps) => {
  // Calculate balloons per color based on total clusters and color distribution
  const calculateBalloonsPerColor = () => {
    const colors = Array.isArray(details.colors) ? details.colors : [];
    if (colors.length === 0) return [];
    
    // Calculate balloons per cluster
    const balloonsPerCluster = {
      '11inch': 11, // Each cluster uses 11 11-inch balloons
      '16inch': 2,  // Each cluster uses 2 16-inch balloons
    };

    // Calculate clusters per color (evenly distributed)
    const clustersPerColor = Math.floor(details.total_clusters / colors.length);
    const remainingClusters = details.total_clusters % colors.length;

    return colors.map((color, index) => {
      // Add one extra cluster to some colors if there are remaining clusters
      const totalClustersForColor = clustersPerColor + (index < remainingClusters ? 1 : 0);
      
      return {
        color: String(color),
        balloons11: Math.round(totalClustersForColor * balloonsPerCluster['11inch']),
        balloons16: Math.round(totalClustersForColor * balloonsPerCluster['16inch']),
        totalClusters: totalClustersForColor
      };
    });
  };

  const calculateInflationTime = () => {
    const minutesPerCluster = 5;
    const totalMinutes = details.total_clusters * minutesPerCluster;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const balloonsByColor = calculateBalloonsPerColor();
  const inflationTime = calculateInflationTime();

  return (
    <div className="space-y-6">
      {(clientReference || designPreview) && (
        <div className="grid md:grid-cols-2 gap-6">
          {clientReference && (
            <Card>
              <CardHeader>
                <CardTitle>Client Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={clientReference}
                  alt="Client Reference"
                  className="max-h-64 w-full object-contain rounded-lg"
                />
              </CardContent>
            </Card>
          )}

          {designPreview && (
            <Card>
              <CardHeader>
                <CardTitle>Balloon Design</CardTitle>
              </CardHeader>
              <CardContent>
                <img
                  src={designPreview}
                  alt="Design Preview"
                  className="max-h-64 w-full object-contain rounded-lg"
                />
              </CardContent>
            </Card>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Production Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Client Name</h4>
                <p className="text-muted-foreground">{details.client_name}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Project Name</h4>
                <p className="text-muted-foreground">{details.project_name}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Length</h4>
              <p className="text-muted-foreground">{details.dimensions_ft} ft</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Balloon Requirements by Color</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Color</TableHead>
                      <TableHead className="text-right">Clusters</TableHead>
                      <TableHead className="text-right">11" Balloons</TableHead>
                      <TableHead className="text-right">16" Balloons</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balloonsByColor.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.color}</TableCell>
                        <TableCell className="text-right">{item.totalClusters}</TableCell>
                        <TableCell className="text-right">{item.balloons11}</TableCell>
                        <TableCell className="text-right">{item.balloons16}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="font-medium">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">{details.total_clusters}</TableCell>
                      <TableCell className="text-right">{details.balloons_11in}</TableCell>
                      <TableCell className="text-right">{details.balloons_16in}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Base Clusters</h4>
                <p className="text-muted-foreground">{details.base_clusters}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Extra Clusters</h4>
                <p className="text-muted-foreground">{details.extra_clusters}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Total Clusters</h4>
                <p className="text-muted-foreground">{details.total_clusters}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold mb-1">Littles Quantity</h4>
                <p className="text-muted-foreground">{details.littles_quantity}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Grapes Quantity</h4>
                <p className="text-muted-foreground">{details.grapes_quantity}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Estimated Inflation Time</h4>
                <p className="text-muted-foreground">{inflationTime}</p>
              </div>
            </div>

            {details.accents && typeof details.accents === 'object' && Object.keys(details.accents).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Accessories</h4>
                <div className="grid gap-2">
                  {Object.entries(details.accents).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      <span className="capitalize">{key}</span>
                      <span>{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};