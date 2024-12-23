import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { ProductionDetails } from "@/components/production/ProductionDetails";
import { Tables } from "@/integrations/supabase/types";
import { updateInventoryQuantities } from "@/utils/inventoryUtils";
import { calculateBalloonRequirements } from "@/utils/balloonCalculations";
import { useQuery } from "@tanstack/react-query";

interface DesignState {
  clientName: string;
  projectName: string;
  length: string;
  colors: string[];
  shape: string;
  imagePreview: string;
  clientReference: string | null;
}

const ProductionForms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const designState = location.state as DesignState;

  const { data: balloonFormula, isLoading } = useQuery({
    queryKey: ['balloonFormula', designState?.length, designState?.shape],
    queryFn: async () => {
      if (!designState?.length) return null;
      const result = await calculateBalloonRequirements(parseInt(designState.length), designState.shape);
      console.log("Balloon formula result:", result);
      return result;
    },
    enabled: !!designState?.length,
  });

  const calculateProductionTime = (totalClusters: number) => {
    const minutesPerCluster = 15;
    const totalMinutes = totalClusters * minutesPerCluster;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  if (!designState) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Design Specifications</h1>
        <p className="mb-4">Please create a new design first.</p>
        <Button onClick={() => navigate("/new-design")}>Create New Design</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading formula calculations...</p>
      </div>
    );
  }

  if (!balloonFormula) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Error loading balloon formula. Please try again.</p>
        <Button onClick={() => navigate("/new-design")}>Create New Design</Button>
      </div>
    );
  }

  const productionDetails: Tables<"production_details"> = {
    id: 0,
    client_name: designState.clientName,
    project_name: designState.projectName,
    dimensions_ft: parseInt(designState.length),
    shape: designState.shape,
    colors: designState.colors,
    base_clusters: balloonFormula.base_clusters,
    extra_clusters: balloonFormula.extra_clusters,
    total_clusters: balloonFormula.total_clusters,
    littles_quantity: balloonFormula.littles_quantity,
    grapes_quantity: balloonFormula.grapes_quantity,
    balloons_11in: balloonFormula.balloons_11in,
    balloons_16in: balloonFormula.balloons_16in,
    accents: {
      starbursts: {
        quantity: 5,
        colors: ["Gold", "Silver"]
      },
      decorative: {
        quantity: 3,
        type: "Large Accent Balloons"
      }
    },
    production_time: calculateProductionTime(balloonFormula.total_clusters),
    creation_date: null,
    total_balloons: balloonFormula.total_balloons,
    width_ft: null
  };

  const handleFinalizeProduction = async () => {
    const updates = [
      {
        color: "Orange",
        size: "11in",
        quantity: productionDetails.balloons_11in,
      },
      {
        color: "Wildberry",
        size: "11in",
        quantity: productionDetails.extra_clusters,
      },
      {
        color: "Goldenrod",
        size: "16in",
        quantity: productionDetails.balloons_16in,
      },
    ];

    const success = await updateInventoryQuantities(updates);
    
    if (success) {
      toast.success("Production finalized! Inventory updated successfully.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Production Form</h1>

      <ProductionDetails
        details={productionDetails}
        clientReference={designState.clientReference}
        designPreview={designState.imagePreview}
      />

      <div className="flex justify-center mt-8 gap-4">
        <Button
          onClick={() => navigate("/")}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Home className="h-4 w-4" />
          Back to Home
        </Button>
        <Button onClick={handleFinalizeProduction}>
          Finalize Production
        </Button>
      </div>
    </div>
  );
};

export default ProductionForms;