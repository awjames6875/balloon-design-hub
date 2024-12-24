interface ProductionMetricsProps {
  baseClusters: number;
  extraClusters: number;
  totalClusters: number;
  littlesQuantity: number;
  grapesQuantity: number;
  inflationTime: string;
}

export const ProductionMetrics = ({
  baseClusters,
  extraClusters,
  totalClusters,
  littlesQuantity,
  grapesQuantity,
  inflationTime,
}: ProductionMetricsProps) => {
  return (
    <>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Base Clusters</h4>
          <p className="text-muted-foreground">{baseClusters}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Extra Clusters</h4>
          <p className="text-muted-foreground">{extraClusters}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Total Clusters</h4>
          <p className="text-muted-foreground">{totalClusters}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <h4 className="font-semibold mb-1">Littles Quantity</h4>
          <p className="text-muted-foreground">{littlesQuantity}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Grapes Quantity</h4>
          <p className="text-muted-foreground">{grapesQuantity}</p>
        </div>
        <div>
          <h4 className="font-semibold mb-1">Estimated Inflation Time</h4>
          <p className="text-muted-foreground">{inflationTime}</p>
        </div>
      </div>
    </>
  );
};