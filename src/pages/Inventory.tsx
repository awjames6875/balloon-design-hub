import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CurrentInventorySection } from "@/components/inventory/CurrentInventorySection"
import { StockAnalyticsSection } from "@/components/inventory/StockAnalyticsSection"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"

export default function Inventory() {
  const location = useLocation()
  const navigate = useNavigate()
  const designData = location.state?.designData
  const fromDesign = location.state?.fromDesign

  const handleProceedToProduction = () => {
    if (designData) {
      navigate("/production-forms", { state: designData })
      toast.success("Proceeding to production form")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <BackToHome />
      
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          {fromDesign && designData && (
            <Button 
              onClick={handleProceedToProduction}
              className="bg-accent hover:bg-accent/90"
            >
              Proceed to Production Form
            </Button>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <CurrentInventorySection />
          <StockAnalyticsSection />
        </div>
      </div>
    </div>
  )
}