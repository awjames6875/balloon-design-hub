import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { ProductionDetails } from "@/components/production/ProductionDetails";
import { Tables } from "@/integrations/supabase/types";
import { updateInventoryQuantities } from "@/utils/inventoryUtils";
import { calculateBalloonRequirements } from "@/utils/balloonCalculations";

interface DesignState {
  clientName: string;
  projectName: string;
  width: string;
  height: string;
  colors: string[];
  shape: string;
  imagePreview: string;
  clientReference: string | null;
}

const ProductionForms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const designState = location.state as DesignState;

  const calculateProductionTime = (totalClusters: number) => {
    const minutesPerCluster = 15;
    const totalMinutes = totalClusters * minutesPerCluster;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const productionDetails: Tables<"production_details"> = {
    id: 0,
    client_name: designState?.clientName || "",
    project_name: designState?.projectName || "",
    dimensions_ft: parseInt(designState?.width) || 0,
    width_ft: parseInt(designState?.width) || 1,
    shape: designState?.shape || "Straight",
    colors: designState?.colors || [],
    base_clusters: 10,
    extra_clusters: 5,
    total_clusters: 15,
    littles_quantity: 30,
    grapes_quantity: 20,
    balloons_11in: 150,
    balloons_16in: 50,
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
    production_time: calculateProductionTime(15),
    creation_date: null,
    total_balloons: 200
  };

  const handleFinalizeProduction = async () => {
    const updates = [
      {
        color: "Orange",
        size: "11in",
        quantity: productionDetails.base_clusters,
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