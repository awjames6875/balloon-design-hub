
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { BackToHome } from "@/components/BackToHome"
import { AIDesignUpload } from "@/components/design/AIDesignUpload"
import { DesignStateManager } from "@/components/design/DesignStateManager"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import { distributeClustersByColor } from "@/utils/designCalculations"
import type { AIAnalysisData } from "@/utils/designCalculations"
import { Header } from "@/components/Header"

export default function NewDesign() {
  const [designImage, setDesignImage] = useState<string | null>(null)
  const [analysisData, setAnalysisData] = useState<AIAnalysisData | null>(null)
  const navigate = useNavigate()

  const handleImageUploaded = (imagePath: string) => {
    setDesignImage(imagePath)
  }

  const handleAnalysisComplete = (data: AIAnalysisData) => {
    console.log("Analysis data received or updated:", data)
    setAnalysisData(data)
    
    // Update URL with analysis data
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('analysisData', JSON.stringify(data))
    window.history.replaceState(null, '', `?${searchParams.toString()}`)
  }

  const handleProceedToInventory = () => {
    if (!analysisData) {
      toast.error("Please complete the design analysis first")
      return
    }

    // Use the color distribution from the numbered analysis if available
    let colorClusters
    
    if (analysisData.numberedAnalysis) {
      // Create a more accurate color distribution using the actual numbered analysis
      colorClusters = analysisData.numberedAnalysis.clusters.map(cluster => ({
        color: cluster.definedColor,
        baseClusters: Math.ceil(cluster.count * 0.7),
        extraClusters: Math.floor(cluster.count * 0.3)
      }))
    } else {
      // Fallback to even distribution if no numbered analysis
      colorClusters = distributeClustersByColor(analysisData.clusters, analysisData.colors)
    }
    
    const calculations = {
      baseClusters: Math.ceil(analysisData.clusters * 0.7),
      extraClusters: Math.floor(analysisData.clusters * 0.3),
      totalClusters: analysisData.clusters,
      littlesQuantity: analysisData.clusters * 11,
      grapesQuantity: analysisData.clusters * 2,
      balloons11in: analysisData.clusters * 11,
      balloons16in: analysisData.clusters * 2,
      totalBalloons: analysisData.clusters * 13
    }

    console.log("Proceeding to inventory with calculations:", calculations)
    console.log("Color clusters for inventory:", colorClusters)

    // Navigate to inventory page with design data
    navigate("/inventory", {
      state: {
        fromDesign: true,
        designData: {
          clientName: "New Client",
          projectName: "Balloon Design Project",
          length: "10",
          style: "Garland",
          colorClusters,
          calculations,
          designAnalysisId: analysisData.id
        }
      }
    })

    toast.success("Proceeding to inventory check")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/10 to-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <BackToHome />

        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-gray-800">Create New Design</h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              Start by uploading your design image, then specify the requirements below
            </p>
          </div>

          <div className="space-y-8">
            <Card className="p-6 hover:shadow-md transition-shadow">
              <AIDesignUpload 
                onImageUploaded={handleImageUploaded}
                onAnalysisComplete={handleAnalysisComplete}
              />
            </Card>

            {analysisData && (
              <>
                {/* DesignStateManager is now hidden but still processes data */}
                <DesignStateManager analysisData={analysisData} />
                
                <div className="flex justify-end">
                  <Button 
                    onClick={handleProceedToInventory}
                    className="gap-2"
                  >
                    Next: Check Inventory
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
