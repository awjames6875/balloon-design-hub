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
  // Calculate balloons per color
  const calculateBalloonsPerColor = () => {
    if (!Array.isArray(details.colors)) return [];
    
    const balloonsPerCluster = {
      '11inch': 11,
      '16inch': 2
    };

    return details.colors.map(color => ({
      color,
      balloons11: Math.round((details.total_clusters * balloonsPerCluster['11inch']) / details.colors.length),
      balloons16: Math.round((details.total_clusters * balloonsPerCluster['16inch']) / details.colors.length)
    }));
  };

  // Calculate inflation time (5 minutes per cluster)
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
                      <TableHead>11" Balloons</TableHead>
                      <TableHead>16" Balloons</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balloonsByColor.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.color}</TableCell>
                        <TableCell>{item.balloons11}</TableCell>
                        <TableCell>{item.balloons16}</TableCell>
                      </TableRow>
                    ))}
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
                <h4 className="font-semibold mb-1">Total 11" Balloons</h4>
                <p className="text-muted-foreground">{details.balloons_11in}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Total 16" Balloons</h4>
                <p className="text-muted-foreground">{details.balloons_16in}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Estimated Inflation Time</h4>
                <p className="text-muted-foreground">{inflationTime}</p>
              </div>
            </div>

            {details.accents && Object.keys(details.accents).length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Accessories</h4>
                <div className="grid gap-2">
                  {Object.entries(details.accents).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center py-1 px-2 bg-gray-50 rounded">
                      <span className="capitalize">{key}</span>
                      <span>{JSON.stringify(value)}</span>
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