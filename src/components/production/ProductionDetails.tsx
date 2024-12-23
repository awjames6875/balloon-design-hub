import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";

interface ProductionDetailsProps {
  details: Tables<"production_details">;
  clientReference?: string | null;
  designPreview?: string | null;
}

export const ProductionDetails = ({ details, clientReference, designPreview }: ProductionDetailsProps) => {
  // Convert accents object to string for display
  const accentsDisplay = details.accents ? JSON.stringify(details.accents, null, 2) : "";

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
          <div className="grid gap-4">
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
              <h4 className="font-semibold mb-1">Dimensions</h4>
              <p className="text-muted-foreground">{details.dimensions_ft} ft</p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Colors</h4>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(details.colors) && details.colors.map((color: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {color}
                  </span>
                ))}
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
              <div>
                <h4 className="font-semibold mb-1">Littles Quantity</h4>
                <p className="text-muted-foreground">{details.littles_quantity}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Grapes Quantity</h4>
                <p className="text-muted-foreground">{details.grapes_quantity}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Production Time</h4>
                <p className="text-muted-foreground">{details.production_time || "Not set"}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-1">11" Balloons</h4>
                <p className="text-muted-foreground">{details.balloons_11in}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">16" Balloons</h4>
                <p className="text-muted-foreground">{details.balloons_16in}</p>
              </div>
            </div>

            {details.accents && Object.keys(details.accents).length > 0 && (
              <div>
                <h4 className="font-semibold mb-1">Accent Balloons</h4>
                <pre className="text-sm text-muted-foreground">
                  {accentsDisplay}
                </pre>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};