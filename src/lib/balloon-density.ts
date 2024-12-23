export interface BalloonDensityData {
  Style: string
  Density: number
}

export const balloonDensityData: BalloonDensityData[] = [
  { Style: "Straight", Density: 0.5 },
  { Style: "Curved", Density: 0.6 },
  { Style: "Cluster", Density: 0.8 },
]

export const calculateRequiredStock = (
  quantity: number,
  style: string,
  width: number,
  height: number
): number => {
  const densityInfo = balloonDensityData.find((item) => item.Style === style)
  const density = densityInfo?.Density || 1
  const area = width * height
  return Math.ceil(area * quantity * density)
}