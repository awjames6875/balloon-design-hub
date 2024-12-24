import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { toast } from "sonner"
import { ProductionDetails } from "@/components/production/ProductionDetails"
import { Tables } from "@/integrations/supabase/types"
import { updateInventoryQuantities } from "@/utils/inventoryUtils"
import { supabase } from "@/integrations/supabase/client"
import { getFormulaForLength } from "@/utils/formulaUtils"

interface DesignState {
  clientName: string
  projectName: string
  length: string
  style: string
  shape: string
  calculations: {
    baseClusters: number
    extraClusters: number
    totalClusters: number
    littlesQuantity: number
    grapesQuantity: number
    balloons11in: number
    balloons16in: number
    totalBalloons: number
  }
  imagePreview: string
  clientReference: string | null
}

const ProductionForms = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const designState = location.state as DesignState
  const [formula, setFormula] = useState<any>(null)

  useEffect(() => {
    const fetchFormula = async () => {
      try {
        const data = await getFormulaForLength(10) // Hardcoded to 10ft for this example
        setFormula(data)
        console.log("Formula for 10ft:", data)
      } catch (error) {
        toast.error("Error fetching formula")
      }
    }

    fetchFormula()
  }, [])

  if (!designState) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Design Specifications</h1>
        <Button onClick={() => navigate("/new-design")}>Create New Design</Button>
      </div>
    )
  }

  const productionDetails: Tables<"production_details"> = {
    id: 0,
    client_name: designState.clientName,
    project_name: designState.projectName,
    dimensions_ft: parseInt(designState.length),
    shape: designState.shape,
    colors: [],
    base_clusters: designState.calculations.baseClusters,
    extra_clusters: designState.calculations.extraClusters,
    total_clusters: designState.calculations.totalClusters,
    littles_quantity: designState.calculations.littlesQuantity,
    grapes_quantity: designState.calculations.grapesQuantity,
    balloons_11in: designState.calculations.balloons11in,
    balloons_16in: designState.calculations.balloons16in,
    total_balloons: designState.calculations.totalBalloons,
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
    production_time: `${Math.floor((designState.calculations.totalClusters * 15) / 60)}h ${(designState.calculations.totalClusters * 15) % 60}m`,
    creation_date: null,
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

      {formula && (
        <div className="mb-8 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Formula for 10ft:</h2>
          <p>Base Clusters: {formula.base_clusters}</p>
          <p>Extra Clusters: {formula.extra_clusters}</p>
          <p>Total Clusters: {formula.total_clusters}</p>
        </div>
      )}

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
  )
}

export default ProductionForms
