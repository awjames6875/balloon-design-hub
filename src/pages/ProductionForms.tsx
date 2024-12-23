import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { toast } from "sonner";
import { ProductionDetails } from "@/components/production/ProductionDetails";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

interface DesignState {
  clientName: string;
  projectName: string;
  width: string;
  height: string;
  colors: string[];
  imagePreview: string;
  clientReference: string | null;
}

const ProductionForms = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const designState = location.state as DesignState;

  // Create production details from design state
  const productionDetails: Tables<"production_details"> = {
    id: 0, // This will be set by the database
    client_name: designState?.clientName || "",
    project_name: designState?.projectName || "",
    dimensions_ft: parseInt(designState?.width || "0"),
    colors: designState?.colors || [],
    base_clusters: 10, // These values should come from your calculation logic
    extra_clusters: 5,
    total_clusters: 15,
    littles_quantity: 30,
    grapes_quantity: 20,
    balloons_11in: 150,
    balloons_16in: 50,
    accents: {},
    production_time: null,
    creation_date: null
  };

  const updateInventory = async (details: Tables<"production_details">) => {
    const updates = [
      {
        color: "Orange",
        size: "11in",
        quantity: details.base_clusters,
      },
      {
        color: "Wildberry",
        size: "11in",
        quantity: details.extra_clusters,
      },
      {
        color: "Goldenrod",
        size: "16in",
        quantity: details.balloons_16in,
      },
    ];

    for (const update of updates) {
      const { error } = await supabase
        .from("balloon_inventory")
        .update({ 
          quantity: `quantity - ${update.quantity}`
        })
        .eq("color", update.color)
        .eq("size", update.size);

      if (error) {
        console.error("Error updating inventory:", error);
        toast.error(`Failed to update inventory for ${update.color} ${update.size}`);
        return false;
      }
    }

    return true;
  };

  const handleFinalizeProduction = async () => {
    const success = await updateInventory(productionDetails);
    
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