import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { DesignState } from "@/types/production"
import { createProductionDetails } from "@/utils/production-utils"
import { saveProductionDetails } from "@/services/production-service"

const ProductionForms = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const designState = location.state?.designData as DesignState | undefined

  useEffect(() => {
    if (!designState) {
      toast.error("No design data found")
      navigate("/")
    }
  }, [designState, navigate])

  if (!designState) {
    return null
  }

  const handleFinalizeProduction = async () => {
    try {
      const productionDetails = createProductionDetails(designState)
      await saveProductionDetails(productionDetails)
      navigate("/completed-projects")
    } catch (error) {
      console.error("Error in production finalization:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Production Form</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">Client Information</h2>
            <p>Client Name: {designState.clientName}</p>
            <p>Project Name: {designState.projectName}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Design Specifications</h2>
            <p>Length: {designState.length} ft</p>
            <p>Style: {designState.style}</p>
            <p>Shape: {designState.shape}</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Balloon Requirements</h2>
            <p>Base Clusters: {designState.calculations.baseClusters}</p>
            <p>Extra Clusters: {designState.calculations.extraClusters}</p>
            <p>Total Clusters: {designState.calculations.totalClusters}</p>
            <p>11" Balloons: {designState.calculations.balloons11in}</p>
            <p>16" Balloons: {designState.calculations.balloons16in}</p>
          </div>

          <button
            onClick={handleFinalizeProduction}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
          >
            Finalize Production
          </button>
        </div>
      </Card>
    </div>
  )
}

export default ProductionForms