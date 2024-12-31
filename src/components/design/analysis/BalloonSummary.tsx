interface BalloonSummaryProps {
  totalBalloons11: number
  totalBalloons16: number
}

export const BalloonSummary = ({
  totalBalloons11,
  totalBalloons16,
}: BalloonSummaryProps) => {
  return (
    <div className="mt-4 p-4 bg-muted rounded-lg">
      <h4 className="text-sm font-medium mb-2">Summary</h4>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Total 11" Balloons Needed</p>
          <p className="text-2xl font-bold">{totalBalloons11}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total 16" Balloons Needed</p>
          <p className="text-2xl font-bold">{totalBalloons16}</p>
        </div>
      </div>
    </div>
  )
}