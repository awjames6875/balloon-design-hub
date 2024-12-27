import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { saveDesignToProduction } from "@/services/productionService"
import { calculateInflationTime } from "@/utils/timeCalculations"
import { ProjectDetails } from "./production/ProjectDetails"
import { BalloonColorTable } from "./production/BalloonColorTable"
import { ProductionMetrics } from "./production/ProductionMetrics"
import { AccessoriesSection } from "@/components/production/AccessoriesSection"
import { useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"

interface ColorCluster {
  color: string
  baseClusters: number
  extraClusters: number
}

interface ProductionSummaryProps {
  clientName: string
  projectName: string
  dimensions: string
  style: string
  colorClusters: ColorCluster[]
  accessories: Array<{ type: string; quantity: number }>
  onFinalize: () => void
  calculations?: {
    baseClusters: number
    extraClusters: number
    totalClusters: number
    littlesQuantity: number
    grapesQuantity: number
    balloons11in: number
    balloons16in: number
    totalBalloons: number
  }
}

export const ProductionSummary = ({
  clientName,
  projectName,
  dimensions,
  style,
  colorClusters,
  accessories,
  onFinalize,
  calculations
}: ProductionSummaryProps) => {
  const navigate = useNavigate()

  const calculateBalloonsPerColor = () => {
    if (!calculations) return [];
    
    const balloonsPerCluster = {
      '11inch': 11,
      '16inch': 2
    };

    return colorClusters.map(cluster => ({
      color: cluster.color,
      balloons11: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['11inch']),
      balloons16: Math.round((cluster.baseClusters + cluster.extraClusters) * balloonsPerCluster['16inch']),
      totalClusters: cluster.baseClusters + cluster.extraClusters
    }));
  };

  const updateInventory = async (balloonsPerColor: Array<{color: string, balloons11: number, balloons16: number}>) => {
    for (const colorData of balloonsPerColor) {
      // Update 11" balloons
      const { data: data11, error: error11 } = await supabase
        .from('balloon_inventory')
        .select('quantity')
        .eq('color', colorData.color)
        .eq('size', '11in')
        .single();

      if (error11) {
        console.error('Error checking 11" balloon inventory:', error11);
        toast.error(`Error checking inventory for ${colorData.color} 11" balloons`);
        return false;
      }

      const newQuantity11 = data11.quantity - colorData.balloons11;
      if (newQuantity11 < 0) {
        toast.error(`Insufficient inventory for ${colorData.color} 11" balloons`);
        return false;
      }

      const { error: updateError11 } = await supabase
        .from('balloon_inventory')
        .update({ quantity: newQuantity11 })
        .eq('color', colorData.color)
        .eq('size', '11in');

      if (updateError11) {
        console.error('Error updating 11" balloon inventory:', updateError11);
        toast.error(`Failed to update inventory for ${colorData.color} 11" balloons`);
        return false;
      }

      // Update 16" balloons
      const { data: data16, error: error16 } = await supabase
        .from('balloon_inventory')
        .select('quantity')
        .eq('color', colorData.color)
        .eq('size', '16in')
        .single();

      if (error16) {
        console.error('Error checking 16" balloon inventory:', error16);
        toast.error(`Error checking inventory for ${colorData.color} 16" balloons`);
        return false;
      }

      const newQuantity16 = data16.quantity - colorData.balloons16;
      if (newQuantity16 < 0) {
        toast.error(`Insufficient inventory for ${colorData.color} 16" balloons`);
        return false;
      }

      const { error: updateError16 } = await supabase
        .from('balloon_inventory')
        .update({ quantity: newQuantity16 })
        .eq('color', colorData.color)
        .eq('size', '16in');

      if (updateError16) {
        console.error('Error updating 16" balloon inventory:', updateError16);
        toast.error(`Failed to update inventory for ${colorData.color} 16" balloons`);
        return false;
      }
    }
    return true;
  };

  const handleFinalize = async () => {
    if (!calculations) {
      toast.error("Missing balloon calculations")
      return
    }

    try {
      const balloonsPerColor = calculateBalloonsPerColor();
      
      // First update inventory
      const inventoryUpdated = await updateInventory(balloonsPerColor);
      if (!inventoryUpdated) {
        return;
      }

      // Then save production details
      await saveDesignToProduction({
        clientName,
        projectName,
        dimensionsFt: parseInt(dimensions),
        colors: colorClusters.map(cluster => cluster.color),
        baseClusters: calculations.baseClusters,
        extraClusters: calculations.extraClusters,
        totalClusters: calculations.totalClusters,
        littlesQuantity: calculations.littlesQuantity,
        grapesQuantity: calculations.grapesQuantity,
        balloons11in: calculations.balloons11in,
        balloons16in: calculations.balloons16in,
        accents: accessories.reduce((acc, curr) => ({
          ...acc,
          [curr.type]: curr.quantity
        }), {}),
        productionTime: calculateInflationTime(calculations.totalClusters),
      })
      
      toast.success("Production details saved and inventory updated successfully!")
      onFinalize()
      navigate("/new-design")
    } catch (error) {
      console.error("Error finalizing production:", error)
      toast.error("Failed to save production details")
    }
  }

  const balloonsByColor = calculateBalloonsPerColor();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Production Summary</h2>

      <ProjectDetails
        clientName={clientName}
        projectName={projectName}
        dimensions={dimensions}
        style={style}
      />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Balloon Requirements by Color</h3>
        <BalloonColorTable
          balloonsByColor={balloonsByColor}
          calculations={calculations}
        />
      </div>

      <ProductionMetrics calculations={calculations} />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Accessories</h3>
        <AccessoriesSection accents={accessories} />
      </div>

      <Button onClick={handleFinalize} className="w-full">
        Finalize Production
      </Button>
    </div>
  )
}