import { calculateInflationTime } from "@/utils/timeCalculations";

interface ProductionMetricsProps {
  calculations?: {
    baseClusters: number;
    extraClusters: number;
    totalClusters: number;
    littlesQuantity: number;
    grapesQuantity: number;
    balloons11in: number;
    balloons16in: number;
  };
}

export const ProductionMetrics = ({ calculations }: ProductionMetricsProps) => {
  if (!calculations) return null;

  const inflationTime = calculateInflationTime(calculations.totalClusters);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Production Details</h3>
      <div className="grid grid-cols-2 gap-4">
        <p><span className="font-semibold">Base Clusters:</span> {calculations.baseClusters}</p>
        <p><span className="font-semibold">Extra Clusters:</span> {calculations.extraClusters}</p>
        <p><span className="font-semibold">Total Clusters:</span> {calculations.totalClusters}</p>
        <p><span className="font-semibold">Littles Quantity:</span> {calculations.littlesQuantity}</p>
        <p><span className="font-semibold">Grapes Quantity:</span> {calculations.grapesQuantity}</p>
        <p><span className="font-semibold">Total 11" Balloons:</span> {calculations.balloons11in}</p>
        <p><span className="font-semibold">Total 16" Balloons:</span> {calculations.balloons16in}</p>
        <p><span className="font-semibold">Estimated Inflation Time:</span> {inflationTime}</p>
      </div>
    </div>
  );
};