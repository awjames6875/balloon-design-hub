import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tables } from "@/integrations/supabase/types";
import { ImagePreviewCards } from "./ImagePreviewCards";
import { ProjectInfo } from "./ProjectInfo";
import { BalloonRequirementsTable } from "./BalloonRequirementsTable";
import { ProductionMetrics } from "./ProductionMetrics";
import { AccessoriesSection } from "./AccessoriesSection";

interface ProductionDetailsProps {
  details: Tables<"production_details">;
  clientReference?: string | null;
  designPreview?: string | null;
}

export const ProductionDetails = ({ details, clientReference, designPreview }: ProductionDetailsProps) => {
  const calculateBalloonsPerColor = () => {
    const colors = Array.isArray(details.colors) ? details.colors : [];
    if (colors.length === 0) return [];
    
    const balloonsPerCluster = {
      '11inch': 11,
      '16inch': 2,
    };

    const clustersPerColor = Math.floor(details.total_clusters / colors.length);
    const remainingClusters = details.total_clusters % colors.length;

    return colors.map((color, index) => {
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
      <ImagePreviewCards 
        clientReference={clientReference} 
        designPreview={designPreview} 
      />

      <Card>
        <CardHeader>
          <CardTitle>Production Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <ProjectInfo
              clientName={details.client_name}
              projectName={details.project_name}
              dimensionsFt={details.dimensions_ft}
            />

            <div className="space-y-2">
              <h4 className="font-semibold">Balloon Requirements by Color</h4>
              <BalloonRequirementsTable
                balloonsByColor={balloonsByColor}
                totalClusters={details.total_clusters}
                totalBalloons11={details.balloons_11in}
                totalBalloons16={details.balloons_16in}
              />
            </div>

            <ProductionMetrics
              baseClusters={details.base_clusters}
              extraClusters={details.extra_clusters}
              totalClusters={details.total_clusters}
              littlesQuantity={details.littles_quantity}
              grapesQuantity={details.grapes_quantity}
              inflationTime={inflationTime}
            />

            {details.accents && typeof details.accents === 'object' && (
              <AccessoriesSection accents={details.accents} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};