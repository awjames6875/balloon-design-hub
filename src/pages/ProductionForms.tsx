import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import { toast } from "sonner"
import { ProductionDetails } from "@/components/production/ProductionDetails"
import { supabase } from "@/integrations/supabase/client"

interface DesignState {
  clientName: string
  projectName: string
  width: string
  height: string
  colors: string[]
  imagePreview: string
  clientReference: string | null
}

const ProductionForms = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const designState = location.state as DesignState

  const updateInventory = async (productionDetails: any) => {
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
    ]

    for (const update of updates) {
      const { error } = await supabase
        .from("balloon_inventory")
        .update({ 
          quantity: supabase.raw(`quantity - ${update.quantity}`) 
        })
        .eq("color", update.color)
        .eq("size", update.size)

      if (error) {
        console.error("Error updating inventory:", error)
        toast.error(`Failed to update inventory for ${update.color} ${update.size}`)
        return false
      }
    }

    return true
  }

  const handleFinalizeProduction = async () => {
    if (!calculationResult) {
      toast.error("No production details available")
      return
    }

    const success = await updateInventory(calculationResult)
    
    if (success) {
      toast.success("Production finalized! Inventory updated successfully.")
    }
  }

  if (!designState) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No Design Specifications</h1>
        <p className="mb-4">Please create a new design first.</p>
        <Button onClick={() => navigate("/new-design")}>Create New Design</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-center mb-8">Production Form</h1>

      <ProductionDetails
        details={calculationResult}
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