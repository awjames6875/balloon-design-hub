import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { ProductionDetails } from "@/components/production/ProductionDetails";
import { Tables } from "@/integrations/supabase/types";
import { updateInventoryQuantities } from "@/utils/inventoryUtils";
import { calculateBalloonRequirements } from "@/utils/balloonCalculations";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      console.log("Fetching formula for length:", designState.length, "and shape:", designState.shape);
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
    base_clusters: balloonFormula.baseClusters,
    extra_clusters: balloonFormula.extraClusters,
    total_clusters: balloonFormula.totalClusters,
    littles_quantity: balloonFormula.littlesQuantity,
    grapes_quantity: balloonFormula.grapesQuantity,
    balloons_11in: balloonFormula.balloons11in,
    balloons_16in: balloonFormula.balloons16in,
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
    production_time: calculateProductionTime(balloonFormula.totalClusters),
    creation_date: null,
    total_balloons: balloonFormula.totalBalloons,
    width_ft: null
  };

  const handleFinalizeProduction = async () => {
    try {
      const { error: productionError } = await supabase
        .from("production_details")
        .insert([productionDetails]);

      if (productionError) {
        console.error("Error saving production details:", productionError);
        toast.error("Failed to save production details");
        return;
      }

      // Update inventory quantities
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
        toast.success("Production finalized and saved successfully!");
        // Optionally navigate to another page or refresh the data
      }
    } catch (error) {
      console.error("Error finalizing production:", error);
      toast.error("Failed to finalize production");
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