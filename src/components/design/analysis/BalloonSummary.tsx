interface BalloonSummaryProps {
  totalBalloons11: number
  totalBalloons16: number
  totalClusters: number
  onUpdate?: (totalClusters: number) => void
}

export const BalloonSummary = ({
  totalBalloons11,
  totalBalloons16,
  totalClusters,
  onUpdate
}: BalloonSummaryProps) => {
  const totalBalloons = totalBalloons11 + totalBalloons16;

  console.log("BalloonSummary received values:", {
    totalBalloons11,
    totalBalloons16,
    totalClusters,
    totalBalloons
  });

  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <h4 className="text-sm font-medium mb-2">Summary</h4>
      <div className="grid grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Clusters</p>
          <p className="text-2xl font-bold" data-testid="total-clusters">
            {totalClusters}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">11" Balloons</p>
          <p className="text-2xl font-bold" data-testid="balloons-11">
            {totalBalloons11}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">16" Balloons</p>
          <p className="text-2xl font-bold" data-testid="balloons-16">
            {totalBalloons16}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Balloons</p>
          <p className="text-2xl font-bold" data-testid="total-balloons">
            {totalBalloons}
          </p>
        </div>
      </div>
    </div>
  )
}