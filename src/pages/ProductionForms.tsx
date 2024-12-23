import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Home } from "lucide-react";
import { calculateBalloonRequirements } from "@/utils/balloonCalculations";
import { toast } from "sonner";
import { ProductionDetails } from "@/components/production/ProductionDetails";

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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading production details...</p>
      </div>
    );
  }

  if (!calculationResult) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Formula Not Found</h1>
        <p className="mb-4">No formula found for the specified dimensions.</p>
        <Button onClick={() => navigate("/new-design")}>Create New Design</Button>
      </div>
    );
  }

  const productionDetails = {
    project_name: designState.projectName,
    client_name: designState.clientName,
    dimensions_ft: Number(designState.width),
    colors: designState.colors,
    base_clusters: calculationResult.formula.base_clusters,
    extra_clusters: calculationResult.formula.extra_clusters,
    total_clusters: calculationResult.formula.total_clusters,
    littles_quantity: calculationResult.formula.littles_quantity,
    grapes_quantity: calculationResult.formula.grapes_quantity,
    balloons_11in: calculationResult.formula.balloons_11in,
    balloons_16in: calculationResult.formula.balloons_16in,
    accents: calculationResult.formula.accents,
    production_time: "1 hr 15 min", // Example static time
    creation_date: new Date().toISOString(),
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
        <Button onClick={() => {
          // TODO: Implement finalize production workflow
          toast.success("Production finalized!");
        }}>
          Finalize Production
        </Button>
      </div>
    </div>
  );
};

export default ProductionForms;
